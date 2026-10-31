import type { KmNode } from '../../types';

export const advancedGrammar: KmNode = {
  title: 'Advanced Grammar & Style',
  level: 'advanced',
  summary: 'The finer points that make your English sound precise, natural and senior.',
  simple:
    'You already "compile without errors". This branch is about the refactoring: tone, rhythm and the rare structures that make writing feel native.',
  points: [
    'Most of these matter in design docs, proposals, interviews and leadership roles.',
    'Clarity still beats fancy grammar — use these to be precise, not to impress.',
  ],
  children: [
    {
      title: 'Parallel Structure',
      level: 'advanced',
      summary: 'Items in a list or pair should have the same grammatical form.',
      simple:
        'Like items in an array: they should all be the same type. Mixing nouns and verbs feels like a type error.',
      points: [
        '❌ <em>The tool is fast, reliable and has a nice UI.</em>',
        '✅ <em>The tool is fast, reliable and easy to use.</em>',
        'Bullet lists: start every bullet the same way (all verbs, or all nouns).',
        'CV bullets: <em>Built…, Led…, Reduced…</em> — all past-tense verbs.',
      ],
    },
    {
      title: 'Dangling Modifiers',
      level: 'advanced',
      summary: 'An opening phrase must describe the subject that comes right after it.',
      simple:
        "It's a wrong reference: the phrase points to the wrong noun, and the sentence says something silly.",
      points: [
        '❌ <em>After running the tests, the build failed.</em> (the build ran the tests?)',
        '✅ <em>After I ran the tests, the build failed.</em>',
        '❌ <em>Using Docker, the setup is easy.</em> ✅ <em>Using Docker, you can set it up easily.</em>',
      ],
    },
    {
      title: 'Hedging & Certainty',
      level: 'advanced',
      summary: 'Choosing words that show exactly how sure you are.',
      simple: 'Like log levels for confidence: "will", "should", "might", "could possibly".',
      points: [
        'Certain: <em>This fixes the leak.</em>',
        "Likely: <em>This should fix it. It's probably the cache.</em>",
        'Unsure: <em>It might be related to…, I suspect…, It seems that…</em>',
        "Don't over-hedge: <em>I think maybe it could possibly be</em> sounds unsure of everything.",
      ],
      tip: 'In incident updates, be honest about certainty: "We believe the cause is X; we are confirming."',
    },
    {
      title: 'Register & Tone',
      level: 'advanced',
      summary: 'Matching formality to the situation: chat, team docs, client emails, contracts.',
      simple:
        "You don't wear a suit to a hackathon or flip-flops to a client meeting. Words work the same way.",
      points: [
        "Casual: <em>Hey, got a sec? I think the build's broken.</em>",
        'Neutral (most work): <em>Hi, do you have a minute? The build seems to be failing.</em>',
        'Formal: <em>I would appreciate it if you could review the attached proposal.</em>',
        'Too formal sounds cold in chat; too casual sounds careless with clients.',
      ],
    },
    {
      title: 'Subjunctive',
      level: 'expert',
      summary:
        'A special verb form after "suggest/require that" and in imaginary "if I were" sentences.',
      simple:
        'It sounds "wrong" at first: "We recommend that he use…" — no -s. That\'s the subjunctive.',
      points: [
        '<em>We require that every PR have two approvals.</em> (not <em>has</em>)',
        "<em>It's important that the key be kept secret.</em>",
        "<em>If I were you, I'd add a retry.</em> (formal; <em>if I was</em> is common in speech)",
        'More common in US English; UK often uses <em>should</em>: <em>that every PR should have…</em>',
      ],
    },
    {
      title: 'Emphasis & Inversion',
      level: 'expert',
      summary: 'Cleft sentences and inverted word order to put the focus where you want it.',
      simple: 'Like bold text in grammar form: you move the important part to the spotlight.',
      points: [
        'Cleft: <em>It was the cache that caused the bug.</em> / <em>What we need is better tests.</em>',
        "Inversion after negative words: <em>Not only is it faster, but it's also cheaper.</em>",
        '<em>Never have we seen this error before.</em> (formal, dramatic)',
        'Use sparingly — in docs, plain order is usually clearer.',
      ],
    },
    {
      title: 'Concise Writing',
      level: 'expert',
      summary: "Removing every word that doesn't add meaning, without losing clarity or kindness.",
      simple:
        'Refactor your sentences like code: delete dead words, extract long parts, rename vague ones.',
      points: [
        'Turn nouns back into verbs: <em>perform an analysis of</em> → <em>analyze</em>.',
        'Drop empty starts: <em>It should be noted that…</em>, <em>Basically…</em>.',
        'Replace vague words with specifics: <em>very slow</em> → <em>takes 8 seconds</em>.',
        'Read it out loud: if you run out of breath, split the sentence.',
      ],
      tip: 'Write the first draft fast, then edit for length — like coding first and refactoring after the tests pass.',
    },
  ],
};
