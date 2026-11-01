import type { KmNode } from '../../types';

export const messaging: KmNode = {
  title: 'Pub/Sub & Streams',
  level: 'intermediate',
  summary: 'Two ways to pass messages: fire-and-forget Pub/Sub and stored, replayable Streams.',
  simple:
    'Pub/Sub is a radio broadcast: if you aren’t listening right now, you miss it. Streams are a recorded podcast: you can listen whenever you like.',
  points: [
    'Pub/Sub: live, no storage, at-most-once delivery.',
    'Streams: stored log, consumer groups, acknowledgements, replay.',
    'Keyspace notifications let you react to changes on keys.',
  ],
  children: [
    {
      title: 'Pub/Sub',
      level: 'intermediate',
      summary: 'Publishers send to a channel; every subscriber connected right now gets a copy.',
      simple: 'Like a group chat with no history: only people in the room see the message.',
      points: [
        'PUBLISH channel message; SUBSCRIBE or PSUBSCRIBE (patterns like <code>news.*</code>).',
        'Nothing is stored: offline or slow subscribers lose messages.',
        'A subscribed connection can’t run normal commands (in RESP2), so use a separate one.',
        'Great for live updates, cache invalidation signals, chat typing indicators.',
      ],
      detail: `<pre><code>const sub = client.duplicate();
await sub.connect();
await sub.subscribe('orders', (msg) =&gt; console.log('got', msg));

await client.publish('orders', JSON.stringify({ id: 42 }));</code></pre>`,
      children: [
        {
          title: 'Sharded Pub/Sub',
          level: 'advanced',
          summary: 'Channels tied to a hash slot in Cluster (7.0+), so messages don’t flood every node.',
          simple: 'Instead of shouting in every room of the building, you only speak in the room that owns the topic.',
          points: [
            'Classic Pub/Sub in Cluster broadcasts every message to all nodes.',
            'SSUBSCRIBE / SPUBLISH keep traffic on the shard that owns the channel.',
            'Scales much better with many nodes.',
          ],
        },
      ],
    },
    {
      title: 'Stream basics',
      level: 'intermediate',
      summary: 'Append entries with XADD and read them by ID with XRANGE or XREAD.',
      simple: 'A diary where every entry has a timestamped page number, so you can always say "show me from page X".',
      points: [
        'IDs are <code>milliseconds-sequence</code>; use <code>*</code> to let Redis create them.',
        'XREAD BLOCK waits for new entries, like a tail -f.',
        'Use <code>$</code> to read only new entries, or an ID to resume from a point.',
        'Trim with MAXLEN or MINID; <code>~</code> makes trimming cheaper and approximate.',
      ],
      detail: `<pre><code>await redis.xadd('orders', 'MAXLEN', '~', 100000, '*',
  'orderId', '42', 'status', 'PAID');

const res = await redis.xread('BLOCK', 5000, 'STREAMS', 'orders', '$');</code></pre>`,
    },
    {
      title: 'Consumer groups',
      level: 'advanced',
      summary: 'Several workers share one stream; each entry goes to one worker and must be acknowledged.',
      simple:
        'A team sorting the same pile of mail: each letter goes to one person, and they sign it off when done. Unsigned letters can be handed to someone else.',
      points: [
        'XGROUP CREATE makes a group; XREADGROUP with <code>&gt;</code> gets new entries.',
        'Delivered but not yet acked entries sit in the Pending Entries List (PEL).',
        'XACK marks an entry done after you process it.',
        'XAUTOCLAIM (6.2+) moves stuck entries from dead workers to live ones.',
        'Delivery is at-least-once: make your handlers idempotent.',
      ],
      detail: `<pre><code>await redis.xgroup('CREATE', 'orders', 'billing', '$', 'MKSTREAM');
const batch = await redis.xreadgroup('GROUP', 'billing', 'worker-1',
  'COUNT', 10, 'BLOCK', 5000, 'STREAMS', 'orders', '&gt;');
// ...process each entry, then:
await redis.xack('orders', 'billing', entryId);</code></pre>`,
      tip: 'Watch XPENDING. A growing PEL means workers crash or forget to ack.',
    },
    {
      title: 'Job & delayed queues',
      level: 'advanced',
      summary: 'Build reliable work queues and "run this later" jobs from lists and sorted sets.',
      simple:
        'A to-do tray where a worker moves a task to their own "doing" tray before starting, plus a calendar of tasks due later.',
      points: [
        'Reliable list queue: BLMOVE from <code>jobs</code> to <code>jobs:processing</code>, remove when done.',
        'A janitor puts stuck items from the processing list back into the queue.',
        'Delayed jobs: sorted set with the run time as score; poll for scores &lt;= now.',
        'Ready-made: BullMQ (Node.js) and Redisson queues (Java) handle retries and delays for you.',
      ],
      detail: `<pre><code>// delayed job: run in 10 minutes
await client.zAdd('jobs:delayed', { score: Date.now() + 600_000, value: jobId });

// worker: move due jobs to the ready queue
const due = await client.zRangeByScore('jobs:delayed', 0, Date.now());
for (const id of due) {
  if (await client.zRem('jobs:delayed', id)) await client.lPush('jobs', id);
}</code></pre>`,
      tip: 'Only the worker whose ZREM returns 1 moves the job, so two workers can’t both take it.',
    },
    {
      title: 'Streams vs Kafka',
      level: 'advanced',
      summary: 'Streams feel like a mini Kafka, but in memory and on a single key.',
      simple: 'Streams are a handy notebook on your desk; Kafka is a warehouse of notebooks built to keep data for months.',
      points: [
        'Streams live in RAM, so long history is expensive.',
        'One stream is one key, so it lives on one Cluster shard.',
        'Great for small to medium event flows, job queues and activity feeds.',
        'Pick Kafka for huge volume, long retention and a big connector ecosystem.',
      ],
    },
    {
      title: 'Keyspace notifications',
      level: 'advanced',
      summary: 'Redis publishes Pub/Sub events when keys are changed, deleted or expire.',
      simple: 'Like a doorbell that rings whenever someone touches one of your boxes.',
      points: [
        'Off by default; enable with the notify-keyspace-events config.',
        'Channels like <code>__keyevent@0__:expired</code>.',
        'Expired events fire when Redis actually deletes the key, which can be late.',
        'Fire-and-forget like all Pub/Sub, so don’t build critical timers on it.',
      ],
    },
  ],
};
