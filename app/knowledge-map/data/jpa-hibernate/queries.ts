import type { KmNode } from '../../types';

export const queries: KmNode = {
  title: 'Querying',
  level: 'intermediate',
  summary: 'Ways to read data: JPQL, named queries, the Criteria API and native SQL.',
  simple:
    'You can ask the database in "object language" (JPQL), build the question with Lego blocks (Criteria), or just speak its native tongue (SQL).',
  points: [
    'JPQL works on entities and fields, not tables and columns.',
    'Criteria builds type-safe queries in code, good for dynamic filters.',
    'Native SQL is there for database-specific features.',
    'Always bind parameters; never glue user input into query strings.',
  ],
  children: [
    {
      title: 'JPQL Basics',
      level: 'beginner',
      summary: 'An SQL-like language that queries entities and their fields.',
      simple:
        'It is SQL that speaks Java: you say "from Order o where o.customer.name = ..." and Hibernate turns it into real table joins.',
      points: [
        'Use entity names and field names: <code>select o from Order o</code>.',
        'Navigate links with dots: <code>o.customer.city</code> (an implicit join).',
        'Hibernate’s HQL is a superset of JPQL with extra functions.',
        'Hibernate 6 allows dropping <code>select</code>: <code>from Order where total &gt; 100</code>.',
      ],
      detail: `<pre><code>List&lt;Order&gt; orders = em.createQuery(
    "select o from Order o where o.status = :status order by o.createdAt desc",
    Order.class)
  .setParameter("status", OrderStatus.PAID)
  .getResultList();</code></pre>`,
    },
    {
      title: 'Parameters',
      level: 'beginner',
      summary: 'Placeholders like :status filled with setParameter, safe from SQL injection.',
      simple:
        'A form with blanks. The database gets the form and the answers separately, so a nasty answer can’t change the question.',
      points: [
        'Named: <code>:status</code>; positional: <code>?1</code>.',
        'Lists work too: <code>where o.id in :ids</code>.',
        'Never build queries with string concatenation of user input.',
        'Same query text = better statement and plan caching.',
      ],
    },
    {
      title: 'Joins in JPQL',
      level: 'intermediate',
      summary: 'Join along mapped relationships, or on any condition since JPA 2.1.',
      simple:
        'Joining is following the arrows between your classes, like walking from an order to its customer.',
      points: [
        '<code>join o.items i</code> is an inner join; <code>left join</code> keeps orders without items.',
        'A plain join filters; it does not load the collection. That is what <code>join fetch</code> does.',
        'Extra conditions: <code>left join o.items i on i.qty &gt; 1</code> (JPA 2.1+).',
        'Hibernate also joins unrelated entities: <code>join Product p on p.sku = i.sku</code>.',
      ],
    },
    {
      title: 'Aggregates & Subqueries',
      level: 'intermediate',
      summary: 'Count, sum and group rows in JPQL, and nest queries, just like in SQL.',
      simple:
        'Instead of carrying every receipt home to add them up, you ask the cashier for the total.',
      points: [
        '<code>count</code>, <code>sum</code>, <code>avg</code>, <code>min</code>, <code>max</code> with <code>group by</code> and <code>having</code>.',
        'Results come back as <code>Object[]</code>, <code>Tuple</code> or a DTO via <code>select new</code>.',
        'Subqueries work in <code>where</code> with <code>exists</code>, <code>in</code>, <code>all</code> and <code>any</code>.',
        'Let the database do the math. Never load every entity just to count it in Java.',
      ],
      detail: `<pre><code>List&lt;Object[]&gt; rows = em.createQuery("""
    select c.name, count(o), sum(o.total)
    from Order o join o.customer c
    group by c.name
    having count(o) &gt; 5""", Object[].class)
  .getResultList();</code></pre>`,
    },
    {
      title: 'Named Queries',
      level: 'intermediate',
      summary: 'JPQL queries declared once on the entity with a name, checked at startup.',
      simple:
        'Saved searches with a label. If one is broken, you find out when the app starts, not when a user clicks.',
      points: [
        'Declare with <code>@NamedQuery(name = "Order.byStatus", query = "...")</code>.',
        'Use with <code>em.createNamedQuery("Order.byStatus", Order.class)</code>.',
        'Parsed once, validated at boot.',
        'In Spring Data, <code>@Query</code> on the repository is the usual alternative.',
      ],
    },
    {
      title: 'Native Queries',
      level: 'intermediate',
      summary: 'Plain SQL run through JPA, for things JPQL can’t express.',
      simple:
        'When the translator doesn’t know a word, you speak to the database directly in its own language.',
      points: [
        'Use for window functions, CTEs, vendor hints, full-text search.',
        'Map to entities: <code>createNativeQuery(sql, Order.class)</code>.',
        'Map to DTOs with <code>@SqlResultSetMapping</code> or tuples.',
        'You lose database portability, and Hibernate may flush more often to be safe.',
      ],
      detail: `<pre><code>List&lt;Object[]&gt; rows = em.createNativeQuery("""
    select c.name, sum(o.total) over (partition by c.id)
    from orders o join customers c on c.id = o.customer_id
    """).getResultList();</code></pre>`,
    },
    {
      title: 'Pagination',
      level: 'intermediate',
      summary: 'Read results page by page with setFirstResult and setMaxResults.',
      simple: 'Like a search engine showing 20 results per page instead of a million at once.',
      points: [
        'Becomes <code>LIMIT/OFFSET</code> (or the DB’s version) in SQL.',
        'Always add <code>order by</code>, or pages may overlap.',
        'Large offsets get slow; use keyset pagination (<code>where id &gt; :lastId</code>).',
        'Don’t combine with collection <code>join fetch</code>: paging then happens in memory.',
        'Spring Data 3.1+ offers keyset scrolling with <code>Window</code> and <code>ScrollPosition</code>.',
      ],
      detail: `<pre><code>em.createQuery("select p from Product p order by p.id", Product.class)
  .setFirstResult(40)
  .setMaxResults(20)
  .getResultList();</code></pre>`,
    },
    {
      title: 'Criteria API',
      level: 'advanced',
      summary: 'A Java API to build queries as objects, ideal for dynamic filters.',
      simple:
        'Instead of writing a sentence, you snap together blocks: "where" block, "equals" block, "order by" block.',
      points: [
        'Start from <code>em.getCriteriaBuilder()</code>.',
        'Add predicates only for filters the user actually set.',
        'The JPA static metamodel (<code>Order_.status</code>) makes field names type-safe.',
        'Verbose; many teams use Spring Data Specifications or Querydsl on top.',
        'Hibernate 6 removed the old <code>org.hibernate.Criteria</code> API.',
      ],
      detail: `<pre><code>CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaQuery&lt;Order&gt; q = cb.createQuery(Order.class);
Root&lt;Order&gt; o = q.from(Order.class);
List&lt;Predicate&gt; where = new ArrayList&lt;&gt;();
if (status != null) where.add(cb.equal(o.get(Order_.status), status));
if (min != null) where.add(cb.ge(o.get(Order_.total), min));
q.where(where.toArray(Predicate[]::new));
return em.createQuery(q).getResultList();</code></pre>`,
    },
    {
      title: 'Bulk Update & Delete',
      level: 'advanced',
      summary: 'One JPQL statement that changes many rows, skipping the persistence context.',
      points: [
        '<code>update Product p set p.price = p.price * 1.1 where ...</code> with <code>executeUpdate()</code>.',
        'Much faster than loading and changing entities one by one.',
        'Bypasses cascades, lifecycle callbacks and <code>@Version</code> (unless you set it).',
        'Managed entities in memory become stale: <code>clear()</code> afterwards.',
      ],
      tip: 'In Spring Data use @Modifying(clearAutomatically = true) to clear the context after a bulk query.',
    },
  ],
};
