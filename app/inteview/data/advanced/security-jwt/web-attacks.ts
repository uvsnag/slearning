// Security & JWT — Web attacks & browser-side defenses
import type { PvQuestion } from '../../../types';

export const questions: PvQuestion[] = [
  {
    q: 'What is the OWASP Top 10 and which items matter most in practice?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>The OWASP Top 10 is a consensus list of the most critical web application risk <em>categories</em>, refreshed every few years from real breach and scan data. In the 2021 edition <strong>Broken Access Control</strong> moved to number one, which matches reality: IDOR and missing authorization checks are the bugs I find most often, followed by <strong>Security Misconfiguration</strong> and <strong>Vulnerable Components</strong>. The list is useful as a checklist for design reviews and as shared vocabulary, but it is a starting point, not a certification — business-logic flaws and abuse cases are not on it and are often the most damaging. For depth, ASVS gives you verifiable requirements and the OWASP Cheat Sheets give concrete fixes.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>OWASP Top 10 là danh sách các <em>nhóm</em> rủi ro nghiêm trọng nhất của ứng dụng web, được tổng hợp lại vài năm một lần từ dữ liệu sự cố và dữ liệu quét thực tế. Ở bản 2021, <strong>Broken Access Control</strong> lên vị trí số một — và điều đó đúng với thực tế: IDOR cùng những chỗ thiếu kiểm tra quyền là lỗi tôi gặp nhiều nhất, kế đó là <strong>Security Misconfiguration</strong> và <strong>dùng thư viện có lỗ hổng</strong>. Danh sách này hữu ích như một checklist khi review thiết kế và như một ngôn ngữ chung để trao đổi, nhưng nó chỉ là điểm khởi đầu chứ không phải chứng chỉ an toàn — các lỗi logic nghiệp vụ không nằm trong đó nhưng lại thường gây thiệt hại lớn nhất. Muốn đi sâu thì đọc ASVS (yêu cầu có thể kiểm chứng được) và các OWASP Cheat Sheet (cách sửa cụ thể).</p></details>
<pre>OWASP Top 10 (2021)
A01 Broken Access Control ....... IDOR, missing authz, forced browsing
A02 Cryptographic Failures ...... plaintext data, weak/misused crypto
A03 Injection ................... SQLi, NoSQL, command, XSS lives here now
A04 Insecure Design ............. missing threat modeling, no rate limits
A05 Security Misconfiguration ... default creds, verbose errors, open S3
A06 Vulnerable Components ....... outdated libs (Log4Shell, Struts)
A07 Identification & Auth ....... weak passwords, session flaws, no MFA
A08 Software & Data Integrity ... supply chain, unsigned artifacts,
                                  insecure deserialization
A09 Logging & Monitoring ........ breaches undetected for months
A10 SSRF ........................ dedicated entry since 2021</pre>
<p><strong>How I use it in a real project</strong> (a better answer than reciting the list):</p>
<ul>
<li><strong>Design</strong>: A04/A01 — decide the authorization model before writing endpoints, and write down abuse cases.</li>
<li><strong>Code review</strong>: A01/A03 — every data access scoped to the caller, every query parameterized.</li>
<li><strong>CI</strong>: A06/A08 — dependency scanning and lockfiles; A02 — no secrets in the repo.</li>
<li><strong>Deploy</strong>: A05 — hardened headers, no debug endpoints, least-privilege IAM.</li>
<li><strong>Run</strong>: A09 — alert on auth failures, privilege changes, and anomalous data access.</li>
</ul>
<p><strong>What the Top 10 does not cover:</strong> business-logic abuse (refund loops, coupon stacking, negative quantities), tenant isolation, denial of wallet in cloud, and CI/CD pipeline compromise. Mentioning these shows you think beyond the checklist.</p>
<div class="key-point">Treat the Top 10 as categories to design against, not bugs to grep for. Broken access control, misconfiguration, and vulnerable dependencies cause most real incidents — and business-logic flaws, which the list omits, cause the most expensive ones.</div>`,
  },
  {
    q: 'What is the difference between CORS and CSRF?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>CORS and CSRF are nearly opposites despite the similar names. CORS is a browser mechanism that relaxes the same-origin policy so a server can allow other origins to read its responses, so it is a permission, not a defense. CSRF is an attack where a malicious site uses a logged-in user's cookies to send an unwanted state-changing request. CORS does not prevent CSRF, which is stopped with <code>SameSite</code> cookies, anti-CSRF tokens, and checking the Origin or Referer header, and loosening CORS to <code>*</code> can open real holes.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>CORS và CSRF tên gọi na ná nhau nhưng gần như trái ngược. CORS là cơ chế của trình duyệt để nới lỏng same-origin policy, cho phép server khai báo origin nào được đọc phản hồi của nó — nó là một sự cho phép, không phải một lớp phòng thủ. CSRF là một kiểu tấn công: trang web độc hại mượn cookie của người dùng đang đăng nhập để gửi một request làm thay đổi dữ liệu mà họ không hề muốn. Cấu hình CORS không chặn được CSRF; muốn chặn CSRF phải dùng cookie <code>SameSite</code>, anti-CSRF token và kiểm tra header Origin/Referer. Ngược lại, mở CORS thành <code>*</code> kèm credentials mới chính là tự tạo lỗ hổng.</p></details>
<p>Two completely different security concepts that are often confused:</p>
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
    q: 'Which security headers should every app send, and what is clickjacking?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>Security headers are cheap, high-value defense in depth. The important ones are <strong>Content-Security-Policy</strong> (the only real mitigation for XSS impact — restrict script sources and forbid inline script), <strong>Strict-Transport-Security</strong> (force HTTPS and stop downgrade), <strong>X-Content-Type-Options: nosniff</strong>, <strong>Referrer-Policy</strong>, <strong>Permissions-Policy</strong>, and either <code>frame-ancestors</code> in CSP or <code>X-Frame-Options</code> to prevent <strong>clickjacking</strong> — where an attacker loads your page in a transparent iframe over their own UI so the victim's clicks land on your buttons. None of these fix a vulnerability; they reduce blast radius, so they belong at the gateway or framework level where nobody can forget them.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Security header là lớp phòng thủ rẻ mà hiệu quả cao. Những header quan trọng: <strong>Content-Security-Policy</strong> (thứ duy nhất thật sự giảm được thiệt hại của XSS — giới hạn nguồn script và cấm inline script), <strong>Strict-Transport-Security</strong> (buộc dùng HTTPS, chặn hạ cấp về HTTP), <strong>X-Content-Type-Options: nosniff</strong>, <strong>Referrer-Policy</strong>, <strong>Permissions-Policy</strong>, và <code>frame-ancestors</code> trong CSP (hoặc <code>X-Frame-Options</code>) để chống <strong>clickjacking</strong> — kiểu tấn công nhúng trang của bạn vào một iframe trong suốt đặt lên trên giao diện của kẻ tấn công, khiến cú click của người dùng thật ra rơi vào nút của bạn. Các header này không sửa lỗ hổng nào cả, chúng chỉ thu hẹp thiệt hại — nên hãy đặt chúng ở gateway hoặc ở tầng framework, nơi không ai có thể quên.</p></details>
<pre># A solid baseline
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-r4nd0m';
  object-src 'none'; base-uri 'none'; frame-ancestors 'none';
  require-trusted-types-for 'script'
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Cross-Origin-Opener-Policy: same-origin        # isolates your window
Cross-Origin-Resource-Policy: same-origin      # blocks cross-origin reads
Cache-Control: no-store        # on authenticated responses

# Deliberately NOT in the list
X-XSS-Protection: 1            # dead, removed from browsers
X-Frame-Options                # superseded by CSP frame-ancestors (keep for
                               # old browsers if you must)</pre>
<pre>// Clickjacking: the attacker's page
&lt;style&gt;iframe{opacity:0;position:absolute;top:0;left:0;width:100%;height:100%}&lt;/style&gt;
&lt;button&gt;Click to win a prize&lt;/button&gt;
&lt;iframe src="https://bank.com/transfer?to=attacker&amp;amount=1000"&gt;&lt;/iframe&gt;
// The victim clicks the visible button; the click lands on the bank's
// "Confirm" button, with the victim's own session cookies attached.
// Defenses: frame-ancestors 'none', SameSite cookies, and requiring a
// fresh confirmation step (re-auth or typed amount) for sensitive actions.</pre>
<p><strong>CSP in practice</strong> is the hard part: <code>'unsafe-inline'</code> defeats the purpose, so use per-request <strong>nonces</strong> or hashes for the scripts you do need; roll it out with <code>Content-Security-Policy-Report-Only</code> plus a report endpoint to find breakage first; and remember CSP does not stop the XSS itself, it stops the exfiltration and the injected external script.</p>
<div class="key-point">Set headers once at the edge/framework: CSP with nonces (no <code>unsafe-inline</code>), HSTS with preload, <code>nosniff</code>, a strict Referrer-Policy, and <code>frame-ancestors 'none'</code> unless you genuinely need to be framed. They are mitigations, not fixes — you still have to escape output.</div>`,
  },
  {
    q: 'How do you configure cookies securely, and what is session fixation?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>A session cookie needs four things: <code>HttpOnly</code> so JavaScript cannot read it, <code>Secure</code> so it never travels over HTTP, <code>SameSite=Lax</code> or <code>Strict</code> so it is not attached to cross-site requests (killing most CSRF), and a tight <code>Path</code>/<code>Domain</code> plus a sensible lifetime. <strong>Session fixation</strong> is the attack where the attacker plants a known session ID in the victim's browser and waits for them to log in — if the server keeps the same ID across the login, the attacker's session becomes authenticated. The fix is one line: <em>always issue a brand-new session identifier on privilege change</em> (login, logout, elevation), and invalidate the old one server-side.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một cookie session cần đủ bốn thứ: <code>HttpOnly</code> để JavaScript không đọc được, <code>Secure</code> để nó không bao giờ đi qua HTTP, <code>SameSite=Lax</code> hoặc <code>Strict</code> để nó không bị gửi kèm trong request từ site khác (chặn phần lớn CSRF), cùng với <code>Path</code>/<code>Domain</code> hẹp và thời gian sống hợp lý. <strong>Session fixation</strong> là kiểu tấn công cài sẵn một session ID mà kẻ tấn công đã biết vào trình duyệt nạn nhân rồi chờ họ đăng nhập — nếu server giữ nguyên session ID cũ sau khi login thì session của kẻ tấn công cũng thành đã đăng nhập. Cách chữa chỉ một dòng: <em>luôn phát session ID mới mỗi khi quyền hạn thay đổi</em> (login, logout, nâng quyền) và hủy session cũ ở phía server.</p></details>
<pre>Set-Cookie: sid=&lt;random 128-bit value&gt;;
  HttpOnly;              # no JS access → XSS cannot read it
  Secure;                # HTTPS only
  SameSite=Lax;          # not sent on cross-site POSTs → CSRF mostly dead
  Path=/;                # narrow it if you can
  Max-Age=1800           # sliding idle timeout + absolute cap
  # __Host- prefix: __Host-sid requires Secure, Path=/ and NO Domain →
  # the browser refuses to let a subdomain overwrite it

SameSite values
  Strict → never sent cross-site (safest; breaks "click a link and stay
           logged in" flows and OAuth redirects)
  Lax    → sent on top-level GET navigations only (good default)
  None   → sent everywhere, REQUIRES Secure (needed for third-party
           embeds and some SSO flows — then you need CSRF tokens)</pre>
<pre>// Session fixation
1. Attacker gets a valid session id: GET /login → sid=ABC
2. Plants it in the victim's browser (a link with ;jsessionid=ABC,
   an XSS/subdomain cookie write, or a stale shared computer)
3. Victim logs in → server keeps sid=ABC and marks it authenticated
4. Attacker replays sid=ABC → they are inside the victim's account

// Fix — new id on every privilege change
request.changeSessionId();                         // Servlet 3.1+
// Spring Security does this by default (sessionFixation().migrateSession())
// Node/Express:
req.session.regenerate(() => { req.session.userId = user.id; });
// Also: disable URL-based session ids (tracking-modes=COOKIE),
// set an absolute session lifetime, and invalidate all sessions on
// password change or suspicious activity.</pre>
<p><strong>Related gotchas:</strong> cookies ignore ports and (mostly) protocol, so a vulnerable sibling app on the same host shares your cookie jar; a cookie set on <code>.example.com</code> can be overwritten by any subdomain (cookie tossing) — use the <code>__Host-</code> prefix; and "remember me" tokens must be random, hashed at rest, single-use per device, and revocable, not a long-lived copy of the session.</p>
<div class="key-point">HttpOnly + Secure + SameSite + short lifetime, ideally with the <code>__Host-</code> prefix — and regenerate the session ID at login. A session that survives authentication unchanged is a session an attacker can pre-plant.</div>`,
  },
  {
    q: 'What are open redirect, host header injection and HTTP request smuggling?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>These three all come from trusting request-controlled data that ends up in a URL or in the way requests are parsed. An <strong>open redirect</strong> is <code>/login?next=https://evil.com</code>: harmless on its own, but it lends your domain's credibility to phishing and is the classic way to steal OAuth codes and tokens. <strong>Host header injection</strong> is when the app builds absolute URLs from the <code>Host</code> header, so a forged header sends password-reset links to the attacker's domain or poisons the cache. <strong>Request smuggling</strong> exploits a front-end proxy and back-end server disagreeing about <code>Content-Length</code> versus <code>Transfer-Encoding</code>, letting an attacker prepend bytes to someone else's request — bypassing auth at the proxy and poisoning responses. Fixes: allowlist redirect targets, never trust <code>Host</code> (use a configured base URL), and normalize/reject ambiguous requests at the edge.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Cả ba đều đến từ việc tin dữ liệu do request điều khiển, rồi dữ liệu đó lọt vào URL hoặc vào cách request được phân tích. <strong>Open redirect</strong> là kiểu <code>/login?next=https://evil.com</code>: tự nó vô hại, nhưng nó cho kẻ tấn công mượn uy tín tên miền của bạn để phishing, và là con đường kinh điển để cướp authorization code hay token trong OAuth. <strong>Host header injection</strong> là khi ứng dụng dựng URL tuyệt đối từ header <code>Host</code>, nên chỉ cần sửa header là link reset mật khẩu trỏ về tên miền của kẻ tấn công, hoặc làm ô nhiễm cache. <strong>Request smuggling</strong> lợi dụng chuyện proxy phía trước và server phía sau hiểu khác nhau về <code>Content-Length</code> so với <code>Transfer-Encoding</code>, cho phép kẻ tấn công chèn thêm byte vào đầu request của người khác — vượt qua kiểm tra ở proxy và đầu độc response. Cách chữa: allowlist đích redirect, không tin <code>Host</code> (dùng base URL cấu hình sẵn), và chuẩn hóa hoặc từ chối các request nhập nhằng ngay tại edge.</p></details>
<pre>// 1) Open redirect — and why it is not "low severity"
GET /logout?returnTo=https://evil-bank.com/login
// The victim sees YOUR domain in the link, lands on a clone site.
// Worse, in OAuth: redirect_uri chained through an open redirect on an
// allowed host leaks the authorization code to the attacker.
// ✅ Fix: allowlist, or accept only relative paths
const next = req.query.next ?? '/';
if (!next.startsWith('/') || next.startsWith('//')) return res.redirect('/');
// note: "//evil.com" is protocol-relative — it IS absolute</pre>
<pre>// 2) Host header injection
POST /reset-password  HTTP/1.1
Host: attacker.com
// App builds: https://{Host}/reset?token=... → email sends the token
// to attacker.com. Also enables web cache poisoning via X-Forwarded-Host.
// ✅ Fix: build URLs from configuration, not from the request
String link = appProperties.getBaseUrl() + "/reset?token=" + token;
// and validate Host/X-Forwarded-Host against an allowlist at the gateway
// (Spring: server.forward-headers-strategy + a trusted proxy list)</pre>
<pre>// 3) Request smuggling (CL.TE desync, simplified)
POST / HTTP/1.1
Content-Length: 6
Transfer-Encoding: chunked

0

G          ← front-end sees one request, back-end sees a leftover "G"
           → "G" is prepended to the NEXT user's request → their request
             becomes GPOST /... , or the attacker captures their headers
             (including cookies) in a reflected parameter.
// ✅ Fix: HTTP/2 end-to-end, reject requests with both CL and TE,
// normalize at a single edge proxy, disable connection reuse to the
// back end if the stack is ambiguous, and keep proxies patched.</pre>
<div class="key-point">Never let the client decide where you redirect or what your own hostname is: allowlist redirect targets (relative paths only), build links from configuration, and make sure exactly one component parses request framing — ambiguity between proxy and app is what smuggling feeds on.</div>`,
  },
  {
    q: 'How do you handle file uploads securely?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>File upload is one feature that touches almost every risk at once. The core rules: never trust the filename or the client-supplied <code>Content-Type</code>, store files outside the web root (ideally in object storage) under a generated name, and serve them from a separate origin with <code>Content-Disposition: attachment</code> and <code>nosniff</code> so a "picture" cannot execute as HTML or a script in your origin. Validate by sniffing real content (magic bytes) against an allowlist of types, cap size and count before parsing, and scan with AV where the risk warrants it. The subtle traps are SVG (it is XML and can carry JavaScript), archives (zip slip and zip bombs), image parsers (ImageTragick-style RCE), and re-serving user files from your main domain, which turns an upload into stored XSS.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Tính năng upload file gần như chạm tới mọi loại rủi ro cùng lúc. Nguyên tắc cốt lõi: không tin tên file cũng không tin <code>Content-Type</code> do client gửi; lưu file ra ngoài web root (tốt nhất là object storage) với tên do server tự sinh; và phục vụ file từ một origin riêng, kèm <code>Content-Disposition: attachment</code> và <code>nosniff</code>, để một "tấm ảnh" không thể chạy như HTML hay script trong origin của bạn. Kiểm tra loại file bằng nội dung thật (magic bytes) đối chiếu danh sách cho phép, giới hạn kích thước và số lượng <em>trước khi</em> parse, và quét virus nếu mức độ rủi ro đòi hỏi. Những cái bẫy khó thấy: SVG (thực chất là XML, chứa được JavaScript), file nén (zip slip, zip bomb), thư viện xử lý ảnh (kiểu ImageTragick dẫn tới RCE), và việc trả file của người dùng ngay trên domain chính — chỉ cần vậy là upload biến thành stored XSS.</p></details>
<pre>// ❌ The classic vulnerable handler
const dest = path.join('./public/uploads', req.file.originalname);
// originalname = "../../app.js"          → overwrite code (traversal)
// originalname = "shell.jsp" / ".php"    → RCE if the dir is executable
// originalname = "x.html"                → stored XSS on your origin
// Content-Type: image/png (attacker-set) → means nothing

// ✅ The safe shape
const id = crypto.randomUUID();                 // ignore the client name
const detected = await fileTypeFromBuffer(buf); // magic bytes, not extension
if (!ALLOWED.has(detected?.mime)) throw new BadRequest('type');
if (buf.length > MAX_BYTES) throw new BadRequest('size');   // enforce early
await s3.putObject({ Key: \`uploads/\${id}\`, Body: buf,
  ContentType: detected.mime, ContentDisposition: 'attachment' });
// DB row: { id, ownerId, originalName (display only), mime, size }
// Download: authorize the owner, then stream or hand out a short-lived
// pre-signed URL — never a path built from user input.</pre>
<p><strong>The traps, explicitly:</strong></p>
<ul>
<li><strong>SVG</strong> is executable XML: <code>&lt;svg onload="fetch('/api/me')..."&gt;</code>. Either forbid it, sanitize with DOMPurify server-side, or serve it only as an attachment from a sandbox domain.</li>
<li><strong>Archives</strong>: validate every entry path (zip slip), cap the uncompressed size and entry count (zip bombs), and never extract as root.</li>
<li><strong>Image processing</strong>: run ImageMagick/ffmpeg conversions in a sandboxed, resource-limited worker — parsers are memory-unsafe attack surface. Re-encoding also strips embedded payloads and EXIF (privacy: GPS data).</li>
<li><strong>Serving origin</strong>: user content on <code>files.example.com</code> (or S3 + CDN), never on the app origin where cookies live.</li>
<li><strong>Denial of service</strong>: limit size at the reverse proxy, rate-limit uploads per user, and stream to disk/S3 instead of buffering whole files in memory.</li>
</ul>
<div class="key-point">Generate the storage name, verify the real content type, store outside the web root, and serve from a separate origin as an attachment. Everything the client tells you about a file — name, extension, MIME type — is attacker input.</div>`,
  },
  {
    q: 'How do you protect an API from abuse and denial of service, and what is ReDoS?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Availability is a security property, and most application-level DoS is not a botnet — it is one endpoint that lets a single request cost a lot of CPU, memory, or money. So I put quotas at several layers: request size and connection limits at the edge, per-user and per-IP rate limits with <code>429</code> + <code>Retry-After</code> on expensive endpoints, pagination caps, query timeouts, and circuit breakers on downstream calls. <strong>ReDoS</strong> is the sneakiest variant: a regex with nested quantifiers backtracks exponentially, so a 40-character input can pin a CPU core for minutes — and in Node, that blocks the entire event loop. The fixes are linear-time patterns, anchored and length-limited input, a regex timeout or a safe engine (RE2), and never building regexes from user input.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Tính sẵn sàng cũng là một thuộc tính bảo mật, và phần lớn DoS ở tầng ứng dụng không phải do botnet — mà do một endpoint để một request đơn lẻ ngốn rất nhiều CPU, RAM hoặc tiền. Vì vậy tôi đặt hạn mức ở nhiều lớp: giới hạn kích thước request và số kết nối ở edge; rate limit theo user và theo IP kèm trả <code>429</code> + <code>Retry-After</code> cho các endpoint đắt; chặn trên số phần tử phân trang; timeout cho truy vấn; và circuit breaker cho các lời gọi xuống dưới. <strong>ReDoS</strong> là biến thể khó thấy nhất: một regex có quantifier lồng nhau sẽ backtrack theo hàm số mũ, nên chỉ 40 ký tự input là ghim chết một core CPU vài phút — và trong Node thì nó chặn luôn toàn bộ event loop. Cách chữa: viết pattern chạy tuyến tính, neo đầu-cuối và giới hạn độ dài input, đặt timeout cho regex hoặc dùng engine an toàn (RE2), và tuyệt đối không ghép regex từ input người dùng.</p></details>
<pre>// ReDoS — the classic patterns
/^(a+)+$/.test('aaaaaaaaaaaaaaaaaaaaaaaaaaaaX')     // exponential backtracking
/^(\\w+\\s?)*$/            // "nested quantifier" — very common in validators
/^([a-zA-Z0-9]+)*@/       // hand-written email regex → 30 chars = 10s CPU
// In Node this blocks the event loop: ONE request stalls every user.

// ✅ Safer
- keep patterns linear: no (x+)+, (x*)*, (a|a)*
- anchor and bound: /^[\\w.+-]{1,64}@[\\w-]{1,255}$/
- validate length BEFORE the regex; reject early
- use a vetted validator library instead of hand-rolled email/URL regexes
- Java: run untrusted matching in a task with a timeout; Node: re2 or
  worker threads; lint with eslint-plugin-security / CodeQL ReDoS rules</pre>
<pre>// Layered quotas — a checklist I actually apply
edge/CDN      : SYN + connection limits, geo/bot rules, TLS termination
gateway       : body size cap (1 MB default), request timeout, per-IP limit
service       : per-user token bucket in Redis for expensive routes
                (login, search, export, PDF/report generation, uploads)
data layer    : statement_timeout, LIMIT enforced server-side,
                no unbounded IN clauses, index the filters you expose
downstream    : circuit breaker + bulkhead so one slow dependency
                does not consume every thread
cost control  : cap fan-out per request, alert on spend ("denial of wallet")

// Token bucket in Redis (atomic, per user+route)
local n = redis.call('INCR', key)
if n == 1 then redis.call('EXPIRE', key, window) end
if n > limit then return 429 end
// Return Retry-After, and never let the limiter itself be the bottleneck.</pre>
<p><strong>Application-layer amplifiers to look for in review:</strong> unbounded <code>page_size</code>; GraphQL nested queries; regex validation on long free-text fields; zip/image processing without limits; N+1 queries behind a single endpoint; synchronous email/PDF work in the request thread; and login endpoints running bcrypt at cost 14 with no rate limit (your own hardening becomes the DoS).</p>
<div class="key-point">Bound everything: input size, page size, regex complexity, query time, fan-out, and requests per user. ReDoS deserves special attention in Node because one bad regex on one request freezes the whole process.</div>`,
  },
  {
    q: 'How do race conditions become security vulnerabilities, and how do you fix them?',
    difficulty: 'tricky',
    a: `<div class="interview-answer"><p>A check-then-act sequence with no atomicity is a security bug whenever the "act" spends something: two concurrent requests both read balance = 100, both pass the check, and both withdraw — the classic <strong>TOCTOU</strong> race that produces double refunds, over-redeemed coupons, oversold inventory, and duplicated payments. Attackers trigger it deliberately by firing parallel requests (Burp's turbo intruder does exactly this), and it is invisible in tests that run sequentially. The fix is to make the invariant atomic in the database rather than in application code: a conditional <code>UPDATE ... WHERE balance &gt;= amount</code>, a unique constraint, <code>SELECT ... FOR UPDATE</code>, or optimistic locking with a version column — plus an idempotency key so a retried request cannot execute twice.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một chuỗi "kiểm tra rồi hành động" mà không có tính nguyên tử sẽ trở thành lỗ hổng bảo mật ngay khi hành động đó tiêu tốn thứ gì đó: hai request song song cùng đọc số dư = 100, cùng vượt qua phép kiểm tra, và cùng rút tiền — đó là race <strong>TOCTOU</strong> kinh điển sinh ra hoàn tiền hai lần, mã giảm giá bị dùng quá số lượng, bán vượt hàng tồn, hay thanh toán bị trùng. Kẻ tấn công cố tình tạo ra tình huống này bằng cách bắn nhiều request cùng lúc (Burp turbo intruder làm đúng việc đó), và lỗi này hoàn toàn vô hình với các test chạy tuần tự. Cách chữa là đưa ràng buộc về tính đúng đắn xuống cho database làm nguyên tử, thay vì kiểm tra trong code: dùng <code>UPDATE ... WHERE balance &gt;= amount</code> có điều kiện, unique constraint, <code>SELECT ... FOR UPDATE</code>, hoặc optimistic lock bằng cột version — cộng thêm idempotency key để một request bị retry không thực thi hai lần.</p></details>
<pre>// ❌ Check-then-act (every language, every framework)
const w = await db.wallet(userId);          // balance = 100
if (w.balance >= 100) {                     // both requests pass here
  await db.debit(userId, 100);              // balance = -100  💸
  await payout(100);                        // paid twice
}
// Same shape: "coupon.usedCount < limit", "seats.available > 0",
// "if (!user.exists) createUser()"  → duplicate accounts,
// "if (!alreadyVoted) vote()"       → ballot stuffing.</pre>
<pre>// ✅ Fix 1 — let the database enforce the invariant atomically
UPDATE wallets SET balance = balance - :amt
 WHERE user_id = :id AND balance >= :amt;     -- 0 rows affected = rejected
// Check the affected-row count; do NOT re-read and decide in code.

// ✅ Fix 2 — unique constraint as a serialization point
ALTER TABLE coupon_redemptions
  ADD CONSTRAINT uq UNIQUE (coupon_id, user_id);   -- duplicate → error

// ✅ Fix 3 — pessimistic lock for multi-step logic
SELECT * FROM wallets WHERE user_id = :id FOR UPDATE;   -- inside a tx
// JPA: em.find(Wallet.class, id, LockModeType.PESSIMISTIC_WRITE)

// ✅ Fix 4 — optimistic locking (JPA @Version) → retry on conflict
UPDATE wallets SET balance = :new, version = version + 1
 WHERE id = :id AND version = :seen;

// ✅ Fix 5 — idempotency key for external effects
INSERT INTO payments (idempotency_key, ...) VALUES (:key, ...);
// unique key → the second identical request returns the FIRST result
// instead of charging again (the same trick Stripe's API uses)</pre>
<p><strong>Other race-shaped security bugs:</strong> file-system TOCTOU (check permissions, then open — use atomic <code>O_CREAT|O_EXCL</code> or open-then-fstat); MFA/OTP verified in one request and consumed in another; refresh-token rotation without a transaction (two concurrent refreshes both succeed); and "cancel then refund" flows where cancellation and refund are not one transaction. Note that a distributed lock in Redis is not a substitute for a database constraint — locks can expire mid-operation.</p>
<div class="key-point">If money, stock, quotas, or one-time tokens are involved, atomicity is a security control. Push the invariant into the database (conditional update, unique constraint, row lock, version column) and add idempotency keys so retries cannot double-spend.</div>`,
  },
  {
    q: 'What information should an API never leak, and what is user enumeration?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>Information disclosure is the reconnaissance step that makes every other attack cheaper. Stack traces reveal framework versions and file paths, verbose SQL errors hand an attacker the schema, and debug endpoints like an unsecured <code>/actuator/env</code> expose credentials outright. <strong>User enumeration</strong> is the specific case where different responses tell an attacker which accounts exist — "email not found" versus "wrong password", a duplicate-email error on signup, or a measurably faster reply — which turns a credential-stuffing list into a targeted one. The fixes are generic error messages with a correlation ID for support, identical responses and timings across the "exists" and "does not exist" paths, disabled or authenticated debug endpoints, and <code>404</code> instead of <code>403</code> for objects the caller may not see.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Lộ thông tin chính là bước trinh sát giúp mọi cuộc tấn công khác trở nên dễ dàng hơn. Stack trace tiết lộ phiên bản framework và đường dẫn file, lỗi SQL nguyên văn dâng luôn schema cho kẻ tấn công, còn các endpoint debug kiểu <code>/actuator/env</code> không bảo vệ thì phơi thẳng cả credential. <strong>User enumeration</strong> là trường hợp cụ thể khi các phản hồi khác nhau cho biết tài khoản nào có tồn tại — "không tìm thấy email" so với "sai mật khẩu", lỗi trùng email khi đăng ký, hay phản hồi nhanh hơn một cách đo được — biến một danh sách credential stuffing chung thành danh sách có mục tiêu. Cách chữa: thông báo lỗi chung chung kèm một correlation ID để support tra cứu, phản hồi và thời gian phản hồi giống nhau cho cả hai nhánh "có tồn tại" và "không tồn tại", tắt hoặc bảo vệ các endpoint debug, và trả <code>404</code> thay vì <code>403</code> cho những object mà người gọi không được phép thấy.</p></details>
<pre>// ❌ Leaks
{"error":"SQLSyntaxErrorException: Unknown column 'passwd' in 'users'"}
{"error":"No user with email bob@x.com"}          // enumeration
X-Powered-By: Express / Server: Apache-Coyote/1.1 // version fingerprint
GET /actuator/env, /debug, /swagger in production without auth
Stack trace HTML pages (Whitelabel / dev error overlay) in prod
Git metadata deployed: /.git/config, /.env, source maps of admin bundles

// ✅ Safe shape
HTTP 400 {"error":"INVALID_INPUT","traceId":"9f2c..."}   // details in logs
HTTP 401 {"error":"Invalid email or password"}           // same for both
HTTP 404 for objects the caller must not know exist
// Log the real reason server-side, keyed by traceId, and never log
// passwords, tokens, card numbers, or full PII.</pre>
<pre>// Enumeration-safe authentication
const user = await findByEmail(email);
// Always spend the same work, even when the user does not exist:
const hash = user?.passwordHash ?? DUMMY_ARGON2_HASH;
const ok = await argon2.verify(hash, password) && !!user;
if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

// Signup / password reset / "resend verification":
//   respond "If an account exists for that address, we sent an email."
// Rate-limit these endpoints too — otherwise the attacker enumerates
// by observing which requests trigger an email or a 429.</pre>
<p><strong>Where teams get caught:</strong> different HTTP status codes between paths (401 vs 404), field-level validation messages that differ, response-size differences, a "forgot password" flow that says "unknown email", GraphQL errors returning full stack traces, and source maps or <code>.map</code> files shipped to production exposing internal API shapes.</p>
<div class="key-point">Make failure boring and uniform: one generic message, one status code, one response time, a trace ID for correlation, and no debug surface in production. Everything you leak about accounts, versions, or schema becomes the attacker's shortlist.</div>`,
  },
  {
    q: 'What is different about securing a GraphQL API?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>GraphQL moves query construction to the client, so the usual per-endpoint controls stop working. Three problems dominate: <strong>authorization must be enforced per field/resolver</strong>, because one query can reach an object graph sideways (a permitted <code>me</code> query walking into <code>me.company.employees.salary</code>); <strong>query cost</strong> is unbounded, so nested or aliased queries become a DoS unless you cap depth, complexity, and batch size; and <strong>introspection plus verbose errors</strong> hand an attacker the full schema. On top of that, resolvers make rate limiting and N+1 protection non-trivial, so you need a data loader, persisted queries for public traffic, and cost analysis in front of execution.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>GraphQL đẩy việc xây câu query sang cho client, nên những biện pháp kiểm soát theo từng endpoint như trước không còn hiệu lực. Có ba vấn đề nổi bật: <strong>phân quyền phải làm ở từng field/resolver</strong>, vì một câu query có thể đi ngang trong đồ thị object (query <code>me</code> được phép nhưng lại lần sang <code>me.company.employees.salary</code>); <strong>chi phí truy vấn</strong> không có giới hạn, nên query lồng sâu hoặc dùng alias hàng loạt trở thành DoS nếu không chặn độ sâu, độ phức tạp và kích thước batch; và <strong>introspection cộng thông báo lỗi chi tiết</strong> thì dâng luôn toàn bộ schema cho kẻ tấn công. Thêm nữa, resolver làm cho rate limit và chống N+1 khó hơn, nên cần data loader, dùng persisted query cho traffic công khai, và phân tích chi phí truy vấn trước khi thực thi.</p></details>
<pre># 1) Field-level authorization — REST habits do not transfer
query {
  me {                       # allowed
    company {                # allowed?
      employees {            # ← who checked THIS?
        salary               # ← and THIS?
      } } } }
# ✅ Authorize inside each resolver (or with a directive/plugin):
#    salary: (parent, _, ctx) => ctx.can('read:salary', parent) ? ... : null
#    Do not rely on "the parent query was authorized".

# 2) Denial of service by query shape
query { a: user(id:1){...} b: user(id:1){...} ... }   # 1000 aliases
query { posts { author { posts { author { posts ... }}}}}  # deep nesting
# ✅ depth limit (~7-10), complexity/cost limit, disable batching or cap it,
#    paginate every list (max page size), timeout per request

# 3) Schema exposure
# ✅ disable introspection and the playground in production,
#    return generic errors (no stack traces, no "did you mean" hints),
#    prefer persisted/allowlisted queries for public clients</pre>
<pre>// Other GraphQL-specific traps
- Rate limiting by "requests" is meaningless: one POST /graphql can do
  anything → limit by computed cost points per user per minute.
- N+1: 100 items × 1 query each. Use DataLoader batching — this is a
  performance AND availability control.
- File uploads and JSON scalars bypass schema validation → validate inside.
- CSRF: a GraphQL POST with Content-Type: application/json is not a simple
  request, so preflight protects it — but if you accept
  application/x-www-form-urlencoded or GET queries, CSRF comes back.
- Mutations need the same idempotency/race protections as REST.
- Error masking must not hide security events from YOUR logs.</pre>
<div class="key-point">In GraphQL the client composes the query, so security moves into the resolvers: authorize every field against the current user, bound depth/complexity/batching, disable introspection in production, and rate-limit by query cost rather than request count.</div>`,
  },
  {
    q: 'What is mass assignment (over-posting) and how do you prevent it?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>Mass assignment is when a request body is bound straight onto a domain object or entity, so the client can set fields the UI never showed — <code>role: "ADMIN"</code>, <code>isVerified: true</code>, <code>balance</code>, <code>ownerId</code>, or a nested association. It is the mirror image of IDOR: instead of reading someone else's data, the attacker writes fields they should not control, and it is trivially found by adding extra keys to a legitimate JSON payload. The fix is an explicit contract: bind to a purpose-specific DTO with only the writable fields, map field by field, and never pass the request body to <code>save()</code>, <code>Object.assign</code>, or an ORM update. Rejecting unknown properties turns the attempt into a 400 instead of a silent privilege escalation.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mass assignment là khi request body được bind thẳng vào object nghiệp vụ hoặc entity, khiến client đặt được cả những field mà giao diện chưa từng hiển thị — <code>role: "ADMIN"</code>, <code>isVerified: true</code>, <code>balance</code>, <code>ownerId</code>, hay một association lồng nhau. Nó là mặt đối xứng của IDOR: thay vì đọc dữ liệu của người khác, kẻ tấn công ghi vào những field mà họ không được phép điều khiển — và chỉ cần thêm vài key lạ vào một payload JSON hợp lệ là tìm ra ngay. Cách chữa là định nghĩa hợp đồng dữ liệu rõ ràng: bind vào một DTO riêng cho từng mục đích, chỉ chứa các field được phép ghi, map từng field một, và tuyệt đối không đưa request body vào <code>save()</code>, <code>Object.assign</code> hay lệnh update của ORM. Cấu hình từ chối các thuộc tính lạ sẽ biến cuộc thử nghiệm đó thành lỗi 400 thay vì một vụ leo thang quyền âm thầm.</p></details>
<pre>// ❌ Java — the entity is the API
@PutMapping("/users/{id}")
User update(@PathVariable Long id, @RequestBody User user) {
  user.setId(id);
  return repo.save(user);          // role, enabled, createdBy... all writable
}
// PUT {"name":"Bob","role":"ADMIN","enabled":true}  → privilege escalation

// ✅ Explicit DTO + field-by-field mapping
record UpdateUserRequest(@NotBlank String name, @Email String email) {}
@PutMapping("/users/{id}")
UserDto update(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest r,
               @AuthenticationPrincipal Jwt jwt) {
  User u = repo.findByIdAndOwner(id, jwt.getSubject()).orElseThrow();
  u.setName(r.name());                       // only what is allowed
  u.setEmail(r.email());
  return UserDto.of(repo.save(u));           // and never return the entity
}
// Also: spring.jackson.deserialization.fail-on-unknown-properties=true
//       (or @JsonIgnoreProperties(ignoreUnknown = false)) so extra keys 400.</pre>
<pre>// ❌ Node / Mongoose / Prisma
Object.assign(user, req.body); await user.save();
await prisma.user.update({ where: { id }, data: req.body });
// ✅ Pick explicitly, ideally through a schema
const data = z.object({ name: z.string(), email: z.string().email() })
              .strict()                       // unknown keys → error
              .parse(req.body);
await prisma.user.update({ where: { id, ownerId: ctx.userId }, data });</pre>
<p><strong>Sharper variants:</strong> nested writes (<code>{"company":{"id":42}}</code> re-parents your record onto another tenant); <code>@ManyToOne</code> associations bound from the body; GraphQL input types with too many fields; and read-side over-exposure — returning the whole entity leaks <code>passwordHash</code> or internal flags, which is the same mistake in reverse. Use separate request and response models, and let the compiler enforce them.</p>
<div class="key-point">Never bind a request body onto an entity. Define one DTO per operation containing only client-writable fields, reject unknown properties, re-check ownership before saving, and map explicitly in both directions.</div>`,
  },
];
