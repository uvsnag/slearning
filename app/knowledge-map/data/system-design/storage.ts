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
      title: 'ACID Transactions',
      level: 'intermediate',
      summary: 'A group of database changes that all succeed or all fail, safely, even with many users at once.',
      simple:
        'A bank transfer: money leaves one account and arrives in the other, or nothing happens at all. Never half.',
      points: [
        'Atomic: all or nothing. Consistent: rules (constraints) always hold.',
        'Isolated: parallel transactions do not see each other’s half-done work.',
        'Durable: once committed, it survives a crash.',
        'Isolation levels (read committed, repeatable read, serializable) trade safety for speed.',
        'Lost updates: two users read, both write, one change vanishes. Use locks or version checks.',
      ],
      detail: `<pre><code>// Optimistic locking: update only if nobody changed the row since we read it
const rows = await db.query(
  'UPDATE seats SET owner = $1, version = version + 1 WHERE id = $2 AND version = $3',
  [userId, seatId, seenVersion]);
if (rows.rowCount === 0) throw new Error('Seat was taken, please retry');</code></pre>`,
    },
    {
      title: 'Indexes & Denormalization',
      level: 'intermediate',
      summary: 'Indexes make reads fast at a write cost; denormalizing copies data to skip joins.',
      simple:
        'An index is the tab dividers in a binder: you jump straight to "M". Denormalizing is writing a friend’s phone number in two notebooks so you never need to look it up.',
      points: [
        'Without an index, the database scans every row. With one, it jumps to the match.',
        'Each index slows writes and uses disk, so index the columns you filter and sort by.',
        'Composite index order matters: (user_id, created_at) helps "user’s latest orders".',
        'Normalized data has one copy of each fact; denormalized data copies it for fast reads.',
        'Denormalized copies must be kept in sync, often with events or background jobs.',
      ],
      tip: 'When a query is slow, check the query plan (EXPLAIN) before adding caches or shards.',
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
      title: 'Change Data Capture',
      level: 'advanced',
      summary: 'Reading the database’s own change log to stream every insert, update and delete to other systems.',
      points: [
        'Tools like Debezium read the write-ahead log (the database’s change diary) and publish to Kafka.',
        'Keeps search indexes, caches and data warehouses in sync without touching app code.',
        'Avoids "dual writes" (DB + queue) that drift apart when one of them fails.',
        'Consumers see changes in commit order per row or table.',
      ],
      tip: 'Outbox pattern + CDC is the standard answer to "how do you update the DB and publish an event reliably?"',
    },
    {
      title: 'B-Trees vs LSM-Trees',
      level: 'expert',
      summary: 'The two main ways databases store data on disk: update in place, or append and merge later.',
      points: [
        'B-tree (PostgreSQL, MySQL): sorted pages updated in place; fast reads, good all-round.',
        'LSM-tree (Cassandra, RocksDB): writes go to memory, then flushed to sorted files; very fast writes.',
        'LSM runs background compaction to merge files; reads may check several files.',
        'Bloom filters help LSM reads skip files that cannot hold the key.',
        'Pick LSM-based stores for write-heavy loads like logs, metrics and events.',
      ],
    },
  ],
};
