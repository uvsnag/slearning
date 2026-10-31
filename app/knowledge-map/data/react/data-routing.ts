import type { KmNode } from '../../types';

export const dataRouting: KmNode = {
  title: 'Data, Routing & Styling',
  level: 'intermediate',
  summary:
    'Fetch data safely, move between pages with React Router, and pick a way to style components.',
  simple:
    'React only draws the UI. Loading data, switching pages and styling come from patterns and libraries you add around it.',
  points: [
    'Fetching in an effect works but has traps; libraries and frameworks solve them.',
    'React Router maps URLs to components.',
    'There is no single "React way" to style; pick one approach per project.',
  ],
  children: [
    {
      title: 'Fetching in an Effect',
      level: 'intermediate',
      summary: 'The basic way to load data on the client, plus the race condition you must handle.',
      simple:
        'If you ask two shops for prices and the slow one answers last, you might show the old answer. You need to ignore replies to questions you no longer care about.',
      points: [
        'Keep three pieces of state: data, loading, error.',
        'Use an <code>ignore</code> flag or <code>AbortController</code> in cleanup to drop stale responses.',
        'Downsides: no cache, request waterfalls, nothing on the server-rendered HTML.',
        'For real apps prefer TanStack Query, a router loader or a framework.',
      ],
      detail: `<pre><code>useEffect(() =&gt; {
  let ignore = false;
  fetch('/api/users/' + id)
    .then((r) =&gt; r.json())
    .then((json) =&gt; { if (!ignore) setUser(json); });
  return () =&gt; { ignore = true; };
}, [id]);</code></pre>`,
    },
    {
      title: 'React Router Basics',
      level: 'intermediate',
      summary: 'The most used router: matches the URL to components without a full page reload.',
      simple:
        'A receptionist that reads the address you typed and walks you to the right room, without leaving the building.',
      points: [
        'Version 7 ships as the <code>react-router</code> package (Remix merged into it).',
        'Three modes: declarative (<code>&lt;Routes&gt;</code>), data (<code>createBrowserRouter</code>) and framework.',
        'Use <code>&lt;Link to="/about"&gt;</code> instead of <code>&lt;a&gt;</code> for in-app links.',
        '<code>useNavigate()</code> navigates from code, e.g. after a form submit.',
      ],
      detail: `<pre><code>&lt;BrowserRouter&gt;
  &lt;Routes&gt;
    &lt;Route path="/" element={&lt;Home /&gt;} /&gt;
    &lt;Route path="users/:id" element={&lt;User /&gt;} /&gt;
    &lt;Route path="*" element={&lt;NotFound /&gt;} /&gt;
  &lt;/Routes&gt;
&lt;/BrowserRouter&gt;</code></pre>`,
    },
    {
      title: 'Nested Routes & Params',
      level: 'intermediate',
      summary: 'Share layouts with nested routes and read dynamic URL parts with useParams.',
      simple:
        'A layout is a picture frame that stays put; the Outlet is the hole in the middle where the current page slides in.',
      points: [
        'Parent route renders <code>&lt;Outlet /&gt;</code> where the child page goes.',
        'Dynamic segment <code>:id</code> is read with <code>useParams()</code>.',
        'Query string: <code>useSearchParams()</code>.',
        'Index routes render at the parent’s exact path.',
      ],
    },
    {
      title: 'Loaders & Actions',
      level: 'advanced',
      summary:
        'In data/framework mode, routes can load data before rendering and handle form submissions.',
      points: [
        '<code>loader</code> fetches data for a route; read it with <code>useLoaderData()</code>.',
        'Loaders for nested routes run in parallel, which avoids waterfalls.',
        '<code>action</code> handles <code>&lt;Form method="post"&gt;</code> submits, then loaders revalidate.',
        'Same idea as Next.js server data loading and Server Functions.',
      ],
    },
    {
      title: 'Styling Options',
      level: 'beginner',
      summary:
        'Ways to style React: plain CSS, CSS Modules, utility classes (Tailwind) or CSS-in-JS.',
      simple:
        'Like choosing how to dress: one big shared wardrobe (global CSS), a personal closet per component (modules), or ready-made pieces you combine (Tailwind).',
      points: [
        'Plain CSS with <code>className</code> works, but class names are global.',
        'Inline <code>style={{…}}</code> is fine for dynamic values, not whole designs (no hover, no media queries).',
        'Component libraries (MUI, Chakra, shadcn/ui) give you ready-made styled parts.',
      ],
      children: [
        {
          title: 'CSS Modules',
          level: 'beginner',
          summary: 'CSS files whose class names are scoped to the component that imports them.',
          simple:
            'Each component gets its own private label maker, so two "title" classes never clash.',
          points: [
            'Name the file <code>Button.module.css</code>.',
            'Import: <code>import styles from "./Button.module.css"</code>, use <code>className={styles.primary}</code>.',
            'Built into Vite and Next.js; zero runtime cost.',
          ],
        },
        {
          title: 'Tailwind CSS',
          level: 'beginner',
          summary: 'Utility-first CSS: style with many small classes right in your JSX.',
          simple:
            'Instead of writing a new outfit, you pick from a huge rack of tiny ready pieces: "padding 4", "text blue", "rounded".',
          points: [
            'Example: <code>className="px-4 py-2 rounded bg-blue-600 text-white"</code>.',
            'Only the classes you use end up in the final CSS.',
            'Very popular with React; long class lists are the main complaint.',
          ],
        },
        {
          title: 'CSS-in-JS',
          level: 'intermediate',
          summary: 'Write styles in JavaScript next to the component (styled-components, Emotion).',
          simple: 'Styles live in the same file as the component, and can use props directly.',
          points: [
            'Runtime CSS-in-JS adds JavaScript work on every render.',
            'Doesn’t fit well with Server Components; many teams moved to Tailwind or CSS Modules.',
            'Zero-runtime options (vanilla-extract, Panda CSS) extract CSS at build time.',
          ],
        },
      ],
    },
  ],
};
