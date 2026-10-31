import type { KmNode } from '../../types';

export const apis: KmNode = {
  title: 'APIs & Communication',
  level: 'intermediate',
  summary:
    'How clients talk to your system: API styles, real-time connections and protecting the API.',
  simple:
    'The API is the menu and the order window of your restaurant. A clear menu and a fair queue keep both cooks and customers happy.',
  points: [
    'Pick an API style that fits the client: REST, GraphQL or gRPC.',
    'Real-time features need a push channel: WebSockets or Server-Sent Events.',
    'Design for retries and abuse: idempotency keys and rate limits.',
  ],
  children: [
    {
      title: 'REST, GraphQL, gRPC',
      level: 'intermediate',
      summary: 'Three common API styles, each good at different things.',
      simple:
        'REST is a fixed menu, GraphQL lets you build your own plate, and gRPC is a fast private line between kitchens.',
      points: [
        'REST: resources + HTTP verbs; simple, cacheable, the default for public APIs.',
        'GraphQL: one endpoint, the client asks for exactly the fields it needs; great for varied UIs.',
        'gRPC: binary, typed contracts (Protobuf), streaming; great between internal services.',
        'See the Microservices topic for sync vs async service-to-service calls.',
      ],
    },
    {
      title: 'Real-time: Polling to WebSockets',
      level: 'intermediate',
      summary: 'Ways for the server to send updates to the client as they happen.',
      simple:
        'Polling is asking "any news?" every few seconds. A WebSocket is an open phone line where either side can speak any time.',
      points: [
        'Short polling: simple, but wasteful and slow to notice changes.',
        'Long polling: the server holds the request until there is news.',
        'Server-Sent Events (SSE): one-way server → client stream over HTTP; easy and auto-reconnects.',
        'WebSockets: two-way, low latency; ideal for chat and games.',
        'Long-lived connections are stateful, so you need a way to route messages to the right server (pub/sub).',
      ],
    },
    {
      title: 'API Design Essentials',
      level: 'intermediate',
      summary: 'Small decisions that make an API easy to use and safe to evolve.',
      simple:
        'A good API is like good road signs: clear names, no surprises, and old signs keep working.',
      points: [
        'Paginate lists; prefer cursor (keyset) pagination for large or changing data.',
        'Return clear error codes and messages; use HTTP status codes correctly.',
        'Version or evolve carefully: add fields, never silently change meaning.',
        'Make writes idempotent with an <code>Idempotency-Key</code> header so retries are safe.',
      ],
      detail: `<pre><code>app.post('/payments', async (req, res) =&gt; {
  const key = req.get('Idempotency-Key');
  const saved = await store.get(key);
  if (saved) return res.status(saved.status).json(saved.body); // replay

  const result = await charge(req.body);
  await store.set(key, { status: 201, body: result }, { ttlHours: 24 });
  res.status(201).json(result);
});</code></pre>`,
    },
    {
      title: 'Rate Limiting Algorithms',
      level: 'advanced',
      summary: 'Ways to cap how many requests a client may send in a time window.',
      points: [
        'Token bucket: tokens refill at a steady rate; allows short bursts. Most common.',
        'Leaky bucket: requests drain at a fixed rate; smooths traffic.',
        'Fixed window: count per minute; simple but allows bursts at window edges.',
        'Sliding window log/counter: fairer, a bit more memory or math.',
        'Distributed limits need a shared counter (often Redis) and return HTTP 429 with <code>Retry-After</code>.',
      ],
      detail: `<pre><code>function allow(bucket, now, ratePerSec, capacity) {
  const elapsed = (now - bucket.last) / 1000;
  bucket.tokens = Math.min(capacity, bucket.tokens + elapsed * ratePerSec);
  bucket.last = now;
  if (bucket.tokens &lt; 1) return false;
  bucket.tokens -= 1;
  return true;
}</code></pre>`,
    },
    {
      title: 'Back Pressure',
      level: 'advanced',
      summary:
        'Letting a slow part of the system tell faster parts to slow down instead of being flooded.',
      points: [
        'Bounded queues: when full, reject or block instead of growing forever.',
        'Load shedding: drop low-priority work first under overload.',
        'Return 429/503 early rather than timing out late.',
        'Streams and reactive libraries signal demand ("send me 10 more").',
      ],
    },
  ],
};
