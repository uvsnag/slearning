// Interview data: springboot
// Auto-generated from pv.html
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
  {
    id: 'springboot',
    name: 'Spring Boot',
    icon: '🍃',
    questions: [
      {
        q: 'What is Spring Boot and how is it different from Spring Framework?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Spring Boot is not a separate framework; it is Spring with extra tools added on top. The Spring Framework provides the core parts such as the IoC container, MVC, Data, and Security, while Spring Boot adds auto-configuration, starter dependencies, an embedded server, and Actuator to remove most setup work. Any auto-configured bean is only a default and can be replaced by defining your own bean, because of <code>@ConditionalOnMissingBean</code>.</p></div>
<p><strong>Spring Boot is not a replacement for the Spring Framework — it sits on top of it.</strong> The Framework provides the core (IoC container, AOP, MVC, Data, Security); Boot adds "convention over configuration" tooling so you spend almost no time on setup.</p>
<ul>
<li><strong>Spring Framework</strong> — the foundational libraries. Powerful, but requires <strong>manual wiring</strong>: XML or Java <code>@Configuration</code>, an external servlet container, explicit <code>DispatcherServlet</code> setup, and hand-picked, version-matched dependencies.</li>
<li><strong>Spring Boot</strong> — an opinionated layer over the Framework that adds four things:
  <ul>
    <li><strong>Auto-configuration</strong> — inspects the classpath and configures sensible beans automatically (sees a JDBC driver → configures a DataSource).</li>
    <li><strong>Starter dependencies</strong> — one dependency pulls in a curated, version-aligned set (e.g. <code>spring-boot-starter-web</code>).</li>
    <li><strong>Embedded server</strong> — Tomcat/Jetty/Undertow bundled into the JAR, so you run a plain <code>java -jar app.jar</code> — no external container to install.</li>
    <li><strong>Production-ready features</strong> — Actuator (health, metrics), externalized configuration, sensible logging, all out of the box.</li>
  </ul>
</li>
</ul>
<pre>// Spring: web.xml, DispatcherServlet config, component-scan XML, external server...
// Spring Boot: just this — auto-configured, embedded server, runnable JAR
@SpringBootApplication
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}</pre>
<div class="key-point">One-line answer: "Spring Boot IS Spring, plus auto-configuration, starters, an embedded server, and Actuator — it removes the plumbing so you write business logic." You can override any auto-configured bean by defining your own (<code>@ConditionalOnMissingBean</code> means your bean wins).</div>`,
      },
      {
        q: 'Explain @SpringBootApplication annotation. What does it combine?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><code>@SpringBootApplication</code> is one annotation that combines three others: <code>@Configuration</code>, <code>@EnableAutoConfiguration</code>, and <code>@ComponentScan</code>. Together they make the class a source of beans, turn on auto-configuration, and scan for components. Scanning starts from the package of the annotated class and goes downward, so beans placed in other packages may not be found. The <code>exclude</code> option can turn off parts of auto-configuration that are not wanted.</p></div>
<p><code>@SpringBootApplication</code> is a convenience annotation combining three:</p>
<ul>
<li><code>@Configuration</code> – marks class as a configuration source (replaces XML).</li>
<li><code>@EnableAutoConfiguration</code> – enables Spring Boot's auto-configuration based on classpath.</li>
<li><code>@ComponentScan</code> – scans current package and sub-packages for <code>@Component</code>, <code>@Service</code>, <code>@Repository</code>, <code>@Controller</code>.</li>
</ul>
<pre>// Equivalent to:
@Configuration
@EnableAutoConfiguration
@ComponentScan(basePackages = "com.example")
public class App { }</pre>`,
      },
      {
        q: 'What are Spring Boot Starters? Name the most commonly used ones.',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A starter is a dependency that pulls in a matched set of libraries for one job, so <code>spring-boot-starter-web</code> brings Spring MVC, Tomcat, and Jackson together with compatible versions. The versions come from the parent BOM, which is why starters need no version number and why upgrading Spring Boot moves them all together. Common ones include <code>-web</code>, <code>-data-jpa</code>, <code>-security</code>, <code>-validation</code>, <code>-actuator</code>, and <code>-test</code>. A team can also build its own starter to share common settings.</p></div>
<p>A <strong>starter</strong> is a dependency descriptor that bundles a curated, version-compatible set of libraries for one purpose. Instead of hand-picking a dozen JARs and matching their versions, you add one starter and get everything, correctly aligned.</p>
<pre>&lt;!-- One line pulls in Spring MVC + embedded Tomcat + Jackson + validation --&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;
&lt;/dependency&gt;   &lt;!-- note: NO version number needed --&gt;</pre>
<p><strong>Commonly used starters:</strong></p>
<ul>
<li><code>spring-boot-starter-web</code> — REST APIs / MVC (embedded Tomcat, Jackson, Spring MVC)</li>
<li><code>spring-boot-starter-data-jpa</code> — JPA + Hibernate + HikariCP connection pool</li>
<li><code>spring-boot-starter-security</code> — authentication &amp; authorization</li>
<li><code>spring-boot-starter-test</code> — JUnit 5, Mockito, AssertJ, MockMvc (included by default)</li>
<li><code>spring-boot-starter-validation</code> — Bean Validation (Hibernate Validator)</li>
<li><code>spring-boot-starter-actuator</code> — health checks, metrics, monitoring</li>
<li><code>spring-boot-starter-data-redis</code> / <code>-amqp</code> / <code>-webflux</code> — Redis, RabbitMQ, reactive web</li>
</ul>
<p><strong>How version management works:</strong> your project inherits from <code>spring-boot-starter-parent</code> (or imports <code>spring-boot-dependencies</code> as a BOM), which pins the version of every managed library. That's why starters carry no explicit version — the parent/BOM resolves it, guaranteeing the whole set is mutually compatible. Upgrade Boot's version once and every managed dependency moves together.</p>
<div class="key-point">Trick: "What's the difference between a starter and a normal dependency?" — a starter contains almost no code itself; it's a POM that transitively declares the real libraries plus an auto-configuration module. You can build your own <code>acme-spring-boot-starter</code> to package company-wide defaults the same way.</div>`,
      },
      {
        q: 'How does Spring Boot auto-configuration work internally?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Auto-configuration works through conditional bean registration. <code>@EnableAutoConfiguration</code> loads a list of configuration classes from files under <code>META-INF</code> (<code>spring.factories</code> in Boot 2, the newer <code>AutoConfiguration.imports</code> file in Boot 3). Each class is guarded by conditions such as <code>@ConditionalOnClass</code>, <code>@ConditionalOnMissingBean</code>, and <code>@ConditionalOnProperty</code>, so a bean is created only when the library is present and the user has not defined their own. Running with <code>--debug</code> prints a report of what matched and what was skipped.</p></div>
<ol>
<li><code>@EnableAutoConfiguration</code> triggers <code>AutoConfigurationImportSelector</code>.</li>
<li>It reads <code>META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports</code> (Boot 3) or <code>META-INF/spring.factories</code> (Boot 2).</li>
<li>Each auto-config class is guarded by <code>@Conditional</code> annotations:</li>
</ol>
<pre>@Configuration
@ConditionalOnClass(DataSource.class)         // class on classpath?
@ConditionalOnMissingBean(DataSource.class)   // user didn't define one?
public class DataSourceAutoConfiguration {
    @Bean
    public DataSource dataSource() { ... }
}</pre>
<ul>
<li><code>@ConditionalOnClass</code> – activate only if class exists on classpath</li>
<li><code>@ConditionalOnMissingBean</code> – don't override user-defined beans</li>
<li><code>@ConditionalOnProperty</code> – check application.properties value</li>
</ul>
<div class="key-point">Debug auto-config: run with <code>--debug</code> or check <code>ConditionEvaluationReport</code> in logs.</div>`,
      },
      {
        q: 'Explain Spring Boot Profiles. How to use them?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Profiles let one build hold settings for several environments, such as dev and prod, and pick one at startup without rebuilding. Config files like <code>application-{profile}.yml</code> override the shared <code>application.yml</code>, and beans marked with <code>@Profile</code> exist only when their profile is active. A profile is usually selected with the <code>SPRING_PROFILES_ACTIVE</code> variable, which fits containers well. Profiles are meant for environment wiring, not runtime feature flags, since changing one needs a restart.</p></div>
<p>Profiles let you keep <strong>environment-specific configuration and beans</strong> (dev, test, staging, prod) in one codebase and switch between them at launch — no rebuild.</p>
<p><strong>1. Profile-specific config files</strong> — <code>application-{profile}.yml</code> is layered <em>on top of</em> the base <code>application.yml</code>; the active profile's values override the shared defaults.</p>
<pre># application.yml            (always loaded — shared defaults)
spring:
  jpa:
    open-in-view: false

# application-dev.yml         (loaded only when 'dev' is active)
spring:
  datasource:
    url: jdbc:h2:mem:testdb

# application-prod.yml
spring:
  datasource:
    url: jdbc:postgresql://prod-db:5432/myapp</pre>
<p><strong>2. Activate a profile</strong> (later source wins):</p>
<ul>
<li>Property: <code>spring.profiles.active=dev</code> in <code>application.yml</code></li>
<li>Env var: <code>SPRING_PROFILES_ACTIVE=prod</code> (typical in containers)</li>
<li>CLI: <code>java -jar app.jar --spring.profiles.active=prod</code> (highest precedence)</li>
</ul>
<p><strong>3. Profile-scoped beans</strong> — a bean exists only when its profile is active:</p>
<pre>@Bean @Profile("dev")   DataSource devDs()  { return new EmbeddedDatabaseBuilder()...; }
@Bean @Profile("prod")  DataSource prodDs() { return hikariDataSource(); }
@Bean @Profile("!prod") FakeMailer mailer() { ... }   // any profile EXCEPT prod</pre>
<ul>
<li><strong>Profile groups</strong> (Boot 2.4+): activate several at once — <code>spring.profiles.group.prod=prod-db,prod-cache,monitoring</code>.</li>
<li><strong>Default profile</strong>: config with no <code>@Profile</code> is always active; <code>@Profile("default")</code> applies only when NO profile is set.</li>
<li><strong>In tests</strong>: <code>@ActiveProfiles("test")</code> on the test class.</li>
</ul>
<div class="key-point">Gotcha: profiles are for <strong>environment wiring</strong> (which DB, which mailer), NOT runtime feature flags — you can't flip a profile without a restart, and scattering <code>@Profile</code> through business code makes behavior hard to follow. For toggles that change at runtime, use a feature-flag library or a config property read at call time.</div>`,
      },
      {
        q: 'What is Spring Boot Actuator? What endpoints does it expose?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Actuator adds ready-made endpoints for running an app in production, such as health, metrics, env, beans, and loggers. The <code>/health</code> endpoint is commonly used for Kubernetes readiness and liveness probes, and <code>/metrics</code> or <code>/prometheus</code> feeds Prometheus and Grafana. By default only limited information is exposed over HTTP, which is the safe choice. Endpoints like <code>/env</code> and <code>/beans</code> reveal internal details, so only needed ones should be exposed and they should be secured.</p></div>
<p>Actuator provides production-ready features for monitoring and managing your application.</p>
<ul>
<li><code>/actuator/health</code> – application health status (UP/DOWN)</li>
<li><code>/actuator/info</code> – application info (build version, git commit)</li>
<li><code>/actuator/metrics</code> – JVM memory, CPU, HTTP request metrics</li>
<li><code>/actuator/env</code> – environment properties</li>
<li><code>/actuator/beans</code> – all registered beans</li>
<li><code>/actuator/loggers</code> – view/change log levels at runtime</li>
</ul>
<pre># application.yml – expose specific endpoints
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always</pre>
<div class="key-point">In production: secure actuator endpoints, expose only what's needed, integrate with Prometheus/Grafana for monitoring.</div>`,
      },
      {
        q: 'How does Spring Boot handle exception handling in REST APIs?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>REST error handling is centralized in a single <code>@RestControllerAdvice</code> class so controllers do not need try/catch. Each <code>@ExceptionHandler</code> method maps one exception type to an HTTP response for all controllers, and the most specific handler is chosen first. Spring Boot 3 can return a <code>ProblemDetail</code> body based on RFC 7807. Stack traces should never be sent to the client, and this advice only catches exceptions thrown inside Spring MVC, not those from a servlet Filter.</p></div>
<p>Centralize error handling with <code>@RestControllerAdvice</code> so controllers stay free of try/catch. A class annotated with it applies its <code>@ExceptionHandler</code> methods <strong>globally, across every controller</strong>; each method maps one exception type to an HTTP response.</p>
<pre>@RestControllerAdvice          // = @ControllerAdvice + @ResponseBody (returns JSON)
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity&lt;ErrorResponse&gt; handleNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(404, ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    // @Valid failures land here — turn field errors into a readable message
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity&lt;ErrorResponse&gt; handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest().body(new ErrorResponse(400, msg));
    }

    // Fallback — catch-all so the client never sees a raw stack trace
    @ExceptionHandler(Exception.class)
    public ResponseEntity&lt;ErrorResponse&gt; handleGeneral(Exception ex) {
        log.error("Unhandled exception", ex);          // log the detail server-side
        return ResponseEntity.status(500).body(new ErrorResponse(500, "Internal error"));
    }
}</pre>
<p><strong>How resolution works</strong> — when a controller throws, Spring searches for a handler in this order:</p>
<ol>
<li>An <code>@ExceptionHandler</code> in the <em>same</em> controller.</li>
<li>An <code>@ExceptionHandler</code> in a <code>@ControllerAdvice</code> class, matched by the <strong>most specific</strong> exception type (<code>ResourceNotFoundException</code> beats <code>Exception</code>).</li>
<li>Spring's default handling (<code>BasicErrorController</code> → the <code>/error</code> response).</li>
</ol>
<ul>
<li><strong>Map status declaratively</strong>: annotate the exception (or handler) with <code>@ResponseStatus(HttpStatus.NOT_FOUND)</code> instead of building the status by hand.</li>
<li><strong>Spring Boot 3</strong>: prefer returning a <code>ProblemDetail</code> (RFC 7807) for a standardized <code>{type, title, status, detail, instance}</code> body.</li>
<li><strong>Never leak internals</strong>: log the stack trace server-side, return a safe, generic message to the client.</li>
</ul>
<div class="key-point">Trick: "@ControllerAdvice vs @RestControllerAdvice?" — the Rest variant adds <code>@ResponseBody</code>, so return values are serialized to JSON instead of resolved as view names. "Why isn't my handler firing?" — a more specific handler (or one in the throwing controller) took priority, or the exception was thrown from a Filter (outside Spring MVC), which advice cannot catch.</div>`,
      },
      {
        q: 'What are @RequestMapping, @GetMapping, @PostMapping, @PathVariable, @RequestParam, @RequestBody?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p><code>@RequestMapping</code> on a class sets the base path, and <code>@GetMapping</code>, <code>@PostMapping</code>, and similar are shortcuts for each HTTP method. <code>@PathVariable</code> reads a value from the URL path, <code>@RequestParam</code> reads a query string or form value, and <code>@RequestBody</code> converts the JSON body into an object using Jackson. Pairing <code>@RequestBody</code> with <code>@Valid</code> lets bad input fail early with a clean 400 response.</p></div>
<pre>@RestController
@RequestMapping("/api/users")       // base path
public class UserController {

    @GetMapping                       // GET /api/users
    public List&lt;User&gt; getAll() { }

    @GetMapping("/{id}")              // GET /api/users/42
    public User getById(@PathVariable Long id) { }

    @GetMapping("/search")            // GET /api/users/search?name=John
    public List&lt;User&gt; search(@RequestParam String name) { }

    @PostMapping                      // POST /api/users (JSON body)
    public User create(@RequestBody @Valid UserDTO dto) { }

    @PutMapping("/{id}")              // PUT /api/users/42
    public User update(@PathVariable Long id, @RequestBody UserDTO dto) { }

    @DeleteMapping("/{id}")           // DELETE /api/users/42
    public void delete(@PathVariable Long id) { }
}</pre>
<div class="key-point"><code>@PathVariable</code> = from URL path. <code>@RequestParam</code> = from query string. <code>@RequestBody</code> = from JSON body.</div>`,
      },
      {
        q: 'Explain Spring Security filter chain and authentication flow.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Spring Security is a chain of servlet filters placed in front of the application. A request passes through the chain, an authentication filter reads the credentials (for example a form login, or a JWT filter added before <code>UsernamePasswordAuthenticationFilter</code>), and passes them to the <code>AuthenticationManager</code>. A provider loads the user through <code>UserDetailsService</code> and checks the password with a <code>PasswordEncoder</code> such as BCrypt, and on success the <code>Authentication</code> is stored in the <code>SecurityContextHolder</code>. For a REST API the chain is often set to stateless with CSRF disabled and access rules defined per path.</p></div>
<ol>
<li>Request enters the <strong>Security Filter Chain</strong> (managed by <code>DelegatingFilterProxy</code>).</li>
<li><code>UsernamePasswordAuthenticationFilter</code> (or JWT filter) extracts credentials.</li>
<li><code>AuthenticationManager</code> delegates to <code>AuthenticationProvider</code>.</li>
<li>Provider calls <code>UserDetailsService.loadUserByUsername()</code> to load user.</li>
<li>Password verified with <code>PasswordEncoder</code>.</li>
<li>On success: <code>SecurityContextHolder</code> stores <code>Authentication</code> object.</li>
</ol>
<pre>@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}</pre>`,
      },
      {
        q: 'What is the difference between @Bean and @Component?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Both register a bean, but they differ in who builds the object. <code>@Component</code> marks a class that Spring finds by scanning and creates through its constructor, which fits your own classes. <code>@Bean</code> is a method inside a <code>@Configuration</code> class where the construction code is written by hand, which fits third-party types or cases that need custom setup. A simple rule is to use <code>@Component</code> for classes you own and <code>@Bean</code> when you do not own the class or need special wiring.</p></div>
<p>Both register a bean in the container; the difference is <strong>where the annotation goes and who instantiates the object</strong>.</p>
<ul>
<li><strong>@Component</strong> (and its stereotypes <code>@Service</code>/<code>@Repository</code>/<code>@Controller</code>) — a <strong>class-level</strong> marker. Spring discovers it by <strong>component scanning</strong> and instantiates it via its constructor. Use it for <strong>your own</strong> classes that you can annotate.</li>
<li><strong>@Bean</strong> — a <strong>method-level</strong> annotation inside a <code>@Configuration</code> class. <strong>You</strong> write the method body that builds and returns the object; Spring calls the method and manages the result. Use it when you <strong>can't annotate the class</strong> (a third-party type) or need <strong>custom construction logic</strong>.</li>
</ul>
<pre>// @Component: your class → Spring instantiates it via component scanning
@Component
public class MyService { }

// @Bean: third-party class OR custom wiring you control by hand
@Configuration
public class AppConfig {
    @Bean(destroyMethod = "close")            // lifecycle hooks — your call
    public RestClient restClient() {
        return RestClient.builder()
            .baseUrl("https://api.example.com")
            .requestFactory(withTimeouts(5_000, 5_000))
            .build();                          // full control over the instance
    }
}</pre>
<p><strong>Key distinctions:</strong></p>
<ul>
<li><strong>Who constructs it</strong>: <code>@Component</code> → Spring, via the constructor (it must be able to inject every argument). <code>@Bean</code> → your method body, so you can pass literals, choose an implementation, or configure the object step by step.</li>
<li><strong>Multiple beans of one type</strong>: with <code>@Bean</code> you can declare several methods returning the same type with different configuration; a <code>@Component</code> class maps to exactly one bean definition.</li>
<li><strong>Inter-bean references</strong>: calling one <code>@Bean</code> method from another still returns the singleton (in default "full" <code>@Configuration</code> mode, via a CGLIB proxy) — not a fresh object.</li>
</ul>
<div class="key-point">Rule of thumb: <strong>own the class → <code>@Component</code></strong> (less code, auto-detected); <strong>third-party class or complex setup → <code>@Bean</code></strong> in a <code>@Configuration</code>. Trick: you can't put <code>@Component</code> on a library type you don't control — that's exactly when <code>@Bean</code> is the answer.</div>`,
      },
      {
        q: 'Explain Spring Boot configuration properties binding with @ConfigurationProperties.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><code>@ConfigurationProperties</code> binds a group of properties onto a typed object, which is cleaner than spreading many <code>@Value</code> annotations. It is type-safe, easy to refactor, and supports relaxed binding, so <code>app.mail-host</code> and <code>app.mailHost</code> both match. Adding <code>@Validated</code> with constraints makes bad configuration fail at startup instead of causing errors later. A single value can still use <code>@Value</code>, but a related set of settings belongs in a properties class.</p></div>
<pre># application.yml
app:
  mail:
    host: smtp.example.com
    port: 587
    from: no-reply@example.com</pre>
<pre>@Component
@ConfigurationProperties(prefix = "app.mail")
@Validated
public class MailProperties {
    @NotBlank private String host;
    private int port = 25;             // default value
    @Email private String from;
    // getters/setters
}</pre>
<pre>@Service
public class MailService {
    private final MailProperties props;
    public MailService(MailProperties props) { this.props = props; }
}</pre>
<div class="key-point">Advantages over <code>@Value</code>: type-safe, validated, refactorable, supports relaxed binding (<code>app.mail-host</code> = <code>app.mailHost</code>).</div>`,
      },
      {
        q: 'How to handle Bean lifecycle in Spring Boot?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The lifecycle order is constructor first, then dependency injection, then <code>@PostConstruct</code> once everything is wired, and <code>@PreDestroy</code> at shutdown. Using <code>@PostConstruct</code> and <code>@PreDestroy</code> is preferred because they are standard annotations and do not tie the bean to the <code>InitializingBean</code> and <code>DisposableBean</code> interfaces. Because the constructor runs before injection, using an injected field in the constructor gives a null value. Constructor injection avoids this problem, since the dependency arrives as a constructor argument.</p></div>
<p>Bean lifecycle hooks:</p>
<ul>
<li><strong>Constructor</strong> → <strong>@Autowired</strong> injection → <strong>@PostConstruct</strong> → bean ready</li>
<li>On shutdown: <strong>@PreDestroy</strong> → bean destroyed</li>
</ul>
<pre>@Component
public class CacheWarmer {

    @PostConstruct
    public void init() {
        // runs AFTER all dependencies injected
        loadCacheFromDB();
    }

    @PreDestroy
    public void cleanup() {
        // runs on application shutdown
        flushCacheToDisk();
    }
}

// Alternative: implement interfaces
public class MyBean implements InitializingBean, DisposableBean {
    public void afterPropertiesSet() { } // same as @PostConstruct
    public void destroy() { }            // same as @PreDestroy
}</pre>
<div class="key-point">Order: Constructor → @Autowired → @PostConstruct → afterPropertiesSet → custom init-method.</div>`,
      },
      {
        q: 'What is Spring AOP? Explain common use cases.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>AOP moves cross-cutting concerns such as logging, security, transactions, caching, and retries out of business code and into aspects that wrap method calls with advice like <code>@Around</code>. Many common annotations, including <code>@Transactional</code>, <code>@Cacheable</code>, <code>@Async</code>, and <code>@PreAuthorize</code>, are built on AOP. Spring AOP uses proxies, a JDK dynamic proxy for interfaces and CGLIB for classes. Because of this, calling an advised method from inside the same object bypasses the proxy and skips the advice.</p></div>
<p><strong>AOP (Aspect-Oriented Programming)</strong>: separates cross-cutting concerns from business logic.</p>
<pre>@Aspect
@Component
public class LoggingAspect {

    @Around("@annotation(Loggable)")
    public Object log(ProceedingJoinPoint pjp) throws Throwable {
        String method = pjp.getSignature().getName();
        log.info(">> {}", method);
        long start = System.currentTimeMillis();
        Object result = pjp.proceed();  // execute method
        log.info("<< {} ({}ms)", method, System.currentTimeMillis() - start);
        return result;
    }
}</pre>
<p><strong>Common use cases</strong>:</p>
<ul>
<li>Logging / auditing</li>
<li>Security checks (<code>@PreAuthorize</code>)</li>
<li>Transaction management (<code>@Transactional</code>)</li>
<li>Caching (<code>@Cacheable</code>)</li>
<li>Retry logic, rate limiting</li>
</ul>
<div class="key-point">Spring AOP uses <strong>proxy-based</strong> approach (JDK dynamic proxy for interfaces, CGLIB for classes). Self-invocation bypasses the proxy!</div>`,
      },
      {
        q: 'Explain @Transactional in depth. What are common pitfalls?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p><code>@Transactional</code> wraps a method so a transaction starts before it, commits on normal return, and rolls back on failure, and it is applied by a proxy. By default it rolls back only on unchecked exceptions; a checked exception commits unless <code>rollbackFor</code> is set, which is a common cause of silent data problems. Calls within the same object, and private or final methods, bypass the proxy and are ignored. For propagation, REQUIRED joins the caller's transaction, REQUIRES_NEW runs a separate one, and NESTED uses a savepoint; transactions should stay short to avoid draining the connection pool.</p></div>
<p><code>@Transactional</code> wraps a method in a database transaction: begin before, commit on normal return, roll back on failure. It's implemented by a <strong>proxy</strong> around the bean — the source of most gotchas.</p>
<pre>@Service
public class OrderService {
    @Transactional(
        propagation = Propagation.REQUIRED,      // join existing TX, or start one
        isolation   = Isolation.READ_COMMITTED,  // what concurrent TXs can see
        rollbackFor = Exception.class,           // also roll back on checked exceptions
        timeout     = 30,                        // seconds before forced rollback
        readOnly    = false
    )
    public void placeOrder(Order order) {
        orderRepo.save(order);
        paymentService.charge(order);   // throws → the whole method rolls back
        inventoryService.deduct(order);
    }
}</pre>
<p><strong>Propagation — how the method relates to an existing transaction:</strong></p>
<ul>
<li><strong>REQUIRED</strong> (default) — join the caller's TX if one exists, else start a new one. One rollback rolls back everything.</li>
<li><strong>REQUIRES_NEW</strong> — suspend any current TX and run in an independent one that commits/rolls back on its own (e.g. an audit log that must persist even if the caller fails).</li>
<li><strong>NESTED</strong> — a savepoint inside the current TX; the inner part can roll back alone while the outer survives (JDBC savepoints; many JPA providers don't support it).</li>
<li><strong>SUPPORTS / NOT_SUPPORTED / MANDATORY / NEVER</strong> — run with-TX-if-present / suspend and run non-TX / require one (else throw) / forbid one (else throw).</li>
</ul>
<p><strong>Isolation — what this TX sees of concurrent changes:</strong> <code>READ_UNCOMMITTED</code> → <code>READ_COMMITTED</code> (common default) → <code>REPEATABLE_READ</code> → <code>SERIALIZABLE</code>, trading fewer anomalies (dirty / non-repeatable / phantom reads) for more locking and abort risk. <code>DEFAULT</code> uses the database's own setting.</p>
<p><strong>Rollback rule:</strong> Spring rolls back <strong>only on unchecked exceptions</strong> (<code>RuntimeException</code>/<code>Error</code>) by default. A checked exception <em>commits</em> unless you add <code>rollbackFor = Exception.class</code> — the single most common silent data-integrity bug.</p>
<p><strong>Common pitfalls:</strong></p>
<ul>
<li><strong>Self-invocation</strong>: calling a <code>@Transactional</code> method via <code>this.method()</code> bypasses the proxy → no transaction (see the dedicated question).</li>
<li><strong>private / final methods</strong>: the proxy can't override them → the annotation is silently ignored.</li>
<li><strong>Long transactions</strong>: holding locks/connections across slow work (HTTP calls, big loops) → pool exhaustion, timeouts, deadlocks. Keep them short.</li>
<li><strong>readOnly = true</strong>: a hint (skips Hibernate dirty-checking/flush, may route to a replica) — not a hard guarantee against writes.</li>
</ul>
<div class="key-point">Interview core: "REQUIRED joins, REQUIRES_NEW is independent, NESTED uses a savepoint; and it only rolls back on unchecked exceptions unless you set rollbackFor." The proxy-based self-invocation trap is the follow-up they're really testing.</div>`,
      },
      {
        q: 'How to implement pagination and sorting in Spring Boot?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Spring Data supports paging by having a repository method take a <code>Pageable</code> and return a <code>Page</code>, which runs both the data query and a count query. The controller binds <code>page</code>, <code>size</code>, and <code>sort</code> parameters into a <code>PageRequest</code>. Offset paging gets slower on deep pages because the database still scans and discards the skipped rows, and results can shift when data changes. For large datasets, keyset paging such as <code>WHERE id &gt; :lastId ORDER BY id</code> stays fast.</p></div>
<pre>// Repository
public interface UserRepository extends JpaRepository&lt;User, Long&gt; {
    Page&lt;User&gt; findByStatus(String status, Pageable pageable);
}

// Controller
@GetMapping("/users")
public Page&lt;User&gt; getUsers(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @RequestParam(defaultValue = "name,asc") String[] sort
) {
    Pageable pageable = PageRequest.of(page, size, Sort.by(sort[0]).ascending());
    return userRepo.findByStatus("active", pageable);
}

// Response includes:
// content, totalElements, totalPages, number (current page), size, sort</pre>
<div class="key-point">For large datasets, consider keyset pagination (WHERE id > lastId) instead of offset-based for better performance.</div>`,
      },
      {
        q: 'What is Spring WebFlux? How is it different from Spring MVC?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Spring MVC uses a blocking, thread-per-request model on the Servlet API, while WebFlux is non-blocking and reactive, runs on an event loop with Netty, and returns <code>Mono</code> and <code>Flux</code>. WebFlux suits high-concurrency I/O work such as many connections, streaming, or a gateway calling many services. It must be reactive end to end, because a single blocking call can stall the event loop. Java 21 virtual threads now give MVC similar scalability for I/O, so WebFlux is mainly needed when backpressure or streaming is required.</p></div>
<ul>
<li><strong>Spring MVC</strong>: synchronous, blocking, thread-per-request. Uses Servlet API (Tomcat).</li>
<li><strong>Spring WebFlux</strong>: asynchronous, non-blocking, reactive (event loop). Uses Netty. Returns <code>Mono&lt;T&gt;</code> and <code>Flux&lt;T&gt;</code>.</li>
</ul>
<pre>// MVC (blocking)
@GetMapping("/users/{id}")
public User getUser(@PathVariable Long id) {
    return userService.findById(id); // blocks thread
}

// WebFlux (non-blocking)
@GetMapping("/users/{id}")
public Mono&lt;User&gt; getUser(@PathVariable Long id) {
    return userService.findById(id); // returns immediately, data flows later
}</pre>
<div class="key-point">Use WebFlux for: high-concurrency I/O-bound apps (10K+ connections), streaming data, microservice gateways. Use MVC for: CRUD apps, JDBC (blocking), simpler code.</div>`,
      },
      {
        q: 'How does Spring Boot testing work? Explain @SpringBootTest, @WebMvcTest, @DataJpaTest.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Test annotations should match the layer being tested to avoid loading the whole app each time. <code>@SpringBootTest</code> loads the full context for integration tests and is slow, so it is used sparingly. <code>@WebMvcTest</code> loads only the web layer with MockMvc and mocks the service below it, which is fast and focused on controller behavior. <code>@DataJpaTest</code> loads only the repository layer with a test database and rolls back after each test; a good mix is many unit and slice tests with a few full integration tests.</p></div>
<ul>
<li><code>@SpringBootTest</code>: loads full application context. Integration test. Slow.</li>
<li><code>@WebMvcTest(Controller.class)</code>: loads only web layer. Mock services. Fast.</li>
<li><code>@DataJpaTest</code>: loads JPA components + embedded DB. Tests repositories.</li>
</ul>
<pre>// Controller slice test
@WebMvcTest(UserController.class)
class UserControllerTest {
    @Autowired MockMvc mockMvc;
    @MockBean UserService userService;

    @Test
    void shouldReturnUser() throws Exception {
        when(userService.findById(1L)).thenReturn(new User(1L, "John"));

        mockMvc.perform(get("/api/users/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("John"));
    }
}

// Repository test
@DataJpaTest
class UserRepositoryTest {
    @Autowired UserRepository repo;
    @Autowired TestEntityManager em;

    @Test
    void shouldFindByEmail() {
        em.persist(new User("test@mail.com"));
        assertThat(repo.findByEmail("test@mail.com")).isPresent();
    }
}</pre>`,
      },
      {
        q: 'How do @Cacheable, @CacheEvict, and @CachePut work in Spring Boot?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>These are declarative caching annotations that work through AOP once <code>@EnableCaching</code> is set. <code>@Cacheable</code> checks the cache first and runs the method only on a miss, <code>@CachePut</code> always runs and refreshes the entry, and <code>@CacheEvict</code> removes entries and belongs on write methods to avoid stale data. Since they are proxy-based, calling them from inside the same object skips the cache. Because an in-memory cache goes stale across several instances, a shared store like Redis lets all instances use one cache.</p></div>
<p>Spring Boot provides declarative caching with annotations backed by various cache providers (Caffeine, Redis, EhCache).</p>
<pre>@EnableCaching  // Enable in main class or config

@Service
public class ProductService {

    // @Cacheable: check cache first, call method only on cache miss
    @Cacheable(value = "products", key = "#id")
    public Product findById(Long id) {
        log.info("DB query for product {}", id);  // only logged on cache miss
        return productRepo.findById(id).orElseThrow();
    }

    // @CachePut: always executes method, updates cache with result
    @CachePut(value = "products", key = "#product.id")
    public Product update(Product product) {
        return productRepo.save(product);  // always runs, cache updated
    }

    // @CacheEvict: removes entry from cache
    @CacheEvict(value = "products", key = "#id")
    public void delete(Long id) {
        productRepo.deleteById(id);
    }

    // Evict ALL entries in a cache
    @CacheEvict(value = "products", allEntries = true)
    public void clearCache() {}

    // Conditional caching
    @Cacheable(value = "products", key = "#id",
        condition = "#id > 0",           // only cache if condition is true
        unless = "#result.price == 0")   // don't cache if result matches
    public Product findByIdConditional(Long id) { ... }
}

// application.yml with Caffeine:
spring:
  cache:
    type: caffeine
    caffeine:
      spec: maximumSize=500,expireAfterWrite=10m</pre>
<div class="key-point">Cache invalidation is one of the two hard problems in CS. Use <code>@CacheEvict</code> on write operations. For distributed systems, use Redis as the cache provider so all instances share the same cache.</div>`,
      },
      {
        q: 'How does @Scheduled work in Spring Boot? What are cron expressions?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><code>@Scheduled</code>, enabled by <code>@EnableScheduling</code>, offers three modes: <code>fixedRate</code> runs on a fixed clock interval, <code>fixedDelay</code> waits a gap after the previous run finishes, and <code>cron</code> handles calendar schedules. Spring's cron has a leading seconds field, so it uses six fields. The default scheduler is single-threaded, so a long or overlapping task blocks the others, and <code>fixedRate</code> can pile up when a run takes longer than the interval. In a clustered deployment every instance runs the same job, so a tool like ShedLock or Quartz is used to ensure a single run.</p></div>
<pre>@EnableScheduling  // Required in config class

@Component
public class ScheduledTasks {

    // Fixed rate: runs every 5 seconds (measured from start of previous)
    @Scheduled(fixedRate = 5000)
    public void pollExternalApi() {
        log.info("Polling at {}", Instant.now());
    }

    // Fixed delay: 5 seconds after previous execution FINISHES
    @Scheduled(fixedDelay = 5000, initialDelay = 10000)
    public void cleanupTempFiles() {
        log.info("Cleanup started");
    }

    // Cron expression: second minute hour day-of-month month day-of-week
    @Scheduled(cron = "0 0 2 * * MON-FRI")  // 2 AM weekdays
    public void dailyReport() {
        reportService.generateDailyReport();
    }

    // With timezone
    @Scheduled(cron = "0 30 9 * * *", zone = "Asia/Ho_Chi_Minh")
    public void morningSync() { ... }
}

// Common cron patterns:
// "0 * * * * *"       → every minute
// "0 0 * * * *"       → every hour
// "0 0 0 * * *"       → midnight daily
// "0 0 2 * * MON-FRI" → 2AM on weekdays
// "0 0/30 * * * *"    → every 30 minutes</pre>
<div class="key-point"><code>fixedRate</code> can cause overlap if the task takes longer than the interval. Use <code>fixedDelay</code> or add <code>@Async</code> for long-running tasks. In clustered environments, use <strong>ShedLock</strong> to prevent duplicate execution across instances.</div>`,
      },
      {
        q: 'How does @Async work in Spring Boot?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><code>@Async</code> makes a method run on a separate thread and return at once, either void for fire-and-forget or a <code>CompletableFuture</code> when a result is needed. Like <code>@Transactional</code> it is proxy-based, so calling it from inside the same class runs it synchronously. The default executor is unbounded and creates a thread per call, so a bounded <code>ThreadPoolTaskExecutor</code> with a queue and a rejection policy should always be configured. Exceptions from void async methods are lost unless an <code>AsyncUncaughtExceptionHandler</code> is registered.</p></div>
<pre>@EnableAsync  // Required in config

@Service
public class NotificationService {

    // Runs in a separate thread, returns immediately
    @Async
    public void sendEmailAsync(String to, String body) {
        // This runs in a background thread
        emailClient.send(to, body);  // slow I/O, doesn't block caller
    }

    // With return value
    @Async
    public CompletableFuture&lt;Report&gt; generateReport(Long userId) {
        Report report = heavyComputation(userId);
        return CompletableFuture.completedFuture(report);
    }
}

// Caller:
notificationService.sendEmailAsync("user@mail.com", "Welcome!");
// Returns immediately, email sent in background

CompletableFuture&lt;Report&gt; future = reportService.generateReport(123L);
Report report = future.get();  // blocks until ready (or use thenAccept)

// Custom thread pool (RECOMMENDED over default):
@Configuration
@EnableAsync
public class AsyncConfig {
    @Bean(name = "emailExecutor")
    public Executor emailExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("email-");
        executor.initialize();
        return executor;
    }
}

@Async("emailExecutor")  // Use specific pool
public void sendEmail(...) { ... }</pre>
<p><strong>Common pitfalls:</strong></p>
<ul>
<li><strong>Self-invocation</strong>: calling @Async from same class → runs synchronously (proxy bypass!)</li>
<li><strong>No exception handling</strong>: exceptions in void @Async methods are swallowed. Implement <code>AsyncUncaughtExceptionHandler</code>.</li>
<li><strong>Default pool</strong>: uses SimpleAsyncTaskExecutor (creates unlimited threads). Always configure a bounded pool.</li>
</ul>
<div class="key-point">@Async has the same proxy limitation as @Transactional: self-invocation won't work. Also configure <code>RejectedExecutionHandler</code> for when the queue is full.</div>`,
      },
      {
        q: 'What are the major changes in Spring Boot 3 / Spring 6?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The main change is the platform jump to a Java 17 baseline and Jakarta EE 10, which renames packages from <code>javax.*</code> to <code>jakarta.*</code> and is the largest migration task; a tool like OpenRewrite can automate it. Other additions include built-in GraalVM native image support for fast startup and low memory, the Micrometer Observation API for metrics and tracing, RFC 7807 <code>ProblemDetail</code> as the standard error format, and declarative HTTP interface clients. In real migrations the hardest part is often third-party libraries that have not moved to jakarta yet.</p></div>
<ul>
<li><strong>Java 17 baseline</strong>: minimum Java 17 required (was Java 8/11)</li>
<li><strong>Jakarta EE 10</strong>: package names changed from <code>javax.*</code> to <code>jakarta.*</code></li>
<li><strong>Native compilation</strong>: GraalVM native image support built-in (fast startup, low memory)</li>
<li><strong>Observability</strong>: Micrometer Observation API for unified metrics, tracing, logging</li>
<li><strong>Problem Details (RFC 7807)</strong>: standardized error response format</li>
<li><strong>HTTP interfaces</strong>: declarative HTTP clients (like Feign but native Spring)</li>
</ul>
<pre>// Migration: javax → jakarta
// Before (Spring Boot 2):
import javax.persistence.Entity;
import javax.servlet.http.HttpServletRequest;

// After (Spring Boot 3):
import jakarta.persistence.Entity;
import jakarta.servlet.http.HttpServletRequest;

// HTTP Interface Client (new in Spring 6):
@HttpExchange("/api/users")
public interface UserClient {
    @GetExchange("/{id}")
    User getUser(@PathVariable Long id);

    @PostExchange
    User createUser(@RequestBody User user);
}

// Problem Details (RFC 7807):
@ExceptionHandler(UserNotFoundException.class)
ProblemDetail handleNotFound(UserNotFoundException ex) {
    ProblemDetail pd = ProblemDetail.forStatusAndDetail(
        HttpStatus.NOT_FOUND, ex.getMessage());
    pd.setTitle("User Not Found");
    pd.setProperty("userId", ex.getUserId());
    return pd;
}
// Returns: { "type": "...", "title": "User Not Found", "status": 404, ... }</pre>
<div class="key-point">The <code>javax</code> → <code>jakarta</code> rename is the biggest migration effort. Use <a href="https://github.com/openrewrite/rewrite">OpenRewrite</a> to automate the migration. Native compilation with GraalVM reduces startup from seconds to milliseconds.</div>`,
      },
      {
        q: 'What are Spring bean scopes? Is a singleton bean thread-safe?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The default scope is singleton, meaning one shared instance per context; prototype creates a new instance each time it is requested, and request, session, and application are web scopes. A singleton is not thread-safe on its own, because Spring guarantees one instance, not synchronization. Singletons are safe in practice only when they are stateless, with final dependencies and no mutable fields. State that changes per request should use a local variable, an atomic or concurrent structure, or a request-scoped bean, not a field on the singleton.</p></div>
<ul>
<li><strong>singleton</strong> (default): ONE instance per ApplicationContext, shared by all threads.</li>
<li><strong>prototype</strong>: new instance every time the bean is requested (Spring does NOT manage its destruction).</li>
<li><strong>request / session / application</strong>: web scopes — one instance per HTTP request / session / ServletContext.</li>
</ul>
<pre>@Component
@Scope("prototype")
public class ReportGenerator { ... }

// ❌ The classic singleton bug — state in a shared bean:
@Service
public class CounterService {
    private int count = 0;                 // shared by ALL requests!
    public void handle() { count++; }      // race condition under load
}</pre>
<p><strong>Singletons are NOT thread-safe by themselves</strong> — Spring guarantees one instance, not synchronization. They're safe only because well-written beans are <strong>stateless</strong> (final dependencies, no mutable fields). If you need state: method-local variables, <code>AtomicInteger</code>/concurrent structures, ThreadLocal (with cleanup), or a request-scoped bean.</p>
<pre>// Gotcha: prototype injected INTO a singleton is created once, not per use!
@Autowired ReportGenerator gen;            // same instance forever
// Fix: ObjectProvider — fetch a fresh one per call
@Autowired ObjectProvider&lt;ReportGenerator&gt; provider;
provider.getObject().generate();</pre>
<div class="key-point">Interview one-two punch: "how many instances?" (one) then "so is it thread-safe?" (no — statelessness makes it safe, not Spring). The prototype-in-singleton gotcha is the senior follow-up.</div>`,
      },
      {
        q: 'How does Spring resolve circular dependencies? Why does constructor injection break them?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Spring can resolve a cycle for field or setter injection using its three-level cache, creating a raw bean, exposing an early reference, and finishing it later. Constructor injection cannot be resolved this way, because neither bean can be built without a finished copy of the other, so startup fails with <code>BeanCurrentlyInCreationException</code>; since Boot 2.6 circular references are rejected by default. This failure is useful, because a cycle usually points to a design problem. The better fix is to refactor, such as moving shared logic into a third bean or using an application event, rather than enabling workarounds.</p></div>
<p><strong>Circular dependency</strong>: A needs B, B needs A.</p>
<pre>@Service class OrderService  { @Autowired CustomerService customers; }
@Service class CustomerService { @Autowired OrderService orders; }   // cycle!</pre>
<ul>
<li><strong>Field/setter injection</strong>: Spring can break the cycle with its <strong>three-level cache</strong> — it creates the raw A instance first, exposes an early reference, then injects B (which receives the early A). Works, but hides a design problem.</li>
<li><strong>Constructor injection</strong>: A can't be instantiated at all without a finished B → <code>BeanCurrentlyInCreationException</code> at startup. Spring Boot 2.6+ rejects circular references <strong>by default</strong> even for field injection.</li>
</ul>
<pre># Escape hatches (band-aids, not fixes):
spring.main.allow-circular-references=true
@Lazy CustomerService customers;    // injects a proxy, resolved on first use</pre>
<p><strong>Real fixes</strong> — a cycle means the design wants restructuring:</p>
<ul>
<li>Extract the shared logic into a third bean C that both depend on.</li>
<li>Invert one direction with <strong>events</strong> (<code>ApplicationEventPublisher</code>) instead of a direct call.</li>
<li>Merge the two if they always change together.</li>
</ul>
<div class="key-point">Senior answer: "constructor injection surfaces the cycle at startup — that's a feature. I'd refactor (extract/events), not enable allow-circular-references."</div>`,
      },
      {
        q: 'Constructor vs field vs setter injection — why is field injection discouraged?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Constructor injection is the recommended default. It allows dependencies to be <code>final</code> so the bean is immutable and never half-built, makes the class easy to unit test with plain <code>new</code>, and fails at startup when something is missing. Field injection is discouraged because the field cannot be final, testing needs reflection or the container, and it hides design problems, since a constructor with many parameters clearly signals a class that is too large. Setter injection is kept for the rare case of genuinely optional dependencies.</p></div>
<pre>// ❌ Field injection — convenient but problematic
@Service
public class OrderService {
    @Autowired private PaymentClient payment;      // hidden dependency
}

// ✅ Constructor injection — the recommended default
@Service
public class OrderService {
    private final PaymentClient payment;           // final = immutable, never null
    public OrderService(PaymentClient payment) {   // @Autowired optional (1 ctor)
        this.payment = payment;
    }
}
// Lombok: @RequiredArgsConstructor generates that constructor</pre>
<p><strong>Why field injection is discouraged</strong>:</p>
<ul>
<li><strong>Untestable without Spring</strong>: <code>new OrderService()</code> leaves the field null — you need reflection or the container just to unit test.</li>
<li><strong>No immutability</strong>: field can't be <code>final</code>; the bean is mutable and can exist half-initialized.</li>
<li><strong>Hides design smells</strong>: a constructor with 8 parameters screams "split this class"; 8 @Autowired fields whisper it.</li>
<li><strong>Failure timing</strong>: constructor injection fails fast at startup; field injection can NPE at first use.</li>
</ul>
<p><strong>Setter injection</strong>: only for genuinely optional or reconfigurable dependencies (rare).</p>
<div class="key-point">Rule: constructor for mandatory dependencies, setter for optional, field injection only in tests (<code>@MockBean</code>/<code>@Autowired</code> in test classes is fine).</div>`,
      },
      {
        q: 'Filter vs Interceptor vs AOP — where does each run and when do you use which?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>These are three levels chosen by how much context is needed. A servlet Filter runs at the container level before Spring sees the request and works on raw request and response data, which fits CORS, compression, and Spring Security. A <code>HandlerInterceptor</code> runs inside DispatcherServlet and knows which controller will handle the request, which fits rate limiting, locale, and per-controller auditing. AOP wraps the actual bean method call and sees method arguments and return values, which fits <code>@Transactional</code>, <code>@Cacheable</code>, and timing of service methods.</p></div>
<pre>Request
  → Servlet Filter (jakarta.servlet)        — before Spring, sees raw request
    → DispatcherServlet
      → HandlerInterceptor.preHandle()      — knows WHICH controller will run
        → AOP @Around advice                — wraps the bean METHOD call
          → @Controller method
        ← AOP (after)
      ← Interceptor.postHandle / afterCompletion
    ← DispatcherServlet renders response
  ← Filter (response passes back through)</pre>
<table><tr><th></th><th>Filter</th><th>Interceptor</th><th>AOP</th></tr>
<tr><td>Level</td><td>Servlet container</td><td>Spring MVC</td><td>Any Spring bean</td></tr>
<tr><td>Sees</td><td>Request/response bytes</td><td>Handler + ModelAndView</td><td>Method args + return value</td></tr>
<tr><td>Typical use</td><td>Auth (Spring Security), CORS, compression</td><td>Rate limiting, locale, controller audit</td><td>@Transactional, @Cacheable, retries, timing service methods</td></tr></table>
<pre>// Interceptor example: measure controller time
public class TimingInterceptor implements HandlerInterceptor {
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) {
        req.setAttribute("t0", System.nanoTime());
        return true;                                   // false = abort request
    }
    public void afterCompletion(HttpServletRequest req, HttpServletResponse res,
                                Object handler, Exception ex) {
        long ms = (System.nanoTime() - (Long) req.getAttribute("t0")) / 1_000_000;
        log.info("{} took {}ms", req.getRequestURI(), ms);
    }
}
// register via WebMvcConfigurer.addInterceptors(registry)</pre>
<div class="key-point">Decision rule: not-Spring-specific / security / raw bytes → Filter. Needs to know the controller → Interceptor. Business/service-layer concern on any bean → AOP. Bonus point: Spring Security is "just" a chain of Filters.</div>`,
      },
      {
        q: 'How does validation work in Spring Boot? @Valid vs @Validated, custom validators.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Validation is applied at the edge by putting Jakarta constraints such as <code>@NotBlank</code>, <code>@Email</code>, and <code>@Min</code> on the DTO so bad input fails before the business layer. <code>@Valid</code> on a controller parameter triggers it and cascades into nested objects, producing a <code>MethodArgumentNotValidException</code> that can become a 400 response with field details. <code>@Valid</code> is the standard Jakarta annotation for cascading, while <code>@Validated</code> is Spring's and adds validation groups and can validate method parameters on service beans. Rules the built-in constraints cannot express use a custom annotation with a <code>ConstraintValidator</code>.</p></div>
<pre>// 1. Constraints on the DTO (Jakarta Bean Validation)
public record CreateUserRequest(
    @NotBlank @Size(max = 50)       String name,
    @Email @NotNull                 String email,
    @Min(18) @Max(120)              int age,
    @Valid @NotNull                 AddressDto address   // cascade into nested object
) {}

// 2. Trigger it in the controller
@PostMapping("/users")
public UserDto create(@Valid @RequestBody CreateUserRequest req) { ... }
// invalid → MethodArgumentNotValidException → HTTP 400

// 3. Return field-level errors
@ExceptionHandler(MethodArgumentNotValidException.class)
ProblemDetail onValidation(MethodArgumentNotValidException ex) {
    var pd = ProblemDetail.forStatus(400);
    pd.setProperty("errors", ex.getFieldErrors().stream()
        .map(f -> f.getField() + ": " + f.getDefaultMessage()).toList());
    return pd;
}

// 4. Custom rule = annotation + validator
@Target(ElementType.FIELD) @Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = PhoneValidator.class)
public @interface Phone { String message() default "invalid phone"; ... }

public class PhoneValidator implements ConstraintValidator&lt;Phone, String&gt; {
    public boolean isValid(String v, ConstraintValidatorContext c) {
        return v == null || v.matches("\\\\+?[0-9]{9,15}");   // null is @NotNull's job
    }
}</pre>
<ul>
<li><strong>@Valid</strong> (Jakarta): cascades validation; use on controller params and nested fields.</li>
<li><strong>@Validated</strong> (Spring): adds validation <strong>groups</strong>; put it on a @Service class to validate method parameters outside controllers (throws ConstraintViolationException instead).</li>
</ul>
<div class="key-point">Validate at the edge (DTO), not in business logic. Senior detail: each validator checks ONE thing and returns true for null — that keeps constraints composable with @NotNull.</div>`,
      },
      {
        q: 'What are Spring application events? When do you use @TransactionalEventListener?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Application events decouple side effects from the main flow, since the publisher fires an event without knowing who listens, which can also break a circular dependency between services. A plain <code>@EventListener</code> runs inside the transaction, so sending an email there could send a confirmation for an order that later rolls back. <code>@TransactionalEventListener</code> with <code>AFTER_COMMIT</code> runs only after a successful commit, which avoids that problem. These events are in-JVM and at-most-once and are lost on a crash, so real delivery guarantees need the outbox pattern with a message broker.</p></div>
<p>Events decouple side effects from the main flow: the publisher doesn't know (or wait for) the listeners.</p>
<pre>// 1. Event (plain record) + publisher
public record OrderPlacedEvent(Long orderId, String email) {}

@Service
public class OrderService {
    private final ApplicationEventPublisher events;
    @Transactional
    public void placeOrder(Order o) {
        orderRepo.save(o);
        events.publishEvent(new OrderPlacedEvent(o.getId(), o.getEmail()));
    }
}

// 2. Listener — OrderService has no dependency on mailing at all
@Component
public class WelcomeMailListener {
    @EventListener                                    // synchronous, inside same TX
    void on(OrderPlacedEvent e) { ... }

    @Async @EventListener                             // background thread (@EnableAsync)
    void onAsync(OrderPlacedEvent e) { ... }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    void onCommitted(OrderPlacedEvent e) {            // ← the important one
        mailService.sendConfirmation(e.email());
    }
}</pre>
<p><strong>Why AFTER_COMMIT matters</strong>: a plain @EventListener runs <em>inside</em> the transaction — send the email there and a later rollback means the customer got a confirmation for an order that doesn't exist. <code>@TransactionalEventListener</code> fires only after a successful commit.</p>
<ul>
<li>Gotcha: AFTER_COMMIT listeners run with the original TX closed — DB writes inside them need <code>REQUIRES_NEW</code> (or go async).</li>
<li>Need delivery guarantees across restarts? That's the <strong>outbox pattern</strong> / a message broker — in-JVM events are lost on crash.</li>
</ul>
<div class="key-point">Events also break circular dependencies between services. "In-JVM events are at-most-once — for reliability I'd use an outbox + broker" is the senior-level boundary to state.</div>`,
      },
      {
        q: 'RestTemplate vs WebClient vs RestClient vs FeignClient — which HTTP client to use?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>For new blocking code the modern default is <code>RestClient</code>, added in Boot 3.2, which has a fluent API without pulling in the reactive stack. <code>RestTemplate</code> is in maintenance mode and should not be used for new code, and <code>WebClient</code> is best only for reactive or streaming work. <code>FeignClient</code> is the declarative interface style and fits platforms already using Spring Cloud, since it includes service discovery and load balancing. With any client, explicit connect and read timeouts plus retries and a circuit breaker (for example Resilience4j) help stop one slow dependency from taking down the system.</p></div>
<table><tr><th></th><th>RestTemplate</th><th>WebClient</th><th>RestClient (Boot 3.2+)</th><th>OpenFeign</th></tr>
<tr><td>Style</td><td>Blocking, template methods</td><td>Reactive (Mono/Flux)</td><td>Blocking, fluent API</td><td>Declarative interface</td></tr>
<tr><td>Status</td><td>Maintenance mode</td><td>Active</td><td>Active — the modern default</td><td>Active (Spring Cloud)</td></tr>
<tr><td>Needs WebFlux dep</td><td>No</td><td>Yes</td><td>No</td><td>No</td></tr></table>
<pre>// RestClient — modern blocking client, fluent like WebClient
RestClient client = RestClient.builder().baseUrl("https://api.example.com").build();
UserDto user = client.get()
    .uri("/users/{id}", id)
    .retrieve()
    .onStatus(s -> s.value() == 404, (req, res) -> { throw new UserNotFound(id); })
    .body(UserDto.class);

// FeignClient — declarative: interface + annotation, no implementation
@FeignClient(name = "user-service")            // + service discovery, load balancing
interface UserApi {
    @GetMapping("/users/{id}") UserDto get(@PathVariable Long id);
}</pre>
<ul>
<li><strong>New blocking code</strong>: RestClient (or Feign in a Spring Cloud microservice fleet).</li>
<li><strong>Reactive stack / streaming / high fan-out</strong>: WebClient.</li>
<li><strong>Virtual threads (Java 21)</strong> make blocking clients scale for I/O fan-out — you rarely need reactive just for concurrency anymore.</li>
<li>Whatever the client: set <strong>connect/read timeouts</strong> explicitly and add retries + circuit breaker (Resilience4j) at the edge.</li>
</ul>
<div class="key-point">"RestTemplate is in maintenance mode; I'd use RestClient for blocking calls, WebClient only when we're actually reactive, and Feign when the platform already runs Spring Cloud" — a complete senior answer in one sentence.</div>`,
      },
      {
        q: 'Why does @Transactional silently do nothing on self-invocation (this.method()) or on private/final methods?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The transaction lives on the proxy, not on the object itself. Spring wraps the bean in a proxy that opens and commits the transaction before calling the real target, so a call through <code>this.method()</code> uses the raw target and skips the transaction with no error. Private methods cannot be overridden and final methods cannot be subclassed by CGLIB, so both are ignored for the same reason. The clean fix is to move the method to a separate bean so the call crosses the proxy; the same rule explains <code>@Async</code>, <code>@Cacheable</code>, and <code>@Retryable</code>.</p></div>
<p>Because <code>@Transactional</code> is implemented by a <strong>proxy</strong>, not by the method itself. Spring wraps your bean in a proxy object; callers get the proxy injected, and the proxy opens/commits the transaction <em>around</em> the call before delegating to your real object (the "target").</p>
<pre>@Service
public class ReportService {

    public void generateAll() {        // called from outside → goes through proxy
        for (Long id : ids) {
            this.generateOne(id);      // ❌ 'this' is the TARGET, not the proxy!
        }                              //    → @Transactional below is IGNORED
    }

    @Transactional
    public void generateOne(Long id) { ... }   // runs with NO transaction

    @Transactional
    private void internal() { ... }    // ❌ private: proxy can't override → ignored
    @Transactional
    public final void locked() { ... } // ❌ final: CGLIB can't override → ignored
}</pre>
<p><strong>Why exactly</strong>: the proxy is a subclass (CGLIB) or interface implementation (JDK) that overrides your public methods to add TX logic. <code>this.generateOne()</code> is a plain Java call on the raw object — the proxy never sees it. Private methods can't be overridden at all; final methods can't be overridden by CGLIB. No error is raised — it just silently runs without a transaction, which is why this bug survives code review.</p>
<p><strong>Fixes, in order of preference</strong>:</p>
<ul>
<li><strong>Move the method to another bean</strong> — the clean fix; the call now crosses a proxy boundary.</li>
<li><strong>Programmatic TX</strong> with <code>TransactionTemplate</code>: <code>txTemplate.executeWithoutResult(s -> generateOne(id));</code> — no proxy needed.</li>
<li><strong>Self-injection</strong>: inject your own proxy (<code>@Autowired @Lazy ReportService self;</code>) and call <code>self.generateOne(id)</code> — works, but a design smell.</li>
<li>AspectJ weaving (<code>mode = AdviceMode.ASPECTJ</code>) removes the limitation entirely, at the cost of build complexity — mention it, rarely use it.</li>
</ul>
<div class="key-point">Every proxy-based annotation shares this trap — @Transactional, @Async, @Cacheable, @Retryable. "The annotation only works when the call goes through the proxy" is the one sentence that answers a whole family of interview questions.</div>`,
      },
      {
        q: 'A prototype-scoped bean is injected into a singleton. How many instances are created, and how do you get true prototype behavior?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Only one instance is created. Scope is resolved when the bean is injected, not when it is used, so the singleton asks for the prototype once at startup, keeps that reference, and never asks again, which loses the new-instance behavior and lets state leak. The fix is to inject a way to get a fresh instance instead of the instance itself, such as an <code>ObjectProvider</code> with <code>getObject()</code>, a <code>@Lookup</code> method, or a scoped proxy, which is the same mechanism that makes request-scoped and session-scoped beans work inside singletons. Note also that Spring does not manage a prototype's destruction, so <code>@PreDestroy</code> never runs on one.</p></div>
<p><strong>One.</strong> Injection happens exactly once — when the singleton is created at startup. The container asks for a prototype at that moment, gets a fresh instance, stores the reference in the singleton's field... and never asks again. The "new instance per use" semantics are silently lost.</p>
<pre>@Component @Scope("prototype")
public class PdfBuilder { private final StringBuilder buf = new StringBuilder(); }

@Service                                  // singleton
public class InvoiceService {
    @Autowired private PdfBuilder builder;     // ❌ ONE builder, shared forever
    public byte[] render(Invoice i) {
        return builder.append(i).build();      // state leaks across requests!
    }
}</pre>
<p><strong>Fixes</strong> — all inject "a way to get a fresh instance" instead of the instance:</p>
<pre>// 1. ObjectProvider — explicit lookup, the modern idiomatic choice
@Autowired private ObjectProvider&lt;PdfBuilder&gt; builders;
public byte[] render(Invoice i) { return builders.getObject().append(i).build(); }

// 2. @Lookup — Spring overrides this method at runtime to return a fresh bean
@Lookup
protected PdfBuilder createBuilder() { return null; }  // body is ignored

// 3. Scoped proxy — injected object IS a proxy; every method call
//    is routed to a brand-new (or scope-resolved) target instance
@Component
@Scope(value = "prototype", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class PdfBuilder { ... }</pre>
<ul>
<li>Scoped proxies are also how <code>request</code>/<code>session</code>-scoped beans get injected into singletons — same problem, same mechanism.</li>
<li>Extra trap: Spring does <strong>not</strong> manage a prototype's destruction — <code>@PreDestroy</code> on a prototype never fires; you own its cleanup.</li>
</ul>
<div class="key-point">Scope is resolved at injection time, not at call time — inject a provider (or a scoped proxy), not the prototype itself. Bonus follow-up interviewers love: @PreDestroy is never called on prototypes.</div>`,
      },
      {
        q: 'Output prediction: a bean has Aware interfaces, a BeanPostProcessor, @PostConstruct, InitializingBean, init-method, and @PreDestroy. What is the exact order printed?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The order is constructor, dependency injection, the Aware callbacks, <code>BeanPostProcessor.postProcessBeforeInitialization</code>, <code>@PostConstruct</code>, <code>afterPropertiesSet()</code>, the custom init-method, then <code>postProcessAfterInitialization</code>; at shutdown it is <code>@PreDestroy</code>, <code>destroy()</code>, then the custom destroy-method. The key point is that AOP proxies for <code>@Transactional</code> and <code>@Async</code> are created in <code>postProcessAfterInitialization</code>, the last init step, so earlier steps including <code>@PostConstruct</code> see the raw, un-proxied bean. That is why calling a <code>@Transactional</code> method from <code>@PostConstruct</code> runs with no transaction. The constructor running before injection is also why an <code>@Autowired</code> field is null inside it.</p></div>
<pre>@Component
public class LifecycleBean implements BeanNameAware, InitializingBean, DisposableBean {
    public LifecycleBean()                { System.out.println("1. constructor"); }
    @Autowired void inject(Dep d)         { System.out.println("2. dependency injection"); }
    public void setBeanName(String n)     { System.out.println("3. BeanNameAware"); }
    @PostConstruct void post()            { System.out.println("5. @PostConstruct"); }
    public void afterPropertiesSet()      { System.out.println("6. afterPropertiesSet"); }
    public void customInit()              { System.out.println("7. init-method"); }   // @Bean(initMethod=...)
    @PreDestroy void preDestroy()         { System.out.println("9. @PreDestroy"); }
    public void destroy()                 { System.out.println("10. destroy()"); }
}

@Component
public class MyBpp implements BeanPostProcessor {
    public Object postProcessBeforeInitialization(Object b, String n) {
        System.out.println("4. BPP.before"); return b; }
    public Object postProcessAfterInitialization(Object b, String n)  {
        System.out.println("8. BPP.after");  return b; }   // proxies created HERE
}</pre>
<p><strong>Exact order</strong>: constructor → dependency injection → Aware callbacks (BeanNameAware, BeanFactoryAware, ApplicationContextAware...) → <code>BeanPostProcessor.postProcessBeforeInitialization</code> → <code>@PostConstruct</code> → <code>afterPropertiesSet()</code> → custom init-method → <code>BeanPostProcessor.postProcessAfterInitialization</code> → bean in use → on shutdown: <code>@PreDestroy</code> → <code>destroy()</code> → custom destroy-method.</p>
<p><strong>Why seniors must know this</strong>:</p>
<ul>
<li>AOP proxies (@Transactional, @Async) are created in <strong>postProcessAfterInitialization</strong> — so calling an annotated method from <code>@PostConstruct</code> may run on the raw, un-proxied bean.</li>
<li><code>@PostConstruct</code> is itself implemented by a BeanPostProcessor (<code>CommonAnnotationBeanPostProcessor</code>) — annotations on a BeanPostProcessor bean itself may not work.</li>
<li>Constructor runs <strong>before</strong> field injection — touching an @Autowired field in the constructor gives null (see the "@Autowired is null" classic).</li>
</ul>
<div class="key-point">Memorize the trio at the middle: BPP.before → @PostConstruct → afterPropertiesSet → init-method → BPP.after. The killer insight is that proxies appear only at BPP.after — everything earlier sees the raw object.</div>`,
      },
      {
        q: 'Calling one @Bean method from another inside a @Configuration class — how many instances are created? What does proxyBeanMethods = false change?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>In the default full <code>@Configuration</code> mode, only one instance is created, even though the code looks like calling <code>new</code> twice. Spring subclasses the config class with CGLIB and overrides each <code>@Bean</code> method to check the container first, so a repeated call returns the existing singleton, which is also why <code>@Bean</code> methods cannot be private or final. Setting <code>proxyBeanMethods = false</code>, the lite mode, removes the subclass, so those inter-bean calls become plain Java calls that create duplicate, unmanaged objects such as a second connection pool. Lite mode is used for faster startup and native images, and the safe habit is to pass dependencies as <code>@Bean</code> method parameters so the mode never matters.</p></div>
<pre>@Configuration                       // "full" mode (default)
public class AppConfig {
    @Bean
    public ObjectMapper objectMapper() { return new ObjectMapper(); }

    @Bean
    public UserClient userClient() {
        return new UserClient(objectMapper());   // looks like a plain 'new'...
    }
    @Bean
    public AuditClient auditClient() {
        return new AuditClient(objectMapper());  // ...called twice!
    }
}</pre>
<p><strong>In full mode: ONE instance.</strong> Spring subclasses the config class with <strong>CGLIB</strong>; the generated subclass overrides every <code>@Bean</code> method so that a call first checks the container — if the bean already exists, the existing singleton is returned instead of executing your method body again. That's why @Bean methods can't be <code>private</code> or <code>final</code>.</p>
<pre>@Configuration(proxyBeanMethods = false)   // "lite" mode
public class AppConfig {
    @Bean ObjectMapper objectMapper() { return new ObjectMapper(); }
    @Bean UserClient userClient() {
        return new UserClient(objectMapper());  // ❌ now a REAL call → 2nd instance,
    }                                           //    unmanaged, no proxies, no @PostConstruct
    // ✅ lite-mode style: declare dependencies as parameters
    @Bean AuditClient auditClient(ObjectMapper mapper) {   // injected by container
        return new AuditClient(mapper);          // same singleton, no CGLIB needed
    }
}</pre>
<ul>
<li><strong>Why lite mode exists</strong>: no CGLIB subclass → faster startup, less memory, and required for GraalVM native images. All Spring Boot auto-configurations use <code>proxyBeanMethods = false</code>.</li>
<li><strong>Failure mode</strong>: switching to lite mode without converting direct calls to method parameters silently creates duplicate, container-unmanaged objects — connection pools and schedulers created twice are the classic production symptom.</li>
<li>Same trap applies to <code>@Component</code> classes with <code>@Bean</code> methods — those are always lite mode.</li>
</ul>
<div class="key-point">Full mode: CGLIB intercepts @Bean calls to preserve singleton semantics. Lite mode: inter-bean calls are plain Java — always pass dependencies as @Bean method parameters so the mode doesn't matter.</div>`,
      },
      {
        q: '"My @Autowired field is null" — what are the causes and how do you debug it?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Spring only injects into objects it created, so a null <code>@Autowired</code> field usually means the object was not built by the container. The most common cause is using <code>new</code> to create a bean instead of injecting it. Other causes include a <code>static</code> field, using the field in the constructor before injection runs, the class not being a bean or sitting outside the scanned packages, or the object being created by another framework such as a JPA entity or a deserialized DTO. Constructor injection helps because it turns these silent nulls into a clear failure at startup.</p></div>
<p>Spring only injects into objects <strong>it created</strong>. A null @Autowired field almost always means the object holding the field never went through the container.</p>
<pre>// Cause 1 — the #1 culprit: 'new' instead of injection
UserService svc = new UserService();   // ❌ Spring never saw this object
svc.process();                          // → NPE on svc's @Autowired fields
// Fix: inject UserService itself; never 'new' a bean.

// Cause 2 — static fields: injection targets instances, not classes
@Autowired
private static MailSender sender;      // ❌ stays null (silently!)
// Fix: don't. If forced (legacy), use a non-static setter that assigns the static.

// Cause 3 — using the field in the constructor (runs BEFORE injection)
@Service
public class CacheService {
    @Autowired private UserRepo repo;
    public CacheService() {
        repo.findAll();                // ❌ NPE — fields injected after constructor
    }
    @PostConstruct
    void init() { repo.findAll(); }    // ✅ runs after injection
    // ✅ best: constructor injection makes this bug impossible
}

// Cause 4 — the class isn't a bean at all
// missing @Component/@Service, or it lives OUTSIDE the
// @SpringBootApplication package tree → never scanned, and whoever
// 'new's it gets no injection.

// Cause 5 — objects created by other frameworks (JPA entities,
// Jackson-deserialized DTOs, JUnit test classes without the Spring
// runner, plain servlet Filters) are not container-managed.</pre>
<p><strong>Debugging checklist</strong>: Who instantiated this object — me or Spring? Is the class annotated and inside the scanned packages (<code>/actuator/beans</code> or a startup breakpoint confirms)? Is the field static? Am I touching it before construction finished?</p>
<div class="key-point">Constructor injection with final fields turns every one of these silent nulls into an immediate, loud compile-time or startup failure — which is the real reason seniors insist on it.</div>`,
      },
    ],
  },

  // ───────────────────────── 9. HTML ─────────────────────────
];
