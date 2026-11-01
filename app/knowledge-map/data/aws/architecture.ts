import type { KmNode } from '../../types';

export const architecture: KmNode = {
  title: 'Architecture & Resilience',
  level: 'advanced',
  summary:
    'Designing whole systems on AWS: Well-Architected, high availability, failure handling, disaster recovery and multi-account setups.',
  simple:
    'Knowing every tool is not enough; you need to build a house that stays up in a storm. This branch is about the blueprint, not the bricks.',
  points: [
    'Everything fails eventually; design so failures stay small.',
    'Trade-offs between cost, speed, safety and simplicity are the real job.',
    'Use Well-Architected as a checklist for reviews.',
  ],
  children: [
    {
      title: 'Well-Architected Framework',
      level: 'advanced',
      summary: 'AWS’s six-pillar guide for judging and improving cloud designs.',
      points: [
        'Operational Excellence: automate, observe, learn from incidents.',
        'Security: least privilege, encryption, traceability, protect every layer.',
        'Reliability: recover from failure, scale, test recovery.',
        'Performance Efficiency: right resources, try serverless, go global easily.',
        'Cost Optimization and Sustainability: pay only for value, use less energy.',
      ],
      tip: 'Name all six pillars in interviews. Sustainability (added in 2021) is the one people forget.',
    },
    {
      title: 'High Availability',
      level: 'advanced',
      summary: 'Keep the system up when a server or a whole AZ fails.',
      points: [
        'Spread every tier over at least 2 (better 3) AZs.',
        'ALB + Auto Scaling for apps, Multi-AZ RDS or Aurora for data.',
        'Prefer regional managed services (S3, DynamoDB, SQS, Lambda); they are multi-AZ already.',
        'Remove single points of failure: one NAT, one instance, one person with the password.',
        'Static stability: keep working with what is already running, even if the control plane is down.',
      ],
      detail: `<pre><code>Route 53 → CloudFront → ALB (AZ a, AZ b, AZ c)
                        → ECS tasks in each AZ
                        → Aurora writer (AZ a) + replicas (AZ b, c)</code></pre>`,
    },
    {
      title: 'Design for Failure',
      level: 'advanced',
      summary: 'Patterns that keep small errors from turning into big outages.',
      points: [
        'Timeouts on every remote call; never wait forever.',
        'Retries with exponential backoff and jitter (random wait); the AWS SDKs do this by default.',
        'Idempotency keys so retried requests do not charge or create twice.',
        'Queues to absorb spikes; circuit breakers to stop calling a sick service.',
        'Test it: AWS Fault Injection Service can break things on purpose.',
      ],
      detail: `<pre><code>DynamoDbClient ddb = DynamoDbClient.builder()
    .overrideConfiguration(c -&gt; c
        .apiCallTimeout(Duration.ofSeconds(2))
        .retryStrategy(RetryMode.STANDARD)) // 3 attempts, backoff + jitter
    .build();</code></pre>`,
    },
    {
      title: 'Disaster Recovery',
      level: 'expert',
      summary: 'Plans to recover from a region-level disaster, chosen by RTO, RPO and budget.',
      points: [
        'RTO (Recovery Time Objective): how long you can be down.',
        'RPO (Recovery Point Objective): how much recent data you can lose.',
        'Lower RTO and RPO means higher cost and complexity.',
        'Back up to another region and account; test restores regularly.',
      ],
      tip: 'A DR plan that was never tested is a hope, not a plan. Run game days.',
      children: [
        {
          title: 'Backup & Restore',
          level: 'advanced',
          summary: 'Copy backups to another region; rebuild everything there after a disaster.',
          points: [
            'Cheapest option; RTO and RPO in hours.',
            'AWS Backup manages schedules and cross-region copies.',
            'Needs IaC so you can rebuild the infrastructure quickly.',
          ],
        },
        {
          title: 'Pilot Light',
          level: 'expert',
          summary: 'Data is live-replicated to a second region, but the app servers are off until needed.',
          points: [
            'Core data always on (e.g. Aurora Global Database, S3 replication).',
            'Compute is scaled to zero and started during failover.',
            'RTO in tens of minutes; RPO in seconds to minutes.',
          ],
        },
        {
          title: 'Warm Standby',
          level: 'expert',
          summary: 'A smaller but fully working copy runs in the second region, ready to scale up.',
          points: [
            'Can take some traffic at any time, so it is easy to test.',
            'On disaster, scale it up and switch DNS.',
            'RTO in minutes; costs more than pilot light.',
          ],
        },
        {
          title: 'Multi-Site Active/Active',
          level: 'expert',
          summary: 'Two or more regions serve live traffic all the time.',
          points: [
            'Near-zero RTO; Route 53 or Global Accelerator moves users away from a bad region.',
            'Needs multi-region data: DynamoDB global tables or Aurora Global Database.',
            'Hardest part: writes in two places, conflicts and consistency.',
            'Most expensive; use only for truly critical systems.',
          ],
        },
      ],
    },
    {
      title: 'Multi-Account Strategy',
      level: 'expert',
      summary: 'Use many AWS accounts, managed by AWS Organizations, to separate teams, environments and risk.',
      points: [
        'An account is the strongest boundary for security, limits and billing.',
        'Typical setup: separate accounts for prod, staging, dev, logs and security.',
        'SCPs (Service Control Policies) set guardrails, e.g. “no one may leave approved regions”.',
        'RCPs (Resource Control Policies, since 2024) cap what anyone, even outsiders, can do with your resources.',
        'Control Tower sets up a landing zone with best-practice guardrails.',
        'IAM Identity Center gives people single sign-on into every account.',
      ],
    },
    {
      title: 'Event-Driven Architecture',
      level: 'expert',
      summary: 'Services react to events instead of calling each other directly.',
      points: [
        'Producers publish facts (OrderPlaced); consumers decide what to do.',
        'EventBridge or SNS for routing, SQS for buffering, Step Functions for workflows.',
        'Gives loose coupling and independent scaling, but harder debugging.',
        'Plan for duplicates, out-of-order events and eventual consistency.',
        'Use tracing and correlation IDs to follow one business flow end to end.',
      ],
      tip: 'Choreography (events) for loosely related services; orchestration (Step Functions) when one flow must be controlled and visible.',
    },
  ],
};
