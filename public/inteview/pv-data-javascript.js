// Interview data: javascript
// Auto-generated from pv.html
(function () {
  (window.__pvTopics = window.__pvTopics || []).push(
  {
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
          ],
        },

        // ───────────────────────── 3. REACTJS ─────────────────────────
  );
})();
