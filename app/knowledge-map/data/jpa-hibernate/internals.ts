import type { KmNode } from '../../types';

export const internals: KmNode = {
  title: 'Hibernate Internals',
  level: 'expert',
  summary:
    'What happens under the hood: dirty checking, proxies, flush modes and the action queue.',
  simple:
    'You can drive without knowing the engine. But when Hibernate does something "magic" or slow, these are the parts making it happen.',
  points: [
    'Dirty checking compares entities to snapshots taken at load time.',
    'Lazy loading works through generated proxy subclasses.',
    'SQL is queued in an action queue and sent in a fixed order at flush.',
    'Bytecode enhancement can replace snapshots and proxies with smarter classes.',
  ],
  children: [
    {
      title: 'Dirty Checking',
      level: 'advanced',
      summary:
        'At flush, Hibernate compares each managed entity with its load-time snapshot and writes UPDATEs for changes.',
      points: [
        'On load, Hibernate keeps a copy of every field value (the snapshot).',
        'At flush it compares every managed entity field by field.',
        'Cost grows with the number of managed entities, even unchanged ones.',
        'That is why huge sessions get slow and read-only mode helps.',
      ],
      tip: 'Interview answer: "You don’t call update in JPA. You change a managed entity, and dirty checking writes the UPDATE at flush."',
    },
    {
      title: 'Bytecode Enhancement',
      level: 'expert',
      summary:
        'A build step that rewrites entity classes so they track their own changes and lazy fields.',
      points: [
        'Added by the Hibernate Maven/Gradle plugin at build time.',
        'Entities record which fields changed: no snapshot comparison needed.',
        'Enables truly lazy basic fields and lazy inverse <code>@OneToOne</code>.',
        'Adds build complexity; enable it when profiling shows a need.',
      ],
    },
    {
      title: 'Proxies',
      level: 'expert',
      summary:
        'Generated subclasses that stand in for lazy entities and load data on first access.',
      points: [
        'Created with ByteBuddy (Javassist support was removed in Hibernate 6).',
        'Calling <code>getId()</code> does not load the row; other getters do.',
        '<code>proxy.getClass()</code> is a subclass, so <code>getClass() ==</code> checks fail.',
        'Use <code>Hibernate.getClass(e)</code>, <code>Hibernate.isInitialized(e)</code>, <code>Hibernate.unproxy(e)</code>.',
        'Final classes or methods break proxying.',
      ],
    },
    {
      title: 'Flush Modes',
      level: 'expert',
      summary: 'Rules for when Hibernate sends pending changes to the database.',
      points: [
        'JPA <code>AUTO</code> (default): flush before commit and before queries that touch dirty tables.',
        'JPA <code>COMMIT</code>: flush only at commit; queries may see old data.',
        'Hibernate <code>MANUAL</code>: only on explicit <code>flush()</code>; used for read-only.',
        'Hibernate <code>ALWAYS</code>: flush before every query.',
        'Native SQL under Hibernate’s AUTO may trigger a full flush, since it can’t see which tables you touch.',
      ],
    },
    {
      title: 'Action Queue & Order',
      level: 'expert',
      summary:
        'Pending SQL is grouped and run in a fixed order at flush, not in the order you called it.',
      points: [
        'Order: inserts → updates → collection changes → deletes.',
        'So "delete row, then insert same unique key" can fail at flush.',
        'Fix by calling <code>flush()</code> between the two steps.',
        'Ordering inserts/updates by entity type is what makes batching effective.',
      ],
      tip: 'If a unique constraint fails although you deleted the old row first, remember the deletes run last.',
    },
    {
      title: 'Session & SessionFactory',
      level: 'expert',
      summary: 'Hibernate’s native types behind EntityManager and EntityManagerFactory.',
      points: [
        '<code>SessionFactory</code> extends <code>EntityManagerFactory</code>; <code>Session</code> extends <code>EntityManager</code>.',
        'Boot builds the metamodel, SQL strings and generators once: slow start, fast runtime.',
        'Unwrap to use extras: <code>em.unwrap(Session.class)</code>.',
        'Filters, natural ids, <code>StatelessSession</code> and multi-tenancy live here.',
      ],
    },
    {
      title: 'Multi-tenancy',
      level: 'expert',
      summary: 'Serve many customers (tenants) from one app while keeping their data apart.',
      points: [
        'Three styles: a database per tenant, a schema per tenant, or a tenant column in shared tables.',
        'Hibernate asks your <code>CurrentTenantIdentifierResolver</code> which tenant the current request is for.',
        'Separate DB or schema: a <code>MultiTenantConnectionProvider</code> hands out the right connection.',
        'Shared tables: mark a field <code>@TenantId</code> (Hibernate 6+) and Hibernate filters every query.',
        'Native SQL is not filtered for you. Add the tenant condition yourself.',
      ],
    },
  ],
};

export const modernJpa: KmNode = {
  title: 'Modern JPA & Hibernate',
  level: 'advanced',
  summary:
    'What changed in the latest specs and Hibernate versions, and what to watch when upgrading.',
  points: [
    'Jakarta Persistence 3.0 (2020): only the package rename to <code>jakarta.*</code>.',
    '3.1 (2022) and 3.2 (2024) added real features.',
    'Hibernate 6 rewrote the query engine and type system.',
    'Spring Boot 3 ships Hibernate 6; Spring Boot 4 moves to Hibernate 7.',
  ],
  children: [
    {
      title: 'Hibernate 6 Query Engine',
      level: 'advanced',
      summary: 'HQL and Criteria now share one new engine called SQM (Semantic Query Model).',
      points: [
        'Reads JDBC results by position, not column alias: faster.',
        'Richer HQL: set operations, window functions, CTEs, <code>filter</code> clauses.',
        'Join-fetched parents are deduplicated; <code>distinct</code> isn’t needed for that.',
        'Some old HQL tricks now fail with stricter type checks.',
      ],
    },
    {
      title: 'Hibernate 6 Mapping Changes',
      level: 'advanced',
      summary: 'New type system and new defaults that can surprise you during an upgrade.',
      points: [
        '<code>@Type(type = "...")</code> strings are gone; use <code>@JdbcTypeCode</code> or <code>UserType</code> classes.',
        'JSON columns: <code>@JdbcTypeCode(SqlTypes.JSON)</code>.',
        'Sequences default to one per entity (<code>&lt;entity&gt;_SEQ</code>), not <code>hibernate_sequence</code>.',
        'Old legacy Criteria API and many deprecated methods were removed.',
      ],
      tip: 'Upgrading from Hibernate 5? Check your ID sequences first. A wrong sequence name or increment is the most common boot failure.',
    },
    {
      title: 'Jakarta Persistence 3.1',
      level: 'advanced',
      summary: 'Added UUID support and new JPQL functions; implemented by Hibernate 6.2+.',
      points: [
        '<code>UUID</code> as a basic type and <code>GenerationType.UUID</code>.',
        'Math functions: <code>CEILING</code>, <code>FLOOR</code>, <code>ROUND</code>, <code>EXP</code>, <code>LN</code>, <code>POWER</code>, <code>SIGN</code>.',
        'Date functions: <code>EXTRACT</code>, <code>LOCAL DATE</code>, <code>LOCAL DATETIME</code>.',
        '<code>EntityManagerFactory</code> and <code>EntityManager</code> are <code>AutoCloseable</code>.',
      ],
    },
    {
      title: 'Jakarta Persistence 3.2',
      level: 'expert',
      summary:
        'A bigger release with records, programmatic setup and new helpers; implemented by Hibernate 7.',
      points: [
        'Java records as embeddables.',
        'Programmatic boot with <code>PersistenceConfiguration</code> (no XML).',
        '<code>emf.runInTransaction(em -&gt; ...)</code> and <code>callInTransaction</code>.',
        'JPQL: <code>union</code>, <code>intersect</code>, <code>except</code>, <code>||</code> concat, <code>cast</code>, <code>left</code>/<code>right</code>.',
        '<code>find()</code> accepts <code>FindOption</code>s like lock mode and timeout.',
      ],
      detail: `<pre><code>emf.runInTransaction(em -&gt; {
  Book b = em.find(Book.class, isbn, LockModeType.PESSIMISTIC_WRITE);
  b.setStock(b.getStock() - 1);
});</code></pre>`,
    },
    {
      title: 'Hibernate 7 & Jakarta Data',
      level: 'expert',
      summary:
        'Hibernate 7 targets Jakarta Persistence 3.2 and works with the new Jakarta Data repositories.',
      points: [
        'Hibernate 7.0 (2025): Java 17+, Jakarta Persistence 3.2, license moved to Apache 2.0.',
        'Many deprecated <code>Session</code> methods (e.g. <code>save</code>, <code>update</code>) were removed.',
        'Jakarta Data 1.0: annotated repository interfaces, type-checked at compile time.',
        'Hibernate generates them with its annotation processor since 6.6.',
        'Soft delete (<code>@SoftDelete</code>, since 6.4) and other extras keep growing.',
      ],
    },
    {
      title: 'Interview Questions',
      level: 'advanced',
      summary: 'The JPA and Hibernate questions that come up again and again, with short answers.',
      points: [
        '<b>JPA vs Hibernate?</b> JPA is the spec; Hibernate implements it and adds extras.',
        '<b>What is N+1?</b> Lazy loading in a loop. Fix with JOIN FETCH, entity graph or batch size.',
        '<b>persist vs merge?</b> persist makes that object managed; merge returns a managed copy.',
        '<b>Why no update() call?</b> Dirty checking writes changes to managed entities at flush.',
        '<b>LazyInitializationException?</b> Lazy data touched after the session closed. Fetch it in the query.',
        '<b>Optimistic vs pessimistic locking?</b> <code>@Version</code> detects conflicts; row locks make others wait.',
      ],
      tip: 'For each answer, add one real bug you hit. It shows you have used Hibernate, not just read about it.',
    },
  ],
};
