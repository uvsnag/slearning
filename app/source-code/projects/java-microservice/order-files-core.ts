import { file } from '../../types';

/** order-service — core: build, config, schema, API and domain model. */

export const orderPom = file(
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

  <artifactId>order-service</artifactId>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- Persistence: JPA + Flyway migrations against PostgreSQL -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
      <groupId>org.postgresql</groupId>
      <artifactId>postgresql</artifactId>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>org.flywaydb</groupId>
      <artifactId>flyway-database-postgresql</artifactId>
    </dependency>

    <!-- Kafka: outbox relay publishes, saga orchestrator consumes -->
    <dependency>
      <groupId>org.springframework.kafka</groupId>
      <artifactId>spring-kafka</artifactId>
    </dependency>

    <!-- Redis: idempotency keys + distributed cache -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-cache</artifactId>
    </dependency>

    <!-- Resilience4j: retry with backoff around the FTP upload -->
    <dependency>
      <groupId>io.github.resilience4j</groupId>
      <artifactId>resilience4j-spring-boot3</artifactId>
      <version>\${resilience4j.version}</version>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-aop</artifactId>
    </dependency>

    <!-- FTP client for settlement file export -->
    <dependency>
      <groupId>commons-net</groupId>
      <artifactId>commons-net</artifactId>
      <version>3.11.1</version>
    </dependency>

    <!-- Health checks: /actuator/health with liveness/readiness groups -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
  </dependencies>
</project>
`,
);

export const orderApplicationYml = file(
  'application.yml',
  `
server:
  port: 8081

spring:
  application:
    name: order-service

  datasource:
    url: jdbc:postgresql://\${DB_HOST:postgres-orders}:5432/orders
    username: demo
    password: demo

  jpa:
    hibernate:
      ddl-auto: validate        # schema is owned by Flyway, never by Hibernate
    open-in-view: false

  flyway:
    enabled: true               # migrations in db/migration/V*.sql

  kafka:
    bootstrap-servers: \${KAFKA_BOOTSTRAP:kafka:9092}
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
      acks: all                       # wait for all in-sync replicas
      properties:
        enable.idempotence: true      # broker de-dups producer retries
    consumer:
      group-id: order-saga
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer

  cache:
    type: redis                 # @Cacheable goes to Redis, not local memory
  data:
    redis:
      host: \${REDIS_HOST:redis}
      port: 6379

# Retry with exponential backoff + jitter for the FTP upload.
# Transient network errors deserve a retry; a 4xx-style permanent
# error does not — see FtpUploader.
resilience4j:
  retry:
    instances:
      ftpUpload:
        maxAttempts: 4
        waitDuration: 2s
        enableExponentialBackoff: true
        exponentialBackoffMultiplier: 2
        enableRandomizedWait: true       # jitter: avoid thundering herds
        randomizedWaitFactor: 0.5

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: always
      probes:
        enabled: true           # /actuator/health/liveness + /readiness
  health:
    livenessstate:
      enabled: true
    readinessstate:
      enabled: true

app:
  outbox:
    poll-interval-ms: 500       # relay wake-up period
    batch-size: 50
  settlement:
    cron: "0 30 1 * * *"        # 01:30 every night
    ftp:
      host: \${FTP_HOST:ftp}
      port: 21
      user: demo
      password: demo
      remote-dir: /settlement
`,
);

export const orderInitSql = file(
  'V1__init.sql',
  `
-- =====================================================================
-- order-service schema (owned by Flyway — never edit manually)
-- =====================================================================

CREATE TABLE orders (
    id               VARCHAR(24)   PRIMARY KEY,
    customer_id      VARCHAR(24)   NOT NULL,
    sku              VARCHAR(24)   NOT NULL,
    quantity         INT           NOT NULL CHECK (quantity > 0),
    unit_price       NUMERIC(12,2) NOT NULL,
    total_amount     NUMERIC(12,2) NOT NULL,
    status           VARCHAR(32)   NOT NULL,
    idempotency_key  VARCHAR(64)   NOT NULL UNIQUE,  -- last line of defense
    version          BIGINT        NOT NULL DEFAULT 0, -- optimistic locking
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX idx_orders_status ON orders (status);

-- =====================================================================
-- TRANSACTIONAL OUTBOX
-- Events are written in the SAME transaction as the business change,
-- then a relay publishes them to Kafka. This removes the classic
-- dual-write problem (DB commit succeeds, broker publish fails).
-- =====================================================================
CREATE TABLE outbox_events (
    id                VARCHAR(36)  PRIMARY KEY,          -- also the consumer dedupe key
    aggregate_type    VARCHAR(32)  NOT NULL,             -- 'ORDER'
    aggregate_id      VARCHAR(24)  NOT NULL,             -- kafka message key => per-order ordering
    event_type        VARCHAR(48)  NOT NULL,             -- AuthorizePayment, ReserveStock, ...
    destination_topic VARCHAR(64)  NOT NULL,
    payload           JSONB        NOT NULL,
    status            VARCHAR(16)  NOT NULL DEFAULT 'PENDING',  -- PENDING | PUBLISHED
    occurred_at       TIMESTAMPTZ  NOT NULL DEFAULT now(),
    published_at      TIMESTAMPTZ
);

-- The relay scans PENDING rows in arrival order.
CREATE INDEX idx_outbox_pending ON outbox_events (occurred_at) WHERE status = 'PENDING';

-- =====================================================================
-- IDEMPOTENT API
-- One row per Idempotency-Key: stores the response so an exact retry
-- can be replayed without re-executing the business logic.
-- =====================================================================
CREATE TABLE processed_requests (
    idempotency_key  VARCHAR(64)  PRIMARY KEY,
    request_hash     VARCHAR(64)  NOT NULL,   -- reject same key + different body
    http_status      INT          NOT NULL,
    response_body    TEXT         NOT NULL,
    created_at       TIMESTAMPTZ  NOT NULL DEFAULT now()
);

COMMENT ON TABLE outbox_events IS
  'Transactional outbox: written atomically with business state, drained by OutboxRelay';
COMMENT ON TABLE processed_requests IS
  'Idempotency ledger for POST /api/orders (Idempotency-Key header)';
`,
);

export const orderApplication = file(
  'OrderServiceApplication.java',
  `
package com.demo.order;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * ORDER SERVICE — owner of the order lifecycle and home of most patterns:
 *
 *   - Idempotent API .......... idempotency/IdempotencyService
 *   - Transactional outbox ..... outbox/OutboxRelay
 *   - Saga orchestration ....... saga/OrderSagaOrchestrator
 *   - Distributed cache ........ cache/ProductPriceService
 *   - FTP settlement export .... settlement/SettlementReportJob (+ retry)
 *   - Custom health checks ..... health/KafkaHealthIndicator
 *
 * @EnableScheduling drives the outbox relay and the nightly settlement job;
 * @EnableCaching turns @Cacheable into Redis round-trips.
 */
@SpringBootApplication
@EnableScheduling
@EnableCaching
public class OrderServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}
`,
);

export const orderController = file(
  'OrderController.java',
  `
package com.demo.order.api;

import com.demo.order.api.dto.CreateOrderRequest;
import com.demo.order.api.dto.OrderResponse;
import com.demo.order.idempotency.IdempotencyService;
import com.demo.order.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * IDEMPOTENT API — POST /api/orders.
 *
 * Networks retry, users double-click and gateways time out. The client
 * therefore sends an Idempotency-Key header (any unique string, e.g. a
 * UUID minted per checkout attempt). Retrying the SAME request replays
 * the stored response instead of creating a second order.
 *
 * The interesting logic is in {@link IdempotencyService}.
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final IdempotencyService idempotencyService;

    public OrderController(OrderService orderService, IdempotencyService idempotencyService) {
        this.orderService = orderService;
        this.idempotencyService = idempotencyService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(
            @RequestHeader("Idempotency-Key") String idempotencyKey,
            @Valid @RequestBody CreateOrderRequest request) {

        return idempotencyService.execute(idempotencyKey, request,
                () -> OrderResponse.from(orderService.createOrder(idempotencyKey, request)));
    }

    @GetMapping("/{orderId}")
    public OrderResponse get(@PathVariable String orderId) {
        // GET is naturally idempotent — no key needed, gateway may retry it.
        return OrderResponse.from(orderService.getOrder(orderId));
    }
}
`,
);

export const createOrderRequest = file(
  'CreateOrderRequest.java',
  `
package com.demo.order.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

/** Inbound payload for POST /api/orders. Price is looked up server-side. */
public record CreateOrderRequest(
        @NotBlank String customerId,
        @NotBlank String sku,
        @Min(1) @Max(1000) int quantity) {
}
`,
);

export const orderResponse = file(
  'OrderResponse.java',
  `
package com.demo.order.api.dto;

import com.demo.order.domain.Order;
import java.math.BigDecimal;
import java.time.Instant;

/** API view of an order. The saga advances 'status' asynchronously. */
public record OrderResponse(
        String orderId,
        String customerId,
        String sku,
        int quantity,
        BigDecimal totalAmount,
        String status,
        Instant createdAt) {

    public static OrderResponse from(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getCustomerId(),
                order.getSku(),
                order.getQuantity(),
                order.getTotalAmount(),
                order.getStatus().name(),
                order.getCreatedAt());
    }
}
`,
);

export const orderEntity = file(
  'Order.java',
  `
package com.demo.order.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Order aggregate. Saga steps mutate {@link OrderStatus} one hop at a time;
 * the @Version column makes concurrent updates fail fast (optimistic locking)
 * instead of silently overwriting each other.
 */
@Entity
@Table(name = "orders")
public class Order {

    @Id
    private String id;

    @Column(name = "customer_id", nullable = false)
    private String customerId;

    @Column(nullable = false)
    private String sku;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "unit_price", nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @Column(name = "idempotency_key", nullable = false, unique = true)
    private String idempotencyKey;

    @Version
    private long version;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Order() {
        // JPA only
    }

    public static Order newOrder(String idempotencyKey, String customerId,
                                 String sku, int quantity, BigDecimal unitPrice) {
        Order order = new Order();
        order.id = "ord-" + UUID.randomUUID().toString().substring(0, 8);
        order.idempotencyKey = idempotencyKey;
        order.customerId = customerId;
        order.sku = sku;
        order.quantity = quantity;
        order.unitPrice = unitPrice;
        order.totalAmount = unitPrice.multiply(BigDecimal.valueOf(quantity));
        order.status = OrderStatus.NEW;
        return order;
    }

    public void transitionTo(OrderStatus next) {
        if (this.status.isTerminal()) {
            // Saga events are at-least-once: a duplicate event must not
            // resurrect a finished order. Ignoring is the idempotent move.
            return;
        }
        this.status = next;
    }

    @PrePersist
    void onCreate() {
        createdAt = updatedAt = Instant.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public String getId() { return id; }
    public String getCustomerId() { return customerId; }
    public String getSku() { return sku; }
    public int getQuantity() { return quantity; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public OrderStatus getStatus() { return status; }
    public String getIdempotencyKey() { return idempotencyKey; }
    public Instant getCreatedAt() { return createdAt; }
}
`,
);

export const orderStatus = file(
  'OrderStatus.java',
  `
package com.demo.order.domain;

/**
 * The order saga as a state machine. Every transition is caused either by
 * the initial API call or by an event consumed from Kafka:
 *
 *   NEW ──▶ PAYMENT_PENDING ──▶ INVENTORY_PENDING ──▶ CONFIRMED
 *                 │                     │
 *                 ▼ PaymentDeclined     ▼ StockRejected (+ RefundPayment!)
 *   CANCELLED_PAYMENT_DECLINED   CANCELLED_NO_STOCK
 */
public enum OrderStatus {

    /** Just created, nothing published yet. */
    NEW,

    /** AuthorizePayment command written to the outbox; waiting for payment-events. */
    PAYMENT_PENDING,

    /** Payment OK; ReserveStock command sent, waiting for inventory-events. */
    INVENTORY_PENDING,

    /** Saga finished successfully. */
    CONFIRMED,

    /** Terminal: acquirer said no. Nothing to compensate (no stock touched). */
    CANCELLED_PAYMENT_DECLINED,

    /** Terminal: stock missing AFTER payment — compensated with RefundPayment. */
    CANCELLED_NO_STOCK;

    public boolean isTerminal() {
        return this == CONFIRMED
                || this == CANCELLED_PAYMENT_DECLINED
                || this == CANCELLED_NO_STOCK;
    }
}
`,
);

export const orderRepository = file(
  'OrderRepository.java',
  `
package com.demo.order.repository;

import com.demo.order.domain.Order;
import com.demo.order.domain.OrderStatus;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, String> {

    Optional<Order> findByIdempotencyKey(String idempotencyKey);

    /** Used by the nightly settlement export. */
    List<Order> findByStatusAndCreatedAtBetween(OrderStatus status, Instant from, Instant to);
}
`,
);
