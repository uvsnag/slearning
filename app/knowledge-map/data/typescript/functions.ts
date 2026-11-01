import type { KmNode } from '../../types';

export const functions: KmNode = {
  title: 'Functions',
  level: 'beginner',
  summary: 'How to type parameters, return values, callbacks and functions with several call styles.',
  simple:
    'A typed function is a vending machine with clear labels: what coins it takes and what snack comes out.',
  points: [
    'Always type parameters; return types are usually inferred.',
    'Function types describe callbacks and handlers.',
    'Overloads and the this parameter cover the tricky cases.',
  ],
  children: [
    {
      title: 'Parameters & Returns',
      level: 'beginner',
      summary: 'Annotate each parameter, and optionally the return type after the parentheses.',
      simple:
        'Like a recipe card: "needs 2 eggs and 1 cup of flour, makes 1 cake". Hand it rice and it refuses.',
      points: [
        'Parameters without a type become <code>any</code> (an error under <code>strict</code>).',
        'Return type is inferred, but writing it on exported functions catches mistakes early.',
        'Arrow functions work the same: <code>const sq = (n: number): number =&gt; n * n;</code>',
        'Calling with too many or too few arguments is an error.',
      ],
    },
    {
      title: 'Optional, Default & Rest',
      level: 'beginner',
      summary: 'Parameters can be optional (?), have a default value, or collect the rest into an array.',
      simple:
        'Ordering coffee: size is optional (default medium), and you can add any number of extras at the end.',
      points: [
        'Optional: <code>greet(name?: string)</code>; inside, <code>name</code> may be <code>undefined</code>.',
        'Default: <code>greet(name = \'friend\')</code>; the type is inferred from the default.',
        'Rest: <code>sum(...nums: number[])</code> collects any number of arguments.',
        'Optional parameters must come after required ones.',
      ],
      detail: `<pre><code>function order(drink: string, size = 'M', ...extras: string[]) {
  return \`\${size} \${drink} + \${extras.join(', ')}\`;
}

order('latte');                    // OK
order('latte', 'L', 'oat', 'ice'); // OK</code></pre>`,
    },
    {
      title: 'Function Types',
      level: 'beginner',
      summary: 'Describe a function as a type, so you can type callbacks and variables holding functions.',
      simple:
        'It is a job ad for a function: "wanted, someone who takes a number and gives back a string".',
      points: [
        'Arrow syntax: <code>type Fmt = (n: number) =&gt; string</code>.',
        'Parameter names in the type are just labels; they do not have to match.',
        'Passing a function with fewer parameters is allowed (extra arguments are ignored).',
        'Inline callbacks get their parameter types from context (contextual typing).',
      ],
      detail: `<pre><code>type Handler = (event: string, data: unknown) =&gt; void;

const log: Handler = (event) =&gt; console.log(event); // OK: fewer params

[1, 2, 3].map((n) =&gt; n * 2); // n is inferred as number</code></pre>`,
    },
    {
      title: 'void vs undefined',
      level: 'intermediate',
      summary: 'void means "ignore the return value"; undefined means it really returns undefined.',
      simple:
        'void is "I will not look at what you give back". undefined is "you must give back exactly nothing".',
      points: [
        'A function type returning <code>void</code> still accepts functions that return something.',
        'That is why <code>arr.forEach(x =&gt; list.push(x))</code> works even though push returns a number.',
        'A function declaration typed <code>: void</code> must not return a value itself.',
        'Use <code>undefined</code> only when callers truly rely on getting undefined.',
      ],
    },
    {
      title: 'Overloads',
      level: 'intermediate',
      summary: 'Several call signatures for one function, so the return type can depend on the arguments.',
      simple:
        'Like a shop counter with two menus: hand over a string, you get one thing back; hand over a number, you get another.',
      points: [
        'Write the overload signatures first, then one implementation signature.',
        'Callers only see the overloads, not the implementation signature.',
        'The implementation must handle every overload by itself.',
        'Often a union parameter or a generic is simpler than overloads.',
      ],
      detail: `<pre><code>function parse(v: string): number;
function parse(v: number): string;
function parse(v: string | number) {
  return typeof v === 'string' ? Number(v) : String(v);
}

const n = parse('42'); // number</code></pre>`,
    },
    {
      title: 'The this Parameter',
      level: 'advanced',
      summary: 'A fake first parameter that tells TypeScript what this must be inside a function.',
      points: [
        'Write it first: <code>function onClick(this: HTMLButtonElement) {}</code>.',
        'It is erased in the output JS; callers do not pass it.',
        'Calling the function with the wrong <code>this</code> is a compile error.',
        '<code>noImplicitThis</code> (in strict) flags <code>this</code> that would be <code>any</code>.',
        'Arrow functions capture <code>this</code> from outside and cannot declare it.',
      ],
    },
    {
      title: 'Constructor Types',
      level: 'advanced',
      summary: 'Describe "something you can call with new", so you can pass classes around as values.',
      points: [
        'Construct signature: <code>new (...args: any[]) =&gt; T</code> means "a class that builds a T".',
        'Use it for factories, plugin registries and dependency injection containers.',
        '<code>InstanceType&lt;typeof MyClass&gt;</code> gets the instance type from a class value.',
        'A type can have both call and construct signatures, like <code>Date</code> does.',
      ],
      detail: `<pre><code>type Ctor&lt;T&gt; = new (...args: any[]) =&gt; T;

function create&lt;T&gt;(Kind: Ctor&lt;T&gt;): T {
  return new Kind();
}

class Logger { log(m: string) { console.log(m); } }
create(Logger).log('hi'); // Logger</code></pre>`,
    },
    {
      title: 'Assertion Functions',
      level: 'advanced',
      summary: 'Functions that throw when a check fails, telling TypeScript the value is safe afterwards.',
      points: [
        'Signature: <code>function assert(v: unknown): asserts v</code> (TS 3.7+).',
        'Typed form: <code>asserts v is string</code> narrows the value after the call.',
        'They must be called through a name with an explicit type annotation.',
        'Great for invariant checks: "this should never be null here".',
      ],
      detail: `<pre><code>function assertIsDefined&lt;T&gt;(v: T): asserts v is NonNullable&lt;T&gt; {
  if (v == null) throw new Error('Value is missing');
}

const el = document.getElementById('app');
assertIsDefined(el);
el.innerHTML = 'Ready'; // el is HTMLElement now</code></pre>`,
    },
  ],
};
