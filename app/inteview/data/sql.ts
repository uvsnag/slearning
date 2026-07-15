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
        a: `<div class="interview-answer"><p>I frame joins by which rows survive. <code>INNER</code> keeps only matched rows; <code>LEFT</code> keeps the whole left table and NULL-fills the right; <code>RIGHT</code> is just <code>LEFT</code> with the tables flipped, so I rarely write it; <code>FULL OUTER</code> keeps both sides. The real-world gotchas I flag: MySQL has no <code>FULL OUTER</code> so you emulate it with a <code>UNION</code>, and the classic trap is putting a right-table filter in <code>WHERE</code>, which silently demotes a <code>LEFT JOIN</code> to an <code>INNER JOIN</code>. <code>CROSS</code> is a Cartesian product for generating combinations, and a <code>SELF JOIN</code> is just a table aliased against itself, like employee-to-manager.</p></div>
<ul>
<li><strong>INNER JOIN</strong> — only rows with a match in <em>both</em> tables; non-matching rows on either side are dropped.</li>
<li><strong>LEFT (OUTER) JOIN</strong> — <em>all</em> rows from the left table + matching right rows; right columns are <code>NULL</code> where there's no match.</li>
<li><strong>RIGHT (OUTER) JOIN</strong> — the mirror image: all rows from the right table. (Rarely used — people flip the table order and write LEFT instead.)</li>
<li><strong>FULL OUTER JOIN</strong> — all rows from both sides, <code>NULL</code>s filling the gaps. (PostgreSQL/SQL Server; <strong>MySQL lacks it</strong> — emulate with <code>LEFT JOIN ... UNION ... RIGHT JOIN</code>.)</li>
<li><strong>CROSS JOIN</strong> — Cartesian product: every left row × every right row (no ON clause). Handy for generating combinations/calendars.</li>
<li><strong>SELF JOIN</strong> — a table joined to itself via aliases, e.g. employee → their manager in the same table.</li>
</ul>
<pre>-- customers(id,name)          orders(id, customer_id, total)
--  1 An  2 Bo  3 Chi          10→cust1  11→cust1  12→cust2   (Chi has none)

-- INNER JOIN: only customers who HAVE orders
SELECT c.name, o.total FROM customers c
JOIN orders o ON o.customer_id = c.id;
-- An/… , An/… , Bo/…            (Chi excluded)

-- LEFT JOIN: EVERY customer, orders where they exist
SELECT c.name, o.total FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id;
-- An/… , An/… , Bo/… , Chi/NULL  (Chi kept, total = NULL)

-- SELF JOIN: pair each employee with their manager
SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;   -- LEFT keeps the CEO (no manager)</pre>
<div class="key-point">Pick by intent: <strong>INNER</strong> when a row must exist on both sides; <strong>LEFT</strong> when the left table is the "master" list you must keep in full (customers with or without orders). Trap: putting a right-table filter in <code>WHERE</code> silently turns a LEFT JOIN into an INNER JOIN — right-side conditions belong in the <code>ON</code> clause (covered in its own question).</div>`,
      },
      {
        q: 'What is the difference between WHERE and HAVING?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p><code>WHERE</code> filters rows before grouping, <code>HAVING</code> filters groups after aggregation, so aggregates like <code>COUNT</code> and <code>SUM</code> are only legal in <code>HAVING</code>. The senior point is that this falls straight out of SQL's logical execution order: <code>WHERE</code> runs before <code>GROUP BY</code>, <code>HAVING</code> after. Performance-wise I push as much as possible into <code>WHERE</code> so I aggregate fewer rows, and reserve <code>HAVING</code> for genuinely aggregate conditions like <code>COUNT(*) &gt; 5</code>.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>The key insight is that SQL runs in a logical order that's nothing like how you write it: <code>FROM</code> and joins first, then <code>WHERE</code>, <code>GROUP BY</code>, <code>HAVING</code>, <code>SELECT</code>, <code>DISTINCT</code>, <code>ORDER BY</code>, and finally <code>LIMIT</code>. This explains the two things juniors always trip on: you can't reference a <code>SELECT</code> alias in <code>WHERE</code> because projection hasn't happened yet, but you can in <code>ORDER BY</code> because that runs last. It also explains why a big <code>OFFSET</code> is slow and why you can't filter a window function in <code>WHERE</code>.</p></div>
<p>Logical order (not written order):</p>
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
        a: `<div class="interview-answer"><p>Window functions compute across a set of rows without collapsing them, which is the whole difference from <code>GROUP BY</code>. The three ranking ones differ only in how they treat ties: <code>ROW_NUMBER</code> is always unique, <code>RANK</code> leaves gaps after a tie, <code>DENSE_RANK</code> doesn't. My shorthand is 1-2-2-4 for <code>RANK</code> versus 1-2-2-3 for <code>DENSE_RANK</code>. The bread-and-butter use is top-N-per-group: <code>ROW_NUMBER</code> with <code>PARTITION BY</code> in a CTE, then filter <code>rn &lt;= N</code>.</p></div>
<p>Window functions perform calculations across a set of rows <strong>without collapsing</strong> them (unlike GROUP BY).</p>
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
        a: `<div class="interview-answer"><p>All three name an intermediate result; I pick on reuse and materialization. A CTE is scoped to one statement and mostly about readability and recursion; a subquery is inline and awkward to reuse; a temp table is physically stored, can be indexed, and survives across statements for genuinely multi-step work. The gotcha I flag: a CTE is not guaranteed to be materialized — Postgres inlines it by default since v12 — so don't treat it as an optimization fence unless you check the plan or force <code>MATERIALIZED</code>.</p></div>
<pre>-- CTE
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
        a: `<div class="interview-answer"><p>The four levels are defined by which anomalies they permit — dirty read, non-repeatable read, then phantom read, in order of severity. Read Uncommitted allows all three; Read Committed stops dirty reads; Repeatable Read also stops non-repeatable reads; Serializable stops everything including phantoms. What I stress is that defaults matter more than theory: Postgres defaults to Read Committed, MySQL InnoDB to Repeatable Read. Higher isolation buys correctness at the cost of more locking and more serialization aborts your app must be ready to retry.</p></div>
<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
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
        a: `<div class="interview-answer"><p>Normalization is about eliminating redundancy so each fact lives in exactly one place, which kills update anomalies. I remember the ladder as: 1NF atomic values, 2NF no partial dependency on part of a composite key, 3NF no transitive dependency between non-key columns, BCNF every determinant is a candidate key. In practice I normalize to 3NF as the default, then selectively denormalize for read performance — reporting tables, caches — as a deliberate, measured trade-off rather than by accident.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>A deadlock is a cycle of lock waits — each transaction holds what the other needs. The thing juniors miss is that the database detects it automatically via a waits-for graph and kills a victim, so it's not a hang: your app gets an error code and must retry the whole transaction. The number-one prevention is consistent lock ordering — always acquire rows in the same order, like ascending by <code>id</code> — which makes a cycle impossible. So the complete answer pairs prevention (lock order, short transactions) with recovery (catch the error and retry).</p></div>
<p>A <strong>deadlock</strong> is a cycle of waiting: each transaction holds a lock the other needs, so neither can proceed.</p>
<pre>-- TX1                                    -- TX2
UPDATE accounts SET ... WHERE id = 1;    -- locks row 1
                                         UPDATE accounts SET ... WHERE id = 2;  -- locks row 2
UPDATE accounts SET ... WHERE id = 2;    -- waits for TX2  ┐
                                         UPDATE accounts SET ... WHERE id = 1;  -- waits for TX1
--                                                          └── cycle → DEADLOCK!</pre>
<p><strong>How the database handles it:</strong> unlike an application hang, the DB has a <strong>deadlock detector</strong> — it maintains a "waits-for" graph and, on finding a cycle, kills one transaction (the <strong>victim</strong>, usually the one cheapest to roll back). That transaction fails with an error (PostgreSQL <code>40P01</code>, MySQL <code>1213</code>) and must be <strong>retried by the application</strong>. So the first rule is: catch the deadlock error and retry the whole transaction.</p>
<p><strong>Prevention:</strong></p>
<ul>
<li><strong>Consistent lock ordering</strong> — the #1 fix. If every transaction acquires locks in the same order (e.g. always ascending by id), a cycle is impossible:
<pre>-- ✅ Both transactions touch ids in the SAME order → no cycle
UPDATE accounts SET ... WHERE id = LEAST(:a, :b);
UPDATE accounts SET ... WHERE id = GREATEST(:a, :b);</pre></li>
<li><strong>Keep transactions short</strong> — fewer locks held for less time = smaller collision window. Never do slow work (HTTP calls, user think-time) inside a transaction.</li>
<li><strong>Fail fast</strong> — <code>SELECT ... FOR UPDATE NOWAIT</code> (error immediately) or <code>SKIP LOCKED</code> (skip locked rows — ideal for job queues) instead of waiting indefinitely.</li>
<li><strong>Reduce lock scope</strong> — touch a single canonical row to serialize contenders, and prefer row-level over table-level locks.</li>
</ul>
<div class="key-point">Deadlock (a cycle, auto-resolved by the DB killing a victim) ≠ lock wait/timeout (one TX simply waits and eventually times out). The senior answer pairs a <strong>prevention</strong> strategy (consistent lock order, short TXs) with a <strong>recovery</strong> strategy (detect the deadlock error code and retry) — you need both.</div>`,
      },
      {
        q: 'What is the difference between clustered and non-clustered indexes?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A clustered index defines the physical order of rows — the leaf level <em>is</em> the data — so you get only one per table, usually the primary key. A non-clustered index is a separate structure whose leaves point back to the row, so you can have many. The performance consequence I focus on is the key lookup: a non-clustered seek costs an extra hop to fetch the row unless the index is covering, in which case it answers the query alone. Note InnoDB is always clustered on the PK, while SQL Server lets you choose.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>The line I draw is side effects and where it's callable. A function returns a value, ideally has no side effects, and can be used inside a <code>SELECT</code> or <code>WHERE</code> — even inlined by the optimizer. A procedure is for multi-step business logic: it can do DML, control transactions, and return multiple result sets, and you <code>CALL</code> it. So calculations that belong in queries are functions; transactional workflows like a money transfer are procedures. I'd add that pushing heavy logic into the database has a maintainability and portability cost worth weighing.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>My go-to is <code>DENSE_RANK</code> in a subquery filtered to rank N, because it states intent, treats ties as distinct values correctly, and generalizes to top-N-per-group with <code>PARTITION BY</code>. <code>LIMIT ... OFFSET N-1</code> over <code>DISTINCT</code> salaries is quickest to type; the correlated-subquery version works on ancient databases but is O(n squared), so it's only a fallback. The edge case interviewers fish for: with fewer than N distinct salaries, all correct versions return no rows. And clarify up front whether Nth means the Nth distinct value or the Nth person — that decides <code>DENSE_RANK</code> versus <code>ROW_NUMBER</code>.</p></div>
<p>"Nth highest" hinges on how you treat <strong>ties</strong>. All three methods below find the 3rd-highest <em>distinct</em> salary — the version interviewers usually want.</p>
<pre>-- Method 1: DENSE_RANK ← preferred (clear, standard, tie-correct)
SELECT salary FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM employees
) ranked
WHERE rnk = 3;              -- 3rd highest DISTINCT salary
-- DENSE_RANK gives ties the same rank with NO gaps, so "3rd distinct value" = rnk 3.
-- (Use RANK if you want gaps after ties; ROW_NUMBER if every row must be unique.)

-- Method 2: OFFSET ← simplest to write
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 2;          -- skip the top 2 distinct salaries, take the next (0-indexed)

-- Method 3: Correlated subquery ← works without window functions (older DBs)
SELECT DISTINCT salary
FROM employees e1
WHERE 3 = (SELECT COUNT(DISTINCT salary)
           FROM employees e2 WHERE e2.salary >= e1.salary);
-- "salary such that exactly 3 distinct salaries are >= it". O(n²) — avoid on big tables.</pre>
<ul>
<li><strong>Edge case</strong>: if fewer than N distinct salaries exist, all three correctly return <strong>no rows</strong> (interviewers love "what if N=10 but there are only 4 salaries?").</li>
<li><strong>Ties</strong>: keep <code>DISTINCT</code> / use <code>DENSE_RANK</code> to rank by <em>value</em>; drop <code>DISTINCT</code> and use <code>ROW_NUMBER</code> if you mean the Nth <em>row/person</em>.</li>
</ul>
<div class="key-point">Reach for <strong>DENSE_RANK</strong> in the interview: it states intent, handles ties correctly, and generalizes to "top-N per group" with <code>PARTITION BY</code>. The correlated subquery is the "no window functions available" fallback — mention its O(n²) cost.</div>`,
      },
      {
        q: 'Write SQL: Find duplicate records in a table.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Two distinct tasks: detect, then delete keeping one. Detect with <code>GROUP BY</code> the duplicate key and <code>HAVING COUNT(*) &gt; 1</code>. To delete, I reach for a CTE with <code>ROW_NUMBER</code> partitioned by the key and remove where <code>rn &gt; 1</code> — it's NULL-safe and lets me pick exactly which row survives via the <code>ORDER BY</code>, unlike the <code>NOT IN (MIN(id))</code> trick which blows up if any id is NULL. Then the real fix: add a <code>UNIQUE</code> constraint so the duplicates can't come back.</p></div>
<p>Two separate tasks: <strong>detecting</strong> duplicates, and <strong>deleting</strong> them while keeping one copy.</p>
<pre>-- 1. DETECT: group by the "duplicate key", keep groups with more than one row
SELECT email, COUNT(*) AS cnt
FROM users
GROUP BY email
HAVING COUNT(*) > 1;          -- HAVING filters groups (WHERE can't see COUNT)

-- 2. DELETE keeping the lowest id — simple, but has a NULL trap:
DELETE FROM users
WHERE id NOT IN (SELECT MIN(id) FROM users GROUP BY email);
-- ⚠️ if any id could be NULL, NOT IN returns nothing (three-valued logic — see the NULL question)

-- 3. DELETE with CTE + ROW_NUMBER ← safest and most flexible
WITH cte AS (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
  FROM users                  -- rn = 1 for the row to KEEP, 2,3… for duplicates
)
DELETE FROM users WHERE id IN (SELECT id FROM cte WHERE rn > 1);</pre>
<ul>
<li><strong>Why ROW_NUMBER is safest</strong>: no <code>NOT IN</code>/NULL pitfall, and the window's <code>ORDER BY</code> lets you choose exactly which row survives (lowest id, newest <code>updated_at</code>, etc.).</li>
<li><strong>Prevent recurrence</strong>: after cleanup, add a <code>UNIQUE</code> constraint on the key — <code>ALTER TABLE users ADD CONSTRAINT uq_email UNIQUE(email);</code> — so duplicates can't reappear.</li>
</ul>
<div class="key-point">Detect with <code>GROUP BY … HAVING COUNT(*) &gt; 1</code>; delete with <code>ROW_NUMBER() OVER (PARTITION BY key ORDER BY …)</code> and remove <code>rn &gt; 1</code>. Then enforce a UNIQUE index so the bug is fixed for good.</div>`,
      },
      {
        q: 'Explain recursive CTEs. Give an example.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A recursive CTE has an anchor member plus a recursive member joined back to the CTE, combined with <code>UNION ALL</code> — it's how you walk tree or graph data like org charts or bill-of-materials in pure SQL. The engine iterates until the recursive step produces no new rows. What I always guard against is runaway recursion on cyclic data, so I add a depth counter and cap it, or use a cycle-detection clause. It replaces application-side loop-and-query, which is a classic N+1.</p></div>
<p>Recursive CTEs define a base case and a recursive step. Used for hierarchical/tree data.</p>
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
        a: `<div class="interview-answer"><p>SQL uses three-valued logic — TRUE, FALSE, UNKNOWN — and any comparison with NULL yields UNKNOWN, which <code>WHERE</code> treats as not-true and drops. That's exactly why <code>NOT IN</code> against a subquery containing a NULL returns zero rows: it expands to a chain of AND-ed inequalities, one of which is UNKNOWN, poisoning the whole predicate. My default fix is <code>NOT EXISTS</code>, which is NULL-safe and usually planned as an efficient anti-join. I also remember aggregates skip NULLs, so <code>COUNT(col)</code> isn't <code>COUNT(*)</code>, and I use <code>COALESCE</code> and <code>IS DISTINCT FROM</code> to handle them explicitly.</p></div>
<p>SQL uses <strong>three-valued logic</strong>: TRUE, FALSE, <strong>UNKNOWN</strong>. Any comparison with NULL is UNKNOWN — and WHERE only keeps rows that are TRUE.</p>
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
        a: `<div class="interview-answer"><p>Beyond ranking, window functions let you compare a row to its neighbors with <code>LAG</code> and <code>LEAD</code> — think month-over-month deltas — and aggregate over a sliding frame for running totals and moving averages, all without collapsing rows. The gotcha I always call out is the default frame: with an <code>ORDER BY</code> it's <code>RANGE</code> unbounded-preceding to current-row, which lumps ties together, so I use <code>ROWS</code> when I want strict row-by-row. And <code>LAST_VALUE</code> needs an explicit full frame or it just returns the current row. The selling point is these replace ugly self-joins.</p></div>
<p>Beyond ranking, window functions compare rows to neighbors and aggregate over a sliding <strong>frame</strong> — without collapsing rows.</p>
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
        a: `<div class="interview-answer"><p>This is the classic gaps-and-islands pattern. The trick is that within a run of consecutive dates, <code>date - ROW_NUMBER()</code> is constant, so that difference becomes a group key you can <code>GROUP BY</code>, then <code>HAVING COUNT(*) &gt;= 3</code>. I always dedupe multiple logins per day first with <code>DISTINCT</code>. What makes it worth knowing is how many questions it answers with one technique: longest streak, consecutive absences, sessionizing click events.</p></div>
<p>The <strong>gaps-and-islands</strong> trick: <code>date - ROW_NUMBER()</code> is constant within a consecutive run, so it becomes a group key.</p>
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
        a: `<div class="interview-answer"><p>MVCC keeps multiple versions of each row so every transaction reads a consistent snapshot as of its start — that's why readers never block writers and writers never block readers. An <code>UPDATE</code> doesn't overwrite; it writes a new version and marks the old one dead, and visibility is decided per-transaction. The senior follow-ups are about the cost: in Postgres dead versions live in the table and must be reclaimed by <code>VACUUM</code>, so a long-running transaction holds back cleanup and causes bloat, and <code>COUNT(*)</code> is slow because it must check visibility row by row. Write-write conflicts still lock.</p></div>
<p><strong>MVCC</strong>: instead of locking rows for reads, the database keeps <strong>multiple versions</strong> of each row. Every transaction sees a consistent <strong>snapshot</strong> as of its start — readers never block writers and writers never block readers.</p>
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
        a: `<div class="interview-answer"><p>I pivot with conditional aggregation — an aggregate over a <code>CASE</code>, or <code>FILTER</code> in Postgres — which works everywhere without vendor-specific <code>PIVOT</code> syntax. The pattern I use constantly in real code is counting by status in one pass: several <code>COUNT ... FILTER</code> expressions instead of running three separate queries or self-joining. That's the signal interviewers want: do you reach for a single scan or naively query N times. It also keeps the SQL portable.</p></div>
<p><strong>Conditional aggregation</strong> — an aggregate over a CASE (or FILTER) turns row values into columns. Works in every database, no vendor PIVOT syntax needed.</p>
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
      {
        q: 'Why did my LEFT JOIN return fewer rows after adding a WHERE filter? (the LEFT JOIN that silently becomes an INNER JOIN)',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>For an outer join, <code>ON</code> and <code>WHERE</code> are not interchangeable — <code>ON</code> decides what matches, <code>WHERE</code> filters the joined result. Unmatched left rows carry NULLs in the right columns, so any <code>WHERE</code> condition on a right-table column is UNKNOWN for them and drops them, silently turning your <code>LEFT JOIN</code> into an <code>INNER JOIN</code>. The fix is to move right-table filters into the <code>ON</code> clause. The habit forms because for <code>INNER</code> joins the placement genuinely doesn't matter, so people learn it wrong. The one deliberate exception is the anti-join: <code>WHERE o.id IS NULL</code> to find rows with no match.</p></div>
<p>For an outer join, <strong>ON and WHERE are NOT interchangeable</strong>. ON decides what matches; WHERE filters the <em>joined result</em>. Unmatched left rows carry NULLs in all right-table columns — so any WHERE condition on a right-table column evaluates to UNKNOWN for them and throws them away, silently turning the LEFT JOIN into an INNER JOIN.</p>
<pre>-- customers                     -- orders
-- id | name                     -- id | customer_id | status
--  1 | An                       -- 10 |      1      | paid
--  2 | Bo                       -- 11 |      2      | cancelled
--  3 | Chi                      -- (Chi has no orders)

SELECT c.name, o.id, o.status
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id;
-- 3 rows: An/paid, Bo/cancelled, Chi/NULL     ✅ all customers kept

-- "Just show paid orders" — condition put in WHERE:
SELECT c.name, o.id, o.status
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'paid';
-- 1 row: An only! ❌ Bo fails the filter, and Chi's row is (Chi, NULL, NULL)
-- → NULL = 'paid' is UNKNOWN → dropped. LEFT JOIN degraded to INNER JOIN.

-- ✅ Fix: right-table filters belong in ON
SELECT c.name, o.id, o.status
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'paid';
-- 3 rows: An/paid, Bo/NULL, Chi/NULL — every customer, paid orders where they exist

-- The one intentional exception — the anti-join pattern:
SELECT c.* FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;      -- customers with NO orders (IS NULL is the whole point here)</pre>
<p>Why the bad habit exists: for an <strong>INNER</strong> join, ON vs WHERE placement makes no difference (the optimizer merges them), so developers learn it "doesn't matter" — until the first outer join. Interviewer follow-up: filters on the <strong>left</strong> table are safe in WHERE; only right-table conditions must move into ON.</p>
<div class="key-point">In a LEFT JOIN, any WHERE condition on a right-table column (except IS NULL) silently converts it to an INNER JOIN — put right-side filters in the ON clause.</div>`,
      },
      {
        q: 'Why does a row match neither status = X nor status != X? COUNT(*) vs COUNT(col) vs COUNT(DISTINCT col).',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Because of three-valued logic, a NULL row fails both <code>status = X</code> and <code>status != X</code>, so complementary filters don't partition the table — rows silently vanish from reports. The classic symptom is a dashboard split into active and not-active tabs whose totals don't sum to <code>COUNT(*)</code> because nobody counted the NULL bucket. The fix is to handle NULL explicitly with <code>OR status IS NULL</code> or <code>IS DISTINCT FROM</code>. And I keep the COUNT variants straight: <code>COUNT(*)</code> and <code>COUNT(1)</code> count rows and are identical, <code>COUNT(col)</code> skips NULLs — the "COUNT(1) is faster" claim is a myth.</p></div>
<p>Because of three-valued logic, a NULL row fails <strong>both</strong> a condition and its negation — so complementary filters do not partition the table, and different COUNT variants disagree. This silently loses rows in reports.</p>
<pre>-- users
-- id | status
--  1 | active
--  2 | inactive
--  3 | NULL

SELECT COUNT(*)               FROM users;   -- 3  (counts ROWS)
SELECT COUNT(status)          FROM users;   -- 2  (skips NULLs!)
SELECT COUNT(DISTINCT status) FROM users;   -- 2  ('active','inactive' — NULL ignored)

SELECT * FROM users WHERE status =  'active';   -- 1 row (id 1)
SELECT * FROM users WHERE status != 'active';   -- 1 row (id 2) — id 3 is MISSING!
-- NULL != 'active' → UNKNOWN, and WHERE keeps only TRUE.
-- Row 3 matches NEITHER query: the two "opposite" filters return 2 of 3 rows.

-- ✅ Fixes:
SELECT * FROM users WHERE status != 'active' OR status IS NULL;

SELECT * FROM users WHERE status IS DISTINCT FROM 'active';  -- PostgreSQL, NULL-safe
-- MySQL: WHERE NOT (status <=> 'active');

-- Same trap inside aggregates — two "averages", two answers:
SELECT AVG(score) FROM exams;               -- NULLs excluded from numerator AND denominator
SELECT AVG(COALESCE(score, 0)) FROM exams;  -- missing treated as 0 → lower value</pre>
<p>Failure mode in the wild: a dashboard splits users into "active" and "not active" tabs and the totals don't add up to COUNT(*) — nobody notices the NULL bucket. Interviewer follow-up: <code>COUNT(1)</code> is identical to <code>COUNT(*)</code> (the "COUNT(1) is faster" claim is a myth).</p>
<div class="key-point">Before writing any negative filter, ask "is this column nullable?" — and remember COUNT(col) counts non-NULL values while COUNT(*) counts rows.</div>`,
      },
      {
        q: 'IN vs EXISTS vs JOIN: when do they return different results for the same question?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>All three can answer "customers who have orders" but they aren't equivalent. A <code>JOIN</code> multiplies rows on one-to-many, so you need <code>DISTINCT</code>; <code>IN</code> and <code>EXISTS</code> are semi-joins returning each row at most once. Modern optimizers usually rewrite <code>IN</code> and <code>EXISTS</code> to the same plan, so "EXISTS is always faster" is outdated folklore — check the plan. Where they really diverge is negation: <code>NOT IN</code> against a nullable column returns zero rows thanks to three-valued logic, while <code>NOT EXISTS</code> stays correct and plans as an efficient anti-join, so I default to <code>NOT EXISTS</code>.</p></div>
<p>All three can answer "customers who have orders", but they are <strong>not semantically equivalent</strong> — the differences (row multiplication and NULL handling) are exactly what interviewers probe.</p>
<pre>-- 1) JOIN: multiplies rows on 1-to-many!
SELECT c.name
FROM customers c
JOIN orders o ON o.customer_id = c.id;
-- An has 3 orders → 'An' appears 3 TIMES. Needs DISTINCT (extra sort/hash work).

-- 2) IN: semi-join — each customer at most once
SELECT name FROM customers
WHERE id IN (SELECT customer_id FROM orders);

-- 3) EXISTS: semi-join, and NULL-proof
SELECT name FROM customers c
WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);

-- The NEGATION is where they really diverge:
SELECT name FROM customers
WHERE id NOT IN (SELECT customer_id FROM orders);
-- → ZERO rows if ANY orders.customer_id is NULL (three-valued logic bomb)

SELECT name FROM customers c
WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);
-- → correct answer regardless of NULLs ✅</pre>
<ul>
<li><strong>JOIN</strong>: use when you need columns from <em>both</em> tables; be ready to explain the duplicate-row effect.</li>
<li><strong>IN / EXISTS</strong>: pure existence tests (semi-joins). Modern optimizers usually rewrite both to the <em>same</em> semi-join plan — "EXISTS is always faster than IN" is outdated folklore; check the plan instead.</li>
<li><strong>NOT IN vs NOT EXISTS</strong>: never NOT IN on a nullable subquery column; NOT EXISTS is also typically planned as an efficient anti-join.</li>
</ul>
<div class="key-point">Choose by semantics — semi-join for existence, JOIN for data from both sides — and default to NOT EXISTS over NOT IN; the optimizer usually makes their performance identical anyway.</div>`,
      },
      {
        q: 'Two transactions read the same balance and both write back — one update vanishes. How do you prevent lost updates?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The lost update anomaly is a read-modify-write in application code where the second writer clobbers the first, because plain SELECTs take no locks under Read Committed. There are three fixes and I pick by contention pattern. Best is making the write atomic — <code>UPDATE ... SET balance = balance - 30 WHERE balance &gt;= 30</code> — so it happens in one statement. Pessimistic <code>SELECT ... FOR UPDATE</code> locks the row for short, high-conflict transactions; an optimistic version column suits edits spanning user think-time where you can't hold a lock. The trap: MySQL Repeatable Read does not prevent lost updates, and Postgres Repeatable Read makes you retry on a serialization error.</p></div>
<p>The <strong>lost update</strong> anomaly: read–modify–write done in the application means the second writer overwrites the first, because plain SELECTs take no locks under READ COMMITTED (the default in PostgreSQL, Oracle, SQL Server).</p>
<pre>-- Session A                                 -- Session B
BEGIN;                                       BEGIN;
SELECT balance FROM acc WHERE id=1;  --100   SELECT balance FROM acc WHERE id=1;  --100
-- app computes 100 - 30 = 70                -- app computes 100 - 50 = 50
UPDATE acc SET balance=70 WHERE id=1;
COMMIT;
                                             UPDATE acc SET balance=50 WHERE id=1;
                                             COMMIT;
-- Final balance = 50. A's withdrawal vanished: 80 was spent from 100. ❌

-- ✅ Fix 1: make the write atomic (best when the logic fits in SQL)
UPDATE acc SET balance = balance - 30
WHERE id = 1 AND balance >= 30;        -- also enforces the invariant

-- ✅ Fix 2: pessimistic — SELECT ... FOR UPDATE locks the row until COMMIT
BEGIN;
SELECT balance FROM acc WHERE id = 1 FOR UPDATE;   -- Session B blocks HERE
UPDATE acc SET balance = 70 WHERE id = 1;
COMMIT;                                            -- B wakes and reads 70
-- Variants: FOR UPDATE NOWAIT (fail fast), FOR UPDATE SKIP LOCKED (job queues)

-- ✅ Fix 3: optimistic — version column, no lock held while the user thinks
UPDATE acc SET balance = 70, version = version + 1
WHERE id = 1 AND version = 41;         -- the version you originally read
-- 0 rows affected → someone else won → reload and retry (JPA @Version does this)</pre>
<ul>
<li><strong>Pessimistic</strong> (FOR UPDATE): short transactions, frequent conflicts; risk = lock waits and deadlocks.</li>
<li><strong>Optimistic</strong> (version check): edits spanning user think-time or HTTP requests, where holding a DB lock is impossible; risk = retries under contention.</li>
<li><strong>Trick follow-up</strong>: MySQL REPEATABLE READ does <em>not</em> prevent lost updates (snapshot reads + last-write-wins); PostgreSQL REPEATABLE READ aborts one transaction with a serialization error — your code must retry.</li>
</ul>
<div class="key-point">Never do read–modify–write across statements without a strategy: atomic UPDATE, SELECT ... FOR UPDATE, or a version column — and know that isolation levels alone do not save you in MySQL.</div>`,
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
        a: `<div class="interview-answer"><p><code>EXPLAIN</code> shows the planner's chosen plan with estimates; <code>EXPLAIN ANALYZE</code> actually runs it and gives real timings and row counts. The single most important thing I look for is estimated versus actual rows diverging — an order-of-magnitude gap means stale statistics, and bad estimates cause bad plans, so I run <code>ANALYZE</code> before anything else. I read the tree from the most-indented node outward, watch for <code>Seq Scan</code> on big tables and <code>Nested Loop</code> over large sets, and use <code>BUFFERS</code> to separate cache from disk. Remember a node's real cost is actual time times loops.</p></div>
<p><code>EXPLAIN</code> shows the optimizer's chosen plan with <em>estimates</em>; <code>EXPLAIN ANALYZE</code> actually runs the query and adds <em>real</em> timings and row counts. Read the plan tree from the <strong>most-indented node outward</strong> — inner nodes run first and feed their parents.</p>
<pre>EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders WHERE customer_id = 42;

-- Index Scan using idx_orders_customer on orders
--   (cost=0.43..8.45 rows=3 width=64)          ← estimate
--   (actual time=0.02..0.03 rows=3 loops=1)    ← reality
--   Buffers: shared hit=4                        ← 4 pages, all from cache</pre>
<p><strong>How to read each part:</strong></p>
<ul>
<li><strong>cost=start..total</strong> — arbitrary optimizer units (not ms). Only the <em>relative</em> value matters: the planner picks the lowest-total-cost plan.</li>
<li><strong>rows (estimate) vs actual rows</strong> — the single most important check. Off by 10–100×+ → <strong>stale/incorrect statistics</strong>; run <code>ANALYZE</code>. Bad estimates cause bad plans.</li>
<li><strong>loops</strong> — a node's real cost is <code>actual time × loops</code>; a cheap-looking inner node run 100,000 times in a Nested Loop is your bottleneck.</li>
<li><strong>Buffers</strong> — <code>shared hit</code> = from cache, <code>read</code> = from disk. Lots of <code>read</code> = I/O-bound.</li>
</ul>
<p><strong>Node types you'll see (and what they signal):</strong></p>
<ul>
<li><strong>Seq Scan</strong> — full table scan. Fine on tiny tables or when returning most rows; a red flag on a large table with a selective filter → add an index.</li>
<li><strong>Index Scan</strong> — seek via index, then fetch rows. <strong>Index Only Scan</strong> — answered entirely from the index (covering) → fastest.</li>
<li><strong>Nested Loop</strong> — great for small row counts, catastrophic when the outer side is large (the "rows=12 but actual=480000" trap).</li>
<li><strong>Hash Join</strong> — builds a hash table, best for large equi-joins. <strong>Merge Join</strong> — good when both inputs are already sorted.</li>
<li><strong>Sort / Hash Aggregate</strong> — materializing work; expensive if it spills to disk (watch for "external merge Disk").</li>
</ul>
<div class="key-point">Workflow: run <code>EXPLAIN (ANALYZE, BUFFERS)</code>, then scan every node for <strong>estimated vs actual rows diverging</strong> — that node is where the plan went wrong. Fix statistics first (<code>ANALYZE</code>), then indexing, and rewrite the query only as a last resort. MySQL equivalent: <code>EXPLAIN ANALYZE</code> (8.0+) or <code>EXPLAIN FORMAT=JSON</code>.</div>`,
      },
      {
        q: 'What are the most common causes of slow SQL queries?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The usual suspects cluster into a few buckets: missing indexes on <code>WHERE</code>, <code>JOIN</code>, and <code>ORDER BY</code> columns; non-SARGable predicates like wrapping a column in a function or an implicit type cast that bypasses the index; <code>SELECT *</code> dragging extra I/O and killing covering indexes; the ORM N+1 problem; large <code>OFFSET</code> pagination; correlated subqueries running per row; and stale statistics. My approach isn't to guess — I rank by total time in <code>pg_stat_statements</code>, read the plan, and fix the specific cause. The most common single fix after a bulk load is simply refreshing statistics.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>Index columns that are frequently in <code>WHERE</code>, <code>JOIN</code>, or <code>ORDER BY</code>, have high cardinality, and where queries return a small slice of a large table. Don't index small tables, low-cardinality columns like booleans, rarely-queried columns, or write-heavy tables where the index tax outweighs the read gain. The framing I add is that every index costs disk, write throughput, and maintenance — it's a trade, not free — so I measure with <code>pg_stat</code> before and after, add with <code>CREATE INDEX CONCURRENTLY</code> to avoid locking writes, and drop indexes nobody uses.</p></div>
<p><strong>Create index when</strong>:</p>
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
        a: `<div class="interview-answer"><p>A composite index follows the leftmost-prefix rule: an index on <code>(a, b, c)</code> supports filters on <code>a</code>, on <code>a</code> and <code>b</code>, or on all three, but not on <code>b</code> alone. The design rule is equality columns first, then the range or sort column last, because a range predicate stops the index being usable for columns after it. That's why <code>(department, status, salary)</code> serves an equality-plus-range query but a filter on <code>status</code> alone can't use it. Column order is the whole game — one well-ordered composite often beats three single-column indexes.</p></div>
<p>A composite index covers <strong>multiple columns</strong>. Column order follows the <strong>leftmost prefix rule</strong>.</p>
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
        a: `<div class="interview-answer"><p>A covering index contains every column the query needs — filter, sort, and returned — so the database answers it from the index alone, no hop to the heap, shown as an <code>Index Only Scan</code>. I order the key columns as equality filters, then sort columns, then range, and push return-only columns into <code>INCLUDE</code> to keep the index narrow. The trade-off is a wider index means more disk and more write cost, so I only cover the few hot read queries. Postgres caveat: an index-only scan still checks the visibility map, so heavy recent updates can force heap fetches until <code>VACUUM</code> runs.</p></div>
<p>A <strong>covering index</strong> contains <em>every</em> column a query needs — both the ones it filters/sorts on and the ones it returns. The database can then answer the query <strong>from the index alone</strong>, skipping the expensive hop back to the table (heap) for each row. The plan shows an <strong>Index Only Scan</strong>.</p>
<pre>-- Query: filter on status, return name+email, ordered by name
SELECT name, email FROM users WHERE status = 'active' ORDER BY name;

-- Covering index: status (filter) + name (filter/order) + email (payload)
CREATE INDEX idx_users_covering ON users(status, name, email);
-- → Index Only Scan: no heap access, and rows already in name order (no Sort step)</pre>
<p><strong>Two ways to add the payload columns (PostgreSQL):</strong></p>
<pre>-- (a) as key columns — usable for filtering AND ordering, kept sorted:
CREATE INDEX idx_a ON users(status, name, email);

-- (b) INCLUDE — stored only at the leaf level as payload; NOT usable for
--     searching or ordering, but keeps the index narrower and cheaper:
CREATE INDEX idx_b ON users(status, name) INCLUDE (email);</pre>
<ul>
<li>Use <strong>key columns</strong> for anything you filter or sort by; use <strong>INCLUDE</strong> for columns you only need to <em>return</em>.</li>
<li><strong>Trade-off</strong>: a covering index is wider → more disk and more write cost on every INSERT/UPDATE of those columns. Cover the few hot read queries, not everything.</li>
<li><strong>PostgreSQL caveat</strong>: an Index Only Scan still consults the <em>visibility map</em>; on a table with many recent updates it may fall back to heap fetches until <code>VACUUM</code> runs.</li>
</ul>
<div class="key-point">Covering index = "the index answers the whole query." Order key columns as <strong>equality filters → sort columns → range filters</strong>, and push return-only columns into <code>INCLUDE</code> to keep the index lean. MySQL/InnoDB: every secondary index implicitly includes the primary key, and covering shows as "Using index" in EXPLAIN.</div>`,
      },
      {
        q: 'How to optimize pagination for large datasets?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p><code>OFFSET</code> pagination is O(n) — <code>OFFSET 1000000</code> still scans and throws away a million rows — so for deep pages and APIs I use keyset (cursor) pagination: <code>WHERE id &gt; :last_seen_id ORDER BY id LIMIT n</code> on an indexed column, which is O(1) regardless of page depth. The deferred-join trick helps when you're stuck with <code>OFFSET</code>. And I avoid <code>COUNT(*)</code> for totals — replace "total pages" with a "has next page?" check by fetching one extra row. The catch with keyset is it needs a stable, unique sort key.</p></div>
<p><strong>Problem</strong>: <code>OFFSET 1000000LIMIT 10</code> scans 1,000,010 rows.</p>
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
        a: `<div class="interview-answer"><p>The N+1 problem is one query for the parents plus one query per parent for its children — N+1 round trips, usually created invisibly by an ORM's lazy loading. The fix is to batch: a single <code>JOIN</code>, a <code>WHERE ... IN</code> over the collected parent ids, or the ORM's eager fetch like JPA's <code>JOIN FETCH</code> or <code>@EntityGraph</code>. It's the most common performance bug I see in application code, and it hides in dev with small data then falls over in production. I catch it by watching the query log or an APM trace, not by reading code.</p></div>
<p><strong>Problem</strong>: 1 query to fetch parents + N queries to fetch each parent's children.</p>
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
        a: `<div class="interview-answer"><p>Start by indexing both sides of the join condition — that's the biggest lever. Filter early so you join smaller sets, ideally pre-filtering in a CTE or subquery before touching a large table. Avoid joining on functions like <code>ON UPPER(a) = UPPER(b)</code>, which defeats the index — use a functional index or computed column instead. Beyond that it's about helping the optimizer pick the right physical join: nested loop for small sets, hash for large equi-joins, merge for pre-sorted inputs. And question whether you need every column, since <code>SELECT *</code> kills covering plans.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>Prepared statements let the database compile a plan once and reuse it across parameter values, saving repeated hard-parse cost and — the bigger win — preventing SQL injection by separating code from data. The senior nuance is the downside: a single cached generic plan can be great for a rare parameter value and terrible for a common one on skewed data, which is why Postgres has <code>plan_cache_mode</code> to force a custom plan per parameter. I find the hot queries worth caching via <code>pg_stat_statements</code>. Never build SQL by string concatenation.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>Partitioning splits one large logical table into physical pieces, usually by range on a date, sometimes by list or hash. The payoff is partition pruning — queries that filter on the partition key skip whole partitions — plus instant data expiry by dropping a partition instead of a massive <code>DELETE</code>, and easier maintenance. The rule I apply is it only pays off on very large tables, 10M-plus rows, where queries naturally filter on the partition key; otherwise it just adds complexity. And the partition key must appear in your queries or pruning can't happen.</p></div>
<p>Partitioning splits a large table into smallerphysical pieces while keeping it logically one table.</p>
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
        a: `<div class="interview-answer"><p>In an MVCC database <code>COUNT(*)</code> is slow because visibility is per-transaction, so it can't read a stored counter — it scans every row or a full index. First question I ask: does the feature actually need an exact live total? "Showing 1 to 20 of about 12 million" is fine with the <code>reltuples</code> estimate from <code>pg_class</code>. A filtered count backed by an index is fast when the slice is small; an exact O(1) count needs a maintained summary table via triggers, moving the cost to write time. And for pagination, replace the total with a "has next page" check.</p></div>
<p><strong>Why it's slow:</strong> in an MVCC database (PostgreSQL), a row's visibility depends on the querying transaction, so <code>COUNT(*)</code> can't read a single stored counter — it must scan every row (or at least a full index) to check which versions are visible. On tens of millions of rows that's seconds.</p>
<pre>-- 1) Approximate total — instant, good enough for "≈ 12M results"
SELECT reltuples::bigint AS estimate
FROM pg_class WHERE relname = 'orders';         -- maintained by ANALYZE/autovacuum

-- 2) Filtered count backed by an index (fast when the slice is small)
CREATE INDEX idx_orders_status ON orders(status);
SELECT COUNT(*) FROM orders WHERE status = 'active';    -- index scan, not full table

-- 3) Maintained counter — exact and O(1) to read; cost moves to write time
CREATE TABLE order_counts (status text PRIMARY KEY, n bigint);
-- keep current with a trigger on INSERT/DELETE, or a scheduled refresh

-- 4) Pagination: replace "total pages" with "is there a next page?"
SELECT * FROM orders WHERE id > :last ORDER BY id LIMIT :size + 1;
-- fetched size+1 rows? → a next page exists. No COUNT(*) needed at all.</pre>
<ul>
<li><strong>Exact + fast is a trade-off</strong>: cheap-to-read exact counts cost you either at write time (trigger/summary table) or in freshness (a materialized view refreshed on a schedule).</li>
<li><strong>COUNT(*) vs COUNT(1) vs COUNT(col)</strong>: <code>COUNT(*)</code> and <code>COUNT(1)</code> are identical (both count rows — "COUNT(1) is faster" is a myth); <code>COUNT(col)</code> counts only non-NULL values, so it can return a smaller number.</li>
</ul>
<div class="key-point">Ask first: does the feature actually need an <em>exact</em> total? "Showing 1–20 of ~12M" is fine with <code>reltuples</code>; most APIs need no total at all (use the "has next page" pattern). Reserve exact live counts for a maintained summary table.</div>`,
      },
      {
        q: 'What are the differences between EXIST vs IN vs JOIN for subqueries?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Roughly: <code>EXISTS</code> short-circuits on the first match, so it shines when the subquery returns many rows; <code>IN</code> builds a list or hash, good for small value sets; <code>JOIN</code> when you actually need columns from both tables, but watch the one-to-many row multiplication that forces a <code>DISTINCT</code>. In practice modern optimizers converge <code>IN</code> and <code>EXISTS</code> to the same semi-join plan, so I choose by semantics and readability rather than a folklore ranking, then confirm with the plan. And I always prefer <code>NOT EXISTS</code> over <code>NOT IN</code> because of the NULL trap.</p></div>
<pre>-- EXISTS: stops at first match (short-circuit). Best when subquery returns MANY rows.
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
        a: `<div class="interview-answer"><p>I work in three evidence-driven phases. Find: turn on the slow-query log and rank by total time in <code>pg_stat_statements</code> — a 5ms query run two million times hurts more than a one-off three-second query. Diagnose: pull <code>EXPLAIN (ANALYZE, BUFFERS)</code> for the top offenders and look for Seq Scans, estimate blowups, and sorts spilling to disk. Fix cheapest first: refresh statistics, add a missing index concurrently, rewrite the query, and only then scale out with pooling or read replicas. Then verify with the same measurement. Guessing at indexes and never dropping the unused ones is the anti-pattern.</p></div>
<p>Work in three phases: <strong>find</strong> the worst queries with data (not guesses), <strong>diagnose</strong> each with its plan, then <strong>fix and verify</strong>.</p>
<p><strong>1. Find — turn on the slow query log and query the stats view:</strong></p>
<pre>-- PostgreSQL: log any statement slower than 500ms
ALTER SYSTEM SET log_min_duration_statement = '500ms';   -- then SELECT pg_reload_conf();

-- pg_stat_statements: the goldmine — rank by TOTAL time, not per-call time
--   (a 5ms query run 2M times hurts more than a 3s query run once)
SELECT query, calls, mean_exec_time, total_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;

-- MySQL equivalent:
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 0.5;
-- then aggregate with pt-query-digest / performance_schema</pre>
<p><strong>2. Diagnose — get the real plan for the top offenders:</strong></p>
<pre>EXPLAIN (ANALYZE, BUFFERS) &lt;the slow query&gt;;
-- look for: Seq Scans on big tables, estimated-vs-actual row blowups,
--           Nested Loops over large sets, Sort/Hash spilling to disk</pre>
<p><strong>3. Fix — cheapest, most-targeted change first, then re-measure:</strong></p>
<ul>
<li>Refresh statistics (<code>ANALYZE table;</code>) — a stale estimate is the most common root cause after a bulk load or big DELETE.</li>
<li>Add the missing index (find culprits via <code>pg_stat_user_tables.seq_scan</code>); build it with <code>CREATE INDEX CONCURRENTLY</code> to avoid locking writes.</li>
<li>Rewrite the query — kill correlated subqueries, make predicates SARGable, fix ORM N+1.</li>
<li>Scale out only after the query itself is sound: connection pooling (PgBouncer/HikariCP), read replicas for read-heavy load, caching.</li>
</ul>
<div class="key-point">The senior signal is <strong>evidence-driven order</strong>: rank by total time in <code>pg_stat_statements</code> → read the plan → fix statistics/index/query → verify with the same measurement. Adding indexes by guesswork (and never dropping the unused ones) is the anti-pattern.</div>`,
      },
      {
        q: 'What is database connection pooling and why is it important?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Opening a DB connection is expensive — TCP handshake, auth, backend process or thread allocation — so a pool keeps a set of live connections and hands them out, which is essential under any real concurrency. The counterintuitive senior point is that bigger is not better: too many connections cause memory pressure and context-switch thrash, and Postgres in particular runs a process per connection. The rule of thumb is roughly cores times two plus effective spindles, and if you need thousands of clients you put PgBouncer in front. Too small means clients wait; too large starves the database.</p></div>
<p>Creating a DB connection is expensive (TCP handshake, authentication, memory allocation). A <strong>connection pool</strong> maintains a cache of reusable connections.</p>
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
        a: `<div class="interview-answer"><p><code>DELETE</code> is DML — removes rows optionally by <code>WHERE</code>, logs each row, fires triggers, and is fully transactional. <code>TRUNCATE</code> is DDL — wipes all rows fast by deallocating pages, resets the identity counter, and skips triggers. <code>DROP</code> removes the table structure entirely. The interview trick is rollback behavior: in Postgres <code>TRUNCATE</code> is transactional and can be rolled back, but in MySQL it's an implicit commit and cannot — so "can you roll back TRUNCATE" is "it depends on the database." For clearing a table fast I use <code>TRUNCATE</code>; for conditional removal, <code>DELETE</code>.</p></div>
<table><tr><th>Aspect</th><th>DELETE</th><th>TRUNCATE</th><th>DROP</th></tr>
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
        a: `<div class="interview-answer"><p><code>UNION</code> removes duplicates, which means an implicit <code>DISTINCT</code> — a sort or hash that's expensive on large sets — while <code>UNION ALL</code> just concatenates and is always faster. So my default is <code>UNION ALL</code>, and I only pay for <code>UNION</code> when I genuinely need dedup. The wrong-results angle interviewers probe: if the data legitimately has duplicates you must keep — like a $100 transaction in two accounts you're summing — <code>UNION</code> silently drops one and corrupts the total. Reach for dedup deliberately, not by habit.</p></div>
<pre>-- UNION: combines results and REMOVES duplicates (slower — sorts/hashes)
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
        a: `<div class="interview-answer"><p>SARGable means the predicate can use an index seek. The killer is wrapping the column in a function or expression — <code>YEAR(created_at) = 2024</code>, <code>UPPER(email)</code>, <code>salary * 12</code>, an implicit type cast — because the database must compute it for every row and falls back to a full scan. The fix is to keep the column bare and move all computation to the constant side: rewrite the year filter as a date range, compare the right type. When the function is genuinely needed, index the expression itself with a functional index that matches it exactly. Leading-wildcard <code>LIKE '%x'</code> is its own case needing trigram or full-text.</p></div>
<p><strong>SARGable</strong> (Search ARGument able) = the predicate can use an index seek. Wrapping the <strong>column</strong> in a function or expression makes it non-SARGable — the DB must compute it for every row (full scan).</p>
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
        a: `<div class="interview-answer"><p>Beyond a plain B-tree there's a toolbox. A partial index covers only rows matching a condition — a tiny index when queries always target a subset, like active orders — and it doubles as a way to encode rules such as one active session per user via a partial unique index. A functional index indexes an expression like <code>LOWER(email)</code> for case-insensitive lookup. <code>INCLUDE</code> adds payload columns for covering scans. GIN and trigram handle contains-style and full-text search where a B-tree can't. Partial indexes are the most underused: smaller means it fits in memory and writes stay cheap.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>The bottleneck in bulk work is per-row round trips and per-statement overhead, not the raw volume, so the fix is batching. Row-by-row inserts do thousands a minute; multi-row inserts do tens of thousands a second; <code>COPY</code> or <code>LOAD DATA</code> does hundreds of thousands. In Java I use JDBC <code>executeBatch</code>, and crucially the <code>rewriteBatchedStatements</code> driver flag or it doesn't actually batch. For big deletes I chunk them so I don't hold one giant lock and bloat the WAL, and for updates I join against a staging table. For a one-time massive load, drop indexes, load, then rebuild.</p></div>
<p><strong>Batching</strong>: the killer is per-row round trips and per-statement overhead — not the data volume itself.</p>
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
        a: `<div class="interview-answer"><p>A view is just a saved query — no data stored, always fresh, and you pay the full query cost on every read; it's for abstraction and security, like hiding columns. A materialized view physically stores the result, can be indexed, and reads like a table, but the data is stale until you <code>REFRESH</code> it. So it's exactly the cache trade-off — freshness for read speed — except it lives inside the database and stays queryable in SQL. I use materialized views for expensive dashboard aggregations and <code>REFRESH ... CONCURRENTLY</code> from cron so reads aren't blocked.</p></div>
<ul>
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
      {
        q: 'The column is indexed and the predicate is SARGable — why does the optimizer still choose a full table scan?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Usually because the optimizer is right. Index access costs about one random I/O per matching row via the heap lookup, while a sequential scan reads pages in bulk — so past a few percent selectivity the full scan is genuinely cheaper, and ignoring the index on a low-selectivity predicate is the correct call. Other real causes: an <code>OR</code> across different columns can't use one B-tree, and tiny tables always scan. I prove it's a cost decision, not a broken index, by forcing <code>enable_seqscan = off</code> or <code>FORCE INDEX</code> and comparing — if the forced plan is slower, the planner won. A partial index often rescues a skewed column.</p></div>
<p>Because index access costs roughly <strong>onerandom I/O per matching row</strong> (index leaf → heap lookup), while a sequential scan reads pages in bulk. Past a few percent selectivity, the full scan is genuinely <em>cheaper</em> — the optimizer ignoring your index is often the optimizer being right.</p>
<pre>-- 1) Low selectivity: the index is used only when it pays off
SELECT * FROM orders WHERE status = 'done';     -- 95% of rows
-- → Seq Scan ✅ correct: index access = millions of random heap lookups

SELECT * FROM orders WHERE status = 'failed';   -- 0.1% of rows
-- → Index Scan ✅ same index, now worth it

-- 2) OR across DIFFERENT columns cannot use one B-tree
SELECT * FROM users WHERE email = 'an@x.com' OR phone = '555-1234';
-- Fix: index BOTH columns (PostgreSQL combines them via BitmapOr),
-- or rewrite as UNION so each branch seeks its own index:
SELECT * FROM users WHERE email = 'an@x.com'
UNION
SELECT * FROM users WHERE phone = '555-1234';

-- 3) Tiny table: everything fits in a few pages → scan always wins. Not a bug.

-- 4) Prove it is a COST decision, not a broken index (PostgreSQL):
SET enable_seqscan = off;    -- session-level experiment only!
EXPLAIN ANALYZE SELECT * FROM orders WHERE status = 'done';
-- If the forced index plan is SLOWER, the optimizer was right all along.
-- MySQL equivalent: SELECT * FROM orders FORCE INDEX (idx_status) WHERE ...</pre>
<p>Failure mode to mention: a partial index (<code>WHERE status IN ('new','processing')</code>) often beats a full index on a skewed column — you index only the selective slice you actually query.</p>
<div class="key-point">An ignored index is usually a cost-based decision — estimate the selectivity first, verify with enable_seqscan=off / FORCE INDEX, and only then blame statistics or the index design.</div>`,
      },
      {
        q: 'EXPLAIN says rows=12 but the step actually returned 480,000 — why are estimates wrong and how do you fix the plan?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Join strategy, join order, and memory grants are all chosen from row estimates, so an estimate off by orders of magnitude gives a catastrophic plan — the classic being a Nested Loop picked for half a million rows. The most common cause is stale statistics right after a bulk load or big delete, so <code>ANALYZE</code> first. The subtler one is correlated columns: the planner multiplies selectivities assuming independence, so city and country get wildly underestimated — Postgres extended statistics with a <code>dependencies</code> declaration fixes that. Skewed data plus a reused generic prepared plan is a third cause. Hints are the last resort because they rot as the data shifts.</p></div>
<p>Join strategy, join order, and memory grants are all chosen from <strong>row estimates</strong>. When the estimate is off by orders of magnitude, the optimizer picks a plan that is catastrophic at the real size — the classic symptom is a Nested Loop chosen for half a million rows.</p>
<pre>EXPLAIN ANALYZE
SELECT * FROM addresses WHERE city = 'Hanoi' AND country = 'VN';
-- Nested Loop  (estimated rows=12)  (actual rows=480000)   ← 40,000× off!
-- Cause: the planner multiplies selectivities as if columns were independent:
--   sel(city='Hanoi') × sel(country='VN') = tiny → wrong join strategy → minutes.

-- Fix 1: stale statistics (classic right after a bulk load / big DELETE)
ANALYZE addresses;                  -- MySQL: ANALYZE TABLE addresses;
-- autovacuum/auto-analyze has thresholds — a 10M-row COPY may not have triggered it yet

-- Fix 2: correlated columns → extended statistics (PostgreSQL 10+)
CREATE STATISTICS addr_city_country (dependencies)
  ON city, country FROM addresses;
ANALYZE addresses;
-- Planner now knows city implies country → realistic estimate → Hash Join ✅

-- Fix 3: skewed data + prepared statements reusing one generic plan
-- (fast for 'rare_value', terrible for 'common_value')
SET plan_cache_mode = force_custom_plan;   -- PostgreSQL: re-plan per parameter</pre>
<ul>
<li><strong>How to spot it</strong>: in EXPLAIN ANALYZE, scan every node for estimated vs actual rows diverging by 100× or more — that node is where the plan went wrong, regardless of where time is spent.</li>
<li><strong>Why hints are the last resort</strong>: forcing a join type fixes today's query and breaks next year's data distribution; fixing statistics fixes the whole workload.</li>
</ul>
<div class="key-point">A bad plan is almost always a bad estimate — compare estimated vs actual rows node by node, then repair statistics (ANALYZE, extended statistics for correlated columns) before rewriting the query.</div>`,
      },
      {
        q: 'MySQL EXPLAIN shows "Using filesort" and "Using temporary" — what do they mean and how do you eliminate them?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Both flags mean no index can deliver rows in the order needed. Using filesort is an explicit sort step — despite the name it may be in memory, spilling to disk past <code>sort_buffer_size</code>; Using temporary is an implicit temp table, typically for <code>GROUP BY</code>, <code>DISTINCT</code>, or some <code>UNION</code>s. They're killers under <code>LIMIT</code> because the whole set is materialized before the <code>LIMIT</code> applies. The fix is a composite index shaped as equality-filter columns first, then the <code>ORDER BY</code> or <code>GROUP BY</code> columns in matching direction, so the index feeds rows pre-sorted. The follow-up trap: a range predicate before the sort column breaks the ordering guarantee.</p></div>
<p>Both flags mean "no index delivers rows in theorder I need". <strong>Using filesort</strong> = an explicit sort step (despite the name it may be in-memory; it spills to disk past sort_buffer_size). <strong>Using temporary</strong> = an implicit temp table, typically for GROUP BY / DISTINCT / some UNIONs. On big tables under LIMIT they are performance killers, because the whole set is materialized before the LIMIT applies.</p>
<pre>EXPLAIN SELECT * FROM orders
WHERE  customer_id = 42
ORDER  BY created_at DESC
LIMIT  10;
-- Extra: Using where; Using filesort
-- → reads ALL of customer 42's orders, sorts them, keeps 10

CREATE INDEX idx_cust_created ON orders (customer_id, created_at);
-- Extra: Using where
-- → index delivers rows already sorted (backward scan) — touches ~10 rows ✅

-- Mixed sort directions defeat a normal index:
-- ORDER BY created_at DESC, id ASC          → filesort is back
CREATE INDEX idx_mixed ON orders (customer_id, created_at DESC, id ASC);  -- MySQL 8.0+

-- "Using temporary": GROUP BY that no index can feed in order
EXPLAIN SELECT status, COUNT(*) FROM orders GROUP BY status;
-- Extra: Using temporary
CREATE INDEX idx_status ON orders (status);
-- Extra: Using index   → streams groups straight off the index, no temp table ✅</pre>
<p>Design rule for the supporting composite index: <strong>equality-filter columns first, then the ORDER BY / GROUP BY columns</strong>, matching direction. Interviewer follow-up: a range predicate (<code>created_at > ?</code>) before the sort column breaks the ordering guarantee — the index can filter or sort, not both, past the range column.</p>
<div class="key-point">filesort/temporary do not mean "on disk" — they mean the index is not providing the required order; fix by shaping a composite index as (equality columns..., order-by columns) in matching directions.</div>`,
      },
      {
        q: 'How exactly does each extra index slow down writes? (write amplification, HOT updates, index bloat)',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Every secondary index is a separate B-tree the database must maintain on every write, so an insert into a table with six indexes is roughly seven writes plus WAL — real write amplification, not just disk space. In Postgres there's a sharper edge: MVCC normally allows a HOT update that touches no indexes if the changed column isn't indexed and the page has room, so indexing a hot column like <code>last_login</code> destroys that and forces every update into all indexes. So before adding an index I ask two questions: does it break HOT updates on a hot column, and will anything actually use it — then I audit <code>pg_stat_user_indexes</code> and drop the dead weight.</p></div>
<p>Every secondary index is a separate B-tree the database must keep in sync on <strong>every write</strong> — indexes are paid for at write time, not just in disk space.</p>
<pre>-- One INSERT into a table with 6 secondary indexes =
--   1 heap write + 6 B-tree inserts (+ page splits + WAL for each) → ~7× amplification

-- PostgreSQL UPDATE gotcha: MVCC writes a NEW row version.
UPDATE users SET last_login = now() WHERE id = 42;
-- If last_login is NOT indexed and the page has free space → HOT update:
--   heap-only tuple, ZERO index maintenance ✅
-- Now add: CREATE INDEX ON users(last_login);
--   → every such update must insert into ALL indexes on the table ❌
--   (you just indexed your hottest write path)

-- Leave page space so HOT updates stay possible on update-heavy tables:
ALTER TABLE users SET (fillfactor = 80);

-- Find dead weight — unused indexes are pure write overhead:
SELECT indexrelname, idx_scan,
       pg_size_pretty(pg_relation_size(indexrelid)) AS size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;

-- Redundant: idx(a) is covered by idx(a, b) → drop idx(a)
-- Bloated after heavy churn: rebuild without blocking writes
REINDEX INDEX CONCURRENTLY idx_orders_status;</pre>
<ul>
<li><strong>Failure mode</strong>: an "add an index for every slow query" culture quietly halves bulk-load and OLTP write throughput, then someone blames the database.</li>
<li><strong>Bloat</strong>: deleted/updated entries leave dead space in index pages; range scans read the dead pages too, so a bloated index makes <em>reads</em> slower as well.</li>
</ul>
<div class="key-point">Before adding an index ask two questions: does it break HOT updates on a hot column, and will anyone actually use it — and audit pg_stat_user_indexes regularly to drop the ones nobody does.</div>`,
      },
    ],
  },

  // ───────────────────────── 8. SPRING BOOT ─────────────────────────
];
