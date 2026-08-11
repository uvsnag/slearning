// Interview data: TESTING & UNIT TEST (Java)
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
  {
    id: 'testing',
    name: 'Unit Testing',
    icon: '🧪',
    questions: [
      // ──── 1. FUNDAMENTALS — WHAT A GOOD TEST IS ────
      {
        q: 'What makes a good unit test? (FIRST principles, AAA, one reason to fail)',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A good unit test is <strong>fast, isolated, repeatable, self-validating and written close to the code it covers</strong> — the FIRST principles. It follows the <strong>Arrange-Act-Assert</strong> shape so a reader can see the setup, the single action under test, and the expected outcome without decoding the code, and it has <strong>one reason to fail</strong>: it verifies one behaviour, not five. The most important property is that it tests <strong>observable behaviour through the public API</strong> rather than internal implementation, because a test coupled to implementation breaks on every refactor and stops being a safety net. If a test needs a database, the network, the clock or another test to have run first, it is not a unit test — and its slowness and flakiness will eventually cause the whole suite to be ignored.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một unit test tốt phải <strong>nhanh, độc lập, lặp lại được, tự kiểm chứng và được viết ngay cạnh code mà nó bao phủ</strong> — chính là các nguyên tắc FIRST. Nó theo cấu trúc <strong>Arrange-Act-Assert</strong> để người đọc thấy ngay phần chuẩn bị, một hành động duy nhất được kiểm thử, và kết quả mong đợi mà không phải giải mã code; và nó chỉ có <strong>một lý do để fail</strong>: kiểm chứng một hành vi, không phải năm. Tính chất quan trọng nhất là test phải kiểm chứng <strong>hành vi quan sát được qua public API</strong> chứ không phải chi tiết cài đặt bên trong, vì một test bám vào cài đặt sẽ vỡ mỗi lần refactor và không còn là lưới an toàn nữa. Nếu một test cần database, mạng, đồng hồ hệ thống, hay cần test khác chạy trước, thì nó không phải unit test — và sự chậm chạp cùng tính chập chờn của nó rồi sẽ khiến cả bộ test bị bỏ qua.</p></details>
<p><strong>1. FIRST</strong></p>
<table>
<tr><th>Letter</th><th>Means</th><th>In practice</th></tr>
<tr><td><strong>F</strong>ast</td><td>Milliseconds, not seconds</td><td>No Spring context, no DB, no sleep. 1000 tests should run in seconds.</td></tr>
<tr><td><strong>I</strong>solated</td><td>No dependency on other tests or on order</td><td>No shared static state; each test creates its own data.</td></tr>
<tr><td><strong>R</strong>epeatable</td><td>Same result on any machine, any day</td><td>Fixed <code>Clock</code>, seeded random, no real time zone or locale dependence.</td></tr>
<tr><td><strong>S</strong>elf-validating</td><td>Passes or fails — no human reads the output</td><td>Assertions, never <code>System.out.println</code>.</td></tr>
<tr><td><strong>T</strong>imely</td><td>Written with (or before) the production code</td><td>Tests written months later mostly document bugs as if they were features.</td></tr>
</table>
<p><strong>2. Arrange-Act-Assert (a.k.a. Given-When-Then)</strong></p>
<pre>@Test
void applies_free_shipping_when_order_exceeds_threshold() {
    // Arrange — the world before the action
    var order = anOrder().withTotal(new BigDecimal("120.00")).build();
    var calculator = new ShippingCalculator(new BigDecimal("100.00"));

    // Act — exactly ONE call: the behaviour under test
    var fee = calculator.feeFor(order);

    // Assert — one logical outcome
    assertThat(fee).isEqualByComparingTo("0.00");
}</pre>
<ul>
<li>If the Arrange block is huge, the class under test has too many dependencies — that is a design signal, not a testing problem.</li>
<li>If there are two Act calls, it is two tests.</li>
<li>Multiple asserts are fine when they describe <strong>one</strong> outcome (e.g. three fields of the same returned object); they are not fine when they describe three behaviours.</li>
</ul>
<p><strong>3. Test behaviour, not implementation</strong></p>
<pre>// ❌ Coupled to implementation — breaks when the internals change, proves nothing
@Test void uses_repository() {
    service.place(order);
    verify(repository).save(any());        // asserting HOW, not WHAT
    verify(mapper).toEntity(any());
    verify(validator).validate(any());
}

// ✅ Coupled to behaviour — survives refactoring, fails only on real regressions
@Test void placing_an_order_makes_it_retrievable_with_status_NEW() {
    var id = service.place(anOrder());
    assertThat(service.find(id))
        .extracting(Order::status, Order::total)
        .containsExactly(Status.NEW, new BigDecimal("120.00"));
}</pre>
<p><strong>4. Naming — the test name is documentation</strong></p>
<pre>✅ shouldRejectTransfer_whenBalanceIsInsufficient
✅ returns_empty_list_when_no_orders_match_the_filter
✅ given_expired_token_when_refreshing_then_throws_AuthException
❌ test1 / testPlaceOrder / orderTest        ← tells the next developer nothing

A failing test's name should explain the bug WITHOUT opening the file.
Use @DisplayName for a human sentence when the method name gets unwieldy.</pre>
<p><strong>5. What to unit test — and what not to</strong></p>
<table>
<tr><th>Test it</th><th>Do not unit test it</th></tr>
<tr><td>Business rules, calculations, state transitions</td><td>Getters/setters, plain DTOs, generated code</td></tr>
<tr><td>Edge cases: empty, null, boundary, overflow, duplicates</td><td>Framework behaviour (Spring's DI, Hibernate's SQL) — trust the framework</td></tr>
<tr><td>Error paths and exception messages that users or callers depend on</td><td>Third-party libraries (test <em>your</em> use of them, in an integration test)</td></tr>
<tr><td>Every bug you fix (a regression test that fails before the fix)</td><td>Private methods directly — test them through the public API</td></tr>
</table>
<div class="key-point">The sentence that separates senior answers: <em>"a unit test should fail for exactly one reason, and that reason should be a behaviour change, not a refactor."</em> If your tests break every time you rename a method or reorder calls, you have written change-detector tests — they cost maintenance and provide no safety.</div>`,
      },
      {
        q: 'Unit vs integration vs component vs contract vs E2E tests — what is a "unit", and where do you draw the boundary?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A unit is not necessarily one class: it is <strong>one behaviour with a boundary you control</strong>, which may be a single class or a small cluster of classes that naturally belong together. That leads to two legitimate styles — <strong>solitary</strong> tests, which mock every collaborator, and <strong>sociable</strong> tests, which use the real collaborators and only stub out the process boundary — and mature codebases use sociable tests for domain logic and solitary tests where a collaborator is slow or non-deterministic. Above that sit integration tests, which cross a real boundary such as the database or a broker, component tests that exercise one service through its API with its dependencies faked, contract tests that verify the agreement between a consumer and a provider without running both, and end-to-end tests that drive the whole system. The economics decide the mix: each layer up is slower, flakier and harder to debug, so you keep the count small and push detail down to the fastest layer that can prove it.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một "unit" không nhất thiết là một class: nó là <strong>một hành vi với ranh giới mà bạn kiểm soát</strong>, có thể là một class hoặc một nhóm nhỏ các class gắn bó tự nhiên với nhau. Từ đó sinh ra hai phong cách đều hợp lệ — test <strong>solitary</strong> mock mọi collaborator, và test <strong>sociable</strong> dùng collaborator thật và chỉ stub ở ranh giới tiến trình — và các codebase trưởng thành thường dùng sociable cho logic nghiệp vụ, còn solitary ở chỗ collaborator chậm hoặc không tất định. Bên trên là integration test vượt qua một ranh giới thật như database hay message broker; component test chạy một service qua API của nó với các phụ thuộc được giả lập; contract test kiểm chứng thỏa thuận giữa bên tiêu thụ và bên cung cấp mà không cần chạy cả hai; và end-to-end test điều khiển toàn hệ thống. Bài toán kinh tế quyết định tỷ lệ: mỗi tầng cao hơn thì chậm hơn, chập chờn hơn và khó debug hơn, nên hãy giữ số lượng ít và đẩy các chi tiết xuống tầng nhanh nhất có thể chứng minh được chúng.</p></details>
<p><strong>1. The layers, with the numbers that justify them</strong></p>
<table>
<tr><th>Layer</th><th>Boundary crossed</th><th>Speed</th><th>What it proves</th><th>Typical share</th></tr>
<tr><td><strong>Unit</strong></td><td>None — in-process, in-memory</td><td>&lt; 10 ms</td><td>Logic, edge cases, error paths</td><td>70-80%</td></tr>
<tr><td><strong>Slice / narrow integration</strong></td><td>One framework layer (JPA, MVC, HTTP client)</td><td>~100 ms</td><td>Mapping, serialization, validation, queries</td><td>10-20%</td></tr>
<tr><td><strong>Integration</strong></td><td>Real DB / broker / cache (Testcontainers)</td><td>~1 s</td><td>SQL, transactions, constraints, messaging</td><td>5-10%</td></tr>
<tr><td><strong>Component</strong></td><td>Whole service via its API, externals faked</td><td>seconds</td><td>The service keeps its own contract</td><td>Few</td></tr>
<tr><td><strong>Contract</strong></td><td>Consumer ↔ provider agreement (Pact/Spring Cloud Contract)</td><td>fast</td><td>Two services still agree, without deploying both</td><td>Per integration point</td></tr>
<tr><td><strong>E2E</strong></td><td>Everything, real environment</td><td>minutes</td><td>Critical user journeys work end to end</td><td>3-10 total</td></tr>
</table>
<p><strong>2. Solitary vs sociable unit tests</strong></p>
<pre>// Solitary: every collaborator is a mock
@Mock PricePolicy policy;  @Mock TaxTable tax;
@InjectMocks Cart cart;
→ fast and precise, but the test knows the internal call graph → brittle,
  and it never proves the pieces work TOGETHER.

// Sociable: use the real domain objects, stub only the process boundary
var cart = new Cart(new StandardPricePolicy(), new VatTable(0.1));   // real
var service = new CheckoutService(cart, stubPaymentGateway);         // stub the network
→ still milliseconds, refactor-friendly, catches integration bugs between
  domain classes. Preferred for pure domain logic ("Chicago/classicist" style).</pre>
<p><strong>3. Where to draw the boundary — a practical rule</strong></p>
<ul>
<li><strong>Mock what you cannot control</strong>: network, payment provider, message broker, clock, file system, randomness.</li>
<li><strong>Do not mock what you own and is fast</strong>: value objects, domain entities, pure calculators — use the real thing.</li>
<li><strong>Do not mock types you do not own</strong> directly (JDBC, an SDK client): wrap them behind your own interface and mock that; otherwise your test encodes a third party's behaviour you may have guessed wrong.</li>
<li><strong>Never mock the class under test</strong> (partial mocks of the subject are a design smell).</li>
</ul>
<p><strong>4. Choosing the layer for a given question</strong></p>
<pre>"Does the discount rule handle a 0% coupon?"          → unit
"Does the JSON body map to the DTO with snake_case?"  → slice (@WebMvcTest / @JsonTest)
"Does the unique index actually reject the duplicate?" → integration (real Postgres)
"Does this native query return the right rows?"        → integration
"Do we still send the fields the other team parses?"   → contract test
"Can a user register, pay and see the receipt?"        → one E2E</pre>
<p><strong>5. Anti-patterns in the shape of the suite</strong></p>
<ul>
<li><strong>Ice-cream cone</strong>: many E2E tests, few unit tests → slow pipeline, flaky signals, debugging by bisection.</li>
<li><strong>Hourglass</strong>: many unit + many E2E, nothing in between → wiring bugs escape to production.</li>
<li><strong>Everything is a <code>@SpringBootTest</code></strong>: 4-minute suite, so nobody runs it locally and coverage stops meaning anything.</li>
</ul>
<div class="key-point">Say it as a trade-off, not a dogma: <em>"a unit is a behaviour, not a class; I use sociable tests inside the domain and mock only what crosses a process boundary, then push everything else down to the fastest layer that can actually prove it."</em> The pyramid is about <strong>feedback speed and debuggability</strong> — not about hitting a ratio someone drew on a slide.</div>`,
      },
      {
        q: 'Guide: how do you write a unit test in Java, step by step? (JUnit 5 + AssertJ + Mockito on a real service)',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The workflow is always the same six steps: pick one behaviour and name the test after it, arrange the world with builders instead of long setup code, stub only the collaborators that cross a boundary, execute exactly one call, assert on the observable outcome with fluent assertions, and add the edge cases as parameterized variants. In Java that means JUnit 5 as the harness with <code>@ExtendWith(MockitoExtension.class)</code>, Mockito for the stubs, and AssertJ for assertions because its <code>assertThat</code> chains read like the specification and produce far better failure messages than bare <code>assertEquals</code>. Constructor injection is what makes this easy: the class under test is created with <code>new</code> and its fakes are passed in, so no Spring context is needed and the test runs in milliseconds. Finish by checking the test actually fails when you break the production code — a test that cannot fail is worse than no test.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Quy trình luôn gồm sáu bước: chọn đúng một hành vi và đặt tên test theo nó, chuẩn bị dữ liệu bằng builder thay vì đoạn setup dài dòng, chỉ stub những collaborator vượt qua ranh giới, gọi đúng một hành động, assert vào kết quả quan sát được bằng assertion dạng fluent, rồi bổ sung các trường hợp biên dưới dạng parameterized test. Trong Java, điều đó nghĩa là JUnit 5 làm bộ khung với <code>@ExtendWith(MockitoExtension.class)</code>, Mockito để stub, và AssertJ để assert vì chuỗi <code>assertThat</code> đọc như bản đặc tả và cho thông báo lỗi tốt hơn nhiều so với <code>assertEquals</code> trần. Constructor injection là thứ làm mọi thứ dễ dàng: class cần test được tạo bằng <code>new</code> và các fake được truyền vào, nên không cần Spring context và test chạy trong vài mili-giây. Cuối cùng hãy kiểm tra rằng test thật sự fail khi bạn cố tình làm hỏng code production — một test không thể fail còn tệ hơn là không có test.</p></details>
<p><strong>0. Dependencies (Maven)</strong></p>
<pre>&lt;dependency&gt;                       &lt;!-- brings JUnit 5, AssertJ, Mockito, Hamcrest --&gt;
  &lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
  &lt;artifactId&gt;spring-boot-starter-test&lt;/artifactId&gt;
  &lt;scope&gt;test&lt;/scope&gt;
&lt;/dependency&gt;
&lt;!-- plain Java project: junit-jupiter, assertj-core, mockito-junit-jupiter --&gt;
// Layout: src/test/java mirrors src/main/java; OrderService → OrderServiceTest
// Surefire runs *Test; Failsafe runs *IT (integration) — keep them separated.</pre>
<p><strong>1. The production code we are testing</strong></p>
<pre>public class OrderService {
    private final OrderRepository repository;      // ← constructor injection
    private final PaymentGateway payments;         //   makes this trivially testable
    private final Clock clock;                     //   inject the clock, never call now()

    public OrderService(OrderRepository repository, PaymentGateway payments, Clock clock) {
        this.repository = repository; this.payments = payments; this.clock = clock;
    }

    public Order place(Order order) {
        if (order.items().isEmpty()) throw new IllegalArgumentException("empty order");
        PaymentResult result = payments.charge(order.total());
        if (!result.approved()) throw new PaymentFailedException(result.reason());
        return repository.save(order.confirmedAt(Instant.now(clock)));
    }
}</pre>
<p><strong>2. The test, step by step</strong></p>
<pre>@ExtendWith(MockitoExtension.class)              // 1. enable @Mock/@InjectMocks
class OrderServiceTest {

    @Mock OrderRepository repository;            // 2. doubles for the boundaries
    @Mock PaymentGateway payments;
    Clock clock = Clock.fixed(Instant.parse("2026-08-11T10:00:00Z"), ZoneOffset.UTC);

    OrderService service;

    @BeforeEach
    void setUp() { service = new OrderService(repository, payments, clock); }

    @Test                                        // 3. name = the behaviour
    void confirms_and_saves_the_order_when_payment_is_approved() {
        // Arrange
        Order order = anOrder().withTotal("120.00").build();          // builder, not 12 setters
        when(payments.charge(any())).thenReturn(PaymentResult.approved("auth-1"));
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        // Act  — exactly one call
        Order saved = service.place(order);

        // Assert — the observable outcome
        assertThat(saved.status()).isEqualTo(Status.CONFIRMED);
        assertThat(saved.confirmedAt()).isEqualTo(Instant.parse("2026-08-11T10:00:00Z"));
    }

    @Test
    void rejects_the_order_and_saves_nothing_when_payment_is_declined() {
        when(payments.charge(any())).thenReturn(PaymentResult.declined("card_declined"));

        assertThatThrownBy(() -> service.place(anOrder().build()))
            .isInstanceOf(PaymentFailedException.class)
            .hasMessageContaining("card_declined");

        verify(repository, never()).save(any());   // ← interaction that IS the requirement
    }

    @Test
    void rejects_an_empty_order_without_calling_the_payment_gateway() {
        assertThatThrownBy(() -> service.place(anOrder().withNoItems().build()))
            .isInstanceOf(IllegalArgumentException.class);
        verifyNoInteractions(payments);
    }

    @ParameterizedTest(name = "total {0} → shipping {1}")   // 4. edge cases as data
    @CsvSource({"0.00, 5.00", "99.99, 5.00", "100.00, 0.00", "250.00, 0.00"})
    void shipping_fee_depends_on_the_order_total(BigDecimal total, BigDecimal expectedFee) {
        assertThat(service.shippingFor(anOrder().withTotal(total).build()))
            .isEqualByComparingTo(expectedFee);
    }
}</pre>
<p><strong>3. The test data builder that keeps Arrange short</strong></p>
<pre>public final class OrderTestBuilder {                    // src/test/java, reused everywhere
    private String customer = "cust-1";
    private List&lt;Item&gt; items = List.of(new Item("sku-1", 1, new BigDecimal("120.00")));

    public static OrderTestBuilder anOrder() { return new OrderTestBuilder(); }
    public OrderTestBuilder withTotal(String total) { … return this; }
    public OrderTestBuilder withNoItems() { this.items = List.of(); return this; }
    public Order build() { return new Order(customer, items); }
}
// Sensible defaults + only the field the test cares about is overridden
// → the test reads as "an order with total 120", which is exactly the intent.</pre>
<p><strong>4. Checklist before you call it done</strong></p>
<ul>
<li><strong>Does it fail?</strong> Break the production code on purpose (flip a comparison) and watch it go red. Green-always tests are common and useless.</li>
<li><strong>Is the failure message enough to diagnose?</strong> Run it red once and read the output.</li>
<li><strong>Would it still pass after a pure refactor?</strong> If not, it is testing implementation.</li>
<li><strong>Is any assertion missing?</strong> A test with only <code>verify()</code> calls usually asserts nothing about the result.</li>
<li><strong>Edge cases covered?</strong> null, empty, boundary values, duplicates, the error path, and the bug you just fixed.</li>
<li><strong>Independent?</strong> Run the class alone, run it twice, run the suite in a random order.</li>
</ul>
<p><strong>5. Running them</strong></p>
<pre>mvn test                       # unit tests (Surefire: *Test)
mvn verify                     # + integration tests (Failsafe: *IT)
mvn test -Dtest=OrderServiceTest#rejects_an_empty_order*
gradle test --tests '*OrderServiceTest'
# In the IDE: run the single test, then the class, then the module — in that order.</pre>
<div class="key-point">The habit to state in an interview: <em>"constructor injection + <code>new</code> in the test, one behaviour per test named after the behaviour, AssertJ for the assertion, Mockito only at the boundaries — and I always make the test fail once before trusting it."</em> Everything else (parameterized cases, builders, custom assertions) is about keeping that loop fast and readable as the suite grows.</div>`,
      },
      {
        q: 'JUnit 5 cheat sheet: annotations, lifecycle, assertions, assumptions, parameterized tests, nested tests, tags, extensions',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>JUnit 5 is three modules — the <strong>Platform</strong> that launches tests, <strong>Jupiter</strong> which is the API you write against, and <strong>Vintage</strong> for running old JUnit 4 tests — and the practical surface is small. A test is a <code>@Test</code> method in a class that needs no public modifier, the lifecycle is <code>@BeforeAll</code>, <code>@BeforeEach</code>, test, <code>@AfterEach</code>, <code>@AfterAll</code>, with a new instance per test method unless you change the lifecycle. The features worth knowing beyond that are <strong>parameterized tests</strong> for data-driven cases, <strong>@Nested</strong> classes for grouping by context, <strong>@Tag</strong> for selecting subsets in CI, <strong>assumptions</strong> for skipping instead of failing, and <strong>extensions</strong>, which replace JUnit 4's runners and rules and are how libraries like Mockito and Spring plug in. Assertions include grouped, exception and timeout variants, though most teams use AssertJ instead for readability.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>JUnit 5 gồm ba module — <strong>Platform</strong> khởi chạy test, <strong>Jupiter</strong> là API bạn viết code lên, và <strong>Vintage</strong> để chạy các test JUnit 4 cũ — và bề mặt thực dụng của nó khá nhỏ. Một test là một method <code>@Test</code> trong class không cần public; vòng đời là <code>@BeforeAll</code>, <code>@BeforeEach</code>, test, <code>@AfterEach</code>, <code>@AfterAll</code>, với một instance mới cho mỗi method trừ khi bạn đổi lifecycle. Ngoài ra, những tính năng đáng biết là <strong>parameterized test</strong> cho các ca kiểm thử theo dữ liệu, class <strong>@Nested</strong> để nhóm theo ngữ cảnh, <strong>@Tag</strong> để chọn tập con khi chạy CI, <strong>assumption</strong> để bỏ qua thay vì fail, và <strong>extension</strong> — thứ thay thế runner và rule của JUnit 4, cũng là cách các thư viện như Mockito hay Spring cắm vào. Phần assertion có các biến thể nhóm, ngoại lệ và timeout, dù đa số đội dùng AssertJ để dễ đọc hơn.</p></details>
<p><strong>1. Core annotations</strong></p>
<table>
<tr><th>Annotation</th><th>Purpose</th></tr>
<tr><td><code>@Test</code></td><td>A test method (no return value, no arguments unless injected)</td></tr>
<tr><td><code>@BeforeEach</code> / <code>@AfterEach</code></td><td>Run before/after <strong>every</strong> test</td></tr>
<tr><td><code>@BeforeAll</code> / <code>@AfterAll</code></td><td>Once per class — must be <code>static</code> (unless <code>@TestInstance(PER_CLASS)</code>)</td></tr>
<tr><td><code>@DisplayName("…")</code></td><td>Human-readable name in reports</td></tr>
<tr><td><code>@Disabled("reason")</code></td><td>Skip — always give the reason and a ticket</td></tr>
<tr><td><code>@Tag("slow")</code></td><td>Group for selective execution in CI</td></tr>
<tr><td><code>@Nested</code></td><td>Inner class grouping tests by context/state</td></tr>
<tr><td><code>@RepeatedTest(10)</code></td><td>Run repeatedly (useful when hunting flakiness)</td></tr>
<tr><td><code>@Timeout(5)</code></td><td>Fail if it exceeds N seconds</td></tr>
<tr><td><code>@TestInstance(PER_CLASS)</code></td><td>One instance for all tests (allows non-static <code>@BeforeAll</code>)</td></tr>
<tr><td><code>@TestMethodOrder(OrderAnnotation.class)</code></td><td>Force order — a smell in unit tests, legitimate in some integration suites</td></tr>
<tr><td><code>@ExtendWith(X.class)</code></td><td>Plug in Mockito, Spring, Testcontainers, your own extension</td></tr>
</table>
<p><strong>2. Lifecycle</strong></p>
<pre>@BeforeAll (static, once)
   ├─ new TestClass()  ← A NEW INSTANCE PER TEST METHOD (no state leaks by default)
   │    @BeforeEach → @Test method → @AfterEach
   ├─ new TestClass()
   │    @BeforeEach → @Test method → @AfterEach
@AfterAll (static, once)

JUnit 4 → 5 renames: @Before→@BeforeEach, @After→@AfterEach, @BeforeClass→@BeforeAll,
@Ignore→@Disabled, @Category→@Tag, @RunWith/@Rule→@ExtendWith</pre>
<p><strong>3. Assertions (built-in)</strong></p>
<pre>assertEquals(expected, actual, "message");     assertNotEquals(…);
assertTrue(cond);  assertFalse(cond);  assertNull(x);  assertNotNull(x);
assertSame(a, b);                               // reference identity
assertArrayEquals(new int[]{1,2}, actual);
assertIterableEquals(expected, actual);

assertAll("order",                              // ← reports ALL failures, not just the first
    () -> assertEquals("NEW", order.status()),
    () -> assertEquals(2, order.items().size()));

var ex = assertThrows(PaymentFailedException.class, () -> service.place(order));
assertEquals("declined", ex.getReason());
assertDoesNotThrow(() -> service.validate(order));

assertTimeout(Duration.ofMillis(200), () -> service.compute());          // runs to completion
assertTimeoutPreemptively(Duration.ofMillis(200), () -> service.compute()); // aborts (own thread)

fail("not implemented yet");</pre>
<p><strong>4. Assumptions — skip instead of fail</strong></p>
<pre>assumeTrue(System.getenv("CI") == null);          // aborts (not fails) the test
assumingThat(isLinux(), () -> { /* extra checks only on Linux */ });
// Conditional annotations: @EnabledOnOs(LINUX), @EnabledIfSystemProperty,
//   @EnabledIfEnvironmentVariable, @EnabledForJreRange(min = JAVA_17)</pre>
<p><strong>5. Parameterized tests</strong></p>
<pre>@ParameterizedTest(name = "{index}: isValid({0}) = {1}")
@CsvSource({"'', false", "'a@b.com', true", "'no-at-sign', false"})
void email_validation(String input, boolean expected) { … }

@ParameterizedTest @ValueSource(ints = {-1, 0, Integer.MIN_VALUE})
void rejects_non_positive_amounts(int amount) { … }

@ParameterizedTest @EnumSource(value = Status.class, names = {"NEW", "PAID"})
void allows_cancellation(Status status) { … }

@ParameterizedTest @MethodSource("orderScenarios")        // complex objects
static Stream&lt;Arguments&gt; orderScenarios() {
    return Stream.of(Arguments.of(anOrder().withTotal("50").build(), new BigDecimal("5.00")),
                     Arguments.of(anOrder().withTotal("150").build(), BigDecimal.ZERO));
}

@ParameterizedTest @CsvFileSource(resources = "/tax-rates.csv", numLinesToSkip = 1)
@ParameterizedTest @NullAndEmptySource @ValueSource(strings = {" ", "\\t"})
void blank_names_are_rejected(String name) { … }</pre>
<p><strong>6. @Nested — group by context</strong></p>
<pre>class OrderServiceTest {
    @Nested
    @DisplayName("when the customer has no payment method")
    class WithoutPaymentMethod {
        @BeforeEach void setUp() { … }              // applies only inside this context
        @Test void placing_an_order_fails() { … }
        @Test void the_cart_is_preserved() { … }
    }
    @Nested class WithExpiredCard { … }
}
// Reads as a specification tree in the IDE/report; outer @BeforeEach runs first.</pre>
<p><strong>7. Extensions — the JUnit 5 plug-in model</strong></p>
<pre>@ExtendWith(MockitoExtension.class)      // @Mock/@InjectMocks + strict stubbing
@ExtendWith(SpringExtension.class)       // implied by @SpringBootTest/@WebMvcTest
@Testcontainers                          // manages @Container lifecycle

// Your own: implement BeforeEachCallback / ParameterResolver / TestExecutionExceptionHandler
public class FixedClockExtension implements BeforeEachCallback, ParameterResolver { … }
// Register globally via META-INF/services or @ExtendWith on a custom composed annotation:
@Retention(RUNTIME) @Test @Tag("integration") @ExtendWith(DbExtension.class)
public @interface IntegrationTest {}</pre>
<p><strong>8. Selection and parallel execution</strong></p>
<pre>mvn test -Dgroups="fast" -DexcludedGroups="slow"       # by @Tag
# junit-platform.properties:
junit.jupiter.execution.parallel.enabled = true
junit.jupiter.execution.parallel.mode.default = concurrent
junit.jupiter.testinstance.lifecycle.default = per_method
# ⚠ Parallel execution exposes every shared-state bug you have — fix them, do not disable.</pre>
<div class="key-point">The pieces to remember: <strong>lifecycle</strong> (new instance per test, <code>@BeforeAll</code> is static), <strong><code>@ParameterizedTest</code></strong> instead of copy-pasted tests, <strong><code>@Nested</code></strong> to express context, <strong><code>@Tag</code></strong> to split fast and slow suites in CI, and <strong><code>@ExtendWith</code></strong> as the single extension mechanism that replaced JUnit 4 runners and rules — you can only have one runner, but any number of extensions.</div>`,
      },
      {
        q: 'What are test doubles? Dummy, stub, spy, mock, fake — and when do you use each?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Test double is the umbrella term for anything that stands in for a real collaborator, and the five kinds differ by how much behaviour they have and what you assert on. A <strong>dummy</strong> is just filler passed to satisfy a signature, a <strong>stub</strong> returns canned answers so the test can reach the interesting path, a <strong>spy</strong> is a real object that also records what happened, a <strong>mock</strong> is configured with expectations about interactions and fails if they are not met, and a <strong>fake</strong> is a working lightweight implementation such as an in-memory repository. The distinction that matters in practice is <strong>state verification versus interaction verification</strong>: stubs and fakes support asserting on the resulting state, which is refactor-friendly, while mocks assert on calls, which is only appropriate when the call itself is the requirement — sending an email, publishing an event, charging a card. Over-using mocks produces tests that mirror the implementation and break on every change.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Test double là thuật ngữ chung cho bất cứ thứ gì đóng thế một collaborator thật, và năm loại khác nhau ở chỗ chúng có bao nhiêu hành vi và bạn assert lên cái gì. <strong>Dummy</strong> chỉ là vật chèn chỗ để thỏa mãn chữ ký hàm; <strong>stub</strong> trả về các câu trả lời dựng sẵn để test đi tới được nhánh cần quan tâm; <strong>spy</strong> là object thật nhưng có ghi lại những gì đã xảy ra; <strong>mock</strong> được cấu hình kỳ vọng về các tương tác và sẽ fail nếu không thỏa; còn <strong>fake</strong> là một bản cài đặt nhẹ nhưng chạy thật, ví dụ repository trong bộ nhớ. Khác biệt quan trọng nhất trong thực tế là <strong>kiểm chứng theo trạng thái so với kiểm chứng theo tương tác</strong>: stub và fake cho phép assert lên trạng thái kết quả, thân thiện với refactor; còn mock assert lên lời gọi, chỉ nên dùng khi chính lời gọi đó là yêu cầu nghiệp vụ — gửi email, publish event, charge thẻ. Lạm dụng mock sẽ tạo ra những test phản chiếu code cài đặt và vỡ mỗi khi có thay đổi.</p></details>
<p><strong>1. The five kinds</strong></p>
<table>
<tr><th>Double</th><th>Has behaviour?</th><th>You assert on</th><th>Use when</th></tr>
<tr><td><strong>Dummy</strong></td><td>None — never used</td><td>Nothing</td><td>A parameter must be non-null but is irrelevant</td></tr>
<tr><td><strong>Stub</strong></td><td>Returns canned values</td><td>The resulting <strong>state</strong></td><td>You need the collaborator to answer so the logic can run</td></tr>
<tr><td><strong>Spy</strong></td><td>Real behaviour + records calls</td><td>State and/or calls</td><td>Legacy code, or you want the real method except one</td></tr>
<tr><td><strong>Mock</strong></td><td>Programmed expectations</td><td>The <strong>interaction</strong></td><td>The call itself is the requirement (email sent, event published)</td></tr>
<tr><td><strong>Fake</strong></td><td>A real, simplified implementation</td><td>State</td><td>In-memory repository, hash-map cache, embedded broker</td></tr>
</table>
<pre>// Dummy — only exists to fill the constructor
var service = new OrderService(repo, payments, Clock.systemUTC());   // clock unused here

// Stub — canned answer, no assertions about how it was called
when(exchangeRates.rateFor("USD")).thenReturn(new BigDecimal("25400"));

// Spy — real object, one method overridden
var service = spy(new OrderService(realRepo, realPayments, clock));
doReturn(true).when(service).isFeatureEnabled();    // note: doReturn, not when(...)

// Mock — the interaction IS the requirement
service.cancel(orderId);
verify(notifier).sendCancellationEmail(orderId);    // asserting the call is correct here

// Fake — a working implementation used only in tests
class InMemoryOrderRepository implements OrderRepository {
    private final Map&lt;Long, Order&gt; store = new ConcurrentHashMap&lt;&gt;();
    public Order save(Order o) { store.put(o.id(), o); return o; }
    public Optional&lt;Order&gt; findById(Long id) { return Optional.ofNullable(store.get(id)); }
}</pre>
<p><strong>2. State verification vs interaction verification</strong></p>
<pre>// State verification (preferred) — "after the action, the world looks like this"
service.place(order);
assertThat(repository.findById(order.id())).contains(order.withStatus(CONFIRMED));

// Interaction verification — "the action caused this call to happen"
service.place(order);
verify(paymentGateway).charge(new BigDecimal("120.00"));

Rule of thumb:
  • The outcome is observable state  → assert the state (survives refactoring).
  • The outcome is a side effect at a boundary (email, event, HTTP call, payment)
    → verify the interaction, because there is no state to observe.
  • Never do both for the same behaviour — you double the maintenance for no extra safety.</pre>
<p><strong>3. Fakes are underrated</strong></p>
<ul>
<li>An in-memory repository fake makes dozens of service tests read like real usage, with no <code>when(...)</code> noise and no coupling to call order.</li>
<li>It is written once, shared across the suite, and can enforce invariants the mock never would (e.g. duplicate key rejection).</li>
<li>Trade-off: the fake can drift from the real implementation — keep it honest with one contract test that runs the same test suite against both the fake and the real adapter.</li>
</ul>
<p><strong>4. When mocks go wrong</strong></p>
<pre>❌ Mocking value objects / DTOs / entities  → just construct them
❌ Mocking the class under test              → design smell; split the class
❌ Mocking types you do not own (SDK clients, JDBC) → wrap them in your own interface first
❌ Deep stubs: when(a.getB().getC().getD()).thenReturn(x)  → Law of Demeter violation
❌ 20 lines of when(...) before the action   → the class has too many collaborators
❌ verify() on everything                    → change-detector test, breaks on refactor</pre>
<div class="key-point">The short answer interviewers want: <em>"stub to get the code into the state I want, mock only when the interaction itself is the requirement, and prefer a fake over a pile of stubs."</em> Then the discriminator: <strong>state verification survives refactoring; interaction verification does not</strong> — so reach for <code>verify()</code> deliberately, not by default.</div>`,
      },
      // ──── 2. THE JAVA TOOLBOX — MOCKITO & ASSERTJ ────
      {
        q: 'Mockito cheat sheet: mock vs spy, stubbing, argument matchers, verify, ArgumentCaptor, answers, strictness, static/final mocking',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Mockito has four verbs: create a double with <code>mock</code> or <code>spy</code>, program it with <code>when(...).thenReturn(...)</code>, check interactions with <code>verify</code>, and capture arguments with <code>ArgumentCaptor</code> when the value passed to a collaborator is what matters. The two rules that prevent most mistakes are that <strong>argument matchers are all-or-nothing</strong> — if one argument uses <code>any()</code>, all of them must be matchers — and that <strong>spies need the <code>doReturn(...).when(spy).method()</code> form</strong>, because the normal <code>when(spy.method())</code> actually calls the real method first. Modern Mockito is strict by default under <code>MockitoExtension</code>, so unused stubbings fail the test, which is a feature: it deletes dead setup. Static and final methods can be mocked with <code>mockStatic</code> and the inline mock maker, but needing that is usually a signal that the dependency should have been injected instead.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mockito có bốn động từ: tạo double bằng <code>mock</code> hoặc <code>spy</code>, lập trình hành vi bằng <code>when(...).thenReturn(...)</code>, kiểm tra tương tác bằng <code>verify</code>, và bắt tham số bằng <code>ArgumentCaptor</code> khi giá trị truyền cho collaborator mới là thứ quan trọng. Hai quy tắc tránh được hầu hết lỗi: <strong>argument matcher phải dùng đồng bộ</strong> — nếu một tham số dùng <code>any()</code> thì tất cả đều phải là matcher; và <strong>spy phải dùng dạng <code>doReturn(...).when(spy).method()</code></strong>, vì dạng <code>when(spy.method())</code> sẽ gọi method thật trước. Mockito hiện đại mặc định chạy ở chế độ strict với <code>MockitoExtension</code>, nên các stub không dùng tới sẽ làm fail test — đây là tính năng tốt vì nó dọn sạch phần setup thừa. Method static và final có thể mock bằng <code>mockStatic</code> và inline mock maker, nhưng khi phải làm vậy thì thường đó là dấu hiệu lẽ ra nên tiêm phụ thuộc vào thay vì mock.</p></details>
<p><strong>1. Setup and creation</strong></p>
<pre>@ExtendWith(MockitoExtension.class)          // strict stubs, auto-init, auto-validate
class OrderServiceTest {
    @Mock  OrderRepository repository;       // all methods return null/0/empty by default
    @Spy   AuditLog auditLog = new AuditLog();   // real object, calls recorded
    @Captor ArgumentCaptor&lt;Order&gt; orderCaptor;
    @InjectMocks OrderService service;       // constructor injection of the mocks above
}
// Programmatic equivalents:
var repo = mock(OrderRepository.class);
var repo = mock(OrderRepository.class, RETURNS_DEEP_STUBS);   // avoid — Demeter smell
var spy  = spy(new AuditLog());

// ⚠ @InjectMocks is silent when it cannot inject: a missing @Mock becomes null,
//   and the failure surfaces as an NPE deep in the test. Prefer explicit construction:
//   service = new OrderService(repository, payments, clock);</pre>
<p><strong>2. Stubbing</strong></p>
<pre>when(repo.findById(1L)).thenReturn(Optional.of(order));
when(repo.findById(anyLong())).thenReturn(Optional.empty());
when(repo.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));   // echo the argument
when(gateway.charge(any())).thenThrow(new TimeoutException("gateway down"));

when(counter.next()).thenReturn(1, 2, 3);         // consecutive calls
when(counter.next()).thenReturn(1).thenThrow(new IllegalStateException());

doNothing().when(mailer).send(any());             // void methods use the do* family
doThrow(new MailException()).when(mailer).send(any());
doAnswer(inv -> { ((Runnable) inv.getArgument(0)).run(); return null; })
    .when(executor).execute(any());

// SPY: use doReturn, otherwise the real method executes during stubbing
doReturn(true).when(spyService).isEnabled();      // ✅
when(spyService.isEnabled()).thenReturn(true);    // ❌ calls the real isEnabled() first</pre>
<p><strong>3. Argument matchers — all or nothing</strong></p>
<pre>any(), any(Order.class), anyLong(), anyString(), anyList(), isNull(), isNotNull()
eq(42), argThat(o -> o.total().compareTo(TEN) > 0), same(instance)

verify(repo).update(eq(1L), any(Order.class));    // ✅ mixed → wrap literals in eq()
verify(repo).update(1L, any(Order.class));        // ❌ InvalidUseOfMatchersException

// anyString() does NOT match null (use isNull() or any()); any() matches everything.</pre>
<p><strong>4. Verification</strong></p>
<pre>verify(repo).save(order);                       // exactly once (default)
verify(repo, times(2)).save(any());
verify(repo, never()).delete(any());
verify(repo, atLeastOnce()).findById(1L);
verify(repo, atMost(3)).findById(anyLong());
verifyNoInteractions(paymentGateway);           // nothing at all was called
verifyNoMoreInteractions(repo);                 // use sparingly — brittle

InOrder inOrder = inOrder(repo, mailer);        // order matters only when it IS the requirement
inOrder.verify(repo).save(any());
inOrder.verify(mailer).send(any());

verify(repo, timeout(500)).save(any());         // async: wait up to 500 ms for the call</pre>
<p><strong>5. ArgumentCaptor — assert on what was passed</strong></p>
<pre>service.place(order);

verify(repository).save(orderCaptor.capture());
Order saved = orderCaptor.getValue();
assertThat(saved.status()).isEqualTo(CONFIRMED);
assertThat(saved.confirmedAt()).isNotNull();
// getAllValues() for multiple calls.
// Prefer a captor over argThat(...) when you want a readable assertion failure;
// prefer argThat(...) when the match is part of the expectation itself.</pre>
<p><strong>6. Strictness (this trips people upgrading from Mockito 1/2)</strong></p>
<pre>MockitoExtension defaults to Strictness.STRICT_STUBS:
   • unused stubbing            → UnnecessaryStubbingException (fail the test)
   • stubbed with wrong args    → PotentialStubbingProblem, with a helpful diff
   → this is good: it deletes copy-pasted setup and catches typos in matchers

Escape hatches (use deliberately, not as a habit):
   @MockitoSettings(strictness = Strictness.LENIENT)     // whole class
   lenient().when(repo.findById(any())).thenReturn(...); // one stubbing</pre>
<p><strong>7. Static, final, constructors — possible, but a design signal</strong></p>
<pre>// mockito-inline (default mock maker since Mockito 5) enables these:
try (MockedStatic&lt;Instant&gt; mocked = mockStatic(Instant.class)) {
    mocked.when(Instant::now).thenReturn(Instant.parse("2026-08-11T10:00:00Z"));
    …
}   // ALWAYS in try-with-resources — a leaked static mock corrupts other tests

try (MockedConstruction&lt;HttpClient&gt; mc = mockConstruction(HttpClient.class)) { … }

// Better in almost every case: inject the dependency instead
//   Clock clock → Clock.fixed(...)          UUID supplier → () -> FIXED_UUID
//   Static utility → wrap in an interface you can substitute</pre>
<p><strong>8. Common errors and what they mean</strong></p>
<table>
<tr><th>Error</th><th>Cause</th></tr>
<tr><td><code>UnnecessaryStubbingException</code></td><td>Stub never used — delete it, or the test does not do what you think</td></tr>
<tr><td><code>InvalidUseOfMatchersException</code></td><td>Mixed raw values and matchers, or a matcher used outside <code>when</code>/<code>verify</code></td></tr>
<tr><td><code>WrongTypeOfReturnValue</code></td><td>Usually <code>when(spy.x())</code> on a spy, or stubbing a different mock than you think</td></tr>
<tr><td><code>MissingMethodInvocationException</code></td><td>Stubbing a final/static/private method without the inline mock maker</td></tr>
<tr><td>NPE inside the class under test</td><td><code>@InjectMocks</code> silently left a dependency null</td></tr>
</table>
<div class="key-point">Two sentences that show fluency: <em>"matchers are all-or-nothing, and spies need <code>doReturn().when()</code> because <code>when(spy.x())</code> executes the real method."</em> Plus the judgement call: reaching for <code>mockStatic</code> is usually cheaper than refactoring today and more expensive every day after — inject a <code>Clock</code>, a supplier or an interface instead.</div>`,
      },
      {
        q: 'AssertJ and assertion technique: fluent assertions, exceptions, collections, soft assertions, custom assertions',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>AssertJ replaces the assortment of JUnit assert methods with a single discoverable entry point, <code>assertThat(actual)</code>, followed by type-aware chains, which matters for two reasons: the test reads like the specification, and the failure message shows exactly which field differed instead of just "expected true but was false". For objects it offers <code>extracting</code>, <code>returns</code> and <code>usingRecursiveComparison</code> so you can compare whole graphs while ignoring generated fields, for collections it offers containment and ordering assertions that state intent precisely, and for exceptions <code>assertThatThrownBy</code> lets you assert type, message and cause in one chain. <strong>Soft assertions</strong> collect several failures in one run so a failing test reports everything wrong rather than only the first problem, and custom assertions let you express domain vocabulary such as <code>assertThat(order).isConfirmed()</code>. The technique that matters more than the library is asserting on <strong>one outcome</strong> with the most specific assertion available.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>AssertJ thay cho mớ method assert rời rạc của JUnit bằng một điểm vào duy nhất là <code>assertThat(actual)</code>, kèm các chuỗi phương thức theo kiểu dữ liệu, và điều đó quan trọng vì hai lý do: test đọc như bản đặc tả, và thông báo lỗi chỉ rõ trường nào sai thay vì chỉ nói "expected true but was false". Với object, nó có <code>extracting</code>, <code>returns</code> và <code>usingRecursiveComparison</code> để so sánh cả cây dữ liệu trong khi bỏ qua các trường sinh tự động; với collection, nó có các assertion về chứa và thứ tự diễn đạt ý định chính xác; còn với ngoại lệ, <code>assertThatThrownBy</code> cho phép kiểm tra kiểu, thông điệp và nguyên nhân trong một chuỗi. <strong>Soft assertion</strong> gom nhiều lỗi trong một lần chạy để test báo hết mọi thứ sai thay vì chỉ lỗi đầu tiên, còn custom assertion giúp diễn đạt bằng ngôn ngữ nghiệp vụ như <code>assertThat(order).isConfirmed()</code>. Kỹ thuật quan trọng hơn cả thư viện là assert vào <strong>một kết quả</strong> bằng assertion cụ thể nhất có thể.</p></details>
<p><strong>1. Why not plain JUnit assertions</strong></p>
<pre>// JUnit: what failed?
assertTrue(order.getItems().stream().anyMatch(i -> i.sku().equals("A1")));
→ "expected: &lt;true&gt; but was: &lt;false&gt;"      ← useless

// AssertJ: the message contains the actual content
assertThat(order.getItems()).extracting(Item::sku).contains("A1");
→ "Expecting ArrayList: ["B2", "C3"] to contain: ["A1"] but could not find: ["A1"]"</pre>
<p><strong>2. The vocabulary you will use daily</strong></p>
<pre>import static org.assertj.core.api.Assertions.*;

// scalars &amp; strings
assertThat(total).isEqualByComparingTo("120.00");        // BigDecimal: NOT isEqualTo
assertThat(name).isNotBlank().startsWith("Ms").hasSize(8).containsIgnoringCase("smith");
assertThat(count).isPositive().isLessThanOrEqualTo(10).isBetween(1, 10);
assertThat(ratio).isCloseTo(0.33, within(0.01));         // doubles: never isEqualTo

// optionals, nulls
assertThat(maybeOrder).isPresent().get().extracting(Order::status).isEqualTo(NEW);
assertThat(maybeOrder).isEmpty();

// collections &amp; maps
assertThat(orders).hasSize(3)
                  .extracting(Order::status)
                  .containsExactly(NEW, PAID, SHIPPED);          // order matters
assertThat(orders).containsExactlyInAnyOrder(a, b, c);           // order irrelevant
assertThat(orders).filteredOn(o -> o.total().signum() > 0).hasSize(2);
assertThat(orders).allSatisfy(o -> assertThat(o.id()).isNotNull());
assertThat(orders).anyMatch(Order::isPaid).noneMatch(Order::isCancelled);
assertThat(byStatus).containsEntry(NEW, 2).containsKeys(NEW, PAID);

// objects
assertThat(order).returns(CONFIRMED, Order::status)
                 .returns("cust-1", Order::customerId);
assertThat(actual).usingRecursiveComparison()
                  .ignoringFields("id", "createdAt")             // generated values
                  .isEqualTo(expected);
assertThat(response).extracting("status", "body.total")          // nested paths
                    .containsExactly(200, "120.00");</pre>
<p><strong>3. Exceptions</strong></p>
<pre>assertThatThrownBy(() -> service.place(emptyOrder))
    .isInstanceOf(IllegalArgumentException.class)
    .hasMessageContaining("empty order")
    .hasNoCause();

assertThatExceptionOfType(PaymentFailedException.class)
    .isThrownBy(() -> service.place(order))
    .satisfies(ex -> assertThat(ex.reason()).isEqualTo("card_declined"));

assertThatNoException().isThrownBy(() -> service.validate(order));
assertThatNullPointerException().isThrownBy(() -> new Order(null));
// Always assert the TYPE and something about the message — an over-broad
// assertThatThrownBy(...).isInstanceOf(Exception.class) passes on the wrong bug.</pre>
<p><strong>4. Soft assertions — see every failure at once</strong></p>
<pre>@Test void order_snapshot() {
    SoftAssertions.assertSoftly(softly -> {
        softly.assertThat(order.status()).isEqualTo(CONFIRMED);
        softly.assertThat(order.total()).isEqualByComparingTo("120.00");
        softly.assertThat(order.items()).hasSize(2);
    });   // reports ALL three failures, not just the first
}
// JUnit 5 equivalent: assertAll(...). Use soft assertions when the asserts
// describe ONE outcome from different angles — not to bundle unrelated behaviours.</pre>
<p><strong>5. Custom assertions — domain vocabulary</strong></p>
<pre>public class OrderAssert extends AbstractAssert&lt;OrderAssert, Order&gt; {
    public OrderAssert(Order actual) { super(actual, OrderAssert.class); }
    public static OrderAssert assertThat(Order actual) { return new OrderAssert(actual); }

    public OrderAssert isConfirmed() {
        isNotNull();
        if (actual.status() != CONFIRMED)
            failWithMessage("Expected order &lt;%s&gt; to be CONFIRMED but was &lt;%s&gt;",
                            actual.id(), actual.status());
        return this;
    }
}
// Test reads: assertThat(order).isConfirmed().hasTotal("120.00");
// Worth it for concepts asserted in many tests; overkill for one-offs.</pre>
<p><strong>6. Assertion technique that is independent of the library</strong></p>
<ul>
<li><strong>Be specific</strong>: <code>hasSize(3)</code> beats <code>isNotEmpty()</code>; <code>containsExactly</code> beats <code>contains</code> when order is part of the contract.</li>
<li><strong>Assert the outcome, not the plumbing</strong>: prefer one assertion on the returned object over five <code>verify()</code> calls.</li>
<li><strong>No logic in tests</strong>: an <code>if</code> or a loop in the assert means the test can pass without checking anything. Use parameterized tests instead.</li>
<li><strong>Never recompute the expected value with the production algorithm</strong> — hardcode it, or the test proves only that the code equals itself.</li>
<li><strong>BigDecimal</strong>: <code>isEqualByComparingTo</code>, because <code>isEqualTo</code> compares scale (<code>1.0 != 1.00</code>). <strong>Doubles</strong>: <code>isCloseTo</code>.</li>
<li><strong>Time</strong>: assert against an injected fixed clock, or use <code>isCloseTo(expected, within(1, SECONDS))</code>.</li>
</ul>
<div class="key-point">The point of AssertJ is not style, it is <strong>the failure message</strong>: when a test breaks at 2am in CI, <code>usingRecursiveComparison</code> or <code>extracting(...).containsExactly(...)</code> tells you which field diverged, while <code>assertTrue(...)</code> tells you nothing. Pick the most specific assertion the library offers, and never let an assertion depend on the code it is testing.</div>`,
      },
      // ──── 3. DESIGNING FOR TESTABILITY ────
      {
        q: 'How do you design code to be testable? (dependency injection, seams, pure functions, hexagonal boundaries)',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Testability is a design property, not a testing technique: code is hard to test when it creates its own dependencies, reads global state, or mixes decision-making with side effects. The three habits that fix almost everything are <strong>constructor injection</strong> so every collaborator can be substituted, <strong>separating pure logic from I/O</strong> so the interesting rules can be tested with plain values and no doubles at all, and <strong>depending on interfaces you own</strong> at the process boundary, which is exactly what ports and adapters formalizes. Non-deterministic inputs — time, randomness, identifiers, the environment — must become injected dependencies such as a <code>Clock</code> or a supplier, otherwise tests are either flaky or forced into static mocking. A good signal is the setup block: if arranging a unit test needs more than a few lines, the class has too many responsibilities, and the right fix is to change the design rather than to write a bigger test.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Khả năng kiểm thử là một thuộc tính thiết kế chứ không phải kỹ thuật viết test: code khó test khi nó tự tạo ra phụ thuộc của mình, đọc trạng thái toàn cục, hoặc trộn lẫn việc ra quyết định với các tác dụng phụ. Ba thói quen giải quyết gần như mọi thứ là <strong>constructor injection</strong> để mọi collaborator đều thay thế được, <strong>tách logic thuần khỏi I/O</strong> để các luật quan trọng có thể test bằng giá trị thuần mà không cần double nào, và <strong>phụ thuộc vào interface do mình định nghĩa</strong> ở ranh giới tiến trình — chính là điều mà kiến trúc ports and adapters chuẩn hóa. Những đầu vào không tất định — thời gian, ngẫu nhiên, định danh, biến môi trường — phải trở thành phụ thuộc được tiêm vào như <code>Clock</code> hay một supplier, nếu không thì test sẽ chập chờn hoặc buộc phải mock static. Một dấu hiệu tốt là khối setup: nếu chuẩn bị cho một unit test cần hơn vài dòng, class đó đang ôm quá nhiều trách nhiệm, và cách sửa đúng là đổi thiết kế chứ không phải viết test to hơn.</p></details>
<p><strong>1. The four things that make code untestable</strong></p>
<table>
<tr><th>Anti-pattern</th><th>Why it hurts</th><th>Fix</th></tr>
<tr><td><code>new</code> inside a method</td><td>The collaborator cannot be replaced</td><td>Inject it (constructor), or inject a factory</td></tr>
<tr><td>Static calls / singletons</td><td>Global state leaks between tests</td><td>Wrap in an interface, inject the instance</td></tr>
<tr><td><code>LocalDate.now()</code>, <code>Math.random()</code>, <code>UUID.randomUUID()</code></td><td>Non-deterministic results</td><td>Inject <code>Clock</code>, <code>Random(seed)</code>, <code>Supplier&lt;UUID&gt;</code></td></tr>
<tr><td>Logic mixed with I/O</td><td>You need a database to test an <code>if</code></td><td>Pure function computes; caller performs the effect</td></tr>
</table>
<p><strong>2. Constructor injection is the single biggest win</strong></p>
<pre>// ❌ Untestable: dependencies created inside, time read from the system
public class InvoiceService {
    private final TaxClient tax = new HttpTaxClient("https://api.tax.gov");   // network!
    public Invoice issue(Order o) {
        var rate = tax.rateFor(o.country());
        return new Invoice(o, rate, LocalDate.now());                          // clock!
    }
}

// ✅ Testable: everything substitutable, nothing hidden
public class InvoiceService {
    private final TaxRates taxRates;     // interface I own (port)
    private final Clock clock;
    public InvoiceService(TaxRates taxRates, Clock clock) { … }
    public Invoice issue(Order o) {
        return new Invoice(o, taxRates.rateFor(o.country()), LocalDate.now(clock));
    }
}
// Test: new InvoiceService(country -> new BigDecimal("0.10"),
//                          Clock.fixed(FIXED_INSTANT, UTC));   ← a lambda, not even a mock</pre>
<p><strong>3. Separate decisions from effects (functional core, imperative shell)</strong></p>
<pre>// ❌ One method that reads, decides and writes — needs mocks for every test
public void expireSubscriptions() {
    for (Subscription s : repo.findAll())
        if (s.endsAt().isBefore(LocalDate.now()) &amp;&amp; !s.isCancelled()) {
            s.expire(); repo.save(s); mailer.notifyExpiry(s);
        }
}

// ✅ The rule is a pure function — tested with plain values, no doubles, no framework
public static List&lt;Subscription&gt; selectExpired(List&lt;Subscription&gt; all, LocalDate today) {
    return all.stream().filter(s -> s.endsAt().isBefore(today) &amp;&amp; !s.isCancelled()).toList();
}
// The shell stays trivial (and gets ONE integration test)
public void expireSubscriptions() {
    selectExpired(repo.findAll(), LocalDate.now(clock))
        .forEach(s -> { repo.save(s.expire()); mailer.notifyExpiry(s); });
}
// Now 15 edge cases are 15 fast tests of a static function with no setup at all.</pre>
<p><strong>4. Ports and adapters (hexagonal) — testability as architecture</strong></p>
<pre>        ┌──────────── domain (pure) ────────────┐
tests → │  entities, value objects, use cases    │ ← 80% of tests live here: no mocks,
        │  depends only on PORT interfaces       │   no Spring, milliseconds
        └───────┬──────────────────┬─────────────┘
                │ port             │ port
        [JPA adapter]        [Http/Kafka adapter]   ← adapters get integration tests
Rule: the domain never imports Spring, JPA, Jackson or javax.* — that is what keeps it
      testable with plain JUnit. Frameworks live in adapters, and adapters are thin.</pre>
<p><strong>5. Seams — the places where you can substitute behaviour</strong></p>
<ul>
<li><strong>Object seam</strong> (best): an interface parameter you can pass a fake to.</li>
<li><strong>Method seam</strong>: a protected method a test subclass can override — acceptable for legacy code, not for new design.</li>
<li><strong>Build seam</strong>: a different implementation on the test classpath — last resort.</li>
<li>If no seam exists, the standard legacy technique is: extract the untestable call into a method, then override or inject it — the minimum change that gets code under test.</li>
</ul>
<p><strong>6. Smells that predict painful tests</strong></p>
<pre>• More than ~4 constructor dependencies      → the class does too much
• A 30-line @BeforeEach                      → too much coupling / hidden state
• Needing @SpringBootTest for business logic → logic is entangled with the framework
• Tests full of when(a.getB().getC())        → Law of Demeter violation
• Having to mock a static utility            → hidden dependency; inject it instead
• Private methods you "wish you could test"  → they belong in a collaborator class</pre>
<div class="key-point">Say it as cause and effect: <em>"I do not make code testable by writing clever tests, I make it testable by injecting dependencies, keeping decision logic pure, and putting frameworks in adapters."</em> The corollary is the one seniors are expected to state: <strong>a test that is hard to write is design feedback</strong> — the fix usually belongs in the production code.</div>`,
      },
      {
        q: 'How do you test the hard things — time, randomness, UUIDs, static methods, void methods, private methods and legacy code?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Every hard-to-test element is a hidden dependency, and the standard cure is to make it explicit. Time becomes an injected <code>Clock</code> that tests fix to an instant, randomness becomes a seeded <code>Random</code> or an injected supplier, identifiers become a <code>Supplier&lt;UUID&gt;</code>, and environment or configuration becomes constructor parameters instead of static lookups. Void methods are tested through their observable effect — a change in state, a call to a boundary collaborator, or an emitted event — and private methods are never tested directly: they are exercised through the public API, and if that feels impossible the private logic wants to be its own class. Legacy code that cannot be refactored safely is first pinned with <strong>characterization tests</strong> that record current behaviour, then given a seam so the dependency can be substituted, and only then changed. Static mocking exists as a last resort, but it is slower, order-sensitive and hides the design problem instead of fixing it.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mọi thứ khó test đều là một phụ thuộc bị ẩn, và cách chữa tiêu chuẩn là làm nó hiện ra rõ ràng. Thời gian trở thành một <code>Clock</code> được tiêm vào để test cố định một mốc; tính ngẫu nhiên trở thành <code>Random</code> có seed hoặc một supplier được tiêm; định danh trở thành <code>Supplier&lt;UUID&gt;</code>; còn môi trường hay cấu hình trở thành tham số constructor thay vì tra cứu static. Method void được kiểm thử qua hiệu ứng quan sát được — trạng thái thay đổi, một lời gọi tới collaborator ở ranh giới, hoặc một event phát ra; còn method private thì không bao giờ test trực tiếp: chúng được chạy qua public API, và nếu thấy điều đó bất khả thi thì phần logic private đó đang muốn tách thành class riêng. Code cũ chưa thể refactor an toàn thì trước hết được "ghim" lại bằng <strong>characterization test</strong> ghi nhận hành vi hiện tại, sau đó tạo seam để thay thế phụ thuộc, rồi mới sửa. Mock static tồn tại như phương án cuối, nhưng nó chậm hơn, nhạy với thứ tự và che giấu vấn đề thiết kế thay vì sửa nó.</p></details>
<p><strong>1. Time — inject a Clock (java.time was designed for this)</strong></p>
<pre>// Production wiring
@Bean Clock clock() { return Clock.systemUTC(); }

class TokenService {
    private final Clock clock;
    boolean isExpired(Token t) { return t.expiresAt().isBefore(Instant.now(clock)); }
}

// Test — deterministic, no sleeping, no flakiness
Clock fixed = Clock.fixed(Instant.parse("2026-08-11T10:00:00Z"), ZoneOffset.UTC);
assertThat(new TokenService(fixed).isExpired(tokenExpiringAt("09:59:59Z"))).isTrue();

// Time travel without waiting:
Clock later = Clock.offset(fixed, Duration.ofHours(2));
// Mutable test clock for step-by-step scenarios:
class MutableClock extends Clock { Instant now; void advance(Duration d) { now = now.plus(d); } }

// ❌ Thread.sleep(1000) to "wait for expiry" — slow and still flaky under load.</pre>
<p><strong>2. Randomness, UUIDs, sequences</strong></p>
<pre>class Shuffler   { Shuffler(Random random) {…} }        // test: new Random(42) → reproducible
class OrderFactory {
    private final Supplier&lt;UUID&gt; ids;                   // test: () -> UUID.fromString("0000…1")
    private final Clock clock;
}
// Same trick for: hostname, environment variables, file paths, locale, time zone.
// Anything the OS or the universe decides should arrive through the constructor.</pre>
<p><strong>3. Void methods — assert the effect, not the return</strong></p>
<pre>// (a) State change on the object or a fake
service.deactivate(user);
assertThat(fakeUserRepo.findById(user.id()).orElseThrow().isActive()).isFalse();

// (b) Interaction at a boundary (this is where verify() is right)
service.deactivate(user);
verify(auditLog).record(argThat(e -> e.type() == DEACTIVATED));

// (c) Emitted event — often the cleanest observable outcome
service.deactivate(user);
assertThat(events.published()).containsExactly(new UserDeactivated(user.id()));

// (d) Exception thrown on the invalid path
assertThatThrownBy(() -> service.deactivate(alreadyDeleted)).isInstanceOf(IllegalStateException.class);</pre>
<p><strong>4. Private methods — do not test them directly</strong></p>
<pre>Options, best first:
 1. Test through the public method that uses it (a private method has no callers otherwise).
 2. If it holds substantial independent logic → EXTRACT IT into its own class with a
    public method. Complex private logic is a class trying to escape.
 3. Widen to package-private + @VisibleForTesting — pragmatic, acceptable, document why.
 4. Reflection / ReflectionTestUtils — last resort; it breaks on rename and hides the smell.
Same rule for private fields: set them through the constructor, not via reflection.</pre>
<p><strong>5. Static methods and legacy utilities</strong></p>
<pre>// Preferred: wrap and inject
interface IdGenerator { String next(); }
class UuidGenerator implements IdGenerator { public String next() { return UUID.randomUUID().toString(); } }

// Only when you cannot change the caller (third-party static, legacy):
try (MockedStatic&lt;LegacyUtils&gt; mocked = mockStatic(LegacyUtils.class)) {
    mocked.when(() -> LegacyUtils.format(any())).thenReturn("stub");
    …
}   // try-with-resources is mandatory; the mock is thread-local and leaks otherwise
// Cost: slower, blocks parallel execution of that class, and the next reader assumes
// the static call is fine to keep. Track it as debt.</pre>
<p><strong>6. Legacy code: characterization tests first</strong></p>
<pre>Michael Feathers' loop — "legacy code is code without tests":
 1. Find the change point.
 2. Find a SEAM (a place you can substitute behaviour without editing the logic).
 3. Write CHARACTERIZATION tests: call the code, print/assert what it ACTUALLY returns —
    including behaviour that looks wrong. You are pinning current behaviour, not correctness.
 4. Break the dependency (extract method + override, parameterize the constructor,
    extract interface, introduce a factory).
 5. Now refactor / fix — the pinned tests tell you what you changed.

Practical shortcut for a big legacy method: approval/snapshot testing (ApprovalTests) —
capture the whole output once, review it, and let the diff fail on any change.</pre>
<p><strong>7. Other awkward cases</strong></p>
<table>
<tr><th>Case</th><th>Approach</th></tr>
<tr><td>File system</td><td>JUnit 5 <code>@TempDir</code>, or an in-memory FS (Jimfs)</td></tr>
<tr><td>HTTP calls out</td><td>WireMock / MockWebServer — real protocol, controllable failures and delays</td></tr>
<tr><td>Environment variables</td><td>Inject config objects; <code>@SetEnvironmentVariable</code> (junit-pioneer) if unavoidable</td></tr>
<tr><td>System.out / logging</td><td>Assert on an injected logger/collector, or capture output with an extension — better: assert the behaviour instead</td></tr>
<tr><td>Constructors doing work</td><td>Move work to a factory method; constructors should only assign</td></tr>
<tr><td>Final classes (Kotlin, libraries)</td><td>Wrap in your own interface; or the inline mock maker as a last resort</td></tr>
</table>
<div class="key-point">One rule covers the whole question: <strong>make the hidden dependency explicit</strong>. Time, randomness, ids, environment and statics all become constructor parameters, and then the "hard" test becomes an ordinary one. Reserve <code>mockStatic</code>, reflection and <code>@TempDir</code>-style workarounds for code you genuinely cannot change — and say out loud that they are debt, not the target design.</div>`,
      },
      {
        q: 'Parameterized, data-driven and property-based testing — how do you cover many cases without copy-pasting tests?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>When the same behaviour must hold for many inputs, duplicating the test method is the wrong tool: JUnit 5's <code>@ParameterizedTest</code> turns the inputs into data, so each case is reported separately with its own name and a single failure points at the exact input. The sources cover most needs — <code>@ValueSource</code> for simple literals, <code>@CsvSource</code> for input-expected pairs, <code>@EnumSource</code> for state machines, <code>@MethodSource</code> for real objects and <code>@CsvFileSource</code> for larger data sets — and <code>@NullAndEmptySource</code> is the fastest way to cover the two edge cases everyone forgets. Beyond enumerating examples, <strong>property-based testing</strong> with a library such as jqwik generates hundreds of random inputs and checks an invariant instead of a specific result, then shrinks any failure to the smallest reproducing case, which is how you find the boundary conditions nobody thought to write down. The judgement call is what to parameterize: same behaviour with different data yes, different behaviours no.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Khi cùng một hành vi phải đúng với nhiều đầu vào, việc nhân bản method test là công cụ sai: <code>@ParameterizedTest</code> của JUnit 5 biến đầu vào thành dữ liệu, nên mỗi ca được báo cáo riêng với tên riêng và khi fail thì chỉ đúng đầu vào gây lỗi. Các nguồn dữ liệu đáp ứng hầu hết nhu cầu — <code>@ValueSource</code> cho giá trị đơn giản, <code>@CsvSource</code> cho cặp input-kết quả, <code>@EnumSource</code> cho máy trạng thái, <code>@MethodSource</code> cho object thật và <code>@CsvFileSource</code> cho tập dữ liệu lớn — còn <code>@NullAndEmptySource</code> là cách nhanh nhất để phủ hai ca biên mà ai cũng quên. Xa hơn việc liệt kê ví dụ, <strong>property-based testing</strong> với thư viện như jqwik sinh ra hàng trăm đầu vào ngẫu nhiên và kiểm tra một bất biến thay vì một kết quả cụ thể, rồi thu nhỏ ca lỗi về trường hợp nhỏ nhất tái hiện được — đó là cách tìm ra các điều kiện biên mà không ai nghĩ tới. Điều cần cân nhắc là parameterize cái gì: cùng hành vi khác dữ liệu thì có, khác hành vi thì không.</p></details>
<p><strong>1. The problem</strong></p>
<pre>// ❌ Four near-identical tests: any change to the API means four edits,
//    and the first failure hides the other three.
@Test void rejects_negative()  { assertThat(validator.isValid(-1)).isFalse(); }
@Test void rejects_zero()      { assertThat(validator.isValid(0)).isFalse(); }
@Test void accepts_one()       { assertThat(validator.isValid(1)).isTrue(); }
@Test void accepts_max()       { assertThat(validator.isValid(999)).isTrue(); }</pre>
<p><strong>2. The sources, and when each fits</strong></p>
<pre>// Simple literals
@ParameterizedTest @ValueSource(ints = {-1, 0, Integer.MIN_VALUE})
void rejects_non_positive(int qty) { assertThat(validator.isValid(qty)).isFalse(); }

// Input → expected pairs (the most used one)
@ParameterizedTest(name = "{0} → {1}")
@CsvSource({
    "0.00,   5.00",
    "99.99,  5.00",     // just below the threshold
    "100.00, 0.00",     // exactly at it
    "250.00, 0.00"
})
void shipping_fee(BigDecimal total, BigDecimal expected) {
    assertThat(calculator.feeFor(total)).isEqualByComparingTo(expected);
}

// Nulls and blanks — the two cases most bugs hide in
@ParameterizedTest @NullAndEmptySource @ValueSource(strings = {" ", "\\t", "\\n"})
void blank_names_are_rejected(String name) {
    assertThatThrownBy(() -> new Customer(name)).isInstanceOf(IllegalArgumentException.class);
}

// Every enum value — perfect for state machines (nothing is forgotten when a value is added)
@ParameterizedTest @EnumSource(Status.class)
void every_status_has_a_display_label(Status status) {
    assertThat(labels.forStatus(status)).isNotBlank();
}
@ParameterizedTest @EnumSource(value = Status.class, mode = EXCLUDE, names = {"CANCELLED"})
void cancellable_states(Status status) { … }

// Real objects / multiple types
@ParameterizedTest @MethodSource("discountScenarios")
void discount_rules(Customer customer, Order order, BigDecimal expected) { … }
static Stream&lt;Arguments&gt; discountScenarios() {
    return Stream.of(
        Arguments.of(aCustomer().gold().build(),     anOrder("100"), new BigDecimal("10.00")),
        Arguments.of(aCustomer().standard().build(), anOrder("100"), BigDecimal.ZERO));
}

// Big data sets — keep them in a resource file, reviewable by domain experts
@ParameterizedTest @CsvFileSource(resources = "/vat-rates.csv", numLinesToSkip = 1)
void vat_by_country(String country, BigDecimal rate) { … }

// Cartesian product of two dimensions (junit-pioneer)
@CartesianTest
void all_combinations(@Values(strings = {"VN","US"}) String country,
                      @Values(ints = {1, 100}) int qty) { … }</pre>
<p><strong>3. Reporting and naming</strong></p>
<pre>@ParameterizedTest(name = "[{index}] total={0} expects fee={1}")
// The name shows up per case in the IDE and CI report, so a red build says
//   "[3] total=100.00 expects fee=0.00 FAILED"  ← the input is in the failure itself.
// Argument conversion is automatic for primitives, enums, LocalDate, BigDecimal;
// use @ConvertWith / ArgumentConverter for custom types, @AggregateWith to build one object.</pre>
<p><strong>4. Property-based testing — assert invariants, let the machine find the input</strong></p>
<pre>// Example-based: you choose the inputs, so you only find bugs you imagined.
// Property-based: the library generates them (and SHRINKS failures to a minimal case).

@Property
void roundtrip_serialization_preserves_the_order(@ForAll("orders") Order order) {
    assertThat(json.parse(json.write(order))).isEqualTo(order);        // invariant
}

@Property
void discount_never_exceeds_the_total(@ForAll @BigRange(min="0", max="1e6") BigDecimal total,
                                      @ForAll @IntRange(min=0, max=100) int percent) {
    assertThat(pricing.discountFor(total, percent)).isBetween(BigDecimal.ZERO, total);
}
// Classic properties: roundtrip (encode/decode), idempotence (f(f(x))==f(x)),
// invariants (sorted output is a permutation of the input), oracle (matches a
// simpler slow implementation), commutativity, "never throws for valid input".
// jqwik reports:  Sample = [total=0.01, percent=100]  ← the SHRUNK counterexample</pre>
<p><strong>5. What to parameterize — and what not to</strong></p>
<ul>
<li><strong>Do</strong>: the same behaviour across a range of values, boundary values, every enum constant, table-driven business rules (tax, tiers, fees), and null/blank handling.</li>
<li><strong>Do not</strong>: cases that need different assertions or different setup — that is two tests wearing a costume, and the parameterized version becomes an <code>if</code> ladder.</li>
<li><strong>Never</strong> put logic in the parameterized body: <code>if (expected == null) assertThrows… else assertEquals…</code> means you should have written two tests.</li>
<li>Keep the data <strong>near the test</strong> unless it is genuinely large; a CSV in <code>src/test/resources</code> is good when domain experts review it.</li>
</ul>
<div class="key-point">The progression to describe: <em>"copy-pasted tests → <code>@ParameterizedTest</code> with the cases as data → property-based tests for invariants."</em> Boundary values (0, 1, max, empty, null, duplicate) belong in a <code>@CsvSource</code> row, not in your memory — and when you cannot enumerate the inputs, state the property instead and let jqwik search for the counterexample.</div>`,
      },
      // ──── 4. HARD CASES, INTEGRATION & FLAKINESS ────
      {
        q: 'How do you test asynchronous and concurrent code — and how do you eliminate flaky tests?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Asynchronous tests fail intermittently for one reason: they assume something has happened by the time they assert. The cure is to never sleep and never guess — either make the execution synchronous in the test by injecting a same-thread executor, or wait for a condition with a library such as Awaitility, which polls until the assertion passes or a timeout expires. For <code>CompletableFuture</code> you can simply join with a timeout, for Spring's <code>@Async</code> you replace the executor with <code>SyncTaskExecutor</code>, and for messaging you await the observable side effect rather than the internal call. Concurrency itself is tested differently: use a <code>CountDownLatch</code> or a barrier to force real parallel execution, run the scenario many times, and assert an invariant such as the final counter value — knowing that a green run proves nothing about correctness, so tools like jcstress or a deliberate stress loop matter more than a single test. Flakiness in general comes from shared state, time, ordering, real network and unbounded waiting; the fix is isolation and determinism, never a retry annotation.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Test bất đồng bộ fail lúc được lúc không vì một lý do: nó giả định rằng việc gì đó đã xảy ra tại thời điểm assert. Cách chữa là không bao giờ sleep và không đoán — hoặc làm cho phần thực thi trở nên đồng bộ trong test bằng cách tiêm một executor chạy cùng luồng, hoặc chờ theo điều kiện bằng thư viện như Awaitility, vốn poll cho tới khi assertion đúng hoặc hết thời gian chờ. Với <code>CompletableFuture</code> bạn chỉ cần join kèm timeout; với <code>@Async</code> của Spring thì thay executor bằng <code>SyncTaskExecutor</code>; còn với messaging thì hãy chờ tác dụng phụ quan sát được thay vì chờ một lời gọi nội bộ. Bản thân tính đồng thời lại được kiểm thử theo cách khác: dùng <code>CountDownLatch</code> hoặc barrier để ép chạy song song thật, lặp lại kịch bản nhiều lần, và assert một bất biến như giá trị bộ đếm cuối cùng — với ý thức rằng một lần chạy xanh không chứng minh được tính đúng đắn, nên các công cụ như jcstress hay vòng lặp gây tải chủ đích còn quan trọng hơn một test đơn lẻ. Nói chung, sự chập chờn đến từ trạng thái dùng chung, thời gian, thứ tự chạy, mạng thật và việc chờ không giới hạn; cách sửa là cô lập và tất định, chứ không phải một annotation retry.</p></details>
<p><strong>1. Never do this</strong></p>
<pre>@Test void sends_the_email() {
    service.registerAsync(user);
    Thread.sleep(500);                    // ❌ slow when it works, flaky when the CI box is busy
    verify(mailer).sendWelcome(user);
}
// Sleeps are a bet on machine speed. They make the suite slower AND less reliable —
// the worst possible trade.</pre>
<p><strong>2. Best option: remove the asynchrony in the test</strong></p>
<pre>// Inject the executor, then run everything on the calling thread in tests
class RegistrationService {
    private final Executor executor;                       // production: thread pool
    void registerAsync(User u) { executor.execute(() -> mailer.sendWelcome(u)); }
}
var service = new RegistrationService(Runnable::run);      // ← same-thread executor
service.registerAsync(user);
verify(mailer).sendWelcome(user);                          // deterministic, instant

// Spring: @TestConfiguration providing SyncTaskExecutor for @Async
@Bean TaskExecutor taskExecutor() { return new SyncTaskExecutor(); }
// This tests YOUR logic; test "it actually runs on another thread" once, separately.</pre>
<p><strong>3. When it must stay async: wait for a condition, not for a duration</strong></p>
<pre>// Awaitility — polls until the assertion passes or the timeout fires
await().atMost(Duration.ofSeconds(2))
       .pollInterval(Duration.ofMillis(50))
       .untilAsserted(() -> assertThat(repository.findById(id)).isPresent());

await().atMost(5, SECONDS).until(queue::isEmpty);
await().during(1, SECONDS).atMost(3, SECONDS).until(() -> counter.get() == 10);

// Mockito can wait too:
verify(mailer, timeout(2000)).sendWelcome(user);
verify(mailer, after(500).never()).sendWelcome(user);      // assert it did NOT happen

// CompletableFuture: always bound the wait
assertThat(service.loadAsync(id)).succeedsWithin(Duration.ofSeconds(1))
                                 .isEqualTo(expected);      // AssertJ
assertThatThrownBy(() -> future.get(1, SECONDS)).hasCauseInstanceOf(IOException.class);</pre>
<p><strong>4. Testing concurrency itself</strong></p>
<pre>@Test void concurrent_increments_do_not_lose_updates() throws Exception {
    int threads = 16, perThread = 1000;
    var counter = new Counter();                       // the class under test
    var start = new CountDownLatch(1);                 // release all threads at once
    var done  = new CountDownLatch(threads);
    var pool  = Executors.newFixedThreadPool(threads);

    for (int i = 0; i &lt; threads; i++) pool.submit(() -> {
        start.await();                                 // maximize real contention
        for (int j = 0; j &lt; perThread; j++) counter.increment();
        done.countDown();
        return null;
    });
    start.countDown();
    assertThat(done.await(10, SECONDS)).isTrue();      // no silent hang
    pool.shutdownNow();

    assertThat(counter.get()).isEqualTo(threads * perThread);   // the invariant
}
// Reality check: passing does NOT prove thread safety — races are probabilistic.
//   • @RepeatedTest(100) raises the odds of catching one
//   • jcstress explores real JMM interleavings (the right tool for lock-free code)
//   • ThreadSanitizer-style analysis / code review of the JMM reasoning still matters
// Also test the negative: assert that a deadlock-prone path completes within a timeout.</pre>
<p><strong>5. The flakiness taxonomy — and the actual fix</strong></p>
<table>
<tr><th>Cause</th><th>Symptom</th><th>Fix</th></tr>
<tr><td>Sleep-based waiting</td><td>Fails on a loaded CI agent</td><td>Awaitility / synchronous executor</td></tr>
<tr><td>Shared state between tests</td><td>Fails only in the full suite, or in a different order</td><td>Fresh fixtures per test; no static mutable state; reset caches</td></tr>
<tr><td>Test order dependence</td><td>Passes alone, fails in CI</td><td>Randomize order deliberately (<code>junit.jupiter.testmethod.order.random</code>) and fix what breaks</td></tr>
<tr><td>Real time / dates</td><td>Fails at midnight, month end, or in another timezone</td><td>Fixed <code>Clock</code>, explicit zone, no <code>now()</code></td></tr>
<tr><td>Unordered collections</td><td>Fails ~1 run in 10</td><td><code>containsExactlyInAnyOrder</code>, or sort before asserting</td></tr>
<tr><td>Random data</td><td>Occasional weird failure</td><td>Seed the generator and log the seed</td></tr>
<tr><td>Real network / external API</td><td>Fails when a third party is slow</td><td>WireMock / Testcontainers, never the live service</td></tr>
<tr><td>Port collisions, leftover containers</td><td>Fails in parallel builds</td><td>Random free ports, container-per-class with proper cleanup</td></tr>
<tr><td>Async assertions on internals</td><td>Race between the test and the worker</td><td>Await the observable outcome instead</td></tr>
</table>
<p><strong>6. Policy for flaky tests</strong></p>
<ul>
<li><strong>Never add a blanket retry.</strong> Retrying converts a real intermittent bug (often a genuine race in production code) into invisible noise.</li>
<li><strong>Quarantine, then fix within a deadline</strong>: move it out of the blocking suite, file a ticket, and delete the test if nobody fixes it — a permanently quarantined test is a lie.</li>
<li><strong>Measure</strong>: track flake rate per test in CI. Anything above a small threshold gets treated as a defect, because a suite people do not trust is a suite people ignore.</li>
<li><strong>Reproduce locally</strong> with repeated and randomized runs before "fixing" by guessing.</li>
</ul>
<div class="key-point">The line to say: <em>"I remove the asynchrony where I can (inject a same-thread executor) and await a condition where I cannot — <code>Thread.sleep</code> never appears in my tests."</em> And the senior addendum: a flaky test is usually telling you about a real race, shared state or time dependency in the production code — retrying it hides a bug rather than fixing a test.</div>`,
      },
      {
        q: 'When is a unit test not enough? Integration testing with Testcontainers, test data setup and isolation',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Unit tests cannot prove anything that lives outside your JVM: SQL correctness, constraints and locking, JPA mapping and lazy loading, serialization formats, transaction boundaries and rollbacks, and how a real broker behaves. Those need an integration test against the <strong>real engine</strong>, which is what Testcontainers gives you — a disposable Postgres, Kafka or Redis started from Docker for the test run — and it is the reason the old habit of substituting H2 for Postgres is discouraged: a different dialect and different constraint semantics produce tests that pass while production breaks. The two engineering problems that follow are <strong>data setup</strong>, which should build only what the test needs through builders or a small fixture, and <strong>isolation</strong>, which is achieved either by rolling back a transaction per test, truncating tables between tests, or giving each test unique keys. Keep the container per class or per suite rather than per test, and keep this layer small: it is seconds per test, so it should cover boundaries, not business rules already proven by unit tests.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Unit test không thể chứng minh bất cứ điều gì nằm ngoài JVM của bạn: tính đúng đắn của SQL, ràng buộc và khóa, mapping JPA và lazy loading, định dạng serialize, ranh giới transaction và rollback, hay cách một message broker thật hành xử. Những thứ đó cần integration test chạy trên <strong>engine thật</strong>, và đó chính là thứ Testcontainers mang lại — một Postgres, Kafka hay Redis dùng một lần được khởi động từ Docker cho lần chạy test — cũng là lý do thói quen cũ dùng H2 thay cho Postgres bị khuyến cáo: khác dialect và khác ngữ nghĩa ràng buộc sẽ tạo ra những test xanh trong khi production hỏng. Hai vấn đề kỹ thuật đi kèm là <strong>chuẩn bị dữ liệu</strong> — chỉ nên tạo đúng thứ test cần, thông qua builder hoặc một fixture nhỏ — và <strong>cô lập</strong> — đạt được bằng cách rollback transaction sau mỗi test, truncate bảng giữa các test, hoặc cho mỗi test một bộ khóa riêng. Hãy dùng container theo class hoặc theo cả bộ test thay vì theo từng test, và giữ tầng này nhỏ gọn: mỗi test tốn hàng giây, nên nó phải phủ các ranh giới chứ không phải luật nghiệp vụ vốn đã được unit test chứng minh.</p></details>
<p><strong>1. What only an integration test can prove</strong></p>
<table>
<tr><th>Question</th><th>Why a unit test cannot answer it</th></tr>
<tr><td>Does this native/JPQL query return the right rows?</td><td>The mock repository returns whatever you told it to</td></tr>
<tr><td>Does the unique index actually reject the duplicate?</td><td>Constraints live in the database, not in Java</td></tr>
<tr><td>Does <code>@Transactional</code> roll back on this exception?</td><td>The proxy and the transaction manager are not in play</td></tr>
<tr><td>Is the JSON contract still <code>snake_case</code> with the right date format?</td><td>Jackson configuration is framework wiring</td></tr>
<tr><td>Does the migration apply cleanly on the current schema?</td><td>Flyway/Liquibase needs a real database</td></tr>
<tr><td>Does the consumer handle a rebalance / duplicate delivery?</td><td>Broker semantics cannot be mocked faithfully</td></tr>
</table>
<p><strong>2. Testcontainers — the real engine, disposable</strong></p>
<pre>@SpringBootTest
@Testcontainers
class OrderRepositoryIT {                                    // *IT → runs in the verify phase

    @Container @ServiceConnection                            // Boot 3.1+: wires spring.datasource.*
    static PostgreSQLContainer&lt;?&gt; db = new PostgreSQLContainer&lt;&gt;("postgres:16-alpine");
    // static → ONE container for the whole class (per-test containers are unusably slow)

    @Autowired OrderRepository repository;

    @Test
    void unique_idempotency_key_prevents_a_double_insert() {
        repository.save(order("key-1"));
        assertThatThrownBy(() -> repository.saveAndFlush(order("key-1")))
            .isInstanceOf(DataIntegrityViolationException.class);
    }
}
// Also available: Kafka, Redis, MongoDB, Elasticsearch, LocalStack (S3/SQS),
// MinIO, WireMock, and GenericContainer for anything with a Docker image.
// Speed: reuse across runs with testcontainers.reuse.enable=true, or a shared
// singleton container in an abstract base class for the whole suite.</pre>
<p><strong>3. Why not H2 (or any in-memory substitute)</strong></p>
<pre>H2 in PostgreSQL mode is NOT PostgreSQL:
  • different SQL dialect (JSONB, arrays, window edge cases, ON CONFLICT, CTE behaviour)
  • different locking/isolation semantics → concurrency bugs invisible in tests
  • different type coercion, different error codes, no extensions
Result: green tests, broken production — the most expensive kind of false confidence.
Use the real engine for persistence tests; keep H2 only for throwaway prototypes.</pre>
<p><strong>4. Test data setup</strong></p>
<pre>Options, in order of maintainability:
 1. Builders in code            anOrder().withStatus(PAID).persistedIn(repo);
    → explicit, refactor-safe, each test states only what it cares about
 2. A small shared fixture      one @BeforeEach creating reference data (countries, tax rates)
 3. SQL scripts                 @Sql("/data/orders.sql") for bulk/legacy scenarios
 4. Production dumps            ❌ slow, contains PII, and nobody knows what it guarantees

Rules:
  • Never depend on data another test created.
  • Never assert on ids you did not control (use returned ids or natural keys).
  • Make the intent visible in the test: if the test is about expiry, the fixture line
    should say withExpiry(yesterday), not hide it in a shared SQL file.</pre>
<p><strong>5. Isolation between tests</strong></p>
<table>
<tr><th>Strategy</th><th>How</th><th>Trade-off</th></tr>
<tr><td><strong>Transaction rollback</strong></td><td><code>@Transactional</code> on the test (Spring rolls back after each)</td><td>Fast; but the test runs in one transaction — it cannot see commit behaviour, and it hides flush timing bugs</td></tr>
<tr><td><strong>Truncate/clean</strong></td><td>Delete all tables (or a library like Database Rider) between tests</td><td>Realistic (real commits), slightly slower — usually the best default</td></tr>
<tr><td><strong>Unique data per test</strong></td><td>Random tenant/email/key per test</td><td>Enables parallel execution; needs discipline</td></tr>
<tr><td><strong>Recreate the schema</strong></td><td>Flyway migrate per class</td><td>Slowest; also gives you a free migration test</td></tr>
</table>
<pre>// ⚠ @Transactional on a test hides real behaviour:
//   - LazyInitializationException never happens (the session stays open)
//   - constraint violations that fire on COMMIT are never seen
//   - @Async / new-transaction code paths behave differently
// For repository tests it is fine; for service/flow tests prefer commit + cleanup.</pre>
<p><strong>6. Keeping this layer affordable</strong></p>
<ul>
<li>Separate the phases: Surefire runs <code>*Test</code> (unit, seconds), Failsafe runs <code>*IT</code> (integration, minutes) — developers run the first constantly, CI runs both.</li>
<li>Reuse the Spring context: identical test configuration means one context is cached; a stray <code>@MockBean</code> difference silently creates another context and doubles the runtime.</li>
<li>Start containers once per suite (singleton pattern in an abstract base class) rather than per class when the suite is large.</li>
<li>Test the boundary, not the business rules: one integration test proving the query works, plus twenty unit tests for the rules that use it.</li>
</ul>
<div class="key-point">Frame it as coverage of risk, not of code: <em>"unit tests prove my logic, integration tests prove my assumptions about the database, the broker and the framework."</em> Two specifics that mark experience: <strong>use the real engine via Testcontainers instead of H2</strong>, and <strong>be deliberate about isolation</strong> — <code>@Transactional</code> rollback is fast but hides commit-time and lazy-loading behaviour.</div>`,
      },
      // ──── 5. QUALITY, PROCESS & MAINTAINABILITY ────
      {
        q: 'What does code coverage really tell you? Line vs branch coverage, mutation testing, and coverage anti-patterns',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Coverage measures which code was <strong>executed</strong> by the tests, not which behaviour was <strong>verified</strong>, so it is a useful signal and a terrible target. Line coverage says a statement ran, branch coverage says both sides of each condition ran and is the more honest number, but a test with no assertions still counts as full coverage — which is why teams that chase a percentage end up with tests that execute everything and prove nothing. <strong>Mutation testing</strong> closes that gap: a tool such as PIT deliberately changes the bytecode — flipping a comparison, removing a call, replacing a return — and reports how many of those mutants your tests kill, which measures assertion quality rather than execution. In practice you track coverage as a trend and enforce it on new or changed code, exclude generated and configuration code, look at the uncovered branches rather than the number, and treat critical modules to mutation testing where a silent failure would be expensive.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Coverage đo phần code đã được <strong>chạy</strong> bởi test, chứ không phải hành vi đã được <strong>kiểm chứng</strong>, nên nó là một tín hiệu hữu ích nhưng là một mục tiêu tồi. Line coverage nói rằng một câu lệnh đã chạy, branch coverage nói rằng cả hai nhánh của mỗi điều kiện đều đã chạy và là con số trung thực hơn; nhưng một test không có assertion nào vẫn được tính là phủ đầy đủ — đó là lý do các đội chạy theo phần trăm cuối cùng có những test chạy hết mọi thứ mà chẳng chứng minh gì. <strong>Mutation testing</strong> lấp khoảng trống đó: một công cụ như PIT cố ý thay đổi bytecode — đảo phép so sánh, bỏ một lời gọi, thay giá trị trả về — rồi báo cáo test của bạn "giết" được bao nhiêu đột biến, tức là đo chất lượng assertion chứ không phải mức độ chạy. Trong thực tế, hãy theo dõi coverage như một xu hướng và áp mức yêu cầu lên phần code mới hoặc thay đổi, loại trừ code sinh tự động và code cấu hình, nhìn vào các nhánh chưa phủ thay vì nhìn con số, và áp dụng mutation testing cho những module quan trọng nơi một lỗi âm thầm sẽ rất đắt.</p></details>
<p><strong>1. The metrics, from weakest to strongest</strong></p>
<table>
<tr><th>Metric</th><th>Answers</th><th>Weakness</th></tr>
<tr><td><strong>Line / statement</strong></td><td>Was this line executed?</td><td>A one-line <code>if</code> counts as covered with only one branch tested</td></tr>
<tr><td><strong>Branch / condition</strong></td><td>Did both outcomes of each decision run?</td><td>Still says nothing about assertions</td></tr>
<tr><td><strong>Path</strong></td><td>Were the combinations of branches covered?</td><td>Combinatorial explosion; rarely practical</td></tr>
<tr><td><strong>Mutation score</strong></td><td>Would the tests <em>notice</em> if the code changed?</td><td>Slow to run; needs tuning — but it is the real quality signal</td></tr>
</table>
<p><strong>2. Why 100% coverage proves nothing</strong></p>
<pre>public BigDecimal discount(BigDecimal total) {
    return total.compareTo(new BigDecimal("100")) &gt;= 0 ? total.multiply(TEN_PERCENT)
                                                       : BigDecimal.ZERO;
}

@Test void covers_everything() {
    service.discount(new BigDecimal("150"));      // executes the line
    service.discount(new BigDecimal("50"));       // executes the other branch
}                                                 // ✅ 100% line + branch coverage
                                                  // ❌ ZERO assertions — the method could
                                                  //    return garbage and this stays green.
// Also invisible to coverage: the boundary (exactly 100), negative totals, null,
// and rounding — the cases where the bug actually is.</pre>
<p><strong>3. JaCoCo in practice</strong></p>
<pre>&lt;plugin&gt;org.jacoco:jacoco-maven-plugin&lt;/plugin&gt;   → mvn verify → target/site/jacoco/index.html

Rules worth enforcing:
  • a threshold on CHANGED code (e.g. 80% branch on the diff) — not on the whole legacy repo
  • no ratchet-down: coverage may not drop below the current level
Exclusions that keep the number meaningful:
  • generated code (MapStruct, Lombok, protobuf, QueryDSL)
  • configuration classes, DTOs/records with no logic, main() and framework glue
Read the REPORT, not the number: the useful question is "which branch is red and why?"</pre>
<p><strong>4. Mutation testing (PIT) — does the suite actually detect bugs?</strong></p>
<pre>&lt;plugin&gt;org.pitest:pitest-maven&lt;/plugin&gt;   → mvn org.pitest:pitest-maven:mutationCoverage

How it works: PIT modifies bytecode and re-runs the tests that cover that code.
  conditional boundary   &gt;=  →  &gt;
  negate condition       ==  →  !=
  math                   +   →  -
  return values          return x → return null / 0 / ""
  void method call       removed entirely
  → mutant KILLED  = a test failed (good: your tests noticed)
  → mutant SURVIVED = nobody noticed the code changed (a real gap)

Typical finding: 95% line coverage, 60% mutation score — the surviving mutants are
exactly the untested boundaries and unasserted side effects.
Cost: minutes to hours → run it on critical packages nightly, not on every commit
(<code>withHistory</code> + <code>targetClasses</code> filters keep incremental runs fast).</pre>
<p><strong>5. Anti-patterns</strong></p>
<ul>
<li><strong>Coverage as a KPI</strong>: teams reach the number by testing getters and generated code, or by writing assertion-free tests. Goodhart's law in action.</li>
<li><strong>Blanket 80% on a legacy repo</strong>: produces a rush of low-value tests on easy code and none on the risky parts. Enforce on the diff instead.</li>
<li><strong>Counting integration tests toward unit coverage</strong>: an end-to-end test lights up thousands of lines while verifying one path.</li>
<li><strong>Ignoring the uncovered 20%</strong>: it is usually error handling and edge cases — the code most likely to be wrong and least likely to be exercised in production before an incident.</li>
</ul>
<div class="key-point">The nuanced answer interviewers want: <em>"coverage tells me what I definitely have NOT tested; it never tells me what I have tested well."</em> Use it as a red-flag detector (a 0%-covered service class is a real finding), enforce it on changed code, and if you want a number that correlates with catching bugs, measure the <strong>mutation score</strong> instead.</div>`,
      },
      {
        q: 'What is TDD in practice? Red-green-refactor, the mockist vs classicist schools, and when does TDD actually pay off?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>TDD is a design loop, not a testing policy: you write a failing test that states the next required behaviour, write the minimum code that makes it pass, then refactor with the test as a safety net, repeating in very small steps. Its real benefit is not coverage but pressure on the design — code written test-first tends to have small units, injected dependencies and clear boundaries, because anything else is painful to write a test for. Two schools disagree on the middle step: the <strong>classicist or Chicago</strong> style builds real objects and asserts on state, letting the design emerge from refactoring, while the <strong>mockist or London</strong> style mocks all collaborators and drives the design outside-in from the interactions. TDD pays off most where the rules are complex or the requirements are known and precise, and pays off least for exploratory work, UI layout and thin glue code — so the honest senior position is that it is one tool among several, applied where the feedback loop is worth the cost.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>TDD là một vòng lặp thiết kế chứ không phải một chính sách kiểm thử: bạn viết một test đang fail mô tả hành vi cần có tiếp theo, viết lượng code tối thiểu để nó pass, rồi refactor với test làm lưới an toàn, và lặp lại theo những bước rất nhỏ. Lợi ích thật sự của nó không phải là coverage mà là áp lực lên thiết kế — code viết theo lối test-first thường có các unit nhỏ, phụ thuộc được tiêm vào và ranh giới rõ ràng, vì mọi cách khác đều rất khó viết test. Hai trường phái khác nhau ở bước giữa: phong cách <strong>classicist (Chicago)</strong> dựng object thật và assert vào trạng thái, để thiết kế nổi lên dần qua refactor; còn phong cách <strong>mockist (London)</strong> mock mọi collaborator và dẫn dắt thiết kế từ ngoài vào theo các tương tác. TDD có lợi nhất khi luật nghiệp vụ phức tạp hoặc yêu cầu đã rõ và chính xác, và ít lợi nhất với công việc mang tính thăm dò, dựng giao diện hay code kết dính mỏng — nên quan điểm trung thực của một senior là: đây là một công cụ trong nhiều công cụ, dùng ở nơi vòng phản hồi xứng đáng với chi phí.</p></details>
<p><strong>1. The loop</strong></p>
<pre>🔴 RED     write the smallest failing test for the next behaviour
           → run it and SEE IT FAIL (this validates the test itself)
🟢 GREEN   write the simplest code that passes — hardcoding is allowed here
🔵 REFACTOR clean up production AND test code while the bar stays green
           → no new behaviour during refactor; that is the next red

Cycle length: seconds to a couple of minutes. If a cycle takes 20 minutes,
the step was too big — split it.</pre>
<pre>// Step 1 — RED
@Test void free_shipping_at_or_above_100() {
    assertThat(new Shipping().feeFor(new BigDecimal("100"))).isEqualByComparingTo("0.00");
}
// Step 2 — GREEN (yes, really: the simplest thing that passes)
BigDecimal feeFor(BigDecimal total) { return BigDecimal.ZERO; }
// Step 3 — RED again, forcing the real rule
@Test void flat_fee_below_100() {
    assertThat(new Shipping().feeFor(new BigDecimal("99.99"))).isEqualByComparingTo("5.00");
}
// Step 4 — GREEN: now the implementation must actually branch
BigDecimal feeFor(BigDecimal total) {
    return total.compareTo(new BigDecimal("100")) &gt;= 0 ? BigDecimal.ZERO : new BigDecimal("5.00");
}
// Step 5 — REFACTOR: extract the threshold, inject it, tidy the test names.
// "Triangulation": each new failing example forces the code to generalize.</pre>
<p><strong>2. Classicist vs mockist</strong></p>
<table>
<tr><th></th><th>Classicist (Chicago / Detroit)</th><th>Mockist (London)</th></tr>
<tr><td>Collaborators</td><td>Real objects; fakes only at the boundary</td><td>Mocked, almost always</td></tr>
<tr><td>Assertions</td><td>On resulting <strong>state</strong></td><td>On <strong>interactions</strong></td></tr>
<tr><td>Direction</td><td>Inside-out: build the domain, discover the design by refactoring</td><td>Outside-in: start at the entry point, discover collaborator interfaces as you need them</td></tr>
<tr><td>Strength</td><td>Refactor-friendly, catches integration between domain classes</td><td>Great for designing layered services and clarifying responsibilities early</td></tr>
<tr><td>Risk</td><td>A failure can point at a collaborator, not the unit</td><td>Tests mirror the implementation → brittle; mocks can drift from reality</td></tr>
</table>
<p>In practice most experienced teams are classicist inside the domain and mockist at the edges — mocks for the gateway, real objects for the rules.</p>
<p><strong>3. What TDD actually gives you</strong></p>
<ul>
<li><strong>Design pressure</strong>: untestable design becomes painful immediately rather than three months later.</li>
<li><strong>A specification you can run</strong>: the test names describe the behaviour set.</li>
<li><strong>Small steps</strong>: you are never more than a couple of minutes from a working state, which is also excellent for debugging.</li>
<li><strong>Courage to refactor</strong>: this is the compounding benefit — the suite is what makes later change cheap.</li>
<li>What it does <strong>not</strong> give you: architectural correctness, performance, or protection from misunderstanding the requirement.</li>
</ul>
<p><strong>4. When it pays — and when it does not</strong></p>
<table>
<tr><th>TDD fits well</th><th>TDD fits poorly</th></tr>
<tr><td>Complex business rules, calculations, parsers, state machines</td><td>Exploratory spikes where you do not yet know the shape</td></tr>
<tr><td>Bug fixing — write the failing test that reproduces it first</td><td>UI layout and visual work</td></tr>
<tr><td>Refactoring legacy code (after characterization tests)</td><td>Thin CRUD glue with no logic</td></tr>
<tr><td>APIs and libraries where the contract matters</td><td>Throwaway prototypes and one-off scripts</td></tr>
</table>
<p><strong>5. Related practices worth naming</strong>: <strong>BDD</strong> (Given-When-Then wording, Cucumber) shifts the conversation to business language and is TDD's outer loop; <strong>ATDD</strong> starts from an acceptance test; <strong>double-loop TDD</strong> wraps a failing acceptance test around the inner unit cycle. All share the same idea: write the expectation before the implementation.</p>
<div class="key-point">The balanced answer: <em>"TDD is primarily a design technique — its value is small units, injected dependencies and the courage to refactor, not the coverage number."</em> Then show judgement rather than dogma: always test-first for a bug fix (it proves the fix), usually test-first for complex rules, and rarely for a spike — and say which school you lean on and why.</div>`,
      },
      {
        q: 'How do you keep a large test suite maintainable? (naming, builders, DAMP vs DRY, brittle tests, review checklist)',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Test code is production code with a different purpose, so it needs the same care and one different rule: tests should be <strong>DAMP</strong> — descriptive and readable — rather than aggressively DRY, because a test that hides its setup in three layers of shared helpers can no longer be read as a specification. The techniques that keep a big suite healthy are test data builders with sensible defaults so each test states only what matters, names that describe behaviour so a red build is diagnosable from the report alone, and a strict rule that a test contains no logic. The main threat is <strong>brittleness</strong>: tests coupled to implementation details, over-verified mocks, shared mutable fixtures and asserting on incidental output all cause failures during refactoring and slowly teach the team to distrust the suite. Treat tests in code review as seriously as production code, delete tests that duplicate coverage or assert nothing, and keep the fast suite fast, because a suite that takes ten minutes stops being run.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Code test cũng là code production với mục đích khác, nên cần được chăm sóc tương đương và thêm một quy tắc riêng: test nên <strong>DAMP</strong> — mô tả rõ ràng, dễ đọc — hơn là DRY một cách cực đoan, vì một test giấu phần chuẩn bị dữ liệu sau ba tầng helper dùng chung thì không còn đọc được như một bản đặc tả. Những kỹ thuật giữ cho bộ test lớn khỏe mạnh là: test data builder với giá trị mặc định hợp lý để mỗi test chỉ nêu đúng thứ nó quan tâm, tên test mô tả hành vi để khi build đỏ có thể chẩn đoán ngay từ báo cáo, và một quy tắc nghiêm ngặt là test không chứa logic. Mối đe dọa chính là <strong>tính dễ vỡ</strong>: test bám vào chi tiết cài đặt, mock bị verify quá mức, fixture dùng chung có thể thay đổi, và assert vào các đầu ra không liên quan — tất cả đều gây fail khi refactor và dần dạy cả đội mất niềm tin vào bộ test. Hãy review test nghiêm túc như code production, xóa những test trùng lặp hoặc không assert gì, và giữ cho bộ test nhanh luôn nhanh, vì một bộ test chạy mười phút sẽ không còn ai chạy nữa.</p></details>
<p><strong>1. DAMP over DRY (the one place duplication is acceptable)</strong></p>
<pre>// ❌ Over-DRY: what is actually being tested? You must open three helpers to find out.
@Test void discount() {
    setUpEverything();                       // 40 lines, shared by 12 tests
    assertThat(runScenario(3)).isEqualTo(expected(3));
}

// ✅ DAMP: the test tells the whole story in five lines
@Test void gold_customers_get_10_percent_off_orders_above_100() {
    var customer = aCustomer().gold().build();
    var order    = anOrder().withTotal("200.00").build();

    var invoice = pricing.priceFor(customer, order);

    assertThat(invoice.discount()).isEqualByComparingTo("20.00");
}
// Rule: extract shared SETUP MECHANICS (builders, container startup, fixtures),
//       never the intent of the individual test.</pre>
<p><strong>2. Test data builders / object mothers</strong></p>
<pre>// Builder: fluent, override only what matters
anOrder().withTotal("200.00").withStatus(PAID).build()

// Object mother: named, meaningful scenarios
Orders.expiredSubscriptionOrder();  Customers.goldWithExpiredCard();

// Both give: valid defaults (so a new required field breaks ONE file, not 200 tests),
// intention-revealing tests, and no giant constructors in every test.
// Keep them in src/test/java and treat them as a first-class part of the codebase.</pre>
<p><strong>3. Naming and structure that scale</strong></p>
<pre>OrderServiceTest                       ← mirrors the production class
 ├── @Nested class WhenPaymentDeclined
 │      void does_not_save_the_order()
 │      void raises_PaymentFailedException_with_the_gateway_reason()
 └── @Nested class WhenOrderIsEmpty
        void rejects_before_calling_the_gateway()

Naming patterns (pick ONE and enforce it):
  methodName_stateUnderTest_expectedBehaviour   place_emptyOrder_throwsIllegalArgument
  should_X_when_Y                               should_reject_transfer_when_balance_low
  given_X_when_Y_then_Z                         given_expired_token_when_refresh_then_401</pre>
<p><strong>4. The brittleness catalogue</strong></p>
<table>
<tr><th>Smell</th><th>Why it breaks</th><th>Fix</th></tr>
<tr><td>Over-verification (<code>verifyNoMoreInteractions</code> everywhere)</td><td>Any new internal call fails the test</td><td>Verify only interactions that ARE the requirement</td></tr>
<tr><td>Asserting on <code>toString()</code> or full JSON</td><td>Adding a field breaks unrelated tests</td><td>Assert the specific fields that matter</td></tr>
<tr><td>Shared mutable fixture / static state</td><td>Order-dependent, mysterious CI failures</td><td>Fresh objects per test; no static mutables</td></tr>
<tr><td>Testing private behaviour via reflection</td><td>Breaks on every rename</td><td>Test through the public API, or extract a class</td></tr>
<tr><td>Logic in the test (<code>if</code>, loops, computed expectations)</td><td>The test can pass while asserting nothing</td><td>Parameterized tests with literal expected values</td></tr>
<tr><td>One test asserting five behaviours</td><td>The first failure hides the rest; the name cannot describe it</td><td>Split; or soft assertions if it truly is one outcome</td></tr>
<tr><td>Magic numbers everywhere</td><td>Nobody knows which value matters</td><td>Named constants: <code>FREE_SHIPPING_THRESHOLD</code></td></tr>
</table>
<p><strong>5. Keeping it fast (speed is a maintainability feature)</strong></p>
<ul>
<li>No Spring context in unit tests; no database, no network, no sleep.</li>
<li>Watch Spring context caching: every distinct test configuration (a different <code>@MockBean</code> set) creates and caches another context — a handful of variants is fine, thirty is a five-minute build.</li>
<li>Split suites by tag: fast tests on every save/commit, slow ones on the pipeline.</li>
<li>Enable parallel execution once tests are genuinely isolated; the failures it exposes are real bugs.</li>
<li>Budget it: if the unit suite exceeds roughly a minute locally, people stop running it, and every downstream practice degrades.</li>
</ul>
<p><strong>6. Review checklist for a test (use it on your own PRs)</strong></p>
<pre>□ Does the name state the behaviour, so a red CI report is self-explanatory?
□ One behaviour, one Act, assertions describing one outcome?
□ Does it assert anything at all (not just verify() / not just "does not throw")?
□ Would it survive a pure refactor of the implementation?
□ Have I seen it fail? (break the code deliberately once)
□ Is the setup only what this test needs — with defaults from a builder?
□ Deterministic: fixed clock, seeded random, no order dependence, no sleep?
□ Is it at the cheapest layer that can prove this (unit before integration)?
□ Does it duplicate an existing test? (delete one — duplicate tests are pure cost)</pre>
<div class="key-point">The senior framing: <em>"tests are the only thing that makes changing the code safe, so a suite that is slow, flaky or brittle is a liability, not an asset."</em> Concretely: DAMP over DRY, builders for data, verify only what is genuinely required, no logic in tests, and treat every test that fails during a refactor as feedback that it was testing the implementation rather than the behaviour.</div>`,
      },
    ],
  },
];
