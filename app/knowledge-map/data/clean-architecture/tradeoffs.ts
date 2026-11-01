import type { KmNode } from '../../types';

export const tradeoffs: KmNode = {
  title: 'Trade-offs & Pitfalls',
  level: 'advanced',
  summary: 'When Clean Architecture pays off, when it doesn’t, and the mistakes teams keep making.',
  simple:
    'A seatbelt, airbags and a roll cage make sense for a race car. For a bike ride to the shop, they just slow you down.',
  points: [
    'Every boundary costs code, time and attention.',
    'Use it where the business logic is rich and long-lived.',
    'Most failures come from applying it mechanically, everywhere.',
  ],
  children: [
    {
      title: 'Trade-offs',
      level: 'advanced',
      summary: 'Weigh more indirection and code against easier testing and change.',
      points: [
        'Gains: testable core, clear structure, delayed tech decisions.',
        'Costs: more classes, mappers, interfaces and onboarding time.',
        'Value grows with domain complexity and project lifetime.',
      ],
      children: [
        {
          title: 'When It Pays Off',
          level: 'advanced',
          summary: 'Complex, long-lived business domains maintained by several developers.',
          points: [
            'Lots of business rules: banking, insurance, logistics, pricing.',
            'Expected to live for years, with changing tech around it.',
            'Several entry points: REST, messaging, batch jobs, CLI.',
            'Teams that value fast, reliable unit tests.',
          ],
        },
        {
          title: 'When NOT to Use It',
          level: 'advanced',
          summary: 'Simple CRUD apps, prototypes, and small short-lived tools.',
          points: [
            'CRUD over a table: the "domain" is just the database. Layers add nothing.',
            'Prototypes and hackathons: speed of learning matters more.',
            'Tiny services with one job and no real rules.',
            'Teams new to the ideas under heavy deadline pressure.',
          ],
          tip: 'Saying "it depends, and here’s when I wouldn’t use it" scores far better in interviews than blind praise.',
        },
        {
          title: 'Adopt Gradually',
          level: 'expert',
          summary: 'Start simple and add boundaries where change hurts, not up front.',
          points: [
            'Begin with package by feature and a pure domain package.',
            'Introduce ports only where you actually swap or fake something.',
            'Mix styles: rich core for complex modules, plain CRUD for simple ones.',
            'Use ArchUnit freezing to tighten rules over time.',
          ],
        },
      ],
    },
    {
      title: 'Common Pitfalls',
      level: 'advanced',
      summary: 'The usual ways a Clean Architecture project turns into ceremony without benefit.',
      points: [
        'Most pitfalls are too much structure, not too little.',
        'The rest are leaks: framework code creeping into the core.',
        'Review structure regularly and delete layers that earn nothing.',
      ],
      children: [
        {
          title: 'Anemic Domain Model',
          level: 'advanced',
          summary: 'Entities with only getters and setters, while all rules live in services.',
          points: [
            'Martin Fowler called it an anti-pattern back in 2003.',
            'Rules get duplicated across use cases and drift apart.',
            'Nothing stops invalid state like <code>order.setTotal(-5)</code>.',
            'Fix: move behaviour into entities (<code>order.addItem(...)</code>), drop public setters.',
          ],
          detail: `<pre><code>// anemic
order.setStatus(Status.SHIPPED);
// rich: the entity guards its own rule
order.ship(); // throws if not paid</code></pre>`,
        },
        {
          title: 'Over-abstraction',
          level: 'advanced',
          summary:
            'Interfaces and layers added "just in case", with exactly one implementation forever.',
          points: [
            '<code>IOrderService</code> + <code>OrderServiceImpl</code> for every class adds noise, not boundaries.',
            'Pass-through use cases that only call a repository are ceremony.',
            'Add an interface when it protects a boundary or enables a fake.',
            'Five hops to follow one click is a smell.',
          ],
        },
        {
          title: 'Mapper Explosion',
          level: 'advanced',
          summary: 'The same data copied through four models and four mappers per feature.',
          points: [
            'DTO → command → entity → JPA entity → and back again.',
            'Every new field means editing many files; bugs hide in mappings.',
            'Map only where models really differ; share read DTOs for simple queries.',
            'Use MapStruct to cut boilerplate, but question each extra model first.',
          ],
        },
        {
          title: 'Framework Leaks',
          level: 'advanced',
          summary: 'Spring, JPA or JSON types sneaking into the core over time.',
          points: [
            '<code>@Entity</code>, <code>Page&lt;T&gt;</code> or <code>ResponseEntity</code> in a use case.',
            'Lazy-loading surprises when JPA entities double as domain objects.',
            'Catch leaks early with ArchUnit rules in CI.',
          ],
        },
        {
          title: 'Cargo-Cult Folders',
          level: 'expert',
          summary: 'Copying the folder names from a blog while ignoring the dependency direction.',
          points: [
            'Folders called <code>domain</code> and <code>infrastructure</code> don’t make it clean.',
            'If the domain imports infrastructure, it’s still a big ball of mud.',
            'Judge by dependencies and how easy changes are, not by the diagram.',
          ],
          tip: 'The real test: can you run your business rules in a unit test without a database or Spring?',
        },
      ],
    },
  ],
};
