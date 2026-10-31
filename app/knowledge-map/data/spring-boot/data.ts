import type { KmNode } from '../../types';

export const data: KmNode = {
  title: 'Data & JPA',
  level: 'beginner',
  summary: 'Store and load data with Spring Data JPA, Hibernate and a connection pool.',
  simple:
    'The database is a big warehouse. JPA is the warehouse clerk who turns your Java objects into rows on shelves and back again.',
  children: [
    {
      title: 'DataSource & HikariCP',
      level: 'beginner',
      summary: 'The connection to your database. Boot sets it up from a few properties.',
      simple:
        'Opening a DB connection is like starting a car. A pool keeps a few cars running in the lot, ready to go.',
      points: [
        'Set <code>spring.datasource.url</code>, <code>username</code> and <code>password</code>.',
        'HikariCP is the default pool. Size it with <code>spring.datasource.hikari.maximum-pool-size</code>.',
        'A bigger pool is not always faster. The DB has its own limits.',
        'Plain SQL? Use <code>JdbcClient</code> (Spring 6.1) instead of JPA.',
      ],
    },
    {
      title: 'Entities',
      level: 'beginner',
      summary: 'Java classes mapped to database tables with @Entity and @Id.',
      simple: 'An entity is a Java class that looks like a row in a table: each field is a column.',
      points: [
        '<code>@Entity</code> + <code>@Id</code>, often with <code>@GeneratedValue</code>.',
        'Needs a no-args constructor. Records cannot be entities (they are fine for DTOs and projections).',
        'Annotations come from <code>jakarta.persistence</code> since Boot 3.',
        'Entities are "managed": change a field inside a transaction and Hibernate saves it at commit (dirty checking).',
      ],
      detail: `<pre><code>@Entity
public class Customer {
  @Id @GeneratedValue
  private Long id;
  private String name;

  protected Customer() {}
  public Customer(String name) { this.name = name; }
}</code></pre>`,
    },
    {
      title: 'Repositories',
      level: 'beginner',
      summary: 'Write an interface. Spring Data creates the implementation with CRUD methods.',
      simple:
        'You write a wish list of methods. Spring reads the names and builds the code behind them.',
      points: [
        'Extend <code>JpaRepository&lt;Customer, Long&gt;</code> to get save, findById, findAll, delete…',
        'Derived queries from method names: <code>findByEmailAndActiveTrue</code>.',
        'Custom JPQL or SQL with <code>@Query</code>. Add <code>@Modifying</code> for updates.',
        'Projections: return an interface or record with only the fields you need.',
      ],
      detail: `<pre><code>public interface CustomerRepository extends JpaRepository&lt;Customer, Long&gt; {
  Optional&lt;Customer&gt; findByEmail(String email);

  @Query("select c from Customer c where c.createdAt &gt; :since")
  List&lt;Customer&gt; newSince(Instant since);
}</code></pre>`,
    },
    {
      title: 'Paging & sorting',
      level: 'beginner',
      summary: 'Load data page by page instead of all at once.',
      simple: 'Like a search engine: show 20 results per page, not all one million.',
      points: [
        'Add a <code>Pageable</code> parameter and return <code>Page&lt;T&gt;</code> or <code>Slice&lt;T&gt;</code>.',
        '<code>PageRequest.of(0, 20, Sort.by("name"))</code>.',
        '<code>Page</code> runs an extra count query. <code>Slice</code> skips it.',
        'Very deep pages are slow with OFFSET. Use keyset ("seek") paging for big tables.',
      ],
    },
    {
      title: 'Relationships',
      level: 'intermediate',
      summary: 'Link entities with @OneToMany, @ManyToOne, @OneToOne and @ManyToMany.',
      simple:
        'A customer has many orders, each order belongs to one customer. JPA turns these links into foreign keys.',
      points: [
        'The side with the foreign key is the owner. The other side uses <code>mappedBy</code>.',
        'Default fetch: <code>@ManyToOne</code> and <code>@OneToOne</code> are EAGER, collections are LAZY.',
        'Set <code>@ManyToOne(fetch = LAZY)</code> almost always.',
        'Cascade and <code>orphanRemoval</code> only for true parent-child data.',
        'Avoid <code>@ManyToMany</code> with extra data. Use a join entity instead.',
      ],
    },
    {
      title: 'N+1 problem',
      level: 'intermediate',
      summary: 'One query for a list, then one extra query per row to load its children.',
      simple:
        'You ask the clerk for 100 orders, then walk back 100 times to get each order’s items. Very slow.',
      points: [
        'Shows up when you loop and touch a lazy collection.',
        'Fix with <code>join fetch</code> in JPQL, or <code>@EntityGraph</code> on the repository method.',
        'Or batch loading: <code>spring.jpa.properties.hibernate.default_batch_fetch_size=50</code>.',
        'Spot it: log SQL (<code>spring.jpa.show-sql</code>) or count queries in tests.',
      ],
      detail: `<pre><code>@EntityGraph(attributePaths = "items")
List&lt;Order&gt; findByStatus(Status status);</code></pre>`,
      tip: 'Classic interview question. Name the cause (lazy loading in a loop) and two fixes (fetch join, entity graph or batch size).',
    },
    {
      title: 'Open Session in View',
      level: 'advanced',
      summary: 'Keeps the DB session open while the web response is built. On by default in Boot.',
      simple:
        'It keeps the warehouse door open until the customer leaves, so late requests still work, but a worker is stuck at the door the whole time.',
      points: [
        '<code>spring.jpa.open-in-view</code> is true by default, and Boot logs a warning about it.',
        'Hides lazy-loading bugs and holds a DB connection for the whole request.',
        'Set it to false and load what you need in the service layer.',
      ],
    },
    {
      title: 'Schema migrations',
      level: 'intermediate',
      summary: 'Version your database schema with Flyway or Liquibase.',
      simple: 'Like Git for your tables: every change is a numbered step, run once, in order.',
      points: [
        'Add Flyway and put scripts in <code>db/migration</code> (V1__init.sql, V2__add_email.sql…).',
        'Migrations run at startup, before JPA starts.',
        'Turn off Hibernate auto-DDL in prod: <code>spring.jpa.hibernate.ddl-auto=validate</code> or <code>none</code>.',
        'Never edit a migration that already ran. Add a new one.',
      ],
    },
  ],
};

export const transactions: KmNode = {
  title: 'Transactions',
  level: 'intermediate',
  summary: 'Make several DB steps succeed or fail together with @Transactional.',
  simple:
    'A bank transfer takes money from A and gives it to B. Both happen, or neither. A transaction is that promise.',
  children: [
    {
      title: '@Transactional basics',
      level: 'intermediate',
      summary: 'Put it on a service method: Spring starts a transaction before and commits after.',
      simple:
        'Spring wraps your method in an envelope: open, run the work, seal (commit). If something breaks, tear it up (rollback).',
      points: [
        'Works through a proxy, so only calls coming from outside the bean are covered.',
        'Put it on the service layer, not on controllers or repositories.',
        'Spring Data repository methods are already transactional on their own.',
        'Keep transactions short. No remote HTTP calls inside them.',
      ],
      detail: `<pre><code>@Transactional
public void transfer(long from, long to, BigDecimal amount) {
  accounts.debit(from, amount);
  accounts.credit(to, amount);  // fails → both are rolled back
}</code></pre>`,
    },
    {
      title: 'Rollback rules',
      level: 'intermediate',
      summary: 'By default only unchecked exceptions roll back. Checked exceptions commit.',
      simple:
        'Spring only tears up the envelope for "unexpected" errors. For "expected" (checked) ones, it seals it anyway unless you say otherwise.',
      points: [
        'Rollback on <code>RuntimeException</code> and <code>Error</code>.',
        'Checked exceptions commit by default. Use <code>rollbackFor = Exception.class</code> to change it.',
        'If you catch the exception inside the method, Spring never sees it, so it commits.',
      ],
      tip: 'Frequent bug: a checked IOException is thrown, and the half-done work is committed.',
    },
    {
      title: 'Propagation',
      level: 'advanced',
      summary: 'What happens when a transactional method calls another transactional method.',
      simple:
        'Join the trip that is already going (REQUIRED), or always take your own car (REQUIRES_NEW).',
      points: [
        '<code>REQUIRED</code> (default): join the current transaction or start one.',
        '<code>REQUIRES_NEW</code>: pause the outer one and run in a fresh one. Good for audit logs.',
        '<code>NESTED</code>: a savepoint inside the outer one (JDBC only).',
        '<code>SUPPORTS</code>, <code>MANDATORY</code>, <code>NOT_SUPPORTED</code>, <code>NEVER</code> are rarer.',
        'An inner REQUIRED failure marks the whole transaction rollback-only → <code>UnexpectedRollbackException</code>.',
      ],
    },
    {
      title: 'Read-only',
      level: 'intermediate',
      summary: '@Transactional(readOnly = true) tells Spring and Hibernate you will not write.',
      simple:
        'Like telling a librarian "I only want to read, not borrow" so they skip the paperwork.',
      points: [
        'Hibernate skips dirty checking and flushing, which saves memory and time.',
        'Some setups route read-only work to a read replica.',
        'Common pattern: <code>readOnly = true</code> on the class, plain <code>@Transactional</code> on write methods.',
      ],
    },
    {
      title: 'Self-invocation pitfall',
      level: 'advanced',
      summary:
        'Calling a @Transactional method from the same class skips the proxy, so no transaction.',
      simple:
        'The security guard only checks people coming through the front door. Walking from one room to another inside the building, nobody checks you.',
      points: [
        '<code>this.save()</code> calls the real object, not the proxy.',
        'Same problem for <code>@Async</code>, <code>@Cacheable</code> and other proxy-based annotations.',
        'Fix: move the method to another bean, or inject the bean and call it through the proxy.',
        'Also ignored on <code>private</code> methods and, with CGLIB, on <code>final</code> methods.',
      ],
      detail: `<pre><code>public void importAll(List&lt;Row&gt; rows) {
  rows.forEach(this::saveRow);   // NO transaction: self-call
}

@Transactional
public void saveRow(Row r) { ... }</code></pre>`,
      tip: 'Top interview question. Answer with "proxy" and "self-invocation", then give the fix.',
    },
    {
      title: 'Isolation & locking',
      level: 'expert',
      summary: 'Control how concurrent transactions see each other’s changes.',
      simple:
        'Two people edit the same spreadsheet. Isolation decides whether you see their unsaved typing, and locking decides who has to wait.',
      points: [
        '<code>isolation = READ_COMMITTED</code> is the default on most DBs (MySQL InnoDB uses REPEATABLE_READ).',
        'Optimistic locking: a <code>@Version</code> field. A stale update fails instead of overwriting.',
        'Pessimistic locking: <code>@Lock(PESSIMISTIC_WRITE)</code> → <code>SELECT … FOR UPDATE</code>.',
        'Prefer optimistic locking for web apps with rare conflicts.',
      ],
    },
  ],
};
