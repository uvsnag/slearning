import type { KmNode } from '../../types';

export const errors: KmNode = {
  title: 'Error Handling',
  level: 'intermediate',
  summary: 'Throwing, catching and designing errors so your app fails clearly instead of silently.',
  simple:
    'Errors are smoke alarms. You want them loud, close to the fire, and you want someone listening who knows what to do.',
  points: [
    'Throw Error objects, never plain strings.',
    'Catch only where you can do something useful.',
    'Async errors need extra care (see Async JavaScript).',
  ],
  children: [
    {
      title: 'try / catch / finally',
      level: 'beginner',
      summary: 'Run code that may fail, handle the failure, and always run clean-up code.',
      simple:
        'try is walking on ice, catch is the friend who catches you when you slip, finally is taking off your skates whatever happened.',
      points: [
        '<code>throw</code> stops the current function and jumps to the nearest <code>catch</code>.',
        '<code>finally</code> runs whether it succeeded, failed or returned.',
        'Optional catch binding (ES2019): <code>catch { ... }</code> when you do not need the error.',
        'try/catch only catches errors from synchronous code or awaited promises.',
      ],
      detail: `<pre><code>try {
  const data = JSON.parse(text);
  render(data);
} catch (err) {
  showMessage("Bad data: " + err.message);
} finally {
  hideSpinner();
}</code></pre>`,
    },
    {
      title: 'Error Types',
      level: 'intermediate',
      summary: 'Built-in errors tell you what kind of thing went wrong.',
      points: [
        '<code>TypeError</code>: wrong type, e.g. calling <code>undefined()</code> or reading a property of null.',
        '<code>ReferenceError</code>: using a variable that does not exist (or is in the TDZ).',
        '<code>SyntaxError</code>: code or JSON that cannot be parsed.',
        '<code>RangeError</code>: value out of range, e.g. too-deep recursion.',
        'Every error has <code>name</code>, <code>message</code> and usually <code>stack</code>.',
      ],
    },
    {
      title: 'Custom Errors & cause',
      level: 'intermediate',
      summary: 'Extend Error to make your own error types, and wrap low-level errors with cause.',
      points: [
        'Custom classes let callers check <code>err instanceof NotFoundError</code>.',
        'Set <code>this.name</code> so logs show the right type.',
        '<code>new Error("msg", { cause: err })</code> (ES2022) keeps the original error attached.',
        'Add useful data (id, status code) as fields on the error.',
      ],
      detail: `<pre><code>class NotFoundError extends Error {
  constructor(id, options) {
    super(\`Item \${id} not found\`, options);
    this.name = "NotFoundError";
  }
}
try { await load(id); }
catch (e) { throw new NotFoundError(id, { cause: e }); }</code></pre>`,
    },
    {
      title: 'Error Strategy',
      level: 'advanced',
      summary: 'Where to catch, what to log and what to show the user.',
      points: [
        'Never swallow errors with an empty catch; at least log them.',
        'Catch at boundaries: request handler, UI error boundary, job runner.',
        'Global safety nets: <code>window.onerror</code>, <code>unhandledrejection</code>, Node <code>process.on("uncaughtException")</code>.',
        'After an uncaught exception in Node, log and restart the process; its state may be broken.',
        'Show users a friendly message; send details to logging/monitoring (e.g. Sentry).',
      ],
      tip: 'Expected problems (bad input, not found) are normal results. Exceptions are for things that should not happen.',
    },
  ],
};
