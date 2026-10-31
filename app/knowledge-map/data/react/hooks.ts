import type { KmNode } from '../../types';

export const hooks: KmNode = {
  title: 'Hooks, Context & Reducers',
  level: 'intermediate',
  summary: 'The rules of hooks, writing your own hooks, sharing data with context, and useReducer.',
  simple:
    'Hooks are plug-in sockets that give a function component powers like memory or side effects. Custom hooks let you bundle those powers and reuse them.',
  points: [
    'Hooks are functions whose names start with <code>use</code>.',
    'Context passes data deep down without threading props through every layer.',
    'useReducer moves complex state logic into one pure function.',
  ],
  children: [
    {
      title: 'Rules of Hooks',
      level: 'intermediate',
      summary:
        'Call hooks only at the top level of components or custom hooks, never conditionally.',
      simple:
        'React remembers hooks by their order, like seats in a cinema by number. If you skip a seat once, everyone ends up in the wrong seat.',
      points: [
        'No hooks inside <code>if</code>, loops, nested functions or after an early <code>return</code>.',
        'Only call them from React function components or custom hooks.',
        'Exception: <code>use()</code> (React 19) can be called inside conditions and loops.',
        '<code>eslint-plugin-react-hooks</code> enforces these rules; always enable it.',
      ],
      tip: 'Why the rule exists: React stores hook state in a list per component and matches it by call order.',
    },
    {
      title: 'Custom Hooks',
      level: 'intermediate',
      summary:
        'Your own function starting with "use" that combines other hooks to reuse stateful logic.',
      simple:
        'A custom hook is a recipe you wrote once ("track window width") and can now use in any component.',
      points: [
        'Shares logic, not state: each component calling it gets its own copy.',
        'Name must start with <code>use</code> so the lint rules can check it.',
        'Good examples: <code>useOnlineStatus</code>, <code>useDebounce</code>, <code>useLocalStorage</code>.',
        'Don’t make a hook if it calls no other hooks; a normal function is enough.',
      ],
      detail: `<pre><code>function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() =&gt; {
    const update = () =&gt; setOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () =&gt; {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  return online;
}</code></pre>`,
    },
    {
      title: 'Context',
      level: 'intermediate',
      summary:
        'Lets a parent provide a value that any component below it can read, without passing props.',
      simple:
        'Like Wi-Fi in a house: the router (provider) broadcasts, and any room (component) inside can connect without running a cable.',
      points: [
        'Create with <code>createContext(defaultValue)</code>.',
        'Provide: React 19 lets you render <code>&lt;ThemeContext value="dark"&gt;</code>; older versions need <code>.Provider</code>.',
        'Read with <code>useContext(ThemeContext)</code> or <code>use(ThemeContext)</code>.',
        'Great for theme, current user, locale: data many components need.',
        'Try composition (passing children) before reaching for context.',
      ],
      detail: `<pre><code>const ThemeContext = createContext('light');

function App() {
  return (
    &lt;ThemeContext value="dark"&gt;
      &lt;Toolbar /&gt;
    &lt;/ThemeContext&gt;
  );
}

function Button() {
  const theme = useContext(ThemeContext);
  return &lt;button className={theme}&gt;OK&lt;/button&gt;;
}</code></pre>`,
    },
    {
      title: 'Context Re-renders',
      level: 'advanced',
      summary: 'When the provided value changes, every component reading that context re-renders.',
      points: [
        'A new object as value (<code>value={{ user, setUser }}</code>) is "changed" on every parent render.',
        'Wrap the value in <code>useMemo</code> (or let React Compiler do it).',
        'Split fast-changing and slow-changing data into separate contexts.',
        'Context isn’t a state manager; for frequent updates to big shared state, use a store like Zustand.',
      ],
    },
    {
      title: 'useReducer',
      level: 'intermediate',
      summary:
        'Manage state with a reducer: a pure function that takes state and an action and returns new state.',
      simple:
        'Instead of many people editing a document, everyone sends request slips ("add item", "remove item") to one clerk who applies them by the rules.',
      points: [
        '<code>const [state, dispatch] = useReducer(reducer, initialState)</code>.',
        'Actions describe what happened: <code>{ type: "added", text }</code>.',
        'All update logic lives in one place and is easy to unit test.',
        'Good when many events change the same state, or the next state depends on several fields.',
      ],
      detail: `<pre><code>function reducer(todos, action) {
  switch (action.type) {
    case 'added':
      return [...todos, { id: action.id, text: action.text }];
    case 'deleted':
      return todos.filter((t) =&gt; t.id !== action.id);
    default:
      throw new Error('Unknown action ' + action.type);
  }
}</code></pre>`,
    },
    {
      title: 'Reducer + Context',
      level: 'advanced',
      summary:
        'Combine useReducer with context to share state and dispatch across a whole subtree.',
      points: [
        'Put state in one context and <code>dispatch</code> in another.',
        '<code>dispatch</code> never changes, so components that only dispatch don’t re-render on state changes.',
        'Wrap both in a provider component and expose custom hooks like <code>useTasks()</code>.',
        'A light alternative to Redux for medium apps.',
      ],
    },
    {
      title: 'useId',
      level: 'intermediate',
      summary: 'Generates a unique, stable id, mainly to link labels and inputs for accessibility.',
      simple:
        'A label needs to point to its input by id. useId gives each component instance its own id so two forms never clash.',
      points: [
        'Same id on server and client, so it’s safe with SSR and hydration.',
        'Use for <code>htmlFor</code>, <code>aria-describedby</code> and similar.',
        'Not for list keys; keys should come from your data.',
      ],
    },
    {
      title: 'useSyncExternalStore',
      level: 'expert',
      summary:
        'Subscribes a component to a store that lives outside React, safely under concurrent rendering.',
      points: [
        '<code>useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)</code>.',
        'Prevents "tearing": different parts of the UI showing different versions of the same data.',
        'State libraries (Redux, Zustand) use it internally.',
        '<code>getSnapshot</code> must return the same value if nothing changed, or you loop forever.',
      ],
    },
  ],
};
