import type { KmNode } from '../../types';

export const generics: KmNode = {
  title: 'Generics',
  level: 'intermediate',
  summary: 'Types with parameters, so one function or type works for many types while staying safe.',
  simple:
    'A generic is a box with a label slot. You write "T" on the label, and whoever uses the box fills in what T is: a box of books, a box of toys.',
  points: [
    'Generics keep the link between input and output types.',
    'You already use them: <code>Array&lt;T&gt;</code>, <code>Promise&lt;T&gt;</code>, <code>Map&lt;K, V&gt;</code>.',
    'Constraints and keyof make them precise; this is where TS gets powerful.',
  ],
  children: [
    {
      title: 'Generic Functions',
      level: 'intermediate',
      summary: 'A function with a type parameter like T that is filled in each time you call it.',
      simple:
        'Like a photocopier: whatever you put in, you get the same kind of thing back. A letter in, a letter out.',
      points: [
        'Declare with angle brackets: <code>function first&lt;T&gt;(arr: T[]): T | undefined</code>.',
        'T is usually inferred from the arguments; you rarely write it.',
        'You can pass it explicitly: <code>first&lt;string&gt;([])</code>.',
        'Using <code>any</code> instead would lose the link between input and output.',
      ],
      detail: `<pre><code>function first&lt;T&gt;(items: T[]): T | undefined {
  return items[0];
}

const n = first([1, 2, 3]);    // number | undefined
const s = first(['a', 'b']);   // string | undefined</code></pre>`,
    },
    {
      title: 'Generic Types',
      level: 'intermediate',
      summary: 'Interfaces, type aliases and classes can take type parameters too.',
      simple:
        'A generic type is a form with a blank: "List of ____". Fill in the blank to get a real form.',
      points: [
        '<code>interface Box&lt;T&gt; { value: T }</code> then use <code>Box&lt;number&gt;</code>.',
        'Great for API wrappers: <code>type ApiResult&lt;T&gt; = { data: T; error?: string }</code>.',
        'Classes too: <code>class Cache&lt;K, V&gt;</code>.',
        'Several parameters are fine; name them clearly when T, U is not enough.',
      ],
    },
    {
      title: 'Constraints (extends)',
      level: 'intermediate',
      summary: 'T extends X limits which types T may be, so you can safely use X’s properties.',
      simple:
        'A ride with a height sign: "you must be at least this tall". Any kid may ride, as long as they meet the rule.',
      points: [
        '<code>&lt;T extends { length: number }&gt;</code> accepts strings, arrays, anything with length.',
        'Inside the function you may use <code>.length</code> safely.',
        'The caller still gets back the exact type they passed in.',
        'Without a constraint, T is like <code>unknown</code> inside the function.',
      ],
      detail: `<pre><code>function longest&lt;T extends { length: number }&gt;(a: T, b: T): T {
  return a.length &gt;= b.length ? a : b;
}

longest('hi', 'hello'); // string
longest([1], [1, 2]);   // number[]
longest(1, 2);          // Error: number has no length</code></pre>`,
    },
    {
      title: 'keyof & Indexed Access',
      level: 'intermediate',
      summary: 'keyof T gives the union of T’s keys; T[K] gives the type of the value at key K.',
      simple:
        'keyof is the list of drawer labels in a cabinet. T[K] is "what kind of thing is in drawer K".',
      points: [
        '<code>keyof User</code> → <code>\'id\' | \'name\'</code>.',
        '<code>User[\'name\']</code> → <code>string</code>.',
        'Combine for safe property getters: <code>&lt;T, K extends keyof T&gt;</code>.',
        '<code>T[number]</code> gives the element type of an array or tuple.',
      ],
      detail: `<pre><code>function get&lt;T, K extends keyof T&gt;(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: 'An' };
get(user, 'name');  // string
get(user, 'email'); // Error: not a key of user</code></pre>`,
    },
    {
      title: 'typeof in Types',
      level: 'intermediate',
      summary: 'Use typeof in a type position to copy the type of an existing variable or function.',
      simple:
        'Instead of drawing a new map, you trace the one you already have.',
      points: [
        '<code>type Config = typeof defaultConfig;</code> keeps one source of truth.',
        'Works with functions: <code>ReturnType&lt;typeof load&gt;</code>.',
        'Different from JavaScript <code>typeof x === \'string\'</code>, which runs at runtime.',
      ],
    },
    {
      title: 'Default Type Parameters',
      level: 'advanced',
      summary: 'Give a type parameter a fallback with = so callers can skip it.',
      points: [
        '<code>interface Res&lt;T = unknown&gt; { data: T }</code> lets you write just <code>Res</code>.',
        'Defaults can reference earlier parameters: <code>&lt;T, U = T[]&gt;</code>.',
        'Defaults must come after required parameters.',
        'Inference still wins when TS can infer T from arguments.',
      ],
    },
    {
      title: 'const Type Parameters',
      level: 'advanced',
      summary: 'Mark a type parameter const (TS 5.0) to infer literal types as if the caller wrote as const.',
      points: [
        'Without it, <code>names([\'a\', \'b\'])</code> infers <code>string[]</code>.',
        'With <code>&lt;const T&gt;</code> it infers <code>readonly [\'a\', \'b\']</code>.',
        'Callers no longer have to remember <code>as const</code>.',
        'Works best when the parameter type is <code>readonly</code>.',
      ],
      detail: `<pre><code>function routes&lt;const T extends readonly string[]&gt;(paths: T) {
  return paths;
}

const r = routes(['/home', '/about']);
// readonly ['/home', '/about']</code></pre>`,
    },
    {
      title: 'NoInfer',
      level: 'advanced',
      summary: 'NoInfer<T> (TS 5.4) stops one parameter from being used to guess T.',
      points: [
        'Problem: TS may widen T using an argument that should only be checked.',
        'Wrap that parameter in <code>NoInfer&lt;T&gt;</code> so T comes from the other arguments.',
        'Classic case: a default value that must be one of the given options.',
      ],
      detail: `<pre><code>function pick&lt;T extends string&gt;(opts: T[], initial: NoInfer&lt;T&gt;) {}

pick(['red', 'blue'], 'red');   // OK
pick(['red', 'blue'], 'green'); // Error, instead of widening T</code></pre>`,
    },
  ],
};
