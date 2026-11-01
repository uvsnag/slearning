import type { KmNode } from '../../types';

export const narrowing: KmNode = {
  title: 'Unions & Narrowing',
  level: 'beginner',
  summary: 'Values that can be one of several types, and how TypeScript figures out which one you have.',
  simple:
    'A union is a mystery box that holds either a cat or a dog. Narrowing is peeking inside, so afterwards you know which pet you are dealing with.',
  points: [
    'Unions (<code>A | B</code>) are everywhere: "string or null", "success or error".',
    'TypeScript follows your if/switch checks and narrows the type in each branch.',
    'Master this branch and most everyday type errors disappear.',
  ],
  children: [
    {
      title: 'Union Types',
      level: 'beginner',
      summary: 'A | B means the value is either an A or a B.',
      simple:
        'A union is "cash or card" at a shop. Both work, but you must know which one you hold before you pay.',
      points: [
        '<code>let id: string | number;</code> accepts both.',
        'You can only use what all members share until you narrow.',
        'Optional values are just unions: <code>string | undefined</code>.',
        'Literal unions make great "one of these options" types.',
      ],
      detail: `<pre><code>function show(id: string | number) {
  id.toUpperCase(); // Error: number has no toUpperCase
  if (typeof id === 'string') {
    id.toUpperCase(); // OK
  }
}</code></pre>`,
    },
    {
      title: 'Intersection Types',
      level: 'beginner',
      summary: 'A & B means the value is both an A and a B at the same time.',
      simple:
        'An intersection is a person who is both a driver and a cook: they must have both a license and a recipe book.',
      points: [
        '<code>type Admin = User &amp; { permissions: string[] }</code> combines shapes.',
        'Conflicting fields like <code>string &amp; number</code> collapse to <code>never</code>.',
        'Good for mixing in extra fields; for deep hierarchies <code>extends</code> is clearer.',
      ],
    },
    {
      title: 'typeof & Truthiness',
      level: 'beginner',
      summary: 'Checking typeof or simply "if (value)" narrows a union inside that block.',
      simple:
        'Like a bouncer asking "are you on the list?" Once you are past the door, everyone inside knows you are on the list.',
      points: [
        '<code>typeof x === \'string\'</code> narrows to string; works for all primitives and functions.',
        'Careful: <code>typeof null === \'object\'</code> in JavaScript.',
        '<code>if (name)</code> removes <code>null</code> and <code>undefined</code>, but also <code>\'\'</code> and <code>0</code>.',
        'Equality checks narrow too: <code>x === null</code>, <code>x !== undefined</code>.',
      ],
      tip: 'A truthiness check on numbers or strings drops 0 and "". Use "x != null" when those are valid values.',
    },
    {
      title: 'in & instanceof',
      level: 'intermediate',
      summary: 'Check whether an object has a property (in) or was built by a class (instanceof).',
      simple:
        'in is asking "do you have wings?" to tell a bird from a fish. instanceof is checking the birth certificate.',
      points: [
        '<code>\'swim\' in pet</code> narrows to members of the union that have <code>swim</code>.',
        '<code>err instanceof TypeError</code> narrows to that class.',
        'instanceof only works with classes, never with interfaces or type aliases.',
        'Since TS 4.9, <code>in</code> also narrows objects that do not list the key yet.',
      ],
    },
    {
      title: 'Discriminated Unions',
      level: 'intermediate',
      summary: 'A union of objects that all share one literal field, like kind, used to tell them apart.',
      simple:
        'Every parcel has a colored sticker: red means fragile, blue means food. Read the sticker and you know exactly what is inside.',
      points: [
        'Each member has the same field with a different literal: <code>kind: \'circle\'</code>.',
        'A <code>switch</code> on that field narrows to the exact member.',
        'Perfect for API results, Redux actions and state machines.',
        'Also called tagged unions.',
      ],
      detail: `<pre><code>type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; size: number };

function area(s: Shape) {
  switch (s.kind) {
    case 'circle': return Math.PI * s.radius ** 2;
    case 'square': return s.size ** 2;
  }
}</code></pre>`,
      tip: 'This is the most useful pattern in TypeScript. Model "one of several states" this way instead of many optional fields.',
    },
    {
      title: 'Exhaustiveness Checks',
      level: 'intermediate',
      summary: 'Use never to make the compiler complain when you forget to handle a union case.',
      simple:
        'Like a checklist that will not let you sign off until every box is ticked.',
      points: [
        'After all cases are handled, the remaining type is <code>never</code>.',
        'Assign it to a <code>never</code> variable; a new unhandled case becomes an error.',
        'Add a new shape later and the compiler shows every switch you must update.',
      ],
      detail: `<pre><code>function area(s: Shape): number {
  switch (s.kind) {
    case 'circle': return Math.PI * s.radius ** 2;
    case 'square': return s.size ** 2;
    default: {
      const missed: never = s; // Error if a case is missing
      throw new Error(\`Unknown shape: \${missed}\`);
    }
  }
}</code></pre>`,
    },
    {
      title: 'Type Predicates',
      level: 'intermediate',
      summary: 'A function returning "x is Type" acts as a custom check that narrows the type.',
      simple:
        'You write your own bouncer. When it says "yes", TypeScript trusts that the guest is who they claim to be.',
      points: [
        'Signature: <code>function isFish(p: Pet): p is Fish</code>.',
        'Useful with <code>filter</code>: <code>list.filter(isDefined)</code> removes undefined.',
        'TypeScript trusts your logic; a wrong check gives wrong types.',
        'Since TS 5.5, simple checks like <code>x =&gt; x !== undefined</code> infer the predicate for you.',
      ],
      detail: `<pre><code>function isString(v: unknown): v is string {
  return typeof v === 'string';
}

const mixed = ['a', 1, 'b'];
const words = mixed.filter(isString); // string[]</code></pre>`,
    },
    {
      title: 'Type Assertions (as)',
      level: 'intermediate',
      summary: 'value as Type tells the compiler "trust me, I know the type better than you".',
      simple:
        'It is signing a waiver. The compiler stops arguing, but if you were wrong, the crash is on you.',
      points: [
        'Example: <code>document.getElementById(\'c\') as HTMLCanvasElement</code>.',
        'No runtime check happens; it only changes what the compiler believes.',
        'Non-null assertion <code>x!</code> removes <code>null | undefined</code> from the type.',
        'Unrelated types need a double cast <code>as unknown as T</code>: a strong code smell.',
      ],
      tip: 'Prefer narrowing or satisfies over "as". Every "as" is a spot where bugs can hide.',
    },
    {
      title: 'satisfies',
      level: 'intermediate',
      summary: 'Check that a value matches a type without losing its more exact inferred type (TS 4.9+).',
      simple:
        'Like a tailor checking your suit fits the dress code, but letting you keep your own exact cut.',
      points: [
        '<code>: Type</code> widens the value to that type; you lose the detail.',
        '<code>satisfies Type</code> checks it, but keeps the precise inferred type.',
        'Great for config objects and lookup tables.',
        'Combine with <code>as const</code> to keep literal values and still validate them.',
      ],
      detail: `<pre><code>type Colors = Record&lt;string, string | [number, number, number]&gt;;

const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
} satisfies Colors;

palette.green.toUpperCase(); // OK: still known as string</code></pre>`,
    },
    {
      title: 'as const',
      level: 'intermediate',
      summary: 'Makes TypeScript infer the narrowest, read-only type for a literal value.',
      simple:
        'It is laminating a card: the exact words are frozen and nobody can edit them later.',
      points: [
        '<code>[\'a\', \'b\'] as const</code> becomes <code>readonly [\'a\', \'b\']</code>, not <code>string[]</code>.',
        'Object fields become <code>readonly</code> with literal types.',
        'Pair with <code>typeof</code> to derive a union from a list of values.',
        'It is compile-time only: nothing is frozen at runtime.',
      ],
      detail: `<pre><code>const SIZES = ['S', 'M', 'L'] as const;
type Size = (typeof SIZES)[number]; // 'S' | 'M' | 'L'</code></pre>`,
    },
    {
      title: 'Control Flow Analysis',
      level: 'advanced',
      summary: 'How the checker tracks a variable’s type through ifs, returns, loops and assignments.',
      points: [
        'Early <code>return</code> or <code>throw</code> narrows the type for the rest of the function.',
        'Assigning a new value resets the narrowed type.',
        'Narrowing is lost inside callbacks for <code>let</code> variables (they might change later).',
        'TS 5.4 keeps narrowing in closures created after the last assignment.',
        'Destructured discriminated unions narrow together since TS 4.6.',
      ],
    },
  ],
};
