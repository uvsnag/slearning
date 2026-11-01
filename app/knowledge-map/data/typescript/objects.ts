import type { KmNode } from '../../types';

export const objectTypes: KmNode = {
  title: 'Object Types',
  level: 'beginner',
  summary: 'How you describe the shape of objects: interfaces, type aliases, optional and readonly fields, enums.',
  simple:
    'An object type is a form template. It lists which boxes must be filled in, which are optional, and what goes in each.',
  points: [
    'Most of your types will describe objects: users, orders, API responses.',
    'TypeScript compares objects by shape, not by name (structural typing).',
    'Interfaces and type aliases both describe shapes; each has a few strengths.',
  ],
  children: [
    {
      title: 'Object Shapes',
      level: 'beginner',
      summary: 'Write the fields and their types inside curly braces to describe an object.',
      simple:
        'Like a checklist on a parcel: it must contain one name (text) and one age (number).',
      points: [
        'Inline: <code>let user: { name: string; age: number }</code>.',
        'Missing a required field is an error; so is a wrong field type.',
        'Nested objects are fine: a field can itself be an object type.',
        'Methods can be written as <code>greet(): void</code> inside the shape.',
      ],
    },
    {
      title: 'Interfaces',
      level: 'beginner',
      summary: 'A named description of an object shape that you can reuse and extend.',
      simple:
        'An interface is a job description. Any object that has all the listed skills fits the job, no matter where it came from.',
      points: [
        'Declare once, use everywhere: <code>interface User { id: number; name: string }</code>.',
        'Extend another interface with <code>extends</code>, even several at once.',
        'Two interfaces with the same name merge into one (declaration merging).',
        'Classes can promise to follow one with <code>implements</code>.',
      ],
      detail: `<pre><code>interface Animal {
  name: string;
}
interface Dog extends Animal {
  bark(): void;
}

const rex: Dog = { name: 'Rex', bark() { console.log('Woof'); } };</code></pre>`,
    },
    {
      title: 'Type Aliases',
      level: 'beginner',
      summary: 'The type keyword gives a name to any type, not just objects.',
      simple:
        'A type alias is a nickname. Instead of saying the whole long description every time, you just say the nickname.',
      points: [
        'Objects: <code>type Point = { x: number; y: number }</code>.',
        'Also unions, tuples, functions: <code>type Id = string | number</code>.',
        'Combine shapes with <code>&amp;</code> (intersection) instead of <code>extends</code>.',
        'An alias cannot be re-opened or merged later.',
      ],
    },
    {
      title: 'Optional & Readonly',
      level: 'beginner',
      summary: 'A ? marks a field you may leave out; readonly marks a field you cannot reassign.',
      simple:
        'Optional is the "middle name" box on a form: fill it if you have one. Readonly is a field printed in ink: you can read it, not change it.',
      points: [
        '<code>email?: string</code> means the field may be missing (its type includes <code>undefined</code>).',
        '<code>readonly id: number</code> blocks <code>user.id = 2</code>.',
        'Readonly is shallow: nested objects can still change inside.',
        'Readonly is compile-time only; use <code>Object.freeze</code> for runtime protection.',
      ],
      detail: `<pre><code>interface User {
  readonly id: number;
  name: string;
  email?: string;
}

const u: User = { id: 1, name: 'An' }; // OK, no email
u.id = 2; // Error: id is read-only</code></pre>`,
    },
    {
      title: 'Interface vs Type',
      level: 'intermediate',
      summary: 'Both describe objects; interfaces can merge and extend nicely, types can express unions and more.',
      simple:
        'An interface is a form that others can add pages to. A type alias is a printed sticker: flexible in what it says, but fixed once printed.',
      points: [
        'Only <code>type</code> can name unions, tuples, mapped and conditional types.',
        'Only <code>interface</code> supports declaration merging (handy for extending libraries).',
        '<code>extends</code> on interfaces gives clearer errors than <code>&amp;</code> on types for conflicting fields.',
        'For plain object shapes, either works. Pick one style and stay consistent.',
      ],
      tip: 'Common rule of thumb: interface for object shapes and public APIs, type for everything else.',
    },
    {
      title: 'object, {} and Object',
      level: 'intermediate',
      summary: 'Three look-alike types: object means "not a primitive", while {} means "anything except null and undefined".',
      simple:
        'object is "any box". {} is "anything that is not empty air", so even the number 5 fits. Object (capital O) is an old twin of {} you can ignore.',
      points: [
        '<code>object</code>: any non-primitive, like objects, arrays and functions.',
        '<code>{}</code>: any value except <code>null</code> and <code>undefined</code>; strings and numbers fit too.',
        '<code>Object</code> behaves almost like <code>{}</code>; do not use it as a type.',
        'For "some unknown object", prefer <code>Record&lt;string, unknown&gt;</code> or <code>unknown</code> plus a check.',
      ],
      detail: `<pre><code>let a: object = [1, 2];  // OK
let b: object = 42;      // Error: number is a primitive
let c: {} = 42;          // OK (surprise!)
let d: {} = null;        // Error under strict</code></pre>`,
      tip: 'Interview trap: "{}" does not mean "empty object". Use Record<string, never> for that.',
    },
    {
      title: 'Index Signatures & Record',
      level: 'intermediate',
      summary: 'Describe objects used as dictionaries, where you do not know the keys in advance.',
      simple:
        'Like a phone book: you do not know every name in it, but you know each name maps to a phone number.',
      points: [
        'Index signature: <code>{ [key: string]: number }</code>.',
        'Shorter with a utility type: <code>Record&lt;string, number&gt;</code>.',
        'Known keys: <code>Record&lt;\'a\' | \'b\', number&gt;</code> requires exactly those keys.',
        'Reading a missing key gives <code>undefined</code> at runtime, but the type says <code>number</code>.',
        'Use <code>Map</code> when keys are added and removed a lot.',
      ],
      tip: 'Turn on noUncheckedIndexedAccess so dictionary reads are typed as "value or undefined".',
    },
    {
      title: 'Object.keys Gotcha',
      level: 'intermediate',
      summary: 'Object.keys returns string[], not (keyof T)[], because objects may carry extra keys.',
      simple:
        'Your type is the packing list, but structural typing lets someone slip extra items into the box. So when you list what is inside, TypeScript only promises "some strings".',
      points: [
        '<code>Object.keys(user)</code> is <code>string[]</code>, so <code>user[key]</code> may be an error.',
        'The reason: a value with extra fields still fits the type (structural typing).',
        'Use <code>Object.entries</code> when you need values too.',
        'If you are sure there are no extra keys, cast: <code>Object.keys(o) as (keyof T)[]</code>.',
      ],
      detail: `<pre><code>const user = { id: 1, name: 'An' };

for (const key of Object.keys(user)) {
  user[key];   // Error: string can't index { id; name }
}
for (const [key, value] of Object.entries(user)) {
  console.log(key, value); // OK
}</code></pre>`,
    },
    {
      title: 'Literal Types & Enums',
      level: 'intermediate',
      summary: 'Limit a value to a few exact options, either with string literal unions or with enums.',
      simple:
        'Like a traffic light: it can only be red, yellow or green. Any other color is a mistake.',
      points: [
        'Literal union: <code>type Light = \'red\' | \'yellow\' | \'green\'</code>. No runtime code.',
        '<code>enum Color { Red, Green }</code> creates a real JavaScript object at runtime.',
        'Numeric enums auto-number from 0; string enums need explicit values.',
        '<code>const enum</code> is inlined but breaks with <code>isolatedModules</code> tools.',
        'Enums are not erasable syntax, so Node type stripping and <code>erasableSyntaxOnly</code> reject them.',
      ],
      detail: `<pre><code>type Status = 'draft' | 'published';

// Alternative that works like an enum but is plain JS:
const Role = { Admin: 'admin', User: 'user' } as const;
type Role = (typeof Role)[keyof typeof Role]; // 'admin' | 'user'</code></pre>`,
      tip: 'Many teams prefer literal unions or "as const" objects over enums. They are simpler and erase cleanly.',
    },
    {
      title: 'Structural Typing',
      level: 'intermediate',
      summary: 'Types match by their shape, not their name. If it has the right fields, it fits.',
      simple:
        'Duck typing, checked by the compiler: if it walks like a duck and quacks like a duck, TypeScript accepts it as a duck.',
      points: [
        'Two different interfaces with the same fields are interchangeable.',
        'An object with extra fields still fits a smaller type when passed as a variable.',
        'Fresh object literals get an excess property check: extra fields are an error there.',
        'Java and C# are nominal (match by name); TypeScript is structural.',
      ],
      detail: `<pre><code>interface Point { x: number; y: number }
const p3 = { x: 1, y: 2, z: 3 };

const a: Point = p3;                   // OK: shape fits
const b: Point = { x: 1, y: 2, z: 3 }; // Error: z is extra</code></pre>`,
      tip: 'Need two same-shaped types to stay apart (UserId vs OrderId)? Use branded types.',
    },
  ],
};
