import type { KmNode } from '../../types';

export const security: KmNode = {
  title: 'Spring Security',
  level: 'intermediate',
  summary: 'Who are you (authentication) and what may you do (authorization), handled by filters.',
  simple:
    'A building with a reception desk that checks your ID, and badge readers on each door that decide which rooms you may enter.',
  children: [
    {
      title: 'Secure by default',
      level: 'beginner',
      summary: 'Add the starter and every endpoint is locked behind a login right away.',
      simple: 'You move in and all the doors are already locked. You decide which ones to open.',
      points: [
        'Adding <code>spring-boot-starter-security</code> protects all URLs.',
        'Boot creates a user named <code>user</code> with a random password printed in the log.',
        'You get a login form, HTTP Basic, CSRF protection and security headers.',
        'Replace the defaults by defining your own <code>SecurityFilterChain</code> bean.',
      ],
    },
    {
      title: 'Filter chain',
      level: 'intermediate',
      summary:
        'A chain of servlet filters that every request passes through before your controller.',
      simple:
        'A row of checkpoints at an airport: passport, bag scan, boarding pass. Fail one, and you do not reach the gate.',
      points: [
        '<code>DelegatingFilterProxy</code> → <code>FilterChainProxy</code> → one matching <code>SecurityFilterChain</code>.',
        'Filters in order: CORS, CSRF, authentication (Basic, bearer token, form…), then authorization.',
        'The logged-in user is stored in <code>SecurityContextHolder</code> (thread-local).',
        'Several chains can exist, each for a URL pattern (e.g. <code>/api/**</code> vs web pages).',
      ],
    },
    {
      title: 'SecurityFilterChain config',
      level: 'intermediate',
      summary: 'Define URL rules and login methods with a lambda-style bean.',
      simple: 'You write the rule book for the badge readers: which door, which badge.',
      points: [
        '<code>WebSecurityConfigurerAdapter</code> is gone (Spring Security 6). Use a bean.',
        'Rules match top to bottom. Put specific paths first, <code>anyRequest()</code> last.',
        'Use <code>hasRole("ADMIN")</code> for roles, <code>hasAuthority("SCOPE_read")</code> for scopes.',
      ],
      detail: `<pre><code>@Bean
SecurityFilterChain api(HttpSecurity http) throws Exception {
  return http
      .authorizeHttpRequests(auth -&gt; auth
          .requestMatchers("/actuator/health", "/public/**").permitAll()
          .requestMatchers("/admin/**").hasRole("ADMIN")
          .anyRequest().authenticated())
      .oauth2ResourceServer(o -&gt; o.jwt(Customizer.withDefaults()))
      .build();
}</code></pre>`,
    },
    {
      title: 'Authentication',
      level: 'intermediate',
      summary: 'Checking who the user is, with UserDetailsService and a PasswordEncoder.',
      simple: 'The reception desk compares your face with the photo on file.',
      points: [
        '<code>UserDetailsService</code> loads a user by username from your DB.',
        'Store passwords hashed: <code>BCryptPasswordEncoder</code> or the delegating encoder.',
        '<code>AuthenticationManager</code> runs one or more <code>AuthenticationProvider</code>s.',
        'Never store or log plain passwords.',
      ],
    },
    {
      title: 'JWT & OAuth2 resource server',
      level: 'advanced',
      summary: 'Accept bearer tokens issued by an auth server (Keycloak, Auth0, Entra ID…).',
      simple:
        'A concert wristband: the ticket office (auth server) gives it, the guards just check it is real and not expired.',
      points: [
        'Set <code>spring.security.oauth2.resourceserver.jwt.issuer-uri</code>. Boot fetches the signing keys.',
        'Spring checks signature, expiry and issuer for every request. No session needed.',
        'Scopes become authorities like <code>SCOPE_orders.read</code>.',
        'Map custom claims (roles) with a <code>JwtAuthenticationConverter</code>.',
        'For logging users in via Google etc., use <code>oauth2Login()</code> (the client side).',
      ],
      tip: 'Do not build your own token server. Use a proven identity provider and let Spring validate.',
    },
    {
      title: 'Method security',
      level: 'advanced',
      summary: 'Protect service methods with @PreAuthorize rules, not only URLs.',
      simple: 'Besides the door badge, some drawers inside the room have their own lock.',
      points: [
        'Turn on with <code>@EnableMethodSecurity</code>.',
        '<code>@PreAuthorize("hasRole(\'ADMIN\')")</code> or SpEL like <code>#id == authentication.name</code>.',
        'Proxy-based, so the self-invocation rule applies here too.',
        'Good for rules that depend on the data, like "only the owner may edit".',
      ],
    },
    {
      title: 'CORS',
      level: 'intermediate',
      summary: 'Lets a browser app on another domain call your API.',
      simple:
        'The browser asks your API: "May a page from shop.com talk to you?" CORS is your answer.',
      points: [
        'It is a browser rule. Postman and server-to-server calls ignore it.',
        'Configure with <code>http.cors(...)</code> plus a <code>CorsConfigurationSource</code> bean.',
        'List exact origins. Wildcard <code>*</code> is not allowed with credentials.',
        '<code>http.cors()</code> lets preflight <code>OPTIONS</code> requests through before the login check.',
      ],
    },
    {
      title: 'CSRF',
      level: 'intermediate',
      summary: 'Protection against other sites tricking a logged-in browser into sending requests.',
      simple:
        'A bad site makes your browser submit a form to your bank, using your cookie. A CSRF token proves the form really came from the bank’s own page.',
      points: [
        'On by default for state-changing requests (POST, PUT, DELETE).',
        'Needed when you log in with cookies (sessions).',
        'Stateless APIs with bearer tokens in a header can usually disable it.',
        'Single-page apps with cookies: use <code>CookieCsrfTokenRepository</code>.',
      ],
      tip: 'Do not disable CSRF just because a POST returns 403. First check if you use cookie login.',
    },
  ],
};
