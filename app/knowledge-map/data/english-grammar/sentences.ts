import type { KmNode } from '../../types';

export const buildingSentences: KmNode = {
  title: 'Building Sentences',
  level: 'intermediate',
  summary: 'Joining ideas: conjunctions, clauses, conditionals, passive voice and reported speech.',
  simple:
    'Simple sentences are like single statements. Real writing needs control flow: "if", "because", "although". This branch is about composing them.',
  points: [
    'A clause is a mini-sentence with its own subject and verb.',
    'Join clauses with conjunctions, relative pronouns or punctuation.',
    'Short and clear beats long and clever, especially in tech writing.',
  ],
  children: [
    {
      title: 'Conjunctions',
      level: 'beginner',
      summary: 'Linking words: and, but, or, so, because, although, while, unless.',
      simple:
        'They are the boolean and control-flow operators of English: and, or, but, because, unless.',
      points: [
        'Add: <em>and</em>. Contrast: <em>but, although, while</em>. Reason: <em>because, since</em>. Result: <em>so</em>.',
        "<em>unless</em> = if not: <em>It won't start unless you set the env var.</em>",
        '<em>although</em> + clause, <em>despite</em> + noun: <em>despite the error</em>.',
        "Don't pair <em>although</em> with <em>but</em>: ❌ <em>Although it's slow, but it works.</em>",
      ],
    },
    {
      title: 'Clauses & Run-ons',
      level: 'intermediate',
      summary:
        'A main clause can stand alone; joining two main clauses with only a comma is a run-on.',
      simple:
        'Two full sentences glued with just a comma is like two statements without a semicolon — it compiles in your head, not on paper.',
      points: [
        '❌ <em>The build failed, I restarted it.</em> (comma splice)',
        '✅ <em>The build failed, so I restarted it.</em> / <em>The build failed. I restarted it.</em>',
        "Subordinate clause can't stand alone: <em>Because the cache was stale.</em> ← fragment.",
        'One idea per sentence is a great default for docs.',
      ],
    },
    {
      title: 'Which vs That',
      level: 'intermediate',
      summary: '"that" picks out which one (no commas); ", which" adds extra info (with commas).',
      simple:
        '"that" is a filter: it narrows the list. ", which" is a side note: you could delete it and the sentence still works.',
      points: [
        'Filter: <em>Delete the branches that are merged.</em> (only those)',
        'Extra info: <em>Delete the old branch, which is already merged.</em>',
        'US style: <em>that</em> for filters, <em>which</em> with commas. UK is more relaxed.',
        'Use <em>who</em> for people: <em>the dev who</em>, not <em>the dev which</em>.',
      ],
    },
    {
      title: 'Conditionals',
      level: 'intermediate',
      summary: 'If-sentences: real facts, likely futures, imaginary situations and past regrets.',
      simple:
        'English if-statements come in four flavours, depending on how real the condition is.',
      points: [
        'Zero (always true): <em>If the key is missing, the method returns null.</em>',
        "First (likely): <em>If the tests pass, I'll merge it.</em>",
        'Second (imaginary): <em>If we had more time, we would refactor it.</em>',
        "Third (past, didn't happen): <em>If we had tested it, we wouldn't have broken prod.</em>",
        'Never <em>will</em> in the if-part: ❌ <em>If it will fail…</em> ✅ <em>If it fails…</em>',
      ],
      detail: `<pre><code>// Zero conditional = how docs describe code
if (key == null) {
  return null;   // "If the key is null, it returns null."
}</code></pre>`,
    },
    {
      title: 'Passive Voice',
      level: 'intermediate',
      summary: 'be + past participle: the focus moves to what was done, not who did it.',
      simple:
        'Active: "The script deletes the file." Passive: "The file is deleted (by the script)." Same event, different spotlight.',
      points: [
        'Form: <em>is/was/has been</em> + past participle — <em>The bug was fixed.</em>',
        'Good when the doer is unknown or unimportant: <em>The data is encrypted at rest.</em>',
        'Bad when it hides responsibility: <em>Mistakes were made.</em>',
        'Docs prefer active: <em>The server sends a token</em> beats <em>A token is sent by the server</em>.',
      ],
      tip: 'If you can add "by zombies" after the verb and it still makes sense, it\'s passive.',
    },
    {
      title: 'Reported Speech',
      level: 'advanced',
      summary: 'Telling what someone said; the tense often moves one step back.',
      simple:
        'Direct: He said, "It works." Reported: He said (that) it worked. Like logging someone else\'s message.',
      points: [
        '<em>"I\'m busy" → She said she was busy.</em>',
        '<em>"I will fix it" → He said he would fix it.</em>',
        "If it's still true, you can keep the tense: <em>She said the API is down.</em>",
        'Questions become statements: <em>He asked if the build was green.</em> (no question order)',
      ],
    },
  ],
};

export const punctuation: KmNode = {
  title: 'Punctuation',
  level: 'intermediate',
  summary: 'Commas, apostrophes, colons, semicolons, hyphens and dashes — and when to use each.',
  simple:
    'Punctuation is the syntax of writing. A misplaced comma, like a misplaced bracket, can change what the reader runs in their head.',
  points: [
    "Most common errors: comma splices, its/it's, and missing commas after intro words.",
    'When in doubt, split into two sentences.',
  ],
  children: [
    {
      title: 'Commas',
      level: 'intermediate',
      summary:
        'Commas separate list items, intro phrases, extra info and clauses joined by and/but/so.',
      simple: 'A comma is a short pause that tells the reader how to group the words.',
      points: [
        'After intro words: <em>However, it failed. In production, logs are JSON.</em>',
        "Before <em>and/but/so</em> joining two full sentences: <em>It works, but it's slow.</em>",
        'Around extra info: <em>Redis, which is in-memory, is fast.</em>',
        'Not between subject and verb: ❌ <em>The new config file, is missing.</em>',
      ],
    },
    {
      title: 'Oxford Comma',
      level: 'intermediate',
      summary: 'The optional comma before "and" in a list of three or more.',
      simple:
        '"Java, Kotlin, and Scala" vs "Java, Kotlin and Scala". Both are OK; just be consistent.',
      points: [
        'Most US tech style guides (Google, Microsoft) use it.',
        'It prevents confusion: <em>I thanked my mentors, Alice and Bob</em> — are Alice and Bob the mentors?',
        'Pick one style per project and stick to it.',
      ],
    },
    {
      title: 'Apostrophes',
      level: 'beginner',
      summary: "Apostrophes show missing letters (don't) or ownership (user's) — never plurals.",
      simple:
        "Two jobs only: shortening and owning. If you're just making a plural, put the apostrophe down.",
      points: [
        "Short forms: <em>it's = it is, don't = do not, we're = we are</em>.",
        "Ownership: <em>the server's IP</em>.",
        "❌ <em>API's</em> for plural ✅ <em>APIs, URLs, PRs, the 1990s</em>.",
        "Avoid short forms in very formal docs; they're fine in most tech docs and chat.",
      ],
    },
    {
      title: 'Colon & Semicolon',
      level: 'advanced',
      summary: 'Colon introduces what follows; semicolon joins two closely related full sentences.',
      simple: 'Colon = "here it comes:". Semicolon = a soft full stop between two linked thoughts.',
      points: [
        'Colon before a list or explanation: <em>You need three things: Node, npm and Git.</em>',
        'Semicolon: <em>The cache was cold; the first request took 3 seconds.</em>',
        "Semicolon before <em>however/therefore</em>: <em>It works; however, it's slow.</em>",
        "If you're unsure, a full stop is always safe.",
      ],
    },
    {
      title: 'Hyphens & Dashes',
      level: 'advanced',
      summary:
        'Hyphen (-) joins words; en dash (–) shows ranges; em dash (—) adds a break in a sentence.',
      simple: 'Three lines of different lengths with three different jobs.',
      points: [
        'Hyphen: <em>read-only, self-hosted, re-run</em>.',
        'En dash for ranges: <em>pages 10–20, 9:00–17:00</em>.',
        'Em dash for a strong pause: <em>It failed — again.</em>',
        'Google style: no spaces around em dashes; many others add them. Be consistent.',
      ],
    },
    {
      title: 'Quotes & Code',
      level: 'intermediate',
      summary:
        'Use quotes for words as words and UI text; use code formatting for code, names and commands.',
      simple:
        'If someone could type it into a terminal or editor, it belongs in code font, not in quotes.',
      points: [
        'Code font: <code>npm install</code>, <code>getUser()</code>, <code>config.yml</code>.',
        'UI labels: bold or quotes — click <strong>Save</strong>.',
        'US style puts periods inside quotes; but never change code to fit grammar.',
        '✅ Set <code>debug</code> to <code>true</code>. (not <em>"true."</em>)',
      ],
    },
  ],
};
