import type { KmNode } from '../../types';

export const cleanCode: KmNode = {
  title: 'Clean Code Basics',
  level: 'beginner',
  summary: 'Readable small pieces of code are the bricks every good architecture is built from.',
  simple:
    'You can’t build a solid house from crumbling bricks. Clean code is about good bricks; architecture is how you stack them.',
  points: [
    'Code is read far more often than it is written.',
    'From Robert C. Martin’s book "Clean Code" (2008).',
    'Clean code alone doesn’t give clean architecture, but messy code ruins any architecture.',
  ],
  children: [
    {
      title: 'Meaningful Names',
      level: 'beginner',
      summary: 'Names should tell you what something is and why it exists.',
      simple: 'A box labelled "stuff" makes you open it. A box labelled "winter coats" doesn’t.',
      points: [
        'Prefer <code>overdueInvoices</code> to <code>list2</code> or <code>data</code>.',
        'Classes are nouns (<code>Invoice</code>), methods are verbs (<code>sendReminder</code>).',
        'Use the words the business uses, not database or framework words.',
        'If you need a comment to explain a name, rename it.',
      ],
    },
    {
      title: 'Small Functions',
      level: 'beginner',
      summary: 'Each function does one thing, at one level of detail.',
      simple:
        'A good recipe step says "whisk the eggs", not "whisk the eggs, also check the oven and call mum".',
      points: [
        'Short functions are easier to name, test and reuse.',
        'Don’t mix high-level steps with low-level details in one function.',
        'Few parameters: three or more is a hint to make an object.',
        'No hidden side effects behind innocent names like <code>checkPassword</code>.',
      ],
      detail: `<pre><code>void placeOrder(Order order) {
    validate(order);
    reserveStock(order);
    charge(order);
    sendConfirmation(order);
}</code></pre>`,
    },
    {
      title: 'Comments & Formatting',
      level: 'beginner',
      summary: 'Let the code explain itself; comment only the "why", not the "what".',
      simple: 'If a sign needs a second sign to explain it, fix the first sign.',
      points: [
        'Good comments explain intent, warnings and odd business rules.',
        'Bad comments repeat the code or lie after the code changes.',
        'Delete commented-out code; git remembers it.',
        'Use one formatter for the whole team so diffs stay clean.',
      ],
    },
    {
      title: 'Error Handling',
      level: 'intermediate',
      summary:
        'Handle errors clearly with exceptions, and keep error code from hiding the main logic.',
      simple:
        'A good fire exit is clearly marked and out of the way. It doesn’t block the main hallway.',
      points: [
        'Prefer exceptions over error codes and <code>null</code> returns.',
        'Return <code>Optional&lt;User&gt;</code> when "not found" is normal.',
        'Use business exceptions like <code>InsufficientFundsException</code> in the core.',
        'Translate technical exceptions (SQL, HTTP) at the edge, not in business rules.',
      ],
    },
    {
      title: 'Tell, Don’t Ask',
      level: 'intermediate',
      summary: 'Tell an object to do the job instead of pulling its data out and deciding for it.',
      simple:
        'You tell the barista "a latte, please". You don’t grab the milk jug and the coffee and make it behind the counter yourself.',
      points: [
        'Keep data and the rules that use it in the same object.',
        'Law of Demeter: only talk to your direct friends, not to friends of friends.',
        'Long chains like <code>a.getB().getC().doX()</code> are a warning sign.',
        'This is how you avoid an anemic domain model (all data, no behaviour).',
      ],
      detail: `<pre><code>// ask: the caller decides
if (account.getBalance().compareTo(amount) &gt;= 0) {
    account.setBalance(account.getBalance().subtract(amount));
}
// tell: the account guards its own rule
account.withdraw(amount);</code></pre>`,
    },
    {
      title: 'DRY, KISS, YAGNI',
      level: 'intermediate',
      summary:
        'Three rules of thumb: don’t repeat knowledge, keep it simple, don’t build for maybe.',
      simple:
        'Don’t write the same address on ten notes (DRY), don’t use a crane to lift a cup (KISS), and don’t buy a crib before you’re dating (YAGNI).',
      points: [
        'DRY: each business rule lives in one place. Similar-looking code isn’t always duplication.',
        'KISS: the simplest design that works usually wins.',
        'YAGNI ("You Aren’t Gonna Need It"): build features when needed, not just in case.',
        'These rules also stop over-engineered architectures.',
      ],
      tip: 'Two pieces of code that look alike but change for different reasons are not duplicates. Merging them creates coupling.',
    },
    {
      title: 'Tests & Refactoring',
      level: 'intermediate',
      summary: 'Tests let you improve code structure safely without changing what it does.',
      simple: 'A safety net lets the acrobat try new moves. Tests are the net for reshaping code.',
      points: [
        'Refactoring: change the structure, keep the behaviour.',
        'Boy Scout Rule: leave the code a bit cleaner than you found it.',
        'Fast unit tests are what make constant small cleanups possible.',
        'Hard-to-test code is a design smell, often too much coupling.',
      ],
    },
  ],
};
