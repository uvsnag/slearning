// Interview data: sql, optimize-sql
// Auto-generated from pv.html
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
  {
    id: 'sql',
    name: 'SQL',
    icon: '🗄️',
    questions: [
      // ──── 1. QUERY FUNDAMENTALS ────
      {
        q: 'What are the types of SQL JOINs? Explain with examples.',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>SQL joins are grouped by which rows they keep. <code>INNER</code> keeps only rows that match in both tables, while <code>LEFT</code> keeps every row from the left table and fills the right side with <code>NULL</code>. <code>RIGHT</code> is the mirror of <code>LEFT</code>, and <code>FULL OUTER</code> keeps rows from both sides, though MySQL does not support it directly. <code>CROSS</code> makes every possible pair, and a <code>SELF JOIN</code> joins a table to itself, such as an employee to their manager.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Các loại JOIN khác nhau ở chỗ chúng giữ lại những dòng nào. <code>INNER JOIN</code> chỉ lấy các dòng có dữ liệu khớp ở cả hai bảng. <code>LEFT JOIN</code> lấy toàn bộ dòng của bảng bên trái; dòng nào không có dữ liệu khớp bên phải thì các cột bên phải sẽ là <code>NULL</code>. <code>RIGHT JOIN</code> ngược lại với LEFT, còn <code>FULL OUTER JOIN</code> lấy dòng của cả hai bên (MySQL không hỗ trợ trực tiếp). <code>CROSS JOIN</code> ghép mỗi dòng bên này với mọi dòng bên kia (tích Descartes), và <code>SELF JOIN</code> là join một bảng với chính nó, ví dụ nối nhân viên với người quản lý của họ trong cùng bảng employees.</p></details>
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
        q: 'Why did my LEFT JOIN return fewer rows after adding a WHERE filter? (the LEFT JOIN that silently becomes an INNER JOIN)',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>In an outer join, <code>ON</code> and <code>WHERE</code> are not the same: <code>ON</code> decides what matches, while <code>WHERE</code> filters the joined result. Unmatched left rows have NULLs in the right columns, so a <code>WHERE</code> condition on a right-table column drops them and quietly turns a <code>LEFT JOIN</code> into an <code>INNER JOIN</code>. The fix is to move right-table filters into the <code>ON</code> clause. The one intended exception is the anti-join, which uses <code>WHERE</code> with <code>IS NULL</code> to find rows that have no match.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Với outer join, <code>ON</code> và <code>WHERE</code> có vai trò khác nhau: <code>ON</code> quyết định dòng nào được ghép với nhau, còn <code>WHERE</code> lọc trên kết quả sau khi đã join xong. Những dòng bên trái không có dữ liệu khớp sẽ có toàn NULL ở các cột bên phải, nên nếu <code>WHERE</code> có điều kiện trên cột của bảng phải, các dòng đó bị loại luôn, và <code>LEFT JOIN</code> vô tình hoạt động y như <code>INNER JOIN</code>. Cách sửa là chuyển điều kiện của bảng phải vào mệnh đề <code>ON</code>. Trường hợp duy nhất ta cố ý lọc như vậy là anti-join: dùng <code>WHERE ... IS NULL</code> để tìm các dòng bên trái không có dòng nào khớp bên phải.</p></details>
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
        q: 'What is the difference between WHERE and HAVING?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p><code>WHERE</code> filters rows before grouping, and <code>HAVING</code> filters groups after aggregation. Because of this, aggregate functions like <code>COUNT</code> and <code>SUM</code> can only be used in <code>HAVING</code>. For better speed, put as many conditions as possible in <code>WHERE</code> so fewer rows need to be grouped.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>WHERE</code> lọc từng dòng trước khi gom nhóm, còn <code>HAVING</code> lọc các nhóm sau khi đã <code>GROUP BY</code> và tính toán xong. Vì thế các hàm tổng hợp như <code>COUNT</code> hay <code>SUM</code> chỉ dùng được trong <code>HAVING</code>. Về hiệu năng, điều kiện nào đặt được ở <code>WHERE</code> thì nên đặt ở đó, vì loại bớt dòng sớm sẽ giảm khối lượng phải gom nhóm.</p></details>
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
        a: `<div class="interview-answer"><p>SQL runs in a logical order that is different from how it is written. The steps are <code>FROM</code> and joins, then <code>WHERE</code>, <code>GROUP BY</code>, <code>HAVING</code>, <code>SELECT</code>, <code>DISTINCT</code>, <code>ORDER BY</code>, and finally <code>LIMIT</code>. This is why a column alias created in <code>SELECT</code> cannot be used in <code>WHERE</code> but can be used in <code>ORDER BY</code>.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Thứ tự thực thi logic của SQL không giống thứ tự ta viết câu lệnh. Database xử lý lần lượt: <code>FROM</code> và các JOIN, rồi <code>WHERE</code>, <code>GROUP BY</code>, <code>HAVING</code>, <code>SELECT</code>, <code>DISTINCT</code>, <code>ORDER BY</code>, và cuối cùng là <code>LIMIT</code>. Hiểu thứ tự này sẽ giải thích được vì sao alias đặt trong <code>SELECT</code> không dùng được ở <code>WHERE</code> (WHERE chạy trước SELECT) nhưng lại dùng được ở <code>ORDER BY</code> (chạy sau SELECT).</p></details>
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
        q: 'IN vs EXISTS vs JOIN: when do they return different results for the same question?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>All three can answer whether customers have orders, but they do not behave the same way. A <code>JOIN</code> multiplies rows on one-to-many data, so <code>DISTINCT</code> is needed, while <code>IN</code> and <code>EXISTS</code> return each row at most once. Modern optimizers often turn <code>IN</code> and <code>EXISTS</code> into the same plan, so the idea that <code>EXISTS</code> is always faster is outdated. They differ most with negation, since <code>NOT IN</code> on a nullable column can return no rows, which makes <code>NOT EXISTS</code> the safer default.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Cả ba đều trả lời được câu hỏi "khách hàng nào có đơn hàng", nhưng kết quả không luôn giống nhau. <code>JOIN</code> với quan hệ một-nhiều sẽ nhân số dòng lên (một khách có 3 đơn thì xuất hiện 3 lần), nên phải thêm <code>DISTINCT</code>; trong khi <code>IN</code> và <code>EXISTS</code> mỗi khách chỉ trả về một lần. Optimizer hiện nay thường tạo ra cùng một plan cho <code>IN</code> và <code>EXISTS</code>, nên quan niệm "EXISTS luôn nhanh hơn" đã không còn đúng. Khác biệt lớn nhất nằm ở dạng phủ định: <code>NOT IN</code> trên một cột có thể chứa NULL có thể trả về rỗng hoàn toàn, vì vậy <code>NOT EXISTS</code> là lựa chọn an toàn hơn.</p></details>
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

      // ──── 2. NULL SEMANTICS & COUNTING ────
      {
        q: 'How does SQL handle NULL? Why does NOT IN with a NULL return no rows?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>SQL uses three-valued logic with TRUE, FALSE, and UNKNOWN, and any comparison with NULL gives UNKNOWN, which <code>WHERE</code> drops. This is why <code>NOT IN</code> against a subquery that contains a NULL returns no rows, since one comparison becomes UNKNOWN and spoils the whole condition. A safe fix is <code>NOT EXISTS</code>. Also note that aggregates skip NULLs, so <code>COUNT(col)</code> is not the same as <code>COUNT(*)</code>.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>SQL dùng logic ba giá trị: TRUE, FALSE và UNKNOWN. Mọi phép so sánh với NULL đều cho ra UNKNOWN, mà <code>WHERE</code> chỉ giữ lại các dòng có kết quả TRUE, nên những dòng đó bị loại. Đó là lý do <code>NOT IN</code> trả về rỗng khi subquery có chứa NULL: chỉ cần một phép so sánh cho UNKNOWN là cả điều kiện không còn TRUE với bất kỳ dòng nào. Cách khắc phục an toàn là dùng <code>NOT EXISTS</code>. Ngoài ra, các hàm tổng hợp đều bỏ qua NULL, nên <code>COUNT(col)</code> có thể nhỏ hơn <code>COUNT(*)</code>.</p></details>
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
        q: 'Why does a row match neither status = X nor status != X? COUNT(*) vs COUNT(col) vs COUNT(DISTINCT col).',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Because of three-valued logic, a NULL row fails both <code>status = X</code> and <code>status != X</code>, so opposite filters do not cover the whole table and some rows disappear from reports. A common symptom is a dashboard whose category totals do not add up to <code>COUNT(*)</code> because the NULL group is missed. The fix is to handle NULL directly with <code>OR status IS NULL</code> or <code>IS DISTINCT FROM</code>. Also note that <code>COUNT(*)</code> and <code>COUNT(1)</code> both count rows and are the same, while <code>COUNT(col)</code> skips NULLs.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Vì logic ba giá trị, một dòng có <code>status</code> là NULL sẽ không thỏa <code>status = X</code> và cũng không thỏa <code>status != X</code>. Hai điều kiện tưởng là bù nhau nhưng thực tế không bao phủ hết bảng, nên một số dòng "biến mất" khỏi báo cáo. Triệu chứng hay gặp là dashboard có tổng các nhóm không bằng <code>COUNT(*)</code> vì thiếu nhóm NULL. Cách sửa là xử lý NULL một cách tường minh, bằng <code>OR status IS NULL</code> hoặc <code>IS DISTINCT FROM</code>. Về COUNT: <code>COUNT(*)</code> và <code>COUNT(1)</code> đếm toàn bộ dòng và hoàn toàn tương đương, còn <code>COUNT(col)</code> chỉ đếm những dòng mà cột đó khác NULL.</p></details>
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

      // ──── 3. WINDOW FUNCTIONS & CTEs ────
      {
        q: 'What are window functions? Explain ROW_NUMBER, RANK, DENSE_RANK.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Window functions do calculations across a set of rows without combining them into one, which is how they differ from <code>GROUP BY</code>. The three ranking functions differ only in how they handle ties. <code>ROW_NUMBER</code> always gives unique numbers, <code>RANK</code> leaves a gap after a tie, and <code>DENSE_RANK</code> leaves no gap. A common use is finding the top N rows per group with <code>ROW_NUMBER</code> and <code>PARTITION BY</code>.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Window function tính toán trên một tập dòng liên quan nhưng vẫn giữ nguyên từng dòng, không gộp chúng lại như <code>GROUP BY</code>. Ba hàm xếp hạng chỉ khác nhau ở cách xử lý giá trị bằng nhau: <code>ROW_NUMBER</code> luôn đánh số liên tục và không trùng; <code>RANK</code> cho các giá trị bằng nhau cùng một hạng rồi nhảy cách (1, 1, 3); <code>DENSE_RANK</code> cũng cho cùng hạng nhưng không nhảy cách (1, 1, 2). Ứng dụng phổ biến nhất là lấy top N trong mỗi nhóm bằng <code>ROW_NUMBER() OVER (PARTITION BY ...)</code>.</p></details>
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
        q: 'Explain LAG/LEAD and window frames (running totals, moving averages).',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Besides ranking, window functions can compare a row to nearby rows with <code>LAG</code> and <code>LEAD</code>, and can aggregate over a sliding frame for running totals and moving averages, all without combining rows. A common trap is the default frame: with <code>ORDER BY</code> it uses <code>RANGE</code>, which groups ties together, so use <code>ROWS</code> for strict row-by-row results. <code>LAST_VALUE</code> also needs an explicit full frame or it just returns the current row. These functions replace complex self-joins.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Ngoài xếp hạng, window function còn cho phép so sánh một dòng với dòng trước hoặc sau nó bằng <code>LAG</code> và <code>LEAD</code>, và tính tổng hợp trên một "khung" (frame) trượt để làm running total hay moving average, mà vẫn không gộp dòng. Một bẫy hay gặp là frame mặc định: khi có <code>ORDER BY</code>, frame mặc định là <code>RANGE</code>, vốn gom tất cả các dòng có giá trị sắp xếp bằng nhau vào chung, nên hãy khai báo <code>ROWS</code> nếu muốn tính chính xác theo từng dòng. <code>LAST_VALUE</code> cũng cần khai báo frame đầy đủ, nếu không nó chỉ trả về đúng dòng hiện tại. Nhìn chung, các hàm này thay thế được nhiều self-join phức tạp.</p></details>
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
        q: 'What is a CTE (Common Table Expression)? CTE vs Subquery vs Temp Table.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A CTE names a temporary result and is used within a single statement, mainly to make queries easier to read and to allow recursion. A subquery is inline and harder to reuse, while a temp table is physically stored, can be indexed, and lasts across statements for multi-step work. One thing to note is that a CTE may not be materialized, since some databases inline it, so it should not be relied on as a performance boundary.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>CTE là cách đặt tên cho một tập kết quả tạm, chỉ tồn tại trong phạm vi một câu lệnh, mục đích chính là làm truy vấn dễ đọc hơn và hỗ trợ đệ quy. Subquery thì viết lồng trực tiếp trong câu lệnh nên khó đọc và khó tái sử dụng. Temp table được lưu vật lý, có thể đánh index và tồn tại qua nhiều câu lệnh, phù hợp cho xử lý nhiều bước. Một điểm cần nhớ là CTE không nhất thiết được materialize; nhiều database sẽ inline nó vào truy vấn chính, nên đừng dùng CTE với kỳ vọng nó là một "điểm chặn" về hiệu năng.</p></details>
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
        q: 'Explain recursive CTEs. Give an example.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A recursive CTE has an anchor part and a recursive part joined back to the CTE, combined with <code>UNION ALL</code>. It is used to walk tree or graph data such as an organization chart, and it repeats until no new rows are produced. To avoid endless recursion on cyclic data, add a depth limit or a cycle check. It replaces looping and querying from application code, which is a common source of the N+1 problem.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Recursive CTE gồm hai phần nối với nhau bằng <code>UNION ALL</code>: phần anchor (điểm xuất phát) và phần đệ quy tham chiếu lại chính CTE. Database sẽ lặp phần đệ quy cho đến khi không sinh ra dòng mới nào nữa. Nó thường dùng để duyệt dữ liệu dạng cây hoặc đồ thị, ví dụ sơ đồ tổ chức hay danh mục nhiều cấp. Nếu dữ liệu có thể có vòng lặp, cần thêm giới hạn độ sâu hoặc kiểm tra chu trình để tránh đệ quy vô hạn. Đây cũng là cách thay cho việc lặp query nhiều lần từ code ứng dụng, vốn là nguồn phổ biến của vấn đề N+1.</p></details>
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

      // ──── 4. WRITE-SQL PRACTICE PROBLEMS ────
      {
        q: 'Write SQL: Find the Nth highest salary.',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The clearest way to find the Nth highest salary is <code>DENSE_RANK</code> in a subquery filtered to rank N, because it shows the intent and handles ties well. <code>LIMIT</code> with <code>OFFSET</code> over distinct salaries is the shortest to write, and a correlated subquery works on old databases but is slow. If there are fewer than N distinct salaries, all correct versions return no rows. It also helps to clarify whether Nth means the Nth distinct value or the Nth person.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Cách rõ ý nhất là dùng <code>DENSE_RANK</code> trong subquery rồi lọc <code>rank = N</code>, vì nó xử lý đúng trường hợp nhiều người có cùng mức lương. Cách ngắn gọn nhất là <code>SELECT DISTINCT salary ... ORDER BY salary DESC LIMIT 1 OFFSET N-1</code>. Correlated subquery cũng đúng và chạy được trên database cũ, nhưng chậm. Nếu bảng có ít hơn N mức lương khác nhau thì các cách đúng đều trả về rỗng. Khi phỏng vấn, nên hỏi lại "cao thứ N" là mức lương distinct thứ N hay người thứ N, vì hai cách hiểu cho kết quả khác nhau.</p></details>
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
        a: `<div class="interview-answer"><p>Finding duplicates and removing them are two separate tasks. To detect them, use <code>GROUP BY</code> on the duplicate key with <code>HAVING COUNT(*) &gt; 1</code>. To delete while keeping one row, use <code>ROW_NUMBER</code> partitioned by the key and remove rows where the number is greater than 1, which is safer than the <code>NOT IN</code> trick that fails when an id is NULL. After cleanup, add a <code>UNIQUE</code> constraint so duplicates cannot return.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Tìm và xóa bản ghi trùng là hai việc khác nhau. Để tìm, dùng <code>GROUP BY</code> theo các cột xác định "trùng" kèm <code>HAVING COUNT(*) &gt; 1</code>. Để xóa mà vẫn giữ lại một bản, dùng <code>ROW_NUMBER() OVER (PARTITION BY ...)</code> rồi xóa những dòng có số thứ tự lớn hơn 1; cách này an toàn hơn kiểu <code>DELETE ... WHERE id NOT IN (SELECT MIN(id) ...)</code>, vốn hỏng nếu có id NULL. Sau khi dọn xong, hãy thêm ràng buộc <code>UNIQUE</code> để dữ liệu trùng không quay lại.</p></details>
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
        q: 'Write SQL: Find users who logged in 3 or more consecutive days (gaps and islands).',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>This is the gaps-and-islands pattern. Within a run of consecutive dates, the value of the date minus <code>ROW_NUMBER()</code> stays constant, so it can be used as a group key with <code>GROUP BY</code> and then <code>HAVING COUNT(*) &gt;= 3</code>. Duplicate logins on the same day should be removed first with <code>DISTINCT</code>. The same method solves many problems such as longest streak, consecutive absences, and grouping events into sessions.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Đây là bài toán gaps-and-islands kinh điển. Ý tưởng: trong một chuỗi ngày liên tiếp, lấy ngày trừ đi <code>ROW_NUMBER()</code> sẽ luôn cho ra cùng một giá trị, nên có thể dùng hiệu số đó làm khóa để <code>GROUP BY</code>, rồi lọc <code>HAVING COUNT(*) &gt;= 3</code>. Trước đó cần <code>DISTINCT</code> để loại các lần đăng nhập trùng trong cùng một ngày, nếu không ROW_NUMBER sẽ bị lệch. Cùng kỹ thuật này giải được nhiều bài khác: chuỗi dài nhất, số ngày nghỉ liên tiếp, hay gom các sự kiện thành phiên (session).</p></details>
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
        q: 'Write SQL: Pivot rows to columns (conditional aggregation).',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Pivoting rows into columns is done with conditional aggregation, which is an aggregate over a <code>CASE</code>, or <code>FILTER</code> in PostgreSQL. This works in every database without special <code>PIVOT</code> syntax. A common use is counting by status in a single pass instead of running several separate queries. It also keeps the SQL portable across databases.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Xoay dòng thành cột thường làm bằng conditional aggregation: đặt <code>CASE WHEN</code> bên trong hàm tổng hợp, ví dụ <code>SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END)</code>, hoặc dùng <code>FILTER</code> trong PostgreSQL. Cách này chạy được trên mọi database, không cần cú pháp <code>PIVOT</code> riêng của từng hãng. Ứng dụng hay gặp là đếm theo từng trạng thái chỉ với một lần quét bảng thay vì chạy nhiều truy vấn riêng. Nhờ vậy SQL cũng dễ mang từ database này sang database khác.</p></details>
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

      // ──── 5. SCHEMA DESIGN & INDEX BASICS ────
      {
        q: 'What is normalization? Explain 1NF, 2NF, 3NF, BCNF.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Normalization removes redundant data so each fact is stored in only one place, which prevents update problems. 1NF requires atomic values, 2NF removes partial dependency on part of a composite key, 3NF removes dependency between non-key columns, and BCNF requires every determinant to be a candidate key. A common approach is to normalize to 3NF, then denormalize on purpose for read speed when needed.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Chuẩn hóa nhằm loại bỏ dữ liệu dư thừa, để mỗi thông tin chỉ lưu ở một chỗ và tránh lỗi khi cập nhật (sửa một nơi mà quên nơi khác). 1NF: mỗi ô chỉ chứa một giá trị, không có danh sách hay nhóm lặp. 2NF: không có cột nào phụ thuộc vào chỉ một phần của khóa tổ hợp. 3NF: không có cột không-khóa nào phụ thuộc vào cột không-khóa khác. BCNF: mọi cột dùng để xác định cột khác đều phải là khóa ứng viên (candidate key). Thực tế thường chuẩn hóa tới 3NF, rồi chủ động phi chuẩn hóa (denormalize) một phần khi cần tăng tốc độ đọc.</p></details>
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
        q: 'What is the difference between clustered and non-clustered indexes?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A clustered index sets the physical order of the rows, so its leaf level is the data itself, and there can be only one per table, usually the primary key. A non-clustered index is a separate structure whose leaves point back to the row, so a table can have many of them. A non-clustered lookup needs an extra step to fetch the row unless the index is covering. InnoDB always clusters on the primary key, while SQL Server lets you choose.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Clustered index quyết định thứ tự lưu trữ vật lý của dữ liệu, tầng lá của nó chính là các dòng dữ liệu, nên mỗi bảng chỉ có một clustered index, thường là primary key. Non-clustered index là cấu trúc tách riêng, tầng lá chỉ chứa con trỏ trỏ về dòng dữ liệu, nên một bảng có thể có nhiều index loại này. Tra cứu qua non-clustered index phải thêm một bước quay về bảng để lấy dữ liệu (key lookup), trừ khi index đã chứa đủ các cột cần (covering index). InnoDB của MySQL luôn cluster theo primary key, còn SQL Server cho phép chọn cột làm clustered index.</p></details>
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

      // ──── 6. TRANSACTIONS & CONCURRENCY ────
      {
        q: 'What are isolation levels? Explain dirty read, non-repeatable read, phantom read.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Isolation levels are defined by which problems they allow: dirty read, non-repeatable read, and phantom read. Read Uncommitted allows all three, Read Committed stops dirty reads, Repeatable Read also stops non-repeatable reads, and Serializable stops all of them. Defaults matter, since PostgreSQL uses Read Committed and MySQL InnoDB uses Repeatable Read. Higher isolation gives more correctness but causes more locking and more retries.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Các mức isolation được định nghĩa theo ba hiện tượng mà chúng cho phép hay ngăn chặn: dirty read (đọc dữ liệu chưa commit), non-repeatable read (đọc lại cùng dòng nhưng giá trị đã đổi) và phantom read (đọc lại cùng điều kiện nhưng xuất hiện dòng mới). Read Uncommitted cho phép cả ba; Read Committed chặn dirty read; Repeatable Read chặn thêm non-repeatable read; Serializable chặn tất cả. Cần nhớ mức mặc định của từng database: PostgreSQL là Read Committed, MySQL InnoDB là Repeatable Read. Mức càng cao thì dữ liệu càng nhất quán, nhưng đổi lại là nhiều lock hơn và nhiều lần phải retry hơn.</p></details>
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
        q: 'What is MVCC (Multi-Version Concurrency Control)? Why do readers not block writers?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>MVCC keeps several versions of each row so every transaction reads a consistent snapshot from its start, which is why readers do not block writers and writers do not block readers. An <code>UPDATE</code> does not overwrite; it writes a new version and marks the old one as dead. In PostgreSQL these dead versions stay in the table and must be cleaned by <code>VACUUM</code>, so a long transaction causes bloat and makes <code>COUNT(*)</code> slow. Write-write conflicts still cause locking.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>MVCC lưu nhiều phiên bản của cùng một dòng, để mỗi transaction đọc từ một snapshot nhất quán tại thời điểm nó bắt đầu. Nhờ đó người đọc không chặn người ghi và người ghi cũng không chặn người đọc. Khi <code>UPDATE</code>, database không ghi đè mà tạo phiên bản mới và đánh dấu phiên bản cũ là "chết". Trong PostgreSQL, các phiên bản chết này vẫn nằm trong bảng cho đến khi <code>VACUUM</code> dọn đi; vì vậy transaction chạy quá lâu sẽ khiến bảng bị phình (bloat) và <code>COUNT(*)</code> chậm dần. Lưu ý MVCC chỉ giải quyết xung đột đọc-ghi; hai transaction cùng ghi một dòng vẫn phải chờ lock.</p></details>
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
        q: 'Two transactions read the same balance and both write back — one update vanishes. How do you prevent lost updates?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A lost update happens when two transactions read the same value, change it, and write it back, so the second write overwrites the first, because plain SELECTs take no locks under Read Committed. The best fix is to make the write atomic in one statement, such as <code>UPDATE ... SET balance = balance - 30</code>. A pessimistic <code>SELECT ... FOR UPDATE</code> locks the row for short, high-conflict transactions, while an optimistic version column suits edits that span user think-time. Note that MySQL Repeatable Read does not prevent lost updates.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Lost update xảy ra khi hai transaction cùng đọc một giá trị, cùng tính toán rồi cùng ghi lại, kết quả là lần ghi sau đè mất lần ghi trước. Nguyên nhân là <code>SELECT</code> thông thường không giữ lock ở mức Read Committed. Cách sửa tốt nhất là gom việc đọc và ghi vào một câu lệnh nguyên tử, ví dụ <code>UPDATE ... SET balance = balance - 30</code>. Nếu không được, có hai hướng: pessimistic locking dùng <code>SELECT ... FOR UPDATE</code> để khóa dòng, hợp với transaction ngắn và tranh chấp cao; optimistic locking dùng cột version và kiểm tra khi ghi, hợp với các thao tác kéo dài qua thời gian người dùng suy nghĩ. Lưu ý: Repeatable Read của MySQL không tự ngăn được lost update.</p></details>
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
      {
        q: 'What is a deadlock? How to prevent it?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A deadlock happens when two transactions each hold a lock the other needs, forming a cycle where neither can continue. The database detects this automatically and cancels one transaction, so the application gets an error and must retry the whole transaction. The main way to prevent it is to always acquire locks in the same order, for example by ascending <code>id</code>. Keeping transactions short also helps.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Deadlock là khi hai transaction mỗi bên giữ một lock mà bên kia đang cần, tạo thành vòng chờ nhau và không bên nào tiến được. Database sẽ tự phát hiện và hủy một trong hai, ứng dụng nhận lỗi và phải chạy lại toàn bộ transaction đó. Cách phòng tránh chính là luôn lấy lock theo cùng một thứ tự, ví dụ luôn cập nhật theo <code>id</code> tăng dần. Giữ transaction ngắn, không chờ I/O hay gọi API bên ngoài giữa transaction, cũng giảm đáng kể khả năng deadlock.</p></details>
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

      // ──── 7. PROCEDURAL SQL — PROCEDURES, FUNCTIONS & TRIGGERS ────
      {
        q: 'Explain stored procedures vs functions. When to use each?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A function returns a value, ideally has no side effects, and can be used inside a <code>SELECT</code> or <code>WHERE</code>. A procedure is for multi-step logic: it can change data, control transactions, and return several result sets, and it is run with <code>CALL</code>. Calculations that belong inside queries should be functions, while transactional workflows like a money transfer should be procedures.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Function trả về một giá trị, lý tưởng là không có side effect, và có thể gọi ngay trong <code>SELECT</code> hay <code>WHERE</code>. Procedure dành cho logic nhiều bước: có thể sửa dữ liệu, tự quản lý transaction, trả về nhiều result set, và được gọi bằng <code>CALL</code>. Nguyên tắc chọn: phép tính cần dùng bên trong truy vấn thì viết function; luồng nghiệp vụ có transaction như chuyển tiền thì viết procedure.</p></details>
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
        q: 'How do you write a stored procedure in PostgreSQL and SQL Server? (syntax, parameters, transactions, calling)',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>In PostgreSQL a procedure is created with <code>CREATE PROCEDURE ... LANGUAGE plpgsql AS $$ BEGIN ... END $$</code> and invoked with <code>CALL</code>, and since version 11 it may control transactions with <code>COMMIT</code> and <code>ROLLBACK</code> inside the body, which is the main thing that distinguishes it from a function. In SQL Server the same idea is written as <code>CREATE OR ALTER PROCEDURE ... AS BEGIN ... END</code>, invoked with <code>EXEC</code>, and transactions are managed with <code>BEGIN TRAN</code> together with <code>TRY...CATCH</code> and <code>SET XACT_ABORT ON</code> so a failure cannot leave a half-finished transaction open. Parameters are typed <code>IN</code>, <code>OUT</code> or <code>INOUT</code> in PostgreSQL and <code>OUTPUT</code> in T-SQL, and returning a result set differs: T-SQL just runs a <code>SELECT</code>, while PostgreSQL needs a refcursor or a table-returning function. Both should be written idempotently, with explicit error handling and no business rules hidden where the application cannot see them.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Trong PostgreSQL, procedure được tạo bằng <code>CREATE PROCEDURE ... LANGUAGE plpgsql AS $$ BEGIN ... END $$</code> và gọi bằng <code>CALL</code>. Từ bản 11, procedure có thể <code>COMMIT</code> và <code>ROLLBACK</code> ngay trong thân, đây là điểm khác biệt chính so với function. Trong SQL Server, cú pháp tương ứng là <code>CREATE OR ALTER PROCEDURE ... AS BEGIN ... END</code>, gọi bằng <code>EXEC</code>; transaction được quản lý bằng <code>BEGIN TRAN</code> kết hợp <code>TRY...CATCH</code> và <code>SET XACT_ABORT ON</code> để khi có lỗi không bị bỏ lại transaction treo. Tham số trong PostgreSQL khai báo <code>IN</code>/<code>OUT</code>/<code>INOUT</code>, còn T-SQL dùng <code>OUTPUT</code>. Trả về result set thì T-SQL chỉ cần một câu <code>SELECT</code> trong thân, còn PostgreSQL phải dùng refcursor hoặc chuyển sang function trả về bảng. Ở cả hai, nên viết procedure theo hướng idempotent, xử lý lỗi rõ ràng và không giấu luật nghiệp vụ ở nơi ứng dụng không nhìn thấy.</p></details>
<p><strong>1. Side-by-side skeleton</strong></p>
<table>
<tr><th></th><th>PostgreSQL</th><th>SQL Server</th></tr>
<tr><td>Create</td><td><code>CREATE OR REPLACE PROCEDURE</code></td><td><code>CREATE OR ALTER PROCEDURE</code> (2016 SP1+)</td></tr>
<tr><td>Body delimiter</td><td><code>$$ ... $$</code> (dollar quoting) + <code>LANGUAGE plpgsql</code></td><td><code>AS BEGIN ... END</code></td></tr>
<tr><td>Parameters</td><td><code>IN</code> / <code>OUT</code> / <code>INOUT</code>, defaults allowed</td><td><code>@p type</code>, <code>OUTPUT</code>, defaults allowed</td></tr>
<tr><td>Call</td><td><code>CALL proc(args);</code></td><td><code>EXEC proc @a = 1, @b = 2;</code></td></tr>
<tr><td>Return a result set</td><td>Refcursor, or use a function <code>RETURNS TABLE</code></td><td>Just <code>SELECT</code> inside the procedure</td></tr>
<tr><td>Transaction control inside</td><td>✅ <code>COMMIT</code>/<code>ROLLBACK</code> (PG 11+)</td><td>✅ <code>BEGIN/COMMIT/ROLLBACK TRAN</code></td></tr>
<tr><td>Error handling</td><td><code>EXCEPTION WHEN ... THEN</code></td><td><code>BEGIN TRY ... BEGIN CATCH</code></td></tr>
<tr><td>Drop</td><td><code>DROP PROCEDURE IF EXISTS p(int);</code> (signature!)</td><td><code>DROP PROCEDURE IF EXISTS p;</code></td></tr>
</table>
<p><strong>2. PostgreSQL — a complete, production-shaped procedure</strong></p>
<pre>CREATE OR REPLACE PROCEDURE transfer_funds(
    IN  p_from_id   BIGINT,
    IN  p_to_id     BIGINT,
    IN  p_amount    NUMERIC(18,2),
    OUT p_txn_id    BIGINT                    -- OUT params are returned by CALL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_balance NUMERIC(18,2);
BEGIN
    IF p_amount &lt;= 0 THEN
        RAISE EXCEPTION 'amount must be positive, got %', p_amount
              USING ERRCODE = 'check_violation';
    END IF;

    -- lock the source row so two concurrent transfers cannot both pass the check
    SELECT balance INTO v_balance
      FROM accounts WHERE id = p_from_id FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'account % not found', p_from_id USING ERRCODE = 'no_data_found';
    END IF;
    IF v_balance &lt; p_amount THEN
        RAISE EXCEPTION 'insufficient funds: % &lt; %', v_balance, p_amount;
    END IF;

    UPDATE accounts SET balance = balance - p_amount WHERE id = p_from_id;
    UPDATE accounts SET balance = balance + p_amount WHERE id = p_to_id;

    INSERT INTO transfers (from_id, to_id, amount, created_at)
    VALUES (p_from_id, p_to_id, p_amount, now())
    RETURNING id INTO p_txn_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'transfer failed: % (%)', SQLERRM, SQLSTATE;
        RAISE;                                  -- re-raise → caller's transaction rolls back
END;
$$;

CALL transfer_funds(1, 2, 100.00, NULL);        -- OUT arg is a placeholder in CALL</pre>
<pre>-- Transaction control INSIDE a procedure (PG 11+) — batch/ETL style
CREATE OR REPLACE PROCEDURE purge_old_rows(p_days INT)
LANGUAGE plpgsql AS $$
DECLARE deleted INT;
BEGIN
    LOOP
        DELETE FROM events
         WHERE ctid IN (SELECT ctid FROM events
                         WHERE created_at &lt; now() - make_interval(days =&gt; p_days)
                         LIMIT 10000);
        GET DIAGNOSTICS deleted = ROW_COUNT;
        EXIT WHEN deleted = 0;
        COMMIT;                                 -- ✅ allowed in a PROCEDURE, not in a FUNCTION
    END LOOP;
END $$;
-- ⚠ COMMIT is only legal when the procedure was NOT called inside an outer transaction block.</pre>
<p><strong>3. SQL Server — the same procedure in T-SQL</strong></p>
<pre>CREATE OR ALTER PROCEDURE dbo.TransferFunds
    @FromId   BIGINT,
    @ToId     BIGINT,
    @Amount   DECIMAL(18,2),
    @TxnId    BIGINT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;              -- stop "n rows affected" messages (perf + cleaner clients)
    SET XACT_ABORT ON;           -- any error aborts the whole transaction — recommended default

    IF @Amount &lt;= 0
        THROW 50001, 'Amount must be positive', 1;

    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @Balance DECIMAL(18,2);
        SELECT @Balance = balance
          FROM dbo.Accounts WITH (UPDLOCK, ROWLOCK)     -- lock the row for update
         WHERE id = @FromId;

        IF @Balance IS NULL  THROW 50002, 'Account not found', 1;
        IF @Balance &lt; @Amount THROW 50003, 'Insufficient funds', 1;

        UPDATE dbo.Accounts SET balance = balance - @Amount WHERE id = @FromId;
        UPDATE dbo.Accounts SET balance = balance + @Amount WHERE id = @ToId;

        INSERT INTO dbo.Transfers (from_id, to_id, amount, created_at)
        VALUES (@FromId, @ToId, @Amount, SYSUTCDATETIME());
        SET @TxnId = SCOPE_IDENTITY();          -- SCOPE_IDENTITY, never @@IDENTITY (triggers!)

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF XACT_STATE() &lt;&gt; 0 ROLLBACK TRANSACTION;   -- XACT_STATE handles doomed transactions
        THROW;                                       -- rethrow with the original error
    END CATCH
END;
GO

DECLARE @id BIGINT;
EXEC dbo.TransferFunds @FromId = 1, @ToId = 2, @Amount = 100.00, @TxnId = @id OUTPUT;
SELECT @id AS txn_id;</pre>
<p><strong>4. Returning data to the application</strong></p>
<pre>-- SQL Server: a bare SELECT becomes the result set (and you may return several)
CREATE OR ALTER PROCEDURE dbo.GetOrders @CustomerId INT AS
BEGIN
    SET NOCOUNT ON;
    SELECT id, total, created_at FROM dbo.Orders WHERE customer_id = @CustomerId;
END;
-- RETURN in T-SQL returns only an INT status code, not data.

-- PostgreSQL: procedures cannot simply "select"; use a FUNCTION returning a table
CREATE OR REPLACE FUNCTION get_orders(p_customer_id INT)
RETURNS TABLE (id BIGINT, total NUMERIC, created_at TIMESTAMPTZ)
LANGUAGE sql STABLE AS $$
    SELECT id, total, created_at FROM orders WHERE customer_id = p_customer_id;
$$;
SELECT * FROM get_orders(42);

-- …or return a cursor from a procedure when the driver expects one
CREATE OR REPLACE PROCEDURE get_orders_cur(p_customer_id INT, INOUT ref refcursor)
LANGUAGE plpgsql AS $$
BEGIN
    OPEN ref FOR SELECT id, total FROM orders WHERE customer_id = p_customer_id;
END $$;</pre>
<p><strong>5. Calling from an application</strong></p>
<pre>-- JDBC (both engines)
CallableStatement cs = conn.prepareCall("{call transfer_funds(?,?,?,?)}");
cs.setLong(1, 1); cs.setLong(2, 2); cs.setBigDecimal(3, new BigDecimal("100.00"));
cs.registerOutParameter(4, Types.BIGINT);
cs.execute();  long txnId = cs.getLong(4);

-- Spring Data JPA
@Procedure(procedureName = "transfer_funds")
Long transferFunds(@Param("p_from_id") Long from, @Param("p_to_id") Long to,
                   @Param("p_amount") BigDecimal amount);</pre>
<p><strong>6. Practical guidance</strong></p>
<ul>
<li><strong>Always</strong> <code>SET NOCOUNT ON</code> in T-SQL procedures, and <code>SET XACT_ABORT ON</code> whenever you use explicit transactions.</li>
<li><strong>Do not open a transaction and then wait</strong> — no external calls, no long loops without commits; a procedure holding locks is a production incident.</li>
<li><strong>Idempotent deployment</strong>: <code>CREATE OR REPLACE</code> (PG) / <code>CREATE OR ALTER</code> (MSSQL), and keep the source in version control, not only in the database.</li>
<li><strong>Overloading</strong>: PostgreSQL allows the same name with different signatures — which is why <code>DROP PROCEDURE</code> needs the argument list.</li>
<li><strong>Security</strong>: <code>SECURITY DEFINER</code> (PG) / <code>EXECUTE AS OWNER</code> (MSSQL) run with the owner's rights — always pin <code>search_path</code> / schema-qualify names to avoid hijacking.</li>
<li><strong>When to use procedures at all</strong>: heavy set-based data movement, batch jobs, and operations that must stay atomic close to the data. Business rules that the application team must maintain usually belong in the application — logic in the database is harder to test, review, and deploy.</li>
</ul>
<div class="key-point">The two-sentence answer: <em>"PostgreSQL: <code>CREATE PROCEDURE … LANGUAGE plpgsql AS $$ BEGIN … END $$</code>, call with <code>CALL</code>, handle errors with <code>EXCEPTION WHEN</code>, and it may <code>COMMIT</code> inside. SQL Server: <code>CREATE OR ALTER PROCEDURE … AS BEGIN … END</code>, call with <code>EXEC</code>, and always pair <code>BEGIN TRAN</code> with <code>TRY…CATCH</code>, <code>XACT_ABORT ON</code> and <code>XACT_STATE()</code> before rollback."</em></div>`,
      },
      {
        q: 'How do you write a user-defined function in PostgreSQL and SQL Server? (scalar, table-valued, volatility, performance traps)',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A function returns a value and can be used inside queries, which makes its performance characteristics far more important than a procedure's. In PostgreSQL you write <code>CREATE FUNCTION ... RETURNS type</code> with either <code>LANGUAGE sql</code> for a single expression, which the planner can inline, or <code>LANGUAGE plpgsql</code> when you need variables and control flow, and you must declare the volatility as <code>IMMUTABLE</code>, <code>STABLE</code> or <code>VOLATILE</code> because that is what allows the planner to cache or push down the call. In SQL Server the important distinction is between an <strong>inline table-valued function</strong>, which is expanded into the query like a parameterized view and is fast, and a <strong>scalar or multi-statement function</strong>, which historically executed row by row and destroyed performance, mitigated only from 2019 by scalar UDF inlining. The practical rule in both engines is to prefer set-based functions that the optimizer can see through, and to be explicit about volatility, null handling and determinism.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Function được gọi trực tiếp trong truy vấn nên hiệu năng của nó quan trọng hơn nhiều so với procedure. Trong PostgreSQL, ta viết <code>CREATE FUNCTION ... RETURNS type</code>; nếu chỉ là một biểu thức đơn thì dùng <code>LANGUAGE sql</code> để planner có thể inline, còn cần biến và rẽ nhánh thì dùng <code>LANGUAGE plpgsql</code>. Quan trọng là phải khai báo đúng mức volatility (<code>IMMUTABLE</code>, <code>STABLE</code> hay <code>VOLATILE</code>), vì planner dựa vào đó để quyết định có được cache kết quả hay đẩy lời gọi xuống index hay không. Trong SQL Server, khác biệt then chốt là giữa <strong>inline table-valued function</strong>, được mở rộng thẳng vào truy vấn như một view có tham số nên rất nhanh, và <strong>scalar / multi-statement function</strong>, chạy từng dòng một và làm chậm truy vấn nghiêm trọng; từ bản 2019 mới có scalar UDF inlining để giảm bớt. Quy tắc chung cho cả hai: ưu tiên function xử lý theo tập hợp mà optimizer "nhìn xuyên" được, và khai báo rõ volatility, cách xử lý NULL và tính tất định (deterministic).</p></details>
<p><strong>1. PostgreSQL functions</strong></p>
<pre>-- (a) SQL function — a single expression; the planner can INLINE it (fastest)
CREATE OR REPLACE FUNCTION net_price(gross NUMERIC, vat NUMERIC)
RETURNS NUMERIC
LANGUAGE sql
IMMUTABLE               -- same input → same output, no table access
PARALLEL SAFE
RETURNS NULL ON NULL INPUT      -- a.k.a. STRICT: null in → null out, body not executed
AS $$
    SELECT gross / (1 + vat);
$$;

-- (b) plpgsql function — variables, branching, loops
CREATE OR REPLACE FUNCTION customer_tier(p_customer_id BIGINT)
RETURNS TEXT
LANGUAGE plpgsql
STABLE                  -- reads tables, but no writes; constant within one statement
AS $$
DECLARE
    v_total NUMERIC;
BEGIN
    SELECT COALESCE(SUM(total), 0) INTO v_total
      FROM orders WHERE customer_id = p_customer_id;

    RETURN CASE
             WHEN v_total &gt;= 100000 THEN 'PLATINUM'
             WHEN v_total &gt;=  10000 THEN 'GOLD'
             ELSE 'STANDARD'
           END;
END $$;

-- (c) Set-returning function — the PostgreSQL equivalent of an inline TVF
CREATE OR REPLACE FUNCTION orders_in_range(p_from DATE, p_to DATE)
RETURNS TABLE (id BIGINT, customer_id BIGINT, total NUMERIC)
LANGUAGE sql STABLE AS $$
    SELECT id, customer_id, total
      FROM orders
     WHERE created_at &gt;= p_from AND created_at &lt; p_to;
$$;
SELECT * FROM orders_in_range('2026-01-01', '2026-02-01');

-- (d) Trigger function (see the trigger question) / RETURNS SETOF record / OUT params
--     are the other shapes you will meet.</pre>
<table>
<tr><th>Volatility</th><th>Meaning</th><th>Planner may</th><th>Example</th></tr>
<tr><td><code>IMMUTABLE</code></td><td>Same args → same result, forever; no table access</td><td>Pre-evaluate constants, use in <strong>index expressions</strong></td><td><code>upper(text)</code>, pure math</td></tr>
<tr><td><code>STABLE</code></td><td>Constant within one statement; reads tables</td><td>Call once per statement, push into index scans</td><td>Lookup by id, <code>now()</code>-based</td></tr>
<tr><td><code>VOLATILE</code> (default)</td><td>May change anytime or have side effects</td><td>Nothing — must call per row</td><td><code>random()</code>, functions that write</td></tr>
</table>
<p>Declaring a lookup function <code>VOLATILE</code> by accident (the default!) is one of the most common silent performance bugs in PostgreSQL — it blocks index usage and forces per-row execution.</p>
<p><strong>2. SQL Server functions — the three kinds, and only one is fast</strong></p>
<pre>-- (a) Inline table-valued function (iTVF) ✅ THE GOOD ONE — a parameterized view
CREATE OR ALTER FUNCTION dbo.OrdersInRange (@From DATE, @To DATE)
RETURNS TABLE                          -- no BEGIN/END, a single SELECT
AS RETURN
(
    SELECT id, customer_id, total
      FROM dbo.Orders
     WHERE created_at &gt;= @From AND created_at &lt; @To
);
SELECT * FROM dbo.OrdersInRange('2026-01-01','2026-02-01');
-- Expanded into the calling query → real cardinality estimates, index seeks, parallelism.

-- (b) Scalar UDF ⚠ historically a performance disaster (executed once PER ROW,
--     forced serial plans, invisible in the plan). SQL Server 2019+ can inline
--     simple ones (Scalar UDF Inlining); check with sys.sql_modules.is_inlineable.
CREATE OR ALTER FUNCTION dbo.NetPrice (@Gross DECIMAL(18,2), @Vat DECIMAL(5,4))
RETURNS DECIMAL(18,2)
WITH SCHEMABINDING                     -- required for inlining + indexed views; also blocks
AS                                     -- dropping referenced objects underneath you
BEGIN
    RETURN @Gross / (1 + @Vat);
END;

-- (c) Multi-statement TVF (mTVF) ⚠ fills a table variable; the optimizer guesses
--     the row count (1 row before 2014, 100 after; interleaved execution in 2017+ helps)
CREATE OR ALTER FUNCTION dbo.SplitCsv (@Csv NVARCHAR(MAX))
RETURNS @Result TABLE (value NVARCHAR(200))
AS
BEGIN
    INSERT INTO @Result (value) SELECT LTRIM(RTRIM(value)) FROM STRING_SPLIT(@Csv, ',');
    RETURN;
END;
-- Rewrite as an iTVF whenever the logic can be expressed as one SELECT.</pre>
<table>
<tr><th></th><th>Inline TVF</th><th>Scalar UDF</th><th>Multi-statement TVF</th></tr>
<tr><td>Shape</td><td><code>RETURNS TABLE AS RETURN (SELECT …)</code></td><td><code>RETURNS type … BEGIN RETURN … END</code></td><td><code>RETURNS @t TABLE(…) … BEGIN … END</code></td></tr>
<tr><td>Optimizer sees inside</td><td>✅ Yes — expanded</td><td>❌ No (unless inlined, 2019+)</td><td>❌ No — fixed guess</td></tr>
<tr><td>Row-by-row cost</td><td>None</td><td>High</td><td>Materializes into a table variable</td></tr>
<tr><td>Parallelism</td><td>Allowed</td><td>Blocked (pre-2019)</td><td>Restricted</td></tr>
<tr><td>Verdict</td><td>Use freely</td><td>Avoid in <code>SELECT</code>/<code>WHERE</code> over many rows</td><td>Convert to iTVF where possible</td></tr>
</table>
<p><strong>3. Traps in both engines</strong></p>
<ul>
<li><strong>Function in a WHERE clause kills the index</strong>: <code>WHERE fn(col) = 'x'</code> is non-SARGable. Fix by rewriting the predicate, or in PostgreSQL by creating an expression index — which requires the function to be <code>IMMUTABLE</code>.</li>
<li><strong>Hidden per-row work</strong>: a function that queries a table, called for a million rows, is a million queries. Turn it into a join or a set-returning function.</li>
<li><strong>Null handling</strong>: declare <code>STRICT</code>/<code>RETURNS NULL ON NULL INPUT</code> in PG when null in should mean null out (it also lets the planner skip the call). In T-SQL, remember arithmetic with NULL yields NULL silently.</li>
<li><strong>Determinism</strong>: PostgreSQL needs <code>IMMUTABLE</code> for index expressions; SQL Server needs <code>WITH SCHEMABINDING</code> + a deterministic body for computed-column indexes and indexed views.</li>
<li><strong>Error handling in functions</strong>: PostgreSQL allows <code>EXCEPTION</code> blocks but each one creates a subtransaction (a real cost in loops); T-SQL scalar functions cannot use <code>TRY…CATCH</code> to swallow errors and cannot perform DML at all.</li>
<li><strong>No transaction control</strong> inside a function in either engine — that is what procedures are for.</li>
</ul>
<div class="key-point">The rule that matters in interviews: <em>"prefer functions the optimizer can see through — <code>LANGUAGE sql</code> + correct volatility in PostgreSQL, inline table-valued functions in SQL Server — and treat scalar UDFs called over large row sets as a performance bug until proven otherwise."</em> Declaring volatility (or <code>SCHEMABINDING</code>) is not paperwork: it is what unlocks inlining, index expressions and parallel plans.</div>`,
      },
      {
        q: 'How do you write a trigger in PostgreSQL and SQL Server? (BEFORE/AFTER/INSTEAD OF, row vs statement, NEW/OLD vs inserted/deleted)',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>PostgreSQL splits a trigger in two: you write a function that returns <code>TRIGGER</code> and uses the <code>NEW</code> and <code>OLD</code> row variables, then attach it with <code>CREATE TRIGGER ... FOR EACH ROW EXECUTE FUNCTION</code>, where a <code>BEFORE</code> trigger can modify the row by returning a changed <code>NEW</code> and an <code>AFTER</code> trigger cannot. SQL Server has no separate function: the trigger body is inline and, crucially, it fires <strong>once per statement</strong> with two pseudo-tables, <code>inserted</code> and <code>deleted</code>, that contain all affected rows, so a trigger written as if only one row changed is the classic production bug. Both engines support <code>INSTEAD OF</code> triggers to make a view updatable, and both let you filter with a <code>WHEN</code> or by checking which columns changed. Triggers are powerful for auditing, denormalized counters and timestamps, but they are invisible side effects, so keep them small, set-based and free of business rules the application needs to understand.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>PostgreSQL tách trigger thành hai phần: viết một function trả về <code>TRIGGER</code>, trong đó dùng hai biến <code>NEW</code> và <code>OLD</code> đại diện cho dòng mới và dòng cũ, rồi gắn function đó vào bảng bằng <code>CREATE TRIGGER ... FOR EACH ROW EXECUTE FUNCTION</code>. Trigger <code>BEFORE</code> có thể sửa dữ liệu bằng cách trả về <code>NEW</code> đã chỉnh, còn <code>AFTER</code> thì không. SQL Server viết thân trigger trực tiếp, và điểm khác quan trọng nhất là trigger chạy <strong>một lần cho mỗi câu lệnh</strong>, với hai bảng ảo <code>inserted</code> và <code>deleted</code> chứa toàn bộ các dòng bị ảnh hưởng; lỗi kinh điển trong production là viết trigger như thể chỉ có đúng một dòng thay đổi. Cả hai đều hỗ trợ <code>INSTEAD OF</code> để làm view có thể cập nhật được, và cho phép lọc bằng <code>WHEN</code> hoặc kiểm tra cột nào thay đổi. Trigger rất tiện cho audit log, cột đếm phi chuẩn hóa hay cột thời gian cập nhật, nhưng vì nó chạy ngầm và khó thấy, hãy giữ trigger nhỏ, xử lý theo tập hợp, và đừng nhét vào đó luật nghiệp vụ mà ứng dụng cần biết.</p></details>
<p><strong>1. The mental model</strong></p>
<table>
<tr><th></th><th>PostgreSQL</th><th>SQL Server</th></tr>
<tr><td>Structure</td><td>Trigger <strong>function</strong> + <code>CREATE TRIGGER</code> that references it</td><td>Body written inline in <code>CREATE TRIGGER</code></td></tr>
<tr><td>Granularity</td><td><code>FOR EACH ROW</code> or <code>FOR EACH STATEMENT</code></td><td><strong>Statement-level only</strong> — no per-row triggers</td></tr>
<tr><td>Access to rows</td><td><code>NEW</code> / <code>OLD</code> record variables</td><td><code>inserted</code> / <code>deleted</code> pseudo-tables (a <strong>set</strong> of rows)</td></tr>
<tr><td>Timing</td><td><code>BEFORE</code>, <code>AFTER</code>, <code>INSTEAD OF</code> (views)</td><td><code>AFTER</code> (= <code>FOR</code>), <code>INSTEAD OF</code></td></tr>
<tr><td>Modify the row in flight</td><td>✅ <code>BEFORE</code> trigger returns a modified <code>NEW</code></td><td>❌ No BEFORE — use <code>INSTEAD OF</code> or update afterwards</td></tr>
<tr><td>Events</td><td>INSERT, UPDATE, DELETE, <strong>TRUNCATE</strong></td><td>INSERT, UPDATE, DELETE (+ DDL and logon triggers)</td></tr>
<tr><td>Condition</td><td><code>WHEN (OLD.x IS DISTINCT FROM NEW.x)</code></td><td><code>IF UPDATE(col)</code> / <code>COLUMNS_UPDATED()</code></td></tr>
</table>
<p><strong>2. PostgreSQL — audit trigger (the standard pattern)</strong></p>
<pre>-- Step 1: the trigger FUNCTION
CREATE OR REPLACE FUNCTION audit_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log(table_name, op, row_id, new_data, changed_by, changed_at)
        VALUES (TG_TABLE_NAME, TG_OP, NEW.id, to_jsonb(NEW), current_user, now());
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log(table_name, op, row_id, old_data, new_data, changed_by, changed_at)
        VALUES (TG_TABLE_NAME, TG_OP, NEW.id, to_jsonb(OLD), to_jsonb(NEW), current_user, now());
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log(table_name, op, row_id, old_data, changed_by, changed_at)
        VALUES (TG_TABLE_NAME, TG_OP, OLD.id, to_jsonb(OLD), current_user, now());
        RETURN OLD;                       -- AFTER triggers ignore the value, BEFORE ones don't
    END IF;
    RETURN NULL;
END $$;

-- Step 2: attach it (one function can serve many tables)
CREATE TRIGGER orders_audit
AFTER INSERT OR UPDATE OR DELETE ON orders
FOR EACH ROW EXECUTE FUNCTION audit_changes();

-- Useful context variables: TG_OP, TG_TABLE_NAME, TG_WHEN, TG_LEVEL, TG_ARGV[]</pre>
<pre>-- BEFORE trigger: modify the row being written (the only place you can)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;            -- ⚠ RETURN NULL in a BEFORE ROW trigger CANCELS the operation
END $$;

CREATE TRIGGER orders_set_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
WHEN (OLD.* IS DISTINCT FROM NEW.*)        -- skip no-op updates entirely
EXECUTE FUNCTION set_updated_at();

-- Statement-level trigger + transition tables (PG 10+): efficient bulk handling
CREATE TRIGGER orders_bulk_summary
AFTER INSERT ON orders
REFERENCING NEW TABLE AS new_rows
FOR EACH STATEMENT EXECUTE FUNCTION refresh_daily_totals();
-- inside the function: SELECT count(*) FROM new_rows;  ← all inserted rows at once</pre>
<p><strong>3. SQL Server — the same ideas, set-based</strong></p>
<pre>CREATE OR ALTER TRIGGER dbo.TR_Orders_Audit
ON dbo.Orders
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;
    IF @@ROWCOUNT = 0 RETURN;              -- nothing happened → do nothing

    -- Work in SETS. 'inserted' and 'deleted' hold ALL affected rows.
    --   INSERT → inserted only     DELETE → deleted only     UPDATE → both
    INSERT INTO dbo.AuditLog (table_name, op, row_id, old_data, new_data, changed_by, changed_at)
    SELECT 'Orders',
           CASE WHEN i.id IS NOT NULL AND d.id IS NOT NULL THEN 'UPDATE'
                WHEN i.id IS NOT NULL                      THEN 'INSERT'
                ELSE 'DELETE' END,
           COALESCE(i.id, d.id),
           (SELECT d.* FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
           (SELECT i.* FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
           SUSER_SNAME(), SYSUTCDATETIME()
      FROM inserted i
      FULL OUTER JOIN deleted d ON i.id = d.id;
END;
GO

-- ❌ THE classic bug — assumes a single row; silently wrong for multi-row DML
--    DECLARE @id INT = (SELECT id FROM inserted);   -- error or arbitrary row
-- ✅ always JOIN to inserted/deleted instead of scalar-assigning from them.

-- Column-conditional logic
CREATE OR ALTER TRIGGER dbo.TR_Orders_StatusChange ON dbo.Orders AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    IF NOT UPDATE(status) RETURN;          -- fires only when 'status' was in the SET list
    INSERT INTO dbo.StatusHistory (order_id, old_status, new_status, changed_at)
    SELECT i.id, d.status, i.status, SYSUTCDATETIME()
      FROM inserted i JOIN deleted d ON i.id = d.id
     WHERE i.status &lt;&gt; d.status;           -- UPDATE(col) is true even if the value is unchanged
END;

-- INSTEAD OF trigger: make a view updatable (both engines support this)
CREATE OR ALTER TRIGGER dbo.TR_vOrders_Insert ON dbo.vOrders INSTEAD OF INSERT AS
BEGIN
    INSERT INTO dbo.Orders (customer_id, total) SELECT customer_id, total FROM inserted;
END;</pre>
<p><strong>4. Behaviour you must know</strong></p>
<ul>
<li><strong>Triggers run inside the caller's transaction.</strong> An error in the trigger rolls back the whole statement (T-SQL: <code>ROLLBACK</code> inside a trigger aborts the batch; PG: raising an exception aborts the statement/transaction).</li>
<li><strong>Order of multiple triggers</strong>: PostgreSQL fires them alphabetically by name; SQL Server is unordered except for <code>sp_settriggerorder</code> (first/last only). Do not rely on ordering — merge the logic instead.</li>
<li><strong>Recursion and nesting</strong>: a trigger that updates its own table can re-fire. SQL Server: <code>RECURSIVE_TRIGGERS</code> is off by default, nesting is limited to 32 levels; PostgreSQL happily recurses — guard with a condition or <code>pg_trigger_depth()</code>.</li>
<li><strong>Bulk operations</strong>: SQL Server <code>TRUNCATE</code>, <code>BULK INSERT</code> (without <code>FIRE_TRIGGERS</code>) and some replication paths do <strong>not</strong> fire triggers; PostgreSQL has a dedicated statement-level <code>TRUNCATE</code> trigger.</li>
<li><strong>Performance</strong>: a row trigger doing a query per row turns one statement into N statements. Prefer statement-level triggers with transition tables (PG) or set-based joins to <code>inserted</code>/<code>deleted</code> (MSSQL).</li>
<li><strong>Disabling</strong>: <code>ALTER TABLE t DISABLE TRIGGER x</code> (both). Remember to re-enable after a bulk load — and that data loaded while disabled skipped the audit.</li>
<li><strong>Debugging</strong>: triggers are invisible at the call site. Name them consistently (<code>tr_table_event</code>), keep them in version control, and document them where developers actually look.</li>
</ul>
<p><strong>5. When NOT to use a trigger</strong>: complex business rules, calls to external systems, anything a developer must reason about when reading application code, and cross-row validation that a constraint could enforce (a <code>CHECK</code>, a <code>UNIQUE</code> index or a foreign key is faster, declarative and self-documenting). Good uses: audit trails, <code>updated_at</code> stamps, denormalized counters, and making a view writable.</p>
<div class="key-point">The two things interviewers look for: <em>"in PostgreSQL a trigger is a function returning TRIGGER with NEW/OLD, and only a BEFORE trigger can change the row"</em>, and <em>"in SQL Server a trigger fires once per statement — <code>inserted</code> and <code>deleted</code> are tables, so any code that assumes one row is a bug."</em> Add "triggers run in the caller's transaction and are invisible side effects" and you have covered correctness, performance and maintainability.</div>`,
      },
      {
        q: 'PL/pgSQL vs T-SQL cheat sheet: variables, control flow, loops, cursors, error handling, dynamic SQL',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The two procedural dialects express the same concepts with different keywords, so the fastest way to be productive in both is a mapping. Variables are declared in a <code>DECLARE</code> block in PL/pgSQL and with <code>DECLARE @name type</code> anywhere in T-SQL, assignment is <code>:=</code> or <code>SELECT ... INTO</code> versus <code>SET</code> or <code>SELECT @v =</code>, and control flow differs mainly in syntax. Error handling is the biggest difference in shape: PL/pgSQL uses an <code>EXCEPTION WHEN</code> block attached to a <code>BEGIN</code> block, which quietly creates a subtransaction, while T-SQL uses <code>BEGIN TRY ... BEGIN CATCH</code> with <code>ERROR_MESSAGE()</code> and <code>THROW</code>. Dynamic SQL must be parameterized in both — <code>EXECUTE ... USING</code> with <code>format()</code> and <code>%I</code>/<code>%L</code> in PostgreSQL, <code>sp_executesql</code> with typed parameters in SQL Server — because string concatenation is how SQL injection gets into stored code.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hai ngôn ngữ này diễn đạt cùng những khái niệm bằng từ khóa khác nhau, nên cách nhanh nhất để dùng được cả hai là nhớ một bảng đối chiếu. Biến: PL/pgSQL khai báo trong khối <code>DECLARE</code> ở đầu, T-SQL dùng <code>DECLARE @name type</code> ở bất kỳ đâu. Gán giá trị: <code>:=</code> hoặc <code>SELECT ... INTO</code> so với <code>SET</code> hoặc <code>SELECT @v =</code>. Câu lệnh điều khiển và vòng lặp chỉ khác về cú pháp. Khác nhau nhiều nhất là xử lý lỗi: PL/pgSQL dùng khối <code>EXCEPTION WHEN</code> gắn với <code>BEGIN</code>, và mỗi khối như vậy ngầm tạo một subtransaction; T-SQL dùng <code>BEGIN TRY ... BEGIN CATCH</code> với <code>ERROR_MESSAGE()</code> và <code>THROW</code>. Dynamic SQL ở cả hai đều phải tham số hóa: PostgreSQL dùng <code>EXECUTE ... USING</code> cùng <code>format()</code> với <code>%I</code>/<code>%L</code>, SQL Server dùng <code>sp_executesql</code> với tham số có kiểu, vì nối chuỗi thủ công chính là đường để SQL injection lọt vào code trong database.</p></details>
<p><strong>1. Quick mapping</strong></p>
<table>
<tr><th>Concept</th><th>PL/pgSQL (PostgreSQL)</th><th>T-SQL (SQL Server)</th></tr>
<tr><td>Declare</td><td><code>DECLARE v_x INT := 0;</code> (in the DECLARE section)</td><td><code>DECLARE @x INT = 0;</code> (anywhere)</td></tr>
<tr><td>Assign</td><td><code>v_x := 5;</code></td><td><code>SET @x = 5;</code></td></tr>
<tr><td>Assign from query</td><td><code>SELECT col INTO v_x FROM t WHERE …;</code></td><td><code>SELECT @x = col FROM t WHERE …;</code></td></tr>
<tr><td>Row type</td><td><code>DECLARE r orders%ROWTYPE;</code> / <code>RECORD</code></td><td>Table variable or individual scalars</td></tr>
<tr><td>If</td><td><code>IF … THEN … ELSIF … ELSE … END IF;</code></td><td><code>IF … BEGIN … END ELSE BEGIN … END</code></td></tr>
<tr><td>Loop</td><td><code>LOOP … EXIT WHEN cond; END LOOP;</code>, <code>WHILE</code>, <code>FOR i IN 1..10</code></td><td><code>WHILE cond BEGIN … BREAK / CONTINUE … END</code></td></tr>
<tr><td>Iterate a query</td><td><code>FOR r IN SELECT … LOOP … END LOOP;</code></td><td>Cursor, or better: a set-based statement</td></tr>
<tr><td>Rows affected</td><td><code>GET DIAGNOSTICS n = ROW_COUNT;</code> / <code>FOUND</code></td><td><code>SET @n = @@ROWCOUNT;</code></td></tr>
<tr><td>Raise error</td><td><code>RAISE EXCEPTION 'msg %', v USING ERRCODE='…';</code></td><td><code>THROW 50001, 'msg', 1;</code> (or <code>RAISERROR</code>)</td></tr>
<tr><td>Catch error</td><td><code>EXCEPTION WHEN unique_violation THEN …</code></td><td><code>BEGIN TRY … END TRY BEGIN CATCH … END CATCH</code></td></tr>
<tr><td>Error info</td><td><code>SQLERRM</code>, <code>SQLSTATE</code></td><td><code>ERROR_MESSAGE()</code>, <code>ERROR_NUMBER()</code>, <code>ERROR_LINE()</code></td></tr>
<tr><td>Print / debug</td><td><code>RAISE NOTICE 'x = %', v_x;</code></td><td><code>PRINT</code> / <code>RAISERROR(…,0,1) WITH NOWAIT</code></td></tr>
<tr><td>Temp storage</td><td><code>CREATE TEMP TABLE</code>, arrays, <code>RECORD</code></td><td><code>#temp</code> table, <code>@table</code> variable</td></tr>
<tr><td>Dynamic SQL</td><td><code>EXECUTE format(…) USING …;</code></td><td><code>EXEC sp_executesql @sql, @params, …;</code></td></tr>
<tr><td>String concat</td><td><code>||</code> or <code>format()</code></td><td><code>+</code> or <code>CONCAT()</code></td></tr>
<tr><td>Now</td><td><code>now()</code>, <code>clock_timestamp()</code></td><td><code>SYSUTCDATETIME()</code>, <code>GETDATE()</code></td></tr>
</table>
<p><strong>2. Control flow and loops</strong></p>
<pre>-- PL/pgSQL
DO $$
DECLARE
    v_total NUMERIC := 0;
    r       RECORD;
BEGIN
    FOR r IN SELECT id, amount FROM invoices WHERE paid = false LOOP
        v_total := v_total + r.amount;
        CONTINUE WHEN r.amount = 0;
        EXIT WHEN v_total &gt; 1000000;
    END LOOP;

    FOR i IN 1..10 LOOP RAISE NOTICE 'i=%', i; END LOOP;
    WHILE v_total &gt; 0 LOOP v_total := v_total - 1; END LOOP;
END $$;

-- T-SQL
DECLARE @Total DECIMAL(18,2) = 0, @i INT = 1;
WHILE @i &lt;= 10
BEGIN
    PRINT CONCAT('i=', @i);
    SET @i += 1;
    IF @i = 5 CONTINUE;
    IF @i &gt; 8 BREAK;
END</pre>
<p><strong>3. Cursors — and why you usually should not use them</strong></p>
<pre>-- PL/pgSQL: the implicit FOR loop above IS a cursor, and it is the idiomatic form.
-- Explicit cursor when you need FETCH control:
DECLARE cur CURSOR FOR SELECT id FROM orders WHERE status = 'NEW';
OPEN cur;  FETCH cur INTO v_id;  CLOSE cur;

-- T-SQL explicit cursor (verbose on purpose — treat it as a warning sign)
DECLARE @Id INT;
DECLARE c CURSOR LOCAL FAST_FORWARD FOR SELECT id FROM dbo.Orders WHERE status='NEW';
OPEN c;
FETCH NEXT FROM c INTO @Id;
WHILE @@FETCH_STATUS = 0
BEGIN
    EXEC dbo.ProcessOrder @Id;
    FETCH NEXT FROM c INTO @Id;
END
CLOSE c; DEALLOCATE c;

-- ✅ Prefer a single set-based statement: one UPDATE/INSERT…SELECT/MERGE beats
--    10,000 round trips through a cursor by orders of magnitude.
--    Use a batched WHILE loop (TOP 10000 … WHERE not-yet-processed) for huge DML instead.</pre>
<p><strong>4. Error handling side by side</strong></p>
<pre>-- PL/pgSQL
BEGIN
    INSERT INTO users(email) VALUES (p_email);
EXCEPTION
    WHEN unique_violation THEN
        UPDATE users SET last_seen = now() WHERE email = p_email;
    WHEN OTHERS THEN
        RAISE WARNING 'failed: % / %', SQLSTATE, SQLERRM;
        RAISE;                       -- rethrow
END;
-- ⚠ Every BEGIN…EXCEPTION block opens a SUBTRANSACTION (savepoint).
--   Inside a per-row loop that is a measurable cost — catch outside the loop when you can.

-- T-SQL
BEGIN TRY
    INSERT INTO dbo.Users(email) VALUES (@Email);
END TRY
BEGIN CATCH
    IF ERROR_NUMBER() = 2627            -- unique constraint
        UPDATE dbo.Users SET last_seen = SYSUTCDATETIME() WHERE email = @Email;
    ELSE
    BEGIN
        IF XACT_STATE() &lt;&gt; 0 ROLLBACK TRANSACTION;
        THROW;                          -- rethrow preserving number/message (RAISERROR does not)
    END
END CATCH</pre>
<p><strong>5. Dynamic SQL — parameterize, never concatenate</strong></p>
<pre>-- PostgreSQL: %I quotes an IDENTIFIER, %L quotes a LITERAL, USING binds parameters
EXECUTE format('SELECT count(*) FROM %I WHERE status = $1', p_table)
   INTO v_count
  USING p_status;                      -- ✅ value is bound, not interpolated

-- SQL Server: sp_executesql with typed parameters (also gets a cached plan)
DECLARE @sql NVARCHAR(MAX) =
    N'SELECT COUNT(*) FROM ' + QUOTENAME(@TableName) + N' WHERE status = @Status';
EXEC sp_executesql @sql, N'@Status NVARCHAR(20), @Cnt INT OUTPUT', @Status=@Status, @Cnt=@Cnt OUTPUT;
-- QUOTENAME for identifiers (they cannot be parameters); values ALWAYS as parameters.
-- ❌ EXEC('SELECT … WHERE name = ''' + @Name + '''')  → injection + one plan per literal</pre>
<p><strong>6. Habits that keep procedural SQL maintainable</strong></p>
<ul>
<li>Prefer <strong>one set-based statement</strong> over any loop; reach for procedural code only when the logic genuinely cannot be expressed as a query.</li>
<li>Name things predictably (<code>p_</code> parameters, <code>v_</code> variables in PG; <code>@p</code> conventions in T-SQL) — you cannot rename them easily once other objects depend on them.</li>
<li>Keep the source in Git and deploy with <code>CREATE OR REPLACE</code> / <code>CREATE OR ALTER</code> migrations; a database-only definition has no review history.</li>
<li>Log with <code>RAISE NOTICE</code> / <code>PRINT … WITH NOWAIT</code> during development, and remove or gate it in production.</li>
<li>Test procedural code like application code (pgTAP, tSQLt, or plain assertion scripts in your migration pipeline).</li>
</ul>
<div class="key-point">Memorize the four rows that matter most: <strong>assign</strong> (<code>:=</code> / <code>SET @x</code>), <strong>catch</strong> (<code>EXCEPTION WHEN</code> / <code>TRY…CATCH</code>), <strong>raise</strong> (<code>RAISE EXCEPTION</code> / <code>THROW</code>), and <strong>dynamic SQL</strong> (<code>EXECUTE format() USING</code> / <code>sp_executesql</code>). Everything else is syntax you can look up — but writing dynamic SQL by concatenating values, or a cursor where a single UPDATE would do, is what actually gets flagged in review.</div>`,
      },
    ],
  },

  // ───────────────────────── 7. OPTIMIZE SQL ─────────────────────────,
  {
    id: 'optimize-sql',
    name: 'Optimize SQL',
    icon: '⚡',
    questions: [
      // ──── 1. READING EXECUTION PLANS ────
      {
        q: 'How to read and interpret an EXPLAIN / Execution Plan?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p><code>EXPLAIN</code> shows the planner's chosen plan with estimates, while <code>EXPLAIN ANALYZE</code> runs the query and adds real timings and row counts. The most important check is whether the estimated and actual rows differ by a large amount, which usually means the statistics are stale and should be refreshed with <code>ANALYZE</code>. Read the plan from the most-indented node outward, and watch for a <code>Seq Scan</code> on a large table. Using <code>BUFFERS</code> helps show how much data came from cache versus disk.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>EXPLAIN</code> hiển thị plan mà planner đã chọn cùng các con số ước lượng; <code>EXPLAIN ANALYZE</code> chạy truy vấn thật và bổ sung thời gian cũng như số dòng thực tế của từng bước. Điều đầu tiên cần kiểm tra là số dòng ước lượng và thực tế có chênh lệch lớn hay không, vì chênh lệch lớn thường có nghĩa là thống kê đã cũ và cần chạy <code>ANALYZE</code>. Đọc plan từ nút thụt vào sâu nhất (chạy trước) ra ngoài, và đặc biệt chú ý <code>Seq Scan</code> trên bảng lớn. Thêm tùy chọn <code>BUFFERS</code> để biết dữ liệu được đọc từ cache hay từ đĩa.</p></details>
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
        q: 'EXPLAIN says rows=12 but the step actually returned 480,000 — why are estimates wrong and how do you fix the plan?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The optimizer chooses the join type, join order, and memory from row estimates, so an estimate that is far off produces a bad plan, such as a Nested Loop chosen for half a million rows. The most common cause is old statistics after a bulk load or large delete, so <code>ANALYZE</code> should be run first. A subtler cause is correlated columns, because the planner assumes columns are independent and multiplies their selectivity; PostgreSQL extended statistics fixes this. To spot it, compare estimated and actual rows node by node, and treat query hints as a last resort because they go stale as data changes.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Optimizer chọn kiểu join, thứ tự join và lượng bộ nhớ dựa trên số dòng ước lượng, nên khi ước lượng sai quá xa thì plan sẽ rất tệ, ví dụ chọn Nested Loop cho nửa triệu dòng. Nguyên nhân phổ biến nhất là thống kê cũ sau khi nạp hay xóa dữ liệu hàng loạt, vì vậy việc đầu tiên nên làm là chạy <code>ANALYZE</code>. Nguyên nhân tinh vi hơn là các cột có tương quan với nhau: planner giả định các cột độc lập và nhân độ chọn lọc của từng cột lại, nên ước lượng bị thấp hơn nhiều so với thực tế; PostgreSQL có extended statistics để khắc phục. Để chẩn đoán, so sánh rows ước lượng và thực tế ở từng nút trong plan. Query hint chỉ nên là giải pháp cuối cùng, vì hint sẽ lỗi thời khi dữ liệu thay đổi.</p></details>
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
        a: `<div class="interview-answer"><p>Both flags mean no index can return rows in the order the query needs. Using filesort is a separate sort step that may run in memory or spill to disk, and Using temporary is an implicit temp table used for <code>GROUP BY</code>, <code>DISTINCT</code>, or some unions. They are costly under <code>LIMIT</code> because the whole result is built before the <code>LIMIT</code> is applied. The fix is a composite index with equality-filter columns first, then the <code>ORDER BY</code> or <code>GROUP BY</code> columns in matching direction, so the index feeds rows already sorted.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Cả hai cờ này đều có nghĩa là không có index nào trả về dữ liệu theo đúng thứ tự mà truy vấn cần. Using filesort là một bước sắp xếp riêng, có thể chạy trong bộ nhớ hoặc tràn xuống đĩa; Using temporary là bảng tạm ngầm mà MySQL tạo ra để xử lý <code>GROUP BY</code>, <code>DISTINCT</code> hoặc một số kiểu UNION. Chúng đặc biệt tốn kém khi có <code>LIMIT</code>, vì MySQL phải dựng toàn bộ kết quả rồi mới cắt LIMIT. Cách sửa là tạo composite index với các cột lọc bằng đứng trước, tiếp theo là các cột <code>ORDER BY</code> hoặc <code>GROUP BY</code> theo đúng chiều sắp xếp, để index trả về dữ liệu đã có thứ tự sẵn.</p></details>
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
        q: 'The column is indexed and the predicate is SARGable — why does the optimizer still choose a full table scan?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Often the optimizer is correct to skip the index. Index access costs about one random read per matching row, while a sequential scan reads pages in bulk, so past a few percent of rows a full scan is genuinely cheaper. Other causes are an <code>OR</code> across different columns, which one B-tree cannot serve, and tiny tables that always scan. To prove it is a cost decision, the index can be forced with <code>enable_seqscan = off</code> or <code>FORCE INDEX</code> and compared; if the forced plan is slower, the planner was right.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Trong nhiều trường hợp, optimizer bỏ qua index là quyết định đúng. Đi qua index tốn khoảng một lần đọc ngẫu nhiên cho mỗi dòng khớp, trong khi sequential scan đọc các trang liên tục theo lô, nên khi số dòng khớp vượt quá vài phần trăm bảng thì quét toàn bảng lại rẻ hơn. Các lý do khác: điều kiện <code>OR</code> trải trên nhiều cột khác nhau mà một B-tree không phục vụ được, hoặc bảng quá nhỏ nên quét toàn bộ luôn nhanh hơn. Muốn kiểm chứng đây là quyết định dựa trên chi phí, hãy ép dùng index bằng <code>enable_seqscan = off</code> (PostgreSQL) hoặc <code>FORCE INDEX</code> (MySQL) rồi so sánh; nếu plan bị ép chậm hơn thì planner đã đúng.</p></details>
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

      // ──── 2. INDEXING STRATEGY ────
      {
        q: 'When should you create an index? When should you NOT?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>An index is worth creating when a column is used often in <code>WHERE</code>, <code>JOIN</code>, or <code>ORDER BY</code>, has many distinct values, and the table is large but returns only a small part of its rows. It is better to avoid indexing small tables, columns with few distinct values such as booleans, rarely queried columns, and write-heavy tables. Every index costs disk space and slows writes, so it is a trade-off rather than free. Measure usage before and after, and drop indexes that are never used.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Nên tạo index khi cột được dùng thường xuyên trong <code>WHERE</code>, <code>JOIN</code> hoặc <code>ORDER BY</code>, có nhiều giá trị khác nhau (độ chọn lọc cao), và bảng lớn nhưng mỗi truy vấn chỉ lấy một phần nhỏ. Không nên đánh index cho bảng nhỏ, cột có ít giá trị khác nhau như boolean, cột hiếm khi dùng để lọc, hay bảng ghi rất nhiều mà đọc ít. Mỗi index đều tốn dung lượng và làm chậm mọi INSERT/UPDATE/DELETE, nên index không miễn phí mà là một sự đánh đổi. Hãy đo trước và sau khi thêm, và định kỳ xóa các index chưa bao giờ được dùng.</p></details>
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
        a: `<div class="interview-answer"><p>A composite index covers several columns and follows the leftmost prefix rule. An index on <code>(a, b, c)</code> helps filters on <code>a</code>, on <code>a</code> and <code>b</code>, or on all three, but not on <code>b</code> alone. The design rule is to put equality columns first and a range condition last, because a range stops later columns from being used. Column order decides how useful the index is.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Composite index là index trên nhiều cột và tuân theo quy tắc tiền tố trái (leftmost prefix). Index trên <code>(a, b, c)</code> dùng được khi lọc theo <code>a</code>, theo <code>a</code> và <code>b</code>, hoặc theo cả ba, nhưng không dùng được nếu chỉ lọc theo <code>b</code> hay <code>c</code>. Nguyên tắc thiết kế: đặt các cột so sánh bằng (=) lên trước, cột điều kiện khoảng (&gt;, &lt;, BETWEEN) để cuối, vì sau một điều kiện khoảng thì các cột tiếp theo trong index không còn được tận dụng. Thứ tự cột quyết định index có hữu ích hay không.</p></details>
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
        a: `<div class="interview-answer"><p>A covering index holds every column a query needs, so the database can answer the query from the index alone without reading the table, which appears as an <code>Index Only Scan</code>. Filter and sort columns go in as key columns, while columns that are only returned can go in <code>INCLUDE</code> to keep the index smaller. The cost is a wider index that is slower to write, so it is best to cover only the few hot read queries. In PostgreSQL an index-only scan still checks the visibility map, so heavy recent updates can force table reads until <code>VACUUM</code> runs.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Covering index là index chứa đủ mọi cột mà truy vấn cần, nên database trả lời được truy vấn chỉ bằng index mà không phải đọc bảng; trong plan nó hiện là <code>Index Only Scan</code>. Các cột dùng để lọc và sắp xếp nên là cột khóa của index, còn các cột chỉ cần lấy ra để hiển thị thì đưa vào <code>INCLUDE</code> để index gọn hơn. Đổi lại, index sẽ to hơn và ghi chậm hơn, nên chỉ nên làm covering cho vài truy vấn đọc nhiều nhất. Riêng PostgreSQL, index-only scan vẫn phải kiểm tra visibility map, nên nếu bảng vừa được cập nhật nhiều mà chưa <code>VACUUM</code> thì vẫn phải đọc thêm từ bảng.</p></details>
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
        q: 'What are partial, functional, and other special index types? When do you use them?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Beyond a plain B-tree there are several special index types. A partial index covers only rows that match a condition, giving a small index when queries always target a subset, and a partial unique index can enforce rules such as one active session per user. A functional index indexes an expression like <code>LOWER(email)</code> for case-insensitive lookup, and <code>INCLUDE</code> adds return-only columns for covering scans. GIN and trigram indexes handle contains-style and full-text search, while a hash index is equality only. Partial indexes are often underused because a smaller index fits in memory and keeps writes cheap.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Ngoài B-tree thông thường còn có vài loại index đặc biệt. Partial index chỉ đánh index cho các dòng thỏa một điều kiện, nên rất nhỏ và hợp với truy vấn luôn nhắm vào một tập con (ví dụ chỉ các đơn hàng đang chờ); partial unique index còn dùng để ép các quy tắc như mỗi user chỉ có một phiên đang hoạt động. Functional index đánh index trên một biểu thức như <code>LOWER(email)</code> để tìm không phân biệt hoa thường. <code>INCLUDE</code> thêm các cột chỉ để trả về, phục vụ covering scan. GIN và trigram index dùng cho tìm kiếm kiểu chứa chuỗi và full-text, còn hash index chỉ dùng cho so sánh bằng. Partial index là loại hay bị bỏ quên nhất, dù index nhỏ thì vừa bộ nhớ và chi phí ghi cũng thấp.</p></details>
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
        q: 'How exactly does each extra index slow down writes? (write amplification, HOT updates, index bloat)',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Every secondary index is a separate B-tree the database must keep in sync on every write, so one insert into a table with several indexes becomes many writes, known as write amplification. In PostgreSQL an update to an unindexed column can be a cheap HOT update, but indexing a hot column forces maintenance of every index on each update. Deleted and updated entries also leave dead space, causing index bloat that slows reads too. Before adding an index, check that it will actually be used, and drop the ones nobody uses.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mỗi secondary index là một B-tree riêng mà database phải cập nhật đồng bộ ở mọi lần ghi, nên một INSERT vào bảng có nhiều index thực chất là nhiều lần ghi, gọi là write amplification. Trong PostgreSQL, UPDATE lên cột không có index có thể là HOT update rất rẻ, nhưng chỉ cần đánh index lên một cột hay thay đổi là mọi UPDATE đều phải cập nhật tất cả index. Các dòng bị xóa hoặc cập nhật còn để lại khoảng trống chết trong index, gây index bloat và làm cả việc đọc chậm đi. Vì thế trước khi thêm index hãy chắc chắn nó được dùng, và mạnh dạn xóa những index không ai dùng.</p></details>
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

      // ──── 3. WRITING FASTER QUERIES ────
      {
        q: 'What are the most common causes of slow SQL queries?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Slow SQL queries usually come from a few common problems. Frequent causes are missing indexes on filtered or joined columns, <code>SELECT *</code> reading more data than needed, and wrapping an indexed column in a function so the index cannot be used. Other causes include the N+1 pattern, implicit type conversion, large <code>OFFSET</code> paging, correlated subqueries, lock contention, and old table statistics. The best approach is to read the query plan and fix the real cause instead of guessing.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Truy vấn chậm thường quy về một số nguyên nhân quen thuộc. Phổ biến nhất là thiếu index trên cột dùng để lọc hoặc join, <code>SELECT *</code> kéo về nhiều dữ liệu hơn cần thiết, và bọc cột đã có index trong hàm làm index không dùng được. Ngoài ra còn có N+1 query, ép kiểu ngầm (implicit cast), phân trang bằng <code>OFFSET</code> lớn, correlated subquery, tranh chấp lock, và thống kê bảng đã cũ. Cách tiếp cận đúng là đọc query plan để tìm đúng nguyên nhân rồi sửa, thay vì đoán mò.</p></details>
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
        q: 'What makes a WHERE clause non-SARGable? How do you fix it?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>SARGable means a condition can use an index seek. Wrapping the column in a function or expression, such as <code>YEAR(created_at) = 2024</code> or an implicit type cast, makes it non-SARGable and forces a full scan. The fix is to keep the column bare and move all computation to the constant side, for example rewriting the year filter as a date range. When the function is truly needed, a functional index that matches the exact expression can be created, and a leading wildcard such as <code>LIKE '%x'</code> needs a trigram or full-text index.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>SARGable nghĩa là điều kiện lọc có thể tận dụng index seek. Khi cột bị bọc trong hàm hay biểu thức, ví dụ <code>YEAR(created_at) = 2024</code>, hoặc bị ép kiểu ngầm, điều kiện đó không còn SARGable và database phải quét toàn bảng. Cách sửa là để cột nguyên bản và dồn mọi phép tính về phía hằng số, chẳng hạn đổi điều kiện theo năm thành một khoảng ngày <code>created_at &gt;= '2024-01-01' AND created_at &lt; '2025-01-01'</code>. Nếu bắt buộc phải dùng hàm, hãy tạo functional index đúng với biểu thức đó. Riêng <code>LIKE '%x'</code> với ký tự đại diện ở đầu thì B-tree không giúp được, cần index trigram hoặc full-text.</p></details>
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
        q: 'What are the differences between EXIST vs IN vs JOIN for subqueries?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p><code>EXISTS</code> stops at the first match, so it works well when the subquery returns many rows. <code>IN</code> builds a list or hash and suits small value sets. <code>JOIN</code> is used when columns are needed from both tables, but a one-to-many join multiplies rows and needs <code>DISTINCT</code>. Modern optimizers often turn <code>IN</code> and <code>EXISTS</code> into the same plan, so the choice should be based on meaning, and <code>NOT EXISTS</code> is safer than <code>NOT IN</code> because of the NULL trap.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>EXISTS</code> dừng ngay khi tìm thấy dòng khớp đầu tiên, nên hợp với subquery trả về nhiều dòng. <code>IN</code> dựng một danh sách hoặc hash từ subquery, hợp với tập giá trị nhỏ. <code>JOIN</code> dùng khi cần lấy cột từ cả hai bảng, nhưng với quan hệ một-nhiều sẽ nhân số dòng nên phải thêm <code>DISTINCT</code>. Optimizer hiện đại thường sinh cùng một plan cho <code>IN</code> và <code>EXISTS</code>, vì vậy hãy chọn theo cách nào dễ đọc hơn, và luôn nhớ <code>NOT EXISTS</code> an toàn hơn <code>NOT IN</code> vì bẫy NULL.</p></details>
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
        q: 'What is the difference between UNION and UNION ALL? When does UNION give wrong results?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p><code>UNION</code> removes duplicates, which adds an implicit sort or hash step that is slow on large sets, while <code>UNION ALL</code> just joins the results together and is always faster. <code>UNION</code> gives wrong results when the data has real duplicates that must be kept, such as summing a matching amount from two accounts, because it silently drops one. The safe default is <code>UNION ALL</code>, using <code>UNION</code> only when duplicates truly need to be removed.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>UNION</code> loại bỏ các dòng trùng nhau, nghĩa là có thêm một bước sort hoặc hash ngầm, khá tốn kém với dữ liệu lớn; <code>UNION ALL</code> chỉ nối kết quả lại nên luôn nhanh hơn. <code>UNION</code> cho kết quả sai khi dữ liệu có những dòng giống nhau nhưng thực sự cần giữ, ví dụ cộng doanh thu từ hai bảng mà hai giao dịch tình cờ cùng số tiền và cùng ngày: một dòng sẽ bị âm thầm bỏ mất. Mặc định nên dùng <code>UNION ALL</code>, chỉ dùng <code>UNION</code> khi thật sự cần loại trùng.</p></details>
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
        q: 'How to optimize JOINs for better performance?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The biggest win is indexing both columns in the join condition. Filtering early so fewer rows are joined also helps, for example pre-filtering in a CTE before touching a large table. Joining on a function such as <code>UPPER</code> on both sides should be avoided because it blocks the index; a functional index or computed column is better. Selecting only the needed columns keeps covering plans possible and reduces I/O.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Cải thiện lớn nhất là đánh index cho cột join ở cả hai bảng. Tiếp theo là lọc sớm để giảm số dòng phải join, ví dụ lọc trước trong một CTE hoặc subquery rồi mới join vào bảng lớn. Tránh join qua hàm như <code>UPPER(a.email) = UPPER(b.email)</code> vì index không dùng được; thay bằng functional index hoặc một cột đã tính sẵn. Chỉ SELECT những cột thật sự cần để có cơ hội dùng covering index và giảm I/O.</p></details>
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
        q: 'Explain the N+1 query problem and how to solve it.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The N+1 problem is one query for the parent rows plus one more query for each parent's children, which means many round trips. It is usually caused by an ORM loading related data one row at a time. The fix is to batch the work with a single <code>JOIN</code>, a <code>WHERE ... IN</code> over the collected parent ids, or the ORM's eager fetch such as <code>JOIN FETCH</code>. It often looks fine with small data and only fails in production.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>N+1 là khi ứng dụng chạy một truy vấn lấy N dòng cha, rồi với mỗi dòng cha lại chạy thêm một truy vấn lấy dữ liệu con, tổng cộng N+1 lần đi tới database. Nguyên nhân thường là ORM tải quan hệ theo kiểu lazy, từng dòng một. Cách sửa là gom lại thành ít truy vấn hơn: một <code>JOIN</code> duy nhất, một <code>WHERE ... IN (danh sách id cha)</code>, hoặc dùng cơ chế eager fetch của ORM như <code>JOIN FETCH</code>. Vấn đề này thường không thấy khi dữ liệu ít và chỉ bùng phát khi lên production.</p></details>
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
        q: 'How to optimize pagination for large datasets?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p><code>OFFSET</code> paging is slow because <code>OFFSET 1000000</code> still reads and skips a million rows. Keyset (cursor) paging uses a condition like <code>id &gt; last_seen_id</code> on an indexed column and stays fast no matter how deep the page is. A deferred join can help when <code>OFFSET</code> must be used. Keyset paging needs a stable, unique sort key and works well for APIs.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Phân trang bằng <code>OFFSET</code> chậm vì <code>OFFSET 1000000</code> vẫn phải đọc và bỏ qua một triệu dòng trước đó. Phân trang keyset (cursor) dùng điều kiện như <code>WHERE id &gt; last_seen_id ... LIMIT 20</code> trên cột đã có index, nên tốc độ không phụ thuộc vào việc trang nằm sâu đến đâu. Nếu bắt buộc phải dùng <code>OFFSET</code>, kỹ thuật deferred join (chỉ OFFSET trên cột khóa rồi mới join lấy dữ liệu) sẽ giúp nhẹ hơn. Keyset cần một khóa sắp xếp duy nhất và ổn định, và rất hợp cho các API kiểu "tải thêm".</p></details>
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
        q: 'How to optimize COUNT(*) on large tables?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p><code>COUNT(*)</code> is slow on large tables in an MVCC database because visibility is per-transaction, so it must scan every row instead of reading a stored counter. The first question is whether an exact live total is really needed, since an estimate from <code>pg_class</code> is often good enough. A filtered count backed by an index is fast when the slice is small, and an exact fast count needs a summary table kept current by triggers. For paging, the total can be replaced with a check for whether a next page exists.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>COUNT(*)</code> chậm trên bảng lớn ở các database dùng MVCC vì mỗi transaction có góc nhìn (visibility) khác nhau, nên database phải quét từng dòng để kiểm tra thay vì đọc một bộ đếm sẵn. Câu hỏi đầu tiên là có thực sự cần con số chính xác theo thời gian thực không; nhiều khi ước lượng từ <code>pg_class</code> đã đủ. Nếu đếm có điều kiện và điều kiện đó lọc ra ít dòng thì index sẽ giúp nhanh. Nếu cần vừa chính xác vừa nhanh thì phải duy trì một bảng tổng hợp cập nhật bằng trigger. Với phân trang, có thể bỏ hẳn tổng số dòng và chỉ kiểm tra "còn trang tiếp theo hay không".</p></details>
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

      // ──── 4. LARGE DATA — BULK OPERATIONS, PARTITIONING, VIEWS ────
      {
        q: 'How do you optimize bulk INSERT / UPDATE / DELETE operations?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The bottleneck in bulk work is the per-row round trips and per-statement overhead, not the amount of data, so batching is the fix. Multi-row inserts are far faster than row-by-row, and <code>COPY</code> or <code>LOAD DATA</code> is faster still. In Java, JDBC <code>executeBatch</code> with the <code>rewriteBatchedStatements</code> driver flag is needed for real batching. Large deletes should be done in chunks to avoid one big lock and bloat, and a one-time massive load is fastest with indexes dropped first and rebuilt after loading.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Điểm nghẽn của thao tác hàng loạt nằm ở chi phí đi lại và chi phí cho từng câu lệnh, không phải ở lượng dữ liệu, nên giải pháp là gộp lô (batching). INSERT nhiều dòng trong một câu lệnh nhanh hơn hẳn so với từng dòng, và <code>COPY</code> (PostgreSQL) hay <code>LOAD DATA</code> (MySQL) còn nhanh hơn nữa. Trong Java, dùng <code>executeBatch</code> của JDBC và bật cờ <code>rewriteBatchedStatements</code> trên driver MySQL thì mới thực sự gộp lô. DELETE lớn nên chia thành từng khối nhỏ để không giữ lock quá lâu và tránh phình dữ liệu. Với lần nạp dữ liệu khổng lồ một lần, nhanh nhất là drop index trước, nạp xong rồi tạo lại.</p></details>
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
        q: 'What is the difference between DELETE, TRUNCATE, and DROP?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p><code>DELETE</code> removes rows, can use a <code>WHERE</code> clause, logs each row, fires triggers, and can be rolled back. <code>TRUNCATE</code> removes all rows quickly by deallocating pages, resets the identity counter, and skips triggers. <code>DROP</code> removes the whole table including its structure. A common trick is rollback behavior: in PostgreSQL <code>TRUNCATE</code> can be rolled back, but in MySQL it cannot, so the answer depends on the database.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>DELETE</code> xóa từng dòng, có thể kèm <code>WHERE</code>, ghi log cho từng dòng, kích hoạt trigger và rollback được. <code>TRUNCATE</code> xóa toàn bộ dữ liệu rất nhanh bằng cách giải phóng luôn các trang lưu trữ, đồng thời reset bộ đếm identity và không chạy trigger. <code>DROP</code> xóa hẳn bảng, kể cả cấu trúc. Câu hỏi mẹo hay gặp là TRUNCATE có rollback được không: trong PostgreSQL thì được vì nó nằm trong transaction, còn trong MySQL thì không, nên câu trả lời tùy vào database.</p></details>
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
        q: 'What is table partitioning? When to use it?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Partitioning splits one large table into smaller physical pieces while it stays logically one table, usually by date range, and sometimes by list or hash. The benefits are partition pruning, where queries that filter on the partition key skip whole partitions, plus fast data removal by dropping a partition instead of a large <code>DELETE</code>. It only pays off on very large tables, around 10 million rows or more. The partition key must appear in the queries or pruning cannot happen.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Partitioning chia một bảng lớn thành nhiều phần vật lý nhỏ hơn, nhưng về mặt logic vẫn là một bảng; thường chia theo khoảng ngày, đôi khi theo danh sách hoặc hash. Lợi ích chính là partition pruning: truy vấn có điều kiện trên khóa phân vùng chỉ cần đọc các partition liên quan và bỏ qua phần còn lại. Ngoài ra xóa dữ liệu cũ chỉ cần drop một partition thay vì chạy <code>DELETE</code> khổng lồ. Partitioning chỉ đáng dùng cho bảng rất lớn, cỡ chục triệu dòng trở lên. Điều kiện bắt buộc là truy vấn phải có khóa phân vùng trong <code>WHERE</code>, nếu không sẽ không có pruning và phải quét mọi partition.</p></details>
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
        q: 'What is the difference between a view and a materialized view? When do you use each?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A view is just a saved query with no stored data, so it is always fresh but pays the full query cost on every read; it is useful for abstraction and security. A materialized view stores the result physically and can be indexed, so reads are fast, but the data is stale until a <code>REFRESH</code> runs. Use a view for simplifying access, and a materialized view for expensive aggregations such as dashboards and reports. This is the same freshness-versus-speed trade-off as a cache, except it lives in the database.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>View chỉ là một truy vấn được đặt tên, không lưu dữ liệu, nên luôn cho kết quả mới nhất nhưng mỗi lần đọc phải chạy lại toàn bộ truy vấn; nó hữu ích để đơn giản hóa và phân quyền truy cập. Materialized view lưu kết quả xuống đĩa và có thể đánh index, đọc rất nhanh, nhưng dữ liệu chỉ cập nhật khi chạy <code>REFRESH</code>. Dùng view khi cần trừu tượng hóa hay bảo mật; dùng materialized view cho các phép tổng hợp nặng như dashboard và báo cáo. Bản chất đây là đánh đổi giữa độ mới và tốc độ, giống một cache nhưng nằm ngay trong database.</p></details>
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

      // ──── 5. RUNTIME & INFRASTRUCTURE ────
      {
        q: 'What is query plan caching? How do parameterized queries help?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Query plan caching lets the database compile a plan once and reuse it instead of parsing the same query again. Parameterized (prepared) statements make this possible by keeping the query text fixed and passing values separately, which also prevents SQL injection. One downside is that a single reused generic plan can be good for one value and poor for another when the data is skewed. PostgreSQL can force a fresh plan per parameter with <code>plan_cache_mode</code>.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Query plan caching cho phép database lập plan một lần rồi dùng lại cho các lần chạy sau, thay vì phân tích và tối ưu lại cùng một truy vấn. Prepared statement (truy vấn có tham số) giúp việc này khả thi vì phần text của truy vấn giữ nguyên, chỉ có giá trị tham số thay đổi; đồng thời nó cũng chặn SQL injection. Nhược điểm là một plan dùng chung có thể tốt với giá trị này nhưng tệ với giá trị khác khi dữ liệu phân bố lệch (data skew). Trong PostgreSQL có thể buộc lập plan riêng cho từng lần chạy bằng <code>plan_cache_mode</code>.</p></details>
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
        q: 'What is database connection pooling and why is it important?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Opening a database connection is expensive because of the handshake, authentication, and memory setup, so a connection pool keeps live connections ready and reuses them. This avoids the cost of creating a new connection for every request and greatly improves throughput. A common size guide is cores times two plus disk spindles, and a tool such as PgBouncer or HikariCP manages the pool. Too few connections makes clients wait, while too many strains the database with memory pressure and context switching.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mở một kết nối database rất tốn kém vì phải bắt tay TCP, xác thực và cấp phát bộ nhớ, nên connection pool giữ sẵn một số kết nối đang mở và cho các request dùng chung. Nhờ vậy không phải tạo kết nối mới cho mỗi request, thông lượng tăng lên rõ rệt. Về kích thước pool, một công thức tham khảo phổ biến là số core nhân 2 cộng số ổ đĩa; các công cụ như HikariCP (phía ứng dụng) hay PgBouncer (phía database) sẽ quản lý pool. Pool quá nhỏ thì request phải xếp hàng chờ, pool quá lớn thì database chịu áp lực bộ nhớ và context switch.</p></details>
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
        q: 'How to identify and fix slow queries in production?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>This works best in three evidence-based steps. First, find the worst queries by turning on the slow query log and ranking by total time in <code>pg_stat_statements</code>, since a fast query run millions of times can hurt more than one slow query. Second, get the real plan for the top offenders with <code>EXPLAIN (ANALYZE, BUFFERS)</code> and look for full scans, bad estimates, and sorts spilling to disk. Third, fix the cheapest thing first, such as refreshing statistics, adding a missing index, and rewriting the query, and only then scale out with pooling or read replicas.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Nên làm theo ba bước, dựa trên số liệu thay vì cảm tính. Thứ nhất, tìm ra những truy vấn tốn nhất bằng slow query log và <code>pg_stat_statements</code>, xếp theo tổng thời gian, vì một truy vấn nhanh nhưng chạy hàng triệu lần có thể tốn kém hơn một truy vấn chậm chạy một lần. Thứ hai, lấy plan thực tế của các truy vấn đó bằng <code>EXPLAIN (ANALYZE, BUFFERS)</code>, tìm full scan, ước lượng sai và các bước sort tràn xuống đĩa. Thứ ba, sửa cái rẻ nhất trước: làm mới thống kê, thêm index còn thiếu, viết lại truy vấn; chỉ khi đã hết cách mới mở rộng hạ tầng bằng connection pooling hay read replica.</p></details>
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
    ],
  },

  // ───────────────────────── 8. SPRING BOOT ─────────────────────────
];
