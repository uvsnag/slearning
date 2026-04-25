// Interview data: javascript
// Auto-generated from pv.html
(function () {
  (window.__pvTopics = window.__pvTopics || []).push({
    id: 'javascript',
    name: 'JavaScript',
    icon: '🟨',
    questions: [
      {
        q: 'Explain the difference between var, let, and const.',
        difficulty: 'easy',
        a: `<ul>
<li><strong>var</strong>: function-scoped, hoisted (initialized as <code>undefined</code>), can be redeclared.</li>
<li><strong>let</strong>: block-scoped, hoisted but <strong>not initialized</strong> (TDZ – Temporal Dead Zone), cannot be redeclared.</li>
<li><strong>const</strong>: block-scoped, must be initialized at declaration, reference cannot be reassigned (but object contents can be mutated).</li>
</ul>
<pre>const arr = [1,2,3];
arr.push(4);       // ✅ OK – mutating content
arr = [5,6];       // ❌ TypeError – reassigning reference</pre>`,
      },
      {
        q: 'What is hoisting in JavaScript?',
        difficulty: 'medium',
        a: `<p>JavaScript moves declarations to the top of their scope during compilation.</p>
<ul>
<li><code>var</code>: hoisted and initialized as <code>undefined</code>.</li>
<li><code>let/const</code>: hoisted but NOT initialized → <strong>Temporal Dead Zone</strong>.</li>
<li>Function declarations: fully hoisted (body included).</li>
<li>Function expressions / arrow functions: only the variable is hoisted.</li>
</ul>
<pre>console.log(a); // undefined
console.log(b); // ReferenceError (TDZ)
var a = 1;
let b = 2;</pre>`,
      },
      {
        q: 'Explain closures in JavaScript. Give a practical example.',
        difficulty: 'medium',
        a: `<p>A <strong>closure</strong> is a function that remembers and accesses variables from its lexical scope, even when executed outside that scope.</p>
<pre>function createCounter() {
  let count = 0;              // enclosed variable
  return {
    increment: () => ++count,
    getCount: () => count
  };
}
const counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.getCount();  // 2</pre>
<div class="key-point">Common trick question: closures in a for loop with <code>var</code> all share the same variable. Use <code>let</code> or IIFE to fix.</div>
<pre>for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // prints 3, 3, 3
}
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // prints 0, 1, 2
}</pre>`,
      },
      {
        q: 'What is the event loop? Explain microtasks vs macrotasks.',
        difficulty: 'hard',
        a: `<p>JavaScript is <strong>single-threaded</strong>. The event loop processes the call stack, then:</p>
<ol>
<li>Run ALL <strong>microtasks</strong> (Promise callbacks, queueMicrotask, MutationObserver).</li>
<li>Run ONE <strong>macrotask</strong> (setTimeout, setInterval, I/O, UI rendering).</li>
<li>Repeat.</li>
</ol>
<pre>console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Output: 1, 4, 3, 2</pre>
<div class="key-point">Microtasks always execute before the next macrotask, even if macrotask was scheduled first.</div>`,
      },
      {
        q: 'Explain prototypal inheritance in JavaScript.',
        difficulty: 'hard',
        a: `<p>Every object has a hidden <code>[[Prototype]]</code> (accessible via <code>__proto__</code> or <code>Object.getPrototypeOf()</code>). Property lookup goes up the prototype chain.</p>
<pre>const animal = { speak() { return 'sound'; } };
const dog = Object.create(animal);
dog.bark = function() { return 'woof'; };

dog.bark();   // 'woof' – own property
dog.speak();  // 'sound' – found on prototype</pre>
<div class="key-point">Trick: <code>class</code> in JS is syntactic sugar over prototypal inheritance, NOT classical inheritance.</div>`,
      },
      {
        q: "What is the difference between '==' and '===' ?",
        difficulty: 'easy',
        a: `<ul>
<li><code>==</code> (loose equality): performs <strong>type coercion</strong> before comparing.</li>
<li><code>===</code> (strict equality): no coercion, types must match.</li>
</ul>
<pre>0 == ''       // true  (both coerced to 0)
0 === ''      // false (number !== string)
null == undefined  // true
null === undefined // false</pre>
<div class="key-point">Always use <code>===</code> unless you explicitly want coercion (e.g., <code>x == null</code> to check both null and undefined).</div>`,
      },
      {
        q: "Explain 'this' keyword in different contexts.",
        difficulty: 'hard',
        a: `<ul>
<li><strong>Global</strong>: <code>window</code> (browser) or <code>global</code> (Node). In strict mode: <code>undefined</code>.</li>
<li><strong>Object method</strong>: the object before the dot.</li>
<li><strong>Constructor (new)</strong>: the newly created object.</li>
<li><strong>Arrow function</strong>: inherits <code>this</code> from enclosing lexical scope (NOT own <code>this</code>).</li>
<li><strong>call/apply/bind</strong>: explicitly set <code>this</code>.</li>
</ul>
<pre>const obj = {
  name: 'Alice',
  greet: function() { return this.name; },     // 'Alice'
  greetArrow: () => this.name                   // undefined (lexical this = global)
};</pre>`,
      },
      {
        q: 'What is the difference between call(), apply(), and bind()?',
        difficulty: 'medium',
        a: `<ul>
<li><code>call(thisArg, arg1, arg2)</code> – invokes immediately with individual args.</li>
<li><code>apply(thisArg, [args])</code> – invokes immediately with array of args.</li>
<li><code>bind(thisArg, arg1)</code> – returns a NEW function with bound <code>this</code> (does NOT invoke).</li>
</ul>
<pre>function greet(greeting) { return greeting + ' ' + this.name; }
const user = { name: 'Bob' };
greet.call(user, 'Hi');   // 'Hi Bob'
greet.apply(user, ['Hi']); // 'Hi Bob'
const bound = greet.bind(user, 'Hi');
bound(); // 'Hi Bob'</pre>`,
      },
      {
        q: 'Explain Promises, async/await, and error handling patterns.',
        difficulty: 'medium',
        a: `<p>A <strong>Promise</strong> represents an asynchronous operation: pending → fulfilled | rejected.</p>
<pre>// Promise chaining
fetchUser(id)
  .then(user => fetchOrders(user.id))
  .then(orders => process(orders))
  .catch(err => handleError(err))
  .finally(() => cleanup());

// async/await (syntactic sugar)
async function getOrders(id) {
  try {
    const user = await fetchUser(id);
    const orders = await fetchOrders(user.id);
    return process(orders);
  } catch (err) {
    handleError(err);
  }
}</pre>
<div class="key-point">Common pattern: <code>Promise.all()</code> for parallel, <code>Promise.allSettled()</code> when you want all results regardless of rejections.</div>`,
      },
      {
        q: 'What is debounce vs throttle? Implement debounce.',
        difficulty: 'medium',
        a: `<ul>
<li><strong>Debounce</strong>: waits until user STOPS triggering for X ms, then fires once. Use for: search input, resize.</li>
<li><strong>Throttle</strong>: fires at most once every X ms. Use for: scroll, mousemove.</li>
</ul>
<pre>function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const search = debounce((query) => {
  fetch('/api/search?q=' + encodeURIComponent(query));
}, 300);</pre>`,
      },
      {
        q: 'What are WeakMap and WeakSet? When to use them?',
        difficulty: 'hard',
        a: `<ul>
<li><strong>WeakMap</strong>: keys must be objects. Keys are held <strong>weakly</strong> → if no other reference to key, it gets garbage collected.</li>
<li><strong>WeakSet</strong>: same but for values (objects only).</li>
<li>Not iterable, no <code>size</code> property.</li>
</ul>
<p><strong>Use cases</strong>: caching computed data per DOM element, tracking visited objects without preventing GC, private data storage.</p>
<pre>const cache = new WeakMap();
function process(obj) {
  if (cache.has(obj)) return cache.get(obj);
  const result = expensiveComputation(obj);
  cache.set(obj, result);
  return result;
}</pre>`,
      },
      {
        q: 'Explain event delegation and event bubbling/capturing.',
        difficulty: 'medium',
        a: `<ul>
<li><strong>Capturing</strong> phase: event goes from window → target element.</li>
<li><strong>Target</strong> phase: event reaches the target.</li>
<li><strong>Bubbling</strong> phase: event goes from target → window.</li>
</ul>
<p><strong>Event delegation</strong>: attach ONE listener on a parent instead of many on children. Relies on bubbling.</p>
<pre>document.getElementById('list').addEventListener('click', (e) => {
  if (e.target.matches('li.item')) {
    handleClick(e.target);
  }
});</pre>
<div class="key-point">Benefits: fewer listeners, works with dynamically added elements.</div>`,
      },
      {
        q: 'What are generators and iterators in JavaScript?',
        difficulty: 'hard',
        a: `<p>A <strong>generator</strong> function (<code>function*</code>) can pause and resume execution using <code>yield</code>.</p>
<pre>function* fibonacci() {
  let [a, b] = [0, 1];
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}
const gen = fibonacci();
gen.next(); // {value: 0, done: false}
gen.next(); // {value: 1, done: false}
gen.next(); // {value: 1, done: false}</pre>
<div class="key-point">Generators implement the <strong>iterator protocol</strong> (<code>Symbol.iterator</code> + <code>next()</code>). Used in: custom iterables, redux-saga, lazy evaluation.</div>`,
      },
      {
        q: 'What is the difference between deep copy and shallow copy?',
        difficulty: 'medium',
        a: `<ul>
<li><strong>Shallow copy</strong>: copies top-level properties. Nested objects share references. Methods: spread <code>{...obj}</code>, <code>Object.assign()</code>.</li>
<li><strong>Deep copy</strong>: recursively copies all levels. Methods: <code>structuredClone()</code> (modern), <code>JSON.parse(JSON.stringify())</code> (loses functions/dates/undefined).</li>
</ul>
<pre>const original = { a: 1, b: { c: 2 } };
const shallow = { ...original };
shallow.b.c = 99; // original.b.c is ALSO 99!

const deep = structuredClone(original);
deep.b.c = 99;    // original.b.c is still 2</pre>`,
      },
      {
        q: 'Explain the Module pattern, CommonJS, and ES Modules.',
        difficulty: 'medium',
        a: `<ul>
<li><strong>Module pattern (IIFE)</strong>: encapsulates private state. Pre-modules era.</li>
<li><strong>CommonJS</strong>: <code>require()</code> / <code>module.exports</code>. Synchronous. Node.js default.</li>
<li><strong>ES Modules</strong>: <code>import</code> / <code>export</code>. Static, async. Browsers &amp; modern Node.</li>
</ul>
<pre>// ES Module
export const add = (a, b) => a + b;
import { add } from './math.js';

// CommonJS
const add = (a, b) => a + b;
module.exports = { add };
const { add } = require('./math');</pre>
<div class="key-point">ES Modules are statically analyzable → enables tree-shaking by bundlers (Vite, webpack).</div>`,
      },
      {
        q: 'What is currying in JavaScript?',
        difficulty: 'tricky',
        a: `<p><strong>Currying</strong> transforms <code>f(a, b, c)</code> into <code>f(a)(b)(c)</code>. Each call returns a new function expecting the next argument.</p>
<pre>const curry = (fn) => {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
};

const add = curry((a, b, c) => a + b + c);
add(1)(2)(3);   // 6
add(1, 2)(3);   // 6
add(1)(2, 3);   // 6</pre>
<div class="key-point">Use cases: creating reusable partial configurations, event handlers, middleware composition.</div>`,
      },
      {
        q: 'What is the output? (Tricky type coercion questions)',
        difficulty: 'tricky',
        a: `<pre>[] + []          // "" (both coerced to "")
[] + {}          // "[object Object]"
{} + []          // 0 (in console, {} parsed as block)
true + true      // 2
'5' - 3          // 2 (- triggers numeric coercion)
'5' + 3          // "53" (+ triggers string concat)
null + 1         // 1
undefined + 1    // NaN
typeof null      // "object" (historical bug)
typeof NaN       // "number"
NaN === NaN      // false (use Number.isNaN())</pre>`,
      },
      {
        q: 'Explain Proxy and Reflect in JavaScript.',
        difficulty: 'hard',
        a: `<p><strong>Proxy</strong> wraps an object and intercepts operations (get, set, has, deleteProperty, etc.).</p>
<pre>const handler = {
  get(target, prop) {
    return prop in target ? target[prop] : \`Property '\${prop}' not found\`;
  },
  set(target, prop, value) {
    if (typeof value !== 'number') throw TypeError('Must be number');
    target[prop] = value;
    return true;
  }
};
const obj = new Proxy({}, handler);
obj.x = 42;       // OK
obj.x = 'hello';  // TypeError</pre>
<div class="key-point"><strong>Reflect</strong> provides default implementations for Proxy traps. Use <code>Reflect.get(target, prop)</code> inside handlers to forward to default behavior.</div>`,
      },
      {
        q: 'What is the difference between null and undefined?',
        difficulty: 'easy',
        a: `<ul>
<li><strong>undefined</strong>: variable declared but not assigned. Also: missing function args, missing object properties, functions with no return.</li>
<li><strong>null</strong>: intentionally assigned "no value". Must be set explicitly.</li>
</ul>
<pre>let a;             // undefined (declared, not assigned)
let b = null;      // null (intentionally empty)

typeof undefined   // "undefined"
typeof null        // "object" (historical bug!)

null == undefined  // true (loose equality)
null === undefined // false (strict equality)

// Default parameter only triggers on undefined, NOT null
function greet(name = 'World') { return 'Hello ' + name; }
greet(undefined); // "Hello World"
greet(null);      // "Hello null"</pre>
<div class="key-point">Trick: <code>typeof null === "object"</code> is a famous JavaScript bug from the first implementation that can never be fixed for backward compatibility.</div>`,
      },
      {
        q: 'Explain the difference between map(), forEach(), filter(), reduce(), and find().',
        difficulty: 'medium',
        a: `<ul>
<li><strong>map()</strong>: transforms each element, returns NEW array.</li>
<li><strong>forEach()</strong>: executes function on each element, returns <code>undefined</code>. Cannot be chained.</li>
<li><strong>filter()</strong>: returns NEW array with elements that pass the test.</li>
<li><strong>reduce()</strong>: reduces array to a single value (sum, object, etc.).</li>
<li><strong>find()</strong>: returns FIRST element that passes the test (or undefined).</li>
</ul>
<pre>const nums = [1, 2, 3, 4, 5];

nums.map(n => n * 2);        // [2, 4, 6, 8, 10]
nums.filter(n => n > 3);     // [4, 5]
nums.find(n => n > 3);       // 4 (first match only)
nums.reduce((sum, n) => sum + n, 0); // 15

// forEach returns undefined — can't chain!
const result = nums.forEach(n => n * 2); // undefined ❌

// Common trick: chaining
const total = nums
  .filter(n => n % 2 === 0)   // [2, 4]
  .map(n => n * 10)            // [20, 40]
  .reduce((sum, n) => sum + n, 0); // 60</pre>
<div class="key-point">Trick question: "Can you break out of forEach()?" — NO! Use <code>for...of</code> or <code>find()</code>/<code>some()</code> if you need to stop early.</div>`,
      },
      {
        q: 'What is the spread operator vs rest parameters?',
        difficulty: 'medium',
        a: `<ul>
<li><strong>Spread <code>...</code></strong>: expands an iterable into individual elements.</li>
<li><strong>Rest <code>...</code></strong>: collects remaining arguments into an array.</li>
</ul>
<pre>// Spread: expanding
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];   // [1, 2, 3, 4, 5]
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }
Math.max(...arr1);               // 3

// Rest: collecting
function sum(...nums) {          // nums = [1, 2, 3]
  return nums.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3); // 6

// Destructuring with rest
const [first, ...rest] = [1, 2, 3, 4];
// first = 1, rest = [2, 3, 4]
const { a, ...others } = { a: 1, b: 2, c: 3 };
// a = 1, others = { b: 2, c: 3 }</pre>
<div class="key-point">Trick: Spread creates a SHALLOW copy. <code>const copy = {...obj}</code> doesn't deep-copy nested objects.</div>`,
      },
      {
        q: 'What are template literals and tagged templates?',
        difficulty: 'medium',
        a: `<pre>// Template literals: backtick strings with expressions
const name = 'World';
const greeting = \`Hello \${name}!\`;      // "Hello World!"
const multiline = \`Line 1
Line 2\`;  // preserves newlines

// Tagged templates: function that processes template literal
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) =>
    result + str + (values[i] ? \`<b>\${values[i]}</b>\` : ''), '');
}
const user = 'Alice';
const age = 30;
highlight\`\${user} is \${age} years old\`;
// "Alice</b> is <b>30</b> years old"

// Practical: SQL query safety (libraries use this)
// css\`color: red;\` in styled-components
// html\`<div>\${content}</div>\` in lit-html
// gql\`query { user { name } }\` in GraphQL</pre>`,
      },
      {
        q: 'What is destructuring in JavaScript?',
        difficulty: 'easy',
        a: `<pre>// Array destructuring
const [a, b, c] = [1, 2, 3];       // a=1, b=2, c=3
const [first, , third] = [1, 2, 3]; // skip second: first=1, third=3
const [x = 10, y = 20] = [5];      // defaults: x=5, y=20

// Object destructuring
const { name, age } = { name: 'Alice', age: 30, city: 'NYC' };
const { name: userName } = { name: 'Alice' }; // rename: userName = 'Alice'
const { a: { b } } = { a: { b: 42 } };       // nested: b = 42

// Function parameter destructuring
function greet({ name, age = 0 }) {
  return \`\${name} is \${age}\`;
}
greet({ name: 'Bob' }); // "Bob is 0"

// Swap variables
let x = 1, y = 2;
[x, y] = [y, x]; // x=2, y=1</pre>
<div class="key-point">Trick: <code>const { length } = 'hello'; // length = 5</code> — works because strings have a .length property!</div>`,
      },
      {
        q: 'What is the difference between arrow functions and regular functions?',
        difficulty: 'tricky',
        a: `<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
<tr><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;">Feature</th><th style="padding:6px;border-bottom:1px solid #ccc;">Regular Function</th><th style="padding:6px;border-bottom:1px solid #ccc;">Arrow Function</th></tr>
<tr><td style="padding:6px;"><code>this</code></td><td style="padding:6px;">Own this (depends on call site)</td><td style="padding:6px;">Lexical this (from parent scope)</td></tr>
<tr><td style="padding:6px;"><code>arguments</code></td><td style="padding:6px;">Has arguments object</td><td style="padding:6px;">No arguments (use rest ...args)</td></tr>
<tr><td style="padding:6px;">Constructor</td><td style="padding:6px;">Can use <code>new</code></td><td style="padding:6px;">Cannot use <code>new</code></td></tr>
<tr><td style="padding:6px;"><code>prototype</code></td><td style="padding:6px;">Has .prototype</td><td style="padding:6px;">No .prototype</td></tr>
<tr><td style="padding:6px;">Methods</td><td style="padding:6px;">Good as object methods</td><td style="padding:6px;">Bad as object methods</td></tr>
</table>
<pre>const obj = {
  name: 'Alice',
  // Regular: 'this' is obj
  greet() { return this.name; },        // 'Alice' ✅
  // Arrow: 'this' is outer scope (window/undefined)
  greetArrow: () => this.name,           // undefined ❌
};

// Arrow functions don't have 'arguments'
function regular() { console.log(arguments); }
regular(1, 2); // [1, 2]
const arrow = () => { console.log(arguments); };
arrow(1, 2);   // ReferenceError (or outer arguments)

// Cannot use 'new' with arrow
const Foo = () => {};
new Foo(); // TypeError: Foo is not a constructor</pre>
<div class="key-point">Use arrow functions for callbacks and closures. Use regular functions for object methods and constructors.</div>`,
      },
      {
        q: 'What is the output? (Tricky setTimeout + closure question)',
        difficulty: 'tricky',
        a: `<pre>// Question 1: What prints?
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Answer: 3, 3, 3 (var is function-scoped, all closures share same i)

// Fix with let (block-scoped):
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// Answer: 0, 1, 2

// Question 2: What prints?
console.log('a');
setTimeout(() => console.log('b'), 0);
Promise.resolve().then(() => console.log('c'));
console.log('d');
// Answer: a, d, c, b
// (sync first, then microtask, then macrotask)

// Question 3: What prints?
const promise = new Promise((resolve) => {
  console.log(1);
  resolve(2);
  console.log(3);
});
promise.then(val => console.log(val));
console.log(4);
// Answer: 1, 3, 4, 2
// Promise constructor runs synchronously! .then is microtask</pre>`,
      },
      {
        q: 'What is optional chaining (?.) and nullish coalescing (??)?',
        difficulty: 'easy',
        a: `<pre>// Optional chaining (?.) — safe property access
const user = { address: { city: 'NYC' } };
user?.address?.city;     // 'NYC'
user?.phone?.number;     // undefined (no error!)
user?.getName?.();       // undefined if getName doesn't exist

// Without ?. → would throw TypeError
// user.phone.number     // TypeError: Cannot read property 'number' of undefined

// Nullish coalescing (??) — fallback for null/undefined ONLY
const name = null ?? 'Default';      // 'Default'
const count = 0 ?? 42;               // 0 (0 is NOT null/undefined)
const empty = '' ?? 'fallback';      // '' (empty string is NOT null/undefined)

// vs OR (||) — fallback for ALL falsy values
const count2 = 0 || 42;              // 42 (0 is falsy!)
const empty2 = '' || 'fallback';     // 'fallback' ('' is falsy!)</pre>
<div class="key-point">Use <code>??</code> when 0, '', and false are valid values. Use <code>||</code> only when you want to treat all falsy values as "missing".</div>`,
      },
      {
        q: 'What is the difference between Object.freeze(), Object.seal(), and Object.preventExtensions()?',
        difficulty: 'tricky',
        a: `<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
<tr><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;">Method</th><th style="padding:6px;border-bottom:1px solid #ccc;">Add Props</th><th style="padding:6px;border-bottom:1px solid #ccc;">Delete Props</th><th style="padding:6px;border-bottom:1px solid #ccc;">Modify Values</th></tr>
<tr><td style="padding:6px;">preventExtensions</td><td style="padding:6px;">❌</td><td style="padding:6px;">✅</td><td style="padding:6px;">✅</td></tr>
<tr><td style="padding:6px;">seal</td><td style="padding:6px;">❌</td><td style="padding:6px;">❌</td><td style="padding:6px;">✅</td></tr>
<tr><td style="padding:6px;">freeze</td><td style="padding:6px;">❌</td><td style="padding:6px;">❌</td><td style="padding:6px;">❌</td></tr>
</table>
<pre>const obj = { a: 1, b: { c: 2 } };
Object.freeze(obj);
obj.a = 99;       // silently fails (or throws in strict mode)
obj.d = 4;        // silently fails
obj.b.c = 99;     // ✅ WORKS! freeze is SHALLOW

// Deep freeze
function deepFreeze(obj) {
  Object.freeze(obj);
  Object.values(obj).forEach(val => {
    if (typeof val === 'object' && val !== null) deepFreeze(val);
  });
}</pre>
<div class="key-point">Trick: <code>Object.freeze()</code> is SHALLOW — nested objects can still be mutated. You need a recursive deep freeze for full immutability.</div>`,
      },
      {
        q: 'What are Symbols in JavaScript? What are well-known Symbols?',
        difficulty: 'hard',
        a: `<p><strong>Symbol</strong> is a unique, immutable primitive type. Every Symbol() is guaranteed unique.</p>
<pre>const s1 = Symbol('id');
const s2 = Symbol('id');
s1 === s2;  // false (always unique!)

// Use as unique object keys (no collision)
const ID = Symbol('id');
const user = { [ID]: 123, name: 'Alice' };
user[ID];       // 123
Object.keys(user);  // ['name'] (Symbols are hidden from for...in, Object.keys)

// Well-known Symbols: customize built-in behavior
class Range {
  constructor(start, end) { this.start = start; this.end = end; }
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;
    return {
      next() {
        return current <= end
          ? { value: current++, done: false }
          : { done: true };
      }
    };
  }
}
[...new Range(1, 5)]; // [1, 2, 3, 4, 5]

// Symbol.toPrimitive: customize type conversion
class Money {
  constructor(amount) { this.amount = amount; }
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') return this.amount;
    return \`$\${this.amount}\`;
  }
}
+new Money(42);        // 42
\`Price: \${new Money(42)}\`; // "Price: $42"</pre>`,
      },
      {
        q: 'What is the difference between Set, Map, WeakSet, WeakMap, and plain Objects?',
        difficulty: 'tricky',
        a: `<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
<tr><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;"></th><th style="padding:6px;border-bottom:1px solid #ccc;">Object</th><th style="padding:6px;border-bottom:1px solid #ccc;">Map</th><th style="padding:6px;border-bottom:1px solid #ccc;">Set</th><th style="padding:6px;border-bottom:1px solid #ccc;">WeakMap</th></tr>
<tr><td style="padding:6px;">Keys</td><td style="padding:6px;">String/Symbol</td><td style="padding:6px;">Any type</td><td style="padding:6px;">N/A (values)</td><td style="padding:6px;">Objects only</td></tr>
<tr><td style="padding:6px;">Ordered</td><td style="padding:6px;">Sort of</td><td style="padding:6px;">Insertion order</td><td style="padding:6px;">Insertion order</td><td style="padding:6px;">N/A</td></tr>
<tr><td style="padding:6px;">Size</td><td style="padding:6px;">Manual</td><td style="padding:6px;">.size</td><td style="padding:6px;">.size</td><td style="padding:6px;">N/A</td></tr>
<tr><td style="padding:6px;">Iterable</td><td style="padding:6px;">No (need Object.keys)</td><td style="padding:6px;">Yes</td><td style="padding:6px;">Yes</td><td style="padding:6px;">No</td></tr>
<tr><td style="padding:6px;">GC</td><td style="padding:6px;">Strong ref</td><td style="padding:6px;">Strong ref</td><td style="padding:6px;">Strong ref</td><td style="padding:6px;">Weak ref</td></tr>
</table>
<pre>// Map vs Object: Map allows any key type
const map = new Map();
const objKey = { id: 1 };
map.set(objKey, 'value'); // object as key!
map.size; // 1

// Set: unique values only
const set = new Set([1, 2, 2, 3, 3]);
[...set]; // [1, 2, 3] — duplicates removed

// Practical: remove duplicates from array
const unique = [...new Set(array)];</pre>
<div class="key-point">Use <code>Map</code> over plain objects when keys are non-strings, you need ordered iteration, or frequent add/remove. Use <code>Set</code> for unique values and fast <code>.has()</code> checks.</div>`,
      },

      //       {
      // id: 'js-advanced',
      // name: 'JS Advanced',
      // icon: '🟨+',
      // questions: [
      {
        q: 'What is the difference between Promise.all, Promise.allSettled, Promise.race, and Promise.any?',
        difficulty: 'hard',
        a: `<pre>const p1 = Promise.resolve(1);
const p2 = Promise.reject('error');
const p3 = Promise.resolve(3);

// Promise.all: ALL must succeed. Rejects on FIRST failure.
Promise.all([p1, p2, p3])
  .catch(err => err);  // 'error' (fast-fail)

// Promise.allSettled: Wait for ALL (success or failure). Never rejects.
Promise.allSettled([p1, p2, p3])
  .then(results => results);
  // [{ status: 'fulfilled', value: 1 },
  //  { status: 'rejected', reason: 'error' },
  //  { status: 'fulfilled', value: 3 }]

// Promise.race: Returns FIRST settled (success OR failure).
Promise.race([
  fetch('/fast-api'),    // resolves in 100ms → wins!
  fetch('/slow-api'),    // resolves in 500ms
]);

// Promise.any: Returns FIRST SUCCESS. Ignores rejections.
Promise.any([p2, p1, p3])
  .then(val => val);  // 1 (first success, skips rejection)</pre>
<table><tr><th>Method</th><th>Resolves when</th><th>Rejects when</th></tr>
<tr><td>all</td><td>ALL succeed</td><td>ANY fails (fast-fail)</td></tr>
<tr><td>allSettled</td><td>ALL settle</td><td>Never rejects</td></tr>
<tr><td>race</td><td>FIRST settles</td><td>FIRST settles (if rejection)</td></tr>
<tr><td>any</td><td>FIRST succeeds</td><td>ALL fail (AggregateError)</td></tr>
</table>
<div class="key-point">Use <code>Promise.all</code> when all results are needed. <code>Promise.allSettled</code> when you want all results regardless of failures. <code>Promise.race</code> for timeouts. <code>Promise.any</code> for redundancy (first working API).</div>`,
      },
      {
        q: 'What is the difference between for...in and for...of?',
        difficulty: 'tricky',
        a: `<pre>const arr = ['a', 'b', 'c'];

// for...in: iterates over KEYS (indices for arrays, properties for objects)
for (const key in arr) {
  console.log(key);   // '0', '1', '2' (strings, not numbers!)
}

// for...of: iterates over VALUES (works on iterables: arrays, strings, Maps, Sets)
for (const value of arr) {
  console.log(value); // 'a', 'b', 'c'
}

// for...in on objects (common use case):
const obj = { name: 'John', age: 30 };
for (const key in obj) {
  console.log(key, obj[key]); // 'name' 'John', 'age' 30
}

// ❌ for...of on objects — doesn't work!
for (const value of obj) { } // TypeError: obj is not iterable

// ✅ for...of on objects — use Object.entries():
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}

// Gotcha: for...in includes inherited properties!
arr.customProp = 'oops';
for (const key in arr) { console.log(key); } // '0','1','2','customProp'!
for (const value of arr) { console.log(value); } // 'a','b','c' (no customProp)</pre>
<div class="key-point"><code>for...in</code> = keys/properties (use for objects). <code>for...of</code> = values (use for arrays, strings, iterables). Avoid <code>for...in</code> on arrays — it includes inherited properties.</div>`,
      },
      {
        q: 'What is the Temporal Dead Zone (TDZ)?',
        difficulty: 'tricky',
        a: `<p>The <strong>TDZ</strong> is the period between entering a scope and the variable being declared where <code>let</code>/<code>const</code> variables exist but cannot be accessed.</p>
<pre>// var: hoisted and initialized to undefined — no TDZ
console.log(a); // undefined
var a = 5;

// let/const: hoisted but NOT initialized — TDZ
console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 5;

// TDZ in blocks:
{
  // TDZ starts here for 'x'
  console.log(x); // ReferenceError
  let x = 10;     // TDZ ends here
  console.log(x); // 10
}

// Tricky: TDZ applies to function parameters too
function test(a = b, b = 1) { }
test(); // ReferenceError: 'b' used before initialization

// TDZ with typeof (surprising!)
typeof undeclaredVar;   // 'undefined' (no error — not declared at all)
typeof declaredLet;     // ReferenceError (in TDZ — declared but not initialized)
let declaredLet = 5;</pre>
<div class="key-point">TDZ prevents using variables before they're properly initialized. It catches bugs that <code>var</code>'s hoisting would silently allow. Always declare variables at the top of their scope.</div>`,
      },
      {
        q: 'What is Object.freeze vs Object.seal vs Object.preventExtensions?',
        difficulty: 'medium',
        a: `<pre>const obj = { name: 'John', age: 30 };

// Object.preventExtensions: can't ADD new properties
Object.preventExtensions(obj);
obj.email = 'test';  // ❌ silently fails (or throws in strict mode)
obj.name = 'Jane';   // ✅ can modify existing
delete obj.age;      // ✅ can delete

// Object.seal: can't ADD or DELETE properties
Object.seal(obj);
obj.email = 'test';  // ❌ can't add
delete obj.name;     // ❌ can't delete
obj.name = 'Jane';   // ✅ can modify existing values

// Object.freeze: can't ADD, DELETE, or MODIFY
Object.freeze(obj);
obj.email = 'test';  // ❌ can't add
delete obj.name;     // ❌ can't delete
obj.name = 'Jane';   // ❌ can't modify

// ⚠️ All are SHALLOW!
const nested = { a: { b: 1 } };
Object.freeze(nested);
nested.a.b = 99;     // ✅ works! Nested object is NOT frozen

// Deep freeze:
function deepFreeze(obj) {
  Object.freeze(obj);
  Object.values(obj).forEach(val => {
    if (typeof val === 'object' && val !== null) deepFreeze(val);
  });
  return obj;
}</pre>
<table><tr><th>Feature</th><th>preventExtensions</th><th>seal</th><th>freeze</th></tr>
<tr><td>Add properties</td><td>❌</td><td>❌</td><td>❌</td></tr>
<tr><td>Delete properties</td><td>✅</td><td>❌</td><td>❌</td></tr>
<tr><td>Modify values</td><td>✅</td><td>✅</td><td>❌</td></tr>
</table>
<div class="key-point">All three are <strong>shallow</strong>. Nested objects remain mutable. Use <code>Object.freeze</code> for constants, config objects, and <code>as const</code> in TypeScript.</div>`,
      },
      {
        q: 'What is event loop blocking and how to avoid it?',
        difficulty: 'hard',
        a: `<pre>// ❌ Blocking the event loop (UI freezes, server stops responding)
function heavyComputation() {
  for (let i = 0; i &lt; 10_000_000_000; i++) {
    // CPU-intensive work blocks the single thread
  }
}
heavyComputation(); // Everything stops: no clicks, no rendering, no I/O

// ✅ Solution 1: Break into chunks (setTimeout)
function processChunks(data, chunkSize = 1000) {
  let index = 0;
  function nextChunk() {
    const end = Math.min(index + chunkSize, data.length);
    for (; index &lt; end; index++) {
      process(data[index]);
    }
    if (index &lt; data.length) {
      setTimeout(nextChunk, 0); // yield to event loop
    }
  }
  nextChunk();
}

// ✅ Solution 2: Web Workers (browser) / Worker Threads (Node.js)
const worker = new Worker('heavy-task.js');
worker.postMessage(data);
worker.onmessage = (e) => console.log('Result:', e.data);

// ✅ Solution 3: requestIdleCallback (browser)
requestIdleCallback((deadline) => {
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    processTask(tasks.pop());
  }
});</pre>
<div class="key-point">JavaScript is single-threaded. CPU-intensive work blocks everything. Use Web Workers for heavy computation, <code>setTimeout(fn, 0)</code> to yield control, or <code>requestIdleCallback</code> for low-priority work.</div>`,
      },
      {
        q: 'What is a Memory Leak in JavaScript? Common causes and how to detect them.',
        difficulty: 'hard',
        a: `<pre>// Common causes of memory leaks:

// 1. Forgotten event listeners
element.addEventListener('click', handler);
// element removed from DOM but listener still holds reference!
// Fix: element.removeEventListener('click', handler);

// 2. Forgotten timers/intervals
const id = setInterval(() => {
  // references data that should be garbage collected
}, 1000);
// Fix: clearInterval(id);

// 3. Closures holding references
function createLeak() {
  const hugeArray = new Array(1000000).fill('data');
  return function() {
    console.log(hugeArray.length); // closure keeps hugeArray alive!
  };
}

// 4. Detached DOM nodes
const nodes = [];
function addNode() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  nodes.push(div);      // reference kept even after removal
  document.body.removeChild(div); // removed from DOM but not from array!
}

// 5. Global variables
function leak() {
  accidentalGlobal = 'oops'; // no var/let/const → global!
}

// React-specific: missing cleanup in useEffect
useEffect(() => {
  const subscription = subscribe();
  // ❌ Missing cleanup → leak!
  return () => subscription.unsubscribe(); // ✅ Fix
}, []);</pre>
<p><strong>Detection:</strong> Chrome DevTools → Memory tab → Heap snapshots → Compare before/after to find growing objects.</p>
<div class="key-point">In React, the most common leak is forgetting to clean up in <code>useEffect</code>: subscriptions, intervals, event listeners, and AbortControllers for fetch requests.</div>`,
      },
      //   ],
      // },
    ],
  });
})();
