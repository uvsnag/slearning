// Interview data: additional questions to fill gaps in existing topics
// Covers: Next.js, React advanced patterns, JavaScript advanced, Java concurrency, Spring Boot advanced
(function () {
  (window.__pvTopics = window.__pvTopics || []).push(
    // ───────────────────────── NEXT.JS ─────────────────────────
    {
      id: 'nextjs',
      name: 'Next.js',
      icon: '▲',
      questions: [
        {
          q: 'What is Next.js and how is it different from Create React App?',
          difficulty: 'easy',
          a: `<ul>
<li><strong>CRA</strong>: client-side only SPA. No SSR, no routing built-in, no API routes.</li>
<li><strong>Next.js</strong>: full-stack React framework with SSR, SSG, ISR, API routes, file-based routing, middleware, and built-in optimizations.</li>
</ul>
<table><tr><th>Feature</th><th>CRA</th><th>Next.js</th></tr>
<tr><td>Rendering</td><td>CSR only</td><td>CSR, SSR, SSG, ISR</td></tr>
<tr><td>Routing</td><td>Manual (react-router)</td><td>File-based</td></tr>
<tr><td>API routes</td><td>No</td><td>Yes (API routes / Route Handlers)</td></tr>
<tr><td>SEO</td><td>Poor (empty HTML)</td><td>Excellent (pre-rendered)</td></tr>
<tr><td>Code splitting</td><td>Manual</td><td>Automatic per page</td></tr>
<tr><td>Image optimization</td><td>Manual</td><td>Built-in (next/image)</td></tr>
</table>
<div class="key-point">Next.js is the standard for production React apps. CRA is deprecated (React team now recommends frameworks like Next.js).</div>`,
        },
        {
          q: 'Explain the difference between App Router and Pages Router in Next.js.',
          difficulty: 'medium',
          a: `<pre>// Pages Router (legacy, still supported):
pages/
  index.js         → /
  about.js         → /about
  users/[id].js    → /users/123
  api/users.js     → /api/users (API route)

// App Router (Next.js 13+, recommended):
app/
  page.tsx          → /
  layout.tsx        → shared layout
  about/page.tsx    → /about
  users/[id]/page.tsx → /users/123
  api/users/route.ts  → /api/users (Route Handler)
  loading.tsx       → loading UI (Suspense)
  error.tsx         → error boundary
  not-found.tsx     → 404 page</pre>
<p><strong>Key differences:</strong></p>
<ul>
<li>App Router uses <strong>React Server Components</strong> by default.</li>
<li>App Router has <strong>nested layouts</strong> (don't re-render on navigation).</li>
<li>App Router uses <strong>loading.tsx / error.tsx</strong> for built-in Suspense and error boundaries.</li>
<li>Data fetching: Pages Router uses <code>getServerSideProps</code> / <code>getStaticProps</code>. App Router uses <code>async</code> server components or <code>fetch()</code> with caching.</li>
</ul>
<div class="key-point">New projects should use App Router. Pages Router is still supported but won't get new features.</div>`,
        },
        {
          q: 'What are the rendering strategies in Next.js? SSR, SSG, ISR, CSR.',
          difficulty: 'hard',
          a: `<ul>
<li><strong>SSR (Server-Side Rendering)</strong>: HTML generated on every request. Dynamic, but slower. Good for personalized/real-time pages.</li>
<li><strong>SSG (Static Site Generation)</strong>: HTML generated at build time. Fastest. Good for blogs, docs, marketing pages.</li>
<li><strong>ISR (Incremental Static Regeneration)</strong>: SSG + revalidation after a time period. Best of both worlds.</li>
<li><strong>CSR (Client-Side Rendering)</strong>: No server rendering. Data fetched in browser. Use for highly interactive dashboards.</li>
</ul>
<pre>// App Router — data fetching with caching controls the strategy:

// SSG (cached forever until revalidate)
async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'force-cache'  // default — static
  });
}

// SSR (no cache — fresh every request)
async function Page() {
  const data = await fetch('https://api.example.com/data', {
    cache: 'no-store'  // dynamic — SSR
  });
}

// ISR (revalidate every 60 seconds)
async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 60 }
  });
}

// CSR (client component with useEffect)
'use client';
function Page() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch('/api/data').then(...); }, []);
}</pre>
<div class="key-point">In App Router, the rendering strategy is determined by how you fetch data (cache options), not by which function you export (unlike Pages Router).</div>`,
        },
        {
          q: "What is the difference between 'use client' and 'use server' in Next.js?",
          difficulty: 'medium',
          a: `<ul>
<li><code>'use client'</code>: marks a component as a <strong>Client Component</strong>. Runs in the browser. Can use hooks, event handlers, browser APIs.</li>
<li><code>'use server'</code>: marks a function as a <strong>Server Action</strong>. Runs on the server. Can access DB, file system, secrets directly.</li>
</ul>
<pre>// Server Component (default — no directive needed)
async function UserList() {
  const users = await db.query('SELECT * FROM users'); // direct DB access!
  return &lt;ul&gt;{users.map(u => &lt;li&gt;{u.name}&lt;/li&gt;)}&lt;/ul&gt;;
}

// Client Component
'use client';
function SearchBar() {
  const [query, setQuery] = useState('');
  return &lt;input value={query} onChange={e => setQuery(e.target.value)} /&gt;;
}

// Server Action
'use server';
async function createUser(formData: FormData) {
  const name = formData.get('name');
  await db.query('INSERT INTO users (name) VALUES ($1)', [name]);
  revalidatePath('/users');
}

// Using Server Action from Client Component
'use client';
function Form() {
  return &lt;form action={createUser}&gt;
    &lt;input name="name" /&gt;
    &lt;button type="submit"&gt;Create&lt;/button&gt;
  &lt;/form&gt;;
}</pre>
<div class="key-point">Keep components as Server Components by default. Only add <code>'use client'</code> when you need interactivity (hooks, events). This minimizes the client bundle.</div>`,
        },
        {
          q: 'How does Next.js handle routing? Explain dynamic routes, catch-all, and parallel routes.',
          difficulty: 'medium',
          a: `<pre>// File-based routing (App Router):
app/
  page.tsx              → /
  about/page.tsx        → /about
  blog/[slug]/page.tsx  → /blog/my-post (dynamic)
  shop/[...slug]/page.tsx → /shop/a/b/c (catch-all)
  docs/[[...slug]]/page.tsx → /docs or /docs/a/b (optional catch-all)

// Route groups (organize without affecting URL):
app/
  (marketing)/
    about/page.tsx     → /about (no /marketing in URL)
  (dashboard)/
    settings/page.tsx  → /settings

// Parallel routes (multiple pages in same layout):
app/
  @modal/
    login/page.tsx     → rendered alongside main page
  layout.tsx           → receives both children and @modal

// Intercepting routes (modals without navigation):
app/
  feed/page.tsx
  feed/(.)photo/[id]/page.tsx  → intercepts /photo/[id] when navigating from feed</pre>
<p><strong>Dynamic route params:</strong></p>
<pre>// app/users/[id]/page.tsx
export default function UserPage({ params }: { params: { id: string } }) {
  return &lt;h1&gt;User {params.id}&lt;/h1&gt;;
}

// Generate static paths at build time
export async function generateStaticParams() {
  const users = await fetchUsers();
  return users.map(u => ({ id: String(u.id) }));
}</pre>
<div class="key-point">Route groups <code>(groupName)</code> let you organize code without changing URLs. Parallel routes <code>@slotName</code> enable complex layouts like modals and split views.</div>`,
        },
        {
          q: 'What is Next.js Middleware? Give practical examples.',
          difficulty: 'hard',
          a: `<p>Middleware runs <strong>before</strong> every request, at the edge. Use it for authentication, redirects, A/B testing, and geolocation.</p>
<pre>// middleware.ts (root of project)
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Authentication check
  const token = request.cookies.get('auth-token');
  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Geolocation-based redirect
  const country = request.geo?.country;
  if (country === 'VN' && !pathname.startsWith('/vn')) {
    return NextResponse.redirect(new URL('/vn' + pathname, request.url));
  }

  // 3. A/B testing
  const bucket = request.cookies.get('ab-bucket') || Math.random() > 0.5 ? 'A' : 'B';
  const response = NextResponse.next();
  response.cookies.set('ab-bucket', bucket);

  // 4. Add headers
  response.headers.set('x-request-id', crypto.randomUUID());

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],  // skip API and static files
};</pre>
<div class="key-point">Middleware runs at the Edge (very fast, limited APIs). Don't do heavy computation or DB queries in middleware — only lightweight checks and redirects.</div>`,
        },
        {
          q: 'How does static export work in Next.js? What are the limitations?',
          difficulty: 'medium',
          a: `<p>Static export generates a fully static site (HTML/CSS/JS) that can be hosted anywhere (GitHub Pages, S3, Nginx).</p>
<pre>// next.config.ts
const nextConfig = {
  output: 'export',      // enable static export
  images: {
    unoptimized: true,   // required: no image optimization server
  },
};

// Build: npm run build → generates 'out/' directory
// Deploy: upload 'out/' to any static hosting</pre>
<p><strong>Limitations (no server features):</strong></p>
<ul>
<li>No Server Components (everything becomes client)</li>
<li>No API Routes / Route Handlers</li>
<li>No SSR (no <code>cache: 'no-store'</code>)</li>
<li>No ISR (no revalidation)</li>
<li>No Middleware</li>
<li>No next/image optimization (use <code>unoptimized: true</code>)</li>
<li>Dynamic routes need <code>generateStaticParams</code></li>
</ul>
<div class="key-point">Static export is ideal for documentation sites, portfolios, and apps that run entirely in the browser (like SLearning Studio). All dynamic behavior must happen client-side.</div>`,
        },
        {
          q: 'What is next/image and why should you use it?',
          difficulty: 'easy',
          a: `<pre>import Image from 'next/image';

// Automatic optimization
&lt;Image
  src="/hero.jpg"
  alt="Hero"
  width={800}
  height={400}
  priority          // preload for LCP image
  placeholder="blur" // show blur while loading
/&gt;

// Responsive
&lt;Image
  src="/photo.jpg"
  alt="Photo"
  fill              // fills parent container
  sizes="(max-width: 768px) 100vw, 50vw"
  style={{ objectFit: 'cover' }}
/&gt;</pre>
<p><strong>Benefits over &lt;img&gt;:</strong></p>
<ul>
<li>Automatic format conversion (WebP/AVIF)</li>
<li>Automatic resizing based on device</li>
<li>Lazy loading by default</li>
<li>Prevents layout shift (requires width/height)</li>
<li>Blur placeholder while loading</li>
</ul>
<div class="key-point">Always use <code>next/image</code> for images in Next.js. It can reduce image sizes by 50-80% with zero effort. Use <code>priority</code> for above-the-fold images.</div>`,
        },
      ],
    },

    // ───────────────────────── ADDITIONAL REACT QUESTIONS ─────────────────────────
    {
      id: 'react-advanced',
      name: 'React Advanced',
      icon: '⚛️+',
      questions: [
        {
          q: 'What is React.forwardRef and when do you need it?',
          difficulty: 'hard',
          a: `<p><code>forwardRef</code> lets you pass a <code>ref</code> through a component to a child DOM element.</p>
<pre>// Without forwardRef — ref doesn't work on custom components
const Input = ({ placeholder }) => &lt;input placeholder={placeholder} /&gt;;
const ref = useRef();
&lt;Input ref={ref} /&gt;; // ❌ Warning: ref not forwarded

// With forwardRef
const Input = React.forwardRef(({ placeholder }, ref) => (
  &lt;input ref={ref} placeholder={placeholder} /&gt;
));
const ref = useRef();
&lt;Input ref={ref} /&gt;; // ✅ ref points to &lt;input&gt; DOM element
ref.current.focus();  // works!

// useImperativeHandle: expose custom API via ref
const FancyInput = React.forwardRef((props, ref) => {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = ''; },
  }));
  return &lt;input ref={inputRef} /&gt;;
});</pre>
<div class="key-point">Use <code>forwardRef</code> when building reusable UI components (inputs, buttons) that consumers need to access the underlying DOM element. Required for React.memo + ref.</div>`,
        },
        {
          q: 'What is React Suspense and how does it work with data fetching?',
          difficulty: 'hard',
          a: `<pre>// 1. Suspense for lazy loading (stable)
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
function App() {
  return (
    &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
      &lt;HeavyComponent /&gt;
    &lt;/Suspense&gt;
  );
}

// 2. Suspense for data fetching (React 18+ with frameworks)
// Next.js App Router: async server components + Suspense
async function UserProfile({ id }) {
  const user = await fetchUser(id); // suspends until data ready
  return &lt;h1&gt;{user.name}&lt;/h1&gt;;
}

function Page() {
  return (
    &lt;Suspense fallback={&lt;Skeleton /&gt;}&gt;
      &lt;UserProfile id={1} /&gt;  {/* shows Skeleton while fetching */}
    &lt;/Suspense&gt;
  );
}

// 3. Nested Suspense boundaries
&lt;Suspense fallback={&lt;PageSkeleton /&gt;}&gt;
  &lt;Header /&gt;
  &lt;Suspense fallback={&lt;SidebarSkeleton /&gt;}&gt;
    &lt;Sidebar /&gt;  {/* independent loading */}
  &lt;/Suspense&gt;
  &lt;Suspense fallback={&lt;ContentSkeleton /&gt;}&gt;
    &lt;MainContent /&gt;  {/* independent loading */}
  &lt;/Suspense&gt;
&lt;/Suspense&gt;</pre>
<div class="key-point">Suspense lets you show fallback UI while async content loads. Nest Suspense boundaries to load different parts of the page independently (progressive loading).</div>`,
        },
        {
          q: 'What is the React Compiler (React Forget)?',
          difficulty: 'hard',
          a: `<p>The <strong>React Compiler</strong> (formerly React Forget) automatically memoizes components and values — eliminating the need for manual <code>useMemo</code>, <code>useCallback</code>, and <code>React.memo</code>.</p>
<pre>// Before React Compiler (manual optimization):
function ProductList({ products, onSelect }) {
  const sorted = useMemo(
    () => products.sort((a, b) => a.name.localeCompare(b.name)),
    [products]
  );
  const handleClick = useCallback(
    (id) => onSelect(id),
    [onSelect]
  );
  return sorted.map(p =>
    &lt;MemoizedProduct key={p.id} product={p} onClick={handleClick} /&gt;
  );
}
const MemoizedProduct = React.memo(Product);

// After React Compiler (automatic):
function ProductList({ products, onSelect }) {
  const sorted = products.sort((a, b) => a.name.localeCompare(b.name));
  const handleClick = (id) => onSelect(id);
  return sorted.map(p =>
    &lt;Product key={p.id} product={p} onClick={handleClick} /&gt;
  );
}
// Compiler automatically detects what needs memoization!</pre>
<div class="key-point">The React Compiler is already used in production at Meta (Instagram). It removes the cognitive burden of manual memoization while achieving equal or better performance.</div>`,
        },
        {
          q: 'What is the difference between client-side and server-side rendering in React?',
          difficulty: 'medium',
          a: `<table><tr><th>Aspect</th><th>CSR (Client-Side)</th><th>SSR (Server-Side)</th></tr>
<tr><td>Where rendered</td><td>Browser</td><td>Server (Node.js)</td></tr>
<tr><td>First paint</td><td>Slow (download JS first)</td><td>Fast (HTML ready)</td></tr>
<tr><td>SEO</td><td>Poor (empty HTML)</td><td>Excellent (full HTML)</td></tr>
<tr><td>Interactivity</td><td>Immediate after load</td><td>After hydration</td></tr>
<tr><td>Server load</td><td>Low (static files)</td><td>Higher (render per request)</td></tr>
</table>
<pre>// CSR: empty HTML → browser downloads JS → renders UI
&lt;div id="root"&gt;&lt;/div&gt;  ← user sees blank page until JS loads

// SSR: server sends full HTML → browser shows content → hydration adds interactivity
&lt;div id="root"&gt;
  &lt;h1&gt;Hello World&lt;/h1&gt;   ← user sees content immediately
  &lt;button&gt;Click me&lt;/button&gt;
&lt;/div&gt;</pre>
<p><strong>Hydration</strong>: the process where React attaches event listeners to server-rendered HTML, making it interactive.</p>
<div class="key-point">SSR improves First Contentful Paint (FCP) and SEO. But there's a gap between seeing content and being able to interact (hydration delay). React Server Components solve this by never hydrating server-only components.</div>`,
        },
        {
          q: 'What are React portals and when would you use them?',
          difficulty: 'medium',
          a: `<p><strong>Portals</strong> render a child component into a different DOM node, outside its parent hierarchy.</p>
<pre>import { createPortal } from 'react-dom';

function Modal({ children, isOpen }) {
  if (!isOpen) return null;
  return createPortal(
    &lt;div className="modal-overlay"&gt;
      &lt;div className="modal-content"&gt;
        {children}
      &lt;/div&gt;
    &lt;/div&gt;,
    document.getElementById('modal-root')  // render here instead!
  );
}

// HTML:
// &lt;div id="root"&gt;...app...&lt;/div&gt;
// &lt;div id="modal-root"&gt;...modal renders here...&lt;/div&gt;</pre>
<p><strong>Use cases:</strong></p>
<ul>
<li><strong>Modals/dialogs</strong>: avoid z-index and overflow issues from parent</li>
<li><strong>Tooltips/popovers</strong>: render at body level for correct positioning</li>
<li><strong>Notifications/toasts</strong>: global notification layer</li>
</ul>
<div class="key-point">Portal children still behave as React children (events bubble through the React tree, not the DOM tree). Only the DOM placement changes.</div>`,
        },
        {
          q: 'How do you handle global state without a library? (useContext + useReducer pattern)',
          difficulty: 'medium',
          a: `<pre>// 1. Define types and reducer
type State = { user: User | null; theme: 'light' | 'dark' };
type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'TOGGLE_THEME' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_USER': return { ...state, user: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    default: return state;
  }
}

// 2. Create context
const AppContext = createContext&lt;{
  state: State;
  dispatch: React.Dispatch&lt;Action&gt;;
} | null&gt;(null);

// 3. Provider
function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { user: null, theme: 'light' });
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return &lt;AppContext.Provider value={value}&gt;{children}&lt;/AppContext.Provider&gt;;
}

// 4. Custom hook
function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

// 5. Usage
function Header() {
  const { state, dispatch } = useApp();
  return &lt;button onClick={() => dispatch({ type: 'TOGGLE_THEME' })}&gt;
    {state.theme}
  &lt;/button&gt;;
}</pre>
<div class="key-point">This pattern works for small-medium apps. For larger apps, Context re-renders all consumers on any state change — switch to Zustand or split into multiple contexts.</div>`,
        },
      ],
    },

    // ───────────────────────── ADDITIONAL JAVASCRIPT GAPS ─────────────────────────
    {
      id: 'js-advanced',
      name: 'JS Advanced',
      icon: '🟨+',
      questions: [
        {
          q: 'What is the difference between Promise.all, Promise.allSettled, Promise.race, and Promise.any?',
          difficulty: 'hard',
          a: `<pre>const p1 = Promise.resolve(1);
const p2 = Promise.reject('error');
const p3 = Promise.resolve(3);

// Promise.all: ALL must succeed. Rejects on FIRST failure.
Promise.all([p1, p2, p3])
  .catch(err => err);  // 'error' (fast-fail)

// Promise.allSettled: Wait for ALL (success or failure). Never rejects.
Promise.allSettled([p1, p2, p3])
  .then(results => results);
  // [{ status: 'fulfilled', value: 1 },
  //  { status: 'rejected', reason: 'error' },
  //  { status: 'fulfilled', value: 3 }]

// Promise.race: Returns FIRST settled (success OR failure).
Promise.race([
  fetch('/fast-api'),    // resolves in 100ms → wins!
  fetch('/slow-api'),    // resolves in 500ms
]);

// Promise.any: Returns FIRST SUCCESS. Ignores rejections.
Promise.any([p2, p1, p3])
  .then(val => val);  // 1 (first success, skips rejection)</pre>
<table><tr><th>Method</th><th>Resolves when</th><th>Rejects when</th></tr>
<tr><td>all</td><td>ALL succeed</td><td>ANY fails (fast-fail)</td></tr>
<tr><td>allSettled</td><td>ALL settle</td><td>Never rejects</td></tr>
<tr><td>race</td><td>FIRST settles</td><td>FIRST settles (if rejection)</td></tr>
<tr><td>any</td><td>FIRST succeeds</td><td>ALL fail (AggregateError)</td></tr>
</table>
<div class="key-point">Use <code>Promise.all</code> when all results are needed. <code>Promise.allSettled</code> when you want all results regardless of failures. <code>Promise.race</code> for timeouts. <code>Promise.any</code> for redundancy (first working API).</div>`,
        },
        {
          q: 'What is the difference between for...in and for...of?',
          difficulty: 'tricky',
          a: `<pre>const arr = ['a', 'b', 'c'];

// for...in: iterates over KEYS (indices for arrays, properties for objects)
for (const key in arr) {
  console.log(key);   // '0', '1', '2' (strings, not numbers!)
}

// for...of: iterates over VALUES (works on iterables: arrays, strings, Maps, Sets)
for (const value of arr) {
  console.log(value); // 'a', 'b', 'c'
}

// for...in on objects (common use case):
const obj = { name: 'John', age: 30 };
for (const key in obj) {
  console.log(key, obj[key]); // 'name' 'John', 'age' 30
}

// ❌ for...of on objects — doesn't work!
for (const value of obj) { } // TypeError: obj is not iterable

// ✅ for...of on objects — use Object.entries():
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value);
}

// Gotcha: for...in includes inherited properties!
arr.customProp = 'oops';
for (const key in arr) { console.log(key); } // '0','1','2','customProp'!
for (const value of arr) { console.log(value); } // 'a','b','c' (no customProp)</pre>
<div class="key-point"><code>for...in</code> = keys/properties (use for objects). <code>for...of</code> = values (use for arrays, strings, iterables). Avoid <code>for...in</code> on arrays — it includes inherited properties.</div>`,
        },
        {
          q: 'What is the Temporal Dead Zone (TDZ)?',
          difficulty: 'tricky',
          a: `<p>The <strong>TDZ</strong> is the period between entering a scope and the variable being declared where <code>let</code>/<code>const</code> variables exist but cannot be accessed.</p>
<pre>// var: hoisted and initialized to undefined — no TDZ
console.log(a); // undefined
var a = 5;

// let/const: hoisted but NOT initialized — TDZ
console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 5;

// TDZ in blocks:
{
  // TDZ starts here for 'x'
  console.log(x); // ReferenceError
  let x = 10;     // TDZ ends here
  console.log(x); // 10
}

// Tricky: TDZ applies to function parameters too
function test(a = b, b = 1) { }
test(); // ReferenceError: 'b' used before initialization

// TDZ with typeof (surprising!)
typeof undeclaredVar;   // 'undefined' (no error — not declared at all)
typeof declaredLet;     // ReferenceError (in TDZ — declared but not initialized)
let declaredLet = 5;</pre>
<div class="key-point">TDZ prevents using variables before they're properly initialized. It catches bugs that <code>var</code>'s hoisting would silently allow. Always declare variables at the top of their scope.</div>`,
        },
        {
          q: 'What is Object.freeze vs Object.seal vs Object.preventExtensions?',
          difficulty: 'medium',
          a: `<pre>const obj = { name: 'John', age: 30 };

// Object.preventExtensions: can't ADD new properties
Object.preventExtensions(obj);
obj.email = 'test';  // ❌ silently fails (or throws in strict mode)
obj.name = 'Jane';   // ✅ can modify existing
delete obj.age;      // ✅ can delete

// Object.seal: can't ADD or DELETE properties
Object.seal(obj);
obj.email = 'test';  // ❌ can't add
delete obj.name;     // ❌ can't delete
obj.name = 'Jane';   // ✅ can modify existing values

// Object.freeze: can't ADD, DELETE, or MODIFY
Object.freeze(obj);
obj.email = 'test';  // ❌ can't add
delete obj.name;     // ❌ can't delete
obj.name = 'Jane';   // ❌ can't modify

// ⚠️ All are SHALLOW!
const nested = { a: { b: 1 } };
Object.freeze(nested);
nested.a.b = 99;     // ✅ works! Nested object is NOT frozen

// Deep freeze:
function deepFreeze(obj) {
  Object.freeze(obj);
  Object.values(obj).forEach(val => {
    if (typeof val === 'object' && val !== null) deepFreeze(val);
  });
  return obj;
}</pre>
<table><tr><th>Feature</th><th>preventExtensions</th><th>seal</th><th>freeze</th></tr>
<tr><td>Add properties</td><td>❌</td><td>❌</td><td>❌</td></tr>
<tr><td>Delete properties</td><td>✅</td><td>❌</td><td>❌</td></tr>
<tr><td>Modify values</td><td>✅</td><td>✅</td><td>❌</td></tr>
</table>
<div class="key-point">All three are <strong>shallow</strong>. Nested objects remain mutable. Use <code>Object.freeze</code> for constants, config objects, and <code>as const</code> in TypeScript.</div>`,
        },
        {
          q: 'What is event loop blocking and how to avoid it?',
          difficulty: 'hard',
          a: `<pre>// ❌ Blocking the event loop (UI freezes, server stops responding)
function heavyComputation() {
  for (let i = 0; i &lt; 10_000_000_000; i++) {
    // CPU-intensive work blocks the single thread
  }
}
heavyComputation(); // Everything stops: no clicks, no rendering, no I/O

// ✅ Solution 1: Break into chunks (setTimeout)
function processChunks(data, chunkSize = 1000) {
  let index = 0;
  function nextChunk() {
    const end = Math.min(index + chunkSize, data.length);
    for (; index &lt; end; index++) {
      process(data[index]);
    }
    if (index &lt; data.length) {
      setTimeout(nextChunk, 0); // yield to event loop
    }
  }
  nextChunk();
}

// ✅ Solution 2: Web Workers (browser) / Worker Threads (Node.js)
const worker = new Worker('heavy-task.js');
worker.postMessage(data);
worker.onmessage = (e) => console.log('Result:', e.data);

// ✅ Solution 3: requestIdleCallback (browser)
requestIdleCallback((deadline) => {
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    processTask(tasks.pop());
  }
});</pre>
<div class="key-point">JavaScript is single-threaded. CPU-intensive work blocks everything. Use Web Workers for heavy computation, <code>setTimeout(fn, 0)</code> to yield control, or <code>requestIdleCallback</code> for low-priority work.</div>`,
        },
        {
          q: 'What is a Memory Leak in JavaScript? Common causes and how to detect them.',
          difficulty: 'hard',
          a: `<pre>// Common causes of memory leaks:

// 1. Forgotten event listeners
element.addEventListener('click', handler);
// element removed from DOM but listener still holds reference!
// Fix: element.removeEventListener('click', handler);

// 2. Forgotten timers/intervals
const id = setInterval(() => {
  // references data that should be garbage collected
}, 1000);
// Fix: clearInterval(id);

// 3. Closures holding references
function createLeak() {
  const hugeArray = new Array(1000000).fill('data');
  return function() {
    console.log(hugeArray.length); // closure keeps hugeArray alive!
  };
}

// 4. Detached DOM nodes
const nodes = [];
function addNode() {
  const div = document.createElement('div');
  document.body.appendChild(div);
  nodes.push(div);      // reference kept even after removal
  document.body.removeChild(div); // removed from DOM but not from array!
}

// 5. Global variables
function leak() {
  accidentalGlobal = 'oops'; // no var/let/const → global!
}

// React-specific: missing cleanup in useEffect
useEffect(() => {
  const subscription = subscribe();
  // ❌ Missing cleanup → leak!
  return () => subscription.unsubscribe(); // ✅ Fix
}, []);</pre>
<p><strong>Detection:</strong> Chrome DevTools → Memory tab → Heap snapshots → Compare before/after to find growing objects.</p>
<div class="key-point">In React, the most common leak is forgetting to clean up in <code>useEffect</code>: subscriptions, intervals, event listeners, and AbortControllers for fetch requests.</div>`,
        },
      ],
    },

    // ───────────────────────── WEB PERFORMANCE ─────────────────────────
    {
      id: 'web-performance',
      name: 'Web Performance',
      icon: '🚀',
      questions: [
        {
          q: 'What are Core Web Vitals? Explain LCP, FID, CLS.',
          difficulty: 'medium',
          a: `<p><strong>Core Web Vitals</strong> are Google's metrics for measuring real-world user experience:</p>
<ul>
<li><strong>LCP (Largest Contentful Paint)</strong>: Time until the largest visible element renders. Target: &lt;2.5s. Affected by: server response time, CSS/JS blocking, image load time.</li>
<li><strong>FID (First Input Delay) → INP (Interaction to Next Paint)</strong>: Time from user interaction to browser response. Target: &lt;200ms. Affected by: heavy JavaScript, long tasks on main thread.</li>
<li><strong>CLS (Cumulative Layout Shift)</strong>: How much the page layout shifts unexpectedly. Target: &lt;0.1. Affected by: images without dimensions, injected content, web fonts.</li>
</ul>
<pre>// Fix LCP: preload critical assets
&lt;link rel="preload" href="hero.webp" as="image" /&gt;
&lt;Image src="/hero.webp" priority /&gt;  // Next.js

// Fix CLS: always set dimensions
&lt;img src="photo.jpg" width="800" height="400" /&gt;  // prevents shift
// Or use aspect-ratio in CSS:
.image-container { aspect-ratio: 16/9; }

// Fix INP: break long tasks
// Use requestIdleCallback, Web Workers, or React.startTransition</pre>
<div class="key-point">Core Web Vitals affect Google search ranking. Measure with: Lighthouse, PageSpeed Insights, Chrome DevTools Performance tab, or <code>web-vitals</code> npm package.</div>`,
        },
        {
          q: 'What techniques do you use to optimize web application performance?',
          difficulty: 'hard',
          a: `<pre>Frontend optimization checklist:

1. REDUCE BUNDLE SIZE
   → Code splitting (React.lazy, dynamic import)
   → Tree shaking (ES modules)
   → Analyze with: webpack-bundle-analyzer or next/bundle-analyzer

2. OPTIMIZE IMAGES
   → Use modern formats: WebP, AVIF
   → Lazy loading: loading="lazy"
   → Responsive images: srcset, sizes
   → Next.js: next/image (automatic optimization)

3. MINIMIZE RENDER BLOCKING
   → CSS: inline critical CSS, defer non-critical
   → JS: defer/async script loading
   → Fonts: font-display: swap; preload key fonts

4. CACHING
   → HTTP cache headers (Cache-Control, ETag)
   → Service Workers for offline
   → CDN for static assets
   → API response caching (TanStack Query)

5. REACT-SPECIFIC
   → React.memo for expensive components
   → useMemo/useCallback for stable references
   → Virtualization for long lists (react-window, tanstack-virtual)
   → Avoid unnecessary re-renders (selectors, state splitting)

6. NETWORK
   → HTTP/2 multiplexing
   → Gzip/Brotli compression
   → Prefetch next page: &lt;Link prefetch /&gt; (Next.js)
   → DNS prefetch: &lt;link rel="dns-prefetch" href="//api.example.com" /&gt;</pre>
<div class="key-point">Measure before optimizing. Use Lighthouse and Chrome DevTools Performance tab to identify actual bottlenecks. Don't optimize what doesn't need it.</div>`,
        },
        {
          q: 'What is list virtualization and when should you use it?',
          difficulty: 'medium',
          a: `<p><strong>Virtualization</strong> renders only the visible items in a long list, instead of all items at once.</p>
<pre>// Problem: 10,000 items → 10,000 DOM nodes → slow, high memory
function BadList({ items }) {
  return items.map(item => &lt;div key={item.id}&gt;{item.name}&lt;/div&gt;);
  // Renders ALL 10,000 items even though only ~20 are visible!
}

// Solution: react-window (or @tanstack/react-virtual)
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  return (
    &lt;FixedSizeList
      height={600}       // container height
      itemCount={items.length}
      itemSize={50}      // row height
      width="100%"
    &gt;
      {({ index, style }) => (
        &lt;div style={style}&gt;{items[index].name}&lt;/div&gt;
      )}
    &lt;/FixedSizeList&gt;
  );
  // Only renders ~12 items at a time (visible + buffer)!
}</pre>
<p><strong>Libraries:</strong></p>
<ul>
<li><code>react-window</code>: lightweight, fixed/variable row heights</li>
<li><code>@tanstack/react-virtual</code>: framework-agnostic, more features</li>
<li><code>react-virtuoso</code>: grouped lists, infinite scroll</li>
</ul>
<div class="key-point">Use virtualization when rendering 100+ items in a list or table. It reduces DOM nodes from thousands to dozens, dramatically improving render time and memory usage.</div>`,
        },
      ],
    },
  );
})();
