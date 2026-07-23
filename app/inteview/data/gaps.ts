// Interview data: additional questions to fill gaps in existing topics
// Covers: Next.js, React advanced patterns, JavaScript advanced, Java concurrency, Spring Boot advanced
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
  // ───────────────────────── NEXT.JS ─────────────────────────
  {
    id: 'nextjs',
    name: 'Next.js',
    icon: '▲',
    questions: [
      {
        q: 'What is Next.js and how is it different from Create React App?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Next.js is a full-stack React framework, while Create React App was only a client-side bundler and is now deprecated. Next.js adds server rendering, file-based routing, API route handlers, and built-in image and bundle optimization. This gives better SEO and faster first load, because CRA sends an empty HTML page. The tradeoff is more concepts and a server to run, so a plain client-side build can still be simpler for a small internal app.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>App Router is the newer way and is built around React Server Components, nested layouts that do not re-render on navigation, and built-in <code>loading.tsx</code> and <code>error.tsx</code> files. Pages Router still works but is frozen for new features and uses <code>getServerSideProps</code> and <code>getStaticProps</code>. The main change is that in App Router the rendering strategy comes from how data is fetched, not from a special exported function. New projects should use App Router; existing Pages apps do not need to be migrated without a clear reason.</p></div>
<pre>// Pages Router (legacy, still supported):
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
        a: `<div class="interview-answer"><p>Next.js has four rendering strategies. SSG builds pages at build time and is the fastest and cheapest. SSR builds the page on every request and fits personalized or real-time content. ISR is SSG plus a revalidate time, so pages stay fresh without rebuilding on every request, and CSR renders in the browser for highly interactive views. In the App Router the strategy is chosen through <code>fetch</code> cache options and route settings, not by exporting a named function.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p><code>'use client'</code> marks a component that runs in the browser so it can use hooks, events, and browser APIs. <code>'use server'</code> marks a function as a Server Action that runs on the server and can reach the database or secrets directly. They are not opposites: every component is a Server Component by default, and <code>'use client'</code> is added only on the small parts that need interactivity to keep the browser bundle small. A common mistake is adding <code>'use client'</code> at the top of the tree, which pulls everything below it into the browser.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>Routing is based on the file structure: a folder with a <code>page.tsx</code> becomes a route, <code>[id]</code> is a dynamic segment, <code>[...slug]</code> is catch-all, and <code>[[...slug]]</code> is optional catch-all. Route groups in parentheses organize files without changing the URL, and parallel routes with the at-sign slot render several sections in one layout, such as modals. Dynamic pages can be pre-rendered at build time with <code>generateStaticParams</code>. Intercepting routes support the pattern of opening content in a modal that is still a real link.</p></div>
<pre>// File-based routing (App Router):
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
        a: `<div class="interview-answer"><p>Middleware runs at the edge before every matched request, so it is a good place for light shared logic like auth redirects, locale or geo routing, A/B testing, and setting headers. It must stay lightweight because the edge runtime has limited APIs, so heavy work like database calls should be avoided. A <code>matcher</code> should be used to skip static files and API routes. Middleware is a fast gate, not the real security check, so real authorization should still happen inside the handler.</p></div>
<p>Middleware runs <strong>before</strong> every request, at the edge. Use it for authentication, redirects, A/B testing, and geolocation.</p>
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
        a: `<div class="interview-answer"><p>Setting <code>output: 'export'</code> produces plain static HTML, CSS, and JS that can be hosted on any static server with no Node process. The cost is losing all server features: no SSR, no ISR, no route handlers, no middleware, and no image optimization unless <code>unoptimized</code> is set. Dynamic routes must be listed at build time with <code>generateStaticParams</code>. It fits docs sites, portfolios, and fully client-driven apps, and a hosted runtime is needed once real per-request logic is required.</p></div>
<p>Static export generates a fully static site (HTML/CSS/JS) that can be hosted anywhere (GitHub Pages, S3, Nginx).</p>
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
        a: `<div class="interview-answer"><p><code>next/image</code> improves performance with little effort: it serves modern formats like WebP and AVIF, resizes per device, lazy-loads by default, and reserves space to prevent layout shift, which helps LCP and CLS. Set <code>priority</code> on the main above-the-fold image so it loads early, and set correct <code>width</code> and <code>height</code> (or <code>fill</code> with <code>sizes</code>) to avoid over-fetching. It needs an optimization server, so static export uses <code>unoptimized</code> instead. For content images there is little reason to use a plain <code>&lt;img&gt;</code>.</p></div>
<pre>import Image from 'next/image';

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
      {
        q: 'You see "Text content does not match server-rendered HTML" in the console. What causes hydration mismatches and how do you fix them?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>A hydration mismatch means the HTML rendered on the server did not match the first render in the browser, so React discards the server markup and re-renders, which is slow and can flash wrong content. Common causes are non-deterministic values like <code>Date.now()</code> or <code>Math.random()</code>, locale and timezone formatting, and reading browser-only APIs such as <code>localStorage</code> during render. The fix is to render those values after mount inside <code>useEffect</code> so the first render matches on both sides. Use <code>suppressHydrationWarning</code> only for single unavoidable nodes like a timestamp, or disable SSR for a fully browser-dependent widget.</p></div>
<p>Hydration mismatch means the HTML React rendered on the server differs from what it renders on the client during the first render. React expects them to be <strong>identical</strong> — when they diverge, React logs a warning and may throw away the server HTML and re-render from scratch (slow, can flash wrong content).</p>
<p><strong>Common causes:</strong></p>
<ul>
<li><strong>Non-deterministic values during render</strong>: <code>Date.now()</code>, <code>Math.random()</code>, <code>toLocaleString()</code> (server locale/timezone differs from the user's browser).</li>
<li><strong>Browser-only APIs read during render</strong>: <code>localStorage</code>, <code>window.innerWidth</code> — they don't exist on the server, so the first client render produces different output.</li>
<li><strong>Invalid HTML nesting</strong>: <code>&lt;p&gt;&lt;div&gt;...&lt;/div&gt;&lt;/p&gt;</code> — the browser "fixes" the DOM before React hydrates, so the trees no longer match.</li>
<li><strong>Browser extensions</strong> injecting attributes/nodes (Grammarly, password managers) — not your bug, but users report it.</li>
</ul>
<pre>// BROKEN — different on server vs client:
function Clock() {
  return &lt;span&gt;{new Date().toLocaleTimeString()}&lt;/span&gt;;
}

function Theme() {
  const theme = localStorage.getItem('theme'); // crashes on server / mismatches
  return &lt;div className={theme}&gt;...&lt;/div&gt;;
}

// FIX 1 — render client-only values after mount:
'use client';
function Clock() {
  const [time, setTime] = useState&lt;string | null&gt;(null);
  useEffect(() => setTime(new Date().toLocaleTimeString()), []);
  return &lt;span&gt;{time ?? '--:--'}&lt;/span&gt;; // server and first client render agree
}

// FIX 2 — suppress for a single unavoidable text node (timestamps):
&lt;time suppressHydrationWarning&gt;{new Date().toLocaleString()}&lt;/time&gt;

// FIX 3 — skip SSR entirely for a browser-dependent widget:
const Map = dynamic(() => import('./Map'), { ssr: false });</pre>
<p><strong>Interviewer follow-up:</strong> why not sprinkle <code>suppressHydrationWarning</code> everywhere? It only suppresses one level deep, hides real bugs, and doesn't fix the underlying re-render cost — it's for genuinely unavoidable cases like timestamps.</p>
<div class="key-point">Hydration requires the first client render to be byte-identical to the server render — move anything non-deterministic or browser-dependent into useEffect, and reserve suppressHydrationWarning for single unavoidable text nodes.</div>`,
      },
      {
        q: 'Why can you not pass a function or class instance as a prop from a Server Component to a Client Component?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The boundary between Server and Client Components is a network serialization boundary: the server renders to a payload that is sent to the browser, and props that cross it must survive serialization. A function cannot cross because it holds a server closure with things like database handles and secrets, and a class instance loses its prototype, so a <code>Date</code> arrives as a string. The one allowed exception is a Server Action, which is sent as an opaque ID the client calls back, not as code. To place server content inside interactive UI, pass already-rendered server output as <code>children</code> into a client component.</p></div>
<p>Server and Client Components run in <strong>different environments at different times</strong>. The server renders to a serialized payload (the RSC payload) that is sent over the network; props crossing the boundary must survive serialization. Functions capture closures over server scope (DB handles, secrets) — there is no way to ship that to a browser. Class instances lose their prototype: a <code>Date</code> arriving as a string, a custom class arriving as a plain object.</p>
<pre>// BROKEN — build/runtime error:
// "Functions cannot be passed directly to Client Components"
export default async function Page() {
  const user = await getUser();
  return &lt;ProfileCard user={user} onSave={(u) => db.save(u)} /&gt;; // ✗ function prop
}

// FIX 1 — pass a Server Action (the one sanctioned exception):
// actions.ts
'use server';
export async function saveUser(formData: FormData) {
  await db.save(Object.fromEntries(formData));
}
// page.tsx (Server Component)
&lt;ProfileCard user={user} saveAction={saveUser} /&gt;  // ✓ serializable reference

// FIX 2 — children composition: interleave server content INSIDE a client shell
// instead of passing it data it can't receive:
'use client';
function Collapsible({ children }) {          // client interactivity
  const [open, setOpen] = useState(false);
  return &lt;div&gt;
    &lt;button onClick={() => setOpen(!open)}&gt;Toggle&lt;/button&gt;
    {open &amp;&amp; children}
  &lt;/div&gt;;
}
// Server Component passes ALREADY-RENDERED server content as children:
&lt;Collapsible&gt;&lt;ServerOnlyReport /&gt;&lt;/Collapsible&gt;  // ✓</pre>
<p><strong>Why Server Actions are allowed:</strong> <code>'use server'</code> functions aren't serialized as code — Next.js replaces them with an opaque reference (an ID) the client can invoke via an HTTP POST back to the server. The closure never leaves the server.</p>
<p><strong>Follow-up trap:</strong> "so a Client Component can never contain server content?" Wrong — the children pattern above proves client components can <strong>compose</strong> server-rendered subtrees; they just can't <strong>create</strong> them.</p>
<div class="key-point">The RSC boundary is a network serialization boundary: only serializable data and Server Action references cross it, and children composition is how you nest server content inside client interactivity.</div>`,
      },
      {
        q: 'Your Next.js page shows stale data in production but works fine in dev. Explain the App Router caching layers and how to control them.',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Stale data that appears only in production is usually a caching issue, because <code>next dev</code> skips most caches. The App Router has four caches: per-render request memoization, the cross-request Data Cache, the Full Route Cache of rendered static routes, and the client-side Router Cache. A page with only cacheable fetches is rendered statically at build time and stays stale until something revalidates it. Control it with <code>cache: 'no-store'</code> or <code>revalidate</code> per fetch, route settings, and <code>revalidateTag</code> or <code>revalidatePath</code> after changes, and always test with <code>next build</code>. Note that Next.js 15 changed fetch to be uncached by default.</p></div>
<p>The App Router has <strong>four distinct caches</strong>, and confusing them is the #1 source of "why is my data stale" bugs. Dev mostly bypasses them, so the bug only appears in <code>next build &amp;&amp; next start</code> or production.</p>
<table><tr><th>Cache</th><th>Where</th><th>What</th><th>Duration</th></tr>
<tr><td>Request memoization</td><td>Server</td><td>Identical fetch() calls within ONE render pass</td><td>Single request</td></tr>
<tr><td>Data Cache</td><td>Server</td><td>fetch() responses across requests/deploys</td><td>Until revalidated</td></tr>
<tr><td>Full Route Cache</td><td>Server</td><td>Rendered HTML + RSC payload of static routes</td><td>Until revalidated</td></tr>
<tr><td>Router Cache</td><td>Client</td><td>Visited route payloads in the browser</td><td>Session / ~30s-5min</td></tr>
</table>
<pre>// A page with only cacheable fetches gets STATICALLY rendered at build
// time (Full Route Cache) — it will never show fresh data until revalidated.

// Opt out per-fetch:
fetch(url, { cache: 'no-store' });           // always fresh
fetch(url, { next: { revalidate: 60 } });    // ISR-style
fetch(url, { next: { tags: ['products'] } });// tag for targeted purge

// Opt out per-route (route segment config):
export const dynamic = 'force-dynamic'; // whole route SSR every request
export const revalidate = 60;           // whole route revalidates every 60s

// On-demand invalidation after a mutation (Server Action):
'use server';
import { revalidatePath, revalidateTag } from 'next/cache';
export async function updateProduct(data: FormData) {
  await db.update(...);
  revalidateTag('products');   // purges Data Cache entries with this tag
  revalidatePath('/products'); // purges Full Route Cache + Router Cache for path
}</pre>
<p><strong>Version gotcha:</strong> in Next.js 14, <code>fetch()</code> defaulted to <code>force-cache</code> (cached). Next.js 15 flipped it: fetch is <strong>uncached by default</strong>, and GET Route Handlers/client Router Cache also became uncached — a deliberate response to how many teams were bitten by implicit caching.</p>
<p><strong>Follow-up:</strong> "you called revalidateTag but the user still sees old data" — the client Router Cache holds the old payload; revalidatePath purges it on next navigation, or call <code>router.refresh()</code>.</p>
<div class="key-point">Know the four caches (request memoization, Data Cache, Full Route Cache, client Router Cache), test caching behavior with next build not next dev, and remember Next 15 made fetch uncached by default.</div>`,
      },
      {
        q: 'What are Server Actions, and why is "the button is hidden for non-admins" not a security model for them?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Server Actions are <code>'use server'</code> functions the client calls through an automatically created HTTP POST, giving mutations without hand-written API routes plus progressive enhancement in forms. Each action becomes a public endpoint with a stable ID, so hiding the button in the UI protects nothing because anyone can send the same POST directly. Every action should be treated like a public API route: check authentication, check authorization, and validate input inside the action body. On the client, <code>useFormStatus</code> and <code>useActionState</code> handle pending and error states.</p></div>
<p>Server Actions are async functions marked <code>'use server'</code> that clients invoke via an automatically-created HTTP POST endpoint. They give you mutations without hand-writing API routes, plus <strong>progressive enhancement</strong>: a <code>&lt;form action={serverAction}&gt;</code> works even before JavaScript hydrates.</p>
<pre>// actions.ts
'use server';
import { revalidatePath } from 'next/cache';
import { getSession } from './auth';

export async function deletePost(prevState: any, formData: FormData) {
  // SECURITY: authorize INSIDE the action — it is a public endpoint.
  const session = await getSession();
  if (!session?.user || session.user.role !== 'admin') {
    return { error: 'Unauthorized' };
  }
  const id = String(formData.get('id')); // validate/parse inputs (zod in real code)
  await db.post.delete({ where: { id } });
  revalidatePath('/posts');
  return { success: true };
}

// posts.tsx
'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

function DeleteButton() {
  const { pending } = useFormStatus(); // must be INSIDE the form
  return &lt;button disabled={pending}&gt;{pending ? 'Deleting…' : 'Delete'}&lt;/button&gt;;
}

function PostRow({ id }) {
  const [state, formAction] = useActionState(deletePost, null);
  return &lt;form action={formAction}&gt;
    &lt;input type="hidden" name="id" value={id} /&gt;
    &lt;DeleteButton /&gt;
    {state?.error &amp;&amp; &lt;p role="alert"&gt;{state.error}&lt;/p&gt;}
  &lt;/form&gt;;
}</pre>
<p><strong>Why hiding the button is not security:</strong> every exported Server Action compiles to a public HTTP endpoint with a stable action ID. Anyone can replay the POST with curl — the UI never gatekeeps anything. Treat each action exactly like a public API route: authenticate, authorize, and validate input <strong>inside the action body</strong>.</p>
<p><strong>Other failure modes interviewers probe:</strong> actions run sequentially (not for parallel reads — use Route Handlers or server fetches for GET-style data), and closing over sensitive server values in inline actions can leak them into the encrypted bound-args payload.</p>
<div class="key-point">Server Actions are public POST endpoints in disguise — do auth and input validation inside every action, and use useFormStatus/useActionState for pending and error UI with progressive enhancement for free.</div>`,
      },
      {
        q: 'How does streaming SSR with Suspense work in the App Router, and what do loading.tsx and error.tsx actually do?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Classic SSR waits for every fetch to finish before sending any HTML, while streaming SSR sends the shell right away and streams slow parts in later, using <code>&lt;Suspense&gt;</code> boundaries as the split points. <code>loading.tsx</code> is a shortcut for one Suspense around the whole segment, and <code>error.tsx</code> is a per-segment error boundary with a <code>reset()</code> so one broken widget does not crash the page. Fine-grained Suspense at each async component is better than one full-page spinner. Streaming improves perceived speed and first byte time, but not total time, since a slow query is still slow.</p></div>
<p>Classic SSR is all-or-nothing: the server must finish <strong>every</strong> data fetch before sending byte one. Streaming SSR sends the shell immediately and <strong>streams in slow parts later</strong> over the same response, using <code>&lt;Suspense&gt;</code> boundaries as the seams.</p>
<pre>// app/dashboard/page.tsx
import { Suspense } from 'react';

export default function Dashboard() {
  return &lt;&gt;
    &lt;Header /&gt;                         {/* sent immediately */}
    &lt;Suspense fallback={&lt;StatsSkeleton /&gt;}&gt;
      &lt;Stats /&gt;                        {/* async — streams in when ready */}
    &lt;/Suspense&gt;
    &lt;Suspense fallback={&lt;FeedSkeleton /&gt;}&gt;
      &lt;SlowFeed /&gt;                     {/* independent — streams separately */}
    &lt;/Suspense&gt;
  &lt;/&gt;;
}

async function SlowFeed() {
  const posts = await fetch('https://api.example.com/feed', { cache: 'no-store' })
    .then(r => r.json());
  return &lt;Feed posts={posts} /&gt;;
}

// app/dashboard/loading.tsx — implicit Suspense around the WHOLE page:
export default function Loading() { return &lt;PageSkeleton /&gt;; }

// app/dashboard/error.tsx — error boundary for the segment (must be client):
'use client';
export default function Error({ error, reset }) {
  return &lt;div&gt;&lt;p&gt;Failed: {error.message}&lt;/p&gt;
    &lt;button onClick={reset}&gt;Retry&lt;/button&gt;&lt;/div&gt;;
}</pre>
<ul>
<li><code>loading.tsx</code> is sugar for wrapping the route segment in one big Suspense boundary. Fine-grained <code>&lt;Suspense&gt;</code> inside the page beats one whole-page spinner.</li>
<li><code>error.tsx</code> creates a React error boundary per segment — a crashing widget takes down its segment, not the app; <code>reset()</code> re-renders the segment.</li>
<li><strong>The subtle point:</strong> streaming improves TTFB and perceived performance, but <strong>total</strong> time to full content is unchanged — the slow query is still slow. You improved when users see <strong>something</strong>, not when they see <strong>everything</strong>.</li>
</ul>
<p><strong>Follow-ups:</strong> streaming requires a Node/edge runtime (not <code>output: 'export'</code>); an awaited fetch <strong>above</strong> your Suspense boundary in the tree still blocks the shell — suspend at the component that fetches, not the layout.</p>
<div class="key-point">Suspense boundaries let the server flush the shell immediately and stream slow subtrees later — better TTFB and perceived speed, same total data time, with loading.tsx/error.tsx as per-segment Suspense and error boundaries.</div>`,
      },
    ],
  },

  // ───────────────────────── ADDITIONAL JAVASCRIPT GAPS ─────────────────────────

  // ───────────────────────── WEB PERFORMANCE ─────────────────────────
  {
    id: 'web-performance',
    name: 'Web Performance',
    icon: '🚀',
    questions: [
      {
        q: 'What are Core Web Vitals? Explain LCP, FID, CLS.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Core Web Vitals are Google's three field metrics for real user experience: LCP for loading (target under 2.5s), INP, which replaced FID, for responsiveness (target under 200ms), and CLS for visual stability (target under 0.1). They matter because they affect search ranking and are measured on real users. Common fixes are preloading the LCP image, always setting image dimensions or aspect-ratio to prevent layout shift, and breaking long JavaScript tasks into smaller pieces. These are p75 field numbers from real users, so a good Lighthouse score alone does not guarantee a pass.</p></div>
<p><strong>Core Web Vitals</strong> are Google's metrics for measuring real-world user experience:</p>
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
        a: `<div class="interview-answer"><p>The first step is to measure with Lighthouse and a performance trace to find the real bottleneck before changing anything. Common improvements are shrinking the JavaScript bundle with code splitting and tree shaking, optimizing images with modern formats and lazy loading, removing render-blocking CSS and JavaScript, caching with proper headers and a CDN, and cutting wasteful React re-renders with memoization and list virtualization. On the network side, compression, HTTP/2, and prefetching help. Effort should focus on the few big items on the critical path rather than small tweaks that do not matter.</p></div>
<pre>Frontend optimization checklist:

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
        a: `<div class="interview-answer"><p>Virtualization renders only the rows currently visible plus a small buffer instead of every item, so a list of 10,000 rows becomes about a dozen DOM nodes. This greatly reduces render time, memory, and layout cost. It is useful once a list or table grows past about a hundred rows, using libraries like <code>react-window</code> or <code>@tanstack/react-virtual</code>. The tradeoffs are that variable row heights need measuring and that find-on-page and accessibility get harder because off-screen rows are not in the DOM, so a short list should not be virtualized.</p></div>
<p><strong>Virtualization</strong> renders only the visible items in a long list, instead of all items at once.</p>
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
      {
        q: 'INP replaced FID as a Core Web Vital in March 2024. What does INP measure, why was FID insufficient, and how do you fix a bad INP score?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>INP measures the delay of interactions across the whole page lifetime and reports about the worst one, split into input delay, processing time, and presentation delay, with a target under 200ms. It replaced FID because FID only measured the delay of the very first input and ignored the handler cost and the paint, so sites could pass FID and still feel slow on every click. The fix is to show feedback immediately, then yield to the main thread and break heavy work into chunks; in React, keep the urgent update fast and wrap the expensive one in <code>startTransition</code>. Because INP is a field metric, it should be debugged from real user data at p75 by device class, not on a fast machine.</p></div>
<p><strong>INP (Interaction to Next Paint)</strong> measures the latency of interactions across the <strong>whole page lifetime</strong> and reports (roughly) the worst one. Target: &lt;200ms. Each interaction's latency has three parts:</p>
<ol>
<li><strong>Input delay</strong> — main thread busy, handler can't even start (all FID measured).</li>
<li><strong>Processing time</strong> — your event handlers actually running.</li>
<li><strong>Presentation delay</strong> — time until the next frame paints the visual response.</li>
</ol>
<p><strong>Why FID was insufficient:</strong> it measured only the <strong>first</strong> input and only the <strong>delay</strong> part — never the handler cost or paint. A page could ace FID and still feel janky on every click after load. Most sites passed FID; INP actually discriminates.</p>
<pre>// BAD INP — 300ms of sync work blocks the paint after click:
button.addEventListener('click', () => {
  applyFilters(bigDataset);   // long task: input frozen, no visual feedback
  render(results);
});

// FIX — paint feedback first, yield, then do the work:
button.addEventListener('click', async () => {
  button.disabled = true;
  spinner.show();                       // cheap visual response THIS frame
  await scheduler.yield();              // let the browser paint
  // (fallback: await new Promise(r => setTimeout(r, 0));)
  for (const chunk of chunks(bigDataset, 500)) {
    applyFilters(chunk);
    await scheduler.yield();            // break the long task into pieces
  }
  render(results);
});

// React equivalent — keep the urgent update fast, defer the expensive one:
const [isPending, startTransition] = useTransition();
onChange={e => {
  setQuery(e.target.value);                    // urgent: input echoes now
  startTransition(() => setFiltered(filter(e.target.value))); // deferrable
}}</pre>
<p><strong>Other big INP levers:</strong> reduce hydration cost (less client JS, Server Components), avoid layout thrashing in handlers (read then write), debounce expensive input handlers, and move pure computation to Web Workers.</p>
<p><strong>Follow-up:</strong> "your INP is bad but you can't reproduce it" — INP is a field metric at p75; check CrUX/RUM breakdowns by interaction and device class, not your M3 laptop.</p>
<div class="key-point">INP scores the worst interaction over the whole session (delay + processing + paint), so the fix is breaking long tasks and yielding to the main thread so the browser can paint feedback within 200ms.</div>`,
      },
      {
        q: 'Your LCP is 4.5s. Walk me through diagnosing and fixing it.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Instead of guessing, split LCP into its four parts: TTFB, resource load delay, resource load time, and render delay, which the Performance panel or web-vitals attribution can show. Fix them in order of impact: improve TTFB first, make the LCP image easy to find early with a preload and <code>fetchpriority='high'</code>, shrink it with AVIF or WebP and a right-sized srcset, then remove things that block rendering. Common self-made problems are lazy-loading the hero image, hiding it as a CSS background so it is found late, or rendering it with client JavaScript. If a preload made no difference, check the actual network waterfall instead of trusting a checklist.</p></div>
<p>Never guess — decompose LCP into its <strong>four sub-parts</strong> (DevTools Performance panel and web-vitals attribution give these):</p>
<table><tr><th>Sub-part</th><th>What it is</th><th>Typical fix</th></tr>
<tr><td>TTFB</td><td>First byte of the HTML</td><td>CDN, server/DB tuning, cache the HTML</td></tr>
<tr><td>Resource load delay</td><td>Gap before the LCP image even STARTS loading</td><td>Preload; don't hide the URL in CSS/JS</td></tr>
<tr><td>Resource load time</td><td>Downloading the image itself</td><td>AVIF/WebP, right-sized srcset, CDN</td></tr>
<tr><td>Render delay</td><td>Image loaded but not yet painted</td><td>Remove blocking scripts/CSS, avoid client-side rendering of the hero</td></tr>
</table>
<p><strong>Classic self-inflicted wounds:</strong></p>
<pre>// BEFORE — three separate LCP killers:
&lt;img src="/hero.jpg" loading="lazy" /&gt;
&lt;!-- 1. NEVER lazy-load the LCP image: adds huge load delay --&gt;
&lt;!-- 2. Hero as CSS background-image: found only after CSS parses --&gt;
&lt;!-- 3. Hero rendered by client JS: waits for bundle + hydration --&gt;

// AFTER:
&lt;link rel="preload" as="image" href="/hero.avif"
      imagesrcset="/hero-800.avif 800w, /hero-1600.avif 1600w"
      fetchpriority="high" /&gt;
&lt;img src="/hero-1600.avif"
     srcset="/hero-800.avif 800w, /hero-1600.avif 1600w"
     sizes="100vw" width="1600" height="640"
     fetchpriority="high" decoding="async" alt="…" /&gt;
&lt;!-- eager (default), discoverable in initial HTML, prioritized --&gt;

// Plus: inline critical CSS so render isn't blocked on a stylesheet,
// and serve HTML from a CDN edge to cut TTFB.</pre>
<p><strong>Fix order by leverage:</strong> TTFB first (it delays everything downstream), then make the LCP resource discoverable early (preload + <code>fetchpriority="high"</code>), then shrink it, then unblock rendering. Note: <code>fetchpriority="high"</code> matters because browsers start images at low priority until layout proves they're in-viewport.</p>
<p><strong>Follow-up trap:</strong> "we preloaded it, no change" — a preload competing with render-blocking CSS/fonts at the same priority may just reshuffle the queue; check the waterfall, not the checklist.</p>
<div class="key-point">Decompose LCP into TTFB, load delay, load time, and render delay to find the dominant sub-part — and never lazy-load the LCP image; preload it with fetchpriority="high".</div>`,
      },
      {
        q: 'How do you reduce JavaScript bundle size? Explain code splitting, tree shaking requirements, and the barrel-file trap.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>JavaScript is the most expensive kind of byte because it is parsed, compiled, and run on the main thread, so bundle size is reduced three ways. Split code by route and feature so users only download what they use, keep dependencies as ES modules with <code>sideEffects</code> declared so tree shaking can remove dead code, and avoid the barrel-file trap where importing from a large <code>index.ts</code> pulls in the whole module graph. A clear example is importing all of <code>lodash</code> versus importing from <code>lodash-es</code>. Always confirm results with a bundle analyzer to catch duplicated dependencies or an accidental full SDK.</p></div>
<p>JS is the most expensive byte type: it's downloaded, parsed, compiled, and executed on the main thread — directly hurting INP and TTI. Three levers:</p>
<p><strong>1. Route/feature-based code splitting</strong> — ship code when it's needed:</p>
<pre>// Load the chart library only when the modal opens:
const Chart = React.lazy(() => import('./HeavyChart')); // own chunk

function Analytics() {
  const [open, setOpen] = useState(false);
  return &lt;&gt;
    &lt;button onClick={() => setOpen(true)}&gt;Show chart&lt;/button&gt;
    {open &amp;&amp; &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;&lt;Chart /&gt;&lt;/Suspense&gt;}
  &lt;/&gt;;
}
// Next.js does this automatically per route; next/dynamic for components.</pre>
<p><strong>2. Tree shaking</strong> — dead-code elimination, but only if the bundler can statically analyze imports:</p>
<pre>// SHIPS ALL OF LODASH (~70KB min+gz) — lodash is CommonJS, not shakeable:
import _ from 'lodash';
_.debounce(fn, 200);

// Shakeable alternatives:
import debounce from 'lodash-es/debounce'; // ESM build, or:
import { debounce } from 'lodash-es';      // shakes because it's ESM

// package.json of a library — tells bundlers imports are pure:
{ "sideEffects": false }   // or ["*.css"] if CSS imports have effects
// Without this, bundlers must keep every imported module "just in case".</pre>
<p><strong>3. The barrel-file trap</strong> — <code>index.ts</code> files that re-export everything:</p>
<pre>// components/index.ts re-exports 50 components.
import { Button } from '@/components';  // pulls the whole graph into
                                        // the compile/parse path; if any
                                        // re-export has side effects,
                                        // shaking fails entirely.
import { Button } from '@/components/Button'; // import directly instead
// (Next.js optimizePackageImports mitigates this for listed packages.)</pre>
<p><strong>Measure, don't guess:</strong> <code>@next/bundle-analyzer</code> / <code>webpack-bundle-analyzer</code> shows what's actually in each chunk — duplicated deps, accidental moment.js locales, a "utils" package dragging in an entire SDK.</p>
<div class="key-point">Split by route so users pay for what they use, keep dependencies ESM with sideEffects declared so tree shaking works, import from concrete modules instead of barrels, and verify with a bundle analyzer.</div>`,
      },
      {
        q: 'How do web fonts hurt performance, and what does a correct font-loading setup look like? (FOIT, FOUT, CLS)',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Web fonts hurt two vitals at once: they can cause invisible text (FOIT) for up to three seconds, and they can cause layout shift (CLS) when the swap to the real font reflows the page. A correct setup uses self-hosted WOFF2 with <code>font-display: swap</code> so text is always visible, a preload with <code>crossorigin</code> on the one critical font file, and a metric-matched fallback using <code>size-adjust</code> and <code>ascent-override</code> so the swap shifts nothing. This is exactly what <code>next/font</code> automates, including self-hosting Google fonts. For app interfaces it is also worth asking whether a brand font is needed at all versus a zero-cost system font stack.</p></div>
<p>Web fonts hit two vitals at once: text render (<strong>FOIT</strong> — invisible text while the font loads) and layout stability (<strong>CLS</strong> — the swap to the real font changes line breaks and shifts the page).</p>
<ul>
<li><strong>FOIT</strong> (flash of invisible text): default browser behavior blocks text up to ~3s waiting for the font. Worst option — content is unreadable.</li>
<li><strong>FOUT</strong> (flash of unstyled text): show a fallback immediately, swap when ready. Readable, but the swap shifts layout if the fonts have different metrics.</li>
</ul>
<pre>/* 1. Self-host WOFF2 and show text immediately: */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-display: swap;        /* FOUT, not FOIT — text always visible */
  font-weight: 100 900;      /* one variable file, all weights */
}

/* 2. Kill the swap-induced CLS: metric-matched fallback */
@font-face {
  font-family: 'Inter-fallback';
  src: local('Arial');
  size-adjust: 107%;         /* scale Arial to Inter's glyph widths */
  ascent-override: 90%;      /* match vertical metrics */
  descent-override: 22%;
}
body { font-family: 'Inter', 'Inter-fallback', sans-serif; }

&lt;!-- 3. Preload the ONE critical font file (crossorigin is required
       even for same-origin fonts): --&gt;
&lt;link rel="preload" href="/fonts/inter-var.woff2"
      as="font" type="font/woff2" crossorigin /&gt;</pre>
<p><strong>Why each piece:</strong> WOFF2 is ~30% smaller than WOFF; preloading matters because fonts are discovered <strong>late</strong> (HTML → CSS → @font-face → request); <code>size-adjust</code>/<code>ascent-override</code> make the fallback occupy the same space so the swap is visually free (this is exactly what <code>next/font</code> generates automatically, plus it self-hosts Google fonts to remove a third-party connection).</p>
<p><strong>Senior alternative:</strong> for dashboards and app UIs, a system font stack (<code>font-family: system-ui, -apple-system, sans-serif</code>) costs zero bytes and zero CLS — question whether the brand font is worth it below the fold.</p>
<p><strong>Follow-up:</strong> when is <code>font-display: optional</code> better? When brand fidelity is negotiable — it uses the font only if cached/instant, guaranteeing no swap shift at all.</p>
<div class="key-point">Use self-hosted WOFF2 with font-display: swap, preload the critical file, and metric-match the fallback with size-adjust/ascent-override so the swap causes zero CLS — or just use next/font, which automates all of it.</div>`,
      },
      {
        q: 'Design an HTTP caching strategy for a SPA. Why did your last deploy break for users with the app "already open in a tab"?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The core rule is that content-hashed assets never change, so they can be cached for a year with <code>immutable</code>, while the HTML entry point that names them is never trusted stale and uses <code>no-cache</code> with an ETag so it revalidates cheaply. A common broken deploy happens when a long <code>max-age</code> is set on <code>index.html</code>: new hashed files ship, old ones are deleted, and users on cached HTML get a 404 on a missing script and a blank screen. A stale open tab loading a deleted chunk hits the same problem. Mitigate by keeping the previous deploy's assets for a grace period and recovering from a <code>ChunkLoadError</code> with a reload.</p></div>
<p>The core rule: <strong>immutable, content-hashed assets get cached forever; the HTML that names them is never trusted stale.</strong></p>
<pre># Hashed assets — the hash changes when content changes, so cache forever:
/assets/app.3f9c1a.js
Cache-Control: public, max-age=31536000, immutable
# 'immutable' also stops revalidation on reload — no wasted 304s.

# HTML entry point — must always be checked with the server:
/index.html
Cache-Control: no-cache            # cache it, but REVALIDATE every use
ETag: "abc123"                     # unchanged → cheap 304, changed → new HTML
# (no-cache ≠ no-store: no-store means never cache at all.)

# API responses that tolerate slight staleness:
Cache-Control: max-age=60, stale-while-revalidate=300
# serve cached up to 60s; for 5 more minutes serve stale INSTANTLY
# while refetching in the background — users never wait.</pre>
<p><strong>The classic broken-deploy postmortem:</strong> someone set <code>max-age=3600</code> on <code>index.html</code>. Deploy ships <code>app.NEW.js</code> and deletes <code>app.OLD.js</code>. Users' cached HTML still references the old chunk → 404 on a script → white screen until the HTML cache expires. Same failure via a stale SPA tab lazy-loading a deleted chunk — handle <code>ChunkLoadError</code> by prompting a reload.</p>
<pre>// Runtime guard for the stale-tab case:
import(/* webpackChunkName: "settings" */ './Settings')
  .catch(err => {
    if (/Loading chunk .* failed/.test(err.message)) {
      window.location.reload();  // stale index.html → fetch fresh one
    } else throw err;
  });
// And: keep the previous deploy's assets on the CDN for a grace period
// instead of deleting them atomically.</pre>
<p><strong>CDN layer:</strong> the same headers drive edge caching; on deploy you purge/invalidate the HTML path only — hashed assets never need purging because new HTML references new URLs.</p>
<p><strong>Follow-up:</strong> ETag vs Last-Modified? ETag is content-based and precise; Last-Modified has 1-second granularity and breaks with multi-server clock/mtime drift. Prefer ETag (but ensure it's consistent across servers — default Apache/Nginx ETags can include inode data).</p>
<div class="key-point">Content-hashed assets get max-age=31536000, immutable; index.html gets no-cache + ETag; keep old assets deployed for a grace period and recover from chunk-load failures — most "deploy broke the app" incidents are exactly this pattern inverted.</div>`,
      },
      {
        q: 'Your Lighthouse score is 98 but users complain the site is slow. Explain lab vs field data and how you would close the gap.',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Lab and field data answer different questions, which is the whole gap. Lighthouse is a lab test: one synthetic cold load of a logged-out page on a simulated device, with high variance, and it cannot even measure real INP. Field data from CrUX and RUM reflects real users at p75 over 28 days across real devices, networks, cache states, and heavy pages. A 98 lab score with slow users usually means real users are on mid-tier phones on a page Lighthouse never tested. Close the gap by collecting RUM with the web-vitals library, segmenting p75 by page and device to find what to fix, and keeping Lighthouse as a CI budget to prevent regressions. Google also ranks on field data, so the lab score does not affect SEO.</p></div>
<p>The two data types answer different questions, and confusing them is how teams "pass CI" while losing users:</p>
<table><tr><th></th><th>Lab (Lighthouse, WebPageTest)</th><th>Field (CrUX, RUM)</th></tr>
<tr><td>Who</td><td>A synthetic run, one simulated device</td><td>Your real users, real devices/networks</td></tr>
<tr><td>When</td><td>Cold load, no interaction (so: no real INP)</td><td>Whole sessions, all pages</td></tr>
<tr><td>Statistic</td><td>One run (high variance)</td><td>p75 over 28 days (CrUX)</td></tr>
<tr><td>Good for</td><td>Debugging, reproducibility, CI regression gates</td><td>Truth about experience, SEO ranking</td></tr>
</table>
<p><strong>Why the scores diverge:</strong> Lighthouse tests a cold, logged-out landing page on a simulated Moto G on your fast CI network profile — your users are on mid-tier Androids, logged in, on the heavy <code>/search</code> page, hitting cache states and third-party scripts (chat widgets, tag managers) that a lab run may not trigger. Lighthouse also cannot measure real INP at all — it approximates with TBT.</p>
<pre>// Close the gap: instrument RUM with the web-vitals library
import { onLCP, onINP, onCLS } from 'web-vitals/attribution';

function send(metric) {
  const body = JSON.stringify({
    name: metric.name, value: metric.value, rating: metric.rating,
    page: location.pathname,
    // attribution tells you WHAT to fix, not just the number:
    target: metric.attribution?.interactionTarget
         || metric.attribution?.element,
  });
  navigator.sendBeacon('/api/vitals', body); // survives page unload
}
onLCP(send); onINP(send); onCLS(send);

// Then segment p75 by page, device class, and country —
// "INP p75 = 480ms on /search for low-end Android" is actionable.

// Lab still has a job: performance budgets as a CI regression gate
// (lighthouse-ci assertion config):
{ "assertions": {
    "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
    "total-byte-weight": ["error", { "maxNumericValue": 350000 }] } }</pre>
<p><strong>The senior framing:</strong> field data (p75) decides <strong>whether</strong> you have a problem and where; lab tools reproduce and debug it; CI budgets stop it coming back. Google ranking uses CrUX field data — your Lighthouse score is irrelevant to SEO.</p>
<div class="key-point">Lighthouse is a controlled experiment, not reality: trust p75 field data (CrUX/RUM via web-vitals) to find problems, use lab tools to debug them, and enforce lab budgets in CI to prevent regressions.</div>`,
      },
    ],
  },
];
