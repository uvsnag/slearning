import type { KmNode } from '../../types';

export const communication: KmNode = {
  title: 'Communication',
  level: 'beginner',
  summary: 'How services talk: request/response with REST or gRPC, or async messages.',
  simple:
    'Services can phone each other and wait for an answer (sync), or leave a message and carry on (async). Both are useful; mixing them wisely is the skill.',
  children: [
    {
      title: 'Sync vs Async',
      level: 'beginner',
      summary: 'Sync = caller waits for the answer. Async = caller sends a message and moves on.',
      simple:
        'Sync is a phone call: both people must be there at the same time. Async is a text message: the other person reads it when they can.',
      points: [
        'Sync (HTTP, gRPC): simple, immediate answer, but the caller fails if the callee is down.',
        'Async (queues, events): services do not need to be up at the same time.',
        'Async absorbs traffic spikes: messages wait in the broker until consumers catch up.',
        'Async makes the flow harder to follow and the data only eventually consistent.',
      ],
      tip: 'Rule of thumb: use sync when the user needs the answer right now, async for everything that can happen a moment later.',
    },
    {
      title: 'REST over HTTP',
      level: 'beginner',
      summary: 'The most common style: resources as URLs, HTTP verbs, JSON bodies.',
      simple:
        'Like ordering at a counter with a fixed menu: GET to look, POST to order, PUT to change, DELETE to cancel.',
      points: [
        'Easy to debug and works everywhere, including browsers.',
        'Use proper status codes: 201 Created, 404 Not Found, 409 Conflict, 503 Unavailable.',
        'Describe the API with OpenAPI so clients can generate code.',
        'In Spring use <code>RestClient</code> or HTTP interface clients (Spring 6.1+). OpenFeign is now feature-complete.',
      ],
      detail: `<pre><code>@HttpExchange("/customers")
interface CustomerClient {
  @GetExchange("/{id}")
  CustomerDto get(@PathVariable String id);
}

// Spring Boot: build the client from a RestClient
RestClient rest = RestClient.create("http://customer-service");
CustomerClient client = HttpServiceProxyFactory
    .builderFor(RestClientAdapter.create(rest)).build()
    .createClient(CustomerClient.class);</code></pre>`,
    },
    {
      title: 'gRPC',
      level: 'intermediate',
      summary: 'A fast RPC framework using HTTP/2 and Protocol Buffers (a compact binary format).',
      simple:
        'Instead of writing letters in plain English (JSON), both sides agree on a short code book (.proto file) and send compact coded messages.',
      points: [
        'Contract-first: a <code>.proto</code> file generates client and server code in many languages.',
        'Smaller and faster than JSON, with built-in streaming in both directions.',
        'Great for internal service-to-service calls with high traffic.',
        'Browsers can’t call it directly. Use gRPC-Web, Connect or a REST gateway.',
        'Always set a deadline (timeout) on every call.',
      ],
    },
    {
      title: 'Async Messaging',
      level: 'intermediate',
      summary: 'Services exchange messages through a broker like Kafka or RabbitMQ.',
      simple:
        'A post office between services. The sender drops a letter and leaves; the post office keeps it until the receiver picks it up.',
      points: [
        'Queue (point-to-point): each message is handled by one consumer. Good for jobs.',
        'Publish/subscribe: every interested service gets its own copy. Good for events.',
        'Most brokers deliver "at least once", so consumers must handle duplicates.',
        'Kafka keeps events as a replayable log. See the Kafka topic for details.',
      ],
      detail: `<pre><code>// Spring Kafka: publish an event, another service reacts
kafka.send("orders.events", order.id(), new OrderPlaced(order.id(), order.total()));

@KafkaListener(topics = "orders.events", groupId = "shipping")
void on(OrderPlaced event) {
  shipping.prepare(event.orderId());
}</code></pre>`,
    },
    {
      title: 'Commands vs Events',
      level: 'intermediate',
      summary:
        'A command asks one service to do something; an event tells everyone something happened.',
      simple:
        '"Please ship order 42" is a command to one person. "Order 42 was paid" is news on a notice board, for anyone who cares.',
      points: [
        'Commands: imperative names (<code>ChargeCard</code>), one receiver, can be rejected.',
        'Events: past tense (<code>PaymentCompleted</code>), any number of readers, a fact that can’t be undone.',
        'Events keep the sender unaware of who listens, so coupling is low.',
        'Too many events with hidden reactions can make the business flow hard to see.',
      ],
    },
    {
      title: 'Choosing a Style',
      level: 'intermediate',
      summary: 'Trade-offs between REST, gRPC and messaging for a given interaction.',
      points: [
        'Public or browser-facing API → REST (or GraphQL at the edge).',
        'Internal, high-traffic, typed calls → gRPC.',
        'Work that can finish later, or many interested services → async events.',
        'Long chains of sync calls multiply latency and failure. Prefer events for fan-out.',
        'Pick one or two standard styles for the whole company, not five.',
      ],
      tip: 'If service A needs B’s data on every request, consider keeping a local copy of that data, updated by B’s events.',
    },
    {
      title: 'API Versioning',
      level: 'advanced',
      summary:
        'Changing an API without breaking the clients that already use it, so services deploy independently.',
      simple:
        'Like renovating a shop while it stays open: old customers must still find the door while the new entrance is built.',
      children: [
        {
          title: 'Backward Compatibility',
          level: 'advanced',
          summary: 'New versions of a service still work for old clients.',
          points: [
            'Safe: add new optional fields, new endpoints, new enum values (if clients tolerate them).',
            'Breaking: remove or rename fields, change types, make an optional field required.',
            'Tolerant reader: clients ignore fields they do not know and use defaults for missing ones.',
            'Postel’s law: be strict in what you send, liberal in what you accept.',
          ],
          detail: `<pre><code>// Jackson: don't fail when the server adds new fields
@JsonIgnoreProperties(ignoreUnknown = true)
record CustomerDto(String id, String name) {}</code></pre>`,
          tip: 'Most "versioning" problems disappear if every change is additive and every client is a tolerant reader.',
        },
        {
          title: 'Versioning Strategies',
          level: 'advanced',
          summary: 'Ways to run a breaking change side by side with the old API.',
          points: [
            'URL path: <code>/v2/orders</code>. Most common and easy to see and route.',
            'Header or media type: <code>Accept: application/vnd.shop.v2+json</code>. Cleaner URLs, harder to test by hand.',
            'Version only on breaking changes, not on every release.',
            'Run old and new versions side by side until all clients have moved.',
          ],
        },
        {
          title: 'Evolving Events',
          level: 'advanced',
          summary:
            'Event formats need the same care, because old events stay in logs for a long time.',
          points: [
            'Use a schema (Avro, Protobuf, JSON Schema) and check compatibility in CI.',
            'A schema registry rejects breaking changes before they reach production (see the Kafka topic).',
            'Consumers may read very old events on replay. Keep them readable.',
            'Big breaking change → publish a new event type or topic (<code>order.events.v2</code>).',
          ],
        },
        {
          title: 'Deprecation & Sunset',
          level: 'expert',
          summary: 'Retiring an old API version safely and on a clear schedule.',
          points: [
            'Announce early, with a date, and tell clients what to move to.',
            'Send <code>Deprecation</code> and <code>Sunset</code> HTTP headers (RFC 9745, RFC 8594).',
            'Measure who still calls the old version before you switch it off.',
            'Consumer-driven contract tests tell you exactly which clients use which fields.',
          ],
        },
      ],
    },
  ],
};
