// Interview data: reactjs
// Auto-generated from pv.html
(function () {
  (window.__pvTopics = window.__pvTopics || []).push(
  {
          id: 'reactjs',
          name: 'ReactJS',
          icon: '⚛️',
          questions: [
            {
              q: 'What is the Virtual DOM and how does React reconciliation work?',
              difficulty: 'medium',
              a: `<ul>
<li><strong>Virtual DOM</strong>: lightweight JS representation of the real DOM.</li>
<li><strong>Reconciliation</strong>: React diffs the new VDOM tree with the old one and computes minimal changes (<strong>diffing algorithm</strong>).</li>
<li>Two heuristics: (1) different element types → rebuild entire subtree; (2) <code>key</code> prop identifies items in lists.</li>
</ul>
<div class="key-point">React Fiber (React 16+) broke rendering into units of work, enabling prioritization and interruption of renders.</div>`,
            },
            {
              q: 'Explain the React component lifecycle (class and hooks).',
              difficulty: 'medium',
              a: `<p><strong>Class lifecycle</strong>:</p>
<ul>
<li>Mount: <code>constructor</code> → <code>render</code> → <code>componentDidMount</code></li>
<li>Update: <code>shouldComponentUpdate</code> → <code>render</code> → <code>componentDidUpdate</code></li>
<li>Unmount: <code>componentWillUnmount</code></li>
</ul>
<p><strong>Hooks equivalent</strong>:</p>
<pre>useEffect(() => {
  // componentDidMount + componentDidUpdate
  return () => {
    // componentWillUnmount (cleanup)
  };
}, [deps]);</pre>
<div class="key-point"><code>useEffect</code> with <code>[]</code> = mount only. With <code>[dep]</code> = runs when dep changes. No array = every render.</div>`,
            },
            {
              q: 'What is the difference between useState and useReducer?',
              difficulty: 'medium',
              a: `<ul>
<li><strong>useState</strong>: simple state (primitives, toggles). Direct set.</li>
<li><strong>useReducer</strong>: complex state logic, multiple sub-values, or when next state depends on previous.</li>
</ul>
<pre>const [state, dispatch] = useReducer(reducer, initialState);

function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { ...state, count: state.count + 1 };
    case 'decrement': return { ...state, count: state.count - 1 };
    default: return state;
  }
}</pre>
<div class="key-point">Rule of thumb: if your state update logic requires more than 2-3 conditions, use <code>useReducer</code>.</div>`,
            },
            {
              q: 'What is useCallback vs useMemo?',
              difficulty: 'medium',
              a: `<ul>
<li><strong>useMemo</strong>: memoizes a <strong>computed value</strong>. Avoids expensive recalculation.</li>
<li><strong>useCallback</strong>: memoizes a <strong>function reference</strong>. Prevents child re-renders when passing callbacks.</li>
</ul>
<pre>const expensiveResult = useMemo(() => computeExpensive(data), [data]);
const handleClick = useCallback(() => doSomething(id), [id]);</pre>
<div class="key-point"><code>useCallback(fn, deps)</code> is equivalent to <code>useMemo(() => fn, deps)</code>.</div>`,
            },
            {
              q: 'What causes unnecessary re-renders and how to prevent them?',
              difficulty: 'hard',
              a: `<p><strong>Causes</strong>:</p>
<ul>
<li>Parent re-renders → all children re-render.</li>
<li>New object/array/function references on every render.</li>
<li>Context value changes.</li>
</ul>
<p><strong>Solutions</strong>:</p>
<ul>
<li><code>React.memo(Component)</code> – skip re-render if props unchanged (shallow compare).</li>
<li><code>useMemo</code> / <code>useCallback</code> – stabilize references.</li>
<li>Split context into multiple smaller contexts.</li>
<li>Move state down closer to where it's used.</li>
<li>Use <code>children</code> pattern to avoid re-rendering static parts.</li>
</ul>`,
            },
            {
              q: 'Explain React Context API. What are its limitations?',
              difficulty: 'medium',
              a: `<p><code>createContext</code> + <code>Provider</code> + <code>useContext</code> enables sharing state without prop drilling.</p>
<p><strong>Limitations</strong>:</p>
<ul>
<li><strong>Any</strong> consumer re-renders when context value changes, even if it only uses part of it.</li>
<li>Not a state management solution — no built-in selectors, middleware, or devtools.</li>
<li>Deeply nested providers can become hard to manage ("Provider hell").</li>
</ul>
<div class="key-point">Optimization: split into separate contexts (e.g., <code>ThemeContext</code> vs <code>AuthContext</code>), or use a library like Zustand/Jotai for fine-grained reactivity.</div>`,
            },
            {
              q: 'What are React custom hooks? Give an example.',
              difficulty: 'medium',
              a: `<p>Custom hooks extract <strong>reusable stateful logic</strong>. Must start with <code>use</code> prefix.</p>
<pre>function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage
const [theme, setTheme] = useLocalStorage('theme', 'light');</pre>`,
            },
            {
              q: 'What is the difference between controlled and uncontrolled components?',
              difficulty: 'easy',
              a: `<ul>
<li><strong>Controlled</strong>: form value managed by React state. <code>&lt;input value={val} onChange={...} /&gt;</code></li>
<li><strong>Uncontrolled</strong>: form value managed by the DOM. Access via <code>useRef</code>.</li>
</ul>
<pre>// Controlled
const [name, setName] = useState('');
&lt;input value={name} onChange={e => setName(e.target.value)} /&gt;

// Uncontrolled
const inputRef = useRef();
&lt;input ref={inputRef} defaultValue="default" /&gt;
// Read: inputRef.current.value</pre>
<div class="key-point">Controlled = React is single source of truth. Preferred for validation, conditional disable, etc.</div>`,
            },
            {
              q: 'What is React.lazy and Suspense? Explain code splitting.',
              difficulty: 'medium',
              a: `<p><strong>Code splitting</strong>: break bundle into smaller chunks loaded on demand.</p>
<pre>const LazyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
      &lt;LazyComponent /&gt;
    &lt;/Suspense&gt;
  );
}</pre>
<ul>
<li><code>React.lazy</code> takes a function returning a dynamic <code>import()</code>.</li>
<li><code>Suspense</code> shows fallback while chunk loads.</li>
<li>Route-based splitting is the most impactful strategy.</li>
</ul>`,
            },
            {
              q: 'What is the useRef hook? When to use it vs useState?',
              difficulty: 'medium',
              a: `<ul>
<li><code>useRef</code> returns a mutable <code>.current</code> property that persists across renders.</li>
<li>Changing <code>.current</code> does <strong>NOT</strong> trigger re-render.</li>
</ul>
<p><strong>Use cases</strong>:</p>
<ul>
<li>Access DOM elements: <code>&lt;input ref={inputRef} /&gt;</code></li>
<li>Store previous value, interval IDs, or any mutable value without causing re-render.</li>
</ul>
<pre>const renderCount = useRef(0);
useEffect(() => {
  renderCount.current++; // doesn't cause re-render
});</pre>`,
            },
            {
              q: 'Explain React Server Components (RSC) and their benefits.',
              difficulty: 'hard',
              a: `<ul>
<li><strong>Server Components</strong>: render on the server, send serialized output (not HTML). Zero client-side JS bundle.</li>
<li><strong>Client Components</strong>: marked with <code>'use client'</code>. Include interactivity.</li>
</ul>
<p><strong>Benefits</strong>:</p>
<ul>
<li>Direct database/filesystem access from components.</li>
<li>Smaller client bundles (server-only code never shipped).</li>
<li>Automatic code splitting.</li>
</ul>
<div class="key-point">RSC ≠ SSR. SSR renders to HTML for first paint. RSC renders to a streaming format that React can merge into the client tree.</div>`,
            },
            {
              q: 'How does React handle keys in lists? Why are they important?',
              difficulty: 'tricky',
              a: `<p><code>key</code> helps React identify which items changed, added, or removed during reconciliation.</p>
<ul>
<li><strong>Stable, unique key</strong>: React reuses DOM nodes efficiently.</li>
<li><strong>Index as key</strong>: causes bugs when list is reordered, filtered, or items are added in the middle.</li>
<li><strong>No key / duplicate key</strong>: React falls back to index, with warnings.</li>
</ul>
<div class="key-point">Trick: using <code>Math.random()</code> as key forces remount on every render → terrible performance. Use stable IDs.</div>`,
            },
            {
              q: 'What are Higher-Order Components (HOC) vs Render Props vs Hooks?',
              difficulty: 'hard',
              a: `<ul>
<li><strong>HOC</strong>: function that takes a component, returns enhanced component. <code>withAuth(Component)</code>. Can cause wrapper hell.</li>
<li><strong>Render Props</strong>: component calls a function prop to delegate rendering. <code>&lt;Mouse render={pos => ...} /&gt;</code>. Flexible but verbose.</li>
<li><strong>Hooks</strong>: extract reusable logic into functions. <code>useAuth()</code>. Modern, composable, no nesting.</li>
</ul>
<div class="key-point">Hooks replaced most HOC and Render Props patterns. HOCs are still used for cross-cutting concerns in class components or library wrappers.</div>`,
            },
            {
              q: 'What is useEffect cleanup? When does it run?',
              difficulty: 'medium',
              a: `<p>The function returned from <code>useEffect</code> is the <strong>cleanup function</strong>.</p>
<pre>useEffect(() => {
  const subscription = subscribe(id);
  return () => subscription.unsubscribe(); // cleanup
}, [id]);</pre>
<p><strong>When it runs</strong>:</p>
<ul>
<li>Before every re-execution of the effect (when deps change).</li>
<li>When the component unmounts.</li>
</ul>
<div class="key-point">Common bug: forgetting cleanup for intervals, event listeners, or subscriptions → memory leaks.</div>`,
            },
            {
              q: 'Explain React state batching. What changed in React 18?',
              difficulty: 'hard',
              a: `<ul>
<li><strong>Before React 18</strong>: only batched state updates in React event handlers. Updates in setTimeout, promises, native events were NOT batched.</li>
<li><strong>React 18+</strong>: <strong>automatic batching</strong> everywhere (setTimeout, promises, native events included).</li>
</ul>
<pre>// React 18: single re-render for both
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
  // only ONE re-render
}, 1000);</pre>
<div class="key-point">Use <code>flushSync()</code> to opt out of batching when you need synchronous DOM updates.</div>`,
            },
            {
              q: 'What is the difference between useLayoutEffect and useEffect?',
              difficulty: 'tricky',
              a: `<ul>
<li><strong>useEffect</strong>: runs <strong>after</strong> paint (asynchronously). Non-blocking.</li>
<li><strong>useLayoutEffect</strong>: runs <strong>before</strong> paint (synchronously after DOM mutations). Blocks visual updates.</li>
</ul>
<p><strong>Use <code>useLayoutEffect</code> when</strong>:</p>
<ul>
<li>You need to measure DOM (width/height) before the user sees it.</li>
<li>You need to synchronously update DOM to prevent flicker.</li>
</ul>
<div class="key-point">99% of the time, <code>useEffect</code> is correct. Only use <code>useLayoutEffect</code> if you see visual flickering.</div>`,
            },
          ],
        },

        // ───────────────────────── 4. CI/CD ─────────────────────────
  );
})();
