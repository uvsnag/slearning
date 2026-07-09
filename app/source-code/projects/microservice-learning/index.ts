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
    'rate limiting, plus six Spring Boot services — users (PostgreSQL/MyBatis), auth (JWT + ' +
    'Kafka events), cache (Redis fed by Kafka & RabbitMQ), files (AWS S3), notifications ' +
    '(RabbitMQ) and a learning service packed with algorithms, data structures, design ' +
    'patterns, multithreading demos and LeetCode solutions. Includes docs: PROJECT_GUIDE and ' +
    'INTERVIEW_QUESTIONS.',
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
    'learning-service/src/main/java/com/example/learningservice/leetcode/slidingwindow/SlidingWindowProblems.java',
  ],
};
