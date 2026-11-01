import type { KmNode } from '../../types';

export const testingArchitecture: KmNode = {
  title: 'Testing the Architecture',
  level: 'intermediate',
  summary: 'Test each layer the cheapest way, and write tests that guard the architecture itself.',
  simple:
    'You test a car’s engine on a bench, the brakes on a rig, and only then the whole car on the road. Each part gets the test that fits.',
  points: [
    'A clean core is easy to test: no database, no server, milliseconds per test.',
    'Adapters get focused integration tests.',
    'Architecture tests fail the build when someone breaks the Dependency Rule.',
  ],
  children: [
    {
      title: 'Testing Use Cases',
      level: 'intermediate',
      summary: 'Unit test entities and use cases with plain JUnit and simple fakes for the ports.',
      simple:
        'Practise a speech in front of a mirror before the real audience. Fakes are the mirror.',
      points: [
        'No Spring context: tests start instantly.',
        'In-memory fakes are often clearer than lots of Mockito <code>when(...)</code> calls.',
        'Test behaviour ("order is rejected when stock is low"), not method calls.',
        'Most of your tests should live here.',
      ],
      detail: `<pre><code>@Test
void placesOrderForKnownCustomer() {
    var orders = new InMemoryOrders();
    var service = new PlaceOrderService(id -&gt; new Customer(id), orders);

    service.place(new PlaceOrderCommand(CUSTOMER_ID, List.of(ITEM)));

    assertThat(orders.all()).hasSize(1);
}</code></pre>`,
    },
    {
      title: 'Testing Adapters',
      level: 'intermediate',
      summary: 'Test each adapter against the real technology with a narrow Spring test slice.',
      simple: 'Test the plug with a real socket, but you don’t need the whole house wired.',
      points: [
        '<code>@WebMvcTest</code>: controller mapping, validation, status codes; mock the use case.',
        '<code>@DataJpaTest</code> + Testcontainers: real queries against a real database.',
        'Check the mapping both ways: domain → DB → domain gives the same object.',
        'Keep a few full <code>@SpringBootTest</code> tests for the main flows.',
      ],
    },
    {
      title: 'The Test Boundary',
      level: 'intermediate',
      summary: 'Tests are part of the system too: the outermost circle, so nothing depends on them.',
      simple:
        'Tests are like a building inspector. They can walk into every room, but the house must never be built around the inspector.',
      points: [
        'Martin puts tests in the outermost circle: they depend inward, nothing depends on them.',
        'Tests tied to UI or internal details break on every small change ("fragile tests").',
        'Test through use cases and ports, not through screens or private internals.',
        'A testing API (special entry points for tests) can hide structure tests should not know.',
      ],
      tip: 'If one harmless refactor breaks 50 tests, your tests are too coupled to the code’s structure.',
    },
    {
      title: 'ArchUnit',
      level: 'advanced',
      summary: 'A Java library that checks your package dependencies in plain JUnit tests.',
      points: [
        'Reads compiled bytecode and checks imports between classes.',
        'Rules read like English: "domain should not depend on Spring".',
        'Fails the build with a clear list of offending classes.',
        'Works with JUnit 4 and 5 (<code>@AnalyzeClasses</code>, <code>@ArchTest</code>).',
      ],
      detail: `<pre><code>@AnalyzeClasses(packages = "com.shop")
class ArchitectureTest {
    @ArchTest
    static final ArchRule domainIsPure = noClasses()
        .that().resideInAPackage("..domain..")
        .should().dependOnClassesThat()
        .resideInAnyPackage("org.springframework..", "jakarta.persistence..");
}</code></pre>`,
      children: [
        {
          title: 'Layer & Onion Rules',
          level: 'advanced',
          summary: 'Built-in helpers that describe the whole layering in a few lines.',
          points: [
            '<code>layeredArchitecture()</code> defines layers and who may access whom.',
            '<code>onionArchitecture()</code> knows domain models, domain services, application and adapters.',
            '<code>slices().matching("..shop.(*)..")</code> plus <code>beFreeOfCycles()</code> catches cycles.',
            'Since ArchUnit 1.0, start layered rules with <code>consideringAllDependencies()</code> or <code>consideringOnlyDependenciesInLayers()</code>.',
          ],
          detail: `<pre><code>@ArchTest
static final ArchRule onion = onionArchitecture()
    .domainModels("..domain.model..")
    .domainServices("..domain.service..")
    .applicationServices("..application..")
    .adapter("web", "..adapter.web..")
    .adapter("persistence", "..adapter.persistence..");</code></pre>`,
        },
        {
          title: 'Freezing Violations',
          level: 'expert',
          summary: 'Add rules to a legacy codebase without fixing every old violation first.',
          points: [
            '<code>FreezingArchRule.freeze(rule)</code> records today’s violations in a file.',
            'Old violations pass; any new one fails the build.',
            'Fixed violations drop out of the store, so the debt only shrinks.',
            'Great for slowly moving a legacy app toward clean boundaries.',
          ],
        },
      ],
    },
    {
      title: 'Fitness Functions',
      level: 'expert',
      summary:
        'Automated checks that keep an architecture’s key qualities from drifting over time.',
      points: [
        'Term from the book "Building Evolutionary Architectures" (2017).',
        'Examples: ArchUnit rules, cycle checks, dependency-version checks, performance budgets.',
        'Run in CI on every commit, like any other test.',
        'Turns "architecture on a wiki page" into rules the build enforces.',
      ],
    },
  ],
};
