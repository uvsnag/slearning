import type { KmNode } from '../../types';

export const storage: KmNode = {
  title: 'Databases & Storage',
  level: 'intermediate',
  summary: 'Choosing a database, copying data with replication, and splitting it with sharding.',
  simple:
    'Data is the heaviest furniture in your house. Where you put it and how you copy and split it decides how easy the house is to grow.',
  points: [
    'Pick storage by access pattern: how you read and write, not by hype.',
    'Replication copies data for reads and safety; sharding splits data for scale.',
    'Files and media go to object storage, not the database.',
  ],
  children: [
    {
      title: 'SQL vs NoSQL',
      level: 'beginner',
      summary:
        'Relational databases with tables and joins vs non-relational stores built for specific patterns.',
      simple:
        'SQL is a well-organized filing cabinet with strict forms. NoSQL is a set of specialist boxes, each great at one kind of thing.',
      points: [
        'SQL (PostgreSQL, MySQL): strong consistency, transactions, joins, flexible queries.',
        'NoSQL: simple access by key, flexible schema, easier to spread over many machines.',
        'Default to a relational database unless you have a clear reason not to.',
        'Many systems use both: SQL for orders, a key-value store for sessions, a search engine for text.',
      ],
      tip: 'In interviews, justify the choice with the access pattern and scale, not with "NoSQL scales better".',
    },
    {
      title: 'Types of NoSQL',
      level: 'intermediate',
      summary:
        'Key-value, document, wide-column and graph stores, each tuned for a different shape of data.',
      simple:
        'Different containers for different food: jars, boxes, shelves and a pinboard with strings.',
      points: [
        'Key-value (Redis, DynamoDB): get/put by key, super fast.',
        'Document (MongoDB): JSON-like records, nested data, flexible fields.',
        'Wide-column (Cassandra, ScyllaDB): huge write volumes, query by partition key.',
        'Graph (Neo4j): relationships first, e.g. "friends of friends".',
        'Time-series (InfluxDB, TimescaleDB): metrics and events over time.',
      ],
    },
    {
      title: 'Replication',
      level: 'intermediate',
      summary:
        'Keeping copies of the same data on several machines for read scale and fault tolerance.',
      simple:
        'Like keeping photocopies of an important document in different drawers. If one drawer burns, you still have it.',
      points: [
        'Leader-follower: writes go to the leader, reads can go to followers.',
        'Async replication: fast, but followers lag (stale reads, possible data loss on failover).',
        'Sync replication: no loss, but slower writes and blocked if a replica is down.',
        'Multi-leader and leaderless (Cassandra, DynamoDB-style) accept writes in many places but must resolve conflicts.',
      ],
      tip: 'Replica lag causes "I saved it but it’s gone" bugs. Read your own writes from the leader for a short time after writing.',
    },
    {
      title: 'Sharding (Partitioning)',
      level: 'advanced',
      summary: 'Splitting data across many databases so each holds only part of it.',
      points: [
        'Pick a shard key that spreads load evenly and matches your main queries.',
        'Range sharding keeps order but can create hot spots (e.g. by date).',
        'Hash sharding spreads evenly but makes range queries hard.',
        'Cross-shard joins and transactions are slow or impossible; design around them.',
        'Resharding later is painful, so plan the key carefully.',
      ],
      tip: 'Watch for "celebrity" hot keys: one huge user can overload a single shard.',
    },
    {
      title: 'Consistent Hashing',
      level: 'advanced',
      summary:
        'A way to map keys to servers so adding or removing a server moves only a small share of keys.',
      points: [
        'Servers and keys are placed on a ring by hash; a key goes to the next server clockwise.',
        'Adding a server moves only about 1/N of the keys, not almost all of them.',
        'Virtual nodes (many points per server) even out the load.',
        'Used by Cassandra, DynamoDB, CDNs and distributed caches.',
      ],
      detail: `<pre><code>// Naive: hash(key) % N  → changing N remaps almost every key
// Ring: find the first node at or after the key’s hash
function nodeFor(key, ring) {          // ring sorted by position
  const h = hash(key);
  const node = ring.find((n) =&gt; n.pos &gt;= h);
  return (node ?? ring[0]).name;       // wrap around
}</code></pre>`,
    },
    {
      title: 'Object Storage',
      level: 'beginner',
      summary:
        'Cheap, huge, durable storage for files like images, videos and backups (e.g. Amazon S3).',
      simple:
        'A giant self-storage warehouse: you get a locker number (key) and can store almost anything, forever, cheaply.',
      points: [
        'Store the file in object storage and only its URL/key in the database.',
        'Let clients upload directly with pre-signed URLs to skip your servers.',
        'Put a CDN in front for fast downloads.',
        'Lifecycle rules move old files to cheaper storage classes.',
      ],
    },
    {
      title: 'Search Engines',
      level: 'intermediate',
      summary:
        'Dedicated systems (Elasticsearch, OpenSearch) for full-text search, filters and ranking.',
      simple:
        'Like the index at the back of a book: it lists every word and the pages it appears on, so you don’t read the whole book.',
      points: [
        'Built on an inverted index: word → list of documents containing it.',
        'Good at fuzzy matching, relevance ranking, facets and aggregations.',
        'Usually a secondary copy fed from the main database (via events or CDC).',
        'Search results are eventually consistent with the source of truth.',
      ],
    },
  ],
};
