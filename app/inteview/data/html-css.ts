// Interview data: html, css
// Auto-generated from pv.html
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
  {
    id: 'html',
    name: 'HTML',
    icon: '📄',
    questions: [
      {
        q: 'What is the difference between HTML, XHTML, and HTML5?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>HTML is the original markup language and it allows loose syntax. XHTML is a stricter XML version that requires closing every tag, using lowercase, and quoting attributes, and it fails on any error. HTML5 is the current standard, with semantic tags, built-in APIs like Canvas and Web Storage, and a simple <code>&lt;!DOCTYPE html&gt;</code>.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>Semantic tags such as <code>&lt;main&gt;</code>, <code>&lt;nav&gt;</code>, and <code>&lt;header&gt;</code> describe the meaning of the content. They help screen readers navigate, help search engines understand the page, and make the markup easier to read. A styled <code>&lt;div&gt;</code> with a click handler is not a real button, because it loses keyboard focus and accessibility. It is better to use the element that already matches the purpose.</p></div>
<p>Semantic elements clearly describe their meaning to both browser and developer.</p>
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
        a: `<div class="interview-answer"><p>Block elements take the full width and stack on new lines, while inline elements stay in the line and take only the width they need. Width, height, and vertical margins do not work on pure inline elements, which is what <code>inline-block</code> is for. The <code>display</code> property is separate from the tag, so any element can be changed to block or inline.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>The <strong>DOM</strong> is a live tree that the browser builds from the HTML and that JavaScript can change. The browser turns HTML into the DOM and CSS into the CSSOM, combines them into a render tree of visible nodes, then does layout, paint, and composite. Changing layout properties like <code>width</code> or <code>top</code> causes a reflow, which is costly. For animation it is better to use <code>transform</code> and <code>opacity</code>, which run on the GPU.</p></div>
<p>The <strong>DOM (Document Object Model)</strong> is a tree representation of the HTML document that JavaScript can manipulate.</p>
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
        a: `<div class="interview-answer"><p><code>data-*</code> attributes store custom data on an element in a valid way. They are read through the <code>dataset</code> API, where <code>data-user-id</code> becomes <code>dataset.userId</code>, and every value is a string. They are good for small pieces of view state, but not for large data, and never for sensitive data since it is visible in the DOM.</p></div>
<p>Custom attributes prefixed with <code>data-</code> store extra information on HTML elements.</p>
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
        a: `<div class="interview-answer"><p><code>localStorage</code> keeps data until it is cleared and is not sent to the server. <code>sessionStorage</code> works the same way but is removed when the tab closes. Cookies are small, about 4KB, and are sent with every request, which makes them suitable for authentication. Auth tokens should be stored in <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite</code> cookies, not in <code>localStorage</code>, because any XSS attack can read <code>localStorage</code>.</p></div>
<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
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
        a: `<div class="interview-answer"><p>A plain script tag blocks HTML parsing while it downloads and runs. <code>async</code> downloads in parallel and runs as soon as it is ready, so the order is not guaranteed, which suits independent scripts like analytics. <code>defer</code> also downloads in parallel but runs after parsing is done and keeps the order, which suits app code that needs the DOM. Both only apply to external scripts, not inline ones.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>Meta tags give page information to browsers, search engines, and social media. The <code>charset</code> tag should be UTF-8 and placed first, and the <code>viewport</code> tag is required for correct mobile display. The <code>description</code> tag feeds the search result snippet, and the <code>og:*</code> Open Graph tags control how a shared link looks on social media and chat apps.</p></div>
<pre>&lt;head&gt;
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
        a: `<div class="interview-answer"><p><code>&lt;div&gt;</code> is a generic block-level container and <code>&lt;span&gt;</code> is the inline version, and neither has any meaning. They are used only as hooks for styling or scripting when no semantic element fits. Semantic elements like <code>&lt;article&gt;</code> or <code>&lt;nav&gt;</code> should be preferred when they apply, because they add accessibility and structure.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>Accessibility means the site works for people using screen readers, keyboards, or with low vision. The biggest help is semantic HTML, because a real <code>&lt;button&gt;</code> is focusable and works with the keyboard, while a <code>&lt;div&gt;</code> needs extra code to act like one. Other key practices are alt text on images, labels tied to inputs, at least 4.5:1 color contrast, and visible focus styles. ARIA should be used only when native HTML cannot express the meaning.</p></div>
<p>Making websites usable for people with disabilities (vision, motor, cognitive impairments).</p>
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
        a: `<div class="interview-answer"><p><code>&lt;link&gt;</code> connects external resources such as stylesheets and sits in the head. <code>&lt;a&gt;</code> is a hyperlink for navigation and sits in the body. <code>&lt;script&gt;</code> loads or embeds JavaScript. Any link with <code>target="_blank"</code> should include <code>rel="noopener noreferrer"</code> so the opened page cannot control the original tab.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>HTML forms include built-in validation through attributes like <code>required</code>, <code>min</code>, <code>max</code>, <code>minlength</code>, <code>maxlength</code>, <code>pattern</code>, and <code>type</code>, which the browser checks automatically. This client-side check is only for user experience and is not secure, because it can be bypassed, so the server must validate again. The <code>novalidate</code> attribute turns off browser validation when custom JavaScript validation is used.</p></div>
<pre>&lt;form action="/api/register" method="POST" novalidate&gt;
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
      {
        q: 'What is the &lt;picture&gt; element and how do responsive images work?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p><code>srcset</code> with <code>sizes</code> handles resolution switching, where the same image is provided at several widths and the browser picks the best one. <code>&lt;picture&gt;</code> with <code>&lt;source&gt;</code> handles art direction, serving a different crop or a modern format like WebP with a JPEG fallback. The <code>loading="lazy"</code> attribute gives native lazy loading for images below the fold without any JavaScript.</p></div>
<p>The <code>&lt;picture&gt;</code> element and <code>srcset</code> attribute let the browser choose the most appropriate image based on screen size, resolution, and format support.</p>
<pre>&lt;!-- srcset: browser picks based on screen density/width --&gt;
&lt;img
  src="photo-400.jpg"
  srcset="photo-400.jpg 400w,
          photo-800.jpg 800w,
          photo-1200.jpg 1200w"
  sizes="(max-width: 600px) 100vw,
         (max-width: 1200px) 50vw,
         33vw"
  alt="Product photo"&gt;

&lt;!-- &lt;picture&gt;: art direction + format fallback --&gt;
&lt;picture&gt;
  &lt;source media="(max-width: 768px)" srcset="mobile.webp" type="image/webp"&gt;
  &lt;source media="(max-width: 768px)" srcset="mobile.jpg"&gt;
  &lt;source srcset="desktop.webp" type="image/webp"&gt;
  &lt;img src="desktop.jpg" alt="Hero image"&gt;
&lt;/picture&gt;

&lt;!-- Lazy loading (native) --&gt;
&lt;img src="photo.jpg" loading="lazy" alt="..."&gt;</pre>
<div class="key-point"><code>srcset</code> with <code>sizes</code> lets the browser choose the right resolution. <code>&lt;picture&gt;</code> gives you full control for art direction (different crops for mobile vs desktop) and format fallbacks (WebP → JPEG).</div>`,
      },
      {
        q: 'What are Web Components and Shadow DOM?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Web Components are native browser APIs for building reusable, self-contained elements, made of custom elements, shadow DOM, and templates with slots. The shadow DOM truly scopes styles and markup, so a component's CSS does not leak out and outside CSS does not leak in. The raw APIs are verbose, so libraries like Lit are often used. They are most useful for a design system shared across React, Angular, and Vue teams.</p></div>
<p><strong>Web Components</strong> are native browser APIs for creating reusable, encapsulated HTML elements — no framework needed.</p>
<pre>&lt;!-- Using a custom element --&gt;
&lt;user-card name="John" role="Admin"&gt;&lt;/user-card&gt;

&lt;script&gt;
class UserCard extends HTMLElement {
  constructor() {
    super();
    // Shadow DOM: encapsulated DOM + styles
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = \`
      &lt;style&gt;
        .card { padding: 16px; border: 1px solid #ccc; }
        /* These styles are SCOPED — won't leak out */
      &lt;/style&gt;
      &lt;div class="card"&gt;
        &lt;h3&gt;\${this.getAttribute('name')}&lt;/h3&gt;
        &lt;p&gt;\${this.getAttribute('role')}&lt;/p&gt;
        &lt;slot&gt;&lt;/slot&gt;  &lt;!-- content projection --&gt;
      &lt;/div&gt;
    \`;
  }

  // Lifecycle callbacks:
  connectedCallback() { /* element added to DOM */ }
  disconnectedCallback() { /* element removed */ }
  attributeChangedCallback(name, oldVal, newVal) { /* attribute changed */ }
  static get observedAttributes() { return ['name', 'role']; }
}

customElements.define('user-card', UserCard);
&lt;/script&gt;</pre>
<p><strong>Three pillars:</strong></p>
<ul>
<li><strong>Custom Elements</strong>: define new HTML tags with behavior</li>
<li><strong>Shadow DOM</strong>: encapsulated DOM tree with scoped styles</li>
<li><strong>Templates &amp; Slots</strong>: reusable markup and content projection</li>
</ul>
<div class="key-point">Web Components work with any framework or no framework. Libraries like Lit simplify authoring. They're ideal for design systems shared across React, Angular, and Vue projects.</div>`,
      },
      {
        q: 'What blocks HTML parsing vs rendering? Walk through why a page can stay blank for 3 seconds.',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>A synchronous <code>&lt;script&gt;</code> is parser-blocking, so the browser stops building the DOM until the script downloads and runs. Stylesheets are render-blocking, so the browser will not paint until the CSSOM is ready, and a pending stylesheet also delays any synchronous script after it. Because of this, one slow CSS file can leave the page blank for seconds even when the HTML arrived quickly. Fixes include deferring scripts, inlining critical CSS, and preconnecting to or self-hosting the slow source.</p></div>
<p>Two different kinds of "blocking" get conflated, and interviewers love probing the difference:</p>
<ul>
<li><strong>Parser-blocking</strong>: a synchronous <code>&lt;script&gt;</code> stops HTML parsing entirely — the browser must download and execute it before it continues, because the script could <code>document.write()</code> or mutate the DOM.</li>
<li><strong>Render-blocking</strong>: stylesheets do NOT stop parsing, but they block building the render tree — the browser refuses to paint anything until the CSSOM is complete (otherwise you'd see a flash of unstyled content). Worse, a pending stylesheet also <strong>blocks execution of later sync scripts</strong>, because the script might read computed styles (<code>getComputedStyle</code>).</li>
</ul>
<p><strong>The "white page for 3s" walkthrough:</strong></p>
<pre>&lt;head&gt;
  &lt;link rel="stylesheet" href="https://slow-cdn.com/all.css"&gt;  &lt;!-- 3s download --&gt;
  &lt;script src="app.js"&gt;&lt;/script&gt;  &lt;!-- can't RUN until all.css arrives --&gt;
&lt;/head&gt;
&lt;body&gt;&lt;h1&gt;Hello&lt;/h1&gt;&lt;/body&gt;

&lt;!-- Timeline:
     0.0s  HTML parsed up to &lt;link&gt;, CSS request starts
     0.0s  parser reaches &lt;script&gt; — blocked: waits for CSSOM
     3.0s  all.css arrives → CSSOM ready → app.js executes
     3.1s  parsing resumes, render tree built, first paint
     Result: user stares at white for ~3s even though the
     HTML for &lt;h1&gt; arrived in the first packet. --&gt;</pre>
<p><strong>Fixes, in order of impact:</strong></p>
<ul>
<li><code>defer</code> the script (or move to end of body) — decouples it from the stylesheet.</li>
<li>Inline <strong>critical CSS</strong> in <code>&lt;head&gt;</code>, load the rest with <code>media="print" onload="this.media='all'"</code> or split by media query (non-matching media = not render-blocking).</li>
<li><code>&lt;link rel="preconnect"&gt;</code> to the slow CDN, or self-host the CSS.</li>
</ul>
<div class="key-point">Sync scripts block the parser; stylesheets block rendering AND any sync script after them — so one slow CSS file on a third-party domain can freeze your entire page even though HTML parsing already delivered the content.</div>`,
      },
      {
        q: 'Explain resource hints: preload vs prefetch vs preconnect vs dns-prefetch.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Resource hints tell the browser to fetch things earlier and cut waiting time. <code>preload</code> fetches a resource needed for the current page at high priority, <code>prefetch</code> fetches something likely needed on the next page when idle, <code>preconnect</code> opens the DNS, TCP, and TLS connection to an origin, and <code>dns-prefetch</code> does only the DNS lookup. Fonts are the main use for <code>preload</code>, but they need the <code>crossorigin</code> attribute or the browser downloads them twice. Hinting resources that are not used wastes priority and bandwidth.</p></div>
<p>Resource hints let you tell the browser about resources <em>before</em> it discovers them naturally, cutting waterfall latency:</p>
<pre>&lt;!-- preload: "I WILL need this for THIS page, fetch it NOW, high priority" --&gt;
&lt;link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin&gt;
&lt;link rel="preload" href="/hero.avif" as="image"&gt;

&lt;!-- prefetch: "the user will LIKELY need this on the NEXT page" (lowest priority, idle time) --&gt;
&lt;link rel="prefetch" href="/checkout.js"&gt;

&lt;!-- preconnect: "open DNS + TCP + TLS to this origin now" (no specific resource) --&gt;
&lt;link rel="preconnect" href="https://api.example.com"&gt;
&lt;link rel="preconnect" href="https://fonts.gstatic.com" crossorigin&gt;

&lt;!-- dns-prefetch: DNS lookup only — cheap fallback for older browsers --&gt;
&lt;link rel="dns-prefetch" href="https://analytics.example.com"&gt;</pre>
<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
<tr><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;">Hint</th><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;">What it does</th><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;">Best for</th></tr>
<tr><td style="padding:6px;"><code>preload</code></td><td style="padding:6px;">Full fetch, current page, high priority</td><td style="padding:6px;">Fonts, LCP hero image, critical CSS found late</td></tr>
<tr><td style="padding:6px;"><code>prefetch</code></td><td style="padding:6px;">Full fetch, idle priority, cached for next navigation</td><td style="padding:6px;">Next-route bundles (hover on link)</td></tr>
<tr><td style="padding:6px;"><code>preconnect</code></td><td style="padding:6px;">DNS + TCP + TLS handshake only</td><td style="padding:6px;">Known third-party origins (API, font CDN)</td></tr>
<tr><td style="padding:6px;"><code>dns-prefetch</code></td><td style="padding:6px;">DNS lookup only</td><td style="padding:6px;">Many/low-priority third-party origins</td></tr>
</table>
<p><strong>Classic gotchas interviewers probe:</strong></p>
<ul>
<li>Fonts are the #1 preload use case: they're discovered <em>very late</em> (HTML → CSS → @font-face → fetch). Preloading skips two round trips. But you <strong>must add <code>crossorigin</code></strong> — fonts are fetched in CORS mode even same-origin, and a mismatched mode means the preload is ignored and the font downloads twice.</li>
<li>Preloading things you don't use wastes bandwidth and steals priority from real resources — Chrome even warns "resource was preloaded but not used".</li>
<li>Don't <code>preconnect</code> to more than a handful of origins; each open socket has a cost.</li>
</ul>
<div class="key-point">preload = this page, now; prefetch = next page, when idle; preconnect = warm up the connection. And fonts need <code>preload + as="font" + crossorigin</code> or the hint silently double-fetches.</div>`,
      },
      {
        q: 'What happens when you type a URL and press Enter? (browser-side deep dive)',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The process has two parts, network then rendering. The network part is URL parsing and HSTS, DNS lookup, the TCP handshake, the TLS handshake, then the HTTP request and the first bytes of the response. The rendering part parses HTML into the DOM, builds the CSSOM and render tree, then does layout, paint, and composite, while a preload scanner fetches assets ahead of time. Time can be measured with the Navigation Timing API, and the second visit is faster due to caching, TLS resumption, and bfcache.</p></div>
<p>The classic system-design-meets-frontend question. A senior answer covers each stage and where time is actually spent:</p>
<ol>
<li><strong>URL parsing + HSTS check</strong>: browser decides search query vs URL, checks HSTS list (forces https), checks service worker registration (may skip network entirely).</li>
<li><strong>DNS resolution</strong>: browser cache → OS cache → router → ISP resolver → recursive lookup. (~0–120ms)</li>
<li><strong>TCP handshake</strong>: SYN → SYN-ACK → ACK (1 round trip).</li>
<li><strong>TLS handshake</strong>: certificate exchange, key agreement — 1 RTT on TLS 1.3 (0-RTT on resumption); HTTP/3/QUIC merges transport + crypto handshakes.</li>
<li><strong>HTTP request/response</strong>: request with cookies/headers; server responds. First chunk = TTFB. Response streams — the browser does NOT wait for the full document.</li>
<li><strong>Parsing</strong>: HTML tokenized into the DOM <em>incrementally</em>. A <strong>preload scanner</strong> races ahead of the parser discovering <code>&lt;img&gt;</code>/<code>&lt;link&gt;</code>/<code>&lt;script&gt;</code> URLs even while the parser is blocked. CSS builds the CSSOM; sync scripts pause the parser.</li>
<li><strong>Render</strong>: DOM + CSSOM → render tree → layout → paint → composite. First paint can happen long before the page finishes loading.</li>
</ol>
<pre>// Where did the time go? The Navigation Timing API mirrors these stages:
const t = performance.getEntriesByType('navigation')[0];
t.domainLookupEnd - t.domainLookupStart;   // DNS
t.connectEnd - t.connectStart;             // TCP (+TLS)
t.responseStart - t.requestStart;          // TTFB (server think time)
t.domContentLoadedEventEnd - t.startTime;  // parse + sync scripts
t.loadEventEnd - t.startTime;              // everything</pre>
<p><strong>Follow-ups to expect:</strong> "Why is the second visit faster?" (DNS/TLS session/HTTP cache/bfcache), "Where would you add a CDN?" (moves TCP/TLS/TTFB closer to the user), "What's the preload scanner?" (it's why a parser-blocking script doesn't stop image downloads).</p>
<div class="key-point">Structure the answer as network (DNS → TCP → TLS → TTFB) then rendering (parse → CRP), and name the measurement API — showing you can quantify each stage is what separates senior from mid-level.</div>`,
      },
      {
        q: 'Why is input type="number" often the wrong choice? How do autocomplete attributes work?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p><code>type="number"</code> is meant for real quantities used in math, not for numeric-looking identifiers. Card numbers, OTP codes, ZIP codes, and phone numbers can lose leading zeros, pick up separators, or be changed by the scroll wheel, and an invalid entry can read back as an empty string. For identifiers it is better to use <code>type="text"</code> with <code>inputmode="numeric"</code> and a <code>pattern</code>. Correct <code>autocomplete</code> tokens should also be set, since good autofill improves conversion.</p></div>
<p>A senior-flavored forms question: the "obvious" input type is frequently a UX and correctness trap.</p>
<p><strong>Problems with <code>type="number"</code>:</strong></p>
<ul>
<li><strong>Scroll-wheel disaster</strong>: hovering + scrolling silently changes the value — users change a dosage/price without noticing.</li>
<li><strong>Not for "numeric strings"</strong>: credit cards, OTP codes, ZIP codes, phone numbers lose leading zeros (<code>0421</code> → <code>421</code>) and can render with locale thousand separators. They are identifiers, not quantities.</li>
<li><strong>Silent empty value</strong>: type <code>1e</code> or <code>--5</code> and <code>input.value</code> is <code>""</code> (invalid intermediate state) — your JS sees an empty string while the user sees text.</li>
<li>Spinner buttons are tiny, unlabeled, and announced inconsistently by screen readers.</li>
</ul>
<pre>&lt;!-- Wrong: card number is not a quantity --&gt;
&lt;input type="number" name="cc"&gt;

&lt;!-- Right: text + numeric keyboard + digit constraint --&gt;
&lt;input type="text" inputmode="numeric" pattern="[0-9\\s]{13,19}"
       autocomplete="cc-number" name="cc"&gt;

&lt;!-- type="number" is fine for true quantities --&gt;
&lt;input type="number" name="qty" min="1" max="99" step="1"&gt;</pre>
<p><strong>Autocomplete attributes</strong> are a standardized vocabulary, not just on/off — they drive browser autofill, password managers, and one-tap address fill:</p>
<pre>&lt;input autocomplete="email"&gt;
&lt;input autocomplete="current-password"&gt;   &lt;!-- login --&gt;
&lt;input autocomplete="new-password"&gt;       &lt;!-- signup: suggests generated password --&gt;
&lt;input autocomplete="one-time-code"&gt;      &lt;!-- SMS OTP autofill on mobile --&gt;
&lt;input autocomplete="shipping street-address"&gt;  &lt;!-- section modifiers --&gt;</pre>
<div class="key-point">Rule of thumb: <code>type="number"</code> only for real quantities you'd do math on; use <code>inputmode="numeric"</code> + <code>pattern</code> for numeric identifiers, and always ship correct <code>autocomplete</code> tokens — autofill accuracy is a measurable conversion win.</div>`,
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
        a: `<div class="interview-answer"><p>Specificity is compared in order: inline styles, then IDs, then classes, attributes, and pseudo-classes, then elements, and source order only decides a tie. Using more specificity or <code>!important</code> to win is a sign of poor structure. Keeping selectors flat and class-based avoids these fights, which is why methods like BEM and the zero-specificity <code>:where()</code> exist. <code>!important</code> should be kept for utilities or overriding third-party styles.</p></div>
<p>Specificity is calculated as a 4-part score: <code>(inline, ID, class/attr/pseudo-class, element)</code></p>
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
        a: `<div class="interview-answer"><p>Every box is made of content, padding, border, and margin. With the default <code>content-box</code>, <code>width</code> sets only the content, so padding and border are added on top and a 200px box becomes larger. With <code>border-box</code>, <code>width</code> is the full size, which matches how people think. A common practice is to apply <code>border-box</code> globally so the layout math is predictable.</p></div>
<p>Every element is a rectangular box: <strong>content → padding → border → margin</strong>.</p>
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
        a: `<div class="interview-answer"><p>Flexbox is used for one-dimensional layout along a single axis. <code>justify-content</code> aligns items on the main axis and <code>align-items</code> aligns them on the cross axis, and which is which changes with <code>flex-direction</code>. The <code>flex</code> shorthand controls grow, shrink, and basis. A common issue is that flex items will not shrink below their content by default, so <code>min-width: 0</code> is needed.</p></div>
<pre>.container {
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
        a: `<div class="interview-answer"><p>CSS Grid handles two-dimensional layout with rows and columns together, while Flexbox handles one axis. Grid suits page-level layouts and anything needing alignment in both directions, and the two can be combined. Useful features include named template areas, <code>repeat()</code> with <code>minmax()</code> and <code>auto-fit</code> or <code>auto-fill</code>, and <code>fr</code> units. Note that <code>1fr</code> means <code>minmax(auto, 1fr)</code>, so use <code>minmax(0, 1fr)</code> when tracks must shrink.</p></div>
<pre>.grid-container {
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
        a: `<div class="interview-answer"><p><code>static</code> is the default flow. <code>relative</code> offsets an element from its normal spot while keeping its space. <code>absolute</code> removes it from flow and positions it against the nearest positioned ancestor. <code>fixed</code> pins it to the viewport, and <code>sticky</code> flows normally until it reaches a threshold and then sticks. For <code>absolute</code>, the parent usually needs <code>position: relative</code>, and <code>sticky</code> needs a threshold like <code>top</code> to work.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>Pseudo-classes use a single colon and match a state or position, such as <code>:hover</code>, <code>:focus</code>, and <code>:nth-child</code>. Pseudo-elements use a double colon and style or create a part of an element, such as <code>::before</code>, <code>::after</code>, and <code>::selection</code>. A pseudo-class selects an existing element by condition, while a pseudo-element targets or creates a piece that is not a real DOM node. <code>::before</code> and <code>::after</code> show nothing without a <code>content</code> property.</p></div>
<p><strong>Pseudo-classes</strong> (single <code>:</code>): select based on state or position.</p>
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
        a: `<div class="interview-answer"><p>CSS custom properties are live values that exist at runtime, unlike Sass variables that disappear at compile time. They cascade and inherit, so a token defined on <code>:root</code> can be overridden in a scope, which is how dark themes work. They can also be read and written from JavaScript with <code>setProperty</code>, and they accept a fallback as a second argument. Because they resolve at runtime, they respond to the DOM context where they are used.</p></div>
<pre>:root {
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
        a: `<div class="interview-answer"><p>Media queries let styles respond to the viewport size and to device or user conditions. A mobile-first approach with <code>min-width</code> keeps base styles for small screens and adds enhancements at larger breakpoints. Preference queries also matter, such as <code>prefers-color-scheme</code> for dark mode and <code>prefers-reduced-motion</code> to reduce animation. Container queries now handle component-level responsiveness that media queries cannot.</p></div>
<pre>/* Mobile-first approach (min-width) */
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
        a: `<div class="interview-answer"><p><code>px</code> is absolute and predictable but ignores the user's font settings. <code>em</code> is relative to the parent font-size and compounds when nested. <code>rem</code> is relative to the root font-size and stays consistent, which suits type and spacing. <code>%</code> is relative to the parent, and <code>vh</code> and <code>vw</code> are relative to the viewport. Using <code>rem</code> for font-size respects browser zoom, and <code>100vh</code> can overflow on mobile, which <code>dvh</code> fixes.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p><code>z-index</code> only works on positioned elements and only compares elements within the same stacking context. A child with a very high <code>z-index</code> can still sit behind a neighbor if its parent forms a lower stacking context. Stacking contexts are created by more than <code>z-index</code>, including <code>opacity</code> below 1, any <code>transform</code> or <code>filter</code>, and <code>isolation: isolate</code>. The real fix for z-index problems is usually to correct the context hierarchy.</p></div>
<p><code>z-index</code> controls the stacking order of positioned elements (non-static).</p>
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
        a: `<div class="interview-answer"><p>Transitions move between two states and need a trigger like <code>:hover</code> or a class change. Animations use <code>@keyframes</code> for multi-step motion that can run on its own and loop. For performance, only <code>transform</code> and <code>opacity</code> should be animated, since they run on the GPU without touching layout or paint. Animating properties like <code>left</code> or <code>width</code> causes a re-layout every frame and stutters.</p></div>
<pre>/* Transition: A → B on state change */
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
        a: `<div class="interview-answer"><p>Browsers match selectors right-to-left, so the rightmost part is checked first. This makes a descendant selector like <code>.nav li</code> slower, because every <code>li</code> is matched before ancestors are checked, while IDs and classes are fastest. On modern browsers this rarely matters, since selector matching is tiny compared to layout, paint, and DOM size. It is better to favor readable, low-specificity selectors and a smaller DOM.</p></div>
<p>CSS selectors are matched <strong>right-to-left</strong>. The rightmost part (key selector) is checked first.</p>
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
      {
        q: 'What are :has(), :is(), and :where() selectors in modern CSS?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p><code>:is()</code> and <code>:where()</code> shorten repetitive selector lists, and the key difference is specificity: <code>:is()</code> uses the highest specificity of its arguments, while <code>:where()</code> always adds zero, which suits resets and defaults. <code>:has()</code> is the parent selector, letting an element be styled based on its descendants or following siblings, such as a form that has an invalid input. It enables patterns that used to require JavaScript and is now supported in all major browsers.</p></div>
<p>Modern CSS pseudo-classes that simplify complex selectors:</p>
<pre>/* :has() — the "parent selector" (CSS4) */
/* Select a card that HAS an image inside it */
.card:has(img) { border: 2px solid blue; }

/* Select a form that has an invalid input */
form:has(:invalid) { border: 1px solid red; }

/* Select a label whose next sibling input is focused */
label:has(+ input:focus) { color: blue; }

/* :is() — matches any of the selectors (takes highest specificity) */
:is(h1, h2, h3, h4) { color: navy; }
/* Same as: h1, h2, h3, h4 { color: navy; } but more composable */

/* Useful with nesting: */
article :is(h1, h2, h3) { margin-top: 2em; }
/* Instead of: article h1, article h2, article h3 { ... } */

/* :where() — same as :is() but ZERO specificity */
:where(h1, h2, h3) { color: navy; }
/* Specificity: 0,0,0,0 — easily overridable */
/* Great for resets and default styles */

/* Practical difference: */
:is(.important, #header) p { }  /* specificity of #header applies */
:where(.important, #header) p { }  /* specificity is 0 — easily overridden */</pre>
<div class="key-point"><code>:has()</code> is revolutionary — CSS can now style parents based on children. <code>:is()</code> takes the highest specificity of its arguments, while <code>:where()</code> always has zero specificity. Use <code>:where()</code> for default styles you want to be easily overridden.</div>`,
      },
      {
        q: 'What are CSS container queries and how do they differ from media queries?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Media queries respond to the viewport size, while container queries respond to the parent's size, which matters for reusable components. A card can switch from row to column based on whether it is in a wide column or a narrow sidebar, which only container queries can express. A parent opts in with <code>container-type: inline-size</code>, then <code>@container</code> rules apply, and <code>cq</code> units are sized to the container. This makes components truly context-independent.</p></div>
<p><strong>Media queries</strong> respond to the <em>viewport</em> size. <strong>Container queries</strong> respond to the <em>parent container</em> size — enabling truly reusable components.</p>
<pre>/* Media query: based on viewport */
@media (max-width: 768px) {
  .card { flex-direction: column; }
}

/* Container query: based on parent container */
.card-container {
  container-type: inline-size;  /* declare as container */
  container-name: card;         /* optional name */
}

/* When the CONTAINER is small, not the viewport */
@container card (max-width: 400px) {
  .card { flex-direction: column; }
  .card img { width: 100%; }
}

@container card (min-width: 401px) {
  .card { flex-direction: row; }
  .card img { width: 200px; }
}

/* Container query units */
.title {
  font-size: 5cqw;  /* 5% of container width */
  /* cqw, cqh, cqi, cqb, cqmin, cqmax */
}</pre>
<div class="key-point">Container queries solve the problem where a component looks different in a sidebar vs main content area — something media queries can't handle. This is the most significant CSS feature since Flexbox.</div>`,
      },
      {
        q: 'What is BEM methodology and why use a CSS naming convention?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>BEM is a naming convention using Block, Element, and Modifier that makes CSS predictable. Everything becomes a single flat class selector, so specificity stays constant and there are no nesting or cascade fights, which helps in large shared codebases. It is only one way to handle scoping. Modern projects often use CSS Modules or utility-first Tailwind, which enforce the same isolation automatically.</p></div>
<p><strong>BEM (Block Element Modifier)</strong> is a naming convention that makes CSS more maintainable and predictable.</p>
<pre>/* BEM: Block__Element--Modifier */

/* Block: standalone component */
.card { }

/* Element: part of a block (double underscore) */
.card__title { }
.card__image { }
.card__body { }

/* Modifier: variation of block or element (double dash) */
.card--featured { border: 2px solid gold; }
.card__title--large { font-size: 2rem; }

/* HTML: */
&lt;div class="card card--featured"&gt;
  &lt;img class="card__image" src="..." alt="..."&gt;
  &lt;h2 class="card__title card__title--large"&gt;Title&lt;/h2&gt;
  &lt;p class="card__body"&gt;Content&lt;/p&gt;
&lt;/div&gt;</pre>
<p><strong>Benefits:</strong></p>
<ul>
<li>Low specificity (single class selectors) → easy to override</li>
<li>Self-documenting: class names show relationships</li>
<li>No nesting → avoids specificity wars</li>
<li>Scales well in large codebases</li>
</ul>
<div class="key-point">BEM looks verbose but prevents the CSS specificity mess that plagues large projects. Modern alternatives: CSS Modules (scoped automatically), Tailwind CSS (utility-first), CSS-in-JS (styled-components).</div>`,
      },
      {
        q: 'What is margin collapsing? Predict the output: two stacked boxes with margins 30px and 20px.',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Adjacent vertical margins between block boxes collapse to the larger of the two, not the sum, so 30px and 20px give 30px. With a negative value, the largest positive is added to the most negative. This only happens vertically between block boxes in the same formatting context. A common bug is a child's top margin leaking through its parent, which is fixed by creating a BFC with <code>display: flow-root</code> or by making the parent a flex container.</p></div>
<p>Vertical margins of block boxes in normal flow <strong>collapse</strong>: instead of adding, the result is the <strong>maximum</strong> of the two. Horizontal margins never collapse.</p>
<pre>.a { margin-bottom: 30px; }
.b { margin-top: 20px; }
/* Gap between .a and .b = 30px, NOT 50px (max wins) */

/* With a negative margin: positive-max + negative-min */
.a { margin-bottom: 30px; }
.b { margin-top: -20px; }
/* Gap = 30 + (-20) = 10px */</pre>
<p><strong>The three collapse cases:</strong></p>
<ul>
<li><strong>Adjacent siblings</strong> — as above.</li>
<li><strong>Parent / first (or last) child</strong> — if nothing separates them (no border, padding, or inline content), the child's margin escapes THROUGH the parent. This is the classic "why is my parent's background not behind the heading's margin" bug:</li>
</ul>
<pre>&lt;div class="parent"&gt;   &lt;!-- background: teal --&gt;
  &lt;h2 style="margin-top: 40px"&gt;Title&lt;/h2&gt;
&lt;/div&gt;
/* BUG: the 40px pushes the PARENT down; the teal box
   starts right at the h2 text — margin leaked outside. */</pre>
<ul>
<li><strong>Empty blocks</strong> — an element with no height collapses its own top and bottom margins together.</li>
</ul>
<p><strong>What prevents collapsing:</strong> padding or border on the parent, creating a BFC (<code>display: flow-root</code>, <code>overflow: hidden</code>), and — critically — <strong>flex and grid items never collapse margins</strong>. Neither do floats or absolutely positioned elements.</p>
<pre>/* Fixes for the parent/child leak: */
.parent { padding-top: 1px; }        /* separator */
.parent { display: flow-root; }      /* new BFC — cleanest */
.parent { display: flex; flex-direction: column; }  /* flex items don't collapse */</pre>
<div class="key-point">Collapsed margin = max of the positives (plus the most-negative negative); it happens only between block boxes in the same BFC — which is why "just make it flex" mysteriously fixes spacing bugs.</div>`,
      },
      {
        q: 'What is a Block Formatting Context (BFC) and what real bugs does it fix?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A Block Formatting Context is an isolated layout region where floats, margins, and flow cannot affect the outside. It is the mechanism behind several fixes: containing floats so the parent keeps its height, stopping margin from leaking through a parent, and making text sit beside a float instead of wrapping under it. The modern way to create one is <code>display: flow-root</code>. The older <code>overflow: hidden</code> trick is best avoided because it clips shadows and dropdowns and breaks sticky descendants.</p></div>
<p>A <strong>BFC</strong> is an isolated layout region: everything inside lays out independently, and the outside can't interfere. It's the invisible mechanism behind several "magic" CSS fixes.</p>
<p><strong>What creates a BFC:</strong></p>
<ul>
<li><code>display: flow-root</code> — the modern, side-effect-free way.</li>
<li><code>overflow</code> other than <code>visible</code> (<code>hidden</code>, <code>auto</code>, <code>scroll</code>) — the old hack.</li>
<li>Floats, <code>position: absolute/fixed</code>, <code>display: inline-block</code>, table cells.</li>
<li>Flex/grid <em>items</em> establish their own formatting context for their contents.</li>
</ul>
<p><strong>Three classic bugs a BFC fixes:</strong></p>
<pre>/* 1. Parent collapses to zero height around floated children */
.card { display: flow-root; }   /* now contains its floats
                                   (replaces the old .clearfix hack) */

/* 2. Margin collapsing through a parent (child margin leaks out) */
.section { display: flow-root; }  /* child's margin-top stays INSIDE */

/* 3. Text wrapping under a float instead of beside it */
&lt;img class="avatar" style="float: left"&gt;
&lt;div class="comment-body"&gt;long text...&lt;/div&gt;

.comment-body { display: flow-root; }
/* Becomes a rectangle NEXT to the float —
   text no longer wraps underneath the image */</pre>
<p><strong>Why <code>flow-root</code> over <code>overflow: hidden</code>?</strong> The overflow hack has side effects: it clips box-shadows, tooltips, and dropdowns, and breaks <code>position: sticky</code> in descendants. <code>flow-root</code> exists purely to create a BFC.</p>
<div class="key-point">When floats escape, margins leak, or text wraps under a float, the answer is "create a BFC" — and in modern CSS that means <code>display: flow-root</code>, not <code>overflow: hidden</code>.</div>`,
      },
      {
        q: 'Why is my position: sticky not working? List the debugging checklist.',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Sticky fails quietly, acting like relative with no error, so a checklist helps. First, a threshold like <code>top</code> is required or it does nothing. Second, the most common cause is an ancestor with <code>overflow: hidden</code> or <code>auto</code>, often added to remove a horizontal scrollbar, which makes the element stick inside that box instead of the page. Third, the parent must be taller than the element, and in a flex row the item needs <code>align-self: flex-start</code> so it does not stretch.</p></div>
<p>Sticky is the most silently-failing feature in CSS — it degrades to "just relative" with no error. The checklist, in the order you should check:</p>
<ol>
<li><strong>No threshold set</strong>: sticky does nothing without <code>top</code> (or <code>bottom/left/right</code>). <code>position: sticky;</code> alone is a no-op.</li>
<li><strong>An ancestor has <code>overflow: hidden/auto/scroll</code></strong>: the element then sticks within THAT ancestor's scroll box, not the page — if that ancestor doesn't scroll, sticky never engages. This is the #1 real-world cause, often from an <code>overflow-x: hidden</code> slapped on a wrapper to kill horizontal scrollbars.</li>
<li><strong>Parent is exactly as tall as the element</strong>: sticky only slides within its parent's box. If the parent has no extra height, there's no room to stick.</li>
<li><strong>Flex/grid stretch</strong>: inside a flex row, items default to <code>align-items: stretch</code>, so the sticky item is full-height of its parent → case 3. Fix: <code>align-self: flex-start</code>.</li>
</ol>
<pre>/* The flex-sidebar case — sticky "not working": */
.layout  { display: flex; }
.sidebar { position: sticky; top: 0; }   /* ✗ stretched to full height */

/* Fix: */
.sidebar {
  position: sticky;
  top: 0;                    /* 1. threshold */
  align-self: flex-start;    /* 4. stop stretching */
  max-height: 100vh;         /* bonus: let long sidebars scroll */
  overflow-y: auto;
}

/* Debug ancestor overflow in DevTools console: */
let el = document.querySelector('.sidebar').parentElement;
while (el) {
  const o = getComputedStyle(el).overflow;
  if (o !== 'visible') console.log(el, o);   // culprit found
  el = el.parentElement;
}</pre>
<div class="key-point">Sticky needs: a threshold (<code>top</code>), a taller parent to slide within, and NO clipping ancestor between it and the scroller — and in flex layouts, <code>align-self: flex-start</code>.</div>`,
      },
      {
        q: 'Why does content inside a flex item overflow instead of shrinking? (the min-width: auto trap)',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>A common flexbox issue is that flex items default to <code>min-width: auto</code>, not zero, so an item will not shrink below its content's minimum, such as a long word or an unbreakable <code>&lt;pre&gt;</code> line, and it overflows the container. The fix is <code>min-width: 0</code> on the flex item, then let the inner content scroll or use an ellipsis. The same trap appears as <code>min-height: 0</code> in a column, and in Grid as needing <code>minmax(0, 1fr)</code> instead of <code>1fr</code>. Adding <code>overflow: hidden</code> also resets this minimum.</p></div>
<p>The single most common senior-level flexbox gotcha: flex items default to <code>min-width: auto</code> (not <code>0</code>), meaning <strong>a flex item refuses to shrink below its content's intrinsic minimum size</strong> — the longest word, the widest <code>&lt;pre&gt;</code> line, an unshrinkable table.</p>
<pre>&lt;div class="chat"&gt;
  &lt;div class="avatar"&gt;...&lt;/div&gt;
  &lt;div class="message"&gt;
    &lt;pre&gt;someVeryLongUnbreakableCodeLine.that.overflows()&lt;/pre&gt;
  &lt;/div&gt;
&lt;/div&gt;

.chat    { display: flex; }
.message { flex: 1; }
/* ✗ The &lt;pre&gt;'s intrinsic width sets .message's minimum →
   .message grows past the container, blows out the layout,
   and the whole page gets a horizontal scrollbar. */

/* ✓ Fix: allow the item to shrink */
.message { flex: 1; min-width: 0; }
.message pre { overflow-x: auto; }   /* pre scrolls INSIDE instead */

/* Same trap for text-overflow: ellipsis in flex: */
.title { flex: 1; min-width: 0; white-space: nowrap;
         overflow: hidden; text-overflow: ellipsis; }</pre>
<p><strong>Why does the spec do this?</strong> Deliberate: it prevents content from silently becoming unreadable when items shrink. But it inverts the intuition that <code>flex-shrink: 1</code> means "will shrink as needed".</p>
<p><strong>Related facts interviewers probe:</strong></p>
<ul>
<li>Column direction: the same trap is <code>min-height: auto</code> — the cause of "my flex child won't scroll" (fix: <code>min-height: 0</code> on the scrollable item's ancestors in the flex chain).</li>
<li>Grid has the identical rule: <code>1fr</code> is really <code>minmax(auto, 1fr)</code>; use <code>minmax(0, 1fr)</code> to allow shrinking.</li>
<li><code>overflow: hidden/auto</code> on the flex item ALSO resets the auto minimum — which is why adding overflow "randomly" fixes it.</li>
</ul>
<div class="key-point">Text, <code>&lt;pre&gt;</code>, or charts overflowing a flex/grid track? The answer is almost always <code>min-width: 0</code> (or <code>minmax(0, 1fr)</code>) — flex items don't shrink below content size by default.</div>`,
      },
      {
        q: 'Explain reflow vs repaint vs composite. What is layout thrashing and how do you fix it?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Which pipeline stages re-run depends on the property changed: geometry like <code>width</code> or <code>top</code> forces layout, then paint, then composite; colors and shadows skip layout and only repaint; and <code>transform</code> and <code>opacity</code> are composite-only on the GPU. Layout thrashing happens when a layout read like <code>offsetHeight</code> is mixed with a style write inside a loop, forcing a synchronous reflow each time. The fix is to batch all reads and then all writes, or schedule writes in <code>requestAnimationFrame</code>. Animating only <code>transform</code> and <code>opacity</code> keeps it cheap.</p></div>
<p>After a style change, the browser re-runs part of the rendering pipeline. How much depends on WHICH property changed:</p>
<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
<tr><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;">Change</th><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;">Pipeline stages re-run</th><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;">Cost</th></tr>
<tr><td style="padding:6px;"><code>width</code>, <code>font-size</code>, <code>top</code>, <code>display</code></td><td style="padding:6px;">Layout (reflow) → Paint → Composite</td><td style="padding:6px;">Expensive — can cascade to the whole tree</td></tr>
<tr><td style="padding:6px;"><code>color</code>, <code>background</code>, <code>box-shadow</code>, <code>visibility</code></td><td style="padding:6px;">Paint → Composite</td><td style="padding:6px;">Medium</td></tr>
<tr><td style="padding:6px;"><code>transform</code>, <code>opacity</code></td><td style="padding:6px;">Composite only (GPU thread)</td><td style="padding:6px;">Cheap — stays 60fps even if main thread is busy</td></tr>
</table>
<p><strong>Layout thrashing</strong>: layout is <em>lazy</em> — the browser batches writes and recalculates only when someone READS a layout value (<code>offsetHeight</code>, <code>getBoundingClientRect()</code>, <code>scrollTop</code>...). Interleaving reads and writes forces a synchronous reflow on every iteration:</p>
<pre>// ✗ THRASHING: read → write → read → write... O(n) forced reflows
boxes.forEach(box => {
  const h = box.offsetHeight;          // READ  → forces layout
  box.style.height = (h * 2) + 'px';   // WRITE → dirties layout
});

// ✓ BATCHED: all reads, then all writes → 1 reflow
const heights = boxes.map(b => b.offsetHeight);   // read phase
boxes.forEach((b, i) => {
  b.style.height = (heights[i] * 2) + 'px';       // write phase
});

// ✓ Or schedule writes for the right frame slot:
requestAnimationFrame(() => { /* writes here, after style/layout reads */ });</pre>
<p><strong>Why animate only transform/opacity?</strong> The element gets its own compositor layer; the GPU just re-blends layers each frame — no layout, no paint, and it keeps running even while the main thread executes JS. Animating <code>left</code> instead of <code>translateX</code> re-lays-out every frame. <code>will-change: transform</code> promotes a layer ahead of time (use sparingly — each layer costs memory).</p>
<div class="key-point">Know your property's pipeline exit: layout properties are the expensive ones, transform/opacity skip straight to the compositor — and never interleave layout reads with style writes in a loop.</div>`,
      },
    ],
  },

  // ───────────────────────── 11. MYBATIS ─────────────────────────
];
