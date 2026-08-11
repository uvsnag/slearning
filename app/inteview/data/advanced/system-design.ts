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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Caching lưu dữ liệu hay dùng ở một nơi truy cập nhanh để cải thiện tốc độ và giảm tải cho nguồn dữ liệu chính. Lựa chọn mặc định phổ biến là <strong>cache-aside</strong> kết hợp với LRU eviction và một TTL vừa phải, nhờ đó chỉ những dữ liệu thực sự có người yêu cầu mới được cache. Phần khó nhất là invalidation, tức là giữ cho cache đồng bộ với nguồn để người dùng không nhận dữ liệu cũ. Cache chỉ là một lớp tăng hiệu năng chứ không phải nơi lưu trữ chính, nên hệ thống vẫn phải hoạt động được khi cache rỗng hoặc bị chết.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Database index là một cấu trúc đã được sắp xếp, thường là B-tree, giúp database tìm các dòng một cách nhanh chóng thay vì quét toàn bộ bảng. Index không hề miễn phí: mỗi lần ghi đều phải cập nhật lại index và index còn chiếm thêm dung lượng đĩa, nên chỉ nên tạo index bám sát các mẫu truy vấn thực tế. Vài ý tưởng hữu ích gồm composite index với thứ tự cột đúng và covering index có thể trả lời một truy vấn chỉ từ index. Một sai lầm phổ biến là dùng hàm hoặc để lệch kiểu dữ liệu trong mệnh đề <code>WHERE</code>, khiến index bị vô hiệu hóa một cách âm thầm, vì vậy nên dùng <code>EXPLAIN</code> để xác nhận index có được sử dụng.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>SQL database là một lựa chọn mặc định tốt vì nó cung cấp ACID transaction, join và schema cố định. NoSQL chỉ phù hợp khi có một nhu cầu đặc thù nổi trội, chẳng hạn lượng ghi cực lớn, schema cần linh hoạt, hoặc dữ liệu có dạng đặc thù như document, key-value hay graph. Với NoSQL, vì không có join nên phải mô hình hoá dữ liệu theo đúng các truy vấn ngay từ đầu. Nhiều hệ thống dùng cả hai, ví dụ PostgreSQL cho dữ liệu cốt lõi, Redis cho cache và Elasticsearch cho tìm kiếm.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Sharding chia dữ liệu ra nhiều máy để mỗi node chỉ giữ một phần dữ liệu, nhờ đó việc ghi có thể mở rộng vượt quá một server. Shard key là lựa chọn quan trọng nhất, vì nó phải phân tán tải đều và khớp với các mẫu truy vấn, nếu không một số shard sẽ trở thành hotspot. Sharding rất khó đảo ngược, nên hãy thử read replica và caching trước đã. Range key thì đơn giản nhưng có thể tạo hotspot, hash key phân tán dữ liệu tốt nhưng làm hỏng range scan, và join cùng transaction xuyên shard trở nên cực kỳ khó.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Replication giữ các bản sao của dữ liệu trên nhiều node, giúp mở rộng khả năng đọc và cung cấp failover. Lựa chọn chính là synchronous so với asynchronous: synchronous tránh được mất dữ liệu nhưng thêm độ trễ khi ghi, còn asynchronous nhanh hơn nhưng có thể mất các bản ghi gần đây khi failover. Các thiết lập single-leader rất phổ biến, trong đó ghi đi vào primary và đọc đi vào các replica. Một vấn đề thường gặp là replication lag, khiến người dùng không nhìn thấy ngay chính thay đổi mà họ vừa thực hiện.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>API gateway là một điểm vào duy nhất cho mọi request của client đến các service backend. Nó gom về một chỗ những phần việc dùng chung như authentication, rate limiting, TLS termination, định tuyến, gộp request và giám sát, nhờ đó mỗi service chỉ cần lo logic nghiệp vụ của mình. Đánh đổi là thêm một chặng mạng và nguy cơ trở thành single point of failure, nên gateway cần được chạy ở chế độ dự phòng. Nó khác load balancer thuần tuý ở chỗ hoạt động tại Layer 7 và hiểu được nội dung ứng dụng; và tuyệt đối đừng để nó phình to thành nơi chứa logic nghiệp vụ.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Message queue tách producer khỏi consumer theo thời gian, để producer có thể gửi một message và consumer xử lý nó sau theo nhịp độ riêng của mình. Nó hữu ích để làm mượt các đợt tăng đột biến lưu lượng, làm những việc chậm ở nền như gửi email, và giúp một service vẫn chạy được khi service khác đang gặp sự cố. Cái giá phải trả là thêm latency, eventual consistency, và khả năng message bị trùng hoặc sai thứ tự, nên consumer bắt buộc phải idempotent. Hai quyết định quan trọng là chọn mức bảo đảm gửi (delivery guarantee), và chọn giữa một queue thuần tuý như SQS hay RabbitMQ với một log như Kafka cho phép replay; ngoài ra luôn cần dead-letter queue để hứng các message lỗi.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Monolith là một ứng dụng deploy được duy nhất, còn microservices chia ứng dụng thành các service nhỏ độc lập. Bắt đầu với một monolith có cấu trúc tốt thường là lựa chọn tốt nhất, vì microservices thêm các lời gọi mạng, distributed transaction và chi phí vận hành. Microservices hữu ích khi nhiều team cần deploy độc lập hoặc khi các thành phần cần scale rất khác nhau. Một thất bại rất phổ biến là chia quá sớm và tạo ra một distributed monolith — gánh đủ cái giá của microservices mà chẳng được lợi ích nào.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Rate limiting kiểm soát số request mà một client có thể thực hiện trong một khoảng thời gian, giúp chống lạm dụng, chặn các client lỗi gọi liên tục, tránh chi phí đội lên đột ngột, đồng thời chia đều tài nguyên cho mọi người dùng. Token bucket là lựa chọn mặc định phổ biến vì nó cho phép các đợt burst ngắn trong khi vẫn giới hạn tốc độ trung bình, sliding window thì chính xác hơn nhưng nặng hơn, còn fixed window đơn giản nhất nhưng có các đợt tăng vọt ở ranh giới. Trong một hệ phân tán, các bộ đếm được giữ trong một store dùng chung như Redis bằng các thao tác atomic. Response nên trả về HTTP <code>429</code> kèm header <code>Retry-After</code>, và nên áp giới hạn theo từng user hoặc API key thay vì theo IP, vì IP không còn chính xác khi nhiều người dùng cùng nằm sau một NAT.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>URL shortener chủ yếu là một bài toán distributed ID cộng với một key-value store thiên về đọc. Một cách tiếp cận phổ biến là base62-encode một bộ đếm hoặc cấp cho mỗi node một dải key được phân bổ trước, cách này tránh được các va chạm mà việc hash URL sẽ gây ra. Vì đọc nhiều hơn ghi rất nhiều, thiết kế dùng một key-value store đơn giản với caching mạnh và một CDN đặt trước các redirect. Việc chọn redirect <code>301</code> hay <code>302</code> là có chủ đích, trong đó 302 được dùng khi cần thống kê lượt click; các vấn đề khác cần tính đến gồm custom alias, thời hạn hết hiệu lực, và cách sinh key không bị trùng.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một hệ thống chat dùng kết nối lâu dài như WebSockets để server có thể đẩy message thay vì để client hỏi liên tục. Vì người dùng kết nối tới các server khác nhau, một message phải được định tuyến tới server đang giữ kết nối của người nhận, dùng một lớp pub/sub như Redis hay Kafka và một session registry ánh xạ người dùng tới server. Message được lưu vào một store thiên về ghi và phân vùng theo cuộc hội thoại, vừa để giữ lịch sử vừa để gửi lại khi người nhận online trở lại. Những chi tiết quan trọng là thứ tự trong từng cuộc hội thoại, fan-out cho các nhóm lớn, delivery và read receipt, presence qua heartbeat, và backfill message sau khi kết nối lại.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Ba phương pháp này đánh đổi giữa chiều truyền, độ phức tạp và mức phù hợp với hạ tầng. Long polling là phương án dự phòng: client gửi request rồi server giữ kết nối đó cho tới khi có dữ liệu mới trả về; cách này chạy được ở mọi môi trường nhưng khá tốn tài nguyên. Server-Sent Events là một luồng một chiều từ server tới client qua HTTP thuần túy và tự động kết nối lại, phù hợp cho feed, thông báo và tỷ số trực tiếp. WebSockets là full-duplex trên một kết nối, phù hợp cho chat, game và soạn thảo cộng tác, nhưng mọi kết nối lâu dài đều đòi hỏi cấu hình cẩn thận ở phía load balancer và proxy.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Eventual consistency nghĩa là khi các lần ghi dừng lại, mọi replica sẽ hội tụ về cùng một giá trị, nhưng trong một khoảng thời gian ngắn thì những người đọc khác nhau có thể thấy dữ liệu khác nhau. Đó là sự đánh đổi để có availability cao hơn và latency thấp hơn, như trong các hệ AP. Nó chấp nhận được cho những thứ như lượt like, số follower và feed, nhưng không dùng cho các giá trị như số dư tài khoản. Một vấn đề phổ biến là read-your-own-writes, khi một người dùng không thấy bản cập nhật của chính mình, có thể xử lý bằng session consistency, đọc từ leader, hoặc cập nhật UI theo kiểu optimistic.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một circuit breaker ngăn phía gọi liên tục gọi một service vốn đã đang lỗi, để nó fail nhanh thay vì chồng chất các timeout và ngăn các thất bại lan truyền. Nó có ba trạng thái: closed là lúc hoạt động bình thường; open là sau khi có quá nhiều lỗi nên request bị từ chối ngay lập tức; còn half-open là lúc cho một vài request đi qua để thăm dò xem service đã hồi phục hay chưa. Nó bảo vệ các thread của phía gọi trong khi cho service đang lỗi thời gian để phục hồi, và nó phối hợp tốt với timeout, retry kèm backoff, và một fallback. Thách thức chính là tinh chỉnh ngưỡng sao cho circuit breaker không mở ra chỉ vì vài lỗi vặt, nhưng cũng không phản ứng quá chậm khi sự cố thật xảy ra.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Một rate limiter service kiểm soát lưu lượng request để bảo vệ backend khỏi quá tải và lạm dụng, và ba điều cần cân nhắc chính là counter lưu ở đâu, độ trễ thêm vào bao nhiêu, và hệ thống hành xử thế nào khi có sự cố. Giữ state trong <code>Redis</code> với các Lua script atomic giúp mỗi lần kiểm tra vừa nhanh vừa an toàn khỏi race condition. Token bucket là lựa chọn mặc định tốt vì nó cho phép burst ngắn trong khi vẫn giới hạn tốc độ trung bình; sliding-window log thì chính xác hơn nhưng tốn nhiều bộ nhớ hơn. Hai lựa chọn quan trọng là nên fail open hay fail closed khi Redis chết (thường là fail open) và chạy phần kiểm tra gần edge, trả về <code>429</code> kèm header <code>Retry-After</code>.</p></p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Lựa chọn đầu tiên tốt nhất cho distributed transaction là tránh chúng bằng cách vẽ lại ranh giới service sao cho giao dịch nằm gọn trong một service. Khi không thể làm vậy, ta tránh two-phase commit vì nó blocking và không scale được, và dùng <strong>Saga</strong> thay thế: một chuỗi các local transaction kèm các hành động bù trừ để hoàn tác công việc khi có lỗi. Điều này nghĩa là chấp nhận eventual consistency và thiết kế các bù trừ như những hành động nghiệp vụ, chẳng hạn hoàn tiền. Nên kết hợp saga với transactional outbox để phát event một cách đáng tin cậy, và làm cho từng bước đều idempotent. Ngoài ra vì saga không có isolation, các trạng thái trung gian phải được bảo vệ bằng trường status hoặc semantic lock.</p></p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p><strong>CQRS</strong> tách write model khỏi read model để mỗi bên có thể được tối ưu riêng: dữ liệu normalized cho việc ghi đúng đắn, và các read model denormalized được định hình theo các truy vấn. Nó giúp nhiều nhất khi đọc và ghi có quy mô hoặc hình dạng rất khác nhau, hoặc trong các domain phức tạp nơi nhu cầu truy vấn khác với model giao dịch. Nhưng nó không hề miễn phí: phải duy trì hai model, thường phải chấp nhận eventual consistency giữa hai bên, và hệ thống có thêm nhiều thành phần — nên với CRUD đơn giản thì đây là lựa chọn thừa thãi. Nó phối hợp tốt với event sourcing nhưng không bắt buộc phải có, và rủi ro chính là read model bị trễ so với write model.</p></p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p><strong>Cache stampede</strong> xảy ra khi một key phổ biến hết hạn và nhiều request đồng thời cùng miss một lúc rồi cùng dồn vào database. Cách khắc phục chính là dùng lock hoặc single-flight: chỉ để đúng một request đi tính lại giá trị, còn các request khác thì chờ hoặc tạm dùng dữ liệu cũ, nhờ vậy database chỉ nhận một truy vấn thay vì hàng nghìn. Các chiến thuật hữu ích khác là làm mới một chút trước khi TTL hết, phục vụ dữ liệu cũ trong khi làm mới ở nền, và thêm jitter ngẫu nhiên vào TTL để các key không hết hạn cùng lúc. Một vấn đề họ hàng là cache penetration — các request liên tục hỏi những key vốn không tồn tại — và cách xử lý là dùng Bloom filter hoặc negative caching.</p></p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Sinh unique ID trong hệ thống phân tán là một sự đánh đổi giữa tính duy nhất, khả năng sắp xếp, và chi phí phối hợp. UUIDv4 không cần phối hợp giữa các node nhưng lại hoàn toàn ngẫu nhiên, nên vừa không sắp xếp được vừa là một database key kém hiệu quả. Một lựa chọn phổ biến là ID 64-bit kiểu Snowflake gói timestamp, machine ID và một sequence, cho ra các ID gần như được sắp theo thời gian mà không cần phối hợp cho từng ID, dù nó cần machine ID duy nhất và phụ thuộc vào đồng hồ. Để có ID sắp xếp được mà không cần thiết lập machine, <code>ULID</code> hoặc <code>UUIDv7</code> là các lựa chọn hiện đại, trong khi ticket server và database sequence vẫn dùng được nhưng thêm một điểm nghẽn tập trung.</p></p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Exactly-once <em>delivery</em> là không thể trên một mạng không đáng tin cậy, vì bên gửi không bao giờ chắc chắn tin nhắn hay acknowledgment của mình đã đến, nên nó phải retry, và điều này có thể tạo ra bản trùng. Thứ thực sự đạt được là exactly-once <em>processing</em>, làm bằng cách kết hợp at-least-once delivery với consumer idempotent hoặc khử trùng lặp theo một message ID duy nhất. Nói cách khác, phần việc thật nằm ở phía người nhận: làm cho nó idempotent, khử trùng theo key, và áp dụng outbox cùng inbox pattern. Tính năng exactly-once của Kafka hoạt động theo cách này bên trong Kafka, dùng idempotent producer và transaction, chứ không phải xuyên qua các hệ thống bên ngoài tùy ý.</p></p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Ước lượng capacity kiểu back-of-envelope là để thể hiện một phương pháp có cấu trúc và làm tròn mạnh tay, chứ không phải cho ra một con số chính xác. Cách tiếp cận top-down bắt đầu từ số người dùng, rồi số request mỗi người mỗi ngày, chia cho khoảng 10^5 giây trong một ngày để ra QPS trung bình, rồi nhân với một hệ số peak. Storage được ước lượng bằng số lần ghi mỗi ngày nhân với số byte mỗi bản ghi nhân với thời gian lưu trữ, còn bộ nhớ là phần working set nóng cần cache. Thuộc sẵn vài con số tròn và luôn tách read QPS khỏi write QPS sẽ giúp bạn tính rất nhanh, và mục đích cuối cùng của những con số này là để lý giải cho các lựa chọn kiến trúc.</p></p></details>
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
      // ──── REAL-PROJECT DESIGN WALKTHROUGHS ────
      {
        q: 'How do you design a system in a real project? (the 7-step framework: requirements → estimation → API → data model → high-level → deep dive → failure modes)',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Use the same repeatable framework every time so the design is driven by numbers instead of by favourite technologies. First clarify functional and non-functional requirements, then do a back-of-envelope estimate of QPS, storage and bandwidth, then define the API, then the data model, then draw the high-level components, then deep dive into the one or two hard parts, and finally walk through failure modes and bottlenecks. In a real project two extra steps matter that interviews often skip: start from the simplest thing that works and only add Kafka, sharding or microservices when a measured number forces it, and decide up front how you will observe the system in production. The single most common mistake is jumping to the architecture diagram before knowing the read/write ratio.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hãy dùng cùng một khung làm việc lặp đi lặp lại mỗi lần, để thiết kế được dẫn dắt bởi các con số chứ không phải bởi công nghệ mình thích. Đầu tiên làm rõ yêu cầu chức năng và phi chức năng, rồi ước lượng nhanh QPS, dung lượng lưu trữ và băng thông, tiếp theo định nghĩa API, rồi tới data model, rồi vẽ các thành phần ở mức tổng quan, sau đó đi sâu vào một hai phần khó nhất, và cuối cùng đi qua các kịch bản lỗi và điểm nghẽn. Trong dự án thật có thêm hai bước mà phỏng vấn hay bỏ qua: bắt đầu từ giải pháp đơn giản nhất chạy được và chỉ thêm Kafka, sharding hay microservices khi có một con số đo được bắt buộc phải làm vậy; và quyết định ngay từ đầu bạn sẽ quan sát hệ thống trong production bằng cách nào. Sai lầm phổ biến nhất là vẽ kiến trúc trước khi biết tỷ lệ đọc/ghi.</p></details>
<p><strong>The 7 steps (spend roughly this much of a 45-minute interview on each):</strong></p>
<table>
<tr><th>#</th><th>Step</th><th>Time</th><th>What you must produce</th></tr>
<tr><td>1</td><td>Clarify requirements</td><td>5 min</td><td>Functional list + non-functional numbers (users, latency SLO, consistency needs)</td></tr>
<tr><td>2</td><td>Capacity estimation</td><td>5 min</td><td>QPS (avg + peak), storage/year, bandwidth, cache size</td></tr>
<tr><td>3</td><td>API design</td><td>5 min</td><td>3-5 endpoints with request/response shapes</td></tr>
<tr><td>4</td><td>Data model</td><td>5 min</td><td>Tables/collections, partition key, indexes, SQL vs NoSQL decision</td></tr>
<tr><td>5</td><td>High-level design</td><td>10 min</td><td>Boxes and arrows: clients → LB → services → cache → DB → queue</td></tr>
<tr><td>6</td><td>Deep dive</td><td>10 min</td><td>The 1-2 genuinely hard parts (hot partition, exactly-once, seat locking…)</td></tr>
<tr><td>7</td><td>Failure modes &amp; bottlenecks</td><td>5 min</td><td>What breaks first at 10x, what happens when each component dies</td></tr>
</table>
<p><strong>Step 1 — the questions to always ask:</strong></p>
<ul>
<li><strong>Scope</strong>: which features are in and out? ("Do we need search? Analytics? Mobile push?")</li>
<li><strong>Scale</strong>: DAU, requests/sec, data size, growth rate.</li>
<li><strong>Read/write ratio</strong> — this one decision drives caching, replication and sharding.</li>
<li><strong>Consistency</strong>: is stale data acceptable? (feed = yes, bank balance = no)</li>
<li><strong>Latency SLO</strong>: p99 target, not average.</li>
<li><strong>Availability</strong>: 99.9% (8.7h/year down) vs 99.99% (52min/year) — the extra nine costs real money.</li>
</ul>
<pre>Non-functional requirements you should write on the board:

  DAU              10 M
  Peak QPS         write 2k / read 200k     ← 100:1 read-heavy → cache + replicas
  p99 latency      &lt; 200 ms
  Data retention   5 years
  Consistency      read-your-own-writes, eventual for others
  Availability     99.95%</pre>
<p><strong>Step 5 — the default skeleton that fits 80% of systems:</strong></p>
<pre>[Client] → [CDN (static)] → [API Gateway / LB]
                                  ↓
                    [Stateless service instances]
                       ↓            ↓          ↓
                  [Cache]     [Primary DB]  [Message queue]
                              [Replicas]         ↓
                                            [Async workers] → [Object store / Search / Analytics]</pre>
<p><strong>Step 7 — the questions that separate senior answers:</strong></p>
<ul>
<li>What is the <strong>single bottleneck</strong> at 10x traffic? (usually the write path of one database)</li>
<li>What happens when the cache dies — can the DB survive the cold-start stampede?</li>
<li>What is the <strong>blast radius</strong> of one bad deploy or one hot tenant?</li>
<li>How do you roll back? Feature flags, migrations that are backward compatible in both directions.</li>
<li>How do you know it is broken before the customer tells you? (RED metrics: Rate, Errors, Duration)</li>
</ul>
<p><strong>What is different in a real project vs an interview:</strong></p>
<ul>
<li><strong>Start simpler</strong>: one Postgres + one cache handles far more than people expect (tens of thousands of QPS read). Add complexity when a metric forces it, not when a blog post suggests it.</li>
<li><strong>Migration path matters</strong>: you rarely build greenfield. Design the strangler-fig route from what exists today.</li>
<li><strong>Cost is a requirement</strong>: cross-AZ traffic, storage tiers, and idle Kafka clusters show up on the bill.</li>
<li><strong>Team shape</strong>: Conway's law — service boundaries that don't match team boundaries generate permanent friction.</li>
</ul>
<div class="key-point">Say the numbers out loud before drawing anything. "200k read QPS, 2k write QPS, 100:1" instantly justifies read replicas + Redis, while "2k writes with strict ordering per user" justifies partitioning by user id. A design defended by numbers always beats a design defended by tool names.</div>`,
      },
      {
        q: 'How would you design a ticket booking system (cinema / concert seat reservation)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Seat booking is fundamentally an inventory-with-exclusivity problem: every seat may be sold exactly once, while thousands of users look at the same seat map. The design has three phases — browse (heavily cached, eventually consistent), hold (a short exclusive reservation of 5-10 minutes created with a strongly consistent write), and confirm (payment succeeds and the hold becomes a booking). The correctness comes from the database, not from application locks: a unique constraint on (show_id, seat_id) or a conditional update from AVAILABLE to HELD makes double booking impossible even under concurrency. Expired holds must be released by a reliable background job or a TTL, and the whole flow must be idempotent because payment callbacks are retried. Seat maps are cached per show and invalidated on state change, and hot shows are protected by a virtual waiting room.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Đặt chỗ theo ghế về bản chất là bài toán tồn kho có tính độc quyền: mỗi ghế chỉ được bán đúng một lần, trong khi hàng nghìn người cùng nhìn vào một sơ đồ ghế. Thiết kế gồm ba giai đoạn — duyệt (cache mạnh, nhất quán cuối cùng), giữ chỗ (một reservation độc quyền ngắn 5-10 phút, tạo bằng một write nhất quán mạnh), và xác nhận (thanh toán thành công thì hold trở thành booking). Tính đúng đắn đến từ database chứ không phải từ lock ở tầng ứng dụng: một unique constraint trên (show_id, seat_id) hoặc một conditional update từ AVAILABLE sang HELD khiến việc đặt trùng là bất khả thi ngay cả khi có tranh chấp. Các hold hết hạn phải được giải phóng bằng một job nền đáng tin cậy hoặc TTL, và toàn bộ luồng phải idempotent vì callback thanh toán sẽ được gửi lại nhiều lần. Sơ đồ ghế được cache theo từng suất chiếu và bị invalidate khi có thay đổi trạng thái, còn các suất hot thì được bảo vệ bằng phòng chờ ảo.</p></details>
<p><strong>1. Requirements</strong></p>
<ul>
<li><strong>Functional</strong>: browse shows → view seat map → select seats → hold → pay → e-ticket; cancel/refund.</li>
<li><strong>Non-functional</strong>: <strong>no double booking, ever</strong>; seat map read p99 &lt; 300 ms; spiky traffic (a popular concert = 100x normal for 60 seconds).</li>
<li>Read/write ratio is extreme: ~1000 seat-map reads per 1 booking.</li>
</ul>
<p><strong>2. Data model (relational — you need transactions here)</strong></p>
<pre>shows        (show_id PK, venue_id, event_id, starts_at)
seats        (seat_id PK, venue_id, row, number, tier)          -- physical, static
show_seats   (show_id, seat_id, status, hold_id, price,
              version, updated_at,  PRIMARY KEY (show_id, seat_id))
holds        (hold_id PK, user_id, show_id, expires_at, status)
bookings     (booking_id PK, hold_id UNIQUE, user_id, payment_id, total, status)

status: AVAILABLE → HELD → BOOKED
                      ↘ (expiry) → AVAILABLE</pre>
<p><strong>3. The core: how to hold seats without double booking</strong></p>
<pre>-- Option A: conditional UPDATE (optimistic, one round trip, scales best)
UPDATE show_seats
   SET status = 'HELD', hold_id = :holdId, updated_at = now()
 WHERE show_id = :showId
   AND seat_id IN (:seatIds)
   AND status = 'AVAILABLE';          -- ← the guard

-- rows affected == seatIds.size()  → success, commit
-- rows affected &lt;  seatIds.size()  → someone took a seat → ROLLBACK, tell user

-- Option B: SELECT ... FOR UPDATE (pessimistic; simple, but holds row locks
--           for the whole transaction — fine for small seat counts)
SELECT * FROM show_seats
 WHERE show_id = :showId AND seat_id IN (:seatIds) AND status='AVAILABLE'
   FOR UPDATE;                        -- lock rows, then update

-- Always order seat ids to avoid deadlock between two concurrent multi-seat holds!</pre>
<p><strong>4. The booking flow</strong></p>
<pre>Browse   GET /shows/{id}/seats        → cached seat map (5-10s TTL, or push via SSE)
Hold     POST /shows/{id}/holds       → {seatIds, idempotencyKey}
                                       → 201 {holdId, expiresAt: now+8min}
Pay      POST /holds/{holdId}/pay     → payment provider (idempotency key = holdId)
Confirm  webhook /payments/callback   → hold → BOOKED, issue ticket
Expire   background job / Redis TTL   → HELD + expired → AVAILABLE</pre>
<p><strong>5. Releasing expired holds — three options</strong></p>
<table>
<tr><th>Approach</th><th>How</th><th>Trade-off</th></tr>
<tr><td>Lazy expiry</td><td>Treat HELD rows with expires_at &lt; now() as available in the hold query</td><td>Zero moving parts, always correct; seat map may show stale HELD until swept</td></tr>
<tr><td>Sweeper job</td><td>Every 30s: UPDATE ... WHERE status='HELD' AND expires_at &lt; now()</td><td>Simple, needs leader election so only one instance sweeps</td></tr>
<tr><td>Redis TTL key</td><td>Hold = Redis key with TTL; keyspace-expiry event releases the seat</td><td>Fastest, but Redis is now in the correctness path — expiry events can be lost</td></tr>
</table>
<p>Best practice: <strong>lazy expiry as the source of truth + a sweeper for tidiness</strong>. Never rely on a Redis notification alone for correctness.</p>
<p><strong>6. Handling the flash-sale spike (a big concert on-sale)</strong></p>
<ul>
<li><strong>Virtual waiting room</strong>: admit N users/second into the booking flow from a queue; everyone else sees a position number. This bounds the load on the seat inventory.</li>
<li><strong>Seat map from cache</strong>, not from the DB — a per-show cached bitmap invalidated on every state change.</li>
<li><strong>Rate limit per user/IP</strong> and require a captcha/token to keep bots from holding the whole venue.</li>
<li><strong>Shard by show_id</strong>: contention is naturally per-show, so one hot show never blocks other events.</li>
</ul>
<p><strong>7. Failure modes to mention</strong></p>
<ul>
<li><strong>Payment succeeds but confirm fails</strong> → callback is retried; confirm must be idempotent (unique hold_id on bookings). Reconciliation job compares provider charges to bookings daily.</li>
<li><strong>User pays after the hold expired and the seat is resold</strong> → auto-refund + apology flow; keep the hold window comfortably longer than the payment timeout.</li>
<li><strong>Seat map cache stale</strong> → the hold call is the authority; the UI must handle "seat just taken" gracefully.</li>
</ul>
<div class="key-point">The winning line: <em>"I do not need a distributed lock — the database row is the lock."</em> A conditional UPDATE guarded by status='AVAILABLE' (or a UNIQUE constraint on (show_id, seat_id) in a bookings table) makes double booking structurally impossible, and everything else — holds, TTLs, waiting rooms — is only about user experience and load shedding.</div>`,
      },
      {
        q: 'How would you design a flash sale / limited-stock system (seckill) that never oversells?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A flash sale is a short, extreme spike where a huge number of requests compete for a tiny amount of stock, so the goal is to reject the vast majority of traffic as early and as cheaply as possible while keeping the stock count exactly correct. The strategy is layered: filter at the edge (CDN, rate limit, one-request-per-user token, bot checks), decrement stock in a single atomic in-memory operation such as a Redis Lua script or a decrement guarded by a stock greater-than-zero condition, and then push the winners onto a queue where orders are created asynchronously in the database. The database still holds the authoritative constraint (a CHECK that stock is never negative or a conditional UPDATE), so a Redis failure can cause lost sales but never overselling. Payment happens after the order is created, with a timeout that returns stock if the user does not pay.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Flash sale là một cú spike cực ngắn và cực lớn, nơi rất nhiều request tranh nhau một lượng hàng rất nhỏ, nên mục tiêu là loại bỏ phần lớn traffic càng sớm và càng rẻ càng tốt trong khi vẫn giữ số tồn kho chính xác tuyệt đối. Chiến lược phân tầng: chặn ở biên (CDN, rate limit, token một request mỗi người, chống bot), trừ tồn kho bằng một thao tác atomic trong bộ nhớ như Redis Lua script hoặc một lệnh decrement có điều kiện tồn kho lớn hơn 0, rồi đẩy những người thắng vào hàng đợi để tạo đơn hàng bất đồng bộ trong database. Database vẫn giữ ràng buộc quyền lực nhất (CHECK không cho tồn kho âm hoặc một conditional UPDATE), nên Redis hỏng có thể làm mất đơn nhưng không bao giờ gây bán vượt. Thanh toán diễn ra sau khi tạo đơn, kèm timeout để trả lại hàng nếu người dùng không trả tiền.</p></details>
<p><strong>The shape of the problem:</strong> 1,000,000 requests in 10 seconds for 1,000 items. 99.9% of traffic must be rejected — cheaply.</p>
<pre>Funnel (each layer removes traffic so the next layer stays alive):

  1M req  │ CDN / static page, countdown rendered client-side      → 0 backend load
   300k   │ Edge rate limit + bot/captcha + "sale not started" 403
    50k   │ API: user token check (1 attempt per user per sale)
    10k   │ Redis atomic DECR of stock  ← the real gate
     1k   │ winners → Kafka/queue
     1k   │ workers create orders in DB (authoritative constraint)
     ~800 │ paid within 15 min → confirmed; the rest expire and restock</pre>
<p><strong>1. Atomic stock decrement (Redis Lua — single-threaded, so it is a transaction)</strong></p>
<pre>-- KEYS[1] = stock:sku123   ARGV[1] = userId
local stock = tonumber(redis.call('GET', KEYS[1]))
if not stock or stock &lt;= 0 then return -1 end               -- sold out
if redis.call('SISMEMBER', KEYS[2], ARGV[1]) == 1 then return -2 end  -- already bought
redis.call('DECR', KEYS[1])
redis.call('SADD', KEYS[2], ARGV[1])                        -- dedupe set
return 1                                                    -- winner</pre>
<p>Everything after this is asynchronous: publish {userId, skuId, requestId} to Kafka and immediately return "you got it, order being created" to the client.</p>
<p><strong>2. The database is still the authority</strong></p>
<pre>-- Workers create the order; the DB constraint is the last line of defence
UPDATE inventory SET stock = stock - 1
 WHERE sku_id = :sku AND stock &gt; 0;      -- conditional: cannot go negative
-- 0 rows affected → Redis and DB drifted → compensate (refund/notify), never oversell

ALTER TABLE inventory ADD CONSTRAINT stock_non_negative CHECK (stock &gt;= 0);</pre>
<p><strong>3. Why not just use the database directly?</strong> 10k concurrent UPDATEs on one row serialize on a single row lock — throughput collapses to a few thousand per second with long lock waits. Redis handles the contention in memory; the DB only sees the ~1k winners.</p>
<p><strong>4. Techniques that matter in real sales</strong></p>
<ul>
<li><strong>Stock segmentation</strong>: split 1000 units into 10 Redis keys of 100 (stock:sku:0..9); hash the user to a bucket. Removes the single-key hotspot; a bucket may sell out early, so allow one fallback hop.</li>
<li><strong>Pre-warm</strong>: load stock into Redis and warm all caches before the sale opens; a cold cache at T+0 is a self-inflicted outage.</li>
<li><strong>Answer fast, process later</strong>: the user gets "queued" in milliseconds; the order row appears a second later. Keep the sync path free of DB writes.</li>
<li><strong>Idempotency</strong>: requestId per user per sale, deduped in the Redis set and by a unique index (user_id, sale_id) on orders.</li>
<li><strong>Payment timeout</strong>: unpaid orders expire in 10-15 min and restock (return to Redis + DB in one worker, guarded by the order status transition).</li>
<li><strong>Fairness</strong>: first-come wins is not the only choice — a lottery among all valid entrants removes the bot advantage entirely.</li>
</ul>
<p><strong>5. Failure modes</strong></p>
<ul>
<li><strong>Redis dies mid-sale</strong> → lost decrements. Use Redis persistence + replica, and reconcile against the DB after the sale. Design bias: <em>lose sales, never oversell</em>.</li>
<li><strong>Queue backs up</strong> → users hold "pending" state too long; cap the queue and show sold-out once the winner count is reached.</li>
<li><strong>Bots</strong> → per-account limits, device fingerprints, and a signed sale token minted only by the real product page.</li>
</ul>
<div class="key-point">Two sentences interviewers listen for: <em>"the funnel rejects 99% of traffic before it reaches stateful systems"</em> and <em>"Redis gives throughput, the database constraint gives correctness."</em> Overselling is unacceptable; underselling is merely unfortunate — design every failure path to fail in the underselling direction.</div>`,
      },
      {
        q: 'How would you design a hotel / airline reservation system (date-range inventory, overbooking)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Unlike a cinema seat, hotel and flight inventory is a quantity per date rather than a specific unit, so the model is one availability row per room-type per date (or per flight per cabin) holding total, sold and held counts. A booking that spans several nights must atomically decrement every date in the range, which is one transaction over the whole range with an ordered update to avoid deadlocks, and the room number is only assigned at check-in. Search is read-heavy and latency sensitive, so availability is served from a denormalized cache or search index while the booking write path stays strongly consistent. Real systems also allow deliberate overbooking with a configurable factor per date, because no-shows are predictable, and they need cancellation, modification, rate plans and idempotent payment handling.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Khác với ghế rạp phim, tồn kho khách sạn và chuyến bay là số lượng theo từng ngày chứ không phải một đơn vị cụ thể, nên mô hình là một dòng availability cho mỗi loại phòng theo từng ngày (hoặc mỗi chuyến bay theo từng hạng ghế) chứa tổng số, số đã bán và số đang giữ. Một booking kéo dài nhiều đêm phải trừ atomically trên tất cả các ngày trong khoảng, tức là một transaction bao trọn khoảng ngày với thứ tự update cố định để tránh deadlock, còn số phòng cụ thể chỉ được gán lúc nhận phòng. Tìm kiếm thiên về đọc và nhạy với độ trễ, nên dữ liệu availability được phục vụ từ cache hoặc search index đã denormalize, trong khi đường ghi booking vẫn nhất quán mạnh. Hệ thống thật còn cho phép overbooking có chủ đích với hệ số cấu hình theo từng ngày, vì tỷ lệ khách không đến là dự đoán được, và cần hỗ trợ hủy, đổi, các gói giá cùng xử lý thanh toán idempotent.</p></details>
<p><strong>1. The key modelling insight: inventory is (resource, date) → counts</strong></p>
<pre>hotels        (hotel_id, name, location, ...)
room_types    (room_type_id, hotel_id, capacity, base_price)
availability  (room_type_id, date, total, sold, held,
               PRIMARY KEY (room_type_id, date))        ← one row per night
reservations  (res_id, user_id, room_type_id, check_in, check_out,
               status, idempotency_key UNIQUE, total_price)
rooms         (room_id, hotel_id, room_type_id, number)  ← assigned at check-in, not at booking

available(date) = total * overbook_factor(date) - sold - held</pre>
<p><strong>2. Booking a 3-night stay = one transaction across 3 rows</strong></p>
<pre>BEGIN;
  UPDATE availability
     SET held = held + 1
   WHERE room_type_id = :rt
     AND date &gt;= :checkIn AND date &lt; :checkOut          -- 3 rows for 3 nights
     AND sold + held &lt; total * :overbookFactor;          -- the guard

  -- rows updated must equal the number of nights, else ROLLBACK ("not available")
  INSERT INTO reservations (...) VALUES (...);
COMMIT;</pre>
<ul>
<li>The <code>WHERE</code> guard means the check and the decrement are one atomic step — no check-then-act race.</li>
<li>Always update dates in <strong>ascending order</strong>; two overlapping bookings updating ranges in different orders is a classic deadlock.</li>
<li>Long stays touch many rows — cap the range (e.g. 30 nights) so one request cannot lock a whole month.</li>
</ul>
<p><strong>3. Search vs booking: two different systems</strong></p>
<table>
<tr><th></th><th>Search / browse</th><th>Book</th></tr>
<tr><td>Traffic</td><td>~1000x higher</td><td>Low</td></tr>
<tr><td>Consistency</td><td>Eventual (a few seconds stale is fine)</td><td>Strong, transactional</td></tr>
<tr><td>Store</td><td>Elasticsearch / Redis: precomputed per-date availability + price</td><td>Relational primary DB</td></tr>
<tr><td>Failure mode</td><td>Shows a room that just sold → UI must handle it</td><td>Must never oversell beyond the configured factor</td></tr>
</table>
<p>Availability changes are published as events (CDC from the DB) and applied to the search index — the search layer is a cache, never the authority.</p>
<p><strong>4. Overbooking (this is a feature, not a bug)</strong></p>
<ul>
<li>Airlines and hotels sell more than capacity because a predictable percentage of bookings are no-shows: <em>sellable = capacity × factor</em>, with the factor tuned per date and per segment by a forecasting model.</li>
<li>The system needs a <strong>bump/walk workflow</strong>: when everyone shows up, compensate and rebook — model it explicitly (compensation records, priority rules by fare class or loyalty tier).</li>
<li>Make the factor a per-date configuration value, not a constant — big events and holidays have very different no-show rates.</li>
</ul>
<p><strong>5. Flights add two twists</strong></p>
<ul>
<li><strong>Multi-leg itineraries</strong>: a trip reserves seats on 2-3 flights atomically — a saga across flight inventories, with compensation if a later leg fails.</li>
<li><strong>Fare classes / buckets</strong>: the same cabin is sold in buckets (Y, B, M…) with nested availability; revenue management opens and closes buckets dynamically.</li>
</ul>
<p><strong>6. Other real-project concerns</strong></p>
<ul>
<li><strong>Idempotency key per booking attempt</strong> — payment retries must not create two reservations.</li>
<li><strong>Cancellation/modification</strong> writes the inventory back in the same transactional pattern; a modification is cancel+book inside one transaction.</li>
<li><strong>Channel managers / OTAs</strong>: the same room is sold on your site, Booking.com and Expedia — either a shared inventory service or allocation per channel with periodic reconciliation.</li>
<li><strong>Rate plans and pricing</strong> are a separate service; inventory answers "can I", pricing answers "how much".</li>
</ul>
<div class="key-point">The distinction that impresses: <em>"cinema seats are unique units, hotel nights are fungible counts per date"</em> — so the primary key is (room_type, date), a multi-night booking is a single transaction over a contiguous key range, and overbooking is just a multiplier on the guard condition rather than a bug in the design.</div>`,
      },
      {
        q: 'How would you design an e-commerce checkout and order management system (cart → order → payment → fulfilment)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Checkout is a distributed transaction across inventory, payment and fulfilment that cannot use a single database transaction, so it is modelled as an order state machine driven by a saga with compensating actions. The cart is cheap and stored in a fast key-value store, but placing an order creates a durable record first, then reserves stock, then charges the customer, and every step is idempotent and retryable because networks fail between them. Each transition emits an event that other services consume, and the reliability trick is the transactional outbox so the order write and the event publish cannot diverge. Failures are compensated rather than rolled back: release the reservation, refund the payment, and move the order to a failed or cancelled state that support tooling can act on.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Checkout là một giao dịch phân tán trải trên kho hàng, thanh toán và giao vận, không thể gói trong một transaction database duy nhất, nên nó được mô hình hóa thành một máy trạng thái đơn hàng điều khiển bởi saga với các hành động bù trừ. Giỏ hàng thì rẻ và lưu ở một key-value store nhanh, nhưng khi đặt hàng thì phải tạo bản ghi bền vững trước, rồi giữ hàng trong kho, rồi mới charge tiền, và mọi bước đều idempotent và có thể retry vì mạng có thể lỗi giữa chừng. Mỗi lần chuyển trạng thái phát ra một event cho các service khác tiêu thụ, và mẹo để đảm bảo tin cậy là transactional outbox, để việc ghi đơn hàng và việc publish event không bao giờ lệch nhau. Lỗi được xử lý bằng bù trừ chứ không phải rollback: trả lại hàng đã giữ, hoàn tiền, và đưa đơn về trạng thái thất bại hoặc đã hủy để bộ phận hỗ trợ xử lý tiếp.</p></details>
<p><strong>1. Services and their data</strong></p>
<pre>[Cart svc]      Redis: cart:{userId} → items (TTL 30d) — cheap, disposable
[Order svc]     Postgres: orders + order_items + outbox  ← source of truth
[Inventory svc] Postgres: stock, reservations
[Payment svc]   Postgres: payments, ledger (+ provider: Stripe/VNPay/…)
[Shipping svc]  shipments, carrier integrations
[Notification]  email/SMS/push</pre>
<p><strong>2. Order state machine (make it explicit — this is the heart of the system)</strong></p>
<pre>CREATED ──reserve ok──▶ STOCK_RESERVED ──charge ok──▶ PAID ──▶ FULFILLING ──▶ SHIPPED ──▶ DELIVERED
   │                          │                         │
   │ reserve fail             │ charge fail             │ cancel request
   ▼                          ▼                         ▼
OUT_OF_STOCK             PAYMENT_FAILED            CANCELLED (refund + restock)
                          (release stock)</pre>
<p><strong>3. Saga with compensations (orchestrated — easier to debug than choreography)</strong></p>
<table>
<tr><th>Step</th><th>Action</th><th>Compensation if a later step fails</th></tr>
<tr><td>1</td><td>Create order (status CREATED)</td><td>Mark order CANCELLED</td></tr>
<tr><td>2</td><td>Reserve stock (TTL 15 min)</td><td>Release reservation</td></tr>
<tr><td>3</td><td>Charge payment (idempotency key = orderId)</td><td>Refund payment</td></tr>
<tr><td>4</td><td>Confirm stock deduction</td><td>Restock</td></tr>
<tr><td>5</td><td>Create shipment</td><td>Cancel shipment</td></tr>
</table>
<p><strong>Order matters</strong>: reserve stock <em>before</em> charging. Refunding money is worse for the customer than telling them an item is unavailable.</p>
<p><strong>4. Transactional outbox — the reliability backbone</strong></p>
<pre>BEGIN;
  INSERT INTO orders (...) VALUES (...);                 -- business state
  INSERT INTO outbox (id, topic, payload) VALUES (...);  -- the event, same transaction
COMMIT;
-- A relay (or Debezium CDC) publishes outbox rows to Kafka and marks them sent.
-- Guarantees at-least-once publish → every consumer must be idempotent
-- (dedupe on eventId, or make the handler naturally idempotent).</pre>
<p>Without this you get the classic bug: the order is committed but the "OrderCreated" event was never published (or the event was published and the transaction rolled back).</p>
<p><strong>5. Inventory reservation</strong></p>
<pre>UPDATE stock SET available = available - :qty, reserved = reserved + :qty
 WHERE sku = :sku AND available &gt;= :qty;     -- conditional guard, no negative stock
-- 0 rows → out of stock → saga compensates immediately
-- Reservation rows carry expires_at; a sweeper releases abandoned checkouts.</pre>
<p><strong>6. Scaling notes</strong></p>
<ul>
<li><strong>Read path</strong> (catalogue, product pages) is 100-1000x the write path: CDN + cache + search index, fully separate from checkout.</li>
<li><strong>Order history</strong> queries hit a read model (CQRS) built from events, so reporting never touches the write database.</li>
<li><strong>Partition orders by user id</strong>; order ids are time-sortable (Snowflake/ULID) so they page efficiently.</li>
<li><strong>Hot SKUs</strong> during a promotion → the flash-sale funnel (Redis counter in front of the DB).</li>
<li><strong>Archive</strong> orders older than N months to cold storage; the orders table grows forever otherwise.</li>
</ul>
<p><strong>7. Failure modes and operational reality</strong></p>
<ul>
<li><strong>Payment webhook arrives twice</strong> → idempotent by (provider, event_id); the ledger entry has a unique constraint.</li>
<li><strong>Payment succeeded but order service was down</strong> → reconciliation job compares provider settlements to orders daily; this job is not optional in production.</li>
<li><strong>Stuck sagas</strong> → a timeout per step + a dead-letter queue + an admin tool to retry or force-compensate. Someone must be able to fix a single stuck order at 2am.</li>
<li><strong>Price changed between cart and checkout</strong> → prices are snapshotted into the order at creation time.</li>
</ul>
<div class="key-point">Three sentences that carry this answer: <em>"the order row is the source of truth and the state machine is explicit"</em>, <em>"reserve stock before charging, because refunds are worse than out-of-stock"</em>, and <em>"the outbox pattern is what makes 'save state and publish event' atomic without 2PC."</em></div>`,
      },
      {
        q: 'How would you design a payment / digital wallet system with a correct ledger?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A payment system is judged by correctness, not by throughput, so the core is an append-only double-entry ledger where every movement of money writes balanced debit and credit entries and balances are derived from those entries rather than edited in place. Every write is idempotent through a client-supplied key, transfers between two accounts happen in one database transaction with accounts locked in a deterministic order to avoid deadlocks, and nothing is ever deleted — corrections are new reversing entries. External providers are integrated asynchronously with webhooks, and because the provider and the ledger can disagree, a daily reconciliation job is a first-class component. Money amounts are integers in minor units, never floating point, and the audit trail must be strong enough to answer where any cent came from.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hệ thống thanh toán được đánh giá bằng tính đúng đắn chứ không phải throughput, nên phần lõi là một sổ cái ghi kép chỉ thêm mới, trong đó mọi chuyển dịch tiền đều ghi các bút toán nợ và có cân bằng nhau, còn số dư được tính ra từ các bút toán chứ không sửa trực tiếp. Mọi lệnh ghi đều idempotent nhờ một key do client cung cấp, việc chuyển tiền giữa hai tài khoản nằm trong một transaction database với thứ tự khóa tài khoản cố định để tránh deadlock, và không bao giờ xóa dữ liệu — muốn sửa thì ghi bút toán đảo ngược mới. Các nhà cung cấp bên ngoài được tích hợp bất đồng bộ qua webhook, và vì nhà cung cấp với sổ cái có thể lệch nhau nên job đối soát hằng ngày là một thành phần chính thức. Số tiền luôn là số nguyên theo đơn vị nhỏ nhất, tuyệt đối không dùng số thực, và dấu vết kiểm toán phải đủ mạnh để trả lời được từng đồng đến từ đâu.</p></details>
<p><strong>1. Double-entry ledger — the non-negotiable core</strong></p>
<pre>accounts        (account_id, owner_id, type, currency, status)
                 type: USER_WALLET | MERCHANT | FEE_REVENUE | GATEWAY_CLEARING | ...
ledger_entries  (entry_id, txn_id, account_id, direction, amount_minor,
                 currency, created_at)          ← APPEND ONLY, never UPDATE/DELETE
transactions    (txn_id, type, idempotency_key UNIQUE, status, metadata)
balances        (account_id, balance_minor, version)   ← optional cached projection

INVARIANT: for every txn_id,  SUM(debits) == SUM(credits)   (per currency)</pre>
<pre>Alice pays Bob 100.00 with a 2.00 fee — one transaction, three entries:

  txn_1  DEBIT   alice_wallet     10200   (money leaves Alice)
  txn_1  CREDIT  bob_wallet       10000   (money reaches Bob)
  txn_1  CREDIT  fee_revenue        200   (the platform's cut)
                 ---------------------
                 debits 10200 == credits 10200  ✓</pre>
<p><strong>2. Transfer implementation</strong></p>
<pre>BEGIN;
  -- claim the idempotency key first: unique constraint does the deduplication
  INSERT INTO transactions (txn_id, idempotency_key, status) VALUES (...);
  -- duplicate key → return the stored result, do NOT move money again

  SELECT balance_minor FROM balances
   WHERE account_id IN (:from, :to) ORDER BY account_id FOR UPDATE;  -- fixed order!

  IF balance(from) &lt; amount THEN ROLLBACK ("insufficient funds");

  INSERT INTO ledger_entries (...debit from...), (...credit to...);
  UPDATE balances SET balance_minor = balance_minor - :amt WHERE account_id = :from;
  UPDATE balances SET balance_minor = balance_minor + :amt WHERE account_id = :to;
COMMIT;</pre>
<ul>
<li><strong>Ordering by account_id</strong> is what stops A→B and B→A transfers from deadlocking.</li>
<li>The cached balance is only a projection — it must always be reproducible by summing entries, and a nightly job asserts that.</li>
<li><strong>Amounts are integers in minor units</strong> (cents/xu). Floating point money is a defect, not a style choice.</li>
</ul>
<p><strong>3. External payments are asynchronous state machines</strong></p>
<pre>INITIATED → PENDING(provider) → AUTHORIZED → CAPTURED → SETTLED
                   │                              ↘ REFUNDED / PARTIALLY_REFUNDED
                   ↘ FAILED / EXPIRED

- Never block a user request on the provider: create the record, call the provider,
  and let the webhook (retried, possibly out of order, possibly duplicated) drive transitions.
- Webhook handling: verify signature → dedupe by provider event id → apply
  transition only if it is legal from the current state (guard against out-of-order delivery).
- Also poll the provider for stale PENDING records — webhooks do get lost.</pre>
<p><strong>4. Reconciliation — the component juniors forget</strong></p>
<ul>
<li>Every day, pull the provider's settlement file and compare it to the ledger: match on provider reference, then report <strong>missing here</strong>, <strong>missing there</strong>, and <strong>amount mismatch</strong>.</li>
<li>Breaks are worked by an ops tool; automatic fixes are new compensating entries, never edits.</li>
<li>Also reconcile internally: sum of all wallet balances + fee accounts must equal the clearing account holding real bank money.</li>
</ul>
<p><strong>5. Other production concerns</strong></p>
<ul>
<li><strong>Idempotency everywhere</strong>: key per logical intent, not per HTTP attempt (see the double-charge question).</li>
<li><strong>Holds/authorizations</strong>: a pending debit reduces available balance without settling — model available vs current balance.</li>
<li><strong>Multi-currency</strong>: never mix currencies in one account; FX is an explicit transaction with its own rate record.</li>
<li><strong>Limits, fraud and AML</strong>: velocity rules and risk scoring sit in front of the ledger, not inside it.</li>
<li><strong>Scale</strong>: partition by account_id; hot merchant accounts get sub-accounts or batched settlement to avoid single-row contention.</li>
<li><strong>Compliance</strong>: PCI-DSS means card data lives with the provider (tokenization), never in your database; ledger data is retained for years.</li>
</ul>
<div class="key-point">The sentence that signals experience: <em>"balances are derived, entries are immutable"</em>. If you can rebuild every balance by replaying the ledger, you can audit, reconcile and recover from any bug. Add "integer minor units", "idempotency key with a unique constraint", and "daily reconciliation with the provider" and you have covered what actually breaks in production payment systems.</div>`,
      },
      {
        q: 'How would you design a very high-throughput system (millions of events per second ingestion)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>At millions of events per second the design is dominated by three ideas: never do per-event synchronous work, partition everything so there is no shared hot resource, and push work off the request path. Producers batch and compress events and write to a partitioned log such as Kafka, where the ingestion tier is stateless and does almost nothing except validate and append, which keeps p99 low. Consumers process partitions in parallel, write to storage optimized for sequential writes such as an LSM-tree store or object storage in columnar files, and aggregate into pre-computed rollups rather than querying raw data. Backpressure, bounded queues and load shedding are explicit, because a system that accepts more than it can process fails much worse than one that rejects early. Delivery is at-least-once with idempotent consumers, since exactly-once end to end is a property you build with deduplication rather than a checkbox.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Ở mức hàng triệu sự kiện mỗi giây, thiết kế bị chi phối bởi ba ý: đừng làm việc gì đồng bộ cho từng sự kiện, phân mảnh mọi thứ để không còn tài nguyên nóng dùng chung, và đẩy công việc ra khỏi đường request. Producer gom lô và nén sự kiện rồi ghi vào một log phân mảnh như Kafka, ở đó tầng ingestion là stateless và gần như chỉ validate rồi append, nhờ vậy p99 luôn thấp. Consumer xử lý song song theo partition, ghi vào kho lưu trữ tối ưu cho ghi tuần tự như LSM-tree hoặc object storage dạng cột, và tổng hợp sẵn thành các bảng rollup thay vì truy vấn dữ liệu thô. Backpressure, hàng đợi có giới hạn và load shedding phải rõ ràng, vì một hệ thống nhận vào nhiều hơn khả năng xử lý sẽ hỏng tệ hơn nhiều so với hệ thống biết từ chối sớm. Cơ chế gửi là at-least-once cùng consumer idempotent, vì exactly-once đầu-cuối là thứ bạn xây bằng khử trùng lặp chứ không phải một ô tick cấu hình.</p></details>
<p><strong>1. Do the arithmetic first — it dictates everything</strong></p>
<pre>2,000,000 events/sec × 500 bytes  = 1 GB/sec  = 86 TB/day raw
  → compressed ~5:1                            ≈ 17 TB/day stored
  → one machine writes ~200 MB/s to NVMe       → at least 5-10 write nodes just for IO
  → network: 8 Gbps sustained ingress          → multiple NICs / multiple AZs
  → per-event synchronous DB insert at 1 ms    → 2,000,000 concurrent ops → impossible

Conclusion before drawing anything: batch, partition, append-only, async.</pre>
<p><strong>2. Reference pipeline</strong></p>
<pre>[Clients/SDK]  batch 100-1000 events, gzip, retry with backoff
      ↓ (HTTP/gRPC, keep-alive)
[Edge LB] → [Stateless ingest tier]  validate + enrich + assign partition key
      ↓ (produce, acks=1 or all, linger.ms batching)
[Kafka: 100s of partitions, RF=3]     ← the shock absorber / durable buffer
      ↓                    ↓                      ↓
[Stream processors]   [Raw archiver]        [Real-time consumers]
 Flink/Kafka Streams   → S3/GCS parquet       alerts, counters
      ↓
[OLAP store: ClickHouse / Druid / BigQuery]  ← pre-aggregated rollups
      ↓
[Query API + cache] → dashboards</pre>
<p><strong>3. The techniques that actually buy throughput</strong></p>
<table>
<tr><th>Technique</th><th>Why it works</th></tr>
<tr><td><strong>Batching</strong></td><td>Amortizes per-request overhead (TLS, syscalls, RPC headers, fsync). 1000 events per request cuts overhead ~1000x.</td></tr>
<tr><td><strong>Append-only / sequential IO</strong></td><td>Sequential disk writes are 100x faster than random; this is why Kafka and LSM stores are the default shape.</td></tr>
<tr><td><strong>Partitioning by key</strong></td><td>Removes global coordination — throughput scales linearly with partitions, and ordering is preserved per key (not globally).</td></tr>
<tr><td><strong>Async everything</strong></td><td>The request path returns after a durable append; enrichment, indexing and aggregation happen downstream.</td></tr>
<tr><td><strong>Pre-aggregation</strong></td><td>Queries hit rollup tables (per minute/hour), not billions of raw rows.</td></tr>
<tr><td><strong>Compression + columnar</strong></td><td>5-10x less IO and network; columnar formats let queries read only needed columns.</td></tr>
<tr><td><strong>Zero-copy / mmap, connection reuse</strong></td><td>Removes per-event CPU; keep-alive avoids repeated TLS handshakes.</td></tr>
</table>
<p><strong>4. Backpressure and load shedding (the part that separates seniors)</strong></p>
<ul>
<li><strong>Bounded queues everywhere</strong> — an unbounded queue converts an overload into an out-of-memory crash plus a latency spiral.</li>
<li>When the buffer is full: reject with <code>429</code> + <code>Retry-After</code>, and let clients back off with jitter. Fast rejection keeps the healthy majority working.</li>
<li><strong>Priority classes</strong>: shed low-value traffic (debug telemetry) before high-value traffic (billing events).</li>
<li><strong>Consumer lag is the primary SLO metric</strong> — alert on lag growth, autoscale consumers, and make sure the topic retains enough data to survive a multi-hour outage.</li>
</ul>
<p><strong>5. Hot partitions — the failure you should predict out loud</strong></p>
<pre>Partition key = tenantId → one huge tenant saturates one partition.
Fixes:
  - composite key: tenantId + random salt (0..N) when ordering per tenant isn't required
  - dedicated partitions/cluster for whale tenants
  - two-level aggregation: pre-aggregate on the producer/edge, then merge downstream</pre>
<p><strong>6. Delivery semantics</strong></p>
<ul>
<li>At-least-once + <strong>idempotent consumers</strong> (dedupe by event id in a window, or upsert by natural key) is the practical answer.</li>
<li>Kafka's transactional producer gives exactly-once <em>within</em> Kafka; the moment you write to an external system, idempotency is again your responsibility.</li>
<li>Store an event id and use it as the primary key in the sink — replays overwrite instead of duplicating.</li>
</ul>
<p><strong>7. What to monitor</strong>: ingest QPS, p99 produce latency, consumer lag per partition, error/shed rate, bytes/sec per broker, disk headroom, and rebalance frequency.</p>
<div class="key-point">The three-line summary interviewers want: <em>"batch and append instead of per-event random writes"</em>, <em>"partition so nothing is globally shared"</em>, and <em>"bounded buffers with explicit shedding, because an overloaded system must degrade instead of collapse."</em> Adding a durable log (Kafka) between ingestion and processing is what lets the slow parts fail independently of the fast parts.</div>`,
      },
      {
        q: 'How would you design a ride-hailing system (Uber / Grab): matching drivers and riders in real time?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The hard parts are a very high-frequency location write stream and a low-latency geospatial query, so the location store is kept in memory and indexed by a geohash or H3 cell rather than in the transactional database. Drivers push their position every few seconds over a persistent connection, the location service writes to Redis keyed by cell, and a matching service answers nearby-driver queries by scanning the rider's cell plus its neighbours, ranked by estimated time of arrival rather than straight-line distance. Matching must be exclusive, so an offer to a driver is a short lock with a timeout that falls through to the next candidate, and the trip itself is a state machine with its own durable store. Everything downstream — pricing, ETA, fraud, analytics — consumes the same event stream asynchronously so the real-time path stays thin.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Phần khó là luồng ghi vị trí với tần suất rất cao và truy vấn không gian địa lý cần độ trễ thấp, nên kho vị trí được giữ trong bộ nhớ và đánh chỉ mục theo geohash hoặc ô H3 thay vì nằm trong database giao dịch. Tài xế đẩy vị trí vài giây một lần qua kết nối lâu dài, location service ghi vào Redis theo khóa ô, còn matching service trả lời truy vấn tài xế gần đây bằng cách quét ô của khách cộng các ô lân cận, xếp hạng theo thời gian đến dự kiến chứ không phải khoảng cách đường chim bay. Việc ghép cặp phải độc quyền, nên một lời mời gửi cho tài xế là một lock ngắn có timeout, hết hạn thì chuyển sang ứng viên kế tiếp, và bản thân chuyến đi là một máy trạng thái với kho dữ liệu bền vững riêng. Mọi thứ phía sau — tính giá, ETA, chống gian lận, phân tích — đều tiêu thụ cùng một luồng sự kiện một cách bất đồng bộ để đường real-time luôn mỏng.</p></details>
<p><strong>1. Scale estimate (this drives the whole design)</strong></p>
<pre>1,000,000 active drivers × 1 location update / 4 s ≈ 250,000 writes/sec
Each update ~100 bytes → 25 MB/s — small data, brutal write rate.
→ A relational DB with a spatial index cannot take this. In-memory, keyed store required.
Rider requests: ~10,000/sec at peak — 25x fewer than location writes.</pre>
<p><strong>2. Components</strong></p>
<pre>[Driver app] --WebSocket--> [Location svc] --> Redis GEO / geohash buckets
                                   └--> Kafka (locations topic) --> analytics, ETA models

[Rider app]  --HTTPS------> [Trip svc] --> [Matching svc] --(query)--> Redis
                                │
                                └--> Postgres (trips, state machine) + Kafka (trip events)
                                         └--> pricing, notifications, receipts, fraud</pre>
<p><strong>3. Geospatial indexing: the key idea</strong></p>
<ul>
<li>A 2D "find everyone within 3 km" query is expensive; instead map the earth into <strong>cells</strong> (geohash, S2, or Uber's own H3 hexagons) and turn the query into key lookups.</li>
<li>Redis: <code>GEOADD drivers:cell lon lat driverId</code> then <code>GEOSEARCH</code>, or a plain <code>SET</code> per cell — reading the rider's cell plus its 6-8 neighbours covers the radius.</li>
<li>Hexagons (H3) are preferred over squares because all neighbours are equidistant, which makes expanding-ring searches uniform.</li>
<li>Expand the ring until enough candidates are found; cap the expansion and fall back to "no drivers nearby".</li>
</ul>
<pre>Rider at cell 8928308280fffff
  ring 0: [8928308280fffff]                 → 3 drivers
  ring 1: + 6 neighbouring cells            → 21 drivers  ← enough, stop
  rank by ETA (road network + traffic), not by straight-line distance</pre>
<p><strong>4. Matching must be exclusive (two riders must not get the same driver)</strong></p>
<pre>1. Matching svc picks top-K candidates by ETA + acceptance-rate score.
2. Atomically claim one:  SET driver:{id}:offer {tripId} NX EX 15   ← Redis lock, 15s TTL
   - NX fails → that driver is already being offered another trip → try the next.
3. Push the offer over the driver's WebSocket; wait for accept.
4. Accept  → transactionally set trip.driver_id (unique constraint on trip), driver → ON_TRIP.
   Reject/timeout → release the lock, offer to the next candidate.
5. No acceptance after N rounds → widen the radius / surge / apologize.</pre>
<p><strong>5. Trip state machine (durable, in Postgres)</strong></p>
<pre>REQUESTED → MATCHED → DRIVER_ARRIVING → IN_PROGRESS → COMPLETED → PAID
     ↘ NO_DRIVERS        ↘ CANCELLED_BY_RIDER / CANCELLED_BY_DRIVER</pre>
<p><strong>6. Design decisions worth defending</strong></p>
<ul>
<li><strong>Location data is disposable</strong>: current position lives in Redis with a TTL (a driver who stops sending disappears automatically = free liveness detection). The Kafka stream is the durable copy for history and analytics.</li>
<li><strong>Geo-partition the services</strong>: a city is a natural shard. Traffic in Hanoi never touches the shard for Jakarta, and matching only ever needs local data.</li>
<li><strong>WebSocket connection servers are stateful</strong> and separated from stateless business services, with a registry mapping driver → connection server.</li>
<li><strong>Surge pricing</strong> is computed per cell per few minutes from the supply/demand ratio in the stream — an async consumer, never in the request path.</li>
<li><strong>ETA</strong> comes from a routing service with live traffic; cache per (cell pair, time bucket) because exact coordinates are unnecessary precision.</li>
</ul>
<p><strong>7. Failure modes</strong></p>
<ul>
<li><strong>Driver goes offline mid-trip</strong> (tunnel/battery) → buffer positions on the device, replay on reconnect; trip state survives in Postgres, not in the socket.</li>
<li><strong>Redis loses the location index</strong> → degraded matching for a few seconds until drivers re-report; nothing permanent is lost because Redis is a cache.</li>
<li><strong>Hot cell</strong> (stadium at the end of a concert) → split the cell to a finer resolution and rate-limit the expansion radius.</li>
<li><strong>Duplicate assignment</strong> → prevented by the offer lock plus a unique constraint on trips.driver_id for active trips.</li>
</ul>
<div class="key-point">The core insight: <em>"a geospatial nearest-neighbour query becomes a key lookup once you index by cell"</em>. Combine that with "current location is a cache with a TTL, the event stream is the record of truth", and an exclusive offer lock for matching, and you have the whole system in three sentences.</div>`,
      },
      {
        q: 'How would you design a video streaming platform (YouTube / Netflix): upload, transcoding and playback?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Video is two very different systems joined by a pipeline: a write-side that ingests and transcodes files asynchronously, and a read-side that serves enormous amounts of bytes from a CDN. Uploads go directly to object storage using pre-signed URLs so the application servers never touch the bytes, then a message triggers a transcoding pipeline that splits the video into chunks, encodes them into multiple bitrates in parallel, and packages them into HLS or DASH segments with a manifest. Playback is adaptive: the player reads the manifest, requests small segments, and switches quality according to measured bandwidth, with almost every byte served from CDN edge caches rather than the origin. Metadata, recommendations and view counts live in separate stores, and the entire pipeline is idempotent and resumable because transcoding jobs are long and failure is normal.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Video thực chất là hai hệ thống rất khác nhau nối với nhau bằng một pipeline: phía ghi nhận file lên và transcode bất đồng bộ, phía đọc phục vụ một lượng byte khổng lồ từ CDN. File upload được đẩy thẳng lên object storage bằng pre-signed URL nên server ứng dụng không bao giờ phải xử lý luồng byte, sau đó một message kích hoạt pipeline transcoding: cắt video thành các chunk, encode song song ra nhiều mức bitrate, rồi đóng gói thành các segment HLS hoặc DASH kèm manifest. Việc phát là thích ứng: player đọc manifest, tải các segment nhỏ và đổi chất lượng theo băng thông đo được, và gần như toàn bộ byte được phục vụ từ cache biên của CDN chứ không phải từ origin. Metadata, gợi ý và lượt xem nằm ở các kho riêng, còn toàn bộ pipeline phải idempotent và có thể tiếp tục được, vì job transcoding chạy lâu và lỗi là chuyện bình thường.</p></details>
<p><strong>1. Numbers that shape the design</strong></p>
<pre>1 hour of 1080p ≈ 2-4 GB source; transcoded to 6 renditions ≈ 4-6 GB stored
1 M concurrent viewers × 5 Mbps = 5 Tbps egress   ← impossible from origin
  → 95-99% of bytes MUST be served by CDN edges
Storage grows forever → tiering (hot → warm → cold/archive) is mandatory</pre>
<p><strong>2. Upload path</strong></p>
<pre>1. Client asks the API for a pre-signed upload URL (+ multipart for large files).
2. Client uploads DIRECTLY to object storage (S3/GCS) — resumable, chunked.
   The app server never proxies bytes; it only issues credentials and records metadata.
3. Storage emits an event (or client calls /complete) → message on the queue.
4. Video row: status = UPLOADED → PROCESSING.</pre>
<p><strong>3. Transcoding pipeline (the interesting part)</strong></p>
<pre>[queue] → [Splitter]  cut source into 5-10s GOP-aligned chunks
             ↓ fan out (thousands of workers, spot/preemptible instances)
          [Encode chunk × N renditions]   240p 360p 480p 720p 1080p 4K (+ AV1/H.265)
             ↓
          [Packager]  assemble chunks → HLS (.ts/.m4s + .m3u8) / DASH (.mpd)
             ↓
          [Publish]  write to object storage, generate thumbnails/preview sprites,
                     captions (ASR), content fingerprint (copyright), status = READY</pre>
<ul>
<li><strong>Chunk-level parallelism</strong> is why a 2-hour movie can transcode in minutes: 1000 chunks encode simultaneously.</li>
<li>Jobs must be <strong>idempotent and resumable</strong> — a worker dying mid-chunk just re-runs that chunk; the output key is deterministic.</li>
<li><strong>Priority queues</strong>: a 30-second short and a 3-hour 4K film should not share one FIFO. Also transcode low renditions first so the video becomes watchable sooner.</li>
<li>Cheap capacity: preemptible/spot instances, since every task is retryable.</li>
</ul>
<p><strong>4. Playback: adaptive bitrate streaming</strong></p>
<pre>Player → GET master.m3u8            (manifest listing renditions)
      → GET 720p/segment_001.ts     (~5s of video, cacheable forever, immutable)
      → measures throughput & buffer → next request may switch to 1080p or drop to 480p

Why segments? Small immutable files = perfect CDN objects, instant quality switching,
seek = jump to a segment index, and one slow segment doesn't stall the whole stream.</pre>
<p><strong>5. Delivery</strong></p>
<ul>
<li><strong>CDN everything</strong>: segments are immutable with long TTLs. Netflix goes further with Open Connect appliances placed inside ISPs.</li>
<li><strong>Pre-position popular content</strong> to edges before demand (a new season release) instead of relying on cache-fill.</li>
<li><strong>Origin shield</strong>: a mid-tier cache so thousands of edges do not stampede object storage.</li>
<li><strong>Signed URLs / DRM</strong> (Widevine, FairPlay) for paid content; tokens are short-lived and per-session.</li>
</ul>
<p><strong>6. Metadata and the read-side</strong></p>
<ul>
<li><strong>Video metadata</strong>: relational or document store, heavily cached; the catalogue is read-mostly.</li>
<li><strong>View counts / watch progress</strong>: high-volume writes → stream to Kafka, aggregate, and update counters asynchronously (approximate is fine for counts, exact for billing).</li>
<li><strong>Search</strong>: Elasticsearch over titles, descriptions, transcripts.</li>
<li><strong>Recommendations</strong>: offline model training + a low-latency serving layer; never in the playback path.</li>
</ul>
<p><strong>7. Failure modes and trade-offs</strong></p>
<ul>
<li><strong>Transcode fails for one rendition</strong> → publish what is ready (progressive availability), retry the rest, alert if 4K never completes.</li>
<li><strong>Live streaming</strong> changes everything: low-latency HLS/WebRTC, sub-second chunks, no time for multi-pass encoding — call this out as a separate design.</li>
<li><strong>Cost control</strong>: storage tiering by age/popularity, AV1 for popular titles (better compression, expensive to encode), and per-title encoding ladders instead of one fixed ladder.</li>
</ul>
<div class="key-point">Two sentences carry this design: <em>"bytes never pass through my application servers — clients upload to object storage and download from CDN edges"</em>, and <em>"transcoding is chunk-parallel and idempotent, so it scales horizontally on cheap preemptible capacity."</em> Adaptive bitrate over immutable segments is what makes both playback quality and caching work.</div>`,
      },
      {
        q: 'How would you design a search autocomplete / typeahead system?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Autocomplete is a read-only, extremely latency-sensitive lookup, so the whole design is about pre-computing answers rather than searching at request time. An offline pipeline aggregates query logs into frequency counts, builds a prefix structure such as a trie where each node already stores its own top-K completions, and ships that structure to the serving tier, so a request is a prefix walk plus returning a cached list in a few milliseconds. Results are cached at every level, including the CDN and the browser, and the index is rebuilt periodically rather than updated per keystroke, with a small real-time layer merged in for trending queries. The client also does its share by debouncing keystrokes, cancelling stale requests and caching prefixes it has already seen.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Autocomplete là một truy vấn chỉ đọc và cực kỳ nhạy với độ trễ, nên toàn bộ thiết kế xoay quanh việc tính sẵn câu trả lời thay vì đi tìm kiếm lúc có request. Một pipeline offline gom log truy vấn thành số đếm tần suất, dựng một cấu trúc tiền tố như trie trong đó mỗi node đã lưu sẵn top-K gợi ý của chính nó, rồi đẩy cấu trúc đó xuống tầng phục vụ, nhờ vậy mỗi request chỉ là đi theo tiền tố rồi trả về danh sách đã có sẵn trong vài mili-giây. Kết quả được cache ở mọi tầng, kể cả CDN và trình duyệt, còn index được dựng lại theo chu kỳ chứ không cập nhật theo từng phím gõ, kèm một lớp real-time nhỏ trộn vào cho các truy vấn đang thịnh hành. Client cũng phải làm phần việc của mình: debounce phím gõ, hủy request cũ và cache lại các tiền tố đã gặp.</p></details>
<p><strong>1. Requirements</strong></p>
<ul>
<li>p99 latency <strong>under ~50 ms</strong> — the suggestion must appear before the next keystroke.</li>
<li>Every keystroke is a request: a search box with 10 M daily users generates far more QPS than the search itself (5-10 requests per query typed).</li>
<li>Top 5-10 suggestions, ranked by popularity (and personalization/locale if required).</li>
<li>Fresh enough: new trending terms should appear within minutes, not seconds.</li>
</ul>
<p><strong>2. Why a trie with precomputed top-K</strong></p>
<pre>Naive: SELECT q FROM queries WHERE q LIKE 'lap%' ORDER BY freq DESC LIMIT 10
       → scans/sorts at request time → too slow and expensive at 100k QPS.

Trie where EVERY node stores its own answer:

        (root)
          └ l ── a ── p
                     ├ top10: [laptop, laptop deals, lapland, ...]  ← precomputed
                     └ t ── o ── p
                                 └ top10: [laptop, laptop bag, ...] ← precomputed

Request "lap" = walk 3 nodes, return the stored list. O(prefix length), no ranking at runtime.</pre>
<p><strong>3. Architecture</strong></p>
<pre>[Search logs] → Kafka → [Aggregation job (hourly/daily)]  count(query) with time decay
                             ↓
                     [Trie/index builder]  compute top-K per node, serialize
                             ↓
                     [Distributed store / shipped snapshot]
                             ↓
[Client] → CDN/edge cache → [Suggestion service: index held IN MEMORY] → response

+ [Real-time layer]: a small Redis sorted set of the last N minutes' trending queries,
  merged with the static top-K at query time (bounded, cheap).</pre>
<p><strong>4. Sharding and serving</strong></p>
<ul>
<li><strong>Shard by prefix</strong> (e.g. first 1-2 characters) so each server holds a slice of the trie in memory; the router picks the shard from the prefix.</li>
<li>Replicate every shard for both availability and read throughput — the index is read-only, so replicas are trivially consistent.</li>
<li>Index updates are <strong>atomic swaps</strong>: build a new snapshot, load it into memory, flip the pointer. No incremental mutation of a live trie.</li>
<li>Memory-efficient structures matter at scale: compressed tries (radix tree), succinct tries, or an FST as used by Lucene.</li>
</ul>
<p><strong>5. Caching layers (each one removes most of the traffic below it)</strong></p>
<ul>
<li><strong>Browser</strong>: cache prefixes already fetched; typing one more character often needs no request at all (filter the previous result client-side).</li>
<li><strong>Debounce</strong> ~50-100 ms and cancel in-flight requests for stale prefixes.</li>
<li><strong>CDN/edge</strong>: short-prefix suggestions are identical for everyone → cache with a 1-5 minute TTL. Short prefixes are the bulk of traffic.</li>
<li><strong>Service-level cache</strong> for the hottest prefixes.</li>
</ul>
<p><strong>6. Ranking and quality</strong></p>
<ul>
<li>Score = frequency with <strong>time decay</strong> (recent counts weigh more) + click-through rate + optional personalization (user's own history, locale, device).</li>
<li><strong>Typo tolerance</strong>: edit-distance-1 expansion, or a separate fuzzy index — do it offline where possible.</li>
<li><strong>Filtering</strong>: block offensive/legally sensitive suggestions and rate-limit query injection into the popularity counts, otherwise the box gets poisoned by bots.</li>
</ul>
<div class="key-point">The line that wins this question: <em>"nothing is ranked at request time — the top-K for every prefix is precomputed and the request is a pointer walk in memory."</em> Add "the index is rebuilt and hot-swapped, never mutated in place" and "short prefixes are cached at the CDN because they are identical for all users" and you have covered latency, scale and freshness.</div>`,
      },
      {
        q: 'How would you design a distributed job scheduler / delayed task system (cron at scale, retries, exactly-once execution)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A scheduler is a durable store of future work plus a reliable way to move a job from due to running exactly once. Jobs are rows with a next-run timestamp, and workers poll a time-ordered index to claim due jobs with an atomic conditional update that sets an owner and a lease expiry, which is what prevents two workers from running the same job. Long-running jobs renew their lease, crashed workers are recovered when the lease expires, and every handler must be idempotent because at-least-once execution is the only honest guarantee. For very large scale, jobs are partitioned by a shard key and a leader per partition dispatches them, while short delays can be served from an in-memory timing wheel backed by the durable store. Retries use exponential backoff with jitter, and permanent failures land in a dead-letter table with alerting.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một scheduler thực chất là kho lưu trữ bền vững các công việc tương lai, cộng với một cách đáng tin cậy để đưa job từ trạng thái đến hạn sang đang chạy đúng một lần. Job là các dòng dữ liệu có mốc thời gian chạy kế tiếp, worker quét chỉ mục theo thời gian để giành lấy các job đến hạn bằng một conditional update atomic, gán chủ sở hữu và hạn lease — đây chính là thứ ngăn hai worker chạy cùng một job. Job chạy lâu phải gia hạn lease, worker chết thì job được thu hồi khi lease hết hạn, và mọi handler đều phải idempotent vì at-least-once mới là đảm bảo trung thực duy nhất. Ở quy mô rất lớn, job được phân mảnh theo shard key và mỗi partition có một leader đứng ra điều phối, còn các độ trễ ngắn có thể phục vụ bằng timing wheel trong bộ nhớ có kho bền vững đứng sau. Retry dùng exponential backoff kèm jitter, và lỗi vĩnh viễn được đưa vào bảng dead-letter kèm cảnh báo.</p></details>
<p><strong>1. Two different requirements people conflate</strong></p>
<table>
<tr><th></th><th>Recurring jobs (cron)</th><th>Delayed / one-off tasks</th></tr>
<tr><td>Example</td><td>"Send invoices every day at 02:00"</td><td>"Cancel this order in 15 minutes if unpaid"</td></tr>
<tr><td>Volume</td><td>Thousands of definitions</td><td>Millions of pending tasks</td></tr>
<tr><td>Key design</td><td>Leader-elected dispatcher, cron expression → next_run_at</td><td>Time-indexed queue, high write rate, mass expiry</td></tr>
</table>
<p><strong>2. Schema</strong></p>
<pre>jobs (job_id PK, type, payload,
      run_at TIMESTAMP,          -- when it becomes due
      status,                    -- PENDING | RUNNING | DONE | FAILED | DEAD
      attempt INT, max_attempts INT,
      lease_owner, lease_expires_at,
      shard_key, idempotency_key,
      cron_expr NULL)            -- non-null for recurring jobs

INDEX (status, run_at)  or  (shard_key, status, run_at)   ← the polling index</pre>
<p><strong>3. Claiming a job exactly once (the core mechanism)</strong></p>
<pre>-- Atomic claim: the UPDATE is the lock. No distributed lock service required.
UPDATE jobs
   SET status = 'RUNNING',
       lease_owner = :workerId,
       lease_expires_at = now() + interval '60 seconds',
       attempt = attempt + 1
 WHERE job_id IN (
        SELECT job_id FROM jobs
         WHERE status = 'PENDING' AND run_at &lt;= now()
         ORDER BY run_at
         LIMIT 50
         FOR UPDATE SKIP LOCKED)      -- Postgres: workers never block each other
RETURNING *;

-- Worker runs the handler, then:  status='DONE'  (or reschedule if cron)
-- Long job? renew: UPDATE ... SET lease_expires_at = now()+60s WHERE lease_owner = me
-- Worker crashed? A recovery sweep resets rows where
--   status='RUNNING' AND lease_expires_at &lt; now()  → back to PENDING</pre>
<p><strong>4. Why execution is at-least-once, not exactly-once</strong></p>
<ul>
<li>A worker can finish the side effect and die before marking the job DONE — the lease expires and it runs again. No protocol removes this window.</li>
<li>Therefore: <strong>handlers must be idempotent</strong> (idempotency key stored with the effect, or naturally idempotent operations like upserts).</li>
<li>"Exactly-once" is achievable only for effects inside the same database transaction as the status update.</li>
</ul>
<p><strong>5. Scaling</strong></p>
<ul>
<li><strong>Partition by shard_key</strong> (tenant/user hash). Each partition is polled by its own worker group → no global hot index.</li>
<li><strong>Thundering herd at :00</strong>: every cron fires at the top of the hour. Spread with jitter, or store run_at with a per-job offset.</li>
<li><strong>Short delays at huge volume</strong>: an in-memory timing wheel or hierarchical wheel per node handles millions of sub-minute timers, with the durable table as the recovery source after a restart.</li>
<li><strong>Alternative substrates</strong>: Redis sorted set scored by run_at (ZRANGEBYSCORE + atomic pop via Lua), Kafka with delay topics per tier, or cloud primitives (SQS delay ≤ 15 min, EventBridge, Temporal for workflows).</li>
<li><strong>Leader election</strong> (via etcd/ZooKeeper/DB advisory lock) only for the recurring-job dispatcher, so a cron definition is expanded into a job row exactly once per period — with a unique constraint on (job_def_id, scheduled_for) as the real guard.</li>
</ul>
<p><strong>6. Retries and failure handling</strong></p>
<pre>backoff = min(base * 2^attempt, cap) + random jitter        -- jitter prevents sync waves
attempt &gt;= max_attempts → status = DEAD  → dead-letter table + alert + manual replay tool
Poison payloads must not block the queue: SKIP LOCKED + per-job attempt counters ensure
one bad job never stalls the others.</pre>
<p><strong>7. Operational must-haves</strong>: visibility into due-but-not-started lag (the real SLO), per-type success/failure rates, a way to pause a job type, and a way to replay dead jobs after a bug fix.</p>
<div class="key-point">The mechanism to name explicitly: <em>"claim with a conditional UPDATE plus a lease, recover by lease expiry"</em> — with <code>FOR UPDATE SKIP LOCKED</code> this scales to many workers on one table without any external lock service. Then be honest that this is at-least-once, so idempotent handlers are part of the design, not an afterthought.</div>`,
      },
      {
        q: 'How would you design a monitoring / observability pipeline (metrics, logs and traces at scale)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Observability is three data types with very different shapes, so they get three storage strategies: metrics are small, regular and numeric and go into a time-series database with aggregation and downsampling, logs are large and bursty and go into an indexed store with short retention plus cheap object storage for the rest, and traces are sampled because keeping every request is unaffordable. Agents on each host collect and batch locally, a durable buffer such as Kafka absorbs spikes so a monitoring outage never back-pressures production, and processing pipelines write into the appropriate stores. Cost control is the dominant design constraint: cardinality limits on labels, head and tail sampling for traces, aggressive retention tiers, and pre-aggregated rollups for dashboards. Alerting runs on metrics because they are cheap to evaluate, while logs and traces are used to investigate after an alert fires.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Observability gồm ba loại dữ liệu có hình dạng rất khác nhau, nên cần ba chiến lược lưu trữ: metric thì nhỏ, đều đặn và dạng số nên vào time-series database có tổng hợp và giảm mẫu; log thì lớn và bùng nổ theo đợt nên vào một kho có đánh chỉ mục với thời gian lưu ngắn cộng object storage giá rẻ cho phần còn lại; trace thì phải lấy mẫu vì giữ lại mọi request là không kham nổi chi phí. Agent trên từng máy thu thập và gom lô tại chỗ, một bộ đệm bền vững như Kafka hấp thụ các cú spike để sự cố của hệ thống giám sát không bao giờ dội ngược vào production, rồi các pipeline xử lý ghi vào đúng kho tương ứng. Kiểm soát chi phí là ràng buộc thiết kế lớn nhất: giới hạn cardinality của label, lấy mẫu đầu và cuối cho trace, phân tầng thời gian lưu trữ quyết liệt, và dựng sẵn các bảng rollup cho dashboard. Cảnh báo chạy trên metric vì đánh giá rẻ, còn log và trace dùng để điều tra sau khi cảnh báo nổ.</p></details>
<p><strong>1. The three signals and why they cannot share one store</strong></p>
<table>
<tr><th>Signal</th><th>Shape</th><th>Store</th><th>Retention</th></tr>
<tr><td><strong>Metrics</strong></td><td>Small numbers at regular intervals, aggregatable</td><td>TSDB: Prometheus, VictoriaMetrics, M3, Timestream</td><td>Raw days → downsampled months/years</td></tr>
<tr><td><strong>Logs</strong></td><td>Large, unstructured, bursty, high volume</td><td>Elasticsearch/OpenSearch or Loki + object storage</td><td>Hot 3-7 days indexed, cold in S3 for months</td></tr>
<tr><td><strong>Traces</strong></td><td>Per-request spans, huge volume, mostly uninteresting</td><td>Jaeger/Tempo/X-Ray on object storage</td><td>Sampled; days</td></tr>
</table>
<p><strong>2. Pipeline</strong></p>
<pre>[App: OpenTelemetry SDK]  metrics + structured logs + spans, batched in-process
        ↓ (local agent/sidecar: otel-collector, fluent-bit)  buffer on disk if downstream is down
[Kafka]  the shock absorber — monitoring spikes exactly when production is on fire
        ↓                     ↓                       ↓
 [Metrics writer]       [Log processor]         [Trace processor]
   → TSDB                 parse/enrich/redact       tail sampling
                          → index (hot)             → trace store
                          → S3 parquet (cold)
        ↓
[Query layer + dashboards + alerting rules]  → Alertmanager → PagerDuty/Slack</pre>
<p><strong>3. Metrics: cardinality is the thing that kills you</strong></p>
<pre>Series count = product of label values.
  http_requests{method=5, status=8, endpoint=200, pod=500}  = 4,000,000 series  💥
Rules:
  - NEVER put unbounded values in labels: user_id, request_id, email, full URL path.
  - Normalize paths: /users/12345 → /users/{id}
  - Enforce limits per team; drop and alert on cardinality explosions at the collector.
  - Use histograms for latency (compute p99 correctly) — averages hide every real problem.</pre>
<p><strong>4. Logs: control volume before it controls your budget</strong></p>
<ul>
<li><strong>Structured JSON</strong> logs with a trace id in every line — this is what links logs to traces.</li>
<li><strong>Sample</strong> high-volume INFO lines; keep 100% of WARN/ERROR.</li>
<li><strong>Index only what you query</strong> (Loki-style: index labels, store the body compressed) — full-text indexing everything is what makes log bills explode.</li>
<li><strong>Redact PII at the collector</strong>, not in the query layer — once it is stored, it is a compliance problem.</li>
<li><strong>Tiering</strong>: hot indexed 3-7 days → cold parquet in object storage, queried on demand.</li>
</ul>
<p><strong>5. Traces: sampling strategy is the design decision</strong></p>
<ul>
<li><strong>Head sampling</strong> (decide at the first service, e.g. keep 1%): cheap, but you lose the rare failures you care about.</li>
<li><strong>Tail sampling</strong> (buffer the whole trace, then decide): keep 100% of errors and slow traces plus a small baseline of normal ones. More expensive, far more useful.</li>
<li><strong>Context propagation</strong> (W3C traceparent) must cross every hop including queues, or traces break exactly where the interesting async work happens.</li>
</ul>
<p><strong>6. Alerting</strong></p>
<ul>
<li>Alert on <strong>symptoms users feel</strong> (error rate, latency, saturation) — the RED and USE methods — not on individual CPU spikes.</li>
<li>Alerts are evaluated on metrics because scanning logs for alerts is slow and expensive.</li>
<li><strong>Burn-rate alerts on SLOs</strong> beat static thresholds: page when the error budget is burning fast, ticket when it is slow.</li>
<li>Deduplicate, group and add a runbook link; an alert nobody can act on is noise that trains people to ignore the pager.</li>
</ul>
<p><strong>7. Design rules for the pipeline itself</strong></p>
<ul>
<li><strong>Never block the application</strong>: telemetry is fire-and-forget with bounded local buffers; if the pipeline is down, drop data rather than slow the request path.</li>
<li><strong>Isolate the monitoring stack</strong> from the systems it monitors (separate cluster/account) — otherwise it dies exactly when you need it.</li>
<li><strong>Backpressure and quotas per team/tenant</strong>, so one noisy service cannot blind everyone else.</li>
<li>Cost is a design constraint: observability spend of 10-30% of infrastructure spend is common and easy to exceed by accident.</li>
</ul>
<div class="key-point">Three lines to say out loud: <em>"metrics for alerting, traces for finding the slow hop, logs for the details of one request — linked by trace id"</em>; <em>"cardinality and retention are the cost knobs"</em>; and <em>"the telemetry path must never back-pressure production, so it buffers locally and drops rather than blocks."</em></div>`,
      },
      {
        q: 'A production system is slowing down under 10x growth — how do you find and fix the bottleneck? (real-project scaling playbook)',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Start by measuring instead of guessing: get p50, p95 and p99 latency broken down per endpoint and per dependency, because the fix for a slow database query is nothing like the fix for connection-pool exhaustion. The usual order of bottlenecks is database first, then N+1 query patterns and missing indexes, then serialized external calls, then connection pools and thread pools, and only then raw CPU or memory. Fixes are applied cheapest first: add the index, cache the hot read, batch or parallelize the calls, move slow work to a queue, add read replicas, and only shard or split services when a single node genuinely cannot hold the write load. Every change is verified by load testing against realistic data volume, and capacity is left with headroom because systems fail non-linearly once a resource passes about 80% utilization.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hãy bắt đầu bằng đo đạc thay vì đoán: lấy p50, p95 và p99 chia theo từng endpoint và từng dependency, vì cách sửa một câu truy vấn chậm hoàn toàn khác với cách sửa việc cạn connection pool. Thứ tự điểm nghẽn thường gặp là database trước, rồi tới các mẫu N+1 và thiếu index, rồi tới các lời gọi ngoài bị chạy tuần tự, rồi tới connection pool và thread pool, và chỉ sau đó mới tới CPU hay bộ nhớ thuần túy. Cách sửa được áp dụng theo thứ tự rẻ nhất trước: thêm index, cache các truy vấn đọc nóng, gom lô hoặc chạy song song các lời gọi, đẩy việc chậm sang hàng đợi, thêm read replica, và chỉ sharding hay tách service khi một node thực sự không gánh nổi lượng ghi. Mọi thay đổi đều phải kiểm chứng bằng load test trên khối lượng dữ liệu thực tế, và luôn chừa dư địa công suất, vì hệ thống hỏng theo cách phi tuyến khi một tài nguyên vượt quá khoảng 80% mức sử dụng.</p></details>
<p><strong>1. Measure — do not guess (the step everyone skips)</strong></p>
<pre>Questions to answer before touching code:
  - WHICH endpoint is slow? (p99 per route, not overall average)
  - WHERE does the time go? (APM/trace breakdown: app CPU vs DB vs external call vs queue wait)
  - WHEN? (constant, or only at peak / only for large tenants / only after a deploy)
  - Is it latency or saturation? (queueing = latency rises while throughput is flat)

Averages lie. A p99 of 4s with a p50 of 80ms is a queueing or hot-key problem,
not a "the code is slow" problem.</pre>
<p><strong>2. The usual suspects, in the order they actually occur</strong></p>
<table>
<tr><th>#</th><th>Bottleneck</th><th>Symptom</th><th>Typical fix</th></tr>
<tr><td>1</td><td>Missing/wrong index</td><td>One query dominates; seq scans in the plan</td><td>Add composite index matching the WHERE + ORDER BY</td></tr>
<tr><td>2</td><td>N+1 queries</td><td>Query count scales with result size</td><td>Join/fetch join, batch load (IN clause), DataLoader</td></tr>
<tr><td>3</td><td>Serialized external calls</td><td>Latency = sum of dependencies</td><td>Parallelize (CompletableFuture), batch, cache, set timeouts</td></tr>
<tr><td>4</td><td>Connection/thread pool exhaustion</td><td>Latency spikes with queue wait; pool metrics at 100%</td><td>Right-size the pool, fix the slow query holding connections, bulkhead per dependency</td></tr>
<tr><td>5</td><td>Lock contention</td><td>Throughput flat while CPU is idle</td><td>Shorter transactions, row-level instead of table-level, optimistic locking, shard the hot row</td></tr>
<tr><td>6</td><td>Cache miss storm</td><td>DB load spikes on deploy/expiry</td><td>Staggered TTL + jitter, request coalescing, pre-warm</td></tr>
<tr><td>7</td><td>GC / memory pressure</td><td>Periodic latency spikes, high pause time</td><td>Fix allocation hot spots, size the heap, use a low-pause collector</td></tr>
<tr><td>8</td><td>Genuine CPU limit</td><td>All cores at 100%, profile is flat</td><td>Optimize the hot path, then add instances</td></tr>
</table>
<p><strong>3. Fix in order of cost (do not start at the expensive end)</strong></p>
<pre>1. Index / query fix            hours,  no architecture change     ← usually 80% of the win
2. Cache the hot read           days,   adds invalidation concerns
3. Async the slow write path    days,   adds a queue + eventual consistency
4. Read replicas                days,   read-your-writes caveat
5. Vertical scale               hours,  buys time, costs money, has a ceiling
6. Horizontal scale (stateless) days,   requires no sticky sessions
7. Partition / shard the data   weeks,  changes the data model
8. Split the service            months, organizational change too</pre>
<p><strong>4. Load test the way production behaves</strong></p>
<ul>
<li>Test against <strong>production-sized data</strong> — an index that is unnecessary on 10k rows is critical on 100M.</li>
<li>Model realistic traffic mixes and think time; a uniform-random key distribution hides hot-key problems that are the actual production failure.</li>
<li>Ramp until something breaks and record <strong>where</strong> it breaks — that number is your capacity limit, and the shape of the failure is your degradation plan.</li>
<li>Watch the whole system: queue depth, pool utilization, replica lag, GC pauses — not just the request latency graph.</li>
</ul>
<p><strong>5. Keep it from happening again</strong></p>
<ul>
<li><strong>Headroom</strong>: plan for 50-60% steady-state utilization. Beyond ~80%, queueing theory makes latency explode non-linearly for a small traffic increase.</li>
<li><strong>Timeouts, retries with jitter, circuit breakers, bulkheads</strong> on every remote call — an unbounded retry storm turns a slow dependency into a full outage.</li>
<li><strong>Autoscale on a leading signal</strong> (queue depth, RPS per instance), not on CPU alone.</li>
<li><strong>Guardrails in CI</strong>: query-count assertions on key paths and a performance smoke test catch the next N+1 before it ships.</li>
<li><strong>Capacity review per quarter</strong>: current peak vs measured limit vs growth rate — the answer tells you what to fix before it becomes an incident.</li>
</ul>
<div class="key-point">The habit that marks experience: <em>"I profile before I optimize, and I fix the cheapest thing that removes the bottleneck."</em> Most 10x scaling problems are one index, one N+1, or one missing cache — not a missing microservice architecture. And always name the next bottleneck after the fix: if the database is no longer the limit, say what becomes the limit at the next 10x.</div>`,
      },
      // ──── ADVANCED / SPECIALIZED SYSTEM DESIGNS ────
      {
        q: 'How would you design a web crawler and the search indexing pipeline behind it?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A crawler is a distributed breadth-first traversal of the web whose real constraints are politeness and deduplication rather than raw speed. A URL frontier holds work partitioned so that all URLs of one host land in the same queue, which lets a single worker respect robots.txt and a per-host delay, and every URL is checked against a seen-set (a Bloom filter in front of a durable store) before being enqueued. Fetched pages are stored raw in object storage, parsed to extract links and text, and deduplicated by content hash or simhash because a large share of the web is near-duplicate. The indexing side is a batch or streaming pipeline that turns documents into an inverted index sharded by document, and query serving fans a request out to every shard, merges the top-K, and re-ranks. Freshness is handled by re-crawl priorities per site rather than by crawling everything again.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Crawler là một phép duyệt theo chiều rộng phân tán trên web, mà ràng buộc thật sự là tính lịch sự và khử trùng lặp chứ không phải tốc độ thô. Một URL frontier chứa công việc, được phân mảnh sao cho mọi URL của cùng một host rơi vào cùng một hàng đợi, nhờ đó một worker duy nhất có thể tôn trọng robots.txt và độ trễ theo host, và mọi URL đều được kiểm tra với tập đã thấy (một Bloom filter đặt trước một kho bền vững) trước khi đưa vào hàng đợi. Trang tải về được lưu thô trên object storage, được parse để trích link và văn bản, rồi khử trùng lặp bằng content hash hoặc simhash vì một phần lớn nội dung web là gần trùng nhau. Phía đánh chỉ mục là một pipeline batch hoặc streaming biến tài liệu thành inverted index phân mảnh theo tài liệu, còn khi phục vụ truy vấn thì tán request tới mọi shard, gộp top-K rồi xếp hạng lại. Độ tươi mới được xử lý bằng mức ưu tiên crawl lại cho từng site chứ không phải crawl lại tất cả.</p></details>
<p><strong>1. Scale first</strong></p>
<pre>1 billion pages/month → ~400 pages/sec sustained
Average page 100 KB (HTML) → 100 TB/month raw → object storage, not a database
Politeness: max 1 request per host per second → parallelism comes from crawling
            MANY hosts at once, never from hammering one host</pre>
<p><strong>2. Architecture</strong></p>
<pre>[Seed URLs] → [URL Frontier]  ← priority + politeness queues
                   ↓
              [Fetcher pool]  DNS cache → HTTP GET → raw HTML to S3
                   ↓
              [Parser]  extract text + outlinks + canonical URL
                   ↓                     ↓
        [Dedup: content hash/simhash]  [URL filter + seen-set] → back to Frontier
                   ↓
              [Indexer]  tokenize → inverted index → shards
                   ↓
        [Index shards] ← [Query service: scatter-gather + rank]</pre>
<p><strong>3. The URL frontier (the heart of a crawler)</strong></p>
<ul>
<li><strong>Two-level queues</strong>: front queues give priority (news site &gt; personal blog), back queues enforce politeness — one back queue per host, with a next-allowed-fetch timestamp.</li>
<li><strong>Partition by host hash</strong> so a host is owned by exactly one worker; otherwise per-host rate limiting needs distributed coordination.</li>
<li><strong>robots.txt</strong> is fetched once per host and cached with a TTL; crawl-delay is honoured.</li>
<li>Frontier must be durable (Kafka/Redis + DB) — a crash must not lose a month of discovered URLs.</li>
</ul>
<p><strong>4. Deduplication at two levels</strong></p>
<pre>URL dedup:     normalize (lowercase host, strip fragments/utm params, resolve relative)
               → Bloom filter in memory (fast "definitely new") + durable set for the maybes
Content dedup: exact  → SHA-256 of the normalized body
               near   → simhash / minhash, compare Hamming distance
               ~30% of the web is duplicate or boilerplate; skipping it saves the same % of cost</pre>
<p><strong>5. Traps and hazards to mention</strong></p>
<ul>
<li><strong>Crawler traps</strong>: infinite calendars, session ids in URLs, faceted-search URL explosions → cap depth, cap URLs per host, detect repeating path patterns.</li>
<li><strong>DNS is a bottleneck</strong> — cache resolutions aggressively and use an async resolver; naive DNS lookups dominate crawl latency.</li>
<li><strong>Slow/hostile servers</strong> → strict timeouts, per-host failure counters, exponential back-off, temporary blacklist.</li>
<li><strong>JS-rendered pages</strong> need a headless browser: 10-100x more expensive, so route only selected sites there.</li>
</ul>
<p><strong>6. From documents to an inverted index</strong></p>
<pre>Doc 1: "fast java tutorial"   Doc 2: "java streams tutorial"

inverted index (term → posting list with positions/frequencies):
   java     → [(1, tf=1), (2, tf=1)]
   tutorial → [(1, tf=1), (2, tf=1)]
   streams  → [(2, tf=1)]

Build: map(doc → terms) → shuffle by term → reduce(term → sorted posting list)
       (MapReduce/Spark for batch rebuilds; incremental segments for fresh docs)</pre>
<p><strong>7. Serving: shard by document, not by term</strong></p>
<table>
<tr><th>Sharding</th><th>Query cost</th><th>Verdict</th></tr>
<tr><td><strong>By document</strong> (each shard holds a full index of its own docs)</td><td>Fan out to all shards, each returns local top-K, merge</td><td>✅ Standard — balanced load, easy to add shards, resilient</td></tr>
<tr><td>By term (a shard owns certain terms)</td><td>Multi-term queries must join posting lists across machines</td><td>❌ Hot terms create hot shards; network-heavy</td></tr>
</table>
<ul>
<li>Ranking: BM25/TF-IDF for text relevance + query-independent signals (PageRank-style link authority, freshness, click feedback), then an expensive re-rank of only the merged top few hundred.</li>
<li>Caching: the query result cache absorbs the head of the distribution (a small number of queries are a large share of traffic).</li>
<li>Index updates: immutable segments + periodic merge (Lucene model) — never mutate posting lists in place.</li>
</ul>
<div class="key-point">Say these three things: <em>"politeness is per-host, so partition the frontier by host"</em>, <em>"dedup twice — URL before fetching, content after"</em>, and <em>"shard the index by document and scatter-gather, because term sharding turns every multi-word query into a distributed join."</em></div>`,
      },
      {
        q: 'How would you design a distributed key-value store (Dynamo / Cassandra style)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The design is a ring of equal peers with no leader: keys are placed by consistent hashing with virtual nodes, each key is replicated to the next N nodes on the ring, and the client tunes consistency with quorum values R and W so that R plus W greater than N gives overlapping reads and writes. Because writes are accepted even when some replicas are down, the system must repair itself: hinted handoff replays writes to nodes that were unavailable, read repair fixes divergence noticed during reads, and Merkle-tree anti-entropy compares replicas in the background. Conflicting concurrent writes are resolved by last-write-wins with timestamps or by vector clocks that surface siblings to the application. Locally, each node stores data in an LSM tree with a commit log, memtable, immutable SSTables, and Bloom filters, which makes writes sequential and fast while compaction manages read amplification.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Thiết kế là một vòng ring gồm các node ngang hàng, không có leader: key được đặt bằng consistent hashing kèm virtual node, mỗi key được nhân bản tới N node kế tiếp trên ring, và client tự chỉnh mức nhất quán bằng hai tham số quorum R và W sao cho R cộng W lớn hơn N để đọc và ghi luôn giao nhau. Vì hệ thống vẫn nhận write ngay cả khi một số replica đang chết, nó phải tự sửa chữa: hinted handoff phát lại write cho node từng không sẵn sàng, read repair sửa các sai lệch phát hiện lúc đọc, còn anti-entropy dùng cây Merkle để so sánh replica ở chế độ nền. Xung đột khi ghi đồng thời được giải quyết bằng last-write-wins theo timestamp hoặc bằng vector clock để lộ các phiên bản song song cho ứng dụng xử lý. Ở mỗi node, dữ liệu lưu theo LSM tree với commit log, memtable, các SSTable bất biến và Bloom filter, nhờ vậy write luôn tuần tự và nhanh, còn compaction lo phần khuếch đại đọc.</p></details>
<p><strong>1. Requirements that lead to this shape</strong></p>
<ul>
<li>Always writable (shopping cart, session store): choose <strong>AP</strong> in CAP terms — availability over strict consistency.</li>
<li>Linear scalability by adding nodes; no single point of failure; commodity hardware that fails constantly.</li>
<li>Simple API: <code>get(key)</code>, <code>put(key, value)</code> — no joins, no transactions across keys.</li>
</ul>
<p><strong>2. Partitioning: consistent hashing with virtual nodes</strong></p>
<pre>hash(key) → position on a 0..2^128 ring → owned by the next node clockwise

Virtual nodes (each physical node owns ~256 ring positions) because:
  - adding/removing a node moves only 1/N of the data
  - heterogeneous machines can own more or fewer vnodes
  - load stays even instead of depending on where a node lands on the ring</pre>
<p><strong>3. Replication and tunable consistency</strong></p>
<pre>Replicate each key to the next N distinct physical nodes (preference list),
skipping nodes in the same rack/AZ so a rack failure cannot take all copies.

N = 3, W = 2, R = 2 → R + W &gt; N → a read set always overlaps the last write set
N = 3, W = 1, R = 1 → fastest, may read stale data
N = 3, W = 3        → strong-ish writes, but any node down blocks writes

The client (or coordinator node) chooses per operation — consistency is a knob, not a property.</pre>
<p><strong>4. Handling failure — three repair mechanisms (this is what interviewers probe)</strong></p>
<table>
<tr><th>Mechanism</th><th>When</th><th>What it does</th></tr>
<tr><td><strong>Hinted handoff</strong></td><td>Write time, replica down</td><td>Another node accepts the write with a hint and replays it when the owner returns → write availability</td></tr>
<tr><td><strong>Read repair</strong></td><td>Read time</td><td>Coordinator sees divergent versions among replicas, returns the newest and pushes the fix to the stale ones</td></tr>
<tr><td><strong>Anti-entropy (Merkle trees)</strong></td><td>Background</td><td>Replicas compare hash trees of their key ranges and exchange only the differing subranges — cheap detection of long-term drift</td></tr>
</table>
<p><strong>5. Conflict resolution</strong></p>
<ul>
<li><strong>Last-write-wins</strong> with a timestamp: trivial, but clock skew silently loses writes. Cassandra's default.</li>
<li><strong>Vector clocks</strong>: detect true concurrency and return siblings; the application merges them (Dynamo's shopping cart unions the items — losing a delete is better than losing an add).</li>
<li><strong>CRDTs</strong> for counters/sets: merges are mathematically conflict-free, no application logic needed.</li>
</ul>
<p><strong>6. Membership and failure detection</strong>: a <strong>gossip</strong> protocol spreads node state, and a phi-accrual failure detector avoids flapping. No coordinator to lose — every node knows the ring.</p>
<p><strong>7. Storage engine on each node (LSM tree)</strong></p>
<pre>write → commit log (sequential, durability)  →  memtable (sorted, in memory)
        memtable full → flush → SSTable (immutable, sorted, on disk)
        background compaction merges SSTables, drops tombstones

read  → memtable → Bloom filter per SSTable (skip files that cannot contain the key)
        → partition index → the one SSTable that has it

Why LSM: writes are append-only and sequential (fast on both SSD and HDD).
Cost: read amplification and compaction IO — the classic write-optimized trade-off vs B-trees.
Deletes are tombstones; forgetting about tombstone TTL is a real production trap.</pre>
<div class="key-point">The senior framing: <em>"no leader, consistent hashing for placement, quorum for tunable consistency, and three self-healing mechanisms because failure is the normal state."</em> Then be explicit about the price: no cross-key transactions, no joins, and application-visible conflicts — you traded consistency and query power for availability and linear scale.</div>`,
      },
      {
        q: 'How would you design a real-time leaderboard / ranking system (millions of players, top-K plus my rank)?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A leaderboard is a sorted-set problem, so the natural primary structure is a Redis sorted set where a score update is a logarithmic operation and top-K is a direct range read. The difficulty is not the top 100, which is tiny and cacheable, but answering "what is my rank" for tens of millions of users, and the practical answer is either an exact rank from the sorted set while it fits in memory, or an approximate rank computed from score-bucket counters once it does not. Durable scores live in a database and the sorted set is a rebuildable projection, so a Redis failure loses speed rather than data. Time-scoped boards, such as daily or weekly, are separate keys with a TTL, and very large boards are sharded by score range or by region with a merge step at read time.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Leaderboard về bản chất là bài toán tập sắp xếp, nên cấu trúc chính tự nhiên là Redis sorted set, ở đó cập nhật điểm là thao tác logarit còn lấy top-K là một lần đọc dải liên tiếp. Cái khó không nằm ở top 100 vốn rất nhỏ và dễ cache, mà ở việc trả lời "tôi đang hạng mấy" cho hàng chục triệu người dùng; cách làm thực tế là lấy hạng chính xác từ sorted set khi còn vừa bộ nhớ, hoặc tính hạng xấp xỉ từ các bộ đếm theo khoảng điểm khi đã vượt quá. Điểm số bền vững nằm ở database còn sorted set chỉ là một phép chiếu dựng lại được, nên Redis hỏng thì mất tốc độ chứ không mất dữ liệu. Các bảng theo thời gian như ngày hoặc tuần là các key riêng có TTL, còn bảng cực lớn thì phân mảnh theo khoảng điểm hoặc theo khu vực rồi gộp lại lúc đọc.</p></details>
<p><strong>1. The operations and their required complexity</strong></p>
<table>
<tr><th>Operation</th><th>Frequency</th><th>Target</th></tr>
<tr><td>Update score</td><td>Very high (every match/action)</td><td>O(log N)</td></tr>
<tr><td>Top-K (K = 10..100)</td><td>Very high, identical for everyone</td><td>O(log N + K), cacheable</td></tr>
<tr><td>My rank</td><td>High, unique per user</td><td>O(log N) exact, or O(1) approximate</td></tr>
<tr><td>Neighbours (ranks around me)</td><td>Medium</td><td>Range read around my index</td></tr>
</table>
<p><strong>2. Redis sorted set — the default answer</strong></p>
<pre>ZADD   leaderboard:global 1500 user:42       -- set/update score       O(log N)
ZINCRBY leaderboard:global 25 user:42        -- atomic increment
ZREVRANGE leaderboard:global 0 9 WITHSCORES  -- top 10                 O(log N + K)
ZREVRANK  leaderboard:global user:42         -- my rank (0-based)      O(log N)
ZREVRANGE leaderboard:global :r-2 :r+2       -- players around me

Implementation: skip list + hash map → ordered access and O(1) score lookup.
Memory: ~60-100 bytes per member → 10 M players ≈ 1 GB. 100 M players → shard.</pre>
<p><strong>3. Durability: Redis is the index, not the record</strong></p>
<pre>Match ends → write score to the DB (source of truth)
           → ZADD/ZINCRBY to Redis (the ranking projection)
           → (optionally publish an event for feeds/achievements)

Redis lost? Rebuild by streaming scores from the DB. Enable AOF for a faster warm start.
Never let "the leaderboard" be the only copy of a player's score.</pre>
<p><strong>4. Scaling past one sorted set</strong></p>
<ul>
<li><strong>Time-scoped boards</strong>: <code>leaderboard:daily:2026-08-11</code>, <code>:weekly:2026-W33</code> with TTLs. This is also the cheapest way to keep set sizes small and interest high.</li>
<li><strong>Segment boards</strong>: per region, per league, per friend group — smaller sets, and most users only care about their own segment.</li>
<li><strong>Score-range sharding</strong> for one huge global board: shard S holds scores in a bucket; top-K reads only the top shard, and a global rank = (count of all higher shards) + local rank.</li>
<li><strong>Approximate rank at extreme scale</strong>: maintain counters of "how many players have a score in bucket B" (a histogram). Rank ≈ sum of counts above my bucket + interpolation inside it — O(number of buckets), and users below the top few thousand cannot tell the difference.</li>
<li><strong>Percentile instead of rank</strong>: "top 3%" is cheaper to compute and often better UX than "rank 412,908".</li>
</ul>
<p><strong>5. Write amplification and hot keys</strong></p>
<ul>
<li>Batch or debounce updates for chatty games (aggregate in memory, flush every second) — a sorted set update per action is unnecessary.</li>
<li>One global key is a single-shard hotspot in Redis Cluster; segmenting boards is also the fix for that.</li>
<li>Use <code>ZINCRBY</code> instead of read-modify-write to keep updates atomic and lock-free.</li>
</ul>
<p><strong>6. Details interviewers like</strong></p>
<ul>
<li><strong>Tie-breaking</strong>: encode a tiebreaker into the score, e.g. score * 10^10 + (max_ts - achieved_ts), so earlier achievers rank first while remaining a single double value (watch the 2^53 precision limit).</li>
<li><strong>Anti-cheat</strong>: scores are computed server-side and validated; never trust a client-submitted score.</li>
<li><strong>Consistency</strong>: leaderboards can be seconds stale — say so explicitly and use that freedom for caching top-K at the edge.</li>
</ul>
<div class="key-point">The answer in one line: <em>"a sorted set gives O(log N) updates and O(log N + K) top-K, so the only genuinely hard part is per-user rank at 100 M scale — and that is solved with score-bucket counters and an approximate rank, or by never showing a global rank at all."</em></div>`,
      },
      {
        q: 'How would you design a real-time analytics / ad-click aggregation system (counting at massive scale)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Counting at scale is a streaming aggregation problem where the design decisions are windowing, late data, deduplication and cost. Events arrive on a partitioned log, a stream processor aggregates them into time windows keyed by the dimensions you will query, and results are written into an OLAP store as pre-aggregated rollups, because scanning raw events per query is far too expensive. Correctness comes from idempotent writes keyed by window and dimension plus deduplication on an event id, since the pipeline is at-least-once, and watermarks decide how long a window stays open for late events with a separate correction path for stragglers. Where exact numbers are not required, probabilistic structures such as HyperLogLog for unique counts and count-min sketch for heavy hitters replace expensive exact aggregation. Billing-grade numbers get a slower batch recomputation that reconciles the fast path.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Đếm ở quy mô lớn là bài toán tổng hợp theo luồng, ở đó các quyết định thiết kế là cửa sổ thời gian, dữ liệu đến trễ, khử trùng lặp và chi phí. Sự kiện đi vào một log phân mảnh, một stream processor gộp chúng theo các cửa sổ thời gian với khóa là các chiều mà bạn sẽ truy vấn, rồi ghi kết quả vào một kho OLAP dưới dạng rollup tính sẵn, vì quét dữ liệu thô cho từng truy vấn là quá đắt. Tính đúng đắn đến từ việc ghi idempotent theo khóa (cửa sổ, chiều) cộng với khử trùng lặp theo event id, bởi pipeline chỉ đảm bảo at-least-once; watermark quyết định cửa sổ mở bao lâu để chờ dữ liệu trễ, kèm một đường sửa chữa riêng cho những sự kiện quá muộn. Ở những chỗ không cần con số chính xác tuyệt đối, các cấu trúc xác suất như HyperLogLog cho số lượng duy nhất và count-min sketch cho các phần tử nổi trội sẽ thay cho việc tổng hợp chính xác vốn rất tốn kém. Những con số dùng để tính tiền thì có thêm một lần tính lại theo lô, chậm hơn, để đối soát với đường nhanh.</p></details>
<p><strong>1. The query patterns define the aggregation keys</strong></p>
<pre>"Clicks for ad X in the last 5 minutes"        → (ad_id, minute)
"Top 100 ads by CTR today by country"          → (ad_id, country, day)
"Unique users who saw campaign C this week"    → distinct count → HyperLogLog
Decide the dimension combinations UP FRONT — you cannot roll up what you did not key.</pre>
<p><strong>2. Pipeline</strong></p>
<pre>[Click/impression events] → Kafka (partitioned by ad_id, retention 7d)
        ↓
[Stream processor: Flink / Kafka Streams / Spark Streaming]
    - dedupe by event_id (state store, TTL = the dedupe window)
    - tumbling windows: 1 min → aggregate counts per dimension key
    - watermark: allow lateness of e.g. 5 min, then close the window
        ↓
[OLAP store: ClickHouse / Druid / BigQuery]   ← minute rollups
        ↓ (further rollup jobs: minute → hour → day)
[Query API + cache] → dashboards

[Raw events archive to S3] ─→ [Nightly batch recompute] ─→ corrections / billing truth</pre>
<p><strong>3. Windowing and late events (the part that separates real answers)</strong></p>
<ul>
<li><strong>Event time, not processing time</strong> — a mobile client that was offline sends clicks minutes later; counting them in the wrong minute makes every chart wrong.</li>
<li><strong>Watermark</strong> = "I believe I have seen all events up to time T". Windows close after the watermark passes; lateness is a tunable trade-off between latency and completeness.</li>
<li><strong>Very late events</strong>: route to a side output and apply as corrections to the already-written rollup (the store must support updates or the query layer must sum a corrections table).</li>
<li><strong>Idempotent sink</strong>: write with primary key (window_start, dimensions) and upsert the value, so a replay after a crash produces the same number instead of double counting.</li>
</ul>
<p><strong>4. Probabilistic structures — when exactness is not worth the money</strong></p>
<table>
<tr><th>Need</th><th>Structure</th><th>Cost / accuracy</th></tr>
<tr><td>Unique visitors</td><td><strong>HyperLogLog</strong></td><td>~12 KB per counter, ~2% error, mergeable across shards and time buckets</td></tr>
<tr><td>Top-K / heavy hitters</td><td><strong>Count-min sketch</strong> (+ a heap)</td><td>Fixed memory, may overcount rare items; perfect for "top ads/URLs"</td></tr>
<tr><td>"Have we seen this event id?"</td><td><strong>Bloom filter</strong></td><td>Small, false positives only → cheap first-line dedupe before the state store</td></tr>
<tr><td>Percentiles (latency, bid price)</td><td><strong>t-digest / DDSketch</strong></td><td>Mergeable approximate quantiles — averages are useless here</td></tr>
</table>
<p>Exact distinct counts across billions of events require huge state; HLL merges make "uniques per hour, rolled up to a week" almost free.</p>
<p><strong>5. Lambda vs kappa in practice</strong></p>
<ul>
<li><strong>Fast path</strong> (streaming) serves dashboards in seconds and is allowed to be approximate.</li>
<li><strong>Slow path</strong> (batch over the raw archive) recomputes the same numbers nightly and is the source of truth for <strong>billing</strong> — advertisers get invoiced from this, not from the stream.</li>
<li>Publish the reconciliation delta as a metric; a growing gap between fast and slow paths is a bug alarm.</li>
</ul>
<p><strong>6. Practical concerns</strong></p>
<ul>
<li><strong>Hot keys</strong>: one viral ad saturates a partition → two-stage aggregation (pre-aggregate with a salted key, then merge).</li>
<li><strong>Click fraud / dedupe</strong>: same user clicking 100 times, bot traffic — filter before aggregation, and keep the raw events so filters can be re-applied retroactively.</li>
<li><strong>Cardinality control</strong>: (ad_id × country × device × hour) explodes quickly; cap dimension combinations and pre-define the cubes you support.</li>
<li><strong>Retention tiers</strong>: minute granularity for 7 days, hourly for 90 days, daily forever.</li>
</ul>
<div class="key-point">The three sentences that land it: <em>"aggregate on event time with watermarks, not on arrival time"</em>, <em>"make the sink idempotent by (window, dimensions) so replays are safe under at-least-once"</em>, and <em>"use HLL/count-min where approximate is fine, and reconcile with a nightly batch job for anything that turns into an invoice."</em></div>`,
      },
      {
        q: 'How would you design a collaborative document editor (Google Docs): real-time multi-user editing?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The core problem is that two users edit the same text at the same time on different machines, so edits must be expressed as operations against a version rather than as a whole document, and the system needs a rule that makes concurrent operations converge to the same result everywhere. There are two proven approaches: operational transformation, where a central server serializes operations and transforms each incoming operation against the ones it missed, and CRDTs, where every character gets a unique identifier so operations commute by construction and no central authority is needed. Around that core sit a WebSocket layer per document, presence and cursor broadcasting, periodic snapshots plus an operation log for history and recovery, and offline support that replays queued operations on reconnect. Documents are sharded by document id, with one owning server per active document so ordering stays simple.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Vấn đề cốt lõi là hai người cùng sửa một đoạn văn bản tại cùng thời điểm trên hai máy khác nhau, nên các thay đổi phải được biểu diễn dưới dạng operation gắn với một phiên bản chứ không phải gửi cả tài liệu, và hệ thống cần một quy tắc để các operation đồng thời hội tụ về cùng một kết quả ở mọi nơi. Có hai hướng đã được kiểm chứng: operational transformation, trong đó một server trung tâm xếp thứ tự các operation và biến đổi operation đến sao cho phù hợp với những operation nó chưa thấy; và CRDT, trong đó mỗi ký tự có một định danh duy nhất nên các operation giao hoán được về mặt bản chất và không cần một trọng tài trung tâm. Bao quanh phần lõi đó là một lớp WebSocket theo từng tài liệu, phát tán presence và vị trí con trỏ, chụp snapshot định kỳ kèm log operation để phục vụ lịch sử và khôi phục, cùng khả năng làm việc offline bằng cách phát lại các operation đã xếp hàng khi kết nối lại. Tài liệu được phân mảnh theo document id, mỗi tài liệu đang mở do đúng một server sở hữu để việc sắp thứ tự luôn đơn giản.</p></details>
<p><strong>1. Why "send the whole document" and "last write wins" both fail</strong></p>
<pre>Document: "HELLO"
  User A inserts "!" at position 5     → "HELLO!"
  User B inserts "?" at position 0     → "?HELLO"
Naive last-write-wins → one edit is silently destroyed.
Naive apply-both-in-arrival-order → positions have shifted → text corrupts ("?HELL!O").</pre>
<p><strong>2. Approach A — Operational Transformation (what Google Docs uses)</strong></p>
<pre>Every op carries the document version it was based on:
   A: insert("!", pos 5, base v10)
   B: insert("?", pos 0, base v10)

Server picks an order (A then B), and TRANSFORMS B against A:
   transform(insert@0, against insert@5) → insert@0 unchanged
   transform(insert@5, against insert@0) → insert@6   (shifted by the earlier insert)

Both clients end with "?HELLO!"  → convergence.
Client-side: keep a buffer of unacknowledged local ops, transform incoming server ops
against them (this is what makes typing feel instant with no round trip).</pre>
<ul>
<li>Needs a <strong>central server</strong> to define the canonical order; transformation functions must satisfy the TP1/TP2 properties and are famously easy to get subtly wrong.</li>
<li>Compact on the wire — an op is a few bytes.</li>
</ul>
<p><strong>3. Approach B — CRDT (Yjs, Automerge, Figma-style)</strong></p>
<pre>Each character gets a globally unique, ordered id: (siteId, counter) + a position between neighbours.
   Insert = "add character with id X between ids A and B"
   Delete = tombstone the id (never shift indexes)

Because ids are unique and ordering is total, ops COMMUTE:
   apply(op1, op2) == apply(op2, op1)   → converge with no transformation and no server
Server can be a dumb relay; peer-to-peer and offline-first work naturally.</pre>
<table>
<tr><th></th><th>OT</th><th>CRDT</th></tr>
<tr><td>Central server</td><td>Required (ordering authority)</td><td>Not required (relay only)</td></tr>
<tr><td>Metadata size</td><td>Small</td><td>Larger (ids + tombstones; needs garbage collection)</td></tr>
<tr><td>Implementation risk</td><td>Transformation functions are hard</td><td>Data structure is complex but the merge rule is proven</td></tr>
<tr><td>Offline / P2P</td><td>Awkward</td><td>Natural</td></tr>
<tr><td>Used by</td><td>Google Docs, Etherpad</td><td>Yjs, Automerge, Figma, Apple Notes</td></tr>
</table>
<p><strong>4. System architecture</strong></p>
<pre>[Browser] ←WebSocket→ [Doc session server]   ← one OWNER server per active doc
                             │  in-memory doc state + op log
                             ├→ [Redis pub/sub] presence, cursors, awareness
                             ├→ [Op log store]  append-only ops (Kafka/DB)
                             └→ [Snapshot store] periodic full document + version

Routing: consistent hashing on document_id → all editors of one doc land on the same server.
Persistence: snapshot every N ops or T seconds; recovery = latest snapshot + replay ops after it.</pre>
<p><strong>5. The rest of the product (do not forget these in the interview)</strong></p>
<ul>
<li><strong>Presence and cursors</strong>: ephemeral, high frequency, lossy — broadcast over pub/sub, never persisted.</li>
<li><strong>Offline editing</strong>: queue ops locally (IndexedDB), replay on reconnect; CRDTs merge them, OT needs transformation against everything missed.</li>
<li><strong>Version history</strong>: op log gives infinite undo and named revisions; compaction turns old ops into snapshots.</li>
<li><strong>Permissions</strong> checked at session join and on every op (a share link revoked mid-session must take effect).</li>
<li><strong>Large documents</strong>: split into blocks/paragraphs so a single edit does not re-broadcast the whole tree; rich text is modelled as attributed ranges, which multiplies the transformation cases.</li>
<li><strong>Failover</strong>: if the owning server dies, another loads snapshot + op log and clients reconnect — clients must be able to resume from their last acknowledged version.</li>
</ul>
<div class="key-point">The framing that shows depth: <em>"you cannot send document state, you send intent as operations against a version, and you need a convergence rule — OT (server transforms, small payloads) or CRDT (unique ids, commutative merges, works offline and P2P)."</em> Then mention snapshot + op log for persistence, and one owning server per document so ordering never becomes a distributed consensus problem.</div>`,
      },
      {
        q: 'How would you design a multi-region architecture for high availability and disaster recovery (RPO/RTO, active-active vs active-passive)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Start from the business numbers rather than the topology: RPO says how much data you may lose and RTO says how long you may be down, and those two numbers decide whether you need backups, a warm standby, or full active-active. The hard part is never the stateless tier, which is trivial to run everywhere, but the data: synchronous cross-region replication buys zero data loss at the cost of write latency measured in tens of milliseconds, while asynchronous replication keeps writes fast but loses whatever was in flight during a failover. Active-passive with async replication and a tested failover procedure is the right answer for most systems, and active-active is justified when you need regional write locality or survival of a full region without downtime, at which point you must solve conflicting writes by partitioning users to a home region or by using conflict-free data types. Failover must be automated, routinely rehearsed, and paired with a plan for failing back.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hãy bắt đầu từ các con số của nghiệp vụ chứ không phải từ sơ đồ: RPO cho biết được phép mất bao nhiêu dữ liệu, RTO cho biết được phép ngưng bao lâu, và hai con số đó quyết định bạn cần backup, một standby ấm, hay active-active đầy đủ. Phần khó không bao giờ là tầng stateless vốn dễ chạy ở mọi nơi, mà là dữ liệu: replication đồng bộ xuyên vùng cho mất mát bằng không nhưng phải trả giá bằng độ trễ ghi hàng chục mili-giây, còn replication bất đồng bộ giữ được tốc độ ghi nhưng sẽ mất phần dữ liệu đang trên đường khi failover. Với đa số hệ thống, active-passive kèm replication bất đồng bộ và một quy trình failover đã được diễn tập là câu trả lời đúng; active-active chỉ xứng đáng khi bạn cần ghi cục bộ theo vùng hoặc phải sống sót khi mất trọn một vùng mà không ngưng dịch vụ, và khi đó bạn phải xử lý xung đột ghi bằng cách gán mỗi người dùng về một vùng nhà hoặc dùng các kiểu dữ liệu không xung đột. Việc failover phải tự động, được diễn tập thường xuyên, và luôn đi kèm kế hoạch quay về vùng cũ.</p></details>
<p><strong>1. Define the numbers before the architecture</strong></p>
<table>
<tr><th>Tier</th><th>RPO (data loss)</th><th>RTO (downtime)</th><th>Architecture</th><th>Relative cost</th></tr>
<tr><td>Backup &amp; restore</td><td>Hours</td><td>Hours-days</td><td>Snapshots to another region</td><td>1x</td></tr>
<tr><td>Pilot light</td><td>Minutes</td><td>~1 hour</td><td>Data replicated, compute off until needed</td><td>1.2x</td></tr>
<tr><td>Warm standby</td><td>Seconds</td><td>Minutes</td><td>Scaled-down full stack running, async replica</td><td>1.5x</td></tr>
<tr><td>Active-active</td><td>~0 (or conflict-resolved)</td><td>Seconds</td><td>All regions serving, global routing</td><td>2x+ and much more complexity</td></tr>
</table>
<p><strong>2. The replication trade-off is the whole design</strong></p>
<pre>Synchronous cross-region:  commit waits for the remote replica
   → RPO = 0, but every write pays the round trip (e.g. SG↔EU ≈ 160 ms)
   → and a remote outage can stall writes unless you allow degraded quorum

Asynchronous cross-region: commit locally, ship the log
   → writes stay fast, RPO = replication lag (usually seconds)
   → failover loses in-flight transactions: you MUST decide what to do about them
     (reconcile from an event log / accept the loss / block the promotion until lag is 0)

Middle ground: synchronous across AZs inside a region (cheap, ~1 ms),
               asynchronous across regions. This is what most systems actually run.</pre>
<p><strong>3. Active-passive failover mechanics</strong></p>
<pre>Steady state:  region A primary (read+write) → async replica in region B (read-only)
Failover:      1. detect (health checks from an independent third location)
               2. stop writes to A (fencing! a half-alive primary causes split brain)
               3. promote B's replica, verify applied lag
               4. flip traffic: DNS with low TTL / global load balancer / Anycast
               5. reconfigure app config (connection strings via service discovery, not hardcoded)
Fail back:     resync A from B, then plan a controlled switch — never an automatic flap.</pre>
<ul>
<li><strong>Fencing/STONITH</strong> matters more than promotion speed: two primaries accepting writes is worse than an outage.</li>
<li><strong>DNS TTL</strong> is a lie in practice (clients cache longer) — prefer a global load balancer or Anycast for fast, reliable cutover.</li>
<li>Automate it and <strong>rehearse it</strong> (game days). An untested failover procedure is not a DR plan, it is a document.</li>
</ul>
<p><strong>4. Active-active: only if you can answer "who wins on conflict?"</strong></p>
<ul>
<li><strong>Partition by user home region</strong> (the sane default): each user's writes go to one region; other regions have read replicas. No write conflicts by construction, and moving a user between regions is an explicit migration.</li>
<li><strong>Conflict resolution</strong> if you truly write the same row in two regions: last-write-wins (loses data silently), application merge, or CRDTs (counters, sets).</li>
<li><strong>Globally unique ids</strong> (UUID/Snowflake with a region bit) — auto-increment ids collide across regions.</li>
<li><strong>Idempotency</strong> everywhere, because failover replays in-flight requests.</li>
<li><strong>Beware the read-your-own-writes gap</strong>: a user routed to another region mid-session sees stale data. Sticky routing plus a version token in the session fixes it.</li>
</ul>
<p><strong>5. Everything else that has to be multi-region too</strong></p>
<ul>
<li><strong>Object storage</strong>: cross-region replication for user uploads (often the largest RPO surprise).</li>
<li><strong>Caches</strong> are regional and cold after failover — a stampede on a cold cache can kill the surviving region. Pre-warm or shed load on cutover.</li>
<li><strong>Queues</strong>: in-flight messages in the failed region can be stranded; design consumers to be idempotent and replayable from the source of truth.</li>
<li><strong>Secrets, DNS, CI/CD, identity</strong> — the control plane must not live only in the region you just lost.</li>
<li><strong>Capacity</strong>: the surviving region must have headroom for 100% of traffic, or failover turns into a slow-motion overload.</li>
<li><strong>Data residency</strong> (GDPR and similar) can legally forbid replicating certain data across borders — this is a design constraint, not an afterthought.</li>
</ul>
<div class="key-point">Say the numbers first: <em>"what is our RPO and RTO?"</em> — that single question converts a vague "make it highly available" into a concrete architecture and a concrete bill. Then the honest senior answer for most products: multi-AZ synchronous inside one region, asynchronous replica in a second region, automated and rehearsed failover, and active-active only where write locality or zero-downtime regional failure is genuinely required.</div>`,
      },
      {
        q: 'How would you design a multi-tenant SaaS platform (tenant isolation, noisy neighbours, per-tenant scaling)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The central decision is the isolation model, and it is a spectrum: a shared database with a tenant id column is cheapest and scales to many small tenants, a schema per tenant gives clearer separation with moderate operational cost, and a database or full stack per tenant gives the strongest isolation and compliance story at the highest cost. Most successful products run a hybrid: pooled infrastructure for the long tail and dedicated resources for large or regulated customers, with a documented migration path between tiers. Whatever the model, tenant context must be enforced in one place — a filter or row-level security rather than in every query — because a single missing where clause is a cross-tenant data leak. The other permanent concerns are noisy neighbours, solved with per-tenant quotas and rate limits, tenant-aware caching and observability so you can answer which tenant caused an incident, and onboarding and offboarding automation including per-tenant data export and deletion.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Quyết định trung tâm là mô hình cô lập, và nó là một dải: dùng chung database với một cột tenant id thì rẻ nhất và phục vụ tốt nhiều khách hàng nhỏ; mỗi tenant một schema thì tách bạch rõ hơn với chi phí vận hành vừa phải; mỗi tenant một database hoặc trọn bộ hạ tầng riêng thì cô lập mạnh nhất và dễ đáp ứng tuân thủ nhất, nhưng đắt nhất. Phần lớn sản phẩm thành công chạy mô hình lai: hạ tầng dùng chung cho nhóm khách hàng nhỏ đông đảo, tài nguyên riêng cho khách hàng lớn hoặc bị quản lý chặt, kèm một lộ trình chuyển đổi giữa các tầng. Dù chọn mô hình nào, ngữ cảnh tenant phải được áp đặt ở một chỗ duy nhất — một filter hoặc row-level security thay vì lặp trong từng câu truy vấn — vì chỉ cần thiếu một mệnh đề where là rò rỉ dữ liệu chéo giữa khách hàng. Những mối lo thường trực còn lại là hàng xóm ồn ào, xử lý bằng quota và rate limit theo tenant; cache và giám sát có gắn nhãn tenant để trả lời được sự cố do khách hàng nào gây ra; và tự động hóa việc onboard, offboard gồm cả xuất và xóa dữ liệu theo tenant.</p></details>
<p><strong>1. The isolation spectrum — know the trade-offs cold</strong></p>
<table>
<tr><th>Model</th><th>Isolation</th><th>Cost per tenant</th><th>Ops burden</th><th>Fits</th></tr>
<tr><td><strong>Pooled</strong>: shared DB, tenant_id column</td><td>Logical only (code/RLS enforced)</td><td>Lowest</td><td>One migration for all</td><td>Thousands of small tenants, self-serve SaaS</td></tr>
<tr><td><strong>Bridge</strong>: shared DB, schema per tenant</td><td>Better; per-tenant backup/restore possible</td><td>Medium</td><td>Migrations × N schemas; connection/catalog limits</td><td>Hundreds of mid-size tenants</td></tr>
<tr><td><strong>Silo</strong>: DB (or stack) per tenant</td><td>Strongest; blast radius = one tenant</td><td>Highest</td><td>N deployments, N migrations, N monitors</td><td>Enterprise, regulated, "your data on your infra"</td></tr>
</table>
<p>Real answer: <strong>hybrid</strong> — pooled by default, silo for enterprise tier, with tooling to migrate a tenant from pooled to silo when they upgrade. Design the migration path early; retrofitting it is painful.</p>
<p><strong>2. Enforcing tenant isolation so it cannot be forgotten</strong></p>
<pre>-- ❌ Enforcement scattered in every query = one missing clause is a data breach
SELECT * FROM invoices WHERE id = :id;              -- forgot AND tenant_id = ?

-- ✅ Postgres row-level security: the database enforces it
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON invoices
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
-- the app sets: SET LOCAL app.tenant_id = '...' at the start of each transaction

-- ✅ Application layer: resolve tenant ONCE from the JWT/subdomain into a request-scoped
--    context, and apply it centrally (Hibernate filter / repository base class / interceptor).
--    NEVER take tenant_id from a request body or query parameter.</pre>
<ul>
<li>Add an automated test that runs the suite as tenant B and asserts zero rows of tenant A are reachable.</li>
<li>Every table that holds tenant data carries tenant_id in the <strong>primary key or leading index column</strong> — it is also the natural partition key.</li>
</ul>
<p><strong>3. Noisy neighbours — the defining failure mode of pooled SaaS</strong></p>
<ul>
<li><strong>Per-tenant quotas and rate limits</strong> at the gateway (requests/sec, concurrent jobs, storage, API credits), enforced with a per-tenant counter.</li>
<li><strong>Bulkheads</strong>: separate worker pools or queues per tier so one tenant's bulk import cannot starve everyone's interactive traffic.</li>
<li><strong>Fair scheduling</strong> for async work: round-robin across tenants instead of FIFO, or a per-tenant concurrency cap.</li>
<li><strong>Query guardrails</strong>: statement timeouts, forced pagination, and a ban on unbounded exports in the shared path (route those to a replica).</li>
<li><strong>Whale detection</strong>: alert when one tenant crosses a share of total resource usage — that is the signal to move them to a silo.</li>
</ul>
<p><strong>4. Tenant-aware everything else</strong></p>
<ul>
<li><strong>Caching</strong>: tenant id is part of every cache key. A cache key collision across tenants is the same severity as a SQL leak.</li>
<li><strong>Observability</strong>: tenant id as a log field and a low-cardinality metric label only for top tenants (do not blow up cardinality — see the observability question).</li>
<li><strong>Feature flags and config</strong> per tenant/plan; the same code path must serve all tiers, with behaviour driven by configuration.</li>
<li><strong>Schema migrations</strong>: must be backward compatible and applied per tenant with progress tracking; a failed migration on tenant 4,312 of 9,000 must be resumable.</li>
<li><strong>Onboarding/offboarding</strong>: automated provisioning, and a real per-tenant <strong>data export and hard delete</strong> (contractual and GDPR requirement — a shared table makes deletion work you must design, not assume).</li>
<li><strong>Per-tenant encryption keys</strong> for regulated tiers, so a key deletion is a cryptographic erase.</li>
<li><strong>Billing/metering</strong> derived from the same usage counters that power quotas.</li>
</ul>
<div class="key-point">The line that shows you have run this in production: <em>"tenant isolation is enforced in exactly one place — RLS or a central filter — because relying on developers to remember a WHERE clause is a data breach with a schedule."</em> Second: pooled vs silo is not a religion, it is a per-customer tier decision, so build the migration path between them from day one.</div>`,
      },
      {
        q: 'How would you design a stock exchange / order matching engine (low latency, deterministic, no lost orders)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>An exchange inverts the usual priorities: correctness and determinism come first, latency is measured in microseconds, and throughput is achieved by keeping the matching engine single-threaded and entirely in memory instead of by scaling out. Orders enter through gateways that perform risk and validation checks, pass through a sequencer that assigns a total order, and then hit one matching engine per instrument that maintains a limit order book and matches by price-time priority. Durability comes from event sourcing: the sequenced input stream is written to a replicated log, so a standby engine can replay the same inputs and reach exactly the same state, which is only possible because the engine is deterministic and free of clocks, random values and concurrency. Market data and execution reports fan out to clients on a separate publish path so slow consumers never slow down matching.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một sàn giao dịch đảo ngược thứ tự ưu tiên thông thường: tính đúng đắn và tính tất định đứng đầu, độ trễ tính bằng micro-giây, và throughput đạt được bằng cách giữ matching engine chạy đơn luồng hoàn toàn trong bộ nhớ chứ không phải bằng scale out. Lệnh đi vào qua các gateway làm nhiệm vụ kiểm tra rủi ro và tính hợp lệ, qua một sequencer gán thứ tự toàn cục, rồi tới một matching engine cho mỗi mã, nơi duy trì sổ lệnh giới hạn và khớp theo ưu tiên giá rồi tới thời gian. Tính bền vững đến từ event sourcing: dòng input đã được đánh thứ tự được ghi vào một log nhân bản, nhờ đó một engine dự phòng có thể phát lại đúng các input đó và đạt đúng cùng một trạng thái — điều này chỉ khả thi vì engine là tất định, không dùng đồng hồ, không dùng số ngẫu nhiên và không có xử lý đồng thời. Dữ liệu thị trường và báo cáo khớp lệnh được phát ra trên một đường riêng để các client chậm không bao giờ làm chậm việc khớp lệnh.</p></details>
<p><strong>1. Requirements that drive an unusual architecture</strong></p>
<ul>
<li><strong>Determinism</strong>: the same input sequence must always produce the same trades — this is a regulatory and audit requirement, not an optimization.</li>
<li><strong>Fairness</strong>: strict price-time priority; no order may jump the queue.</li>
<li><strong>Latency</strong>: p99 in microseconds, and <strong>predictable</strong> — a jittery p99.9 is worse than a slightly higher mean.</li>
<li><strong>No lost orders</strong>: every accepted order is durable before it is acknowledged.</li>
</ul>
<p><strong>2. Architecture</strong></p>
<pre>[Trader/FIX gateway]  auth, validation, pre-trade risk (limits, buying power)
        ↓
[Sequencer]  assigns a monotonic sequence number → THE total order of the venue
        ↓ (write to replicated log first: Aeron/Kafka/custom, fsync or multi-node ack)
[Matching engine per instrument]  single-threaded, in-memory order book
        ↓                                   ↓
[Execution reports → traders]     [Market data feed → all subscribers]
        ↓
[Post-trade: clearing, settlement, ledger, surveillance]  (asynchronous, off the hot path)</pre>
<p><strong>3. The limit order book</strong></p>
<pre>Bids (buy, sorted DESC by price)      Asks (sell, sorted ASC by price)
  100.20 → [order A 500, order B 200]   100.25 → [order C 300]
  100.15 → [order D 1000]               100.30 → [order E 800]
            ↑ FIFO queue per price level (time priority)

Structure: an array/tree indexed by price level (prices are discrete ticks → array is viable)
           + a doubly linked list per level  + a hash map orderId → node
   add order    O(1) amortized      cancel O(1) via the hash map      match O(1) at the top
Matching a market buy: take the best ask level, fill orders in FIFO order, walk levels
until the quantity is filled or the book is empty (or the price limit is crossed).</pre>
<p><strong>4. Why single-threaded is the fast and correct answer</strong></p>
<ul>
<li>No locks, no contention, no cache-line ping-pong; a modern core matches millions of orders per second when everything is in memory.</li>
<li>Determinism becomes trivial — with concurrency, replaying inputs would not reproduce the same trades.</li>
<li><strong>Scale by instrument, not by thread</strong>: shard symbols across engines (AAPL on engine 1, TSLA on engine 2). Each book is independent.</li>
<li>LMAX Disruptor style: pre-allocated ring buffers, no garbage during trading hours, mechanical sympathy (cache-friendly layouts, busy-spin instead of blocking, pinned cores, no syscalls in the hot path).</li>
</ul>
<p><strong>5. Durability and failover through event sourcing</strong></p>
<pre>Input log (sequenced commands)  →  engine state is a pure function of the log
  - persist the command BEFORE acknowledging the trader
  - hot standby engines consume the same log and stay in lockstep
  - failover = promote a standby that has applied the same sequence number
  - recovery  = last snapshot + replay the tail of the log
  - audit/replay = re-run any trading day exactly, which regulators require

Rule: no wall-clock reads, no random numbers, no map iteration order dependence,
      no external calls inside the engine — any of them breaks replay determinism.
      Timestamps are assigned by the sequencer and become part of the input.</pre>
<p><strong>6. Around the engine</strong></p>
<ul>
<li><strong>Pre-trade risk</strong> runs in the gateway (position limits, fat-finger price bands, credit) — the engine must stay minimal.</li>
<li><strong>Market data</strong> is published incrementally (order book deltas) with periodic snapshots so a late subscriber can sync; use multicast/UDP-style fan-out for the lowest latency.</li>
<li><strong>Backpressure</strong>: a slow trader connection must never block the engine — drop or conflate their feed, never stall the matching loop.</li>
<li><strong>Order types</strong>: market, limit, IOC/FOK, stop, iceberg — each adds book complexity; call out that auctions (open/close) are a separate matching algorithm.</li>
<li><strong>Circuit breakers</strong>: volatility halts and price bands are exchange-level safety features.</li>
</ul>
<div class="key-point">The counter-intuitive point worth stating explicitly: <em>"you do not scale a matching engine with threads — you make it single-threaded and deterministic, put the whole book in memory, and shard by instrument."</em> Durability and failover then come free from replaying a sequenced input log, which is also exactly what regulators want for audit.</div>`,
      },
      {
        q: 'How would you design a recommendation / personalization system (candidate generation, ranking, online serving)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A recommender is a two-stage funnel because scoring millions of items per request is impossible within a latency budget: candidate generation cheaply narrows millions of items to a few hundred using precomputed sources such as collaborative-filtering neighbours, embedding nearest neighbours, trending items and simple rules, and then a heavier ranking model scores only those candidates with rich features. The system splits into an offline part that trains models and precomputes embeddings and candidate lists on a schedule, a nearline part that reacts to fresh user activity within seconds, and an online part that must answer in tens of milliseconds from a feature store and a model server. The recurring engineering problems are cold start for new users and items, training and serving feature skew, and a feedback loop where the model only ever learns from what it already showed, which is why exploration and A/B testing are part of the design rather than an afterthought.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một hệ gợi ý là một phễu hai tầng, vì chấm điểm hàng triệu item cho mỗi request là bất khả thi trong ngân sách độ trễ: tầng sinh ứng viên thu hẹp từ hàng triệu xuống vài trăm item bằng các nguồn tính sẵn như hàng xóm trong lọc cộng tác, láng giềng gần theo embedding, item đang thịnh hành và vài luật đơn giản; sau đó một mô hình xếp hạng nặng hơn chỉ chấm điểm số ứng viên đó với bộ đặc trưng phong phú. Hệ thống chia làm ba phần: offline huấn luyện mô hình và tính sẵn embedding cùng danh sách ứng viên theo lịch; nearline phản ứng với hoạt động mới của người dùng trong vài giây; online phải trả lời trong vài chục mili-giây từ feature store và model server. Những vấn đề kỹ thuật lặp đi lặp lại là cold start cho người dùng và item mới, lệch đặc trưng giữa lúc huấn luyện và lúc phục vụ, và vòng phản hồi khiến mô hình chỉ học được từ những thứ chính nó đã hiển thị — đó là lý do exploration và A/B testing phải nằm trong thiết kế chứ không phải thêm vào sau.</p></details>
<p><strong>1. The two-stage funnel (this is the answer skeleton)</strong></p>
<pre>10,000,000 items
      ↓  CANDIDATE GENERATION — cheap, recall-oriented, precomputed, multiple sources
  ~500 candidates
      ↓  RANKING — expensive model, ~100 features per (user, item) pair
   ~50 ranked
      ↓  RE-RANK / business rules — diversity, freshness, dedupe, ads, blocklists
   ~10 shown

Latency budget: 100 ms total → candidates ~10 ms, ranking ~30 ms, the rest is overhead.</pre>
<p><strong>2. Candidate sources (blend several — each covers a different weakness)</strong></p>
<ul>
<li><strong>Collaborative filtering</strong>: "users like you also liked" — item-item similarity precomputed offline from the interaction matrix.</li>
<li><strong>Embedding ANN search</strong>: user and item vectors in the same space; retrieve nearest neighbours with FAISS/ScaNN/a vector DB (approximate, sub-millisecond over millions of vectors).</li>
<li><strong>Content-based</strong>: same category/author/tags — the only thing that works for a brand-new item.</li>
<li><strong>Trending / popular</strong> per segment — the fallback for a brand-new user, and a strong baseline.</li>
<li><strong>Recent user activity</strong>: "because you watched X" — nearline, seconds-fresh.</li>
</ul>
<p><strong>3. Ranking</strong></p>
<ul>
<li>Model: gradient-boosted trees are still an excellent, cheap baseline; deep models (two-tower for retrieval, DNN/DLRM for ranking) win at scale.</li>
<li>Objective: predicted click, watch time, purchase probability — often a <strong>multi-objective blend</strong>, because optimizing pure CTR produces clickbait.</li>
<li>Features: user (history, demographics), item (age, popularity, category), context (time, device, session), and cross features (user's affinity for this category).</li>
</ul>
<p><strong>4. Three-layer system architecture</strong></p>
<pre>OFFLINE (hours/daily)          NEARLINE (seconds)             ONLINE (10-50 ms)
 - train models                  - consume click/view stream     - fetch candidates
 - compute embeddings            - update user session features  - fetch features (feature store)
 - precompute candidate lists    - refresh trending counters     - score with the model server
 - backfill feature store        - invalidate caches             - apply business rules
 - offline eval (AUC, NDCG)                                      - log the impression + features

The impression log (what we showed, with the exact features used) is the training data
for tomorrow's model — logging is part of the design, not an operational detail.</pre>
<p><strong>5. The classic problems, and the expected answers</strong></p>
<table>
<tr><th>Problem</th><th>Fix</th></tr>
<tr><td><strong>Cold-start user</strong></td><td>Popular/trending by segment, onboarding preference picker, contextual signals (device, locale), switch to personalized after N interactions</td></tr>
<tr><td><strong>Cold-start item</strong></td><td>Content features + deliberate exploration budget so new items get impressions</td></tr>
<tr><td><strong>Train/serve skew</strong></td><td>One feature definition used by both paths (a feature store with point-in-time correct training reads)</td></tr>
<tr><td><strong>Feedback loop / filter bubble</strong></td><td>Exploration (epsilon-greedy, bandits), diversity constraints in re-ranking, unbiased evaluation with logged propensities</td></tr>
<tr><td><strong>Position bias</strong></td><td>Position as a training feature (set to a constant at serving) or inverse-propensity weighting</td></tr>
<tr><td><strong>Stale model</strong></td><td>Scheduled retraining + drift monitoring on feature distributions and CTR</td></tr>
</table>
<p><strong>6. Evaluation — offline metrics never decide it</strong></p>
<ul>
<li>Offline (AUC, NDCG, recall@K) filters bad candidates; the decision is an <strong>online A/B test</strong> on product metrics (engagement, retention, revenue), with guardrail metrics so you notice the harm a lift is hiding.</li>
<li>Always ship a shadow/canary path and a fast rollback — a bad ranking model degrades revenue quietly rather than throwing errors.</li>
</ul>
<div class="key-point">The structural point: <em>"retrieve cheaply, rank expensively"</em> — plus the honest engineering caveats that impress most: a feature store to kill train/serve skew, an impression log with the exact serving features as tomorrow's training data, and explicit exploration because a recommender that only learns from its own choices slowly poisons itself.</div>`,
      },
      {
        q: 'How would you design an object storage service like S3 (durability, erasure coding, metadata at scale)?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Object storage separates a metadata plane from a data plane: metadata maps a bucket and key to the physical location of the data and must support very high request rates with strong consistency, while the data plane stores immutable chunks on commodity disks across many failure domains. Durability comes from redundancy, and the important trade-off is replication versus erasure coding — three copies is simple and fast but costs three times the storage, whereas erasure coding stores data plus parity fragments across nodes for roughly 1.5 times the size at the price of extra CPU and network on reads that need reconstruction. Objects are immutable, so updates write a new version rather than modifying bytes, which makes caching, replication and consistency dramatically simpler. The background systems are the real engineering: continuous scrubbing to detect bit rot, rebuild when a disk or node dies, lifecycle transitions to colder tiers, and rate limiting to keep one customer from saturating a storage node.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Object storage tách mặt phẳng metadata khỏi mặt phẳng dữ liệu: metadata ánh xạ bucket và key tới vị trí vật lý của dữ liệu, phải chịu được tần suất request rất cao và cần nhất quán mạnh; còn mặt phẳng dữ liệu lưu các chunk bất biến trên ổ đĩa phổ thông, trải qua nhiều vùng lỗi khác nhau. Độ bền đến từ dư thừa, và đánh đổi quan trọng là nhân bản so với erasure coding: giữ ba bản sao thì đơn giản và nhanh nhưng tốn gấp ba dung lượng, còn erasure coding lưu dữ liệu cộng các mảnh parity trải trên nhiều node, chỉ tốn khoảng 1,5 lần dung lượng nhưng phải trả giá bằng CPU và mạng khi phải tái dựng lúc đọc. Object là bất biến, nên cập nhật nghĩa là ghi một phiên bản mới chứ không sửa byte tại chỗ, điều này làm cho caching, replication và nhất quán đơn giản đi rất nhiều. Phần kỹ thuật thật sự nằm ở các hệ thống chạy nền: quét kiểm tra liên tục để phát hiện hỏng bit, tái dựng khi mất ổ đĩa hay node, chuyển vòng đời sang các tầng lưu trữ lạnh hơn, và giới hạn tốc độ để một khách hàng không làm nghẽn một node lưu trữ.</p></details>
<p><strong>1. The API constrains the design</strong></p>
<pre>PUT    /bucket/key        (whole object, or multipart for large ones)
GET    /bucket/key        (+ Range requests)
DELETE /bucket/key
LIST   /bucket?prefix=…   ← the expensive one: it is a range scan over metadata

Objects are IMMUTABLE: no partial in-place update. "Modify" = write a new version.
This one decision removes most of the distributed-consistency difficulty.</pre>
<p><strong>2. Two planes</strong></p>
<pre>[Client] → [API/frontend: auth, signature check, quota, routing]
                ↓                                    ↓
      [METADATA SERVICE]                     [DATA/STORAGE NODES]
       bucket/key → {object_id, size,          chunks on raw disks,
       chunk locations, etag, version,         append-only, immutable
       storage class, ACL}
       sharded KV (strongly consistent,        placement across racks/AZs
       e.g. Paxos/Raft groups per range)       by a placement/allocation service</pre>
<p><strong>3. Durability: replication vs erasure coding</strong></p>
<table>
<tr><th></th><th>3x replication</th><th>Erasure coding (e.g. 10 data + 4 parity)</th></tr>
<tr><td>Storage overhead</td><td>200% (3x)</td><td>~40% (1.4x)</td></tr>
<tr><td>Tolerates</td><td>2 node losses</td><td>Any 4 of 14 fragments lost</td></tr>
<tr><td>Read cost</td><td>Read one replica — cheapest</td><td>Normally read the data fragments; on failure reconstruct from 10 of 14 (CPU + network)</td></tr>
<tr><td>Write cost</td><td>3 writes</td><td>Encode + 14 smaller writes</td></tr>
<tr><td>Best for</td><td>Small, hot, latency-critical objects</td><td>Large, warm/cold objects — the bulk of the bytes</td></tr>
</table>
<pre>Reed-Solomon: split the object into 10 fragments, compute 4 parity fragments,
spread all 14 across different racks/AZs. Any 10 fragments reconstruct the object.
This is how "11 nines of durability" is reached at ~1.4x cost instead of 3x.
Common design: replicate small objects, erasure-code large ones (and cold tiers).</pre>
<p><strong>4. Write path</strong></p>
<pre>1. Auth + signature (pre-signed URLs / SigV4), bucket policy, quota check.
2. Allocate object id; ask placement for target nodes in distinct failure domains.
3. Stream the body into chunks (e.g. 4-64 MB); checksum each chunk (CRC32C/MD5).
4. Write chunks with the chosen redundancy; wait for a durable quorum of acks.
5. Commit metadata (bucket/key → chunk map, etag, version) — THE commit point.
   Metadata committed last → a crash leaves orphan chunks (a GC job reaps them),
   never a metadata entry that points at data which does not exist.
6. Multipart upload: parts uploaded in parallel/resumable, then one atomic "complete".</pre>
<p><strong>5. Metadata at scale — usually the real bottleneck</strong></p>
<ul>
<li>Billions of keys per bucket → shard the keyspace by hash or by range; range sharding keeps LIST with a prefix efficient but creates hot shards for sequential key names (timestamps!) — recommend high-entropy key prefixes.</li>
<li>LIST is a paginated range scan with a continuation token; it is eventually consistent in many systems for exactly this reason.</li>
<li>Strong read-after-write consistency for a single key is expected today — a single metadata shard owning the key makes this straightforward.</li>
<li>Versioning: key → list of versions; DELETE writes a delete marker rather than removing data (this is what makes accidental deletion recoverable).</li>
</ul>
<p><strong>6. The background systems that actually keep data alive</strong></p>
<ul>
<li><strong>Scrubbing</strong>: continuously re-read and verify checksums to detect silent bit rot, and repair from redundancy.</li>
<li><strong>Rebuild/repair</strong>: when a disk or node dies, regenerate the missing fragments elsewhere — throttled so repair traffic does not degrade serving.</li>
<li><strong>Garbage collection</strong>: reclaim orphan chunks, expired versions and aborted multipart uploads.</li>
<li><strong>Lifecycle tiering</strong>: hot → infrequent access → archive (cold storage with retrieval delay), driven by per-bucket policies.</li>
<li><strong>Cross-region replication</strong> for DR, asynchronous, with a replication-lag metric.</li>
<li><strong>Per-bucket/per-node rate limiting</strong> so one hot prefix cannot saturate a storage node.</li>
</ul>
<div class="key-point">Two things to name explicitly: <em>"immutable objects with metadata committed last"</em> (so failures leave collectable garbage, never dangling pointers), and <em>"erasure coding buys 11 nines at ~1.4x storage instead of 3x — at the cost of CPU and network during reconstruction."</em> Then mention scrubbing and throttled rebuild: durability is a background process, not a property you configure once.</div>`,
      },
    ],
  },
];
