// Interview data: javascript
// Auto-generated from pv.html
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: '🟨',
    questions: [
      {
        q: 'Explain the difference between var, let, and const.',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Default to <code>const</code>, reach for <code>let</code> only when you genuinely reassign, and treat <code>var</code> as legacy. The real distinctions are scope and the temporal dead zone: <code>var</code> is function-scoped and hoisted as <code>undefined</code>, while <code>let</code> and <code>const</code> are block-scoped and throw if you touch them before their declaration line. The gotcha I always flag is that <code>const</code> freezes the binding, not the value — you can still push to a <code>const</code> array or mutate a <code>const</code> object, it just can't be reassigned.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>Hoisting is the mental model for how declarations are registered before code executes. Function declarations are hoisted with their body, so you can call them before they appear; <code>var</code> is hoisted but initialized to <code>undefined</code>; and <code>let</code>/<code>const</code> are hoisted too but sit in the temporal dead zone, so touching them early throws. In practice I don't lean on hoisting at all — I declare things before I use them and treat any dependence on it as a code smell.</p></div>
<p>JavaScript moves declarations to the top of their scope during compilation.</p>
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
        a: `<div class="interview-answer"><p>A closure is just a function bundled with the lexical scope it was defined in, so it keeps live access to those outer variables even after the outer function has returned. That's the mechanism behind data privacy, factory functions, memoization, and every React hook you've ever used. The classic trap is a loop with <code>var</code>, where every callback closes over the same shared binding and they all print the final value — switching to <code>let</code> gives each iteration its own binding and fixes it.</p></div>
<p>A <strong>closure</strong> is a function that remembers and accesses variables from its lexical scope, even when executed outside that scope.</p>
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
        a: `<div class="interview-answer"><p>JavaScript is single-threaded, so concurrency comes from the event loop shuttling callbacks off queues. The rule that matters: after each task the engine drains the <em>entire</em> microtask queue — promise callbacks, <code>queueMicrotask</code> — before it touches even one macrotask like <code>setTimeout</code>. That's why a promise scheduled after a <code>setTimeout</code> still runs first, and it's also how you can starve rendering by continuously queueing microtasks.</p></div>
<p>JavaScript is <strong>single-threaded</strong>. The event loop processes the call stack, then:</p>
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
        a: `<div class="interview-answer"><p>Every object has a hidden link to a prototype, and property lookups walk that chain until they find a match or hit <code>null</code>. It's delegation, not copying — that's the key difference from classical inheritance. ES6 <code>class</code> is pure syntactic sugar over this; there are no real classes underneath. As a senior I lean on prototypes lightly and favour composition, because deep prototype chains are slower to look up and harder to reason about.</p></div>
<p>Every object has a hidden <code>[[Prototype]]</code> (accessible via <code>__proto__</code> or <code>Object.getPrototypeOf()</code>). Property lookup goes up the prototype chain.</p>
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
        a: `<div class="interview-answer"><p>Always use <code>===</code> — it compares type and value with no coercion. <code>==</code> runs the abstract equality algorithm, coercing types first, which produces surprises like <code>0 == ''</code> being true. The one place I deliberately use <code>==</code> is the null check <code>x == null</code>, which cleanly catches both <code>null</code> and <code>undefined</code> in a single expression. Everywhere else loose equality is a bug waiting to happen.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p><code>this</code> is decided at call time, not when the function is written — that's the whole thing. Precedence runs <code>new</code>, then explicit <code>bind</code>/<code>call</code>/<code>apply</code>, then implicit object-dot-method, then default which is <code>undefined</code> in strict mode. Arrow functions opt out entirely and capture <code>this</code> lexically from where they're defined. The bug I see most is passing a method as a callback, which strips the object binding — fix it with <code>bind</code> or an arrow wrapper, and never use an arrow as an object method expecting <code>this</code> to be that object.</p></div>
<p><code>this</code> is <strong>not</strong> fixed when a function is written — it is decided by <em>how the function is called</em> (its call-site). There are five rules, checked in priority order:</p>
<ol>
<li><strong>new binding</strong>: <code>new Foo()</code> → <code>this</code> is the brand-new object being constructed.</li>
<li><strong>Explicit binding</strong>: <code>call</code>/<code>apply</code>/<code>bind</code> → <code>this</code> is exactly the argument you pass.</li>
<li><strong>Implicit binding</strong>: <code>obj.method()</code> → <code>this</code> is the object before the dot.</li>
<li><strong>Default binding</strong>: a plain <code>fn()</code> call → <code>this</code> is <code>undefined</code> in strict mode, otherwise the global object (<code>window</code>/<code>global</code>).</li>
<li><strong>Arrow functions</strong>: ignore all of the above. They have no <code>this</code> of their own and capture it <strong>lexically</strong> from the enclosing scope at definition time.</li>
</ol>
<pre>const obj = {
  name: 'Alice',
  greet() { return this.name; },      // implicit → 'Alice'
  greetArrow: () => this.name         // lexical → this = module/global → undefined
};
obj.greet();                          // 'Alice'

const fn = obj.greet;
fn();                                 // undefined — default binding, lost the object!
fn.call(obj);                         // 'Alice'   — explicit binding restores it</pre>
<p>The classic trap: passing a method as a callback (<code>setTimeout(obj.greet, 0)</code>) strips the implicit binding, so <code>this</code> falls back to default. Fix with <code>bind</code> or an arrow wrapper: <code>setTimeout(() =&gt; obj.greet(), 0)</code>.</p>
<div class="key-point">Interview gotcha: an arrow method on an object literal does NOT bind <code>this</code> to that object. Arrows resolve <code>this</code> lexically, so it points at whatever <code>this</code> was where the object was defined (usually the module top level = <code>undefined</code>). Use a regular method for object methods.</div>`,
      },
      {
        q: 'What is the difference between call(), apply(), and bind()?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>All three set <code>this</code> explicitly. <code>call</code> and <code>apply</code> invoke immediately — <code>call</code> takes args individually, <code>apply</code> takes them as an array — while <code>bind</code> returns a new function with <code>this</code> permanently locked in for later. I use <code>bind</code> for callbacks and partial application, <code>apply</code> historically to spread an array of args before the spread operator existed, and <code>call</code> for method borrowing like <code>Array.prototype.slice.call</code>. The gotcha: a bound function's <code>this</code> can't be re-bound, and none of these affect arrow functions.</p></div>
<p>All three let you <strong>explicitly set <code>this</code></strong> for a function, overriding the default call-site rules. They exist because a function in JavaScript is a standalone value — detaching a method from its object loses the <code>this</code> binding, and these methods let you reattach it (or borrow a method for a different object).</p>
<ul>
<li><code>call(thisArg, arg1, arg2, …)</code> – invokes <strong>immediately</strong>, arguments passed individually.</li>
<li><code>apply(thisArg, [argsArray])</code> – invokes <strong>immediately</strong>, arguments passed as an array (mnemonic: <em>A</em>pply = <em>A</em>rray).</li>
<li><code>bind(thisArg, arg1, …)</code> – does NOT invoke; returns a <strong>new function</strong> with <code>this</code> (and any leading args) permanently locked in, to be called later.</li>
</ul>
<pre>function greet(greeting, punct) { return greeting + ' ' + this.name + punct; }
const user = { name: 'Bob' };

greet.call(user, 'Hi', '!');       // 'Hi Bob!'  — args listed
greet.apply(user, ['Hi', '!']);    // 'Hi Bob!'  — args in an array

const boundHi = greet.bind(user, 'Hi'); // partial application: 'Hi' fixed
boundHi('?');                       // 'Hi Bob?'  — called later, add the rest</pre>
<p><strong>Why each is useful:</strong> <code>apply</code> shines when args are already in an array (before spread existed, <code>Math.max.apply(null, nums)</code> was the idiom). <code>bind</code> preserves <code>this</code> for callbacks (<code>setTimeout(this.tick.bind(this), 1000)</code>) and enables partial application. <code>call</code> is common for method borrowing, e.g. running an array method on an array-like: <code>Array.prototype.slice.call(arguments)</code>.</p>
<div class="key-point">Remember: call/apply <strong>invoke now</strong>; bind <strong>returns a function for later</strong>. And <code>bind</code> is permanent — a bound function's <code>this</code> cannot be re-bound (a second <code>bind</code> or a later <code>call</code> is ignored), while arrow functions ignore all three entirely.</div>`,
      },
      {
        q: 'Explain Promises, async/await, and error handling patterns.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A promise models a single future value in one of three states, and <code>async</code>/<code>await</code> is just cleaner syntax over the same machinery — <code>await</code> unwraps a promise and lets me write async code in a linear, <code>try</code>/<code>catch</code> style. The senior points are error handling and concurrency: wrap awaits in <code>try</code>/<code>catch</code>, and don't await sequentially when calls are independent — use <code>Promise.all</code> for parallel, <code>allSettled</code> when you need every result regardless of failures. The trap is a forgotten <code>await</code>, which silently swallows errors as unhandled rejections.</p></div>
<p>A <strong>Promise</strong> represents an asynchronous operation: pending → fulfilled | rejected.</p>
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
        a: `<div class="interview-answer"><p>Both throttle how often a handler runs, but they answer different questions. Debounce waits for silence — it resets a timer on every call and only fires once activity stops, which is perfect for search-as-you-type or autosave. Throttle enforces a steady maximum rate during continuous activity, which is what you want for scroll or mousemove. My rule of thumb: debounce when only the final state matters, throttle when you want regular updates mid-stream.</p></div>
<p>Both limit how often an expensive handler runs, but they answer different questions. <strong>Debounce</strong> asks "have things gone quiet?" — it resets a timer on every call and only fires once the events STOP for X ms. <strong>Throttle</strong> asks "has enough time passed?" — it fires at most once per X ms, ignoring the calls in between.</p>
<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
<tr><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;"></th><th style="padding:6px;border-bottom:1px solid #ccc;">Debounce</th><th style="padding:6px;border-bottom:1px solid #ccc;">Throttle</th></tr>
<tr><td style="padding:6px;">Fires</td><td style="padding:6px;">Once, after activity stops</td><td style="padding:6px;">At a steady max rate during activity</td></tr>
<tr><td style="padding:6px;">Use for</td><td style="padding:6px;">Search-as-you-type, resize end, autosave</td><td style="padding:6px;">Scroll, mousemove, drag, rapid clicks</td></tr>
</table>
<pre>// Debounce: only runs after 'delay' ms of silence
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);                    // cancel the pending call
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Throttle: runs at most once per 'limit' ms
function throttle(fn, limit) {
  let waiting = false;
  return function(...args) {
    if (waiting) return;                    // ignore calls during cooldown
    fn.apply(this, args);
    waiting = true;
    setTimeout(() => { waiting = false; }, limit);
  };
}

const search = debounce((q) => fetch('/api/search?q=' + encodeURIComponent(q)), 300);</pre>
<div class="key-point">If a user types "hello" quickly, a <strong>debounced</strong> search fires ONE request after they pause; a <strong>throttled</strong> one fires roughly every X ms while they keep typing. Rule of thumb: debounce when you only care about the final state, throttle when you want regular updates during a continuous stream.</div>`,
      },
      {
        q: 'What are WeakMap and WeakSet? When to use them?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>These hold their keys weakly, so if the only remaining reference to an object is the <code>WeakMap</code> key, it gets garbage collected. That makes them ideal for associating metadata with objects you don't own — caching per DOM node, or storing truly private data — without creating a leak. The tradeoff is they're not iterable and have no <code>size</code>, precisely because you can't enumerate something that might vanish mid-iteration.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>Events bubble up from the target through its ancestors, and delegation exploits that: attach one listener on a stable parent and inspect <code>event.target</code> instead of wiring up hundreds of child listeners. It's fewer listeners, less memory, and — the real win — it automatically handles elements added to the DOM later. The gotcha is events that don't bubble, like <code>focus</code> or <code>scroll</code>, where you need the capture phase or <code>focusin</code> instead.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>An iterator is any object with a <code>next()</code> returning value and done; a generator is the ergonomic way to write one — a <code>function*</code> that pauses at each <code>yield</code> and resumes on the next call. The power is lazy, on-demand production, so you can model infinite sequences like fibonacci without exhausting memory. In real work I mostly meet them through the iterator protocol behind <code>for...of</code> and spread; historically redux-saga used them to make async flows testable.</p></div>
<p>A <strong>generator</strong> function (<code>function*</code>) can pause and resume execution using <code>yield</code>.</p>
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
        a: `<div class="interview-answer"><p>Shallow copy duplicates the top level only — spread or <code>Object.assign</code> — so nested objects are still shared by reference, which is the source of a lot of spooky action-at-a-distance bugs. Deep copy recurses all the way down; <code>structuredClone</code> is the modern built-in and handles dates, maps, and cycles. The old <code>JSON.parse(JSON.stringify())</code> trick works but silently drops functions and <code>undefined</code> and turns Dates into strings, so I only use it for plain data I fully control.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>They're three eras of the same goal — encapsulation. The IIFE module pattern faked privacy before the language had modules; CommonJS gave Node synchronous <code>require</code> and dynamic <code>module.exports</code>; ES modules are the standard now, with static <code>import</code>/<code>export</code> that can be analysed at build time. That static structure is exactly what unlocks tree-shaking. The interop pain is that ESM is async and CommonJS is sync, which is why mixing them in Node is still occasionally miserable.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>Currying turns a multi-arg function into a chain of single-arg functions, so <code>f(a, b, c)</code> becomes <code>f(a)(b)(c)</code>. The practical value isn't the chaining itself — it's partial application, pre-filling some arguments to build specialized functions, which is huge for composition and point-free style. I don't curry everything; it shines for reusable configured handlers and reads cleanly in functional pipelines, but overused it just obscures a plain function call.</p></div>
<p><strong>Currying</strong> transforms <code>f(a, b, c)</code> into <code>f(a)(b)(c)</code>. Each call returns a new function expecting the next argument.</p>
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
        a: `<div class="interview-answer"><p>These all come down to two coercion rules. Plus is overloaded — if either operand is a string, or an object that stringifies to one, it concatenates; otherwise it adds numerically. Every other arithmetic operator has no string form, so it forces both sides to numbers first. The interview point isn't memorising the table, it's naming the mechanism — objects go through <code>valueOf</code> then <code>toString</code> — and then saying you'd never rely on implicit coercion in real code.</p></div>
<p>These outputs all come from JavaScript's <strong>implicit type coercion</strong>. Two rules explain almost everything: (1) <code>+</code> is overloaded — if <em>either</em> operand is a string (or an object that stringifies to one), it does string concatenation; otherwise numeric addition. (2) Every other arithmetic operator (<code>-</code>, <code>*</code>, <code>/</code>) has no string form, so it always coerces both sides to numbers first.</p>
<pre>[] + []          // "" — arrays stringify to "", so "" + "" = ""
[] + {}          // "[object Object]" — "" + "[object Object]"
{} + []          // 0 — leading {} parsed as an empty BLOCK, then +[] = 0
true + true      // 2 — booleans coerce to numbers (1 + 1)
'5' - 3          // 2 — '-' forces numeric: 5 - 3
'5' + 3          // "53" — '+' with a string concatenates
null + 1         // 1 — null coerces to 0
undefined + 1    // NaN — undefined coerces to NaN
typeof null      // "object" — historical bug, never fixable
typeof NaN       // "number" — NaN is still a numeric value
NaN === NaN      // false — NaN is not equal to itself; use Number.isNaN()</pre>
<div class="key-point">The interview point isn't memorising the table — it's naming the mechanism: objects are coerced to primitives via <code>valueOf</code>/<code>toString</code>, <code>+</code> prefers string when either side is a string, and every other operator prefers number. In production code, never rely on implicit coercion — it is exactly the source of these surprises.</div>`,
      },
      {
        q: 'Explain Proxy and Reflect in JavaScript.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A Proxy wraps an object and lets you intercept fundamental operations — get, set, has, delete — through trap functions, which is how libraries like Vue 3's reactivity and MobX work under the hood. Reflect is its companion: it exposes the default behaviour of each trap as a plain function, so inside a trap you forward to <code>Reflect.get</code> rather than hand-rolling the default. The main caution is performance and debuggability — proxies add overhead and make behaviour less obvious, so I reach for them only when I genuinely need to intercept.</p></div>
<p><strong>Proxy</strong> wraps an object and intercepts operations (get, set, has, deleteProperty, etc.).</p>
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
        a: `<div class="interview-answer"><p><code>undefined</code> means the engine hasn't given it a value — an uninitialized variable, a missing property, a function with no return. <code>null</code> is an explicit, deliberate "nothing" that a developer assigned. They're loosely equal but not strictly, and the practical gotcha is default parameters: they only kick in for <code>undefined</code>, so passing <code>null</code> skips the default. And <code>typeof null</code> returning "object" is a famous unfixable bug from the first implementation.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>The dividing line is what they return. <code>map</code> transforms into a new array one-to-one, <code>filter</code> narrows, <code>reduce</code> folds down to any single value, and <code>find</code> returns the first match — all functional and chainable. <code>forEach</code> is the odd one out: it returns <code>undefined</code> and exists only for side effects, so it can't be chained. The trap interviewers love: you can't break out of <code>forEach</code> — if you need early exit, use <code>for...of</code>, or <code>find</code>/<code>some</code>/<code>every</code>.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>Same three-dot syntax, opposite directions. Spread expands an iterable into individual elements — cloning arrays, merging objects, passing array items as arguments. Rest collects the leftovers into a real array, whether that's variadic function parameters or the tail of a destructuring pattern. The gotcha is that spread makes a shallow copy, so nested objects are still shared — people constantly assume <code>{...obj}</code> is a deep clone and get bitten.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>Template literals add interpolation, real multi-line strings, and — the advanced part — tagging. A tagged template is just a function placed before the literal; it receives the static string chunks as an array and the interpolated values separately, so it fully controls how they recombine. That's the basis for safe escaping in libraries like lit-html and styled-components, because the tag can sanitize untrusted values before inserting them. The <code>raw</code> property also gives you the un-escaped source, which is how <code>String.raw</code> works.</p></div>
<p><strong>Template literals</strong> are strings delimited by backticks. They add three things over quoted strings: <strong>interpolation</strong> (embedding any expression), true <strong>multi-line</strong> strings without <code>\\n</code>, and the ability to be <em>tagged</em>.</p>
<p>A <strong>tagged template</strong> is a function placed directly before a template literal. Instead of just building the string, JavaScript calls that function with the static text chunks as the first argument (an array) and the interpolated values as the remaining arguments. Because the function decides how the pieces are recombined, it can inspect and transform the input first — this is the basis for safe HTML/SQL escaping, CSS-in-JS, and embedded DSLs.</p>
<pre>// Template literals: backtick strings with expressions
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
// gql\`query { user { name } }\` in GraphQL</pre>
<div class="key-point">A tag function receives two things: <code>strings</code> (the literal chunks — plus a <code>strings.raw</code> variant where escapes like <code>\\n</code> are left un-processed) and <code>...values</code> (the interpolated results). Because the tag controls how values get inserted, libraries use it to auto-escape untrusted input — the real advantage over plain string concatenation.</div>`,
      },
      {
        q: 'What is destructuring in JavaScript?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Destructuring is pattern-matching for pulling values out of arrays and objects in one line, with defaults, renaming, and nested extraction. Where it really pays off is function parameters — destructuring an options object with defaults gives you named arguments for free. Two gotchas: array destructuring works on any iterable, and defaults only trigger on <code>undefined</code>, not <code>null</code>, so a <code>null</code> value overrides the default.</p></div>
<pre>// Array destructuring
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
        a: `<div class="interview-answer"><p>The headline difference is <code>this</code> — arrows have no <code>this</code> of their own and capture it lexically, which is exactly why they're great for callbacks and terrible as object methods. Arrows also lack <code>arguments</code>, can't be called with <code>new</code>, and have no <code>prototype</code>. So my rule is arrows for inline callbacks and anything that should inherit the surrounding <code>this</code>, and regular functions for object methods, constructors, and anywhere you need dynamic <code>this</code> or the <code>arguments</code> object.</p></div>
<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
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
        a: `<div class="interview-answer"><p>This tests two things at once: closure capture and event-loop ordering. The <code>var</code> loop prints the final value repeatedly because all callbacks share one function-scoped binding; <code>let</code> gives each iteration a fresh binding. The ordering puzzle hinges on synchronous code first, then all microtasks like promise <code>.then</code>, then macrotasks like <code>setTimeout</code> — plus the detail that a Promise executor runs synchronously, so the resolve value is queued but its logging is deferred.</p></div>
<pre>// Question 1: What prints?
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
        a: `<div class="interview-answer"><p>Optional chaining short-circuits to <code>undefined</code> the moment it hits <code>null</code> or <code>undefined</code>, so you stop writing defensive <code>a &amp;&amp; a.b &amp;&amp; a.b.c</code> ladders. Nullish coalescing provides a fallback but only for <code>null</code> or <code>undefined</code> — that's the crucial difference from <code>||</code>, which also swallows <code>0</code>, empty string, and <code>false</code>. So use <code>??</code> whenever zero or empty string are legitimate values; reaching for <code>||</code> there is a classic bug that silently replaces valid falsy data.</p></div>
<pre>// Optional chaining (?.) — safe property access
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
        a: `<div class="interview-answer"><p>Three escalating levels of lockdown: <code>preventExtensions</code> blocks adding properties, <code>seal</code> also blocks deletion, and <code>freeze</code> additionally blocks modification — so <code>freeze</code> is effectively read-only. The universal gotcha is that all three are shallow: freeze the top object and its nested objects are still fully mutable. For real immutability you need a recursive deep freeze, and remember it fails silently unless you're in strict mode.</p></div>
<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
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
        a: `<div class="interview-answer"><p>A Symbol is a guaranteed-unique primitive, so it's the safe way to add a property key that can never collide with anything else — great for library metadata that won't clash with user keys, and it stays hidden from <code>Object.keys</code> and <code>for...in</code>. The more powerful use is well-known Symbols, which are hooks into language behaviour: define <code>Symbol.iterator</code> and your object works with <code>for...of</code> and spread; <code>Symbol.toPrimitive</code> customizes coercion. And <code>Symbol.for</code> gives you a shared global registry when you actually want the same symbol across contexts.</p></div>
<p><strong>Symbol</strong> is a unique, immutable primitive type. Every Symbol() is guaranteed unique.</p>
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
        a: `<div class="interview-answer"><p>Reach for <code>Map</code> over a plain object when keys aren't strings, insertion order matters, or you're adding and removing frequently — plus you get a real <code>size</code> and clean iteration. <code>Set</code> is for uniqueness and fast <code>has()</code> checks, and <code>[...new Set(arr)]</code> is the idiomatic dedupe. The Weak variants take object keys held weakly for GC-friendly metadata, at the cost of iteration and size. Plain objects are still fine for fixed, string-keyed records, especially with JSON and syntax ergonomics.</p></div>
<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
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
        a: `<div class="interview-answer"><p>Four combinators for different needs. <code>all</code> is fail-fast — one rejection rejects the whole thing — so use it when you truly need every result. <code>allSettled</code> never rejects and hands you the status of each, which is what you want for independent tasks where partial success is fine. <code>race</code> settles on the first to finish either way, good for timeouts; <code>any</code> resolves on the first success and only rejects if all fail, good for redundancy. The gotcha with <code>all</code> is that a single failure discards the successful results, so <code>allSettled</code> is often the safer default.</p></div>
<pre>const p1 = Promise.resolve(1);
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
        a: `<div class="interview-answer"><p><code>for...in</code> iterates keys, including inherited enumerable ones, so it's really for object properties — and dangerous on arrays because it yields string indices and picks up any extra properties. <code>for...of</code> iterates values of any iterable — arrays, strings, Maps, Sets — and is what you almost always want for arrays. For objects, which aren't iterable, I use <code>Object.entries</code> with <code>for...of</code> to get clean key-value pairs. Short version: <code>in</code> for keys, <code>of</code> for values.</p></div>
<pre>const arr = ['a', 'b', 'c'];

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
        a: `<div class="interview-answer"><p>The temporal dead zone is the window between entering a scope and reaching a <code>let</code> or <code>const</code> declaration, during which the variable exists but throws on any access. It's not a bug — it's a deliberate feature that turns <code>var</code>'s silent <code>undefined</code> into a loud error, catching use-before-declaration. The surprising part is <code>typeof</code>: on an undeclared variable it safely returns "undefined", but on a TDZ variable it throws, because the binding does exist, it's just uninitialized.</p></div>
<p>The <strong>TDZ</strong> is the period between entering a scope and the variable being declared where <code>let</code>/<code>const</code> variables exist but cannot be accessed.</p>
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
        a: `<div class="interview-answer"><p>These are the three levels of object lockdown: <code>preventExtensions</code> stops new properties, <code>seal</code> adds a no-delete rule, and <code>freeze</code> also makes existing values read-only. In practice <code>freeze</code> is the one I use — for config objects and true constants — but its big caveat is that it's shallow, so nested objects stay mutable and you need a recursive <code>deepFreeze</code> for real protection. Also note the operations fail silently in sloppy mode and only throw under strict mode.</p></div>
<pre>const obj = { name: 'John', age: 30 };

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
        a: `<div class="interview-answer"><p>Because JS is single-threaded, any long synchronous task freezes everything — no clicks, no rendering, no I/O — so the goal is to never hog the thread. For genuinely CPU-heavy work the right answer is a Web Worker or Node worker thread to move it off the main thread entirely. If it must stay on-thread, chunk it and yield with <code>setTimeout</code> or <code>requestIdleCallback</code> so the loop can breathe. The senior framing: distinguish CPU-bound work, which needs a worker, from I/O-bound work, which async already handles fine.</p></div>
<pre>// ❌ Blocking the event loop (UI freezes, server stops responding)
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
        a: `<div class="interview-answer"><p>A leak in JS is any object that stays reachable after you're done with it, so GC can't collect it. The usual suspects are forgotten event listeners and timers, closures that capture large structures, detached DOM nodes still referenced by an array, and accidental globals. In React specifically the number-one cause is a missing <code>useEffect</code> cleanup — subscriptions, intervals, listeners. I find them with Chrome DevTools heap snapshots, comparing before and after an action to spot the objects that keep growing.</p></div>
<pre>// Common causes of memory leaks:

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
      {
        q: "What is the output of ['1', '7', '11'].map(parseInt)? Why?",
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The answer is <code>[1, NaN, 3]</code>, and the lesson matters more than the trivia. <code>map</code> calls its callback with three arguments — element, index, array — and <code>parseInt</code> takes two, string and radix, so the index leaks in as a radix: <code>parseInt('7', 1)</code> is invalid, hence <code>NaN</code>. The general rule I'd state: never hand a function reference straight to <code>map</code> unless you know its full arity, because extra arguments bind silently. Fix it with <code>.map(Number)</code> or an explicit arrow that pins the radix.</p></div>
<p>The most famous JavaScript one-liner trap. The answer is <code>[1, NaN, 3]</code>.</p>
<pre>['1', '7', '11'].map(parseInt);   // [1, NaN, 3]  😱

// Why? map passes THREE args: (element, index, array)
// and parseInt takes TWO: (string, radix)
parseInt('1', 0);   // 1   (radix 0 → treated as 10)
parseInt('7', 1);   // NaN (radix 1 is invalid!)
parseInt('11', 2);  // 3   ('11' in binary = 3)

// ✅ Fixes:
['1', '7', '11'].map(Number);              // [1, 7, 11]
['1', '7', '11'].map(s => parseInt(s, 10)); // [1, 7, 11]</pre>
<div class="key-point">General lesson: never pass a function reference directly to <code>map/filter</code> unless you know its full signature — the extra <code>index</code> and <code>array</code> arguments silently bind to optional parameters. Always state the radix with <code>parseInt</code>.</div>`,
      },
      {
        q: 'Why does 0.1 + 0.2 !== 0.3? How do you compare floats safely?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>It's not a JavaScript quirk — it's IEEE-754 double precision, the same in Java, Python, and C#. <code>0.1</code> and <code>0.2</code> have no exact binary representation, so they're stored slightly off and the errors accumulate past <code>0.3</code>. To compare floats you use a tolerance — <code>abs(a-b)</code> under some epsilon — and for money you never use floats at all; you work in integer minor units like cents or use a decimal library. That last point is the one interviewers actually care about.</p></div>
<pre>0.1 + 0.2;               // 0.30000000000000004
0.1 + 0.2 === 0.3;       // false!

// Why: JS numbers are IEEE-754 64-bit binary floats.
// 0.1 and 0.2 have no exact binary representation (like 1/3 in decimal),
// so both are stored slightly off, and the errors add up.

// ✅ Compare with a tolerance (epsilon):
function nearlyEqual(a, b) {
  return Math.abs(a - b) &lt; Number.EPSILON;   // 2^-52
}
nearlyEqual(0.1 + 0.2, 0.3);  // true

// ✅ For money: work in integer cents
1000 + 2000 === 3000;          // cents — always exact

// Related traps:
0.1 + 0.2 + 0.3 === 0.3 + 0.2 + 0.1;   // false! (order matters)
Number.MAX_SAFE_INTEGER;                 // 9007199254740991 (2^53 - 1)
9007199254740992 === 9007199254740993;   // true! beyond safe range
BigInt(9007199254740993n);               // use BigInt for big integers</pre>
<div class="key-point">Every language with IEEE-754 doubles has this (Java, Python, C#…). Senior answer covers: why (binary fractions), how to compare (epsilon), and money handling (integer minor units or a decimal library).</div>`,
      },
      {
        q: 'Can (a == 1 && a == 2 && a == 3) ever be true?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Yes, and the point is explaining how. With loose <code>==</code>, comparing an object to a number triggers ToPrimitive, so an object whose <code>valueOf</code> increments a counter returns 1, then 2, then 3. You can even do it with strict <code>===</code> using a getter on <code>globalThis</code> that has a side effect, or with a Proxy intercepting <code>Symbol.toPrimitive</code>. What's really being tested is that you know <code>==</code> invokes coercion hooks and that property access can run arbitrary code — and that you'd never write this in production.</p></div>
<p>Yes — three classic ways, each showing a different mechanism interviewers want you to explain.</p>
<pre>// 1. valueOf — loose == triggers ToPrimitive coercion on objects
const a = {
  value: 0,
  valueOf() { return ++this.value; }   // called on each == comparison
};
a == 1 && a == 2 && a == 3;   // true!

// 2. Even works with STRICT === using a global getter
let count = 0;
Object.defineProperty(globalThis, 'b', {
  get() { return ++count; }            // property read has a side effect
});
b === 1 && b === 2 && b === 3; // true!

// 3. Proxy — intercepts the coercion
const c = new Proxy({ i: 0 }, {
  get(target, prop) {
    if (prop === Symbol.toPrimitive) return () => ++target.i;
  }
});
c == 1 && c == 2 && c == 3;   // true</pre>
<div class="key-point">What's really being tested: you know <code>==</code> calls <code>[Symbol.toPrimitive]</code> / <code>valueOf</code> / <code>toString</code> on objects, and that property access can run arbitrary code. Real-world moral: side effects in getters/coercion make code unpredictable — never do this outside an interview.</div>`,
      },
      {
        q: 'What is the output of [10, 9, 1].sort()? Array sort pitfalls.',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p><code>[10, 9, 1].sort()</code> gives <code>[1, 10, 9]</code> because the default sort stringifies elements and compares lexicographically, so you must pass a comparator like <code>(a,b) =&gt; a-b</code> for numbers. Two more traps: <code>sort</code> mutates in place and returns the same reference, so copy first with spread or use the ES2023 <code>toSorted</code>; and the comparator must return a negative, zero, or positive number, not a boolean. A nice senior follow-up is that <code>sort</code> has been guaranteed stable since ES2019.</p></div>
<pre>[10, 9, 1].sort();          // [1, 10, 9]  😱 NOT [1, 9, 10]
// Default sort converts elements to STRINGS and compares UTF-16 code units:
// '1' &lt; '10' &lt; '9' (lexicographic)

// ✅ Numeric sort needs a comparator:
[10, 9, 1].sort((a, b) => a - b);   // [1, 9, 10]
[10, 9, 1].sort((a, b) => b - a);   // [10, 9, 1] descending

// Pitfall 2: sort MUTATES the array (and returns the same reference!)
const original = [3, 1, 2];
const sorted = original.sort();
sorted === original;                 // true — original is changed too!
const safe = [...original].sort((a, b) => a - b);  // copy first
const safe2 = original.toSorted((a, b) => a - b);  // ES2023 immutable version

// Pitfall 3: comparator must be consistent — return NEGATIVE/0/POSITIVE
users.sort((a, b) => a.age - b.age);                    // numbers ✅
names.sort((a, b) => a.localeCompare(b));               // strings ✅
users.sort((a, b) => a.age &gt; b.age);  // ❌ returns true/false → broken order</pre>
<div class="key-point">Since ES2019 <code>Array.prototype.sort</code> is guaranteed <strong>stable</strong> (equal elements keep their relative order) — a common senior follow-up. The mutating family (<code>sort/reverse/splice</code>) now has immutable twins: <code>toSorted/toReversed/toSpliced</code>.</div>`,
      },
      {
        q: 'What is the output? (async/await + event loop ordering puzzle)',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The trick is knowing an <code>async</code> function runs synchronously up to its first <code>await</code>, and everything after that <code>await</code> is queued as a microtask — <code>await x</code> is basically <code>Promise.resolve(x).then(rest)</code>. So all the synchronous logging happens first, then the microtask queue drains in order, and <code>setTimeout</code> as a macrotask always comes last. If you can articulate those three rules, you can derive the output rather than memorise it.</p></div>
<pre>async function a1() {
  console.log('a1 start');
  await a2();
  console.log('a1 end');        // everything AFTER await = microtask
}
async function a2() { console.log('a2'); }

console.log('script start');
setTimeout(() => console.log('setTimeout'), 0);
a1();
new Promise(resolve => {
  console.log('promise');        // executor runs SYNCHRONOUSLY
  resolve();
}).then(() => console.log('then'));
console.log('script end');

// Output:
// script start
// a1 start      ← a1 runs synchronously until the await
// a2            ← a2's body is also synchronous
// promise       ← Promise executor is synchronous
// script end    ← sync code done; now drain microtasks
// a1 end        ← microtask 1 (queued at the await, before .then)
// then          ← microtask 2
// setTimeout    ← macrotask, always last</pre>
<div class="key-point">The rules that generate the answer: (1) an <code>async</code> function runs <strong>synchronously until its first await</strong>; (2) <code>await</code> parks the rest of the function as a <strong>microtask</strong>; (3) all microtasks drain before the next macrotask. <code>await x</code> is equivalent to <code>Promise.resolve(x).then(rest-of-function)</code>.</div>`,
      },
      {
        q: 'What is the output of Array(3).map(x => 1)? (sparse arrays and holes)',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p><code>Array(3)</code> creates a sparse array — length 3 with no actual elements, just holes — and <code>map</code> skips holes, so it returns the same empty slots, not <code>[1,1,1]</code>. The fix is to materialize real elements first: <code>Array.from({length:3}, ...)</code>, or <code>fill</code> then <code>map</code>, or spread which converts holes to <code>undefined</code>. And the deeper wart: <code>Array</code> with a single number sets length, but <code>Array('3')</code> creates an element — inconsistent by design. Bottom line, avoid sparse arrays entirely.</p></div>
<pre>Array(3);                    // [empty × 3] — length 3, but NO elements (holes)
Array(3).map(x => 1);        // [empty × 3]  😱 map SKIPS holes!
Array(3).fill(0);            // [0, 0, 0] ✅

// Why: Array(3) sets length=3 but creates no indexed properties.
// map/forEach/filter iterate only over EXISTING indices.
0 in Array(3);               // false — index 0 doesn't exist
0 in [undefined, 1, 2];      // true

// ✅ Ways to build a real array of length n:
Array.from({ length: 3 }, (_, i) => i);  // [0, 1, 2]
[...Array(3)].map((_, i) => i);          // [0, 1, 2] (spread fills holes with undefined)
Array(3).fill(null).map((_, i) => i);    // [0, 1, 2]

// More hole trivia:
[,,].length;                 // 2 — trailing comma doesn't count!
[1, , 3].length;             // 3, but index 1 is a hole
Array(3).length;             // 3
Array('3');                  // ['3'] — single non-number arg = element! 😱</pre>
<div class="key-point"><code>Array(n)</code> with one numeric argument sets <em>length</em>; with anything else it creates elements — a design wart worth naming. Holes behave inconsistently across methods (<code>map</code> skips, spread converts to <code>undefined</code>, <code>includes</code> sees them) — avoid sparse arrays entirely.</div>`,
      },
      {
        q: 'What is the difference between ==, ===, and Object.is()?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p><code>===</code> is your default — strict, no coercion. <code>Object.is</code> is SameValue semantics: identical to <code>===</code> except it treats <code>NaN</code> as equal to itself and distinguishes <code>+0</code> from <code>-0</code>. The senior hook is where it actually shows up: React uses <code>Object.is</code> to decide whether state changed and whether to bail out of a re-render, and for its dependency comparisons. So knowing it isn't trivia — it explains why passing the same object reference to <code>setState</code> skips the render.</p></div>
<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
<tr><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;">Comparison</th><th style="padding:6px;border-bottom:1px solid #ccc;">==</th><th style="padding:6px;border-bottom:1px solid #ccc;">===</th><th style="padding:6px;border-bottom:1px solid #ccc;">Object.is</th></tr>
<tr><td style="padding:6px;"><code>'1' vs 1</code></td><td style="padding:6px;">true (coerces)</td><td style="padding:6px;">false</td><td style="padding:6px;">false</td></tr>
<tr><td style="padding:6px;"><code>NaN vs NaN</code></td><td style="padding:6px;">false</td><td style="padding:6px;">false</td><td style="padding:6px;"><strong>true</strong></td></tr>
<tr><td style="padding:6px;"><code>0 vs -0</code></td><td style="padding:6px;">true</td><td style="padding:6px;">true</td><td style="padding:6px;"><strong>false</strong></td></tr>
<tr><td style="padding:6px;"><code>null vs undefined</code></td><td style="padding:6px;">true</td><td style="padding:6px;">false</td><td style="padding:6px;">false</td></tr>
</table>
<pre>NaN === NaN;             // false — the only value not equal to itself!
Object.is(NaN, NaN);     // true
Number.isNaN(x);         // the practical way to test for NaN

0 === -0;                // true
Object.is(0, -0);        // false (they differ: 1/0 = Infinity, 1/-0 = -Infinity)

// Where this matters in real code:
// React uses Object.is for useState bail-out and useEffect deps comparison!
const [state, setState] = useState(obj);
setState(obj);           // same reference per Object.is → NO re-render</pre>
<div class="key-point"><code>===</code> for everyday code; <code>Object.is</code> is "SameValue" semantics — identical except it treats <code>NaN</code> as equal to itself and distinguishes <code>±0</code>. Knowing React relies on <code>Object.is</code> for state/deps comparison turns trivia into a senior answer.</div>`,
      },
      {
        q: 'Why does forEach not work with async/await? Sequential vs parallel async loops.',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p><code>forEach</code> doesn't await its callback, so an <code>async</code> callback becomes fire-and-forget — the loop moves on, your "done" log runs before anything finishes, and rejected promises turn into unhandled rejections. If order matters, use <code>for...of</code> with <code>await</code> for true sequential execution. If the calls are independent, map to promises and <code>Promise.all</code> them for parallelism, or <code>allSettled</code> to collect failures. And the follow-up they love — 10,000 items — means bounded concurrency with something like p-limit, not an unbounded <code>Promise.all</code>.</p></div>
<pre>// ❌ THE BUG: forEach ignores the returned promises
const ids = [1, 2, 3];
ids.forEach(async (id) => {
  await saveToDb(id);        // fire-and-forget!
});
console.log('done');          // logs BEFORE any save completes 😱
// forEach doesn't await its callback — errors are unhandled rejections too

// ✅ SEQUENTIAL — one at a time (order matters, e.g. migrations):
for (const id of ids) {
  await saveToDb(id);         // total time = sum of all calls
}

// ✅ PARALLEL — all at once (independent work):
await Promise.all(ids.map(id => saveToDb(id)));
// total time ≈ slowest single call; rejects fast on first failure

// ✅ PARALLEL, collect failures instead of fast-fail:
const results = await Promise.allSettled(ids.map(id => saveToDb(id)));

// ✅ LIMITED CONCURRENCY — e.g. max 5 at once against a rate-limited API:
// use a pool library (p-limit) or chunk the work:
for (let i = 0; i &lt; ids.length; i += 5) {
  await Promise.all(ids.slice(i, i + 5).map(saveToDb));
}</pre>
<div class="key-point">The senior distinction: <code>map + Promise.all</code> = parallel, <code>for...of + await</code> = sequential, <code>forEach + async</code> = broken (unawaited promises, swallowed errors). Follow-up they love: "what if the array has 10,000 items?" → bounded concurrency, not <code>Promise.all</code>.</div>`,
      },
      //   ],
      // },
    ],
  },
];
