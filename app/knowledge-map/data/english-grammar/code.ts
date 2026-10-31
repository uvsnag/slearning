import type { KmNode } from '../../types';

export const grammarInCode: KmNode = {
  title: 'Grammar in Code',
  level: 'intermediate',
  summary: 'Using word types and grammar to name things, write comments and craft good messages.',
  simple:
    'Code is read by people far more than by machines. Good names read like English sentences: if (user.isActive()) almost reads itself.',
  points: [
    'Classes and variables are things → nouns. Methods do things → verbs.',
    'Booleans answer yes/no → is/has/can + adjective or verb.',
    'Pick one English (US is the norm in code) and stay consistent.',
  ],
  children: [
    {
      title: 'Nouns for Things',
      level: 'beginner',
      summary: 'Name classes, objects and variables with nouns or noun phrases.',
      simple: 'A variable holds a thing, so call it by what it is: invoice, not doInvoice.',
      points: [
        'Classes: <code>OrderService</code>, <code>PaymentGateway</code>, <code>UserRepository</code>.',
        'Use singular for one, plural for many: <code>user</code> vs <code>users</code>.',
        'Avoid vague nouns: <code>data</code>, <code>info</code>, <code>manager</code>, <code>helper</code>.',
        'Uncountable names: <code>feedbackItems</code> instead of <code>feedbacks</code>.',
      ],
      detail: `<pre><code>// ❌
List&lt;User&gt; userList2 = repo.get();
// ✅
List&lt;User&gt; activeUsers = repo.findActive();</code></pre>`,
    },
    {
      title: 'Verbs for Actions',
      level: 'beginner',
      summary:
        'Name methods and functions with a verb in the imperative: get, create, send, validate.',
      simple: 'A function call is a command: sendEmail() reads like "Send email!"',
      points: [
        'Verb first: <code>calculateTotal()</code>, not <code>totalCalculation()</code>.',
        "Keep one verb per idea across the codebase: don't mix <code>fetch</code>, <code>get</code>, <code>retrieve</code>.",
        'Common pairs: <code>open/close</code>, <code>start/stop</code>, <code>add/remove</code>, <code>create/delete</code>.',
        'Event handlers often use <code>on</code> + past or event noun: <code>onClick</code>, <code>onSaved</code>.',
      ],
      detail: `<pre><code>// ❌ noun-ish, unclear
function userValidation(u) { /* … */ }
// ✅ imperative verb
function validateUser(user) { /* … */ }</code></pre>`,
    },
    {
      title: 'Boolean Names',
      level: 'intermediate',
      summary: 'Name booleans as yes/no questions: is, has, can, should + the rest.',
      simple:
        'A boolean is the answer to a question, so name it as the question: "is it enabled?" → isEnabled.',
      points: [
        '<code>isVisible</code>, <code>hasChildren</code>, <code>canEdit</code>, <code>shouldRetry</code>.',
        'Use positive names: <code>isEnabled</code>, not <code>isNotDisabled</code>.',
        'Watch agreement: <code>hasErrors</code> (has + plural) or <code>hasError</code>, not <code>haveErrors</code>.',
        'Java beans use <code>isX()</code> for boolean getters.',
      ],
      detail: `<pre><code>if (!order.isNotPaid()) { … }  // ❌ double negative
if (order.isPaid()) { … }      // ✅ reads like English</code></pre>`,
    },
    {
      title: 'Plurals in Code',
      level: 'intermediate',
      summary: 'Collections get plural names; loop items get the singular.',
      simple: 'The box of apples is apples; each one you pick up is an apple.',
      points: [
        '<code>for (const order of orders)</code> — reads naturally.',
        'Watch irregular plurals: <code>children</code>, <code>people</code>, <code>indexes</code>, <code>statuses</code>.',
        'Maps: name by key and value — <code>priceByProductId</code>, <code>usersByEmail</code>.',
        'Count variables: <code>userCount</code> or <code>numUsers</code>, not <code>users</code>.',
      ],
      detail: `<pre><code>const pricesByProductId = new Map();
for (const product of products) {
  pricesByProductId.set(product.id, product.price);
}</code></pre>`,
    },
    {
      title: 'Spelling & Consistency',
      level: 'intermediate',
      summary: 'Spell names correctly and use one variety of English (usually US) everywhere.',
      simple:
        "A typo in a name is a bug that lives forever: once recieve() is in a public API, you're stuck with it.",
      points: [
        'US vs UK: <em>color/colour, initialize/initialise, canceled/cancelled</em> — most code uses US.',
        'Classic typos: <em>recieve, seperate, occured, lenght, adress, sucess, dependancy</em>.',
        'Use a spell-checker plugin in your IDE (e.g. Code Spell Checker for VS Code).',
        'The HTTP <code>Referer</code> header is a famous typo that can never be fixed.',
      ],
    },
    {
      title: 'Comments',
      level: 'intermediate',
      summary: 'Write comments as clear sentences that explain why, not what.',
      simple:
        "The code already says what it does. A comment should tell the next dev the thing the code can't: the reason.",
      points: [
        'Explain why: <em>// Retry because the payment API sometimes returns 503 on cold start.</em>',
        'Use full sentences with a capital and period for longer comments.',
        'Short inline notes can be fragments: <em>// in ms</em>.',
        '<code>TODO</code> comments: say what and who — <em>// TODO(alice): remove after v3 migration.</em>',
      ],
      detail: `<pre><code>// ❌ Increment i.
i++;
// ✅ Skip the header row.
i++;</code></pre>`,
    },
    {
      title: 'Javadoc & JSDoc',
      level: 'advanced',
      summary: 'API docs start with a third-person verb phrase: "Returns…", "Creates…".',
      simple: 'Read it as if "This method…" comes before it: "(This method) Returns the user."',
      points: [
        'First sentence = summary, present tense, third person: <em>Returns</em>, <em>Sends</em>, not <em>Return</em> or <em>Will return</em>.',
        'Param descriptions are noun phrases, no period needed: <em>the user ID</em>.',
        'Say what happens on bad input: <em>Throws IllegalArgumentException if id is negative.</em>',
        "Don't repeat the name: <em>Gets the name</em> on <code>getName()</code> adds nothing — say what's special.",
      ],
      detail: `<pre><code>/**
 * Returns the user with the given ID, or empty if none exists.
 *
 * @param id the user ID, must be positive
 * @throws IllegalArgumentException if id is not positive
 */
Optional&lt;User&gt; findById(long id);</code></pre>`,
    },
    {
      title: 'Log & Error Messages',
      level: 'advanced',
      summary: 'Messages should say what happened, with context, in plain and consistent grammar.',
      simple:
        'An error message is a tiny note to a tired person at 3 am. Make it clear what broke and what to do.',
      points: [
        'Say what failed and why: <em>Failed to load config: file not found at /etc/app.yml</em>.',
        'Use past tense for events: <em>User created</em>, <em>Connection closed</em>.',
        'User-facing errors: explain the fix, no blame: <em>Enter a valid email address.</em>',
        'Avoid "Error: error occurred" — it says nothing.',
      ],
      detail: `<pre><code>// ❌
throw new Error("Invalid!!!");
// ✅
throw new Error(\`Invalid port "\${port}": expected a number from 1 to 65535.\`);</code></pre>`,
    },
  ],
};
