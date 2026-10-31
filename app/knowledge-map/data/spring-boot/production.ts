import type { KmNode } from '../../types';

export const production: KmNode = {
  title: 'Production & Deployment',
  level: 'intermediate',
  summary: 'Watch your running app with Actuator and Micrometer, then package and ship it.',
  simple:
    'Building the car is half the job. You also need a dashboard with gauges, and a way to deliver the car to customers.',
  children: [
    {
      title: 'Actuator',
      level: 'intermediate',
      summary:
        'Built-in endpoints that show health, metrics, config and more about the running app.',
      simple: 'The dashboard of your car: speed, fuel, engine warnings, all in one place.',
      points: [
        'Add <code>spring-boot-starter-actuator</code>. Endpoints live under <code>/actuator</code>.',
        'Only <code>health</code> is exposed over HTTP by default.',
        'Expose more: <code>management.endpoints.web.exposure.include=health,info,prometheus</code>.',
        'Useful ones: <code>metrics</code>, <code>env</code>, <code>loggers</code> (change log level live), <code>threaddump</code>.',
        'Never expose everything publicly. Use a separate <code>management.server.port</code> or secure it.',
      ],
    },
    {
      title: 'Health & probes',
      level: 'intermediate',
      summary:
        '/actuator/health reports UP or DOWN, with liveness and readiness groups for Kubernetes.',
      simple:
        'Liveness asks "are you awake?". Readiness asks "are you ready to take customers?". Different questions, different actions.',
      points: [
        'Boot adds health checks for the DB, Redis, disk space and more on its own.',
        'Write your own with a <code>HealthIndicator</code> bean.',
        '<code>/actuator/health/liveness</code> fails → Kubernetes restarts the pod.',
        '<code>/actuator/health/readiness</code> fails → no traffic is sent, no restart.',
      ],
      tip: 'Do not put the database check in liveness. A DB outage would restart all your pods for nothing.',
    },
    {
      title: 'Metrics with Micrometer',
      level: 'intermediate',
      summary:
        'A metrics library, like SLF4J for metrics, that sends numbers to Prometheus, Datadog and others.',
      simple:
        'Micrometer is a universal gauge. It measures once and can show the reading on any brand of dashboard.',
      points: [
        'Boot records HTTP requests, JVM memory, GC, threads, DB pool and more out of the box.',
        'Add <code>micrometer-registry-prometheus</code> → <code>/actuator/prometheus</code>.',
        'Custom metrics: <code>Counter</code>, <code>Timer</code>, <code>Gauge</code> from a <code>MeterRegistry</code>.',
        'Keep tag values few (no user ids as tags), or memory explodes.',
      ],
      detail: `<pre><code>Counter paid = Counter.builder("orders.paid")
    .tag("channel", "web")
    .register(registry);
paid.increment();</code></pre>`,
    },
    {
      title: 'Tracing & logging',
      level: 'advanced',
      summary:
        'Follow one request across services with Micrometer Tracing and correlate logs by trace id.',
      simple:
        'Each request gets a tracking number, like a parcel. Every service and every log line writes it down, so you can follow the whole trip.',
      points: [
        'Micrometer Tracing (Boot 3) replaced Spring Cloud Sleuth.',
        'Bridges for OpenTelemetry or Brave. Export to Zipkin, Tempo, Jaeger and others.',
        'Trace and span ids are added to log lines automatically.',
        'Structured JSON logs (Boot 3.4+): <code>logging.structured.format.console=ecs</code>.',
        'Cross-service design is covered in the Microservices topic.',
      ],
    },
    {
      title: 'Executable fat jar',
      level: 'beginner',
      summary: 'One jar file that contains your code, all libraries and the server.',
      simple: 'A lunchbox with everything inside. Just open it (java -jar) and eat.',
      points: [
        'Built by the Maven or Gradle Spring Boot plugin.',
        'Nested jars sit in <code>BOOT-INF/lib</code>. Your classes in <code>BOOT-INF/classes</code>.',
        'A special launcher class loads the nested jars, which plain Java cannot do alone.',
        'Override any setting at start: <code>java -jar app.jar --server.port=9090</code>.',
      ],
    },
    {
      title: 'Docker images',
      level: 'intermediate',
      summary: 'Ship the app as a container image, ideally with layered jars or Buildpacks.',
      simple:
        'Pack the app like a moving box with labeled layers. When only your code changes, you only re-pack the top layer.',
      points: [
        'Layered jars split dependencies, loader, snapshots and your code into separate layers.',
        'Libraries rarely change, so Docker reuses those layers and pushes are small.',
        'Buildpacks: <code>spring-boot:build-image</code> makes a good image with no Dockerfile.',
        'Run as a non-root user and set memory limits. The JVM respects container limits.',
      ],
    },
    {
      title: 'Graceful shutdown',
      level: 'intermediate',
      summary: 'On stop, finish in-flight requests before the app exits.',
      simple:
        'The shop stops letting new customers in, but serves everyone already at the counter.',
      points: [
        'Graceful is the default since Boot 3.4 (<code>server.shutdown=graceful</code>).',
        'Wait time: <code>spring.lifecycle.timeout-per-shutdown-phase</code> (30 s by default).',
        'In Kubernetes, the readiness probe turns DOWN first so no new traffic arrives.',
      ],
    },
    {
      title: 'Virtual threads',
      level: 'advanced',
      summary: 'One property makes Tomcat, @Async and more use Java 21 virtual threads.',
      simple:
        'Instead of a few expensive workers who sit idle while waiting, you get thousands of cheap ones who step aside when they wait.',
      points: [
        'Set <code>spring.threads.virtual.enabled=true</code> (Boot 3.2+, Java 21+).',
        'Great for blocking I/O work: DB calls, HTTP calls.',
        'No help for CPU-heavy work.',
        'The DB pool is still the limit. Thousands of threads still share, say, 10 connections.',
        'Java 24+ fixed most "pinning" inside <code>synchronized</code>. See the Java topic.',
      ],
    },
    {
      title: 'GraalVM native image',
      level: 'expert',
      summary:
        'Compile the app ahead of time into a native executable that starts in milliseconds.',
      simple:
        'Instead of assembling furniture at the customer’s home (JVM startup), you deliver it already built. Fast to use, but slow to build and hard to change.',
      points: [
        'Boot’s AOT step works out the beans at build time, then GraalVM compiles a binary.',
        'Build with <code>mvn -Pnative native:compile</code> or a native Buildpacks image.',
        'Pros: very fast startup, low memory. Good for serverless and scale-to-zero.',
        'Cons: long builds, reflection needs hints (<code>RuntimeHintsRegistrar</code>), beans and conditions are fixed at build time.',
        'Lighter option: CDS / AOT cache for faster JVM startup with no code limits.',
      ],
    },
  ],
};
