// Interview data: TOOLS & TECHNOLOGIES
// One entry per tool a senior Java/JavaScript engineer is expected to know.
// Each entry: `q` = the tool name, `a` = a plain-language explanation of what
// it is, in English then Vietnamese. Entries are grouped by theme, one file per
// group — add new tools to the matching file (or add a file here and spread it
// into `questions` below).
import type { PvTopic } from '../../types';
import { questions as apiIntegration } from './api-integration';
import { questions as cachingSearch } from './caching-search';
import { questions as devTooling } from './dev-tooling';
import { questions as messaging } from './messaging';
import { questions as observability } from './observability';
import { questions as platform } from './platform';
import { questions as platformServices } from './platform-services';

export const topics: PvTopic[] = [
  {
    id: 'tools-tech',
    name: 'Tools & Technologies',
    icon: '🧰',
    questions: [
      // ──── 0. TOOLS & TECHNOLOGIES SUMMARY — knowledge map ────
      {
        q: 'Tools & Technologies Summary — Knowledge Map',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A thematic map of the tool landscape a senior Java/JavaScript engineer is expected to know — grouped the same way as this topic's question list, so you can scan for gaps before drilling into individual tools.</p></div>
<h3>1. Platform &amp; Infrastructure</h3>
<ul>
<li><strong>Container orchestration</strong>
  <ul>
  <li>Kubernetes (pods, deployments, services, ingress, ConfigMaps/Secrets, HPA)</li>
  <li>Helm (charts, values, releases)</li>
  <li>Kustomize (overlays, patches vs templating)</li>
  </ul>
</li>
<li><strong>Delivery &amp; infrastructure as code</strong>
  <ul>
  <li>ArgoCD (GitOps, sync, drift detection)</li>
  <li>Terraform (providers, state, plan/apply, modules)</li>
  </ul>
</li>
<li><strong>Edge &amp; traffic</strong>
  <ul>
  <li>Nginx (reverse proxy, load balancing, TLS termination, static serving)</li>
  </ul>
</li>
</ul>
<h3>2. Messaging &amp; Streaming</h3>
<ul>
<li>Kafka (topics, partitions, consumer groups, offsets, retention, exactly-once)</li>
<li>RabbitMQ (exchanges, queues, routing keys, acknowledgements, DLQ)</li>
<li>Amazon SQS (standard vs FIFO, visibility timeout, DLQ)</li>
<li>Schema Registry (Avro/Protobuf schemas, compatibility modes)</li>
<li>Debezium (change data capture, outbox pattern)</li>
<li>Cross-cutting: queue vs log semantics, ordering, at-least-once vs exactly-once, idempotent consumers</li>
</ul>
<h3>3. Caching, Search &amp; Storage</h3>
<ul>
<li>Redis (data structures, TTL, eviction policies, pub/sub, distributed locks, persistence)</li>
<li>Memcached (simple key-value, when to prefer over Redis)</li>
<li>Elasticsearch (inverted index, mappings, analyzers, queries vs aggregations)</li>
<li>Object storage: Amazon S3 (buckets, presigned URLs, lifecycle), MinIO (S3-compatible self-hosted)</li>
<li>Cross-cutting: cache-aside, TTL strategy, cache invalidation, hot keys</li>
</ul>
<h3>4. Observability</h3>
<ul>
<li>Metrics: Prometheus (pull model, PromQL, exporters, alerting)</li>
<li>Dashboards: Grafana (data sources, panels, alerts)</li>
<li>Logs: ELK Stack (Elasticsearch, Logstash, Kibana), Loki (label-based log aggregation)</li>
<li>Traces: OpenTelemetry (spans, context propagation, vendor-neutral SDK), Jaeger (distributed tracing UI)</li>
<li>Errors: Sentry (error tracking, release health, source maps)</li>
<li>Cross-cutting: three pillars (metrics/logs/traces), correlation IDs, RED/USE signals</li>
</ul>
<h3>5. API &amp; Integration</h3>
<ul>
<li>Contracts: OpenAPI (Swagger) (spec-first vs code-first, codegen), Protocol Buffers (binary encoding, field numbers, evolution)</li>
<li>Protocols: gRPC (HTTP/2, streaming modes, deadlines), GraphQL (schema, resolvers, N+1, persisted queries)</li>
<li>Real-time: WebSocket (full duplex), Server-Sent Events (one-way push, auto-reconnect)</li>
<li>Eventing out: Webhooks (signatures, retries, idempotency)</li>
<li>Gateway: Kong (routing, plugins, rate limiting, auth)</li>
<li>Testing &amp; exploration: Postman (collections, environments, automated API tests)</li>
</ul>
<h3>6. Platform Services</h3>
<ul>
<li><strong>Database migrations</strong>: Flyway (versioned SQL), Liquibase (changelogs, rollback), Prisma (schema-driven ORM &amp; migrate)</li>
<li><strong>Scheduling &amp; batch</strong>: Quartz Scheduler (cron triggers, clustering), Spring Batch (chunk processing, restartability), BullMQ (Redis-backed job queues for Node)</li>
<li><strong>Service infrastructure</strong>: Consul (service discovery, KV config, health checks)</li>
<li><strong>Identity</strong>: Keycloak (OIDC/SAML, realms, self-hosted SSO), Auth0 (managed identity)</li>
<li><strong>Load testing</strong>: k6 (scriptable JS load tests), JMeter (GUI test plans), Gatling (Scala DSL, high concurrency)</li>
<li><strong>JVM profiling</strong>: VisualVM (heap/CPU sampling), Java Flight Recorder (low-overhead production profiling)</li>
</ul>
<h3>7. Dev Tooling</h3>
<ul>
<li><strong>Build — JVM</strong>: Maven (lifecycle, scopes, BOM), Gradle (tasks, incremental builds, Kotlin DSL)</li>
<li><strong>Package managers — JS</strong>: npm (lockfile, scripts, workspaces), pnpm (content-addressed store, strict node_modules)</li>
<li><strong>Bundlers</strong>: Vite (ESM dev server, Rollup build), webpack (loaders, plugins, code splitting)</li>
<li><strong>Testing — JVM</strong>: JUnit 5, Mockito, Testcontainers</li>
<li><strong>Testing — JS</strong>: Jest, Vitest, Testing Library, MSW (network-level mocking), Playwright (cross-browser E2E)</li>
<li><strong>Code quality</strong>: ESLint (lint rules, flat config), Prettier (formatting), SonarQube (static analysis, quality gates), Husky (git hooks)</li>
</ul>
<div class="key-point">Interviewers rarely ask for tool trivia — they ask "which tool would you pick and why." For each group above, know one tool deeply, its main alternative, and the trade-off that decides between them (e.g., Kafka vs RabbitMQ, Redis vs Memcached, Flyway vs Liquibase, Vite vs webpack).</div>`,
      },
      ...platform,
      ...messaging,
      ...cachingSearch,
      ...observability,
      ...apiIntegration,
      ...platformServices,
      ...devTooling,
    ],
  },
];
