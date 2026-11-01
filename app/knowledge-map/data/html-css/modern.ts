import type { KmNode } from '../../types';

export const modernCss: KmNode = {
  title: 'Modern CSS',
  level: 'advanced',
  summary:
    'Recent CSS features that replace old hacks and preprocessors: variables, :has(), nesting, layers.',
  simple:
    'For years people needed extra tools like Sass to get these powers. Now they are built into every browser.',
  points: [
    'Most of these became "Baseline" (supported in all major browsers) between 2022 and 2024.',
    'They make CSS easier to organize, theme and override.',
    'Check support on caniuse.com or the Baseline badge on MDN.',
  ],
  children: [
    {
      title: 'Custom Properties',
      level: 'intermediate',
      summary: 'CSS variables: define a value once with --name and reuse it with var().',
      simple:
        'Like naming a paint color "brand blue" instead of writing its code everywhere. Change it in one place and every wall updates.',
      points: [
        'Define: <code>--brand: #3366ff;</code> Use: <code>color: var(--brand);</code>.',
        'Fallback: <code>var(--gap, 1rem)</code>.',
        'They cascade and inherit, so a section can override them for its children.',
        'Live at runtime: JavaScript can change them and the page updates.',
        'Unlike Sass variables, which disappear at build time.',
      ],
      detail: `<pre><code>:root { --brand: #3366ff; --radius: 8px; }
.dark { --brand: #8fa8ff; }
.btn  { background: var(--brand); border-radius: var(--radius); }

document.documentElement.style.setProperty('--brand', 'tomato');</code></pre>`,
    },
    {
      title: '@supports',
      level: 'intermediate',
      summary:
        'Feature queries: apply CSS only if the browser supports a property, value or selector.',
      simple:
        'Like asking "do you have a dishwasher?" before leaving the dirty plates. If yes, use it; if not, the plates still get washed by hand.',
      points: [
        'Property check: <code>@supports (display: grid) { ... }</code>.',
        'Selector check: <code>@supports selector(:has(a)) { ... }</code>.',
        'Combine with <code>not</code>, <code>and</code>, <code>or</code>.',
        'Progressive enhancement: a simple base that works everywhere, extras where supported.',
        'Browsers skip declarations they do not understand, so a plain fallback line above often is enough.',
      ],
      detail: `<pre><code>.card { background: #ddd; }

@supports (backdrop-filter: blur(4px)) {
  .card { background: #fff8; backdrop-filter: blur(4px); }
}

CSS.supports('anchor-name: --a'); // same check in JavaScript</code></pre>`,
    },
    {
      title: '@property',
      level: 'advanced',
      summary: 'Registers a custom property with a type, so the browser can animate and check it.',
      simple:
        'A normal variable is a box with any text in it. @property puts a label on the box: "this holds an angle", so the browser knows how to animate it.',
      points: [
        'Set <code>syntax</code> (like <code>"&lt;angle&gt;"</code>), <code>inherits</code> and <code>initial-value</code>.',
        'Lets you animate gradients by animating a typed variable.',
        'Baseline since July 2024.',
      ],
      detail: `<pre><code>@property --angle {
  syntax: "&lt;angle&gt;";
  inherits: false;
  initial-value: 0deg;
}</code></pre>`,
    },
    {
      title: ':is(), :where(), :not()',
      level: 'advanced',
      summary: 'Selector helpers that group options, with different effects on specificity.',
      simple:
        'Shortcuts so you do not repeat yourself: "a heading in an article, a section or an aside" in one line.',
      points: [
        '<code>:is(article, section) h2</code> replaces three separate selectors.',
        '<code>:is()</code> takes the specificity of its most specific argument.',
        '<code>:where()</code> is always zero, perfect for easy-to-override defaults.',
        '<code>:not()</code> accepts a list too: <code>:not(.a, .b)</code>.',
      ],
    },
    {
      title: ':has() Parent Selector',
      level: 'advanced',
      summary: 'Selects an element based on what it contains or what follows it.',
      simple:
        'For years CSS could only look down the family tree. :has() lets a parent react to its children, like a room changing color when someone inside switches on a lamp.',
      points: [
        '<code>.card:has(img)</code>: cards that contain an image.',
        '<code>form:has(:invalid)</code>: style the whole form when any field is wrong.',
        '<code>h2:has(+ p)</code>: an h2 directly followed by a paragraph.',
        'Baseline since December 2023 (Firefox 121 was last).',
        'Removes a lot of "add a class with JavaScript" code.',
      ],
      detail: `<pre><code>.field:has(input:focus-visible) {
  outline: 2px solid royalblue;
}
body:has(dialog[open]) { overflow: hidden; }</code></pre>`,
    },
    {
      title: 'Native Nesting',
      level: 'advanced',
      summary: 'Write rules inside rules, like Sass, directly in plain CSS.',
      simple:
        'Like putting the shirts inside the "wardrobe" folder instead of labelling each one "wardrobe shirt".',
      points: [
        '<code>&amp;</code> means "the parent selector": <code>&amp;:hover</code>, <code>&amp;.active</code>.',
        'Media queries can be nested inside a rule too.',
        'Baseline 2023; the relaxed form (nested tags without <code>&amp;</code>) landed in late 2023.',
        'Nested selectors behave like <code>:is()</code>, which affects specificity.',
      ],
      detail: `<pre><code>.card {
  padding: 1rem;
  &amp;:hover { box-shadow: 0 2px 8px #0003; }
  .title { font-weight: 600; }
  @media (width &gt;= 48rem) { padding: 2rem; }
}</code></pre>`,
      tip: 'Do not nest more than two or three levels. Deep nesting creates long, high-specificity selectors.',
    },
    {
      title: 'Cascade Layers',
      level: 'advanced',
      summary:
        '@layer groups CSS into ordered layers; later layers win no matter how specific earlier ones are.',
      simple:
        'Like stacked transparent sheets: whatever is on the top sheet shows, even if a lower sheet has darker ink.',
      points: [
        'Declare the order once: <code>@layer reset, base, components, utilities;</code>.',
        'Layer order is checked before specificity.',
        'Styles outside any layer beat all layered styles.',
        'Great for taming third-party CSS: put it in a low layer.',
        'All major browsers since 2022.',
      ],
      detail: `<pre><code>@layer reset, base, components, utilities;

@layer components { #nav .btn { color: gray; } }
@layer utilities  { .text-red { color: red; } } /* wins */</code></pre>`,
      tip: '!important flips the layer order: important styles in earlier layers win. Surprising, so avoid !important.',
    },
    {
      title: '@scope',
      level: 'expert',
      summary: 'Limits styles to a part of the DOM, with an optional lower boundary.',
      simple:
        'A fence around a garden: your rules apply inside the fence and can stop at a gate, so they do not leak into the next garden.',
      points: [
        '<code>@scope (.card) to (.content) { img { ... } }</code>: images in the card, but not inside .content.',
        'Proximity: when two scopes match, the closer scope root wins.',
        'Chromium and Safari support it; Firefox shipped it last, in late 2025.',
      ],
    },
  ],
};
