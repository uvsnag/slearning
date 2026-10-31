// Interview data: SECURITY & JWT
// Questions are grouped by theme, one file per group — add new ones to the
// matching file (or add a file here and spread it into `questions` below).
import type { PvTopic } from '../../../types';
import { questions as accessControl } from './access-control';
import { questions as authProtocols } from './auth-protocols';
import { questions as cryptography } from './cryptography';
import { questions as injectionAttacks } from './injection-attacks';
import { questions as practicesProcess } from './practices-process';
import { questions as tokensSessions } from './tokens-sessions';
import { questions as toolingJavaJs } from './tooling-java-js';
import { questions as webAttacks } from './web-attacks';

export const topics: PvTopic[] = [
  {
    id: 'security-jwt',
    name: 'Security & JWT',
    icon: '🔒',
    questions: [
      // ──── 0. SECURITY & JWT SUMMARY — knowledge map ────
      {
        q: 'Security & JWT Summary — Knowledge Map',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A complete revision checklist for application security — authentication, tokens, cryptography, access control, the classic web attacks, and the tooling around them. Concept names only; use it to spot gaps, not as a tutorial.</p></div>
<h3>1. Fundamentals</h3>
<ul>
<li>Authentication vs authorization</li>
<li>CIA triad (confidentiality, integrity, availability)</li>
<li>Defense in depth, least privilege, zero trust</li>
<li>Threat modeling (STRIDE), attack surface</li>
<li>Security by design vs security as afterthought</li>
</ul>
<h3>2. Sessions &amp; Tokens</h3>
<ul>
<li><strong>Session-based auth</strong>
  <ul>
  <li>Server-side sessions, session ID cookies</li>
  <li>Session fixation, session hijacking, secure session lifecycle</li>
  <li>Sticky sessions vs shared session store (Redis)</li>
  </ul>
</li>
<li><strong>Cookies</strong>
  <ul>
  <li>HttpOnly, Secure, SameSite (Lax/Strict/None), Domain/Path scoping</li>
  <li>Cookie vs localStorage vs sessionStorage for tokens</li>
  </ul>
</li>
<li><strong>JWT</strong>
  <ul>
  <li>Structure: header, payload, signature</li>
  <li>Registered claims (iss, sub, aud, exp, nbf, iat, jti)</li>
  <li>Signing: HS256 vs RS256 vs ES256, JWKS, key rotation</li>
  <li>Validation rules (signature, expiry, audience, issuer)</li>
  <li>Pitfalls: alg=none, algorithm confusion, sensitive data in payload, no revocation</li>
  <li>Access token vs refresh token, refresh token rotation, reuse detection</li>
  <li>Revocation strategies: blacklist, short TTL, token versioning</li>
  <li>Opaque tokens vs JWT, token introspection</li>
  </ul>
</li>
<li>Stateless vs stateful auth trade-offs</li>
<li>API keys, HMAC request signing, mTLS client certificates</li>
</ul>
<h3>3. Auth Protocols</h3>
<ul>
<li><strong>OAuth2</strong>
  <ul>
  <li>Roles: resource owner, client, authorization server, resource server</li>
  <li>Flows: authorization code, authorization code + PKCE, client credentials, device code</li>
  <li>Deprecated: implicit, resource owner password</li>
  <li>Scopes, consent, state parameter, redirect URI validation</li>
  </ul>
</li>
<li><strong>OIDC</strong>
  <ul>
  <li>ID token vs access token, UserInfo endpoint, discovery document</li>
  <li>Nonce, claims</li>
  </ul>
</li>
<li>SSO, SAML vs OIDC, identity providers (Keycloak, Okta, Auth0, Cognito)</li>
<li>MFA / TOTP / WebAuthn / passkeys</li>
<li>Password auth: bcrypt/scrypt/Argon2, salting, peppering, credential stuffing defenses</li>
</ul>
<h3>4. Cryptography</h3>
<ul>
<li>Hashing vs encryption vs encoding (Base64 is not encryption)</li>
<li>Hash functions: SHA-256, MD5/SHA-1 weaknesses, HMAC</li>
<li>Symmetric crypto: AES-GCM vs CBC, IV/nonce rules, key management</li>
<li>Asymmetric crypto: RSA, elliptic curves, key exchange, digital signatures</li>
<li>TLS handshake, certificates, chain of trust, certificate pinning, Let's Encrypt</li>
<li>Secure randomness (SecureRandom vs Math.random)</li>
<li>Encryption at rest vs in transit, envelope encryption, KMS/HSM</li>
</ul>
<h3>5. Access Control</h3>
<ul>
<li>RBAC vs ABAC vs ACL vs ReBAC</li>
<li>Roles vs permissions vs scopes</li>
<li>Horizontal vs vertical privilege escalation</li>
<li>IDOR / Broken Object Level Authorization (BOLA)</li>
<li>Enforcement point placement (controller vs service layer), deny by default</li>
<li>Multi-tenancy isolation</li>
</ul>
<h3>6. Web Attacks &amp; Defenses</h3>
<ul>
<li><strong>Injection</strong>
  <ul>
  <li>SQL injection → parameterized queries</li>
  <li>NoSQL injection, command injection, LDAP injection</li>
  <li>XXE, insecure deserialization, SSTI</li>
  </ul>
</li>
<li><strong>XSS</strong>
  <ul>
  <li>Reflected, stored, DOM-based</li>
  <li>Output encoding, sanitization, CSP</li>
  </ul>
</li>
<li><strong>CSRF</strong>
  <ul>
  <li>CSRF tokens (synchronizer pattern), SameSite cookies, double-submit cookie</li>
  </ul>
</li>
<li>SSRF, open redirect, clickjacking (X-Frame-Options, frame-ancestors)</li>
<li>Path traversal, file upload vulnerabilities</li>
<li>Brute force &amp; rate limiting, account enumeration, timing attacks</li>
<li>DDoS basics, bot protection, CAPTCHA</li>
<li>OWASP Top 10, OWASP API Security Top 10</li>
</ul>
<h3>7. Secure Headers &amp; Browser Security</h3>
<ul>
<li>CORS (origins, preflight, credentials — and why it is not an auth mechanism)</li>
<li>Content-Security-Policy, HSTS, X-Content-Type-Options, Referrer-Policy</li>
<li>Same-origin policy, subresource integrity</li>
</ul>
<h3>8. Tooling (Java &amp; JavaScript)</h3>
<ul>
<li><strong>Spring Security</strong>
  <ul>
  <li>Filter chain, SecurityFilterChain configuration</li>
  <li>UserDetailsService, PasswordEncoder, AuthenticationManager</li>
  <li>Method security (@PreAuthorize), CSRF config, OAuth2 resource server (JWT)</li>
  </ul>
</li>
<li>Java: JCA/JCE, keystores/truststores, jjwt/nimbus-jose-jwt</li>
<li>Node/JS: jsonwebtoken, helmet, bcrypt, express-rate-limit</li>
<li>Frontend token handling: in-memory tokens, BFF pattern, silent refresh</li>
</ul>
<h3>9. Process &amp; Operations</h3>
<ul>
<li>Secrets management (Vault, env vars, rotation; never in git)</li>
<li>Dependency scanning (OWASP Dependency-Check, Snyk, npm audit), supply-chain attacks</li>
<li>SAST / DAST, penetration testing, bug bounty</li>
<li>Security code review, secure SDLC</li>
<li>Logging &amp; auditing (what to log, what never to log)</li>
<li>Incident response, breach disclosure</li>
<li>Compliance basics: GDPR, PCI-DSS, SOC 2</li>
</ul>
<h3>10. Senior / Interview Hot Topics</h3>
<ul>
<li>JWT vs sessions: when each wins</li>
<li>Where to store tokens in the browser (and why localStorage is risky)</li>
<li>Refresh token rotation &amp; logout with stateless tokens</li>
<li>Why authorization code + PKCE replaced implicit flow</li>
<li>HS256 vs RS256 key-distribution trade-off</li>
<li>Designing auth for microservices (gateway auth, token propagation, mTLS)</li>
<li>Password storage evolution (plaintext → MD5 → bcrypt/Argon2)</li>
<li>CSRF vs XSS confusion, defense pairing</li>
<li>Common JWT implementation bugs (no audience check, trusting alg header)</li>
<li>Rate limiting &amp; account lockout design</li>
</ul>
<div class="key-point">Interview staples: explain JWT structure and validation, pick a token storage strategy and defend it (HttpOnly SameSite cookie + CSRF token vs in-memory token), walk through the OAuth2 authorization code + PKCE flow, and name the fix for each OWASP Top 10 item. Always pair each attack with its specific defense.</div>`,
      },
      ...tokensSessions,
      ...authProtocols,
      ...accessControl,
      ...cryptography,
      ...injectionAttacks,
      ...webAttacks,
      ...toolingJavaJs,
      ...practicesProcess,
    ],
  },
];
