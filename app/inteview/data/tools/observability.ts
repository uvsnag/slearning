// Tools & Technologies — logs, metrics, traces, Sentry, Prometheus, OpenTelemetry
import type { PvQuestion } from '../../types';

export const questions: PvQuestion[] = [
  {
    q: 'What are the three pillars of observability, and which tools cover each?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>Monitoring answers "is it broken?", observability answers "why?", and it rests on three complementary signals. <strong>Metrics</strong> are cheap numeric time series — request rate, error rate, latency percentiles, queue depth — perfect for dashboards and alerts but with no per-request detail (Prometheus + Grafana, Micrometer, Datadog). <strong>Logs</strong> are discrete structured events with full context, ideal for forensics but expensive at volume (ELK/OpenSearch, Loki, CloudWatch). <strong>Traces</strong> follow one request across services with timing per span, which is the only practical way to find "which of the eleven calls made this slow" (OpenTelemetry + Jaeger/Tempo/Zipkin). Add <strong>error tracking</strong> (Sentry) as the fourth practical signal. The thing that makes them useful together is correlation: one trace id in every log line and on every error.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Monitoring trả lời câu "có đang lỗi không?", còn observability trả lời câu "vì sao lỗi?", và nó dựa trên ba loại tín hiệu bổ trợ nhau. <strong>Metrics</strong> là các chuỗi số theo thời gian, rất nhẹ — số request, tỉ lệ lỗi, percentile độ trễ, độ sâu queue — rất hợp để làm dashboard và cảnh báo, nhưng không có chi tiết của từng request (Prometheus + Grafana, Micrometer, Datadog). <strong>Logs</strong> là các sự kiện rời rạc có cấu trúc và đầy đủ ngữ cảnh, hợp cho việc điều tra nhưng tốn kém khi khối lượng lớn (ELK/OpenSearch, Loki, CloudWatch). <strong>Traces</strong> theo dấu một request đi qua nhiều service kèm thời gian của từng span — đây là cách khả thi duy nhất để biết "trong mười một lời gọi thì cái nào làm chậm" (OpenTelemetry + Jaeger/Tempo/Zipkin). Thêm <strong>error tracking</strong> (Sentry) là tín hiệu thứ tư rất thực dụng. Thứ khiến cả ba trở nên hữu ích khi dùng chung là sự tương quan: mỗi dòng log và mỗi lỗi đều phải mang cùng một trace id.</p></details>
<pre>Signal   Cost      Cardinality   Answers                     Tools
metrics  very low  LOW (careful) "how many / how slow / how   Prometheus,
                                  much, over time"            Grafana, Micrometer
logs     high      unlimited     "what exactly happened to    ELK/OpenSearch,
                                  this request"                Loki, Vector
traces   medium    per request   "where did the time go       OpenTelemetry +
                                  across services"             Jaeger/Tempo
errors   low       grouped       "what is broken, for whom,   Sentry
                                  since which release"

// The golden signals to alert on (Google SRE): latency, traffic, errors,
// saturation — plus queue lag for async systems.
// RED for services (Rate, Errors, Duration), USE for resources
// (Utilisation, Saturation, Errors).</pre>
<pre>// Correlation is the whole game: one id, everywhere
// Spring Boot 3 (Micrometer Tracing) / OpenTelemetry auto-instrumentation
// puts traceId + spanId into MDC → include them in the log pattern:
logging.pattern.level=%5p [\${spring.application.name},%X{traceId},%X{spanId}]
// Node: pino + OpenTelemetry
logger.info({ traceId: span.spanContext().traceId, orderId }, 'order paid');
// Sentry: Sentry.setContext / setTag with the traceId and release
// → from an alert you jump: metric spike → trace → logs of that request
//   → the Sentry issue with the stack trace. That path is what you are
//   really building.</pre>
<p><strong>Common mistakes:</strong> logging everything at INFO and paying more for logs than for compute; putting high-cardinality values (user id, order id, URL with ids) into metric <em>labels</em>, which explodes Prometheus memory — those belong in logs and traces; alerting on CPU instead of user-visible symptoms; and having no correlation id, which forces engineers to grep across services by timestamp during an incident.</p>
<div class="key-point">Metrics for trends and alerts, logs for detail, traces for cross-service latency, error tracking for triage — glued together by a trace id in every log line and error. Keep cardinality out of metrics and symptoms (not resources) in your alerts.</div>`,
  },
  {
    q: 'How do Prometheus and Grafana work, and what should you actually instrument?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Prometheus is a pull-based time-series database: your service exposes a <code>/metrics</code> endpoint, Prometheus scrapes it every 15–30 seconds, stores samples with labels, and you query with PromQL; Grafana is the visualization layer and Alertmanager handles routing and silencing. There are four metric types with distinct purposes — <strong>counter</strong> (monotonic total, always query it with <code>rate()</code>), <strong>gauge</strong> (a value that goes up and down), <strong>histogram</strong> (bucketed observations that allow server-side percentiles and aggregation), and <strong>summary</strong> (client-side quantiles that cannot be aggregated). In practice I instrument the RED signals per endpoint, business events that matter (orders placed, payments failed), resource saturation (pool usage, queue lag, GC), and I keep labels low-cardinality: method, route <em>template</em>, status class — never user or entity ids.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Prometheus là một time-series database hoạt động theo kiểu pull: service của bạn expose endpoint <code>/metrics</code>, Prometheus scrape mỗi 15–30 giây, lưu các mẫu kèm label, và bạn truy vấn bằng PromQL; Grafana là tầng hiển thị, còn Alertmanager lo việc định tuyến và tạm tắt cảnh báo. Có bốn loại metric với mục đích khác nhau — <strong>counter</strong> (tổng chỉ tăng, luôn phải truy vấn qua <code>rate()</code>), <strong>gauge</strong> (giá trị lên xuống), <strong>histogram</strong> (chia bucket, nhờ đó tính được percentile ở phía server và cộng gộp được), và <strong>summary</strong> (quantile tính ở client, không cộng gộp được). Thực tế tôi luôn đo bộ tín hiệu RED cho từng endpoint, các sự kiện nghiệp vụ quan trọng (đơn được tạo, thanh toán thất bại), mức bão hòa tài nguyên (mức dùng connection pool, độ trễ queue, GC), và giữ label ở mức cardinality thấp: method, mẫu route, nhóm status — tuyệt đối không đưa user id hay id của bản ghi vào label.</p></details>
<pre># The scrape model
service:/actuator/prometheus  ←── Prometheus (every 15s) ──→ TSDB
                                    │
                              Grafana (PromQL)   Alertmanager → Slack/PagerDuty
# Pull means: no metric is lost if the collector restarts, and an
# unreachable target is itself a signal (up == 0). For short-lived jobs
# use the Pushgateway instead.

# The four types
http_requests_total{route="/api/orders",method="POST",status="500"}  COUNTER
jvm_memory_used_bytes{area="heap"}                                  GAUGE
http_server_requests_seconds_bucket{le="0.25"}                      HISTOGRAM
# summary → quantiles computed in-process; you CANNOT average p99s across
# instances, which is why histograms win in distributed systems.</pre>
<pre># PromQL you will actually write
rate(http_requests_total[5m])                          # throughput
sum(rate(http_requests_total{status=~"5.."}[5m]))
  / sum(rate(http_requests_total[5m]))                 # error ratio (SLI)
histogram_quantile(0.95,
  sum by (le,route) (rate(http_server_requests_seconds_bucket[5m])))  # p95
sum(kafka_consumergroup_lag) by (group)                # async health
# ⚠ a counter needs rate()/increase(); graphing the raw counter is
#   the most common beginner mistake (it only ever goes up).

# Alerting on symptoms, with a burn-rate style rule
- alert: HighErrorRate
  expr: sum(rate(http_requests_total{status=~"5.."}[5m]))
      / sum(rate(http_requests_total[5m])) > 0.02
  for: 10m            # "for" prevents flapping pages
  labels: { severity: page }
  annotations: { runbook: "https://wiki/runbooks/high-error-rate" }</pre>
<pre>// Instrumenting an app
// Java: Spring Boot + Micrometer → /actuator/prometheus for free
management.endpoints.web.exposure.include=health,info,prometheus
@Timed("checkout.duration") public Order checkout(...) { }
meterRegistry.counter("orders.placed", "channel", channel).increment();
// Node: prom-client
const httpDuration = new Histogram({ name: 'http_request_duration_seconds',
  labelNames: ['method','route','status'],
  buckets: [0.05,0.1,0.25,0.5,1,2,5] });   // pick buckets around your SLO
// ❌ labelNames: ['userId'] or ['url'] with ids → cardinality explosion
//    (each unique label combination is a separate time series)</pre>
<div class="key-point">Prometheus scrapes labelled time series and PromQL turns counters into rates and histograms into percentiles. Instrument RED per route plus business and saturation metrics, choose histogram buckets around your SLO, keep labels low-cardinality, and alert on user-visible symptoms with a <code>for</code> duration and a runbook link.</div>`,
  },
  {
    q: 'What does Sentry give you that logs do not, and how do you set it up well?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>Sentry is error tracking: instead of a stack trace buried in a log file, you get <em>grouped</em> issues with a count of affected users, the full stack trace with source-mapped frames and local variables, breadcrumbs of what happened before the failure, the release and commit that introduced it, and a regression alert if a resolved issue comes back. That is the difference between "there were 40,000 errors last night" and "one bug in <code>CartTotal</code>, released at 18:12, hit 312 users". Setting it up well means uploading source maps or mapping files during the build, tagging every event with a release version and environment, scrubbing PII before it leaves the process, configuring sampling so you can afford it, and grouping deliberately with fingerprints so one noisy issue does not shadow everything else.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Sentry là công cụ theo dõi lỗi: thay vì một stack trace chìm trong file log, bạn nhận được các issue đã được <em>gom nhóm</em>, kèm số người dùng bị ảnh hưởng, stack trace đầy đủ đã map lại về source gốc cùng giá trị biến cục bộ, chuỗi breadcrumb những gì xảy ra trước khi lỗi, release và commit nào gây ra nó, và cảnh báo nếu một issue đã đóng bị lặp lại. Đó là khác biệt giữa "đêm qua có 40.000 lỗi" và "một bug trong <code>CartTotal</code>, phát hành lúc 18:12, ảnh hưởng 312 người dùng". Muốn cấu hình tốt thì phải: upload source map (hoặc mapping file) trong lúc build, gắn tag release và environment cho mọi event, lọc bỏ dữ liệu cá nhân trước khi gửi đi, đặt tỉ lệ sampling để chi phí ở mức chịu được, và chủ động gom nhóm bằng fingerprint để một issue ồn ào không che mất những cái khác.</p></details>
<pre>// Node / Next.js
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.APP_ENV,          // prod / staging — separate them
  release: process.env.GIT_SHA,              // ← enables "introduced in"
  tracesSampleRate: 0.1,                     // performance traces: sample!
  sampleRate: 1.0,                           // errors: usually keep all
  beforeSend(event) {                        // scrub before it leaves
    delete event.request?.cookies;
    if (event.request?.headers) delete event.request.headers.authorization;
    return isNoise(event) ? null : event;    // drop known noise
  },
});
// Build step (critical): upload source maps, then DELETE them from the
// public bundle output — otherwise you ship your source to the browser.
sentry-cli sourcemaps upload --release "\$GIT_SHA" ./.next

// Java / Spring Boot
sentry.dsn=... ; sentry.release=\${GIT_SHA} ; sentry.environment=prod
sentry.traces-sample-rate=0.1
// Logback appender forwards ERROR level; MDC (traceId, userId) becomes tags</pre>
<pre>// What makes issues actionable
Sentry.setUser({ id: user.id });          // NOT email/name if PII matters
Sentry.setTag('tenant', tenantId);        // filterable
Sentry.setContext('order', { id, itemCount });   // structured extra data
Sentry.addBreadcrumb({ category: 'cart', message: 'coupon applied' });

// Grouping: by default stack-trace based. Override when it is wrong:
Sentry.captureException(err, { fingerprint: ['payment', provider, code] });
// → 200 different messages from one provider collapse into one issue

// Hygiene that keeps it useful
- ignoreErrors: browser-extension noise, ResizeObserver loops, network
  aborts from users closing tabs
- alert rules: "new issue in prod", "issue affecting > 50 users",
  "regression" → Slack; do NOT page on every new issue
- link commits (GitHub integration) → suspect commit + suggested assignee
- resolve in the next release, and let Sentry reopen it if it recurs</pre>
<p><strong>How it fits with the rest:</strong> Sentry is not a replacement for logs, metrics, or tracing — it is the triage front door. Metrics tell you the error rate rose, Sentry tells you which exception and which release, traces tell you where the time went, and logs give you the surrounding detail. Set the same release version across all four and you can move between them in seconds. Alternatives with the same role: Rollbar, Bugsnag, Datadog Error Tracking, or self-hosted GlitchTip/Sentry.</p>
<div class="key-point">Sentry turns raw stack traces into grouped, user-impact-ranked, release-attributed issues with breadcrumbs — actionable triage that logs cannot provide. Always ship source maps, tag release/environment, scrub PII in <code>beforeSend</code>, sample traces, and alert on new issues and regressions rather than on every event.</div>`,
  },
  {
    q: 'What is OpenTelemetry and how does distributed tracing work in practice?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p><strong>OpenTelemetry</strong> is the vendor-neutral standard for producing telemetry: one set of SDKs and semantic conventions plus the <strong>OTel Collector</strong>, so you instrument once and export to Jaeger, Tempo, Datadog, or anything else by changing configuration instead of code. Tracing works by propagating context: the first service creates a <strong>trace id</strong> and a root <strong>span</strong>, passes them downstream in the <code>traceparent</code> header (W3C Trace Context), and each service adds child spans; the backend reassembles them into a waterfall that shows exactly where the 900 ms went. In practice you get most of it for free through auto-instrumentation — the Java agent or Node SDK hooks HTTP clients, servlets, JDBC, Kafka — and you add manual spans plus attributes only around your own business steps. The two things to get right are propagating context across async boundaries (queues, thread pools) and sampling, because tracing 100% of a high-traffic service is expensive.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>OpenTelemetry</strong> là chuẩn trung lập (không phụ thuộc nhà cung cấp) để sinh dữ liệu telemetry: một bộ SDK cùng các quy ước ngữ nghĩa, cộng với <strong>OTel Collector</strong> — nhờ vậy bạn chỉ instrument một lần rồi muốn export sang Jaeger, Tempo, Datadog hay bất cứ đâu thì chỉ cần đổi cấu hình, không phải sửa code. Tracing hoạt động bằng cách truyền ngữ cảnh: service đầu tiên sinh ra một <strong>trace id</strong> và một <strong>span</strong> gốc, gửi chúng xuống dưới qua header <code>traceparent</code> (chuẩn W3C Trace Context), rồi mỗi service thêm các span con; hệ thống backend ghép lại thành một biểu đồ thác nước cho thấy 900ms đã đi đâu. Trong thực tế bạn có gần như mọi thứ miễn phí nhờ auto-instrumentation — Java agent hoặc Node SDK tự móc vào HTTP client, servlet, JDBC, Kafka — còn span thủ công và attribute thì chỉ thêm quanh các bước nghiệp vụ của mình. Hai chỗ phải làm cho đúng: truyền ngữ cảnh qua các ranh giới bất đồng bộ (queue, thread pool), và cấu hình sampling, vì trace 100% traffic của một service lớn thì rất đắt.</p></details>
<pre># The wire format that makes it work across languages and vendors
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
             ^ver ^trace-id (same for the whole request)  ^span-id  ^flags
# Kafka/RabbitMQ: put the same header in the message so async work
# stays attached to the originating trace.

# What a trace looks like
[gateway            900ms ]
  [orders-api       870ms ]
    [SELECT orders   12ms ]
    [payments-api   700ms ]        ← the culprit is obvious
      [stripe call  680ms ]
    [kafka publish    8ms ]</pre>
<pre>// Zero-code instrumentation first (this is the 80%)
// Java: java -javaagent:opentelemetry-javaagent.jar \\
//   -Dotel.service.name=orders-api -Dotel.traces.exporter=otlp app.jar
// Node: node --require @opentelemetry/auto-instrumentations-node/register app.js
// Spring Boot 3 alternative: Micrometer Tracing + OTel bridge

// Then add spans where the business logic is
Span span = tracer.spanBuilder("reserve-inventory").startSpan();
try (Scope s = span.makeCurrent()) {
  span.setAttribute("order.id", orderId);       // low-cardinality attrs OK
  span.setAttribute("item.count", items.size());
  reserve(items);
} catch (Exception e) {
  span.recordException(e); span.setStatus(StatusCode.ERROR); throw e;
} finally { span.end(); }

// Async gotcha: context is thread/async-local. Wrap executors
// (Context.taskWrapping(executor)) or you get orphan traces.</pre>
<pre># Collector: one hop that decouples apps from vendors
app --OTLP--> otel-collector --> Tempo/Jaeger (traces)
                             --> Prometheus (metrics)
                             --> Loki/ELK (logs)
# It also batches, retries, redacts attributes, and does TAIL sampling:
# keep 100% of traces that contain an error or exceed 1s, plus 1% of the
# rest → the interesting traces survive at a fraction of the cost.
# (Head sampling decides at the start and cannot know the outcome.)</pre>
<div class="key-point">OpenTelemetry = one instrumentation standard + a collector that fans out to any backend. Start with auto-instrumentation, propagate <code>traceparent</code> everywhere including queues and thread pools, add business spans with low-cardinality attributes, and use tail sampling to keep the slow and failing traces without paying for all of them.</div>`,
  },
  {
    q: 'How do you design log aggregation with the ELK stack or Loki?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>The rule in containers is that applications log <strong>structured JSON to stdout</strong> and nothing else — no log files, no rotation, no per-pod SSH. A collector (Filebeat, Fluent Bit, Vector, or Promtail) picks the stream up, enriches it with Kubernetes metadata, and ships it to a store. <strong>ELK/OpenSearch</strong> indexes every field, which makes arbitrary queries and aggregations fast but is expensive in storage and cluster management; <strong>Loki</strong> indexes only labels and stores the log body compressed, which is far cheaper and integrates natively with Grafana, at the cost of slower full-text searching. Either way the engineering work is the same: a consistent JSON schema with a trace id, sensible levels, sampling of noisy lines, PII scrubbing, and retention tiers — because logs are usually the largest and least examined part of an observability bill.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Với container thì nguyên tắc là: ứng dụng ghi log dạng <strong>JSON có cấu trúc ra stdout</strong> và chỉ vậy thôi — không ghi ra file, không tự rotate, không SSH vào từng pod. Một collector (Filebeat, Fluent Bit, Vector hay Promtail) sẽ đọc luồng đó, bổ sung metadata của Kubernetes rồi đẩy về nơi lưu. <strong>ELK/OpenSearch</strong> index mọi field nên truy vấn và aggregation tuỳ ý đều nhanh, nhưng tốn dung lượng và tốn công vận hành cluster; <strong>Loki</strong> chỉ index label và nén phần nội dung log, nên rẻ hơn nhiều và tích hợp sẵn với Grafana, đổi lại tìm kiếm toàn văn chậm hơn. Dù chọn cái nào thì phần việc kỹ thuật vẫn như nhau: một schema JSON nhất quán có trace id, dùng đúng log level, sampling các dòng ồn ào, lọc dữ liệu cá nhân, và phân tầng lưu trữ theo thời gian — vì log thường là phần tốn tiền nhất mà lại ít được đọc nhất trong hoá đơn observability.</p></details>
<pre># Pipeline
app (JSON → stdout) → container runtime → Fluent Bit/Promtail (DaemonSet)
   → [Kafka buffer, optional] → Elasticsearch/OpenSearch  → Kibana
                              or Loki                     → Grafana

# Structured log line — one event, machine-parsable, correlated
{"ts":"2026-07-30T10:14:02.512Z","level":"ERROR","service":"orders-api",
 "env":"prod","traceId":"4bf92f35...","spanId":"00f067aa...",
 "userId":"u_8123","orderId":"o_77","event":"payment.failed",
 "provider":"stripe","code":"card_declined","durationMs":412,
 "msg":"payment declined"}
# ❌ "Payment failed for user 8123 order 77 after 412ms" — unqueryable,
#    and every variation becomes a different string to grep.</pre>
<pre># Levels, used consistently (this is a team agreement, not a preference)
ERROR : something failed that needs a human eventually → alertable
WARN  : degraded but handled (retry succeeded, fallback used)
INFO  : business milestones (order placed, user registered) — LOW volume
DEBUG : developer detail, off in prod (or enabled per-request/feature flag)
# Anti-patterns: INFO inside a loop, logging the same error at three
# layers as it bubbles up, stack traces for expected validation failures.

# Cost control (the part interviews rarely ask and ops always fixes)
- sample high-volume success logs (keep 1%), keep 100% of errors
- drop health-check and static-asset access logs at the collector
- retention tiers: 7d hot (searchable) → 30d warm → 90d archive in S3
- Elasticsearch: ILM policies + time-based indices, or you WILL run out
  of shards; Loki: label cardinality is the equivalent trap (never put
  a request id or user id in a Loki LABEL — put it in the log body)</pre>
<pre># Querying
# Kibana / ES DSL: level:ERROR AND service:orders-api AND code:card_declined
# Loki LogQL:
{service="orders-api", env="prod"} |= "payment.failed" | json
  | code="card_declined" | rate(5m)
# → you can even build metrics from logs, but a real metric is cheaper.</pre>
<p><strong>Governance details:</strong> never log secrets, tokens, passwords, or full PII (mask at the source <em>and</em> filter at the collector); ship logs off-host immediately so a compromised or crashed node does not take the evidence with it; keep clocks in sync (NTP) so multi-service timelines make sense; and make the trace id the first thing every engineer looks for — it is what turns a pile of lines into a story.</p>
<div class="key-point">Log structured JSON to stdout, let a collector enrich and ship it, and choose ELK for rich querying or Loki for cheap label-indexed storage. Consistency (schema, levels, trace id), PII scrubbing, sampling, and retention tiers are what make log aggregation useful instead of just expensive.</div>`,
  },
  {
    q: 'What are SLI, SLO and error budgets, and how do they change alerting?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>An <strong>SLI</strong> is a measured indicator of user-visible quality — the ratio of successful requests, or the share served under 300 ms. An <strong>SLO</strong> is the target for that indicator over a window, for example 99.9% of checkout requests succeed over 30 days. The remainder is the <strong>error budget</strong>: 0.1% of 30 days is about 43 minutes of failure you are <em>allowed</em> to spend, which turns reliability from an argument into arithmetic — budget left means ship features, budget exhausted means stop and fix. It also fixes alerting: instead of paging on CPU or on any 500, you page on <strong>burn rate</strong> (a fast burn means the budget dies in hours), which produces far fewer and far more meaningful pages.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>SLI</strong> là một chỉ số đo được về chất lượng mà người dùng cảm nhận — tỉ lệ request thành công, hoặc tỉ lệ request được phục vụ dưới 300ms. <strong>SLO</strong> là mục tiêu cho chỉ số đó trong một khoảng thời gian, ví dụ 99,9% request checkout thành công trong 30 ngày. Phần còn lại chính là <strong>error budget</strong>: 0,1% của 30 ngày là khoảng 43 phút lỗi mà bạn được <em>phép</em> tiêu — điều này biến chuyện độ tin cậy từ tranh luận cảm tính thành phép tính: còn budget thì cứ ra tính năng mới, hết budget thì dừng lại và đi sửa. Nó cũng chỉnh lại cách cảnh báo: thay vì báo động theo CPU hay theo từng lỗi 500, bạn báo động theo <strong>burn rate</strong> (tốc độ tiêu budget — nếu tiêu nhanh thì budget sẽ cạn trong vài giờ), cách này tạo ra ít cảnh báo hơn nhiều nhưng mỗi cảnh báo lại đáng để dậy lúc nửa đêm.</p></details>
<pre>// Define the SLI from the user's perspective, at the right boundary
availability SLI = good requests / valid requests
  good  = status not in 5xx (400s are usually the client's fault)
  valid = exclude health checks, bots, and requests the user aborted
latency SLI = requests faster than 300ms / valid requests
// Journey-based is better than per-service: "checkout completes" matters,
// "the recommendation service is up" does not.

// SLO → error budget
99.9% / 30 days  → 43m 12s of downtime allowed
99.95%           → 21m 36s      99.99% → 4m 19s (expensive: needs
                                          multi-AZ, no manual steps)
// Choose the number from what users need and what you can afford,
// not from how many nines sound impressive.</pre>
<pre># Multi-window burn-rate alerting (the SRE workbook pattern)
# fast burn: 14.4x for 5m  → budget gone in ~2 days → PAGE
- alert: CheckoutFastBurn
  expr: (1 - checkout_sli_5m) > 14.4 * 0.001
  for: 5m
  labels: { severity: page }
# slow burn: 6x for 1h → PAGE-during-hours / TICKET
- alert: CheckoutSlowBurn
  expr: (1 - checkout_sli_1h) > 6 * 0.001
  for: 1h
  labels: { severity: ticket }
# Result: a brief blip does not wake anyone; a real degradation does.</pre>
<p><strong>What changes culturally</strong> is more important than the maths: the error budget is a shared contract between product and engineering, so "we cannot ship this risky change, the budget is spent" becomes a normal, non-political sentence. It also stops the two classic failure modes — chasing 100% reliability (infinitely expensive, and users cannot tell) and having alerts nobody trusts because most of them are noise. Every page should be actionable and linked to a runbook; anything else becomes a ticket, and repeated toil becomes automation work.</p>
<div class="key-point">SLI = measured user-visible quality, SLO = the target, error budget = the allowed failure that makes reliability a budgeting decision. Alert on multi-window burn rate rather than raw errors or CPU, keep pages actionable with runbooks, and let the remaining budget decide whether to ship or stabilize.</div>`,
  },
];
