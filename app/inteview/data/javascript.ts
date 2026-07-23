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
        a: `<div class="interview-answer"><p><code>const</code> is the default choice, <code>let</code> is used only when a variable is really reassigned, and <code>var</code> is treated as legacy. <code>var</code> is function-scoped and hoisted as <code>undefined</code>, while <code>let</code> and <code>const</code> are block-scoped and cannot be used before their declaration line. Note that <code>const</code> locks only the binding, not the value, so the contents of a <code>const</code> array or object can still be changed.</p></div>
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
        a: `<div class="interview-answer"><p>Hoisting means declarations are registered before the code runs. Function declarations are hoisted with their full body, so they can be called earlier in the file. A <code>var</code> is hoisted and set to <code>undefined</code>, while <code>let</code> and <code>const</code> are hoisted but stay in the temporal dead zone, so using them early throws an error.</p></div>
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
        a: `<div class="interview-answer"><p>A closure is a function together with the outer variables it was created with, so it can still use those variables after the outer function has returned. This is the basis for data privacy, factory functions, memoization, and React hooks. A common bug is a loop using <code>var</code>, where every callback shares one variable and prints the final value; using <code>let</code> gives each loop step its own variable.</p></div>
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
        a: `<div class="interview-answer"><p>JavaScript runs on a single thread, so the event loop moves callbacks between queues to handle async work. After each task, the engine empties the whole microtask queue, such as promise callbacks, before it runs a single macrotask like <code>setTimeout</code>. This is why a promise scheduled after a <code>setTimeout</code> still runs first.</p></div>
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
        a: `<div class="interview-answer"><p>Every object has a hidden link to a prototype, and property lookups follow this chain until a match is found or it reaches <code>null</code>. This is based on delegation, not copying, which is the main difference from classical inheritance. The ES6 <code>class</code> keyword is only syntax on top of prototypes, and deep chains are slower to look up, so composition is often preferred.</p></div>
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
        a: `<div class="interview-answer"><p><code>===</code> compares both type and value with no conversion and should be the default. <code>==</code> converts types before comparing, which causes surprises such as <code>0 == ''</code> being true. One common safe use of <code>==</code> is <code>x == null</code>, which checks for both <code>null</code> and <code>undefined</code> at once.</p></div>
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
        a: `<div class="interview-answer"><p>The value of <code>this</code> is decided by how a function is called, not where it is written. The rules are checked in order: <code>new</code>, then <code>bind</code>/<code>call</code>/<code>apply</code>, then a method called on an object, then the default which is <code>undefined</code> in strict mode. Arrow functions have no <code>this</code> of their own and take it from the surrounding scope. A frequent bug is passing a method as a callback, which loses the object binding; fix it with <code>bind</code> or an arrow wrapper.</p></div>
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
        a: `<div class="interview-answer"><p>All three set <code>this</code> for a function directly. <code>call</code> and <code>apply</code> run the function right away, with <code>call</code> taking arguments one by one and <code>apply</code> taking them as an array, while <code>bind</code> returns a new function with <code>this</code> fixed for later. A bound function's <code>this</code> cannot be changed again, and none of the three affect arrow functions.</p></div>
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
        a: `<div class="interview-answer"><p>A promise represents one future value and moves through the pending, fulfilled, or rejected states. <code>async</code>/<code>await</code> is cleaner syntax over promises, letting async code be written in a linear <code>try</code>/<code>catch</code> style. Independent calls should run in parallel with <code>Promise.all</code>, or <code>Promise.allSettled</code> when every result is needed even if some fail. A missing <code>await</code> can hide errors as unhandled rejections.</p></div>
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
        a: `<div class="interview-answer"><p>Both limit how often a handler runs but answer different questions. Debounce waits until activity stops and then fires once, which suits search-as-you-type or autosave. Throttle lets a handler run at a steady maximum rate during continuous activity, which suits scroll or mousemove. Use debounce when only the final result matters and throttle when regular updates are needed.</p></div>
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
        a: `<div class="interview-answer"><p>A <code>WeakMap</code> and <code>WeakSet</code> hold their keys weakly, so if the only remaining reference to an object is that key, the object can be garbage collected. This makes them good for attaching data to objects, such as caching per DOM node or storing private data, without causing memory leaks. They are not iterable and have no <code>size</code>, because their contents can disappear at any time.</p></div>
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
        a: `<div class="interview-answer"><p>Events bubble up from the target element through its parent elements. Event delegation uses this by placing one listener on a stable parent and checking <code>event.target</code>, instead of adding many listeners on child elements. This uses less memory and also handles elements added to the page later. Some events like <code>focus</code> do not bubble, so the capture phase or <code>focusin</code> is needed.</p></div>
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
        a: `<div class="interview-answer"><p>An iterator is an object with a <code>next()</code> method that returns a value and a done flag. A generator is an easy way to create one; a <code>function*</code> pauses at each <code>yield</code> and continues on the next call. This lets values be produced lazily, so even infinite sequences can be modeled without using up memory. Generators are most often met through <code>for...of</code> and spread.</p></div>
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
        a: `<div class="interview-answer"><p>A shallow copy duplicates only the top level, using spread or <code>Object.assign</code>, so nested objects are still shared by reference. A deep copy duplicates every level; <code>structuredClone</code> is the modern built-in and handles dates, maps, and circular references. The older <code>JSON.parse(JSON.stringify())</code> method works but drops functions and <code>undefined</code> and turns dates into strings.</p></div>
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
        a: `<div class="interview-answer"><p>These are three stages of the same goal of encapsulation. The IIFE module pattern created privacy before modules existed, CommonJS gave Node synchronous <code>require</code> and <code>module.exports</code>, and ES modules are the current standard with static <code>import</code> and <code>export</code>. The static structure of ES modules is what makes tree-shaking possible. Mixing the async ESM with the synchronous CommonJS in Node can still be difficult.</p></div>
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
        a: `<div class="interview-answer"><p>Currying changes a function with many arguments into a chain of single-argument functions, so <code>f(a, b, c)</code> becomes <code>f(a)(b)(c)</code>. Its main value is partial application, filling in some arguments early to build more specific functions. This helps with composition and functional pipelines, but overusing it can make a simple call harder to read.</p></div>
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
        a: `<div class="interview-answer"><p>These results come from two conversion rules. The <code>+</code> operator joins strings if either side is a string or an object that becomes one, and otherwise it adds numbers. Every other math operator has no string form, so it converts both sides to numbers first. The key point is naming the mechanism, where objects convert through <code>valueOf</code> then <code>toString</code>, and avoiding implicit coercion in real code.</p></div>
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
        a: `<div class="interview-answer"><p>A <code>Proxy</code> wraps an object and can intercept basic operations such as get, set, has, and delete through trap functions. This is how reactive libraries like Vue 3 and MobX work internally. <code>Reflect</code> provides the default behavior of each trap as a plain function, so a trap can forward to <code>Reflect.get</code> instead of rewriting the default. Proxies add overhead, so they are best used only when interception is truly needed.</p></div>
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
        a: `<div class="interview-answer"><p><code>undefined</code> means no value was given yet, such as an unassigned variable, a missing property, or a function with no return. <code>null</code> is a value a developer sets on purpose to mean empty. They are loosely equal but not strictly equal, and default parameters apply only for <code>undefined</code>, so passing <code>null</code> skips the default. <code>typeof null</code> returns the string "object", which is a well-known bug that cannot be fixed.</p></div>
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
        a: `<div class="interview-answer"><p>The main difference is what each method returns. <code>map</code> creates a new array of the same length, <code>filter</code> creates a smaller array, <code>reduce</code> combines everything into one value, and <code>find</code> returns the first match. <code>forEach</code> returns <code>undefined</code> and is only for side effects, so it cannot be chained. It is also not possible to break out of <code>forEach</code>; use <code>for...of</code> or <code>find</code>/<code>some</code>/<code>every</code> for early exit.</p></div>
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
        a: `<div class="interview-answer"><p>Both use the same three-dot syntax but work in opposite directions. Spread expands an iterable into separate items, useful for copying arrays, merging objects, or passing array items as arguments. Rest collects the remaining items into a real array, for variadic parameters or the tail of a destructuring pattern. Spread makes only a shallow copy, so nested objects are still shared.</p></div>
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
        a: `<div class="interview-answer"><p>Template literals allow value interpolation and real multi-line strings using backtick delimiters. A tagged template is a function placed before the literal; it receives the static text pieces as an array and the interpolated values separately, so it controls how they are joined. This is used by libraries like lit-html and styled-components to safely escape untrusted values. The <code>raw</code> property also gives the un-escaped source, which is how <code>String.raw</code> works.</p></div>
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
        a: `<div class="interview-answer"><p>Destructuring is a short way to pull values out of arrays and objects in one line. It supports default values, renaming, and nested extraction, and it works well for function parameters that take an options object. Note two things: array destructuring works on any iterable, and a default value is only used when the value is <code>undefined</code>, not <code>null</code>.</p></div>
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
        a: `<div class="interview-answer"><p>The main difference is <code>this</code>. A regular function gets its own <code>this</code> based on how it is called, while an arrow function has no <code>this</code> and takes it from the surrounding scope. Arrow functions also have no <code>arguments</code> object, cannot be used with <code>new</code>, and have no <code>prototype</code>. Use arrow functions for callbacks and regular functions for object methods and constructors.</p></div>
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
        a: `<div class="interview-answer"><p>This example tests closures and event loop order together. A loop with <code>var</code> prints the final value each time because all callbacks share one variable, while <code>let</code> gives each loop step its own value. For order, synchronous code runs first, then microtasks like promise <code>.then</code>, then macrotasks like <code>setTimeout</code>. A promise executor also runs right away, so its value is set but logged later.</p></div>
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
        a: `<div class="interview-answer"><p>Optional chaining <code>?.</code> stops and returns <code>undefined</code> as soon as it reaches <code>null</code> or <code>undefined</code>, so long safety checks are not needed. Nullish coalescing <code>??</code> gives a fallback value only for <code>null</code> or <code>undefined</code>. This is the key difference from <code>||</code>, which also replaces <code>0</code>, empty string, and <code>false</code>. Use <code>??</code> when zero or an empty string are valid values.</p></div>
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
        a: `<div class="interview-answer"><p>These are three levels of locking an object. <code>preventExtensions</code> stops adding new properties, <code>seal</code> also stops deleting them, and <code>freeze</code> also stops changing values, so a frozen object is read-only. All three are shallow, so nested objects can still be changed and a recursive deep freeze is needed for full protection. The blocked actions fail quietly unless the code runs in strict mode.</p></div>
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
        a: `<div class="interview-answer"><p>A <code>Symbol</code> is a unique primitive value, so it is a safe way to add an object key that will never clash with other keys, and it stays hidden from <code>Object.keys</code> and <code>for...in</code>. Well-known Symbols are more powerful because they connect to built-in behavior: <code>Symbol.iterator</code> makes an object work with <code>for...of</code> and spread, and <code>Symbol.toPrimitive</code> controls type conversion. <code>Symbol.for</code> uses a shared global registry when the same symbol is needed in different places.</p></div>
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
        a: `<div class="interview-answer"><p>Use a <code>Map</code> instead of a plain object when keys are not strings, when insertion order matters, or when adding and removing entries often, since it also has a real <code>size</code> and easy iteration. Use a <code>Set</code> for unique values and fast <code>has()</code> checks, and <code>[...new Set(arr)]</code> to remove duplicates. The Weak versions take only object keys and hold them weakly so they can be garbage collected, but they cannot be iterated and have no size. Plain objects are still fine for fixed, string-keyed data.</p></div>
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
        a: `<div class="interview-answer"><p>These four promise methods handle different needs. <code>Promise.all</code> fails as soon as one promise rejects, so use it when every result is required. <code>Promise.allSettled</code> never rejects and reports the status of each promise, which suits independent tasks where some may fail. <code>Promise.race</code> settles on the first promise to finish either way, and <code>Promise.any</code> resolves on the first success and rejects only if all fail.</p></div>
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
        a: `<div class="interview-answer"><p><code>for...in</code> loops over keys, including inherited ones, so it is meant for object properties and is a poor choice for arrays because it gives string indexes and extra properties. <code>for...of</code> loops over the values of any iterable such as arrays, strings, Maps, and Sets, and is the normal choice for arrays. Plain objects are not iterable, so use <code>Object.entries</code> with <code>for...of</code> to loop over key and value pairs.</p></div>
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
        a: `<div class="interview-answer"><p>The Temporal Dead Zone is the gap between entering a scope and reaching a <code>let</code> or <code>const</code> declaration. During this gap the variable exists but any access throws an error. This is a deliberate feature that turns silent <code>undefined</code> from <code>var</code> into a clear error for use-before-declaration. One surprise is that <code>typeof</code> returns "undefined" for a name that was never declared, but throws for a name still in the dead zone.</p></div>
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
        a: `<div class="interview-answer"><p>These are three levels of locking an object. <code>preventExtensions</code> stops adding new properties, <code>seal</code> also stops deleting them, and <code>freeze</code> also makes existing values read-only. <code>freeze</code> is the common choice for config objects and constants, but it is shallow, so nested objects stay changeable and need a recursive <code>deepFreeze</code>. The blocked actions fail quietly in normal mode and only throw in strict mode.</p></div>
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
        a: `<div class="interview-answer"><p>JavaScript runs on a single thread, so any long synchronous task freezes clicks, rendering, and I/O. For heavy CPU work, move it to a Web Worker or a Node worker thread so it runs off the main thread. If it must stay on the main thread, split it into small chunks and yield with <code>setTimeout</code> or <code>requestIdleCallback</code>. The key idea is to separate CPU-bound work, which needs a worker, from I/O-bound work, which async already handles well.</p></div>
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
        a: `<div class="interview-answer"><p>A memory leak is any object that stays reachable after it is no longer needed, so the garbage collector cannot free it. Common causes are forgotten event listeners and timers, closures that hold large data, detached DOM nodes still kept in an array, and accidental global variables. In React the most common cause is a missing <code>useEffect</code> cleanup for subscriptions, intervals, and listeners. Chrome DevTools heap snapshots, compared before and after an action, help find the objects that keep growing.</p></div>
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
        a: `<div class="interview-answer"><p>The result is <code>[1, NaN, 3]</code>. <code>map</code> calls its callback with three arguments (element, index, array), but <code>parseInt</code> takes only two (string, radix), so the index is passed as the radix. That makes <code>parseInt('7', 1)</code> invalid, which returns <code>NaN</code>. The general rule is to not pass a function straight to <code>map</code> unless its arguments are known; fix this with <code>.map(Number)</code> or an arrow that sets the radix.</p></div>
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
        a: `<div class="interview-answer"><p>This is not a JavaScript bug but standard IEEE-754 double precision, the same in Java, Python, and C#. The values <code>0.1</code> and <code>0.2</code> have no exact binary form, so they are stored slightly off and the small errors add up. To compare floats, check that the difference is smaller than a small tolerance value. For money, avoid floats and work in whole units like cents, or use a decimal library.</p></div>
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
        a: `<div class="interview-answer"><p>Yes, it is possible, and the point is to explain how. With loose <code>==</code>, comparing an object to a number triggers type conversion, so an object whose <code>valueOf</code> increases a counter can return 1, then 2, then 3. It can also be done with strict <code>===</code> using a getter that has a side effect, or with a <code>Proxy</code> that intercepts <code>Symbol.toPrimitive</code>. The real lesson is that <code>==</code> runs conversion hooks and that property access can run any code, so this should never be used in real code.</p></div>
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
        a: `<div class="interview-answer"><p><code>[10, 9, 1].sort()</code> returns <code>[1, 10, 9]</code> because the default sort turns elements into strings and compares them as text, so numbers need a comparator like <code>(a, b) =&gt; a - b</code>. Two more points: <code>sort</code> changes the array in place and returns the same reference, so copy it first with spread or use <code>toSorted</code>; and the comparator must return a negative, zero, or positive number, not a boolean. Since ES2019, <code>sort</code> is also guaranteed to be stable.</p></div>
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
        a: `<div class="interview-answer"><p>The key rule is that an <code>async</code> function runs synchronously up to its first <code>await</code>, and everything after that <code>await</code> is queued as a microtask. So all the plain synchronous logging happens first, then the microtask queue runs in order, and a <code>setTimeout</code> callback, being a macrotask, always runs last. In effect, <code>await x</code> behaves like <code>Promise.resolve(x).then(rest)</code>, which lets the output be worked out step by step.</p></div>
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
        a: `<div class="interview-answer"><p><code>Array(3)</code> makes a sparse array with length 3 but no real elements, only empty holes, and <code>map</code> skips holes, so it returns the same empty slots instead of <code>[1, 1, 1]</code>. To fix this, create real elements first with <code>Array.from({length: 3}, ...)</code>, or use <code>fill</code> before <code>map</code>, or spread which turns holes into <code>undefined</code>. Also note that <code>Array</code> with one number sets the length, while <code>Array('3')</code> creates an element, so sparse arrays are best avoided.</p></div>
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
        a: `<div class="interview-answer"><p><code>===</code> is the normal choice: strict and with no type conversion. <code>Object.is</code> works the same as <code>===</code> except it treats <code>NaN</code> as equal to itself and treats <code>+0</code> and <code>-0</code> as different. This matters in practice because React uses <code>Object.is</code> to decide whether state changed and whether to skip a re-render. That is why passing the same object reference to <code>setState</code> does not cause a new render.</p></div>
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
        a: `<div class="interview-answer"><p><code>forEach</code> does not wait for its callback, so an <code>async</code> callback runs without being awaited; the loop finishes early, a "done" log runs before the work completes, and rejected promises become unhandled errors. If order matters, use <code>for...of</code> with <code>await</code> for true sequential runs. If the calls are independent, map them to promises and use <code>Promise.all</code> for parallel work, or <code>allSettled</code> to collect failures. For very large lists, use limited concurrency instead of an unbounded <code>Promise.all</code>.</p></div>
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
