import type { KmNode } from '../../types';

export const bestPractices: KmNode = {
  title: 'Performance & Best Practices',
  level: 'advanced',
  summary: 'Habits that make Java code correct, fast enough, secure and pleasant to work with.',
  simple:
    'Knowing the language is like knowing the rules of chess. These are the strategies good players use so they do not lose silly games.',
  points: [
    'Most ideas come from "Effective Java" by Joshua Bloch, worth reading.',
    'Correct and clear first; fast only where measuring shows it matters.',
    'Small habits (immutability, no nulls, closed resources) prevent whole classes of bugs.',
  ],
  children: [
    {
      title: 'Immutability',
      level: 'advanced',
      summary:
        'Objects that never change after creation are simpler and safe to share between threads.',
      simple:
        'An immutable object is like a printed receipt: nobody can secretly edit it, so you can hand copies to anyone.',
      points: [
        'Make fields <code>private final</code>, no setters, class <code>final</code> (or use a record).',
        'Copy mutable inputs in and out: <code>List.copyOf(items)</code>.',
        'To "change" it, return a new object, like <code>String</code> and <code>LocalDate</code> do.',
        'Thread-safe for free and perfect as map keys.',
      ],
      detail: `<pre><code>public record Order(String id, List&lt;String&gt; items) {
    public Order {
        items = List.copyOf(items); // defensive copy, also unmodifiable
    }
    public Order withItem(String item) {
        var copy = new ArrayList&lt;&gt;(items);
        copy.add(item);
        return new Order(id, copy);
    }
}</code></pre>`,
    },
    {
      title: 'Factories & Builders',
      level: 'advanced',
      summary:
        'Static factory methods and builders often beat plain constructors for creating objects.',
      simple:
        'A static factory is a constructor with a name that says what you get. A builder is filling in a form field by field before you press "create".',
      points: [
        'Static factory: <code>List.of()</code>, <code>Optional.empty()</code>. Named, can cache, can return a subtype.',
        'Builder: for many parameters, especially optional ones. Avoids <code>new Pizza(true, false, true, 2)</code>.',
        'Common names: <code>of</code>, <code>from</code>, <code>valueOf</code>, <code>getInstance</code>, <code>builder()</code>.',
        "Lombok's <code>@Builder</code> can generate builders for you.",
      ],
      detail: `<pre><code>Pizza p = Pizza.builder()
        .size(Size.LARGE)
        .cheese(true)
        .topping("mushroom")
        .build();

Money price = Money.of(10, "EUR"); // clearer than new Money(...)</code></pre>`,
    },
    {
      title: 'equals, hashCode & compareTo',
      level: 'advanced',
      summary:
        'These three must agree, or HashMaps, HashSets and sorted collections behave strangely.',
      simple:
        'If two things are "equal", they must get the same locker number (hashCode). Otherwise you put an item in one locker and look for it in another.',
      points: [
        'Override <code>equals</code> → you must override <code>hashCode</code> too.',
        'Equal objects need equal hash codes; the reverse is not required.',
        'Keep <code>compareTo</code> consistent with equals, or TreeSet may drop "duplicates".',
        'Do not use mutable fields in hashCode; changing them "loses" the object inside a HashSet.',
        'Records and <code>Objects.hash(...)</code> do it right for you.',
      ],
      tip: 'Classic trap: BigDecimal("1.0").equals(BigDecimal("1.00")) is false, but compareTo says 0. A HashSet keeps both, a TreeSet keeps one.',
    },
    {
      title: 'Avoid null',
      level: 'advanced',
      summary: 'Return empty collections or Optional instead of null, and fail fast on bad input.',
      simple:
        'A null is an empty box with no label. Whoever opens it without checking crashes. Clearly labelled empty boxes are safer.',
      points: [
        'Return <code>List.of()</code>, not null, for "no results".',
        'Use <code>Optional</code> for return values that may be missing; not for fields or parameters.',
        'Check inputs early: <code>Objects.requireNonNull(name, "name")</code>.',
        'Never call <code>optional.get()</code> without a check; use <code>orElse</code>, <code>orElseThrow</code>, <code>map</code>.',
      ],
      detail: `<pre><code>Optional&lt;User&gt; findByEmail(String email) { ... }

String name = findByEmail(email)
        .map(User::name)
        .orElse("guest");</code></pre>`,
    },
    {
      title: 'Resource Handling',
      level: 'advanced',
      summary:
        'Anything you open (files, connections, locks, executors) must be closed, even when errors happen.',
      simple:
        'Like turning off the tap after use. If you forget, the house slowly floods: no more files or DB connections.',
      points: [
        'Use try-with-resources for anything <code>AutoCloseable</code>.',
        'Resources close in reverse order, and suppressed exceptions are kept.',
        'Locks: <code>unlock()</code> in <code>finally</code>.',
        'Do not rely on GC or finalizers to close things; finalization is deprecated for removal.',
      ],
    },
    {
      title: 'Measure First',
      level: 'expert',
      summary:
        'Find the real bottleneck with profilers and benchmarks before you optimize anything.',
      simple:
        'Do not guess which pipe leaks. Turn on the water and look. The slow part is rarely where you expect.',
      points: [
        'Profile real workloads: JFR, async-profiler, flame graphs.',
        'Micro-benchmarks need JMH; hand-written loops lie because of JIT warm-up and dead-code removal.',
        'Look at the big picture first: DB queries, network calls, locks, GC.',
        'Set a goal (e.g. p99 latency) and stop when you reach it.',
      ],
      detail: `<pre><code>@Benchmark
public String concat(Blackhole bh) {
    return String.join(",", words); // JMH runs warm-up, forks and stats for you
}</code></pre>`,
      tip: 'Premature optimization makes code harder to read for gains nobody notices. Measure, fix the top item, measure again.',
    },
    {
      title: 'Common Performance Pitfalls',
      level: 'expert',
      summary: 'The usual suspects when Java code is slow, and one myth.',
      points: [
        'String <code>+</code> inside a loop: copies the string again and again. Use <code>StringBuilder</code>.',
        'Boxing in hot loops: <code>List&lt;Integer&gt;</code> and <code>Long sum</code> create objects. Use primitives or <code>IntStream</code>.',
        'N+1 queries: one query for a list, then one more per item. Fetch in one go (join or batch).',
        'Wrong collection: <code>list.contains</code> in a loop is O(n²); use a <code>HashSet</code>.',
        'Myth: "creating objects is slow". Short-lived objects are very cheap with modern GCs.',
      ],
      detail: `<pre><code>StringBuilder sb = new StringBuilder();
for (String w : words) {
    sb.append(w).append(',');
}
String csv = sb.toString();</code></pre>`,
    },
    {
      title: 'Clean Code & SOLID',
      level: 'advanced',
      summary: 'Small classes, clear names and five SOLID ideas that keep code easy to change.',
      simple:
        'Code is read far more often than written. Write it for the next person, who is often you in six months.',
      points: [
        'S: one class, one reason to change. O: add new behaviour by adding code, not editing old code.',
        'L: a subclass must work anywhere its parent works. I: small, focused interfaces.',
        'D: depend on interfaces, inject the real thing (this is what Spring does).',
        'Clear names beat comments; short methods; no magic numbers.',
        'Prefer composition over inheritance.',
      ],
      tip: 'Do not apply SOLID blindly. An extra interface with one implementation forever is just noise.',
    },
    {
      title: 'Secure Coding Basics',
      level: 'advanced',
      summary: 'Simple rules that block the most common attacks on Java apps.',
      points: [
        'Validate all input (size, format, range); never trust data from users or other systems.',
        'PreparedStatement for SQL, encoding for HTML output, no user input in shell commands.',
        'Keep secrets (passwords, keys) out of code and logs; use env vars or a vault.',
        'Never deserialize untrusted data with Java serialization; be careful with polymorphic JSON.',
        'Keep dependencies updated and scan them (OWASP Dependency-Check, Dependabot).',
        'Hash passwords with bcrypt or Argon2, never plain SHA or MD5.',
      ],
    },
    {
      title: 'API Design Tips',
      level: 'expert',
      summary:
        'How to design classes and methods that are easy to use correctly and hard to misuse.',
      points: [
        'Keep the public surface small; you can add later, but never easily remove.',
        'Accept interfaces (<code>List</code>, <code>Map</code>), return specific, immutable results.',
        'Avoid boolean flags in parameters; two clear methods or an enum read better.',
        'Fail fast with clear exceptions and messages.',
        'Document what can be null, what is thrown, and thread-safety.',
      ],
      detail: `<pre><code>// hard to read:
report.export(true, false);
// clear:
report.export(Format.PDF, Delivery.EMAIL);</code></pre>`,
    },
  ],
};
