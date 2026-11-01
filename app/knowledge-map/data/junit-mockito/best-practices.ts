import type { KmNode } from '../../types';

export const bestPractices: KmNode = {
  title: 'Test Design',
  level: 'intermediate',
  summary:
    'How to write tests that are fast, reliable and worth keeping: mocking rules, smells, coverage, TDD.',
  simple:
    'Anyone can write a test. Writing tests your team still trusts in two years is the real skill.',
  points: [
    'Test behaviour (what the code does), not implementation (how it does it).',
    'Mock at the edges of your system, use real objects inside.',
    'Measure coverage, but judge quality with mutation testing and review.',
  ],
  children: [
    {
      title: 'F.I.R.S.T.',
      level: 'beginner',
      summary: 'Five marks of a good unit test: Fast, Independent, Repeatable, Self-validating, Timely.',
      simple:
        'Like a good smoke alarm: it reacts in a second, works on its own, never false-alarms, beeps clearly, and was fitted before the fire.',
      points: [
        'Fast: milliseconds, so you happily run thousands of them.',
        'Independent: no test relies on another one or on run order.',
        'Repeatable: same result on your laptop, on CI, today and next year.',
        'Self-validating: it passes or fails by itself. No reading logs by eye.',
        'Timely: written close to the code, ideally just before it (TDD).',
      ],
      tip: 'A classic interview question. Name the five words and give one bad example for each.',
    },
    {
      title: 'Test naming & structure',
      level: 'beginner',
      summary: 'One behaviour per test, a name that says what should happen, and clear AAA blocks.',
      simple: 'A good test name is a headline: you know the story before reading the article.',
      points: [
        'Patterns: <code>shouldRejectEmptyCart()</code> or <code>withdraw_moreThanBalance_throws()</code>.',
        'One reason to fail per test.',
        'No <code>if</code> or loops in tests. Use parameterized tests instead.',
        'Test data builders (<code>anOrder().withTotal(50).build()</code>) keep arrange short.',
      ],
    },
    {
      title: 'What to mock',
      level: 'intermediate',
      summary: 'Mock slow or outside things; use real objects for simple, in-process logic.',
      simple:
        'You fake the delivery truck, not the shopping list. The list is cheap and safe to use for real.',
      points: [
        'Mock: databases, HTTP clients, message brokers, clocks, random numbers.',
        'Do not mock value objects (DTOs, records, <code>String</code>, <code>List</code>). Just create them.',
        'Do not mock types you do not own. Wrap them in your own interface and mock that.',
        'Too many mocks in one test? The class probably does too much.',
      ],
      tip: 'Inject a java.time.Clock instead of calling LocalDate.now(). Then tests can freeze time without static mocks.',
    },
    {
      title: 'Testing time & async',
      level: 'intermediate',
      summary: 'Freeze the clock and wait smartly, so tests about dates and background work stay reliable.',
      simple:
        'Instead of waiting for a real Monday to test Monday deals, you set the calendar on the wall to Monday.',
      points: [
        'Inject a <code>java.time.Clock</code>; in tests pass <code>Clock.fixed(…)</code>.',
        'No more <code>LocalDate.now()</code> or static mocks to control time.',
        'For async code, Awaitility polls until a condition is true, with a time limit.',
        'Never use <code>Thread.sleep</code>: too short is flaky, too long is slow.',
      ],
      detail: `<pre><code>var clock = Clock.fixed(Instant.parse("2026-01-05T10:00:00Z"), ZoneOffset.UTC);
var deals = new DealService(clock);
assertTrue(deals.isMondayDeal());

service.sendAsync(order);
await().atMost(Duration.ofSeconds(2))
    .until(() -&gt; outbox.size() == 1);</code></pre>`,
    },
    {
      title: 'Testing private methods',
      level: 'intermediate',
      summary: 'Test private code through the public methods that use it, not with reflection.',
      simple:
        'You judge a car by driving it, not by unscrewing the engine to poke one gear.',
      points: [
        'Private methods are details. Public behaviour is what callers rely on.',
        'Testing privates with reflection breaks on every refactor.',
        'Hard to reach through the public API? Maybe it wants to be its own class.',
        'Package-private plus a same-package test is an OK compromise.',
      ],
      tip: 'In an interview: "I test behaviour through the public API. If a private method needs its own tests, I extract a class."',
    },
    {
      title: 'Test smells',
      level: 'intermediate',
      summary: 'Warning signs that a test is hard to read, fragile or not really testing anything.',
      simple: 'Like a strange smell in the fridge: not always a disaster, but go check.',
      points: [
        'Over-mocking: the test just repeats the code line by line.',
        'Fragile tests break on harmless refactors because they check internals.',
        'Mystery guest: data comes from a hidden file or shared setup.',
        'Huge setup, many asserts on unrelated things, or no assert at all.',
        '<code>Thread.sleep</code> in tests: slow and still unreliable.',
      ],
    },
    {
      title: 'Flaky tests',
      level: 'intermediate',
      summary: 'Tests that sometimes pass and sometimes fail with no code change.',
      simple:
        'A smoke alarm that goes off randomly. Soon everyone ignores it, even when there is real smoke.',
      points: [
        'Common causes: time, randomness, test order, shared state, async code, network.',
        'Freeze time with a fixed <code>Clock</code>; seed random generators.',
        'Use Awaitility to wait for async results instead of <code>sleep</code>.',
        'Quarantine and fix quickly; do not just add retries.',
      ],
      tip: 'Run the suite with random order (MethodOrderer.Random) to expose hidden dependencies.',
    },
    {
      title: 'Coverage with JaCoCo',
      level: 'intermediate',
      summary: 'JaCoCo measures which lines and branches your tests actually run.',
      simple:
        'A map that colours the roads you drove on. It shows where you have not been, not whether you drove well.',
      points: [
        'Runs as a Java agent and records executed bytecode.',
        'Line coverage and branch coverage (both sides of every <code>if</code>).',
        'Generates HTML reports; CI can fail the build below a threshold.',
        '100% coverage does not mean bug-free: a test without asserts still covers lines.',
      ],
      tip: 'Use coverage to find untested areas, not as a target. Around 70–80% on business logic is a common, sane goal.',
    },
    {
      title: 'TDD',
      level: 'intermediate',
      summary: 'Test-driven development: write a failing test first, make it pass, then clean up.',
      simple:
        'Like writing the exam question before studying: you know exactly what "done" looks like.',
      points: [
        'Red: write a small test that fails.',
        'Green: write the simplest code to pass it.',
        'Refactor: clean the code while tests stay green.',
        'Gives you testable design and a full safety net as a side effect.',
      ],
      tip: 'In interviews, describe the red-green-refactor loop and admit when you do not use it, like quick spikes.',
    },
    {
      title: 'Mutation testing (PIT)',
      level: 'advanced',
      summary:
        'PIT changes your code on purpose and checks your tests notice. It tests your tests.',
      simple:
        'A teacher slips a wrong answer into the answer key. If no student complains, they were not really checking.',
      points: [
        'A mutant is a small code change, like <code>&gt;</code> to <code>&gt;=</code> or removing a call.',
        'Killed mutant: a test failed. Good. Survived: your tests missed it.',
        'Mutation score is a far better quality signal than line coverage.',
        'Needs the <code>pitest-junit5-plugin</code>. Slow, so run it on key modules.',
      ],
    },
    {
      title: 'Classic vs mockist',
      level: 'advanced',
      summary: 'Two testing schools: use real collaborators where you can, or mock every collaborator.',
      points: [
        'Classic (Detroit / Chicago school): real objects inside, fakes only at slow or outside edges.',
        'Mockist (London school): mock every collaborator and verify the messages between objects.',
        'Classic tests survive refactors better; mockist tests point to the exact broken class.',
        'Mockist style pairs with outside-in TDD: start from the API, mock what is not built yet.',
        'Most teams mix: classic for domain logic, mocks for ports to the outside world.',
      ],
      tip: 'Martin Fowler’s essay "Mocks Aren’t Stubs" is the classic read on this.',
    },
  ],
};
