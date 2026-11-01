import type { KmNode } from '../../types';

export const utilityTypes: KmNode = {
  title: 'Utility Types',
  level: 'intermediate',
  summary: 'Built-in generic helpers that transform existing types, so you do not repeat yourself.',
  simple:
    'Utility types are kitchen tools for types: a peeler, a slicer, a blender. Feed in a type, get a reshaped type out.',
  points: [
    'They ship with TypeScript; no import needed.',
    'Derive new types from one source type instead of copying fields.',
    'Under the hood they are built from mapped and conditional types (next branch).',
  ],
  children: [
    {
      title: 'Partial, Required, Readonly',
      level: 'intermediate',
      summary: 'Make every field optional, every field required, or every field read-only.',
      simple:
        'Same form, three stamps: "fill what you like", "fill everything", "look but do not touch".',
      points: [
        '<code>Partial&lt;User&gt;</code> is perfect for update payloads.',
        '<code>Required&lt;T&gt;</code> removes every <code>?</code>.',
        '<code>Readonly&lt;T&gt;</code> adds <code>readonly</code> to every field (shallow).',
      ],
      detail: `<pre><code>function update(id: number, changes: Partial&lt;User&gt;) { /* ... */ }

update(1, { name: 'Binh' }); // only the fields you change</code></pre>`,
    },
    {
      title: 'Pick, Omit, Record',
      level: 'intermediate',
      summary: 'Keep some keys, drop some keys, or build an object type from keys and a value type.',
      simple:
        'Pick is choosing toppings you want, Omit is "everything except onions", Record is a blank grid you label yourself.',
      points: [
        '<code>Pick&lt;User, \'id\' | \'name\'&gt;</code> keeps only those keys.',
        '<code>Omit&lt;User, \'password\'&gt;</code> drops a key.',
        '<code>Record&lt;Status, string&gt;</code> requires one entry per status.',
        'Omit does not check that the key exists; typos pass silently.',
      ],
    },
    {
      title: 'Union Helpers',
      level: 'intermediate',
      summary: 'Exclude, Extract and NonNullable filter members out of a union.',
      simple:
        'Like sorting a fruit bowl: take out the bananas, keep only citrus, or throw away the empty peels.',
      points: [
        '<code>Exclude&lt;\'a\' | \'b\' | \'c\', \'a\'&gt;</code> → <code>\'b\' | \'c\'</code>.',
        '<code>Extract&lt;T, U&gt;</code> keeps only members assignable to U.',
        '<code>NonNullable&lt;T&gt;</code> removes <code>null</code> and <code>undefined</code>.',
      ],
    },
    {
      title: 'Function Helpers',
      level: 'intermediate',
      summary: 'ReturnType, Parameters and Awaited pull types out of functions and promises.',
      simple:
        'Like reading the label on a machine to learn what it takes in and what it spits out, without opening it.',
      points: [
        '<code>ReturnType&lt;typeof fn&gt;</code> gives the return type.',
        '<code>Parameters&lt;typeof fn&gt;</code> gives the parameters as a tuple.',
        '<code>Awaited&lt;T&gt;</code> (TS 4.5) unwraps promises, even nested ones.',
        'Also: <code>InstanceType</code>, <code>ConstructorParameters</code>.',
      ],
      detail: `<pre><code>async function loadUser() { return { id: 1, name: 'An' }; }

type User = Awaited&lt;ReturnType&lt;typeof loadUser&gt;&gt;;
// { id: number; name: string }</code></pre>`,
      tip: 'Deriving types from functions keeps them in sync: change the function and every derived type follows.',
    },
  ],
};

export const typeLevel: KmNode = {
  title: 'Type-Level Programming',
  level: 'advanced',
  summary: 'Write logic with types themselves: loops over keys, if/else on types, and string patterns.',
  simple:
    'Here types become a tiny programming language. Instead of computing values, you compute new types from old ones.',
  points: [
    'Mapped types loop over keys; conditional types branch on types.',
    'infer extracts parts of a type; template literal types build string types.',
    'Powerful but easy to overdo. Keep public types readable.',
  ],
  children: [
    {
      title: 'Mapped Types',
      level: 'advanced',
      summary: 'Build a new object type by looping over the keys of another one.',
      points: [
        'Syntax: <code>{ [K in keyof T]: ... }</code>, a for-loop over keys.',
        'Add or remove modifiers: <code>-readonly</code>, <code>-?</code>, <code>+?</code>.',
        'This is exactly how <code>Partial</code> and <code>Readonly</code> are written.',
        'Mapped types over arrays and tuples keep them as arrays and tuples.',
      ],
      detail: `<pre><code>type Nullable&lt;T&gt; = { [K in keyof T]: T[K] | null };
type Mutable&lt;T&gt; = { -readonly [K in keyof T]: T[K] };

type Flags = { [K in 'dark' | 'beta']: boolean };
// { dark: boolean; beta: boolean }</code></pre>`,
    },
    {
      title: 'Key Remapping',
      level: 'advanced',
      summary: 'Rename or filter keys while mapping, using an as clause (TS 4.1+).',
      points: [
        '<code>[K in keyof T as NewKey]</code> changes the key name.',
        'Map a key to <code>never</code> to drop it.',
        'Combine with template literal types to make getters and event names.',
      ],
      detail: `<pre><code>type Getters&lt;T&gt; = {
  [K in keyof T as \`get\${Capitalize&lt;string &amp; K&gt;}\`]: () =&gt; T[K];
};

type G = Getters&lt;{ name: string }&gt;; // { getName: () =&gt; string }</code></pre>`,
    },
    {
      title: 'Conditional Types',
      level: 'advanced',
      summary: 'T extends U ? X : Y picks one type or another depending on T.',
      points: [
        'It is a ternary operator for types.',
        'Distributive: on a naked union T, it runs once per member and joins the results.',
        'Wrap in brackets <code>[T] extends [U]</code> to stop distribution.',
        'This is how <code>Exclude</code> and <code>NonNullable</code> work.',
      ],
      detail: `<pre><code>type IsString&lt;T&gt; = T extends string ? 'yes' : 'no';

type A = IsString&lt;'hi'&gt;;          // 'yes'
type B = IsString&lt;string | 1&gt;;    // 'yes' | 'no' (distributed)
type MyExclude&lt;T, U&gt; = T extends U ? never : T;</code></pre>`,
    },
    {
      title: 'infer',
      level: 'advanced',
      summary: 'Inside a conditional type, infer captures part of a type into a new type variable.',
      points: [
        'Pattern matching for types: "if T looks like Promise of X, give me X".',
        'Only allowed in the <code>extends</code> clause of a conditional type.',
        'TS 4.7 added <code>infer X extends string</code> to constrain the capture.',
        '<code>ReturnType</code> and <code>Parameters</code> are built with it.',
      ],
      detail: `<pre><code>type MyReturn&lt;F&gt; = F extends (...args: any[]) =&gt; infer R ? R : never;
type ElementOf&lt;T&gt; = T extends (infer E)[] ? E : never;

type X = ElementOf&lt;string[]&gt;; // string</code></pre>`,
    },
    {
      title: 'Template Literal Types',
      level: 'advanced',
      summary: 'Build string literal types with backtick syntax, like template strings for types (TS 4.1+).',
      points: [
        '<code>`on${Capitalize&lt;E&gt;}`</code> turns <code>\'click\'</code> into <code>\'onClick\'</code>.',
        'Unions multiply: two options times three options gives six strings.',
        'Built-ins: <code>Uppercase</code>, <code>Lowercase</code>, <code>Capitalize</code>, <code>Uncapitalize</code>.',
        'Combine with <code>infer</code> to parse strings, e.g. route params.',
      ],
      detail: `<pre><code>type Size = 'sm' | 'lg';
type Color = 'red' | 'blue';
type ClassName = \`\${Size}-\${Color}\`; // 'sm-red' | 'sm-blue' | ...

type Param&lt;S&gt; = S extends \`:\${infer P}\` ? P : never;
type P = Param&lt;':userId'&gt;; // 'userId'</code></pre>`,
    },
    {
      title: 'Variadic Tuple Types',
      level: 'advanced',
      summary: 'Spread tuples inside tuple types (TS 4.0) to type functions that add, remove or join arguments.',
      points: [
        '<code>[...A, ...B]</code> joins two tuple types, just like spreading arrays.',
        'Lets you type helpers such as <code>concat</code>, <code>partial</code> or middleware that adds an argument.',
        'Combine with <code>infer</code> to grab the first or last element: <code>[infer Head, ...infer Tail]</code>.',
        '<code>Parameters&lt;F&gt;</code> plus spread types functions that wrap other functions.',
      ],
      detail: `<pre><code>type Concat&lt;A extends unknown[], B extends unknown[]&gt; = [...A, ...B];
type AB = Concat&lt;[1, 2], ['x']&gt;; // [1, 2, 'x']

type Tail&lt;T extends unknown[]&gt; = T extends [unknown, ...infer R] ? R : [];
type T1 = Tail&lt;[string, number, boolean]&gt;; // [number, boolean]</code></pre>`,
    },
    {
      title: 'Recursive Types',
      level: 'expert',
      summary: 'Types that refer to themselves, for trees, JSON and deep transformations.',
      points: [
        'JSON: <code>type Json = string | number | boolean | null | Json[] | { [k: string]: Json }</code>.',
        'Deep helpers like <code>DeepPartial&lt;T&gt;</code> recurse through nested objects.',
        'Recursion depth is limited; very deep types hit "excessively deep" errors.',
        'Tail-recursive conditional types (TS 4.5) allow about 1000 levels.',
      ],
      detail: `<pre><code>type DeepReadonly&lt;T&gt; = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly&lt;T[K]&gt; : T[K];
};</code></pre>`,
      tip: 'If a type takes seconds to check or nobody can read it, simplify. Type magic has a real cost.',
    },
  ],
};
