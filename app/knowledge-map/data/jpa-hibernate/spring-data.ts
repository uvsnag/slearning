import type { KmNode } from '../../types';

export const springDataJpa: KmNode = {
  title: 'Spring Data JPA',
  level: 'intermediate',
  summary: 'A Spring layer on top of JPA that writes repository code for you from interfaces.',
  simple:
    'You describe what you want ("find users by email") and Spring Data writes the boring JPA code behind it. Hibernate still does the real work underneath.',
  points: [
    'Extend <code>JpaRepository&lt;Entity, Id&gt;</code> and get CRUD, paging and sorting for free.',
    'It sits on top of JPA; everything in this map still applies.',
    'Boot 3 ships Spring Data JPA 3 + Hibernate 6; Boot 4 ships Spring Data JPA 4 + Hibernate 7.',
    'Basic setup and paging are covered in the Spring Boot map; here we focus on JPA pitfalls.',
  ],
  children: [
    {
      title: 'Derived Queries',
      level: 'beginner',
      summary: 'Spring builds a query from the method name, like findByEmailAndActiveTrue.',
      simple:
        'The method name is the question. Spring reads it like a sentence and turns it into JPQL.',
      points: [
        'Keywords: <code>And</code>, <code>Or</code>, <code>Between</code>, <code>Like</code>, <code>In</code>, <code>OrderBy</code>, <code>Top</code>.',
        'Return <code>Optional&lt;T&gt;</code>, <code>List&lt;T&gt;</code>, <code>Page&lt;T&gt;</code>, <code>Stream&lt;T&gt;</code>.',
        'Checked at startup: a typo in a field name fails the boot.',
        'Names get long fast; switch to <code>@Query</code> when they do.',
      ],
      detail: `<pre><code>interface UserRepository extends JpaRepository&lt;User, Long&gt; {
  Optional&lt;User&gt; findByEmail(String email);
  List&lt;User&gt; findTop10ByActiveTrueOrderByCreatedAtDesc();
  boolean existsByEmail(String email);
}</code></pre>`,
    },
    {
      title: '@Query & @Modifying',
      level: 'intermediate',
      summary: 'Write your own JPQL or SQL on a repository method; mark writes with @Modifying.',
      simple:
        'When the method name can’t say it, you write the question yourself and stick it on the method.',
      points: [
        '<code>@Query("select o from Order o join fetch o.items where o.id = :id")</code>.',
        '<code>nativeQuery = true</code> for plain SQL.',
        'Update/delete queries need <code>@Modifying</code> and a transaction.',
        '<code>clearAutomatically = true</code> avoids stale entities after bulk updates.',
      ],
      detail: `<pre><code>@Modifying(clearAutomatically = true)
@Transactional
@Query("update Order o set o.status = :s where o.createdAt &lt; :before")
int expireOld(OrderStatus s, Instant before);</code></pre>`,
    },
    {
      title: 'Projections',
      level: 'intermediate',
      summary:
        'Return only the fields you need as interfaces, records or DTO classes instead of whole entities.',
      simple:
        'You ask for a business card, not the whole person. Less data, no tracking, no lazy surprises.',
      points: [
        'Interface projection: <code>interface OrderSummary { Long getId(); BigDecimal getTotal(); }</code>.',
        'Class/record projection: Spring calls the constructor with the selected columns.',
        'Closed projections select only needed columns; open ones (<code>@Value</code> SpEL) load the entity.',
        'Dynamic: <code>&lt;T&gt; List&lt;T&gt; findByStatus(Status s, Class&lt;T&gt; type)</code>.',
      ],
      detail: `<pre><code>record OrderRow(Long id, String customer, BigDecimal total) {}

@Query("""
  select new com.shop.OrderRow(o.id, c.name, o.total)
  from Order o join o.customer c""")
List&lt;OrderRow&gt; findRows();</code></pre>`,
    },
    {
      title: '@EntityGraph in Repos',
      level: 'intermediate',
      summary: 'Add a fetch plan to any repository method to load related data in one go.',
      simple: 'A sticky note on the method saying "bring the customer and items along too".',
      points: [
        '<code>@EntityGraph(attributePaths = {"customer", "items"})</code> on the method.',
        'Works with derived queries and <code>findAll</code>.',
        'Fixes N+1 without writing JPQL.',
        'Same pagination warning as JOIN FETCH for collections.',
      ],
    },
    {
      title: 'Auditing',
      level: 'intermediate',
      summary: 'Fill created/modified dates and users automatically on save.',
      simple:
        'A stamp machine that writes "created by Ann at 10:03" on every new form, without you remembering to do it.',
      points: [
        'Enable with <code>@EnableJpaAuditing</code>.',
        'Add <code>@EntityListeners(AuditingEntityListener.class)</code> to the entity.',
        'Fields: <code>@CreatedDate</code>, <code>@LastModifiedDate</code>, <code>@CreatedBy</code>, <code>@LastModifiedBy</code>.',
        'Users come from an <code>AuditorAware</code> bean (often Spring Security).',
        'Plain Hibernate has <code>@CreationTimestamp</code> / <code>@UpdateTimestamp</code>.',
      ],
    },
    {
      title: 'Testing Repositories',
      level: 'intermediate',
      summary: 'Test your queries and mappings against a real database with @DataJpaTest.',
      simple:
        'Like test-driving a car on a real road instead of in a video game. Only the real road shows the real bumps.',
      points: [
        '<code>@DataJpaTest</code> starts only the JPA parts, and each test rolls back at the end.',
        'It uses an in-memory DB by default. H2 can hide real-database differences.',
        'Better: a real Postgres or MySQL with Testcontainers and <code>@ServiceConnection</code>.',
        'Call <code>flush()</code> (e.g. via <code>TestEntityManager</code>), or the SQL may never run before rollback.',
        'Assert the number of SQL statements to catch N+1 early.',
      ],
      tip: 'A test that saves and finds in one transaction may never hit the DB: the first-level cache answers. Flush and clear first.',
    },
    {
      title: 'Specifications',
      level: 'advanced',
      summary: 'Reusable Criteria predicates you combine for dynamic search screens.',
      points: [
        'Extend <code>JpaSpecificationExecutor&lt;T&gt;</code>.',
        'A <code>Specification&lt;T&gt;</code> is a lambda returning a Criteria <code>Predicate</code>.',
        'Combine with <code>a.and(b).or(c)</code>; a <code>null</code> predicate is simply skipped.',
        'Alternatives: Querydsl, or Query by Example for simple filters.',
      ],
      detail: `<pre><code>static Specification&lt;Order&gt; hasStatus(Status s) {
  return (root, q, cb) -&gt; s == null ? null : cb.equal(root.get("status"), s);
}
repo.findAll(hasStatus(s).and(minTotal(min)), pageable);</code></pre>`,
    },
    {
      title: 'Custom Repository Methods',
      level: 'advanced',
      summary: 'Add hand-written methods to a Spring Data repository through a fragment interface.',
      points: [
        'Write an interface (<code>OrderRepositoryCustom</code>) and a class with the <code>Impl</code> suffix.',
        'Your repository extends both <code>JpaRepository</code> and the custom interface.',
        'Inside the Impl, inject the <code>EntityManager</code> and use Criteria, native SQL or Hibernate APIs.',
        'Good for complex dynamic queries, bulk work or Hibernate-only features.',
      ],
      detail: `<pre><code>interface OrderRepositoryCustom {
  List&lt;Order&gt; search(OrderFilter f);
}

class OrderRepositoryCustomImpl implements OrderRepositoryCustom {
  @PersistenceContext EntityManager em;
  public List&lt;Order&gt; search(OrderFilter f) { /* Criteria query */ }
}

interface OrderRepository
    extends JpaRepository&lt;Order, Long&gt;, OrderRepositoryCustom {}</code></pre>`,
    },
    {
      title: 'save() Pitfalls',
      level: 'advanced',
      summary:
        'save() calls persist for new entities and merge for others, which can cost extra queries.',
      points: [
        '"New" means id is <code>null</code> (or <code>@Version</code> is null).',
        'Assigned ids (UUID set by you) look "not new" → <code>merge</code> → extra <code>SELECT</code>.',
        'Fix: implement <code>Persistable&lt;ID&gt;</code> with your own <code>isNew()</code>.',
        'Managed entities don’t need <code>save()</code> at all inside a transaction.',
        '<code>deleteBy...</code> derived methods load each entity first, then delete one by one.',
      ],
      tip: 'Calling save() on an entity you just loaded in the same transaction is harmless but useless: dirty checking already saves it.',
    },
    {
      title: 'History with Envers',
      level: 'advanced',
      summary:
        'Hibernate Envers keeps a full history of every change to an entity in audit tables.',
      points: [
        'Add <code>hibernate-envers</code> and put <code>@Audited</code> on the entity.',
        'Each change writes a copy to an <code>_AUD</code> table, tagged with a revision number.',
        'Read old versions with <code>AuditReaderFactory.get(em)</code>, or Spring Data Envers’ <code>RevisionRepository</code>.',
        'Spring Data auditing keeps only the latest change. Envers keeps every version.',
        'Costs an extra insert per change, so audit only what you need.',
      ],
    },
  ],
};
