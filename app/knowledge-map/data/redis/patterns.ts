import type { KmNode } from '../../types';

export const patterns: KmNode = {
  title: 'Locks & Rate Limiting',
  level: 'advanced',
  summary: 'Using Redis to coordinate many app servers: distributed locks and request limits.',
  simple:
    'When many workers share one tool, Redis acts as the key hook on the wall: whoever holds the key uses the tool, and a counter at the door limits how many come in.',
  points: [
    'Atomic commands (SET NX, INCR) and Lua make these patterns safe.',
    'Always add a TTL so a crashed server can’t block others forever.',
    'Know the limits: Redis locks are best for efficiency, not strict correctness.',
  ],
  children: [
    {
      title: 'Deduplication',
      level: 'intermediate',
      summary: 'Use SET NX with a TTL to make sure the same request or message is handled only once.',
      simple:
        'Stamp each letter with "done" when you handle it. If a letter arrives with the stamp already there, you skip it.',
      points: [
        'Key = the request’s idempotency key or the message ID.',
        'SET NX succeeds only for the first caller; repeats get null and skip the work.',
        'TTL = how long duplicates can arrive (minutes for retries, a day for webhooks).',
        'Great for payment webhooks and at-least-once consumers (Kafka, Streams).',
      ],
      detail: `<pre><code>const first = await client.set(\`done:\${msg.id}\`, '1', { NX: true, EX: 86400 });
if (!first) return; // seen it already
await handle(msg);</code></pre>`,
      tip: 'If handling can fail, delete the key on error, or store a "processing" state, so a retry can still run.',
    },
    {
      title: 'Simple lock',
      level: 'intermediate',
      summary: 'SET key token NX PX 30000: create the lock only if nobody holds it, with a timeout.',
      simple: 'Hang your name tag on the meeting room door. If a tag is already there, wait. The tag falls off by itself after 30 seconds.',
      points: [
        'NX: only set if missing. PX: auto-expire in milliseconds.',
        'Use a random token as the value so you know the lock is yours.',
        'Never use SETNX then EXPIRE as two steps: a crash in between leaves a lock forever.',
        'Pick a TTL longer than the work, or extend it while working.',
      ],
      detail: `<pre><code>String token = UUID.randomUUID().toString();
String ok = jedis.set("lock:invoice:42", token,
    SetParams.setParams().nx().px(30_000));
if ("OK".equals(ok)) {
    try { generateInvoice(42); }
    finally { releaseLock("lock:invoice:42", token); }
}</code></pre>`,
    },
    {
      title: 'Safe release',
      level: 'advanced',
      summary: 'Delete the lock only if it still holds your token, using a Lua script.',
      simple: 'Only take your own name tag off the door, never someone else’s.',
      points: [
        'If your work ran longer than the TTL, someone else may now own the lock.',
        'GET then DEL in two steps has a race; Lua makes it one atomic step.',
        'This compare-and-delete script works on every Redis and Valkey version.',
        'Newer servers add it as one command: <code>DELEX key IFEQ token</code> (Redis 8.4+), <code>DELIFEQ</code> (Valkey 9+).',
      ],
      detail: `<pre><code>const RELEASE = \`
  if redis.call('GET', KEYS[1]) == ARGV[1] then
    return redis.call('DEL', KEYS[1])
  end
  return 0\`;
await redis.eval(RELEASE, 1, 'lock:invoice:42', token);</code></pre>`,
    },
    {
      title: 'Redlock & fencing',
      level: 'expert',
      summary: 'Redlock takes the lock on a majority of independent Redis nodes; fencing tokens guard the resource.',
      points: [
        'Redlock: lock on N (often 5) masters; success if a majority agrees in time.',
        'Martin Kleppmann showed GC pauses and clock jumps can still give two owners.',
        'Fencing token: an increasing number the storage checks, rejecting old holders.',
        'If two owners would corrupt data, use a consensus system (ZooKeeper, etcd) or DB constraints.',
      ],
      tip: 'Interview answer: "Redis locks are fine for avoiding duplicate work. For correctness, add fencing tokens or use a consensus store."',
    },
    {
      title: 'Fixed window limit',
      level: 'intermediate',
      summary: 'Count requests per user per time window with INCR and a TTL.',
      simple: 'A bouncer with a clicker who resets it every minute: after 100 clicks, nobody else gets in until the reset.',
      points: [
        'Key includes the window: <code>rl:user42:202611011030</code>.',
        'INCR, and on the first hit set EXPIRE to the window size.',
        'Simple and cheap, but allows bursts at window edges (up to 2x).',
      ],
      detail: `<pre><code>async function allow(userId, limit = 100) {
  const key = \`rl:\${userId}:\${Math.floor(Date.now() / 60000)}\`;
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, 60);
  return count &lt;= limit;
}</code></pre>`,
    },
    {
      title: 'Sliding window & token bucket',
      level: 'advanced',
      summary: 'Smoother limits: a sorted set of timestamps, or a bucket of tokens refilled over time.',
      simple:
        'Sliding window: count visits in the last 60 seconds, not "this minute". Token bucket: you get coins at a steady pace and spend one per request.',
      points: [
        'Sliding log: ZADD now, ZREMRANGEBYSCORE older than the window, ZCARD to count.',
        'Accurate, but stores one entry per request.',
        'Token bucket: store tokens and last refill time; refill and spend in one Lua script.',
        'Token bucket allows controlled bursts and is used by most API gateways.',
      ],
      tip: 'Do the check-and-update in Lua or MULTI, otherwise two parallel requests can both slip through.',
    },
  ],
};
