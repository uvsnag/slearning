import { folder, StudioProject } from '../../types';
import { JAVA_MICROSERVICE_DATABASES } from './database';
import { GATEWAY_MODULE } from './gateway-files';
import { INVENTORY_MODULE } from './inventory-files';
import {
  createOrderRequest,
  orderApplication,
  orderApplicationYml,
  orderController,
  orderEntity,
  orderInitSql,
  orderPom,
  orderRepository,
  orderResponse,
  orderStatus,
} from './order-files-core';
import {
  ftpUploader,
  idempotencyService,
  kafkaHealthIndicator,
  kafkaTopicsConfig,
  outboxEvent,
  outboxRelay,
  outboxRepository,
  orderService,
  processedRequest,
  processedRequestRepository,
  productPriceService,
  redisCacheConfig,
  sagaOrchestrator,
  settlementReportJob,
} from './order-files-patterns';
import { PAYMENT_MODULE } from './payment-files';
import { ROOT_FILES } from './root-files';

const ORDER_MODULE = folder('order-service', [
  orderPom,
  folder('src', [
    folder('main', [
      folder('java', [
        folder('com', [
          folder('demo', [
            folder('order', [
              orderApplication,
              folder('api', [orderController, folder('dto', [createOrderRequest, orderResponse])]),
              folder('cache', [productPriceService]),
              folder('config', [kafkaTopicsConfig, redisCacheConfig]),
              folder('domain', [orderEntity, orderStatus]),
              folder('health', [kafkaHealthIndicator]),
              folder('idempotency', [
                idempotencyService,
                processedRequest,
                processedRequestRepository,
              ]),
              folder('outbox', [outboxEvent, outboxRepository, outboxRelay]),
              folder('repository', [orderRepository]),
              folder('saga', [sagaOrchestrator]),
              folder('service', [orderService]),
              folder('settlement', [settlementReportJob, ftpUploader]),
            ]),
          ]),
        ]),
      ]),
      folder('resources', [
        orderApplicationYml,
        folder('db', [folder('migration', [orderInitSql])]),
      ]),
    ]),
  ]),
]);

export const javaMicroserviceProject: StudioProject = {
  id: 'java-microservice',
  name: 'Java Microservice — Order Platform',
  description:
    'An order-processing platform of four Spring Boot services showing the essential ' +
    'distributed-system patterns: API gateway with rate limiting, Kafka messaging, saga ' +
    'orchestration with compensation, transactional outbox, idempotent API + consumers, ' +
    'circuit breaker & retry, Redis distributed cache, FTP settlement export and health checks. ' +
    'Open the Database view to trace the same story through the tables.',
  tags: [
    'Spring Boot',
    'Kafka',
    'API Gateway',
    'Rate Limit',
    'Circuit Breaker',
    'Retry',
    'Saga',
    'Outbox',
    'Idempotency',
    'Redis Cache',
    'FTP',
    'Health Check',
    'PostgreSQL',
  ],
  // folders first, then root files — the way VS Code sorts the explorer
  root: [GATEWAY_MODULE, INVENTORY_MODULE, ORDER_MODULE, PAYMENT_MODULE, ...ROOT_FILES],
  databases: JAVA_MICROSERVICE_DATABASES,
  defaultOpenPaths: [
    'README.md',
    'order-service/src/main/java/com/demo/order/saga/OrderSagaOrchestrator.java',
    'order-service/src/main/java/com/demo/order/outbox/OutboxRelay.java',
  ],
};
