import type { KmNode } from '../../types';

export const testing: KmNode = {
  title: 'Automated Testing',
  level: 'intermediate',
  summary:
    'The tests a pipeline runs, how to balance them, and how to keep them fast and trustworthy.',
  simple:
    'Tests are the safety net under the trapeze. Without them, continuous deployment is just continuous falling.',
  points: [
    'Many fast unit tests, fewer integration tests, very few end-to-end tests.',
    'A test suite people don’t trust (flaky) is almost worse than none.',
    'Fast feedback matters: aim for a PR pipeline of about 10 minutes or less.',
  ],
  children: [
    {
      title: 'Test Pyramid',
      level: 'beginner',
      summary: 'Lots of small fast tests at the bottom, fewer slow broad tests at the top.',
      simple:
        'Like checking a car: test each bolt quickly in the factory, test the engine on a bench, and do only a few full road trips.',
      points: [
        'Unit tests: many, milliseconds each.',
        'Integration tests: fewer, check parts work together (DB, HTTP).',
        'End-to-end tests: a handful of key user journeys.',
        'An "ice cream cone" (mostly manual and E2E tests) is slow and fragile.',
      ],
    },
    {
      title: 'Unit Tests',
      level: 'beginner',
      summary: 'Fast tests of one small piece of code, with no network, database or file system.',
      simple: 'Test one LEGO brick on its own before building the castle.',
      points: [
        'Run on every push; they should finish in seconds or a few minutes.',
        'Java: JUnit 5 + AssertJ/Mockito. JavaScript: Vitest or Jest.',
        'A failing unit test should point straight at the broken code.',
      ],
      detail: `<pre><code>import { describe, it, expect } from 'vitest';
import { applyDiscount } from './price.js';

describe('applyDiscount', () =&gt; {
  it('takes 10% off', () =&gt; {
    expect(applyDiscount(100, 0.1)).toBe(90);
  });
});</code></pre>`,
    },
    {
      title: 'Integration Tests',
      level: 'intermediate',
      summary:
        'Tests that check your code works with real dependencies like a database or message broker.',
      simple:
        'You’ve tested the plug and the socket separately. Now you plug it in and see if the light turns on.',
      points: [
        'Testcontainers starts a real PostgreSQL, Kafka or Redis in Docker for the test.',
        'Much more realistic than an in-memory fake database.',
        'Slower than unit tests; run them in a separate stage or job if needed.',
      ],
      detail: `<pre><code>@Testcontainers
@SpringBootTest
class OrderRepositoryIT {
  @Container
  @ServiceConnection
  static PostgreSQLContainer&lt;?&gt; db = new PostgreSQLContainer&lt;&gt;("postgres:17");

  @Autowired OrderRepository repo;

  @Test
  void savesOrder() {
    assertThat(repo.save(new Order("book")).getId()).isNotNull();
  }
}</code></pre>`,
    },
    {
      title: 'End-to-End Tests',
      level: 'intermediate',
      summary: 'Tests that drive the real app through a browser or API, like a user would.',
      simple: 'A dress rehearsal: the whole show, start to finish, on the real stage.',
      points: [
        'Tools: Playwright, Cypress, Selenium.',
        'Cover only the critical paths: login, checkout, sign-up.',
        'Run against a deployed test environment, often after deploy to staging.',
        'They break easily; use stable selectors (roles, test ids), not CSS paths.',
      ],
    },
    {
      title: 'Contract Tests',
      level: 'advanced',
      summary:
        'Check that a service and its consumers agree on the API, without running both together.',
      points: [
        'The consumer writes down what it expects (the contract); the provider verifies it in its own pipeline.',
        'Tools: Pact, Spring Cloud Contract.',
        'Catches breaking API changes before deploy, without a shared E2E environment.',
        'Very useful in microservices, where full E2E setups get huge.',
      ],
    },
    {
      title: 'Flaky Tests',
      level: 'intermediate',
      summary: 'Tests that sometimes pass and sometimes fail without any code change.',
      simple:
        'A smoke alarm that goes off randomly. Soon everyone ignores it, including the day there’s a real fire.',
      points: [
        'Common causes: timing and sleeps, shared state between tests, test order, real network calls.',
        'Wait for a condition instead of sleeping a fixed time.',
        'Quarantine a flaky test quickly, then fix or delete it.',
        'Automatic retries hide the problem; use them only as a short-term bandage.',
      ],
      detail: `<pre><code>// Flaky: hopes 500 ms is always enough
await page.click('#save');
await page.waitForTimeout(500);

// Stable: waits for the real signal
await page.click('#save');
await expect(page.getByText('Saved')).toBeVisible();</code></pre>`,
    },
    {
      title: 'Code Coverage',
      level: 'intermediate',
      summary: 'The share of code lines or branches your tests run; a hint, not a quality score.',
      simple:
        'Coverage tells you which rooms the inspector walked through, not whether they checked anything in them.',
      points: [
        'Tools: JaCoCo (Java), V8/Istanbul via Vitest or Jest (JavaScript).',
        'Useful to spot untested areas, not as a goal by itself.',
        'Gate on "coverage of new code" rather than a total number.',
        '100% coverage with weak assertions still misses bugs; mutation testing (PIT, Stryker) checks test strength.',
      ],
    },
  ],
};
