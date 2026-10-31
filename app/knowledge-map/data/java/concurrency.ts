import type { KmNode } from '../../types';

export const concurrency: KmNode = {
  title: 'Concurrency',
  level: 'intermediate',
  summary:
    'Doing several things at once with threads, and keeping shared data correct while you do it.',
  simple:
    'Threads are like several cooks in one kitchen. Work gets done faster, but if two cooks grab the same pan at once, things go wrong.',
  points: [
    'Threads run code in parallel or take turns on the CPU.',
    'Shared, changing data is the source of almost every bug here.',
    'Prefer high-level tools: executors, concurrent collections, CompletableFuture.',
    'Since Java 21, virtual threads make "one thread per task" cheap again.',
  ],
  children: [
    {
      title: 'Threads & Lifecycle',
      level: 'beginner',
      summary:
        'A thread is a separate path of execution; you give it work with Runnable or Callable.',
      simple:
        'Your program starts with one worker (the main thread). Creating a thread hires another worker who runs a task next to the first one.',
      points: [
        '<code>Runnable</code>: a task with no result. <code>Callable&lt;T&gt;</code>: returns a result and can throw.',
        'Call <code>start()</code>, not <code>run()</code>; <code>run()</code> just runs on the current thread.',
        'States: NEW → RUNNABLE → (BLOCKED / WAITING / TIMED_WAITING) → TERMINATED.',
        '<code>join()</code> waits for a thread to finish.',
        'Stop a thread politely with <code>interrupt()</code>; the task must check for it.',
      ],
      detail: `<pre><code>Thread t = new Thread(() -&gt; System.out.println("Hi from " + Thread.currentThread().getName()));
t.start();
t.join(); // wait until it finishes</code></pre>`,
      tip: 'In real code you rarely create Thread objects yourself. Use an ExecutorService.',
    },
    {
      title: 'Race Conditions',
      level: 'intermediate',
      summary: 'A bug where the result depends on which thread happens to run first.',
      simple:
        'Two people update the same bank balance at the same time. Both read 100, both add 10, both write 110. One deposit is lost.',
      points: [
        '<code>count++</code> is three steps: read, add, write. Threads can interleave between them.',
        'Only shared and changing (mutable) data is a problem.',
        'Fixes: do not share, make it immutable, or synchronize access.',
        'Race bugs are random and hard to reproduce. Design them away.',
      ],
      detail: `<pre><code>int count = 0;
// 2 threads each run this 1000 times:
count++; // final value is often less than 2000</code></pre>`,
    },
    {
      title: 'synchronized',
      level: 'intermediate',
      summary:
        'A keyword that lets only one thread at a time run a block guarded by the same lock.',
      simple:
        'Like a bathroom key at a café: only the person holding the key can go in. Everyone else waits in line.',
      points: [
        'Every object has a built-in lock (intrinsic lock or monitor).',
        'A synchronized method locks <code>this</code>; a static one locks the class.',
        'It also makes changes visible to the next thread that takes the same lock.',
        'Re-entrant: a thread holding the lock can enter again without blocking itself.',
        'Keep the locked part small. Never call slow I/O while holding a lock if you can avoid it.',
      ],
      detail: `<pre><code>private final Object lock = new Object();
private int count;

void increment() {
    synchronized (lock) { count++; }
}</code></pre>`,
    },
    {
      title: 'volatile & Memory Model',
      level: 'advanced',
      summary:
        'The Java Memory Model says when one thread is guaranteed to see what another wrote.',
      simple:
        'Each CPU core can keep its own copy of a value, like a note in its pocket. volatile forces everyone to read and write the shared whiteboard instead.',
      points: [
        "Without rules, a thread may never see another thread's update (visibility problem).",
        '<code>volatile</code>: reads and writes go straight to shared memory and are not reordered.',
        '<code>volatile</code> does NOT make <code>count++</code> safe. It gives visibility, not atomicity.',
        'Happens-before: a rule meaning "everything before A is visible after B". E.g. unlock → next lock, volatile write → read, <code>start()</code>, <code>join()</code>.',
        'Good use: a stop flag like <code>volatile boolean running</code>.',
      ],
      tip: 'Interview line: synchronized gives atomicity + visibility, volatile gives only visibility and ordering.',
    },
    {
      title: 'Locks & Atomics',
      level: 'advanced',
      summary:
        'Explicit locks for more control, and atomic classes for lock-free counters and flags.',
      simple:
        'A Lock is a key you can try to take with a timeout. An atomic is a counter that updates itself in one safe step, no key needed.',
      points: [
        '<code>ReentrantLock</code>: like synchronized, plus <code>tryLock()</code>, timeouts, fairness. Always unlock in <code>finally</code>.',
        '<code>ReadWriteLock</code>: many readers at once, or one writer. Good for read-heavy data.',
        '<code>AtomicInteger</code>, <code>AtomicLong</code>, <code>AtomicReference</code>: thread-safe without locks.',
        'CAS (compare-and-swap): "set to new value only if it is still the old value", retried on failure.',
        '<code>LongAdder</code> beats AtomicLong when many threads update a counter.',
      ],
      detail: `<pre><code>AtomicInteger hits = new AtomicInteger();
hits.incrementAndGet(); // safe from any thread

lock.lock();
try { balance += amount; } finally { lock.unlock(); }</code></pre>`,
    },
    {
      title: 'Executors & Thread Pools',
      level: 'intermediate',
      summary: 'An ExecutorService runs your tasks on a reusable pool of threads.',
      simple:
        'Instead of hiring a new worker for every small job, you keep a fixed team and hand them jobs from a queue.',
      points: [
        '<code>submit()</code> returns a <code>Future</code>; <code>get()</code> waits for the result.',
        'Sizing: CPU-heavy work ≈ number of cores; I/O-heavy work can use more threads.',
        'Always shut down: <code>shutdown()</code> + <code>awaitTermination()</code>, or try-with-resources (Java 19+).',
        'Avoid unbounded queues in production; they hide overload until memory runs out.',
        'Name your threads (a ThreadFactory) so thread dumps make sense.',
      ],
      detail: `<pre><code>try (ExecutorService pool = Executors.newFixedThreadPool(4)) {
    Future&lt;Integer&gt; f = pool.submit(() -&gt; compute());
    System.out.println(f.get());
} // close() waits for tasks, then shuts down</code></pre>`,
    },
    {
      title: 'CompletableFuture',
      level: 'advanced',
      summary: 'A future you can chain and combine, for async pipelines without blocking.',
      simple:
        'Like ordering food with a buzzer: you place the order, keep doing other things, and say "when it is ready, do this next".',
      points: [
        '<code>supplyAsync</code> starts work; <code>thenApply</code>, <code>thenCompose</code> chain the next steps.',
        '<code>thenCombine</code> and <code>allOf</code> join several futures.',
        '<code>exceptionally</code> / <code>handle</code> deal with errors.',
        'Default pool is the shared ForkJoinPool. Pass your own executor for blocking I/O.',
      ],
      detail: `<pre><code>CompletableFuture&lt;User&gt; user = CompletableFuture.supplyAsync(() -&gt; loadUser(id), pool);
user.thenApply(User::email)
    .thenAccept(this::sendWelcome)
    .exceptionally(ex -&gt; { log.error("failed", ex); return null; });</code></pre>`,
    },
    {
      title: 'Concurrent Collections',
      level: 'intermediate',
      summary:
        'Thread-safe collections built for many threads, faster than wrapping everything in synchronized.',
      simple:
        'A normal HashMap is a notebook only one person should write in. ConcurrentHashMap is a notebook built so many people can write at once.',
      points: [
        '<code>ConcurrentHashMap</code>: safe and fast. Use <code>merge</code>, <code>computeIfAbsent</code> for atomic updates.',
        '<code>CopyOnWriteArrayList</code>: copies on every write. Great for many reads, few writes (listeners).',
        '<code>BlockingQueue</code> (e.g. <code>ArrayBlockingQueue</code>): producer-consumer handoff; <code>put</code>/<code>take</code> wait.',
        'Check-then-act on any map (<code>if (!containsKey) put</code>) is still a race. Use the atomic methods.',
      ],
      detail: `<pre><code>Map&lt;String, Integer&gt; counts = new ConcurrentHashMap&lt;&gt;();
counts.merge(word, 1, Integer::sum); // atomic</code></pre>`,
    },
    {
      title: 'Deadlock & Friends',
      level: 'advanced',
      summary:
        'Liveness bugs: threads stuck forever (deadlock), busy but stuck (livelock), or never served (starvation).',
      simple:
        "Deadlock: two people each hold one chopstick and wait for the other's. Livelock: two people in a hallway both step aside the same way, again and again.",
      points: [
        'Deadlock: thread A holds lock 1 and wants 2, thread B holds 2 and wants 1.',
        'Fix: always take locks in the same global order, or use <code>tryLock</code> with a timeout.',
        'Livelock: threads keep reacting to each other and make no progress.',
        'Starvation: a thread never gets CPU or a lock because others always win.',
        'A thread dump (jcmd Thread.print) reports Java-level deadlocks for you.',
      ],
    },
    {
      title: 'ThreadLocal',
      level: 'advanced',
      summary: 'A variable where each thread has its own separate value.',
      simple:
        'Like each worker having their own locker with the same label. Everyone opens "my locker" but gets their own stuff.',
      points: [
        'Used for per-request context: user id, transaction, a non-thread-safe formatter.',
        'Pool threads live forever, so values stay too. Always <code>remove()</code> in <code>finally</code>.',
        "Forgetting remove() leaks memory and can leak one user's data into the next request.",
        'With millions of virtual threads, many ThreadLocal copies get expensive. Scoped values are the modern option.',
      ],
      detail: `<pre><code>static final ThreadLocal&lt;String&gt; USER = new ThreadLocal&lt;&gt;();

USER.set(userId);
try { handle(request); } finally { USER.remove(); }</code></pre>`,
    },
    {
      title: 'Virtual Threads',
      level: 'advanced',
      summary:
        'Very cheap threads managed by the JVM (final in Java 21), great for lots of blocking I/O.',
      simple:
        'A normal thread is a full-time employee: costly, so you keep few. Virtual threads are like tasks on a to-do list that a few employees pick up whenever someone else is waiting on the phone.',
      points: [
        'You can run millions of them; they sit on top of a few OS "carrier" threads.',
        'When a virtual thread blocks on I/O, it steps off its carrier so another can run.',
        'Best for I/O-heavy servers. No gain for CPU-heavy work.',
        'Do not pool them. Create one per task.',
        'Pinning: a blocked virtual thread can hold its carrier. Fixed for synchronized in Java 24; native calls still pin.',
        'Limit access to scarce resources (like DB connections) with a Semaphore, not pool size.',
      ],
      detail: `<pre><code>try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    for (String url : urls) {
        executor.submit(() -&gt; fetch(url)); // one virtual thread per task
    }
}</code></pre>`,
      tip: 'On Java 21–23, prefer ReentrantLock over synchronized around blocking calls to avoid pinning.',
      children: [
        {
          title: 'Structured Concurrency & Scoped Values',
          level: 'expert',
          summary:
            'Treat a group of subtasks as one unit, and share read-only context with them safely.',
          points: [
            'Structured concurrency (<code>StructuredTaskScope</code>): subtasks start and end inside one block, like a method call.',
            'If one subtask fails, the others are cancelled; no leaked threads.',
            'Still a preview API in Java 25 (needs <code>--enable-preview</code>), and its API changed between previews.',
            'Scoped values (<code>ScopedValue</code>): a read-only, bounded replacement for ThreadLocal. Final in Java 25.',
            'A scoped value is visible only inside <code>where(...).run(...)</code> and is cleaned up automatically.',
          ],
          detail: `<pre><code>static final ScopedValue&lt;String&gt; USER = ScopedValue.newInstance();

ScopedValue.where(USER, "alice").run(() -&gt; handle()); // USER.get() works inside</code></pre>`,
        },
      ],
    },
  ],
};
