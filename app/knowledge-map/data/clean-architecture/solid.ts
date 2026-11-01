import type { KmNode } from '../../types';

export const solid: KmNode = {
  title: 'SOLID Principles',
  level: 'intermediate',
  summary: 'Five design rules for classes and modules that keep code flexible and easy to change.',
  simple:
    'SOLID is like the basic rules of building with LEGO: pieces that do one job, snap together through standard studs, and swap without breaking the model.',
  points: [
    'Collected by Robert C. Martin around 2000; Michael Feathers coined the "SOLID" acronym.',
    'They apply to classes, but also to modules and whole layers.',
    'The D (Dependency Inversion) is the engine behind Clean Architecture.',
  ],
  children: [
    {
      title: 'Single Responsibility',
      level: 'intermediate',
      summary: 'A module should have one reason to change: it serves one actor (group of users).',
      simple:
        'A restaurant doesn’t let the chef also do the accounting. When tax rules change, you don’t want to touch the kitchen.',
      points: [
        'Not "do one thing". It means "answer to one actor", like finance or HR.',
        'Mixing two actors’ rules in one class means one team’s change breaks the other.',
        'Martin’s example: <code>Employee</code> with <code>calculatePay()</code>, <code>reportHours()</code> and <code>save()</code>.',
        'Fix by splitting into classes each owned by one actor.',
      ],
      tip: 'Common interview trap: SRP is about reasons to change (people), not about method count.',
    },
    {
      title: 'Open/Closed',
      level: 'intermediate',
      summary: 'Add new behaviour by adding code, not by editing code that already works.',
      simple: 'A power strip lets you plug in a new lamp without rewiring the house.',
      points: [
        'First stated by Bertrand Meyer in 1988.',
        'Use interfaces so new cases are new classes, not new <code>if</code> branches.',
        'At architecture level: protect the core from changes in the outer layers.',
        'Don’t pre-build extension points for changes that never come (YAGNI).',
      ],
      detail: `<pre><code>interface DiscountRule {
    Money apply(Order order);
}
class BlackFridayDiscount implements DiscountRule { ... }
class LoyaltyDiscount implements DiscountRule { ... }
// new rule = new class, checkout code untouched</code></pre>`,
    },
    {
      title: 'Liskov Substitution',
      level: 'intermediate',
      summary: 'A subtype must work anywhere its parent type is expected, with no surprises.',
      simple:
        'If you order a coffee and get a decaf, it should still look, pour and drink like coffee. No hidden "can’t be poured" rule.',
      points: [
        'From Barbara Liskov (1987).',
        'Classic break: <code>Square extends Rectangle</code>, where <code>setWidth</code> also changes height.',
        'Red flag: <code>instanceof</code> checks or <code>UnsupportedOperationException</code> in subclasses.',
        'Matters for adapters: every repository implementation must keep the same promises.',
      ],
    },
    {
      title: 'Interface Segregation',
      level: 'intermediate',
      summary: 'Don’t force clients to depend on methods they never use.',
      simple:
        'A TV remote with 80 buttons when you only need power and volume. Give each user the small remote they need.',
      points: [
        'Split fat interfaces into small, role-based ones.',
        'Example: <code>LoadOrderPort</code> and <code>SaveOrderPort</code> instead of one giant <code>OrderRepository</code>.',
        'Less to mock in tests, fewer reasons to recompile.',
        'Architecture view: don’t depend on a module that drags in things you don’t need.',
      ],
    },
    {
      title: 'Dependency Inversion',
      level: 'intermediate',
      summary:
        'High-level business code depends on abstractions it owns; low-level details implement them.',
      simple:
        'A lamp doesn’t care which power plant feeds it. It only needs a standard socket. The socket shape is the abstraction.',
      points: [
        'Depend on interfaces, not concrete classes that change often.',
        'The key trick: the interface lives with the business code, not with the database code.',
        'Now the arrow points from the database code to the business code: "inverted".',
        'This is how Clean Architecture keeps the Dependency Rule.',
      ],
      detail: `<pre><code>// core (business) package
public interface OrderRepository {
    Optional&lt;Order&gt; findById(OrderId id);
}
// adapter package depends on core, not the other way
class JpaOrderRepository implements OrderRepository { ... }</code></pre>`,
      children: [
        {
          title: 'DIP vs DI',
          level: 'intermediate',
          summary:
            'Dependency Inversion is a design rule; Dependency Injection is a technique to hand objects their dependencies.',
          simple:
            'DIP says "use standard sockets". DI is the electrician who plugs the right lamp into each socket for you.',
          points: [
            'DI: objects receive dependencies (usually via constructor) instead of creating them.',
            'Spring is a DI container; it wires things for you.',
            'You can use DI and still break DIP, e.g. injecting a concrete <code>JpaRepository</code> into your core.',
            'Prefer constructor injection: dependencies are explicit and fields can be <code>final</code>.',
          ],
        },
      ],
    },
  ],
};
