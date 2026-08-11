// Interview data: MICROSERVICES
import type { PvTopic } from '../../types';

export const topics: PvTopic[] = [
  {
    id: 'microservices',
    name: 'Microservices',
    icon: '🧩',
    questions: [
      // ──── 1. FUNDAMENTALS & SERVICE DECOMPOSITION ────
      {
        q: 'What is microservice architecture and when should you choose it?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Microservices split a system into independently deployable services, each owning one business capability, and the main reason to use them is organizational, letting many teams ship without blocking each other. They fit when there is real team-scaling pressure or genuinely different scaling and technology needs, not because they are popular. The costs are high: network latency, distributed data, eventual consistency, and heavy operational work in observability, CI/CD, and on-call. A good default is to start with a modular monolith and extract services along proven boundaries, while avoiding a distributed monolith where services must still deploy together.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Microservices chia hệ thống thành nhiều service deploy độc lập, mỗi service phụ trách một mảng nghiệp vụ. Lý do chính để dùng chúng thực ra nằm ở khía cạnh tổ chức: nhiều team có thể cùng làm và cùng release mà không chặn lẫn nhau. Chỉ nên chọn microservices khi thật sự có áp lực về số lượng team, hoặc khi các phần của hệ thống thật sự cần scale và dùng công nghệ khác nhau — chứ không phải vì nó đang là xu hướng. Cái giá phải trả khá đắt: độ trễ mạng, dữ liệu bị phân mảnh, eventual consistency, cùng khối lượng vận hành lớn cho observability, CI/CD và trực on-call. Hướng đi mặc định hợp lý là bắt đầu bằng một modular monolith, rồi tách dần thành service tại những ranh giới đã được thực tế kiểm chứng; đồng thời tránh rơi vào distributed monolith — tức là các service tách rời nhưng vẫn buộc phải deploy cùng lúc với nhau.</p></p></details>
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
        q: 'How do you decide service boundaries when splitting a monolith?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>There is no formula for service boundaries, so heuristics are used. Draw boundaries around business capabilities and bounded contexts, not technical layers, and let each service own a cohesive part of the domain and its data. Things that change together and are read together belong together, and a good boundary avoids chatty cross-service calls and shared data. Signs of a wrong boundary are frequent distributed transactions, cross-service joins, and changes that ripple across services, so when unsure prefer coarser services because merging is easier than splitting.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Không có công thức cho ranh giới service, nên người ta dùng các heuristic. Hãy vẽ ranh giới quanh các business capability và bounded context, không phải quanh các tầng kỹ thuật, và để mỗi service sở hữu một phần gắn kết của domain cùng dữ liệu của nó. Những thứ thay đổi cùng nhau và được đọc cùng nhau thì nên nằm cùng nhau, và một ranh giới tốt tránh các lời gọi chatty giữa các service và tránh dùng chung dữ liệu. Dấu hiệu của một ranh giới sai là thường xuyên cần distributed transaction, phải join giữa các service, và các thay đổi lan truyền qua nhiều service, nên khi chưa chắc chắn thì hãy ưu tiên các service to hơn vì gộp lại dễ hơn tách ra.</p></details>
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
        q: 'What is the Strangler Fig pattern in microservice migration?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The <strong>Strangler Fig</strong> pattern rewrites a monolith step by step instead of all at once. A proxy sits in front of the old system, and one feature at a time is moved to a new service while the rest still runs on the monolith. This is safe because each small slice can be rolled back on its own. The main risks are running two systems at the same time and finishing the work instead of stopping halfway.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Pattern <strong>Strangler Fig</strong> viết lại một monolith theo từng bước thay vì làm tất cả cùng lúc. Một proxy đứng trước hệ thống cũ, và mỗi lần chỉ chuyển một tính năng sang service mới trong khi phần còn lại vẫn chạy trên monolith. Cách này an toàn vì mỗi phần nhỏ có thể được rollback độc lập. Rủi ro chính là phải vận hành hai hệ thống cùng lúc và phải làm dứt điểm thay vì dừng lại nửa chừng.</p></details>
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
        q: 'What is a distributed monolith? What are the warning signs?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>A distributed monolith has the costs of microservices, like network hops and partial failure, but keeps the tight coupling of a monolith, so services must still deploy together. Warning signs include lockstep releases, a shared database, deep synchronous call chains, shared libraries updated together, and no independent deployment. The usual cause is splitting by technical layer or splitting too early before the domain is clear. The fix is to redraw boundaries around business capabilities and decouple with async events and stable contracts.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một distributed monolith mang cái giá của microservices, như network hop và partial failure, nhưng vẫn giữ sự coupling chặt của một monolith, nên các service vẫn phải deploy cùng nhau. Các dấu hiệu cảnh báo gồm release theo kiểu lockstep, dùng chung một database, các chuỗi gọi đồng bộ sâu, các thư viện dùng chung được cập nhật cùng lúc, và không thể deploy độc lập. Nguyên nhân thường gặp là chia theo tầng kỹ thuật hoặc chia quá sớm khi domain còn chưa rõ ràng. Cách khắc phục là vẽ lại ranh giới theo các business capability và tách rời bằng async event cùng các contract ổn định.</p></details>
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
        q: 'Why is database-per-service important in microservices?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Giving each service its own database is what makes microservices truly independent, because a shared database couples services at the schema level and prevents separate deployment or scaling, creating a distributed monolith. Owning its data also lets each service choose the right store and enforces clean API boundaries, since the only way in is through the service. The cost is that cross-service joins and transactions are gone, so API composition, CQRS read models, and sagas are used instead. The hardest parts in practice are splitting a shared database during migration and resisting the urge to query another service's tables directly.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Việc mỗi service có database riêng chính là thứ làm cho microservices thực sự độc lập. Một database dùng chung sẽ trói các service lại với nhau ở mức schema, khiến không thể deploy hay scale riêng từng service, và kết quả là một distributed monolith. Khi tự sở hữu dữ liệu, mỗi service còn được chọn loại kho lưu trữ phù hợp nhất với mình, đồng thời buộc phải có ranh giới API rõ ràng vì cách duy nhất để lấy dữ liệu là đi qua chính service đó. Cái giá phải trả là mất khả năng join và transaction xuyên service; thay vào đó phải dùng API composition, read model theo CQRS và saga. Phần khó nhất trên thực tế là tách một database dùng chung trong lúc migration, và giữ mình không sa vào cám dỗ query thẳng vào bảng của service khác.</p></p></details>
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

      // ──── 2. COMMUNICATION & API DESIGN ────
      {
        q: 'What is the difference between synchronous and asynchronous communication between services?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Synchronous communication, such as REST or gRPC, is a request the caller waits on, while asynchronous communication through a broker like Kafka or SQS sends a message and gets the result later or as an event. Synchronous is simpler and gives an immediate answer, but it couples services in time, so a slow or down callee slows the caller, and long call chains add up latency and failure risk. Asynchronous decouples services and smooths load, at the cost of eventual consistency and harder debugging. A good rule is synchronous for queries that need an immediate answer and asynchronous for commands and background work, while avoiding deep synchronous call chains.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Giao tiếp đồng bộ như REST hay gRPC là kiểu gọi mà bên gọi phải đứng chờ kết quả; còn giao tiếp bất đồng bộ qua broker như Kafka hay SQS thì chỉ gửi message đi rồi nhận kết quả sau, hoặc nhận dưới dạng event. Đồng bộ đơn giản hơn và cho câu trả lời ngay, nhưng nó buộc các service phải cùng sống tại một thời điểm: bên được gọi chậm hoặc chết thì bên gọi cũng chậm theo, và chuỗi gọi càng dài thì độ trễ lẫn xác suất lỗi càng cộng dồn. Bất đồng bộ giúp các service tách rời nhau và san đều tải, đổi lại phải chấp nhận eventual consistency và việc debug khó hơn. Quy tắc thực dụng là: dùng đồng bộ cho những truy vấn cần trả lời ngay, dùng bất đồng bộ cho command và các tác vụ chạy nền, đồng thời tránh những chuỗi gọi đồng bộ quá sâu.</p></p></details>
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
        q: 'What is service discovery in microservices?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>In a dynamic environment instances start and stop constantly, so hard-coded IP addresses do not work, and <strong>service discovery</strong> lets a caller find a healthy instance at runtime. There are two models: client-side, where the client queries a registry such as Consul or Eureka and balances load itself, and server-side, where it uses a stable endpoint like a load balancer or DNS that does the routing. In Kubernetes this is mostly built in, since a Service gives a stable DNS name and virtual IP in front of healthy pods. Health checking is essential so unhealthy instances are removed quickly, and the risks are stale entries and a registration surge on mass restart.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Trong môi trường động, các instance liên tục được tạo mới rồi bị huỷ nên không thể hard-code địa chỉ IP; <strong>service discovery</strong> chính là cơ chế giúp bên gọi tìm ra một instance còn khoẻ ngay tại runtime. Có hai mô hình. Với client-side discovery, client tự truy vấn một registry như Consul hay Eureka rồi tự cân bằng tải. Với server-side discovery, client chỉ gọi tới một điểm cố định như load balancer hoặc DNS và để nơi đó lo việc định tuyến. Trong Kubernetes thì phần này gần như có sẵn: mỗi Service cung cấp một tên DNS ổn định cùng một virtual IP đứng trước các pod đang khoẻ. Health check là thành phần bắt buộc để loại nhanh những instance đã hỏng; hai rủi ro hay gặp là registry còn sót lại entry cũ, và tình trạng hàng loạt instance cùng đăng ký lại một lúc khi restart đồng loạt.</p></p></details>
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
        q: 'What is the BFF pattern in microservices?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A <strong>BFF</strong> is a separate API layer for each client type, such as web, mobile, or TV, that aggregates and reshapes downstream services for that client's exact needs. It exists because a single shared API forces mobile clients to over-fetch and make many round-trips, and because client-specific logic clutters a shared gateway. Each frontend team owns its BFF, keeping client concerns out of the core services. The trade-offs are some duplicated aggregation across BFFs and the risk of a BFF growing into a mini-monolith with logic that belongs downstream; GraphQL is one common way to do the aggregation.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p><strong>BFF</strong> là một lớp API riêng cho từng loại client — web, mobile hay TV — có nhiệm vụ tổng hợp và định dạng lại dữ liệu từ các service bên dưới cho vừa đúng nhu cầu của client đó. Nó ra đời vì một API dùng chung cho tất cả sẽ buộc client mobile phải tải về thừa dữ liệu và gọi đi gọi lại nhiều lượt, trong khi nhét logic riêng của từng client vào một gateway chung sẽ khiến gateway đó rối tung lên. Mỗi team frontend tự quản BFF của mình, nhờ vậy những thứ chỉ liên quan tới client không lọt vào các service lõi. Đánh đổi là phần logic tổng hợp bị lặp lại đôi chút giữa các BFF, kèm rủi ro một BFF phình to thành mini-monolith chứa cả logic lẽ ra phải nằm ở tầng dưới; GraphQL là một lựa chọn phổ biến cho phần tổng hợp này.</p></p></details>
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
        q: 'How do you evolve an API without breaking consumers? (contracts and versioning)',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The rule for evolving an API is backward compatibility, so consumers do not have to upgrade at the same time. This means additive changes only, such as adding optional fields, and never renaming, removing, or changing the meaning of existing ones, while consumers ignore unknown fields. When a breaking change is unavoidable, version the API, run old and new side by side, and deprecate the old one on a clear timeline. Consumer-driven contract tests like Pact catch breaks in CI, and the same rules apply to event payloads because events are also APIs.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Nguyên tắc khi tiến hóa một API là backward compatibility, để các consumer không phải nâng cấp cùng lúc. Điều này nghĩa là chỉ thêm mới, chẳng hạn thêm các field optional, và không bao giờ đổi tên, xóa, hay thay đổi ý nghĩa của các field đang có, trong khi consumer thì bỏ qua các field lạ. Khi một breaking change là không tránh khỏi, hãy version API, chạy song song bản cũ và bản mới, và deprecate bản cũ theo một lộ trình rõ ràng. Các consumer-driven contract test như Pact bắt được các lỗi phá vỡ ngay trong CI, và cùng các quy tắc đó áp dụng cho payload của event vì event cũng là API.</p></details>
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
      {
        q: 'What is a service mesh and when would you use one?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A <strong>service mesh</strong> moves networking concerns like <code>mTLS</code>, retries, timeouts, circuit breaking, and telemetry out of application code and into sidecar proxies next to each service. The benefit is one consistent set of security and resilience rules across services in any language. The cost is extra operational complexity and some added latency from the extra network hop. It fits large systems with many services in many languages, but it is overkill for only a few services.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một <strong>service mesh</strong> đưa các phần xử lý liên quan tới mạng như <code>mTLS</code>, retry, timeout, circuit breaking và telemetry ra khỏi code ứng dụng, chuyển xuống các sidecar proxy đặt cạnh mỗi service. Lợi ích là có một bộ quy tắc bảo mật và resilience nhất quán trên các service viết bằng bất kỳ ngôn ngữ nào. Cái giá phải trả là độ phức tạp vận hành tăng thêm và một chút latency phát sinh từ network hop phụ. Nó phù hợp với các hệ thống lớn có nhiều service viết bằng nhiều ngôn ngữ, nhưng lại quá mức cần thiết nếu chỉ có vài service.</p></details>
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

      // ──── 3. DATA CONSISTENCY ACROSS SERVICES ────
      {
        q: 'What is the dual-write problem?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The dual-write problem is that a service must update its database and publish an event, but these are two systems with no shared transaction. If one succeeds and the other fails, or the process crashes in between, the data and the events become inconsistent. Reordering the calls or using try/catch does not fix this because there is always a crash window. The correct fix is a single write, such as the transactional outbox or change data capture from the database log.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Vấn đề dual-write là một service phải vừa cập nhật database vừa publish một event, nhưng đây là hai hệ thống không có transaction dùng chung. Nếu một cái thành công còn cái kia thất bại, hoặc tiến trình crash ở giữa, thì dữ liệu và các event trở nên không nhất quán. Đổi thứ tự các lời gọi hay dùng try/catch không giải quyết được vấn đề này vì luôn tồn tại một khoảng thời gian có thể crash. Cách khắc phục đúng là chỉ ghi vào một chỗ, chẳng hạn dùng transactional outbox hoặc change data capture từ log của database.</p></details>
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
        q: 'What is the Transactional Outbox pattern?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The <strong>Transactional Outbox</strong> pattern solves the dual-write problem, where a service cannot save to a database and publish an event as one atomic step. The fix is to write the event into an outbox table inside the same database transaction, so both succeed or both fail. A separate worker or a change data capture tool like Debezium then reads the outbox and sends the events to the broker. This gives at-least-once delivery, so consumers must be idempotent.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Pattern <strong>Transactional Outbox</strong> giải quyết vấn đề dual-write, khi một service không thể vừa lưu vào database vừa publish một event như một bước atomic duy nhất. Cách khắc phục là ghi event vào một bảng outbox trong cùng một transaction database, nhờ đó cả hai cùng thành công hoặc cùng thất bại. Sau đó một worker riêng hoặc một công cụ change data capture như Debezium sẽ đọc outbox và gửi các event tới broker. Cách này cho delivery at-least-once, nên các consumer phải idempotent.</p></details>
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
        a: `<div class="interview-answer"><p>The <strong>Saga</strong> pattern runs a business transaction across several services without one shared distributed transaction. It splits the work into local steps, and each step has a compensating action that undoes it if a later step fails. There are two styles: choreography, where services react to each other's events, and orchestration, where one coordinator drives the steps. Instead of a rollback you get compensation, and each compensation must be idempotent and reliable.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Pattern <strong>Saga</strong> chạy một business transaction trải trên nhiều service mà không cần một distributed transaction dùng chung. Nó chia công việc thành các bước cục bộ, và mỗi bước có một compensating action để hoàn tác nếu một bước sau đó thất bại. Có hai kiểu: choreography, khi các service phản ứng với event của nhau, và orchestration, khi một coordinator điều phối các bước. Thay vì rollback thì bạn có compensation, và mỗi compensation phải idempotent và đáng tin cậy.</p></details>
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
        q: 'What is idempotency and why is it important in distributed systems?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Idempotency means that doing an operation many times has the same effect as doing it once, and it is required because networks force retries and every retry risks a duplicate. In HTTP, GET, PUT, and DELETE are naturally idempotent while POST is not, which is why create endpoints take an idempotency key that the client makes once and reuses on retries, and the server deduplicates on it. The key and its result must be stored together with the side effect in one transaction, so a crash cannot cause a double charge. It is the foundation for safe retries, at-least-once messaging, and exactly-once processing.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Idempotency nghĩa là thực hiện một thao tác nhiều lần cũng cho ra kết quả y như làm đúng một lần. Đây là yêu cầu bắt buộc, vì trên mạng thì việc retry là không thể tránh khỏi, mà mỗi lần retry lại có nguy cơ tạo ra bản ghi trùng. Trong HTTP, GET, PUT và DELETE vốn đã idempotent sẵn còn POST thì không — đó là lý do các endpoint tạo mới thường nhận thêm một idempotency key do client sinh ra một lần và giữ nguyên qua các lần retry, để server dựa vào đó mà khử trùng lặp. Key này cùng kết quả của nó phải được ghi chung một transaction với chính side effect, để một cú crash giữa chừng không thể khiến khách hàng bị trừ tiền hai lần. Đây chính là nền tảng cho retry an toàn, cho messaging kiểu at-least-once và cho việc xử lý exactly-once.</p></p></details>
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
        q: 'How do you guarantee event ordering in event-driven microservices?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>There is no global ordering in a distributed system, so the real question is what scope of ordering is needed, and it is usually per entity. The common technique is to partition by the entity key, for example a Kafka partition by account ID, so all events for one entity stay in order while different entities run in parallel. When strict order cannot be guaranteed, make consumers tolerant by adding a version or sequence number and dropping stale events. Global total ordering forces everything through one partition and hurts throughput, so it should be avoided.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Không có global ordering trong một hệ thống phân tán, nên câu hỏi thực sự là bạn cần ordering ở phạm vi nào, và thường là theo từng entity. Kỹ thuật phổ biến là partition theo key của entity, ví dụ một partition Kafka theo account ID, nhờ đó tất cả event của một entity giữ đúng thứ tự trong khi các entity khác nhau chạy song song. Khi không thể đảm bảo thứ tự nghiêm ngặt, hãy làm cho consumer khoan dung hơn bằng cách thêm một số version hoặc sequence và bỏ qua các event cũ. Global total ordering buộc mọi thứ đi qua một partition duy nhất và làm giảm throughput, nên cần tránh.</p></details>
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
        a: `<div class="interview-answer"><p>Because each service owns its own data, a SQL <code>JOIN</code> across services is not possible, and there are three main options. API composition has the caller query each service and merge the results in memory, which is simple but slow and causes N+1 calls for large sets. CQRS with a materialized read model has services publish events so a query service keeps a denormalized, pre-joined view, at the cost of eventual consistency. Reaching directly into another service's database must be avoided because it recreates the coupling that database-per-service is meant to prevent.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Vì mỗi service sở hữu dữ liệu riêng, không thể dùng một <code>JOIN</code> SQL trải qua nhiều service, và có ba lựa chọn chính. API composition để caller truy vấn từng service rồi gộp kết quả trong bộ nhớ, cách này đơn giản nhưng chậm và gây ra các lời gọi N+1 với tập dữ liệu lớn. CQRS với một read model được materialize thì các service publish event để một query service duy trì một view denormalized, đã join sẵn, đổi lại phải chấp nhận eventual consistency. Việc chọc thẳng vào database của service khác phải tránh vì nó tái tạo lại đúng sự coupling mà database-per-service muốn ngăn chặn.</p></details>
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

      // ──── 4. RESILIENCE & OPERATIONS ────
      {
        q: 'What resilience patterns are commonly used in microservices?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The main resilience patterns are timeouts, retries with exponential backoff and jitter, circuit breakers, bulkheads, and fallbacks, and they work together. Timeouts stop a slow dependency from using up all threads, retries handle short failures but need backoff and jitter to avoid a retry storm, and circuit breakers fail fast when a service is down. Bulkheads keep one failing dependency from taking down the whole app, and fallbacks give a degraded response. Only idempotent operations are safe to retry, and every pattern must be tuned carefully.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Các resilience pattern chính là timeout, retry với exponential backoff và jitter, circuit breaker, bulkhead và fallback, và chúng phối hợp với nhau. Timeout ngăn một dependency chậm chạp chiếm hết thread, retry xử lý các lỗi ngắn hạn nhưng cần backoff và jitter để tránh retry storm, còn circuit breaker fail fast khi một service bị hỏng. Bulkhead giữ cho một dependency lỗi không kéo sập cả ứng dụng, còn fallback trả về một phản hồi tối giản để dịch vụ vẫn dùng được ở mức hạn chế. Chỉ những thao tác idempotent mới an toàn để retry, và mọi pattern kể trên đều cần được tinh chỉnh thông số cẩn thận.</p></details>
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
        q: 'When do retries make an outage worse? (retry storms, backoff, jitter)',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Retries make an outage worse when a dependency slows down and every caller retries, which multiplies the load at the worst possible time and can cause total collapse. The fixes are exponential backoff to spread retries out, jitter so clients do not retry in synchronized waves, and a retry budget or circuit breaker to cap total retries. Only idempotent operations should be retried, and retries should happen at one layer, not every layer, because retrying at many layers multiplies fast. The synchronized retry wave is the trap people miss most, and jitter is the cheap fix.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Retry làm cho một sự cố tệ hơn khi một dependency chậm lại và mọi caller đều retry, khiến tải tăng lên gấp bội vào đúng thời điểm tệ nhất và có thể gây sụp đổ hoàn toàn. Cách khắc phục là exponential backoff để giãn các lần retry ra, jitter để các client không retry theo những đợt đồng bộ, và một retry budget hoặc circuit breaker để giới hạn tổng số lần retry. Chỉ nên retry những thao tác idempotent, và nên retry ở một tầng thôi chứ không phải ở mọi tầng, vì retry ở nhiều tầng sẽ nhân lên rất nhanh. Việc các client cùng retry dồn vào một thời điểm là cái bẫy hay bị bỏ sót nhất, và jitter chính là cách khắc phục rẻ nhất.</p></details>
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
        q: 'What is health checking and readiness vs liveness probes?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Liveness and readiness probes answer two different questions. A <strong>liveness</strong> probe asks if the process is stuck and should be restarted, while a <strong>readiness</strong> probe asks if the instance can serve traffic right now and, if it fails, only removes the instance from the load balancer. A common mistake is checking downstream dependencies in the liveness probe, because a short database outage can then restart every pod at once. Startup probes help slow-starting apps, and all probes should be cheap and local.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Liveness probe và readiness probe trả lời hai câu hỏi khác nhau. Một probe <strong>liveness</strong> hỏi liệu tiến trình có bị kẹt và cần được restart hay không, còn một probe <strong>readiness</strong> hỏi liệu instance có thể phục vụ traffic ngay lúc này hay không và, nếu thất bại, chỉ gỡ instance ra khỏi load balancer. Một lỗi thường gặp là kiểm tra các downstream dependency trong liveness probe, vì khi đó một sự cố database ngắn cũng có thể restart tất cả các pod cùng lúc. Startup probe giúp ích cho các ứng dụng khởi động chậm, và mọi probe nên rẻ và cục bộ.</p></details>
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
        q: 'What is distributed tracing and why do correlation IDs matter?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>When a request passes through many services, a normal stack trace is not useful, and <strong>distributed tracing</strong> rebuilds the whole journey as a tree of spans that shows where latency and errors happen. It works by generating a trace or correlation ID at the edge and passing it through every call in the headers, with each service adding spans; W3C Trace Context is the standard format. The correlation ID also ties together logs from all services for one request, which makes debugging far easier. A common choice is OpenTelemetry exporting to Jaeger or Tempo, and the main risks are propagation gaps where one service drops the header and the sampling strategy limiting what is visible.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><p>Khi một request đi qua nhiều service thì stack trace thông thường gần như vô dụng; <strong>distributed tracing</strong> dựng lại toàn bộ hành trình đó thành một cây span, cho thấy độ trễ và lỗi phát sinh ở đâu. Cách hoạt động là sinh ra một trace ID (hay correlation ID) ngay ở cửa ngõ hệ thống rồi truyền nó qua mọi lời gọi thông qua header, mỗi service đi qua sẽ thêm span của mình; W3C Trace Context là định dạng chuẩn cho việc này. Correlation ID cũng giúp gom log của tất cả service thuộc cùng một request lại với nhau, khiến việc debug dễ hơn hẳn. Bộ đôi phổ biến hiện nay là OpenTelemetry xuất dữ liệu sang Jaeger hoặc Tempo. Hai rủi ro chính là đứt mạch truyền context khi có service nào đó làm rơi mất header, và việc sampling khiến ta không nhìn thấy được hết mọi request.</p></p></details>
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
    ],
  },
];
