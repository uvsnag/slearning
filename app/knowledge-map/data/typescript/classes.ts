import type { KmNode } from '../../types';

export const classes: KmNode = {
  title: 'Classes',
  level: 'beginner',
  summary: 'JavaScript classes with types added: typed fields, access modifiers, abstract classes and decorators.',
  simple:
    'A class is a cookie cutter. TypeScript adds labels to the cutter: which parts are public, which are private, and what each part is made of.',
  points: [
    'TypeScript classes are normal JavaScript classes plus type checks.',
    'Most extras (public, private, abstract) vanish after compiling.',
    'Many TS codebases use few classes; plain objects and functions are common too.',
  ],
  children: [
    {
      title: 'Fields & Constructors',
      level: 'beginner',
      summary: 'Declare each field with its type; the constructor fills them in.',
      simple:
        'Fields are the drawers in a cabinet. The constructor is the person who puts the first things in each drawer.',
      points: [
        'Fields must be declared: <code>name: string;</code>.',
        'With <code>strictPropertyInitialization</code>, every field must be set in the constructor.',
        '<code>name!: string</code> says "trust me, it gets set later" (e.g. by a framework).',
        'Fields can have default values: <code>count = 0;</code>.',
      ],
      detail: `<pre><code>class User {
  name: string;
  active = true;

  constructor(name: string) {
    this.name = name;
  }
}</code></pre>`,
    },
    {
      title: 'Access Modifiers',
      level: 'beginner',
      summary: 'public, protected and private control who may use a field or method.',
      simple:
        'public is the shop floor, protected is the staff room (family only), private is the owner’s safe.',
      points: [
        '<code>public</code> (default): anyone can use it.',
        '<code>protected</code>: the class and its subclasses.',
        '<code>private</code>: only inside the class. Checked at compile time only.',
        '<code>readonly</code>: can be set in the constructor, never changed afterwards.',
      ],
    },
    {
      title: 'private vs #private',
      level: 'intermediate',
      summary: 'TS private is a compile-time rule; JavaScript #fields are truly hidden at runtime.',
      simple:
        'private is a "Do not enter" sign: polite people obey it. #private is a locked door: nobody gets in.',
      points: [
        '<code>private x</code> can still be read in JS via <code>obj[\'x\']</code> or in plain JS callers.',
        '<code>#x</code> is real JavaScript (ES2022) and is enforced by the runtime.',
        '<code>#x</code> also works with <code>in</code> checks: <code>#x in obj</code>.',
        'Use <code>#</code> when hiding matters at runtime, e.g. in a published library.',
      ],
    },
    {
      title: 'Parameter Properties',
      level: 'intermediate',
      summary: 'A shortcut: adding a modifier to a constructor parameter creates and assigns the field.',
      simple:
        'Instead of writing your name on a form and then copying it to a badge, the form prints the badge for you.',
      points: [
        '<code>constructor(private readonly repo: Repo) {}</code> declares and sets <code>this.repo</code>.',
        'Very common in Angular and NestJS for dependency injection.',
        'It generates runtime code, so it is not "erasable" syntax.',
        'Rejected by Node type stripping and by <code>erasableSyntaxOnly</code> (TS 5.8).',
      ],
      detail: `<pre><code>class OrderService {
  constructor(private readonly repo: OrderRepo) {}

  find(id: string) {
    return this.repo.get(id);
  }
}</code></pre>`,
    },
    {
      title: 'implements & extends',
      level: 'intermediate',
      summary: 'extends inherits code from a parent class; implements promises to match an interface.',
      simple:
        'extends is inheriting your parent’s house. implements is passing an inspection: you must meet the rules, but nobody gives you anything.',
      points: [
        'A class can <code>extends</code> one class but <code>implements</code> many interfaces.',
        '<code>implements</code> only checks; it does not add types to the class.',
        'Use <code>override</code> on methods replacing a parent method (TS 4.3+).',
        '<code>noImplicitOverride</code> makes <code>override</code> required, catching typos.',
      ],
    },
    {
      title: 'Abstract Classes',
      level: 'intermediate',
      summary: 'A base class you cannot create directly, with methods that subclasses must fill in.',
      simple:
        'An abstract class is a half-built house with the rooms marked. Every buyer must finish the marked rooms before moving in.',
      points: [
        '<code>abstract class Shape</code> cannot be used with <code>new</code>.',
        '<code>abstract area(): number;</code> has no body; subclasses must implement it.',
        'Unlike interfaces, abstract classes can hold shared code and state.',
        'The type <code>abstract new () =&gt; T</code> describes abstract constructors.',
      ],
    },
    {
      title: 'Decorators',
      level: 'advanced',
      summary: 'Functions marked with @ that wrap or modify classes, methods and fields.',
      points: [
        'TS 5.0 supports standard (TC39 stage 3) decorators with no flag.',
        'Older "experimental" decorators need <code>experimentalDecorators</code>; Angular and NestJS still use them.',
        'The two styles have different signatures and are not compatible.',
        'Standard decorators do not support parameter decorators or <code>emitDecoratorMetadata</code>.',
        'The <code>accessor</code> keyword (TS 4.9) creates auto getters/setters, useful with decorators.',
      ],
      detail: `<pre><code>function logged(fn: Function, ctx: ClassMethodDecoratorContext) {
  return function (this: unknown, ...args: unknown[]) {
    console.log(\`call \${String(ctx.name)}\`);
    return fn.apply(this, args);
  };
}

class Api {
  @logged fetchUser() { /* ... */ }
}</code></pre>`,
      tip: 'Check which decorator style your framework expects before turning experimentalDecorators on or off.',
    },
  ],
};
