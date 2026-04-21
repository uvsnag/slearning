// Interview data: html, css
// Auto-generated from pv.html
(function () {
  (window.__pvTopics = window.__pvTopics || []).push(
  {
          id: 'html',
          name: 'HTML',
          icon: '📄',
          questions: [
            {
              q: 'What is the difference between HTML, XHTML, and HTML5?',
              difficulty: 'easy',
              a: `<ul>
<li><strong>HTML</strong>: original markup language. Forgiving syntax (optional closing tags).</li>
<li><strong>XHTML</strong>: stricter XML-based version. Must close all tags, lowercase only, attributes must be quoted.</li>
<li><strong>HTML5</strong>: current standard. New semantic tags, APIs (Canvas, Geolocation, WebSocket, Web Storage), simplified doctype.</li>
</ul>
<pre>&lt;!DOCTYPE html&gt;  &lt;!-- HTML5 doctype (simple!) --&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
    &lt;title&gt;My Page&lt;/title&gt;
&lt;/head&gt;</pre>`,
            },
            {
              q: 'What are semantic HTML elements? Why use them?',
              difficulty: 'medium',
              a: `<p>Semantic elements clearly describe their meaning to both browser and developer.</p>
<pre>&lt;!-- Non-semantic --&gt;
&lt;div id="header"&gt;&lt;/div&gt;
&lt;div class="nav"&gt;&lt;/div&gt;
&lt;div id="main"&gt;&lt;/div&gt;

&lt;!-- Semantic --&gt;
&lt;header&gt;&lt;/header&gt;
&lt;nav&gt;&lt;/nav&gt;
&lt;main&gt;
  &lt;article&gt;
    &lt;section&gt;&lt;/section&gt;
  &lt;/article&gt;
  &lt;aside&gt;&lt;/aside&gt;
&lt;/main&gt;
&lt;footer&gt;&lt;/footer&gt;</pre>
<p><strong>Benefits</strong>:</p>
<ul>
<li><strong>Accessibility</strong>: screen readers understand page structure.</li>
<li><strong>SEO</strong>: search engines rank content better.</li>
<li><strong>Maintainability</strong>: code is self-documenting.</li>
</ul>`,
            },
            {
              q: 'Explain the difference between block-level and inline elements.',
              difficulty: 'easy',
              a: `<ul>
<li><strong>Block elements</strong>: take full width, start on new line. <code>&lt;div&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;h1&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;ul&gt;</code>.</li>
<li><strong>Inline elements</strong>: take only needed width, stay in line. <code>&lt;span&gt;</code>, <code>&lt;a&gt;</code>, <code>&lt;strong&gt;</code>, <code>&lt;img&gt;</code>, <code>&lt;input&gt;</code>.</li>
<li><strong>Inline-block</strong>: inline flow but can have width/height. <code>&lt;button&gt;</code>, or via <code>display: inline-block;</code>.</li>
</ul>
<pre>&lt;p&gt;This is &lt;strong&gt;inline&lt;/strong&gt; inside a &lt;em&gt;block&lt;/em&gt; element.&lt;/p&gt;
&lt;!-- &lt;p&gt; = block, &lt;strong&gt; and &lt;em&gt; = inline --&gt;</pre>
<div class="key-point">You can change display behavior with CSS: <code>display: block;</code>, <code>display: inline;</code>, <code>display: inline-block;</code>.</div>`,
            },
            {
              q: 'What is the DOM? How does the browser render a page?',
              difficulty: 'hard',
              a: `<p>The <strong>DOM (Document Object Model)</strong> is a tree representation of the HTML document that JavaScript can manipulate.</p>
<p><strong>Browser rendering pipeline (Critical Rendering Path)</strong>:</p>
<ol>
<li><strong>Parse HTML</strong> → build <strong>DOM tree</strong>.</li>
<li><strong>Parse CSS</strong> → build <strong>CSSOM tree</strong>.</li>
<li><strong>Combine</strong> DOM + CSSOM → <strong>Render tree</strong> (only visible elements).</li>
<li><strong>Layout</strong> (reflow): calculate position and size of each element.</li>
<li><strong>Paint</strong>: fill pixels (colors, borders, shadows, text).</li>
<li><strong>Composite</strong>: combine layers (GPU acceleration).</li>
</ol>
<div class="key-point">Changing layout-triggering properties (width, top, display) causes reflow → expensive. Prefer transform/opacity for animations (composite-only).</div>`,
            },
            {
              q: 'What are data attributes in HTML? How to use them?',
              difficulty: 'medium',
              a: `<p>Custom attributes prefixed with <code>data-</code> store extra information on HTML elements.</p>
<pre>&lt;button data-user-id="42" data-action="delete"&gt;Delete User&lt;/button&gt;

&lt;script&gt;
const btn = document.querySelector('button');
// Access via dataset
btn.dataset.userId;   // "42" (camelCase!)
btn.dataset.action;   // "delete"
// Access via getAttribute
btn.getAttribute('data-user-id'); // "42"
&lt;/script&gt;</pre>
<div class="key-point">Note: <code>data-user-id</code> becomes <code>dataset.userId</code> (hyphens convert to camelCase). Values are always strings.</div>`,
            },
            {
              q: 'What is the difference between localStorage, sessionStorage, and cookies?',
              difficulty: 'medium',
              a: `<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
<tr><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;"></th><th style="padding:6px;border-bottom:1px solid #ccc;">localStorage</th><th style="padding:6px;border-bottom:1px solid #ccc;">sessionStorage</th><th style="padding:6px;border-bottom:1px solid #ccc;">Cookies</th></tr>
<tr><td style="padding:6px;">Capacity</td><td style="padding:6px;">5-10 MB</td><td style="padding:6px;">5-10 MB</td><td style="padding:6px;">~4 KB</td></tr>
<tr><td style="padding:6px;">Lifetime</td><td style="padding:6px;">Permanent</td><td style="padding:6px;">Tab close</td><td style="padding:6px;">Configurable (Expires)</td></tr>
<tr><td style="padding:6px;">Sent to server</td><td style="padding:6px;">No</td><td style="padding:6px;">No</td><td style="padding:6px;">Yes (every request)</td></tr>
<tr><td style="padding:6px;">Access</td><td style="padding:6px;">JS only</td><td style="padding:6px;">JS only</td><td style="padding:6px;">JS + Server (HttpOnly blocks JS)</td></tr>
</table>
<pre>localStorage.setItem('theme', 'dark');
localStorage.getItem('theme');  // 'dark'

document.cookie = 'token=abc; path=/; Secure; HttpOnly; SameSite=Strict';</pre>
<div class="key-point">Use <code>HttpOnly</code> + <code>Secure</code> + <code>SameSite</code> cookies for auth tokens. Never store sensitive data in localStorage (XSS accessible).</div>`,
            },
            {
              q: 'What is the difference between defer and async in script loading?',
              difficulty: 'tricky',
              a: `<ul>
<li><strong>No attribute</strong>: blocks HTML parsing. Script downloaded + executed immediately.</li>
<li><strong>async</strong>: download in parallel, execute immediately when ready (may interrupt parsing). Order not guaranteed.</li>
<li><strong>defer</strong>: download in parallel, execute <strong>after</strong> HTML parsing complete. Order preserved.</li>
</ul>
<pre>&lt;script src="app.js"&gt;&lt;/script&gt;                 &lt;!-- blocking --&gt;
&lt;script src="analytics.js" async&gt;&lt;/script&gt;      &lt;!-- async: order doesn't matter --&gt;
&lt;script src="app.js" defer&gt;&lt;/script&gt;            &lt;!-- defer: needs DOM, order matters --&gt;</pre>
<div class="key-point">Best practice: use <code>defer</code> for your app scripts, <code>async</code> for independent scripts (analytics, ads).</div>`,
            },
            {
              q: 'What are meta tags and why are they important?',
              difficulty: 'medium',
              a: `<pre>&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
  &lt;meta name="description" content="Interview prep tool for developers"&gt;
  &lt;meta name="robots" content="index, follow"&gt;

  &lt;!-- Open Graph (social sharing) --&gt;
  &lt;meta property="og:title" content="My App"&gt;
  &lt;meta property="og:description" content="Description for social cards"&gt;
  &lt;meta property="og:image" content="https://example.com/preview.jpg"&gt;

  &lt;!-- Security --&gt;
  &lt;meta http-equiv="Content-Security-Policy" content="default-src 'self'"&gt;
&lt;/head&gt;</pre>
<ul>
<li><code>charset</code>: character encoding (always UTF-8).</li>
<li><code>viewport</code>: responsive design (required for mobile).</li>
<li><code>description</code>: SEO + search result snippet.</li>
<li><code>og:*</code>: social media preview cards.</li>
</ul>`,
            },
            {
              q: 'What is the difference between &lt;div&gt; and &lt;span&gt;?',
              difficulty: 'easy',
              a: `<ul>
<li><code>&lt;div&gt;</code>: <strong>block-level</strong> container. Used for grouping sections of content.</li>
<li><code>&lt;span&gt;</code>: <strong>inline</strong> container. Used for styling text within a block.</li>
</ul>
<pre>&lt;div class="card"&gt;                    &lt;!-- block container --&gt;
  &lt;p&gt;Price: &lt;span class="red"&gt;$49.99&lt;/span&gt;&lt;/p&gt;  &lt;!-- inline styling --&gt;
&lt;/div&gt;</pre>
<div class="key-point">Neither has semantic meaning. Prefer semantic elements (<code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;nav&gt;</code>) when they apply.</div>`,
            },
            {
              q: 'What is Web Accessibility (a11y)? Name key practices.',
              difficulty: 'hard',
              a: `<p>Making websites usable for people with disabilities (vision, motor, cognitive impairments).</p>
<ul>
<li>Use <strong>semantic HTML</strong> (<code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, <code>&lt;button&gt;</code> not styled <code>&lt;div&gt;</code> for buttons).</li>
<li>Add <strong>alt text</strong> to images: <code>&lt;img alt="Product photo"&gt;</code>.</li>
<li>Use <strong>ARIA</strong> attributes when semantics aren't enough: <code>aria-label</code>, <code>aria-hidden</code>, <code>role</code>.</li>
<li>Ensure <strong>keyboard navigation</strong>: <code>tabindex</code>, focus styles <code>:focus-visible</code>.</li>
<li><strong>Color contrast</strong>: minimum 4.5:1 ratio (AA) for text.</li>
<li>Use <strong>form labels</strong>: <code>&lt;label for="email"&gt;</code>.</li>
</ul>
<pre>&lt;!-- Bad --&gt;
&lt;div onclick="submit()"&gt;Submit&lt;/div&gt;

&lt;!-- Good --&gt;
&lt;button type="submit" aria-label="Submit form"&gt;Submit&lt;/button&gt;</pre>`,
            },
            {
              q: 'What is the difference between &lt;link&gt;, &lt;a&gt;, and &lt;script&gt; tags?',
              difficulty: 'easy',
              a: `<ul>
<li><code>&lt;link&gt;</code>: connects external resources (CSS, favicon, preload). Placed in <code>&lt;head&gt;</code>. Self-closing.</li>
<li><code>&lt;a&gt;</code>: hyperlink for navigation. Inline element. Has <code>href</code>, <code>target</code>, <code>rel</code>.</li>
<li><code>&lt;script&gt;</code>: embeds or references JavaScript. Can be in <code>&lt;head&gt;</code> or <code>&lt;body&gt;</code>.</li>
</ul>
<pre>&lt;link rel="stylesheet" href="styles.css"&gt;
&lt;link rel="icon" href="favicon.ico"&gt;
&lt;link rel="preload" href="font.woff2" as="font" crossorigin&gt;

&lt;a href="/about" target="_blank" rel="noopener noreferrer"&gt;About&lt;/a&gt;

&lt;script src="app.js" defer&gt;&lt;/script&gt;</pre>
<div class="key-point">Always add <code>rel="noopener noreferrer"</code> to <code>target="_blank"</code> links for security (prevents reverse tabnabbing).</div>`,
            },
            {
              q: 'What are HTML forms? Explain validation attributes.',
              difficulty: 'medium',
              a: `<pre>&lt;form action="/api/register" method="POST" novalidate&gt;
  &lt;label for="email"&gt;Email:&lt;/label&gt;
  &lt;input type="email" id="email" name="email" required
    placeholder="you@example.com"
    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"&gt;

  &lt;label for="age"&gt;Age:&lt;/label&gt;
  &lt;input type="number" id="age" name="age" min="18" max="120"&gt;

  &lt;label for="bio"&gt;Bio:&lt;/label&gt;
  &lt;textarea id="bio" name="bio" maxlength="500"&gt;&lt;/textarea&gt;

  &lt;button type="submit"&gt;Register&lt;/button&gt;
&lt;/form&gt;</pre>
<p><strong>Validation attributes</strong>: <code>required</code>, <code>min</code>/<code>max</code>, <code>minlength</code>/<code>maxlength</code>, <code>pattern</code> (regex), <code>type</code> (email, url, number).</p>
<div class="key-point"><code>novalidate</code> on form disables browser validation (useful when using custom JS validation). Always validate server-side too!</div>`,
            },
          ],
        },

        // ───────────────────────── 10. CSS ─────────────────────────,
  {
          id: 'css',
          name: 'CSS',
          icon: '🎨',
          questions: [
            {
              q: 'Explain CSS specificity and how it determines which styles apply.',
              difficulty: 'hard',
              a: `<p>Specificity is calculated as a 4-part score: <code>(inline, ID, class/attr/pseudo-class, element)</code></p>
<pre>/* Specificity examples (a, b, c, d) */
*                    /* 0,0,0,0 */
p                    /* 0,0,0,1 */
.card                /* 0,0,1,0 */
p.card               /* 0,0,1,1 */
#header              /* 0,1,0,0 */
#header .nav li      /* 0,1,1,1 */
style="color:red"    /* 1,0,0,0 */
!important           /* overrides everything (avoid!) */</pre>
<p><strong>Resolution order</strong>: !important > inline > ID > class > element > inherited > browser default.</p>
<div class="key-point">When specificity is equal, the <strong>last rule</strong> in source order wins. Avoid <code>!important</code> — it breaks the cascade.</div>`,
            },
            {
              q: 'What is the CSS Box Model? Explain content-box vs border-box.',
              difficulty: 'medium',
              a: `<p>Every element is a rectangular box: <strong>content → padding → border → margin</strong>.</p>
<pre>/* content-box (default): width = content only */
.box { width: 200px; padding: 20px; border: 5px solid; }
/* Total width = 200 + 20*2 + 5*2 = 250px */

/* border-box: width = content + padding + border */
.box { box-sizing: border-box; width: 200px; padding: 20px; border: 5px solid; }
/* Total width = 200px (content shrinks to 150px) */</pre>
<pre>/* Best practice: apply globally */
*, *::before, *::after {
  box-sizing: border-box;
}</pre>
<div class="key-point">Always use <code>border-box</code>. It makes layout math predictable — <code>width</code> is what you see.</div>`,
            },
            {
              q: 'Explain Flexbox layout. What are the key properties?',
              difficulty: 'medium',
              a: `<pre>.container {
  display: flex;
  flex-direction: row;          /* row | column | row-reverse | column-reverse */
  justify-content: center;      /* main axis: flex-start | center | space-between | space-around */
  align-items: center;          /* cross axis: stretch | flex-start | center | baseline */
  flex-wrap: wrap;              /* nowrap | wrap | wrap-reverse */
  gap: 16px;                    /* space between items */
}

.item {
  flex: 1;                      /* shorthand: flex-grow flex-shrink flex-basis */
  flex-grow: 1;                 /* take remaining space */
  flex-shrink: 0;               /* don't shrink below basis */
  flex-basis: 200px;            /* initial size */
  align-self: flex-end;         /* override align-items for one item */
}</pre>
<div class="key-point"><code>justify-content</code> = main axis alignment. <code>align-items</code> = cross axis alignment. Main axis depends on <code>flex-direction</code>.</div>`,
            },
            {
              q: 'Explain CSS Grid layout. When to use Grid vs Flexbox?',
              difficulty: 'hard',
              a: `<pre>.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);        /* 3 equal columns */
  grid-template-columns: 250px 1fr 1fr;          /* fixed + flexible */
  grid-template-rows: auto 1fr auto;
  gap: 20px;
  grid-template-areas:
    "header header header"
    "sidebar main   main"
    "footer footer footer";
}
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }

/* Item placement */
.item { grid-column: 1 / 3; grid-row: 2 / 4; }</pre>
<ul>
<li><strong>Flexbox</strong>: one-dimensional (row OR column). Best for: navbars, card rows, centering.</li>
<li><strong>Grid</strong>: two-dimensional (rows AND columns). Best for: page layouts, dashboards, galleries.</li>
</ul>`,
            },
            {
              q: 'What are CSS Positioning types? Explain static, relative, absolute, fixed, sticky.',
              difficulty: 'medium',
              a: `<ul>
<li><code>static</code> (default): normal flow. <code>top/left</code> have no effect.</li>
<li><code>relative</code>: offset from its normal position. Space is still reserved.</li>
<li><code>absolute</code>: removed from flow. Positioned relative to nearest <strong>positioned ancestor</strong> (non-static).</li>
<li><code>fixed</code>: removed from flow. Positioned relative to <strong>viewport</strong>. Stays on scroll.</li>
<li><code>sticky</code>: normal flow until scroll threshold, then <strong>sticks</strong>.</li>
</ul>
<pre>.parent { position: relative; }
.tooltip {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
}
.navbar  { position: sticky; top: 0; z-index: 100; }
.modal   { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); }</pre>`,
            },
            {
              q: 'What are CSS pseudo-classes and pseudo-elements? Give examples.',
              difficulty: 'medium',
              a: `<p><strong>Pseudo-classes</strong> (single <code>:</code>): select based on state or position.</p>
<pre>a:hover { color: blue; }
input:focus { border-color: blue; }
li:first-child { font-weight: bold; }
li:nth-child(odd) { background: #f5f5f5; }
input:invalid { border-color: red; }
button:disabled { opacity: 0.5; }
:root { --primary: #4fc3f7; }     /* CSS variables on root */</pre>
<p><strong>Pseudo-elements</strong> (double <code>::</code>): style a specific part of an element.</p>
<pre>.required::after {
  content: " *";
  color: red;
}
p::first-line { font-weight: bold; }
::selection { background: yellow; }
li::marker { color: blue; }        /* bullet/number styling */</pre>`,
            },
            {
              q: 'What are CSS variables (custom properties)? How to use them?',
              difficulty: 'medium',
              a: `<pre>:root {
  --primary: #4fc3f7;
  --spacing: 16px;
  --radius: 8px;
  --shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.card {
  padding: var(--spacing);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.btn-primary {
  background: var(--primary);
  padding: calc(var(--spacing) / 2) var(--spacing);
}

/* Override in scope */
.dark-theme {
  --primary: #0288d1;
}

/* Fallback value */
color: var(--accent, #333);</pre>
<div class="key-point">CSS variables are inherited, scoped, and can be changed at runtime with JavaScript: <code>document.documentElement.style.setProperty('--primary', 'red')</code>.</div>`,
            },
            {
              q: 'What are CSS Media Queries? How to implement responsive design?',
              difficulty: 'medium',
              a: `<pre>/* Mobile-first approach (min-width) */
.container { padding: 16px; }

/* Tablet */
@media (min-width: 768px) {
  .container { padding: 24px; max-width: 720px; margin: 0 auto; }
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { max-width: 960px; }
  .grid { grid-template-columns: repeat(3, 1fr); }
}

/* Print */
@media print {
  .no-print { display: none; }
}

/* Preference queries */
@media (prefers-color-scheme: dark) { body { background: #1a1a2e; } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }</pre>
<div class="key-point">Mobile-first (<code>min-width</code>) is preferred over desktop-first (<code>max-width</code>). Common breakpoints: 576px, 768px, 992px, 1200px.</div>`,
            },
            {
              q: 'What is the difference between em, rem, px, %, vh/vw units?',
              difficulty: 'medium',
              a: `<ul>
<li><code>px</code>: absolute pixels. Precise but doesn't scale.</li>
<li><code>em</code>: relative to <strong>parent's</strong> font-size. Compounds (1.2em × 1.2em = 1.44).</li>
<li><code>rem</code>: relative to <strong>root</strong> (<code>&lt;html&gt;</code>) font-size. Consistent, predictable.</li>
<li><code>%</code>: relative to parent's property (width, height).</li>
<li><code>vh/vw</code>: viewport height/width percentages (100vh = full viewport).</li>
</ul>
<pre>html { font-size: 16px; }     /* 1rem = 16px */
h1 { font-size: 2rem; }       /* 32px */
.card { padding: 1.5rem; }    /* 24px */
.hero { height: 100vh; }      /* full viewport height */
.sidebar { width: 25%; }      /* 25% of parent */</pre>
<div class="key-point">Best practice: <code>rem</code> for typography and spacing, <code>px</code> for borders/shadows, <code>%</code> or <code>fr</code> for layouts, <code>vh/vw</code> for full-screen sections.</div>`,
            },
            {
              q: 'What is the z-index? How does stacking context work?',
              difficulty: 'tricky',
              a: `<p><code>z-index</code> controls the stacking order of positioned elements (non-static).</p>
<p><strong>A new stacking context is created by</strong>:</p>
<ul>
<li>Position <code>relative/absolute/fixed/sticky</code> + <code>z-index</code> value.</li>
<li><code>opacity</code> less than 1.</li>
<li><code>transform</code>, <code>filter</code>, <code>perspective</code>, <code>clip-path</code>.</li>
<li><code>isolation: isolate;</code></li>
</ul>
<pre>.parent { position: relative; z-index: 1; }    /* creates stacking context */
.child  { position: absolute; z-index: 999; }   /* 999 is LOCAL to parent */
.other  { position: relative; z-index: 2; }     /* beats .child because z:2 > z:1 */</pre>
<div class="key-point">Trick: a child with z-index: 999999 can still appear behind another element if its parent's z-index is lower. Stacking contexts are hierarchical.</div>`,
            },
            {
              q: "What are CSS animations and transitions? What's the difference?",
              difficulty: 'medium',
              a: `<pre>/* Transition: A → B on state change */
.btn {
  background: blue;
  transition: background 0.3s ease, transform 0.2s;
}
.btn:hover {
  background: darkblue;
  transform: scale(1.05);
}

/* Animation: multi-step, automatic, repeatable */
@keyframes slideIn {
  0%   { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0);     opacity: 1; }
}
.card {
  animation: slideIn 0.5s ease-out forwards;
  /* name | duration | timing | fill-mode */
}</pre>
<ul>
<li><strong>Transition</strong>: requires trigger (hover, class change). Two states only.</li>
<li><strong>Animation</strong>: auto-runs, multi-step via keyframes, can loop.</li>
</ul>
<div class="key-point">Performance: animate only <code>transform</code> and <code>opacity</code> — they run on the GPU compositor thread without triggering layout/paint.</div>`,
            },
            {
              q: 'How does CSS selector performance work? What are the fastest selectors?',
              difficulty: 'hard',
              a: `<p>CSS selectors are matched <strong>right-to-left</strong>. The rightmost part (key selector) is checked first.</p>
<p><strong>Speed ranking</strong> (fastest to slowest):</p>
<ol>
<li>ID: <code>#header</code></li>
<li>Class: <code>.nav-item</code></li>
<li>Element: <code>div</code></li>
<li>Adjacent/sibling: <code>h2 + p</code></li>
<li>Child: <code>ul > li</code></li>
<li>Descendant: <code>.nav li</code> (slowest — matches every <code>li</code>, then walks up)</li>
<li>Universal: <code>*</code></li>
<li>Attribute: <code>[type="text"]</code></li>
</ol>
<div class="key-point">In practice, CSS selector performance rarely matters for most apps. Focus on reducing the total number of DOM elements and avoiding overly deep nesting.</div>`,
            },
          ],
        },

        // ───────────────────────── 11. MYBATIS ─────────────────────────
  );
})();
