import { file, folder, FsNode } from '../../types';

/** payment-service — idempotent consumer, circuit breaker + retry to the PSP. */

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

  <artifactId>payment-service</artifactId>

  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
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
      <groupId>org.springframework.kafka</groupId>
      <artifactId>spring-kafka</artifactId>
    </dependency>

    <!-- Circuit breaker + retry + time limiter around the acquirer call -->
    <dependency>
      <groupId>io.github.resilience4j</groupId>
      <artifactId>resilience4j-spring-boot3</artifactId>
      <version>\${resilience4j.version}</version>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-aop</artifactId>
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
  port: 8082

spring:
  application:
    name: payment-service

  datasource:
    url: jdbc:postgresql://\${DB_HOST:postgres-payments}:5432/payments
    username: demo
    password: demo

  jpa:
    hibernate:
      ddl-auto: update      # demo convenience — real services use Flyway
    open-in-view: false

  kafka:
    bootstrap-servers: \${KAFKA_BOOTSTRAP:kafka:9092}
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
      acks: all
      properties:
        enable.idempotence: true
    consumer:
      group-id: payment-service
      auto-offset-reset: earliest
      enable-auto-commit: false     # offsets are committed only after the
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
    listener:
      ack-mode: MANUAL_IMMEDIATE    # ...listener acks explicitly (see listener)

resilience4j:
  # CIRCUIT BREAKER for the external acquirer (PSP). Counts the last 20
  # calls; if >50% failed (or >80% were slower than 2s) the circuit OPENS:
  # calls fail immediately for 30s, giving the PSP room to recover, then a
  # few HALF-OPEN probes decide whether to close again.
  circuitbreaker:
    instances:
      acquirer:
        slidingWindowSize: 20
        minimumNumberOfCalls: 10
        failureRateThreshold: 50
        slowCallDurationThreshold: 2s
        slowCallRateThreshold: 80
        waitDurationInOpenState: 30s
        permittedNumberOfCallsInHalfOpenState: 3

  # RETRY sits INSIDE the breaker: 3 quick attempts with exponential
  # backoff + jitter. Only transient faults are retried.
  retry:
    instances:
      acquirer:
        maxAttempts: 3
        waitDuration: 300ms
        enableExponentialBackoff: true
        exponentialBackoffMultiplier: 2
        enableRandomizedWait: true
        randomizedWaitFactor: 0.4
        retryExceptions:
          - java.io.IOException
          - java.util.concurrent.TimeoutException

management:
  endpoints:
    web:
      exposure:
        include: health,info,circuitbreakers
  endpoint:
    health:
      show-details: always

app:
  acquirer:
    # deterministic demo rule: totals above this limit are declined
    decline-over: 5000.00
`,
);

const application = file(
  'PaymentServiceApplication.java',
  `
package com.demo.payment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * PAYMENT SERVICE — saga participant.
 *
 * Consumes commands from 'payment-commands' (idempotently!), talks to the
 * external acquirer behind a circuit breaker + retry, and answers on
 * 'payment-events' for the orchestrator in order-service.
 */
@SpringBootApplication
public class PaymentServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PaymentServiceApplication.class, args);
    }
}
`,
);

const paymentTransaction = file(
  'PaymentTransaction.java',
  `
package com.demo.payment.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Money movements ledger. Note that a refund is a NEW row referencing the
 * original AUTH (ref_transaction_id) — financial records are append-only,
 * a compensation never deletes or rewrites history.
 */
@Entity
@Table(name = "payment_transactions")
public class PaymentTransaction {

    @Id
    private String id;

    @Column(name = "order_id", nullable = false)
    private String orderId;

    /** AUTH or REFUND */
    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private BigDecimal amount;

    /** AUTHORIZED | DECLINED | COMPLETED */
    @Column(nullable = false)
    private String status;

    @Column
    private String reason;

    @Column(name = "ref_transaction_id")
    private String refTransactionId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    protected PaymentTransaction() {
    }

    public static PaymentTransaction auth(String orderId, BigDecimal amount,
                                          String status, String reason) {
        PaymentTransaction tx = new PaymentTransaction();
        tx.id = "pay-" + UUID.randomUUID().toString().substring(0, 8);
        tx.orderId = orderId;
        tx.type = "AUTH";
        tx.amount = amount;
        tx.status = status;
        tx.reason = reason;
        return tx;
    }

    public static PaymentTransaction refund(String orderId, BigDecimal amount, String refId) {
        PaymentTransaction tx = new PaymentTransaction();
        tx.id = "pay-" + UUID.randomUUID().toString().substring(0, 8);
        tx.orderId = orderId;
        tx.type = "REFUND";
        tx.amount = amount;
        tx.status = "COMPLETED";
        tx.refTransactionId = refId;
        return tx;
    }

    public String getId() { return id; }
    public String getOrderId() { return orderId; }
    public String getStatus() { return status; }
    public BigDecimal getAmount() { return amount; }
}
`,
);

const processedEvent = file(
  'ProcessedEvent.java',
  `
package com.demo.payment.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

/**
 * IDEMPOTENT CONSUMER ledger — every handled eventId gets a row here,
 * inside the SAME transaction as the business change it caused.
 * A redelivered event finds its id and is skipped.
 */
@Entity
@Table(name = "processed_events")
public class ProcessedEvent {

    @Id
    @Column(name = "event_id")
    private String eventId;

    @Column(name = "consumed_at", nullable = false)
    private Instant consumedAt = Instant.now();

    protected ProcessedEvent() {
    }

    public ProcessedEvent(String eventId) {
        this.eventId = eventId;
    }
}
`,
);

const repositories = file(
  'PaymentTransactionRepository.java',
  `
package com.demo.payment.repository;

import com.demo.payment.domain.PaymentTransaction;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, String> {

    /** Finds the original AUTH a refund should reference. */
    Optional<PaymentTransaction> findFirstByOrderIdAndTypeAndStatus(
            String orderId, String type, String status);
}
`,
);

const processedEventRepository = file(
  'ProcessedEventRepository.java',
  `
package com.demo.payment.repository;

import com.demo.payment.domain.ProcessedEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessedEventRepository extends JpaRepository<ProcessedEvent, String> {
}
`,
);

const listener = file(
  'PaymentCommandListener.java',
  `
package com.demo.payment.listener;

import com.demo.payment.repository.ProcessedEventRepository;
import com.demo.payment.domain.ProcessedEvent;
import com.demo.payment.service.PaymentService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * IDEMPOTENT CONSUMER — the receiving half of at-least-once delivery.
 *
 * The outbox relay may deliver the same command twice (crash after send,
 * before marking PUBLISHED; consumer crash after processing, before the
 * offset commit; plain rebalances). Charging a card twice is not an option,
 * so:
 *
 *   1. look up eventId in processed_events → seen? just ack and move on.
 *   2. do the business change AND insert the processed_events row in ONE
 *      local transaction — they land together or not at all.
 *   3. ack the Kafka offset only after the transaction commits.
 *
 * If step 3 never happens, the redelivery hits step 1. Poison messages
 * (unparseable payloads) should go to a dead-letter topic after a few
 * failures — see spring-kafka's @RetryableTopic for the production version.
 */
@Component
public class PaymentCommandListener {

    private static final Logger log = LoggerFactory.getLogger(PaymentCommandListener.class);

    private final PaymentService paymentService;
    private final ProcessedEventRepository processedEvents;
    private final ObjectMapper json;

    public PaymentCommandListener(PaymentService paymentService,
                                  ProcessedEventRepository processedEvents,
                                  ObjectMapper json) {
        this.paymentService = paymentService;
        this.processedEvents = processedEvents;
        this.json = json;
    }

    @KafkaListener(topics = "payment-commands", groupId = "payment-service")
    @Transactional
    public void onCommand(String message, Acknowledgment ack) throws Exception {
        JsonNode command = json.readTree(message);
        String eventId = command.get("eventId").asText();
        String type = command.get("eventType").asText();
        String orderId = command.get("orderId").asText();

        if (processedEvents.existsById(eventId)) {
            log.info("duplicate delivery of {} ({}) — skipping", eventId, type);
            ack.acknowledge();
            return;
        }

        switch (type) {
            case "AuthorizePayment" -> paymentService.authorize(
                    orderId, new BigDecimal(command.get("amount").asText()));
            case "RefundPayment" -> paymentService.refund(
                    orderId, new BigDecimal(command.get("amount").asText()));
            default -> log.warn("unknown command type {} — acking to avoid a poison loop", type);
        }

        // Same transaction as the business change above.
        processedEvents.save(new ProcessedEvent(eventId));
        ack.acknowledge();
    }
}
`,
);

const service = file(
  'PaymentService.java',
  `
package com.demo.payment.service;

import com.demo.payment.client.AcquirerClient;
import com.demo.payment.domain.PaymentTransaction;
import com.demo.payment.repository.PaymentTransactionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

/**
 * Authorization + refund. The acquirer call is protected by the circuit
 * breaker in {@link AcquirerClient}; the decision is persisted and the
 * reply event published for the saga orchestrator.
 *
 * NOTE for the reader: replies are sent with a direct KafkaTemplate.send()
 * to keep this service short. Production code would use its own outbox
 * table exactly like order-service does — the dual-write problem applies
 * on this side too.
 */
@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);
    private static final String TOPIC_PAYMENT_EVENTS = "payment-events";

    private final AcquirerClient acquirer;
    private final PaymentTransactionRepository transactions;
    private final KafkaTemplate<String, String> kafka;
    private final ObjectMapper json;

    public PaymentService(AcquirerClient acquirer,
                          PaymentTransactionRepository transactions,
                          KafkaTemplate<String, String> kafka,
                          ObjectMapper json) {
        this.acquirer = acquirer;
        this.transactions = transactions;
        this.kafka = kafka;
        this.json = json;
    }

    public void authorize(String orderId, BigDecimal amount) {
        AcquirerClient.Decision decision = acquirer.authorize(orderId, amount);

        PaymentTransaction tx = PaymentTransaction.auth(
                orderId, amount,
                decision.approved() ? "AUTHORIZED" : "DECLINED",
                decision.reason());
        transactions.save(tx);

        publish(orderId, Map.of(
                "eventId", UUID.randomUUID().toString(),
                "eventType", decision.approved() ? "PaymentAuthorized" : "PaymentDeclined",
                "orderId", orderId,
                "transactionId", tx.getId(),
                "reason", decision.reason() == null ? "" : decision.reason()));
        log.info("payment {} for order {}: {}", tx.getId(), orderId, tx.getStatus());
    }

    /** Compensating action of the saga — see OrderSagaOrchestrator. */
    public void refund(String orderId, BigDecimal amount) {
        String refId = transactions
                .findFirstByOrderIdAndTypeAndStatus(orderId, "AUTH", "AUTHORIZED")
                .map(PaymentTransaction::getId)
                .orElse(null);

        PaymentTransaction refund = PaymentTransaction.refund(orderId, amount, refId);
        transactions.save(refund);

        publish(orderId, Map.of(
                "eventId", UUID.randomUUID().toString(),
                "eventType", "PaymentRefunded",
                "orderId", orderId,
                "transactionId", refund.getId()));
        log.info("refund {} for order {} (ref {})", refund.getId(), orderId, refId);
    }

    private void publish(String key, Map<String, Object> payload) {
        try {
            kafka.send(TOPIC_PAYMENT_EVENTS, key, json.writeValueAsString(payload));
        } catch (Exception e) {
            throw new IllegalStateException("failed to publish payment event", e);
        }
    }
}
`,
);

const acquirerClient = file(
  'AcquirerClient.java',
  `
package com.demo.payment.client;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import java.math.BigDecimal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * CIRCUIT BREAKER + RETRY — the classic combo around a flaky third party.
 *
 * Order of protection for a call (configured in application.yml):
 *
 *   caller ──▶ CircuitBreaker("acquirer") ──▶ Retry("acquirer") ──▶ PSP
 *
 *  - RETRY absorbs the occasional transient blip (3 attempts, exponential
 *    backoff 300ms → 600ms → 1200ms, with jitter so a fleet of instances
 *    does not retry in lock-step).
 *  - The CIRCUIT BREAKER watches the failure/slow-call rate across the last
 *    20 calls. When the PSP is truly down, retrying only makes it worse —
 *    the breaker OPENS and calls fail in microseconds instead of piling up
 *    threads on timeouts (fail fast). After 30s it lets 3 probes through
 *    (HALF-OPEN) and closes again if they succeed.
 *  - The fallback maps "breaker is open" to a domain outcome the saga can
 *    handle deterministically.
 *
 * The demo simulates the PSP in-process so the compose stack stays small;
 * the resilience annotations work identically over a real HTTP client.
 */
@Component
public class AcquirerClient {

    private static final Logger log = LoggerFactory.getLogger(AcquirerClient.class);

    /** approved + optional decline reason */
    public record Decision(boolean approved, String reason) {
        static Decision approvedNow() { return new Decision(true, null); }
        static Decision declined(String reason) { return new Decision(false, reason); }
    }

    private final BigDecimal declineOver;

    public AcquirerClient(@Value("\${app.acquirer.decline-over}") BigDecimal declineOver) {
        this.declineOver = declineOver;
    }

    @CircuitBreaker(name = "acquirer", fallbackMethod = "acquirerUnavailable")
    @Retry(name = "acquirer")
    public Decision authorize(String orderId, BigDecimal amount) {
        simulateNetworkLatency();
        // Deterministic demo rule instead of a real PSP round-trip:
        if (amount.compareTo(declineOver) > 0) {
            return Decision.declined("amount_over_limit");
        }
        return Decision.approvedNow();
    }

    /**
     * Fallback when retries are exhausted or the circuit is OPEN.
     * We deliberately DECLINE (safe, reversible by re-ordering) rather than
     * approve blindly. Real systems may instead park the command in a
     * retry/DLT topic and keep the order in PAYMENT_PENDING.
     */
    @SuppressWarnings("unused")
    private Decision acquirerUnavailable(String orderId, BigDecimal amount, Throwable cause) {
        log.warn("acquirer unavailable for order {} — declining defensively: {}",
                orderId, cause.toString());
        return Decision.declined("acquirer_unavailable");
    }

    private void simulateNetworkLatency() {
        try {
            Thread.sleep(50);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
`,
);

export const PAYMENT_MODULE: FsNode = folder('payment-service', [
  pom,
  folder('src', [
    folder('main', [
      folder('java', [
        folder('com', [
          folder('demo', [
            folder('payment', [
              application,
              folder('client', [acquirerClient]),
              folder('domain', [paymentTransaction, processedEvent]),
              folder('listener', [listener]),
              folder('repository', [repositories, processedEventRepository]),
              folder('service', [service]),
            ]),
          ]),
        ]),
      ]),
      folder('resources', [applicationYml]),
    ]),
  ]),
]);
