import type { KmNode } from '../../types';

export const modern: KmNode = {
  title: 'Modern JS & Internals',
  level: 'intermediate',
  summary:
    'What each ECMAScript version added, how engines make JS fast, and the classic interview traps.',
  simple:
    'JavaScript gets a small upgrade every year, like a yearly phone update. Knowing which feature came when helps you read old code and pick modern patterns.',
  points: [
    'ES2015 (ES6) was the big jump; since then, one smaller version each June.',
    'Check support on MDN or caniuse before using the newest features.',
    'Expert level: know how the engine runs your code, not just what the code does.',
  ],
  children: [
    {
      title: 'ES2015 (ES6)',
      level: 'beginner',
      summary: 'The 2015 release that created modern JavaScript.',
      simple:
        'ES6 was like moving from a flip phone to a smartphone: same calls, but a whole new way of using it.',
      points: [
        '<code>let</code>/<code>const</code>, arrow functions, template literals, default and rest parameters.',
        'Destructuring, spread, shorthand object properties.',
        'Classes, modules (import/export), Promises.',
        'Map, Set, WeakMap, Symbol, iterators, generators, Proxy.',
      ],
    },
    {
      title: 'ES2016 – ES2020',
      level: 'intermediate',
      summary: 'Yearly additions that made async code and safe property access easy.',
      points: [
        'ES2016: <code>includes</code>, <code>**</code>. ES2017: <code>async</code>/<code>await</code>, <code>Object.entries</code>/<code>values</code>, <code>padStart</code>.',
        'ES2018: object rest/spread, <code>for await</code>, <code>Promise.finally</code>.',
        'ES2019: <code>flat</code>, <code>flatMap</code>, <code>Object.fromEntries</code>, optional catch binding.',
        'ES2020: <code>?.</code>, <code>??</code>, <code>BigInt</code>, <code>Promise.allSettled</code>, <code>globalThis</code>, dynamic <code>import()</code>.',
      ],
    },
    {
      title: 'ES2021 – ES2023',
      level: 'intermediate',
      summary: 'Class privacy, top-level await and copy-instead-of-mutate array methods.',
      points: [
        'ES2021: <code>??=</code>, <code>||=</code>, <code>&amp;&amp;=</code>, <code>replaceAll</code>, <code>Promise.any</code>, <code>1_000_000</code>, WeakRef.',
        'ES2022: class fields, <code>#private</code>, static blocks, top-level await, <code>.at()</code>, <code>Object.hasOwn</code>, <code>error.cause</code>.',
        'ES2023: <code>toSorted</code>, <code>toReversed</code>, <code>toSpliced</code>, <code>with</code>, <code>findLast</code>.',
      ],
    },
    {
      title: 'ES2024 and Newer',
      level: 'intermediate',
      summary: 'Grouping, Set math, lazy iterator helpers and more — the latest additions.',
      points: [
        'ES2024: <code>Object.groupBy</code>, <code>Map.groupBy</code>, <code>Promise.withResolvers</code>, regex <code>v</code> flag.',
        'ES2025: iterator helpers, Set methods (<code>union</code>, <code>intersection</code>…), JSON imports, <code>Promise.try</code>, <code>RegExp.escape</code>.',
        'Newer, rolling out: <code>Array.fromAsync</code>, <code>Error.isError</code>, Temporal (a modern replacement for <code>Date</code>).',
        '<code>using</code> declarations (automatic clean-up of resources) are also on the way.',
      ],
      detail: `<pre><code>const byStatus = Object.groupBy(orders, (o) =&gt; o.status);
// { paid: [...], pending: [...] }

new Set([1, 2, 3]).intersection(new Set([2, 3, 4])); // Set {2, 3}</code></pre>`,
      tip: 'Newest features may need a recent browser or Node version; check before you use them in production.',
    },
    {
      title: 'How Engines Run JS',
      level: 'expert',
      summary:
        'Engines parse code, run it in an interpreter, and JIT-compile hot functions using guesses about types.',
      simple:
        'The engine watches your code like a coach. When it sees you always do the same move, it builds a shortcut for it. If you suddenly change the move, it throws the shortcut away.',
      points: [
        'V8 pipeline: parse → Ignition (bytecode interpreter) → Sparkplug/Maglev → TurboFan (optimizing JIT).',
        'Hidden classes (shapes): objects created with the same keys in the same order share a shape.',
        'Inline caches remember where a property lives for a shape, so lookups are fast.',
        'Deoptimization: if types change (a number becomes a string), optimized code is thrown away.',
        'Tips: initialize all fields in the constructor, keep types stable, avoid <code>delete</code> on hot objects.',
      ],
      tip: 'Do not micro-optimize for the engine without profiling; readable code is usually fast enough.',
    },
    {
      title: 'Interview Traps',
      level: 'advanced',
      summary: 'The tricky questions that come up again and again, and how to explain them.',
      simple:
        'Most JS "puzzles" come from four things: coercion, scope, this and the event loop. Explain which one is at play and you have the answer.',
      points: [
        'Think out loud: name the rule first, then walk through the code.',
        'Know the classics below by heart; they cover most puzzle questions.',
      ],
      children: [
        {
          title: 'var in a Loop',
          level: 'intermediate',
          summary:
            'Callbacks in a var loop all see the final value, because there is only one shared variable.',
          points: [
            '<code>var</code> creates one variable for the whole function.',
            'By the time the timers run, the loop is done and <code>i</code> is 3.',
            '<code>let</code> creates a fresh binding for each loop round, so it prints 0, 1, 2.',
          ],
          detail: `<pre><code>for (var i = 0; i &lt; 3; i++) setTimeout(() =&gt; console.log(i)); // 3 3 3
for (let j = 0; j &lt; 3; j++) setTimeout(() =&gt; console.log(j)); // 0 1 2</code></pre>`,
        },
        {
          title: '0.1 + 0.2',
          level: 'intermediate',
          summary: '0.1 + 0.2 is 0.30000000000000004 because numbers are binary floating point.',
          points: [
            'Like 1/3 in decimal, 0.1 cannot be stored exactly in binary.',
            'Compare with a tolerance: <code>Math.abs(a - b) &lt; Number.EPSILON</code>.',
            'For money, use integer cents or a decimal library.',
            '<code>Number.MAX_SAFE_INTEGER</code> is 2^53 − 1; beyond that, use <code>BigInt</code>.',
          ],
        },
        {
          title: 'Coercion Puzzles',
          level: 'advanced',
          summary: 'Strange results like [] + [] === "" all come from the coercion rules.',
          points: [
            '<code>[] + []</code> → <code>""</code> (both become empty strings).',
            '<code>[] + {}</code> → <code>"[object Object]"</code>.',
            '<code>"b" + "a" + +"a" + "a"</code> → <code>"baNaNa"</code> (<code>+"a"</code> is NaN).',
            '<code>[] == ![]</code> → <code>true</code> (<code>![]</code> is false, then both become 0).',
            '<code>null &gt;= 0</code> is true but <code>null == 0</code> is false: different rules.',
          ],
          tip: 'The real answer to all of these: "use === and explicit conversions, and you never meet them."',
        },
        {
          title: 'Event Loop Order',
          level: 'advanced',
          summary:
            'Predict the log order: sync code first, then all microtasks, then the next task.',
          points: [
            'Code before the first <code>await</code> in an async function runs synchronously.',
            'Everything after an <code>await</code> is a microtask.',
            'Timers always come after promises queued in the same round.',
          ],
          detail: `<pre><code>async function f() { console.log("A"); await null; console.log("B"); }
setTimeout(() =&gt; console.log("C"));
f();
Promise.resolve().then(() =&gt; console.log("D"));
console.log("E");
// A, E, B, D, C</code></pre>`,
        },
        {
          title: 'map(parseInt)',
          level: 'advanced',
          summary:
            '["1","2","3"].map(parseInt) gives [1, NaN, NaN] because map passes the index as the radix.',
          points: [
            '<code>map</code> calls the callback with (value, index, array).',
            '<code>parseInt("2", 1)</code> → NaN (radix 1 is invalid); <code>parseInt("3", 2)</code> → NaN.',
            'Fix: <code>.map(Number)</code> or <code>.map((s) =&gt; parseInt(s, 10))</code>.',
          ],
          tip: 'Lesson: be careful passing a function directly as a callback when it takes optional extra parameters.',
        },
        {
          title: 'Write It Yourself',
          level: 'expert',
          summary: 'Common "implement from scratch" tasks that test your real understanding.',
          points: [
            '<code>debounce</code> / <code>throttle</code> (closures and timers).',
            '<code>Function.prototype.bind</code> polyfill (this and arguments).',
            '<code>Promise.all</code> (promises, ordering, early reject).',
            'Deep clone and deep equal (recursion, cycles, types).',
            'Event emitter with <code>on</code>/<code>off</code>/<code>emit</code> (Map of listener arrays).',
          ],
          detail: `<pre><code>function promiseAll(list) {
  return new Promise((resolve, reject) =&gt; {
    const out = []; let left = list.length;
    if (left === 0) return resolve(out);
    list.forEach((p, i) =&gt; Promise.resolve(p).then((v) =&gt; {
      out[i] = v;
      if (--left === 0) resolve(out);
    }, reject));
  });
}</code></pre>`,
        },
      ],
    },
  ],
};
