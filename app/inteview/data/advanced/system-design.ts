// Interview data: SYSTEM DESIGN
import type { PvTopic } from '../../types';

export const topics: PvTopic[] = [
  {
    id: 'system-design',
    name: 'System Design',
    icon: '🏗️',
    questions: [
      {
        q: 'What is System Design and why does it matter in interviews?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>System design is about showing clear, structured thinking, not memorizing one correct architecture. The first step is to understand the requirements and scale, such as read versus write volume, requests per second, and data size, because these numbers drive the design. Interviewers mainly want to see how tradeoffs are handled, like consistency versus availability or cost versus latency. A common mistake is using tools like Kafka or sharding before there is a clear reason for them.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>System design là để thể hiện tư duy rõ ràng, có cấu trúc, chứ không phải học thuộc một kiến trúc đúng duy nhất. Bước đầu tiên là hiểu yêu cầu và quy mô, chẳng hạn như tỷ lệ đọc so với ghi, số request mỗi giây và kích thước dữ liệu, vì chính những con số này quyết định thiết kế. Người phỏng vấn chủ yếu muốn xem cách bạn xử lý các đánh đổi (tradeoff), như consistency so với availability hay chi phí so với latency. Một sai lầm phổ biến là dùng các công cụ như Kafka hay sharding trước khi có lý do rõ ràng cho chúng.</p></details>
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
        a: `<div class="interview-answer"><p>Vertical scaling means using one bigger and more powerful machine, while horizontal scaling means adding more machines. Vertical scaling is simple but has a hard limit and creates a single point of failure. Horizontal scaling can grow almost without limit and adds redundancy, but it needs services to be stateless and adds work for load balancing and data consistency. A common rule is to scale up first and scale out later, and the main risk is that local state or sticky sessions break horizontal scaling.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Vertical scaling nghĩa là dùng một máy lớn và mạnh hơn, còn horizontal scaling nghĩa là thêm nhiều máy. Vertical scaling thì đơn giản nhưng có giới hạn cứng và tạo ra single point of failure. Horizontal scaling có thể mở rộng gần như không giới hạn và tăng tính dự phòng, nhưng nó đòi hỏi các service phải stateless và phát sinh thêm việc về load balancing cũng như đồng bộ dữ liệu. Một quy tắc thường gặp là scale up trước rồi scale out sau, và rủi ro chính là state cục bộ hay sticky session sẽ làm hỏng horizontal scaling.</p></details>
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
        a: `<div class="interview-answer"><p>A load balancer spreads incoming traffic across several servers and uses health checks to avoid sending requests to servers that are down. A key choice is Layer 4 versus Layer 7: L4 routes only by IP and port and is very fast, while L7 reads the HTTP request and can route by path or host and handle TLS. Common algorithms include round-robin and least-connections, and a shared session store like Redis is better than sticky routing. The load balancer itself can be a single point of failure, so it is usually run as a redundant pair.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Load balancer phân phối lưu lượng đến cho nhiều server và dùng health check để tránh gửi request tới những server đang chết. Một lựa chọn quan trọng là Layer 4 so với Layer 7: L4 chỉ định tuyến theo IP và port nên rất nhanh, còn L7 đọc được request HTTP nên có thể định tuyến theo path hay host và xử lý TLS. Các thuật toán thường gặp gồm round-robin và least-connections, và một session store dùng chung như Redis thì tốt hơn là sticky routing. Bản thân load balancer cũng có thể là single point of failure, nên nó thường được chạy dưới dạng một cặp dự phòng.</p></details>
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
        a: `<div class="interview-answer"><p>Caching stores frequently used data in a fast location to improve speed and reduce load on the main source. A common default is <strong>cache-aside</strong> with LRU eviction and a limited TTL, which only caches data that is actually requested. The hardest part is invalidation, meaning keeping the cache in sync with the source so users do not get stale data. A cache is only a performance layer, not the main data store, so the system must still work when the cache is empty or down.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Caching lưu dữ liệu hay dùng ở một nơi truy cập nhanh để cải thiện tốc độ và giảm tải cho nguồn dữ liệu chính. Một mặc định phổ biến là <strong>cache-aside</strong> kết hợp với LRU eviction và một TTL giới hạn, cách này chỉ cache những dữ liệu thực sự được yêu cầu. Phần khó nhất là invalidation, tức là giữ cho cache đồng bộ với nguồn để người dùng không nhận dữ liệu cũ. Cache chỉ là một lớp tăng hiệu năng chứ không phải nơi lưu trữ chính, nên hệ thống vẫn phải hoạt động được khi cache rỗng hoặc bị chết.</p></details>
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
        a: `<div class="interview-answer"><p>A CDN copies static content to edge servers near users, which lowers latency and reduces load on the origin server. It is used for images, video, and other cacheable files, and modern CDNs also offer TLS termination, DDoS protection, and edge computing. Important settings are cache-control headers, TTLs, and a cache-busting method such as versioned file names. The main risk is caching dynamic or user-specific content by mistake, which can show one user another user's data.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>CDN sao chép nội dung tĩnh ra các edge server gần người dùng, nhờ đó giảm latency và giảm tải cho origin server. Nó được dùng cho ảnh, video và các file có thể cache khác, và các CDN hiện đại còn cung cấp TLS termination, chống DDoS và edge computing. Những thiết lập quan trọng là các header cache-control, TTL và một cách cache-busting như đặt tên file có phiên bản. Rủi ro chính là vô tình cache nội dung động hoặc riêng của từng người dùng, khiến một người có thể thấy dữ liệu của người khác.</p></details>
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
        a: `<div class="interview-answer"><p>A database index is a sorted structure, usually a B-tree, that lets the database find rows quickly instead of scanning the whole table. Indexes are not free, because each write must update them and they use extra disk space, so they should match real query patterns. Useful ideas include composite indexes with the correct column order and covering indexes that answer a query from the index alone. A common mistake is a function or type mismatch in the <code>WHERE</code> clause that quietly disables the index, so <code>EXPLAIN</code> should confirm it is used.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Database index là một cấu trúc đã được sắp xếp, thường là B-tree, giúp database tìm các dòng một cách nhanh chóng thay vì quét toàn bộ bảng. Index không miễn phí, vì mỗi lần ghi đều phải cập nhật chúng và chúng tốn thêm dung lượng đĩa, nên chúng cần khớp với các mẫu truy vấn thực tế. Vài ý tưởng hữu ích gồm composite index với thứ tự cột đúng và covering index có thể trả lời một truy vấn chỉ từ index. Một sai lầm phổ biến là dùng hàm hoặc để lệch kiểu dữ liệu trong mệnh đề <code>WHERE</code>, khiến index bị vô hiệu hóa một cách âm thầm, vì vậy nên dùng <code>EXPLAIN</code> để xác nhận index có được sử dụng.</p></details>
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
        a: `<div class="interview-answer"><p>SQL databases are a good default because they offer ACID transactions, joins, and a fixed schema. NoSQL fits when one need dominates, such as very high write scale, a flexible schema, or a specific shape like document, key-value, or graph. With NoSQL, data is modeled around the queries in advance because there are no joins. Many systems use both, for example PostgreSQL for core data, Redis for cache, and Elasticsearch for search.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>SQL database là một lựa chọn mặc định tốt vì nó cung cấp ACID transaction, join và schema cố định. NoSQL phù hợp khi có một nhu cầu nổi trội, chẳng hạn như quy mô ghi rất lớn, schema linh hoạt, hoặc một dạng dữ liệu cụ thể như document, key-value hay graph. Với NoSQL, dữ liệu được mô hình hóa xoay quanh các truy vấn ngay từ trước vì không có join. Nhiều hệ thống dùng cả hai, ví dụ PostgreSQL cho dữ liệu cốt lõi, Redis cho cache và Elasticsearch cho tìm kiếm.</p></details>
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
        a: `<div class="interview-answer"><p>Sharding splits data across multiple machines so each node holds only part of the data, which lets writes scale beyond one server. The shard key is the most important choice, because it must spread load evenly and fit the query patterns, or some shards become hotspots. Sharding is hard to reverse, so read replicas and caching should be tried first. Range keys are simple but can create hotspots, hash keys spread data well but break range scans, and cross-shard joins and transactions become very difficult.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Sharding chia dữ liệu ra nhiều máy để mỗi node chỉ giữ một phần dữ liệu, nhờ đó việc ghi có thể mở rộng vượt quá một server. Shard key là lựa chọn quan trọng nhất, vì nó phải phân tán tải đều và khớp với các mẫu truy vấn, nếu không một số shard sẽ trở thành hotspot. Sharding rất khó đảo ngược, nên nên thử read replica và caching trước. Range key thì đơn giản nhưng có thể tạo hotspot, hash key phân tán dữ liệu tốt nhưng làm hỏng range scan, và join cùng transaction xuyên shard trở nên cực kỳ khó.</p></details>
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
        a: `<div class="interview-answer"><p>Replication keeps copies of the data on several nodes, which improves read scaling and provides failover. The main choice is synchronous versus asynchronous: synchronous avoids data loss but adds write latency, while asynchronous is faster but can lose recent writes during failover. Single-leader setups are common, where writes go to the primary and reads go to replicas. A frequent problem is replication lag, which can cause a user to not see their own recent update.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Replication giữ các bản sao của dữ liệu trên nhiều node, giúp mở rộng khả năng đọc và cung cấp failover. Lựa chọn chính là synchronous so với asynchronous: synchronous tránh được mất dữ liệu nhưng thêm độ trễ khi ghi, còn asynchronous nhanh hơn nhưng có thể mất các bản ghi gần đây khi failover. Các thiết lập single-leader rất phổ biến, trong đó ghi đi vào primary và đọc đi vào các replica. Một vấn đề thường gặp là replication lag, có thể khiến người dùng không thấy được bản cập nhật vừa mới của chính mình.</p></details>
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
        a: `<div class="interview-answer"><p>Network partitions cannot be avoided, so the real choice during a partition is between consistency and availability. A CP system refuses writes to stay correct, which suits banking or inventory, while an AP system keeps serving and fixes data later, which suits carts or social feeds. When there is no partition, a system can offer both consistency and availability. PACELC extends this idea, noting that even without a partition there is a tradeoff between latency and consistency, and the choice can differ per operation.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Không thể tránh được network partition, nên lựa chọn thực sự trong lúc xảy ra partition là giữa consistency và availability. Một hệ CP sẽ từ chối ghi để đảm bảo đúng đắn, phù hợp cho ngân hàng hay quản lý tồn kho, còn một hệ AP vẫn tiếp tục phục vụ rồi sửa dữ liệu sau, phù hợp cho giỏ hàng hay feed mạng xã hội. Khi không có partition, một hệ thống có thể cung cấp cả consistency lẫn availability. PACELC mở rộng ý này, chỉ ra rằng ngay cả khi không có partition vẫn có sự đánh đổi giữa latency và consistency, và lựa chọn có thể khác nhau theo từng thao tác.</p></details>
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
        a: `<div class="interview-answer"><p>An API gateway is a single entry point for all client requests to backend services. It centralizes shared concerns such as authentication, rate limiting, TLS termination, routing, request aggregation, and monitoring, so each service can focus on business logic. The tradeoffs are an extra network hop and the risk of becoming a single point of failure, so it should run redundantly. It differs from a plain load balancer because it is Layer 7 and application-aware, and it should not grow into a system that holds business logic.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>API gateway là một điểm vào duy nhất cho mọi request của client đến các service backend. Nó tập trung các mối quan tâm dùng chung như authentication, rate limiting, TLS termination, định tuyến, gộp request và giám sát, nhờ đó mỗi service có thể tập trung vào logic nghiệp vụ. Đánh đổi là thêm một chặng mạng và rủi ro trở thành single point of failure, nên nó cần chạy ở dạng dự phòng. Nó khác với một load balancer thuần túy vì nó ở Layer 7 và hiểu được ứng dụng, và không nên để nó phình to thành một hệ thống chứa logic nghiệp vụ.</p></details>
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
        a: `<div class="interview-answer"><p>A message queue separates producers from consumers in time, so the producer can send a message and the consumer processes it later at its own pace. It is useful for smoothing traffic spikes, doing slow work in the background such as sending emails, and letting services keep running when others are down. The costs are added latency, eventual consistency, and possible duplicate or out-of-order messages, so consumers should be idempotent. Key choices are the delivery guarantee and whether to use a plain queue like SQS or RabbitMQ or a log like Kafka for replay, and a dead-letter queue is needed for bad messages.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Message queue tách producer khỏi consumer theo thời gian, để producer có thể gửi một message và consumer xử lý nó sau theo nhịp độ riêng của mình. Nó hữu ích để làm mượt các đợt tăng đột biến lưu lượng, làm những việc chậm ở nền như gửi email, và giúp các service tiếp tục chạy khi các service khác đang chết. Cái giá phải trả là thêm latency, eventual consistency, và khả năng message bị trùng hoặc sai thứ tự, nên consumer nên idempotent. Các lựa chọn quan trọng là bảo đảm giao (delivery guarantee) và việc dùng một queue thuần túy như SQS hay RabbitMQ hay dùng một log như Kafka để replay, và cần có dead-letter queue cho các message lỗi.</p></details>
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
        a: `<div class="interview-answer"><p>A monolith is a single deployable application, while microservices split the app into small independent services. Starting with a well-structured monolith is usually best, because microservices add network calls, distributed transactions, and operational overhead. Microservices help when multiple teams need independent deploys or when components need very different scaling. A common failure is splitting too early and creating a distributed monolith, which has the cost without the benefit.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Monolith là một ứng dụng deploy được duy nhất, còn microservices chia ứng dụng thành các service nhỏ độc lập. Bắt đầu với một monolith có cấu trúc tốt thường là lựa chọn tốt nhất, vì microservices thêm các lời gọi mạng, distributed transaction và chi phí vận hành. Microservices hữu ích khi nhiều team cần deploy độc lập hoặc khi các thành phần cần scale rất khác nhau. Một thất bại phổ biến là chia quá sớm và tạo ra một distributed monolith, vốn có cái giá mà không có lợi ích.</p></details>
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
        a: `<div class="interview-answer"><p>Rate limiting controls how many requests a client can make in a time window, which protects against abuse, runaway clients, and cost spikes, and keeps usage fair. Token bucket is a common default because it allows short bursts while limiting the average rate, sliding window is more precise but heavier, and fixed window is simplest but has boundary spikes. In a distributed system, counters are kept in a shared store like Redis using atomic operations. Responses should return HTTP <code>429</code> with a <code>Retry-After</code> header, and the limit should be keyed per user or API key rather than per IP, which breaks behind NAT.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Rate limiting kiểm soát số request mà một client có thể thực hiện trong một khoảng thời gian, giúp bảo vệ khỏi lạm dụng, các client chạy loạn và các cú tăng chi phí, đồng thời giữ cho việc sử dụng công bằng. Token bucket là một mặc định phổ biến vì nó cho phép các đợt burst ngắn trong khi vẫn giới hạn tốc độ trung bình, sliding window thì chính xác hơn nhưng nặng hơn, còn fixed window đơn giản nhất nhưng có các đợt tăng vọt ở ranh giới. Trong một hệ phân tán, các bộ đếm được giữ trong một store dùng chung như Redis bằng các thao tác atomic. Response nên trả về HTTP <code>429</code> kèm header <code>Retry-After</code>, và giới hạn nên gắn theo từng user hoặc API key thay vì theo IP, vốn bị hỏng khi ở sau NAT.</p></details>
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
        a: `<div class="interview-answer"><p>With plain hash(key) modulo N, changing the number of servers remaps almost all keys. Consistent hashing places servers and keys on a ring, so adding or removing a node moves only the nearby keys, about one part in N of the data. Virtual nodes give each server many points on the ring to keep load even and avoid hotspots. It is used in systems like DynamoDB, Cassandra, and distributed caches, but hot keys still need replication or bounded loads.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Với hash(key) modulo N thông thường, việc thay đổi số lượng server sẽ remap gần như toàn bộ các key. Consistent hashing đặt các server và key lên một vòng tròn, nên khi thêm hoặc bớt một node thì chỉ những key lân cận mới di chuyển, khoảng một phần N của dữ liệu. Virtual node cho mỗi server nhiều điểm trên vòng để giữ tải đều và tránh hotspot. Nó được dùng trong các hệ như DynamoDB, Cassandra và các distributed cache, nhưng các hot key vẫn cần replication hoặc bounded load.</p></details>
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
        a: `<div class="interview-answer"><p>A URL shortener is mainly a distributed-ID problem plus a read-heavy key-value store. A common approach is to base62-encode a counter or give each node a pre-allocated range of keys, which avoids the collisions that hashing the URL would cause. Because reads greatly outnumber writes, the design uses a simple key-value store with heavy caching and a CDN in front of redirects. A <code>301</code> or <code>302</code> redirect is chosen on purpose, with 302 used when click analytics are needed, and other concerns include custom aliases, expiration, and collision-free key generation.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>URL shortener chủ yếu là một bài toán distributed ID cộng với một key-value store thiên về đọc. Một cách tiếp cận phổ biến là base62-encode một bộ đếm hoặc cấp cho mỗi node một dải key được phân bổ trước, cách này tránh được các va chạm mà việc hash URL sẽ gây ra. Vì đọc nhiều hơn ghi rất nhiều, thiết kế dùng một key-value store đơn giản với caching mạnh và một CDN đặt trước các redirect. Việc chọn redirect <code>301</code> hay <code>302</code> là có chủ đích, với 302 được dùng khi cần phân tích click, và các mối quan tâm khác gồm custom alias, hết hạn, và sinh key không va chạm.</p></details>
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
        a: `<div class="interview-answer"><p>A chat system uses a persistent connection such as WebSockets so the server can push messages instead of clients polling. Because users connect to different servers, a message must be routed to the server holding the recipient's connection, using a pub/sub layer like Redis or Kafka and a session registry that maps users to servers. Messages are stored for history and offline delivery in a write-heavy store partitioned by conversation. Important details are per-conversation ordering, fan-out for large groups, delivery and read receipts, presence through heartbeats, and backfilling messages after a reconnection.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một hệ thống chat dùng kết nối lâu dài như WebSockets để server có thể đẩy message thay vì để client hỏi liên tục. Vì người dùng kết nối tới các server khác nhau, một message phải được định tuyến tới server đang giữ kết nối của người nhận, dùng một lớp pub/sub như Redis hay Kafka và một session registry ánh xạ người dùng tới server. Message được lưu để có lịch sử và giao khi offline trong một store thiên về ghi, được phân vùng theo cuộc hội thoại. Những chi tiết quan trọng là thứ tự trong từng cuộc hội thoại, fan-out cho các nhóm lớn, delivery và read receipt, presence qua heartbeat, và backfill message sau khi kết nối lại.</p></details>
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
        a: `<div class="interview-answer"><p>A reverse proxy sits in front of servers, so clients talk to it and it forwards requests to the backend. It is a good place for TLS termination, caching, compression, and hiding the internal server layout. It differs from a load balancer, which distributes traffic across identical servers, although one tool like Nginx often does both. A common mistake is not forwarding the real client IP with the <code>X-Forwarded-For</code> header, which breaks logging and rate limiting.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Reverse proxy đứng trước các server, nên client nói chuyện với nó và nó chuyển tiếp request tới backend. Đây là nơi tốt để làm TLS termination, caching, nén và ẩn đi bố cục server nội bộ. Nó khác với load balancer, vốn phân phối lưu lượng qua các server giống nhau, dù rằng một công cụ như Nginx thường làm cả hai. Một sai lầm phổ biến là không chuyển tiếp IP thật của client bằng header <code>X-Forwarded-For</code>, khiến việc logging và rate limiting bị hỏng.</p></details>
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
        a: `<div class="interview-answer"><p>These three methods trade off direction, complexity, and infrastructure fit. Long polling is a fallback where the client requests and the server holds the connection until there is data, which works everywhere but is wasteful. Server-Sent Events are a one-way server-to-client stream over plain HTTP that reconnects automatically, which suits feeds, notifications, and live scores. WebSockets are full-duplex over one connection, which fits chat, gaming, and collaborative editing, but all persistent connections need care with load balancers and proxies.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Ba phương pháp này đánh đổi giữa chiều truyền, độ phức tạp và mức phù hợp với hạ tầng. Long polling là một phương án dự phòng trong đó client gửi request và server giữ kết nối cho đến khi có dữ liệu, cách này chạy được ở mọi nơi nhưng lãng phí. Server-Sent Events là một luồng một chiều từ server tới client qua HTTP thuần túy và tự động kết nối lại, phù hợp cho feed, thông báo và tỷ số trực tiếp. WebSockets là full-duplex trên một kết nối, phù hợp cho chat, game và soạn thảo cộng tác, nhưng mọi kết nối lâu dài đều cần lưu ý với load balancer và proxy.</p></details>
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
        a: `<div class="interview-answer"><p>REST uses fixed endpoints per resource, while GraphQL uses one endpoint where the client asks for exactly the fields it needs. GraphQL helps when many clients need different data, since it avoids over-fetching and custom endpoints, but it moves complexity to the server. With GraphQL the server must manage query depth and cost, HTTP caching mostly disappears, and the N+1 resolver problem needs batching with tools like DataLoader. REST is a good default for simple CRUD and public APIs, while gRPC is another option for internal service-to-service calls.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>REST dùng các endpoint cố định cho mỗi resource, còn GraphQL dùng một endpoint duy nhất nơi client yêu cầu đúng những field mình cần. GraphQL hữu ích khi nhiều client cần dữ liệu khác nhau, vì nó tránh được over-fetching và các endpoint tùy biến, nhưng nó chuyển độ phức tạp sang phía server. Với GraphQL, server phải quản lý độ sâu và chi phí của truy vấn, HTTP caching gần như biến mất, và bài toán N+1 ở resolver cần batching bằng các công cụ như DataLoader. REST là lựa chọn mặc định tốt cho CRUD đơn giản và các API công khai, còn gRPC là một lựa chọn khác cho các lời gọi nội bộ giữa các service.</p></details>
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
        a: `<div class="interview-answer"><p>ACID means a transaction is all-or-nothing and leaves the database in a valid state. Isolation is often underestimated because it is a range of levels, such as read committed, repeatable read, and serializable, each allowing different anomalies like dirty reads, non-repeatable reads, and phantoms. Most databases default to read committed, not serializable, so the code must tolerate the remaining anomalies. Durability usually relies on a write-ahead log flushed to disk, and ACID is exactly what becomes hard to keep in distributed systems, where it may be rebuilt with sagas.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>ACID nghĩa là một transaction hoặc thực hiện toàn bộ hoặc không gì cả, và để database ở một trạng thái hợp lệ. Isolation thường bị xem nhẹ vì nó là một dải các mức, như read committed, repeatable read và serializable, mỗi mức cho phép các dị thường khác nhau như dirty read, non-repeatable read và phantom. Hầu hết database mặc định là read committed chứ không phải serializable, nên code phải chịu được những dị thường còn lại. Durability thường dựa vào một write-ahead log được flush xuống đĩa, và ACID chính là thứ trở nên khó giữ trong các hệ phân tán, nơi nó có thể được dựng lại bằng saga.</p></details>
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
        a: `<div class="interview-answer"><p>Eventual consistency means that once writes stop, all replicas converge to the same value, but for a short time different readers may see different data. It is the tradeoff made for higher availability and lower latency, as in AP systems. It is acceptable for things like likes, follower counts, and feeds, but not for values like account balances. A common problem is read-your-own-writes, where a user does not see their own update, which can be handled with session consistency, reading from the leader, or optimistic UI updates.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Eventual consistency nghĩa là khi các lần ghi dừng lại, mọi replica sẽ hội tụ về cùng một giá trị, nhưng trong một khoảng thời gian ngắn các người đọc khác nhau có thể thấy dữ liệu khác nhau. Đó là sự đánh đổi để có availability cao hơn và latency thấp hơn, như trong các hệ AP. Nó chấp nhận được cho những thứ như lượt like, số follower và feed, nhưng không dùng cho các giá trị như số dư tài khoản. Một vấn đề phổ biến là read-your-own-writes, khi một người dùng không thấy bản cập nhật của chính mình, có thể xử lý bằng session consistency, đọc từ leader, hoặc cập nhật UI theo kiểu optimistic.</p></details>
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
        a: `<div class="interview-answer"><p>The main decision is fan-out on write versus fan-out on read. Fan-out on write precomputes each user's feed when someone posts, which makes reads fast but causes a write storm for users with millions of followers. Fan-out on read builds the feed at read time, which makes writes cheap but reads expensive. Large systems use a hybrid: push for normal users and pull for celebrities, merged at read time, with feeds stored in a cache like Redis, ranked, and paginated by cursor.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Quyết định chính là fan-out on write so với fan-out on read. Fan-out on write tính trước feed của mỗi người dùng khi có ai đó đăng bài, khiến việc đọc nhanh nhưng gây ra một cơn bão ghi đối với những người dùng có hàng triệu follower. Fan-out on read dựng feed vào lúc đọc, khiến việc ghi rẻ nhưng việc đọc tốn kém. Các hệ thống lớn dùng một cách kết hợp: push cho người dùng bình thường và pull cho người nổi tiếng, được gộp lại lúc đọc, với feed được lưu trong một cache như Redis, được xếp hạng và phân trang bằng cursor.</p></details>
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
        a: `<div class="interview-answer"><p>A circuit breaker stops a caller from repeatedly calling a service that is already failing, so it fails fast instead of piling up timeouts and prevents cascading failures. It has three states: closed for normal operation, open after too many failures so requests are rejected immediately, and half-open where a few test requests check for recovery. It protects the caller's threads while giving the failing service time to recover, and it works well with timeouts, retries with backoff, and a fallback. The main challenge is tuning the thresholds so it does not trip on small problems or fail to protect the system.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một circuit breaker ngăn phía gọi liên tục gọi một service vốn đã đang lỗi, để nó fail nhanh thay vì chồng chất các timeout và ngăn các thất bại lan truyền. Nó có ba trạng thái: closed cho hoạt động bình thường, open sau khi có quá nhiều lỗi nên request bị từ chối ngay lập tức, và half-open nơi một vài request thử nghiệm để kiểm tra xem đã phục hồi chưa. Nó bảo vệ các thread của phía gọi trong khi cho service đang lỗi thời gian để phục hồi, và nó phối hợp tốt với timeout, retry kèm backoff, và một fallback. Thách thức chính là tinh chỉnh các ngưỡng sao cho nó không bật vì những vấn đề nhỏ nhưng cũng không bỏ sót việc bảo vệ hệ thống.</p></details>
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
        a: `<div class="interview-answer"><p>In event-driven architecture, services send out events about what happened and other services react to them, instead of calling each other directly. This gives <strong>loose coupling</strong> and makes it easy to add new consumers without changing the producer. The trade-offs are real: eventual consistency, harder debugging, no simple end-to-end view, and the need to handle duplicate or out-of-order events. Because services depend on shared event formats, a schema registry and versioning are important.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Trong event-driven architecture, các service phát ra event về những gì đã xảy ra và các service khác phản ứng lại, thay vì gọi trực tiếp lẫn nhau. Cách này mang lại <strong>loose coupling</strong> và giúp dễ dàng thêm consumer mới mà không cần sửa producer. Nhưng cũng có những đánh đổi thực sự: eventual consistency, việc debug khó hơn, không có bức tranh end-to-end đơn giản, và phải xử lý các event bị trùng hoặc đến sai thứ tự. Vì các service phụ thuộc vào định dạng event dùng chung, nên schema registry và versioning là rất quan trọng.</p></p></details>
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
        a: `<div class="interview-answer"><p>Authentication proves who a user is, and authorization decides what that user is allowed to do. Identity comes first, then permissions, and the two should be kept separate in code. A common security mistake is to authenticate a user and then trust identity or role values sent by the client. Authorization checks should always run on the server against the verified user, never based on what the client claims about itself.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Authentication chứng minh người dùng là ai, còn authorization quyết định người dùng đó được phép làm gì. Danh tính đến trước, rồi mới đến quyền hạn, và hai thứ này nên được tách bạch trong code. Một lỗi bảo mật phổ biến là sau khi xác thực người dùng lại tin vào thông tin danh tính hoặc role do client gửi lên. Các kiểm tra authorization luôn phải chạy ở phía server dựa trên người dùng đã được xác minh, không bao giờ dựa vào những gì client tự khai về mình.</p></p></details>
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
        a: `<div class="interview-answer"><p><strong>OAuth 2.0</strong> is a framework for delegated authorization that lets an app act for a user without ever seeing the user's password, using scoped tokens that can be revoked. The recommended flow is Authorization Code with <code>PKCE</code>, which keeps the token exchange safe and hides secrets from the browser. OAuth is about authorization, not authentication; proving identity is added by OpenID Connect on top of it. A common mistake is using the old implicit flow or treating the access token as proof of identity.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p><strong>OAuth 2.0</strong> là một framework cho delegated authorization, cho phép một app hành động thay cho người dùng mà không bao giờ nhìn thấy mật khẩu của họ, bằng cách dùng các token có phạm vi giới hạn và có thể thu hồi. Flow được khuyến nghị là Authorization Code với <code>PKCE</code>, giúp việc trao đổi token an toàn và giấu secret khỏi trình duyệt. OAuth nói về authorization chứ không phải authentication; việc chứng minh danh tính được bổ sung bởi OpenID Connect nằm trên nó. Một sai lầm phổ biến là dùng implicit flow cũ hoặc coi access token như bằng chứng về danh tính.</p></p></details>
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
        a: `<div class="interview-answer"><p>A notification system works well as an event-driven pipeline built around a queue: services send notification events, and workers deliver them through channel-specific senders such as push, SMS, email, and in-app. Important features include user preferences and opt-outs, deduplication so retries do not send twice, per-user rate limiting, and templates with localization. Because outside providers fail and throttle, retries with backoff, dead-letter queues, and fallbacks are needed. Priority matters too, since a one-time password cannot wait behind marketing messages.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Một hệ thống notification hoạt động tốt khi được xây dựng như một pipeline event-driven xoay quanh một queue: các service gửi event notification, và các worker gửi chúng đi qua các sender riêng cho từng kênh như push, SMS, email và in-app. Các tính năng quan trọng gồm tùy chọn của người dùng và opt-out, khử trùng lặp để việc retry không gửi hai lần, giới hạn tần suất theo từng người dùng, và template có localization. Vì các nhà cung cấp bên ngoài có thể lỗi và bị throttle, nên cần retry với backoff, dead-letter queue và các phương án dự phòng. Độ ưu tiên cũng quan trọng, vì một one-time password không thể chờ phía sau các tin nhắn marketing.</p></p></details>
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
        a: `<div class="interview-answer"><p>A <strong>single point of failure</strong> is any component whose failure brings down the whole system. It is removed by adding redundancy: several app servers behind a load balancer, a backup load balancer, a database with replicas and automatic failover, and multi-zone deployment. Redundancy alone is not enough, so health checks and automatic failover are needed, and the failover should be tested because untested failover often does not work. Watch for hidden single points of failure such as a shared config service, DNS, a single message broker, or the deploy pipeline.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p><strong>Single point of failure</strong> là bất kỳ thành phần nào mà khi nó hỏng sẽ kéo sập cả hệ thống. Ta loại bỏ nó bằng cách thêm redundancy: nhiều app server phía sau một load balancer, một load balancer dự phòng, một database có replica và tự động failover, cùng với việc triển khai trên nhiều zone. Chỉ redundancy thôi thì chưa đủ, nên cần health check và tự động failover, và việc failover cần được kiểm thử vì failover chưa được test thường không hoạt động. Hãy để ý các single point of failure ẩn như một config service dùng chung, DNS, một message broker duy nhất, hoặc pipeline deploy.</p></p></details>
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
        a: `<div class="interview-answer"><p>A rate limiter service controls request traffic to protect backends from overload and abuse, and the main concerns are where the counters live, latency, and behavior on failure. Keeping the state in <code>Redis</code> with atomic Lua scripts makes each check fast and safe from race conditions. Token bucket is a good default because it allows short bursts while capping the average rate; a sliding-window log is more accurate but uses more memory. Two key choices are whether to fail open or fail closed when Redis is down (usually fail open) and running the check close to the edge, returning <code>429</code> with a <code>Retry-After</code> header.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Một rate limiter service kiểm soát lưu lượng request để bảo vệ backend khỏi quá tải và lạm dụng, và các mối quan tâm chính là counter được lưu ở đâu, độ trễ, và hành vi khi xảy ra lỗi. Giữ state trong <code>Redis</code> với các Lua script atomic giúp mỗi lần kiểm tra vừa nhanh vừa an toàn khỏi race condition. Token bucket là lựa chọn mặc định tốt vì nó cho phép burst ngắn trong khi vẫn giới hạn tốc độ trung bình; sliding-window log thì chính xác hơn nhưng tốn nhiều bộ nhớ hơn. Hai lựa chọn quan trọng là nên fail open hay fail closed khi Redis chết (thường là fail open) và chạy phần kiểm tra gần edge, trả về <code>429</code> kèm header <code>Retry-After</code>.</p></p></details>
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
        a: `<div class="interview-answer"><p>A <strong>Bloom filter</strong> is a space-efficient way to test set membership that answers either <em>definitely not present</em> or <em>probably present</em>; false positives can happen but false negatives never do. This makes it useful as a cheap in-memory check before an expensive lookup. A common use is avoiding disk reads for keys that do not exist, as done in Cassandra and Bigtable, and it also helps defend against cache-penetration. The trade-offs are that items cannot be deleted from a basic Bloom filter, and the false-positive rate is tuned by the bit-array size and the number of hash functions.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p><strong>Bloom filter</strong> là một cách tiết kiệm bộ nhớ để kiểm tra một phần tử có thuộc tập hợp hay không, và nó trả lời hoặc là <em>chắc chắn không có</em> hoặc là <em>có thể có</em>; false positive có thể xảy ra nhưng false negative thì không bao giờ. Điều này khiến nó hữu ích như một bước kiểm tra rẻ trong bộ nhớ trước khi thực hiện một lần tra cứu tốn kém. Một ứng dụng phổ biến là tránh đọc đĩa cho các key không tồn tại, như Cassandra và Bigtable đang làm, và nó cũng giúp chống lại cache-penetration. Đánh đổi là không thể xóa phần tử khỏi một Bloom filter cơ bản, và tỉ lệ false positive được điều chỉnh qua kích thước mảng bit và số lượng hàm hash.</p></p></details>
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
        a: `<div class="interview-answer"><p>The best first option for distributed transactions is to avoid them by redrawing service boundaries so the transaction fits inside one service. When that is not possible, two-phase commit is avoided because it blocks and does not scale, and a <strong>Saga</strong> is used instead: a series of local transactions with compensating actions to undo work on failure. This means accepting eventual consistency and designing compensations as business actions, such as a refund. Pairing it with the transactional outbox to publish events reliably and making each step idempotent helps, and because sagas have no isolation, intermediate states are guarded with status fields or semantic locks.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Lựa chọn đầu tiên tốt nhất cho distributed transaction là tránh chúng bằng cách vẽ lại ranh giới service sao cho giao dịch nằm gọn trong một service. Khi không thể làm vậy, ta tránh two-phase commit vì nó blocking và không scale được, và dùng <strong>Saga</strong> thay thế: một chuỗi các local transaction kèm các hành động bù trừ để hoàn tác công việc khi có lỗi. Điều này nghĩa là chấp nhận eventual consistency và thiết kế các bù trừ như những hành động nghiệp vụ, chẳng hạn hoàn tiền. Kết hợp nó với transactional outbox để phát event một cách đáng tin cậy và làm cho mỗi bước idempotent sẽ giúp ích, và vì saga không có isolation, các trạng thái trung gian được bảo vệ bằng các trường status hoặc semantic lock.</p></p></details>
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
        a: `<div class="interview-answer"><p><strong>CQRS</strong> separates the write model from the read model so each can be tuned on its own: normalized data for correct writes, and denormalized read models shaped for the queries. It helps most when reads and writes have very different scale or shape, or in complex domains where query needs differ from the transactional model. It is not free, since it means two models, usually eventual consistency between them, and more moving parts, so it is overkill for simple CRUD. It works well with event sourcing but does not require it, and the main risk is the read model lagging behind the write model.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p><strong>CQRS</strong> tách write model khỏi read model để mỗi bên có thể được tối ưu riêng: dữ liệu normalized cho việc ghi đúng đắn, và các read model denormalized được định hình theo các truy vấn. Nó giúp nhiều nhất khi đọc và ghi có quy mô hoặc hình dạng rất khác nhau, hoặc trong các domain phức tạp nơi nhu cầu truy vấn khác với model giao dịch. Nó không miễn phí, vì nghĩa là hai model, thường là eventual consistency giữa chúng, và nhiều thành phần hơn, nên nó là thừa thãi cho CRUD đơn giản. Nó phối hợp tốt với event sourcing nhưng không bắt buộc phải có, và rủi ro chính là read model bị trễ so với write model.</p></p></details>
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
        a: `<div class="interview-answer"><p>A file storage system like Google Drive or Dropbox should separate metadata from the actual file bytes: the bytes go into object storage such as S3, while a metadata service tracks the file tree, versions, sharing, and sync state. Files are split into chunks, and each chunk is identified by its hash, which enables deduplication, resumable uploads, and delta sync that transfers only changed chunks. Clients get pre-signed URLs to upload and download directly, so bytes do not pass through the app servers. Sync is the hard part, needing a change feed and conflict resolution, along with care for large files, metadata consistency, and permission checks on sharing.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Một hệ thống lưu trữ file như Google Drive hay Dropbox nên tách metadata khỏi phần byte thực của file: byte đi vào object storage như S3, còn một metadata service theo dõi cây file, các version, việc chia sẻ và trạng thái sync. File được chia thành các chunk, và mỗi chunk được định danh bằng hash của nó, điều này cho phép deduplication, upload có thể tiếp tục, và delta sync chỉ truyền các chunk đã thay đổi. Client nhận pre-signed URL để upload và download trực tiếp, nên byte không đi qua các app server. Sync là phần khó nhất, cần một change feed và cơ chế giải quyết xung đột, cùng với việc quan tâm đến file lớn, tính nhất quán của metadata, và kiểm tra quyền khi chia sẻ.</p></p></details>
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
        a: `<div class="interview-answer"><p>A <strong>cache stampede</strong> happens when a popular key expires and many concurrent requests all miss at the same time and hit the database together. A main fix is a lock or single-flight approach, where only one request recomputes the value while the others wait or serve stale data, so the database sees one query instead of thousands. Other useful tactics are refreshing a bit before the TTL, serving stale data while refreshing in the background, and adding random jitter to TTLs so keys do not expire together. A related problem is cache penetration, where misses for keys that do not exist are handled with a Bloom filter or negative caching.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p><strong>Cache stampede</strong> xảy ra khi một key phổ biến hết hạn và nhiều request đồng thời cùng miss một lúc rồi cùng dồn vào database. Một cách khắc phục chính là dùng lock hoặc single-flight, nơi chỉ một request tính lại giá trị trong khi các request khác chờ hoặc dùng dữ liệu cũ, để database chỉ thấy một truy vấn thay vì hàng nghìn. Các chiến thuật hữu ích khác là làm mới một chút trước khi TTL hết, phục vụ dữ liệu cũ trong khi làm mới ở nền, và thêm jitter ngẫu nhiên vào TTL để các key không hết hạn cùng lúc. Một vấn đề liên quan là cache penetration, nơi các miss cho những key không tồn tại được xử lý bằng Bloom filter hoặc negative caching.</p></p></details>
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
        a: `<div class="interview-answer"><p>Generating unique IDs in a distributed system is a trade-off between uniqueness, sortability, and coordination cost. UUIDv4 needs no coordination but is random, which makes it a poor database key and not sortable. A common choice is a Snowflake-style 64-bit ID that packs a timestamp, machine ID, and a sequence, giving roughly time-sorted IDs with no per-ID coordination, though it needs unique machine IDs and depends on clocks. For sortable IDs without machine setup, <code>ULID</code> or <code>UUIDv7</code> are modern options, while ticket servers and database sequences work but add a central bottleneck.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Sinh unique ID trong hệ thống phân tán là một sự đánh đổi giữa tính duy nhất, khả năng sắp xếp, và chi phí phối hợp. UUIDv4 không cần phối hợp nhưng ngẫu nhiên, khiến nó là một database key kém và không sắp xếp được. Một lựa chọn phổ biến là ID 64-bit kiểu Snowflake gói timestamp, machine ID và một sequence, cho ra các ID gần như được sắp theo thời gian mà không cần phối hợp cho từng ID, dù nó cần machine ID duy nhất và phụ thuộc vào đồng hồ. Để có ID sắp xếp được mà không cần thiết lập machine, <code>ULID</code> hoặc <code>UUIDv7</code> là các lựa chọn hiện đại, trong khi ticket server và database sequence vẫn dùng được nhưng thêm một điểm nghẽn tập trung.</p></p></details>
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
        a: `<div class="interview-answer"><p>Exactly-once <em>delivery</em> is not possible over an unreliable network, because the sender can never be sure its message or the acknowledgment arrived, so it must retry, which can create duplicates. What is achievable is exactly-once <em>processing</em>, done with at-least-once delivery plus idempotent consumers or deduplication on a unique message ID. The real work is making the receiver idempotent, deduping by key, and using the outbox and inbox patterns. Kafka's exactly-once feature works this way within Kafka, using idempotent producers and transactions, not across arbitrary external systems.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Exactly-once <em>delivery</em> là không thể trên một mạng không đáng tin cậy, vì bên gửi không bao giờ chắc chắn tin nhắn hay acknowledgment của mình đã đến, nên nó phải retry, và điều này có thể tạo ra bản trùng. Cái đạt được là exactly-once <em>processing</em>, thực hiện bằng at-least-once delivery kết hợp với consumer idempotent hoặc khử trùng lặp theo một message ID duy nhất. Công việc thực sự là làm cho bên nhận idempotent, khử trùng theo key, và dùng outbox và inbox pattern. Tính năng exactly-once của Kafka hoạt động theo cách này bên trong Kafka, dùng idempotent producer và transaction, chứ không phải xuyên qua các hệ thống bên ngoài tùy ý.</p></p></details>
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
        a: `<div class="interview-answer"><p>A distributed lock in Redis often starts with <code>SETNX</code>, and the important part is understanding its failure modes. An expiry is always needed so a crashed holder does not deadlock, but if a process pauses past the TTL, the lock can expire and another client can take it, leaving two clients that both think they hold it. A <strong>fencing token</strong>, a number that always increases and is checked by the protected resource, blocks writes from a stale holder. Redlock across nodes exists but is debated, so the safer path is often to avoid locks and rely on idempotency, unique constraints, or conditional updates.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Một distributed lock trong Redis thường bắt đầu với <code>SETNX</code>, và phần quan trọng là hiểu các chế độ thất bại của nó. Luôn cần một thời gian hết hạn để một holder bị crash không gây deadlock, nhưng nếu một tiến trình tạm dừng vượt quá TTL, lock có thể hết hạn và một client khác chiếm lấy, dẫn đến hai client cùng nghĩ mình đang giữ lock. Một <strong>fencing token</strong>, một con số luôn tăng và được kiểm tra bởi tài nguyên được bảo vệ, sẽ chặn các thao tác ghi từ một holder cũ. Redlock trên nhiều node có tồn tại nhưng còn gây tranh cãi, nên con đường an toàn hơn thường là tránh dùng lock và dựa vào idempotency, unique constraint, hoặc conditional update.</p></p></details>
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
        a: `<div class="interview-answer"><p>Back-of-envelope capacity estimation is about showing a structured method and rounding hard, not producing an exact number. A top-down approach starts with users, then requests per user per day, divided by about 10^5 seconds in a day to get average QPS, then multiplied by a peak factor. Storage is estimated as writes per day times bytes per record times retention, and memory as the hot working set to cache. Memorizing round numbers and always splitting read QPS from write QPS makes this fast, and the numbers are used to justify the architecture choices.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Ước lượng capacity kiểu back-of-envelope là để thể hiện một phương pháp có cấu trúc và làm tròn mạnh tay, chứ không phải cho ra một con số chính xác. Cách tiếp cận top-down bắt đầu từ số người dùng, rồi số request mỗi người mỗi ngày, chia cho khoảng 10^5 giây trong một ngày để ra QPS trung bình, rồi nhân với một hệ số peak. Storage được ước lượng bằng số lần ghi mỗi ngày nhân với số byte mỗi bản ghi nhân với thời gian lưu trữ, còn bộ nhớ là phần working set nóng cần cache. Ghi nhớ vài con số tròn và luôn tách read QPS khỏi write QPS giúp làm việc này nhanh, và các con số được dùng để biện minh cho các lựa chọn kiến trúc.</p></p></details>
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
        a: `<div class="interview-answer"><p>Quorums let the consistency and availability balance be tuned per operation. With <strong>N</strong> replicas, requiring <strong>R</strong> read acknowledgments and <strong>W</strong> write acknowledgments gives strong consistency when R + W is greater than N, because the read set and write set are guaranteed to overlap on at least one up-to-date replica. So W=N with R=1 favors fast reads, W=1 with R=N favors fast writes, and a middle setting balances both. This overlap alone is not full linearizability, so read repair and version tracking are still needed, and it is the tuning knob behind Dynamo, Cassandra, and Riak.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Quorum cho phép điều chỉnh cân bằng giữa consistency và availability theo từng thao tác. Với <strong>N</strong> replica, yêu cầu <strong>R</strong> acknowledgment khi đọc và <strong>W</strong> acknowledgment khi ghi sẽ cho strong consistency khi R + W lớn hơn N, vì tập đọc và tập ghi được đảm bảo giao nhau ở ít nhất một replica cập nhật. Vậy nên W=N với R=1 thiên về đọc nhanh, W=1 với R=N thiên về ghi nhanh, và một thiết lập ở giữa cân bằng cả hai. Chỉ riêng phần giao nhau này chưa phải là linearizability đầy đủ, nên vẫn cần read repair và theo dõi version, và đây là núm điều chỉnh phía sau Dynamo, Cassandra và Riak.</p></p></details>
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
        a: `<div class="interview-answer"><p>To prevent double charging when a payment request times out and is retried, the fix is idempotency rather than locking. The client creates one idempotency key per payment attempt and sends it on every retry, and the server stores that key with the result in the same transaction as the charge. The first request is processed and its keyed result is saved, and any retry with the same key returns the saved result instead of charging again. Storing the key atomically with the effect, using a uniqueness constraint to handle concurrent retries, and passing the key to the payment provider are the details that matter.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Để tránh charge hai lần khi một request thanh toán bị timeout và được retry, cách khắc phục là idempotency chứ không phải lock. Client tạo một idempotency key duy nhất cho mỗi lần thử thanh toán và gửi nó trong mọi lần retry, còn server lưu key đó cùng với kết quả trong cùng một transaction với việc charge. Request đầu tiên được xử lý và kết quả gắn với key được lưu lại, và bất kỳ retry nào với cùng key sẽ trả về kết quả đã lưu thay vì charge lại. Lưu key một cách atomic cùng với hiệu ứng của nó, dùng ràng buộc duy nhất để xử lý các retry đồng thời, và truyền key cho nhà cung cấp thanh toán là những chi tiết quan trọng.</p></p></details>
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
];
