import type { KmNode } from '../../types';

export const stateEvents: KmNode = {
  title: 'State, Events & Forms',
  level: 'beginner',
  summary: 'Give components memory with useState, react to clicks and typing, and handle forms.',
  simple:
    'Props are what a component is told; state is what it remembers. Events are how the user pokes it to change that memory.',
  points: [
    'useState stores a value that survives between renders.',
    'Setting state tells React to render the component again.',
    'Never change state directly; always make a new value.',
  ],
  children: [
    {
      title: 'useState',
      level: 'beginner',
      summary: 'A hook that gives a component a value to remember and a function to update it.',
      simple:
        'It’s a sticky note on the component. You can read the note, and when you write a new value, React redraws the component with it.',
      points: [
        'Returns a pair: <code>const [count, setCount] = useState(0);</code>.',
        'Each component instance has its own state; two counters don’t share.',
        'A normal variable won’t work: it resets every render and doesn’t trigger one.',
        'For an expensive start value pass a function: <code>useState(() =&gt; loadDraft())</code>.',
      ],
      detail: `<pre><code>import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    &lt;button onClick={() =&gt; setCount(count + 1)}&gt;
      Clicked {count} times
    &lt;/button&gt;
  );
}</code></pre>`,
    },
    {
      title: 'State as a Snapshot',
      level: 'intermediate',
      summary:
        'Inside one render, state is a fixed value; setting it only affects the next render.',
      simple:
        'Each render is a photo. Calling setCount doesn’t change the photo you’re holding; it asks React to take a new one.',
      points: [
        'After <code>setCount(count + 1)</code>, <code>count</code> still has the old value in that handler.',
        'React batches updates and re-renders after your event handler finishes.',
        'Timeouts and callbacks see the state from the render they were created in.',
      ],
      detail: `<pre><code>function handleClick() {
  setCount(count + 1);
  console.log(count); // still the OLD value
}</code></pre>`,
      tip: 'If you need the new value right away, compute it into a variable first, then set state and use the variable.',
    },
    {
      title: 'Updater Function',
      level: 'intermediate',
      summary: 'Pass a function to the setter when the new state depends on the previous one.',
      simple:
        'Instead of saying "set it to 5", you say "add one to whatever it is". React applies each instruction in order.',
      points: [
        '<code>setCount((c) =&gt; c + 1)</code> always uses the latest value.',
        'Three <code>setCount(count + 1)</code> calls in a row add only 1; three updater calls add 3.',
        'Updaters must be pure: just return the next value.',
      ],
      detail: `<pre><code>setCount(count + 1);
setCount(count + 1); // count goes up by 1

setCount((c) =&gt; c + 1);
setCount((c) =&gt; c + 1); // count goes up by 2</code></pre>`,
    },
    {
      title: 'Updating Objects & Arrays',
      level: 'intermediate',
      summary:
        'Treat state as read-only: create a new object or array instead of changing the old one.',
      simple:
        'Don’t scribble on the old drawing. Make a copy with your change. React compares old vs new by reference, so an edited original looks "unchanged".',
      points: [
        'Objects: spread and override: <code>{ ...user, name: "Ana" }</code>.',
        'Add to an array: <code>[...items, newItem]</code>.',
        'Remove: <code>items.filter((i) =&gt; i.id !== id)</code>.',
        'Change one: <code>items.map((i) =&gt; i.id === id ? { ...i, done: true } : i)</code>.',
        'Avoid <code>push</code>, <code>splice</code>, <code>sort()</code> in place; use <code>toSorted()</code> or copy first.',
      ],
      tip: 'For deeply nested state, flatten it or use Immer (built into Redux Toolkit) to write "mutating" code safely.',
    },
    {
      title: 'Event Handlers',
      level: 'beginner',
      summary: 'Functions you pass to props like onClick or onChange to respond to the user.',
      simple:
        'An event handler is a doorbell wire: you connect a function, and it rings when the user clicks or types.',
      points: [
        'Pass the function, don’t call it: <code>onClick={handleClick}</code>, not <code>onClick={handleClick()}</code>.',
        'Need arguments? Wrap it: <code>onClick={() =&gt; remove(id)}</code>.',
        'Handlers get an event object; <code>e.preventDefault()</code> stops default browser actions.',
        'Events bubble up to parents; <code>e.stopPropagation()</code> stops that.',
        'Name custom handler props <code>onSomething</code>, e.g. <code>onSelect</code>.',
      ],
      tip: 'Event handlers are the best place for side effects like saving or sending data, not effects.',
    },
    {
      title: 'Controlled Inputs',
      level: 'intermediate',
      summary: 'The input’s value lives in React state, and every keystroke updates that state.',
      simple:
        'React holds the pen. The input only shows what state says, and each keystroke asks React to update the text.',
      points: [
        'Set <code>value</code> and <code>onChange</code> together.',
        'Easy to validate, format or disable buttons while the user types.',
        'For checkboxes use <code>checked</code> instead of <code>value</code>.',
        'Setting <code>value</code> without <code>onChange</code> makes a read-only input (React warns).',
      ],
      detail: `<pre><code>function NameForm() {
  const [name, setName] = useState('');
  return (
    &lt;input value={name} onChange={(e) =&gt; setName(e.target.value)} /&gt;
  );
}</code></pre>`,
    },
    {
      title: 'Uncontrolled Inputs',
      level: 'intermediate',
      summary:
        'The browser keeps the input’s value; you read it when needed (on submit or via a ref).',
      simple:
        'You let the input hold its own pen and just look at what was written when the form is sent.',
      points: [
        'Use <code>defaultValue</code> (or <code>defaultChecked</code>) for the start value.',
        'Read values on submit with <code>new FormData(e.target)</code> or a ref.',
        'Less code and fewer re-renders, but harder to react to each keystroke.',
        'React 19 form Actions work nicely with uncontrolled inputs.',
        'File inputs are always uncontrolled.',
      ],
      detail: `<pre><code>function handleSubmit(e) {
  e.preventDefault();
  const data = new FormData(e.target);
  save(data.get('email'));
}

&lt;form onSubmit={handleSubmit}&gt;
  &lt;input name="email" defaultValue="" /&gt;
&lt;/form&gt;</code></pre>`,
      tip: 'Don’t switch an input between controlled and uncontrolled. A value that starts as undefined then becomes a string causes a warning.',
    },
    {
      title: 'Form Libraries',
      level: 'intermediate',
      summary: 'Libraries like React Hook Form handle validation, errors and big forms for you.',
      simple:
        'For a two-field form, plain state is fine. For a 30-field form with rules, a library is like hiring an assistant to check every box.',
      points: [
        'React Hook Form: uncontrolled under the hood, so few re-renders.',
        'Pair it with a schema validator such as Zod for clear rules.',
        'Small forms: plain state or React 19 Actions are usually enough.',
      ],
    },
  ],
};
