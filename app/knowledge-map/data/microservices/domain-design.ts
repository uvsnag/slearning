import type { KmNode } from '../../types';

export const domainDesign: KmNode = {
  title: 'Boundaries & DDD',
  level: 'intermediate',
  summary:
    'Using domain-driven design (DDD) and team structure to decide where one service ends and the next begins.',
  simple:
    'Cutting a cake is easy. Cutting it so each slice makes sense on its own is the hard part. DDD gives you the lines to cut along.',
  points: [
    'Bad boundaries are the most expensive microservice mistake.',
    'Split by business capability, not by technical layer (UI, logic, DB).',
    'Team structure and service structure end up mirroring each other.',
  ],
  children: [
    {
      title: 'Domain & Subdomains',
      level: 'beginner',
      summary: 'The domain is the business you build for; subdomains are its main areas.',
      simple:
        'An online shop’s domain is "selling things". Its subdomains are catalog, ordering, payments, shipping, and so on.',
      points: [
        'Core subdomain: what makes your business special. Build it yourself, with your best people.',
        'Supporting subdomain: needed, but not special. Keep it simple.',
        'Generic subdomain: solved problems (email, auth). Buy or use open source.',
        'Talk to domain experts. They know where the natural seams are.',
      ],
    },
    {
      title: 'Ubiquitous Language',
      level: 'beginner',
      summary: 'One shared vocabulary that developers and business people both use, in code too.',
      simple:
        'If the sales team says "booking" and the code says "reservationRecord", someone will misunderstand something. Use the same word everywhere.',
      points: [
        'Class, method and event names use the business words: <code>Order.place()</code>, <code>OrderShipped</code>.',
        'A word means one thing inside one boundary.',
        'When the same word means different things to different teams, you have found a boundary.',
      ],
    },
    {
      title: 'Bounded Context',
      level: 'intermediate',
      summary: 'A boundary inside which a model and its words have one clear meaning.',
      simple:
        '"Customer" to Sales means a lead with a phone number. To Billing it means an account with an invoice address. Each team gets its own model of a customer.',
      points: [
        'Each bounded context has its own model, language and data.',
        'A microservice usually maps to one bounded context (sometimes a context holds a few services).',
        'Do not build one giant shared "Customer" model for everyone. It couples every team.',
        'Contexts share only IDs and the facts they publish, e.g. <code>customerId</code>.',
      ],
      tip: 'If two services always change together, they probably belong to the same bounded context.',
    },
    {
      title: 'Aggregates',
      level: 'intermediate',
      summary:
        'A cluster of objects that is changed as one unit, through one root, in one transaction.',
      simple:
        'An order and its order lines are like a shopping bag: you add or remove items through the bag, not by grabbing items from outside.',
      points: [
        'Outside code talks only to the root (e.g. <code>Order</code>), never to its lines directly.',
        'The root protects the rules, e.g. "total must not exceed the credit limit".',
        'One transaction changes one aggregate. Other aggregates update later, via events.',
        'Point to other aggregates by ID, not by object reference.',
        'Keep aggregates small. Big ones cause locking and slow loads.',
      ],
      detail: `<pre><code>public class Order {               // aggregate root
  private final List&lt;OrderLine&gt; lines = new ArrayList&lt;&gt;();
  private final CustomerId customerId; // other aggregate: by ID only

  public void addLine(ProductId id, int qty, Money price) {
    if (status != Status.DRAFT) throw new IllegalStateException("Order is locked");
    lines.add(new OrderLine(id, qty, price));
  }
}</code></pre>`,
    },
    {
      title: 'Finding Good Boundaries',
      level: 'intermediate',
      summary: 'Practical ways to find seams: business capabilities, event storming and coupling.',
      simple:
        'Like sorting a messy garage into boxes: tools that are used together go in the same box, so you rarely need to open two boxes for one job.',
      points: [
        'High cohesion: things that change together live together.',
        'Loose coupling: a service can do most of its work without calling others.',
        'Event storming: a workshop where you put business events on sticky notes and group them.',
        'Watch for chatty pairs of services. They often belong together.',
        'When unsure, make it bigger. Splitting later is easier than merging.',
      ],
    },
    {
      title: 'Context Mapping',
      level: 'advanced',
      summary: 'Describing how bounded contexts relate and who adapts to whom.',
      points: [
        'Customer / supplier: the upstream team plans for what the downstream team needs.',
        'Conformist: the downstream simply accepts the upstream model as it is.',
        'Anti-corruption layer: the downstream translates the upstream model into its own words.',
        'Open host service + published language: a stable public API or event format for many readers.',
        'Shared kernel: a small shared model owned by two teams. Use rarely.',
      ],
    },
    {
      title: 'Conway’s Law',
      level: 'intermediate',
      summary: 'Systems end up shaped like the communication paths of the teams that build them.',
      simple:
        'If three teams build a compiler, you get a three-pass compiler. Your architecture copies your org chart, whether you plan it or not.',
      points: [
        'Stated by Melvin Conway in 1968.',
        'Two teams sharing one service → constant meetings and slow changes.',
        'Inverse Conway manoeuvre: shape teams first, so the architecture you want follows.',
        'Service boundaries and team boundaries should line up.',
      ],
      tip: 'If your services keep needing coordinated releases, look at your team structure, not just the code.',
    },
    {
      title: 'Team Ownership',
      level: 'advanced',
      summary: 'Each service has exactly one team that builds it, runs it and answers for it.',
      points: [
        '"You build it, you run it": the owning team is on call for its service.',
        'Stream-aligned teams own a business flow end to end (from the book Team Topologies, 2019).',
        'A platform team offers self-service tools (CI/CD, clusters, observability) so others go faster.',
        'A team can own several services, but a service never has several owners.',
        'Keep a service catalog: owner, on-call, docs, dependencies (e.g. Backstage).',
      ],
    },
  ],
};
