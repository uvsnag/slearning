import type { KmNode } from '../../types';

export const cost: KmNode = {
  title: 'Cost Optimization',
  level: 'intermediate',
  summary: 'How AWS charges you, how to track spend, and the main levers to pay less.',
  simple:
    'The cloud is like an electricity bill: cheap if you switch lights off, painful if you leave every room lit all month.',
  points: [
    'You pay for what you provision and use: time, storage, requests, data transfer.',
    'Visibility first: budgets, tags and Cost Explorer.',
    'Then optimise: right-size, turn off idle things, commit, use Spot.',
  ],
  children: [
    {
      title: 'How AWS Bills You',
      level: 'beginner',
      summary: 'Each service has its own meters: hours, GB stored, requests, and data moved.',
      simple:
        'Like a phone plan with many small charges: minutes, texts, data. Each one looks small, but they add up.',
      points: [
        'Compute by the second or hour; storage per GB-month; serverless per request and duration.',
        'Data into AWS is free; data out to the internet costs per GB.',
        'Since July 2025, new accounts get free credits and a free plan instead of the old 12-month free tier.',
        'Many services keep an “always free” amount, e.g. Lambda requests.',
        'The AWS Pricing Calculator estimates cost before you build.',
      ],
    },
    {
      title: 'Budgets, Cost Explorer & Tags',
      level: 'beginner',
      summary: 'Tools to see where money goes and get warned before it is too late.',
      simple:
        'Like a banking app that groups spending by category and texts you when you are close to your monthly limit.',
      points: [
        'AWS Budgets: alert by email or SNS at, say, 80% of planned spend.',
        'Cost Explorer: charts by service, account, region or tag, plus forecasts.',
        'Tag resources (team, project, env) and turn on cost allocation tags.',
        'Cost Anomaly Detection flags sudden, unusual spend.',
      ],
      tip: 'Create a budget alert on day one of any new account, even for personal learning.',
    },
    {
      title: 'Right-sizing & Clean-up',
      level: 'intermediate',
      summary: 'Match resources to real usage and remove what nobody uses.',
      simple:
        'Do not rent a ten-seat van to drive alone to work. And return the van when you are done with it.',
      points: [
        'Compute Optimizer suggests smaller or newer instance types from real metrics.',
        'Stop dev and test environments at night and on weekends.',
        'Delete unattached EBS volumes, old snapshots, idle load balancers and unused IPs.',
        'Move to Graviton and gp3 for easy savings.',
        'Use S3 lifecycle rules and log retention so storage does not grow forever.',
      ],
    },
    {
      title: 'Commitments & Spot',
      level: 'advanced',
      summary: 'Trade flexibility for big discounts with Savings Plans, Reserved Instances and Spot.',
      points: [
        'Compute Savings Plans: commit $/hour for 1 or 3 years; covers EC2, Fargate and Lambda.',
        'EC2 Instance Savings Plans and RIs: bigger discounts, less flexibility.',
        'Databases: reserved options per service, or Database Savings Plans (since December 2025) across RDS, Aurora, DynamoDB and more.',
        'Spot: up to 90% off for fault-tolerant work like batch, CI and stateless workers.',
        'Commit only to your steady baseline, after right-sizing.',
      ],
      tip: 'Right-size first, commit second. Committing to oversized servers locks in waste for years.',
    },
    {
      title: 'Hidden Costs',
      level: 'advanced',
      summary: 'The charges that surprise teams most often on their bill.',
      points: [
        'NAT Gateway per-GB processing, especially for traffic to S3 or DynamoDB (use gateway endpoints).',
        'Cross-AZ and cross-region data transfer between your own services.',
        'Public IPv4 addresses, charged hourly since February 2024.',
        'CloudWatch Logs ingestion and never-expiring retention.',
        'Forgotten resources in regions nobody checks.',
      ],
      tip: 'In a cost review, sort Cost Explorer by usage type, not just by service. Data transfer often hides there.',
    },
  ],
};
