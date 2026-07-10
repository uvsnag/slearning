// Interview data: reactjs
// Auto-generated from pv.html
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
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
      {
        q: 'What is React.memo? How is it different from useMemo?',
        difficulty: 'tricky',
        a: `<ul>
<li><strong>React.memo</strong>: a HOC that memoizes a <strong>component</strong>. Skips re-render if props haven't changed (shallow comparison).</li>
<li><strong>useMemo</strong>: a hook that memoizes a <strong>computed value</strong> inside a component.</li>
</ul>
<pre>// React.memo: wraps a component
const ExpensiveList = React.memo(({ items }) => {
  return items.map(item => &lt;li key={item.id}&gt;{item.name}&lt;/li&gt;);
});
// Won't re-render if 'items' reference is the same

// Custom comparison function
const MemoizedComp = React.memo(MyComponent, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id; // only re-render if id changes
});

// useMemo: memoizes a VALUE
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);</pre>
<div class="key-point">Trick: <code>React.memo</code> does SHALLOW comparison. If you pass <code>style={{ color: 'red' }}</code>, it creates a new object every render → memo is useless. Move objects outside or use useMemo.</div>`,
      },
      {
        q: 'What is useTransition and useDeferredValue in React 18?',
        difficulty: 'hard',
        a: `<p>React 18 introduced concurrent features for keeping the UI responsive during expensive updates.</p>
<pre>// useTransition: mark updates as non-urgent
function SearchPage() {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    setQuery(e.target.value);            // urgent: update input immediately
    startTransition(() => {
      setSearchResults(e.target.value);  // non-urgent: can be interrupted
    });
  }

  return (
    &lt;div&gt;
      &lt;input value={query} onChange={handleChange} /&gt;
      {isPending ? &lt;Spinner /&gt; : &lt;Results /&gt;}
    &lt;/div&gt;
  );
}

// useDeferredValue: defer re-rendering with a stale value
function List({ query }) {
  const deferredQuery = useDeferredValue(query);
  // deferredQuery lags behind query during heavy rendering
  const items = useMemo(() => filterItems(deferredQuery), [deferredQuery]);
  return items.map(item => &lt;Item key={item.id} item={item} /&gt;);
}</pre>
<div class="key-point"><code>useTransition</code> = you control the state update. <code>useDeferredValue</code> = you defer a value you receive as a prop. Both prevent UI jank during expensive renders.</div>`,
      },
      {
        q: 'What is the useId hook? Why was it introduced?',
        difficulty: 'medium',
        a: `<p><code>useId</code> generates a unique ID that is stable across server and client rendering — solving hydration mismatches.</p>
<pre>function FormField({ label }) {
  const id = useId();  // e.g., ":r1:"

  return (
    &lt;div&gt;
      &lt;label htmlFor={id}&gt;{label}&lt;/label&gt;
      &lt;input id={id} /&gt;
    &lt;/div&gt;
  );
}

// For multiple elements:
function PasswordField() {
  const id = useId();
  return (
    &lt;&gt;
      &lt;input id={\`\${id}-password\`} type="password" /&gt;
      &lt;input id={\`\${id}-confirm\`} type="password" /&gt;
    &lt;/&gt;
  );
}</pre>
<div class="key-point">Never use <code>useId</code> for list keys. It's designed for accessibility attributes (htmlFor, aria-describedby). For list keys, use data IDs.</div>`,
      },
      {
        q: 'What is prop drilling and how to avoid it?',
        difficulty: 'medium',
        a: `<p><strong>Prop drilling</strong>: passing props through multiple intermediate components that don't need them, just to reach a deeply nested component.</p>
<pre>// Prop drilling problem:
&lt;App user={user}&gt;
  &lt;Layout user={user}&gt;     {/* doesn't use user */}
    &lt;Sidebar user={user}&gt;  {/* doesn't use user */}
      &lt;Avatar user={user} /&gt;  {/* only this needs user! */}
    &lt;/Sidebar&gt;
  &lt;/Layout&gt;
&lt;/App&gt;</pre>
<p><strong>Solutions:</strong></p>
<ul>
<li><strong>Context API</strong>: <code>createContext</code> + <code>useContext</code></li>
<li><strong>Component composition</strong>: pass components as children/props</li>
<li><strong>State management</strong>: Zustand, Jotai, Redux</li>
</ul>
<pre>// Composition pattern (often best):
&lt;App&gt;
  &lt;Layout sidebar={&lt;Sidebar avatar={&lt;Avatar user={user} /&gt;} /&gt;}&gt;
    {children}
  &lt;/Layout&gt;
&lt;/App&gt;
// Layout and Sidebar don't need to know about 'user'</pre>
<div class="key-point">Before reaching for Context or a state library, try component composition first. It's simpler and avoids unnecessary re-renders.</div>`,
      },
      {
        q: 'What is React Strict Mode? What does it do?',
        difficulty: 'medium',
        a: `<p><code>&lt;React.StrictMode&gt;</code> activates additional development-only checks to find common bugs.</p>
<ul>
<li><strong>Double-invokes</strong> render, effects, and state updaters to detect side effects.</li>
<li>Warns about <strong>deprecated APIs</strong> (findDOMNode, legacy context, string refs).</li>
<li>Warns about unsafe lifecycle methods.</li>
</ul>
<pre>// Wraps your app (or part of it)
root.render(
  &lt;React.StrictMode&gt;
    &lt;App /&gt;
  &lt;/React.StrictMode&gt;
);

// In React 18, effects run → cleanup → re-run in dev
// This catches bugs like missing cleanup functions
useEffect(() => {
  const subscription = subscribe();
  return () => subscription.unsubscribe(); // cleanup
  // Without cleanup, StrictMode would show duplicate subscriptions
}, []);</pre>
<div class="key-point">Trick question: "Why does my useEffect run twice?" — It's StrictMode in development. It does NOT happen in production. Don't remove StrictMode to "fix" it — fix your effect instead.</div>`,
      },
      {
        q: 'What are React error boundaries? How do they work?',
        difficulty: 'hard',
        a: `<p>Error boundaries catch JavaScript errors in the component tree and display a fallback UI instead of crashing the whole app.</p>
<pre>class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to error reporting service
    logErrorToService(error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return &lt;h2&gt;Something went wrong.&lt;/h2&gt;;
    }
    return this.props.children;
  }
}

// Usage:
&lt;ErrorBoundary&gt;
  &lt;Dashboard /&gt;  {/* if this crashes, fallback UI shows */}
&lt;/ErrorBoundary&gt;</pre>
<p><strong>Limitations:</strong></p>
<ul>
<li>Only catches errors in <strong>rendering, lifecycle methods, constructors</strong>.</li>
<li>Does NOT catch: event handlers, async code, SSR, errors in the boundary itself.</li>
<li>Must be a class component (no hook equivalent yet).</li>
</ul>
<div class="key-point">Use <code>react-error-boundary</code> library for a hook-friendly API with reset functionality. Place boundaries strategically — around routes, widgets, or features.</div>`,
      },
      {
        q: 'What are the rules of React hooks?',
        difficulty: 'tricky',
        a: `<p>Two strict rules enforced by the <code>eslint-plugin-react-hooks</code>:</p>
<ol>
<li><strong>Only call hooks at the top level</strong> — not inside loops, conditions, or nested functions.</li>
<li><strong>Only call hooks from React functions</strong> — React components or custom hooks (prefixed with <code>use</code>).</li>
</ol>
<pre>// ❌ WRONG: conditional hook
function Component({ isAdmin }) {
  if (isAdmin) {
    const [admin, setAdmin] = useState(false); // breaks hook order!
  }
}

// ✅ CORRECT: always call, conditionally use
function Component({ isAdmin }) {
  const [admin, setAdmin] = useState(false);
  // use admin only if isAdmin
  if (isAdmin) { /* ... */ }
}

// ❌ WRONG: hook inside regular function
function helper() {
  const [state, setState] = useState(0); // not a component or custom hook!
}

// ✅ CORRECT: custom hook
function useHelper() {  // starts with 'use'
  const [state, setState] = useState(0);
  return state;
}</pre>
<div class="key-point">React relies on the ORDER hooks are called to match state to the right hook. If order changes between renders (due to conditions), React gets confused and bugs appear.</div>`,
      },
      {
        q: 'How does React handle forms? Controlled vs uncontrolled vs React Hook Form.',
        difficulty: 'medium',
        a: `<pre>// 1. Controlled: React manages every keystroke
function ControlledForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  return &lt;form onSubmit={handleSubmit}&gt;
    &lt;input value={email} onChange={e => setEmail(e.target.value)} /&gt;
    &lt;input value={password} onChange={e => setPassword(e.target.value)} /&gt;
  &lt;/form&gt;;
  // Re-renders on every keystroke!
}

// 2. Uncontrolled: DOM manages state, read on submit
function UncontrolledForm() {
  const handleSubmit = (e) => {
    const formData = new FormData(e.target);
    console.log(Object.fromEntries(formData));
  };
  return &lt;form onSubmit={handleSubmit}&gt;
    &lt;input name="email" defaultValue="" /&gt;
    &lt;input name="password" defaultValue="" /&gt;
  &lt;/form&gt;;
}

// 3. React Hook Form: best performance (uncontrolled + validation)
function RHFForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  return &lt;form onSubmit={handleSubmit(onSubmit)}&gt;
    &lt;input {...register('email', { required: true })} /&gt;
    {errors.email && &lt;span&gt;Required&lt;/span&gt;}
  &lt;/form&gt;;
}</pre>
<div class="key-point">For complex forms, React Hook Form or Formik avoid the re-render-per-keystroke problem of controlled components.</div>`,
      },
      // ───────────────────────── ADDITIONAL REACT QUESTIONS ─────────────────────────
      // {
      //   id: 'react-advanced',
      //   name: 'React Advanced',
      //   icon: '⚛️+',
      //   questions: [
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
      //   ],
      // },
    ],
  },
];
