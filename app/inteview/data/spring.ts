// Interview data: springboot
// Auto-generated from pv.html
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
  {
    id: 'springboot',
    name: 'Spring Boot',
    icon: '🍃',
    questions: [
      // ──── 1. SPRING & SPRING BOOT FUNDAMENTALS ────
      {
        q: 'What is the Spring Framework? Explain its architecture and all the main modules (and where Spring Boot fits).',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Spring is a modular application framework whose foundation is an <strong>IoC container</strong>: you declare objects as beans, the container creates them, injects their dependencies, and manages their lifecycle, and everything else in Spring is a module built on that foundation. The core layer is Core/Beans/Context/SpEL, on top of which sit AOP for cross-cutting concerns, the data access layer (JDBC, ORM, and the transaction manager), and the web layer (Spring MVC for servlet-based apps and WebFlux for reactive ones), plus a testing module. Around the framework are separate projects — Spring Boot, Spring Data, Spring Security, Spring Cloud, Spring Batch, Spring Integration — which are not part of the core framework but are built on it. <strong>Spring Boot</strong> is the opinionated layer on top: it adds auto-configuration, starter dependencies, an embedded server and production features, so you configure almost nothing to get a running application.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Spring là một framework ứng dụng theo module, mà nền móng là <strong>IoC container</strong>: bạn khai báo các object dưới dạng bean, container sẽ tạo chúng, tiêm phụ thuộc và quản lý vòng đời, còn mọi thứ khác trong Spring đều là module dựng trên nền đó. Tầng lõi là Core/Beans/Context/SpEL, bên trên là AOP cho các mối quan tâm xuyên suốt, tầng truy cập dữ liệu (JDBC, ORM và transaction manager), và tầng web (Spring MVC cho ứng dụng servlet, WebFlux cho ứng dụng reactive), cộng thêm module testing. Bao quanh framework là các project riêng — Spring Boot, Spring Data, Spring Security, Spring Cloud, Spring Batch, Spring Integration — không thuộc core framework nhưng được xây trên nó. <strong>Spring Boot</strong> là lớp có quan điểm đặt lên trên: nó bổ sung auto-configuration, các starter dependency, server nhúng và các tính năng vận hành, nhờ vậy bạn gần như không phải cấu hình gì mà vẫn có một ứng dụng chạy được.</p></details>
<p><strong>1. The one idea everything is built on: Inversion of Control</strong></p>
<pre>Without Spring: the object creates its own dependencies (tight coupling, hard to test)
    class OrderService { private final Repo repo = new JdbcRepo(); }

With Spring:   you declare WHAT you need, the container decides HOW to provide it
    @Service class OrderService {
        private final Repo repo;
        OrderService(Repo repo) { this.repo = repo; }   // injected by the container
    }

The container = ApplicationContext. It reads metadata (annotations / @Bean methods /
XML), instantiates beans, resolves the dependency graph, applies proxies (AOP,
@Transactional), and manages lifecycle callbacks and shutdown.</pre>
<p><strong>2. Architecture layers of the core framework (spring-framework)</strong></p>
<pre>┌──────────────────────────────────────────────────────────────┐
│ Test          spring-test  (MockMvc, @SpringBootTest support) │
├──────────────────────────────────────────────────────────────┤
│ Web           spring-web · spring-webmvc · spring-webflux     │
├───────────────────────────┬──────────────────────────────────┤
│ Data Access               │ AOP & Instrumentation            │
│ spring-jdbc · spring-orm  │ spring-aop · spring-aspects      │
│ spring-tx · spring-jms    │                                  │
├───────────────────────────┴──────────────────────────────────┤
│ Core Container                                               │
│ spring-core · spring-beans · spring-context · spring-expression│
└──────────────────────────────────────────────────────────────┘</pre>
<table>
<tr><th>Module</th><th>What it gives you</th><th>You see it as</th></tr>
<tr><td><strong>spring-core</strong></td><td>Utilities, resource abstraction, type conversion</td><td><code>Resource</code>, <code>ConversionService</code></td></tr>
<tr><td><strong>spring-beans</strong></td><td>The bean factory: definitions, DI, autowiring, lifecycle</td><td><code>BeanFactory</code>, <code>@Autowired</code></td></tr>
<tr><td><strong>spring-context</strong></td><td>ApplicationContext: events, i18n, scheduling, stereotype scanning</td><td><code>@Component</code>, <code>@Configuration</code>, <code>ApplicationEvent</code></td></tr>
<tr><td><strong>spring-expression</strong></td><td>SpEL — expressions in annotations and config</td><td><code>@Value("#{...}")</code></td></tr>
<tr><td><strong>spring-aop</strong></td><td>Proxy-based aspects around beans</td><td><code>@Aspect</code>, and the engine behind <code>@Transactional</code>/<code>@Cacheable</code>/<code>@Async</code></td></tr>
<tr><td><strong>spring-aspects</strong></td><td>Real AspectJ weaving integration (beyond proxies)</td><td><code>@Configurable</code>, compile/load-time weaving</td></tr>
<tr><td><strong>spring-jdbc</strong></td><td>JdbcTemplate, exception translation, no boilerplate</td><td><code>JdbcTemplate</code>, <code>DataAccessException</code></td></tr>
<tr><td><strong>spring-orm</strong></td><td>JPA/Hibernate integration</td><td><code>LocalContainerEntityManagerFactoryBean</code></td></tr>
<tr><td><strong>spring-tx</strong></td><td>Declarative transaction management</td><td><code>@Transactional</code>, <code>PlatformTransactionManager</code></td></tr>
<tr><td><strong>spring-jms / spring-messaging</strong></td><td>Messaging abstractions, STOMP/WebSocket messaging</td><td><code>JmsTemplate</code>, <code>@JmsListener</code></td></tr>
<tr><td><strong>spring-web</strong></td><td>Common web infrastructure + HTTP clients</td><td><code>RestTemplate</code>, <code>RestClient</code>, multipart</td></tr>
<tr><td><strong>spring-webmvc</strong></td><td>Servlet MVC: DispatcherServlet, controllers, view resolution</td><td><code>@RestController</code>, <code>@GetMapping</code></td></tr>
<tr><td><strong>spring-webflux</strong></td><td>Reactive, non-blocking web stack on Reactor</td><td><code>WebClient</code>, <code>Mono</code>/<code>Flux</code>, functional routes</td></tr>
<tr><td><strong>spring-test</strong></td><td>Test context caching, MockMvc, transactional tests</td><td><code>@SpringBootTest</code>, <code>MockMvc</code>, <code>WebTestClient</code></td></tr>
</table>
<p><strong>3. The Spring ecosystem — separate projects, not core modules</strong></p>
<table>
<tr><th>Project</th><th>Solves</th></tr>
<tr><td><strong>Spring Boot</strong></td><td>Auto-configuration, starters, embedded Tomcat/Netty, Actuator, externalized config — "just run it"</td></tr>
<tr><td><strong>Spring Data</strong></td><td>Repositories for JPA, MongoDB, Redis, Elasticsearch — derived queries, paging, auditing</td></tr>
<tr><td><strong>Spring Security</strong></td><td>Authentication/authorization as a filter chain; OAuth2, JWT, method security</td></tr>
<tr><td><strong>Spring Cloud</strong></td><td>Microservice concerns: config server, service discovery, gateway, resilience, tracing</td></tr>
<tr><td><strong>Spring Batch</strong></td><td>Chunk-oriented batch jobs with restart, skip and retry semantics</td></tr>
<tr><td><strong>Spring Integration</strong></td><td>Enterprise integration patterns: channels, adapters, transformers</td></tr>
<tr><td><strong>Spring for GraphQL / Kafka / AMQP / Session</strong></td><td>Focused integrations built on the same container</td></tr>
</table>
<p><strong>4. Where Spring Boot fits</strong></p>
<pre>Spring Framework  = the container + modules  (you wire and configure everything)
Spring Boot       = Framework + opinions:
      starters            one dependency pulls a consistent, version-managed set
      auto-configuration  conditional @Configuration applied based on the classpath
      embedded server     the app is a runnable jar, not a WAR on a server
      Actuator            health, metrics, info endpoints out of the box
      externalized config application.yml, profiles, @ConfigurationProperties

Boot writes NO new container — it configures the same beans you would have declared.</pre>
<p><strong>5. What actually happens when the app starts</strong></p>
<pre>main() → SpringApplication.run()
  1. create the ApplicationContext (servlet or reactive, decided by the classpath)
  2. read bean definitions: @ComponentScan + @Configuration + auto-configuration
  3. run BeanFactoryPostProcessors (e.g. property placeholder resolution)
  4. instantiate singletons → inject dependencies → BeanPostProcessors (AOP proxies here)
  5. @PostConstruct / InitializingBean / init-method callbacks
  6. publish ApplicationReadyEvent, start the embedded server
  shutdown → @PreDestroy → context close</pre>
<div class="key-point">Answer this in layers: <em>"Spring is an IoC container; the modules are Core/Beans/Context/SpEL at the bottom, AOP, data access with transactions, and the web stack on top; the ecosystem projects — Boot, Data, Security, Cloud — are built on that container."</em> Then the sentence interviewers wait for: <strong>Spring Boot is not a different framework</strong> — it is auto-configuration, starters and an embedded server on top of exactly the same beans.</div>`,
      },
      {
        q: 'What is Spring Boot and how is it different from Spring Framework?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Spring Boot is not a separate framework; it is Spring with extra tools added on top. The Spring Framework provides the core parts such as the IoC container, MVC, Data, and Security, while Spring Boot adds auto-configuration, starter dependencies, an embedded server, and Actuator to remove most setup work. Any auto-configured bean is only a default and can be replaced by defining your own bean, because of <code>@ConditionalOnMissingBean</code>.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Spring Boot không phải là một framework riêng biệt; nó chính là Spring được bổ sung thêm các công cụ ở phía trên. Spring Framework cung cấp các phần lõi như IoC container, MVC, Data và Security, còn Spring Boot thêm vào auto-configuration, starter dependencies, embedded server và Actuator để loại bỏ gần hết công việc cấu hình. Mọi bean được auto-configure chỉ là mặc định và có thể được thay thế bằng cách tự định nghĩa bean của bạn, nhờ vào <code>@ConditionalOnMissingBean</code>.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>@SpringBootApplication</code> là một annotation gộp chung ba annotation khác: <code>@Configuration</code>, <code>@EnableAutoConfiguration</code> và <code>@ComponentScan</code>. Kết hợp lại, chúng biến class thành nguồn cung cấp bean, bật auto-configuration và quét tìm các component. Việc quét bắt đầu từ package chứa class được đánh annotation và đi xuống các package con, nên các bean đặt ở package khác có thể sẽ không được tìm thấy. Tùy chọn <code>exclude</code> có thể tắt những phần auto-configuration mà bạn không muốn dùng.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Starter là một dependency kéo theo cả một bộ thư viện tương thích cho một mục đích, ví dụ <code>spring-boot-starter-web</code> gom Spring MVC, Tomcat và Jackson lại với nhau cùng những phiên bản khớp nhau. Phiên bản được lấy từ parent BOM, đó là lý do starter không cần khai báo số phiên bản và cũng là lý do khi nâng cấp Spring Boot thì tất cả cùng dịch chuyển theo. Những starter thường gặp gồm <code>-web</code>, <code>-data-jpa</code>, <code>-security</code>, <code>-validation</code>, <code>-actuator</code> và <code>-test</code>. Một team cũng có thể tự xây dựng starter riêng để chia sẻ các cấu hình chung.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Auto-configuration hoạt động thông qua việc đăng ký bean có điều kiện. <code>@EnableAutoConfiguration</code> nạp một danh sách các configuration class từ các file nằm trong <code>META-INF</code> (<code>spring.factories</code> ở Boot 2, và file mới hơn <code>AutoConfiguration.imports</code> ở Boot 3). Mỗi class được canh giữ bởi các điều kiện như <code>@ConditionalOnClass</code>, <code>@ConditionalOnMissingBean</code> và <code>@ConditionalOnProperty</code>, nên một bean chỉ được tạo khi thư viện có mặt và người dùng chưa tự định nghĩa bean của riêng mình. Chạy với <code>--debug</code> sẽ in ra một báo cáo về những gì đã khớp và những gì bị bỏ qua.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Profiles cho phép một bản build chứa cấu hình cho nhiều môi trường, chẳng hạn dev và prod, và chọn một môi trường lúc khởi động mà không cần build lại. Các file cấu hình như <code>application-{profile}.yml</code> ghi đè lên file chung <code>application.yml</code>, và các bean được đánh dấu <code>@Profile</code> chỉ tồn tại khi profile tương ứng đang được kích hoạt. Một profile thường được chọn qua biến <code>SPRING_PROFILES_ACTIVE</code>, rất hợp với môi trường container. Profiles được thiết kế cho việc cấu hình theo môi trường, không phải cho feature flag lúc runtime, vì thay đổi một profile đòi hỏi phải khởi động lại.</p></details>
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
        q: 'Explain Spring Boot configuration properties binding with @ConfigurationProperties.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><code>@ConfigurationProperties</code> binds a group of properties onto a typed object, which is cleaner than spreading many <code>@Value</code> annotations. It is type-safe, easy to refactor, and supports relaxed binding, so <code>app.mail-host</code> and <code>app.mailHost</code> both match. Adding <code>@Validated</code> with constraints makes bad configuration fail at startup instead of causing errors later. A single value can still use <code>@Value</code>, but a related set of settings belongs in a properties class.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>@ConfigurationProperties</code> gắn một nhóm property vào một object có kiểu rõ ràng, cách này gọn gàng hơn việc rải rác nhiều annotation <code>@Value</code>. Nó type-safe, dễ refactor và hỗ trợ relaxed binding, nên cả <code>app.mail-host</code> lẫn <code>app.mailHost</code> đều khớp. Thêm <code>@Validated</code> cùng với các ràng buộc giúp cấu hình sai bị lỗi ngay lúc khởi động thay vì gây lỗi về sau. Một giá trị đơn lẻ vẫn có thể dùng <code>@Value</code>, nhưng một tập hợp các thiết lập liên quan thì nên đưa vào một class properties.</p></details>
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
        q: 'What is Spring Boot Actuator? What endpoints does it expose?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Actuator adds ready-made endpoints for running an app in production, such as health, metrics, env, beans, and loggers. The <code>/health</code> endpoint is commonly used for Kubernetes readiness and liveness probes, and <code>/metrics</code> or <code>/prometheus</code> feeds Prometheus and Grafana. By default only limited information is exposed over HTTP, which is the safe choice. Endpoints like <code>/env</code> and <code>/beans</code> reveal internal details, so only needed ones should be exposed and they should be secured.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Actuator bổ sung sẵn các endpoint để vận hành ứng dụng trong môi trường production, chẳng hạn health, metrics, env, beans và loggers. Endpoint <code>/health</code> thường được dùng cho readiness và liveness probe của Kubernetes, còn <code>/metrics</code> hay <code>/prometheus</code> cung cấp dữ liệu cho Prometheus và Grafana. Theo mặc định chỉ một lượng thông tin giới hạn được phơi ra qua HTTP, đó là lựa chọn an toàn. Các endpoint như <code>/env</code> và <code>/beans</code> để lộ chi tiết nội bộ, nên chỉ nên phơi ra những endpoint cần thiết và phải bảo mật chúng.</p></details>
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
        q: 'What are the major changes in Spring Boot 3 / Spring 6?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The main change is the platform jump to a Java 17 baseline and Jakarta EE 10, which renames packages from <code>javax.*</code> to <code>jakarta.*</code> and is the largest migration task; a tool like OpenRewrite can automate it. Other additions include built-in GraalVM native image support for fast startup and low memory, the Micrometer Observation API for metrics and tracing, RFC 7807 <code>ProblemDetail</code> as the standard error format, and declarative HTTP interface clients. In real migrations the hardest part is often third-party libraries that have not moved to jakarta yet.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Thay đổi chính là bước nhảy nền tảng lên baseline Java 17 và Jakarta EE 10, khiến các package đổi tên từ <code>javax.*</code> sang <code>jakarta.*</code> và đây là phần di trú lớn nhất; một công cụ như OpenRewrite có thể tự động hóa việc này. Các bổ sung khác gồm hỗ trợ sẵn GraalVM native image để khởi động nhanh và tốn ít bộ nhớ, Micrometer Observation API cho metrics và tracing, <code>ProblemDetail</code> theo RFC 7807 làm định dạng lỗi chuẩn, và các HTTP client kiểu khai báo qua interface. Trong các dự án di trú thực tế, phần khó nhất thường là các thư viện bên thứ ba chưa chuyển sang jakarta.</p></details>
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

      // ──── 2. IoC CONTAINER, BEANS & DEPENDENCY INJECTION ────
      {
        q: 'What is the difference between @Bean and @Component?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Both register a bean, but they differ in who builds the object. <code>@Component</code> marks a class that Spring finds by scanning and creates through its constructor, which fits your own classes. <code>@Bean</code> is a method inside a <code>@Configuration</code> class where the construction code is written by hand, which fits third-party types or cases that need custom setup. A simple rule is to use <code>@Component</code> for classes you own and <code>@Bean</code> when you do not own the class or need special wiring.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Cả hai đều đăng ký một bean, nhưng khác nhau ở chỗ ai là người tạo ra object. <code>@Component</code> đánh dấu một class để Spring tìm thấy qua việc quét component và tạo ra qua constructor của nó, phù hợp với các class do bạn viết. <code>@Bean</code> là một method bên trong class <code>@Configuration</code>, nơi bạn tự viết đoạn code khởi tạo bằng tay, phù hợp với các kiểu của bên thứ ba hoặc những trường hợp cần cấu hình đặc biệt. Một quy tắc đơn giản là dùng <code>@Component</code> cho những class bạn sở hữu, và dùng <code>@Bean</code> khi bạn không sở hữu class đó hoặc cần cách wiring đặc biệt.</p></details>
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
        q: 'Calling one @Bean method from another inside a @Configuration class — how many instances are created? What does proxyBeanMethods = false change?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>In the default full <code>@Configuration</code> mode, only one instance is created, even though the code looks like calling <code>new</code> twice. Spring subclasses the config class with CGLIB and overrides each <code>@Bean</code> method to check the container first, so a repeated call returns the existing singleton, which is also why <code>@Bean</code> methods cannot be private or final. Setting <code>proxyBeanMethods = false</code>, the lite mode, removes the subclass, so those inter-bean calls become plain Java calls that create duplicate, unmanaged objects such as a second connection pool. Lite mode is used for faster startup and native images, and the safe habit is to pass dependencies as <code>@Bean</code> method parameters so the mode never matters.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Ở chế độ full <code>@Configuration</code> mặc định, chỉ một instance được tạo ra, dù đoạn code trông như đang gọi <code>new</code> hai lần. Spring dùng CGLIB tạo một class con của config class và override từng method <code>@Bean</code> để kiểm tra container trước, nên một lời gọi lặp lại sẽ trả về singleton đang có, đây cũng là lý do các method <code>@Bean</code> không thể là private hoặc final. Đặt <code>proxyBeanMethods = false</code>, tức chế độ lite, sẽ bỏ đi class con, nên những lời gọi giữa các bean trở thành lời gọi Java thông thường và tạo ra các object trùng lặp, không được quản lý, chẳng hạn một connection pool thứ hai. Chế độ lite được dùng để khởi động nhanh hơn và cho native image, và thói quen an toàn là truyền dependency dưới dạng tham số của method <code>@Bean</code> để chế độ nào cũng không ảnh hưởng.</p></details>
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
        q: 'What are Spring bean scopes? Is a singleton bean thread-safe?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The default scope is singleton, meaning one shared instance per context; prototype creates a new instance each time it is requested, and request, session, and application are web scopes. A singleton is not thread-safe on its own, because Spring guarantees one instance, not synchronization. Singletons are safe in practice only when they are stateless, with final dependencies and no mutable fields. State that changes per request should use a local variable, an atomic or concurrent structure, or a request-scoped bean, not a field on the singleton.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Scope mặc định là singleton, nghĩa là mỗi context chỉ có một instance dùng chung; prototype tạo một instance mới mỗi lần được yêu cầu, còn request, session và application là các scope dành cho web. Bản thân một singleton không thread-safe, vì Spring chỉ đảm bảo một instance chứ không đảm bảo đồng bộ hóa. Singleton chỉ an toàn trên thực tế khi nó stateless, với các dependency là final và không có field thay đổi được. Trạng thái thay đổi theo từng request nên dùng một biến cục bộ, một cấu trúc atomic hoặc concurrent, hoặc một bean có scope là request, chứ không nên là một field trên singleton.</p></details>
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
        q: 'A prototype-scoped bean is injected into a singleton. How many instances are created, and how do you get true prototype behavior?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Only one instance is created. Scope is resolved when the bean is injected, not when it is used, so the singleton asks for the prototype once at startup, keeps that reference, and never asks again, which loses the new-instance behavior and lets state leak. The fix is to inject a way to get a fresh instance instead of the instance itself, such as an <code>ObjectProvider</code> with <code>getObject()</code>, a <code>@Lookup</code> method, or a scoped proxy, which is the same mechanism that makes request-scoped and session-scoped beans work inside singletons. Note also that Spring does not manage a prototype's destruction, so <code>@PreDestroy</code> never runs on one.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Chỉ một instance được tạo ra. Scope được xác định lúc bean được inject, chứ không phải lúc dùng, nên singleton chỉ yêu cầu prototype một lần lúc khởi động, giữ lại tham chiếu đó và không bao giờ yêu cầu lại, làm mất đi hành vi tạo instance mới và khiến trạng thái bị rò rỉ. Cách khắc phục là inject một cách để lấy được instance mới thay vì inject chính instance đó, chẳng hạn một <code>ObjectProvider</code> với <code>getObject()</code>, một method <code>@Lookup</code>, hoặc một scoped proxy, đây cũng chính là cơ chế giúp các bean scope request và session hoạt động được bên trong singleton. Cũng cần lưu ý rằng Spring không quản lý việc hủy một prototype, nên <code>@PreDestroy</code> không bao giờ chạy trên nó.</p></details>
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
        q: 'How to handle Bean lifecycle in Spring Boot?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The lifecycle order is constructor first, then dependency injection, then <code>@PostConstruct</code> once everything is wired, and <code>@PreDestroy</code> at shutdown. Using <code>@PostConstruct</code> and <code>@PreDestroy</code> is preferred because they are standard annotations and do not tie the bean to the <code>InitializingBean</code> and <code>DisposableBean</code> interfaces. Because the constructor runs before injection, using an injected field in the constructor gives a null value. Constructor injection avoids this problem, since the dependency arrives as a constructor argument.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Thứ tự vòng đời là constructor trước, rồi đến dependency injection, sau đó là <code>@PostConstruct</code> khi mọi thứ đã được wiring xong, và <code>@PreDestroy</code> lúc shutdown. Nên ưu tiên dùng <code>@PostConstruct</code> và <code>@PreDestroy</code> vì chúng là annotation chuẩn và không ràng buộc bean vào các interface <code>InitializingBean</code> và <code>DisposableBean</code>. Vì constructor chạy trước khi injection diễn ra, nên nếu dùng một field được inject bên trong constructor thì sẽ nhận về giá trị null. Constructor injection tránh được vấn đề này, vì dependency đến qua một tham số của constructor.</p></details>
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
        q: 'Output prediction: a bean has Aware interfaces, a BeanPostProcessor, @PostConstruct, InitializingBean, init-method, and @PreDestroy. What is the exact order printed?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The order is constructor, dependency injection, the Aware callbacks, <code>BeanPostProcessor.postProcessBeforeInitialization</code>, <code>@PostConstruct</code>, <code>afterPropertiesSet()</code>, the custom init-method, then <code>postProcessAfterInitialization</code>; at shutdown it is <code>@PreDestroy</code>, <code>destroy()</code>, then the custom destroy-method. The key point is that AOP proxies for <code>@Transactional</code> and <code>@Async</code> are created in <code>postProcessAfterInitialization</code>, the last init step, so earlier steps including <code>@PostConstruct</code> see the raw, un-proxied bean. That is why calling a <code>@Transactional</code> method from <code>@PostConstruct</code> runs with no transaction. The constructor running before injection is also why an <code>@Autowired</code> field is null inside it.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Thứ tự là constructor, dependency injection, các callback Aware, <code>BeanPostProcessor.postProcessBeforeInitialization</code>, <code>@PostConstruct</code>, <code>afterPropertiesSet()</code>, custom init-method, rồi đến <code>postProcessAfterInitialization</code>; lúc shutdown thì là <code>@PreDestroy</code>, <code>destroy()</code>, rồi custom destroy-method. Điểm mấu chốt là các AOP proxy cho <code>@Transactional</code> và <code>@Async</code> được tạo ra trong <code>postProcessAfterInitialization</code>, tức bước khởi tạo cuối cùng, nên các bước trước đó bao gồm cả <code>@PostConstruct</code> đều thấy bean thô, chưa được bọc proxy. Đó là lý do vì sao gọi một method <code>@Transactional</code> từ <code>@PostConstruct</code> lại chạy mà không có transaction. Việc constructor chạy trước injection cũng chính là lý do một field <code>@Autowired</code> bị null bên trong nó.</p></details>
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
        q: 'Constructor vs field vs setter injection — why is field injection discouraged?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Constructor injection is the recommended default. It allows dependencies to be <code>final</code> so the bean is immutable and never half-built, makes the class easy to unit test with plain <code>new</code>, and fails at startup when something is missing. Field injection is discouraged because the field cannot be final, testing needs reflection or the container, and it hides design problems, since a constructor with many parameters clearly signals a class that is too large. Setter injection is kept for the rare case of genuinely optional dependencies.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Constructor injection là lựa chọn mặc định được khuyến nghị. Nó cho phép các dependency là <code>final</code> nên bean là bất biến và không bao giờ ở trạng thái nửa vời, giúp class dễ unit test bằng cách <code>new</code> thông thường, và thất bại ngay lúc khởi động khi thiếu thứ gì đó. Field injection không được khuyến khích vì field không thể là final, việc test cần dùng reflection hoặc container, và nó che giấu các vấn đề thiết kế, bởi một constructor có nhiều tham số là dấu hiệu rõ ràng cho thấy class quá lớn. Setter injection được giữ lại cho trường hợp hiếm hoi khi dependency thật sự là tùy chọn.</p></details>
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
        q: 'How does Spring resolve circular dependencies? Why does constructor injection break them?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Spring can resolve a cycle for field or setter injection using its three-level cache, creating a raw bean, exposing an early reference, and finishing it later. Constructor injection cannot be resolved this way, because neither bean can be built without a finished copy of the other, so startup fails with <code>BeanCurrentlyInCreationException</code>; since Boot 2.6 circular references are rejected by default. This failure is useful, because a cycle usually points to a design problem. The better fix is to refactor, such as moving shared logic into a third bean or using an application event, rather than enabling workarounds.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Spring có thể giải quyết vòng lặp phụ thuộc với field hoặc setter injection nhờ cơ chế cache ba tầng, tạo ra một bean thô, phơi ra một tham chiếu sớm, rồi hoàn thiện nó sau. Constructor injection không thể giải quyết theo cách này, vì không bean nào có thể được tạo mà không có một bản hoàn chỉnh của bean kia, nên việc khởi động thất bại với <code>BeanCurrentlyInCreationException</code>; từ Boot 2.6 trở đi các vòng lặp phụ thuộc bị từ chối theo mặc định. Sự thất bại này thực ra hữu ích, vì một vòng lặp thường cho thấy một vấn đề về thiết kế. Cách khắc phục tốt hơn là refactor, chẳng hạn chuyển phần logic dùng chung sang một bean thứ ba hoặc dùng một application event, thay vì bật các cách né tránh.</p></details>
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
        q: '"My @Autowired field is null" — what are the causes and how do you debug it?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Spring only injects into objects it created, so a null <code>@Autowired</code> field usually means the object was not built by the container. The most common cause is using <code>new</code> to create a bean instead of injecting it. Other causes include a <code>static</code> field, using the field in the constructor before injection runs, the class not being a bean or sitting outside the scanned packages, or the object being created by another framework such as a JPA entity or a deserialized DTO. Constructor injection helps because it turns these silent nulls into a clear failure at startup.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Spring chỉ inject vào những object do chính nó tạo ra, nên một field <code>@Autowired</code> bị null thường có nghĩa là object đó không phải do container tạo. Nguyên nhân phổ biến nhất là dùng <code>new</code> để tạo một bean thay vì inject nó. Những nguyên nhân khác gồm một field <code>static</code>, dùng field bên trong constructor trước khi injection diễn ra, class không phải là một bean hoặc nằm ngoài các package được quét, hoặc object được tạo bởi một framework khác như một JPA entity hay một DTO được deserialize. Constructor injection giúp ích ở chỗ nó biến những null âm thầm này thành một lỗi rõ ràng ngay lúc khởi động.</p></details>
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

      // ──── 3. AOP & PROXIES ────
      {
        q: 'AOP cheat sheet: aspect, join point, pointcut, advice, weaving, pointcut expressions, advice order, proxy pitfalls',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>AOP has six vocabulary words and one mechanism. An <strong>aspect</strong> is the class holding cross-cutting code, a <strong>join point</strong> is a place where it could apply (in Spring, always a bean method call), a <strong>pointcut</strong> is the expression selecting those join points, and an <strong>advice</strong> is the code that runs — before, after returning, after throwing, after (finally), or around. <strong>Weaving</strong> is how advice is attached to the target, and Spring does it at runtime by wrapping the bean in a <strong>proxy</strong>: a JDK dynamic proxy when the bean has an interface, CGLIB when it does not. Everything that follows from that one mechanism is the source of every AOP surprise: advice only applies to calls that go through the proxy, so self-invocation, private, static and final methods are never advised. The two lines to remember: pointcut = where, advice = what; and if the call does not leave the object, there is no proxy in the path and nothing happens.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>AOP có sáu thuật ngữ và một cơ chế. <strong>Aspect</strong> là class chứa code xuyên suốt, <strong>join point</strong> là nơi nó có thể được áp dụng (trong Spring luôn là một lời gọi method của bean), <strong>pointcut</strong> là biểu thức chọn ra các join point đó, còn <strong>advice</strong> là đoạn code sẽ chạy — before, after returning, after throwing, after (finally), hoặc around. <strong>Weaving</strong> là cách gắn advice vào đối tượng đích, và Spring làm điều đó lúc chạy bằng cách bọc bean trong một <strong>proxy</strong>: JDK dynamic proxy khi bean có interface, CGLIB khi không có. Mọi bất ngờ của AOP đều bắt nguồn từ chính cơ chế đó: advice chỉ áp dụng cho các lời gọi đi qua proxy, nên gọi nội bộ trong cùng object, hay method private, static, final sẽ không bao giờ được advise. Hai câu cần nhớ: pointcut = ở đâu, advice = làm gì; và nếu lời gọi không đi ra khỏi object thì không có proxy nào trên đường đi, nên không có gì xảy ra.</p></details>
<p><strong>1. Vocabulary</strong></p>
<table>
<tr><th>Term</th><th>Meaning</th><th>In Spring</th></tr>
<tr><td><strong>Aspect</strong></td><td>Module holding the cross-cutting concern</td><td>A <code>@Aspect @Component</code> class</td></tr>
<tr><td><strong>Join point</strong></td><td>A point where advice could run</td><td><strong>Always a method execution</strong> on a Spring bean (no field/constructor join points)</td></tr>
<tr><td><strong>Pointcut</strong></td><td>Expression selecting join points</td><td><code>execution(...)</code>, <code>@annotation(...)</code>, …</td></tr>
<tr><td><strong>Advice</strong></td><td>The code that runs at a join point</td><td><code>@Before</code>, <code>@Around</code>, …</td></tr>
<tr><td><strong>Target</strong></td><td>The real bean being advised</td><td>Your <code>OrderService</code> instance</td></tr>
<tr><td><strong>Proxy</strong></td><td>The wrapper injected in place of the target</td><td>JDK dynamic proxy or CGLIB subclass</td></tr>
<tr><td><strong>Weaving</strong></td><td>Linking aspects to the target</td><td>Spring = <strong>runtime</strong>; AspectJ = compile-time / load-time</td></tr>
<tr><td><strong>Introduction</strong></td><td>Adding new interfaces/methods to a type</td><td><code>@DeclareParents</code> (rare)</td></tr>
</table>
<p><strong>2. Advice types</strong></p>
<table>
<tr><th>Advice</th><th>Runs</th><th>Can it change things?</th><th>Typical use</th></tr>
<tr><td><code>@Before</code></td><td>Before the method</td><td>Cannot stop it (only by throwing)</td><td>Validation, auth check, logging entry</td></tr>
<tr><td><code>@AfterReturning</code></td><td>After a normal return</td><td>Reads the return value (can modify a mutable one)</td><td>Audit success, post-process result</td></tr>
<tr><td><code>@AfterThrowing</code></td><td>After an exception</td><td>Sees the exception; rethrows it</td><td>Error logging, metrics, alerting</td></tr>
<tr><td><code>@After</code></td><td>Always (finally)</td><td>No access to result/exception</td><td>Cleanup, MDC clear</td></tr>
<tr><td><code>@Around</code></td><td>Wraps everything</td><td><strong>Full control</strong>: change args, skip the call, change/replace the result, retry</td><td>Timing, retry, caching, transactions</td></tr>
</table>
<pre>@Around("@annotation(Timed)")
public Object time(ProceedingJoinPoint pjp) throws Throwable {
    long t0 = System.nanoTime();
    try {
        return pjp.proceed();                 // ← call the target; skip it and you replace the method
    } finally {
        log.info("{} took {} ms", pjp.getSignature().toShortString(),
                 (System.nanoTime() - t0) / 1_000_000);
    }
}
// ⚠ @Around MUST return the value of proceed() (or a replacement) — returning null
//   silently turns every advised method into one that returns null.</pre>
<p><strong>3. Pointcut designators</strong></p>
<table>
<tr><th>Designator</th><th>Matches</th><th>Example</th></tr>
<tr><td><code>execution(...)</code></td><td>Method signature — the workhorse</td><td><code>execution(* com.app.service.*.*(..))</code></td></tr>
<tr><td><code>within(...)</code></td><td>Any method inside a type/package</td><td><code>within(com.app.service..*)</code></td></tr>
<tr><td><code>@annotation(...)</code></td><td>Methods carrying an annotation</td><td><code>@annotation(com.app.Audited)</code></td></tr>
<tr><td><code>@within(...)</code></td><td>Methods of a class carrying an annotation</td><td><code>@within(org.springframework.stereotype.Service)</code></td></tr>
<tr><td><code>bean(...)</code></td><td>By bean name (Spring-only)</td><td><code>bean(*Service)</code></td></tr>
<tr><td><code>args(...)</code></td><td>By runtime argument types — also binds them</td><td><code>args(Long, ..)</code></td></tr>
<tr><td><code>this(...)</code> / <code>target(...)</code></td><td>Proxy type / target type</td><td><code>target(com.app.Repo)</code></td></tr>
</table>
<pre>execution( modifiers? return-type declaring-type? method(params) throws? )
           │         │           │              │      │
           optional  * = any     optional       name   (..) = any args, (*) = exactly one

execution(* com.app.service.*.*(..))            all methods of all classes in that package
execution(public * com.app..*Service.*(..))     public methods of *Service in any subpackage
execution(* save*(..))                          any method whose name starts with "save"
@annotation(com.app.Audited) && args(id, ..)    annotated methods whose 1st arg binds to id
within(com.app..*) && !within(com.app.internal..*)   combine with && || !</pre>
<pre>// Name your pointcuts and reuse them — this is the readable style
@Aspect @Component
public class AuditAspect {

    @Pointcut("within(com.app.service..*)")            public void inService() {}
    @Pointcut("@annotation(com.app.Audited)")          public void audited() {}
    @Pointcut("inService() && audited()")              public void auditedService() {}

    @Before("auditedService()")
    public void before(JoinPoint jp) { log.info("call {}", jp.getSignature()); }
}</pre>
<p><strong>4. Binding context in advice</strong></p>
<pre>@Around("@annotation(retry)")                        // parameter name binds the annotation
public Object retry(ProceedingJoinPoint pjp, Retryable retry) throws Throwable { ... }

@Before("execution(* *..*Service.*(..)) && args(userId, ..)")
public void check(Long userId) { ... }               // binds the first argument

JoinPoint API:  getArgs()  getSignature()  getTarget()  getThis()  getKind()</pre>
<p><strong>5. Order — when several aspects hit the same method</strong></p>
<pre>@Aspect @Order(1) class SecurityAspect {}    // lowest number = OUTERMOST
@Aspect @Order(2) class TxAspect {}
@Aspect @Order(3) class LoggingAspect {}

Execution: Security.before → Tx.before → Logging.before → METHOD
           → Logging.after → Tx.after → Security.after     (like nested onion layers)

Framework defaults worth knowing:
  @Transactional  order = Ordered.LOWEST_PRECEDENCE  (innermost by default)
  @Async          runs OUTSIDE the transaction proxy unless you order it explicitly
  @Cacheable      typically outside @Transactional — a cache hit skips the DB entirely
Set @EnableTransactionManagement(order = ...) / @Order on your own aspects when it matters.</pre>
<p><strong>6. Proxy mechanics (the source of every pitfall)</strong></p>
<pre>caller ──▶ [ Proxy ] ──advice──▶ [ Target bean ]
             ▲
             └── this is what the container injects into other beans

JDK dynamic proxy : bean implements an interface → proxy implements the SAME interface
CGLIB subclass    : no interface → proxy EXTENDS the class (Spring Boot default:
                    spring.aop.proxy-target-class=true → CGLIB even with interfaces)

Consequences:
  ✗ self-invocation: this.other() never touches the proxy → no advice
  ✗ private / static / final methods, final classes → cannot be proxied/overridden
  ✗ calls from a constructor or @PostConstruct → the proxy is not in place yet
  ✗ injecting the concrete class when a JDK proxy is used → "not of expected type"
  ✓ fixes: self-inject the proxy, split into two beans (preferred),
           AopContext.currentProxy() (needs exposeProxy = true), or real AspectJ weaving</pre>
<p><strong>7. Spring AOP vs AspectJ</strong></p>
<table>
<tr><th></th><th>Spring AOP</th><th>AspectJ</th></tr>
<tr><td>Weaving</td><td>Runtime proxies</td><td>Compile-time or load-time bytecode weaving</td></tr>
<tr><td>Join points</td><td>Public bean method execution only</td><td>Methods, constructors, fields, static, private…</td></tr>
<tr><td>Self-invocation</td><td>Not advised</td><td>Advised</td></tr>
<tr><td>Setup</td><td>Zero — already on the classpath</td><td>Weaver / javaagent / build plugin</td></tr>
<tr><td>Use when</td><td>99% of application needs</td><td>You must advise non-bean code or internal calls</td></tr>
</table>
<p><strong>8. What Spring itself builds with AOP</strong>: <code>@Transactional</code>, <code>@Cacheable</code>/<code>@CacheEvict</code>, <code>@Async</code>, <code>@Retryable</code>, <code>@PreAuthorize</code>/<code>@Secured</code>, <code>@Validated</code> method validation, Micrometer's <code>@Timed</code>, and Spring Data repository implementations. Recognizing this explains why all of them share the same self-invocation limitation.</p>
<div class="key-point">Cheat line for the interview: <strong>pointcut = where, advice = what, weaving = how, proxy = why it sometimes does nothing.</strong> If asked why <code>@Transactional</code> (or <code>@Cacheable</code>, or <code>@Async</code>) "did not work", the answer is almost always: the call did not pass through the proxy — self-invocation, a private/final method, or the object was created with <code>new</code> instead of coming from the container.</div>`,
      },
      {
        q: 'What is Spring AOP and how does it work internally? (proxy creation, use cases, limitations)',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>AOP moves cross-cutting concerns such as logging, security, transactions, caching and retries out of business code and into aspects that wrap method calls with advice like <code>@Around</code>. Internally Spring implements this with proxies rather than bytecode weaving: during bean creation a <code>BeanPostProcessor</code> checks whether any aspect matches the bean, and if so returns a proxy in its place — a JDK dynamic proxy when the bean implements an interface, a CGLIB subclass otherwise — so the container injects the proxy everywhere the bean is used. Each intercepted call runs through a chain of interceptors and finally invokes the real object, which is exactly how <code>@Transactional</code>, <code>@Cacheable</code>, <code>@Async</code> and <code>@PreAuthorize</code> are implemented. The consequence is the limitation everyone hits: only calls that arrive through the proxy are advised, so self-invocation and private, static or final methods silently skip the advice.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>AOP tách các cross-cutting concern như logging, security, transaction, caching và retry ra khỏi code nghiệp vụ và đưa vào các aspect bao quanh lời gọi method bằng advice như <code>@Around</code>. Bên trong, Spring hiện thực điều này bằng proxy chứ không phải weaving bytecode: trong lúc tạo bean, một <code>BeanPostProcessor</code> kiểm tra xem có aspect nào khớp với bean hay không, nếu có thì trả về một proxy thay cho bean đó — JDK dynamic proxy khi bean có interface, CGLIB subclass khi không có — nên container sẽ tiêm proxy vào mọi nơi dùng bean. Mỗi lời gọi bị chặn sẽ chạy qua một chuỗi interceptor rồi mới gọi tới object thật, và đó chính là cách <code>@Transactional</code>, <code>@Cacheable</code>, <code>@Async</code> và <code>@PreAuthorize</code> được hiện thực. Hệ quả là hạn chế ai cũng gặp: chỉ những lời gọi đi qua proxy mới được advise, nên gọi nội bộ trong cùng object hay các method private, static, final sẽ âm thầm bỏ qua advice.</p></details>
<p><strong>1. The problem AOP solves</strong></p>
<pre>// Without AOP — the same 6 lines in every service method
public Order place(OrderRequest req) {
    log.info("place start");                     // logging
    if (!security.canPlace(user)) throw ...;     // security
    long t0 = System.nanoTime();                 // metrics
    tx.begin();                                  // transaction
    try { ...THE ACTUAL BUSINESS LOGIC (3 lines)... ; tx.commit(); }
    catch (Exception e) { tx.rollback(); throw e; }
    finally { metrics.record(System.nanoTime() - t0); log.info("place end"); }
}

// With AOP — the concerns move out; the method says only what it means
@Transactional @Audited @Timed
public Order place(OrderRequest req) { ...THE ACTUAL BUSINESS LOGIC... }</pre>
<p><strong>2. How a proxy is created (the internal flow)</strong></p>
<pre>1. @EnableAspectJAutoProxy (Spring Boot switches it on automatically) registers
   AnnotationAwareAspectJAutoProxyCreator — a BeanPostProcessor.
2. Startup: it collects all @Aspect beans and turns each advice method into an Advisor
   (pointcut + advice/interceptor pair). @Transactional/@Cacheable/@Async contribute
   their own built-in Advisors the same way.
3. For EVERY bean, in postProcessAfterInitialization:
        does any Advisor's pointcut match any method of this bean?
            no  → return the bean unchanged (zero cost)
            yes → build and return a PROXY that wraps it
4. The container injects THE PROXY wherever that bean is autowired.
5. A call on the proxy builds a ReflectiveMethodInvocation and walks the interceptor
   chain in order; the last link invokes the real (target) method.

   caller → proxy → [security] → [tx] → [cache] → [your @Around] → target.method()</pre>
<table>
<tr><th></th><th>JDK dynamic proxy</th><th>CGLIB proxy</th></tr>
<tr><td>Requires</td><td>The bean implements an interface</td><td>Non-final class with a usable constructor</td></tr>
<tr><td>Mechanism</td><td><code>Proxy.newProxyInstance</code> implementing the same interfaces</td><td>Generated <strong>subclass</strong> overriding methods</td></tr>
<tr><td>Injection type</td><td>Only the interface type can be injected</td><td>The class type can be injected</td></tr>
<tr><td>Cannot advise</td><td>Methods not on the interface</td><td><code>final</code> / <code>private</code> / <code>static</code> methods</td></tr>
<tr><td>Default</td><td>Plain Spring, when interfaces exist</td><td><strong>Spring Boot default</strong> (<code>proxyTargetClass=true</code>)</td></tr>
</table>
<p><strong>3. Writing an aspect — three realistic examples</strong></p>
<pre>// (a) Timing/metrics on an annotation
@Aspect @Component @Order(3)
public class TimingAspect {
    @Around("@annotation(com.app.Timed)")
    public Object time(ProceedingJoinPoint pjp) throws Throwable {
        long t0 = System.nanoTime();
        try { return pjp.proceed(); }
        finally { metrics.timer(pjp.getSignature().toShortString())
                         .record(System.nanoTime() - t0, NANOSECONDS); }
    }
}

// (b) Retry with backoff — @Around can call proceed() MORE THAN ONCE
@Around("@annotation(retryable)")
public Object retry(ProceedingJoinPoint pjp, Retryable retryable) throws Throwable {
    Throwable last = null;
    for (int attempt = 1; attempt &lt;= retryable.maxAttempts(); attempt++) {
        try { return pjp.proceed(); }
        catch (TransientException e) { last = e; Thread.sleep(100L * attempt); }
    }
    throw last;
}

// (c) Audit trail with argument binding
@AfterReturning(pointcut = "execution(* com.app.service..*.*(..)) && args(id, ..)",
                returning = "result")
public void audit(JoinPoint jp, Long id, Object result) {
    auditRepo.save(new AuditEntry(jp.getSignature().getName(), id, currentUser()));
}</pre>
<p><strong>4. Where Spring itself uses AOP</strong></p>
<table>
<tr><th>Feature</th><th>Advice it installs</th><th>Note</th></tr>
<tr><td><code>@Transactional</code></td><td>Begin/commit/rollback around the method</td><td><code>TransactionInterceptor</code></td></tr>
<tr><td><code>@Cacheable</code>/<code>@CacheEvict</code>/<code>@CachePut</code></td><td>Check cache, maybe skip the method</td><td><code>CacheInterceptor</code></td></tr>
<tr><td><code>@Async</code></td><td>Submit the call to a TaskExecutor, return immediately</td><td>Must return <code>void</code>/<code>Future</code></td></tr>
<tr><td><code>@PreAuthorize</code>/<code>@Secured</code></td><td>Evaluate the expression, throw if denied</td><td>Spring Security method security</td></tr>
<tr><td><code>@Retryable</code></td><td>Re-invoke on failure with backoff</td><td>Spring Retry</td></tr>
<tr><td><code>@Validated</code> (on a bean)</td><td>Validate method parameters</td><td>Method-level JSR-380</td></tr>
</table>
<p><strong>5. Limitations and the fixes</strong></p>
<pre>✗ Self-invocation — the classic bug
@Service class OrderService {
    public void outer() { this.inner(); }        // 'this' = the TARGET, not the proxy
    @Transactional public void inner() { }       // ← NEVER runs in a transaction here
}
Fixes (best first):
  1. Move inner() into another bean and inject it   ← preferred: honest design
  2. Self-inject:  @Autowired @Lazy private OrderService self;  self.inner();
  3. AopContext.currentProxy() with @EnableAspectJAutoProxy(exposeProxy = true)
  4. Real AspectJ load-time weaving (no proxy involved at all)

✗ private / static / final methods, final classes → not proxyable (CGLIB cannot override)
✗ Calls inside a constructor or @PostConstruct → the proxy does not exist yet
✗ Only Spring-managed beans are advised — an object created with new is never advised
✗ Only method-execution join points (no field access, no constructor interception)
✗ Debugging: stack traces gain proxy frames; getClass() prints ...$$SpringCGLIB$$0</pre>
<p><strong>6. Cost and good practice</strong>: an intercepted call costs roughly a few hundred nanoseconds (reflection + chain walk) — irrelevant next to a database call, but avoid advising extremely hot, tiny methods. Keep pointcuts narrow and explicit (prefer <code>@annotation</code> over broad <code>execution(* com..*.*(..))</code>), keep aspects free of business logic, and set <code>@Order</code> when several aspects touch the same method.</p>
<div class="key-point">Say the mechanism, not just the definition: <em>"a BeanPostProcessor replaces the bean with a proxy at startup, and every advised call walks an interceptor chain before reaching the target."</em> That one sentence explains the use cases, why <code>@Transactional</code>/<code>@Cacheable</code>/<code>@Async</code> behave identically, and why self-invocation silently does nothing.</div>`,
      },
      {
        q: 'Filter vs Interceptor vs AOP — where does each run and when do you use which?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>These are three levels chosen by how much context is needed. A servlet Filter runs at the container level before Spring sees the request and works on raw request and response data, which fits CORS, compression, and Spring Security. A <code>HandlerInterceptor</code> runs inside DispatcherServlet and knows which controller will handle the request, which fits rate limiting, locale, and per-controller auditing. AOP wraps the actual bean method call and sees method arguments and return values, which fits <code>@Transactional</code>, <code>@Cacheable</code>, and timing of service methods.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Đây là ba cấp độ, lựa chọn tùy theo bạn cần bao nhiêu ngữ cảnh. Một servlet Filter chạy ở cấp container trước khi Spring thấy request và làm việc trên dữ liệu request và response thô, phù hợp với CORS, nén dữ liệu và Spring Security. Một <code>HandlerInterceptor</code> chạy bên trong DispatcherServlet và biết controller nào sẽ xử lý request, phù hợp với rate limiting, locale và audit theo từng controller. AOP bao quanh chính lời gọi method của bean và thấy được tham số cũng như giá trị trả về của method, phù hợp với <code>@Transactional</code>, <code>@Cacheable</code> và đo thời gian của các method service.</p></details>
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

      // ──── 4. TRANSACTIONS ────
      {
        q: 'Explain @Transactional in depth. What are common pitfalls?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p><code>@Transactional</code> wraps a method so a transaction starts before it, commits on normal return, and rolls back on failure, and it is applied by a proxy. By default it rolls back only on unchecked exceptions; a checked exception commits unless <code>rollbackFor</code> is set, which is a common cause of silent data problems. Calls within the same object, and private or final methods, bypass the proxy and are ignored. For propagation, REQUIRED joins the caller's transaction, REQUIRES_NEW runs a separate one, and NESTED uses a savepoint; transactions should stay short to avoid draining the connection pool.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>@Transactional</code> bao một method sao cho một transaction bắt đầu trước khi method chạy, commit khi trả về bình thường, và rollback khi thất bại, và nó được áp dụng bởi một proxy. Theo mặc định nó chỉ rollback với unchecked exception; một checked exception vẫn commit trừ khi bạn đặt <code>rollbackFor</code>, đây là một nguyên nhân phổ biến gây ra lỗi dữ liệu âm thầm. Các lời gọi trong cùng một object, cũng như các method private hoặc final, đều đi vòng qua proxy nên bị bỏ qua. Về propagation, REQUIRED tham gia vào transaction của caller, REQUIRES_NEW chạy một transaction riêng, còn NESTED dùng một savepoint; transaction nên ngắn gọn để tránh làm cạn kiệt connection pool.</p></details>
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
        q: 'Why does @Transactional silently do nothing on self-invocation (this.method()) or on private/final methods?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The transaction lives on the proxy, not on the object itself. Spring wraps the bean in a proxy that opens and commits the transaction before calling the real target, so a call through <code>this.method()</code> uses the raw target and skips the transaction with no error. Private methods cannot be overridden and final methods cannot be subclassed by CGLIB, so both are ignored for the same reason. The clean fix is to move the method to a separate bean so the call crosses the proxy; the same rule explains <code>@Async</code>, <code>@Cacheable</code>, and <code>@Retryable</code>.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Transaction nằm trên proxy chứ không nằm trên chính object đó. Spring bọc bean trong một proxy để mở và commit transaction trước khi gọi tới target thật, nên một lời gọi qua <code>this.method()</code> dùng thẳng target thô và bỏ qua transaction mà không báo lỗi. Method private không thể bị override và method final không thể bị CGLIB kế thừa, nên cả hai đều bị bỏ qua vì cùng lý do đó. Cách khắc phục gọn gàng là chuyển method sang một bean riêng để lời gọi đi qua proxy; cùng quy tắc này cũng giải thích cho <code>@Async</code>, <code>@Cacheable</code> và <code>@Retryable</code>.</p></details>
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

      // ──── 5. WEB LAYER — MVC, REST & VALIDATION ────
      {
        q: 'What are @RequestMapping, @GetMapping, @PostMapping, @PathVariable, @RequestParam, @RequestBody?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p><code>@RequestMapping</code> on a class sets the base path, and <code>@GetMapping</code>, <code>@PostMapping</code>, and similar are shortcuts for each HTTP method. <code>@PathVariable</code> reads a value from the URL path, <code>@RequestParam</code> reads a query string or form value, and <code>@RequestBody</code> converts the JSON body into an object using Jackson. Pairing <code>@RequestBody</code> with <code>@Valid</code> lets bad input fail early with a clean 400 response.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>@RequestMapping</code> đặt trên class sẽ định nghĩa đường dẫn gốc, còn <code>@GetMapping</code>, <code>@PostMapping</code> và các annotation tương tự là dạng viết tắt cho từng HTTP method. <code>@PathVariable</code> đọc giá trị từ đường dẫn URL, <code>@RequestParam</code> đọc giá trị từ query string hoặc form, còn <code>@RequestBody</code> chuyển body JSON thành object bằng Jackson. Kết hợp <code>@RequestBody</code> với <code>@Valid</code> giúp dữ liệu sai bị loại sớm với một response 400 gọn gàng.</p></details>
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
        q: 'How does Spring Boot handle exception handling in REST APIs?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>REST error handling is centralized in a single <code>@RestControllerAdvice</code> class so controllers do not need try/catch. Each <code>@ExceptionHandler</code> method maps one exception type to an HTTP response for all controllers, and the most specific handler is chosen first. Spring Boot 3 can return a <code>ProblemDetail</code> body based on RFC 7807. Stack traces should never be sent to the client, and this advice only catches exceptions thrown inside Spring MVC, not those from a servlet Filter.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Việc xử lý lỗi cho REST được tập trung vào một class <code>@RestControllerAdvice</code> duy nhất, nhờ đó controller không cần try/catch. Mỗi method <code>@ExceptionHandler</code> ánh xạ một loại exception thành một HTTP response cho tất cả controller, và handler cụ thể nhất sẽ được chọn trước. Spring Boot 3 có thể trả về body dạng <code>ProblemDetail</code> theo chuẩn RFC 7807. Không bao giờ nên gửi stack trace về cho client, và advice này chỉ bắt được các exception phát sinh bên trong Spring MVC, chứ không bắt được exception từ một servlet Filter.</p></details>
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
        q: 'How does validation work in Spring Boot? @Valid vs @Validated, custom validators.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Validation is applied at the edge by putting Jakarta constraints such as <code>@NotBlank</code>, <code>@Email</code>, and <code>@Min</code> on the DTO so bad input fails before the business layer. <code>@Valid</code> on a controller parameter triggers it and cascades into nested objects, producing a <code>MethodArgumentNotValidException</code> that can become a 400 response with field details. <code>@Valid</code> is the standard Jakarta annotation for cascading, while <code>@Validated</code> is Spring's and adds validation groups and can validate method parameters on service beans. Rules the built-in constraints cannot express use a custom annotation with a <code>ConstraintValidator</code>.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Validation được áp dụng ở lớp ngoài cùng bằng cách đặt các ràng buộc Jakarta như <code>@NotBlank</code>, <code>@Email</code> và <code>@Min</code> lên DTO để dữ liệu sai bị loại trước khi vào tầng nghiệp vụ. <code>@Valid</code> đặt trên một tham số của controller sẽ kích hoạt việc kiểm tra và lan xuống các object lồng nhau, tạo ra một <code>MethodArgumentNotValidException</code> có thể trở thành một response 400 kèm chi tiết từng field. <code>@Valid</code> là annotation chuẩn của Jakarta dùng để lan truyền, còn <code>@Validated</code> là của Spring và bổ sung validation group, đồng thời có thể kiểm tra tham số method trên các bean service. Những quy tắc mà các ràng buộc có sẵn không diễn đạt được thì dùng một annotation tùy chỉnh với một <code>ConstraintValidator</code>.</p></details>
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
        q: 'RestTemplate vs WebClient vs RestClient vs FeignClient — which HTTP client to use?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>For new blocking code the modern default is <code>RestClient</code>, added in Boot 3.2, which has a fluent API without pulling in the reactive stack. <code>RestTemplate</code> is in maintenance mode and should not be used for new code, and <code>WebClient</code> is best only for reactive or streaming work. <code>FeignClient</code> is the declarative interface style and fits platforms already using Spring Cloud, since it includes service discovery and load balancing. With any client, explicit connect and read timeouts plus retries and a circuit breaker (for example Resilience4j) help stop one slow dependency from taking down the system.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Với code blocking mới, lựa chọn mặc định hiện đại là <code>RestClient</code>, được thêm vào từ Boot 3.2, nó có API dạng fluent mà không kéo theo cả tầng reactive. <code>RestTemplate</code> đang ở chế độ maintenance và không nên dùng cho code mới, còn <code>WebClient</code> chỉ phù hợp nhất cho các tác vụ reactive hoặc streaming. <code>FeignClient</code> là kiểu khai báo qua interface và phù hợp với các nền tảng đã dùng Spring Cloud, vì nó có sẵn service discovery và load balancing. Với bất kỳ client nào, việc đặt rõ timeout cho connect và read cùng với retry và circuit breaker (ví dụ Resilience4j) giúp ngăn một dependency chậm kéo sập cả hệ thống.</p></details>
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
        q: 'What is Spring WebFlux? How is it different from Spring MVC?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Spring MVC uses a blocking, thread-per-request model on the Servlet API, while WebFlux is non-blocking and reactive, runs on an event loop with Netty, and returns <code>Mono</code> and <code>Flux</code>. WebFlux suits high-concurrency I/O work such as many connections, streaming, or a gateway calling many services. It must be reactive end to end, because a single blocking call can stall the event loop. Java 21 virtual threads now give MVC similar scalability for I/O, so WebFlux is mainly needed when backpressure or streaming is required.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Spring MVC dùng mô hình blocking, mỗi request một thread, trên nền Servlet API, còn WebFlux thì non-blocking và reactive, chạy trên một event loop với Netty, và trả về <code>Mono</code> cùng <code>Flux</code>. WebFlux phù hợp với các tác vụ I/O có độ đồng thời cao như nhiều kết nối, streaming, hoặc một gateway gọi tới nhiều service. Nó phải reactive từ đầu đến cuối, vì chỉ một lời gọi blocking cũng có thể làm nghẽn event loop. Virtual thread của Java 21 giờ đây mang lại cho MVC khả năng mở rộng tương tự với các tác vụ I/O, nên WebFlux chủ yếu chỉ cần khi bạn cần backpressure hoặc streaming.</p></details>
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

      // ──── 6. SECURITY ────
      {
        q: 'Explain Spring Security filter chain and authentication flow.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Spring Security is a chain of servlet filters placed in front of the application. A request passes through the chain, an authentication filter reads the credentials (for example a form login, or a JWT filter added before <code>UsernamePasswordAuthenticationFilter</code>), and passes them to the <code>AuthenticationManager</code>. A provider loads the user through <code>UserDetailsService</code> and checks the password with a <code>PasswordEncoder</code> such as BCrypt, and on success the <code>Authentication</code> is stored in the <code>SecurityContextHolder</code>. For a REST API the chain is often set to stateless with CSRF disabled and access rules defined per path.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Spring Security là một chuỗi các servlet filter đặt ở phía trước ứng dụng. Một request đi qua chuỗi này, một filter xác thực sẽ đọc thông tin đăng nhập (ví dụ form login, hoặc một JWT filter được thêm vào trước <code>UsernamePasswordAuthenticationFilter</code>) rồi chuyển cho <code>AuthenticationManager</code>. Một provider nạp người dùng thông qua <code>UserDetailsService</code> và kiểm tra mật khẩu bằng một <code>PasswordEncoder</code> như BCrypt, và khi thành công thì đối tượng <code>Authentication</code> được lưu vào <code>SecurityContextHolder</code>. Với một REST API, chuỗi này thường được đặt ở chế độ stateless, tắt CSRF và định nghĩa quy tắc truy cập theo từng đường dẫn.</p></details>
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

      // ──── 7. DATA ACCESS & CACHING ────
      {
        q: 'How to implement pagination and sorting in Spring Boot?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Spring Data supports paging by having a repository method take a <code>Pageable</code> and return a <code>Page</code>, which runs both the data query and a count query. The controller binds <code>page</code>, <code>size</code>, and <code>sort</code> parameters into a <code>PageRequest</code>. Offset paging gets slower on deep pages because the database still scans and discards the skipped rows, and results can shift when data changes. For large datasets, keyset paging such as <code>WHERE id &gt; :lastId ORDER BY id</code> stays fast.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Spring Data hỗ trợ phân trang bằng cách để một method của repository nhận một <code>Pageable</code> và trả về một <code>Page</code>, nó sẽ chạy cả câu truy vấn dữ liệu lẫn câu truy vấn đếm. Controller gắn các tham số <code>page</code>, <code>size</code> và <code>sort</code> vào một <code>PageRequest</code>. Phân trang theo offset ngày càng chậm ở các trang sâu vì database vẫn phải quét rồi bỏ đi những dòng bị bỏ qua, và kết quả có thể bị lệch khi dữ liệu thay đổi. Với tập dữ liệu lớn, phân trang theo keyset như <code>WHERE id &gt; :lastId ORDER BY id</code> vẫn giữ được tốc độ nhanh.</p></details>
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
        q: 'How do @Cacheable, @CacheEvict, and @CachePut work in Spring Boot?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>These are declarative caching annotations that work through AOP once <code>@EnableCaching</code> is set. <code>@Cacheable</code> checks the cache first and runs the method only on a miss, <code>@CachePut</code> always runs and refreshes the entry, and <code>@CacheEvict</code> removes entries and belongs on write methods to avoid stale data. Since they are proxy-based, calling them from inside the same object skips the cache. Because an in-memory cache goes stale across several instances, a shared store like Redis lets all instances use one cache.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Đây là các annotation caching khai báo, hoạt động thông qua AOP một khi đã bật <code>@EnableCaching</code>. <code>@Cacheable</code> kiểm tra cache trước và chỉ chạy method khi cache miss, <code>@CachePut</code> luôn chạy và làm mới entry, còn <code>@CacheEvict</code> xóa các entry và nên đặt trên các method ghi để tránh dữ liệu cũ. Vì chúng dựa trên proxy, nên gọi chúng từ bên trong cùng một object sẽ bỏ qua cache. Do một cache trong bộ nhớ sẽ bị cũ khi có nhiều instance, một kho lưu trữ dùng chung như Redis cho phép mọi instance dùng chung một cache.</p></details>
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

      // ──── 8. ASYNC, SCHEDULING & EVENTS ────
      {
        q: 'How does @Async work in Spring Boot?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><code>@Async</code> makes a method run on a separate thread and return at once, either void for fire-and-forget or a <code>CompletableFuture</code> when a result is needed. Like <code>@Transactional</code> it is proxy-based, so calling it from inside the same class runs it synchronously. The default executor is unbounded and creates a thread per call, so a bounded <code>ThreadPoolTaskExecutor</code> with a queue and a rejection policy should always be configured. Exceptions from void async methods are lost unless an <code>AsyncUncaughtExceptionHandler</code> is registered.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>@Async</code> khiến một method chạy trên một thread riêng và trả về ngay lập tức, có thể là void cho kiểu fire-and-forget hoặc một <code>CompletableFuture</code> khi cần kết quả. Giống như <code>@Transactional</code>, nó dựa trên proxy, nên gọi nó từ bên trong cùng một class sẽ chạy đồng bộ. Executor mặc định không giới hạn và tạo một thread cho mỗi lời gọi, nên luôn phải cấu hình một <code>ThreadPoolTaskExecutor</code> có giới hạn với một hàng đợi và một chính sách từ chối. Các exception từ những async method kiểu void sẽ bị mất trừ khi bạn đăng ký một <code>AsyncUncaughtExceptionHandler</code>.</p></details>
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
        q: 'How does @Scheduled work in Spring Boot? What are cron expressions?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><code>@Scheduled</code>, enabled by <code>@EnableScheduling</code>, offers three modes: <code>fixedRate</code> runs on a fixed clock interval, <code>fixedDelay</code> waits a gap after the previous run finishes, and <code>cron</code> handles calendar schedules. Spring's cron has a leading seconds field, so it uses six fields. The default scheduler is single-threaded, so a long or overlapping task blocks the others, and <code>fixedRate</code> can pile up when a run takes longer than the interval. In a clustered deployment every instance runs the same job, so a tool like ShedLock or Quartz is used to ensure a single run.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>@Scheduled</code>, được bật bởi <code>@EnableScheduling</code>, cung cấp ba chế độ: <code>fixedRate</code> chạy theo khoảng cố định tính theo đồng hồ, <code>fixedDelay</code> chờ một khoảng sau khi lần chạy trước kết thúc, còn <code>cron</code> dùng cho các lịch theo dương lịch. Cron của Spring có thêm trường giây ở đầu, nên nó dùng sáu trường. Scheduler mặc định chỉ có một thread, nên một tác vụ dài hoặc chồng chéo sẽ chặn các tác vụ khác, và <code>fixedRate</code> có thể bị dồn lại khi một lần chạy lâu hơn khoảng thời gian đặt ra. Trong triển khai theo cụm, mọi instance đều chạy cùng một job, nên người ta dùng một công cụ như ShedLock hoặc Quartz để đảm bảo chỉ chạy một lần.</p></details>
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
        q: 'What are Spring application events? When do you use @TransactionalEventListener?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Application events decouple side effects from the main flow, since the publisher fires an event without knowing who listens, which can also break a circular dependency between services. A plain <code>@EventListener</code> runs inside the transaction, so sending an email there could send a confirmation for an order that later rolls back. <code>@TransactionalEventListener</code> with <code>AFTER_COMMIT</code> runs only after a successful commit, which avoids that problem. These events are in-JVM and at-most-once and are lost on a crash, so real delivery guarantees need the outbox pattern with a message broker.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Application event tách các side effect ra khỏi luồng chính, vì bên phát ra event không cần biết ai lắng nghe, điều này cũng có thể phá vỡ một vòng lặp phụ thuộc giữa các service. Một <code>@EventListener</code> thông thường chạy bên trong transaction, nên gửi email ở đó có thể gửi một email xác nhận cho một đơn hàng mà sau đó bị rollback. <code>@TransactionalEventListener</code> với <code>AFTER_COMMIT</code> chỉ chạy sau khi commit thành công, nhờ đó tránh được vấn đề trên. Những event này nằm trong cùng JVM, theo kiểu at-most-once và sẽ mất khi bị crash, nên nếu cần đảm bảo giao nhận thực sự thì phải dùng outbox pattern kèm một message broker.</p></details>
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

      // ──── 9. TESTING ────
      {
        q: 'How does Spring Boot testing work? Explain @SpringBootTest, @WebMvcTest, @DataJpaTest.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Test annotations should match the layer being tested to avoid loading the whole app each time. <code>@SpringBootTest</code> loads the full context for integration tests and is slow, so it is used sparingly. <code>@WebMvcTest</code> loads only the web layer with MockMvc and mocks the service below it, which is fast and focused on controller behavior. <code>@DataJpaTest</code> loads only the repository layer with a test database and rolls back after each test; a good mix is many unit and slice tests with a few full integration tests.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Các annotation test nên khớp với tầng đang được kiểm thử để tránh nạp toàn bộ ứng dụng mỗi lần. <code>@SpringBootTest</code> nạp toàn bộ context cho các integration test và chạy chậm, nên chỉ dùng một cách hạn chế. <code>@WebMvcTest</code> chỉ nạp tầng web cùng với MockMvc và mock tầng service bên dưới, cách này nhanh và tập trung vào hành vi của controller. <code>@DataJpaTest</code> chỉ nạp tầng repository với một database dùng cho test và rollback sau mỗi test; một cách phối hợp tốt là nhiều unit test và slice test cùng với một vài integration test đầy đủ.</p></details>
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
    ],
  },

  // ───────────────────────── 9. HTML ─────────────────────────
];
