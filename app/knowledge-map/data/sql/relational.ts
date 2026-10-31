import type { KmNode } from '../../types';

export const relational: KmNode = {
  title: 'Relational Basics',
  level: 'beginner',
  summary: 'How a relational database stores data: tables, rows, columns, keys and NULL.',
  simple:
    'A database is a set of spreadsheets that know about each other. Each sheet is a table, each line is a row, and IDs link lines across sheets.',
  points: [
    'Data lives in tables; each table holds one kind of thing (customers, orders).',
    'Keys identify rows and link tables together.',
    'SQL is the language you use to ask questions and change the data.',
  ],
  children: [
    {
      title: 'Tables, Rows, Columns',
      level: 'beginner',
      summary: 'A table is a grid: columns define the fields, rows hold one record each.',
      simple:
        'Like a class register: the columns are "name", "age", "grade", and every student gets one row.',
      points: [
        'Every column has a name and a data type (number, text, date…).',
        'Rows have no built-in order; you get order only with <code>ORDER BY</code>.',
        'A good table describes one thing; don’t mix customers and orders in one table.',
        'This topic covers PostgreSQL and SQL Server. Most SQL is shared; differences are labelled.',
      ],
    },
    {
      title: 'Primary Key',
      level: 'beginner',
      summary: 'A column (or set of columns) that uniquely identifies each row and is never NULL.',
      simple: 'Like a passport number: no two people share it, and everyone has one.',
      points: [
        'One primary key per table; the database enforces it is unique and not NULL.',
        'Surrogate key: a generated id with no meaning (identity column or UUID).',
        'Natural key: a real-world value like an ISBN. It can change, which hurts.',
        'SQL Server makes the primary key the clustered index by default; PostgreSQL just adds a normal index.',
      ],
    },
    {
      title: 'Foreign Key',
      level: 'beginner',
      summary: 'A column that points to the primary key of another table, linking the two.',
      simple:
        'An order slip that says "customer #42". The number points to the customer’s card in the other drawer.',
      points: [
        'Example: <code>orders.customer_id</code> references <code>customers.id</code>.',
        'The database blocks orders that point to a customer who doesn’t exist.',
        'One customer, many orders: that’s a one-to-many relationship.',
        'Many-to-many (students ↔ courses) needs a join table with two foreign keys.',
      ],
    },
    {
      title: 'NULL',
      level: 'beginner',
      summary: 'A special marker meaning "unknown" or "missing", not zero and not an empty string.',
      simple:
        'NULL is a blank on a form. You can’t say a blank equals another blank; you just don’t know what’s there.',
      points: [
        'Any comparison with NULL gives UNKNOWN, not true: <code>NULL = NULL</code> is not true.',
        'Test with <code>IS NULL</code> / <code>IS NOT NULL</code>.',
        'Math with NULL gives NULL: <code>5 + NULL</code> is NULL.',
        '<code>COALESCE(a, b)</code> returns the first non-NULL value (works in both). SQL Server also has <code>ISNULL(a, b)</code>.',
        'In both databases an empty string is a real value, not NULL.',
      ],
      tip: 'Use NOT NULL on every column that must always have a value. Fewer NULLs, fewer surprises.',
    },
    {
      title: 'Parts of SQL',
      level: 'beginner',
      summary:
        'SQL commands fall into groups: querying, changing data, defining tables and controlling access.',
      simple:
        'Think of SQL as a toolbox with drawers: one for asking, one for changing, one for building.',
      points: [
        'DQL: <code>SELECT</code>. DML: <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>.',
        'DDL: <code>CREATE</code>, <code>ALTER</code>, <code>DROP</code> (define structure).',
        'TCL / DCL: <code>COMMIT</code>, <code>ROLLBACK</code>; <code>GRANT</code>, <code>REVOKE</code>.',
        'SQL Server’s dialect is T-SQL; PostgreSQL’s procedural language is PL/pgSQL.',
        'SQL is declarative: you say what you want, the database decides how to get it.',
      ],
    },
  ],
};

export const querying: KmNode = {
  title: 'Querying Data',
  level: 'beginner',
  summary: 'Read data with SELECT: pick columns, filter rows, sort, limit and handle NULL.',
  simple:
    'SELECT is how you ask the database a question: "show me these columns, from this table, for rows like this, sorted like that".',
  points: [
    'Every query starts from <code>SELECT … FROM …</code>.',
    'WHERE filters rows; ORDER BY sorts; LIMIT / TOP / FETCH cuts the result.',
    'Learn the logical order of a query early; it explains many errors.',
  ],
  children: [
    {
      title: 'SELECT & FROM',
      level: 'beginner',
      summary: 'Choose which columns to return from which table.',
      simple: 'Like telling a librarian: "from the books shelf, bring me only titles and authors".',
      points: [
        'List columns: <code>SELECT name, email FROM customers</code>.',
        '<code>SELECT *</code> returns every column; fine for exploring, avoid in app code.',
        'Rename with an alias: <code>SELECT price * qty AS total</code>.',
        'Strings use single quotes. Quote odd identifiers with <code>"order"</code> (PostgreSQL) or <code>[order]</code> (SQL Server).',
        'SQL Server: prefix Unicode literals with N: <code>N&#39;Hà Nội&#39;</code>.',
      ],
      detail: `<pre><code>SELECT id, name, price * 1.1 AS price_with_tax
FROM products;</code></pre>`,
    },
    {
      title: 'WHERE',
      level: 'beginner',
      summary: 'Keeps only the rows that match a condition.',
      simple: 'A sieve: only rows that pass the test fall through into your result.',
      points: [
        'Comparisons: <code>=</code>, <code>&lt;&gt;</code> (not equal), <code>&lt;</code>, <code>&gt;=</code>…',
        'Combine with <code>AND</code>, <code>OR</code>, <code>NOT</code>; use brackets to be clear.',
        '<code>IN (1, 2, 3)</code>, <code>BETWEEN 10 AND 20</code> (both ends included).',
        '<code>LIKE &#39;Jo%&#39;</code>: <code>%</code> = any text, <code>_</code> = one character.',
      ],
      detail: `<pre><code>SELECT name, city
FROM customers
WHERE country = 'VN'
  AND (city = 'Hanoi' OR city = 'Da Nang')
  AND name LIKE 'N%';</code></pre>`,
      tip: 'AND binds tighter than OR. When you mix them, always add brackets.',
    },
    {
      title: 'Case Sensitivity',
      level: 'intermediate',
      summary:
        'PostgreSQL compares text case-sensitively; SQL Server follows the column’s collation, usually case-insensitive.',
      simple:
        'In PostgreSQL "Lan" and "lan" are different words. In a default SQL Server install they count as the same.',
      points: [
        'PostgreSQL: <code>LIKE</code> is case-sensitive; use <code>ILIKE</code> or <code>LOWER(x)</code> for case-insensitive.',
        'PostgreSQL: the <code>citext</code> type or a nondeterministic collation makes a column case-insensitive.',
        'SQL Server: default collations end in <code>_CI_AS</code> (case-insensitive, accent-sensitive).',
        'SQL Server: force it per query with <code>COLLATE Latin1_General_CS_AS</code>.',
      ],
      detail: `<pre><code>-- PostgreSQL
SELECT * FROM users WHERE email ILIKE 'lan@%';

-- SQL Server (CI collation: already case-insensitive)
SELECT * FROM users WHERE email LIKE 'lan@%';</code></pre>`,
    },
    {
      title: 'ORDER BY',
      level: 'beginner',
      summary: 'Sorts the result by one or more columns, ascending or descending.',
      simple: 'Like sorting a spreadsheet: first by last name, then by first name for ties.',
      points: [
        '<code>ORDER BY created_at DESC, id</code>: newest first, ties broken by id.',
        'Without ORDER BY the row order is not guaranteed, even if it looks stable.',
        'NULLs sort last in ASC in PostgreSQL, first in SQL Server.',
        'PostgreSQL has <code>NULLS FIRST/LAST</code>; SQL Server needs <code>ORDER BY CASE WHEN x IS NULL THEN 1 ELSE 0 END, x</code>.',
      ],
    },
    {
      title: 'LIMIT, TOP & FETCH',
      level: 'beginner',
      summary: 'Return only the first N rows, or skip some rows first.',
      simple: 'Show me the top 10. Or: skip the first 20, then show me 10 (page 3).',
      points: [
        'PostgreSQL: <code>LIMIT 10 OFFSET 20</code>.',
        'SQL Server: <code>SELECT TOP (10)</code>, or <code>OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY</code> (needs ORDER BY).',
        'The standard <code>OFFSET … FETCH</code> form also works in PostgreSQL.',
        'Always combine with ORDER BY, or "the first 10" is random.',
      ],
      detail: `<pre><code>-- PostgreSQL
SELECT * FROM orders ORDER BY id LIMIT 10 OFFSET 20;

-- SQL Server
SELECT TOP (10) * FROM orders ORDER BY id;
SELECT * FROM orders ORDER BY id
OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;</code></pre>`,
      tip: 'Big OFFSETs are slow: the database still reads and throws away every skipped row. See keyset pagination.',
    },
    {
      title: 'DISTINCT',
      level: 'beginner',
      summary: 'Removes duplicate rows from the result.',
      simple: 'Like asking "which cities do our customers live in?" and getting each city once.',
      points: [
        '<code>SELECT DISTINCT city FROM customers</code>.',
        'Applies to the whole row, not just the first column.',
        'Needs sorting or hashing, so it costs time on big results.',
        'If you need DISTINCT to "fix" a join, the join is probably wrong.',
      ],
    },
    {
      title: 'Three-Valued Logic',
      level: 'intermediate',
      summary: 'SQL conditions can be TRUE, FALSE or UNKNOWN; WHERE keeps only TRUE.',
      simple:
        'A "maybe" never gets you through the door. If the answer is unknown, the row is filtered out.',
      points: [
        '<code>WHERE status &lt;&gt; &#39;paid&#39;</code> skips rows where status is NULL.',
        'Include them explicitly: <code>OR status IS NULL</code>.',
        '<code>NOT IN (…)</code> with a NULL in the list returns no rows at all.',
        'Null-safe compare <code>IS [NOT] DISTINCT FROM</code>: PostgreSQL always, SQL Server since 2022.',
      ],
      tip: 'Interview favourite: "Why does WHERE x <> 5 miss some rows?" Because rows where x is NULL give UNKNOWN.',
    },
    {
      title: 'CASE Expressions',
      level: 'intermediate',
      summary: 'If/else inside a query: return different values based on conditions.',
      simple:
        'A little decision table right in your SELECT: "if amount > 1000 then big, else small".',
      points: [
        'Works anywhere an expression works: SELECT, WHERE, ORDER BY, inside aggregates.',
        'First matching WHEN wins; without ELSE you get NULL.',
        'Conditional counts: <code>COUNT(*) FILTER (WHERE paid)</code> (PostgreSQL) or <code>SUM(CASE WHEN paid = 1 THEN 1 ELSE 0 END)</code> (both).',
        'SQL Server also has the shorthand <code>IIF(cond, a, b)</code>.',
      ],
      detail: `<pre><code>SELECT id,
  CASE
    WHEN amount &gt;= 1000 THEN 'big'
    WHEN amount &gt;= 100  THEN 'medium'
    ELSE 'small'
  END AS size
FROM orders;</code></pre>`,
    },
    {
      title: 'Common Functions',
      level: 'beginner',
      summary:
        'Built-in helpers for text, numbers and dates; names often differ between the two databases.',
      simple: 'Small calculators built into SQL: join text, round numbers, get today’s date.',
      points: [
        'Concat: <code>||</code> (PostgreSQL), <code>+</code> (SQL Server); <code>CONCAT()</code> works in both and skips NULLs.',
        'Now: <code>now()</code> (PostgreSQL), <code>SYSDATETIME()</code> / <code>GETDATE()</code> (SQL Server).',
        'Date parts: <code>EXTRACT(YEAR FROM d)</code> / <code>date_trunc</code> vs <code>YEAR(d)</code> / <code>DATEPART</code> / <code>DATETRUNC</code> (2022+).',
        'Add time: <code>d + INTERVAL &#39;7 days&#39;</code> vs <code>DATEADD(day, 7, d)</code>.',
        '<code>GREATEST</code>/<code>LEAST</code>: PostgreSQL always, SQL Server since 2022.',
        'Split text: <code>string_to_table</code> / <code>regexp_split_to_table</code> (PG) vs <code>STRING_SPLIT</code> (ordinal column since 2022).',
      ],
      detail: `<pre><code>-- PostgreSQL
SELECT first_name || ' ' || last_name, EXTRACT(YEAR FROM hired_at)
FROM employees;

-- SQL Server
SELECT first_name + ' ' + last_name, YEAR(hired_at)
FROM employees;</code></pre>`,
    },
    {
      title: 'Logical Query Order',
      level: 'intermediate',
      summary: 'The database evaluates clauses in a different order than you write them.',
      simple:
        'You write SELECT first, but the database first picks the table, then filters, then groups, and only then chooses the columns.',
      points: [
        'Order: FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT/TOP.',
        'That’s why WHERE can’t use a SELECT alias, but ORDER BY can.',
        'And why WHERE can’t filter on aggregates; HAVING can.',
        'This is the logical order; the optimizer may run things differently as long as the result is the same.',
      ],
      tip: 'When you get "column does not exist" (PG) or "Invalid column name" (SQL Server) for an alias, check this order first.',
    },
  ],
};
