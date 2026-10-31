import type { KmNode } from '../../types';

export const components: KmNode = {
  title: 'Components & Props',
  level: 'beginner',
  summary:
    'Build UI from function components, pass data with props, and render lists and conditions.',
  simple:
    'Components are reusable stamps, props are the ink colors you choose each time you stamp. Same stamp, different look.',
  points: [
    'A component is just a function that returns JSX.',
    'Props are the inputs a parent passes in. The child must not change them.',
    'Use plain JavaScript (if, ternary, map) to show conditions and lists.',
  ],
  children: [
    {
      title: 'Function Components',
      level: 'beginner',
      summary: 'A JavaScript function with a capitalized name that returns JSX.',
      simple: 'A component is a recipe card: you call it, and it gives back a piece of the page.',
      points: [
        'Name it with a capital letter, or React treats it as an HTML tag.',
        'Use it like a tag: <code>&lt;Avatar /&gt;</code>.',
        'Define components at the top level of a file, never inside another component.',
        'Class components still work but are legacy; new code uses functions and hooks.',
      ],
      detail: `<pre><code>function Greeting() {
  return &lt;h1&gt;Hello!&lt;/h1&gt;;
}

export default function App() {
  return &lt;Greeting /&gt;;
}</code></pre>`,
      tip: 'A component defined inside another one is re-created on every render, so its state is lost each time.',
    },
    {
      title: 'Props',
      level: 'beginner',
      summary: 'Inputs passed from a parent to a child component, like function arguments.',
      simple:
        'Props are like the order you give a barista: size, milk, sugar. The barista (child) uses them but doesn’t rewrite your order.',
      points: [
        'Props arrive as one object; destructure it: <code>function Avatar({ name, size })</code>.',
        'Set defaults in the destructuring: <code>{ size = 48 }</code>.',
        'Any value works: strings, numbers, objects, arrays, functions, even JSX.',
        'Props are read-only. To change something, the parent passes new props.',
        'Spread to forward many props: <code>&lt;Avatar {...user} /&gt;</code> (use sparingly).',
      ],
      detail: `<pre><code>function Avatar({ name, size = 48 }) {
  return &lt;img alt={name} width={size} src={'/img/' + name + '.png'} /&gt;;
}

&lt;Avatar name="lin" size={64} /&gt;</code></pre>`,
    },
    {
      title: 'Children & Composition',
      level: 'beginner',
      summary: 'Pass JSX between a component’s tags; it arrives as the children prop.',
      simple:
        'A Card component is like a picture frame. It draws the border; whatever photo you put inside is the children.',
      points: [
        'Anything between <code>&lt;Card&gt;</code> and <code>&lt;/Card&gt;</code> becomes <code>props.children</code>.',
        'Composition (nesting components) is React’s way to reuse UI. No inheritance needed.',
        'You can also pass JSX in named props, like <code>header</code> or <code>footer</code> "slots".',
        'Composition often removes the need to pass props through many layers.',
      ],
      detail: `<pre><code>function Card({ title, children }) {
  return (
    &lt;section className="card"&gt;
      &lt;h2&gt;{title}&lt;/h2&gt;
      {children}
    &lt;/section&gt;
  );
}

&lt;Card title="Profile"&gt;&lt;Avatar name="lin" /&gt;&lt;/Card&gt;</code></pre>`,
    },
    {
      title: 'Keep Components Pure',
      level: 'beginner',
      summary:
        'Rendering should only calculate JSX, with no side effects and no changing outside data.',
      simple:
        'A pure component is like a math formula: 2 + 2 is always 4. It doesn’t secretly change something else while it works.',
      points: [
        'Same props and state in, same JSX out.',
        'Don’t change variables, objects or the DOM that existed before rendering.',
        'Side effects (fetching, timers, logging) belong in event handlers or effects.',
        'StrictMode renders components twice in development to expose impure code.',
      ],
      tip: 'Local variables you create during render are fine to change. Only mutating outside things is a problem.',
    },
    {
      title: 'Conditional Rendering',
      level: 'beginner',
      summary: 'Show different UI depending on a condition, using plain JavaScript.',
      simple:
        'Like a light switch in your markup: if the user is logged in, show the profile; otherwise show the login button.',
      points: [
        'Use <code>if</code> before the <code>return</code> for big branches.',
        'Use a ternary inside JSX: <code>{isOn ? &lt;On /&gt; : &lt;Off /&gt;}</code>.',
        'Use <code>&amp;&amp;</code> to show something or nothing: <code>{error &amp;&amp; &lt;Error /&gt;}</code>.',
        'Return <code>null</code> to render nothing at all.',
      ],
      detail: `<pre><code>// Bug: renders "0" when the list is empty
{items.length &amp;&amp; &lt;List items={items} /&gt;}

// Fix: make the left side a real boolean
{items.length &gt; 0 &amp;&amp; &lt;List items={items} /&gt;}</code></pre>`,
      tip: 'The "0 on the screen" bug is a classic. Numbers render, so never put a bare number on the left of &&.',
    },
    {
      title: 'Rendering Lists',
      level: 'beginner',
      summary: 'Turn an array of data into an array of elements with map().',
      simple: 'Like a mail merge: one template, many rows of data, and you get one letter per row.',
      points: [
        'Use <code>array.map()</code> to return one element per item.',
        'Use <code>filter()</code> first if you only want some items.',
        'Every item in the list needs a <code>key</code> prop.',
      ],
      detail: `<pre><code>function TodoList({ todos }) {
  return (
    &lt;ul&gt;
      {todos.map((todo) =&gt; (
        &lt;li key={todo.id}&gt;{todo.text}&lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}</code></pre>`,
    },
    {
      title: 'Keys',
      level: 'intermediate',
      summary: 'A stable, unique id that tells React which list item is which between renders.',
      simple:
        'Keys are name tags at a party. If people swap seats, React still knows who is who, so nobody gets the wrong drink.',
      points: [
        'Use an id from your data: <code>key={todo.id}</code>.',
        'Keys only need to be unique among siblings, not across the whole app.',
        'Array index as key breaks when items are added, removed or reordered (state jumps to the wrong row).',
        'Never use <code>Math.random()</code>: a new key every render means React rebuilds every item.',
        'The key goes on the outermost element inside <code>map</code>, and the child can’t read it as a prop.',
      ],
      tip: 'Index as key is OK only for static lists that never change order.',
    },
    {
      title: 'Key to Reset State',
      level: 'intermediate',
      summary: 'Changing a component’s key makes React throw it away and create a fresh one.',
      simple:
        'A new key is a new name tag: React treats it as a different person, so all their old memory (state) is gone.',
      points: [
        'Useful to reset a form when you switch to a different item.',
        'Simpler and safer than an effect that resets state by hand.',
        'Works on any component, not only inside lists.',
      ],
      detail: `<pre><code>// Switching contacts gives a fresh, empty form
&lt;EditContact key={contact.id} contact={contact} /&gt;</code></pre>`,
    },
  ],
};
