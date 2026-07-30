// Tools & Technologies — migrations, jobs, config/discovery, IdP & secrets, load testing, profiling
import type { PvQuestion } from '../../types';

export const questions: PvQuestion[] = [
  {
    q: 'How do you manage database migrations with Flyway, Liquibase or Prisma?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Schema changes belong in version control, applied by a tool that records what has run — never by hand and never by <code>hibernate.ddl-auto=update</code>, which will happily drop a column in production. <strong>Flyway</strong> runs ordered, immutable SQL files (<code>V1__init.sql</code>) and tracks them with a checksum, so editing an applied migration fails the build; <strong>Liquibase</strong> describes changesets in XML/YAML with rollback support and database abstraction; <strong>Prisma Migrate</strong> or <strong>TypeORM</strong> do the same in the Node world from a schema file. The senior part is not the tool but the discipline: migrations must be backward compatible because old and new application versions run simultaneously during a rolling deploy, so anything destructive goes through <strong>expand → migrate → contract</strong> across releases, and large tables need index creation that does not lock writes.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Thay đổi schema phải nằm trong version control và được áp bởi một công cụ có ghi lại những gì đã chạy — không làm tay, và cũng đừng dùng <code>hibernate.ddl-auto=update</code>, vì nó có thể vui vẻ xoá mất một cột trên production. <strong>Flyway</strong> chạy các file SQL theo thứ tự và không được sửa lại (<code>V1__init.sql</code>), có lưu checksum nên sửa một migration đã chạy là build fail ngay; <strong>Liquibase</strong> mô tả changeset bằng XML/YAML, hỗ trợ rollback và trừu tượng hoá theo loại database; còn <strong>Prisma Migrate</strong> hay <strong>TypeORM</strong> làm việc tương tự trong thế giới Node từ một file schema. Phần "senior" không nằm ở công cụ mà ở tính kỷ luật: migration phải tương thích ngược, vì trong lúc rolling deploy thì phiên bản cũ và mới của ứng dụng chạy song song — nên mọi thao tác phá hỏng dữ liệu đều phải đi qua ba bước <strong>expand → migrate → contract</strong> trải trên nhiều lần release, và với bảng lớn thì tạo index phải theo cách không chặn ghi.</p></details>
<pre># Flyway layout: immutable, ordered, checksummed
src/main/resources/db/migration/
  V1__create_orders.sql
  V2__add_status_index.sql
  V3__backfill_currency.sql
  R__reporting_view.sql          # repeatable (re-runs when it changes)
# flyway_schema_history: version, checksum, success, installed_on
# Editing V2 after it ran → "Migration checksum mismatch" → correct
# behaviour: add V4 instead. Use \`flyway repair\` only when you truly must.

spring.jpa.hibernate.ddl-auto=validate    # ✅ verify, never generate
spring.flyway.enabled=true                # migrations own the schema</pre>
<pre># The rename that takes three releases (expand → migrate → contract)
R1  ALTER TABLE users ADD COLUMN full_name text;      -- add, nullable
    app writes BOTH name and full_name, reads name
R2  backfill: UPDATE users SET full_name = name WHERE full_name IS NULL;
    app reads full_name, still writes both
R3  app stops using name;  ALTER TABLE users DROP COLUMN name;
# Doing it in one release breaks every pod still running the old version.

# Postgres operations that surprise people (locks!)
CREATE INDEX CONCURRENTLY ...            -- ✅ no write lock (cannot be in a tx)
ALTER TABLE t ADD COLUMN c int;           -- ✅ fast (no default rewrite in 11+)
ALTER TABLE t ADD COLUMN c int NOT NULL DEFAULT 0;  -- ✅ 11+, ⚠ older = rewrite
ALTER TABLE t ALTER COLUMN c TYPE bigint; -- ⚠ full rewrite + ACCESS EXCLUSIVE
ADD CONSTRAINT ... NOT VALID; then VALIDATE CONSTRAINT;  -- ✅ two-step, no lock
SET lock_timeout = '3s';                  -- ✅ fail fast instead of queueing
# A migration that waits for a lock behind a long transaction blocks every
# subsequent query on that table — that is how a "small ALTER" becomes an outage.</pre>
<pre># Practices
- one migration per PR, reviewed like code; never edit an applied file
- run migrations as a separate step (init container / CI job), not from N
  application replicas racing each other (Flyway locks, but keep it simple)
- test migrations on a production-sized copy; time them
- data migrations for millions of rows: batch with LIMIT and sleep, or a
  background job — not one transaction holding locks for 20 minutes
- keep a tested rollback plan; for destructive steps, the plan is "the
  previous release still works", which is exactly why expand/contract wins
- Prisma/TypeORM: commit the generated migration, never run \`db push\` in prod</pre>
<div class="key-point">Version migrations with Flyway/Liquibase/Prisma, set Hibernate to <code>validate</code>, and treat every change as backward compatible: expand → migrate → contract across releases. Know the lock behaviour of your ALTERs, use <code>CONCURRENTLY</code> and <code>lock_timeout</code>, and batch large data migrations.</div>`,
  },
  {
    q: 'How do you run scheduled and background jobs — Quartz, Spring Batch, BullMQ?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Three different problems, three different tools. Simple periodic work in a single instance is <code>@Scheduled</code> or a Kubernetes <strong>CronJob</strong>; the moment you run multiple replicas you need coordination, or every pod fires the same job — that is what <strong>Quartz</strong> with a JDBC job store (or ShedLock, or a database advisory lock) provides. Large data processing with chunking, restartability, and metrics is <strong>Spring Batch</strong>. Event-driven asynchronous work triggered by users — emails, thumbnails, exports — belongs in a queue with workers: <strong>BullMQ</strong>/Redis in Node, or a real broker with Spring's listeners in Java. Whatever the tool, the same properties decide whether it survives: exactly one execution per schedule, idempotent handlers, bounded retries with backoff and a dead-letter destination, visibility (last run, duration, failures), and no unbounded run that outlives a deploy.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Ba bài toán khác nhau thì dùng ba loại công cụ khác nhau. Việc định kỳ đơn giản trên một instance thì dùng <code>@Scheduled</code> hoặc <strong>CronJob</strong> của Kubernetes; nhưng ngay khi chạy nhiều replica thì cần cơ chế phối hợp, nếu không mọi pod đều chạy cùng một job — đó là việc của <strong>Quartz</strong> với job store lưu trong JDBC (hoặc ShedLock, hoặc một advisory lock trong database). Xử lý dữ liệu lớn cần chia lô, chạy lại được từ điểm dừng và có metric thì dùng <strong>Spring Batch</strong>. Còn công việc bất đồng bộ phát sinh từ hành động người dùng — gửi mail, tạo thumbnail, xuất file — thì thuộc về queue kèm worker: <strong>BullMQ</strong>/Redis trong Node, hoặc một broker thật với listener của Spring trong Java. Dù dùng gì thì vẫn là những tính chất sau quyết định nó có sống nổi hay không: mỗi lần lên lịch chỉ chạy đúng một lần, handler idempotent, retry có giới hạn kèm backoff và có nơi chứa message chết, có khả năng quan sát (lần chạy cuối, thời gian chạy, số lỗi), và không có tiến trình chạy vô hạn sống dai hơn cả lần deploy.</p></details>
<pre>// Problem 1: "@Scheduled runs 3 times because we have 3 pods"
@Scheduled(cron = "0 0 2 * * *")
@SchedulerLock(name = "nightlyReconcile", lockAtMostFor = "30m")  // ShedLock
void reconcile() { ... }
// ShedLock/Quartz take a row lock in Postgres/Redis → exactly one runner.
// Alternative: a Kubernetes CronJob (one pod per schedule, by definition)
// which also gives you resource isolation and its own logs:
apiVersion: batch/v1
kind: CronJob
spec:
  schedule: "0 2 * * *"
  concurrencyPolicy: Forbid        # ← do not overlap a slow run
  failedJobsHistoryLimit: 3
  jobTemplate: { spec: { backoffLimit: 2, template: { ... } } }</pre>
<pre>// Problem 2: heavy data processing → Spring Batch
@Bean Job importJob(JobRepository repo, Step step) { ... }
@Bean Step step(...) {
  return new StepBuilder("import", repo)
    .&lt;InputRow, Entity&gt;chunk(500, txManager)      // commit every 500 rows
    .reader(csvReader()).processor(validator()).writer(jpaWriter())
    .faultTolerant().skipLimit(50).skip(ValidationException.class)
    .retry(TransientDataAccessException.class).retryLimit(3)
    .build();
}
// What you get: chunked transactions, restart from the last commit point,
// skip/retry policies, and a job repository you can query for history.
// Do NOT hand-roll this with a while-loop and a 2 GB in-memory list.</pre>
<pre>// Problem 3: user-triggered async work → a queue with workers (BullMQ)
await emailQueue.add('welcome', { userId },
  { jobId: \`welcome:\${userId}\`,          // dedup key → idempotency
    attempts: 5,
    backoff: { type: 'exponential', delay: 2000 },
    removeOnComplete: 1000, removeOnFail: false });   // keep failures visible

new Worker('email', async (job) => { await sendWelcome(job.data.userId); },
  { concurrency: 10, limiter: { max: 100, duration: 1000 } });  // rate limit
// Features you will want: delayed jobs, repeatable jobs, priorities,
// flows (parent/child), and a UI (bull-board) for inspection and retry.

// Cross-cutting rules for ANY background work
idempotent handlers      : a retry must not double-charge or double-send
bounded retries + DLQ    : then alert; silent infinite retries hide bugs
timeouts                 : every external call, and a max job duration
graceful shutdown        : stop accepting, finish or requeue in-flight work
                           within terminationGracePeriodSeconds
observability            : duration, success/failure counters, queue depth
                           and oldest-job age (the real "are we behind?")
no business logic in cron only: a nightly job that is the ONLY way state
                           advances makes every bug a 24-hour feedback loop</pre>
<div class="key-point">Pick by shape: locked <code>@Scheduled</code>/ShedLock or a K8s CronJob for periodic work, Spring Batch for chunked restartable data processing, BullMQ or a broker for user-triggered async tasks. Then make handlers idempotent with dedup keys, bound retries into a DLQ, shut down gracefully, and alert on queue depth and job age.</div>`,
  },
  {
    q: 'How do you manage configuration and service discovery across environments?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>The baseline is the twelve-factor rule: configuration comes from the environment, not from files baked into the artifact, so the same image runs in dev, staging, and production. In Spring that means profiles plus environment variables (which override <code>application.yml</code>), in Node it means <code>process.env</code> validated at startup — and <em>validated</em> matters: fail fast with a clear error if a required variable is missing rather than throwing a null pointer at 3am. Beyond that, config comes from ConfigMaps and Secrets in Kubernetes, or a config server (Spring Cloud Config, Consul, Nacos) when you need dynamic refresh and central auditing. For <strong>service discovery</strong>, Kubernetes DNS makes a registry unnecessary in most cases; Eureka/Consul remain relevant outside Kubernetes or for multi-cluster, and a service mesh takes over discovery plus retries and mTLS when you have one.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mức nền tảng là nguyên tắc twelve-factor: cấu hình đến từ môi trường, không nằm trong file được đóng cứng vào artifact — nhờ vậy cùng một image chạy được ở dev, staging và production. Với Spring thì đó là profile cộng biến môi trường (biến môi trường ghi đè <code>application.yml</code>); với Node thì là <code>process.env</code> nhưng phải được <em>validate</em> ngay khi khởi động — chỗ này quan trọng: thiếu biến bắt buộc thì phải fail ngay với thông báo rõ ràng, chứ đừng để 3 giờ sáng mới nhận một lỗi null. Xa hơn nữa, cấu hình đến từ ConfigMap và Secret trong Kubernetes, hoặc từ một config server (Spring Cloud Config, Consul, Nacos) khi cần refresh động và cần audit tập trung. Về <strong>service discovery</strong>, DNS của Kubernetes khiến phần lớn trường hợp không cần registry riêng; Eureka/Consul vẫn còn giá trị khi chạy ngoài Kubernetes hoặc khi nhiều cluster, còn khi đã có service mesh thì chính mesh lo discovery cùng retry và mTLS.</p></details>
<pre># Spring: precedence (later wins) — know this order
application.yml → application-{profile}.yml → env vars → --args → config server
SPRING_DATASOURCE_URL=...        # relaxed binding: maps to spring.datasource.url
--spring.profiles.active=prod

# Fail fast on bad config
@ConfigurationProperties("payments") @Validated
record PaymentProps(@NotBlank String apiBase, @Min(1) int timeoutMs) {}
// Missing/invalid → the app refuses to start, with the property name.

// Node: validate once, export a typed object
const env = z.object({
  NODE_ENV: z.enum(['development','test','production']),
  DATABASE_URL: z.string().url(),
  STRIPE_SECRET: z.string().min(1),
  PORT: z.coerce.number().default(3000),
}).parse(process.env);      // throws at boot with the offending key
export default env;         // never sprinkle process.env across the codebase</pre>
<pre># Kubernetes: the same image, different config
envFrom:
  - configMapRef: { name: orders-config }     # non-secret settings
  - secretRef:    { name: orders-secrets }    # from Vault/ESO, not git
volumeMounts:
  - { name: config, mountPath: /app/config }  # files when you need reload
# ⚠ env vars do NOT update in a running pod: changing a ConfigMap requires
# a rollout (or use a mounted file + a watcher). Mounted secrets DO update,
# with a delay — but most apps cache them at boot anyway.
# Use a checksum annotation so a ConfigMap change triggers a rollout:
#   annotations: { checksum/config: "{{ sha256 .Values.config }}" }

# Dynamic config / feature flags — a different problem
# Spring Cloud Config + Bus, Consul KV, Nacos, or a flag service
# (LaunchDarkly, Unleash, Flagsmith) for runtime toggles with audit,
# targeting and kill switches. Do NOT redeploy to turn a feature off.</pre>
<pre># Service discovery, decided by platform
Kubernetes            → CoreDNS: http://orders-api.shop.svc.cluster.local
                        (Service = discovery + client-side-free load balancing)
Service mesh          → discovery + retries + timeouts + mTLS + traffic split
Outside Kubernetes    → Consul or Eureka + client-side LB (Spring Cloud
                        LoadBalancer), or an internal DNS/LB pair
Serverless / managed  → the provider's endpoints + IAM
# Anti-patterns: hardcoded IPs/hostnames per environment in code; a
# config file per environment inside the jar; and "discovery" that is
# really a hand-maintained spreadsheet of ports.</pre>
<div class="key-point">One artifact, environment-supplied config, validated at startup so misconfiguration fails fast — ConfigMaps/Secrets in Kubernetes, a config server or flag service when you need runtime changes with audit. For discovery, Kubernetes DNS is usually enough; Consul/Eureka or a mesh cover the rest.</div>`,
  },
  {
    q: 'Keycloak vs Auth0 vs Cognito vs building your own — how do you choose an identity provider?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Almost nobody should build authentication from scratch: an IdP gives you login flows, MFA, social and enterprise federation, token issuance and rotation, session management, password policies, and audit — each of which is weeks of work and a permanent security liability. <strong>Keycloak</strong> is the choice when you need self-hosting for data-residency or cost reasons and are willing to operate it (HA, database, upgrades, realm config as code). <strong>Auth0/Okta</strong> is the choice when you want the best developer experience and enterprise SSO connectors and can accept per-MAU pricing that grows with success. <strong>AWS Cognito</strong> (or Azure AD B2C / Firebase Auth) wins when you are already deep in that cloud and want the cheapest managed option, accepting rougher edges and weaker customization. Build your own only for the narrow case of a simple internal app with no federation requirements — and even then, use the framework's battle-tested pieces.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Gần như không ai nên tự viết hệ thống xác thực từ đầu: một IdP cho bạn sẵn các luồng login, MFA, federation với social và với doanh nghiệp, việc phát và xoay token, quản lý session, chính sách mật khẩu và audit — mỗi thứ trong đó là vài tuần công sức cộng một khoản nợ bảo mật vĩnh viễn. <strong>Keycloak</strong> phù hợp khi bạn cần tự host vì lý do lưu trú dữ liệu hoặc chi phí, và sẵn sàng vận hành nó (HA, database, nâng cấp, cấu hình realm dưới dạng code). <strong>Auth0/Okta</strong> phù hợp khi bạn muốn trải nghiệm lập trình tốt nhất cùng các connector SSO doanh nghiệp, và chấp nhận mức giá theo số người dùng hoạt động — càng thành công thì càng đắt. <strong>AWS Cognito</strong> (hay Azure AD B2C, Firebase Auth) thắng khi bạn đã ở sâu trong cloud đó và muốn phương án managed rẻ nhất, đổi lại là vài chỗ thô ráp và khả năng tuỳ biến yếu hơn. Chỉ nên tự làm trong trường hợp hẹp: một app nội bộ đơn giản, không có yêu cầu federation — và ngay cả khi đó cũng hãy dùng các thành phần đã được kiểm chứng của framework.</p></details>
<pre>                 Keycloak         Auth0/Okta        Cognito          DIY
hosting          self-hosted      SaaS              managed (AWS)    yours
cost             infra + your     per MAU           cheapest managed  "free"
                 time             (grows fast)                        until it isn't
customization    very high        high (Actions)    limited           total
enterprise SSO   SAML/LDAP incl.  best connectors   basic SAML/OIDC   you write it
MFA/passkeys     yes              yes, polished     yes (basic UX)     you write it
ops burden       HIGH (HA, DB,    none              low               HIGHEST
                 upgrades)                                             (forever)
data residency   full control     regions           AWS regions        control
lock-in          low (OIDC std)   medium            high (SDK-shaped)  none
# Whatever you choose, integrate through STANDARDS (OIDC discovery, JWKS,
# authorization code + PKCE) so the provider is replaceable. Wrapping the
# vendor SDK in your own thin auth module is what keeps migration possible.</pre>
<pre>// What you must NOT rebuild yourself
- password hashing + reset flows + breach checks + enumeration-safe replies
- MFA enrolment/recovery, WebAuthn/passkey ceremonies
- OAuth/OIDC endpoints, token signing, JWKS rotation, refresh rotation
- SAML for enterprise customers (signature validation is a CVE minefield)
- session management, device tracking, suspicious-login detection
- audit logs, admin console, user lifecycle (invite, disable, delete)

// What stays YOUR responsibility no matter the provider
- authorization: roles/permissions/tenant scoping and ownership checks
  (the IdP tells you WHO; only you know what they may touch)
- provisioning users into your own tables (map sub → internal user id;
  never key your data on email — people change it)
- token validation in every service (iss, aud, exp, signature via JWKS)
- logout propagation and revocation on ban/password change
- SCIM provisioning if enterprise customers ask for directory sync</pre>
<p><strong>Migration reality check</strong> (a good senior answer): moving IdPs means migrating users and password hashes — Auth0 and Keycloak can import bcrypt hashes, Cognito historically could not without a lazy-migration Lambda, so ask that question <em>before</em> choosing. And run the numbers: an app expecting 500k monthly active users can pay more for authentication than for compute, which is exactly when self-hosted Keycloak starts to look attractive.</p>
<div class="key-point">Buy or self-host an IdP, do not build one: Keycloak for control and cost at scale, Auth0/Okta for DX and enterprise connectors, Cognito/Firebase when the cloud is already chosen. Integrate over OIDC standards so it stays replaceable, and remember authorization, user provisioning, and revocation remain yours.</div>`,
  },
  {
    q: 'How do you load test a system, and what do you look for — k6, JMeter, Gatling?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Load testing is how you find the breaking point before your users do. <strong>k6</strong> (JavaScript scripts, Go engine, CI-friendly) is the modern default; <strong>Gatling</strong> (Scala/Java DSL) and <strong>JMeter</strong> (GUI, huge plugin ecosystem, still common in enterprises) do the same job. The important part is designing the test: use realistic scenarios and think-time rather than a single hammered endpoint, ramp up in stages to find the knee of the curve, and drive from an environment that resembles production — testing against one local container tells you nothing about connection pools or the database. Then read the right numbers: p95/p99 latency and error rate against your SLO, throughput at saturation, and — most importantly — <em>what</em> saturates first: CPU, the DB connection pool, thread pool queueing, GC pauses, or a downstream dependency.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Load test là cách bạn tìm ra điểm sụp của hệ thống trước khi người dùng tìm ra. <strong>k6</strong> (viết script bằng JavaScript, engine Go, dễ đưa vào CI) là lựa chọn mặc định hiện nay; <strong>Gatling</strong> (DSL Scala/Java) và <strong>JMeter</strong> (có GUI, hệ plugin khổng lồ, vẫn rất phổ biến trong doanh nghiệp) cũng làm được việc tương tự. Phần quan trọng là thiết kế bài test: dùng các kịch bản thực tế có think-time thay vì nện vào một endpoint duy nhất, tăng tải theo từng bậc để tìm điểm gãy của đường cong, và bắn tải từ một môi trường giống production — test vào một container ở máy cá nhân thì không nói lên điều gì về connection pool hay về database. Sau đó phải đọc đúng số liệu: p95/p99 và tỉ lệ lỗi so với SLO, throughput ở điểm bão hoà, và quan trọng nhất là <em>thứ gì</em> cạn trước: CPU, connection pool của DB, hàng đợi thread pool, thời gian GC, hay một dependency phía dưới.</p></details>
<pre>// k6: scenarios, thresholds, and stages — thresholds turn a test into a gate
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [                      // find the knee, do not jump to 1000 VUs
    { duration: '2m', target: 50 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 400 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_failed:   ['rate<0.01'],            // < 1% errors
    http_req_duration: ['p(95)<300', 'p(99)<800'],  // matches the SLO
    checks:            ['rate>0.99'],
  },
};
export default function () {
  const res = http.get(\`\${__ENV.BASE}/api/products?page=1\`,
    { headers: { Authorization: \`Bearer \${__ENV.TOKEN}\` } });
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(Math.random() * 3);        // think time — real users pause
}
// k6 run --out experimental-prometheus-rw script.js  → graphs in Grafana</pre>
<pre># Test types, each answering a different question
smoke      : 1-5 users, does it work at all (run on every deploy)
load       : expected peak — does it meet the SLO?
stress     : push past peak — where does it break, and HOW? (graceful
             degradation with 429s, or a cascading collapse?)
soak       : hours at moderate load — memory leaks, connection leaks,
             disk fill, cache growth (the bugs only time reveals)
spike      : instant 10x — autoscaling reaction time, queue absorption
breakpoint : ramp until failure — the number to plan capacity against

# Reading results: correlate the load test with your own dashboards
- latency percentiles per endpoint (averages hide everything)
- errors by type: 5xx vs 429 vs timeouts (429 under stress is SUCCESS)
- saturation: CPU, DB pool wait time, thread pool queue, GC pause time,
  connection counts, Kafka lag
- the coordinated-omission trap: if the client blocks waiting, it stops
  issuing requests and your latency looks better than reality — use an
  open model / constant-arrival-rate executor for realistic pressure</pre>
<pre># Doing it responsibly
- test in a production-like environment with production-like data volume
  (an empty table plus a warm cache lies to you)
- never load test third-party APIs; stub them (WireMock/Mountebank) or
  you will get rate-limited or invoiced
- announce it, or you will be the incident
- keep tests in the repo, run smoke + a short load test in CI, and full
  suites before big releases; track results over time to catch regressions
- profile WHILE loading (async-profiler, JFR, node --prof, py-spy) —
  a load test tells you it is slow, a profiler tells you why</pre>
<div class="key-point">Design realistic staged scenarios with think time, set thresholds so the test is a pass/fail gate, and run against production-like infrastructure. Then look past averages: p95/p99 versus the SLO, error types, and which resource saturates first — and profile during the run to find the actual bottleneck.</div>`,
  },
  {
    q: 'What tools do you use to debug and profile a slow or leaking application?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>I work from evidence, in a fixed order: metrics tell me <em>what</em> is slow and when it started, a trace tells me <em>where</em> the time goes, and only then do I attach a profiler to find the exact code. On the JVM that means <strong>JFR</strong> plus JDK Mission Control or <strong>async-profiler</strong> for CPU and allocation flame graphs, a heap dump analysed in <strong>MAT</strong> for leaks (dominator tree → who holds the retained set), and GC logs for pause and allocation-rate problems. In Node it is <code>--inspect</code> with Chrome DevTools or Clinic for CPU and heap snapshots, comparing two snapshots to see what grew. In the browser it is the Performance and Network panels plus Lighthouse. The habit that matters more than any tool is measuring before and after a change, so you can prove the fix rather than believe it.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Tôi làm theo bằng chứng và theo đúng thứ tự: metric cho biết <em>cái gì</em> chậm và chậm từ lúc nào, trace cho biết thời gian <em>đi đâu</em>, rồi mới gắn profiler để tìm ra đúng đoạn code. Trên JVM thì đó là <strong>JFR</strong> cùng JDK Mission Control, hoặc <strong>async-profiler</strong> để có flame graph về CPU và về cấp phát bộ nhớ; với memory leak thì lấy heap dump rồi phân tích bằng <strong>MAT</strong> (dominator tree để biết ai đang giữ vùng nhớ); còn GC log để soi vấn đề pause và tốc độ cấp phát. Với Node thì dùng <code>--inspect</code> cùng Chrome DevTools hoặc Clinic để xem CPU và heap snapshot, và so sánh hai snapshot để biết cái gì phình lên. Với browser thì dùng panel Performance và Network cộng Lighthouse. Nhưng thói quen quan trọng hơn mọi công cụ là đo trước và đo sau khi sửa, để chứng minh được bản sửa có tác dụng chứ không chỉ tin là có.</p></details>
<pre># JVM — CPU / latency
java -XX:StartFlightRecording=duration=60s,filename=app.jfr -jar app.jar
jcmd &lt;pid&gt; JFR.start duration=60s filename=/tmp/app.jfr   # on a running app
# async-profiler (best flame graphs, low overhead, safepoint-free)
./profiler.sh -d 60 -e cpu -f cpu.html &lt;pid&gt;
./profiler.sh -d 60 -e alloc -f alloc.html &lt;pid&gt;     # allocation pressure
jstack &lt;pid&gt;            # thread dump ×3, 5s apart → find BLOCKED threads
jcmd &lt;pid&gt; Thread.print | grep -A5 "waiting to lock"

# JVM — memory
jcmd &lt;pid&gt; GC.heap_info ; jstat -gcutil &lt;pid&gt; 1s
-Xlog:gc*:file=gc.log   # then GCEasy / GCViewer: pause times, promotion
jcmd &lt;pid&gt; GC.heap_dump /tmp/heap.hprof     # analyse in Eclipse MAT
# MAT workflow: Leak Suspects → Dominator Tree → "Path to GC Roots"
# Classic culprits: unbounded HashMap cache, ThreadLocal not cleared,
# listeners never unregistered, a static list, ClassLoader leaks on redeploy.</pre>
<pre># Node.js
node --inspect=0.0.0.0:9229 app.js      # chrome://inspect → Profiler/Memory
clinic doctor -- node app.js             # diagnoses event loop / GC / I/O
clinic flame -- node app.js              # CPU flame graph
# Heap leak: take snapshot → run traffic → snapshot → "Comparison" view,
# sort by delta → find the retaining path. Usual suspects: caches without
# limits, listeners added per request, closures capturing big objects,
# global arrays "for metrics", unresolved promises holding contexts.
node --heap-prof / --cpu-prof            # write profiles to disk in prod-ish
# Event loop lag is THE Node metric: monitor it (perf_hooks.monitorEventLoopDelay);
# a blocking sync call or a ReDoS regex shows up here first.

# Database (usually the real answer)
EXPLAIN (ANALYZE, BUFFERS) SELECT ...    # is it a seq scan? bad estimate?
pg_stat_statements                        # top queries by total time
# Java: Hibernate statistics / datasource-proxy to catch N+1 in tests
# APM (Datadog/New Relic/Elastic APM) does most of this continuously.</pre>
<pre># The workflow that finds root causes instead of symptoms
1. reproduce and quantify: which endpoint, which percentile, since when
   (a deploy? a data-volume threshold? a traffic change?)
2. trace one slow request end-to-end → which span owns the time
3. if it is in-process → profile CPU/alloc; if it is I/O → look at the
   query plan, pool waits, or the downstream service
4. form a hypothesis, change ONE thing, measure again
5. add a regression guard: a metric, an alert, or a test
# Anti-patterns: adding caches before understanding the cost, bumping
# pool sizes to hide a slow query (queueing moves, not disappears), and
# "optimizing" code that a profiler never showed as hot.</pre>
<div class="key-point">Metrics → traces → profiler, in that order. On the JVM: JFR/async-profiler for CPU and allocations, heap dumps in MAT for leaks, GC logs for pauses. In Node: inspector/clinic profiles, snapshot diffs, and event-loop lag. Always measure before and after so the fix is proven, not assumed.</div>`,
  },
];
