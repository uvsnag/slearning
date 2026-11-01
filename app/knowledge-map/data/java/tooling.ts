import type { KmNode } from '../../types';

export const tooling: KmNode = {
  title: 'Build, Test & Tools',
  level: 'intermediate',
  summary:
    'The tools around the code: build tools, testing libraries, logging, packaging and frameworks.',
  simple:
    'Writing Java is half the job. The other half is building it, testing it, seeing what it does in production and shipping it. These tools do that.',
  points: [
    'Build: Maven or Gradle download libraries and build your jar.',
    'Test: JUnit (5 or 6) + Mockito + Testcontainers cover most needs.',
    'Log with SLF4J; ship as a jar, Docker image or native binary.',
  ],
  children: [
    {
      title: 'Maven vs Gradle',
      level: 'beginner',
      summary:
        'The two main build tools: they fetch dependencies, compile, test and package your app.',
      simple:
        'A build tool is a recipe card plus a shopping service. You list the libraries you need, and it fetches them and cooks the app the same way every time.',
      points: [
        'Maven: XML (<code>pom.xml</code>), fixed lifecycle: validate → compile → test → package → verify → install → deploy.',
        'Gradle: Groovy or Kotlin script, flexible and faster with caching and incremental builds.',
        'Maven scopes: compile, provided, runtime, test.',
        'Gradle configs: <code>implementation</code>, <code>api</code>, <code>compileOnly</code>, <code>runtimeOnly</code>, <code>testImplementation</code>.',
        'Commit the wrapper (<code>mvnw</code> / <code>gradlew</code>) so everyone uses the same tool version.',
      ],
      tip: 'Maven is simpler and very common in companies; Gradle wins for big or custom builds. Knowing one well is enough to start.',
    },
    {
      title: 'IDE & Debugging',
      level: 'beginner',
      summary:
        'Let your IDE do the heavy lifting: navigation, refactoring and step-by-step debugging.',
      simple:
        'A debugger is a pause button for your program. You stop it at any line and look at every variable.',
      points: [
        'IntelliJ IDEA is the most used; Eclipse and VS Code also work well.',
        'Breakpoints, step over / into, and watch expressions beat println debugging.',
        'Conditional breakpoints stop only when, e.g., <code>id == 42</code>.',
        "Use the IDE's rename and extract-method refactors instead of editing by hand.",
        'Remote debugging attaches to a running JVM (not in production!).',
      ],
    },
    {
      title: 'JUnit 5 & 6',
      level: 'beginner',
      summary: 'The standard testing framework: write methods marked @Test that check your code.',
      simple:
        'A test is a small robot that calls your code and shouts if the answer is wrong. JUnit runs all the robots.',
      points: [
        '<code>@Test</code> marks a test; <code>assertEquals</code>, <code>assertThrows</code> check results.',
        '<code>@BeforeEach</code> / <code>@AfterEach</code> for setup and cleanup.',
        '<code>@ParameterizedTest</code> runs one test with many inputs.',
        'Pattern: Arrange → Act → Assert. One behaviour per test.',
        'AssertJ (<code>assertThat(x).isEqualTo(y)</code>) gives nicer, readable assertions.',
        'JUnit 6 (Sep 2025) keeps the same Jupiter API (<code>org.junit.jupiter</code>) and needs Java 17+.',
      ],
      detail: `<pre><code>class PriceTest {
    @Test
    void addsTax() {
        Price p = new Price(100);
        assertEquals(110, p.withTax(10));
    }

    @Test
    void rejectsNegative() {
        assertThrows(IllegalArgumentException.class, () -&gt; new Price(-1));
    }
}</code></pre>`,
    },
    {
      title: 'Dependency Conflicts',
      level: 'intermediate',
      summary:
        'When two libraries need different versions of the same library and only one can win.',
      simple:
        'Two friends both bring a phone charger, but the socket fits only one. The build tool picks one, and sometimes it picks the wrong one.',
      points: [
        'Transitive dependency: a library your library depends on.',
        'Maven picks the nearest version in the tree; Gradle picks the highest by default.',
        'Symptoms at runtime: <code>NoSuchMethodError</code>, <code>ClassNotFoundException</code>.',
        'See the tree: <code>mvn dependency:tree</code> or <code>gradle dependencies</code>.',
        'Fix with a BOM (bill of materials: a list of versions that work together) or explicit version pins.',
      ],
    },
    {
      title: 'Mockito',
      level: 'intermediate',
      summary: 'A library to create fake objects (mocks) so you can test one class on its own.',
      simple:
        "When you test a car's engine, you do not need real roads. A mock is a fake road that behaves the way you tell it to.",
      points: [
        '<code>mock(Repo.class)</code> creates a fake; <code>when(...).thenReturn(...)</code> sets its answer.',
        '<code>verify(mock).save(x)</code> checks a call happened.',
        'With JUnit 5: <code>@ExtendWith(MockitoExtension.class)</code>, <code>@Mock</code>, <code>@InjectMocks</code>.',
        'Mock things you own at the edges (repos, clients), not value objects.',
        'Mockito 5+ can mock final classes by default; on Java 21+ add it as a <code>-javaagent</code> to avoid agent warnings.',
      ],
      detail: `<pre><code>UserRepo repo = mock(UserRepo.class);
when(repo.find(1L)).thenReturn(Optional.of(new User("Ann")));

String name = new UserService(repo).nameOf(1L);

assertEquals("Ann", name);
verify(repo).find(1L);</code></pre>`,
      tip: 'Too many mocks in one test usually means the class does too much.',
    },
    {
      title: 'Logging',
      level: 'intermediate',
      summary: 'Write what your app does to logs with SLF4J (the API) and Logback (the engine).',
      simple:
        "Logs are the app's diary. SLF4J is the pen you write with; Logback decides where the diary pages go (console, file…).",
      points: [
        'Levels: TRACE &lt; DEBUG &lt; INFO &lt; WARN &lt; ERROR. Production usually runs at INFO.',
        'Use placeholders <code>{}</code>, not string <code>+</code>; the text is built only if the level is on.',
        'Pass the exception as the last argument to keep the stack trace.',
        'Never log passwords, tokens or personal data.',
        'Do not use <code>System.out.println</code> in real apps.',
      ],
      detail: `<pre><code>private static final Logger log = LoggerFactory.getLogger(OrderService.class);

log.info("Order {} paid by {}", orderId, userId);
log.error("Payment failed for order {}", orderId, ex); // keeps stack trace</code></pre>`,
    },
    {
      title: 'Code Quality Tools',
      level: 'intermediate',
      summary:
        'Tools that read your code and catch bugs, style issues and untested parts before a human review.',
      simple:
        'Like a spell checker for code. It will not write the essay for you, but it catches the silly mistakes early.',
      points: [
        'Formatting: Spotless or google-java-format, so nobody argues about spaces.',
        'Bug finders: SpotBugs, Error Prone, PMD; SonarQube tracks a whole project over time.',
        'Coverage: JaCoCo shows which lines your tests actually ran.',
        'Null safety: JSpecify annotations (<code>@Nullable</code>, <code>@NullMarked</code>) plus NullAway catch NPEs at compile time.',
        'Run them in the build and CI, so problems block the merge, not production.',
      ],
      tip: 'High coverage is not the goal. Tests that fail when the code breaks are.',
    },
    {
      title: 'Spring Boot',
      level: 'intermediate',
      summary:
        'The most popular Java framework: a ready-to-run app with web, data, security and config built in.',
      simple:
        'Spring Boot is a furnished apartment. You move in with your code; the web server, settings and wiring are already set up.',
      points: [
        'Dependency injection: Spring creates your objects and passes in what they need.',
        'Auto-configuration: add a starter (e.g. web, data-jpa) and it sets up sensible defaults.',
        'Embedded server (Tomcat by default): the app is just a jar you run.',
        'Config in <code>application.yml</code>; health and metrics via Actuator.',
        'Boot 3+ needs Java 17 and uses <code>jakarta.*</code> packages; Boot 4 (Nov 2025) runs on Spring Framework 7.',
      ],
      detail: `<pre><code>@RestController
class HelloController {
    @GetMapping("/hello")
    String hello(@RequestParam String name) {
        return "Hello " + name;
    }
}</code></pre>`,
    },
    {
      title: 'Testcontainers',
      level: 'advanced',
      summary:
        'Starts real databases, Kafka and more in Docker for your tests, then throws them away.',
      simple:
        'Instead of a fake database, each test run gets a real, fresh one in a box, and the box is thrown away after.',
      points: [
        'Needs Docker on the machine or CI runner.',
        'Tests run against the real thing, e.g. the same PostgreSQL version as production.',
        'Slower than unit tests; use for integration tests.',
        'Spring Boot has built-in support (<code>@ServiceConnection</code>).',
      ],
    },
    {
      title: 'Packaging & Shipping',
      level: 'advanced',
      summary: 'Ways to ship your app: a fat jar, a Docker image or a GraalVM native binary.',
      simple:
        'A fat jar is a suitcase with everything packed. A Docker image is the suitcase plus the room it lives in. A native image is the app squeezed into one fast-starting program.',
      points: [
        'Fat (uber) jar: your code + all libraries; run with <code>java -jar app.jar</code>.',
        'Docker: use a slim JRE base image; use layered jars or Jib so small code changes make small image updates.',
        'GraalVM native image: compiled ahead of time, starts in milliseconds, uses less memory.',
        'Native image cost: long builds, and reflection needs extra config.',
        '<code>jlink</code> can build a trimmed Java runtime with only the modules you use.',
      ],
    },
  ],
};
