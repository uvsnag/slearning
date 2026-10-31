import type { KmNode } from '../../types';

export const memoryPerformance: KmNode = {
  title: 'Memory & Performance',
  level: 'advanced',
  summary: 'How memory is freed, how leaks happen, and how to keep pages fast and smooth.',
  simple:
    'Your app is a kitchen. Garbage collection takes out the trash, leaks are trash nobody can throw away, and performance is keeping the cooks from bumping into each other.',
  points: [
    'Measure first (DevTools Performance and Memory tabs), then optimize.',
    'Most slowness comes from too much DOM work, big bundles or long tasks.',
    'Aim for 60 fps: about 16 ms per frame for your code and rendering.',
  ],
  children: [
    {
      title: 'Debounce & Throttle',
      level: 'intermediate',
      summary:
        'Limit how often a function runs for noisy events like typing, scrolling and resizing.',
      simple:
        'Debounce is an elevator that waits until people stop coming in, then leaves. Throttle is a bus that leaves every 10 minutes no matter what.',
      points: [
        'Debounce: run once after the events stop for X ms (search box, autosave).',
        'Throttle: run at most once every X ms (scroll position, drag).',
        'Both are classic "write it from scratch" interview tasks.',
        'For visual updates, <code>requestAnimationFrame</code> is a natural throttle.',
      ],
      detail: `<pre><code>function debounce(fn, ms) {
  let timer;
  return (...args) =&gt; {
    clearTimeout(timer);
    timer = setTimeout(() =&gt; fn(...args), ms);
  };
}
input.addEventListener("input", debounce(search, 300));</code></pre>`,
    },
    {
      title: 'Garbage Collection',
      level: 'advanced',
      summary: 'The engine frees memory of objects that can no longer be reached from your code.',
      simple:
        'Imagine balloons tied with strings to your hand. If nothing holds a balloon’s string anymore, it floats away and the space is free.',
      points: [
        'Reachability: anything reachable from roots (globals, the stack, closures) stays alive.',
        'Mark-and-sweep: mark everything reachable, free the rest. Cycles are no problem.',
        'V8 is generational: most objects die young, so the young area is cleaned often and fast.',
        'GC pauses are short, but creating tons of short-lived objects in hot loops still costs.',
      ],
    },
    {
      title: 'Memory Leaks',
      level: 'advanced',
      summary:
        'Memory that stays used because something still points to objects you no longer need.',
      points: [
        'Forgotten timers and intervals that keep closures alive.',
        'Event listeners never removed (especially on window or document).',
        'Detached DOM nodes still referenced from JS variables.',
        'Global variables and caches that only grow; use a size limit or WeakMap.',
        'Find them: DevTools heap snapshots, compare before/after an action.',
      ],
      detail: `<pre><code>// Leak: listener keeps "bigData" alive forever
const bigData = loadHuge();
window.addEventListener("resize", () =&gt; use(bigData));

// Fix: clean up when the view is destroyed
const ctrl = new AbortController();
window.addEventListener("resize", onResize, { signal: ctrl.signal });
ctrl.abort(); // removes the listener</code></pre>`,
    },
    {
      title: 'Reflow & Repaint',
      level: 'advanced',
      summary:
        'Changing the layout makes the browser recalculate positions (reflow) and redraw pixels (repaint).',
      simple:
        'Moving one book on a packed shelf can make every other book shift. Do all your moves at once instead of one at a time.',
      points: [
        'Pipeline: style → layout (reflow) → paint → composite.',
        'Layout thrashing: reading layout (<code>offsetHeight</code>) right after each write forces many reflows.',
        'Batch reads first, then writes; or update in <code>requestAnimationFrame</code>.',
        'Animate <code>transform</code> and <code>opacity</code>: they skip layout and paint.',
        'Insert many nodes at once with a <code>DocumentFragment</code> or one <code>append</code>.',
      ],
    },
    {
      title: 'Long Tasks & Workers',
      level: 'advanced',
      summary: 'Any task over 50 ms blocks the page; split it up or move it to another thread.',
      points: [
        'Long tasks hurt INP (Interaction to Next Paint), a Core Web Vital.',
        'Split work into chunks and yield: <code>await scheduler.yield()</code> (Chromium) or <code>setTimeout</code>.',
        'Move heavy CPU work (parsing, image processing) to a Web Worker.',
        'Virtualize long lists: only render the rows on screen.',
      ],
    },
    {
      title: 'Loading Performance',
      level: 'advanced',
      summary: 'Ship less JavaScript and load it smartly so the page shows up fast.',
      points: [
        'JavaScript is the most expensive byte: it must be downloaded, parsed and run.',
        'Code split by route; lazy load with dynamic <code>import()</code>.',
        'Use <code>defer</code> or <code>type="module"</code> so scripts do not block HTML parsing.',
        'Check bundle size (e.g. a bundle analyzer) and drop heavy libraries.',
        'Cache with hashed file names and long cache headers.',
      ],
      tip: 'Before rewriting code to be faster, check the bundle. Removing one heavy dependency often wins more.',
    },
  ],
};

export const security: KmNode = {
  title: 'Security',
  level: 'advanced',
  summary: 'The common ways JavaScript apps get attacked, and the habits that stop them.',
  simple:
    'Treat every piece of outside data like a package from a stranger: open it carefully, never let it run on its own.',
  points: [
    'Never trust input: URL, forms, API responses, localStorage.',
    'Most front-end attacks are some form of injection (XSS).',
    'Keep dependencies updated and few.',
  ],
  children: [
    {
      title: 'XSS',
      level: 'advanced',
      summary: 'Cross-site scripting: an attacker gets their script to run inside your page.',
      simple:
        'Someone writes "and give the thief the keys" in the guest book, and your doorman reads it out loud as an order.',
      points: [
        'Main cause: putting user text into <code>innerHTML</code>, <code>eval</code> or <code>href="javascript:..."</code>.',
        'Use <code>textContent</code> for text; frameworks escape by default.',
        'Escape hatches are dangerous: React <code>dangerouslySetInnerHTML</code>, Vue <code>v-html</code>.',
        'If you must render HTML, sanitize it with a library like DOMPurify.',
        'Stolen result: session tokens, actions as the user, fake login forms.',
      ],
      detail: `<pre><code>// Dangerous
comment.innerHTML = userInput; // "&lt;img src=x onerror=alert(1)&gt;"

// Safe
comment.textContent = userInput;</code></pre>`,
    },
    {
      title: 'CSP',
      level: 'expert',
      summary:
        'Content Security Policy: a response header that tells the browser which scripts are allowed to run.',
      points: [
        'A second line of defense: even if XSS gets in, the browser can refuse to run it.',
        'Block inline scripts and <code>eval</code>; allow scripts by nonce or hash.',
        'Start with <code>Content-Security-Policy-Report-Only</code> to see what would break.',
        'Trusted Types (Chromium) can force all <code>innerHTML</code> writes through a sanitizer.',
      ],
    },
    {
      title: 'CSRF & CORS',
      level: 'advanced',
      summary:
        'CSRF tricks a logged-in browser into sending requests; CORS controls which sites can read your API.',
      points: [
        'CSRF: another site submits a form to your API using the user’s cookies.',
        'Defenses: <code>SameSite=Lax/Strict</code> cookies, CSRF tokens, checking <code>Origin</code>.',
        'CORS is a browser rule for reading cross-origin responses; it is not a server-side security wall.',
        'Never answer <code>Access-Control-Allow-Origin: *</code> together with credentials (browsers block it).',
      ],
    },
    {
      title: 'Prototype Pollution',
      level: 'expert',
      summary:
        'An attacker sets __proto__ keys in input so that every object in the app gets a new property.',
      points: [
        'Happens in unsafe deep-merge or "set by path" code with keys like <code>__proto__</code> or <code>constructor</code>.',
        'Can bypass checks like <code>if (user.isAdmin)</code> app-wide.',
        'Block those keys, use <code>Object.create(null)</code> or <code>Map</code> for dictionaries.',
        'Keep merge/clone libraries updated; many old versions had this bug.',
      ],
    },
    {
      title: 'Supply Chain',
      level: 'advanced',
      summary: 'Your app runs code from hundreds of npm packages; any one of them can be bad.',
      points: [
        'Run <code>npm audit</code> and use Dependabot or Renovate for updates.',
        'Commit lock files; review new dependencies before adding them.',
        'Be careful with install scripts; pnpm and Bun can block them by default.',
        'Never put secrets in front-end code: anything shipped to the browser is public.',
      ],
    },
  ],
};
