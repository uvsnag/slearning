import type { KmNode } from '../../types';

export const buildingBlocks: KmNode = {
  title: 'Handy Building Blocks',
  level: 'advanced',
  summary: 'Small, clever techniques that show up again and again inside large systems.',
  simple:
    'These are the special tools in the toolbox. You don’t use them every day, but when you need one, nothing else does the job as well.',
  points: [
    'Unique IDs, probabilistic data structures and spatial indexes solve common scale problems.',
    'Knowing they exist lets you name them in an interview instead of reinventing them.',
  ],
  children: [
    {
      title: 'Unique ID Generation',
      level: 'advanced',
      summary: 'Creating unique IDs across many machines without a central counter.',
      points: [
        'Database auto-increment: simple, but one bottleneck and leaks how many rows you have.',
        'UUID v4: random, no coordination, but large and bad for index locality.',
        'UUID v7 / ULID: time-ordered and random, good database keys.',
        'Snowflake-style: 41-bit timestamp + 10-bit machine id + 12-bit sequence in a 64-bit number.',
      ],
      detail: `<pre><code>// Snowflake-style id (BigInt to keep 64 bits)
function nextId(machineId, seq, nowMs, epochMs) {
  return (BigInt(nowMs - epochMs) &lt;&lt; 22n)
    | (BigInt(machineId) &lt;&lt; 12n)
    | BigInt(seq);
}</code></pre>`,
    },
    {
      title: 'Bloom Filter',
      level: 'advanced',
      summary: 'A tiny bit array that answers "definitely not present" or "maybe present".',
      points: [
        'No false negatives, but some false positives.',
        'Uses far less memory than storing every key.',
        'Used to skip disk lookups in databases (Cassandra, RocksDB) and check "username taken?" quickly.',
        'You can’t delete items from a basic Bloom filter.',
      ],
    },
    {
      title: 'Counting at Scale',
      level: 'expert',
      summary: 'Approximate structures that count huge streams with little memory.',
      points: [
        'HyperLogLog: counts unique items (e.g. unique visitors) in ~12 KB with ~1% error.',
        'Count-Min Sketch: estimates how often each item appears (top searches, heavy hitters).',
        'Redis has HyperLogLog built in (<code>PFADD</code>, <code>PFCOUNT</code>).',
        'Use when exact numbers are not worth the memory or time.',
      ],
    },
    {
      title: 'Geospatial Indexing',
      level: 'advanced',
      summary: 'Indexes that answer "what is near me?" fast: geohash, quadtrees, S2 or H3 cells.',
      points: [
        'Geohash: turns lat/long into a string; shared prefixes mean nearby areas.',
        'Quadtree: splits the map into four squares again and again where points are dense.',
        'Uber’s H3 and Google’s S2 split the globe into cells for fast lookups.',
        'Databases support it too: PostGIS, Redis <code>GEOSEARCH</code>, Elasticsearch geo queries.',
      ],
    },
    {
      title: 'Leaderboards & Counters',
      level: 'intermediate',
      summary: 'Fast rankings and counts using in-memory structures instead of heavy SQL queries.',
      simple:
        'Keep the scoreboard on a whiteboard everyone can see, instead of recounting every game from the archive.',
      points: [
        'Redis sorted sets: add score and get rank in O(log n).',
        'Hot counters (likes, views): count in memory, flush to the database in batches.',
        'Shard a very hot counter into several keys and sum them on read.',
      ],
    },
    {
      title: 'Fan-out on Write vs Read',
      level: 'advanced',
      summary: 'Build feeds ahead of time when someone posts, or assemble them when someone reads.',
      points: [
        'Fan-out on write (push): copy each post into followers’ feeds; reads are instant.',
        'Fan-out on read (pull): gather posts from everyone you follow at read time; writes are cheap.',
        'Celebrities with millions of followers make push too expensive.',
        'Hybrid: push for normal users, pull for celebrities at read time.',
      ],
    },
  ],
};
