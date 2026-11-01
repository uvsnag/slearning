import type { KmNode } from '../../types';

export const data: KmNode = {
  title: 'Data Management',
  level: 'intermediate',
  summary:
    'Each service owns its data, so you need new patterns for consistency, queries and transactions.',
  simple:
    'Once every shop keeps its own records, you can’t fix a mistake with one big eraser any more. You need agreed steps to keep everyone’s books in line.',
  points: [
    'This is usually the hardest part of microservices.',
    'Patterns here build on each other: database per service → saga → outbox → CQRS → event sourcing.',
  ],
  children: [
    {
      title: 'Database per Service',
      level: 'beginner',
      summary: 'Each service has its own private database that no other service touches.',
      simple:
        'Each shop has its own stock room. If you need something from the bakery’s stock room, you ask the baker, you don’t walk in.',
      points: [
        'Others get the data only through the owning service’s API or events.',
        'You can change your schema without breaking anyone.',
        'Each service can pick the right store: SQL, document DB, cache, search index.',
        'Can be a separate schema on a shared server, as long as access is truly separated.',
        'Joins across services are gone. You need other ways to query (see below).',
      ],
      tip: 'A shared database is the number one way teams end up with a "distributed monolith".',
    },
    {
      title: 'Eventual Consistency',
      level: 'intermediate',
      summary: 'Copies of data may differ for a short time, but they all catch up in the end.',
      simple:
        'You pay by card and your banking app shows the new balance a few seconds later. Briefly out of date, but it gets there.',
      points: [
        'The normal state between services. Plan for it in the UI and business rules.',
        'Show states like "Payment pending" instead of pretending it is done.',
        'Keep the time window short and watch it with metrics.',
        'Keep strong consistency inside one service and one aggregate, where it is cheap.',
      ],
    },
    {
      title: 'CAP Theorem',
      level: 'intermediate',
      summary:
        'When the network splits, a distributed system must choose: stay consistent, or keep answering.',
      simple:
        'Two branches of a shop lose their phone line. Either they stop selling the last item until the line is back (consistent), or both keep selling and maybe sell it twice (available).',
      points: [
        'C = everyone sees the same latest data. A = every request gets an answer. P = it survives network splits.',
        'Network splits will happen, so the real choice is C or A while a split lasts.',
        'CP: refuse some requests rather than risk conflicts (e.g. etcd). AP: keep answering, fix conflicts later (e.g. Cassandra).',
        'PACELC adds: even with no split, you trade latency against consistency.',
        'Between microservices you usually pick availability and live with eventual consistency.',
      ],
      tip: 'Don’t say "pick any 2 of 3". Say "during a network partition you choose consistency or availability".',
    },
    {
      title: 'Why not 2PC?',
      level: 'intermediate',
      summary:
        'Two-phase commit locks data across services, so it is slow, fragile and poorly supported.',
      simple:
        'It’s like making five people hold their breath until all of them agree. If one gets distracted, everyone turns blue.',
      points: [
        '2PC (XA transactions): a coordinator asks all databases to prepare, then to commit.',
        'Locks are held while waiting, so one slow service blocks everyone.',
        'If the coordinator dies mid-way, data can stay locked.',
        'Most brokers, NoSQL stores and HTTP APIs don’t support it at all.',
        'Microservices use sagas instead: a chain of local transactions.',
      ],
    },
    {
      title: 'Querying Across Services',
      level: 'intermediate',
      summary: 'Getting data that lives in several services without a database join.',
      simple:
        'You can’t open everyone’s filing cabinet at once any more. Either you ask each person and combine the answers, or you keep your own photocopies.',
      points: [
        'API composition: one component calls several services and merges the results.',
        'Simple, but slow and fragile if it calls many services per request.',
        'Replicated read model: keep a local copy of other services’ data, updated by their events.',
        'For heavy search or reporting, feed events into a search index or data warehouse.',
      ],
    },
    {
      title: 'Caching',
      level: 'intermediate',
      summary: 'Keep copies of often-read data close by, to cut latency and load on other services.',
      simple:
        'A snack drawer at your desk: you don’t walk to the kitchen every time, but you must throw out old snacks now and then.',
      points: [
        'Cache-aside: check the cache; on a miss, load from the source and store it with a TTL (expiry time).',
        'Local in-memory cache (e.g. Caffeine) is fastest; a shared cache (Redis) is the same for all copies.',
        'Keep it fresh with short TTLs, or evict when the owning service publishes a change event.',
        'Stampede: many copies reload the same expired key at once. Add jitter to TTLs or let one caller reload.',
        'Be careful caching data that must never be stale, like balances or stock.',
      ],
      detail: `<pre><code>@Cacheable(cacheNames = "products", key = "#id")
public ProductDto product(String id) {
  return catalogClient.get(id);          // only called on a cache miss
}

@KafkaListener(topics = "catalog.product-changed")
@CacheEvict(cacheNames = "products", key = "#event.productId()")
public void onChange(ProductChanged event) {}</code></pre>`,
    },
    {
      title: 'Saga',
      level: 'advanced',
      summary:
        'A business process split into local transactions, with "undo" steps if something fails.',
      simple:
        'Booking a trip: flight, then hotel, then car. If the car fails, you cancel the hotel and the flight, step by step.',
      points: [
        'Each step is a local transaction in one service, followed by an event or command.',
        'Each step has a compensating action (cancel, refund) instead of a rollback.',
        'Compensations must be safe to run more than once.',
        'Between steps, others can see half-done work. Use states like PENDING to show it.',
      ],
      children: [
        {
          title: 'Choreography',
          level: 'advanced',
          summary: 'Each service listens for events and decides its own next step. No boss.',
          simple: 'Like dancers who each know their moves and react to the music and each other.',
          points: [
            'Simple for 2–4 steps, no central component.',
            'The flow is spread across services, so it is hard to see and change.',
            'Watch out for cyclic dependencies between services’ events.',
          ],
        },
        {
          title: 'Orchestration',
          level: 'advanced',
          summary: 'A central orchestrator tells each service what to do and tracks progress.',
          simple: 'Like a conductor who points at each musician when it’s their turn.',
          points: [
            'The whole flow is in one place, easy to read, test and monitor.',
            'The orchestrator stores the saga state, so it survives restarts.',
            'Tools: Temporal, Camunda, AWS Step Functions, or your own state machine.',
            'Keep business rules in the services; the orchestrator only coordinates.',
          ],
          detail: `<pre><code>// Orchestrator reacting to replies (simplified)
void on(PaymentFailed e) {
  Saga saga = sagas.find(e.orderId());
  saga.markFailed("payment");
  commands.send(new ReleaseStock(e.orderId()));   // compensate
  commands.send(new RejectOrder(e.orderId(), e.reason()));
}</code></pre>`,
        },
      ],
    },
    {
      title: 'Transactional Outbox',
      level: 'advanced',
      summary: 'Save the event in the same DB transaction as the data, then publish it separately.',
      simple:
        'Instead of posting a letter AND updating your diary (and maybe forgetting one), you write the letter into the diary. A helper later posts every letter it finds there.',
      points: [
        'Solves the "dual write" problem: DB commit succeeds but the message send fails (or the other way round).',
        'Step 1: in one transaction, save the order and an outbox row.',
        'Step 2: a relay reads the outbox and publishes to the broker.',
        'Delivery is at-least-once, so consumers must be idempotent.',
      ],
      detail: `<pre><code>@Transactional
public void placeOrder(Order order) {
  orders.save(order);
  outbox.save(new OutboxEvent("Order", order.id(), "OrderPlaced", toJson(order)));
}
// a separate poller or CDC tool publishes outbox rows to Kafka</code></pre>`,
      tip: 'Never call kafka.send() inside a DB transaction and hope both succeed. That’s exactly the bug the outbox fixes.',
    },
    {
      title: 'Inbox Pattern',
      level: 'advanced',
      summary:
        'Record each incoming message ID in the same transaction as its effect, so duplicates are skipped.',
      simple:
        'A receptionist writes down every parcel’s tracking number. If the same parcel shows up again, she sees it in the book and doesn’t sign for it twice.',
      points: [
        'Inbox table with the message ID as a unique key, written in the same DB transaction as the business change.',
        'Duplicate arrives → the insert fails or the lookup finds it → skip.',
        'The outbox makes sending reliable; the inbox makes receiving safe. Together: "effectively once".',
        'Delete old inbox rows after a while, longer than any possible redelivery.',
      ],
      detail: `<pre><code>@Transactional
public void on(OrderPlaced e) {
  if (!inbox.tryInsert(e.eventId())) return;   // seen it already
  shipping.prepare(e.orderId());
}</code></pre>`,
    },
    {
      title: 'Change Data Capture',
      level: 'advanced',
      summary: 'Read the database’s change log and turn every committed change into an event.',
      points: [
        'Tools like Debezium read the DB’s log (binlog, WAL) and publish to Kafka.',
        'Popular way to relay the outbox table, with no polling.',
        'Also helps when splitting a monolith: stream its changes to new services.',
        'Don’t publish raw table rows as your public contract. Map them to real events.',
      ],
    },
    {
      title: 'CQRS',
      level: 'advanced',
      summary:
        'Command Query Responsibility Segregation: separate models for writing and for reading.',
      simple:
        'A restaurant keeps the kitchen (where orders are made) apart from the menu board (what customers read). Each is designed for its own job.',
      points: [
        'Write side: rich domain model that checks the rules.',
        'Read side: flat views built from events, shaped exactly for each screen.',
        'Reads and writes can scale and be stored differently.',
        'Read views lag behind writes a little (eventual consistency).',
        'Adds moving parts. Use it where reads are complex or heavy, not everywhere.',
      ],
    },
    {
      title: 'Event Sourcing',
      level: 'expert',
      summary: 'Store every change as an event; the current state is rebuilt from that history.',
      simple:
        'Your bank doesn’t just store your balance. It stores every deposit and withdrawal, and the balance is the sum.',
      points: [
        'Full audit trail and the ability to replay history into new views.',
        'Usually paired with CQRS, since the event log is hard to query directly.',
        'Events are forever, so schema changes need upcasters (old → new format converters).',
        'Snapshots avoid replaying thousands of events on every load.',
        'High learning curve. Use it for domains that truly need history (finance, ledgers).',
      ],
      detail: `<pre><code>Account rebuild(List&lt;AccountEvent&gt; history) {
  Account acc = new Account();
  for (AccountEvent e : history) acc.apply(e); // Deposited, Withdrawn, ...
  return acc;
}</code></pre>`,
    },
  ],
};
