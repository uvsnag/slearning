import type { KmNode } from '../../types';

export const commonMistakes: KmNode = {
  title: 'Common Mistakes',
  level: 'intermediate',
  summary: 'The errors developers make most often in English — and quick ways to avoid them.',
  simple:
    'This is the "known bugs" list. Fix these few and your writing instantly looks more professional.',
  points: [
    'Most are confusable words that sound the same.',
    'Some are "non-native patterns" that are clear but sound unusual.',
    "A spell checker won't catch most of them — you have to know them.",
  ],
  children: [
    {
      title: "Its vs It's",
      level: 'beginner',
      summary: "it's = it is / it has; its = belonging to it.",
      simple: 'Try expanding it to "it is". If the sentence still works, use it\'s. If not, its.',
      points: [
        "<em>It's broken.</em> = It is broken.",
        '<em>The service and its config.</em> = the config of the service.',
        "Same trick: <em>you're</em> (you are) vs <em>your</em>, <em>they're</em> vs <em>their</em> vs <em>there</em>.",
        "<em>who's</em> (who is) vs <em>whose</em> (belonging to whom).",
      ],
    },
    {
      title: 'Then vs Than',
      level: 'beginner',
      summary: 'then = after that / in that case; than = for comparing.',
      simple: 'thAn is for compArison. thEn is for timE.',
      points: [
        '<em>Build it, then run it.</em>',
        '<em>Rust is faster than Python.</em>',
        '<em>If it fails, then retry.</em> (like if/then in code)',
      ],
    },
    {
      title: 'Lose, Affect & Friends',
      level: 'intermediate',
      summary: 'Word pairs that look alike but mean different things.',
      simple:
        "They're like two variables with almost the same name — the compiler of the reader's brain picks the wrong one.",
      points: [
        '<em>lose</em> (data) vs <em>loose</em> (not tight): <em>You might lose data.</em>',
        '<em>affect</em> (verb) vs <em>effect</em> (noun): <em>The change affects users; the effect is small.</em>',
        '<em>ensure</em> (make sure) vs <em>insure</em> (buy insurance).',
        '<em>complement</em> (complete) vs <em>compliment</em> (praise).',
        '<em>principal</em> (main, or a security identity) vs <em>principle</em> (rule).',
      ],
    },
    {
      title: 'Fewer vs Less',
      level: 'intermediate',
      summary: 'fewer + countable nouns; less + uncountable nouns.',
      simple: "If you can count it, it's fewer. Fewer bugs, less code.",
      points: [
        '<em>fewer requests, fewer lines</em>.',
        '<em>less memory, less time</em>.',
        'With numbers and units, <em>less than</em> is fine: <em>less than 10 MB</em>.',
      ],
    },
    {
      title: 'Noun vs Verb Spelling',
      level: 'intermediate',
      summary:
        'setup/set up, login/log in, backup/back up — one word is the noun, two words the verb.',
      simple: 'If you can put "to" in front of it, it\'s the verb — write two words.',
      points: [
        '<em>Set up the project</em> → <em>the project setup</em>.',
        '<em>Log in with SSO</em> → <em>the login page</em>.',
        '<em>Back up the DB</em> → <em>a nightly backup</em>.',
        'Also: <em>shutdown/shut down, rollout/roll out, checkout/check out, fallback/fall back</em>.',
      ],
    },
    {
      title: 'Non-native Patterns',
      level: 'intermediate',
      summary: 'Phrases that are understandable but sound unusual to native speakers.',
      simple:
        'These "compile" — people get it — but they show up as warnings. Here are the cleaner versions.',
      points: [
        '❌ <em>I have a doubt</em> ✅ <em>I have a question</em>.',
        '❌ <em>Please do the needful</em> ✅ <em>Please take care of this</em>.',
        '❌ <em>Revert back to me</em> ✅ <em>Get back to me / reply</em>.',
        '❌ <em>Discuss about, mention about</em> ✅ <em>discuss it, mention it</em>.',
        '❌ <em>How to fix?</em> (as a full question) ✅ <em>How do I fix it?</em>',
        '❌ <em>Explain me</em> ✅ <em>Explain to me</em>.',
      ],
    },
    {
      title: 'Confusing Verbs',
      level: 'intermediate',
      summary:
        'make/do, say/tell, borrow/lend — pairs that other languages often use one word for.',
      simple:
        'Your first language may have one verb for both. English splits them, so you need to pick.',
      points: [
        '<em>do</em> a task/job/review; <em>make</em> a change/decision/mistake/request.',
        '<em>say</em> something; <em>tell</em> someone something: <em>Tell me what he said.</em>',
        '<em>lend</em> = give for a while; <em>borrow</em> = take for a while.',
        '<em>raise</em> an issue (with object); <em>rise</em> (no object): <em>Latency rose.</em>',
      ],
    },
    {
      title: 'Missing Words',
      level: 'beginner',
      summary: 'Dropping articles, subjects or the -s on verbs is the most common learner error.',
      simple: 'Short notes and chat make this worse. Re-read once before you hit Send.',
      points: [
        'Missing article: ❌ <em>I created new branch</em> ✅ <em>I created a new branch</em>.',
        "Missing subject: ❌ <em>Is ok now</em> ✅ <em>It's OK now</em>.",
        'Missing -s: ❌ <em>The job run every hour</em> ✅ <em>The job runs every hour</em>.',
        'Missing <em>be</em>: ❌ <em>The server down</em> ✅ <em>The server is down</em>.',
      ],
      tip: 'Paste important messages into a grammar checker (Grammarly, LanguageTool) — then learn from what it flags.',
    },
  ],
};
