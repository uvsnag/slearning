import type { KmNode } from '../../types';

export const operations: KmNode = {
  title: 'Performance & Ops',
  level: 'advanced',
  summary: 'Keeping Redis fast and safe in production: big keys, scanning, memory, latency and security.',
  simple:
    'Redis is a one-lane road. It’s very fast, but one slow truck (a huge command) blocks everyone behind it.',
  points: [
    'Most slowdowns come from O(N) commands on large data, not from Redis itself.',
    'Watch memory, latency and slow commands from day one.',
    'Never expose Redis directly to the internet.',
  ],
  children: [
    {
      title: 'KEYS vs SCAN',
      level: 'intermediate',
      summary: 'KEYS walks every key in one go and blocks; SCAN walks in small steps with a cursor.',
      simple: 'KEYS is closing the shop to count every item. SCAN is counting one shelf at a time while customers keep shopping.',
      points: [
        'KEYS is O(N): millions of keys can freeze the server for seconds.',
        'SCAN returns a cursor; call again until the cursor is 0.',
        'MATCH filters, COUNT is only a hint for batch size.',
        'SCAN may return a key twice; dedupe if it matters. Also HSCAN, SSCAN, ZSCAN.',
      ],
      detail: `<pre><code>for await (const keys of client.scanIterator({ MATCH: 'session:*', COUNT: 500 })) {
  // node-redis v5 yields batches of keys
  if (keys.length) await client.unlink(keys);
}</code></pre>`,
      tip: 'Many teams disable KEYS in production with ACLs. In an interview, always say SCAN.',
    },
    {
      title: 'Big keys & hot keys',
      level: 'advanced',
      summary: 'One huge key or one key hit by everyone can slow a whole node.',
      simple: 'A giant box takes ages to move, and a box everyone wants creates a queue at one shelf.',
      points: [
        'Big key: a hash/list/set with millions of items, or a string of many MB.',
        'Reading or deleting it blocks; use UNLINK (delete in background) and split the data.',
        'Find them with <code>redis-cli --bigkeys</code> / <code>--memkeys</code> or MEMORY USAGE.',
        'Hot key: replicate reads, add a local cache, or split it into several keys.',
      ],
    },
    {
      title: 'Memory',
      level: 'advanced',
      summary: 'Know how much RAM you use, why, and what happens when it runs out.',
      simple: 'RAM is the size of your desk. Plan what goes on it and what gets thrown off when it’s full.',
      points: [
        'Always set maxmemory and a maxmemory-policy.',
        'INFO memory: used_memory vs used_memory_rss shows fragmentation.',
        'activedefrag can reclaim fragmented memory while running.',
        'Small hashes are cheaper than many separate keys; keep keys and values compact.',
      ],
      tip: 'If the OS starts swapping Redis memory to disk, latency explodes. Keep RAM headroom and avoid swap.',
    },
    {
      title: 'Latency & slow commands',
      level: 'advanced',
      summary: 'Find what is slow with SLOWLOG, LATENCY tools and good metrics.',
      simple: 'Like a dashcam that records every time traffic stopped, so you can see what caused it.',
      points: [
        'SLOWLOG GET lists commands slower than slowlog-log-slower-than (10 ms default).',
        'LATENCY DOCTOR explains spikes; fork for RDB/AOF is a common cause.',
        'Track ops/sec, hit ratio, connected clients, evictions and replication lag.',
        'Avoid O(N) on big data: HGETALL, SMEMBERS, LRANGE 0 -1, ZRANGE over everything.',
      ],
    },
    {
      title: 'Security',
      level: 'intermediate',
      summary: 'Lock Redis down with network rules, ACL users, passwords and TLS.',
      simple: 'Redis trusts whoever reaches it. Put it behind a locked door and give each visitor their own key.',
      points: [
        'Bind to private IPs; protected mode blocks outside access when no password is set.',
        'ACL (6.0+): users with their own passwords, allowed commands and key patterns.',
        'TLS (6.0+) encrypts traffic between clients and nodes.',
        'Block dangerous commands for apps: FLUSHALL, CONFIG, KEYS, DEBUG.',
      ],
      tip: 'Exposed Redis servers on the internet get hacked within hours, often to install crypto miners.',
    },
  ],
};
