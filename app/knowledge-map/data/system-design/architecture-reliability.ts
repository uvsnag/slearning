import type { KmNode } from '../../types';

export const architecture: KmNode = {
  title: 'Architecture Styles',
  level: 'intermediate',
  summary:
    'The big shapes a system can take: monolith, microservices, serverless and their trade-offs.',
  simple:
    'One big house, a street of small houses, or rooms you rent by the hour. Each fits a different family and budget.',
  points: [
    'Start simple; split only when team size or scale demands it.',
    'Every split adds network calls, failure modes and operational work.',
    'Deep microservices material lives in the Microservices topic.',
  ],
  children: [
    {
      title: 'Monolith',
      level: 'beginner',
      summary: 'One application, deployed as one unit, usually with one database.',
      simple: 'One big house: everything under one roof, easy to walk between rooms.',
      points: [
        'Simple to build, test, deploy and debug.',
        'Function calls instead of network calls: fast and transactional.',
        'Gets hard when many teams change the same code base.',
        'A modular monolith (clear internal modules) gets many benefits with little cost.',
      ],
    },
    {
      title: 'Microservices',
      level: 'intermediate',
      summary:
        'Many small services, each owning one business area and its own data, deployed separately.',
      simple: 'A street of small shops: each runs itself, but deliveries between them take time.',
      points: [
        'Teams can deploy and scale independently.',
        'Costs: network failures, data consistency, monitoring and many pipelines.',
        'Worth it for large organizations, rarely for small teams.',
      ],
    },
    {
      title: 'Serverless',
      level: 'intermediate',
      summary: 'Run functions or containers on demand; the cloud handles servers and scaling.',
      simple:
        'Like taking a taxi instead of owning a car: you pay per ride and someone else does maintenance.',
      points: [
        'Examples: AWS Lambda, Cloud Run, Azure Functions.',
        'Scales to zero, pay per use; great for spiky or low traffic.',
        'Downsides: cold starts, time limits, vendor lock-in, harder local testing.',
        'Watch database connections: thousands of functions can exhaust a database.',
      ],
    },
    {
      title: 'Read/Write Split & CQRS',
      level: 'advanced',
      summary:
        'Use different models or stores for reading and writing when their needs differ a lot.',
      points: [
        'Simple version: writes to the primary, reads from replicas.',
        'CQRS: a separate read model (denormalized view, search index) built from write events.',
        'Reads become fast and simple; the read side is eventually consistent.',
        'Only worth the complexity when reads and writes really diverge.',
      ],
    },
    {
      title: 'Choosing an Architecture',
      level: 'advanced',
      summary: 'Pick by team size, scale, change rate and operational skill, not by trend.',
      points: [
        'Small team, new product: a well-structured monolith.',
        'Hot spots with very different scale needs: extract just those parts.',
        'Conway’s law: your architecture ends up mirroring how your teams talk.',
        'Write down decisions and trade-offs in short ADRs (architecture decision records).',
      ],
    },
  ],
};

export const reliability: KmNode = {
  title: 'Reliability',
  level: 'advanced',
  summary:
    'Designing so that failures of servers, zones or regions don’t take the whole system down.',
  simple:
    'Assume things will break and plan for it, like carrying a spare tire, a second key and a backup of your photos.',
  points: [
    'Remove single points of failure with redundancy.',
    'Degrade gracefully: lose a feature, not the whole product.',
    'Know how much data you can lose and how long you can be down.',
    'Timeouts, retries and circuit breakers are covered in the Microservices topic.',
  ],
  children: [
    {
      title: 'Single Point of Failure',
      level: 'intermediate',
      summary: 'Any one part whose failure brings the whole system down.',
      simple: 'A bridge that is the only road into town. If it closes, nobody gets in.',
      points: [
        'Look for: one database, one load balancer, one region, one person who knows the system.',
        'Fix with redundancy: at least two of everything important.',
        'Also check hidden shared parts: DNS provider, certificate, config service.',
      ],
    },
    {
      title: 'Redundancy & Failover',
      level: 'intermediate',
      summary: 'Running spare copies and switching to them automatically when the main one fails.',
      simple: 'A hospital generator that kicks in when the power goes out.',
      points: [
        'Active-active: all copies serve traffic; failover is instant, but harder to keep data in sync.',
        'Active-passive: a standby waits; simpler, but switching takes time.',
        'Spread copies across availability zones (separate data centers in a region).',
        'Test failover regularly; untested failover usually fails.',
      ],
    },
    {
      title: 'Graceful Degradation',
      level: 'advanced',
      summary: 'When a part fails or is overloaded, keep the core working with reduced features.',
      points: [
        'Recommendation service down? Show best sellers instead.',
        'Turn off expensive features with feature flags during incidents.',
        'Shed low-priority traffic (bots, prefetching) before user traffic.',
        'Serve cached or stale data rather than an error page.',
      ],
    },
    {
      title: 'RPO & RTO',
      level: 'advanced',
      summary:
        'RPO = how much data you can afford to lose; RTO = how long you can afford to be down.',
      points: [
        'RPO 0 needs synchronous replication; RPO of hours can use nightly backups.',
        'RTO in seconds needs hot standby; RTO in hours can restore from backup.',
        'Lower numbers cost a lot more; agree them with the business.',
        'A backup you have never restored is not a backup.',
      ],
    },
    {
      title: 'Multi-Region',
      level: 'expert',
      summary: 'Running in several geographic regions for disaster recovery and lower latency.',
      points: [
        'Active-passive: one region serves, another is ready to take over.',
        'Active-active: all regions serve; needs conflict handling or data partitioned by region.',
        'Cross-region latency (~100 ms) makes synchronous writes across regions slow.',
        'Data residency laws may require keeping some users’ data in their country.',
        'Very expensive and complex; many systems only need multi-zone.',
      ],
    },
    {
      title: 'Monitoring & Alerting',
      level: 'intermediate',
      summary: 'Knowing the system is unhealthy before your users tell you.',
      simple: 'Smoke detectors for your system: they shout when something starts burning.',
      points: [
        'Watch the "golden signals": latency, traffic, errors, saturation.',
        'Alert on user-facing symptoms (error rate, slow p99), not every CPU blip.',
        'Logs, metrics and traces together explain what went wrong.',
        'Run blameless post-mortems and fix the root cause.',
      ],
    },
  ],
};
