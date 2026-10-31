import type { KmNode } from '../../types';

export const advanced: KmNode = {
  title: 'Advanced Language',
  level: 'advanced',
  summary:
    'Iterators, generators, Map/Set/WeakMap, Symbols, Proxy, and functional, immutable code.',
  simple:
    'These are the power tools in the JS workshop. You will not use them every day, but they explain how for...of, libraries and frameworks really work.',
  points: [
    'Iterators and generators power for...of, spread and async streams.',
    'Map/Set fix many problems of using plain objects as dictionaries.',
    'Immutability makes state changes easy to track (React, Redux).',
  ],
  children: [
    {
      title: 'Map & Set',
      level: 'intermediate',
      summary: 'Map is a key → value store with any key type; Set holds unique values.',
      simple:
        'A Set is a guest list where nobody can be written twice. A Map is a coat check: any item can be the ticket.',
      points: [
        'Map keys can be objects, numbers, anything; insertion order is kept.',
        '<code>map.size</code>, <code>get</code>, <code>set</code>, <code>has</code>, <code>delete</code>.',
        'Better than plain objects for frequent adds/removes and unknown keys.',
        'Remove duplicates: <code>[...new Set(arr)]</code>.',
        'ES2025 adds Set methods: <code>union</code>, <code>intersection</code>, <code>difference</code>.',
      ],
      detail: `<pre><code>const visits = new Map();
visits.set(userObj, 3);
visits.get(userObj);           // 3

const unique = [...new Set(["a", "b", "a"])]; // ["a", "b"]</code></pre>`,
    },
    {
      title: 'Immutability',
      level: 'intermediate',
      summary:
        'Create new objects instead of changing existing ones, so changes are easy to track.',
      simple:
        'Instead of erasing and rewriting a page in a shared notebook, you write a new page. Everyone can see what changed and nobody is surprised.',
      points: [
        'Update with copies: <code>{ ...user, name }</code>, <code>[...items, newItem]</code>.',
        'Non-mutating array methods (ES2023): <code>toSorted</code>, <code>toReversed</code>, <code>toSpliced</code>, <code>with</code>.',
        '<code>Object.freeze</code> is shallow: nested objects can still change.',
        'React and Redux compare references, so mutating state breaks re-renders.',
        'Libraries like Immer let you write "mutating" code that produces copies.',
      ],
      detail: `<pre><code>const next = {
  ...state,
  todos: state.todos.map((t) =&gt; (t.id === id ? { ...t, done: true } : t)),
};</code></pre>`,
    },
    {
      title: 'Functional Patterns',
      level: 'advanced',
      summary:
        'Pure functions, composition, currying and memoization: small reusable pieces of logic.',
      points: [
        'Pure function: same input → same output, no side effects. Easy to test.',
        'Composition: build big functions from small ones: <code>pipe(trim, toLower, slugify)</code>.',
        'Currying: <code>f(a)(b)</code> instead of <code>f(a, b)</code>, to pre-fill arguments.',
        'Memoization: cache results of expensive pure functions (closures + Map).',
        'Keep side effects (DOM, network, logs) at the edges of your code.',
      ],
      detail: `<pre><code>const pipe = (...fns) =&gt; (x) =&gt; fns.reduce((v, f) =&gt; f(v), x);
const slug = pipe((s) =&gt; s.trim(), (s) =&gt; s.toLowerCase(), (s) =&gt; s.replaceAll(" ", "-"));
slug("  Hello World "); // "hello-world"</code></pre>`,
    },
    {
      title: 'WeakMap & WeakRef',
      level: 'advanced',
      summary: 'Collections that hold objects weakly, so they do not stop garbage collection.',
      points: [
        'WeakMap keys must be objects; when the key object is gone, the entry disappears.',
        'Not iterable and no <code>size</code>: you cannot list what is inside.',
        'Use for caches or private data attached to objects you do not own (e.g. DOM nodes).',
        '<code>WeakRef</code> and <code>FinalizationRegistry</code> (ES2021) exist, but timing is unpredictable; avoid unless needed.',
      ],
      tip: 'Interview: "Map keeps the key alive; WeakMap does not."',
    },
    {
      title: 'Iterators & Iterables',
      level: 'advanced',
      summary: 'A standard way to step through values one by one; what for...of and spread use.',
      simple:
        'An iterator is a ticket dispenser: each pull gives the next ticket, until it says "done".',
      points: [
        'An iterable has a <code>[Symbol.iterator]()</code> method returning an iterator.',
        'An iterator has <code>next()</code> returning <code>{ value, done }</code>.',
        'Built-in iterables: arrays, strings, Map, Set, NodeList, arguments.',
        'Plain objects are not iterable: use <code>Object.entries(obj)</code>.',
        'ES2025 iterator helpers: <code>.map</code>, <code>.filter</code>, <code>.take</code> work lazily on iterators.',
      ],
    },
    {
      title: 'Generators',
      level: 'advanced',
      summary:
        'Functions (function*) that can pause with yield and resume later, producing values on demand.',
      simple:
        'A generator is a storyteller who stops after each chapter and waits until you ask for the next one.',
      points: [
        'Calling a generator returns an iterator; nothing runs until <code>next()</code>.',
        'Good for lazy or infinite sequences (IDs, pagination).',
        'Async generators (<code>async function*</code>) + <code>for await...of</code> read streams page by page.',
        'Before async/await, libraries used generators to write async code.',
      ],
      detail: `<pre><code>function* ids() {
  let id = 1;
  while (true) yield id++;
}
const gen = ids();
gen.next().value; // 1
gen.next().value; // 2

for await (const page of fetchPages(url)) render(page);</code></pre>`,
    },
    {
      title: 'Symbols',
      level: 'advanced',
      summary: 'A primitive type for unique keys that never clash with other property names.',
      points: [
        '<code>Symbol("id")</code> is unique every time, even with the same description.',
        'Symbol keys are skipped by <code>for...in</code>, <code>Object.keys</code> and JSON.',
        'Well-known symbols hook into the language: <code>Symbol.iterator</code>, <code>Symbol.toPrimitive</code>.',
        '<code>Symbol.for("key")</code> shares one symbol across the whole app.',
      ],
    },
    {
      title: 'Proxy & Reflect',
      level: 'expert',
      summary: 'Proxy wraps an object and intercepts actions like get, set and delete.',
      simple:
        'A proxy is a personal assistant standing in front of an object: every request goes through them first, and they can log, check or change it.',
      points: [
        'Traps: <code>get</code>, <code>set</code>, <code>has</code>, <code>deleteProperty</code>, <code>apply</code>…',
        '<code>Reflect</code> has matching methods to do the default behavior inside a trap.',
        'Used by Vue 3 and MobX for reactivity, and for validation or logging.',
        'Proxies add overhead; avoid them in very hot code.',
      ],
      detail: `<pre><code>const watched = new Proxy(state, {
  set(target, key, value) {
    console.log(\`\${String(key)} changed\`);
    return Reflect.set(target, key, value);
  },
});</code></pre>`,
    },
  ],
};
