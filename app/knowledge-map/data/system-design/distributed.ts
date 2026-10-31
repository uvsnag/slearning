import type { KmNode } from '../../types';

export const distributed: KmNode = {
  title: 'Distributed Systems Theory',
  level: 'advanced',
  summary:
    'The rules of the game when data lives on many machines: CAP, consistency, consensus and time.',
  simple:
    'When friends plan a trip over a bad phone line, messages get lost, arrive late or out of order. Distributed systems theory is about agreeing anyway.',
  points: [
    'Networks drop, delay and reorder messages; machines crash and clocks drift.',
    'You must choose between consistency, availability and latency in different situations.',
    'Consensus algorithms let a group of machines agree safely.',
  ],
  children: [
    {
      title: 'CAP Theorem',
      level: 'advanced',
      summary: 'During a network partition, a system must choose consistency or availability.',
      points: [
        'C: every read sees the latest write. A: every request gets a non-error answer. P: the network splits.',
        'Partitions will happen, so the real choice is C or A while one is going on.',
        'CP example: refuse writes on the minority side (etcd, ZooKeeper, banking ledgers).',
        'AP example: accept writes everywhere and reconcile later (shopping cart, likes).',
      ],
      tip: 'Don’t say "pick 2 of 3". Say "when the network partitions, choose between consistency and availability".',
    },
    {
      title: 'PACELC',
      level: 'expert',
      summary: 'Extends CAP: if Partitioned choose A or C, Else choose Latency or Consistency.',
      points: [
        'Even with no failures, strong consistency costs latency (waiting for replicas).',
        'DynamoDB/Cassandra defaults: PA/EL (available and fast, eventually consistent).',
        'Traditional relational clusters with sync replication: PC/EC.',
        'Many stores let you tune it per request (e.g. consistent read option).',
      ],
    },
    {
      title: 'Consistency Models',
      level: 'advanced',
      summary: 'Promises about what a read can return after a write, from strict to loose.',
      points: [
        'Linearizable (strong): behaves like a single copy; every read sees the latest write.',
        'Causal: if A caused B, everyone sees A before B.',
        'Read-your-writes: you always see your own changes.',
        'Eventual: replicas agree "eventually" if writes stop.',
        'Stronger models are simpler to reason about but slower and less available.',
      ],
    },
    {
      title: 'Quorums',
      level: 'advanced',
      summary: 'Requiring a minimum number of replicas to agree on reads and writes.',
      points: [
        'With N replicas, write to W and read from R.',
        'If <code>W + R &gt; N</code>, reads overlap with the latest write (e.g. N=3, W=2, R=2).',
        'Lower W or R for speed; raise them for consistency.',
        'Used by leaderless stores like Cassandra and DynamoDB-style systems.',
      ],
    },
    {
      title: 'Consensus (Raft, Paxos)',
      level: 'expert',
      summary:
        'Algorithms that let a group of machines agree on one value or log even if some fail.',
      points: [
        'Needs a majority: 3 nodes tolerate 1 failure, 5 tolerate 2.',
        'Raft: elect a leader, the leader replicates a log, entries commit once a majority has them.',
        'Used in etcd (Kubernetes), Consul, CockroachDB, Kafka KRaft.',
        'Expensive per write, so used for metadata and coordination, not every request.',
      ],
    },
    {
      title: 'Leader Election',
      level: 'advanced',
      summary: 'Choosing one node to coordinate work so only one does a job at a time.',
      points: [
        'Usually done with a lease in a consensus store (etcd, ZooKeeper) or the database.',
        'A lease expires if the leader stops renewing it, so another node can take over.',
        'Danger: an old leader paused by GC may still think it’s the leader ("split brain").',
        'Protect writes with fencing tokens (see Distributed Locks).',
      ],
    },
    {
      title: 'Distributed Locks',
      level: 'expert',
      summary: 'Locks shared across machines; useful but tricky because of pauses and timeouts.',
      points: [
        'A lock holder can pause (GC, network) past its lease and keep writing.',
        'Fencing token: the lock gives an increasing number; storage rejects older numbers.',
        'Redis-based locks are fine for efficiency (avoid double work), weaker for correctness.',
        'Often better: avoid the lock with idempotent operations or database constraints.',
      ],
    },
    {
      title: 'Time & Ordering',
      level: 'expert',
      summary:
        'Machine clocks disagree, so ordering events across machines needs more than timestamps.',
      points: [
        'Wall clocks drift and can jump backwards after NTP sync.',
        '"Last write wins" by timestamp can silently lose updates.',
        'Lamport clocks give a consistent order; vector clocks also detect concurrent writes.',
        'Hybrid logical clocks and Google’s TrueTime combine physical and logical time.',
      ],
    },
  ],
};
