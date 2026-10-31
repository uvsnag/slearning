import type { KmNode } from '../../types';

export const modernReact: KmNode = {
  title: 'React 18 & 19 Features',
  level: 'advanced',
  summary: 'Concurrent rendering, transitions, Suspense, and React 19’s Actions and new hooks.',
  simple:
    'React 18 taught React to juggle: it can pause less urgent work to keep typing smooth. React 19 made forms and async updates much easier to write.',
  points: [
    'React 18 (2022): concurrent rendering, automatic batching, transitions.',
    'React 19 (Dec 2024): Actions, useActionState, useOptimistic, use, ref as a prop.',
    'React 19.2 (Oct 2025): Activity, useEffectEvent.',
  ],
  children: [
    {
      title: 'Concurrent Rendering',
      level: 'advanced',
      summary:
        'React can prepare several versions of the UI and interrupt a slow render for an urgent one.',
      points: [
        'Turned on when you use <code>createRoot</code> plus a concurrent feature (transition, Suspense, deferred value).',
        'Rendering is interruptible; the commit to the DOM is still all-at-once.',
        'Lets typing stay responsive while a big list re-renders in the background.',
        'Requires pure components: a render may run and then be thrown away.',
      ],
    },
    {
      title: 'Automatic Batching',
      level: 'intermediate',
      summary:
        'Since React 18, multiple state updates are grouped into one re-render, even in promises and timeouts.',
      simple:
        'Like a waiter who waits until you’ve finished ordering everything before going to the kitchen, instead of running back after each dish.',
      points: [
        'React 17 only batched inside React event handlers.',
        'React 18+ batches everywhere: <code>setTimeout</code>, promises, native events.',
        '<code>flushSync</code> forces an immediate update when you really need it (rare).',
      ],
    },
    {
      title: 'useTransition',
      level: 'advanced',
      summary:
        'Marks a state update as non-urgent so React can keep the UI responsive while it renders.',
      points: [
        '<code>const [isPending, startTransition] = useTransition()</code>.',
        'Urgent: typing, clicking. Non-urgent: switching tabs, filtering a big list.',
        'React 19: <code>startTransition</code> accepts async functions (these are "Actions").',
        'Don’t use it for controlled input values; the input must update urgently.',
      ],
      detail: `<pre><code>const [isPending, startTransition] = useTransition();

function selectTab(next) {
  startTransition(() =&gt; {
    setTab(next); // can be interrupted
  });
}</code></pre>`,
    },
    {
      title: 'useDeferredValue',
      level: 'advanced',
      summary: 'Gives you a "lagging" copy of a value so slow parts of the UI can update later.',
      points: [
        'Typical use: <code>const deferredQuery = useDeferredValue(query)</code> for search results.',
        'The input uses <code>query</code> (instant), the slow list uses <code>deferredQuery</code>.',
        'Like a transition, but for when you don’t control the setter.',
        'Not a debounce: no fixed delay, React updates as soon as it has time.',
      ],
    },
    {
      title: 'Suspense',
      level: 'advanced',
      summary:
        'Shows a fallback while something inside is still loading (code, data or a server stream).',
      points: [
        'Works with <code>lazy</code>, <code>use(promise)</code>, Suspense-enabled libraries and streaming SSR.',
        'Plain <code>useEffect</code> fetching does NOT trigger Suspense.',
        'Place boundaries where a loading state makes sense to the user.',
        'Updates inside a transition keep old content visible instead of flashing the fallback.',
      ],
    },
    {
      title: 'Actions',
      level: 'advanced',
      summary:
        'React 19’s name for async functions run in a transition; they handle pending state, errors and forms.',
      points: [
        'Pass a function to <code>&lt;form action={fn}&gt;</code>; it receives the <code>FormData</code>.',
        'React tracks pending state and resets uncontrolled form fields after success.',
        '<code>useFormStatus()</code> (from <code>react-dom</code>) lets a child button know the form is submitting.',
        'An action can be a Server Function in frameworks like Next.js.',
      ],
      detail: `<pre><code>function Subscribe() {
  async function subscribe(formData) {
    await api.subscribe(formData.get('email'));
  }
  return (
    &lt;form action={subscribe}&gt;
      &lt;input name="email" /&gt;
      &lt;button&gt;Join&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>`,
    },
    {
      title: 'useActionState',
      level: 'advanced',
      summary: 'Wraps an action and gives you its latest result and a pending flag.',
      points: [
        '<code>const [state, formAction, isPending] = useActionState(fn, initialState)</code>.',
        'Your function gets <code>(previousState, formData)</code> and returns the new state.',
        'Perfect for showing a form error or success message.',
        'Replaced the canary-only <code>useFormState</code>.',
      ],
      detail: `<pre><code>const [error, submit, isPending] = useActionState(
  async (prev, formData) =&gt; {
    const res = await updateName(formData.get('name'));
    return res.ok ? null : res.message;
  },
  null
);

&lt;form action={submit}&gt;…&lt;/form&gt;</code></pre>`,
    },
    {
      title: 'useOptimistic',
      level: 'advanced',
      summary:
        'Shows the expected result right away while an async action runs, then settles to the real result.',
      points: [
        '<code>const [optimisticTodos, addOptimistic] = useOptimistic(todos, updateFn)</code>.',
        'Call <code>addOptimistic</code> inside an action or transition.',
        'If the action fails, the UI falls back to the real state automatically.',
        'Example: a "like" button that turns red instantly.',
      ],
    },
    {
      title: 'The use API',
      level: 'expert',
      summary:
        'use() reads a promise (suspending until it resolves) or a context, and can be called conditionally.',
      points: [
        '<code>const user = use(userPromise)</code> suspends until the promise settles.',
        'Errors go to the nearest error boundary.',
        'Don’t create the promise during a client render; pass it from a Server Component, loader or cache.',
        'Unlike other hooks, it can be called inside <code>if</code> or loops.',
        '<code>use(SomeContext)</code> works like <code>useContext</code>.',
      ],
    },
    {
      title: 'Other React 19 Changes',
      level: 'advanced',
      summary:
        'Smaller upgrades: document metadata, Activity, better errors and removed legacy APIs.',
      points: [
        'Render <code>&lt;title&gt;</code> and <code>&lt;meta&gt;</code> anywhere; React hoists them to the head.',
        '<code>&lt;Activity mode="hidden"&gt;</code> (19.2) hides UI but keeps its state.',
        'Removed: <code>ReactDOM.render</code>, string refs, <code>propTypes</code> and <code>defaultProps</code> on function components.',
        'Hydration errors now show a single clear diff of the mismatch.',
        'Upgrade from 18.3 first: it warns about everything 19 removes.',
      ],
    },
  ],
};
