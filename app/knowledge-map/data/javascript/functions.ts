import type { KmNode } from '../../types';

export const functions: KmNode = {
  title: 'Functions & Scope',
  level: 'beginner',
  summary:
    'How to write functions, where variables are visible, closures, hoisting and the this keyword.',
  simple:
    'Functions are little machines you build once and use many times. Scope decides which variables each machine can see, and closures let a machine remember things.',
  points: [
    'Functions are values: store them, pass them, return them.',
    'Closures and this are the two topics interviews love most.',
    'Arrow functions behave differently from normal ones with this.',
  ],
  children: [
    {
      title: 'Declaring Functions',
      level: 'beginner',
      summary:
        'Function declarations, function expressions and arrow functions: three ways to make a function.',
      simple:
        'Same recipe, three ways to write it on the card. The result is the same; small details about when you can use it differ.',
      points: [
        'Declaration: <code>function add(a, b) { return a + b; }</code> — can be called before it appears.',
        'Expression: <code>const add = function (a, b) { ... }</code> — usable only after this line.',
        'Arrow: <code>const add = (a, b) =&gt; a + b;</code> — short, returns the expression directly.',
        'Without <code>return</code>, a function returns <code>undefined</code>.',
      ],
      detail: `<pre><code>function greet(name) { return "Hi " + name; }
const square = (x) =&gt; x * x;
const toUser = (name) =&gt; ({ name });   // wrap objects in ( )</code></pre>`,
    },
    {
      title: 'Parameters',
      level: 'beginner',
      summary:
        'Default values, rest parameters and destructured parameters make functions flexible.',
      simple:
        'Defaults are like a coffee order that says "medium unless I tell you otherwise". Rest collects all extra items into one bag.',
      points: [
        'Missing arguments are <code>undefined</code>; extra ones are ignored.',
        'Defaults: <code>function f(size = 10) {}</code> — used only when the argument is <code>undefined</code>.',
        'Rest: <code>function sum(...nums) {}</code> gives a real array.',
        'Options object: <code>function open({ url, timeout = 5000 }) {}</code> reads well at the call site.',
        'Objects are passed as a reference copy: changing their contents is visible to the caller.',
      ],
      detail: `<pre><code>function sum(...nums) {
  return nums.reduce((a, b) =&gt; a + b, 0);
}
sum(1, 2, 3); // 6

function connect({ host, port = 443 } = {}) { /* ... */ }</code></pre>`,
    },
    {
      title: 'Higher-Order Functions',
      level: 'beginner',
      summary: 'Functions that take other functions as arguments or return them.',
      simple:
        'You give a friend instructions on a note ("call me when you arrive"). The note is a callback; your friend is the higher-order function.',
      points: [
        'A callback is a function you pass in to be called later.',
        'Array methods like <code>map</code>, <code>filter</code> and <code>forEach</code> are higher-order.',
        'Returning functions lets you build helpers: <code>const add5 = makeAdder(5)</code>.',
        'This is the base of functional programming in JS.',
      ],
      detail: `<pre><code>const makeAdder = (n) =&gt; (x) =&gt; x + n;
const add5 = makeAdder(5);
[1, 2, 3].map(add5); // [6, 7, 8]</code></pre>`,
    },
    {
      title: 'Scope',
      level: 'beginner',
      summary: 'The area of code where a variable is visible: global, function or block.',
      simple:
        'Scopes are rooms inside rooms. From an inner room you can see into outer rooms, but not the other way around.',
      points: [
        'Block scope: <code>let</code>/<code>const</code> inside <code>{ }</code>.',
        'Function scope: <code>var</code> and parameters live in the whole function.',
        'Lexical scope: what a function can see depends on where it is written, not where it is called.',
        'Lookups go outward room by room (the scope chain) up to global.',
        'Inner variables can "shadow" (hide) outer ones with the same name.',
      ],
    },
    {
      title: 'Closures',
      level: 'intermediate',
      summary:
        'A function that remembers the variables around it, even after the outer function has finished.',
      simple:
        'A closure is a backpack. When a function is created, it packs the variables it can see and carries them wherever it goes.',
      points: [
        'Every function in JS forms a closure over its surrounding scope.',
        'Used for private state, factories, memoization and event handlers.',
        'The closure keeps a live link to the variable, not a copy of its value.',
        'Captured variables stay in memory as long as the function is reachable.',
      ],
      detail: `<pre><code>function counter() {
  let count = 0;                 // private
  return () =&gt; ++count;
}
const next = counter();
next(); // 1
next(); // 2</code></pre>`,
      tip: 'Interview answer: "A closure is a function plus the lexical environment it was created in."',
    },
    {
      title: 'Hoisting & TDZ',
      level: 'intermediate',
      summary:
        'Declarations are set up before code runs; let/const exist but cannot be used until their line (the TDZ).',
      simple:
        'Before the show, the stage crew reads the script and places name tags on seats. var seats get an empty plate (undefined); let/const seats are taped off until their line is reached.',
      points: [
        'Function declarations are hoisted fully: you can call them before their line.',
        '<code>var</code> is hoisted and set to <code>undefined</code>.',
        '<code>let</code>, <code>const</code> and <code>class</code> are hoisted but uninitialized.',
        'TDZ (temporal dead zone) = the time between scope start and the declaration line; access throws <code>ReferenceError</code>.',
      ],
      detail: `<pre><code>console.log(a); // undefined
var a = 1;

console.log(b); // ReferenceError (TDZ)
let b = 2;

hello();        // works
function hello() {}</code></pre>`,
    },
    {
      title: 'IIFE & Module Pattern',
      level: 'intermediate',
      summary:
        'A function that runs right away, once used to create private scope before modules existed.',
      points: [
        'IIFE = Immediately Invoked Function Expression: <code>(() =&gt; { ... })()</code>.',
        'Before ES modules, this was the way to avoid polluting the global scope.',
        'The "module pattern" returned an object of public functions sharing private closure state.',
        'Today, ES modules and block scope cover most of these needs.',
      ],
    },
    {
      title: 'The this Keyword',
      level: 'intermediate',
      summary:
        'this is decided by how a function is called, not where it is written (except for arrows).',
      simple:
        'this is the word "me". Who "me" is depends on who is speaking: the object in front of the dot when you call the function.',
      points: [
        'Method call <code>obj.fn()</code>: this is <code>obj</code>.',
        'Plain call <code>fn()</code>: <code>undefined</code> in strict mode/modules, the global object in sloppy mode.',
        '<code>new Fn()</code>: this is the new object.',
        'Event handler (normal function): this is the element.',
        'Arrow functions have no own this; they use the this of the surrounding code.',
      ],
      detail: `<pre><code>const user = {
  name: "An",
  hi() { return this.name; },
};
user.hi();            // "An"
const f = user.hi;
f();                  // TypeError or undefined: this is lost</code></pre>`,
      tip: 'Losing this when passing a method as a callback (setTimeout(obj.fn)) is a classic bug. Fix it with an arrow or bind.',
    },
    {
      title: 'call, apply & bind',
      level: 'intermediate',
      summary: 'Methods that let you choose this yourself when calling a function.',
      simple:
        'They let you say "run this function, and pretend you are this object while doing it".',
      points: [
        '<code>fn.call(obj, a, b)</code>: call now, arguments one by one.',
        '<code>fn.apply(obj, [a, b])</code>: call now, arguments as an array.',
        '<code>fn.bind(obj)</code>: returns a new function with this fixed forever.',
        'A bound function cannot be re-bound; arrows ignore all three for this.',
      ],
      detail: `<pre><code>function intro(greet) { return greet + ", " + this.name; }
intro.call({ name: "An" }, "Hi");     // "Hi, An"
intro.apply({ name: "Binh" }, ["Yo"]); // "Yo, Binh"
const bound = intro.bind({ name: "Chi" });
setTimeout(() =&gt; console.log(bound("Hey")), 0);</code></pre>`,
    },
    {
      title: 'Arrows vs Normal Functions',
      level: 'intermediate',
      summary:
        'Arrows are not just shorter: they have no own this, arguments, or prototype, and cannot be used with new.',
      points: [
        'Great for callbacks inside methods: they keep the outer this.',
        'Bad as object methods: <code>this</code> will not point to the object.',
        'No <code>arguments</code> object; use rest parameters instead.',
        'Cannot be constructors: <code>new (() =&gt; {})</code> throws.',
      ],
      detail: `<pre><code>class Timer {
  seconds = 0;
  start() {
    setInterval(() =&gt; this.seconds++, 1000); // this = the Timer
  }
}</code></pre>`,
      tip: 'Rule of thumb: methods as normal functions (or class methods), callbacks as arrows.',
    },
  ],
};
