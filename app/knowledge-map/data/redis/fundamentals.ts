import type { KmNode } from '../../types';

export const fundamentals: KmNode = {
  title: 'Fundamentals',
  level: 'beginner',
  summary:
    'What Redis is, what people use it for, how keys work and how to make data expire on its own.',
  simple:
    'Redis is a giant dictionary that lives in memory. You give it a name (the key) and a value, and later you get the value back in well under a millisecond.',
  points: [
    'Redis keeps all data in RAM, so reads and writes are extremely fast.',
    'Every piece of data lives under a key, like a file name.',
    'Keys can have a TTL (time to live) so they delete themselves.',
  ],
  children: [
    {
      title: 'What is Redis?',
      level: 'beginner',
      summary: 'An in-memory key-value store with rich data types, used as cache, database and message broker.',
      simple:
        'Think of Redis as a whiteboard next to your desk. Writing and reading is instant, unlike walking to the archive room (your database) every time.',
      points: [
        'Name means REmote DIctionary Server. Created by Salvatore Sanfilippo (antirez) in 2009.',
        'Values are not just strings: lists, hashes, sets, sorted sets, streams and more.',
        'Commands run one at a time, so each single command is atomic (all or nothing).',
        'It can save data to disk (RDB, AOF), but RAM is the main home of the data.',
        'Typical latency is under 1 ms; one server can do 100k+ operations per second.',
      ],
      tip: 'In an interview: "Redis is an in-memory data structure server". Stress the data structures, not just "a cache".',
    },
    {
      title: 'Use cases',
      level: 'beginner',
      summary: 'Caching, sessions, counters, leaderboards, rate limits, queues, locks and real-time messaging.',
      simple:
        'Redis is the Swiss army knife of the backend: one small tool that handles many small jobs very fast.',
      points: [
        'Cache: keep results of slow DB queries or API calls for a while.',
        'Sessions: store logged-in user data shared by all your app servers.',
        'Counters and rate limits: INCR is atomic and fast.',
        'Leaderboards: sorted sets keep players ranked by score automatically.',
        'Messaging: Pub/Sub for live notifications, Streams for durable event queues.',
      ],
      tip: 'Don’t use Redis as your only source of truth for data you can’t afford to lose, unless you set up persistence and replication carefully.',
    },
    {
      title: 'Redis vs others',
      level: 'beginner',
      summary: 'How Redis compares to Memcached and to a normal disk-based database.',
      simple:
        'A database is the library: big, safe, slower. Memcached is a sticky note: fast but only plain text. Redis is a smart notebook: fast and organized.',
      points: [
        'Memcached: strings only, multi-threaded, no persistence or replication built in.',
        'Redis: many data types, persistence, replication, scripting, pub/sub.',
        'SQL databases: data bigger than RAM, joins, rich queries, strong durability.',
        'Usually Redis sits next to your database, not instead of it.',
      ],
    },
    {
      title: 'Licensing & Valkey',
      level: 'beginner',
      summary: 'Redis changed its license twice, and a community fork called Valkey was born.',
      simple:
        'It’s like a popular free recipe that the owner suddenly put under stricter rules. Some cooks copied the old free version and kept improving it under a new name.',
      points: [
        'Up to 7.2, Redis was open source under the BSD license.',
        'March 2024: Redis 7.4+ moved to RSALv2 / SSPLv1 (source-available, limits cloud resellers).',
        'Valkey: fork of Redis 7.2.4 under the Linux Foundation, still BSD, backed by AWS, Google and others.',
        'May 2025: Redis 8 added AGPLv3 as a third option, so it is open source again.',
        'Redis 8 also folded JSON, search, time series and probabilistic types into the core.',
        'Both keep moving: Valkey 9 (Oct 2025) added numbered databases in Cluster; Redis 8 added vector sets.',
      ],
      tip: 'Valkey and Redis are mostly compatible at the command level, so the same clients usually work with both.',
    },
    {
      title: 'Keys & naming',
      level: 'beginner',
      summary: 'Keys are binary-safe strings; a naming convention keeps a big keyspace readable.',
      simple:
        'Keys are like labels on storage boxes. "user:42:cart" tells everyone what is inside without opening it.',
      points: [
        'Use colons to build namespaces: <code>app:user:42:profile</code>.',
        'Keep keys short but readable; long keys waste RAM across millions of entries.',
        'Max key size is 512 MB, but anything over a few hundred bytes is a smell.',
        'Useful commands: EXISTS, DEL, UNLINK (delete in background), TYPE, RENAME.',
      ],
      detail: `<pre><code>await redis.set('user:42:name', 'Ana');
const name = await redis.get('user:42:name'); // 'Ana'
await redis.exists('user:42:name');           // 1
await redis.unlink('user:42:name');           // delete without blocking</code></pre>`,
      tip: 'There are 16 numbered databases (SELECT 0-15), but Redis Cluster only supports DB 0 (Valkey 9+ lifts this). Prefer key prefixes over databases.',
    },
    {
      title: 'Expiration (TTL)',
      level: 'beginner',
      summary: 'Give a key a time to live and Redis deletes it automatically when the time is up.',
      simple:
        'Like milk with a best-before date: once the date passes, it is thrown out for you.',
      points: [
        'Set it with the value: SET key value EX 60 (seconds) or PX (milliseconds).',
        'Or later with EXPIRE / PEXPIRE / EXPIREAT; check with TTL (-1 = no TTL, -2 = gone).',
        'A plain SET overwrites the value and removes the TTL, unless you pass KEEPTTL (6.0+).',
        'PERSIST removes the TTL. Hash fields can have their own TTL since 7.4 (HEXPIRE).',
      ],
      detail: `<pre><code>// node-redis v4+
await client.set('otp:42', '918273', { EX: 300 }); // 5 minutes
await client.ttl('otp:42');                       // e.g. 297
await client.expire('otp:42', 60);                // shorten to 1 minute</code></pre>`,
      tip: 'Common bug: updating a cached value with plain SET and silently losing its TTL, so the key lives forever.',
      children: [
        {
          title: 'How expiry works',
          level: 'advanced',
          summary: 'Redis removes expired keys lazily on access and actively by sampling in the background.',
          simple:
            'A shop checks dates when you pick up an item (lazy), and a worker also walks the shelves now and then checking random items (active).',
          points: [
            'Lazy: when you touch an expired key, Redis deletes it and acts like it never existed.',
            'Active: a background cycle samples keys with TTLs and deletes expired ones.',
            'So expired keys can sit in memory a little while before they are freed.',
            'Replicas don’t expire keys themselves; the primary sends a DEL to them.',
          ],
          tip: 'Millions of keys expiring at the same second can cause a CPU spike. Add random jitter to TTLs.',
        },
      ],
    },
  ],
};
