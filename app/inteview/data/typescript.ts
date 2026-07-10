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
        a: `<p>Generics let you write reusable components that work with <strong>any type</strong> while preserving type safety.</p>
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
}</pre>`,
      },
      {
        q: 'Explain union types, intersection types, and type narrowing.',
        difficulty: 'medium',
        a: `<pre>// Union: A OR B
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
<div class="key-point">Always prefer discriminated unions over type assertions. They let the compiler exhaustively check all cases.</div>`,
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
        a: `<pre>interface User {
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
// name required, email + age optional, id excluded</pre>`,
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
        a: `<pre>// Built-in type guards
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
}</pre>`,
      },
      {
        q: "Explain 'as const', const assertions, and literal types.",
        difficulty: 'tricky',
        a: `<pre>// Without as const: types are widened
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
request('/users', 'PATCH');   // Error!</pre>`,
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
        a: `<pre>// Basic template literal types
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
type Result = ExtractId&lt;'user_123'&gt;;  // "123"</pre>`,
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
    ],
  },

  // ───────────────────────── SYSTEM DESIGN ─────────────────────────
];
