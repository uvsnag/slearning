import type { KmNode } from '../../types';

export const observability: KmNode = {
  title: 'Observability',
  level: 'intermediate',
  summary:
    'Seeing what is going on inside a distributed system through logs, metrics, traces and health checks.',
  simple:
    'With one app, you look at one log. With 30 services, you need a control room with screens, or you’re flying blind.',
  children: [
    {
      title: 'Why It’s Harder',
      level: 'beginner',
      summary: 'One user request now touches many services, logs and machines.',
      simple:
        'Finding a lost parcel is easy in one post office. Across ten depots, you need a tracking number on the parcel.',
      points: [
        'Logs are spread over many containers that may already be gone.',
        'A slow page might be caused by a service three hops away.',
        'Three pillars: logs (what happened), metrics (how much, how fast), traces (where the time went).',
        'Collect everything in one central place (e.g. Grafana stack, ELK, Datadog).',
      ],
    },
    {
      title: 'Structured Logging',
      level: 'beginner',
      summary: 'Write logs as JSON key/value fields, not free text, so tools can search them.',
      simple: 'A filled-in form is easier to sort than a pile of handwritten notes.',
      points: [
        'Each line has fields: time, level, service, traceId, message, plus business ids.',
        'Log to stdout; the platform ships logs to the central store.',
        'Spring Boot 3.4+ supports structured JSON logs out of the box (<code>logging.structured.format.console</code>).',
        'Never log passwords, tokens or card numbers.',
      ],
    },
    {
      title: 'Correlation IDs',
      level: 'intermediate',
      summary: 'An ID attached to a request and passed to every service it touches.',
      simple:
        'A tracking number on a parcel: every depot writes it down, so you can follow the whole journey.',
      points: [
        'Generated at the edge if the request doesn’t have one yet.',
        'Passed in a header and written into every log line.',
        'Today, the trace ID from W3C <code>traceparent</code> usually plays this role.',
        'Pass it through messages too (as a message header).',
      ],
      detail: `<pre><code>// Express middleware
app.use((req, res, next) =&gt; {
  const id = req.get('X-Correlation-Id') ?? crypto.randomUUID();
  res.set('X-Correlation-Id', id);
  req.log = logger.child({ correlationId: id }); // every log line carries it
  next();
});</code></pre>`,
    },
    {
      title: 'Metrics',
      level: 'intermediate',
      summary:
        'Numbers over time, like request rate, error rate and latency, used for dashboards and alerts.',
      simple:
        'The dashboard in your car: speed, fuel, temperature. You glance at it and know if something is wrong.',
      points: [
        'RED for services: Rate, Errors, Duration (latency).',
        'USE for resources: Utilisation, Saturation, Errors.',
        'Look at percentiles (p95, p99), not averages. Averages hide slow users.',
        'Spring Boot uses Micrometer; scrape with Prometheus or push via OTLP.',
        'Avoid labels with unlimited values (user id) or the metric store explodes.',
      ],
      detail: `<pre><code>Timer.builder("orders.place")
    .tag("channel", channel)          // few possible values: OK
    .publishPercentiles(0.95, 0.99)
    .register(registry)
    .record(() -&gt; orderService.place(cmd));</code></pre>`,
    },
    {
      title: 'Distributed Tracing',
      level: 'intermediate',
      summary: 'Following one request through all services, with timing for each step.',
      simple:
        'Like a relay race video: you see each runner, how long their lap took, and where the baton was dropped.',
      points: [
        'A trace is one request; a span is one step inside it (an HTTP call, a DB query).',
        'Trace context is passed in the <code>traceparent</code> header (W3C standard).',
        'The waterfall view shows exactly which service made the request slow.',
        'Sample traces (e.g. 10%) to save cost, but keep all error traces if you can.',
        'Tools: Jaeger, Grafana Tempo, Zipkin, or vendor APMs.',
      ],
    },
    {
      title: 'Health Checks',
      level: 'intermediate',
      summary: 'Endpoints that tell the platform if a service is alive and ready for traffic.',
      simple:
        'A nurse checking two things: is the patient alive (liveness), and are they ready to go back to work (readiness)?',
      points: [
        'Liveness: "am I stuck?" Failing it makes Kubernetes restart the container.',
        'Readiness: "can I take traffic now?" Failing it just removes the pod from the load balancer.',
        'Spring Boot Actuator: <code>/actuator/health/liveness</code> and <code>/readiness</code>.',
        'Don’t check other services in liveness, or one outage restarts everything.',
      ],
      tip: 'Putting a database check in the liveness probe is a classic mistake: the DB blips and all pods restart in a loop.',
    },
    {
      title: 'OpenTelemetry',
      level: 'advanced',
      summary: 'The open standard and toolkit for creating and sending traces, metrics and logs.',
      points: [
        'Vendor-neutral: instrument once, send to any backend via OTLP.',
        'Java agent adds tracing to common libraries with zero code changes.',
        'Spring Boot 3+ uses Micrometer Tracing (Sleuth is gone) and can export via OpenTelemetry.',
        'The Collector receives, filters, samples and forwards telemetry.',
        'Add your own spans for important business steps.',
      ],
      detail: `<pre><code>Tracer tracer = GlobalOpenTelemetry.getTracer("checkout");
Span span = tracer.spanBuilder("reserve-stock").startSpan();
try (Scope ignored = span.makeCurrent()) {
  span.setAttribute("order.id", orderId);
  inventory.reserve(orderId);
} catch (Exception e) {
  span.recordException(e);
  throw e;
} finally {
  span.end();
}</code></pre>`,
    },
    {
      title: 'SLOs & Alerting',
      level: 'advanced',
      summary: 'Set reliability targets from the user’s view and alert when they are at risk.',
      points: [
        'SLI: what you measure, e.g. % of checkout requests under 500 ms.',
        'SLO: the target, e.g. 99.9% over 30 days. Error budget = the 0.1% you may fail.',
        'Alert on symptoms users feel (errors, latency), not on every CPU spike.',
        'Burn-rate alerts fire when the error budget is being used up too fast.',
        'Every alert needs a runbook and an owner.',
      ],
    },
  ],
};
