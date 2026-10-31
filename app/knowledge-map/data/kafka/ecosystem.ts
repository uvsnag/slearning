import type { KmNode } from '../../types';

export const schemas: KmNode = {
  title: 'Data & Schemas',
  level: 'intermediate',
  summary: 'Data formats, Schema Registry, and changing your event shape safely.',
  simple:
    'Producers and consumers must speak the same "language". A schema is the shared grammar, and the registry is the dictionary everyone checks.',
  children: [
    {
      title: 'Serialization formats',
      level: 'intermediate',
      summary: 'Kafka only stores bytes. Serializers turn your objects into bytes and back.',
      simple: 'Like packing furniture flat for shipping and building it again at the other end.',
      points: [
        'JSON: easy to read, no enforced shape, bigger messages.',
        'Avro: small binary format with a schema and good rules for change. The classic Kafka pick.',
        'Protobuf: small binary, great tools, popular with gRPC teams.',
        'JSON Schema: plain JSON plus validation.',
        'A record that can’t be decoded is a "poison pill". In Spring, use ErrorHandlingDeserializer.',
      ],
    },
    {
      title: 'Schema Registry',
      level: 'intermediate',
      summary:
        'A service that stores numbered schema versions. Each message carries only a small schema ID.',
      simple:
        'Instead of writing the whole grammar on every letter, you write "grammar #12" and readers look it up.',
      points: [
        'Message layout: 1 magic byte + 4-byte schema ID + the data.',
        'Schemas are grouped by "subject", by default topic-value (e.g. orders-value).',
        'The registry checks a new version is compatible before accepting it.',
        'Options: Confluent Schema Registry, Apicurio, AWS Glue Schema Registry.',
      ],
    },
    {
      title: 'Schema evolution & compatibility',
      level: 'advanced',
      summary: 'BACKWARD, FORWARD and FULL rules decide which schema changes are safe.',
      simple:
        'BACKWARD: new readers can read old letters. FORWARD: old readers can read new letters. FULL: both.',
      points: [
        'BACKWARD (default): upgrade consumers first. You may remove fields, or add fields that have defaults.',
        'FORWARD: upgrade producers first. You may add fields, or remove fields that had defaults.',
        'FULL: both ways. Only add or remove optional fields with defaults.',
        '*_TRANSITIVE versions check against every older version, not just the last one.',
        'Breaking change? Make a new topic (orders.v2) and migrate over time.',
      ],
    },
    {
      title: 'Event design',
      level: 'advanced',
      summary: 'Good events are clear facts with stable IDs and useful metadata.',
      points: [
        'Name events in the past tense: OrderPlaced, PaymentFailed.',
        'Include an eventId (to spot duplicates), occurredAt, the entity id, a version and a trace id.',
        'Thin event (just IDs, readers call back for details) vs fat event (all the data, no call back).',
        'Don’t just expose your internal DB tables as events. Think of them as a public contract.',
      ],
      detail: `<pre><code>const orderPlaced = {
  eventId: 'e7f1c2',
  type: 'OrderPlaced',
  version: 1,
  occurredAt: '2026-10-31T10:03:00Z',
  orderId: 42,
  customerId: 7,
  total: 120.5,
};</code></pre>`,
    },
  ],
};

export const ecosystem: KmNode = {
  title: 'Ecosystem',
  level: 'intermediate',
  summary: 'Tools around Kafka: Connect, Streams, ksqlDB, CDC, MirrorMaker and Spring.',
  simple:
    'Kafka is the highway. The ecosystem is the on-ramps (Connect), the factories along the road (Streams) and the bridges to other highways (MirrorMaker).',
  children: [
    {
      title: 'Kafka Connect',
      level: 'intermediate',
      summary: 'Move data in and out of Kafka with ready-made connectors instead of writing code.',
      simple:
        'Ready-made plugs: "copy this database table into Kafka" or "copy this topic into Elasticsearch", set up with a small JSON config.',
      points: [
        'Source connectors bring data in (DB, files, other queues). Sink connectors push it out (S3, Elasticsearch, JDBC…).',
        'Runs as a cluster of workers. Tasks are the units of parallel work.',
        'SMTs (Single Message Transforms) make small changes to each record on the way.',
        'Converters handle the data format (Avro, JSON, Protobuf).',
        'Errors: errors.tolerance and a dead-letter queue for sink connectors.',
      ],
    },
    {
      title: 'CDC with Debezium',
      level: 'advanced',
      summary:
        'Change Data Capture: stream every insert, update and delete from a database into Kafka.',
      simple:
        'Instead of asking the database "what changed?" every minute, you listen to its diary of changes as they happen.',
      points: [
        'Reads the database’s own change log (MySQL binlog, Postgres WAL, Oracle LogMiner…).',
        'Sends the before and after state of each row. Starts with a full snapshot, then streams changes.',
        'Used for: outbox relay, cache clearing, search indexing, data lakes, moving off old systems.',
        'No app code changes, low delay, and order is kept per row key.',
      ],
    },
    {
      title: 'Kafka Streams',
      level: 'advanced',
      summary:
        'A Java library for processing streams with state. It runs inside your app, no extra cluster.',
      simple:
        'A factory conveyor belt: read events, filter, join, count, and write results to new topics, non-stop.',
      children: [
        {
          title: 'KStream vs KTable',
          level: 'advanced',
          summary:
            'KStream = every event, added one after another. KTable = only the latest value per key.',
          points: [
            'KStream: clicks, payments. Each record is a new fact.',
            'KTable: user profile, account balance. A record replaces the old value for its key.',
            'GlobalKTable: a full copy of a small table on every instance (e.g. country codes).',
            'They are two views of the same thing: a table is a stream added up, a stream is a table’s change history.',
          ],
        },
        {
          title: 'Stateful ops & state stores',
          level: 'advanced',
          summary:
            'Counts and joins keep local state (in RocksDB, a small embedded database), backed up to Kafka topics.',
          points: [
            'count, aggregate, reduce and joins. Stream-to-stream joins need a time window.',
            'State lives in local RocksDB. A changelog topic rebuilds it after a crash.',
            'Standby replicas (warm copies) make the rebuild faster.',
            'Interactive queries let your own API read that state.',
            'Changing the key (groupBy) creates a repartition topic. Watch its cost.',
          ],
        },
        {
          title: 'Windowing & time',
          level: 'expert',
          summary: 'Group events by time: tumbling, hopping, sliding and session windows.',
          points: [
            'Event time (when it happened) vs processing time (when you see it). Streams uses the record timestamp.',
            'The grace period says how long late events are still accepted.',
            'suppress(untilWindowCloses) sends only the final result of each window.',
          ],
        },
        {
          title: 'Scaling & EOS',
          level: 'expert',
          summary:
            'Parallel work = number of input partitions (tasks). Turn on exactly_once_v2 for exactly-once.',
          points: [
            'Each input partition becomes a task. Tasks are spread over app instances and threads.',
            'application.id is the consumer group name and the prefix for internal topics.',
            'processing.guarantee=exactly_once_v2 uses Kafka transactions under the hood.',
          ],
        },
      ],
      detail: `<pre><code>builder.stream("orders", Consumed.with(Serdes.String(), orderSerde))
  .filter((k, o) -&gt; o.amount() &gt; 1000)
  .groupBy((k, o) -&gt; o.customerId())
  .count()
  .toStream()
  .to("big-orders-per-customer");</code></pre>`,
    },
    {
      title: 'ksqlDB & Flink',
      level: 'advanced',
      summary:
        'ksqlDB lets you write SQL over topics. Apache Flink is a full, separate stream-processing engine.',
      points: [
        'ksqlDB: CREATE STREAM / CREATE TABLE … AS SELECT on top of topics.',
        'Flink: its own cluster, very strong with event time, often used with Kafka (Flink SQL).',
        'Pick Streams for Java services, Flink for big or complex pipelines, ksqlDB for simple SQL changes.',
      ],
    },
    {
      title: 'MirrorMaker 2 & multi-cluster',
      level: 'expert',
      summary: 'Copy topics between clusters for disaster recovery, migration or other regions.',
      points: [
        'MM2 runs on Kafka Connect. It copies topics, configs, ACLs and consumer offsets.',
        'Setups: active-passive (backup), active-active (with name prefixes to avoid loops), hub-and-spoke.',
        'Offsets differ between clusters, so translate them when you fail over.',
        'Alternatives: Confluent Cluster Linking, or the cloud provider’s replication.',
      ],
    },
    {
      title: 'Spring for Apache Kafka',
      level: 'intermediate',
      summary:
        'KafkaTemplate to send, @KafkaListener to receive, plus built-in error handling and retries.',
      simple: 'Spring does the boring setup for you, so you mostly write one method per topic.',
      points: [
        'KafkaTemplate.send() returns CompletableFuture&lt;SendResult&gt;.',
        '@KafkaListener(topics, groupId, concurrency). Keep concurrency ≤ partitions.',
        'AckMode: BATCH (default), RECORD, MANUAL, MANUAL_IMMEDIATE.',
        'DefaultErrorHandler with backoff + DeadLetterPublishingRecoverer. @RetryableTopic for non-blocking retries.',
        'Spring Cloud Stream is a higher-level option on top.',
      ],
      detail: `<pre><code>@KafkaListener(topics = "orders", groupId = "billing", concurrency = "3")
public void onOrder(OrderEvent event, Acknowledgment ack) {
  billingService.charge(event);   // must be safe to run twice
  ack.acknowledge();
}</code></pre>`,
    },
  ],
};
