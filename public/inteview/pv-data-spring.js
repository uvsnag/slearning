// Interview data: springboot
// Auto-generated from pv.html
(function () {
  (window.__pvTopics = window.__pvTopics || []).push(
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
          ],
        },

        // ───────────────────────── 9. HTML ─────────────────────────
  );
})();
