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
        a: `<ul>
<li><strong>Spring Framework</strong>: comprehensive Java framework (IoC, AOP, MVC, Data, Security). Requires manual configuration (XML or Java Config).</li>
<li><strong>Spring Boot</strong>: opinionated layer on top of Spring that provides <strong>auto-configuration</strong>, embedded server, starter dependencies, and production-ready features.</li>
</ul>
<pre>// Spring: need web.xml, DispatcherServlet config, component scan...
// Spring Boot: just this
@SpringBootApplication
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}</pre>
<div class="key-point">Spring Boot eliminates boilerplate. You focus on business logic, Boot handles wiring.</div>`,
      },
      {
        q: 'Explain @SpringBootApplication annotation. What does it combine?',
        difficulty: 'medium',
        a: `<p><code>@SpringBootApplication</code> is a convenience annotation combining three:</p>
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
        a: `<p>Starters are curated sets of dependencies for a specific purpose. One dependency brings everything needed.</p>
<ul>
<li><code>spring-boot-starter-web</code> – REST APIs (Tomcat, Jackson, Spring MVC)</li>
<li><code>spring-boot-starter-data-jpa</code> – JPA + Hibernate + HikariCP</li>
<li><code>spring-boot-starter-security</code> – authentication, authorization</li>
<li><code>spring-boot-starter-test</code> – JUnit 5, Mockito, AssertJ, MockMvc</li>
<li><code>spring-boot-starter-validation</code> – Bean Validation (Hibernate Validator)</li>
<li><code>spring-boot-starter-actuator</code> – health checks, metrics, monitoring</li>
</ul>`,
      },
      {
        q: 'How does Spring Boot auto-configuration work internally?',
        difficulty: 'hard',
        a: `<ol>
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
        a: `<p>Profiles allow different configurations for different environments (dev, test, prod).</p>
<pre># application-dev.yml
spring:
  datasource:
    url: jdbc:h2:mem:testdb

# application-prod.yml
spring:
  datasource:
    url: jdbc:postgresql://prod-db:5432/myapp</pre>
<p><strong>Activate</strong>:</p>
<ul>
<li>Property: <code>spring.profiles.active=dev</code></li>
<li>CLI: <code>java -jar app.jar --spring.profiles.active=prod</code></li>
<li>Env: <code>SPRING_PROFILES_ACTIVE=prod</code></li>
</ul>
<pre>@Profile("dev")
@Bean
public DataSource devDataSource() { ... }</pre>`,
      },
      {
        q: 'What is Spring Boot Actuator? What endpoints does it expose?',
        difficulty: 'medium',
        a: `<p>Actuator provides production-ready features for monitoring and managing your application.</p>
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
        a: `<p>Use <code>@ControllerAdvice</code> + <code>@ExceptionHandler</code> for global exception handling:</p>
<pre>@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity&lt;ErrorResponse&gt; handleNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(404, ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity&lt;ErrorResponse&gt; handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest().body(new ErrorResponse(400, msg));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity&lt;ErrorResponse&gt; handleGeneral(Exception ex) {
        return ResponseEntity.status(500).body(new ErrorResponse(500, "Internal error"));
    }
}</pre>`,
      },
      {
        q: 'What are @RequestMapping, @GetMapping, @PostMapping, @PathVariable, @RequestParam, @RequestBody?',
        difficulty: 'easy',
        a: `<pre>@RestController
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
        a: `<ol>
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
        a: `<ul>
<li><strong>@Component</strong>: class-level annotation. Spring auto-detects via component scanning. You own the class.</li>
<li><strong>@Bean</strong>: method-level annotation in <code>@Configuration</code> class. Used for third-party classes you can't annotate. Full control over instantiation.</li>
</ul>
<pre>// @Component: you own the class
@Component
public class MyService { }

// @Bean: third-party class, or custom init logic
@Configuration
public class AppConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplateBuilder()
            .setConnectTimeout(Duration.ofSeconds(5))
            .build();
    }
}</pre>`,
      },
      {
        q: 'Explain Spring Boot configuration properties binding with @ConfigurationProperties.',
        difficulty: 'medium',
        a: `<pre># application.yml
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
        a: `<p>Bean lifecycle hooks:</p>
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
        a: `<p><strong>AOP (Aspect-Oriented Programming)</strong>: separates cross-cutting concerns from business logic.</p>
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
        a: `<pre>@Service
public class OrderService {
    @Transactional(
        propagation = Propagation.REQUIRED,
        isolation = Isolation.READ_COMMITTED,
        rollbackFor = Exception.class,
        timeout = 30
    )
    public void placeOrder(Order order) {
        orderRepo.save(order);
        paymentService.charge(order);  // if fails → entire TX rolls back
        inventoryService.deduct(order);
    }
}</pre>
<p><strong>Common pitfalls</strong>:</p>
<ul>
<li><strong>Self-invocation</strong>: calling <code>@Transactional</code> method from same class → proxy bypassed → no TX!</li>
<li><strong>Checked exceptions</strong>: by default only rolls back on unchecked exceptions. Use <code>rollbackFor = Exception.class</code>.</li>
<li><strong>Long transactions</strong>: holding DB locks too long → timeout/deadlock.</li>
<li><strong>Private methods</strong>: <code>@Transactional</code> on private methods has no effect (proxy can't intercept).</li>
<li><strong>Not on interface</strong>: if using JDK proxy, annotation must be on interface method.</li>
</ul>`,
      },
      {
        q: 'How to implement pagination and sorting in Spring Boot?',
        difficulty: 'medium',
        a: `<pre>// Repository
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
        a: `<ul>
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
        a: `<ul>
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
        a: `<p>Spring Boot provides declarative caching with annotations backed by various cache providers (Caffeine, Redis, EhCache).</p>
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
        a: `<pre>@EnableScheduling  // Required in config class

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
        a: `<pre>@EnableAsync  // Required in config

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
        a: `<ul>
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
        a: `<ul>
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
        a: `<p><strong>Circular dependency</strong>: A needs B, B needs A.</p>
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
        a: `<pre>// ❌ Field injection — convenient but problematic
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
        a: `<pre>Request
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
        a: `<pre>// 1. Constraints on the DTO (Jakarta Bean Validation)
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
        a: `<p>Events decouple side effects from the main flow: the publisher doesn't know (or wait for) the listeners.</p>
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
        a: `<table><tr><th></th><th>RestTemplate</th><th>WebClient</th><th>RestClient (Boot 3.2+)</th><th>OpenFeign</th></tr>
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
    ],
  },

  // ───────────────────────── 9. HTML ─────────────────────────
];
