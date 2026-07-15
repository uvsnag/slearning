// Interview data: zustand, tanstack
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
  // ───────────────────────── ZUSTAND ─────────────────────────
  {
    id: 'zustand',
    name: 'Zustand',
    icon: '🐻',
    questions: [
      {
        q: 'What is Zustand and how does it compare to Redux and Context API?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Zustand is a tiny hook-based store — about 1KB, no provider, no reducers, no boilerplate. Against Redux it drops the action/reducer ceremony while keeping selective subscriptions; against Context it fixes Context's real flaw, where every consumer re-renders on any value change no matter how narrow their interest. I reach for it as my default for client and UI state. The gotcha I'd flag is that it is not a server-state tool — don't cache API responses in it, that's TanStack Query's job. And strictly speaking Context isn't state management at all, it's dependency injection.</p></div>
<p><strong>Zustand</strong> is a small, fast, unopinionated state management library for React. It uses a hook-based API with no boilerplate.</p>
<table><tr><th>Aspect</th><th>Zustand</th><th>Redux Toolkit</th><th>Context API</th></tr>
<tr><td>Boilerplate</td><td>Minimal</td><td>Medium (slices, store)</td><td>Low</td></tr>
<tr><td>Bundle size</td><td>~1KB</td><td>~10KB</td><td>0 (built-in)</td></tr>
<tr><td>Re-renders</td><td>Selective (auto)</td><td>Selective (selectors)</td><td>All consumers</td></tr>
<tr><td>DevTools</td><td>Middleware</td><td>Built-in</td><td>None</td></tr>
<tr><td>Async</td><td>Native (just use async)</td><td>createAsyncThunk</td><td>Manual</td></tr>
<tr><td>Provider needed</td><td>No</td><td>Yes</td><td>Yes</td></tr>
</table>
<pre>// Zustand store — entire setup in ~10 lines
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));

// Usage in any component — no Provider needed
function Counter() {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);
  return &lt;button onClick={increment}&gt;{count}&lt;/button&gt;;
}</pre>
<div class="key-point">Zustand doesn't need a Provider wrapper. Components subscribe to specific slices of state and only re-render when those slices change.</div>`,
      },
      {
        q: 'How does Zustand handle selectors and prevent unnecessary re-renders?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Components subscribe through a selector and only re-render when that selected slice changes by reference equality. The classic gotcha is returning a fresh object or array from your selector on every call — that defeats the whole mechanism because the reference is always new, which is exactly what <code>useShallow</code> in v5 (or the old <code>shallow</code> comparator) is for. My habit is to select the narrowest slice possible, and to pull actions out in their own selector separate from the values so an action reference never forces a render.</p></div>
<p>Zustand uses <strong>selectors</strong> to subscribe to specific parts of the store. Components only re-render when their selected state changes.</p>
<pre>const useStore = create((set) => ({
  user: { name: 'John', age: 30 },
  theme: 'dark',
  setTheme: (t) => set({ theme: t }),
}));

// ✅ GOOD: Only re-renders when 'theme' changes
function ThemeToggle() {
  const theme = useStore((state) => state.theme);
  return &lt;span&gt;{theme}&lt;/span&gt;;
}

// ❌ BAD: Re-renders on ANY state change (no selector)
function BadComponent() {
  const store = useStore(); // subscribes to everything!
  return &lt;span&gt;{store.theme}&lt;/span&gt;;
}

// Multiple values: use shallow comparison
import { shallow } from 'zustand/shallow';

function UserInfo() {
  const { name, age } = useStore(
    (state) => ({ name: state.user.name, age: state.user.age }),
    shallow  // prevents re-render if object ref changes but values are same
  );
  return &lt;span&gt;{name} ({age})&lt;/span&gt;;
}

// Zustand v5: useShallow hook (cleaner API)
import { useShallow } from 'zustand/shallow';
const { name, age } = useStore(
  useShallow((state) => ({ name: state.user.name, age: state.user.age }))
);</pre>
<div class="key-point">Always use selectors to pick only what you need. Without a selector, the component subscribes to the entire store and re-renders on every state change. Use <code>shallow</code> when selecting multiple values as an object.</div>`,
      },
      {
        q: 'How to handle async actions in Zustand?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>There's nothing special to it — you just write an <code>async</code> function in the store and call <code>set</code> when the promise resolves; no thunks, no middleware. Use <code>get()</code> to read current state at call time rather than closing over a stale value. The real judgment call is that this is exactly where people wrongly stuff server state: if you're fetching API data that needs caching, dedup and retries, reach for TanStack Query instead and keep Zustand async for genuinely client-owned flows.</p></div>
<p>Zustand handles async naturally — just use <code>async/await</code> inside actions. No thunks or middleware needed.</p>
<pre>const useStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/users');
      const users = await response.json();
      set({ users, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Access current state with get()
  addUser: async (newUser) => {
    const currentUsers = get().users;
    const response = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
    });
    const user = await response.json();
    set({ users: [...currentUsers, user] });
  },
}));

// Usage
function UserList() {
  const { users, loading, fetchUsers } = useStore();
  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  if (loading) return &lt;Spinner /&gt;;
  return users.map(u => &lt;div key={u.id}&gt;{u.name}&lt;/div&gt;);
}</pre>
<div class="key-point"><code>set()</code> updates state, <code>get()</code> reads current state inside actions. This is simpler than Redux's createAsyncThunk — just write normal async functions.</div>`,
      },
      {
        q: 'What are Zustand middleware? Explain persist, devtools, and immer.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Middleware are just store wrappers you compose by nesting: <code>persist</code> for localStorage, <code>devtools</code> for Redux DevTools time-travel, and <code>immer</code> so you can write mutable-looking updates on deeply nested state. Order matters — I keep <code>devtools</code> outermost so it observes everything the inner middleware do. The gotcha I always call out is <code>persist</code>: always use <code>partialize</code> so you don't accidentally persist auth tokens or transient UI flags into localStorage.</p></div>
<p>Zustand middleware wraps the store to add features like persistence, DevTools, and immutable updates.</p>
<pre>import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Combine multiple middleware
const useStore = create(
  devtools(              // Redux DevTools integration
    persist(             // Persist to localStorage
      immer((set) => ({  // Immer: mutate state directly
        user: { name: 'John', settings: { theme: 'dark' } },
        updateTheme: (theme) =>
          set((state) => {
            state.user.settings.theme = theme; // mutate directly with immer!
          }),
      })),
      {
        name: 'app-storage',        // localStorage key
        partialize: (state) => ({   // only persist specific fields
          user: state.user,
        }),
      }
    ),
    { name: 'MyApp' }  // DevTools label
  )
);

// Custom middleware example
const logMiddleware = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.log('  prev state:', get());
      set(...args);
      console.log('  next state:', get());
    },
    get,
    api
  );</pre>
<div class="key-point"><code>persist</code> saves state to localStorage (or custom storage). <code>devtools</code> enables Redux DevTools. <code>immer</code> allows direct mutation syntax for deeply nested state updates. Middleware are composed by nesting.</div>`,
      },
      {
        q: 'How to structure a large Zustand store? Slices pattern.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>You split the store into slice-creator functions, each owning one domain, then spread them into a single <code>create</code> call, with cross-slice reads going through <code>get()</code>. My rule of thumb is to reach for slices once you pass roughly ten fields — but if the domains are truly independent, I'd prefer separate stores over one mega-store rather than coupling them. The TypeScript gotcha is typing the combined store as the intersection of each slice's return type so you keep full inference.</p></div>
<p>For large apps, split the store into <strong>slices</strong> — separate files that each manage a domain, then combine them.</p>
<pre>// slices/authSlice.ts
export const createAuthSlice = (set, get) => ({
  user: null,
  token: null,
  login: async (credentials) => {
    const { user, token } = await authApi.login(credentials);
    set({ user, token });
  },
  logout: () => set({ user: null, token: null }),
  isAuthenticated: () => get().token !== null,
});

// slices/cartSlice.ts
export const createCartSlice = (set, get) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  total: () => get().items.reduce((sum, i) => sum + i.price, 0),
});

// store.ts — combine slices
import { create } from 'zustand';

const useStore = create((...a) => ({
  ...createAuthSlice(...a),
  ...createCartSlice(...a),
}));

// TypeScript: define combined type
type StoreState = ReturnType&lt;typeof createAuthSlice&gt;
  & ReturnType&lt;typeof createCartSlice&gt;;

// Or: separate stores for truly independent domains
const useAuthStore = create(createAuthSlice);
const useCartStore = create(createCartSlice);</pre>
<div class="key-point">Use slices when the store grows beyond ~10 state fields. For truly independent domains, prefer separate stores. Cross-slice access works via <code>get()</code> since all slices share the same store.</div>`,
      },
      {
        q: 'How does Zustand work outside of React components?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The store is just a vanilla object — <code>getState</code>, <code>setState</code> and <code>subscribe</code> all work with zero React involved, which is why it shines in axios interceptors, plain event handlers and tests. The thing to remember outside React is to always read with <code>getState()</code> at call time rather than a value captured earlier, and that <code>subscribe</code> returns an unsubscribe function you must actually call or you leak listeners. That decoupling from React is one of Zustand's underrated strengths versus Context.</p></div>
<p>Zustand stores can be used outside React — in utility functions, API interceptors, or tests.</p>
<pre>const useStore = create((set) => ({
  token: null,
  setToken: (token) => set({ token }),
}));

// ✅ Use in non-React code (API interceptor):
axios.interceptors.request.use((config) => {
  const token = useStore.getState().token;  // read state
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

// ✅ Subscribe to changes outside React:
const unsubscribe = useStore.subscribe(
  (state) => console.log('State changed:', state)
);

// ✅ Subscribe to specific slice:
const unsubscribe = useStore.subscribe(
  (state) => state.token,
  (token) => console.log('Token changed:', token)
);

// ✅ Set state from anywhere:
useStore.setState({ token: 'new-token' });

// ✅ Destroy store (useful in tests):
useStore.destroy();</pre>
<div class="key-point"><code>useStore.getState()</code> reads state, <code>useStore.setState()</code> writes state, <code>useStore.subscribe()</code> listens for changes — all work outside React. This makes Zustand great for integrating with non-React code.</div>`,
      },
      {
        q: 'What are common Zustand anti-patterns and pitfalls?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The big ones I watch for: no selector so you subscribe to the whole store and re-render on everything; returning fresh objects from a selector without <code>shallow</code>; mutating state in place without <code>immer</code> so no re-render fires; and parking derived state in the store where it silently drifts out of sync. The cardinal sin, though, is putting server state in Zustand — caching, dedup and retries belong in TanStack Query. My guidance is to keep the store minimal and compute derived values in selectors instead of storing them.</p></div>
<pre>// ❌ Anti-pattern 1: No selector — subscribes to entire store
const store = useStore(); // re-renders on ANY state change
// ✅ Fix: always use a selector
const count = useStore((s) => s.count);

// ❌ Anti-pattern 2: Creating new objects in selector without shallow
const data = useStore((s) => ({ a: s.a, b: s.b })); // new object every render!
// ✅ Fix: use shallow comparison
const data = useStore((s) => ({ a: s.a, b: s.b }), shallow);

// ❌ Anti-pattern 3: Mutating state directly (without immer)
set((state) => {
  state.items.push(newItem); // MUTATION! Won't trigger re-render
  return state;
});
// ✅ Fix: return new object
set((state) => ({ items: [...state.items, newItem] }));

// ❌ Anti-pattern 4: Putting derived state in the store
const useStore = create((set) => ({
  items: [],
  total: 0, // ❌ derived from items — will get out of sync
}));
// ✅ Fix: compute derived values in selectors or components
const total = useStore((s) => s.items.reduce((sum, i) => sum + i.price, 0));

// ❌ Anti-pattern 5: Using store for server state
// Use TanStack Query for server state, Zustand for client state only</pre>
<div class="key-point">Zustand is for <strong>client state</strong> (UI state, user preferences, form state). For server state (API data, caching, sync), use <strong>TanStack Query</strong>. Don't duplicate server data in Zustand.</div>`,
      },
      {
        q: 'Zustand vs Redux Toolkit vs Jotai vs Recoil — when to use which?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Zustand is my pragmatic default — single store, flux-like, tiny. I'd pick Redux Toolkit when I genuinely need strict patterns, action logging, time-travel debugging, or the team's already fluent in Redux. Jotai is the pick for fine-grained atomic reactivity when you have many small independent pieces of state. Recoil I'd actively avoid now — it's effectively abandoned. The real judgment is that most apps are best served by Zustand for client state plus TanStack Query for server state, and honestly you may not need a global client store at all.</p></div>
<table><tr><th>Library</th><th>Model</th><th>Best For</th><th>Size</th></tr>
<tr><td><strong>Zustand</strong></td><td>Single store, flux-like</td><td>Simple-medium apps, replaces Redux</td><td>~1KB</td></tr>
<tr><td><strong>Redux Toolkit</strong></td><td>Single store, actions/reducers</td><td>Large apps, complex state logic, devtools</td><td>~10KB</td></tr>
<tr><td><strong>Jotai</strong></td><td>Atomic (bottom-up)</td><td>Fine-grained reactivity, many independent pieces</td><td>~3KB</td></tr>
<tr><td><strong>Recoil</strong></td><td>Atomic (Facebook)</td><td>Async selectors, derived state graphs</td><td>~20KB</td></tr>
<tr><td><strong>Context API</strong></td><td>Built-in React</td><td>Theme, locale — low-frequency updates</td><td>0</td></tr>
</table>
<p><strong>Decision guide:</strong></p>
<ul>
<li><strong>Small-medium app, simple state</strong>: Zustand</li>
<li><strong>Large enterprise app, strict patterns</strong>: Redux Toolkit</li>
<li><strong>Many independent atoms of state</strong>: Jotai</li>
<li><strong>Theme / locale / auth (rarely changes)</strong>: Context API</li>
</ul>
<div class="key-point">Zustand is the most pragmatic choice for most React apps. It's simpler than Redux with equivalent power. Only choose Redux Toolkit when you need strict action logging, time-travel debugging, or your team already knows Redux.</div>`,
      },
      {
        q: 'What are the pitfalls of using Zustand with Next.js / SSR, and how do you fix them?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Two traps. First, a module-level store on the server is a per-process singleton shared across every request, so one user's state leaks into another user's render — a data-leakage bug, not just stale UI. Second, <code>persist</code> reads localStorage during the first render, so the server HTML and client render disagree and you get a hydration mismatch. The fix for both: create one store per request behind a Context provider, holding the store in a <code>useRef</code>, and defer <code>persist</code> rehydration to after mount with <code>skipHydration</code>. The subtlety interviewers probe is why Context is fine here — it carries the store reference, which never changes, not the state, so selective subscriptions still work.</p></div>
<p>Two classic senior-level traps: <strong>module-level stores leak state between requests on the server</strong>, and <strong>persist middleware causes hydration mismatches</strong>.</p>
<p><strong>Pitfall 1 — the server singleton.</strong> On the client, a module-level store is one instance per browser tab — fine. On the server, the module is evaluated once per Node process, so <strong>every incoming request (every user!) shares the same store instance</strong> during SSR.</p>
<pre>// ❌ BAD in Next.js: module-level store used during SSR
export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
// Request A sets user → Request B server-renders with A's user.
// That's cross-user data leakage, not just a stale-UI bug.

// ✅ FIX: create ONE store per request/tree via Context
// store.ts — note createStore (vanilla), not create
export const createUserStore = (initialUser) =>
  createStore((set) => ({
    user: initialUser,
    setUser: (user) => set({ user }),
  }));

// provider.tsx ('use client')
const StoreContext = createContext(null);

export function UserStoreProvider({ children, initialUser }) {
  const storeRef = useRef(null);
  if (!storeRef.current) {
    storeRef.current = createUserStore(initialUser); // once per tree
  }
  return (
    &lt;StoreContext.Provider value={storeRef.current}&gt;
      {children}
    &lt;/StoreContext.Provider&gt;
  );
}

export function useUserStore(selector) {
  const store = useContext(StoreContext);
  if (!store) throw new Error('Missing UserStoreProvider');
  return useStore(store, selector); // useStore from 'zustand'
}</pre>
<p><strong>Pitfall 2 — persist + hydration mismatch.</strong> The server renders with initial state; the client rehydrates from <code>localStorage</code> during the first render, so the HTML doesn't match → React hydration error.</p>
<pre>// ✅ Defer rehydration until after mount
const useCartStore = create(
  persist((set) => ({ items: [] }), {
    name: 'cart',
    skipHydration: true, // don't read localStorage during render
    onRehydrateStorage: () => (state) => {
      console.log('rehydrated', state); // hook for post-hydration logic
    },
  })
);

function CartBadge() {
  useEffect(() => {
    useCartStore.persist.rehydrate(); // client-only, after mount
  }, []);
  const count = useCartStore((s) => s.items.length);
  return &lt;span&gt;{count}&lt;/span&gt;;
}</pre>
<p><strong>Interviewer follow-up:</strong> "Why is Context suddenly OK here?" — Context carries the <em>store reference</em> (which never changes), not the state itself, so consumers still subscribe selectively and don't all re-render.</p>
<div class="key-point">On the server a module-level Zustand store is a per-process singleton shared by all requests — in SSR apps create one store per request behind a Context provider, and defer <code>persist</code> rehydration to after mount to avoid hydration mismatches.</div>`,
      },
      {
        q: 'What are transient updates in Zustand? How do you consume high-frequency state without re-rendering?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Transient updates mean reacting to state changes without triggering a React re-render — you use <code>store.subscribe</code> to push high-frequency values like mouse position, price ticks or animation frames straight into a ref or the DOM node, and <code>subscribeWithSelector</code> lets you watch just one slice. The related gotcha is the stale closure: inside callbacks read via <code>getState()</code> at call time, never a hook-selected value frozen at the render that created the handler. I keep the DOM-poking scoped to leaf nodes — anything that affects layout or logic still goes through normal renders.</p></div>
<p><strong>Transient updates</strong> mean reacting to state changes <em>without</em> triggering a React re-render. This matters for high-frequency data — mouse position, canvas animation, websocket price ticks — where re-rendering 20–60 times per second kills performance.</p>
<pre>// Problem: a websocket pushes prices 20x/second.
// useStore((s) => s.price) re-renders this component on EVERY tick.

// ✅ Transient update: subscribe + write to the DOM (or a ref) directly
function PriceTicker() {
  const ref = useRef(null);
  useEffect(
    () =>
      useTickerStore.subscribe((state) => {
        // no React re-render — mutate the DOM node directly
        if (ref.current) ref.current.textContent = state.price.toFixed(2);
      }), // subscribe returns unsubscribe → perfect cleanup fn
    []
  );
  return &lt;span ref={ref} /&gt;;
}

// Subscribe to ONE slice only: subscribeWithSelector middleware
const useTickerStore = create(
  subscribeWithSelector((set) => ({ price: 0, volume: 0 }))
);

useTickerStore.subscribe(
  (s) => s.price,                     // selector
  (price, prevPrice) => drawChart(price), // fires only when price changes
  { fireImmediately: true }
);</pre>
<p>The related trap is the <strong>stale closure</strong>: reading hook-selected state inside a callback captures the value from the render it was created in.</p>
<pre>// ❌ Stale: 'items' is frozen at the render that created onSave
const items = useStore((s) => s.items);
const onSave = useCallback(() => save(items), []); // old items!

// ✅ Read at CALL time with getState() (or get() inside store actions)
const onSave = useCallback(() => {
  const { items } = useStore.getState(); // always current
  save(items);
}, []);</pre>
<p><strong>Interviewer follow-up:</strong> "Isn't mutating the DOM anti-React?" — Yes, deliberately: for ephemeral high-frequency visuals React reconciliation adds cost with no benefit. Keep it scoped to leaf nodes; anything that affects layout/logic should go through normal renders.</p>
<div class="key-point"><code>store.subscribe()</code> delivers updates without re-rendering — use it (with <code>subscribeWithSelector</code> for slices) for high-frequency data, and read with <code>getState()</code>/<code>get()</code> inside callbacks to avoid stale closures.</div>`,
      },
    ],
  },

  // ───────────────────────── TANSTACK ─────────────────────────
  {
    id: 'tanstack',
    name: 'TanStack (Query/Form)',
    icon: '🔥',
    questions: [
      {
        q: 'What is TanStack Query (React Query)? Why use it instead of useEffect + fetch?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>I describe it as a server-state cache, not a data-fetching library — you hand it a key and a fetcher and it gives you caching, deduplication, background refetch, retries and stale-while-revalidate for free. The <code>useEffect</code>+<code>fetch</code> version reinvents all of that by hand and badly, and almost always ships with race-condition and cleanup bugs. The mental anchor is that server state is fundamentally different from client state. The gotcha to avoid is mirroring the query cache into Zustand or Redux — the cache IS your source of truth for server data, so don't copy it out.</p></div>
<p><strong>TanStack Query</strong> is a server state management library for fetching, caching, synchronizing, and updating server data in React.</p>
<pre>// ❌ Without TanStack Query (manual approach)
function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/users')
      .then(res => res.json())
      .then(data => { if (!cancelled) setUsers(data); })
      .catch(err => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // No caching, no refetch, no dedup, no retry...
}

// ✅ With TanStack Query
function Users() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json()),
  });
  // Automatic: caching, dedup, refetch, retry, stale-while-revalidate!
}</pre>
<p><strong>What you get for free:</strong></p>
<ul>
<li>Automatic caching & deduplication</li>
<li>Background refetching (stale-while-revalidate)</li>
<li>Retry on failure (3x by default)</li>
<li>Window focus refetching</li>
<li>Pagination & infinite scroll helpers</li>
<li>Optimistic updates</li>
</ul>
<div class="key-point">TanStack Query manages <strong>server state</strong> (data from APIs). Use Zustand/Redux for <strong>client state</strong> (UI state, form state). Don't mix them.</div>`,
      },
      {
        q: 'Explain queryKey, queryFn, and how caching works in TanStack Query.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The queryKey is the cache identity: same key means same cache entry, and any input the <code>queryFn</code> reads must be in the key or you'll serve stale data for the wrong parameters. The two knobs everyone confuses are <code>staleTime</code> — how long data is considered fresh before a background refetch — and <code>gcTime</code>, how long unused data lingers in memory after the last observer unmounts. The gotcha is that the default <code>staleTime</code> is zero, so out of the box it refetches very aggressively; for stable data I bump it up.</p></div>
<p>Every query is identified by its <strong>queryKey</strong>. The cache stores data by key.</p>
<pre>// Simple key
useQuery({ queryKey: ['users'], queryFn: fetchUsers });

// Key with parameters — cache per user
useQuery({
  queryKey: ['users', userId],        // different cache entry per userId
  queryFn: () => fetchUser(userId),
});

// Complex key — includes filters
useQuery({
  queryKey: ['users', { status: 'active', page: 2 }],
  queryFn: () => fetchUsers({ status: 'active', page: 2 }),
});

// Cache behavior:
// 1. First request: fetch from server, store in cache
// 2. Second request (same key): return cached data INSTANTLY
//    + refetch in background if stale (stale-while-revalidate)

// Configuration:
useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
  staleTime: 5 * 60 * 1000,    // data is "fresh" for 5 minutes
  gcTime: 30 * 60 * 1000,      // garbage collect after 30 min unused
  refetchOnWindowFocus: true,   // refetch when user returns to tab
  retry: 3,                     // retry failed requests 3 times
  refetchInterval: 30000,       // poll every 30 seconds
});</pre>
<div class="key-point"><code>staleTime</code> = how long data is considered fresh (no background refetch). <code>gcTime</code> (formerly cacheTime) = how long unused data stays in memory. Set <code>staleTime: Infinity</code> for data that rarely changes.</div>`,
      },
      {
        q: 'What is useMutation in TanStack Query? How to handle create/update/delete?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><code>useMutation</code> is for writes — it gives you <code>isPending</code>/<code>isError</code> state plus <code>onSuccess</code>, <code>onError</code> and <code>onSettled</code> lifecycle hooks. The standard flow is: call <code>mutate</code>, then <code>invalidateQueries</code> in <code>onSuccess</code> to resync the affected lists with the server. The key gotcha is that mutations don't touch the cache automatically — you either invalidate the relevant queries or write the response in yourself with <code>setQueryData</code>. When I want the UI to feel instant I layer optimistic updates on top.</p></div>
<p><code>useMutation</code> handles data modification (POST, PUT, DELETE) with callbacks for success, error, and cache invalidation.</p>
<pre>import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newUser) => fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(newUser),
    }).then(res => res.json()),

    onSuccess: (data) => {
      // Invalidate and refetch the users list
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User created!');
    },

    onError: (error) => {
      toast.error('Failed: ' + error.message);
    },

    onSettled: () => {
      // Runs on both success and error
    },
  });

  return (
    &lt;button
      onClick={() => mutation.mutate({ name: 'John' })}
      disabled={mutation.isPending}
    &gt;
      {mutation.isPending ? 'Creating...' : 'Create User'}
    &lt;/button&gt;
  );
}</pre>
<div class="key-point">After mutation, call <code>invalidateQueries</code> to refetch affected queries. This keeps the cache in sync with the server. For a better UX, use <strong>optimistic updates</strong>.</div>`,
      },
      {
        q: 'What are optimistic updates in TanStack Query?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>You update the cache before the server responds so the UI feels instant, then roll back if it fails. The pattern lives in the mutation callbacks: in <code>onMutate</code> you <code>cancelQueries</code>, snapshot the previous value, <code>setQueryData</code> optimistically, and return the snapshot as context; <code>onError</code> restores that snapshot; <code>onSettled</code> invalidates to reconcile with the server's real answer. The gotcha people miss is that the <code>cancelQueries</code> step is not optional — an in-flight background refetch landing late would clobber your optimistic write.</p></div>
<p><strong>Optimistic updates</strong> update the UI immediately (before the server responds), then roll back if the mutation fails.</p>
<pre>const mutation = useMutation({
  mutationFn: updateTodo,

  // 1. Before mutation: save previous state & update cache optimistically
  onMutate: async (newTodo) => {
    // Cancel outgoing refetches (they would overwrite our optimistic update)
    await queryClient.cancelQueries({ queryKey: ['todos'] });

    // Snapshot the previous value
    const previousTodos = queryClient.getQueryData(['todos']);

    // Optimistically update the cache
    queryClient.setQueryData(['todos'], (old) =>
      old.map(todo => todo.id === newTodo.id ? { ...todo, ...newTodo } : todo)
    );

    // Return context with the snapshot
    return { previousTodos };
  },

  // 2. On error: roll back to the snapshot
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(['todos'], context.previousTodos);
    toast.error('Update failed, reverted.');
  },

  // 3. On success or error: refetch to ensure consistency
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});</pre>
<div class="key-point">Optimistic updates make the UI feel instant (no loading spinner). The pattern: snapshot → optimistic update → rollback on error → refetch on settle.</div>`,
      },
      {
        q: 'How to implement pagination and infinite scroll with TanStack Query?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>For classic paged lists I use <code>placeholderData: keepPreviousData</code> so the page doesn't blank out while the next page loads — you get the old data dimmed instead of a spinner. For feeds I reach for <code>useInfiniteQuery</code>, which manages the cursor and accumulates pages via <code>getNextPageParam</code>. The gotcha is putting the page or cursor in the queryKey so each page caches independently, and disabling the Next button while <code>isPlaceholderData</code> is true so users can't skip ahead before the data actually arrives.</p></div>
<pre>// 1. Standard pagination
function UserList() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isPlaceholderData } = useQuery({
    queryKey: ['users', page],
    queryFn: () => fetchUsers(page),
    placeholderData: keepPreviousData,  // show old data while loading next page
  });

  return (
    &lt;div&gt;
      {data?.users.map(u => &lt;div key={u.id}&gt;{u.name}&lt;/div&gt;)}
      &lt;button onClick={() => setPage(p => p - 1)} disabled={page === 1}&gt;
        Previous
      &lt;/button&gt;
      &lt;button
        onClick={() => setPage(p => p + 1)}
        disabled={isPlaceholderData || !data?.hasMore}
      &gt;
        Next
      &lt;/button&gt;
    &lt;/div&gt;
  );
}

// 2. Infinite scroll
function InfiniteUsers() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: ({ pageParam }) => fetchUsers(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor : undefined,
  });

  return (
    &lt;div&gt;
      {data?.pages.flatMap(page =>
        page.users.map(u => &lt;div key={u.id}&gt;{u.name}&lt;/div&gt;)
      )}
      &lt;button onClick={() => fetchNextPage()} disabled={!hasNextPage}&gt;
        {isFetchingNextPage ? 'Loading...' : 'Load More'}
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</pre>
<div class="key-point"><code>keepPreviousData</code> prevents the UI from going blank when changing pages. <code>useInfiniteQuery</code> manages the page cursor and accumulated data automatically.</div>`,
      },
      {
        q: 'What is TanStack Query DevTools and how to debug queries?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The DevTools panel is the fastest way to see what the cache is actually doing — every query's state as fresh, stale, fetching or inactive, the cached data for each key, and buttons to manually invalidate or refetch. Most of the "bugs" it surfaces turn out to be config: a <code>staleTime</code> of zero causing constant refetches, an unstable <code>queryFn</code> or key triggering loops, or a <code>gcTime</code> that's too short dropping data early. It only ships in development builds, so there's no production bundle cost.</p></div>
<pre>// Install: npm install @tanstack/react-query-devtools

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    &lt;QueryClientProvider client={queryClient}&gt;
      &lt;MyApp /&gt;
      &lt;ReactQueryDevtools initialIsOpen={false} /&gt;  {/* dev only */}
    &lt;/QueryClientProvider&gt;
  );
}

// DevTools shows:
// - All active queries with their status (fresh, stale, fetching, inactive)
// - Cache data for each query key
// - Query timing and refetch count
// - Ability to manually invalidate, refetch, or remove queries
// - Mutation history</pre>
<p><strong>Debugging tips:</strong></p>
<ul>
<li><strong>Query is stale immediately</strong>: <code>staleTime</code> is 0 (default). Set a higher value.</li>
<li><strong>Too many refetches</strong>: Check <code>refetchOnWindowFocus</code>, <code>refetchOnReconnect</code> settings.</li>
<li><strong>Data disappears</strong>: <code>gcTime</code> too short. Increase it.</li>
<li><strong>Infinite loop</strong>: <code>queryFn</code> creates a new function reference each render. Stabilize it.</li>
</ul>
<div class="key-point">DevTools only show in development builds. They're the single best tool for understanding what TanStack Query is doing behind the scenes.</div>`,
      },
      {
        q: 'How to configure a global QueryClient and default options?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>You create one <code>QueryClient</code> at the app root and set sensible <code>defaultOptions</code> — I'd go with something like a five-minute <code>staleTime</code>, a couple of retries, and refetch on focus and reconnect — then override per-query where a specific case needs it. Cross-cutting concerns like a 401-redirect-to-login handler go on the query cache's <code>onError</code>. The gotcha is never recreating the client on every render — hold it in module scope or a <code>useRef</code>/<code>useState</code>, otherwise you wipe the whole cache each render. And in SSR or Next it must be one client per request.</p></div>
<pre>import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,       // 5 min fresh
      gcTime: 30 * 60 * 1000,         // 30 min cache
      retry: 2,                        // retry twice on failure
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      throwOnError: false,             // don't throw to error boundary

      // Global error handler
      meta: {},
    },
    mutations: {
      retry: 1,
      // Global mutation error handler
      onError: (error) => {
        toast.error(error.message);
      },
    },
  },
});

// Global query error handler
queryClient.getQueryCache().config = {
  onError: (error, query) => {
    if (error.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
  },
};

function App() {
  return (
    &lt;QueryClientProvider client={queryClient}&gt;
      &lt;MyApp /&gt;
    &lt;/QueryClientProvider&gt;
  );
}</pre>
<div class="key-point">Set sensible defaults at the QueryClient level. Override per-query when needed. A 5-minute staleTime is a good default for most API data.</div>`,
      },
      {
        q: 'How does TanStack Query handle dependent queries and parallel queries?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Independent queries just run in parallel — you declare multiple <code>useQuery</code> hooks and they all fire at once. Dependent queries chain through <code>enabled</code>: the second query stays off until the first one's data exists. When the number of parallel queries is dynamic, that's what <code>useQueries</code> is for. The gotchas: <code>enabled: false</code> leaves a query in a pending/idle state, so guard your loading UI accordingly, and remember that chaining dependent queries serializes your latency into a waterfall — if that matters, push for a single endpoint that returns both.</p></div>
<pre>// 1. Parallel queries (independent — fetch simultaneously)
function Dashboard() {
  const usersQuery = useQuery({ queryKey: ['users'], queryFn: fetchUsers });
  const ordersQuery = useQuery({ queryKey: ['orders'], queryFn: fetchOrders });

  // Both fire at the same time!
  if (usersQuery.isLoading || ordersQuery.isLoading) return &lt;Spinner /&gt;;
}

// 2. Dependent (serial) queries — second depends on first
function UserOrders({ userId }) {
  // First: fetch user
  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });

  // Second: fetch orders only when user is loaded
  const ordersQuery = useQuery({
    queryKey: ['orders', userQuery.data?.id],
    queryFn: () => fetchOrders(userQuery.data.id),
    enabled: !!userQuery.data?.id,  // only run when user.id exists
  });
}

// 3. Dynamic parallel queries (variable number)
function UsersList({ userIds }) {
  const userQueries = useQueries({
    queries: userIds.map((id) => ({
      queryKey: ['user', id],
      queryFn: () => fetchUser(id),
    })),
  });

  const allLoaded = userQueries.every(q => q.isSuccess);
}</pre>
<div class="key-point"><code>enabled: false</code> prevents a query from running. Use it for dependent queries, conditional fetching, or disabling auto-fetch. <code>useQueries</code> handles dynamic parallel queries.</div>`,
      },
      {
        q: 'What is TanStack Form? How does it compare to React Hook Form?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>TanStack Form is headless and multi-framework, and its real selling point is end-to-end type safety — field names and values are fully typed all the way through. React Hook Form is React-only but far more mature, with a bigger ecosystem, and it usually pairs with Zod through a resolver for validation. My honest take: for most React apps today I still reach for RHF plus Zod on maturity grounds, and I'd pick TanStack Form when I specifically value the stronger typing or need cross-framework consistency. Both are performant and lean uncontrolled, so it's not a performance decision.</p></div>
<p><strong>TanStack Form</strong> is a headless, type-safe form library with built-in validation, supporting React, Vue, Angular, and Solid.</p>
<pre>import { useForm } from '@tanstack/react-form';

function SignupForm() {
  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      age: 0,
    },
    onSubmit: async ({ value }) => {
      await createUser(value);
    },
  });

  return (
    &lt;form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}&gt;
      &lt;form.Field
        name="username"
        validators={{
          onChange: ({ value }) =>
            value.length &lt; 3 ? 'Must be at least 3 chars' : undefined,
          onChangeAsyncDebounceMs: 500,
          onChangeAsync: async ({ value }) => {
            const exists = await checkUsername(value);
            return exists ? 'Username taken' : undefined;
          },
        }}
      &gt;
        {(field) => (
          &lt;div&gt;
            &lt;input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            /&gt;
            {field.state.meta.errors.map(err => &lt;span&gt;{err}&lt;/span&gt;)}
          &lt;/div&gt;
        )}
      &lt;/form.Field&gt;
      &lt;button type="submit" disabled={!form.state.canSubmit}&gt;Submit&lt;/button&gt;
    &lt;/form&gt;
  );
}</pre>
<table><tr><th>Feature</th><th>TanStack Form</th><th>React Hook Form</th></tr>
<tr><td>Framework</td><td>Multi-framework</td><td>React only</td></tr>
<tr><td>TypeScript</td><td>Fully type-safe</td><td>Good but less strict</td></tr>
<tr><td>Validation</td><td>Built-in + async</td><td>Via resolvers (Zod, Yup)</td></tr>
<tr><td>Bundle size</td><td>~8KB</td><td>~9KB</td></tr>
<tr><td>Maturity</td><td>Newer</td><td>Very mature</td></tr>
</table>
<div class="key-point">TanStack Form excels in type safety — field names and values are fully typed. React Hook Form is more mature with a larger ecosystem. Both are excellent choices.</div>`,
      },
      {
        q: 'What is the difference between server state and client state? How does TanStack Query fit?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Server state lives on a remote source — it's shared with other users, asynchronous, and can go stale under you because someone else changed it. Client state is local, synchronous, and you fully own it. That one distinction dictates the tool: TanStack Query for server state, Zustand or <code>useState</code> for client state. The classic architecture mistake is fetching into a Zustand store, which reinvents caching, dedup and retry badly. Keep server data in the query cache and don't mirror it into a client store — a copy is just a second source of truth waiting to drift.</p></div>
<p>Understanding this distinction is key to choosing the right tool.</p>
<table><tr><th>Aspect</th><th>Server State</th><th>Client State</th></tr>
<tr><td>Source of truth</td><td>Remote server / DB</td><td>Browser / memory</td></tr>
<tr><td>Shared</td><td>Yes (other users see it)</td><td>No (local to this user)</td></tr>
<tr><td>Async</td><td>Yes (API calls)</td><td>No (synchronous)</td></tr>
<tr><td>Can be stale</td><td>Yes (someone else updated it)</td><td>No (you control it)</td></tr>
<tr><td>Examples</td><td>User list, posts, products</td><td>Theme, sidebar open, form input</td></tr>
<tr><td>Tool</td><td><strong>TanStack Query</strong>, SWR</td><td><strong>Zustand</strong>, useState, Redux</td></tr>
</table>
<pre>// ❌ Common mistake: putting server state in Zustand
const useStore = create((set) => ({
  users: [],
  fetchUsers: async () => {
    const users = await fetch('/api/users').then(r => r.json());
    set({ users }); // No caching, no dedup, no refetch, no retry!
  },
}));

// ✅ Correct: TanStack Query for server state, Zustand for client state
// Server state:
const { data: users } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });

// Client state (UI):
const useUIStore = create((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));</pre>
<div class="key-point">The biggest architecture mistake is treating server state like client state. TanStack Query handles the hard parts of server state: caching, staleness, deduplication, retries, and background updates. Zustand handles client-only state.</div>`,
      },
      {
        q: 'Why are query keys like dependency arrays? Explain the stale-data bug and the query key factory pattern.',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The mental model is that a queryKey is to a <code>queryFn</code> what a dependency array is to <code>useEffect</code> — every input the fetcher reads must be in the key, or you'll serve a cached response for the wrong inputs with no error at all. At scale hand-written keys drift apart, so I centralize them in a query key factory as the single source of truth, then lean on prefix-based fuzzy invalidation, where invalidating <code>['todos']</code> busts every todo query underneath it. Two gotchas: keys hash deterministically so object property order doesn't matter, but array order does; and changing the state that feeds the key is the idiomatic way to refetch, not calling <code>refetch()</code>.</p></div>
<p>The mental model interviewers probe: <strong>a queryKey is to a queryFn what a dependency array is to useEffect</strong>. Every value the queryFn reads must appear in the key — the key IS the cache identity and the refetch trigger.</p>
<pre>// ❌ THE BUG: filter used by queryFn but missing from the key
function Todos({ status }) {
  return useQuery({
    queryKey: ['todos'],                    // key never changes...
    queryFn: () => fetchTodos({ status }),  // ...but the request does!
  });
}
// Switch status 'open' → 'done': same key → Query happily returns
// the cached 'open' list and sees no reason to refetch.
// The UI silently shows the WRONG data. No error, no warning.

// ✅ FIX: the key changes → new cache entry → automatic refetch
useQuery({
  queryKey: ['todos', { status }],
  queryFn: () => fetchTodos({ status }),
});</pre>
<p>At scale, hand-written keys drift apart (<code>['todos', id]</code> here, <code>['todo', id]</code> there) and invalidation silently misses entries. The fix is a <strong>query key factory</strong> — one module that owns every key shape:</p>
<pre>// queries/todoKeys.ts — single source of truth
const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id) => [...todoKeys.details(), id] as const,
};

useQuery({ queryKey: todoKeys.list({ status }), queryFn: ... });

// Hierarchical (fuzzy) invalidation — matching is by PREFIX:
queryClient.invalidateQueries({ queryKey: todoKeys.all });
// matches ['todos'], ['todos','list',{...}], ['todos','detail', 5] — all of them

queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
// matches only the list queries, detail caches stay fresh

// exact: true disables prefix matching when you need surgical precision
queryClient.invalidateQueries({ queryKey: todoKeys.detail(5), exact: true });</pre>
<p><strong>Interviewer follow-ups:</strong> keys are hashed <em>deterministically</em>, so object property order doesn't matter (<code>{ page, status }</code> equals <code>{ status, page }</code>), but array order does. And because the key drives fetching, you rarely need <code>refetch()</code> — changing state that's part of the key is the idiomatic way to trigger a new request.</p>
<div class="key-point">Treat the queryKey like a useEffect dependency array: every input of the queryFn belongs in it, centralize key shapes in a factory, and lean on prefix-based invalidation for cheap, reliable cache busting.</div>`,
      },
      {
        q: 'invalidateQueries vs refetch vs setQueryData — when do you use each?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p><code>invalidateQueries</code> marks matching queries stale and refetches the active ones lazily — that's my default after a mutation when I don't know the new value. <code>refetch()</code> re-runs one specific query immediately, ignoring <code>staleTime</code>, which I reserve for an explicit user action like a Reload button. <code>setQueryData</code> writes a known value straight into the cache with no network at all — for a mutation response or an optimistic update. The failure modes: <code>refetch()</code> everywhere hammers the API and ignores the cache, while <code>setQueryData</code> alone lets list and aggregate queries drift, so I back it with an <code>invalidateQueries</code> in <code>onSettled</code> as a consistency net.</p></div>
<p>Three ways to "update" a query, with very different semantics — mixing them up causes either wasted network calls or stale UIs.</p>
<table><tr><th>Method</th><th>What it does</th><th>Use when</th></tr>
<tr><td><code>invalidateQueries</code></td><td>Marks matching queries stale; refetches <strong>active</strong> (mounted) ones now, inactive ones on next mount</td><td>"The server changed, I don't know the new value" — after most mutations</td></tr>
<tr><td><code>refetch()</code></td><td>Re-runs <strong>this one query</strong> immediately, ignoring staleTime</td><td>Explicit user action: a "Reload" button</td></tr>
<tr><td><code>setQueryData</code></td><td>Writes directly into the cache, <strong>no network at all</strong></td><td>You already have the fresh value (mutation response, websocket push, optimistic update)</td></tr>
</table>
<pre>const queryClient = useQueryClient();

// 1. invalidateQueries — "this MIGHT be outdated, go check"
queryClient.invalidateQueries({ queryKey: ['todos'] });
// Active ['todos'...] queries refetch in the background;
// unmounted ones are just flagged and refetch when remounted.
// This laziness is the feature: no wasted requests for hidden screens.

// 2. refetch — "fetch again NOW, staleness be damned"
const { data, refetch, isFetching } = useQuery({
  queryKey: ['report', id],
  queryFn: () => fetchReport(id),
});
&lt;button onClick={() => refetch()} disabled={isFetching}&gt;Reload&lt;/button&gt;

// ❌ Common misuse of refetch: reacting to a filter change
useEffect(() => { refetch(); }, [statusFilter]); // fighting the library
// ✅ Put the filter in the key — the key change refetches for you
useQuery({ queryKey: ['todos', statusFilter], ... });

// 3. setQueryData — the server already TOLD you the answer
const mutation = useMutation({
  mutationFn: updateTodo,
  onSuccess: (updatedTodo) => {
    // write the response straight into the cache — zero extra requests
    queryClient.setQueryData(['todos', updatedTodo.id], updatedTodo);
    // and update it inside the cached list too
    queryClient.setQueryData(['todos'], (old) =>
      old?.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
    );
  },
});</pre>
<p><strong>Failure modes:</strong> using <code>refetch()</code> everywhere ignores the cache and hammers the API; using only <code>setQueryData</code> after mutations lets list/aggregate queries drift from the server (a follow-up invalidate in <code>onSettled</code> is the safety net); invalidating <code>['todos']</code> when you meant one entry refetches every todo query via prefix matching.</p>
<div class="key-point">Default to <code>invalidateQueries</code> after mutations, reserve <code>refetch()</code> for explicit user-triggered reloads, and use <code>setQueryData</code> only when you already hold the fresh server value — often followed by an invalidate as a consistency backstop.</div>`,
      },
      {
        q: 'How does TanStack Query prevent race conditions? Explain request cancellation with AbortSignal.',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Query keys make out-of-order responses harmless: a late response only ever lands in its own key's cache, so in search-as-you-type a slow response for an old term can't overwrite the results the component is currently subscribed to. That's correctness for free compared to raw <code>useEffect</code>+<code>fetch</code>, where a stale response happily overwrites your state. To also stop wasting bandwidth, forward the <code>AbortSignal</code> the <code>queryFn</code> receives, which upgrades it from "ignore stale responses" to actually cancelling the superseded requests. The same mechanism is why optimistic updates begin with <code>cancelQueries</code> — a late background refetch would otherwise clobber the optimistic write.</p></div>
<p>The classic race: <strong>search-as-you-type</strong>. The user types "re" (request A), then "react" (request B). B resolves first, then the slow A lands and overwrites the UI with results for "re" — an out-of-order response bug that plain <code>useEffect + fetch + setState</code> code has by default.</p>
<pre>// TanStack Query is race-safe PER KEY: each keystroke produces a new
// queryKey, and only data belonging to the CURRENT key is rendered.
// A late response for ['search', 're'] can never overwrite
// what a component subscribed to ['search', 'react'] displays.

function Search() {
  const [term, setTerm] = useState('');

  const { data, isPlaceholderData } = useQuery({
    queryKey: ['search', term],
    // Query hands the queryFn an AbortSignal. Forward it, and the
    // moment the query is superseded/unmounted the HTTP request is
    // truly cancelled — not just ignored — saving bandwidth and
    // server load, and freeing the retry logic from zombie requests.
    queryFn: ({ signal }) =>
      fetch(\`/api/search?q=\${encodeURIComponent(term)}\`, { signal })
        .then((r) => r.json()),
    enabled: term.length &gt; 1,
    placeholderData: keepPreviousData, // keep old results visible while
                                       // the new key loads → no flicker
  });

  return (
    &lt;div style={{ opacity: isPlaceholderData ? 0.6 : 1 }}&gt;
      &lt;input value={term} onChange={(e) => setTerm(e.target.value)} /&gt;
      {data?.results.map((r) => &lt;div key={r.id}&gt;{r.title}&lt;/div&gt;)}
    &lt;/div&gt;
  );
}

// axios works the same way:
queryFn: ({ signal }) => axios.get('/api/search', { params: { q: term }, signal })</pre>
<p><strong>Subtleties interviewers dig into:</strong></p>
<ul>
<li>Without forwarding <code>signal</code>, Query still discards stale results (UI stays correct), but the abandoned requests keep running to completion — cancellation is an optimization you must opt into.</li>
<li><code>keepPreviousData</code>/<code>placeholderData</code> solves the pagination-flicker cousin of this problem: page 2's key has no data yet, so page 1 stays on screen (with <code>isPlaceholderData</code> to dim it) instead of a loading blank.</li>
<li>The same mechanism is why optimistic updates start with <code>await queryClient.cancelQueries(...)</code> — an in-flight background refetch resolving late would clobber your optimistic cache write.</li>
</ul>
<div class="key-point">Query keys make out-of-order responses harmless — a response only ever lands in its own key's cache — and forwarding the provided <code>AbortSignal</code> upgrades that from "ignore stale responses" to "actually cancel stale requests".</div>`,
      },
    ],
  },
];
