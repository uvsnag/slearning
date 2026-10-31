import type { KmNode } from '../../types';

export const deployment: KmNode = {
  title: 'Deployment & Platform',
  level: 'intermediate',
  summary:
    'Packaging services, running them on a platform, and releasing changes safely and often.',
  simple:
    'With dozens of services, deploying by hand is impossible. You need a conveyor belt that packs, ships and checks every service the same way.',
  children: [
    {
      title: 'Containers',
      level: 'beginner',
      summary:
        'Package a service with everything it needs into one image that runs the same everywhere.',
      simple:
        'A shipping container: whatever is inside, every ship and crane knows how to handle the box.',
      points: [
        'One image per service version; the same image goes from test to production.',
        'Light and fast to start, compared with virtual machines.',
        'Spring Boot can build images without a Dockerfile (Buildpacks: <code>bootBuildImage</code>).',
        'Keep images small and patched; run as a non-root user.',
      ],
    },
    {
      title: 'Kubernetes Basics',
      level: 'intermediate',
      summary: 'A platform that runs containers, keeps them alive and spreads them over machines.',
      simple:
        'A harbour master: you say "I want 3 copies of this container running", and it keeps it that way, replacing any that sink.',
      points: [
        'Pod: one or more containers that run together.',
        'Deployment: keeps N copies of a pod running and does rolling updates.',
        'Service: a stable name and address in front of changing pods.',
        'Ingress or the newer Gateway API: routes outside traffic into the cluster.',
        'ConfigMap and Secret: config and secrets injected into pods.',
        'Autoscaling adds pods when CPU or custom metrics go up.',
      ],
      tip: 'Set CPU/memory requests and limits for every container, or one noisy service can starve its neighbours.',
    },
    {
      title: 'CI/CD per Service',
      level: 'intermediate',
      summary: 'Each service has its own automated pipeline from commit to production.',
      simple:
        'Each shop has its own delivery van, so the bakery doesn’t wait for the butcher to load up.',
      points: [
        'Pipeline: build → unit tests → integration and contract tests → image → deploy.',
        'One service’s release never waits for another’s.',
        'Monorepo or one repo per service both work; independent pipelines are what matter.',
        'GitOps: the desired state lives in Git and a tool (Argo CD, Flux) syncs the cluster.',
        'Small, frequent releases are safer than big, rare ones.',
      ],
    },
    {
      title: 'Blue-Green Deployment',
      level: 'intermediate',
      summary: 'Run the new version next to the old one, then switch all traffic at once.',
      simple:
        'Two identical stages. The band plays on blue while you set up green; then you flip the lights and the audience turns around.',
      points: [
        'Blue = live version, green = new version, fully started and tested.',
        'Switch the router; roll back by switching back.',
        'Needs double capacity for a short time.',
        'The database must work with both versions during the switch.',
      ],
    },
    {
      title: 'Canary Releases',
      level: 'intermediate',
      summary:
        'Send a small share of traffic to the new version first, and grow it if all looks good.',
      simple:
        'Miners took a canary into the mine as an early warning. You let 5% of users try the new version first.',
      points: [
        'Start with 1–5% of traffic, then 25%, 50%, 100%.',
        'Compare error rate and latency between old and new versions.',
        'Automated tools (Argo Rollouts, Flagger) can promote or roll back for you.',
        'Needs good metrics, or you are just guessing.',
      ],
    },
    {
      title: 'Feature Flags',
      level: 'intermediate',
      summary: 'Turn features on or off at runtime, without a new deployment.',
      simple:
        'Light switches for code: the wiring is already in the wall (deployed), you just decide when to flip it.',
      points: [
        'Separates deploy (code is live) from release (users see it).',
        'Turn a feature on for staff, then 10% of users, then everyone.',
        'Kill switch: turn a broken feature off in seconds.',
        'OpenFeature is a vendor-neutral API for flags.',
        'Remove old flags quickly, or the code fills with dead branches.',
      ],
      detail: `<pre><code>Client flags = OpenFeatureAPI.getInstance().getClient();
var ctx = new MutableContext(user.id()).add("country", user.country());

if (flags.getBooleanValue("new-checkout", false, ctx)) {
  return newCheckout.start(cart);
}
return legacyCheckout.start(cart);</code></pre>`,
    },
    {
      title: 'Zero-Downtime DB Changes',
      level: 'advanced',
      summary: 'Change a database schema in small steps so old and new code both keep working.',
      points: [
        'Expand → migrate → contract: add the new column, copy data, then drop the old one later.',
        'Never rename or drop in the same release that stops using it.',
        'Run migrations with Flyway or Liquibase as part of the service.',
        'Needed for rolling updates, blue-green and canaries, where two versions run at once.',
      ],
    },
    {
      title: 'Service Mesh',
      level: 'advanced',
      summary:
        'An infrastructure layer that handles service-to-service traffic: security, retries, routing and telemetry.',
      simple:
        'Instead of teaching every driver the traffic rules, you put smart traffic lights at every junction.',
      children: [
        {
          title: 'Sidecar Proxy',
          level: 'advanced',
          summary:
            'A small proxy (often Envoy) runs next to each service and handles its network traffic.',
          points: [
            'All traffic in and out of the pod goes through the sidecar.',
            'The control plane (e.g. Istio, Linkerd) pushes rules to all proxies.',
            'Your code makes plain HTTP calls; the proxy adds mTLS, retries, metrics.',
            'Cost: extra memory, CPU and a small latency per hop.',
          ],
        },
        {
          title: 'What a Mesh Gives You',
          level: 'advanced',
          summary: 'Network features for all services, in any language, without code changes.',
          points: [
            'Automatic mTLS and service identity.',
            'Traffic splitting for canaries, retries, timeouts, circuit breaking.',
            'Uniform metrics and traces for every call.',
            'Rules about which service may call which.',
            'Mesh retries and app retries can stack. Configure them in one place only.',
          ],
          tip: 'Few services, one language? Libraries like Resilience4j are often enough. A mesh pays off with many services and polyglot teams.',
        },
        {
          title: 'Sidecarless Meshes',
          level: 'expert',
          summary: 'Newer meshes move proxies out of each pod to cut cost and complexity.',
          points: [
            'Istio ambient mode (GA in 1.24, 2024): a per-node proxy for mTLS, optional waypoint proxies for L7 rules.',
            'eBPF-based options (e.g. Cilium) handle some features in the Linux kernel.',
            'Less memory and easier upgrades, since apps don’t need restarting.',
            'Trade-off: fewer per-pod controls and newer, less battle-tested code.',
          ],
        },
      ],
    },
  ],
};
