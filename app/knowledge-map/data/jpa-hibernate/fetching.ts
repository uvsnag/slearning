import type { KmNode } from '../../types';

export const fetching: KmNode = {
  title: 'Fetching Strategies',
  level: 'intermediate',
  summary: 'Deciding when related data is loaded, and how to avoid the dreaded N+1 queries.',
  simple:
    'Fetching is packing for a trip. Pack too little and you keep running home (N+1). Pack everything and you drag a huge suitcase (EAGER).',
  points: [
    'Map everything LAZY, then fetch what each use case needs in the query.',
    'N+1 is the number-one JPA performance bug.',
    'Tools: JOIN FETCH, entity graphs, batch fetching, DTO projections.',
    'Fetch plans belong to queries, not to mappings.',
  ],
  children: [
    {
      title: 'Lazy vs Eager',
      level: 'beginner',
      summary:
        'Lazy loads related data only when you touch it; eager loads it right away, every time.',
      simple:
        'Lazy is ordering food when you’re hungry. Eager is getting the full menu delivered every time you open the door.',
      points: [
        'JPA defaults: <code>@ManyToOne</code>/<code>@OneToOne</code> EAGER, <code>@OneToMany</code>/<code>@ManyToMany</code> LAZY.',
        'Set every <code>@ManyToOne</code> and <code>@OneToOne</code> to LAZY.',
        'EAGER can’t be turned off per query; it is loaded in every query.',
        'Lazy fields are loaded through proxies or collection wrappers.',
      ],
      tip: 'Rule of thumb: FetchType.EAGER in a mapping is a code smell. Fetch eagerly in the query instead.',
    },
    {
      title: 'The N+1 Problem',
      level: 'intermediate',
      summary: 'One query loads N parents, then N more queries load each parent’s children.',
      simple:
        'You ask a waiter for the guest list (1 trip), then send him back once per guest to ask their order (N trips).',
      points: [
        'Typical cause: looping over results and touching a lazy field.',
        'Also caused by EAGER <code>@ManyToOne</code> in a JPQL query.',
        'Looks fine with 5 rows in dev, kills prod with 5,000.',
        'Spot it by logging SQL or counting statements in tests.',
      ],
      detail: `<pre><code>List&lt;Order&gt; orders = em.createQuery("select o from Order o", Order.class)
  .getResultList();                     // 1 query
for (Order o : orders) {
  o.getCustomer().getName();            // +1 query per order
}</code></pre>`,
    },
    {
      title: 'JOIN FETCH',
      level: 'intermediate',
      summary: 'Load the parent and its related data in one query with a join.',
      simple:
        'Ask the waiter for the guest list with everyone’s order written next to their name. One trip.',
      points: [
        '<code>select o from Order o join fetch o.customer</code>.',
        'Works for to-one and collection links.',
        'Hibernate 6 removes duplicate parents automatically; <code>distinct</code> is no longer needed.',
        'You can’t put a condition on fetched children safely (you’d get a partial collection).',
      ],
      detail: `<pre><code>em.createQuery("""
    select o from Order o
    join fetch o.customer
    join fetch o.items
    where o.status = :s""", Order.class)
  .setParameter("s", OrderStatus.PAID)
  .getResultList();</code></pre>`,
      children: [
        {
          title: 'MultipleBagFetchException',
          level: 'advanced',
          summary: 'Hibernate refuses to JOIN FETCH two List (bag) collections in one query.',
          points: [
            'Two collection joins make a Cartesian product (rows multiply).',
            'Fix: fetch one collection per query; the context joins the results.',
            'Or use <code>Set</code>, but the row explosion is still there.',
            'Or use batch fetching for the second collection.',
          ],
        },
        {
          title: 'Fetch + Pagination',
          level: 'advanced',
          summary: 'Collection fetch joins with setMaxResults page in memory, not in SQL.',
          points: [
            'Hibernate warns: "firstResult/maxResults specified with collection fetch; applying in memory".',
            'It loads every matching row, then cuts the page in Java.',
            'Fix: page the parent ids first, then fetch those parents with their collections.',
            'Set <code>hibernate.query.fail_on_pagination_over_collection_fetch=true</code> to fail fast.',
          ],
        },
      ],
    },
    {
      title: 'Entity Graphs',
      level: 'advanced',
      summary: 'A reusable fetch plan saying which attributes to load, passed as a query hint.',
      simple:
        'A packing list you hand to the query: "for this trip, also bring customer and items".',
      points: [
        'Define with <code>@NamedEntityGraph</code> or build with <code>em.createEntityGraph</code>.',
        'Pass as hint <code>jakarta.persistence.fetchgraph</code> or <code>loadgraph</code>.',
        'Fetch graph: only listed attributes eager; load graph: listed plus mapped EAGER ones.',
        'Spring Data: <code>@EntityGraph(attributePaths = {"customer", "items"})</code>.',
      ],
      detail: `<pre><code>EntityGraph&lt;Order&gt; g = em.createEntityGraph(Order.class);
g.addAttributeNodes("customer", "items");
Order o = em.find(Order.class, id,
    Map.of("jakarta.persistence.fetchgraph", g));</code></pre>`,
    },
    {
      title: 'Batch Fetching',
      level: 'advanced',
      summary:
        'Load lazy links for many parents at once with WHERE id IN (...), turning N+1 into N/size+1.',
      points: [
        'Global: <code>hibernate.default_batch_fetch_size=16</code> (or 32, 50…).',
        'Per mapping: <code>@BatchSize(size = 25)</code>.',
        'Works for proxies and collections, with no query changes.',
        'A great safety net; still prefer explicit fetches on hot paths.',
      ],
      tip: 'Turning on default_batch_fetch_size is one of the cheapest big wins in any Hibernate app.',
    },
    {
      title: 'Open Session in View',
      level: 'advanced',
      summary:
        'Keeps the persistence context open until the web response is rendered, so lazy loading still works.',
      points: [
        'Spring Boot enables it by default (<code>spring.jpa.open-in-view=true</code>) and logs a warning.',
        'Hides N+1 problems: lazy loads fire from controllers and JSON serializers.',
        'Holds a DB connection for the whole request.',
        'Set it to <code>false</code> and fetch properly in the service layer.',
      ],
    },
    {
      title: 'Subselect Fetching',
      level: 'expert',
      summary: 'Load a collection for all parents from the previous query using a subquery.',
      points: [
        'Hibernate extra: <code>@Fetch(FetchMode.SUBSELECT)</code> on a collection.',
        'Touching one collection loads it for every parent of the original query.',
        'Re-runs the original query as a subselect, which can be expensive.',
      ],
    },
  ],
};
