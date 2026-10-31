import type { KmNode } from '../../types';

export const production: KmNode = {
  title: 'Running in Production',
  level: 'intermediate',
  summary:
    'Restart policies, health checks, logs, resource limits, clean shutdown, and tips for Java and Node apps.',
  simple:
    'Running a container on your laptop is easy. Keeping it healthy 24/7 means planning for crashes, restarts, memory limits and logs.',
  points: [
    'Containers should restart on crash and report if they are healthy.',
    'Always set memory and CPU limits.',
    'Handle SIGTERM so deploys don’t cut requests in half.',
  ],
  children: [
    {
      title: 'Restart Policies',
      level: 'intermediate',
      summary: 'Tell Docker whether to restart a container when it exits or when Docker restarts.',
      simple: 'Like a night guard who switches the lights back on if they go out.',
      points: [
        '<code>no</code> (default), <code>on-failure[:max]</code>, <code>always</code>, <code>unless-stopped</code>.',
        '<code>unless-stopped</code> is a good default for long-running services.',
        'A restart loop hides the real problem; check logs and exit codes.',
      ],
    },
    {
      title: 'Healthchecks',
      level: 'intermediate',
      summary: 'A command Docker runs regularly to check if the app actually works.',
      simple: 'A heartbeat check. Running isn’t enough; the app must answer "I’m OK".',
      points: [
        'Dockerfile: <code>HEALTHCHECK CMD curl -f http://localhost:3000/health || exit 1</code>.',
        'Status shows as <code>healthy</code>/<code>unhealthy</code> in <code>docker ps</code>.',
        'Plain Docker only reports it; Compose, Swarm or your platform act on it.',
        'Distroless images have no curl; use a tiny built-in check in your app.',
        'Kubernetes ignores Docker HEALTHCHECK and uses its own probes.',
      ],
    },
    {
      title: 'Logging',
      level: 'intermediate',
      summary: 'Containers log to stdout/stderr; a logging driver decides where that goes.',
      simple:
        'The app just talks out loud; Docker writes it down and can forward it to a central notebook.',
      points: [
        'Default <code>json-file</code> driver grows forever unless you set <code>max-size</code>/<code>max-file</code>.',
        'The <code>local</code> driver rotates and compresses by default.',
        'Ship logs to a central system (Loki, ELK, CloudWatch) via a driver or an agent.',
        'Log JSON lines so tools can parse them.',
      ],
      tip: 'Full disks from unrotated container logs are a classic production outage. Set log rotation in daemon.json.',
    },
    {
      title: 'Resource Limits',
      level: 'intermediate',
      summary:
        'Cap how much memory and CPU a container may use so one app can’t starve the others.',
      simple: 'Give each roommate their own shelf in the fridge, so one can’t eat everything.',
      points: [
        '<code>--memory 512m</code>: over the limit, the kernel OOM-kills the process (exit 137).',
        '<code>--cpus 1.5</code>: throttles CPU time, doesn’t kill.',
        '<code>--pids-limit</code> stops fork bombs.',
        'Without limits, a container can use all of the host’s memory.',
      ],
    },
    {
      title: 'Graceful Shutdown',
      level: 'advanced',
      summary:
        'On SIGTERM, stop taking new work, finish in-flight requests, close connections, then exit.',
      points: [
        'Docker sends SIGTERM, waits (default 10s, <code>--stop-timeout</code>), then SIGKILL.',
        'Your app must be PID 1 (exec form) or run under an init like <code>--init</code> (tini).',
        'PID 1 has no default signal handlers in Linux, so you must handle SIGTERM yourself.',
        'Spring Boot: <code>server.shutdown=graceful</code>.',
      ],
      detail: `<pre><code>// Node.js
const server = app.listen(3000);

process.on('SIGTERM', () =&gt; {
  console.log('SIGTERM received, closing');
  server.close(() =&gt; {
    db.end().then(() =&gt; process.exit(0));
  });
});</code></pre>`,
    },
    {
      title: 'Java in Containers',
      level: 'intermediate',
      summary:
        'Modern JVMs read container limits; size the heap as a percentage of container memory.',
      simple:
        'Old Java looked at the whole server’s memory and grabbed too much. Modern Java looks at its own box size.',
      points: [
        'Container-aware since JDK 10 (and 8u191).',
        'Prefer <code>-XX:MaxRAMPercentage=75</code> over a fixed <code>-Xmx</code>.',
        'Leave room for non-heap memory: metaspace, threads, direct buffers.',
        'Build tools: Spring Boot layered jars, <code>spring-boot:build-image</code> (buildpacks), or Jib.',
        'Run on a JRE or jlink-ed runtime, not a full JDK.',
      ],
      detail: `<pre><code>// Check what the JVM sees inside the container
long max = Runtime.getRuntime().maxMemory() / (1024 * 1024);
int cpus = Runtime.getRuntime().availableProcessors();
System.out.println("Max heap MB: " + max + ", CPUs: " + cpus);</code></pre>`,
    },
    {
      title: 'Node in Containers',
      level: 'intermediate',
      summary: 'Install exact deps, run as the node user, and start node directly.',
      simple: 'Pack only production dependencies and let Node itself be the main process.',
      points: [
        'Use <code>npm ci --omit=dev</code> with a lock file.',
        'Set <code>NODE_ENV=production</code>.',
        'Start with <code>CMD ["node", "server.js"]</code>, not <code>npm start</code> (npm may not forward signals).',
        'Run as <code>USER node</code>; add <code>node_modules</code> to <code>.dockerignore</code>.',
      ],
    },
  ],
};
