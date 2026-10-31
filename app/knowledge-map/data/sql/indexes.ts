import type { KmNode } from '../../types';

export const indexes: KmNode = {
  title: 'Indexes & Query Plans',
  level: 'intermediate',
  summary: 'How indexes make queries fast, when they don’t help, and how to read a query plan.',
  simple:
    'An index is the index at the back of a book. Instead of reading every page to find "Kafka", you jump straight to page 212.',
  points: [
    'Indexes speed up reads but slow down writes and use disk.',
    'Column order in a composite index matters a lot.',
    'Read the plan (EXPLAIN in PostgreSQL, execution plan in SQL Server) before guessing.',
  ],
  children: [
    {
      title: 'What an Index Is',
      level: 'beginner',
      summary:
        'A separate sorted structure that lets the database find rows without scanning the whole table.',
      simple:
        'A phone book sorted by last name. Finding "Nguyen" is quick; finding everyone with a given phone number means reading it all.',
      points: [
        'Primary keys and UNIQUE constraints get an index automatically.',
        'Create others for columns used in WHERE, JOIN and ORDER BY.',
        'Every INSERT/UPDATE/DELETE must update every index, too.',
      ],
      detail: `<pre><code>CREATE INDEX idx_orders_customer
ON orders (customer_id);</code></pre>`,
    },
    {
      title: 'B-tree',
      level: 'intermediate',
      summary:
        'The default index type in both databases: a balanced, sorted tree for equality, ranges and sorting.',
      simple:
        'Like a dictionary with tabs: pick the right tab, then the right page, then the word. A few hops even for millions of rows.',
      points: [
        'Lookups take O(log n) steps; a table of a billion rows is only ~4–5 levels deep.',
        'Supports <code>=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>BETWEEN</code>, <code>LIKE &#39;abc%&#39;</code> and ORDER BY.',
        'Can’t help with <code>LIKE &#39;%abc&#39;</code> (leading wildcard).',
        'PostgreSQL: with a non-C collation, prefix LIKE needs a <code>text_pattern_ops</code> index.',
      ],
    },
    {
      title: 'Clustered Index vs Heap',
      level: 'intermediate',
      summary:
        'SQL Server usually stores the table itself sorted by the primary key; PostgreSQL stores rows unordered in a heap.',
      simple:
        'SQL Server files papers in the cabinet in id order. PostgreSQL drops them in any free drawer and keeps a separate index card to find them.',
      points: [
        'SQL Server: one clustered index per table (by default the PK); nonclustered indexes point to its key.',
        'A wide or random clustered key (like a random GUID) bloats every index and fragments inserts.',
        'PostgreSQL: every index points to a heap location; <code>CLUSTER</code> reorders once but isn’t kept up.',
        'SQL Server tables without a clustered index are heaps too; usually not what you want.',
      ],
    },
    {
      title: 'Composite Index',
      level: 'intermediate',
      summary:
        'An index on several columns; it’s sorted by the first column, then the second, and so on.',
      simple:
        'A phone book sorted by last name, then first name. Great for "Nguyen Lan", useless for "everyone named Lan".',
      points: [
        'Leftmost prefix rule: index (a, b, c) helps filters on a, a+b, a+b+c, not b alone.',
        'Put equality columns first, then range or sort columns.',
        'One good composite index often beats several single-column ones.',
        'PostgreSQL 18 adds skip scan, which can sometimes use (a, b) for filters on b alone.',
      ],
      detail: `<pre><code>CREATE INDEX idx_orders_cust_date
ON orders (customer_id, created_at);

-- uses the index well
SELECT * FROM orders
WHERE customer_id = 42
ORDER BY created_at DESC;</code></pre>`,
    },
    {
      title: 'Covering Index',
      level: 'advanced',
      summary:
        'An index that contains every column a query needs, so the table itself is never read.',
      points: [
        'Add extra columns with <code>INCLUDE (col)</code> (PostgreSQL 11+, SQL Server).',
        'PostgreSQL shows "Index Only Scan" (works best when the table is recently vacuumed).',
        'SQL Server shows an Index Seek with no Key Lookup.',
        'A reason to avoid <code>SELECT *</code> in hot queries.',
      ],
      detail: `<pre><code>-- same syntax in PostgreSQL and SQL Server
CREATE INDEX idx_orders_cust
ON orders (customer_id) INCLUDE (amount, status);</code></pre>`,
    },
    {
      title: 'Selectivity & Filtered Indexes',
      level: 'intermediate',
      summary:
        'Indexes help most when a condition picks a small fraction of rows; partial/filtered indexes cover just that fraction.',
      simple:
        'Asking for "people named Zbigniew" narrows a lot; asking for "people who are human" narrows nothing, so the index is useless.',
      points: [
        'High selectivity: email, id. Low: boolean flags, status with 3 values.',
        'If a query returns a big share of the table, a full scan can be faster.',
        'PostgreSQL partial index and SQL Server filtered index: <code>CREATE INDEX … WHERE status = &#39;pending&#39;</code>.',
        'SQL Server filtered indexes have limits (simple predicates; parameterized queries may not use them).',
      ],
    },
    {
      title: 'When Indexes Aren’t Used',
      level: 'intermediate',
      summary: 'Common query shapes that stop the database from using an index you created.',
      simple: 'You built the shortcut, but the way you asked the question forces the long road.',
      points: [
        'Functions on the column (not "SARGable"): <code>EXTRACT(YEAR FROM d)</code> (PG) or <code>YEAR(d)</code> (SQL Server).',
        'Type mismatch: SQL Server comparing a VARCHAR column to an NVARCHAR parameter can force a scan.',
        'Leading wildcard: <code>LIKE &#39;%son&#39;</code>.',
        'Skipping the first column of a composite index; stale statistics.',
        'Fix function cases with an expression index (PG) or an indexed computed column (SQL Server).',
      ],
      detail: `<pre><code>-- Can’t use an index on created_at
WHERE EXTRACT(YEAR FROM created_at) = 2026   -- PostgreSQL
WHERE YEAR(created_at) = 2026                -- SQL Server

-- Can (a range on the raw column, both databases)
WHERE created_at &gt;= '2026-01-01'
  AND created_at &lt;  '2027-01-01'</code></pre>`,
    },
    {
      title: 'Other Index Types',
      level: 'advanced',
      summary: 'Special index types for special data: JSON, full-text, geo, analytics.',
      points: [
        'PostgreSQL: GIN (JSONB, arrays, full-text), GiST (geo, ranges), BRIN (huge time-ordered tables), Hash.',
        'SQL Server: columnstore indexes for analytics (huge compression, batch mode).',
        'SQL Server: full-text, spatial and XML indexes.',
        'PostgreSQL extensions add more, e.g. pgvector for vector search.',
      ],
    },
    {
      title: 'Reading Query Plans',
      level: 'intermediate',
      summary: 'The plan shows which indexes, join order and row estimates the optimizer chose.',
      simple:
        'Asking your GPS to show the route before driving. The "actual" plan really drives it and tells you how long each part took.',
      points: [
        'PostgreSQL: <code>EXPLAIN</code> (estimate) and <code>EXPLAIN (ANALYZE, BUFFERS)</code> (runs it; BUFFERS on by default with ANALYZE in PG 18).',
        'SQL Server: "Include Actual Execution Plan" (Ctrl+M in SSMS) and <code>SET STATISTICS IO, TIME ON</code>.',
        'SQL Server Query Store keeps plan and runtime history so you can spot regressions.',
        'Big gaps between estimated and actual rows point to bad statistics.',
        'ANALYZE on UPDATE/DELETE really changes data; wrap it in a transaction and roll back.',
      ],
      detail: `<pre><code>-- PostgreSQL
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders WHERE customer_id = 42;

-- SQL Server
SET STATISTICS IO, TIME ON;
SELECT * FROM orders WHERE customer_id = 42;</code></pre>`,
    },
    {
      title: 'Scan Types',
      level: 'advanced',
      summary:
        'Full scans read everything; seeks/index scans jump to matching rows; lookups fetch missing columns.',
      points: [
        'Full read: Seq Scan (PG) vs Table Scan / Clustered Index Scan (SQL Server).',
        'Targeted: Index Scan (PG) vs Index Seek (SQL Server). Note: SQL Server "Index Scan" means reading the whole index.',
        'Fetching extra columns: heap fetch (PG) vs Key Lookup / RID Lookup (SQL Server).',
        'PostgreSQL also has Bitmap Heap Scan: collect matches, then read pages in order.',
      ],
    },
    {
      title: 'Join Algorithms',
      level: 'expert',
      summary:
        'Nested loop, hash join and merge join: three ways the database matches rows between tables.',
      points: [
        'Nested loop: for each outer row, look up matches (best with a small outer side + index on inner).',
        'Hash join: build a hash table on the smaller side, probe with the other. Great for big unsorted sets.',
        'Merge join: walk two sorted inputs side by side. Good when both are already sorted.',
        'SQL Server 2017+ adds adaptive joins that choose hash or nested loop at run time.',
      ],
    },
    {
      title: 'Statistics & Plan Caching',
      level: 'expert',
      summary:
        'The optimizer picks plans from statistics; cached plans can turn bad for different parameter values.',
      points: [
        'Refresh stats: <code>ANALYZE</code> (PG, also run by autovacuum) vs <code>UPDATE STATISTICS</code> (SQL Server, auto by default).',
        'SQL Server caches a plan built for the first parameter value: "parameter sniffing". Fixes: <code>OPTION (RECOMPILE)</code>, Query Store hints, PSP optimization (2022).',
        'PostgreSQL prepared statements may switch to a generic plan after 5 runs (<code>plan_cache_mode</code>).',
        'Correlated columns fool estimates; PostgreSQL has <code>CREATE STATISTICS</code> for that.',
      ],
      tip: '"Fast in SSMS, slow from the app" is the classic SQL Server parameter-sniffing symptom (different SET options give a different cached plan).',
    },
  ],
};
