// Interview data: java
// Auto-generated from pv.html
(function () {
  (window.__pvTopics = window.__pvTopics || []).push(
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
<li><strong>Encapsulation</strong> – bundling data + methods; using access modifiers (<code>private</code>, <code>protected</code>, <code>public</code>).</li>
<li><strong>Abstraction</strong> – hiding complexity via abstract classes / interfaces.</li>
<li><strong>Inheritance</strong> – reusing code through <code>extends</code> / <code>implements</code>.</li>
<li><strong>Polymorphism</strong> – method overloading (compile-time) &amp; overriding (runtime).</li>
</ul>`,
            },
            {
              q: 'Explain the difference between Abstract class and Interface (Java 8+).',
              difficulty: 'medium',
              a: `<ul>
<li><strong>Abstract class</strong>: can have constructors, instance fields, any access modifier. A class can extend only one.</li>
<li><strong>Interface</strong>: all fields are <code>public static final</code>. Since Java 8 can have <code>default</code> and <code>static</code> methods. A class can implement many.</li>
<li><strong>When to use</strong>: interface for capability contracts ("can do"), abstract class for shared state ("is a").</li>
</ul>
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
<div class="key-point">Trick: String literals from the pool <code>"hello" == "hello"</code> returns <strong>true</strong> because they share the same reference in the String pool.</div>`,
            },
            {
              q: 'What is the difference between String, StringBuilder, and StringBuffer?',
              difficulty: 'medium',
              a: `<ul>
<li><strong>String</strong>: immutable. Every modification creates a new object.</li>
<li><strong>StringBuilder</strong>: mutable, <strong>not thread-safe</strong>, faster.</li>
<li><strong>StringBuffer</strong>: mutable, <strong>thread-safe</strong> (synchronized), slower.</li>
</ul>
<div class="key-point">Use <code>StringBuilder</code> for single-thread string manipulation (loops, concatenation). Use <code>StringBuffer</code> only when multiple threads modify the same builder.</div>`,
            },
            {
              q: 'Explain Java Memory Model: Stack vs Heap.',
              difficulty: 'hard',
              a: `<ul>
<li><strong>Stack</strong>: stores method frames, local variables, references. Each thread has its own stack. LIFO.</li>
<li><strong>Heap</strong>: stores objects and class-level variables. Shared across all threads. Managed by GC.</li>
<li><strong>Metaspace</strong> (Java 8+): replaces PermGen; stores class metadata, loaded by classloaders.</li>
</ul>
<pre>int x = 10;            // x on stack
String s = new String("hi"); // reference s on stack, object on heap</pre>
<div class="key-point">OutOfMemoryError: heap space → increase <code>-Xmx</code>. StackOverflowError → deep recursion / infinite loop.</div>`,
            },
            {
              q: 'What are the different types of Garbage Collectors in Java?',
              difficulty: 'hard',
              a: `<ul>
<li><strong>Serial GC</strong> – single thread, stop-the-world. Good for small apps.</li>
<li><strong>Parallel GC</strong> – multiple GC threads. Default in Java 8.</li>
<li><strong>G1 GC</strong> – divides heap into regions. Default since Java 9. Low-latency for large heaps.</li>
<li><strong>ZGC / Shenandoah</strong> – ultra-low pause times (&lt;10ms). Java 11+/15+.</li>
</ul>
<div class="key-point">Trick: "Which GC does your production use?" — know your <code>-XX:+UseG1GC</code> or <code>-XX:+UseZGC</code> flags.</div>`,
            },
            {
              q: 'Explain HashMap internal working. What happens on collision?',
              difficulty: 'hard',
              a: `<ol>
<li><code>hashCode()</code> → bucket index via <code>(n-1) & hash</code>.</li>
<li>If bucket empty → new Node.</li>
<li>If collision → stored as <strong>linked list</strong> (chaining) at that bucket.</li>
<li>Java 8+: when list length &gt; 8 AND table capacity ≥ 64 → converts to <strong>red-black tree</strong> (O(log n) lookup).</li>
<li>Load factor 0.75 → resize (double capacity) when exceeded.</li>
</ol>
<div class="key-point">Trick: "What if two keys have same hashCode AND equals?" → Second put overwrites the first value.</div>`,
            },
            {
              q: 'What is the difference between HashMap, LinkedHashMap, TreeMap, and ConcurrentHashMap?',
              difficulty: 'medium',
              a: `<ul>
<li><strong>HashMap</strong>: O(1), no order, allows one null key.</li>
<li><strong>LinkedHashMap</strong>: maintains <strong>insertion order</strong>.</li>
<li><strong>TreeMap</strong>: <strong>sorted by keys</strong> (natural order or Comparator). O(log n).</li>
<li><strong>ConcurrentHashMap</strong>: thread-safe, no null keys/values, uses segment locking (Java 7) or CAS + synchronized (Java 8+).</li>
</ul>`,
            },
            {
              q: 'Explain Java Streams. What is the difference between intermediate and terminal operations?',
              difficulty: 'medium',
              a: `<ul>
<li><strong>Intermediate</strong>: lazy, return Stream → <code>filter()</code>, <code>map()</code>, <code>sorted()</code>, <code>distinct()</code>, <code>flatMap()</code>.</li>
<li><strong>Terminal</strong>: trigger execution → <code>collect()</code>, <code>forEach()</code>, <code>reduce()</code>, <code>count()</code>, <code>findFirst()</code>.</li>
</ul>
<pre>List&lt;String&gt; names = employees.stream()
    .filter(e -> e.getSalary() > 50000)
    .map(Employee::getName)
    .sorted()
    .collect(Collectors.toList());</pre>
<div class="key-point">Trick: Streams are <strong>lazy</strong> – nothing executes until a terminal operation is called.</div>`,
            },
            {
              q: 'What is Optional in Java? Why use it?',
              difficulty: 'medium',
              a: `<p><code>Optional&lt;T&gt;</code> is a container that may or may not hold a non-null value. Designed to reduce <code>NullPointerException</code>.</p>
<pre>Optional&lt;String&gt; name = Optional.ofNullable(getName());
String result = name
    .filter(n -> n.length() > 3)
    .map(String::toUpperCase)
    .orElse("UNKNOWN");</pre>
<div class="key-point">Never use <code>Optional</code> for class fields or method parameters – only for return types.</div>`,
            },
            {
              q: 'Explain the volatile keyword in Java.',
              difficulty: 'hard',
              a: `<ul>
<li><code>volatile</code> ensures a variable is <strong>read from and written to main memory</strong>, not CPU cache.</li>
<li>Guarantees <strong>visibility</strong> across threads but NOT atomicity.</li>
<li>No reordering of reads/writes around volatile access.</li>
</ul>
<pre>private volatile boolean running = true;
// Thread A: running = false;
// Thread B: while(running) { ... } // sees update immediately</pre>
<div class="key-point">Trick: <code>volatile</code> is NOT enough for <code>i++</code> because increment is read-modify-write (3 steps). Use <code>AtomicInteger</code> instead.</div>`,
            },
            {
              q: 'What are the differences between synchronized, ReentrantLock, and ReadWriteLock?',
              difficulty: 'hard',
              a: `<ul>
<li><strong>synchronized</strong>: implicit lock, auto-released. Simple but no tryLock/timeout.</li>
<li><strong>ReentrantLock</strong>: explicit lock/unlock. Supports <code>tryLock()</code>, <code>lockInterruptibly()</code>, fairness.</li>
<li><strong>ReadWriteLock</strong>: allows multiple concurrent readers, exclusive writers. Great for read-heavy workloads.</li>
</ul>
<pre>ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();
rwl.readLock().lock();   // multiple threads can hold this
rwl.writeLock().lock();  // exclusive</pre>`,
            },
            {
              q: 'What is the difference between CompletableFuture and Future?',
              difficulty: 'hard',
              a: `<ul>
<li><strong>Future</strong>: blocking <code>get()</code>, no chaining, no combining.</li>
<li><strong>CompletableFuture</strong>: non-blocking, supports chaining (<code>thenApply</code>, <code>thenCompose</code>), combining (<code>allOf</code>, <code>anyOf</code>), exception handling (<code>exceptionally</code>).</li>
</ul>
<pre>CompletableFuture.supplyAsync(() -> fetchUser(id))
    .thenApply(user -> user.getEmail())
    .thenAccept(email -> sendEmail(email))
    .exceptionally(ex -> { log.error(ex); return null; });</pre>`,
            },
            {
              q: 'Explain SOLID principles with Java examples.',
              difficulty: 'hard',
              a: `<ul>
<li><strong>S</strong> – Single Responsibility: one class = one reason to change.</li>
<li><strong>O</strong> – Open/Closed: open for extension, closed for modification (use interfaces/abstract).</li>
<li><strong>L</strong> – Liskov Substitution: subclass must be substitutable for parent without breaking behavior.</li>
<li><strong>I</strong> – Interface Segregation: many specific interfaces &gt; one fat interface.</li>
<li><strong>D</strong> – Dependency Inversion: depend on abstractions, not concretions (DI / IoC).</li>
</ul>
<div class="key-point">In Spring Boot: <code>@Service</code> depends on <code>Repository</code> interface (D). Each service handles one domain (S). New payment methods extend <code>PaymentStrategy</code> (O).</div>`,
            },
            {
              q: "What happens when you type 'new Object()' in Java? (Object creation lifecycle)",
              difficulty: 'tricky',
              a: `<ol>
<li>Class is loaded by ClassLoader (if not already loaded).</li>
<li>Memory is allocated on the <strong>heap</strong> for the object.</li>
<li>Fields are set to <strong>default values</strong> (0, null, false).</li>
<li><strong>Instance initializers</strong> and <strong>field assignments</strong> run (in order of appearance).</li>
<li><strong>Constructor</strong> body executes (after calling <code>super()</code>).</li>
<li>Reference is returned to the caller (stored on stack).</li>
</ol>`,
            },
            {
              q: 'What is the difference between Checked and Unchecked Exceptions?',
              difficulty: 'easy',
              a: `<ul>
<li><strong>Checked</strong> (compile-time): must be caught or declared. <code>IOException</code>, <code>SQLException</code>. Extends <code>Exception</code>.</li>
<li><strong>Unchecked</strong> (runtime): don't need to be declared. <code>NullPointerException</code>, <code>ArrayIndexOutOfBoundsException</code>. Extends <code>RuntimeException</code>.</li>
<li><strong>Error</strong>: serious JVM problems. <code>OutOfMemoryError</code>, <code>StackOverflowError</code>. Should not be caught.</li>
</ul>`,
            },
            {
              q: 'Explain the Java ClassLoader hierarchy and how class loading works.',
              difficulty: 'hard',
              a: `<ol>
<li><strong>Bootstrap ClassLoader</strong>: loads core Java classes (rt.jar). Written in native code.</li>
<li><strong>Extension/Platform ClassLoader</strong>: loads from <code>jre/lib/ext</code>.</li>
<li><strong>Application ClassLoader</strong>: loads from classpath.</li>
</ol>
<p><strong>Delegation model</strong>: child asks parent first → prevents duplicate loading and ensures core classes can't be overridden.</p>
<div class="key-point">Trick: "Can you load two different versions of the same class?" → Yes, with <strong>custom ClassLoaders</strong> (used by app servers like Tomcat for war isolation).</div>`,
            },
            {
              q: 'What are functional interfaces and lambda expressions?',
              difficulty: 'medium',
              a: `<p>A <strong>functional interface</strong> has exactly <strong>one abstract method</strong>. Annotated with <code>@FunctionalInterface</code>.</p>
<ul>
<li><code>Predicate&lt;T&gt;</code> → <code>boolean test(T t)</code></li>
<li><code>Function&lt;T,R&gt;</code> → <code>R apply(T t)</code></li>
<li><code>Consumer&lt;T&gt;</code> → <code>void accept(T t)</code></li>
<li><code>Supplier&lt;T&gt;</code> → <code>T get()</code></li>
</ul>
<pre>Predicate&lt;String&gt; notEmpty = s -> s != null && !s.isEmpty();
Function&lt;String, Integer&gt; len = String::length;</pre>`,
            },
            {
              q: 'What is the difference between fail-fast and fail-safe iterators?',
              difficulty: 'tricky',
              a: `<ul>
<li><strong>Fail-fast</strong>: throws <code>ConcurrentModificationException</code> if collection modified during iteration. E.g., <code>ArrayList</code>, <code>HashMap</code> iterators.</li>
<li><strong>Fail-safe</strong>: works on a <strong>clone/snapshot</strong>, doesn't throw. E.g., <code>CopyOnWriteArrayList</code>, <code>ConcurrentHashMap</code> iterators.</li>
</ul>
<div class="key-point">Trick: To remove during iteration, use <code>iterator.remove()</code>, not <code>list.remove()</code>.</div>`,
            },
            {
              q: 'Explain Spring Boot dependency injection and IoC container.',
              difficulty: 'medium',
              a: `<ul>
<li><strong>IoC</strong> (Inversion of Control): framework creates and manages objects (beans), not us.</li>
<li><strong>DI types</strong>: Constructor injection (preferred), Setter injection, Field injection (<code>@Autowired</code>).</li>
<li><strong>Bean scopes</strong>: <code>singleton</code> (default), <code>prototype</code>, <code>request</code>, <code>session</code>.</li>
</ul>
<pre>@Service
public class OrderService {
    private final PaymentGateway gateway; // interface
    public OrderService(PaymentGateway gateway) { // constructor DI
        this.gateway = gateway;
    }
}</pre>
<div class="key-point">Constructor injection is preferred: immutable, testable, fails fast if dependency missing.</div>`,
            },
            {
              q: 'What is the difference between @Component, @Service, @Repository, and @Controller?',
              difficulty: 'easy',
              a: `<ul>
<li><strong>@Component</strong>: generic Spring-managed bean.</li>
<li><strong>@Service</strong>: business logic layer (semantic only, no extra behavior).</li>
<li><strong>@Repository</strong>: data access layer. Adds <strong>exception translation</strong> (DB exceptions → Spring DataAccessException).</li>
<li><strong>@Controller</strong>: web layer, returns views. <code>@RestController</code> = <code>@Controller</code> + <code>@ResponseBody</code>.</li>
</ul>`,
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
<div class="key-point">Trick: Self-invocation within the same class bypasses proxy → <code>@Transactional</code> won't work. Solution: inject self or move to another bean.</div>`,
            },
            {
              q: 'What are design patterns commonly asked in Java interviews?',
              difficulty: 'hard',
              a: `<ul>
<li><strong>Singleton</strong>: one instance (use enum or double-checked locking).</li>
<li><strong>Factory Method</strong>: subclass decides which class to instantiate.</li>
<li><strong>Builder</strong>: step-by-step construction (<code>Lombok @Builder</code>).</li>
<li><strong>Strategy</strong>: interchangeable algorithms via interface.</li>
<li><strong>Observer</strong>: event-driven notification (pub/sub).</li>
<li><strong>Proxy</strong>: Spring AOP, lazy loading.</li>
<li><strong>Template Method</strong>: skeleton in base class, steps in subclasses.</li>
</ul>
<pre>// Thread-safe Singleton
public enum Singleton {
    INSTANCE;
    public void doSomething() { }
}</pre>`,
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
          ],
        },

        // ───────────────────────── 2. JAVASCRIPT ─────────────────────────
  );
})();
