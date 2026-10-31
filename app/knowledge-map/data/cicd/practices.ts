import type { KmNode } from '../../types';

export const bestPractices: KmNode = {
  title: 'Best Practices & Interviews',
  level: 'advanced',
  summary:
    'How to design pipelines that stay fast and safe, the classic mistakes, and common interview questions.',
  simple:
    'This is the "lessons learned" shelf: what experienced teams wish they had known when they built their first pipeline.',
  points: [
    'Fast, reliable, secure: in that order of what people notice first.',
    'Treat the pipeline as a product with owners and maintenance.',
    'Most pipeline pain comes from slowness, flakiness and big batches.',
  ],
  children: [
    {
      title: 'Fast Feedback',
      level: 'intermediate',
      summary: 'Order and split the pipeline so developers learn about problems within minutes.',
      simple:
        'Check the cheap things first. Don’t run a two-hour test if a typo can be caught in ten seconds.',
      points: [
        'Fail fast: lint and unit tests before slow integration and E2E tests.',
        'Run independent jobs in parallel; cache dependencies.',
        'Move very slow suites to after merge or to a nightly run.',
        'Track pipeline duration like any other metric; set a budget.',
      ],
    },
    {
      title: 'Keep Main Green',
      level: 'intermediate',
      summary:
        'The main branch should always build and pass tests, so it’s always ready to release.',
      simple:
        'The shared kitchen must stay clean. If you spill, you clean up right now, before anyone else cooks.',
      points: [
        'Require passing checks before merge.',
        'If main breaks, fix it or revert at once; revert is often fastest.',
        'Merge queues test PRs together with the latest main before merging.',
        'Small PRs make breakages rare and easy to find.',
      ],
    },
    {
      title: 'Securing the Pipeline',
      level: 'advanced',
      summary:
        'Lock down the CI system itself, because it can reach your code, secrets and production.',
      points: [
        'Least privilege: default the CI token to read-only and grant more per job.',
        'Don’t expose secrets to PRs from forks; be careful with <code>pull_request_target</code> in GitHub Actions.',
        'Pin third-party actions, images and tools by SHA or digest.',
        'Protect production deploys with environments, approvals and branch rules.',
        'Never print secrets; check logs for accidental leaks.',
      ],
    },
    {
      title: 'Monorepo Pipelines',
      level: 'expert',
      summary: 'In a repo with many projects, build and test only what a change actually affects.',
      points: [
        'Path filters or "affected" detection skip untouched projects.',
        'Tools: Nx, Turborepo (JavaScript), Gradle composite builds, Bazel.',
        'Remote build caches share results between CI runs and developers.',
        'Watch for hidden dependencies that make "affected" detection miss things.',
      ],
    },
    {
      title: 'Common Pitfalls',
      level: 'intermediate',
      summary: 'Mistakes that make pipelines slow, fragile or unsafe.',
      simple:
        'A list of potholes most teams hit at least once. Knowing where they are helps you steer around them.',
      points: [
        'Rebuilding the artifact for each environment.',
        'Flaky tests that everyone just re-runs.',
        'Long-lived branches and big-bang merges.',
        'Secrets in code, logs, or long-lived cloud keys.',
        'Manual steps "only Bob knows" in the release process.',
        'No tested rollback plan, especially for database changes.',
      ],
    },
    {
      title: 'Interview Topics',
      level: 'advanced',
      summary: 'Questions that come up again and again, with the core of a good answer.',
      points: [
        'CI vs continuous delivery vs continuous deployment.',
        'Walk through a pipeline you built: stages, tools, how long it takes, what you improved.',
        'Blue-green vs canary vs rolling: cost, speed of rollback, risk.',
        'How do you handle secrets and database migrations in CI/CD?',
        'How do you deal with flaky tests and a slow pipeline?',
        'What DORA metrics are and how you would improve one.',
      ],
      tip: 'Answer with a real example: "Our pipeline took 40 minutes; we parallelized tests and cached Gradle, now it’s 9." Numbers make it believable.',
    },
  ],
};
