import type { KmNode } from '../../types';

export const accessibility: KmNode = {
  title: 'Accessibility',
  level: 'intermediate',
  summary:
    'Making pages usable for everyone, including people using keyboards, screen readers or zoom.',
  simple:
    'It is like adding ramps and lifts to a building. They help wheelchair users, but also parents with buggies and people carrying boxes.',
  points: [
    'Often shortened to a11y (a + 11 letters + y).',
    'Semantic HTML gives you most of it for free.',
    'Many countries require it by law (e.g. the European Accessibility Act, from June 2025).',
    'The standard is WCAG (Web Content Accessibility Guidelines); current version 2.2, from 2023.',
  ],
  children: [
    {
      title: 'Alt Text & Content',
      level: 'beginner',
      summary: 'Describe images, write clear link text and keep a logical heading order.',
      simple:
        'Pretend you are reading the page aloud over the phone. Whatever you would say about a picture is its alt text.',
      points: [
        'Alt text says what the image means here, not "image of".',
        'Decorative images get <code>alt=""</code> so screen readers skip them.',
        'Link text must make sense alone: "Read the pricing guide", not "click here".',
        'One <code>&lt;h1&gt;</code>, then headings in order. Screen reader users navigate by them.',
      ],
    },
    {
      title: 'Color Contrast',
      level: 'beginner',
      summary:
        'Text must stand out enough from its background, and color must not be the only signal.',
      simple:
        'Light gray text on white is like whispering in a noisy room. Some people simply cannot hear it.',
      points: [
        'WCAG AA: at least 4.5:1 for normal text, 3:1 for large text and UI parts.',
        'Do not use color alone: add an icon or text to red error fields.',
        'DevTools shows the contrast ratio when you inspect a text color.',
        'Respect user settings like zoom up to 200% and Windows contrast themes (<code>forced-colors</code> mode).',
      ],
    },
    {
      title: 'Keyboard & Focus',
      level: 'intermediate',
      summary:
        'Everything must work with just a keyboard, and users must always see where focus is.',
      simple:
        'Imagine your mouse broke. Can you still use the site with Tab, Enter and the arrow keys? If not, some people can never use it.',
      points: [
        'Tab moves through links, buttons and fields in DOM order.',
        'Never remove the focus outline without a visible replacement.',
        '<code>:focus-visible</code> shows a ring for keyboard users but not mouse clicks (all browsers since 2022).',
        '<code>tabindex="0"</code> makes something focusable; avoid positive numbers, they break the order.',
        'Add a "Skip to main content" link as the first focusable item.',
      ],
      detail: `<pre><code>button:focus-visible {
  outline: 3px solid royalblue;
  outline-offset: 2px;
}</code></pre>`,
    },
    {
      title: 'ARIA',
      level: 'advanced',
      summary:
        'Extra attributes that tell assistive tech about roles and states HTML cannot express.',
      simple:
        'ARIA is a sticky note for screen readers: "this div is actually a tab, and it is selected". It changes what is announced, not how anything works.',
      points: [
        'First rule of ARIA: do not use ARIA if a native element does the job.',
        'Roles: <code>role="tab"</code>. States: <code>aria-expanded</code>, <code>aria-selected</code>.',
        'Names: <code>aria-label</code> or <code>aria-labelledby</code> for icon-only buttons.',
        '<code>aria-live="polite"</code> announces updates like "Saved" or new search results.',
        'ARIA adds no keyboard behaviour. You must code that yourself.',
      ],
      detail: `<pre><code>&lt;button aria-expanded="false" aria-controls="faq1"&gt;Shipping?&lt;/button&gt;
&lt;div id="faq1" hidden&gt;We ship in 2 days.&lt;/div&gt;
&lt;p aria-live="polite" id="status"&gt;&lt;/p&gt;</code></pre>`,
      tip: 'Studies keep finding that pages with ARIA have more accessibility errors on average. Bad ARIA is worse than none.',
    },
    {
      title: 'Hiding Content',
      level: 'advanced',
      summary:
        'Different ways to hide things: from everyone, only visually, or only from assistive tech.',
      simple:
        'Like a stage: some props are removed (hidden), some are behind a curtain only the narrator mentions (visually hidden), some are scenery the narrator ignores (aria-hidden).',
      points: [
        '<code>hidden</code> or <code>display: none</code>: gone for everyone.',
        'A "visually-hidden" class: invisible on screen but still read by screen readers.',
        '<code>aria-hidden="true"</code>: visible, but ignored by screen readers (decorative icons).',
        '<code>visibility: hidden</code> and <code>opacity: 0</code> keep the space; <code>opacity: 0</code> stays clickable and is still read aloud.',
        '<code>inert</code> attribute: makes a whole area unclickable and unfocusable (all browsers since 2023).',
      ],
    },
    {
      title: 'Testing Accessibility',
      level: 'advanced',
      summary: 'Mix automated tools with real keyboard and screen reader checks.',
      simple:
        'A spell checker catches typos but not bad writing. Automated tools are the spell checker; manual testing is the proofreader.',
      points: [
        'Automated tools (axe, Lighthouse) catch roughly 30 to 40 percent of issues.',
        'Tab through every page and check focus order and visibility.',
        'Try a screen reader: VoiceOver (Mac), NVDA (Windows), TalkBack (Android).',
        'Check zoom at 200% and a 320px-wide screen (WCAG reflow rule).',
      ],
    },
  ],
};
