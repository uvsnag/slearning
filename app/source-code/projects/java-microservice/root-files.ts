import { file, FsNode } from '../../types';

/**
 * Repo-root files of the demo: README (the guided tour), docker-compose
 * (infrastructure + container healthchecks) and the Maven parent POM.
 */

const readme = file(
  'README.md',
  `
# Order Processing Platform — Java Microservice Demo

A compact but production-shaped e-commerce backend used to study the core
patterns of distributed systems on the JVM. Four Spring Boot services talk
over **Kafka** and sit behind an **API Gateway**; state lives in
**PostgreSQL**, hot data in **Redis**, and nightly settlement files go out
via **FTP**.

## Services

| Service           | Port | Role                                                    |
|-------------------|------|---------------------------------------------------------|
| api-gateway       | 8080 | Single entry point: routing, rate limit, circuit breaker |
| order-service     | 8081 | Order state machine, saga orchestrator, outbox, FTP job |
| payment-service   | 8082 | Payment authorization/refund, acquirer client            |
| inventory-service | 8083 | Stock reservation with atomic UPDATE (no oversell)       |

Infrastructure: Kafka (KRaft), PostgreSQL x3 (database-per-service),
Redis, FTP server — all wired in \`docker-compose.yml\`.

## Architecture

\`\`\`
                       ┌─────────────┐
   client ──────────▶  │ api-gateway │   rate limit (Redis bucket)
                       │    :8080    │   circuit breaker + retry
                       └──────┬──────┘
                              │ REST
                ┌─────────────▼─────────────┐
                │       order-service        │◀─── Redis (idempotency keys,
                │  saga orchestrator + outbox│      price cache)
                └──┬────────▲────────▲──────┬┘
        payment-   │        │        │      │ nightly CSV
        commands   │  payment-  inventory-  ▼
                   ▼  events    events   [ FTP ]
             ┌──────────┐    ┌───────────────┐
             │ payment- │    │  inventory-   │
             │ service  │    │  service      │
             └──────────┘    └───────────────┘
      (each service owns its own PostgreSQL database)
\`\`\`

## Pattern map — where to look

| Pattern                  | File                                                              |
|--------------------------|-------------------------------------------------------------------|
| API Gateway (routing)    | api-gateway/src/main/resources/application.yml                    |
| Rate limiting            | api-gateway/.../config/RateLimiterConfig.java + application.yml   |
| Circuit breaker (edge)   | api-gateway application.yml + web/GatewayFallbackController.java  |
| Circuit breaker (client) | payment-service/.../client/AcquirerClient.java                    |
| Retry with backoff       | payment-service application.yml, order-service FtpUploader.java   |
| Saga (orchestration)     | order-service/.../saga/OrderSagaOrchestrator.java                 |
| Transactional outbox     | order-service/.../outbox/OutboxRelay.java + V1__init.sql          |
| Idempotent API           | order-service/.../idempotency/IdempotencyService.java             |
| Idempotent consumer      | payment-service/.../listener/PaymentCommandListener.java          |
| Distributed cache        | order-service/.../cache/ProductPriceService.java + RedisCacheConfig |
| Kafka messaging          | order-service/.../config/KafkaTopicsConfig.java                   |
| FTP integration          | order-service/.../settlement/FtpUploader.java                     |
| Health checks            | order-service/.../health/KafkaHealthIndicator.java + compose      |

## The order saga, end to end

Happy path:

1. \`POST /api/orders\` hits the gateway (rate-limited), reaches order-service.
2. order-service validates the \`Idempotency-Key\`, prices the item from the
   Redis cache, saves the order as \`PAYMENT_PENDING\` **and** an
   \`AuthorizePayment\` row in \`outbox_events\` — one local transaction.
3. The outbox relay publishes the command to Kafka topic \`payment-commands\`.
4. payment-service authorizes (idempotent consumer!) and emits
   \`PaymentAuthorized\` on \`payment-events\`.
5. The saga orchestrator advances the order to \`INVENTORY_PENDING\` and
   sends \`ReserveStock\` (again via outbox).
6. inventory-service reserves stock atomically and emits \`StockReserved\`.
7. Orchestrator marks the order \`CONFIRMED\` and publishes \`OrderConfirmed\`.

Compensation path (not enough stock):

- inventory-service emits \`StockRejected\` → orchestrator writes a
  \`RefundPayment\` command (compensating transaction) and the order ends as
  \`CANCELLED_NO_STOCK\`. There is no distributed rollback — only forward
  recovery with compensating actions.

## Run it

\`\`\`
docker compose up --build

# create an order (idempotent):
curl -X POST http://localhost:8080/api/orders \\
  -H "Content-Type: application/json" \\
  -H "X-API-KEY: demo-key-mobile" \\
  -H "Idempotency-Key: idem-7f3a9c1e" \\
  -d '{"customerId":"cust-501","sku":"SKU-100","quantity":2}'

# replay the exact same request: same response, no duplicate order.
\`\`\`

## Things to try

- **Kill Kafka** (\`docker stop kafka\`): new orders stay \`PAYMENT_PENDING\`,
  \`outbox_events\` accumulates \`PENDING\` rows, \`/actuator/health\` goes DOWN.
  Restart Kafka and watch the relay drain the backlog — nothing is lost.
- **Order over 5000** total: acquirer declines → \`CANCELLED_PAYMENT_DECLINED\`.
- **Order more than available stock**: watch the refund compensation land in
  \`payment_transactions\` (type \`REFUND\`).
- **Hammer the gateway** past 10 req/s per API key: HTTP 429 from the
  Redis token bucket.
`,
);

const dockerCompose = file(
  'docker-compose.yml',
  `
# Local infrastructure for the demo.
# Note the healthchecks: 'depends_on: condition: service_healthy' keeps the
# Spring services from racing infra at startup — the same idea the actuator
# probes give you inside Kubernetes.
services:
  kafka:
    image: apache/kafka:3.7.0
    container_name: kafka
    ports:
      - "9092:9092"
    environment:
      KAFKA_NODE_ID: 1
      KAFKA_PROCESS_ROLES: broker,controller
      KAFKA_CONTROLLER_QUORUM_VOTERS: 1@kafka:9093
      KAFKA_LISTENERS: PLAINTEXT://:9092,CONTROLLER://:9093
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
      KAFKA_AUTO_CREATE_TOPICS_ENABLE: "false"   # topics are declared in code
    healthcheck:
      test: ["CMD-SHELL", "/opt/kafka/bin/kafka-topics.sh --bootstrap-server localhost:9092 --list"]
      interval: 10s
      timeout: 5s
      retries: 10

  postgres-orders:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: orders
      POSTGRES_USER: demo
      POSTGRES_PASSWORD: demo
    ports:
      - "5433:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U demo -d orders"]
      interval: 5s
      timeout: 3s
      retries: 10

  postgres-payments:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: payments
      POSTGRES_USER: demo
      POSTGRES_PASSWORD: demo
    ports:
      - "5434:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U demo -d payments"]
      interval: 5s
      timeout: 3s
      retries: 10

  postgres-inventory:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: inventory
      POSTGRES_USER: demo
      POSTGRES_PASSWORD: demo
    ports:
      - "5435:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U demo -d inventory"]
      interval: 5s
      timeout: 3s
      retries: 10

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 10

  ftp:
    image: delfer/alpine-ftp-server
    environment:
      USERS: "demo|demo|/home/demo/settlement"
    ports:
      - "21:21"
      - "21000-21010:21000-21010"

  api-gateway:
    build: ./api-gateway
    ports:
      - "8080:8080"
    depends_on:
      redis:
        condition: service_healthy
    environment:
      SPRING_DATA_REDIS_HOST: redis

  order-service:
    build: ./order-service
    ports:
      - "8081:8081"
    depends_on:
      kafka:
        condition: service_healthy
      postgres-orders:
        condition: service_healthy
      redis:
        condition: service_healthy

  payment-service:
    build: ./payment-service
    ports:
      - "8082:8082"
    depends_on:
      kafka:
        condition: service_healthy
      postgres-payments:
        condition: service_healthy

  inventory-service:
    build: ./inventory-service
    ports:
      - "8083:8083"
    depends_on:
      kafka:
        condition: service_healthy
      postgres-inventory:
        condition: service_healthy
`,
);

const rootPom = file(
  'pom.xml',
  `
<?xml version="1.0" encoding="UTF-8"?>
<!-- Aggregator POM: one repo, four independently deployable services.
     Sharing only the parent (dependency management), never domain code —
     services must be able to evolve and deploy separately. -->
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.3.4</version>
    <relativePath/>
  </parent>

  <groupId>com.demo</groupId>
  <artifactId>order-platform</artifactId>
  <version>1.0.0</version>
  <packaging>pom</packaging>

  <properties>
    <java.version>21</java.version>
    <spring-cloud.version>2023.0.3</spring-cloud.version>
    <resilience4j.version>2.2.0</resilience4j.version>
  </properties>

  <modules>
    <module>api-gateway</module>
    <module>order-service</module>
    <module>payment-service</module>
    <module>inventory-service</module>
  </modules>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-dependencies</artifactId>
        <version>\${spring-cloud.version}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>
</project>
`,
);

export const ROOT_FILES: FsNode[] = [readme, dockerCompose, rootPom];
