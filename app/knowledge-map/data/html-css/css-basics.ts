import type { KmNode } from '../../types';

export const cssBasics: KmNode = {
  title: 'CSS Basics',
  level: 'beginner',
  summary:
    'How CSS picks elements and decides which style wins: selectors, cascade, specificity, inheritance.',
  simple:
    'If HTML is the skeleton, CSS is the clothes and makeup. Rules say "all buttons wear blue", and the cascade settles arguments when two rules disagree.',
  points: [
    'CSS (Cascading Style Sheets) is a list of rules: selector + declarations.',
    'Many rules can hit the same element; the cascade decides the winner.',
    'Master selectors and specificity early. Most "my CSS does not work" bugs live here.',
  ],
  children: [
    {
      title: 'Rules & Adding CSS',
      level: 'beginner',
      summary:
        'A rule is a selector plus property: value pairs; load CSS with a link tag in the head.',
      simple:
        'A rule is an instruction like "all paragraphs: font size 18". The selector is who, the declarations are what.',
      points: [
        'Syntax: <code>selector { property: value; }</code>.',
        'External file via <code>&lt;link rel="stylesheet"&gt;</code>: best, cached and reusable.',
        '<code>&lt;style&gt;</code> in the head: fine for small or critical CSS.',
        'Inline <code>style="..."</code>: hard to override and reuse, avoid for normal styling.',
      ],
      detail: `<pre><code>/* selector   declarations */
p.intro {
  color: #333;       /* property: value */
  font-size: 1.125rem;
}</code></pre>`,
    },
    {
      title: 'Selectors',
      level: 'beginner',
      summary:
        'Patterns that pick which elements a rule applies to: by tag, class, id, attribute or position.',
      simple:
        'Selectors are like addressing a crowd: "everyone" (*), "all teachers" (tag), "people in red shirts" (class), "Anna" (id).',
      points: [
        'Basic: <code>p</code>, <code>.card</code>, <code>#main</code>, <code>*</code>, <code>[type="email"]</code>.',
        'Combinators: <code>.a .b</code> (descendant), <code>.a &gt; .b</code> (direct child), <code>.a + .b</code> (next sibling), <code>.a ~ .b</code> (any later sibling).',
        'Group with a comma: <code>h1, h2 { ... }</code>.',
        'Mostly use classes. Avoid styling by id; it is hard to override.',
      ],
    },
    {
      title: 'Pseudo-classes & Elements',
      level: 'intermediate',
      summary: 'Pseudo-classes select a state (:hover); pseudo-elements style a part (::before).',
      simple:
        'Pseudo-classes are moods ("when hovered", "when it is the first one"). Pseudo-elements are invisible extra pieces you can decorate, like a sticker before the text.',
      points: [
        'States: <code>:hover</code>, <code>:focus-visible</code>, <code>:checked</code>, <code>:disabled</code>.',
        'Position: <code>:first-child</code>, <code>:nth-child(2n)</code>, <code>:last-of-type</code>.',
        'Logic: <code>:not()</code>, <code>:is()</code>, <code>:where()</code>, <code>:has()</code>.',
        'Pseudo-elements use two colons: <code>::before</code>, <code>::after</code>, <code>::placeholder</code>, <code>::marker</code>.',
        '<code>::before</code>/<code>::after</code> need a <code>content</code> property to appear.',
      ],
      detail: `<pre><code>li:nth-child(odd) { background: #f5f5f5; }
a:hover { text-decoration: underline; }
.required::after { content: " *"; color: red; }</code></pre>`,
    },
    {
      title: 'The Cascade',
      level: 'intermediate',
      summary:
        'The algorithm that picks one winning value when several rules set the same property.',
      simple:
        'Like deciding who gets the last cookie: first by rank (origin and !important), then by how specific the claim is, and if still tied, whoever asked last wins.',
      points: [
        'Order of checks: origin and importance, then cascade layers, then specificity, then source order.',
        'Origins: browser defaults, then your styles; user styles also exist.',
        'Same specificity? The rule that comes later in the CSS wins.',
        '<code>!important</code> jumps the queue. Use it only as a last resort.',
      ],
      tip: 'In DevTools, crossed-out declarations in the Styles panel show which rules lost the cascade.',
    },
    {
      title: 'Specificity',
      level: 'intermediate',
      summary:
        'A score (ids, classes, tags) that decides which selector is more specific and wins.',
      simple:
        'Think of it as a three-digit score: ids are hundreds, classes are tens, tags are ones. Higher score wins, no matter where it is in the file.',
      points: [
        'Count as (ids, classes/attributes/pseudo-classes, tags/pseudo-elements).',
        '<code>#nav a</code> = (1,0,1) beats <code>.menu .link</code> = (0,2,0).',
        'Inline styles beat all selectors; <code>!important</code> beats inline.',
        '<code>:is()</code> and <code>:not()</code> take their most specific argument; <code>:where()</code> always counts zero.',
        '<code>*</code> and combinators add nothing.',
      ],
      detail: `<pre><code>.btn          { color: gray; }  /* (0,1,0) */
nav .btn      { color: blue; }  /* (0,1,1) wins */
:where(nav) .btn { color: red; } /* (0,1,0) */</code></pre>`,
      tip: 'Keep specificity low and flat (one class per selector). Then overriding is easy and you never need !important.',
    },
    {
      title: 'Inheritance',
      level: 'intermediate',
      summary: 'Some properties (mostly text ones) pass from parent to child automatically.',
      simple:
        'Like a family accent: kids pick up how their parents talk (font, color), but not their height (width, border).',
      points: [
        'Inherited: <code>color</code>, <code>font-*</code>, <code>line-height</code>, <code>text-align</code>, <code>visibility</code>.',
        'Not inherited: <code>margin</code>, <code>padding</code>, <code>border</code>, <code>background</code>, <code>width</code>.',
        'Force it with <code>inherit</code>; reset with <code>initial</code>, <code>unset</code> or <code>revert</code>.',
        'Form controls do not inherit fonts by default; add <code>font: inherit</code> to them.',
      ],
    },
    {
      title: 'Units & Values',
      level: 'beginner',
      summary:
        'Lengths can be absolute (px) or relative (rem, em, %, vw); colors and math functions too.',
      simple:
        'px is like centimetres on a ruler. rem is "times the base font size", so everything grows together when the user picks bigger text.',
      points: [
        '<code>px</code>: fixed. <code>rem</code>: relative to the root font size (16px by default).',
        "<code>em</code>: relative to the element's own font size; it compounds when nested.",
        '<code>%</code>: relative to the parent. <code>vw</code>/<code>vh</code>: percent of the viewport.',
        'Math: <code>calc(100% - 2rem)</code>, <code>min()</code>, <code>max()</code>, <code>clamp()</code>.',
      ],
      tip: "Use rem for font sizes so the user's browser text-size setting still works.",
    },
  ],
};
