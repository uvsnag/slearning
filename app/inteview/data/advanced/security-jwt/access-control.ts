// Security & JWT — Authorization & access control
import type { PvQuestion } from '../../../types';

export const questions: PvQuestion[] = [
  {
    q: 'What is the difference between RBAC and ABAC?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>RBAC grants permissions through roles like admin, editor, and viewer, which is simple, easy to audit, and enough for most apps. ABAC decides each request by evaluating attributes of the user, resource, action, and environment, such as ownership, department, time, or IP. The tradeoff is that RBAC is easy to reason about but can suffer role explosion, while ABAC handles fine-grained and contextual rules but is harder to author, test, and audit. A common approach is to start with RBAC and add attribute checks for cases roles cannot express.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>RBAC cấp quyền theo vai trò như admin, editor, viewer — đơn giản, dễ audit và đủ dùng cho phần lớn ứng dụng. ABAC quyết định từng request dựa trên thuộc tính của người dùng, tài nguyên, hành động và bối cảnh: ai là chủ sở hữu, thuộc phòng ban nào, đang là giờ nào, request đến từ IP nào. Đánh đổi: RBAC dễ hiểu nhưng dễ "nở" ra hàng chục role na ná nhau (role explosion); ABAC diễn đạt được các quy tắc chi tiết theo ngữ cảnh nhưng khó viết, khó test và khó audit hơn. Cách làm phổ biến là bắt đầu bằng RBAC, rồi thêm kiểm tra theo thuộc tính cho những trường hợp mà role không diễn đạt nổi.</p></details>
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
    q: 'What is IDOR (Insecure Direct Object Reference) and how do you prevent it?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p><strong>IDOR</strong> is a broken access-control problem: an object ID is exposed, but the app does not check that the logged-in user is allowed to see that specific object. So changing <code>/invoice/123</code> to <code>124</code> can return someone else's data. It is common because authentication passing makes people assume authorization passed too. The fix is an ownership check on every object access, done on the server and scoped to the current user. Unguessable UUIDs help a little but are not a real fix, so the check should be centralized so no endpoint forgets it.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>IDOR</strong> là lỗi hỏng kiểm soát truy cập: API để lộ ID của một object nhưng không kiểm tra xem người dùng đang đăng nhập có quyền xem đúng object đó không. Vì vậy chỉ cần sửa <code>/invoice/123</code> thành <code>/invoice/124</code> là đọc được dữ liệu của người khác. Lỗi này rất phổ biến vì lập trình viên thấy "đã đăng nhập rồi" nên mặc định là đã có quyền — nhưng authentication không phải authorization. Cách chữa là mọi truy vấn lấy object đều phải kèm điều kiện sở hữu, kiểm tra ở server theo user hiện tại. Dùng UUID khó đoán chỉ đỡ được phần nào chứ không phải cách chữa; tốt nhất là gom phần kiểm tra vào một chỗ (repository/service) để không endpoint nào quên.</p></details>
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
    q: 'What is broken access control, and how do you keep tenants isolated?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Broken access control is the number one item on the OWASP list and covers three shapes: <strong>horizontal</strong> escalation (reading another user's object — IDOR), <strong>vertical</strong> escalation (a normal user reaching an admin action because the check lived only in the UI or only on the "nice" route), and <strong>context</strong> escalation (a valid action performed at the wrong step or in the wrong state). In multi-tenant systems it becomes existential: one missing <code>tenant_id</code> predicate leaks another company's data. The reliable pattern is to make authorization structural rather than per-endpoint — derive the tenant and user from the verified token, never from a request parameter, enforce it in a single place (repository scoping, a request-scoped filter, or row-level security), and default to deny for anything not explicitly allowed.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Broken access control là hạng mục số một trong danh sách OWASP, và có ba dạng: leo thang <strong>ngang</strong> (đọc object của người dùng khác — IDOR), leo thang <strong>dọc</strong> (user thường chạm được vào hành động của admin, vì phần kiểm tra chỉ nằm ở giao diện hoặc chỉ có ở một route "đẹp"), và leo thang theo <strong>ngữ cảnh</strong> (một hành động hợp lệ nhưng thực hiện sai bước hoặc sai trạng thái). Trong hệ multi-tenant thì chuyện này mang tính sống còn: chỉ thiếu một điều kiện <code>tenant_id</code> là dữ liệu của công ty khác lộ ra. Cách làm đáng tin là biến phân quyền thành chuyện có cấu trúc chứ không phải làm lại ở từng endpoint: lấy tenant và user từ token đã verify (không bao giờ từ tham số request), thực thi ở một chỗ duy nhất (scope trong repository, một filter theo request, hoặc row-level security), và mặc định là từ chối với mọi thứ chưa được cho phép rõ ràng.</p></details>
<pre>// Vertical escalation — the check that was only in the frontend
if (user.isAdmin) showDeleteButton();     // UI only
DELETE /api/users/42                      // curl works fine 💀
// And the sneaky variant: the check exists on one path but not another
GET  /api/admin/users        → @PreAuthorize("hasRole('ADMIN')")  ✅
GET  /api/users?all=true     → forgotten                          ❌
POST /api/users/42/roles     → forgotten                          ❌
// Also: unauthenticated "internal" endpoints, debug routes, and
// legacy /v1/ APIs that nobody re-secured.

// Context escalation
POST /checkout/confirm  before  POST /checkout/pay      → free order
POST /account/change-email without re-entering password → takeover
PATCH /orders/9 {"status":"REFUNDED"}                   → client-driven state</pre>
<pre>// Tenant isolation — three levels, pick deliberately
// 1) Shared schema + tenant_id column (cheapest, riskiest)
//    → EVERY query must be scoped. Enforce it structurally:
@Where(clause = "tenant_id = current_tenant()")          // Hibernate filter
// or Postgres Row-Level Security — the database refuses unscoped reads:
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY t ON invoices USING (tenant_id = current_setting('app.tenant')::uuid);
// 2) Schema per tenant → stronger isolation, more migration work
// 3) Database/cluster per tenant → strongest, most expensive

// The tenant comes from the TOKEN, never from the request
const tenantId = jwt.claims.tenant;        // ✅ signed
const tenantId = req.query.tenantId;       // ❌ attacker picks a tenant
// Cross-tenant object ids must fail closed: findByIdAndTenant(id, tenantId)</pre>
<p><strong>How I verify it rather than hope:</strong> write authorization tests as a matrix — for each role and each endpoint, assert allowed/denied, and include "user A requests user B's object → 404" and "tenant A requests tenant B's object → 404"; add a default-deny rule (<code>anyRequest().authenticated()</code>, an authorization filter that fails when no rule matched); log every denied request and every privilege change; and review new endpoints specifically for "who may call this, and for which rows?".</p>
<div class="key-point">Authorization must be structural and default-deny: identity and tenant from the verified token, ownership predicates inside the data-access layer (or RLS in the database), no endpoint relying on the UI hiding a button, and an automated role × endpoint test matrix to prove it.</div>`,
  },
  {
    q: 'When would you use a policy engine like OPA or Casbin instead of code?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Hard-coded checks are fine while rules are simple and few. A policy engine earns its place when authorization becomes a domain of its own: rules change more often than code, they must be identical across several services and languages, non-developers need to audit or edit them, or you need to answer "why was this allowed?" from a decision log. The standard shape is <strong>PDP/PEP</strong> — a policy decision point (OPA with Rego, Cedar, Casbin) evaluates a request against externalized policy, while each service keeps a thin policy enforcement point that asks and obeys. The trade-offs are real: an extra hop or sidecar, a new language to learn, data-fetching for context, and the risk of "policy sprawl", so keep coarse checks in the framework (Spring Security) and externalize only the rules that genuinely need it.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Viết thẳng phép kiểm tra trong code vẫn ổn khi quy tắc còn đơn giản và ít. Một policy engine chỉ đáng dùng khi phân quyền trở thành một lĩnh vực riêng: quy tắc thay đổi thường xuyên hơn code, cần giống nhau giữa nhiều service viết bằng nhiều ngôn ngữ, người không phải developer cũng cần đọc/sửa/audit, hoặc bạn phải trả lời được câu "vì sao request này được cho phép?" từ log quyết định. Mô hình chuẩn là <strong>PDP/PEP</strong>: một điểm ra quyết định (OPA với Rego, Cedar, Casbin) đánh giá request dựa trên policy đặt bên ngoài, còn mỗi service chỉ giữ một điểm thực thi mỏng — hỏi rồi tuân theo. Nhưng đánh đổi là thật: thêm một hop hoặc một sidecar, thêm một ngôn ngữ phải học, phải lo cấp dữ liệu ngữ cảnh cho engine, và nguy cơ policy phình ra mất kiểm soát. Vì vậy hãy giữ các kiểm tra thô ở tầng framework (Spring Security) và chỉ đưa ra ngoài những quy tắc thật sự cần.</p></details>
<pre># OPA / Rego — policy as data, versioned in git, testable
package authz
default allow = false

allow {                                     # owners may read their own docs
  input.action == "read"
  input.resource.owner == input.user.id
}
allow {                                     # managers, in-hours, same dept
  input.action == "approve"
  input.user.roles[_] == "manager"
  input.user.dept == input.resource.dept
  input.amount <= input.user.approvalLimit
}
# Decisions are logged with the input → a real audit trail,
# and policies get unit tests (opa test) like any other code.</pre>
<pre>// The spectrum — pick the lightest thing that works
1. Framework annotations (most apps stop here)
   @PreAuthorize("hasRole('ADMIN') or #order.owner == authentication.name")
2. A domain service: permissions.can(user, 'approve', order)
   → one place to test, no new infrastructure
3. Embedded engine: Casbin (Java/Node/Go), Cedar, OPA as a library
   → externalized model + policy files, still in-process (fast)
4. Sidecar/central PDP: OPA per pod, or a service like SpiceDB/OpenFGA
   → cross-service consistency, central audit, hot-reloadable policy
   → needed for ReBAC ("can this user view this folder via a shared group?")

// Practical cautions
- Latency: evaluate in-process or as a sidecar; never a cross-region call.
- Data: the engine needs attributes; either push them in the request
  (input) or replicate them — stale data means wrong decisions.
- Fail closed on engine errors, and cache decisions carefully (TTL + keys
  that include everything the policy depends on).
- Keep coarse authn/authz (is there a valid token? does the tenant match?)
  in the service — the PDP answers fine-grained questions, not all of them.</pre>
<div class="key-point">Externalize authorization when policy changes faster than code, must be shared across services, or has to be auditable — then use PDP/PEP with policy in git and decision logs. Otherwise a well-tested permission service plus framework annotations is simpler and safer.</div>`,
  },
];
