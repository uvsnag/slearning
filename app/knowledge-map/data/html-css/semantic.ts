import type { KmNode } from '../../types';

export const semanticHtml: KmNode = {
  title: 'Semantic HTML',
  level: 'beginner',
  summary: 'Using the tag that matches what the content means, not just how it looks.',
  simple:
    'Labelling moving boxes "kitchen" and "books" instead of "box 1" and "box 2". Everyone (browsers, screen readers, Google) knows what is inside.',
  points: [
    'Semantic means "has meaning": <code>&lt;nav&gt;</code> says navigation, <code>&lt;div&gt;</code> says nothing.',
    'Gives you free accessibility, better SEO and easier-to-read code.',
    'Rule: reach for a meaningful element first, a <code>&lt;div&gt;</code> only when none fits.',
  ],
  children: [
    {
      title: 'Page Landmarks',
      level: 'beginner',
      summary: 'Elements like header, nav, main and footer that mark the big regions of a page.',
      simple:
        'Landmarks are the signs in a shopping mall: "Entrance", "Food court", "Exit". Screen reader users jump straight to the area they want.',
      points: [
        '<code>&lt;header&gt;</code> and <code>&lt;footer&gt;</code>: top and bottom of a page or section.',
        '<code>&lt;nav&gt;</code>: main groups of navigation links.',
        '<code>&lt;main&gt;</code>: the unique main content. Only one visible per page.',
        '<code>&lt;aside&gt;</code>: side content like related links or a sidebar.',
      ],
      detail: `<pre><code>&lt;body&gt;
  &lt;header&gt;Logo + &lt;nav&gt;...&lt;/nav&gt;&lt;/header&gt;
  &lt;main&gt;
    &lt;article&gt;...&lt;/article&gt;
    &lt;aside&gt;Related posts&lt;/aside&gt;
  &lt;/main&gt;
  &lt;footer&gt;Contact info&lt;/footer&gt;
&lt;/body&gt;</code></pre>`,
    },
    {
      title: 'Buttons vs Links',
      level: 'beginner',
      summary: 'Links go somewhere; buttons do something. Pick by behaviour, not by looks.',
      simple:
        'A link is a road sign pointing to another place. A button is a light switch: you press it and something happens right here.',
      points: [
        '<code>&lt;a href&gt;</code> navigates: new page, new URL, download.',
        '<code>&lt;button&gt;</code> acts: submit a form, open a menu, toggle a setting.',
        'Real buttons get keyboard focus, Enter/Space support and a role for free.',
        'A clickable <code>&lt;div&gt;</code> has none of that; you would have to rebuild it all.',
      ],
      tip: 'A button inside a form defaults to type="submit". Set type="button" for buttons that should not submit.',
    },
    {
      title: 'Article vs Section',
      level: 'intermediate',
      summary: 'article is self-contained content; section is a themed part of something bigger.',
      simple:
        'An article is like a newspaper clipping that makes sense on its own. A section is a chapter that only makes sense inside its book.',
      points: [
        '<code>&lt;article&gt;</code>: blog post, product card, comment. Could be shared on its own.',
        '<code>&lt;section&gt;</code>: a group of related content, usually with its own heading.',
        'No heading and no real meaning? Use a <code>&lt;div&gt;</code> instead.',
        'Articles can contain sections, and sections can contain articles.',
      ],
      tip: 'Quick test: would this still make sense in an RSS feed? Then it is an article.',
    },
    {
      title: 'Media Elements',
      level: 'intermediate',
      summary:
        'figure, picture, video and audio give media meaning and let the browser pick the best file.',
      simple:
        'picture is like a menu with sizes: the browser orders the one that fits its screen and appetite best.',
      points: [
        '<code>&lt;figure&gt;</code> plus <code>&lt;figcaption&gt;</code>: an image, chart or code block with a caption.',
        '<code>&lt;picture&gt;</code> with <code>&lt;source&gt;</code> serves modern formats (AVIF, WebP) with a fallback.',
        '<code>srcset</code> and <code>sizes</code> let the browser pick the right resolution.',
        '<code>&lt;video&gt;</code> and <code>&lt;audio&gt;</code> play media natively; add <code>&lt;track&gt;</code> for captions.',
      ],
      detail: `<pre><code>&lt;picture&gt;
  &lt;source srcset="hero.avif" type="image/avif"&gt;
  &lt;source srcset="hero.webp" type="image/webp"&gt;
  &lt;img src="hero.jpg" alt="Team at work" width="1200" height="600"&gt;
&lt;/picture&gt;</code></pre>`,
    },
    {
      title: 'SVG',
      level: 'intermediate',
      summary:
        'A vector image format written as markup, so it stays sharp at any size and CSS can style it.',
      simple:
        'A photo (PNG, JPG) is a mosaic of tiny dots; zoom in and it gets blocky. SVG is a set of drawing instructions, so it redraws crisp at any size.',
      points: [
        'Best for icons, logos and simple charts; use JPG, WebP or AVIF for photos.',
        'As a file: <code>&lt;img src="logo.svg" alt="Acme"&gt;</code>. Simple, cached, but CSS cannot reach inside.',
        'Inline <code>&lt;svg&gt;</code> in the HTML: CSS and JavaScript can change colors and animate parts.',
        'Use <code>fill="currentColor"</code> so an icon takes the text color.',
        'Decorative inline icons need <code>aria-hidden="true"</code>; meaningful ones need a <code>&lt;title&gt;</code> or label.',
      ],
      detail: `<pre><code>&lt;button&gt;
  &lt;svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"&gt;
    &lt;circle cx="8" cy="8" r="6" fill="currentColor" /&gt;
  &lt;/svg&gt;
  Record
&lt;/button&gt;</code></pre>`,
    },
    {
      title: 'Built-in Interactive Elements',
      level: 'intermediate',
      summary:
        'details, dialog and popover give you accordions, modals and menus without JavaScript libraries.',
      simple:
        'Like getting furniture already assembled. The browser builds the keyboard handling and focus rules for you.',
      points: [
        '<code>&lt;details&gt;</code>/<code>&lt;summary&gt;</code>: an open/close accordion, no JavaScript needed.',
        '<code>&lt;dialog&gt;</code> with <code>showModal()</code>: a real modal with focus trap and Esc to close (all browsers since 2022).',
        'The <code>popover</code> attribute: menus and tooltips on the top layer (Baseline 2024).',
        'Top layer = a special layer above everything, so no more z-index wars.',
      ],
      detail: `<pre><code>&lt;button popovertarget="menu"&gt;Open menu&lt;/button&gt;
&lt;div id="menu" popover&gt;...links...&lt;/div&gt;

&lt;dialog id="confirm"&gt;Sure? &lt;button&gt;OK&lt;/button&gt;&lt;/dialog&gt;
&lt;script&gt;
  document.querySelector('#confirm').showModal();
&lt;/script&gt;</code></pre>`,
    },
    {
      title: 'Metadata & SEO',
      level: 'intermediate',
      summary: 'Tags in the head that tell search engines and social apps what your page is.',
      simple:
        "The head is your page's business card. Search engines and chat apps read it to show a nice preview.",
      points: [
        '<code>&lt;title&gt;</code> and <code>&lt;meta name="description"&gt;</code> show up in search results.',
        'Open Graph tags (<code>og:title</code>, <code>og:image</code>) control link previews in social apps.',
        '<code>&lt;link rel="canonical"&gt;</code> marks the main URL when content appears on several URLs.',
        'Structured data (JSON-LD) describes products, articles or events for rich results.',
      ],
    },
  ],
};
