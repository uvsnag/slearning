import type { KmNode } from '../../types';

export const advancedJunit: KmNode = {
  title: 'Advanced JUnit',
  level: 'advanced',
  summary:
    'Extensions, temp folders, conditions, lifecycle modes, parallel runs, dynamic tests and ordering.',
  simple:
    'Once you can drive, you learn the extra switches on the dashboard: cruise control, fog lights, sport mode.',
  points: [
    'Extensions are how frameworks like Mockito and Spring hook into JUnit.',
    'Most of these features are switched on with one annotation.',
    'Use them when they solve a real problem, not by default.',
  ],
  children: [
    {
      title: 'Extensions model',
      level: 'intermediate',
      summary: 'One plug-in system that replaces JUnit 4 runners and rules.',
      simple:
        'Extensions are like phone apps: JUnit is the phone, and each app adds a feature without changing the phone.',
      points: [
        'An extension implements callback interfaces, like <code>BeforeEachCallback</code>.',
        'Many extensions can work together; JUnit 4 allowed only one runner.',
        'Examples: <code>MockitoExtension</code>, <code>SpringExtension</code>, Testcontainers.',
        'Can inject parameters, skip tests, handle exceptions or wrap each call.',
      ],
    },
    {
      title: '@ExtendWith',
      level: 'intermediate',
      summary: 'Registers an extension on a test class or method.',
      simple: 'Like installing an app before you use it.',
      points: [
        '<code>@ExtendWith(MockitoExtension.class)</code> on the class.',
        "Spring's <code>@SpringBootTest</code> already includes <code>@ExtendWith(SpringExtension.class)</code>.",
        '<code>@RegisterExtension</code> on a field lets you configure the extension in code.',
        'Auto-registration via ServiceLoader exists but is off by default.',
      ],
    },
    {
      title: '@TempDir',
      level: 'intermediate',
      summary: 'JUnit creates a temporary folder for your test and deletes it afterwards.',
      simple: 'A scratch sheet of paper that is thrown away after the exam.',
      points: [
        'Put it on a <code>Path</code> field or parameter.',
        'Each test gets a fresh folder by default.',
        'No more leftover files or tests stepping on each other.',
      ],
      detail: `<pre><code>@Test
void writesReport(@TempDir Path dir) throws IOException {
  Path file = dir.resolve("report.txt");
  reporter.writeTo(file);
  assertTrue(Files.readString(file).contains("TOTAL"));
}</code></pre>`,
    },
    {
      title: 'Conditional execution',
      level: 'intermediate',
      summary: 'Run or skip tests based on OS, Java version, env variables or assumptions.',
      simple:
        'An umbrella you only open when it rains: the test only runs when the conditions make sense.',
      points: [
        '<code>@EnabledOnOs(LINUX)</code>, <code>@EnabledOnJre(JAVA_21)</code>.',
        '<code>@EnabledIfEnvironmentVariable(named = "CI", matches = "true")</code>.',
        '<code>@EnabledIf("customCheck")</code> calls your own boolean method.',
        '<code>assumeTrue(…)</code> inside a test aborts it (skipped, not failed).',
      ],
    },
    {
      title: 'Composed annotations',
      level: 'advanced',
      summary: 'Bundle several JUnit annotations into one of your own, like @FastTest or @IntegrationTest.',
      points: [
        'JUnit annotations work as meta-annotations: put them on your own annotation.',
        'One <code>@IntegrationTest</code> can carry <code>@Tag</code>, <code>@ExtendWith</code> and <code>@Timeout</code>.',
        'Change the bundle once and every test using it follows.',
        'Spring does the same: <code>@SpringBootTest</code> is itself built from other annotations.',
      ],
      detail: `<pre><code>@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Tag("fast")
@Test
public @interface FastTest {}

@FastTest
void addsItem() { … }</code></pre>`,
    },
    {
      title: 'Test instance lifecycle',
      level: 'advanced',
      summary: 'By default JUnit makes a new test object per method; PER_CLASS shares one object.',
      simple:
        'Per-method is a fresh plate for each course. Per-class is one plate for the whole meal: handy, but leftovers can mix.',
      points: [
        'Default <code>PER_METHOD</code>: fields reset, tests isolated.',
        '<code>@TestInstance(Lifecycle.PER_CLASS)</code>: one instance for all tests.',
        'Then <code>@BeforeAll</code> and <code>@MethodSource</code> methods can be non-static.',
        'Shared fields can leak state between tests. Reset them in <code>@BeforeEach</code>.',
      ],
      tip: 'Kotlin users like PER_CLASS because Kotlin has no simple static methods.',
    },
    {
      title: 'Parallel execution',
      level: 'advanced',
      summary: 'Run tests at the same time on several threads to finish faster.',
      simple:
        'More cashiers open at the supermarket. Faster, as long as they do not grab the same item.',
      points: [
        'Turn on with <code>junit.jupiter.execution.parallel.enabled=true</code> in <code>junit-platform.properties</code>.',
        '<code>@Execution(CONCURRENT)</code> or <code>SAME_THREAD</code> per class or method.',
        '<code>@ResourceLock("db")</code> stops tests sharing a resource from running together.',
        'Shared static state or a shared database will make parallel tests flaky.',
      ],
      tip: 'Maven Surefire can also fork several JVMs (forkCount), which isolates tests better than threads.',
    },
    {
      title: 'Dynamic tests',
      level: 'advanced',
      summary: 'A @TestFactory method creates tests at runtime instead of declaring them up front.',
      simple:
        'Instead of printing a fixed exam, the teacher generates questions on the spot from a list.',
      points: [
        'Return a <code>Stream</code> or <code>Collection</code> of <code>DynamicTest</code>.',
        'Each test gets a name and a lambda to run.',
        '<code>@BeforeEach</code> runs once for the factory, not per dynamic test.',
        'Prefer parameterized tests unless you really need runtime logic.',
      ],
      detail: `<pre><code>@TestFactory
Stream&lt;DynamicTest&gt; allFilesParse() throws IOException {
  return Files.list(Path.of("samples"))
      .map(p -&gt; dynamicTest(p.getFileName().toString(),
          () -&gt; assertDoesNotThrow(() -&gt; parser.parse(p))));
}</code></pre>`,
    },
    {
      title: 'Test ordering',
      level: 'advanced',
      summary: 'Control the order tests run in, though good unit tests should not depend on it.',
      simple:
        'Usually any order of dishes is fine. Sometimes, for a set menu, you need soup before dessert.',
      points: [
        'Default order is fixed but deliberately not obvious.',
        '<code>@TestMethodOrder(OrderAnnotation.class)</code> plus <code>@Order(1)</code>.',
        '<code>MethodOrderer.Random</code> helps find hidden dependencies between tests.',
        '<code>@TestClassOrder</code> orders classes, e.g. nested ones.',
      ],
      tip: 'If unit tests only pass in one order, they share state. Fix that instead of forcing an order.',
    },
  ],
};
