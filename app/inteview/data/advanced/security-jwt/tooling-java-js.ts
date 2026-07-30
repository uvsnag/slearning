// Security & JWT — Spring Security & Node/Next.js hardening
import type { PvQuestion } from '../../../types';

export const questions: PvQuestion[] = [
  {
    q: 'How does the Spring Security filter chain work?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Spring Security is a chain of servlet filters inserted in front of your controllers, and understanding the order is what lets you debug it. A request passes through <code>SecurityFilterChain</code>: filters that <em>establish</em> identity run first — <code>SecurityContextPersistenceFilter</code> restores the context, then an authentication filter (<code>UsernamePasswordAuthenticationFilter</code>, <code>BearerTokenAuthenticationFilter</code>, or your own) delegates to an <code>AuthenticationManager</code>/provider and puts an <code>Authentication</code> into the <code>SecurityContextHolder</code>; then <code>AuthorizationFilter</code> checks the request against your rules and throws <code>AccessDeniedException</code>; finally <code>ExceptionTranslationFilter</code> converts that into a 401 or 403. Two consequences matter in interviews: authorization happens <em>before</em> your controller, so a filter or interceptor placed earlier sees no authenticated user; and there can be multiple chains — the first one whose matcher hits is the only one that runs.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Spring Security thực chất là một chuỗi servlet filter đặt trước controller của bạn, và hiểu đúng thứ tự chính là chìa khóa để debug nó. Một request đi qua <code>SecurityFilterChain</code>: các filter <em>thiết lập</em> danh tính chạy trước — <code>SecurityContextPersistenceFilter</code> phục hồi context, rồi filter xác thực (<code>UsernamePasswordAuthenticationFilter</code>, <code>BearerTokenAuthenticationFilter</code>, hoặc filter bạn tự viết) gọi xuống <code>AuthenticationManager</code>/provider và đặt một <code>Authentication</code> vào <code>SecurityContextHolder</code>; sau đó <code>AuthorizationFilter</code> đối chiếu request với các rule của bạn và ném <code>AccessDeniedException</code>; cuối cùng <code>ExceptionTranslationFilter</code> đổi lỗi đó thành 401 hoặc 403. Có hai hệ quả thường được hỏi: phân quyền diễn ra <em>trước</em> controller, nên một filter hay interceptor đặt sớm hơn sẽ không thấy user nào đã đăng nhập; và có thể có nhiều chain — chỉ chain đầu tiên khớp matcher được chạy, các chain sau bị bỏ qua.</p></details>
<pre>Request
  ↓
DisableEncodeUrlFilter / WebAsyncManagerIntegrationFilter
SecurityContextHolderFilter      ← loads SecurityContext (session or empty)
HeaderWriterFilter               ← security headers
CorsFilter                       ← CORS preflight (must run BEFORE auth)
CsrfFilter                       ← rejects unsafe methods without a token
LogoutFilter
UsernamePasswordAuthenticationFilter   ← /login form POST
BearerTokenAuthenticationFilter        ← Authorization: Bearer (resource server)
...OAuth2LoginAuthenticationFilter, custom JWT filter, etc.
RequestCacheAwareFilter / SecurityContextHolderAwareRequestFilter
AnonymousAuthenticationFilter    ← "anonymous" principal if still unauthenticated
ExceptionTranslationFilter       ← catches AccessDeniedException → 401/403
AuthorizationFilter              ← evaluates authorizeHttpRequests rules
  ↓
DispatcherServlet → your @RestController (+ @PreAuthorize via AOP)</pre>
<pre>// Multiple chains: order matters, first match wins
@Bean @Order(1) SecurityFilterChain api(HttpSecurity http) throws Exception {
  return http.securityMatcher("/api/**")                 // ← only /api
    .authorizeHttpRequests(a -> a.anyRequest().authenticated())
    .oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults()))
    .csrf(CsrfConfigurer::disable)
    .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
    .build();
}
@Bean @Order(2) SecurityFilterChain web(HttpSecurity http) throws Exception {
  return http.formLogin(Customizer.withDefaults())        // everything else
    .authorizeHttpRequests(a -> a
      .requestMatchers("/", "/css/**").permitAll()
      .anyRequest().authenticated())
    .build();
}
// Debugging tips:
// - logging.level.org.springframework.security=DEBUG prints the chain
// - a custom filter goes in with addFilterBefore(f, AuthorizationFilter.class)
//   (before authorization, after authentication) — placement bugs are the
//   #1 cause of "my SecurityContext is empty"
// - 401 = not authenticated, 403 = authenticated but not allowed</pre>
<div class="key-point">Authentication filters populate the <code>SecurityContext</code>; <code>AuthorizationFilter</code> enforces the rules afterwards, all before your controller runs. Know the order, use <code>securityMatcher</code> per chain with explicit <code>@Order</code>, and remember only the first matching chain executes.</div>`,
  },
  {
    q: 'How do you configure Spring Security for a stateless JWT API — and should you disable CSRF?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>For a token-based API the configuration is: stateless session policy, no form login, an OAuth2 resource server validating JWTs against the issuer's JWKS, explicit authorization rules ending in <code>anyRequest().authenticated()</code>, a real CORS configuration, and a converter that maps your provider's role claims to Spring authorities. Disabling CSRF is correct <em>only</em> because the credential is a header the browser does not attach automatically — if you switch to cookie-based auth, CSRF protection must come back on. I always add: no wildcard CORS with credentials, method security enabled for object-level checks, an entry point returning clean JSON 401/403 instead of a redirect to a login page, and Actuator locked down.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Với API dùng token, cấu hình gồm: session policy stateless, tắt form login, bật OAuth2 resource server để verify JWT theo JWKS của issuer, khai báo rule phân quyền rõ ràng và kết thúc bằng <code>anyRequest().authenticated()</code>, cấu hình CORS đúng đắn, và một converter map claim role của provider thành authority của Spring. Việc tắt CSRF là đúng <em>chỉ vì</em> credential ở đây là một header mà browser không tự động gửi kèm — nếu bạn chuyển sang xác thực bằng cookie thì phải bật lại CSRF. Tôi luôn thêm: không dùng CORS wildcard khi cho phép credentials, bật method security để kiểm tra ở mức object, cấu hình entry point trả JSON 401/403 gọn gàng thay vì redirect về trang login, và khóa chặt Actuator.</p></details>
<pre>@Configuration @EnableWebSecurity @EnableMethodSecurity
class SecurityConfig {

  @Bean SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
      .csrf(csrf -> csrf.disable())          // OK: no cookie-based auth here
      .cors(c -> c.configurationSource(corsSource()))
      .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
      .formLogin(f -> f.disable()).httpBasic(b -> b.disable())
      .authorizeHttpRequests(a -> a
        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
        .requestMatchers("/actuator/health", "/actuator/info").permitAll()
        .requestMatchers("/api/public/**").permitAll()
        .requestMatchers("/api/admin/**").hasRole("ADMIN")
        .anyRequest().authenticated())       // ← default deny, always last
      .oauth2ResourceServer(o -> o.jwt(j -> j
          .jwtAuthenticationConverter(jwtConverter())))
      .exceptionHandling(e -> e
        .authenticationEntryPoint(new BearerTokenAuthenticationEntryPoint())
        .accessDeniedHandler(new BearerTokenAccessDeniedHandler()))
      .headers(h -> h.frameOptions(f -> f.deny())
                     .httpStrictTransportSecurity(hsts -> hsts
                        .includeSubDomains(true).maxAgeInSeconds(63072000)))
      .build();
  }

  // Map provider-specific role claims → ROLE_* authorities
  private JwtAuthenticationConverter jwtConverter() {
    var roles = new JwtGrantedAuthoritiesConverter();
    roles.setAuthorityPrefix("ROLE_");
    roles.setAuthoritiesClaimName("roles");   // Keycloak: realm_access.roles
    var conv = new JwtAuthenticationConverter();
    conv.setJwtGrantedAuthoritiesConverter(roles);
    return conv;
  }

  @Bean CorsConfigurationSource corsSource() {
    var c = new CorsConfiguration();
    c.setAllowedOrigins(List.of("https://app.example.com"));  // no "*"
    c.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE"));
    c.setAllowedHeaders(List.of("Authorization","Content-Type"));
    c.setAllowCredentials(true);       // incompatible with "*" by spec
    c.setMaxAge(3600L);
    var src = new UrlBasedCorsConfigurationSource();
    src.registerCorsConfiguration("/**", c);
    return src;
  }
}
# application.yml
spring.security.oauth2.resourceserver.jwt:
  issuer-uri: https://kc.example.com/realms/prod   # discovers JWKS
  audiences: orders-api                            # validate aud!</pre>
<p><strong>When is disabling CSRF wrong?</strong> Whenever the browser can authenticate the request on its own: session cookies, a BFF that stores the access token in an HttpOnly cookie, or <code>SameSite=None</code> cookies. Then enable it with <code>CookieCsrfTokenRepository.withHttpOnlyFalse()</code> (SPA reads the cookie, echoes the header) or rely on <code>SameSite=Lax</code> plus an Origin check for simple cases. "We disabled CSRF because it broke Postman" is the wrong reason.</p>
<p><strong>Other production must-haves:</strong> expose only <code>health</code>/<code>info</code> from Actuator and require a role for the rest (<code>/actuator/env</code> and <code>/heapdump</code> leak secrets); never log the <code>Authorization</code> header; set <code>server.error.include-stacktrace=never</code>; validate <code>aud</code> and issuer; and keep the JWKS cache with a bounded refresh so an unknown <code>kid</code> cannot trigger unbounded fetches.</p>
<div class="key-point">Stateless + resource server + default-deny rules + explicit CORS + role-claim conversion. Disable CSRF only because the token travels in a header you set manually — the moment authentication rides on a cookie, CSRF protection is mandatory again.</div>`,
  },
  {
    q: 'What is method-level security in Spring, and what are its pitfalls?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>URL rules cannot express object-level questions, so Spring adds annotations evaluated by AOP: <code>@PreAuthorize</code> (before the call, with SpEL access to arguments and the principal), <code>@PostAuthorize</code> (on the returned object), <code>@PreFilter</code>/<code>@PostFilter</code> (to strip collection elements), all enabled by <code>@EnableMethodSecurity</code>. They are the natural place for "may this user act on <em>this</em> entity", and they keep the check next to the business method rather than duplicated per endpoint. The pitfalls are all about proxies and expressions: annotations do nothing on self-invocation or private methods, <code>@PostAuthorize</code> runs after the work is done (so it does not prevent side effects), long SpEL strings become untestable, and a typo in a role name silently allows or denies — which is why I prefer a small <code>PermissionEvaluator</code>/service invoked from SpEL and covered by tests.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Rule theo URL không diễn đạt được các câu hỏi ở mức object, nên Spring bổ sung các annotation được đánh giá bằng AOP: <code>@PreAuthorize</code> (chạy trước, dùng SpEL truy cập được tham số và principal), <code>@PostAuthorize</code> (kiểm tra trên object trả về), <code>@PreFilter</code>/<code>@PostFilter</code> (lọc bớt phần tử trong collection), tất cả bật bằng <code>@EnableMethodSecurity</code>. Đây là chỗ hợp lý để trả lời "user này có được tác động lên <em>đúng entity này</em> không", và giữ phần kiểm tra nằm cạnh method nghiệp vụ thay vì lặp lại ở từng endpoint. Cạm bẫy thì đều nằm ở proxy và ở biểu thức: annotation không có tác dụng khi gọi nội bộ trong cùng class hoặc trên method private; <code>@PostAuthorize</code> chạy sau khi việc đã làm xong nên không ngăn được side effect; SpEL viết dài thì không test được; và chỉ cần gõ sai tên role là âm thầm cho phép hoặc âm thầm chặn — vì vậy tôi thích gọi một <code>PermissionEvaluator</code>/service nhỏ từ SpEL rồi viết test cho nó.</p></details>
<pre>@EnableMethodSecurity   // (prePostEnabled by default in Spring Security 6)

@PreAuthorize("hasRole('ADMIN')")
void deleteUser(Long id) { ... }

// Object-level: SpEL can read the arguments
@PreAuthorize("#order.customerId == authentication.name or hasRole('SUPPORT')")
Order update(Order order) { ... }

// Delegate to a testable component instead of long expressions
@PreAuthorize("@perm.canApprove(authentication, #id)")
void approve(Long id) { ... }

// Filter a returned collection
@PostFilter("filterObject.ownerId == authentication.name")
List&lt;Document&gt; findAll() { ... }        // ⚠ loads everything, then filters
// Prefer a scoped query: repo.findByOwner(currentUser) — cheaper and safer

@PostAuthorize("returnObject.ownerId == authentication.name")
Document find(Long id) { ... }          // ⚠ the read already happened</pre>
<pre>// The proxy pitfalls
@Service class Svc {
  public void outer() { inner(); }          // ← self-call: NOT intercepted
  @PreAuthorize("hasRole('ADMIN')") public void inner() { }
}
// Fixes: call through another bean, inject self, or move the check up.
// Also: annotations on private/final methods (or final classes with CGLIB)
// are ignored — no error, just no security.

// Other traps
- hasRole('ADMIN') expects the authority ROLE_ADMIN; hasAuthority('ADMIN')
  does not add the prefix. Mixing them is a classic silent failure.
- @PostFilter/@PostAuthorize do not stop the query or the side effects.
- @Transactional + security proxy ordering can surprise you; keep checks
  outside the transaction where possible.
- Async/@Scheduled threads have no SecurityContext unless you propagate it
  (DelegatingSecurityContextExecutor / MODE_INHERITABLETHREADLOCAL).
- Test them: @WithMockUser("...") + @SpringBootTest, one test per rule.
  An authorization rule with no test is a rule you will break in a refactor.</pre>
<div class="key-point">Use URL rules for coarse access and <code>@PreAuthorize</code> for object-level decisions, delegating real logic to a tested permission bean. Remember AOP limits — self-invocation and private methods are unprotected — and prefer scoped queries over <code>@PostFilter</code>.</div>`,
  },
  {
    q: 'How does Spring Security store passwords, and how do you migrate existing hashes?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>Spring exposes hashing through <code>PasswordEncoder</code>, and the recommended default is <code>PasswordEncoderFactories.createDelegatingPasswordEncoder()</code>, which stores an algorithm id in front of the hash — <code>{bcrypt}$2a$10$...</code>. That prefix is what makes migration painless: the delegating encoder reads the prefix to <em>verify</em> old hashes with their original algorithm while <em>encoding</em> new ones with the current default, so you can move from MD5 or SHA-1 to bcrypt or argon2 without asking users to reset anything. The pattern is to re-hash transparently on the next successful login (<code>upgradeEncoding</code>), and for genuinely unsafe legacy hashes, wrap them — hash the old digest with bcrypt — so nothing weak remains at rest.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Spring cung cấp việc băm mật khẩu qua <code>PasswordEncoder</code>, và lựa chọn mặc định nên dùng là <code>PasswordEncoderFactories.createDelegatingPasswordEncoder()</code> — nó lưu kèm mã thuật toán ở đầu chuỗi hash, kiểu <code>{bcrypt}$2a$10$...</code>. Chính cái tiền tố đó làm việc chuyển đổi trở nên nhẹ nhàng: delegating encoder đọc tiền tố để <em>verify</em> hash cũ bằng đúng thuật toán cũ, nhưng khi <em>encode</em> mới thì dùng thuật toán mặc định hiện tại — nhờ vậy bạn chuyển từ MD5 hay SHA-1 sang bcrypt/argon2 mà không cần bắt người dùng đặt lại mật khẩu. Cách làm là hash lại một cách trong suốt ngay lần đăng nhập thành công kế tiếp (<code>upgradeEncoding</code>); còn với những hash cũ thật sự yếu thì hãy bọc chúng lại — lấy digest cũ đem băm bằng bcrypt — để trong DB không còn thứ gì yếu nằm lại.</p></details>
<pre>@Bean PasswordEncoder passwordEncoder() {
  return PasswordEncoderFactories.createDelegatingPasswordEncoder();
}
// Stored format carries the algorithm:
{bcrypt}$2a$10$dXJ3SW6G7P50lGmMkkmwe...
{argon2}$argon2id$v=19$m=16384,t=2,p=1$...
{noop}plaintext        ← test only; a red flag in a real database
// Verification picks the algorithm from the prefix; encoding uses the
// current default (bcrypt today, argon2 if you configure it).

// Explicit alternatives
new BCryptPasswordEncoder(12);                       // cost ≥ 12
new Argon2PasswordEncoder(16, 32, 1, 65536, 3);      // memory-hard</pre>
<pre>// Migration strategy A — prefix the legacy hashes once (a DB script)
UPDATE users SET password = CONCAT('{MD5}', password) WHERE password NOT LIKE '{%';
// Register a legacy encoder for the {MD5} id, keep bcrypt as the default,
// then re-hash on login:
if (encoder.matches(raw, stored) && encoder.upgradeEncoding(stored)) {
    user.setPassword(encoder.encode(raw));     // now {bcrypt}
    repo.save(user);
}

// Migration strategy B — "wrap" so nothing weak stays at rest (best)
// stored = bcrypt(md5(password)): re-hash every row offline without
// knowing the passwords, then verify as bcrypt(md5(input)).
// After the next successful login, replace it with plain bcrypt(password).

// What NOT to do
- force a global password reset unless you must (support cost, churn,
  and users pick something worse)
- keep the legacy encoder as the DEFAULT "temporarily" — new users get
  weak hashes forever
- log or return the hash; compare with encoder.matches(), never with equals()</pre>
<p><strong>Adjacent details:</strong> bcrypt silently truncates input at 72 bytes (argon2 does not); do not pre-hash a password with SHA-256 client-side and treat that as the secret (it becomes the password); rate-limit login regardless of algorithm; and re-verify the current password before allowing an email or password change.</p>
<div class="key-point"><code>DelegatingPasswordEncoder</code> plus the <code>{id}</code> prefix makes hash migration a non-event: verify with the old algorithm, encode with the new one, and re-hash on the next login. Wrap unsafe legacy digests in bcrypt so nothing weak survives in the database.</div>`,
  },
  {
    q: 'How do you harden a Node.js / Next.js application?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>For the JavaScript stack I work through five layers. <strong>Headers and transport</strong>: Helmet (or Next's <code>headers()</code>) for CSP with per-request nonces, HSTS, and <code>nosniff</code>. <strong>Input and output</strong>: validate every request body with zod/Joi, never build SQL or shell commands by concatenation, and treat <code>dangerouslySetInnerHTML</code> as requiring DOMPurify. <strong>Auth and session</strong>: Auth.js/NextAuth or an IdP, tokens in HttpOnly <code>SameSite</code> cookies rather than localStorage, and CSRF protection whenever cookies authenticate a mutating request. <strong>Server/client boundary</strong>: in App Router, route handlers and server actions are public HTTP endpoints — each one must authenticate and authorize independently, and secrets must never reach a file that can be imported by client components. <strong>Supply chain and runtime</strong>: lockfiles, <code>npm audit</code>/Snyk in CI, <code>--ignore-scripts</code> where possible, non-root containers, and no secrets in <code>NEXT_PUBLIC_*</code>.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Với stack JavaScript, tôi đi qua năm lớp. <strong>Header và transport</strong>: dùng Helmet (hoặc <code>headers()</code> của Next) để đặt CSP kèm nonce theo từng request, HSTS và <code>nosniff</code>. <strong>Input và output</strong>: validate mọi request body bằng zod/Joi, không bao giờ ghép chuỗi để tạo SQL hay lệnh shell, và coi <code>dangerouslySetInnerHTML</code> là chỗ buộc phải đi qua DOMPurify. <strong>Auth và session</strong>: dùng Auth.js/NextAuth hoặc một IdP, đặt token trong cookie HttpOnly + <code>SameSite</code> chứ không phải localStorage, và bật chống CSRF mỗi khi request thay đổi dữ liệu được xác thực bằng cookie. <strong>Ranh giới server/client</strong>: trong App Router, route handler và server action đều là endpoint HTTP công khai — mỗi cái phải tự xác thực và phân quyền riêng, còn secret thì không được nằm trong file mà client component có thể import. <strong>Chuỗi cung ứng và runtime</strong>: khóa version bằng lockfile, chạy <code>npm audit</code>/Snyk trong CI, dùng <code>--ignore-scripts</code> ở nơi có thể, container chạy user không phải root, và tuyệt đối không đặt secret vào biến <code>NEXT_PUBLIC_*</code>.</p></details>
<pre>// Express baseline
app.use(helmet({ contentSecurityPolicy: { directives: {
  defaultSrc: ["'self'"], scriptSrc: ["'self'", (req,res)=>\`'nonce-\${res.locals.nonce}'\`],
  objectSrc: ["'none'"], frameAncestors: ["'none'"] }}}));
app.use(express.json({ limit: '100kb' }));      // body-size DoS guard
app.use(rateLimit({ windowMs: 60_000, max: 100 }));
app.disable('x-powered-by');
app.use(cookieSession({ httpOnly: true, secure: true, sameSite: 'lax' }));
// and: cors({ origin: ['https://app.example.com'], credentials: true })</pre>
<pre>// Next.js App Router — the boundary is where bugs live
// ❌ assuming a route handler is "internal" because only your UI calls it
export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json(await db.order.create({ data: body })); // 💀
}
// ✅ authenticate + authorize + validate in EVERY handler / server action
export async function POST(req: Request) {
  const session = await auth();                       // no session → 401
  if (!session) return new NextResponse('Unauthorized', { status: 401 });
  const data = CreateOrder.parse(await req.json());   // zod, .strict()
  if (!can(session.user, 'order:create')) return new NextResponse(null,{status:403});
  return NextResponse.json(await service.create(session.user.id, data));
}
// 'use server' actions are RPC endpoints reachable by anyone who guesses
// the action id — never rely on "the button is only rendered for admins".

// Env vars: NEXT_PUBLIC_* is compiled into the browser bundle.
// Server-only secrets stay in plain process.env, used only in server files;
// import 'server-only' guards a module against accidental client import.</pre>
<pre>// Output encoding in React
&lt;div&gt;{userInput}&lt;/div&gt;                        // ✅ auto-escaped
&lt;div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}/&gt;  // ✅ if you must
&lt;a href={userUrl}&gt;                            // ⚠ javascript: URLs → validate scheme
// eval / new Function / setTimeout(string) with user input → never

// Supply chain and runtime
npm ci                       # lockfile, reproducible
npm audit --production       # plus Snyk/Dependabot in CI
npm config set ignore-scripts true   # postinstall is arbitrary code execution
FROM node:20-alpine … USER node      # non-root, read-only fs, no shell needed
process.on('unhandledRejection', …)  # do not leak stack traces to clients</pre>
<div class="key-point">In Next.js every route handler and server action is a public API: authenticate, authorize, and validate inside each one. Add Helmet/CSP with nonces, HttpOnly SameSite cookies instead of localStorage, DOMPurify for any raw HTML, and keep secrets out of <code>NEXT_PUBLIC_*</code> and out of client-importable modules.</div>`,
  },
];
