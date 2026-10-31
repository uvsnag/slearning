import type { KmNode } from '../../types';

export const exceptions: KmNode = {
  title: 'Exceptions',
  level: 'beginner',
  summary:
    'How Java signals and handles errors: throwing, catching, cleaning up, and doing it well.',
  simple:
    'An exception is an alarm. Something went wrong, so normal work stops and the alarm travels up until someone handles it.',
  points: [
    'Throw with <code>throw</code>, handle with <code>try</code>/<code>catch</code>.',
    'An uncaught exception ends the thread and prints a stack trace.',
    'Good error handling makes bugs easy to find instead of hiding them.',
  ],
  children: [
    {
      title: 'Exception Hierarchy',
      level: 'beginner',
      summary:
        'All errors extend Throwable, which splits into Error (fatal) and Exception (recoverable).',
      simple:
        'Error is the building on fire: you get out. Exception is a flat tire: you can fix it and keep going.',
      points: [
        '<code>Error</code>: serious JVM problems like <code>OutOfMemoryError</code>, <code>StackOverflowError</code>. Do not catch.',
        '<code>Exception</code>: problems your code may recover from.',
        '<code>RuntimeException</code>: a subclass of Exception for programming bugs.',
        'Every exception carries a message, a stack trace and an optional cause.',
      ],
      detail: `<pre><code>Throwable
 ├─ Error              (OutOfMemoryError, StackOverflowError)
 └─ Exception          (IOException, SQLException)  &lt;- checked
     └─ RuntimeException (NullPointerException,
                          IllegalArgumentException) &lt;- unchecked</code></pre>`,
    },
    {
      title: 'Checked vs Unchecked',
      level: 'beginner',
      summary:
        'Checked exceptions must be caught or declared; unchecked ones (RuntimeException) do not.',
      simple:
        'Checked is a sign at the door: "Watch the step!", and the compiler makes you read it. Unchecked is tripping over your own shoelaces: your own fault.',
      points: [
        'Checked: subclasses of <code>Exception</code> but not <code>RuntimeException</code>, e.g. <code>IOException</code>.',
        'You must <code>catch</code> them or add <code>throws</code> to the method.',
        'Unchecked: <code>RuntimeException</code> and <code>Error</code>; the compiler does not force handling.',
        'Checked = outside problems the caller can react to; unchecked = bugs or bad input.',
        'Lambdas and streams do not play well with checked exceptions; many modern libraries use unchecked only.',
      ],
      tip: 'Common interview question. Give one example of each and say when you would choose each.',
    },
    {
      title: 'try / catch / finally',
      level: 'beginner',
      summary: 'try runs risky code, catch handles a failure, finally always runs for cleanup.',
      simple:
        'try is "attempt the jump", catch is the safety net, finally is putting the equipment away whether you landed or not.',
      points: [
        'Catch the most specific exceptions first.',
        'Multi-catch: <code>catch (IOException | SQLException e)</code>.',
        '<code>finally</code> runs even after <code>return</code> or an exception.',
        'Never <code>return</code> from <code>finally</code>; it hides the original exception.',
      ],
      detail: `<pre><code>try {
  int n = Integer.parseInt(input);
  process(n);
} catch (NumberFormatException e) {
  log.warn("Bad number: {}", input);
} finally {
  metrics.increment("parsed");
}</code></pre>`,
    },
    {
      title: 'try-with-resources',
      level: 'intermediate',
      summary: 'A try that closes files, connections and streams for you automatically (Java 7+).',
      simple:
        'Like a hotel room that locks itself when you leave. You cannot forget to close the door.',
      points: [
        'Works with anything that implements <code>AutoCloseable</code>.',
        'Resources close in reverse order, even if an exception is thrown.',
        'If closing also fails, that error is added as a suppressed exception.',
        'Since Java 9 you can reuse an existing effectively-final variable: <code>try (conn)</code>.',
      ],
      detail: `<pre><code>try (var in = Files.newBufferedReader(path);
     var out = Files.newBufferedWriter(target)) {
  in.transferTo(out);
} // both closed here, out first</code></pre>`,
      tip: 'Any time you see close() in a finally block, rewrite it as try-with-resources.',
    },
    {
      title: 'Custom Exceptions',
      level: 'intermediate',
      summary: 'Your own exception classes that name a specific problem in your domain.',
      simple:
        'Instead of a generic "something broke", you get a clear label like "Insufficient funds".',
      points: [
        'Extend <code>RuntimeException</code> (most common) or <code>Exception</code> if callers must handle it.',
        'Provide constructors that take a message and a cause.',
        'Add useful fields, like an order id or error code.',
        'Do not create one class per tiny case; keep a small, meaningful set.',
      ],
      detail: `<pre><code>public class InsufficientFundsException extends RuntimeException {
  private final BigDecimal missing;
  public InsufficientFundsException(BigDecimal missing) {
    super("Missing " + missing);
    this.missing = missing;
  }
}</code></pre>`,
    },
    {
      title: 'NullPointerException',
      level: 'beginner',
      summary: 'Thrown when you use a null reference as if it pointed to an object.',
      simple:
        'You try to call a phone number from an empty contact. There is nobody to call, so Java complains.',
      points: [
        'Causes: calling a method on null, unboxing a null wrapper, reading a field of null.',
        'Helpful NPE messages (Java 14+, on by default since 15) say exactly which part was null.',
        'Prevent with <code>Objects.requireNonNull</code>, Optional returns, and empty collections instead of null.',
        'Other common ones: <code>IllegalArgumentException</code>, <code>IllegalStateException</code>, <code>IndexOutOfBoundsException</code>, <code>ClassCastException</code>.',
      ],
      detail: `<pre><code>user.getAddress().getCity();
// Exception: Cannot invoke "Address.getCity()"
//   because the return value of "User.getAddress()" is null</code></pre>`,
    },
    {
      title: 'Best Practices',
      level: 'advanced',
      summary: 'Rules that keep errors visible, meaningful and easy to debug.',
      points: [
        'Never swallow: an empty <code>catch</code> hides bugs. At least log it.',
        'Wrap with the cause: <code>throw new ServiceException("load failed", e)</code> keeps the original stack trace.',
        'Fail fast: check inputs early and throw <code>IllegalArgumentException</code> with a clear message.',
        'Log or rethrow, not both, or the same error appears many times.',
        'Do not use exceptions for normal flow control; they are slow and confusing.',
        'Catch <code>Exception</code> broadly only at the top (e.g. a request handler).',
      ],
      detail: `<pre><code>try {
  return repo.load(id);
} catch (SQLException e) {
  throw new DataAccessException("Load user " + id + " failed", e);
}</code></pre>`,
      tip: 'If you catch InterruptedException, call Thread.currentThread().interrupt() to keep the signal.',
    },
  ],
};
