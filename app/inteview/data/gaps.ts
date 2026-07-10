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
];
