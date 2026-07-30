// Tools & Technologies — Redis, Elasticsearch, object storage
import type { PvQuestion } from '../../types';

export const questions: PvQuestion[] = [
  {
    q: 'What are the Redis data types and what do you actually use each one for?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>Redis is a single-threaded in-memory data-structure server, so the value is not "a fast key-value store" — it is that the server can manipulate structures atomically. <strong>Strings</strong> hold cached JSON, counters, and rate-limit buckets (<code>INCR</code> + <code>EXPIRE</code>); <strong>hashes</strong> hold objects you update field by field; <strong>lists</strong> act as simple queues; <strong>sets</strong> give membership and deduplication; <strong>sorted sets</strong> are the workhorse for leaderboards, sliding-window rate limiters, and delayed-job scheduling by score; <strong>streams</strong> give an append-only log with consumer groups when you want Kafka-like semantics without Kafka. Add TTLs, Lua scripts for atomic multi-step logic, and pub/sub, and most caching, locking, and queueing problems have a one-command answer.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Redis là một server cấu trúc dữ liệu trong bộ nhớ, chạy đơn luồng — nên giá trị của nó không nằm ở chỗ "key-value nhanh", mà ở chỗ server thao tác được trên các cấu trúc dữ liệu một cách nguyên tử. <strong>String</strong> để cache JSON, làm counter và bucket cho rate limit (<code>INCR</code> + <code>EXPIRE</code>); <strong>hash</strong> để lưu object và cập nhật từng field; <strong>list</strong> làm queue đơn giản; <strong>set</strong> để kiểm tra thành viên và chống trùng; <strong>sorted set</strong> là công cụ đa năng nhất — leaderboard, rate limit theo cửa sổ trượt, và hẹn giờ job theo score; <strong>stream</strong> cho bạn một log append-only kèm consumer group, khi muốn kiểu Kafka mà chưa cần tới Kafka. Cộng thêm TTL, Lua script cho các bước cần nguyên tử và pub/sub, thì phần lớn bài toán cache, lock và queue đều có một câu lệnh giải quyết gọn.</p></details>
<pre># String — cache, counter, rate limit, distributed lock
SET user:42 '{"name":"Bob"}' EX 300            # cache with TTL
INCR api:42:minute  →  EXPIRE api:42:minute 60 # fixed-window limiter
SET lock:job1 &lt;token&gt; NX PX 30000              # lock: NX + TTL + token

# Hash — partial updates without re-serializing the whole object
HSET cart:42 item:9 2 item:11 1
HINCRBY cart:42 item:9 1

# Set / Sorted set — the two most underused types
SADD online:users 42            SISMEMBER online:users 42
ZADD leaderboard 9500 user:42   ZREVRANGE leaderboard 0 9 WITHSCORES
ZADD delayed 1722330000 job:77  ZRANGEBYSCORE delayed 0 &lt;now&gt;  # scheduler
ZREMRANGEBYSCORE window 0 &lt;now-60s&gt;  → ZCARD window   # sliding-window limit

# Stream — durable log + consumer groups (at-least-once, acks, pending list)
XADD events * type order.paid id 77
XREADGROUP GROUP billing c1 COUNT 10 STREAMS events &gt;
XACK events billing 1722330000-0</pre>
<pre>// Atomicity: single-threaded means commands never interleave, but a
// read-then-write from your app DOES race. Two safe options:
// 1) Lua — runs as one atomic unit on the server
EVAL "local n = redis.call('INCR', KEYS[1])
      if n == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
      return n" 1 rate:42 60
// 2) Native atomic commands: INCR, SETNX, ZADD GT, GETDEL, SET ... KEEPTTL

// Cache-aside, the pattern you will be asked to write
const hit = await redis.get(key);
if (hit) return JSON.parse(hit);
const row = await db.find(id);
await redis.set(key, JSON.stringify(row), 'EX', 300 + jitter());  // jitter!
return row;
// Invalidate on write (DEL key), never rely on TTL alone for correctness.</pre>
<p><strong>Beyond caching:</strong> Redis is commonly the session store (fast, revocable, TTL-based), the rate limiter, the distributed lock (with the caveats of Redlock — always use a token and a TTL, and never assume a lock is a correctness guarantee for money), the pub/sub bus for websocket fan-out across instances, and a job queue via BullMQ (Node) or Redisson (Java).</p>
<div class="key-point">Pick the structure, not just the key: sorted sets for windows/leaderboards/schedules, hashes for partial object updates, streams for durable fan-out, Lua for atomic multi-step logic — and always set TTLs plus jitter to avoid synchronized expiry storms.</div>`,
  },
  {
    q: 'How do you run Redis safely in production? Persistence, eviction, clustering and the classic failure modes.',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Three decisions define a production Redis. <strong>Persistence</strong>: RDB snapshots are compact but lose the window since the last save, AOF replays every write for near-zero loss at some throughput cost — a cache needs neither, a session store or queue needs AOF plus replication. <strong>Memory policy</strong>: set <code>maxmemory</code> and an eviction policy (<code>allkeys-lru</code> for caches, <code>noeviction</code> when losing data is unacceptable — then be ready for write errors). <strong>Topology</strong>: a single node with a replica plus Sentinel for failover, or Cluster (16384 hash slots) when one node's memory or bandwidth is the limit, remembering that multi-key operations then require hash tags. The failure modes to know: big keys and <code>KEYS *</code> blocking the single thread, hot keys saturating one node, unbounded memory growth from missing TTLs, and treating Redis as a database until the first failover loses data.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Có ba quyết định định hình một hệ Redis chạy production. <strong>Persistence</strong>: RDB snapshot thì gọn nhưng mất phần dữ liệu kể từ lần snapshot cuối, còn AOF ghi lại từng lệnh nên gần như không mất dữ liệu nhưng tốn hiệu năng hơn — làm cache thì không cần cái nào, làm session store hay queue thì cần AOF cộng replication. <strong>Chính sách bộ nhớ</strong>: phải đặt <code>maxmemory</code> và chọn eviction policy (<code>allkeys-lru</code> cho cache, <code>noeviction</code> khi không được phép mất dữ liệu — nhưng lúc đó phải chuẩn bị xử lý lỗi khi ghi). <strong>Topology</strong>: một node kèm replica và Sentinel để tự failover, hoặc dùng Cluster (16384 hash slot) khi bộ nhớ/băng thông của một node đã là giới hạn — nhớ rằng khi đó các lệnh nhiều key cần hash tag. Những kiểu sự cố nên biết: key quá lớn và lệnh <code>KEYS *</code> làm nghẽn luồng đơn, hot key làm quá tải một node, bộ nhớ phình vô hạn vì thiếu TTL, và coi Redis như database cho tới lần failover đầu tiên làm mất dữ liệu.</p></details>
<pre># Persistence — pick per use case
save 900 1                 # RDB: snapshot; fast restart, loses recent writes
appendonly yes             # AOF: replay log
appendfsync everysec       # good default (fsync always = safest, slowest)
# cache        → persistence off (rebuild from the source of truth)
# sessions/jobs→ AOF everysec + replica; accept ~1s worst-case loss
# "source of truth" → use a real database, or Redis with AOF always +
#   replication + backups, and know you are paying for it

# Memory
maxmemory 4gb
maxmemory-policy allkeys-lru     # cache: evict coldest
# volatile-lru  → only keys with a TTL (mixed workloads)
# noeviction    → writes fail with OOM instead of silently dropping data
INFO memory | grep evicted_keys  # rising evictions = cache too small</pre>
<pre>// The failure modes, and how they show up
1. Blocking the single thread
   KEYS *  / FLUSHALL on a big DB / SMEMBERS on a 5M-member set /
   a slow Lua script → EVERY client stalls. Use SCAN, SSCAN, and keep
   Lua tiny. Watch SLOWLOG.
2. Big keys — a 200 MB list or a hash with 10M fields: slow to serialize,
   slow to replicate, and one key cannot be split across cluster nodes.
   → shard the key (cart:42:{part}), cap sizes, alert on MEMORY USAGE.
3. Hot keys — one popular key pins one core/node. → client-side cache,
   local caffeine/LRU in front, or replicate the value across N keys.
4. No TTL → memory grows until eviction or OOM. Make TTL the default.
5. Cache stampede — 10k requests miss simultaneously after an expiry.
   → jittered TTLs, single-flight (lock + rebuild), or serve stale
     while refreshing in the background.
6. Failover data loss — replication is ASYNC. An accepted write can
   vanish when a replica is promoted. Never store money-critical state
   only in Redis; use WAIT or a database for correctness.

// Cluster caveat: multi-key ops must land in one slot
MGET user:1 user:2                  ❌ CROSSSLOT error
MGET {tenant42}:user:1 {tenant42}:user:2   ✅ hash tag pins the slot</pre>
<p><strong>Also worth stating:</strong> connection pooling matters (Lettuce/Jedis, ioredis) because thousands of short-lived connections cost more than the commands; run Redis with protected mode and auth (there is a long history of open Redis instances being mined); prefer server-assisted client-side caching (RESP3 tracking) for very hot read paths; and instrument hit ratio, latency percentiles, evictions, and memory fragmentation rather than just uptime.</p>
<div class="key-point">Decide persistence, eviction and topology from the data's value, not from defaults. Keep keys small with mandatory TTLs, never run O(N) commands on the hot path, plan for async-replication loss, and remember Redis Cluster forbids cross-slot multi-key operations without hash tags.</div>`,
  },
  {
    q: 'How does Elasticsearch work, and when should you use it instead of your database?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Elasticsearch is a distributed search engine built on Lucene's <strong>inverted index</strong>: text is run through an <em>analyzer</em> (tokenize, lowercase, stem, remove stopwords) and stored as a term → document-list mapping, which is why full-text relevance search over millions of documents is milliseconds fast and why it is nothing like a <code>LIKE '%term%'</code> scan. Use it for full-text search, faceted filtering and aggregations, log and metric analytics, and geo or vector search — not as a system of record, because it has no transactions, no joins, and is <em>near</em> real-time (documents become visible after a refresh, by default one second). The standard architecture is therefore: database as source of truth, Elasticsearch as a rebuildable read model kept in sync by CDC or events.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Elasticsearch là một search engine phân tán dựng trên Lucene với <strong>inverted index</strong>: văn bản được đưa qua một <em>analyzer</em> (tách từ, hạ chữ thường, đưa về từ gốc, bỏ stopword) rồi lưu thành ánh xạ term → danh sách document. Nhờ vậy, tìm kiếm toàn văn có tính điểm liên quan trên hàng triệu document chỉ mất vài milli giây, và nó hoàn toàn khác việc quét <code>LIKE '%term%'</code>. Hãy dùng nó cho full-text search, cho lọc theo facet và aggregation, cho phân tích log và metric, cho tìm kiếm theo vị trí hoặc theo vector — nhưng đừng dùng làm nơi lưu dữ liệu gốc, vì nó không có transaction, không có join, và chỉ <em>gần</em> real-time (document chỉ thấy được sau một lần refresh, mặc định là một giây). Vì vậy kiến trúc chuẩn là: database là nguồn sự thật, Elasticsearch là một read model có thể dựng lại, được đồng bộ bằng CDC hoặc bằng event.</p></details>
<pre># Why it is fast: the inverted index
doc1 "Fast Java tutorial"   → analyzer → [fast, java, tutorial]
doc2 "Java performance"     → analyzer → [java, performance]
index:  java → [doc1, doc2]   fast → [doc1]   tutorial → [doc1]
# query "java" = one lookup + a scored merge, not a table scan.

# text vs keyword — the mapping mistake everyone makes once
"title":  { "type": "text",    "analyzer": "english" }  # analyzed → search
"status": { "type": "keyword" }                          # exact → filter,
                                                         # aggregate, sort
# A "text" field cannot be sorted/aggregated reliably; a "keyword" field
# will not match a partial word. Use multi-fields when you need both:
"name": { "type":"text", "fields": { "raw": { "type":"keyword" } } }</pre>
<pre>// query (scored, affects relevance) vs filter (cacheable, yes/no)
GET /products/_search
{ "query": { "bool": {
    "must":   [ { "match": { "name": "wireless headphone" } } ],   // scored
    "filter": [ { "term":  { "inStock": true } },                  // cached
                { "range": { "price": { "lte": 200 } } } ] } },
  "aggs": { "by_brand": { "terms": { "field": "brand" } } },       // facets
  "sort": [ "_score", { "createdAt": "desc" } ],
  "search_after": [ ... ] }        // deep pagination: NOT from+size 10000

// Keeping it in sync (never dual-write from application code and hope)
Postgres → Debezium/CDC → Kafka → indexer → Elasticsearch
// Index a DENORMALIZED document (no joins in ES), version each document
// so out-of-order updates cannot overwrite newer data, and make the whole
// index REBUILDABLE from the database — then reindex behind an alias:
POST /_aliases {"actions":[{"remove":{"index":"p_v1","alias":"products"}},
                           {"add":{"index":"p_v2","alias":"products"}}]}</pre>
<p><strong>Operational essentials:</strong> shard count is fixed at creation (aim for 10–50 GB per shard; too many small shards is the most common performance bug); replicas give both HA and read throughput; time-series data belongs in time-based indices with ILM so old data can be rolled over and deleted cheaply; and mapping explosion (dynamic fields from user JSON) will take a cluster down — set <code>dynamic: strict</code>. In Java use the official client (not deprecated TransportClient) and in Node use <code>@elastic/elasticsearch</code>; if you only need "search in one table", Postgres full-text or <code>pg_trgm</code> may be enough and avoids a second datastore entirely.</p>
<div class="key-point">Elasticsearch = inverted index + distributed shards: excellent for relevance search, facets, and analytics; not a source of truth (no transactions or joins, near-real-time). Model documents denormalized with the right text/keyword mappings, sync from the database via CDC/events, and keep the index disposable and rebuildable behind an alias.</div>`,
  },
  {
    q: 'How do you handle file storage and uploads with S3 or MinIO?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>Files do not belong in your database or on a pod's local disk — they belong in object storage (S3, GCS, Azure Blob, or MinIO for self-hosted and local development), with the database holding only metadata and the object key. The pattern that scales is to keep bytes out of your application entirely: the client asks your API for a <strong>pre-signed URL</strong>, uploads directly to the bucket, and later downloads through another short-lived pre-signed URL or a CDN — your service never streams gigabytes and never becomes the bottleneck. Around that, the essentials are private buckets with no public access, server-side encryption, versioning plus lifecycle rules to control cost, multipart upload for large files, and keys designed so you never need to list a bucket to find something.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>File không nên nằm trong database hay trên đĩa cục bộ của pod — nó thuộc về object storage (S3, GCS, Azure Blob, hoặc MinIO khi tự host và khi dev ở máy), còn database chỉ giữ metadata và object key. Cách làm co giãn tốt là đừng để dữ liệu đi qua ứng dụng: client xin API của bạn một <strong>pre-signed URL</strong>, upload trực tiếp lên bucket, rồi sau này tải về qua một pre-signed URL ngắn hạn khác hoặc qua CDN — service của bạn không phải truyền hàng gigabyte và không trở thành điểm nghẽn. Xung quanh đó, những thứ bắt buộc: bucket ở chế độ private hoàn toàn, bật mã hóa phía server, bật versioning cùng lifecycle rule để kiểm soát chi phí, dùng multipart upload cho file lớn, và thiết kế key sao cho không bao giờ phải list cả bucket mới tìm được file.</p></details>
<pre>// The upload flow that does not melt your service
1. POST /api/uploads  { filename, contentType, size }
   → authorize, validate type/size, generate a key, insert a DB row
   → return a pre-signed PUT URL (expires in ~5 min)
2. Browser PUTs the bytes DIRECTLY to S3/MinIO (progress, resumable)
3. S3 event / client callback → mark the row "ready", enqueue processing
   (thumbnail, virus scan, text extraction) via a queue

// Key design — no listing, no collisions, no user input in the path
const key = \`tenant/\${tenantId}/2026/07/\${crypto.randomUUID()}.jpg\`;
// store { key, ownerId, originalName, mime, size, checksum } in the DB

// Node
const url = await getSignedUrl(s3, new PutObjectCommand({
  Bucket: 'uploads', Key: key, ContentType: mime,
  ServerSideEncryption: 'aws:kms',
}), { expiresIn: 300 });
// Java: S3Presigner.presignPutObject(...) — same idea</pre>
<pre># Bucket configuration checklist
- Block Public Access ON; no bucket policy granting "*" (the classic breach)
- SSE-S3 or SSE-KMS encryption at rest; TLS in transit
- Versioning ON (protects against overwrite/delete) + MFA delete for critical
- Lifecycle: Standard → IA after 30d → Glacier after 90d → expire; and
  "abort incomplete multipart uploads after 7 days" (silent cost leak)
- Least-privilege IAM per service (s3:GetObject on one prefix, not s3:*)
- CORS only for the origins that upload directly
- CloudFront/CDN in front for downloads, with signed URLs or signed cookies

# Downloads: authorize in YOUR service, then hand out a short-lived URL
GET /api/files/:id → check ownership → 302 to a 60s pre-signed GET URL
# Never serve user files from your app origin (stored-XSS risk) and never
# make the bucket public "temporarily".</pre>
<p><strong>MinIO</strong> is S3-API compatible, which makes it the pragmatic choice for on-premise deployments and for local development and integration tests (Testcontainers has a MinIO/LocalStack module) — write your code against the AWS SDK with a configurable endpoint and the same code runs in both places. Also remember object storage is eventually consistent for some operations, has no rename (copy + delete), and charges for requests and egress, so batch small files rather than doing thousands of tiny puts.</p>
<div class="key-point">Store bytes in object storage and metadata in the database, and move data with pre-signed URLs so uploads and downloads bypass your service. Keep buckets private and encrypted with lifecycle rules, generate keys server-side, and use MinIO/LocalStack to keep local and production code identical.</div>`,
  },
];
