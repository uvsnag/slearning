import type { KmNode } from '../../types';

export const effectsRefs: KmNode = {
  title: 'Effects & Refs',
  level: 'intermediate',
  summary: 'Sync your component with things outside React, and keep values or DOM nodes in refs.',
  simple:
    'Effects and refs are React’s "escape hatches": doors out of the React world to talk to the browser, timers, sockets or other libraries.',
  points: [
    'Effects run after React updates the screen.',
    'Refs hold a value that doesn’t cause a re-render when it changes.',
    'Both are escape hatches. If you can do it without them, do.',
  ],
  children: [
    {
      title: 'useEffect',
      level: 'intermediate',
      summary:
        'Runs code after render to sync with an outside system (network, DOM, timers, subscriptions).',
      simple:
        'Rendering draws the picture. An effect is the note "after you’re done drawing, also connect to the chat server".',
      points: [
        'Signature: <code>useEffect(setup, dependencies)</code>.',
        'Runs after the browser paints, so it doesn’t block the screen.',
        'Good for: subscriptions, connecting to a socket, syncing with a non-React widget.',
        'Not for: computing data for render or handling user actions.',
      ],
      detail: `<pre><code>useEffect(() =&gt; {
  const conn = createConnection(roomId);
  conn.connect();
  return () =&gt; conn.disconnect(); // cleanup
}, [roomId]);</code></pre>`,
    },
    {
      title: 'Dependency Array',
      level: 'intermediate',
      summary:
        'The list of values an effect uses; React re-runs the effect when any of them change.',
      simple:
        'It’s the effect’s shopping list. If anything on the list changed since last time, the effect runs again.',
      points: [
        'No array: runs after every render.',
        '<code>[]</code>: runs once after mount (and cleans up on unmount).',
        '<code>[a, b]</code>: runs when <code>a</code> or <code>b</code> changed (compared with <code>Object.is</code>).',
        'List every reactive value used inside: props, state, and things computed from them.',
        'Objects and functions made during render are new every time, so they re-trigger the effect.',
      ],
      tip: 'Never silence the exhaustive-deps lint rule. If a dependency is annoying, change the code (move it inside the effect, or use an updater function).',
    },
    {
      title: 'Cleanup',
      level: 'intermediate',
      summary:
        'The function your effect returns; React calls it before re-running the effect and on unmount.',
      simple:
        'If the effect turns the tap on, cleanup turns it off. Without it, taps keep running and the sink overflows (memory leaks, double listeners).',
      points: [
        'Unsubscribe, clear timers, remove listeners, close connections.',
        'Order: cleanup with old values, then setup with new values.',
        'For fetches, use an <code>ignore</code> flag or <code>AbortController</code> to drop stale responses.',
      ],
      detail: `<pre><code>useEffect(() =&gt; {
  const id = setInterval(tick, 1000);
  return () =&gt; clearInterval(id);
}, []);</code></pre>`,
    },
    {
      title: 'StrictMode Double Run',
      level: 'intermediate',
      summary:
        'In development, StrictMode runs setup, cleanup, then setup again to test your cleanup.',
      simple:
        'It’s a fire drill. React quickly mounts, unmounts and remounts to check you leave nothing behind.',
      points: [
        'Only in development; production runs effects once.',
        'If the double run breaks something, your cleanup is missing or wrong.',
        'Fix the cleanup; don’t try to block the second run with a ref flag.',
      ],
      tip: 'Seeing two fetch requests in dev? That’s StrictMode. Make sure the first result is ignored via cleanup.',
    },
    {
      title: 'You Might Not Need an Effect',
      level: 'intermediate',
      summary:
        'Many effects are unnecessary; derive values during render or handle logic in event handlers.',
      simple:
        'Effects are for talking to the outside world. Using them to copy data from one state to another is like texting yourself a note to remember a note.',
      points: [
        'Derived data: compute it during render (<code>const fullName = first + " " + last</code>).',
        'Expensive derived data: <code>useMemo</code>, not effect + state.',
        'User actions (submit, buy): do it in the event handler.',
        'Reset state when a prop changes: use a <code>key</code>.',
        'Chains of effects setting state cause extra renders and bugs.',
      ],
      detail: `<pre><code>// Avoid
const [visible, setVisible] = useState([]);
useEffect(() =&gt; {
  setVisible(todos.filter((t) =&gt; !t.done));
}, [todos]);

// Better
const visible = todos.filter((t) =&gt; !t.done);</code></pre>`,
      tip: 'Rule of thumb: if no outside system is involved, you probably don’t need an effect.',
    },
    {
      title: 'useEffectEvent',
      level: 'advanced',
      summary:
        'Wraps logic that should read the latest props/state without making the effect re-run.',
      points: [
        'Stable since React 19.2.',
        'Use for "non-reactive" logic inside an effect, like logging with the current theme.',
        'Call it only from inside effects; don’t pass it to other components or add it to deps.',
      ],
      detail: `<pre><code>const onConnected = useEffectEvent(() =&gt; {
  showToast('Connected!', theme); // reads latest theme
});

useEffect(() =&gt; {
  const conn = connect(roomId);
  conn.on('connected', onConnected);
  return () =&gt; conn.disconnect();
}, [roomId]); // theme change does NOT reconnect</code></pre>`,
    },
    {
      title: 'useRef',
      level: 'intermediate',
      summary: 'Stores a mutable value in .current that survives renders but doesn’t trigger one.',
      simple:
        'A ref is a secret pocket. You can put things in and take them out any time, and React never notices or redraws.',
      points: [
        'Create: <code>const ref = useRef(initial)</code>; read/write <code>ref.current</code>.',
        'Good for timer ids, previous values, or an instance of a non-React library.',
        'Don’t read or write <code>ref.current</code> during render (except lazy init).',
        'If the UI should show the value, it belongs in state, not a ref.',
      ],
    },
    {
      title: 'DOM Refs',
      level: 'intermediate',
      summary:
        'Attach a ref to a JSX element to reach the real DOM node, e.g. to focus or measure it.',
      simple:
        'React normally handles the DOM for you. A DOM ref is a direct phone line to one element when you really need it.',
      points: [
        'Pass it as <code>ref={inputRef}</code>; React sets <code>.current</code> after commit.',
        'Use for focus, scroll, measuring size, playing media.',
        'Don’t change DOM that React manages (like removing its children) through a ref.',
      ],
      detail: `<pre><code>function Search() {
  const inputRef = useRef(null);
  return (
    &lt;&gt;
      &lt;input ref={inputRef} /&gt;
      &lt;button onClick={() =&gt; inputRef.current.focus()}&gt;Focus&lt;/button&gt;
    &lt;/&gt;
  );
}</code></pre>`,
    },
    {
      title: 'ref as a Prop',
      level: 'intermediate',
      summary:
        'In React 19, function components receive ref as a normal prop; forwardRef is no longer needed.',
      simple:
        'Before, you needed a special adapter (forwardRef) to pass a ref through your component. Now it’s just another prop.',
      points: [
        'React 19: <code>function MyInput({ ref, ...props })</code> just works.',
        'React 18 and older: wrap with <code>forwardRef((props, ref) =&gt; …)</code>.',
        '<code>forwardRef</code> still works but is planned for deprecation.',
        'Ref callbacks can now return a cleanup function (React 19).',
        '<code>useImperativeHandle</code> exposes a small custom API instead of the whole DOM node.',
      ],
      detail: `<pre><code>function MyInput({ ref, ...props }) {
  return &lt;input ref={ref} {...props} /&gt;;
}

&lt;MyInput ref={inputRef} placeholder="Name" /&gt;</code></pre>`,
    },
    {
      title: 'useLayoutEffect',
      level: 'advanced',
      summary:
        'Like useEffect, but runs before the browser paints, so you can measure and fix layout without flicker.',
      points: [
        'Use for tooltips or popovers that need to measure size, then position themselves.',
        'Blocks painting, so keep it fast; prefer useEffect by default.',
        'Doesn’t run on the server; useEffect is fine for most SSR cases.',
        '<code>useInsertionEffect</code> is for CSS-in-JS library authors only.',
      ],
    },
  ],
};
