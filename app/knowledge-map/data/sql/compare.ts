import type { KmNode } from '../../types';

export const comparison: KmNode = {
  title: 'PostgreSQL vs SQL Server',
  level: 'intermediate',
  summary:
    'A side-by-side cheat sheet of the two databases, plus the pitfalls and interview queries that come up everywhere.',
  simple:
    'Same language, two accents. Learn the shared core once, then keep this page handy for the words each one says differently.',
  points: [
    'Core SELECT / JOIN / GROUP BY / window functions are the same.',
    'Biggest differences: limiting rows, types, upserts, and the concurrency model.',
    'Interview queries are mostly window functions and joins in disguise.',
  ],
  children: [
    {
      title: 'Choosing Between Them',
      level: 'intermediate',
      summary:
        'Both are mature, fast relational databases; the choice is mostly ecosystem, licence and team skills.',
      simple:
        'PostgreSQL is a free, endlessly extendable workshop. SQL Server is a polished, paid toolkit that fits neatly into the Microsoft world.',
      points: [
        'PostgreSQL: open source, free, runs anywhere, huge extension ecosystem (PostGIS, pgvector, TimescaleDB).',
        'SQL Server: commercial (free Express/Developer editions), strong tooling (SSMS), deep .NET/Azure/Power BI integration.',
        'Tools: psql, pgAdmin, DBeaver vs SSMS, VS Code mssql extension.',
        'Managed: Amazon RDS / Aurora, Azure Database for PostgreSQL, Supabase vs Azure SQL Database / Managed Instance.',
      ],
    },
    {
      title: 'Syntax Side by Side',
      level: 'intermediate',
      summary: 'The everyday differences you’ll hit first when switching between the two.',
      simple: 'A phrasebook: the same sentence said the PostgreSQL way and the SQL Server way.',
      points: [
        'First N rows: <code>LIMIT 10</code> vs <code>TOP (10)</code>; both have <code>OFFSET … FETCH</code> (SQL Server needs ORDER BY).',
        'Concat: <code>a || b</code> vs <code>a + b</code>; <code>CONCAT()</code> in both.',
        'Identifiers: <code>"Order"</code> vs <code>[Order]</code>. PG folds unquoted names to lowercase.',
        'Case-insensitive search: <code>ILIKE</code> vs a <code>_CI_</code> collation.',
        'New ids back: <code>RETURNING</code> vs <code>OUTPUT inserted.*</code>; upsert: <code>ON CONFLICT</code> vs <code>MERGE</code>.',
        'Temp tables: <code>CREATE TEMP TABLE</code> vs <code>#temp</code>; recursion: <code>WITH RECURSIVE</code> vs <code>WITH</code>.',
      ],
      detail: `<pre><code>-- PostgreSQL
SELECT name || ' (' || email || ')' AS label
FROM users WHERE name ILIKE 'an%'
ORDER BY created_at DESC LIMIT 5;

-- SQL Server
SELECT TOP (5) name + ' (' + email + ')' AS label
FROM users WHERE name LIKE 'an%'
ORDER BY created_at DESC;</code></pre>`,
    },
    {
      title: 'Concurrency Side by Side',
      level: 'advanced',
      summary:
        'PostgreSQL is MVCC everywhere; SQL Server locks by default unless you turn on row versioning.',
      points: [
        'Default reads: PG readers never block writers; SQL Server READ COMMITTED takes shared locks (unless RCSI is on).',
        'Cleanup: VACUUM / autovacuum (PG) vs tempdb version store or ADR (SQL Server).',
        'Row locks: <code>FOR UPDATE</code> vs <code>WITH (UPDLOCK, ROWLOCK)</code>; skip locked: <code>SKIP LOCKED</code> vs <code>READPAST</code>.',
        'Errors in a transaction: PG aborts it entirely; SQL Server needs <code>XACT_ABORT ON</code> to behave the same.',
        'Deadlock error: 40P01 (PG) vs 1205 (SQL Server); retry both.',
      ],
      tip: 'If you move an app from PostgreSQL to SQL Server and see sudden blocking, check READ_COMMITTED_SNAPSHOT first.',
    },
    {
      title: 'Common Pitfalls',
      level: 'intermediate',
      summary: 'Mistakes that produce wrong results or slow queries without any error.',
      simple:
        'The query runs, the numbers look fine, and they’re wrong. These are the usual reasons.',
      points: [
        '<code>= NULL</code> instead of <code>IS NULL</code>; <code>NOT IN</code> with NULLs.',
        'WHERE on the right table of a LEFT JOIN turns it into an INNER JOIN.',
        'Join fan-out doubling SUMs; DISTINCT used to hide it.',
        'Integer division: <code>1 / 2 = 0</code> in both databases; cast one side to numeric.',
        'SQL Server: <code>WITH (NOLOCK)</code> everywhere "for speed" reads dirty and even duplicated rows.',
        'PostgreSQL: unquoted <code>MyTable</code> becomes <code>mytable</code>; quoted names must match case exactly.',
      ],
    },
    {
      title: 'Nth Highest Salary',
      level: 'intermediate',
      summary: 'Find the Nth highest distinct value; the most asked SQL interview question.',
      simple: 'Rank the salaries without gaps, then pick the one at position N.',
      points: [
        'Use <code>DENSE_RANK</code> so equal salaries share a place; this works in both databases.',
        'Alternative: distinct salaries, ORDER BY DESC, then skip N-1 with <code>OFFSET</code>.',
        'Mention what happens if there are fewer than N salaries (no row).',
      ],
      detail: `<pre><code>-- 3rd highest salary per department (both databases)
WITH r AS (
  SELECT dept_id, salary,
         DENSE_RANK() OVER (PARTITION BY dept_id
                            ORDER BY salary DESC) AS rnk
  FROM employees
)
SELECT DISTINCT dept_id, salary FROM r WHERE rnk = 3;</code></pre>`,
    },
    {
      title: 'Find & Remove Duplicates',
      level: 'intermediate',
      summary:
        'Find rows that repeat a value with GROUP BY + HAVING, and delete extras with ROW_NUMBER.',
      simple:
        'Count how many times each email appears; anything above one is a duplicate. Keep the oldest, remove the rest.',
      points: [
        'Find: <code>GROUP BY email HAVING COUNT(*) &gt; 1</code>.',
        'Delete: number rows per email, keep <code>rn = 1</code>, delete the others.',
        'SQL Server can delete straight through a CTE; PostgreSQL deletes by id.',
        'Then add a UNIQUE constraint so it can’t happen again.',
      ],
      detail: `<pre><code>-- PostgreSQL
DELETE FROM users WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
    FROM users) t
  WHERE rn &gt; 1);

-- SQL Server
WITH d AS (
  SELECT ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
  FROM users)
DELETE FROM d WHERE rn &gt; 1;</code></pre>`,
    },
    {
      title: 'Classic Questions',
      level: 'advanced',
      summary: 'Short answers to the theory questions that come up in most backend interviews.',
      points: [
        'WHERE vs HAVING; INNER vs LEFT JOIN; UNION vs UNION ALL; DELETE vs TRUNCATE vs DROP.',
        'Clustered vs non-clustered index; why not index every column.',
        'ACID and isolation levels with one anomaly each; MVCC vs locking.',
        'Optimistic vs pessimistic locking.',
        'How you’d debug a slow query: read the actual plan, check indexes and statistics, rewrite.',
        'SQL Server specials: parameter sniffing, NOLOCK risks. PostgreSQL specials: VACUUM, JSONB.',
      ],
      tip: 'For query questions, say your plan out loud first ("group, rank, then filter"), then write it. Interviewers care about the reasoning.',
    },
  ],
};
