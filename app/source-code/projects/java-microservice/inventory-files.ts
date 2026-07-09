import { file, folder, FsNode } from '../../types';

/**
 * inventory-service — saga participant. Deliberately uses plain JDBC
 * (contrast with JPA elsewhere): the whole business rule is ONE atomic
 * UPDATE statement.
 */

const pom = file(
  'pom.xml',
  `
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <parent>
    <groupId>com.demo</groupId>
    <artifactId>order-platform</artifactId>
    <version>1.0.0</version>
  </parent>

  <artifactId>inventory-service</artifactId>

  <dependencies>
    <!-- Plain JdbcTemplate — no ORM needed for two tables and one UPDATE -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-jdbc</artifactId>
    </dependency>
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.kafka</groupId>
      <artifactId>spring-kafka</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
  </dependencies>
</project>
`,
);

const applicationYml = file(
  'application.yml',
  `
server:
  port: 8083

spring:
  application:
    name: inventory-service

  datasource:
    url: jdbc:postgresql://\${DB_HOST:postgres-inventory}:5432/inventory
    username: demo
    password: demo

  sql:
    init:
      mode: always          # runs schema.sql at startup (demo-sized Flyway)

  kafka:
    bootstrap-servers: \${KAFKA_BOOTSTRAP:kafka:9092}
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
      acks: all
      properties:
        enable.idempotence: true
    consumer:
      group-id: inventory-service
      auto-offset-reset: earliest
      enable-auto-commit: false
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
    listener:
      ack-mode: MANUAL_IMMEDIATE

management:
  endpoints:
    web:
      exposure:
        include: health,info
  endpoint:
    health:
      show-details: always
`,
);

const schemaSql = file(
  'schema.sql',
  `
-- inventory-service schema

CREATE TABLE IF NOT EXISTS inventory_stock (
    sku        VARCHAR(24)  PRIMARY KEY,
    name       VARCHAR(80)  NOT NULL,
    available  INT          NOT NULL CHECK (available >= 0),  -- belt AND suspenders
    reserved   INT          NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- One reservation per order: the UNIQUE constraint on order_id is the
-- idempotency mechanism here — a redelivered ReserveStock command hits
-- ON CONFLICT DO NOTHING instead of double-reserving.
CREATE TABLE IF NOT EXISTS stock_reservations (
    id          VARCHAR(24)  PRIMARY KEY,
    order_id    VARCHAR(24)  NOT NULL UNIQUE,
    sku         VARCHAR(24)  NOT NULL REFERENCES inventory_stock (sku),
    quantity    INT          NOT NULL,
    status      VARCHAR(16)  NOT NULL,   -- RESERVED | REJECTED | RELEASED | CONFIRMED
    reason      VARCHAR(64),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

INSERT INTO inventory_stock (sku, name, available) VALUES
    ('SKU-100', 'Wireless Mouse',      40),
    ('SKU-200', '4K Projector',         5),
    ('SKU-300', 'Mechanical Keyboard', 12)
ON CONFLICT (sku) DO NOTHING;
`,
);

const application = file(
  'InventoryServiceApplication.java',
  `
package com.demo.inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * INVENTORY SERVICE — saga participant that answers ReserveStock /
 * ReleaseStock commands. Its claim to fame is InventoryService.reserve():
 * oversell prevention in a single conditional UPDATE.
 */
@SpringBootApplication
public class InventoryServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(InventoryServiceApplication.class, args);
    }
}
`,
);

const listener = file(
  'InventoryCommandListener.java',
  `
package com.demo.inventory.listener;

import com.demo.inventory.service.InventoryService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

/**
 * Same idempotent-consumer discipline as payment-service, different
 * mechanism: instead of a processed_events table, the UNIQUE(order_id)
 * constraint on stock_reservations acts as the natural dedupe key —
 * a redelivery simply cannot insert a second reservation.
 */
@Component
public class InventoryCommandListener {

    private static final Logger log = LoggerFactory.getLogger(InventoryCommandListener.class);

    private final InventoryService inventoryService;
    private final ObjectMapper json;

    public InventoryCommandListener(InventoryService inventoryService, ObjectMapper json) {
        this.inventoryService = inventoryService;
        this.json = json;
    }

    @KafkaListener(topics = "inventory-commands", groupId = "inventory-service")
    public void onCommand(String message, Acknowledgment ack) throws Exception {
        JsonNode command = json.readTree(message);
        String type = command.get("eventType").asText();
        String orderId = command.get("orderId").asText();

        switch (type) {
            case "ReserveStock" -> inventoryService.reserve(
                    orderId,
                    command.get("sku").asText(),
                    command.get("quantity").asInt());
            case "ReleaseStock" -> inventoryService.release(orderId);
            default -> log.warn("unknown command {} — acking", type);
        }
        ack.acknowledge();
    }
}
`,
);

const service = file(
  'InventoryService.java',
  `
package com.demo.inventory.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Oversell prevention without locks, retries or ORMs:
 *
 *   UPDATE inventory_stock
 *      SET available = available - ?, reserved = reserved + ?
 *    WHERE sku = ? AND available >= ?
 *
 * The database evaluates the WHERE and applies the SET atomically. Two
 * concurrent orders fighting for the last unit? Exactly one UPDATE returns
 * rowcount 1, the other returns 0 and turns into StockRejected. No
 * SELECT-then-UPDATE race, no explicit locking.
 */
@Service
public class InventoryService {

    private static final Logger log = LoggerFactory.getLogger(InventoryService.class);
    private static final String TOPIC_INVENTORY_EVENTS = "inventory-events";

    private final JdbcTemplate jdbc;
    private final KafkaTemplate<String, String> kafka;
    private final ObjectMapper json;

    public InventoryService(JdbcTemplate jdbc, KafkaTemplate<String, String> kafka,
                            ObjectMapper json) {
        this.jdbc = jdbc;
        this.kafka = kafka;
        this.json = json;
    }

    @Transactional
    public void reserve(String orderId, String sku, int quantity) {
        // Idempotency: UNIQUE(order_id) — a redelivered command inserts nothing.
        int fresh = jdbc.update("""
                INSERT INTO stock_reservations (id, order_id, sku, quantity, status)
                VALUES (?, ?, ?, ?, 'PENDING')
                ON CONFLICT (order_id) DO NOTHING
                """, "res-" + UUID.randomUUID().toString().substring(0, 8),
                orderId, sku, quantity);
        if (fresh == 0) {
            log.info("duplicate ReserveStock for {} — already handled", orderId);
            return;
        }

        int updated = jdbc.update("""
                UPDATE inventory_stock
                   SET available = available - ?, reserved = reserved + ?, updated_at = now()
                 WHERE sku = ? AND available >= ?
                """, quantity, quantity, sku, quantity);

        boolean reserved = updated == 1;
        jdbc.update("UPDATE stock_reservations SET status = ?, reason = ? WHERE order_id = ?",
                reserved ? "RESERVED" : "REJECTED",
                reserved ? null : "insufficient_stock",
                orderId);

        publish(orderId, reserved ? "StockReserved" : "StockRejected", sku, quantity);
        log.info("order {}: {} x{} → {}", orderId, sku, quantity,
                reserved ? "RESERVED" : "REJECTED");
    }

    /** Compensating action if a reserved order is cancelled later. */
    @Transactional
    public void release(String orderId) {
        Map<String, Object> reservation = jdbc.queryForMap(
                "SELECT sku, quantity FROM stock_reservations WHERE order_id = ? AND status = 'RESERVED'",
                orderId);
        String sku = (String) reservation.get("sku");
        int quantity = (int) reservation.get("quantity");

        jdbc.update("""
                UPDATE inventory_stock
                   SET available = available + ?, reserved = reserved - ?, updated_at = now()
                 WHERE sku = ?
                """, quantity, quantity, sku);
        jdbc.update("UPDATE stock_reservations SET status = 'RELEASED' WHERE order_id = ?", orderId);

        publish(orderId, "StockReleased", sku, quantity);
    }

    private void publish(String orderId, String eventType, String sku, int quantity) {
        try {
            kafka.send(TOPIC_INVENTORY_EVENTS, orderId, json.writeValueAsString(Map.of(
                    "eventId", UUID.randomUUID().toString(),
                    "eventType", eventType,
                    "orderId", orderId,
                    "sku", sku,
                    "quantity", quantity)));
        } catch (Exception e) {
            throw new IllegalStateException("failed to publish inventory event", e);
        }
    }
}
`,
);

export const INVENTORY_MODULE: FsNode = folder('inventory-service', [
  pom,
  folder('src', [
    folder('main', [
      folder('java', [
        folder('com', [
          folder('demo', [
            folder('inventory', [
              application,
              folder('listener', [listener]),
              folder('service', [service]),
            ]),
          ]),
        ]),
      ]),
      folder('resources', [applicationYml, schemaSql]),
    ]),
  ]),
]);
