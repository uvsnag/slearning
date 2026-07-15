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
        a: `<div class="interview-answer"><p>The Virtual DOM is just an in-memory JS tree that lets React batch and minimize expensive real-DOM writes while I keep writing declarative code. Reconciliation is the diff step: React compares the new tree against the old one and computes the smallest patch, using two O(n) heuristics — a different element type means blow away the whole subtree, the same type means keep the node and just update attributes, and the <code>key</code> prop matches list children so they can be reordered instead of rebuilt. The myth I always kill is that the VDOM is faster than the real DOM — it isn't, it's an extra layer whose payoff is fewer, batched mutations. Since React 16, Fiber rewrote this to be interruptible, which is what unlocked concurrent features.</p></div>
<p>The <strong>Virtual DOM (VDOM)</strong> is a lightweight JavaScript object tree that mirrors the real DOM. React keeps one in memory and uses it as a staging area: instead of mutating the real DOM directly on every state change, React first updates the cheap in-memory tree, then figures out the smallest set of real DOM operations needed.</p>
<p><strong>Why bother?</strong> Real DOM mutations are expensive (they trigger layout, style recalculation, and paint). Reading/writing a plain JS object is cheap. By batching and minimizing real DOM writes, React lets you write simple declarative code (<em>"UI is a function of state"</em>) while it handles efficient updates under the hood.</p>
<p><strong>Reconciliation</strong> is the process where React <em>diffs</em> the new VDOM tree against the previous one and computes the minimal patch. A truly optimal tree diff is O(n³), which is unusable, so React uses two heuristics to get O(n):</p>
<ul>
<li><strong>Different element type → throw it away.</strong> If a node changes from <code>&lt;div&gt;</code> to <code>&lt;span&gt;</code> (or from <code>ComponentA</code> to <code>ComponentB</code>), React unmounts the whole subtree and rebuilds it — it never tries to diff across types.</li>
<li><strong>Same type → keep the DOM node, update changed attributes,</strong> then recurse into children.</li>
<li><strong>Lists use the <code>key</code> prop</strong> to match children between renders, so React can reorder/reuse nodes instead of recreating them.</li>
</ul>
<pre>// State change → React builds a NEW virtual tree
// old:  &lt;ul&gt;&lt;li&gt;A&lt;/li&gt;&lt;li&gt;B&lt;/li&gt;&lt;/ul&gt;
// new:  &lt;ul&gt;&lt;li&gt;A&lt;/li&gt;&lt;li&gt;B&lt;/li&gt;&lt;li&gt;C&lt;/li&gt;&lt;/ul&gt;
// Diff result: keep A and B untouched, INSERT one &lt;li&gt;C&lt;/li&gt;
// → one real DOM insertion instead of rebuilding the whole list</pre>
<p>Then comes the <strong>commit phase</strong>: React applies the computed changes to the real DOM in one batch.</p>
<div class="key-point">Common myth: "the Virtual DOM is faster than the real DOM." It isn't — it's an <em>extra</em> layer. The win is that it lets React <em>minimize and batch</em> real DOM writes while you write declarative code. React Fiber (16+) rewrote reconciliation to split work into interruptible units, enabling prioritization, time-slicing, and concurrent features.</div>`,
      },
      {
        q: 'Explain the React component lifecycle (class and hooks).',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>I map it to three phases — mount, update, unmount — but in modern React I rarely think in class methods anymore; it's all <code>useEffect</code>. <code>componentDidMount</code>, <code>componentDidUpdate</code>, and <code>componentWillUnmount</code> collapse into a single effect with a cleanup return and a dependency array. The gotcha I always raise is that an effect is not really a lifecycle hook — it's a synchronization mechanism keyed on its deps, so the right question is what this effect depends on, not when in the lifecycle it fires. Get that reframe right and the deps array stops feeling arbitrary.</p></div>
<p><strong>Class lifecycle</strong>:</p>
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
        a: `<div class="interview-answer"><p>They're two ends of one spectrum — <code>useState</code> is literally built on top of <code>useReducer</code>. My deciding question is where the update logic should live: <code>useState</code> when the call site can just set a value like a toggle or an input, <code>useReducer</code> when several values change together, the next state depends on the previous, or the same state is updated from many places. The reducer being a pure <code>(state, action)</code> function means I can unit-test every transition with zero React, and <code>dispatch</code> has a stable identity so passing it deep never causes re-renders. I won't reach for it on a single text field though — that's just over-engineering.</p></div>
<p>Both manage state in a function component — they are two ends of the same spectrum. <code>useState</code> is a thin convenience built <em>on top of</em> <code>useReducer</code>. The real question is <strong>where the update logic lives</strong>.</p>
<ul>
<li><strong>useState</strong> — you call <code>setX(newValue)</code> directly at the call site. Best for independent, simple values: toggles, inputs, counters, a single object.</li>
<li><strong>useReducer</strong> — you <code>dispatch({ type })</code> an action and a single <code>reducer</code> function decides the next state. Best when several values change together, when the next state depends on the previous one, or when the same state is updated from many places.</li>
</ul>
<pre>const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });

function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { ...state, count: state.count + state.step };
    case 'decrement': return { ...state, count: state.count - state.step };
    case 'reset':     return { ...state, count: 0 };
    default: return state;
  }
}
// Components just dispatch intent — they don't know HOW state changes:
&lt;button onClick={() => dispatch({ type: 'increment' })}&gt;+&lt;/button&gt;</pre>
<p><strong>Why reach for useReducer?</strong></p>
<ul>
<li><strong>Centralized, testable logic</strong> — the reducer is a pure function <code>(state, action) => newState</code> you can unit-test with zero React.</li>
<li><strong>Predictable transitions</strong> — all the ways state can change live in one <code>switch</code>, so complex flows (form wizards, fetch loading/success/error) are easy to reason about.</li>
<li><strong>Stable <code>dispatch</code></strong> — its identity never changes across renders, so passing it deep (via Context or props) never causes re-renders, unlike a fresh setter closure.</li>
</ul>
<div class="key-point">Rule of thumb: reach for <code>useReducer</code> when several pieces of state change together, when updates depend on the previous state through multiple branches, or when you find yourself passing many setters down the tree. For a single toggle or text field, <code>useState</code> is clearer — don't over-engineer.</div>`,
      },
      {
        q: 'What is useCallback vs useMemo?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Both memoize on a deps array; the only difference is what they cache — <code>useMemo</code> caches a computed value, <code>useCallback</code> caches the function reference itself. In fact <code>useCallback(fn, deps)</code> is just <code>useMemo</code> returning <code>fn</code>. The reason identity matters at all is that every render creates fresh objects and functions, which breaks a <code>React.memo</code> child or a dependency-array comparison. The number-one gotcha: they only help if the consumer actually cares about referential equality — wrapping a handler passed to a plain <code>&lt;button&gt;</code> is pure overhead, and I never put correctness-critical logic inside them since React is allowed to drop the cache.</p></div>
<p>Both cache something between renders and recompute only when their dependency array changes. The difference is <strong>what they cache</strong>:</p>
<ul>
<li><strong>useMemo</strong> caches a <strong>computed value</strong> — it runs the function and remembers its <em>result</em>. Use it to avoid re-running an expensive calculation on every render.</li>
<li><strong>useCallback</strong> caches a <strong>function reference itself</strong> — it remembers the <em>function</em>, not its result. Use it to keep a callback's identity stable across renders.</li>
</ul>
<pre>// useMemo → remembers the RETURNED VALUE
const sorted = useMemo(() => items.sort(compare), [items]);

// useCallback → remembers the FUNCTION
const handleClick = useCallback(() => doSomething(id), [id]);

// They are literally the same thing:
useCallback(fn, deps) === useMemo(() => fn, deps)</pre>
<p><strong>Why does a stable reference even matter?</strong> On every render, JavaScript creates brand-new object, array, and function values. Two functions with identical code are <code>!==</code> each other. That new identity breaks things that compare props by reference:</p>
<ul>
<li>A child wrapped in <code>React.memo</code> re-renders because its <code>onClick</code> prop is "new" every time.</li>
<li>A <code>useEffect</code>/<code>useMemo</code> that lists the function/value in its deps re-fires every render.</li>
</ul>
<pre>const Child = React.memo(({ onClick }) => { ... });

function Parent() {
  // ❌ new function each render → memo on Child is useless
  // const handle = () => doThing();
  // ✅ stable identity → Child only re-renders when 'id' changes
  const handle = useCallback(() => doThing(id), [id]);
  return &lt;Child onClick={handle} /&gt;;
}</pre>
<div class="key-point">The #1 gotcha: <code>useCallback</code> only helps if the consumer actually depends on referential equality (a <code>React.memo</code> child or a dependency array). Wrapping a callback passed to a plain <code>&lt;button onClick&gt;</code> does nothing but add overhead. And both hooks are a performance optimization only — never put logic your app's <em>correctness</em> depends on inside them; React may discard the cache.</div>`,
      },
      {
        q: 'What causes unnecessary re-renders and how to prevent them?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The mental model I lead with: a re-render is not a DOM update — React re-runs the function and diffs the output, so most re-renders are cheap and you only care about the ones that are frequent and expensive. Re-renders fire when state or props change, when a parent renders, or when a context value changes, and they turn unnecessary when you hand down fresh object or function references that defeat shallow comparison. My order of attack is always the same: profile with the DevTools Profiler first, then fix it structurally by moving state down or passing content as <code>children</code>, and only then reach for <code>React.memo</code>, <code>useMemo</code>, or <code>useCallback</code>. And the React Compiler is about to make most of this manual work obsolete anyway.</p></div>
<p>First, a crucial mental model: <strong>a re-render is not a DOM update.</strong> When a component re-renders, React just re-runs the function and diffs its output — if nothing changed, no DOM touches happen. So most re-renders are cheap and harmless. You only care about the ones that are <em>frequent</em> and <em>expensive</em> (big trees, heavy computation). Don't optimize blindly — measure with the React DevTools Profiler first.</p>
<p><strong>What triggers a re-render:</strong></p>
<ul>
<li><strong>State/props change</strong> in the component itself.</li>
<li><strong>Parent re-renders</strong> → by default <em>every</em> child re-renders, regardless of whether its props changed.</li>
<li><strong>Context value changes</strong> → every consumer of that context re-renders.</li>
</ul>
<p>The subtle part is what makes these fire <em>unnecessarily</em>: creating <strong>new object/array/function references</strong> during render. Since <code>{} !== {}</code>, a fresh inline value looks "changed" to any shallow comparison (<code>React.memo</code>, dependency arrays), defeating memoization.</p>
<p><strong>Solutions — and why each one works:</strong></p>
<ul>
<li><strong><code>React.memo(Component)</code></strong> — makes a child skip re-rendering when its props are shallow-equal to last time. Breaks the automatic "parent renders → child renders" chain.</li>
<li><strong><code>useMemo</code> / <code>useCallback</code></strong> — stabilize the object/function references you pass into a memoized child or a dependency array, so the shallow compare actually passes.</li>
<li><strong>Move state down</strong> — if only a small subtree reads a piece of state, push that state into a child component so state changes only re-render that subtree, not the whole page.</li>
<li><strong>Lift static content into <code>children</code></strong> — an element passed as <code>children</code> keeps the same reference when the stateful parent re-renders, so React skips re-rendering it.</li>
<li><strong>Split context</strong> — put frequently-changing and rarely-changing values in separate contexts so a change to one doesn't wake consumers of the other.</li>
</ul>
<pre>// "Move state down" — isolate the fast-changing input
// ❌ typing re-renders &lt;ExpensiveTree /&gt; on every keystroke
function Page() {
  const [text, setText] = useState('');
  return (&lt;&gt;
    &lt;input value={text} onChange={e => setText(e.target.value)} /&gt;
    &lt;ExpensiveTree /&gt;
  &lt;/&gt;);
}
// ✅ contain the state so only SearchBox re-renders
function Page() {
  return (&lt;&gt;&lt;SearchBox /&gt;&lt;ExpensiveTree /&gt;&lt;/&gt;);
}</pre>
<div class="key-point">Order of attack: (1) profile to confirm there's a real problem, (2) fix it structurally — move state down or pass children — before reaching for memo, (3) only then add <code>React.memo</code>/<code>useMemo</code>/<code>useCallback</code>, remembering they only help if <em>every</em> prop reference is stable. The upcoming React Compiler auto-memoizes and removes most of this manual work.</div>`,
      },
      {
        q: 'Explain React Context API. What are its limitations?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Context is <code>createContext</code> plus a Provider plus <code>useContext</code>, and it solves prop drilling — not state management, and that distinction matters. Its big limitation is that every consumer re-renders when the value changes by identity, even if it only reads one field, because there are no selectors. So the practical failure mode is an inline <code>value</code> object waking the entire tree on every Provider render. I fix that by memoizing the value and splitting into focused contexts, and when I genuinely need fine-grained, selector-based subscriptions I move to something like Zustand or Jotai.</p></div>
<p><code>createContext</code> + <code>Provider</code> + <code>useContext</code> enables sharing state without prop drilling.</p>
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
        a: `<div class="interview-answer"><p>A custom hook is just a function whose name starts with <code>use</code> and that calls other hooks — its job is to extract and reuse stateful logic, not markup. The insight I always stress: two components using the same hook do not share state, each call gets its own isolated copy; a custom hook shares logic, never data. The <code>use</code> prefix isn't cosmetic either — the lint plugin relies on it to enforce the Rules of Hooks. This is how modern React replaced HOCs and render props, composing behaviour with plain function calls instead of wrapper hell.</p></div>
<p>A <strong>custom hook</strong> is just a JavaScript function whose name starts with <code>use</code> and that calls other hooks. Its purpose is to <strong>extract and reuse stateful logic</strong> — the <em>behaviour</em>, not the markup — across components.</p>
<p><strong>Why the <code>use</code> prefix matters:</strong> it's not cosmetic. The linter (<code>eslint-plugin-react-hooks</code>) relies on the prefix to enforce the Rules of Hooks — a function starting with <code>use</code> is allowed to call hooks and is checked for conditional/looped calls. Without it, the tooling can't verify hook safety.</p>
<p><strong>Key insight:</strong> two components using the same custom hook <em>do not share state</em> — each call gets its own isolated state. A custom hook shares <em>logic</em>, never data. (To share data, you still need Context or a store.)</p>
<pre>function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];  // same shape as useState → familiar API
}

// Usage — reads like built-in useState, but persists to localStorage.
// Each component that calls this gets its OWN independent value.
const [theme, setTheme] = useLocalStorage('theme', 'light');</pre>
<p>Custom hooks are how modern React replaced HOCs and render props: instead of wrapping components in extra layers (wrapper hell), you compose behaviour by simply calling functions — <code>useAuth()</code>, <code>useFetch(url)</code>, <code>useDebounce(value)</code>, <code>useMediaQuery(q)</code>.</p>
<div class="key-point">A custom hook shares stateful <em>logic</em>, not <em>state</em> — every call site gets a fresh, isolated copy of the hooks inside it. Return a tuple <code>[value, setter]</code> or an object to match the ergonomics of built-in hooks, and keep each hook focused on one concern so it stays composable.</div>`,
      },
      {
        q: 'What is the difference between controlled and uncontrolled components?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Controlled means React state is the single source of truth — <code>value</code> plus <code>onChange</code> on every keystroke; uncontrolled means the DOM owns the value and you read it via a <code>ref</code> or <code>FormData</code>. I default to controlled because it makes validation, conditional disabling, and live formatting trivial. The tradeoff is a re-render per keystroke, which is why for large forms I go uncontrolled through React Hook Form. The classic bug is starting <code>value</code> as <code>undefined</code> and later flipping to a defined value — React warns you about switching a field between uncontrolled and controlled.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>Code splitting breaks the bundle into on-demand chunks so users don't download code for routes they'll never visit. <code>React.lazy</code> takes a dynamic <code>import()</code> and defers a component's code into its own chunk, and <code>Suspense</code> is the boundary that shows a fallback while that chunk loads. The highest-leverage place to split is at the route level — that's where the size wins are biggest. Two gotchas I always mention: <code>lazy</code> only works with default exports, and you must render it inside a Suspense boundary or React throws; where you place that boundary decides whether you get one spinner or independent section loading.</p></div>
<p><strong>Code splitting</strong> means breaking your JavaScript bundle into smaller chunks that load on demand, instead of shipping one giant file the user must download before seeing anything. The problem it solves: as an app grows, the single bundle balloons, and the user pays to download code for routes/features they may never visit — hurting initial load time.</p>
<p><strong><code>React.lazy</code></strong> defers loading a component until it's first rendered. It takes a function that returns a dynamic <code>import()</code> (which bundlers like Webpack/Vite split into a separate chunk automatically).</p>
<p><strong><code>Suspense</code></strong> is the boundary that shows a <code>fallback</code> UI while that chunk (or any suspending resource) is loading.</p>
<pre>// This component's code lives in its OWN chunk,
// downloaded only when &lt;LazyComponent /&gt; actually renders.
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    &lt;Suspense fallback={&lt;Spinner /&gt;}&gt;
      &lt;LazyComponent /&gt;
    &lt;/Suspense&gt;
  );
}</pre>
<p><strong>Why route-based splitting is the highest-impact strategy:</strong> a user visiting <code>/dashboard</code> shouldn't download the code for <code>/settings</code>, <code>/admin</code>, etc. Splitting at the route level means each page loads roughly only its own code.</p>
<pre>const Dashboard = React.lazy(() => import('./routes/Dashboard'));
const Settings  = React.lazy(() => import('./routes/Settings'));

&lt;Suspense fallback={&lt;PageSkeleton /&gt;}&gt;
  &lt;Routes&gt;
    &lt;Route path="/dashboard" element={&lt;Dashboard /&gt;} /&gt;
    &lt;Route path="/settings"  element={&lt;Settings /&gt;} /&gt;
  &lt;/Routes&gt;
&lt;/Suspense&gt;</pre>
<div class="key-point">Two classic gotchas: (1) <code>React.lazy</code> only works with <strong>default exports</strong> — for a named export, re-map it: <code>lazy(() =&gt; import('./x').then(m =&gt; ({ default: m.Named })))</code>. (2) Always render a lazy component <em>inside</em> a <code>Suspense</code> boundary, or React throws. Place the boundary thoughtfully — one high-up boundary gives a single spinner; nested boundaries let sections load independently.</div>`,
      },
      {
        q: 'What is the useRef hook? When to use it vs useState?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><code>useRef</code> gives you a mutable <code>{ current }</code> box that stays the same instance across renders and, crucially, mutating it does not trigger a re-render. That's the whole decision rule versus state: if the value should appear on screen and updating it should redraw the UI, use <code>useState</code>; if it's bookkeeping the render doesn't depend on — a DOM node, a timer id, the previous value — use a ref. The trap is storing UI-visible data in a ref, because the screen silently won't update when it changes. And I never read or write <code>.current</code> during render except for lazy init — that makes rendering impure.</p></div>
<p><code>useRef(initial)</code> returns a plain, mutable object <code>{ current: initial }</code> that React keeps <strong>the same instance of across every render</strong>. Think of it as an "instance variable" for a function component — a box you can read and write at any time.</p>
<p>Two properties define it, and they're exactly what distinguishes it from state:</p>
<ul>
<li>The object <strong>persists</strong> across renders (a normal local variable would be re-created each render).</li>
<li>Mutating <code>.current</code> does <strong>NOT</strong> trigger a re-render (setting state does).</li>
</ul>
<p><strong>useRef vs useState — how to choose:</strong></p>
<table>
<tr><th></th><th>useState</th><th>useRef</th></tr>
<tr><td>Change triggers re-render?</td><td>Yes</td><td>No</td></tr>
<tr><td>Value read during render?</td><td>Yes — it's the rendered UI</td><td>Avoid — may be stale/mutating</td></tr>
<tr><td>Update timing</td><td>Async (next render)</td><td>Synchronous, immediate</td></tr>
<tr><td>Use for</td><td>Data the UI displays</td><td>Values the UI does <em>not</em> display</td></tr>
</table>
<p><strong>The decision rule:</strong> if the value should appear on screen (and updating it should redraw the UI), use <code>useState</code>. If it's bookkeeping the render output doesn't depend on, use <code>useRef</code>.</p>
<pre>// 1. Accessing a DOM node
const inputRef = useRef(null);
&lt;input ref={inputRef} /&gt;
// later: inputRef.current.focus();

// 2. Holding a mutable value without re-rendering
const timerId = useRef(null);
timerId.current = setInterval(tick, 1000);   // store it
clearInterval(timerId.current);              // clear it later

// 3. Remembering the previous value of a prop/state
const prevCount = useRef(count);
useEffect(() => { prevCount.current = count; }, [count]);</pre>
<div class="key-point">Don't read or write <code>ref.current</code> <em>during</em> rendering (except lazy initialization) — it makes rendering impure and results unpredictable; touch it in event handlers or effects. And remember: because writes don't re-render, storing UI-visible data in a ref means the screen won't update when it changes — that's a bug, not an optimization.</div>`,
      },
      {
        q: 'Explain React Server Components (RSC) and their benefits.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Server Components render on the server and ship serialized output — not HTML, and critically zero client JS for that component; Client Components opt in with the <code>'use client'</code> directive and carry the interactivity. The wins are direct database and filesystem access from a component, smaller bundles because server-only code never ships, and automatic code splitting at the boundary. The distinction I always draw: RSC is not SSR — SSR renders HTML for first paint and still hydrates, whereas RSC produces a streaming format React merges into the client tree without hydrating the server-only parts.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>Keys let React match list children across renders during reconciliation so it can reuse and reorder DOM nodes instead of rebuilding them. The rule is stable, unique IDs that come from your data. Index-as-key is the classic trap — fine for a static list, but the moment you reorder, filter, or insert in the middle, component state attaches to the wrong row. And <code>Math.random()</code> as a key is the worst case: a new key every render forces a full remount and destroys both performance and any local state.</p></div>
<p><code>key</code> helps React identify which items changed, added, or removed during reconciliation.</p>
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
        a: `<div class="interview-answer"><p>All three solve the same problem — reusing logic across components — they're just successive generations. HOCs wrap a component and return an enhanced one, which leads to wrapper hell and prop-name collisions; render props pass a function to delegate rendering, flexible but verbose and prone to nesting pyramids; hooks extract logic into plain functions you compose with no extra nodes in the tree. Hooks won and replaced most of the older two. I still see HOCs for cross-cutting concerns and library wrappers, and around class components where hooks aren't available.</p></div>
<ul>
<li><strong>HOC</strong>: function that takes a component, returns enhanced component. <code>withAuth(Component)</code>. Can cause wrapper hell.</li>
<li><strong>Render Props</strong>: component calls a function prop to delegate rendering. <code>&lt;Mouse render={pos => ...} /&gt;</code>. Flexible but verbose.</li>
<li><strong>Hooks</strong>: extract reusable logic into functions. <code>useAuth()</code>. Modern, composable, no nesting.</li>
</ul>
<div class="key-point">Hooks replaced most HOC and Render Props patterns. HOCs are still used for cross-cutting concerns in class components or library wrappers.</div>`,
      },
      {
        q: 'What is useEffect cleanup? When does it run?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The cleanup is the function you return from an effect, and its job is to undo whatever the effect set up — unsubscribe, clear an interval, remove a listener. Timing-wise it runs before the effect re-runs when deps change, and once more on unmount. The model that makes it click: React tears down the old effect before applying the new one, so each effect run is paired with exactly one cleanup. Forgetting it on intervals, listeners, or subscriptions is the number-one source of memory leaks, and Strict Mode double-invokes effects in dev precisely to surface a missing cleanup.</p></div>
<p>The function returned from <code>useEffect</code> is the <strong>cleanup function</strong>.</p>
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
        a: `<div class="interview-answer"><p>Batching means React groups multiple state updates into a single re-render. The React 18 change is the headline: before 18 it only batched inside React event handlers, so updates in <code>setTimeout</code>, promises, or native events each triggered their own render; 18 made automatic batching happen everywhere. So the same three setters in an async callback now yield one render instead of three — usually a free performance win. When I genuinely need the DOM updated synchronously mid-handler, I opt out with <code>flushSync</code>, but that's rare.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p><code>useEffect</code> runs asynchronously after the browser paints; <code>useLayoutEffect</code> runs synchronously after DOM mutations but before paint. That timing is the whole point: if I need to measure a DOM node and reposition it before the user sees it — a tooltip, avoiding flicker — I use <code>useLayoutEffect</code>. But it blocks paint, so overusing it makes slow renders feel worse, and it warns under SSR because effects don't run on the server. My rule: 99% of the time <code>useEffect</code> is correct, reach for layout only when you actually see a flicker.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p><code>React.memo</code> memoizes a whole component — it skips the re-render when props are shallow-equal; <code>useMemo</code> memoizes a computed value inside a component. Different scope, same caching idea. The gotcha that trips everyone: memo does a shallow prop comparison, so passing an inline <code>style={{...}}</code> object or an inline arrow function creates a new reference every render and defeats it entirely. So <code>React.memo</code> is only as good as the stability of every prop you feed it — which is exactly why you often pair it with <code>useMemo</code> and <code>useCallback</code> to keep those references stable.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>Both are React 18 concurrent tools for keeping the UI responsive when an update is expensive, by marking work as low-priority so urgent updates like typing aren't blocked. The difference is who owns the state: <code>useTransition</code> is for state updates you trigger — you wrap the non-urgent setter in <code>startTransition</code> and get an <code>isPending</code> flag; <code>useDeferredValue</code> is for a value you receive, typically a prop, that you let lag behind during heavy rendering. The classic use case is a search box where the input stays snappy while the expensive results list catches up.</p></div>
<p>React 18 introduced concurrent features for keeping the UI responsive during expensive updates.</p>
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
        a: `<div class="interview-answer"><p><code>useId</code> generates a stable unique ID that matches between server and client, so it exists specifically to prevent hydration mismatches — the old trick of a module counter or <code>Math.random()</code> would produce different IDs on server versus client and break hydration. I use it to wire up accessibility attributes: <code>htmlFor</code> and <code>id</code> pairs, <code>aria-describedby</code>, and so on. The one hard rule: never use it as a list key — it's for stable element identity within a component, not for identifying data rows, where you use real data IDs.</p></div>
<p><code>useId</code> generates a unique ID that is stable across server and client rendering — solving hydration mismatches.</p>
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
        a: `<div class="interview-answer"><p>Prop drilling is threading a prop through layers of components that don't use it just to reach a deep descendant — it couples intermediate components to data they don't care about. My first move is usually the cheapest one: component composition, passing the pre-built element as <code>children</code> or a prop so the middle layers never see it. If the value is genuinely global — auth, theme — I use Context, and for larger app state a store like Zustand. I resist jumping to Context or a library first, because composition is simpler and avoids the re-render-all-consumers cost.</p></div>
<p><strong>Prop drilling</strong>: passing props through multiple intermediate components that don't need them, just to reach a deeply nested component.</p>
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
        a: `<div class="interview-answer"><p><code>StrictMode</code> is a dev-only wrapper that surfaces bugs early — it double-invokes render, effects, and state updaters, and warns about deprecated APIs and unsafe lifecycles. The double-invocation is the famous why-does-my-effect-run-twice, and the correct reaction is not to delete Strict Mode but to fix the effect, because a well-written effect with proper cleanup is idempotent and survives it. It has zero effect in production. I treat a failure under Strict Mode as a real bug it caught for me, most often a missing cleanup.</p></div>
<p><code>&lt;React.StrictMode&gt;</code> activates additional development-only checks to find common bugs.</p>
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
        a: `<div class="interview-answer"><p>An error boundary is a class component with <code>getDerivedStateFromError</code> and/or <code>componentDidCatch</code> that catches render-phase errors in its subtree and shows a fallback instead of unmounting the whole app. The important limitation is what it does NOT catch: event handlers, async code, SSR, and errors thrown in the boundary itself — those you handle with try/catch. It still has to be a class since there's no hook equivalent, so in practice I use the <code>react-error-boundary</code> library for a nicer API with reset. I place boundaries strategically around routes and independent widgets so one failure doesn't take everything down.</p></div>
<p>Error boundaries catch JavaScript errors in the component tree and display a fallback UI instead of crashing the whole app.</p>
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
        a: `<div class="interview-answer"><p>Two rules: only call hooks at the top level — never inside conditions, loops, or nested functions — and only call them from React components or custom hooks. Both come from one implementation fact: React has no names for hooks, it matches each call to its stored state purely by call order on the fiber. So if a conditional skips a hook, every hook after it reads the wrong slot and things break, sometimes silently. The eslint plugin enforces both, and the correct pattern is to always call the hook unconditionally and branch on how you use its result.</p></div>
<p>Two strict rules enforced by the <code>eslint-plugin-react-hooks</code>:</p>
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
        a: `<div class="interview-answer"><p>Three approaches on a control-versus-performance spectrum. Controlled means React owns every keystroke — great for live validation and conditional UI, but it re-renders on each character. Uncontrolled lets the DOM hold the value and you read it on submit via <code>FormData</code> or a ref — fast, less React ceremony. React Hook Form is the pragmatic middle: it's uncontrolled under the hood via <code>register</code>, so it avoids the re-render-per-keystroke problem while still giving you validation and error state. My rule: controlled for small interactive forms, React Hook Form or Formik once the form gets large.</p></div>
<pre>// 1. Controlled: React manages every keystroke
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
        a: `<div class="interview-answer"><p><code>forwardRef</code> lets a parent's <code>ref</code> pass through your component down to a real DOM node, because by default <code>ref</code> isn't a normal prop and gets dropped on function components. I need it when building reusable primitives — inputs, buttons — where consumers legitimately want the underlying element to call <code>focus()</code> or measure it. Paired with <code>useImperativeHandle</code> I can expose a curated API instead of the raw node, like <code>focus</code> and <code>clear</code> methods. Worth noting React 19 makes <code>ref</code> a regular prop, so <code>forwardRef</code> is on its way to being unnecessary.</p></div>
<p><code>forwardRef</code> lets you pass a <code>ref</code> through a component to a child DOM element.</p>
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
        a: `<div class="interview-answer"><p>Suspense is a boundary that renders a fallback while a child is suspending — waiting on something. It started stable for <code>React.lazy</code> code splitting, and with React 18 and frameworks it now covers data: an async server component in Next's App Router suspends until its <code>await</code> resolves, and the boundary shows a skeleton. The real power is nesting boundaries so different parts of the page stream in independently instead of one all-or-nothing spinner. The thing to be clear about: you don't fetch in Suspense — a data source has to integrate with it, which is why you get this through a framework or a library like React Query, not by hand.</p></div>
<pre>// 1. Suspense for lazy loading (stable)
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
        a: `<div class="interview-answer"><p>The React Compiler, formerly React Forget, is a build-time tool that automatically memoizes components and values, so you can stop hand-writing <code>useMemo</code>, <code>useCallback</code>, and <code>React.memo</code>. It analyzes your code and inserts exactly the memoization needed, which removes a whole category of subtle my-memo-doesn't-work-because-a-reference-changed bugs. It's already running in production at Meta on Instagram, and it achieves equal or better performance than hand-tuning. My take: write clean, idiomatic components and let the compiler handle the ceremony — manual memoization becomes a legacy concern.</p></div>
<p>The <strong>React Compiler</strong> (formerly React Forget) automatically memoizes components and values — eliminating the need for manual <code>useMemo</code>, <code>useCallback</code>, and <code>React.memo</code>.</p>
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
        a: `<div class="interview-answer"><p>CSR ships an empty shell and renders in the browser after JS loads — cheap servers but slow first paint and poor SEO; SSR renders full HTML on the server so the user sees content fast and crawlers get real markup, at the cost of per-request server work. The subtlety is hydration: with SSR the user sees content before it's interactive, because React still has to attach listeners, so there's a window where clicks do nothing. That hydration gap is exactly what React Server Components attack, by never hydrating the server-only parts. In practice I don't hand-roll SSR — I reach for Next.js or Remix.</p></div>
<table><tr><th>Aspect</th><th>CSR (Client-Side)</th><th>SSR (Server-Side)</th></tr>
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
        a: `<div class="interview-answer"><p>A portal renders children into a different DOM node — usually a top-level container — while keeping them in the same React tree. I use it for anything that must visually escape its parent's <code>overflow: hidden</code>, <code>z-index</code>, or stacking context: modals, tooltips, popovers, toasts. The detail that surprises people: events still bubble through the React tree, not the DOM tree, so a click inside a portalled modal propagates to the React parent that rendered it even though the DOM node lives elsewhere. Only the physical DOM placement changes.</p></div>
<p><strong>Portals</strong> render a child component into a different DOM node, outside its parent hierarchy.</p>
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
        a: `<div class="interview-answer"><p>The standard pattern is <code>useReducer</code> for the state logic plus Context to distribute it — the reducer centralizes transitions in one testable pure function, and the Provider hands down <code>state</code> and <code>dispatch</code>. I wrap access in a custom <code>useApp</code> hook that throws if used outside the provider, which catches mistakes early. The honest limitation I always flag: every consumer re-renders on any state change because Context has no selectors, so this is fine for small-to-medium apps. Past that I split contexts or move to Zustand for subscription-based, fine-grained updates.</p></div>
<pre>// 1. Define types and reducer
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
      {
        q: 'Tricky: a setInterval inside useEffect with [] deps logs the same count forever. Why, and how do you fix it?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>This is the classic stale closure. With <code>[]</code> deps the effect runs once, and the interval callback permanently closes over <code>count</code> from the first render, which was 0 — so it logs 0 forever and gets stuck at 1. The root cause is that closures capture render-time values, not live bindings; state updates create new renders but never mutate the old closure. The clean fix is a functional update, <code>setCount(c =&gt; c + 1)</code>, which doesn't need to read <code>count</code> at all. Adding <code>count</code> to deps also works but tears down and recreates the interval every tick, and a ref is the escape hatch when you truly need the latest value inside a long-lived callback.</p></div>
<p>This is the classic <strong>stale closure</strong> trap. The effect runs once, and the interval callback closes over the <code>count</code> value from that <strong>first render only</strong>.</p>
<pre>function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count);      // Output: 0, 0, 0, 0, ... forever
      setCount(count + 1);     // always 0 + 1 → count is stuck at 1
    }, 1000);
    return () => clearInterval(id);
  }, []); // ← closure captures count = 0 and never sees updates

  return &lt;h1&gt;{count}&lt;/h1&gt;;    // UI shows 1 forever
}</pre>
<p><strong>Why</strong>: each render creates a new closure with its own <code>count</code>. With <code>[]</code> deps the effect (and its interval callback) is created exactly once, permanently bound to the first render's <code>count = 0</code>. State updates create new renders — they never mutate old closures.</p>
<p><strong>Fixes</strong> (in order of preference):</p>
<pre>// 1. Functional update — doesn't need to read count from the closure
useEffect(() => {
  const id = setInterval(() => setCount(c => c + 1), 1000);
  return () => clearInterval(id);
}, []);

// 2. Correct deps — works, but tears down/recreates the interval every tick
useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 1000);
  return () => clearInterval(id);
}, [count]);

// 3. useRef — an escape hatch to always read the latest value
const countRef = useRef(count);
useEffect(() => { countRef.current = count; });
useEffect(() => {
  const id = setInterval(() => console.log(countRef.current), 1000);
  return () => clearInterval(id);
}, []);</pre>
<p><strong>Interviewer follow-up</strong>: the same trap hits event listeners added once, WebSocket handlers, and debounced callbacks. The <code>eslint-plugin-react-hooks</code> exhaustive-deps rule exists precisely to catch this — disabling it with a comment is usually hiding this bug.</p>
<div class="key-point">Closures capture render-time values, not live bindings. Any callback created once but running forever will see stale state unless you use functional updates, correct deps, or a ref.</div>`,
      },
      {
        q: 'Output prediction: three setCount(count + 1) calls in one click handler — what logs, and what does count become?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The log shows 0 and <code>count</code> ends at 1, not 3. State is a snapshot per render — <code>count</code> is a const captured in this render's closure, so <code>setCount</code> can't change it, it only schedules a new render, which is why the log reads 0. All three calls compute <code>0 + 1</code> from the same snapshot and React batches them, so the last identical write wins at 1. To actually add three, pass updater functions <code>setCount(c =&gt; c + 1)</code>, which React queues and applies in order. The key point: state updates aren't async promises, they're requests for a new render, so never read state right after setting it.</p></div>
<pre>function App() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    console.log(count);   // logs 0 — NOT 3, not even 1
  }
  // After the click, count === 1, not 3
}</pre>
<p><strong>Why the log shows 0</strong>: state behaves like a <strong>snapshot per render</strong>. <code>count</code> is a plain const captured when this render's closure was created. <code>setCount</code> never changes it — it schedules a re-render where a <em>new</em> <code>count</code> will exist.</p>
<p><strong>Why count ends at 1</strong>: all three calls compute <code>0 + 1</code> from the same snapshot, and React batches them into one re-render. The last write wins with the same value: 1.</p>
<pre>// To actually increment 3 times, pass an updater function:
setCount(c => c + 1);
setCount(c => c + 1);
setCount(c => c + 1);
// React queues the updaters and runs them in order: 0→1→2→3

// flushSync forces a synchronous re-render...
flushSync(() => setCount(count + 1));
console.log(count); // STILL logs 0! The local variable is from the
                    // old render's closure — only the DOM updated.</pre>
<p><strong>Failure modes to mention</strong>: reading state right after setting it (use the value you already have, or an effect), and "fixing" it with <code>useRef</code> everywhere — which trades declarative rendering for mutable spaghetti.</p>
<div class="key-point">State updates are not asynchronous promises — they are requests for a new render. Variables of the current render never change; use functional updaters whenever the next state depends on the previous one.</div>`,
      },
      {
        q: 'How does React store hook state internally, and why exactly does a conditional hook break everything after it?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Hooks have no names or keys — React stores them as a linked list on the component's fiber and matches each call to its slot purely by call order. So a conditional hook is catastrophic: when the condition flips, the number of calls changes but the list doesn't line up, and every hook after the condition silently reads the wrong slot — often React throws rendered-fewer-hooks-than-expected. This one positional mechanism is the reason for both Rules of Hooks — identical call order every render, and only call where a fiber is rendering. The fix is to call unconditionally and branch on usage, or extract the conditional part into its own component with its own hook list.</p></div>
<p>Hooks have <strong>no names or keys</strong>. React stores them as a <strong>linked list on the component's fiber</strong> (<code>fiber.memoizedState</code>), and matches each hook call to its stored state purely by <strong>call order</strong>.</p>
<pre>// Simplified mental model — first render builds the list:
// fiber.memoizedState → { state: 'Ada' } → { state: 0 } → { effect }
//                          hook #1           hook #2       hook #3

// On every re-render React walks the list in order:
// 1st useState call → gets node #1, 2nd useState call → node #2, ...

function Profile({ showBio }) {
  const [name] = useState('Ada');          // hook #1
  if (showBio) {
    const [bio] = useState('loves math');  // ❌ sometimes hook #2
  }
  const [likes, setLikes] = useState(0);   // hook #2 or #3?!
}
// When showBio flips from true → false:
// 'likes' now reads the node that stored 'bio' → state is mixed up,
// and React throws: "Rendered fewer hooks than expected."</pre>
<p><strong>Why</strong>: when <code>showBio</code> changes, the list still has 3 nodes but only 2 calls happen (or vice versa). React has no way to know a call was skipped — it just hands out the next node. Every hook <em>after</em> the condition silently receives the wrong state.</p>
<p><strong>This one mechanism explains ALL the Rules of Hooks</strong>:</p>
<ul>
<li>No conditions/loops/early returns before hooks → call order must be identical every render.</li>
<li>Only call from components/custom hooks → there must be a fiber currently rendering to attach the list to (calling elsewhere throws "Invalid hook call").</li>
</ul>
<pre>// Correct patterns: call unconditionally, branch on usage...
const [bio] = useState('');
if (showBio) { /* use bio */ }

// ...or split the conditional part into its own component
{showBio && &lt;Bio /&gt;}  // Bio has its own fiber and hook list</pre>
<div class="key-point">Hook state is positional, not named — a hook's identity is "the Nth call in this component". Any change to call order between renders corrupts every subsequent hook.</div>`,
      },
      {
        q: 'When exactly do useInsertionEffect, useLayoutEffect, and useEffect run — and which one fixes visual flicker?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The commit timeline is: render, then <code>useInsertionEffect</code> before DOM mutations, React mutates the DOM, <code>useLayoutEffect</code> synchronously before paint, the browser paints, then <code>useEffect</code> asynchronously after paint. The one that fixes visual flicker is <code>useLayoutEffect</code> — anything that measures the DOM and repositions, like a tooltip, must run before paint or the user sees a one-frame jump. <code>useInsertionEffect</code> is niche, effectively reserved for CSS-in-JS libraries to inject <code>&lt;style&gt;</code> rules before layout effects read the DOM. Default to <code>useEffect</code>; only escalate when the timing is visually observable.</p></div>
<p><strong>Timeline for a commit</strong>: render → <code>useInsertionEffect</code> (before DOM mutations) → React mutates the DOM → <code>useLayoutEffect</code> (synchronous, before paint) → browser paints → <code>useEffect</code> (async, after paint).</p>
<p><strong>The flicker demo</strong> — a tooltip that must measure itself to position above its anchor:</p>
<pre>function Tooltip({ anchorRect }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  // ❌ useEffect: browser PAINTS at top: 0 first, then re-renders
  //    at the right position → user sees a 1-frame jump/flicker
  // ✅ useLayoutEffect: runs before paint; the re-render with the
  //    correct position happens before the user sees anything
  useLayoutEffect(() => {
    setHeight(ref.current.getBoundingClientRect().height);
  }, []);

  return &lt;div ref={ref} style={{ top: anchorRect.top - height }}&gt;...&lt;/div&gt;;
}</pre>
<p><strong>useInsertionEffect</strong> is a niche hook for <strong>CSS-in-JS libraries</strong>: it fires before layout effects read the DOM, so injected <code>&lt;style&gt;</code> rules exist before anything measures layout (avoiding repeated forced recalculations):</p>
<pre>useInsertionEffect(() => {
  const style = document.createElement('style');
  style.textContent = rule;
  document.head.appendChild(style);
  return () => style.remove();
}, [rule]);
// You cannot access refs or set state here — the DOM isn't updated yet.</pre>
<p><strong>Failure modes</strong>: overusing <code>useLayoutEffect</code> blocks paint and makes slow renders feel worse; on SSR it also triggers the "useLayoutEffect does nothing on the server" warning because no effects run during server rendering (fix: gate the component behind mount, or use <code>useEffect</code> when timing doesn't matter visually).</p>
<div class="key-point">Default to useEffect; reach for useLayoutEffect only to measure/mutate the DOM before paint (flicker); useInsertionEffect is effectively reserved for CSS-in-JS style injection.</div>`,
      },
      {
        q: 'You wrapped a component in React.memo but it re-renders every time anyway. What went wrong?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Almost always the culprit is an unstable prop reference. <code>React.memo</code> does a shallow compare, and anything created inline during the parent's render — an object, array, arrow function, or JSX <code>children</code> — is a brand-new reference every time, so the compare always fails. The sneakiest case is passing children inline, since <code>&lt;Card&gt;&lt;p/&gt;&lt;/Card&gt;</code> makes a fresh element object each render. The fix is to stabilize every prop memo will see — hoist static objects, <code>useCallback</code> the handlers, lift children up. And the honest follow-up: don't memo everything, measure with the Profiler first, because an unmeasured memo is often net-negative.</p></div>
<p><code>React.memo</code> does a <strong>shallow comparison</strong> of props. Anything created inline during the parent's render — objects, arrays, functions, and <strong>JSX children</strong> — gets a new reference every time, so the comparison always fails.</p>
<pre>const Row = React.memo(function Row({ item, style, onSelect }) {
  return &lt;li style={style} onClick={() => onSelect(item.id)}&gt;{item.name}&lt;/li&gt;;
});

function List({ items }) {
  return items.map(item => (
    &lt;Row
      key={item.id}
      item={item}
      style={{ padding: 8 }}            // ❌ new object every render
      onSelect={id => select(id)}       // ❌ new function every render
    /&gt;
  ));
}
// memo compares prevProps.style === nextProps.style → always false
// → Row re-renders every time; memo is pure overhead here.</pre>
<p><strong>The sneakiest case — children</strong>: <code>&lt;Card&gt;&lt;p&gt;Hi&lt;/p&gt;&lt;/Card&gt;</code> creates a new element object for <code>&lt;p&gt;</code> on every parent render, so <code>memo(Card)</code> never bails out when it receives children inline.</p>
<pre>// Fixes: stabilize every reference memo will compare
const ROW_STYLE = { padding: 8 };                     // hoist static objects
const onSelect = useCallback(id => select(id), []);   // stable function
const header = useMemo(() => &lt;Header /&gt;, []);      // or lift children up
                                                      // to a component that
                                                      // rarely re-renders</pre>
<p><strong>Follow-up interviewers love</strong>: "so should you memo everything?" — No. Every memo adds a comparison on every render and makes code harder to reason about; most components are cheap to re-render. <strong>Measure first</strong> with React DevTools Profiler, memoize the hot paths. Longer term, the React Compiler auto-memoizes and makes most manual memo/useCallback ceremony unnecessary.</p>
<div class="key-point">React.memo is only as good as the stability of every prop reference — one inline object, function, or child defeats it entirely, and unmeasured memoization is often net-negative.</div>`,
      },
      {
        q: 'Every consumer of your Context re-renders on each keystroke. Why, and what are the three standard fixes?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A consumer re-renders whenever the Provider's <code>value</code> changes by identity, and the classic bug is an inline object like <code>value={{ user, setUser }}</code> — a new reference every render, so everyone re-renders even when nothing they read changed. Three standard fixes: memoize the value with <code>useMemo</code>; split state and dispatch into separate contexts so update-only components never re-render since setters are stable; and pass subtrees as <code>children</code> so non-consumer branches keep the same reference. The residual limit is no selectors — a consumer re-renders on fields it doesn't read — which is when I split further or move to a selector-based store like Zustand or Jotai.</p></div>
<p>A Context consumer re-renders whenever the Provider's <code>value</code> changes <strong>by identity</strong> (<code>Object.is</code>). The classic bug is an inline object, which is a brand-new reference on every Provider render:</p>
<pre>function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    // ❌ {{ user, setUser }} is a NEW object every render —
    // ALL consumers re-render even when user didn't change
    &lt;UserContext.Provider value={{ user, setUser }}&gt;
      {children}
    &lt;/UserContext.Provider&gt;
  );
}</pre>
<p><strong>Fix 1 — memoize the value</strong>:</p>
<pre>const value = useMemo(() => ({ user, setUser }), [user]);
&lt;UserContext.Provider value={value}&gt;</pre>
<p><strong>Fix 2 — split state and dispatch contexts</strong>. Setter/dispatch functions are stable, so components that only <em>update</em> state never re-render when state changes:</p>
<pre>&lt;UserStateContext.Provider value={user}&gt;
  &lt;UserDispatchContext.Provider value={setUser}&gt;
    {children}
  &lt;/UserDispatchContext.Provider&gt;
&lt;/UserStateContext.Provider&gt;
// A "Log out" button uses only UserDispatchContext → re-renders never</pre>
<p><strong>Fix 3 — children composition</strong>. Note the Provider above receives <code>{children}</code> as a prop: when the Provider's own state changes, the <code>children</code> element is the <em>same reference</em> from the parent's render, so React can skip re-rendering non-consumer subtrees. Creating the tree <em>inside</em> the stateful component would forfeit this.</p>
<p><strong>Remaining limitation</strong>: Context has no selectors — a consumer of <code>{ user, theme }</code> re-renders on theme changes even if it only reads <code>user</code>. That is when you split contexts further or move to Zustand/Jotai for subscription-based, fine-grained updates.</p>
<div class="key-point">Context updates propagate by value identity: memoize the value, split read/write (state vs dispatch) contexts, and pass subtrees as children — or use a selector-based store when that's not enough.</div>`,
      },
    ],
  },
];
