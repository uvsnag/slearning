import type { KmNode } from '../../types';

export const jvm: KmNode = {
  title: 'JVM & Memory',
  level: 'intermediate',
  summary:
    'How the Java Virtual Machine loads, runs and cleans up your code, and how to look inside it.',
  simple:
    'The JVM is the engine under the hood. You can drive without knowing it, but when the app gets slow or runs out of memory, you need to open the hood.',
  points: [
    'The JVM loads your classes, runs bytecode and compiles hot code to machine code.',
    'It manages memory for you and frees unused objects with a garbage collector.',
    'Knowing its memory areas helps you read errors like OutOfMemoryError.',
    'Tools like jcmd and JFR let you look inside a running JVM.',
  ],
  children: [
    {
      title: 'JVM Architecture',
      level: 'intermediate',
      summary:
        'Three big parts: the class loader, the runtime memory areas and the execution engine.',
      simple:
        'Think of a restaurant. The class loader brings in the ingredients (classes), the memory areas are the kitchen shelves, and the execution engine is the cook.',
      points: [
        'Class loader subsystem: finds <code>.class</code> files and loads them into memory.',
        'Runtime data areas: heap, stacks, metaspace, code cache and more.',
        'Execution engine: interpreter, JIT compiler and garbage collector.',
        'JDK = tools (javac, jcmd…) + JRE; the JRE is the JVM + core libraries.',
        'HotSpot (from OpenJDK) is the JVM almost everyone uses.',
      ],
    },
    {
      title: 'Class Loading',
      level: 'advanced',
      summary:
        'How the JVM finds a class, checks it and prepares it the first time your code needs it.',
      simple:
        'Classes are loaded lazily, like opening a book only when you need it. Before reading, the JVM checks it is a real, safe book.',
      points: [
        'Built-in loaders: Bootstrap (core JDK), Platform, and Application (your classpath).',
        'Parent delegation: a loader first asks its parent, so nobody can replace <code>java.lang.String</code>.',
        'Steps: loading → linking (verify, prepare, resolve) → initialization.',
        'Initialization runs static fields and <code>static {}</code> blocks, once, on first real use.',
        'Same class name in two loaders = two different classes (a classic <code>ClassCastException</code> source).',
      ],
      tip: 'If you see "ClassCastException: X cannot be cast to X", two class loaders loaded X. Common in app servers and plugin systems.',
    },
    {
      title: 'Memory Areas',
      level: 'intermediate',
      summary:
        'Where things live: objects on the heap, method calls on the stack, class data in metaspace.',
      simple:
        'The heap is a big shared warehouse for objects. Each thread also has its own small notepad (the stack) for the method it is running right now.',
      points: [
        'Heap: all objects. Split into young (new objects) and old (long-lived) generations. Shared by all threads.',
        'Stack: one per thread. Holds local variables and method call frames. Freed automatically on return.',
        'Metaspace: class metadata, in native memory. Replaced PermGen in Java 8.',
        'Code cache: machine code produced by the JIT.',
        'Local primitives live on the stack; objects live on the heap, and the stack holds only a reference.',
      ],
      detail: `<pre><code>void order() {
    int qty = 3;                         // stack
    List&lt;String&gt; items = new ArrayList&lt;&gt;(); // reference on stack, list on heap
}</code></pre>`,
    },
    {
      title: 'JIT Compilation',
      level: 'advanced',
      summary:
        'The JVM starts by interpreting bytecode, then compiles hot code to fast machine code while running.',
      simple:
        'At first the JVM reads your code line by line, like reading a recipe aloud. Dishes it cooks often, it learns by heart and then makes much faster.',
      points: [
        'Interpreter: starts fast, runs slow.',
        'C1 compiler: compiles quickly with light optimizations.',
        'C2 compiler: slower to compile, makes very fast code for really hot methods.',
        'Tiered compilation (default since Java 8) moves code from interpreter → C1 → C2.',
        'Warm-up: the first requests are slower until hot code is compiled.',
        'JIT tricks: inlining, escape analysis, removing unused code; it can undo them if assumptions break.',
      ],
      tip: 'Warm-up is why you never benchmark the first few calls. It is also why GraalVM native image and CDS/AOT caches exist: to start fast.',
    },
    {
      title: 'Garbage Collection',
      level: 'intermediate',
      summary: 'The JVM automatically finds objects nobody uses anymore and frees their memory.',
      simple:
        'Like a cleaner who walks through the office and throws away papers nobody is holding. You never call free() yourself.',
      points: [
        'Garbage = an object that no live code can reach anymore.',
        'GC can pause your app ("stop-the-world"); modern collectors keep pauses tiny.',
        'Trade-off triangle: throughput, pause time, memory footprint. You pick two.',
        'Default collector: G1 (since Java 9). Pick with <code>-XX:+UseG1GC</code>, <code>-XX:+UseZGC</code>, etc.',
        'Choosing: default G1 for most apps, ZGC for very low pauses, Parallel for batch throughput, Serial for tiny containers.',
      ],
      tip: 'Do not call System.gc(). Tune the heap size first; switching collectors is a later step, after measuring.',
      children: [
        {
          title: 'Reachability & GC Roots',
          level: 'intermediate',
          summary:
            'GC starts from "roots" and follows references; anything it cannot reach is garbage.',
          simple:
            'Imagine pulling a bunch of grapes up by the stem. Every grape still attached comes up; loose grapes left on the table are garbage.',
          points: [
            'GC roots: local variables on thread stacks, static fields, active threads, JNI references.',
            'Mark: follow every reference from the roots and mark what is reached.',
            'Sweep/compact: free unmarked objects and often move live ones together.',
            'Cycles are fine: two objects pointing to each other but unreachable are still collected.',
          ],
        },
        {
          title: 'Generational Idea',
          level: 'advanced',
          summary: 'Most objects die young, so the heap is split into a young and an old area.',
          simple:
            'Most papers on a desk are sticky notes thrown away in minutes. So you clean the desk often, and the filing cabinet only rarely.',
          points: [
            'New objects go to the young generation (Eden + survivor spaces).',
            'Minor GC cleans the young area often and fast.',
            'Objects that survive a few GCs get promoted to the old generation.',
            'Old-gen collections are rarer and usually more expensive.',
          ],
        },
        {
          title: 'Serial & Parallel GC',
          level: 'advanced',
          summary:
            'The two classic collectors: one thread (Serial) or many threads (Parallel), both stop the app.',
          points: [
            'Serial: one GC thread. Fine for small heaps and 1-CPU containers.',
            'Parallel: many GC threads, best raw throughput, but longer pauses.',
            'Good for batch jobs where total speed matters more than pause length.',
            'Flags: <code>-XX:+UseSerialGC</code>, <code>-XX:+UseParallelGC</code>.',
          ],
        },
        {
          title: 'G1 GC',
          level: 'advanced',
          summary:
            'The default collector: splits the heap into regions and aims for a pause-time target.',
          points: [
            'Heap is cut into many equal regions; each is young, old or humongous (huge objects).',
            'Collects the regions with the most garbage first, hence "Garbage First".',
            'Pause goal via <code>-XX:MaxGCPauseMillis</code> (default 200 ms). It is a goal, not a promise.',
            'Default since Java 9 on normal server machines. A good balance for most apps.',
          ],
        },
        {
          title: 'ZGC & Shenandoah',
          level: 'expert',
          summary: 'Low-pause collectors that do almost all work while your app keeps running.',
          points: [
            'ZGC: pauses usually under 1 ms, even with huge heaps. Production-ready since Java 15.',
            'Generational ZGC came in Java 21, became the default ZGC mode in 23; the old mode was removed in 24.',
            'Shenandoah (from Red Hat): similar goal, also does compaction while the app runs.',
            'Cost: a bit more CPU and memory than G1 for the same work.',
            'Use for latency-sensitive services with big heaps. Enable with <code>-XX:+UseZGC</code>.',
          ],
        },
      ],
    },
    {
      title: 'Memory Leaks',
      level: 'advanced',
      summary: 'Objects you no longer need but still reference, so GC can never free them.',
      simple:
        'GC only throws away what nobody holds. If you keep a list "just in case" and never empty it, the GC must keep everything in it.',
      points: [
        'Classic: a static <code>Map</code> or cache that only grows.',
        'Listeners or callbacks registered and never removed.',
        '<code>ThreadLocal</code> values left in pooled threads.',
        'Unclosed resources (streams, connections) holding buffers.',
        'Sign: old-gen usage keeps rising after every full GC, then OutOfMemoryError.',
      ],
      tip: 'Use a bounded cache (e.g. Caffeine with a max size) instead of a plain static HashMap.',
    },
    {
      title: 'OOM & StackOverflow',
      level: 'intermediate',
      summary:
        'OutOfMemoryError means a memory area is full; StackOverflowError means one thread went too deep.',
      simple:
        'OOM: the warehouse is full. StackOverflow: you stacked plates so high (calls inside calls) that the pile fell over.',
      points: [
        '"Java heap space": too many live objects, or a heap that is too small.',
        '"Metaspace": too many classes, often a class loader leak.',
        '"GC overhead limit exceeded": JVM spends almost all its time in GC.',
        '"unable to create native thread": too many threads for the OS limits.',
        'StackOverflowError: usually recursion with no (or a wrong) stop condition.',
      ],
      detail: `<pre><code>int depth(int n) {
    return depth(n + 1); // no base case → StackOverflowError
}</code></pre>`,
      tip: 'Run production with -XX:+HeapDumpOnOutOfMemoryError so you get a heap dump to analyze when it happens.',
    },
    {
      title: 'Key JVM Flags',
      level: 'advanced',
      summary: 'A few flags you actually need: heap size, GC choice, container memory and dumps.',
      points: [
        '<code>-Xms</code> / <code>-Xmx</code>: start and max heap size, e.g. <code>-Xmx2g</code>.',
        '<code>-Xss</code>: stack size per thread.',
        'Container aware since Java 10 (and 8u191): the JVM reads the container memory and CPU limits.',
        'In containers prefer <code>-XX:MaxRAMPercentage=75</code> over a fixed -Xmx. Default is only 25%.',
        '<code>-XX:+HeapDumpOnOutOfMemoryError</code> and <code>-Xlog:gc*</code> for debugging.',
      ],
      tip: 'Heap is not the only memory: metaspace, thread stacks and direct buffers also count toward the container limit.',
    },
    {
      title: 'Diagnostic Tools',
      level: 'expert',
      summary: 'Tools to see what a live JVM is doing: threads, memory, CPU and GC.',
      points: [
        '<code>jcmd</code>: the Swiss army knife (thread dump, heap dump, start JFR, show flags).',
        'JFR (Java Flight Recorder): low-overhead recording, safe in production. Open it in JMC (Mission Control).',
        'Thread dump: what every thread is doing right now. Great for hangs and deadlocks.',
        'Heap dump: every object in memory. Analyze with Eclipse MAT to find leaks.',
        'VisualVM for a quick visual look; async-profiler for accurate CPU and allocation flame graphs.',
      ],
      tip: 'For a hang, take 3 thread dumps a few seconds apart and compare. Threads stuck in the same place are your suspects.',
    },
  ],
};
