import type { KmNode } from '../../types';

export const aggregation: KmNode = {
  title: 'Aggregation',
  level: 'beginner',
  summary: 'Summarise many rows into totals, counts and averages, per group.',
  simple:
    'Instead of listing every sale, you ask "how much did each shop sell?". Aggregation squashes many rows into one answer per group.',
  points: [
    'Aggregate functions turn many rows into one value.',
    'GROUP BY makes one result row per group.',
    'HAVING filters groups; WHERE filters rows before grouping.',
  ],
  children: [
    {
      title: 'Aggregate Functions',
      level: 'beginner',
      summary: 'COUNT, SUM, AVG, MIN and MAX compute one value from many rows.',
      simple: 'Like the totals row at the bottom of a spreadsheet.',
      points: [
        '<code>SUM(amount)</code>, <code>AVG(amount)</code>, <code>MIN(price)</code>, <code>MAX(price)</code>.',
        'They ignore NULLs (except <code>COUNT(*)</code>).',
        'SQL Server: <code>AVG</code> of an INT column returns an INT (decimals cut off); cast first. PostgreSQL returns numeric.',
        'On an empty set, SUM returns NULL, not 0. Wrap with <code>COALESCE(SUM(x), 0)</code>.',
        '<code>STRING_AGG(name, &#39;, &#39;)</code> joins text values (PostgreSQL 9.0+, SQL Server 2017+).',
      ],
    },
    {
      title: 'COUNT Variants',
      level: 'beginner',
      summary:
        'COUNT(*) counts rows; COUNT(col) counts non-NULL values; COUNT(DISTINCT col) counts unique values.',
      simple:
        'COUNT(*) counts people in the room. COUNT(phone) counts people who gave a phone number. COUNT(DISTINCT city) counts different cities.',
      points: [
        '<code>COUNT(*)</code>: every row, NULLs included.',
        '<code>COUNT(email)</code>: rows where email is not NULL.',
        '<code>COUNT(DISTINCT email)</code>: unique non-NULL emails.',
        '<code>COUNT(1)</code> is the same as <code>COUNT(*)</code>; no speed difference.',
        'SQL Server: <code>COUNT_BIG</code> when the count may exceed the INT range.',
      ],
    },
    {
      title: 'GROUP BY',
      level: 'beginner',
      summary: 'Splits rows into groups by one or more columns and runs aggregates per group.',
      simple: 'Sort all receipts into piles by shop, then add up each pile.',
      points: [
        'Every selected column must be in GROUP BY or inside an aggregate.',
        'PostgreSQL relaxes this when you group by a primary key: other columns of that table are allowed.',
        'Group by several columns: <code>GROUP BY country, city</code>.',
        'NULLs end up together in one group.',
        'Both support <code>ROLLUP</code>, <code>CUBE</code> and <code>GROUPING SETS</code> for subtotals.',
      ],
      detail: `<pre><code>SELECT customer_id,
       COUNT(*)    AS orders,
       SUM(amount) AS spent
FROM orders
GROUP BY customer_id;</code></pre>`,
    },
    {
      title: 'HAVING',
      level: 'beginner',
      summary: 'Filters groups after aggregation, e.g. "only customers with more than 5 orders".',
      simple: 'WHERE throws away single receipts; HAVING throws away whole piles.',
      points: [
        'Can use aggregates: <code>HAVING COUNT(*) &gt; 5</code>.',
        'Put plain row filters in WHERE: fewer rows to group means faster queries.',
      ],
      detail: `<pre><code>SELECT customer_id, SUM(amount) AS spent
FROM orders
WHERE status = 'paid'          -- rows first
GROUP BY customer_id
HAVING SUM(amount) &gt; 1000;    -- then groups</code></pre>`,
      tip: 'Classic interview question: "WHERE vs HAVING?" WHERE filters rows before grouping, HAVING filters groups after.',
    },
  ],
};

export const joins: KmNode = {
  title: 'Joins & Set Operations',
  level: 'beginner',
  summary: 'Combine rows from several tables with joins, and stack results with UNION.',
  simple:
    'Joins glue tables side by side using matching IDs. UNION stacks two lists on top of each other.',
  points: [
    'Most real queries join 2–5 tables.',
    'INNER keeps matches only; LEFT keeps all rows from the left side.',
    'EXISTS / NOT EXISTS answer "has any" and "has none" questions.',
  ],
  children: [
    {
      title: 'INNER JOIN',
      level: 'beginner',
      summary: 'Returns only rows that have a match in both tables.',
      simple: 'Matching socks: you only keep pairs. A sock with no partner is left out.',
      points: [
        'Join condition goes in <code>ON</code>: <code>ON o.customer_id = c.id</code>.',
        'Short table aliases (<code>o</code>, <code>c</code>) keep queries readable.',
        'A one-to-many join repeats the "one" side for each match.',
        '<code>JOIN</code> alone means INNER JOIN.',
      ],
      detail: `<pre><code>SELECT c.name, o.id, o.amount
FROM customers c
JOIN orders o ON o.customer_id = c.id;</code></pre>`,
    },
    {
      title: 'LEFT JOIN',
      level: 'beginner',
      summary:
        'Keeps every row from the left table; columns from the right are NULL when there’s no match.',
      simple:
        'A class list with test scores next to names. Students who skipped the test still appear, just with an empty score.',
      points: [
        'Use for "all customers, with their orders if any".',
        'Filter on the right table in <code>ON</code>, not WHERE, or you turn it back into an inner join.',
        '<code>LEFT JOIN … WHERE right.id IS NULL</code> finds rows with no match.',
      ],
      detail: `<pre><code>-- Customers and their 2026 orders (customers without any still show)
SELECT c.name, o.id
FROM customers c
LEFT JOIN orders o
  ON o.customer_id = c.id
 AND o.created_at &gt;= '2026-01-01';</code></pre>`,
      tip: 'A WHERE condition on the right table of a LEFT JOIN is the #1 "where did my rows go?" bug.',
    },
    {
      title: 'RIGHT & FULL JOIN',
      level: 'intermediate',
      summary:
        'RIGHT keeps all rows from the right table; FULL keeps unmatched rows from both sides.',
      simple: 'FULL JOIN is two guest lists merged: everyone shows up, matched where possible.',
      points: [
        'RIGHT JOIN is a LEFT JOIN with the tables swapped; most people just write LEFT.',
        'FULL OUTER JOIN is handy for comparing two data sets.',
        'Both PostgreSQL and SQL Server support all of them.',
      ],
    },
    {
      title: 'CROSS & SELF JOIN',
      level: 'intermediate',
      summary: 'CROSS JOIN pairs every row with every row; a self join joins a table to itself.',
      simple:
        'CROSS JOIN is every shirt with every pair of pants. A self join is looking up your manager in the same staff list.',
      points: [
        'CROSS JOIN of 1,000 × 1,000 rows gives 1,000,000 rows. Use with care.',
        'Good for generating combinations, like every product × every month.',
        'Self join needs two aliases of the same table.',
      ],
      detail: `<pre><code>SELECT e.name AS employee, m.name AS manager
FROM employees e
LEFT JOIN employees m ON m.id = e.manager_id;</code></pre>`,
    },
    {
      title: 'Semi Join: EXISTS',
      level: 'intermediate',
      summary:
        'Return rows from one table that have at least one match in another, without duplicates.',
      simple:
        '"Show customers who ordered something". You only care that an order exists, not how many.',
      points: [
        '<code>WHERE EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id)</code>.',
        'Stops at the first match, and never duplicates the outer row.',
        '<code>IN (subquery)</code> does the same job; both optimizers usually treat them alike.',
      ],
    },
    {
      title: 'Anti Join: NOT EXISTS',
      level: 'intermediate',
      summary: 'Return rows that have no match in another table.',
      simple: '"Customers who never ordered". The opposite of EXISTS.',
      points: [
        'Prefer <code>NOT EXISTS</code> over <code>NOT IN</code>.',
        '<code>NOT IN</code> returns nothing if the subquery has even one NULL.',
        '<code>LEFT JOIN … WHERE o.id IS NULL</code> is another safe option.',
      ],
      detail: `<pre><code>SELECT c.*
FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.customer_id = c.id
);</code></pre>`,
    },
    {
      title: 'UNION, INTERSECT, EXCEPT',
      level: 'intermediate',
      summary: 'Stack or compare the results of two queries with the same columns.',
      simple:
        'UNION puts two lists together; INTERSECT keeps what’s on both; EXCEPT keeps what’s only on the first.',
      points: [
        '<code>UNION</code> removes duplicates (costs a sort); <code>UNION ALL</code> keeps them and is faster.',
        'Both queries need the same number of columns with compatible types.',
        'All three work the same in PostgreSQL and SQL Server.',
      ],
      tip: 'Default to UNION ALL unless you really need duplicates removed.',
    },
    {
      title: 'Join Fan-out',
      level: 'intermediate',
      summary: 'Joining two one-to-many tables at once multiplies rows and inflates totals.',
      simple:
        'If you photocopy every order once per address, adding up the copies gives a wrong total.',
      points: [
        'Customer with 3 orders and 2 addresses → 6 rows after joining both.',
        '<code>SUM(o.amount)</code> on that result counts each order twice.',
        'Fix: aggregate each child table in a subquery or CTE first, then join.',
      ],
    },
  ],
};
