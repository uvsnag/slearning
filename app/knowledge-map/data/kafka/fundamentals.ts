import type { KmNode } from '../../types';

export const fundamentals: KmNode = {
  title: 'Fundamentals',
  level: 'beginner',
  summary:
    'The basic words you need first: events, topics, partitions, offsets, brokers, producers and consumers.',
  simple:
    'Picture a big shared notebook. Some apps write new lines at the end, other apps read at their own speed. Nobody tears pages out after reading. Each reader just remembers which line they are on.',
  points: [
    'Kafka saves streams of events safely and lets many apps read them.',
    'Writers (producers) and readers (consumers) never talk to each other directly.',
    'Data is organised as topics, split into partitions, holding records numbered by offset.',
  ],
  children: [
    {
      title: 'What is Kafka?',
      level: 'beginner',
      summary: 'A system that stores events in an append-only log and lets many apps share them.',
      simple:
        'Kafka is like a post office that keeps every letter for a set time, even after it is read. Senders drop letters into named mailboxes, and any number of readers can read the same letters, now or later.',
      points: [
        'Built at LinkedIn in 2011, now an Apache project. Confluent is the main company behind it.',
        'Three jobs: send and receive events, store them safely, and process them as they arrive.',
        'Need more speed? Add more servers and partitions (it scales out).',
        'It can handle millions of messages per second with delays of a few milliseconds.',
      ],
      detail: `<p>People often call Kafka a <em>message broker</em>, but it is really a <strong>distributed commit log</strong>: a list of events that only grows at the end, copied to several servers.</p>
<p>Events stay for a set time whether or not anyone read them. So Kafka works as a buffer between fast and slow apps, as a history you can replay, and as input for live processing.</p>`,
      tip: 'In an interview, say "Kafka is a distributed, partitioned, replicated commit log", then explain each word in plain terms.',
    },
    {
      title: 'Why & when to use it',
      level: 'beginner',
      summary:
        'To decouple services, absorb traffic spikes, build data pipelines and react to events in real time.',
      simple:
        'Without Kafka, every service calls every other service, like everyone phoning each other. With Kafka, everyone posts on one notice board and reads only what they care about.',
      points: [
        'Decoupling: producers don’t know who reads. You can add new readers without touching the producer.',
        'Buffering: if a reader is slow or down, events wait safely in Kafka.',
        'Fan-out: one event can feed search, analytics, emails and audit at the same time.',
        'Replay: fix a bug and reprocess old events, or fill a new service from history.',
        'Common uses: user activity, logs, database change streams (CDC), order and payment events, IoT data.',
      ],
      tip: 'Also know when NOT to use it. See "Design & Architecture → When NOT to use Kafka".',
    },
    {
      title: 'Event (Record / Message)',
      level: 'beginner',
      summary: 'One piece of data in Kafka: a key, a value, headers and a timestamp.',
      simple:
        'An event is a fact that happened: "Order #42 was paid at 10:03". You never edit it. If something changes, you write a new event.',
      points: [
        'Key (optional): picks the partition, e.g. orderId or userId.',
        'Value: the actual data (JSON, Avro, Protobuf or raw bytes).',
        'Headers: extra labels like a trace id or the event type.',
        'Timestamp: set by the producer (CreateTime) or by the broker (LogAppendTime).',
        'Max size is about 1 MB by default. Put big files in S3 and send a link instead.',
      ],
      detail: `<pre><code>const event = {
  key: 'order-42',
  value: JSON.stringify({ orderId: 42, status: 'PAID', amount: 120.5 }),
  headers: { traceId: 'abc123', type: 'OrderPaid' },
  timestamp: Date.now().toString(),
};</code></pre>`,
    },
    {
      title: 'Topic',
      level: 'beginner',
      summary: 'A named stream for one kind of event, like orders, payments or user-signups.',
      simple:
        'A topic is a labelled folder in the notebook. All orders go into the "orders" folder, all payments into the "payments" folder.',
      points: [
        'Many producers can write to it and many consumers can read from it.',
        'Reading does not delete anything. Events go away only by retention (time or size) or compaction.',
        'Each topic is split into one or more partitions. That is where the parallel work comes from.',
        'Set per topic: partition count, replication factor (number of copies), retention and cleanup policy.',
      ],
      detail: `<pre><code>try (Admin admin = Admin.create(Map.of("bootstrap.servers", "localhost:9092"))) {
  // 6 partitions, 3 copies of each
  admin.createTopics(List.of(new NewTopic("orders", 6, (short) 3))).all().get();
}</code></pre>`,
    },
    {
      title: 'Partition',
      level: 'beginner',
      summary:
        'An ordered slice of a topic. It decides parallelism, ordering and where copies live.',
      simple:
        'If a topic is a highway, partitions are the lanes. More lanes let more cars move at once, but order is only kept inside one lane.',
      points: [
        'Order is kept only inside one partition, not across the whole topic.',
        'Same key always goes to the same partition, so all events of one order stay in order.',
        'In one consumer group, each partition is read by only one consumer.',
        'You can add partitions but never remove them. Adding them changes which partition a key goes to.',
      ],
      detail: `<pre><code>orders-0: [0][1][2][3][4] →
orders-1: [0][1][2] →
orders-2: [0][1][2][3] →</code></pre>
<p>Each partition is its own log with its own offsets.</p>`,
    },
    {
      title: 'Offset',
      level: 'beginner',
      summary: 'The position number of a record inside a partition.',
      simple:
        'The offset is the line number in the notebook. A consumer says "I finished line 41", so after a restart it continues from line 42.',
      points: [
        'Offsets start at 0 and only go up. They are unique per partition, not per topic.',
        'Consumers save (commit) their offsets in a hidden topic called __consumer_offsets.',
        'The committed offset is the NEXT record to read (last done + 1).',
        'You can jump back (seek) to an older offset to read data again.',
      ],
    },
    {
      title: 'Broker & Cluster',
      level: 'beginner',
      summary:
        'A broker is one Kafka server. A cluster is a group of brokers sharing the partitions.',
      simple:
        'Brokers are post-office branches. Each branch stores some mailboxes, and other branches keep copies in case one burns down.',
      points: [
        'Each broker stores many partition copies and handles reads and writes for the ones it leads.',
        'Clients connect to any broker (the bootstrap servers) and learn where everything lives.',
        'Production clusters usually have 3 or more brokers, so you can keep 3 copies of each partition.',
        'A controller manages the cluster layout. Kafka now uses KRaft for this; ZooKeeper was removed in Kafka 4.0.',
      ],
    },
    {
      title: 'Producer',
      level: 'beginner',
      summary: 'An app that writes (publishes) events to topics.',
      simple:
        'The producer is the person writing letters and dropping them into the right mailbox.',
      points: [
        'Turns key and value into bytes, picks a partition, groups records into batches and sends them.',
        'Sending is asynchronous: send() returns right away and tells you the result later.',
        'Safety settings (acks, retries, idempotence) are covered in the Producer branch.',
      ],
      detail: `<pre><code>Properties p = new Properties();
p.put("bootstrap.servers", "localhost:9092");
p.put("key.serializer", StringSerializer.class.getName());
p.put("value.serializer", StringSerializer.class.getName());

try (var producer = new KafkaProducer&lt;String, String&gt;(p)) {
  producer.send(new ProducerRecord&lt;&gt;("orders", "order-42", "{...}"),
      (meta, ex) -&gt; {
        if (ex != null) log.error("send failed", ex);
        else log.info("saved at offset {}", meta.offset());
      });
}</code></pre>`,
    },
    {
      title: 'Consumer',
      level: 'beginner',
      summary:
        'An app that reads events by asking for new ones and remembering its position (offset).',
      simple:
        'The consumer is the reader. Kafka does not push letters to it. The reader asks "anything new after line 41?" This is called pulling.',
      points: [
        'Pull-based: the consumer reads at its own speed, so it never gets flooded.',
        'Inside each partition, records come in offset order.',
        'It commits offsets to remember where it stopped.',
      ],
      detail: `<pre><code>consumer.subscribe(List.of("orders"));
while (running) {
  var records = consumer.poll(Duration.ofMillis(500));
  for (var r : records) {
    process(r.key(), r.value());
  }
  consumer.commitSync();
}</code></pre>`,
    },
    {
      title: 'Consumer Group',
      level: 'beginner',
      summary: 'A team of consumers with the same group.id that share the partitions of a topic.',
      simple:
        'Think of a team sorting mail. Each mailbox (partition) goes to exactly one person on the team. Another team can read the same mail on its own.',
      points: [
        'In one group, each partition goes to exactly one consumer. That is how you scale reading.',
        'Each different group gets ALL the messages (fan-out).',
        'More consumers than partitions? The extra ones just wait.',
        'When someone joins or leaves, partitions are handed out again (a rebalance).',
      ],
      detail: `<pre><code>topic orders (4 partitions)

group "billing":   C1 ← p0,p1   C2 ← p2,p3
group "analytics": C1 ← p0,p1,p2,p3</code></pre>`,
      tip: 'Your partition count is the max number of consumers that can work in parallel in one group.',
    },
    {
      title: 'Kafka vs message queues',
      level: 'intermediate',
      summary:
        'Kafka keeps a log you can replay. Classic queues like RabbitMQ or SQS delete a message once it is handled.',
      simple:
        'A queue is a to-do list: when a task is done, it is crossed off and gone. Kafka is a diary: entries stay, and each reader keeps their own bookmark.',
      points: [
        'Kafka: keeps data for a set time, replay, order per partition, very high volume.',
        'RabbitMQ: smart routing, per-message acks, priorities, but lower volume.',
        'SQS: fully managed, simple queue, no replay (FIFO queues if you need order).',
        'Pulsar, Kinesis and Redpanda are other log-based options with different trade-offs.',
        'Kafka 4.x adds share groups (KIP-932, "queues for Kafka") for queue-style, per-message reading.',
      ],
      tip: 'Pick a queue to hand out tasks with per-message retries. Pick Kafka for event streams, many readers, replay and high volume.',
    },
  ],
};
