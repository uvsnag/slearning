import type { KmNode } from '../../types';

export const subqueries: KmNode = {
  title: 'Subqueries & CTEs',
  level: 'intermediate',
  summary:
    'Queries inside queries, named steps (CTEs) for readable SQL, and temp tables for in-between results.',
  simple:
    'Break a big question into small ones: first find the top customers, then look up their orders.',
  points: [
    'A subquery is a SELECT inside another statement.',
    'A CTE (WITH …) gives a subquery a name, like a temporary variable.',
    'Recursive CTEs walk trees and hierarchies.',
  ],
  children: [
    {
      title: 'Subqueries',
      level: 'intermediate',
      summary: 'A SELECT used as a value, a list or a table inside another query.',
      simple:
        'Like asking a helper a side question, then using their answer in your main question.',
      points: [
        'Scalar: returns one value, e.g. <code>WHERE price &gt; (SELECT AVG(price) FROM products)</code>.',
        'List: used with <code>IN</code> or <code>EXISTS</code>.',
        'Derived table: a subquery in <code>FROM</code> (needs an alias in both databases).',
        'A scalar subquery that returns more than one row is an error.',
      ],
    },
    {
      title: 'Correlated Subqueries',
      level: 'intermediate',
      summary: 'A subquery that refers to the outer row, so it logically runs once per outer row.',
      simple: 'For each employee, ask: "what’s the average salary in your department?"',
      points: [
        'It uses a column from the outer query: <code>WHERE e2.dept_id = e.dept_id</code>.',
        'Can be slow on big tables if the optimizer can’t turn it into a join.',
        'Often clearer as a JOIN or a window function.',
      ],
      detail: `<pre><code>-- Employees who earn more than their department’s average
SELECT e.name, e.salary
FROM employees e
WHERE e.salary &gt; (
  SELECT AVG(e2.salary)
  FROM employees e2
  WHERE e2.dept_id = e.dept_id
);</code></pre>`,
    },
    {
      title: 'CTE (WITH)',
      level: 'intermediate',
      summary:
        'Named subqueries defined at the top of a query with WITH, read top to bottom like steps.',
      simple: 'Like writing a recipe as numbered steps instead of one giant sentence.',
      points: [
        'Each CTE can use the ones above it; it lives only for that one statement.',
        'PostgreSQL 12+ inlines CTEs when safe; force with <code>AS MATERIALIZED</code> / <code>NOT MATERIALIZED</code>.',
        'SQL Server always inlines CTEs: one referenced twice is computed twice. Use a temp table to compute once.',
        'SQL Server: the statement before <code>WITH</code> must end with <code>;</code>.',
      ],
      detail: `<pre><code>WITH paid AS (
  SELECT customer_id, SUM(amount) AS total
  FROM orders
  WHERE status = 'paid'
  GROUP BY customer_id
)
SELECT c.name, p.total
FROM paid p
JOIN customers c ON c.id = p.customer_id
WHERE p.total &gt; 1000;</code></pre>`,
    },
    {
      title: 'Recursive CTE',
      level: 'advanced',
      summary:
        'A CTE that refers to itself, used to walk trees like org charts or category hierarchies.',
      points: [
        'Anchor part: the starting rows. Recursive part: joins back to the CTE.',
        'PostgreSQL needs <code>WITH RECURSIVE</code>; SQL Server uses plain <code>WITH</code>.',
        'SQL Server stops at 100 levels by default; change with <code>OPTION (MAXRECURSION n)</code> (0 = no limit).',
        'PostgreSQL has no default limit; guard against cycles (PG 14+ has a <code>CYCLE</code> clause).',
      ],
      detail: `<pre><code>WITH RECURSIVE chain AS (   -- SQL Server: WITH chain AS (
  SELECT id, name, manager_id, 1 AS depth
  FROM employees WHERE id = 42            -- anchor
  UNION ALL
  SELECT e.id, e.name, e.manager_id, c.depth + 1
  FROM employees e
  JOIN chain c ON e.id = c.manager_id     -- walk up
)
SELECT * FROM chain;
-- SQL Server: add OPTION (MAXRECURSION 500) if deeper than 100</code></pre>`,
    },
    {
      title: 'LATERAL & APPLY',
      level: 'expert',
      summary:
        'A subquery in FROM that can see columns of tables to its left, like a for-each loop.',
      points: [
        'PostgreSQL: <code>JOIN LATERAL (…) ON true</code> / <code>LEFT JOIN LATERAL</code>.',
        'SQL Server: <code>CROSS APPLY</code> / <code>OUTER APPLY</code>.',
        'Great for "top 3 orders per customer" with an index on (customer_id, created_at).',
        'Runs the inner query per outer row, so it relies on a good index.',
      ],
      detail: `<pre><code>-- PostgreSQL
SELECT c.name, o.* FROM customers c
CROSS JOIN LATERAL (SELECT * FROM orders o WHERE o.customer_id = c.id
                    ORDER BY created_at DESC LIMIT 3) o;

-- SQL Server
SELECT c.name, o.* FROM customers c
CROSS APPLY (SELECT TOP (3) * FROM orders o WHERE o.customer_id = c.id
             ORDER BY created_at DESC) o;</code></pre>`,
    },
    {
      title: 'Temp Tables',
      level: 'intermediate',
      summary: 'Tables that exist only for your session, handy for storing in-between results.',
      simple:
        'Scratch paper: you write intermediate results down, use them, and they’re thrown away when you leave.',
      points: [
        'PostgreSQL: <code>CREATE TEMP TABLE t AS SELECT …</code>; dropped at session end (or <code>ON COMMIT DROP</code>).',
        'SQL Server: <code>SELECT … INTO #t FROM …</code>; <code>#t</code> is per session, <code>##t</code> is global.',
        'SQL Server temp tables live in <code>tempdb</code>; table variables (<code>@t</code>) are a lighter option with poor row estimates.',
        'Unlike CTEs, temp tables have statistics and can get indexes.',
      ],
    },
  ],
};

export const windowFunctions: KmNode = {
  title: 'Window Functions',
  level: 'intermediate',
  summary:
    'Calculations across related rows (rank, running total, previous row) without collapsing them.',
  simple:
    'GROUP BY squashes rows into one per group. A window function keeps every row and adds a calculated column, like writing each runner’s place next to their name.',
  points: [
    'Syntax: <code>function() OVER (PARTITION BY … ORDER BY …)</code>.',
    'Same syntax in PostgreSQL and SQL Server (2012+ for frames, LAG/LEAD).',
    'Solve ranking, top-N per group, running totals and gaps in one query.',
  ],
  children: [
    {
      title: 'OVER & PARTITION BY',
      level: 'intermediate',
      summary: 'OVER defines the window; PARTITION BY splits rows into groups for the calculation.',
      simple:
        'PARTITION BY draws invisible fences. The calculation runs inside each fenced area separately.',
      points: [
        '<code>AVG(salary) OVER (PARTITION BY dept_id)</code>: department average on every row.',
        'Empty <code>OVER ()</code> means the whole result is one window.',
        'Window functions run after WHERE and GROUP BY, so you can’t filter on them directly; wrap in a CTE.',
      ],
    },
    {
      title: 'ROW_NUMBER, RANK, DENSE_RANK',
      level: 'intermediate',
      summary: 'Number rows in order; they differ in how they handle ties.',
      simple:
        'Three runners tie for first. ROW_NUMBER gives 1, 2, 3. RANK gives 1, 1, 1, then 4. DENSE_RANK gives 1, 1, 1, then 2.',
      points: [
        '<code>ROW_NUMBER()</code>: always unique, ties broken arbitrarily (add a tie-breaker column).',
        '<code>RANK()</code>: ties share a rank, then it skips numbers.',
        '<code>DENSE_RANK()</code>: ties share a rank, no gaps.',
        '<code>NTILE(4)</code> splits rows into quartiles.',
      ],
      detail: `<pre><code>SELECT name, dept_id, salary,
  ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn,
  RANK()       OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk,
  DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS drnk
FROM employees;</code></pre>`,
    },
    {
      title: 'Top-N per Group',
      level: 'intermediate',
      summary:
        'Use ROW_NUMBER in a CTE, then filter on it, to get e.g. the latest order per customer.',
      simple: 'Rank everyone inside their team, then keep only the number ones.',
      points: [
        'Pattern: number the rows per group, then <code>WHERE rn &lt;= N</code> in the outer query.',
        'Use DENSE_RANK if ties should all be kept.',
        'PostgreSQL also has <code>DISTINCT ON (customer_id)</code> for the top-1 case.',
        'SQL Server alternative: <code>SELECT TOP (1) WITH TIES … ORDER BY ROW_NUMBER() OVER (…)</code>.',
      ],
      detail: `<pre><code>WITH ranked AS (
  SELECT o.*,
         ROW_NUMBER() OVER (PARTITION BY customer_id
                            ORDER BY created_at DESC) AS rn
  FROM orders o
)
SELECT * FROM ranked WHERE rn = 1;</code></pre>`,
    },
    {
      title: 'LAG & LEAD',
      level: 'intermediate',
      summary: 'Read a value from the previous or next row, e.g. to compare with yesterday.',
      simple: 'Peek over your shoulder at the row before (LAG) or ahead at the row after (LEAD).',
      points: [
        '<code>LAG(amount) OVER (ORDER BY day)</code>: the previous day’s amount.',
        'Optional offset and default: <code>LAG(amount, 1, 0)</code>.',
        'Good for day-over-day change, gaps between events, session detection.',
        '<code>FIRST_VALUE</code> / <code>LAST_VALUE</code> read the edges of the window.',
      ],
    },
    {
      title: 'Running Totals & Frames',
      level: 'advanced',
      summary:
        'SUM() OVER (ORDER BY …) gives cumulative totals; a frame clause controls which rows count.',
      points: [
        '<code>SUM(amount) OVER (ORDER BY day)</code>: running total.',
        'Frame example: <code>ROWS BETWEEN 6 PRECEDING AND CURRENT ROW</code> for a 7-day moving sum.',
        'Default frame with ORDER BY is <code>RANGE … CURRENT ROW</code>, which includes ties; use <code>ROWS</code> to avoid surprises.',
        'In SQL Server, <code>ROWS</code> is also much faster than the default <code>RANGE</code> (in-memory vs on-disk spool).',
        '<code>LAST_VALUE</code> needs a frame up to <code>UNBOUNDED FOLLOWING</code>, or it returns the current row.',
      ],
      detail: `<pre><code>SELECT day, amount,
  SUM(amount) OVER (ORDER BY day
                    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running,
  AVG(amount) OVER (ORDER BY day
                    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS avg_7d
FROM daily_sales;</code></pre>`,
    },
  ],
};
