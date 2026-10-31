import type { KmNode } from '../../types';

export const afterDeploy: KmNode = {
  title: 'After Deploy & Metrics',
  level: 'advanced',
  summary:
    'Check that a release really works in production, and measure how well your delivery process performs.',
  simple:
    'Delivering the parcel isn’t the end. You check the customer got it and it works, and you track how fast and reliably you deliver over time.',
  points: [
    'A green pipeline doesn’t prove production is healthy.',
    'Watch errors, latency and business metrics right after every deploy.',
    'DORA metrics measure delivery speed and stability together.',
  ],
  children: [
    {
      title: 'Smoke Tests',
      level: 'intermediate',
      summary: 'A few quick checks right after deploy to prove the app starts and key paths work.',
      simple: 'Turn the new machine on and see if smoke comes out, before handing it over.',
      points: [
        'Hit the health endpoint, log in, load a key page or API.',
        'Run automatically as the last pipeline step after each deploy.',
        'Fail → stop the rollout and roll back.',
      ],
      detail: `<pre><code>// smoke.js, run by the pipeline after deploy
const res = await fetch(process.env.APP_URL + '/health/ready');
if (res.status !== 200) {
  console.error('Smoke test failed:', res.status);
  process.exit(1);
}
console.log('Smoke test passed');</code></pre>`,
    },
    {
      title: 'Monitoring After Deploy',
      level: 'advanced',
      summary: 'Compare key metrics before and after a release to catch problems tests missed.',
      points: [
        'Watch the "golden signals": latency, traffic, errors, saturation.',
        'Mark deploys on dashboards so you can link a spike to a release.',
        'Alert on user-facing symptoms (error rate, SLO burn), not every CPU blip.',
        'Tools: Prometheus + Grafana, Datadog, New Relic, OpenTelemetry for traces.',
      ],
    },
    {
      title: 'Automated Rollback',
      level: 'expert',
      summary:
        'The deploy system watches metrics and rolls back by itself when the new version looks bad.',
      points: [
        'Canary analysis compares the new version’s metrics to the old one’s.',
        'Argo Rollouts and Flagger can promote or abort based on Prometheus queries.',
        'Needs good metrics and sensible thresholds, or it flaps or misses real problems.',
        'Database changes must be backward compatible for this to be safe.',
      ],
    },
    {
      title: 'DORA Metrics',
      level: 'advanced',
      summary: 'Research-backed metrics for software delivery: two for speed, two for stability.',
      points: [
        'Deployment frequency: how often you deploy to production.',
        'Lead time for changes: from commit to running in production.',
        'Change failure rate: share of deploys that cause a failure needing a fix.',
        'Failed deployment recovery time (formerly MTTR): how fast you recover from a bad deploy.',
        'Recent DORA reports also track rework rate (unplanned deploys to fix user-facing bugs).',
      ],
      tip: 'Key DORA finding: speed and stability go together. Elite teams deploy more often AND fail less.',
    },
    {
      title: 'Using Metrics Well',
      level: 'expert',
      summary: 'Use delivery metrics to find bottlenecks, not to rank teams or people.',
      points: [
        'Measure trends for one team over time, not team versus team.',
        'Once a metric becomes a target, people game it (Goodhart’s law).',
        'Long lead time? Look at review wait, slow pipelines, manual approvals.',
        'High change failure rate? Look at test gaps, big batches, risky migrations.',
      ],
    },
  ],
};
