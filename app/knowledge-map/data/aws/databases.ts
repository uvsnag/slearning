import type { KmNode } from '../../types';

export const databases: KmNode = {
  title: 'Databases',
  level: 'intermediate',
  summary:
    'Managed relational databases (RDS, Aurora), the NoSQL key-value store DynamoDB, and in-memory caches.',
  simple:
    'AWS runs the database for you: installs, backups, patches, failover. You just design the tables and write the queries.',
  points: [
    'Need SQL, joins and transactions? RDS or Aurora.',
    'Need huge scale with simple key lookups? DynamoDB.',
    'Need microsecond reads of hot data? ElastiCache in front.',
    'Pick by access pattern, not by habit.',
  ],
  children: [
    {
      title: 'RDS',
      level: 'beginner',
      summary: 'Managed PostgreSQL, MySQL, MariaDB, Oracle, SQL Server and Db2 databases.',
      simple:
        'Like renting a fully serviced car: you drive (write SQL), the company handles oil changes, insurance and spare tires.',
      points: [
        'AWS handles setup, OS and engine patches, backups and monitoring.',
        'Automated backups with point-in-time restore, kept 1 to 35 days.',
        'You pick instance size and storage; storage can auto-grow.',
        'No SSH into the host. You connect with a normal JDBC or driver URL.',
        'Put it in private subnets; only your app’s security group may connect.',
      ],
    },
    {
      title: 'Multi-AZ & Read Replicas',
      level: 'intermediate',
      summary: 'Multi-AZ is for surviving failures; read replicas are for spreading read load.',
      simple:
        'Multi-AZ is a spare goalkeeper on the bench, ready to jump in. Read replicas are extra cashiers who can only answer questions, not take payments.',
      points: [
        'Multi-AZ: a standby in another AZ with synchronous copies; failover in about a minute or two.',
        'The standby (classic Multi-AZ) does not serve reads.',
        'Read replicas copy asynchronously, so reads can be slightly stale.',
        'Replicas can live in other regions and be promoted for disaster recovery.',
        'Your app connects via the DNS endpoint; it moves to the new primary on failover.',
      ],
      tip: 'Interview classic: Multi-AZ = availability, read replicas = scalability. Do not mix them up.',
    },
    {
      title: 'Aurora',
      level: 'intermediate',
      summary: 'AWS’s own cloud-built MySQL- and PostgreSQL-compatible engine, faster and more resilient.',
      simple:
        'Aurora is RDS with a smarter engine underneath: your data is copied six times across three buildings, so losing one barely matters.',
      points: [
        'Shared storage keeps 6 copies across 3 AZs and grows automatically (to 128 TiB and beyond).',
        'Up to 15 low-lag read replicas; failover usually under 30 seconds.',
        'Aurora Serverless v2 scales capacity up and down in small steps.',
        'Global Database replicates to other regions with typically under 1 second lag.',
        'Costs more than plain RDS for small, quiet databases.',
      ],
    },
    {
      title: 'ElastiCache',
      level: 'intermediate',
      summary: 'Managed in-memory cache with Valkey, Redis OSS or Memcached.',
      simple:
        'A sticky note on your monitor with the answers you need most, so you do not have to walk to the archive every time.',
      points: [
        'Microsecond reads; takes load off your database.',
        'Cache-aside: check cache, on miss read DB and store the result with a TTL.',
        'Valkey/Redis add data structures, replication, pub/sub and Multi-AZ failover.',
        'Also used for sessions, leaderboards and rate limits.',
        'For DynamoDB only, DAX is a drop-in cache.',
      ],
      tip: 'Every cache needs an answer to “how does stale data get fixed?”. Always set a TTL.',
    },
    {
      title: 'DynamoDB',
      level: 'intermediate',
      summary: 'Serverless NoSQL key-value and document database with single-digit millisecond latency at any scale.',
      simple:
        'A giant, super-fast filing cabinet. If you know the drawer (partition key) and folder (sort key), you get the file instantly, no matter how big the cabinet is.',
      points: [
        'No servers, no connections to manage; you talk to it over HTTPS.',
        'Items up to 400 KB; tables can be any size.',
        'Reads are eventually consistent by default; ask for strong consistency per read.',
        'Supports ACID transactions over up to 100 items.',
        'You design tables around your queries, not around entities.',
      ],
      detail: `<pre><code>import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
await db.send(new PutCommand({
  TableName: 'Shop',
  Item: { pk: 'USER#7', sk: 'ORDER#42', total: 120 },
}));
const { Item } = await db.send(new GetCommand({
  TableName: 'Shop', Key: { pk: 'USER#7', sk: 'ORDER#42' },
}));</code></pre>`,
      children: [
        {
          title: 'Keys & Queries',
          level: 'intermediate',
          summary: 'The partition key spreads data; the sort key orders items within a partition.',
          simple:
            'Partition key = which drawer. Sort key = the order of folders inside that drawer, so you can grab “all orders from March” in one go.',
          points: [
            '<code>GetItem</code>: one item by full key. Fast and cheap.',
            '<code>Query</code>: items with one partition key, filtered by sort key range.',
            '<code>Scan</code>: reads the whole table. Slow and costly; avoid in hot paths.',
            'Pick a partition key with many distinct values to avoid “hot” partitions.',
          ],
        },
        {
          title: 'Capacity Modes',
          level: 'intermediate',
          summary: 'Pay per request (on-demand) or reserve read and write units (provisioned).',
          simple:
            'On-demand is a taxi: pay per ride. Provisioned is a leased car: cheaper if you drive it a lot every day.',
          points: [
            'On-demand: no planning, scales instantly, good default for new or spiky apps.',
            'Provisioned: set RCU/WCU (read/write capacity units), add auto scaling; cheaper for steady load.',
            'Too much traffic for provisioned capacity leads to throttling errors.',
            'Reserved capacity gives extra discounts on steady provisioned tables.',
          ],
        },
        {
          title: 'Secondary Indexes',
          level: 'advanced',
          summary: 'Extra ways to query a table by other attributes: GSI and LSI.',
          points: [
            'GSI (global): any new partition and sort key; add any time; eventually consistent.',
            'LSI (local): same partition key, different sort key; only at table creation.',
            'Indexes copy (project) attributes, so they cost extra storage and writes.',
            'Default limits: 20 GSIs and 5 LSIs per table.',
          ],
        },
        {
          title: 'Streams & TTL',
          level: 'advanced',
          summary: 'React to every item change, and let items expire automatically.',
          points: [
            'DynamoDB Streams records inserts, updates and deletes for 24 hours.',
            'A Lambda can read the stream to update search, caches or send events.',
            'TTL deletes items after a timestamp you set, at no write cost.',
            'TTL deletes are not instant; they can take a while after expiry.',
          ],
        },
        {
          title: 'Conditional Writes',
          level: 'advanced',
          summary: 'Write only if the item is in the state you expect, so two writers cannot overwrite each other.',
          points: [
            'A <code>ConditionExpression</code> makes the write fail if the check is false.',
            '<code>attribute_not_exists(pk)</code> means "create only if new"; great for idempotency.',
            'Optimistic locking: keep a <code>version</code> number and require it to match on update.',
            'A failed check throws <code>ConditionalCheckFailedException</code>; reload and try again.',
          ],
          detail: `<pre><code>await db.send(new UpdateCommand({
  TableName: 'Shop', Key: { pk: 'USER#7', sk: 'PROFILE' },
  UpdateExpression: 'SET email = :e, version = :next',
  ConditionExpression: 'version = :seen', // fails if someone else saved first
  ExpressionAttributeValues: { ':e': 'a@b.com', ':seen': 3, ':next': 4 },
}));</code></pre>`,
          tip: 'Use atomic counters (SET n = n + :one) or conditions instead of read-modify-write in your code.',
        },
        {
          title: 'Single-Table Design',
          level: 'expert',
          summary: 'Store many entity types in one table with generic keys to serve all queries cheaply.',
          points: [
            'List every access pattern first, then design keys to answer each with one Query.',
            'Generic keys like <code>pk = USER#7</code>, <code>sk = ORDER#42</code> group related items.',
            'Pre-join data: a user and their orders share a partition key.',
            'GSI overloading reuses one index for several patterns.',
            'Hard to change later; for unknown patterns, several simple tables are fine.',
          ],
          tip: 'Do not force single-table design everywhere. It shines for well-known, high-scale access patterns.',
        },
      ],
    },
    {
      title: 'Purpose-Built Databases',
      level: 'intermediate',
      summary: 'AWS has a special database for each data shape; pick by how you read and write.',
      simple:
        'Like a kitchen: you could cut everything with one knife, but a bread knife, a peeler and a cleaver each do their job better.',
      points: [
        'DocumentDB: MongoDB-compatible JSON documents.',
        'Neptune: graph data, e.g. friends of friends or fraud rings.',
        'OpenSearch Service: full-text search, log analytics and vector search.',
        'Timestream: time-series data like sensor readings and metrics.',
        'Keyspaces: managed Cassandra-compatible wide-column store.',
      ],
      tip: 'Start with one general database (Aurora or DynamoDB). Add a special one only when a real access pattern needs it.',
    },
    {
      title: 'Athena & Redshift',
      level: 'advanced',
      summary: 'Run SQL over huge data for reports and analytics, separate from your app’s database.',
      points: [
        'Athena: query files in S3 with SQL; no servers, pay per TB scanned.',
        'Store data as Parquet, compressed and partitioned (e.g. by date) to scan less and pay less.',
        'Glue Data Catalog keeps table definitions; Glue jobs clean and convert data (ETL).',
        'Redshift: a columnar data warehouse for fast, repeated BI queries; has a serverless option.',
        'Keep analytics off your production OLTP database (the one serving users).',
      ],
      tip: 'S3 + Glue + Athena is the cheapest way to start a data lake. Move to Redshift when dashboards need steady, fast queries.',
    },
  ],
};
