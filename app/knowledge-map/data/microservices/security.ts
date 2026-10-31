import type { KmNode } from '../../types';

export const security: KmNode = {
  title: 'Security',
  level: 'intermediate',
  summary:
    'Proving who users and services are, deciding what they may do, and encrypting traffic between them.',
  simple:
    'In a monolith you lock one front door. With microservices every room has a door, and every door needs a lock.',
  children: [
    {
      title: 'Edge Authentication',
      level: 'beginner',
      summary: 'Users log in once; the gateway checks their token before anything goes further.',
      simple:
        'Like a festival wristband: you show your ID once at the entrance, then every stage just checks your wristband.',
      points: [
        'Login happens at an identity provider (Keycloak, Auth0, Entra ID, Okta).',
        'The client gets a token and sends it with each request.',
        'The gateway rejects missing or invalid tokens early.',
        'Services still check the token themselves. Never trust the network alone.',
      ],
    },
    {
      title: 'OAuth2 & OIDC',
      level: 'intermediate',
      summary:
        'OAuth2 is for delegated access (what you may do); OpenID Connect adds login (who you are).',
      simple:
        'OAuth2 is a valet key: it lets someone drive your car but not open the trunk. OIDC adds a name badge saying who you are.',
      points: [
        'Authorization Code + PKCE: the standard flow for web and mobile apps.',
        'Client Credentials: for a service calling another service with no user.',
        'Implicit and Password flows are deprecated (OAuth 2.1 drops them).',
        'OIDC adds an ID token and a <code>/userinfo</code> endpoint on top of OAuth2.',
        'Scopes (<code>orders:read</code>) limit what a token is allowed to do.',
      ],
    },
    {
      title: 'JWT',
      level: 'intermediate',
      summary: 'A signed, self-contained token carrying claims like user id, roles and expiry.',
      simple:
        'A concert ticket with a hologram: the door staff can check it’s real by looking at it, without calling the box office.',
      points: [
        'Three parts: header.payload.signature, Base64URL-encoded. The payload is readable, NOT secret.',
        'Services verify the signature with the issuer’s public keys (JWKS), no call per request.',
        'Always check <code>exp</code>, <code>iss</code> and <code>aud</code>, and reject <code>alg: none</code>.',
        'Keep access tokens short-lived (minutes). Revoking a JWT early is hard.',
        'Don’t put personal or secret data in it.',
      ],
      detail: `<pre><code>@Bean
SecurityFilterChain api(HttpSecurity http) throws Exception {
  return http
      .authorizeHttpRequests(a -&gt; a
          .requestMatchers(HttpMethod.GET, "/orders/**").hasAuthority("SCOPE_orders:read")
          .anyRequest().authenticated())
      .oauth2ResourceServer(o -&gt; o.jwt(Customizer.withDefaults()))
      .build();
}
// application config: spring.security.oauth2.resourceserver.jwt.issuer-uri</code></pre>`,
    },
    {
      title: 'Service-to-Service Auth',
      level: 'advanced',
      summary: 'How one service proves its identity and its caller’s identity to another.',
      points: [
        'No user involved → the service gets its own token with Client Credentials.',
        'Acting for a user → forward the user’s token, or swap it for a narrower one (Token Exchange, RFC 8693).',
        'Check the audience: a token meant for Orders must not work at Payments.',
        'Workload identity (e.g. SPIFFE IDs, cloud IAM roles) avoids static passwords between services.',
      ],
    },
    {
      title: 'mTLS',
      level: 'advanced',
      summary:
        'Mutual TLS: both sides of a connection show certificates, so each knows who the other is.',
      simple:
        'Normal HTTPS is you checking the bank’s ID. mTLS is the bank also checking yours before it talks.',
      points: [
        'Encrypts traffic inside the cluster and proves each service’s identity.',
        'Needs a certificate authority and short-lived, auto-rotated certificates.',
        'Doing it by hand is painful. A service mesh can do it automatically.',
        'mTLS says which service is calling; you still need rules about what it may do.',
      ],
    },
    {
      title: 'Zero Trust',
      level: 'advanced',
      summary: 'Trust nothing just because it is inside the network; verify every call.',
      simple:
        'Old style: a castle with a moat, everyone inside is trusted. Zero trust: every room checks your badge, even inside the castle.',
      points: [
        'An attacker inside the network should not get free access to everything.',
        'Every request is authenticated, authorised and encrypted.',
        'Least privilege: each service may call only what it needs.',
        'Network policies block traffic that isn’t explicitly allowed.',
      ],
    },
    {
      title: 'Authorization',
      level: 'advanced',
      summary:
        'Deciding what a caller may do: coarse checks at the edge, fine checks in each service.',
      points: [
        'Gateway: "is this a valid token with the right scope?"',
        'Service: "may this user cancel THIS order?" Only the owner has that data.',
        'Roles (RBAC) are simple; attribute rules (ABAC) handle "own records only" cases.',
        'Policy engines like OPA or OpenFGA keep rules consistent across services.',
        'Log security decisions for audits.',
      ],
      tip: 'A classic bug: the gateway checks the login, but the service never checks that the order belongs to that user.',
    },
  ],
};
