// Interview data: sql, optimize-sql
// Auto-generated from pv.html
(function () {
  (window.__pvTopics = window.__pvTopics || []).push(
  {
          id: 'sql',
          name: 'SQL',
          icon: '🗄️',
          questions: [
            {
              q: 'What are the types of SQL JOINs? Explain with examples.',
              difficulty: 'easy',
              a: `<ul>
<li><strong>INNER JOIN</strong>: rows matching in both tables.</li>
<li><strong>LEFT JOIN</strong>: all rows from left + matching right (NULL if no match).</li>
<li><strong>RIGHT JOIN</strong>: all rows from right + matching left.</li>
<li><strong>FULL OUTER JOIN</strong>: all rows from both tables.</li>
<li><strong>CROSS JOIN</strong>: Cartesian product (every row × every row).</li>
<li><strong>SELF JOIN</strong>: table joined with itself.</li>
</ul>
<pre>-- Find employees with their managers
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;</pre>`,
            },
            {
              q: 'What is the difference between WHERE and HAVING?',
              difficulty: 'easy',
              a: `<ul>
<li><strong>WHERE</strong>: filters rows <strong>before</strong> grouping. Cannot use aggregate functions.</li>
<li><strong>HAVING</strong>: filters groups <strong>after</strong> GROUP BY. Can use aggregate functions.</li>
</ul>
<pre>SELECT department, COUNT(*) AS cnt, AVG(salary) AS avg_sal
FROM employees
WHERE status = 'active'        -- filters rows first
GROUP BY department
HAVING COUNT(*) > 5            -- filters groups after
ORDER BY avg_sal DESC;</pre>`,
            },
            {
              q: 'Explain the SQL execution order.',
              difficulty: 'medium',
              a: `<p>Logical order (not written order):</p>
<ol>
<li><strong>FROM</strong> + JOINs (build dataset)</li>
<li><strong>WHERE</strong> (filter rows)</li>
<li><strong>GROUP BY</strong> (aggregate)</li>
<li><strong>HAVING</strong> (filter groups)</li>
<li><strong>SELECT</strong> (project columns)</li>
<li><strong>DISTINCT</strong></li>
<li><strong>ORDER BY</strong></li>
<li><strong>LIMIT / OFFSET</strong></li>
</ol>
<div class="key-point">This is why you can't use a column alias from SELECT in WHERE (it hasn't been computed yet), but you CAN use it in ORDER BY.</div>`,
            },
            {
              q: 'What are window functions? Explain ROW_NUMBER, RANK, DENSE_RANK.',
              difficulty: 'hard',
              a: `<p>Window functions perform calculations across a set of rows <strong>without collapsing</strong> them (unlike GROUP BY).</p>
<pre>SELECT name, department, salary,
  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rn,
  RANK()       OVER (PARTITION BY department ORDER BY salary DESC) AS rnk,
  DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS drnk
FROM employees;</pre>
<ul>
<li><strong>ROW_NUMBER</strong>: 1, 2, 3, 4 (always unique, even for ties).</li>
<li><strong>RANK</strong>: 1, 2, 2, 4 (gap after tie).</li>
<li><strong>DENSE_RANK</strong>: 1, 2, 2, 3 (no gap after tie).</li>
</ul>
<div class="key-point">Common pattern: "Top N per group" → use ROW_NUMBER + CTE/subquery WHERE rn <= N.</div>`,
            },
            {
              q: 'What is a CTE (Common Table Expression)? CTE vs Subquery vs Temp Table.',
              difficulty: 'medium',
              a: `<pre>-- CTE
WITH active_employees AS (
  SELECT * FROM employees WHERE status = 'active'
)
SELECT department, COUNT(*)
FROM active_employees
GROUP BY department;</pre>
<ul>
<li><strong>CTE</strong>: named query result, scoped to one statement. Improves readability. Can be recursive.</li>
<li><strong>Subquery</strong>: inline, can be used in SELECT, FROM, WHERE. Harder to reuse.</li>
<li><strong>Temp Table</strong>: physically stored, survives the statement. Good for complex multi-step queries. Has indexes.</li>
</ul>
<div class="key-point">CTE is NOT always materialized — the optimizer may inline it. For performance-critical paths, check the execution plan.</div>`,
            },
            {
              q: 'Explain ACID properties of transactions.',
              difficulty: 'medium',
              a: `<ul>
<li><strong>Atomicity</strong>: all-or-nothing. If any part fails, entire transaction is rolled back.</li>
<li><strong>Consistency</strong>: DB moves from one valid state to another. Constraints are respected.</li>
<li><strong>Isolation</strong>: concurrent transactions don't interfere with each other.</li>
<li><strong>Durability</strong>: once committed, data survives crashes (written to disk/WAL).</li>
</ul>
<pre>BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT; -- Atomic: both succeed or both fail</pre>`,
            },
            {
              q: 'What are isolation levels? Explain dirty read, non-repeatable read, phantom read.',
              difficulty: 'hard',
              a: `<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
<tr><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;">Level</th><th style="padding:6px;border-bottom:1px solid #ccc;">Dirty Read</th><th style="padding:6px;border-bottom:1px solid #ccc;">Non-Repeatable</th><th style="padding:6px;border-bottom:1px solid #ccc;">Phantom</th></tr>
<tr><td style="padding:6px;">Read Uncommitted</td><td style="padding:6px;">✅</td><td style="padding:6px;">✅</td><td style="padding:6px;">✅</td></tr>
<tr><td style="padding:6px;">Read Committed</td><td style="padding:6px;">❌</td><td style="padding:6px;">✅</td><td style="padding:6px;">✅</td></tr>
<tr><td style="padding:6px;">Repeatable Read</td><td style="padding:6px;">❌</td><td style="padding:6px;">❌</td><td style="padding:6px;">✅</td></tr>
<tr><td style="padding:6px;">Serializable</td><td style="padding:6px;">❌</td><td style="padding:6px;">❌</td><td style="padding:6px;">❌</td></tr>
</table>
<ul>
<li><strong>Dirty read</strong>: reading uncommitted data from another TX.</li>
<li><strong>Non-repeatable read</strong>: reading same row twice gives different results.</li>
<li><strong>Phantom read</strong>: new rows appear when re-executing a range query.</li>
</ul>
<div class="key-point">Default: PostgreSQL = Read Committed, MySQL InnoDB = Repeatable Read.</div>`,
            },
            {
              q: 'What is normalization? Explain 1NF, 2NF, 3NF, BCNF.',
              difficulty: 'medium',
              a: `<ul>
<li><strong>1NF</strong>: atomic values, no repeating groups, primary key exists.</li>
<li><strong>2NF</strong>: 1NF + no partial dependency (all non-key columns depend on the FULL primary key).</li>
<li><strong>3NF</strong>: 2NF + no transitive dependency (non-key column doesn't depend on another non-key column).</li>
<li><strong>BCNF</strong>: every determinant is a candidate key.</li>
</ul>
<div class="key-point">In practice: normalize to 3NF, then selectively denormalize for read performance (reporting tables, caching).</div>`,
            },
            {
              q: 'What is a deadlock? How to prevent it?',
              difficulty: 'hard',
              a: `<p>A <strong>deadlock</strong> occurs when two transactions wait for each other's locks, creating a cycle.</p>
<pre>-- TX1: UPDATE accounts SET ... WHERE id = 1; (locks row 1)
--       UPDATE accounts SET ... WHERE id = 2; (waits for TX2)
-- TX2: UPDATE accounts SET ... WHERE id = 2; (locks row 2)
--       UPDATE accounts SET ... WHERE id = 1; (waits for TX1) → DEADLOCK!</pre>
<p><strong>Prevention</strong>:</p>
<ul>
<li>Always lock resources in the <strong>same order</strong>.</li>
<li>Keep transactions <strong>short</strong>.</li>
<li>Use <strong>SELECT ... FOR UPDATE NOWAIT</strong> to fail fast.</li>
<li>Use appropriate isolation levels.</li>
</ul>`,
            },
            {
              q: 'What is the difference between clustered and non-clustered indexes?',
              difficulty: 'medium',
              a: `<ul>
<li><strong>Clustered index</strong>: determines physical order of rows. <strong>Only one per table</strong>. Usually the primary key. Leaf nodes = actual data rows.</li>
<li><strong>Non-clustered index</strong>: separate structure pointing to data rows. Multiple per table. Leaf nodes = pointers (row locators).</li>
</ul>
<div class="key-point">When a query is covered entirely by a non-clustered index (covering index), it avoids the extra lookup to the data pages → much faster.</div>`,
            },
            {
              q: 'Explain stored procedures vs functions. When to use each?',
              difficulty: 'medium',
              a: `<ul>
<li><strong>Stored Procedure</strong>: can perform DML (INSERT, UPDATE, DELETE), return multiple result sets, use transactions, output parameters.</li>
<li><strong>Function</strong>: must return a value, can be used in SELECT/WHERE, no side effects (ideally), can be inlined by optimizer.</li>
</ul>
<div class="key-point">Use procedures for business logic with side effects. Use functions for calculations that need to be called from queries.</div>`,
            },
            {
              q: 'Write SQL: Find the Nth highest salary.',
              difficulty: 'tricky',
              a: `<pre>-- Method 1: DENSE_RANK
SELECT salary FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM employees
) ranked
WHERE rnk = 3; -- 3rd highest

-- Method 2: OFFSET
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 2; -- 0-indexed

-- Method 3: Correlated subquery
SELECT DISTINCT salary
FROM employees e1
WHERE 3 = (
  SELECT COUNT(DISTINCT salary)
  FROM employees e2
  WHERE e2.salary >= e1.salary
);</pre>`,
            },
            {
              q: 'Write SQL: Find duplicate records in a table.',
              difficulty: 'medium',
              a: `<pre>-- Find duplicates
SELECT email, COUNT(*) AS cnt
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Delete duplicates (keep lowest ID)
DELETE FROM users
WHERE id NOT IN (
  SELECT MIN(id) FROM users GROUP BY email
);

-- Using CTE + ROW_NUMBER (safer)
WITH cte AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
  FROM users
)
DELETE FROM users WHERE id IN (SELECT id FROM cte WHERE rn > 1);</pre>`,
            },
            {
              q: 'What is the difference between UNION and UNION ALL?',
              difficulty: 'easy',
              a: `<ul>
<li><strong>UNION</strong>: combines results and removes duplicates (performs DISTINCT). Slower.</li>
<li><strong>UNION ALL</strong>: combines results and keeps all rows including duplicates. Faster.</li>
</ul>
<div class="key-point">Always prefer <code>UNION ALL</code> unless you specifically need deduplication. The DISTINCT operation requires sorting/hashing which is expensive.</div>`,
            },
            {
              q: 'Explain recursive CTEs. Give an example.',
              difficulty: 'hard',
              a: `<p>Recursive CTEs define a base case and a recursive step. Used for hierarchical/tree data.</p>
<pre>-- Organization hierarchy
WITH RECURSIVE org_tree AS (
  -- Base case: top-level managers
  SELECT id, name, manager_id, 1 AS level
  FROM employees WHERE manager_id IS NULL

  UNION ALL

  -- Recursive step: employees under current level
  SELECT e.id, e.name, e.manager_id, t.level + 1
  FROM employees e
  JOIN org_tree t ON e.manager_id = t.id
)
SELECT * FROM org_tree ORDER BY level, name;</pre>
<div class="key-point">Always include a termination condition or depth limit to prevent infinite recursion.</div>`,
            },
          ],
        },

        // ───────────────────────── 7. OPTIMIZE SQL ─────────────────────────,
  {
          id: 'optimize-sql',
          name: 'Optimize SQL',
          icon: '⚡',
          questions: [
            {
              q: 'How to read and interpret an EXPLAIN / Execution Plan?',
              difficulty: 'hard',
              a: `<pre>EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42;</pre>
<p>Key things to look for:</p>
<ul>
<li><strong>Seq Scan</strong>: full table scan → consider adding an index.</li>
<li><strong>Index Scan / Index Only Scan</strong>: good, using index.</li>
<li><strong>Nested Loop</strong>: fine for small result sets. Bad for large joins.</li>
<li><strong>Hash Join</strong>: good for large equi-joins.</li>
<li><strong>Sort</strong>: expensive if no index supports the ORDER BY.</li>
<li><strong>Actual rows vs estimated rows</strong>: large mismatch → stale statistics, run ANALYZE.</li>
<li><strong>Buffers</strong>: shared hit (cache) vs read (disk) → measure I/O impact.</li>
</ul>
<div class="key-point">Always use <code>EXPLAIN ANALYZE</code> (actually runs the query) for real timing, not just <code>EXPLAIN</code> (estimates only).</div>`,
            },
            {
              q: 'What are the most common causes of slow SQL queries?',
              difficulty: 'medium',
              a: `<ul>
<li><strong>Missing indexes</strong> on WHERE, JOIN, ORDER BY columns.</li>
<li><strong>SELECT *</strong> instead of specific columns → more I/O, no covering index.</li>
<li><strong>N+1 query problem</strong>: executing one query per row instead of a JOIN or batch.</li>
<li><strong>Functions on indexed columns</strong>: <code>WHERE YEAR(created_at) = 2024</code> → can't use index.</li>
<li><strong>Implicit type conversion</strong>: <code>WHERE varchar_col = 123</code> → index bypass.</li>
<li><strong>Large OFFSET pagination</strong>: <code>OFFSET 1000000</code> still scans all skipped rows.</li>
<li><strong>Correlated subqueries</strong>: subquery runs once per row.</li>
<li><strong>Lock contention / blocking queries</strong>.</li>
<li><strong>Stale statistics</strong>: optimizer makes bad decisions.</li>
</ul>`,
            },
            {
              q: 'When should you create an index? When should you NOT?',
              difficulty: 'medium',
              a: `<p><strong>Create index when</strong>:</p>
<ul>
<li>Column is in WHERE, JOIN, ORDER BY frequently.</li>
<li>Column has high cardinality (many distinct values).</li>
<li>Table is large and queries return small % of rows.</li>
</ul>
<p><strong>Avoid index when</strong>:</p>
<ul>
<li>Table is small (full scan is faster).</li>
<li>Column has low cardinality (e.g., boolean, gender).</li>
<li>Table has heavy INSERT/UPDATE/DELETE (indexes slow writes).</li>
<li>Column is rarely queried.</li>
</ul>
<div class="key-point">Every index costs: disk space + write overhead + maintenance. Only index what you query.</div>`,
            },
            {
              q: 'What are composite indexes? How does column order matter?',
              difficulty: 'hard',
              a: `<p>A composite index covers <strong>multiple columns</strong>. Column order follows the <strong>leftmost prefix rule</strong>.</p>
<pre>CREATE INDEX idx_dept_status_salary ON employees(department, status, salary);</pre>
<p>This index supports:</p>
<ul>
<li><code>WHERE department = 'IT'</code> ✅</li>
<li><code>WHERE department = 'IT' AND status = 'active'</code> ✅</li>
<li><code>WHERE department = 'IT' AND status = 'active' AND salary > 50000</code> ✅</li>
<li><code>WHERE status = 'active'</code> ❌ (skips leftmost column)</li>
<li><code>WHERE department = 'IT' AND salary > 50000</code> ⚠️ (uses department only)</li>
</ul>
<div class="key-point">Rule: put <strong>equality conditions first</strong>, then <strong>range conditions last</strong> in composite index order.</div>`,
            },
            {
              q: 'What is a covering index and index-only scan?',
              difficulty: 'hard',
              a: `<p>A <strong>covering index</strong> includes ALL columns needed by the query → no need to access the table (heap).</p>
<pre>-- Query
SELECT name, email FROM users WHERE status = 'active' ORDER BY name;

-- Covering index
CREATE INDEX idx_covering ON users(status, name, email);</pre>
<p>Execution plan shows <strong>Index Only Scan</strong> → fastest possible. No random I/O to heap.</p>
<div class="key-point">In PostgreSQL: use <code>INCLUDE</code> for non-searchable columns: <code>CREATE INDEX idx ON users(status) INCLUDE (name, email);</code></div>`,
            },
            {
              q: 'How to optimize pagination for large datasets?',
              difficulty: 'hard',
              a: `<p><strong>Problem</strong>: <code>OFFSET 1000000 LIMIT 10</code> scans 1,000,010 rows.</p>
<p><strong>Solutions</strong>:</p>
<pre>-- 1. Keyset pagination (cursor-based) ← BEST
SELECT * FROM orders
WHERE id > :last_seen_id   -- indexed!
ORDER BY id
LIMIT 10;

-- 2. Deferred join
SELECT o.* FROM orders o
JOIN (
  SELECT id FROM orders ORDER BY id LIMIT 10 OFFSET 1000000
) sub ON o.id = sub.id;

-- 3. Remember total count separately (avoid COUNT(*))</pre>
<div class="key-point">Keyset pagination is O(1) regardless of page number. OFFSET pagination is O(n). Always prefer keyset for APIs.</div>`,
            },
            {
              q: 'Explain the N+1 query problem and how to solve it.',
              difficulty: 'medium',
              a: `<p><strong>Problem</strong>: 1 query to fetch parents + N queries to fetch each parent's children.</p>
<pre>-- N+1 Problem:
SELECT * FROM orders;                    -- 1 query
SELECT * FROM items WHERE order_id = ?;  -- N queries (one per order!)

-- Solution 1: JOIN
SELECT o.*, i.*
FROM orders o
LEFT JOIN items i ON o.id = i.order_id;

-- Solution 2: Batch IN query
SELECT * FROM items WHERE order_id IN (1, 2, 3, ...);

-- Solution 3: ORM eager loading
// JPA: @EntityGraph or JOIN FETCH
// Hibernate: FetchType.EAGER or Hibernate.initialize()</pre>`,
            },
            {
              q: 'How to optimize JOINs for better performance?',
              difficulty: 'hard',
              a: `<ul>
<li><strong>Index JOIN columns</strong>: both sides of the join condition should be indexed.</li>
<li><strong>Use appropriate JOIN type</strong>: INNER JOIN is faster than LEFT JOIN (fewer rows).</li>
<li><strong>Filter early</strong>: apply WHERE conditions before joining large tables.</li>
<li><strong>Avoid joining on functions</strong>: <code>ON UPPER(a.name) = UPPER(b.name)</code> → can't use index. Use computed columns or functional indexes.</li>
<li><strong>Reduce dataset size</strong>: use CTEs or subqueries to pre-filter.</li>
</ul>
<pre>-- Bad: joins full tables then filters
SELECT * FROM orders o JOIN items i ON o.id = i.order_id
WHERE o.date > '2024-01-01';

-- Better: filter first
WITH recent_orders AS (
  SELECT id FROM orders WHERE date > '2024-01-01'
)
SELECT o.*, i.* FROM recent_orders ro
JOIN orders o ON o.id = ro.id
JOIN items i ON o.id = i.order_id;</pre>`,
            },
            {
              q: 'What is query plan caching? How do parameterized queries help?',
              difficulty: 'hard',
              a: `<ul>
<li><strong>Prepared statements / parameterized queries</strong>: DB compiles the plan once and reuses it for different parameter values.</li>
<li>Prevents <strong>SQL injection</strong> (security benefit).</li>
<li>Reduces <strong>hard parsing</strong> (plan compilation is expensive).</li>
</ul>
<pre>-- Bad: new plan for each query
"SELECT * FROM users WHERE id = " + userId  // SQL injection risk!

-- Good: plan cached and reused
PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE id = ?");
ps.setInt(1, userId);</pre>
<div class="key-point">In PostgreSQL: use <code>pg_stat_statements</code> to find frequently executed queries and optimize them.</div>`,
            },
            {
              q: 'What is table partitioning? When to use it?',
              difficulty: 'hard',
              a: `<p>Partitioning splits a large table into smaller physical pieces while keeping it logically one table.</p>
<ul>
<li><strong>Range partitioning</strong>: by date range (most common). E.g., monthly partitions.</li>
<li><strong>List partitioning</strong>: by discrete values (country, status).</li>
<li><strong>Hash partitioning</strong>: distribute evenly by hash.</li>
</ul>
<pre>-- PostgreSQL range partitioning
CREATE TABLE orders (
  id SERIAL, created_at DATE, amount DECIMAL
) PARTITION BY RANGE (created_at);

CREATE TABLE orders_2024_q1 PARTITION OF orders
  FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');</pre>
<p><strong>Benefits</strong>: partition pruning (skip irrelevant partitions), faster deletes (drop partition), parallel scans.</p>
<div class="key-point">Only partition tables with 10M+ rows where queries naturally filter on the partition key.</div>`,
            },
            {
              q: 'How to optimize COUNT(*) on large tables?',
              difficulty: 'hard',
              a: `<p><code>COUNT(*)</code> on large tables is inherently slow (must scan all rows in MVCC databases like PostgreSQL).</p>
<p><strong>Strategies</strong>:</p>
<ul>
<li><strong>Approximate count</strong>: <code>SELECT reltuples FROM pg_class WHERE relname = 'orders';</code></li>
<li><strong>Materialized view / cache</strong>: store count in a summary table, update via triggers or scheduled job.</li>
<li><strong>COUNT with covering index</strong>: <code>CREATE INDEX idx ON orders(status);</code> → <code>SELECT COUNT(*) FROM orders WHERE status = 'active';</code></li>
<li><strong>EXPLAIN hack</strong>: parse estimated rows from execution plan.</li>
<li><strong>Avoid COUNT in pagination</strong>: use "has next page" pattern instead of total count.</li>
</ul>`,
            },
            {
              q: 'What are the differences between EXIST vs IN vs JOIN for subqueries?',
              difficulty: 'tricky',
              a: `<pre>-- EXISTS: stops at first match (short-circuit). Best when subquery returns MANY rows.
SELECT * FROM orders o
WHERE EXISTS (SELECT 1 FROM items i WHERE i.order_id = o.id);

-- IN: builds a hash/list. Good for small subquery results.
SELECT * FROM orders
WHERE customer_id IN (SELECT id FROM customers WHERE vip = true);

-- JOIN: can return duplicates if 1-to-many. Use DISTINCT or aggregate.
SELECT DISTINCT o.*
FROM orders o
JOIN items i ON o.id = i.order_id;</pre>
<div class="key-point">Rule of thumb: EXISTS for "does it have related rows?", JOIN when you need data from both tables, IN for small value lists.</div>`,
            },
            {
              q: 'How to identify and fix slow queries in production?',
              difficulty: 'hard',
              a: `<p><strong>Identify</strong>:</p>
<ul>
<li><strong>Slow query log</strong>: MySQL <code>slow_query_log</code>, PostgreSQL <code>log_min_duration_statement</code>.</li>
<li><strong>pg_stat_statements</strong> (PostgreSQL): top queries by total time, calls, mean time.</li>
<li><strong>APM tools</strong>: New Relic, Datadog, Elastic APM – trace DB calls from application.</li>
<li><strong>EXPLAIN ANALYZE</strong>: check actual execution plan.</li>
</ul>
<p><strong>Fix</strong>:</p>
<ul>
<li>Add missing indexes (check <code>pg_stat_user_tables</code> for seq_scan counts).</li>
<li>Rewrite query (avoid correlated subqueries, optimize JOINs).</li>
<li>Update statistics: <code>ANALYZE table_name;</code></li>
<li>Consider read replicas for heavy read workloads.</li>
<li>Connection pooling (PgBouncer, HikariCP).</li>
</ul>`,
            },
            {
              q: 'What is database connection pooling and why is it important?',
              difficulty: 'medium',
              a: `<p>Creating a DB connection is expensive (TCP handshake, authentication, memory allocation). A <strong>connection pool</strong> maintains a cache of reusable connections.</p>
<ul>
<li><strong>HikariCP</strong> (Java): fastest, default in Spring Boot. Typical pool size: CPU cores × 2 + disk spindles.</li>
<li><strong>PgBouncer</strong> (PostgreSQL): external pooler, supports transaction/session pooling.</li>
</ul>
<pre># HikariCP config
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000</pre>
<div class="key-point">Pool too small → connection wait timeouts. Pool too large → excessive memory and context switching. Formula: <code>connections = (core_count * 2) + effective_spindle_count</code>.</div>`,
            },
          ],
        },

        // ───────────────────────── 8. SPRING BOOT ─────────────────────────
  );
})();
