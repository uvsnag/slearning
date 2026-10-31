import type { KmNode } from '../../types';

export const quality: KmNode = {
  title: 'Errors, Testing & Interviews',
  level: 'advanced',
  summary:
    'Catch crashes with error boundaries, test like a user, build accessible UI, and avoid classic mistakes.',
  simple:
    'This is the "ship it with confidence" branch: handle failures gracefully, prove it works with tests, make sure everyone can use it.',
  points: [
    'Error boundaries stop one broken widget from blanking the whole page.',
    'Test behavior the user sees, not internal details.',
    'Accessibility and the common pitfalls come up in almost every React interview.',
  ],
  children: [
    {
      title: 'Error Boundaries',
      level: 'advanced',
      summary: 'Components that catch rendering errors in their children and show a fallback UI.',
      points: [
        'Still written as class components (<code>getDerivedStateFromError</code>, <code>componentDidCatch</code>).',
        'Most people use the <code>react-error-boundary</code> package instead of writing one.',
        'They do NOT catch errors in event handlers, async code or setTimeout; use try/catch there.',
        'Place them around independent sections (sidebar, widget, route) not just the root.',
        'React 19 adds <code>onCaughtError</code>/<code>onUncaughtError</code> root options for logging.',
      ],
      detail: `<pre><code>import { ErrorBoundary } from 'react-error-boundary';

&lt;ErrorBoundary fallback={&lt;p&gt;Something went wrong.&lt;/p&gt;}&gt;
  &lt;Comments /&gt;
&lt;/ErrorBoundary&gt;</code></pre>`,
    },
    {
      title: 'React Testing Library',
      level: 'intermediate',
      summary:
        'Tests components the way a user uses them: find by role or text, click, type, check the result.',
      simple:
        'Pretend you’re the user with a mouse and keyboard. You don’t care what the state variable is called; you care that the right message appears.',
      points: [
        'Prefer <code>getByRole</code> (with a name), then <code>getByLabelText</code>, then <code>getByText</code>.',
        'Use <code>@testing-library/user-event</code> for realistic clicks and typing.',
        '<code>findBy…</code> waits for async UI; <code>queryBy…</code> checks something is absent.',
        'Avoid testing internals (state, hook calls); Enzyme-style shallow tests are outdated.',
      ],
      detail: `<pre><code>test('increments the counter', async () =&gt; {
  render(&lt;Counter /&gt;);
  await userEvent.click(screen.getByRole('button', { name: /clicked/i }));
  expect(screen.getByRole('button')).toHaveTextContent('Clicked 1 times');
});</code></pre>`,
    },
    {
      title: 'Vitest & Jest',
      level: 'intermediate',
      summary:
        'Test runners that find your tests, run them in a fake browser (jsdom) and report results.',
      simple: 'The runner is the referee: it runs every test and tells you who passed.',
      points: [
        'Vitest: fast, shares Vite config, Jest-like API. The default pick for Vite apps.',
        'Jest: long-time standard, still common in older and Next.js projects.',
        'Mock network calls with MSW (Mock Service Worker) rather than mocking fetch by hand.',
        'Use Playwright or Cypress for end-to-end tests in a real browser.',
      ],
    },
    {
      title: 'Accessibility',
      level: 'intermediate',
      summary: 'Build UI everyone can use, including keyboard and screen reader users.',
      simple:
        'Like adding ramps next to stairs. A little care in your markup lets far more people use your app.',
      points: [
        'Use real elements: <code>&lt;button&gt;</code> for actions, <code>&lt;a&gt;</code> for links, not clickable <code>&lt;div&gt;</code>s.',
        'Every input needs a label (<code>htmlFor</code> + <code>useId</code>); images need <code>alt</code>.',
        'Manage focus after route changes and when opening/closing modals.',
        'Use ARIA only when no native element fits; <code>eslint-plugin-jsx-a11y</code> catches basics.',
        'Headless libraries (Radix, React Aria) give accessible menus, dialogs and tabs.',
      ],
      tip: 'Testing with getByRole doubles as an accessibility check: if you can’t find it by role, a screen reader can’t either.',
    },
    {
      title: 'Common Pitfalls',
      level: 'intermediate',
      summary: 'The mistakes almost every React developer makes at least once.',
      simple: 'A checklist of potholes. Knowing where they are is half the job of avoiding them.',
      points: [
        'Mutating state (<code>items.push(x); setItems(items)</code>): React sees the same array and skips the update.',
        'Stale closures: a timer or effect still sees old state; fix deps or use an updater.',
        'Infinite loops: setting state during render, or an effect that updates its own dependency.',
        'Missing or index keys, causing input values to jump between rows.',
        'Copying props into state, then wondering why it doesn’t update.',
        'Effects for things that should be computed during render.',
      ],
    },
    {
      title: 'Interview Topics',
      level: 'advanced',
      summary: 'The questions that show up again and again, with the short answer to give.',
      points: [
        'Virtual DOM &amp; reconciliation: describe UI as objects, diff by type and key, apply minimal DOM changes.',
        'Why keys matter and why index keys are risky.',
        'State vs props vs refs; controlled vs uncontrolled inputs.',
        'useEffect deps and cleanup; when you don’t need an effect.',
        'memo/useMemo/useCallback: what they skip, when they help, and React Compiler.',
        'SSR vs Server Components; what <code>"use client"</code> really means.',
      ],
      tip: 'Answer with a one-line definition, a tiny example, and one trade-off. That shows real understanding, not memorized words.',
    },
  ],
};
