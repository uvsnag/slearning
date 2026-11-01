import type { KmNode } from '../../types';

export const techWriting: KmNode = {
  title: 'Technical Writing',
  level: 'intermediate',
  summary:
    'Applying grammar to real work: commit messages, PRs, docs, UI text, emails, chat and meetings.',
  simple:
    "Grammar is the syntax; technical writing is the clean-code style guide on top. The goal is the same: the reader understands fast and doesn't have to guess.",
  points: [
    'Write for a busy reader: the main point first, details after.',
    'Use active voice, present tense and "you".',
    'Short sentences, common words, one idea each.',
  ],
  children: [
    {
      title: 'Plain English',
      level: 'beginner',
      summary:
        'Use short, common words and sentences that anyone — including non-native readers — can follow.',
      simple:
        "Write like you're explaining to a smart friend who just joined the team. If a simpler word works, use it.",
      points: [
        '<em>use</em> not <em>utilize</em>, <em>help</em> not <em>facilitate</em>, <em>start</em> not <em>commence</em>.',
        'Aim for sentences under ~25 words.',
        'Cut filler: <em>in order to</em> → <em>to</em>; <em>at this point in time</em> → <em>now</em>.',
        'Avoid idioms in docs (<em>a piece of cake, ballpark</em>) — they confuse translators and readers.',
      ],
    },
    {
      title: 'Active Voice & "You"',
      level: 'intermediate',
      summary: 'Docs should say who does what, and talk directly to the reader.',
      simple:
        '"The file must be saved by the user" → "Save the file." Shorter, clearer, friendlier.',
      points: [
        'Active: <em>The API returns a 404</em> — not <em>A 404 is returned by the API</em>.',
        'Second person: <em>You can configure…</em> — not <em>The user can configure…</em> or <em>We can configure…</em>.',
        'Present tense: <em>The server sends</em> — not <em>The server will send</em>.',
        'Steps start with a verb: <em>Open the terminal. Run the script.</em>',
      ],
    },
    {
      title: 'Commit Messages',
      level: 'intermediate',
      summary: 'A short imperative subject line, then an optional body explaining why.',
      simple:
        'The subject should finish the sentence "If applied, this commit will…" — "…Fix login redirect".',
      points: [
        'Imperative mood: <em>Add</em>, <em>Fix</em>, <em>Remove</em> — not <em>Added</em> or <em>Fixes</em>.',
        'Subject ~50 chars, capitalized, no final period.',
        'Body: why the change was needed and what it affects, wrapped at ~72 chars.',
        'Conventional Commits style: <em>feat: add dark mode</em>, <em>fix(auth): handle expired token</em>.',
      ],
      detail: `<pre><code>// A commit message, as you'd build it in JS
const message = [
  "Fix timeout when uploading large files",
  "",
  "The proxy closed idle connections after 30s. Stream the",
  "upload in chunks so the connection stays active.",
].join("\\n");</code></pre>`,
      tip: 'Avoid "fix bug", "update", "wip". In six months, nobody (including you) will know what they mean.',
    },
    {
      title: 'PRs & Bug Reports',
      level: 'intermediate',
      summary: 'Say what, why and how to test — or for bugs: steps, expected, actual.',
      simple: 'A good bug report is a reproducible test case written in English.',
      points: [
        'PR: <em>What</em> changed, <em>why</em>, <em>how to test</em>, screenshots if UI.',
        'Bug: <em>Steps to reproduce</em> (numbered, imperative), <em>Expected</em>, <em>Actual</em>, environment.',
        'Past tense for what happened: <em>The page crashed after I clicked Save.</em>',
        'Present for current behavior: <em>The API returns 500 for empty names.</em>',
      ],
    },
    {
      title: 'Emails & Chat',
      level: 'intermediate',
      summary: 'Lead with the point, give context, and end with a clear ask.',
      simple:
        'Don\'t just say "Hi" and wait. Put the greeting, the question and the context in one message.',
      points: [
        '❌ <em>Hi</em> … (5 minutes) … <em>are you there?</em>',
        '✅ <em>Hi Linh, quick question about the deploy: is it OK to merge PR #42 today? Tests are green.</em>',
        'Polite asks: <em>Could you…? Would you mind…ing? When you have a moment…</em>',
        'Close clearly: <em>Thanks! Let me know if anything is unclear.</em>',
      ],
    },
    {
      title: 'Meetings & Stand-ups',
      level: 'intermediate',
      summary:
        'Ready-made phrases for status updates, asking people to repeat, and agreeing or disagreeing politely.',
      simple:
        'Speaking is harder than writing because there is no undo. A few safe phrases are like snippets: ready to use, no thinking needed.',
      points: [
        "Stand-up: <em>Yesterday I worked on…, today I'm going to…, I'm blocked by…</em>",
        "Didn't catch it: <em>Sorry, could you say that again? Could you speak a bit slower?</em>",
        "Check you understood: <em>Just to confirm, you mean…? So, if I understand correctly…</em>",
        "Join in: <em>Can I add something? Sorry to interrupt, but…</em>",
        "Disagree softly: <em>I see your point, but… I'm not sure that will work because…</em>",
        "Wrap up: <em>So the next steps are… I'll follow up by email.</em>",
      ],
      tip: "It's fine to say \"Let me think about it and get back to you.\" A clear answer later beats a confusing one now.",
    },
    {
      title: 'US vs UK English',
      level: 'intermediate',
      summary:
        'The two main spellings and some word and date differences — pick one and stay consistent.',
      simple:
        'Like two code styles that both compile. Neither is wrong, but mixing them in one doc looks messy. Tech usually picks US.',
      points: [
        '-ize/-ise: <em>organize/organise</em>; -or/-our: <em>color/colour, behavior/behaviour</em>.',
        '-er/-re: <em>center/centre</em>; -og/-ogue: <em>catalog/catalogue</em>; <em>gray/grey</em>.',
        '<em>license</em> (US noun and verb) vs <em>licence</em> (UK noun) / <em>license</em> (UK verb).',
        'Words: <em>vacation/holiday, zip code/postcode, check/cheque</em>.',
        'Dates: <em>11/01/2026</em> is Nov 1 (US) but 11 Jan (UK). Use <em>2026-11-01</em> or <em>1 Nov 2026</em> to be safe.',
      ],
      tip: '"Program" is right in both for software; the UK writes "programme" only for TV shows or plans.',
    },
    {
      title: 'Code Review Comments',
      level: 'advanced',
      summary:
        'Be clear about the problem, kind about the person, and explicit about how important it is.',
      simple:
        'Talk about the code, not the coder. "This loop runs twice" — not "You wrote a slow loop."',
      points: [
        'Questions and suggestions soften: <em>What do you think about extracting this?</em>',
        'Label importance: <em>nit:</em> (tiny), <em>suggestion:</em>, <em>blocking:</em>.',
        'Use <em>we</em> for shared ownership: <em>Could we add a test here?</em>',
        'Explain why: <em>This can throw NPE when the list is empty.</em>',
        'Praise good work too: <em>Nice, this is much easier to read.</em>',
      ],
    },
    {
      title: 'UI & Microcopy',
      level: 'advanced',
      summary: 'Buttons, labels and error texts: short, consistent, and action-focused.',
      simple:
        'UI text is the app talking to the user. Every word costs attention, so make each one count.',
      points: [
        'Buttons use verbs: <em>Save changes</em>, <em>Delete project</em> — not <em>OK</em> or <em>Yes</em>.',
        'Pick a capitalization style: sentence case (<em>Save changes</em>) is the modern default.',
        'Errors: what happened + how to fix: <em>Password must be at least 8 characters.</em>',
        "Be consistent: if it's <em>Sign in</em> on one page, don't write <em>Log in</em> on another.",
      ],
    },
  ],
};
