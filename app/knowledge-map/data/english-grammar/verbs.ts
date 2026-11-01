import type { KmNode } from '../../types';

export const tenses: KmNode = {
  title: 'Verb Tenses',
  level: 'beginner',
  summary: 'How verbs show time: present, past, future, plus "continuous" and "perfect" forms.',
  simple:
    'A tense is a timestamp on the verb. You only need about six tenses for 95% of work English — learn those well instead of all twelve.',
  points: [
    'Time: past / present / future. Aspect: simple / continuous (-ing) / perfect (have + done).',
    'Most used at work: present simple, present continuous, past simple, present perfect, will, going to.',
    'Regular verbs add -ed for the past; irregular ones (run → ran) must be memorized.',
  ],
  detail: `<pre><code>past ─────────────── now ─────────────── future
fixed it            I fix / I'm fixing   I'll fix it
(past simple)       (present)            (will / going to)
        I have fixed it ──┘
        (present perfect: past action, result now)</code></pre>`,
  children: [
    {
      title: 'Present Simple',
      level: 'beginner',
      summary: 'For facts, habits and how things work — the default tense of documentation.',
      simple:
        'Use it for things that are always true: "The function returns a string." It describes behavior, not a moment.',
      points: [
        '<em>The method returns null if the key is missing.</em>',
        'Habits: <em>We deploy every Tuesday.</em>',
        'He/she/it adds -s: <em>it runs, it fixes, it has</em>.',
        "Questions and negatives use <em>do/does</em>: <em>Does it support Java 21? It doesn't.</em>",
      ],
      tip: 'Docs and Javadoc should use present simple: "Returns the user", not "Will return the user".',
    },
    {
      title: 'Present Continuous',
      level: 'beginner',
      summary: 'am/is/are + -ing: something happening right now or for a short, temporary time.',
      simple: 'It is the "loading spinner" tense: the action is in progress at this moment.',
      points: [
        "<em>I'm looking into the issue.</em> (right now)",
        "<em>We're migrating to Postgres this month.</em> (temporary)",
        "Fixed plans: <em>I'm meeting the client tomorrow.</em>",
        "State verbs don't use -ing: ❌ <em>I'm knowing</em> ✅ <em>I know</em>. Same for <em>want, need, understand, belong</em>.",
      ],
    },
    {
      title: 'Past Simple',
      level: 'beginner',
      summary: 'A finished action at a known time in the past.',
      simple: 'It is a log entry with a timestamp: done, closed, finished.',
      points: [
        '<em>The deploy failed yesterday at 3 pm.</em>',
        'Regular: add -ed — <em>fixed, merged, tested</em>.',
        'Common irregular: <em>run → ran, write → wrote, build → built, break → broke, find → found</em>.',
        "Questions/negatives: <em>did</em> + base verb — <em>Did it fail? It didn't fail.</em>",
      ],
    },
    {
      title: 'Spelling -ed & -ing',
      level: 'beginner',
      summary: 'Small spelling rules for adding -ed and -ing: drop the e, double the last letter, y → i.',
      simple:
        'Adding -ed or -ing is like string concatenation with a few edge cases. Learn the three edge cases and you will stop writing "commited".',
      points: [
        'Silent e drops: <em>use → using, used; write → writing; configure → configured</em>.',
        'Short vowel + one consonant at a stressed end → double it: <em>stop → stopped, commit → committed, refer → referred</em>.',
        'No stress at the end → no double: <em>open → opened, visit → visited, develop → developed</em>.',
        'Never double w, x or y: <em>fix → fixed, show → showing, play → played</em>.',
        'Consonant + y → -ied, but keep y before -ing: <em>try → tried, trying; copy → copied</em>. Vowel + y stays: <em>deploy → deployed</em>.',
        'US vs UK: <em>canceled, labeled</em> (US) vs <em>cancelled, labelled</em> (UK).',
      ],
      tip: '"Commited", "occured" and "refered" are among the most common typos in commit logs. Each needs a double letter.',
    },
    {
      title: 'Saying -ed & -s',
      level: 'beginner',
      summary: 'How to pronounce -ed and -s endings: three sounds each, and only some add a syllable.',
      simple:
        'The spelling is always -ed or -s, but the sound changes with the letter before it. Get it right and people understand your updates much faster.',
      points: [
        '-ed = /t/ after soft sounds p, k, s, sh, ch, f: <em>fixed</em> ("fikst"), <em>pushed, checked</em>.',
        '-ed = /d/ after most other sounds: <em>deployed, called, logged</em>.',
        '-ed adds a syllable (/ɪd/) only after t or d: <em>tested, added, deleted</em>.',
        '-s = /s/ in <em>tests, commits</em>; /z/ in <em>runs, files</em>; extra /ɪz/ after s, z, sh, ch, x: <em>classes, pushes, fixes</em>.',
        '❌ "fix-ed", "deploy-ed" with an extra syllable is a very common learner error.',
      ],
      tip: 'Tech words people often say wrong: "cache" sounds like "cash" (not "catch"), and "suite" sounds like "sweet".',
    },
    {
      title: 'Irregular Verbs',
      level: 'beginner',
      summary:
        'Verbs that do not use -ed: they have their own past form and past participle to memorize.',
      simple:
        'Most verbs follow the default rule. Irregular ones are like special cases hard-coded in a switch: you just learn them.',
      points: [
        'Three forms: base → past → participle — <em>write → wrote → written</em>.',
        'Same-same: <em>build → built → built, send → sent → sent, find → found → found</em>.',
        'All three different: <em>break → broke → broken, take → took → taken, choose → chose → chosen, begin → began → begun</em>.',
        'No change at all: <em>set, put, cut, let, hit, read</em> (only the sound of <em>read</em> changes).',
        'Use the participle after <em>have/has/be</em>: ❌ <em>It has broke</em> ✅ <em>It has broken</em>; ❌ <em>was wrote</em> ✅ <em>was written</em>.',
        '<em>get → got → got</em> (UK) / <em>gotten</em> (US); <em>run → ran → run</em>.',
      ],
    },
    {
      title: 'Talking About the Future',
      level: 'beginner',
      summary:
        'will for decisions and predictions, going to for plans, present continuous for arrangements.',
      simple:
        'English has no single future tense — it has a few tools, and each one carries a slightly different feeling.',
      points: [
        "<em>will</em> — quick decision or promise: <em>I'll check it now.</em>",
        "<em>going to</em> — a plan you already have: <em>We're going to upgrade to Java 25.</em>",
        "Present continuous — fixed arrangement: <em>I'm presenting on Friday.</em>",
        'After <em>when / if / before / after</em>, use present: ❌ <em>when it will finish</em> ✅ <em>when it finishes</em>.',
      ],
    },
    {
      title: 'Past Continuous',
      level: 'intermediate',
      summary: 'was/were + -ing: an action in progress at a point in the past, often interrupted.',
      simple:
        'It sets the background scene: "I was deploying (background) when the server crashed (event)."',
      points: [
        '<em>I was debugging when the power went out.</em>',
        'Great for bug reports: <em>The app crashed while I was uploading a file.</em>',
        '<em>was</em> with I/he/she/it, <em>were</em> with you/we/they.',
      ],
    },
    {
      title: 'Present Perfect',
      level: 'intermediate',
      summary:
        'have/has + past participle: a past action whose result matters now, with no exact time.',
      simple:
        'It links the past to now. "I have fixed the bug" = it is fixed now, go check. When it happened doesn\'t matter.',
      points: [
        "<em>I've pushed the changes.</em> (they are on the server now)",
        'Experience: <em>Have you ever used Kafka?</em>',
        "Unfinished time: <em>I've worked here for 3 years / since 2023.</em>",
        'With <em>just, already, yet</em>: <em>Has the build finished yet?</em>',
      ],
    },
    {
      title: 'Present Perfect Continuous',
      level: 'intermediate',
      summary:
        'have/has been + -ing: an action that started in the past and is still going on, or just stopped.',
      simple:
        'It is the "how long has this been running?" tense. Like an uptime counter: started earlier, still ticking now.',
      points: [
        "<em>I've been working on this ticket since Monday.</em> (still working)",
        "<em>The job has been running for two hours.</em>",
        'Focus on the activity: <em>I\'ve been fixing tests</em>. Focus on the result: <em>I\'ve fixed five tests</em>.',
        'Great for stand-ups and status updates: <em>We\'ve been seeing timeouts since the last deploy.</em>',
        'State verbs still don\'t take -ing: ❌ <em>I\'ve been knowing</em> ✅ <em>I\'ve known him for years</em>.',
      ],
    },
    {
      title: 'Perfect vs Past Simple',
      level: 'intermediate',
      summary: 'Exact past time → past simple. No time, result matters now → present perfect.',
      simple:
        'If you can add "yesterday" or "in 2022", use past simple. If you can\'t, present perfect is usually right.',
      points: [
        '✅ <em>I fixed it yesterday.</em> ❌ <em>I have fixed it yesterday.</em>',
        "✅ <em>I have fixed it.</em> (no time, it's fixed now)",
        'CV tip: past jobs → past simple (<em>Built a payment API</em>); current job → present (<em>Build and maintain…</em>).',
        'US English uses past simple more often: <em>Did you eat yet?</em> is common in speech.',
        "<em>for</em> + length, <em>since</em> + start point (perfect); <em>ago</em> + past simple: <em>I joined 3 years ago.</em> ❌ <em>I've joined 3 years ago.</em>",
      ],
      tip: 'Never put a finished time word (yesterday, last week, ago, in 2020) with "have done".',
    },
    {
      title: 'Past Perfect & Future Perfect',
      level: 'advanced',
      summary:
        'had done = before another past moment; will have done = finished before a future moment.',
      simple:
        'They are "before the before" and "done by then". Useful in incident reports and deadlines.',
      points: [
        'Past perfect: <em>The DB had already crashed when we got the alert.</em>',
        'Future perfect: <em>By Monday, we will have migrated all users.</em>',
        "Don't overuse past perfect; if the order is clear, past simple is fine.",
      ],
    },
  ],
};

export const modals: KmNode = {
  title: 'Modals & Verb Patterns',
  level: 'intermediate',
  summary: 'can, should, must, might… plus imperatives, -ing vs to-verb, and phrasal verbs.',
  simple:
    'Modal verbs are like flags on an action: allowed, required, possible, recommended. The other verb patterns are the "which form comes next" rules.',
  points: [
    'Modals never change form and are followed by the base verb: <em>it can run</em>, not <em>it can runs</em>.',
    'They carry tone: <em>must</em> is strong, <em>could</em> is soft and polite.',
    'Phrasal verbs (set up, roll back) are everywhere in tech English.',
  ],
  children: [
    {
      title: 'Can / Could',
      level: 'beginner',
      summary: 'Ability, possibility and permission — "could" is the softer, more polite form.',
      simple: '"Can you…?" is fine with friends. "Could you…?" is the safe choice with anyone.',
      points: [
        'Ability: <em>This library can parse YAML.</em>',
        'Polite request: <em>Could you review my PR?</em>',
        "Past ability: <em>I couldn't reproduce the bug.</em>",
        'Possibility: <em>It could be a cache issue.</em>',
      ],
    },
    {
      title: 'Imperative Mood',
      level: 'beginner',
      summary: 'The base verb with no subject, used for instructions and commands.',
      simple: 'It is the voice of a recipe or a CLI help page: "Install, configure, run."',
      points: [
        'Instructions: <em>Clone the repo. Run npm install.</em>',
        'Commit messages: <em>Fix login redirect</em> — not <em>Fixed</em> or <em>Fixes</em>.',
        "Negative: <em>Don't commit secrets.</em>",
        'Add <em>please</em> in messages to people, not in docs steps.',
      ],
    },
    {
      title: 'Must / Should / Have to',
      level: 'intermediate',
      summary: "must and have to = required; should = recommended; don't have to = not required.",
      simple:
        'must is a red light, should is a strong suggestion, don\'t have to means "optional".',
      points: [
        '<em>You must set an API key.</em> (required)',
        '<em>You should add a test for this.</em> (advice)',
        "<em>You don't have to restart</em> = not needed. <em>You mustn't restart</em> = forbidden!",
        'In code reviews, <em>should</em> or <em>could</em> sounds kinder than <em>must</em>.',
      ],
      tip: '"Mustn\'t" and "don\'t have to" mean very different things — a classic trap.',
    },
    {
      title: 'May / Might',
      level: 'intermediate',
      summary: 'Possibility (might, may) and formal permission (may).',
      simple:
        'Use them when you are not sure: "It might be a DNS problem." They make you sound careful, not weak.',
      points: [
        '<em>This may take a few minutes.</em> (common in UI text)',
        '<em>It might be related to the last deploy.</em>',
        'Past guess: <em>It might have been a timeout.</em>',
        'Permission (formal): <em>You may close this window.</em>',
      ],
    },
    {
      title: 'Would',
      level: 'intermediate',
      summary: 'The polite helper: soft requests, wishes, and imaginary situations.',
      simple:
        'Would is like a cushion in front of a request. "I want a review" sounds pushy; "I would like a review" sounds friendly.',
      points: [
        "Polite wish: <em>I'd like to</em> (= I would like to) <em>discuss the design.</em>",
        'Polite request: <em>Would you mind reviewing this?</em> (answer <em>No, not at all</em> = yes, I will).',
        "Soft opinion: <em>I would suggest adding a cache. I would say it's ready.</em>",
        "Imaginary: <em>It would be faster with an index.</em>",
        "Past of will in reported speech: <em>He said he would fix it.</em>",
      ],
      tip: 'Politeness ladder: "Review this." → "Can you review this?" → "Could you review this?" → "Would you mind reviewing this?"',
    },
    {
      title: 'Gerund vs Infinitive',
      level: 'intermediate',
      summary: 'Some verbs are followed by -ing (avoid doing), others by to + verb (want to do).',
      simple:
        "There is no perfect rule — it's like method signatures you memorize. Learn the common ones.",
      points: [
        '+ -ing: <em>avoid, enjoy, finish, consider, suggest, keep, mind</em> — <em>I suggest adding a test.</em>',
        '+ to: <em>want, need, plan, decide, expect, manage</em> — <em>We decided to roll back.</em>',
        '❌ <em>I suggest to add</em> ✅ <em>I suggest adding</em> (or <em>I suggest that we add</em>).',
        'After prepositions, always -ing: <em>thanks for helping, before deploying, instead of using</em>.',
        '<em>look forward to</em> + -ing: <em>I look forward to hearing from you.</em>',
        'Some take both with a different meaning: <em>stop checking</em> (quit) vs <em>stop to check</em> (pause in order to check); <em>try restarting</em> (test it) vs <em>try to restart</em> (attempt).',
      ],
    },
    {
      title: 'Let, Allow & Make',
      level: 'intermediate',
      summary:
        'Verbs for "give permission" or "cause": each needs a person or thing in the middle, then a verb.',
      simple:
        'Think of them as functions with a required argument: allow(you, toDoSomething). Skip the "you" and the sentence breaks.',
      points: [
        '<em>let</em> + object + base verb: <em>This flag lets you skip the tests.</em>',
        '<em>allow / enable</em> + object + <em>to</em>: <em>This flag allows you to skip the tests.</em>',
        '❌ <em>It allows to skip tests</em> ✅ <em>It allows you to skip tests</em> / <em>It allows skipping tests</em>.',
        '<em>make</em> + object + base verb = cause: <em>The new index makes the query run faster.</em>',
        '<em>help</em> + object + base verb (or <em>to</em>): <em>This helps us (to) find bugs.</em>',
      ],
      tip: '"Allows to" is one of the most common errors in README files. Always add who: you, users, the app.',
    },
    {
      title: 'Phrasal Verbs',
      level: 'intermediate',
      summary: 'A verb + a small word (up, out, back) that together mean something new.',
      simple:
        '"Set" and "set up" are different methods. The little word changes the meaning completely.',
      points: [
        'Tech classics: <em>set up, roll back, log in, sign up, check out, back up, shut down, look into, figure out</em>.',
        'As a verb: two words — <em>set up the server</em>. As a noun: one word — <em>the setup</em>.',
        'Same for <em>log in / login, back up / backup, check out / checkout</em>.',
        'Object can go in the middle: <em>roll it back</em> (pronouns must go in the middle).',
        'Some never split: <em>look into it</em>, not <em>look it into</em>. Same for <em>run into, deal with</em>.',
      ],
      tip: '"Please login" is wrong; "Please log in" is right. The login page is where you log in.',
    },
    {
      title: 'Phrasal Verbs at Work',
      level: 'intermediate',
      summary: 'The phrasal verbs you will hear every day in stand-ups, tickets and code reviews.',
      simple:
        'Native teammates use these instead of long formal verbs. Learn them like a cheat sheet of common shortcuts.',
      points: [
        '<em>look into</em> = investigate; <em>figure out</em> = understand or solve; <em>run into</em> = meet (a problem).',
        '<em>come up with</em> = think of (an idea); <em>point out</em> = mention a problem; <em>bring up</em> = start talking about.',
        '<em>follow up (on)</em> = check again later; <em>get back to</em> = reply later; <em>reach out (to)</em> = contact.',
        '<em>break down</em> = split (a task) or stop working; <em>work out</em> = solve, or succeed.',
        '<em>turn on/off</em> = enable/disable; <em>spin up</em> = start (a server); <em>clean up</em> = tidy, remove old stuff.',
      ],
      detail: `<pre><code>// TODO: look into why this retry sometimes runs twice.
// We ran into a race condition here, so we lock first.
lock.lock();</code></pre>`,
      tip: 'In formal docs, a single verb is often clearer for non-native readers: "investigate" instead of "look into".',
    },
    {
      title: 'Used To vs Be Used To',
      level: 'intermediate',
      summary:
        '"used to do" = a past habit that stopped; "be used to doing" = something feels normal to you.',
      simple:
        'They look almost the same but do different jobs. One is a past log entry, the other is how comfortable you feel now.',
      points: [
        "Past habit: <em>We used to deploy by hand.</em> (we don't anymore)",
        "Familiar: <em>I'm used to working with legacy code.</em> (it feels normal)",
        "Getting familiar: <em>I'm getting used to TypeScript.</em>",
        "After <em>be/get used to</em>, use -ing or a noun: ❌ <em>I'm used to work remotely</em> ✅ <em>I'm used to working remotely</em>.",
        "Questions/negatives: <em>Did you use to…? We didn't use to…</em> (no -d after did).",
      ],
    },
    {
      title: 'Spec Words (RFC 2119)',
      level: 'advanced',
      summary: 'In specs and API docs, MUST, SHOULD and MAY have exact, agreed meanings.',
      simple:
        'Specs turn modal verbs into a contract. Capital MUST is a hard rule; SHOULD has exceptions; MAY is optional.',
      points: [
        '<strong>MUST / MUST NOT</strong>: absolute requirement.',
        '<strong>SHOULD / SHOULD NOT</strong>: strong advice; you may break it with a good reason.',
        '<strong>MAY</strong>: truly optional.',
        'RFC 8174 clarifies they only have this meaning when written in CAPITALS.',
      ],
    },
  ],
};
