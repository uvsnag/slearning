import type { KmNode } from '../../types';

export const parameterized: KmNode = {
  title: 'Parameterized Tests',
  level: 'intermediate',
  summary: 'Write one test method and run it with many different inputs.',
  simple:
    'Instead of writing ten nearly identical recipes, you write one recipe and feed it ten different ingredient lists.',
  points: [
    'Mark the method <code>@ParameterizedTest</code> instead of <code>@Test</code>.',
    'A source annotation supplies the inputs: values, CSV, methods, enums.',
    'Each input shows as its own test in reports.',
  ],
  children: [
    {
      title: '@ValueSource',
      level: 'intermediate',
      summary: 'The simplest source: a list of literal values, one per run.',
      simple: 'A list of numbers on a sticky note: try the test with each one.',
      points: [
        'Supports <code>ints</code>, <code>longs</code>, <code>doubles</code>, <code>strings</code>, <code>classes</code> and more.',
        'Only one argument per run.',
        'Add <code>@NullSource</code>, <code>@EmptySource</code> or <code>@NullAndEmptySource</code> for edge cases.',
      ],
      detail: `<pre><code>@ParameterizedTest
@ValueSource(strings = {"racecar", "level", "noon"})
@NullAndEmptySource
void isPalindrome(String word) {
  assertTrue(Strings.isPalindromeOrBlank(word));
}</code></pre>`,
    },
    {
      title: '@CsvSource',
      level: 'intermediate',
      summary: 'Several arguments per run, written as comma-separated rows.',
      simple: 'A small spreadsheet right in your code: each row is one test case.',
      points: [
        'Each row maps to the method parameters in order.',
        'Strings are converted automatically to numbers, enums, dates.',
        'Use a text block (<code>textBlock = """…"""</code>) for readable tables.',
        '<code>@CsvFileSource</code> reads rows from a file in resources.',
      ],
      detail: `<pre><code>@ParameterizedTest(name = "{0} + {1} = {2}")
@CsvSource({
    "1, 2, 3",
    "10, -5, 5",
    "0, 0, 0"
})
void adds(int a, int b, int expected) {
  assertEquals(expected, calc.add(a, b));
}</code></pre>`,
      tip: 'Use the name attribute with {0}, {1}… so a failing row is easy to spot in the report.',
    },
    {
      title: '@MethodSource',
      level: 'intermediate',
      summary: 'A static method builds the inputs, so you can pass any objects.',
      simple:
        'When a sticky note is not enough, you ask a helper to prepare the ingredients, even complex ones.',
      points: [
        'The method returns a <code>Stream</code>, list or array of <code>Arguments</code>.',
        'Same name as the test? You can leave out the method name.',
        'Must be <code>static</code>, unless the class uses the per-class lifecycle.',
        '<code>@FieldSource</code> (JUnit 5.11+) does the same with a static field holding the values.',
      ],
      detail: `<pre><code>static Stream&lt;Arguments&gt; orders() {
  return Stream.of(
      Arguments.of(new Order(100), 0.0),
      Arguments.of(new Order(500), 25.0));
}

@ParameterizedTest
@MethodSource("orders")
void discount(Order order, double expected) {
  assertEquals(expected, pricing.discount(order));
}</code></pre>`,
    },
    {
      title: '@EnumSource',
      level: 'intermediate',
      summary: 'Runs the test once for each value of an enum, or a filtered subset.',
      simple: 'Check every flavour on the menu, one by one, without typing their names.',
      points: [
        '<code>@EnumSource(Status.class)</code> runs for every constant.',
        '<code>names = {"NEW", "PAID"}</code> picks some; <code>mode = EXCLUDE</code> skips them.',
        'New enum values get tested automatically.',
      ],
      detail: `<pre><code>@ParameterizedTest
@EnumSource(value = Status.class, names = "CANCELLED", mode = EXCLUDE)
void activeStatusesCanShip(Status status) {
  assertTrue(status.canShip());
}</code></pre>`,
    },
    {
      title: 'Custom sources',
      level: 'advanced',
      summary: 'Build your own argument provider or turn many columns into one object.',
      simple:
        'If no ready-made lunch box fits, you build your own box and fill it exactly how you need.',
      points: [
        '<code>@ArgumentsSource(MyProvider.class)</code> with an <code>ArgumentsProvider</code>.',
        '<code>ArgumentsAccessor</code> reads many columns by index.',
        '<code>@AggregateWith</code> turns a row into one object, e.g. a <code>Person</code>.',
        '<code>@ConvertWith</code> plugs in a custom string-to-type converter.',
        'JUnit 5.13 added <code>@ParameterizedClass</code> to run a whole class per input.',
      ],
    },
  ],
};
