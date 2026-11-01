import type { KmNode } from '../../types';

export const transactions: KmNode = {
  title: 'Transactions & Concurrency',
  level: 'intermediate',
  summary:
    'Group changes so they succeed or fail together, and keep data correct when many users write at once.',
  simple:
    'A bank transfer must take money from one account AND add it to the other. A transaction makes sure you never end up with only half done.',
  points: [
    'ACID describes the promises a transaction gives you.',
    'Isolation levels trade safety for speed when transactions overlap.',
    'PostgreSQL and SQL Server handle concurrency very differently by default; know both models.',
  ],
  children: [
    {
      title: 'Transaction Basics',
      level: 'beginner',
      summary: 'Start a unit of work, then COMMIT to save it or ROLLBACK to undo it.',
      simple:
        'Like a shopping cart: nothing is bought until you press "Pay". Leave the shop and the cart is emptied.',
      points: [
        'Both auto-commit each statement unless you start a transaction.',
        'PostgreSQL: after any error, the whole transaction is aborted until you ROLLBACK.',
        'SQL Server: many errors abort only the statement; use <code>SET XACT_ABORT ON</code> + <code>TRY…CATCH</code>.',
        'Keep transactions short; never wait for user input or slow HTTP calls inside one.',
      ],
      detail: `<pre><code>-- PostgreSQL
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- SQL Server
SET XACT_ABORT ON;
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;</code></pre>`,
    },
    {
      title: 'Savepoints',
      level: 'intermediate',
      summary: 'Bookmarks inside a transaction you can roll back to without undoing everything.',
      simple:
        'Like a save point in a video game: lose a fight and you restart from there, not from the very beginning.',
      points: [
        'PostgreSQL: <code>SAVEPOINT s1</code> … <code>ROLLBACK TO SAVEPOINT s1</code>.',
        'SQL Server: <code>SAVE TRANSACTION s1</code> … <code>ROLLBACK TRANSACTION s1</code>.',
        'In PostgreSQL this is how you keep a transaction alive after an expected error.',
        'JDBC: <code>conn.setSavepoint()</code>; Spring uses them for <code>Propagation.NESTED</code>.',
      ],
    },
    {
      title: 'ACID',
      level: 'intermediate',
      summary:
        'Atomicity, Consistency, Isolation, Durability: the four guarantees of a transaction.',
      simple:
        'All or nothing (A), rules are always respected (C), others don’t see your half-done work (I), and once saved it stays saved (D).',
      points: [
        'Atomicity: all statements succeed or none do.',
        'Consistency: constraints hold before and after.',
        'Isolation: concurrent transactions don’t step on each other (how much depends on the level).',
        'Durability: after COMMIT, data survives a crash (WAL in PostgreSQL, transaction log in SQL Server).',
      ],
      tip: 'Interview: give the bank transfer example and explain each letter with it.',
    },
    {
      title: 'Read Anomalies',
      level: 'intermediate',
      summary:
        'The bugs that can happen when transactions overlap: dirty, non-repeatable and phantom reads, and lost updates.',
      simple:
        'They are the ways one person’s unfinished or new work can confuse another person reading at the same time.',
      points: [
        'Each isolation level blocks some of these, and the two databases differ in the details.',
      ],
      children: [
        {
          title: 'Dirty Read',
          level: 'intermediate',
          summary: 'Reading another transaction’s changes before it commits.',
          simple: 'Reading a draft email someone hasn’t sent yet, and then they delete it.',
          points: [
            'PostgreSQL never allows it (READ UNCOMMITTED acts like READ COMMITTED).',
            'SQL Server allows it with READ UNCOMMITTED or <code>WITH (NOLOCK)</code>, which can also skip or double-read rows.',
          ],
        },
        {
          title: 'Non-repeatable Read',
          level: 'intermediate',
          summary:
            'Reading the same row twice and getting different values because someone committed in between.',
          simple: 'You check a price, look away, check again, and it changed.',
          points: ['Prevented from REPEATABLE READ upward in both databases.'],
        },
        {
          title: 'Phantom Read',
          level: 'intermediate',
          summary: 'Running the same query twice and getting new or missing rows.',
          simple: 'You count the people in the room, blink, and there’s one more.',
          points: [
            'PostgreSQL REPEATABLE READ already prevents it (snapshot).',
            'SQL Server REPEATABLE READ allows it; SERIALIZABLE (range locks) or SNAPSHOT prevents it.',
          ],
        },
        {
          title: 'Lost Update',
          level: 'advanced',
          summary:
            'Two transactions read the same value, both change it, and the second write overwrites the first.',
          points: [
            'Classic: two clicks both read stock = 5 and both write 4.',
            'Fix: <code>SET stock = stock - 1</code> (atomic), a row lock, or optimistic locking.',
            'PostgreSQL REPEATABLE READ and SQL Server SNAPSHOT detect it and fail the second writer; READ COMMITTED does not.',
          ],
        },
        {
          title: 'Write Skew',
          level: 'expert',
          summary:
            'Two transactions read the same data, each writes a different row, and together they break a rule.',
          simple:
            'Two doctors on call each see "the other one is still on call" and both go home. Each choice was fine alone; together, nobody is on call.',
          points: [
            'Snapshot-based levels (PG REPEATABLE READ, SQL Server SNAPSHOT) allow it.',
            'Only SERIALIZABLE prevents it, or locking the rows you read with <code>FOR UPDATE</code> / <code>UPDLOCK</code>.',
            'Also fixable with a constraint the database can check.',
          ],
          tip: 'This is why "snapshot isolation" is not the same as "serializable", a favourite senior interview point.',
        },
      ],
    },
    {
      title: 'Isolation Levels',
      level: 'advanced',
      summary:
        'READ UNCOMMITTED → READ COMMITTED → REPEATABLE READ → SERIALIZABLE, plus SQL Server’s SNAPSHOT.',
      points: [
        'Both default to READ COMMITTED, but PostgreSQL implements it with MVCC snapshots, SQL Server (on-prem) with shared locks.',
        'SQL Server: turn on <code>READ_COMMITTED_SNAPSHOT</code> (RCSI) so readers use row versions; on by default in Azure SQL Database.',
        'SQL Server <code>SNAPSHOT</code> isolation ≈ PostgreSQL REPEATABLE READ.',
        'SERIALIZABLE: PostgreSQL uses SSI (may abort with error 40001, retry); SQL Server uses range locks (more blocking).',
      ],
    },
    {
      title: 'MVCC & Row Versions',
      level: 'advanced',
      summary:
        'Keep several versions of a row so readers don’t block writers; where old versions live differs.',
      points: [
        'PostgreSQL: always MVCC; old row versions stay in the table until VACUUM (autovacuum) cleans them.',
        'SQL Server: versions only with RCSI/SNAPSHOT; stored in the tempdb version store (or in the user DB with Accelerated Database Recovery, 2019+).',
        'Readers never wait for writers; writers still block writers on the same row.',
        'Long-running transactions keep old versions alive: table bloat (PG) or a growing version store (SQL Server).',
      ],
      tip: 'Never turn off autovacuum in PostgreSQL. Tune it instead; bloat and transaction-ID wraparound are real outages.',
      children: [
        {
          title: 'VACUUM & Bloat',
          level: 'expert',
          summary:
            'PostgreSQL’s cleanup job that frees space from dead row versions and protects transaction IDs.',
          points: [
            'Every UPDATE writes a new row version; the old one becomes a dead tuple (a leftover row).',
            'Autovacuum marks that space reusable; plain VACUUM does not shrink the file.',
            '<code>VACUUM FULL</code> rewrites the table smaller but locks it; tools like pg_repack don’t.',
            'Also freezes old rows so 32-bit transaction IDs can wrap around safely.',
            'Watch <code>n_dead_tup</code> in <code>pg_stat_user_tables</code> and long-open transactions.',
          ],
          tip: 'SQL Server has no VACUUM; its equivalent chores are index rebuild/reorganize and the version-store cleanup.',
        },
      ],
    },
    {
      title: 'Row Locks',
      level: 'advanced',
      summary:
        'Lock rows you read so nobody else can change them until you commit (pessimistic locking).',
      points: [
        'PostgreSQL: <code>SELECT … FOR UPDATE</code>, plus <code>SKIP LOCKED</code> / <code>NOWAIT</code>.',
        'SQL Server: table hints <code>WITH (UPDLOCK, ROWLOCK)</code>; <code>READPAST</code> skips locked rows.',
        'SQL Server may escalate many row locks to a table lock (about 5,000 locks).',
        'Skipping locked rows makes a simple, safe job queue.',
      ],
      detail: `<pre><code>-- PostgreSQL
SELECT * FROM jobs WHERE status = 'pending'
ORDER BY id LIMIT 1
FOR UPDATE SKIP LOCKED;

-- SQL Server
SELECT TOP (1) * FROM jobs WITH (UPDLOCK, ROWLOCK, READPAST)
WHERE status = 'pending'
ORDER BY id;</code></pre>`,
    },
    {
      title: 'Optimistic Locking',
      level: 'advanced',
      summary:
        'No lock while reading; on update, check a version and fail if someone changed the row.',
      points: [
        'Add a <code>version</code> column; update with <code>WHERE id = ? AND version = ?</code>.',
        'SQL Server has a built-in <code>rowversion</code> column type that changes on every update.',
        '0 rows updated means someone else won; reload and retry or show a conflict.',
        'JPA does this with <code>@Version</code>.',
      ],
    },
    {
      title: 'Deadlocks',
      level: 'expert',
      summary:
        'Two transactions each wait for a lock the other holds; the database kills one of them.',
      points: [
        'A locks row 1 then wants row 2; B locks row 2 then wants row 1.',
        'PostgreSQL: checks after <code>deadlock_timeout</code> (1s), error SQLSTATE 40P01.',
        'SQL Server: picks a victim, error 1205; the deadlock graph is in the system_health Extended Events session.',
        'Prevent: lock rows in the same order, keep transactions short, add the right indexes.',
        'Your code should catch deadlock errors and retry the whole transaction.',
      ],
    },
  ],
};
