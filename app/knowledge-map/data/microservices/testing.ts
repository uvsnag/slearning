import type { KmNode } from '../../types';

export const testing: KmNode = {
  title: 'Testing',
  level: 'intermediate',
  summary:
    'Testing each service on its own, and checking that services still agree with each other, without a giant shared test setup.',
  simple:
    'You test every part of a car on the bench, and check that the plugs fit the sockets. You don’t drive the whole car for every tiny change.',
  children: [
    {
      title: 'Testing Pyramid',
      level: 'beginner',
      summary: 'Many fast unit tests, fewer integration tests, very few slow end-to-end tests.',
      simple:
        'Like checking a building: lots of quick checks on each brick, some on each floor, and one final walk-through of the whole house.',
      points: [
        'Unit tests: business logic, no network, run in milliseconds.',
        'Integration tests: one service with its real DB or broker.',
        'Contract tests: check that two services agree on the API.',
        'End-to-end: a few critical user journeys across services.',
        'For microservices many teams use a "honeycomb": mostly integration tests per service.',
      ],
    },
    {
      title: 'Integration Tests',
      level: 'intermediate',
      summary:
        'Test one service with its real database or broker, started in throwaway containers.',
      simple:
        'Testing a new oven with real gas and real pizzas, in a test kitchen you throw away afterwards.',
      points: [
        'Testcontainers starts real PostgreSQL, Kafka, Redis in Docker for each test run.',
        'Catches SQL, mapping and config bugs that mocks hide.',
        'Spring Boot 3.1+: <code>@ServiceConnection</code> wires the container in automatically.',
        'Stub other services’ HTTP APIs with WireMock or MockServer.',
      ],
      detail: `<pre><code>@SpringBootTest
@Testcontainers
class OrderRepositoryIT {
  @Container @ServiceConnection
  static PostgreSQLContainer&lt;?&gt; db = new PostgreSQLContainer&lt;&gt;("postgres:17");

  @Autowired OrderRepository orders;

  @Test
  void savesAndLoads() {
    var saved = orders.save(new Order("c-1"));
    assertThat(orders.findById(saved.getId())).isPresent();
  }
}</code></pre>`,
    },
    {
      title: 'Contract Tests',
      level: 'intermediate',
      summary: 'Check that a provider’s API still matches what its consumers expect.',
      simple: 'Like checking that a plug fits a socket, without needing the whole house wired up.',
      points: [
        'The contract = requests and the response shape both sides agreed on.',
        'Runs fast and in isolation, in each service’s own pipeline.',
        'Catches breaking changes before deploy, not in production.',
        'Works for HTTP APIs and for messages/events.',
      ],
    },
    {
      title: 'Consumer-Driven Contracts',
      level: 'advanced',
      summary:
        'Each consumer writes down what it needs; the provider’s build checks it still delivers.',
      simple:
        'Every customer hands the bakery a note: "I need rye bread, sliced." Before changing a recipe, the bakery checks every note.',
      points: [
        'Consumer test records the interactions it uses → a contract file (pact).',
        'Contracts are shared through a broker (e.g. Pact Broker).',
        'Provider build replays them against the real provider.',
        '"can-i-deploy" checks tell you if a version is safe to release.',
        'Tools: Pact (many languages), Spring Cloud Contract (JVM).',
      ],
      detail: `<pre><code>// Pact JS: consumer side
provider
  .given('order 42 exists')
  .uponReceiving('a request for order 42')
  .withRequest({ method: 'GET', path: '/orders/42' })
  .willRespondWith({ status: 200, body: { id: '42', status: like('PAID') } });

await provider.executeTest(async (mock) =&gt; {
  const order = await getOrder(mock.url, '42');
  expect(order.id).toBe('42');
});</code></pre>`,
      tip: 'Contract tests replace most end-to-end tests between two services. They are faster and say exactly what broke.',
    },
    {
      title: 'End-to-End Tests',
      level: 'intermediate',
      summary: 'Run real user journeys across many deployed services. Keep them few.',
      simple:
        'A full dress rehearsal with the whole cast. Useful before opening night, but far too slow to do for every small script change.',
      points: [
        'Slow, flaky and hard to debug, because many moving parts are involved.',
        'Shared test environments become a bottleneck for all teams.',
        'Keep a small set for the most critical flows (login, checkout).',
        'Don’t make every deploy wait for a full E2E suite of all services.',
      ],
    },
    {
      title: 'Testing in Production',
      level: 'advanced',
      summary: 'Safely checking real behaviour in production with small, controlled exposure.',
      points: [
        'Canary releases and feature flags limit who sees new code.',
        'Synthetic monitoring: fake users run key journeys every minute.',
        'Shadow traffic: copy real requests to the new version and compare, without returning its answer.',
        'Chaos experiments test that resilience patterns really work.',
        'Needs strong observability and a fast rollback.',
      ],
    },
  ],
};
