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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Spring là một framework ứng dụng có cấu trúc module, với nền tảng là <strong>IoC container</strong>: bạn khai báo các object dưới dạng bean, container sẽ tạo chúng, inject các dependency và quản lý vòng đời của chúng; mọi thứ còn lại trong Spring đều là module xây trên nền tảng đó. Tầng lõi gồm Core/Beans/Context/SpEL; bên trên là AOP để xử lý các cross-cutting concern (logging, transaction...), tầng truy cập dữ liệu (JDBC, ORM và transaction manager), tầng web (Spring MVC cho ứng dụng servlet, WebFlux cho ứng dụng reactive), cùng với module testing. Xung quanh framework là các project riêng — Spring Boot, Spring Data, Spring Security, Spring Cloud, Spring Batch, Spring Integration — chúng không thuộc core framework nhưng được xây dựng trên nó. <strong>Spring Boot</strong> là lớp nằm trên cùng, đi kèm sẵn các lựa chọn mặc định hợp lý: nó bổ sung auto-configuration, các starter dependency, embedded server và các tính năng phục vụ production, nhờ đó bạn gần như không phải cấu hình gì mà vẫn có một ứng dụng chạy được.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Spring Boot không phải là một framework riêng biệt; nó chính là Spring được bổ sung thêm các công cụ ở phía trên. Spring Framework cung cấp các phần lõi như IoC container, MVC, Data và Security, còn Spring Boot thêm vào auto-configuration, starter dependencies, embedded server và Actuator để loại bỏ gần hết công việc cấu hình thủ công. Mọi bean do auto-configuration tạo ra chỉ là giá trị mặc định — bạn luôn có thể thay thế bằng cách tự định nghĩa bean của mình, nhờ cơ chế <code>@ConditionalOnMissingBean</code>.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>@SpringBootApplication</code> là một annotation gộp chung ba annotation khác: <code>@Configuration</code>, <code>@EnableAutoConfiguration</code> và <code>@ComponentScan</code>. Kết hợp lại, chúng biến class thành nơi khai báo bean, bật auto-configuration và quét tìm các component. Việc quét bắt đầu từ package chứa class được gắn annotation rồi lan xuống các package con, nên bean đặt ở package nằm ngoài phạm vi này sẽ không được tìm thấy. Tùy chọn <code>exclude</code> cho phép tắt những phần auto-configuration mà bạn không muốn dùng.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Starter là một dependency kéo theo cả một bộ thư viện phục vụ cho một mục đích, với các phiên bản đã được đảm bảo tương thích với nhau — ví dụ <code>spring-boot-starter-web</code> gom sẵn Spring MVC, Tomcat và Jackson. Phiên bản được quản lý bởi parent BOM, vì vậy starter không cần khai báo số phiên bản, và khi nâng cấp Spring Boot thì toàn bộ thư viện cũng được nâng cấp đồng bộ theo. Những starter thường gặp gồm <code>-web</code>, <code>-data-jpa</code>, <code>-security</code>, <code>-validation</code>, <code>-actuator</code> và <code>-test</code>. Một team cũng có thể tự viết starter riêng để chia sẻ các cấu hình dùng chung trong nội bộ.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Auto-configuration hoạt động thông qua việc đăng ký bean có điều kiện. <code>@EnableAutoConfiguration</code> nạp một danh sách các configuration class từ các file nằm trong <code>META-INF</code> (<code>spring.factories</code> ở Boot 2, và file mới hơn <code>AutoConfiguration.imports</code> ở Boot 3). Mỗi class đều đi kèm các điều kiện như <code>@ConditionalOnClass</code>, <code>@ConditionalOnMissingBean</code> và <code>@ConditionalOnProperty</code>, nên bean chỉ được tạo khi thư viện tương ứng có trên classpath và người dùng chưa tự định nghĩa bean của riêng mình. Chạy ứng dụng với <code>--debug</code> sẽ in ra báo cáo cho biết cấu hình nào được áp dụng và cấu hình nào bị bỏ qua.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Profiles cho phép một bản build chứa cấu hình cho nhiều môi trường, chẳng hạn dev và prod, và chọn một môi trường lúc khởi động mà không cần build lại. Các file cấu hình như <code>application-{profile}.yml</code> ghi đè lên file chung <code>application.yml</code>, và các bean được đánh dấu <code>@Profile</code> chỉ tồn tại khi profile tương ứng đang được kích hoạt. Profile thường được chọn qua biến môi trường <code>SPRING_PROFILES_ACTIVE</code>, rất tiện khi chạy trong container. Profiles sinh ra để cấu hình theo môi trường, không phải để làm feature flag lúc runtime, vì muốn đổi profile thì phải khởi động lại ứng dụng.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>@ConfigurationProperties</code> gắn một nhóm property vào một object có kiểu rõ ràng, cách này gọn gàng hơn việc rải rác nhiều annotation <code>@Value</code>. Nó type-safe, dễ refactor và hỗ trợ relaxed binding, nên cả <code>app.mail-host</code> lẫn <code>app.mailHost</code> đều khớp. Thêm <code>@Validated</code> cùng các constraint giúp phát hiện cấu hình sai ngay lúc khởi động, thay vì để lỗi phát sinh về sau. Với một giá trị đơn lẻ thì vẫn có thể dùng <code>@Value</code>, nhưng một nhóm cấu hình liên quan với nhau thì nên gom vào một class properties.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Actuator bổ sung sẵn các endpoint để vận hành ứng dụng trong môi trường production, chẳng hạn health, metrics, env, beans và loggers. Endpoint <code>/health</code> thường được dùng cho readiness và liveness probe của Kubernetes, còn <code>/metrics</code> hay <code>/prometheus</code> cung cấp dữ liệu cho Prometheus và Grafana. Theo mặc định chỉ một số ít endpoint được expose qua HTTP — đây là lựa chọn an toàn. Các endpoint như <code>/env</code> và <code>/beans</code> để lộ thông tin nội bộ của hệ thống, nên chỉ expose những endpoint thật sự cần và phải bảo vệ chúng (ví dụ bằng Spring Security).</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Thay đổi lớn nhất là nâng nền tảng lên tối thiểu Java 17 và Jakarta EE 10, khiến các package đổi tên từ <code>javax.*</code> sang <code>jakarta.*</code> — đây là phần việc migration nặng nhất; công cụ như OpenRewrite có thể tự động hóa phần lớn việc này. Các bổ sung khác gồm hỗ trợ sẵn GraalVM native image giúp khởi động nhanh và tốn ít bộ nhớ hơn, Micrometer Observation API cho metrics và tracing, <code>ProblemDetail</code> theo chuẩn RFC 7807 làm định dạng lỗi thống nhất, và HTTP client dạng khai báo qua interface. Trong thực tế, phần khó nhất khi migration thường là các thư viện bên thứ ba chưa chuyển sang jakarta.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Cả hai đều đăng ký một bean, nhưng khác nhau ở chỗ ai là người tạo ra object. <code>@Component</code> đánh dấu một class để Spring tìm thấy qua việc quét component và tạo ra qua constructor của nó, phù hợp với các class do bạn viết. <code>@Bean</code> là một method bên trong class <code>@Configuration</code>, nơi bạn tự viết đoạn code khởi tạo bằng tay, phù hợp với các kiểu của bên thứ ba hoặc những trường hợp cần cấu hình đặc biệt. Quy tắc đơn giản: dùng <code>@Component</code> cho những class do bạn viết, và dùng <code>@Bean</code> khi class thuộc thư viện bên ngoài hoặc cần logic khởi tạo đặc biệt.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Ở chế độ full <code>@Configuration</code> mặc định, chỉ có một instance được tạo ra, dù đoạn code trông như đang gọi <code>new</code> hai lần. Spring dùng CGLIB tạo một subclass của config class và override từng method <code>@Bean</code> để kiểm tra container trước: nếu bean đã tồn tại thì trả về singleton sẵn có thay vì chạy lại thân method — đây cũng là lý do method <code>@Bean</code> không được phép private hay final. Khi đặt <code>proxyBeanMethods = false</code> (chế độ lite), subclass đó không còn nữa, các lời gọi giữa những method @Bean trở thành lời gọi Java bình thường và tạo ra object trùng lặp, không được container quản lý — ví dụ điển hình là một connection pool thứ hai. Chế độ lite giúp khởi động nhanh hơn và cần cho native image; thói quen an toàn là khai báo dependency dưới dạng tham số của method <code>@Bean</code> — như vậy dù chạy ở chế độ nào kết quả vẫn đúng.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Scope mặc định là singleton, nghĩa là mỗi context chỉ có một instance dùng chung; prototype tạo một instance mới mỗi lần được yêu cầu, còn request, session và application là các scope dành cho web. Bản thân một singleton không thread-safe, vì Spring chỉ đảm bảo một instance chứ không đảm bảo đồng bộ hóa. Trên thực tế singleton chỉ an toàn khi nó stateless: các dependency là final và không có field có thể thay đổi giá trị. State thay đổi theo từng request thì nên dùng biến cục bộ, các cấu trúc atomic/concurrent, hoặc bean scope request — đừng lưu vào field của singleton.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Chỉ một instance được tạo ra. Scope được phân giải lúc inject, chứ không phải lúc gọi, nên singleton chỉ xin prototype đúng một lần lúc khởi động, giữ tham chiếu đó mãi và không bao giờ xin lại — hành vi "mỗi lần dùng một instance mới" bị mất, và state bị dùng chung ngoài ý muốn giữa các request. Cách khắc phục là thay vì inject thẳng instance, hãy inject một "cách lấy instance mới": <code>ObjectProvider</code> rồi gọi <code>getObject()</code>, method <code>@Lookup</code>, hoặc scoped proxy — đây cũng chính là cơ chế giúp bean scope request và session dùng được bên trong singleton. Lưu ý thêm: Spring không quản lý việc hủy prototype, nên <code>@PreDestroy</code> không bao giờ chạy trên prototype.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Thứ tự vòng đời: constructor chạy trước, rồi đến dependency injection, sau đó là <code>@PostConstruct</code> khi mọi dependency đã được inject xong, và <code>@PreDestroy</code> lúc shutdown. Nên ưu tiên <code>@PostConstruct</code> và <code>@PreDestroy</code> vì đây là annotation chuẩn, không buộc bean phải implement các interface <code>InitializingBean</code> và <code>DisposableBean</code> của Spring. Vì constructor chạy trước bước injection, nếu bạn dùng một field được inject ngay trong constructor thì field đó vẫn còn null. Constructor injection tránh được vấn đề này, vì dependency được truyền vào ngay qua tham số của constructor.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Thứ tự là constructor, dependency injection, các callback Aware, <code>BeanPostProcessor.postProcessBeforeInitialization</code>, <code>@PostConstruct</code>, <code>afterPropertiesSet()</code>, custom init-method, rồi đến <code>postProcessAfterInitialization</code>; lúc shutdown thì là <code>@PreDestroy</code>, <code>destroy()</code>, rồi custom destroy-method. Điểm mấu chốt là các AOP proxy cho <code>@Transactional</code> và <code>@Async</code> được tạo ra trong <code>postProcessAfterInitialization</code>, tức bước khởi tạo cuối cùng, nên các bước trước đó bao gồm cả <code>@PostConstruct</code> đều thấy bean thô, chưa được bọc proxy. Đó là lý do vì sao gọi một method <code>@Transactional</code> từ <code>@PostConstruct</code> lại chạy mà không có transaction. Constructor chạy trước bước injection — đó cũng là lý do field <code>@Autowired</code> vẫn còn null bên trong constructor.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Constructor injection là lựa chọn mặc định được khuyến nghị. Nó cho phép khai báo dependency là <code>final</code>, nên bean bất biến và không bao giờ tồn tại ở trạng thái khởi tạo dở dang; class cũng dễ unit test vì chỉ cần <code>new</code> bình thường; và nếu thiếu dependency thì ứng dụng báo lỗi ngay lúc khởi động. Field injection không được khuyến khích vì field không thể là final, muốn test phải dùng reflection hoặc khởi động container, và nó che giấu vấn đề thiết kế: một constructor có quá nhiều tham số là tín hiệu rõ ràng rằng class đang ôm quá nhiều việc, còn nhiều field <code>@Autowired</code> thì dễ bị bỏ qua. Setter injection chỉ dành cho trường hợp hiếm hoi khi dependency thật sự là optional.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Với field hoặc setter injection, Spring có thể giải quyết circular dependency nhờ cơ chế cache ba tầng: tạo bean thô trước, đưa ra một tham chiếu sớm (early reference), rồi hoàn thiện bean sau. Constructor injection thì không giải quyết được theo cách này, vì bean nào cũng đòi bean kia phải hoàn chỉnh trước rồi mới khởi tạo được, nên ứng dụng khởi động thất bại với <code>BeanCurrentlyInCreationException</code>; từ Boot 2.6 trở đi, circular dependency bị từ chối theo mặc định. Lỗi này thực ra lại có ích, vì circular dependency thường là dấu hiệu của thiết kế chưa tốt. Cách xử lý đúng là refactor — chẳng hạn tách phần logic dùng chung sang một bean thứ ba, hoặc dùng application event — thay vì bật các tùy chọn né tránh.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Spring chỉ inject vào những object do chính nó tạo ra, nên một field <code>@Autowired</code> bị null thường có nghĩa là object đó không phải do container tạo. Nguyên nhân phổ biến nhất là dùng <code>new</code> để tạo một bean thay vì inject nó. Những nguyên nhân khác gồm: field khai báo <code>static</code>, dùng field ngay trong constructor khi injection chưa chạy, class không được đăng ký làm bean hoặc nằm ngoài phạm vi package được quét, hoặc object do một framework khác tạo ra — như JPA entity hay DTO được Jackson deserialize. Constructor injection giúp ích ở chỗ nó biến những lỗi null âm thầm này thành lỗi rõ ràng ngay lúc khởi động.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>AOP có sáu thuật ngữ và một cơ chế. <strong>Aspect</strong> là class chứa phần code cross-cutting (dùng chung cho nhiều nơi như logging, transaction), <strong>join point</strong> là điểm mà code đó có thể được áp dụng (trong Spring luôn là một lời gọi method của bean), <strong>pointcut</strong> là biểu thức chọn ra các join point, còn <strong>advice</strong> là đoạn code sẽ chạy — before, after returning, after throwing, after (finally), hoặc around. <strong>Weaving</strong> là cách gắn advice vào đối tượng đích: Spring thực hiện lúc runtime bằng cách bọc bean trong một <strong>proxy</strong> — JDK dynamic proxy khi bean có interface, CGLIB khi không có. Mọi "bất ngờ" của AOP đều bắt nguồn từ chính cơ chế đó: advice chỉ áp dụng cho lời gọi đi qua proxy, nên lời gọi nội bộ trong cùng object (self-invocation) hay method private, static, final sẽ không bao giờ được áp dụng advice. Hai câu cần nhớ: pointcut = chạy ở đâu, advice = chạy cái gì; và nếu lời gọi không đi ra khỏi object thì không có proxy nào trên đường đi, nên sẽ không có gì xảy ra cả.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>AOP tách các cross-cutting concern như logging, security, transaction, caching và retry ra khỏi code nghiệp vụ và đưa vào các aspect bao quanh lời gọi method bằng advice như <code>@Around</code>. Bên trong, Spring triển khai AOP bằng proxy chứ không phải weaving bytecode: trong lúc tạo bean, một <code>BeanPostProcessor</code> kiểm tra xem có aspect nào khớp với bean không; nếu có, nó trả về một proxy thay cho bean đó — JDK dynamic proxy khi bean có interface, CGLIB subclass khi không — và container sẽ inject proxy này vào mọi nơi dùng bean. Mỗi lời gọi bị chặn sẽ chạy qua một chuỗi interceptor rồi mới đến object thật; đó chính là cách <code>@Transactional</code>, <code>@Cacheable</code>, <code>@Async</code> và <code>@PreAuthorize</code> hoạt động. Hệ quả là hạn chế mà ai cũng từng gặp: chỉ những lời gọi đi qua proxy mới được áp dụng advice, nên lời gọi nội bộ trong cùng object hay method private, static, final sẽ âm thầm bị bỏ qua.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Đây là ba tầng chặn request khác nhau; chọn tầng nào tùy vào lượng ngữ cảnh bạn cần. Servlet Filter chạy ở tầng container, trước cả khi Spring nhìn thấy request, và làm việc trực tiếp trên request/response thô — phù hợp cho CORS, nén dữ liệu và Spring Security. <code>HandlerInterceptor</code> chạy bên trong DispatcherServlet và biết được controller nào sẽ xử lý request — phù hợp cho rate limiting, locale và audit theo từng controller. AOP thì bọc quanh chính lời gọi method của bean, thấy được tham số và giá trị trả về — phù hợp cho <code>@Transactional</code>, <code>@Cacheable</code> và đo thời gian chạy của các method tầng service.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>@Transactional</code> bọc method trong một transaction: bắt đầu trước khi method chạy, commit khi method trả về bình thường, rollback khi có lỗi — và cơ chế này được thực hiện qua proxy. Theo mặc định nó chỉ rollback với unchecked exception; checked exception vẫn commit trừ khi bạn khai báo <code>rollbackFor</code> — đây là nguyên nhân phổ biến gây lỗi dữ liệu một cách âm thầm. Lời gọi nội bộ trong cùng object, cũng như method private hoặc final, không đi qua proxy nên annotation bị bỏ qua. Về propagation: REQUIRED tham gia vào transaction của bên gọi, REQUIRES_NEW chạy một transaction độc lập, còn NESTED dùng savepoint; transaction nên giữ càng ngắn càng tốt để tránh cạn kiệt connection pool.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Vì transaction nằm ở proxy chứ không nằm trong chính object. Spring bọc bean trong một proxy; proxy mở và commit transaction quanh lời gọi rồi mới ủy quyền cho object thật (target). Do đó lời gọi <code>this.method()</code> đi thẳng vào object thật, bỏ qua proxy — nghĩa là bỏ qua transaction mà không hề có lỗi hay cảnh báo nào. Method private không thể bị override, method final không thể bị CGLIB override, nên cả hai cũng bị bỏ qua vì cùng một lý do. Cách khắc phục sạch nhất là tách method đó sang một bean riêng để lời gọi buộc phải đi qua proxy; quy tắc này cũng giải thích luôn cho <code>@Async</code>, <code>@Cacheable</code> và <code>@Retryable</code>.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>@RequestMapping</code> đặt trên class sẽ định nghĩa đường dẫn gốc, còn <code>@GetMapping</code>, <code>@PostMapping</code> và các annotation tương tự là dạng viết tắt cho từng HTTP method. <code>@PathVariable</code> đọc giá trị từ đường dẫn URL, <code>@RequestParam</code> đọc giá trị từ query string hoặc form, còn <code>@RequestBody</code> dùng Jackson chuyển body JSON thành object. Kết hợp <code>@RequestBody</code> với <code>@Valid</code> giúp chặn dữ liệu không hợp lệ ngay từ đầu và trả về response 400 rõ ràng.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Việc xử lý lỗi cho REST được tập trung vào một class <code>@RestControllerAdvice</code> duy nhất, nhờ đó controller không cần try/catch. Mỗi method <code>@ExceptionHandler</code> ánh xạ một loại exception thành một HTTP response cho tất cả controller, và handler cụ thể nhất sẽ được chọn trước. Spring Boot 3 có thể trả về body dạng <code>ProblemDetail</code> theo chuẩn RFC 7807. Tuyệt đối không gửi stack trace về cho client; và lưu ý advice này chỉ bắt được exception ném ra bên trong Spring MVC, không bắt được exception phát sinh từ servlet Filter.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Validation nên thực hiện ngay ở lớp ngoài cùng: đặt các constraint Jakarta như <code>@NotBlank</code>, <code>@Email</code> và <code>@Min</code> lên DTO để dữ liệu không hợp lệ bị chặn trước khi vào tầng nghiệp vụ. <code>@Valid</code> đặt trên tham số của controller sẽ kích hoạt validation và tự động kiểm tra cả các object lồng bên trong (cascade); khi dữ liệu sai, Spring ném <code>MethodArgumentNotValidException</code> và bạn có thể chuyển nó thành response 400 kèm chi tiết lỗi từng field. <code>@Valid</code> là annotation chuẩn của Jakarta và hỗ trợ cascade, còn <code>@Validated</code> là của Spring — nó bổ sung validation group và có thể dùng để kiểm tra tham số method trên các bean service. Những quy tắc mà constraint có sẵn không mô tả được thì viết annotation tùy chỉnh kèm một <code>ConstraintValidator</code>.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Với code blocking mới, lựa chọn mặc định hiện đại là <code>RestClient</code>, được thêm vào từ Boot 3.2, nó có API dạng fluent mà không kéo theo cả tầng reactive. <code>RestTemplate</code> đang ở chế độ maintenance nên không dùng cho code mới, còn <code>WebClient</code> phù hợp nhất cho các tác vụ reactive hoặc streaming. <code>FeignClient</code> theo kiểu khai báo qua interface, phù hợp với hệ thống đã dùng Spring Cloud vì có sẵn service discovery và load balancing. Dù dùng client nào, hãy luôn đặt rõ connect timeout và read timeout, kèm retry và circuit breaker (ví dụ Resilience4j) để một dependency chậm không kéo sập cả hệ thống.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Spring MVC dùng mô hình blocking, mỗi request một thread, trên nền Servlet API, còn WebFlux thì non-blocking và reactive, chạy trên một event loop với Netty, và trả về <code>Mono</code> cùng <code>Flux</code>. WebFlux phù hợp với các tác vụ I/O có độ đồng thời cao: rất nhiều kết nối cùng lúc, streaming, hoặc gateway gọi tới nhiều service. Ứng dụng phải reactive từ đầu đến cuối, vì chỉ cần một lời gọi blocking cũng có thể làm nghẽn event loop. Virtual thread của Java 21 giờ đã cho MVC khả năng mở rộng tương đương với tác vụ I/O, nên hiện nay chủ yếu chỉ cần đến WebFlux khi bạn thật sự cần backpressure hoặc streaming.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Spring Data hỗ trợ phân trang bằng cách để một method của repository nhận một <code>Pageable</code> và trả về một <code>Page</code>, nó sẽ chạy cả câu truy vấn dữ liệu lẫn câu truy vấn đếm. Controller gắn các tham số <code>page</code>, <code>size</code> và <code>sort</code> vào một <code>PageRequest</code>. Phân trang theo offset càng về các trang sâu càng chậm, vì database vẫn phải quét qua rồi vứt bỏ toàn bộ các dòng bị bỏ qua, và kết quả có thể bị xô lệch nếu dữ liệu thay đổi giữa hai lần truy vấn. Với tập dữ liệu lớn, phân trang theo keyset như <code>WHERE id &gt; :lastId ORDER BY id</code> luôn giữ được tốc độ ổn định.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Đây là các annotation caching theo kiểu khai báo (declarative), hoạt động qua AOP sau khi bật <code>@EnableCaching</code>. <code>@Cacheable</code> kiểm tra cache trước và chỉ chạy method khi cache miss, <code>@CachePut</code> luôn chạy method và cập nhật lại entry, còn <code>@CacheEvict</code> xóa entry khỏi cache — nên đặt trên các method ghi dữ liệu để tránh cache bị cũ. Vì dựa trên proxy, gọi các method này từ bên trong cùng một object sẽ không đi qua cache. Khi chạy nhiều instance, cache trong bộ nhớ của từng instance sẽ lệch nhau, nên hãy dùng một cache tập trung như Redis để mọi instance chia sẻ chung.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>@Async</code> khiến một method chạy trên một thread riêng và trả về ngay lập tức, có thể là void cho kiểu fire-and-forget hoặc một <code>CompletableFuture</code> khi cần kết quả. Giống như <code>@Transactional</code>, nó dựa trên proxy, nên gọi nó từ bên trong cùng một class sẽ chạy đồng bộ. Executor mặc định không có giới hạn và tạo thread mới cho mỗi lời gọi, nên luôn phải tự cấu hình một <code>ThreadPoolTaskExecutor</code> có giới hạn, kèm queue và rejection policy. Exception ném ra từ method @Async trả về void sẽ bị nuốt mất, trừ khi bạn đăng ký một <code>AsyncUncaughtExceptionHandler</code>.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>@Scheduled</code>, được bật bởi <code>@EnableScheduling</code>, cung cấp ba chế độ: <code>fixedRate</code> chạy theo khoảng cố định tính theo đồng hồ, <code>fixedDelay</code> chờ một khoảng sau khi lần chạy trước kết thúc, còn <code>cron</code> dùng cho lịch chạy theo mốc thời gian cụ thể (ví dụ 2 giờ sáng các ngày trong tuần). Biểu thức cron của Spring có thêm trường giây ở đầu, nên gồm sáu trường. Scheduler mặc định chỉ có một thread, nên một tác vụ chạy lâu sẽ chặn các tác vụ khác; với <code>fixedRate</code>, nếu một lần chạy lâu hơn khoảng lặp thì các lần chạy sẽ bị dồn ứ. Khi deploy nhiều instance (cluster), instance nào cũng chạy cùng một job, nên cần công cụ như ShedLock hoặc Quartz để đảm bảo job chỉ chạy trên một instance.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Application event tách các side effect ra khỏi luồng xử lý chính: bên phát event không cần biết ai đang lắng nghe, và điều này còn giúp phá vỡ circular dependency giữa các service. Một <code>@EventListener</code> thông thường chạy ngay bên trong transaction, nên nếu gửi email ở đó thì khách có thể nhận được email xác nhận cho một đơn hàng mà sau đó lại bị rollback. <code>@TransactionalEventListener</code> với <code>AFTER_COMMIT</code> chỉ chạy sau khi commit thành công, nhờ đó tránh được vấn đề trên. Những event này chỉ tồn tại trong cùng JVM, giao theo kiểu at-most-once và sẽ mất nếu ứng dụng crash, nên khi cần đảm bảo giao nhận thật sự thì phải dùng outbox pattern kèm message broker.</p></details>
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
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Các annotation test nên khớp với tầng đang được kiểm thử để tránh nạp toàn bộ ứng dụng mỗi lần. <code>@SpringBootTest</code> nạp toàn bộ context cho integration test nên chạy chậm — chỉ dùng khi thật sự cần. <code>@WebMvcTest</code> chỉ nạp tầng web cùng MockMvc và mock tầng service bên dưới — nhanh và tập trung vào hành vi của controller. <code>@DataJpaTest</code> chỉ nạp tầng repository với database dành cho test và tự rollback sau mỗi test. Tỷ lệ hợp lý là nhiều unit test và slice test, kèm một ít integration test đầy đủ.</p></details>
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

      // ──── 10. REST DESIGN & WEB EXTRAS ────
      {
        q: 'What is the difference between @Controller and @RestController?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p><code>@RestController</code> is simply <code>@Controller</code> + <code>@ResponseBody</code>. With <code>@Controller</code>, a returned String is treated as a view name to render (Thymeleaf, JSP); with <code>@RestController</code>, every return value is serialized into the response body as JSON via Jackson. Use <code>@Controller</code> for server-rendered HTML and <code>@RestController</code> for REST APIs; a single method inside a <code>@Controller</code> can still return JSON by adding <code>@ResponseBody</code> on that method.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>@RestController</code> thực chất là <code>@Controller</code> cộng thêm <code>@ResponseBody</code>. Khác biệt nằm ở cách xử lý giá trị trả về: với <code>@Controller</code>, chuỗi trả về được hiểu là <strong>tên view</strong> cần render (Thymeleaf, JSP...), còn với <code>@RestController</code>, mọi giá trị trả về đều được Jackson chuyển thành <strong>JSON</strong> và ghi thẳng vào body của response. Làm REST API thì dùng <code>@RestController</code>; làm web render HTML phía server thì dùng <code>@Controller</code>. Nếu trong một <code>@Controller</code> có method muốn trả JSON thì chỉ cần thêm <code>@ResponseBody</code> lên method đó.</p></details>
<pre>@Controller
public class PageController {
    @GetMapping("/home")
    public String home(Model model) { return "home"; }    // → renders home.html

    @GetMapping("/api/ping")
    @ResponseBody                                          // this ONE method returns JSON
    public Map&lt;String, String&gt; ping() { return Map.of("status", "ok"); }
}

@RestController                     // every method returns data, never a view
public class UserApi {
    @GetMapping("/api/users/{id}")
    public UserDto get(@PathVariable Long id) { ... }      // → JSON body
}</pre>
<div class="key-point">@RestController = @Controller + @ResponseBody: return values go through HttpMessageConverter (Jackson) into the response body instead of through the view resolver.</div>`,
      },
      {
        q: 'What is ResponseEntity and when should you use it?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p><code>ResponseEntity&lt;T&gt;</code> represents the complete HTTP response — status code, headers, and body — giving you explicit control over all three. Returning a plain object always produces 200 with default headers; ResponseEntity lets you return 201 with a Location header on create, 404 with no body, or custom cache headers. When you don't need to customize anything, returning the plain object keeps the code cleaner.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>ResponseEntity&lt;T&gt;</code> đại diện cho <strong>toàn bộ HTTP response</strong>: status code, header và body — cho phép bạn chủ động quyết định cả ba. Nếu chỉ trả về object thường, Spring luôn trả 200 với header mặc định; còn với ResponseEntity bạn có thể trả 201 kèm header Location khi tạo mới, 404 không có body khi không tìm thấy, hay thêm header cache tùy ý. Khi không cần tùy chỉnh gì thì cứ trả object thường cho code gọn.</p></details>
<pre>@PostMapping("/users")
public ResponseEntity&lt;UserDto&gt; create(@Valid @RequestBody CreateUserRequest req) {
    UserDto created = userService.create(req);
    return ResponseEntity
        .created(URI.create("/api/users/" + created.id()))   // 201 + Location header
        .body(created);
}

@GetMapping("/users/{id}")
public ResponseEntity&lt;UserDto&gt; get(@PathVariable Long id) {
    return userService.find(id)
        .map(ResponseEntity::ok)                              // 200 + body
        .orElse(ResponseEntity.notFound().build());           // 404, no body
}</pre>
<div class="key-point">Plain return = fixed 200. ResponseEntity = you choose status + headers + body. Common pattern: 201 + Location for POST, Optional → 200/404 for GET.</div>`,
      },
      {
        q: 'POST vs PUT vs PATCH — differences and what does idempotency mean?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>POST creates a resource (the server assigns the ID; calling it N times creates N records — not idempotent). PUT replaces the whole resource at a known URI — idempotent, repeating it yields the same state. PATCH applies a partial update (only the fields sent). Idempotent means calling the operation N times has the same effect as calling it once — this matters because clients and proxies can safely retry idempotent requests after a network failure. GET, PUT, DELETE are idempotent; POST is not.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>POST</strong> tạo mới resource — server tự sinh ID, gọi N lần sẽ tạo ra N bản ghi, nên <strong>không idempotent</strong>. <strong>PUT</strong> thay thế toàn bộ resource tại một URI đã biết — idempotent: gọi lại bao nhiêu lần thì trạng thái cuối vẫn y như vậy. <strong>PATCH</strong> chỉ cập nhật một phần, đúng những field được gửi lên. <strong>Idempotent</strong> nghĩa là gọi N lần cho cùng kết quả như gọi 1 lần — điều này quan trọng vì khi mạng lỗi giữa chừng, client và proxy được phép <strong>tự động retry</strong> các request idempotent một cách an toàn. GET, PUT, DELETE là idempotent; POST thì không, nên retry POST cần cơ chế riêng (ví dụ idempotency key).</p></details>
<pre>POST   /orders          → create new order, server assigns id   (NOT idempotent)
PUT    /orders/42       → replace order 42 entirely             (idempotent)
PATCH  /orders/42       → update only the sent fields           (partial update)
DELETE /orders/42       → delete; repeating still ends deleted  (idempotent)

// PATCH body: only what changes
{ "status": "SHIPPED" }

// PUT body: the FULL resource — missing fields are considered removed
{ "customerId": 7, "items": [...], "status": "SHIPPED", "note": null }</pre>
<div class="key-point">Interview trap: "why does idempotency matter?" — because retries are safe. For POST retries, real systems use an idempotency key header so a duplicate submit doesn't create a duplicate order.</div>`,
      },
      {
        q: 'What is CORS and how do you configure it in Spring Boot?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>CORS is a browser security mechanism: JavaScript served from origin A calling an API on origin B is blocked unless B's responses carry <code>Access-Control-Allow-*</code> headers; for non-simple requests the browser first sends an OPTIONS preflight. Configure it per controller with <code>@CrossOrigin</code>, globally via <code>WebMvcConfigurer</code>, or — when Spring Security is present — through <code>http.cors()</code> with a <code>CorsConfigurationSource</code>, because the security filter chain rejects the preflight before MVC ever sees it. CORS only affects browsers: Postman and server-to-server calls ignore it.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>CORS là cơ chế bảo vệ <strong>của trình duyệt</strong>: JavaScript chạy ở origin A (ví dụ localhost:3000) gọi API ở origin B (localhost:8080) sẽ bị chặn, trừ khi server B trả về các header <code>Access-Control-Allow-*</code> cho phép. Với các request "không đơn giản" (có header tùy chỉnh, content-type JSON...), trình duyệt còn gửi trước một request OPTIONS gọi là <strong>preflight</strong> để xin phép. Cách cấu hình: <code>@CrossOrigin</code> trên từng controller, hoặc toàn cục qua <code>WebMvcConfigurer</code>; nếu dự án có Spring Security thì <strong>phải cấu hình trong security</strong> (<code>http.cors()</code> + <code>CorsConfigurationSource</code>), vì preflight sẽ bị filter chain chặn trước khi kịp tới MVC. Lưu ý: CORS chỉ là chuyện của trình duyệt — Postman hay các service gọi nhau hoàn toàn không bị ảnh hưởng.</p></details>
<pre>// Global CORS (no Spring Security)
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("https://app.example.com")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowCredentials(true);
    }
}

// With Spring Security — configure it HERE or preflights get rejected
http.cors(cors -> cors.configurationSource(req -> {
    CorsConfiguration cfg = new CorsConfiguration();
    cfg.setAllowedOrigins(List.of("https://app.example.com"));
    cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
    cfg.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    return cfg;
}));</pre>
<div class="key-point">Classic bug: "CORS works until I add Spring Security" — the preflight OPTIONS has no Authorization header, gets 401 from the filter chain, and the browser reports it as a CORS failure. Fix it in http.cors(), not with a servlet filter.</div>`,
      },

      // ──── 11. CONFIGURATION & STARTUP ────
      {
        q: 'Two beans of the same type — how does Spring choose? (@Primary, @Qualifier)',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>With two beans of one type, injection by type is ambiguous and startup fails with <code>NoUniqueBeanDefinitionException</code>. Resolve it by marking one bean <code>@Primary</code> (the default choice), or by selecting explicitly at the injection point with <code>@Qualifier("beanName")</code> — a qualifier always beats @Primary. Injecting <code>List&lt;Interface&gt;</code> collects every implementation, which is the idiomatic base for a strategy pattern.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Khi có hai bean cùng kiểu, Spring không biết phải inject cái nào và ứng dụng chết ngay lúc khởi động với <code>NoUniqueBeanDefinitionException</code>. Có ba cách xử lý: đánh dấu <code>@Primary</code> lên bean muốn làm mặc định; hoặc dùng <code>@Qualifier("tênBean")</code> ngay tại chỗ inject để chọn đích danh — khi cả hai cùng xuất hiện thì <strong>@Qualifier thắng @Primary</strong>; hoặc inject cả danh sách <code>List&lt;PaymentService&gt;</code> để lấy tất cả implementation — đây chính là nền của pattern strategy trong Spring. Tên bean mặc định là tên class viết thường chữ cái đầu (MomoPayment → "momoPayment").</p></details>
<pre>public interface PaymentService { void pay(Order o); }

@Service @Primary
public class CardPayment implements PaymentService { ... }   // the default

@Service("momo")
public class MomoPayment implements PaymentService { ... }

@Service
public class CheckoutService {
    private final PaymentService defaultPay;                  // → CardPayment (@Primary)
    private final PaymentService momoPay;
    private final List&lt;PaymentService&gt; all;                   // → BOTH implementations

    public CheckoutService(PaymentService defaultPay,
                           @Qualifier("momo") PaymentService momoPay,
                           List&lt;PaymentService&gt; all) { ... }
}</pre>
<div class="key-point">@Primary = "use this unless told otherwise"; @Qualifier = "use exactly this one" (and it wins). Injecting List/Map of an interface is how you build pluggable strategies without a single if/else.</div>`,
      },
      {
        q: 'application.properties vs application.yml — and which configuration source wins?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Both formats are equivalent in capability; YAML is hierarchical and avoids repeating prefixes but is whitespace-sensitive, while .properties is flat one-key-per-line. The more important interview point is precedence when the same property appears in several places: command-line arguments beat OS environment variables, which beat profile-specific <code>application-{profile}.yml</code>, which beats the base <code>application.yml</code> packaged in the jar — so operations can override configuration without rebuilding. If both files exist, .properties wins over .yml.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hai định dạng có khả năng như nhau, chỉ khác cú pháp: YAML phân cấp, đỡ lặp lại prefix, nhưng nhạy cảm với thụt lề; .properties phẳng, mỗi dòng một key, khó sai nhưng dài dòng. Điều quan trọng hơn trong phỏng vấn là <strong>thứ tự ưu tiên</strong> khi cùng một property xuất hiện ở nhiều nơi: tham số dòng lệnh (<code>--server.port=9090</code>) &gt; biến môi trường OS (<code>SERVER_PORT</code>) &gt; file theo profile <code>application-{profile}.yml</code> &gt; file gốc <code>application.yml</code> trong jar. Nhờ thứ tự này, đội vận hành có thể override cấu hình lúc deploy mà <strong>không cần build lại</strong>. Chi tiết hay bị hỏi: nếu tồn tại cả hai file thì .properties được ưu tiên hơn .yml.</p></details>
<pre># Same config, two syntaxes
# application.properties
spring.datasource.url=jdbc:postgresql://localhost/app
spring.datasource.username=app

# application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost/app
    username: app

# Precedence (highest wins):
1. command line        java -jar app.jar --server.port=9090
2. OS env vars         SERVER_PORT=9090       (relaxed binding maps it)
3. application-prod.yml   (active profile file)
4. application.yml        (packaged defaults)</pre>
<div class="key-point">Remember the direction: the closer to the actual launch, the higher the priority — code ships defaults, environment overrides them. Env var names use relaxed binding: server.port ⇆ SERVER_PORT.</div>`,
      },
      {
        q: 'How do you run code at application startup? CommandLineRunner vs ApplicationRunner',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Both are functional interfaces whose <code>run()</code> executes exactly once after the ApplicationContext is fully started — typical uses are seeding data, warming caches, or verifying connectivity. The only difference is the argument form: <code>CommandLineRunner</code> receives the raw <code>String[]</code> args, while <code>ApplicationRunner</code> receives a parsed <code>ApplicationArguments</code> (option args like --name=value vs non-option args). Order multiple runners with <code>@Order</code>; an exception thrown from a runner aborts startup.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Cả hai đều là interface có đúng một method <code>run()</code>, chạy <strong>một lần duy nhất sau khi ApplicationContext đã khởi động xong</strong> — thường dùng để seed dữ liệu mẫu, làm nóng cache, hay kiểm tra kết nối tới các hệ thống ngoài. Khác biệt duy nhất là dạng tham số: <code>CommandLineRunner</code> nhận <code>String[]</code> thô, còn <code>ApplicationRunner</code> nhận <code>ApplicationArguments</code> đã được phân tích sẵn thành option (<code>--name=value</code>) và non-option. Có nhiều runner thì xếp thứ tự bằng <code>@Order</code>. Lưu ý: exception ném ra từ runner sẽ làm ứng dụng <strong>dừng khởi động luôn</strong>, nên đừng đặt logic dễ lỗi ở đây mà không bắt exception.</p></details>
<pre>@Component
@Order(1)
public class SeedDataRunner implements CommandLineRunner {
    @Override
    public void run(String... args) {          // raw args
        if (userRepo.count() == 0) userRepo.save(defaultAdmin());
    }
}

@Component
@Order(2)
public class ReportRunner implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments args) {   // parsed args
        if (args.containsOption("rebuild-index")) searchService.rebuild();
    }
}</pre>
<div class="key-point">Both run after the context is ready (all beans built, proxies in place) — safer than doing startup work in @PostConstruct of a random bean, where other beans may not exist yet.</div>`,
      },
      {
        q: 'How do you change the server port or swap embedded Tomcat for Jetty/Undertow?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Set <code>server.port</code> in application.yml, or override at launch with <code>--server.port=8081</code> or the <code>SERVER_PORT</code> environment variable; <code>server.port=0</code> picks a random free port (useful in tests). To swap the server, exclude <code>spring-boot-starter-tomcat</code> from the web starter and add <code>spring-boot-starter-jetty</code> (or undertow) — auto-configuration sees Jetty on the classpath and wires everything else automatically.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Đổi port bằng <code>server.port</code> trong application.yml; lúc chạy có thể override bằng <code>--server.port=8081</code> hoặc biến môi trường <code>SERVER_PORT</code>. Đặt <code>server.port=0</code> để lấy một port ngẫu nhiên còn trống — rất tiện trong integration test để các test chạy song song không giành port của nhau. Muốn đổi Tomcat sang Jetty hay Undertow: exclude <code>spring-boot-starter-tomcat</code> khỏi <code>spring-boot-starter-web</code> rồi thêm starter của server mới — auto-configuration thấy Jetty trên classpath sẽ tự cấu hình toàn bộ phần còn lại, code ứng dụng không phải đổi gì.</p></details>
<pre>&lt;!-- swap Tomcat → Jetty --&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;
    &lt;exclusions&gt;
        &lt;exclusion&gt;
            &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
            &lt;artifactId&gt;spring-boot-starter-tomcat&lt;/artifactId&gt;
        &lt;/exclusion&gt;
    &lt;/exclusions&gt;
&lt;/dependency&gt;
&lt;dependency&gt;
    &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-jetty&lt;/artifactId&gt;
&lt;/dependency&gt;</pre>
<div class="key-point">This question really tests whether you understand conditional auto-configuration: the server is chosen by what's on the classpath, which is why an exclude + one dependency is the whole migration.</div>`,
      },
      {
        q: 'What is graceful shutdown and how do you enable it in Spring Boot?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Graceful shutdown means that on a stop signal (SIGTERM) the application stops accepting new requests but lets in-flight requests finish before exiting, instead of cutting them off. Enable it with <code>server.shutdown=graceful</code> and cap the wait with <code>spring.lifecycle.timeout-per-shutdown-phase</code> (default 30s). It matters most for rolling deployments on Kubernetes — combined with a preStop hook and readiness probe, no request is dropped mid-flight during a deploy.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Graceful shutdown nghĩa là khi nhận tín hiệu dừng (SIGTERM), ứng dụng <strong>ngừng nhận request mới nhưng chờ các request đang xử lý chạy xong</strong> rồi mới tắt, thay vì cắt ngang giữa chừng. Bật bằng <code>server.shutdown=graceful</code>, và giới hạn thời gian chờ tối đa qua <code>spring.lifecycle.timeout-per-shutdown-phase</code> (mặc định 30 giây — quá hạn thì vẫn tắt). Tình huống quan trọng nhất là rolling deploy trên Kubernetes: kết hợp với preStop hook và readiness probe để pod bị loại khỏi load balancer trước, xử lý nốt request đang dở, rồi mới bị kill — người dùng không thấy bất kỳ request nào bị rớt khi deploy.</p></details>
<pre># application.yml
server:
  shutdown: graceful
spring:
  lifecycle:
    timeout-per-shutdown-phase: 30s

# What happens on SIGTERM:
1. stop accepting new connections
2. in-flight requests keep running (up to the timeout)
3. @PreDestroy hooks run, context closes, JVM exits

# Kubernetes pairing:
readinessProbe → pod removed from Service endpoints first
preStop sleep  → small delay so LB config propagates before SIGTERM</pre>
<div class="key-point">Without this, every deploy is a mini-outage: whatever was executing when the pod died returned connection-reset to users. One property fixes it — a favorite "production experience" question.</div>`,
      },

      // ──── 12. SPRING DATA JPA & PERSISTENCE ────
      {
        q: 'What is Spring Data JPA? Explain the repository hierarchy (CrudRepository vs JpaRepository).',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Spring Data JPA generates repository implementations at runtime from interfaces you declare — you write no CRUD code at all. The hierarchy: <code>Repository</code> (marker) → <code>CrudRepository</code> (basic CRUD, returns Iterable) → <code>PagingAndSortingRepository</code> (adds paging and sorting) → <code>JpaRepository</code> (adds JPA specifics: <code>flush()</code>, <code>deleteAllInBatch()</code>, <code>getReferenceById()</code>, and returns List). In practice, extending <code>JpaRepository</code> is the standard choice.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Spring Data JPA <strong>tự sinh implementation cho repository lúc runtime</strong> — bạn chỉ khai báo interface, không phải viết một dòng code CRUD nào. Cây kế thừa: <code>Repository</code> (interface đánh dấu, không có method) → <code>CrudRepository</code> (CRUD cơ bản: save, findById, delete..., trả về Iterable) → <code>PagingAndSortingRepository</code> (thêm phân trang và sắp xếp) → <code>JpaRepository</code> (thêm các method đặc thù của JPA như <code>flush()</code>, <code>deleteAllInBatch()</code>, <code>getReferenceById()</code>, và trả về List cho tiện dùng). Thực tế cứ extends <code>JpaRepository</code> là đủ cho hầu hết nhu cầu; tách interface nhỏ hơn chỉ khi muốn giới hạn repository chỉ đọc chẳng hạn.</p></details>
<pre>public interface UserRepository extends JpaRepository&lt;User, Long&gt; {
    // save, findById, findAll, deleteById... all inherited — zero code
    Optional&lt;User&gt; findByEmail(String email);          // derived query — also zero code
}

Repository (marker)
  └─ CrudRepository          save / findById / findAll / delete  (Iterable)
       └─ PagingAndSortingRepository   findAll(Pageable), findAll(Sort)
            └─ JpaRepository           List returns, flush(), saveAndFlush(),
                                       deleteAllInBatch(), getReferenceById()</pre>
<div class="key-point">Follow-up they like: getReferenceById() returns a lazy proxy WITHOUT hitting the DB — perfect for setting a foreign key (order.setUser(userRepo.getReferenceById(id))) with no extra SELECT.</div>`,
      },
      {
        q: 'How do derived query methods and @Query work in Spring Data JPA?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Spring Data parses the method name — <code>findByEmailAndStatusOrderByCreatedAtDesc</code> — and generates the query from it. When the name gets long or the condition complex, switch to <code>@Query</code> with JPQL (written against entities, not tables); add <code>nativeQuery = true</code> for database-specific SQL. UPDATE/DELETE queries additionally need <code>@Modifying</code> and must run in a transaction. Rule of thumb: if the method name no longer fits on one line, it should be a @Query.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Spring Data <strong>phân tích tên method để tự sinh query</strong>: <code>findByEmailAndStatusOrderByCreatedAtDesc</code> sẽ thành câu SELECT tương ứng, hỗ trợ các từ khóa như And, Or, Between, Like, In, OrderBy... Khi tên method quá dài hoặc điều kiện phức tạp thì chuyển sang <code>@Query</code> viết JPQL — lưu ý JPQL viết trên <strong>entity và field</strong>, không phải tên bảng và cột; cần tính năng riêng của database thì thêm <code>nativeQuery = true</code>. Query UPDATE/DELETE phải kèm <code>@Modifying</code> và chạy trong transaction. Kinh nghiệm thực tế: tên method dài quá một dòng là lúc nên đổi sang @Query cho dễ đọc và dễ review.</p></details>
<pre>public interface OrderRepository extends JpaRepository&lt;Order, Long&gt; {

    // 1. Derived query — generated from the method name
    List&lt;Order&gt; findByStatusAndTotalGreaterThan(Status status, BigDecimal min);

    // 2. JPQL — entity names and fields, not table names
    @Query("select o from Order o join fetch o.items where o.customer.id = :cid")
    List&lt;Order&gt; findWithItemsByCustomer(@Param("cid") Long customerId);

    // 3. Native SQL — when you need DB-specific features
    @Query(value = "select * from orders where total &gt; :min for update skip locked",
           nativeQuery = true)
    List&lt;Order&gt; lockNextBatch(@Param("min") BigDecimal min);

    // 4. Update — needs @Modifying + a transaction
    @Modifying
    @Query("update Order o set o.status = :s where o.id = :id")
    int updateStatus(@Param("id") Long id, @Param("s") Status s);
}</pre>
<div class="key-point">Derived names for simple lookups, JPQL @Query for joins/projections, native only when JPQL can't express it. @Modifying without a transaction is a classic runtime error.</div>`,
      },
      {
        q: 'What is the N+1 query problem and how do you fix it?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>N+1 happens when you load N parent rows with one query, then iterate and touch a lazy relation on each — triggering N additional queries, so a list of 1000 orders becomes 1001 database calls. Detect it by enabling SQL logging and counting. Fixes: <code>JOIN FETCH</code> in JPQL to load parents and children in one query; <code>@EntityGraph</code> on the repository method; or <code>default_batch_fetch_size</code> so Hibernate batches lazy loads into IN (...) queries. Do not "fix" it by switching to EAGER — that hides the problem and makes every other query heavier.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>N+1 xảy ra khi bạn load N bản ghi cha bằng <strong>1 query</strong>, rồi vòng lặp chạm vào quan hệ lazy của từng bản ghi, làm phát sinh thêm <strong>N query con</strong> — tổng cộng N+1: danh sách 1000 đơn hàng thành 1001 lần gọi database, chậm mà nhìn code không thấy gì sai. Cách phát hiện: bật log SQL rồi đếm số query cho một request. Cách sửa: dùng <code>JOIN FETCH</code> trong JPQL để lấy cả cha lẫn con trong một query; hoặc <code>@EntityGraph</code> trên method repository; hoặc đặt <code>default_batch_fetch_size</code> để Hibernate gom các lần load lazy thành query <code>IN (...)</code> — từ 1001 query còn khoảng 11. <strong>Đừng sửa bằng cách chuyển sang EAGER</strong> — nó chỉ giấu vấn đề và bắt mọi query khác gánh thêm dữ liệu không cần.</p></details>
<pre>// The bug — looks innocent:
List&lt;Order&gt; orders = orderRepo.findAll();            // 1 query
for (Order o : orders) {
    total += o.getItems().size();                     // +1 query PER order (lazy!)
}

// Fix 1 — JOIN FETCH: one query, orders + items together
@Query("select distinct o from Order o join fetch o.items")
List&lt;Order&gt; findAllWithItems();

// Fix 2 — @EntityGraph: same effect, declarative
@EntityGraph(attributePaths = "items")
List&lt;Order&gt; findAll();

// Fix 3 — batch lazy loading (global safety net)
spring.jpa.properties.hibernate.default_batch_fetch_size: 100
// → children loaded via IN (id1..id100): 1001 queries become ~11</pre>
<div class="key-point">Senior answer names the detection step (count queries in SQL log / datasource-proxy) before the fix. JOIN FETCH for the specific hot path, batch_fetch_size as the app-wide safety net.</div>`,
      },
      {
        q: 'FetchType.LAZY vs EAGER — defaults, best practice, and LazyInitializationException',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>LAZY loads a relation only when first accessed; EAGER loads it immediately with the owning entity. JPA defaults: <code>@ManyToOne</code>/<code>@OneToOne</code> are EAGER, <code>@OneToMany</code>/<code>@ManyToMany</code> are LAZY. Best practice is to make everything LAZY and fetch explicitly per query (JOIN FETCH / @EntityGraph), because EAGER taxes every query whether or not the data is used. <code>LazyInitializationException</code> is thrown when a lazy relation is touched after the session closed — typically while Jackson serializes an entity in the controller. Boot's open-in-view default masks this at the cost of holding the connection through the whole request; disable it and fetch what you need in the service layer.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>LAZY</strong> nghĩa là quan hệ chỉ được load khi bạn thật sự chạm vào nó; <strong>EAGER</strong> là load ngay cùng lúc với entity. Mặc định của JPA: <code>@ManyToOne</code> và <code>@OneToOne</code> là EAGER, <code>@OneToMany</code> và <code>@ManyToMany</code> là LAZY. Best practice: để <strong>tất cả là LAZY</strong>, rồi chủ động fetch đúng cái cần cho từng query bằng JOIN FETCH hoặc @EntityGraph — vì EAGER bắt mọi query đều gánh thêm dữ liệu dù có dùng hay không. <code>LazyInitializationException</code> xảy ra khi chạm vào quan hệ lazy lúc session đã đóng — điển hình là lúc Jackson serialize entity ở tầng controller. Spring Boot mặc định bật open-in-view để che lỗi này, nhưng cái giá là giữ connection suốt cả request; nên tắt (<code>spring.jpa.open-in-view=false</code>) và fetch đầy đủ ngay trong tầng service — dùng DTO thì tự nhiên hết luôn lỗi này.</p></details>
<pre>@Entity
public class Order {
    @ManyToOne(fetch = FetchType.LAZY)     // override the EAGER default!
    private Customer customer;

    @OneToMany(mappedBy = "order")          // LAZY by default — good
    private List&lt;OrderItem&gt; items;
}

// LazyInitializationException in the wild:
@GetMapping("/orders/{id}")
public Order get(@PathVariable Long id) {
    return orderRepo.findById(id).orElseThrow();
    // Jackson later calls order.getItems() → session closed → 💥
}

# The honest setup:
spring.jpa.open-in-view: false     # stop masking the problem
# then: fetch in the service (JOIN FETCH) and return a DTO</pre>
<div class="key-point">One-liner: "everything LAZY, fetch per use-case, OSIV off, DTO out." Mentioning WHY open-in-view is bad (connection held during rendering/serialization) marks the senior answer.</div>`,
      },
      {
        q: 'Why should you not return JPA entities directly from a REST API? (Entity vs DTO)',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>An entity maps a database table; a DTO is the shape you want clients to see — different jobs. Returning entities leaks new columns automatically (security), couples your API contract to the schema so a DB refactor breaks clients, and invites Jackson problems: LazyInitializationException on unfetched relations and infinite recursion on bidirectional ones. Keep controllers DTO-only and map with MapStruct (or manual mappers); requests get their own DTOs with validation annotations.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Entity là ánh xạ của bảng trong database, còn DTO là <strong>hình dạng dữ liệu bạn muốn cho client thấy</strong> — hai vai trò khác nhau. Trả thẳng entity ra API có ba rủi ro lớn: thứ nhất, bảng thêm cột mới là API tự động lộ cột đó ra ngoài (đã có nhiều sự cố lộ password hash kiểu này); thứ hai, hợp đồng API bị dính chặt vào schema — đổi cấu trúc database là vỡ luôn client; thứ ba, Jackson serialize entity rất dễ dính <code>LazyInitializationException</code> với quan hệ chưa fetch, hoặc <strong>đệ quy vô hạn</strong> với quan hệ hai chiều (Order → Items → Order → ...). Vì vậy tầng controller chỉ nhận và trả DTO; việc chuyển đổi giao cho mapper như MapStruct để không phải viết tay. Request cũng có DTO riêng kèm validation — không bind thẳng dữ liệu người dùng vào entity.</p></details>
<pre>// DTO — exactly what the client needs, nothing more
public record OrderDto(Long id, String status, BigDecimal total,
                       List&lt;OrderItemDto&gt; items) {}

// MapStruct — mapper generated at compile time
@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrderDto toDto(Order order);
}

@RestController
public class OrderController {
    @GetMapping("/orders/{id}")
    public OrderDto get(@PathVariable Long id) {
        return mapper.toDto(orderService.getWithItems(id));   // entity never escapes
    }
}</pre>
<div class="key-point">Three reasons, in interview order: security (new columns leak), API-schema coupling, serialization traps (lazy + bidirectional recursion). @JsonIgnore on entities is a band-aid, not the fix.</div>`,
      },
      {
        q: 'Optimistic vs pessimistic locking — how do you handle concurrent updates?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Optimistic locking adds a <code>@Version</code> column: every UPDATE carries WHERE version = ?, so if another transaction changed the row first, zero rows match and Spring throws <code>OptimisticLockingFailureException</code> — you retry or tell the user. No DB locks held; ideal when conflicts are rare. Pessimistic locking (<code>@Lock(PESSIMISTIC_WRITE)</code> → SELECT ... FOR UPDATE) locks the row at read time so others wait — certain, but reduces throughput and can deadlock; right for hot contention like inventory decrement. Rule: conflicts rare → optimistic; hot rows → pessimistic.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Đây là hai chiến lược xử lý khi nhiều transaction cùng sửa một bản ghi. <strong>Optimistic lock</strong>: thêm field <code>@Version</code> vào entity; mỗi lần update Hibernate tự kèm điều kiện <code>WHERE version = ?</code> — nếu ai đó đã sửa trước thì version bị lệch, update trúng 0 dòng và Spring ném <code>OptimisticLockingFailureException</code> để bạn retry hoặc báo người dùng "dữ liệu đã bị thay đổi". Không giữ khóa database nên rẻ, phù hợp khi <strong>xung đột hiếm khi xảy ra</strong>. <strong>Pessimistic lock</strong>: <code>@Lock(PESSIMISTIC_WRITE)</code> sinh <code>SELECT ... FOR UPDATE</code>, khóa dòng ngay từ lúc đọc, transaction khác phải xếp hàng chờ — chắc chắn không đụng độ nhưng giảm throughput và có nguy cơ deadlock, hợp với nghiệp vụ tranh chấp nóng như trừ tồn kho, trừ số dư. Quy tắc chọn: xung đột hiếm → optimistic; cùng một dòng bị tranh giành liên tục → pessimistic.</p></details>
<pre>// Optimistic — @Version does everything
@Entity
public class Product {
    @Id private Long id;
    private int stock;
    @Version private long version;      // Hibernate manages it
}
// UPDATE product SET stock=?, version=version+1 WHERE id=? AND version=?
// 0 rows updated → OptimisticLockingFailureException → retry

// Pessimistic — row locked from the SELECT onward
public interface ProductRepository extends JpaRepository&lt;Product, Long&gt; {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from Product p where p.id = :id")
    Product findForUpdate(@Param("id") Long id);    // SELECT ... FOR UPDATE
}

@Transactional
public void decreaseStock(Long id, int qty) {
    Product p = productRepo.findForUpdate(id);      // others WAIT here
    if (p.getStock() &lt; qty) throw new OutOfStockException();
    p.setStock(p.getStock() - qty);
}</pre>
<div class="key-point">Optimistic = detect conflict at write time and retry; pessimistic = prevent conflict by locking at read time. Bonus: pessimistic locks must live inside a transaction, and keep it short — you're holding a real DB lock.</div>`,
      },
      {
        q: 'What is HikariCP? How do you size and tune the connection pool?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>HikariCP is Spring Boot's default JDBC connection pool: it keeps a set of open connections for reuse because creating one is expensive. Default max is 10 connections — usually enough, and bigger is often not faster (Hikari's guideline: roughly CPU cores × 2 on the DB side). When the pool is exhausted — usually because transactions hold connections too long — new requests wait and fail with a 30s connection timeout. Key settings: <code>maximum-pool-size</code>, <code>max-lifetime</code> (keep it below the DB/proxy idle timeout), and <code>leak-detection-threshold</code> to log code paths that borrow a connection and never return it.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>HikariCP là connection pool mặc định của Spring Boot: nó giữ sẵn một nhóm connection đang mở để tái sử dụng, vì mở connection mới tới database rất tốn kém. Mặc định pool có tối đa <strong>10 connection</strong> — đủ cho đa số ứng dụng, và tăng lên chưa chắc đã nhanh hơn (gợi ý của chính Hikari: khoảng số core CPU của database × 2; pool quá to chỉ khiến các query xếp hàng ở database thay vì ở pool). Khi pool cạn — thường do transaction giữ connection quá lâu, ví dụ gọi API ngoài bên trong transaction — request mới phải chờ và lỗi timeout sau 30 giây. Các thông số hay chỉnh: <code>maximum-pool-size</code>, <code>max-lifetime</code> (đặt ngắn hơn idle timeout của database/proxy để tránh nhận connection đã chết), và <code>leak-detection-threshold</code> để log ra những đoạn code mượn connection mà quên trả.</p></details>
<pre># application.yml
spring:
  datasource:
    hikari:
      maximum-pool-size: 10          # default; measure before raising
      minimum-idle: 10               # keep equal to max for steady load
      max-lifetime: 1500000          # 25 min — below DB/proxy timeout
      connection-timeout: 3000       # fail fast instead of 30s hang
      leak-detection-threshold: 60000  # log stacks holding a conn &gt; 60s

# Symptom of exhaustion in logs:
# "Connection is not available, request timed out after 30000ms"
# → usual cause: long @Transactional doing HTTP calls / big loops</pre>
<div class="key-point">The interview trap is "pool exhausted → just increase the size." The real fix is shortening transactions; pool size follows the DB's capacity (cores × 2), not the app's thread count.</div>`,
      },
      {
        q: 'How do you manage database schema changes? (Flyway/Liquibase vs ddl-auto)',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Never let Hibernate mutate a production schema (<code>ddl-auto=update</code>) — it's uncontrolled and cannot roll back. Flyway manages schema through versioned SQL files (V1__init.sql, V2__add_index.sql...): at startup it compares against its <code>flyway_schema_history</code> table and applies pending migrations in order, identically on every environment. Applied files are immutable — any change means a new file. Liquibase is the same idea with XML/YAML changesets and rollback support. Pair it with <code>ddl-auto=validate</code> so Hibernate only verifies that entities match the schema.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Trong production <strong>không được để Hibernate tự sửa schema</strong> (<code>ddl-auto=update</code>): không kiểm soát được nó sẽ làm gì, không review được, và không rollback được. Flyway quản lý schema bằng các file SQL <strong>đánh số phiên bản</strong> (V1__init.sql, V2__add_index.sql...): lúc khởi động nó so với bảng <code>flyway_schema_history</code> và chạy đúng những file chưa được áp dụng, theo thứ tự, giống hệt nhau trên mọi môi trường — schema trở thành một phần của code, được review qua pull request như code. File đã chạy rồi thì <strong>không được sửa</strong> — muốn thay đổi gì thì tạo file mới. Liquibase tương tự nhưng viết changeset bằng XML/YAML và có hỗ trợ rollback. Đi kèm luôn: đặt <code>ddl-auto=validate</code> để Hibernate chỉ kiểm tra entity có khớp schema hay không — lệch là fail ngay lúc khởi động.</p></details>
<pre># src/main/resources/db/migration/
V1__create_users.sql
V2__create_orders.sql
V3__add_index_orders_status.sql     # new change = NEW file, never edit old ones

# application.yml
spring:
  jpa:
    hibernate:
      ddl-auto: validate     # Hibernate checks, Flyway changes
  flyway:
    enabled: true

-- V3__add_index_orders_status.sql
CREATE INDEX idx_orders_status ON orders (status);</pre>
<div class="key-point">"ddl-auto=update in prod?" is a screening question — the expected answer is no, with Flyway/Liquibase + ddl-auto=validate as the alternative. Migrations are append-only; fixing a bad one means writing V4, not editing V3.</div>`,
      },

      // ──── 13. SECURITY ESSENTIALS ────
      {
        q: 'What is the difference between authentication and authorization?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Authentication answers "who are you" — verifying credentials (password, token); failure returns 401 Unauthorized. Authorization answers "what may you do" — checking roles/permissions after identity is established; failure returns 403 Forbidden. In Spring Security, authentication is handled by the AuthenticationManager and its providers, while authorization is configured via <code>authorizeHttpRequests</code> per URL or <code>@PreAuthorize</code> per method.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Authentication (xác thực)</strong> trả lời câu hỏi "bạn là ai" — kiểm tra username/mật khẩu, token...; thất bại thì trả <strong>401 Unauthorized</strong>. <strong>Authorization (phân quyền)</strong> trả lời "bạn được phép làm gì" — dựa trên role/permission sau khi đã biết bạn là ai; không đủ quyền thì trả <strong>403 Forbidden</strong>. Trong Spring Security: xác thực do AuthenticationManager và các AuthenticationProvider đảm nhiệm, còn phân quyền cấu hình qua <code>authorizeHttpRequests</code> theo URL hoặc <code>@PreAuthorize</code> theo từng method. Mẹo nhớ nhanh: 401 = chưa đăng nhập (hoặc đăng nhập sai), 403 = đăng nhập rồi nhưng không đủ quyền.</p></details>
<pre>// Authorization — by URL
http.authorizeHttpRequests(auth -> auth
    .requestMatchers("/api/admin/**").hasRole("ADMIN")
    .requestMatchers("/api/**").authenticated()
    .anyRequest().permitAll());

// Authorization — by method
@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
public void updateProfile(Long userId, ProfileDto dto) { ... }

401 Unauthorized → authentication failed (who are you?)
403 Forbidden    → authenticated, but not allowed (you can't do that)</pre>
<div class="key-point">AuthN = identity (401), AuthZ = permission (403). Getting the two status codes right is the quick senior signal in this question.</div>`,
      },
      {
        q: 'How does JWT authentication work in a Spring Boot REST API?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The flow: (1) client posts credentials to /login; (2) the server authenticates and returns a JWT signed with a secret, carrying claims (sub, roles, exp); (3) the client sends it on every request as <code>Authorization: Bearer &lt;token&gt;</code>; (4) a custom <code>OncePerRequestFilter</code> registered before <code>UsernamePasswordAuthenticationFilter</code> verifies signature and expiry and puts an Authentication into the SecurityContext; (5) the server stores no session — fully stateless, scales horizontally. Practical caveats: keep access tokens short-lived with a refresh token, since issued JWTs cannot be revoked; and never put sensitive data in the payload — it is base64-encoded, not encrypted.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Luồng chuẩn gồm 5 bước: (1) client gọi <code>/login</code> với username/password; (2) server xác thực thành công thì tạo JWT chứa các claim (sub, roles, exp), <strong>ký bằng secret key</strong> rồi trả về; (3) từ đó mỗi request client gửi kèm header <code>Authorization: Bearer &lt;token&gt;</code>; (4) một filter tự viết (<code>OncePerRequestFilter</code>, đăng ký trước <code>UsernamePasswordAuthenticationFilter</code>) kiểm tra chữ ký và hạn của token, hợp lệ thì dựng đối tượng Authentication đưa vào SecurityContext; (5) server <strong>không lưu session</strong> — stateless nên scale ngang thoải mái. Lưu ý thực tế hay được hỏi thêm: access token nên có hạn ngắn (5–15 phút) kèm refresh token, vì JWT đã phát hành thì <strong>không thu hồi được</strong>; và đừng nhét dữ liệu nhạy cảm vào payload — nó chỉ được encode base64 chứ không hề mã hóa, ai cũng đọc được.</p></details>
<pre>public class JwtFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,
                                    FilterChain chain) throws ServletException, IOException {
        String header = req.getHeader("Authorization");
        if (header != null &amp;&amp; header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwtService.isValid(token)) {                  // signature + expiry
                var auth = new UsernamePasswordAuthenticationToken(
                    jwtService.getUsername(token), null, jwtService.getAuthorities(token));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(req, res);
    }
}

// Registration + stateless mode
http.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);</pre>
<div class="key-point">The three follow-ups to be ready for: why stateless (no session store, easy scaling), why short expiry + refresh token (JWTs can't be revoked), and where NOT to store it in the browser (localStorage is XSS-readable; httpOnly cookie is the safer default).</div>`,
      },
      {
        q: 'How should passwords be stored? Explain PasswordEncoder and BCrypt.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Never store plaintext, and never use fast hashes like MD5/SHA-256 — GPUs try billions of guesses per second against them. The standard is BCrypt (or Argon2): deliberately slow with a tunable cost factor, and it auto-generates a per-password salt, so two identical passwords produce different hashes. Register with <code>encoder.encode(raw)</code>, log in with <code>encoder.matches(raw, hashed)</code> — hashes are one-way, there is no decode. Spring recommends <code>DelegatingPasswordEncoder</code>: hashes are stored with a prefix like {bcrypt}, so you can migrate algorithms later while old hashes remain verifiable.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Không bao giờ lưu mật khẩu dạng thô, và cũng <strong>không dùng MD5/SHA-256</strong> — đó là các hash "nhanh", GPU có thể thử hàng tỷ mật khẩu mỗi giây để dò ngược. Chuẩn hiện nay là <strong>BCrypt</strong> (hoặc Argon2): cố tình chậm, có tham số cost tăng dần theo sức mạnh phần cứng, và <strong>tự sinh salt riêng cho từng mật khẩu</strong> — nên hai người dùng trùng mật khẩu vẫn ra hai hash khác nhau, chặn được kiểu tra bảng rainbow table. Khi đăng ký gọi <code>encoder.encode(rawPassword)</code>; khi đăng nhập gọi <code>encoder.matches(raw, hashed)</code> — hash là một chiều, không tồn tại chuyện "giải mã" mật khẩu. Spring khuyến nghị dùng <code>DelegatingPasswordEncoder</code>: hash được lưu kèm tiền tố như <code>{bcrypt}</code>, nhờ đó sau này đổi sang thuật toán mạnh hơn thì hash cũ vẫn xác thực được bình thường.</p></details>
<pre>@Bean
public PasswordEncoder passwordEncoder() {
    // DelegatingPasswordEncoder: {bcrypt} prefix, future-proof
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
}

// Register
user.setPassword(passwordEncoder.encode(request.rawPassword()));
// stored: {bcrypt}$2a$10$N9qo8uLOickgx2ZMRZoMye...   (salt embedded)

// Login — NEVER compare strings yourself
if (!passwordEncoder.matches(request.rawPassword(), user.getPassword())) {
    throw new BadCredentialsException("Invalid credentials");
}</pre>
<div class="key-point">Three-word answer: slow, salted, one-way. "Why not SHA-256?" — because it's fast, and fast is exactly what attackers want. The cost factor exists so hashing stays slow as hardware improves.</div>`,
      },
    ],
  },

  // ───────────────────────── 9. HTML ─────────────────────────
];
