import type { KmNode } from '../../types';

export const performance: KmNode = {
  title: 'Performance Tuning',
  level: 'advanced',
  summary:
    'Practical ways to make Hibernate fast: fewer queries, fewer columns, fewer round trips.',
  simple:
    'Most slow JPA apps are not slow because of Hibernate. They are slow because they ask the database the wrong way, too often.',
  points: [
    'First measure: log SQL, count queries, check slow query logs.',
    'Fix N+1 and over-fetching before anything else.',
    'Read with DTOs, write with entities.',
    'Batch your writes and keep sessions small in bulk jobs.',
  ],
  children: [
    {
      title: 'DTO Projections',
      level: 'intermediate',
      summary: 'Select straight into records/DTOs for read-only screens, skipping entity tracking.',
      simple: 'If you only want to look at the photo, don’t move the whole person into your house.',
      points: [
        'JPQL constructor expression: <code>select new com.shop.OrderRow(o.id, o.total) from Order o</code>.',
        'Loads only the needed columns; no dirty checking, no lazy loading.',
        'Hibernate 6 can also map to a record by type: <code>createQuery(hql, OrderRow.class)</code>.',
        'Use <code>Tuple</code> results for quick ad-hoc reads.',
      ],
      tip: 'Rule of thumb: entities when you plan to change data, DTOs when you only display it.',
    },
    {
      title: 'Statistics & Monitoring',
      level: 'advanced',
      summary: 'Built-in counters for queries, flushes, cache hits and slow queries.',
      points: [
        '<code>hibernate.generate_statistics=true</code> logs per-session metrics.',
        '<code>hibernate.log_slow_query=200</code> (ms) logs queries slower than that.',
        'With <code>hibernate-micrometer</code>, Spring Boot exposes these as Micrometer metrics.',
        'Tools like datasource-proxy or p6spy show real SQL and timings.',
        'Assert query counts in tests to stop N+1 from coming back.',
      ],
    },
    {
      title: 'Read-only Mode',
      level: 'advanced',
      summary: 'Tell Hibernate you won’t change the data, so it skips snapshots and dirty checks.',
      points: [
        'Spring <code>@Transactional(readOnly = true)</code> sets the session to read-only and flush mode MANUAL.',
        'Query hint <code>org.hibernate.readOnly</code> for single queries.',
        'Saves memory (no snapshots) and CPU at flush.',
        'Some drivers can route read-only transactions to replicas.',
      ],
    },
    {
      title: 'JDBC Batching',
      level: 'advanced',
      summary: 'Send many INSERT/UPDATE statements in one round trip instead of one by one.',
      points: [
        'Turn on with <code>hibernate.jdbc.batch_size=50</code> (off by default).',
        'Add <code>hibernate.order_inserts=true</code> and <code>order_updates=true</code> to group statements.',
        'Doesn’t work for inserts with <code>IDENTITY</code> ids; use <code>SEQUENCE</code>.',
        'MySQL also needs <code>rewriteBatchedStatements=true</code> on the JDBC URL for full gains.',
      ],
    },
    {
      title: 'Bulk Processing',
      level: 'advanced',
      summary: 'Flush and clear every N entities so big jobs don’t run out of memory.',
      points: [
        'The context keeps every entity plus a snapshot; 1 million rows = huge heap.',
        'Flush and clear every batch-size items.',
        'For reads, stream with <code>getResultStream()</code> and a fetch size.',
        'For mass changes, a bulk JPQL or SQL statement is often best.',
      ],
      detail: `<pre><code>for (int i = 0; i &lt; rows.size(); i++) {
  em.persist(toEntity(rows.get(i)));
  if (i % 50 == 49) {
    em.flush();
    em.clear();
  }
}</code></pre>`,
    },
    {
      title: 'StatelessSession',
      level: 'expert',
      summary:
        'A Hibernate session with no persistence context, no cascades and no dirty checking.',
      points: [
        'Each <code>insert</code>/<code>update</code> call maps directly to one SQL statement.',
        'No first-level cache, so memory stays flat.',
        'Great for ETL and imports; lazy loading and cascades don’t work.',
        'Jakarta Data repositories in Hibernate 6.6+ build on it.',
      ],
    },
    {
      title: 'Smaller UPDATEs',
      level: 'expert',
      summary: 'Options that shrink or reuse the SQL Hibernate generates.',
      points: [
        'By default Hibernate updates all columns, so one statement can be reused.',
        '<code>@DynamicUpdate</code> writes only changed columns: good for wide tables.',
        '<code>hibernate.query.in_clause_parameter_padding=true</code> pads IN lists to reuse plans.',
        'Plan cache size: <code>hibernate.query.plan_cache_max_size</code>.',
      ],
    },
    {
      title: 'Connection Handling',
      level: 'expert',
      summary:
        'Hold a database connection for as short a time as you can, so the pool never runs dry.',
      points: [
        'A transaction takes a pool connection at the start and keeps it until commit.',
        'Slow work inside it (HTTP calls, file uploads) blocks a connection for nothing.',
        'Turn off pool auto-commit and set <code>hibernate.connection.provider_disables_autocommit=true</code>.',
        'Then Hibernate can get the connection later, when the first SQL actually runs.',
        'Watch HikariCP metrics: active, pending and wait time. Start with a small pool (about 10).',
      ],
      tip: 'Do remote calls before or after the transaction, never inside it.',
    },
  ],
};
