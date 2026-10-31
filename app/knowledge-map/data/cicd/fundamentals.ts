import type { KmNode } from '../../types';

export const fundamentals: KmNode = {
  title: 'CI/CD Fundamentals',
  level: 'beginner',
  summary: 'What CI, continuous delivery and continuous deployment mean, and why teams use them.',
  simple:
    'CI/CD is a conveyor belt for code. You put a change on the belt, machines build and check it, and it rolls out to users without anyone carrying it by hand.',
  points: [
    'CI = merge small changes often and test each one automatically.',
    'CD = keep every passing change ready to release (delivery) or release it automatically (deployment).',
    'The goal is small, safe, boring releases instead of big scary ones.',
  ],
  children: [
    {
      title: 'Continuous Integration',
      level: 'beginner',
      summary:
        'Everyone merges small changes into the main branch often, and each merge is built and tested automatically.',
      simple:
        'Like a group writing one document: if everyone adds a paragraph every day and someone proofreads each one, you never end up with five versions that don’t fit together.',
      points: [
        'Developers merge to the main branch at least daily.',
        'Every push triggers an automatic build and test run.',
        'A broken build is fixed right away; it’s the team’s top priority.',
        'Catches "works on my machine" and merge conflicts early, while they’re small.',
      ],
      tip: 'Running a build server is not CI by itself. If branches live for weeks before merging, you’re not really integrating continuously.',
    },
    {
      title: 'Continuous Delivery',
      level: 'beginner',
      summary:
        'Every change that passes the pipeline is ready to go to production; a human presses the release button.',
      simple:
        'The cake is always baked, boxed and labeled. Someone just decides when to hand it to the customer.',
      points: [
        'The pipeline produces a deployable artifact for every good commit.',
        'Deploying to production is one click (or one approval), not a project.',
        'Release timing becomes a business decision, not a technical one.',
      ],
    },
    {
      title: 'Continuous Deployment',
      level: 'beginner',
      summary:
        'Every change that passes all checks goes to production automatically, with no manual step.',
      simple:
        'Same baked cake, but now a robot hands it to the customer the moment it passes inspection.',
      points: [
        'Needs strong automated tests and monitoring, because no human checks it.',
        'Usually paired with feature flags, so unfinished features stay hidden.',
        'Teams doing this often deploy many times a day.',
      ],
      tip: 'Interview one-liner: "Delivery means always ready to release; deployment means every good change actually is released."',
    },
    {
      title: 'Why CI/CD?',
      level: 'beginner',
      summary: 'Faster feedback, smaller risk per release, and less manual, error-prone work.',
      simple:
        'Carrying one small box down the stairs is easy. Carrying the whole wardrobe once a quarter is where people get hurt.',
      points: [
        'Small changes are easy to review, test and roll back.',
        'Bugs are found minutes after they’re written, not weeks later.',
        'Machines repeat the same steps every time; people forget steps.',
        'Users get fixes and features sooner.',
      ],
    },
    {
      title: 'The Pipeline at a Glance',
      level: 'beginner',
      summary:
        'The usual path: commit → build → test → scan → package → deploy to test envs → deploy to production.',
      simple:
        'An assembly line with stations. Each station checks one thing, and a faulty part is pulled off the line before it reaches the customer.',
      points: [
        'Trigger: a push or pull request starts the pipeline.',
        'Build &amp; test: compile, run unit tests, lint.',
        'Package: create one artifact (a JAR, a bundle, a Docker image).',
        'Deploy: push the same artifact through staging to production.',
        'Verify: smoke tests and monitoring confirm it works.',
      ],
    },
  ],
};
