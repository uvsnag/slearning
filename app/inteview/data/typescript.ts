// Interview data: typescript
// Auto-generated from pv.html
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: '🔷',
    questions: [
      // ──── 1. TYPESCRIPT BASICS & PROJECT CONFIGURATION ────
      {
        q: 'What is TypeScript? Why use it over JavaScript?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>TypeScript is JavaScript with a static type layer that compiles down to plain JavaScript. It catches type errors at compile time and gives better tooling like autocomplete, safe refactoring, and self-documenting code. The main costs are a build step and a learning curve, so it is best for code that a team maintains over time. Types exist only at compile time and are gone at runtime, so external data such as API responses still needs to be validated.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>TypeScript về cơ bản là JavaScript có thêm hệ thống kiểu tĩnh, và khi build sẽ được biên dịch ra JavaScript thuần. Lợi ích lớn nhất là bắt được lỗi sai kiểu ngay lúc viết code thay vì đợi đến lúc chạy, cộng thêm IDE hỗ trợ tốt hơn hẳn: autocomplete chính xác, refactor an toàn, và bản thân type cũng là một dạng tài liệu cho code. Đổi lại thì phải có thêm bước build và mất chút thời gian làm quen, nên TypeScript phát huy giá trị nhất ở những codebase lớn, nhiều người cùng bảo trì lâu dài. Một điểm cần nhớ: type chỉ tồn tại lúc compile, khi chạy thì không còn gì cả, nên dữ liệu từ bên ngoài như response API vẫn phải validate như bình thường.</p></details>
<ul>
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
        q: 'Explain TypeScript strict mode options and tsconfig.json key settings.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The most important setting is <code>strict: true</code>, recommended for every new project, because it bundles checks like <code>strictNullChecks</code> and <code>noImplicitAny</code> that catch most real bugs. Turning it on for an older codebase is harder, and there the checks can be enabled one at a time. Other key settings are <code>target</code> and <code>lib</code> matching the runtime, <code>moduleResolution</code> set to bundler for modern setups, and <code>skipLibCheck</code> for faster builds. It is also worth adding <code>noUncheckedIndexedAccess</code>, which strict mode does not include.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Setting quan trọng nhất là <code>strict: true</code>, dự án mới nào cũng nên bật, vì nó gom sẵn một loạt kiểm tra như <code>strictNullChecks</code> và <code>noImplicitAny</code>, vốn bắt được phần lớn bug thực tế. Với codebase cũ thì bật strict một phát sẽ ra rất nhiều lỗi, nên thường phải bật từng option một rồi sửa dần. Ngoài ra cần để ý <code>target</code> và <code>lib</code> phải khớp với môi trường chạy thực tế, <code>moduleResolution</code> nên để <code>bundler</code> nếu dùng Vite hay các bundler hiện đại, và <code>skipLibCheck</code> giúp build nhanh hơn vì bỏ qua việc kiểm tra file .d.ts trong node_modules. Cũng nên bật thêm <code>noUncheckedIndexedAccess</code>, vì option này không nằm trong strict nhưng rất hữu ích khi truy cập phần tử mảng hay key của object.</p></details>
<pre>// tsconfig.json
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
        q: 'What are declaration files (.d.ts) and how do they work?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A <code>.d.ts</code> file holds only type information with no implementation, and it describes the shape of JavaScript that has no types of its own. Most of the time the types come from installing an <code>@types</code> package from DefinitelyTyped. A hand-written declaration is needed when a library ships no types, or to augment globals such as adding a property to <code>Window</code>. A quick fix for an untyped package is a one-line <code>declare module 'libname'</code>, which makes its exports <code>any</code>.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>File <code>.d.ts</code> chỉ chứa khai báo kiểu, không có code chạy thật, dùng để mô tả "hình dáng" của những đoạn JavaScript vốn không có type. Thông thường bạn không phải tự viết, chỉ cần cài package <code>@types/...</code> từ DefinitelyTyped là xong. Chỉ khi thư viện không kèm type và cũng không có @types, hoặc khi cần mở rộng type toàn cục (ví dụ thêm một property vào <code>Window</code>), bạn mới cần tự viết declaration. Nếu chỉ muốn dùng tạm một package chưa có type, cách nhanh nhất là khai báo một dòng <code>declare module 'libname'</code>, khi đó mọi export của nó sẽ có kiểu <code>any</code>.</p></details>
<p>Declaration files provide <strong>type information</strong> for JavaScript libraries that don't have built-in types.</p>
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

      // ──── 2. TYPE SYSTEM FUNDAMENTALS & NARROWING ────
      {
        q: 'Explain the difference between interface and type alias in TypeScript.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The common rule is to use <code>interface</code> for object and class shapes and <code>type</code> for everything else. Interfaces support declaration merging and fit class contracts well, while type aliases can express unions, intersections, tuples, and mapped types that interfaces cannot. For plain objects they are largely interchangeable, so the main goal is to stay consistent. Because interfaces merge, a public interface can be extended by other code, which can be either useful or risky.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Quy tắc hay được dùng nhất: <code>interface</code> cho object và class, còn <code>type</code> cho mọi thứ khác. Interface có declaration merging (hai interface cùng tên sẽ tự gộp lại) và rất hợp để định nghĩa contract cho class. Type alias thì linh hoạt hơn, có thể biểu diễn union, intersection, tuple, mapped type, những thứ interface không làm được. Nếu chỉ mô tả object thường thì hai cái gần như tương đương, nên quan trọng nhất là cả team thống nhất một kiểu. Lưu ý là chính vì interface có thể merge nên một interface public có thể bị code khác "chèn" thêm thành viên vào, tùy tình huống mà đó là tính năng hay là rủi ro.</p></details>
<pre>// Interface: extendable, mergeable
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
        q: 'Explain union types, intersection types, and type narrowing.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Union and intersection types build composite types, and narrowing is how a union is used safely afterward. A union means the value is either A or B, so only members common to both can be used until it is narrowed, while an intersection combines A and B into one shape. Narrowing refines a union inside a branch using <code>typeof</code>, <code>instanceof</code>, <code>in</code>, or a shared tag field. A discriminated union with a common <code>kind</code> field plus an <code>assertNever</code> default lets the compiler check every case, so a missing new variant becomes a compile error.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Union và intersection là hai cách ghép type lại với nhau, còn narrowing là cách để dùng một union một cách an toàn. Union <code>A | B</code> nghĩa là giá trị hoặc là A hoặc là B, nên khi chưa narrow thì bạn chỉ được dùng những thành viên mà cả A và B đều có. Intersection thì gộp cả hai thành một type có đủ thành viên của cả A lẫn B. Narrowing là việc thu hẹp union trong từng nhánh code bằng <code>typeof</code>, <code>instanceof</code>, <code>in</code>, hoặc dựa vào một field tag chung. Pattern hay dùng là discriminated union với field <code>kind</code>, kết hợp với <code>assertNever</code> ở nhánh default của switch: khi có ai thêm biến thể mới mà quên xử lý, compiler sẽ báo lỗi ngay.</p></details>
<p>These three features work together: unions and intersections <em>build</em> composite types, and narrowing is how you safely <em>use</em> a union afterwards.</p>
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
        q: 'What are type guards and how to create custom ones?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A type guard is anything that narrows a broad type to a more specific one within a scope. TypeScript understands <code>typeof</code>, <code>instanceof</code>, and <code>in</code> automatically, and a custom guard uses a return type written as a predicate like <code>pet is Fish</code>. The return type must be the predicate and not plain <code>boolean</code>, or the compiler runs the check but does not narrow. A predicate is trusted without checking, so for external data a schema validator like Zod that generates the guard is safer.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Type guard là bất kỳ đoạn kiểm tra nào giúp TypeScript thu hẹp một type rộng thành type cụ thể hơn trong phạm vi đó. Các phép kiểm tra <code>typeof</code>, <code>instanceof</code>, <code>in</code> thì TypeScript tự hiểu. Còn muốn viết guard riêng thì khai báo kiểu trả về dạng predicate, ví dụ <code>pet is Fish</code>. Điểm hay bị nhầm: nếu kiểu trả về chỉ là <code>boolean</code> thường thì hàm vẫn chạy nhưng compiler không narrow gì cả. Một lưu ý nữa là compiler tin tưởng hoàn toàn vào predicate mà không kiểm chứng lại logic bên trong, nên với dữ liệu từ bên ngoài (API, form, file), dùng schema validator như Zod để nó tự sinh guard sẽ an toàn hơn là tự viết tay.</p></details>
<p>A <strong>type guard</strong> is any expression that lets the compiler <em>narrow</em> a broad type to a more specific one within a scope. TypeScript understands several guards automatically (<code>typeof</code>, <code>instanceof</code>, <code>in</code>), but for your own domain logic you write a <strong>custom guard</strong> whose return type is a <em>type predicate</em> — <code>pet is Fish</code>. That predicate is the signal that tells the compiler "if this returns <code>true</code>, treat the argument as a Fish from here on".</p>
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
        q: "What is 'any' vs 'unknown' vs 'never' in TypeScript?",
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>These are the three edges of the type system. <code>any</code> turns off type checking and spreads to everything it touches, so it is best avoided. <code>unknown</code> is the safe version and must be narrowed before use, which fits values like <code>JSON.parse</code> results or external input. <code>never</code> represents a value that cannot exist, and its main use is exhaustiveness checking, where an <code>assertNever</code> in a switch default fails to compile when a new union member is added.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Đây là ba "điểm biên" của hệ thống kiểu. <code>any</code> tắt hẳn việc kiểm tra kiểu, và tệ hơn là nó lây lan: cái gì chạm vào any cũng thành any, nên cần tránh tối đa. <code>unknown</code> là phiên bản an toàn của any: nhận được mọi giá trị nhưng bắt buộc phải narrow trước khi dùng, rất hợp với những thứ như kết quả <code>JSON.parse</code> hay input từ bên ngoài. <code>never</code> đại diện cho giá trị không thể tồn tại, công dụng chính là kiểm tra tính đầy đủ (exhaustiveness): đặt một hàm <code>assertNever</code> ở nhánh default của switch, sau này ai thêm thành viên mới vào union mà quên xử lý thì code sẽ không compile được.</p></details>
<ul>
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
        q: 'What is the difference between void, undefined, and never as return types?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p><code>void</code> means the caller should not rely on a return value, <code>undefined</code> means the function actually returns undefined, and <code>never</code> means the function never returns because it throws or loops forever. A common trap is that a <code>() =&gt; void</code> callback type accepts a function that returns something, because the return is simply ignored, which is why <code>Array.forEach</code> accepts such callbacks. <code>never</code> is the useful one for exhaustiveness checks. So <code>void</code> should be read as return value discarded, not as must return nothing.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>void</code> nghĩa là "đừng trông đợi gì ở giá trị trả về", <code>undefined</code> nghĩa là hàm thực sự trả về undefined, còn <code>never</code> nghĩa là hàm không bao giờ chạy đến chỗ return, vì nó throw hoặc lặp vô hạn. Một cái bẫy hay gặp: kiểu callback <code>() =&gt; void</code> vẫn nhận được hàm có return giá trị, vì TypeScript chỉ đơn giản là bỏ qua giá trị đó. Đây cũng là lý do <code>Array.forEach</code> nhận được callback dạng <code>x =&gt; arr.push(x)</code> dù push trả về số. <code>never</code> thì hữu ích nhất cho việc kiểm tra exhaustiveness. Tóm lại, hãy hiểu <code>void</code> là "giá trị trả về bị bỏ đi" chứ không phải "cấm trả về gì".</p></details>
<pre>// void: function doesn't return a meaningful value
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
        q: 'How to handle null/undefined safely in TypeScript?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>With <code>strictNullChecks</code> on, <code>null</code> and <code>undefined</code> are separate types and cannot slip into a <code>string</code>, which prevents many crashes from reading properties of undefined. The main tools are optional chaining <code>?.</code> and nullish coalescing <code>??</code>, and it helps to remember that <code>??</code> only falls back on null or undefined, while <code>||</code> also falls back on empty string and zero. The non-null assertion <code>!</code> silently removes this safety, so narrowing with a guard or handling the null case directly is better.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Khi bật <code>strictNullChecks</code>, <code>null</code> và <code>undefined</code> trở thành hai type riêng, không thể lén gán vào một biến kiểu <code>string</code> được nữa. Nhờ vậy tránh được rất nhiều lỗi kiểu "cannot read property of undefined". Hai công cụ chính là optional chaining <code>?.</code> và nullish coalescing <code>??</code>. Cần phân biệt rõ: <code>??</code> chỉ dùng giá trị mặc định khi gặp null hoặc undefined, còn <code>||</code> thì cả chuỗi rỗng và số 0 cũng bị thay bằng giá trị mặc định, dễ gây bug ngầm. Còn non-null assertion <code>!</code> thì chỉ là cách "bịt miệng" compiler, nó không hề kiểm tra gì lúc chạy, nên tốt hơn là narrow bằng guard hoặc xử lý hẳn trường hợp null.</p></details>
<pre>// strictNullChecks: null and undefined are distinct types
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
        a: `<div class="interview-answer"><p>TypeScript has type assertions, not casts, because nothing changes at runtime and the assertion only tells the compiler to trust the value. This makes <code>as</code> risky, since a wrong assertion causes a runtime crash with no warning, and a double assertion through <code>unknown</code> bypasses all checks. It is best treated as a last resort. Safer alternatives are a real type guard when runtime safety is needed, and <code>satisfies</code> when the goal is to validate a literal against a type without widening it.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Trong TypeScript chỉ có type assertion chứ không có cast thực sự, vì <code>as</code> không làm gì lúc runtime, nó chỉ bảo compiler "cứ tin tôi, giá trị này đúng kiểu này". Chính vì vậy mà <code>as</code> khá nguy hiểm: assert sai thì compiler không cảnh báo gì, và lỗi chỉ lộ ra khi crash lúc chạy. Double assertion qua <code>unknown</code> (<code>x as unknown as Foo</code>) còn tệ hơn vì bỏ qua toàn bộ kiểm tra. Nên coi <code>as</code> là phương án cuối cùng. Thay vào đó, dùng type guard thật khi cần an toàn lúc runtime, và dùng <code>satisfies</code> khi chỉ muốn kiểm tra một literal có khớp type không mà không làm mất đi kiểu chính xác.</p></details>
<p>TypeScript has <strong>type assertions</strong> (not casting). They don't change the runtime value — only tell the compiler "trust me".</p>
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
        q: 'Why does an inline object literal fail type checking when the same object assigned to a variable passes? (Excess property checks)',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>TypeScript is structurally typed, so an object with extra properties is normally assignable, but a fresh object literal passed directly gets an extra excess-property check that flags unknown keys, mainly to catch typos in optional properties. Once that literal is assigned to a variable first, it loses freshness and the check no longer runs, so the same object can pass or fail depending on whether it went through a variable. To keep the safety on a variable, use <code>satisfies</code>, which runs full checking again without widening.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>TypeScript dùng structural typing, nên bình thường một object có thừa vài property vẫn gán được. Nhưng khi bạn truyền thẳng một object literal "tươi" (viết trực tiếp tại chỗ), TypeScript chạy thêm một bước gọi là excess property check để báo lỗi các key lạ, mục đích chính là bắt lỗi gõ sai tên ở các property optional. Nếu object đó được gán vào biến trước rồi mới truyền, nó không còn "tươi" nữa và bước kiểm tra này bị bỏ qua. Đó là lý do cùng một object mà lúc pass lúc fail, chỉ khác nhau ở chỗ có đi qua biến trung gian hay không. Muốn giữ được kiểm tra chặt cho biến thì dùng <code>satisfies</code>, nó kiểm tra đầy đủ lại mà không làm rộng kiểu.</p></details>
<p>TypeScript is <strong>structurally typed</strong>: an object with <strong>more</strong> properties than the target type is normally assignable ("at least these properties"). But <strong>fresh object literals</strong> — literals passed directly to a parameter or annotated variable — get an extra lint-like pass called the <strong>excess property check</strong>: any property not declared in the target type is an error. Once the literal is assigned to a variable, it loses "freshness" and only plain structural compatibility applies.</p>
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
        a: `<div class="interview-answer"><p>Structural typing means compatibility depends on shape, not on the declared name, so two interfaces with the same members are interchangeable, unlike nominal languages such as Java or C#. This causes problems with domain IDs: if <code>userId</code> and <code>orderId</code> are both <code>string</code>, swapping them compiles and can corrupt data. A branded type fixes this by intersecting <code>string</code> with a fake <code>readonly __brand</code> property that does not exist at runtime, with creation funneled through a factory. It has zero runtime cost, and Zod offers the same idea through <code>.brand</code>.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Structural typing nghĩa là hai type tương thích với nhau hay không phụ thuộc vào cấu trúc chứ không phải tên khai báo. Hai interface có cùng thành viên thì dùng thay nhau thoải mái, khác hẳn với ngôn ngữ nominal như Java hay C#. Vấn đề nảy sinh với các ID trong domain: nếu <code>userId</code> và <code>orderId</code> đều là <code>string</code> thì truyền nhầm cái này vào chỗ cái kia vẫn compile ngon lành, và hậu quả có thể là hỏng dữ liệu. Branded type giải quyết bằng cách intersect <code>string</code> với một property giả kiểu <code>readonly __brand</code>, property này chỉ tồn tại ở tầng type chứ không có lúc runtime, và mọi giá trị đều phải tạo qua một hàm factory. Cách này không tốn chi phí runtime, và Zod cũng có sẵn ý tưởng tương tự qua <code>.brand</code>.</p></details>
<p>In a <strong>structural</strong> type system, compatibility is decided by <strong>shape</strong>, not by the name of the declaration. Two unrelated interfaces with identical members are fully interchangeable — unlike Java/C# where the class name (nominal typing) matters.</p>
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

      // ──── 3. GENERICS & ADVANCED TYPES ────
      {
        q: 'What are Generics in TypeScript? Give practical examples.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Generics let one reusable piece of code work with many types while keeping the connection between inputs and outputs, so a function taking <code>T[]</code> returns <code>T</code> instead of <code>any</code>. Using <code>any</code> throws the type away and stops checking, while a generic keeps the real type through the whole signature. It is best to let TypeScript infer the type argument, and to add constraints like <code>K extends keyof T</code> when the code needs to access members safely. A good rule is that a type parameter used only once probably does not need to be generic.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Generics cho phép viết một đoạn code dùng được cho nhiều kiểu khác nhau mà vẫn giữ được mối liên hệ giữa đầu vào và đầu ra. Ví dụ hàm nhận <code>T[]</code> thì trả về <code>T</code>, chứ không phải <code>any</code>. Nếu dùng <code>any</code> thì bạn vứt luôn thông tin kiểu và compiler ngừng kiểm tra, còn generic giữ nguyên kiểu thật xuyên suốt cả signature. Thực tế nên để TypeScript tự suy luận tham số kiểu, và chỉ thêm ràng buộc như <code>K extends keyof T</code> khi bên trong cần truy cập thành viên một cách an toàn. Một mẹo để tự kiểm tra: nếu một tham số kiểu chỉ xuất hiện đúng một lần trong signature thì thường không cần generic ở đó.</p></details>
<p>Generics let you write reusable components that work with <strong>any type</strong> while preserving type safety. Think of a type parameter <code>&lt;T&gt;</code> as a <em>type variable</em>: the caller (or the compiler, via inference) fills it in, and that same <code>T</code> flows through the whole signature so inputs and outputs stay linked.</p>
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
        q: 'Explain TypeScript utility types: Partial, Required, Pick, Omit, Record, Readonly.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Utility types are generic transformers that build one shape from another instead of writing parallel interfaces by hand. Common ones are <code>Omit</code> for a create payload without the <code>id</code>, <code>Partial</code> for an update payload, <code>Pick</code> for a small view, and <code>Record</code> for dictionaries. Deriving from a single source type means renaming a field updates every derived type, which avoids stale duplicates. One caution is that <code>Partial</code> and <code>Readonly</code> are shallow and only affect one level, so nested objects need a recursive <code>DeepPartial</code>.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Utility type là những generic có sẵn giúp bạn tạo type mới từ một type gốc, thay vì viết tay nhiều interface na ná nhau. Các cái hay dùng: <code>Omit</code> để làm payload tạo mới (bỏ <code>id</code>), <code>Partial</code> cho payload cập nhật, <code>Pick</code> khi chỉ cần vài field cho một view nhỏ, và <code>Record</code> cho dictionary. Cái lợi lớn nhất là mọi thứ đều dẫn xuất từ một type nguồn, nên đổi tên một field là toàn bộ type liên quan tự cập nhật theo, không còn cảnh bản sao bị lệch. Lưu ý <code>Partial</code> và <code>Readonly</code> chỉ tác dụng ở tầng ngoài cùng, object lồng bên trong không bị ảnh hưởng, nên khi cần thì phải tự viết một <code>DeepPartial</code> đệ quy.</p></details>
<p>Utility types are built-in <strong>generic type transformers</strong>. Rather than hand-writing a second interface every time you need a variation of a shape — a "create" DTO without the <code>id</code>, an "update" DTO where everything is optional — you <strong>derive</strong> it from one source type. When the base changes, every derived type updates automatically. This is the DRY principle applied to types, and it eliminates the classic bug where a field is renamed in one interface but a stale duplicate lingers.</p>
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
        a: `<div class="interview-answer"><p>Mapped types transform every property of a shape, conditional types are a type-level <code>if</code> written as <code>T extends U ? X : Y</code>, and <code>infer</code> extracts a type from a pattern. Together they power many library types such as <code>ReturnType</code> and <code>Awaited</code>. One subtle point is distribution: a bare type parameter distributes over a union, which is powerful but can cause surprises when testing for <code>never</code>. These tools are useful for computing types from a source of truth, but deeply nested conditionals become hard to read.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mapped type dùng để biến đổi từng property của một type, conditional type là câu lệnh <code>if</code> ở tầng type viết dưới dạng <code>T extends U ? X : Y</code>, còn <code>infer</code> dùng để "bóc" một type ra từ một mẫu cho trước. Kết hợp ba thứ này là nền tảng của rất nhiều type trong thư viện, ví dụ <code>ReturnType</code> hay <code>Awaited</code>. Một điểm dễ gây bất ngờ là tính phân phối (distributive): khi <code>T</code> là tham số kiểu trần và nhận vào một union, conditional type sẽ chạy riêng cho từng thành viên rồi gộp kết quả. Rất mạnh, nhưng hay gây kết quả lạ khi kiểm tra với <code>never</code>. Những công cụ này rất hợp để tính type từ một nguồn duy nhất, nhưng conditional lồng nhau quá sâu thì sẽ khó đọc và khó debug.</p></details>
<pre>// Mapped type: transform properties
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
        q: 'Implement Partial, Pick, and Readonly from scratch, and explain "as" key remapping in mapped types.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Every built-in utility is a one-line mapped type, and writing them shows real understanding of <code>keyof</code>, indexed access, and the <code>+</code> and <code>-</code> modifiers instead of just memorizing an API. <code>Partial</code> adds <code>?</code>, <code>Required</code> uses <code>-?</code> to remove it, and <code>Mutable</code> uses <code>-readonly</code>. Key remapping with <code>as</code> can rename keys, build a getters interface, or filter properties by remapping unwanted keys to <code>never</code>, which is how Prisma and tRPC compute types from a single source. Homomorphic mapped types also preserve the original <code>?</code> and <code>readonly</code> modifiers.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Thực ra mọi utility type có sẵn đều chỉ là một mapped type một dòng. Tự viết lại chúng là cách tốt để chứng tỏ bạn thật sự hiểu <code>keyof</code>, indexed access và hai modifier <code>+</code>/<code>-</code>, chứ không chỉ học thuộc tên API. Cụ thể: <code>Partial</code> thêm dấu <code>?</code> vào mỗi key, <code>Required</code> dùng <code>-?</code> để bỏ nó đi, còn <code>Mutable</code> dùng <code>-readonly</code>. Key remapping với <code>as</code> cho phép đổi tên key (ví dụ sinh ra interface toàn getter dạng <code>getName</code>), hoặc lọc bớt property bằng cách map những key không muốn thành <code>never</code>. Đây chính là cách Prisma và tRPC sinh type từ một nguồn duy nhất. Ngoài ra, homomorphic mapped type (dạng <code>[K in keyof T]</code>) sẽ tự giữ lại các modifier <code>?</code> và <code>readonly</code> của type gốc.</p></details>
<p>Every built-in utility type is a one-line <strong>mapped type</strong> — knowing how to write them shows you understand <code>keyof</code>, indexed access, and modifiers rather than memorizing an API.</p>
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
        q: 'What are distributive conditional types? Why does Exclude work, and when do you need [T] extends [U]?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>A conditional type distributes when the checked type is a bare type parameter, so applied to a union it runs once per member and joins the results. This one rule powers <code>Exclude</code>, <code>Extract</code>, and <code>NonNullable</code>. A common trap is <code>never</code>, which is the empty union, so distributing over it produces nothing, and a naive <code>IsNever</code> check returns <code>never</code> instead of <code>true</code>. The fix is to wrap both sides in a tuple, <code>[T] extends [U]</code>, which turns distribution off and also keeps a union together as a single array type.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Conditional type sẽ "phân phối" khi type được kiểm tra là một tham số kiểu trần (bare type parameter): nếu truyền vào một union, nó sẽ chạy riêng cho từng thành viên rồi gộp kết quả lại thành union mới. Chính quy tắc này là thứ khiến <code>Exclude</code>, <code>Extract</code> và <code>NonNullable</code> hoạt động. Cái bẫy nằm ở <code>never</code>: never được coi là union rỗng, nên phân phối trên nó không cho ra gì cả. Vì thế một type <code>IsNever</code> viết ngây thơ sẽ trả về <code>never</code> thay vì <code>true</code>. Cách xử lý là bọc cả hai vế trong tuple, <code>[T] extends [U]</code>, để tắt tính phân phối đi. Kỹ thuật này cũng dùng khi muốn giữ nguyên một union làm một kiểu mảng duy nhất thay vì bị tách ra.</p></details>
<p>A conditional type <code>T extends U ? X : Y</code> is <strong>distributive</strong> when <code>T</code> is a <strong>naked type parameter</strong>: applied to a union, it runs once per member and unions the results. This single rule is what makes <code>Exclude</code>, <code>Extract</code>, and <code>NonNullable</code> possible.</p>
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
        q: 'What are template literal types in TypeScript?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Template literal types are string building at the type level, where string-literal types are combined by embedding other literal types, and crossing unions produces every combination. They matter because many API strings carry structure, such as event handler names, CSS values, route params, and prefixed keys, and this lets the compiler check and even parse them instead of treating them as plain <code>string</code>. Combined with <code>infer</code>, they can pull data out of a string type, which is how libraries type-check route paths. One caution is combinatorial explosion, since crossing several large unions can exceed the compiler's complexity limit.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Template literal type là cách "ghép chuỗi" ở tầng type: bạn nhúng các literal type vào nhau để tạo ra string literal type mới, và nếu nhúng union thì sẽ ra đủ mọi tổ hợp. Chúng hữu ích vì trong thực tế rất nhiều chuỗi có cấu trúc, ví dụ tên event handler như <code>onClick</code>, giá trị CSS, tham số trong route, hay key có tiền tố. Với template literal type, compiler có thể kiểm tra và thậm chí "parse" những chuỗi đó thay vì coi tất cả là <code>string</code> chung chung. Kết hợp với <code>infer</code>, bạn có thể rút thông tin ra từ một string type, đây là cách các thư viện router kiểm tra kiểu cho đường dẫn. Cần cẩn thận với bùng nổ tổ hợp: ghép vài union lớn với nhau có thể vượt giới hạn của compiler.</p></details>
<p>Template literal types apply JavaScript's backtick-string interpolation <strong>at the type level</strong>: you build new string-literal types by embedding other string-literal types inside a template. When you interpolate a union, TypeScript produces the <strong>cross-product</strong> of every combination — so two 2-member unions expand into four literal types.</p>
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
        q: "Explain 'as const', const assertions, and literal types.",
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>By default TypeScript widens literals because it assumes values may change, so a property is inferred as <code>string</code> instead of its exact value. <code>as const</code> reverses this: it makes the value deeply <code>readonly</code>, narrows each literal to its exact type, and turns arrays into <code>readonly</code> tuples. A common use is as an enum alternative, where an <code>as const</code> object plus <code>typeof OBJ[keyof typeof OBJ]</code> gives runtime values and a precise literal union with no generated code. One caution is that the result is deeply <code>readonly</code>, so it must be copied before passing where a mutable array is expected.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mặc định TypeScript sẽ "làm rộng" (widen) các literal, vì nó cho rằng giá trị có thể bị thay đổi sau này. Vì thế <code>{ color: 'red' }</code> được suy ra là <code>{ color: string }</code> chứ không phải <code>'red'</code>. <code>as const</code> đảo ngược chuyện đó: toàn bộ giá trị thành <code>readonly</code> sâu, từng literal giữ đúng kiểu chính xác của nó, và mảng trở thành tuple <code>readonly</code>. Ứng dụng phổ biến nhất là thay thế enum: một object <code>as const</code> kết hợp với <code>typeof OBJ[keyof typeof OBJ]</code> cho bạn vừa giá trị dùng lúc runtime vừa một union literal chính xác, mà không sinh thêm một dòng code nào. Lưu ý vì kết quả là <code>readonly</code> sâu nên khi cần truyền vào chỗ nhận mảng thường thì phải copy ra trước.</p></details>
<p>By default TypeScript <strong>widens</strong> literal values to their general type, because it assumes most values are meant to change: a mutable object property or array element is inferred as <code>string</code> / <code>string[]</code> rather than the exact literal you wrote. <code>as const</code> is a <strong>const assertion</strong> that tells the compiler the opposite — "this value is fully immutable, keep the most specific type possible." It does three things at once: narrows every literal to its exact value, marks every property <code>readonly</code>, and turns arrays into <code>readonly</code> tuples.</p>
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
        q: 'What is the satisfies operator in TypeScript (4.9+)?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p><code>satisfies</code> checks that a value matches a type without widening it, so it gives the checking of an annotation plus the precise inferred type. A common case is a config or palette object, where an explicit <code>Record</code> annotation loses the specific per-key types, but <code>satisfies</code> keeps them, knowing <code>red</code> is a number array and <code>green</code> is a string while still catching misspelled keys. It fixes the old habit of putting <code>as</code> on object literals, which just misleads the compiler. A good rule is to reach for <code>satisfies</code> before <code>as</code>.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>satisfies</code> kiểm tra xem một giá trị có khớp với một type hay không nhưng không làm rộng kiểu của nó. Nói cách khác, bạn có được sự kiểm tra của annotation mà vẫn giữ được kiểu suy luận chính xác. Ví dụ điển hình là object config hay bảng màu: nếu khai báo <code>Record&lt;string, string | number[]&gt;</code> thì compiler quên mất từng key cụ thể có kiểu gì, còn với <code>satisfies</code> nó vẫn biết <code>red</code> là mảng số và <code>green</code> là chuỗi, đồng thời vẫn báo lỗi nếu gõ sai tên key. Nó cũng thay thế thói quen cũ là gắn <code>as</code> lên object literal, cách này thực chất chỉ là đánh lừa compiler. Quy tắc đơn giản: cần <code>as</code> thì thử <code>satisfies</code> trước.</p></details>
<p><code>satisfies</code> validates that an expression matches a type WITHOUT widening it. You get both type safety AND precise inference.</p>
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

      // ──── 4. CLASSES, ENUMS & DECORATORS ────
      {
        q: 'What is the difference between extends and implements in TypeScript?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><code>extends</code> means inheritance and provides the implementation, or in generics it constrains a type parameter, while <code>implements</code> is a promise to satisfy a contract where every member must be provided. A class can extend only one class but implement many interfaces, which is how TypeScript handles single inheritance. Using <code>implements</code> against small interfaces gives flexibility, while <code>extends</code> fits genuine shared code. Note that <code>implements</code> adds no code and is only a compile-time check that the shape matches.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>extends</code> là kế thừa: class con nhận luôn phần cài đặt của class cha. Trong generic thì <code>extends</code> lại mang nghĩa ràng buộc tham số kiểu. Còn <code>implements</code> là cam kết tuân theo một contract: class phải tự cung cấp đầy đủ mọi thành viên mà interface yêu cầu. Một class chỉ được extends một class, nhưng có thể implements nhiều interface, đó là cách TypeScript làm việc với kế thừa đơn. Về mặt thiết kế, implements các interface nhỏ giúp code linh hoạt hơn, còn extends chỉ nên dùng khi thật sự có code chung cần chia sẻ. Cũng nên nhớ <code>implements</code> không sinh ra code gì cả, nó chỉ là kiểm tra lúc compile xem class có đúng "hình dáng" không.</p></details>
<ul>
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
        q: 'What are enums in TypeScript? What are the alternatives?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Enums are one of the few TypeScript features that produce runtime code, and they are often avoided. Numeric enums add a reverse mapping that increases size and, before TS 5.0, accepted any number. <code>const enum</code> inlines values and breaks single-file transpilers like Babel and esbuild. Better defaults are a union of string literals for simple cases, or an <code>as const</code> object when both the runtime value and the type are needed, since both use plain JavaScript and tree-shake well.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Enum là một trong số ít tính năng của TypeScript có sinh ra code JavaScript lúc chạy, và nhiều team hiện nay tránh dùng. Numeric enum còn tạo thêm reverse mapping (từ số ngược về tên) khiến output nặng hơn, và trước TS 5.0 nó còn chấp nhận bất kỳ số nào gán vào. <code>const enum</code> thì inline giá trị ngay chỗ gọi, nhưng cách này làm hỏng các transpiler xử lý từng file như Babel hay esbuild. Lựa chọn mặc định tốt hơn là union các string literal cho trường hợp đơn giản, hoặc object <code>as const</code> khi cần cả giá trị lúc runtime lẫn type. Cả hai đều là JavaScript thuần và tree-shake tốt.</p></details>
<pre>// Numeric enum
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
        q: 'What are the pitfalls of numeric enums and const enums that make senior engineers avoid them?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Three concrete problems make enums worth avoiding. Numeric enums add a reverse mapping, so <code>Object.keys</code> returns double the entries and the bundle carries extra weight. Before TS 5.0, a numeric enum accepted any number at all, which is unsafe for values coming from JSON. And <code>const enum</code> inlines at the call site, which needs whole-program information, so it breaks single-file transpilers like Babel, esbuild, and swc and ties library users to the compiler settings. Better options are string-literal unions or an <code>as const</code> object, which use plain JavaScript and tree-shake well.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Có ba vấn đề cụ thể khiến các senior thường tránh enum. Thứ nhất, numeric enum sinh ra reverse mapping, nên <code>Object.keys</code> trả về gấp đôi số phần tử và bundle nặng thêm không cần thiết. Thứ hai, trước TS 5.0 numeric enum chấp nhận bất kỳ số nào, nên dữ liệu từ JSON gán vào enum không hề được kiểm tra. Thứ ba, <code>const enum</code> inline giá trị tại chỗ gọi, việc này cần thông tin của toàn bộ chương trình, nên các transpiler xử lý từng file như Babel, esbuild, swc không làm được, và người dùng thư viện của bạn cũng bị phụ thuộc vào thiết lập compiler. Thay thế tốt hơn là union string literal hoặc object <code>as const</code>, vì chúng chỉ là JavaScript thuần và tree-shake tốt.</p></details>
<p>Enums are one of TypeScript's few features that generate runtime code with surprising semantics — three concrete traps come up in real codebases:</p>
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
        q: 'What are decorators in TypeScript?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Decorators are functions that annotate and modify classes, methods, or properties, and they are central to NestJS, Angular, and TypeORM. There are two versions: the legacy <code>experimentalDecorators</code> form those frameworks still use, and the Stage 3 standard decorators native in TS 5.0, and their shapes differ. The first thing to check is which version a codebase uses, since the signatures are not the same. They fit cross-cutting concerns like logging or route metadata, but they add hidden behavior, so the logic inside should stay simple.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Decorator là các hàm dùng để gắn thêm metadata hoặc sửa hành vi của class, method, property, và là nền tảng của NestJS, Angular, TypeORM. Hiện có hai phiên bản: dạng cũ bật bằng <code>experimentalDecorators</code> mà các framework kể trên vẫn dùng, và dạng chuẩn Stage 3 được hỗ trợ native từ TS 5.0. Signature của hai dạng khác nhau, nên việc đầu tiên khi vào một codebase là xem nó đang dùng dạng nào. Decorator hợp với các mối quan tâm xuyên suốt như logging hay metadata cho route, nhưng vì chúng thêm hành vi ẩn vào code nên logic bên trong decorator nên giữ càng đơn giản càng tốt.</p></details>
<p>Decorators are functions that modify classes, methods, properties, or parameters. Stage 3 proposal (native in TS 5.0+).</p>
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

      // ──── 5. MODULES & DECLARATION MERGING ────
      {
        q: 'Explain TypeScript module augmentation and declaration merging.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Declaration merging is the rule that two interfaces with the same name combine into one, and module augmentation applies this to third-party or global types, such as adding a <code>user</code> property to Express's <code>Request</code> so it is typed in all middleware. This only works with <code>interface</code> and <code>namespace</code>, never with <code>type</code> aliases, which is a main reason to prefer <code>interface</code> for extensible shapes. Because it is powerful but implicit, augmentations should live in a clearly named <code>.d.ts</code> file so others can find where an added property comes from.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Declaration merging là quy tắc: hai interface cùng tên sẽ tự gộp thành một. Module augmentation là áp dụng quy tắc đó lên type của thư viện bên thứ ba hoặc type toàn cục, ví dụ thêm property <code>user</code> vào <code>Request</code> của Express để mọi middleware đều có type cho nó. Cơ chế này chỉ hoạt động với <code>interface</code> và <code>namespace</code>, không áp dụng cho <code>type</code> alias, đây là một lý do lớn để ưu tiên interface cho những type muốn cho phép mở rộng. Vì nó mạnh nhưng hoạt động ngầm, nên gom các augmentation vào một file <code>.d.ts</code> đặt tên rõ ràng, để người khác biết property "từ đâu chui ra".</p></details>
<pre>// Declaration merging: same interface name = merged
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

      // ──── 6. WHERE THE TYPE SYSTEM IS UNSOUND ────
      {
        q: 'Where is TypeScript deliberately unsound? Explain method bivariance and array covariance.',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>TypeScript trades soundness for ease of use, so strict mode is not a proof and several holes exist. One is that method-shorthand parameters stay bivariant even under <code>strictFunctionTypes</code>, while only function-property syntax is checked strictly, so a loosely typed callback can receive the wrong event and crash. Another is array covariance, where a <code>Dog[]</code> is assignable to an <code>Animal[]</code> even though a <code>Cat</code> could then be pushed and cause a runtime error. The main defenses are using function-property syntax for callbacks, accepting <code>readonly T[]</code> for inputs, and validating data at trust boundaries.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>TypeScript chấp nhận hy sinh một phần tính đúng đắn (soundness) để dễ dùng hơn, nên kể cả bật strict mode thì vẫn còn vài lỗ hổng. Lỗ hổng thứ nhất là method bivariance: tham số của method viết dạng shorthand (<code>on(e: MouseEvent): void</code>) vẫn được kiểm tra lỏng (bivariant) ngay cả khi bật <code>strictFunctionTypes</code>, chỉ có cú pháp function property (<code>on: (e: MouseEvent) =&gt; void</code>) mới được kiểm tra chặt. Hậu quả là một callback có thể nhận nhầm loại event và crash. Lỗ hổng thứ hai là array covariance: <code>Dog[]</code> gán được vào <code>Animal[]</code>, rồi sau đó ai đó push một <code>Cat</code> vào và lỗi chỉ lộ ra lúc chạy. Cách phòng vệ: dùng cú pháp function property cho callback, nhận <code>readonly T[]</code> làm tham số đầu vào, và luôn validate dữ liệu ở các ranh giới tin cậy.</p></details>
<p>TypeScript trades soundness for ergonomics in a few documented places — a program can typecheck and still crash with a type error at runtime. Seniors are expected to know the holes so <code>strict</code> mode isn't mistaken for a proof.</p>
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
