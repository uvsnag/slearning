import type { KmNode } from '../../types';

export const architecture: KmNode = {
  title: 'Architecture & Storage',
  level: 'intermediate',
  summary: 'How Kafka stores data on disk, keeps copies on several brokers, and why it is so fast.',
  simple:
    'Inside each broker, every partition is just a few files that only grow at the end. Copies of those files live on other brokers, so one crash loses nothing.',
  children: [
    {
      title: 'Commit log & segments',
      level: 'intermediate',
      summary:
        'Each partition is a folder of segment files (chunks of the log) plus small index files.',
      simple:
        'Instead of one giant file, the log is cut into chapters (segments). Old chapters can be thrown away whole, and an index tells Kafka which page an offset is on.',
      points: [
        '.log holds the data, .index maps offset → spot in the file, .timeindex maps time → offset.',
        'Only the newest (active) segment gets new writes. Older ones never change.',
        'A new segment starts at log.segment.bytes (1 GB default) or after log.roll.ms.',
        'Retention and compaction work on whole, closed segments.',
      ],
      detail: `<pre><code>orders-0/
  00000000000000000000.log
  00000000000000000000.index
  00000000000000000000.timeindex
  00000000000005242880.log   ← active segment
  ...</code></pre>`,
    },
    {
      title: 'Retention',
      level: 'beginner',
      summary: 'How long Kafka keeps data: by time, by size, or forever.',
      simple:
        'Like a security camera that keeps the last 7 days of video and records over anything older.',
      points: [
        'cleanup.policy=delete (default): old segments are deleted.',
        'retention.ms: 7 days by default. -1 means keep forever.',
        'retention.bytes: size limit per partition. Unlimited (-1) by default.',
        'Data is kept whether anyone read it or not.',
      ],
      tip: 'Keep data longer than your worst consumer outage. Otherwise a consumer that was down too long finds its offset already deleted, and auto.offset.reset decides where it restarts.',
    },
    {
      title: 'Log compaction',
      level: 'intermediate',
      summary: 'Keep only the latest value for each key, instead of deleting by time.',
      simple:
        'Like a contact list: you only care about each friend’s current phone number, not every number they ever had. Compaction throws away older values of the same key.',
      points: [
        'Turn it on with cleanup.policy=compact (or compact,delete).',
        'Tombstone: a record with a key and a null value. It deletes that key after a while.',
        'A background cleaner does the work. The active segment is never compacted.',
        'Offsets never change. Compaction just leaves gaps.',
        'Used by __consumer_offsets, Kafka Streams state topics and "latest state" topics.',
      ],
      detail: `<pre><code>before: k1=A  k2=X  k1=B  k3=Q  k1=C  k2=null
after:  k3=Q  k1=C   (k2 removed by the tombstone)</code></pre>`,
    },
    {
      title: 'Replication',
      level: 'intermediate',
      summary:
        'Each partition has copies (replicas) on several brokers: one leader and some followers.',
      simple:
        'Every mailbox has a main copy and backup copies at other branches. If the branch with the main copy closes, a backup takes over.',
      children: [
        {
          title: 'Leader & followers',
          level: 'intermediate',
          summary:
            'Producers write to the leader. Followers copy from the leader to stay up to date.',
          simple:
            'The leader is the main copy everyone talks to. Followers quietly copy everything it gets.',
          points: [
            'replication.factor = total number of copies. 3 is normal in production.',
            'Clients read from the leader by default. With client.rack they can read from the closest follower (KIP-392).',
            'Leaders are spread across brokers so no single broker does all the work.',
          ],
        },
        {
          title: 'ISR (In-Sync Replicas)',
          level: 'intermediate',
          summary: 'The copies that are fully caught up with the leader.',
          simple:
            'ISR is the list of backups that are up to date. A backup that falls too far behind is taken off the list until it catches up.',
          points: [
            'A follower leaves the ISR if it stays behind longer than replica.lag.time.max.ms (30 s default).',
            'With acks=all, a write counts as done once every ISR member has it.',
            'min.insync.replicas: the smallest ISR size that still accepts acks=all writes.',
            'Only ISR members can become the new leader (unless unclean election is on).',
          ],
          tip: 'RF=3 + min.insync.replicas=2 + acks=all means you can lose 1 broker without losing data or stopping writes.',
        },
        {
          title: 'High watermark',
          level: 'advanced',
          summary: 'The last offset that every ISR copy has. Consumers can only read up to here.',
          simple:
            'Readers only see lines that every up-to-date backup already copied, so nobody reads data that could vanish in a crash.',
          points: [
            'Log end offset (LEO): the last offset written on one copy.',
            'High watermark (HW): the lowest LEO across the ISR. Data below it is "committed".',
            'Stops consumers from seeing records that could disappear when the leader changes.',
          ],
        },
        {
          title: 'Unclean leader election',
          level: 'advanced',
          summary:
            'Letting an out-of-date copy become leader: staying online matters more than losing some data.',
          points: [
            'unclean.leader.election.enable=false (default): the partition stays offline until an ISR copy is back.',
            'true: the partition comes back sooner, but some committed messages may be lost.',
            'A classic "availability vs consistency" (CAP) question.',
          ],
        },
      ],
    },
    {
      title: 'Controller & KRaft',
      level: 'intermediate',
      summary:
        'The controller manages the cluster layout: brokers, topics and leaders. KRaft replaced ZooKeeper for this.',
      simple:
        'The controller is the branch manager who decides which branch holds the main copy of each mailbox. With KRaft, Kafka picks its own managers instead of relying on an outside tool (ZooKeeper).',
      points: [
        'KRaft = Kafka + Raft (a voting method). A few controller nodes keep the layout in an internal log.',
        'Ready for production since 3.3. ZooKeeper was removed completely in Kafka 4.0.',
        'Wins: one system to run, faster failover, many more partitions, simpler security.',
        'process.roles sets a node as broker, controller, or both (both is fine for small or dev setups).',
      ],
      tip: 'Moving off ZooKeeper: upgrade to a 3.x bridge release, migrate to KRaft, then go to 4.x.',
    },
    {
      title: 'Why Kafka is fast',
      level: 'intermediate',
      summary:
        'It writes to disk in order, uses the OS cache, skips extra copies, and works in batches.',
      simple:
        'Kafka writes like a typewriter: always at the end, never jumping around. The operating system does the caching, and reading out is almost a straight pipe from disk to network.',
      points: [
        'Writing in order (sequential) is very fast, even on old spinning disks.',
        'Page cache: Kafka lets the OS keep hot data in memory instead of using a huge Java heap.',
        'Zero-copy: data goes from cache to network without passing through Java (not with TLS).',
        'Batches everywhere: the producer sends them, the broker stores them, the consumer fetches them.',
        'Each batch is compressed (lz4, zstd, snappy or gzip).',
        'Partitions spread the work across brokers and disks.',
      ],
    },
    {
      title: 'Rack awareness',
      level: 'advanced',
      summary:
        'Put copies of each partition in different racks or availability zones (separate data centers).',
      points: [
        'Set broker.rack on each broker. Kafka then spreads copies across racks for you.',
        'You survive losing a whole zone if you have at least as many copies as zones.',
        'Add client.rack so consumers read from a follower in their own zone and save network cost.',
      ],
    },
    {
      title: 'Tiered storage',
      level: 'advanced',
      summary:
        'Move old segments to cheap object storage (S3, GCS) while recent data stays on local disk.',
      simple:
        'Hot data stays in your desk drawer. Old data goes to a cheap warehouse, but you can still fetch it.',
      points: [
        'KIP-405. Production-ready since Kafka 3.9.',
        'Long retention gets cheap, and brokers recover and rebalance faster (less local data).',
        'Turn on with remote.storage.enable=true on the topic. local.retention.ms sets how long data stays local.',
      ],
    },
  ],
};
