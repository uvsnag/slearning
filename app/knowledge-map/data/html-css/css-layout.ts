import type { KmNode } from '../../types';

export const layout: KmNode = {
  title: 'Layout',
  level: 'intermediate',
  summary:
    'Placing boxes on the page: normal flow, positioning, Flexbox for rows, Grid for two dimensions.',
  simple:
    'Normal flow is books stacked on a shelf. Positioning is sticking a note anywhere you like. Flexbox lines things up in a row; Grid is a chessboard you place pieces on.',
  points: [
    'Start with normal flow; only reach for layout tools when you need them.',
    'Flexbox: one direction (a row or a column). Grid: rows and columns together.',
    'Floats for layout are history; use them only to wrap text around an image.',
  ],
  children: [
    {
      title: 'Positioning',
      level: 'intermediate',
      summary: 'The position property moves a box out of or relative to normal flow.',
      simple:
        'Most boxes sit where they land. position lets you nudge one, pin one to the screen, or float one above the others.',
      points: [
        'Values: <code>static</code> (default), <code>relative</code>, <code>absolute</code>, <code>fixed</code>, <code>sticky</code>.',
        'Move with <code>top</code>, <code>right</code>, <code>bottom</code>, <code>left</code> or the shorthand <code>inset</code>.',
        'Use it for overlays, badges and sticky headers, not for the main layout.',
      ],
      children: [
        {
          title: 'Relative & Absolute',
          level: 'intermediate',
          summary:
            'relative nudges a box and becomes an anchor; absolute places a box against its nearest positioned ancestor.',
          simple:
            'Mark the parent with relative, like pinning a corkboard to the wall. Then absolute children are notes pinned at exact spots on that board.',
          points: [
            '<code>relative</code>: keeps its space in the flow, offsets just shift it visually.',
            '<code>absolute</code>: leaves the flow; others act like it is not there.',
            'It positions against the nearest ancestor that is not <code>static</code>, or the page if none.',
            'Classic badge: parent <code>relative</code>, child <code>absolute; top: 0; right: 0</code>.',
          ],
          detail: `<pre><code>.card  { position: relative; }
.badge { position: absolute; top: 8px; right: 8px; }</code></pre>`,
        },
        {
          title: 'Fixed & Sticky',
          level: 'intermediate',
          summary:
            'fixed pins a box to the screen; sticky acts normal until you scroll past a point, then sticks.',
          simple:
            'fixed is a sticker on your glasses: always in view. sticky is a section title in a phone contact list that stays at the top until the next letter pushes it away.',
          points: [
            '<code>fixed</code>: stays in place relative to the viewport while scrolling.',
            '<code>sticky</code> needs a threshold like <code>top: 0</code> to work.',
            'Sticky stops working if an ancestor has <code>overflow: hidden</code> or <code>auto</code>.',
            'A <code>transform</code> on an ancestor breaks <code>fixed</code>: it becomes relative to that ancestor.',
          ],
        },
        {
          title: 'z-index & Stacking Contexts',
          level: 'advanced',
          summary: 'z-index orders overlapping boxes, but only within the same stacking context.',
          simple:
            'Stacking contexts are folders of papers. You can reorder sheets inside a folder, but a sheet can never jump above a whole folder that sits on top.',
          points: [
            'Higher <code>z-index</code> is on top, but only works on positioned, flex or grid items.',
            'New stacking contexts come from <code>z-index</code> on positioned elements, <code>opacity</code> below 1, <code>transform</code>, <code>filter</code>, and more.',
            "A child with <code>z-index: 9999</code> cannot escape its parent's context.",
            '<code>isolation: isolate</code> creates a context on purpose, keeping z-index local.',
          ],
          tip: 'z-index not working? Look for an ancestor that created a stacking context. Or use dialog/popover, which live in the top layer.',
        },
      ],
    },
    {
      title: 'Flexbox',
      level: 'intermediate',
      summary:
        'A one-direction layout: lines items up in a row or column and shares the free space.',
      simple:
        'Like people on a bench: they sit in a row, you decide how they spread out, and some can squeeze up to make room.',
      points: [
        '<code>display: flex</code> on the parent; its direct children become flex items.',
        'Main axis = <code>flex-direction</code> (row by default). Cross axis = the other one.',
        'Great for nav bars, toolbars, button groups, centering.',
        '<code>gap</code> works in flexbox in all browsers since 2021.',
      ],
      children: [
        {
          title: 'Container Properties',
          level: 'intermediate',
          summary: 'Set direction, wrapping, spacing and alignment on the flex parent.',
          simple:
            'You are the teacher arranging the line: which way it faces, whether it wraps to a second line, and how kids spread out.',
          points: [
            '<code>flex-direction</code>: <code>row</code> or <code>column</code>.',
            '<code>flex-wrap: wrap</code> lets items go to the next line.',
            '<code>justify-content</code>: spacing along the main axis (<code>space-between</code>, <code>center</code>).',
            '<code>align-items</code>: alignment on the cross axis (<code>center</code>, <code>stretch</code>).',
          ],
          detail: `<pre><code>.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}</code></pre>`,
        },
        {
          title: 'flex: grow shrink basis',
          level: 'advanced',
          summary:
            'Per-item rules for how much extra space it takes, how much it gives up, and its starting size.',
          simple:
            'basis is how big you want your slice of cake. grow is how much of the leftovers you take. shrink is how much you give back when cake runs short.',
          points: [
            '<code>flex: 1</code> = grow 1, shrink 1, basis 0%: share space equally.',
            '<code>flex: none</code>: fixed size, never grow or shrink.',
            'Items will not shrink below their content size, because <code>min-width</code> is <code>auto</code>.',
            'Fix overflowing text in a flex item with <code>min-width: 0</code>.',
            '<code>margin-left: auto</code> pushes an item to the far end.',
          ],
          tip: 'The min-width: 0 trick fixes most "my flex item will not shrink / text ellipsis does not work" bugs.',
        },
      ],
    },
    {
      title: 'CSS Grid',
      level: 'intermediate',
      summary: 'A two-dimensional layout: define rows and columns, then place items into cells.',
      simple:
        'Grid is a spreadsheet for your page. You draw the columns and rows first, then drop content into the cells.',
      points: [
        '<code>display: grid</code> plus <code>grid-template-columns</code> and <code>grid-template-rows</code>.',
        '<code>fr</code> unit = a fraction of the free space: <code>1fr 2fr</code>.',
        'Place items by line number: <code>grid-column: 1 / 3</code>, or <code>span 2</code>.',
        'Best for page layouts, galleries, dashboards, anything aligned both ways.',
      ],
      children: [
        {
          title: 'Template Areas',
          level: 'intermediate',
          summary:
            'Name regions of the grid with ASCII-art strings, then put items in them by name.',
          simple:
            'You draw a little map of the page in text, like a floor plan, and tell each room which piece of furniture goes there.',
          points: [
            'Each string is one row; repeat a name to span cells.',
            'A dot <code>.</code> leaves a cell empty.',
            'Change the map in a media query to rearrange the whole page.',
          ],
          detail: `<pre><code>.page {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-areas:
    "header header"
    "side   main"
    "footer footer";
}
.page &gt; header { grid-area: header; }</code></pre>`,
        },
        {
          title: 'auto-fit & minmax',
          level: 'advanced',
          summary: 'repeat(auto-fit, minmax(...)) makes responsive columns with no media queries.',
          simple:
            'Like a parking lot that paints as many spaces as fit, each at least car-sized, and widens them to use leftover space.',
          points: [
            '<code>minmax(200px, 1fr)</code>: never below 200px, share the rest.',
            '<code>auto-fit</code> stretches items to fill empty tracks; <code>auto-fill</code> keeps empty tracks.',
            'Add <code>min(200px, 100%)</code> inside so it never overflows tiny screens.',
          ],
          detail: `<pre><code>.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
  gap: 1rem;
}</code></pre>`,
        },
        {
          title: 'Subgrid',
          level: 'advanced',
          summary:
            "Lets a nested grid reuse its parent grid's tracks so content lines up across cards.",
          simple:
            'Cards in a row each have a title, text and button. Subgrid makes all the buttons line up even when the text lengths differ.',
          points: [
            'Use <code>grid-template-rows: subgrid</code> (or columns) on a grid item.',
            'Baseline in all major browsers since September 2023.',
            'The child spans several parent rows and shares their sizes.',
          ],
        },
        {
          title: 'Grid vs Flexbox',
          level: 'intermediate',
          summary: 'Flexbox is content-first in one direction; Grid is layout-first in two.',
          simple:
            'Flexbox lets the content decide its size, like books on a shelf. Grid decides the slots first, like an egg carton.',
          points: [
            'One row of things with varying sizes: Flexbox.',
            'Items that must align in rows and columns: Grid.',
            'Mix freely: a Grid page with Flexbox inside the header.',
            'Centering works in both: <code>place-items: center</code> on a grid.',
          ],
        },
      ],
    },
    {
      title: 'Centering',
      level: 'intermediate',
      summary: 'The modern, reliable ways to center things horizontally, vertically or both.',
      simple:
        'The old joke is that centering a div is the hardest thing in CSS. Today it takes two lines; you just need to know which tool fits.',
      points: [
        'Text and inline content: <code>text-align: center</code> on the parent.',
        'A block with a width: <code>margin-inline: auto</code>.',
        'Both ways with Grid: <code>display: grid; place-items: center</code>.',
        'Both ways with Flexbox: <code>justify-content: center; align-items: center</code>.',
        'An overlay: <code>position: absolute; inset: 0; margin: auto</code> plus a fixed size.',
      ],
      detail: `<pre><code>.hero {
  display: grid;
  place-items: center;
  min-height: 100dvh;
}</code></pre>`,
    },
    {
      title: 'Anchor Positioning',
      level: 'expert',
      summary:
        'New CSS that places a box (like a tooltip) relative to another element anywhere on the page.',
      simple:
        'A tooltip on a string tied to its button. It follows the button, and flips to the other side if it would fall off the screen.',
      points: [
        'Name an anchor with <code>anchor-name</code>, attach with <code>position-anchor</code>.',
        'Place with the <code>anchor()</code> function or <code>position-area</code>.',
        '<code>position-try-fallbacks</code> flips it when it runs out of room.',
        'Chromium since 2024, Safari since 2025; check current support before relying on it.',
      ],
    },
  ],
};
