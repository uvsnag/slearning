import { file, folder, FsNode } from '../../types';

/** api-gateway module — Spring Cloud Gateway: routing, rate limit, edge CB. */

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

  <artifactId>api-gateway</artifactId>

  <dependencies>
    <!-- Reactive gateway: routing + filters (rate limiter, retry, CB) -->
    <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
    <!-- RequestRateLimiter stores token buckets in Redis so the limit is
         shared by every gateway instance (a true distributed rate limit). -->
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
    </dependency>
    <!-- CircuitBreaker gateway filter backed by Resilience4j -->
    <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-circuitbreaker-reactor-resilience4j</artifactId>
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
  port: 8080

spring:
  application:
    name: api-gateway
  data:
    redis:
      host: \${SPRING_DATA_REDIS_HOST:localhost}
      port: 6379

  cloud:
    gateway:
      # ---------------------------------------------------------------
      # The gateway is the single entry point. Cross-cutting concerns
      # (auth, rate limiting, resiliency, observability) live HERE so
      # the business services stay small.
      # ---------------------------------------------------------------
      routes:
        - id: orders
          uri: http://order-service:8081
          predicates:
            - Path=/api/orders/**
          filters:
            # --- Rate limiting: Redis token bucket -------------------
            # replenish-rate = steady tokens/sec, burst-capacity = bucket
            # size. Exceeding it returns HTTP 429 Too Many Requests.
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20
                redis-rate-limiter.requestedTokens: 1
                key-resolver: "#{@apiKeyResolver}"
            # --- Circuit breaker: fail fast when orders is down ------
            # After the failure threshold trips, calls short-circuit to
            # the fallback for 30s instead of piling up on a sick service.
            - name: CircuitBreaker
              args:
                name: ordersCircuitBreaker
                fallbackUri: forward:/fallback/orders
            # --- Retry: only idempotent verbs! -----------------------
            # Retrying a POST could create duplicate orders; GETs are
            # safe. (POST safety comes from the Idempotency-Key instead.)
            - name: Retry
              args:
                retries: 3
                methods: GET
                series: SERVER_ERROR
                backoff:
                  firstBackoff: 50ms
                  maxBackoff: 500ms
                  factor: 2

        - id: payments
          uri: http://payment-service:8082
          predicates:
            - Path=/api/payments/**
          filters:
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 20
                redis-rate-limiter.burstCapacity: 40
                key-resolver: "#{@apiKeyResolver}"

resilience4j:
  circuitbreaker:
    instances:
      ordersCircuitBreaker:
        slidingWindowSize: 20
        minimumNumberOfCalls: 10
        failureRateThreshold: 50        # % of failures that opens the circuit
        waitDurationInOpenState: 30s    # how long we stay open before probing
        permittedNumberOfCallsInHalfOpenState: 3
  timelimiter:
    instances:
      ordersCircuitBreaker:
        timeoutDuration: 2s             # slow == failing, from the caller's view

management:
  endpoints:
    web:
      exposure:
        include: health,info,gateway
  endpoint:
    health:
      show-details: always
`,
);

const gatewayApplication = file(
  'GatewayApplication.java',
  `
package com.demo.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * API Gateway — the single front door of the platform.
 *
 * Everything interesting is configuration-driven (see application.yml):
 *   - routing to internal services,
 *   - per-API-key rate limiting (Redis token bucket),
 *   - circuit breaker + fallback so a sick downstream fails fast,
 *   - retry for idempotent GETs only.
 */
@SpringBootApplication
public class GatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
`,
);

const rateLimiterConfig = file(
  'RateLimiterConfig.java',
  `
package com.demo.gateway.config;

import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import reactor.core.publisher.Mono;

/**
 * RATE LIMITING — decides WHO the bucket belongs to.
 *
 * The RequestRateLimiter filter (application.yml) implements a token bucket
 * in Redis. Because the bucket lives in Redis and not in process memory,
 * every gateway replica enforces the same shared limit — that is what makes
 * it a *distributed* rate limit.
 *
 * This KeyResolver picks the bucket key: the X-API-KEY header when present
 * (per-client limits), otherwise the caller IP as a fallback.
 */
@Configuration
public class RateLimiterConfig {

    @Bean
    public KeyResolver apiKeyResolver() {
        return exchange -> {
            String apiKey = exchange.getRequest().getHeaders().getFirst("X-API-KEY");
            if (apiKey != null && !apiKey.isBlank()) {
                return Mono.just("api-key:" + apiKey);
            }
            String ip = exchange.getRequest().getRemoteAddress() != null
                    ? exchange.getRequest().getRemoteAddress().getAddress().getHostAddress()
                    : "unknown";
            return Mono.just("ip:" + ip);
        };
    }
}
`,
);

const fallbackController = file(
  'GatewayFallbackController.java',
  `
package com.demo.gateway.web;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * CIRCUIT BREAKER (edge) — the landing zone when the circuit is OPEN.
 *
 * While order-service is failing, the CircuitBreaker filter forwards here
 * instead of queueing doomed requests. The client gets an immediate,
 * honest 503 with a Retry-After hint — degrade fast, recover politely.
 */
@RestController
public class GatewayFallbackController {

    @RequestMapping("/fallback/orders")
    public ResponseEntity<Map<String, String>> ordersFallback() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .header("Retry-After", "30")
                .body(Map.of(
                        "error", "order-service is temporarily unavailable",
                        "hint", "circuit breaker is open; please retry later"));
    }
}
`,
);

export const GATEWAY_MODULE: FsNode = folder('api-gateway', [
  pom,
  folder('src', [
    folder('main', [
      folder('java', [
        folder('com', [
          folder('demo', [
            folder('gateway', [
              gatewayApplication,
              folder('config', [rateLimiterConfig]),
              folder('web', [fallbackController]),
            ]),
          ]),
        ]),
      ]),
      folder('resources', [applicationYml]),
    ]),
  ]),
]);
