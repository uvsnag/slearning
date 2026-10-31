import type { KmNode } from '../../types';

export const testing: KmNode = {
  title: 'Testing',
  level: 'intermediate',
  summary: 'Test with the full app, with small slices of it, or with no Spring at all.',
  simple:
    'You can test a car by driving it on the road (full app), by testing only the brakes on a bench (slice), or by checking one bolt (unit test).',
  children: [
    {
      title: 'Unit tests first',
      level: 'beginner',
      summary: 'Most logic can be tested with plain JUnit and Mockito, without starting Spring.',
      simple: 'Checking one bolt does not need the whole car. It is fast and simple.',
      points: [
        'Constructor injection makes this easy: <code>new OrderService(mockRepo)</code>.',
        '<code>spring-boot-starter-test</code> brings JUnit 5, Mockito, AssertJ and more.',
        'Milliseconds per test, versus seconds for a Spring context.',
      ],
    },
    {
      title: '@SpringBootTest',
      level: 'intermediate',
      summary: 'Starts the whole application context for an integration test.',
      simple: 'Drive the full car around the block and check everything works together.',
      points: [
        'Finds your <code>@SpringBootApplication</code> and loads every bean.',
        '<code>webEnvironment = RANDOM_PORT</code> starts a real server. Call it with a test HTTP client.',
        'Slower than slices. Use it for a few end-to-end paths.',
        'Spring caches the context between tests with the same config, so reuse configs.',
      ],
      tip: 'Every different @MockitoBean set or property creates a new context. Many variants = very slow test suites.',
    },
    {
      title: 'Test slices',
      level: 'intermediate',
      summary: 'Start only one layer of the app: web, JPA, JSON, REST client…',
      simple: 'Put just the brakes on the test bench. Faster, and failures point to one place.',
      points: [
        '<code>@WebMvcTest(OrderController.class)</code>: controllers, advice, filters, Jackson. No services.',
        '<code>@DataJpaTest</code>: entities and repositories, each test rolls back.',
        '<code>@JsonTest</code>, <code>@RestClientTest</code>, <code>@WebFluxTest</code> and more.',
        'Beans outside the slice must be mocked with <code>@MockitoBean</code>.',
      ],
    },
    {
      title: 'MockMvc',
      level: 'intermediate',
      summary: 'Send fake HTTP requests to your controllers without a real server.',
      simple: 'A flight simulator: real controls, real reactions, but you never leave the ground.',
      points: [
        'Comes with <code>@WebMvcTest</code>, or add <code>@AutoConfigureMockMvc</code> to <code>@SpringBootTest</code>.',
        'Checks status, headers and JSON with <code>jsonPath</code>.',
        'Security filters run too. Use <code>@WithMockUser</code> to fake a logged-in user.',
        'Spring 6.2 adds <code>MockMvcTester</code> with AssertJ-style checks.',
      ],
      detail: `<pre><code>@WebMvcTest(OrderController.class)
class OrderControllerTest {
  @Autowired MockMvc mvc;
  @MockitoBean OrderService service;

  @Test
  void returnsOrder() throws Exception {
    when(service.find(7)).thenReturn(new OrderDto(7, "NEW"));
    mvc.perform(get("/api/orders/7"))
       .andExpect(status().isOk())
       .andExpect(jsonPath("$.status").value("NEW"));
  }
}</code></pre>`,
    },
    {
      title: '@MockitoBean',
      level: 'intermediate',
      summary: 'Replace a bean in the test context with a Mockito mock.',
      simple: 'Swap a real employee for a cardboard cut-out that says exactly what you script.',
      points: [
        'Added in Spring Framework 6.2 / Boot 3.4. Also <code>@MockitoSpyBean</code>.',
        'Replaces <code>@MockBean</code>, deprecated in 3.4 and removed in Boot 4.',
        'Use in Spring tests only. In plain unit tests, use <code>@Mock</code>.',
      ],
    },
    {
      title: 'Testcontainers',
      level: 'advanced',
      summary: 'Run a real Postgres, Kafka or Redis in Docker during tests.',
      simple:
        'Instead of a toy database that acts almost the same, you test against the real thing in a throwaway box.',
      points: [
        'Catches DB-specific bugs that H2 hides (SQL dialect, JSON columns, locking).',
        '<code>@ServiceConnection</code> (Boot 3.1+) wires the container URL into Boot for you.',
        'Reuse containers across tests (static fields or a shared config) to keep tests fast.',
        'Needs Docker on the machine or CI runner.',
      ],
      detail: `<pre><code>@SpringBootTest
@Testcontainers
class OrderRepoIT {
  @Container
  @ServiceConnection
  static PostgreSQLContainer&lt;?&gt; db = new PostgreSQLContainer&lt;&gt;("postgres:17");
}</code></pre>`,
    },
  ],
};
