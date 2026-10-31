import type { KmNode } from '../../types';

export const collections: KmNode = {
  title: 'Collections & Generics',
  level: 'beginner',
  summary:
    'Ready-made data structures (lists, sets, maps, queues) and the generics that make them type-safe.',
  simple:
    'Collections are containers for groups of things: a shopping list, a set of unique stamps, a phone book. Generics put a label on the container saying what goes inside.',
  points: [
    'Main interfaces: <code>List</code>, <code>Set</code>, <code>Queue</code>/<code>Deque</code>, <code>Map</code>.',
    'Code against the interface, pick the implementation for performance.',
    'Knowing HashMap internals is a top Java interview topic.',
  ],
  children: [
    {
      title: 'The Big Picture',
      level: 'beginner',
      summary: 'How the collection interfaces and their main implementations fit together.',
      simple:
        'Think of a family tree. Collection is the grandparent; List, Set and Queue are its kids. Map lives in its own house next door.',
      points: [
        '<code>Collection</code> → <code>List</code>, <code>Set</code>, <code>Queue</code> (→ <code>Deque</code>).',
        '<code>Map</code> is separate: it stores key → value pairs.',
        'Java 21 added <code>SequencedCollection</code>/<code>SequencedMap</code> with <code>getFirst()</code>, <code>getLast()</code>, <code>reversed()</code>.',
        'Helpers live in <code>Collections</code> and <code>Arrays</code>.',
      ],
      detail: `<pre><code>Collection
 ├─ List   : ArrayList, LinkedList
 ├─ Set    : HashSet, LinkedHashSet, TreeSet
 └─ Queue  : ArrayDeque, PriorityQueue
Map        : HashMap, LinkedHashMap, TreeMap</code></pre>`,
      tip: 'Declare variables as the interface: List<String> names = new ArrayList<>();',
    },
    {
      title: 'List',
      level: 'beginner',
      summary: 'An ordered collection that allows duplicates and access by index.',
      simple: 'A numbered to-do list. Items keep their order, and you can ask for item number 3.',
      points: [
        '<code>ArrayList</code>: backed by an array. Fast <code>get(i)</code>, fast add at the end.',
        '<code>LinkedList</code>: chain of nodes. Slow <code>get(i)</code>, uses more memory.',
        'Inserting in the middle is O(n) for both (LinkedList still has to walk there).',
        'In practice, <code>ArrayList</code> wins almost always; use <code>ArrayDeque</code> for queues.',
      ],
      detail: `<pre><code>List&lt;String&gt; names = new ArrayList&lt;&gt;();
names.add("Ann");
names.add("Bob");
names.get(0);          // "Ann"
names.remove("Bob");</code></pre>`,
      tip: 'Asked "ArrayList vs LinkedList"? Say ArrayList is the default because of memory locality (CPU cache friendly).',
    },
    {
      title: 'Set',
      level: 'beginner',
      summary: 'A collection with no duplicates.',
      simple: 'A guest list at a party: adding the same name twice does nothing.',
      points: [
        '<code>HashSet</code>: fastest, no order. Backed by a HashMap.',
        '<code>LinkedHashSet</code>: keeps insertion order.',
        '<code>TreeSet</code>: keeps elements sorted, O(log n) operations.',
        'Uniqueness uses <code>equals</code>/<code>hashCode</code> (or <code>compareTo</code> for TreeSet).',
      ],
      detail: `<pre><code>Set&lt;String&gt; tags = new HashSet&lt;&gt;(List.of("java", "kafka", "java"));
tags.size();   // 2
new TreeSet&lt;&gt;(tags); // [java, kafka] sorted</code></pre>`,
    },
    {
      title: 'Map',
      level: 'beginner',
      summary: 'Stores key → value pairs; each key appears only once.',
      simple: 'A phone book: you look up a name (key) and get a number (value).',
      points: [
        '<code>HashMap</code>: fast, no order, allows one null key.',
        '<code>LinkedHashMap</code>: keeps insertion order (or access order, handy for an LRU cache).',
        '<code>TreeMap</code>: keys sorted; has <code>firstKey</code>, <code>floorKey</code>, <code>headMap</code>.',
        'Useful methods: <code>getOrDefault</code>, <code>putIfAbsent</code>, <code>computeIfAbsent</code>, <code>merge</code>.',
      ],
      detail: `<pre><code>Map&lt;String, Integer&gt; count = new HashMap&lt;&gt;();
for (String w : words) {
  count.merge(w, 1, Integer::sum);
}
Map&lt;String, List&lt;Order&gt;&gt; byUser = new HashMap&lt;&gt;();
byUser.computeIfAbsent("ann", k -&gt; new ArrayList&lt;&gt;()).add(order);</code></pre>`,
      children: [
        {
          title: 'HashMap Internals',
          level: 'advanced',
          summary:
            'An array of buckets; the key hash picks the bucket, collisions are chained and may become trees.',
          points: [
            'Index = <code>hash(key)</code> spread with its high bits, then <code>&amp; (capacity - 1)</code>.',
            'Same bucket? Entries form a linked list; equals finds the right one.',
            'A bucket with 8+ entries turns into a red-black tree (only if capacity ≥ 64), so the worst case is O(log n).',
            'Default capacity 16, load factor 0.75: when size &gt; 12 it doubles and rehashes.',
            'Not thread-safe; use <code>ConcurrentHashMap</code> for shared access.',
          ],
          detail: `<pre><code>buckets[16]
 [0] -&gt; null
 [1] -&gt; ("ann",1) -&gt; ("zed",9)   // collision chain
 [2] -&gt; null
 ...
// size &gt; 16 * 0.75 = 12  =&gt; resize to 32</code></pre>`,
          tip: 'Set an initial capacity when you know the size to avoid repeated resizes. Java 19+ has HashMap.newHashMap(n).',
        },
      ],
    },
    {
      title: 'Queue, Deque & PriorityQueue',
      level: 'intermediate',
      summary:
        'Collections for waiting lines: FIFO queues, double-ended deques and priority-ordered queues.',
      simple:
        'A queue is the line at a coffee shop. A deque lets people join or leave at both ends. A priority queue is the ER: the most urgent goes first.',
      points: [
        '<code>offer</code>/<code>poll</code>/<code>peek</code> return null or false; <code>add</code>/<code>remove</code>/<code>element</code> throw.',
        '<code>ArrayDeque</code>: best choice for both stack and queue. Do not use old <code>Stack</code>.',
        '<code>PriorityQueue</code>: a heap; <code>poll()</code> gives the smallest (or by your Comparator).',
        'Iterating a PriorityQueue does not give sorted order; only polling does.',
      ],
      detail: `<pre><code>Deque&lt;Integer&gt; stack = new ArrayDeque&lt;&gt;();
stack.push(1); stack.push(2);
stack.pop();   // 2

var pq = new PriorityQueue&lt;Task&gt;(Comparator.comparing(Task::priority));
pq.offer(task);
pq.poll();     // lowest priority value first</code></pre>`,
    },
    {
      title: 'Comparable vs Comparator',
      level: 'intermediate',
      summary:
        'Comparable is the natural order built into a class; Comparator is an order you pass from outside.',
      simple:
        'Comparable is how a class sorts itself by default, like words in a dictionary. Comparator is a custom rule you bring, like "sort by length".',
      points: [
        '<code>Comparable&lt;T&gt;</code>: implement <code>compareTo</code> inside the class.',
        '<code>Comparator&lt;T&gt;</code>: separate object, can have many different orders.',
        'Build comparators: <code>comparing</code>, <code>thenComparing</code>, <code>reversed</code>, <code>nullsFirst</code>.',
        'Keep <code>compareTo</code> consistent with <code>equals</code>, or TreeSet may drop items.',
      ],
      detail: `<pre><code>people.sort(Comparator.comparing(Person::lastName)
    .thenComparing(Person::age, Comparator.reverseOrder()));</code></pre>`,
      tip: 'Never compare with a - b; it can overflow. Use Integer.compare(a, b).',
    },
    {
      title: 'Iterators & Fail-Fast',
      level: 'intermediate',
      summary:
        'Changing a collection while looping over it usually throws ConcurrentModificationException.',
      simple:
        'Like counting people in a room while others walk in and out. Java stops you rather than give a wrong count.',
      points: [
        'Most collections keep a change counter; the iterator checks it on each step.',
        'Removing inside a for-each loop throws <code>ConcurrentModificationException</code>.',
        'Safe ways: <code>iterator.remove()</code> or <code>list.removeIf(...)</code>.',
        'It happens in a single thread too; it is not only a concurrency thing.',
        'Concurrent collections (e.g. <code>CopyOnWriteArrayList</code>) use fail-safe iterators instead.',
      ],
      detail: `<pre><code>for (String s : list) {
  if (s.isBlank()) list.remove(s); // throws CME
}
list.removeIf(String::isBlank);   // correct</code></pre>`,
    },
    {
      title: 'Immutable Collections',
      level: 'intermediate',
      summary:
        'Collections that cannot be changed after creation, made with List.of, copyOf or unmodifiable views.',
      simple: 'A laminated menu: everyone can read it, nobody can scribble on it.',
      points: [
        '<code>List.of</code>, <code>Set.of</code>, <code>Map.of</code> (Java 9+): truly immutable, no nulls allowed.',
        '<code>List.copyOf(x)</code>: immutable snapshot of another collection.',
        '<code>Collections.unmodifiableList(x)</code>: read-only view; changes to <code>x</code> still show through.',
        'Stream <code>.toList()</code> (Java 16+) also returns an unmodifiable list.',
        'Changing them throws <code>UnsupportedOperationException</code>.',
      ],
      tip: 'Return List.copyOf from getters to stop callers from changing your internal state.',
    },
    {
      title: 'Choosing a Collection',
      level: 'intermediate',
      summary: 'A quick guide to pick the right structure for the job.',
      simple: 'Ask yourself: do I need order, uniqueness, key lookup, or "next in line"?',
      points: [
        'Ordered list with index access → <code>ArrayList</code>.',
        'Unique items, fast lookup → <code>HashSet</code>; sorted → <code>TreeSet</code>.',
        'Key lookup → <code>HashMap</code>; keep order → <code>LinkedHashMap</code>; sorted keys → <code>TreeMap</code>.',
        'Stack or queue → <code>ArrayDeque</code>; by priority → <code>PriorityQueue</code>.',
        'Shared between threads → <code>ConcurrentHashMap</code> and friends (see Concurrency).',
      ],
    },
    {
      title: 'Generics',
      level: 'intermediate',
      summary:
        'Type parameters that let one class or method work with many types, safely checked by the compiler.',
      simple:
        'A labeled jar: "Cookies only". The compiler checks you only put cookies in and only get cookies out, no casting.',
      points: [
        'Catches type errors at compile time instead of runtime.',
        'Removes casts: <code>String s = list.get(0);</code>.',
        'Diamond <code>&lt;&gt;</code> lets the compiler infer the type.',
      ],
      children: [
        {
          title: 'Type Parameters',
          level: 'intermediate',
          summary: 'Placeholders like T, K, V that you fill in when you use a class or method.',
          simple: 'Like a blank on a form: "Box of ___". You fill it in when you make the box.',
          points: [
            'Generic class: <code>class Box&lt;T&gt;</code>.',
            'Generic method: <code>static &lt;T&gt; T first(List&lt;T&gt; list)</code>.',
            'Common names: T (type), E (element), K/V (key/value), R (result).',
            'Only reference types: <code>List&lt;Integer&gt;</code>, not <code>List&lt;int&gt;</code>.',
          ],
          detail: `<pre><code>class Box&lt;T&gt; {
  private final T value;
  Box(T value) { this.value = value; }
  T get() { return value; }
}
Box&lt;String&gt; b = new Box&lt;&gt;("hi");</code></pre>`,
        },
        {
          title: 'Bounded Types',
          level: 'advanced',
          summary: 'Limit a type parameter to a family of types with extends.',
          points: [
            '<code>&lt;T extends Number&gt;</code>: T must be Number or a subclass.',
            'Lets you call the bound methods, like <code>doubleValue()</code>.',
            'Multiple bounds: <code>&lt;T extends Number &amp; Comparable&lt;T&gt;&gt;</code>.',
          ],
          detail: `<pre><code>static &lt;T extends Comparable&lt;T&gt;&gt; T max(List&lt;T&gt; list) {
  T best = list.get(0);
  for (T x : list) if (x.compareTo(best) &gt; 0) best = x;
  return best;
}</code></pre>`,
        },
        {
          title: 'Wildcards & PECS',
          level: 'advanced',
          summary: 'Use ? extends to read from a collection, ? super to write into it.',
          points: [
            '<code>List&lt;Integer&gt;</code> is NOT a <code>List&lt;Number&gt;</code>, even though Integer is a Number.',
            '<code>? extends T</code>: you can read T out, but cannot add (producer).',
            '<code>? super T</code>: you can add T in, reads give Object (consumer).',
            'PECS: Producer Extends, Consumer Super.',
          ],
          detail: `<pre><code>static &lt;T&gt; void copy(List&lt;? extends T&gt; src, List&lt;? super T&gt; dst) {
  for (T x : src) dst.add(x);
}
double sum(List&lt;? extends Number&gt; nums) { ... }</code></pre>`,
          tip: 'Collections.copy and Collections.max use exactly these signatures; a good example for interviews.',
        },
        {
          title: 'Type Erasure',
          level: 'expert',
          summary:
            'Generic types exist only at compile time; at runtime List<String> is just List.',
          points: [
            'The compiler checks types, then removes them and adds casts.',
            'You cannot do <code>new T()</code>, <code>new T[]</code> or <code>instanceof List&lt;String&gt;</code>.',
            'Two overloads differing only by generic type will clash.',
            'Workaround: pass a <code>Class&lt;T&gt;</code> token when you need the type at runtime.',
            'Raw types (<code>List</code> without &lt;&gt;) skip checks; avoid them.',
          ],
          tip: 'Erasure is why Jackson needs a TypeReference to read a List<User> from JSON.',
        },
      ],
    },
  ],
};
