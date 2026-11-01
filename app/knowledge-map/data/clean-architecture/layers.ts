import type { KmNode } from '../../types';

const dependencyRule: KmNode = {
  title: 'The Dependency Rule',
  level: 'intermediate',
  summary: 'Source code dependencies may only point inward, toward the business rules.',
  simple:
    'Employees know the company rules, but the rules don’t mention any one employee by name. Swap staff and the rules still stand.',
  points: [
    'Nothing in an inner circle may name anything in an outer circle.',
    'That includes classes, functions, annotations and data formats.',
    'This one rule is what makes the whole architecture work.',
  ],
  children: [
    {
      title: 'Inward Dependencies',
      level: 'intermediate',
      summary: 'Outer layers import inner layers, never the reverse.',
      simple:
        'A phone charger is built for the phone’s port. The phone wasn’t built for one specific charger.',
      points: [
        'A controller may import a use case. A use case must not import a controller.',
        'An entity must not import <code>jakarta.persistence</code> or <code>org.springframework</code>.',
        'Check it with imports: any outer-layer import in the core is a violation.',
        'Make it enforceable with modules or ArchUnit tests.',
      ],
    },
    {
      title: 'Control Flow vs Dependency',
      level: 'intermediate',
      summary:
        'At runtime the call goes outward (use case → database), but the code dependency still points inward.',
      simple:
        'You ask a waiter for food and he goes to the kitchen. You don’t need to know the chef; you only know the menu. The menu is the interface.',
      points: [
        'The use case calls an interface it owns: <code>SaveOrderPort</code>.',
        'The database adapter implements that interface.',
        'Runtime: use case → adapter. Source code: adapter → use case.',
        'Dependency Inversion is what flips the arrow at each boundary.',
      ],
      detail: `<pre><code>Controller ──calls──▶ UseCase ──calls──▶ «interface» SaveOrderPort
                                                   ▲
                                      JpaOrderAdapter implements</code></pre>`,
    },
    {
      title: 'The Main Component',
      level: 'advanced',
      summary: 'One outermost place that creates all objects and wires them together.',
      points: [
        'Also called the composition root.',
        'It’s the dirtiest module: it knows every concrete class.',
        'In Spring Boot, that’s your <code>@SpringBootApplication</code> plus <code>@Configuration</code> classes.',
        'Because it’s a plugin, you can have one main for prod and another for tests.',
      ],
    },
    {
      title: 'Data Formats Count Too',
      level: 'advanced',
      summary: 'Inner layers must not depend on outer data shapes like DB rows or JSON.',
      points: [
        'Passing a JPA entity or a <code>ResultSet</code> into a use case breaks the rule.',
        'Use cases define their own simple input and output models.',
        'Outer layers convert to and from those models.',
        'Framework annotations on core classes are a dependency, even if "harmless".',
      ],
    },
  ],
};

export const layers: KmNode = {
  title: 'Layers & Dependency Rule',
  level: 'beginner',
  summary:
    'Clean Architecture draws your app as circles: entities in the middle, then use cases, adapters and frameworks.',
  simple:
    'Think of an onion or a castle. The treasure (your business rules) sits in the middle; walls, gates and guards (tools) are outside to protect it.',
  points: [
    'Proposed by Robert C. Martin in a 2012 blog post, then the 2017 book "Clean Architecture".',
    'Inside out: Entities → Use Cases → Interface Adapters → Frameworks &amp; Drivers.',
    'Inner circles are policy; outer circles are details.',
    'Four circles is an example, not a law. Use as many as you need.',
  ],
  children: [
    {
      title: 'What It Promises',
      level: 'beginner',
      summary: 'Martin’s 2012 post lists five goals: independent of frameworks, UI, database and outside services, and testable.',
      simple:
        'A good phone works with any charger brand, any case and any headphones. Your business rules should work the same way with any tool.',
      points: [
        'Independent of frameworks: Spring is a tool you use, not a cage.',
        'Testable: business rules run in tests without UI, database or web server.',
        'Independent of UI: swap a web page for a mobile app or CLI.',
        'Independent of the database: PostgreSQL, Mongo or files, the rules don’t care.',
        'Independent of outside services: business rules know nothing about the outside world.',
      ],
      tip: 'Interviewers love "what problem does Clean Architecture solve?" Answer with these goals, testability first.',
    },
    {
      title: 'Classic Layered Style',
      level: 'beginner',
      summary: 'The usual three layers (web → service → database), where everything ends up depending on the database.',
      simple:
        'A stack of plates with the database at the bottom. Pull the bottom plate and every plate above wobbles.',
      points: [
        'Controller calls service, service calls repository: arrows point down to the database.',
        'Business code imports database classes, so DB changes ripple upward.',
        'Clean Architecture keeps the layers but flips the last arrow with an interface.',
        'Result: the database plugs into the business code, not the other way round.',
      ],
      detail: `<pre><code>Classic:  Web ──▶ Service ──▶ Database
Clean:    Web ──▶ Use case ◀── Database adapter
                  (owns the repository interface)</code></pre>`,
    },
    {
      title: 'Entities',
      level: 'beginner',
      summary: 'Core business objects and rules that would exist even without any software.',
      simple:
        'A bank charged interest long before computers. That rule ("balance × rate") is an entity rule. It doesn’t care about screens or databases.',
      points: [
        'Plain Java objects: no Spring, JPA or JSON annotations.',
        'Hold data plus the rules that protect it (e.g. "balance can’t go below zero").',
        'Martin calls these "Critical Business Rules".',
        'They change least often, so they sit in the centre.',
      ],
      detail: `<pre><code>public class Account {
    private Money balance;

    public void withdraw(Money amount) {
        if (balance.isLessThan(amount)) {
            throw new InsufficientFundsException();
        }
        balance = balance.minus(amount);
    }
}</code></pre>`,
    },
    {
      title: 'Use Cases',
      level: 'beginner',
      summary: 'App-specific steps that run one user goal, like "transfer money" or "place order".',
      simple:
        'If entities are the chess pieces and their moves, a use case is a specific plan: "castle, then push the pawn". It directs the pieces.',
      points: [
        'Also called interactors or application services.',
        'Load entities, call their rules, save results, trigger side effects.',
        'Define the ports (interfaces) they need, like <code>LoadAccountPort</code>.',
        'Know nothing about HTTP, SQL or the UI.',
      ],
      detail: `<pre><code>public class TransferMoney {
    private final AccountRepository accounts;

    public void execute(TransferCommand cmd) {
        Account from = accounts.get(cmd.fromId());
        Account to = accounts.get(cmd.toId());
        from.withdraw(cmd.amount());
        to.deposit(cmd.amount());
        accounts.save(from);
        accounts.save(to);
    }
}</code></pre>`,
    },
    {
      title: 'Interface Adapters',
      level: 'beginner',
      summary:
        'Translators that convert data between use cases and the outside world: controllers, presenters, gateways.',
      simple:
        'A travel plug adapter: the wall socket and your charger don’t match, so a small piece in between makes them fit.',
      points: [
        'Controllers turn HTTP requests into use case input.',
        'Presenters turn use case output into view models for the UI.',
        'Gateways (repository implementations) turn entities into database rows.',
        'All conversion code lives here, so the core never sees JSON or SQL.',
      ],
    },
    {
      title: 'Frameworks & Drivers',
      level: 'beginner',
      summary: 'The outermost circle: database, web framework, UI, message brokers, external APIs.',
      simple:
        'These are the appliances in the house. Useful, replaceable, and you don’t build your walls around a specific toaster.',
      points: [
        'Spring Boot, Hibernate, PostgreSQL, Kafka, React, AWS SDKs.',
        'Mostly glue code and configuration; little of your own logic.',
        'Martin: "the database is a detail", "the web is a detail".',
        'Keep frameworks at arm’s length: use them, don’t marry them.',
      ],
    },
    dependencyRule,
  ],
};
