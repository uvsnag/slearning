import type { KmNode } from '../../types';

export const coreTypes: KmNode = {
  title: 'Core Data Types',
  level: 'beginner',
  summary: 'The five everyday types: strings, lists, hashes, sets and sorted sets.',
  simple:
    'Each type is a different kind of container: a single box, a queue, a form with fields, a bag of unique items and a ranked scoreboard.',
  points: [
    'Each key holds exactly one type. Using the wrong command gives a WRONGTYPE error.',
    'Pick the type that matches how you read the data, not just how you store it.',
    'Most commands on these types are O(1) or O(log N), so they stay fast.',
  ],
  children: [
    {
      title: 'Strings',
      level: 'beginner',
      summary: 'The simplest type: a key holds text, a number or any bytes up to 512 MB.',
      simple: 'A string is one labelled box with one thing inside.',
      points: [
        'Store text, JSON, serialized objects or even small images.',
        'INCR / INCRBY / DECR treat the value as a number, atomically.',
        'SET with NX only writes if the key is missing; XX only if it exists.',
        'MGET / MSET read or write many keys in one round trip.',
      ],
      detail: `<pre><code>jedis.set("page:home:views", "0");
jedis.incr("page:home:views");          // 1, safe with many app servers
jedis.set("config:theme", "dark",
    SetParams.setParams().nx().ex(3600)); // only if missing, 1 hour TTL</code></pre>`,
      tip: 'Storing a whole object as one JSON string is fine if you always read it whole. If you update single fields, use a hash.',
    },
    {
      title: 'Lists',
      level: 'beginner',
      summary: 'An ordered list of strings where you push and pop at both ends quickly.',
      simple: 'Like a line of people: you can join at the back, leave at the front, or the other way round.',
      points: [
        'LPUSH / RPUSH add, LPOP / RPOP remove, LRANGE reads a slice.',
        'Push and pop at the ends are O(1); reaching into the middle is O(N).',
        'BLPOP / BRPOP wait until an item arrives: a simple work queue.',
        'LTRIM keeps only the newest N items, great for "latest 100 events".',
      ],
      detail: `<pre><code>await redis.lpush('news:latest', JSON.stringify(item));
await redis.ltrim('news:latest', 0, 99);      // keep 100 newest
const top10 = await redis.lrange('news:latest', 0, 9);</code></pre>`,
      tip: 'A list queue loses a job if the worker crashes after popping it. Use LMOVE to a "processing" list, or use Streams.',
    },
    {
      title: 'Hashes',
      level: 'beginner',
      summary: 'A map of field → value pairs under one key, perfect for objects.',
      simple: 'A hash is a filled-in form: one form (the key) with many labelled boxes (the fields).',
      points: [
        'HSET / HGET / HGETALL / HINCRBY work on single fields.',
        'Update one field without rewriting the whole object.',
        'Small hashes are stored very compactly in memory (listpack encoding).',
        'Since 7.4 each field can have its own TTL (HEXPIRE).',
      ],
      detail: `<pre><code>await client.hSet('user:42', { name: 'Ana', plan: 'pro', logins: 0 });
await client.hIncrBy('user:42', 'logins', 1);
const user = await client.hGetAll('user:42'); // { name, plan, logins }</code></pre>`,
    },
    {
      title: 'Sets',
      level: 'beginner',
      summary: 'An unordered collection of unique strings with fast membership checks.',
      simple: 'A bag of name tags: no duplicates allowed, and you can ask "is Ana in the bag?" instantly.',
      points: [
        'SADD adds, SISMEMBER checks, SREM removes, SCARD counts.',
        'Set math: SINTER (common), SUNION (all), SDIFF (difference).',
        'Use cases: tags, unique visitors per day, "who liked this post".',
        'SMEMBERS on a huge set blocks the server; use SSCAN instead.',
      ],
      detail: `<pre><code>jedis.sadd("post:7:likes", "u1", "u2", "u3");
boolean liked = jedis.sismember("post:7:likes", "u2"); // true
Set&lt;String&gt; both = jedis.sinter("post:7:likes", "post:8:likes");</code></pre>`,
    },
    {
      title: 'Sorted Sets',
      level: 'intermediate',
      summary: 'Unique members, each with a score, always kept sorted by that score.',
      simple: 'A live scoreboard: every player has points, and the board is always in order.',
      points: [
        'ZADD adds or updates a score; ZINCRBY bumps it.',
        'ZRANGE with REV / BYSCORE reads top N or a score range in O(log N + M).',
        'ZRANK tells a member’s position on the board.',
        'Also great for time-ordered data: use a timestamp as the score.',
      ],
      detail: `<pre><code>await client.zAdd('game:lb', [
  { score: 1500, value: 'ana' },
  { score: 1720, value: 'bo' },
]);
await client.zIncrBy('game:lb', 50, 'ana');
const top3 = await client.zRange('game:lb', 0, 2, { REV: true });</code></pre>`,
      tip: 'Classic interview question: "design a leaderboard". Answer: sorted set, ZINCRBY on score, ZRANGE REV for top N.',
    },
  ],
};

export const specialTypes: KmNode = {
  title: 'Special Data Types',
  level: 'intermediate',
  summary: 'Types for special jobs: streams, bitmaps, counters, geo, JSON, search and vectors.',
  simple:
    'Beyond everyday boxes, Redis has special tools: a logbook, a light-switch panel, a rough head-counter, a map and a document folder.',
  points: [
    'These solve common problems with far less memory or code than doing it yourself.',
    'Bitmaps, HyperLogLog and geo are built on top of strings and sorted sets.',
    'JSON, Bloom, time series, search and vector sets are built in since Redis 8 (once modules).',
  ],
  children: [
    {
      title: 'Streams',
      level: 'intermediate',
      summary: 'An append-only log of entries, each with an auto-generated time-based ID.',
      simple: 'A ship’s logbook: new entries are only added at the end, and anyone can read from any page.',
      points: [
        'XADD appends an entry (a small map of fields) and returns an ID like <code>1700000000000-0</code>.',
        'XRANGE reads by ID range; XREAD reads new entries, optionally blocking.',
        'Unlike Pub/Sub, entries are stored, so readers can catch up later.',
        'Covered in depth in the Messaging branch (consumer groups).',
      ],
    },
    {
      title: 'Bitmaps',
      level: 'intermediate',
      summary: 'Treat a string as a long row of bits you can set and count.',
      simple: 'A long panel of light switches: switch number 42 on means user 42 did something today.',
      points: [
        'SETBIT / GETBIT flip and read one bit; BITCOUNT counts the ones.',
        'BITOP AND / OR combine days, e.g. "active every day this week".',
        '10 million users fit in about 1.2 MB.',
        'Works best with dense numeric IDs; sparse IDs waste memory.',
      ],
      detail: `<pre><code>jedis.setbit("active:2026-11-01", userId, true);
long dau = jedis.bitcount("active:2026-11-01"); // daily active users</code></pre>`,
    },
    {
      title: 'HyperLogLog',
      level: 'intermediate',
      summary: 'Counts unique items approximately using a tiny, fixed 12 KB of memory.',
      simple: 'A bouncer who can’t remember faces but can tell you "about 10,000 different people came in tonight".',
      points: [
        'PFADD adds items, PFCOUNT returns the estimated unique count.',
        'Standard error is about 0.81%, no matter how many items.',
        'PFMERGE combines counters, e.g. daily into weekly.',
        'You can’t list the items back; it only counts.',
      ],
      detail: `<pre><code>await redis.pfadd('visitors:2026-11-01', ip);
const unique = await redis.pfcount('visitors:2026-11-01');</code></pre>`,
    },
    {
      title: 'Bloom filter & friends',
      level: 'intermediate',
      summary: 'Tiny "probably yes / definitely no" structures for membership, top items and frequency.',
      simple:
        'A guest list with smudged ink: if your name isn’t there, you’re surely not invited. If it seems to be there, it’s very likely, but not 100% sure.',
      points: [
        'Bloom filter: BF.ADD / BF.EXISTS. No false negatives, a small chance of false positives.',
        'Cuckoo filter: like Bloom, but you can also delete items.',
        'Top-K and Count-Min Sketch: "most popular items" and "roughly how often" with fixed memory.',
        'Built into Redis 8; before that they came from the RedisBloom module (Redis Stack).',
      ],
      detail: `<pre><code>await client.bf.reserve('seen:emails', 0.01, 1_000_000); // 1% error
await client.bf.add('seen:emails', 'ana@x.com');
const maybe = await client.bf.exists('seen:emails', 'bo@x.com'); // false = surely new</code></pre>`,
      tip: 'Classic use: stop cache penetration by checking a Bloom filter of real IDs before touching the cache or DB.',
    },
    {
      title: 'Time series',
      level: 'intermediate',
      summary: 'A type for timestamped numbers, like metrics or sensor readings, with built-in downsampling.',
      simple: 'A thermometer that writes down the temperature every second and can tell you the hourly average.',
      points: [
        'TS.ADD stores a value at a time; TS.RANGE reads a window, with aggregation (avg, max…).',
        'Retention drops old samples for you; compaction rules keep per-minute or per-hour rollups.',
        'Labels let you query many series at once with TS.MRANGE.',
        'In Redis 8 core; earlier it was the RedisTimeSeries module.',
      ],
    },
    {
      title: 'Geospatial',
      level: 'intermediate',
      summary: 'Store longitude/latitude points and search by radius or box.',
      simple: 'A map with pins: "show me all coffee shops within 2 km of me".',
      points: [
        'GEOADD stores points; under the hood it is a sorted set with geohash scores.',
        'GEOSEARCH finds members by radius or box (6.2+, replaces GEORADIUS).',
        'GEODIST gives the distance between two members.',
      ],
      detail: `<pre><code>await client.geoAdd('shops', { longitude: 106.70, latitude: 10.77, member: 'cafe-1' });
const near = await client.geoSearch('shops',
  { longitude: 106.69, latitude: 10.78 }, { radius: 2, unit: 'km' });</code></pre>`,
    },
    {
      title: 'JSON',
      level: 'intermediate',
      summary: 'Store real JSON documents and read or update parts of them by path.',
      simple: 'Instead of a sealed envelope you must open and reseal, it’s a folder where you can edit one page directly.',
      points: [
        'JSON.SET / JSON.GET with JSONPath like <code>$.address.city</code>.',
        'Update a nested field atomically without rewriting the whole document.',
        'Built into Redis 8; earlier versions needed the RedisJSON module (Redis Stack).',
        'Combine with the query engine to index and search JSON fields.',
      ],
      detail: `<pre><code>await client.json.set('user:42', '$', { name: 'Ana', tags: ['vip'] });
await client.json.arrAppend('user:42', '$.tags', 'beta');
const name = await client.json.get('user:42', { path: '$.name' });</code></pre>`,
      tip: 'Valkey ships JSON as a separate module (valkey-json), so check what your server actually has.',
    },
    {
      title: 'Query engine (search)',
      level: 'advanced',
      summary: 'Build secondary indexes over hashes or JSON and query them by field, text, range or tag.',
      simple:
        'Normally you can only find a box by its label. The query engine adds a card catalog, so you can ask "all users in Hanoi on the pro plan".',
      points: [
        'FT.CREATE defines an index on a key prefix, e.g. every <code>user:*</code> hash.',
        'Field types: TEXT (full-text), TAG (exact values), NUMERIC (ranges), GEO, VECTOR.',
        'FT.SEARCH finds documents; FT.AGGREGATE groups and counts like a mini GROUP BY.',
        'Indexes update automatically as keys change, costing extra RAM and CPU.',
        'Built into Redis 8 (was RediSearch); Valkey has its own valkey-search module.',
      ],
      detail: `<pre><code>await client.ft.create('idx:users', {
  '$.city': { type: 'TAG', AS: 'city' },
  '$.age': { type: 'NUMERIC', AS: 'age' },
}, { ON: 'JSON', PREFIX: 'user:' });

const res = await client.ft.search('idx:users', '@city:{Hanoi} @age:[18 30]');</code></pre>`,
    },
    {
      title: 'Vectors & AI',
      level: 'advanced',
      summary: 'Store embeddings (lists of numbers that capture meaning) and find the most similar ones fast.',
      simple:
        'Every sentence becomes a point on a huge map. Similar meanings sit close together, and Redis finds your nearest neighbours.',
      points: [
        'Query engine: a VECTOR field with HNSW or FLAT index; KNN queries via FT.SEARCH.',
        'Vector sets (Redis 8, new type): VADD / VSIM, a sorted-set-like type for similarity.',
        'Common uses: semantic search, RAG (feeding docs to an LLM), recommendations.',
        'Semantic caching: reuse an LLM answer when a new question means the same thing.',
      ],
      tip: 'Vectors eat RAM fast (1M × 1536 floats ≈ 6 GB). Consider smaller embeddings or quantization.',
    },
  ],
};
