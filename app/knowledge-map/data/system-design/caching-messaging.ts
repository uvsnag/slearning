import type { KmNode } from '../../types';

export const caching: KmNode = {
  title: 'Caching',
  level: 'intermediate',
  summary:
    'Keeping copies of hot data in fast storage so you don’t recompute or refetch it every time.',
  simple:
    'Keep the things you use every day on your desk instead of walking to the basement archive each time.',
  points: [
    'Caches live at many layers: browser, CDN, app memory, Redis, database buffer.',
    'The hard parts are freshness (invalidation) and what happens on a miss.',
    'Cache what is read often and changes rarely.',
  ],
  children: [
    {
      title: 'Cache-Aside',
      level: 'intermediate',
      summary:
        'The app checks the cache first; on a miss it reads the database and fills the cache.',
      simple:
        'Look on your desk first. Not there? Fetch it from the archive and leave a copy on the desk for next time.',
      points: [
        'The most common pattern (also called lazy loading).',
        'Only requested data gets cached.',
        'On update: write the database, then delete the cache entry.',
        'First read after a miss or restart is slow.',
      ],
      detail: `<pre><code>async function getUser(id) {
  const cached = await redis.get('user:' + id);
  if (cached) return JSON.parse(cached);

  const user = await db.users.findById(id);
  await redis.set('user:' + id, JSON.stringify(user), { EX: 300 });
  return user;
}</code></pre>`,
    },
    {
      title: 'Write-Through & Write-Back',
      level: 'intermediate',
      summary:
        'Write strategies: update cache and database together, or write to the cache and save later.',
      simple:
        'Write-through: you update the notebook and the master file at once. Write-back: you scribble in the notebook and copy it to the master file later.',
      points: [
        'Write-through: cache always fresh, but every write pays for both.',
        'Write-back (write-behind): very fast writes, but data can be lost if the cache dies.',
        'Write-around: write only the database; the cache fills on the next read.',
      ],
    },
    {
      title: 'Eviction & TTL',
      level: 'intermediate',
      summary: 'Rules for what to throw out when the cache is full, and when entries expire.',
      simple:
        'A small fridge: when it’s full, the thing you haven’t touched in longest goes first.',
      points: [
        'LRU (least recently used): the usual default.',
        'LFU (least frequently used): keeps popular items longer.',
        'TTL (time to live): entries expire after a set time, which limits staleness.',
        'Add random jitter to TTLs so many keys don’t expire at the same moment.',
      ],
    },
    {
      title: 'Cache Invalidation',
      level: 'advanced',
      summary: 'Making sure the cache doesn’t keep serving data that changed in the database.',
      points: [
        'Delete (don’t update) the cache entry after a database write; it avoids races between writers.',
        'Short TTLs are a simple safety net for anything you miss.',
        'Event-driven invalidation: publish a change event, caches listen and delete.',
        'Versioned keys (<code>user:42:v7</code>) make old entries simply unused.',
      ],
      tip: '"There are only two hard things in computer science: cache invalidation and naming things." Expect a follow-up question on it.',
    },
    {
      title: 'Cache Stampede',
      level: 'advanced',
      summary: 'Many requests miss the same hot key at once and all hit the database together.',
      points: [
        'Also called thundering herd or dog-piling.',
        'Request coalescing: only one request rebuilds the value; others wait for it.',
        'Refresh popular keys a little before they expire.',
        'Serve the stale value while one worker refreshes in the background.',
      ],
    },
    {
      title: 'Redis',
      level: 'intermediate',
      summary:
        'An in-memory data store used as a cache, session store, rate limiter, queue and more.',
      simple: 'A super-fast shared whiteboard that every server can read and write.',
      points: [
        'Data types: strings, hashes, lists, sets, sorted sets, streams.',
        'Sorted sets make leaderboards easy; atomic <code>INCR</code> makes counters and rate limits easy.',
        'Mostly single-threaded command execution, so each command is atomic.',
        'Persistence (RDB snapshots, AOF log) is optional; treat a cache as losable.',
        'Valkey is the open-source fork many clouds now offer.',
      ],
    },
  ],
};

export const messaging: KmNode = {
  title: 'Async & Messaging',
  level: 'intermediate',
  summary:
    'Queues, pub/sub and background jobs that decouple parts of the system and absorb spikes.',
  simple:
    'Instead of handing a task to a busy colleague and waiting, you drop it in their inbox and get on with your day.',
  points: [
    'Async processing makes user requests fast: reply now, do the slow work later.',
    'Queues smooth out traffic spikes and let workers scale on their own.',
    'For Kafka details and microservice messaging, see the Kafka and Microservices topics.',
  ],
  children: [
    {
      title: 'Message Queues',
      level: 'intermediate',
      summary: 'A buffer where producers drop tasks and workers pick them up one at a time.',
      simple:
        'A ticket machine at a deli: orders wait in line, and any free worker takes the next one.',
      points: [
        'Examples: RabbitMQ, Amazon SQS, Kafka (log-based).',
        'Each message is handled by one worker (competing consumers).',
        'Producers keep working even if workers are slow or down.',
        'Use for emails, image processing, payments follow-up, anything slow or retryable.',
      ],
    },
    {
      title: 'Pub/Sub',
      level: 'intermediate',
      summary: 'A message is broadcast to every subscriber, not just one worker.',
      simple: 'A radio station: everyone tuned in hears the same broadcast.',
      points: [
        'Queue: one message → one consumer. Pub/sub: one message → every subscriber.',
        'Lets new features react to events without changing the publisher.',
        'Examples: Kafka topics with several consumer groups, SNS, Redis Pub/Sub, Google Pub/Sub.',
      ],
    },
    {
      title: 'Delivery Guarantees',
      level: 'advanced',
      summary:
        'At-most-once, at-least-once, and "exactly-once" — and why consumers must be idempotent.',
      points: [
        'At-least-once is the practical default: no loss, but duplicates happen.',
        'Make consumers idempotent: handling a message twice has the same effect as once.',
        'Ordering is usually only guaranteed per queue partition or message group.',
        'Failed messages go to a dead-letter queue (DLQ) for inspection.',
      ],
    },
    {
      title: 'Background Jobs',
      level: 'intermediate',
      summary:
        'Work that runs outside the request: retries, scheduled tasks and long-running processes.',
      simple: 'The night shift: tasks that don’t need the customer waiting at the counter.',
      points: [
        'Return 202 Accepted with a job id; let the client poll or get notified.',
        'Scheduled jobs (cron) must handle running twice or overlapping.',
        'Store job state so a crashed worker’s job can be picked up again.',
        'Workflow engines (Temporal, Step Functions) handle long multi-step processes.',
      ],
    },
    {
      title: 'Batch vs Stream',
      level: 'advanced',
      summary: 'Process data in big scheduled chunks, or continuously as each event arrives.',
      points: [
        'Batch (Spark, nightly jobs): simple, efficient, results are hours old.',
        'Stream (Kafka Streams, Flink): results in seconds, harder to build and operate.',
        'Many systems combine both: a fast approximate stream + a correct nightly batch.',
        'Typical uses: analytics, recommendations, fraud detection, search indexing.',
      ],
    },
    {
      title: 'Event-Driven Design',
      level: 'advanced',
      summary:
        'Services announce facts ("OrderPlaced") and others react, instead of calling each other directly.',
      points: [
        'Loose coupling: the publisher doesn’t know who listens.',
        'Harder to follow a flow end to end; you need tracing and good event docs.',
        'To publish events reliably with a DB change, use the transactional outbox pattern.',
        'Sagas coordinate multi-step business flows (see the Microservices topic).',
      ],
    },
  ],
};
