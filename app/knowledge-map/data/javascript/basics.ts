import type { KmNode } from '../../types';

export const basics: KmNode = {
  title: 'JavaScript Basics',
  level: 'beginner',
  summary: 'Where JavaScript runs, how you store values, its types, operators and control flow.',
  simple:
    'This is your starter kit. Once you can store values, compare them and make decisions with if and loops, you can already write small useful scripts.',
  points: [
    'JavaScript is dynamically typed: variables have no fixed type, values do.',
    'It runs in every browser and on servers with Node.js.',
    'Learn let/const, types and === first; most beginner bugs live there.',
  ],
  children: [
    {
      title: 'What is JavaScript?',
      level: 'beginner',
      summary: 'The programming language of the web, now also used for servers, tools and apps.',
      simple:
        'HTML is the skeleton of a page, CSS is the clothes, and JavaScript is the muscles that make it move and react when you click.',
      points: [
        'Created in 1995 in 10 days by Brendan Eich at Netscape.',
        'The official standard is called ECMAScript (ES); a new version ships every year.',
        'Dynamically typed, single-threaded, with first-class functions (functions are values).',
        'Not related to Java, despite the name. The name was a marketing move.',
      ],
      tip: 'Interview one-liner: "A single-threaded, dynamically typed language with an event loop for non-blocking work."',
    },
    {
      title: 'Where JS Runs',
      level: 'beginner',
      summary: 'In a browser, or on a server or laptop with Node.js, Deno or Bun.',
      simple:
        'The language is the same, but the toolbox differs. The browser gives you the page (DOM), Node.js gives you files and the network.',
      points: [
        'An engine runs the code: V8 (Chrome, Node, Deno), SpiderMonkey (Firefox), JavaScriptCore (Safari, Bun).',
        'The runtime (host) adds APIs: browser has <code>document</code>, <code>fetch</code>, <code>localStorage</code>.',
        'Node.js has <code>fs</code>, <code>http</code>, <code>process</code>, but no DOM.',
        'Engines first interpret your code, then a JIT compiler turns hot code into fast machine code.',
        'Global object: <code>window</code> in browsers, <code>global</code> in Node, <code>globalThis</code> everywhere.',
      ],
      detail: `<pre><code>// Same language, different hosts
console.log("hi");                        // works everywhere
document.title = "Hello";                 // browser only
const fs = await import("node:fs");       // Node only</code></pre>`,
    },
    {
      title: 'let, const & var',
      level: 'beginner',
      summary:
        'Three ways to declare a variable: const for fixed bindings, let for changing ones, var is legacy.',
      simple:
        'const is a label glued to a box: you can change what is inside the box, but not move the label. let is a label you can move. var is an old label with strange rules.',
      points: [
        'Use <code>const</code> by default, <code>let</code> when you must reassign.',
        '<code>let</code> and <code>const</code> are block-scoped: they live only inside <code>{ }</code>.',
        '<code>var</code> is function-scoped and hoisted as <code>undefined</code>; avoid it in new code.',
        '<code>const</code> does not freeze objects: <code>const a = []; a.push(1)</code> is fine.',
      ],
      detail: `<pre><code>const user = { name: "An" };
user.name = "Binh";   // OK: the object changes
// user = {};          // TypeError: reassigning a const

let count = 0;
count++;              // OK</code></pre>`,
      tip: 'Saying "const means immutable" is a classic interview mistake. It only means the variable cannot be reassigned.',
    },
    {
      title: 'Data Types',
      level: 'beginner',
      summary:
        'Seven primitive types plus objects. Primitives are copied by value, objects by reference.',
      simple:
        'A primitive is a sticky note with a value written on it; copying makes a new note. An object is a house; copying gives you another key to the same house.',
      points: [
        'Primitives: <code>string</code>, <code>number</code>, <code>bigint</code>, <code>boolean</code>, <code>undefined</code>, <code>null</code>, <code>symbol</code>.',
        'Everything else is an object: arrays, functions, dates, maps.',
        'All numbers are 64-bit floats, so <code>0.1 + 0.2 !== 0.3</code>. Use <code>bigint</code> for huge integers.',
        'Primitives are immutable: string methods return new strings.',
        '<code>undefined</code> = not set yet; <code>null</code> = set to "nothing" on purpose.',
      ],
      detail: `<pre><code>let a = 1;  let b = a;  b++;        // a is still 1
const x = { n: 1 };  const y = x;
y.n = 2;                            // x.n is 2 too (same object)</code></pre>`,
    },
    {
      title: 'typeof & Checks',
      level: 'beginner',
      summary: 'typeof tells you the type of a value, with a few famous quirks.',
      simple:
        'typeof is like asking a box "what are you?". Most answers are right, but a couple are historical jokes you have to remember.',
      points: [
        '<code>typeof null</code> is <code>"object"</code>: an old bug kept for compatibility.',
        '<code>typeof function(){}</code> is <code>"function"</code>; arrays say <code>"object"</code>.',
        'Check arrays with <code>Array.isArray(x)</code>.',
        'Check "null or undefined" with <code>x == null</code> or <code>x ?? fallback</code>.',
        '<code>Number.isNaN(x)</code> is safer than the global <code>isNaN</code>, which converts first.',
      ],
    },
    {
      title: 'Type Coercion',
      level: 'beginner',
      summary: 'JavaScript quietly converts values to another type when an operator needs it.',
      simple:
        'You hand a cashier "5" and 5 and ask for a total. Some cashiers glue them into "55", others add them to 10. JS does both, depending on the operator.',
      points: [
        '<code>+</code> with a string concatenates: <code>"5" + 1 === "51"</code>.',
        'Other math operators convert to numbers: <code>"5" - 1 === 4</code>.',
        'Falsy values: <code>false</code>, <code>0</code>, <code>-0</code>, <code>0n</code>, <code>""</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>. Everything else is truthy.',
        '<code>[]</code> and <code>{}</code> are truthy, even though they are empty.',
        'Convert on purpose: <code>Number(x)</code>, <code>String(x)</code>, <code>Boolean(x)</code>.',
      ],
      tip: 'Make conversions explicit. Code that relies on coercion is hard to read and easy to break.',
    },
    {
      title: 'Operators & Equality',
      level: 'beginner',
      summary: '=== compares value and type; == converts types first. Always prefer ===.',
      simple:
        '=== is a strict guard who checks your ID and your face. == is a relaxed guard who lets "1" in as 1.',
      points: [
        '<code>1 == "1"</code> is <code>true</code>; <code>1 === "1"</code> is <code>false</code>.',
        '<code>NaN === NaN</code> is <code>false</code>; use <code>Number.isNaN</code> or <code>Object.is</code>.',
        'Objects are equal only if they are the same object: <code>{} === {}</code> is <code>false</code>.',
        '<code>&amp;&amp;</code> and <code>||</code> return one of the values, not just true/false.',
        'Only accepted use of <code>==</code>: <code>x == null</code> to catch null and undefined together.',
      ],
      detail: `<pre><code>const name = input || "Guest";   // "" or 0 also become "Guest"
isAdmin &amp;&amp; showPanel();           // runs only if isAdmin is truthy
2 ** 10;                          // 1024 (power)</code></pre>`,
    },
    {
      title: '?? and ?.',
      level: 'beginner',
      summary:
        'Nullish coalescing (??) gives a default only for null/undefined; optional chaining (?.) stops safely.',
      simple:
        '?. is like knocking before entering each room: if a room does not exist, you just stop instead of crashing. ?? only fills in when the value is truly missing.',
      points: [
        '<code>a ?? b</code> uses b only if a is <code>null</code> or <code>undefined</code> (0 and "" are kept).',
        '<code>user?.address?.city</code> returns <code>undefined</code> instead of throwing.',
        'Works for calls too: <code>onDone?.()</code>.',
        'Assignment versions (ES2021): <code>a ??= 1</code>, <code>a ||= 1</code>, <code>a &amp;&amp;= 1</code>.',
      ],
      detail: `<pre><code>const page = query.page ?? 1;     // 0 stays 0
const page2 = query.page || 1;    // 0 becomes 1 (bug!)
const city = user?.address?.city ?? "unknown";</code></pre>`,
      tip: 'Use ?? for defaults when 0, false or "" are valid values.',
    },
    {
      title: 'Control Flow',
      level: 'beginner',
      summary:
        'if/else, switch, and loops (for, while, for...of, for...in) decide what runs and how often.',
      simple:
        'Control flow is the road map of your code: forks in the road (if), roundabouts you circle several times (loops).',
      points: [
        '<code>for...of</code> loops over values of arrays, strings, maps, sets.',
        '<code>for...in</code> loops over object keys (including inherited ones); avoid it for arrays.',
        '<code>switch</code> uses <code>===</code>; do not forget <code>break</code>.',
        '<code>break</code> leaves a loop, <code>continue</code> skips to the next round.',
        'Ternary for small choices: <code>const label = ok ? "Yes" : "No"</code>.',
      ],
      detail: `<pre><code>for (const n of [10, 20]) console.log(n);           // 10, 20
for (const key in { a: 1, b: 2 }) console.log(key); // "a", "b"
for (const [k, v] of Object.entries(obj)) { /* ... */ }</code></pre>`,
    },
    {
      title: 'Strings & Templates',
      level: 'beginner',
      summary:
        'Text values; template literals (backticks) let you insert values and write multi-line text.',
      simple:
        'A template literal is a form letter with blanks: "Dear ${name}". JavaScript fills in the blanks for you.',
      points: [
        'Three quotes: <code>\'single\'</code>, <code>"double"</code>, <code>`backtick`</code>.',
        'Insert values with <code>${expr}</code> inside backticks.',
        'Useful methods: <code>includes</code>, <code>startsWith</code>, <code>slice</code>, <code>split</code>, <code>trim</code>, <code>replaceAll</code>.',
        'Strings are immutable: methods always return a new string.',
      ],
      detail: `<pre><code>const name = "An";
const msg = \`Hello \${name},
you have \${3 + 2} new messages\`;
"a-b-c".split("-");   // ["a", "b", "c"]</code></pre>`,
    },
  ],
};
