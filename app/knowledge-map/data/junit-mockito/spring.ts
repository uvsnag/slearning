import type { KmNode } from '../../types';

export const springTesting: KmNode = {
  title: 'Spring Boot Testing',
  level: 'intermediate',
  summary:
    'Use JUnit and Mockito inside Spring: full context, slices, mock beans and real databases.',
  simple:
    'Plain unit tests check one gear. Spring tests switch on part of the machine, or all of it, to check the gears turn together.',
  points: [
    '<code>spring-boot-starter-test</code> brings JUnit, Mockito, AssertJ and Spring test tools.',
    'Start with plain unit tests; use Spring tests for wiring, web and database layers.',
    'See the Spring Boot topic for deeper coverage.',
    'Spring Boot 4 (November 2025) ships with JUnit 6 and Mockito 5.',
  ],
  children: [
    {
      title: '@SpringBootTest',
      level: 'intermediate',
      summary: 'Starts the whole application context for an integration test.',
      simple: 'Turn on the whole factory to check one product comes out right.',
      points: [
        'Loads every bean, so it is slow (seconds).',
        '<code>webEnvironment = RANDOM_PORT</code> starts a real web server.',
        'Spring caches the context and reuses it across tests with the same config.',
        'Use for a few end-to-end paths, not for every case.',
      ],
    },
    {
      title: '@MockitoBean',
      level: 'intermediate',
      summary: 'Replaces a bean in the Spring context with a Mockito mock.',
      simple: 'Swap one worker in the factory for a robot that does exactly what you script.',
      points: [
        'New in Spring Framework 6.2 / Spring Boot 3.4, with <code>@MockitoSpyBean</code>.',
        'Replaces <code>@MockBean</code>, deprecated in Boot 3.4 and removed in Boot 4.',
        'Only for Spring tests. In plain unit tests use <code>@Mock</code>.',
        'Each different set of mock beans creates a new context, which slows tests.',
      ],
      tip: 'Put shared @MockitoBean fields in a base class or config so tests reuse one cached context.',
    },
    {
      title: '@WebMvcTest',
      level: 'intermediate',
      summary: 'Loads only the web layer and tests controllers with MockMvc.',
      simple: 'Test the shop counter alone, with a pretend warehouse behind it.',
      points: [
        'Loads controllers, filters, advice and JSON. No services or repositories.',
        'Mock the services with <code>@MockitoBean</code>.',
        'Checks status codes, JSON and validation quickly.',
      ],
      detail: `<pre><code>@WebMvcTest(UserController.class)
class UserControllerTest {
  @Autowired MockMvc mvc;
  @MockitoBean UserService users;

  @Test
  void returns404WhenMissing() throws Exception {
    when(users.find(9)).thenReturn(Optional.empty());
    mvc.perform(get("/users/9")).andExpect(status().isNotFound());
  }
}</code></pre>`,
    },
    {
      title: '@DataJpaTest',
      level: 'intermediate',
      summary: 'Loads only JPA: entities, repositories and a database, each test rolled back.',
      simple:
        'Test only the filing cabinet. Every drawer is put back the way it was after each test.',
      points: [
        'Each test runs in a transaction that rolls back at the end.',
        'Uses an embedded database by default if one is on the classpath.',
        'Use <code>@AutoConfigureTestDatabase(replace = NONE)</code> with a real database.',
        "Good for custom queries; do not test Spring Data's own <code>save()</code>.",
      ],
    },
    {
      title: 'Other test slices',
      level: 'intermediate',
      summary: 'Spring Boot has a slice for most layers, each loading only the beans that layer needs.',
      simple:
        'Like testing one room of a house with only its own lights switched on, not the whole building.',
      points: [
        '<code>@WebFluxTest</code>: reactive controllers with <code>WebTestClient</code>.',
        '<code>@JsonTest</code>: checks your JSON mapping only.',
        '<code>@RestClientTest</code>: your HTTP client code against a fake server.',
        '<code>@JdbcTest</code>, <code>@DataJdbcTest</code>, <code>@DataMongoTest</code>, <code>@DataRedisTest</code> for data stores.',
        'Spring Boot 4 moved each slice into its own test module, so some imports changed.',
      ],
      tip: 'Pick the smallest slice that covers what you test. Faster startup, fewer surprises.',
    },
    {
      title: 'Context caching',
      level: 'advanced',
      summary: 'Spring reuses one started context across test classes with the same setup, which keeps suites fast.',
      simple:
        'Starting the factory is slow, so Spring leaves it running for the next test class that needs the same factory.',
      points: [
        'The cache key is the full config: classes, profiles, properties, mock beans.',
        'Each small difference (one extra <code>@MockitoBean</code>) starts a brand-new context.',
        '<code>@DirtiesContext</code> throws the context away after use. Slow, use rarely.',
        '<code>@Transactional</code> on a test rolls back its database changes at the end.',
        'Spring logs cache hits and misses at DEBUG level for <code>org.springframework.test.context.cache</code>.',
      ],
      tip: 'Slow Spring test suite? Count how many contexts start. Unifying test config often halves the time.',
    },
    {
      title: 'Testcontainers',
      level: 'advanced',
      summary: 'Starts real databases, Kafka or Redis in Docker for your tests.',
      simple: 'Instead of a toy kitchen, you test in a real one that is thrown away afterwards.',
      points: [
        'Catches bugs an in-memory H2 database hides (SQL dialect, JSON, locking).',
        '<code>@Testcontainers</code> + <code>@Container</code> manage the lifecycle.',
        '<code>@ServiceConnection</code> (Boot 3.1+) wires the connection details for you.',
        'Reuse one container across test classes to stay fast. Needs Docker.',
      ],
      detail: `<pre><code>@DataJpaTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
@Testcontainers
class OrderRepoIT {
  @Container @ServiceConnection
  static PostgreSQLContainer&lt;?&gt; db = new PostgreSQLContainer&lt;&gt;("postgres:17");
}</code></pre>`,
    },
    {
      title: 'Faking HTTP services',
      level: 'advanced',
      summary: 'Test your HTTP client code against a fake server instead of mocking the client class.',
      simple:
        'Instead of pretending the phone rang, you set up a real phone line with a recorded voice on the other end.',
      points: [
        'WireMock starts a small fake HTTP server that returns the responses you script.',
        'You test real JSON, headers, timeouts and error codes, not just method calls.',
        '<code>MockRestServiceServer</code> fakes calls made with Spring <code>RestClient</code> or <code>RestTemplate</code>.',
        'Point your client at the fake server with a property, e.g. via <code>@DynamicPropertySource</code>.',
      ],
      detail: `<pre><code>stubFor(get("/rates/EUR")
    .willReturn(okJson("{\\"rate\\": 1.1}")));

double usd = converter.toUsd(100, "EUR");

assertEquals(110.0, usd, 0.001);</code></pre>`,
      tip: 'Do not mock HTTP client classes you do not own. A fake server tests the real thing.',
    },
  ],
};
