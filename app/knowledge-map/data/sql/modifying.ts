import type { KmNode } from '../../types';

export const dml: KmNode = {
  title: 'Changing Data',
  level: 'beginner',
  summary: 'Add, change and remove rows with INSERT, UPDATE, DELETE and upserts.',
  simple:
    'SELECT only looks. These commands actually write in the notebook, so double-check before you press Enter.',
  points: [
    'INSERT adds rows, UPDATE changes them, DELETE removes them.',
    'UPDATE and DELETE without WHERE hit every row in the table.',
    'Run risky changes inside a transaction so you can roll back.',
  ],
  children: [
    {
      title: 'INSERT',
      level: 'beginner',
      summary: 'Adds one or more new rows to a table.',
      simple: 'Writing a new line at the bottom of the sheet.',
      points: [
        'Always list the columns; don’t rely on column order.',
        'Insert many rows in one statement for speed (SQL Server: max 1,000 rows per VALUES list).',
        '<code>INSERT … SELECT</code> copies rows from a query.',
        'Columns you skip get their DEFAULT value (or NULL).',
      ],
      detail: `<pre><code>INSERT INTO customers (name, email)
VALUES ('Lan', 'lan@example.com'),
       ('Minh', 'minh@example.com');</code></pre>`,
    },
    {
      title: 'UPDATE',
      level: 'beginner',
      summary: 'Changes column values in rows that match a WHERE condition.',
      simple: 'Rubbing out a value and writing a new one, on every row the condition picks.',
      points: [
        'Forget WHERE and you update every row.',
        'Can use the old value: <code>SET stock = stock - 1</code>.',
        'Updating from another table is written differently in each database (see below).',
        'Run the same WHERE as a SELECT first to see which rows you’ll touch.',
      ],
      detail: `<pre><code>-- PostgreSQL
UPDATE orders o SET status = 'vip'
FROM customers c
WHERE c.id = o.customer_id AND c.tier = 'gold';

-- SQL Server
UPDATE o SET status = 'vip'
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE c.tier = 'gold';</code></pre>`,
      tip: 'Start risky changes with BEGIN, check the row count, then COMMIT or ROLLBACK.',
    },
    {
      title: 'DELETE vs TRUNCATE vs DROP',
      level: 'beginner',
      summary:
        'DELETE removes chosen rows, TRUNCATE empties the table fast, DROP removes the table itself.',
      simple:
        'DELETE: erase some lines. TRUNCATE: tear out every page but keep the notebook. DROP: throw the notebook away.',
      points: [
        '<code>DELETE FROM t WHERE …</code>: row by row, fires triggers, fully logged.',
        '<code>TRUNCATE TABLE t</code>: very fast; can be rolled back inside a transaction in both databases.',
        'Identity: SQL Server TRUNCATE resets it; PostgreSQL only with <code>RESTART IDENTITY</code>.',
        'Referenced by a foreign key: SQL Server refuses TRUNCATE; PostgreSQL needs <code>CASCADE</code>.',
        '<code>DROP TABLE t</code>: removes data and structure.',
      ],
    },
    {
      title: 'Upsert',
      level: 'intermediate',
      summary: 'Insert a row, or update it if it already exists, in one statement.',
      simple: '"Add this contact; if they’re already in the phone book, just update the number."',
      points: [
        'PostgreSQL: <code>INSERT … ON CONFLICT (key) DO UPDATE</code>, atomic and race-safe.',
        'PostgreSQL 15+ and SQL Server: <code>MERGE</code> for bigger sync jobs.',
        'SQL Server MERGE is not race-safe by default: add <code>WITH (HOLDLOCK)</code>, and know it has had bugs.',
        'Needs a UNIQUE constraint or primary key to detect the conflict.',
      ],
      detail: `<pre><code>-- PostgreSQL
INSERT INTO stock (product_id, qty) VALUES (7, 5)
ON CONFLICT (product_id)
DO UPDATE SET qty = stock.qty + EXCLUDED.qty;

-- SQL Server
MERGE stock WITH (HOLDLOCK) AS t
USING (VALUES (7, 5)) AS s (product_id, qty)
  ON t.product_id = s.product_id
WHEN MATCHED THEN UPDATE SET qty = t.qty + s.qty
WHEN NOT MATCHED THEN INSERT (product_id, qty) VALUES (s.product_id, s.qty);</code></pre>`,
      tip: 'Many SQL Server teams prefer UPDATE, then INSERT if @@ROWCOUNT = 0, inside a transaction with UPDLOCK, HOLDLOCK.',
    },
    {
      title: 'RETURNING & OUTPUT',
      level: 'intermediate',
      summary:
        'Get back the inserted, updated or deleted rows (like a generated id) in the same statement.',
      simple: 'Like getting a receipt with your order number right when you hand in the order.',
      points: [
        'PostgreSQL: <code>RETURNING id</code>; PostgreSQL 18 adds <code>OLD</code> / <code>NEW</code> values.',
        'SQL Server: <code>OUTPUT inserted.id</code> (and <code>deleted.*</code> for old values).',
        'SQL Server <code>SCOPE_IDENTITY()</code> returns the last identity in the current scope (avoid <code>@@IDENTITY</code>).',
        'Saves a second round trip to the database.',
      ],
      detail: `<pre><code>-- PostgreSQL
INSERT INTO orders (customer_id, amount) VALUES (42, 99) RETURNING id;

-- SQL Server
INSERT INTO orders (customer_id, amount) OUTPUT inserted.id VALUES (42, 99);</code></pre>`,
    },
    {
      title: 'Soft Delete',
      level: 'intermediate',
      summary: 'Mark rows as deleted (deleted_at column) instead of really removing them.',
      simple: 'Putting a file in the recycle bin instead of shredding it.',
      points: [
        'Lets you undo and keep history for audits.',
        'Every query must remember <code>WHERE deleted_at IS NULL</code>; easy to forget.',
        'Keep emails unique among live rows with a partial (PG) / filtered (SQL Server) unique index.',
        'SQL Server temporal tables keep full row history automatically.',
      ],
    },
  ],
};

export const schema: KmNode = {
  title: 'Schema Design',
  level: 'intermediate',
  summary: 'Create tables with good types and constraints, and organise data with normalization.',
  simple:
    'Designing a schema is like designing the drawers of a filing cabinet. Good drawers make finding and updating things easy; bad ones make a mess forever.',
  points: [
    'Choose the smallest correct data type for each column.',
    'Let constraints protect your data, not just app code.',
    'Normalize first; denormalize only for proven read performance needs.',
  ],
  children: [
    {
      title: 'CREATE TABLE & Types',
      level: 'beginner',
      summary:
        'Define a table’s columns, data types and defaults; type names differ between the two.',
      simple:
        'You draw the empty form first: which boxes exist, and what kind of value fits in each.',
      points: [
        'Money: <code>NUMERIC(10,2)</code> / <code>DECIMAL(10,2)</code> in both. Never FLOAT.',
        'Text: <code>TEXT</code>/<code>VARCHAR</code> (PG, always Unicode) vs <code>NVARCHAR(n)</code>/<code>NVARCHAR(MAX)</code> for Unicode in SQL Server.',
        'Boolean: <code>BOOLEAN</code> (PG) vs <code>BIT</code> (SQL Server, 0/1).',
        'Time: <code>timestamptz</code> (PG) vs <code>datetime2</code> / <code>datetimeoffset</code> (SQL Server).',
        'Ids: <code>GENERATED ALWAYS AS IDENTITY</code> (PG 10+, preferred over <code>SERIAL</code>) vs <code>IDENTITY(1,1)</code>.',
      ],
      detail: `<pre><code>-- PostgreSQL
CREATE TABLE orders (
  id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  note    TEXT,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  created TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- SQL Server
CREATE TABLE orders (
  id      BIGINT IDENTITY(1,1) PRIMARY KEY,
  note    NVARCHAR(MAX),
  is_paid BIT NOT NULL DEFAULT 0,
  created DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);</code></pre>`,
    },
    {
      title: 'Constraints',
      level: 'beginner',
      summary:
        'Rules the database enforces on every write: NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK.',
      simple:
        'Bouncers at the door. Bad data doesn’t get in, no matter which app tries to write it.',
      points: [
        '<code>NOT NULL</code>, <code>CHECK (amount &gt;= 0)</code>, <code>FOREIGN KEY</code>: same in both.',
        'UNIQUE and NULL differ: PostgreSQL allows many NULLs (PG 15+: <code>NULLS NOT DISTINCT</code> to allow one).',
        'SQL Server UNIQUE allows only one NULL; use a filtered unique index <code>WHERE col IS NOT NULL</code> for many.',
        'Constraints catch bugs that slip past app validation, including race conditions.',
      ],
    },
    {
      title: 'Foreign Key Actions',
      level: 'intermediate',
      summary: 'What happens to child rows when the parent is deleted or its key changes.',
      simple:
        'If you delete a customer, do their orders disappear too, block the delete, or lose their link?',
      points: [
        '<code>NO ACTION</code> (default): block the delete. PostgreSQL also has <code>RESTRICT</code>.',
        '<code>ON DELETE CASCADE</code>: delete children too. Powerful, can remove a lot by accident.',
        '<code>SET NULL</code> / <code>SET DEFAULT</code>: keep children, clear the link.',
        'SQL Server rejects designs with multiple cascade paths to one table.',
        'Neither database indexes FK columns for you; add the index or parent deletes get slow.',
      ],
    },
    {
      title: 'Normalization',
      level: 'intermediate',
      summary:
        'Organising tables so each fact is stored once, avoiding duplicate and conflicting data.',
      simple:
        'Write each customer’s address in one place. If it’s copied onto every order, changing it means hunting down every copy.',
      points: [
        'Goal: no update, insert or delete anomalies.',
        '3NF is enough for most business apps.',
        'Short rule: every non-key column depends on "the key, the whole key, and nothing but the key".',
      ],
      children: [
        {
          title: '1NF',
          level: 'intermediate',
          summary: 'Every column holds one atomic value; no lists or repeating groups.',
          simple: 'One box, one value. No "phone1, phone2, phone3" columns or comma lists.',
          points: [
            'Bad: <code>tags = &#39;red,blue,green&#39;</code>.',
            'Good: a separate <code>product_tags</code> table, one row per tag.',
          ],
        },
        {
          title: '2NF',
          level: 'intermediate',
          summary: '1NF, and no column depends on only part of a composite key.',
          simple:
            'In an order_items table keyed by (order_id, product_id), the product name depends only on product_id, so it belongs in products.',
          points: ['Only matters when the primary key has more than one column.'],
        },
        {
          title: '3NF',
          level: 'intermediate',
          summary: '2NF, and no column depends on another non-key column.',
          simple:
            'If orders store customer_id and customer_city, the city depends on the customer, not the order. Move it to customers.',
          points: [
            'Removes "transitive" dependencies (A → B → C).',
            'BCNF is a slightly stricter version; rarely needed in practice.',
          ],
        },
      ],
    },
    {
      title: 'Denormalization',
      level: 'advanced',
      summary: 'Deliberately storing copies or pre-computed values to make reads faster.',
      points: [
        'Examples: an <code>order_count</code> column on customers, a copied product name on order lines.',
        'Price: you must keep copies in sync (triggers, app code, or events).',
        'Sometimes a copy is correct by design: the price at the time of the order.',
        'Try indexes and better queries first.',
      ],
    },
    {
      title: 'JSON Columns',
      level: 'intermediate',
      summary:
        'Store flexible, semi-structured data inside a column; PostgreSQL and SQL Server do this very differently.',
      simple:
        'A JSON column is a drawer for "miscellaneous" stuff. Handy, but if you search it all the time, it should probably be real columns.',
      points: [
        'PostgreSQL: <code>JSONB</code> (binary, indexable with GIN); operators <code>-&gt;</code>, <code>-&gt;&gt;</code>, <code>@&gt;</code>.',
        'SQL Server: JSON stored as <code>NVARCHAR</code>; read with <code>JSON_VALUE</code>, <code>JSON_QUERY</code>, <code>OPENJSON</code>.',
        'SQL Server 2025 adds a native <code>json</code> type (Azure SQL had it first).',
        'SQL Server: index a JSON field via a computed column plus an index.',
      ],
      detail: `<pre><code>-- PostgreSQL
SELECT id FROM events WHERE payload -&gt;&gt; 'type' = 'login';

-- SQL Server
SELECT id FROM events WHERE JSON_VALUE(payload, '$.type') = 'login';</code></pre>`,
    },
    {
      title: 'Views & Materialized Views',
      level: 'intermediate',
      summary:
        'A view is a saved query you use like a table; materialized/indexed views also store the result.',
      simple:
        'A view is a saved search. A materialized view is a printed copy of the results: fast to read, but someone has to keep it up to date.',
      points: [
        'Views simplify complex queries and can hide columns for security.',
        'PostgreSQL materialized views need <code>REFRESH MATERIALIZED VIEW [CONCURRENTLY]</code>.',
        'SQL Server indexed views (<code>WITH SCHEMABINDING</code> + clustered index) update automatically, but slow down writes.',
      ],
    },
    {
      title: 'Schema Migrations',
      level: 'advanced',
      summary:
        'Versioned scripts that change the schema step by step, run by tools like Flyway or Liquibase.',
      points: [
        'Every change is a numbered file in Git; never edit by hand in production.',
        'PostgreSQL DDL is transactional: a failed migration rolls back cleanly. SQL Server DDL is too, mostly.',
        'Build indexes without blocking writes: <code>CREATE INDEX CONCURRENTLY</code> (PG) vs <code>WITH (ONLINE = ON)</code> (SQL Server Enterprise / Azure).',
        'Expand → migrate → contract: add the new column, backfill, switch code, then drop the old one.',
      ],
    },
  ],
};
