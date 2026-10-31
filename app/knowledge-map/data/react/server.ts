import type { KmNode } from '../../types';

export const server: KmNode = {
  title: 'Server Rendering & Frameworks',
  level: 'advanced',
  summary: 'CSR vs SSR, hydration, React Server Components and frameworks like Next.js.',
  simple:
    'Instead of shipping an empty box and building the furniture in the customer’s living room (the browser), you can build some of it in the factory (the server) and ship it ready.',
  points: [
    'SSR = render HTML on the server for a faster first view and better SEO.',
    'Server Components = components that run only on the server and send no JavaScript.',
    'You use them through a framework (Next.js, React Router framework mode), not plain React.',
  ],
  children: [
    {
      title: 'CSR vs SSR vs SSG',
      level: 'intermediate',
      summary:
        'Where the HTML is built: in the browser, on the server per request, or once at build time.',
      simple:
        'CSR: you get flat-pack furniture and build it at home. SSR: it’s built fresh when you order. SSG: it was built in advance and waits on the shelf.',
      points: [
        'CSR (client-side rendering): empty HTML + JS bundle; simple, but slower first view and weaker SEO.',
        'SSR (server-side rendering): HTML per request; fast first paint, needs a server.',
        'SSG (static generation): HTML at build time; fastest, but data is as old as the last build.',
        'Frameworks let you mix them per page.',
      ],
    },
    {
      title: 'Hydration',
      level: 'advanced',
      summary:
        'React attaches event handlers and state to server-made HTML so the page becomes interactive.',
      points: [
        'Client entry uses <code>hydrateRoot</code> instead of <code>createRoot</code>.',
        'The first client render must match the server HTML, or you get a hydration error.',
        'Common causes: <code>Date.now()</code>, <code>Math.random()</code>, <code>window</code> checks during render.',
        'Fix: render the same on both sides, then change in an effect after mount.',
        'Selective hydration (React 18) hydrates Suspense parts separately, urgent parts first.',
      ],
    },
    {
      title: 'Server Components',
      level: 'advanced',
      summary:
        'Components that run only on the server (at build or request time) and send their result, not their code, to the browser.',
      points: [
        'In Next.js App Router, components are Server Components by default.',
        'They can be <code>async</code> and read a database or files directly.',
        'No state, no effects, no event handlers, no browser APIs.',
        'Their code and dependencies never reach the browser bundle.',
        'Not the same as SSR: SSR makes HTML; RSC sends a serialized component tree (the RSC payload).',
      ],
      detail: `<pre><code>// Server Component: runs only on the server
export default async function Notes() {
  const notes = await db.notes.findMany();
  return notes.map((n) =&gt; &lt;Note key={n.id} note={n} /&gt;);
}</code></pre>`,
      tip: 'Interview: "Server Components reduce client JavaScript and fetch data close to the source; Client Components add interactivity."',
    },
    {
      title: "'use client' Boundary",
      level: 'advanced',
      summary: "The 'use client' directive marks a file as the entry into Client Components.",
      points: [
        'Put it at the top of a file that needs state, effects or event handlers.',
        'Everything that file imports also becomes client code.',
        'Server Components can render Client Components and pass them serializable props.',
        'Functions can’t be passed as props across the boundary, except Server Functions.',
        'Pass Server Components into Client Components as <code>children</code> to keep them on the server.',
      ],
      tip: "Push 'use client' as far down the tree as you can, e.g. only on the like button, not the whole page.",
    },
    {
      title: 'Server Functions',
      level: 'advanced',
      summary:
        "Async functions marked 'use server' that run on the server but can be called from the client.",
      points: [
        'Formerly called Server Actions; React now uses "Server Functions" (an Action when used in a form or transition).',
        'The framework creates a hidden network endpoint for each one.',
        'Pass to <code>&lt;form action={createNote}&gt;</code>; works even before JS loads.',
        'Treat them like public API endpoints: always check auth and validate input.',
      ],
      detail: `<pre><code>async function createNote(formData) {
  'use server';
  await db.notes.create({ text: formData.get('text') });
}

&lt;form action={createNote}&gt;…&lt;/form&gt;</code></pre>`,
    },
    {
      title: 'Streaming SSR',
      level: 'expert',
      summary:
        'The server sends HTML in chunks, filling in each Suspense boundary as its data is ready.',
      points: [
        'Shell (layout, fallbacks) arrives first; slow parts stream in later.',
        'APIs: <code>renderToPipeableStream</code> (Node) and <code>renderToReadableStream</code> (Web streams).',
        'One slow query no longer blocks the whole page.',
        'In Next.js, <code>loading.js</code> files create these Suspense boundaries for you.',
      ],
    },
    {
      title: 'Next.js & Other Frameworks',
      level: 'advanced',
      summary:
        'Full-stack React frameworks that bundle routing, data loading, SSR and Server Components.',
      points: [
        'Next.js App Router: file-based routes in <code>app/</code>, layouts, RSC, Server Functions, caching.',
        'Older Next.js Pages Router (<code>getServerSideProps</code>) still works but isn’t where new features go.',
        'React Router v7 framework mode (the successor of Remix): loaders, actions, SSR.',
        'Others: TanStack Start, Expo for React Native, Astro for content sites with React islands.',
      ],
      tip: 'Pick plain Vite for internal dashboards behind a login; pick a framework when SEO, first load speed or server data matter.',
    },
  ],
};
