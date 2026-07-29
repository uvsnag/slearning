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
        a: `<div class="interview-answer"><p><strong>Zustand</strong> is a very small state library for React that uses a hook and needs no provider or reducers. It only re-renders the components that use the exact piece of state that changed, so it avoids the problem where Context re-renders every consumer. It is a good default for client and UI state. It should not be used for server data such as API responses, because that is the job of TanStack Query.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Zustand</strong> là một thư viện quản lý state rất nhỏ gọn cho React, dùng hook và không cần provider hay reducer. Nó chỉ re-render những component thực sự dùng đúng phần state vừa thay đổi, nên tránh được vấn đề Context re-render mọi consumer. Đây là lựa chọn mặc định tốt cho client state và UI state. Không nên dùng nó cho dữ liệu server như response API, vì đó là việc của TanStack Query.</p></details>
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
        a: `<div class="interview-answer"><p>A component reads state through a <em>selector</em> and only re-renders when that selected value changes. A common mistake is returning a new object or array from the selector every time, because the reference is always new and the check fails; <code>useShallow</code> (or the older <code>shallow</code>) fixes this. It is best to select the smallest piece of state needed and to read actions in a separate selector from values.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một component đọc state qua một <em>selector</em> và chỉ re-render khi giá trị được chọn đó thay đổi. Một lỗi phổ biến là mỗi lần selector lại trả về một object hoặc array mới, vì reference luôn khác nhau nên phép so sánh luôn thất bại; <code>useShallow</code> (hoặc <code>shallow</code> cũ hơn) sẽ khắc phục điều này. Tốt nhất là chọn phần state nhỏ nhất mà bạn cần, và đọc các action bằng một selector riêng tách khỏi các giá trị.</p></details>
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
        a: `<div class="interview-answer"><p>Async work in Zustand needs no extra tools. An action can be a normal <code>async</code> function that calls <code>set</code> when the promise finishes, and <code>get()</code> reads the current state inside the action. This is only for client-owned flows. Fetching API data that needs caching, dedup, or retries should use TanStack Query instead.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Xử lý bất đồng bộ trong Zustand không cần thêm công cụ nào. Một action có thể là một hàm <code>async</code> bình thường, gọi <code>set</code> khi promise hoàn tất, còn <code>get()</code> đọc state hiện tại ngay bên trong action. Cách này chỉ dành cho các luồng do client sở hữu. Việc fetch dữ liệu API cần cache, dedup hay retry thì nên dùng TanStack Query.</p></details>
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
        a: `<div class="interview-answer"><p>Middleware are wrappers around the store that add features, and they are combined by nesting. <code>persist</code> saves state to localStorage, <code>devtools</code> connects to Redux DevTools, and <code>immer</code> allows writing updates in a mutable style for deeply nested state. The order matters, so <code>devtools</code> is usually kept outermost. With <code>persist</code>, use <code>partialize</code> so that private data like auth tokens is not saved to storage.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Middleware là các lớp bọc quanh store để thêm tính năng, và chúng được kết hợp bằng cách lồng vào nhau. <code>persist</code> lưu state vào localStorage, <code>devtools</code> kết nối với Redux DevTools, còn <code>immer</code> cho phép viết cập nhật theo kiểu mutable cho state lồng sâu. Thứ tự lồng rất quan trọng, nên thường đặt <code>devtools</code> ở ngoài cùng. Với <code>persist</code>, hãy dùng <code>partialize</code> để dữ liệu nhạy cảm như auth token không bị lưu vào storage.</p></details>
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
        a: `<div class="interview-answer"><p>A large store can be split into slice functions, where each slice owns one domain, and the slices are then spread into a single <code>create</code> call. Cross-slice reads go through <code>get()</code>. Slices help once the store grows past about ten fields, but truly independent domains are better as separate stores. In TypeScript, the combined store type is the intersection of each slice's return type.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một store lớn có thể được tách thành các hàm slice, mỗi slice quản lý một domain, rồi spread chúng vào chung một lời gọi <code>create</code>. Việc đọc chéo giữa các slice thực hiện qua <code>get()</code>. Slice trở nên hữu ích khi store vượt quá khoảng mười field, nhưng những domain thực sự độc lập thì nên tách thành các store riêng. Trong TypeScript, kiểu của store kết hợp chính là giao (intersection) của kiểu trả về từ mỗi slice.</p></details>
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
        a: `<div class="interview-answer"><p>A Zustand store is a plain object, so <code>getState</code>, <code>setState</code>, and <code>subscribe</code> all work without React. This makes it useful in axios interceptors, plain event handlers, and tests. Outside React, always read the current value with <code>getState()</code> at call time. Also note that <code>subscribe</code> returns an unsubscribe function that must be called to avoid leaking listeners.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một Zustand store là một object thuần, nên <code>getState</code>, <code>setState</code> và <code>subscribe</code> đều hoạt động mà không cần React. Điều này hữu ích trong axios interceptor, các event handler thuần và trong test. Bên ngoài React, hãy luôn đọc giá trị hiện tại bằng <code>getState()</code> tại thời điểm gọi. Cũng lưu ý rằng <code>subscribe</code> trả về một hàm unsubscribe mà bạn phải gọi để tránh rò rỉ listener.</p></details>
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
        a: `<div class="interview-answer"><p>Common mistakes include reading the whole store with no selector, returning new objects from a selector without <code>shallow</code>, changing state in place without <code>immer</code> so no re-render happens, and storing derived values that drift out of sync. The biggest one is keeping server state in Zustand, which belongs in TanStack Query. It is better to keep the store small and compute derived values in selectors.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Các lỗi thường gặp gồm: đọc toàn bộ store mà không dùng selector, trả về object mới từ selector mà không có <code>shallow</code>, sửa state tại chỗ mà không có <code>immer</code> khiến không re-render, và lưu các giá trị dẫn xuất bị lệch khỏi thực tế. Lỗi lớn nhất là giữ server state trong Zustand, trong khi nó thuộc về TanStack Query. Tốt nhất là giữ store nhỏ gọn và tính các giá trị dẫn xuất ngay trong selector.</p></details>
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
        a: `<div class="interview-answer"><p>Zustand is a good default because it is tiny and simple. Redux Toolkit fits when strict patterns, action logging, or time-travel debugging are needed, or when the team already knows Redux. Jotai suits fine-grained atomic state with many small independent pieces, and Recoil is best avoided because it is no longer maintained. Most apps are well served by Zustand for client state plus TanStack Query for server state.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Zustand là lựa chọn mặc định tốt vì nó rất nhỏ và đơn giản. Redux Toolkit phù hợp khi cần pattern chặt chẽ, log action hay debug time-travel, hoặc khi team đã quen với Redux. Jotai hợp với state nguyên tử chi tiết gồm nhiều mảnh nhỏ độc lập, còn Recoil thì nên tránh vì không còn được bảo trì. Hầu hết ứng dụng đều phù hợp với Zustand cho client state cộng với TanStack Query cho server state.</p></details>
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
        a: `<div class="interview-answer"><p>There are two SSR traps. A module-level store on the server is one instance shared by every request, so one user's state can leak into another user's render. Also, <code>persist</code> reads localStorage on the first render, which causes a hydration mismatch. The fix is to create one store per request behind a Context provider, hold it in a <code>useRef</code>, and delay <code>persist</code> rehydration until after mount with <code>skipHydration</code>.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Có hai cái bẫy khi dùng SSR. Một store ở cấp module trên server chỉ là một instance duy nhất dùng chung cho mọi request, nên state của người dùng này có thể rò rỉ sang lần render của người dùng khác. Ngoài ra, <code>persist</code> đọc localStorage ngay ở lần render đầu tiên, gây ra lỗi hydration mismatch. Cách khắc phục là tạo một store cho mỗi request đặt sau một Context provider, giữ nó trong một <code>useRef</code>, và hoãn việc rehydrate của <code>persist</code> đến sau khi mount bằng <code>skipHydration</code>.</p></details>
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
        a: `<div class="interview-answer"><p>Transient updates react to state changes without causing a React re-render. Using <code>store.subscribe</code>, high-frequency values such as mouse position or price ticks can be written straight into a ref or the DOM node, and <code>subscribeWithSelector</code> watches only one slice. Inside callbacks, read the current value with <code>getState()</code> to avoid a stale closure. This direct DOM update should stay limited to leaf nodes.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Transient update là phản ứng với thay đổi state mà không gây ra re-render React. Dùng <code>store.subscribe</code>, các giá trị tần suất cao như vị trí chuột hay tick giá có thể được ghi thẳng vào một ref hoặc vào DOM node, và <code>subscribeWithSelector</code> chỉ theo dõi một phần state. Bên trong callback, hãy đọc giá trị hiện tại bằng <code>getState()</code> để tránh stale closure. Cách cập nhật DOM trực tiếp này nên chỉ giới hạn ở các leaf node.</p></details>
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
        a: `<div class="interview-answer"><p><strong>TanStack Query</strong> is a cache for server state, not just a fetching tool. Given a key and a fetch function, it provides caching, deduplication, background refetch, retries, and stale-while-revalidate. Doing the same by hand with <code>useEffect</code> and <code>fetch</code> is error-prone and often has race-condition bugs. The cache is the source of truth for server data, so it should not be copied into Zustand or Redux.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>TanStack Query</strong> là một cache cho server state, không chỉ là công cụ fetch. Khi cho nó một key và một hàm fetch, nó cung cấp caching, dedup, refetch nền, retry và stale-while-revalidate. Tự làm những việc đó bằng tay với <code>useEffect</code> và <code>fetch</code> rất dễ sai và thường dính bug race condition. Cache là nguồn sự thật cho dữ liệu server, nên đừng sao chép nó vào Zustand hay Redux.</p></details>
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
        a: `<div class="interview-answer"><p>The <code>queryKey</code> is the cache identity, so the same key means the same cache entry, and every input the <code>queryFn</code> uses must be in the key. Two settings are often confused: <code>staleTime</code> is how long data stays fresh before a background refetch, and <code>gcTime</code> is how long unused data stays in memory after the last user unmounts. The default <code>staleTime</code> is zero, so it refetches often; stable data should use a higher value.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>queryKey</code> chính là danh tính của cache, nên cùng một key nghĩa là cùng một entry cache, và mọi input mà <code>queryFn</code> sử dụng đều phải nằm trong key. Có hai thiết lập hay bị nhầm lẫn: <code>staleTime</code> là khoảng thời gian dữ liệu còn được coi là tươi trước khi refetch nền, còn <code>gcTime</code> là khoảng thời gian dữ liệu không dùng còn nằm trong bộ nhớ sau khi người dùng cuối cùng unmount. Mặc định <code>staleTime</code> bằng 0 nên nó refetch khá thường xuyên; dữ liệu ổn định thì nên đặt giá trị cao hơn.</p></details>
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
        a: `<div class="interview-answer"><p><code>useMutation</code> handles writes and gives status like <code>isPending</code> and <code>isError</code> plus <code>onSuccess</code>, <code>onError</code>, and <code>onSettled</code> hooks. The usual flow is to call <code>mutate</code> and then <code>invalidateQueries</code> in <code>onSuccess</code> to resync the affected lists. Mutations do not update the cache on their own, so either invalidate the related queries or write the response with <code>setQueryData</code>. Optimistic updates can be added for an instant feel.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>useMutation</code> xử lý các thao tác ghi và cung cấp các trạng thái như <code>isPending</code> và <code>isError</code> cùng các hook <code>onSuccess</code>, <code>onError</code> và <code>onSettled</code>. Luồng thông thường là gọi <code>mutate</code> rồi <code>invalidateQueries</code> trong <code>onSuccess</code> để đồng bộ lại những list bị ảnh hưởng. Mutation không tự cập nhật cache, nên hãy hoặc invalidate các query liên quan, hoặc ghi response vào cache bằng <code>setQueryData</code>. Có thể thêm optimistic update để mang lại cảm giác tức thì.</p></details>
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
        a: `<div class="interview-answer"><p>An optimistic update changes the cache before the server responds so the UI feels instant, then rolls back if the request fails. In <code>onMutate</code>, call <code>cancelQueries</code>, snapshot the previous value, update with <code>setQueryData</code>, and return the snapshot; <code>onError</code> restores it, and <code>onSettled</code> invalidates to reconcile with the server. The <code>cancelQueries</code> step is required, because a late background refetch could otherwise overwrite the optimistic value.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Optimistic update thay đổi cache trước khi server phản hồi để UI có cảm giác tức thì, rồi rollback nếu request thất bại. Trong <code>onMutate</code>, hãy gọi <code>cancelQueries</code>, chụp lại giá trị trước đó, cập nhật bằng <code>setQueryData</code> rồi trả về snapshot; <code>onError</code> khôi phục lại nó, còn <code>onSettled</code> invalidate để đồng bộ lại với server. Bước <code>cancelQueries</code> là bắt buộc, vì một lần refetch nền đến muộn có thể ghi đè lên giá trị optimistic.</p></details>
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
        a: `<div class="interview-answer"><p>For paged lists, <code>placeholderData: keepPreviousData</code> keeps the old page visible while the next one loads instead of showing a blank screen. For feeds, <code>useInfiniteQuery</code> manages the cursor and joins pages using <code>getNextPageParam</code>. The page or cursor should be part of the queryKey so each page caches on its own. The Next button should be disabled while <code>isPlaceholderData</code> is true.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Với list phân trang, <code>placeholderData: keepPreviousData</code> giữ trang cũ hiển thị trong khi trang mới đang tải thay vì hiện màn hình trắng. Với feed, <code>useInfiniteQuery</code> quản lý cursor và ghép các trang lại bằng <code>getNextPageParam</code>. Số trang hoặc cursor nên là một phần của queryKey để mỗi trang được cache riêng. Nút Next nên bị vô hiệu hóa khi <code>isPlaceholderData</code> đang là true.</p></details>
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
        a: `<div class="interview-answer"><p>The DevTools panel shows what the cache is doing, including each query's state as fresh, stale, fetching, or inactive, the cached data per key, and buttons to invalidate or refetch. Many issues it reveals are configuration problems, such as a <code>staleTime</code> of zero, an unstable key or <code>queryFn</code> causing loops, or a short <code>gcTime</code> dropping data early. It only ships in development builds, so it adds no cost to production.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Panel DevTools cho thấy cache đang làm gì, gồm trạng thái của từng query như fresh, stale, fetching hay inactive, dữ liệu được cache theo từng key, và các nút để invalidate hoặc refetch. Nhiều vấn đề nó phơi bày thực ra là lỗi cấu hình, chẳng hạn <code>staleTime</code> bằng 0, một key hoặc <code>queryFn</code> không ổn định gây vòng lặp, hoặc <code>gcTime</code> quá ngắn khiến dữ liệu bị bỏ sớm. Nó chỉ được đưa vào bản build development nên không tốn chi phí gì cho production.</p></details>
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
        a: `<div class="interview-answer"><p>Create one <code>QueryClient</code> at the app root and set sensible <code>defaultOptions</code>, such as a five-minute <code>staleTime</code>, a couple of retries, and refetch on focus and reconnect, then override per query when needed. Cross-cutting handling, like redirecting to login on a 401, can go on the query cache's <code>onError</code>. The client must not be recreated on every render, so keep it in module scope or a ref. In SSR it must be one client per request.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hãy tạo một <code>QueryClient</code> duy nhất ở gốc ứng dụng và đặt các <code>defaultOptions</code> hợp lý, chẳng hạn <code>staleTime</code> năm phút, vài lần retry, cùng refetch khi focus và khi reconnect, rồi ghi đè theo từng query khi cần. Việc xử lý xuyên suốt như redirect về trang login khi gặp 401 có thể đặt ở <code>onError</code> của query cache. Không được tạo lại client ở mỗi lần render, nên hãy giữ nó ở phạm vi module hoặc trong một ref. Với SSR thì phải là một client cho mỗi request.</p></details>
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
        a: `<div class="interview-answer"><p>Independent queries run in parallel simply by declaring several <code>useQuery</code> hooks. Dependent queries chain with <code>enabled</code>, so the second query waits until the first one's data exists. When the number of parallel queries is dynamic, use <code>useQueries</code>. Note that <code>enabled: false</code> leaves a query pending, so loading UI must account for it, and chaining dependent queries creates a slower request waterfall.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Các query độc lập chạy song song đơn giản bằng cách khai báo nhiều hook <code>useQuery</code>. Các query phụ thuộc thì nối chuỗi bằng <code>enabled</code>, để query thứ hai chờ đến khi dữ liệu của query đầu tồn tại. Khi số lượng query song song thay đổi động, hãy dùng <code>useQueries</code>. Lưu ý rằng <code>enabled: false</code> khiến query ở trạng thái pending, nên UI loading phải tính đến điều này, và việc nối chuỗi các query phụ thuộc tạo ra một waterfall request chậm hơn.</p></details>
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
        a: `<div class="interview-answer"><p>TanStack Form is headless, works across frameworks, and its main strength is full type safety for field names and values. React Hook Form is React-only but more mature with a larger ecosystem, and it usually pairs with Zod through a resolver for validation. For most React apps today, React Hook Form plus Zod is a safe choice, while TanStack Form fits when stronger typing or cross-framework use matters. Both are fast and mostly uncontrolled.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>TanStack Form là headless, hoạt động trên nhiều framework, và điểm mạnh chính của nó là type safety đầy đủ cho tên field và giá trị. React Hook Form chỉ dành cho React nhưng trưởng thành hơn với hệ sinh thái lớn hơn, và thường kết hợp với Zod thông qua một resolver để validate. Với hầu hết ứng dụng React hiện nay, React Hook Form cộng Zod là lựa chọn an toàn, còn TanStack Form hợp khi cần typing mạnh hơn hoặc dùng đa framework. Cả hai đều nhanh và phần lớn là uncontrolled.</p></details>
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
        a: `<div class="interview-answer"><p>Server state lives on a remote source, is shared with other users, is asynchronous, and can become stale when someone else changes it. Client state is local, synchronous, and fully owned by the app. This difference decides the tool: TanStack Query for server state, and Zustand or <code>useState</code> for client state. Fetching into a Zustand store is a common mistake, and copying server data into a client store creates a second source of truth that drifts.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Server state nằm ở một nguồn từ xa, được chia sẻ với những người dùng khác, mang tính bất đồng bộ, và có thể trở nên cũ khi người khác thay đổi nó. Client state là cục bộ, đồng bộ, và hoàn toàn do ứng dụng sở hữu. Khác biệt này quyết định công cụ: TanStack Query cho server state, còn Zustand hoặc <code>useState</code> cho client state. Fetch dữ liệu vào một Zustand store là lỗi thường gặp, và việc sao chép dữ liệu server vào một client store tạo ra một nguồn sự thật thứ hai bị lệch dần.</p></details>
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
        a: `<div class="interview-answer"><p>A queryKey works like a <code>useEffect</code> dependency array: every input the <code>queryFn</code> reads must be in the key, or the cache returns data for the wrong inputs with no error. At scale, hand-written keys drift apart, so a query key factory keeps all key shapes in one place. Invalidation is by prefix, so invalidating <code>['todos']</code> clears every todo query under it. Keys hash deterministically, so object key order does not matter, but array order does.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một queryKey hoạt động giống như dependency array của <code>useEffect</code>: mọi input mà <code>queryFn</code> đọc đều phải nằm trong key, nếu không cache sẽ trả về dữ liệu cho sai input mà không hề báo lỗi. Ở quy mô lớn, các key viết tay sẽ lệch nhau, nên một query key factory giúp gom mọi hình dạng key về một chỗ. Việc invalidate là theo prefix, nên invalidate <code>['todos']</code> sẽ xóa mọi query todo nằm dưới nó. Key được hash một cách xác định, nên thứ tự thuộc tính trong object không quan trọng, nhưng thứ tự phần tử trong array thì có.</p></details>
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
        a: `<div class="interview-answer"><p><code>invalidateQueries</code> marks matching queries stale and refetches the active ones, and it is the default after a mutation when the new value is unknown. <code>refetch()</code> re-runs one query right away and ignores <code>staleTime</code>, which suits an explicit action like a Reload button. <code>setQueryData</code> writes a known value into the cache with no network call, for a mutation response or an optimistic update. Using <code>setQueryData</code> alone can let list queries drift, so an <code>invalidateQueries</code> in <code>onSettled</code> acts as a safety net.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>invalidateQueries</code> đánh dấu các query khớp là stale và refetch những query đang active, đây là lựa chọn mặc định sau một mutation khi chưa biết giá trị mới. <code>refetch()</code> chạy lại đúng một query ngay lập tức và bỏ qua <code>staleTime</code>, phù hợp cho một hành động rõ ràng như nút Reload. <code>setQueryData</code> ghi một giá trị đã biết vào cache mà không gọi mạng, dùng cho response của mutation hoặc cho optimistic update. Chỉ dùng riêng <code>setQueryData</code> có thể khiến các query dạng list bị lệch, nên một <code>invalidateQueries</code> trong <code>onSettled</code> đóng vai trò lưới an toàn.</p></details>
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
        a: `<div class="interview-answer"><p>Query keys make out-of-order responses harmless, because a response only lands in its own key's cache; in search-as-you-type, a slow response for an old term cannot overwrite the current results. This is correct by default, unlike raw <code>useEffect</code> and <code>fetch</code> where a stale response can overwrite state. Forwarding the <code>AbortSignal</code> that the <code>queryFn</code> receives also cancels the superseded requests to save bandwidth. The same idea is why optimistic updates start with <code>cancelQueries</code>.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Query key khiến các response về sai thứ tự trở nên vô hại, vì một response chỉ rơi vào cache của đúng key của nó; trong search-as-you-type, một response chậm của từ khóa cũ không thể ghi đè lên kết quả hiện tại. Đây là hành vi đúng theo mặc định, khác với <code>useEffect</code> và <code>fetch</code> thuần nơi một response cũ có thể ghi đè state. Việc chuyển tiếp <code>AbortSignal</code> mà <code>queryFn</code> nhận được còn hủy luôn các request bị thay thế để tiết kiệm băng thông. Cũng chính ý tưởng này giải thích vì sao optimistic update bắt đầu bằng <code>cancelQueries</code>.</p></details>
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
