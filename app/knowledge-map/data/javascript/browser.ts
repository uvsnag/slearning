import type { KmNode } from '../../types';

export const browser: KmNode = {
  title: 'DOM & Browser APIs',
  level: 'intermediate',
  summary:
    'How JavaScript reads and changes the page, reacts to events, and talks to the network and storage.',
  simple:
    'The browser hands JavaScript a remote control for the page: buttons to change text, sensors for clicks, and a phone line to the server.',
  points: [
    'The DOM is not part of JavaScript itself; the browser provides it.',
    'Frameworks (React, Vue, Angular) use these same APIs under the hood.',
    'Knowing events and fetch well makes any framework easier.',
  ],
  children: [
    {
      title: 'The DOM',
      level: 'beginner',
      summary: 'The Document Object Model: the page as a tree of objects you can read and change.',
      simple:
        'The HTML file is a blueprint; the DOM is the actual house built from it. JavaScript can move the furniture around while you live in it.',
      points: [
        'Find elements: <code>document.querySelector(".btn")</code>, <code>querySelectorAll</code>.',
        'Change content: <code>el.textContent = "Hi"</code> (safe) vs <code>innerHTML</code> (parses HTML).',
        'Change style and classes: <code>el.classList.add("active")</code>.',
        'Create and insert: <code>document.createElement</code>, <code>el.append(child)</code>.',
        'Run scripts after the page loads: <code>&lt;script defer&gt;</code> or <code>type="module"</code>.',
      ],
      detail: `<pre><code>const list = document.querySelector("#todos");
const item = document.createElement("li");
item.textContent = "Learn the DOM";
list.append(item);</code></pre>`,
    },
    {
      title: 'Events',
      level: 'beginner',
      summary:
        'Signals like click, input or submit that your code can listen to with addEventListener.',
      simple: 'Events are doorbells. You attach a listener, and it runs every time someone rings.',
      points: [
        '<code>el.addEventListener("click", handler)</code>; remove with <code>removeEventListener</code> (same function).',
        'The handler gets an <code>event</code> object: <code>event.target</code>, <code>event.key</code>…',
        '<code>event.preventDefault()</code> stops the default action (e.g. a form reload).',
        'Options: <code>{ once: true }</code>, <code>{ passive: true }</code> for smooth scrolling, <code>{ signal }</code> to remove.',
      ],
      detail: `<pre><code>form.addEventListener("submit", (e) =&gt; {
  e.preventDefault();
  const data = new FormData(form);
  save(Object.fromEntries(data));
});</code></pre>`,
    },
    {
      title: 'Bubbling & Capturing',
      level: 'intermediate',
      summary:
        'An event travels down to the target (capture), then back up through its parents (bubble).',
      simple:
        'Drop a stone in a pond: the ripple starts where it lands and spreads outward to every parent element.',
      points: [
        'Three phases: capture (window → target), target, bubble (target → window).',
        'Listeners run in the bubble phase by default; <code>{ capture: true }</code> for capture.',
        '<code>event.target</code> = where it started; <code>event.currentTarget</code> = where the listener is.',
        '<code>stopPropagation()</code> stops the trip; use it rarely, it breaks other listeners.',
        'A few events (like focus) do not bubble; use focusin/focusout instead.',
      ],
    },
    {
      title: 'Event Delegation',
      level: 'intermediate',
      summary:
        'Put one listener on a parent and handle events for all its children, even future ones.',
      simple:
        'Instead of giving every student a phone, you put one phone in the classroom and ask who is calling.',
      points: [
        'Works because events bubble up to the parent.',
        'Use <code>event.target.closest("selector")</code> to find the clicked item.',
        'Fewer listeners = less memory; new items work automatically.',
        'Classic interview question for long or dynamic lists.',
      ],
      detail: `<pre><code>list.addEventListener("click", (e) =&gt; {
  const btn = e.target.closest("button.delete");
  if (!btn) return;
  removeTodo(btn.dataset.id);
});</code></pre>`,
    },
    {
      title: 'fetch',
      level: 'intermediate',
      summary: 'The built-in function for HTTP requests; returns a promise of a Response.',
      simple:
        'fetch is your messenger to the server: you send a letter and get a promise of a reply.',
      points: [
        'fetch only rejects on network failure; HTTP 404/500 still resolve. Check <code>res.ok</code>.',
        'Read the body once: <code>res.json()</code>, <code>res.text()</code>, <code>res.blob()</code>.',
        'Send JSON with <code>method</code>, <code>headers</code> and <code>JSON.stringify(body)</code>.',
        'Cross-origin calls need the server to allow it (CORS).',
        'Built into Node.js since v18.',
      ],
      detail: `<pre><code>const res = await fetch("/api/todos", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Learn fetch" }),
});
if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
const todo = await res.json();</code></pre>`,
      tip: 'Forgetting to check res.ok is the #1 fetch bug: your code happily parses an error page.',
    },
    {
      title: 'Storage',
      level: 'intermediate',
      summary: 'Keep data in the browser: localStorage, sessionStorage, cookies and IndexedDB.',
      points: [
        '<code>localStorage</code>: strings only, ~5 MB, survives restarts, synchronous (blocks the thread).',
        '<code>sessionStorage</code>: same API, cleared when the tab closes.',
        'Cookies: small, sent to the server with every request; use <code>HttpOnly</code> for session ids.',
        'IndexedDB: large, structured, async storage for real offline data.',
        'Never store tokens or secrets in localStorage: any XSS can read them.',
      ],
      detail: `<pre><code>localStorage.setItem("theme", JSON.stringify({ dark: true }));
const theme = JSON.parse(localStorage.getItem("theme") ?? "{}");</code></pre>`,
    },
    {
      title: 'Timers & Animation',
      level: 'intermediate',
      summary: 'setTimeout, setInterval and requestAnimationFrame schedule code for later.',
      points: [
        '<code>setTimeout(fn, ms)</code> runs once after at least ms; <code>clearTimeout(id)</code> cancels.',
        '<code>setInterval</code> repeats; always clear it when done, or it leaks.',
        'Timers are not exact: a busy thread delays them.',
        '<code>requestAnimationFrame(fn)</code> runs just before the next paint; use it for smooth animations.',
        'Background tabs slow timers down to save battery.',
      ],
    },
    {
      title: 'Observers & Workers',
      level: 'advanced',
      summary:
        'Modern APIs to watch the page efficiently and to run heavy code off the main thread.',
      points: [
        '<code>IntersectionObserver</code>: know when an element scrolls into view (lazy loading, infinite lists).',
        '<code>ResizeObserver</code> / <code>MutationObserver</code>: react to size or DOM changes.',
        'Web Workers run JS on another thread; talk with <code>postMessage</code>; no DOM access.',
        'Service Workers sit between the page and the network: offline caching, push messages.',
      ],
    },
  ],
};
