import type { KmNode } from '../../types';

export const design: KmNode = {
  title: 'Design & Architecture',
  level: 'expert',
  summary: 'Event-driven patterns, topic design, sagas, and knowing when Kafka is the wrong tool.',
  simple:
    'Knowing the tool is one thing. Knowing how to build a whole system around it, and when not to, is what makes a senior engineer.',
  children: [
    {
      title: 'Event-driven architecture',
      level: 'advanced',
      summary: 'Services react to events instead of calling each other and waiting for an answer.',
      simple:
        'Instead of phoning every colleague, you post an update in the team chat and each one reacts when they see it.',
      points: [
        'Event notification: "OrderPlaced (id=42)". Readers fetch the details if they need them.',
        'Event-carried state: the event holds all the data readers need, so no call back.',
        'Wins: services are loosely tied, survive each other’s outages and scale on their own.',
        'Costs: data is only "eventually" in sync, debugging is harder (use trace ids), schemas need care.',
      ],
    },
    {
      title: 'Event sourcing & CQRS',
      level: 'expert',
      summary: 'Save state as a list of events, and build separate read-only views from them.',
      simple:
        'Instead of storing only your current balance, store every deposit and withdrawal. The balance is worked out from the history.',
      points: [
        'CQRS = separate models for writing and reading. Kafka can carry events to build the read views.',
        'Kafka alone is NOT a full event store: you can’t quickly load one entity’s events or lock per entity.',
        'Common setup: an event store or DB is the source of truth, Kafka spreads the events.',
        'Compacted topics can act as snapshots of the latest state.',
      ],
    },
    {
      title: 'Saga pattern',
      level: 'expert',
      summary:
        'Run a business process across several services with events, undoing steps if one fails.',
      simple:
        'Booking a trip: flight, then hotel, then car. If the car fails, cancel the hotel and the flight, step by step, instead of one big transaction.',
      points: [
        'Choreography: each service listens and sends the next event. Simple, but the flow is hidden.',
        'Orchestration: one coordinator sends commands and tracks progress. Clear and easier to watch.',
        'Every step must be safe to repeat, and every step needs an "undo" action.',
        'Pair it with the outbox pattern so events are sent reliably.',
      ],
    },
    {
      title: 'Topic design',
      level: 'advanced',
      summary: 'Naming topics, deciding how much goes in each, picking keys and owners.',
      points: [
        'Name pattern: &lt;domain&gt;.&lt;entity&gt;.&lt;events|state&gt;.v&lt;n&gt;, e.g. sales.order.events.v1.',
        'One topic per entity keeps all events for that entity in order, across event types.',
        'One topic per event type is simpler to read, but you lose order between types.',
        'Separate public (shared contract) topics from private, internal ones.',
        'Each topic has one owning team and a schema.',
      ],
    },
    {
      title: 'Request-reply & commands',
      level: 'advanced',
      summary:
        'Kafka is asynchronous. You can do request-reply over it, but it is usually a warning sign.',
      points: [
        'Commands ("ChargeCard") go to one owner. Events ("CardCharged") are facts for anyone.',
        'ReplyingKafkaTemplate exists, but HTTP or gRPC is usually simpler for real request-reply.',
        'Delayed or scheduled processing isn’t built in. Use retry topics with timestamps or a scheduler.',
      ],
    },
    {
      title: 'When NOT to use Kafka',
      level: 'advanced',
      summary: 'Small scale, simple job queues, live lookups, or complex per-message routing.',
      simple: 'Don’t hire a freight train to deliver one pizza.',
      points: [
        'Low volume and a few services → a DB table, Redis, SQS or RabbitMQ is simpler.',
        'Per-message priority, delays or complex routing → RabbitMQ or SQS.',
        'Need to search data by any field → use a database.',
        'Large files → put them in S3 and send a link through Kafka.',
        'No one to run it → use a managed service or something simpler.',
      ],
    },
    {
      title: 'Common pitfalls',
      level: 'advanced',
      summary: 'Mistakes seen again and again in real projects.',
      points: [
        'Ignoring send() errors → data silently lost.',
        'Auto-commit while processing in other threads → lost messages.',
        'Consumers that can’t handle duplicates + at-least-once → customers charged twice.',
        'Too few partitions (can’t scale) or far too many (cluster overhead).',
        'Slow handlers going past max.poll.interval.ms → endless rebalances.',
        'One poison message blocking a partition forever (no DLT).',
        'Breaking schema changes with no registry, or expecting order across partitions.',
      ],
    },
    {
      title: 'Testing',
      level: 'advanced',
      summary: 'Unit test your logic without a broker, integration test with a real one.',
      points: [
        'MockProducer and MockConsumer for unit tests.',
        'Kafka Streams: TopologyTestDriver runs fast with no broker.',
        'Integration: Testcontainers (KafkaContainer) or Spring @EmbeddedKafka.',
        'Check schema compatibility in CI.',
        'Test the failure paths too: retries, DLT, duplicates, rebalances.',
      ],
      detail: `<pre><code>@Testcontainers
class OrderFlowIT {
  @Container
  static KafkaContainer kafka = new KafkaContainer("apache/kafka:4.0.0");

  @Test
  void sendsOrder() {
    var props = Map.&lt;String, Object&gt;of("bootstrap.servers", kafka.getBootstrapServers());
    // create producer/consumer with props, send, then assert what was read
  }
}</code></pre>`,
    },
  ],
};

export const internals: KmNode = {
  title: 'Internals (Expert)',
  level: 'expert',
  summary: 'What happens under the hood: coordinators, protocols, transactions and failure cases.',
  simple: 'Opening the engine: how Kafka keeps its promises when machines and networks misbehave.',
  children: [
    {
      title: 'Group coordinator protocol',
      level: 'expert',
      summary:
        'How consumer groups are tracked, given partitions, and how their commits are checked.',
      points: [
        'The coordinator is the broker leading the __consumer_offsets partition picked by hash(group.id).',
        'Classic protocol: JoinGroup → SyncGroup (a client does the assignment) → Heartbeat.',
        'A generation id / member epoch (a version counter) rejects commits from outdated members.',
        'KIP-848: ConsumerGroupHeartbeat lets the broker assign step by step, with no global pause.',
      ],
    },
    {
      title: 'Transaction internals',
      level: 'expert',
      summary: 'The transaction coordinator, __transaction_state, commit markers and the LSO.',
      points: [
        'The producer registers its transactional.id and gets an id + epoch. A higher epoch blocks zombies.',
        'Touched partitions are added to the transaction, logged in __transaction_state.',
        'Commit has two phases: log PREPARE_COMMIT, then write COMMIT markers into each partition.',
        'LSO (Last Stable Offset): read_committed consumers can’t read past the first open transaction.',
        'A stuck transaction blocks read_committed readers, so transaction.timeout.ms matters.',
      ],
    },
    {
      title: 'Leader epoch & log truncation',
      level: 'expert',
      summary: 'How copies agree on the same history after the leader changes.',
      points: [
        'Each new leader bumps the leader epoch (a term number), saved in a checkpoint file.',
        'A returning follower asks "where did epoch N end?" and cuts off any data that differs.',
        'Replaced the older high-watermark method, which could lose or mix up data (KIP-101).',
      ],
    },
    {
      title: 'Failure scenarios',
      level: 'expert',
      summary: 'What happens when things break. A favourite senior interview topic.',
      points: [
        'Leader broker dies: the controller picks a new leader from the ISR. Clients refresh and retry.',
        'Follower falls behind: dropped from ISR. If ISR &lt; min.insync.replicas, acks=all writes fail.',
        'Consumer crashes mid-batch: its partitions move, and records after the last commit run again.',
        'Network split: the cut-off leader can’t move the high watermark. A new leader takes over; the old one truncates on return.',
        'Whole zone lost: you survive if copies were spread across zones and enough ISR remain.',
        'Disk full: the broker stops. Retention, monitoring and tiered storage prevent it.',
      ],
    },
    {
      title: 'Disaster recovery',
      level: 'expert',
      summary:
        'Copying across clusters, deciding how much loss and downtime is OK, and how to fail over.',
      points: [
        'RPO = how much data you can afford to lose. RTO = how long you can be down.',
        'Stretch one cluster across zones (synchronous, RPO 0) vs separate clusters with MM2 (asynchronous, RPO &gt; 0).',
        'Failover plan: switch clients, translate consumer offsets, handle duplicates.',
        'Practise failover often. An untested DR plan is just a wish.',
      ],
    },
    {
      title: 'Kafka 4.x landscape',
      level: 'expert',
      summary: 'Recent changes every expert should know.',
      points: [
        'ZooKeeper removed, KRaft only (4.0).',
        'New consumer rebalance protocol KIP-848 is GA (4.0).',
        'Share groups (KIP-932, "queues for Kafka"): per-message acks, more readers than partitions.',
        'Tiered storage production-ready (3.9). linger.ms default is now 5 ms (4.0).',
        'Brokers need Java 17 (clients Java 11), and very old client protocol versions were removed.',
      ],
    },
  ],
};
