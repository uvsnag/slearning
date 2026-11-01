import type { KmNode } from '../../types';

export const writingTests: KmNode = {
  title: 'Writing Tests',
  level: 'beginner',
  summary: 'The core annotations: mark tests, set up and clean up, name, group, skip and tag them.',
  simple:
    'Annotations are sticky notes on your methods. They tell JUnit "this is a test", "run this first" or "skip this one".',
  points: [
    'JUnit creates a new instance of the test class for every test method.',
    'Lifecycle methods prepare and clean up around each test.',
    'Good names and grouping make test reports read like a spec.',
  ],
  children: [
    {
      title: '@Test',
      level: 'beginner',
      summary:
        'Marks a method as a test. It passes unless it throws an exception or a failed assertion.',
      simple:
        'It is the "this is an exam question" stamp. JUnit only grades methods with that stamp.',
      points: [
        'Method must be non-private, return <code>void</code> and not be static.',
        'Use <code>org.junit.jupiter.api.Test</code>, not the old <code>org.junit.Test</code>.',
        'Name it after the behaviour: <code>rejectsNegativeAmount()</code>.',
        'Each test should be independent and runnable on its own.',
      ],
      tip: 'Importing org.junit.Test by mistake makes Jupiter silently skip the test. Check your imports.',
    },
    {
      title: 'Lifecycle methods',
      level: 'beginner',
      summary:
        '@BeforeEach/@AfterEach run around every test; @BeforeAll/@AfterAll run once per class.',
      simple:
        'Before every match you set up the pitch, after it you clean up. Once a season you build the stadium.',
      points: [
        '<code>@BeforeEach</code>: fresh objects for each test, so tests do not share state.',
        '<code>@AfterEach</code>: clean files, reset static things.',
        '<code>@BeforeAll</code> / <code>@AfterAll</code>: expensive one-time setup. Must be <code>static</code> by default.',
        'A new test class instance per test means fields reset automatically.',
        '<code>@AutoClose</code> (JUnit 5.11+) on a field closes it after each test for you.',
      ],
      detail: `<pre><code>class CartTest {
  Cart cart;

  @BeforeEach
  void setUp() { cart = new Cart(); }

  @Test
  void startsEmpty() { assertTrue(cart.isEmpty()); }

  @AfterEach
  void tearDown() { /* release resources */ }
}</code></pre>`,
    },
    {
      title: '@DisplayName',
      level: 'beginner',
      summary:
        'Gives a test a human-readable name, with spaces or even emoji, in reports and the IDE.',
      simple: 'Like a name tag at a party: "Hi, I am rejects empty cart" instead of a code number.',
      points: [
        '<code>@DisplayName("total is zero for an empty cart")</code>.',
        '<code>@DisplayNameGeneration(ReplaceUnderscores.class)</code> turns <code>adds_two_items</code> into "adds two items".',
        'Readable names make failures easy to understand in CI logs.',
      ],
    },
    {
      title: '@Nested',
      level: 'intermediate',
      summary: 'Groups related tests in inner classes, each with its own setup.',
      simple:
        'Folders inside a folder: "When the cart is empty", "When the cart has items", each with its own tests.',
      points: [
        'Must be a non-static inner class marked <code>@Nested</code>.',
        'Outer <code>@BeforeEach</code> runs first, then the inner one.',
        'Great for given-when-then style: one nested class per situation.',
      ],
      detail: `<pre><code>class StackTest {
  Stack&lt;Integer&gt; stack = new Stack&lt;&gt;();

  @Nested
  class WhenEmpty {
    @Test
    void popThrows() {
      assertThrows(EmptyStackException.class, stack::pop);
    }
  }
}</code></pre>`,
    },
    {
      title: '@Disabled & @Tag',
      level: 'beginner',
      summary: '@Disabled skips a test; @Tag labels tests so you can run or skip groups.',
      simple:
        '@Disabled is a "closed for repairs" sign. @Tag is a coloured sticker: run only the green ones today.',
      points: [
        'Always give a reason: <code>@Disabled("bug #123, flaky on CI")</code>.',
        '<code>@Tag("slow")</code>, <code>@Tag("integration")</code> on classes or methods.',
        'Maven: <code>groups</code> / <code>excludedGroups</code>. Gradle: <code>includeTags</code> / <code>excludeTags</code>.',
        'Tag expressions combine tags: <code>slow &amp; !db</code>.',
      ],
      tip: 'Disabled tests rot quickly. Track them with a ticket or delete them.',
    },
    {
      title: '@RepeatedTest & @Timeout',
      level: 'intermediate',
      summary: 'Run a test many times, or fail it if it takes too long.',
      simple:
        'Repeat is like flipping a coin 100 times to check it is fair. Timeout is a kitchen timer that rings if dinner takes too long.',
      points: [
        '<code>@RepeatedTest(50)</code> helps reproduce rare, flaky failures.',
        '<code>@Timeout(2)</code> fails the test after 2 seconds (default unit is seconds).',
        'Set a global default with <code>junit.jupiter.execution.timeout.default</code>.',
      ],
    },
  ],
};

export const assertions: KmNode = {
  title: 'Assertions',
  level: 'beginner',
  summary: 'The checks that decide if a test passes: equality, exceptions, groups, timeouts.',
  simple:
    'An assertion is the moment of truth: "I expected 10, did I get 10?" If not, the test turns red and tells you why.',
  points: [
    'Built in: <code>org.junit.jupiter.api.Assertions</code>.',
    'Optional message goes last, and can be a lazy <code>Supplier</code>.',
    'AssertJ is the most popular, more readable alternative.',
  ],
  children: [
    {
      title: 'assertEquals & friends',
      level: 'beginner',
      summary: 'Basic checks: equal, true/false, null/not null, same object.',
      simple: 'The everyday tools in the box: a ruler, a scale and a thermometer.',
      points: [
        '<code>assertEquals(expected, actual)</code>: expected value first.',
        'Doubles need a tolerance: <code>assertEquals(0.3, sum, 1e-9)</code>.',
        '<code>assertTrue</code>, <code>assertFalse</code>, <code>assertNull</code>, <code>assertNotNull</code>.',
        '<code>assertSame</code> checks it is the very same object, not just equal.',
        '<code>assertIterableEquals</code> compares lists element by element.',
        '<code>fail("…")</code> fails right away; <code>assertInstanceOf</code> checks the type and returns the cast value.',
      ],
      tip: 'Swapping expected and actual still passes or fails correctly, but the failure message becomes confusing.',
    },
    {
      title: 'assertThrows',
      level: 'beginner',
      summary: 'Checks that code throws a given exception and hands it back so you can inspect it.',
      simple:
        'You test a fire alarm by making smoke. assertThrows makes the smoke and checks the alarm rings.',
      points: [
        'Passes if the exception (or a subclass) is thrown.',
        'Returns the exception, so you can check its message.',
        '<code>assertThrowsExactly</code> rejects subclasses.',
        '<code>assertDoesNotThrow</code> for the opposite.',
      ],
      detail: `<pre><code>var ex = assertThrows(IllegalArgumentException.class,
    () -&gt; account.withdraw(-5));
assertEquals("amount must be positive", ex.getMessage());</code></pre>`,
    },
    {
      title: 'assertAll',
      level: 'intermediate',
      summary: 'Runs several checks and reports every failure together, not just the first.',
      simple:
        'A doctor checks heart, lungs and eyes in one visit and gives you the full report, instead of stopping at the first problem.',
      points: [
        'Each check is a lambda; all of them run.',
        'Great for checking several fields of one object.',
        'AssertJ offers the same idea as <code>SoftAssertions</code>.',
      ],
      detail: `<pre><code>assertAll("user",
    () -&gt; assertEquals("Ann", user.name()),
    () -&gt; assertEquals(30, user.age()),
    () -&gt; assertTrue(user.active()));</code></pre>`,
    },
    {
      title: 'assertTimeout',
      level: 'intermediate',
      summary: 'Fails if a block of code runs longer than a given duration.',
      simple: 'A stopwatch on one task: finish in 1 second or you lose.',
      points: [
        '<code>assertTimeout</code> waits for the code to finish, then checks the time.',
        '<code>assertTimeoutPreemptively</code> aborts the code when time is up.',
        'Preemptive runs code in another thread, so ThreadLocal things (like Spring transactions) break.',
      ],
      detail: `<pre><code>assertTimeout(Duration.ofMillis(500), () -&gt; service.search("java"));</code></pre>`,
    },
    {
      title: 'AssertJ',
      level: 'intermediate',
      summary: 'A fluent assertion library: assertThat(x).isEqualTo(y), with great messages.',
      simple:
        'Reads like an English sentence: "assert that the list has size 3 and contains Ann". Your IDE autocompletes the next word.',
      points: [
        'Rich checks for lists, maps, strings, dates, Optionals and exceptions.',
        'Chain checks: <code>hasSize(2).contains("a").doesNotContain("z")</code>.',
        '<code>assertThatThrownBy</code> checks exceptions fluently.',
        '<code>usingRecursiveComparison()</code> compares objects field by field.',
      ],
      detail: `<pre><code>assertThat(names)
    .hasSize(3)
    .containsExactly("Ann", "Bob", "Cid");

assertThatThrownBy(() -&gt; repo.find(-1))
    .isInstanceOf(IllegalArgumentException.class)
    .hasMessageContaining("id");</code></pre>`,
      tip: 'Forgetting the final check, like assertThat(x) alone, asserts nothing. Always end with a check method.',
    },
  ],
};
