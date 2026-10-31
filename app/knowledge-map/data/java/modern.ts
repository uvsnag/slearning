import type { KmNode } from '../../types';

export const modernJava: KmNode = {
  title: 'Modern Java (8 → 25)',
  level: 'intermediate',
  summary: 'What changed in Java since version 8, and the features you should use today.',
  simple:
    'Java used to change slowly, once every few years. Now it ships small upgrades twice a year, and modern Java code looks much shorter than old Java code.',
  points: [
    'LTS (long-term support) versions: 8, 11, 17, 21, 25.',
    'Big themes: less boilerplate (var, records), better data modeling (sealed, patterns), easy concurrency (virtual threads).',
    'New features often arrive as "preview" first and become final a few releases later.',
  ],
  children: [
    {
      title: 'Release Cadence & LTS',
      level: 'beginner',
      summary: 'A new Java version every six months; every two years one of them is LTS.',
      simple:
        'Like phone updates: a new version every March and September. The LTS ones are the "stable" releases that companies stay on for years.',
      points: [
        'Six-month releases since Java 10 (2018).',
        'LTS versions: 8 (2014), 11 (2018), 17 (2021), 21 (2023), 25 (2025).',
        'Since 17, an LTS comes every two years.',
        'Non-LTS versions get updates only until the next release.',
        'Preview features need <code>--enable-preview</code> and may change before they are final.',
      ],
      tip: 'For production, pick the newest LTS your frameworks support. Many teams move from 17 or 21 to 25.',
    },
    {
      title: 'Java 8 Recap',
      level: 'beginner',
      summary:
        'The huge 2014 release that brought lambdas, streams, Optional and a new date-time API.',
      simple:
        'Java 8 is where Java learned to pass little functions around, which changed how everyone writes code.',
      points: [
        'Lambdas and method references: <code>x -&gt; x * 2</code>, <code>String::length</code>.',
        'Stream API: <code>filter</code>, <code>map</code>, <code>collect</code> on collections.',
        '<code>Optional</code>: a box that may be empty, for return values.',
        '<code>java.time</code>: <code>LocalDate</code>, <code>Instant</code>, <code>Duration</code>. Replaces <code>Date</code> and <code>Calendar</code>.',
        'Default methods in interfaces; metaspace replaced PermGen.',
      ],
    },
    {
      title: 'Modules (JPMS)',
      level: 'advanced',
      summary: "Java 9's module system: a module declares what it needs and what it shares.",
      simple:
        'A module is a package of packages with a guest list: who it depends on, and which rooms others may enter.',
      points: [
        'Declared in <code>module-info.java</code> with <code>requires</code> and <code>exports</code>.',
        'Strong encapsulation: non-exported packages are truly hidden, even from reflection.',
        'The JDK itself is split into modules; <code>jlink</code> builds a small custom runtime.',
        'Most apps still run on the classpath and never write module-info. That is fine.',
      ],
      detail: `<pre><code>module com.shop.orders {
    requires java.net.http;
    exports com.shop.orders.api;
}</code></pre>`,
    },
    {
      title: 'var & Text Blocks',
      level: 'beginner',
      summary:
        'var (Java 10) lets the compiler infer local types; text blocks (Java 15) are multi-line strings.',
      simple:
        'var is like saying "you can see what it is" instead of spelling out the type twice. Text blocks let you paste JSON or SQL as-is.',
      points: [
        '<code>var</code> works only for local variables, and the type is still fixed at compile time.',
        'Use var when the type is obvious from the right side.',
        'Text blocks start and end with <code>"""</code>; no more <code>\\n</code> and <code>+</code> everywhere.',
        'Common indentation is removed automatically.',
      ],
      detail: `<pre><code>var users = new ArrayList&lt;User&gt;();   // ArrayList&lt;User&gt;

String json = """
    {"name": "Ann", "age": 30}
    """;</code></pre>`,
    },
    {
      title: 'Switch Expressions',
      level: 'beginner',
      summary: 'Since Java 14, switch can return a value and uses arrows with no fall-through.',
      simple:
        'The old switch was a set of doors you could fall through by mistake. The new one is a clean "if this, then that" table.',
      points: [
        'Arrow cases <code>case X -&gt;</code> never fall through, so no <code>break</code>.',
        'Several labels in one case: <code>case SAT, SUN -&gt;</code>.',
        'Use <code>yield</code> to return a value from a block.',
        'Over an enum, the compiler checks you covered every value.',
      ],
      detail: `<pre><code>String type = switch (day) {
    case SATURDAY, SUNDAY -&gt; "weekend";
    default -&gt; "weekday";
};</code></pre>`,
    },
    {
      title: 'Records',
      level: 'intermediate',
      summary: 'Since Java 16, a record is a one-line class for plain immutable data.',
      simple:
        'A record is a labelled box for data. You list the fields, and Java writes the constructor, getters, equals, hashCode and toString for you.',
      points: [
        'Fields are final; accessors are <code>name()</code>, not <code>getName()</code>.',
        'Add validation in a compact constructor.',
        'Can implement interfaces and have methods, but cannot extend another class.',
        'Great for DTOs, keys in maps and results of methods.',
      ],
      detail: `<pre><code>record Money(BigDecimal amount, String currency) {
    Money {
        if (amount.signum() &lt; 0) throw new IllegalArgumentException("negative");
    }
}</code></pre>`,
      tip: 'A record is shallowly immutable: a List field can still be changed. Copy it with List.copyOf in the constructor.',
    },
    {
      title: 'Sealed Classes',
      level: 'intermediate',
      summary: 'Since Java 17, a sealed type lists exactly which classes may extend it.',
      simple:
        'It is a closed club with a fixed member list. Nobody else can join, so the compiler knows every possible member.',
      points: [
        'Declare with <code>sealed ... permits A, B, C</code>.',
        'Subclasses must be <code>final</code>, <code>sealed</code> or <code>non-sealed</code>.',
        'Perfect with records to model "one of these shapes" data.',
        'Lets switch check that every case is handled, no default needed.',
      ],
      detail: `<pre><code>sealed interface Shape permits Circle, Square {}
record Circle(double r) implements Shape {}
record Square(double side) implements Shape {}</code></pre>`,
    },
    {
      title: 'Pattern Matching',
      level: 'advanced',
      summary: "Test a value's shape and pull out its parts in one step, in instanceof and switch.",
      simple:
        'Instead of "is it a circle? then cast it to a circle, then get the radius", you just say "if it is a Circle(r), use r".',
      points: [
        '<code>instanceof</code> patterns: Java 16. No more manual cast.',
        'Patterns in <code>switch</code>: Java 21, with <code>when</code> guards and <code>case null</code>.',
        'Record patterns: Java 21, take a record apart right in the case.',
        'With sealed types, the compiler checks every case is covered.',
      ],
      detail: `<pre><code>double area(Shape s) {
    return switch (s) {
        case Circle(double r) -&gt; Math.PI * r * r;
        case Square(double side) -&gt; side * side;
    };
}

if (obj instanceof String str &amp;&amp; !str.isBlank()) { use(str); }</code></pre>`,
    },
    {
      title: 'Java 21 Highlights',
      level: 'intermediate',
      summary:
        'The 2023 LTS: virtual threads, pattern matching for switch, record patterns and sequenced collections.',
      simple: 'Java 21 is the release where many long-awaited features became final at once.',
      points: [
        'Virtual threads: cheap threads for blocking I/O (see Concurrency).',
        'Sequenced collections: <code>getFirst()</code>, <code>getLast()</code>, <code>reversed()</code> on List, Deque, LinkedHashMap…',
        'Pattern matching for switch and record patterns become final.',
        'Generational ZGC added as an option.',
      ],
      detail: `<pre><code>List&lt;String&gt; names = List.of("a", "b", "c");
names.getFirst();   // "a"
names.reversed();   // [c, b, a]</code></pre>`,
    },
    {
      title: 'Java 22–25 Highlights',
      level: 'advanced',
      summary: 'Smaller quality-of-life features leading up to Java 25, the 2025 LTS.',
      points: [
        'Java 22: unnamed variables <code>_</code> for values you do not use; the FFM API (call native code without JNI) is final.',
        'Java 23: Markdown in doc comments with <code>///</code>; generational ZGC becomes the default ZGC mode.',
        'Java 24: Stream gatherers (custom stream steps) are final; virtual threads no longer pin on synchronized.',
        'Java 25: compact source files and instance main methods are final, so a tiny program needs no class.',
        'Java 25: flexible constructor bodies (code before <code>super(...)</code>), module imports and scoped values are final.',
      ],
      detail: `<pre><code>// Java 25: a whole program in one file
void main() {
    IO.println("Hello, Java 25!");
}

// Java 22: ignore what you do not need
try { run(); } catch (Exception _) { retry(); }</code></pre>`,
    },
  ],
};
