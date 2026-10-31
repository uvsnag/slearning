import type { KmNode } from '../../types';

const caching: KmNode = {
  title: 'Caching',
  level: 'intermediate',
  summary: 'Remember results of slow calls with @Cacheable and serve them from memory next time.',
  simple:
    'Instead of looking up the same phone number every time, you write it on a sticky note. Next time you just read the note.',
  children: [
    {
      title: '@Cacheable & friends',
      level: 'intermediate',
      summary: 'Annotations to read, update and clear cache entries.',
      simple: 'Read the sticky note, rewrite it, or throw it away when the number changes.',
      points: [
        'Turn on with <code>@EnableCaching</code>.',
        '<code>@Cacheable("products")</code>: return the cached value if present, else run and store.',
        '<code>@CachePut</code>: always run and update the cache. <code>@CacheEvict</code>: remove entries.',
        'The key defaults to the method parameters. Set <code>key = "#id"</code> to be explicit.',
      ],
      detail: `<pre><code>@Cacheable(value = "products", key = "#id")
public Product find(long id) { return repo.findById(id).orElseThrow(); }

@CacheEvict(value = "products", key = "#p.id")
public void update(Product p) { repo.save(p); }</code></pre>`,
    },
    {
      title: 'Cache providers',
      level: 'intermediate',
      summary:
        'Where cached data lives: in your app’s memory (Caffeine) or a shared store (Redis).',
      simple:
        'A sticky note on your own desk (fast, only you see it) or on the shared office board (everyone sees it).',
      points: [
        'Without a provider, Boot uses a simple <code>ConcurrentHashMap</code>: no expiry, no size limit.',
        'Caffeine: fast local cache with size and time limits.',
        'Redis: shared by all instances, survives restarts, costs a network hop.',
        'Set <code>spring.cache.type</code> and per-cache time-to-live.',
      ],
    },
    {
      title: 'Caching pitfalls',
      level: 'advanced',
      summary: 'Stale data, self-invocation and caching the wrong things.',
      simple: 'An old sticky note with a wrong number is worse than no note at all.',
      points: [
        'Always set a TTL or eviction. A cache without expiry grows forever and goes stale.',
        'Self-calls skip the cache proxy, like with @Transactional.',
        'Cached objects must not be changed by callers. Return immutable data.',
        'Do not cache per-user secrets in a shared cache by mistake (check your keys).',
      ],
    },
  ],
};

export const asyncMessaging: KmNode = {
  title: 'Async, Messaging & Caching',
  level: 'intermediate',
  summary:
    'Run work in the background, on a schedule, via events or Kafka, and cache slow results.',
  simple:
    'Not every job must be done while the customer waits. Some go in a to-do tray, some happen every night, some are announced on the office speaker.',
  children: [
    {
      title: '@Async',
      level: 'intermediate',
      summary: 'Run a method on another thread so the caller does not wait.',
      simple: 'You hand a letter to an assistant to post, and go back to your work right away.',
      points: [
        'Turn on with <code>@EnableAsync</code>.',
        'Return <code>void</code> or <code>CompletableFuture&lt;T&gt;</code>.',
        'Boot provides a thread pool (<code>spring.task.execution.*</code>). Uses virtual threads when enabled.',
        'Exceptions in <code>void</code> methods are only logged. Add an <code>AsyncUncaughtExceptionHandler</code>.',
        'Proxy-based: self-calls run on the same thread.',
      ],
      detail: `<pre><code>@Async
public CompletableFuture&lt;Report&gt; build(long id) {
  return CompletableFuture.completedFuture(heavyWork(id));
}</code></pre>`,
    },
    {
      title: '@Scheduled',
      level: 'intermediate',
      summary: 'Run a method at a fixed rate, with a fixed delay, or on a cron schedule.',
      simple: 'An alarm clock that wakes a method up every 5 minutes or every night at 2 am.',
      points: [
        'Turn on with <code>@EnableScheduling</code>.',
        '<code>fixedRate</code>: start every N. <code>fixedDelay</code>: wait N after the last run ends.',
        '<code>cron = "0 0 2 * * *"</code>: Spring cron has 6 fields, starting with seconds.',
        'Every app instance runs the job. With several instances, use a lock (e.g. ShedLock).',
      ],
    },
    {
      title: 'Application events',
      level: 'intermediate',
      summary:
        'Publish an event in one bean, react to it in others, without them knowing each other.',
      simple:
        'An announcement on the office speaker: "Order 42 is paid". Whoever cares (email, stock) reacts. The speaker does not know who is listening.',
      points: [
        'Publish with <code>ApplicationEventPublisher.publishEvent(new OrderPaid(id))</code>.',
        'Listen with <code>@EventListener</code> on any bean method.',
        'Events are synchronous and in the same thread by default. Add <code>@Async</code> to change that.',
        'Great for decoupling modules inside one app (see Spring Modulith).',
      ],
    },
    {
      title: '@TransactionalEventListener',
      level: 'advanced',
      summary: 'Run a listener only after the publishing transaction commits.',
      simple: 'Only send the "thank you" email once the payment is really saved, not before.',
      points: [
        'Default phase: <code>AFTER_COMMIT</code>. Also AFTER_ROLLBACK, AFTER_COMPLETION, BEFORE_COMMIT.',
        'If there is no transaction, the event is dropped (unless <code>fallbackExecution = true</code>).',
        'Not durable: a crash after commit loses the event. Use the outbox pattern for must-deliver events.',
      ],
    },
    {
      title: 'Spring for Kafka',
      level: 'intermediate',
      summary: 'KafkaTemplate to send and @KafkaListener to receive, set up by Boot.',
      simple:
        'Spring gives you a ready-made mailbox and postman for Kafka. You just write the letters.',
      points: [
        'Set <code>spring.kafka.bootstrap-servers</code> and serializers. Boot creates the template and factories.',
        '<code>@KafkaListener(topics = "orders", groupId = "billing")</code> on a method.',
        'Error handling: <code>DefaultErrorHandler</code> with retries and a dead-letter topic.',
        'Kafka itself (partitions, offsets, groups) is covered in the Kafka topic.',
      ],
      detail: `<pre><code>@KafkaListener(topics = "orders", groupId = "billing")
void onOrder(OrderEvent event) {
  billing.charge(event);
}

kafkaTemplate.send("orders", order.id(), event);</code></pre>`,
    },
    caching,
  ],
};
