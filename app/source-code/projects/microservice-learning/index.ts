import { StudioProject } from '../../types';
import { MS_LEARNING_DATABASES } from './database';
import { PROJECT_ROOT } from './files.generated';

/**
 * Real source imported from G:/SOURCE/microservice-algorithms-parttern-leetcode
 * via scripts/import-studio-project.mjs (see files.generated.ts header for the
 * regenerate command).
 */
export const microserviceLearningProject: StudioProject = {
  id: 'microservice-learning',
  name: 'Microservice Learning Platform — Algorithms, Patterns & LeetCode',
  description:
    'A complete polyglot platform: React frontend behind an API gateway with JWT auth and ' +
    'rate limiting, plus six Spring Boot services — users (PostgreSQL/MyBatis + transactional ' +
    'outbox), auth (JWT + Kafka events), cache (Redis, idempotent consumers, Debezium CDC ' +
    'sync), files (AWS S3 + nightly FTP export), notifications (RabbitMQ) and a learning ' +
    'service packed with algorithms, data structures, design patterns, multithreading, ' +
    'LeetCode solutions and runnable saga/idempotency/outbox-vs-CDC demos. Health checks ' +
    'everywhere. Docs: PROJECT_GUIDE (concepts 1-19) and INTERVIEW_QUESTIONS.',
  tags: [
    'Spring Boot',
    'React',
    'API Gateway',
    'JWT Auth',
    'Rate Limit',
    'Kafka',
    'RabbitMQ',
    'Redis',
    'PostgreSQL',
    'MyBatis',
    'AWS S3',
    'Outbox',
    'Saga',
    'Idempotency',
    'CDC / Debezium',
    'FTP',
    'Health Check',
    'Algorithms',
    'Design Patterns',
    'LeetCode',
    'Multithreading',
    'Docker',
  ],
  root: PROJECT_ROOT,
  databases: MS_LEARNING_DATABASES,
  defaultOpenPaths: [
    'README.md',
    'PROJECT_GUIDE.md',
    'user-service/src/main/java/com/example/userservice/outbox/OutboxRelay.java',
    'learning-service/src/main/java/com/example/learningservice/microservicepattern/SagaOrchestrationDemo.java',
  ],
};
