import type { KmNode } from '../../types';

export const setup: KmNode = {
  title: 'JUnit 5 Setup',
  level: 'beginner',
  summary: 'How JUnit 5 is built, which libraries to add and how Maven or Gradle run your tests.',
  simple:
    'Before the game you need a field, a referee and a scoreboard. This branch sets those up so your tests can actually run.',
  points: [
    'JUnit 5 = Platform + Jupiter + Vintage.',
    'Add one test dependency, and Maven or Gradle find and run tests for you.',
    'IDEs (IntelliJ, Eclipse, VS Code) run tests with a green or red bar.',
  ],
  children: [
    {
      title: 'Platform, Jupiter, Vintage',
      level: 'beginner',
      summary:
        'JUnit 5 is three parts: a launcher base, the new test API, and support for old tests.',
      simple:
        'Think of a games console (Platform), the new games made for it (Jupiter), and an adapter that plays old cartridges (Vintage).',
      points: [
        'Platform: finds and launches tests. IDEs and build tools talk to it.',
        'Jupiter: the API you write against (<code>@Test</code>, assertions, extensions).',
        'Vintage: runs old JUnit 3 and 4 tests on the new Platform.',
        'Other engines (Cucumber, Spock, Kotest) also plug into the Platform.',
      ],
      tip: 'Mixed old and new tests? Add Vintage so both run in one build, then migrate step by step.',
    },
    {
      title: 'Dependencies',
      level: 'beginner',
      summary:
        'Add the junit-jupiter artifact in test scope; a BOM keeps all JUnit versions aligned.',
      simple:
        'Like ordering a meal combo instead of each item: one dependency brings the API, the engine and parameterized tests.',
      points: [
        'Add <code>org.junit.jupiter:junit-jupiter</code> with test scope (Gradle: <code>testImplementation</code>).',
        'Use the <code>junit-bom</code> to keep all JUnit parts on the same version.',
        'Mockito: add <code>mockito-core</code> plus <code>mockito-junit-jupiter</code> for the extension.',
        'Spring Boot: <code>spring-boot-starter-test</code> already brings JUnit, Mockito and AssertJ.',
        'Newer Gradle versions also want <code>junit-platform-launcher</code> on the test runtime path.',
      ],
    },
    {
      title: 'Surefire & Gradle',
      level: 'beginner',
      summary: 'Build tools run your tests on every build and stop it if one fails.',
      simple:
        'The build tool is a quality inspector at the factory door. If any check fails, the product does not leave.',
      points: [
        'Maven Surefire runs unit tests in the <code>test</code> phase. Use version 3.x.',
        'Surefire picks classes named <code>*Test</code>, <code>Test*</code>, <code>*Tests</code>, <code>*TestCase</code>.',
        'Maven Failsafe runs <code>*IT</code> integration tests in the <code>verify</code> phase.',
        'Gradle needs <code>useJUnitPlatform()</code> inside the <code>test</code> task.',
        'Reports land in <code>target/surefire-reports</code> or <code>build/reports/tests</code>.',
      ],
      tip: 'Tests run in the IDE but not in Maven? Check the class name pattern and the Surefire version first.',
    },
    {
      title: 'First test class',
      level: 'beginner',
      summary: 'A test class lives in src/test/java, in the same package as the class it tests.',
      simple:
        'Your tests are a mirror of your code: same folders, same package names, just in the test side of the house.',
      points: [
        'Same package lets you test package-private methods.',
        'Classes and methods do not need to be <code>public</code> in JUnit 5.',
        'Name the class after what it tests: <code>OrderServiceTest</code>.',
        'Use static imports from <code>org.junit.jupiter.api.Assertions</code>.',
      ],
      detail: `<pre><code>import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

class CalculatorTest {
  @Test
  void addsTwoNumbers() {
    assertEquals(5, new Calculator().add(2, 3));
  }
}</code></pre>`,
    },
    {
      title: 'Migrating from JUnit 4',
      level: 'intermediate',
      summary:
        'Most JUnit 4 annotations have a direct JUnit 5 name; rules and runners become extensions.',
      simple:
        'Moving house: most furniture comes along with a new label, a few old gadgets are swapped for newer ones.',
      points: [
        '<code>@Before</code> / <code>@After</code> → <code>@BeforeEach</code> / <code>@AfterEach</code>.',
        '<code>@BeforeClass</code> → <code>@BeforeAll</code>, <code>@Ignore</code> → <code>@Disabled</code>, <code>@Category</code> → <code>@Tag</code>.',
        '<code>@RunWith</code> and <code>@Rule</code> → <code>@ExtendWith</code> extensions.',
        '<code>@Test(expected = …)</code> → <code>assertThrows</code>.',
        'The failure message moves from first to last argument in assertions.',
      ],
      tip: 'OpenRewrite has ready-made recipes that do most of this migration automatically.',
    },
    {
      title: 'JUnit 6',
      level: 'intermediate',
      summary:
        'Released September 2025: Java 17 baseline and one version number for every JUnit part.',
      simple:
        'A new model of the same car: same steering wheel and pedals, but it needs newer fuel (Java 17) and old parts were removed.',
      points: [
        'In JUnit 5, Platform was 1.x and Jupiter 5.x. JUnit 6 versions everything as 6.x.',
        'Requires Java 17+ (JUnit 5 needed Java 8).',
        'Deprecated APIs removed; Vintage is now deprecated too.',
        'Your Jupiter tests mostly keep working: same annotations and packages.',
        'New bits: a fail-fast mode, JSpecify null annotations and Kotlin <code>suspend</code> test methods.',
        'Spring Boot 4 (November 2025) already uses JUnit 6.',
      ],
    },
  ],
};
