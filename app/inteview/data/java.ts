// Interview data: java
// Auto-generated from pv.html
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    questions: [
      // --- OOP ---
      {
        q: 'What are the four pillars of OOP in Java?',
        difficulty: 'easy',
        a: `<ul>
<li><strong>Encapsulation</strong> – bundling data + methods; using access modifiers (<code>private</code>, <code>protected</code>, <code>public</code>, package-private). Achieve via getters/setters, immutable objects.</li>
<li><strong>Abstraction</strong> – hiding complexity via abstract classes / interfaces. Only expose "what" not "how".</li>
<li><strong>Inheritance</strong> – reusing code through <code>extends</code> / <code>implements</code>. Java supports single class inheritance, multiple interface inheritance.</li>
<li><strong>Polymorphism</strong> – method overloading (compile-time / static) &amp; overriding (runtime / dynamic dispatch via vtable).</li>
</ul>
<p><strong>Senior-level depth:</strong></p>
<ul>
<li><strong>Composition over inheritance</strong> – prefer HAS-A over IS-A. Inheritance breaks encapsulation (Effective Java Item 18).</li>
<li><strong>Liskov Substitution</strong> – subtype must be substitutable without breaking program correctness.</li>
<li><strong>Access modifiers scope</strong>: <code>private</code> → class only; package-private (default) → same package; <code>protected</code> → same package + subclasses; <code>public</code> → everywhere.</li>
</ul>
<div class="key-point">Trick: "Is Java 100% OOP?" — No. Primitives (int, boolean) are not objects. But with autoboxing and wrapper classes, Java approaches it. Also, static methods/fields belong to the class, not instances.</div>`,
      },
      {
        q: 'Explain the difference between Abstract class and Interface (Java 8+).',
        difficulty: 'medium',
        a: `<ul>
<li><strong>Abstract class</strong>: can have constructors, instance fields, any access modifier. A class can extend only one.</li>
<li><strong>Interface</strong>: all fields are <code>public static final</code>. Since Java 8 can have <code>default</code> and <code>static</code> methods. A class can implement many.</li>
<li><strong>When to use</strong>: interface for capability contracts ("can do"), abstract class for shared state ("is a").</li>
</ul>
<pre>// Interface: capability, no state
public interface Payable {
    BigDecimal calculatePay();                       // abstract
    default String currency() { return "USD"; }      // Java 8+: default impl
    static Payable of(BigDecimal fixed) {            // Java 8+: static
        return () -> fixed;
    }
}

// Abstract class: shared state + partial implementation
public abstract class Employee implements Payable {
    protected final String name;                     // state — interface can't do this
    protected Employee(String name) { this.name = name; }  // constructor
    public abstract BigDecimal calculatePay();       // subclass must define
    public String describe() { return name + " earns " + calculatePay(); }
}</pre>
<div class="key-point">Trick: From Java 9, interfaces can have <code>private</code> methods to share code between default methods.</div>`,
      },
      {
        q: 'What is the difference between == and .equals() in Java?',
        difficulty: 'tricky',
        a: `<ul>
<li><code>==</code> compares <strong>references</strong> (memory addresses) for objects, and <strong>values</strong> for primitives.</li>
<li><code>.equals()</code> compares <strong>logical equality</strong> (content). Must be overridden in custom classes.</li>
</ul>
<pre>String a = new String("hello");
String b = new String("hello");
a == b       // false (different objects)
a.equals(b)  // true  (same content)</pre>
<p><strong>The equals() contract (must satisfy all):</strong></p>
<ul>
<li><strong>Reflexive</strong>: x.equals(x) == true</li>
<li><strong>Symmetric</strong>: x.equals(y) == y.equals(x)</li>
<li><strong>Transitive</strong>: if x.equals(y) && y.equals(z) → x.equals(z)</li>
<li><strong>Consistent</strong>: same result on multiple calls (if objects unchanged)</li>
<li><strong>Null</strong>: x.equals(null) == false</li>
</ul>
<pre>// hashCode contract: if a.equals(b) then a.hashCode() == b.hashCode()
// MUST override hashCode() when overriding equals()!
// Violating this breaks HashMap, HashSet, etc.

// Integer caching trick:
Integer x = 127;
Integer y = 127;
x == y  // TRUE — Integer cache [-128, 127]

Integer x = 128;
Integer y = 128;
x == y  // FALSE — outside cache, different objects!</pre>
<div class="key-point">Trick: String literals from the pool <code>"hello" == "hello"</code> returns <strong>true</strong> because they share the same reference in the String pool. Also: <code>Integer.valueOf(127) == Integer.valueOf(127)</code> is true (cache), but <code>Integer.valueOf(128) == Integer.valueOf(128)</code> is false. Always use .equals() for wrapper types!</div>`,
      },
      {
        q: 'What is the difference between String, StringBuilder, and StringBuffer?',
        difficulty: 'medium',
        a: `<ul>
<li><strong>String</strong>: immutable. Every modification creates a new object.</li>
<li><strong>StringBuilder</strong>: mutable, <strong>not thread-safe</strong>, faster.</li>
<li><strong>StringBuffer</strong>: mutable, <strong>thread-safe</strong> (synchronized), slower.</li>
</ul>
<pre>// ❌ O(n²): each += copies the whole string so far
String csv = "";
for (String row : rows) csv += row + ",";     // 10k rows → ~100M char copies

// ✅ O(n): appends into an internal resizable buffer
StringBuilder sb = new StringBuilder();
for (String row : rows) sb.append(row).append(',');
String csv = sb.toString();

// OK: single-expression concat — compiler optimizes this itself
String msg = "user=" + id + " status=" + status;   // no loop → fine</pre>
<div class="key-point">Use <code>StringBuilder</code> for loops. Single-line <code>+</code> concatenation is already compiled to StringBuilder (Java 9+: invokedynamic) — only concatenation <em>inside loops</em> is the real problem.</div>`,
      },
      {
        q: 'Explain Java Memory Model: Stack vs Heap and JMM happens-before.',
        difficulty: 'hard',
        a: `<ul>
<li><strong>Stack</strong>: stores method frames, local variables, references. Each thread has its own stack. LIFO. Default size ~512KB-1MB (<code>-Xss</code>).</li>
<li><strong>Heap</strong>: stores objects and class-level variables. Shared across all threads. Managed by GC.</li>
<li><strong>Metaspace</strong> (Java 8+): replaces PermGen; stores class metadata, loaded by classloaders. Grows dynamically (limit with <code>-XX:MaxMetaspaceSize</code>).</li>
<li>For object type inside the method: the reference variable is stored in the stack, the actual object/data is stored in the heap.</li>
</ul>
<pre>int x = 10;            // x on stack
String s = new String("hi"); // reference s on stack, object on heap</pre>
<p><strong>Heap structure (Generational GC):</strong></p>
<pre>Heap:
├── Young Generation (short-lived objects)
│   ├── Eden Space (new objects created here)
│   ├── Survivor 0 (S0)
│   └── Survivor 1 (S1)
└── Old Generation / Tenured (long-lived objects)
    └── Objects promoted after surviving N minor GCs

Minor GC: cleans Young Gen (fast, stop-the-world but brief)
Major/Full GC: cleans Old Gen (slow, longer pause)</pre>
<p><strong>JMM Happens-Before Rules (critical for concurrency):</strong></p>
<ul>
<li><strong>Program order</strong>: each action happens-before the next action in the same thread.</li>
<li><strong>Monitor lock</strong>: unlock happens-before subsequent lock of same monitor.</li>
<li><strong>Volatile</strong>: write to volatile happens-before subsequent read of same variable.</li>
<li><strong>Thread start</strong>: <code>thread.start()</code> happens-before any action in the started thread.</li>
<li><strong>Thread join</strong>: all actions in a thread happen-before <code>join()</code> returns.</li>
<li><strong>Transitivity</strong>: if A happens-before B, and B happens-before C, then A happens-before C.</li>
</ul>
<pre>// Without happens-before guarantee:
Thread A: x = 1; ready = true;
Thread B: if (ready) print(x);  // might print 0! (reordering)

// Fix with volatile:
private volatile boolean ready;
// Now: write to ready happens-before read of ready → x=1 is visible</pre>
<div class="key-point">OutOfMemoryError: heap space → increase <code>-Xmx</code>. StackOverflowError → deep recursion. OutOfMemoryError: Metaspace → too many classes loaded (common in hot-deploy scenarios). Trick: "What are GC roots?" — local variables, active threads, static fields, JNI references. Objects reachable from GC roots are alive.</div>`,
      },
      {
        q: 'What are the different types of Garbage Collectors in Java?',
        difficulty: 'hard',
        a: `<ul>
<li><strong>Serial GC</strong> (<code>-XX:+UseSerialGC</code>) – single thread, stop-the-world. Good for small apps / containers with 1 CPU.</li>
<li><strong>Parallel GC</strong> (<code>-XX:+UseParallelGC</code>) – multiple GC threads. Default in Java 8. Optimizes throughput.</li>
<li><strong>G1 GC</strong> (<code>-XX:+UseG1GC</code>) – divides heap into regions (~2048). Default since Java 9. Low-latency for large heaps (4GB+). Targets pause time goals (<code>-XX:MaxGCPauseMillis=200</code>).</li>
<li><strong>ZGC</strong> (<code>-XX:+UseZGC</code>) – ultra-low pause times (&lt;1ms). Concurrent. Java 15+ production-ready. Handles multi-TB heaps.</li>
<li><strong>Shenandoah</strong> (<code>-XX:+UseShenandoahGC</code>) – similar to ZGC, by Red Hat. Java 12+.</li>
</ul>
<p><strong>GC process (Mark-Sweep-Compact):</strong></p>
<pre>1. MARK: Starting from GC roots, traverse object graph, mark reachable objects.
   GC Roots: local vars, active threads, static fields, JNI references.
2. SWEEP: Reclaim memory of unmarked (unreachable) objects.
3. COMPACT: Move surviving objects together to avoid fragmentation.

Generational Hypothesis: Most objects die young.
→ Young Gen (Eden + 2 Survivor) collected frequently (Minor GC)
→ Old Gen collected rarely (Major GC / Full GC)
→ Objects promoted to Old Gen after surviving ~15 minor GCs (-XX:MaxTenuringThreshold)</pre>
<p><strong>G1 GC details (most commonly asked):</strong></p>
<ul>
<li>Divides heap into equal-sized regions (Eden, Survivor, Old, Humongous).</li>
<li><strong>Humongous objects</strong>: objects &gt; 50% of region size go directly to special regions.</li>
<li>Collects regions with most garbage first ("Garbage First").</li>
<li>Mixed GC: collects Young + some Old regions together.</li>
</ul>
<div class="key-point">Trick: "Which GC does your production use?" — know your <code>-XX:+UseG1GC</code> or <code>-XX:+UseZGC</code> flags. "How do you tune GC?" — Set heap size (-Xms/-Xmx same to avoid resizing), set pause time goal, enable GC logging (<code>-Xlog:gc*</code>), analyze with GCViewer/GCEasy. "When does Full GC happen?" — Old Gen full, Metaspace full, explicit System.gc(), humongous allocation failure.</div>`,
      },
      {
        q: 'Explain HashMap internal working. What happens on collision?',
        difficulty: 'hard',
        a: `<ol>
<li><code>hashCode()</code> is further hashed: <code>hash = h ^ (h >>> 16)</code> (spread high bits) → bucket index via <code>(n-1) & hash</code>.</li>
<li>If bucket empty → new Node(hash, key, value, null).</li>
<li>If collision → stored as <strong>linked list</strong> (chaining) at that bucket.</li>
<li>Java 8+: when list length &gt; <strong>TREEIFY_THRESHOLD (8)</strong> AND table capacity ≥ <strong>MIN_TREEIFY_CAPACITY (64)</strong> → converts to <strong>red-black tree</strong> (O(log n) lookup).</li>
<li>Tree converts BACK to linked list when size drops below <strong>UNTREEIFY_THRESHOLD (6)</strong> (on resize).</li>
<li>Load factor 0.75 → resize (double capacity) when <code>size > capacity * loadFactor</code>.</li>
</ol>
<pre>// Initial capacity should be: expectedSize / 0.75 + 1
// To avoid resizing: new HashMap<>(expectedSize * 4 / 3 + 1)
// Or: HashMap.newHashMap(expectedSize) in Java 19+

// Key contract for HashMap:
// 1. If a.equals(b), then a.hashCode() == b.hashCode() (MUST)
// 2. If hashCodes are equal, objects may or may NOT be equal
// 3. Keys should be IMMUTABLE (or at least hashCode fields shouldn't change)
//    Mutable key → lost entry! Can't find it anymore after mutation.</pre>
<p><strong>Why capacity is always power of 2?</strong></p>
<pre>// (n-1) & hash is equivalent to hash % n — but faster (bitwise)
// Only works when n is power of 2!
// e.g., n=16: (15) & hash = hash % 16
// Binary: 15 = 0000 1111 → masks lower 4 bits</pre>
<div class="key-point">Trick questions: (1) "What if two keys have same hashCode AND equals?" → Second put() overwrites the first value. (2) "What if key is mutable and you change it after put()?" → The entry becomes unreachable (ghost entry / memory leak). (3) "Is HashMap.get() always O(1)?" → No, worst case O(log n) with tree, or O(n) in Java 7 (no tree). (4) "What happens if hashCode() always returns same value?" → All entries in one bucket → degrades to linked list/tree.</div>`,
      },
      {
        q: 'What is the difference between HashMap, LinkedHashMap, TreeMap, and ConcurrentHashMap?',
        difficulty: 'medium',
        a: `<p>All four implement <code>Map</code> but differ in <strong>ordering</strong>, <strong>performance</strong>, and <strong>thread-safety</strong>.</p>
<ul>
<li><strong>HashMap</strong> — a hash table. O(1) average get/put, <strong>no ordering</strong> guarantee (iteration order may change on resize). Allows <strong>one null key</strong> and multiple null values. Not thread-safe. The default choice.</li>
<li><strong>LinkedHashMap</strong> — HashMap plus a doubly-linked list threaded through the entries, so it preserves <strong>insertion order</strong> (or <strong>access order</strong> when built with <code>accessOrder=true</code>). Slightly more memory. The natural base for an <strong>LRU cache</strong>.</li>
<li><strong>TreeMap</strong> — a red-black tree. Keys are kept <strong>sorted</strong> (natural order, or a supplied <code>Comparator</code>). O(log n) get/put, no null keys. Implements <code>NavigableMap</code> → range and nearest-key queries.</li>
<li><strong>ConcurrentHashMap</strong> — a thread-safe HashMap for concurrent access. <strong>No null keys or values.</strong> Uses CAS + per-bucket <code>synchronized</code> (Java 8+) so threads writing different buckets proceed in parallel — far faster than <code>Collections.synchronizedMap</code> or <code>Hashtable</code>, which lock the whole map.</li>
</ul>
<table>
<tr><th>Feature</th><th>HashMap</th><th>LinkedHashMap</th><th>TreeMap</th><th>ConcurrentHashMap</th></tr>
<tr><td>Ordering</td><td>None</td><td>Insertion/access</td><td>Sorted by key</td><td>None</td></tr>
<tr><td>get/put</td><td>O(1)</td><td>O(1)</td><td>O(log n)</td><td>O(1)</td></tr>
<tr><td>Null key</td><td>1 allowed</td><td>1 allowed</td><td>Not allowed</td><td>Not allowed</td></tr>
<tr><td>Thread-safe</td><td>No</td><td>No</td><td>No</td><td>Yes</td></tr>
</table>
<pre>// TreeMap navigation — the reason to pick it over HashMap:
TreeMap&lt;Integer, String&gt; tm = new TreeMap&lt;&gt;();
tm.firstKey(); tm.lastKey();
tm.floorKey(50);      // greatest key &lt;= 50
tm.ceilingKey(50);    // smallest key &gt;= 50
tm.headMap(50);       // all entries with key &lt; 50

// LinkedHashMap as an LRU cache (access-order + removeEldestEntry):
new LinkedHashMap&lt;K,V&gt;(16, 0.75f, true) {
    protected boolean removeEldestEntry(Map.Entry&lt;K,V&gt; e) { return size() &gt; MAX; }
};</pre>
<div class="key-point">How to choose: default to <strong>HashMap</strong>; need predictable iteration order → <strong>LinkedHashMap</strong>; need sorted keys or range queries → <strong>TreeMap</strong>; shared across threads → <strong>ConcurrentHashMap</strong>. Trick: TreeMap decides key equality with <code>compareTo</code>/<code>Comparator</code>, <strong>not</strong> <code>equals</code> — if your comparator returns 0 for two keys, TreeMap treats them as the same key even when <code>equals()</code> disagrees.</div>`,
      },
      {
        q: 'Explain Java Streams. What is the difference between intermediate and terminal operations?',
        difficulty: 'medium',
        a: `<p>A stream pipeline has three parts: a <strong>source</strong> (collection, array, generator) → zero or more <strong>intermediate</strong> operations → exactly one <strong>terminal</strong> operation.</p>
<ul>
<li><strong>Intermediate</strong> — return a new <code>Stream</code> (so they chain) and are <strong>lazy</strong>: they don't run until a terminal op is attached. Examples: <code>filter()</code>, <code>map()</code>, <code>flatMap()</code>, <code>sorted()</code>, <code>distinct()</code>, <code>limit()</code>, <code>peek()</code>.</li>
<li><strong>Terminal</strong> — produce a result or side effect and <strong>trigger execution</strong> of the whole pipeline. Afterwards the stream is consumed and cannot be reused. Examples: <code>collect()</code>, <code>reduce()</code>, <code>forEach()</code>, <code>count()</code>, <code>findFirst()</code>, <code>anyMatch()</code>, <code>toList()</code>.</li>
</ul>
<pre>List&lt;String&gt; names = employees.stream()
    .filter(e -> e.getSalary() > 50000)   // intermediate (lazy)
    .map(Employee::getName)               // intermediate (lazy)
    .sorted()                             // intermediate (stateful)
    .collect(Collectors.toList());        // terminal → NOW everything runs</pre>
<p><strong>Two consequences of laziness:</strong></p>
<ul>
<li><strong>Fusion</strong> — elements flow through the entire chain one at a time, not stage by stage. The <code>filter</code>+<code>map</code> above are a single pass over the data, not two.</li>
<li><strong>Short-circuiting</strong> — <code>findFirst()</code>, <code>anyMatch()</code>, <code>limit()</code> can stop early without touching the whole source (they even work on infinite streams).</li>
</ul>
<pre>// Short-circuit: processes only until the first match
Stream.iterate(1, n -> n + 1)      // infinite stream
      .filter(n -> n % 7 == 0)
      .findFirst();                 // 7 — stops immediately

// Stateless vs stateful intermediate ops:
// stateless: filter, map     (each element handled independently)
// stateful:  sorted, distinct, limit  (need other/all elements first)</pre>
<div class="key-point">Trick: "What if a stream has no terminal operation?" — Nothing runs; the intermediate ops never execute. "Can you reuse a stream?" — No. After a terminal op, any further operation throws <code>IllegalStateException: stream has already been operated upon or closed</code> — build a fresh stream from the source.</div>`,
      },
      {
        q: 'What is Optional in Java? Why use it?',
        difficulty: 'medium',
        a: `<p><code>Optional&lt;T&gt;</code> is a container that holds either a non-null value or nothing. Its purpose is to make "a value might be absent" <strong>explicit in the type signature</strong>, forcing callers to handle the empty case instead of being surprised by a <code>NullPointerException</code>.</p>
<pre>// Creating:
Optional.of(value)          // value MUST be non-null, else NPE
Optional.ofNullable(value)  // null → becomes an empty Optional
Optional.empty()            // explicitly empty

// Consuming — prefer these over isPresent()/get():
opt.orElse(defaultValue)              // the value, or a default
opt.orElseGet(() -> expensiveDefault) // default computed lazily (only if empty)
opt.orElseThrow(() -> new NotFoundException())  // the value, or throw
opt.ifPresent(v -> process(v))        // run only if present
opt.map(String::toUpperCase)          // transform if present, stays empty otherwise
opt.filter(v -> v.length() > 3)       // keep the value only if it matches
opt.flatMap(this::lookup)             // chain another Optional-returning call</pre>
<pre>// Real example — a null-safe pipeline with no explicit null checks:
String city = Optional.ofNullable(user)
    .map(User::getAddress)
    .map(Address::getCity)
    .map(String::toUpperCase)
    .orElse("UNKNOWN");
// user, address, or city null anywhere → "UNKNOWN". Never an NPE.</pre>
<p><strong>Anti-patterns (frequently probed in interviews):</strong></p>
<ul>
<li><strong>Don't</strong> call <code>opt.get()</code> unguarded — it throws <code>NoSuchElementException</code>, no better than an NPE. Use an <code>orElse*</code> / <code>ifPresent</code> method.</li>
<li><strong>Don't</strong> write <code>if (opt.isPresent()) return opt.get();</code> — that's just a null check with more ceremony. Use <code>orElse</code>/<code>map</code>.</li>
<li><strong>Prefer <code>orElseGet</code> over <code>orElse</code></strong> when the default is costly: <code>orElse(buildDefault())</code> ALWAYS evaluates <code>buildDefault()</code>, even when the value is present; <code>orElseGet</code> only calls the supplier when empty.</li>
</ul>
<div class="key-point">Design rule: use <code>Optional</code> only as a <strong>method return type</strong> (e.g. <code>Optional&lt;User&gt; findById(id)</code>). Do NOT use it for fields, method parameters, or collection elements — it adds an allocation, isn't <code>Serializable</code>, and an empty collection already means "nothing". Trick: an <code>Optional</code> reference can itself be <code>null</code>, so never <code>return null</code> from a method declared to return <code>Optional</code> — return <code>Optional.empty()</code>.</div>`,
      },
      {
        q: 'Explain the volatile keyword in Java.',
        difficulty: 'hard',
        a: `<ul>
<li><code>volatile</code> ensures a variable is <strong>read from and written to main memory</strong>, not CPU cache.</li>
<li>Guarantees <strong>visibility</strong> across threads but NOT atomicity.</li>
<li>Prevents <strong>instruction reordering</strong> (acts as a memory barrier/fence).</li>
<li>Establishes <strong>happens-before</strong>: write to volatile happens-before subsequent read of same variable.</li>
</ul>
<pre>private volatile boolean running = true;
// Thread A: running = false;
// Thread B: while(running) { ... } // sees update immediately

// Double-checked locking (Singleton) — volatile is REQUIRED:
private static volatile Singleton instance;
public static Singleton getInstance() {
    if (instance == null) {                // 1st check (no lock)
        synchronized (Singleton.class) {
            if (instance == null) {         // 2nd check (with lock)
                instance = new Singleton(); // Without volatile, partially
            }                              // constructed object may be visible!
        }
    }
    return instance;
}</pre>
<p><strong>Why volatile is needed for double-checked locking:</strong></p>
<pre>// instance = new Singleton() is actually 3 steps:
// 1. Allocate memory
// 2. Initialize object (call constructor)
// 3. Assign reference to instance
// Without volatile, JVM may reorder to: 1 → 3 → 2
// Another thread sees non-null instance but object is NOT fully constructed!</pre>
<p><strong>Volatile vs synchronized vs Atomic:</strong></p>
<ul>
<li><code>volatile</code>: visibility only. No atomicity. No mutual exclusion.</li>
<li><code>synchronized</code>: visibility + atomicity + mutual exclusion. Heavier.</li>
<li><code>AtomicXxx</code>: visibility + atomicity via CAS. No mutual exclusion. Lock-free.</li>
</ul>
<div class="key-point">Trick: <code>volatile</code> is NOT enough for <code>i++</code> because increment is read-modify-write (3 steps). Use <code>AtomicInteger</code> instead. "When to use volatile?" — Single writer, multiple readers. Status flags. Double-checked locking. "Does volatile prevent reordering of ALL instructions?" — No, only prevents reordering of reads/writes ACROSS the volatile access (LoadLoad, StoreStore barriers).</div>`,
      },
      {
        q: 'What are the differences between synchronized, ReentrantLock, and ReadWriteLock?',
        difficulty: 'hard',
        a: `<p>All three provide mutual exclusion; they differ in how much control and flexibility you get.</p>
<ul>
<li><strong><code>synchronized</code></strong> — the built-in intrinsic lock (a keyword). Acquired on entering a block/method and <strong>released automatically</strong> on exit, even if an exception is thrown. Simple and leak-proof, but: no timeout, can't be interrupted while waiting, always unfair, and there's no "try and give up".</li>
<li><strong><code>ReentrantLock</code></strong> — an explicit <code>Lock</code> object. You call <code>lock()</code>/<code>unlock()</code> yourself (always in <code>try/finally</code>). Adds <code>tryLock()</code>, <code>tryLock(timeout)</code>, <code>lockInterruptibly()</code>, optional <strong>fairness</strong>, and multiple condition variables. "Reentrant" = the same thread may acquire it repeatedly (just like <code>synchronized</code>).</li>
<li><strong><code>ReadWriteLock</code></strong> — a pair of locks: <strong>many</strong> threads can hold the read lock at once, but the write lock is <strong>exclusive</strong>. Ideal for data that's read often and written rarely (caches, config).</li>
</ul>
<pre>// synchronized — auto-release, nothing to remember
public synchronized void increment() { count++; }
synchronized (lockObject) { /* critical section */ }

// ReentrantLock — MUST unlock in finally, or the lock leaks forever
private final ReentrantLock lock = new ReentrantLock();
lock.lock();
try {
    // critical section
} finally {
    lock.unlock();          // ⚠️ always in finally
}

// tryLock — never block forever (a deadlock-avoidance tactic):
if (lock.tryLock(1, TimeUnit.SECONDS)) {
    try { /* work */ } finally { lock.unlock(); }
} else {
    // couldn't acquire in time — back off / retry
}

// ReadWriteLock — concurrent reads, exclusive writes:
ReadWriteLock rw = new ReentrantReadWriteLock();
rw.readLock().lock();   try { return cache.get(key); } finally { rw.readLock().unlock(); }
rw.writeLock().lock();  try { cache.put(key, val);   } finally { rw.writeLock().unlock(); }</pre>
<div class="key-point">Default to <code>synchronized</code> — it's simpler and can't leak. Reach for <code>ReentrantLock</code> only when you need something it lacks: timeout, interruptible waiting, fairness, or condition variables (<code>lock.newCondition()</code>). Use <code>ReadWriteLock</code> for read-heavy caches — but if writes are frequent the reader/writer bookkeeping can be slower than plain <code>synchronized</code>. Trick: for read-mostly data, <code>StampedLock</code> (Java 8) with optimistic reads outperforms <code>ReadWriteLock</code>.</div>`,
      },
      {
        q: 'What is the difference between CompletableFuture and Future?',
        difficulty: 'hard',
        a: `<ul>
<li><strong>Future</strong>: blocking <code>get()</code>, no chaining, no combining, no exception handling callbacks.</li>
<li><strong>CompletableFuture</strong>: non-blocking, supports chaining (<code>thenApply</code>, <code>thenCompose</code>), combining (<code>allOf</code>, <code>anyOf</code>), exception handling (<code>exceptionally</code>, <code>handle</code>).</li>
</ul>
<pre>CompletableFuture.supplyAsync(() -> fetchUser(id))   // runs in ForkJoinPool.commonPool()
    .thenApply(user -> user.getEmail())              // same thread or caller thread
    .thenAccept(email -> sendEmail(email))
    .exceptionally(ex -> { log.error(ex); return null; });</pre>
<p><strong>Key methods and their differences:</strong></p>
<pre>// thenApply vs thenCompose (like map vs flatMap)
cf.thenApply(s -> s.length())         // Function&lt;T, R&gt; → CompletableFuture&lt;R&gt;
cf.thenCompose(s -> fetchAsync(s))    // Function&lt;T, CompletableFuture&lt;R&gt;&gt; → avoids nesting

// thenApply vs thenApplyAsync
cf.thenApply(fn)      // runs in same thread that completed cf (or caller)
cf.thenApplyAsync(fn) // runs in ForkJoinPool.commonPool()
cf.thenApplyAsync(fn, myExecutor) // runs in custom executor

// Combining multiple futures:
CompletableFuture&lt;Void&gt; all = CompletableFuture.allOf(cf1, cf2, cf3);
CompletableFuture&lt;Object&gt; any = CompletableFuture.anyOf(cf1, cf2, cf3);

// Exception handling:
cf.exceptionally(ex -> defaultValue)              // recover from exception
cf.handle((result, ex) -> ex != null ? fallback : result) // handle both cases
cf.whenComplete((result, ex) -> log(result, ex))  // side-effect, doesn't transform</pre>
<p><strong>Thread pool considerations:</strong></p>
<ul>
<li><code>supplyAsync()</code> / <code>runAsync()</code> without executor uses <strong>ForkJoinPool.commonPool()</strong> (shared globally!).</li>
<li>For I/O-heavy work: always pass a custom executor to avoid starving the common pool.</li>
<li><code>thenApply</code> (non-async) may execute in the completing thread OR the calling thread — non-deterministic!</li>
</ul>
<div class="key-point">Trick: "What happens if you never call get() or join()?" — The computation still runs (fire-and-forget). But exceptions are silently swallowed! Always attach an exception handler. Also: <code>join()</code> throws unchecked <code>CompletionException</code> vs <code>get()</code> throws checked <code>ExecutionException</code>.</div>`,
      },
      {
        q: 'Explain SOLID principles with Java examples.',
        difficulty: 'hard',
        a: `<ul>
<li><strong>S</strong> – Single Responsibility: one class = one reason to change.</li>
<li><strong>O</strong> – Open/Closed: open for extension, closed for modification (use interfaces/abstract).</li>
<li><strong>L</strong> – Liskov Substitution: Objects of a subclass should be replaceable with objects of the superclass without breaking the program.</li>
<li><strong>I</strong> – Interface Segregation: A class should not be forced to implement methods it does not use.</li>
<li><strong>D</strong> – Dependency Inversion: depend on abstractions, High-level modules should not depend directly on low-level modules.</li>
</ul>
<pre>// S — split responsibilities: ❌ ReportService{build,format,email,save}
class ReportBuilder { Report build(Data d) {...} }
class ReportMailer  { void send(Report r)  {...} }

// O — add behavior without editing existing code:
interface PaymentStrategy { void pay(Order o); }
class CardPayment implements PaymentStrategy {...}
class MomoPayment implements PaymentStrategy {...}   // NEW method = NEW class only

// L — subtype must honor the parent's contract:
// ❌ class Square extends Rectangle { setWidth also changes height } → breaks callers
// ✅ model them as separate Shape implementations

// I — small role interfaces instead of one fat one:
// ❌ interface Worker { work(); eat(); sleep(); }  — robots don't eat
interface Workable { void work(); }
interface Feedable { void eat(); }

// D — high-level code depends on the interface; wiring picks the impl:
class OrderService {
    private final PaymentStrategy payment;            // abstraction
    OrderService(PaymentStrategy payment) { this.payment = payment; }  // injected
}</pre>
<div class="key-point">In Spring Boot: <code>@Service</code> depends on <code>Repository</code> interface (D). Each service handles one domain (S). New payment methods extend <code>PaymentStrategy</code> (O).</div>`,
      },
      {
        q: "What happens when you type 'new Object()' in Java? (Object creation lifecycle)",
        difficulty: 'tricky',
        a: `<p>Executing <code>new Object()</code> compiles to two bytecodes — <code>new</code> (allocate) followed by <code>invokespecial</code> (run the constructor) — and triggers several ordered phases:</p>
<ol>
<li><strong>Loading &amp; initialization</strong> — if the class isn't loaded, the ClassLoader loads it, then it's linked (verify → prepare → resolve) and initialized: static blocks and static field assignments run <strong>once</strong>, parent-first.</li>
<li><strong>Heap allocation</strong> — memory for the instance is reserved on the heap.</li>
<li><strong>Zero / default init</strong> — every field is set to its default (<code>0</code>, <code>0.0</code>, <code>false</code>, <code>null</code>) <em>before</em> any of your code runs.</li>
<li><strong>Constructor chaining</strong> — <code>super(...)</code> runs first, all the way up to <code>Object</code>, so the parent is fully built before the child.</li>
<li><strong>Instance initializers &amp; field assignments</strong> — instance-initializer blocks and inline field initializers run in <strong>source order</strong>, right after <code>super()</code> returns.</li>
<li><strong>Constructor body</strong> — the rest of the constructor executes.</li>
<li><strong>Reference returned</strong> — the reference to the finished object is handed back to the caller (held in a local variable on the stack).</li>
</ol>
<pre>class Parent {
    Parent() { System.out.println("2. Parent ctor"); }
}
class Child extends Parent {
    private int x = initX();                         // runs AFTER super()
    { System.out.println("3b. Child instance block"); }
    Child() {
        // super() called implicitly here → prints "2"
        System.out.println("4. Child ctor body");
    }
    private int initX() { System.out.println("3a. field init"); return 10; }
}
// new Child() prints: 2 → 3a → 3b (initializers in source order) → 4</pre>
<div class="key-point">Two senior traps: (1) fields hold their defaults (<code>0</code>/<code>null</code>) <em>before</em> initializers run, so a constructor that calls an <strong>overridable method</strong> sees the subclass's fields still unset — never call overridable methods from a constructor (Effective Java Item 19). (2) Static initialization happens once, lazily, on first active use of the class — not per object.</div>`,
      },
      {
        q: 'What is the difference between Checked and Unchecked Exceptions?',
        difficulty: 'easy',
        a: `<ul>
<li><strong>Checked</strong> (compile-time): must be caught or declared. <code>IOException</code>, <code>SQLException</code>. Extends <code>Exception</code>.</li>
<li><strong>Unchecked</strong> (runtime): don't need to be declared. <code>NullPointerException</code>, <code>ArrayIndexOutOfBoundsException</code>. Extends <code>RuntimeException</code>.</li>
<li><strong>Error</strong>: serious JVM problems. <code>OutOfMemoryError</code>, <code>StackOverflowError</code>. Should not be caught.</li>
</ul>
<pre>          Throwable
          ├── Error                    (JVM: OOM, StackOverflow — don't catch)
          └── Exception                (checked — must handle or declare)
              ├── IOException, SQLException, ...
              └── RuntimeException     (unchecked)
                  ├── NullPointerException
                  └── IllegalArgumentException, ...

// Checked: compiler forces handling
try (var reader = Files.newBufferedReader(path)) {   // try-with-resources
    return reader.readLine();
} catch (IOException e) {                             // must catch or declare
    throw new UncheckedIOException("Cannot read " + path, e);  // wrap + rethrow
}</pre>
<div class="key-point">Senior stance: checked exceptions don't compose with lambdas/streams and force boilerplate — modern style (Spring, Hibernate) wraps them in unchecked exceptions at module boundaries, keeping the cause chain intact.</div>`,
      },
      {
        q: 'Explain the Java ClassLoader hierarchy and how class loading works.',
        difficulty: 'hard',
        a: `<p>Class loaders bring <code>.class</code> bytecode into the JVM on demand. They form a <strong>parent-child hierarchy</strong> and follow the <strong>parent-delegation model</strong>.</p>
<ol>
<li><strong>Bootstrap ClassLoader</strong> — loads the core JDK classes (<code>java.lang.*</code> etc., from <code>rt.jar</code> / the base module). Written in native code; appears as <code>null</code> from <code>getClassLoader()</code>.</li>
<li><strong>Platform ClassLoader</strong> (called Extension ClassLoader before Java 9) — loads platform/extension modules.</li>
<li><strong>Application (System) ClassLoader</strong> — loads your application's classes from the classpath / module path. This is the default loader for your code.</li>
</ol>
<p><strong>Parent-delegation model</strong> — when asked to load a class, a loader first <strong>delegates upward</strong> to its parent; it only loads the class itself if every ancestor fails to find it.</p>
<pre>ClassLoader.loadClass():
  1. Already loaded? → return the cached Class
  2. Ask the PARENT to load it (recurses up to Bootstrap)
  3. Parent couldn't? → THIS loader tries to find/define it
  4. Still not found? → ClassNotFoundException</pre>
<p>Why delegation matters:</p>
<ul>
<li><strong>Security</strong> — you can't replace <code>java.lang.String</code> with a malicious version; the Bootstrap loader always wins for core classes.</li>
<li><strong>Type identity</strong> — a class's runtime identity is (fully-qualified name + defining ClassLoader). The same class loaded by two different loaders becomes two <strong>incompatible types</strong> → <code>ClassCastException</code> if you mix instances.</li>
</ul>
<pre>// Inspect the hierarchy:
String.class.getClassLoader();               // null (Bootstrap)
MyApp.class.getClassLoader();                // AppClassLoader
MyApp.class.getClassLoader().getParent();    // PlatformClassLoader

// Custom loader — override findClass(), NOT loadClass() (keeps delegation intact):
class MyLoader extends ClassLoader {
    protected Class&lt;?&gt; findClass(String name) {
        byte[] bytes = loadBytes(name);
        return defineClass(name, bytes, 0, bytes.length);
    }
}</pre>
<div class="key-point">Trick: "Can you load two different versions of the same class?" — Yes, using <strong>separate custom ClassLoaders</strong> that don't share a common parent for that class. Tomcat / JEE servers do exactly this to isolate each deployed WAR's libraries. "When is delegation deliberately broken?" — JDBC/JNDI/SPI use the <strong>Thread Context ClassLoader</strong> so a parent-loaded core API can load a child-supplied implementation — the one sanctioned exception to strict delegation.</div>`,
      },
      {
        q: 'What are functional interfaces and lambda expressions?',
        difficulty: 'medium',
        a: `<p>These two features are two halves of the same idea: a <strong>lambda expression</strong> is a concise way to supply the implementation of a <strong>functional interface</strong>. You can't have a lambda without a functional interface as its target type.</p>

<p><strong>1. Functional interface</strong> — an interface with exactly <strong>one abstract method</strong> (SAM = Single Abstract Method). The <code>@FunctionalInterface</code> annotation is optional but recommended: it makes the compiler reject the interface if a second abstract method sneaks in. <code>default</code>, <code>static</code>, and <code>private</code> methods don't count against the "one abstract method" rule.</p>
<pre>@FunctionalInterface
interface Calculator {
    int apply(int a, int b);                 // the single abstract method
    default Calculator memo() { ... }        // allowed — not abstract
}</pre>

<p><strong>2. Lambda expression</strong> — an anonymous function written as <code>(parameters) -> body</code>. It implements the single abstract method of a functional interface; the compiler infers <em>which</em> interface from the target type (the variable, parameter, or return type it's assigned to).</p>
<pre>// Before Java 8: anonymous class — verbose
Calculator add = new Calculator() {
    @Override public int apply(int a, int b) { return a + b; }
};

// Java 8+: lambda — identical behaviour, one line
Calculator add = (a, b) -> a + b;
add.apply(2, 3);   // 5

// Syntax variations:
() -> 42                       // no parameters
x  -> x * 2                    // one parameter, parentheses optional
(x, y) -> x + y                // multiple parameters
(int x, int y) -> x + y        // explicit types (rarely needed)
x -> { log(x); return x * 2; } // block body → needs braces + return</pre>

<p><strong>The standard functional interfaces</strong> (<code>java.util.function</code>) — you rarely write your own:</p>
<ul>
<li><code>Predicate&lt;T&gt;</code> → <code>boolean test(T t)</code> — a condition (used by <code>filter</code>)</li>
<li><code>Function&lt;T,R&gt;</code> → <code>R apply(T t)</code> — transform T into R (used by <code>map</code>)</li>
<li><code>Consumer&lt;T&gt;</code> → <code>void accept(T t)</code> — a side effect, returns nothing</li>
<li><code>Supplier&lt;T&gt;</code> → <code>T get()</code> — produces a value, takes nothing (lazy)</li>
<li><code>UnaryOperator&lt;T&gt;</code> / <code>BinaryOperator&lt;T&gt;</code> / <code>BiFunction&lt;T,U,R&gt;</code> — common variants</li>
</ul>
<pre>Predicate&lt;String&gt; notEmpty = s -> s != null && !s.isEmpty();
Function&lt;String, Integer&gt; len = String::length;
Supplier&lt;List&lt;String&gt;&gt; newList = ArrayList::new;</pre>

<p><strong>Method references</strong> — an even shorter form when the lambda body just calls one existing method:</p>
<pre>Function&lt;String, Integer&gt; len = s -> s.length();   // lambda
Function&lt;String, Integer&gt; len = String::length;    // method reference — same thing

// Four kinds:
String::toUpperCase        // instance method of an arbitrary object of a type
System.out::println        // instance method of a specific object
Integer::parseInt          // static method
ArrayList::new             // constructor reference</pre>

<p><strong>Variable capture</strong> — a lambda may read variables from its enclosing scope, but they must be <strong>effectively final</strong> (assigned exactly once). That's why you can't increment a local counter inside a lambda.</p>
<pre>int factor = 10;                                    // effectively final
Function&lt;Integer,Integer&gt; scale = n -> n * factor;  // ✅ captures factor
// factor = 20;                                     // ❌ breaks capture → compile error</pre>

<div class="key-point">Trick: "Lambda vs anonymous class?" — (1) <code>this</code> inside a lambda refers to the <em>enclosing</em> instance; inside an anonymous class it refers to the anonymous class itself. (2) Lambdas don't introduce a new scope (can't shadow enclosing variables). (3) Lambdas compile to <code>invokedynamic</code> with no extra <code>.class</code> file, whereas an anonymous class generates <code>Outer$1.class</code>. A lambda can implement <strong>only</strong> a functional interface — never an abstract class.</div>`,
      },
      {
        q: 'What is the difference between fail-fast and fail-safe iterators?',
        difficulty: 'tricky',
        a: `<ul>
<li><strong>Fail-fast</strong>: throws <code>ConcurrentModificationException</code> if collection modified during iteration. E.g., <code>ArrayList</code>, <code>HashMap</code> iterators.</li>
<li><strong>Fail-safe</strong>: works on a <strong>clone/snapshot</strong>, doesn't throw. E.g., <code>CopyOnWriteArrayList</code>, <code>ConcurrentHashMap</code> iterators.</li>
</ul>
<pre>List&lt;String&gt; list = new ArrayList&lt;&gt;(List.of("a", "b", "c"));
for (String s : list) {
    if (s.equals("b")) list.remove(s);        // ❌ ConcurrentModificationException
}

// ✅ Correct ways to remove while iterating:
list.removeIf(s -> s.equals("b"));            // cleanest
for (var it = list.iterator(); it.hasNext(); ) {
    if (it.next().equals("b")) it.remove();   // iterator's own remove
}</pre>
<div class="key-point">Trick: To remove during iteration, use <code>iterator.remove()</code> or <code>removeIf()</code>, not <code>list.remove()</code>. Fail-fast detection uses a <code>modCount</code> counter — it's best-effort, not guaranteed.</div>`,
      },
      {
        q: 'Explain Spring Boot dependency injection and IoC container.',
        difficulty: 'medium',
        a: `<p><strong>IoC (Inversion of Control)</strong> is the principle: instead of your objects creating their own dependencies with <code>new</code>, the framework creates and wires them for you. You "invert" control of object construction and lifecycle to the container. <strong>Dependency Injection (DI)</strong> is the concrete technique that implements IoC — the container <em>injects</em> a class's collaborators from the outside rather than the class fetching them itself.</p>

<p><strong>The IoC container</strong> (<code>ApplicationContext</code>) scans for beans (classes marked <code>@Component</code>, <code>@Service</code>, <code>@Repository</code>, or produced by <code>@Bean</code> methods), builds a dependency graph, then instantiates and wires them in the correct order — as singletons by default.</p>

<p><strong>Three types of injection:</strong></p>

<p><strong>1. Constructor injection (PREFERRED)</strong> — dependencies are declared as constructor parameters:</p>
<pre>@Service
public class OrderService {
    private final PaymentGateway gateway;         // final — guaranteed set

    // Since Spring 4.3, @Autowired is optional when there's ONE constructor
    public OrderService(PaymentGateway gateway) {
        this.gateway = gateway;
    }
}</pre>
<p>Why it's preferred:</p>
<ul>
<li><strong>Immutability</strong> — fields can be <code>final</code>, so the object is fully built once and never changes. Inherently thread-safe.</li>
<li><strong>Guaranteed dependencies</strong> — you literally cannot construct the object without its required collaborators, so it can never exist in a half-initialised state.</li>
<li><strong>Fails fast</strong> — a missing or circular dependency is caught at <em>startup</em>, not at the first method call in production.</li>
<li><strong>Testable without Spring</strong> — a unit test just calls <code>new OrderService(mockGateway)</code>. No container, no reflection.</li>
<li><strong>Surfaces design smells</strong> — a constructor with 8 parameters visibly screams "this class does too much" (violates SRP); field injection hides that.</li>
</ul>

<p><strong>2. Setter injection</strong> — for genuinely <em>optional</em> or reconfigurable dependencies:</p>
<pre>@Autowired
public void setCache(CacheManager cache) { this.cache = cache; }</pre>

<p><strong>3. Field injection (AVOID)</strong> — <code>@Autowired</code> placed directly on a field:</p>
<pre>@Service
public class OrderService {
    @Autowired private PaymentGateway gateway;    // ❌ convenient but problematic
}</pre>
<p>Why to avoid it:</p>
<ul>
<li><strong>Can't be <code>final</code></strong> — the field is mutable; no immutability guarantee.</li>
<li><strong>Hard to test</strong> — you can't set the dependency without Spring or reflection (<code>ReflectionTestUtils</code>). A plain <code>new</code> leaves it <code>null</code> → NPE.</li>
<li><strong>Hides too many dependencies</strong> — nothing stops you piling on 15 <code>@Autowired</code> fields, so god-classes grow unnoticed.</li>
<li><strong>Invalid until injected</strong> — the object is briefly in an unusable state, and it breaks entirely if used outside the container.</li>
</ul>

<p><strong>Bean scopes:</strong> <code>singleton</code> (default — one shared instance per container), <code>prototype</code> (a new instance every time it's requested), plus the web scopes <code>request</code>, <code>session</code>, and <code>application</code>.</p>

<div class="key-point">Trick: "How do you resolve a circular dependency (A needs B, B needs A)?" — Constructor injection <em>can't</em>, and Spring throws <code>BeanCurrentlyInCreationException</code> at startup — which is actually good, it exposes the design flaw. Field/setter injection quietly hides the cycle. Best fix: refactor to break the cycle; last resort: <code>@Lazy</code> on one side. "Two beans match one type?" — disambiguate with <code>@Qualifier("name")</code> or mark one <code>@Primary</code>.</div>`,
      },
      {
        q: 'What is the difference between @Component, @Service, @Repository, and @Controller?',
        difficulty: 'easy',
        a: `<p>All four are <strong>stereotype annotations</strong> — they mark a class as a Spring-managed bean so component scanning registers it. <code>@Service</code>, <code>@Repository</code>, and <code>@Controller</code> are <strong>specializations of <code>@Component</code></strong>. Most are functionally identical; the differences are about <strong>semantics</strong> (which layer the class belongs to) plus a couple that add real behavior.</p>
<pre>@Component   // generic bean — use when none of the others fit (utilities, helpers)
public class RetryHelper { ... }

@Service     // business-logic layer — a pure semantic marker
public class OrderService { ... }

@Repository  // data-access layer — ADDS behavior (see below)
public class JpaOrderRepository { ... }

@Controller  // web layer — handles HTTP, return value resolved as a view name
public class OrderController { ... }

@RestController  // = @Controller + @ResponseBody — return value serialized to the body
public class OrderApiController { ... }</pre>
<p><strong>The ones that add real behavior:</strong></p>
<ul>
<li><strong>@Repository</strong> — enables <strong>exception translation</strong>: a <code>PersistenceExceptionTranslationPostProcessor</code> wraps low-level, vendor-specific exceptions (<code>SQLException</code>, Hibernate's <code>ConstraintViolationException</code>) into Spring's consistent, unchecked <code>DataAccessException</code> hierarchy — so your service layer isn't coupled to JDBC/JPA specifics.</li>
<li><strong>@Controller</strong> — its methods are treated as <strong>request handlers</strong> by Spring MVC's <code>DispatcherServlet</code>, and return values are resolved as view names.</li>
<li><strong>@RestController</strong> — adds <code>@ResponseBody</code> to every method, so return values are serialized straight to the response body (JSON via Jackson) instead of resolved as views.</li>
</ul>
<div class="key-point">Why not just use <code>@Component</code> everywhere? (1) <strong>Readability</strong> — the annotation documents the architectural layer. (2) <strong>@Repository gets exception translation</strong> for free. (3) <strong>Targeted AOP / scanning</strong> — you can write pointcuts or scan filters against a stereotype (e.g. apply an aspect to every <code>@Service</code>). Trick: "Does @Service behave differently from @Component?" — No, it's purely semantic today, but it's still preferred for clarity and future-proofing.</div>`,
      },
      {
        q: 'What is the difference between @Transactional propagation levels?',
        difficulty: 'hard',
        a: `<ul>
<li><strong>REQUIRED</strong> (default): join existing TX or create new.</li>
<li><strong>REQUIRES_NEW</strong>: always create new TX, suspend current.</li>
<li><strong>NESTED</strong>: create savepoint within existing TX.</li>
<li><strong>SUPPORTS</strong>: run in TX if exists, else non-TX.</li>
<li><strong>NOT_SUPPORTED</strong>: suspend TX, run non-TX.</li>
<li><strong>MANDATORY</strong>: must run inside existing TX.</li>
<li><strong>NEVER</strong>: throw exception if TX exists.</li>
</ul>
<pre>@Service
public class OrderService {
    @Transactional                       // REQUIRED (default)
    public void placeOrder(Order o) {
        orderRepo.save(o);
        audit.logAttempt(o);             // separate TX — see below
        payment.charge(o);               // throws → order INSERT rolls back
    }
}

@Service
public class AuditService {
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAttempt(Order o) {    // commits even if the order rolls back
        auditRepo.save(new AuditRow(o));
    }
}

// NESTED: savepoint — inner part can roll back alone, outer TX survives
// (works with JDBC savepoints; JPA providers often don't support it)</pre>
<div class="key-point">Trick: Self-invocation within the same class bypasses proxy → <code>@Transactional</code> won't work (same for REQUIRES_NEW called on <code>this</code>). Solution: inject self or move to another bean.</div>`,
      },
      {
        q: 'What are design patterns commonly asked in Java interviews?',
        difficulty: 'hard',
        a: `<p>Interviewers group patterns into <strong>Creational</strong> (object creation), <strong>Structural</strong> (composition), and <strong>Behavioral</strong> (communication). Know the <em>problem each one solves</em> and a real Java/Spring example — not just the definition.</p>
<p><strong>Creational:</strong></p>
<ul>
<li><strong>Singleton</strong> — exactly one instance, globally accessible. Prefer an <code>enum</code> (thread-safe and serialization-safe) or double-checked locking with <code>volatile</code>. <em>JDK: <code>Runtime.getRuntime()</code>; Spring: singleton-scoped beans.</em></li>
<li><strong>Factory Method</strong> — a method decides which concrete class to instantiate, hiding <code>new</code> from the caller. <em>JDK: <code>Calendar.getInstance()</code>, <code>List.of()</code>.</em></li>
<li><strong>Builder</strong> — construct a complex object step by step; avoids telescoping constructors. <em>JDK: <code>StringBuilder</code>, <code>Stream.Builder</code>; Lombok: <code>@Builder</code>.</em></li>
<li><strong>Abstract Factory</strong> — a factory of related factories (families of products).</li>
</ul>
<p><strong>Structural:</strong></p>
<ul>
<li><strong>Adapter</strong> — make an incompatible interface usable. <em>JDK: <code>Arrays.asList()</code>, <code>InputStreamReader</code>.</em></li>
<li><strong>Decorator</strong> — wrap an object to add behavior without subclassing. <em>JDK: <code>new BufferedReader(new FileReader(...))</code>, <code>Collections.unmodifiableList()</code>.</em></li>
<li><strong>Proxy</strong> — a stand-in that controls access (lazy loading, security, remoting). <em>Spring AOP, <code>@Transactional</code>, Hibernate lazy entities.</em></li>
<li><strong>Facade</strong> — one simple interface over a complex subsystem.</li>
</ul>
<p><strong>Behavioral:</strong></p>
<ul>
<li><strong>Strategy</strong> — interchangeable algorithms behind one interface, swappable at runtime. <em>JDK: <code>Comparator</code>; the pattern most naturally expressed with lambdas.</em></li>
<li><strong>Observer</strong> — publish/subscribe; notify dependents on state change. <em>JDK: listeners; Spring: <code>ApplicationEvent</code>.</em></li>
<li><strong>Template Method</strong> — a base class defines the skeleton, subclasses fill in the steps. <em>Spring: <code>JdbcTemplate</code>, <code>RestTemplate</code>.</em></li>
<li><strong>Chain of Responsibility</strong> — pass a request along a chain of handlers. <em>Servlet <code>Filter</code> chain, Spring Security filters.</em></li>
</ul>
<pre>// Singleton — the recommended enum form: thread-safe + serialization-safe
public enum Config {
    INSTANCE;
    public String get(String key) { ... }
}

// Strategy with lambdas (idiomatic modern Java):
interface Discount { double apply(double price); }
Map&lt;String, Discount&gt; strategies = Map.of(
    "GOLD",   p -> p * 0.8,
    "SILVER", p -> p * 0.9);
double price = strategies.get(tier).apply(base);

// Builder:
User u = User.builder().name("John").age(30).email("j@x.com").build();</pre>
<div class="key-point">Trick: "Which patterns does Spring use most?" — Proxy (AOP / @Transactional), Singleton (beans), Factory (BeanFactory), Template Method (JdbcTemplate), Strategy (countless pluggable interfaces). "Strategy vs State?" — same structure, different intent: Strategy swaps an algorithm chosen by the client; State changes behavior as the object's own state transitions. Favor composition (Strategy) over inheritance (Template Method) where you can.</div>`,
      },
      {
        q: 'What is the difference between final, finally, and finalize in Java?',
        difficulty: 'easy',
        a: `<p>Three completely different things that just sound similar:</p>
<ul>
<li><strong>final</strong> – a keyword to make things <em>unchangeable</em>:
  <ul>
    <li><code>final variable</code>: value can't change (constant)</li>
    <li><code>final method</code>: can't be overridden by subclass</li>
    <li><code>final class</code>: can't be extended (e.g., <code>String</code>)</li>
  </ul>
</li>
<li><strong>finally</strong> – a block that <em>always</em> runs after try/catch, even if an exception occurs. Used for cleanup.</li>
<li><strong>finalize()</strong> – a method called by GC before destroying an object. <strong>Deprecated since Java 9</strong> — don't use it.</li>
</ul>
<pre>// final
final int MAX = 100;        // can't reassign
final class String { }      // can't extend

// finally
try {
    readFile();
} catch (IOException e) {
    log(e);
} finally {
    closeFile();  // ALWAYS runs — even if exception thrown
}

// finalize (DEPRECATED)
@Override
protected void finalize() throws Throwable {
    // cleanup before GC — unreliable, don't use!
}</pre>
<div class="key-point">Interview trick: "Does finally always run?" — Almost always. The only exception: <code>System.exit()</code> or JVM crash. Also, if <code>try</code> has a <code>return</code>, <code>finally</code> still runs before the return.</div>`,
      },
      {
        q: 'What is the difference between method overloading and method overriding?',
        difficulty: 'easy',
        a: `<ul>
<li><strong>Overloading</strong> (compile-time polymorphism): Same method name, <strong>different parameters</strong> in the same class.</li>
<li><strong>Overriding</strong> (runtime polymorphism): Same method name and parameters in a <strong>subclass</strong>, replacing the parent's behavior.</li>
</ul>
<pre>// Overloading — same class, different params
class Calculator {
    int add(int a, int b) { return a + b; }
    double add(double a, double b) { return a + b; }  // different param types
    int add(int a, int b, int c) { return a + b + c; } // different param count
}

// Overriding — subclass replaces parent method
class Animal {
    void speak() { System.out.println("..."); }
}
class Dog extends Animal {
    @Override
    void speak() { System.out.println("Woof!"); }  // same signature, new behavior
}

Animal a = new Dog();
a.speak();  // "Woof!" — runtime decides which version to call</pre>
<table><tr><th>Feature</th><th>Overloading</th><th>Overriding</th></tr>
<tr><td>Where</td><td>Same class</td><td>Parent ↔ Child class</td></tr>
<tr><td>Parameters</td><td>Must differ</td><td>Must be same</td></tr>
<tr><td>Return type</td><td>Can differ</td><td>Same (or covariant)</td></tr>
<tr><td>Binding</td><td>Compile-time</td><td>Runtime</td></tr>
<tr><td>Annotation</td><td>None needed</td><td>@Override recommended</td></tr></table>
<div class="key-point">Trick: Can you override a <code>static</code> method? <strong>No!</strong> Static methods belong to the class, not the instance. You can <em>hide</em> them but not override.</div>`,
      },
      {
        q: "What is the difference between 'this' and 'super' in Java?",
        difficulty: 'easy',
        a: `<ul>
<li><strong>this</strong> – refers to the <strong>current object</strong>. Used to access current class members or call current class constructors.</li>
<li><strong>super</strong> – refers to the <strong>parent class</strong>. Used to access parent class members or call parent constructors.</li>
</ul>
<pre>class Animal {
    String name;
    Animal(String name) { this.name = name; }  // 'this' distinguishes field from param
    void eat() { System.out.println(name + " eats"); }
}

class Dog extends Animal {
    String breed;
    
    Dog(String name, String breed) {
        super(name);        // calls Animal(name) constructor — MUST be first line!
        this.breed = breed; // 'this' refers to Dog's field
    }
    
    void eat() {
        super.eat();        // calls Animal.eat() first
        System.out.println(name + " chews on a bone");
    }
}

new Dog("Rex", "Labrador").eat();
// Output: "Rex eats"
//         "Rex chews on a bone"</pre>
<div class="key-point"><code>super()</code> must be the <strong>first statement</strong> in a constructor. If you don't write it, Java inserts <code>super()</code> (no-arg) automatically. If parent has no no-arg constructor, you get a compile error.</div>`,
      },
      {
        q: 'What is the difference between ArrayList and LinkedList?',
        difficulty: 'medium',
        a: `<p>Both implement <code>List</code> interface but have very different internals:</p>
<ul>
<li><strong>ArrayList</strong>: Backed by a dynamic <strong>array</strong>. Fast random access, slow insertion in the middle.</li>
<li><strong>LinkedList</strong>: Backed by a <strong>doubly-linked list</strong>. Fast insertion/deletion anywhere, slow random access.</li>
</ul>
<pre>ArrayList internally:
  [10, 20, 30, 40, 50]   ← contiguous memory
  get(2) → direct jump to index 2 → 30  (O(1))
  add(1, 99) → shift 20,30,40,50 right → slow! (O(n))

LinkedList internally:
  null←[10]⇄[20]⇄[30]⇄[40]⇄[50]→null
  get(2) → walk from head: 10→20→30  (O(n))
  add(1, 99) → just update 2 pointers  (O(1) if you have the node)</pre>
<table><tr><th>Operation</th><th>ArrayList</th><th>LinkedList</th></tr>
<tr><td>get(index)</td><td>O(1) ✅</td><td>O(n)</td></tr>
<tr><td>add(end)</td><td>O(1) amortized</td><td>O(1) ✅</td></tr>
<tr><td>add(middle)</td><td>O(n)</td><td>O(1) ✅*</td></tr>
<tr><td>remove(middle)</td><td>O(n)</td><td>O(1) ✅*</td></tr>
<tr><td>Memory</td><td>Compact</td><td>Extra (prev/next pointers)</td></tr></table>
<p><em>*O(1) only if you already have a reference to the node; finding the node is O(n).</em></p>
<div class="key-point">Use <strong>ArrayList 99% of the time</strong>. It's faster in practice due to CPU cache locality. Only use LinkedList if you heavily add/remove from the front (use <code>ArrayDeque</code> instead) or need a Queue.</div>`,
      },
      {
        q: 'What is the Java Collections Framework hierarchy?',
        difficulty: 'medium',
        a: `<p>The Java Collections Framework is a unified architecture for representing and manipulating collections.</p>
<pre>                     Iterable
                        |
                    Collection
                   /    |     \\
                List   Set    Queue
                /       |       \\
         ArrayList  HashSet   PriorityQueue
         LinkedList TreeSet   ArrayDeque
         Vector     LinkedHashSet
         
                     Map (separate hierarchy)
                    /    |      \\
              HashMap TreeMap  LinkedHashMap
              Hashtable ConcurrentHashMap</pre>
<p><strong>Quick reference:</strong></p>
<table><tr><th>Need</th><th>Use</th></tr>
<tr><td>Ordered list with fast access</td><td>ArrayList</td></tr>
<tr><td>Unique elements</td><td>HashSet</td></tr>
<tr><td>Unique + sorted</td><td>TreeSet</td></tr>
<tr><td>Unique + insertion order</td><td>LinkedHashSet</td></tr>
<tr><td>Key-value pairs</td><td>HashMap</td></tr>
<tr><td>Sorted key-value</td><td>TreeMap</td></tr>
<tr><td>Thread-safe map</td><td>ConcurrentHashMap</td></tr>
<tr><td>FIFO queue</td><td>ArrayDeque</td></tr>
<tr><td>Priority ordering</td><td>PriorityQueue</td></tr></table>
<pre>// Common operations
List&lt;String&gt; list = new ArrayList&lt;&gt;(List.of("a", "b", "c"));
Set&lt;String&gt; set = new HashSet&lt;&gt;(list);       // remove duplicates
Map&lt;String, Integer&gt; map = new HashMap&lt;&gt;();
Queue&lt;String&gt; queue = new ArrayDeque&lt;&gt;();</pre>
<div class="key-point">Key rules: <code>List</code> = ordered + duplicates. <code>Set</code> = unique + unordered (mostly). <code>Map</code> = key-value. <code>Queue</code> = FIFO. Use <code>ArrayDeque</code> over <code>Stack</code> and <code>LinkedList</code> for stack/queue operations.</div>`,
      },
      {
        q: 'What are Generics in Java and why are they useful?',
        difficulty: 'medium',
        a: `<p><strong>Generics</strong> allow you to write classes/methods that work with <strong>any type</strong> while providing <strong>compile-time type safety</strong> — no casting, no ClassCastException.</p>
<pre>// WITHOUT generics (old way — dangerous!)
List list = new ArrayList();
list.add("hello");
list.add(123);               // no error at compile time!
String s = (String) list.get(1); // ClassCastException at RUNTIME 💥

// WITH generics (type-safe)
List&lt;String&gt; list = new ArrayList&lt;&gt;();
list.add("hello");
list.add(123);               // COMPILE ERROR ✅ caught early!
String s = list.get(0);      // no casting needed</pre>
<p><strong>Writing generic classes/methods:</strong></p>
<pre>// Generic class
class Box&lt;T&gt; {
    private T item;
    public void set(T item) { this.item = item; }
    public T get() { return item; }
}
Box&lt;String&gt; box = new Box&lt;&gt;();
box.set("hello");
String val = box.get();  // no cast needed

// Generic method
&lt;T&gt; T findMax(T[] arr, Comparator&lt;T&gt; comp) { ... }

// Bounded generics — restrict types
&lt;T extends Number&gt; double sum(List&lt;T&gt; list) {
    return list.stream().mapToDouble(Number::doubleValue).sum();
}
// T must be Number or subclass (Integer, Double, etc.)</pre>
<p><strong>Wildcards:</strong></p>
<pre>&lt;?&gt;              // any type
&lt;? extends Animal&gt; // Animal or subclasses (read-only — "producer")
&lt;? super Dog&gt;      // Dog or superclasses (write-only — "consumer")
// Remember: PECS = Producer Extends, Consumer Super</pre>
<div class="key-point">Generics are erased at runtime (type erasure) — <code>List&lt;String&gt;</code> and <code>List&lt;Integer&gt;</code> are both just <code>List</code> at runtime. This is why you can't do <code>new T()</code> or <code>instanceof T</code>.</div>`,
      },
      {
        q: 'What is the difference between Process and Thread in Java?',
        difficulty: 'medium',
        a: `<ul>
<li><strong>Process</strong>: An independent program with its <strong>own memory space</strong>. Processes don't share memory.</li>
<li><strong>Thread</strong>: A lightweight unit of execution <strong>within a process</strong>. Threads share the same memory (heap) but have their own stack.</li>
</ul>
<p><strong>Analogy:</strong> A process is a whole restaurant (own kitchen, dining area). A thread is a waiter in that restaurant — multiple waiters share the kitchen but each serves their own tables.</p>
<pre>Process:
  [Process A: own heap, own stack] ←→ [Process B: own heap, own stack]
  (isolated — communicate via IPC/sockets)

Threads within a Process:
  [Thread 1: own stack] [Thread 2: own stack] [Thread 3: own stack]
          \\________________|____________________/
                    Shared Heap Memory</pre>
<pre>// Creating threads in Java:

// 1. Extend Thread
class MyThread extends Thread {
    public void run() { System.out.println("Running!"); }
}
new MyThread().start();

// 2. Implement Runnable (preferred — allows extending other class)
Runnable task = () -> System.out.println("Running!");
new Thread(task).start();

// 3. ExecutorService (best for production)
ExecutorService pool = Executors.newFixedThreadPool(4);
pool.submit(() -> System.out.println("Running in thread pool!"));</pre>
<div class="key-point">Always use <strong>ExecutorService / Thread Pool</strong> over raw threads in production. Creating a new thread for each task is expensive. Thread pool reuses threads like a connection pool reuses DB connections.</div>`,
      },
      {
        q: 'What is a deadlock in Java and how do you prevent it?',
        difficulty: 'hard',
        a: `<p>A <strong>deadlock</strong> occurs when two or more threads are <strong>waiting for each other</strong> to release locks, and none can proceed. They're stuck forever.</p>
<p><strong>Analogy:</strong> Two people in a narrow hallway. Person A says "you move first", Person B says "no, you move first". Neither moves — deadlock!</p>
<pre>// Deadlock example:
Thread 1:
  synchronized(lockA) {       // holds lockA
      synchronized(lockB) {   // waits for lockB (held by Thread 2)
          // ...
      }
  }

Thread 2:
  synchronized(lockB) {       // holds lockB
      synchronized(lockA) {   // waits for lockA (held by Thread 1)
          // ...              // 💀 DEADLOCK!
      }
  }</pre>
<p><strong>4 conditions for deadlock (ALL must be true):</strong></p>
<ol>
<li><strong>Mutual Exclusion</strong>: Resources can't be shared</li>
<li><strong>Hold and Wait</strong>: Thread holds one lock while waiting for another</li>
<li><strong>No Preemption</strong>: Can't forcibly take a lock from a thread</li>
<li><strong>Circular Wait</strong>: A→waits for B→waits for A</li>
</ol>
<p><strong>Prevention strategies:</strong></p>
<pre>// 1. Lock ordering — always acquire locks in the SAME order
Thread 1: synchronized(lockA) { synchronized(lockB) { } }
Thread 2: synchronized(lockA) { synchronized(lockB) { } }  // same order!

// 2. Lock timeout — don't wait forever
if (lock.tryLock(1, TimeUnit.SECONDS)) {
    try { /* work */ } finally { lock.unlock(); }
} else {
    // couldn't get lock — back off and retry
}

// 3. Use higher-level concurrency utilities
// ConcurrentHashMap, AtomicInteger, etc. — no explicit locking needed</pre>
<div class="key-point">Detect deadlocks with <code>jstack</code> (thread dump) or JConsole. In production, prefer <strong>lock-free data structures</strong> (Atomic classes, ConcurrentHashMap) over synchronized blocks.</div>`,
      },
      {
        q: 'What is the Java ExecutorService and its thread pool types?',
        difficulty: 'medium',
        a: `<p><strong>ExecutorService</strong> manages a pool of threads and executes tasks asynchronously without manually creating threads.</p>
<p><strong>Analogy:</strong> A call center with agents (threads). Calls (tasks) come in and are assigned to available agents. If all agents are busy, calls wait in a queue. You don't hire a new agent for every call.</p>
<pre>// Thread pool types:
ExecutorService pool;

// 1. Fixed Thread Pool — N threads, tasks queue when all busy
pool = Executors.newFixedThreadPool(4);
// Best for: Predictable, CPU-bound tasks

// 2. Cached Thread Pool — creates threads as needed, reuses idle ones
pool = Executors.newCachedThreadPool();
// Best for: Many short-lived tasks (threads expire after 60s idle)

// 3. Single Thread — one thread, tasks run sequentially
pool = Executors.newSingleThreadExecutor();
// Best for: Tasks that must run one-at-a-time (logging, DB writes)

// 4. Scheduled Thread Pool — tasks run after delay or periodically
ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
scheduler.scheduleAtFixedRate(() -> cleanup(), 0, 1, TimeUnit.HOURS);
// Best for: Cron-like periodic tasks</pre>
<pre>// Submitting tasks:
Future&lt;String&gt; future = pool.submit(() -> {
    return fetchFromDB();
});
String result = future.get();  // blocks until done

// Always shutdown!
pool.shutdown();                    // graceful — finish current tasks
pool.shutdownNow();                 // immediate — interrupt all
pool.awaitTermination(5, TimeUnit.SECONDS);</pre>
<div class="key-point">In Spring Boot, use <code>@Async</code> with a configured <code>ThreadPoolTaskExecutor</code> instead of raw ExecutorService. Set pool size = CPU cores for CPU-bound, or higher for IO-bound tasks.</div>`,
      },
      {
        q: 'What are Java records (Java 14+)?',
        difficulty: 'easy',
        a: `<p><strong>Records</strong> are immutable data carriers that auto-generate constructors, getters, <code>equals()</code>, <code>hashCode()</code>, and <code>toString()</code>.</p>
<p><strong>Problem:</strong> Simple data classes in Java require tons of boilerplate.</p>
<pre>// OLD way — 30+ lines for a simple data class!
public class Person {
    private final String name;
    private final int age;
    
    public Person(String name, int age) { 
        this.name = name; this.age = age; 
    }
    public String getName() { return name; }
    public int getAge() { return age; }
    @Override public boolean equals(Object o) { /* ... */ }
    @Override public int hashCode() { /* ... */ }
    @Override public String toString() { /* ... */ }
}

// NEW way with Record — 1 line! 🎉
public record Person(String name, int age) { }

// Usage:
Person p = new Person("John", 30);
p.name();      // "John" (accessor, NOT getName!)
p.age();       // 30
p.toString();  // "Person[name=John, age=30]"

// Can add validation:
public record Person(String name, int age) {
    public Person {  // compact constructor
        if (age < 0) throw new IllegalArgumentException("Age can't be negative");
    }
}</pre>
<p><strong>Limitations:</strong></p>
<ul>
<li>Records are <strong>implicitly final</strong> — can't extend them</li>
<li>Fields are <strong>final</strong> — can't change after creation</li>
<li>Can implement interfaces but can't extend classes</li>
</ul>
<div class="key-point">Use records for DTOs, value objects, and any class that's just "a bag of data". Similar to Kotlin data classes and Lombok @Value.</div>`,
      },
      {
        q: 'What are sealed classes in Java (Java 17)?',
        difficulty: 'medium',
        a: `<p><strong>Sealed classes</strong> restrict which classes can extend them. You explicitly list the allowed subclasses.</p>
<p><strong>Analogy:</strong> A VIP club with a guest list. Only people on the list can enter. No random person can walk in.</p>
<pre>// Only Circle, Rectangle, and Triangle can extend Shape
public sealed class Shape permits Circle, Rectangle, Triangle { }

public final class Circle extends Shape {      // 'final' — no more subclasses
    double radius;
}
public final class Rectangle extends Shape {
    double width, height;
}
public non-sealed class Triangle extends Shape { // 'non-sealed' — anyone can extend
    double base, height;
}

// public class Hexagon extends Shape { }  // COMPILE ERROR! Not in permits list</pre>
<p><strong>Three options for permitted subclasses:</strong></p>
<ul>
<li><code>final</code> — no further subclassing</li>
<li><code>sealed</code> — further restricted subclassing</li>
<li><code>non-sealed</code> — open for anyone to extend</li>
</ul>
<p><strong>Works great with pattern matching (Java 21):</strong></p>
<pre>double area(Shape shape) {
    return switch (shape) {
        case Circle c    -> Math.PI * c.radius * c.radius;
        case Rectangle r -> r.width * r.height;
        case Triangle t  -> 0.5 * t.base * t.height;
        // No default needed! Compiler knows all subtypes.
    };
}</pre>
<div class="key-point">Sealed classes give you <strong>exhaustive pattern matching</strong> — the compiler verifies you've handled all cases. Great for domain modeling where you know all possible types upfront.</div>`,
      },
      {
        q: 'What is the difference between var, explicit types, and when to use each?',
        difficulty: 'easy',
        a: `<p>Since Java 10, <code>var</code> infers the type from the right side. The type is still <strong>static</strong> — it's just compiler convenience.</p>
<pre>// Explicit type (old way):
String name = "John";
Map&lt;String, List&lt;Integer&gt;&gt; map = new HashMap&lt;String, List&lt;Integer&gt;&gt;();

// var (Java 10+):
var name = "John";          // compiler infers String
var map = new HashMap&lt;String, List&lt;Integer&gt;&gt;();  // much shorter!
var list = List.of(1, 2, 3); // infers List&lt;Integer&gt;

// var is NOT dynamic typing!
var x = "hello";
x = 123;  // COMPILE ERROR — x is String, not Object</pre>
<p><strong>When to use var:</strong></p>
<ul>
<li>✅ Long generic types: <code>var map = new HashMap&lt;String, List&lt;Integer&gt;&gt;()</code></li>
<li>✅ Obvious types: <code>var name = "John"</code>, <code>var count = 0</code></li>
<li>✅ For-each loops: <code>for (var entry : map.entrySet())</code></li>
</ul>
<p><strong>When NOT to use var:</strong></p>
<ul>
<li>❌ Unclear type: <code>var result = getResult()</code> — what type is result?</li>
<li>❌ Method parameters / return types / fields — var not allowed there</li>
<li>❌ When readability suffers</li>
</ul>
<div class="key-point"><code>var</code> is only for <strong>local variables</strong>. It can't be used for method parameters, return types, or class fields. The type is determined at <strong>compile time</strong> — it's not like JavaScript's <code>var</code>.</div>`,
      },
      {
        q: "What is the 'try-with-resources' statement?",
        difficulty: 'easy',
        a: `<p><strong>Try-with-resources</strong> (Java 7+) automatically closes resources (streams, connections, etc.) when the block exits — no need for manual <code>finally</code> cleanup.</p>
<pre>// OLD way — verbose and error-prone!
BufferedReader reader = null;
try {
    reader = new BufferedReader(new FileReader("file.txt"));
    String line = reader.readLine();
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (reader != null) {
        try { reader.close(); } catch (IOException e) { /* swallowed! */ }
    }
}

// NEW way — clean and safe! ✅
try (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {
    String line = reader.readLine();
} catch (IOException e) {
    e.printStackTrace();
}
// reader.close() called AUTOMATICALLY — even if exception thrown!

// Multiple resources:
try (
    Connection conn = dataSource.getConnection();
    PreparedStatement ps = conn.prepareStatement(sql);
    ResultSet rs = ps.executeQuery()
) {
    while (rs.next()) { /* process */ }
}
// All three closed in REVERSE order: rs → ps → conn</pre>
<p><strong>Requirement:</strong> The resource must implement <code>AutoCloseable</code> (or <code>Closeable</code>).</p>
<pre>// Custom resource:
class MyResource implements AutoCloseable {
    @Override
    public void close() { System.out.println("Cleaned up!"); }
}</pre>
<div class="key-point">Always use try-with-resources for I/O, database connections, and any <code>AutoCloseable</code>. It prevents resource leaks and is more concise than try-finally.</div>`,
      },
      {
        q: 'What is the difference between throw and throws in Java?',
        difficulty: 'easy',
        a: `<ul>
<li><strong>throw</strong> – actually <em>throws</em> an exception object. Used inside a method body.</li>
<li><strong>throws</strong> – <em>declares</em> that a method might throw an exception. Used in the method signature.</li>
</ul>
<pre>// 'throw' — creates and throws an exception
public void withdraw(double amount) {
    if (amount > balance) {
        throw new InsufficientFundsException("Not enough money!");  // throw
    }
    balance -= amount;
}

// 'throws' — declares possible exceptions in method signature
public void readFile(String path) throws IOException {  // throws
    BufferedReader reader = new BufferedReader(new FileReader(path));
    // If FileReader fails, IOException propagates to caller
}

// Caller MUST handle it:
try {
    readFile("data.txt");
} catch (IOException e) {
    System.out.println("File not found: " + e.getMessage());
}</pre>
<table><tr><th>Feature</th><th>throw</th><th>throws</th></tr>
<tr><td>Where</td><td>Inside method body</td><td>Method signature</td></tr>
<tr><td>What</td><td>Throws one exception object</td><td>Declares exception types</td></tr>
<tr><td>Followed by</td><td>Exception instance</td><td>Exception class name(s)</td></tr>
<tr><td>Multiple</td><td>One at a time</td><td>Multiple: <code>throws A, B, C</code></td></tr></table>
<div class="key-point">Only <strong>checked exceptions</strong> must be declared with <code>throws</code>. Unchecked exceptions (RuntimeException and subclasses) don't need it, but you can add it for documentation.</div>`,
      },
      {
        q: 'What is the difference between HashMap and ConcurrentHashMap?',
        difficulty: 'hard',
        a: `<ul>
<li><strong>HashMap</strong>: Not thread-safe. Fast for single-threaded use. Allows one <code>null</code> key.</li>
<li><strong>ConcurrentHashMap</strong>: Thread-safe without locking the entire map. No <code>null</code> keys or values.</li>
</ul>
<pre>// HashMap — NOT safe for multi-threading
Map&lt;String, Integer&gt; map = new HashMap&lt;&gt;();
// Two threads calling map.put() simultaneously → data corruption!

// Hashtable (legacy) — thread-safe but SLOW
Map&lt;String, Integer&gt; table = new Hashtable&lt;&gt;();
// Locks ENTIRE map on every operation → only one thread can access at a time

// ConcurrentHashMap — thread-safe AND fast ✅
Map&lt;String, Integer&gt; cmap = new ConcurrentHashMap&lt;&gt;();
// Uses segment-level locking (Java 7) or CAS + synchronized on node (Java 8+)
// Multiple threads can read/write DIFFERENT segments simultaneously</pre>
<pre>Hashtable locking:
  [LOCK entire map] → Thread 1 writes → unlock → Thread 2 reads → ...

ConcurrentHashMap (Java 8):
  Thread 1 writes to bucket 3 → [lock bucket 3 only]
  Thread 2 reads bucket 7 → no lock needed (CAS)
  Thread 3 writes to bucket 5 → [lock bucket 5 only]
  → All three happen IN PARALLEL! 🚀</pre>
<p><strong>Atomic operations in ConcurrentHashMap:</strong></p>
<pre>cmap.putIfAbsent("key", 1);         // insert only if key doesn't exist
cmap.compute("key", (k, v) -> v + 1); // atomic update
cmap.merge("key", 1, Integer::sum);   // atomic merge</pre>
<div class="key-point">Never use <code>Hashtable</code> — it's legacy. Use <code>ConcurrentHashMap</code> for multi-threaded scenarios. Use <code>HashMap</code> for single-threaded code (faster). Also: <code>Collections.synchronizedMap()</code> wraps a map with full locks — slower than ConcurrentHashMap.</div>`,
      },
      {
        q: 'Explain the Java 8 Stream API: map, filter, reduce, collect.',
        difficulty: 'medium',
        a: `<p><strong>Streams</strong> let you process collections in a functional, declarative style — like a pipeline of operations.</p>
<p><strong>Analogy:</strong> An assembly line in a factory. Raw materials (data) flow through stations (operations): filter bad items, transform them, and pack the result.</p>
<pre>List&lt;String&gt; names = List.of("Alice", "Bob", "Charlie", "Anna", "BigBob");

// filter: keep only elements matching a condition
names.stream()
     .filter(n -> n.startsWith("A"))   // ["Alice", "Anna"]

// map: transform each element
names.stream()
     .map(String::toUpperCase)         // ["ALICE", "BOB", ...]

// reduce: combine all elements into one value
int totalLength = names.stream()
     .map(String::length)              // [5, 3, 7, 4, 6]
     .reduce(0, Integer::sum);         // 25

// collect: gather results into a collection
List&lt;String&gt; result = names.stream()
     .filter(n -> n.length() > 3)
     .map(String::toUpperCase)
     .sorted()
     .collect(Collectors.toList());    // ["ALICE", "ANNA", "BIGBOB", "CHARLIE"]</pre>
<p><strong>More useful collectors:</strong></p>
<pre>// Group by first letter
Map&lt;Character, List&lt;String&gt;&gt; grouped = names.stream()
    .collect(Collectors.groupingBy(n -> n.charAt(0)));
// {A=[Alice, Anna], B=[Bob, BigBob], C=[Charlie]}

// Join to string
String joined = names.stream().collect(Collectors.joining(", "));
// "Alice, Bob, Charlie, Anna, BigBob"

// toMap
Map&lt;String, Integer&gt; nameLengths = names.stream()
    .collect(Collectors.toMap(n -> n, String::length));</pre>
<div class="key-point">Streams are <strong>lazy</strong> — intermediate operations (filter, map) don't execute until a terminal operation (collect, reduce, forEach) is called. Use <code>parallelStream()</code> for CPU-heavy operations on large data.</div>`,
      },
      {
        q: 'What is the difference between Comparable and Comparator? (with detailed examples)',
        difficulty: 'medium',
        a: `<ul>
<li><strong>Comparable</strong>: Defines the <strong>natural ordering</strong> of a class. Implemented <em>inside</em> the class. One way to sort.</li>
<li><strong>Comparator</strong>: Defines <strong>custom ordering</strong>. Implemented <em>outside</em> the class. Multiple ways to sort.</li>
</ul>
<pre>// Comparable — class defines its OWN sort order
class Employee implements Comparable&lt;Employee&gt; {
    String name;
    int salary;
    
    @Override
    public int compareTo(Employee other) {
        return Integer.compare(this.salary, other.salary); // sort by salary
    }
}
Collections.sort(employees);  // uses compareTo → sorted by salary

// Comparator — define sort order EXTERNALLY
Comparator&lt;Employee&gt; byName = Comparator.comparing(e -> e.name);
Comparator&lt;Employee&gt; bySalaryDesc = Comparator.comparingInt(e -> e.salary).reversed();
Comparator&lt;Employee&gt; byNameThenSalary = Comparator
    .comparing((Employee e) -> e.name)
    .thenComparingInt(e -> e.salary);

employees.sort(byName);           // sort by name
employees.sort(bySalaryDesc);     // sort by salary descending
employees.sort(byNameThenSalary); // sort by name, then salary</pre>
<table><tr><th>Feature</th><th>Comparable</th><th>Comparator</th></tr>
<tr><td>Package</td><td>java.lang</td><td>java.util</td></tr>
<tr><td>Method</td><td>compareTo(T o)</td><td>compare(T a, T b)</td></tr>
<tr><td>Implemented in</td><td>The class itself</td><td>Separate class / lambda</td></tr>
<tr><td>Sort orders</td><td>One (natural)</td><td>Many (custom)</td></tr></table>
<div class="key-point">Use <strong>Comparable</strong> for a default sort order (e.g., Employee by ID). Use <strong>Comparator</strong> when you need multiple sort options. Java 8 <code>Comparator.comparing()</code> makes it concise.</div>`,
      },
      {
        q: 'What is reflection in Java and when should you use it?',
        difficulty: 'hard',
        a: `<p><strong>Reflection</strong> allows you to inspect and modify classes, methods, fields, and constructors at <strong>runtime</strong> — even private ones.</p>
<p><strong>Analogy:</strong> Normally you use a TV remote as designed (public API). Reflection is like opening the TV case and directly manipulating the circuit board — powerful but dangerous.</p>
<pre>// Get class information at runtime
Class&lt;?&gt; clazz = Class.forName("com.example.User");

// Create instance without 'new'
Object user = clazz.getDeclaredConstructor().newInstance();

// Access private field
Field field = clazz.getDeclaredField("name");
field.setAccessible(true);       // bypass private!
field.set(user, "John");
String name = (String) field.get(user);  // "John"

// Call private method
Method method = clazz.getDeclaredMethod("secretMethod", String.class);
method.setAccessible(true);
Object result = method.invoke(user, "arg1");</pre>
<p><strong>Where reflection is used:</strong></p>
<ul>
<li><strong>Spring Framework</strong>: Dependency injection, bean creation, @Autowired</li>
<li><strong>JPA/Hibernate</strong>: Mapping objects to tables, accessing fields</li>
<li><strong>JUnit</strong>: Finding and running @Test methods</li>
<li><strong>Jackson/Gson</strong>: JSON serialization/deserialization</li>
<li><strong>Annotations processing</strong>: Reading @Override, @Transactional, etc.</li>
</ul>
<p><strong>Downsides:</strong></p>
<ul>
<li>❌ Slow — 10-100x slower than direct calls</li>
<li>❌ No compile-time safety — errors at runtime</li>
<li>❌ Breaks encapsulation — access to private members</li>
</ul>
<div class="key-point">Don't use reflection in business logic. It's for frameworks and libraries. When you see Spring "magically" inject dependencies, that's reflection under the hood.</div>`,
      },
      {
        q: 'What is the difference between JDK, JRE, and JVM?',
        difficulty: 'easy',
        a: `<ul>
<li><strong>JVM</strong> (Java Virtual Machine) – The engine that <em>runs</em> bytecode. Platform-specific (different JVM for Windows, Mac, Linux).</li>
<li><strong>JRE</strong> (Java Runtime Environment) – JVM + standard libraries needed to <em>run</em> Java programs.</li>
<li><strong>JDK</strong> (Java Development Kit) – JRE + development tools (compiler, debugger, etc.) needed to <em>develop</em> Java programs.</li>
</ul>
<pre>JDK (Development Kit)
├── JRE (Runtime Environment)
│   ├── JVM (Virtual Machine)
│   │   ├── Class Loader
│   │   ├── Bytecode Verifier
│   │   ├── JIT Compiler
│   │   └── Garbage Collector
│   └── Standard Libraries (java.lang, java.util, etc.)
├── javac (compiler: .java → .class bytecode)
├── javadoc (documentation generator)
├── jar (archive tool)
└── jdb (debugger)

Flow:
  YourCode.java → [javac compiler] → YourCode.class (bytecode)
                                          ↓
                                     [JVM executes]
                                          ↓
                                    Machine code (OS-specific)</pre>
<div class="key-point">"Write once, run anywhere" — you compile Java code once to bytecode, and any JVM on any OS can run it. Since Java 11, there's no separate JRE download; the JDK includes everything.</div>`,
      },
      {
        q: 'What is the difference between shallow copy and deep copy in Java?',
        difficulty: 'medium',
        a: `<ul>
<li><strong>Shallow copy</strong>: Copies the object but <strong>shares references</strong> to inner objects. Changes to inner objects affect both.</li>
<li><strong>Deep copy</strong>: Copies everything — the object AND all inner objects. Fully independent.</li>
</ul>
<p><strong>Analogy:</strong> Shallow copy = photocopying a page that has sticky notes. You get a copy of the page, but both copies share the same sticky notes. Deep copy = photocopying the page AND making new copies of every sticky note.</p>
<pre>class Address {
    String city;
    Address(String city) { this.city = city; }
}
class Person implements Cloneable {
    String name;
    Address address;  // reference type
    
    // SHALLOW copy — address is shared!
    Person shallowCopy() throws CloneNotSupportedException {
        return (Person) super.clone();
    }
    
    // DEEP copy — address is also copied
    Person deepCopy() {
        Person copy = new Person();
        copy.name = this.name;          // String is immutable, safe to share
        copy.address = new Address(this.address.city);  // NEW Address object
        return copy;
    }
}

Person p1 = new Person("John", new Address("NYC"));
Person p2 = p1.shallowCopy();

p2.address.city = "LA";
System.out.println(p1.address.city); // "LA" 😱 — shallow copy shared the Address!

Person p3 = p1.deepCopy();
p3.address.city = "Chicago";
System.out.println(p1.address.city); // "LA" ✅ — deep copy is independent</pre>
<div class="key-point">For deep copy, consider: (1) manual copy constructor, (2) serialization/deserialization, or (3) libraries like Apache Commons <code>SerializationUtils.clone()</code>. Avoid <code>clone()</code> — it's broken by design (Effective Java, Item 13).</div>`,
      },
      {
        q: 'What are Virtual Threads in Java 21 and how do they differ from platform threads?',
        difficulty: 'hard',
        a: `<p><strong>Virtual threads</strong> (Project Loom) are lightweight threads managed by the JVM, not the OS. You can create millions of them without running out of memory.</p>
<pre>// Platform thread (traditional): 1 thread = ~1MB stack, managed by OS
Thread platformThread = new Thread(() -> {
    // Each thread is expensive — limited to ~thousands
});

// Virtual thread (Java 21): lightweight, managed by JVM
Thread virtualThread = Thread.startVirtualThread(() -> {
    // Millions of these are fine — they share OS threads
});

// With ExecutorService:
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    // Submit 100,000 tasks — each gets its own virtual thread
    for (int i = 0; i < 100_000; i++) {
        executor.submit(() -> {
            Thread.sleep(Duration.ofSeconds(1)); // blocks virtual thread, NOT OS thread
            return fetchFromDatabase();
        });
    }
} // auto-closes, waits for all tasks</pre>
<table><tr><th>Aspect</th><th>Platform Thread</th><th>Virtual Thread</th></tr>
<tr><td>Cost</td><td>~1MB stack each</td><td>~few KB each</td></tr>
<tr><td>Scalability</td><td>Thousands</td><td>Millions</td></tr>
<tr><td>Blocking</td><td>Blocks OS thread</td><td>Unmounts from carrier thread</td></tr>
<tr><td>Use case</td><td>CPU-intensive work</td><td>I/O-heavy work (web servers, DB calls)</td></tr></table>
<div class="key-point">Virtual threads make blocking code scale like async code — you write simple blocking code but get the throughput of reactive programming. <strong>Don't pool virtual threads</strong> — create a new one per task. Don't use <code>synchronized</code> in hot paths (pins the carrier thread) — use <code>ReentrantLock</code> instead.</div>`,
      },
      {
        q: 'What are switch expressions, pattern matching, and text blocks in modern Java?',
        difficulty: 'medium',
        a: `<p><strong>Switch expressions (Java 14+):</strong></p>
<pre>// Old switch statement:
String result;
switch (day) {
    case "MON": case "TUE": result = "Weekday"; break;
    case "SAT": case "SUN": result = "Weekend"; break;
    default: result = "Unknown"; break;
}

// New switch expression (returns a value):
String result = switch (day) {
    case "MON", "TUE", "WED", "THU", "FRI" -> "Weekday";
    case "SAT", "SUN" -> "Weekend";
    default -> "Unknown";
};

// With yield for complex blocks:
int numLetters = switch (day) {
    case "MON", "FRI", "SUN" -> 3;
    case "TUE" -> { System.out.println("Tuesday!"); yield 3; }
    default -> throw new IllegalArgumentException();
};</pre>
<p><strong>Pattern matching (Java 16+ for instanceof, Java 21 for switch):</strong></p>
<pre>// Old:
if (obj instanceof String) {
    String s = (String) obj;  // manual cast
    System.out.println(s.length());
}

// New (Java 16+):
if (obj instanceof String s) {
    System.out.println(s.length());  // s is already cast!
}

// Pattern matching in switch (Java 21):
String describe(Object obj) {
    return switch (obj) {
        case Integer i when i > 0 -> "positive int: " + i;
        case String s -> "string of length " + s.length();
        case null -> "null value";
        default -> "something else";
    };
}</pre>
<p><strong>Text blocks (Java 15+):</strong></p>
<pre>// Old:
String json = "{\\n  \\"name\\": \\"John\\",\\n  \\"age\\": 30\\n}";

// New:
String json = """
        {
          "name": "John",
          "age": 30
        }
        """;
// Indentation is automatically stripped based on closing \\"\\"\\"</pre>
<div class="key-point">These modern features make Java code significantly more readable. Switch expressions eliminate fall-through bugs, pattern matching eliminates manual casts, and text blocks clean up multi-line strings.</div>`,
      },
      {
        q: 'How do you create an immutable class in Java?',
        difficulty: 'medium',
        a: `<p>An <strong>immutable class</strong> is a class whose instances cannot be modified after creation. They are inherently thread-safe.</p>
<pre>// Rules for immutability:
public final class Money {                    // 1. final class — can't be extended
    private final BigDecimal amount;          // 2. final fields
    private final String currency;
    private final List&lt;String&gt; tags;

    public Money(BigDecimal amount, String currency, List&lt;String&gt; tags) {
        this.amount = amount;
        this.currency = currency;
        this.tags = List.copyOf(tags);        // 3. Defensive copy of mutable objects
    }

    public BigDecimal getAmount() { return amount; }   // 4. No setters
    public String getCurrency() { return currency; }

    public List&lt;String&gt; getTags() {
        return tags;                          // List.copyOf returns unmodifiable list
    }

    // 5. Methods that "modify" return new objects
    public Money add(Money other) {
        return new Money(this.amount.add(other.amount), this.currency, this.tags);
    }
}

// Java Records — immutable by design (Java 16+):
public record Point(int x, int y) {}
// Automatically: final class, final fields, constructor, getters, equals, hashCode, toString</pre>
<div class="key-point">Immutable objects are thread-safe without synchronization. String, Integer, LocalDate are all immutable in Java. Use Records for simple immutable data carriers.</div>`,
      },
      {
        q: 'What is ThreadLocal in Java and what are its pitfalls?',
        difficulty: 'hard',
        a: `<p><strong>ThreadLocal</strong> gives each thread its own copy of a variable — no synchronization needed.</p>
<pre>// Each thread gets its own SimpleDateFormat (not thread-safe!)
private static final ThreadLocal&lt;SimpleDateFormat&gt; dateFormat =
    ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));

// Usage:
String date = dateFormat.get().format(new Date());
// Each thread uses its own instance — no race condition

// Common use: request context in web frameworks
public class RequestContext {
    private static final ThreadLocal&lt;User&gt; currentUser = new ThreadLocal&lt;&gt;();

    public static void setUser(User user) { currentUser.set(user); }
    public static User getUser() { return currentUser.get(); }
    public static void clear() { currentUser.remove(); }  // CRITICAL!
}

// Spring uses this pattern: RequestContextHolder, SecurityContextHolder</pre>
<p><strong>Pitfalls:</strong></p>
<ul>
<li><strong>Memory leaks with thread pools</strong>: Thread pool reuses threads → old ThreadLocal values persist! Always call <code>.remove()</code> in a finally block.</li>
<li><strong>Hidden coupling</strong>: Methods depend on invisible state — hard to test and reason about.</li>
<li><strong>Doesn't work with virtual threads</strong>: Virtual threads are too numerous for ThreadLocal → use <code>ScopedValue</code> (Java 21 preview) instead.</li>
</ul>
<pre>// MEMORY LEAK example:
ExecutorService pool = Executors.newFixedThreadPool(10);
pool.submit(() -> {
    RequestContext.setUser(user);
    doWork();
    // ❌ Forgot to call RequestContext.clear()!
    // Thread returns to pool with stale user → next request sees wrong user!
});

// Fix:
pool.submit(() -> {
    try {
        RequestContext.setUser(user);
        doWork();
    } finally {
        RequestContext.clear();  // ✅ Always clean up!
    }
});</pre>
<div class="key-point">The #1 ThreadLocal mistake: forgetting to call <code>.remove()</code> in thread pool environments. This causes memory leaks and data leaks between requests. Spring's request-scoped beans handle this automatically.</div>`,
      },
      {
        q: 'What is the diamond problem with Java default methods?',
        difficulty: 'tricky',
        a: `<p>When a class implements two interfaces with the same default method, Java has a <strong>diamond problem</strong> — which implementation wins?</p>
<pre>interface Flyable {
    default String move() { return "Flying"; }
}

interface Swimmable {
    default String move() { return "Swimming"; }
}

// ❌ Compile error! Ambiguous — which move() to use?
class Duck implements Flyable, Swimmable {
    // Must override to resolve conflict
}

// ✅ Fix: explicitly override
class Duck implements Flyable, Swimmable {
    @Override
    public String move() {
        return Flyable.super.move();  // Choose one
        // or return "Walking";       // Or provide your own
    }
}

// No conflict if one is a class (class wins):
class Animal {
    String move() { return "Walking"; }
}
class Duck extends Animal implements Flyable {
    // No conflict: Animal.move() wins over Flyable.move()
    // Class always takes priority over interface default
}</pre>
<p><strong>Resolution rules:</strong></p>
<ol>
<li><strong>Class wins over interface</strong>: concrete class method beats default method</li>
<li><strong>Sub-interface wins</strong>: more specific interface beats less specific</li>
<li><strong>Must override</strong>: if neither rule applies, compile error — you must resolve manually</li>
</ol>
<div class="key-point">This is a popular trick question. The key rule: classes always win over interfaces, and if two interfaces conflict, you must explicitly override. Java avoids the true diamond problem (multiple class inheritance) by only allowing single class inheritance.</div>`,
      },
      {
        q: 'What is the String pool and when does String.intern() matter?',
        difficulty: 'tricky',
        a: `<p>Java maintains a <strong>String pool</strong> (in the heap since Java 7) to reuse common String objects and save memory.</p>
<pre>// String literals go to the pool automatically:
String s1 = "hello";      // goes to pool
String s2 = "hello";      // reuses same pool object
System.out.println(s1 == s2);  // true ✅ (same object in pool)

// new String() always creates a NEW object on the heap:
String s3 = new String("hello");  // new object, NOT in pool
System.out.println(s1 == s3);     // false ❌ (different objects)
System.out.println(s1.equals(s3)); // true ✅ (same content)

// intern() puts the string into the pool (or returns existing):
String s4 = s3.intern();
System.out.println(s1 == s4);  // true ✅ (s4 now points to pool)

// Trick question: how many String objects are created?
String s = new String("abc");
// Answer: UP TO 2 objects:
//   1. "abc" literal → goes to pool (if not already there)
//   2. new String() → creates new object on heap

// Concatenation:
String a = "hel" + "lo";   // compile-time constant → "hello" from pool
String b = "hel";
String c = b + "lo";       // runtime concatenation → new object (NOT in pool)
System.out.println(a == "hello");  // true (compile-time folding)
System.out.println(c == "hello");  // false (runtime concat = new object)</pre>
<div class="key-point">Always use <code>.equals()</code> for String comparison, never <code>==</code>. The pool is an optimization detail. <code>intern()</code> is rarely needed in modern Java — the JVM already optimizes string deduplication in GC (JEP 192).</div>`,
      },
      {
        q: 'What are the pitfalls of parallel streams in Java?',
        difficulty: 'hard',
        a: `<p>Parallel streams use the <strong>common ForkJoinPool</strong> (shared across the entire application) and can cause serious problems if misused.</p>
<pre>// Basic parallel stream:
List&lt;Integer&gt; nums = IntStream.rangeClosed(1, 1000).boxed().toList();
int sum = nums.parallelStream()
    .filter(n -> n % 2 == 0)
    .mapToInt(Integer::intValue)
    .sum();

// ❌ Pitfall 1: Shared ForkJoinPool blocks everything
list.parallelStream()
    .map(id -> fetchFromDatabase(id))  // Slow I/O blocks common pool!
    .toList();
// All other parallel streams in the app are now waiting!

// ✅ Fix: Use custom ForkJoinPool for I/O-heavy work
ForkJoinPool customPool = new ForkJoinPool(10);
List&lt;Result&gt; results = customPool.submit(() ->
    list.parallelStream()
        .map(id -> fetchFromDatabase(id))
        .toList()
).get();

// ❌ Pitfall 2: Shared mutable state (race condition!)
List&lt;String&gt; results = new ArrayList&lt;&gt;();  // not thread-safe!
stream.parallel().forEach(item -> results.add(process(item)));  // RACE CONDITION
// ✅ Fix: Use .collect() instead
List&lt;String&gt; results = stream.parallel().map(this::process).collect(Collectors.toList());

// ❌ Pitfall 3: Order-dependent operations
list.parallelStream().forEachOrdered(System.out::println);
// forEachOrdered forces sequential behavior → no benefit from parallel

// ❌ Pitfall 4: Small data sets
List.of(1, 2, 3).parallelStream()...  // Overhead > benefit for small lists</pre>
<p><strong>When to use parallel streams:</strong></p>
<ul>
<li>Large data sets (10,000+ elements)</li>
<li>CPU-intensive operations (not I/O)</li>
<li>No shared mutable state</li>
<li>Independent elements (no ordering requirement)</li>
</ul>
<div class="key-point">The common ForkJoinPool has <code>Runtime.availableProcessors() - 1</code> threads. One slow parallel stream can starve the entire app. Default to sequential streams — parallelize only after profiling shows a bottleneck.</div>`,
      },
      // --- Additional Senior-Level Topics ---
      {
        q: 'What are Weak, Soft, and Phantom References in Java?',
        difficulty: 'hard',
        a: `<p>Java provides 4 types of references with different GC behaviors, used for caching and resource management.</p>
<pre>// 1. Strong Reference (default) — object NEVER collected while reachable
String s = new String("hello");  // strong ref — GC won't touch it

// 2. Soft Reference — collected only when JVM is LOW ON MEMORY
SoftReference&lt;byte[]&gt; cache = new SoftReference&lt;&gt;(new byte[1024*1024]);
byte[] data = cache.get();  // may return null if GC reclaimed it
// USE CASE: memory-sensitive caches

// 3. Weak Reference — collected at NEXT GC cycle (regardless of memory)
WeakReference&lt;User&gt; weakUser = new WeakReference&lt;&gt;(new User("John"));
User u = weakUser.get();  // null after next GC
// USE CASE: WeakHashMap (keys are weak refs), preventing memory leaks

// 4. Phantom Reference — CANNOT access the object (get() always returns null)
PhantomReference&lt;Object&gt; phantom = new PhantomReference&lt;&gt;(obj, refQueue);
phantom.get();  // ALWAYS null
// USE CASE: cleanup actions before final GC (better than finalize)</pre>
<p><strong>Reference strength order:</strong></p>
<pre>Strong > Soft > Weak > Phantom
(hardest to collect)        (easiest to collect)</pre>
<p><strong>WeakHashMap — common interview topic:</strong></p>
<pre>// Keys are held as WeakReferences — entry removed when key is GC'd
WeakHashMap&lt;Object, String&gt; map = new WeakHashMap&lt;&gt;();
Object key = new Object();
map.put(key, "value");
key = null;  // no more strong refs to key
System.gc(); // key gets collected → entry removed from map!
map.size();  // 0</pre>
<p><strong>ReferenceQueue — notification of collection:</strong></p>
<pre>ReferenceQueue&lt;Object&gt; queue = new ReferenceQueue&lt;&gt;();
WeakReference&lt;Object&gt; ref = new WeakReference&lt;&gt;(obj, queue);
// When obj is collected, ref is enqueued in queue
// Poll the queue to detect when objects are collected</pre>
<div class="key-point">Trick: "Where are weak references used in practice?" — ThreadLocalMap uses WeakReferences for keys (ThreadLocal instances). If ThreadLocal is GC'd, the entry key becomes null — but the VALUE still leaks if not removed! This is why ThreadLocal.remove() is critical. Also: Guava Cache and Caffeine support weak/soft value caches.</div>`,
      },
      {
        q: 'What are common causes of memory leaks in Java and how do you detect them?',
        difficulty: 'hard',
        a: `<p>Even with GC, Java can have memory leaks — objects that are technically reachable but no longer needed.</p>
<p><strong>Common causes:</strong></p>
<pre>// 1. Static collections that grow forever
private static final List&lt;Event&gt; eventLog = new ArrayList&lt;&gt;();
public void logEvent(Event e) { eventLog.add(e); }  // never cleaned!

// 2. ThreadLocal not removed in thread pools
threadLocal.set(largeObject);
// Thread returns to pool → largeObject stays!
// Fix: always call threadLocal.remove() in finally

// 3. Listeners/callbacks not deregistered
button.addActionListener(myListener);
// If you never remove the listener, myListener (and everything it references) leaks

// 4. Inner class holding reference to outer class
class Outer {
    byte[] data = new byte[10_000_000]; // 10MB
    class Inner { }  // holds implicit reference to Outer!
    // Fix: use STATIC inner class when you don't need outer ref
}

// 5. Unclosed resources (connections, streams)
Connection conn = dataSource.getConnection();
// If exception occurs before conn.close() → leaked connection
// Fix: try-with-resources

// 6. String.substring() in Java 6 (shared backing char[])
// Fixed in Java 7+ — substring creates new array

// 7. HashMap with mutable keys
Map&lt;MutableKey, Value&gt; map = new HashMap&lt;&gt;();
MutableKey key = new MutableKey(1);
map.put(key, value);
key.setId(2);  // hashCode changes! Entry unreachable but not GC'd

// 8. ClassLoader leaks (common in app servers)
// Old classloader kept alive by one static reference → all loaded classes leak</pre>
<p><strong>Detection tools:</strong></p>
<ul>
<li><strong>Heap dump</strong>: <code>jmap -dump:live,format=b,file=heap.hprof &lt;pid&gt;</code></li>
<li><strong>Eclipse MAT</strong>: analyze heap dumps, find dominator tree, leak suspects.</li>
<li><strong>VisualVM / JConsole</strong>: monitor heap usage in real-time.</li>
<li><strong>Java Flight Recorder (JFR)</strong>: low-overhead production profiling.</li>
<li><strong>-XX:+HeapDumpOnOutOfMemoryError</strong>: auto-dump on OOM.</li>
</ul>
<p><strong>Detection pattern:</strong></p>
<pre>// Signs of memory leak:
// 1. Heap usage grows steadily over time (sawtooth with rising baseline)
// 2. Full GC frequency increases
// 3. Eventually: OutOfMemoryError

// Diagnosis:
// 1. Take heap dump
// 2. Find objects with highest retained size
// 3. Trace GC root path → find who's holding the reference
// 4. Fix: break the reference chain</pre>
<div class="key-point">Trick: "How is a memory leak different in Java vs C++?" — In C++, you forget to free memory. In Java, you unintentionally keep references alive. The fix is to nullify references, use WeakReferences for caches, close resources, and remove listeners. Always configure <code>-XX:+HeapDumpOnOutOfMemoryError</code> in production.</div>`,
      },
      {
        q: 'What is the difference between JDK Dynamic Proxy and CGLIB Proxy?',
        difficulty: 'hard',
        a: `<p>Both create proxy objects at runtime — essential for understanding Spring AOP, @Transactional, lazy loading.</p>
<pre>// JDK Dynamic Proxy — INTERFACE-based
// Target MUST implement an interface
public interface UserService {
    User findById(Long id);
}

InvocationHandler handler = (proxy, method, args) -> {
    System.out.println("Before: " + method.getName());
    Object result = method.invoke(target, args);
    System.out.println("After: " + method.getName());
    return result;
};

UserService proxy = (UserService) Proxy.newProxyInstance(
    UserService.class.getClassLoader(),
    new Class[]{UserService.class},
    handler
);

// CGLIB Proxy — CLASS-based (subclassing)
// Works even without interface
// Creates a SUBCLASS of the target class
Enhancer enhancer = new Enhancer();
enhancer.setSuperclass(UserServiceImpl.class);
enhancer.setCallback((MethodInterceptor) (obj, method, args, proxy) -> {
    System.out.println("Before: " + method.getName());
    Object result = proxy.invokeSuper(obj, args);
    System.out.println("After: " + method.getName());
    return result;
});
UserServiceImpl proxy = (UserServiceImpl) enhancer.create();</pre>
<table><tr><th>Feature</th><th>JDK Proxy</th><th>CGLIB</th></tr>
<tr><td>Requires</td><td>Interface</td><td>No interface needed</td></tr>
<tr><td>Mechanism</td><td>Implements interface</td><td>Extends target class (subclass)</td></tr>
<tr><td>final methods</td><td>N/A</td><td>Cannot proxy (can't override final)</td></tr>
<tr><td>final class</td><td>N/A</td><td>Cannot proxy (can't extend final)</td></tr>
<tr><td>Performance</td><td>Slightly slower method dispatch</td><td>Faster after initial creation</td></tr>
<tr><td>Spring default</td><td>If interface exists (Spring &lt;4)</td><td>Default since Spring Boot 2.0</td></tr></table>
<p><strong>How Spring uses proxies:</strong></p>
<pre>// @Transactional creates a proxy:
@Service
public class OrderService {
    @Transactional
    public void placeOrder() { }  // Proxy wraps this with TX begin/commit
}

// Self-invocation problem:
@Service
public class OrderService {
    @Transactional
    public void placeOrder() {
        this.validateOrder();  // 'this' bypasses proxy! No TX!
    }
    @Transactional(propagation = REQUIRES_NEW)
    public void validateOrder() { }
}
// Fix: inject self, use AopContext.currentProxy(), or move to another bean</pre>
<div class="key-point">Trick: "Why doesn't @Transactional work on private methods?" — CGLIB creates a subclass. Private methods can't be overridden, so the proxy can't intercept them. Same for final methods/classes. "Why doesn't self-invocation trigger AOP?" — <code>this</code> refers to the raw object, not the proxy. The proxy intercept only happens when called through the proxy reference (from outside the class).</div>`,
      },
      {
        q: 'What are the common Java serialization pitfalls and alternatives?',
        difficulty: 'hard',
        a: `<p>Java serialization (<code>Serializable</code>) converts objects to byte streams. It has many pitfalls.</p>
<pre>// Basic serialization:
public class User implements Serializable {
    private static final long serialVersionUID = 1L; // Version control
    private String name;
    private transient String password;  // NOT serialized
    private static int count;           // NOT serialized (static = class-level)
}

// Serialize:
ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("user.ser"));
oos.writeObject(user);

// Deserialize:
ObjectInputStream ois = new ObjectInputStream(new FileInputStream("user.ser"));
User user = (User) ois.readObject();  // constructor NOT called!</pre>
<p><strong>Critical pitfalls:</strong></p>
<ol>
<li><strong>serialVersionUID</strong>: If not declared, JVM generates one from class structure. ANY change to class → different UID → <code>InvalidClassException</code> during deserialization.</li>
<li><strong>Constructor not called</strong>: Deserialization bypasses constructors → validation logic skipped!</li>
<li><strong>Security vulnerability</strong>: Deserializing untrusted data can lead to Remote Code Execution (RCE). Attackers craft malicious byte streams using "gadget chains".</li>
<li><strong>Inheritance issues</strong>: If parent is NOT Serializable, parent's no-arg constructor IS called during deserialization. Parent fields reset to defaults.</li>
<li><strong>Singleton broken</strong>: Deserializing a singleton creates a NEW instance!</li>
</ol>
<pre>// Fix: Singleton protection
private Object readResolve() {
    return INSTANCE;  // Replace deserialized object with singleton
}

// Custom serialization logic:
private void writeObject(ObjectOutputStream out) throws IOException {
    out.defaultWriteObject();
    out.writeObject(encrypt(sensitiveData));
}
private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
    in.defaultReadObject();
    this.sensitiveData = decrypt((String) in.readObject());
}

// Serialization Proxy Pattern (Effective Java Item 90):
private Object writeReplace() {
    return new SerializationProxy(this);
}
private void readObject(ObjectInputStream in) throws InvalidObjectException {
    throw new InvalidObjectException("Use SerializationProxy");
}</pre>
<p><strong>Modern alternatives to Java serialization:</strong></p>
<ul>
<li><strong>JSON</strong> (Jackson, Gson): human-readable, cross-language.</li>
<li><strong>Protocol Buffers</strong> (protobuf): compact, fast, schema-based.</li>
<li><strong>Avro</strong>: schema evolution, used in Kafka.</li>
<li><strong>Kryo</strong>: fastest Java serialization, used in Spark.</li>
</ul>
<div class="key-point">Trick: "Is Serializable safe?" — No! It's a major security risk. JEP 290 (Java 9+) adds deserialization filters. Effective Java: "There is no reason to use Java serialization in any new system you write." Use JSON/protobuf instead. Enum singleton is naturally serialization-safe (only Enum.INSTANCE is ever returned).</div>`,
      },
      {
        q: 'Explain Java NIO vs IO. What is the Reactor pattern?',
        difficulty: 'hard',
        a: `<p>Java IO is <strong>blocking and stream-based</strong>. Java NIO is <strong>non-blocking and buffer/channel-based</strong>.</p>
<pre>// Traditional IO (java.io) — blocking, one-thread-per-connection:
ServerSocket server = new ServerSocket(8080);
while (true) {
    Socket client = server.accept();  // BLOCKS until connection
    new Thread(() -> {
        InputStream in = client.getInputStream();  // BLOCKS on read
        // handle request...
    }).start();
}
// Problem: 10,000 connections = 10,000 threads = massive memory + context switching

// NIO (java.nio) — non-blocking, single thread handles many connections:
Selector selector = Selector.open();
ServerSocketChannel server = ServerSocketChannel.open();
server.configureBlocking(false);
server.register(selector, SelectionKey.OP_ACCEPT);

while (true) {
    selector.select();  // blocks until at least one channel is ready
    Set&lt;SelectionKey&gt; keys = selector.selectedKeys();
    for (SelectionKey key : keys) {
        if (key.isAcceptable()) { /* accept new connection */ }
        if (key.isReadable())   { /* read data from channel */ }
        if (key.isWritable())   { /* write data to channel */ }
    }
}</pre>
<table><tr><th>Feature</th><th>IO (java.io)</th><th>NIO (java.nio)</th></tr>
<tr><td>Model</td><td>Stream-based</td><td>Buffer/Channel-based</td></tr>
<tr><td>Blocking</td><td>Always blocking</td><td>Non-blocking possible</td></tr>
<tr><td>Threading</td><td>1 thread per connection</td><td>1 thread, many connections</td></tr>
<tr><td>Scalability</td><td>~thousands</td><td>~millions (with epoll/kqueue)</td></tr>
<tr><td>Use case</td><td>Simple apps, file I/O</td><td>High-concurrency servers</td></tr></table>
<p><strong>Key NIO concepts:</strong></p>
<ul>
<li><strong>Buffer</strong>: Container for data (ByteBuffer). Has position, limit, capacity. flip()/clear()/compact().</li>
<li><strong>Channel</strong>: Bidirectional data conduit (SocketChannel, FileChannel). Like a stream but supports scatter/gather.</li>
<li><strong>Selector</strong>: Multiplexer that monitors multiple channels. One thread polls for events.</li>
</ul>
<p><strong>Reactor Pattern (used by Netty, Tomcat NIO, Node.js):</strong></p>
<pre>// Single-threaded Reactor:
[Selector/Event Loop] → detects events → dispatches to handlers
  - Accept handler → registers new channel
  - Read handler → reads data, processes, writes response

// Multi-reactor (Netty model):
Boss Group (1-2 threads): accepts connections
Worker Group (N threads): handles I/O reads/writes
Each thread has its own Selector (event loop)</pre>
<div class="key-point">Trick: "Why not use NIO for everything?" — NIO is more complex. For file I/O, standard IO or NIO.2 (Files.readAllLines) is simpler. NIO shines for network I/O with many concurrent connections. "What does Netty add over raw NIO?" — Thread model, pipeline of handlers, zero-copy, memory pooling, protocol codecs. With Java 21 Virtual Threads, blocking IO becomes competitive again — simple code with NIO-level scalability.</div>`,
      },
      {
        q: 'How do you create custom annotations and how does annotation processing work?',
        difficulty: 'hard',
        a: `<p>Annotations are metadata attached to code. You can create custom annotations and process them at compile-time or runtime.</p>
<pre>// Define custom annotation:
@Target({ElementType.METHOD, ElementType.TYPE})  // where it can be used
@Retention(RetentionPolicy.RUNTIME)              // when it's available
@Documented                                       // included in Javadoc
public @interface RateLimit {
    int maxRequests() default 100;
    int windowSeconds() default 60;
    String key() default "";
}

// Use it:
@RateLimit(maxRequests = 10, windowSeconds = 30)
public ResponseEntity&lt;List&lt;User&gt;&gt; getUsers() { ... }

// Process at RUNTIME via reflection:
Method method = clazz.getMethod("getUsers");
if (method.isAnnotationPresent(RateLimit.class)) {
    RateLimit rl = method.getAnnotation(RateLimit.class);
    int max = rl.maxRequests();  // 10
    int window = rl.windowSeconds();  // 30
}</pre>
<p><strong>Retention policies:</strong></p>
<ul>
<li><code>SOURCE</code>: discarded at compile time. For IDE/linter only (e.g., @SuppressWarnings).</li>
<li><code>CLASS</code>: kept in .class file but NOT available at runtime. Default.</li>
<li><code>RUNTIME</code>: available via reflection at runtime (e.g., @Transactional, @Autowired).</li>
</ul>
<p><strong>Compile-time annotation processing (APT):</strong></p>
<pre>// Used by: Lombok, MapStruct, Dagger, AutoValue
// Generates code at compile time — NO runtime overhead!

@SupportedAnnotationTypes("com.example.Builder")
public class BuilderProcessor extends AbstractProcessor {
    @Override
    public boolean process(Set&lt;? extends TypeElement&gt; annotations,
                          RoundEnvironment roundEnv) {
        for (Element element : roundEnv.getElementsAnnotatedWith(Builder.class)) {
            // Generate builder class source code
            JavaFileObject file = processingEnv.getFiler()
                .createSourceFile(element + "Builder");
            // Write generated code...
        }
        return true;
    }
}</pre>
<p><strong>How Spring processes annotations:</strong></p>
<pre>// Spring scans for @Component, @Service etc. at startup:
// 1. ClassPathBeanDefinitionScanner scans packages
// 2. Finds classes with stereotype annotations
// 3. Creates BeanDefinition for each
// 4. BeanPostProcessor processes @Autowired, @Value, etc.
// 5. AOP creates proxies for @Transactional, @Cacheable, etc.</pre>
<div class="key-point">Trick: "What's the difference between @Inherited and non-inherited annotations?" — @Inherited means subclass inherits the annotation from parent class (but NOT from interfaces!). Most annotations are NOT inherited. "Can you put annotations on local variables?" — Only with @Target(ElementType.LOCAL_VARIABLE), and only SOURCE retention is useful (runtime reflection can't access local vars).</div>`,
      },
      {
        q: 'What are advanced Enum patterns in Java?',
        difficulty: 'medium',
        a: `<p>Java enums are far more powerful than simple constants — they're full classes that can have fields, methods, and implement interfaces.</p>
<pre>// Strategy pattern with enum:
public enum Operation {
    ADD("+")      { public double apply(double a, double b) { return a + b; } },
    SUBTRACT("-") { public double apply(double a, double b) { return a - b; } },
    MULTIPLY("*") { public double apply(double a, double b) { return a * b; } },
    DIVIDE("/")   { public double apply(double a, double b) { return a / b; } };

    private final String symbol;
    Operation(String symbol) { this.symbol = symbol; }
    public abstract double apply(double a, double b);

    // Usage: Operation.ADD.apply(2, 3) → 5.0
}

// State machine with enum:
public enum OrderStatus {
    PENDING {
        @Override public OrderStatus next() { return CONFIRMED; }
        @Override public boolean canCancel() { return true; }
    },
    CONFIRMED {
        @Override public OrderStatus next() { return SHIPPED; }
        @Override public boolean canCancel() { return true; }
    },
    SHIPPED {
        @Override public OrderStatus next() { return DELIVERED; }
        @Override public boolean canCancel() { return false; }
    },
    DELIVERED {
        @Override public OrderStatus next() { throw new IllegalStateException(); }
        @Override public boolean canCancel() { return false; }
    };

    public abstract OrderStatus next();
    public abstract boolean canCancel();
}

// Enum implementing interface (for DI/strategy):
public interface Discount {
    double apply(double price);
}
public enum MemberTier implements Discount {
    BRONZE { public double apply(double p) { return p * 0.95; } },
    SILVER { public double apply(double p) { return p * 0.90; } },
    GOLD   { public double apply(double p) { return p * 0.80; } };
}

// EnumSet and EnumMap — highly optimized:
EnumSet&lt;Day&gt; weekend = EnumSet.of(Day.SATURDAY, Day.SUNDAY);  // backed by bit vector!
EnumMap&lt;Day, String&gt; schedule = new EnumMap&lt;&gt;(Day.class);      // array-backed, fast</pre>
<p><strong>Enum internals:</strong></p>
<ul>
<li>Each constant is a <code>public static final</code> instance, created once.</li>
<li>Constructor is always private (even without explicit modifier).</li>
<li>Thread-safe singleton by design (class loading guarantees).</li>
<li><code>values()</code> creates a new array every call — cache it if called in hot path.</li>
<li><code>ordinal()</code> — position index. Fragile — don't use for persistence!</li>
</ul>
<div class="key-point">Trick: "Can enum extend a class?" — No! Enums implicitly extend java.lang.Enum. But they CAN implement interfaces. "Is enum Singleton thread-safe?" — Yes! Class loading in JVM is thread-safe. Enum is the recommended singleton implementation (Effective Java Item 3). "What happens if you serialize/deserialize an enum?" — Only the name is serialized. Deserialization calls Enum.valueOf() → same instance. No duplication!</div>`,
      },
      {
        q: 'Explain Spring AOP: how it works internally and common use cases.',
        difficulty: 'hard',
        a: `<p><strong>AOP (Aspect-Oriented Programming)</strong> separates cross-cutting concerns (logging, security, transactions) from business logic.</p>
<pre>// Key AOP terminology:
// Aspect    — the cross-cutting concern module (e.g., LoggingAspect)
// Advice    — the action (before, after, around)
// Pointcut  — WHERE to apply (expression matching methods)
// JoinPoint — the actual method being intercepted
// Weaving   — process of applying aspects (Spring uses RUNTIME weaving via proxies)

@Aspect
@Component
public class PerformanceAspect {

    // Pointcut: all methods in service package
    @Pointcut("execution(* com.example.service.*.*(..))")
    public void serviceMethods() {}

    // Around advice — most powerful, controls method execution
    @Around("serviceMethods()")
    public Object measureTime(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.nanoTime();
        try {
            Object result = pjp.proceed();  // call actual method
            return result;
        } finally {
            long elapsed = System.nanoTime() - start;
            log.info("{}.{} took {} ms",
                pjp.getTarget().getClass().getSimpleName(),
                pjp.getSignature().getName(),
                elapsed / 1_000_000);
        }
    }

    // Before advice
    @Before("@annotation(rateLimit)")  // matches methods with @RateLimit
    public void checkRateLimit(RateLimit rateLimit) {
        // check rate limit...
    }

    // AfterReturning — access return value
    @AfterReturning(pointcut = "serviceMethods()", returning = "result")
    public void logResult(Object result) {
        log.info("Returned: {}", result);
    }

    // AfterThrowing — handle exceptions
    @AfterThrowing(pointcut = "serviceMethods()", throwing = "ex")
    public void logException(Exception ex) {
        log.error("Exception: {}", ex.getMessage());
    }
}</pre>
<p><strong>How Spring AOP works internally:</strong></p>
<pre>// 1. At startup, Spring detects @Aspect beans
// 2. For each bean matching a pointcut, creates a PROXY:
//    - If bean implements interface → JDK Dynamic Proxy
//    - If no interface → CGLIB Proxy (extends class)
// 3. When method is called through proxy:
//    Client → Proxy → Advice Chain → Target Method

// Order of advice execution:
@Around (before proceed) → @Before → METHOD → @AfterReturning → @After → @Around (after proceed)
// On exception:
@Around (before proceed) → @Before → METHOD THROWS → @AfterThrowing → @After → @Around (catch)</pre>
<p><strong>Common pointcut expressions:</strong></p>
<pre>execution(* com.example.service.*.*(..))  // all methods in service package
execution(public * *(..))                  // all public methods
@annotation(com.example.Loggable)         // methods with @Loggable
within(com.example.service.*)              // all methods in classes in package
bean(orderService)                         // all methods on specific bean</pre>
<div class="key-point">Trick: "Why doesn't @Transactional work on private methods or self-invocation?" — Spring AOP is proxy-based. (1) Private methods: CGLIB can't override private methods in subclass. (2) Self-invocation: <code>this.method()</code> bypasses the proxy → no AOP advice applied. Fix: inject self via <code>@Lazy</code>, use <code>AopContext.currentProxy()</code>, or move method to another bean. AspectJ (compile-time weaving) doesn't have this limitation but is more complex to set up.</div>`,
      },
      {
        q: 'How does Spring Boot auto-configuration work under the hood?',
        difficulty: 'hard',
        a: `<p>Spring Boot auto-configuration automatically configures beans based on classpath dependencies, properties, and existing beans.</p>
<pre>// @SpringBootApplication combines:
@SpringBootConfiguration  // = @Configuration
@EnableAutoConfiguration  // triggers auto-configuration
@ComponentScan            // scans current package + sub-packages

// How it works internally:
// 1. @EnableAutoConfiguration imports AutoConfigurationImportSelector
// 2. It reads META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
//    (previously: META-INF/spring.factories)
// 3. Each listed class is a @Configuration class with conditions
// 4. Conditions determine if the config should be applied</pre>
<p><strong>Key conditional annotations:</strong></p>
<pre>@Configuration
@ConditionalOnClass(DataSource.class)           // only if DataSource is on classpath
@ConditionalOnMissingBean(DataSource.class)     // only if user hasn't defined one
@ConditionalOnProperty(name = "spring.datasource.url")  // only if property set
public class DataSourceAutoConfiguration {
    @Bean
    @ConditionalOnMissingBean
    public DataSource dataSource(DataSourceProperties props) {
        return props.initializeDataSourceBuilder().build();
    }
}

// Available conditions:
@ConditionalOnClass / @ConditionalOnMissingClass
@ConditionalOnBean / @ConditionalOnMissingBean
@ConditionalOnProperty
@ConditionalOnWebApplication / @ConditionalOnNotWebApplication
@ConditionalOnExpression("#{...}")  // SpEL expression</pre>
<p><strong>Auto-configuration order and overriding:</strong></p>
<pre>// User-defined beans ALWAYS take priority over auto-configured ones
// (due to @ConditionalOnMissingBean)

// Control auto-config order:
@AutoConfigureAfter(DataSourceAutoConfiguration.class)
@AutoConfigureBefore(JpaAutoConfiguration.class)

// Exclude auto-configurations:
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
// or in application.properties:
spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration

// Debug auto-configuration decisions:
// application.properties: debug=true
// Shows: CONDITIONS EVALUATION REPORT (Positive/Negative matches)</pre>
<p><strong>Creating your own starter:</strong></p>
<pre>// 1. Create auto-configuration module:
//    my-starter-autoconfigure/
//      src/main/java/MyAutoConfiguration.java
//      src/main/resources/META-INF/spring/...AutoConfiguration.imports

// 2. Create starter module (just dependencies):
//    my-starter/
//      pom.xml → depends on my-starter-autoconfigure

// 3. Users just add my-starter dependency → auto-configured!</pre>
<div class="key-point">Trick: "How do you debug why a bean wasn't auto-configured?" — Set <code>debug=true</code> in application.properties → conditions evaluation report shows why each auto-config was or wasn't applied. "What's the loading order?" — User @Configuration > Auto-configuration. Auto-configs are last to load, so user beans always win via @ConditionalOnMissingBean.</div>`,
      },
      {
        q: 'What is the N+1 problem in JPA/Hibernate and how do you solve it?',
        difficulty: 'hard',
        a: `<p>The <strong>N+1 problem</strong>: fetching N entities results in 1 query for the parent + N queries for each child relationship. Devastating for performance.</p>
<pre>// Entity setup:
@Entity
public class Author {
    @Id private Long id;
    private String name;
    @OneToMany(mappedBy = "author", fetch = FetchType.LAZY)
    private List&lt;Book&gt; books;
}

// N+1 problem in action:
List&lt;Author&gt; authors = authorRepo.findAll();  // 1 query: SELECT * FROM author
for (Author a : authors) {
    a.getBooks().size();  // N queries: SELECT * FROM book WHERE author_id = ?
}
// 100 authors → 101 queries! 💀</pre>
<p><strong>Solutions:</strong></p>
<pre>// 1. JOIN FETCH (JPQL) — most common fix
@Query("SELECT a FROM Author a JOIN FETCH a.books")
List&lt;Author&gt; findAllWithBooks();
// 1 query with JOIN — all data loaded at once
// ⚠️ Cartesian product: duplicates if multiple collections

// 2. @EntityGraph — declarative fetching
@EntityGraph(attributePaths = {"books"})
List&lt;Author&gt; findAll();
// Generates LEFT JOIN FETCH

// 3. @BatchSize — batch lazy loading
@OneToMany(mappedBy = "author")
@BatchSize(size = 25)  // loads 25 authors' books in one query
private List&lt;Book&gt; books;
// Instead of N queries → N/25 queries

// 4. Hibernate.initialize() — force loading
Hibernate.initialize(author.getBooks());

// 5. Subselect fetching
@Fetch(FetchMode.SUBSELECT)
private List&lt;Book&gt; books;
// SELECT * FROM book WHERE author_id IN (SELECT id FROM author WHERE ...)

// 6. DTO projection — best performance
@Query("SELECT new com.example.AuthorDTO(a.name, b.title) " +
       "FROM Author a JOIN a.books b")
List&lt;AuthorDTO&gt; findAuthorBookDTOs();
// Only fetches needed columns, no entity management overhead</pre>
<p><strong>Fetch types and pitfalls:</strong></p>
<ul>
<li><code>FetchType.LAZY</code>: loads on access. Default for @OneToMany, @ManyToMany. Can cause LazyInitializationException if session is closed.</li>
<li><code>FetchType.EAGER</code>: loads immediately with parent. Seems easy but causes N+1 on EVERY query (even when you don't need the relationship)!</li>
</ul>
<pre>// LazyInitializationException fix options:
// 1. Use JOIN FETCH in the query
// 2. @Transactional on the service method (keeps session open)
// 3. spring.jpa.open-in-view=true (default but controversial — keeps session for entire request)
// 4. DTO projection (no lazy loading needed)</pre>
<div class="key-point">Trick: "Should I use EAGER fetching to avoid N+1?" — NO! EAGER is almost always wrong for collections. It loads data even when not needed, causes Cartesian product with multiple eager collections, and makes the N+1 problem WORSE (hidden). Use LAZY + explicit fetch strategy per query. Always enable <code>spring.jpa.show-sql=true</code> during development to detect N+1 problems early.</div>`,
      },
      {
        q: 'What is the Java Module System (JPMS) introduced in Java 9?',
        difficulty: 'medium',
        a: `<p>The <strong>Java Platform Module System</strong> (Project Jigsaw) adds strong encapsulation and explicit dependencies between modules.</p>
<pre>// module-info.java (placed at root of source tree):
module com.example.myapp {
    requires java.sql;                    // dependency on java.sql module
    requires transitive com.example.lib;  // transitive: my consumers also get this
    requires static lombok;               // optional compile-time only dependency

    exports com.example.myapp.api;        // public API — accessible to other modules
    exports com.example.myapp.spi to com.example.plugin;  // restricted export

    opens com.example.myapp.model to com.fasterxml.jackson.databind;  // reflection access
    // 'opens' allows deep reflection (needed for frameworks like Jackson, JPA)

    provides com.example.spi.Plugin with com.example.myapp.MyPlugin;  // service provider
    uses com.example.spi.Plugin;          // service consumer
}</pre>
<p><strong>Key concepts:</strong></p>
<ul>
<li><strong>exports</strong>: makes package accessible to other modules (compile-time + runtime).</li>
<li><strong>opens</strong>: allows reflection access (runtime only). Required for frameworks that use reflection.</li>
<li><strong>requires</strong>: declares dependency. Module won't compile/run without it.</li>
<li><strong>requires transitive</strong>: dependency is also available to consumers of your module.</li>
<li><strong>provides/uses</strong>: ServiceLoader API integration.</li>
</ul>
<p><strong>Practical impact:</strong></p>
<pre>// Before JPMS: everything on classpath was accessible (even internal APIs)
sun.misc.Unsafe.getUnsafe();  // worked in Java 8

// After JPMS: internal APIs are encapsulated
// java.base doesn't export sun.misc → IllegalAccessError

// Quick fix flags (not recommended for production):
--add-opens java.base/sun.misc=ALL-UNNAMED
--add-exports java.base/sun.misc=ALL-UNNAMED

// Automatic modules: JARs without module-info on module path
// get automatic module name from JAR filename or Automatic-Module-Name manifest entry</pre>
<p><strong>Why it matters in practice:</strong></p>
<ul>
<li>JDK itself is modularized (~70 modules). Can create minimal JRE with <code>jlink</code>.</li>
<li>Libraries must explicitly open packages for reflection (affects Spring, Hibernate).</li>
<li>Classpath still works (unnamed module) — backward compatible.</li>
</ul>
<div class="key-point">Trick: "Do you use modules in your project?" — Most enterprise apps still use classpath (unnamed module) because library ecosystem support is incomplete. But understanding JPMS is critical for: (1) fixing "module X does not export Y" errors, (2) understanding <code>--add-opens</code> flags, (3) building minimal Docker images with jlink. Spring Framework 6+ and Spring Boot 3+ are fully JPMS-compatible.</div>`,
      },
      {
        q: 'What are common concurrency utilities in java.util.concurrent?',
        difficulty: 'hard',
        a: `<p>The <code>java.util.concurrent</code> package provides high-level concurrency tools beyond basic synchronized/wait/notify.</p>
<pre>// 1. CountDownLatch — wait for N events to complete
CountDownLatch latch = new CountDownLatch(3);  // count = 3
// Worker threads:
executor.submit(() -> { doWork(); latch.countDown(); });  // count: 3→2
executor.submit(() -> { doWork(); latch.countDown(); });  // count: 2→1
executor.submit(() -> { doWork(); latch.countDown(); });  // count: 1→0
latch.await();  // main thread blocks until count reaches 0
// Cannot be reused! One-shot only.

// 2. CyclicBarrier — threads wait for each other (reusable)
CyclicBarrier barrier = new CyclicBarrier(3, () -> System.out.println("All arrived!"));
// Each thread: barrier.await(); → blocks until all 3 threads call await()
// Then all proceed simultaneously. CAN be reused (cyclic).

// 3. Semaphore — limit concurrent access (rate limiting, connection pool)
Semaphore semaphore = new Semaphore(5);  // max 5 concurrent permits
semaphore.acquire();  // blocks if no permit available
try {
    accessLimitedResource();
} finally {
    semaphore.release();
}

// 4. Phaser — flexible barrier (dynamic parties, phases)
Phaser phaser = new Phaser(3);          // 3 parties
phaser.arriveAndAwaitAdvance();         // wait for all parties at current phase
phaser.register();                      // dynamically add party
phaser.arriveAndDeregister();           // leave

// 5. Exchanger — two threads exchange objects
Exchanger&lt;String&gt; exchanger = new Exchanger&lt;&gt;();
// Thread A: String fromB = exchanger.exchange("dataFromA");
// Thread B: String fromA = exchanger.exchange("dataFromB");

// 6. StampedLock (Java 8) — optimistic read locking
StampedLock lock = new StampedLock();
long stamp = lock.tryOptimisticRead();       // no locking! just get stamp
int x = this.x; int y = this.y;             // read fields
if (!lock.validate(stamp)) {                 // check if write occurred
    stamp = lock.readLock();                 // fallback to pessimistic read
    try { x = this.x; y = this.y; }
    finally { lock.unlockRead(stamp); }
}
// Much faster than ReadWriteLock for read-heavy workloads

// 7. Atomic classes — lock-free thread safety
AtomicInteger count = new AtomicInteger(0);
count.incrementAndGet();                     // atomic i++
count.compareAndSet(expected, newValue);     // CAS operation
AtomicReference&lt;Node&gt; head = new AtomicReference&lt;&gt;();
// LongAdder — better than AtomicLong for high-contention counters
LongAdder adder = new LongAdder();
adder.increment(); adder.sum();</pre>
<table><tr><th>Tool</th><th>Use Case</th><th>Reusable?</th></tr>
<tr><td>CountDownLatch</td><td>Wait for N tasks to finish</td><td>No</td></tr>
<tr><td>CyclicBarrier</td><td>Threads synchronize at a point</td><td>Yes</td></tr>
<tr><td>Semaphore</td><td>Limit concurrent access</td><td>Yes</td></tr>
<tr><td>Phaser</td><td>Multi-phase synchronization</td><td>Yes</td></tr>
<tr><td>StampedLock</td><td>Optimistic reads</td><td>Yes</td></tr></table>
<div class="key-point">Trick: "CountDownLatch vs CyclicBarrier?" — Latch: one-shot, N threads count down and one/many threads await. Barrier: reusable, N threads wait for each other then proceed together. "When to use LongAdder over AtomicLong?" — When many threads frequently update the counter (high contention). LongAdder uses striping (multiple cells) to reduce CAS failures. Sum is only guaranteed accurate when no concurrent updates.</div>`,
      },
      {
        q: 'Explain Spring Boot exception handling: @ControllerAdvice and error responses.',
        difficulty: 'medium',
        a: `<p>Spring Boot provides layered exception handling for clean error responses without try-catch in every controller.</p>
<pre>// Global exception handler:
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle specific exception
    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(ResourceNotFoundException ex, WebRequest request) {
        return new ErrorResponse(
            LocalDateTime.now(),
            HttpStatus.NOT_FOUND.value(),
            "Not Found",
            ex.getMessage(),
            request.getDescription(false)
        );
    }

    // Handle validation errors (from @Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidation(MethodArgumentNotValidException ex) {
        Map&lt;String, String&gt; errors = ex.getBindingResult().getFieldErrors().stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                FieldError::getDefaultMessage,
                (a, b) -> a  // merge function for duplicate keys
            ));
        return new ErrorResponse(400, "Validation Failed", errors);
    }

    // Handle all other exceptions (fallback)
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleAll(Exception ex) {
        log.error("Unhandled exception", ex);
        return new ErrorResponse(500, "Internal Server Error", "An unexpected error occurred");
        // Never expose stack traces to client in production!
    }
}

// Custom exception with HTTP status:
@ResponseStatus(HttpStatus.NOT_FOUND)  // auto-maps to 404
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, Long id) {
        super(resource + " not found with id: " + id);
    }
}

// Error response DTO:
public record ErrorResponse(
    LocalDateTime timestamp,
    int status,
    String error,
    Object message,
    String path
) {}</pre>
<p><strong>Exception handling priority order:</strong></p>
<ol>
<li><code>@ExceptionHandler</code> in the same controller</li>
<li><code>@ExceptionHandler</code> in <code>@ControllerAdvice</code></li>
<li>Spring's default error handling (BasicErrorController)</li>
</ol>
<p><strong>Spring Boot 3+ Problem Details (RFC 7807):</strong></p>
<pre>// Enable in application.properties:
spring.mvc.problemdetails.enabled=true

// Produces standard format:
{
  "type": "https://example.com/errors/not-found",
  "title": "Not Found",
  "status": 404,
  "detail": "User not found with id: 42",
  "instance": "/api/users/42"
}</pre>
<div class="key-point">Trick: "What's the difference between @ControllerAdvice and @RestControllerAdvice?" — @RestControllerAdvice = @ControllerAdvice + @ResponseBody (returns JSON by default). "Should you use checked or unchecked exceptions in Spring?" — Unchecked (RuntimeException) is preferred: Spring @Transactional only rolls back on unchecked exceptions by default. For checked exceptions, use rollbackFor attribute.</div>`,
      },
      {
        q: 'What is the difference between Spring MVC request processing lifecycle?',
        difficulty: 'medium',
        a: `<p>Understanding the full request lifecycle helps debug issues and implement custom interceptors/filters.</p>
<pre>// Full request processing pipeline:

Client Request
    ↓
[Servlet Container (Tomcat)]
    ↓
[Filter Chain] → SecurityFilter → CorsFilter → ... → DispatcherServlet
    ↓
[DispatcherServlet] (Front Controller pattern)
    ↓
[HandlerMapping] → finds which controller/method handles the URL
    ↓
[HandlerInterceptor.preHandle()] → logging, auth checks, etc.
    ↓
[HandlerAdapter] → invokes the controller method
    ↓
[ArgumentResolvers] → @RequestBody, @PathVariable, @RequestParam → method params
    ↓
[Controller Method] → business logic → returns ResponseEntity / object
    ↓
[ReturnValueHandlers] → converts return value
    ↓
[HttpMessageConverter] → object → JSON (Jackson) / XML
    ↓
[HandlerInterceptor.postHandle()]
    ↓
[HandlerInterceptor.afterCompletion()]
    ↓
Response to Client</pre>
<p><strong>Filter vs Interceptor vs AOP:</strong></p>
<table><tr><th>Aspect</th><th>Filter</th><th>Interceptor</th><th>AOP</th></tr>
<tr><td>Level</td><td>Servlet (before Spring)</td><td>Spring MVC</td><td>Method-level</td></tr>
<tr><td>Access to</td><td>Request/Response only</td><td>Handler + ModelAndView</td><td>Method args + return</td></tr>
<tr><td>Use case</td><td>Security, CORS, compression</td><td>Logging, locale, auth</td><td>Transactions, caching</td></tr>
<tr><td>Interface</td><td>javax.servlet.Filter</td><td>HandlerInterceptor</td><td>@Aspect</td></tr></table>
<pre>// Custom Interceptor:
@Component
public class RequestTimingInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res,
                            Object handler) {
        req.setAttribute("startTime", System.nanoTime());
        return true;  // true = continue, false = abort
    }
    @Override
    public void afterCompletion(HttpServletRequest req, HttpServletResponse res,
                               Object handler, Exception ex) {
        long start = (Long) req.getAttribute("startTime");
        log.info("{} {} took {}ms", req.getMethod(), req.getRequestURI(),
                (System.nanoTime() - start) / 1_000_000);
    }
}

// Register interceptor:
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new RequestTimingInterceptor())
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/health");
    }
}</pre>
<div class="key-point">Trick: "Filter vs Interceptor — when to use which?" — Filters work at servlet level (before Spring MVC, can modify raw request/response). Interceptors work at Spring MVC level (have access to handler method info). Use Filter for: security (Spring Security), CORS, request wrapping. Use Interceptor for: logging, authorization checks that need handler info, locale/theme resolution.</div>`,
      },
      {
        q: 'What are the key differences between Spring Framework 5/6 and common migration issues?',
        difficulty: 'hard',
        a: `<p>Understanding Spring evolution is crucial for senior developers working on migrations and architecture decisions.</p>
<p><strong>Spring 5 → Spring 6 / Spring Boot 2 → Boot 3 major changes:</strong></p>
<ul>
<li><strong>Jakarta EE</strong>: <code>javax.*</code> → <code>jakarta.*</code> (biggest migration pain point!)</li>
<li><strong>Java baseline</strong>: Spring 6 requires Java 17+.</li>
<li><strong>Native compilation</strong>: GraalVM native image support (AOT compilation).</li>
<li><strong>Observability</strong>: Micrometer Observation API replaces custom metrics.</li>
<li><strong>HTTP Client</strong>: RestTemplate → WebClient (reactive) → RestClient (Spring 6.1, blocking).</li>
<li><strong>Security</strong>: <code>WebSecurityConfigurerAdapter</code> removed → use SecurityFilterChain bean.</li>
</ul>
<pre>// Spring Security migration:
// OLD (Boot 2):
@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
            .antMatchers("/api/**").authenticated();
    }
}

// NEW (Boot 3):
@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/**").authenticated()
        );
        return http.build();
    }
}

// Jakarta namespace change:
// javax.servlet.* → jakarta.servlet.*
// javax.persistence.* → jakarta.persistence.*
// javax.validation.* → jakarta.validation.*
// javax.annotation.* → jakarta.annotation.*</pre>
<p><strong>Spring WebFlux (Reactive) vs Spring MVC:</strong></p>
<pre>// Spring MVC: thread-per-request, blocking (simple, familiar)
@GetMapping("/users/{id}")
public User getUser(@PathVariable Long id) {
    return userService.findById(id);  // blocks thread until DB responds
}

// Spring WebFlux: event-loop, non-blocking (scalable, complex)
@GetMapping("/users/{id}")
public Mono&lt;User&gt; getUser(@PathVariable Long id) {
    return userService.findById(id);  // returns immediately, data flows later
}
// Mono = 0 or 1 element, Flux = 0 to N elements

// When to use WebFlux:
// - High concurrency with I/O-bound operations (10K+ concurrent connections)
// - Streaming data (SSE, WebSocket)
// - Microservice gateway (Spring Cloud Gateway uses WebFlux)
// When NOT to use: blocking dependencies (JDBC), simple CRUD, team unfamiliar with reactive</pre>
<div class="key-point">Trick: "Should you migrate to WebFlux?" — Probably not for most apps. Spring MVC + Virtual Threads (Java 21) gives you similar scalability with simpler code. WebFlux is best for: streaming, high-concurrency gateways, and when your entire stack is non-blocking (R2DBC, reactive Redis, etc.). "What's the biggest Boot 3 migration issue?" — javax→jakarta namespace change. Use OpenRewrite automated refactoring tool.</div>`,
      },
      {
        q: 'What are microservice design patterns: Circuit Breaker, Saga, and CQRS?',
        difficulty: 'hard',
        a: `<p>Essential patterns for distributed systems — frequently asked in senior/architect interviews.</p>
<p><strong>1. Circuit Breaker (Resilience4j / Netflix Hystrix):</strong></p>
<pre>// Problem: Service B is down. Service A keeps calling → cascading failure.
// Solution: Circuit Breaker monitors failures and "trips" to prevent calls.

// States: CLOSED → OPEN → HALF_OPEN
// CLOSED:    requests pass through, failures counted
// OPEN:      requests fail FAST (no actual call), after timeout → HALF_OPEN
// HALF_OPEN: limited test requests; if success → CLOSED, if fail → OPEN

@CircuitBreaker(name = "userService", fallbackMethod = "getUserFallback")
public User getUser(Long id) {
    return userServiceClient.getUser(id);  // may fail
}
public User getUserFallback(Long id, Exception ex) {
    return new User(id, "Unknown", "Service unavailable");  // graceful degradation
}

// Resilience4j config:
resilience4j.circuitbreaker:
  instances:
    userService:
      failureRateThreshold: 50        # trip when 50% of calls fail
      waitDurationInOpenState: 60s    # wait before trying again
      slidingWindowSize: 10           # evaluate last 10 calls</pre>
<p><strong>2. Saga Pattern (distributed transactions):</strong></p>
<pre>// Problem: Order spans multiple services (Order, Payment, Inventory).
// Can't use single @Transactional across services!

// Choreography Saga (event-driven):
OrderService → publishes "OrderCreated" event
PaymentService → listens, charges card, publishes "PaymentCompleted"
InventoryService → listens, reserves stock, publishes "StockReserved"
// If any step fails → publish compensating events to rollback

// Orchestration Saga (central coordinator):
SagaOrchestrator:
  Step 1: createOrder() → success → Step 2
  Step 2: chargePayment() → success → Step 3
  Step 3: reserveStock() → FAIL → compensate:
    → refundPayment()
    → cancelOrder()

// Each service has:
// - Action: the forward operation
// - Compensation: the rollback operation (must be idempotent!)</pre>
<p><strong>3. CQRS (Command Query Responsibility Segregation):</strong></p>
<pre>// Problem: Read and write models have different needs.
// Reads need: fast queries, denormalized data, complex joins.
// Writes need: validation, consistency, normalized data.

// Solution: Separate read and write models.
Command Side (Write):              Query Side (Read):
┌─────────────────┐               ┌──────────────────┐
│ Command Handler │               │  Query Handler   │
│ (validation,    │               │  (simple reads,  │
│  business rules)│               │   optimized)     │
│       ↓         │               │       ↓          │
│ Write Database  │──events──→    │ Read Database    │
│ (normalized)    │               │ (denormalized,   │
└─────────────────┘               │  materialized    │
                                  │  views)          │
                                  └──────────────────┘

// Often combined with Event Sourcing:
// Instead of storing current state, store all events:
// OrderCreated → ItemAdded → ItemRemoved → OrderConfirmed
// Rebuild state by replaying events.</pre>
<p><strong>Other essential patterns:</strong></p>
<ul>
<li><strong>API Gateway</strong>: single entry point, routing, auth, rate limiting (Spring Cloud Gateway).</li>
<li><strong>Service Discovery</strong>: services register/find each other (Eureka, Consul, K8s DNS).</li>
<li><strong>Bulkhead</strong>: isolate failures to prevent cascading (separate thread pools per dependency).</li>
<li><strong>Event-Driven</strong>: async communication via message broker (Kafka, RabbitMQ).</li>
<li><strong>Outbox Pattern</strong>: reliable event publishing (write event to DB table → CDC → message broker).</li>
</ul>
<div class="key-point">Trick: "When NOT to use microservices?" — Small teams, simple domains, early-stage products. Start monolith, extract services at boundaries when scaling demands it. "What's the difference between Saga choreography vs orchestration?" — Choreography: decoupled, no single point of failure, but hard to track/debug. Orchestration: easier to understand and debug, but orchestrator is a single point of failure. Choose based on complexity.</div>`,
      },
      {
        q: 'What is the difference between optimistic and pessimistic locking in JPA/databases?',
        difficulty: 'hard',
        a: `<p>Concurrency control strategies for preventing lost updates when multiple transactions modify the same data.</p>
<pre>// OPTIMISTIC LOCKING — "hope for the best, detect conflicts"
// Uses a version column. No DB locks held during read.
@Entity
public class Product {
    @Id private Long id;
    private String name;
    private int quantity;
    @Version private int version;  // incremented on each update
}

// How it works:
// TX1: reads Product (version=1)
// TX2: reads Product (version=1)
// TX1: updates quantity, version=2 → SUCCESS
// TX2: updates quantity, version=2 → FAIL! OptimisticLockException
//      (because version is now 2, not 1 as TX2 expected)

// SQL generated:
// UPDATE product SET quantity=?, version=2 WHERE id=? AND version=1
// If 0 rows updated → version mismatch → throw exception

// Handle the exception:
try {
    productRepo.save(product);
} catch (OptimisticLockingFailureException ex) {
    // Retry: re-read, re-apply changes, save again
    Product fresh = productRepo.findById(product.getId()).get();
    fresh.setQuantity(fresh.getQuantity() - orderQty);
    productRepo.save(fresh);
}

// PESSIMISTIC LOCKING — "lock first, then work"
// Acquires DB lock immediately. Other transactions must wait.
@Query("SELECT p FROM Product p WHERE p.id = :id")
@Lock(LockModeType.PESSIMISTIC_WRITE)  // SELECT ... FOR UPDATE
Optional&lt;Product&gt; findByIdForUpdate(@Param("id") Long id);

// Lock modes:
// PESSIMISTIC_READ:  shared lock (others can read, not write)
// PESSIMISTIC_WRITE: exclusive lock (others can't read or write)
// PESSIMISTIC_FORCE_INCREMENT: exclusive lock + increment version</pre>
<table><tr><th>Aspect</th><th>Optimistic</th><th>Pessimistic</th></tr>
<tr><td>Lock held</td><td>None during read</td><td>DB lock from read until commit</td></tr>
<tr><td>Conflict detection</td><td>At commit time</td><td>At read time (waits/blocks)</td></tr>
<tr><td>Best for</td><td>Low contention, read-heavy</td><td>High contention, short TXs</td></tr>
<tr><td>Scalability</td><td>High (no locks)</td><td>Lower (locks block others)</td></tr>
<tr><td>Failure mode</td><td>Exception → retry</td><td>Timeout → deadlock possible</td></tr>
<tr><td>Use case</td><td>Web forms, REST APIs</td><td>Inventory, financial transfers</td></tr></table>
<div class="key-point">Trick: "Which locking do you use by default?" — Optimistic. It scales better and most web apps have low write contention. Use pessimistic only for critical operations like financial transfers or inventory where you MUST guarantee consistency and can't afford retry logic. "Does @Version work with native queries?" — No! Native queries bypass JPA versioning. You must manually add <code>WHERE version = ?</code> and check affected rows.</div>`,
      },
      {
        q: 'What are Java best practices for writing production-quality code?',
        difficulty: 'medium',
        a: `<p>Senior developers are expected to write code that is maintainable, performant, and production-ready.</p>
<p><strong>Effective Java key items (Joshua Bloch):</strong></p>
<pre>// 1. Use static factory methods instead of constructors
public static Optional&lt;User&gt; of(String name) { }  // descriptive name, can return subtypes

// 2. Use builders for many parameters
User user = User.builder().name("John").age(30).email("j@x.com").build();

// 3. Enforce immutability
public record Point(int x, int y) {}  // or: final class, final fields, no setters

// 4. Prefer composition over inheritance
class Stack&lt;E&gt; {
    private final List&lt;E&gt; list = new ArrayList&lt;&gt;();  // composition, not extends ArrayList
}

// 5. Use interfaces for types, not classes
List&lt;String&gt; list = new ArrayList&lt;&gt;();  // program to interface
// NOT: ArrayList&lt;String&gt; list = new ArrayList&lt;&gt;();

// 6. Return empty collections, not null
public List&lt;User&gt; findUsers() {
    return users != null ? users : Collections.emptyList();
}

// 7. Use try-with-resources for ALL AutoCloseable resources
// 8. Prefer Optionals over null returns for methods that might not have a value
// 9. Minimize mutability — make fields final unless there's a reason not to</pre>
<p><strong>Performance best practices:</strong></p>
<pre>// String concatenation in loops — use StringBuilder
StringBuilder sb = new StringBuilder(estimatedSize);
for (String s : list) { sb.append(s); }

// Collection sizing — preallocate
new ArrayList&lt;&gt;(expectedSize);
new HashMap&lt;&gt;(expectedSize * 4 / 3 + 1);  // avoid resizing

// Avoid boxing/unboxing in hot loops
IntStream.range(0, n)...  // not Stream&lt;Integer&gt;

// Use appropriate collection
EnumMap/EnumSet for enum keys (array-backed, fastest)
ArrayDeque for stack/queue (not Stack/LinkedList)

// Database: batch operations, pagination, connection pooling
// Lazy initialization only when construction is expensive AND often not needed</pre>
<p><strong>Error handling practices:</strong></p>
<pre>// 1. Catch specific exceptions, not Exception/Throwable
// 2. Don't swallow exceptions silently
catch (IOException e) {
    log.error("Failed to read file: {}", path, e);  // log WITH stack trace
    throw new ServiceException("File read failed", e);  // wrap and rethrow
}

// 3. Use custom exceptions for business logic
public class InsufficientFundsException extends RuntimeException { }

// 4. Validate at system boundaries (API endpoints, deserialization)
// 5. Use @Valid + Bean Validation for input validation
// 6. Never expose internal errors to clients (stack traces, SQL, etc.)</pre>
<div class="key-point">Trick interview questions: "What's wrong with returning null?" — Forces every caller to null-check, NPE if they forget. Use Optional, empty collections, or Null Object pattern. "Is creating exceptions expensive?" — Yes! <code>fillInStackTrace()</code> is costly. For control flow exceptions (expected cases), consider pre-created exceptions with no stack trace: <code>throw PREBUILT_EXCEPTION;</code> or override <code>fillInStackTrace()</code> to return <code>this</code>.</div>`,
      },
      {
        q: 'What are the key Java 17 to 21 features that matter for production?',
        difficulty: 'medium',
        a: `<p>Modern Java features that are actively used in production (beyond the basics covered earlier).</p>
<p><strong>Java 17 (LTS) features:</strong></p>
<pre>// Sealed classes (covered separately)
// Pattern matching for instanceof (covered separately)

// Enhanced pseudo-random number generators:
RandomGenerator rng = RandomGeneratorFactory.of("L64X128MixRandom").create();

// Deprecations: Security Manager, Applet API, RMI Activation</pre>
<p><strong>Java 21 (LTS) features:</strong></p>
<pre>// 1. Virtual Threads (covered separately) — game changer for I/O apps

// 2. Sequenced Collections — finally! first/last access for all ordered collections
SequencedCollection&lt;String&gt; list = new ArrayList&lt;&gt;(List.of("a", "b", "c"));
list.getFirst();           // "a"
list.getLast();            // "c"
list.reversed();           // reversed view: ["c", "b", "a"]
// Also: SequencedSet, SequencedMap (pollFirstEntry, pollLastEntry)

// 3. Record Patterns (destructuring):
record Point(int x, int y) {}
if (obj instanceof Point(int x, int y)) {
    System.out.println(x + ", " + y);  // destructured!
}
// In switch:
switch (shape) {
    case Circle(Point(var x, var y), var r) -> drawCircle(x, y, r);
}

// 4. Pattern matching for switch (finalized):
String format(Object obj) {
    return switch (obj) {
        case Integer i when i > 0 -> "positive: " + i;
        case Integer i            -> "non-positive: " + i;
        case String s             -> "string: " + s;
        case null                 -> "null";
        default                   -> "other: " + obj;
    };
}

// 5. String templates (Preview in 21, refined in later versions):
String name = "World";
// String msg = STR."Hello \\{name}!";  // "Hello World!"

// 6. Scoped Values (Preview) — replacement for ThreadLocal with Virtual Threads:
ScopedValue&lt;User&gt; CURRENT_USER = ScopedValue.newInstance();
ScopedValue.where(CURRENT_USER, user).run(() -> {
    // CURRENT_USER.get() available here
    // automatically cleaned up, no leaks!
});

// 7. Structured Concurrency (Preview):
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    Subtask&lt;User&gt; user = scope.fork(() -> findUser(id));
    Subtask&lt;Order&gt; order = scope.fork(() -> findOrder(id));
    scope.join();           // wait for both
    scope.throwIfFailed();  // propagate exceptions
    return new Response(user.get(), order.get());
}
// If one fails, the other is automatically cancelled!</pre>
<p><strong>Migration path recommendation:</strong></p>
<pre>// Java 8 → 11 → 17 → 21 (LTS to LTS)
// Key breaking changes per version:
// 8→9:   Module system, internal API encapsulation
// 9→11:  var, HTTP client, String methods, removed Java EE modules
// 11→17: Sealed classes, records, pattern matching (instanceof)
// 17→21: Virtual threads, sequenced collections, pattern matching (switch)</pre>
<div class="key-point">Trick: "Which Java version should a new project use?" — Java 21 (latest LTS). It has virtual threads, modern syntax, and 3+ years of support. "What's the biggest benefit of upgrading?" — Virtual threads (Java 21) can replace reactive frameworks for I/O-heavy apps with much simpler code. Performance also improves ~5-10% per major version due to JIT improvements.</div>`,
      },
      {
        q: 'What breaks when you violate the equals/hashCode contract? (mutable HashMap keys)',
        difficulty: 'tricky',
        a: `<p>Two classic production bugs, both silent:</p>
<pre>// Bug 1: equals overridden, hashCode NOT overridden
class Point {
    int x, y;
    @Override public boolean equals(Object o) { /* compares x,y */ }
    // hashCode() still from Object → identity-based!
}
Set&lt;Point&gt; set = new HashSet&lt;&gt;();
set.add(new Point(1, 2));
set.contains(new Point(1, 2));   // FALSE — equal objects, different buckets
// HashSet/HashMap locate the bucket by hashCode FIRST, equals second.

// Bug 2: mutating an object AFTER using it as a key
Map&lt;Point, String&gt; map = new HashMap&lt;&gt;();
Point p = new Point(1, 2);
map.put(p, "home");
p.x = 99;                        // hashCode changes → wrong bucket now
map.get(p);                      // null! (searches the NEW bucket)
map.containsKey(p);              // false — yet map.size() == 1
// The entry is unreachable: can't get it, can't remove it → memory leak.</pre>
<ul>
<li><strong>Rules</strong>: override both together; compute both from the <strong>same fields</strong>; keys must be immutable (or at least never mutated while in the map).</li>
<li><strong>Easy correctness</strong>: <code>record Point(int x, int y)</code> — generated equals/hashCode, immutable by design. Or IDE/Lombok generation with <code>Objects.hash(...)</code>.</li>
<li>Same rule applies to entities in <code>HashSet</code> before JPA assigns the ID — hashCode based on a generated ID changes on persist.</li>
</ul>
<div class="key-point">Interview one-liner: "hashCode finds the bucket, equals confirms the match — break either and hash collections lie to you." The unreachable-entry leak is the senior-level detail most candidates miss.</div>`,
      },
      {
        q: 'How do you troubleshoot a production JVM: high CPU, OutOfMemoryError, hangs?',
        difficulty: 'hard',
        a: `<p><strong>High CPU</strong> — find the hot thread, then the hot code:</p>
<pre>top -H -p &lt;pid&gt;                   # 1. which THREAD burns CPU (Linux: thread id)
printf '%x\\n' &lt;tid&gt;              # 2. thread id → hex
jstack &lt;pid&gt; | grep -A20 nid=0x&lt;hex&gt;   # 3. its stack trace in the thread dump
# Repeat 3× a few seconds apart — the frames that stay are the hot path.
# Deeper: async-profiler → flame graph (safepoint-free, production-safe)</pre>
<p><strong>OutOfMemoryError</strong> — know the flavors, capture the evidence:</p>
<pre># Always run production with:
-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/dumps

# Java heap space      → leak or undersized heap: analyze dump in Eclipse MAT
#                         (Dominator tree → "who retains the memory?")
# GC overhead limit    → heap almost full, GC thrashing — same analysis
# Metaspace            → classloader leak (hot redeploys, dynamic proxies)
# Direct buffer memory → NIO/Netty off-heap: -XX:MaxDirectMemorySize
# unable to create native thread → too many platform threads → pool/virtual threads

jcmd &lt;pid&gt; GC.heap_info           # quick look without a dump
jmap -histo:live &lt;pid&gt; | head     # top classes by instance count</pre>
<p><strong>Hang / deadlock</strong>:</p>
<pre>jstack &lt;pid&gt;                      # prints "Found one Java-level deadlock" if any
jcmd &lt;pid&gt; Thread.print           # same, jcmd is the modern entry point
# Many threads BLOCKED on one monitor → lock contention, not deadlock
# Threads in WAITING on pool queues → upstream slowness (DB, HTTP)</pre>
<div class="key-point">The senior signal is a <strong>workflow</strong>, not tool names: reproduce → capture (thread/heap dump, GC logs <code>-Xlog:gc*</code>) → analyze → fix → verify with the same measurement. Guessing flags without evidence is the anti-pattern.</div>`,
      },
      {
        q: 'What is the output? Integer a = 127, b = 127; a == b — Integer caching and autoboxing traps',
        difficulty: 'tricky',
        a: `<p>The most famous Java trick question. <code>Integer.valueOf()</code> caches values from <strong>-128 to 127</strong>, so small boxed integers are the SAME object.</p>
<pre>Integer a = 127, b = 127;
a == b;                    // true  — both from IntegerCache (same object)

Integer c = 128, d = 128;
c == d;                    // false — two different objects on the heap!
c.equals(d);               // true  — always compare wrappers with equals()

Integer e = 1000; int f = 1000;
e == f;                    // true  — mixed Integer/int → e is UNBOXED, numeric compare

// NPE traps with autoboxing:
Map&lt;String, Integer&gt; map = new HashMap&lt;&gt;();
int count = map.get("missing");   // NullPointerException! (null unboxed)

Integer i = null;
Integer r = true ? i : 0;         // NullPointerException!
// mixed Integer/int operands → ternary result type is int → i.intValue() → NPE</pre>
<div class="key-point">Cache exists for <code>Integer/Short/Byte/Long</code> (-128..127), <code>Character</code> (0..127), <code>Boolean</code>. Upper bound is tunable via <code>-XX:AutoBoxCacheMax</code> — which is why "it works with 127 but not 128" is the interviewer's favorite follow-up. Rule: NEVER use <code>==</code> on wrapper types.</div>`,
      },
      {
        q: 'Is Java pass-by-value or pass-by-reference? Prove it.',
        difficulty: 'tricky',
        a: `<p>Java is <strong>ALWAYS pass-by-value</strong>. For objects, the value passed is a <strong>copy of the reference</strong> — not the object, and not a true "reference" in the C++ sense.</p>
<pre>class Person { String name; Person(String n) { name = n; } }

void change(Person p) {
  p.name = "Changed";        // ✅ affects caller — p points to the SAME object
  p = new Person("New");     // ❌ only reassigns the LOCAL copy of the reference
  p.name = "Never seen";     // caller never sees this object
}

Person person = new Person("Original");
change(person);
System.out.println(person.name);  // "Changed" — mutation visible, reassignment not

// The classic proof — swap does NOT work in Java:
void swap(Person a, Person b) {
  Person tmp = a; a = b; b = tmp;  // swaps local copies only
}</pre>
<div class="key-point">Interview phrasing that wins: "Java passes <strong>object references by value</strong>." You can <em>mutate</em> the object a parameter points to, but you can never <em>reassign</em> the caller's variable. If Java were pass-by-reference, <code>swap()</code> would work — it doesn't.</div>`,
      },
      {
        q: 'Can finally override a return value or swallow an exception? What is the output?',
        difficulty: 'tricky',
        a: `<pre>// 1. return in finally OVERRIDES the try's return — and swallows exceptions!
int test1() {
  try {
    throw new RuntimeException("lost forever");
  } finally {
    return 2;               // returns 2, exception silently DISAPPEARS
  }
}

// 2. finally can NOT change an already-computed primitive return value
int test2() {
  int x = 1;
  try {
    return x;               // value 1 is saved to the operand stack HERE
  } finally {
    x = 99;                 // too late — does not affect the return
  }
}                           // returns 1

// 3. ...but it CAN mutate a returned OBJECT (same reference)
StringBuilder test3() {
  StringBuilder sb = new StringBuilder("a");
  try {
    return sb;              // the REFERENCE is saved
  } finally {
    sb.append("b");         // mutates the same object
  }
}                           // returns "ab"

// 4. When finally does NOT run:
System.exit(0);             // JVM terminates — finally skipped
// also: JVM crash, kill -9, infinite loop in try, daemon thread death</pre>
<div class="key-point"><code>return</code>/<code>throw</code> inside <code>finally</code> discards any pending exception or return value from <code>try</code>/<code>catch</code> — a notorious bug source, and flagged by every linter. Rule: never exit from a <code>finally</code> block.</div>`,
      },
      {
        q: 'What is type erasure? Why can you not overload List<String> vs List<Integer>?',
        difficulty: 'tricky',
        a: `<p>Generics exist only at <strong>compile time</strong>. The compiler erases them to raw types (bounds or <code>Object</code>) for backward compatibility with pre-Java-5 bytecode.</p>
<pre>// ❌ Compile error: both erase to print(List) — same signature!
void print(List&lt;String&gt; list) { }
void print(List&lt;Integer&gt; list) { }

List&lt;String&gt; a = new ArrayList&lt;&gt;();
List&lt;Integer&gt; b = new ArrayList&lt;&gt;();
a.getClass() == b.getClass();      // true — both ArrayList at runtime!

// Consequences of erasure:
if (x instanceof List&lt;String&gt;) { } // ❌ illegal — type gone at runtime
T t = new T();                     // ❌ can't instantiate a type parameter
T[] arr = new T[10];               // ❌ can't create generic arrays

// Arrays are COVARIANT (unsafe), generics are INVARIANT (safe):
Object[] objs = new String[1];
objs[0] = 42;                      // compiles… ArrayStoreException at RUNTIME

List&lt;Object&gt; list = new ArrayList&lt;String&gt;(); // ❌ COMPILE error — bug caught early</pre>
<div class="key-point">Senior follow-ups: this is why you use <code>Class&lt;T&gt;</code> tokens or <code>TypeReference</code> in Jackson (<code>new TypeReference&lt;List&lt;User&gt;&gt;() {}</code> — an anonymous subclass preserves the generic type in its class metadata), and why the compiler generates <strong>bridge methods</strong> when a class overrides a generic method with a concrete type.</div>`,
      },
      {
        q: 'What is the class initialization order? (static blocks, instance blocks, constructors — tricky output)',
        difficulty: 'tricky',
        a: `<pre>class Parent {
  static { System.out.println("1. Parent static block"); }
  { System.out.println("3. Parent instance block"); }
  Parent() { System.out.println("4. Parent constructor"); }
}
class Child extends Parent {
  static { System.out.println("2. Child static block"); }
  { System.out.println("5. Child instance block"); }
  Child() { System.out.println("6. Child constructor"); }
}

new Child();   // prints 1, 2, 3, 4, 5, 6
new Child();   // prints ONLY 3, 4, 5, 6 — statics run once per class

// Order: parent static → child static → (per instance:)
//        parent fields+instance blocks → parent ctor →
//        child fields+instance blocks → child ctor</pre>
<p><strong>The deadly variant — calling an overridable method from a constructor:</strong></p>
<pre>class Parent {
  Parent() { init(); }                 // virtual call runs BEFORE Child's fields init
  void init() { }
}
class Child extends Parent {
  private String name = "child";
  @Override void init() { System.out.println(name.length()); } // NPE! name still null
}
new Child(); // NullPointerException — child fields not yet assigned</pre>
<div class="key-point">Two senior takeaways: (1) static init runs once, at first use of the class, parent-first; (2) <strong>never call overridable methods from a constructor</strong> (Effective Java Item 19) — the subclass part of the object doesn't exist yet.</div>`,
      },
      {
        q: 'Why should you never use double for money? BigDecimal pitfalls.',
        difficulty: 'tricky',
        a: `<pre>System.out.println(0.1 + 0.2);        // 0.30000000000000004 (IEEE-754 binary!)
System.out.println(1.03 - 0.42);      // 0.6100000000000001

// Trap 1: the double constructor inherits the binary error
new BigDecimal(0.1);
// 0.1000000000000000055511151231257827021181583404541015625  ❌
new BigDecimal("0.1");                // 0.1 ✅ use the STRING constructor
BigDecimal.valueOf(0.1);              // 0.1 ✅ (goes through Double.toString)

// Trap 2: equals() compares SCALE too — compareTo() doesn't
new BigDecimal("2.0").equals(new BigDecimal("2.00"));      // false!
new BigDecimal("2.0").compareTo(new BigDecimal("2.00"));   // 0 (equal)
// → never use BigDecimal as a HashMap key / in a Set without normalizing scale

// Trap 3: division can throw
new BigDecimal("1").divide(new BigDecimal("3"));
// ArithmeticException: Non-terminating decimal expansion
new BigDecimal("1").divide(new BigDecimal("3"), 2, RoundingMode.HALF_UP); // 0.33 ✅</pre>
<div class="key-point">Money options in production: <code>BigDecimal</code> (string constructor + explicit <code>RoundingMode</code>), or store <strong>long cents</strong> (minor units) — what payment systems actually do. Bonus trivia: <code>double</code> can't represent 0.1 exactly for the same reason 1/3 isn't exact in decimal.</div>`,
      },
      {
        q: 'What is the output? Overload resolution with null, widening, boxing, and varargs',
        difficulty: 'tricky',
        a: `<pre>// 1. null picks the MOST SPECIFIC overload
void m(Object o) { System.out.println("Object"); }
void m(String s) { System.out.println("String"); }
m(null);                    // "String" — String is more specific than Object

// 2. ...but two unrelated types = ambiguous
void f(String s) { }
void f(Integer i) { }
f(null);                    // ❌ COMPILE ERROR: reference to f is ambiguous
f((String) null);           // ✅ fix with an explicit cast

// 3. Priority: exact match &gt; widening &gt; boxing &gt; varargs
void g(long l)     { System.out.println("long"); }
void g(Integer i)  { System.out.println("Integer"); }
void g(int... arr) { System.out.println("varargs"); }
int x = 5;
g(x);                       // "long" — primitive WIDENING beats boxing!
// (a pre-Java-5 call must resolve the same way it always did)</pre>
<div class="key-point">Overload resolution happens at <strong>compile time</strong> using the <em>static</em> type of arguments (unlike overriding, which dispatches at runtime on the object type). The widening-beats-boxing rule exists for backward compatibility and catches almost everyone.</div>`,
      },
      {
        q: 'Can you override a static method in Java? (method hiding vs overriding)',
        difficulty: 'tricky',
        a: `<p>No. A static method with the same signature in a subclass <strong>hides</strong> the parent's method — it does not override it. The difference is <em>which type decides</em>:</p>
<pre>class A {
  static void staticM()  { System.out.println("A.static"); }
  void instanceM()       { System.out.println("A.instance"); }
}
class B extends A {
  static void staticM()  { System.out.println("B.static"); }   // HIDES (no @Override allowed)
  @Override
  void instanceM()       { System.out.println("B.instance"); } // OVERRIDES
}

A a = new B();
a.staticM();    // "A.static"   — resolved at COMPILE time by REFERENCE type!
a.instanceM();  // "B.instance" — virtual dispatch at RUNTIME by OBJECT type

B.staticM();    // "B.static"
// Never call statics through an instance — it reads like polymorphism but isn't.</pre>
<div class="key-point">Related traps: <code>private</code> methods are never overridden (a same-signature method in the child is a new, unrelated method), and <strong>fields</strong> are also hidden, not overridden — <code>a.field</code> uses the reference type too. Only instance methods are polymorphic in Java.</div>`,
      },
    ],
  },

  // ───────────────────────── 2. JAVASCRIPT ─────────────────────────
];
