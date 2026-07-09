import { file } from '../../types';

/** order-service — the pattern showcase files. */

/* ------------------------------------------------------------------ */
/* Idempotent API                                                      */
/* ------------------------------------------------------------------ */

export const processedRequest = file(
  'ProcessedRequest.java',
  `
package com.demo.order.idempotency;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;

/**
 * Durable idempotency ledger — one row per Idempotency-Key.
 * Redis gives the fast path; this table survives restarts and lets an
 * exact retry replay the original response days later.
 */
@Entity
@Table(name = "processed_requests")
public class ProcessedRequest {

    @Id
    @Column(name = "idempotency_key")
    private String idempotencyKey;

    /** SHA-256 of the request body: same key + different body = client bug. */
    @Column(name = "request_hash", nullable = false)
    private String requestHash;

    @Column(name = "http_status", nullable = false)
    private int httpStatus;

    @Column(name = "response_body", nullable = false)
    private String responseBody;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    protected ProcessedRequest() {
    }

    public ProcessedRequest(String idempotencyKey, String requestHash,
                            int httpStatus, String responseBody) {
        this.idempotencyKey = idempotencyKey;
        this.requestHash = requestHash;
        this.httpStatus = httpStatus;
        this.responseBody = responseBody;
    }

    public String getRequestHash() { return requestHash; }
    public int getHttpStatus() { return httpStatus; }
    public String getResponseBody() { return responseBody; }
}
`,
);

export const processedRequestRepository = file(
  'ProcessedRequestRepository.java',
  `
package com.demo.order.idempotency;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessedRequestRepository extends JpaRepository<ProcessedRequest, String> {
}
`,
);

export const idempotencyService = file(
  'IdempotencyService.java',
  `
package com.demo.order.idempotency;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.HexFormat;
import java.util.Optional;
import java.util.function.Supplier;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * IDEMPOTENCY — "execute this at most once per key, replay the result".
 *
 * Two layers, each covering the other's blind spot:
 *
 *  1. Redis SETNX with a TTL — a fast distributed latch that stops two
 *     CONCURRENT requests with the same key (double-click, client retry
 *     racing the original) from both running the business logic.
 *  2. processed_requests table — the durable record. It survives Redis
 *     restarts and answers "this key was already used, here is the exact
 *     response you got last time".
 *
 * Same key + DIFFERENT payload is a client bug and gets 422, never a replay.
 */
@Service
public class IdempotencyService {

    private static final Duration KEY_TTL = Duration.ofHours(24);

    private final StringRedisTemplate redis;
    private final ProcessedRequestRepository repository;
    private final ObjectMapper objectMapper;

    public IdempotencyService(StringRedisTemplate redis,
                              ProcessedRequestRepository repository,
                              ObjectMapper objectMapper) {
        this.redis = redis;
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    public <B, R> ResponseEntity<R> execute(String key, B requestBody, Supplier<R> action) {
        String hash = sha256(write(requestBody));

        // ---- layer 2 first: did this key already complete a round-trip? ----
        Optional<ProcessedRequest> done = repository.findById(key);
        if (done.isPresent()) {
            requireSamePayload(done.get().getRequestHash(), hash);
            return replay(done.get());
        }

        // ---- layer 1: latch out concurrent duplicates -------------------
        Boolean acquired = redis.opsForValue()
                .setIfAbsent("idem:orders:" + key, hash, KEY_TTL);
        if (Boolean.FALSE.equals(acquired)) {
            String inFlightHash = redis.opsForValue().get("idem:orders:" + key);
            requireSamePayload(inFlightHash, hash);
            // Original request still running: tell the client to retry the
            // SAME request shortly — it will then hit the replay path above.
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "request with this Idempotency-Key is already in progress");
        }

        R result = action.get();

        repository.save(new ProcessedRequest(key, hash,
                HttpStatus.CREATED.value(), write(result)));
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    private void requireSamePayload(String expectedHash, String actualHash) {
        if (expectedHash != null && !expectedHash.equals(actualHash)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY,
                    "Idempotency-Key was already used with a different payload");
        }
    }

    @SuppressWarnings("unchecked")
    private <R> ResponseEntity<R> replay(ProcessedRequest processed) {
        try {
            return ResponseEntity.status(processed.getHttpStatus())
                    .header("Idempotent-Replay", "true")
                    .body((R) objectMapper.readValue(processed.getResponseBody(), Object.class));
        } catch (Exception e) {
            throw new IllegalStateException("stored idempotent response is unreadable", e);
        }
    }

    private String write(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    private static String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(input.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }
}
`,
);

/* ------------------------------------------------------------------ */
/* Transactional outbox                                                */
/* ------------------------------------------------------------------ */

export const outboxEvent = file(
  'OutboxEvent.java',
  `
package com.demo.order.outbox;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/**
 * OUTBOX ROW — an event persisted in the SAME transaction as the business
 * change that caused it. The row id doubles as the eventId consumers use
 * for de-duplication (see payment-service PaymentCommandListener).
 */
@Entity
@Table(name = "outbox_events")
public class OutboxEvent {

    @Id
    private String id;

    @Column(name = "aggregate_type", nullable = false)
    private String aggregateType;

    /** Becomes the Kafka message key → all events of one order stay in order. */
    @Column(name = "aggregate_id", nullable = false)
    private String aggregateId;

    @Column(name = "event_type", nullable = false)
    private String eventType;

    @Column(name = "destination_topic", nullable = false)
    private String destinationTopic;

    @Column(nullable = false, columnDefinition = "jsonb")
    private String payload;

    @Column(nullable = false)
    private String status = "PENDING";

    @Column(name = "occurred_at", nullable = false)
    private Instant occurredAt = Instant.now();

    @Column(name = "published_at")
    private Instant publishedAt;

    protected OutboxEvent() {
    }

    public static OutboxEvent of(String aggregateId, String eventType,
                                 String destinationTopic, String payload) {
        OutboxEvent event = new OutboxEvent();
        event.id = UUID.randomUUID().toString();
        event.aggregateType = "ORDER";
        event.aggregateId = aggregateId;
        event.eventType = eventType;
        event.destinationTopic = destinationTopic;
        event.payload = payload;
        return event;
    }

    public void markPublished() {
        this.status = "PUBLISHED";
        this.publishedAt = Instant.now();
    }

    public String getId() { return id; }
    public String getAggregateId() { return aggregateId; }
    public String getEventType() { return eventType; }
    public String getDestinationTopic() { return destinationTopic; }
    public String getPayload() { return payload; }
}
`,
);

export const outboxRepository = file(
  'OutboxEventRepository.java',
  `
package com.demo.order.outbox;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OutboxEventRepository extends JpaRepository<OutboxEvent, String> {

    /**
     * FOR UPDATE SKIP LOCKED — several order-service replicas can run the
     * relay concurrently: each grabs a disjoint batch, none blocks another,
     * no event is published by two relays at once.
     */
    @Query(value = """
            SELECT * FROM outbox_events
            WHERE status = 'PENDING'
            ORDER BY occurred_at
            LIMIT :batchSize
            FOR UPDATE SKIP LOCKED
            """, nativeQuery = true)
    List<OutboxEvent> lockNextBatch(@Param("batchSize") int batchSize);
}
`,
);

export const outboxRelay = file(
  'OutboxRelay.java',
  `
package com.demo.order.outbox;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * TRANSACTIONAL OUTBOX, part 2 — the relay.
 *
 * Why the pattern exists (the dual-write problem):
 *   @Transactional { saveOrder(); kafka.send(); }   // WRONG
 * The DB commit and the broker publish are two different systems — one can
 * succeed while the other fails, leaving order and event out of sync.
 *
 * With an outbox, the event is committed WITH the order (single ACID
 * transaction), and this relay moves committed rows to Kafka afterwards:
 *
 *   poll PENDING rows (SKIP LOCKED) ──▶ kafka.send(key = aggregateId)
 *        └── mark PUBLISHED in the same transaction as the poll
 *
 * Delivery becomes AT-LEAST-ONCE (a crash between send and commit re-sends
 * the row) — which is exactly why every consumer in this demo de-dupes by
 * eventId. Alternative to polling: change-data-capture with Debezium.
 */
@Component
public class OutboxRelay {

    private static final Logger log = LoggerFactory.getLogger(OutboxRelay.class);

    private final OutboxEventRepository repository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    public OutboxRelay(OutboxEventRepository repository,
                       KafkaTemplate<String, String> kafkaTemplate) {
        this.repository = repository;
        this.kafkaTemplate = kafkaTemplate;
    }

    @Scheduled(fixedDelayString = "\${app.outbox.poll-interval-ms}")
    @Transactional
    public void relayPendingEvents() {
        List<OutboxEvent> batch = repository.lockNextBatch(50);
        for (OutboxEvent event : batch) {
            try {
                // .get() blocks until the broker acks (acks=all) — we only
                // mark PUBLISHED for events Kafka has really accepted.
                kafkaTemplate.send(event.getDestinationTopic(),
                        event.getAggregateId(), event.getPayload()).get();
                event.markPublished();
            } catch (Exception e) {
                // Leave the row PENDING; next poll retries it. If Kafka is
                // down the backlog simply grows — nothing is lost.
                log.warn("outbox publish failed, will retry: {} {}",
                        event.getEventType(), event.getId(), e);
                return;
            }
        }
        if (!batch.isEmpty()) {
            log.info("outbox relay published {} event(s)", batch.size());
        }
    }
}
`,
);

/* ------------------------------------------------------------------ */
/* Order service + saga orchestrator                                   */
/* ------------------------------------------------------------------ */

export const orderService = file(
  'OrderService.java',
  `
package com.demo.order.service;

import com.demo.order.api.dto.CreateOrderRequest;
import com.demo.order.cache.ProductPriceService;
import com.demo.order.domain.Order;
import com.demo.order.domain.OrderStatus;
import com.demo.order.outbox.OutboxEvent;
import com.demo.order.outbox.OutboxEventRepository;
import com.demo.order.repository.OrderRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * Order state machine. Every public method is ONE local transaction that
 * changes the order row AND appends the matching outbox event — the
 * atomic unit the outbox pattern is all about.
 */
@Service
public class OrderService {

    public static final String TOPIC_PAYMENT_COMMANDS = "payment-commands";
    public static final String TOPIC_INVENTORY_COMMANDS = "inventory-commands";
    public static final String TOPIC_ORDER_EVENTS = "order-events";

    private final OrderRepository orders;
    private final OutboxEventRepository outbox;
    private final ProductPriceService prices;
    private final ObjectMapper json;

    public OrderService(OrderRepository orders, OutboxEventRepository outbox,
                        ProductPriceService prices, ObjectMapper json) {
        this.orders = orders;
        this.outbox = outbox;
        this.prices = prices;
        this.json = json;
    }

    @Transactional
    public Order createOrder(String idempotencyKey, CreateOrderRequest request) {
        // Unit price comes from the Redis-backed cache (cache-aside).
        BigDecimal unitPrice = prices.currentPrice(request.sku());

        Order order = Order.newOrder(idempotencyKey, request.customerId(),
                request.sku(), request.quantity(), unitPrice);
        order.transitionTo(OrderStatus.PAYMENT_PENDING);
        orders.save(order);

        // Same transaction as the order INSERT — atomic with the state change.
        appendEvent(order.getId(), "AuthorizePayment", TOPIC_PAYMENT_COMMANDS, Map.of(
                "eventId", UUID.randomUUID().toString(),
                "eventType", "AuthorizePayment",
                "orderId", order.getId(),
                "amount", order.getTotalAmount(),
                "currency", "USD"));
        return order;
    }

    @Transactional
    public void startInventoryReservation(String orderId) {
        Order order = require(orderId);
        order.transitionTo(OrderStatus.INVENTORY_PENDING);
        appendEvent(orderId, "ReserveStock", TOPIC_INVENTORY_COMMANDS, Map.of(
                "eventId", UUID.randomUUID().toString(),
                "eventType", "ReserveStock",
                "orderId", orderId,
                "sku", order.getSku(),
                "quantity", order.getQuantity()));
    }

    @Transactional
    public void confirm(String orderId) {
        Order order = require(orderId);
        order.transitionTo(OrderStatus.CONFIRMED);
        appendEvent(orderId, "OrderConfirmed", TOPIC_ORDER_EVENTS, Map.of(
                "eventId", UUID.randomUUID().toString(),
                "eventType", "OrderConfirmed",
                "orderId", orderId));
    }

    @Transactional
    public void cancelPaymentDeclined(String orderId) {
        // Nothing to compensate: stock was never touched.
        require(orderId).transitionTo(OrderStatus.CANCELLED_PAYMENT_DECLINED);
    }

    /**
     * SAGA COMPENSATION — stock rejected AFTER money was authorized, so we
     * issue the compensating RefundPayment command. Note: compensation is a
     * NEW forward action, not a rollback; the refund is itself a business
     * event that lands in payment_transactions.
     */
    @Transactional
    public void cancelNoStockAndRefund(String orderId) {
        Order order = require(orderId);
        order.transitionTo(OrderStatus.CANCELLED_NO_STOCK);
        appendEvent(orderId, "RefundPayment", TOPIC_PAYMENT_COMMANDS, Map.of(
                "eventId", UUID.randomUUID().toString(),
                "eventType", "RefundPayment",
                "orderId", orderId,
                "amount", order.getTotalAmount()));
    }

    @Transactional(readOnly = true)
    public Order getOrder(String orderId) {
        return require(orderId);
    }

    private Order require(String orderId) {
        return orders.findById(orderId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "order not found: " + orderId));
    }

    private void appendEvent(String orderId, String type, String topic, Map<String, Object> payload) {
        try {
            outbox.save(OutboxEvent.of(orderId, type, topic, json.writeValueAsString(payload)));
        } catch (Exception e) {
            throw new IllegalStateException("failed to serialize outbox payload", e);
        }
    }
}
`,
);

export const sagaOrchestrator = file(
  'OrderSagaOrchestrator.java',
  `
package com.demo.order.saga;

import com.demo.order.service.OrderService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

/**
 * SAGA — a distributed transaction without 2PC.
 *
 * A saga replaces one impossible ACID transaction spanning three databases
 * with a chain of LOCAL transactions, each followed by an event. When a
 * step fails, previous steps are undone by COMPENSATING actions (refund),
 * not by rollback.
 *
 * This is the ORCHESTRATION flavour: one coordinator (this class) listens
 * to reply events and decides the next command. The alternative —
 * choreography — has every service react to the previous service's events
 * directly; simpler for 2 steps, spaghetti for 5.
 *
 *   payment-events ─▶ PaymentAuthorized  → send ReserveStock
 *                     PaymentDeclined    → CANCELLED_PAYMENT_DECLINED
 *   inventory-events ▶ StockReserved     → CONFIRMED
 *                     StockRejected      → RefundPayment + CANCELLED_NO_STOCK
 *
 * Kafka gives us at-least-once delivery, so every handler must tolerate
 * duplicates — Order.transitionTo() ignores events on terminal orders,
 * making each transition naturally idempotent.
 */
@Component
public class OrderSagaOrchestrator {

    private static final Logger log = LoggerFactory.getLogger(OrderSagaOrchestrator.class);

    private final OrderService orderService;
    private final ObjectMapper json;

    public OrderSagaOrchestrator(OrderService orderService, ObjectMapper json) {
        this.orderService = orderService;
        this.json = json;
    }

    @KafkaListener(topics = "payment-events", groupId = "order-saga")
    public void onPaymentEvent(String message) throws Exception {
        JsonNode event = json.readTree(message);
        String orderId = event.get("orderId").asText();
        String type = event.get("eventType").asText();

        switch (type) {
            case "PaymentAuthorized" -> {
                log.info("saga[{}]: payment ok → reserving stock", orderId);
                orderService.startInventoryReservation(orderId);
            }
            case "PaymentDeclined" -> {
                log.info("saga[{}]: payment declined → cancel", orderId);
                orderService.cancelPaymentDeclined(orderId);
            }
            case "PaymentRefunded" ->
                log.info("saga[{}]: compensation confirmed by payment-service", orderId);
            default -> log.debug("saga[{}]: ignoring event {}", orderId, type);
        }
    }

    @KafkaListener(topics = "inventory-events", groupId = "order-saga")
    public void onInventoryEvent(String message) throws Exception {
        JsonNode event = json.readTree(message);
        String orderId = event.get("orderId").asText();
        String type = event.get("eventType").asText();

        switch (type) {
            case "StockReserved" -> {
                log.info("saga[{}]: stock reserved → confirm", orderId);
                orderService.confirm(orderId);
            }
            case "StockRejected" -> {
                log.info("saga[{}]: no stock → refund + cancel (compensation)", orderId);
                orderService.cancelNoStockAndRefund(orderId);
            }
            default -> log.debug("saga[{}]: ignoring event {}", orderId, type);
        }
    }
}
`,
);

/* ------------------------------------------------------------------ */
/* Distributed cache                                                   */
/* ------------------------------------------------------------------ */

export const productPriceService = file(
  'ProductPriceService.java',
  `
package com.demo.order.cache;

import java.math.BigDecimal;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

/**
 * DISTRIBUTED CACHE (cache-aside with Redis).
 *
 * @Cacheable: on a miss, run the method and store the result in Redis under
 * "product-price::<sku>"; on a hit, skip the method entirely. Because the
 * cache lives in Redis — not in the JVM — all order-service replicas share
 * one consistent cache, and a deployment does not start cold.
 *
 * TTL (10 min) lives in RedisCacheConfig: price data may be slightly stale,
 * never wrong forever. Writes evict explicitly (@CacheEvict) instead of
 * waiting for the TTL.
 *
 * Watch out for in production: cache stampedes (many misses of a hot key at
 * once — mitigate with jittered TTLs or a request-coalescing lock).
 */
@Service
public class ProductPriceService {

    private static final Logger log = LoggerFactory.getLogger(ProductPriceService.class);

    /** Stand-in for a slow catalog database / pricing API. */
    private static final Map<String, BigDecimal> CATALOG = Map.of(
            "SKU-100", new BigDecimal("49.90"),   // Wireless Mouse
            "SKU-200", new BigDecimal("8999.00"), // 4K Projector
            "SKU-300", new BigDecimal("149.00")); // Mechanical Keyboard

    @Cacheable(cacheNames = "product-price", key = "#sku")
    public BigDecimal currentPrice(String sku) {
        log.info("cache MISS for {} — hitting the slow catalog", sku);
        simulateSlowLookup();
        BigDecimal price = CATALOG.get(sku);
        if (price == null) {
            throw new IllegalArgumentException("unknown sku: " + sku);
        }
        return price;
    }

    @CacheEvict(cacheNames = "product-price", key = "#sku")
    public void priceChanged(String sku) {
        log.info("price of {} changed — evicting cache entry", sku);
    }

    private void simulateSlowLookup() {
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
`,
);

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

export const kafkaTopicsConfig = file(
  'KafkaTopicsConfig.java',
  `
package com.demo.order.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

/**
 * KAFKA TOPICS — declared in code so environments never drift.
 *
 * Partitions are the unit of parallelism AND of ordering: messages with the
 * same key (we always key by orderId) land in the same partition and are
 * consumed in order — which is what keeps saga steps of one order sequential
 * while different orders process in parallel.
 *
 * replicas(1) is demo-only; production wants 3 with min.insync.replicas=2.
 */
@Configuration
public class KafkaTopicsConfig {

    @Bean
    public NewTopic paymentCommands() {
        return TopicBuilder.name("payment-commands").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic paymentEvents() {
        return TopicBuilder.name("payment-events").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic inventoryCommands() {
        return TopicBuilder.name("inventory-commands").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic inventoryEvents() {
        return TopicBuilder.name("inventory-events").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic orderEvents() {
        return TopicBuilder.name("order-events").partitions(3).replicas(1).build();
    }
}
`,
);

export const redisCacheConfig = file(
  'RedisCacheConfig.java',
  `
package com.demo.order.config;

import java.time.Duration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManagerBuilderCustomizer;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

/**
 * Redis cache tuning. Every cache gets an explicit TTL — an unbounded
 * cache is a memory leak with extra steps. JSON serialization keeps the
 * entries readable with redis-cli (handy while learning/debugging).
 */
@Configuration
public class RedisCacheConfig {

    @Bean
    public RedisCacheManagerBuilderCustomizer cacheCustomizer() {
        return builder -> builder
                .cacheDefaults(cacheConfig(Duration.ofMinutes(5)))
                .withCacheConfiguration("product-price", cacheConfig(Duration.ofMinutes(10)));
    }

    private RedisCacheConfiguration cacheConfig(Duration ttl) {
        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(ttl)
                .serializeValuesWith(RedisSerializationContext.SerializationPair
                        .fromSerializer(new GenericJackson2JsonRedisSerializer()));
    }
}
`,
);

/* ------------------------------------------------------------------ */
/* Health check                                                        */
/* ------------------------------------------------------------------ */

export const kafkaHealthIndicator = file(
  'KafkaHealthIndicator.java',
  `
package com.demo.order.health;

import java.util.Map;
import java.util.concurrent.TimeUnit;
import org.apache.kafka.clients.admin.AdminClient;
import org.apache.kafka.clients.admin.AdminClientConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

/**
 * HEALTH CHECK — custom probe surfaced at /actuator/health as "kafka".
 *
 * Liveness vs readiness (both enabled in application.yml):
 *   - liveness  = "is the process alive?"  → restart the pod if not.
 *   - readiness = "can it serve traffic?"  → pull it out of the LB if not.
 * A Kafka outage belongs to READINESS: restarting the pod would not fix
 * Kafka, so it must not fail liveness.
 *
 * The same idea appears twice more in this repo: docker-compose healthchecks
 * gate service startup, and the gateway's circuit breaker is effectively a
 * per-call health verdict.
 */
@Component("kafka")
public class KafkaHealthIndicator implements HealthIndicator {

    private final String bootstrapServers;

    public KafkaHealthIndicator(@Value("\${spring.kafka.bootstrap-servers}") String bootstrapServers) {
        this.bootstrapServers = bootstrapServers;
    }

    @Override
    public Health health() {
        try (AdminClient admin = AdminClient.create(
                Map.of(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers,
                       AdminClientConfig.REQUEST_TIMEOUT_MS_CONFIG, "2000"))) {

            int nodes = admin.describeCluster().nodes().get(2, TimeUnit.SECONDS).size();
            return Health.up()
                    .withDetail("nodes", nodes)
                    .withDetail("bootstrap", bootstrapServers)
                    .build();
        } catch (Exception e) {
            return Health.down(e).withDetail("bootstrap", bootstrapServers).build();
        }
    }
}
`,
);

/* ------------------------------------------------------------------ */
/* FTP settlement                                                      */
/* ------------------------------------------------------------------ */

export const settlementReportJob = file(
  'SettlementReportJob.java',
  `
package com.demo.order.settlement;

import com.demo.order.domain.Order;
import com.demo.order.domain.OrderStatus;
import com.demo.order.repository.OrderRepository;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.StringJoiner;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * FTP INTEGRATION — the unglamorous pattern that refuses to die.
 *
 * Banks, acquirers and logistics partners still exchange daily batch files
 * over (S)FTP. Every night this job exports yesterday's CONFIRMED orders as
 * CSV and pushes it to the partner server via {@link FtpUploader}.
 *
 * Ops notes baked into the design:
 *   - deterministic file name per day → re-running the job overwrites the
 *     same file: the export itself is idempotent.
 *   - with several replicas, guard the job with a distributed lock
 *     (e.g. ShedLock on Redis: key "lock:settlement:<date>") so only one
 *     instance uploads.
 */
@Component
public class SettlementReportJob {

    private static final Logger log = LoggerFactory.getLogger(SettlementReportJob.class);

    private final OrderRepository orders;
    private final FtpUploader ftp;

    public SettlementReportJob(OrderRepository orders, FtpUploader ftp) {
        this.orders = orders;
        this.ftp = ftp;
    }

    @Scheduled(cron = "\${app.settlement.cron}")
    public void exportDailySettlement() {
        LocalDate day = LocalDate.now(ZoneOffset.UTC).minusDays(1);
        List<Order> confirmed = orders.findByStatusAndCreatedAtBetween(
                OrderStatus.CONFIRMED,
                day.atStartOfDay().toInstant(ZoneOffset.UTC),
                day.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC));

        StringJoiner csv = new StringJoiner("\\n");
        csv.add("order_id,customer_id,sku,quantity,total_amount,confirmed_date");
        for (Order order : confirmed) {
            csv.add(String.join(",",
                    order.getId(), order.getCustomerId(), order.getSku(),
                    String.valueOf(order.getQuantity()),
                    order.getTotalAmount().toPlainString(), day.toString()));
        }

        String fileName = "settlement-" + day + ".csv";
        ftp.upload(fileName, csv.toString().getBytes(StandardCharsets.UTF_8));
        log.info("settlement export done: {} ({} orders)", fileName, confirmed.size());
    }
}
`,
);

export const ftpUploader = file(
  'FtpUploader.java',
  `
package com.demo.order.settlement;

import io.github.resilience4j.retry.annotation.Retry;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * RETRY PATTERN around an FTP upload.
 *
 * The @Retry instance "ftpUpload" (application.yml) gives 4 attempts with
 * exponential backoff (2s → 4s → 8s) plus jitter. Two rules make retries
 * safe here:
 *   1. Only retry what is TRANSIENT (network reset, timeout). A permanent
 *      error like a bad password fails every attempt anyway — so cap the
 *      attempts and escalate.
 *   2. Only retry what is IDEMPOTENT. Uploading the same bytes to the same
 *      name is — thanks to the ".part + rename" trick below, partners never
 *      even see a half-written file.
 */
@Component
public class FtpUploader {

    private static final Logger log = LoggerFactory.getLogger(FtpUploader.class);

    @Value("\${app.settlement.ftp.host}")
    private String host;

    @Value("\${app.settlement.ftp.port}")
    private int port;

    @Value("\${app.settlement.ftp.user}")
    private String user;

    @Value("\${app.settlement.ftp.password}")
    private String password;

    @Value("\${app.settlement.ftp.remote-dir}")
    private String remoteDir;

    @Retry(name = "ftpUpload", fallbackMethod = "uploadFailed")
    public void upload(String fileName, byte[] content) {
        FTPClient client = new FTPClient();
        try {
            client.connect(host, port);
            if (!client.login(user, password)) {
                throw new IllegalStateException("FTP login rejected for user " + user);
            }
            client.enterLocalPassiveMode();          // firewall-friendly
            client.setFileType(FTP.BINARY_FILE_TYPE);
            client.changeWorkingDirectory(remoteDir);

            // Upload under a temp name, then rename: the rename is atomic on
            // the server, so consumers never pick up a partial file.
            String tempName = fileName + ".part";
            try (ByteArrayInputStream in = new ByteArrayInputStream(content)) {
                if (!client.storeFile(tempName, in)) {
                    throw new IOException("storeFile failed: " + client.getReplyString());
                }
            }
            client.rename(tempName, fileName);
            log.info("uploaded {} ({} bytes) to {}:{}{}", fileName, content.length,
                    host, port, remoteDir);
        } catch (IOException e) {
            throw new IllegalStateException("FTP upload failed (will retry)", e);
        } finally {
            try {
                if (client.isConnected()) {
                    client.logout();
                    client.disconnect();
                }
            } catch (IOException ignored) {
                // best-effort cleanup
            }
        }
    }

    /** All retries exhausted — surface loudly; ops re-runs the job later. */
    @SuppressWarnings("unused")
    private void uploadFailed(String fileName, byte[] content, Throwable cause) {
        log.error("settlement upload permanently failed for {} — manual replay needed",
                fileName, cause);
        throw new IllegalStateException("FTP upload exhausted retries: " + fileName, cause);
    }
}
`,
);
