import type { KmNode } from '../../types';

export const rendering: KmNode = {
  title: 'Rendering & Performance',
  level: 'expert',
  summary: 'How the browser turns HTML and CSS into pixels, and how to keep that fast.',
  simple:
    'Like a print shop: read the order (parse), plan the page (layout), ink it (paint), then stack the printed sheets (composite). Changing early steps means redoing all later ones.',
  points: [
    'Pipeline: parse, style, layout, paint, composite.',
    'Fast pages avoid redoing expensive steps, especially layout.',
    'Measure with DevTools Performance panel and Core Web Vitals.',
  ],
  children: [
    {
      title: 'Critical Rendering Path',
      level: 'advanced',
      summary: 'The steps from receiving HTML to the first pixels on screen.',
      simple:
        'Everything the chef must do before the first plate leaves the kitchen. Anything that makes the chef wait delays the meal.',
      points: [
        'HTML is parsed into the DOM, CSS into the CSSOM (the style tree).',
        'DOM plus CSSOM make the render tree: only visible boxes with their styles.',
        'Then layout (sizes and positions), paint (pixels) and composite (layers to screen).',
        'CSS is render-blocking: nothing shows until the CSS in the head has loaded.',
      ],
    },
    {
      title: 'Render-blocking Resources',
      level: 'advanced',
      summary: 'CSS and classic scripts pause the first paint; load them smartly.',
      simple:
        'A traffic light on the road to the first paint. Remove the ones you do not need, and make the rest turn green faster.',
      points: [
        'Classic <code>&lt;script&gt;</code> stops HTML parsing. Use <code>defer</code> or <code>type="module"</code>.',
        'Inline small critical CSS; load the rest normally.',
        '<code>media="print"</code> on a stylesheet makes it non-blocking for screens.',
        '<code>&lt;link rel="preload"&gt;</code> fetches important fonts and hero images early.',
        'Hint the main image with <code>fetchpriority="high"</code>.',
      ],
      detail: `<pre><code>&lt;link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin&gt;
&lt;link rel="stylesheet" href="/app.css"&gt;
&lt;script src="/app.js" defer&gt;&lt;/script&gt;</code></pre>`,
    },
    {
      title: 'Reflow & Repaint',
      level: 'expert',
      summary: 'Reflow recalculates layout; repaint redraws pixels. Reflow is the expensive one.',
      simple:
        'Reflow is rearranging all the furniture because one sofa got bigger. Repaint is just changing a cushion cover.',
      points: [
        'Layout changes (width, top, font-size, adding nodes) trigger reflow, then repaint.',
        'Visual-only changes (color, background, shadow) trigger repaint only.',
        'Reflow can spread to parents, siblings and children.',
        'Batch DOM changes; avoid many small style edits in a loop.',
      ],
    },
    {
      title: 'Layout Thrashing',
      level: 'expert',
      summary:
        'Reading layout values right after writing styles forces the browser to reflow again and again.',
      simple:
        'Asking "how tall is it now?" after every single brick you lay. The builder has to stop and measure each time.',
      points: [
        'Reads like <code>offsetHeight</code> or <code>getBoundingClientRect()</code> force a synchronous layout.',
        'Alternating write, read, write, read in a loop = many reflows.',
        'Fix: do all reads first, then all writes.',
        'Use <code>requestAnimationFrame</code> to schedule visual writes.',
      ],
      detail: `<pre><code>// Bad: forces layout on every loop
items.forEach((el) =&gt; {
  el.style.width = box.offsetWidth + 'px';
});

// Good: read once, then write
const w = box.offsetWidth;
items.forEach((el) =&gt; { el.style.width = w + 'px'; });</code></pre>`,
    },
    {
      title: 'Compositing & GPU Layers',
      level: 'expert',
      summary: 'Some boxes get their own layer so the GPU can move them without layout or paint.',
      simple:
        'Like animation cels: the character is drawn on its own clear sheet, so you slide the sheet instead of redrawing the whole scene.',
      points: [
        '<code>transform</code> and <code>opacity</code> can animate on the compositor thread alone.',
        'That keeps animations smooth even when JavaScript is busy.',
        'Animating <code>top</code>, <code>width</code> or <code>margin</code> causes layout every frame.',
        '<code>will-change: transform</code> hints a layer ahead of time; each layer costs GPU memory.',
      ],
      tip: 'Interview line: "animate transform and opacity only; they skip layout and paint."',
    },
    {
      title: 'Containment & content-visibility',
      level: 'expert',
      summary: 'Tell the browser a box is independent, so it can skip work for it.',
      simple:
        'Putting walls between rooms: a mess in one room no longer means cleaning the whole house.',
      points: [
        '<code>contain: layout paint</code>: changes inside do not affect outside layout.',
        '<code>content-visibility: auto</code> skips rendering of off-screen sections until needed.',
        'Pair it with <code>contain-intrinsic-size</code> to keep the scrollbar steady.',
        '<code>content-visibility</code> works in all major browsers since September 2024 (Safari 18 was last).',
      ],
    },
    {
      title: 'Core Web Vitals',
      level: 'advanced',
      summary: "Google's three user-focused speed metrics: LCP, INP and CLS.",
      simple:
        'Three questions a user feels: how fast did the main thing show up, how fast did it respond when I tapped, and did things jump around?',
      points: [
        'LCP (Largest Contentful Paint): main content visible, good at 2.5s or less.',
        'INP (Interaction to Next Paint): response to taps, good at 200ms or less. Replaced FID in March 2024.',
        'CLS (Cumulative Layout Shift): visual jumping, good at 0.1 or less.',
        'Fix CLS with image sizes, reserved space for ads, and <code>font-display</code> plus fallback font metrics.',
      ],
      tip: 'Lab tools (Lighthouse) are hints; real-user data (CrUX, field data) is what counts for ranking.',
    },
  ],
};
