import type { KmNode } from '../../types';

export const messaging: KmNode = {
  title: 'Messaging & Integration',
  level: 'intermediate',
  summary:
    'Queues, topics, event buses, streams and workflows that let services talk without waiting on each other.',
  simple:
    'Instead of phoning a colleague and waiting on hold, you leave a note in their inbox. They handle it when ready, and you get on with your day.',
  points: [
    'SQS: a queue, one consumer handles each message.',
    'SNS: a topic, every subscriber gets a copy.',
    'EventBridge: an event router with rules.',
    'Kinesis: an ordered, replayable stream. Step Functions: workflows.',
  ],
  children: [
    {
      title: 'Why Decouple?',
      level: 'beginner',
      summary: 'Putting a message service between apps makes them independent, resilient and easier to scale.',
      simple:
        'A restaurant ticket rail: waiters pin orders, cooks take them at their own pace. A busy kitchen does not stop waiters from taking orders.',
      points: [
        'The sender does not wait for the receiver, so the user gets a fast answer.',
        'If the receiver is down, messages wait safely and are handled later.',
        'Traffic spikes fill the queue instead of crashing the backend.',
        'New consumers can be added without touching the producer.',
      ],
    },
    {
      title: 'SQS',
      level: 'intermediate',
      summary: 'Simple Queue Service: a fully managed message queue that consumers poll.',
      simple:
        'A to-do tray: producers drop jobs in, workers pull one out, finish it, and throw the note away.',
      points: [
        'Practically unlimited throughput for standard queues.',
        'Messages kept 4 days by default, up to 14 days.',
        'Max message size 1 MiB (raised from 256 KB in 2025); put big data in S3.',
        'Use long polling (wait up to 20 s) to cut empty responses and cost.',
        'Consumers must delete a message after success, or it comes back.',
      ],
      detail: `<pre><code>SqsClient sqs = SqsClient.create();
sqs.sendMessage(b -&gt; b.queueUrl(url).messageBody("order-42"));

var msgs = sqs.receiveMessage(b -&gt; b.queueUrl(url)
    .maxNumberOfMessages(10).waitTimeSeconds(20)).messages(); // long polling
for (Message m : msgs) {
  process(m.body());
  sqs.deleteMessage(b -&gt; b.queueUrl(url).receiptHandle(m.receiptHandle()));
}</code></pre>`,
      children: [
        {
          title: 'Standard vs FIFO',
          level: 'intermediate',
          summary: 'Standard is fastest but may reorder or duplicate; FIFO keeps order and removes duplicates.',
          simple:
            'Standard is a busy post office: letters arrive, maybe out of order, rarely twice. FIFO is a single-file line at the bank: strict order, one at a time.',
          points: [
            'Standard: at-least-once delivery, best-effort ordering.',
            'FIFO: exactly-once processing and strict order per message group ID.',
            'FIFO throughput is lower: 300 msg/s per API action, 3,000 with batching, more in high-throughput mode.',
            'FIFO queue names must end in <code>.fifo</code>.',
          ],
          tip: 'Even with FIFO, make consumers idempotent. Retries after timeouts can still cause repeats in your own code.',
        },
        {
          title: 'Visibility Timeout',
          level: 'intermediate',
          summary: 'While one consumer works on a message, it is hidden from others for a set time.',
          simple:
            'Like taking a ticket off the rail: others cannot see it while you cook. If you do not finish in time, it goes back on the rail.',
          points: [
            'Default 30 seconds, max 12 hours.',
            'Set it longer than your normal processing time.',
            'Long jobs can extend it with <code>ChangeMessageVisibility</code>.',
            'For a Lambda trigger, set it to at least 6× the function timeout.',
          ],
        },
        {
          title: 'Dead-Letter Queue',
          level: 'intermediate',
          summary: 'A side queue where messages go after failing too many times.',
          simple:
            'The “problem orders” box: after a few failed tries, the ticket is set aside so it stops blocking the kitchen.',
          points: [
            'Set <code>maxReceiveCount</code> in the redrive policy, e.g. 5 tries.',
            'Alarm on DLQ depth so someone looks at failures.',
            'Redrive moves messages back to the main queue after a fix.',
          ],
        },
      ],
    },
    {
      title: 'SNS',
      level: 'intermediate',
      summary: 'Simple Notification Service: publish once, push a copy to every subscriber.',
      simple:
        'A group chat announcement: you post once and everyone in the group gets it at the same time.',
      points: [
        'Subscribers: SQS, Lambda, HTTP endpoints, email, SMS, mobile push.',
        'Push-based: SNS delivers, nobody polls.',
        'Fan-out pattern: SNS topic → several SQS queues, each for one service.',
        'Subscription filter policies let each subscriber get only matching messages.',
        'FIFO topics keep order when paired with FIFO queues.',
      ],
    },
    {
      title: 'EventBridge',
      level: 'intermediate',
      summary: 'A serverless event bus that routes events to targets using content-based rules.',
      simple:
        'A smart mail-sorting room: it reads each envelope and sends it to the right teams based on rules you write.',
      points: [
        'Events from your apps, AWS services (e.g. “EC2 stopped”) and SaaS partners.',
        'Rules match on event content and send to Lambda, SQS, Step Functions and 20+ targets.',
        'Archive and replay events; schema registry documents event shapes.',
        'Scheduler runs one-off or cron jobs; Pipes connect sources to targets with filtering.',
      ],
      detail: `<pre><code>import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

const eb = new EventBridgeClient({});
await eb.send(new PutEventsCommand({
  Entries: [{
    EventBusName: 'shop',
    Source: 'shop.orders',
    DetailType: 'OrderPlaced',
    Detail: JSON.stringify({ orderId: 42, total: 120 }),
  }],
}));</code></pre>`,
      tip: 'SNS for simple, fast fan-out; EventBridge when you need rich routing, many event sources or replay.',
    },
    {
      title: 'Kinesis Data Streams',
      level: 'advanced',
      summary: 'An ordered, replayable stream of records for real-time data, split into shards.',
      points: [
        'Each shard: 1 MB/s or 1,000 records/s in, 2 MB/s out.',
        'Order is kept per partition key, within a shard.',
        'Data kept 24 hours by default, up to 365 days; many consumers can re-read it.',
        'On-demand mode scales shards for you; provisioned mode is cheaper when steady.',
        'Firehose loads streams into S3, Redshift or OpenSearch without code.',
      ],
      tip: 'SQS deletes after processing; Kinesis keeps data for replay. Kafka fans may prefer Amazon MSK.',
    },
    {
      title: 'Step Functions',
      level: 'advanced',
      summary: 'A managed workflow engine: chain Lambdas and AWS calls into steps with retries and branches.',
      points: [
        'Define a state machine: tasks, choices, parallel branches, waits, maps.',
        'Built-in retries with backoff and catch blocks for errors.',
        'Standard workflows: up to 1 year, exactly-once steps, full history.',
        'Express workflows: up to 5 minutes, at-least-once, cheap for high volume.',
        'Calls 200+ AWS services directly, often with no Lambda needed.',
      ],
      tip: 'Great for the saga pattern: each step has a compensating step that undoes it on failure.',
    },
  ],
};
