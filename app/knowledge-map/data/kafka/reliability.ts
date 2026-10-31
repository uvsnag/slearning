import type { KmNode } from '../../types';

export const reliability: KmNode = {
  title: 'Delivery & Reliability',
  level: 'advanced',
  summary:
    'Delivery guarantees, ordering, duplicates, retries, dead-letter topics, and keeping Kafka in sync with your database.',
  simple:
    'Networks fail and apps crash. This branch is about making sure every event gets handled: never lost, and never handled twice in a harmful way.',
  children: [
    {
      title: 'Delivery semantics',
      level: 'intermediate',
      summary: 'The three promises: at-most-once, at-least-once and exactly-once.',
      simple:
        'At-most-once: a letter may get lost, but never arrives twice. At-least-once: it never gets lost, but may arrive twice. Exactly-once: it arrives once, which is harder and costs more.',
      children: [
        {
          title: 'At-most-once',
          level: 'intermediate',
          summary:
            'Save the offset before processing (or use acks=0). You may lose data, but never get duplicates.',
          simple: 'Like shouting a message across a room once. If they missed it, too bad.',
          points: ['Fine for metrics or logs, where losing a little is OK.'],
        },
        {
          title: 'At-least-once',
          level: 'intermediate',
          summary:
            'Save the offset after processing, and let the producer retry. Nothing lost, but duplicates can happen.',
          simple:
            'Like a courier who rings again if unsure you got the parcel. You may get it twice.',
          points: [
            'The most common and practical default.',
            'Safe only if your consumer can handle the same event twice (idempotent).',
          ],
        },
        {
          title: 'Exactly-once (EOS)',
          level: 'advanced',
          summary: 'Idempotent producer + transactions + consumers using read_committed.',
          points: [
            'Truly end to end only from Kafka to Kafka (read → process → write, or Kafka Streams exactly_once_v2).',
            'With outside systems: at-least-once + duplicate-safe writes = "effectively once".',
            'Costs: a bit more delay, extra broker work, and trickier error handling.',
          ],
          tip: 'Say "effectively once" when a database, email or payment API is involved. Kafka transactions can’t undo those.',
        },
      ],
    },
    {
      title: 'Idempotent consumers',
      level: 'advanced',
      summary: 'Make handling the same event twice harmless.',
      simple: 'Like a bank that refuses to cash the same cheque number twice.',
      points: [
        'Save processed event IDs (with a unique constraint) in the same DB transaction as the change.',
        'Use upserts (insert or update) with natural keys instead of plain inserts.',
        'Keep a version number and ignore events older than what you already have.',
        'Pass an idempotency key when you call outside APIs.',
      ],
      detail: `<pre><code>@Transactional
public void handle(PaymentEvent e) {
  if (processedRepo.existsById(e.eventId())) return; // seen it already
  accountService.charge(e.accountId(), e.amount());
  processedRepo.save(new ProcessedEvent(e.eventId()));
}</code></pre>`,
    },
    {
      title: 'Ordering guarantees',
      level: 'intermediate',
      summary:
        'Order holds only inside one partition, and only if you keep it all the way through.',
      simple:
        'Kafka keeps the order in each lane. If you later shuffle cars between lanes yourself, the order is gone.',
      points: [
        'Same key → same partition → in order.',
        'Producer: keep idempotence on and max.in.flight ≤ 5 so retries don’t reorder.',
        'Consumer: many threads on one partition break order, unless you split work by key.',
        'Retry topics break order for that key. Plan for it (e.g. park every event of that key).',
        'Adding partitions moves keys around, so order can briefly break.',
      ],
    },
    {
      title: 'Retries & Dead-Letter Topic',
      level: 'advanced',
      summary:
        'Deal with "poison" messages (ones that always fail) without blocking the partition forever.',
      simple:
        'If one letter can’t be read (wrong format), put it in a "problem" box for a human to check, and keep reading the rest.',
      points: [
        'Sort errors: short-lived (DB down → retry with a pause) vs permanent (bad data → dead-letter topic).',
        'Retrying in place keeps order but stalls the whole partition.',
        'Non-blocking: move it to retry topics (orders-retry-1m, orders-retry-10m), then to a DLT.',
        'Put the error reason and original topic, partition and offset in headers.',
        'Build a simple way to inspect and resend DLT messages.',
        'Spring Kafka: DefaultErrorHandler + DeadLetterPublishingRecoverer, or @RetryableTopic.',
      ],
      detail: `<pre><code>@RetryableTopic(attempts = "4", backoff = @Backoff(delay = 60_000))
@KafkaListener(topics = "orders")
public void onOrder(OrderEvent e) {
  orderService.handle(e);
}

@DltHandler
public void onDeadLetter(OrderEvent e) {
  log.error("Gave up on order {}", e.id());
}</code></pre>`,
    },
    {
      title: 'Dual-write & Outbox pattern',
      level: 'expert',
      summary:
        'Saving to the DB and sending to Kafka are two separate steps, so one can work while the other fails.',
      simple:
        'You update your bank balance, then try to text a friend, and your phone dies in between. The outbox writes "please send this text" into the same ledger, and a courier sends it later.',
      points: [
        'Problem: the DB save works but the Kafka send fails (or the other way round). Now they disagree.',
        'Outbox: save the business row AND an outbox row in ONE database transaction.',
        'A relay sends outbox rows to Kafka, by polling the table or with CDC (Debezium outbox router).',
        'The relay is at-least-once, so consumers must handle duplicates.',
        'Another option: send to Kafka first, and update your own DB from that event.',
      ],
      tip: 'A @Transactional method that also calls kafkaTemplate.send() is NOT atomic. Don’t rely on it for consistency.',
    },
    {
      title: 'Data-loss checklist',
      level: 'advanced',
      summary: 'The settings and habits that together stop you losing events.',
      points: [
        'Producer: acks=all, idempotence on, check callback errors, enough delivery.timeout.ms.',
        'Topic: replication.factor=3, min.insync.replicas=2, unclean leader election off.',
        'Consumer: commit after processing. No auto-commit if you process in other threads.',
        'Keep data long enough to survive outages. Watch under-replicated partitions and lag.',
        'Spread copies across racks or zones.',
      ],
    },
  ],
};
