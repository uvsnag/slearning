import type { KmNode } from '../../types';

export const apps: KmNode = {
  title: 'SQL in Applications',
  level: 'intermediate',
  summary:
    'Call SQL safely and efficiently from code, and scale the database when one server isn’t enough.',
  simple:
    'Writing a good query is half the job. The other half is how your app talks to the database: safely, without wasting trips, and without drowning it.',
  points: [
    'Always use parameters; never glue user input into SQL.',
    'Reuse connections with a pool.',
    'Watch for N+1 queries and slow OFFSET pagination.',
  ],
  children: [
    {
      title: 'SQL Injection',
      level: 'beginner',
      summary:
        'An attack where user input is treated as SQL code because it was glued into the query string.',
      simple:
        'You ask for a name and someone types a command instead. If you paste it straight into your query, the database runs their command.',
      points: [
        'Input like <code>&#39; OR &#39;1&#39;=&#39;1</code> can bypass a login check.',
        'Input like <code>&#39;; DROP TABLE users; --</code> can destroy data.',
        'Still one of the most common security holes (OWASP Top 10).',
        'Escaping by hand is not enough. Use parameters. In dynamic SQL use <code>sp_executesql</code> (SQL Server) or <code>format(&#39;%I&#39;)</code> (PG).',
      ],
    },
    {
      title: 'Parameters',
      level: 'beginner',
      summary:
        'Send the SQL with placeholders and the values separately, so input can never become code.',
      simple:
        'You hand the database a form with blank boxes, then the values separately. Whatever goes in a box is only ever data.',
      points: [
        'JDBC: <code>?</code> for both databases (pgjdbc and Microsoft mssql-jdbc drivers).',
        'node-postgres: <code>$1, $2</code>. Node <code>mssql</code> (tedious): named <code>@email</code>.',
        'Placeholders work for values only, not table or column names; whitelist those.',
        'SQL Server: give the right type (VarChar vs NVarChar) or indexes may be skipped.',
      ],
      detail: `<pre><code>// PostgreSQL (node-postgres)
const { rows } = await pool.query(
  'SELECT id, name FROM users WHERE email = $1', [email]);

// SQL Server (mssql)
const result = await pool.request()
  .input('email', sql.VarChar(200), email)
  .query('SELECT id, name FROM users WHERE email = @email');

// Java JDBC (both)
PreparedStatement ps = conn.prepareStatement(
  "SELECT id, name FROM users WHERE email = ?");
ps.setString(1, email);</code></pre>`,
    },
    {
      title: 'Connection Pools',
      level: 'intermediate',
      summary:
        'Keep a set of open connections and lend them out, instead of opening a new one per request.',
      simple:
        'Like a bike-share station: you take a bike, ride, and return it. Much faster than building a new bike every trip.',
      points: [
        'Java: HikariCP (Spring Boot default). Node: <code>pg.Pool</code>, <code>mssql</code> ConnectionPool.',
        'Bigger isn’t better: a small pool (often 10–30) usually beats hundreds.',
        'PostgreSQL uses one process per connection, so many apps put PgBouncer in front.',
        'SQL Server uses threads and copes with more connections, but pools still matter.',
        'Always return the connection (try-with-resources / <code>finally</code>), or the pool runs dry.',
      ],
    },
    {
      title: 'N+1 Query Problem',
      level: 'intermediate',
      summary:
        'One query to load a list, then one more query per item: N+1 round trips instead of 1 or 2.',
      simple:
        'Going to the shop once for the list, then making a separate trip for every item on it.',
      points: [
        'Very common with ORMs and lazy loading. Fix: a JOIN, or one query for all children.',
        'PostgreSQL: pass an array, <code>WHERE order_id = ANY($1)</code>.',
        'SQL Server: a table-valued parameter, or <code>IN (SELECT value FROM OPENJSON(@ids))</code>.',
        'JPA: <code>JOIN FETCH</code> or entity graphs; spot N+1 by counting queries per request.',
      ],
      detail: `<pre><code>// N+1: 1 query for orders, then 1 per order (node-postgres)
const orders = await db.query('SELECT * FROM orders LIMIT 50');
for (const o of orders.rows) {
  o.items = (await db.query(
    'SELECT * FROM order_items WHERE order_id = $1', [o.id])).rows;
}

// Better: 2 queries total
const ids = orders.rows.map((o) =&gt; o.id);
const items = await db.query(
  'SELECT * FROM order_items WHERE order_id = ANY($1)', [ids]);</code></pre>`,
    },
    {
      title: 'Keyset Pagination',
      level: 'advanced',
      summary:
        'Page with "rows after the last one I saw" instead of OFFSET, so every page is equally fast.',
      points: [
        'OFFSET 100000 reads and throws away 100,000 rows.',
        'Keyset: remember the last row’s sort key and continue after it.',
        'PostgreSQL supports row comparisons <code>(a, b) &lt; (x, y)</code>; SQL Server needs the expanded OR form.',
        'Downside: no jumping straight to page 57; fine for infinite scroll and APIs.',
      ],
      detail: `<pre><code>-- PostgreSQL
SELECT id, title, created_at FROM posts
WHERE (created_at, id) &lt; ($1, $2)
ORDER BY created_at DESC, id DESC LIMIT 20;

-- SQL Server
SELECT TOP (20) id, title, created_at FROM posts
WHERE created_at &lt; @d OR (created_at = @d AND id &lt; @id)
ORDER BY created_at DESC, id DESC;</code></pre>`,
    },
    {
      title: 'JDBC, JPA & ORMs',
      level: 'intermediate',
      summary:
        'Libraries that run SQL for you, from thin (JDBC, query builders) to full object mappers (JPA/Hibernate, Prisma).',
      simple:
        'JDBC is driving a manual car. An ORM is an automatic: easier, but you should still know what the engine is doing.',
      points: [
        'JDBC: raw SQL from Java; Spring’s <code>JdbcTemplate</code> removes boilerplate.',
        'JPA/Hibernate: map tables to classes; great for CRUD, watch for N+1 and huge joins.',
        'Node: Prisma, Drizzle, TypeORM, Knex all support both databases.',
        'Log the generated SQL and check its plan for hot paths.',
      ],
    },
    {
      title: 'Replication & HA',
      level: 'advanced',
      summary: 'Copy data from a primary to replicas for high availability and read scaling.',
      points: [
        'PostgreSQL: streaming replication (physical) and logical replication; failover via Patroni or managed services.',
        'SQL Server: Always On Availability Groups (readable secondaries), log shipping, failover cluster instances.',
        'Async replicas lag: a user may not see their own write right away.',
        'Send heavy reports to a replica to protect the primary.',
      ],
    },
    {
      title: 'Partitioning',
      level: 'advanced',
      summary:
        'Split one big table into smaller pieces (by date, by region) inside the same database.',
      points: [
        'PostgreSQL 10+: declarative <code>PARTITION BY RANGE / LIST / HASH</code>, each partition is a table.',
        'SQL Server: a partition function + partition scheme on one table.',
        'Queries filtering on the partition key skip other partitions (partition elimination / pruning).',
        'Dropping or switching out an old partition is far faster than DELETE-ing millions of rows.',
      ],
    },
    {
      title: 'Sharding',
      level: 'expert',
      summary:
        'Spread data across several database servers by a shard key, so each server holds a slice.',
      points: [
        'Scales writes and storage beyond one machine.',
        'Pick a key that spreads load evenly and keeps related data together (e.g. tenant_id).',
        'Cross-shard joins and transactions become hard or impossible.',
        'PostgreSQL: Citus extension, or PG-compatible distributed databases (CockroachDB, YugabyteDB).',
        'SQL Server: no built-in sharding; usually app-level, or Azure SQL Hyperscale to scale up instead.',
      ],
    },
  ],
};
