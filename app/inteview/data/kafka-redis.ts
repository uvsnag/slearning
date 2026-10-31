// Interview data: kafka, redis
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
  // ───────────────────────── KAFKA ─────────────────────────
  {
    id: 'kafka',
    name: 'Kafka',
    icon: '📨',
    questions: [
      // ──── 0. KAFKA SUMMARY — knowledge map ────
      {
        q: 'Kafka Summary — Knowledge Map',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A complete revision checklist for Apache Kafka — the log model, durability, delivery semantics, consumer behaviour, operations and the integration patterns a senior backend engineer is expected to know. Concept names only; use it to spot gaps, not as a tutorial.</p></div>
<h3>1. Core Model</h3>
<ul>
<li><strong>The log</strong>
  <ul>
  <li>Topic, partition, offset, segment files</li>
  <li>Append-only, immutable, ordered per partition</li>
  <li>Key → partition (hash of key), null key → sticky/round-robin</li>
  <li>Retention by time/size vs log compaction</li>
  </ul>
</li>
<li><strong>Clients</strong>
  <ul>
  <li>Producer: batching, linger.ms, compression, partitioner, acks</li>
  <li>Consumer: poll loop, consumer group, partition assignment, offset commit</li>
  </ul>
</li>
<li><strong>Positioning</strong> — distributed log, not a queue; vs RabbitMQ, SQS, Kinesis, Pulsar</li>
</ul>
<h3>2. Durability &amp; Replication</h3>
<ul>
<li>Replication factor, leader / follower, ISR (in-sync replicas)</li>
<li>acks=0 / 1 / all, min.insync.replicas</li>
<li>unclean.leader.election, high watermark</li>
<li>Controller, KRaft (vs ZooKeeper)</li>
</ul>
<h3>3. Delivery Semantics</h3>
<ul>
<li>At-most-once, at-least-once, exactly-once</li>
<li>Idempotent producer (PID + sequence numbers)</li>
<li>Transactions, read_committed, read-process-write</li>
<li>Idempotent consumers (dedupe key, upsert)</li>
</ul>
<h3>4. Consumers in Practice</h3>
<ul>
<li>Auto vs manual commit, commit after processing</li>
<li>Rebalancing: eager vs cooperative-sticky, static membership</li>
<li>max.poll.interval.ms, max.poll.records, session.timeout.ms</li>
<li>Consumer lag, partitions as the unit of parallelism</li>
<li>Retries, retry topics, dead-letter topic (DLT), poison messages</li>
</ul>
<h3>5. Design &amp; Integration</h3>
<ul>
<li>Choosing the partition key and partition count, hot partitions</li>
<li>Schema Registry (Avro/Protobuf), compatibility modes</li>
<li>Transactional outbox, Debezium CDC, dual-write problem</li>
<li>Kafka Connect, Kafka Streams (KStream/KTable, state stores)</li>
<li>Spring Kafka: KafkaTemplate, @KafkaListener, DefaultErrorHandler</li>
</ul>
<h3>6. Senior / Interview Hot Topics</h3>
<ul>
<li>Why Kafka is fast (sequential I/O, page cache, zero-copy, batching)</li>
<li>How to avoid data loss end-to-end (producer + broker + consumer settings)</li>
<li>Ordering guarantees and how they get broken (retries, parallel consumers)</li>
<li>Exactly-once: what it really covers and what it doesn't</li>
<li>Kafka vs RabbitMQ trade-offs</li>
</ul>
<div class="key-point">The most asked areas are: partitions and consumer groups, ordering, the acks + ISR durability story, delivery semantics with idempotent consumers, and rebalancing. If you can explain those five with a real incident, you will handle most Kafka interviews.</div>`,
      },

      // ──── 1. FUNDAMENTALS ────
      {
        q: 'What is Kafka and how is it different from a traditional message queue like RabbitMQ?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Kafka is a distributed, durable, append-only <strong>log</strong>. Producers append events to a topic, the events stay there for a retention period whether anyone has read them or not, and each consumer group tracks its own position (offset). That is the key difference from a classic queue like RabbitMQ, where a message is pushed to a consumer and removed once acknowledged. Because Kafka keeps the data, many independent consumers can read the same stream, a new service can replay history, and throughput is very high. RabbitMQ is stronger at flexible routing, per-message acknowledgement, priorities and low-latency task queues. Rule of thumb: event streaming, replay and fan-out to many consumers → Kafka; work queues with complex routing → RabbitMQ.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Kafka về bản chất là một <strong>log</strong> phân tán, chỉ ghi nối thêm vào cuối. Producer ghi event vào topic, và event nằm đó cho tới hết thời gian retention, dù đã có ai đọc hay chưa. Mỗi consumer group tự nhớ mình đã đọc tới đâu bằng offset. Đây là khác biệt lớn nhất so với queue kiểu RabbitMQ: bên đó message được đẩy tới consumer, ack xong là bị xóa. Vì Kafka giữ lại dữ liệu nên nhiều consumer có thể cùng đọc một luồng, service mới vào sau vẫn đọc lại được lịch sử, và throughput rất cao. Ngược lại, RabbitMQ mạnh ở routing linh hoạt, ack từng message, có priority và hợp với task queue cần latency thấp. Nói gọn: cần event streaming, replay, nhiều bên cùng đọc thì chọn Kafka; cần work queue với routing phức tạp thì chọn RabbitMQ.</p></details>
<table><tr><th>Aspect</th><th>Kafka</th><th>RabbitMQ</th></tr>
<tr><td>Model</td><td>Distributed log (pull)</td><td>Message broker (push)</td></tr>
<tr><td>After consume</td><td>Message stays until retention expires</td><td>Message deleted after ack</td></tr>
<tr><td>Replay</td><td>Yes — reset offset</td><td>No (except streams plugin)</td></tr>
<tr><td>Ordering</td><td>Per partition</td><td>Per queue (single consumer)</td></tr>
<tr><td>Routing</td><td>By topic + key only</td><td>Exchanges: direct, topic, fanout, headers</td></tr>
<tr><td>Throughput</td><td>Very high (millions/sec)</td><td>High (tens of thousands/sec per queue)</td></tr>
<tr><td>Best for</td><td>Event streaming, CDC, analytics, event sourcing</td><td>Task queues, RPC, complex routing</td></tr>
</table>
<div class="key-point">Say "Kafka is a log, not a queue." Consumers don't remove messages — they move an offset. Everything else (replay, many consumer groups, high throughput) follows from that.</div>`,
      },
      {
        q: 'Explain topics, partitions, offsets and consumer groups.',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A <strong>topic</strong> is a named stream of events, for example <code>orders</code>. It is split into <strong>partitions</strong>, and each partition is an ordered, append-only log stored on a broker; partitions are how Kafka scales, because different partitions live on different brokers and are read in parallel. Every message in a partition has a sequential <strong>offset</strong>, its position in that log. A <strong>consumer group</strong> is a set of consumers sharing the work of one logical subscriber: each partition is assigned to exactly one consumer in the group, so the group reads every message once, and different groups each get the full stream independently. The partition count is therefore the maximum parallelism of a group — extra consumers beyond that sit idle.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Topic</strong> là một luồng event có tên, ví dụ <code>orders</code>. Mỗi topic chia thành nhiều <strong>partition</strong>, mỗi partition là một log có thứ tự nằm trên một broker. Kafka scale được chính là nhờ partition: các partition nằm rải trên nhiều broker và được đọc song song. Mỗi message trong partition có một <strong>offset</strong> tăng dần, hiểu đơn giản là số thứ tự của nó trong log. <strong>Consumer group</strong> là một nhóm consumer cùng chia nhau đọc: mỗi partition chỉ giao cho đúng một consumer trong group, nên cả group đọc mỗi message đúng một lần. Còn các group khác nhau thì độc lập, group nào cũng nhận đủ toàn bộ dữ liệu. Vì vậy số partition chính là mức song song tối đa của một group — thêm consumer nhiều hơn số partition thì phần dư chỉ ngồi chơi.</p></details>
<pre>Topic "orders" (3 partitions)

P0: [0][1][2][3][4][5]  →
P1: [0][1][2][3]        →
P2: [0][1][2][3][4]     →

Group "billing"  (2 consumers)      Group "analytics" (3 consumers)
  C1 ← P0, P1                         C1 ← P0
  C2 ← P2                             C2 ← P1
                                      C3 ← P2
Each group has its OWN committed offsets → both read everything.</pre>
<ul>
<li><strong>Offsets are per (group, topic, partition)</strong> and are stored in the internal topic <code>__consumer_offsets</code>.</li>
<li><strong>Key → partition</strong>: the default partitioner hashes the key (murmur2) modulo the partition count, so the same key always lands in the same partition.</li>
<li>A 4th consumer in a 3-partition group gets <strong>no partitions</strong>.</li>
</ul>
<div class="key-point">Partition = unit of ordering, storage and parallelism. Consumer group = unit of "read once". Offset = each group's bookmark.</div>`,
      },
      {
        q: 'How does Kafka guarantee message ordering, and how can ordering be broken?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Kafka only guarantees order <strong>within a partition</strong>, never across a whole topic. To keep events for one entity in order, you give them the same key — an order ID or account ID — so they always land in the same partition, while different entities are processed in parallel. Ordering is then broken in three common ways: the producer retries a failed batch while a later batch already succeeded (fixed by the idempotent producer, which is the default since Kafka 3.0), the partition count is increased so keys get remapped to different partitions, or the consumer hands messages from one partition to a thread pool and processes them out of order. If you truly need global order you need a single partition, which caps throughput, so it is almost always better to ask what scope of ordering the business actually needs.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Kafka chỉ đảm bảo thứ tự <strong>trong một partition</strong>, không bao giờ đảm bảo trên cả topic. Muốn các event của cùng một đối tượng đi đúng thứ tự thì gửi chúng với cùng một key, ví dụ order ID hay account ID. Cùng key thì luôn vào cùng partition, còn các key khác nhau vẫn chạy song song bình thường. Thực tế thứ tự hay bị phá theo ba kiểu. Một là producer retry một batch lỗi trong khi batch sau đã ghi xong — cái này idempotent producer xử lý được, và từ Kafka 3.0 nó bật sẵn. Hai là tăng số partition, làm key bị map sang partition khác. Ba là consumer lấy message của một partition rồi ném vào thread pool xử lý lung tung. Nếu thật sự cần thứ tự toàn cục thì chỉ có cách dùng một partition, và throughput sẽ bị chặn trần. Nên câu hỏi đúng là: nghiệp vụ cần thứ tự trong phạm vi nào — thường là theo từng entity là đủ.</p></details>
<pre>// Same key → same partition → ordered
kafkaTemplate.send("orders", order.getId(), event);

// Producer settings that protect ordering on retry
enable.idempotence = true                     // default since Kafka 3.0
max.in.flight.requests.per.connection = 5     // ≤ 5 is safe with idempotence
retries = Integer.MAX_VALUE
acks = all                                    // required by idempotence</pre>
<p><strong>Consumer-side parallelism without losing order</strong>: parallelise <em>by key</em>, not round-robin — e.g. hash the key into N single-threaded workers, or use Confluent's Parallel Consumer with key-ordering mode.</p>
<div class="key-point">Order is per partition, so order is per key. Protect it on the producer with idempotence, never change partition count casually on keyed topics, and don't fan one partition out to a random thread pool.</div>`,
      },

      // ──── 2. DURABILITY & DELIVERY ────
      {
        q: 'How does Kafka replication work, and how do you configure it so no acknowledged message is lost?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Each partition has one <strong>leader</strong> replica that handles reads and writes and several <strong>follower</strong> replicas that copy it; the followers that are caught up form the <strong>ISR</strong>, the in-sync replica set. The producer setting <code>acks</code> decides when a write counts as successful: <code>acks=all</code> waits until every replica in the ISR has it. On its own that is not enough, because the ISR can shrink to just the leader, so you pair it with <code>min.insync.replicas=2</code> and a replication factor of 3 — the write is rejected unless at least two copies exist, and you can lose one broker without losing data or availability. You also keep <code>unclean.leader.election.enable=false</code> so an out-of-date replica can never become leader. Finally, durability is end to end: the consumer must commit offsets only after it has actually processed the message.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mỗi partition có một replica <strong>leader</strong> nhận đọc ghi, và vài replica <strong>follower</strong> copy dữ liệu từ leader. Những follower đang theo kịp leader gọi là <strong>ISR</strong> (in-sync replicas). Setting <code>acks</code> phía producer quyết định khi nào một lần ghi được coi là thành công: <code>acks=all</code> nghĩa là chờ tất cả replica trong ISR ghi xong. Nhưng chỉ vậy thì chưa đủ, vì ISR có thể co lại chỉ còn mỗi leader — lúc đó <code>acks=all</code> chẳng khác gì <code>acks=1</code>. Nên phải đi kèm <code>min.insync.replicas=2</code> và replication factor 3: không đủ hai bản thì Kafka từ chối ghi, và mất một broker vẫn không mất dữ liệu. Ngoài ra để <code>unclean.leader.election.enable=false</code> để replica bị tụt lại không bao giờ được lên làm leader. Cuối cùng, không mất dữ liệu là chuyện của cả hệ thống: consumer cũng phải xử lý xong rồi mới commit offset.</p></details>
<pre>Partition P0, replication.factor = 3
  Broker 1: LEADER    [0..120]   ← producer writes here
  Broker 2: follower  [0..120]   ✔ in ISR
  Broker 3: follower  [0..95]    ✘ lagging → removed from ISR

acks=all + min.insync.replicas=2:
  ISR = {B1, B2}      → write OK (2 copies)
  ISR = {B1}          → NotEnoughReplicasException (refuse rather than risk loss)</pre>
<table><tr><th>acks</th><th>Meaning</th><th>Risk</th></tr>
<tr><td>0</td><td>Fire and forget</td><td>Loses data silently</td></tr>
<tr><td>1</td><td>Leader wrote it</td><td>Lost if leader dies before followers copy</td></tr>
<tr><td>all</td><td>All ISR replicas wrote it</td><td>Safe only with min.insync.replicas ≥ 2</td></tr>
</table>
<p><strong>No-data-loss checklist</strong>: RF=3, <code>min.insync.replicas=2</code>, <code>acks=all</code>, idempotent producer, <code>unclean.leader.election.enable=false</code>, handle send callbacks/futures (don't ignore failures), and commit consumer offsets after processing.</p>
<div class="key-point">"acks=all" alone is a trap — with an ISR of one it's no safer than acks=1. The real guarantee is acks=all + min.insync.replicas=2 + RF=3.</div>`,
      },
      {
        q: 'Explain at-most-once, at-least-once and exactly-once delivery. How does Kafka achieve exactly-once?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The semantics come down to when the consumer commits its offset relative to processing. Commit before processing and a crash loses the message — <strong>at-most-once</strong>. Commit after processing and a crash re-delivers it — <strong>at-least-once</strong>, which is the normal default and means consumers must be idempotent. Kafka's <strong>exactly-once</strong> has two parts: the idempotent producer, which uses a producer ID and sequence numbers so broker-side retries never create duplicates, and transactions, which atomically write output messages and the consumer offsets together, with downstream consumers reading in <code>read_committed</code> mode. The important caveat is that this only covers Kafka-to-Kafka pipelines. The moment you write to a database or call an external API, you are back to at-least-once and need an idempotent consumer — a dedupe table, an upsert, or a unique business key.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Ba kiểu này thật ra chỉ khác nhau ở chỗ consumer commit offset trước hay sau khi xử lý. Commit trước rồi mới xử lý, giữa chừng crash là mất message — đó là <strong>at-most-once</strong>. Xử lý xong mới commit, crash trước khi commit thì message được gửi lại — đó là <strong>at-least-once</strong>, cách phổ biến nhất, và nó bắt buộc consumer phải idempotent. <strong>Exactly-once</strong> của Kafka gồm hai mảnh: idempotent producer dùng producer ID và sequence number để retry không sinh bản trùng; và transaction, cho phép ghi message đầu ra cùng với offset của consumer trong một lần commit nguyên tử, phía sau đọc ở chế độ <code>read_committed</code>. Có một điểm phải nói rõ: exactly-once này chỉ đúng khi đi từ Kafka sang Kafka. Chỉ cần ghi vào database hay gọi API bên ngoài là bạn quay lại at-least-once, và phải tự chống trùng — bảng lưu event đã xử lý, upsert, hoặc unique key nghiệp vụ.</p></details>
<pre>at-most-once:   poll → commit → process   (crash after commit = lost)
at-least-once:  poll → process → commit   (crash before commit = duplicate)
exactly-once:   poll → process → [produce output + send offsets] in ONE transaction

// Kafka-to-Kafka EOS (read-process-write)
producer.initTransactions();
while (true) {
  ConsumerRecords&lt;K,V&gt; records = consumer.poll(Duration.ofMillis(500));
  producer.beginTransaction();
  for (var r : records) producer.send(transform(r));
  producer.sendOffsetsToTransaction(offsets(records), consumer.groupMetadata());
  producer.commitTransaction();     // outputs + offsets commit atomically
}
// downstream: isolation.level=read_committed</pre>
<p><strong>Idempotent consumer for side effects outside Kafka:</strong></p>
<pre>@Transactional
public void handle(PaymentEvent e) {
  if (processedRepo.existsById(e.eventId())) return;   // already done
  ledger.apply(e);
  processedRepo.save(new Processed(e.eventId()));      // same DB tx
}</pre>
<div class="key-point">In an interview, say: "We design for at-least-once and make consumers idempotent." Exactly-once is real, but only inside Kafka — side effects to DBs or HTTP need dedupe.</div>`,
      },
      {
        q: 'Auto-commit vs manual commit of consumer offsets — what can go wrong?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>With <code>enable.auto.commit=true</code> the client commits the offsets returned by the last <code>poll()</code> every five seconds by default, independently of whether your code finished processing them. If you process asynchronously and the app crashes, offsets may already be committed for messages that were never handled, so they are lost; and if it crashes before the next auto-commit, the last few seconds are re-processed. Manual commit lets you commit only after processing succeeds. <code>commitSync</code> is safe but blocks, <code>commitAsync</code> is fast but does not retry, so the usual pattern is async commits in the loop and a final sync commit on shutdown or partition revoke. In Spring Kafka the default ack mode <code>BATCH</code> already commits after the listener returns, which is usually what you want.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Khi bật <code>enable.auto.commit=true</code>, client cứ khoảng năm giây lại tự commit offset của lần <code>poll()</code> gần nhất, không cần biết code của bạn đã xử lý xong chưa. Nếu bạn xử lý bất đồng bộ mà app crash, có thể offset đã được commit cho những message chưa hề xử lý — thế là mất. Còn nếu crash trước lần auto-commit tiếp theo thì vài giây cuối sẽ bị xử lý lại. Commit thủ công cho phép bạn chỉ commit khi đã xử lý thành công. <code>commitSync</code> an toàn nhưng block, <code>commitAsync</code> nhanh nhưng không tự retry. Nên cách hay dùng là commit async trong vòng lặp, rồi commit sync một lần cuối khi shutdown hoặc khi bị thu hồi partition. Với Spring Kafka thì ack mode mặc định <code>BATCH</code> đã commit sau khi listener chạy xong, thường vậy là đủ.</p></details>
<pre>props.put("enable.auto.commit", "false");
try {
  while (running) {
    var records = consumer.poll(Duration.ofMillis(500));
    process(records);              // synchronous, finishes before commit
    consumer.commitAsync();        // fast path
  }
} finally {
  consumer.commitSync();           // last offsets must not be lost
  consumer.close();
}</pre>
<ul>
<li><strong>Committed offset = next offset to read</strong> (last processed + 1). Spring and the client handle this, but hand-rolled commits often get it off by one.</li>
<li><strong>auto.offset.reset</strong> (<code>earliest</code> / <code>latest</code>) only applies when the group has no committed offset — a new group on <code>latest</code> silently skips existing data.</li>
<li>Spring Kafka <code>AckMode.MANUAL_IMMEDIATE</code> + <code>Acknowledgment.acknowledge()</code> gives per-record control.</li>
</ul>
<div class="key-point">Commit after processing, never before. Auto-commit is only safe when processing is synchronous inside the poll loop.</div>`,
      },
      {
        q: 'What is a consumer group rebalance, why is it painful, and how do you reduce it?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>A rebalance is the group coordinator reassigning partitions among consumers. It happens when a consumer joins, leaves, crashes, misses heartbeats past <code>session.timeout.ms</code>, or takes longer than <code>max.poll.interval.ms</code> between polls, and when partitions are added. With the classic eager protocol every consumer stops and gives up all its partitions, so the whole group pauses, and uncommitted work is re-processed. The most common production cause is slow processing: a batch takes longer than the poll interval, the consumer is kicked out, its work is redone, and it loops. You reduce rebalances by using the <strong>cooperative-sticky</strong> assignor so only moved partitions pause, <strong>static membership</strong> (<code>group.instance.id</code>) so rolling restarts don't trigger a rebalance, smaller <code>max.poll.records</code> or a longer poll interval for slow handlers, and committing offsets in the revoke callback.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Rebalance là lúc group coordinator chia lại partition cho các consumer. Nó xảy ra khi có consumer vào, ra, crash, mất heartbeat quá <code>session.timeout.ms</code>, hoặc giữa hai lần poll lâu hơn <code>max.poll.interval.ms</code>; thêm partition cũng gây rebalance. Với giao thức eager kiểu cũ, mọi consumer phải dừng và trả hết partition, nên cả group đứng hình, những gì chưa commit sẽ bị làm lại. Nguyên nhân hay gặp nhất trên production là xử lý chậm: một batch chạy lâu hơn poll interval, consumer bị đá ra, việc bị làm lại, rồi cứ thế lặp vòng. Cách giảm: dùng <strong>cooperative-sticky</strong> assignor để chỉ partition nào bị chuyển mới phải dừng; dùng <strong>static membership</strong> (<code>group.instance.id</code>) để rolling restart không kích hoạt rebalance; giảm <code>max.poll.records</code> hoặc tăng poll interval nếu handler chậm; và commit offset ngay khi partition bị thu hồi.</p></details>
<pre>The classic "rebalance storm":
  poll() returns 500 records
  each takes 1s to process        → 500s
  max.poll.interval.ms = 300000   → 300s
  → consumer evicted at 300s, partitions move, work redone, repeat ♻️

Fixes:
  max.poll.records             = 50
  max.poll.interval.ms         = 600000
  partition.assignment.strategy = CooperativeStickyAssignor
  group.instance.id            = &lt;pod-name&gt;      # static membership
  session.timeout.ms           = 45000</pre>
<p><strong>Interviewer follow-up:</strong> "Heartbeats are sent by a background thread, so why does slow processing still evict the consumer?" — Heartbeats prove the process is alive (<code>session.timeout.ms</code>); <code>max.poll.interval.ms</code> separately proves the poll loop is making progress. A stuck handler passes the first check and fails the second.</p>
<div class="key-point">Most rebalance problems are really "processing is slower than max.poll.interval.ms". Fix the batch size first, then adopt cooperative-sticky and static membership.</div>`,
      },
      {
        q: 'How do you handle a poison message, retries and dead-letter topics in Kafka?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A poison message is one that always fails — bad format, a missing reference, a bug. Because Kafka is ordered per partition, a consumer that keeps retrying it blocks everything behind it. The standard approach separates two kinds of failure. Transient failures, like a database timeout, get a few in-place retries with backoff. Permanent failures, like a deserialization error or validation failure, should not be retried at all and go straight to a <strong>dead-letter topic</strong> along with headers describing the error, so the partition keeps moving and someone can inspect and replay them later. For longer retries without blocking you can use separate retry topics with increasing delays, accepting that this gives up strict ordering for that key. In Spring Kafka this is <code>DefaultErrorHandler</code> with a <code>DeadLetterPublishingRecoverer</code>, or <code>@RetryableTopic</code> for non-blocking retries.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Poison message là message xử lý lần nào cũng lỗi — sai format, thiếu dữ liệu liên quan, hoặc dính bug. Vì Kafka giữ thứ tự theo partition, nếu consumer cứ retry mãi message đó thì mọi message phía sau đều bị kẹt. Cách làm chuẩn là tách hai loại lỗi. Lỗi tạm thời như database timeout thì retry tại chỗ vài lần, có backoff. Lỗi vĩnh viễn như deserialize hỏng hay dữ liệu không hợp lệ thì đừng retry, đẩy thẳng sang <strong>dead-letter topic</strong> kèm header mô tả lỗi, để partition tiếp tục chạy và người vận hành xem lại hoặc replay sau. Nếu cần retry lâu hơn mà không chặn luồng chính thì dùng các retry topic với độ trễ tăng dần, chấp nhận mất thứ tự chặt cho key đó. Trong Spring Kafka thì dùng <code>DefaultErrorHandler</code> với <code>DeadLetterPublishingRecoverer</code>, hoặc <code>@RetryableTopic</code> cho retry không chặn.</p></details>
<pre>@Bean
DefaultErrorHandler errorHandler(KafkaTemplate&lt;Object, Object&gt; template) {
  var recoverer = new DeadLetterPublishingRecoverer(template);   // → orders.DLT
  var handler = new DefaultErrorHandler(recoverer,
      new ExponentialBackOff(1_000L, 2.0) {{ setMaxElapsedTime(30_000L); }});
  handler.addNotRetryableExceptions(
      DeserializationException.class, ValidationException.class);
  return handler;
}

// Non-blocking retries: orders → orders-retry-0 → orders-retry-1 → orders-dlt
@RetryableTopic(attempts = "4", backoff = @Backoff(delay = 1000, multiplier = 4))
@KafkaListener(topics = "orders")
void onOrder(OrderEvent e) { ... }</pre>
<ul>
<li>Use <code>ErrorHandlingDeserializer</code> — otherwise a bad payload throws inside <code>poll()</code> and the consumer loops forever on the same offset.</li>
<li>Monitor and alert on DLT size; a DLT nobody looks at is just slow data loss.</li>
</ul>
<div class="key-point">Retry transient errors with backoff, send permanent errors straight to a DLT, and never let one bad record stall a partition.</div>`,
      },
      {
        q: 'What is consumer lag, what causes it, and how do you scale consumers?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Consumer lag is the difference between the latest offset in a partition and the group's committed offset — how far behind the consumer is. Growing lag means the consumers process more slowly than producers write, typically because of slow downstream calls, a hot partition receiving most of the traffic, frequent rebalances, or simply too few consumers. You scale by adding consumers up to the number of partitions; beyond that you must add partitions or make each consumer faster through batching database writes, async I/O, or key-ordered parallel processing inside the consumer. Lag should be monitored per partition, because a single hot partition can hide behind a healthy average.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Consumer lag là khoảng cách giữa offset mới nhất của partition và offset mà group đã commit — nói cách khác là consumer đang chậm hơn producer bao xa. Lag tăng dần nghĩa là consumer xử lý không kịp tốc độ ghi. Lý do thường gặp: gọi xuống hệ thống phía sau chậm, có một partition "nóng" hứng phần lớn traffic, rebalance liên tục, hoặc đơn giản là thiếu consumer. Muốn scale thì thêm consumer, nhưng tối đa chỉ bằng số partition; vượt quá thì phải tăng partition, hoặc làm từng consumer nhanh hơn — ghi database theo batch, dùng I/O bất đồng bộ, hoặc xử lý song song nhưng vẫn giữ thứ tự theo key. Nhớ theo dõi lag theo từng partition, vì một partition bị kẹt có thể bị che mất sau con số tổng trông vẫn ổn.</p></details>
<pre>lag(partition) = log-end-offset − committed-offset

$ kafka-consumer-groups.sh --bootstrap-server kafka:9092 --describe --group billing
TOPIC   PARTITION  CURRENT-OFFSET  LOG-END-OFFSET  LAG
orders  0          10230           10235           5
orders  1          9988            9990            2
orders  2          4100            58210           54110   ← hot partition / stuck consumer</pre>
<ul>
<li><strong>Hot partition</strong>: a skewed key (one huge tenant) — fix with a better key or key salting (<code>tenantId + "-" + (hash % 4)</code>), accepting weaker ordering.</li>
<li><strong>Autoscaling</strong>: scale on lag (KEDA Kafka scaler), not CPU — an I/O-bound consumer can lag at 10% CPU.</li>
<li><strong>Tools</strong>: Burrow, Kafka exporter + Prometheus, Confluent Control Center.</li>
</ul>
<div class="key-point">Partitions cap consumer parallelism. Alert on lag per partition and on lag trend, not just the total.</div>`,
      },

      // ──── 3. DESIGN & OPERATIONS ────
      {
        q: 'How many partitions should a topic have, and can you change it later?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Size partitions from the target throughput and the parallelism you will need: divide the peak write rate by what one partition can handle, and divide the peak consume rate by what one consumer can process, then take the larger number with some headroom for growth. You can increase the partition count later but never decrease it, and increasing it changes the key-to-partition mapping, so on a keyed topic new events for an existing key may land in a different partition than old ones and per-key ordering breaks during the transition. Too many partitions also has costs: more open files, longer leader elections and recovery, more memory on clients, and slower rebalances. That's why people pick a sensible number up front — often 6 to 30 for a typical service topic — rather than defaulting to one or to hundreds.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Số partition nên tính từ throughput mục tiêu và mức song song cần có: lấy tốc độ ghi đỉnh chia cho sức của một partition, lấy tốc độ đọc đỉnh chia cho sức xử lý của một consumer, chọn số lớn hơn rồi cộng thêm phần dư để sau này tăng trưởng. Partition tăng được nhưng không giảm được. Và tăng cũng có giá: ánh xạ key sang partition thay đổi, nên với topic có key, event mới của một key cũ có thể rơi vào partition khác, thứ tự theo key bị vỡ trong lúc chuyển. Quá nhiều partition cũng không tốt: nhiều file mở hơn, bầu leader và recovery lâu hơn, client tốn RAM hơn, rebalance chậm hơn. Vì vậy nên chọn một con số hợp lý ngay từ đầu — với topic của một service bình thường thường khoảng 6 đến 30 — thay vì để mặc định 1 hay nhảy lên hàng trăm.</p></details>
<pre>partitions ≥ max( peakProduceMBps / perPartitionProduceMBps,
                  peakConsumeMsgs / perConsumerMsgs )  × headroom

Example: 50 MB/s in, ~10 MB/s per partition    → 5
         20k msg/s, one consumer does 1.5k/s   → 14
         ×1.5 growth headroom                  → ~21  → choose 24</pre>
<p><strong>If you must re-partition a keyed topic safely</strong>: create a new topic with the right count, dual-write or mirror into it, drain consumers on the old topic, then switch consumers over — rather than altering the partition count in place.</p>
<div class="key-point">Partitions can only go up, and going up reshuffles keys. Plan the count from throughput and consumer parallelism on day one.</div>`,
      },
      {
        q: 'What is the difference between retention and log compaction?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Both decide how long data stays in a topic, but on different bases. Time or size <strong>retention</strong> (<code>cleanup.policy=delete</code>) deletes whole old segments once they pass <code>retention.ms</code> or <code>retention.bytes</code>, regardless of content — right for event streams like clicks or orders where history only matters for a while. <strong>Log compaction</strong> (<code>cleanup.policy=compact</code>) keeps at least the latest value for every key and removes older values for the same key, so the topic becomes a durable, replayable snapshot of current state. A message with a key and a null value is a tombstone that eventually deletes the key. Compaction is what Kafka uses for <code>__consumer_offsets</code>, and it is the right choice for changelog topics, CDC tables and configuration that a new service needs to rebuild its state.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Cả hai đều quyết định dữ liệu ở lại topic bao lâu, nhưng theo tiêu chí khác nhau. <strong>Retention</strong> (<code>cleanup.policy=delete</code>) xóa nguyên các segment cũ khi quá <code>retention.ms</code> hoặc <code>retention.bytes</code>, không quan tâm bên trong có gì. Cách này hợp với luồng event như click hay đơn hàng, nơi lịch sử chỉ cần giữ một thời gian. <strong>Log compaction</strong> (<code>cleanup.policy=compact</code>) thì giữ lại ít nhất giá trị mới nhất của mỗi key và dọn các giá trị cũ của cùng key đó. Kết quả là topic trở thành một bản snapshot trạng thái hiện tại, lưu bền và đọc lại được. Message có key mà value là null gọi là tombstone, dùng để xóa hẳn key đó. Chính Kafka cũng dùng compaction cho <code>__consumer_offsets</code>; nó hợp với changelog topic, dữ liệu CDC, hoặc config mà service mới cần để dựng lại state.</p></details>
<pre>Before compaction:          After compaction:
offset key  value           offset key  value
0      u1   {name:A}        3      u2   {name:C}
1      u2   {name:B}        4      u1   {name:D}
2      u1   {name:A2}       5      u3   null   (tombstone, removed later)
3      u2   {name:C}
4      u1   {name:D}
5      u3   null</pre>
<ul>
<li>Offsets are preserved — compaction leaves gaps, it never renumbers.</li>
<li>The active segment is never compacted; <code>min.cleanable.dirty.ratio</code> and <code>segment.ms</code> control how soon cleaning happens.</li>
<li><code>cleanup.policy=compact,delete</code> combines both: latest per key, but nothing older than the retention window.</li>
</ul>
<div class="key-point">delete = "keep the last N days of events"; compact = "keep the latest value per key forever". Choose by whether consumers need history or current state.</div>`,
      },
      {
        q: 'How do you publish to Kafka reliably when you also write to a database (the dual-write problem)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Writing to the database and then sending to Kafka are two separate systems with no shared transaction, so one can succeed while the other fails: the order is saved but the event is never sent, or the event is sent and then the database rolls back. The <code>@Transactional</code> annotation does not fix this, because it only covers the database. The standard solution is the <strong>transactional outbox</strong>: in the same database transaction as the business change, insert the event into an <code>outbox</code> table, then a separate relay publishes outbox rows to Kafka — either a poller or, better, Debezium reading the database's transaction log. The relay can publish a row more than once, so this gives at-least-once delivery, and consumers must deduplicate by event ID.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Ghi database rồi gửi Kafka là hai hệ thống riêng, không có transaction chung, nên có thể bên này thành công còn bên kia thất bại: đơn hàng đã lưu mà event không đi, hoặc event đã gửi rồi database lại rollback. <code>@Transactional</code> không cứu được, vì nó chỉ quản lý phần database. Cách chuẩn là <strong>transactional outbox</strong>: trong cùng transaction với thay đổi nghiệp vụ, bạn insert event vào một bảng <code>outbox</code>. Sau đó một tiến trình relay riêng đọc bảng outbox và đẩy sang Kafka — có thể là một poller, hoặc tốt hơn là Debezium đọc transaction log của database. Relay có thể gửi một dòng nhiều lần, nên đây là at-least-once, và consumer phải chống trùng theo event ID.</p></details>
<pre>// ❌ Dual write — not atomic
@Transactional
public void placeOrder(Order o) {
  orderRepo.save(o);
  kafkaTemplate.send("orders", o.getId(), new OrderCreated(o)); // may fail or run before commit
}

// ✅ Transactional outbox
@Transactional
public void placeOrder(Order o) {
  orderRepo.save(o);
  outboxRepo.save(new OutboxEvent(UUID.randomUUID(), "Order", o.getId(),
                                  "OrderCreated", toJson(o)));   // same DB tx
}
// Relay: Debezium (CDC on outbox table) → topic "orders"
//        or @Scheduled poller: select unsent → send → mark sent</pre>
<ul>
<li>Use the aggregate ID as the Kafka key so per-entity order is preserved.</li>
<li>Debezium's outbox event router SMT maps outbox rows to topics, keys and headers.</li>
<li>Alternative: "listen to yourself" — publish first, and have the service update its own DB from the event. Simpler infra, but reads can be briefly stale.</li>
</ul>
<div class="key-point">You can't make a DB commit and a Kafka send atomic. Write the event into the DB with the data (outbox), relay it asynchronously, and make consumers idempotent.</div>`,
      },
      {
        q: 'Why is Kafka so fast?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Kafka is fast because it is designed around how disks and operating systems work best. Writes are <strong>sequential appends</strong> to segment files, which even spinning disks handle at high speed, and there is no per-message index update or random seek. Kafka leans on the OS <strong>page cache</strong> instead of its own heap cache, so recently written data is usually read straight from memory and the JVM avoids huge garbage collection pressure. When sending data to consumers it uses <strong>zero-copy</strong> (<code>sendfile</code>), moving bytes from the page cache to the network socket without copying them through user space. And everything is <strong>batched and compressed</strong>: producers group messages into batches, compress the whole batch, and the broker stores and forwards it as is. Partitioning then spreads that work across many brokers.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Kafka nhanh vì nó được thiết kế đúng theo cách ổ đĩa và hệ điều hành chạy tốt nhất. Ghi dữ liệu là <strong>ghi nối tuần tự</strong> vào file segment — ngay cả ổ HDD cũng làm việc này rất nhanh — không có cập nhật index cho từng message hay seek ngẫu nhiên. Kafka dựa vào <strong>page cache</strong> của OS thay vì tự cache trên heap, nên dữ liệu mới ghi thường được đọc thẳng từ RAM, và JVM cũng không bị áp lực GC lớn. Khi gửi cho consumer, nó dùng <strong>zero-copy</strong> (<code>sendfile</code>): byte đi thẳng từ page cache ra socket, không phải copy qua user space. Thêm nữa, mọi thứ đều <strong>gom batch và nén</strong>: producer gom message thành batch, nén cả batch, broker lưu và chuyển tiếp nguyên batch đó. Cuối cùng là partition giúp chia tải ra nhiều broker.</p></details>
<ul>
<li><strong>Sequential I/O</strong> — append-only segments, sequential reads by offset.</li>
<li><strong>Page cache</strong> — tail reads hit memory; a broker restart doesn't lose a warm cache.</li>
<li><strong>Zero-copy</strong> — disk → page cache → NIC, skipping user-space copies (lost if TLS is enabled, since data must be encrypted in the JVM).</li>
<li><strong>Batching</strong> — <code>batch.size</code>, <code>linger.ms</code> trade a few ms latency for much higher throughput.</li>
<li><strong>Compression</strong> — <code>lz4</code> / <code>zstd</code> on whole batches; broker doesn't recompress if codecs match.</li>
<li><strong>Dumb broker, smart client</strong> — the broker doesn't track per-message delivery state; consumers just keep an offset.</li>
</ul>
<div class="key-point">Sequential disk writes + page cache + zero-copy + batching. Mention that TLS disables zero-copy — it shows you know the trade-offs, not just the slogan.</div>`,
      },
      {
        q: 'What is KRaft and why did Kafka remove ZooKeeper?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Older Kafka clusters used ZooKeeper, a separate system, to store cluster metadata — which brokers exist, topic configuration, partition leaders — and to elect the controller. That meant running and securing two distributed systems, and metadata changes were slow, which limited clusters to roughly a couple of hundred thousand partitions and made controller failover take a long time. <strong>KRaft</strong> (Kafka Raft) moves metadata into Kafka itself: a small quorum of controller nodes stores it in an internal replicated log using the Raft consensus protocol. The result is one system to operate, much faster controller failover, and support for millions of partitions. KRaft has been production-ready since Kafka 3.3, and Kafka 4.0 removed ZooKeeper entirely.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Kafka đời cũ dùng ZooKeeper — một hệ thống riêng — để lưu metadata của cluster: có những broker nào, config của topic, leader của từng partition, và để bầu controller. Như vậy bạn phải vận hành và bảo mật tới hai hệ phân tán. Việc cập nhật metadata cũng chậm, nên cluster bị giới hạn khoảng vài trăm nghìn partition và failover controller mất nhiều thời gian. <strong>KRaft</strong> (Kafka Raft) đưa metadata vào ngay trong Kafka: một nhóm nhỏ node controller lưu metadata trong một log nội bộ, đồng bộ với nhau bằng thuật toán Raft. Kết quả là chỉ còn một hệ thống để vận hành, failover nhanh hơn hẳn, và hỗ trợ tới hàng triệu partition. KRaft dùng được cho production từ Kafka 3.3, còn từ Kafka 4.0 thì ZooKeeper bị bỏ hẳn.</p></details>
<pre>ZooKeeper mode                     KRaft mode
┌──────────┐   ┌────────────┐      ┌───────────────────────────┐
│ ZK ensem │◀──│ controller │      │ controller quorum (Raft)  │
└──────────┘   │  (broker)  │      │  __cluster_metadata log   │
               └────────────┘      └─────────────┬─────────────┘
                 brokers…                        │ brokers fetch metadata
                                           brokers…</pre>
<div class="key-point">KRaft = metadata stored in a Raft-replicated Kafka log instead of ZooKeeper. Fewer moving parts, faster failover, far more partitions. Kafka 4.0 is KRaft-only.</div>`,
      },
    ],
  },

  // ───────────────────────── REDIS ─────────────────────────
  {
    id: 'redis',
    name: 'Redis',
    icon: '🧱',
    questions: [
      // ──── 0. REDIS SUMMARY — knowledge map ────
      {
        q: 'Redis Summary — Knowledge Map',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A complete revision checklist for Redis — data structures, caching patterns and failure modes, memory management, persistence, high availability, distributed coordination and the production pitfalls a senior backend engineer is expected to know. Concept names only; use it to spot gaps, not as a tutorial.</p></div>
<h3>1. Core Concepts</h3>
<ul>
<li><strong>Architecture</strong>
  <ul>
  <li>In-memory key-value store, single-threaded command execution</li>
  <li>Event loop, I/O threads (Redis 6+), RESP protocol</li>
  <li>Atomicity of single commands</li>
  </ul>
</li>
<li><strong>Data structures</strong>
  <ul>
  <li>String, Hash, List, Set, Sorted Set (ZSET)</li>
  <li>Bitmap, HyperLogLog, Geo, Stream</li>
  <li>Choosing the structure by access pattern</li>
  </ul>
</li>
<li><strong>Positioning</strong> — cache, session store, rate limiter, leaderboard, lock, lightweight queue; vs Memcached, vs a real database</li>
</ul>
<h3>2. Caching</h3>
<ul>
<li>Cache-aside, read-through, write-through, write-behind</li>
<li>TTL strategy, jitter, invalidation (delete vs update)</li>
<li>Cache penetration, breakdown (stampede), avalanche</li>
<li>Cache/DB consistency, delayed double delete, CDC-driven invalidation</li>
<li>Spring Cache: @Cacheable, @CacheEvict, RedisCacheManager, serialization</li>
</ul>
<h3>3. Memory &amp; Expiration</h3>
<ul>
<li>maxmemory, eviction policies (allkeys-lru, volatile-ttl, noeviction, LFU)</li>
<li>Lazy + active expiration</li>
<li>Big keys, hot keys, memory fragmentation</li>
<li>O(N) commands: KEYS, SMEMBERS, HGETALL, DEL on big keys → SCAN, UNLINK</li>
</ul>
<h3>4. Persistence &amp; High Availability</h3>
<ul>
<li>RDB snapshots vs AOF (appendfsync), hybrid persistence</li>
<li>Replication (async), replica lag</li>
<li>Sentinel (monitoring, automatic failover)</li>
<li>Cluster (16384 hash slots, MOVED/ASK, hash tags, multi-key limits)</li>
</ul>
<h3>5. Coordination &amp; Messaging</h3>
<ul>
<li>MULTI/EXEC, WATCH (optimistic locking), Lua scripts, pipelining</li>
<li>Distributed lock: SET NX PX, safe release, Redisson, Redlock debate, fencing tokens</li>
<li>Rate limiting: fixed window, sliding window, token bucket</li>
<li>Pub/Sub vs Streams (consumer groups, XACK, PEL)</li>
</ul>
<h3>6. Senior / Interview Hot Topics</h3>
<ul>
<li>Why Redis is fast despite being single-threaded</li>
<li>Penetration vs breakdown vs avalanche and their fixes</li>
<li>Keeping cache and database consistent</li>
<li>Is a Redis lock safe? (GC pauses, failover, fencing)</li>
<li>Redis vs Memcached; when Redis should NOT be your source of truth</li>
</ul>
<div class="key-point">The most asked areas are: why single-threaded Redis is fast, data-structure use cases, cache patterns with penetration/breakdown/avalanche, eviction, RDB vs AOF, Cluster hash slots, and distributed locks. Know a concrete fix for each failure mode.</div>`,
      },

      // ──── 1. FUNDAMENTALS ────
      {
        q: 'What is Redis, and why is it so fast even though it is single-threaded?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Redis is an in-memory data structure store used as a cache, session store, rate limiter, leaderboard, lock service and lightweight message broker. It is fast for a few reasons. All data lives in RAM, so a lookup is a memory access rather than a disk seek. Commands run on a single thread, so there are no locks and no context switches, and every individual command is atomic. It uses an event loop with I/O multiplexing (epoll) so one thread can serve tens of thousands of connections, and its data structures are carefully tuned, with compact encodings for small collections. Since Redis 6, network reading and writing can use extra I/O threads, but command execution is still single-threaded. The bottleneck is usually the network or memory, not CPU — and the flip side is that one slow command blocks everyone.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Redis là kho dữ liệu nằm trong RAM, hay được dùng làm cache, lưu session, rate limiter, leaderboard, distributed lock, hay message broker nhẹ. Nó nhanh vì mấy lý do. Thứ nhất, toàn bộ dữ liệu ở trong RAM nên mỗi lần đọc chỉ là truy cập bộ nhớ, không đụng tới đĩa. Thứ hai, lệnh chạy trên một thread duy nhất, nên không cần lock, không tốn chi phí context switch, và mỗi lệnh đơn lẻ đều nguyên tử. Thứ ba, nó dùng event loop với I/O multiplexing (epoll), một thread phục vụ được hàng chục nghìn kết nối. Thêm nữa các cấu trúc dữ liệu được tối ưu rất kỹ, có encoding gọn cho collection nhỏ. Từ Redis 6, phần đọc ghi mạng có thể chạy thêm I/O thread, nhưng thực thi lệnh vẫn là đơn luồng. Thực tế nút thắt thường là mạng hoặc RAM chứ không phải CPU. Mặt trái là chỉ cần một lệnh chậm thôi là mọi client khác phải chờ.</p></details>
<ul>
<li><strong>In memory</strong> — sub-millisecond latency; ~100k+ ops/sec per core.</li>
<li><strong>Single-threaded execution</strong> — no locking, commands are atomic, simple to reason about.</li>
<li><strong>I/O multiplexing</strong> — epoll/kqueue event loop.</li>
<li><strong>Efficient encodings</strong> — listpack/intset for small hashes, sets and sorted sets.</li>
<li><strong>Pipelining</strong> — clients batch many commands per round trip.</li>
</ul>
<table><tr><th></th><th>Redis</th><th>Memcached</th></tr>
<tr><td>Data types</td><td>Rich (hash, zset, stream…)</td><td>Strings only</td></tr>
<tr><td>Persistence</td><td>RDB / AOF</td><td>None</td></tr>
<tr><td>Replication / HA</td><td>Built-in, Sentinel, Cluster</td><td>None (client-side sharding)</td></tr>
<tr><td>Threads</td><td>Single execution thread</td><td>Multi-threaded</td></tr>
<tr><td>Use when</td><td>Almost always</td><td>Pure, simple, huge multi-core string cache</td></tr>
</table>
<div class="key-point">"Single-threaded" means no locks and atomic commands — a strength. The cost is that one O(N) command (KEYS *, a huge DEL) freezes every client.</div>`,
      },
      {
        q: 'What are the main Redis data structures and what would you use each for?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Choosing the right structure is most of Redis design. <strong>Strings</strong> hold values, serialized objects and counters with <code>INCR</code>. <strong>Hashes</strong> store an object's fields so you can read or update one field without rewriting the whole object. <strong>Lists</strong> are ordered and work for simple queues or recent-items feeds. <strong>Sets</strong> hold unique members, good for tags, deduplication and intersections. <strong>Sorted sets</strong> keep members ordered by a score, which makes them the go-to for leaderboards, priority queues, time-ordered indexes and sliding-window rate limiting. Beyond those, <strong>Bitmaps</strong> track per-user flags like daily active users cheaply, <strong>HyperLogLog</strong> estimates unique counts in about 12 KB, <strong>Geo</strong> answers nearby-search queries, and <strong>Streams</strong> are an append-only log with consumer groups for durable messaging.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Thiết kế với Redis phần lớn là chọn đúng cấu trúc dữ liệu. <strong>String</strong> dùng để lưu giá trị, object đã serialize, hoặc làm counter với <code>INCR</code>. <strong>Hash</strong> lưu các field của một object, đọc hay sửa một field mà không cần ghi lại cả object. <strong>List</strong> có thứ tự, dùng cho queue đơn giản hoặc danh sách "mới nhất". <strong>Set</strong> chứa phần tử không trùng, hợp cho tag, chống trùng, hay tìm phần chung giữa hai tập. <strong>Sorted set</strong> sắp phần tử theo score, nên là lựa chọn số một cho leaderboard, priority queue, index theo thời gian và rate limit kiểu sliding window. Ngoài ra còn có <strong>Bitmap</strong> để đánh dấu theo từng user rất rẻ, ví dụ đếm daily active user; <strong>HyperLogLog</strong> đếm gần đúng số phần tử khác nhau chỉ với khoảng 12 KB; <strong>Geo</strong> để tìm điểm gần nhất; và <strong>Stream</strong> là log ghi nối thêm có consumer group, dùng cho messaging cần lưu bền.</p></details>
<table><tr><th>Type</th><th>Key commands</th><th>Typical use</th></tr>
<tr><td>String</td><td>GET, SET EX, INCR, SETNX</td><td>Cache value, counter, lock, session</td></tr>
<tr><td>Hash</td><td>HSET, HGET, HINCRBY</td><td>User profile, shopping cart</td></tr>
<tr><td>List</td><td>LPUSH, RPOP, BLPOP, LRANGE</td><td>Simple queue, latest-N feed</td></tr>
<tr><td>Set</td><td>SADD, SISMEMBER, SINTER</td><td>Tags, unique visitors, mutual friends</td></tr>
<tr><td>Sorted Set</td><td>ZADD, ZRANGE, ZREVRANK, ZRANGEBYSCORE</td><td>Leaderboard, delayed jobs, sliding window</td></tr>
<tr><td>Bitmap</td><td>SETBIT, BITCOUNT</td><td>Daily active users, feature flags per user</td></tr>
<tr><td>HyperLogLog</td><td>PFADD, PFCOUNT</td><td>Approximate unique counts (0.81% error)</td></tr>
<tr><td>Geo</td><td>GEOADD, GEOSEARCH</td><td>Nearby drivers / stores</td></tr>
<tr><td>Stream</td><td>XADD, XREADGROUP, XACK</td><td>Durable event queue with consumer groups</td></tr>
</table>
<pre># Leaderboard
ZADD game:scores 1500 "alice" 1720 "bob"
ZINCRBY game:scores 50 "alice"
ZREVRANGE game:scores 0 9 WITHSCORES     # top 10
ZREVRANK game:scores "alice"             # alice's rank</pre>
<div class="key-point">Pick the structure from the access pattern: need ranking → ZSET, need one field of an object → HASH, need uniqueness → SET, need approximate counts cheaply → HyperLogLog.</div>`,
      },

      // ──── 2. CACHING ────
      {
        q: 'Explain cache-aside, write-through and write-behind. Which do you use by default?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>In <strong>cache-aside</strong>, the application reads from the cache first; on a miss it loads from the database and populates the cache, and on a write it updates the database and then deletes the cache key. It is the default because it is simple, only caches data that is actually requested, and the system keeps working if the cache goes down. In <strong>write-through</strong>, every write goes to the cache and the database synchronously, which keeps the cache warm at the cost of write latency and caching data nobody reads. In <strong>write-behind</strong>, writes go to the cache and are flushed to the database asynchronously, which is very fast for write-heavy workloads such as counters, but data can be lost if the cache fails before flushing. I use cache-aside with a TTL by default and delete on write rather than update.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Với <strong>cache-aside</strong>, ứng dụng đọc cache trước; miss thì lấy từ database rồi set vào cache. Khi ghi thì cập nhật database rồi xóa key trong cache. Đây là cách mặc định vì đơn giản, chỉ cache những gì thật sự được đọc, và cache có chết thì hệ thống vẫn chạy. Với <strong>write-through</strong>, mỗi lần ghi đều ghi cả cache lẫn database cùng lúc, nên cache luôn nóng, nhưng ghi chậm hơn và cache cả những dữ liệu chẳng ai đọc. Với <strong>write-behind</strong>, ghi vào cache trước rồi mới đẩy xuống database bất đồng bộ — rất nhanh cho những chỗ ghi nhiều như counter, nhưng cache chết trước khi kịp đẩy là mất dữ liệu. Mặc định tôi dùng cache-aside có TTL, và khi ghi thì xóa key chứ không update key.</p></details>
<pre>// Cache-aside read
public Product get(long id) {
  String key = "product:" + id;
  Product p = redis.get(key);
  if (p != null) return p;                      // hit
  p = repo.findById(id).orElseThrow();          // miss → DB
  redis.set(key, p, Duration.ofMinutes(10).plusSeconds(rnd(60)));  // TTL + jitter
  return p;
}

// Cache-aside write: update DB, then DELETE the key
@Transactional
public void update(Product p) {
  repo.save(p);
  afterCommit(() -> redis.delete("product:" + p.getId()));
}</pre>
<table><tr><th>Pattern</th><th>Consistency</th><th>Write latency</th><th>Risk</th></tr>
<tr><td>Cache-aside</td><td>Eventual (TTL-bounded)</td><td>Normal</td><td>Stale window, stampede on miss</td></tr>
<tr><td>Write-through</td><td>Strong-ish</td><td>Higher</td><td>Caches cold data</td></tr>
<tr><td>Write-behind</td><td>Eventual</td><td>Lowest</td><td>Data loss on cache failure</td></tr>
</table>
<div class="key-point">Default: cache-aside + TTL with jitter + delete-on-write after the DB commit. Deleting is safer than updating because two concurrent updates can write the cache in the wrong order.</div>`,
      },
      {
        q: 'What are cache penetration, cache breakdown and cache avalanche, and how do you prevent each?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>These are three ways a cache stops protecting the database. <strong>Penetration</strong> is requests for keys that don't exist anywhere, such as random IDs from a bot: they always miss the cache and always hit the database. You fix it by caching the empty result with a short TTL, validating input, or putting a Bloom filter of valid IDs in front. <strong>Breakdown</strong>, also called a stampede, is when one very hot key expires and thousands of concurrent requests all miss at the same moment and all rebuild it. You fix it by letting only one request rebuild — a mutex or single-flight — while others wait or get the stale value, or by refreshing hot keys before they expire. <strong>Avalanche</strong> is many keys expiring at once, or the whole cache going down, so the full load lands on the database. You fix it by adding random jitter to TTLs, running Redis with high availability, and protecting the database with rate limiting and circuit breakers.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Đây là ba tình huống cache không còn che chắn được cho database. <strong>Cache penetration</strong> là request hỏi những key không hề tồn tại, ví dụ bot gửi ID ngẫu nhiên: lần nào cũng miss cache và đập thẳng xuống database. Cách chữa là cache luôn kết quả rỗng với TTL ngắn, validate input, hoặc đặt một Bloom filter chứa các ID hợp lệ ở phía trước. <strong>Cache breakdown</strong> (hay stampede) là khi một key cực hot hết hạn, hàng nghìn request cùng miss một lúc và cùng chạy đi build lại nó. Cách chữa là chỉ cho một request build lại — dùng mutex hoặc single-flight — các request khác chờ hoặc dùng tạm giá trị cũ; hoặc refresh key hot trước khi nó hết hạn. <strong>Cache avalanche</strong> là khi rất nhiều key hết hạn cùng lúc, hoặc cả cụm Redis chết, toàn bộ tải dồn xuống database. Cách chữa là cộng thêm jitter ngẫu nhiên vào TTL, chạy Redis có high availability, và bảo vệ database bằng rate limit với circuit breaker.</p></details>
<table><tr><th>Problem</th><th>Trigger</th><th>Fixes</th></tr>
<tr><td>Penetration</td><td>Keys that don't exist</td><td>Cache null with short TTL, Bloom filter, input validation, rate-limit callers</td></tr>
<tr><td>Breakdown</td><td>One hot key expires</td><td>Mutex / single-flight rebuild, logical expiry + async refresh, no TTL on very hot keys</td></tr>
<tr><td>Avalanche</td><td>Many keys expire together / Redis down</td><td>TTL jitter, Sentinel/Cluster HA, local L1 cache, DB rate limit + circuit breaker, pre-warming</td></tr>
</table>
<pre>// Breakdown: only one caller rebuilds the hot key
Product getHot(long id) {
  String key = "product:" + id;
  Product p = redis.get(key);
  if (p != null) return p;
  String lock = "lock:" + key;
  if (redis.setIfAbsent(lock, "1", Duration.ofSeconds(5))) {   // SET NX EX
    try {
      p = repo.findById(id).orElse(null);
      redis.set(key, p == null ? NULL_MARKER : p,              // also covers penetration
                p == null ? Duration.ofSeconds(30) : Duration.ofMinutes(10));
      return p;
    } finally { redis.delete(lock); }
  }
  sleep(50);                       // others back off and retry the cache
  return getHot(id);
}</pre>
<div class="key-point">Penetration = key doesn't exist (null cache / Bloom filter). Breakdown = one hot key expires (single-flight rebuild). Avalanche = many keys or the whole cache fail together (TTL jitter + HA + DB protection).</div>`,
      },
      {
        q: 'How do you keep the cache consistent with the database?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>You can't make a cache and a database perfectly consistent without distributed transactions, so the goal is to keep the stale window small and bounded. The standard approach is: update the database first, then <strong>delete</strong> the cache key, after the transaction commits. Deleting instead of updating avoids the race where two concurrent writers set the cache in the wrong order. There is still a rare race: a reader misses, reads the old value from the database, a writer commits and deletes the key, then the reader writes its old value into the cache. A TTL bounds how long that lasts, a <strong>delayed double delete</strong> narrows it further, and the most robust option is to drive invalidation from the database's change log with Debezium or similar, so every committed change reliably evicts the cache. For data that must never be stale, like balances, don't serve it from the cache.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Không có distributed transaction thì không thể giữ cache và database nhất quán tuyệt đối, nên mục tiêu thực tế là làm cho khoảng thời gian dữ liệu cũ thật ngắn và có giới hạn. Cách chuẩn là: cập nhật database trước, rồi <strong>xóa</strong> key trong cache sau khi transaction commit. Xóa chứ không update, vì hai request ghi cùng lúc có thể set cache sai thứ tự. Dù vậy vẫn còn một race hiếm gặp: request đọc bị miss, đọc giá trị cũ từ database; đúng lúc đó request ghi commit và xóa key; rồi request đọc kia lại set giá trị cũ vào cache. TTL giới hạn thời gian sai này, <strong>delayed double delete</strong> (xóa thêm lần nữa sau vài trăm ms) thu hẹp nó thêm. Còn chắc nhất là xóa cache dựa trên change log của database bằng Debezium hoặc công cụ tương tự, để mọi thay đổi đã commit đều chắc chắn xóa được cache. Với dữ liệu không được phép cũ, như số dư tài khoản, thì đừng đọc từ cache.</p></details>
<pre>Why "update cache" is wrong:
  W1: DB = 1          W2: DB = 2
  W2: cache = 2       W1: cache = 1     ← cache now 1, DB 2, until TTL

The remaining race with delete:
  R : cache miss → reads DB (old = 1)
  W : DB = 2, commit → DEL key
  R : SET key = 1                       ← stale until TTL

Delayed double delete:
  update DB → commit → DEL key → (after ~500ms, async) DEL key again

CDC-driven invalidation (most robust):
  DB binlog/WAL → Debezium → Kafka "product-changes" → consumer → DEL product:{id}</pre>
<ul>
<li>Delete in an <strong>after-commit</strong> hook — deleting inside the transaction lets a reader re-cache the old row before commit.</li>
<li>If the delete fails, retry it via a queue; a failed invalidation is otherwise stale forever (until TTL).</li>
<li>Always keep a TTL as the safety net.</li>
</ul>
<div class="key-point">Update DB → commit → delete cache, with a TTL as the safety net. For stronger guarantees, invalidate from CDC. Never "update" the cache on write, and never cache data that must be strictly consistent.</div>`,
      },

      // ──── 3. MEMORY, PERSISTENCE & HA ────
      {
        q: 'How does Redis expire keys, and what are the eviction policies?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Expiration and eviction are different things. <strong>Expiration</strong> removes keys whose TTL has passed, and Redis does it in two ways: lazily, by checking a key's TTL when it is accessed, and actively, by sampling a few keys with TTLs many times per second and deleting expired ones. So an expired key can still use memory briefly, but it is never returned. <strong>Eviction</strong> happens when memory reaches <code>maxmemory</code>, and the <code>maxmemory-policy</code> decides what to remove. The default <code>noeviction</code> rejects writes with an error, which is right when Redis holds data you can't lose but wrong for a cache. For a pure cache use <code>allkeys-lru</code> or <code>allkeys-lfu</code>; if the instance mixes cache keys with TTLs and permanent keys, a <code>volatile-*</code> policy only evicts keys that have a TTL.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Expire và eviction là hai chuyện khác nhau. <strong>Expire</strong> là xóa key đã hết TTL, và Redis làm theo hai cách: lazy — kiểm tra TTL khi key được truy cập; và active — mỗi giây lấy mẫu vài lần một ít key có TTL rồi xóa key nào đã hết hạn. Vì vậy key hết hạn có thể vẫn chiếm RAM một lúc, nhưng sẽ không bao giờ được trả về. <strong>Eviction</strong> xảy ra khi RAM chạm <code>maxmemory</code>, lúc đó <code>maxmemory-policy</code> quyết định xóa key nào. Mặc định là <code>noeviction</code>: Redis từ chối ghi và báo lỗi. Cái này đúng khi Redis giữ dữ liệu không được mất, nhưng sai hoàn toàn nếu dùng làm cache. Với cache thuần, dùng <code>allkeys-lru</code> hoặc <code>allkeys-lfu</code>. Nếu trong cùng instance vừa có key cache có TTL vừa có key cần giữ lâu dài, thì dùng policy <code>volatile-*</code> để chỉ evict những key có TTL.</p></details>
<table><tr><th>Policy</th><th>Evicts</th><th>Use when</th></tr>
<tr><td>noeviction (default)</td><td>Nothing — writes error</td><td>Redis as a primary store / queue</td></tr>
<tr><td>allkeys-lru</td><td>Least recently used, any key</td><td>Pure cache (most common)</td></tr>
<tr><td>allkeys-lfu</td><td>Least frequently used, any key</td><td>Cache with stable popular items</td></tr>
<tr><td>volatile-lru / volatile-lfu</td><td>LRU/LFU among keys with TTL</td><td>Mixed cache + persistent keys</td></tr>
<tr><td>volatile-ttl</td><td>Shortest remaining TTL</td><td>TTL reflects value</td></tr>
<tr><td>allkeys-random / volatile-random</td><td>Random</td><td>Uniform access</td></tr>
</table>
<pre>maxmemory 4gb
maxmemory-policy allkeys-lru
maxmemory-samples 10        # LRU is approximated by sampling

INFO stats   → evicted_keys, expired_keys, keyspace_hits/misses</pre>
<div class="key-point">For a cache, set maxmemory and switch from noeviction to allkeys-lru/lfu — the default will start failing writes the moment memory is full. LRU in Redis is approximate (sampled), not exact.</div>`,
      },
      {
        q: 'RDB vs AOF persistence — what are the trade-offs?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p><strong>RDB</strong> takes point-in-time snapshots of the whole dataset at intervals: a forked child process writes a compact binary file. It is cheap at runtime, produces small files that are great for backups, and restarts quickly, but you lose everything written since the last snapshot, and forking a large instance can cause latency spikes and copy-on-write memory growth. <strong>AOF</strong> logs every write command; with <code>appendfsync everysec</code> you lose at most about a second of writes, and with <code>always</code> almost nothing at a big performance cost. AOF files are larger and replay more slowly, so Redis periodically rewrites them. Since Redis 4 the recommended setup is both together — hybrid persistence, where the AOF starts with an RDB preamble — giving fast restarts with about one second of potential loss. For a pure cache you can turn persistence off entirely.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>RDB</strong> là chụp snapshot toàn bộ dữ liệu theo chu kỳ: Redis fork ra một process con để ghi ra một file binary gọn nhẹ. Lúc chạy gần như không tốn gì, file nhỏ rất hợp để backup, và restart nhanh. Nhưng bạn sẽ mất mọi thứ ghi sau lần snapshot cuối, và fork một instance lớn có thể gây giật latency, RAM cũng phình ra vì copy-on-write. <strong>AOF</strong> thì ghi log mọi lệnh ghi. Với <code>appendfsync everysec</code> bạn mất tối đa khoảng một giây dữ liệu; với <code>always</code> thì gần như không mất gì nhưng hiệu năng giảm mạnh. File AOF lớn hơn và replay chậm hơn, nên Redis định kỳ rewrite lại nó. Từ Redis 4, cấu hình được khuyên dùng là bật cả hai — AOF có phần đầu là RDB — vừa restart nhanh vừa chỉ có nguy cơ mất khoảng một giây. Còn nếu chỉ dùng làm cache thuần thì tắt persistence luôn cũng được.</p></details>
<table><tr><th></th><th>RDB</th><th>AOF</th></tr>
<tr><td>What</td><td>Periodic snapshot</td><td>Log of every write</td></tr>
<tr><td>Data loss</td><td>Minutes (since last snapshot)</td><td>~1s (everysec) / ~0 (always)</td></tr>
<tr><td>File size</td><td>Small, compact</td><td>Large, needs rewrite</td></tr>
<tr><td>Restart</td><td>Fast</td><td>Slower (replay)</td></tr>
<tr><td>Runtime cost</td><td>Fork spikes</td><td>Continuous fsync</td></tr>
</table>
<pre># Recommended for data you care about
save 900 1 300 10 60 10000
appendonly yes
appendfsync everysec
aof-use-rdb-preamble yes     # hybrid (default since 5.0)</pre>
<p><strong>Interviewer follow-up:</strong> "So is Redis durable enough to be the primary database?" — Even with AOF, replication is asynchronous, so a failover can lose acknowledged writes. Use it as the source of truth only for data that tolerates that (sessions, counters), or use <code>WAIT</code> to require replica acknowledgement for critical writes.</p>
<div class="key-point">RDB = fast restarts, minutes of loss. AOF everysec = ~1 second of loss. Production default for important data: both (hybrid). Pure cache: neither.</div>`,
      },
      {
        q: 'Explain Redis replication, Sentinel and Cluster. When do you need Cluster?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p><strong>Replication</strong> copies a primary to one or more replicas asynchronously; replicas serve reads and act as standbys, but because replication is async a failover can lose the last writes. <strong>Sentinel</strong> adds high availability on top: a group of sentinel processes monitors the primary, agrees by quorum that it is down, promotes a replica, and tells clients the new address. It is still one primary holding all the data, so it does not scale writes or memory. <strong>Cluster</strong> shards the data: the key space is split into 16,384 hash slots spread over several primaries, each with its own replicas and built-in failover. You need Cluster when the dataset or write throughput is larger than one node can handle. The cost is that multi-key operations, transactions and Lua scripts only work when all keys are in the same slot, which you force with hash tags like <code>{user:42}</code>.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Replication</strong> là copy dữ liệu từ primary sang một hoặc nhiều replica theo kiểu bất đồng bộ. Replica dùng để đọc và làm dự phòng, nhưng vì copy bất đồng bộ nên khi failover có thể mất vài lệnh ghi cuối. <strong>Sentinel</strong> thêm khả năng high availability: một nhóm process sentinel theo dõi primary, khi đủ quorum đồng ý là primary chết thì nâng một replica lên thay và báo địa chỉ mới cho client. Nhưng vẫn chỉ có một primary giữ toàn bộ dữ liệu, nên không scale được lượng ghi hay dung lượng RAM. <strong>Cluster</strong> thì chia shard dữ liệu: không gian key chia thành 16.384 hash slot, rải trên nhiều primary, mỗi primary có replica và failover riêng. Bạn cần Cluster khi dữ liệu hoặc lượng ghi vượt quá sức một node. Đổi lại, các lệnh nhiều key, transaction và Lua script chỉ chạy được khi tất cả key nằm cùng một slot — muốn vậy thì dùng hash tag như <code>{user:42}</code>.</p></details>
<pre>Sentinel                                 Cluster (3 primaries + replicas)
 S1  S2  S3   (quorum = 2)                slots 0–5460      → P1 (+R1)
   \  |  /                                slots 5461–10922  → P2 (+R2)
   Primary ──async──▶ Replica             slots 10923–16383 → P3 (+R3)
   (all data on one node)
                                          slot = CRC16(key) mod 16384

# Hash tags: only the part inside {} is hashed → same slot
SET {user:42}:profile ...
SET {user:42}:cart ...
MGET {user:42}:profile {user:42}:cart     # OK — same slot
MGET user:42:profile user:7:cart          # CROSSSLOT error</pre>
<ul>
<li>Clients must be cluster-aware: they follow <code>MOVED</code> (slot permanently elsewhere) and <code>ASK</code> (slot migrating) redirects.</li>
<li>Cluster supports only database 0 (no <code>SELECT</code>).</li>
<li>Overusing one hash tag recreates a hot shard.</li>
</ul>
<div class="key-point">Replication = copies. Sentinel = automatic failover for one primary. Cluster = sharding + failover across 16,384 slots. Choose Cluster only when one node's memory or write throughput isn't enough.</div>`,
      },

      // ──── 4. COORDINATION & PITFALLS ────
      {
        q: 'How do you implement a distributed lock with Redis, and is it safe?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The basic lock is a single atomic command: <code>SET lock:key &lt;random-token&gt; NX PX 30000</code>, which sets the key only if it doesn't exist and gives it an expiry so a crashed holder can't block forever. Releasing must check that you still own the lock — compare the token and delete in one Lua script — otherwise you might delete a lock that expired and was taken by someone else. Libraries like Redisson add a watchdog that extends the lease while the holder is alive, plus reentrancy and fair locks. The honest answer on safety is that it's fine for efficiency, like avoiding duplicate work, but not for correctness on its own: a long GC pause or a network delay can let the lease expire while the old holder still thinks it owns the lock, and an async failover can lose the lock entirely. Redlock across several independent nodes reduces the failover issue but doesn't fix pauses. For correctness, use <strong>fencing tokens</strong> checked by the resource, or a database constraint or consensus system like ZooKeeper or etcd.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Lock cơ bản chỉ cần một lệnh nguyên tử: <code>SET lock:key &lt;token-ngẫu-nhiên&gt; NX PX 30000</code> — chỉ set nếu key chưa có, và có thời hạn để lỡ bên giữ lock bị crash thì cũng không kẹt mãi. Khi release phải kiểm tra mình còn đang giữ lock không: so token rồi mới xóa, làm trong cùng một Lua script. Nếu không, bạn có thể xóa nhầm lock mà người khác vừa lấy sau khi lock của bạn đã hết hạn. Thư viện như Redisson có sẵn watchdog tự gia hạn lock khi bên giữ còn sống, cùng reentrant lock và fair lock. Còn câu hỏi "có an toàn không" thì trả lời thật là: dùng để tránh làm trùng việc thì ổn, nhưng tự nó không đảm bảo tính đúng đắn. Một lần GC pause dài hay mạng chậm có thể làm lock hết hạn trong khi bên giữ cũ vẫn tưởng mình đang giữ; failover bất đồng bộ cũng có thể làm mất lock. Redlock chạy trên nhiều node độc lập giảm được vấn đề failover, nhưng không giải quyết chuyện pause. Muốn đảm bảo đúng thật sự thì dùng <strong>fencing token</strong> để bên tài nguyên tự kiểm tra, hoặc dựa vào constraint của database, hoặc hệ thống đồng thuận như ZooKeeper, etcd.</p></details>
<pre># Acquire
SET lock:order:42 9f2c-uuid NX PX 30000

-- Release safely (Lua: compare + delete atomically)
if redis.call("GET", KEYS[1]) == ARGV[1] then
  return redis.call("DEL", KEYS[1])
else
  return 0
end

// Redisson
RLock lock = redisson.getLock("lock:order:42");
if (lock.tryLock(5, TimeUnit.SECONDS)) {      // watchdog auto-renews
  try { process(); } finally { lock.unlock(); }
}</pre>
<pre>Why a lease can't guarantee mutual exclusion:
  C1 acquires lock (30s) ── GC pause 40s ──────────▶ writes to storage ✘
  lock expires at 30s → C2 acquires → writes to storage
Fencing token fix: lock returns increasing token (33, 34);
  storage rejects writes with token &lt; last seen → C1's write (33) rejected.</pre>
<div class="key-point">SET NX PX + random token + Lua compare-and-delete is the correct basic lock. Say clearly: it's an efficiency lock; for correctness add fencing tokens or rely on a DB constraint.</div>`,
      },
      {
        q: 'What are hot keys and big keys, and why are they dangerous?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A <strong>hot key</strong> is one key receiving a huge share of traffic, such as a flash-sale product or a celebrity's profile. Because one key lives on one node and Redis executes commands on one thread, that node's CPU or network saturates while the rest of the cluster is idle. You handle it with a local in-process cache in front of Redis, by spreading reads across replicas, or by splitting the key into several copies like <code>product:1:#0</code> to <code>#3</code> and picking one at random. A <strong>big key</strong> is one holding a very large value, like a 10 MB string or a hash with millions of fields. Reading it blocks the thread and floods the network, deleting it with <code>DEL</code> can freeze Redis for seconds, and it unbalances memory across cluster nodes and slows migration. You prevent big keys by splitting them into buckets, use <code>UNLINK</code> to delete in the background, and find them with <code>redis-cli --bigkeys</code> or <code>MEMORY USAGE</code>.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Hot key</strong> là một key nhận phần lớn traffic, ví dụ sản phẩm đang flash sale hay profile của người nổi tiếng. Vì một key chỉ nằm trên một node và Redis chạy lệnh trên một thread, node đó bị quá tải CPU hoặc mạng trong khi các node khác ngồi không. Cách xử lý: thêm local cache ngay trong ứng dụng trước Redis, chia đọc ra các replica, hoặc nhân key ra vài bản như <code>product:1:#0</code> tới <code>#3</code> rồi chọn ngẫu nhiên. <strong>Big key</strong> là key chứa dữ liệu quá lớn, như một string 10 MB hay một hash hàng triệu field. Đọc nó thì block thread và nghẽn mạng; xóa bằng <code>DEL</code> có thể làm Redis đứng vài giây; nó còn làm lệch RAM giữa các node trong cluster và làm chậm việc chuyển slot. Phòng tránh bằng cách chia nhỏ thành nhiều bucket, xóa bằng <code>UNLINK</code> để chạy ở background, và tìm chúng bằng <code>redis-cli --bigkeys</code> hoặc <code>MEMORY USAGE</code>.</p></details>
<pre># Find them
redis-cli --bigkeys              # largest key per type (uses SCAN, safe)
redis-cli --hotkeys              # needs an LFU maxmemory-policy
MEMORY USAGE user:feed:42

# Delete a big key without blocking
UNLINK user:feed:42              # frees memory in a background thread

# Split a big hash into buckets
HSET cart:42:{bucket 0..15} itemId qty     # bucket = itemId % 16</pre>
<p><strong>Rough thresholds</strong> many teams use: strings &gt; 10 KB, collections &gt; 5,000 elements → review.</p>
<div class="key-point">Hot key = too much traffic on one key (local cache, replicas, key copies). Big key = too much data in one key (split, UNLINK, never DEL or HGETALL it on the hot path).</div>`,
      },
      {
        q: 'MULTI/EXEC transactions vs Lua scripts vs pipelining — what is the difference?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>They solve different problems. <strong>Pipelining</strong> is purely a network optimisation: the client sends many commands without waiting for each reply, cutting round trips, but other clients' commands can interleave and there is no atomicity. <strong>MULTI/EXEC</strong> queues commands and executes them together without interleaving, but it is not a transaction in the database sense: there is no rollback if one command fails, and you can't use a value read inside the transaction to decide what to write. For check-then-write logic you add <code>WATCH</code> for optimistic locking, where EXEC aborts if a watched key changed and you retry. <strong>Lua scripts</strong> run atomically on the server and can read, branch and write in one step, so they are usually the cleanest answer for things like compare-and-delete, rate limiters and inventory decrements. Just keep them short, since a slow script blocks the whole server.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Ba thứ này giải ba bài toán khác nhau. <strong>Pipelining</strong> chỉ là tối ưu mạng: client gửi một loạt lệnh mà không chờ từng phản hồi, nên giảm số round trip. Nhưng lệnh của client khác vẫn chen vào giữa được, và không có tính nguyên tử. <strong>MULTI/EXEC</strong> gom các lệnh lại rồi chạy liền một mạch, không ai chen vào. Tuy vậy nó không phải transaction như database: một lệnh lỗi thì không rollback, và bạn không thể đọc một giá trị bên trong rồi dựa vào đó quyết định ghi gì. Muốn kiểu "kiểm tra rồi mới ghi" thì thêm <code>WATCH</code>: nếu key đang watch bị đổi thì EXEC bị hủy, và bạn retry. <strong>Lua script</strong> chạy nguyên tử ngay trên server, đọc, rẽ nhánh rồi ghi trong một bước, nên thường là cách gọn nhất cho những việc như so sánh rồi xóa, rate limiter, hay trừ tồn kho. Chỉ cần nhớ giữ script thật ngắn, vì script chậm sẽ block cả server.</p></details>
<table><tr><th></th><th>Pipeline</th><th>MULTI/EXEC</th><th>Lua (EVAL / FUNCTION)</th></tr>
<tr><td>Fewer round trips</td><td>✔</td><td>✔ (when pipelined)</td><td>✔</td></tr>
<tr><td>Atomic / no interleaving</td><td>✘</td><td>✔</td><td>✔</td></tr>
<tr><td>Read-then-decide</td><td>✘</td><td>Only with WATCH + retry</td><td>✔</td></tr>
<tr><td>Rollback</td><td>✘</td><td>✘</td><td>✘ (partial writes stay)</td></tr>
</table>
<pre>-- Atomic stock decrement (never goes negative)
local stock = tonumber(redis.call("GET", KEYS[1]) or "0")
if stock &gt;= tonumber(ARGV[1]) then
  return redis.call("DECRBY", KEYS[1], ARGV[1])
end
return -1</pre>
<div class="key-point">Pipeline = speed, not atomicity. MULTI/EXEC = atomic batch, no rollback, no conditional logic. Lua = atomic read-modify-write — the usual right answer.</div>`,
      },
      {
        q: 'How would you build a rate limiter with Redis?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The simplest is a <strong>fixed window</strong>: <code>INCR</code> a key like <code>rl:user:42:202610241530</code> and set an expiry on first use; if the count exceeds the limit, reject. It is cheap but allows a burst of up to twice the limit around window boundaries. A <strong>sliding window log</strong> stores each request's timestamp in a sorted set, removes entries older than the window, and counts what's left — accurate, but memory grows with the limit. A <strong>token bucket</strong> stores the token count and last refill time in a hash and refills based on elapsed time, which allows controlled bursts and is what most API gateways use. In every case the check and update must be atomic, so you run them in a Lua script, and because Redis is shared, the limit applies across all application instances.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Đơn giản nhất là <strong>fixed window</strong>: <code>INCR</code> một key kiểu <code>rl:user:42:202610241530</code>, lần đầu thì set thời hạn; đếm vượt giới hạn thì từ chối. Cách này rẻ, nhưng ở ranh giới giữa hai cửa sổ có thể lọt qua gấp đôi giới hạn. <strong>Sliding window log</strong> lưu thời điểm của từng request trong một sorted set, xóa những mục cũ hơn độ dài cửa sổ rồi đếm phần còn lại — chính xác, nhưng tốn RAM theo giới hạn. <strong>Token bucket</strong> lưu số token và thời điểm nạp gần nhất trong một hash, rồi nạp thêm token theo thời gian đã trôi qua. Cách này cho phép burst có kiểm soát, và là thứ hầu hết API gateway đang dùng. Cách nào thì bước kiểm tra và cập nhật cũng phải nguyên tử, nên chạy trong Lua script. Và vì Redis dùng chung, giới hạn sẽ áp dụng cho tất cả instance của ứng dụng chứ không riêng một máy.</p></details>
<pre>-- Sliding window: max ARGV[2] requests per ARGV[1] ms
-- KEYS[1] = rl:user:42   ARGV[3] = now (ms)   ARGV[4] = unique request id
redis.call("ZREMRANGEBYSCORE", KEYS[1], 0, ARGV[3] - ARGV[1])
if redis.call("ZCARD", KEYS[1]) &lt; tonumber(ARGV[2]) then
  redis.call("ZADD", KEYS[1], ARGV[3], ARGV[4])
  redis.call("PEXPIRE", KEYS[1], ARGV[1])
  return 1          -- allowed
end
return 0            -- rejected → HTTP 429</pre>
<table><tr><th>Algorithm</th><th>Accuracy</th><th>Memory</th><th>Bursts</th></tr>
<tr><td>Fixed window</td><td>Low (2× at edges)</td><td>O(1)</td><td>Uncontrolled at boundary</td></tr>
<tr><td>Sliding window log</td><td>Exact</td><td>O(limit)</td><td>None</td></tr>
<tr><td>Sliding window counter</td><td>Approximate</td><td>O(1)</td><td>Smoothed</td></tr>
<tr><td>Token bucket</td><td>Good</td><td>O(1)</td><td>Allowed up to bucket size</td></tr>
</table>
<div class="key-point">Make the check-and-increment atomic (Lua), pick the algorithm by how strict you must be, and return 429 with a Retry-After header. Bucket4j and Resilience4j provide Redis-backed implementations for Java.</div>`,
      },
      {
        q: 'Redis Pub/Sub vs Redis Streams vs Kafka — when do you use each?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><strong>Redis Pub/Sub</strong> is fire-and-forget: a message goes only to subscribers connected at that moment and is not stored, so a disconnected or slow subscriber simply misses it. It suits live notifications where loss is acceptable, like cache-invalidation broadcasts or pushing updates to WebSocket nodes. <strong>Redis Streams</strong> are an append-only log inside Redis with IDs, consumer groups, acknowledgements and a pending list for redelivery, so they give at-least-once delivery for moderate volumes — a good lightweight job or event queue when you already run Redis. <strong>Kafka</strong> is built for large, long-retention, replayable event streams across many teams, with disk-based storage, partition-level scaling and a rich ecosystem. The rule: losing messages is acceptable → Pub/Sub; durable queue, modest volume, Redis already in place → Streams; high-volume event backbone with replay → Kafka.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Redis Pub/Sub</strong> là kiểu bắn rồi quên: message chỉ tới những subscriber đang kết nối đúng lúc đó và không được lưu lại. Subscriber nào mất kết nối hay xử lý chậm thì cứ thế bỏ lỡ. Nó hợp với thông báo realtime mà mất cũng không sao, như báo cho mọi node xóa cache, hay đẩy cập nhật tới các node WebSocket. <strong>Redis Streams</strong> là log ghi nối thêm ngay trong Redis, có ID, consumer group, ack và pending list để giao lại, nên đạt được at-least-once với lượng dữ liệu vừa phải. Đây là một job queue hay event queue gọn nhẹ nếu bạn đã có sẵn Redis. <strong>Kafka</strong> thì sinh ra cho luồng event lớn, lưu lâu, replay được, nhiều team cùng dùng, lưu trên đĩa, scale theo partition và có hệ sinh thái rất mạnh. Tóm lại: mất message cũng được → Pub/Sub; cần queue bền, lượng vừa phải, đã có Redis → Streams; cần xương sống event lớn có replay → Kafka.</p></details>
<table><tr><th></th><th>Redis Pub/Sub</th><th>Redis Streams</th><th>Kafka</th></tr>
<tr><td>Stored</td><td>No</td><td>Yes (memory, capped with MAXLEN)</td><td>Yes (disk, days–forever)</td></tr>
<tr><td>Delivery</td><td>At-most-once</td><td>At-least-once (XACK, PEL)</td><td>At-least / exactly-once</td></tr>
<tr><td>Consumer groups</td><td>No</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Replay</td><td>No</td><td>Yes (by ID)</td><td>Yes (by offset / time)</td></tr>
<tr><td>Scale</td><td>One node / shard channels</td><td>Limited by memory</td><td>Very high, partitioned</td></tr>
</table>
<pre>XADD orders * orderId 42 amount 99.5
XGROUP CREATE orders billing $ MKSTREAM
XREADGROUP GROUP billing c1 COUNT 10 BLOCK 5000 STREAMS orders &gt;
XACK orders billing 1729760000000-0
XAUTOCLAIM orders billing c2 60000 0     # take over stuck messages</pre>
<div class="key-point">Pub/Sub loses messages by design. Streams are a durable, memory-bound mini-Kafka. Reach for Kafka when you need volume, long retention or replay across teams.</div>`,
      },
      {
        q: 'Why should you never run KEYS * in production, and what are other common Redis pitfalls?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p><code>KEYS *</code> walks the entire keyspace in one go, and because Redis executes commands on a single thread, every other client waits until it finishes; on millions of keys that is seconds of total outage. Use <code>SCAN</code> instead, which iterates in small batches with a cursor. The same problem applies to any O(N) command on large data — <code>HGETALL</code>, <code>SMEMBERS</code> or <code>LRANGE 0 -1</code> on big collections, <code>DEL</code> on a big key, and <code>FLUSHALL</code> — so prefer <code>HSCAN</code>/<code>SSCAN</code>, <code>UNLINK</code> and async flush. Other common mistakes are leaving <code>maxmemory-policy</code> at <code>noeviction</code> for a cache, keys without TTLs that grow forever, opening a new connection per request instead of pooling, exposing Redis without authentication, and treating Redis as durable when replication is asynchronous.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>KEYS *</code> quét toàn bộ key trong một lần. Mà Redis chạy lệnh trên một thread, nên trong lúc đó mọi client khác phải chờ; với vài triệu key là Redis "đứng hình" vài giây. Hãy dùng <code>SCAN</code>, lệnh này quét từng đợt nhỏ bằng cursor. Lệnh O(N) nào chạy trên dữ liệu lớn cũng có vấn đề tương tự: <code>HGETALL</code>, <code>SMEMBERS</code>, <code>LRANGE 0 -1</code> trên collection lớn, <code>DEL</code> một big key, hay <code>FLUSHALL</code>. Thay vào đó dùng <code>HSCAN</code>/<code>SSCAN</code>, <code>UNLINK</code> và flush async. Mấy lỗi hay gặp khác: để <code>maxmemory-policy</code> là <code>noeviction</code> cho cache; key không có TTL nên cứ phình mãi; mỗi request mở một kết nối mới thay vì dùng connection pool; để Redis lộ ra ngoài mà không có mật khẩu; và tưởng Redis lưu bền trong khi replication là bất đồng bộ.</p></details>
<pre># ❌ Blocks the server
KEYS session:*

# ✅ Incremental, non-blocking
SCAN 0 MATCH session:* COUNT 500
# → returns next cursor; repeat until cursor == 0

# Disable dangerous commands in production (redis.conf)
rename-command KEYS ""
rename-command FLUSHALL ""
# or with ACLs (Redis 6+)
ACL SETUSER app on &gt;secret ~app:* +@all -@dangerous</pre>
<ul>
<li><strong>SLOWLOG GET</strong> and <strong>LATENCY DOCTOR</strong> show which commands are blocking.</li>
<li><strong>Key naming</strong>: <code>service:entity:id:field</code>, consistent and prefix-scannable.</li>
<li><strong>Serialization</strong>: with Spring Data Redis, configure a JSON serializer — the default JDK serializer produces unreadable, class-version-fragile values.</li>
</ul>
<div class="key-point">One thread executes every command, so any O(N) command on big data is an outage. Use SCAN/HSCAN, UNLINK, and disable KEYS/FLUSHALL in production.</div>`,
      },
      {
        q: 'How do you use Redis with Spring Boot caching (@Cacheable), and what are the pitfalls?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Add <code>spring-boot-starter-data-redis</code> and <code>@EnableCaching</code>, then annotate methods: <code>@Cacheable</code> returns the cached value or calls the method and stores the result, <code>@CachePut</code> always calls and updates, and <code>@CacheEvict</code> removes entries. A <code>RedisCacheManager</code> lets you set a TTL per cache name and a JSON serializer. The common pitfalls are mostly about how Spring applies the annotations: they work through a proxy, so a call from another method in the same class bypasses the cache; the default JDK serializer makes values unreadable and breaks when classes change; there is no TTL unless you configure one; null results are cached unless you disable that; and <code>@Cacheable</code> has no stampede protection unless you set <code>sync = true</code>. Also make sure evictions happen after the transaction commits, or a concurrent reader can re-cache stale data.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Thêm <code>spring-boot-starter-data-redis</code> và <code>@EnableCaching</code>, rồi gắn annotation lên method: <code>@Cacheable</code> có trong cache thì trả luôn, chưa có thì gọi method rồi lưu kết quả; <code>@CachePut</code> luôn gọi method và cập nhật cache; <code>@CacheEvict</code> thì xóa khỏi cache. Dùng <code>RedisCacheManager</code> để đặt TTL theo từng tên cache và cấu hình JSON serializer. Các cái bẫy chủ yếu nằm ở cách Spring áp dụng annotation. Annotation chạy qua proxy, nên gọi từ một method khác trong cùng class là bỏ qua cache. Serializer JDK mặc định làm dữ liệu không đọc được và dễ vỡ khi class thay đổi. Không cấu hình thì không có TTL. Kết quả null cũng bị cache nếu bạn không tắt. Và <code>@Cacheable</code> không chống stampede trừ khi đặt <code>sync = true</code>. Ngoài ra, nhớ để việc xóa cache chạy sau khi transaction commit, nếu không một request đọc chen vào giữa có thể nạp lại dữ liệu cũ vào cache.</p></details>
<pre>@Bean
RedisCacheManager cacheManager(RedisConnectionFactory cf) {
  var base = RedisCacheConfiguration.defaultCacheConfig()
      .entryTtl(Duration.ofMinutes(10))
      .disableCachingNullValues()
      .serializeValuesWith(SerializationPair.fromSerializer(
          new GenericJackson2JsonRedisSerializer()));
  return RedisCacheManager.builder(cf)
      .cacheDefaults(base)
      .withCacheConfiguration("products", base.entryTtl(Duration.ofMinutes(30)))
      .transactionAware()                 // evict/put after commit
      .build();
}

@Service
class ProductService {
  @Cacheable(cacheNames = "products", key = "#id", sync = true)  // single-flight per key
  public ProductDto get(long id) { ... }

  @CacheEvict(cacheNames = "products", key = "#dto.id")
  @Transactional
  public void update(ProductDto dto) { ... }

  public ProductDto getTwice(long id) {
    return get(id);           // ❌ self-invocation → proxy bypassed → no caching
  }
}</pre>
<div class="key-point">Configure TTL + JSON serializer + transactionAware, use sync=true on hot keys, and remember self-invocation skips the cache proxy. Cache DTOs, not JPA entities with lazy associations.</div>`,
      },
    ],
  },
];
