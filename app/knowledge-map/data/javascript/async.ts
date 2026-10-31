import type { KmNode } from '../../types';

export const asyncJs: KmNode = {
  title: 'Async JavaScript',
  level: 'intermediate',
  summary:
    'The event loop, and how callbacks, promises and async/await let one thread do many things.',
  simple:
    'JavaScript is a single waiter in a restaurant. He never stands still waiting for the kitchen: he takes an order, moves on, and comes back when the food is ready.',
  points: [
    'One main thread runs your code; slow work (network, timers, disk) happens outside it.',
    'The event loop decides what runs next.',
    'Evolution: callbacks → promises (ES2015) → async/await (ES2017).',
  ],
  children: [
    {
      title: 'Single Thread & Call Stack',
      level: 'intermediate',
      summary: 'JS runs one thing at a time; the call stack tracks which function is running now.',
      simple:
        'The call stack is a pile of plates. Calling a function puts a plate on top; returning takes it off. Only the top plate is being worked on.',
      points: [
        'One call stack per thread: while it is busy, nothing else in JS can run.',
        'A long loop blocks clicks, rendering and timers: the page "freezes".',
        'Too many nested calls → <code>RangeError: Maximum call stack size exceeded</code>.',
        'Objects live in the heap (a big memory area); the stack holds the current calls.',
      ],
    },
    {
      title: 'The Event Loop',
      level: 'intermediate',
      summary:
        'A loop that, whenever the call stack is empty, picks the next waiting job and runs it.',
      simple:
        'After serving each table, the waiter first handles all the urgent sticky notes (microtasks), then picks the next order from the queue (a task), and sometimes lets the kitchen repaint the room.',
      points: [
        'Runtime APIs (timers, fetch, file I/O) do the waiting and put callbacks in queues.',
        'Loop: run one task → run ALL microtasks → maybe render → repeat.',
        'Rendering happens between tasks, so long tasks delay screen updates.',
        'Node.js has the same idea, with extra phases (timers, I/O, check) handled by libuv.',
      ],
      tip: 'Interview: draw the call stack, the task queue and the microtask queue, then walk through the code.',
    },
    {
      title: 'Callbacks',
      level: 'beginner',
      summary: 'The original async style: pass a function that is called when the work is done.',
      simple: 'Leaving your phone number at a shop: "call me when my order arrives".',
      points: [
        'Node style: <code>(err, result) =&gt; {}</code> — error comes first.',
        'Nesting many steps leads to "callback hell" (a pyramid of code).',
        'Error handling must be repeated at every level.',
        'Risk: a buggy library might call your callback twice or never.',
      ],
      detail: `<pre><code>readFile("a.txt", (err, a) =&gt; {
  if (err) return done(err);
  readFile("b.txt", (err, b) =&gt; {
    if (err) return done(err);
    done(null, a + b);            // pyramid grows...
  });
});</code></pre>`,
    },
    {
      title: 'Promises',
      level: 'intermediate',
      summary: 'An object that stands for a value that will be ready later, or an error.',
      simple:
        'A promise is a restaurant buzzer. You get it right away; later it either buzzes "food ready" (fulfilled) or "sorry, sold out" (rejected).',
      points: [
        'States: pending → fulfilled or rejected (settled once, never changes again).',
        '<code>.then</code> returns a new promise, so you can chain steps flat.',
        'One <code>.catch</code> at the end handles errors from any step above.',
        '<code>.finally</code> runs on both outcomes (clean-up).',
        'Wrap old callback APIs with <code>new Promise((resolve, reject) =&gt; ...)</code> or <code>util.promisify</code>.',
      ],
      detail: `<pre><code>fetch("/api/user")
  .then((res) =&gt; res.json())
  .then((user) =&gt; fetch(\`/api/orders?user=\${user.id}\`))
  .then((res) =&gt; res.json())
  .catch((err) =&gt; console.error(err))
  .finally(() =&gt; hideSpinner());</code></pre>`,
      tip: 'Always return the promise inside .then; forgetting return breaks the chain silently.',
    },
    {
      title: 'async / await',
      level: 'intermediate',
      summary: 'Write promise code that reads like normal top-to-bottom code (ES2017).',
      simple:
        'await means "pause this function here until the buzzer rings". Meanwhile the waiter keeps serving other tables.',
      points: [
        'An <code>async</code> function always returns a promise.',
        '<code>await</code> pauses only this function, not the whole thread.',
        'Use normal <code>try/catch</code> for errors.',
        'Top-level <code>await</code> works in ES modules (ES2022).',
        'Awaiting in a loop runs things one after another; that is often slower than needed.',
      ],
      detail: `<pre><code>async function loadDashboard(id) {
  try {
    const user = await getUser(id);
    const orders = await getOrders(user.id);
    return { user, orders };
  } catch (err) {
    console.error("Load failed", err);
    throw err;
  }
}</code></pre>`,
    },
    {
      title: 'Promise Combinators',
      level: 'intermediate',
      summary: 'Run several promises together: all, allSettled, race and any.',
      points: [
        '<code>Promise.all</code>: waits for all; fails fast on the first rejection.',
        '<code>Promise.allSettled</code> (ES2020): waits for all, gives each result or error.',
        '<code>Promise.race</code>: first to settle wins (useful for timeouts).',
        '<code>Promise.any</code> (ES2021): first success wins; fails only if all fail.',
        'Start the work first, then await: that is what makes it parallel.',
      ],
      detail: `<pre><code>// Sequential: ~2s
const a = await getA(); const b = await getB();

// Parallel: ~1s
const [a2, b2] = await Promise.all([getA(), getB()]);</code></pre>`,
    },
    {
      title: 'Tasks vs Microtasks',
      level: 'advanced',
      summary:
        'Two queues: microtasks (promises) always run before the next task (timers, events).',
      simple:
        'Microtasks are the VIP line. Every time the stack is empty, the whole VIP line is served before the next normal customer.',
      points: [
        'Tasks (macrotasks): <code>setTimeout</code>, <code>setInterval</code>, events, I/O callbacks.',
        'Microtasks: promise <code>.then</code>/<code>await</code> continuations, <code>queueMicrotask</code>, <code>MutationObserver</code>.',
        'Microtasks added by microtasks run in the same round: endless ones starve the page.',
        '<code>setTimeout(fn, 0)</code> waits at least one full task turn (and browsers clamp nested timers to ~4 ms).',
        'Node: <code>process.nextTick</code> runs even before promise microtasks.',
      ],
      detail: `<pre><code>console.log("1");
setTimeout(() =&gt; console.log("2"), 0);
Promise.resolve().then(() =&gt; console.log("3"));
console.log("4");
// Output: 1, 4, 3, 2</code></pre>`,
    },
    {
      title: 'Async Pitfalls',
      level: 'advanced',
      summary:
        'The common async bugs: forgotten await, unhandled rejections, and async in forEach.',
      points: [
        'Forgot <code>await</code>? You get a pending promise instead of a value.',
        '<code>arr.forEach(async ...)</code> does not wait; use <code>for...of</code> or <code>Promise.all(arr.map(...))</code>.',
        'Unhandled rejections crash Node (since v15) and log errors in browsers.',
        'Fire-and-forget calls still need a <code>.catch</code>.',
        'Too many parallel requests? Limit concurrency (batches or a small pool).',
      ],
      tip: 'Turn on the ESLint rules no-floating-promises (typescript-eslint) or require-await to catch these early.',
    },
    {
      title: 'Cancellation & Timeouts',
      level: 'advanced',
      summary: 'Promises cannot be cancelled by themselves; use AbortController to stop work.',
      points: [
        'Pass <code>signal</code> to <code>fetch</code> and many Node APIs; call <code>controller.abort()</code> to stop.',
        '<code>AbortSignal.timeout(ms)</code> gives a signal that aborts by itself.',
        'Aborted work rejects with an <code>AbortError</code>; handle it separately from real errors.',
        'Cancel old requests when the user types again (search boxes) to avoid stale results.',
      ],
      detail: `<pre><code>const controller = new AbortController();
fetch("/api/search?q=js", { signal: controller.signal })
  .catch((e) =&gt; { if (e.name !== "AbortError") throw e; });
controller.abort();

await fetch(url, { signal: AbortSignal.timeout(5000) });</code></pre>`,
    },
  ],
};
