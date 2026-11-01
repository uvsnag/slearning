import type { KmNode } from '../../types';

export const caching: KmNode = {
  title: 'Caching',
  level: 'intermediate',
  summary: 'How to use Redis as a cache: patterns, eviction, invalidation and avoiding stampedes.',
  simple:
    'A cache is a cheat sheet: you keep the answers you need often close by, so you don’t redo the slow work every time.',
  points: [
    'Cache what is read often, changes rarely and is slow to compute.',
    'Every cached value can be stale; decide how stale is acceptable.',
    'Always set a TTL and a memory limit with an eviction policy.',
  ],
  children: [
    {
      title: 'Cache-aside',
      level: 'beginner',
      summary: 'The app checks Redis first; on a miss it loads from the DB and stores the result.',
      simple:
        'Before going to the library, you check your notes. Not there? Go to the library, then write it in your notes for next time.',
      points: [
        'Also called lazy loading: only data that is actually asked for gets cached.',
        'On write: update the DB, then delete the cache key (don’t update it).',
        'Redis down? The app can still read from the DB, just slower.',
        'First request after expiry is slow (a cache miss).',
      ],
      detail: `<pre><code>async function getProduct(id) {
  const key = \`product:\${id}\`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const product = await db.findProduct(id);
  await redis.set(key, JSON.stringify(product), 'EX', 600);
  return product;
}</code></pre>`,
      tip: 'Delete instead of update on writes: two concurrent updates can otherwise leave an old value in the cache.',
    },
    {
      title: 'Read/Write-through',
      level: 'intermediate',
      summary: 'A cache layer that loads and writes the DB for you, so the app only talks to the cache.',
      simple: 'Like a secretary who fetches files and also files your changes, so you only ever talk to the secretary.',
      points: [
        'Read-through: the cache library loads from the DB on a miss.',
        'Write-through: every write goes to cache and DB together, synchronously.',
        'Cache stays fresh, but each write pays for two stores.',
        'Redis doesn’t do this alone; a library (Spring Cache, Redisson) or your code adds it.',
      ],
    },
    {
      title: 'Write-behind',
      level: 'advanced',
      summary: 'Write to Redis right away and flush to the DB later in batches.',
      simple: 'Like jotting orders on a notepad during the rush and typing them into the computer after.',
      points: [
        'Very fast writes and fewer DB calls.',
        'Risk: if Redis loses data before the flush, those writes are gone.',
        'Good for counters, view counts and metrics, not for payments.',
      ],
    },
    {
      title: 'Eviction policies',
      level: 'intermediate',
      summary: 'What Redis deletes when it hits maxmemory, set by maxmemory-policy.',
      simple: 'When the fridge is full, you decide what to throw out: the oldest food, the least eaten, or nothing at all.',
      points: [
        '<code>noeviction</code> (default): new writes fail with an OOM error.',
        '<code>allkeys-lru</code>: drop least recently used keys. Good default for a cache.',
        '<code>allkeys-lfu</code>: drop least frequently used keys (4.0+). Good for hot/cold data.',
        '<code>volatile-*</code>: only evict keys that have a TTL. Also random and ttl variants.',
        'LRU/LFU are approximate: Redis samples a few keys (maxmemory-samples, default 5).',
      ],
      tip: 'If Redis is a pure cache, use allkeys-lru or allkeys-lfu. If it also holds real data, use volatile-* and give cache keys a TTL.',
    },
    {
      title: 'Cache stampede',
      level: 'advanced',
      summary: 'A hot key expires and thousands of requests hit the database at the same moment.',
      simple:
        'The shop’s only sign falls down and every customer runs to the manager to ask the same question at once.',
      points: [
        'Lock: only one request rebuilds the value (SET NX); others wait or serve stale.',
        'Jitter: add random seconds to TTLs so keys don’t all expire together.',
        'Early refresh: rebuild a bit before expiry, chosen by probability (XFetch).',
        'Serve stale while revalidating in the background.',
      ],
      tip: 'Interviewers often group this with penetration and avalanche (next node). Know all three by name.',
    },
    {
      title: 'Penetration & avalanche',
      level: 'advanced',
      summary: 'Two more cache failures: requests for data that never exists, and many keys failing at once.',
      simple:
        'Penetration: people keep asking the shop for a product it never sold, so every question goes to the warehouse. Avalanche: all the price tags fall off at the same time.',
      points: [
        'Penetration: keys that never exist always miss, so every request hits the DB.',
        'Fix: cache the "not found" result with a short TTL, or check a Bloom filter first.',
        'Avalanche: lots of keys expire together, or Redis goes down, and the DB is flooded.',
        'Fix: random TTL jitter, replicas plus failover, and a circuit breaker or rate limit in front of the DB.',
      ],
      tip: 'Interview trio: stampede (one hot key), penetration (keys that don’t exist), avalanche (many keys at once).',
    },
    {
      title: 'Cache & DB consistency',
      level: 'advanced',
      summary: 'Keeping the cached copy and the database in agreement when data changes.',
      simple:
        'You have the price in your notebook and on the official board. When the board changes, your notebook must be fixed, or you quote an old price.',
      points: [
        'Usual order: write the DB first, then delete the cache key.',
        'A race can still put an old value back; a short TTL limits how long it lasts.',
        'Delayed double delete: delete, then delete again a moment later to catch that race.',
        'Strongest option: read DB changes from its log (CDC, e.g. Debezium) and delete keys from there.',
        'Writing the DB and Redis in one step is not possible; accept "eventually fresh".',
      ],
      tip: 'Never update the cache first and the DB second: if the DB write fails, the cache lies.',
    },
    {
      title: 'Client-side caching',
      level: 'expert',
      summary: 'The client keeps hot values in its own memory and Redis tells it when they change.',
      simple: 'You keep a copy of the menu at your table, and the waiter tells you when a dish changes.',
      points: [
        'Uses CLIENT TRACKING (6.0+): Redis sends invalidation messages for keys you read.',
        'Works best with RESP3, where invalidations arrive on the same connection.',
        'Turns network round trips into local memory reads for hot keys.',
        'Supported by node-redis and Lettuce/Jedis in newer versions.',
      ],
    },
  ],
};
