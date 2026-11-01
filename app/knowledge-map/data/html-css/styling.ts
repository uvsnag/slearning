import type { KmNode } from '../../types';

export const visualStyling: KmNode = {
  title: 'Typography, Color & Motion',
  level: 'intermediate',
  summary:
    'Making a page readable and alive: fonts, text, colors, backgrounds, transitions and animations.',
  simple:
    'Layout is where the furniture goes. This branch is the paint, the lighting and the doors that open smoothly.',
  points: [
    'Good typography is most of good design: size, line height, line length.',
    'Modern color spaces and functions make palettes and themes easier.',
    'Animate only cheap properties, and respect users who want less motion.',
  ],
  children: [
    {
      title: 'Fonts & Web Fonts',
      level: 'beginner',
      summary: 'Pick font families with fallbacks and load custom fonts with @font-face.',
      simple:
        'A font stack is a list of backup singers: if the star cannot make it, the next one on the list sings.',
      points: [
        'Always end a stack with a generic: <code>font-family: Inter, system-ui, sans-serif</code>.',
        'Use WOFF2 files; they are the smallest.',
        '<code>font-display: swap</code> shows fallback text right away instead of invisible text.',
        'Variable fonts pack many weights into one file.',
      ],
      detail: `<pre><code>@font-face {
  font-family: "Inter";
  src: url("/fonts/inter.woff2") format("woff2");
  font-weight: 100 900;
  font-display: swap;
}</code></pre>`,
    },
    {
      title: 'Readable Text',
      level: 'beginner',
      summary: 'Comfortable size, line height and line length make text easy to read.',
      simple:
        'Like a good book: not tiny letters, some air between lines, and lines short enough that your eyes find the next one.',
      points: [
        'Body text around 1rem to 1.125rem (16 to 18px).',
        '<code>line-height</code> about 1.5 for body text, unitless so it scales.',
        'Line length about 45 to 75 characters: <code>max-width: 65ch</code>.',
        '<code>text-wrap: balance</code> evens out heading lines (all browsers since 2024).',
        'Truncate with <code>text-overflow: ellipsis</code> plus <code>overflow: hidden; white-space: nowrap</code>.',
      ],
    },
    {
      title: 'Backgrounds & Effects',
      level: 'beginner',
      summary: 'Gradients, images, shadows and rounded corners, all without image files.',
      simple:
        'CSS is your paint kit: color fades (gradients), soft shadows and rounded frames, drawn by the browser instead of Photoshop.',
      points: [
        'Gradients: <code>linear-gradient()</code>, <code>radial-gradient()</code>, <code>conic-gradient()</code>.',
        '<code>background-size: cover</code> fills the box with an image, cropping if needed.',
        '<code>box-shadow</code> for depth, <code>border-radius</code> for rounded corners.',
        '<code>filter</code> and <code>backdrop-filter</code> for blur, grayscale and frosted glass.',
      ],
    },
    {
      title: 'Colors',
      level: 'intermediate',
      summary: 'Write colors as hex, rgb, hsl or modern oklch, and mix them with color-mix().',
      simple:
        'hex and rgb are paint codes for machines. hsl and oklch are how people think: "this blue, a bit lighter, a bit less bright".',
      points: [
        'Formats: <code>#3366ff</code>, <code>rgb(51 102 255 / 50%)</code>, <code>hsl(225 100% 60%)</code>.',
        '<code>oklch()</code>: lightness looks even across hues, great for palettes (Baseline 2023).',
        '<code>color-mix(in oklch, blue 70%, white)</code> makes tints and shades (Baseline 2023).',
        '<code>currentColor</code> reuses the text color for borders and SVG icons.',
      ],
    },
    {
      title: 'Dark Mode',
      level: 'intermediate',
      summary:
        "Follow the user's system theme with prefers-color-scheme, color-scheme and light-dark().",
      simple:
        'Like a room with day and night lighting. Store the colors in variables and just flip the switch.',
      points: [
        '<code>color-scheme: light dark</code> also themes scrollbars and form controls.',
        '<code>@media (prefers-color-scheme: dark)</code> swaps your variables.',
        '<code>light-dark(#fff, #111)</code> picks a value per theme (Baseline 2024).',
        'Do not just invert: dark mode usually needs softer, less saturated colors.',
      ],
    },
    {
      title: 'Transitions',
      level: 'intermediate',
      summary: 'Smoothly animate a property from its old value to its new one when it changes.',
      simple: 'A dimmer switch instead of an on/off switch: the change fades in over a short time.',
      points: [
        '<code>transition: background-color 200ms ease</code>.',
        'Name the properties; avoid <code>transition: all</code>, it animates things you did not expect.',
        '150 to 300ms feels snappy for UI feedback.',
        'Cannot animate to or from <code>height: auto</code> directly; newer <code>interpolate-size</code> fixes this in Chromium.',
      ],
      detail: `<pre><code>.btn {
  transition: transform 150ms ease, background-color 150ms ease;
}
.btn:hover { transform: translateY(-2px); background-color: navy; }</code></pre>`,
    },
    {
      title: 'Transforms & Keyframes',
      level: 'intermediate',
      summary:
        'transform moves, scales and rotates boxes; @keyframes defines multi-step animations.',
      simple:
        'Keyframes are like a flipbook: you draw a few key pages, and the browser fills in the frames between them.',
      points: [
        '<code>transform: translate() scale() rotate()</code> moves things without affecting layout.',
        '<code>@keyframes</code> names the steps; <code>animation</code> plays them.',
        'Options: duration, delay, <code>infinite</code>, <code>alternate</code>, <code>forwards</code>.',
        'Easing: <code>ease-out</code> for things entering, <code>ease-in</code> for leaving.',
      ],
      detail: `<pre><code>@keyframes pulse {
  from { transform: scale(1); }
  to   { transform: scale(1.1); }
}
.dot { animation: pulse 800ms ease-in-out infinite alternate; }</code></pre>`,
    },
    {
      title: 'Reduced Motion',
      level: 'intermediate',
      summary: 'Tone down animations for users who asked their system for less motion.',
      simple:
        'Some people get dizzy from motion, like seasickness. They flip a setting, and your site should listen.',
      points: [
        'Query: <code>@media (prefers-reduced-motion: reduce)</code>.',
        'Replace big slides and parallax with fades or nothing.',
        'Keep small, helpful feedback like color changes.',
      ],
      detail: `<pre><code>@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}</code></pre>`,
    },
    {
      title: 'Scroll & View Transitions',
      level: 'expert',
      summary: 'New APIs: animate by scroll position, and morph smoothly between page states.',
      simple:
        'Scroll-driven animation is a flipbook you control with the scroll wheel. View transitions are a movie cut that smoothly blends one scene into the next.',
      points: [
        '<code>animation-timeline: scroll()</code> or <code>view()</code> ties an animation to scrolling, no JavaScript.',
        'Scroll-driven animations: Chromium since 2023, Safari 26; not yet everywhere.',
        '<code>document.startViewTransition()</code> animates DOM changes between two snapshots.',
        'Same-page view transitions reached all major browsers in 2025.',
      ],
      detail: `<pre><code>document.startViewTransition(() =&gt; {
  list.replaceChildren(...sortedItems);
});</code></pre>`,
      tip: 'Treat these as progressive enhancement: the page must still work without the animation.',
    },
  ],
};
