// Interview data: nodejs (server-side runtime + data migration tooling)
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
  // ───────────────────────── NODE.JS & DATA MIGRATION ─────────────────────────
  {
    id: 'nodejs',
    name: 'Node.js & Data Migration',
    icon: '🟢',
    questions: [
      // ──── 0. SUMMARY — knowledge map ────
      {
        q: 'Node.js & Data Migration Summary — Knowledge Map',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A revision checklist for server-side Node.js and for building a database migration / validation tool on top of it — the kind of tool that streams PostgreSQL data between environments, validates it and masks personal data. Concept names only; use it to spot gaps, not as a tutorial.</p></div>
<h3>1. Node.js Runtime (server side)</h3>
<ul>
<li><strong>Architecture</strong>
  <ul>
  <li>V8 + libuv, single JS thread, event loop phases (timers, pending, poll, check, close)</li>
  <li>process.nextTick vs promise microtasks vs setImmediate</li>
  <li>libuv thread pool (fs, dns.lookup, crypto, zlib), UV_THREADPOOL_SIZE</li>
  <li>Network I/O via OS async (epoll/kqueue/IOCP), not the thread pool</li>
  </ul>
</li>
<li><strong>Concurrency options</strong> — worker_threads, child_process, cluster, horizontal scaling</li>
<li><strong>Reliability</strong> — error-first callbacks vs promises, unhandledRejection, uncaughtException, graceful shutdown (SIGTERM)</li>
<li><strong>Memory</strong> — V8 heap limit (--max-old-space-size), Buffers outside the heap, leaks, heap snapshots</li>
</ul>
<h3>2. Streams</h3>
<ul>
<li>Readable, Writable, Duplex, Transform; object mode</li>
<li>Backpressure: highWaterMark, write() returning false, 'drain'</li>
<li>stream.pipeline (and stream/promises) vs .pipe() — error propagation and cleanup</li>
<li>Async iteration over streams (for await)</li>
</ul>
<h3>3. PostgreSQL Bulk Data</h3>
<ul>
<li>COPY TO STDOUT / COPY FROM STDIN, pg-copy-streams</li>
<li>COPY vs multi-row INSERT vs single INSERT; batch sizing</li>
<li>Cursors / server-side pagination (keyset), pg-query-stream</li>
<li>Foreign key ordering (topological sort), DEFERRABLE constraints, disabling triggers</li>
<li>Sequence reset (setval), indexes and ANALYZE after load</li>
</ul>
<h3>4. Migration Tool Design</h3>
<ul>
<li>Idempotent and resumable runs, checkpoints, per-table transactions</li>
<li>Validation: schema comparison, row counts, chunk checksums, EXCEPT diffs, reconciliation reports</li>
<li>PII masking: deterministic hashing, fake data, format-preserving, masking in-stream</li>
<li>Safety guardrails: direction checks, read-only source role, confirmations, dry-run</li>
<li>CLI ergonomics: config files, progress output, exit codes, logs</li>
</ul>
<div class="key-point">Interviewers who see "streaming migration with COPY" on a CV will ask about backpressure, memory, error handling mid-stream, FK ordering, how you proved the data was correct, and how you stopped someone from overwriting production. Have a concrete answer for each.</div>`,
      },

      // ──── 1. RUNTIME ────
      {
        q: 'How does the Node.js event loop work on the server? What runs on the libuv thread pool?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Node runs your JavaScript on one thread, and libuv drives an event loop that cycles through phases: <strong>timers</strong> run expired <code>setTimeout</code>/<code>setInterval</code> callbacks, <strong>pending callbacks</strong> handle some deferred system callbacks, <strong>poll</strong> waits for and runs I/O callbacks, <strong>check</strong> runs <code>setImmediate</code>, and <strong>close</strong> runs close handlers. Between every callback, Node drains <code>process.nextTick</code> first and then promise microtasks. Network sockets don't use threads at all — libuv relies on the operating system's async notification (epoll, kqueue, IOCP). Work the OS can't do asynchronously goes to the libuv <strong>thread pool</strong>, which has four threads by default: file system calls, <code>dns.lookup</code>, and CPU-heavy built-ins like <code>crypto.pbkdf2</code> and <code>zlib</code>. That's why a burst of hashing or file reads can queue up behind four threads even though the event loop itself is idle.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Code JavaScript của bạn chỉ chạy trên một thread, còn libuv lo cái event loop chạy vòng vòng qua từng pha: <strong>timers</strong> chạy các callback <code>setTimeout</code>/<code>setInterval</code> đã tới giờ, <strong>pending callbacks</strong> xử lý vài callback hệ thống bị hoãn lại, <strong>poll</strong> chờ và chạy callback I/O, <strong>check</strong> chạy <code>setImmediate</code>, và <strong>close</strong> chạy các handler đóng kết nối. Xong mỗi callback, Node xử lý hết hàng <code>process.nextTick</code> trước, rồi mới tới microtask của promise. Socket mạng thì không tốn thread nào cả — libuv nhờ hệ điều hành báo khi có dữ liệu (epoll, kqueue, IOCP). Những việc hệ điều hành không làm bất đồng bộ được thì libuv đẩy sang <strong>thread pool</strong>, mặc định chỉ có 4 thread: đọc ghi file, <code>dns.lookup</code>, và mấy hàm nặng CPU như <code>crypto.pbkdf2</code> hay <code>zlib</code>. Cái bẫy ở đây là: event loop rảnh nhưng app vẫn chậm, vì một loạt lệnh hash hay đọc file đang xếp hàng chờ 4 thread đó.</p></details>
<pre>   ┌───────────────────────────┐
┌─▶│ timers                    │  setTimeout / setInterval
│  ├───────────────────────────┤
│  │ pending callbacks         │  deferred system errors (e.g. TCP)
│  ├───────────────────────────┤
│  │ poll                      │  wait for I/O, run I/O callbacks
│  ├───────────────────────────┤
│  │ check                     │  setImmediate
│  ├───────────────────────────┤
└──┤ close callbacks           │  socket.on('close')
   └───────────────────────────┘
 between EVERY callback: process.nextTick queue → promise microtasks</pre>
<table><tr><th>Work</th><th>Handled by</th></tr>
<tr><td>TCP/HTTP sockets, DB drivers (pg)</td><td>OS async I/O — no thread pool</td></tr>
<tr><td>fs.*, dns.lookup</td><td>libuv thread pool</td></tr>
<tr><td>crypto.pbkdf2/scrypt, zlib</td><td>libuv thread pool</td></tr>
<tr><td>Your JS (JSON.parse, loops, masking logic)</td><td>Main thread — blocks everything</td></tr>
</table>
<ul>
<li><code>UV_THREADPOOL_SIZE</code> (max 1024) must be set before the pool is first used.</li>
<li>Recursive <code>process.nextTick</code> can starve I/O — the loop never reaches poll.</li>
</ul>
<div class="key-point">One JS thread + OS async for network + a 4-thread pool for fs/dns/crypto/zlib. CPU-heavy JavaScript is the real enemy, because nothing else runs while it does.</div>`,
      },
      {
        q: 'worker_threads vs child_process vs cluster — when do you use each?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>They solve different problems. <strong>worker_threads</strong> run JavaScript on extra threads inside the same process, each with its own V8 isolate and event loop; they can share memory through <code>SharedArrayBuffer</code> and pass data by message. They're the right tool for CPU-bound work like hashing, compression, parsing or heavy transformation that would otherwise block the main thread. <strong>child_process</strong> starts a separate OS process, used to run another program such as <code>pg_dump</code> or <code>psql</code>, or to isolate risky work so a crash doesn't take down the parent. <strong>cluster</strong> forks several copies of the same server that share one listening port, to use all CPU cores for an HTTP server; in containers people usually skip it and run more replicas instead. For I/O-bound work like streaming rows between databases you need none of them — the event loop already handles many concurrent connections.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Ba cái này dùng cho ba việc khác nhau. <strong>worker_threads</strong> chạy JavaScript trên thread phụ ngay trong cùng process; mỗi worker có V8 isolate và event loop riêng, trao đổi với nhau bằng message hoặc dùng chung bộ nhớ qua <code>SharedArrayBuffer</code>. Đây là lựa chọn đúng cho việc nặng CPU — hash, nén, parse, biến đổi dữ liệu phức tạp — những thứ mà chạy trên main thread là treo cả app. <strong>child_process</strong> mở hẳn một process mới của hệ điều hành, dùng khi cần gọi chương trình khác như <code>pg_dump</code>, <code>psql</code>, hoặc muốn tách phần rủi ro ra riêng: nó có crash thì process cha vẫn sống. <strong>cluster</strong> fork nhiều bản của cùng một server dùng chung một port để tận dụng hết các core CPU; nhưng chạy trong container thì người ta thường bỏ qua nó, scale bằng cách tăng số replica cho đơn giản. Còn việc nặng I/O như stream dữ liệu giữa hai database thì không cần cái nào hết — bản thân event loop đã xử lý rất nhiều kết nối cùng lúc rồi.</p></details>
<table><tr><th></th><th>worker_threads</th><th>child_process</th><th>cluster</th></tr>
<tr><td>Unit</td><td>Thread, same process</td><td>Separate OS process</td><td>Forked copies of same app</td></tr>
<tr><td>Memory</td><td>Can share (SharedArrayBuffer)</td><td>Isolated</td><td>Isolated</td></tr>
<tr><td>Communication</td><td>postMessage, transferables</td><td>stdio pipes, IPC</td><td>IPC, shared port</td></tr>
<tr><td>Use for</td><td>CPU-bound JS</td><td>External tools, isolation</td><td>Multi-core HTTP server</td></tr>
</table>
<pre>// Run pg_dump --schema-only for a schema comparison step
import { spawn } from 'node:child_process';
const dump = spawn('pg_dump', ['--schema-only', '-d', srcUrl]);
dump.stdout.pipe(fs.createWriteStream('schema.sql'));
dump.on('exit', (code) =&gt; { if (code !== 0) process.exitCode = 1; });

// Offload CPU-heavy masking of a large chunk to a worker
import { Worker } from 'node:worker_threads';
const w = new Worker(new URL('./mask-worker.js', import.meta.url), { workerData: chunk });
w.on('message', (masked) =&gt; write(masked));</pre>
<div class="key-point">CPU-bound JS → worker_threads. Run another program or isolate a crash → child_process. Use all cores for a web server → cluster (or just more containers). I/O-bound → none, the event loop is enough.</div>`,
      },
      {
        q: 'How do you handle errors, unhandled rejections and graceful shutdown in a Node.js process?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Errors in async code must be handled where they happen — <code>await</code> inside <code>try/catch</code>, or <code>.catch</code> on every promise you don't await. Since Node 15, an <strong>unhandled promise rejection</strong> crashes the process by default, which is the right behaviour, because the state of the program is unknown. <code>uncaughtException</code> and <code>unhandledRejection</code> handlers are for logging and a clean exit, not for carrying on as if nothing happened. <strong>Graceful shutdown</strong> means on <code>SIGTERM</code> or <code>SIGINT</code> you stop accepting new work, let in-flight work finish or roll back, close the database pool, and exit with a meaningful code, with a hard timeout in case something hangs. For a migration tool that matters a lot: Ctrl+C in the middle of a table should roll back that table's transaction and record a checkpoint, not leave half-copied data behind.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Lỗi trong code async phải bắt ngay tại chỗ: <code>await</code> thì bọc <code>try/catch</code>, promise nào không await thì phải gắn <code>.catch</code>. Từ Node 15, một <strong>promise bị reject mà không ai bắt</strong> sẽ làm process crash luôn — và vậy là đúng, vì lúc đó trạng thái chương trình không còn tin được nữa. Handler <code>uncaughtException</code> và <code>unhandledRejection</code> chỉ để ghi log rồi thoát cho gọn, đừng dùng nó để chạy tiếp như không có chuyện gì. <strong>Graceful shutdown</strong> nghĩa là khi nhận <code>SIGTERM</code> hay <code>SIGINT</code>: ngừng nhận việc mới, để việc đang chạy làm xong hoặc rollback, đóng connection pool, rồi thoát với exit code rõ ràng — kèm một timeout cứng phòng khi có gì đó bị treo. Với tool migration thì chuyện này rất quan trọng: lỡ bấm Ctrl+C giữa lúc đang copy một bảng, tool phải rollback transaction của bảng đó và lưu checkpoint, chứ không được để lại dữ liệu copy dở.</p></details>
<pre>let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  log.warn('received ' + signal + ', stopping after current batch');
  const timer = setTimeout(() =&gt; process.exit(1), 30_000).unref();  // hard stop
  try {
    await runner.stop();        // abort stream → current table tx rolls back
    await checkpoint.flush();   // remember which tables completed
    await pool.end();
  } finally {
    clearTimeout(timer);
    process.exit(130);
  }
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

process.on('unhandledRejection', (err) =&gt; {
  log.fatal({ err }, 'unhandled rejection');
  process.exit(1);              // don't continue in an unknown state
});</pre>
<ul>
<li>Use <code>AbortController</code> to cancel streams and queries cleanly.</li>
<li>Set <code>process.exitCode</code> instead of calling <code>process.exit()</code> mid-flight when you want pending logs to flush.</li>
<li>Exit codes are an API for scripts and CI: 0 = success, non-zero = failure (validation failed ≠ crash — use distinct codes).</li>
</ul>
<div class="key-point">Handle errors where they occur, let unknown errors crash, and on SIGTERM/SIGINT stop accepting work, roll back the current unit, close resources and exit with a clear code under a hard timeout.</div>`,
      },

      // ──── 2. STREAMS ────
      {
        q: 'Explain Node.js streams and backpressure. Why use stream.pipeline instead of .pipe()?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Streams process data piece by piece instead of loading it all into memory. A <strong>Readable</strong> produces chunks, a <strong>Writable</strong> consumes them, and a <strong>Transform</strong> sits in between and changes them — for example masking columns row by row. <strong>Backpressure</strong> is how a fast producer is slowed to the speed of a slow consumer: each stream has a buffer limit called <code>highWaterMark</code>; when a writable's buffer is full, <code>write()</code> returns <code>false</code>, the producer pauses, and it resumes on the <code>'drain'</code> event. If you ignore that and keep writing, the buffer grows without limit and the process runs out of memory. The old <code>.pipe()</code> handles backpressure but not errors: if one stream fails, the others aren't destroyed, so you leak file handles or database connections. <code>stream.pipeline</code> (or <code>stream/promises</code>) wires backpressure, forwards an error from any stage, destroys every stream, and gives you one promise to await.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Stream xử lý dữ liệu từng phần nhỏ thay vì load hết vào RAM. <strong>Readable</strong> đọc ra từng chunk, <strong>Writable</strong> ghi chúng đi, còn <strong>Transform</strong> nằm giữa để biến đổi — ví dụ mask các cột trên từng dòng. <strong>Backpressure</strong> là cơ chế bắt bên đọc nhanh phải chờ bên ghi chậm. Mỗi stream có một ngưỡng buffer là <code>highWaterMark</code>; khi buffer bên ghi đầy, <code>write()</code> trả về <code>false</code>, bên đọc tạm dừng, và chạy tiếp khi có event <code>'drain'</code>. Nếu bỏ qua tín hiệu này mà cứ ghi tiếp, buffer phình mãi rồi process hết bộ nhớ. <code>.pipe()</code> kiểu cũ có lo backpressure nhưng không lo lỗi: một stream hỏng thì mấy stream còn lại không bị đóng, dẫn tới rò rỉ file handle hay connection database. Vì vậy nên dùng <code>stream.pipeline</code> (hoặc bản trong <code>stream/promises</code>): nó vừa nối backpressure, vừa bắt lỗi ở bất kỳ khâu nào, đóng hết các stream, và trả về đúng một promise để bạn await.</p></details>
<pre>import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';

// ❌ Ignores backpressure → memory grows until OOM
source.on('data', (chunk) =&gt; dest.write(chunk));

// ❌ .pipe(): backpressure OK, but an error in 'dest' leaves 'source' open
source.pipe(mask).pipe(dest);

// ✅ pipeline: backpressure + error propagation + cleanup
await pipeline(
  source,                         // COPY ... TO STDOUT
  new Transform({
    transform(chunk, _enc, cb) { cb(null, maskChunk(chunk)); },
  }),
  dest,                           // COPY ... FROM STDIN
  { signal: abortController.signal },
);

// Manual backpressure, if you write yourself
if (!dest.write(row)) await once(dest, 'drain');</pre>
<table><tr><th>Type</th><th>Example in a migration tool</th></tr>
<tr><td>Readable</td><td>COPY TO STDOUT from the source DB, file read</td></tr>
<tr><td>Transform</td><td>CSV line splitter, PII masking, row hashing</td></tr>
<tr><td>Writable</td><td>COPY FROM STDIN into the target DB, report file</td></tr>
</table>
<div class="key-point">Streams keep memory flat; backpressure keeps it flat when the consumer is slower; pipeline() makes sure one failing stage tears down the whole chain. Always use pipeline in production code.</div>`,
      },
      {
        q: 'How do you process a table with millions of rows in Node.js without running out of memory?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The rule is never to hold the whole table in memory. A plain <code>SELECT *</code> with the <code>pg</code> driver buffers the entire result set before you see the first row, so a large table crashes the process at the V8 heap limit. Instead, either stream the data — <code>COPY ... TO STDOUT</code> with <code>pg-copy-streams</code>, or a server-side cursor with <code>pg-query-stream</code> — or page through it with <strong>keyset pagination</strong> (<code>WHERE id &gt; $last ORDER BY id LIMIT 100000</code>), which stays fast at any depth, unlike <code>OFFSET</code>. Keep per-chunk state small, push work through a stream pipeline with backpressure, and watch memory with <code>process.memoryUsage()</code>. Raising <code>--max-old-space-size</code> only hides the problem; a streaming design uses roughly the same memory for ten thousand rows as for ten million.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Nguyên tắc số một: đừng bao giờ giữ nguyên cả bảng trong RAM. Một câu <code>SELECT *</code> bình thường với driver <code>pg</code> sẽ gom hết kết quả rồi mới trả về dòng đầu tiên, nên gặp bảng lớn là process chết khi chạm giới hạn heap của V8. Có hai cách làm đúng. Một là stream: <code>COPY ... TO STDOUT</code> qua <code>pg-copy-streams</code>, hoặc dùng cursor phía server với <code>pg-query-stream</code>. Hai là chia trang bằng <strong>keyset pagination</strong> (<code>WHERE id &gt; $last ORDER BY id LIMIT 100000</code>) — cách này trang sâu cỡ nào vẫn nhanh, khác hẳn <code>OFFSET</code>. Giữ dữ liệu của mỗi chunk thật nhỏ, cho chạy qua một stream pipeline có backpressure, và theo dõi bộ nhớ bằng <code>process.memoryUsage()</code>. Còn tăng <code>--max-old-space-size</code> chỉ là che bệnh thôi; thiết kế dạng stream thì bảng mười nghìn hay mười triệu dòng cũng tốn bộ nhớ gần như nhau.</p></details>
<pre>// ❌ Loads everything: 8M rows × ~500 bytes ≈ 4 GB → heap OOM
const { rows } = await client.query('SELECT * FROM shipment');

// ✅ Keyset pagination in batches
let lastId = 0;
for (;;) {
  const { rows } = await src.query(
    'SELECT * FROM shipment WHERE id &gt; $1 ORDER BY id LIMIT 100000', [lastId]);
  if (rows.length === 0) break;
  await writeBatch(rows);
  lastId = rows[rows.length - 1].id;
  await checkpoint.save('shipment', lastId);   // resumable
}

// ✅ Or a server-side cursor stream
import QueryStream from 'pg-query-stream';
const stream = client.query(new QueryStream('SELECT * FROM shipment', [], { batchSize: 5000 }));</pre>
<ul>
<li><strong>OFFSET</strong> re-scans skipped rows: page 1,000 is far slower than page 1.</li>
<li>Buffers (from COPY) live outside the V8 heap — watch <code>rss</code> and <code>external</code>, not only <code>heapUsed</code>.</li>
<li>Large <code>JSON.stringify</code>/<code>JSON.parse</code> on a whole batch blocks the event loop; keep batches bounded.</li>
</ul>
<div class="key-point">Stream it or page it with keyset pagination, never SELECT * into an array. Memory should depend on batch size, not table size.</div>`,
      },

      // ──── 3. POSTGRESQL BULK DATA ────
      {
        q: 'PostgreSQL COPY vs batched INSERT — why is COPY so much faster, and how do you use it from Node.js?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p><code>COPY</code> is PostgreSQL's bulk load protocol: the client sends a continuous stream of rows in text, CSV or binary format, and the server parses and inserts them in one command. Compared with <code>INSERT</code> it skips per-statement parsing and planning, per-statement round trips and most per-row overhead, so it is typically several times faster than multi-row <code>INSERT</code> and one to two orders of magnitude faster than single-row inserts. In Node, <code>pg-copy-streams</code> exposes <code>COPY ... TO STDOUT</code> as a Readable and <code>COPY ... FROM STDIN</code> as a Writable, so copying a table between databases becomes one stream pipeline from the source connection to the target connection, with masking as a Transform in the middle. The trade-offs: COPY is all-or-nothing per command, so one bad row fails the whole batch; it doesn't support <code>ON CONFLICT</code>, so upserts need a staging table; and triggers and constraints still run unless you handle them deliberately.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>COPY</code> là cơ chế nạp dữ liệu số lượng lớn của PostgreSQL: client đẩy một luồng dòng liên tục ở dạng text, CSV hoặc binary, server parse và ghi tất cả trong đúng một lệnh. So với <code>INSERT</code>, nó không phải parse và lập plan cho từng câu, không tốn round trip cho từng câu, và chi phí trên mỗi dòng thấp hơn hẳn — thường nhanh gấp vài lần so với INSERT nhiều dòng, và gấp mười tới cả trăm lần so với insert từng dòng. Trong Node, <code>pg-copy-streams</code> biến <code>COPY ... TO STDOUT</code> thành một Readable và <code>COPY ... FROM STDIN</code> thành một Writable. Nhờ vậy, copy một bảng giữa hai database chỉ còn là một stream pipeline: connection nguồn → bước mask (Transform) → connection đích. Đổi lại có vài điểm cần biết: mỗi lệnh COPY là all-or-nothing, một dòng lỗi là hỏng cả batch; COPY không có <code>ON CONFLICT</code>, muốn upsert thì phải đi qua bảng staging; và trigger với constraint vẫn chạy bình thường nếu bạn không chủ động xử lý.</p></details>
<pre>import { pipeline } from 'node:stream/promises';
import { to as copyTo, from as copyFrom } from 'pg-copy-streams';

async function copyTable(src, dst, table) {
  await dst.query('BEGIN');
  try {
    await dst.query('TRUNCATE ' + table + ' CASCADE');
    const out = src.query(copyTo('COPY ' + table + ' TO STDOUT WITH (FORMAT csv)'));
    const into = dst.query(copyFrom('COPY ' + table + ' FROM STDIN WITH (FORMAT csv)'));
    await pipeline(out, maskTransform(table), into);
    await dst.query('COMMIT');
  } catch (e) {
    await dst.query('ROLLBACK');     // table left exactly as before
    throw e;
  }
}

// Upsert with COPY: load into staging, then merge
//   COPY stage_customer FROM STDIN ...
//   INSERT INTO customer SELECT * FROM stage_customer
//     ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, ...</pre>
<table><tr><th>Method</th><th>Relative speed</th><th>Notes</th></tr>
<tr><td>Single-row INSERT</td><td>1×</td><td>Round trip per row</td></tr>
<tr><td>Multi-row INSERT (1k rows)</td><td>~10–50×</td><td>65,535 bind-parameter limit</td></tr>
<tr><td>COPY</td><td>~50–100×+</td><td>Streaming, no ON CONFLICT</td></tr>
</table>
<p><strong>Extra speed-ups for big loads</strong>: drop or defer secondary indexes and rebuild after, raise <code>maintenance_work_mem</code> for the rebuild, run <code>ANALYZE</code> afterwards so the planner has statistics, and use binary format when both sides share the same schema/types.</p>
<div class="key-point">COPY streams rows in one command, so it beats INSERT by a wide margin. In Node, pipe COPY TO STDOUT → Transform → COPY FROM STDIN inside one target transaction per table, and use a staging table when you need upserts.</div>`,
      },
      {
        q: 'How do you copy 100+ related tables when foreign keys force an order? What about sequences afterwards?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>With foreign keys, a child row can't be inserted before its parent, so tables must be loaded in dependency order. I read the dependencies from the catalog (<code>pg_constraint</code> where <code>contype = 'f'</code>), build a graph and do a <strong>topological sort</strong>: parents first, children after, and the reverse order for deleting or truncating. Cycles — two tables referencing each other, or a self-reference like <code>employee.manager_id</code> — can't be sorted, so for those I either load the tables inside one transaction with the constraints set <code>DEFERRABLE</code> and <code>SET CONSTRAINTS ALL DEFERRED</code>, or load the rows with the nullable FK empty and fill it in a second pass. Some teams use <code>session_replication_role = replica</code> to skip FK triggers entirely, but that also skips validation, so you must check integrity afterwards. The step people forget is <strong>sequences</strong>: COPY writes explicit IDs without advancing the sequence, so the first insert by the application fails with a duplicate key until you <code>setval</code> each sequence to the max ID.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Có foreign key thì không thể insert dòng con trước dòng cha, nên phải nạp bảng theo đúng thứ tự phụ thuộc. Tôi đọc các quan hệ từ catalog (<code>pg_constraint</code> với <code>contype = 'f'</code>), dựng thành đồ thị rồi <strong>sắp xếp topo</strong>: bảng cha trước, bảng con sau; còn khi xóa hay truncate thì làm ngược lại. Chỗ khó là các vòng tham chiếu — hai bảng trỏ qua lại nhau, hoặc bảng tự trỏ vào chính nó như <code>employee.manager_id</code> — thì không sắp được. Với mấy bảng này, hoặc là nạp chung trong một transaction với constraint khai báo <code>DEFERRABLE</code> và <code>SET CONSTRAINTS ALL DEFERRED</code>, hoặc là nạp trước với cột foreign key để null rồi cập nhật lại ở lượt hai. Có team dùng <code>session_replication_role = replica</code> để tắt hẳn trigger kiểm tra foreign key, nhưng như vậy là tắt luôn việc kiểm tra dữ liệu, nên sau đó bắt buộc phải tự kiểm tra lại. Bước hay bị quên nhất là <strong>sequence</strong>: COPY ghi thẳng ID nhưng không đẩy sequence lên, nên lần insert đầu tiên của app sẽ bị lỗi trùng key — phải <code>setval</code> từng sequence về ID lớn nhất.</p></details>
<pre>-- 1. FK edges: child → parent
SELECT conrelid::regclass AS child, confrelid::regclass AS parent
FROM pg_constraint
WHERE contype = 'f' AND conrelid &lt;&gt; confrelid;   -- self-references handled separately

// 2. Kahn's algorithm (parents first)
function topoSort(tables, edges) {
  const indeg = new Map(tables.map((t) =&gt; [t, 0]));
  const children = new Map(tables.map((t) =&gt; [t, []]));
  for (const { child, parent } of edges) { indeg.set(child, indeg.get(child) + 1); children.get(parent).push(child); }
  const queue = tables.filter((t) =&gt; indeg.get(t) === 0), order = [];
  while (queue.length) {
    const t = queue.shift(); order.push(t);
    for (const c of children.get(t)) if (indeg.set(c, indeg.get(c) - 1).get(c) === 0) queue.push(c);
  }
  if (order.length !== tables.length) throw new Error('FK cycle — load these tables with deferred constraints');
  return order;            // load in this order, truncate in reverse
}

-- 3. Reset every sequence after load
SELECT setval(pg_get_serial_sequence('shipment', 'id'),
              COALESCE((SELECT MAX(id) FROM shipment), 1));</pre>
<ul>
<li>Tables with no FK between them can be copied <strong>in parallel</strong> — group the sort into levels.</li>
<li>Deferred constraints are checked at COMMIT, so the related tables must share one transaction.</li>
<li>Identity columns (<code>GENERATED ... AS IDENTITY</code>) need <code>ALTER TABLE ... ALTER COLUMN id RESTART WITH n</code> or setval on their sequence.</li>
</ul>
<div class="key-point">Topologically sort tables from pg_constraint, handle cycles with deferred constraints or a second pass, parallelise independent levels, and always reset sequences after COPY.</div>`,
      },

      // ──── 4. MIGRATION TOOL DESIGN ────
      {
        q: 'How do you make a data migration idempotent and resumable?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p><strong>Idempotent</strong> means running the migration twice gives the same result as running it once, and <strong>resumable</strong> means a failure halfway doesn't force you to start from scratch. I get both by choosing a clear unit of work — one table, or one chunk of a big table — and making each unit atomic: load it inside a transaction that either fully replaces the target data (truncate and copy) or upserts by primary key, so re-running it never duplicates rows. After each unit commits, I record a <strong>checkpoint</strong> — table name, last key and a run ID — in a small control table or file. On restart the tool skips completed units and continues from the last checkpoint. The checkpoint must be written after the data commits, ideally in the same target transaction, otherwise a crash between the two leaves them out of sync.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Idempotent</strong> nghĩa là chạy migration hai lần thì kết quả vẫn y như chạy một lần. <strong>Resumable</strong> nghĩa là hỏng giữa chừng thì chạy tiếp được, không phải làm lại từ đầu. Để có cả hai, tôi chia việc thành từng đơn vị rõ ràng — một bảng, hoặc một chunk của bảng lớn — và làm cho mỗi đơn vị là all-or-nothing: nạp trong một transaction, hoặc thay sạch dữ liệu đích (truncate rồi copy), hoặc upsert theo primary key. Nhờ vậy chạy lại bao nhiêu lần cũng không sinh dòng trùng. Mỗi đơn vị commit xong, tool ghi một <strong>checkpoint</strong> — tên bảng, key cuối cùng, run ID — vào một bảng điều khiển nhỏ hoặc một file. Khi chạy lại, tool bỏ qua phần đã xong và đi tiếp từ checkpoint cuối. Lưu ý: checkpoint phải ghi sau khi dữ liệu đã commit, tốt nhất là cùng transaction ở phía đích; nếu không, crash đúng lúc giữa hai bước là checkpoint và dữ liệu lệch nhau.</p></details>
<pre>CREATE TABLE IF NOT EXISTS _migration_checkpoint (
  run_id     uuid,
  table_name text,
  last_key   bigint,
  status     text,            -- 'done' | 'in_progress'
  rows       bigint,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (run_id, table_name)
);

// per chunk, in ONE target transaction:
BEGIN;
  -- load chunk (COPY into staging, then INSERT ... ON CONFLICT DO UPDATE)
  INSERT INTO _migration_checkpoint (...) VALUES (...)
    ON CONFLICT (run_id, table_name) DO UPDATE SET last_key = EXCLUDED.last_key;
COMMIT;                       // data + checkpoint move together</pre>
<table><tr><th>Strategy</th><th>Idempotent by</th><th>Good for</th></tr>
<tr><td>Truncate + COPY per table</td><td>Full replace in one tx</td><td>Refreshing dev/test from prod</td></tr>
<tr><td>Upsert by PK</td><td>ON CONFLICT</td><td>Incremental syncs</td></tr>
<tr><td>Chunk + checkpoint</td><td>Last key recorded with data</td><td>Very large tables</td></tr>
</table>
<div class="key-point">Pick an atomic unit (table or chunk), make re-running it safe (replace or upsert), and commit the checkpoint together with the data. Then a failure costs one chunk, not the whole run.</div>`,
      },
      {
        q: 'How do you prove a migration copied the data correctly? (schema comparison, row checks, reconciliation)',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>I validate in stages, from cheap to expensive, and fail fast. First, <strong>schema comparison</strong> before copying anything: tables, columns, types, nullability, constraints and indexes from <code>information_schema</code> or <code>pg_catalog</code> on both sides, because a missing column or a different type will either fail the load or silently truncate data. Second, <strong>row counts</strong> per table after the load. Counts can match while content differs, so third, <strong>checksums</strong>: hash every row on both sides, aggregate the hashes per chunk of primary keys, and compare chunk by chunk; when a chunk differs, drill into it to find the exact rows. Where both databases can reach each other, an <code>EXCEPT</code> query or a full outer join on the primary key lists missing, extra and changed rows directly. Masked columns are excluded from the hash or compared after applying the same masking. Finally, a <strong>reconciliation report</strong> lists each table's status, so anyone can see what was verified, not just that the script exited with code 0.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Tôi kiểm tra theo từng lớp, từ rẻ tới đắt, lỗi ở đâu dừng ở đó. Lớp đầu là <strong>so sánh schema</strong> trước khi copy bất cứ gì: bảng, cột, kiểu dữ liệu, nullable, constraint, index ở cả hai phía, lấy từ <code>information_schema</code> hoặc <code>pg_catalog</code>. Thiếu một cột hay lệch kiểu thì nhẹ là lỗi lúc nạp, nặng là dữ liệu bị cắt mất mà không ai biết. Lớp hai là <strong>đếm số dòng</strong> từng bảng sau khi nạp. Nhưng số dòng khớp chưa chắc nội dung đã khớp, nên lớp ba là <strong>checksum</strong>: hash từng dòng ở hai phía, gộp hash theo từng chunk primary key rồi so từng chunk; chunk nào lệch thì đào sâu vào đó để tìm đúng dòng sai. Nếu hai database kết nối được với nhau thì một câu <code>EXCEPT</code> hoặc full outer join theo primary key sẽ chỉ thẳng ra dòng nào thiếu, thừa hay bị đổi. Cột đã mask thì bỏ ra khỏi phép hash, hoặc so sau khi áp cùng một cách mask. Cuối cùng là một <strong>báo cáo đối soát</strong> ghi trạng thái từng bảng, để mọi người thấy rõ cái gì đã được kiểm chứng — chứ không chỉ biết là script chạy xong với exit code 0.</p></details>
<pre>-- Stage 1: schema diff input (run on both sides, compare in Node)
SELECT table_name, column_name, data_type, is_nullable, character_maximum_length
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Stage 3: checksum per chunk of 100k ids (run on both sides)
SELECT id / 100000 AS chunk,
       count(*) AS rows,
       md5(string_agg(md5(t::text), '' ORDER BY id)) AS chunk_hash
FROM shipment t
GROUP BY 1 ORDER BY 1;

-- Drill-down when both tables are reachable (e.g. via postgres_fdw)
(SELECT * FROM src.shipment WHERE id BETWEEN 300000 AND 399999
 EXCEPT
 SELECT * FROM public.shipment WHERE id BETWEEN 300000 AND 399999);</pre>
<table><tr><th>Stage</th><th>Catches</th><th>Cost</th></tr>
<tr><td>Schema comparison</td><td>Missing columns, type/length drift</td><td>Very cheap</td></tr>
<tr><td>Row counts</td><td>Missing/extra rows</td><td>Cheap</td></tr>
<tr><td>Chunk checksums</td><td>Changed values</td><td>One scan per side</td></tr>
<tr><td>EXCEPT / row diff</td><td>Exact differing rows</td><td>Only on failing chunks</td></tr>
</table>
<div class="key-point">Schema first, then counts, then chunked hashes, then row-level diffs only where hashes disagree — and publish a reconciliation report. That's what lets you claim "zero production incidents" with evidence.</div>`,
      },
      {
        q: 'How do you mask personal data (PII) when copying production data to dev/test?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Production data in lower environments is a common source of data leaks, so personal data must be masked before it ever lands outside production — ideally in the stream itself, so unmasked values are never written to disk or to the target database. The technique depends on the column. <strong>Deterministic hashing</strong> with a secret key (HMAC) turns the same input into the same output every time, so values used to join or look up records, like emails or customer codes, still match across tables. <strong>Fake data</strong> from a library like Faker produces realistic names and addresses for display fields. <strong>Format-preserving</strong> masking keeps the shape — the same length, digits stay digits — so validation rules and UI layouts still work, for example for phone numbers and tax IDs. <strong>Nulling or redacting</strong> suits free-text notes and anything the app doesn't need. The masking rules should live in a reviewed config that maps every PII column, and a check should fail the run if a new column appears that nobody has classified.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Dữ liệu production nằm trên môi trường dev/test là một nguồn lộ dữ liệu rất hay gặp. Vì vậy dữ liệu cá nhân phải được mask trước khi rời khỏi production — tốt nhất là mask ngay trong stream, để giá trị gốc không bao giờ bị ghi xuống đĩa hay vào database đích. Mỗi loại cột dùng một cách khác nhau. <strong>Hash tất định</strong> có secret key (HMAC): cùng đầu vào luôn ra cùng đầu ra, nên những cột dùng để join hay tra cứu như email, mã khách hàng vẫn khớp nhau giữa các bảng. <strong>Dữ liệu giả</strong> sinh bằng thư viện như Faker cho tên, địa chỉ — những trường chỉ để hiển thị. <strong>Mask giữ định dạng</strong> giữ nguyên hình dạng — cùng độ dài, số vẫn là số — để validation và giao diện vẫn chạy đúng, hợp với số điện thoại, mã số thuế. <strong>Để null hoặc xóa trắng</strong> cho ghi chú tự do và những gì app không cần. Bộ luật mask nên nằm trong một file cấu hình có review, liệt kê hết mọi cột PII, và có một bước kiểm tra làm lần chạy thất bại nếu xuất hiện cột mới mà chưa ai phân loại.</p></details>
<pre>// masking.config.js — reviewed like code
export default {
  customer: {
    email:     'hmac-email',    // a1b2c3@masked.local — same input → same output
    full_name: 'fake-name',
    phone:     'keep-format',   // 0912-345-678 → 0937-120-554
    tax_code:  'keep-format',
    note:      'null',
  },
  // unlisted tables/columns must be declared 'safe' explicitly
};

import { createHmac } from 'node:crypto';
const hmac = (v) =&gt; createHmac('sha256', process.env.MASK_KEY).update(v).digest('hex').slice(0, 12);

const rules = {
  'hmac-email': (v) =&gt; (v == null ? v : hmac(v.toLowerCase()) + '@masked.local'),
  'keep-format': (v) =&gt; (v == null ? v : v.replace(/\d/g, () =&gt; String(randomInt(10)))),
  'null': () =&gt; null,
};
// applied row by row inside the Transform stream between COPY TO and COPY FROM</pre>
<table><tr><th>Technique</th><th>Keeps joins</th><th>Realistic</th><th>Use for</th></tr>
<tr><td>Deterministic HMAC</td><td>✔</td><td>✘</td><td>Emails, codes used as keys</td></tr>
<tr><td>Fake data (Faker)</td><td>✘ (unless seeded per value)</td><td>✔</td><td>Names, addresses</td></tr>
<tr><td>Format-preserving</td><td>Optional</td><td>✔</td><td>Phone, ID numbers, card-like fields</td></tr>
<tr><td>Null / redact</td><td>✘</td><td>✘</td><td>Free text, documents</td></tr>
</table>
<ul>
<li>Plain unsalted hashes of emails or phone numbers can be reversed by brute force — always use a secret key.</li>
<li>Don't forget PII hidden in JSON columns, free text, file attachments and audit logs.</li>
<li>Regulations (GDPR, Vietnam's Decree 13/2023 on personal data) make unmasked copies a legal risk, not just a technical one.</li>
</ul>
<div class="key-point">Mask in the stream, pick the technique per column (HMAC for join keys, fake for display, format-preserving for validated fields, null for free text), keep rules in reviewed config, and fail the run on unclassified columns.</div>`,
      },
      {
        q: 'What guardrails stop a developer from accidentally overwriting production with a self-service migration tool?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Once developers can run migrations themselves without a DBA, the tool itself has to make the dangerous mistake impossible, not just unlikely. The most important guardrail is <strong>direction</strong>: production may only ever be a source, never a target — the tool checks the target against an allow-list of non-production hosts and refuses anything else. Second, <strong>least-privilege credentials</strong>: the tool connects to production with a read-only role, so even a bug can't write there. Third, <strong>confirmation and dry-run</strong>: a dry-run mode prints what will be truncated and copied, and a real run requires typing the target environment name. Fourth, <strong>auditability</strong>: every run logs who ran it, when, from where to where, and which tables, and the reconciliation report is saved. Add masking that can't be switched off for production sources and a lock so two people can't refresh the same environment at once.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Khi developer tự chạy migration mà không cần DBA, thì bản thân tool phải làm cho sai lầm nguy hiểm <em>không thể</em> xảy ra, chứ không chỉ là ít khi xảy ra. Rào chắn quan trọng nhất là <strong>chiều dữ liệu</strong>: production chỉ được làm nguồn, không bao giờ làm đích — tool kiểm tra đích có nằm trong danh sách host không phải production hay không, sai là từ chối. Thứ hai là <strong>quyền tối thiểu</strong>: tool kết nối production bằng role chỉ đọc, nên dù có bug cũng không ghi được gì. Thứ ba là <strong>xác nhận và dry-run</strong>: dry-run in ra những gì sẽ bị truncate và copy, còn chạy thật thì phải gõ đúng tên môi trường đích. Thứ tư là <strong>truy vết</strong>: mỗi lần chạy đều ghi log ai chạy, lúc nào, từ đâu tới đâu, những bảng nào, và lưu lại báo cáo đối soát. Thêm nữa: bước mask không tắt được khi nguồn là production, và có lock để hai người không cùng refresh một môi trường cùng lúc.</p></details>
<pre>function assertSafeTarget(cfg) {
  const target = new URL(cfg.targetUrl);
  if (!ALLOWED_TARGET_HOSTS.includes(target.hostname)) {
    throw new Error('Refusing: ' + target.hostname + ' is not an allowed target');
  }
  if (cfg.targetUrl === cfg.sourceUrl) throw new Error('Source and target are the same');
}

-- On production: a role that physically cannot write
CREATE ROLE migrate_reader LOGIN PASSWORD '...';
GRANT CONNECT ON DATABASE fwd TO migrate_reader;
GRANT USAGE ON SCHEMA public TO migrate_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO migrate_reader;
ALTER ROLE migrate_reader SET default_transaction_read_only = on;

$ fwd-migrate copy --from prod --to dev2 --module booking --dry-run
Would TRUNCATE 14 tables on dev2 (booking_*), copy ~2.3M rows, mask 9 columns.
$ fwd-migrate copy --from prod --to dev2 --module booking
Type the target name to confirm: dev2</pre>
<ul>
<li>Advisory lock on the target (<code>pg_try_advisory_lock</code>) prevents concurrent refreshes.</li>
<li>Throttle reads on production (batch size, off-peak schedule, <code>statement_timeout</code>) so a migration never hurts live users.</li>
<li>Secrets come from a vault or env, never from a config file in the repo.</li>
</ul>
<div class="key-point">Make the dangerous path impossible: production is read-only and source-only, targets come from an allow-list, runs need dry-run + typed confirmation, masking is mandatory, and every run is audited.</div>`,
      },
      {
        q: 'How do you build a Node.js CLI tool that other developers will actually use?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A tool only removes a bottleneck if people trust it and can use it without asking you. I give it a small, predictable command structure with subcommands and flags, parsed by a library like <code>commander</code> or <code>yargs</code>, plus <code>--help</code> that explains every option with examples. Configuration comes from a file per environment plus environment variables for secrets, with sensible defaults so the common case is one short command. While it runs, it shows progress — which table, how many rows, elapsed time — and at the end a clear summary. Exit codes follow conventions so it can run in CI or scripts. Errors are written for humans, saying what went wrong and what to do next, with a <code>--verbose</code> flag for stack traces. Finally it's distributed in a way that's easy to install, such as an npm package or a Docker image, with a short README.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một tool chỉ thực sự gỡ được nút thắt khi mọi người tin nó và tự dùng được mà không phải hỏi bạn. Tôi thiết kế lệnh gọn và dễ đoán, gồm subcommand và flag, parse bằng <code>commander</code> hay <code>yargs</code>, có <code>--help</code> giải thích từng option kèm ví dụ. Cấu hình lấy từ file theo từng môi trường, phần bí mật thì lấy từ biến môi trường, và có giá trị mặc định hợp lý để trường hợp thường gặp chỉ cần gõ một lệnh ngắn. Trong lúc chạy, tool hiện tiến độ — đang ở bảng nào, bao nhiêu dòng, chạy được bao lâu — và kết thúc bằng một bản tóm tắt rõ ràng. Exit code theo đúng quy ước để gắn được vào CI hay script. Thông báo lỗi viết cho người đọc: sai ở đâu, nên làm gì tiếp; muốn xem stack trace thì thêm <code>--verbose</code>. Cuối cùng là đóng gói sao cho dễ cài — một package npm hoặc Docker image — kèm README ngắn gọn.</p></details>
<pre>#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command('fwd-migrate').version('1.4.0');

program.command('copy')
  .requiredOption('--from &lt;env&gt;', 'source environment')
  .requiredOption('--to &lt;env&gt;', 'target environment (never prod)')
  .option('--module &lt;name...&gt;', 'modules to copy', ['all'])
  .option('--dry-run', 'show the plan without changing anything')
  .option('--batch-size &lt;n&gt;', 'rows per batch', '100000')
  .action(runCopy);

program.command('validate')
  .requiredOption('--from &lt;env&gt;').requiredOption('--to &lt;env&gt;')
  .action(runValidate);

program.parseAsync().catch((e) =&gt; { console.error('✖ ' + e.message); process.exit(1); });

// Exit codes: 0 ok · 1 runtime error · 2 bad usage · 3 validation mismatch</pre>
<ul>
<li><strong>Progress</strong>: one line per table (rows/sec, ETA); plain logs when not a TTY (CI).</li>
<li><strong>Logs</strong>: structured log file per run (pino) next to the reconciliation report.</li>
<li><strong>Adoption</strong>: a "first run" example in the README, and a demo in a team meeting.</li>
</ul>
<div class="key-point">Good CLI = clear subcommands and help, config + env defaults, visible progress, human error messages, conventional exit codes, and an easy install. That's what lets developers self-serve instead of waiting for a DBA.</div>`,
      },
    ],
  },
];
