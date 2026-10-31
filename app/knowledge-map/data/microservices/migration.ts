import type { KmNode } from '../../types';

export const migration: KmNode = {
  title: 'Migrating a Monolith',
  level: 'advanced',
  summary: 'Moving from a monolith to services step by step, without a risky big-bang rewrite.',
  simple:
    'You renovate a house room by room while still living in it, instead of knocking it all down and living in a tent for two years.',
  children: [
    {
      title: 'Where to Start',
      level: 'intermediate',
      summary: 'Pick a first service that is valuable, fairly separate and low risk.',
      simple:
        'When you learn to juggle, you start with one ball, not with knives. Pick an easy, useful piece first and learn from it.',
      points: [
        'Have a clear reason: team bottlenecks, slow releases, a part that needs to scale.',
        'Build the platform basics first: CI/CD, containers, logging, tracing.',
        'Good first candidates: parts that change often and have few dependencies.',
        'Avoid starting with the core everything depends on (e.g. the User model).',
        'Modularise inside the monolith first. It shows you where the seams are.',
      ],
    },
    {
      title: 'Strangler Fig',
      level: 'advanced',
      summary:
        'Put a proxy in front of the monolith and move features to new services one route at a time.',
      simple:
        'A strangler fig vine grows around an old tree. Over years the vine takes over and the old tree can be removed.',
      points: [
        'Named by Martin Fowler (2004).',
        'All traffic goes through a gateway or proxy.',
        'Move one feature to a new service, then switch its route.',
        'Roll back by pointing the route back at the monolith.',
        'Repeat until the monolith is small enough to retire, or is happily small.',
      ],
      detail: `<pre><code>// Spring Cloud Gateway: new service takes /invoices, everything else stays
return b.routes()
    .route("invoices", r -&gt; r.path("/invoices/**").uri("lb://invoice-service"))
    .route("legacy",   r -&gt; r.path("/**").uri("http://legacy-monolith:8080"))
    .build();</code></pre>`,
    },
    {
      title: 'Anti-Corruption Layer',
      level: 'advanced',
      summary:
        'A translation layer that keeps the old system’s messy model out of your new service.',
      simple:
        'An interpreter between two people who speak different languages, so neither has to learn the other’s.',
      points: [
        'The new service talks to the monolith only through this adapter.',
        'Maps old names and odd data shapes to your clean domain model.',
        'When the monolith part is gone, you delete the layer, not your domain code.',
      ],
    },
    {
      title: 'Branch by Abstraction',
      level: 'advanced',
      summary:
        'Hide a feature behind an interface inside the monolith, then swap the implementation.',
      points: [
        'Step 1: put an interface in front of the existing code.',
        'Step 2: add a new implementation that calls the new service.',
        'Step 3: switch with a feature flag, then remove the old code.',
        'Works when the feature is deep inside the monolith, not reachable by URL.',
      ],
    },
    {
      title: 'Splitting the Data',
      level: 'expert',
      summary:
        'Moving a feature’s tables out of the shared database: the hardest part of migration.',
      points: [
        'Move the code first, then the data, in separate steps.',
        'Find every query and join that touches the tables you want to move.',
        'Temporarily sync data both ways (CDC or events) while both sides need it.',
        'Pick one owner for each piece of data; other services read through its API.',
        'Joins become API calls or local read copies.',
      ],
    },
    {
      title: 'Parallel Run',
      level: 'expert',
      summary: 'Run old and new implementations side by side and compare their answers.',
      points: [
        'The old system still gives the real answer; the new one runs in the shadow.',
        'Log and review every difference before switching over.',
        'Ideal for risky logic: pricing, tax, billing.',
        'Make sure the shadow run never causes side effects (no emails, no charges).',
      ],
      tip: 'GitHub’s open-source Scientist library popularised this idea for refactoring.',
    },
  ],
};
