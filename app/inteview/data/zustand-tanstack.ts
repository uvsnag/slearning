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
        a: `<p><strong>Zustand</strong> is a small, fast, unopinionated state management library for React. It uses a hook-based API with no boilerplate.</p>
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
        a: `<p>Zustand uses <strong>selectors</strong> to subscribe to specific parts of the store. Components only re-render when their selected state changes.</p>
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
        a: `<p>Zustand handles async naturally — just use <code>async/await</code> inside actions. No thunks or middleware needed.</p>
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
        a: `<p>Zustand middleware wraps the store to add features like persistence, DevTools, and immutable updates.</p>
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
        a: `<p>For large apps, split the store into <strong>slices</strong> — separate files that each manage a domain, then combine them.</p>
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
        a: `<p>Zustand stores can be used outside React — in utility functions, API interceptors, or tests.</p>
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
        a: `<pre>// ❌ Anti-pattern 1: No selector — subscribes to entire store
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
        a: `<table><tr><th>Library</th><th>Model</th><th>Best For</th><th>Size</th></tr>
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
        a: `<p><strong>TanStack Query</strong> is a server state management library for fetching, caching, synchronizing, and updating server data in React.</p>
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
        a: `<p>Every query is identified by its <strong>queryKey</strong>. The cache stores data by key.</p>
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
        a: `<p><code>useMutation</code> handles data modification (POST, PUT, DELETE) with callbacks for success, error, and cache invalidation.</p>
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
        a: `<p><strong>Optimistic updates</strong> update the UI immediately (before the server responds), then roll back if the mutation fails.</p>
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
        a: `<pre>// 1. Standard pagination
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
        a: `<pre>// Install: npm install @tanstack/react-query-devtools

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
        a: `<pre>import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
        a: `<pre>// 1. Parallel queries (independent — fetch simultaneously)
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
        a: `<p><strong>TanStack Form</strong> is a headless, type-safe form library with built-in validation, supporting React, Vue, Angular, and Solid.</p>
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
        a: `<p>Understanding this distinction is key to choosing the right tool.</p>
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
    ],
  },
];
