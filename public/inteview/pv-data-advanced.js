// Interview data: system-design, microservices, security-jwt, design-patterns, algorithms
// Auto-generated from pv.html
(function () {
  (window.__pvTopics = window.__pvTopics || []).push(
    {
      id: 'system-design',
      name: 'System Design',
      icon: '🏗️',
      questions: [
        {
          q: 'What is System Design and why does it matter in interviews?',
          difficulty: 'easy',
          a: `<p><strong>System Design</strong> is the process of defining the architecture, components, and data flow of a large-scale software system. It answers: <em>"How would you build X to handle millions of users?"</em></p>
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
          a: `<p><strong>Vertical Scaling (Scale Up)</strong> = Make one machine more powerful (more CPU, RAM).</p>
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
          a: `<p>A <strong>Load Balancer</strong> distributes incoming traffic across multiple servers so no single server gets overwhelmed.</p>
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
<p><strong>Example:</strong> When you visit google.com, your request hits a load balancer that routes you to one of thousands of servers — you never know which one.</p>
<div class="key-point">Popular tools: <strong>Nginx</strong>, <strong>HAProxy</strong>, <strong>AWS ALB/ELB</strong>. Always use a load balancer when you have multiple servers.</div>`,
        },
        {
          q: 'What is Caching and why is it important in system design?',
          difficulty: 'easy',
          a: `<p><strong>Caching</strong> = storing frequently used data in a fast-access location so you don't have to fetch it from the slow source every time.</p>
<p><strong>Analogy:</strong> Instead of going to the library every time you need a recipe, you photocopy your favorite recipes and keep them on your fridge (cache). Much faster!</p>
<pre>Without cache:  User → Server → Database (slow, every time)
With cache:     User → Server → Cache (fast!) → DB only if not in cache</pre>
<p><strong>Types of caching:</strong></p>
<ul>
<li><strong>Client-side</strong>: Browser cache (images, CSS, JS files)</li>
<li><strong>CDN cache</strong>: Static files served from servers near the user</li>
<li><strong>Application cache</strong>: Redis / Memcached storing DB query results</li>
<li><strong>Database cache</strong>: Query cache built into the DB</li>
</ul>
<p><strong>Example:</strong> Instagram caches popular user profiles in Redis. Instead of hitting the database for Cristiano Ronaldo's profile 1 million times/second, they read it from cache in <strong>&lt;1ms</strong>.</p>
<div class="key-point">Cache is not free — you must handle <strong>cache invalidation</strong> (when the real data changes, the cache must be updated). This is one of the hardest problems in CS!</div>`,
        },
        {
          q: 'What is a CDN (Content Delivery Network)?',
          difficulty: 'easy',
          a: `<p>A <strong>CDN</strong> is a network of servers distributed around the world that serve static content (images, videos, CSS, JS) from a location <strong>close to the user</strong>.</p>
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
          a: `<p>A <strong>database index</strong> is a data structure (usually B-Tree or Hash) that helps the database find rows quickly without scanning every row.</p>
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
          a: `<p><strong>SQL (Relational)</strong>: Structured tables with rows/columns, enforces schema, uses SQL language. E.g., MySQL, PostgreSQL.</p>
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
<table><tr><th>Use SQL when</th><th>Use NoSQL when</th></tr>
<tr><td>Data has clear relationships (orders ↔ users)</td><td>Data structure changes often</td></tr>
<tr><td>Need ACID transactions (banking)</td><td>Need massive horizontal scaling</td></tr>
<tr><td>Complex queries with JOINs</td><td>High write throughput (IoT, logs)</td></tr></table>
<div class="key-point">Many systems use <strong>both</strong>: SQL for core data (users, payments) + NoSQL for flexible data (user activity logs, product catalogs).</div>`,
        },
        {
          q: 'What is Database Sharding?',
          difficulty: 'medium',
          a: `<p><strong>Sharding</strong> = splitting a large database into smaller pieces (shards), each stored on a different server.</p>
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
          a: `<p><strong>Replication</strong> = keeping copies of the same database on multiple servers.</p>
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
          a: `<p>The <strong>CAP Theorem</strong> states that a distributed system can only guarantee <strong>2 out of 3</strong> properties at the same time:</p>
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
          a: `<p>An <strong>API Gateway</strong> is a single entry point that sits between clients and your backend microservices. All requests go through it first.</p>
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
          a: `<p>A <strong>Message Queue</strong> is a system where producers send messages and consumers process them asynchronously. The queue holds messages until they are processed.</p>
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
<p><strong>Example:</strong> When you upload a video to YouTube, it responds instantly with "Processing...". The actual encoding runs asynchronously via a message queue across many servers.</p>
<div class="key-point">Popular tools: <strong>RabbitMQ</strong>, <strong>Apache Kafka</strong>, <strong>AWS SQS</strong>, <strong>Redis Streams</strong>.</div>`,
        },
        {
          q: 'What is the difference between Monolith and Microservices architecture?',
          difficulty: 'medium',
          a: `<p><strong>Monolith</strong> = entire application is one big deployable unit.</p>
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
          a: `<p><strong>Rate Limiting</strong> = controlling how many requests a user/client can make in a given time window.</p>
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
          a: `<p><strong>Consistent Hashing</strong> is a technique for distributing data across servers such that when a server is added or removed, only a minimal amount of data needs to move.</p>
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
          a: `<p>A URL shortener converts long URLs to short ones (e.g., <code>bit.ly/abc123</code>) and redirects users to the original URL.</p>
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
          a: `<p>A real-time chat system requires instant message delivery, presence (online/offline), and message persistence.</p>
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
          a: `<p>A <strong>Reverse Proxy</strong> sits between clients and servers, forwarding client requests to the appropriate backend server.</p>
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
          a: `<p>These are three ways for a server to push data to clients in real-time:</p>
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
          a: `<p><strong>REST</strong>: Multiple endpoints, each returns a fixed data shape. <strong>GraphQL</strong>: One endpoint, client specifies exactly what data it wants.</p>
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
          a: `<p><strong>ACID</strong> ensures database transactions are reliable:</p>
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
          a: `<p><strong>Eventual Consistency</strong> = after a write, all replicas will <em>eventually</em> return the latest value, but not immediately.</p>
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
          a: `<p>A news feed shows a personalized list of posts from people you follow, ranked and ordered.</p>
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
          a: `<p>A <strong>Circuit Breaker</strong> prevents your service from repeatedly calling a failing service. It "trips" after too many failures and returns errors immediately.</p>
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
          a: `<p><strong>Event-Driven Architecture (EDA)</strong> = services communicate by producing and consuming events instead of directly calling each other.</p>
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
          a: `<p><strong>Authentication (AuthN)</strong> = "Who are you?" → Verifying identity (login).</p>
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
          a: `<p><strong>OAuth 2.0</strong> is an authorization framework that lets a third-party app access your data without giving it your password.</p>
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
          a: `<p>A notification system sends messages to users through multiple channels: push notifications, SMS, email, and in-app.</p>
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
          q: 'What is Database Connection Pooling?',
          difficulty: 'easy',
          a: `<p><strong>Connection Pooling</strong> = keeping a pool of reusable database connections instead of creating a new one for every request.</p>
<p><strong>Analogy:</strong> Calling a taxi company. Without pooling, you buy a new car for every trip and sell it after. With pooling, the company has a fleet of taxis. When you need a ride, you grab an available taxi. When done, you return it to the pool for someone else.</p>
<pre>Without pooling:
  Request 1 → Open connection → Query → Close connection (200ms overhead)
  Request 2 → Open connection → Query → Close connection (200ms overhead)
  ...slow and wasteful!

With pooling:
  App starts → Creates pool of 20 connections
  Request 1 → Borrow connection → Query → Return to pool (2ms)
  Request 2 → Borrow connection → Query → Return to pool (2ms)
  ...fast and efficient!</pre>
<p><strong>Configuration:</strong></p>
<ul>
<li><strong>Min pool size</strong>: Keep at least N connections ready (e.g., 5)</li>
<li><strong>Max pool size</strong>: Never exceed N connections (e.g., 20)</li>
<li><strong>Idle timeout</strong>: Close idle connections after N minutes</li>
<li><strong>Connection timeout</strong>: How long to wait for an available connection</li>
</ul>
<p><strong>Example:</strong> A Spring Boot app with HikariCP (default pool) handles 1000 requests/second with just 20 database connections, because each query only takes a few milliseconds.</p>
<div class="key-point">Popular connection pools: <strong>HikariCP</strong> (Java, fastest), <strong>c3p0</strong>, <strong>DBCP</strong>. Set max pool size = (CPU cores * 2) + number of disks as a starting point.</div>`,
        },
        {
          q: 'What is the Single Point of Failure (SPOF) and how do you eliminate it?',
          difficulty: 'easy',
          a: `<p>A <strong>Single Point of Failure (SPOF)</strong> is any component whose failure would bring down the entire system.</p>
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
          a: `<p>A rate limiter service controls request traffic to protect backend services from overload and abuse.</p>
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
          a: `<p>A <strong>Bloom Filter</strong> is a space-efficient data structure that tells you:</p>
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
          a: `<p>In microservices, a single business operation may span multiple services/databases. You can't use a simple database transaction because each service has its own database.</p>
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
          a: `<p><strong>CQRS</strong> = use different models for reading and writing data.</p>
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
          a: `<p>A cloud file storage system needs to handle file upload/download, syncing across devices, sharing, and versioning.</p>
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
      ],
    },

    // ───────────────────────── ALGORITHMS & DATA STRUCTURES ─────────────────────────
    // ========================= MICROSERVICES =========================,
    {
      id: 'microservices',
      name: 'Microservices',
      icon: 'MS',
      questions: [
        {
          q: 'What is microservice architecture and when should you choose it?',
          difficulty: 'medium',
          a: `<p><strong>Microservice architecture</strong> breaks a system into small services, each owning one business capability and deployed independently.</p>
<ul>
<li>Choose it for large systems, multiple teams, and independent release cycles.</li>
<li>Avoid it for small apps or early-stage products where simplicity matters more.</li>
</ul>
<div class="key-point">Microservices help scaling teams and deployments, but they add network, monitoring, and operational complexity.</div>`,
        },
        {
          q: 'What is the difference between a monolith and microservices?',
          difficulty: 'easy',
          a: `<ul>
<li><strong>Monolith</strong>: one deployable unit, usually simpler development and debugging.</li>
<li><strong>Microservices</strong>: many deployable units, better isolation and independent scaling.</li>
</ul>
<pre>Monolith -> one app, one deployment
Microservices -> gateway + many services</pre>
<div class="key-point">A well-designed monolith is usually the safest starting point. Extract microservices only when the pressure is real.</div>`,
        },
        {
          q: 'What is service discovery in microservices?',
          difficulty: 'medium',
          a: `<p><strong>Service discovery</strong> lets services find healthy instances dynamically instead of hard-coding IP addresses.</p>
<ul>
<li>Client-side discovery: client asks registry.</li>
<li>Server-side discovery: gateway or load balancer resolves the target.</li>
</ul>
<div class="key-point">Kubernetes Services and DNS solve this for many modern systems.</div>`,
        },
        {
          q: 'What is the difference between synchronous and asynchronous communication between services?',
          difficulty: 'medium',
          a: `<ul>
<li><strong>Synchronous</strong>: REST or gRPC, caller waits for response.</li>
<li><strong>Asynchronous</strong>: Kafka, RabbitMQ, SQS, caller publishes and continues.</li>
</ul>
<pre>Synchronous: Order -> Payment
Asynchronous: Order -> event bus -> Payment, Email</pre>
<div class="key-point">Use synchronous for immediate answers, asynchronous for decoupling and background workflows.</div>`,
        },
        {
          q: 'Why is database-per-service important in microservices?',
          difficulty: 'hard',
          a: `<p>Each service should own its own data so schema changes and deployments stay independent.</p>
<ul>
<li>Prevents tight coupling through shared tables.</li>
<li>Clarifies ownership and boundaries.</li>
<li>Makes cross-service transactions harder.</li>
</ul>
<div class="key-point">If multiple services directly write the same tables, you usually have a distributed monolith.</div>`,
        },
        {
          q: 'What is an API Gateway and why is it useful in microservices?',
          difficulty: 'easy',
          a: `<p>An <strong>API Gateway</strong> is the single entry point for clients.</p>
<ul>
<li>Routes requests to services.</li>
<li>Can handle auth, rate limiting, TLS termination, and aggregation.</li>
<li>Hides internal service topology from clients.</li>
</ul>
<div class="key-point">A gateway simplifies clients, but it should not become a giant business-logic bottleneck.</div>`,
        },
        {
          q: 'What is the BFF pattern in microservices?',
          difficulty: 'medium',
          a: `<p><strong>Backend for Frontend</strong> creates a dedicated backend per client type such as web or mobile.</p>
<pre>Mobile App -> Mobile BFF -> services
Web App -> Web BFF -> services</pre>
<ul>
<li>Reduces over-fetching.</li>
<li>Keeps UI-specific orchestration out of core services.</li>
</ul>
<div class="key-point">BFF is especially useful when web and mobile need different payload shapes or different performance trade-offs.</div>`,
        },
        {
          q: 'What is idempotency and why is it important in distributed systems?',
          difficulty: 'hard',
          a: `<p>An operation is <strong>idempotent</strong> if repeating it produces the same result as doing it once.</p>
<pre>POST /payments with same idempotency key
-> same outcome
-> no duplicate charge</pre>
<div class="key-point">Retries are normal in distributed systems. Idempotency is what keeps retries safe.</div>`,
        },
        {
          q: 'What is distributed tracing and why do correlation IDs matter?',
          difficulty: 'medium',
          a: `<p><strong>Distributed tracing</strong> follows one request across many services.</p>
<ul>
<li>Trace ID links the full request journey.</li>
<li>Span describes one step in that journey.</li>
<li>Correlation IDs make logs searchable across services.</li>
</ul>
<div class="key-point">Without shared trace or correlation IDs, debugging latency and failures in microservices becomes painful.</div>`,
        },
        {
          q: 'What is the Strangler Fig pattern in microservice migration?',
          difficulty: 'hard',
          a: `<p>The <strong>Strangler Fig</strong> pattern replaces parts of a monolith gradually instead of rewriting everything at once.</p>
<pre>Route /reports -> new service
Leave other routes in monolith
Extract more features over time</pre>
<div class="key-point">Incremental extraction is safer than a big-bang rewrite.</div>`,
        },
        {
          q: 'What is the Transactional Outbox pattern?',
          difficulty: 'hard',
          a: `<p><strong>Transactional Outbox</strong> keeps database updates and event publication consistent.</p>
<pre>1. Save business row
2. Save outbox row in same DB transaction
3. Worker publishes event later</pre>
<div class="key-point">This solves the bug where DB commit succeeds but event publish fails.</div>`,
        },
        {
          q: 'What is the Saga pattern?',
          difficulty: 'hard',
          a: `<p><strong>Saga</strong> manages distributed business workflows using local transactions plus compensating actions.</p>
<ul>
<li><strong>Choreography</strong>: services react to events.</li>
<li><strong>Orchestration</strong>: a coordinator drives each step.</li>
</ul>
<div class="key-point">Use Saga instead of distributed ACID transactions across service databases.</div>`,
        },
        {
          q: 'What is CQRS and when does it help in microservices?',
          difficulty: 'hard',
          a: `<p><strong>CQRS</strong> separates write models from read models.</p>
<ul>
<li>Writes focus on business rules and consistency.</li>
<li>Reads can be denormalized and optimized for speed.</li>
</ul>
<div class="key-point">CQRS helps when read and write workloads have very different shapes, but it adds complexity and eventual consistency.</div>`,
        },
        {
          q: 'What is a service mesh and when would you use one?',
          difficulty: 'hard',
          a: `<p>A <strong>service mesh</strong> moves cross-cutting communication concerns out of application code.</p>
<ul>
<li>Common features: mTLS, retries, traffic splitting, observability.</li>
<li>Often implemented with sidecars or ambient networking.</li>
</ul>
<div class="key-point">Use a service mesh when you have enough services that per-service networking logic becomes hard to manage consistently.</div>`,
        },
        {
          q: 'What resilience patterns are commonly used in microservices?',
          difficulty: 'hard',
          a: `<ul>
<li>Timeout</li>
<li>Retry</li>
<li>Circuit Breaker</li>
<li>Bulkhead</li>
<li>Fallback</li>
</ul>
<pre>If recommendation service is slow:
timeout -> open circuit -> serve page without recommendations</pre>
<div class="key-point">Retries without timeouts, limits, and idempotency can make outages worse.</div>`,
        },
      ],
    },

    // ========================= SECURITY & JWT =========================,
    {
      id: 'security-jwt',
      name: 'Security & JWT',
      icon: 'SJ',
      questions: [
        {
          q: 'What is JWT and what are its three parts?',
          difficulty: 'easy',
          a: `<p><strong>JWT</strong> has three parts: Header, Payload, Signature.</p>
<pre>header.payload.signature</pre>
<ul>
<li>Header: algorithm and type</li>
<li>Payload: claims</li>
<li>Signature: integrity and trust</li>
</ul>
<div class="key-point">JWT is encoded, not encrypted, unless extra encryption is added separately.</div>`,
        },
        {
          q: 'What is the difference between access tokens and refresh tokens?',
          difficulty: 'medium',
          a: `<ul>
<li><strong>Access token</strong>: short-lived, used on API calls.</li>
<li><strong>Refresh token</strong>: longer-lived, used to mint new access tokens.</li>
</ul>
<div class="key-point">Short-lived access tokens reduce risk. Refresh tokens need stronger protection.</div>`,
        },
        {
          q: 'Where should JWT be stored in the browser?',
          difficulty: 'hard',
          a: `<ul>
<li>HttpOnly Secure SameSite cookie: safer against XSS theft.</li>
<li>Memory: safest from persistent storage theft, but lost on refresh.</li>
<li>localStorage: simple, but exposed to XSS.</li>
</ul>
<div class="key-point">A strong default answer is short-lived access tokens plus HttpOnly cookies for refresh tokens.</div>`,
        },
        {
          q: 'How do you validate JWT securely on the backend?',
          difficulty: 'hard',
          a: `<ul>
<li>Verify signature.</li>
<li>Check expiration and not-before.</li>
<li>Validate issuer and audience.</li>
<li>Only allow expected algorithms.</li>
</ul>
<div class="key-point">Never trust a decoded token unless the signature and claims are fully verified.</div>`,
        },
        {
          q: 'What are common JWT security vulnerabilities?',
          difficulty: 'hard',
          a: `<ul>
<li>Weak signing secrets</li>
<li>Long token lifetime</li>
<li>Bad storage in XSS-prone apps</li>
<li>Sensitive data in payload</li>
<li>Missing revocation strategy</li>
</ul>
<div class="key-point">Most JWT problems come from implementation mistakes, not from the token format itself.</div>`,
        },
        {
          q: 'How do you handle logout or revocation with JWT?',
          difficulty: 'hard',
          a: `<p>JWT is often called stateless, but real logout usually needs some state.</p>
<ul>
<li>Use short-lived access tokens.</li>
<li>Store refresh tokens server-side so they can be revoked.</li>
<li>Optionally blacklist risky access tokens until expiry.</li>
</ul>
<div class="key-point">Immediate logout everywhere usually requires a revocation store.</div>`,
        },
        {
          q: 'What is the difference between OAuth 2.0 and JWT?',
          difficulty: 'medium',
          a: `<ul>
<li><strong>OAuth 2.0</strong>: authorization framework.</li>
<li><strong>JWT</strong>: token format.</li>
</ul>
<div class="key-point">OAuth can issue JWT tokens, but JWT can also be used outside OAuth.</div>`,
        },
        {
          q: 'What is OpenID Connect and how is it related to OAuth 2.0?',
          difficulty: 'medium',
          a: `<p><strong>OpenID Connect (OIDC)</strong> adds identity on top of OAuth 2.0.</p>
<ul>
<li>OAuth answers delegated access.</li>
<li>OIDC answers who the user is.</li>
</ul>
<div class="key-point">If someone asks about login with Google, OIDC is usually part of the real answer.</div>`,
        },
        {
          q: 'What is the difference between RBAC and ABAC?',
          difficulty: 'medium',
          a: `<ul>
<li><strong>RBAC</strong>: permissions based on role, such as ADMIN or EDITOR.</li>
<li><strong>ABAC</strong>: permissions based on attributes, such as department, location, resource owner, or time.</li>
</ul>
<div class="key-point">RBAC is simpler. ABAC is more flexible but harder to reason about and maintain.</div>`,
        },
        {
          q: 'What is the difference between CORS and CSRF?',
          difficulty: 'medium',
          a: `<ul>
<li><strong>CORS</strong>: browser rule about cross-origin JavaScript requests.</li>
<li><strong>CSRF</strong>: attack that tricks a browser into sending unwanted authenticated requests.</li>
</ul>
<div class="key-point">CORS is not a full API security mechanism. CSRF is an attack pattern.</div>`,
        },
        {
          q: 'What is XSS and why does it matter for token-based auth?',
          difficulty: 'hard',
          a: `<p><strong>XSS</strong> means attacker-controlled JavaScript runs in your page.</p>
<ul>
<li>Can steal tokens from localStorage.</li>
<li>Can act as the user in the current session.</li>
<li>Mitigate with output encoding, CSP, sanitization, and framework-safe rendering.</li>
</ul>
<div class="key-point">Even perfect JWT validation does not save you if malicious JavaScript runs in the browser.</div>`,
        },
        {
          q: 'What is mTLS and when would you use it between services?',
          difficulty: 'hard',
          a: `<p><strong>mTLS</strong> means both sides of a connection verify each other with certificates.</p>
<ul>
<li>Encrypts traffic in transit.</li>
<li>Gives strong service identity.</li>
</ul>
<div class="key-point">JWT proves user context. mTLS proves service identity. They solve different security problems.</div>`,
        },
        {
          q: 'What is the difference between symmetric and asymmetric JWT signing?',
          difficulty: 'hard',
          a: `<ul>
<li><strong>Symmetric</strong>: same secret signs and verifies.</li>
<li><strong>Asymmetric</strong>: private key signs, public key verifies.</li>
</ul>
<div class="key-point">Asymmetric signing is better when many services need verification but only one trusted authority should sign.</div>`,
        },
        {
          q: 'How do you protect login endpoints from brute-force attacks?',
          difficulty: 'medium',
          a: `<ul>
<li>Rate limit by IP and account</li>
<li>Use MFA for sensitive accounts</li>
<li>Alert on suspicious patterns</li>
<li>Hash passwords strongly</li>
</ul>
<div class="key-point">Do not rely on account lockout alone. It can become a denial-of-service vector against real users.</div>`,
        },
      ],
    },

    // ========================= DESIGN PATTERNS =========================,
    {
      id: 'design-patterns',
      name: 'Design Patterns',
      icon: 'DP',
      questions: [
        {
          q: 'What is a design pattern and why does it matter?',
          difficulty: 'easy',
          a: `<p>A <strong>design pattern</strong> is a reusable solution to a recurring design problem.</p>
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
          a: `<p><strong>Singleton</strong> ensures only one instance of a class exists.</p>
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
          a: `<p><strong>Factory Method</strong> delegates object creation to a method instead of calling constructors directly everywhere.</p>
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
          a: `<ul>
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
          a: `<p><strong>Builder</strong> constructs complex objects step by step.</p>
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
          a: `<p><strong>Strategy</strong> encapsulates interchangeable algorithms behind a common interface.</p>
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
          a: `<ul>
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
          a: `<p><strong>Observer</strong> defines a one-to-many dependency so observers are notified when subject state changes.</p>
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
          a: `<ul>
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
          a: `<p><strong>Adapter</strong> converts one interface into another interface expected by the client.</p>
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
          a: `<p><strong>Facade</strong> provides a simplified interface over a complex subsystem.</p>
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
          a: `<p><strong>Proxy</strong> keeps the same interface as the real object but controls access to it.</p>
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
          a: `<p><strong>Decorator</strong> adds behavior to an object without changing its class.</p>
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
          a: `<p><strong>Template Method</strong> defines the skeleton of an algorithm in a base class while subclasses customize steps.</p>
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
          a: `<p><strong>Chain of Responsibility</strong> passes a request through a chain of handlers until one handles it or the chain ends.</p>
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
          a: `<p><strong>Big O Notation</strong> describes how the runtime or memory of an algorithm grows as the input size grows. It answers: <em>"If I double my data, how much slower does it get?"</em></p>
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
          a: `<p><strong>Array</strong>: Elements stored in <strong>contiguous</strong> (side-by-side) memory. Access by index is instant.</p>
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
          a: `<p><strong>Stack</strong> = Last In, First Out (LIFO). Like a stack of plates — you add and remove from the top.</p>
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
          a: `<p>A <strong>Hash Map</strong> stores key-value pairs and provides <strong>O(1)</strong> average lookup, insert, and delete.</p>
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
          a: `<p><strong>Binary Search</strong> finds a target in a <strong>sorted</strong> array by repeatedly cutting the search space in half. It's O(log n) — extremely fast.</p>
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
          a: `<p>These are three simple sorting algorithms, all O(n²). Great for learning but too slow for large data.</p>
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
          a: `<p><strong>Merge Sort</strong> uses <strong>Divide and Conquer</strong>: split the array in half, sort each half, then merge the two sorted halves. Always O(n log n).</p>
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
          a: `<p><strong>Quick Sort</strong> picks a "pivot" element, partitions the array so everything smaller goes left and everything larger goes right, then recursively sorts left and right.</p>
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
          a: `<p><strong>Binary Tree</strong>: Each node has at most 2 children (left and right).</p>
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
          a: `<p>Tree traversals are ways to visit every node in a tree. The order you visit determines the traversal type.</p>
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
          a: `<p>A <strong>Heap</strong> is a complete binary tree where the parent is always greater (Max-Heap) or smaller (Min-Heap) than its children. It gives you the min/max element in O(1).</p>
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
          a: `<p><strong>Recursion</strong> = a function that calls itself to solve smaller versions of the same problem until it reaches a base case.</p>
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
          a: `<p><strong>Dynamic Programming</strong> = solving complex problems by breaking them into overlapping subproblems and storing results to avoid recomputing them.</p>
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
          a: `<p>BFS and DFS are two ways to visit all nodes in a graph or tree.</p>
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
          a: `<p><strong>Two Pointers</strong> = use two indices that move through an array, usually from both ends or at different speeds, to solve problems in O(n).</p>
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
          a: `<p><strong>Sliding Window</strong> = maintain a "window" (subarray/substring) that expands or shrinks as you move through the array. Avoids recomputing from scratch each time.</p>
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
          a: `<p>A <strong>Graph</strong> is a collection of nodes (vertices) connected by edges. It models relationships: social networks, roads, web pages, dependencies.</p>
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
          a: `<p><strong>Dijkstra's Algorithm</strong> finds the <strong>shortest path</strong> from a source node to all other nodes in a <strong>weighted graph</strong> (non-negative weights).</p>
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
          a: `<p>A <strong>Greedy Algorithm</strong> makes the <strong>locally optimal choice</strong> at each step, hoping it leads to the globally optimal solution.</p>
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
          a: `<p><strong>Backtracking</strong> = try all possible options, and when you hit a dead end, undo the last choice and try a different path. It's like solving a maze — if you hit a wall, go back and try another turn.</p>
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
          a: `<p>A <strong>stable</strong> sort preserves the relative order of equal elements. An <strong>unstable</strong> sort doesn't guarantee it.</p>
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
          a: `<p>Use <strong>Floyd's Tortoise and Hare</strong> algorithm: two pointers, one moves 1 step (slow), the other moves 2 steps (fast). If there's a cycle, they'll eventually meet.</p>
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
          a: `<p>A <strong>Trie</strong> is a tree-like data structure for storing strings where each node represents a character. It's extremely fast for prefix-based lookups.</p>
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
          a: `<p>The <strong>Knapsack Problem</strong>: Given items with weights and values, select items to maximize total value without exceeding a weight limit.</p>
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
          a: `<p><strong>Topological Sort</strong> orders nodes in a <strong>directed acyclic graph (DAG)</strong> such that for every edge A→B, A comes before B.</p>
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
          a: `<p><strong>Union-Find</strong> tracks a collection of elements partitioned into disjoint (non-overlapping) sets. It supports two operations efficiently: <strong>Find</strong> (which set does this element belong to?) and <strong>Union</strong> (merge two sets).</p>
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
          a: `<p><strong>Problem:</strong> Given an array and a target, find two numbers that add up to the target. Return their indices.</p>
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
          a: `<p><strong>Bit Manipulation</strong> = working directly with binary representations of numbers. Extremely fast and memory-efficient.</p>
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
          a: `<p>Both are strategies for DP. They store computed results to avoid redundant work.</p>
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
          a: `<p><strong>Counting Sort</strong> and <strong>Radix Sort</strong> are non-comparison sorts that can beat the O(n log n) barrier by using the structure of the data itself.</p>
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
          a: `<p>A <strong>Monotonic Stack</strong> is a stack that maintains elements in a strictly increasing or decreasing order. Elements are popped when the ordering would be violated.</p>
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
          a: `<p><strong>Binary Search on Answer</strong> = instead of searching for an element in an array, you binary search over the <strong>range of possible answers</strong> to find the optimal one.</p>
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
          a: `<p>Three fundamental collection types in programming:</p>
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
      ],
    },
  );
})();
