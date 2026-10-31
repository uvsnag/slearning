import type { KmNode } from '../../types';

export const resilience: KmNode = {
  title: 'Resilience',
  level: 'intermediate',
  summary: 'Patterns that keep the system working when some services are slow or down.',
  simple:
    'In a chain of services, something is always broken somewhere. Resilience is making sure one flat tyre doesn’t stop the whole bus fleet.',
  points: [
    'Most patterns here are in Resilience4j (Hystrix is retired since 2018).',
    'Spring Framework 7 also adds simple @Retryable and @ConcurrencyLimit in the core.',
    'Combine them: timeout + retry + circuit breaker + bulkhead.',
  ],
  children: [
    {
      title: 'Failure Is Normal',
      level: 'beginner',
      summary: 'Over a network, calls will be slow, fail, or succeed without you knowing.',
      simple:
        'Sending a letter: it may arrive late, get lost, or arrive while the reply gets lost. You must plan for all three.',
      points: [
        'Fallacies of distributed computing: the network is NOT reliable, fast, or free.',
        'A timeout doesn’t tell you if the other side did the work or not.',
        'More services = more things that can break at the same moment.',
        'Design each call with the question "what if this fails?"',
      ],
    },
    {
      title: 'Timeouts',
      level: 'beginner',
      summary: 'Never wait forever: give every remote call a maximum time.',
      simple:
        'If the pizza isn’t here in 45 minutes, you call another place. You don’t wait by the door all night.',
      points: [
        'Many HTTP clients wait forever (or minutes) by default. Always set connect and read timeouts.',
        'A hanging call holds a thread and memory; enough of them take your service down.',
        'Base timeouts on the callee’s real latency, e.g. a bit above its p99.',
        'Pass a deadline along the chain so downstream calls don’t outlive the original request.',
      ],
      detail: `<pre><code>var factory = new SimpleClientHttpRequestFactory();
factory.setConnectTimeout(Duration.ofSeconds(1));
factory.setReadTimeout(Duration.ofSeconds(2));
RestClient rest = RestClient.builder().requestFactory(factory).build();</code></pre>`,
    },
    {
      title: 'Retries with Backoff',
      level: 'intermediate',
      summary:
        'Try again after short, growing, slightly random waits, but only for safe operations.',
      simple:
        'If a line is busy, you call again in a minute, then in two, then in four. You don’t hit redial 100 times a second.',
      points: [
        'Only retry temporary errors: timeouts, 503, connection reset. Not 400 or 404.',
        'Exponential backoff: wait 100 ms, 200 ms, 400 ms… Add jitter (randomness) so clients don’t retry in sync.',
        'Only retry idempotent operations, or use an idempotency key.',
        'Limit attempts (e.g. 3) and the total time.',
      ],
      detail: `<pre><code>RetryConfig config = RetryConfig.custom()
    .maxAttempts(3)
    .intervalFunction(IntervalFunction.ofExponentialRandomBackoff(100, 2.0))
    .retryExceptions(IOException.class, TimeoutException.class)
    .build();
Retry retry = Retry.of("inventory", config);
Stock s = Retry.decorateSupplier(retry, () -&gt; inventory.get(sku)).get();</code></pre>`,
      tip: 'Retry at one layer only. If gateway, service and client library all retry 3 times, one failure becomes 27 calls.',
    },
    {
      title: 'Circuit Breaker',
      level: 'intermediate',
      summary: 'Stop calling a failing service for a while, and fail fast instead.',
      simple:
        'Like the fuse box in your house: when too much goes wrong, it trips and cuts the power, so the damage doesn’t spread. Later you try switching it back on.',
      points: [
        'Closed: calls go through, failures are counted.',
        'Open: too many failures → calls fail at once, without touching the sick service.',
        'Half-open: after a wait, a few test calls decide whether to close again.',
        'Gives the failing service time to recover and frees your threads.',
        'Always pair with a fallback or a clear error.',
      ],
      detail: `<pre><code>@CircuitBreaker(name = "pricing", fallbackMethod = "cachedPrice")
public Price price(String sku) {
  return pricingClient.get(sku);
}

private Price cachedPrice(String sku, Throwable t) {
  return priceCache.last(sku);   // degrade gracefully
}</code></pre>`,
    },
    {
      title: 'Bulkhead',
      level: 'intermediate',
      summary:
        'Give each dependency its own limited pool, so one slow one can’t eat all resources.',
      simple:
        'Ships have walls splitting the hull into sections. If one section floods, the others stay dry and the ship floats.',
      points: [
        'Limit concurrent calls per dependency (semaphore) or give each its own thread pool.',
        'If the Recommendations service hangs, checkout still has free threads.',
        'Also applies to infrastructure: separate connection pools, separate clusters for critical paths.',
        'Resilience4j: <code>@Bulkhead(name = "recommendations")</code>.',
      ],
    },
    {
      title: 'Rate Limiting',
      level: 'intermediate',
      summary: 'Cap how many requests a client can make in a time window.',
      simple:
        'A club bouncer lets in only so many people per minute, so the dance floor never gets dangerously packed.',
      points: [
        'Protects services from overload, abuse and runaway clients.',
        'Token bucket: tokens refill at a steady rate; each request spends one.',
        'Usually done at the gateway, per user or per API key (e.g. Redis-backed counters).',
        'Return 429 Too Many Requests with a <code>Retry-After</code> header.',
        'Load shedding: when overloaded, drop low-priority work first.',
      ],
    },
    {
      title: 'Fallbacks',
      level: 'intermediate',
      summary: 'A plan B when a dependency fails: cached data, a default, or a reduced feature.',
      simple: 'The coffee machine is broken, so the café offers tea instead of closing the shop.',
      points: [
        'Show cached prices, hide the recommendations box, queue the email for later.',
        'Decide per feature: what can be skipped, what must fail loudly?',
        'Never fake success for money or stock. A wrong "OK" is worse than an error.',
        'Test fallbacks. They are rarely used, so they are often broken.',
      ],
    },
    {
      title: 'Idempotency',
      level: 'intermediate',
      summary: 'Doing the same request twice has the same effect as doing it once.',
      simple:
        'Pressing the lift button five times still calls one lift. Your "charge card" endpoint should work the same way.',
      points: [
        'Retries and at-least-once messaging WILL send duplicates. Plan for it.',
        'GET, PUT and DELETE should be idempotent by design. POST usually isn’t.',
        'Client sends an <code>Idempotency-Key</code>; the server stores the result and replays it for repeats.',
        'For messages, store processed message IDs and skip ones you’ve seen.',
      ],
      detail: `<pre><code>app.post('/payments', async (req, res) =&gt; {
  const key = req.get('Idempotency-Key');
  const done = await store.get(key);
  if (done) return res.status(done.status).json(done.body); // replay
  const result = await payments.charge(req.body);
  await store.save(key, { status: 201, body: result });
  res.status(201).json(result);
});</code></pre>`,
      tip: 'Save the key and the business change in the same transaction, or two parallel duplicates can both slip through.',
    },
    {
      title: 'Cascading Failures',
      level: 'expert',
      summary: 'How one slow service drags down everything that calls it, and how to stop it.',
      points: [
        'Slow is worse than down: callers pile up waiting threads until they fall over too.',
        'Retry storms: everyone retries at once and keeps a recovering service down.',
        'Defences: short timeouts, retry budgets (e.g. retries ≤ 10% of traffic), circuit breakers, load shedding.',
        'Back-pressure: let a busy service say "slow down" instead of queueing forever.',
        'Chaos engineering: break things on purpose in a controlled way to find weak spots.',
      ],
      tip: 'Senior interview answer: "Fail fast, isolate, degrade gracefully, and recover automatically."',
    },
  ],
};
