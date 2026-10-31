import type { KmNode } from '../../types';

export const functional: KmNode = {
  title: 'Functional & Streams',
  level: 'intermediate',
  summary:
    'Lambdas, method references and the Stream API: pass behavior around and process data in pipelines.',
  simple:
    'Instead of writing every loop step by step, you describe what you want: "take the orders, keep the paid ones, sum the amounts".',
  points: [
    'Added in Java 8; now used everywhere in modern Java.',
    'Lambdas are short functions you can pass as values.',
    'Streams turn loops into readable pipelines.',
  ],
  children: [
    {
      title: 'Lambdas',
      level: 'beginner',
      summary: 'A short, nameless function you can store in a variable or pass to a method.',
      simple:
        'A lambda is a sticky note with instructions: "double this number". You hand the note to someone else to use later.',
      points: [
        'Syntax: <code>(a, b) -&gt; a + b</code> or <code>x -&gt; { ...; return y; }</code>.',
        'Parameter types are usually inferred.',
        'Can use local variables from outside only if they are effectively final (never reassigned).',
        '<code>this</code> inside a lambda means the enclosing object, unlike in anonymous classes.',
      ],
      detail: `<pre><code>Runnable hello = () -&gt; System.out.println("hi");
Comparator&lt;String&gt; byLen = (a, b) -&gt; Integer.compare(a.length(), b.length());
names.forEach(n -&gt; System.out.println(n));</code></pre>`,
    },
    {
      title: 'Functional Interfaces',
      level: 'intermediate',
      summary:
        'An interface with exactly one abstract method; a lambda is a quick way to implement it.',
      simple: 'It is a socket with one shape. Any lambda that fits the shape can be plugged in.',
      points: [
        '<code>Function&lt;T,R&gt;</code>: takes T, returns R (<code>apply</code>).',
        '<code>Predicate&lt;T&gt;</code>: takes T, returns boolean (<code>test</code>).',
        '<code>Supplier&lt;T&gt;</code>: takes nothing, returns T (<code>get</code>).',
        '<code>Consumer&lt;T&gt;</code>: takes T, returns nothing (<code>accept</code>).',
        'Also: <code>BiFunction</code>, <code>UnaryOperator</code>, and primitive ones like <code>IntPredicate</code>.',
        'Mark your own with <code>@FunctionalInterface</code> so the compiler checks it.',
      ],
      detail: `<pre><code>Predicate&lt;String&gt; isLong = s -&gt; s.length() &gt; 5;
Function&lt;String, Integer&gt; len = String::length;
Supplier&lt;List&lt;String&gt;&gt; newList = ArrayList::new;

isLong.and(s -&gt; s.startsWith("J")).test("Javalin"); // true</code></pre>`,
    },
    {
      title: 'Method References',
      level: 'intermediate',
      summary: 'A shorter way to write a lambda that just calls an existing method, using ::.',
      simple:
        'Instead of saying "call Bob and ask him to print", you just point at Bob: Bob::print.',
      points: [
        'Static method: <code>Integer::parseInt</code>.',
        'Method of a given object: <code>System.out::println</code>.',
        'Method of the argument: <code>String::toUpperCase</code> (same as <code>s -&gt; s.toUpperCase()</code>).',
        'Constructor: <code>ArrayList::new</code>.',
      ],
      tip: 'Use a method reference when it reads clearer; keep the lambda when it does not.',
    },
    {
      title: 'Stream API',
      level: 'intermediate',
      summary:
        'A pipeline that takes data from a source, transforms it step by step, and produces a result.',
      simple:
        'A factory conveyor belt: items come in, stations filter and reshape them, and a final station packs the result.',
      points: [
        'Three parts: source → intermediate operations → one terminal operation.',
        'Lazy: nothing runs until the terminal operation is called.',
        'Elements are pulled one by one through the whole pipeline, and some ops can stop early (<code>findFirst</code>, <code>limit</code>).',
        'A stream can be used only once.',
        'Streams do not change the source collection.',
      ],
      detail: `<pre><code>List&lt;String&gt; result = orders.stream()   // source
    .filter(o -&gt; o.isPaid())                 // intermediate
    .map(Order::customer)                    // intermediate
    .distinct()
    .toList();                               // terminal

Stream.of(1, 2, 3); IntStream.range(0, 10); Files.lines(path);</code></pre>`,
    },
    {
      title: 'Common Operations',
      level: 'intermediate',
      summary:
        'The stream operations you use every day: map, filter, flatMap, sorted, reduce and friends.',
      simple: 'A small toolbox: keep some, change each, flatten, sort, and add up.',
      points: [
        '<code>filter</code> keeps matches; <code>map</code> turns each element into something else.',
        '<code>flatMap</code> turns each element into a stream and merges them (list of lists → one list).',
        '<code>sorted</code>, <code>distinct</code>, <code>limit</code>, <code>skip</code>.',
        '<code>reduce</code> combines all into one value; <code>sum</code>, <code>count</code>, <code>max</code> are shortcuts.',
        '<code>anyMatch</code>, <code>allMatch</code>, <code>findFirst</code> stop early.',
        'Java 24 added <code>gather</code> for custom steps like sliding windows.',
      ],
      detail: `<pre><code>int total = orders.stream()
    .mapToInt(Order::quantity)
    .sum();

List&lt;String&gt; allTags = posts.stream()
    .flatMap(p -&gt; p.tags().stream())
    .sorted()
    .toList();</code></pre>`,
    },
    {
      title: 'Collectors',
      level: 'intermediate',
      summary:
        'Recipes for collect() that gather stream results into lists, maps, groups or strings.',
      simple:
        'Collectors are different kinds of baskets at the end of the conveyor belt: one long basket, labeled baskets, or a string of beads.',
      points: [
        '<code>toList()</code> on the stream (Java 16+) is unmodifiable; <code>Collectors.toList()</code> gives a mutable list.',
        '<code>groupingBy</code> builds a <code>Map&lt;K, List&lt;V&gt;&gt;</code>; add a downstream like <code>counting()</code>.',
        '<code>joining(", ")</code> glues strings together.',
        '<code>toMap</code> throws on duplicate keys unless you pass a merge function.',
        '<code>toMap</code> also throws on null values.',
      ],
      detail: `<pre><code>Map&lt;Status, Long&gt; perStatus = orders.stream()
    .collect(Collectors.groupingBy(Order::status, Collectors.counting()));

Map&lt;String, User&gt; byEmail = users.stream()
    .collect(Collectors.toMap(User::email, u -&gt; u, (a, b) -&gt; a));

String csv = names.stream().collect(Collectors.joining(","));</code></pre>`,
      tip: 'IllegalStateException: Duplicate key from toMap is a classic production bug. Always think about duplicates.',
    },
    {
      title: 'Parallel Streams',
      level: 'advanced',
      summary: 'parallelStream() splits work across CPU cores using the shared ForkJoinPool.',
      points: [
        'Helps only for large, CPU-heavy work on easily split sources (arrays, ArrayList, ranges).',
        'Avoid for I/O or blocking calls: they all share one common pool.',
        'Never change shared state inside; use reduce/collect instead.',
        'Small data or LinkedList sources are often slower in parallel.',
        'Measure before and after; do not assume it is faster.',
      ],
      tip: 'For many blocking tasks (HTTP, DB) use virtual threads instead (see Concurrency).',
    },
    {
      title: 'Optional Done Right',
      level: 'advanced',
      summary:
        'Use Optional as a clear "maybe" return value, chained with map and orElse, not as a fancy null check.',
      points: [
        'Chain: <code>map</code>, <code>flatMap</code>, <code>filter</code>, then <code>orElse</code>/<code>orElseThrow</code>.',
        'Avoid <code>get()</code> without a check; prefer <code>orElseThrow()</code>.',
        '<code>orElse(x)</code> always builds x; use <code>orElseGet(() -&gt; x)</code> for costly defaults.',
        'Do not use Optional for fields, parameters or collections (return an empty list instead).',
        'Never return <code>null</code> from a method whose type is Optional.',
      ],
      detail: `<pre><code>// Bad
if (opt.isPresent()) { return opt.get().name(); } else { return "n/a"; }

// Good
return opt.map(User::name).orElse("n/a");

User u = repo.findById(id)
    .orElseThrow(() -&gt; new NotFoundException(id));</code></pre>`,
    },
  ],
};
