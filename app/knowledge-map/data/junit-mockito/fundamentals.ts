import type { KmNode } from '../../types';

export const fundamentals: KmNode = {
  title: 'Testing Basics',
  level: 'beginner',
  summary: 'Why you write tests, what kinds exist, and the simple shape every good test follows.',
  simple:
    'Tests are a safety net under a tightrope. You can move fast and try bold changes, because if you slip, the net catches you before users do.',
  points: [
    'A unit test checks one small piece of code, fast and alone.',
    'JUnit runs your tests and checks results. Mockito fakes the things your code depends on.',
    'Good tests follow one shape: Arrange, Act, Assert.',
  ],
  children: [
    {
      title: 'Why unit tests?',
      level: 'beginner',
      summary: 'Small automatic checks that tell you in seconds if your code still works.',
      simple:
        'It is like a smoke alarm in every room. You hope it stays quiet, but when something burns, you hear it right away and know which room.',
      points: [
        'Catch bugs minutes after you write them, not weeks later in production.',
        'Refactor (clean up code) without fear: the tests tell you if behaviour changed.',
        'They document how code should behave, with real examples that never go stale.',
        'Hard-to-test code is often badly designed code. Tests push you to better design.',
      ],
      tip: 'A test that never fails is useless. Make sure each test can actually go red when the code is wrong.',
    },
    {
      title: 'Test pyramid',
      level: 'beginner',
      summary:
        'Have many fast unit tests, fewer integration tests and only a few end-to-end tests.',
      simple:
        'Think of a pyramid of boxes: a wide base of cheap, quick checks, and a small tip of slow, expensive full-system checks.',
      points: [
        'Unit tests: one class, no database or network, milliseconds each.',
        'Integration tests: several parts together, e.g. service + real database.',
        'End-to-end (E2E) tests: the whole system, like a real user would use it.',
        'Higher up = slower, more fragile, harder to debug. Keep the top small.',
        'Idea popularised by Mike Cohn around 2009.',
      ],
      tip: 'An "ice-cream cone" (mostly E2E, few unit tests) is a classic anti-pattern: slow builds and flaky failures.',
    },
    {
      title: 'Arrange, Act, Assert',
      level: 'beginner',
      summary: 'Every test has three steps: set things up, run the code, check the result.',
      simple:
        'Like a cooking test: lay out the ingredients (arrange), cook the dish (act), taste it (assert).',
      points: [
        'Arrange: create objects, prepare inputs, set up fakes.',
        'Act: call the one method you are testing. Usually one line.',
        'Assert: check the result or the side effect.',
        'Given-When-Then is the same idea in BDD words (behaviour-driven development).',
        'Separate the three parts with a blank line so the test reads at a glance.',
      ],
      detail: `<pre><code>@Test
void addsVatToPrice() {
  // Arrange (given)
  var calc = new PriceCalculator(0.10);
  // Act (when)
  double total = calc.withVat(100.0);
  // Assert (then)
  assertEquals(110.0, total, 0.001);
}</code></pre>`,
    },
    {
      title: 'Unit vs integration',
      level: 'beginner',
      summary:
        'A unit test checks one piece alone; an integration test checks pieces working together.',
      simple:
        'Testing one Lego brick for cracks is a unit test. Snapping bricks together to see if they fit is an integration test.',
      points: [
        'Unit: replace slow or outside things (DB, HTTP, clock) with fakes.',
        'Integration: use real parts, e.g. a real database in Docker.',
        'Both use JUnit. Only the setup and speed differ.',
        'Maven convention: <code>*Test</code> for unit tests, <code>*IT</code> for integration tests.',
      ],
    },
    {
      title: 'JUnit & Mockito',
      level: 'beginner',
      summary:
        'JUnit runs and checks tests; Mockito creates fake objects to replace real dependencies.',
      simple:
        'JUnit is the referee who runs the match and keeps score. Mockito supplies stunt doubles so you do not need the real actors on set.',
      points: [
        'JUnit 5 (2017) is the standard Java test framework; JUnit 6.0 arrived in September 2025.',
        'Mockito is the most used mocking library. Mockito 5 needs Java 11+.',
        'They join through <code>MockitoExtension</code> from <code>mockito-junit-jupiter</code>.',
        'AssertJ is a popular add-on for readable assertions.',
      ],
      tip: 'In an interview: "JUnit runs tests and checks results, Mockito isolates the class under test by faking its collaborators."',
    },
  ],
};
