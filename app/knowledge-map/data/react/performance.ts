import type { KmNode } from '../../types';

export const perf: KmNode = {
  title: 'Performance',
  level: 'advanced',
  summary:
    'Measure first, then skip needless re-renders, split your bundle and render long lists cheaply.',
  simple:
    'React is fast by default. Performance work is like tuning a car: first find out what is actually slow, then fix just that.',
  points: [
    'Measure with the React DevTools Profiler before changing anything.',
    'Memoization skips work; code splitting loads less; virtualization draws less.',
    'React Compiler now does most memoization for you.',
  ],
  children: [
    {
      title: 'Measure First',
      level: 'intermediate',
      summary: 'Find the real bottleneck with the React DevTools Profiler and browser tools.',
      simple: 'Don’t guess which pipe leaks. Turn on the water and look.',
      points: [
        'Profiler shows which components rendered, why, and how long it took.',
        'Turn on "Highlight updates" to see re-renders live.',
        'Test with a production build; development mode is much slower.',
        'Often the fix is moving state down so fewer components re-render.',
      ],
    },
    {
      title: 'React.memo',
      level: 'advanced',
      summary: 'Wraps a component so it skips re-rendering when its props are shallowly equal.',
      points: [
        '<code>const Row = memo(function Row({ item }) { … })</code>.',
        'Shallow compare: a new object, array or function prop breaks it every time.',
        'Pair it with <code>useMemo</code>/<code>useCallback</code> for object and function props.',
        'Worth it for heavy components that re-render often with the same props.',
      ],
      tip: 'memo is a performance hint, not a guarantee. Your code must still work correctly if the component re-renders.',
    },
    {
      title: 'useMemo',
      level: 'advanced',
      summary: 'Caches the result of a calculation between renders until its dependencies change.',
      points: [
        '<code>const visible = useMemo(() =&gt; filter(todos, tab), [todos, tab]);</code>',
        'Use for expensive calculations or to keep an object reference stable for a memo child or an effect.',
        'Don’t wrap every small calculation; the bookkeeping has a cost too.',
      ],
    },
    {
      title: 'useCallback',
      level: 'advanced',
      summary: 'Caches a function definition between renders so its reference stays the same.',
      points: [
        '<code>useCallback(fn, deps)</code> is the same as <code>useMemo(() =&gt; fn, deps)</code>.',
        'Only useful when the function goes to a memoized child or is an effect dependency.',
        'Wrapping a handler that goes to a plain <code>&lt;button&gt;</code> gains nothing.',
      ],
      detail: `<pre><code>const handleSubmit = useCallback((order) =&gt; {
  post('/buy', { productId, order });
}, [productId]);

return &lt;ShippingForm onSubmit={handleSubmit} /&gt;; // ShippingForm is memo()</code></pre>`,
    },
    {
      title: 'React Compiler',
      level: 'advanced',
      summary:
        'A build-time tool that adds memoization automatically, so you rarely write memo, useMemo or useCallback.',
      points: [
        'Stable 1.0 since October 2025; works best with React 19 (17/18 need a small runtime package).',
        'Runs as a Babel plugin; Vite, Next.js and Expo support it.',
        'Only optimizes code that follows the Rules of React (pure render, rules of hooks).',
        'Code it can’t understand is just left as is.',
        'Keep existing manual memo calls; the compiler works alongside them.',
      ],
      tip: 'With the compiler on, write plain code first and add manual memoization only where profiling shows a need.',
    },
    {
      title: 'Code Splitting & lazy',
      level: 'advanced',
      summary:
        'Load a component’s code only when it’s needed, with lazy() and a Suspense fallback.',
      points: [
        '<code>const Chart = lazy(() =&gt; import("./Chart.jsx"))</code>.',
        'Wrap it in <code>&lt;Suspense fallback={&lt;Spinner /&gt;}&gt;</code> to show something while loading.',
        'Split by route first; that gives the biggest win.',
        'Declare <code>lazy</code> at the top level of a module, not inside a component.',
      ],
      detail: `<pre><code>const Settings = lazy(() =&gt; import('./Settings.jsx'));

function App() {
  return (
    &lt;Suspense fallback={&lt;p&gt;Loading…&lt;/p&gt;}&gt;
      &lt;Settings /&gt;
    &lt;/Suspense&gt;
  );
}</code></pre>`,
    },
    {
      title: 'List Virtualization',
      level: 'advanced',
      summary: 'Render only the rows visible on screen instead of thousands of DOM nodes.',
      points: [
        'Libraries: TanStack Virtual, react-window, react-virtuoso.',
        'Use when lists have hundreds or thousands of items.',
        'Rows outside the viewport are not in the DOM, so browser find (Ctrl+F) won’t see them.',
        'Pagination or "load more" is a simpler alternative.',
      ],
    },
  ],
};
