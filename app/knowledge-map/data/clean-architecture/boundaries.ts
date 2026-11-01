import type { KmNode } from '../../types';

export const boundaries: KmNode = {
  title: 'Boundaries, Ports & Adapters',
  level: 'intermediate',
  summary:
    'Lines between parts of the system, crossed only through interfaces. Hexagonal and Onion are close cousins.',
  simple:
    'A country border: goods cross only at official checkpoints with paperwork. Ports are the checkpoints, adapters are the customs officers.',
  points: [
    'A boundary separates things that matter from things that are details.',
    'Hexagonal (2005), Onion (2008) and Clean (2012) share one core idea.',
    'Business code in the middle, tools outside, dependencies pointing inward.',
  ],
  children: [
    {
      title: 'What is a Boundary?',
      level: 'intermediate',
      summary: 'A line in the code that dependencies cross in one direction only.',
      simple:
        'A shop counter: customers stay on one side, staff on the other, and they deal through the counter.',
      points: [
        'Draw boundaries between things that change at different rates or for different reasons.',
        'Typical: between business rules and database, UI, or external services.',
        'Crossed by calling an interface owned by the inner side.',
        'Can be a package, a module, a jar, or a separate service.',
      ],
    },
    {
      title: 'Hexagonal Architecture',
      level: 'intermediate',
      summary:
        'Alistair Cockburn’s 2005 pattern: the app sits inside, talking to the world only through ports and adapters.',
      simple:
        'A game console has standard ports. Plug in any controller, TV or headset that fits; the console doesn’t care about the brand.',
      points: [
        'Official name: Ports and Adapters. The hexagon shape just leaves room to draw many ports.',
        'No "top" or "bottom" layers: UI and database are both just outside.',
        'Goal: run the app from tests, UI or scripts the same way.',
        'Clean Architecture builds directly on this idea.',
      ],
      children: [
        {
          title: 'Ports',
          level: 'intermediate',
          summary: 'Interfaces owned by the application that define how to talk to it or from it.',
          simple: 'A port is the shape of the socket. It says what fits, not what plugs in.',
          points: [
            'Driving (input) ports: what the app offers, e.g. <code>PlaceOrderUseCase</code>.',
            'Driven (output) ports: what the app needs, e.g. <code>LoadCustomerPort</code>.',
            'Named in business words, not tech words.',
            'Both live in the application core.',
          ],
          detail: `<pre><code>public interface PlaceOrderUseCase {      // driving port
    OrderId place(PlaceOrderCommand cmd);
}
public interface PaymentPort {            // driven port
    PaymentResult charge(CustomerId id, Money amount);
}</code></pre>`,
        },
        {
          title: 'Adapters',
          level: 'intermediate',
          summary: 'Code that connects a real technology to a port.',
          simple: 'An adapter is the plug made for that socket: one per device type.',
          points: [
            'Driving (primary) adapters call the app: REST controller, CLI, Kafka listener, test.',
            'Driven (secondary) adapters are called by the app: JPA repository, Stripe client, email sender.',
            'Several adapters can serve one port, e.g. real DB and in-memory fake.',
            'Adapters contain translation, not business decisions.',
          ],
        },
      ],
    },
    {
      title: 'Onion Architecture',
      level: 'intermediate',
      summary:
        'Jeffrey Palermo’s 2008 layering: domain model in the centre, services and infrastructure in rings around it.',
      simple:
        'Peel an onion from the outside: UI and database first, then app services, then domain services, and the domain model is the heart.',
      points: [
        'Rings: Domain Model → Domain Services → Application Services → UI / Infrastructure / Tests.',
        'Same rule: all coupling points toward the centre.',
        'Repository interfaces live in the core; implementations in infrastructure.',
        'Grew out of DDD practice in the .NET world.',
      ],
    },
    {
      title: 'Clean vs Hexagonal vs Onion',
      level: 'advanced',
      summary: 'Three names for nearly the same idea, with different emphasis and vocabulary.',
      points: [
        'Hexagonal: inside vs outside, ports and adapters. No inner layering prescribed.',
        'Onion: adds named rings inside the core (domain model, domain services, app services).',
        'Clean: entities vs use cases, plus presenters and strict data-crossing rules.',
        'All three: business core independent of frameworks, Dependency Inversion at the edge.',
      ],
      tip: 'In interviews, say they share one goal and the differences are mostly naming and how much they prescribe inside the core.',
    },
    {
      title: 'Partial Boundaries',
      level: 'advanced',
      summary: 'Cheaper versions of a full boundary when the full thing isn’t worth it yet.',
      points: [
        'Full boundary: separate modules, interfaces and data models on each side. Costly.',
        'Skip the last step: same module, but interfaces and models already split.',
        'One-dimensional: just an interface (Strategy) with no matching output side.',
        'Facade: a simple entry class; cheapest, but dependencies aren’t inverted.',
      ],
      tip: 'Martin’s advice: watch where friction appears and add boundaries when the cost of ignoring them grows.',
    },
    {
      title: 'Anti-Corruption Layer',
      level: 'advanced',
      summary: 'A translator adapter that stops a messy outside model from leaking into your clean core.',
      points: [
        'Term from Eric Evans’ "Domain-Driven Design" (2003).',
        'Used with legacy systems or third-party APIs whose data model you don’t like.',
        'The adapter converts their shapes and words into your domain’s shapes and words.',
        'Your core never sees fields like <code>CUST_STAT_CD</code>, only <code>CustomerStatus</code>.',
      ],
      tip: 'Any driven adapter to a foreign system is a small anti-corruption layer. Keep the translation there.',
    },
    {
      title: 'Decoupling Modes',
      level: 'expert',
      summary: 'A boundary can live at source, deployment or service level, and you can move between them.',
      points: [
        'Source level: packages or modules in one app, one process. Cheapest.',
        'Deployment level: separate jars or libraries, still one process.',
        'Service level: separate processes talking over the network. Most costly.',
        'Martin’s advice: start at source level and push a boundary outward only when needed.',
      ],
      tip: 'Good boundaries let you choose microservices later. Bad ones make microservices a distributed mess.',
    },
  ],
};
