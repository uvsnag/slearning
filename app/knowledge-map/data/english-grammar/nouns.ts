import type { KmNode } from '../../types';

export const nounsArticles: KmNode = {
  title: 'Nouns & Articles',
  level: 'beginner',
  summary: 'Countable vs uncountable nouns, plurals, and when to use a, an, the or nothing.',
  simple:
    'Articles are the small words before nouns that tell the reader "any one" (a/an) or "the one we both know" (the). They are tiny but they are the most common mistake for learners.',
  points: [
    'First decide: can you count the noun? That decides the article and the plural.',
    'a/an = one of many, not specific. the = a specific one the reader knows.',
    'Plural or uncountable nouns in general take no article.',
  ],
  children: [
    {
      title: 'Countable vs Uncountable',
      level: 'beginner',
      summary:
        'Countable nouns have a plural (bugs); uncountable nouns are treated as a mass (code, data).',
      simple:
        'You can count bugs: one bug, two bugs. You can\'t count water — you say "some water" or "two glasses of water". Code works like water.',
      points: [
        'Countable: <em>a file, two files, a bug, many bugs</em>.',
        'Uncountable: <em>code, software, information, feedback, advice, equipment, research</em>.',
        'Uncountable nouns have no plural: ❌ <em>informations, feedbacks, softwares, codes</em>.',
        'To count them, add a unit: <em>a piece of advice, a line of code, two pieces of feedback</em>.',
        'Uncountable nouns take a singular verb: <em>The information is wrong.</em>',
      ],
      tip: '"Codes" is only right for separate codes like error codes or promo codes: "HTTP status codes".',
    },
    {
      title: 'Plurals',
      level: 'beginner',
      summary: 'Most nouns add -s, but some add -es, change their ending, or are irregular.',
      simple:
        'Default rule: add -s. Then learn the few exceptions, the way you learn the edge cases of an API.',
      points: [
        '-s: <em>file → files, user → users</em>.',
        '-es after s, x, z, ch, sh: <em>class → classes, box → boxes, branch → branches</em>.',
        'Consonant + y → -ies: <em>query → queries, dependency → dependencies</em>. But <em>key → keys</em>.',
        'Irregular: <em>child → children, person → people, index → indexes/indices, matrix → matrices</em>.',
        '<em>Data</em> is often uncountable in tech (<em>the data is</em>). <em>Criteria</em> is plural; one is a <em>criterion</em>.',
      ],
    },
    {
      title: 'A vs An',
      level: 'beginner',
      summary:
        'Use "an" before a vowel sound and "a" before a consonant sound — sound, not letter.',
      simple: 'It is about how the word sounds out loud. "An" just makes it easier to say.',
      points: [
        '<em>a bug, a server, an error, an API</em> (say "ay-pee-eye").',
        '<em>an hour</em> (silent h), <em>an HTTP request</em> ("aitch").',
        '<em>a user, a URL, a unit test</em> — they start with a "you" sound.',
        '<em>an SQL query</em> ("ess-queue-ell") but <em>a SQL query</em> if you say "sequel". Both are used.',
      ],
    },
    {
      title: 'The',
      level: 'beginner',
      summary: 'Use "the" when the reader knows exactly which thing you mean.',
      simple:
        '"A bug" = some bug, the reader doesn\'t know which. "The bug" = the one we already talked about. Like a new object vs a reference to an existing one.',
      points: [
        'Second mention: <em>I found a bug. The bug is in the login page.</em>',
        'Only one exists: <em>the database, the main branch, the internet</em>.',
        'Defined by what follows: <em>the file that I sent you</em>.',
        'Superlatives: <em>the fastest, the best, the latest version</em>.',
      ],
    },
    {
      title: 'No Article',
      level: 'intermediate',
      summary: 'Talking in general about plurals or uncountable things? Use no article at all.',
      simple:
        'When you mean "all of them in general", drop the article. "Developers love coffee" — all developers, all coffee.',
      points: [
        'General plural: <em>Tests save time.</em> (not <em>The tests save time</em>, unless specific tests).',
        'General uncountable: <em>Security matters.</em>',
        'Most names, languages and products: <em>I use Java. Docker runs on Linux.</em>',
        'Some fixed phrases: <em>at work, go to bed, by email, in production</em>.',
        'But a singular countable noun always needs something: ❌ <em>I wrote test</em> ✅ <em>I wrote a test</em>.',
      ],
      tip: 'Quick check: singular + countable + no article (a, the, my, this…) is almost always wrong.',
    },
    {
      title: 'Determiners & Quantity',
      level: 'intermediate',
      summary:
        'this/that, some/any, much/many, few/little — words that point to or measure a noun.',
      simple: 'They answer "which one?" or "how much?" before the noun, like a filter on a list.',
      points: [
        '<em>this/these</em> = near; <em>that/those</em> = far or earlier: <em>this commit, those logs</em>.',
        "<em>some</em> in positives, <em>any</em> in questions and negatives: <em>Any questions? No, I don't have any.</em>",
        '<em>many</em> + countable (<em>many bugs</em>), <em>much</em> + uncountable (<em>much memory</em>).',
        '<em>a few</em> = some (positive); <em>few</em> = not enough (negative). Same for <em>a little / little</em>.',
        '<em>a lot of</em> works with both and sounds natural in speech.',
      ],
    },
    {
      title: "Possessive 's",
      level: 'beginner',
      summary: "Add 's to show something belongs to someone; for plurals ending in s, just add '.",
      simple: 'It\'s the English way of saying "user.name": the user\'s name.',
      points: [
        "One owner: <em>the user's email, Java's syntax</em>.",
        "Plural owner: <em>the users' emails</em> (many users).",
        "Irregular plural: <em>the children's toys, people's ideas</em>.",
        'For things, <em>of</em> or a noun-noun combo often sounds better: <em>the name of the table, the table name</em>.',
      ],
    },
  ],
};

export const pronouns: KmNode = {
  title: 'Pronouns & Agreement',
  level: 'beginner',
  summary: 'Words that stand in for nouns, and making the verb match its subject.',
  simple:
    'Pronouns are like variables that point at a noun you already named. Agreement is the type check: a singular subject needs a singular verb.',
  points: [
    'Pronouns save you from repeating the same noun again and again.',
    'Every pronoun should clearly point to one noun — no "dangling references".',
    'Subject–verb agreement is the #1 grammar error in everyday developer writing.',
  ],
  children: [
    {
      title: 'Personal Pronouns',
      level: 'beginner',
      summary:
        'I/me, he/him, she/her, it, we/us, they/them — the form changes with the role in the sentence.',
      simple:
        'Subject form does the action (I, they). Object form receives it (me, them). "They pinged me."',
      points: [
        'Subject: <em>I, you, he, she, it, we, they</em>.',
        'Object: <em>me, you, him, her, it, us, them</em>.',
        '✅ <em>Send it to John and me</em> — remove "John and" to test: "send it to me".',
        'Use <em>it</em> for things, tools and teams-as-objects: <em>The API is slow; it times out.</em>',
      ],
    },
    {
      title: 'Possessives',
      level: 'beginner',
      summary:
        'my/mine, your/yours, its, our/ours, their/theirs — showing ownership without a noun repeat.',
      simple: '"My" goes before a noun (my laptop). "Mine" stands alone (the laptop is mine).',
      points: [
        'Before a noun: <em>my, your, his, her, its, our, their</em>.',
        'Standing alone: <em>mine, yours, his, hers, ours, theirs</em>.',
        "Possessive pronouns never take an apostrophe: <em>its, yours, theirs</em> — not <em>it's, your's</em>.",
      ],
    },
    {
      title: 'Singular "they"',
      level: 'intermediate',
      summary: "Use they/them for one person whose gender you don't know or who uses they.",
      simple:
        'Writing docs about "the user"? Say "they", not "he or she". It is natural, old, and fully accepted.',
      points: [
        '<em>When a user logs in, they see the dashboard.</em>',
        'The verb stays plural in form: <em>they are</em>, even for one person.',
        'Major style guides (Google, Microsoft, APA) recommend it.',
        'Or rewrite in second person: <em>When you log in, you see the dashboard.</em>',
      ],
    },
    {
      title: 'Subject–Verb Agreement',
      level: 'beginner',
      summary:
        'A singular subject takes a singular verb (it works); a plural subject takes a plural verb (they work).',
      simple:
        'Present tense: he/she/it gets an -s on the verb. That one little -s is easy to forget, so watch for it.',
      points: [
        '<em>The test passes. The tests pass.</em>',
        "<em>It doesn't work</em> — not <em>It don't work</em>.",
        'Find the real subject: <em>The list of users <strong>is</strong> empty</em> (the list is).',
        '<em>Each/every/everyone</em> are singular: <em>Every test <strong>has</strong> a name.</em>',
        'Team or company: singular in US English (<em>the team is</em>), often plural in UK English.',
      ],
      tip: 'Long subjects hide the real noun. Strip the extra words and read "subject + verb" alone.',
    },
    {
      title: 'It vs There',
      level: 'intermediate',
      summary: '"There is/are" says something exists; "it is" describes something already known.',
      simple:
        '"There is a bug" introduces the bug. "It is in the parser" tells you about the bug you just met.',
      points: [
        '<em>There is an error in line 10.</em> (exists)',
        '<em>There are three failing tests.</em> — match the verb to the noun after it.',
        '<em>It is easy to fix.</em> (describes)',
        '❌ <em>Have a problem with the build.</em> ✅ <em>There is a problem with the build.</em>',
      ],
    },
    {
      title: 'Relative Pronouns',
      level: 'intermediate',
      summary: 'who, which, that, whose — they link extra information to a noun.',
      simple:
        'They work like a join: the main sentence plus a little extra sentence about one of its nouns.',
      points: [
        '<em>who</em> for people: <em>the dev who wrote this</em>.',
        '<em>which / that</em> for things: <em>the service that sends emails</em>.',
        '<em>whose</em> for ownership: <em>the user whose token expired</em>.',
        'More on <em>which</em> vs <em>that</em> in "Building Sentences".',
      ],
    },
  ],
};
