// Security & JWT — JWT, tokens & sessions
import type { PvQuestion } from '../../../types';

export const questions: PvQuestion[] = [
  {
    q: 'What is JWT and what are its three parts?',
    difficulty: 'easy',
    a: `<div class="interview-answer"><p>A <strong>JWT</strong> has three base64url parts separated by dots: header, payload, and signature. The header names the signing algorithm, the payload holds claims like <code>sub</code>, <code>exp</code>, and roles, and the signature is computed over the first two parts to detect tampering. The payload is only encoded, not encrypted, so anyone can read it and no secrets should be placed there. The signature proves integrity, not confidentiality, and it must be verified on the server or the token is just editable JSON.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>JWT gồm ba phần được encode base64url, nối với nhau bằng dấu chấm: header, payload và signature. Header khai báo thuật toán ký; payload chứa các claim như <code>sub</code>, <code>exp</code>, roles; signature được tính từ hai phần trước nên chỉ cần token bị sửa một ký tự là verify sẽ fail. Payload chỉ được encode chứ không hề được mã hóa, nên ai lấy được token cũng đọc được — tuyệt đối không đặt dữ liệu bí mật vào đây. Signature chỉ bảo đảm tính toàn vẹn (integrity), không bảo đảm tính bí mật (confidentiality); và server bắt buộc phải verify signature, nếu không thì token chẳng khác gì một đoạn JSON mà ai cũng sửa được.</p></details>
<p><strong>JWT (JSON Web Token)</strong> is a compact, URL-safe token format for securely transmitting claims between parties.</p>
<pre>// JWT structure: header.payload.signature
eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEyM30.SflKxwRJSMeKKF2QT4fwpM

// Decoded:
Header:  { "alg": "HS256", "typ": "JWT" }
Payload: { "userId": 123, "role": "admin", "exp": 1699999999 }
Signature: HMACSHA256(base64(header) + "." + base64(payload), secret)</pre>
<ul>
<li><strong>Header</strong>: algorithm (HS256, RS256) and token type</li>
<li><strong>Payload</strong>: claims — registered (exp, iss, sub), public, private</li>
<li><strong>Signature</strong>: ensures token hasn't been tampered with</li>
</ul>
<div class="key-point">JWT is Base64-encoded, NOT encrypted. Anyone can decode and read the payload. Never put passwords or sensitive data in the payload. The signature only guarantees integrity, not confidentiality.</div>`,
  },
  {
    q: 'What is the difference between access tokens and refresh tokens?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>Access and refresh tokens split the job to balance security and usability. The access token is short-lived and sent on every API call, so a leak has a small impact, while the refresh token is long-lived and used only with the auth server to get new access tokens, so it is exposed far less. This avoids sending the most powerful credential on every request and gives a revocation point, because invalidating the refresh token cuts off future access. Best practice adds refresh-token rotation with reuse detection.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Access token và refresh token chia việc cho nhau để vừa an toàn vừa tiện dùng. Access token sống ngắn và được gửi kèm mọi request API, nên nếu bị lộ thì thiệt hại cũng chỉ gói trong vài phút. Refresh token sống lâu nhưng chỉ gửi tới auth server để xin access token mới, nên rất ít khi phải lộ diện. Nhờ vậy ta không phải mang credential mạnh nhất theo từng request, và có thêm một chỗ để thu hồi quyền: xóa refresh token là người dùng không xin được token mới nữa. Thực tế nên làm thêm một bước: mỗi lần refresh thì cấp refresh token mới và phát hiện nếu token cũ bị dùng lại (rotation + reuse detection).</p></details>
<ul>
<li><strong>Access token</strong>: short-lived (5-30 min), sent with every API request, used for authorization.</li>
<li><strong>Refresh token</strong>: long-lived (days-weeks), used ONLY to get new access tokens, stored more securely.</li>
</ul>
<pre>// Flow:
1. Login → Server returns: { accessToken (15min), refreshToken (7d) }
2. API calls: Authorization: Bearer &lt;accessToken&gt;
3. Access token expires → 401 Unauthorized
4. POST /refresh { refreshToken } → new accessToken
5. Continue API calls with new accessToken

// Why two tokens?
// Short access token = limited damage window if stolen
// Long refresh token = user doesn't re-login constantly
// Refresh token can be revoked server-side</pre>
<p><strong>Security considerations:</strong></p>
<ul>
<li>Rotate refresh tokens on each use (one-time use)</li>
<li>Store refresh tokens in HttpOnly cookies or server-side</li>
<li>Detect refresh token reuse (indicates theft)</li>
</ul>
<div class="key-point">If an attacker steals an access token, the damage is limited to its lifetime (minutes). If they steal a refresh token, you can revoke it server-side. This is why refresh tokens need stronger protection.</div>`,
  },
  {
    q: 'Where should JWT be stored in the browser?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>An <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite</code> cookie is generally preferred over localStorage for storing a token. localStorage can be read by any JavaScript, so a single XSS flaw can steal the token, while an HttpOnly cookie is hidden from scripts. The tradeoff is that cookies add CSRF exposure, but CSRF is easier to defend with <code>SameSite</code> and anti-CSRF tokens. If XSS exists no storage is fully safe, so token storage is a mitigation, not a replacement for output encoding and a strong CSP.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Nên ưu tiên cookie <code>HttpOnly</code> + <code>Secure</code> + <code>SameSite</code> hơn là localStorage. localStorage thì mọi đoạn JavaScript trên trang đều đọc được, nên chỉ một lỗ hổng XSS là token bị lấy sạch; còn cookie HttpOnly thì JavaScript không chạm tới được. Đổi lại, cookie mở ra rủi ro CSRF — nhưng CSRF dễ chống hơn nhiều, chỉ cần <code>SameSite</code> cộng anti-CSRF token. Lưu ý: khi đã bị XSS thì không có chỗ lưu nào an toàn tuyệt đối, nên chọn chỗ lưu token chỉ là giảm thiểu rủi ro, không thay được việc escape dữ liệu khi render và một CSP chặt chẽ.</p></details>
<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
<tr><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;">Storage</th><th style="padding:6px;border-bottom:1px solid #ccc;">XSS Risk</th><th style="padding:6px;border-bottom:1px solid #ccc;">CSRF Risk</th><th style="padding:6px;border-bottom:1px solid #ccc;">Survives Refresh</th></tr>
<tr><td style="padding:6px;">localStorage</td><td style="padding:6px;">❌ High (JS accessible)</td><td style="padding:6px;">✅ None</td><td style="padding:6px;">✅ Yes</td></tr>
<tr><td style="padding:6px;">HttpOnly Cookie</td><td style="padding:6px;">✅ Safe (JS can't read)</td><td style="padding:6px;">❌ Needs SameSite/CSRF token</td><td style="padding:6px;">✅ Yes</td></tr>
<tr><td style="padding:6px;">Memory (variable)</td><td style="padding:6px;">✅ Safest</td><td style="padding:6px;">✅ None</td><td style="padding:6px;">❌ Lost on refresh</td></tr>
</table>
<pre>// Recommended approach:
// Access token: in memory (JavaScript variable)
// Refresh token: HttpOnly + Secure + SameSite=Strict cookie

// Cookie setup (server-side):
Set-Cookie: refreshToken=xyz;
  HttpOnly;       // JS can't access → XSS safe
  Secure;         // HTTPS only
  SameSite=Strict; // prevents CSRF
  Path=/api/refresh; // only sent to refresh endpoint
  Max-Age=604800     // 7 days</pre>
<div class="key-point">The strongest default: short-lived access tokens in memory + refresh tokens in HttpOnly cookies. This protects against both XSS (can't steal from memory/HttpOnly) and CSRF (SameSite).</div>`,
  },
  {
    q: 'How do you validate JWT securely on the backend?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Validating a JWT is more than checking the signature. A known attack is trusting the token's own <code>alg</code> header, where an attacker sets it to <code>none</code> or swaps RS256 for HS256, so the expected algorithm must be pinned on the server. After verifying the signature with the correct key, the standard claims must be checked, including <code>exp</code>, <code>nbf</code>, <code>iss</code>, and <code>aud</code>, so a token meant for another service cannot be replayed. With rotating keys the key is resolved by <code>kid</code> using the provider's JWKS, and no claim is trusted before the signature is verified.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Verify JWT không chỉ là kiểm tra signature. Có một kiểu tấn công kinh điển: server tin vào header <code>alg</code> do chính token khai báo, kẻ tấn công đổi nó thành <code>none</code> hoặc đổi RS256 thành HS256 — vì vậy server phải tự quy định trước thuật toán mà mình chấp nhận. Sau khi verify signature bằng đúng key, phải kiểm tra tiếp các claim chuẩn: <code>exp</code>, <code>nbf</code>, <code>iss</code> và <code>aud</code> — nhờ <code>aud</code> mà token phát cho service khác không thể mang sang service của mình dùng. Nếu hệ thống có xoay khóa thì tra key theo <code>kid</code> trong JWKS của provider. Nguyên tắc: chưa verify signature xong thì không tin bất kỳ claim nào.</p></details>
<pre>// JWT validation checklist:
1. Verify SIGNATURE with the correct key/secret
2. Check EXPIRATION (exp claim) — reject expired tokens
3. Check NOT-BEFORE (nbf claim) — reject if before activation
4. Validate ISSUER (iss) — must match your auth server
5. Validate AUDIENCE (aud) — must match your API
6. WHITELIST allowed algorithms — prevent algorithm confusion attack

// Java (Spring Security + jjwt):
Claims claims = Jwts.parserBuilder()
    .setSigningKey(secretKey)           // verify signature
    .requireIssuer("https://auth.myapp.com")  // validate issuer
    .requireAudience("my-api")         // validate audience
    .build()
    .parseClaimsJws(token)             // throws if invalid
    .getBody();

// Check expiration is automatic with jjwt

// CRITICAL: Never do this!
❌ Jwts.parser().setSigningKey(key).parse(token)  // 'parse' accepts unsigned!
✅ Jwts.parser().setSigningKey(key).parseClaimsJws(token)  // 'parseClaimsJws' requires signature</pre>
<p><strong>Algorithm confusion attack:</strong></p>
<pre>// Attacker changes header: { "alg": "none" }
// If server accepts "none" algorithm → anyone can forge tokens!
// Always whitelist: .setAllowedClockSkewSeconds(30)
//                    .require("alg", "RS256")</pre>
<div class="key-point">Never trust a decoded token unless the signature and ALL claims are verified. The most dangerous mistake: accepting <code>alg: none</code> or using the wrong key type.</div>`,
  },
  {
    q: 'What are common JWT security vulnerabilities?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Most JWT vulnerabilities come from trusting the token too much. The main ones are algorithm confusion and the <code>alg: none</code> attack, weak or hardcoded HMAC secrets, no easy revocation for long-lived tokens, storing tokens where XSS can read them, sensitive data in the readable payload, and missing <code>aud</code> or <code>iss</code> checks that allow replay across services. The fixes are to pin the algorithm on the server, use strong or asymmetric keys, keep tokens short-lived with a denylist or rotation, and validate every claim. The theme is to validate everything server-side and never confuse encoding with encryption.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Phần lớn lỗ hổng JWT sinh ra từ việc tin token quá dễ dãi. Những lỗi hay gặp nhất: algorithm confusion và <code>alg: none</code>; secret HMAC quá yếu hoặc hardcode trong code; token sống quá lâu mà không có cách thu hồi; lưu token ở chỗ XSS đọc được; nhét dữ liệu nhạy cảm vào payload (vốn ai cũng đọc được); và bỏ qua kiểm tra <code>aud</code>/<code>iss</code> nên token bị dùng chéo giữa các service. Cách chữa: server tự quy định thuật toán, dùng secret đủ mạnh hoặc chuyển sang khóa bất đối xứng, giữ token sống ngắn kèm denylist hoặc rotation, và validate đủ mọi claim. Tóm lại: mọi thứ phải được kiểm tra ở server, và đừng nhầm "encode" với "mã hóa".</p></details>
<ol>
<li><strong>Algorithm confusion</strong>: Attacker changes RS256→HS256, uses public key as HMAC secret. Fix: whitelist algorithms.</li>
<li><strong>Weak signing secret</strong>: Short secrets can be brute-forced. Fix: use 256+ bit random secrets or asymmetric keys.</li>
<li><strong>Long token lifetime</strong>: Stolen tokens valid for hours/days. Fix: short-lived access tokens (5-15 min).</li>
<li><strong>Sensitive data in payload</strong>: JWT is encoded, not encrypted. Fix: never put passwords, SSNs, or PII in tokens.</li>
<li><strong>Missing revocation</strong>: JWT is stateless — no way to invalidate. Fix: short lifetime + server-side refresh token revocation.</li>
<li><strong>Token stored in localStorage</strong>: Accessible via XSS. Fix: use HttpOnly cookies or memory.</li>
<li><strong>No audience/issuer check</strong>: Token from Service A accepted by Service B. Fix: validate iss and aud claims.</li>
</ol>
<pre>// Vulnerability: algorithm confusion attack
// Attacker takes RS256 token, changes header to HS256
// Signs with the PUBLIC KEY (which is... public!)
// Server using "flexible" algorithm verification → accepts it!
// Fix: ALWAYS enforce expected algorithm on the server</pre>
<div class="key-point">Most JWT problems come from implementation mistakes, not from the token format itself. Use well-maintained libraries (jose, jjwt, jsonwebtoken) and follow their security guides.</div>`,
  },
  {
    q: 'How do you handle logout or revocation with JWT?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>JWT is hard to revoke because validation is stateless and offline, so a token stays valid until <code>exp</code> even after client-side logout. One practical strategy is short-lived access tokens plus a revocable refresh token, so logout invalidates the refresh token and access dies quickly on its own. For immediate revocation a server-side denylist keyed by <code>jti</code> is checked on each request, but this adds back the stateful lookup that JWT tries to avoid. If instant, reliable revocation is required, a server-side session may be a better fit.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>JWT khó thu hồi vì server verify token theo kiểu stateless, không tra cứu ở đâu cả — nên token vẫn hợp lệ cho tới khi hết <code>exp</code>, dù người dùng đã bấm logout. Cách làm thực tế: access token sống ngắn cộng refresh token lưu ở server và có thể xóa; logout thì xóa refresh token, còn access token tự hết hạn sau vài phút. Nếu buộc phải chặn ngay lập tức thì dùng denylist ở server, tra theo claim <code>jti</code> ở mỗi request — nhưng như vậy là ta lại thêm đúng cái truy vấn stateful mà JWT muốn tránh. Khi yêu cầu là "logout phải có hiệu lực tức thì và chắc chắn" thì session lưu ở server lại là lựa chọn hợp lý hơn.</p></details>
<p>JWT is stateless by design — there's no built-in way to invalidate a token before it expires. Here are strategies:</p>
<pre>// Strategy 1: Short-lived access tokens (simplest)
Access token: 5-15 minutes
→ After logout, token expires quickly on its own
→ Con: still valid for a few minutes after logout

// Strategy 2: Token blacklist (for immediate logout)
On logout:
  → Add token ID (jti claim) to Redis blacklist
  → Set TTL = token's remaining lifetime
  → On every request: check if jti is blacklisted

BLACKLIST in Redis:
  SET "revoked:abc123" "" EX 900  // expires in 15 min

// Strategy 3: Server-side refresh token store (recommended)
On logout:
  → Delete refresh token from database
  → Access token expires naturally (short-lived)
  → User can't get new access tokens

// Strategy 4: Token versioning
User table: { id, tokenVersion: 5 }
JWT payload: { userId: 123, tokenVersion: 5 }
On logout: increment tokenVersion to 6
→ All existing tokens with version 5 become invalid</pre>
<div class="key-point">The practical approach: short-lived access tokens (5 min) + revocable server-side refresh tokens. Immediate logout everywhere needs a revocation store (Redis blacklist or token versioning).</div>`,
  },
  {
    q: 'What is the difference between symmetric and asymmetric JWT signing?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Symmetric signing (<code>HS256</code>) uses one shared secret to both sign and verify a token. Asymmetric signing (<code>RS256</code>, <code>ES256</code>) signs with a private key and verifies with a public key. When many services or outside parties need to verify tokens, asymmetric is better because the public key can be shared freely and only the auth server holds the private key. It also supports JWKS and key rotation. When you accept both, pin the algorithm to avoid an algorithm-confusion attack.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Ký đối xứng (<code>HS256</code>) dùng một secret duy nhất cho cả việc ký và verify. Ký bất đối xứng (<code>RS256</code>, <code>ES256</code>) ký bằng private key và verify bằng public key. Khi có nhiều service — hoặc cả đối tác bên ngoài — cần verify token thì nên chọn bất đối xứng: public key công bố thoải mái, còn private key chỉ auth server giữ. Cách này cũng đi kèm JWKS và xoay khóa theo <code>kid</code> rất thuận tiện. Lưu ý: nếu hệ thống chấp nhận cả hai loại thuật toán thì phải cố định (pin) thuật toán, nếu không sẽ mắc algorithm confusion — kẻ tấn công lấy chính public key làm secret HMAC.</p></details>
<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
<tr><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;">Aspect</th><th style="padding:6px;border-bottom:1px solid #ccc;">Symmetric (HS256)</th><th style="padding:6px;border-bottom:1px solid #ccc;">Asymmetric (RS256)</th></tr>
<tr><td style="padding:6px;">Keys</td><td style="padding:6px;">One shared secret</td><td style="padding:6px;">Private key + Public key</td></tr>
<tr><td style="padding:6px;">Sign</td><td style="padding:6px;">Same secret</td><td style="padding:6px;">Private key (auth server only)</td></tr>
<tr><td style="padding:6px;">Verify</td><td style="padding:6px;">Same secret</td><td style="padding:6px;">Public key (anyone can verify)</td></tr>
<tr><td style="padding:6px;">Secret distribution</td><td style="padding:6px;">Must share secret with all verifiers</td><td style="padding:6px;">Only public key shared (safe)</td></tr>
</table>
<pre>// Symmetric (HS256): one secret for both signing and verifying
HMACSHA256(payload, "my-shared-secret")
// Every service that verifies tokens needs the secret → security risk

// Asymmetric (RS256): separate keys
Sign with PRIVATE key (only auth server has this)
Verify with PUBLIC key (published at /.well-known/jwks.json)
// Any service can verify without knowing the signing key!

// JWKS endpoint:
GET https://auth.myapp.com/.well-known/jwks.json
→ { "keys": [{ "kty": "RSA", "n": "...", "e": "AQAB" }] }</pre>
<div class="key-point">Use asymmetric (RS256/ES256) when many services need to verify tokens but only one authority should sign. This is the standard approach for microservices and third-party auth providers.</div>`,
  },
  {
    q: 'How does refresh token rotation with reuse detection work?',
    difficulty: 'tricky',
    a: `<div class="interview-answer"><p>Rotation makes every refresh token single-use: each refresh returns a new token and cancels the old one. Because tokens are one-time, if an old token is used again it is a strong sign it was stolen. The server then revokes the whole token family and forces the user to log in again, which limits how long a stolen token is useful. The server tracks this with a family ID and a used flag. A small grace window is needed so normal retries or two open tabs are not mistaken for a stolen token.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Rotation nghĩa là mỗi refresh token chỉ dùng được một lần: mỗi lần refresh, server phát ra cặp token mới và vô hiệu token cũ. Vì token chỉ dùng một lần, nếu một token cũ lại xuất hiện thì gần như chắc chắn nó đã bị đánh cắp — bình thường chuyện đó không thể xảy ra. Lúc đó server thu hồi cả "họ" token (token family) và buộc người dùng đăng nhập lại, nhờ vậy token bị cắp chỉ dùng được trong thời gian rất ngắn. Server theo dõi việc này bằng một family ID và trạng thái đã-dùng của từng token. Cần chừa một khoảng ân hạn nhỏ, để những lần retry do mạng lỗi hoặc hai tab cùng refresh không bị hiểu nhầm là bị đánh cắp.</p></details>
<p><strong>Refresh token rotation</strong> means every refresh token is <strong>one-time use</strong>: each time the client refreshes, the server issues a NEW refresh token and invalidates the old one. The senior-level part is <strong>reuse detection</strong> — what happens when an already-used token shows up again.</p>
<pre>// Normal flow (rotation):
Client                        Server
  |-- POST /refresh (RT1) -->  |  RT1 valid → mark RT1 used
  |&lt;-- AT2 + RT2 ------------  |  issue new pair, same "family" F
  |-- POST /refresh (RT2) -->  |  RT2 valid → mark RT2 used
  |&lt;-- AT3 + RT3 ------------  |

// Theft scenario (reuse detection):
Attacker steals RT2 and uses it first:
  Attacker -- /refresh (RT2) --> server → OK, issues RT3' to attacker
  Victim   -- /refresh (RT2) --> server → RT2 ALREADY USED!
  → This is impossible in normal operation
  → Someone has a stolen copy → REVOKE THE ENTIRE FAMILY F
  → Both attacker's RT3' and victim's tokens are dead
  → Victim re-authenticates; attacker is locked out</pre>
<pre>// Server-side model:
refresh_tokens table:
  id | family_id | user_id | status (active|used|revoked) | expires_at

async function refresh(token) {
  const row = await db.findRefreshToken(hash(token));
  if (!row) throw new AuthError(401);

  if (row.status !== 'active') {
    // Reuse detected → nuke the whole family
    await db.revokeFamily(row.family_id);
    alertSecurityTeam(row.user_id);
    throw new AuthError(401);
  }
  await db.markUsed(row.id);
  return issueNewPair(row.user_id, row.family_id); // same family
}</pre>
<p><strong>Why revoke the whole family?</strong> After reuse you cannot tell which party (victim or attacker) holds the "current" token — the attacker may have refreshed first and now owns the newest one. Killing the family is the only safe move.</p>
<p><strong>Interviewer follow-ups:</strong> race conditions (a legitimate client retrying a timed-out refresh looks like reuse — allow a small grace window or make refresh idempotent per token), storing only <strong>hashes</strong> of refresh tokens, and binding the family to device/IP fingerprints for alerting.</p>
<div class="key-point">Rotation limits the blast radius of a stolen refresh token; reuse detection turns the stolen token into a tripwire — one replay and the entire token family is revoked.</div>`,
  },
  {
    q: 'Why should you NOT use JWT for user sessions? When does JWT actually win?',
    difficulty: 'tricky',
    a: `<div class="interview-answer"><p>For a normal browser session, a server-side session is often the better choice: a random opaque ID in an HttpOnly cookie, with the state kept in Redis. Sessions are easy to revoke, permissions update instantly, and the cookie stays small. JWT is stateless, but that makes logout and revocation hard, and most apps still call Redis on every request. JWT is a good fit for stateless cross-service or third-party access, mobile and API clients, and single sign-on. The right tool depends on the case, not on hype.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Với một web app bình thường, session lưu ở server thường là lựa chọn tốt hơn: một session ID ngẫu nhiên vô nghĩa (opaque) đặt trong cookie HttpOnly, còn dữ liệu session nằm trong Redis. Kiểu này thu hồi rất dễ, đổi quyền là có hiệu lực ngay, và cookie thì nhỏ gọn. JWT tuy stateless nhưng chính vì vậy mà logout và thu hồi mới khó — rốt cuộc phần lớn hệ thống vẫn phải hỏi Redis ở mỗi request, tức là quay về đúng chỗ ban đầu. JWT thật sự đáng dùng khi cần xác thực xuyên nhiều service hoặc cho bên thứ ba, cho client mobile/API, và cho single sign-on. Chọn theo bài toán, đừng chọn theo trào lưu.</p></details>
<p>This contrarian question separates seniors from tutorial-followers. JWT is often the <strong>wrong</strong> tool for classic browser sessions:</p>
<ul>
<li><strong>You can't revoke it</strong>: logout, password change, "ban this user now" — the token stays valid until <code>exp</code>. Every fix (blacklist in Redis, token versioning) reintroduces the server-side state JWT was supposed to eliminate.</li>
<li><strong>Payload bloat</strong>: roles, permissions, profile data get stuffed in; the token is sent on EVERY request. A 4 KB JWT vs a 32-byte session ID on every call adds up.</li>
<li><strong>Stale claims</strong>: role changes don't take effect until the token expires — admin demoted at 10:00 is still admin until 10:15.</li>
<li><strong>Clock skew</strong>: <code>exp</code>/<code>nbf</code> checks across servers with drifting clocks cause mysterious intermittent 401s (mitigate with a small leeway).</li>
<li><strong>Logout is a lie</strong>: deleting the cookie client-side doesn't invalidate the token an attacker already copied.</li>
</ul>
<pre>// Stateful session — boring and correct for one web app:
// Cookie: sessionId=abc123 (HttpOnly, Secure, SameSite)
const session = await redis.get('sess:' + sessionId);
// Logout?    redis.del('sess:' + sessionId)  → dead INSTANTLY
// Ban user?  delete all their sessions       → done
// Lookup cost: ~0.2ms Redis GET — almost never your bottleneck

// JWT "logout" in comparison:
// option A: wait for exp (user is "logged out" but token works)
// option B: Redis blacklist checked on every request
//           → congratulations, you rebuilt session storage</pre>
<p><strong>When JWT genuinely wins:</strong></p>
<ul>
<li><strong>Cross-service auth</strong>: service B verifies a token issued by auth server A with just the public key — no shared session store, no network hop.</li>
<li><strong>Short-lived access tokens</strong> (5–15 min) paired with revocable server-side refresh tokens — the standard OAuth2 pattern.</li>
<li><strong>Stateless one-shot grants</strong>: signed download links, email verification, password reset tokens.</li>
</ul>
<div class="key-point">For a single web app, a session ID in an HttpOnly cookie + Redis is simpler and instantly revocable. JWT earns its complexity only for short-lived, cross-service credentials — "stateless" just means the state problem moved, not disappeared.</div>`,
  },
  {
    q: 'What is JWE, and what are sender-constrained tokens (DPoP, mTLS binding)?',
    difficulty: 'tricky',
    a: `<div class="interview-answer"><p>A normal JWT is signed but readable (JWS). <strong>JWE</strong> is the encrypted variant — five parts instead of three — used when claims must stay hidden from the client or from intermediaries; in practice it is rare, because the better answer is usually to keep sensitive data out of the token and store it server-side. The more important modern concept is <strong>sender-constrained</strong> (proof-of-possession) tokens: a plain bearer token is like cash, so anyone who steals it can use it. <strong>DPoP</strong> binds the token to a key pair held by the client — each request carries a short signed proof — and <strong>mTLS binding</strong> binds it to the client certificate, so a stolen token is useless without the private key. That is where high-security APIs (open banking, FAPI) are heading, and it is the real fix for token theft that short lifetimes only mitigate.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một JWT thông thường thì có ký nhưng đọc được (JWS). <strong>JWE</strong> là biến thể đã mã hóa — năm phần thay vì ba — dùng khi claim phải được che khỏi client hoặc khỏi các thành phần trung gian; nhưng thực tế nó khá ít gặp, vì lời giải tốt hơn thường là đừng để dữ liệu nhạy cảm trong token mà lưu ở phía server. Khái niệm quan trọng hơn và hiện đại hơn là token <strong>gắn với người gửi</strong> (proof-of-possession): một bearer token thuần thì giống như tiền mặt, ai cắp được cũng dùng được. <strong>DPoP</strong> gắn token với một cặp khóa mà client giữ — mỗi request kèm theo một proof ngắn có ký — còn <strong>mTLS binding</strong> thì gắn token với certificate của client, nên token bị đánh cắp mà không có private key thì vô dụng. Đây là hướng đi của các API bảo mật cao (open banking, FAPI), và là cách chữa thật sự cho việc token bị đánh cắp — thứ mà thời gian sống ngắn chỉ giảm nhẹ được.</p></details>
<pre>// JWS (what people mean by "JWT") — signed, readable
header.payload.signature                        → 3 parts, base64url
// JWE — encrypted
header.encryptedKey.iv.ciphertext.tag           → 5 parts
{ "alg":"RSA-OAEP-256", "enc":"A256GCM" }       // key wrap + content enc
// Use JWE when: claims are sensitive AND must travel through parties you
// do not trust (rare). Cost: key management on both sides, bigger tokens,
// and you still cannot revoke it.
// Usually better: put an opaque id in the token, keep the data server-side.

// Nested JWT: sign, then encrypt (JWS inside JWE) — order matters,
// because "encrypt then sign" lets a signature be stripped and replaced.</pre>
<pre>// Bearer vs sender-constrained
Authorization: Bearer eyJ...        ← whoever holds it, uses it (cash)

// DPoP (RFC 9449): client proves possession of a private key per request
Authorization: DPoP eyJ...          ← the access token, bound to a JWK thumbprint
DPoP: eyJ0eXAiOiJkcG9wK2p3dCIs...   ← a fresh signed proof containing:
      { htm: "POST", htu: "https://api/orders",   // method + URL bound
        iat: ..., jti: "unique",                  // replay protection
        ath: sha256(access_token) }               // ties proof to the token
// The access token carries cnf: { jkt: &lt;thumbprint of the client key&gt; }.
// Server checks: signature of the proof, jkt match, htm/htu match,
// iat freshness, and jti not seen before (small replay cache).
// → a stolen access token cannot be used without the client's private key.

// mTLS-bound tokens (RFC 8705): cnf: { "x5t#S256": &lt;cert thumbprint&gt; }
// The token only works on a TLS connection using that client certificate.
// Simpler for server-to-server; DPoP suits browsers and mobile apps.</pre>
<p><strong>How to place this in an interview:</strong> short lifetimes, rotation, and secure storage reduce the <em>window</em> of a stolen token; sender-constraining removes the value of the theft. If someone asks "how do we stop token replay entirely?", bearer tokens cannot — DPoP or mTLS binding is the answer, at the cost of client complexity and a replay cache on the server.</p>
<div class="key-point">JWE encrypts claims but is rarely the right tool — keep secrets out of tokens instead. The concept that matters is proof-of-possession: DPoP (per-request signed proof) or mTLS binding turns a bearer token into one only the legitimate client can use.</div>`,
  },
];
