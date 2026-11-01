import type { KmNode } from '../../types';

export const transactionsLocking: KmNode = {
  title: 'Transactions & Locking',
  level: 'intermediate',
  summary:
    'How JPA groups changes into transactions and stops two users from overwriting each other.',
  simple:
    'Two people editing the same shared document. Locking decides whether the second one gets a warning, or has to wait for the first.',
  points: [
    'All writes in JPA must happen inside a transaction.',
    'Optimistic locking (<code>@Version</code>) detects conflicts at save time.',
    'Pessimistic locking blocks other writers with row locks.',
    'Isolation level comes from the database; JPA adds its own guarantees on top.',
  ],
  children: [
    {
      title: 'Transactions in JPA',
      level: 'beginner',
      summary: 'A unit of work where all changes are saved together or not at all.',
      simple:
        'A bank transfer: take money from A and give it to B. Either both happen, or neither does.',
      points: [
        'Plain JPA (resource-local): <code>em.getTransaction().begin()</code> / <code>commit()</code>.',
        'Java EE / Jakarta EE servers use JTA, managed by the container.',
        'Spring: <code>@Transactional</code> on a service method; Spring opens and closes the EntityManager for you.',
        'On a runtime exception the transaction rolls back, and loaded entities are no longer trustworthy.',
      ],
      detail: `<pre><code>@Transactional
public void pay(Long orderId) {
  Order o = orderRepo.findById(orderId).orElseThrow();
  o.markPaid();          // no save() needed: dirty checking
}</code></pre>`,
      tip: 'Spring transaction details (propagation, rollback rules, self-invocation) live in the Spring Boot map.',
    },
    {
      title: 'Optimistic Locking',
      level: 'intermediate',
      summary: 'A @Version column detects if someone else changed the row since you read it.',
      simple:
        'Like a Wiki page: if someone saved a newer version while you were typing, your save is rejected and you must reload.',
      points: [
        'Add <code>@Version private long version;</code> (or <code>Integer</code>/<code>Instant</code>).',
        'Each <code>UPDATE</code> checks <code>where id = ? and version = ?</code> and bumps it.',
        '0 rows updated → <code>OptimisticLockException</code>.',
        'No DB locks held; great for web apps with low conflict rates.',
        'Handle it by retrying or by showing "data changed, please reload".',
      ],
      detail: `<pre><code>@Entity
class Account {
  @Id Long id;
  @Version Long version;
  BigDecimal balance;
}</code></pre>`,
    },
    {
      title: 'Pessimistic Locking',
      level: 'advanced',
      summary: 'Lock rows in the database while you read them, so others must wait.',
      simple:
        'Taking the only key to the meeting room. Nobody else can get in until you give it back.',
      points: [
        '<code>PESSIMISTIC_WRITE</code> → usually <code>SELECT ... FOR UPDATE</code>.',
        '<code>PESSIMISTIC_READ</code> → shared lock (where the DB supports it).',
        'Locks last until the transaction ends; keep those transactions short.',
        'Risk of deadlocks: always lock rows in the same order.',
      ],
      detail: `<pre><code>Account a = em.find(Account.class, id,
    LockModeType.PESSIMISTIC_WRITE,
    Map.of("jakarta.persistence.lock.timeout", 2000));</code></pre>`,
    },
    {
      title: 'Lock Modes',
      level: 'advanced',
      summary:
        'LockModeType values that let you force version checks or bumps even without changes.',
      points: [
        '<code>OPTIMISTIC</code>: check the version at commit, even if you only read.',
        '<code>OPTIMISTIC_FORCE_INCREMENT</code>: bump the version (e.g. order changed because an item changed).',
        '<code>PESSIMISTIC_FORCE_INCREMENT</code>: lock and bump.',
        'Set via <code>em.lock()</code>, <code>find()</code> or <code>query.setLockMode()</code>; Spring Data has <code>@Lock</code>.',
      ],
    },
    {
      title: 'Isolation & JPA',
      level: 'advanced',
      summary:
        'The database isolation level still rules; the persistence context adds repeatable reads for entities.',
      points: [
        'Most databases default to READ COMMITTED; MySQL InnoDB uses REPEATABLE READ.',
        'The context returns the same object on re-read, so you see your first version (application-level repeatable read).',
        'That does not stop lost updates; use <code>@Version</code> for that.',
        'Change isolation in Spring with <code>@Transactional(isolation = ...)</code>.',
      ],
    },
  ],
};

export const caching: KmNode = {
  title: 'Caching',
  level: 'advanced',
  summary:
    'The first-level cache inside every session, and the optional shared second-level cache.',
  simple:
    'First-level cache is the notepad on your own desk. Second-level cache is the shared whiteboard in the office that everyone can read.',
  points: [
    'First-level cache: always on, per EntityManager, cleared when it closes.',
    'Second-level cache: optional, shared by the whole app, needs a provider.',
    'Query cache stores query result ids; it is off by default.',
    'Caching helps read-mostly data; it hurts data that changes a lot.',
  ],
  children: [
    {
      title: 'First-Level Cache',
      level: 'intermediate',
      summary:
        'The persistence context itself: repeated finds by id in one session skip the database.',
      simple: 'Once a file is on your desk, you don’t walk to the archive again to look at it.',
      points: [
        'Always on; you can’t disable it.',
        'Only <code>find</code>/<code>getReference</code> by id use it directly.',
        'JPQL queries still go to the DB, but return the already-managed instances.',
        'Grows with every loaded entity: watch memory in long sessions.',
      ],
    },
    {
      title: 'Second-Level Cache',
      level: 'advanced',
      summary:
        'A shared cache of entity data across sessions, backed by a provider like Ehcache or Infinispan.',
      points: [
        'Provider via JCache (JSR-107): Ehcache 3, Caffeine (via its JCache module), Infinispan, Hazelcast.',
        'Opt in per entity with <code>@Cacheable</code> plus Hibernate’s <code>@Cache(usage = ...)</code>.',
        'Stores dehydrated state (field values), not your Java objects.',
        'Bulk JPQL and native updates evict affected regions; changes outside the app are invisible.',
        'Each node has its own copy unless you use a distributed cache.',
      ],
      detail: `<pre><code>@Entity
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Country {
  @Id String code;
  String name;
}</code></pre>`,
      children: [
        {
          title: 'Concurrency Strategies',
          level: 'expert',
          summary: 'How the cache stays consistent with the database when data changes.',
          points: [
            '<code>READ_ONLY</code>: fastest; for data that never changes.',
            '<code>NONSTRICT_READ_WRITE</code>: small window of stale reads allowed.',
            '<code>READ_WRITE</code>: soft locks keep it consistent; common default.',
            '<code>TRANSACTIONAL</code>: full XA/JTA consistency, needs a transactional provider.',
          ],
        },
      ],
    },
    {
      title: 'Collection Cache',
      level: 'expert',
      summary: 'Caches the ids inside a collection; the elements must be cached too.',
      points: [
        'Add <code>@Cache</code> on the collection field.',
        'Stores only child ids, then looks each one up in the entity cache.',
        'If the child entity isn’t cached, you get N+1 queries from the cache.',
      ],
    },
    {
      title: 'Query Cache',
      level: 'expert',
      summary: 'Caches the result of a query for the same parameters, so it can skip the database.',
      points: [
        'Enable with <code>hibernate.cache.use_query_cache=true</code> plus a per-query hint.',
        'Any write to a table invalidates all cached queries on that table.',
        'Only pays off for read-mostly tables and repeated identical queries.',
        'Before Hibernate 6.5 it stored only ids; uncached entities were then loaded one by one.',
      ],
      tip: 'Measure before enabling the query cache. On busy tables it often makes things slower.',
    },
  ],
};
