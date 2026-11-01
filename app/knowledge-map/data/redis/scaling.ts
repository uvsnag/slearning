import type { KmNode } from '../../types';

export const scaling: KmNode = {
  title: 'Sentinel & Cluster',
  level: 'advanced',
  summary: 'High availability with Sentinel, and splitting data across many nodes with Cluster.',
  simple:
    'Sentinel is a guard who promotes the twin when the boss collapses. Cluster is splitting one huge library into several branches, each owning part of the books.',
  points: [
    'Sentinel: one primary + replicas, automatic failover, no sharding.',
    'Cluster: data sharded over many primaries, each with its own replicas.',
    'Managed services (ElastiCache, MemoryDB, Azure, Redis Cloud) run these for you.',
  ],
  children: [
    {
      title: 'Sentinel',
      level: 'advanced',
      summary: 'Separate processes that watch the primary and promote a replica if it dies.',
      simple: 'Three guards watch the boss. If most agree the boss is down, they choose a new boss and tell everyone.',
      points: [
        'Run at least 3 Sentinels on different machines to avoid split decisions.',
        'Quorum: how many Sentinels must agree the primary is down.',
        'Clients ask Sentinel "who is the primary now?" instead of using a fixed host.',
        'Data still fits on one primary; Sentinel does not add write capacity.',
      ],
      detail: `<pre><code>// Lettuce: connect through Sentinel
RedisURI uri = RedisURI.Builder
    .sentinel("sentinel-1", 26379, "mymaster")
    .withSentinel("sentinel-2", 26379)
    .build();
RedisClient client = RedisClient.create(uri);</code></pre>`,
    },
    {
      title: 'Redis Cluster',
      level: 'advanced',
      summary: 'Built-in sharding: keys are spread over several primaries, with automatic failover.',
      simple: 'One library split into branches. A catalog tells you which branch has your book.',
      points: [
        'Needs at least 3 primaries; usually one replica each.',
        'Nodes talk to each other over a cluster bus (port + 10000) with gossip.',
        'Only database 0, no SELECT (Valkey 9+ allows numbered databases in Cluster).',
        'Use a cluster-aware client (JedisCluster, Lettuce, ioredis Cluster).',
      ],
      children: [
        {
          title: 'Hash slots',
          level: 'advanced',
          summary: 'Every key maps to one of 16,384 slots: CRC16(key) mod 16384.',
          simple: 'Each book gets a shelf number from its title. Each branch owns a range of shelf numbers.',
          points: [
            'Each primary owns a set of slots, e.g. 0–5460, 5461–10922, 10923–16383.',
            'Moving slots between nodes is how you rebalance or add nodes.',
            'Clients cache the slot map and send commands straight to the right node.',
            'Not consistent hashing: slots are a fixed table you move around, so adding a node is planned, not automatic.',
          ],
        },
        {
          title: 'Hash tags',
          level: 'advanced',
          summary: 'Only the part inside {braces} is hashed, so related keys land in the same slot.',
          simple: 'Put the same shelf label on related books so they end up side by side.',
          points: [
            '<code>{user:42}:cart</code> and <code>{user:42}:profile</code> share a slot.',
            'Needed for multi-key commands, MULTI and Lua across those keys.',
            'Otherwise you get a CROSSSLOT error.',
            'Too many keys on one tag creates a hot, oversized slot.',
          ],
        },
        {
          title: 'MOVED & ASK',
          level: 'expert',
          summary: 'Redirect replies that tell the client which node really owns a key.',
          points: [
            'MOVED: the slot lives elsewhere for good; the client updates its slot map.',
            'ASK: the slot is being migrated; try the other node just this once.',
            'Smart clients handle both; you mostly see them in logs during resharding.',
          ],
        },
      ],
    },
    {
      title: 'Cluster limits',
      level: 'expert',
      summary: 'What gets harder once data is sharded.',
      points: [
        'Multi-key operations only work within one slot.',
        'A failover can lose recent writes, since replication is async.',
        'Big or hot keys can’t be split; one node carries them alone.',
        'Pub/Sub broadcasts to all nodes; prefer sharded Pub/Sub (7.0+).',
      ],
      tip: 'Before choosing Cluster, check if one bigger node plus replicas is enough. It is simpler to run.',
    },
  ],
};
