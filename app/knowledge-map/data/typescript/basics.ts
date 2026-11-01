import type { KmNode } from '../../types';

export const basics: KmNode = {
  title: 'Getting Started',
  level: 'beginner',
  summary: 'What TypeScript is, how it turns into JavaScript, and the basic types you use every day.',
  simple:
    'This is your starter kit. Learn how to add types to normal JavaScript and how the compiler checks them, and the rest builds on top.',
  points: [
    'TypeScript is JavaScript plus a type system that checks your code before it runs.',
    'The compiler (<code>tsc</code>) checks types, then removes them to output plain JavaScript.',
    'Start with annotations, inference and the basic types; objects and functions come next.',
  ],
  children: [
    {
      title: 'What is TypeScript?',
      level: 'beginner',
      summary: 'A superset of JavaScript made by Microsoft that adds static types.',
      simple:
        'TypeScript is JavaScript with a spell-checker. You still write the same language, but mistakes get underlined before your users ever see them.',
      points: [
        'Superset: every valid JavaScript file is (almost always) valid TypeScript.',
        'Static types: errors are found while you type, not when the app crashes.',
        'Types only exist at build time; the browser or Node only ever runs JavaScript.',
        'Big win: editor autocomplete, safe renames and "go to definition" just work.',
        'Used by most modern frontends (React, Angular, Vue) and Node backends.',
      ],
      tip: 'Interview one-liner: "TypeScript is JavaScript with compile-time types; the types are erased at runtime."',
    },
    {
      title: 'Install & tsc',
      level: 'beginner',
      summary: 'Install the typescript package and run tsc to type-check and compile your files.',
      simple:
        'tsc is a translator with a red pen. It reads your .ts files, marks every mistake, and writes out clean .js files.',
      points: [
        'Install per project: <code>npm i -D typescript</code>, then run <code>npx tsc</code>.',
        '<code>npx tsc --init</code> creates a starter <code>tsconfig.json</code>.',
        '<code>tsc --noEmit</code> only checks types and writes no files; common in CI.',
        'By default tsc still writes JS even when there are type errors (unless <code>noEmitOnError</code>).',
        'Use <code>tsc --watch</code> to recheck every time you save.',
      ],
      tip: 'Install TypeScript per project, not globally, so everyone on the team uses the same version.',
    },
    {
      title: 'tsconfig.json',
      level: 'beginner',
      summary: 'The project settings file: which files to check and how strict and modern the output is.',
      simple:
        'tsconfig is the settings page for the compiler. It says which folders to read and how picky to be.',
      points: [
        '<code>include</code> / <code>exclude</code> pick the files; <code>compilerOptions</code> sets the rules.',
        '<code>"strict": true</code> turns on all the important safety checks. Always use it.',
        '<code>target</code> sets which JavaScript version is written out (e.g. <code>ES2022</code>).',
        '<code>extends</code> lets you share a base config, e.g. <code>@tsconfig/node22</code>.',
        'TS 5.9 made <code>tsc --init</code> produce a much shorter, modern default config.',
      ],
      detail: `<pre><code>{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "strict": true,
    "outDir": "dist"
  },
  "include": ["src"]
}</code></pre>`,
    },
    {
      title: 'Type Annotations',
      level: 'beginner',
      summary: 'You write ": type" after a name to say what kind of value it holds.',
      simple:
        'An annotation is a label on a box: "only cups go in here". Try to put a plate in and TypeScript stops you.',
      points: [
        'Variables: <code>let age: number = 30;</code>',
        'Parameters: <code>function greet(name: string) {}</code>',
        'Return types go after the parentheses: <code>(): string</code>.',
        'Annotations are erased in the output JS; they cost nothing at runtime.',
      ],
      detail: `<pre><code>let title: string = 'Hello';
let count: number = 3;
let done: boolean = false;

function add(a: number, b: number): number {
  return a + b;
}

add(1, '2'); // Error: '2' is not a number</code></pre>`,
    },
    {
      title: 'Type Inference',
      level: 'beginner',
      summary: 'TypeScript guesses types from the values you assign, so you rarely need to write them.',
      simple:
        'If you put milk in a bottle, everyone knows it is a milk bottle. You do not need a label for the obvious.',
      points: [
        '<code>let x = 5;</code> is inferred as <code>number</code> automatically.',
        '<code>const y = 5;</code> is inferred as the literal type <code>5</code>, since it can never change.',
        'Return types are inferred from <code>return</code> statements.',
        'Annotate function parameters and public API return types; let inference do the rest.',
      ],
      tip: 'Hover over a variable in your editor to see the inferred type. It is the fastest way to learn.',
    },
    {
      title: 'Primitive Types',
      level: 'beginner',
      summary: 'The basic building blocks: string, number, boolean, bigint, symbol, null and undefined.',
      simple:
        'These are the atoms of the type world. Everything bigger is built out of them.',
      points: [
        '<code>number</code> covers ints and decimals; <code>bigint</code> is for huge whole numbers like <code>10n</code>.',
        'Use lowercase <code>string</code>, not <code>String</code> (that is the wrapper object type).',
        'With <code>strictNullChecks</code> (part of strict), <code>null</code> and <code>undefined</code> are separate types.',
        'So <code>let name: string = null</code> is an error; write <code>string | null</code> if you mean it.',
      ],
    },
    {
      title: 'Arrays & Tuples',
      level: 'beginner',
      summary: 'Arrays hold many values of one type; tuples are fixed-length arrays with a type per slot.',
      simple:
        'An array is a shopping bag of apples. A tuple is a bento box: slot 1 is rice, slot 2 is fish, always in that order.',
      points: [
        'Two ways to write arrays: <code>number[]</code> or <code>Array&lt;number&gt;</code>.',
        'Tuple: <code>[string, number]</code> means exactly a string, then a number.',
        'Labeled tuples read nicer: <code>[name: string, age: number]</code>.',
        '<code>readonly string[]</code> blocks <code>push</code> and index writes.',
        'React <code>useState</code> returns a tuple: <code>[value, setValue]</code>.',
      ],
      detail: `<pre><code>const ids: number[] = [1, 2, 3];
const point: [x: number, y: number] = [10, 20];
const [x, y] = point;

ids.push('4'); // Error: string is not number</code></pre>`,
    },
    {
      title: 'any, unknown, never, void',
      level: 'beginner',
      summary: 'Four special types: "anything goes", "anything, but check first", "impossible" and "returns nothing".',
      simple:
        'any is a stranger let in with no ID check. unknown is a stranger you must check first. never is a door that is bricked up. void means "I give you nothing back".',
      points: [
        '<code>any</code> turns off checking for that value. It spreads quietly, so avoid it.',
        '<code>unknown</code> accepts any value, but you must narrow it before using it. Safe choice.',
        '<code>void</code> is the return type of functions that return nothing useful.',
        '<code>never</code> is for things that never happen: a function that always throws, or an impossible case.',
      ],
      detail: `<pre><code>function parse(input: unknown) {
  input.trim();            // Error: input is unknown
  if (typeof input === 'string') {
    input.trim();          // OK: now it is a string
  }
}

function fail(msg: string): never {
  throw new Error(msg);
}</code></pre>`,
      tip: 'Reach for unknown instead of any whenever you do not know a type yet, e.g. JSON from an API.',
    },
    {
      title: 'Compile-Time Only',
      level: 'intermediate',
      summary: 'Types vanish after compiling, so they cannot check data that arrives while the app runs.',
      simple:
        'Types are the architect’s blueprint. Once the house is built the blueprint is gone, so it cannot stop a stranger walking in with a wrong package.',
      points: [
        'You cannot write <code>if (x instanceof MyInterface)</code>: interfaces do not exist at runtime.',
        'Data from <code>fetch</code>, forms or files is not checked by TypeScript at all.',
        'Casting JSON with <code>as User</code> only silences the compiler; it checks nothing.',
        'Validate outside data at runtime (e.g. with Zod) to be truly safe.',
      ],
      tip: 'Common mistake: trusting "res.json() as User". The compiler believes you, even if the API lies.',
    },
    {
      title: 'Types vs Values',
      level: 'intermediate',
      summary: 'TypeScript keeps two separate worlds: names for types and names for real runtime values.',
      simple:
        'Think of a shop with a catalog and a warehouse. Types live in the catalog, values live in the warehouse. Some names, like a class, appear in both.',
      points: [
        '<code>interface</code> and <code>type</code> exist only in the type world; they vanish after compiling.',
        '<code>const</code>, <code>function</code> and <code>let</code> are values that exist at runtime.',
        'A <code>class</code> or <code>enum</code> is both: a type and a real object.',
        'Use <code>typeof value</code> to get a type from a value; you cannot go the other way.',
        'Errors like "X only refers to a type, but is being used as a value" come from mixing the worlds.',
      ],
      detail: `<pre><code>interface User { name: string }
const u: User = { name: 'An' }; // User used as a type: OK
console.log(User);              // Error: User is only a type

class Point { x = 0 }
const p: Point = new Point();   // Point is a type AND a value</code></pre>`,
    },
  ],
};
