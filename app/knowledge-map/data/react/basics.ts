import type { KmNode } from '../../types';

export const basics: KmNode = {
  title: 'React Basics',
  level: 'beginner',
  summary: 'What React is, why it works the way it does, and how JSX describes your UI.',
  simple:
    'This is your starter kit. Once you get "UI is a function of state" and can read JSX, the rest of React is just building on that idea.',
  points: [
    'React is a JavaScript library for building user interfaces out of components.',
    'You describe what the screen should look like; React updates the real page for you.',
    'Learn JSX, components and state first. Everything else builds on them.',
  ],
  children: [
    {
      title: 'What is React?',
      level: 'beginner',
      summary:
        'A JavaScript library for building UIs from small, reusable pieces called components.',
      simple:
        'Think of LEGO. Each brick is a component (a button, a card, a menu). You snap bricks together to build a whole page, and you can reuse the same brick anywhere.',
      points: [
        'Made by Meta, open source since 2013. Current major version: React 19.',
        'A library, not a full framework: routing and data loading come from other tools or a framework.',
        '<code>react</code> holds the core; <code>react-dom</code> draws it in the browser.',
        'React Native uses the same ideas to build mobile apps.',
      ],
      tip: 'In an interview: "React is a declarative, component-based library for building UIs. It re-renders components when state changes and updates the DOM efficiently."',
    },
    {
      title: 'UI = f(state)',
      level: 'beginner',
      summary: 'Your UI is the result of a function that takes the current data (state) as input.',
      simple:
        'Like a weather screen: you give it today’s data and it shows sun or rain. You never paint the sun by hand; you change the data and the screen follows.',
      points: [
        'State = data that can change over time (a counter, a list of todos, the logged-in user).',
        'When state changes, React calls your component again to get the new UI.',
        'Same state in, same UI out. That makes the screen predictable and easy to test.',
        'Data flows one way: from parent to child, top to bottom.',
      ],
    },
    {
      title: 'Declarative vs Imperative',
      level: 'beginner',
      summary: 'You describe what the UI should be, not the step-by-step DOM changes to get there.',
      simple:
        'Imperative is giving a taxi driver every turn. Declarative is just telling them the address. React is the driver who figures out the turns.',
      points: [
        'Imperative (plain DOM): find the element, change its text, add a class, remove a node…',
        'Declarative (React): return the markup for the current state; React works out the changes.',
        'Fewer manual DOM updates means fewer "forgot to update that label" bugs.',
      ],
      detail: `<pre><code>// Imperative
button.addEventListener('click', () =&gt; {
  count++;
  label.textContent = 'Clicked ' + count;
});

// Declarative (React)
&lt;button onClick={() =&gt; setCount(count + 1)}&gt;
  Clicked {count}
&lt;/button&gt;</code></pre>`,
    },
    {
      title: 'Component Model',
      level: 'beginner',
      summary:
        'A component is a function that returns a piece of UI; apps are trees of components.',
      simple:
        'A page is like a family tree: App is the grandparent, Header and Main are its children, and each of those has its own kids.',
      points: [
        'Each component owns its own markup, logic and (optionally) state.',
        'Parents pass data down to children with props.',
        'Split a component when it does more than one job or gets hard to read.',
        'Component names must start with a capital letter: <code>&lt;TodoList /&gt;</code>.',
      ],
    },
    {
      title: 'JSX',
      level: 'beginner',
      summary: 'A syntax that lets you write HTML-like markup inside JavaScript.',
      simple:
        'JSX is a shorthand. You write something that looks like HTML, and a build tool turns it into plain JavaScript function calls that create UI objects.',
      points: [
        'JSX is not HTML and not a string; it compiles to <code>jsx()</code> calls (older: <code>React.createElement</code>).',
        'The result is a React element: a small plain object that describes what to show.',
        'Browsers can’t read JSX directly; Vite, Babel or SWC compile it.',
      ],
      detail: `<pre><code>const el = &lt;h1 className="title"&gt;Hello&lt;/h1&gt;;

// roughly compiles to
const el = jsx('h1', { className: 'title', children: 'Hello' });</code></pre>`,
      children: [
        {
          title: 'JSX Rules',
          level: 'beginner',
          summary: 'A few small differences from HTML that trip up everyone at first.',
          simple:
            'JSX is strict like XML and uses JavaScript names. Close every tag and use camelCase for attributes.',
          points: [
            'Return one root element; wrap siblings in a Fragment <code>&lt;&gt;…&lt;/&gt;</code>.',
            'Close every tag, even empty ones: <code>&lt;img /&gt;</code>, <code>&lt;br /&gt;</code>.',
            '<code>className</code> instead of <code>class</code>, <code>htmlFor</code> instead of <code>for</code>.',
            'Attributes are camelCase: <code>onClick</code>, <code>tabIndex</code>; but <code>aria-*</code> and <code>data-*</code> keep dashes.',
            '<code>style</code> takes an object: <code>style={{ marginTop: 8 }}</code>.',
          ],
        },
        {
          title: 'Expressions in JSX',
          level: 'beginner',
          summary: 'Curly braces let you drop any JavaScript expression into the markup.',
          simple:
            'Curly braces are a window back into JavaScript. Inside them you can put a variable, a calculation or a function call.',
          points: [
            'Text: <code>&lt;p&gt;Hi {user.name}&lt;/p&gt;</code>.',
            'Attributes: <code>&lt;img src={user.avatarUrl} /&gt;</code>.',
            'Only expressions work, not statements: no <code>if</code> or <code>for</code> inside braces.',
            '<code>null</code>, <code>undefined</code>, <code>true</code> and <code>false</code> render nothing.',
          ],
          tip: 'Rendering an object like {user} throws "Objects are not valid as a React child". Render a field instead.',
        },
      ],
    },
    {
      title: 'createRoot & Rendering',
      level: 'beginner',
      summary: 'createRoot connects React to one DOM element and renders your app inside it.',
      simple:
        'Your HTML page has one empty box (usually a div with id "root"). createRoot hands that box to React, and React fills it with your app.',
      points: [
        '<code>createRoot</code> comes from <code>react-dom/client</code> (React 18+).',
        'The old <code>ReactDOM.render</code> was removed in React 19.',
        'Wrap the app in <code>&lt;StrictMode&gt;</code> in development to catch bugs early.',
      ],
      detail: `<pre><code>import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  &lt;StrictMode&gt;
    &lt;App /&gt;
  &lt;/StrictMode&gt;
);</code></pre>`,
    },
    {
      title: 'Project Setup',
      level: 'beginner',
      summary:
        'Start a new app with a framework like Next.js, or with Vite for a plain client app.',
      simple:
        'Like buying a kitchen that already has the oven and fridge installed. The tool sets up compiling, a dev server and builds so you can just cook.',
      points: [
        'The React docs recommend a framework (Next.js, React Router) for full apps.',
        'Vite is the usual choice for a client-only app or learning: fast dev server and build.',
        'Create React App was deprecated in 2025; don’t start new projects with it.',
        'Files are usually <code>.jsx</code> (or <code>.tsx</code> with TypeScript).',
      ],
      tip: 'To learn React itself, a Vite app is the simplest playground: npm create vite@latest and pick React.',
    },
  ],
};
