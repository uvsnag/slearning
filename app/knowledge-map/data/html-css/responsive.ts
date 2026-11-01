import type { KmNode } from '../../types';

export const responsive: KmNode = {
  title: 'Responsive Design',
  level: 'intermediate',
  summary: 'Making one page look good on phones, tablets and big screens.',
  simple:
    'Water takes the shape of its glass. A responsive page takes the shape of whatever screen it is poured into.',
  points: [
    'Start with the viewport meta tag and flexible layouts.',
    'Use media queries for page-level changes, container queries for components.',
    'Fluid units and clamp() reduce how many breakpoints you need.',
  ],
  children: [
    {
      title: 'Mobile-first',
      level: 'beginner',
      summary: 'Write styles for small screens first, then add more for bigger screens.',
      simple:
        'Pack a small suitcase first with only what you need. When you get a bigger one, you add extras, never the other way round.',
      points: [
        'Base CSS = phone layout, usually one column.',
        'Add <code>min-width</code> media queries to enhance for larger screens.',
        'Simpler CSS and faster phones, which are most of the traffic.',
        'Pick breakpoints where your content breaks, not for specific devices.',
      ],
    },
    {
      title: 'Media Queries',
      level: 'intermediate',
      summary: 'Apply CSS only when the screen or user settings match a condition.',
      simple: 'An "if" statement for styles: if the screen is at least this wide, use these rules.',
      points: [
        'Width: <code>@media (min-width: 48rem)</code>.',
        'Newer range syntax: <code>@media (width &gt;= 48rem)</code> (all browsers since 2023).',
        'User preferences: <code>prefers-color-scheme</code>, <code>prefers-reduced-motion</code>.',
        'Input type: <code>(hover: hover)</code> and <code>(pointer: coarse)</code> for touch screens.',
      ],
      detail: `<pre><code>.grid { display: grid; gap: 1rem; }

@media (width &gt;= 48rem) {
  .grid { grid-template-columns: 1fr 1fr; }
}</code></pre>`,
    },
    {
      title: 'Viewport Units',
      level: 'intermediate',
      summary:
        'vw and vh are percents of the screen; dvh, svh and lvh fix mobile browser bar jumps.',
      simple:
        'On phones the address bar slides in and out, so the screen height keeps changing. The new units let you pick which height you mean.',
      points: [
        '<code>100vh</code> on mobile can be taller than what you see, hiding the bottom.',
        '<code>svh</code>: small (bars shown). <code>lvh</code>: large (bars hidden). <code>dvh</code>: dynamic, follows changes.',
        'All three are in major browsers since late 2022.',
        '<code>100vw</code> includes the scrollbar, which can cause a horizontal scroll.',
      ],
    },
    {
      title: 'Responsive Images',
      level: 'intermediate',
      summary: 'Serve smaller files to small screens and keep images from overflowing.',
      simple:
        'Do not send a poster-sized photo to a phone. Send the size that fits, like ordering a small pizza for one person.',
      points: [
        'Basic safety: <code>img { max-width: 100%; height: auto; }</code>.',
        '<code>srcset="a-400.jpg 400w, a-800.jpg 800w"</code> lists sizes; <code>sizes</code> says the display width.',
        'Use <code>&lt;picture&gt;</code> for different crops (art direction) or formats.',
        'Keep <code>width</code>/<code>height</code> attributes to avoid layout shift.',
      ],
    },
    {
      title: 'Container Queries',
      level: 'advanced',
      summary: "Style a component based on its container's size instead of the whole screen.",
      simple:
        'A plant that grows to fit its pot, not the size of the room. The same card looks right in a narrow sidebar and a wide main column.',
      points: [
        'Mark the parent: <code>container-type: inline-size</code>.',
        'Query it: <code>@container (width &gt; 400px) { ... }</code>.',
        "Units like <code>cqi</code> = 1% of the container's inline size.",
        'Size queries are in all major browsers since February 2023.',
      ],
      detail: `<pre><code>.card-wrap { container-type: inline-size; }

@container (width &gt; 400px) {
  .card { display: flex; gap: 1rem; }
}</code></pre>`,
      tip: 'Media queries for the page layout, container queries for reusable components.',
    },
    {
      title: 'Fluid Sizing with clamp()',
      level: 'advanced',
      summary:
        'clamp(min, preferred, max) lets sizes scale smoothly between a floor and a ceiling.',
      simple:
        'A thermostat with limits: the temperature follows the weather, but never goes below 18 or above 24 degrees.',
      points: [
        'Fluid type: <code>font-size: clamp(1rem, 0.8rem + 1vw, 1.5rem)</code>.',
        'Mix rem into the middle value so text zoom still works.',
        'Works for spacing too: <code>padding: clamp(1rem, 4vw, 3rem)</code>.',
        'Supported everywhere since 2020.',
      ],
    },
  ],
};
