// Security & JWT — OAuth 2.0, OIDC, SSO & MFA
import type { PvQuestion } from '../../../types';

export const questions: PvQuestion[] = [
  // ──── OAuth 2.0 / OIDC core ────
  {
    q: 'What is the difference between OAuth 2.0 and JWT?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>OAuth 2.0 and JWT are not alternatives. OAuth 2.0 is an authorization framework that defines flows for granting delegated access, while a JWT is just a signed token format. OAuth defines how a client gets a token, and a JWT is one possible format that token can take, since OAuth tokens can also be opaque random strings the server looks up. They often work together, for example an OAuth flow that returns a JWT access token, so using JWTs does not mean OAuth has been implemented.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>OAuth 2.0 và JWT không phải hai thứ để đem ra so sánh thay thế nhau. OAuth 2.0 là một framework về authorization, định nghĩa các luồng (flow) để cấp quyền truy cập thay mặt người dùng. Còn JWT chỉ là một định dạng token có ký. OAuth quy định client lấy token bằng cách nào; JWT là một trong những định dạng mà token đó có thể mang — token OAuth cũng có thể là một chuỗi ngẫu nhiên vô nghĩa (opaque) mà server phải tra cứu mới biết nội dung. Hai thứ này thường đi cùng nhau, ví dụ một luồng OAuth trả về access token dạng JWT. Vì vậy, dùng JWT không có nghĩa là bạn đã triển khai OAuth.</p></details>
<ul>
<li><strong>OAuth 2.0</strong>: an <strong>authorization framework</strong> that defines flows for granting access. It specifies WHO can access WHAT.</li>
<li><strong>JWT</strong>: a <strong>token format</strong> that encodes claims as JSON. It's a container, not a protocol.</li>
</ul>
<pre>OAuth 2.0 can use different token formats:
  - JWT (self-contained, no DB lookup needed)
  - Opaque tokens (random string, server must look up)

JWT can be used outside OAuth:
  - Session replacement in your own auth system
  - API key alternative
  - Service-to-service authentication

// Typical combination:
OAuth 2.0 Authorization Server → issues JWT access tokens
Resource Server → validates JWT without calling auth server</pre>
<div class="key-point">OAuth 2.0 is the "process" (how to get a token). JWT is the "envelope" (what the token looks like). They're complementary, not competing.</div>`,
  },
  {
    q: 'What is OpenID Connect and how is it related to OAuth 2.0?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>OpenID Connect is an identity layer built on top of OAuth 2.0. OAuth 2.0 only handles authorization and does not say who the user is, so OIDC adds an <code>id_token</code>, which is a JWT with standard identity claims like <code>sub</code>, <code>email</code>, <code>iss</code>, and <code>aud</code>, plus a userinfo endpoint. The model is OAuth for authorization through the access token and OIDC for authentication through the ID token. A common mistake is confusing the two tokens, since the access token calls APIs and the ID token proves who logged in.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>OpenID Connect là lớp identity dựng thêm trên OAuth 2.0. OAuth 2.0 chỉ giải quyết chuyện cấp quyền, nó không cho ứng dụng biết người dùng là ai. OIDC bổ sung <code>id_token</code> — một JWT chứa các claim identity chuẩn như <code>sub</code>, <code>email</code>, <code>iss</code>, <code>aud</code> — cùng với endpoint userinfo. Cách nhớ: OAuth lo authorization thông qua access token, OIDC lo authentication thông qua ID token. Lỗi hay gặp là dùng lẫn hai token: access token mới là thứ để gọi API, còn ID token chỉ để biết ai vừa đăng nhập và không nên gửi tới API như một credential.</p></details>
<p><strong>OpenID Connect (OIDC)</strong> is an identity layer built ON TOP of OAuth 2.0.</p>
<pre>OAuth 2.0 alone:
  "This app can access your Google Drive photos"
  → Authorization (access to resources)
  → Doesn't tell you WHO the user is

OIDC adds:
  "The user is john@gmail.com, their name is John Doe"
  → Authentication (identity verification)
  → Returns an ID Token (JWT) with user info

// OIDC flow:
1. App redirects to Google: scope=openid email profile
2. User logs in on Google
3. Google returns:
   - Access Token (OAuth): for API access
   - ID Token (OIDC): JWT with user identity
   - Refresh Token: for renewing access

// ID Token payload:
{
  "iss": "https://accounts.google.com",
  "sub": "1234567890",        // unique user ID
  "email": "john@gmail.com",
  "name": "John Doe",
  "picture": "https://...",
  "exp": 1699999999
}</pre>
<div class="key-point">When someone says "Login with Google/GitHub/Microsoft", that's OIDC in action. OAuth 2.0 handles the authorization, OIDC adds the user identity on top.</div>`,
  },
  {
    q: 'What are the OAuth 2.0 grant types and which should you use today?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Only a few grants are still recommended. <strong>Authorization code + PKCE</strong> is the default for every user-facing client — web apps, SPAs, and mobile — because the token never travels in the URL and the code cannot be replayed by another app. <strong>Client credentials</strong> is for machine-to-machine calls where there is no user. The <strong>device code</strong> grant covers TVs and CLIs that cannot show a browser. The <strong>implicit</strong> grant and <strong>password (ROPC)</strong> grant are deprecated by OAuth 2.1: implicit leaks tokens through the URL fragment and has no refresh story, while ROPC makes your app handle the user's password, which defeats the entire point of delegated authorization and blocks MFA and SSO.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hiện nay chỉ còn vài grant được khuyến nghị. <strong>Authorization code + PKCE</strong> là lựa chọn mặc định cho mọi client có người dùng — web app, SPA và mobile — vì token không đi qua URL và authorization code không thể bị ứng dụng khác đem đi dùng lại. <strong>Client credentials</strong> dành cho các lời gọi máy-với-máy, khi không có người dùng nào cả. Grant <strong>device code</strong> dành cho TV hay CLI không mở được browser. Còn grant <strong>implicit</strong> và <strong>password (ROPC)</strong> đã bị OAuth 2.1 loại bỏ: implicit làm lộ token qua fragment của URL và không có cơ chế refresh, còn ROPC buộc ứng dụng của bạn phải tự xử lý mật khẩu người dùng — đi ngược lại toàn bộ ý nghĩa của uỷ quyền, đồng thời chặn luôn MFA và SSO.</p></details>
<pre>✅ Authorization Code + PKCE — users (web, SPA, mobile, desktop)
   browser → /authorize?response_type=code&code_challenge=...
   → user authenticates at the IdP (MFA, SSO happen here)
   → redirect back with ?code=...&state=...
   → server/app exchanges code + code_verifier at /token  → tokens
   Public clients (SPA/mobile) have no secret → PKCE replaces it.

✅ Client Credentials — service-to-service, no user present
   POST /token grant_type=client_credentials + client_id/secret (or
   private_key_jwt / mTLS client auth, which are stronger than a secret)
   → access token representing the SERVICE, scoped narrowly

✅ Device Authorization — TVs, CLIs, IoT
   device shows a code + URL, user approves on a phone, device polls /token

✅ Refresh Token — renew access tokens; rotate them, bind to the client
   (SPAs: rotation + short TTL, or use BFF so tokens stay server-side)

❌ Implicit (response_type=token) — token in the URL fragment: leaks via
   history, Referer, logs; no refresh; replaced by code+PKCE
❌ Resource Owner Password Credentials — your app collects the password:
   no MFA, no SSO, no consent, and it trains users to type credentials
   into any form. Only ever seen in legacy migrations.</pre>
<p><strong>Choosing in practice:</strong> SPA → code + PKCE, ideally with a <strong>BFF</strong> (Backend-for-Frontend) that keeps tokens in an HttpOnly cookie so no token ever touches JavaScript; mobile → code + PKCE in a system browser (<code>ASWebAuthenticationSession</code>/Custom Tabs, never an embedded WebView); server-side web app → code flow with a confidential client; cron job or microservice → client credentials with <code>private_key_jwt</code> or mTLS rather than a shared secret.</p>
<div class="key-point">Two grants cover almost everything: authorization code + PKCE for anything with a human, client credentials for machines. If a design proposes implicit or password grant, that is the finding.</div>`,
  },
  {
    q: 'What problem does PKCE solve, and how does it work?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>PKCE (Proof Key for Code Exchange) protects the authorization code against interception by a client that cannot keep a secret. A mobile app or SPA has no confidential <code>client_secret</code>, so if an attacker captures the redirect containing the code — a malicious app registered on the same custom URL scheme, a shoulder-surfed log, a leaky referrer — they could exchange it for tokens. With PKCE the client invents a random <code>code_verifier</code>, sends only its SHA-256 hash (<code>code_challenge</code>) when starting the flow, and must present the original verifier at the token endpoint; a stolen code alone is therefore useless. It is now recommended for <em>all</em> clients, including confidential ones, because it also blocks code-injection attacks.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>PKCE bảo vệ authorization code khỏi bị chặn bắt, dành cho những client không thể giữ được secret. Một app mobile hay SPA không có <code>client_secret</code> bí mật, nên nếu kẻ tấn công bắt được cái redirect chứa code — bằng một app độc hại đăng ký cùng custom URL scheme, một dòng log bị lộ, hay header referrer rò rỉ — thì họ đổi code đó thành token được. Với PKCE, client tự sinh một <code>code_verifier</code> ngẫu nhiên, lúc bắt đầu flow chỉ gửi lên bản băm SHA-256 của nó (<code>code_challenge</code>), và tới bước đổi token thì phải trình ra đúng verifier gốc; vì vậy có code mà không có verifier thì vô dụng. Hiện nay PKCE được khuyến nghị cho <em>mọi</em> client, kể cả client có secret, vì nó còn chặn được cả tấn công chèn authorization code.</p></details>
<pre>// 1. Client generates a high-entropy secret, per authorization request
code_verifier  = base64url(random(32))                  // kept in memory
code_challenge = base64url(sha256(code_verifier))       // sent publicly

// 2. Authorization request carries only the challenge
GET /authorize?response_type=code&client_id=app
  &redirect_uri=https://app.example.com/cb
  &code_challenge=E9Melhoa...&code_challenge_method=S256
  &state=xyz&scope=openid%20profile

// 3. Redirect back: ?code=SplxlOB&state=xyz
//    ← an attacker who steals THIS still cannot proceed

// 4. Token exchange must prove knowledge of the verifier
POST /token grant_type=authorization_code&code=SplxlOB
  &code_verifier=dBjftJeZ4CVP...&redirect_uri=...
// Server: sha256(code_verifier) == stored code_challenge ? issue : reject</pre>
<p><strong>Details that matter:</strong> always use <code>S256</code>, never <code>plain</code> (which offers no protection if the request itself is observed); the verifier must be per-request, from a CSPRNG, and never persisted; PKCE does <em>not</em> replace the <code>state</code> parameter, which defends against CSRF on the callback; and it does not protect a token once issued — that is what short lifetimes, refresh rotation, and sender-constrained tokens (DPoP, mTLS binding) are for.</p>
<p><strong>Related hardening for public clients:</strong> exact-match registered redirect URIs, refresh token rotation with reuse detection, and — for browser apps — the BFF pattern so tokens live in an HttpOnly cookie instead of JavaScript memory.</p>
<div class="key-point">PKCE turns the authorization code into a one-time credential that only the originating client can redeem: send the hash up front, prove the pre-image at exchange. Use S256, keep <code>state</code> as well, and apply it to every client type.</div>`,
  },
  {
    q: 'What are the most common OAuth 2.0 implementation mistakes?',
    difficulty: 'tricky',
    a: `<div class="interview-answer"><p>OAuth is secure as a spec and fragile in implementation. The mistakes I look for: no <code>state</code> parameter (or one that is never verified), which allows CSRF on the callback and code injection; loose <code>redirect_uri</code> matching — wildcards, prefix matching, or an open redirect on an allowed host — which is the standard way authorization codes get stolen; skipping validation of the ID token's signature, <code>iss</code>, <code>aud</code>, and <code>nonce</code>; treating an <em>access</em> token as proof of identity or trusting unverified <code>email</code> claims to log a user in; and storing tokens in localStorage in a SPA. On the server side: not checking token binding to the client, accepting tokens issued for another audience, and using long-lived tokens with no rotation or revocation path.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>OAuth là một spec an toàn nhưng rất dễ triển khai sai. Những lỗi tôi luôn soi: không dùng tham số <code>state</code> (hoặc có mà không verify), dẫn tới CSRF ở bước callback và chèn được authorization code; so khớp <code>redirect_uri</code> quá lỏng — dùng wildcard, so theo tiền tố, hoặc trên host được phép lại tồn tại một open redirect — đây chính là con đường phổ biến nhất để code bị đánh cắp; bỏ qua việc kiểm tra signature cùng các claim <code>iss</code>, <code>aud</code>, <code>nonce</code> của ID token; coi <em>access</em> token như bằng chứng danh tính, hoặc tin claim <code>email</code> chưa được xác minh để cho đăng nhập; và lưu token trong localStorage ở SPA. Về phía server: không kiểm tra token có đúng gắn với client đó không, chấp nhận cả token phát cho audience khác, và dùng token sống rất lâu mà không có đường rotate hay thu hồi.</p></details>
<pre>// 1) Missing/unverified state → CSRF + code injection
// ✅ generate state (CSPRNG), store it in the session, compare on callback,
//    then delete it. For OIDC also send and verify a nonce.
if (req.query.state !== req.session.oauthState) throw new Error('CSRF');

// 2) Sloppy redirect_uri registration
registered: https://app.com/*            ❌ wildcard
registered: https://app.com/cb           ✅ exact match, https only
// Even with exact match, an open redirect at https://app.com/go?to=...
// lets the code be forwarded to the attacker. Fix open redirects.

// 3) ID token accepted without validation
jwt.decode(idToken)                      ❌ decode ≠ verify
// ✅ verify signature via JWKS (kid), then iss, aud == client_id, exp,
//    nonce, and azp; require email_verified before trusting an email.

// 4) Confusing the tokens
// access_token → for calling APIs (opaque to the client, do not parse it)
// id_token     → identity of the end user, for the CLIENT only;
//                never send it to an API as a credential
// Also: "log in with an access token from any Google app" — always check
// aud, or you accept tokens minted for a different application.

// 5) Public-client storage and lifetime
localStorage.setItem('access_token', t)  ❌ XSS drains it
// ✅ BFF + HttpOnly cookie, or in-memory + rotating refresh tokens</pre>
<p><strong>Protocol-level attacks worth naming:</strong> the <em>mix-up</em> attack (a client that talks to several IdPs must track which one a callback belongs to — check <code>iss</code>); <em>authorization code injection</em> (mitigated by PKCE); <em>token substitution</em> (validate <code>aud</code>); and consent phishing, where a legitimate OAuth screen requests excessive scopes — hence approving apps and reviewing scopes matters as much as the code.</p>
<div class="key-point">The vulnerabilities are almost always in the callback: verify <code>state</code>, match <code>redirect_uri</code> exactly, fully validate the ID token (signature, <code>iss</code>, <code>aud</code>, <code>nonce</code>), never authenticate a user from an unverified claim or a bare access token, and keep tokens out of JavaScript-readable storage.</div>`,
  },
  {
    q: 'Opaque tokens vs JWT: when do you use token introspection?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>A JWT is self-contained, so a resource server validates it locally with a public key — fast, no network call, but the decision is only as fresh as the token's lifetime. An <strong>opaque</strong> token is a random reference; the resource server must call the authorization server's <code>/introspect</code> endpoint to learn whether it is still active and what it grants — a network hop per request, but instant revocation and no data exposed to the client. The usual compromise is a hybrid: JWTs with short lifetimes for internal service traffic, and introspection (or short-cached introspection) where revocation must be immediate — payments, admin operations, or tokens handed to third parties.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>JWT là token tự chứa, nên resource server verify được ngay tại chỗ bằng public key — nhanh, không cần gọi mạng, nhưng quyết định đó chỉ "mới" trong phạm vi thời gian sống của token. Token <strong>opaque</strong> chỉ là một chuỗi tham chiếu ngẫu nhiên; resource server phải gọi endpoint <code>/introspect</code> của authorization server để biết token còn hiệu lực không và cho phép những gì — mất một lượt gọi mạng mỗi request, nhưng thu hồi có hiệu lực tức thì và không để lộ dữ liệu nào cho client. Cách dung hòa thường dùng là kết hợp: JWT sống ngắn cho traffic nội bộ giữa các service, và introspection (hoặc introspection có cache ngắn) ở những nơi cần thu hồi ngay — thanh toán, thao tác admin, hoặc token cấp cho bên thứ ba.</p></details>
<pre>// JWT — local validation
Authorization: Bearer eyJhbGciOi...
resource server: verify(signature via JWKS) + exp/iss/aud  → 0 network calls
  ✅ scales horizontally, works offline, no auth-server dependency
  ❌ cannot be revoked before exp; claims go stale (role changes);
     payload is readable by the client; bigger header on every request

// Opaque — introspection (RFC 7662)
Authorization: Bearer 8xLOxBtZp8
POST /introspect  token=8xLOxBtZp8   (client authenticates itself)
→ { "active": true, "sub": "123", "scope": "orders:read", "exp": ... }
  ✅ revocation is instant, claims always current, nothing leaks to clients
  ❌ latency + availability coupling to the auth server (cache carefully)

// Hybrid patterns used in practice
- JWT (5–15 min) + refresh token stored server-side and revocable
- Opaque token at the edge, exchanged by the API gateway for a short JWT
  used internally ("phantom token" pattern) → clients see nothing,
  services validate locally
- Introspection with a 10–30 s cache: bounded staleness, ~zero traffic</pre>
<p><strong>How to decide in an interview:</strong> ask how fast revocation must take effect and how many services must validate. Many verifiers + tolerance for minutes of staleness → JWT with JWKS. Few verifiers, strict revocation, or third-party clients → opaque plus introspection. And remember: whichever you choose, the resource server must still check <code>aud</code>/scopes — validation is not authorization.</p>
<div class="key-point">JWT trades revocation for speed; opaque tokens trade a network call for control. Pick by your revocation requirement, and consider the phantom-token pattern to get both: opaque outside, short-lived JWT inside.</div>`,
  },
  {
    q: 'What is the difference between scopes, roles and permissions?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>They answer different questions and are not interchangeable. A <strong>scope</strong> limits what the <em>client application</em> was delegated on behalf of the user — "this app may read your calendar" — so it can only ever narrow the user's own rights. <strong>Roles</strong> and <strong>permissions</strong> describe what the <em>user</em> may do inside your system, and they live in your data model, not in a delegated token. The common mistake is treating a scope as authorization: a token with <code>orders:write</code> proves the client is allowed to attempt order writes, but the API must still check that <em>this user</em> owns the order. Effective permission is always the intersection of user rights and delegated scope, checked server-side.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Ba thứ này trả lời ba câu hỏi khác nhau và không thay thế nhau được. <strong>Scope</strong> giới hạn những gì <em>ứng dụng client</em> được uỷ quyền thay mặt người dùng — kiểu "app này được đọc calendar của bạn" — nên nó chỉ có thể thu hẹp quyền vốn có của người dùng. <strong>Role</strong> và <strong>permission</strong> mô tả những gì <em>người dùng</em> được làm trong hệ thống của bạn, và chúng thuộc về mô hình dữ liệu của bạn chứ không nằm trong một token uỷ quyền. Lỗi hay gặp là coi scope như phân quyền: một token có <code>orders:write</code> chỉ chứng minh client được phép thử ghi đơn hàng, còn API vẫn phải kiểm tra xem <em>người dùng này</em> có sở hữu đơn hàng đó không. Quyền thực tế luôn là phần giao giữa quyền của người dùng và scope được uỷ quyền, và phải kiểm tra ở phía server.</p></details>
<pre>// Scope — delegation boundary, chosen at consent time, coarse by design
scope=openid profile orders:read payments:write
// "This CLIENT may attempt these operation classes as this user."

// Role — a bundle of permissions in YOUR domain model
role SUPPORT_AGENT = { tickets:read, tickets:comment, users:read_basic }

// Permission — the atomic check your code performs
can(user, 'tickets:close', ticket)   // may include ownership/state rules

// The check that must exist in the API
@PreAuthorize("hasAuthority('SCOPE_orders:write')")     // client scope
public Order update(Long id, ...) {
  Order o = repo.findByIdAndCustomer(id, currentUserId())  // user rights
              .orElseThrow(NotFound::new);
  if (o.isLocked()) throw new Conflict();                  // domain rules
}
// scope alone → "the app may write orders"
// + ownership → "this user may write THIS order"</pre>
<p><strong>Token design guidance:</strong> keep scopes few and coarse (they are user-visible on a consent screen); do not stuff hundreds of fine-grained permissions into a JWT — the token bloats and goes stale, so resolve permissions server-side from the <code>sub</code> and cache them; use audience (<code>aud</code>) to say <em>which API</em> the token is for; and remember that in a client-credentials token there is no user at all, so ownership checks must be replaced by explicit service-level authorization.</p>
<div class="key-point">Scopes constrain the application, roles and permissions constrain the user, and ownership constrains the object. A request is allowed only when all three agree — never authorize on scope alone, and never carry your whole permission model inside the token.</div>`,
  },

  // ──── SSO & enterprise identity ────
  {
    q: 'How does SSO actually work, and why is single logout hard?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>SSO works because the <strong>identity provider</strong> keeps its own session. The first app redirects you to the IdP, you authenticate once (with MFA), and the IdP sets a session cookie on <em>its</em> domain; every later app that redirects there gets an immediate response without a login prompt, and each app then creates its own local session or token. That is also why <strong>single logout</strong> is hard: logging out of one app only clears that app's session, so the IdP cookie still exists and the next redirect logs you straight back in — and clearing the IdP session does not retroactively invalidate tokens or sessions already issued to the other apps. Real SLO needs the IdP to notify every relying party (front-channel iframes or back-channel logout tokens), which is unreliable in browsers that block third-party cookies, so most systems settle for short token lifetimes plus back-channel logout where it matters.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>SSO hoạt động được là vì <strong>identity provider</strong> giữ session riêng của nó. Ứng dụng đầu tiên chuyển bạn sang IdP, bạn đăng nhập một lần (kèm MFA), và IdP đặt cookie session trên <em>tên miền của chính nó</em>; mọi ứng dụng sau đó khi chuyển hướng tới IdP sẽ được trả lời ngay mà không cần hỏi lại mật khẩu, rồi mỗi ứng dụng tự tạo session hoặc token cục bộ của mình. Cũng chính vì vậy mà <strong>single logout</strong> lại khó: logout khỏi một app chỉ xóa session của app đó, cookie ở IdP vẫn còn nên lần chuyển hướng kế tiếp là đăng nhập lại ngay — và ngay cả khi xóa session ở IdP thì những token/session đã phát cho các app khác cũng không tự mất hiệu lực. SLO thật sự đòi hỏi IdP phải thông báo cho từng ứng dụng (front-channel bằng iframe, hoặc back-channel bằng logout token), mà cách này lại không đáng tin trên các trình duyệt đã chặn cookie của bên thứ ba. Vì vậy phần lớn hệ thống chấp nhận giải pháp: token sống ngắn, cộng back-channel logout ở những chỗ thật sự cần.</p></details>
<pre>// First login (SP-initiated)
app1.com → 302 → idp.com/authorize?client_id=app1&...
  → user authenticates (password + MFA)
  → IdP sets its OWN session cookie on idp.com
  → 302 back to app1.com/callback?code=...
  → app1 exchanges the code, creates its local session/token

// Second app: no prompt at all
app2.com → 302 → idp.com/authorize?client_id=app2&...
  → IdP sees its session cookie → immediately 302 back with a code
  → "single sign-on": one authentication, many applications

// IdP-initiated: user starts from the IdP dashboard and is pushed into
// an app (common with SAML). Accept it only for clients you configured —
// unsolicited assertions are a known attack surface.</pre>
<pre>// Logout, in increasing order of correctness
1. Local logout: clear app1's cookie/session          → user still SSO'd
2. RP-initiated logout: redirect to the IdP's
   end_session_endpoint?id_token_hint=...&post_logout_redirect_uri=...
   → clears the IdP session too, so the next app must re-authenticate
3. Back-channel logout (OIDC): the IdP POSTs a signed logout token to
   every registered client's backchannel_logout_uri → each app kills its
   own session server-side. Reliable, no browser involvement.
4. Front-channel logout: hidden iframes to each client's logout URL →
   broken by third-party cookie blocking, silent failures.

// What actually keeps things safe when SLO is imperfect:
- short access-token lifetimes (5–15 min) so stale access dies fast
- refresh tokens revoked centrally on logout / password change
- a "session id" (sid) claim so apps can match IdP sessions to local ones
- forcing re-authentication (prompt=login, max_age) for sensitive actions</pre>
<div class="key-point">SSO is an IdP session plus redirects; each app still has its own session. Logout must therefore be propagated deliberately — RP-initiated logout at the IdP, back-channel logout for each client, central refresh-token revocation, and short access tokens as the safety net.</div>`,
  },
  {
    q: 'SAML vs OIDC — what is the difference and when do you still meet SAML?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>Both are federation protocols solving the same problem — let an identity provider authenticate a user for a relying application — but from different eras. <strong>SAML 2.0</strong> is XML-based, browser-POST driven, and deeply entrenched in enterprise IT: Active Directory Federation Services, universities, and most "enterprise SSO" checkboxes in B2B products. <strong>OIDC</strong> is JSON/JWT over HTTPS on top of OAuth 2.0, far friendlier to mobile apps, SPAs, and APIs, and it gives you an access token for calling services — something SAML has no concept of. New systems should use OIDC; you will still implement SAML because enterprise customers require it, and when you do, the security-critical parts are XML signature validation (signature wrapping and XXE live here), audience and <code>Recipient</code> checks, replay protection, and clock skew.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Cả hai đều là giao thức federation giải cùng một bài toán — để một identity provider xác thực người dùng thay cho ứng dụng — nhưng sinh ra ở hai thời kỳ khác nhau. <strong>SAML 2.0</strong> dựa trên XML, chạy bằng cách POST qua browser, và đã cắm rễ rất sâu trong IT doanh nghiệp: ADFS, các trường đại học, và gần như mọi ô "enterprise SSO" trong sản phẩm B2B. <strong>OIDC</strong> dùng JSON/JWT trên HTTPS, xây trên OAuth 2.0, thân thiện hơn nhiều với app mobile, SPA và API, đồng thời cho bạn luôn access token để gọi service — thứ mà SAML không có khái niệm tương ứng. Hệ thống mới thì nên dùng OIDC; nhưng bạn vẫn sẽ phải làm SAML vì khách hàng doanh nghiệp yêu cầu, và khi làm thì phần đáng lo nhất về bảo mật là: verify XML signature (chỗ này có signature wrapping và XXE), kiểm tra audience cùng <code>Recipient</code>, chống replay, và xử lý lệch giờ.</p></details>
<pre>SAML 2.0                          OIDC (on OAuth 2.0)
XML assertions, XML-DSig          JSON + JWT (JWS)
HTTP-POST / Redirect bindings      HTTP redirects + JSON endpoints
Metadata XML exchange              /.well-known/openid-configuration + JWKS
Attributes in the assertion        claims in the id_token + /userinfo
No token for API calls             access_token for APIs, refresh tokens
Heavy for mobile/SPA               designed for them
Terms: IdP, SP, assertion          Terms: OP/IdP, RP/client, id_token</pre>
<pre>&lt;!-- The SAML security checklist (where real CVEs come from) --&gt;
1. Verify the signature — on the Assertion (and/or Response), using the
   IdP certificate from configured metadata, NOT a cert embedded in the
   message itself. Reject unsigned assertions outright.
2. XML Signature Wrapping: an attacker adds a second, unsigned assertion
   that the app reads while the library validated the original one.
   → use a maintained library, validate that what you READ is what was SIGNED.
3. Disable DTD/external entities (XXE) in the parser.
4. Check Conditions: NotBefore/NotOnOrAfter, AudienceRestriction == your
   entityId, Recipient == your ACS URL, and InResponseTo for SP-initiated.
5. Replay protection: cache the assertion ID until it expires.
6. Canonicalization and transform allowlists — do not accept arbitrary ones.
// Practical advice: never hand-roll SAML. Use OpenSAML / Spring Security
// SAML2 / an IdP broker (Keycloak) that converts SAML into OIDC for you.</pre>
<div class="key-point">Build on OIDC; support SAML because enterprises demand it — and when you do, delegate it to a battle-tested library or an IdP broker. Every serious SAML vulnerability has been a signature-validation or XML-parsing mistake.</div>`,
  },
  {
    q: 'How would you use Keycloak in a Spring Boot + React system?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Keycloak is a self-hosted OIDC/SAML identity provider: you get login pages, MFA, social and LDAP federation, user management, and token issuance instead of writing them. The architecture I use is standard: a <strong>realm</strong> per environment or product holds users, roles, and clients; the React app is a <strong>public client</strong> using authorization code + PKCE; each Spring Boot service is a <strong>bearer-only resource server</strong> that validates JWTs against the realm's JWKS and never talks to Keycloak per request; and service-to-service calls use <strong>client credentials</strong> with separate confidential clients. Roles live in Keycloak (realm roles for cross-app, client roles for per-app) and arrive as claims that Spring maps to authorities. The parts people get wrong are role-claim mapping, using the deprecated Keycloak adapters instead of Spring's native OAuth2 resource server, and forgetting that Keycloak itself becomes critical infrastructure that needs HA, backups, and hardening.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Keycloak là một identity provider OIDC/SAML tự host: bạn có ngay trang login, MFA, federation với social và LDAP, quản lý user và phát token — thay vì phải tự viết. Kiến trúc tôi thường dùng khá chuẩn: mỗi môi trường hoặc mỗi sản phẩm là một <strong>realm</strong> chứa user, role và client; app React là <strong>public client</strong> dùng authorization code + PKCE; mỗi service Spring Boot là một <strong>resource server bearer-only</strong>, verify JWT bằng JWKS của realm và không cần gọi sang Keycloak ở mỗi request; còn các lời gọi giữa service với service thì dùng <strong>client credentials</strong> với client bí mật riêng. Role được quản lý trong Keycloak (realm role cho phạm vi chung, client role cho từng app) và đi vào token dưới dạng claim để Spring map thành authority. Những chỗ hay làm sai: map claim role không đúng, còn dùng Keycloak adapter đã bị deprecated thay vì OAuth2 resource server có sẵn của Spring, và quên rằng bản thân Keycloak trở thành hạ tầng trọng yếu — cần HA, backup và hardening.</p></details>
<pre># Keycloak model
realm: myapp-prod
  clients:
    web-spa        public,  code+PKCE, redirect: https://app.example.com/*
    orders-api     bearer-only (validates tokens, issues none)
    batch-worker   confidential, service account, client credentials
  roles:
    realm roles:  USER, ADMIN            (across all clients)
    client roles: orders-api: ORDER_APPROVE
  identity providers: Google, corporate SAML/LDAP federation
  authentication flows: password + OTP (conditional MFA per role)</pre>
<pre>// Spring Boot resource server — no Keycloak adapter needed
spring.security.oauth2.resourceserver.jwt.issuer-uri=\\
  https://kc.example.com/realms/myapp-prod
// → discovers JWKS, caches keys, validates signature + iss + exp

@Bean SecurityFilterChain api(HttpSecurity http) throws Exception {
  return http
    .authorizeHttpRequests(a -> a
      .requestMatchers("/actuator/health").permitAll()
      .requestMatchers("/api/admin/**").hasRole("ADMIN")
      .anyRequest().authenticated())
    .oauth2ResourceServer(o -> o.jwt(j -> j
       .jwtAuthenticationConverter(keycloakRolesConverter())))  // ← the gotcha
    .csrf(c -> c.disable())          // stateless bearer API
    .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
    .build();
}
// Keycloak puts roles in realm_access.roles / resource_access.{client}.roles,
// not in "scope" — so you must convert them to ROLE_* authorities yourself.</pre>
<pre>// React: never implement the flow by hand
// use keycloak-js / oidc-client-ts / react-oidc-context with PKCE
// - tokens in memory, silent renew via refresh token rotation
// - better still: a BFF (Next.js route handlers / Spring Cloud Gateway)
//   that keeps tokens server-side in an HttpOnly cookie
// - the SPA must NOT decide authorization: hide UI for UX, enforce in the API</pre>
<p><strong>Operational reality:</strong> run Keycloak behind TLS with a real database, at least two replicas, and regular realm exports; change the default admin credentials and restrict the admin console by network; keep token lifetimes short (access 5–15 min, SSO idle sensible); use <em>groups</em> plus role mappers rather than assigning roles user by user; and script realm configuration (Terraform provider or realm JSON import) so environments are reproducible — clicking through the admin UI is not configuration management.</p>
<div class="key-point">Keycloak = realm + clients + roles: SPA as public client with PKCE, Spring services as bearer-only resource servers validating via JWKS, machine clients on client credentials. Map Keycloak's <code>realm_access.roles</code> to Spring authorities yourself, and treat the IdP as production-critical infrastructure.</div>`,
  },

  // ──── Service-to-service auth ────
  {
    q: 'How do services authenticate to each other, and what is token exchange?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Service-to-service calls need their own identity, not the user's. The options in increasing strength: a shared API key (simple, hard to rotate, easy to leak), <strong>client credentials</strong> with a client secret, client credentials authenticated by <strong>private_key_jwt</strong> or <strong>mTLS</strong> (no shared secret to steal), and workload identity issued by the platform — SPIFFE/SVID, Kubernetes projected service-account tokens, cloud IAM roles — where certificates or tokens are short-lived and rotated automatically. When a request is made <em>on behalf of a user</em> across services, do not just forward the original token: use <strong>token exchange</strong> (RFC 8693) so each hop gets a token whose <code>aud</code> is the next service and whose scopes are narrowed, preserving the user identity in <code>sub</code>/<code>act</code> while limiting how far a leaked token can travel.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Các lời gọi giữa service với service cần danh tính riêng của service, không phải danh tính người dùng. Các lựa chọn theo mức độ mạnh dần: API key dùng chung (đơn giản nhưng khó xoay và dễ lộ), <strong>client credentials</strong> với client secret, client credentials xác thực bằng <strong>private_key_jwt</strong> hoặc <strong>mTLS</strong> (không còn secret dùng chung để bị đánh cắp), và workload identity do nền tảng phát — SPIFFE/SVID, projected service-account token của Kubernetes, IAM role của cloud — nơi certificate và token đều sống ngắn và được xoay tự động. Khi một request được thực hiện <em>thay mặt người dùng</em> đi qua nhiều service, đừng chỉ chuyển tiếp nguyên token ban đầu: hãy dùng <strong>token exchange</strong> (RFC 8693) để mỗi chặng nhận một token có <code>aud</code> đúng service kế tiếp và scope đã bị thu hẹp, vẫn giữ được danh tính người dùng trong <code>sub</code>/<code>act</code> nhưng giới hạn được phạm vi mà một token bị lộ có thể đi tới.</p></details>
<pre>// Least → most robust
1. Static API key in a header      → rotate manually, leaks live forever
2. client_credentials + secret     → OAuth-standard, secret still shared
3. client_credentials + private_key_jwt / mTLS client auth
   → the service proves possession of a key it never transmits
4. Platform workload identity (SPIFFE, K8s SA token, IAM role) + mTLS
   in a service mesh → identities issued and rotated automatically,
   no long-lived credentials anywhere</pre>
<pre>// ❌ Naive token forwarding
gateway → orders-api (user JWT) → payments-api (SAME user JWT)
// Every downstream service now holds a token valid for EVERYTHING the
// user can do, with the wrong audience. One compromised service = full
// impersonation, and aud validation becomes impossible.

// ✅ Token exchange (RFC 8693) — narrow at each hop
POST /token
  grant_type=urn:ietf:params:oauth:grant-type:token-exchange
  subject_token=&lt;incoming user token&gt;&subject_token_type=...access_token
  audience=payments-api&scope=payments:create
→ new token: { sub: user123,              // user identity preserved
               aud: "payments-api",       // usable ONLY there
               scope: "payments:create",  // narrowed
               act: { sub: "orders-api" } } // delegation chain recorded

// Where each control belongs
mesh/mTLS  → WHICH SERVICE is calling (transport identity)
JWT/scopes → WHICH USER, and WHAT the call may do (application identity)
// Use both: mTLS answers "is this really orders-api?", the token answers
// "acting for whom, and with what permission?"</pre>
<p><strong>Also worth saying:</strong> internal endpoints must not be "trusted because they are internal" — that assumption dies the moment one pod is compromised (zero trust); async messages need the same treatment, so put a signed token or a verified caller identity in the message envelope rather than trusting the queue; and audit logs should record both the service and the user for every privileged action.</p>
<div class="key-point">Give every workload its own short-lived, automatically rotated identity (mTLS/SPIFFE or client credentials with key-based auth), and never forward a user token unchanged — exchange it for an audience-restricted, scope-narrowed token at each hop.</div>`,
  },

  // ──── Login hardening: MFA, reset, brute force ────
  {
    q: 'How do you implement MFA properly, and why are passkeys better than TOTP?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>MFA means combining factors of different kinds — something you know, something you have, something you are — and the choice of second factor decides what attacks it stops. SMS is the weakest (SIM swap, SS7 interception, and it is phishable); <strong>TOTP</strong> apps are a solid baseline but still phishable, because a proxy phishing site simply asks for the six digits and replays them within the window; push approval adds "MFA fatigue" attacks. <strong>WebAuthn/passkeys</strong> are qualitatively different: the credential is a key pair bound to the origin, the signature covers a server challenge, and the private key never leaves the device — so a phishing site on a look-alike domain cannot obtain anything usable. Beyond the factor itself, the implementation details matter: enforce MFA at the IdP, protect enrollment and recovery paths, rate-limit and single-use the codes, and re-prompt for sensitive actions.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>MFA là kết hợp các yếu tố thuộc <em>loại</em> khác nhau — cái bạn biết, cái bạn có, cái bạn là — và việc chọn yếu tố thứ hai quyết định bạn chặn được kiểu tấn công nào. SMS yếu nhất (SIM swap, chặn bắt qua SS7, và vẫn bị phishing); ứng dụng <strong>TOTP</strong> là mức nền tốt nhưng vẫn phishing được, vì một trang phishing dạng proxy chỉ cần hỏi luôn 6 chữ số rồi dùng lại ngay trong khoảng thời gian hiệu lực; còn kiểu bấm "approve" qua push thì sinh ra tấn công làm người dùng bấm cho xong (MFA fatigue). <strong>WebAuthn/passkey</strong> khác về bản chất: credential là một cặp khóa gắn với origin, phần chữ ký bao gồm challenge do server sinh ra, và private key không bao giờ ra khỏi thiết bị — nên một trang phishing ở tên miền na ná sẽ không lấy được thứ gì dùng được. Ngoài chuyện chọn yếu tố, các chi tiết triển khai cũng quan trọng: bắt buộc MFA ngay tại IdP, bảo vệ luồng đăng ký và luồng khôi phục, giới hạn số lần thử và cho mỗi mã dùng một lần, và hỏi lại khi thực hiện thao tác quan trọng.</p></details>
<pre>Factor strength (what each actually stops)
SMS OTP     ✗ SIM swap, SS7, phishable, delivery failures  → last resort
Email OTP   ✗ as strong as the email account (often the same password)
TOTP        ✓ offline, cheap, no telco;  ✗ phishable, shared seed at setup
Push approve✓ good UX;  ✗ fatigue attacks → require number matching
WebAuthn /  ✓✓ origin-bound public-key credential: phishing-resistant,
passkeys       no shared secret to steal from your database, hardware-backed

// Why WebAuthn resists phishing — the origin is signed over
navigator.credentials.get({ publicKey: {
  challenge: serverRandom,          // replay protection
  rpId: 'example.com',              // browser refuses other origins
  userVerification: 'required',     // biometric/PIN = true second factor
}});
// The assertion signature covers challenge + origin + rpIdHash, so a
// credential minted for example.com is worthless on examp1e.com.</pre>
<pre>// TOTP implementation details that get missed
- seed: 160-bit random, shown once, stored ENCRYPTED (KMS), never logged
- verify with a ±1 step (30 s) window, and remember the last used step so
  a code cannot be replayed even inside its window
- rate-limit verification (5 tries) — 6 digits is only 1e6 combinations
- protect ENROLLMENT: require the current password/session, and notify
  the user by email when a factor is added or removed
- recovery codes: 10 single-use codes, hashed at rest, invalidate on use
- do not let "reset password" bypass MFA — that is the usual back door
- step-up auth: re-prompt for MFA on payment, email change, API key
  creation (OIDC: prompt=login / max_age, or acr claims)</pre>
<div class="key-point">Prefer WebAuthn/passkeys — they are the only widely deployed phishing-resistant factor; keep TOTP as fallback, avoid SMS where possible. Then secure the paths around MFA: enrollment, recovery codes, password reset, and step-up for sensitive operations.</div>`,
  },
  {
    q: 'How do you design a secure password reset flow?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>Password reset is the favourite way into an account, because it is authentication with the password removed. The safe design: accept the email, always answer with the same neutral message, and only send a mail if the account exists; the link carries a high-entropy random token that is stored <strong>hashed</strong>, single-use, tied to that user, and valid for 15–60 minutes. On use, verify and immediately invalidate the token, require the new password to meet policy, then <strong>invalidate every existing session and refresh token</strong> and notify the user by email. Rate-limit both the request and the confirmation endpoints, never put the token in a query string that leaks through <code>Referer</code> or logs, and do not let the reset flow bypass MFA — otherwise MFA is decorative.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Luồng reset mật khẩu là con đường ưa thích để chiếm tài khoản, vì bản chất nó là xác thực nhưng đã bỏ đi mật khẩu. Thiết kế an toàn: nhận email, luôn trả về đúng một thông báo trung tính, và chỉ thật sự gửi mail nếu tài khoản tồn tại; link chứa một token ngẫu nhiên entropy cao, trong DB chỉ lưu <strong>bản hash</strong>, dùng một lần, gắn với đúng user đó và có hiệu lực 15–60 phút. Khi token được dùng: verify rồi vô hiệu ngay, kiểm tra mật khẩu mới có đạt policy, sau đó <strong>hủy toàn bộ session và refresh token đang tồn tại</strong> và gửi email thông báo cho người dùng. Nhớ rate limit cả endpoint yêu cầu lẫn endpoint xác nhận, đừng để token nằm trong query string vì nó lọt ra qua header <code>Referer</code> và log, và đừng cho luồng reset vượt qua MFA — nếu không thì MFA chỉ là trang trí.</p></details>
<pre>// Request step
POST /password/reset  { email }
→ ALWAYS: 200 "If an account exists for that address, we sent a link."
   (no enumeration, and rate-limited per email + per IP)
if (user) {
  const raw = crypto.randomBytes(32).toString('base64url');   // 256 bits
  await db.insertResetToken({ userId: user.id,
    tokenHash: sha256(raw),          // ← DB leak does not grant resets
    expiresAt: now + 30 * 60_000, usedAt: null });
  await mail.send(user.email, \`\${BASE_URL}/password/new#t=\${raw}\`);
  // fragment (#) or POST body keeps the token out of Referer and logs
}

// Confirm step
POST /password/new { token, newPassword }
const row = await db.findByHash(sha256(token));
if (!row || row.usedAt || row.expiresAt < now) return generic400();
await db.markUsed(row.id);                    // single use, atomically
await users.setPassword(row.userId, await argon2.hash(newPassword));
await sessions.revokeAllFor(row.userId);      // kill attacker sessions too
await refreshTokens.revokeFamilies(row.userId);
await mail.send(user.email, 'Your password was changed');   // detection</pre>
<p><strong>The subtle failures:</strong> tokens derived from the user id or a timestamp (guessable); a reset link that stays valid after use or after a second link is issued; the token accepted for a <em>different</em> user id passed in the body; leaving sessions alive so the attacker keeps access after the victim "recovers" the account; the <code>Host</code>-header trick that rewrites the link domain; and "security questions" as recovery, which are just weak passwords with public answers. If MFA is enabled, require the second factor (or a recovery code) during reset.</p>
<div class="key-point">A reset token is a bearer credential: CSPRNG, hashed at rest, single-use, short-lived, and never in a URL query string. Answer neutrally to avoid enumeration, revoke all sessions on success, notify the user, and never let the flow skip MFA.</div>`,
  },
  {
    q: 'How do you protect login endpoints from brute-force attacks?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>Login endpoints need several layers of protection at once. Rate limiting and slower responses (or short lockouts) slow down password guessing, and the limits should be keyed by both account and IP to catch credential stuffing. A CAPTCHA after a few failures blocks bots, and <strong>MFA</strong> protects the account even if the password is known. Passwords should be stored with a slow hash like <code>bcrypt</code> or <code>argon2</code>, and errors should be generic so account existence is not revealed. Avoid permanent lockouts, because they can be used to block real users.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Endpoint đăng nhập cần nhiều lớp bảo vệ cùng lúc. Rate limit và tăng dần thời gian chờ (hoặc khóa tạm 15 phút) làm việc dò mật khẩu trở nên vô vọng; nên đếm giới hạn theo cả tài khoản lẫn IP để bắt được credential stuffing — mỗi tài khoản chỉ thử vài lần nhưng thử trên hàng nghìn tài khoản. CAPTCHA sau vài lần sai sẽ chặn bot, còn MFA giữ được tài khoản kể cả khi mật khẩu đã lộ. Mật khẩu phải lưu bằng hàm băm chậm như <code>bcrypt</code> hoặc <code>argon2</code>, và thông báo lỗi nên chung chung để không tiết lộ tài khoản có tồn tại hay không. Tránh khóa vĩnh viễn: kẻ tấn công sẽ lợi dụng chính cơ chế đó để khóa người dùng thật, biến nó thành một lỗ hổng DoS.</p></details>
<p>Login endpoints are prime targets for brute-force and credential stuffing attacks.</p>
<p><strong>Defense layers:</strong></p>
<ul>
<li><strong>Rate limiting</strong>: Max 5 attempts per account per 15 minutes</li>
<li><strong>Progressive delays</strong>: Increase response time after each failure (1s, 2s, 4s...)</li>
<li><strong>Account lockout with auto-unlock</strong>: Lock for 15 min after 10 failures (not permanent — that's a DoS vector)</li>
<li><strong>CAPTCHA</strong>: After 3 failures, require CAPTCHA</li>
<li><strong>MFA</strong>: Even if password is compromised, attacker needs second factor</li>
<li><strong>Password hashing</strong>: bcrypt/argon2 with high cost factor (makes each attempt slow)</li>
<li><strong>Monitor & alert</strong>: Detect credential stuffing patterns (many accounts, few attempts each)</li>
</ul>
<pre>// Rate limiting with Redis:
String key = "login:" + username + ":" + ip;
int attempts = redis.incr(key);
redis.expire(key, 900); // 15 min window

if (attempts > 5) {
    return Response.status(429)
        .header("Retry-After", "900")
        .body("Too many attempts. Try again in 15 minutes.");
}

// Password hashing (bcrypt):
String hash = BCrypt.hashpw(password, BCrypt.gensalt(12));
// 12 rounds → ~250ms per hash → brute force is impractical</pre>
<div class="key-point">Do not rely on account lockout alone — attackers can lock out legitimate users (denial of service). Combine rate limiting + progressive delays + MFA for robust protection.</div>`,
  },
];
