import type { KmNode } from '../../types';

export const modifiers: KmNode = {
  title: 'Adjectives, Adverbs & Prepositions',
  level: 'beginner',
  summary:
    'Describing things and actions, comparing them, and the small words that show time and place.',
  simple:
    'Adjectives and adverbs are the details — fast, slow, carefully. Prepositions are the glue — in, on, at. Small words, lots of mistakes.',
  points: [
    'Adjective → describes a noun. Adverb → describes a verb, adjective or the whole sentence.',
    'Prepositions mostly have to be learned in fixed pairs: <em>depend on, interested in</em>.',
  ],
  children: [
    {
      title: 'Adjective vs Adverb',
      level: 'beginner',
      summary:
        'Adjectives describe nouns (a quick fix); adverbs describe actions (fix it quickly).',
      simple: 'Ask "what kind?" → adjective. Ask "how?" → adverb, usually ending in -ly.',
      points: [
        '<em>a careful review</em> vs <em>review it carefully</em>.',
        'After <em>be, seem, look, feel</em> use an adjective: <em>It looks good. The API is slow.</em>',
        '<em>good</em> is an adjective, <em>well</em> the adverb: <em>It works well.</em>',
        'Some words are both: <em>fast, hard, late</em> — <em>It runs fast.</em>',
      ],
    },
    {
      title: 'Comparing Things',
      level: 'beginner',
      summary: 'Short words add -er/-est; long words use more/most.',
      simple: 'One syllable? Add -er (faster). Long word? Put "more" in front (more reliable).',
      points: [
        '<em>fast → faster → the fastest</em>.',
        '<em>reliable → more reliable → the most reliable</em>.',
        'Irregular: <em>good → better → best, bad → worse → worst</em>.',
        'Use <em>than</em>: <em>Go is faster than Python here.</em> Never <em>more faster</em>.',
        'Equal: <em>as fast as</em>; not equal: <em>not as fast as</em>.',
      ],
    },
    {
      title: 'Adjective Order',
      level: 'advanced',
      summary:
        'Several adjectives follow a natural order: opinion, size, age, shape, color, origin, material, purpose.',
      simple:
        'Native speakers feel it without thinking. "A nice small old table" sounds right; "an old small nice table" sounds weird.',
      points: [
        '<em>a great new open-source library</em> (opinion → age → type).',
        '<em>a big red button</em>, not <em>a red big button</em>.',
        'In tech writing, more than two adjectives is usually too many anyway.',
      ],
    },
    {
      title: 'In / On / At (Time)',
      level: 'beginner',
      summary:
        'at for exact times, on for days and dates, in for months, years and longer periods.',
      simple: 'Think from small to big: at a point, on a day, in a bigger box of time.',
      points: [
        '<em>at 3 pm, at noon, at the end of the sprint</em>.',
        '<em>on Monday, on May 5, on the weekend</em> (US) / <em>at the weekend</em> (UK).',
        '<em>in May, in 2026, in Q3, in the morning</em>.',
        'No preposition with <em>today, tomorrow, next week, last year</em>.',
        '<em>in 2 days</em> = 2 days from now; <em>within 2 days</em> = before 2 days pass.',
      ],
    },
    {
      title: 'In / On / At (Place)',
      level: 'beginner',
      summary: 'at for a point, on for a surface or platform, in for inside a container.',
      simple: 'at = a dot on the map, on = a surface, in = inside a box.',
      points: [
        '<em>in the file, in the folder, in the logs, in production</em>.',
        '<em>on GitHub, on the website, on the page, on line 42</em>.',
        '<em>at the top of the file, at the office, at Google</em> (company).',
        '<em>on the server</em> (it runs on it), <em>in the database</em> (data inside).',
      ],
    },
    {
      title: 'Dependent Prepositions',
      level: 'intermediate',
      summary: 'Many verbs and adjectives come with a fixed preposition you just have to learn.',
      simple:
        'Like a method that always takes the same first argument — "depend" always takes "on".',
      points: [
        '<em>depend on, rely on, focus on, work on</em>.',
        '<em>interested in, good at, responsible for, familiar with, compatible with</em>.',
        '<em>different from</em> (safe everywhere), <em>similar to</em>.',
        'No preposition: <em>discuss the issue</em> (not <em>discuss about</em>), <em>contact me</em> (not <em>contact to me</em>).',
      ],
    },
    {
      title: 'Compound Adjectives',
      level: 'intermediate',
      summary:
        'Two or more words that describe a noun together, joined with hyphens before the noun.',
      simple: "The hyphen glues the words into one adjective so the reader doesn't trip.",
      points: [
        '<em>a well-known bug</em> but <em>the bug is well known</em>.',
        '<em>a real-time system, a long-running job, a third-party library, open-source code</em>.',
        'Number + unit: <em>a 5-minute fix</em> (no -s on minute).',
        'No hyphen after -ly adverbs: <em>a highly available cluster</em>.',
      ],
    },
  ],
};
