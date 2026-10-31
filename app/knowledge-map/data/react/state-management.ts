import type { KmNode } from '../../types';

export const stateManagement: KmNode = {
  title: 'State Management',
  level: 'intermediate',
  summary: 'Where state should live, when to share it, and which tools fit client vs server state.',
  simple:
    'Keep things in the smallest room that needs them. Only move them to the shared living room (a global store) when many rooms really need them.',
  points: [
    'Start with local state; lift it up only when siblings need it.',
    'Server data (from an API) is a cache, not app state. Use a tool built for it.',
    'Reach for a global store only when local state and context get painful.',
  ],
  children: [
    {
      title: 'Lifting State Up',
      level: 'intermediate',
      summary: 'Move shared state to the closest common parent and pass it down as props.',
      simple:
        'Two kids fighting over one toy? The parent holds the toy and decides who gets it. Both kids just ask the parent.',
      points: [
        'One source of truth: each piece of state is owned by exactly one component.',
        'The parent passes the value down and a setter (or <code>onChange</code>) callback.',
        'Children become "controlled" by the parent through props.',
        'Don’t copy props into state; read the prop directly.',
      ],
      detail: `<pre><code>function Accordion() {
  const [openId, setOpenId] = useState(null);
  return items.map((item) =&gt; (
    &lt;Panel
      key={item.id}
      isOpen={openId === item.id}
      onOpen={() =&gt; setOpenId(item.id)}
    /&gt;
  ));
}</code></pre>`,
    },
    {
      title: 'Prop Drilling',
      level: 'intermediate',
      summary: 'Passing props through many layers that don’t use them, just to reach a deep child.',
      simple:
        'Like passing a note down a row of ten people when only the last one needs to read it.',
      points: [
        'A few levels is fine and keeps data flow obvious.',
        'Fix 1: composition. Pass the deep child as <code>children</code> so the middle layers skip it.',
        'Fix 2: context for data many components need.',
        'Fix 3: a global store for big, often-changing shared state.',
      ],
    },
    {
      title: 'Client vs Server State',
      level: 'intermediate',
      summary:
        'Client state is owned by the browser; server state is a copy of data that lives on a server.',
      simple:
        'Client state is your shopping list on paper. Server state is the store’s stock; your copy can go stale any time.',
      points: [
        'Client state: open modals, form drafts, theme, selected tab.',
        'Server state: users, orders, products. Needs caching, refetching, loading and error handling.',
        'Most "global state" in older Redux apps was really server state.',
        'Use TanStack Query (or a framework loader) for server state and keep the store small.',
      ],
    },
    {
      title: 'Zustand',
      level: 'intermediate',
      summary: 'A tiny global store library: one hook, no providers, minimal boilerplate.',
      simple:
        'A shared whiteboard on the wall. Any component can read it or write on it, and only those who look at the changed part notice.',
      points: [
        'Create a store with <code>create</code>; read it with the hook it returns.',
        'Use a selector to subscribe to just one slice and avoid extra re-renders.',
        'Works outside components too (<code>useStore.getState()</code>).',
        'Popular for small to medium apps.',
      ],
      detail: `<pre><code>import { create } from 'zustand';

const useCart = create((set) =&gt; ({
  items: [],
  add: (item) =&gt; set((s) =&gt; ({ items: [...s.items, item] })),
}));

const count = useCart((s) =&gt; s.items.length);</code></pre>`,
    },
    {
      title: 'Redux Toolkit',
      level: 'advanced',
      summary:
        'The official, modern way to write Redux: slices, a configured store and Immer built in.',
      points: [
        '<code>createSlice</code> defines state, reducers and actions together.',
        'Immer lets you write <code>state.items.push(x)</code> safely inside reducers.',
        'Hooks: <code>useSelector</code> to read, <code>useDispatch</code> to send actions.',
        'Strengths: strict one-way flow, great DevTools (time travel), good for large teams.',
        'RTK Query handles server state if you are already on Redux.',
      ],
      detail: `<pre><code>const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) =&gt; { state.value += 1; },
  },
});

export const { increment } = counterSlice.actions;</code></pre>`,
      tip: 'Hand-written Redux (switch statements, action constants) is legacy. If someone says Redux today, they mean Redux Toolkit.',
    },
    {
      title: 'TanStack Query',
      level: 'intermediate',
      summary: 'A library for server state: fetching, caching, refetching and syncing API data.',
      simple:
        'A smart assistant who fetches data for you, remembers it, shares it with anyone who asks, and quietly refreshes it when it gets old.',
      points: [
        '<code>useQuery</code> for reading, <code>useMutation</code> for writing.',
        'Data is cached by <code>queryKey</code>; same key = shared data, one request.',
        'Handles loading, errors, retries, dedupe and background refetch for you.',
        'After a mutation, invalidate related queries so they refetch.',
      ],
      detail: `<pre><code>const { data, isPending, error } = useQuery({
  queryKey: ['todos', userId],
  queryFn: () =&gt; fetch('/api/todos?user=' + userId).then((r) =&gt; r.json()),
});</code></pre>`,
    },
    {
      title: 'URL as State',
      level: 'intermediate',
      summary: 'Store filters, tabs, page numbers and search terms in the URL.',
      simple:
        'If it’s in the address bar, you can bookmark it, share it and hit Back, just like a page in a book.',
      points: [
        'Read and write search params with your router (e.g. <code>useSearchParams</code>).',
        'Survives refresh and works with the Back button.',
        'Great for anything a user might want to share as a link.',
      ],
    },
  ],
};
