import type { KmNode } from '../../types';

export const producer: KmNode = {
  title: 'Producer in depth',
  level: 'intermediate',
  summary:
    'How the producer picks partitions, waits for confirmation, batches, retries and avoids duplicates.',
  simple:
    'Sending a letter has choices: which mailbox, whether to wait for a receipt, whether to put several letters in one envelope, and what to do if delivery fails.',
  detail: `<p><strong>What send() does:</strong> turn the record into bytes → pick a partition → add it to a batch in memory → a background thread sends batches to the partition leaders → the broker replies → your callback runs.</p>`,
  children: [
    {
      title: 'Partitioning & keys',
      level: 'intermediate',
      summary: 'How the producer decides which partition a record goes to.',
      simple:
        'If a letter has a name on it (the key), it always goes to that person’s mailbox. Letters with no name are spread evenly.',
      points: [
        'With a key: partition = hash(key) % partition count. Same key, same partition, same order.',
        'No key: "sticky" mode fills one batch for one partition, then moves on (uniform sticky since 3.3).',
        'You can write your own Partitioner for special routing.',
        'One very busy key (a huge customer) makes one partition hot. Split or "salt" that key.',
      ],
      tip: 'Choose the key by what must stay in order. "All events of one order in order" → key = orderId.',
    },
    {
      title: 'acks',
      level: 'intermediate',
      summary: 'How many copies must confirm a write before the producer calls it a success.',
      simple:
        'acks=0: drop the letter and walk away. acks=1: wait until the main branch signs for it. acks=all: wait until the main branch and every up-to-date backup have a copy.',
      points: [
        'acks=0: fastest, but data can be lost without you knowing.',
        'acks=1: the leader saved it. Lost if the leader dies before followers copy it.',
        'acks=all (or -1): every ISR copy has it. Default since Kafka 3.0.',
        'acks=all is only as strong as min.insync.replicas. Set it to 2 when you keep 3 copies.',
        'If too few copies are in sync, writes are refused with NotEnoughReplicas.',
      ],
    },
    {
      title: 'Batching & linger',
      level: 'intermediate',
      summary: 'batch.size and linger.ms add a tiny delay to get much more throughput.',
      simple:
        'Waiting a few milliseconds to fill a truck is much cheaper than sending one truck per parcel.',
      points: [
        'batch.size (16 KB default): max size of one batch for one partition.',
        'linger.ms: how long to wait for more records. 5 ms by default since Kafka 4.0 (0 before).',
        'buffer.memory (32 MB): memory for unsent records. When full, send() waits up to max.block.ms.',
        'For more throughput: batch.size 64–256 KB, linger.ms 10–50, and compression.',
      ],
    },
    {
      title: 'Compression',
      level: 'intermediate',
      summary: 'The producer squeezes whole batches with lz4, zstd, snappy or gzip.',
      simple:
        'Like vacuum-packing clothes before a trip: more fits in the suitcase, but packing takes a little effort.',
      points: [
        'Set compression.type on the producer. The broker stores the batches as they are.',
        'zstd squeezes the most. lz4 is very fast and a good default. gzip uses a lot of CPU.',
        'Bigger batches compress better, so batching and compression help each other.',
        'Saves network and disk, costs some CPU.',
      ],
    },
    {
      title: 'Retries & timeouts',
      level: 'intermediate',
      summary: 'The producer retries short failures on its own, within delivery.timeout.ms.',
      simple:
        'If the post office is briefly closed, the courier keeps coming back, but gives up after two minutes.',
      points: [
        'Retries are basically unlimited. delivery.timeout.ms (2 min) caps the total time.',
        'request.timeout.ms: how long to wait for one broker reply.',
        'retry.backoff.ms: pause between attempts.',
        'Keep max.in.flight.requests.per.connection ≤ 5 so idempotence keeps the order.',
        'Errors that retrying can’t fix (too large, no permission, bad data) go straight to your callback.',
      ],
      tip: 'Always check the send callback or Future. "Fire and forget" with no error handling is the top cause of silent data loss.',
    },
    {
      title: 'Idempotent producer',
      level: 'advanced',
      summary: 'Stops retries from creating duplicates or mixing up the order.',
      simple:
        'Every letter gets a serial number. If the post office gets letter #7 twice because of a retry, it keeps only one.',
      points: [
        'enable.idempotence=true. On by default since Kafka 3.0, together with acks=all.',
        'The broker tracks a producer id plus a sequence number per partition and drops repeats.',
        'It only covers retries inside one producer session. If your app calls send() twice, you still get two records.',
      ],
    },
    {
      title: 'Transactions',
      level: 'advanced',
      summary:
        'Write to several partitions (and save consumer offsets) as one all-or-nothing step.',
      simple:
        'Either every letter in the envelope is delivered, or none is. Readers who ask for "committed only" never see half a delivery.',
      points: [
        'Set a transactional.id, then begin, send, and commit or abort.',
        'sendOffsetsToTransaction makes read → process → write exactly-once.',
        'Consumers must set isolation.level=read_committed to skip aborted data.',
        'The transactional.id blocks old "zombie" copies of your app after a restart.',
        'Only covers Kafka to Kafka. A database write is outside it (use the outbox pattern).',
      ],
      detail: `<pre><code>producer.initTransactions();
try {
  producer.beginTransaction();
  producer.send(new ProducerRecord&lt;&gt;("payments", key, value));
  producer.send(new ProducerRecord&lt;&gt;("audit", key, audit));
  producer.sendOffsetsToTransaction(offsets, consumer.groupMetadata());
  producer.commitTransaction();
} catch (KafkaException e) {
  producer.abortTransaction();
}</code></pre>`,
    },
  ],
};

export const consumer: KmNode = {
  title: 'Consumer in depth',
  level: 'intermediate',
  summary: 'The poll loop, saving progress, rebalancing, health checks, lag and scaling.',
  simple:
    'A reader keeps asking for new letters, handles them, and updates the bookmark. The team leader reshuffles mailboxes whenever someone joins or leaves the team.',
  children: [
    {
      title: 'Poll loop',
      level: 'intermediate',
      summary: 'poll() fetches records, and also keeps the consumer in the group.',
      simple:
        'Like checking your mailbox in a loop: open, take the letters, handle them, come back.',
      points: [
        'KafkaConsumer is NOT thread-safe. Use one consumer per thread.',
        'max.poll.records (500) limits how many records one poll returns.',
        'fetch.min.bytes and fetch.max.wait.ms trade a bit of delay for fewer, bigger fetches.',
        'To shut down cleanly, call wakeup() from another thread, then close().',
      ],
    },
    {
      title: 'Offset commit',
      level: 'intermediate',
      summary: 'How a consumer saves its progress. When you save decides your delivery guarantee.',
      simple:
        'Moving your bookmark BEFORE reading a page means you may skip it if you fall asleep. Moving it AFTER means you may read it twice. That is at-most-once vs at-least-once.',
      points: [
        'enable.auto.commit=true (default): saves every 5 s during poll(). A crash can lose or repeat records.',
        'Manual: commitSync (waits and retries) or commitAsync (fast, no retry; do a final commitSync on shutdown).',
        'Commit after processing = at-least-once. Your processing must handle duplicates.',
        'Offsets are stored in the compacted topic __consumer_offsets.',
      ],
    },
    {
      title: 'auto.offset.reset',
      level: 'beginner',
      summary:
        'Where to start reading when there is no saved offset (new group, or the offset expired).',
      simple:
        'A new reader opening the notebook: start at the first page, or only read what gets written from now on?',
      points: [
        'latest (default): only new messages.',
        'earliest: from the oldest data still kept.',
        'none: throw an error, so you must decide on purpose.',
        'Ignored when the group already has a valid saved offset.',
      ],
      tip: 'A new group with "latest" quietly skips everything written before it started. This surprises many people.',
    },
    {
      title: 'Rebalancing',
      level: 'advanced',
      summary: 'Handing out partitions again when consumers join, leave or crash.',
      simple:
        'When a worker joins or leaves, the team leader reassigns mailboxes. The old way, everyone stops during the reshuffle. The new way, only the mailboxes that move are paused.',
      points: [
        'A broker (the group coordinator) tracks members. In the classic protocol, one consumer does the assignment.',
        'Eager rebalance: everyone gives up all partitions and waits. A full stop.',
        'Cooperative rebalance: only moved partitions are paused (CooperativeStickyAssignor).',
        'Static membership (group.instance.id): a quick restart does not trigger a rebalance.',
        'New protocol KIP-848 (group.protocol=consumer, GA in Kafka 4.0): the broker assigns, faster and smoother.',
        'Use a ConsumerRebalanceListener to commit offsets before partitions are taken away.',
      ],
    },
    {
      title: 'Liveness: heartbeat & poll interval',
      level: 'advanced',
      summary: 'Two separate timers decide if a consumer is dead or stuck.',
      points: [
        'session.timeout.ms (45 s): no heartbeat in this time → removed (process or network died).',
        'heartbeat.interval.ms (3 s): how often the background heartbeat is sent.',
        'max.poll.interval.ms (5 min): no poll() in this time → kicked out (processing is stuck or too slow).',
        'Too slow? Lower max.poll.records, speed up the work, or carefully hand work to a thread pool.',
      ],
      tip: 'Signs of a too-slow handler: endless rebalances and "CommitFailedException: the group has already rebalanced".',
    },
    {
      title: 'Consumer lag',
      level: 'intermediate',
      summary: 'How far behind a consumer is: latest offset minus committed offset.',
      simple: 'Lag is the pile of unread letters. A growing pile means the readers can’t keep up.',
      points: [
        'Check it with kafka-consumer-groups.sh, Burrow, Kafka UI or Prometheus exporters.',
        'Alert when lag keeps growing (or lag in time is high), not on a fixed number.',
        'Fixes: more partitions and consumers, faster processing, batch your writes.',
      ],
      detail: `<pre><code>const admin = kafka.admin();
const committed = await admin.fetchOffsets({ groupId: 'billing', topics: ['orders'] });
const latest = await admin.fetchTopicOffsets('orders');
// lag per partition = latest.offset - committed.offset</code></pre>`,
    },
    {
      title: 'Parallelism & scaling',
      level: 'intermediate',
      summary:
        'Add consumers up to the partition count. Past that, use threads inside each consumer.',
      simple: 'You can’t have more cashiers than checkout lanes. But each cashier can get helpers.',
      points: [
        'Max useful consumers in one group = number of partitions.',
        'Inside one consumer you can handle partitions on separate threads and still keep order per partition.',
        'Confluent Parallel Consumer works per key, so you get more parallel work than partitions.',
        'Keep order per key, not per topic.',
      ],
    },
    {
      title: 'Seek & replay',
      level: 'intermediate',
      summary: 'Move a consumer to a chosen offset or time to read data again.',
      simple: 'Like rewinding a video to watch a part again.',
      points: [
        'Java: seek(partition, offset), seekToBeginning, offsetsForTimes(time).',
        'CLI: kafka-consumer-groups.sh --reset-offsets (the group must be stopped).',
        'Typical case: fix a bug, then replay the last 3 days.',
      ],
      detail: `<pre><code>long threeDaysAgo = Instant.now().minus(Duration.ofDays(3)).toEpochMilli();
Map&lt;TopicPartition, Long&gt; query = new HashMap&lt;&gt;();
for (TopicPartition tp : consumer.assignment()) query.put(tp, threeDaysAgo);

consumer.offsetsForTimes(query).forEach((tp, found) -&gt; {
  if (found != null) consumer.seek(tp, found.offset());
});</code></pre>`,
    },
  ],
};
