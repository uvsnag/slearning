import type { KmNode } from '../../types';

export const relatedIdeas: KmNode = {
  title: 'Related Ideas',
  level: 'advanced',
  summary:
    'Patterns that pair well with Clean Architecture: DDD building blocks, CQRS, modular monoliths.',
  simple:
    'Clean Architecture tells you where rooms go. These ideas help you furnish them and decide how many houses you need.',
  points: [
    'DDD tactical patterns shape the inside of the entities circle.',
    'CQRS splits reads from writes when one model can’t serve both well.',
    'A modular monolith applies the same boundaries at the module level.',
  ],
  children: [
    {
      title: 'DDD Tactical Patterns',
      level: 'advanced',
      summary: 'Eric Evans’ building blocks (2003) for a rich domain model inside the core.',
      points: [
        'Entity: has an identity that stays the same as its data changes.',
        'Value Object: defined by its values, immutable, e.g. <code>Money</code>, <code>Email</code>.',
        'Domain Service: business logic that doesn’t fit one entity.',
        'Repository: collection-like port for loading and saving aggregates.',
        'Domain Event: a fact that happened, like <code>OrderPlaced</code>.',
      ],
      detail: `<pre><code>public record Money(BigDecimal amount, Currency currency) {
    public Money plus(Money other) {
        if (!currency.equals(other.currency)) throw new CurrencyMismatch();
        return new Money(amount.add(other.amount), currency);
    }
}</code></pre>`,
      children: [
        {
          title: 'Aggregates',
          level: 'advanced',
          summary: 'A cluster of objects changed as one unit, through a single root entity.',
          points: [
            'Outside code only holds a reference to the root, e.g. <code>Order</code>, not <code>OrderLine</code>.',
            'The root guards the rules across the whole cluster.',
            'One transaction changes one aggregate; others are updated via events.',
            'Keep them small; reference other aggregates by id.',
          ],
        },
      ],
    },
    {
      title: 'Bounded Contexts',
      level: 'advanced',
      summary: 'Split a large domain into areas where each word has one clear meaning and its own model.',
      points: [
        'Strategic DDD, from Eric Evans’ 2003 book.',
        '"Customer" in Sales and "Customer" in Support can be two different models. That’s fine.',
        'Each context has its own clean core; contexts talk through APIs or events.',
        'Good guide for drawing module boundaries in a modular monolith or microservices.',
        'Ubiquitous language: code uses the same words the business experts use in that context.',
      ],
    },
    {
      title: 'CQRS',
      level: 'advanced',
      summary:
        'Command Query Responsibility Segregation: separate models for writing and for reading.',
      points: [
        'Named by Greg Young around 2010, building on Bertrand Meyer’s CQS idea.',
        'Commands go through use cases and the rich domain model.',
        'Queries can skip the domain and read straight into DTOs, even with plain SQL.',
        'Can use one database or separate read stores; start with one.',
      ],
      tip: 'A light CQRS (query services that bypass entities) removes a lot of pointless mapping in read-heavy apps.',
    },
    {
      title: 'Modular Monolith',
      level: 'advanced',
      summary: 'One deployable app split into strongly separated business modules.',
      points: [
        'Each module has its own clean core and talks to others through public APIs or events.',
        'Gets most of the microservice boundaries without network calls.',
        'Spring Modulith (1.0 in 2023, 2.0 alongside Spring Boot 4) verifies and documents module boundaries.',
        'A good stepping stone: a clean module can later become a service.',
      ],
    },
    {
      title: 'Vertical Slice Architecture',
      level: 'expert',
      summary:
        'Organise by request or feature slice, letting each slice choose its own internal design.',
      points: [
        'Popularised by Jimmy Bogard as a reaction to heavy layering.',
        'Each slice holds its handler, data access and DTOs together.',
        'Less abstraction for simple slices, rich domain only where it pays.',
        'Mixes well with Clean ideas: a shared domain core plus thin slices.',
      ],
    },
    {
      title: 'Services Are Not Architecture',
      level: 'expert',
      summary: 'Splitting into microservices doesn’t create boundaries by itself.',
      points: [
        'Martin: services are a deployment option, not an architecture.',
        'Services sharing data formats or databases are still tightly coupled.',
        'Each service can (and should) have its own clean internal structure.',
        'Cross-cutting changes ("add a field everywhere") reveal fake boundaries.',
      ],
    },
  ],
};
