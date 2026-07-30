// Tools & Technologies — OpenAPI, gRPC, GraphQL, WebSocket, webhooks, gateways
import type { PvQuestion } from '../../types';

export const questions: PvQuestion[] = [
  {
    q: 'How do you use OpenAPI/Swagger properly in a Java or Node project?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>OpenAPI is a machine-readable contract for a REST API, and its value only appears when the spec is <em>generated from or generating</em> code rather than hand-maintained beside it. Two workflows exist: <strong>code-first</strong> (springdoc-openapi or NestJS decorators produce the spec from annotations — least friction, and the spec never lies) and <strong>design-first</strong> (write the YAML, review it with consumers, then generate server stubs and typed clients — better when several teams or external partners depend on it). Either way the payoff is the same: generated typed clients instead of hand-written fetch wrappers, mock servers (Prism, MSW) for frontend work before the backend exists, contract tests in CI, and a breaking-change diff that fails the build. Swagger UI is a side effect, not the point.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>OpenAPI là bản hợp đồng mà máy đọc được cho một REST API, và nó chỉ thật sự có giá trị khi spec được <em>sinh ra từ code</em> hoặc <em>dùng để sinh code</em>, chứ không phải viết tay song song rồi lệch nhau. Có hai cách làm: <strong>code-first</strong> (springdoc-openapi hoặc decorator của NestJS sinh spec từ annotation — ít ma sát nhất, và spec không bao giờ nói dối) và <strong>design-first</strong> (viết YAML trước, cùng review với bên tiêu thụ, rồi sinh server stub và client có type — hợp hơn khi nhiều team hoặc đối tác bên ngoài phụ thuộc vào API). Cách nào thì lợi ích cũng như nhau: có client sinh tự động kèm type thay vì tự viết wrapper fetch, có mock server (Prism, MSW) để frontend làm trước khi backend xong, có contract test trong CI, và có bản diff phát hiện breaking change để fail build. Swagger UI chỉ là sản phẩm phụ, không phải mục đích chính.</p></details>
<pre>// Code-first in Spring Boot (springdoc-openapi)
// dependency: org.springdoc:springdoc-openapi-starter-webmvc-ui
@Operation(summary = "Create an order")
@ApiResponses({
  @ApiResponse(responseCode = "201", description = "Created"),
  @ApiResponse(responseCode = "409", description = "Duplicate idempotency key")
})
@PostMapping("/orders")
ResponseEntity&lt;OrderDto&gt; create(@Valid @RequestBody CreateOrderRequest req) { }
// → /v3/api-docs (JSON) + /swagger-ui.html
// Bean Validation annotations become schema constraints automatically:
// @NotBlank, @Size, @Min → required/minLength/minimum in the spec.

// Design-first: generate both sides from one YAML
openapi-generator-cli generate -i openapi.yaml -g java -o ./client
openapi-generator-cli generate -i openapi.yaml -g typescript-axios -o ./web/api
// or orval / openapi-typescript for React Query hooks + types</pre>
<pre># The spec, and the parts people forget
paths:
  /orders/{id}:
    get:
      parameters: [{ name: id, in: path, required: true,
                     schema: { type: string, format: uuid } }]
      responses:
        "200": { content: { application/json:
                 { schema: { \$ref: "#/components/schemas/Order" } } } }
        "404": { \$ref: "#/components/responses/NotFound" }
components:
  securitySchemes:
    bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }
security: [{ bearerAuth: [] }]        # ← document auth, not just happy paths
# Also model: error shape (RFC 7807 problem+json), pagination params,
# idempotency headers, and rate-limit headers. Consumers need those.

# CI checks that make the contract real
spectral lint openapi.yaml                  # style/consistency rules
openapi-diff old.yaml new.yaml --fail-on-incompatible   # breaking changes
schemathesis run openapi.yaml                # property-based API fuzzing</pre>
<p><strong>Versioning and evolution:</strong> additive changes (new optional fields, new endpoints) do not need a version bump; removing or renaming does. Publish the spec as a build artifact per release so consumers can diff, and keep it in the repo next to the code so a PR that changes behaviour also changes the contract. If the API is public, the spec plus generated SDKs is most of your developer documentation.</p>
<div class="key-point">Make the spec authoritative in one direction — generated from annotations or generating stubs — never hand-synced. Then harvest the real benefits: typed clients, mock servers, contract linting, and automated breaking-change detection in CI.</div>`,
  },
  {
    q: 'When would you choose gRPC over REST, and how does Protobuf work?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>gRPC is a binary RPC framework over HTTP/2 with <strong>Protobuf</strong> as its schema and serialization format: you define services and messages in a <code>.proto</code> file and generate strongly typed client and server code for every language. Compared with REST+JSON it gives smaller payloads, faster serialization, multiplexed streams on one connection, native bidirectional <strong>streaming</strong>, deadlines, and a schema that is enforced at compile time — which makes it a strong fit for internal service-to-service traffic, high-volume or low-latency paths, and streaming APIs. REST stays the better choice for public APIs and browsers, because it is human-debuggable, cacheable by intermediaries, and works everywhere without a proxy (browsers need grpc-web). Protobuf's field <em>numbers</em> are the contract, so evolution rules are strict: add new fields with new numbers, never reuse or renumber, and reserve what you delete.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>gRPC là một framework RPC nhị phân chạy trên HTTP/2, dùng <strong>Protobuf</strong> làm schema và định dạng tuần tự hoá: bạn định nghĩa service và message trong file <code>.proto</code> rồi sinh code client/server có type mạnh cho mọi ngôn ngữ. So với REST+JSON, nó cho payload nhỏ hơn, tuần tự hoá nhanh hơn, nhiều stream ghép trên một kết nối, hỗ trợ <strong>streaming</strong> hai chiều sẵn có, có deadline, và schema được kiểm tra ngay lúc biên dịch — nên rất hợp cho traffic nội bộ giữa các service, cho các đường có lưu lượng lớn hoặc yêu cầu độ trễ thấp, và cho các API kiểu streaming. REST vẫn là lựa chọn tốt hơn cho API công khai và cho browser, vì dễ debug bằng mắt, các tầng trung gian cache được, và chạy ở đâu cũng được mà không cần proxy (browser thì phải qua grpc-web). Với Protobuf, <em>số hiệu field</em> mới là hợp đồng thật, nên quy tắc tiến hoá rất chặt: thêm field thì dùng số mới, không bao giờ dùng lại hay đổi số, và phải <code>reserved</code> những số đã xoá.</p></details>
<pre>// order.proto — the single source of truth for both sides
syntax = "proto3";
package acme.orders.v1;

service OrderService {
  rpc GetOrder    (GetOrderRequest)  returns (Order);              // unary
  rpc WatchOrders (WatchRequest)     returns (stream OrderEvent);  // server stream
  rpc Upload      (stream Chunk)     returns (UploadResult);       // client stream
  rpc Chat        (stream Msg)       returns (stream Msg);         // bidirectional
}
message Order {
  string id        = 1;      // ← the NUMBER is the wire contract, not the name
  string customer  = 2;
  int64  total_cents = 3;
  reserved 4;                // deleted field: never reuse the number
  repeated Item items = 5;
}
// Generate: protoc / buf → Java stubs, TS clients, Go, Python...
// Evolution rules: adding a field is backward compatible; renaming is fine
// on the wire (numbers matter); changing a type or number is BREAKING.</pre>
<pre>                gRPC                        REST + JSON
payload         binary, compact             text, verbose but readable
schema          .proto, compile-time        OpenAPI, optional at runtime
transport       HTTP/2 multiplexed          HTTP/1.1 or 2
streaming       first-class, bidirectional  SSE / WebSocket bolted on
browser         needs grpc-web + proxy      native
caching         no HTTP caching semantics   GET is cacheable everywhere
debugging       needs grpcurl/buf tooling   curl and a browser
best for        internal microservices,     public APIs, browser clients,
                mobile↔backend, streaming   webhooks, third parties

// Things to mention as a senior
- deadlines are mandatory in practice: stub.withDeadlineAfter(2, SECONDS)
  — a gRPC call without a deadline is a resource leak waiting to happen
- status codes are gRPC's own (NOT_FOUND, DEADLINE_EXCEEDED, UNAVAILABLE)
  and retries belong in the service config with backoff for UNAVAILABLE only
- load balancing: HTTP/2 keeps one long-lived connection, so an L4 balancer
  (or plain ClusterIP) will NOT spread load → use client-side LB, a mesh,
  or a proxy that speaks HTTP/2 (Envoy)
- health checking + reflection for tooling; buf for lint/breaking-change CI</pre>
<div class="key-point">gRPC + Protobuf for internal, high-throughput, or streaming traffic where both ends are yours and code generation pays off; REST + JSON at the public edge and for browsers. Protobuf field numbers are the contract — add, never renumber or reuse — and always set deadlines and use HTTP/2-aware load balancing.</div>`,
  },
  {
    q: 'What does the GraphQL toolchain look like on the server and the client?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>On the server you pick between a <strong>schema-first</strong> stack (Apollo Server, GraphQL Java, Spring for GraphQL: write SDL, implement resolvers) and a <strong>code-first</strong> one (NestJS or type-graphql generating SDL from classes). The two pieces that make it production-grade are <strong>DataLoader</strong>, which batches and caches per request to kill the N+1 problem that resolvers create by design, and cost controls — depth and complexity limits, pagination everywhere, and persisted queries for public clients. On the client, Apollo Client, urql, or Relay handle normalized caching and optimistic updates, while <strong>GraphQL Code Generator</strong> turns the schema and your documents into typed hooks so the compiler catches a renamed field. Federation (Apollo Federation) composes multiple services into one graph when several teams own different slices.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Ở phía server, bạn chọn giữa hướng <strong>schema-first</strong> (Apollo Server, GraphQL Java, Spring for GraphQL: viết SDL rồi hiện thực resolver) và hướng <strong>code-first</strong> (NestJS hay type-graphql sinh SDL từ class). Hai thứ khiến GraphQL đủ chuẩn production là <strong>DataLoader</strong> — gom và cache theo từng request để triệt tiêu vấn đề N+1 mà chính mô hình resolver sinh ra — và các biện pháp kiểm soát chi phí truy vấn: giới hạn độ sâu và độ phức tạp, phân trang ở mọi danh sách, và dùng persisted query cho client công khai. Ở phía client, Apollo Client, urql hay Relay lo phần cache đã chuẩn hoá và optimistic update, còn <strong>GraphQL Code Generator</strong> biến schema cùng các document của bạn thành hook có type để compiler bắt được khi một field bị đổi tên. Federation (Apollo Federation) thì ghép nhiều service thành một graph duy nhất khi mỗi team sở hữu một phần.</p></details>
<pre># Schema is the contract (SDL)
type Order { id: ID!  total: Int!  customer: Customer!  items: [Item!]! }
type Query  { order(id: ID!): Order  orders(first: Int!, after: String): OrderConnection! }
type Mutation { placeOrder(input: PlaceOrderInput!): PlaceOrderPayload! }
# Connection/edge pagination (cursor-based) is the convention — offset
# pagination breaks with concurrent inserts.</pre>
<pre>// The N+1 problem is the default, not an accident
// query { orders(first:50) { customer { name } } }
//   → 1 query for orders + 50 queries for customers
const customerLoader = new DataLoader(async (ids) =>
  orderBy(await db.customers.findMany({ where: { id: { in: ids } } }), ids));
const resolvers = {
  Order: { customer: (o, _a, ctx) => ctx.loaders.customer.load(o.customerId) },
};
// → 1 + 1 queries. Create loaders PER REQUEST (they cache; a global
// loader would serve stale data across users).
// Java: Spring for GraphQL @BatchMapping does the same thing declaratively.

// Cost + safety controls (see also the GraphQL security question)
depthLimit(10), costAnalysis({ maximumCost: 1000 }),
introspection: false in production, persisted queries for public apps,
field-level authorization inside resolvers — never assume the parent check.</pre>
<pre>// Client side
// codegen.ts → typed hooks from schema + your .graphql documents
const { data } = useOrderQuery({ variables: { id } });   // fully typed
// Apollo normalized cache: entities keyed by __typename + id, so one
// mutation result updates every screen showing that entity.
// Cache invalidation options: refetchQueries, cache.modify, or returning
// the updated entity from the mutation (best — the cache self-heals).

// When NOT to use GraphQL
- a small internal API with one consumer → REST is less machinery
- file uploads/downloads and binary streaming → HTTP endpoints
- heavy caching at the CDN edge → GraphQL POSTs are not cacheable
  (persisted queries over GET can be)
// GraphQL earns its cost with many clients, deeply related data, and
// mobile apps that need to minimize round trips and payload size.</pre>
<div class="key-point">Server: schema (SDL or code-first) + resolvers + DataLoader per request + depth/complexity limits. Client: a normalized cache (Apollo/urql/Relay) plus generated types. GraphQL's flexibility moves N+1 and authorization into resolvers — solve both deliberately or it will not survive production.</div>`,
  },
  {
    q: 'How do you implement real-time features — WebSocket, SSE, and scaling across instances?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Pick the simplest transport that fits the direction of data. <strong>SSE</strong> is one-way server→client over plain HTTP with automatic reconnection and <code>Last-Event-ID</code> resume — perfect for notifications, live dashboards, and streaming LLM tokens. <strong>WebSocket</strong> is a full-duplex upgraded connection for chat, collaborative editing, and games. Long polling remains the fallback. The hard part is never the first connection, it is scaling: connections are <em>stateful</em>, so with N instances a message published on one instance must reach subscribers on the others — that is what a <strong>Redis pub/sub adapter</strong> (Socket.IO), a message broker, or a purpose-built service (Ably, Pusher, Centrifugo) is for. Then you must handle authentication on the handshake, heartbeats and idle timeouts through proxies, backpressure, and reconnect-with-replay so a client that drops for ten seconds does not miss events.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hãy chọn transport đơn giản nhất phù hợp với chiều dữ liệu. <strong>SSE</strong> là một chiều server→client trên HTTP thường, có sẵn tự động kết nối lại và resume bằng <code>Last-Event-ID</code> — rất hợp cho thông báo, dashboard trực tiếp và stream token của LLM. <strong>WebSocket</strong> là kết nối song công sau khi upgrade, dùng cho chat, soạn thảo cộng tác và game. Long polling vẫn còn giá trị làm phương án dự phòng. Phần khó không bao giờ là kết nối đầu tiên, mà là chuyện scale: kết nối là <em>có trạng thái</em>, nên khi có N instance, một message publish ở instance này phải tới được các subscriber đang nằm ở instance khác — đó là việc của <strong>Redis pub/sub adapter</strong> (Socket.IO), của một message broker, hoặc của một dịch vụ chuyên biệt (Ably, Pusher, Centrifugo). Sau đó còn phải lo: xác thực ngay ở bước handshake, heartbeat và idle timeout khi đi qua proxy, xử lý backpressure, và cơ chế kết nối lại có phát lại dữ liệu để client mất mạng mười giây không bị hụt event.</p></details>
<pre>// SSE — often the right answer, and far simpler than WebSocket
// Server (Node)
res.writeHead(200, { 'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache', Connection: 'keep-alive',
  'X-Accel-Buffering': 'no' });          // ← or nginx buffers your stream
res.write(\`id: \${event.id}\\nevent: order\\ndata: \${JSON.stringify(e)}\\n\\n\`);
// Client
const es = new EventSource('/api/stream');   // auto-reconnects
es.addEventListener('order', (e) => update(JSON.parse(e.data)));
// Spring: return a Flux&lt;ServerSentEvent&lt;T&gt;&gt; or SseEmitter
// Keep a heartbeat comment (": ping\\n\\n") every 15-30s so proxies and
// load balancers do not kill an idle connection.

// WebSocket — when the client also sends continuously
// Java: Spring WebSocket + STOMP (@MessageMapping, SimpMessagingTemplate)
// Node: ws / Socket.IO
io.on('connection', (socket) => {          // authenticate FIRST
  const user = verifyJwt(socket.handshake.auth.token);   // no cookies-only
  socket.join(\`tenant:\${user.tenantId}\`); // rooms = authorization boundary
  socket.on('message', (m) => { /* validate + authorize every message */ });
});</pre>
<pre>// Scaling: the instance that holds the socket is rarely the one with the news
[pod A] ws clients 1..5000        [pod B] ws clients 5001..10000
      ↖ subscribe ─ Redis pub/sub (or Kafka topic) ─ publish ↗
// Socket.IO: io.adapter(createAdapter(pubClient, subClient))
// Spring: an external broker relay (RabbitMQ/ActiveMQ STOMP) instead of
//         the in-memory SimpleBroker, which only works on one instance.
// Sticky sessions are needed for Socket.IO's HTTP long-poll fallback
// (ingress annotation: affinity: cookie), and always for STOMP over
// multiple nodes without a broker relay.

// Production concerns that get missed
auth        : token in the handshake (query string is logged — prefer the
              Sec-WebSocket-Protocol header or a short-lived ticket),
              re-check authorization per message, and expire the socket
              when the token expires
resume      : give every event a monotonic id; on reconnect the client
              sends the last id and you replay the gap (Redis stream/list)
backpressure: drop or coalesce for slow consumers; never buffer unbounded
limits      : max connections per user, message size, rate per socket
ops         : connection count and message lag as metrics; graceful
              shutdown must close sockets so clients reconnect elsewhere
mobile      : real push (APNs/FCM) for background delivery — a socket
              cannot stay open when the app is suspended</pre>
<div class="key-point">SSE for server→client streams, WebSocket for two-way, push services for mobile background. The engineering is in scale-out: a Redis/broker fan-out layer between instances, authentication on the handshake plus per-message authorization, heartbeats through proxies, and event ids so reconnects can replay the gap.</div>`,
  },
  {
    q: 'How do you design and consume webhooks reliably?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>A webhook is someone else's HTTP call into your system (or yours into theirs), so both sides need the same three properties: <strong>authenticity</strong>, <strong>idempotency</strong>, and <strong>durability</strong>. As a consumer: verify an HMAC signature over the <em>raw</em> body with a timestamp to stop replay, respond 2xx immediately after persisting the event, and process asynchronously — never do the work inside the request, because a slow handler causes the provider to time out and retry. As a producer: sign every delivery, include a stable event id and type, retry with exponential backoff and jitter, expose a delivery log with manual replay, and disable endpoints that fail for days. On both sides, expect duplicates and out-of-order arrival, and treat the webhook as a hint rather than the source of truth — reconcile against the provider's API for anything financial.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Webhook là một lời gọi HTTP từ hệ thống của người khác vào hệ thống của bạn (hoặc ngược lại), nên cả hai phía đều cần đúng ba tính chất: <strong>xác thực được nguồn</strong>, <strong>idempotent</strong>, và <strong>bền vững</strong>. Khi là bên nhận: verify HMAC signature trên <em>raw body</em> kèm timestamp để chống replay, lưu event xuống rồi trả 2xx ngay, và xử lý bất đồng bộ — đừng làm việc nặng ngay trong request, vì handler chậm sẽ khiến bên gửi timeout rồi retry. Khi là bên gửi: ký mọi lần gửi, kèm một event id ổn định và loại event, retry với backoff luỹ thừa cộng jitter, cung cấp log các lần gửi kèm khả năng replay thủ công, và tự tắt endpoint nào lỗi liên tục nhiều ngày. Ở cả hai phía, hãy giả định sẽ có trùng lặp và sai thứ tự, và coi webhook chỉ là một tín hiệu gợi ý chứ không phải nguồn sự thật — với mọi thứ liên quan tới tiền thì phải đối chiếu lại bằng API của bên kia.</p></details>
<pre>// CONSUMING a webhook — the correct shape
app.post('/webhooks/stripe',
  express.raw({ type: 'application/json' }),      // raw body, not parsed!
  async (req, res) => {
    // 1. verify signature over the raw bytes + timestamp
    const [t, sig] = parseHeader(req.headers['stripe-signature']);
    if (Math.abs(Date.now()/1000 - t) > 300) return res.sendStatus(400);
    const expected = hmacSha256(secret, \`\${t}.\${req.body}\`);
    if (!timingSafeEqual(expected, sig)) return res.sendStatus(401);

    // 2. persist + dedup by the provider's event id (unique constraint)
    const event = JSON.parse(req.body);
    const inserted = await db.webhookEvents.insertIfAbsent(event.id, event);

    // 3. ACK FAST, then work asynchronously
    res.sendStatus(200);
    if (inserted) await queue.add('process-webhook', { id: event.id });
  });
// Why raw body: any re-serialization (key order, whitespace) breaks HMAC.
// Why ack first: providers time out in 5-30s and then retry — a slow
// handler multiplies your load exactly when you are already slow.</pre>
<pre>// PRODUCING webhooks — what subscribers need from you
POST https://customer.example.com/hooks
X-Event-Id: evt_01H...            # stable across retries → dedup key
X-Event-Type: order.paid
X-Timestamp: 1722330000
X-Signature: sha256=...           # HMAC over timestamp + "." + raw body
{ "id":"evt_01H...", "type":"order.paid", "created":...,
  "data": { "orderId":"o_77", "amountCents": 4990 } }

// Delivery rules
- retries: 1m, 5m, 15m, 1h, 6h, 24h with jitter; give up after ~3 days
- treat 2xx as success; 410 Gone → disable the endpoint; 4xx → do not retry
  (except 408/429); 5xx/timeout → retry
- per-endpoint concurrency + circuit breaker so one dead subscriber cannot
  consume your worker pool
- a delivery log UI (payload, response, attempts) + "resend" button —
  this removes 90% of integration support tickets
- send events, not commands, and include enough data that the consumer
  usually does not need to call back (but let them, for reconciliation)
- offer secret rotation with two active signing secrets during overlap</pre>
<p><strong>Ordering and reconciliation:</strong> HTTP delivery cannot guarantee order, so include a sequence number or version per entity and let consumers ignore an older version; for money, always reconcile with a scheduled pull of the provider's API rather than trusting that every webhook arrived. For local development use a tunnel (ngrok, Stripe CLI, smee.io), and in tests replay stored real payloads — hand-written fixtures drift from reality.</p>
<div class="key-point">Verify HMAC over the raw body with a timestamp, dedup on the provider's event id, acknowledge immediately and process from a queue. As a producer: sign, retry with backoff, keep a replayable delivery log, and disable dead endpoints — and never treat webhooks as ordered or guaranteed.</div>`,
  },
  {
    q: 'What does an API gateway do, and how do you choose one?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>A gateway is the single front door that holds the concerns no individual service should re-implement: TLS termination, routing and path rewriting, authentication and token validation, rate limiting and quotas, CORS, request/response transformation, retries and timeouts, and consistent access logging and metrics. That is genuinely valuable — but the failure mode is putting <em>business logic</em> in it, which turns the gateway into a shared bottleneck that every team must queue behind to deploy. Choosing is mostly about your existing platform: <strong>Kong</strong> or <strong>Apigee</strong> for API-product features (developer portal, monetization, plugins), <strong>Spring Cloud Gateway</strong> when the team is Java and wants filters in code, <strong>Nginx/Traefik/Envoy or an ingress controller</strong> when you mainly need routing and TLS in Kubernetes, and a managed <strong>AWS API Gateway</strong> when you want zero operations and are already serverless.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Gateway là cửa vào duy nhất, nơi tập trung những việc mà không service nào nên làm lại: terminate TLS, routing và rewrite path, xác thực và verify token, rate limit và quota, CORS, biến đổi request/response, retry và timeout, cùng với access log và metric nhất quán. Đó là giá trị thật — nhưng cái bẫy là nhét <em>logic nghiệp vụ</em> vào gateway, khiến nó thành một điểm nghẽn dùng chung mà mọi team phải xếp hàng chờ mỗi lần deploy. Việc chọn công cụ chủ yếu phụ thuộc nền tảng bạn đang có: <strong>Kong</strong> hoặc <strong>Apigee</strong> nếu cần các tính năng của một sản phẩm API (cổng dành cho developer, thu phí, hệ plugin); <strong>Spring Cloud Gateway</strong> khi team làm Java và muốn viết filter bằng code; <strong>Nginx/Traefik/Envoy hay ingress controller</strong> khi chủ yếu chỉ cần routing và TLS trong Kubernetes; còn <strong>AWS API Gateway</strong> dạng managed thì hợp khi muốn khỏi phải vận hành gì và đã dùng serverless.</p></details>
<pre>// What belongs in the gateway (cross-cutting, identical for everyone)
✅ TLS termination, HTTP/2, compression
✅ routing by host/path/header, canary weights, blue-green switching
✅ authentication: validate the JWT once (signature, iss, aud, exp) and
   pass identity downstream; or exchange an opaque token for a short JWT
   ("phantom token") so services never call the auth server
✅ rate limiting and quotas per API key/user/tenant
✅ CORS, request size limits, timeouts, retries with budgets
✅ observability: one place with request id generation, access logs, RED metrics

// What does NOT belong (the anti-pattern)
❌ business rules ("if order.total > 100 then …")
❌ data aggregation across services → that is a BFF, owned by the client team
❌ per-team custom plugins deployed on a shared gateway release train
❌ authorization decisions that need domain data → services own those</pre>
<pre>// Spring Cloud Gateway — code/config in a Java shop
spring.cloud.gateway.routes:
  - id: orders
    uri: lb://orders-api                     # service discovery
    predicates: [Path=/api/orders/**]
    filters:
      - StripPrefix=1
      - name: RequestRateLimiter
        args: { redis-rate-limiter.replenishRate: 20, burstCapacity: 40 }
      - name: CircuitBreaker
        args: { name: ordersCB, fallbackUri: forward:/fallback/orders }

# Kong (declarative, plugin-driven)
services: [{ name: orders, url: http://orders-api:8080 }]
routes:   [{ name: orders, service: orders, paths: ["/api/orders"] }]
plugins:  [{ name: jwt }, { name: rate-limiting, config: { minute: 60 } },
           { name: correlation-id }, { name: prometheus }]</pre>
<pre>// Choosing, in one pass
Kubernetes-native, just routing + TLS      → ingress-nginx / Traefik / Gateway API
Service-to-service policy, mTLS, retries   → service mesh (Istio/Linkerd),
                                             not a gateway
Java team, custom filters, Spring ecosystem → Spring Cloud Gateway
API as a product: portal, keys, plans      → Kong / Apigee / Gravitee
Serverless / minimal ops on AWS            → API Gateway + Lambda authorizer
Client-shaped aggregation per app          → BFF service, owned by that
                                             frontend team
// And keep it stateless + horizontally scaled: the gateway must never be
// the single point of failure it was introduced to protect you from.</pre>
<div class="key-point">Put cross-cutting edge concerns in the gateway — TLS, routing, token validation, rate limits, CORS, observability — and keep business logic and cross-service aggregation out (that is a BFF). Choose by platform fit, and remember a mesh handles east-west traffic while a gateway handles north-south.</div>`,
  },
];
