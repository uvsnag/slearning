import type { KmNode } from '../../types';

export const patterns: KmNode = {
  title: 'Real-World Patterns',
  level: 'intermediate',
  summary: 'Everyday techniques for async code, errors, outside data, safe IDs and migrating from JavaScript.',
  simple:
    'This is the toolbox you reach for on real projects, where data is messy and code is old.',
  points: [
    'Types are only as good as the data that flows in; validate edges.',
    'Model states and errors in types, not just in comments.',
    'Adopt TypeScript step by step; you do not need a big rewrite.',
  ],
  children: [
    {
      title: 'Async & Promises',
      level: 'beginner',
      summary: 'Async functions return Promise<T>; await unwraps it back to T.',
      simple:
        'A promise is a restaurant buzzer. The type on the buzzer says what dish you will get once it rings.',
      points: [
        'An <code>async</code> function returning <code>User</code> has type <code>Promise&lt;User&gt;</code>.',
        '<code>await</code> gives you the <code>User</code>.',
        '<code>Promise.all</code> keeps each element’s type in a tuple.',
        'A forgotten <code>await</code> gives a Promise where you expected data; the linter catches it.',
      ],
      detail: `<pre><code>async function getUser(id: number): Promise&lt;User&gt; {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json(); // any! validate it in real code
}

const [user, posts] = await Promise.all([getUser(1), getPosts(1)]);</code></pre>`,
    },
    {
      title: 'Typing the DOM & Events',
      level: 'intermediate',
      summary: 'Built-in DOM types like HTMLInputElement and MouseEvent describe the page and its events.',
      simple:
        'The DOM types are name tags on every page element. Once TypeScript knows a thing is an input box, it knows it has a value you can read.',
      points: [
        'Turn them on with <code>"DOM"</code> in <code>lib</code> (included by default for browser targets).',
        '<code>querySelector</code> returns <code>Element | null</code>; pass a generic or check before use.',
        'Tag names are typed for you: <code>querySelector("input")</code> gives <code>HTMLInputElement | null</code>.',
        'Events have their own types: <code>MouseEvent</code>, <code>KeyboardEvent</code>, <code>SubmitEvent</code>.',
        '<code>event.target</code> is just <code>EventTarget</code>; use <code>currentTarget</code> or <code>instanceof</code> to narrow it.',
      ],
      detail: `<pre><code>const input = document.querySelector&lt;HTMLInputElement&gt;('#email');

input?.addEventListener('keydown', (e) =&gt; {
  // e is KeyboardEvent, inferred from the event name
  if (e.key === 'Enter') console.log(input.value);
});</code></pre>`,
    },
    {
      title: 'Typing Errors',
      level: 'intermediate',
      summary: 'Caught errors are unknown by default, so check them before using them.',
      simple:
        'Anything can be thrown in JavaScript, not just errors. So when you catch something, check what it is before you touch it.',
      points: [
        'Under <code>strict</code>, <code>catch (e)</code> gives <code>e: unknown</code> (TS 4.4+).',
        'Narrow with <code>e instanceof Error</code> before reading <code>e.message</code>.',
        'TS cannot list which errors a function throws (no checked exceptions).',
        'For expected failures, return a result type instead of throwing.',
      ],
      detail: `<pre><code>type Result&lt;T&gt; =
  | { ok: true; value: T }
  | { ok: false; error: string };

try {
  risky();
} catch (e) {
  console.error(e instanceof Error ? e.message : String(e));
}</code></pre>`,
    },
    {
      title: 'Runtime Validation',
      level: 'intermediate',
      summary: 'Check outside data at runtime with a schema library, and get the TS type for free.',
      simple:
        'Types are the guest list. A validator is the bouncer who actually checks IDs at the door.',
      points: [
        'Use for API responses, forms, env variables, files, message queues.',
        'Popular libraries: Zod, Valibot, ArkType, TypeBox.',
        'Define the schema once; infer the type from it, so they never drift apart.',
        'Parse at the edges, then trust the types inside your app.',
      ],
      detail: `<pre><code>import { z } from 'zod';

const User = z.object({ id: z.number(), email: z.string().email() });
type User = z.infer&lt;typeof User&gt;;

const user = User.parse(await res.json()); // throws if invalid</code></pre>`,
      tip: 'Rule of thumb: "parse, don’t validate". Turn unknown data into typed data once, at the boundary.',
    },
    {
      title: 'Migrating from JavaScript',
      level: 'intermediate',
      summary: 'Move a JS codebase to TypeScript gradually, one file at a time.',
      simple:
        'Like renovating a house while living in it: one room at a time, and the house stays usable.',
      points: [
        'Turn on <code>allowJs</code> so .js and .ts files live side by side.',
        '<code>checkJs</code> plus JSDoc comments type-check JS without renaming files.',
        'Rename files to .ts starting from the leaves (files nobody imports).',
        'Start loose, then tighten <code>strict</code> flags step by step.',
        'Mark temporary escapes with <code>// @ts-expect-error</code>, not <code>@ts-ignore</code>.',
      ],
      tip: '@ts-expect-error fails once the error is fixed, so dead suppressions do not pile up.',
    },
    {
      title: 'Branded Types',
      level: 'advanced',
      summary: 'Add an invisible tag to a type so same-shaped values like UserId and OrderId cannot mix.',
      points: [
        'Structural typing treats every <code>string</code> the same; brands add a fake unique field.',
        '<code>type UserId = string &amp; { readonly __brand: \'UserId\' }</code>.',
        'Create branded values only through a function that validates them.',
        'Zero runtime cost: the brand exists only in types.',
      ],
      detail: `<pre><code>type UserId = string &amp; { readonly __brand: 'UserId' };
type OrderId = string &amp; { readonly __brand: 'OrderId' };

const toUserId = (s: string) =&gt; s as UserId;

function loadUser(id: UserId) { /* ... */ }
loadUser(toUserId('u1'));   // OK
loadUser('o1' as OrderId);  // Error</code></pre>`,
    },
    {
      title: 'using & Disposables',
      level: 'advanced',
      summary: 'The using keyword (TS 5.2) cleans up a resource automatically when it goes out of scope.',
      points: [
        'An object with a <code>[Symbol.dispose]()</code> method can be declared with <code>using</code>.',
        'Its dispose runs at the end of the block, even after an error.',
        '<code>await using</code> calls <code>[Symbol.asyncDispose]()</code> for async cleanup.',
        'Like try-with-resources in Java or using in C#.',
        'Older runtimes need a polyfill for <code>Symbol.dispose</code>.',
      ],
      detail: `<pre><code>function openFile(path: string) {
  const handle = fs.openSync(path, 'r');
  return { handle, [Symbol.dispose]: () =&gt; fs.closeSync(handle) };
}

{
  using file = openFile('data.txt');
  // ... read file.handle
} // closed automatically here</code></pre>`,
    },
    {
      title: 'Writing Library Types',
      level: 'expert',
      summary: 'Design public types that are easy to use, give clear errors and do not break on upgrades.',
      points: [
        'Ship .d.ts with <code>declaration: true</code> and point <code>"exports"</code> conditions at them.',
        'Prefer simple, named types over deeply nested type magic in public APIs.',
        'Changing a public type can be a breaking change; follow semver for types too.',
        'Test types with <code>expectTypeOf</code> (Vitest) or <code>tsd</code>.',
        'Check packaging with "Are The Types Wrong?" (<code>@arethetypeswrong/cli</code>).',
      ],
    },
  ],
};
