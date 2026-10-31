import type { KmNode } from '../../types';

export const antiPatterns: KmNode = {
  title: 'Anti-patterns',
  level: 'advanced',
  summary: 'Common ways microservice projects go wrong, and how to spot and fix them.',
  simple:
    'Knowing the traps is half the job. Most failed microservice projects fell into one of these.',
  children: [
    {
      title: 'Distributed Monolith',
      level: 'advanced',
      summary:
        'Services that must be changed and deployed together: all the costs, none of the benefits.',
      simple:
        'You split one big machine into ten boxes but glued them together with cables. Now it’s still one machine, just harder to move.',
      points: [
        'Signs: lock-step releases, one change touches five services, shared release dates.',
        'Causes: wrong boundaries, shared database, shared domain libraries, sync call chains.',
        'Fix: redraw boundaries around business capabilities, or merge services back.',
        'Merging services is a valid fix, not a failure.',
      ],
      tip: 'Ask: "Can this team deploy their service on a Friday without telling anyone?" If not, you may have a distributed monolith.',
    },
    {
      title: 'Shared Database',
      level: 'advanced',
      summary: 'Several services reading and writing the same tables.',
      points: [
        'Any schema change can break other teams’ services.',
        'No one really owns the data or its rules.',
        'Locks and heavy queries from one service slow the others.',
        'Fix: one owner per table; others use its API, events or a read copy.',
        'Read-only reporting replicas are fine if clearly separate.',
      ],
    },
    {
      title: 'Chatty Services',
      level: 'advanced',
      summary: 'Services that make many small calls to each other to finish one task.',
      simple:
        'Asking a colleague 20 separate questions by email instead of one meeting. Each email takes time, and one lost email blocks you.',
      points: [
        'Latency adds up: 20 calls × 20 ms = 400 ms before any real work.',
        'Often a sign the boundary is wrong: the data belongs together.',
        'Fix: batch endpoints, coarser APIs, local copies of data via events.',
        'Watch traces for "N+1 calls" patterns between services.',
      ],
    },
    {
      title: 'Long Sync Call Chains',
      level: 'advanced',
      summary: 'A → B → C → D, all waiting on each other in one request.',
      points: [
        'Availability multiplies: four services at 99.9% each give about 99.6% together.',
        'One slow service at the end slows the whole chain.',
        'Fix: use events for steps that don’t need an instant answer.',
        'Keep a copy of data you need often, instead of asking for it every time.',
      ],
    },
    {
      title: 'Nano-services',
      level: 'advanced',
      summary: 'Services so small that the overhead is bigger than the work they do.',
      points: [
        '"One service per entity" or per function usually ends up here.',
        'Every one needs a pipeline, monitoring, on-call and security.',
        'A simple feature now needs changes in many services.',
        'Size to a business capability and a team, not to a table.',
      ],
    },
    {
      title: 'Shared Domain Libraries',
      level: 'advanced',
      summary:
        'A common library of business models that every service must use and upgrade together.',
      points: [
        'One change to the shared <code>Customer</code> class forces every team to upgrade.',
        'Sneaks coupling back in through the build, not the network.',
        'Sharing technical libraries (logging, tracing setup) is fine.',
        'Share contracts (OpenAPI, schemas), not domain classes. Duplicate small models instead.',
      ],
    },
    {
      title: 'Big-Bang Rewrite',
      level: 'advanced',
      summary: 'Rebuilding the whole system as microservices at once, then switching over.',
      points: [
        'Takes years, while the old system keeps changing.',
        'No real feedback until the very end, when it is most expensive to fix.',
        'The switch-over day is a huge risk.',
        'Fix: migrate step by step with the strangler fig pattern.',
      ],
    },
    {
      title: 'Microservices Too Early',
      level: 'expert',
      summary: 'Adopting microservices before the team, domain or platform is ready.',
      points: [
        'Splitting before you understand the domain locks in wrong boundaries.',
        'No CI/CD, tracing or on-call → outages nobody can debug.',
        'Copying big tech companies whose problems you don’t have.',
        'A well-built modular monolith beats a badly built microservice system.',
      ],
      tip: 'Expert answer: microservices are a trade-off you choose for a specific pain, never a goal by themselves.',
    },
  ],
};
