import type { KmNode } from '../../types';

export const basics: KmNode = {
  title: 'Java Basics',
  level: 'beginner',
  summary:
    'The first things you need: how Java runs, the core syntax, and how data and methods work.',
  simple:
    'This is your starter kit. Once you know how to write, compile and run a small program, and how values move around, everything else builds on top.',
  points: [
    'Java is a typed, object-oriented language that runs on the JVM.',
    'You write .java files, compile them to bytecode, and the JVM runs it.',
    'Learn types, control flow, arrays and methods first; classes come next.',
  ],
  children: [
    {
      title: 'What is Java?',
      level: 'beginner',
      summary:
        'A general-purpose language that compiles to bytecode, so the same program runs on any OS with a JVM.',
      simple:
        'Think of bytecode as a universal recipe. Each OS has its own cook (the JVM) who can read that recipe, so you write it once and it works everywhere.',
      points: [
        'Slogan: "write once, run anywhere" (WORA).',
        'Statically typed: the compiler checks types before the program runs.',
        'Memory is managed for you by a garbage collector (it frees objects you no longer use).',
        'Used for backends, Android, big data tools (Kafka, Spark) and enterprise apps.',
        'A new version ships every 6 months; LTS (long-term support) versions are 17, 21 and 25.',
      ],
      tip: 'For new projects, pick the latest LTS (Java 21 or 25) unless a library holds you back.',
    },
    {
      title: 'JDK vs JRE vs JVM',
      level: 'beginner',
      summary:
        'JVM runs bytecode, JRE is JVM plus core libraries, JDK is JRE plus developer tools.',
      simple:
        'Like boxes inside boxes. The JVM is the engine, the JRE is the engine plus the parts a car needs to drive, and the JDK is the whole garage with the tools to build cars.',
      points: [
        'JVM (Java Virtual Machine): loads and runs bytecode, manages memory.',
        'JRE (Java Runtime Environment): JVM + standard libraries, enough to run apps.',
        'JDK (Java Development Kit): JRE + tools like <code>javac</code>, <code>jar</code>, <code>jshell</code>.',
        'Since Java 11 there is no separate JRE download; you install a JDK or build a small runtime with <code>jlink</code>.',
        'Popular JDK builds: Eclipse Temurin, Oracle JDK, Amazon Corretto, Azul Zulu.',
      ],
      tip: 'Interview one-liner: "JDK to build, JRE to run, JVM does the actual running."',
    },
    {
      title: 'Compile & Run',
      level: 'beginner',
      summary:
        'javac turns your .java source into .class bytecode; the java command starts a JVM to run it.',
      simple:
        'You write a letter in your language (source), a translator turns it into a universal language (bytecode), and a reader in any country (the JVM) can read it.',
      points: [
        '<code>javac Hello.java</code> creates <code>Hello.class</code> (bytecode).',
        '<code>java Hello</code> starts the JVM and runs that class.',
        'Since Java 11 you can run a single file directly: <code>java Hello.java</code>.',
        'The JVM first interprets bytecode, then the JIT compiler turns hot code into fast machine code.',
        'Real projects use a build tool (Maven or Gradle) instead of calling javac by hand.',
      ],
    },
    {
      title: 'Main Method & First Program',
      level: 'beginner',
      summary: 'The main method is where your program starts.',
      simple: 'main is the front door. When you run the program, the JVM walks in through main.',
      points: [
        'Classic form: <code>public static void main(String[] args)</code>.',
        '<code>args</code> holds the command-line arguments.',
        'Java 25 finalized compact source files: a simple <code>void main()</code> with no class is enough.',
        '<code>System.out.println</code> prints a line to the console.',
      ],
      detail: `<pre><code>// Classic
public class Hello {
  public static void main(String[] args) {
    System.out.println("Hello, " + args[0]);
  }
}

// Java 25 compact source file
void main() {
  IO.println("Hello!");
}</code></pre>`,
    },
    {
      title: 'Primitive vs Reference Types',
      level: 'beginner',
      summary:
        'Primitives hold the value itself; reference types hold a pointer to an object on the heap.',
      simple:
        'A primitive is cash in your hand. A reference is a note with an address where the thing is stored. Copy the note and both notes point to the same house.',
      points: [
        '8 primitives: <code>byte, short, int, long, float, double, char, boolean</code>.',
        'Everything else (String, arrays, your classes) is a reference type.',
        'Primitives cannot be <code>null</code>; references can.',
        '<code>int</code> is 32-bit, <code>long</code> 64-bit; overflow wraps around silently.',
        'Use <code>double</code> for science, never for money (use BigDecimal).',
      ],
      detail: `<pre><code>int a = 5;
int b = a;      // b gets a copy of 5
b = 10;         // a is still 5

int[] x = {1, 2};
int[] y = x;    // y points to the SAME array
y[0] = 99;      // x[0] is now 99 too</code></pre>`,
    },
    {
      title: 'Variables & var',
      level: 'beginner',
      summary: 'A variable is a named box for a value; var lets the compiler figure out the type.',
      simple:
        'var is like saying "you can see what it is". The type is still fixed, you just do not have to type it out.',
      points: [
        'Declare with a type: <code>int count = 0;</code>.',
        '<code>var</code> (Java 10+) works only for local variables with an initial value.',
        'The type is still static: <code>var list = new ArrayList&lt;String&gt;();</code> is an ArrayList forever.',
        'Local variables must be assigned before use; fields get default values (0, false, null).',
        'Use <code>final</code> when the variable should not be reassigned.',
      ],
      tip: 'Use var when the type is obvious from the right side; spell the type out when it helps the reader.',
    },
    {
      title: 'Operators & Control Flow',
      level: 'beginner',
      summary:
        'Math and logic operators, plus if, switch and loops to decide what runs and how often.',
      simple:
        'Control flow is the road map of your code: forks in the road (if/switch) and roundabouts you go around a few times (loops).',
      points: [
        '<code>&amp;&amp;</code> and <code>||</code> short-circuit: the right side runs only if needed.',
        'Integer division drops the remainder: <code>7 / 2 == 3</code>; use <code>%</code> for the remainder.',
        'Loops: <code>for</code>, enhanced <code>for (x : list)</code>, <code>while</code>, <code>do-while</code>.',
        'Switch expressions (Java 14+) use <code>-&gt;</code>, return a value and have no fall-through.',
        'Java 21 switch can match on types and records (pattern matching).',
      ],
      detail: `<pre><code>String size = switch (n) {
  case 0 -&gt; "none";
  case 1, 2 -&gt; "few";
  default -&gt; "many";
};

for (String name : names) {
  if (name.isBlank()) continue;
  System.out.println(name);
}</code></pre>`,
    },
    {
      title: 'Arrays',
      level: 'beginner',
      summary: 'A fixed-size, ordered row of values of one type, accessed by index from 0.',
      simple:
        'An array is an egg carton: a fixed number of slots, numbered from 0. You cannot add a slot later.',
      points: [
        'Size is fixed when created: <code>new int[5]</code>.',
        'Out-of-range index throws <code>ArrayIndexOutOfBoundsException</code>.',
        'Use <code>Arrays.toString</code>, <code>Arrays.sort</code>, <code>Arrays.fill</code> for common jobs.',
        'Need to grow or shrink? Use an <code>ArrayList</code> instead.',
      ],
      detail: `<pre><code>int[] nums = {3, 1, 2};
Arrays.sort(nums);
System.out.println(Arrays.toString(nums)); // [1, 2, 3]
System.out.println(nums.length);           // 3</code></pre>`,
    },
    {
      title: 'Methods & Pass-by-Value',
      level: 'intermediate',
      summary:
        'Methods are named blocks of code; Java always passes a copy of the value, even for objects.',
      simple:
        'When you pass an object, you hand over a copy of its address note. The method can visit the house and repaint it, but tearing up its note does not change yours.',
      points: [
        'Java is always pass-by-value. For objects, the value copied is the reference.',
        'A method can change the object you passed in (its fields).',
        'Reassigning the parameter inside the method does not affect the caller.',
        'Overloading: same name, different parameter lists.',
        'Varargs: <code>int sum(int... nums)</code> accepts any number of ints.',
      ],
      detail: `<pre><code>void rename(User u) {
  u.setName("Bob");   // caller sees "Bob"
  u = new User("Eve"); // caller does NOT see this
}</code></pre>`,
      tip: 'Classic interview question. Answer: "Java is pass-by-value; for objects the reference is copied, not the object."',
    },
    {
      title: 'Packages & Imports',
      level: 'beginner',
      summary:
        'Packages group related classes like folders; imports let you use short class names.',
      simple:
        'Packages are folders with an address. Imports are like saving a contact so you can say "Mom" instead of her full number.',
      points: [
        'Package name matches the folder path: <code>com.shop.order</code> → <code>com/shop/order/</code>.',
        'Use reverse domain names to avoid clashes.',
        '<code>java.lang</code> (String, Math, System) is imported automatically.',
        'Static import: <code>import static java.lang.Math.max;</code>.',
        'Java 25 module imports: <code>import module java.base;</code> pulls in a whole module.',
      ],
    },
  ],
};
