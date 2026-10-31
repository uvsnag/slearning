import type { KmNode } from '../../types';

export const environments: KmNode = {
  title: 'Environments & Promotion',
  level: 'intermediate',
  summary:
    'Moving one build through dev, staging and production, with the right config at each step.',
  simple:
    'Like a play: first a rehearsal in the practice room, then a dress rehearsal on the real stage, and only then the show with an audience.',
  points: [
    'Build the artifact once; deploy that same artifact everywhere.',
    'Only configuration changes between environments.',
    'Each step up needs more confidence: tests, checks, maybe an approval.',
  ],
  children: [
    {
      title: 'Dev, Staging, Production',
      level: 'beginner',
      summary: 'Separate copies of your system for building, final checks and real users.',
      simple:
        'Dev is the kitchen where you experiment, staging is the tasting before the party, production is the party.',
      points: [
        'Dev/test: frequent deploys, can break.',
        'Staging: as close to production as you can afford, for final checks.',
        'Production: real users, real data, strict access.',
        'The more staging differs from production, the less it proves.',
      ],
    },
    {
      title: 'Config per Environment',
      level: 'intermediate',
      summary:
        'Keep settings like URLs and credentials outside the artifact and inject them per environment.',
      simple:
        'Same phone, different SIM card. The device doesn’t change; only the card that says which network to use.',
      points: [
        'Twelve-Factor rule: config in environment variables, not in code.',
        'Spring Boot: profiles and <code>application-{env}.yml</code>, or env vars overriding properties.',
        'Never bake secrets or environment URLs into the image.',
        'Keep the number of config differences small and visible.',
      ],
      detail: `<pre><code>// Node.js: read config at startup, fail fast if missing
const config = {
  dbUrl: process.env.DATABASE_URL,
  logLevel: process.env.LOG_LEVEL ?? 'info',
};
if (!config.dbUrl) throw new Error('DATABASE_URL is not set');</code></pre>`,
    },
    {
      title: 'Build Once, Deploy Many',
      level: 'intermediate',
      summary:
        'Promote the exact same artifact from staging to production instead of rebuilding it.',
      simple:
        'You test-drive a car, then you buy that same car, not a new one built from the same drawings.',
      points: [
        'Rebuilding per environment can pull different dependencies and ship untested bits.',
        'Identify the artifact by version or image digest and promote it.',
        'Environment differences come only from config.',
      ],
      tip: 'Classic interview point: what you tested is exactly what you ship.',
    },
    {
      title: 'Promotion & Approvals',
      level: 'intermediate',
      summary:
        'Rules for moving a release to the next environment: automatic checks, manual approvals, time windows.',
      simple: 'A relay with checkpoints: the baton passes on only after the judge nods.',
      points: [
        'Protected environments in GitHub/GitLab require reviewers before deploy jobs run.',
        'Automate as many checks as possible; keep approvals for real decisions.',
        'Record who deployed what and when, for audits and debugging.',
      ],
    },
    {
      title: 'Preview Environments',
      level: 'advanced',
      summary: 'A short-lived environment created for each pull request and destroyed after merge.',
      points: [
        'Reviewers, designers and testers can click the real change before it merges.',
        'Common with Vercel/Netlify for frontends and Kubernetes namespaces for backends.',
        'Needs infrastructure as code and seeded test data to be practical.',
        'Watch costs; always clean up when the PR closes.',
      ],
    },
  ],
};
