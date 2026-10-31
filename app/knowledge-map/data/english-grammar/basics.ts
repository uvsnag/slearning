import type { KmNode } from '../../types';

export const sentenceBasics: KmNode = {
  title: 'Sentence Basics',
  level: 'beginner',
  summary:
    'The building blocks: word types, subject + verb, word order and the main sentence types.',
  simple:
    'A sentence is like a small function call: someone (the subject) does something (the verb). Get that core right and everything else is decoration.',
  points: [
    'Every full English sentence needs a subject and a verb.',
    'English uses a fixed word order: Subject → Verb → Object.',
    'Learn the word types first; the rest of grammar is about how they fit together.',
  ],
  children: [
    {
      title: 'Parts of Speech',
      level: 'beginner',
      summary:
        'The 8 main word types: noun, pronoun, verb, adjective, adverb, preposition, conjunction, interjection.',
      simple:
        'Think of them as data types for words. A noun is a "thing", a verb is an "action", an adjective "describes a thing". Knowing the type tells you where the word can go.',
      points: [
        'Noun: a thing, person or idea — <em>server, user, bug</em>.',
        'Verb: an action or state — <em>run, deploy, is</em>.',
        'Adjective describes a noun (<em>fast server</em>); adverb describes a verb (<em>runs fast</em>, <em>quickly</em>).',
        'Preposition shows position or relation — <em>in, on, at, for</em>.',
        'Conjunction joins parts — <em>and, but, because</em>.',
        'One word can have several types: <em>a test</em> (noun) vs <em>test the API</em> (verb).',
      ],
    },
    {
      title: 'Subject + Verb',
      level: 'beginner',
      summary: 'The two parts every complete sentence needs: who/what, and what it does or is.',
      simple:
        'No subject, no sentence — like calling a method without an object. "Is broken." Who is broken? "The build is broken." Now it works.',
      points: [
        'Subject = who or what the sentence is about: <em>The build</em> failed.',
        'Verb = the action or state: The build <em>failed</em>.',
        'English almost never drops the subject. Use <em>it</em> as a dummy: <em>It is raining</em>, <em>It works</em>.',
        '❌ <em>Is not working.</em> ✅ <em>It is not working.</em>',
        'Exception: commands have a hidden "you": <em>(You) Run the tests.</em>',
      ],
      tip: 'Many languages let you drop the subject. English does not — "It" and "There" fill the gap.',
    },
    {
      title: 'Word Order (SVO)',
      level: 'beginner',
      summary:
        'English sentences go Subject → Verb → Object, and changing the order changes the meaning.',
      simple:
        'Word order in English is like argument order in a function: send(alice, bob) and send(bob, alice) are different calls. "The dog bit the man" is not "The man bit the dog".',
      points: [
        'Basic pattern: <em>The service (S) sends (V) an email (O).</em>',
        'Time and place usually go at the end: <em>We deploy the app on Friday.</em>',
        'Keep the verb and its object together: ❌ <em>I fixed quickly the bug</em> ✅ <em>I quickly fixed the bug</em>.',
        'Adjectives come before the noun: <em>a slow query</em>, not <em>a query slow</em>.',
      ],
    },
    {
      title: 'Sentence Types',
      level: 'beginner',
      summary:
        'Statements, questions, commands and exclamations — each has its own shape and punctuation.',
      simple:
        'Like HTTP methods for talking: you tell (statement), ask (question), order (command) or shout (exclamation).',
      points: [
        'Statement: <em>The tests pass.</em>',
        'Question: <em>Do the tests pass?</em>',
        'Command (imperative): <em>Run the tests.</em> — no subject, verb first.',
        'Exclamation: <em>That was fast!</em> — use rarely in work writing.',
      ],
    },
    {
      title: 'Questions',
      level: 'beginner',
      summary: 'Most questions swap the subject and a helper verb (do, is, can, have).',
      simple:
        'To turn a statement into a question, move the helper verb to the front. "You can merge it" → "Can you merge it?" If there is no helper, borrow "do".',
      points: [
        'Yes/no: <em>Is the server up? Can you review my PR? Did the job fail?</em>',
        'Wh- questions: put the question word first — <em>Why did the job fail?</em>',
        'After <em>do/does/did</em>, use the base verb: ❌ <em>Did it worked?</em> ✅ <em>Did it work?</em>',
        'Questions about the subject need no "do": <em>Who broke the build?</em>',
        'Indirect questions keep normal order: <em>Do you know why it failed?</em> (not <em>why did it fail</em>).',
      ],
      tip: 'In chat, a soft question like "Could you take a look when you have time?" sounds much nicer than "Review this."',
    },
    {
      title: 'Negatives',
      level: 'beginner',
      summary: 'Add "not" after the helper verb, or use do/does/did + not when there is no helper.',
      simple:
        'Same trick as questions: find the helper verb and put "not" after it. No helper? Bring in "do".',
      points: [
        '<em>It is not ready. It can not (cannot) connect. It has not started.</em>',
        'No helper: <em>It does not work. It did not compile.</em>',
        "Short forms in chat: <em>isn't, can't, doesn't, didn't, won't</em> (= will not).",
        "Avoid double negatives: ❌ <em>I don't have no access</em> ✅ <em>I don't have any access</em>.",
      ],
    },
    {
      title: 'Capitals & Full Stops',
      level: 'beginner',
      summary:
        'Start a sentence with a capital letter, end it with a period, and capitalize names.',
      simple:
        'Capital letter = "start of sentence", full stop = "end of sentence". Like opening and closing braces.',
      points: [
        'Always capitalize <em>I</em>, names, days, months, languages: <em>Monday, English, Java</em>.',
        'Write product names the way their owners do: <em>JavaScript, GitHub, iOS, macOS, npm</em>.',
        'Do not Capitalize Random Words in the middle of a sentence for emphasis.',
        'One space after a period is the modern standard.',
      ],
      tip: '"Javascript", "Github" and "JAVA" look careless in a CV. Check the official spelling.',
    },
  ],
};
