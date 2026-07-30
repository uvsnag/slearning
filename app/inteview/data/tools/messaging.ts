// Tools & Technologies — Kafka, RabbitMQ, schema registry, CDC
import type { PvQuestion } from '../../types';

export const questions: PvQuestion[] = [
  {
    q: 'How does Kafka actually work? Explain topics, partitions, offsets and consumer groups.',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Kafka is a distributed, append-only commit log rather than a classic queue. A <strong>topic</strong> is split into <strong>partitions</strong>, each an ordered immutable sequence of records; a producer picks the partition by key (same key → same partition → guaranteed order for that key), and each consumer in a <strong>consumer group</strong> owns a subset of partitions and tracks its own <strong>offset</strong>. That design is what gives Kafka its properties: parallelism equals partition count, messages are <em>retained</em> (by time or size) instead of deleted on read so multiple independent groups can replay the same data, and ordering is per-partition — never global. The consequences to state in an interview: more consumers than partitions leaves some idle, and any change to key routing or partition count breaks ordering assumptions.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Kafka là một commit log phân tán chỉ ghi thêm (append-only), chứ không phải một cái queue thông thường. Một <strong>topic</strong> được chia thành nhiều <strong>partition</strong>, mỗi partition là một dãy record có thứ tự và không thể sửa; producer chọn partition theo key (cùng key thì vào cùng partition, nên thứ tự được đảm bảo cho key đó), còn mỗi consumer trong một <strong>consumer group</strong> sở hữu một phần các partition và tự quản <strong>offset</strong> của mình. Chính thiết kế đó tạo ra các đặc tính của Kafka: mức song song bằng số partition; message được <em>giữ lại</em> theo thời gian hoặc dung lượng chứ không mất đi sau khi đọc, nên nhiều group độc lập có thể đọc lại cùng dữ liệu; và thứ tự chỉ đảm bảo trong từng partition, không bao giờ là toàn cục. Hai điều nên nói thêm: nếu số consumer nhiều hơn số partition thì sẽ có consumer ngồi không, và mọi thay đổi về cách chọn key hay về số partition đều phá vỡ giả định về thứ tự.</p></details>
<pre>topic "orders"  (retention = 7 days, replication.factor = 3)
 ├─ partition 0: [o1][o4][o7] ...   ← leader on broker 1, followers 2,3
 ├─ partition 1: [o2][o5] ...
 └─ partition 2: [o3][o6] ...

group "billing"   → c1 reads p0, c2 reads p1+p2   (offsets stored in Kafka)
group "analytics" → reads ALL partitions independently, own offsets
// Two groups = two independent readers of the same log (fan-out for free)

// Ordering: guaranteed per partition only
producer.send(new ProducerRecord&lt;&gt;("orders", order.getCustomerId(), payload));
//                                              ↑ key → all events for one
//                                                customer stay in order</pre>
<pre>// The knobs that matter in production
partitions        : sets max parallelism; you can add but NOT remove →
                    over-provision slightly (e.g. 12), plan for growth
replication.factor: 3 with min.insync.replicas=2 → survives one broker loss
acks=all          : producer waits for ISR → no silent data loss (use it)
enable.idempotence: true → no duplicates from producer retries
max.poll.interval : if your handler is slow, the consumer is kicked out and
                    the group REBALANCES → duplicate processing; keep
                    handlers fast or increase the interval / use pause()
auto.offset.reset : earliest (replay) vs latest (skip) for a new group
// Rebalance = consumers stop while partitions are reassigned. Use
// cooperative-sticky assignment to avoid stop-the-world pauses.</pre>
<p><strong>Retention vs deletion:</strong> Kafka is not a task queue — a consumed record stays until retention expires, which is what enables replay, backfills, and adding a new service that reprocesses history. With <code>cleanup.policy=compact</code> Kafka instead keeps the <em>latest value per key</em> forever, which turns a topic into a durable snapshot of state (the basis of event sourcing and Kafka Streams state stores).</p>
<div class="key-point">Kafka = partitioned, retained log. Parallelism is bounded by partitions, ordering exists only within a partition (choose the key deliberately), consumer groups give independent replayable reads, and slow handlers cause rebalances that look like duplicate processing.</div>`,
  },
  {
    q: 'Does Kafka guarantee exactly-once delivery? How do you avoid duplicate processing?',
    difficulty: 'tricky',
    a: `<div class="interview-answer"><p>Kafka's default is <strong>at-least-once</strong>: the producer retries and the consumer commits offsets after processing, so a crash between processing and commit means the record is delivered again. Kafka does offer exactly-once <em>semantics</em> — idempotent producers plus transactions that atomically commit messages and offsets — but that only holds <strong>inside</strong> Kafka (read from a topic, write to a topic). The moment your handler touches a database, an email provider, or a payment API, the guarantee ends, because those systems are not part of the transaction. So the practical answer is: enable idempotence, use transactions for Kafka-to-Kafka pipelines, and make every consumer <strong>idempotent</strong> — deduplicate on a business key or event id so reprocessing is harmless.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mặc định Kafka là <strong>at-least-once</strong>: producer có retry và consumer commit offset sau khi xử lý, nên nếu process chết giữa lúc xử lý xong và lúc commit thì record sẽ được gửi lại. Kafka có hỗ trợ exactly-once <em>semantics</em> — idempotent producer cộng transaction để commit message và offset một cách nguyên tử — nhưng điều đó chỉ đúng <strong>trong phạm vi</strong> Kafka (đọc từ topic, ghi ra topic). Ngay khi handler của bạn ghi vào database, gọi mail provider hay gọi API thanh toán thì bảo đảm đó mất hiệu lực, vì những hệ thống kia không nằm trong transaction. Nên câu trả lời thực tế là: bật idempotence, dùng transaction cho các pipeline Kafka-sang-Kafka, và làm cho mọi consumer trở nên <strong>idempotent</strong> — chống trùng theo một business key hoặc event id để việc xử lý lại không gây hậu quả.</p></details>
<pre>// Where duplicates come from
producer retry after a timeout        → same record twice (fixed by
                                       enable.idempotence=true + acks=all)
consumer crash before offset commit  → reprocess after restart
rebalance during a long poll          → another consumer redoes the batch

// Exactly-once INSIDE Kafka (streams / topic-to-topic)
props.put("enable.idempotence", true);
props.put("transactional.id", "order-enricher-1");
producer.beginTransaction();
producer.send(outRecord);
producer.sendOffsetsToTransaction(offsets, groupMetadata); // atomic pair
producer.commitTransaction();
// Kafka Streams: processing.guarantee=exactly_once_v2 does this for you.</pre>
<pre>// The pattern that survives contact with a database: idempotent consumers
@KafkaListener(topics = "payments")
void handle(PaymentEvent e) {
  // 1) natural dedup — a unique constraint IS the deduplication
  if (!processed.tryInsert(e.eventId())) return;   // duplicate → no-op
  // 2) do the work in the SAME transaction as the dedup row
  ledger.credit(e.accountId(), e.amount());
}
// Or make the write itself idempotent:
//   UPSERT ... ON CONFLICT DO NOTHING
//   UPDATE balance = :final WHERE version = :expected   (state, not delta)
// Note: "UPDATE balance = balance + 10" is NOT idempotent — a replay
// double-credits. Prefer absolute state or a dedup key.

// Producing side: outbox pattern so the DB write and the event cannot diverge
// (insert event row in the same tx → a relay publishes it → CDC/Debezium)</pre>
<p><strong>Also worth mentioning:</strong> a <strong>dead-letter topic</strong> for records that fail repeatedly (with the original headers and the error), bounded retries with backoff so one poison message does not stall a partition, and monitoring <strong>consumer lag</strong> as your primary health metric — lag growing steadily means you are losing the race, and lag is what pages you at 3am, not CPU.</p>
<div class="key-point">Kafka gives at-least-once by default and exactly-once only within Kafka. Design consumers to be idempotent (dedup key or absolute-state writes), use the outbox pattern on the producing side, add a DLQ with bounded retries, and alert on consumer lag.</div>`,
  },
  {
    q: 'Kafka vs RabbitMQ (or SQS) — how do you choose?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>They solve different shapes of problem. <strong>RabbitMQ</strong> is a broker that <em>routes and deletes</em>: rich exchange types, per-message acknowledgement and requeue, priorities, delayed messages, and easy competing-consumer work distribution — ideal for task queues and RPC-style commands where each message must be handled once and then disappears. <strong>Kafka</strong> is a retained, partitioned log built for high-throughput event streams, replay, and multiple independent consumers of the same data — ideal for event-driven integration, analytics, and anything you may want to reprocess. Managed queues like <strong>SQS</strong> are RabbitMQ-shaped with almost no operational cost but weaker ordering and routing. Rule of thumb: "work to be done" → RabbitMQ/SQS; "facts that happened, possibly read by many" → Kafka.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hai thứ này giải hai dạng bài toán khác nhau. <strong>RabbitMQ</strong> là broker <em>định tuyến rồi xóa</em>: có nhiều loại exchange, ack/requeue theo từng message, priority, delayed message, và chia việc cho nhiều consumer rất dễ — rất phù hợp cho task queue và các lệnh kiểu RPC, khi mỗi message cần được xử lý một lần rồi biến mất. <strong>Kafka</strong> là một log phân vùng có lưu giữ, sinh ra cho các luồng event thông lượng cao, cho việc đọc lại và cho nhiều consumer độc lập cùng đọc một dữ liệu — phù hợp cho tích hợp theo event, cho analytics, và cho mọi thứ mà sau này bạn có thể phải xử lý lại. Các queue dịch vụ như <strong>SQS</strong> thì giống RabbitMQ về hình dạng, gần như không tốn công vận hành, nhưng yếu hơn về thứ tự và định tuyến. Quy tắc dễ nhớ: "việc cần làm" thì chọn RabbitMQ/SQS; "sự kiện đã xảy ra, có thể nhiều nơi cần đọc" thì chọn Kafka.</p></details>
<pre>                    RabbitMQ / SQS              Kafka
model               queue: routed, then gone     log: retained, replayable
throughput          tens of thousands/s          millions/s (sequential I/O)
ordering            per queue (fragile with      strict per partition
                    multiple consumers)
consumers           compete for messages         groups read independently
retry               native requeue + DLX/DLQ     you build it (retry topic)
delay/priority      built in                     not native (needs tricks)
replay history      no (message is consumed)     yes — core feature
ops cost            low (SQS: near zero)         higher (brokers, partitions,
                                                 lag, rebalance tuning)
use for             emails, PDF jobs, commands,  event streams, audit logs,
                    RPC, fan-out to workers      CDC, analytics, sourcing</pre>
<pre>// Concrete choices I would defend
"Send a welcome email after signup"            → SQS/RabbitMQ (a task)
"Resize uploaded images"                        → SQS/RabbitMQ (a task)
"OrderPlaced consumed by billing, search,
 analytics and a future service"                → Kafka (a fact, fan-out)
"Stream DB changes into a search index"         → Kafka + Debezium (CDC)
"Retry with exponential backoff and a DLQ"      → RabbitMQ/SQS natively;
                                                  in Kafka use retry topics
"We need to reprocess last month's events"      → Kafka (replay)
// Anti-pattern: Kafka as a task queue with per-message ack semantics —
// you fight the design (no per-message retry, blocked partitions).
// Anti-pattern: RabbitMQ as an event store — nothing to replay.</pre>
<p><strong>Operationally</strong>, be honest about cost: Kafka means brokers (or Confluent/MSK), partition planning, lag monitoring, and rebalance tuning; RabbitMQ means clustering and queue-length alerts; SQS means almost nothing but ties you to AWS and gives at-least-once with only FIFO queues providing ordering. Many systems legitimately run both.</p>
<div class="key-point">Choose by semantics, not popularity: transient work with per-message retry and delays → RabbitMQ/SQS; durable, replayable, multi-consumer event streams → Kafka. Using either as the other creates the friction people mistake for a technology problem.</div>`,
  },
  {
    q: 'What is a schema registry, and how do you evolve event schemas safely?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>In an event-driven system the message is a public API with an unknown number of consumers, so its schema needs governance. A <strong>schema registry</strong> stores versioned schemas (Avro, Protobuf, JSON Schema), producers register and reference them by id, and the registry <em>rejects</em> a new version that breaks the configured compatibility rule — usually <strong>backward compatible</strong>, meaning new consumers can read old data. In practice that means: add optional fields with defaults, never rename or remove a field in use, never change a type, and treat the event as a contract with its own version and deprecation window. The payoff is that a producer deploy cannot silently break three downstream services at 2am.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Trong hệ thống event-driven, message chính là một API công khai với số lượng consumer không đếm được, nên schema của nó cần được quản lý. Một <strong>schema registry</strong> lưu các schema có version (Avro, Protobuf, JSON Schema); producer đăng ký schema và tham chiếu tới nó bằng id, còn registry sẽ <em>từ chối</em> version mới nếu nó phá vỡ quy tắc tương thích đã cấu hình — thường là <strong>backward compatible</strong>, nghĩa là consumer mới vẫn đọc được dữ liệu cũ. Cụ thể trong thực tế: thêm field thì phải optional và có default, không đổi tên hay xóa field đang được dùng, không đổi kiểu dữ liệu, và coi event như một hợp đồng có version riêng cùng thời gian deprecate rõ ràng. Lợi ích là một lần deploy phía producer sẽ không âm thầm làm sập ba service phía sau vào lúc 2 giờ sáng.</p></details>
<pre>// Avro schema, registered and referenced by id (5-byte prefix in the record)
{ "type":"record", "name":"OrderPlaced", "namespace":"acme.orders",
  "fields":[
    {"name":"orderId","type":"string"},
    {"name":"customerId","type":"string"},
    {"name":"totalCents","type":"long"},
    {"name":"currency","type":"string","default":"USD"},   // ✅ safe add
    {"name":"couponCode","type":["null","string"],"default":null} // ✅ optional
  ]}

// Compatibility modes (per subject)
BACKWARD  (default): new SCHEMA can read old DATA  → safe to upgrade
                     consumers first; you may ADD optional / REMOVE
FORWARD            : old schema can read new data → upgrade producers first
FULL               : both directions
NONE               : you enjoy incidents</pre>
<pre>// Safe vs breaking changes
✅ add a field with a default            ✅ add a new event type/topic
✅ widen an enum consumer-side first     ✅ deprecate a field (stop writing)
❌ rename a field                        ❌ remove a required field
❌ change int → string (or units!)       ❌ change the meaning of a field
// "totalCents → totalDollars" passes schema checks and destroys your data:
// semantic changes need a NEW field or a new event version, always.

// Migration recipe for a breaking change
1. add the new field alongside the old one; write both
2. update consumers to read new-if-present, fall back to old
3. wait out the consumer deployment + retention window
4. stop writing the old field; later remove it from the schema</pre>
<p><strong>Format choice:</strong> Avro is compact and registry-native (great for Kafka); Protobuf is the same idea with better cross-language tooling and gRPC alignment; JSON Schema is the easiest to read and debug but bigger on the wire and weaker on evolution rules. Whatever you pick, generate the classes from the schema rather than hand-writing DTOs, keep schemas in version control next to the code, and run compatibility checks in CI so a breaking change fails the build, not production.</p>
<div class="key-point">Events are contracts: register versioned schemas, enforce backward compatibility in CI, only add optional fields with defaults, and never repurpose a field's meaning. Expand-then-contract migrations plus generated types keep producers and consumers deployable independently.</div>`,
  },
  {
    q: 'What is Change Data Capture (CDC) and when would you use Debezium?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p><strong>CDC</strong> streams a database's committed changes by tailing its transaction log (Postgres WAL, MySQL binlog) and publishing each insert, update, and delete as an event — no polling, no <code>updated_at</code> queries, no missed rows. <strong>Debezium</strong> is the standard implementation, usually running as a Kafka Connect source. It shines for three jobs: keeping a search index or cache in sync with the source of truth, feeding a data warehouse or analytics pipeline, and moving data during a monolith-to-microservices migration (Strangler Fig) without touching the legacy application. Its two caveats matter in interviews: the events reflect <em>rows</em>, not domain intent (so "OrderCancelled" has to be inferred), and consumers must tolerate at-least-once delivery with occasional re-emitted snapshots.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>CDC</strong> là cách phát ra các thay đổi đã commit của database bằng cách đọc transaction log của nó (WAL của Postgres, binlog của MySQL) rồi publish mỗi insert, update, delete thành một event — không cần polling, không cần truy vấn theo <code>updated_at</code>, không bỏ sót dòng nào. <strong>Debezium</strong> là bản triển khai phổ biến nhất, thường chạy như một source connector của Kafka Connect. Nó rất hợp cho ba việc: giữ search index hoặc cache đồng bộ với nguồn dữ liệu gốc, cấp dữ liệu cho data warehouse/analytics, và di chuyển dữ liệu trong quá trình tách monolith thành microservice (Strangler Fig) mà không phải sửa ứng dụng cũ. Hai điểm cần lưu ý khi đi phỏng vấn: event của CDC phản ánh <em>dòng dữ liệu</em> chứ không phản ánh ý định nghiệp vụ (nên "OrderCancelled" phải tự suy ra), và consumer phải chịu được at-least-once cùng với việc đôi khi snapshot được phát lại.</p></details>
<pre>// The Debezium change event (simplified)
{ "op": "u",                       // c=create, u=update, d=delete, r=snapshot
  "before": { "id": 7, "status": "PENDING" },
  "after":  { "id": 7, "status": "PAID" },
  "source": { "table": "orders", "lsn": 42891, "ts_ms": 1722330000000 },
  "ts_ms": 1722330000123 }
// Topic per table: dbserver1.public.orders

// Why not just poll?
SELECT * FROM orders WHERE updated_at > :last   ❌ misses deletes, misses
// rows updated inside a transaction with an earlier timestamp, hammers the
// DB, and cannot give you the BEFORE image. CDC reads the log, so it sees
// every committed change exactly in commit order.</pre>
<pre>// The three jobs CDC does well
1. Sync a read model: orders table → Kafka → Elasticsearch / Redis
2. Analytics: OLTP → warehouse without nightly batch ETL
3. Migration: legacy monolith DB → events → new service builds its own
   store; flip reads when it is caught up (no legacy code changes)

// And the pattern it makes safe: transactional OUTBOX
// app writes business row + outbox row in ONE transaction
// Debezium tails the outbox table → publishes real DOMAIN events
// → you get intent ("OrderCancelled", with the fields you choose) plus
//   the atomicity guarantee, instead of leaking table structure.</pre>
<p><strong>Operational realities to mention:</strong> Postgres needs <code>wal_level=logical</code> and a replication slot — an unconsumed slot will fill your disk, so monitor lag; the initial <strong>snapshot</strong> of a large table is expensive and re-emits everything; schema changes flow through as new schema versions (pair CDC with a registry); and consumers see raw table shapes, which couples them to your database unless you use the outbox variant. Also plan for ordering: per-table topics are ordered by primary key, not across tables, so cross-table invariants still need care.</p>
<div class="key-point">CDC turns the transaction log into an event stream — reliable, delete-aware, and non-invasive, which is why Debezium is the default tool for read-model sync and monolith migrations. Prefer the outbox variant when consumers should see domain events instead of your table schema, and monitor replication-slot lag.</div>`,
  },
];
