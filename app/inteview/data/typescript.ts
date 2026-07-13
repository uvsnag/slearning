// Interview data: typescript
// Auto-generated from pv.html
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: '🔷',
    questions: [
      {
        q: 'What is TypeScript? Why use it over JavaScript?',
        difficulty: 'easy',
        a: `<ul>
<li>TypeScript is a <strong>typed superset</strong> of JavaScript that compiles to plain JS.</li>
<li>Adds: static types, interfaces, enums, generics, access modifiers, decorators.</li>
</ul>
<p><strong>Benefits</strong>:</p>
<ul>
<li>Catch errors at <strong>compile time</strong> instead of runtime.</li>
<li>Better IDE support: autocomplete, refactoring, navigation.</li>
<li>Self-documenting code via types.</li>
<li>Easier large-scale team collaboration.</li>
</ul>
<pre>// JavaScript: runtime error
function greet(name) { return name.toUpperCase(); }
greet(42); // Runtime: TypeError: name.toUpperCase is not a function

// TypeScript: compile-time error
function greet(name: string): string { return name.toUpperCase(); }
greet(42); // Error: Argument of type 'number' is not assignable to 'string'</pre>`,
      },
      {
        q: 'Explain the difference between interface and type alias in TypeScript.',
        difficulty: 'medium',
        a: `<pre>// Interface: extendable, mergeable
interface User {
  id: number;
  name: string;
}
interface User {            // Declaration merging!
  email: string;
}
interface Admin extends User {
  role: string;
}

// Type alias: more flexible
type Status = 'active' | 'inactive';          // union
type Coordinate = [number, number];             // tuple
type UserOrAdmin = User | Admin;                // union types
type Readonly&lt;T&gt; = { readonly [P in keyof T]: T[P] };  // mapped type</pre>
<p><strong>Key differences</strong>:</p>
<ul>
<li>Interfaces support <strong>declaration merging</strong>. Types do not.</li>
<li>Types can represent <strong>unions, intersections, tuples, mapped types</strong>.</li>
<li>Interfaces are better for object shapes (class contracts).</li>
</ul>
<div class="key-point">Rule of thumb: use <code>interface</code> for objects/classes, <code>type</code> for unions, intersections, and complex types.</div>`,
      },
      {
        q: 'What are Generics in TypeScript? Give practical examples.',
        difficulty: 'hard',
        a: `<p>Generics let you write reusable components that work with <strong>any type</strong> while preserving type safety. Think of a type parameter <code>&lt;T&gt;</code> as a <em>type variable</em>: the caller (or the compiler, via inference) fills it in, and that same <code>T</code> flows through the whole signature so inputs and outputs stay linked.</p>
<p><strong>Why not just use <code>any</code>?</strong> <code>any</code> throws the type away — a <code>getFirst</code> that returns <code>any</code> would let you call <code>.toUpperCase()</code> on a number with no warning. A generic returns the <em>actual</em> element type, so the compiler keeps checking what you do with the result. Generics are the line between "works with many types" and "gives up on types".</p>
<pre>// Generic function
function getFirst&lt;T&gt;(arr: T[]): T | undefined {
  return arr[0];
}
getFirst&lt;number&gt;([1, 2, 3]);  // number
getFirst(['a', 'b']);           // string (inferred)

// Generic interface
interface ApiResponse&lt;T&gt; {
  data: T;
  status: number;
  message: string;
}
const response: ApiResponse&lt;User[]&gt; = await fetchUsers();

// Generic constraint
function getProperty&lt;T, K extends keyof T&gt;(obj: T, key: K): T[K] {
  return obj[key];
}
getProperty({ name: 'John', age: 30 }, 'name');  // string
getProperty({ name: 'John', age: 30 }, 'foo');   // Error!

// Generic class
class DataStore&lt;T&gt; {
  private items: T[] = [];
  add(item: T): void { this.items.push(item); }
  getAll(): T[] { return [...this.items]; }
}</pre>
<p><strong>Constraints</strong> (<code>K extends keyof T</code>) restrict what a type parameter can be so the body can safely touch its members. Without the constraint, <code>obj[key]</code> would be an error, because an unconstrained <code>T</code> might not have that key at all.</p>
<div class="key-point">Prefer letting TypeScript <strong>infer</strong> type arguments (<code>getFirst([1,2,3])</code>) over writing them explicitly (<code>getFirst&lt;number&gt;(...)</code>) — explicit arguments are only needed when inference can't work it out. Rule of thumb: if a type parameter appears only <em>once</em> in a signature, it probably shouldn't be generic at all.</div>`,
      },
      {
        q: 'Explain union types, intersection types, and type narrowing.',
        difficulty: 'medium',
        a: `<p>These three features work together: unions and intersections <em>build</em> composite types, and narrowing is how you safely <em>use</em> a union afterwards.</p>
<ul>
<li><strong>Union (<code>A | B</code>)</strong> — the value is <em>either</em> A or B. Until you narrow, you may only touch members common to <strong>both</strong>. Read <code>|</code> as "or".</li>
<li><strong>Intersection (<code>A &amp; B</code>)</strong> — the value has <em>all</em> members of A <strong>and</strong> B at once. Used to compose/mix shapes. Read <code>&amp;</code> as "and".</li>
<li><strong>Narrowing</strong> — inside a branch the compiler <em>refines</em> a union down to one member using checks like <code>typeof</code>, <code>instanceof</code>, <code>in</code>, or a discriminant property, then unlocks that member's specific API.</li>
</ul>
<pre>// Union: A OR B
type StringOrNumber = string | number;
type Status = 'active' | 'inactive' | 'pending';

// Intersection: A AND B
type Employee = Person & { employeeId: number; department: string; };

// Discriminated Union (tagged union)
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; width: number; height: number };

// Type narrowing
function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2;  // TS knows it's circle
    case 'rect':   return shape.width * shape.height;    // TS knows it's rect
  }
}

// Type guards
function process(value: string | number) {
  if (typeof value === 'string') {
    value.toUpperCase();  // TS knows it's string
  } else {
    value.toFixed(2);     // TS knows it's number
  }
}</pre>
<p><strong>The naming feels backwards</strong>: an <em>intersection</em> of object types has <em>more</em> members (a bigger shape, fewer values that qualify), while a <em>union</em> has fewer safely-accessible members (a smaller common shape, more values that qualify). It matches set theory on the set of <em>legal values</em>, not on the set of properties — which trips up almost everyone at first.</p>
<div class="key-point">Always prefer discriminated unions (a shared literal <code>kind</code>/<code>type</code> tag) over type assertions. They let the compiler narrow automatically and <strong>exhaustively</strong> check every case — add an <code>assertNever(x: never)</code> default and forgetting a new variant becomes a compile error.</div>`,
      },
      {
        q: "What is 'any' vs 'unknown' vs 'never' in TypeScript?",
        difficulty: 'tricky',
        a: `<ul>
<li><strong>any</strong>: opts out of type checking entirely. Can do anything. <strong>Avoid.</strong></li>
<li><strong>unknown</strong>: type-safe alternative to any. Must narrow before use.</li>
<li><strong>never</strong>: represents values that never occur (unreachable code, functions that throw).</li>
</ul>
<pre>// any: no type safety
let a: any = 42;
a.foo.bar();  // no error at compile time, crashes at runtime!

// unknown: must check first
let b: unknown = 42;
b.toFixed();                         // Error: 'b' is of type 'unknown'
if (typeof b === 'number') b.toFixed();  // OK after narrowing

// never: exhaustiveness checking
function assertNever(x: never): never {
  throw new Error('Unexpected value: ' + x);
}
type Color = 'red' | 'blue';
function paint(c: Color) {
  switch (c) {
    case 'red': return '#f00';
    case 'blue': return '#00f';
    default: return assertNever(c);  // Error if new color added but not handled
  }
}</pre>`,
      },
      {
        q: 'Explain TypeScript utility types: Partial, Required, Pick, Omit, Record, Readonly.',
        difficulty: 'hard',
        a: `<p>Utility types are built-in <strong>generic type transformers</strong>. Rather than hand-writing a second interface every time you need a variation of a shape — a "create" DTO without the <code>id</code>, an "update" DTO where everything is optional — you <strong>derive</strong> it from one source type. When the base changes, every derived type updates automatically. This is the DRY principle applied to types, and it eliminates the classic bug where a field is renamed in one interface but a stale duplicate lingers.</p>
<table>
<tr><th>Utility</th><th>Effect</th><th>Typical use</th></tr>
<tr><td><code>Partial&lt;T&gt;</code></td><td>all props optional</td><td>update / patch payloads</td></tr>
<tr><td><code>Required&lt;T&gt;</code></td><td>all props required</td><td>after validating a config</td></tr>
<tr><td><code>Pick&lt;T, K&gt;</code></td><td>keep only keys K</td><td>narrow view / preview DTO</td></tr>
<tr><td><code>Omit&lt;T, K&gt;</code></td><td>drop keys K</td><td>"create" DTO without id</td></tr>
<tr><td><code>Record&lt;K, V&gt;</code></td><td>object of K → V</td><td>lookups / dictionaries</td></tr>
<tr><td><code>Readonly&lt;T&gt;</code></td><td>all props readonly</td><td>immutable data / props</td></tr>
</table>
<pre>interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial&lt;T&gt;: all properties optional
type UpdateUser = Partial&lt;User&gt;;
// { id?: number; name?: string; email?: string; age?: number; }

// Required&lt;T&gt;: all properties required
type StrictUser = Required&lt;User&gt;;

// Pick&lt;T, K&gt;: select specific properties
type UserPreview = Pick&lt;User, 'id' | 'name'&gt;;
// { id: number; name: string; }

// Omit&lt;T, K&gt;: exclude specific properties
type CreateUser = Omit&lt;User, 'id'&gt;;
// { name: string; email: string; age: number; }

// Record&lt;K, V&gt;: object with specific key-value types
type UserRoles = Record&lt;string, 'admin' | 'user' | 'guest'&gt;;
const roles: UserRoles = { john: 'admin', jane: 'user' };

// Readonly&lt;T&gt;: all properties readonly
type FrozenUser = Readonly&lt;User&gt;;
// Cannot reassign any property

// Combining
type UserForm = Partial&lt;Omit&lt;User, 'id'&gt;&gt; & Pick&lt;User, 'name'&gt;;
// name required, email + age optional, id excluded</pre>
<p>They <strong>compose</strong> freely (as the last example shows) because each just returns another type. Note the pairs of opposites: <code>Pick</code>/<code>Omit</code> (allow-list vs deny-list of keys) and <code>Partial</code>/<code>Required</code>.</p>
<div class="key-point">Reach for a utility type before writing a new interface by hand — deriving from a single source of truth means a field rename can't leave a stale duplicate behind. Watch one gotcha: <code>Partial</code> and <code>Readonly</code> are <strong>shallow</strong> (one level deep); nested objects keep their original modifiers unless you write a recursive <code>DeepPartial</code>.</div>`,
      },
      {
        q: 'What are mapped types and conditional types?',
        difficulty: 'hard',
        a: `<pre>// Mapped type: transform properties
type Nullable&lt;T&gt; = { [K in keyof T]: T[K] | null };
type ReadonlyUser = { readonly [K in keyof User]: User[K] };

// Conditional type: T extends U ? X : Y
type IsString&lt;T&gt; = T extends string ? 'yes' : 'no';
type A = IsString&lt;string&gt;;   // 'yes'
type B = IsString&lt;number&gt;;   // 'no'

// infer: extract type
type ReturnType&lt;T&gt; = T extends (...args: any[]) => infer R ? R : never;
type Result = ReturnType&lt;() => string&gt;;  // string

// Practical: extract Promise value type
type Awaited&lt;T&gt; = T extends Promise&lt;infer U&gt; ? Awaited&lt;U&gt; : T;
type X = Awaited&lt;Promise&lt;Promise&lt;string&gt;&gt;&gt;;  // string

// Template literal types
type EventName = \`on\${ Capitalize&lt;'click' | 'focus' | 'blur'&gt; }\`;
// 'onClick' | 'onFocus' | 'onBlur'</pre>
<div class="key-point">Mapped + Conditional types are the foundation of advanced TypeScript patterns — used heavily in library type definitions (React, Express, Prisma).</div>`,
      },
      {
        q: 'What are type guards and how to create custom ones?',
        difficulty: 'medium',
        a: `<p>A <strong>type guard</strong> is any expression that lets the compiler <em>narrow</em> a broad type to a more specific one within a scope. TypeScript understands several guards automatically (<code>typeof</code>, <code>instanceof</code>, <code>in</code>), but for your own domain logic you write a <strong>custom guard</strong> whose return type is a <em>type predicate</em> — <code>pet is Fish</code>. That predicate is the signal that tells the compiler "if this returns <code>true</code>, treat the argument as a Fish from here on".</p>
<pre>// Built-in type guards
typeof value === 'string'        // primitive check
value instanceof Date             // class check
'property' in obj                 // property existence

// Custom type guard (type predicate)
interface Fish { swim(): void; }
interface Bird { fly(): void; }

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim();    // TS knows it's Fish
  } else {
    pet.fly();     // TS knows it's Bird
  }
}

// Assertion function (asserts is)
function assertIsString(val: unknown): asserts val is string {
  if (typeof val !== 'string') throw new Error('Not a string');
}
function demo(val: unknown) {
  assertIsString(val);
  val.toUpperCase();  // TS knows it's string after assertion
}</pre>
<p>The two flavours differ in <em>how</em> they narrow: a <strong>predicate guard</strong> (<code>pet is Fish</code>) narrows inside an <code>if</code>/<code>else</code> branch, while an <strong>assertion function</strong> (<code>asserts val is string</code>) narrows for the rest of the scope by <em>throwing</em> when the check fails — handy for validating inputs up front.</p>
<div class="key-point">The guard must return <code>pet is Fish</code>, not just <code>boolean</code> — with a plain <code>boolean</code> return the compiler runs your check but still won't narrow the type. And a predicate is an <strong>unchecked promise</strong>: if the runtime logic inside is wrong, TypeScript trusts you anyway, so keep the body honest (or use a schema validator like Zod that generates the guard for you).</div>`,
      },
      {
        q: "Explain 'as const', const assertions, and literal types.",
        difficulty: 'tricky',
        a: `<p>By default TypeScript <strong>widens</strong> literal values to their general type, because it assumes most values are meant to change: a mutable object property or array element is inferred as <code>string</code> / <code>string[]</code> rather than the exact literal you wrote. <code>as const</code> is a <strong>const assertion</strong> that tells the compiler the opposite — "this value is fully immutable, keep the most specific type possible." It does three things at once: narrows every literal to its exact value, marks every property <code>readonly</code>, and turns arrays into <code>readonly</code> tuples.</p>
<pre>// Without as const: types are widened
const config = {
  endpoint: 'https://api.example.com',  // type: string
  retries: 3,                            // type: number
  methods: ['GET', 'POST']              // type: string[]
};

// With as const: types are narrowed to literals + readonly
const config = {
  endpoint: 'https://api.example.com',  // type: "https://api.example.com"
  retries: 3,                            // type: 3
  methods: ['GET', 'POST']              // type: readonly ["GET", "POST"]
} as const;

// Practical: enum alternative
const STATUS = {
  Active: 'ACTIVE',
  Inactive: 'INACTIVE',
  Pending: 'PENDING'
} as const;
type Status = typeof STATUS[keyof typeof STATUS];
// 'ACTIVE' | 'INACTIVE' | 'PENDING'

// Literal types in function signatures
function request(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE') { }
request('/users', 'GET');     // OK
request('/users', 'PATCH');   // Error!</pre>
<div class="key-point"><code>as const</code> is the idiomatic way to get enum-like behaviour without <code>enum</code>: an <code>as const</code> object plus <code>typeof STATUS[keyof typeof STATUS]</code> gives you both the runtime values <em>and</em> a precise literal union, with zero generated code and full tree-shaking. Gotcha: the result is deeply <code>readonly</code>, so you can't pass it where a mutable array/object is expected without copying (spread) or a cast.</div>`,
      },
      {
        q: 'What are enums in TypeScript? What are the alternatives?',
        difficulty: 'medium',
        a: `<pre>// Numeric enum
enum Direction {
  Up = 0,     // default starts at 0
  Down = 1,
  Left = 2,
  Right = 3
}

// String enum
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE'
}

// const enum: inlined at compile time (no runtime object)
const enum Color {
  Red = '#f00',
  Blue = '#00f'
}
// Compiled: const c = "#f00"; (no Color object at runtime)</pre>
<p><strong>Alternatives (often preferred)</strong>:</p>
<pre>// Union literal types (most common)
type Status = 'active' | 'inactive' | 'pending';

// as const object (when you need both value and type)
const STATUS = { Active: 'ACTIVE', Inactive: 'INACTIVE' } as const;
type Status = typeof STATUS[keyof typeof STATUS];</pre>
<div class="key-point">Avoid numeric enums (runtime reverse mapping adds bloat). Prefer union types or <code>as const</code> objects for tree-shaking and simplicity.</div>`,
      },
      {
        q: 'What are declaration files (.d.ts) and how do they work?',
        difficulty: 'hard',
        a: `<p>Declaration files provide <strong>type information</strong> for JavaScript libraries that don't have built-in types.</p>
<pre>// lodash.d.ts (example)
declare module 'lodash' {
  export function chunk&lt;T&gt;(array: T[], size: number): T[][];
  export function debounce&lt;T extends (...args: any[]) => any&gt;(
    func: T, wait: number
  ): T;
}

// global.d.ts (augment global types)
declare global {
  interface Window {
    myApp: { version: string; env: string; };
  }
}

// Usage:
window.myApp.version;  // typed!</pre>
<ul>
<li><strong>@types/xxx</strong>: community-maintained declarations on npm (<code>@types/react</code>, <code>@types/node</code>).</li>
<li><strong>DefinitelyTyped</strong>: GitHub repo hosting thousands of <code>@types</code> packages.</li>
</ul>
<div class="key-point">If a library has no types: install <code>@types/libname</code>. If none exists, create a <code>declarations.d.ts</code> with <code>declare module 'libname';</code> to silence errors.</div>`,
      },
      {
        q: 'Explain TypeScript strict mode options and tsconfig.json key settings.',
        difficulty: 'hard',
        a: `<pre>// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",              // output JS version
    "module": "ESNext",              // module system
    "lib": ["ES2022", "DOM"],        // available APIs
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,                  // enables ALL strict checks:
    // "noImplicitAny": true,        // error on implicit 'any'
    // "strictNullChecks": true,     // null/undefined not assignable to other types
    // "strictFunctionTypes": true,  // stricter function type checking
    // "noImplicitThis": true,       // error on 'this' with implicit any
    "esModuleInterop": true,         // better CommonJS/ESM interop
    "skipLibCheck": true,            // skip type checking .d.ts (faster builds)
    "forceConsistentCasingInImports": true,
    "resolveJsonModule": true,       // import JSON files
    "moduleResolution": "bundler",   // modern resolution (Node16/Bundler)
    "paths": {                       // path aliases
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}</pre>
<div class="key-point">Always enable <code>"strict": true</code> for new projects. It catches the most common TypeScript errors. Disable individual checks only with justification.</div>`,
      },
      {
        q: 'What are decorators in TypeScript?',
        difficulty: 'hard',
        a: `<p>Decorators are functions that modify classes, methods, properties, or parameters. Stage 3 proposal (native in TS 5.0+).</p>
<pre>// Class decorator (NestJS / Angular style)
@Controller('/users')
class UserController {

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getUser(@Param('id') id: string) { }
}

// Method decorator implementation
function Log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(\`Calling \${key} with\`, args);
    const result = original.apply(this, args);
    console.log(\`\${key} returned\`, result);
    return result;
  };
}

class Calculator {
  @Log
  add(a: number, b: number) { return a + b; }
}

// new Calculator().add(2, 3)
// → "Calling add with [2, 3]"
// → "add returned 5"</pre>
<div class="key-point">Enable with <code>"experimentalDecorators": true</code> in tsconfig. Heavily used by NestJS, Angular, TypeORM.</div>`,
      },
      {
        q: 'How to handle null/undefined safely in TypeScript?',
        difficulty: 'medium',
        a: `<pre>// strictNullChecks: null and undefined are distinct types
let name: string = null;     // Error!
let name: string | null = null;  // OK

// Optional chaining (?.)
const city = user?.address?.city;  // undefined if any is null/undefined

// Nullish coalescing (??)
const name = user.name ?? 'Anonymous';  // only null/undefined fallback
const name = user.name || 'Anonymous';  // also fallback for '', 0, false

// Non-null assertion (!)
function process(el: HTMLElement | null) {
  el!.style.color = 'red';  // "I know it's not null" — UNSAFE!
}

// Optional properties
interface Config {
  host: string;
  port?: number;           // number | undefined
  debug?: boolean;
}

// Optional parameters
function greet(name: string, title?: string): string {
  return title ? \`\${title} \${name}\` : name;
}</pre>
<div class="key-point">Avoid <code>!</code> (non-null assertion) — it defeats the purpose of strictNullChecks. Use <code>?.</code> and <code>??</code> instead, or narrow with type guards.</div>`,
      },
      {
        q: "What is the difference between 'type assertion' and 'type casting'?",
        difficulty: 'tricky',
        a: `<p>TypeScript has <strong>type assertions</strong> (not casting). They don't change the runtime value — only tell the compiler "trust me".</p>
<pre>// Type assertion (angle bracket or 'as')
const input = document.getElementById('name') as HTMLInputElement;
// or: const input = &lt;HTMLInputElement&gt;document.getElementById('name');

input.value = 'John';  // OK: TS knows it's HTMLInputElement

// Double assertion (DANGEROUS: bypasses all checks)
const x = 'hello' as unknown as number;  // compiles but wrong!

// Safer alternatives:
// 1. Type guard
const el = document.getElementById('name');
if (el instanceof HTMLInputElement) {
  el.value = 'John';  // safely narrowed
}

// 2. satisfies (TS 4.9+) — validates type without widening
const palette = {
  red: [255, 0, 0],
  green: '#00ff00'
} satisfies Record&lt;string, string | number[]&gt;;
// palette.red is still number[] (not widened to string | number[])</pre>
<div class="key-point"><code>as</code> doesn't change runtime behavior — it's purely compile-time. If you're wrong, you'll get runtime errors. Prefer type guards for safety.</div>`,
      },
      {
        q: 'What is the difference between extends and implements in TypeScript?',
        difficulty: 'medium',
        a: `<ul>
<li><strong>extends</strong>: inherit from a class (get implementation) or constrain generics.</li>
<li><strong>implements</strong>: promise to follow a contract (interface). Must provide all members.</li>
</ul>
<pre>interface Printable {
  print(): void;
}

class Base {
  greet() { return 'hello'; }
}

// extends: inherits greet() implementation
class Child extends Base {
  // greet() is already available
}

// implements: must provide print() yourself
class Report implements Printable {
  print() { console.log('Printing...'); }
}

// Class can extend ONE class but implement MANY interfaces
class Document extends Base implements Printable, Serializable {
  print() { /* ... */ }
  serialize() { /* ... */ }
}

// extends in generics: constrains T
function getLength&lt;T extends { length: number }&gt;(item: T): number {
  return item.length;
}
getLength('hello');  // OK: string has .length
getLength(42);       // Error: number has no .length</pre>`,
      },
      {
        q: 'What is the satisfies operator in TypeScript (4.9+)?',
        difficulty: 'tricky',
        a: `<p><code>satisfies</code> validates that an expression matches a type WITHOUT widening it. You get both type safety AND precise inference.</p>
<pre>// Problem with 'as': loses precision
type Color = 'red' | 'green' | 'blue';
type Palette = Record&lt;Color, string | number[]&gt;;

const palette = {
  red: [255, 0, 0],
  green: '#00ff00',
  blue: '#0000ff',
} as Palette;

palette.red.map(x => x);  // Error! TS thinks red is string | number[]

// Solution with 'satisfies': precise types preserved
const palette2 = {
  red: [255, 0, 0],
  green: '#00ff00',
  blue: '#0000ff',
} satisfies Palette;

palette2.red.map(x => x);     // OK! TS knows red is number[]
palette2.green.toUpperCase();  // OK! TS knows green is string

// Catches typos too:
const bad = {
  red: [255, 0, 0],
  geen: '#00ff00',  // Error! 'geen' is not in Color
} satisfies Palette;</pre>
<div class="key-point"><code>satisfies</code> is the best of both worlds: type checking without losing narrow types. Use it instead of <code>as</code> whenever possible.</div>`,
      },
      {
        q: 'What is the difference between void, undefined, and never as return types?',
        difficulty: 'tricky',
        a: `<pre>// void: function doesn't return a meaningful value
function log(msg: string): void {
  console.log(msg);
  // can return undefined implicitly or explicitly
}

// undefined: function explicitly returns undefined
function getNothing(): undefined {
  return undefined;  // MUST return undefined
  // return;          // Error in some configs!
}

// never: function NEVER returns (throws or infinite loop)
function throwError(msg: string): never {
  throw new Error(msg);  // never reaches return
}
function infiniteLoop(): never {
  while (true) {}  // never exits
}

// Practical difference in callbacks:
type VoidCallback = () => void;
const cb: VoidCallback = () => 42;  // OK! void ignores return value
// This is why Array.push returns number but forEach expects void callback</pre>
<div class="key-point">Trick: A <code>void</code> return type in a callback context means "ignore the return value" — it does NOT mean the function can't return something. This is by design for compatibility.</div>`,
      },
      {
        q: 'What are template literal types in TypeScript?',
        difficulty: 'hard',
        a: `<p>Template literal types apply JavaScript's backtick-string interpolation <strong>at the type level</strong>: you build new string-literal types by embedding other string-literal types inside a template. When you interpolate a union, TypeScript produces the <strong>cross-product</strong> of every combination — so two 2-member unions expand into four literal types.</p>
<p><strong>Why they matter</strong>: real APIs are full of strings whose <em>structure</em> carries meaning — event handler names, CSS values, route params, prefixed keys. Together with the intrinsic helpers (<code>Uppercase</code>, <code>Lowercase</code>, <code>Capitalize</code>, <code>Uncapitalize</code>) and <code>infer</code> for pattern-matching, template literal types let the compiler validate and even <em>parse</em> those strings, catching typos that a plain <code>string</code> type would wave through.</p>
<pre>// Basic template literal types
type Color = 'red' | 'blue';
type Size = 'sm' | 'lg';
type ClassName = \`\${Size}-\${Color}\`;
// "sm-red" | "sm-blue" | "lg-red" | "lg-blue"

// Event handler types
type EventName = 'click' | 'focus' | 'blur';
type Handler = \`on\${Capitalize&lt;EventName&gt;}\`;
// "onClick" | "onFocus" | "onBlur"

// Intrinsic string manipulation types
type Upper = Uppercase&lt;'hello'&gt;;      // "HELLO"
type Lower = Lowercase&lt;'HELLO'&gt;;      // "hello"
type Cap = Capitalize&lt;'hello'&gt;;       // "Hello"
type Uncap = Uncapitalize&lt;'Hello'&gt;;   // "hello"

// Practical: type-safe CSS units
type CSSUnit = 'px' | 'em' | 'rem' | '%';
type CSSValue = \`\${number}\${CSSUnit}\`;
const width: CSSValue = '100px';   // OK
const bad: CSSValue = '100vw';     // Error!

// Pattern matching with infer
type ExtractId&lt;T&gt; = T extends \`user_\${infer Id}\` ? Id : never;
type Result = ExtractId&lt;'user_123'&gt;;  // "123"</pre>
<div class="key-point">Combined with <code>infer</code>, template literal types can pull structured data <em>out</em> of a string type (extracting <code>"123"</code> from <code>"user_123"</code>) — this is how libraries type-check route paths and query strings. Beware the combinatorial explosion: crossing several large unions multiplies out fast and can blow past TypeScript's type-complexity limits.</div>`,
      },
      {
        q: 'Explain TypeScript module augmentation and declaration merging.',
        difficulty: 'hard',
        a: `<pre>// Declaration merging: same interface name = merged
interface User {
  id: number;
  name: string;
}
interface User {       // merged with above!
  email: string;
}
// User is now { id: number; name: string; email: string; }

// Module augmentation: extend third-party types
// Extend Express Request
declare module 'express' {
  interface Request {
    user?: { id: string; role: string; };
  }
}
// Now req.user is typed in all middleware!

// Global augmentation
declare global {
  interface Window {
    analytics: { track(event: string): void; };
  }
  interface Array&lt;T&gt; {
    last(): T | undefined;
  }
}

// Enum merging (adds members)
enum Status { Active = 'ACTIVE' }
enum Status { Inactive = 'INACTIVE' } // merged!
// Status.Active and Status.Inactive both work</pre>
<div class="key-point">Declaration merging only works with <code>interface</code> and <code>namespace</code>, NOT with <code>type</code> aliases. This is one key reason to prefer <code>interface</code> for extensible shapes.</div>`,
      },
      {
        q: 'Why does an inline object literal fail type checking when the same object assigned to a variable passes? (Excess property checks)',
        difficulty: 'tricky',
        a: `<p>TypeScript is <strong>structurally typed</strong>: an object with <strong>more</strong> properties than the target type is normally assignable ("at least these properties"). But <strong>fresh object literals</strong> — literals passed directly to a parameter or annotated variable — get an extra lint-like pass called the <strong>excess property check</strong>: any property not declared in the target type is an error. Once the literal is assigned to a variable, it loses "freshness" and only plain structural compatibility applies.</p>
<pre>interface Options {
  title: string;
  width?: number;
}
function createWindow(opts: Options) { /* ... */ }

// 1. Fresh literal → excess property check fires
createWindow({ title: 'Hi', widht: 100 });
// Error: 'widht' does not exist in type 'Options'. Did you mean 'width'?

// 2. Same object via a variable → passes!
const opts = { title: 'Hi', widht: 100 };  // inferred: { title: string; widht: number }
createWindow(opts);  // OK — structurally it has at least { title: string }

// 3. Escape hatches that silently disable the check:
createWindow({ title: 'Hi', widht: 100 } as Options);  // assertion kills it
interface Loose { title: string; [key: string]: unknown; }  // index signature allows anything</pre>
<p><strong>Why it exists</strong>: with optional properties, a typo like <code>widht</code> would otherwise be a perfectly valid structural supertype and the bug would ship silently. The check only runs on fresh literals because that is the one place the extra property <strong>cannot</strong> be intentional — nothing else can read it.</p>
<p><strong>Where it hides bugs</strong>: config objects built in a variable first, spread from user input, or widened by a helper function bypass the check — typos in optional flags (<code>retires</code> vs <code>retries</code>) go unnoticed. Interviewer follow-up: how to protect variables too? Use <code>satisfies Options</code> on the variable declaration — it re-runs full checking without widening.</p>
<div class="key-point">Excess property checking is a special-case lint on fresh object literals, not part of structural assignability — assigning through a variable or an <code>as</code> assertion silently disables it, so use <code>satisfies</code> to keep the safety.</div>`,
      },
      {
        q: 'TypeScript is structurally typed — what problems does that cause, and how do branded types simulate nominal typing?',
        difficulty: 'hard',
        a: `<p>In a <strong>structural</strong> type system, compatibility is decided by <strong>shape</strong>, not by the name of the declaration. Two unrelated interfaces with identical members are fully interchangeable — unlike Java/C# where the class name (nominal typing) matters.</p>
<pre>interface UserId { value: string; }
interface ProductId { value: string; }

function loadUser(id: UserId) { /* ... */ }
const pid: ProductId = { value: 'p-42' };
loadUser(pid);  // Compiles! Identical shape → interchangeable

// The empty-interface trap: {} matches almost EVERYTHING
interface AnyProps {}
const a: AnyProps = 42;        // OK — number has "at least no members"
const b: AnyProps = 'hello';   // OK
const c: AnyProps = () => {};  // OK — only null/undefined are rejected</pre>
<p><strong>Real failure mode</strong>: domain IDs. If <code>userId</code>, <code>orderId</code>, and <code>productId</code> are all <code>string</code>, swapping arguments compiles and corrupts data at runtime. The fix is a <strong>branded (opaque) type</strong> — intersect the primitive with a phantom property that never exists at runtime:</p>
<pre>type UserId  = string & { readonly __brand: 'UserId' };
type OrderId = string & { readonly __brand: 'OrderId' };

// Factory is the only sanctioned way to create one
function toUserId(raw: string): UserId {
  // validate format here, then bless the value
  return raw as UserId;
}

function getUser(id: UserId) { /* ... */ }
const orderId = 'o-77' as OrderId;

getUser(orderId);       // Error: '__brand' types are incompatible
getUser('u-1');         // Error: plain string lacks the brand
getUser(toUserId('u-1')); // OK — and it is still just a string at runtime</pre>
<p>The brand property is purely compile-time fiction — no object is ever created, zero runtime cost. Libraries like Zod expose the same idea as <code>z.string().brand&lt;'UserId'&gt;()</code>. Interviewer follow-up: why <code>unique symbol</code> brands? They prevent two accidental identical brand strings from unifying.</p>
<div class="key-point">Structural typing means names are documentation, not identity — when identity matters (IDs, validated strings, units), brand the type so the compiler enforces provenance at zero runtime cost.</div>`,
      },
      {
        q: 'What are distributive conditional types? Why does Exclude work, and when do you need [T] extends [U]?',
        difficulty: 'tricky',
        a: `<p>A conditional type <code>T extends U ? X : Y</code> is <strong>distributive</strong> when <code>T</code> is a <strong>naked type parameter</strong>: applied to a union, it runs once per member and unions the results. This single rule is what makes <code>Exclude</code>, <code>Extract</code>, and <code>NonNullable</code> possible.</p>
<pre>// Exclude, from scratch — one line, all the magic is distribution
type MyExclude&lt;T, U&gt; = T extends U ? never : T;

type T1 = MyExclude&lt;'a' | 'b' | 'c', 'a'&gt;;  // 'b' | 'c'
// Evaluates member-by-member:
//   ('a' extends 'a' ? never : 'a')   → never
// | ('b' extends 'a' ? never : 'b')   → 'b'
// | ('c' extends 'a' ? never : 'c')   → 'c'
// never disappears from unions → 'b' | 'c'

// Distribution changes the SHAPE of results:
type ToArray&lt;T&gt; = T extends any ? T[] : never;
type A = ToArray&lt;string | number&gt;;   // string[] | number[]  (two array types!)

// Wrap both sides in a tuple to DISABLE distribution:
type ToArrayAll&lt;T&gt; = [T] extends [any] ? T[] : never;
type B = ToArrayAll&lt;string | number&gt;;  // (string | number)[]  (one array type)</pre>
<p><strong>The classic gotcha</strong>: <code>never</code> is the empty union, so distributing over it produces… nothing:</p>
<pre>type IsNever&lt;T&gt; = T extends never ? true : false;
type X = IsNever&lt;never&gt;;   // never — NOT true! Zero members → zero results

type IsNeverFixed&lt;T&gt; = [T] extends [never] ? true : false;
type Y = IsNeverFixed&lt;never&gt;;  // true — tuple wrapper blocks distribution</pre>
<p>Combine with <code>infer</code> and you can dissect any type: <code>type ElementOf&lt;T&gt; = T extends readonly (infer E)[] ? E : never;</code>. Follow-ups interviewers like: why does <code>keyof (A | B)</code> give only shared keys, and why does <code>boolean</code> distribute as <code>true | false</code> (it is literally that union)?</p>
<div class="key-point">A naked type parameter before <code>extends</code> distributes over unions — it is the engine behind Exclude/Extract, and <code>[T] extends [U]</code> is the standard switch to turn it off (mandatory when testing for <code>never</code>).</div>`,
      },
      {
        q: 'Implement Partial, Pick, and Readonly from scratch, and explain "as" key remapping in mapped types.',
        difficulty: 'hard',
        a: `<p>Every built-in utility type is a one-line <strong>mapped type</strong> — knowing how to write them shows you understand <code>keyof</code>, indexed access, and modifiers rather than memorizing an API.</p>
<pre>// The standard library, reimplemented:
type MyPartial&lt;T&gt;  = { [K in keyof T]?: T[K] };            // add ? modifier
type MyRequired&lt;T&gt; = { [K in keyof T]-?: T[K] };           // -? REMOVES optionality
type MyReadonly&lt;T&gt; = { readonly [K in keyof T]: T[K] };
type Mutable&lt;T&gt;    = { -readonly [K in keyof T]: T[K] };   // -readonly strips it
type MyPick&lt;T, K extends keyof T&gt; = { [P in K]: T[P] };
type MyRecord&lt;K extends PropertyKey, V&gt; = { [P in K]: V };</pre>
<p><strong>Key remapping with <code>as</code></strong> (TS 4.1+) lets the mapped type produce <strong>different key names</strong> — or drop keys entirely by mapping them to <code>never</code>:</p>
<pre>// Derive a getters interface from a data model
type Getters&lt;T&gt; = {
  [K in keyof T as \`get\${Capitalize&lt;string & K&gt;}\`]: () => T[K];
};
interface Person { name: string; age: number; }
type PersonGetters = Getters&lt;Person&gt;;
// { getName: () => string; getAge: () => number; }
// (string & K filters out symbol keys so Capitalize accepts it)

// Filter properties BY VALUE TYPE — remap unwanted keys to never
type OmitByType&lt;T, V&gt; = {
  [K in keyof T as T[K] extends V ? never : K]: T[K];
};
type NoFunctions = OmitByType&lt;{ id: number; save: () => void }, Function&gt;;
// { id: number }

// Omit is just Pick + Exclude composed:
type MyOmit&lt;T, K extends PropertyKey&gt; = MyPick&lt;T, Exclude&lt;keyof T, K&gt;&gt;;</pre>
<p><strong>Why it matters</strong>: this is how Prisma derives model types from your schema, how React types <code>on*</code> event props, and how tRPC infers client types from server routers — types are <strong>computed</strong> from a single source of truth instead of hand-written twice. Follow-up: mapped types are <strong>homomorphic</strong> when mapping over <code>keyof T</code> — they preserve <code>?</code>/<code>readonly</code> modifiers from the original, which is why <code>Partial&lt;Readonly&lt;T&gt;&gt;</code> keeps readonly.</p>
<div class="key-point">Utility types are one-line mapped types; <code>as</code> remapping (including "remap to never" filtering) is the tool for deriving whole APIs from a single model type instead of maintaining parallel declarations.</div>`,
      },
      {
        q: 'What are the pitfalls of numeric enums and const enums that make senior engineers avoid them?',
        difficulty: 'tricky',
        a: `<p>Enums are one of TypeScript's few features that generate runtime code with surprising semantics — three concrete traps come up in real codebases:</p>
<p><strong>1. Numeric enums get reverse mappings</strong> — the compiled object maps both ways, which bloats bundles and breaks <code>Object.keys</code> assumptions:</p>
<pre>enum Level { Low, High }
// Compiles to:
// var Level = {};
// Level[Level["Low"] = 0] = "Low";
// Level[Level["High"] = 1] = "High";
Object.keys(Level);  // ["0", "1", "Low", "High"] — 4 keys, not 2!
Level[0];            // "Low" (reverse lookup — string enums do NOT have this)</pre>
<p><strong>2. Pre-TS-5.0, numeric enums accepted ANY number</strong> — a legendary soundness hole:</p>
<pre>enum Status { Active = 1, Inactive = 2 }
const s: Status = 99;  // No error before TypeScript 5.0!
// Anything arriving from JSON.parse could claim to be a Status.
// TS 5.0 finally made enums into unions of their literal members.</pre>
<p><strong>3. <code>const enum</code> breaks single-file transpilers</strong>. Members are inlined at the call site, which requires whole-program type information. Babel, esbuild, swc, and <code>ts.transpileModule</code> compile one file at a time, so the enum object does not exist and inlining cannot happen — under <code>isolatedModules</code> TypeScript errors on exported const enums, and without it you get runtime <code>ReferenceError</code>s. Publishing const enums in a library's .d.ts also couples consumers to your compiler settings.</p>
<pre>// The alternatives senior codebases actually use:
type Status = 'active' | 'inactive';           // union of string literals: zero runtime cost

const STATUS = { Active: 'active', Inactive: 'inactive' } as const;
type Status2 = typeof STATUS[keyof typeof STATUS];  // value object + derived type
// Iterable, tree-shakeable, no reverse mapping, transpiler-safe</pre>
<div class="key-point">Numeric enums leak reverse mappings and (pre-5.0) accepted any number; const enums break isolated-module transpilers — prefer string-literal unions or <code>as const</code> objects, which give the same ergonomics with plain JavaScript semantics.</div>`,
      },
      {
        q: 'Where is TypeScript deliberately unsound? Explain method bivariance and array covariance.',
        difficulty: 'tricky',
        a: `<p>TypeScript trades soundness for ergonomics in a few documented places — a program can typecheck and still crash with a type error at runtime. Seniors are expected to know the holes so <code>strict</code> mode isn't mistaken for a proof.</p>
<p><strong>1. Method parameter bivariance.</strong> Sound function subtyping requires parameters to be <strong>contravariant</strong> (a handler must accept at least what the interface promises). <code>strictFunctionTypes</code> enforces this — but <strong>only for function-property syntax, not method shorthand</strong>:</p>
<pre>interface EventBusStrict {
  handle: (e: MouseEvent) => void;   // property syntax → checked strictly
}
interface EventBusLoose {
  handle(e: MouseEvent): void;       // method shorthand → still BIVARIANT!
}

declare const onKey: (e: KeyboardEvent) => void;
const a: EventBusStrict = { handle: onKey };  // Error (good — KeyboardEvent is narrower)
const b: EventBusLoose  = { handle: onKey };  // Compiles! Then a MouseEvent arrives
// at runtime and onKey reads e.key → undefined. Bivariance was kept so
// Array&lt;Dog&gt; could remain assignable to Array&lt;Animal&gt; (push is a method).</pre>
<p><strong>2. Array covariance.</strong> <code>Dog[]</code> is assignable to <code>Animal[]</code> even though arrays are mutable — the write side is unchecked:</p>
<pre>class Animal { name = ''; }
class Dog extends Animal { bark() { return 'woof'; } }
class Cat extends Animal { meow() { return 'meow'; } }

const dogs: Dog[] = [new Dog()];
const animals: Animal[] = dogs;   // allowed: covariant
animals.push(new Cat());          // typechecks — it IS an Animal[]
dogs[1].bark();                   // runtime TypeError: dogs[1].bark is not a function
// Mitigation: accept readonly Animal[] — no push, covariance becomes safe.</pre>
<p><strong>3. Other sanctioned holes</strong>: <code>any</code> silently infects everything it touches; <code>as</code>/double assertion overrides the checker; indexed access <code>arr[i]</code> is assumed present unless <code>noUncheckedIndexedAccess</code> is on; <code>JSON.parse</code> returns <code>any</code>. Follow-up interviewers love: why not make it sound? Because TS must type existing JavaScript idioms — full soundness (like Flow attempted) rejects too much real-world code.</p>
<div class="key-point">TypeScript is intentionally unsound: method-shorthand parameters stay bivariant even under strictFunctionTypes and mutable arrays are covariant — so use function-property syntax for callbacks, <code>readonly T[]</code> for inputs, and runtime validation at trust boundaries.</div>`,
      },
    ],
  },

  // ───────────────────────── SYSTEM DESIGN ─────────────────────────
];
