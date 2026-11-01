import type { KmNode } from '../../types';

export const boxModel: KmNode = {
  title: 'Box Model & Display',
  level: 'beginner',
  summary: 'Every element is a rectangle made of content, padding, border and margin.',
  simple:
    'Every element is a framed picture: the picture (content), the matting around it (padding), the frame (border) and the empty wall space to the next frame (margin).',
  points: [
    'Understanding the box explains most spacing and sizing surprises.',
    '<code>display</code> decides how a box behaves with its neighbours.',
    'DevTools shows a box model diagram for every element. Use it.',
  ],
  children: [
    {
      title: 'The Four Layers',
      level: 'beginner',
      summary: 'Content, padding, border, margin, from inside to outside.',
      simple:
        'Like a gift: the gift itself, bubble wrap (padding), the box (border), and the gap you leave between gifts on the table (margin).',
      points: [
        'Padding is inside the border and shows the background color.',
        'Margin is outside the border and is always transparent.',
        'Shorthand order is clockwise from the top: <code>margin: 10px 20px 10px 20px</code>.',
        'Modern logical versions: <code>margin-inline</code>, <code>padding-block</code> (work for right-to-left languages too).',
      ],
    },
    {
      title: 'box-sizing',
      level: 'beginner',
      summary:
        'Decides whether width includes padding and border (border-box) or not (content-box).',
      simple:
        'content-box is like saying "the room is 3 m" and then adding wall thickness on top. border-box means "3 m including the walls", which is what you usually mean.',
      points: [
        'Default <code>content-box</code>: width 200px plus 20px padding = 240px wide.',
        '<code>border-box</code>: stays 200px; the content shrinks instead.',
        'Almost every project sets <code>border-box</code> globally.',
      ],
      detail: `<pre><code>*, *::before, *::after {
  box-sizing: border-box;
}</code></pre>`,
    },
    {
      title: 'Display Types',
      level: 'beginner',
      summary:
        'display sets the outer role (block, inline) and inner layout (flow, flex, grid) of a box.',
      simple:
        'display is the job title of a box: "I take a full row" (block), "I sit in the text" (inline), or "I arrange my children" (flex, grid).',
      points: [
        '<code>block</code>, <code>inline</code>, <code>inline-block</code> (inline but accepts width and height).',
        '<code>flex</code> and <code>grid</code>: the box lays out its children.',
        '<code>none</code>: removes the box completely, no space kept.',
        '<code>contents</code>: the box itself disappears, its children stay.',
        'Inline elements ignore <code>width</code>, <code>height</code> and vertical margins.',
      ],
    },
    {
      title: 'Margin Collapsing',
      level: 'intermediate',
      summary:
        'Vertical margins of touching block elements merge into one, taking the larger value.',
      simple:
        'Two people each want 1 metre of personal space. Standing next to each other, there is 1 metre between them, not 2.',
      points: [
        'Only vertical margins, only in normal block flow.',
        '20px bottom + 30px top = 30px gap, not 50px.',
        'A child\'s top margin can "leak" out through a parent with no padding or border.',
        'Does not happen inside flex or grid containers.',
      ],
      tip: 'Use gap in flex/grid for spacing between items. No collapsing surprises.',
    },
    {
      title: 'Sizing & Overflow',
      level: 'intermediate',
      summary:
        'Control size with width, min/max and aspect-ratio; decide what happens when content spills.',
      simple:
        'A cup with water: max-width is the cup size, and overflow says what happens when you pour too much: spill (visible), cut off (hidden) or add a straw (scroll).',
      points: [
        'Prefer <code>max-width</code> over fixed <code>width</code> so things can shrink.',
        'Intrinsic sizes: <code>min-content</code>, <code>max-content</code>, <code>fit-content</code>.',
        '<code>aspect-ratio: 16 / 9</code> keeps proportions (all browsers since 2021).',
        '<code>overflow</code>: <code>visible</code>, <code>hidden</code>, <code>clip</code>, <code>scroll</code>, <code>auto</code>.',
        '<code>object-fit: cover</code> crops images to fill a box without stretching.',
      ],
    },
    {
      title: 'Floats & BFC',
      level: 'advanced',
      summary:
        'Floats wrap text around a box; a block formatting context (BFC) is a box that keeps floats and margins inside.',
      simple:
        'A float is a photo in a magazine with text flowing around it. A BFC is a sealed container: whatever floats inside stays inside and does not leak out.',
      points: [
        '<code>float: left</code> pulls a box to the side and lets text wrap around it. Use it for that only.',
        'A parent of only floats collapses to zero height; old fix: the "clearfix" hack.',
        'Modern fix: <code>display: flow-root</code> creates a BFC that contains its floats.',
        'Flex items, grid items and <code>overflow</code> other than visible also create a BFC.',
        'Margins do not collapse through a BFC edge.',
      ],
      detail: `<pre><code>.article img { float: left; margin: 0 1rem 1rem 0; }
.article { display: flow-root; } /* wraps the floated image */</code></pre>`,
      tip: 'Interview: "What is a BFC?" An independent layout area; it contains floats and stops margin collapsing.',
    },
  ],
};
