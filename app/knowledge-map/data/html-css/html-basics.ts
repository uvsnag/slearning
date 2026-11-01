import type { KmNode } from '../../types';

export const htmlBasics: KmNode = {
  title: 'HTML Basics',
  level: 'beginner',
  summary: 'How a web page is built: a document made of nested elements with tags and attributes.',
  simple:
    'HTML is the skeleton of a page. It says "this is a heading, this is a paragraph, this is a picture". CSS later decides how it all looks.',
  points: [
    'HTML (HyperText Markup Language) describes the structure and meaning of content.',
    'The browser reads the HTML and builds a tree of elements called the DOM.',
    'Learn the document shape, elements, attributes, links, images, lists and tables first.',
  ],
  children: [
    {
      title: 'Document Structure',
      level: 'beginner',
      summary: 'Every page has a doctype, an html element, a head for info and a body for content.',
      simple:
        'Think of a letter: the envelope (doctype) says what kind of letter it is, the header has the address details (head), and the body is the message people actually read.',
      points: [
        '<code>&lt;!DOCTYPE html&gt;</code> tells the browser to use modern standards mode.',
        '<code>&lt;html lang="en"&gt;</code> wraps everything and sets the page language.',
        '<code>&lt;head&gt;</code> holds info about the page: title, charset, CSS links.',
        '<code>&lt;body&gt;</code> holds everything the user sees.',
        'Missing the doctype puts the browser in "quirks mode", an old, buggy layout mode.',
      ],
      detail: `<pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
  &lt;head&gt;
    &lt;meta charset="utf-8"&gt;
    &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;
    &lt;title&gt;My first page&lt;/title&gt;
    &lt;link rel="stylesheet" href="styles.css"&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Hello!&lt;/h1&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>`,
      tip: 'Always add the viewport meta tag, or phones will show a tiny zoomed-out desktop page.',
    },
    {
      title: 'Elements & Attributes',
      level: 'beginner',
      summary: 'An element is a tag pair around content; attributes are extra settings on the tag.',
      simple:
        'An element is a labelled box. The tag is the label ("paragraph"), the content goes inside, and attributes are sticky notes on the box like "id: intro".',
      points: [
        'Most elements have an opening and closing tag: <code>&lt;p&gt;Hi&lt;/p&gt;</code>.',
        'Void elements have no content or closing tag: <code>&lt;img&gt;</code>, <code>&lt;br&gt;</code>, <code>&lt;input&gt;</code>.',
        'Attributes go in the opening tag: <code>&lt;a href="/about"&gt;</code>.',
        'Global attributes work on any element: <code>id</code>, <code>class</code>, <code>lang</code>, <code>hidden</code>, <code>data-*</code>.',
        'Elements nest like boxes in boxes. Close them in the reverse order you opened them.',
      ],
      tip: 'An id must be unique on the page; a class can repeat. Use classes for styling.',
    },
    {
      title: 'Block vs Inline',
      level: 'beginner',
      summary:
        'Block elements start on a new line and fill the width; inline ones flow inside text.',
      simple:
        'Block elements are like paragraphs in a book, each on its own row. Inline elements are like bold words inside a sentence.',
      points: [
        'Block by default: <code>&lt;div&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;h1&gt;</code>, <code>&lt;ul&gt;</code>, <code>&lt;section&gt;</code>.',
        'Inline by default: <code>&lt;span&gt;</code>, <code>&lt;a&gt;</code>, <code>&lt;strong&gt;</code>, <code>&lt;img&gt;</code>.',
        '<code>&lt;div&gt;</code> and <code>&lt;span&gt;</code> mean nothing; they are plain wrappers for styling.',
        'CSS <code>display</code> can change how any element behaves.',
      ],
    },
    {
      title: 'Text Content',
      level: 'beginner',
      summary: 'Headings, paragraphs and inline tags give text its structure and meaning.',
      simple:
        'Headings are the chapter titles of your page, paragraphs are the text, and tags like strong are the highlighter pen.',
      points: [
        'Headings <code>&lt;h1&gt;</code> to <code>&lt;h6&gt;</code> form an outline. Do not skip levels.',
        '<code>&lt;strong&gt;</code> means important, <code>&lt;em&gt;</code> means stressed. <code>&lt;b&gt;</code>/<code>&lt;i&gt;</code> are only visual.',
        'Whitespace collapses: many spaces or line breaks show as one space.',
        'Special characters use entities: <code>&amp;lt;</code> for a less-than sign, <code>&amp;amp;</code> for an ampersand.',
      ],
      tip: 'Pick headings by meaning, not size. Make them look smaller or bigger with CSS.',
    },
    {
      title: 'Links & Images',
      level: 'beginner',
      summary: 'Links take you somewhere with href; images show a picture with src and alt.',
      simple:
        'A link is a door to another page. An image is a picture frame, and alt is the caption you read aloud to someone who cannot see it.',
      points: [
        '<code>&lt;a href="..."&gt;</code> can point to a page, a <code>#section</code>, <code>mailto:</code> or <code>tel:</code>.',
        'Opening in a new tab with <code>target="_blank"</code> is now safe by default (implies <code>noopener</code> since ~2021).',
        '<code>alt</code> describes the image; use <code>alt=""</code> for purely decorative images.',
        'Set <code>width</code> and <code>height</code> so the page does not jump while the image loads.',
        '<code>loading="lazy"</code> delays off-screen images (works in all major browsers since 2022).',
      ],
      detail: `<pre><code>&lt;a href="/pricing"&gt;See pricing&lt;/a&gt;

&lt;img src="cat.jpg" alt="Orange cat sleeping on a laptop"
     width="800" height="600" loading="lazy"&gt;</code></pre>`,
    },
    {
      title: 'Lists & Tables',
      level: 'beginner',
      summary: 'Lists group related items; tables show data in rows and columns.',
      simple:
        'A list is your shopping list. A table is a spreadsheet. Use each for exactly that, not for page layout.',
      points: [
        '<code>&lt;ul&gt;</code> for unordered, <code>&lt;ol&gt;</code> for numbered, each item in <code>&lt;li&gt;</code>.',
        'Navigation menus are usually a <code>&lt;ul&gt;</code> of links.',
        'Tables use <code>&lt;thead&gt;</code>, <code>&lt;tbody&gt;</code>, <code>&lt;tr&gt;</code>, <code>&lt;th&gt;</code> and <code>&lt;td&gt;</code>.',
        'Add <code>scope="col"</code> on header cells and a <code>&lt;caption&gt;</code> to help screen readers.',
        'Never use tables for page layout. That was a 1990s trick; use CSS Grid now.',
      ],
    },
    {
      title: 'The DOM',
      level: 'intermediate',
      summary:
        'The live tree of objects the browser builds from your HTML, which JavaScript can change.',
      simple:
        'HTML is the blueprint; the DOM is the actual house built from it. JavaScript can move walls in the house without touching the blueprint.',
      points: [
        'DOM = Document Object Model: every element becomes a node in a tree.',
        'The browser fixes broken HTML while parsing, so the DOM may differ from your source.',
        'JavaScript reads and changes the DOM; the page updates on screen.',
        'DevTools "Elements" panel shows the DOM, not your original file.',
      ],
      detail: `<pre><code>const btn = document.querySelector('#save');
btn.textContent = 'Saved!';
btn.classList.add('done');</code></pre>`,
    },
    {
      title: 'Scripts: async & defer',
      level: 'intermediate',
      summary:
        'How you add a script tag decides whether it blocks the page while it loads and runs.',
      simple:
        'A plain script is a guest who makes everyone stop reading until they finish talking. defer says "wait your turn until the page is ready"; async says "talk whenever you arrive".',
      points: [
        'Plain <code>&lt;script src&gt;</code>: HTML parsing stops until the file downloads and runs.',
        '<code>defer</code>: downloads in the background, runs in order after the HTML is parsed.',
        '<code>async</code>: downloads in the background, runs as soon as it arrives, in any order.',
        '<code>type="module"</code> scripts are deferred by default.',
        'Use <code>defer</code> for your app code, <code>async</code> for independent scripts like analytics.',
      ],
      detail: `<pre><code>&lt;head&gt;
  &lt;script src="/app.js" defer&gt;&lt;/script&gt;
  &lt;script src="https://example.com/analytics.js" async&gt;&lt;/script&gt;
&lt;/head&gt;</code></pre>`,
      tip: 'Classic interview question. Short answer: defer keeps order and waits for the HTML; async does neither.',
    },
  ],
};
