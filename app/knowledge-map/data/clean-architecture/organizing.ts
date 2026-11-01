import type { KmNode } from '../../types';

export const organizingCode: KmNode = {
  title: 'Organizing Code',
  level: 'intermediate',
  summary: 'How you split packages and modules decides whether the architecture survives.',
  simple:
    'Same books, different shelving: by colour, by author or by subject. Only one makes finding and adding books easy.',
  points: [
    'Diagrams don’t enforce anything; packages, modules and visibility do.',
    'Common options: by layer, by feature, ports &amp; adapters, by component.',
    'Use Java’s <code>package-private</code> and build modules to stop shortcuts.',
  ],
  children: [
    {
      title: 'Package by Layer',
      level: 'beginner',
      summary: 'Top-level folders per technical layer: controller, service, repository.',
      simple:
        'A supermarket that puts all cans in one aisle and all boxes in another. Easy to start, but to cook one dish you walk the whole store.',
      points: [
        'Simple and familiar; fine for small apps.',
        'One feature is spread across many folders.',
        'Everything is <code>public</code>, so a controller can call a repository directly.',
        'Tells you the framework, not what the app does.',
      ],
      detail: `<pre><code>com.shop.controller.OrderController
com.shop.service.OrderService
com.shop.repository.OrderRepository</code></pre>`,
    },
    {
      title: 'Package by Feature',
      level: 'intermediate',
      summary: 'Top-level folders per business feature: orders, billing, shipping.',
      simple: 'A supermarket arranged by meal: everything for pasta night is in one aisle.',
      points: [
        'Everything for one feature lives together. High cohesion.',
        'Many classes can be <code>package-private</code>, hiding internals.',
        'Easier to split into a module or service later.',
        'Watch for features reaching into each other’s internals.',
      ],
      detail: `<pre><code>com.shop.order.OrderController
com.shop.order.PlaceOrderService
com.shop.order.OrderRepository
com.shop.billing.InvoiceService</code></pre>`,
    },
    {
      title: 'Ports & Adapters Packaging',
      level: 'intermediate',
      summary: 'Split each feature into domain, application (ports) and adapter packages.',
      simple:
        'Each shop department has a back office (domain), a front desk (ports) and delivery doors (adapters).',
      points: [
        'Mirrors the circles: <code>domain</code>, <code>application.port.in/out</code>, <code>adapter.in/out</code>.',
        'Makes the Dependency Rule visible and testable.',
        'Popularised by Tom Hombergs’ book "Get Your Hands Dirty on Clean Architecture".',
        'Can feel heavy for simple CRUD features.',
      ],
      detail: `<pre><code>order/
  domain/            Order, OrderLine
  application/
    port/in/         PlaceOrderUseCase
    port/out/        SaveOrderPort
    PlaceOrderService
  adapter/
    in/web/          OrderController
    out/persistence/ OrderJpaAdapter</code></pre>`,
    },
    {
      title: 'Screaming Architecture',
      level: 'intermediate',
      summary:
        'Your top-level structure should shout what the app does, not which framework it uses.',
      simple:
        'A house blueprint screams "house": kitchen, bedrooms, bathroom. It doesn’t scream "bricks and hammers".',
      points: [
        'Martin’s term, from a 2011 blog post and the 2017 book.',
        'Top-level names like <code>orders</code>, <code>claims</code>, <code>payroll</code>, not <code>controllers</code>.',
        'A newcomer should guess the business domain from the folder list.',
        'Frameworks are tools kept at the edge, not the organising idea.',
      ],
    },
    {
      title: 'Package by Component',
      level: 'advanced',
      summary:
        'Simon Brown’s hybrid: bundle business logic and persistence behind one public interface per component.',
      points: [
        'From Brown’s "The Missing Chapter" in the 2017 book.',
        'Each component exposes one interface; its implementation and DB code stay package-private.',
        'Controllers stay separate and can only call the public interface.',
        'Compiler-enforced encapsulation with fewer packages than full hexagonal.',
      ],
      tip: 'Brown’s point: making everything public turns any nice diagram into "package by layer" in practice.',
    },
    {
      title: 'Enforcing Boundaries',
      level: 'advanced',
      summary: 'Use the compiler and build tool to make wrong dependencies impossible.',
      points: [
        'Maven/Gradle modules: the domain module has no Spring dependency at all.',
        'Package-private classes can’t be imported from outside the package.',
        'Java modules (JPMS, Java 9+) export only chosen packages.',
        'Spring Modulith or ArchUnit verify rules in tests when modules are too heavy.',
      ],
    },
  ],
};
