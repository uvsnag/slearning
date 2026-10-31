import type { KmNode } from '../../types';

export const objectsArrays: KmNode = {
  title: 'Objects & Arrays',
  level: 'beginner',
  summary:
    'The two data structures you use all day: objects (key → value) and arrays (ordered lists).',
  simple:
    'An object is a labeled drawer cabinet: each drawer has a name. An array is a numbered row of boxes.',
  points: [
    'Almost all data in JS lives in objects and arrays (JSON too).',
    'Destructuring and spread make copying and unpacking short.',
    'Learn map, filter and reduce well; you will use them every day.',
  ],
  children: [
    {
      title: 'Object Basics',
      level: 'beginner',
      summary: 'Create objects with { }, read and write properties with a dot or [brackets].',
      simple:
        'Think of a contact card: name, phone, email. Each field is a property you can read or change.',
      points: [
        'Dot for fixed names: <code>user.name</code>; brackets for dynamic keys: <code>user[key]</code>.',
        'Shorthand: <code>{ name, age }</code> equals <code>{ name: name, age: age }</code>.',
        'Computed keys: <code>{ [field]: value }</code>.',
        'Loop with <code>Object.keys</code>, <code>Object.values</code>, <code>Object.entries</code>.',
        'Check a key with <code>Object.hasOwn(obj, "k")</code> or <code>"k" in obj</code> (includes inherited).',
      ],
      detail: `<pre><code>const field = "email";
const user = { name: "An", [field]: "an@mail.com", greet() { return "hi"; } };
delete user.email;
Object.entries(user); // [["name", "An"], ["greet", f]]</code></pre>`,
    },
    {
      title: 'Array Basics',
      level: 'beginner',
      summary: 'Ordered lists that can grow and shrink and hold any kind of value.',
      simple:
        'A train of carriages numbered from 0. You can add carriages at the end or the front.',
      points: [
        'Index starts at 0; <code>arr.at(-1)</code> gets the last item (ES2022).',
        'Add/remove at end: <code>push</code>/<code>pop</code>; at start: <code>unshift</code>/<code>shift</code>.',
        '<code>slice</code> copies a part; <code>splice</code> changes the array in place.',
        '<code>includes</code>, <code>indexOf</code>, <code>find</code>, <code>findIndex</code>, <code>some</code>, <code>every</code> search.',
      ],
    },
    {
      title: 'Destructuring',
      level: 'beginner',
      summary: 'Unpack values from arrays or properties from objects into variables in one line.',
      simple:
        'Like unpacking a grocery bag straight into the right shelves instead of taking items out one by one.',
      points: [
        'Object: <code>const { name, age = 18 } = user;</code> (with a default).',
        'Rename: <code>const { name: userName } = user;</code>.',
        'Array: <code>const [first, , third] = list;</code> (skip with a comma).',
        'Swap: <code>[a, b] = [b, a];</code>.',
        'Destructuring <code>undefined</code> or <code>null</code> throws a TypeError.',
      ],
      detail: `<pre><code>const { id, profile: { city } = {} } = user;
const [head, ...tail] = [1, 2, 3]; // head 1, tail [2, 3]</code></pre>`,
    },
    {
      title: 'Spread & Rest',
      level: 'beginner',
      summary: 'The ... syntax: spread expands items out, rest collects leftover items in.',
      simple:
        'Spread pours a bag of marbles onto the table. Rest sweeps the remaining marbles back into a bag.',
      points: [
        'Copy and merge arrays: <code>[...a, ...b]</code>.',
        'Copy and merge objects: <code>{ ...defaults, ...options }</code> (later keys win).',
        'Rest in destructuring: <code>const { password, ...safe } = user;</code>.',
        'Spread makes a shallow copy: nested objects are still shared.',
      ],
      detail: `<pre><code>const updated = { ...user, name: "New name" };  // copy + change
Math.max(...[3, 9, 1]);                         // 9</code></pre>`,
    },
    {
      title: 'map, filter, reduce',
      level: 'intermediate',
      summary:
        'The core array methods: transform each item, keep some items, or combine all into one value.',
      simple:
        'A kitchen line: map peels every potato, filter throws out the bad ones, reduce mashes them all into one bowl.',
      points: [
        '<code>map</code> returns a new array of the same length.',
        '<code>filter</code> returns a new array with the items that pass a test.',
        '<code>reduce</code> builds one result (sum, object, map); always give a start value.',
        '<code>forEach</code> is for side effects only; it returns <code>undefined</code> and cannot break.',
        '<code>flatMap</code> maps and flattens one level.',
      ],
      detail: `<pre><code>const total = orders
  .filter((o) =&gt; o.paid)
  .map((o) =&gt; o.amount)
  .reduce((sum, x) =&gt; sum + x, 0);</code></pre>`,
      tip: 'If you only need one result, find/some/every stop early and are faster than filter.',
    },
    {
      title: 'Sorting Gotchas',
      level: 'intermediate',
      summary:
        'sort() changes the array in place and compares as strings unless you pass a function.',
      points: [
        '<code>[10, 9, 1].sort()</code> gives <code>[1, 10, 9]</code> (string order).',
        'Numbers: <code>arr.sort((a, b) =&gt; a - b)</code>.',
        'Text: <code>arr.sort((a, b) =&gt; a.localeCompare(b))</code>.',
        'Sort is stable since ES2019: equal items keep their order.',
        'Use <code>toSorted()</code> (ES2023) to get a sorted copy without changing the original.',
      ],
    },
    {
      title: 'Copying: Shallow vs Deep',
      level: 'intermediate',
      summary: 'Spread and Object.assign copy one level; structuredClone copies everything.',
      simple:
        'A shallow copy is photocopying the table of contents: the chapters are still the original ones. A deep copy photocopies the whole book.',
      points: [
        'Shallow: <code>{ ...obj }</code>, <code>[...arr]</code>, <code>Object.assign({}, obj)</code>.',
        'Deep: <code>structuredClone(obj)</code> (browsers and Node 17+).',
        '<code>JSON.parse(JSON.stringify(x))</code> loses dates, undefined, Maps and functions.',
        'structuredClone cannot copy functions or DOM nodes.',
      ],
      detail: `<pre><code>const a = { tags: ["x"] };
const b = { ...a };
b.tags.push("y");          // a.tags is now ["x", "y"] too!
const c = structuredClone(a); // fully separate</code></pre>`,
    },
    {
      title: 'JSON',
      level: 'beginner',
      summary: 'A text format for data that looks like JS objects; used by almost every web API.',
      simple:
        'JSON is a parcel format: you pack an object into text to send it, and unpack it on arrival.',
      points: [
        '<code>JSON.stringify(obj)</code> → text; <code>JSON.parse(text)</code> → object.',
        'Keys must use double quotes; no comments, functions or undefined.',
        'Dates become strings and do not come back as Date objects.',
        '<code>JSON.parse</code> throws on bad input: wrap it in try/catch.',
        'Pretty print: <code>JSON.stringify(obj, null, 2)</code>.',
      ],
    },
  ],
};
