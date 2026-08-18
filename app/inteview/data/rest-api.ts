// Interview data: RESTful API DESIGN
// Everything a senior backend engineer is expected to defend in an interview:
// REST constraints, HTTP semantics, idempotency, versioning, pagination,
// caching, concurrency, security, and the operational side of running an API.
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
  {
    id: 'rest-api',
    name: 'RESTful API',
    icon: '🔗',
    questions: [
      // ──── 1. FUNDAMENTALS & CONSTRAINTS ────
      {
        q: 'What actually makes an API RESTful? Which of Fielding\'s constraints do teams really break?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>REST is an architectural style defined by constraints, not a synonym for "JSON over HTTP": a uniform interface, statelessness, a client–server split, cacheability, a layered system, and optionally code-on-demand. What most teams actually ship is "HTTP APIs" — resource-shaped URLs and JSON payloads — while quietly violating two of the constraints. The first is the uniform interface, because almost nobody implements hypermedia, so clients hard-code URL templates instead of following links. The second and far more damaging is statelessness, when someone stores session or wizard state in server memory and the API silently stops being horizontally scalable. My honest position in an interview is that full REST including HATEOAS is rarely worth the cost for an internal API, but statelessness and correct HTTP semantics are non-negotiable — they are what buys you load balancing, caching, retries and proxies for free.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>REST không phải là "trả JSON qua HTTP". Nó là một bộ ràng buộc thiết kế do Roy Fielding đặt ra, gồm 6 điều: giao diện thống nhất, stateless, tách client–server, cache được, phân lớp, và code-on-demand (điều cuối gần như không ai dùng).</p><p>Thực tế thì gần như mọi API bạn thấy chỉ là "HTTP API" chứ không phải REST chuẩn. Có hai ràng buộc bị vi phạm nhiều nhất.</p><p><strong>Thứ nhất là hypermedia (HATEOAS).</strong> Đáng lẽ server trả về link để client biết bước tiếp theo làm gì. Thực tế thì lập trình viên đọc tài liệu rồi gõ cứng URL vào code. Vi phạm này ít gây hại.</p><p><strong>Thứ hai là stateless — cái này mới nguy hiểm.</strong> Chỉ cần ai đó lưu session hoặc trạng thái của một luồng nhiều bước vào RAM của server là API mất khả năng scale ngang. Bạn deploy 3 instance, người dùng đăng nhập ở instance 1, request tiếp theo rơi vào instance 2 và bị văng ra ngoài.</p><p>Quan điểm của tôi: HATEOAS không đáng làm cho API nội bộ. Nhưng stateless và dùng đúng ngữ nghĩa HTTP thì bắt buộc, vì đó là thứ cho bạn load balancer, cache, retry và proxy mà không phải viết thêm dòng code nào.</p></details>
<table>
<tr><th>Constraint</th><th>What it buys you</th><th>How teams break it</th></tr>
<tr><td><strong>Uniform interface</strong></td><td>Any client can talk to any server without bespoke glue</td><td>RPC verbs in URLs, no hypermedia, inconsistent payload shapes per endpoint</td></tr>
<tr><td><strong>Stateless</strong></td><td>Any instance can serve any request → horizontal scaling, easy failover</td><td>In-memory sessions, sticky sessions, multi-step wizards held server-side</td></tr>
<tr><td><strong>Cacheable</strong></td><td>CDN, proxy and browser caching without app code</td><td>Everything is POST, or no Cache-Control / ETag headers at all</td></tr>
<tr><td><strong>Client–server</strong></td><td>Front end and back end evolve independently</td><td>Server rendering client-specific view models into "REST" responses</td></tr>
<tr><td><strong>Layered system</strong></td><td>Gateways, WAF, load balancers can be inserted transparently</td><td>Client depends on the server's IP, or on headers only the origin sets</td></tr>
<tr><td><strong>Code on demand</strong> (optional)</td><td>Server ships executable logic to the client</td><td>Essentially unused — safely ignore</td></tr>
</table>
<p><strong>The Richardson Maturity Model</strong> is the shorthand interviewers use to place your API:</p>
<pre>Level 0  One endpoint, one verb        POST /api  {"op":"getUser","id":7}     ← RPC over HTTP
Level 1  Resources                     POST /users/7   POST /users/7/delete
Level 2  HTTP verbs + status codes     GET /users/7 → 200 | DELETE /users/7 → 204   ← where good APIs live
Level 3  Hypermedia (HATEOAS)          200 + { "_links": { "cancel": "/orders/7/cancel" } }</pre>
<div class="key-point">Say this out loud: <em>"Most production APIs are Level 2, and that is a deliberate trade-off, not ignorance. I will not fight for HATEOAS on an internal API, but I will fight for statelessness and correct verb/status semantics — those are what make the API cacheable, retryable and scalable."</em></div>`,
      },
      {
        q: 'How do you model resources and design URIs? What are the rules you will not bend?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The core idea is that a URI names a <em>thing</em>, and the HTTP method says what you are doing to it — so nouns belong in the path and verbs belong in the method. In practice that means plural collection names, an identifier segment for a single item, and nesting only deep enough to express real ownership: <code>/orders/{orderId}/items/{itemId}</code> is fine, but <code>/customers/{id}/orders/{id}/items/{id}/tax/{id}</code> is a sign the model has leaked into the URL. Two rules I never bend: no verbs in paths, and identifiers that are stable — a URI is a public contract, so it must not encode anything mutable like a name or a status. Where teams get stuck is on operations that are genuinely not CRUD, like "approve" or "recalculate"; the honest answer is that you either model the action as its own resource, such as POST to <code>/orders/{id}/approvals</code>, or accept a controller-style sub-resource and document it — pretending every domain fits four verbs produces worse APIs than a well-named exception.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Nguyên tắc gốc rất đơn giản: <strong>URL là danh từ</strong> (chỉ ra "cái gì"), <strong>HTTP method là động từ</strong> (chỉ ra "làm gì với cái đó"). Vậy nên <code>GET /orders/123</code> là đúng, còn <code>GET /getOrder?id=123</code> là sai.</p><p>Mấy quy tắc tôi luôn giữ:</p><p><strong>Tên collection viết số nhiều, chữ thường, nối bằng gạch ngang.</strong> <code>/purchase-orders</code> chứ không phải <code>/purchaseOrder</code>. URL phân biệt hoa thường, thống nhất một kiểu thì không ai phải đoán.</p><p><strong>Chỉ lồng URL khi thật sự có quan hệ sở hữu.</strong> <code>/orders/{orderId}/items/{itemId}</code> thì hợp lý. Nhưng lồng bốn năm tầng kiểu <code>/customers/1/orders/2/items/3/tax/4</code> là dấu hiệu bạn đang bê nguyên cấu trúc database lên URL.</p><p><strong>ID phải cố định, không bao giờ đổi.</strong> Đừng dùng tên hay trạng thái làm ID, vì URL là cam kết công khai với client, sửa là gãy hết.</p><p><strong>Lọc, sắp xếp, phân trang thì để ở query string.</strong> Chúng chỉ thay đổi cách nhìn vào collection, không thay đổi bản thân collection.</p><p>Chỗ khó nhất là những thao tác vốn không phải CRUD, kiểu "duyệt đơn", "tính lại giá", "gửi lại email". Có hai cách đều chấp nhận được: biến hành động thành một tài nguyên (<code>POST /orders/123/approvals</code> — hợp lý khi việc duyệt có người duyệt, thời gian, lịch sử), hoặc cứ làm một endpoint kiểu <code>POST /orders/123/approve</code> rồi ghi rõ trong tài liệu.</p><p>Đừng cố nhét mọi nghiệp vụ vào đúng bốn động từ CRUD. Ép quá thì API sẽ khó hiểu hơn nhiều so với việc chấp nhận vài ngoại lệ có tên rõ ràng.</p></details>
<pre>GET    /orders                 list orders          (filter with query params)
POST   /orders                 create an order
GET    /orders/{id}            read one
PUT    /orders/{id}            full replace
PATCH  /orders/{id}            partial update
DELETE /orders/{id}            remove
GET    /orders/{id}/items      sub-collection owned by the order
POST   /orders/{id}/approvals  a non-CRUD action modelled as a resource

❌ /getOrders  /orders/create  /order/{id}/doApprove  /api/v1/orderService/fetchAll</pre>
<table>
<tr><th>Rule</th><th>Why</th></tr>
<tr><td>Plural collections, lowercase, hyphenated</td><td><code>/purchase-orders</code> not <code>/purchaseOrder</code> — paths are case-sensitive and consistency prevents 404 guessing games</td></tr>
<tr><td>Nesting only for genuine ownership</td><td>If an item can exist without its parent, give it a top-level collection and link to it</td></tr>
<tr><td>Filtering, sorting, paging go in the query string</td><td><code>?status=OPEN&amp;sort=-createdAt&amp;limit=50</code> — they modify the view of a collection, not its identity</td></tr>
<tr><td>Stable, opaque identifiers</td><td>UUID or ULID over sequential IDs when enumeration is a risk; never a mutable slug alone</td></tr>
<tr><td>No file extensions or format in the path</td><td>Use <code>Accept</code> content negotiation, not <code>/orders.json</code></td></tr>
</table>
<p><strong>The non-CRUD problem, three legitimate answers:</strong></p>
<ol>
<li><strong>Action as a resource</strong> — <code>POST /orders/{id}/cancellations</code>. Best when the action has its own attributes, history or audit trail.</li>
<li><strong>State transition via PATCH</strong> — <code>PATCH /orders/{id}</code> with <code>{"status":"CANCELLED"}</code>. Clean when the action really is just a field change with server-side rules.</li>
<li><strong>Named controller sub-resource</strong> — <code>POST /orders/{id}/cancel</code>. Pragmatic, widely used (Stripe, GitHub do it), and better than contorting the model. Just be consistent.</li>
</ol>
<div class="key-point">Senior signal: you can defend an exception. <em>"Ninety percent of the API is noun-based CRUD; for the handful of real business actions I model them as sub-resources and document them explicitly, because a readable exception beats an unreadable abstraction."</em></div>`,
      },
      {
        q: 'Explain safe, idempotent and cacheable methods. Which HTTP verbs are which, and why does it matter?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><strong>Safe</strong> means the request does not change server state, so a crawler or a prefetching browser can call it freely. <strong>Idempotent</strong> means calling it N times leaves the server in the same state as calling it once — note that it says nothing about the response body, only the state. <strong>Cacheable</strong> means the response may be stored and replayed. GET and HEAD are safe, idempotent and cacheable; PUT and DELETE are idempotent but not safe; POST is none of the three by default; PATCH is not idempotent unless you deliberately design it to be. This matters enormously in production because every layer between your client and your server — the browser, the CDN, the load balancer, the service mesh, the HTTP client library — will retry idempotent requests on a timeout without asking you. So if you implement a state-changing operation behind GET, or a non-idempotent PUT, you have not just broken a convention, you have created duplicate charges and phantom writes that are extremely hard to reproduce.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Ba khái niệm này khác nhau:</p><p><strong>Safe</strong> — gọi bao nhiêu lần cũng không làm thay đổi dữ liệu trên server. Chỉ đọc thôi.</p><p><strong>Idempotent</strong> — gọi 1 lần hay 10 lần thì dữ liệu cuối cùng trên server vẫn như nhau. Lưu ý: nó nói về <em>dữ liệu</em>, không nói về response. Response hoàn toàn có thể khác nhau.</p><p><strong>Cacheable</strong> — response được phép lưu lại để dùng lại.</p><p>Phân loại: GET và HEAD thì đủ cả ba. PUT và DELETE thì idempotent nhưng không safe vì có thay đổi dữ liệu. POST thì không safe cũng không idempotent. PATCH chỉ idempotent nếu bạn cố tình thiết kế như vậy.</p><p>Vì sao phải quan tâm? Vì mọi thứ nằm giữa client và server — trình duyệt, CDN, load balancer, thư viện HTTP — đều <strong>tự động gửi lại</strong> các request idempotent khi bị timeout, và chúng không hỏi ý bạn.</p><p>Nên nếu bạn làm một <code>GET /users/123/delete</code> mà nó xoá dữ liệu thật, thì một con bot quét web hoặc trình duyệt prefetch có thể xoá sạch dữ liệu của bạn. Nếu PUT của bạn không idempotent, một lần retry do mạng chập chờn sẽ tạo bản ghi trùng hoặc trừ tiền hai lần. Những lỗi kiểu này cực kỳ khó tái hiện khi debug, vì chúng chỉ xảy ra khi mạng có vấn đề.</p></details>
<table>
<tr><th>Method</th><th>Safe</th><th>Idempotent</th><th>Cacheable</th><th>Body</th><th>Typical use</th></tr>
<tr><td><strong>GET</strong></td><td>✅</td><td>✅</td><td>✅</td><td>none</td><td>Read a resource or collection</td></tr>
<tr><td><strong>HEAD</strong></td><td>✅</td><td>✅</td><td>✅</td><td>none</td><td>Headers only — existence / size / ETag check</td></tr>
<tr><td><strong>OPTIONS</strong></td><td>✅</td><td>✅</td><td>❌</td><td>none</td><td>Capability discovery, CORS preflight</td></tr>
<tr><td><strong>POST</strong></td><td>❌</td><td>❌</td><td>rarely</td><td>yes</td><td>Create, or any non-idempotent action</td></tr>
<tr><td><strong>PUT</strong></td><td>❌</td><td>✅</td><td>❌</td><td>yes</td><td>Full replace at a known URI</td></tr>
<tr><td><strong>PATCH</strong></td><td>❌</td><td>⚠️ not by default</td><td>❌</td><td>yes</td><td>Partial update</td></tr>
<tr><td><strong>DELETE</strong></td><td>❌</td><td>✅</td><td>❌</td><td>optional</td><td>Remove a resource</td></tr>
</table>
<p><strong>Why PATCH is usually not idempotent</strong> — the classic interview trap:</p>
<pre>PATCH /accounts/7   {"op":"increment","field":"balance","value":100}
  → run twice, balance goes up by 200.  NOT idempotent.

PATCH /accounts/7   {"balance": 500}
  → run twice, balance is still 500.    Idempotent, because it is an absolute assignment.</pre>
<p><strong>Real consequences of getting it wrong:</strong></p>
<ul>
<li><strong>State change behind GET</strong> — a link prefetcher, a security scanner or an over-eager browser deletes data. This is a real outage pattern, not a theoretical one.</li>
<li><strong>Non-idempotent PUT</strong> — a client library retries a timed-out request and you get two side effects; the client never saw the first response, so it cannot know.</li>
<li><strong>POST with no idempotency key</strong> — the network drops the response, the user hits the button again, and you have charged them twice.</li>
</ul>
<div class="key-point">The sentence that lands: <em>"Idempotency is a promise about server state, not about the response. It matters because infrastructure I do not control will retry my requests — so the safety of a retry has to be a property of the design, not of the caller's discipline."</em></div>`,
      },
      {
        q: 'POST vs PUT vs PATCH — when do you use each, and who decides the resource ID?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The clean split is about who owns the URI and how much of the resource you are sending. <strong>POST</strong> to a collection means "create something under your control" — the server picks the ID and returns it in a <code>Location</code> header with 201, and because the client cannot predict the URI, repeating the call creates a second resource. <strong>PUT</strong> targets a URI the client already knows and replaces the resource wholesale, which makes it idempotent and also makes it the right choice when the client generates the ID, for example a UUID created on the device — <code>PUT /documents/{clientUuid}</code> is a genuinely safe upsert. <strong>PATCH</strong> sends only the fields that change, which saves bandwidth and, more importantly, avoids the lost-update problem where a client that fetched the resource ten minutes ago PUTs back a stale copy of fields it never touched. My rule of thumb: PUT when the client holds the full, current representation; PATCH when it holds a delta; POST when the server owns identity or the operation simply is not idempotent.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Câu hỏi để phân biệt: <strong>ai quyết định ID</strong>, và <strong>bạn gửi lên bao nhiêu phần dữ liệu</strong>.</p><p><strong>POST vào collection</strong> = "tạo giúp tôi, anh tự đặt ID". Server sinh ID, trả về 201 kèm header <code>Location</code> chỉ tới tài nguyên vừa tạo. Vì client không biết trước URL nên gọi lại lần nữa sẽ tạo thêm một bản ghi mới — đó là lý do POST không idempotent.</p><p><strong>PUT vào một URL cụ thể</strong> = "thay toàn bộ tài nguyên ở địa chỉ này bằng dữ liệu tôi gửi". Gọi lại vẫn ra kết quả đó nên nó idempotent. PUT cũng là lựa chọn đúng khi client tự sinh ID, ví dụ app mobile tạo UUID ngay trên máy rồi <code>PUT /documents/{uuid}</code> — vừa tạo mới vừa cập nhật đều được, và retry hoàn toàn an toàn.</p><p><strong>PATCH</strong> = chỉ gửi những field thay đổi. Lợi ích lớn nhất không phải tiết kiệm băng thông, mà là <strong>tránh ghi đè mất dữ liệu của người khác</strong>.</p><p>Ví dụ cụ thể: anh A mở form lúc 10h00, đến 10h10 mới bấm lưu. Nếu dùng PUT, client gửi lên nguyên object với dữ liệu của 10h00, ghi đè luôn cả những field mà chị B vừa sửa lúc 10h05 — dù anh A không hề đụng vào những field đó. PATCH chỉ gửi đúng field anh A sửa nên không có vấn đề này.</p><p>Tóm lại: dùng PUT khi client đang giữ bản đầy đủ và mới nhất. Dùng PATCH khi client chỉ giữ phần thay đổi. Dùng POST khi server đặt ID, hoặc khi thao tác vốn không lặp lại được.</p></details>
<pre>POST /orders                    → 201 Created
                                  Location: /orders/9f3c-...
                                  { "id": "9f3c-...", ... }        server owns the ID

PUT  /orders/9f3c-...           → 200 OK (updated) or 201 Created (upsert)
     { full representation }      client must send EVERY field — omissions mean "clear it"

PATCH /orders/9f3c-...          → 200 OK
     { "note": "gift wrap" }      only what changed</pre>
<table>
<tr><th>Question</th><th>POST</th><th>PUT</th><th>PATCH</th></tr>
<tr><td>Who chooses the URI?</td><td>Server</td><td>Client</td><td>Client (already exists)</td></tr>
<tr><td>Idempotent?</td><td>No (unless you add a key)</td><td>Yes</td><td>Only if designed to be</td></tr>
<tr><td>Payload</td><td>Whatever creation needs</td><td>Complete representation</td><td>Delta only</td></tr>
<tr><td>Can it create?</td><td>Yes — its main job</td><td>Yes (upsert), if you allow it</td><td>Should not (404 if missing)</td></tr>
<tr><td>Success status</td><td>201 + Location, or 200/202</td><td>200 / 204, 201 on create</td><td>200 / 204</td></tr>
</table>
<p><strong>The trap almost everyone falls into:</strong> treating PUT like PATCH. If a client sends <code>{"name":"Ann"}</code> to PUT and your handler only updates <code>name</code>, you have written a PATCH and called it PUT — and the day a client legitimately omits a field to clear it, the behaviour is wrong and undocumented. Either implement true replacement semantics (missing field ⇒ null/default) or expose PATCH.</p>
<div class="key-point">Strong answer includes the client-generated-ID case: <em>"If the client can mint the identifier — a UUID from the mobile app — I prefer PUT, because it turns a create into an idempotent operation and the retry problem disappears entirely without needing an idempotency key."</em></div>`,
      },
      {
        q: 'Which HTTP status codes do you actually use? Walk through the ones people get wrong.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A senior answer is not a recital of all sixty codes — it is a short, defensible set plus clarity on the pairs people confuse. The set I actually use is 200, 201, 202, 204 for success; 301/302/304 for redirection and caching; 400, 401, 403, 404, 405, 409, 412, 415, 422, 429 for client errors; and 500, 502, 503, 504 for server errors. The distinctions worth knowing cold are these: 401 means "I do not know who you are" and must carry a <code>WWW-Authenticate</code> header, while 403 means "I know exactly who you are and you still may not"; 400 means the request is malformed and could not be parsed, while 422 means it parsed fine but failed business or semantic validation; and 409 signals a conflict with current state, such as a duplicate or a concurrent edit, whereas 412 is specifically a failed precondition you sent in a header. The rule underneath all of it is that the status code is for machines — proxies, retry logic, monitoring — and the body is for humans, so returning 200 with an error field inside is not a style choice, it breaks every layer that reads status codes.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Không cần thuộc hết sáu mươi mã. Cần dùng đúng khoảng mười lăm mã và giải thích được mấy cặp hay nhầm.</p><p>Danh sách tôi thật sự dùng — <strong>thành công:</strong> 200 (OK), 201 (đã tạo), 202 (đã nhận, đang xử lý), 204 (OK nhưng không có body). <strong>Lỗi phía client:</strong> 400, 401, 403, 404, 405, 409, 412, 415, 422, 429. <strong>Lỗi phía server:</strong> 500, 502, 503, 504.</p><p><strong>401 và 403.</strong> 401 là "tôi không biết bạn là ai" — thiếu token hoặc token hết hạn, và response bắt buộc phải kèm header <code>WWW-Authenticate</code>. 403 là "tôi biết rõ bạn là ai rồi, nhưng bạn không có quyền".</p><p><strong>400 và 422.</strong> 400 là request sai cú pháp, server đọc không hiểu — JSON hỏng, thiếu field bắt buộc, chỗ cần số thì đưa chuỗi. 422 là đọc hiểu rồi nhưng dữ liệu không hợp lệ về mặt nghiệp vụ — số tiền vượt số dư, ngày kết thúc trước ngày bắt đầu.</p><p><strong>409 và 412.</strong> 409 là xung đột với trạng thái hiện tại — email đã tồn tại, đơn đã giao rồi nên không huỷ được. 412 dành riêng cho trường hợp điều kiện bạn gửi trong header (như <code>If-Match</code>) không khớp.</p><p>Nguyên tắc chung: <strong>status code là để cho máy đọc</strong> (proxy, cơ chế retry, hệ thống giám sát), <strong>còn body là để cho người đọc</strong>. Nên kiểu trả về <code>200 OK</code> rồi nhét <code>{"success": false}</code> vào body là sai. Nó làm hỏng mọi công cụ dựa vào status code: monitoring sẽ báo hệ thống khoẻ mạnh trong khi thực tế đang lỗi 100%.</p></details>
<table>
<tr><th>Code</th><th>Meaning</th><th>Use it when</th></tr>
<tr><td><strong>200 OK</strong></td><td>Success with a body</td><td>GET, or PUT/PATCH that returns the updated resource</td></tr>
<tr><td><strong>201 Created</strong></td><td>Resource created</td><td>POST — must include <code>Location</code></td></tr>
<tr><td><strong>202 Accepted</strong></td><td>Queued, not done</td><td>Async work — return a status URL</td></tr>
<tr><td><strong>204 No Content</strong></td><td>Success, empty body</td><td>DELETE, or updates where the client needs nothing back</td></tr>
<tr><td><strong>304 Not Modified</strong></td><td>Your cached copy is still valid</td><td>Conditional GET with ETag / If-Modified-Since</td></tr>
<tr><td><strong>400 Bad Request</strong></td><td>Malformed / unparseable</td><td>Broken JSON, wrong type, missing required param</td></tr>
<tr><td><strong>401 Unauthorized</strong></td><td>Not authenticated (misnamed)</td><td>Missing/expired/invalid token — send <code>WWW-Authenticate</code></td></tr>
<tr><td><strong>403 Forbidden</strong></td><td>Authenticated but not allowed</td><td>Wrong role, wrong tenant, disabled feature</td></tr>
<tr><td><strong>404 Not Found</strong></td><td>No such resource</td><td>Also used deliberately to hide existence from unauthorised callers</td></tr>
<tr><td><strong>405 Method Not Allowed</strong></td><td>Wrong verb for this URI</td><td>Must include an <code>Allow</code> header</td></tr>
<tr><td><strong>409 Conflict</strong></td><td>Clashes with current state</td><td>Duplicate email, version conflict, illegal state transition</td></tr>
<tr><td><strong>412 Precondition Failed</strong></td><td>If-Match / If-Unmodified-Since failed</td><td>Optimistic concurrency control</td></tr>
<tr><td><strong>415 Unsupported Media Type</strong></td><td>Wrong Content-Type</td><td>XML sent to a JSON-only endpoint</td></tr>
<tr><td><strong>422 Unprocessable</strong></td><td>Syntactically valid, semantically wrong</td><td>Business rule violation, field-level validation</td></tr>
<tr><td><strong>429 Too Many Requests</strong></td><td>Rate limited</td><td>Must include <code>Retry-After</code></td></tr>
<tr><td><strong>500 / 502 / 503 / 504</strong></td><td>Server fault / bad upstream / down / upstream timeout</td><td>Never leak a stack trace; 503 should carry <code>Retry-After</code></td></tr>
</table>
<p><strong>The three arguments you should be ready for:</strong></p>
<ul>
<li><strong>400 vs 422</strong> — some teams use 400 for everything client-side and put the detail in the body. That is defensible; what is not defensible is using them inconsistently across endpoints. Pick one convention and write it down.</li>
<li><strong>404 vs 403</strong> — returning 403 tells an attacker the resource exists. For multi-tenant systems, returning 404 for "exists but not yours" is the safer default.</li>
<li><strong>200 with <code>{"success": false}</code></strong> — breaks caching, breaks client retry logic, breaks dashboards that alert on 5xx rate, and hides failures from every proxy in the path.</li>
</ul>
<div class="key-point">Two lines that read as senior: <em>"401 is authentication, 403 is authorisation — I remember it as 'who are you' versus 'you may not'."</em> and <em>"The status code is the machine-readable contract; the body is the human-readable detail. Anything that forces a client to parse the body to learn whether it succeeded is a design bug."</em></div>`,
      },
      {
        q: 'How do you design a consistent error response? What is RFC 7807 / problem+json?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>An error response has three audiences — the calling code, the developer debugging at 2am, and the end user — and a good format serves all three without conflating them. RFC 7807 (updated by RFC 9457) standardises this as <code>application/problem+json</code> with a small set of fields: <code>type</code>, a URI identifying the error class; <code>title</code>, a short human summary; <code>status</code>, mirroring the HTTP code; <code>detail</code>, the specifics of this occurrence; and <code>instance</code>, which points at the occurrence itself. On top of that I always add two things: a stable machine-readable error code the client can branch on, because a client should never string-match on <code>title</code>, and a correlation ID that maps straight to the request in the logs, so support can jump from a user's screenshot to the exact trace. The two failure modes to avoid are leaking internals — stack traces, SQL, upstream hostnames — and inventing a different error shape per service, which forces every client to write bespoke parsing.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một response lỗi có ba người đọc: đoạn code đang gọi API, lập trình viên đang debug lúc 2 giờ sáng, và người dùng cuối. Format tốt phải phục vụ được cả ba mà không trộn lẫn vào nhau.</p><p>RFC 7807 (nay được thay bằng RFC 9457) chuẩn hoá việc này với content type <code>application/problem+json</code> và một nhóm field nhỏ: <code>type</code> là URI định danh loại lỗi, <code>title</code> là câu mô tả ngắn cho người đọc, <code>status</code> lặp lại mã HTTP, <code>detail</code> là chi tiết của đúng lần lỗi này, <code>instance</code> trỏ tới chính lần xảy ra lỗi.</p><p>Ngoài chuẩn ra, tôi luôn thêm hai thứ.</p><p><strong>Một mã lỗi cố định cho máy đọc</strong>, ví dụ <code>INSUFFICIENT_BALANCE</code>. Client rẽ nhánh theo mã này. Tuyệt đối đừng để client so khớp chuỗi trong <code>title</code>, vì chỉ cần sửa một chữ trong câu thông báo là code phía client gãy ngay.</p><p><strong>Một correlation ID</strong> trùng với ID trong log. Người dùng gửi ảnh chụp màn hình lên, bộ phận hỗ trợ copy ID đó, tra ra đúng request trong log. Không có nó thì mò log rất khổ.</p><p>Hai lỗi phải tránh: để lộ stack trace, câu SQL hay tên server nội bộ ra ngoài — vừa lộ thông tin cho kẻ tấn công vừa chẳng giúp gì cho client. Và mỗi service tự chế một format lỗi khác nhau, khiến client phải viết code bóc tách riêng cho từng service.</p></details>
<pre>HTTP/1.1 422 Unprocessable Entity
Content-Type: application/problem+json

{
  "type":     "https://api.acme.com/errors/insufficient-funds",
  "title":    "Insufficient funds",
  "status":   422,
  "detail":   "Account 4711 has a balance of 30.00 EUR; 120.00 EUR was requested.",
  "instance": "/accounts/4711/transfers/8f2c",
  "code":     "INSUFFICIENT_FUNDS",          // stable, machine-readable — client branches on this
  "traceId":  "0af7651916cd43dd8448eb211c80319c",
  "errors": [                                 // field-level detail for form validation
    { "field": "amount", "code": "EXCEEDS_BALANCE", "message": "Amount exceeds available balance" }
  ]
}</pre>
<table>
<tr><th>Field</th><th>Audience</th><th>Rule</th></tr>
<tr><td><code>status</code> / HTTP code</td><td>Proxies, retry logic, monitoring</td><td>Must be accurate — this is what triggers alerts and retries</td></tr>
<tr><td><code>code</code></td><td>Client code</td><td>Stable forever; never reworded; part of the API contract</td></tr>
<tr><td><code>title</code> / <code>detail</code></td><td>Developer</td><td>May be reworded freely; never parsed by clients</td></tr>
<tr><td><code>errors[]</code></td><td>UI form binding</td><td>Field path + code so the UI can highlight the right input</td></tr>
<tr><td><code>traceId</code></td><td>Support &amp; ops</td><td>Same value as the log/trace correlation ID</td></tr>
</table>
<p><strong>Rules I enforce in review:</strong></p>
<ul>
<li><strong>One error shape for the whole platform</strong> — put it in a shared library or the gateway, not in each service.</li>
<li><strong>Never leak internals</strong> — no stack traces, no SQL, no upstream URLs. Log those; return the trace ID instead.</li>
<li><strong>Return all validation errors at once</strong>, not the first one — otherwise the user fixes fields one round-trip at a time.</li>
<li><strong>Do not localise in the API</strong> unless it is a requirement; ship codes and let the client render the language.</li>
<li><strong>Distinguish retryable from terminal</strong> — the client needs to know whether backing off will help; 429/503 with <code>Retry-After</code> says yes, 422 says no.</li>
</ul>
<div class="key-point">The line that shows you have supported a real API: <em>"Every error carries a trace ID that appears in our logs and traces, so a user can send a screenshot and we can find the exact request. That single field has saved more debugging time than any dashboard."</em></div>`,
      },
      // ──── 2. IDEMPOTENCY & RELIABILITY ────
      {
        q: 'How do you make POST idempotent? Design an idempotency-key mechanism end to end.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The problem is that a client can never distinguish "my request never arrived" from "it arrived, succeeded, and the response was lost", so on a timeout it has only two bad options: retry and risk a duplicate, or give up and risk a lost order. The industry answer, used by Stripe and most payment APIs, is an idempotency key: the client generates a unique key per logical operation, sends it in a header, and the server guarantees that the first request with that key executes and every subsequent one returns the original result rather than executing again. The implementation detail that separates a working design from a broken one is that you must record the key <em>in the same transaction</em> as the business effect — a unique constraint on the key column does this for you — otherwise two concurrent retries both pass the "have I seen this key?" check and both execute. You also need to store the response, define a TTL, and decide what happens when the same key arrives with a different payload, which should be a 422 because it almost always means a client bug.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Vấn đề gốc: khi request bị timeout, client không có cách nào biết được là "request chưa tới server" hay "đã tới, đã xử lý xong, chỉ có response bị mất trên đường về". Nó chỉ còn hai lựa chọn, cái nào cũng dở — gửi lại thì có thể trừ tiền hai lần, không gửi lại thì có thể mất đơn hàng.</p><p>Cách giải quyết mà cả ngành đang dùng (Stripe và hầu hết API thanh toán đều vậy) là <strong>idempotency key</strong>. Client tự sinh một khoá duy nhất cho mỗi thao tác nghiệp vụ và gửi kèm trong header. Server cam kết: request đầu tiên mang khoá đó thì xử lý bình thường, mọi request sau mang cùng khoá đó thì trả lại đúng kết quả cũ chứ không chạy lại.</p><p>Chi tiết quan trọng nhất, cũng là chỗ mọi người hay làm sai: <strong>phải lưu khoá trong cùng một transaction với thao tác nghiệp vụ, và đặt unique constraint trên cột chứa khoá.</strong></p><p>Nếu bạn viết kiểu "kiểm tra khoá đã tồn tại chưa → nếu chưa thì xử lý → rồi lưu khoá", thì hai request retry chạy song song sẽ cùng vượt qua bước kiểm tra và cùng trừ tiền. Unique constraint để database tự chặn giúp bạn, không cần khoá thủ công.</p><p>Còn vài thứ nữa cần quyết: lưu lại response để trả về cho những lần gọi sau, đặt thời hạn sống cho khoá (thường 24 giờ), và xử lý trường hợp cùng một khoá nhưng payload lại khác — nên trả 422, vì gần như chắc chắn client đang có bug.</p></details>
<pre>POST /payments
Idempotency-Key: 7d3f1a9c-8b21-4c07-9f6e-11ab33cc44dd
Content-Type: application/json

{ "amount": 5000, "currency": "EUR", "orderId": "A-9912" }</pre>
<pre>Server flow
───────────
1. Read Idempotency-Key. Missing on a money-moving endpoint? → 400.
2. BEGIN TRANSACTION
3. INSERT INTO idempotency_keys (key, request_hash, status)
        VALUES (?, ?, 'IN_PROGRESS')            ← unique index on the key column
   ├─ unique violation → someone else has this key:
   │     status = COMPLETED  → return the stored response (200/201 + same body)
   │     status = IN_PROGRESS→ 409 Conflict "request already in flight, retry shortly"
   └─ inserted OK → we own this execution
4. Execute the business logic (create payment, debit account, ...)
5. UPDATE idempotency_keys SET status='COMPLETED', response_body=?, response_status=?
6. COMMIT            ← business effect + key record commit atomically
7. Return the response</pre>
<table>
<tr><th>Decision</th><th>Recommendation</th><th>Why</th></tr>
<tr><td>Who generates the key?</td><td>The client, one per logical operation (not per HTTP attempt)</td><td>All retries of the same intent must share a key</td></tr>
<tr><td>Key format</td><td>UUIDv4 / ULID</td><td>Collision-free without coordination</td></tr>
<tr><td>Scope</td><td>Per API key / tenant + endpoint</td><td>Prevents one tenant's key from colliding with another's</td></tr>
<tr><td>Retention (TTL)</td><td>24h–7 days</td><td>Longer than any realistic client retry window; then purge</td></tr>
<tr><td>Same key, different payload</td><td>422 with a clear code</td><td>Client bug — silently returning the old response hides it</td></tr>
<tr><td>Storage</td><td>Same DB as the business data</td><td>Redis is faster but cannot join the transaction — the atomic commit is the whole point</td></tr>
</table>
<p><strong>Alternatives worth mentioning:</strong> a natural business key with a unique constraint (one payment per <code>orderId</code>) is simpler and often enough; client-generated resource IDs with PUT sidestep the problem entirely; and a <code>POST</code> that first reserves a token via <code>POST /payments/intents</code> turns the create into a two-phase, idempotent flow. Reach for the generic idempotency key when none of those fit.</p>
<div class="key-point">The detail interviewers listen for: <em>"The key insert and the business write must commit in the same transaction, protected by a unique index — otherwise two concurrent retries both read 'not seen' and both execute. Everything else about idempotency keys is bookkeeping; that one point is the correctness argument."</em></div>`,
      },
      {
        q: 'A client times out on your API. What should it do, and what must your API guarantee?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A timeout is the most ambiguous outcome in distributed systems, because the request may have fully succeeded — so the client's rule has to be that it may only retry operations that are safe to repeat. That means retry GET, PUT, DELETE and any POST carrying an idempotency key, with exponential backoff plus jitter and a bounded number of attempts; never blind-retry a bare POST. On the server side there are three obligations. First, honour idempotency so that a retry is genuinely free. Second, make sure your own timeouts are shorter than your callers' — if the client gives up after 3 seconds and you keep working for 30, you are burning capacity on results nobody will read, and worse, doing work the client is simultaneously retrying. Third, shed load honestly under pressure with 429 or 503 plus <code>Retry-After</code>, rather than letting queues grow until everything times out. The failure mode this all prevents is the retry storm: every client retrying a struggling service simultaneously, which turns a slowdown into an outage.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Timeout là kết quả mơ hồ nhất trong hệ thống phân tán, vì request đó rất có thể đã xử lý xong rồi. Nên nguyên tắc phía client là: <strong>chỉ retry những thao tác lặp lại không gây hại</strong>.</p><p>Cụ thể là được retry GET, PUT, DELETE, và POST có kèm idempotency key. Retry phải có backoff tăng dần cộng thêm jitter (một khoảng ngẫu nhiên nhỏ, để các client không cùng gửi lại đúng một lúc), và phải giới hạn số lần thử. Tuyệt đối đừng retry mù một POST không có idempotency key.</p><p>Phía server có ba việc phải làm.</p><p><strong>Một, hỗ trợ idempotency thật sự</strong>, để việc client retry không gây hậu quả.</p><p><strong>Hai, đặt timeout của mình ngắn hơn timeout của bên gọi.</strong> Nếu client bỏ cuộc sau 3 giây mà server vẫn cặm cụi chạy tiếp 30 giây, thì bạn đang đốt tài nguyên cho một kết quả không ai nhận — trong khi client đã gửi request mới rồi.</p><p><strong>Ba, khi quá tải thì từ chối bớt request</strong> bằng 429 hoặc 503 kèm header <code>Retry-After</code>, thay vì để hàng đợi phình ra cho đến khi mọi thứ cùng timeout.</p><p>Tất cả những điều trên nhằm ngăn "bão retry": service đang chậm, mọi client cùng lúc gửi lại, tải tăng gấp đôi gấp ba, và một sự cố chậm biến thành sập hoàn toàn.</p></details>
<pre>Client retry policy
───────────────────
attempt 1 → fail → wait 200ms  ± jitter
attempt 2 → fail → wait 400ms  ± jitter
attempt 3 → fail → wait 800ms  ± jitter
attempt 4 → give up, surface the error, open the circuit breaker

Retry only:  GET, HEAD, PUT, DELETE, OPTIONS
             POST *with* an Idempotency-Key
             408, 429, 502, 503, 504  (and network errors)
Never retry: 400, 401, 403, 404, 409, 422 — the answer will not change</pre>
<table>
<tr><th>Mechanism</th><th>Purpose</th><th>Getting it wrong</th></tr>
<tr><td><strong>Exponential backoff</strong></td><td>Give the server room to recover</td><td>Fixed-interval retries hammer a degraded service</td></tr>
<tr><td><strong>Jitter</strong></td><td>De-synchronise clients</td><td>Without it, every client retries at the same millisecond — thundering herd</td></tr>
<tr><td><strong>Retry budget / cap</strong></td><td>Bound the amplification</td><td>3 retries at 3 hops deep = 27× load on the innermost service</td></tr>
<tr><td><strong>Circuit breaker</strong></td><td>Stop calling a service that is clearly down</td><td>Without it, every request waits the full timeout and threads pile up</td></tr>
<tr><td><strong>Timeout hierarchy</strong></td><td>Inner timeout &lt; outer timeout</td><td>Inverted timeouts create orphaned work and duplicate execution</td></tr>
<tr><td><strong>Load shedding</strong></td><td>Fail fast when the queue is deep</td><td>Accepting everything means everyone times out instead of some succeeding</td></tr>
</table>
<p><strong>Retry amplification, the number that surprises people:</strong></p>
<pre>Gateway → Service A → Service B → Database
   3×    ×    3×     ×    3×     =  27 database calls for one user request

Mitigation: retry at ONE layer (usually the edge-most that can), or use a
retry budget ("no more than 10% of traffic may be retries").</pre>
<div class="key-point">What separates a senior answer: <em>"Retries are a shared-fate mechanism. I set a retry budget and make sure timeouts decrease as you go inward, because uncoordinated retries at every hop turn a slow dependency into a full outage — the retries themselves become the load that keeps it down."</em></div>`,
      },
      {
        q: 'How do you expose a long-running operation over REST without holding the connection open?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>You do not block; you turn the operation into a resource. The client POSTs the request, you validate it, enqueue the work and immediately return <strong>202 Accepted</strong> with a <code>Location</code> header pointing at a job or operation resource. The client then polls that resource with GET, which returns a status — pending, running, succeeded, failed — plus progress if you have it, and on completion either the result inline or a link to the created resource. This keeps every request short, which matters because open connections consume threads, gateways impose 30–60 second limits, and any load balancer in the path will eventually cut you off anyway. The refinements worth mentioning are <code>Retry-After</code> on the polling response so clients do not hammer you, webhooks or SSE as a push alternative for clients that can receive them, and making the job resource itself idempotent-friendly so that resubmitting the same request returns the existing job rather than starting a second one.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Đừng giữ kết nối chờ. Hãy biến thao tác đó thành một tài nguyên.</p><p>Luồng như sau: client gửi POST, bạn kiểm tra dữ liệu hợp lệ, đẩy việc vào queue, rồi trả về ngay <strong>202 Accepted</strong> kèm header <code>Location</code> trỏ tới một tài nguyên dạng job. Sau đó client gọi GET vào job đó để xem trạng thái — đang chờ, đang chạy, xong, hay thất bại — kèm phần trăm tiến độ nếu bạn có. Khi xong thì trả kết quả luôn, hoặc trả link tới tài nguyên vừa tạo.</p><p>Cách này giữ cho mọi request đều ngắn. Điều đó quan trọng vì kết nối mở thì chiếm thread của server, API gateway thường cắt ở 30–60 giây, và kiểu gì cũng có một load balancer nào đó trên đường ngắt kết nối của bạn.</p><p>Vài chi tiết nên làm thêm: trả <code>Retry-After</code> trong response trạng thái để client biết bao lâu nữa hỏi lại, đừng để nó hỏi liên tục mỗi 100ms. Dùng webhook hoặc SSE để đẩy kết quả về cho những client hỗ trợ. Và làm cho việc tạo job có idempotency, để client gửi lại đúng yêu cầu cũ thì nhận lại job đang chạy chứ không tạo thêm job thứ hai.</p></details>
<pre>1. POST /reports
   Idempotency-Key: 41c2-...
   { "type": "YEAR_END", "year": 2025 }

   → 202 Accepted
     Location: /jobs/8f21c
     Retry-After: 5
     { "jobId": "8f21c", "status": "PENDING" }

2. GET /jobs/8f21c
   → 200 { "jobId":"8f21c", "status":"RUNNING", "progress":0.42 }
     Retry-After: 5

3. GET /jobs/8f21c
   → 200 { "jobId":"8f21c", "status":"SUCCEEDED",
           "result": { "reportId": "R-77" },
           "_links": { "report": "/reports/R-77" } }

   or → 303 See Other, Location: /reports/R-77     (redirect style)

   on failure → 200 { "status":"FAILED", "error": { "code":"SOURCE_UNAVAILABLE", ... } }
   ⚠️ the JOB fetch succeeded, so the HTTP status is 200 — the failure lives in the body</pre>
<table>
<tr><th>Notification style</th><th>Good for</th><th>Cost</th></tr>
<tr><td><strong>Polling</strong> (GET the job)</td><td>Any client, firewalls, simplicity</td><td>Wasted requests; needs <code>Retry-After</code> and backoff</td></tr>
<tr><td><strong>Webhook</strong> (server calls back)</td><td>Server-to-server, long jobs</td><td>Client needs a public endpoint, retries, signature verification</td></tr>
<tr><td><strong>SSE / WebSocket</strong></td><td>Live progress in a UI</td><td>Stateful connections, harder to scale and load-balance</td></tr>
<tr><td><strong>Long polling</strong></td><td>Near-real-time without WebSocket</td><td>Holds connections; watch gateway timeouts</td></tr>
</table>
<p><strong>Design details people forget:</strong></p>
<ul>
<li><strong>Job resources need a lifecycle</strong> — retention policy, and a defined status for "expired/purged".</li>
<li><strong>Validate synchronously, execute asynchronously</strong> — a request that is obviously invalid should get 400 immediately, not a job that fails 10 minutes later.</li>
<li><strong>Support cancellation</strong> — <code>DELETE /jobs/{id}</code> or <code>POST /jobs/{id}/cancellations</code>.</li>
<li><strong>A failed job is still a successful GET</strong> — do not return 500 when the job status resource is served correctly.</li>
</ul>
<div class="key-point">Frame it as resource design, not as a workaround: <em>"The operation itself becomes a first-class resource with its own URI and lifecycle. That gives me status, progress, cancellation and retention for free, and it keeps every HTTP request short enough to survive gateways and load balancers."</em></div>`,
      },
      // ──── 3. VERSIONING & EVOLUTION ────
      {
        q: 'How do you version a REST API? Compare URI, header, and media-type versioning.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>There are three mainstream options and each trades purity against operability. <strong>URI versioning</strong> — <code>/v1/orders</code> — is theoretically impure because the same resource now has two identities, but it is visible in logs, trivially routable at the gateway, cacheable, and testable from a browser, which is why almost every large public API uses it. <strong>Header versioning</strong> with a custom header keeps URIs clean, but it is invisible in access logs, easy to forget, and requires cache keys to vary on the header. <strong>Media-type versioning</strong> — <code>Accept: application/vnd.acme.order.v2+json</code> — is the most RESTful because the URI still identifies the resource and only the representation changes, but it is the most awkward for clients and tooling. My actual recommendation is URI versioning for the major version, combined with a hard discipline that you almost never cut a new version: version bumps are expensive because you must run both in parallel, so the real skill is evolving additively so that v1 lasts for years.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Có ba cách, mỗi cách đánh đổi giữa "đúng chuẩn REST" và "dễ vận hành".</p><p><strong>Version trong URL</strong> — <code>/v1/orders</code>. Về lý thuyết là sai chuẩn, vì cùng một tài nguyên mà có hai địa chỉ khác nhau. Nhưng đổi lại: nhìn log là biết ngay client đang gọi version nào, cấu hình routing trên gateway rất dễ, cache được, và mở trình duyệt gõ URL là thử được. Đó là lý do gần như mọi API công khai lớn đều dùng cách này.</p><p><strong>Version bằng header riêng</strong> — giữ URL sạch sẽ, nhưng không nhìn thấy trong access log, client rất dễ quên gửi, và cache phải phân biệt thêm theo header đó.</p><p><strong>Version bằng media type</strong> — <code>Accept: application/vnd.acme.order.v2+json</code>. Đúng tinh thần REST nhất vì URL không đổi, chỉ phần biểu diễn đổi. Nhưng cũng phiền phức nhất cho cả client lẫn công cụ.</p><p>Khuyến nghị của tôi: dùng version trong URL cho major version, nhưng kèm một kỷ luật rất nghiêm là <strong>gần như không bao giờ tăng major version</strong>. Lên v2 rất đắt vì bạn phải chạy song song cả v1 lẫn v2 trong nhiều năm. Kỹ năng thật sự nằm ở chỗ thiết kế sao cho mọi thay đổi đều là "chỉ thêm, không sửa, không xoá", để v1 sống được lâu nhất có thể.</p></details>
<table>
<tr><th>Approach</th><th>Example</th><th>Pros</th><th>Cons</th></tr>
<tr><td><strong>URI path</strong></td><td><code>GET /v1/orders/7</code></td><td>Visible, routable, cacheable, browser-testable, obvious in logs</td><td>Same resource, two URIs; clients must rewrite paths to upgrade</td></tr>
<tr><td><strong>Custom header</strong></td><td><code>X-API-Version: 2</code></td><td>Clean URIs; can default to latest or to the client's pinned version</td><td>Invisible in logs/CDN by default; needs <code>Vary</code>; easy to omit</td></tr>
<tr><td><strong>Media type</strong></td><td><code>Accept: application/vnd.acme.v2+json</code></td><td>Most RESTful; per-resource granularity</td><td>Verbose; poor tooling support; confuses many clients</td></tr>
<tr><td><strong>Query param</strong></td><td><code>?version=2</code></td><td>Trivial to add</td><td>Pollutes the cache key; often stripped by proxies; discouraged</td></tr>
<tr><td><strong>Date-based</strong> (Stripe)</td><td><code>Stripe-Version: 2024-06-20</code></td><td>Every client pinned to the day it integrated; server upgrades transparently</td><td>Requires a full request/response transformation layer — expensive to build</td></tr>
</table>
<p><strong>The rule that matters more than the mechanism — additive change:</strong></p>
<pre>SAFE (no version bump)                    BREAKING (needs a version)
──────────────────────                    ──────────────────────────
add a new optional field                  remove or rename a field
add a new endpoint                        change a field's type or format
add a new optional query param            add a new required request field
add a new enum value*                     tighten validation
relax validation                          change a status code's meaning
                                          change default sort/paging behaviour
                                          change the meaning of an existing field

* only safe if clients were told to ignore unknown values — say so in the docs from day one</pre>
<div class="key-point">Say the expensive part out loud: <em>"The cost of a version is not designing v2, it is operating v1 and v2 side by side — double the tests, double the bugs, and a migration you have to chase customers through. So I design for additive evolution and treat a version bump as a last resort with a published sunset date."</em></div>`,
      },
      {
        q: 'How do you deprecate and remove an API version without breaking clients?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Deprecation is a communication and measurement problem far more than a technical one, and the sequence matters. First you announce, with a concrete sunset date and a migration guide showing old and new side by side. Then you make the deprecation machine-visible: the <code>Deprecation</code> header, a <code>Sunset</code> header with the removal date, and a <code>Link</code> header pointing at the documentation, so a client can detect it automatically instead of relying on someone reading an email. Then — and this is the step teams skip — you instrument per-consumer usage, because you cannot remove anything until you know exactly who is still calling it; without that you are guessing, and you will either break someone or never remove anything. As the date approaches, contact the remaining callers directly, and consider brownout testing where the old version returns errors for short scheduled windows, which surfaces forgotten integrations far more effectively than another email. Only then do you remove it, returning 410 Gone rather than 404 so the failure is unambiguous.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Đây là bài toán về giao tiếp và số liệu nhiều hơn là bài toán kỹ thuật, và thứ tự các bước rất quan trọng.</p><p><strong>Bước 1 — thông báo</strong>, kèm ngày ngừng phục vụ cụ thể và một hướng dẫn chuyển đổi đặt cái cũ với cái mới cạnh nhau.</p><p><strong>Bước 2 — đưa thông báo đó vào chính response để máy đọc được</strong>: header <code>Deprecation</code>, header <code>Sunset</code> ghi ngày gỡ bỏ, và header <code>Link</code> trỏ tới tài liệu. Như vậy client tự phát hiện ra, thay vì trông chờ có người đọc email.</p><p><strong>Bước 3 — đo lượng dùng theo từng khách hàng.</strong> Đây là bước nhiều đội bỏ qua. Bạn không thể gỡ thứ mà bạn không biết chính xác ai còn đang gọi. Thiếu số liệu này thì bạn chỉ đang đoán, và kết cục hoặc là làm gãy hệ thống của ai đó, hoặc là không bao giờ dám gỡ.</p><p><strong>Bước 4 — khi gần tới ngày hẹn, liên hệ trực tiếp từng khách hàng còn lại.</strong> Cân nhắc làm "brownout": cho version cũ trả lỗi trong vài khung giờ ngắn đã báo trước. Cách này lôi ra được những tích hợp bị bỏ quên hiệu quả hơn hẳn việc gửi thêm một cái email nữa.</p><p><strong>Bước 5 — gỡ, và trả về 410 Gone thay vì 404</strong>, để client biết rõ là "đã từng có, giờ bỏ rồi" chứ không phải "gõ sai URL".</p></details>
<pre>HTTP/1.1 200 OK
Deprecation: Sun, 01 Mar 2026 00:00:00 GMT     ← this endpoint is deprecated
Sunset: Wed, 01 Jul 2026 00:00:00 GMT          ← it will stop working on this date
Link: &lt;https://docs.acme.com/migrate/v1-to-v2&gt;; rel="deprecation"
Warning: 299 - "GET /v1/orders is deprecated; use /v2/orders"</pre>
<table>
<tr><th>Phase</th><th>Action</th><th>Duration (typical)</th></tr>
<tr><td><strong>1. Announce</strong></td><td>Changelog, email, docs banner, migration guide with examples</td><td>Day 0</td></tr>
<tr><td><strong>2. Signal</strong></td><td><code>Deprecation</code> / <code>Sunset</code> / <code>Link</code> headers on every response</td><td>Immediately</td></tr>
<tr><td><strong>3. Measure</strong></td><td>Per-client-ID usage dashboard for the deprecated version</td><td>Continuous</td></tr>
<tr><td><strong>4. Nudge</strong></td><td>Direct outreach to remaining callers; in-console warnings</td><td>3–6 months</td></tr>
<tr><td><strong>5. Brownout</strong></td><td>Scheduled short windows returning 410; announce them in advance</td><td>2–4 weeks before</td></tr>
<tr><td><strong>6. Remove</strong></td><td>Return <strong>410 Gone</strong> with a body pointing to the new version</td><td>Sunset date</td></tr>
</table>
<p><strong>410 Gone, not 404</strong> — 404 says "maybe you typed it wrong", 410 says "this existed and was intentionally removed". Include the migration link in the body so the developer who hits it in production has the answer immediately.</p>
<p><strong>What to do about the client who will not migrate:</strong> that is a commercial decision, not an engineering one. Options are extending the sunset for that customer only via a feature flag, charging for extended support, or holding the line. What you must not do is quietly extend for everyone — that teaches every consumer that your sunset dates are fiction, and the next deprecation becomes impossible.</p>
<div class="key-point">The measurable part is the senior part: <em>"I do not remove anything I cannot measure. Per-consumer usage metrics on the deprecated version turn 'I hope nobody is using this' into a list of names I can contact — that is the difference between a deprecation that finishes and one that drags on for years."</em></div>`,
      },
      {
        q: 'Your API returns a field that a mobile client depends on, and you need to change its type. What do you do?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The trap in this question is the mobile part: unlike a web client you cannot ship a fix and have every user on it tomorrow — old app versions live in the wild for years, and some users never update. So changing the type in place is off the table regardless of how careful your rollout is. The pattern is expand and contract: add a new field with the new type alongside the old one, populate both during a transition period, move new clients to the new field, measure who is still reading the old one, and only remove it when that number reaches zero or the app version is out of support. If the two fields cannot coexist coherently — say the semantics changed, not just the type — then you version the resource representation rather than the field. It is also worth saying plainly that this situation is usually a symptom: it means the API is exposing an internal model directly, so the fix going forward is a response DTO that decouples the wire format from the database schema.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Cái bẫy nằm ở chữ "mobile". Với web thì bạn deploy một phát là sáng mai ai cũng chạy bản mới. Với mobile thì không: các phiên bản app cũ tồn tại ngoài đời hàng năm trời, và luôn có những người không bao giờ cập nhật.</p><p>Nên <strong>đổi kiểu dữ liệu ngay tại chỗ là phương án loại ngay</strong>, dù bạn deploy cẩn thận tới đâu.</p><p>Cách đúng là "thêm rồi mới bỏ" (expand and contract), theo đúng thứ tự:</p><p><strong>1.</strong> Thêm field mới với kiểu mới, để song song với field cũ — ví dụ giữ <code>amount</code> kiểu số và thêm <code>amountDecimal</code> kiểu chuỗi. <strong>2.</strong> Trong giai đoạn chuyển tiếp, ghi dữ liệu vào cả hai field. <strong>3.</strong> Cho client mới đọc field mới. <strong>4.</strong> Đo xem còn bao nhiêu request đang đọc field cũ. <strong>5.</strong> Chỉ xoá field cũ khi con số đó về 0, hoặc khi phiên bản app đó đã hết hạn hỗ trợ.</p><p>Nếu hai field không thể cùng tồn tại một cách hợp lý — ví dụ ý nghĩa đã đổi chứ không chỉ đổi kiểu — thì đánh version cho cả response thay vì cho từng field.</p><p>Cũng nên nói thẳng: tình huống này thường là triệu chứng của việc API đang phơi thẳng cấu trúc database ra ngoài. Cách chữa lâu dài là thêm một lớp DTO cho response, để đổi cột trong database không kéo theo đổi API.</p></details>
<pre>Expand → migrate → contract
───────────────────────────
Phase 1  ADD, do not change
  { "amount": 1000,              // old: integer cents  (KEEP)
    "amountDecimal": "10.00" }   // new: decimal string (ADD)

Phase 2  MIGRATE
  - new app versions read amountDecimal
  - docs mark 'amount' deprecated with a Sunset date
  - log/metric every response served to a client that still parses 'amount'
    (track by client-id + app-version header)

Phase 3  CONTRACT
  - usage of 'amount' by supported app versions = 0
  - remove the field in the next major version, or after the app version EOLs</pre>
<table>
<tr><th>Situation</th><th>Right move</th></tr>
<tr><td>Type change, same meaning</td><td>New field alongside; dual-write; deprecate the old</td></tr>
<tr><td>Meaning changed too</td><td>New field with a <em>new name</em> — never reuse a name with new semantics</td></tr>
<tr><td>Field must be removed for legal/PII reasons</td><td>Coordinate a hard cut with a forced app upgrade; there is no graceful path</td></tr>
<tr><td>Dozens of such changes accumulating</td><td>Cut a new major version and run both, rather than a hundred zombie fields</td></tr>
<tr><td>Internal consumers only</td><td>Same pattern, but the timeline is weeks rather than quarters</td></tr>
</table>
<p><strong>Practices that prevent the next occurrence:</strong></p>
<ul>
<li><strong>Never serialise entities directly</strong> — a response DTO means a schema refactor does not become an API break.</li>
<li><strong>Tell clients to ignore unknown fields</strong> from day one, in writing, so additive change is genuinely safe.</li>
<li><strong>Require a client identifier and app version header</strong> — without it you cannot measure who is affected, and every deprecation becomes a guess.</li>
<li><strong>Contract tests in CI</strong> so a breaking change fails the build rather than production.</li>
</ul>
<div class="key-point">Lead with the constraint, not the technique: <em>"Old mobile builds never go away, so any change has to be additive and reversible. Add the new field, dual-write, measure real usage by app version, and only then remove — and if I cannot measure usage, I do not remove."</em></div>`,
      },
      // ──── 4. COLLECTIONS: PAGINATION, FILTERING, PAYLOADS ────
      {
        q: 'Offset pagination vs cursor pagination — which do you choose and why?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Offset pagination is the obvious one — <code>?page=3&amp;size=20</code> maps to <code>LIMIT 20 OFFSET 40</code> — and it is fine for small, stable datasets where users want to jump to page 47. It has two serious problems at scale. The first is performance: the database must walk and discard every skipped row, so <code>OFFSET 500000</code> gets slower the deeper you go, and a deep-page scan on a large table can take seconds. The second is correctness under concurrent writes: if a row is inserted while the user pages, rows shift and they see a duplicate; if one is deleted, they silently skip a record. Cursor pagination fixes both by remembering <em>where</em> you were rather than <em>how many</em> you skipped — the query becomes <code>WHERE (created_at, id) &lt; (:lastCreatedAt, :lastId) ORDER BY created_at DESC, id DESC LIMIT 20</code>, which uses the index directly and stays fast at any depth. The price is that you lose random page access and total counts become expensive, which is exactly why infinite-scroll feeds use cursors and admin tables with page numbers still use offsets.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Offset là cách hiển nhiên nhất: <code>?page=3&amp;size=20</code> dịch thẳng ra <code>LIMIT 20 OFFSET 40</code>. Nó vẫn tốt với dữ liệu nhỏ, ít thay đổi, và khi người dùng cần nhảy thẳng tới trang 47.</p><p>Nhưng ở quy mô lớn nó có hai vấn đề.</p><p><strong>Vấn đề hiệu năng.</strong> Database vẫn phải đọc rồi vứt bỏ toàn bộ số dòng bị bỏ qua. <code>OFFSET 500000</code> nghĩa là đọc 500 nghìn dòng rồi bỏ đi để lấy 20 dòng. Càng đi sâu càng chậm, và một trang sâu trên bảng lớn có thể mất vài giây.</p><p><strong>Vấn đề dữ liệu bị sai.</strong> Nếu có bản ghi mới được thêm vào trong lúc người dùng đang lật trang, các dòng bị đẩy dịch xuống và họ sẽ thấy lại một bản ghi đã xem ở trang trước. Ngược lại nếu có bản ghi bị xoá, họ sẽ bỏ sót một bản ghi mà không hề biết.</p><p>Cursor giải quyết cả hai bằng cách ghi nhớ <em>đang đứng ở đâu</em> thay vì <em>đã bỏ qua bao nhiêu dòng</em>. Query trở thành <code>WHERE (created_at, id) &lt; (:lastCreatedAt, :lastId) ORDER BY created_at DESC, id DESC LIMIT 20</code>. Nó dùng thẳng index nên tốc độ ổn định dù đang ở trang thứ 1 hay trang thứ 10.000.</p><p>Cái giá phải trả: không nhảy được tới trang bất kỳ, và đếm tổng số bản ghi trở nên tốn kém. Đó là lý do các app kiểu newsfeed cuộn vô tận đều dùng cursor, còn màn hình quản trị có đánh số trang 1-2-3 thì vẫn dùng offset.</p></details>
<pre>OFFSET                                    CURSOR (keyset)
──────                                    ───────────────
GET /orders?page=3&amp;size=20                GET /orders?limit=20&amp;after=eyJ0IjoiMjAy...

SELECT * FROM orders                      SELECT * FROM orders
ORDER BY created_at DESC                  WHERE (created_at, id) &lt; (?, ?)
LIMIT 20 OFFSET 40;                       ORDER BY created_at DESC, id DESC
                                          LIMIT 20;
  ↳ scans 60 rows, returns 20               ↳ index seek, returns 20 — constant cost
  ↳ page 25000 → scans 500 020 rows         ↳ page 25000 → same cost as page 1</pre>
<table>
<tr><th></th><th>Offset</th><th>Cursor / keyset</th></tr>
<tr><td>Deep-page performance</td><td>Degrades linearly</td><td>Constant</td></tr>
<tr><td>Stable under inserts/deletes</td><td>❌ duplicates and skips</td><td>✅</td></tr>
<tr><td>Jump to page N</td><td>✅</td><td>❌ sequential only</td></tr>
<tr><td>Total count</td><td>Natural (but <code>COUNT(*)</code> is its own cost)</td><td>Expensive / usually omitted</td></tr>
<tr><td>Bidirectional</td><td>✅</td><td>✅ if you support <code>before</code> as well as <code>after</code></td></tr>
<tr><td>Good fit</td><td>Admin grids, small stable data</td><td>Feeds, exports, event streams, large tables</td></tr>
</table>
<p><strong>Cursor design rules:</strong></p>
<ul>
<li><strong>Sort must be deterministic</strong> — always include a unique tiebreaker (the primary key). Sorting by <code>created_at</code> alone breaks when two rows share a timestamp.</li>
<li><strong>The cursor must be opaque</strong> — base64 the sort tuple. If clients can read it, they will construct it, and you can never change the sort key again.</li>
<li><strong>Encode the sort direction and filters in the cursor</strong>, or validate that they have not changed between calls.</li>
<li><strong>Always cap <code>limit</code></strong> — a client asking for 1 000 000 rows should get the maximum, not an outage.</li>
</ul>
<pre>{
  "data": [ ... 20 items ... ],
  "pageInfo": {
    "hasNextPage": true,
    "endCursor": "eyJjcmVhdGVkQXQiOiIyMDI2LTAxLTA5VDA4OjMwOjAwWiIsImlkIjoiOTkxMiJ9"
  }
}
Link: &lt;/orders?limit=20&amp;after=eyJj...&gt;; rel="next"</pre>
<div class="key-point">Name the failure, not just the technique: <em>"Offset pagination is not only slow at depth, it is incorrect under concurrent writes — users see duplicates or silently miss rows. For anything append-heavy I use keyset pagination with an opaque cursor over a deterministic sort key, and I keep offsets only where the product genuinely needs page numbers."</em></div>`,
      },
      {
        q: 'How do you design filtering, sorting and sparse fieldsets without inventing a query language?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The tension here is between client flexibility and server safety: a fully generic query language gives clients everything they want and gives you unbounded, unindexable queries you cannot optimise or cache. My approach is to keep the surface deliberately small and explicit — a whitelist of filterable fields as simple query parameters, a <code>sort</code> parameter restricted to indexed columns with a leading minus for descending, and <code>fields</code> for sparse fieldsets when payload size genuinely matters. Every one of those has to be validated against an allowlist, both because an unindexed sort on a large table is an outage waiting to happen and because passing user input into a query builder is how injection and denial-of-service bugs get in. When clients genuinely need arbitrary querying — analytics, reporting, a search page with a dozen optional facets — that is a signal to use a dedicated search endpoint backed by Elasticsearch, or to expose GraphQL for that slice, rather than to slowly grow a homegrown filter DSL that nobody can validate or index.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mâu thuẫn ở đây là: client muốn linh hoạt, còn server cần an toàn. Nếu bạn cho client một ngôn ngữ truy vấn tự do, bạn sẽ nhận về những câu query không giới hạn, không dùng được index, không tối ưu nổi và không cache được.</p><p>Cách của tôi là giữ bề mặt thật nhỏ và tường minh.</p><p><strong>Lọc:</strong> chỉ cho phép một danh sách field cố định, khai báo dưới dạng query param đơn giản — <code>?status=OPEN&amp;customerId=42</code>.</p><p><strong>Sắp xếp:</strong> một tham số <code>sort</code>, chỉ chấp nhận những cột đã có index, thêm dấu trừ ở đầu để sắp giảm dần — <code>?sort=-createdAt</code>.</p><p><strong>Chọn field:</strong> tham số <code>fields</code> để client lấy ít dữ liệu hơn, dùng khi kích thước response thật sự là vấn đề.</p><p>Mọi giá trị đều phải đối chiếu với danh sách cho phép, vì hai lý do. Một, sắp xếp theo cột không có index trên bảng lớn là công thức tạo sự cố. Hai, nhét thẳng chuỗi người dùng gửi lên vào câu query chính là cửa ngõ của SQL injection.</p><p>Còn khi client thật sự cần truy vấn tự do — làm báo cáo, phân tích, hay màn hình tìm kiếm có hàng chục bộ lọc — thì đó là tín hiệu nên tách ra một endpoint tìm kiếm riêng chạy trên Elasticsearch, hoặc mở GraphQL cho đúng phần đó. Đừng nuôi dần một cái "ngôn ngữ lọc" tự chế, vì cuối cùng nó sẽ thành thứ không ai kiểm soát nổi và không index được.</p></details>
<pre>GET /orders
    ?status=OPEN,PENDING          filter — multi-value with a comma
    &amp;createdAt[gte]=2026-01-01    range operators, explicitly supported set
    &amp;customerId=4711
    &amp;sort=-createdAt,id           minus = descending; multi-key
    &amp;fields=id,status,total       sparse fieldset — smaller payloads
    &amp;limit=50&amp;after=eyJ...        pagination</pre>
<table>
<tr><th>Concern</th><th>Rule</th><th>Why</th></tr>
<tr><td><strong>Filterable fields</strong></td><td>Explicit allowlist per endpoint</td><td>Anything else risks a full table scan; also documents itself</td></tr>
<tr><td><strong>Sortable fields</strong></td><td>Only indexed columns; cap the number of sort keys</td><td>An unindexed sort on 50M rows will time out or take the DB down</td></tr>
<tr><td><strong>Operators</strong></td><td>Fixed set: eq, ne, gt, gte, lt, lte, in, like-prefix</td><td>Bounded semantics you can translate safely and index for</td></tr>
<tr><td><strong>Free-text search</strong></td><td>Separate <code>q=</code> param routed to a search engine</td><td><code>LIKE '%term%'</code> cannot use a B-tree index</td></tr>
<tr><td><strong>Sparse fieldsets</strong></td><td>Support, but never let them change the response shape structurally</td><td>Clients that expect a field to exist should get null, not a missing key path</td></tr>
<tr><td><strong>Unknown parameter</strong></td><td>400, do not ignore silently</td><td>A typo in <code>satus=OPEN</code> silently returning everything is a data leak class of bug</td></tr>
</table>
<p><strong>Three levels of ambition — pick deliberately:</strong></p>
<ol>
<li><strong>Fixed parameters</strong> (<code>?status=OPEN</code>) — simplest, fully indexable, covers 90% of real needs.</li>
<li><strong>Bounded operator syntax</strong> (<code>?createdAt[gte]=…</code>, or RSQL/OData subset) — flexible, still validatable.</li>
<li><strong>Full query language / GraphQL / search endpoint</strong> — real power, but now you own query cost control, depth limits and caching.</li>
</ol>
<div class="key-point">The safety argument is the senior one: <em>"Every filterable and sortable field is an allowlist entry backed by an index. I would rather tell a client 'that filter is not supported yet' than ship a parameter that lets any caller table-scan a 50-million-row table."</em></div>`,
      },
      {
        q: 'How does HTTP caching work — Cache-Control, ETag, Last-Modified — and how do you use it in an API?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>HTTP gives you two complementary mechanisms and it is worth being precise about which does what. <strong>Freshness</strong>, driven by <code>Cache-Control: max-age</code>, means the client or CDN may serve the cached copy with no network call at all — this is the one that actually saves latency and load. <strong>Validation</strong>, driven by <code>ETag</code> and <code>If-None-Match</code> (or <code>Last-Modified</code> and <code>If-Modified-Since</code>), still costs a round trip but lets the server answer 304 Not Modified with no body, which saves bandwidth and serialisation. For a typical API I use short max-age plus <code>stale-while-revalidate</code> on genuinely public, slow-changing data, and ETags almost everywhere else, because they also give me optimistic concurrency for free on writes. The two mistakes I look for in review are caching personalised responses without <code>Cache-Control: private</code> or a proper <code>Vary</code> header — which leaks one user's data to another through a shared cache — and generating ETags by hashing a payload that contains a timestamp, which makes every ETag unique and quietly disables validation entirely.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>HTTP cho bạn hai cơ chế, và nên phân biệt rõ cái nào làm việc gì.</p><p><strong>Cache theo thời hạn (freshness)</strong>, điều khiển bằng <code>Cache-Control: max-age</code>. Trong khoảng thời gian đó, trình duyệt hoặc CDN dùng luôn bản đã lưu, không gọi mạng. Đây mới là thứ thật sự giảm độ trễ và giảm tải.</p><p><strong>Kiểm tra lại (revalidation)</strong>, điều khiển bằng <code>ETag</code> + <code>If-None-Match</code>, hoặc <code>Last-Modified</code> + <code>If-Modified-Since</code>. Vẫn tốn một vòng gọi mạng, nhưng nếu dữ liệu chưa đổi thì server trả 304 không kèm body — tiết kiệm băng thông và công sức chuyển dữ liệu thành JSON.</p><p>Với API thông thường tôi làm thế này: dùng <code>max-age</code> ngắn kèm <code>stale-while-revalidate</code> cho dữ liệu công khai và ít thay đổi. Còn lại thì dùng ETag, vì tiện thể nó cho tôi luôn cơ chế chống ghi đè khi cập nhật mà không tốn thêm gì.</p><p>Hai lỗi tôi luôn soi khi review code:</p><p><strong>Cache response có dữ liệu cá nhân mà quên <code>Cache-Control: private</code> hoặc quên khai báo <code>Vary</code>.</strong> Hậu quả là dữ liệu của người này lọt sang người kia qua cache dùng chung. Lỗi này rất nặng.</p><p><strong>Sinh ETag bằng cách băm toàn bộ response mà trong đó có chứa thời gian hiện tại.</strong> Thế thì lần nào ETag cũng khác, cache không bao giờ trúng, và không ai phát hiện ra vì hệ thống vẫn chạy đúng — chỉ là chậm.</p></details>
<pre>First request
GET /products/42
→ 200 OK
  Cache-Control: public, max-age=60, stale-while-revalidate=300
  ETag: "a3f2b91"
  Last-Modified: Tue, 06 Jan 2026 10:00:00 GMT
  { ...body... }

Within 60s        → cache serves it directly. No network call at all.
After 60s
GET /products/42
  If-None-Match: "a3f2b91"
→ 304 Not Modified          ← no body; client reuses its copy
  ETag: "a3f2b91"
  Cache-Control: public, max-age=60</pre>
<table>
<tr><th>Directive</th><th>Meaning</th></tr>
<tr><td><code>public</code></td><td>Any cache (CDN, proxy) may store it</td></tr>
<tr><td><code>private</code></td><td>Only the end client — mandatory for anything user-specific</td></tr>
<tr><td><code>no-cache</code></td><td>May store, but must revalidate before every use (not "do not cache")</td></tr>
<tr><td><code>no-store</code></td><td>Never write to disk or memory — for tokens, PII, financial detail</td></tr>
<tr><td><code>max-age=N</code></td><td>Fresh for N seconds</td></tr>
<tr><td><code>s-maxage=N</code></td><td>Overrides max-age for shared caches only</td></tr>
<tr><td><code>stale-while-revalidate=N</code></td><td>Serve stale instantly while refreshing in the background — big latency win</td></tr>
<tr><td><code>must-revalidate</code></td><td>Never serve stale, even if the origin is unreachable</td></tr>
<tr><td><code>Vary: Accept, Accept-Language, Authorization</code></td><td>Split the cache key — omitting <code>Authorization</code> here is a classic data-leak bug</td></tr>
</table>
<p><strong>ETag: strong vs weak</strong></p>
<pre>ETag: "a3f2b91"     strong  — byte-identical representation; usable for If-Match (concurrency)
ETag: W/"a3f2b91"   weak    — semantically equivalent; validation only, not concurrency</pre>
<p><strong>Practical rules:</strong></p>
<ul>
<li><strong>Derive the ETag from data, not from the serialised response</strong> — a version column or a hash of the entity's fields. Hashing a body containing <code>generatedAt</code> makes it useless.</li>
<li><strong>Personalised response ⇒ <code>private</code> plus <code>Vary: Authorization</code></strong>, or do not cache it at all.</li>
<li><strong>Never cache 5xx</strong>; cache 404 only very briefly, if at all.</li>
<li><strong>Invalidation is the hard part</strong> — prefer short TTLs plus validation over long TTLs plus purge logic, unless you control the CDN purge API and test it.</li>
<li><strong>Only GET/HEAD are meaningfully cacheable</strong> in practice; a write must invalidate the affected resource's cached entry.</li>
</ul>
<div class="key-point">The line that shows real experience: <em>"304 saves bandwidth, but max-age saves the round trip — those are different wins and I choose deliberately. And the moment a response depends on who is asking, it is <code>private</code> with <code>Vary: Authorization</code>, because a shared cache serving one user's data to another is the worst bug this area produces."</em></div>`,
      },
      {
        q: 'Two clients update the same resource at once. How do you prevent the lost update?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The lost update is the case where both clients read version 1, both modify different fields, both write, and the second write silently erases the first — nobody sees an error, and the data is simply wrong. Over HTTP the standard solution is optimistic concurrency using conditional requests: the GET returns an <code>ETag</code>, and the client sends it back on the write as <code>If-Match</code>. The server compares it against the current version, proceeds if they match, and returns <strong>412 Precondition Failed</strong> if they do not, at which point the client re-reads and either retries or shows the user a conflict. This is optimistic because it assumes conflicts are rare, which is nearly always true for user-facing edits, and it scales far better than pessimistic locking, which holds a lock across a user's think time and creates deadlocks and abandoned locks the moment someone closes a browser tab. The important operational detail is that the version check and the write must be atomic — implemented as <code>UPDATE ... WHERE id = ? AND version = ?</code> and checking the affected row count, not as a read-then-write in application code, which reopens the exact race you were trying to close.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mất cập nhật là tình huống: hai người cùng mở một bản ghi, mỗi người sửa một field khác nhau, rồi cùng bấm lưu. Người lưu sau ghi đè mất thay đổi của người lưu trước. Không có lỗi nào hiện ra cả — chỉ đơn giản là dữ liệu sai.</p><p>Trên HTTP, cách giải quyết chuẩn là optimistic locking bằng conditional request:</p><p><strong>1.</strong> GET trả về header <code>ETag</code> chứa phiên bản hiện tại. <strong>2.</strong> Khi cập nhật, client gửi lại đúng giá trị đó trong header <code>If-Match</code>. <strong>3.</strong> Server so với phiên bản hiện tại — khớp thì cho ghi, không khớp thì trả <strong>412 Precondition Failed</strong>. <strong>4.</strong> Client nhận 412 thì load lại dữ liệu mới, rồi hoặc thử lại hoặc hiện màn hình xung đột cho người dùng chọn.</p><p>Gọi là "optimistic" (lạc quan) vì nó giả định xung đột hiếm khi xảy ra — điều gần như luôn đúng khi người dùng sửa dữ liệu. Nó tốt hơn pessimistic locking (khoá bản ghi ngay khi mở form), vì khoá kiểu đó phải giữ suốt thời gian người dùng ngồi nghĩ, dễ gây deadlock, và khoá sẽ bị kẹt lại nếu người ta đóng tab trình duyệt giữa chừng.</p><p>Chi tiết quan trọng khi cài đặt: <strong>việc kiểm tra phiên bản và việc ghi phải nằm trong cùng một câu lệnh.</strong> Tức là <code>UPDATE ... WHERE id = ? AND version = ?</code> rồi xem có bao nhiêu dòng bị ảnh hưởng — 0 dòng nghĩa là xung đột. Đừng viết kiểu "SELECT ra kiểm tra version, nếu đúng thì UPDATE" trong code ứng dụng, vì giữa hai câu lệnh đó vẫn còn nguyên cái khe hở mà bạn đang cố bịt.</p></details>
<pre>The bug
───────
t0  Client A: GET /orders/7  → { total: 100, note: "" }   ETag "v1"
t1  Client B: GET /orders/7  → { total: 100, note: "" }   ETag "v1"
t2  Client A: PUT  { total: 150, note: "" }               → saved
t3  Client B: PUT  { total: 100, note: "gift" }           → saved, total back to 100
                                                            A's change is gone, silently

The fix
───────
t3  Client B: PUT /orders/7
              If-Match: "v1"
    → 412 Precondition Failed   (current ETag is "v2")
    B re-reads, merges, retries with If-Match: "v2"</pre>
<pre>-- Atomic check-and-set. The WHERE clause IS the lock.
UPDATE orders
   SET total = ?, note = ?, version = version + 1
 WHERE id = ? AND version = ?;
-- rows affected = 0  →  someone else won  →  return 412</pre>
<table>
<tr><th></th><th>Optimistic (ETag / version)</th><th>Pessimistic (SELECT FOR UPDATE)</th></tr>
<tr><td>Lock held</td><td>None — detects conflict at write time</td><td>From read until commit</td></tr>
<tr><td>Fits user think-time</td><td>✅ — the "lock" spans no time at all</td><td>❌ — a lock across a UI form is a bug</td></tr>
<tr><td>Under high contention</td><td>Retry storms; throughput drops</td><td>Serialises correctly, but queues</td></tr>
<tr><td>Failure mode</td><td>412 → client resolves</td><td>Deadlock, lock timeout, abandoned locks</td></tr>
<tr><td>Use when</td><td>Web/mobile edits, REST APIs — the default</td><td>Short server-side critical sections, inventory decrement, ledger writes</td></tr>
</table>
<p><strong>Related headers worth knowing:</strong> <code>If-Match: *</code> means "only if it exists" (a safe update-only), <code>If-None-Match: *</code> means "only if it does not exist" (a safe create-only, which makes PUT a race-free create), and <code>If-Unmodified-Since</code> is the timestamp-based equivalent of <code>If-Match</code> with second-level granularity — good enough for slow-changing data, not for anything that can change twice in one second.</p>
<p><strong>What to do on 412 is a product decision:</strong> auto-merge when the changed fields do not overlap, retry automatically for machine clients, or show the user a diff. Silently overwriting is the one option that is always wrong.</p>
<div class="key-point">The implementation detail is the tell: <em>"The version comparison has to happen inside the UPDATE's WHERE clause and I check the affected row count — if I compare versions in application code and then write, I have just recreated the race with extra steps."</em></div>`,
      },
      {
        q: 'Your API is chatty — the mobile app makes 30 calls to render one screen. What are your options?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>First I would diagnose rather than jump to a fix, because "30 calls" usually has one of three causes: an N+1 pattern where the client fetches a list and then one call per item, an over-normalised API that mirrors database tables instead of use cases, or a screen that genuinely aggregates many unrelated domains. For the N+1 case the fix is embedding or expansion — let the client ask for <code>?expand=customer,items</code> or return the child data inline when it is always needed. For the over-normalised case the answer is a purpose-built endpoint for that screen, which feels unRESTful and is absolutely the right call on a mobile network where each round trip costs 100–300ms. For genuine aggregation across domains, that is what a backend-for-frontend is: a thin service that fans out server-side over fast internal links and returns one response. What I would resist is adding a generic batch endpoint as the first move, because it usually preserves the underlying design problem while adding partial-failure semantics that clients then have to handle.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Trước khi sửa, tôi sẽ tìm nguyên nhân. Con số "30 lần gọi" thường đến từ một trong ba lý do.</p><p><strong>Lỗi N+1.</strong> Client lấy danh sách 20 đơn hàng, rồi gọi thêm 20 lần để lấy thông tin khách hàng của từng đơn. Cách chữa là cho phép nhúng dữ liệu con vào — <code>?expand=customer,items</code> — hoặc trả luôn nếu client lúc nào cũng cần.</p><p><strong>API bị chia quá nhỏ</strong>, phản chiếu y hệt các bảng trong database thay vì phản ánh nhu cầu của màn hình. Cách chữa là làm hẳn một endpoint riêng cho màn hình đó. Nghe có vẻ trái tinh thần REST nhưng hoàn toàn hợp lý trên mạng di động, nơi mỗi vòng gọi mạng tốn 100–300ms — 30 lần gọi là 3 đến 9 giây chỉ để mở một màn hình.</p><p><strong>Màn hình thật sự cần dữ liệu từ nhiều hệ thống khác nhau.</strong> Đây chính là lý do có Backend-for-Frontend: một service mỏng, nhận một request từ mobile, gọi song song vào các service bên trong qua mạng nội bộ tốc độ cao, rồi gộp lại trả về một response duy nhất.</p><p>Thứ tôi sẽ phản đối là dựng ngay một endpoint gộp kiểu "gửi cho tôi danh sách những gì bạn cần" làm nước đi đầu tiên. Nó không giải quyết vấn đề thiết kế gốc, lại thêm chuyện thất bại một phần — 2 trong 5 lời gọi bên trong bị lỗi thì trả về cái gì? — và đẩy phần xử lý đó sang cho client.</p></details>
<table>
<tr><th>Option</th><th>How</th><th>Trade-off</th></tr>
<tr><td><strong>Embedding / expansion</strong></td><td><code>GET /orders/7?expand=customer,items</code></td><td>Cheap, incremental, keeps one resource model. Watch response size and cache fragmentation</td></tr>
<tr><td><strong>Sparse fieldsets</strong></td><td><code>?fields=id,status,total</code></td><td>Cuts payload, not round trips — combine with expansion</td></tr>
<tr><td><strong>Purpose-built endpoint</strong></td><td><code>GET /screens/order-detail/7</code></td><td>One call, perfect shape. Couples API to UI — needs a version story per client</td></tr>
<tr><td><strong>BFF</strong></td><td>A service per client type doing server-side fan-out</td><td>Best for multi-client (web/iOS/Android). Another deployable to own</td></tr>
<tr><td><strong>GraphQL</strong></td><td>Client declares the shape it needs</td><td>Solves over/under-fetching structurally. You now own query cost, depth limits, caching, N+1 at the resolver layer</td></tr>
<tr><td><strong>Batch endpoint</strong></td><td><code>POST /batch</code> with a list of sub-requests</td><td>Generic, but partial failures, mixed status codes, and no HTTP caching</td></tr>
<tr><td><strong>HTTP/2 or HTTP/3</strong></td><td>Multiplexing over one connection</td><td>Removes connection overhead, not latency-per-request or server work</td></tr>
</table>
<pre>Before                                  After (expansion)
──────                                  ─────────────────
GET /orders/7            → order        GET /orders/7?expand=customer,items,items.product
GET /customers/12        → customer       → one response, one round trip
GET /orders/7/items      → 8 items
GET /products/{id}  × 8  → products     Depth and expandable fields must be an
                                        allowlist — otherwise a client can request
= 11 round trips × ~200ms = 2.2s        an expansion tree that scans your whole DB.</pre>
<p><strong>How I would sequence it in practice:</strong> measure which screens are slow and why; fix the N+1s with expansion first because it is the cheapest change; introduce a BFF only if you have several client types with genuinely divergent needs; and treat GraphQL as an architectural commitment rather than a performance patch, because you inherit a whole new class of problems around query cost, caching and authorisation per field.</p>
<div class="key-point">Diagnose before prescribing: <em>"Thirty calls is a symptom. If it is N+1 I add expansion; if the API mirrors tables instead of use cases I add a screen-shaped endpoint; if it spans domains I build a BFF. Reaching for GraphQL or a batch endpoint without knowing which one it is usually keeps the problem and adds complexity."</em></div>`,
      },
      // ──── 5. SECURITY ────
      {
        q: 'How do you secure a REST API? Walk through authentication and authorisation choices.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>I separate the two questions deliberately, because conflating them is where most real vulnerabilities come from. <strong>Authentication</strong> is establishing who is calling, and the choice depends on the caller: OAuth2 with OIDC for user-facing flows, client-credentials for service-to-service, mTLS inside a mesh, and API keys only for low-risk server integrations — never for anything running in a browser or a mobile app, where a key is not a secret. <strong>Authorisation</strong> is deciding whether that caller may perform this action on this specific object, and the part teams get wrong is the last clause. Role checks at the endpoint level — "is this user an admin?" — are easy and are only half the job; the missing half is the object-level check that the requested record actually belongs to this user or tenant, and its absence is the single most common API vulnerability in the wild. On top of that I would expect TLS everywhere with HSTS, validation of every input against a schema, rate limiting per identity rather than per IP, and no secrets in URLs, because query strings end up in access logs, browser history and referrer headers.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Tôi luôn tách rạch ròi hai câu hỏi, vì gộp chúng lại chính là nơi phần lớn lỗ hổng thật sự sinh ra.</p><p><strong>Authentication — bạn là ai?</strong> Chọn theo bên gọi: OAuth2 kèm OIDC cho luồng có người dùng đăng nhập; client credentials cho service gọi service; mTLS khi chạy trong service mesh. API key thì chỉ dùng cho tích hợp phía server, ít rủi ro — tuyệt đối không dùng cho thứ gì chạy trong trình duyệt hay app mobile, vì ở đó key không còn là bí mật nữa, ai cũng mở DevTools hoặc dịch ngược app ra xem được.</p><p><strong>Authorization — bạn có được làm việc này không?</strong> Có hai tầng, và mọi người thường chỉ làm tầng đầu.</p><p><strong>Tầng endpoint:</strong> "người này có phải admin không?" Dễ làm, ai cũng nhớ làm.</p><p><strong>Tầng đối tượng:</strong> "bản ghi số 123 này có đúng là của người này không?" Đây mới là chỗ hay bị quên, và thiếu nó chính là lỗ hổng API phổ biến nhất ngoài đời thực — người dùng chỉ cần đổi <code>/orders/123</code> thành <code>/orders/124</code> là xem được đơn hàng của người khác.</p><p>Ngoài ra: TLS ở mọi nơi kèm HSTS; validate mọi input theo schema; giới hạn tần suất theo danh tính chứ không theo IP; và không bao giờ đặt token hay mật khẩu trong URL, vì query string sẽ nằm lại trong access log, lịch sử trình duyệt và header referrer.</p></details>
<table>
<tr><th>Caller</th><th>Mechanism</th><th>Notes</th></tr>
<tr><td><strong>Browser SPA</strong></td><td>OAuth2 Authorization Code + PKCE</td><td>Tokens in memory or httpOnly cookie; never localStorage if XSS is a concern</td></tr>
<tr><td><strong>Mobile app</strong></td><td>OAuth2 + PKCE, refresh token in the OS keystore</td><td>The app is a public client — it holds no secret</td></tr>
<tr><td><strong>Service → service</strong></td><td>OAuth2 client credentials, or mTLS</td><td>Short-lived tokens; rotate automatically</td></tr>
<tr><td><strong>Partner / server integration</strong></td><td>API key + HMAC request signature</td><td>Sign method + path + body + timestamp to prevent replay</td></tr>
<tr><td><strong>Internal mesh</strong></td><td>mTLS + SPIFFE identity</td><td>Identity from the certificate, not from a header the caller controls</td></tr>
</table>
<p><strong>The OWASP API Top 10 issues I actively look for:</strong></p>
<ol>
<li><strong>Broken object-level authorisation (BOLA/IDOR)</strong> — <code>GET /invoices/1043</code> returns someone else's invoice. Every read <em>and</em> write must be scoped by owner or tenant in the query itself, not filtered afterwards.</li>
<li><strong>Broken function-level authorisation</strong> — an admin endpoint that is merely undocumented rather than protected.</li>
<li><strong>Excessive data exposure</strong> — returning the whole entity and letting the UI hide fields. The password hash, the internal risk score and the other tenant's ID travel over the wire regardless.</li>
<li><strong>Mass assignment</strong> — binding the request body straight onto an entity, letting a caller set <code>role: "ADMIN"</code> or <code>isVerified: true</code>.</li>
<li><strong>No rate limiting</strong> — enabling credential stuffing, enumeration and scraping.</li>
<li><strong>Unrestricted resource consumption</strong> — <code>?limit=1000000</code>, unbounded file upload, expansion depth with no cap.</li>
</ol>
<pre>❌ Repository.findById(id)                    then check ownership in code — leaks via timing/errors
✅ Repository.findByIdAndTenantId(id, ctx.tenantId)   ownership is part of the query

❌ @RequestBody User user; userRepo.save(user);       mass assignment
✅ @RequestBody UserUpdateDto dto;  map only allowed fields explicitly</pre>
<p><strong>Baseline hygiene:</strong> TLS 1.2+ only with HSTS; validate against a schema and reject unknown fields; no tokens or PII in query strings; CORS with an explicit origin allowlist, never a reflected origin with credentials; security headers at the gateway; and secrets from a vault, never from config committed to git.</p>
<div class="key-point">The one-liner that shows you have seen real breaches: <em>"Authentication is usually fine because a framework handles it. The bugs live in authorisation — specifically object-level authorisation. If ownership is not part of the database query, sooner or later someone reads a record that is not theirs."</em></div>`,
      },
      {
        q: 'JWT vs session tokens for an API. What are the real trade-offs, and how do you handle revocation?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The genuine difference is where the truth lives. A session token is a random opaque identifier and the server looks up the session on every request, which means revocation is instantaneous — delete the row and the token is dead — at the cost of a lookup, usually against Redis. A JWT is self-contained and signed, so any service can validate it with a public key and no shared store, which is what makes it attractive for microservices and horizontal scaling. The price is that you cannot un-issue it: until it expires, a stolen or revoked JWT remains valid, and every workaround — a denylist, short expiry with refresh tokens, a token version claim checked against the database — reintroduces exactly the central state that JWTs were supposed to eliminate. My default position is short-lived access tokens of five to fifteen minutes paired with a long-lived, revocable, rotating refresh token, which gives you stateless validation on the hot path and a real revocation point on the cold path. And for a single first-party web application with no cross-service needs, plain server sessions in a httpOnly cookie are simpler, safer and entirely respectable.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Khác biệt cốt lõi: <strong>dữ liệu về phiên đăng nhập được lưu ở đâu.</strong></p><p><strong>Session token</strong> chỉ là một chuỗi ngẫu nhiên vô nghĩa. Mỗi request server phải tra vào kho (thường là Redis) để biết đó là ai. Đổi lại, thu hồi tức thì: xoá bản ghi là token chết ngay. Cái giá là một lần tra cứu mỗi request.</p><p><strong>JWT</strong> thì tự chứa thông tin và được ký. Bất kỳ service nào cũng kiểm tra được bằng public key, không cần kho chung. Đó chính là điều làm nó hấp dẫn với kiến trúc microservice.</p><p>Nhưng JWT có một điểm yếu không tránh được: <strong>đã phát ra thì không rút lại được.</strong> Token bị đánh cắp vẫn dùng được cho tới khi hết hạn. Người dùng vừa bị khoá tài khoản vẫn gọi API bình thường cho tới khi token hết hạn. Và mọi cách chữa — blacklist, thêm claim đánh số phiên bản rồi đối chiếu database — đều kéo bạn quay lại đúng cái kho tập trung mà JWT định loại bỏ.</p><p>Lựa chọn mặc định của tôi: access token sống ngắn (5–15 phút) kèm refresh token sống lâu, thu hồi được và tự xoay vòng. Như vậy đường đi nóng vẫn kiểm tra token mà không cần tra database, còn khi cần khoá ai đó thì chỉ phải chờ tối đa 15 phút.</p><p>Còn với một web app nội bộ, một backend duy nhất, không cần chia sẻ đăng nhập với ai: dùng session lưu ở server kèm cookie httpOnly vẫn đơn giản hơn, an toàn hơn và hoàn toàn hợp lý. Đừng dùng JWT chỉ vì nó nghe hiện đại hơn.</p></details>
<table>
<tr><th></th><th>Opaque session token</th><th>JWT</th></tr>
<tr><td>Validation</td><td>Store lookup every request</td><td>Signature check, no I/O</td></tr>
<tr><td>Revocation</td><td>Immediate — delete the session</td><td>Not possible before expiry without extra state</td></tr>
<tr><td>Scaling</td><td>Needs a shared store (Redis)</td><td>Stateless; any service validates independently</td></tr>
<tr><td>Payload</td><td>Nothing — just an ID</td><td>Claims travel with the request (roles, tenant, scopes)</td></tr>
<tr><td>Size</td><td>~32 bytes</td><td>Hundreds of bytes to a few KB, on <em>every</em> request</td></tr>
<tr><td>Data freshness</td><td>Always current</td><td>Stale until refresh — a revoked role still works</td></tr>
<tr><td>Best fit</td><td>Single app, first-party, admin tooling</td><td>Microservices, third-party APIs, federated identity</td></tr>
</table>
<pre>The pattern that works in practice
──────────────────────────────────
Access token   JWT, 5–15 min,  sent as  Authorization: Bearer ...
               → validated by signature, no DB call on the hot path
Refresh token  opaque, long-lived, stored server-side, rotated on every use
               → revocable; reuse of a rotated token = theft signal → kill the family

Logout / ban / role change:
  - delete the refresh token   → user is out within one access-token lifetime
  - for immediate effect, add a short-TTL denylist keyed by jti, or a
    tokenVersion claim compared against the user record (accepting the lookup)</pre>
<p><strong>Implementation details that get flagged in review:</strong></p>
<ul>
<li><strong>Pin the algorithm server-side</strong> — never trust the token's <code>alg</code> header; <code>alg: none</code> and RS256→HS256 confusion are classic exploits.</li>
<li><strong>Validate <code>iss</code>, <code>aud</code>, <code>exp</code>, <code>nbf</code></strong> — a valid signature alone is not enough; a token minted for another service must be rejected.</li>
<li><strong>Never put anything secret in a JWT</strong> — it is signed, not encrypted; anyone can base64-decode it.</li>
<li><strong>Storage in the browser</strong> — httpOnly + Secure + SameSite cookies resist XSS; localStorage does not. If you use cookies, you must handle CSRF.</li>
<li><strong>Key rotation via JWKS</strong> with a <code>kid</code> header, so you can roll signing keys without downtime.</li>
</ul>
<div class="key-point">Refuse the false binary: <em>"JWTs do not remove state, they relocate it. The moment you need logout, ban, or an immediate permission change, the state comes back — so I use a short-lived JWT for stateless validation and a revocable rotating refresh token as the real control point."</em></div>`,
      },
      {
        q: 'How do you rate limit an API? Which algorithm, what scope, and what do you return?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Rate limiting exists to protect the service from any single caller, so the first decision is what you key on, and the answer is almost always the authenticated identity — API key, client ID or user ID — rather than the IP address, because corporate NAT and mobile carriers put thousands of legitimate users behind one IP while an attacker can rotate through a cloud provider's address space freely. The algorithm choice is a trade-off: fixed windows are trivial but allow a burst of double the limit across a window boundary; sliding windows fix that at higher cost; token bucket is what I usually pick because it allows a controlled burst while enforcing a sustained average, which matches how real clients behave. What the response looks like matters as much as the enforcement: return 429 with a <code>Retry-After</code> header and the <code>RateLimit</code> headers so a well-behaved client can self-throttle instead of hammering you, and make sure the limit rejection is cheap — enforced at the gateway or edge, not after you have already done the database work.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Rate limit tồn tại để bảo vệ service khỏi bất kỳ bên gọi nào — dù họ cố ý hay chỉ là có bug.</p><p>Quyết định đầu tiên là <strong>đếm theo cái gì</strong>. Câu trả lời gần như luôn là theo danh tính đã xác thực: API key, client ID hoặc user ID, chứ không phải theo IP. Lý do: mạng công ty và mạng 4G gom hàng nghìn người dùng thật vào chung một IP, nên chặn theo IP là chặn nhầm cả nghìn người. Còn kẻ tấn công thì đổi IP thoải mái, thuê vài chục IP từ nhà cung cấp cloud là xong.</p><p>Về thuật toán:</p><p><strong>Fixed window</strong> (cửa sổ cố định) đơn giản nhất, nhưng cho phép dồn gấp đôi hạn mức ngay chỗ giáp ranh — 100 request lúc 10:00:59 và 100 request nữa lúc 10:01:00.</p><p><strong>Sliding window</strong> (cửa sổ trượt) chữa được vấn đề trên nhưng tốn tài nguyên hơn.</p><p><strong>Token bucket</strong> là cái tôi thường chọn. Nó cho phép dồn một chút có kiểm soát, trong khi vẫn ép được mức trung bình dài hạn — đúng với cách client thật hoạt động.</p><p>Response cũng quan trọng ngang với việc chặn. Trả 429 kèm <code>Retry-After</code> và bộ header <code>RateLimit</code>, để một client tử tế biết đường tự giảm nhịp thay vì cứ dội request vào bạn liên tục.</p><p>Và việc từ chối phải rẻ. Chặn ngay ở gateway hoặc ở biên. Nếu bạn để request chạy vào tận database rồi mới trả 429 thì rate limit chẳng cứu được gì.</p></details>
<table>
<tr><th>Algorithm</th><th>How it works</th><th>Trade-off</th></tr>
<tr><td><strong>Fixed window</strong></td><td>Counter per minute, reset on the boundary</td><td>Simplest; allows 2× the limit across the boundary</td></tr>
<tr><td><strong>Sliding window log</strong></td><td>Store each request timestamp</td><td>Exact; memory grows with traffic</td></tr>
<tr><td><strong>Sliding window counter</strong></td><td>Weighted blend of current and previous window</td><td>Near-exact, cheap — a common production default</td></tr>
<tr><td><strong>Token bucket</strong></td><td>Tokens refill at a steady rate, up to a cap</td><td>Allows bursts, enforces average — usually the best fit</td></tr>
<tr><td><strong>Leaky bucket</strong></td><td>Queue drains at a constant rate</td><td>Smooths output completely; adds latency instead of rejecting</td></tr>
</table>
<pre>HTTP/1.1 429 Too Many Requests
Retry-After: 30
RateLimit-Limit: 1000
RateLimit-Remaining: 0
RateLimit-Reset: 30
Content-Type: application/problem+json

{ "type":"https://api.acme.com/errors/rate-limit",
  "title":"Rate limit exceeded",
  "status":429,
  "detail":"1000 requests per minute exceeded for client acme-prod.",
  "code":"RATE_LIMIT_EXCEEDED" }</pre>
<p><strong>Layered limits — one number is never enough:</strong></p>
<pre>Global        protect the service           100 000 req/min total  → shed load
Per client    fairness between tenants      1 000 req/min
Per endpoint  protect expensive operations  /reports: 10/min, /health: unlimited
Per user      stop credential stuffing      /login: 5 failures / 15 min, then lock
Per resource  stop enumeration              10 lookups/min on /users/{id}</pre>
<table>
<tr><th>Decision</th><th>Recommendation</th></tr>
<tr><td>Key on</td><td>Authenticated identity first; IP only for unauthenticated endpoints</td></tr>
<tr><td>Where enforced</td><td>Gateway or edge — rejecting after the DB work defeats the purpose</td></tr>
<tr><td>Distributed counter</td><td>Redis with an atomic INCR/Lua script; approximate local counters when latency matters</td></tr>
<tr><td>Cost weighting</td><td>Charge expensive endpoints more tokens than cheap ones</td></tr>
<tr><td>Rollout</td><td>Log-only mode first, look at real percentiles, then enforce</td></tr>
<tr><td>Internal callers</td><td>Still limit them — a retry loop in another team's service is the most likely cause of an incident</td></tr>
</table>
<div class="key-point">Two things interviewers listen for: keying on identity rather than IP, and <em>"I ship rate limits in observe-only mode first and look at the actual distribution — a limit set from a guess either does nothing or pages me at 3am because a legitimate batch job crossed it."</em></div>`,
      },
      {
        q: 'Explain CORS. Why does your browser call fail while curl works fine?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Because CORS is a browser policy, not a server security mechanism — curl simply does not implement it. The browser enforces the same-origin policy, meaning JavaScript on <code>app.acme.com</code> cannot read a response from <code>api.acme.com</code> unless that server explicitly opts in with <code>Access-Control-Allow-Origin</code>. For anything beyond a simple GET or form POST, the browser first sends an OPTIONS preflight asking whether the actual method and headers are permitted, and only sends the real request if the server approves. Two consequences trip people up constantly. First, the request may well have reached your server and executed — CORS blocks JavaScript from <em>reading</em> the response, it does not prevent the call, which is why a "blocked" POST can still have created a record. Second, if you send credentials, whether cookies or an Authorization header, you must set <code>Access-Control-Allow-Credentials: true</code> and you may not use the wildcard origin — you have to echo a specific, allowlisted origin. That last part is where the real security bug lives, because reflecting whatever <code>Origin</code> the caller sent while allowing credentials effectively hands any website the ability to make authenticated requests as your logged-in user.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Vì CORS là <strong>quy tắc của trình duyệt</strong>, không phải cơ chế bảo mật của server. Curl không cài đặt nó nên không bị ảnh hưởng.</p><p>Trình duyệt áp dụng same-origin policy: JavaScript chạy trên <code>app.acme.com</code> không được đọc response từ <code>api.acme.com</code>, trừ khi server đó chủ động cho phép bằng header <code>Access-Control-Allow-Origin</code>.</p><p>Với bất cứ thứ gì phức tạp hơn một GET đơn giản hoặc POST kiểu form, trình duyệt sẽ gửi trước một request OPTIONS (gọi là preflight) để hỏi xem method và các header sắp dùng có được phép không. Server đồng ý thì mới gửi request thật.</p><p>Có hai điều khiến mọi người vấp hoài.</p><p><strong>Thứ nhất: request rất có thể đã tới server của bạn và đã chạy rồi.</strong> CORS chỉ chặn JavaScript <em>đọc</em> response, chứ không ngăn cuộc gọi xảy ra. Đó là lý do một POST "bị CORS chặn" vẫn có thể đã tạo ra bản ghi trong database.</p><p><strong>Thứ hai, và đây mới là chỗ có lỗ hổng bảo mật thật.</strong> Nếu bạn gửi kèm cookie hoặc header Authorization thì bắt buộc phải đặt <code>Access-Control-Allow-Credentials: true</code>, và không được dùng dấu <code>*</code> cho origin — phải trả về đúng một origin cụ thể nằm trong danh sách cho phép.</p><p>Nếu bạn lười, viết code kiểu "lấy header <code>Origin</code> client gửi lên rồi trả ngược lại" mà vẫn cho phép credentials, thì bạn vừa cho phép <strong>mọi website trên đời</strong> gửi request có xác thực dưới danh nghĩa người dùng đang đăng nhập của bạn.</p></details>
<pre>Preflight (browser sends this automatically)
OPTIONS /orders
Origin: https://app.acme.com
Access-Control-Request-Method: PATCH
Access-Control-Request-Headers: authorization, content-type

Server must answer
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.acme.com     ← specific, from an allowlist
Access-Control-Allow-Methods: GET, POST, PATCH, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 600                            ← cache the preflight, saves a round trip
Vary: Origin                                           ← or your CDN serves one origin's answer to another</pre>
<table>
<tr><th>Symptom</th><th>Cause</th></tr>
<tr><td>Works in Postman/curl, fails in the browser</td><td>Normal — only browsers enforce CORS</td></tr>
<tr><td>"No 'Access-Control-Allow-Origin' header"</td><td>Server did not respond to the preflight, or an error page bypassed the CORS filter</td></tr>
<tr><td>Wildcard rejected with credentials</td><td><code>*</code> and <code>Allow-Credentials: true</code> are forbidden together — echo a specific origin</td></tr>
<tr><td>Custom header rejected</td><td>Missing from <code>Access-Control-Allow-Headers</code></td></tr>
<tr><td>Client cannot read a response header</td><td>Needs <code>Access-Control-Expose-Headers</code> — only a few are visible by default</td></tr>
<tr><td>500 responses fail CORS too</td><td>Your error handler runs outside the CORS filter — the browser then reports a CORS error and hides the real one</td></tr>
</table>
<p><strong>The security points that matter:</strong> maintain an explicit origin allowlist rather than reflecting <code>Origin</code>; never combine a reflected origin with <code>Allow-Credentials</code>; always send <code>Vary: Origin</code> so caches do not cross-serve; and remember that CORS protects the <em>user's browser session</em>, not your API — a server-side attacker ignores it entirely, which is why authentication, authorisation and rate limiting still do all the real work.</p>
<div class="key-point">The sentence that ends the confusion: <em>"CORS is not a server-side protection — it stops a malicious page from reading your API's response using the victim's cookies. The request may still have reached me and executed, so CORS never substitutes for authorisation or CSRF protection."</em></div>`,
      },
      // ──── 6. ARCHITECTURE & SCALE ────
      {
        q: 'REST vs GraphQL vs gRPC — how do you choose, and where does each one hurt?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>I choose by who the consumer is and what the traffic looks like, not by which is newest. <strong>REST over HTTP/JSON</strong> is the right default for public and partner APIs because it is universally understood, debuggable with a browser and curl, and it gets HTTP caching, proxies and CDNs for free — its weaknesses are over-fetching, under-fetching and the round trips that follow. <strong>GraphQL</strong> solves exactly those, which makes it strong when many different clients need different slices of a rich graph; the pain arrives operationally, because a single endpoint with client-defined queries means you now own query cost analysis, depth and complexity limits, per-field authorisation, resolver-level N+1 problems, and you have given up HTTP caching. <strong>gRPC</strong> wins on internal service-to-service traffic: binary Protobuf, HTTP/2 multiplexing, generated clients in every language, streaming, and a schema that is enforced rather than documented — but it is awkward from a browser, opaque in logs, and needs tooling to inspect. The honest summary is that most systems end up with all three: REST at the edge, gRPC between services, and GraphQL or a BFF where the client's needs are genuinely too varied for fixed endpoints.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Tôi chọn theo hai câu hỏi: ai là người dùng API này, và lưu lượng có đặc điểm gì. Không chọn theo cái nào mới hơn.</p><p><strong>REST + JSON</strong> là mặc định đúng cho API công khai và API cho đối tác. Ai cũng hiểu, mở trình duyệt hoặc gõ curl là debug được, và được hưởng miễn phí cache của HTTP, proxy và CDN. Điểm yếu: trả dư dữ liệu, trả thiếu dữ liệu, và số vòng gọi mạng nhiều.</p><p><strong>GraphQL</strong> giải đúng những điểm yếu đó, nên rất mạnh khi có nhiều loại client cần những lát cắt dữ liệu khác nhau. Nhưng cái giá nằm ở khâu vận hành: một endpoint duy nhất với câu query do client tự viết nghĩa là bạn phải tự lo phân tích chi phí query, giới hạn độ sâu, phân quyền tới từng field, và xử lý N+1 ở tầng resolver. Đồng thời bạn mất luôn cache của HTTP.</p><p><strong>gRPC</strong> thắng ở lưu lượng nội bộ giữa các service: Protobuf nhị phân nhẹ và nhanh, HTTP/2 ghép nhiều luồng trên một kết nối, sinh client tự động cho mọi ngôn ngữ, hỗ trợ streaming, và schema được bắt buộc chứ không chỉ nằm trong tài liệu. Nhưng gọi từ trình duyệt thì vướng, đọc log thì không thấy gì vì là nhị phân, và phải có công cụ riêng mới soi được.</p><p>Nói cho thật thì phần lớn hệ thống rốt cuộc dùng cả ba: REST ở ngoài biên, gRPC giữa các service bên trong, và GraphQL hoặc một lớp BFF ở chỗ nhu cầu của client quá đa dạng để gò vào các endpoint cố định.</p></details>
<table>
<tr><th></th><th>REST</th><th>GraphQL</th><th>gRPC</th></tr>
<tr><td>Transport / format</td><td>HTTP/1.1+ , JSON</td><td>HTTP, JSON</td><td>HTTP/2, Protobuf (binary)</td></tr>
<tr><td>Schema</td><td>OpenAPI (optional, drifts)</td><td>Mandatory, introspectable</td><td>Mandatory .proto, code-generated</td></tr>
<tr><td>Over/under-fetching</td><td>Common</td><td>Solved by design</td><td>Fixed per method</td></tr>
<tr><td>HTTP caching</td><td>✅ native</td><td>❌ (POST, one endpoint)</td><td>❌ (needs app-level cache)</td></tr>
<tr><td>Browser support</td><td>✅</td><td>✅</td><td>⚠️ needs grpc-web + proxy</td></tr>
<tr><td>Streaming</td><td>SSE / WebSocket bolt-on</td><td>Subscriptions</td><td>✅ bidirectional, first-class</td></tr>
<tr><td>Debuggability</td><td>curl, browser, logs</td><td>GraphiQL; logs show one URL</td><td>Needs grpcurl; binary on the wire</td></tr>
<tr><td>Payload size / speed</td><td>Baseline</td><td>Baseline</td><td>Significantly smaller and faster</td></tr>
<tr><td>Best at</td><td>Public/partner APIs, CRUD, cacheable reads</td><td>Rich graphs, many diverse clients, mobile</td><td>Internal microservices, low latency, polyglot</td></tr>
</table>
<p><strong>What each one costs you in production:</strong></p>
<ul>
<li><strong>REST</strong> — endpoint proliferation, chatty clients, and an OpenAPI spec that drifts from the code unless it is generated or contract-tested.</li>
<li><strong>GraphQL</strong> — query complexity limits, persisted queries to keep it safe and cacheable, dataloaders for N+1, per-field authorisation, and observability that no longer works per-URL.</li>
<li><strong>gRPC</strong> — proto versioning discipline (never reuse a field number), load balancing that must be L7-aware because HTTP/2 keeps connections open, and a debugging experience that assumes tooling.</li>
</ul>
<div class="key-point">The senior framing is that this is not a competition: <em>"REST at the edge because consumers and caches understand it, gRPC between services because it is faster and schema-enforced, and GraphQL only where client needs are so varied that fixed endpoints genuinely fail. Each one moves complexity somewhere — the question is where I want to own it."</em></div>`,
      },
      {
        q: 'How do you handle bulk operations and partial failure in a REST API?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The first question is whether the bulk operation is atomic or not, because that decides everything else. If it must be all-or-nothing, keep it simple: one request, one transaction, and either 200 or a single error — the client never has to reason about partial state. If it is independent items, which is the common case for imports and bulk updates, then partial failure is inevitable and the API has to express it honestly. The standard answer is <strong>207 Multi-Status</strong>, or a 200 with a per-item results array, where each entry carries its own status, identifier and error, so the client can retry only what failed. Two details matter more than the status code choice. First, every item needs a client-supplied reference so results can be correlated back — position in the array is fragile. Second, once the batch is large enough that the request would time out, stop trying to make it synchronous and switch to the 202-plus-job-resource pattern, because a bulk endpoint that works for 100 rows and dies at 10 000 is worse than one that was asynchronous from the start.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Câu hỏi đầu tiên: thao tác này có phải kiểu "được tất cả hoặc không gì cả" không? Câu trả lời quyết định mọi thứ còn lại.</p><p><strong>Nếu bắt buộc phải nguyên tử</strong> — ví dụ chuyển tiền giữa nhiều tài khoản — thì giữ mọi thứ đơn giản: một request, một transaction, kết quả hoặc 200 hoặc một lỗi duy nhất. Client không phải nghĩ về trạng thái dở dang.</p><p><strong>Nếu các phần tử độc lập với nhau</strong> — nhập dữ liệu hàng loạt, cập nhật hàng loạt — thì thất bại một phần chắc chắn sẽ xảy ra, và API phải diễn tả được điều đó. Cách chuẩn là trả <strong>207 Multi-Status</strong>, hoặc trả 200 kèm một mảng kết quả cho từng phần tử, mỗi mục có trạng thái, ID và lỗi riêng. Client nhìn vào đó là biết gửi lại đúng phần nào.</p><p>Hai chi tiết còn quan trọng hơn cả việc chọn status code.</p><p><strong>Một: mỗi phần tử cần một mã tham chiếu do client tự đặt</strong> để đối chiếu kết quả. Nếu chỉ dựa vào thứ tự trong mảng thì rất dễ lệch, chỉ cần server sắp xếp lại hoặc bỏ qua một phần tử là sai hết.</p><p><strong>Hai: khi lô dữ liệu lớn tới mức request sẽ timeout, đừng cố làm đồng bộ nữa</strong> mà chuyển sang mẫu 202 kèm tài nguyên job. Một endpoint chạy ngon với 100 dòng rồi chết ở 10.000 dòng còn tệ hơn một endpoint bất đồng bộ ngay từ đầu — vì nó chỉ chết khi đã lên production, và đúng lúc dữ liệu quan trọng nhất.</p></details>
<pre>POST /orders/bulk
{ "items": [
    { "ref": "a1", "customerId": "C1", "total": 100 },
    { "ref": "a2", "customerId": "C9", "total": -5 },
    { "ref": "a3", "customerId": "C4", "total": 250 } ] }

HTTP/1.1 207 Multi-Status
{ "results": [
    { "ref":"a1", "status":201, "id":"O-771", "location":"/orders/O-771" },
    { "ref":"a2", "status":422, "error": { "code":"INVALID_AMOUNT",
                                           "message":"total must be positive" } },
    { "ref":"a3", "status":201, "id":"O-772", "location":"/orders/O-772" } ],
  "summary": { "requested":3, "succeeded":2, "failed":1 } }</pre>
<table>
<tr><th>Semantics</th><th>Design</th><th>Status</th></tr>
<tr><td><strong>All-or-nothing</strong></td><td>Single transaction; reject the whole batch on any error</td><td>200/201, or 422 with the offending items listed</td></tr>
<tr><td><strong>Independent items</strong></td><td>Per-item result array</td><td>207 Multi-Status (or 200 with the same body)</td></tr>
<tr><td><strong>Large batch</strong></td><td>202 + job resource; poll for progress and a result file</td><td>202 → 200 on the job</td></tr>
<tr><td><strong>Very large import</strong></td><td>Upload a file to object storage, then submit its URI</td><td>202 + job</td></tr>
</table>
<p><strong>Rules that keep bulk endpoints sane:</strong></p>
<ul>
<li><strong>Cap the batch size</strong> and return 413 or 422 above it — an unbounded array is a denial-of-service vector.</li>
<li><strong>Make the whole batch idempotent</strong> with an <code>Idempotency-Key</code>, and each item idempotent by its <code>ref</code>, so a retry after a timeout does not double-create.</li>
<li><strong>Never mix semantics</strong> — one endpoint is either atomic or per-item, and the documentation must say which in the first line.</li>
<li><strong>Rate-limit by item count, not request count</strong>, or one caller sends a single request with 10 000 items and bypasses your limits entirely.</li>
<li><strong>Do not return 200 for a fully failed batch</strong> — if nothing succeeded, a 4xx is more honest and clients will actually notice.</li>
</ul>
<div class="key-point">The trap to name out loud: <em>"207 is honest but it puts work on the client — every consumer now has to iterate results and handle partial retry. So I only expose per-item semantics when the domain genuinely is per-item; if the caller expects all-or-nothing, one transaction and one status code is a better API."</em></div>`,
      },
      {
        q: 'How do you keep data consistent when one REST call must update two services?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>You accept that you cannot have a distributed transaction and design for eventual consistency instead. Two-phase commit across HTTP services is theoretically possible and practically a mistake — it couples availability, holds locks across network calls, and no mainstream stack supports it well. The workable patterns are the saga and the outbox. A <strong>saga</strong> breaks the operation into local transactions, each with a compensating action, so if step three fails you run the compensations for steps two and one — note that compensation is not rollback, because the intermediate state was visible, so "cancel the order" is a new business fact rather than an undo. The <strong>transactional outbox</strong> solves the subtler problem underneath: you cannot atomically write to your database and publish an event, so instead you write the event into an outbox table in the same transaction and a separate process publishes it, which converts a distributed-atomicity problem into a local one plus at-least-once delivery. From there, every consumer must be idempotent, and the honest part of this answer is admitting that the business needs to decide what happens during the window where the two services disagree.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Trước hết phải chấp nhận rằng bạn không có transaction phân tán, và thiết kế theo hướng nhất quán cuối cùng.</p><p>Two-phase commit qua HTTP thì về lý thuyết làm được nhưng thực tế là sai lầm: nó trói tính sẵn sàng của các service vào nhau (một cái chết là cả cụm chết), giữ khoá database xuyên suốt các lệnh gọi mạng, và chẳng nền tảng phổ biến nào hỗ trợ nó tử tế.</p><p>Hai mẫu thiết kế dùng được là saga và outbox.</p><p><strong>Saga</strong> chia thao tác lớn thành nhiều transaction cục bộ, mỗi bước kèm một hành động bù trừ. Nếu bước 3 hỏng thì chạy bù cho bước 2 rồi bước 1. Lưu ý: bù trừ không phải là rollback. Trạng thái trung gian đã hiển thị ra ngoài rồi, khách hàng đã nhận email xác nhận rồi. Nên "huỷ đơn hàng" là một sự kiện nghiệp vụ mới, không phải một thao tác xoá dấu vết.</p><p><strong>Transactional outbox</strong> giải quyết vấn đề tinh vi hơn nằm bên dưới: bạn không thể vừa ghi database vừa bắn message lên queue một cách nguyên tử. Ghi database xong mà bắn message lỗi thì mất sự kiện; bắn message xong mà commit lỗi thì sinh ra sự kiện ma.</p><p>Cách làm là ghi sự kiện vào một bảng <code>outbox</code> trong cùng transaction với dữ liệu nghiệp vụ, rồi để một tiến trình riêng đọc bảng đó và bắn message đi. Bài toán nguyên tử phân tán trở thành bài toán cục bộ, đổi lại là cơ chế gửi ít nhất một lần — nghĩa là mọi bên nhận message đều bắt buộc phải idempotent.</p><p>Và phần thành thật nhất của câu trả lời này: người quyết định điều gì được phép xảy ra trong khoảng thời gian hai service còn lệch nhau là phía nghiệp vụ, không phải kỹ sư. Câu hỏi "khách đã trả tiền mà kho báo hết hàng thì xử lý sao" không có đáp án kỹ thuật.</p></details>
<pre>Saga — order placement
──────────────────────
POST /orders → 201  (status: PENDING)          local txn + outbox event
      │
      ├─ OrderCreated  → Payment service   → charge      ok → PaymentCaptured
      │                                    → fail        → PaymentFailed
      ├─ PaymentCaptured → Inventory       → reserve     ok → StockReserved
      │                                    → out of stock → StockUnavailable
      └─ compensation on failure:
            StockUnavailable → refund payment → order status = CANCELLED
            (a new business fact, visible to the customer — not a silent rollback)</pre>
<pre>Transactional outbox — the atomicity you actually can get
────────────────────────────────────────────────────────
BEGIN
  INSERT INTO orders (...)                    -- business change
  INSERT INTO outbox (id, topic, payload)     -- the event, same transaction
COMMIT
        ↓
  relay / CDC (Debezium) reads outbox → publishes to Kafka → marks sent
        ↓
  consumer is idempotent (dedupe on event id) — delivery is at-least-once</pre>
<table>
<tr><th>Pattern</th><th>Use when</th><th>Cost</th></tr>
<tr><td><strong>Saga — choreography</strong> (events)</td><td>Few steps, loose coupling</td><td>Flow is implicit; hard to see the whole picture</td></tr>
<tr><td><strong>Saga — orchestration</strong> (a coordinator)</td><td>Many steps, needs visibility and timeouts</td><td>One more service; but the flow is explicit and testable</td></tr>
<tr><td><strong>Outbox</strong></td><td>Any time a write must produce an event</td><td>A relay process and a table to maintain</td></tr>
<tr><td><strong>Idempotent consumers</strong></td><td>Always — non-negotiable</td><td>A dedupe store keyed by event id</td></tr>
<tr><td><strong>2PC / XA</strong></td><td>Almost never across services</td><td>Availability coupling, locks over the network</td></tr>
</table>
<p><strong>What the API surface should look like:</strong> return 202 with an order in <code>PENDING</code>, expose the state machine in the resource itself so clients can poll or subscribe, and make the intermediate states part of the documented contract rather than an implementation leak. Clients handle "pending" much better than they handle a 200 that silently was not fully true.</p>
<div class="key-point">Say the uncomfortable part: <em>"Compensation is not rollback. The intermediate state was visible to users and to other services, so undoing it is a new business event with its own rules — and deciding what those rules are is a product conversation, not a technical one."</em></div>`,
      },
      {
        q: 'How do you design file upload and download endpoints?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The instinct is to POST the bytes through the API, and for small files that is fine — multipart/form-data, a size cap, content-type validation, and store the file in object storage while the API keeps only metadata. It stops being fine quickly, because large uploads tie up application threads, blow through gateway body limits, and cannot resume when a mobile connection drops. The pattern I prefer for anything substantial is <strong>presigned URLs</strong>: the client asks your API for permission, you return a short-lived signed URL to S3 or equivalent, the client uploads directly to storage, and then confirms back to your API which records the metadata. Your service never touches the bytes, so it scales independently of file size, and the same trick works for download with a presigned GET so you are not proxying gigabytes through your application. The security details are where this goes wrong in practice: validate the real content type by inspecting the file rather than trusting the header or extension, never build a storage path from the user-supplied filename, cap the size in the signature itself, and serve user-uploaded content from a separate domain with <code>Content-Disposition: attachment</code> so an uploaded HTML file cannot run as script on your origin.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Phản xạ đầu tiên là POST thẳng file qua API. Với file nhỏ thì ổn: dùng multipart/form-data, giới hạn dung lượng, kiểm tra loại file, lưu file vào object storage còn API chỉ giữ metadata.</p><p>Nhưng cách đó hết ổn rất nhanh. File lớn sẽ chiếm thread của ứng dụng suốt thời gian upload, vượt giới hạn kích thước body ở gateway, và không có cách nào chạy tiếp khi mạng di động rớt giữa chừng.</p><p>Với file cỡ lớn, mẫu tôi thích dùng là <strong>presigned URL</strong>:</p><p><strong>1.</strong> Client gọi API của bạn xin quyền upload. <strong>2.</strong> Bạn trả về một URL đã ký, sống ngắn vài phút, trỏ thẳng tới S3 hoặc dịch vụ tương đương. <strong>3.</strong> Client upload thẳng lên đó, không đi qua server của bạn. <strong>4.</strong> Client báo lại cho API để ghi metadata.</p><p>Service của bạn không hề chạm vào nội dung file, nên nó không bị ảnh hưởng bởi kích thước file. Cách tương tự cũng dùng được cho download bằng presigned GET, để bạn khỏi phải làm trung gian chuyển vài gigabyte qua ứng dụng của mình.</p><p>Phần hay sai trên thực tế lại nằm ở bảo mật:</p><p><strong>Kiểm tra loại file bằng cách đọc nội dung</strong>, đừng tin phần mở rộng tên file hay header client gửi lên.</p><p><strong>Đừng bao giờ dùng tên file người dùng gửi lên để ghép đường dẫn lưu trữ</strong> — đó là lỗ hổng path traversal kinh điển.</p><p><strong>Giới hạn dung lượng ngay trong chữ ký của presigned URL</strong>, chứ không chỉ kiểm tra ở phía client.</p><p><strong>Phục vụ file người dùng tải lên từ một tên miền riêng, kèm <code>Content-Disposition: attachment</code>.</strong> Nếu không, ai đó upload một file HTML có chứa script rồi gửi link cho người khác, script đó sẽ chạy trên chính tên miền của bạn và đọc được cookie của người dùng.</p></details>
<pre>Small files (&lt; a few MB)          Large files — presigned URL
──────────────────────           ───────────────────────────
POST /documents                  1. POST /documents/upload-intents
Content-Type: multipart/form-data     { "filename":"scan.pdf", "size":48211234,
  file=@scan.pdf                        "contentType":"application/pdf" }
  metadata={"type":"INVOICE"}       → 201 { "uploadUrl":"https://s3...&amp;X-Amz-Expires=900",
                                            "documentId":"D-91" }
→ 201 Location: /documents/D-91
                                 2. PUT &lt;uploadUrl&gt;   (client → storage, direct)

                                 3. POST /documents/D-91/completions
                                    → server verifies size/checksum with the storage API,
                                      scans for malware, marks the document AVAILABLE</pre>
<table>
<tr><th>Concern</th><th>Rule</th></tr>
<tr><td><strong>Size limit</strong></td><td>Enforce at the gateway <em>and</em> in the presigned policy — 413 above it</td></tr>
<tr><td><strong>Content type</strong></td><td>Sniff magic bytes; never trust the extension or the declared header</td></tr>
<tr><td><strong>Filename</strong></td><td>Store under a generated ID; keep the original name as metadata only (path traversal)</td></tr>
<tr><td><strong>Malware</strong></td><td>Scan before marking the document usable; keep it in a quarantine state until then</td></tr>
<tr><td><strong>Serving</strong></td><td>Separate domain, <code>Content-Disposition: attachment</code>, <code>X-Content-Type-Options: nosniff</code></td></tr>
<tr><td><strong>Access control</strong></td><td>Short-lived presigned GET per request; never a permanently public object URL for private data</td></tr>
<tr><td><strong>Resumability</strong></td><td>Multipart upload (S3) or the tus protocol for unreliable networks</td></tr>
<tr><td><strong>Orphans</strong></td><td>Intents that never complete must expire — a lifecycle rule on the bucket plus a cleanup job</td></tr>
</table>
<p><strong>Downloads:</strong> for large or private files, return <code>302</code> to a short-lived presigned URL rather than streaming through the API; support <code>Range</code> requests so video and PDF viewers can seek; and set <code>ETag</code> plus a long <code>max-age</code> for immutable content, since a file at a content-addressed URL never changes.</p>
<div class="key-point">The scaling argument in one line: <em>"My API handles permission and metadata; the bytes go straight between the client and object storage over a presigned URL. That keeps request duration independent of file size — otherwise a handful of slow uploads can exhaust the thread pool that everyone else's requests need."</em></div>`,
      },
      // ──── 7. CONTRACTS, TESTING & OPERATIONS ────
      {
        q: 'Contract-first or code-first with OpenAPI? How do you stop the spec drifting from reality?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The question that actually matters is not which direction you generate, it is whether anything fails when the two disagree — a spec that nothing verifies is documentation, and documentation rots. <strong>Contract-first</strong> means the OpenAPI document is the source of truth, reviewed before implementation, with server stubs and client SDKs generated from it; this is clearly right when multiple teams or external consumers need to build against the API in parallel, because the contract becomes the coordination point. <strong>Code-first</strong>, generating the spec from annotations, has far less friction day to day and keeps the spec automatically in sync with the code, which is why most single-team internal services use it. Whichever you pick, the drift protection is the same and it has to live in CI: validate that the generated or committed spec matches the implementation, run consumer-driven contract tests so a provider change that breaks a real consumer fails the provider's build, and diff the spec on every pull request so a breaking change is visible in review rather than discovered in production.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Câu hỏi đáng bàn không phải là bạn viết cái nào trước, mà là <strong>có cái gì báo lỗi hay không khi tài liệu và code lệch nhau</strong>. Một bản spec không có gì kiểm chứng thì chỉ là tài liệu, mà tài liệu thì sẽ lỗi thời rất nhanh.</p><p><strong>Contract-first:</strong> file OpenAPI là nguồn chân lý, được review trước khi viết code, rồi sinh ra khung server và SDK cho client từ đó. Cách này đúng khi nhiều đội hoặc khách hàng bên ngoài cần làm song song, vì bản hợp đồng trở thành điểm thống nhất chung — team frontend không phải ngồi chờ backend làm xong.</p><p><strong>Code-first:</strong> viết code trước, sinh spec từ annotation. Ít phiền phức hơn hẳn trong công việc hằng ngày và spec luôn khớp với code. Phần lớn service nội bộ do một đội làm đều chọn cách này.</p><p>Chọn hướng nào cũng được. Nhưng cách chống lệch thì giống nhau, và bắt buộc phải nằm trong CI:</p><p><strong>Kiểm tra spec được commit khớp với spec sinh ra từ code</strong> — lệch là build đỏ.</p><p><strong>Chạy contract test hướng bên tiêu thụ.</strong> Khi backend đổi một field làm gãy một client thật, thì build của backend trượt ngay, chứ không phải chờ client phát hiện rồi báo lại.</p><p><strong>So sánh diff của spec ở mỗi pull request</strong>, để một thay đổi phá vỡ tương thích hiện ra lúc review chứ không phải lúc đã lên production.</p></details>
<table>
<tr><th></th><th>Contract-first</th><th>Code-first</th></tr>
<tr><td>Source of truth</td><td>The <code>openapi.yaml</code> file</td><td>The implementation</td></tr>
<tr><td>Parallel work</td><td>✅ front end mocks from the spec on day one</td><td>❌ consumers wait for the endpoint</td></tr>
<tr><td>Drift risk</td><td>Spec can be right while the code is wrong</td><td>Spec follows code automatically</td></tr>
<tr><td>Design quality</td><td>Higher — the API is reviewed as a design artefact</td><td>Lower — the API leaks whatever the code happened to do</td></tr>
<tr><td>Friction</td><td>Higher; needs generator tooling in the build</td><td>Low; annotations in the controller</td></tr>
<tr><td>Fits</td><td>Public APIs, multi-team, external partners</td><td>Internal services owned by one team</td></tr>
</table>
<p><strong>The CI gates that actually prevent drift:</strong></p>
<ol>
<li><strong>Spec-vs-implementation validation</strong> — run the API's own test suite through a validator that asserts every request and response matches the schema. A response with an undocumented field fails the build.</li>
<li><strong>Breaking-change detection</strong> — diff the spec against the previous release (openapi-diff, Spectral) and fail on removals, type changes and newly required fields.</li>
<li><strong>Consumer-driven contract tests</strong> (Pact) — each consumer publishes what it actually uses; the provider verifies against all of them before deploying. This catches "nobody told me the mobile app reads that field".</li>
<li><strong>Generated clients</strong> — if consumers use SDKs generated from the spec, a spec error becomes a compile error in their build rather than a runtime surprise.</li>
<li><strong>Linting the spec</strong> — naming conventions, required descriptions, examples, error schemas. Consistency is a feature.</li>
</ol>
<div class="key-point">Cut through the religious argument: <em>"I care much less about which one generates the other than about whether CI fails when they disagree. Contract-first for public or multi-team APIs because parallel work needs the contract up front; code-first internally — but either way, spec validation and contract tests run in the pipeline, or the document is fiction within a quarter."</em></div>`,
      },
      {
        q: 'How do you test a REST API properly? What belongs at each level?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>I think about it as layers with decreasing count and increasing confidence. Unit tests cover the domain logic with no HTTP at all — fast, numerous, and where the business rules actually get exercised. Then a layer of controller or web-slice tests that boot only the HTTP layer with mocked dependencies, to assert the things that only exist at the HTTP boundary: status codes, validation errors, serialisation, headers, and authorisation rules. Then integration tests with a real database, ideally Testcontainers rather than an in-memory substitute, because half the bugs worth catching are in SQL and transactions, which H2 will happily hide from you. Above that, contract tests against consumers, and finally a very small number of end-to-end tests on critical journeys — small, because they are slow and flaky and their maintenance cost grows superlinearly. The specific things I make sure are covered at the HTTP level, because they get missed constantly: every error path returns the documented shape, authorisation is tested with the <em>wrong</em> user rather than only the right one, pagination boundaries, and idempotency — sending the same request twice and asserting one effect.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Tôi hình dung nó thành nhiều tầng, càng lên cao thì số lượng test càng ít mà càng gần với thực tế.</p><p><strong>Unit test</strong> cho logic nghiệp vụ, không dính gì tới HTTP. Nhanh, nhiều, và là nơi các quy tắc nghiệp vụ thật sự được kiểm chứng.</p><p><strong>Test tầng controller:</strong> chỉ khởi động phần HTTP, mock hết các phụ thuộc. Kiểm tra những thứ chỉ tồn tại ở ranh giới HTTP — status code, thông báo lỗi validate, việc chuyển dữ liệu thành JSON, header, và luật phân quyền.</p><p><strong>Integration test chạy với database thật</strong>, tốt nhất là dùng Testcontainers. Đừng dùng database chạy trong bộ nhớ như H2, vì phân nửa số lỗi đáng bắt nằm ở SQL và transaction — mà H2 thì chấp nhận những câu SQL Postgres sẽ từ chối, nên nó che mất lỗi cho tới lúc lên production.</p><p><strong>Contract test</strong> với các bên tiêu thụ.</p><p><strong>Một vài test đầu-cuối</strong> cho những luồng quan trọng nhất. Phải ít thôi, vì chúng chậm, hay chập chờn, và chi phí bảo trì tăng rất nhanh.</p><p>Còn đây là những thứ tôi luôn bảo đảm có test ở tầng HTTP, vì chúng bị bỏ sót suốt: mọi nhánh lỗi phải trả về đúng cấu trúc đã ghi trong tài liệu; phân quyền phải test bằng người dùng <em>sai</em> chứ không chỉ bằng người dùng đúng; các mốc biên của phân trang (trang đầu, trang cuối, trang rỗng); và tính idempotent — gửi cùng một request hai lần rồi kiểm tra chỉ có một tác động xảy ra.</p></details>
<pre>        ▲  fewer, slower, higher confidence
   E2E  │  a handful of critical journeys, against a deployed environment
Contract│  Pact: every consumer's expectations verified before the provider deploys
Integr. │  real DB (Testcontainers), real serialisation, transactions, migrations
  Web   │  @WebMvcTest / supertest — status codes, validation, headers, authz
  Unit  │  domain rules, pure functions — hundreds, milliseconds
        ▼  more, faster</pre>
<table>
<tr><th>Level</th><th>Asserts</th><th>Does not assert</th></tr>
<tr><td><strong>Unit</strong></td><td>Business rules, calculations, state transitions</td><td>Anything about HTTP or SQL</td></tr>
<tr><td><strong>Web slice</strong></td><td>200/201/400/403/404/409/422, error body shape, headers, content negotiation, authz</td><td>Whether the query is correct</td></tr>
<tr><td><strong>Integration</strong></td><td>SQL correctness, transaction boundaries, migrations, constraint violations → 409</td><td>Consumer expectations</td></tr>
<tr><td><strong>Contract</strong></td><td>The provider still satisfies what each consumer actually uses</td><td>Business correctness</td></tr>
<tr><td><strong>E2E</strong></td><td>The pieces are wired together and deployable</td><td>Edge cases — far too slow for those</td></tr>
</table>
<p><strong>The API-specific cases teams forget:</strong></p>
<ul>
<li><strong>Authorisation with the wrong user</strong> — for every endpoint, a test where user B requests user A's resource and must get 404/403. This is the BOLA class of bug and it is only caught deliberately.</li>
<li><strong>Idempotency</strong> — POST twice with the same key, assert exactly one record and identical responses.</li>
<li><strong>Concurrency</strong> — two conflicting writes with the same <code>If-Match</code>, assert exactly one 412.</li>
<li><strong>Pagination boundaries</strong> — empty result, a single page, exactly one item over the limit, an invalid cursor.</li>
<li><strong>Malformed input</strong> — broken JSON, wrong types, extra unknown fields, oversized payloads. Every one should be a clean 400/422, never a 500.</li>
<li><strong>Backward compatibility</strong> — a schema diff check in CI, so removing a field fails the build.</li>
</ul>
<div class="key-point">The detail that signals experience: <em>"For every endpoint I write the negative authorisation test — the wrong user asking for someone else's record. Happy-path tests never catch broken object-level authorisation, and that is the vulnerability this class of system actually ships with."</em></div>`,
      },
      {
        q: 'What do you instrument in a production API? How do you debug a slow endpoint you cannot reproduce?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The baseline is the RED metrics per endpoint — rate, errors and duration — with duration reported as percentiles rather than an average, because an average hides exactly the tail you are being paged about. Alongside that I want structured logs carrying a correlation ID that is generated at the edge and propagated through every downstream call, and distributed tracing so a single request's path across services is visible as a waterfall rather than reconstructed by hand from timestamps. For the specific case of a slow endpoint that will not reproduce, the trace is the tool: it immediately tells you whether the time is in your service, in a downstream call, or in the database, which eliminates most of the guesswork in one step. Then look at the shape of the distribution — if p50 is fine and p99 is terrible, you are usually looking at something data-dependent, like one customer with a hundred times more rows, a missing index that only matters above a certain size, or an N+1 that scales with a collection. The things that make this tractable are having the trace ID in the error response so a user report maps to a trace, and tagging metrics by tenant or client so you can see that the slowness belongs to one caller rather than to everyone.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mức nền là bộ chỉ số RED cho từng endpoint: số request, số lỗi, và thời gian phản hồi. Thời gian phải báo theo phân vị (p50, p95, p99), không phải trung bình — trung bình che mất đúng cái phần đuôi khiến bạn bị gọi dậy lúc nửa đêm. 99% request nhanh mà 1% mất 30 giây thì con số trung bình vẫn rất đẹp.</p><p>Song song đó cần log có cấu trúc, mang theo một correlation ID sinh ra ở biên và truyền tiếp qua mọi lệnh gọi phía sau. Cộng thêm distributed tracing, để đường đi của một request qua các service hiện ra thành một biểu đồ thác nước, thay vì phải ngồi ghép thủ công từ timestamp trong log của năm service.</p><p>Với tình huống một endpoint chậm mà không tái hiện được thì trace chính là công cụ. Nó cho biết ngay thời gian nằm ở đâu: trong service của bạn, ở lệnh gọi ra bên ngoài, hay ở database. Chỉ một bước là loại bỏ được phần lớn phỏng đoán.</p><p>Sau đó nhìn vào hình dạng của phân bố. Nếu p50 vẫn đẹp mà p99 thì tệ, thường là bạn đang gặp thứ gì đó phụ thuộc vào dữ liệu: một khách hàng có số dòng gấp trăm lần người khác, một index còn thiếu chỉ lộ ra khi bảng đủ lớn, hoặc một lỗi N+1 phình lên theo kích thước danh sách.</p><p>Hai thứ khiến việc điều tra trở nên khả thi: <strong>đưa trace ID vào chính response lỗi</strong>, để một lời phàn nàn của người dùng dẫn thẳng tới một trace cụ thể; và <strong>gắn nhãn theo khách hàng cho các chỉ số</strong>, để thấy được "chậm" là của riêng một bên gọi hay của tất cả mọi người.</p></details>
<table>
<tr><th>Signal</th><th>What to capture</th><th>Why it matters</th></tr>
<tr><td><strong>Rate</strong></td><td>Requests/sec by route, method, client, status class</td><td>Traffic shifts explain most sudden latency changes</td></tr>
<tr><td><strong>Errors</strong></td><td>4xx and 5xx separately, by route and error code</td><td>4xx spiking is a client or contract problem; 5xx is yours</td></tr>
<tr><td><strong>Duration</strong></td><td>p50 / p95 / p99 per route — a histogram, never an average</td><td>Averages hide the tail; the tail is the user experience</td></tr>
<tr><td><strong>Saturation</strong></td><td>Connection pool, thread pool, queue depth</td><td>Latency rises before errors do — this is the leading indicator</td></tr>
<tr><td><strong>Dependencies</strong></td><td>Same three metrics for every downstream call and query</td><td>Isolates "we are slow" from "our dependency is slow"</td></tr>
<tr><td><strong>Business</strong></td><td>Orders placed, payments failed</td><td>The alert that matters when the technical metrics look fine</td></tr>
</table>
<pre>Debugging the unreproducible slow endpoint
──────────────────────────────────────────
1. Distribution   p50 ok / p99 bad → data-dependent (one big tenant, missing index, N+1)
                  everything slow  → saturation, GC, a dependency, or a noisy neighbour
2. Trace          open a slow trace: where is the time? own code / downstream / DB?
3. Correlate      slow requests grouped by tenant? by parameter? by time of day?
4. Query plan     take the actual slow query and EXPLAIN it against production-sized data
5. Count queries  N+1 shows as dozens of near-identical spans inside one request
6. Fix + verify   confirm on the p99, not on a local benchmark</pre>
<p><strong>Practices that make this possible before the incident:</strong> generate a correlation/trace ID at the gateway and require every service to propagate and log it; return it in every response, especially errors; log structured JSON with route, status, duration, tenant and user — never with tokens or PII; sample traces but always keep the slow and failed ones; and set SLOs per endpoint so alerts fire on the user-visible metric rather than on CPU.</p>
<div class="key-point">The diagnostic instinct worth stating: <em>"The first question is always whether p50 moved or only p99. A bad tail with a healthy median is nearly always data-dependent — one tenant, one code path, one missing index — and that reframes the search from 'the service is slow' to 'which requests are slow, and what do they have in common'."</em></div>`,
      },
      // ──── 8. SENIOR TRAPS ────
      {
        q: 'Is DELETE really idempotent if the second call returns 404?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Yes, and this is the question that catches people who learned idempotency as a slogan rather than a definition. Idempotency is a statement about <em>server state</em>, not about the response: after one DELETE the resource is gone, after five DELETEs the resource is still gone, so the state is identical and the method is idempotent. The status code differing between the first call and the second does not violate anything — the specification never promised identical responses. The interesting part is which response to choose, and it is a design decision rather than a correctness one: returning 404 on the second call is technically accurate and lets a client distinguish "I deleted it" from "it was never there", while returning 204 unconditionally makes retries trivially safe for clients that do not care about the distinction. I usually prefer 204 on repeat deletes for internal APIs because it stops a network retry from surfacing a spurious error, and 404 for public APIs where callers benefit from the precision — but the important thing is to pick one and document it, since a client writing retry logic needs to know which one it will get.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Có, vẫn idempotent. Đây đúng là câu bẫy dành cho người học idempotency như một khẩu hiệu chứ không hiểu định nghĩa.</p><p><strong>Idempotency nói về trạng thái của server, không nói về response.</strong> Sau 1 lần DELETE thì tài nguyên biến mất. Sau 5 lần DELETE thì nó vẫn biến mất. Trạng thái giống hệt nhau, nên method này idempotent.</p><p>Việc status code lần gọi thứ nhất khác lần thứ hai không vi phạm gì cả. Đặc tả chưa bao giờ hứa rằng các response phải giống nhau.</p><p>Phần thú vị là chọn trả về cái gì, và đây là quyết định thiết kế chứ không phải chuyện đúng sai. Trả <strong>404</strong> ở lần thứ hai thì chính xác về mặt kỹ thuật, và giúp client phân biệt "tôi vừa xoá nó" với "nó chưa từng tồn tại". Trả <strong>204</strong> vô điều kiện thì làm cho việc retry trở nên hoàn toàn an toàn với những client không quan tâm tới khác biệt đó.</p><p>Với API nội bộ tôi thường chọn 204 cho những lần xoá lặp lại, vì như vậy một lần retry do mạng chập chờn sẽ không làm nổi lên cảnh báo lỗi giả. Với API công khai tôi chọn 404, vì bên gọi được lợi từ sự chính xác đó.</p><p>Nhưng quan trọng nhất là chọn một cách rồi ghi vào tài liệu. Client đang viết logic retry cần biết trước nó sẽ nhận được cái gì.</p></details>
<pre>DELETE /orders/7   → 204 No Content    resource is gone
DELETE /orders/7   → 404 or 204         resource is STILL gone  ← state unchanged
DELETE /orders/7   → 404 or 204         resource is STILL gone

Idempotent?  YES.  The definition constrains state after N calls, not the
             response of call N.

Compare:
POST /orders       → 201 /orders/7
POST /orders       → 201 /orders/8      ← different state. NOT idempotent.</pre>
<table>
<tr><th>Second DELETE returns</th><th>Argument for</th><th>Argument against</th></tr>
<tr><td><strong>204 No Content</strong></td><td>Retry-friendly; the client's goal ("it should not exist") is satisfied</td><td>Hides a genuine "wrong ID" bug from the caller</td></tr>
<tr><td><strong>404 Not Found</strong></td><td>Accurate; surfaces bad identifiers</td><td>A retried network call now reports an error that is not real</td></tr>
<tr><td><strong>410 Gone</strong></td><td>Precise when you keep tombstones — "existed, deliberately removed"</td><td>Requires retaining deletion records</td></tr>
</table>
<p><strong>Two related traps in the same family:</strong></p>
<ul>
<li><strong>PUT is idempotent, but your implementation might not be.</strong> If your PUT handler appends to a list, increments a counter, or writes an audit row with a new timestamp on every call, the resource state still differs between call one and call two. Idempotency is a property of what you wrote, not of the verb you chose.</li>
<li><strong>Soft delete changes the answer.</strong> If DELETE sets <code>deletedAt</code>, a second call must not overwrite the original timestamp — otherwise the observable state genuinely differs each time, and you have broken idempotency in a way that only shows up in an audit report months later.</li>
</ul>
<div class="key-point">Answer in one sentence, then show depth: <em>"Yes — idempotency constrains the resulting state, not the response code. The follow-up worth having an opinion on is which code to return, and I default to 204 internally so retries stay clean, 404 publicly for precision — documented either way."</em></div>`,
      },
      {
        q: 'A client sends valid JSON that violates a business rule. 400, 409, or 422 — and does it matter?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>It matters, but less than consistency does, and the reasoning is what an interviewer is actually testing. The cleanest model is this: <strong>400</strong> means I could not understand the request — malformed JSON, a string where a number belongs, a missing required parameter. <strong>422</strong> means I understood it perfectly and it is still not acceptable — the amount exceeds the balance, the date range is inverted, the field failed a validation rule. <strong>409</strong> means the request is fine in isolation but conflicts with the current state of the resource — a duplicate email, an order that is already shipped and therefore cannot be cancelled, a version mismatch. So a business-rule violation is normally 422, and it becomes 409 when the same request would have succeeded a moment earlier or would succeed after some other state change, because that is what "conflict" captures. Where I would push back is on teams agonising over this per-endpoint: the client behaviour that actually differs is retryable versus terminal, so what matters far more is that every 4xx carries a stable machine-readable error code and that the whole platform applies one convention rather than deciding case by case.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Có quan trọng, nhưng không quan trọng bằng sự nhất quán. Và thứ người phỏng vấn đang thăm dò là mạch lập luận của bạn.</p><p>Mô hình gọn nhất:</p><p><strong>400</strong> = tôi không hiểu nổi request của bạn. JSON hỏng, chỗ cần số thì đưa chuỗi, thiếu tham số bắt buộc.</p><p><strong>422</strong> = tôi hiểu rất rõ, nhưng nội dung không chấp nhận được. Số tiền vượt quá số dư, ngày kết thúc trước ngày bắt đầu, một field không qua được luật kiểm tra.</p><p><strong>409</strong> = bản thân request không sai, nhưng nó xung đột với trạng thái hiện tại. Email đã tồn tại, đơn hàng đã giao rồi nên không huỷ được, phiên bản không khớp.</p><p>Vậy vi phạm quy tắc nghiệp vụ thì thường là 422. Nó thành 409 khi cùng request đó lẽ ra đã thành công nếu gửi sớm hơn một chút, hoặc sẽ thành công sau khi có một thay đổi trạng thái khác. Đó chính là ý nghĩa của chữ "xung đột".</p><p>Chỗ tôi sẽ phản biện là khi cả đội ngồi tranh cãi mãi về chuyện này cho từng endpoint. Xét cho cùng, thứ thật sự làm client cư xử khác nhau chỉ là "có nên gửi lại hay không". Nên quan trọng hơn nhiều là: mọi lỗi 4xx đều mang theo một mã lỗi cố định cho máy đọc, và cả hệ thống dùng chung một quy ước, thay vì mỗi endpoint quyết định một kiểu.</p></details>
<table>
<tr><th>Scenario</th><th>Code</th><th>Reason</th></tr>
<tr><td><code>{"amount": "abc"}</code> where a number is expected</td><td><strong>400</strong></td><td>Cannot be parsed into the expected type</td></tr>
<tr><td>Malformed JSON, missing required field</td><td><strong>400</strong></td><td>Syntactically unusable</td></tr>
<tr><td>Amount exceeds the account balance</td><td><strong>422</strong></td><td>Understood, but semantically invalid</td></tr>
<tr><td><code>endDate</code> before <code>startDate</code></td><td><strong>422</strong></td><td>Valid types, invalid combination</td></tr>
<tr><td>Email already registered</td><td><strong>409</strong></td><td>Conflicts with existing state; would have worked before</td></tr>
<tr><td>Cancelling an order that has already shipped</td><td><strong>409</strong></td><td>Illegal state transition</td></tr>
<tr><td><code>If-Match</code> ETag mismatch</td><td><strong>412</strong></td><td>An explicit precondition header failed</td></tr>
<tr><td>Authenticated user lacks permission</td><td><strong>403</strong></td><td>Authorisation, not validation</td></tr>
<tr><td>Content-Type is XML on a JSON endpoint</td><td><strong>415</strong></td><td>Media type, checked before parsing</td></tr>
</table>
<p><strong>The distinction that actually drives client behaviour:</strong></p>
<pre>Terminal — the same request will never succeed:      400, 422
   → client must change the request. Do not retry.

Conditional — could succeed later or after a re-read: 409, 412
   → client should re-fetch current state, then decide.

Transient — the same request may succeed shortly:    429, 503, 504
   → retry with backoff, honour Retry-After.</pre>
<p><strong>The defensible simplification:</strong> some large APIs (GitHub among them) use 422 for all validation and reserve 400 for genuinely unparseable requests; others use 400 for everything client-side and put the precision in the error code. Both are fine. What is not fine is one endpoint returning 400 for a business rule and the next returning 422 for the same class of problem, because every client then needs endpoint-specific handling.</p>
<div class="key-point">Give the rule, then relativise it honestly: <em>"400 for 'I cannot parse it', 422 for 'I parsed it and it is wrong', 409 for 'it conflicts with current state'. But clients branch on the error code, not the status — so consistency across the platform buys more than getting each individual case theoretically perfect."</em></div>`,
      },
      {
        q: 'What is HATEOAS and would you actually implement it? Defend your answer.',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>HATEOAS means the response carries the links describing what you can do next, so a client discovers valid transitions at runtime instead of hard-coding URLs and business rules. The genuine benefit is decoupling: the server can move a URI or change which actions are legal in a given state, and a link-following client keeps working — an order that is already shipped simply does not include a cancel link, so the state machine lives in one place rather than being duplicated in every client. My honest position is that I would not implement full HATEOAS for a typical internal or first-party API, because almost no client is written to follow links; developers read the documentation, hard-code the paths, and the hypermedia becomes payload nobody consumes while your tests still have to maintain it. Where it does earn its keep is in long-lived public APIs with many independent consumers you cannot coordinate, and in workflow-heavy domains where "what can I do with this resource right now" is genuinely dynamic. And there is a cheap middle ground I do use: include the available actions or transitions for the current state without committing to full hypermedia, which captures most of the value — the UI stops reimplementing the state machine — at a fraction of the cost.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>HATEOAS nghĩa là response mang theo các link mô tả những việc bạn có thể làm tiếp theo. Client nhìn vào link để biết bước nào hợp lệ, thay vì gõ cứng URL và luật nghiệp vụ vào code.</p><p>Ví dụ: <code>GET /orders/123</code> trả về đơn hàng kèm link <code>cancel</code> và <code>pay</code>. Khi đơn đã giao xong, response đơn giản là không còn link <code>cancel</code> nữa. Client không cần biết luật "đơn đã giao thì không huỷ được" — luật đó chỉ nằm ở một chỗ là server, thay vì bị chép lại trong từng app.</p><p>Lợi ích thật của nó là giảm phụ thuộc: server có thể đổi URL hoặc đổi các hành động được phép mà client vẫn chạy bình thường.</p><p>Quan điểm thật của tôi: <strong>tôi sẽ không làm HATEOAS đầy đủ cho API nội bộ.</strong> Vì gần như không client nào được viết để đi theo link cả — lập trình viên vẫn đọc tài liệu rồi gõ cứng URL. Kết quả là phần hypermedia trở thành dữ liệu thừa không ai dùng, trong khi test của bạn vẫn phải nuôi nó.</p><p>Chỗ nó thật sự đáng tiền là API công khai sống lâu, có nhiều khách hàng mà bạn không điều phối được, và những nghiệp vụ nặng về quy trình, nơi câu hỏi "lúc này tôi làm được gì với đơn hàng này" thay đổi liên tục.</p><p>Còn có một lối đi giữa rẻ tiền mà tôi hay dùng: trả kèm một danh sách các hành động đang khả dụng, kiểu <code>"availableActions": ["cancel", "refund"]</code>, mà không cần làm hypermedia đầy đủ. Cách này thu được phần lớn giá trị — giao diện không phải tự cài lại máy trạng thái — với chi phí rất nhỏ.</p></details>
<pre>Full HATEOAS (HAL)
{
  "id": "O-771", "status": "PENDING", "total": 250.00,
  "_links": {
    "self":     { "href": "/orders/O-771" },
    "cancel":   { "href": "/orders/O-771/cancellations", "method": "POST" },
    "pay":      { "href": "/orders/O-771/payments",      "method": "POST" },
    "customer": { "href": "/customers/C-4" }
  }
}
   ↳ once status = SHIPPED the "cancel" link is simply absent

The pragmatic middle ground I actually ship
{
  "id": "O-771", "status": "PENDING", "total": 250.00,
  "availableActions": ["CANCEL", "PAY", "ADD_ITEM"]
}
   ↳ the UI enables buttons from this list instead of reimplementing the rules</pre>
<table>
<tr><th>Argument for</th><th>Argument against</th></tr>
<tr><td>Server can relocate URIs without breaking clients</td><td>Clients hard-code paths anyway — the decoupling is theoretical</td></tr>
<tr><td>State machine lives only on the server</td><td>UIs still need to know what a link <em>means</em> to label the button</td></tr>
<tr><td>Discoverable — the API explains itself</td><td>OpenAPI does that better, for tooling and humans alike</td></tr>
<tr><td>Required for Richardson Level 3 / true REST</td><td>Bigger payloads, more tests, and no consumer asking for it</td></tr>
<tr><td>Great for long-lived public APIs</td><td>Poor return on a first-party API you deploy alongside its clients</td></tr>
</table>
<p><strong>If you do implement it</strong>, pick a standard format — HAL, JSON:API or Siren — rather than inventing link shapes, keep link relation names stable because they are now part of your contract, and be aware that hypermedia and HTTP caching interact awkwardly, since a link set that varies by user permission makes responses user-specific.</p>
<div class="key-point">Interviewers are testing judgement, not doctrine: <em>"I can implement it and I know why it exists, but I would not add it to an internal API where no client follows links — that is payload and test surface with no consumer. What I do adopt is the underlying idea: the server owns the state machine and tells the client which actions are currently legal."</em></div>`,
      },
      {
        q: 'You are designing a public API from scratch. What do you get right in week one, because it is impossible to change later?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The test I apply is simple: which decisions become permanent the moment a third party integrates? Identifiers top the list, because IDs appear in customers' databases forever — so opaque, non-sequential and immutable, since sequential integers leak volume and invite enumeration. Then the error contract, because every consumer writes branching logic against it and you can never reshape it once they have; ship a single error format with stable machine-readable codes from the first endpoint. Then authentication and the versioning scheme, since both are load-bearing across every call and retrofitting either means a migration for every customer. Then pagination style, because switching from offset to cursor changes the response shape and every client's loop. And then the two cultural commitments that decide whether the API can evolve at all: telling consumers in writing that they must ignore unknown fields, which is what makes additive change safe forever, and requiring a client identifier on every request, which is what lets you measure usage per consumer and therefore ever deprecate anything. Almost everything else — new endpoints, new fields, performance, better docs — can be added later without breaking anyone.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Phép thử tôi dùng rất đơn giản: <strong>quyết định nào trở thành vĩnh viễn ngay khi có bên thứ ba tích hợp vào?</strong></p><p><strong>ID đứng đầu danh sách.</strong> ID của bạn sẽ nằm trong database của khách hàng mãi mãi. Nên để nó vô nghĩa, không tuần tự và không bao giờ đổi. Số nguyên tăng dần vừa để lộ quy mô kinh doanh — khách hàng thứ 47 thì ai cũng đoán được bạn có bao nhiêu khách — vừa mời gọi việc dò quét dữ liệu.</p><p><strong>Tiếp theo là hợp đồng về lỗi.</strong> Mọi client đều viết logic rẽ nhánh dựa trên nó, và bạn sẽ không bao giờ sửa lại được một khi họ đã dùng. Hãy chốt một format lỗi duy nhất với mã lỗi cố định cho máy đọc, ngay từ endpoint đầu tiên.</p><p><strong>Rồi tới cơ chế xác thực và cách đánh version.</strong> Cả hai đều xuất hiện trong mọi lệnh gọi, nên chắp vá lại về sau đồng nghĩa với việc bắt mọi khách hàng phải sửa code theo.</p><p><strong>Rồi tới kiểu phân trang.</strong> Chuyển từ offset sang cursor là đổi luôn hình dạng response và đổi luôn vòng lặp trong code của mọi client.</p><p>Cuối cùng là hai cam kết mang tính văn hoá, quyết định xem API này còn tiến hoá được hay không. <strong>Một, ghi rõ trong tài liệu rằng client phải bỏ qua những field lạ mà nó không biết</strong> — chính điều này khiến việc thêm field mới luôn an toàn về sau. <strong>Hai, bắt buộc mỗi request phải mang mã định danh client</strong> — chính điều này cho phép bạn đo lượng dùng theo từng bên, và nhờ vậy mới có ngày dám gỡ bỏ thứ gì đó.</p><p>Gần như mọi thứ còn lại — thêm endpoint, thêm field, tối ưu hiệu năng, viết tài liệu tốt hơn — đều có thể bổ sung sau mà không làm gãy của ai.</p></details>
<table>
<tr><th>Decision</th><th>Get right on day one</th><th>Why it is irreversible</th></tr>
<tr><td><strong>Identifiers</strong></td><td>UUID/ULID, opaque, immutable</td><td>They live in consumers' databases forever; sequential IDs leak volume and enable enumeration</td></tr>
<tr><td><strong>Error format</strong></td><td>One shape platform-wide + stable codes</td><td>Every consumer branches on it; reshaping breaks all of them at once</td></tr>
<tr><td><strong>Auth</strong></td><td>OAuth2 + short-lived tokens; scopes designed up front</td><td>Retrofitting scopes means re-issuing every credential</td></tr>
<tr><td><strong>Versioning</strong></td><td>Scheme chosen and published, even at v1</td><td>Adding versioning later is itself a breaking change</td></tr>
<tr><td><strong>Pagination</strong></td><td>Cursor for anything that can grow</td><td>Switching styles changes the response shape and every client loop</td></tr>
<tr><td><strong>Date/number formats</strong></td><td>ISO-8601 with timezone; decimals as strings for money</td><td>Float rounding on money is a data-integrity bug you cannot recall</td></tr>
<tr><td><strong>Naming convention</strong></td><td>One casing, one plural rule, one date-field suffix</td><td>Renaming a field is a breaking change on every endpoint that has it</td></tr>
<tr><td><strong>"Ignore unknown fields"</strong></td><td>Written into the docs from day one</td><td>Without it, adding a field breaks strict clients — you lose additive evolution entirely</td></tr>
<tr><td><strong>Client identification</strong></td><td>Required client id / app version on every request</td><td>Without usage data per consumer you can never safely deprecate anything</td></tr>
</table>
<p><strong>What you can safely defer:</strong> more endpoints, more optional fields, better performance, caching headers, SDKs, sandbox environments, richer filtering. These are additive and cost you nothing later — which is exactly why they should not consume week one.</p>
<div class="key-point">Frame it as reversibility, which is the real skill: <em>"I spend design time in proportion to how hard something is to undo. Identifiers, error contract, auth, versioning and pagination are effectively permanent once someone integrates; endpoints and fields are cheap to add. Getting that ordering right is most of what API design is."</em></div>`,
      },
    ],
  },
];
