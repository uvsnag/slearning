import type { KmNode } from '../../types';

export const monitoring: KmNode = {
  title: 'Monitoring & Auditing',
  level: 'intermediate',
  summary:
    'See what your system is doing (CloudWatch, X-Ray) and who changed what in your account (CloudTrail, Config).',
  simple:
    'CloudWatch is the car dashboard with gauges and warning lights. X-Ray is the GPS trail of each trip. CloudTrail is the security camera recording who touched the car.',
  points: [
    'Metrics tell you something is wrong; logs and traces tell you why.',
    'Alarms turn metrics into alerts and automatic actions.',
    'CloudTrail and Config are for audit, security and compliance.',
  ],
  children: [
    {
      title: 'CloudWatch Metrics',
      level: 'beginner',
      summary: 'Numbers over time, like CPU, request count or queue length, collected from AWS services.',
      simple:
        'Like a fitness tracker for your app: heart rate (CPU), steps (requests) and sleep (idle time), all drawn as charts.',
      points: [
        'Most services send metrics for free, e.g. EC2 every 5 minutes (1 minute with detailed monitoring).',
        'EC2 memory and disk usage need the CloudWatch agent.',
        'Publish custom metrics from your code, e.g. orders per minute.',
        'Dashboards put the key charts on one screen.',
      ],
      detail: `<pre><code>CloudWatchClient cw = CloudWatchClient.create();
cw.putMetricData(b -&gt; b.namespace("Shop").metricData(MetricDatum.builder()
    .metricName("OrdersPlaced")
    .unit(StandardUnit.COUNT)
    .value(1.0)
    .build()));</code></pre>`,
      tip: 'At high volume, log in Embedded Metric Format (JSON log lines CloudWatch turns into metrics) instead of calling PutMetricData on every request.',
    },
    {
      title: 'CloudWatch Alarms',
      level: 'intermediate',
      summary: 'Watch a metric and act when it crosses a threshold for some time.',
      simple:
        'A smoke detector: it stays quiet until the level is too high for too long, then it beeps and can call the fire brigade.',
      points: [
        'States: OK, ALARM, INSUFFICIENT_DATA.',
        'Actions: notify via SNS, scale an Auto Scaling group, stop or reboot EC2.',
        '“3 out of 5 data points” settings avoid alerts on short blips.',
        'Composite alarms combine several alarms to reduce alert noise.',
        'Anomaly detection learns normal patterns instead of fixed thresholds.',
      ],
      tip: 'Alert on what users feel (errors, latency, queue age), not only on CPU.',
    },
    {
      title: 'CloudWatch Logs',
      level: 'intermediate',
      summary: 'Central place for application and service logs, with search and queries.',
      simple:
        'One big diary where all your servers and functions write what they did, so you can search it later.',
      points: [
        'Organised in log groups (per app) and log streams (per instance or container).',
        'Lambda and ECS send logs here automatically.',
        'Set a retention period; the default is “never expire”, which slowly costs money.',
        'Logs Insights lets you query logs with a simple query language.',
        'Metric filters turn log patterns (like ERROR) into metrics you can alarm on.',
      ],
      tip: 'Log in JSON. Structured logs are much easier to filter and query than free text.',
    },
    {
      title: 'CloudTrail & Config',
      level: 'intermediate',
      summary: 'CloudTrail logs every API call; Config records how resource settings change over time.',
      simple:
        'CloudTrail is a CCTV recording of who pressed which button. Config is a photo album of how each room looked on each day.',
      points: [
        'CloudTrail keeps 90 days of management events for free in Event history.',
        'Create a trail (or CloudTrail Lake) to store logs longer, ideally for all regions and accounts.',
        'Answers “who deleted this bucket, from which IP, and when?”.',
        'Config rules check compliance, e.g. “no unencrypted EBS volumes”, and can auto-fix.',
      ],
      tip: 'Send CloudTrail from all accounts to a locked-down log archive account so attackers cannot erase their tracks.',
    },
    {
      title: 'X-Ray & Tracing',
      level: 'advanced',
      summary: 'Follow one request across services to see where the time goes and where errors happen.',
      points: [
        'A trace is the full journey; segments and subsegments are each hop.',
        'The service map shows how services call each other, with latency and error rates.',
        'Sampling records only part of requests to keep cost down.',
        'AWS now recommends OpenTelemetry (AWS Distro for OpenTelemetry) for new instrumentation.',
        'CloudWatch Application Signals builds service dashboards on top of traces.',
      ],
    },
  ],
};
