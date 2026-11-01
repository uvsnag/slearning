import type { KmNode } from '../../types';

export const cssArchitecture: KmNode = {
  title: 'CSS Architecture',
  level: 'advanced',
  summary: 'Ways to organize CSS so a big project stays easy to change without breaking things.',
  simple:
    'One drawer of socks is easy. A whole warehouse needs labels, rules and sections, or nobody finds anything and everyone is scared to move a box.',
  points: [
    'The big problem: CSS is global, so any rule can affect any page.',
    'Strategies: naming conventions (BEM), utility classes, scoped styles, layers.',
    'Pick one approach per project and stick to it.',
  ],
  children: [
    {
      title: 'Resets & Base Styles',
      level: 'intermediate',
      summary: 'A small sheet that evens out browser defaults before your own styles.',
      simple:
        'Like wiping the whiteboard before you start drawing, so leftover marks from the browser do not surprise you.',
      points: [
        'Browsers ship default styles (margins on body, list bullets, heading sizes).',
        'Modern resets are tiny: <code>box-sizing</code>, <code>margin: 0</code>, responsive media, <code>font: inherit</code> on inputs.',
        'Normalize-style sheets keep useful defaults but make them consistent.',
        'Put it in the lowest cascade layer.',
      ],
    },
    {
      title: 'BEM',
      level: 'intermediate',
      summary:
        'A naming convention: Block, Element, Modifier, written as block__element--modifier.',
      simple:
        'Like full names: "car__wheel--front" tells you exactly what part of what thing, and in which variation. No guessing, no clashes.',
      points: [
        'Block: a standalone component, <code>.card</code>.',
        'Element: a part of it, <code>.card__title</code>.',
        'Modifier: a variation, <code>.card--featured</code>.',
        'Every selector is one class, so specificity stays flat and low.',
      ],
      detail: `<pre><code>&lt;article class="card card--featured"&gt;
  &lt;h2 class="card__title"&gt;Hello&lt;/h2&gt;
  &lt;button class="card__btn card__btn--primary"&gt;Buy&lt;/button&gt;
&lt;/article&gt;</code></pre>`,
    },
    {
      title: 'Sass & PostCSS',
      level: 'intermediate',
      summary:
        'Build tools that process your CSS: Sass adds extra syntax, PostCSS transforms CSS with plugins.',
      simple:
        'Sass is a smarter notebook you write in, then copy out neatly as normal CSS. PostCSS is a proofreader that fixes and polishes the copy for every browser.',
      points: [
        'Sass (<code>.scss</code> files) adds variables, nesting, mixins and loops, then compiles to plain CSS.',
        'Native CSS now has variables and nesting, so many new projects skip Sass.',
        'PostCSS runs plugins: Autoprefixer adds vendor prefixes, others add new syntax for older browsers.',
        'Tailwind and most build tools (Vite, Next.js) use PostCSS or a similar tool behind the scenes.',
        'Lightning CSS is a newer, faster tool doing the same jobs.',
      ],
      tip: 'Sass variables vanish at build time; CSS custom properties stay live in the browser. Know the difference for interviews.',
    },
    {
      title: 'Utility-first CSS',
      level: 'intermediate',
      summary:
        'Small single-purpose classes (like flex, p-4) composed in HTML; Tailwind CSS is the popular example.',
      simple:
        'Instead of buying a ready-made outfit for each occasion, you own basic pieces (a shirt, jeans, a jacket) and combine them as needed.',
      points: [
        'One class, one job: <code>p-4</code> = padding, <code>text-center</code>, <code>flex</code>.',
        'You rarely write new CSS, and the CSS file stops growing.',
        'The build removes unused classes, so the final file is small.',
        'Downside: long class lists. Fix with components in your framework.',
      ],
      detail: `<pre><code>&lt;button class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"&gt;
  Save
&lt;/button&gt;</code></pre>`,
      tip: 'Utility CSS works best with a component framework (React, Vue), where you reuse the component, not the class list.',
    },
    {
      title: 'Scoped & CSS-in-JS',
      level: 'advanced',
      summary:
        'Tools that tie styles to one component automatically: CSS Modules, Vue scoped styles, styled-components.',
      simple:
        'Each component gets its own locked closet. Even if two closets have a shirt called "title", they never get mixed up.',
      points: [
        'CSS Modules rename classes at build time: <code>.title</code> becomes <code>.title_x7a2</code>.',
        'CSS-in-JS writes styles in JavaScript; runtime versions add cost on every render.',
        'Trend since around 2023: zero-runtime tools that output plain CSS files.',
        'Native <code>@scope</code> and Shadow DOM offer scoping without tooling.',
      ],
    },
    {
      title: 'Web Components',
      level: 'advanced',
      summary:
        'Browser-native custom elements with their own tag name, and Shadow DOM to keep their styles private.',
      simple:
        'Like inventing your own HTML tag, such as <user-card>, that works in any page or framework. Shadow DOM is a glass box around it, so outside CSS cannot mess up its insides.',
      points: [
        'Custom element: a JavaScript class registered with <code>customElements.define()</code>; the name needs a dash.',
        'Shadow DOM: a hidden inner tree; its styles do not leak out and page styles do not leak in.',
        'Inherited properties (color, font) and CSS variables still pass through, which is how you theme them.',
        '<code>&lt;slot&gt;</code> shows the content the user put between your tags; <code>::part()</code> styles exposed parts.',
        'Work in every framework, so design systems use them to share components.',
      ],
      detail: `<pre><code>class HelloBadge extends HTMLElement {
  connectedCallback() {
    const root = this.attachShadow({ mode: 'open' });
    root.innerHTML = '&lt;style&gt;b { color: teal; }&lt;/style&gt;&lt;b&gt;&lt;slot&gt;&lt;/slot&gt;&lt;/b&gt;';
  }
}
customElements.define('hello-badge', HelloBadge);

// &lt;hello-badge&gt;Hi!&lt;/hello-badge&gt;</code></pre>`,
    },
    {
      title: 'Design Tokens',
      level: 'advanced',
      summary:
        'Named design decisions (colors, spacing, fonts) stored once and shared across code and design.',
      simple:
        'A shared recipe book for the whole team. Designers and developers both say "space-4" and mean exactly the same thing.',
      points: [
        'Usually exposed as custom properties: <code>--space-4</code>, <code>--color-danger</code>.',
        'Two tiers: raw values (<code>--blue-600</code>) and meaning (<code>--color-primary</code>).',
        'Theming = swapping the meaning tier, not editing components.',
        'Can be generated from one source for web, iOS and Android.',
      ],
    },
  ],
};
