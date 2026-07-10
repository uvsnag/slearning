// Interview data: sql, optimize-sql
// Auto-generated from pv.html
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
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
<pre>SELECT   department, AVG(salary) AS avg_sal     -- 5. project + alias
FROM     employees e                            -- 1. build dataset
JOIN     departments d ON d.id = e.dept_id      -- 1. (joins happen in FROM)
WHERE    e.status = 'active'                    -- 2. filter rows
GROUP BY department                             -- 3. aggregate
HAVING   AVG(salary) > 5000                     -- 4. filter groups
ORDER BY avg_sal DESC                           -- 7. sort (alias OK here!)
LIMIT    10;                                    -- 8. cut

-- WHERE avg_sal > 5000        ❌ alias not computed yet at step 2
-- HAVING AVG(salary) > 5000   ✅ aggregates exist at step 4</pre>
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
<pre>-- Non-repeatable read demo (READ COMMITTED):
-- Session A                              -- Session B
BEGIN;
SELECT balance FROM acc WHERE id=1;  -- 100
                                          UPDATE acc SET balance=50 WHERE id=1;
                                          COMMIT;
SELECT balance FROM acc WHERE id=1;  -- 50  (same TX, different value!)
COMMIT;

-- Fix: SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
-- → the second SELECT still sees 100 (snapshot from TX start)</pre>
<div class="key-point">Default: PostgreSQL = Read Committed, MySQL InnoDB = Repeatable Read. Higher isolation = fewer anomalies but more locking/aborts — choose per use case, not globally.</div>`,
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
<pre>-- Unnormalized: everything in one row
orders(id, customer_name, customer_email, product_names, total)
  1, 'An', 'an@x.com', 'Mouse, Keyboard', 45        -- ❌ list in one cell (violates 1NF)

-- 1NF: atomic values → one row per order line
order_lines(order_id, product_name, product_price, customer_name, customer_email)

-- 2NF/3NF: remove partial + transitive dependencies → separate entities
customers(id, name, email)                 -- customer facts live once
products(id, name, price)                  -- product facts live once
orders(id, customer_id, created_at)
order_lines(order_id, product_id, qty)     -- pure relationships

-- Result: updating a customer's email = 1 row, no anomalies</pre>
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
<pre>-- Clustered (the table IS the index, sorted by key):
B-tree on id → leaf = the full row      [1|An|an@x.com] [2|Bo|bo@x.com] ...

-- Non-clustered (separate structure, points back to the row):
B-tree on email → leaf = email + row locator
  'an@x.com' → (page 12, slot 3)   -- extra hop ("key lookup") to fetch the row

SELECT * FROM users WHERE email = 'an@x.com';
-- seek non-clustered index (fast) + 1 lookup to the clustered data (extra I/O)
-- range scan on id (clustered) reads rows already in order — no lookups</pre>
<div class="key-point">When a query is covered entirely by a non-clustered index (covering index), it avoids the extra lookup to the data pages → much faster.</div>`,
      },
      {
        q: 'Explain stored procedures vs functions. When to use each?',
        difficulty: 'medium',
        a: `<ul>
<li><strong>Stored Procedure</strong>: can perform DML (INSERT, UPDATE, DELETE), return multiple result sets, use transactions, output parameters.</li>
<li><strong>Function</strong>: must return a value, can be used in SELECT/WHERE, no side effects (ideally), can be inlined by optimizer.</li>
</ul>
<pre>-- Function: pure calculation, usable inside queries
CREATE FUNCTION net_price(gross DECIMAL, vat DECIMAL) RETURNS DECIMAL
AS $$ SELECT gross / (1 + vat) $$ LANGUAGE SQL IMMUTABLE;

SELECT name, net_price(price, 0.1) FROM products;   -- ✅ in SELECT

-- Procedure: multi-step business logic with side effects + transaction control
CREATE PROCEDURE transfer(from_id INT, to_id INT, amount DECIMAL)
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE accounts SET balance = balance - amount WHERE id = from_id;
  UPDATE accounts SET balance = balance + amount WHERE id = to_id;
  INSERT INTO transfer_log VALUES (from_id, to_id, amount, now());
END $$;

CALL transfer(1, 2, 100.00);</pre>
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
      {
        q: 'How does SQL handle NULL? Why does NOT IN with a NULL return no rows?',
        difficulty: 'tricky',
        a: `<p>SQL uses <strong>three-valued logic</strong>: TRUE, FALSE, <strong>UNKNOWN</strong>. Any comparison with NULL is UNKNOWN — and WHERE only keeps rows that are TRUE.</p>
<pre>SELECT NULL = NULL;      -- UNKNOWN (not TRUE!)
SELECT NULL <> 5;        -- UNKNOWN
WHERE col = NULL         -- ❌ never matches → use col IS NULL

-- The classic NOT IN trap:
SELECT * FROM orders
WHERE customer_id NOT IN (SELECT id FROM blacklist);   -- blacklist has a NULL id
-- expands to: customer_id <> 1 AND customer_id <> 2 AND customer_id <> NULL
--                                                        └── UNKNOWN → whole predicate UNKNOWN
-- → returns ZERO rows, silently!

-- Fixes:
WHERE customer_id NOT IN (SELECT id FROM blacklist WHERE id IS NOT NULL);
-- or (NULL-safe and often faster):
WHERE NOT EXISTS (SELECT 1 FROM blacklist b WHERE b.id = o.customer_id);</pre>
<ul>
<li><strong>Aggregates ignore NULL</strong>: <code>AVG(col)</code> averages only non-null values; <code>COUNT(col)</code> ≠ <code>COUNT(*)</code>.</li>
<li><strong>Helpers</strong>: <code>COALESCE(a, b, 0)</code> first non-null; <code>NULLIF(a, b)</code> NULL if equal (divide-by-zero guard).</li>
<li><strong>NULL-safe compare</strong>: PostgreSQL <code>IS DISTINCT FROM</code>, MySQL <code>&lt;=&gt;</code>.</li>
<li><strong>Sorting</strong>: NULLs sort last/first depending on DB — be explicit: <code>ORDER BY col NULLS LAST</code>.</li>
</ul>
<div class="key-point">"NOT IN + NULL returns nothing" is a favorite senior screening question — answer it with three-valued logic and offer NOT EXISTS as the fix.</div>`,
      },
      {
        q: 'Explain LAG/LEAD and window frames (running totals, moving averages).',
        difficulty: 'hard',
        a: `<p>Beyond ranking, window functions compare rows to neighbors and aggregate over a sliding <strong>frame</strong> — without collapsing rows.</p>
<pre>-- LAG/LEAD: look at the previous / next row
SELECT month, revenue,
  LAG(revenue)  OVER (ORDER BY month)              AS prev_month,
  revenue - LAG(revenue) OVER (ORDER BY month)     AS mom_change,
  LEAD(revenue) OVER (ORDER BY month)              AS next_month
FROM monthly_sales;

-- Running total + moving average (frame clauses):
SELECT day, amount,
  SUM(amount) OVER (ORDER BY day
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_total,
  AVG(amount) OVER (ORDER BY day
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)         AS ma_7d
FROM daily_sales;

-- Share of group without GROUP BY:
SELECT name, department, salary,
  salary / SUM(salary) OVER (PARTITION BY department) AS dept_share
FROM employees;</pre>
<ul>
<li><strong>Frame default gotcha</strong>: with ORDER BY, the default frame is <code>RANGE ... CURRENT ROW</code> — ties are included together; use <code>ROWS</code> for strict row-by-row totals.</li>
<li><strong>FIRST_VALUE / LAST_VALUE</strong>: LAST_VALUE needs an explicit frame (<code>ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING</code>) or it returns the current row — classic trap.</li>
</ul>
<div class="key-point">LAG for month-over-month deltas and SUM OVER for running totals replace ugly self-joins — mentioning that trade-off is exactly what interviewers want to hear.</div>`,
      },
      {
        q: 'Write SQL: Find users who logged in 3 or more consecutive days (gaps and islands).',
        difficulty: 'tricky',
        a: `<p>The <strong>gaps-and-islands</strong> trick: <code>date - ROW_NUMBER()</code> is constant within a consecutive run, so it becomes a group key.</p>
<pre>WITH days AS (                       -- dedupe multiple logins per day
  SELECT DISTINCT user_id, login_date
  FROM logins
),
grp AS (
  SELECT user_id, login_date,
    login_date - ROW_NUMBER() OVER (
      PARTITION BY user_id ORDER BY login_date
    ) * INTERVAL '1 day' AS island   -- constant per consecutive streak
  FROM days
)
SELECT user_id,
       MIN(login_date) AS streak_start,
       MAX(login_date) AS streak_end,
       COUNT(*)        AS streak_len
FROM grp
GROUP BY user_id, island
HAVING COUNT(*) >= 3;

-- Why it works:
-- date        row_number   date - rn
-- 2024-01-01  1            2023-12-31 ┐
-- 2024-01-02  2            2023-12-31 ├ same value → same island
-- 2024-01-03  3            2023-12-31 ┘
-- 2024-01-07  4            2024-01-03 ← gap → new island</pre>
<div class="key-point">This pattern also answers "longest winning streak", "consecutive absent days", "sessions from click events" — one technique, many interview questions.</div>`,
      },
      {
        q: 'What is MVCC (Multi-Version Concurrency Control)? Why do readers not block writers?',
        difficulty: 'hard',
        a: `<p><strong>MVCC</strong>: instead of locking rows for reads, the database keeps <strong>multiple versions</strong> of each row. Every transaction sees a consistent <strong>snapshot</strong> as of its start — readers never block writers and writers never block readers.</p>
<pre>-- UPDATE does not overwrite — it creates a new version:
row v1: (id=1, balance=100)  xmin=90, xmax=95   ← old TX sees this
row v2: (id=1, balance=50)   xmin=95            ← new TX sees this

-- Each transaction filters versions by its snapshot:
-- "visible if created before my snapshot AND not deleted before it"</pre>
<ul>
<li><strong>PostgreSQL</strong>: old versions live in the table itself → dead tuples must be cleaned by <strong>VACUUM</strong> (autovacuum). Long-running transactions block cleanup → table bloat.</li>
<li><strong>MySQL InnoDB / Oracle</strong>: old versions reconstructed from the <strong>undo log</strong>.</li>
<li>Write-write conflicts still lock: two UPDATEs on the same row → second waits, then (in REPEATABLE READ+) may abort with a serialization error.</li>
</ul>
<div class="key-point">Senior follow-ups to expect: "why does a long transaction cause bloat?" (VACUUM can't remove versions it might still need) and "why is COUNT(*) slow in PostgreSQL?" (must scan versions to check visibility).</div>`,
      },
      {
        q: 'Write SQL: Pivot rows to columns (conditional aggregation).',
        difficulty: 'medium',
        a: `<p><strong>Conditional aggregation</strong> — an aggregate over a CASE (or FILTER) turns row values into columns. Works in every database, no vendor PIVOT syntax needed.</p>
<pre>-- sales(product, quarter, amount) → one row per product, quarters as columns
SELECT product,
  SUM(CASE WHEN quarter = 'Q1' THEN amount ELSE 0 END) AS q1,
  SUM(CASE WHEN quarter = 'Q2' THEN amount ELSE 0 END) AS q2,
  SUM(CASE WHEN quarter = 'Q3' THEN amount ELSE 0 END) AS q3,
  SUM(CASE WHEN quarter = 'Q4' THEN amount ELSE 0 END) AS q4
FROM sales
GROUP BY product;

-- PostgreSQL FILTER syntax (cleaner, same plan):
SELECT product,
  SUM(amount) FILTER (WHERE quarter = 'Q1') AS q1,
  COUNT(*)    FILTER (WHERE amount > 1000)  AS big_sales
FROM sales
GROUP BY product;

-- Same trick for "count by status in one pass" (very common in real code):
SELECT
  COUNT(*) FILTER (WHERE status = 'active')   AS active,
  COUNT(*) FILTER (WHERE status = 'pending')  AS pending,
  COUNT(*) FILTER (WHERE status = 'deleted')  AS deleted
FROM users;   -- one scan instead of three queries</pre>
<div class="key-point">Interviewers use pivots to test whether you reach for one-pass conditional aggregation or naively run N separate queries / self-joins.</div>`,
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
</ul>
<pre>-- Typical slow query with 3 of these problems at once:
SELECT * FROM orders                          -- ❌ SELECT *
WHERE YEAR(created_at) = 2024                 -- ❌ function kills the index
  AND customer_ref = 12345;                   -- ❌ varchar col vs number → cast

-- Fixed:
SELECT id, status, total FROM orders          -- ✅ needed columns only
WHERE created_at >= '2024-01-01'
  AND created_at <  '2025-01-01'              -- ✅ index range scan
  AND customer_ref = '12345';                 -- ✅ matching type</pre>`,
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
<pre>-- Find tables doing lots of sequential scans (PostgreSQL):
SELECT relname, seq_scan, idx_scan
FROM pg_stat_user_tables ORDER BY seq_scan DESC;

-- Add the index without locking writes (production!):
CREATE INDEX CONCURRENTLY idx_orders_customer ON orders(customer_id);

-- Later: find indexes nobody uses (pure write overhead) and drop them
SELECT indexrelname, idx_scan
FROM pg_stat_user_indexes WHERE idx_scan = 0;</pre>
<div class="key-point">Every index costs: disk space + write overhead + maintenance. Only index what you query — and measure with pg_stat before and after.</div>`,
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
      {
        q: 'What is the difference between DELETE, TRUNCATE, and DROP?',
        difficulty: 'tricky',
        a: `<table><tr><th>Aspect</th><th>DELETE</th><th>TRUNCATE</th><th>DROP</th></tr>
<tr><td>What it does</td><td>Removes rows (with WHERE)</td><td>Removes ALL rows</td><td>Removes entire table</td></tr>
<tr><td>WHERE clause</td><td>✅ Yes</td><td>❌ No</td><td>❌ No</td></tr>
<tr><td>Rollback</td><td>✅ Can rollback</td><td>⚠️ Depends on DB</td><td>⚠️ Depends on DB</td></tr>
<tr><td>Triggers</td><td>✅ Fires triggers</td><td>❌ No triggers</td><td>❌ No triggers</td></tr>
<tr><td>Speed</td><td>Slow (row by row)</td><td>Fast (deallocates pages)</td><td>Fastest</td></tr>
<tr><td>Auto-increment</td><td>Keeps counter</td><td>Resets counter</td><td>Table gone</td></tr>
<tr><td>Logging</td><td>Full row logging</td><td>Minimal logging</td><td>Minimal</td></tr></table>
<pre>-- DELETE: removes specific rows, logs each row, can rollback
DELETE FROM orders WHERE status = 'cancelled';

-- TRUNCATE: removes ALL rows fast, resets identity
TRUNCATE TABLE temp_data;

-- DROP: removes table + schema + data permanently
DROP TABLE IF EXISTS temp_data;</pre>
<div class="key-point">Trick: In PostgreSQL, TRUNCATE IS transactional (can rollback). In MySQL, TRUNCATE cannot be rolled back. This is a common interview trick question — the answer depends on the database!</div>`,
      },
      {
        q: 'What is the difference between UNION and UNION ALL? When does UNION give wrong results?',
        difficulty: 'tricky',
        a: `<pre>-- UNION: combines results and REMOVES duplicates (slower — sorts/hashes)
SELECT name FROM employees
UNION
SELECT name FROM contractors;
-- If "John" exists in both → appears ONCE

-- UNION ALL: combines results and KEEPS duplicates (faster — no dedup)
SELECT name FROM employees
UNION ALL
SELECT name FROM contractors;
-- If "John" exists in both → appears TWICE

-- Trick question: When does UNION give WRONG results?
-- When you actually NEED duplicates!

-- Example: count total transactions
SELECT amount FROM checking_account
UNION
SELECT amount FROM savings_account;
-- If both accounts have a $100 transaction, UNION removes one!
-- Use UNION ALL to get the correct total

-- Performance: UNION ALL is always faster.
-- Only use UNION when you specifically need deduplication.</pre>
<div class="key-point">Default to <code>UNION ALL</code> unless you explicitly need deduplication. <code>UNION</code> performs an implicit <code>DISTINCT</code> which requires sorting — expensive on large datasets.</div>`,
      },
      {
        q: 'What makes a WHERE clause non-SARGable? How do you fix it?',
        difficulty: 'hard',
        a: `<p><strong>SARGable</strong> (Search ARGument able) = the predicate can use an index seek. Wrapping the <strong>column</strong> in a function or expression makes it non-SARGable — the DB must compute it for every row (full scan).</p>
<pre>-- ❌ Non-SARGable                          → ✅ SARGable rewrite
WHERE YEAR(created_at) = 2024               WHERE created_at >= '2024-01-01'
                                              AND created_at <  '2025-01-01'

WHERE UPPER(email) = 'AN@X.COM'             WHERE email = 'an@x.com'  -- store normalized
                                            -- or: functional index (see below)

WHERE salary * 12 > 60000                   WHERE salary > 60000 / 12

WHERE name LIKE '%son'                      -- leading wildcard: no B-tree seek
                                            -- → full-text / trigram (GIN) index

WHERE varchar_id = 12345                    WHERE varchar_id = '12345'  -- no implicit cast

-- When the function is genuinely needed → index the EXPRESSION:
CREATE INDEX idx_users_email_lower ON users (LOWER(email));
SELECT * FROM users WHERE LOWER(email) = 'an@x.com';   -- ✅ uses the index</pre>
<div class="key-point">Rule: keep the column bare on one side of the operator; move all computation to the constant side. If you can't, create a functional index matching the exact expression.</div>`,
      },
      {
        q: 'What are partial, functional, and other special index types? When do you use them?',
        difficulty: 'hard',
        a: `<ul>
<li><strong>Partial index</strong>: indexes only rows matching a condition — tiny index for a huge table when queries always target a subset.</li>
<li><strong>Functional (expression) index</strong>: indexes the result of an expression.</li>
<li><strong>Covering with INCLUDE</strong>: adds payload columns to the leaf level so the query never touches the table.</li>
<li><strong>GIN / full-text / trigram</strong>: for contains-style search (arrays, JSONB, <code>LIKE '%x%'</code>).</li>
<li><strong>Hash index</strong>: equality only, no ranges — rarely worth it over B-tree.</li>
</ul>
<pre>-- Partial: 99% of orders are 'done'; queries always look at active ones
CREATE INDEX idx_orders_active ON orders(customer_id)
  WHERE status IN ('new', 'processing');       -- 1% of the size!

-- Partial unique: "only one active session per user"
CREATE UNIQUE INDEX one_active_session ON sessions(user_id)
  WHERE ended_at IS NULL;

-- Functional: case-insensitive lookup
CREATE INDEX idx_email_lower ON users (LOWER(email));

-- Covering: index answers the whole query (Index Only Scan)
CREATE INDEX idx_orders_cust ON orders(customer_id) INCLUDE (status, total);

-- Trigram (PostgreSQL pg_trgm): makes '%phone%' searchable
CREATE INDEX idx_products_name ON products USING GIN (name gin_trgm_ops);</pre>
<div class="key-point">Partial indexes are the most underused optimization: smaller index = fits in memory = faster seeks AND cheaper writes. A partial unique index also encodes business rules the schema alone can't.</div>`,
      },
      {
        q: 'How do you optimize bulk INSERT / UPDATE / DELETE operations?',
        difficulty: 'hard',
        a: `<p><strong>Batching</strong>: the killer is per-row round trips and per-statement overhead — not the data volume itself.</p>
<pre>-- ❌ 10,000 round trips
INSERT INTO items VALUES (1, 'a');
INSERT INTO items VALUES (2, 'b');   -- ... × 10,000

-- ✅ Multi-row insert (one statement, one round trip per batch)
INSERT INTO items VALUES (1,'a'), (2,'b'), (3,'c'), ...;   -- batches of ~1000

-- ✅ Fastest bulk load: COPY (PostgreSQL) / LOAD DATA (MySQL)
COPY items FROM '/data/items.csv' WITH (FORMAT csv);

-- ✅ JDBC batching (Java) — also needs the driver flag to really batch:
-- jdbc:mysql://...?rewriteBatchedStatements=true
ps.addBatch();  ...  ps.executeBatch();   // every 1000 rows
-- JPA: spring.jpa.properties.hibernate.jdbc.batch_size=50

-- ✅ Chunked DELETE — one giant delete = long lock + huge WAL/undo:
DELETE FROM logs WHERE created_at < '2024-01-01' LIMIT 10000;  -- repeat until 0 rows
-- (PostgreSQL: DELETE ... WHERE id IN (SELECT id ... LIMIT 10000))

-- ✅ UPDATE from a staging table instead of 10k single updates:
UPDATE products p SET price = s.price
FROM   staging_prices s WHERE s.product_id = p.id;</pre>
<ul>
<li>For massive one-time loads: drop/disable secondary indexes and constraints, load, rebuild.</li>
<li>Keep transactions bounded — a 10M-row transaction blocks VACUUM and replication.</li>
</ul>
<div class="key-point">Numbers interviewers like: row-by-row ≈ thousands/min; multi-row batches ≈ tens of thousands/sec; COPY ≈ hundreds of thousands/sec. Know why each step is faster (fewer round trips, less parsing, less WAL).</div>`,
      },
      {
        q: 'What is the difference between a view and a materialized view? When do you use each?',
        difficulty: 'medium',
        a: `<ul>
<li><strong>View</strong>: a saved query — no data stored. Every SELECT re-runs the underlying query. Always fresh, costs full query time.</li>
<li><strong>Materialized view</strong>: the query result is <strong>physically stored</strong> (and can be indexed!). Reads are instant; data is stale until refreshed.</li>
</ul>
<pre>-- View: abstraction / security layer (hide columns, fix joins)
CREATE VIEW active_users AS
  SELECT id, name, email FROM users WHERE status = 'active';

-- Materialized view: precomputed aggregation for dashboards/reports
CREATE MATERIALIZED VIEW daily_revenue AS
  SELECT day, SUM(amount) AS revenue, COUNT(*) AS orders
  FROM sales GROUP BY day;

CREATE INDEX idx_daily_revenue_day ON daily_revenue(day);  -- ✅ indexable

-- Refresh strategies:
REFRESH MATERIALIZED VIEW daily_revenue;                -- locks reads
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_revenue;   -- no read lock
--   (needs a unique index; run from cron / after ETL)</pre>
<table><tr><th></th><th>View</th><th>Materialized view</th></tr>
<tr><td>Storage</td><td>None</td><td>Full result stored</td></tr>
<tr><td>Freshness</td><td>Always current</td><td>Stale until REFRESH</td></tr>
<tr><td>Read cost</td><td>Underlying query each time</td><td>Like reading a table</td></tr>
<tr><td>Use case</td><td>Abstraction, security</td><td>Expensive aggregations, dashboards</td></tr></table>
<div class="key-point">Materialized views trade freshness for read speed — the same trade-off as a cache, but inside the database and queryable with SQL. Say that sentence in an interview.</div>`,
      },
    ],
  },

  // ───────────────────────── 8. SPRING BOOT ─────────────────────────
];
