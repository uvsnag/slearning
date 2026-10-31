import type { KmNode } from '../../types';

export const classes: KmNode = {
  title: 'Prototypes & Classes',
  level: 'intermediate',
  summary:
    'How objects share behavior through the prototype chain, and the class syntax built on top.',
  simple:
    'Every object has a "parent" it can ask for help. If you ask an object for something it does not have, it asks its parent, then the grandparent, and so on.',
  points: [
    'JavaScript uses prototypes, not classical classes, under the hood.',
    'The class keyword (ES2015) is a nicer syntax for the same prototype system.',
    'Prefer composition (combining small objects) over deep inheritance.',
  ],
  children: [
    {
      title: 'Prototype Chain',
      level: 'intermediate',
      summary: 'Each object links to a prototype object; property lookups walk up this chain.',
      simple:
        'Like asking for a tool: first you check your own toolbox, then your parent’s garage, then the hardware store. The first place that has it wins.',
      points: [
        'Read the link with <code>Object.getPrototypeOf(obj)</code> (avoid the old <code>__proto__</code>).',
        'Arrays inherit from <code>Array.prototype</code>, which inherits from <code>Object.prototype</code>.',
        'The chain ends at <code>null</code>.',
        'Writing a property always creates it on the object itself, not on the prototype.',
        '<code>Object.create(proto)</code> makes an object with the prototype you choose.',
      ],
      detail: `<pre><code>const animal = { eats: true };
const dog = Object.create(animal);
dog.barks = true;
dog.eats;                                  // true (from prototype)
Object.getPrototypeOf(dog) === animal;     // true</code></pre>`,
    },
    {
      title: 'Constructors & new',
      level: 'intermediate',
      summary:
        'Before classes, a function called with new created objects and linked them to its prototype.',
      points: [
        '<code>new F()</code> creates an empty object, links it to <code>F.prototype</code>, runs F with this = the object, then returns it.',
        'Methods put on <code>F.prototype</code> are shared by all instances (saves memory).',
        '<code>obj instanceof F</code> checks whether <code>F.prototype</code> is in the chain.',
        'You will still meet this style in older code and libraries.',
      ],
      detail: `<pre><code>function User(name) { this.name = name; }
User.prototype.hi = function () { return "Hi " + this.name; };
const u = new User("An");
u.hi(); // "Hi An"</code></pre>`,
    },
    {
      title: 'Classes',
      level: 'intermediate',
      summary: 'A clean syntax for constructor functions and prototype methods.',
      simple:
        'A class is a cookie cutter. Each cookie (instance) has its own decorations (fields) but uses the same shape (methods).',
      points: [
        '<code>constructor</code> runs on <code>new</code>; methods go on the prototype.',
        'Class fields: <code>count = 0;</code> are set on each instance.',
        'Class bodies always run in strict mode.',
        'Classes are not hoisted like functions (they are in the TDZ).',
        '<code>static</code> members belong to the class itself: <code>Math.max</code>-style helpers.',
      ],
      detail: `<pre><code>class Cart {
  items = [];
  add(item) { this.items.push(item); return this; }
  get total() { return this.items.reduce((s, i) =&gt; s + i.price, 0); }
  static empty() { return new Cart(); }
}
Cart.empty().add({ price: 5 }).total; // 5</code></pre>`,
    },
    {
      title: 'Inheritance: extends & super',
      level: 'intermediate',
      summary:
        'extends makes one class build on another; super calls the parent constructor or methods.',
      points: [
        'In a child constructor, call <code>super()</code> before using <code>this</code>.',
        '<code>super.method()</code> calls the parent version of a method.',
        'You can extend built-ins: <code>class MyError extends Error</code>.',
        'Only one parent class; use mixins or composition for more.',
      ],
      detail: `<pre><code>class Animal {
  constructor(name) { this.name = name; }
  speak() { return this.name + " makes a sound"; }
}
class Dog extends Animal {
  speak() { return super.speak() + " (woof)"; }
}</code></pre>`,
    },
    {
      title: 'Private Fields & Accessors',
      level: 'advanced',
      summary:
        'Real privacy with #fields (ES2022), plus getters and setters for computed properties.',
      points: [
        '<code>#balance</code> can only be read inside the class body; outside access is a syntax error.',
        'Private methods too: <code>#validate() {}</code>.',
        '<code>get</code>/<code>set</code> look like properties but run code.',
        'Before #, the convention was <code>_name</code> (not really private).',
        '<code>#x in obj</code> checks if an object has that private field.',
      ],
      detail: `<pre><code>class Account {
  #balance = 0;
  deposit(n) { if (n &lt;= 0) throw new Error("bad"); this.#balance += n; }
  get balance() { return this.#balance; }
}</code></pre>`,
    },
    {
      title: 'Composition over Inheritance',
      level: 'advanced',
      summary: 'Build objects from small pieces of behavior instead of tall class trees.',
      simple:
        'Instead of a family tree where every child must look like its parents, you build with Lego: pick the pieces each object needs.',
      points: [
        'Deep inheritance chains are hard to change (the "gorilla holding the banana" problem).',
        'Pass helpers in (dependency injection) or combine plain functions.',
        'Factory functions with closures are a class-free option.',
        'Many modern codebases (React hooks, for example) use almost no inheritance.',
      ],
      tip: 'Interview line: "I use inheritance for a true is-a relation, composition for everything else."',
    },
  ],
};
