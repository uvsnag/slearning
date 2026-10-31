import type { KmNode } from '../../types';

export const operations: KmNode = {
  title: 'Operations & Performance',
  level: 'advanced',
  summary: 'Sizing, settings, monitoring, tuning and everyday care of a Kafka cluster.',
  simple:
    'Running Kafka in production is like running a power plant: plan the capacity, watch the gauges, and know which valves to turn.',
  children: [
    {
      title: 'Choosing partition count',
      level: 'advanced',
      summary:
        'Enough partitions for your speed and number of consumers, but not thousands "just in case".',
      points: [
        'Rough rule: target MB/s ÷ MB/s one partition can handle (check both producer and consumer side).',
        'Also at least the max number of consumers you plan to run in one group.',
        'Too many costs you: more open files, more memory, slower failover and rebalances.',
        'Plan ahead for keyed topics. Adding partitions later breaks key order.',
        'Good starting numbers: 6, 12 or 24 (they divide evenly among many consumer counts).',
      ],
    },
    {
      title: 'Important configs',
      level: 'advanced',
      summary: 'The few broker and topic settings that matter most.',
      points: [
        'default.replication.factor=3 and min.insync.replicas=2.',
        'auto.create.topics.enable=false in production. Create topics on purpose.',
        'num.partitions: the count used for auto-created topics.',
        'log.retention.hours / retention.ms and log.segment.bytes.',
        'Keep size limits in line: message.max.bytes (broker), max.request.size (producer), max.partition.fetch.bytes (consumer).',
        'num.network.threads and num.io.threads for busy brokers.',
      ],
    },
    {
      title: 'Monitoring',
      level: 'advanced',
      summary: 'The key numbers and tools that tell you the cluster is healthy.',
      simple:
        'The dashboard lights to watch: are the copies in sync, are readers keeping up, are requests slow?',
      points: [
        'UnderReplicatedPartitions &gt; 0 is the #1 broker alert.',
        'OfflinePartitionsCount, and ActiveControllerCount (must be exactly 1 in the cluster).',
        'UnderMinIsrPartitionCount: acks=all writes will fail.',
        'Request delay (produce/fetch p99), request queue size, how busy network and IO threads are.',
        'Consumer lag per group, how often rebalances happen, disk use and GC pauses.',
        'Tools: JMX → Prometheus/Grafana, Burrow, Cruise Control, Kafka UI, AKHQ, Conduktor.',
      ],
    },
    {
      title: 'Throughput vs latency tuning',
      level: 'advanced',
      summary:
        'You trade speed per message (latency) against total volume (throughput) with a few settings.',
      simple:
        'A bus that waits to fill up moves more people per trip. A taxi leaves right away but carries fewer.',
      points: [
        'More throughput: bigger batch.size, higher linger.ms, compression (lz4/zstd), bigger fetch.min.bytes.',
        'Lower latency: small linger.ms and fetch.max.wait.ms. acks=1 only if losing data is OK.',
        'Safety: acks=all + min.insync.replicas=2 adds about one extra copy round-trip.',
        'Measure with kafka-producer-perf-test.sh and kafka-consumer-perf-test.sh.',
      ],
      detail: `<pre><code>// tuned for throughput
props.put("batch.size", 128 * 1024);
props.put("linger.ms", 20);
props.put("compression.type", "lz4");
props.put("acks", "all");</code></pre>`,
    },
    {
      title: 'Scaling & rebalancing data',
      level: 'expert',
      summary: 'New brokers start empty. You must move partitions to them yourself.',
      points: [
        'kafka-reassign-partitions.sh with a throttle (speed limit) so live traffic isn’t hurt.',
        'Cruise Control does the balancing for you based on disk, CPU and network.',
        'Run a preferred leader election to spread leaders again after restarts.',
        'Tiered storage makes moving partitions much cheaper (less data on local disk).',
      ],
    },
    {
      title: 'Upgrades & maintenance',
      level: 'expert',
      summary: 'Restart and upgrade brokers one by one, with no downtime.',
      points: [
        'Rolling restart: one broker at a time. Wait for UnderReplicatedPartitions = 0 before the next.',
        'Controlled shutdown moves leaders away before the broker stops.',
        'Upgrade the software on all nodes first, then raise metadata.version (KRaft).',
        'Clients work across many versions, but read the release notes (4.0 dropped very old protocol versions).',
      ],
    },
    {
      title: 'Hosting options',
      level: 'intermediate',
      summary: 'Run it yourself, on Kubernetes with an operator, or pay for a managed service.',
      simple: 'Cook at home, use a meal kit, or eat at a restaurant: more control or less work.',
      points: [
        'Self-managed on VMs or bare metal: full control, all the work is yours.',
        'Kubernetes: Strimzi operator or Confluent for Kubernetes.',
        'Managed: Confluent Cloud, Amazon MSK (incl. Serverless), Aiven, Azure Event Hubs (Kafka API).',
        'Kafka-compatible engines: Redpanda, WarpStream, AutoMQ.',
      ],
    },
  ],
};

export const security: KmNode = {
  title: 'Security',
  level: 'advanced',
  summary:
    'Encrypting traffic, checking who clients are, controlling what they can do, and setting limits.',
  simple:
    'Lock the doors (encryption), check ID cards (authentication), and decide who may open which mailbox (authorization).',
  children: [
    {
      title: 'Encryption (TLS)',
      level: 'advanced',
      summary: 'Encrypt traffic between clients and brokers, and between brokers, with TLS.',
      points: [
        'Use listeners like SASL_SSL://:9093, and set how brokers talk to each other.',
        'Cost: more CPU, and you lose the zero-copy speed trick.',
        'Kafka doesn’t encrypt its data files. Do that at the disk or cloud volume level.',
      ],
    },
    {
      title: 'Authentication (SASL / mTLS)',
      level: 'advanced',
      summary: 'Prove who a client is, with a SASL login method or client certificates (mTLS).',
      points: [
        'SASL/SCRAM-SHA-512: username and password, stored hashed in the cluster.',
        'SASL/OAUTHBEARER: OAuth2 / OIDC tokens. Good for cloud and single sign-on.',
        'SASL/GSSAPI: Kerberos, common in big companies.',
        'SASL/PLAIN: only over TLS. Mostly used with API keys on managed services.',
        'mTLS: each client has a certificate, and its name becomes the user.',
      ],
      detail: `<pre><code>props.put("security.protocol", "SASL_SSL");
props.put("sasl.mechanism", "SCRAM-SHA-512");
props.put("sasl.jaas.config",
    "org.apache.kafka.common.security.scram.ScramLoginModule required "
  + "username=\\"billing\\" password=\\"" + secret + "\\";");</code></pre>`,
    },
    {
      title: 'Authorization (ACLs)',
      level: 'advanced',
      summary:
        'ACLs (access rules) allow or deny actions like Read or Write on topics, groups and more.',
      points: [
        'A consumer needs Read on the topic AND Read on its group.',
        'Use prefixed ACLs to give a team its own namespace (team-a.*).',
        'Give only what is needed, and set allow.everyone.if.no.acl.found=false.',
        'Manage them with kafka-acls.sh or from code with the Admin client.',
      ],
      detail: `<pre><code>var allowRead = new AccessControlEntry(
    "User:billing", "*", AclOperation.READ, AclPermissionType.ALLOW);

admin.createAcls(List.of(
    new AclBinding(new ResourcePattern(ResourceType.TOPIC, "orders", PatternType.LITERAL), allowRead),
    new AclBinding(new ResourcePattern(ResourceType.GROUP, "billing", PatternType.LITERAL), allowRead)
)).all().get();</code></pre>`,
    },
    {
      title: 'Quotas & multi-tenancy',
      level: 'expert',
      summary: 'Limit how much each user or client can send, read or ask for.',
      points: [
        'producer_byte_rate, consumer_byte_rate and request_percentage.',
        'Stops one noisy team from slowing everyone else down.',
        'Combine with naming rules, prefixed ACLs and per-team topics.',
      ],
    },
  ],
};
