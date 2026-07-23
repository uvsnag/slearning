// Interview data: mybatis, jpa-hibernate
// Auto-generated from pv.html
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
  {
    id: 'mybatis',
    name: 'MyBatis',
    icon: '🗺️',
    questions: [
      {
        q: 'What is MyBatis? How is it different from JPA/Hibernate?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>MyBatis is a SQL mapper, and JPA is a full ORM. With MyBatis the developer writes the SQL and MyBatis maps the results to objects. With Hibernate the framework builds the SQL from entity mappings and manages a persistence context. MyBatis fits well when the SQL is complex or the schema is old, while JPA fits well when the domain model is the main focus.</p></div>
<ul>
<li><strong>MyBatis</strong>: SQL mapper framework. You write SQL, MyBatis maps results to objects. Full SQL control.</li>
<li><strong>JPA/Hibernate</strong>: ORM framework. Generates SQL from entity mappings. Less control, more abstraction.</li>
</ul>
<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:.88rem;">
<tr><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;"></th><th style="padding:6px;border-bottom:1px solid #ccc;">MyBatis</th><th style="padding:6px;border-bottom:1px solid #ccc;">JPA/Hibernate</th></tr>
<tr><td style="padding:6px;">SQL</td><td style="padding:6px;">Write your own</td><td style="padding:6px;">Auto-generated (JPQL/HQL)</td></tr>
<tr><td style="padding:6px;">Learning curve</td><td style="padding:6px;">Low (SQL-centric)</td><td style="padding:6px;">High (entity lifecycle, caching)</td></tr>
<tr><td style="padding:6px;">Complex queries</td><td style="padding:6px;">Easy (native SQL)</td><td style="padding:6px;">Hard (criteria API)</td></tr>
<tr><td style="padding:6px;">Schema control</td><td style="padding:6px;">Full</td><td style="padding:6px;">Can auto-generate tables</td></tr>
</table>
<div class="key-point">Choose MyBatis when: complex reporting queries, legacy DB schemas, DBA-managed SQL. Choose JPA when: CRUD-heavy, domain-driven design, rapid development.</div>`,
      },
      {
        q: 'What is the difference between #{} and ${} in MyBatis?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>This is mainly a security topic. <code>#{}</code> binds a value as a PreparedStatement parameter, so it is safe from SQL injection. The dollar-sign form puts the value straight into the SQL text, which can allow SQL injection. It should only be used for things that cannot be bound, such as a table or column name, and only against a fixed whitelist.</p></div>
<ul>
<li><strong>#{param}</strong>: creates a <strong>PreparedStatement parameter</strong> (?). <strong>Safe from SQL injection</strong>. Value is type-safe and quoted.</li>
<li><strong>\${param}</strong>: direct <strong>string substitution</strong>. <strong>VULNERABLE to SQL injection!</strong> Used only for dynamic table/column names.</li>
</ul>
<pre>&lt;!-- Safe: parameterized --&gt;
&lt;select id="findById"&gt;
  SELECT * FROM users WHERE id = #{id}
  &lt;!-- Generates: SELECT * FROM users WHERE id = ?  --&gt;
&lt;/select&gt;

&lt;!-- Unsafe: direct substitution (use only when necessary) --&gt;
&lt;select id="findAll"&gt;
  SELECT * FROM \${tableName} ORDER BY \${sortColumn}
  &lt;!-- Generates: SELECT * FROM users ORDER BY name --&gt;
&lt;/select&gt;</pre>
<div class="key-point">NEVER use <code>\${}</code> with user input. Always validate/whitelist dynamic table/column names before using <code>\${}</code>.</div>`,
      },
      {
        q: 'Explain MyBatis XML Mapper structure. Show a complete example.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A mapper XML file holds the SQL for a mapper interface. The <code>namespace</code> must match the interface full name, and each statement id must match a method name. A <code>resultMap</code> maps columns to object properties, and the CRUD tags hold the queries. Turning on <code>map-underscore-to-camel-case</code> and using <code>useGeneratedKeys</code> for inserts are common good practices.</p></div>
<pre>&lt;?xml version="1.0" encoding="UTF-8" ?&gt;
&lt;!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd"&gt;

&lt;mapper namespace="com.example.mapper.UserMapper"&gt;

  &lt;resultMap id="userMap" type="com.example.entity.User"&gt;
    &lt;id column="user_id" property="userId"/&gt;
    &lt;result column="user_name" property="userName"/&gt;
    &lt;result column="created_at" property="createdAt"/&gt;
  &lt;/resultMap&gt;

  &lt;select id="findById" resultMap="userMap"&gt;
    SELECT user_id, user_name, created_at
    FROM users WHERE user_id = #{id}
  &lt;/select&gt;

  &lt;insert id="insert" useGeneratedKeys="true" keyProperty="userId"&gt;
    INSERT INTO users (user_name, created_at)
    VALUES (#{userName}, #{createdAt})
  &lt;/insert&gt;

  &lt;update id="update"&gt;
    UPDATE users SET user_name = #{userName}
    WHERE user_id = #{userId}
  &lt;/update&gt;

  &lt;delete id="deleteById"&gt;
    DELETE FROM users WHERE user_id = #{id}
  &lt;/delete&gt;

&lt;/mapper&gt;</pre>`,
      },
      {
        q: 'How to write dynamic SQL in MyBatis? Explain &lt;if&gt;, &lt;choose&gt;, &lt;where&gt;, &lt;foreach&gt;.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>MyBatis dynamic SQL adds tags that build the query safely instead of joining strings by hand. <code>&lt;if&gt;</code> includes a part only when a condition is true, and <code>&lt;where&gt;</code> removes a leading AND or OR so the clause stays valid. <code>&lt;choose&gt;</code> works like a switch, and <code>&lt;foreach&gt;</code> builds IN lists and batch inserts. Note that <code>&lt;where&gt;</code> only trims leading connectors, so a trailing AND still needs <code>&lt;trim&gt;</code>.</p></div>
<pre>&lt;select id="search" resultMap="userMap"&gt;
  SELECT * FROM users
  &lt;where&gt;
    &lt;if test="name != null and name != ''"&gt;
      AND user_name LIKE CONCAT('%', #{name}, '%')
    &lt;/if&gt;
    &lt;if test="status != null"&gt;
      AND status = #{status}
    &lt;/if&gt;
    &lt;choose&gt;
      &lt;when test="sortBy == 'name'"&gt;ORDER BY user_name&lt;/when&gt;
      &lt;when test="sortBy == 'date'"&gt;ORDER BY created_at DESC&lt;/when&gt;
      &lt;otherwise&gt;ORDER BY user_id&lt;/otherwise&gt;
    &lt;/choose&gt;
  &lt;/where&gt;
&lt;/select&gt;

&lt;!-- Batch operations --&gt;
&lt;select id="findByIds" resultMap="userMap"&gt;
  SELECT * FROM users WHERE user_id IN
  &lt;foreach collection="ids" item="id" open="(" separator="," close=")"&gt;
    #{id}
  &lt;/foreach&gt;
&lt;/select&gt;

&lt;!-- Dynamic SET for partial updates --&gt;
&lt;update id="updateSelective"&gt;
  UPDATE users
  &lt;set&gt;
    &lt;if test="name != null"&gt;user_name = #{name},&lt;/if&gt;
    &lt;if test="email != null"&gt;email = #{email},&lt;/if&gt;
  &lt;/set&gt;
  WHERE user_id = #{userId}
&lt;/update&gt;</pre>
<div class="key-point"><code>&lt;where&gt;</code> automatically handles leading AND/OR. <code>&lt;set&gt;</code> removes trailing commas.</div>`,
      },
      {
        q: 'How to handle one-to-many and many-to-one relationships in MyBatis?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>MyBatis uses <code>&lt;collection&gt;</code> for one-to-many and <code>&lt;association&gt;</code> for many-to-one or one-to-one. A collection maps a list, and an association maps a single nested object. The common approach is one JOIN with a nested resultMap, using the <code>&lt;id&gt;</code> element so parent rows are grouped correctly. A nested select per row is also possible but can cause the N+1 problem.</p></div>
<pre>&lt;!-- One-to-Many: Order has many Items --&gt;
&lt;resultMap id="orderWithItems" type="Order"&gt;
  &lt;id column="order_id" property="orderId"/&gt;
  &lt;result column="total" property="total"/&gt;
  &lt;collection property="items" ofType="OrderItem"&gt;
    &lt;id column="item_id" property="itemId"/&gt;
    &lt;result column="product_name" property="productName"/&gt;
    &lt;result column="quantity" property="quantity"/&gt;
  &lt;/collection&gt;
&lt;/resultMap&gt;

&lt;select id="getOrderWithItems" resultMap="orderWithItems"&gt;
  SELECT o.order_id, o.total, i.item_id, i.product_name, i.quantity
  FROM orders o
  LEFT JOIN order_items i ON o.order_id = i.order_id
  WHERE o.order_id = #{orderId}
&lt;/select&gt;

&lt;!-- Many-to-One: Item belongs to an Order --&gt;
&lt;resultMap id="itemWithOrder" type="OrderItem"&gt;
  &lt;id column="item_id" property="itemId"/&gt;
  &lt;association property="order" javaType="Order"&gt;
    &lt;id column="order_id" property="orderId"/&gt;
    &lt;result column="total" property="total"/&gt;
  &lt;/association&gt;
&lt;/resultMap&gt;</pre>
<div class="key-point"><code>&lt;collection&gt;</code> = one-to-many (list). <code>&lt;association&gt;</code> = many-to-one / one-to-one (single object).</div>`,
      },
      {
        q: 'What is MyBatis annotation-based mapping vs XML?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Annotations like <code>@Select</code> and <code>@Insert</code> work well for short and simple queries placed next to the code. XML is better for dynamic SQL, joins, and result mapping because it stays readable and keeps SQL out of the Java code. Many teams standardize on XML for consistency. A single mapper can mix both styles.</p></div>
<pre>// Annotation-based (simple queries)
@Mapper
public interface UserMapper {

    @Select("SELECT * FROM users WHERE user_id = #{id}")
    User findById(Long id);

    @Insert("INSERT INTO users(user_name, email) VALUES(#{userName}, #{email})")
    @Options(useGeneratedKeys = true, keyProperty = "userId")
    int insert(User user);

    @Update("UPDATE users SET user_name = #{userName} WHERE user_id = #{userId}")
    int update(User user);

    @Delete("DELETE FROM users WHERE user_id = #{id}")
    int deleteById(Long id);

    // Complex: use @Results for mapping
    @Results(id = "userResult", value = {
        @Result(column = "user_id", property = "userId", id = true),
        @Result(column = "user_name", property = "userName")
    })
    @Select("SELECT * FROM users")
    List&lt;User&gt; findAll();
}</pre>
<div class="key-point">Use annotations for simple CRUD. Use XML for complex dynamic SQL, associations, and collections — it's more readable.</div>`,
      },
      {
        q: 'How does MyBatis caching work? Explain first-level and second-level cache.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>MyBatis has two cache levels. The first-level cache is per <code>SqlSession</code>, always on, and it is cleared on commit or close. The second-level cache is per mapper namespace, shared across sessions, and off by default. The second-level cache lives in heap per JVM, so with several app instances it can return stale data, and many teams cache at the service layer instead.</p></div>
<ul>
<li><strong>First-level cache</strong> (session/local): enabled by default. Scoped to <code>SqlSession</code>. Same query in same session returns cached result. Cleared on <code>commit()</code>, <code>rollback()</code>, or <code>close()</code>.</li>
<li><strong>Second-level cache</strong> (mapper): disabled by default. Scoped to mapper namespace. Shared across sessions.</li>
</ul>
<pre>&lt;!-- Enable in mapper XML --&gt;
&lt;mapper namespace="com.example.mapper.UserMapper"&gt;
  &lt;cache
    eviction="LRU"
    flushInterval="60000"
    size="512"
    readOnly="true"/&gt;

  &lt;!-- Exclude specific queries from cache --&gt;
  &lt;select id="findById" useCache="true"&gt;...&lt;/select&gt;
  &lt;select id="findRealtime" useCache="false"&gt;...&lt;/select&gt;
&lt;/mapper&gt;</pre>
<div class="key-point">Second-level cache pitfall: if multiple mappers query the same tables, one mapper's insert won't invalidate another mapper's cache → stale data. Use <code>&lt;cache-ref&gt;</code> to share cache.</div>`,
      },
      {
        q: 'What is MyBatis-Plus? How does it extend MyBatis?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>MyBatis-Plus adds features on top of MyBatis to remove repetitive CRUD code. A mapper extends <code>BaseMapper</code> and gets methods like selectById, insert, and updateById for free. It also provides <code>QueryWrapper</code> for building conditions, plus pagination, optimistic locking, and soft delete. Since <code>QueryWrapper</code> uses raw column-name strings, complex cases are still better in XML.</p></div>
<p><strong>MyBatis-Plus</strong> is an enhancement on MyBatis that eliminates boilerplate CRUD code.</p>
<pre>// Just extend BaseMapper — no XML needed for basic CRUD
@Mapper
public interface UserMapper extends BaseMapper&lt;User&gt; { }

// Usage — all these methods come free
userMapper.selectById(1L);
userMapper.selectList(new QueryWrapper&lt;User&gt;()
    .eq("status", "active")
    .ge("age", 18)
    .orderByDesc("created_at"));
userMapper.insert(user);
userMapper.updateById(user);
userMapper.deleteById(1L);

// Pagination (built-in)
Page&lt;User&gt; page = userMapper.selectPage(
    new Page&lt;&gt;(1, 10),
    new QueryWrapper&lt;User&gt;().eq("status", "active"));</pre>
<div class="key-point">MyBatis-Plus provides: auto CRUD, pagination plugin, optimistic locking, soft delete, code generator, QueryWrapper for type-safe conditions.</div>`,
      },
      {
        q: 'How to handle batch operations in MyBatis?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>There are two main ways to do batch work. The <code>&lt;foreach&gt;</code> multi-row insert is simple but builds one large SQL string, so it can hit size limits. <code>ExecutorType.BATCH</code> uses JDBC addBatch and executeBatch and works better for large volumes, and flushing every few hundred rows keeps memory low. Batch mode does not return generated keys reliably.</p></div>
<pre>&lt;!-- Method 1: foreach in XML --&gt;
&lt;insert id="batchInsert"&gt;
  INSERT INTO users (user_name, email) VALUES
  &lt;foreach collection="list" item="user" separator=","&gt;
    (#{user.userName}, #{user.email})
  &lt;/foreach&gt;
&lt;/insert&gt;

// Method 2: ExecutorType.BATCH
try (SqlSession session = sqlSessionFactory.openSession(ExecutorType.BATCH)) {
    UserMapper mapper = session.getMapper(UserMapper.class);
    for (int i = 0; i &lt; users.size(); i++) {
        mapper.insert(users.get(i));
        if (i % 500 == 0) {   // flush every 500
            session.flushStatements();
        }
    }
    session.flushStatements();
    session.commit();
}</pre>
<div class="key-point">XML foreach is simpler but has SQL length limits. ExecutorType.BATCH is better for large volumes — it batches JDBC addBatch/executeBatch calls.</div>`,
      },
      {
        q: 'How to configure MyBatis with Spring Boot?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>With the mybatis-spring-boot-starter, most setup is done in YAML. Set <code>mapper-locations</code> for the XML files, <code>type-aliases-package</code> for short class names, and turn on <code>map-underscore-to-camel-case</code> so columns like user_name map to userName. Then use <code>@MapperScan</code> or <code>@Mapper</code> so Spring registers the mapper interfaces.</p></div>
<pre># application.yml
mybatis:
  mapper-locations: classpath:mapper/*.xml         # XML mapper location
  type-aliases-package: com.example.entity          # short class names in XML
  configuration:
    map-underscore-to-camel-case: true              # user_name → userName
    default-fetch-size: 100
    default-statement-timeout: 30
    cache-enabled: true                             # second-level cache
    lazy-loading-enabled: true</pre>
<pre>// Main class or config
@MapperScan("com.example.mapper")  // scan mapper interfaces
@SpringBootApplication
public class Application { }

// Or annotate each mapper
@Mapper
public interface UserMapper { }</pre>
<div class="key-point"><code>map-underscore-to-camel-case: true</code> eliminates the need for most resultMap definitions — database columns auto-map to Java fields.</div>`,
      },
      {
        q: 'How do you solve the N+1 problem in MyBatis?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>In MyBatis the N+1 problem comes from a mapping choice, not a hidden query. It happens with a nested select mapping, where one query loads the parents and one extra query runs for each parent. The fix is a JOIN with a nested resultMap so it runs in one query, and the <code>&lt;id&gt;</code> element must be present so parents are grouped. A lazy nested select is fine only for children that are rarely accessed.</p></div>
<p>MyBatis has its own N+1 trap: a <strong>nested select</strong> mapping fires one extra query per parent row. There are two mapping styles, and choosing the wrong one is the classic mistake.</p>
<pre>&lt;!-- STYLE 1: Nested SELECT — causes N+1 if eager! --&gt;
&lt;resultMap id="orderMap" type="Order"&gt;
  &lt;id column="order_id" property="orderId"/&gt;
  &lt;collection property="items"
              column="order_id"
              select="com.example.ItemMapper.findByOrderId"
              fetchType="lazy"/&gt;   &lt;!-- lazy = query only when accessed --&gt;
&lt;/resultMap&gt;
&lt;select id="findOrders" resultMap="orderMap"&gt;
  SELECT order_id, total FROM orders   &lt;!-- 1 query + N item queries --&gt;
&lt;/select&gt;

&lt;!-- STYLE 2: Nested resultMap + JOIN — ONE query, no N+1 --&gt;
&lt;resultMap id="orderJoinMap" type="Order"&gt;
  &lt;id column="order_id" property="orderId"/&gt;
  &lt;result column="total" property="total"/&gt;
  &lt;collection property="items" ofType="OrderItem"&gt;
    &lt;id column="item_id" property="itemId"/&gt;
    &lt;result column="product_name" property="productName"/&gt;
  &lt;/collection&gt;
&lt;/resultMap&gt;
&lt;select id="findOrdersWithItems" resultMap="orderJoinMap"&gt;
  SELECT o.order_id, o.total, i.item_id, i.product_name
  FROM orders o LEFT JOIN order_items i ON o.order_id = i.order_id
&lt;/select&gt;</pre>
<ul>
<li><strong>JOIN + nested resultMap</strong>: one round trip. MyBatis deduplicates parent rows by the <code>&lt;id&gt;</code> column — omit <code>&lt;id&gt;</code> and you get duplicated parents (a common follow-up trap). Downside: row explosion when joining multiple collections.</li>
<li><strong>Nested select + <code>fetchType="lazy"</code></strong>: fine when children are rarely accessed (needs <code>lazyLoadingEnabled=true</code> and a proxy-friendly entity). If you loop over every parent and touch the collection, you are back to N+1.</li>
</ul>
<div class="key-point">Unlike JPA, MyBatis never hides the SQL — N+1 here is a mapping choice: default to JOIN + nested resultMap for "always needed" children, nested lazy select for "rarely needed" ones.</div>`,
      },
      {
        q: 'Why is the MyBatis second-level cache dangerous in production with multiple app instances?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>The default second-level cache lives in heap and is separate in each JVM. With two instances behind a load balancer, an update on one instance does not clear the other, so stale data can be served. Invalidation is also per namespace, not per table, so a write through one mapper may not clear a cached JOIN in another mapper. In clustered setups it is safer to disable it and cache at the service layer with Redis or Caffeine.</p></div>
<p>The default <code>&lt;cache/&gt;</code> is an <strong>in-heap, per-JVM</strong> cache scoped to a mapper namespace. Two failure modes make it dangerous:</p>
<p><strong>1. Multiple app instances → stale data.</strong> Each instance has its own cache; invalidation on write happens only locally.</p>
<pre>&lt;!-- UserMapper.xml on instance A and instance B --&gt;
&lt;cache eviction="LRU" flushInterval="60000" size="512"/&gt;

// Timeline with 2 instances behind a load balancer:
// t1: Instance A: SELECT user 42 → cached (name = "Old")
// t2: Instance B: UPDATE user 42 SET name = 'New'
//     → flushes ONLY instance B's cache
// t3: Instance A: SELECT user 42 → serves "Old" from ITS cache
//     → stale for up to flushInterval (or forever without one)</pre>
<p><strong>2. Cross-namespace dirty reads.</strong> The cache is invalidated per <em>namespace</em>, not per <em>table</em>. If <code>OrderMapper</code> caches a query that JOINs <code>users</code>, an update via <code>UserMapper</code> does not flush <code>OrderMapper</code>'s cache:</p>
<pre>&lt;!-- OrderMapper.xml — caches rows that include user_name --&gt;
&lt;select id="findOrderWithUser" resultMap="..."&gt;
  SELECT o.*, u.user_name FROM orders o JOIN users u ON ...
&lt;/select&gt;
&lt;!-- UserMapper.update flushes UserMapper's cache only → OrderMapper serves stale user_name --&gt;

&lt;!-- Partial fix: share one cache region across the coupled namespaces --&gt;
&lt;cache-ref namespace="com.example.mapper.UserMapper"/&gt;</pre>
<p>Also: any writer outside MyBatis (DBA script, another service, a batch job) bypasses invalidation entirely; and <code>readOnly="false"</code> (the default) deserializes a copy on every hit, which costs CPU and requires <code>Serializable</code> entities.</p>
<div class="key-point">In clustered deployments, disable the second-level cache and cache explicitly at the service layer (Redis/Caffeine via Spring Cache) where you control invalidation — or plug a distributed Cache implementation and accept the complexity.</div>`,
      },
      {
        q: 'How do you stream a huge result set in MyBatis without OutOfMemoryError?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A normal mapper that returns a <code>List</code> loads every row into memory before returning, and the JDBC driver often buffers the whole result set as well. Streaming needs both a streaming consumer, such as a <code>Cursor</code> or <code>ResultHandler</code>, and a driver fetch size that really streams. MySQL ignores normal fetch sizes, so it needs fetchSize set to Integer.MIN_VALUE or useCursorFetch in the URL. The method must be transactional so the session stays open while the cursor is read.</p></div>
<p>A normal mapper method returning <code>List&lt;T&gt;</code> materializes <strong>every row in memory</strong> before returning — 10M rows means OOM. Two problems must be solved: MyBatis buffering the list, and the <strong>JDBC driver</strong> buffering the whole ResultSet client-side (MySQL does this by default!).</p>
<pre>// Option 1: Cursor&lt;T&gt; — lazy iteration over an open ResultSet
@Select("SELECT * FROM events ORDER BY id")
@Options(fetchSize = 1000)
Cursor&lt;Event&gt; scanAll();

@Transactional  // cursor needs the connection/session to stay open!
public void export(Writer out) {
    try (Cursor&lt;Event&gt; cursor = eventMapper.scanAll()) {
        for (Event e : cursor) {      // rows hydrated one at a time
            out.write(toCsv(e));
        }
    }
}

// Option 2: ResultHandler — push-style callback, void return type
void scanAll(ResultHandler&lt;Event&gt; handler);

eventMapper.scanAll(ctx -> process(ctx.getResultObject()));</pre>
<p><strong>Driver-specific gotchas:</strong></p>
<ul>
<li><strong>MySQL</strong> ignores normal fetchSize values — you must use <code>fetchSize = Integer.MIN_VALUE</code> (row-by-row streaming) or add <code>useCursorFetch=true</code> to the JDBC URL for real server-side cursors.</li>
<li><strong>PostgreSQL</strong> honors fetchSize only when <code>autoCommit=false</code> — hence the <code>@Transactional</code> requirement.</li>
<li>Closing the SqlSession before iterating the Cursor throws — the classic bug is returning a <code>Cursor</code> from a non-transactional service method.</li>
</ul>
<div class="key-point">Streaming needs BOTH a streaming consumer (Cursor/ResultHandler) AND a driver-level fetchSize that actually streams — MySQL's Integer.MIN_VALUE trick is the interview follow-up everyone forgets.</div>`,
      },
      {
        q: 'What is the OGNL "0 equals empty string" trap in MyBatis dynamic SQL?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>A common string guard like status not null and status not empty breaks for numbers. In OGNL, comparing a number to an empty string turns the empty string into 0.0, so 0 equals empty string is true, and the <code>&lt;if&gt;</code> is skipped when the value is 0. The filter then disappears and the query returns all rows. The rule is that the not-empty check is for Strings only, while numeric parameters need only a null check.</p></div>
<p>The condition everyone copy-pastes for strings silently breaks for numbers. In OGNL, comparing a <code>Number</code> to <code>''</code> coerces the empty string to <code>0.0</code> — so <strong>0 == '' is true</strong>.</p>
<pre>&lt;!-- Looks safe, works for String... --&gt;
&lt;if test="status != null and status != ''"&gt;
  AND status = #{status}
&lt;/if&gt;

// But with Integer status = 0:
//   status != ''  →  OGNL coerces '' to 0.0  →  0 != 0.0  →  FALSE
//   → whole &lt;if&gt; is skipped
//   → the "status = 0" filter silently disappears
//   → query returns ALL rows (e.g. disabled users leak into results!)

&lt;!-- FIX: numeric parameters get a null-check ONLY --&gt;
&lt;if test="status != null"&gt;
  AND status = #{status}
&lt;/if&gt;</pre>
<p><strong>Related OGNL pitfalls interviewers probe:</strong></p>
<pre>&lt;!-- Single-quoted single character is a CHAR literal in OGNL --&gt;
&lt;if test="type == 'A'"&gt;      &lt;!-- char 'A' vs String → may never match --&gt;
&lt;if test='type == "A"'&gt;      &lt;!-- correct: swap quote nesting --&gt;
&lt;if test="type == 'A'.toString()"&gt;  &lt;!-- alternative fix --&gt;

&lt;!-- &lt;where&gt; only strips LEADING AND/OR — a trailing one still breaks --&gt;
&lt;where&gt;
  &lt;if test="name != null"&gt;user_name = #{name} AND&lt;/if&gt;  &lt;!-- BAD: trailing AND --&gt;
&lt;/where&gt;
&lt;!-- Use &lt;trim prefix="WHERE" prefixOverrides="AND |OR "&gt; for full control --&gt;</pre>
<div class="key-point">Rule of thumb: <code>!= ''</code> checks are for String parameters only; numeric parameters need just <code>!= null</code> — otherwise legitimate 0 values silently drop the predicate and widen your query.</div>`,
      },
    ],
  },

  // ───────────────────────── 12. JPA / HIBERNATE ─────────────────────────,
  {
    id: 'jpa-hibernate',
    name: 'JPA / Hibernate',
    icon: '🔗',
    questions: [
      {
        q: 'What is JPA? What is the relationship between JPA and Hibernate?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>JPA is a specification, and Hibernate is an implementation of it. JPA defines the annotations and the EntityManager API, while Hibernate is the ORM engine that does the work, and other implementations like EclipseLink also exist. Coding to the <code>jakarta.persistence</code> interfaces keeps the code portable. In real projects, some Hibernate-specific features such as <code>@BatchSize</code> are often used anyway.</p></div>
<ul>
<li><strong>JPA (Java Persistence API)</strong>: a <strong>specification</strong> (interface) that defines how Java objects map to relational database tables.</li>
<li><strong>Hibernate</strong>: the most popular <strong>implementation</strong> of JPA. Provides the actual ORM engine.</li>
<li>Others implementations: EclipseLink, OpenJPA.</li>
</ul>
<pre>// JPA annotations (standard - works with any implementation)
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_name", nullable = false, length = 100)
    private String name;

    @Column(unique = true)
    private String email;
}</pre>
<div class="key-point">Code to JPA interfaces (<code>javax.persistence</code> / <code>jakarta.persistence</code>) — your code stays portable across ORM implementations.</div>`,
      },
      {
        q: 'Explain the JPA entity lifecycle and entity states.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A JPA entity can be in one of four states. Transient is a plain new object with no database row, and managed means it is in the persistence context where Hibernate tracks changes and writes them automatically. Detached is a once-managed object after the context closed, so changes are not saved, and removed is scheduled for deletion. On a managed entity there is no need to call save, because changing a field is enough.</p></div>
<p>An entity can be in 4 states:</p>
<ul>
<li><strong>New/Transient</strong>: just created with <code>new</code>. Not managed. No DB row.</li>
<li><strong>Managed/Persistent</strong>: attached to persistence context. Changes auto-synced to DB (dirty checking).</li>
<li><strong>Detached</strong>: was managed but persistence context closed. Changes NOT synced.</li>
<li><strong>Removed</strong>: scheduled for deletion.</li>
</ul>
<pre>User user = new User("John");     // Transient
em.persist(user);                  // → Managed (INSERT on flush)
user.setName("Jane");              // auto-detected (dirty checking)
em.flush();                        // SQL: INSERT + UPDATE
em.detach(user);                   // → Detached
user.setName("Bob");               // NO effect on DB
em.merge(user);                    // → Managed again (SELECT + UPDATE)
em.remove(user);                   // → Removed (DELETE on flush)</pre>`,
      },
      {
        q: 'What is the difference between FetchType.LAZY and FetchType.EAGER?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>EAGER loading fetches the related data together with the parent, while LAZY loading defers it behind a proxy until it is accessed. A common best practice is to make all relationships LAZY, including <code>@ManyToOne</code> which is EAGER by default. Then the needed data is fetched on demand with <code>JOIN FETCH</code> or an <code>@EntityGraph</code>. This gives more control and helps avoid loading unwanted data or causing N+1 queries.</p></div>
<ul>
<li><strong>EAGER</strong>: related entities loaded immediately (with the parent query). Can cause N+1 problem.</li>
<li><strong>LAZY</strong>: related entities loaded only when accessed. Returns a <strong>proxy</strong>.</li>
</ul>
<pre>@Entity
public class Order {
    @OneToMany(mappedBy = "order", fetch = FetchType.LAZY)  // default for collections
    private List&lt;OrderItem&gt; items;

    @ManyToOne(fetch = FetchType.EAGER)  // default for single
    private Customer customer;
}</pre>
<p><strong>Defaults</strong>: <code>@OneToMany</code>, <code>@ManyToMany</code> → LAZY. <code>@ManyToOne</code>, <code>@OneToOne</code> → EAGER.</p>
<div class="key-point">Best practice: make ALL relationships LAZY, then fetch eagerly only when needed using <code>JOIN FETCH</code> or <code>@EntityGraph</code>.</div>`,
      },
      {
        q: 'What is the N+1 problem in JPA? How to solve it?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The N+1 problem loads N parents with one query, then runs one more query for each lazy child access. The main fixes are <code>JOIN FETCH</code> or an <code>@EntityGraph</code> to load everything in one query, and Hibernate <code>@BatchSize</code> to group the child queries. Fetching two collections with JOIN FETCH causes a cartesian product, and pagination with a fetch join is done in memory. For those cases, @BatchSize or two separate queries is better.</p></div>
<p><strong>Problem</strong>: Loading parent entities triggers N additional queries for lazy children.</p>
<pre>List&lt;Order&gt; orders = orderRepo.findAll();  // 1 query
for (Order o : orders) {
    o.getItems().size();  // N queries (one per order!)
}</pre>
<p><strong>Solutions</strong>:</p>
<pre>// 1. JOIN FETCH in JPQL
@Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.status = :status")
List&lt;Order&gt; findWithItems(@Param("status") String status);

// 2. @EntityGraph
@EntityGraph(attributePaths = {"items", "customer"})
List&lt;Order&gt; findByStatus(String status);

// 3. @BatchSize (Hibernate)
@BatchSize(size = 25)
@OneToMany(mappedBy = "order")
private List&lt;OrderItem&gt; items;
// Loads items in batches of 25 (WHERE order_id IN (?,?,?...)) instead of 1 by 1</pre>`,
      },
      {
        q: 'Explain the difference between @OneToOne, @OneToMany, @ManyToOne, @ManyToMany.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The four annotations map cardinality, but the key point is which side owns the foreign key. The owning side is the one without <code>mappedBy</code>; for a bidirectional one-to-many, that is the <code>@ManyToOne</code> child that holds the FK column. Only the owning side's state produces SQL. For many-to-many, mapping the join table with <code>@JoinTable</code> and using a <code>Set</code> is common, along with helper methods to keep both sides in sync.</p></div>
<pre>// @OneToOne: User ↔ Profile
@Entity
public class User {
    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id")
    private Profile profile;
}

// @OneToMany / @ManyToOne: Order ↔ Items
@Entity
public class Order {
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List&lt;OrderItem&gt; items = new ArrayList&lt;&gt;();
}
@Entity
public class OrderItem {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
}

// @ManyToMany: Student ↔ Course
@Entity
public class Student {
    @ManyToMany
    @JoinTable(name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id"))
    private Set&lt;Course&gt; courses = new HashSet&lt;&gt;();
}</pre>
<div class="key-point"><code>mappedBy</code> = inverse side (does NOT own FK). The side without <code>mappedBy</code> owns the relationship and controls the FK.</div>`,
      },
      {
        q: 'What is the Persistence Context and EntityManager?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The EntityManager is the main JPA interface for persist, find, merge, and remove. The persistence context behind it is the first-level cache and unit of work. It gives two guarantees: identity, so finding the same id twice returns the same instance with no second query, and dirty checking, so changes are flushed automatically. In Spring it is transaction-scoped by default, so it lives for one <code>@Transactional</code> method.</p></div>
<ul>
<li><strong>EntityManager</strong>: the main JPA interface for CRUD operations (<code>persist</code>, <code>find</code>, <code>merge</code>, <code>remove</code>, <code>createQuery</code>).</li>
<li><strong>Persistence Context</strong>: first-level cache. Stores managed entities. Ensures only ONE instance per entity identity per context.</li>
</ul>
<pre>User u1 = em.find(User.class, 1L);  // SQL: SELECT (cached in PC)
User u2 = em.find(User.class, 1L);  // NO SQL (returned from cache)
u1 == u2;  // true (same instance!)

u1.setName("Updated");
em.flush();  // SQL: UPDATE (dirty checking detected change)</pre>
<p><strong>Scope</strong>:</p>
<ul>
<li>Transaction-scoped (default in Spring): lives for one <code>@Transactional</code> method.</li>
<li>Extended: keeps entities managed across multiple transactions (used in stateful beans).</li>
</ul>`,
      },
      {
        q: 'What is the difference between JPQL, Criteria API, and Native queries?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>There are three query options. JPQL is object-based and looks like SQL over entity names; it is readable, portable, and the most common. The Criteria API is programmatic and type-safe, useful for dynamic queries with many optional filters, but it is verbose. Native SQL uses raw database-specific SQL for special features or tuning, but it is not portable.</p></div>
<pre>// JPQL: SQL-like, uses entity names (not table names)
@Query("SELECT u FROM User u WHERE u.email = :email")
User findByEmail(@Param("email") String email);

// Criteria API: type-safe, programmatic
CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaQuery&lt;User&gt; cq = cb.createQuery(User.class);
Root&lt;User&gt; root = cq.from(User.class);
cq.where(cb.equal(root.get("email"), email));
List&lt;User&gt; result = em.createQuery(cq).getResultList();

// Native SQL: raw SQL, database-specific
@Query(value = "SELECT * FROM users WHERE email = ?1", nativeQuery = true)
User findByEmailNative(String email);</pre>
<ul>
<li><strong>JPQL</strong>: readable, portable. Most common.</li>
<li><strong>Criteria</strong>: type-safe, good for dynamic queries. Verbose.</li>
<li><strong>Native</strong>: full SQL power. Not portable. Use for complex/optimized queries.</li>
</ul>`,
      },
      {
        q: 'Explain Hibernate first-level cache vs second-level cache.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The first-level cache is the persistence context; it is per session, always on, and cannot be disabled. The second-level cache is shared across sessions, optional, and needs a provider such as EhCache or Caffeine. The second-level cache adds invalidation complexity and needs a distributed provider in a clustered app. There is also a query cache as a third layer, and L2 is usually best for read-mostly reference data.</p></div>
<ul>
<li><strong>First-level cache (L1)</strong>: built-in, per EntityManager/Session. Cannot be disabled. One entity instance per ID. Scoped to transaction.</li>
<li><strong>Second-level cache (L2)</strong>: shared across sessions. Optional. Must configure provider (EhCache, Caffeine, Redis).</li>
</ul>
<pre>// Enable L2 cache
@Entity
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Product {
    // ...
}

// application.yml
spring:
  jpa:
    properties:
      hibernate:
        cache:
          use_second_level_cache: true
          region.factory_class: org.hibernate.cache.jcache.JCacheRegionFactory
        javax:
          cache.provider: org.ehcache.jsr107.EhcacheCachingProvider</pre>
<div class="key-point"><strong>Query cache</strong> is a third cache: stores query results (parameterized). Enable with <code>@QueryHint(name = "org.hibernate.cacheable", value = "true")</code>. Invalidated when any entity in the cached query's table changes.</div>`,
      },
      {
        q: 'What is Spring Data JPA? What methods does JpaRepository provide?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Spring Data JPA removes DAO boilerplate by generating the implementation of a repository interface that extends <code>JpaRepository</code>. It provides save, findById, and findAll for free, derived queries from method names like <code>findByEmail</code>, and <code>@Query</code> for custom JPQL, plus <code>Pageable</code> for pagination. Long derived method names get hard to read, so custom queries are better past a few conditions. A <code>@Modifying</code> bulk update bypasses the persistence context, so it should be cleared to avoid stale entities.</p></div>
<p>Spring Data JPA eliminates boilerplate by auto-implementing repository interfaces.</p>
<pre>public interface UserRepository extends JpaRepository&lt;User, Long&gt; {
    // Built-in: save, findById, findAll, count, deleteById, existsById...

    // Query derivation (method name → SQL)
    List&lt;User&gt; findByNameContainingAndStatus(String name, String status);
    Optional&lt;User&gt; findByEmail(String email);
    List&lt;User&gt; findByAgeBetweenOrderByNameAsc(int min, int max);
    boolean existsByEmail(String email);
    long countByStatus(String status);

    // Custom JPQL
    @Query("SELECT u FROM User u WHERE u.department.id = :deptId")
    Page&lt;User&gt; findByDepartment(@Param("deptId") Long deptId, Pageable pageable);

    // Modifying queries
    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.lastLogin &lt; :date")
    int deactivateInactiveUsers(@Param("status") String status, @Param("date") LocalDate date);
}</pre>`,
      },
      {
        q: 'What is Hibernate dirty checking? How does it work?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Dirty checking lets a developer load a managed entity, change it, and have Hibernate write the UPDATE at flush without a save call. It works by taking a snapshot of the original field values at load time and comparing at flush. This has a cost, because on a large read Hibernate keeps and compares snapshots for every entity. Using <code>@Transactional(readOnly = true)</code> lets it skip that work.</p></div>
<p>Hibernate automatically detects changes to managed entities and generates UPDATE statements on flush — without explicit save calls.</p>
<pre>@Transactional
public void updateUserName(Long id, String newName) {
    User user = userRepo.findById(id).orElseThrow();
    user.setName(newName);
    // NO save/update call needed!
    // On transaction commit → Hibernate compares with original snapshot
    // → generates: UPDATE users SET name = ? WHERE id = ?
}</pre>
<p><strong>How it works</strong>:</p>
<ol>
<li>When entity is loaded, Hibernate stores a <strong>snapshot</strong> (copy of original values).</li>
<li>On <code>flush()</code>, compares current state vs snapshot.</li>
<li>If different → generates UPDATE SQL.</li>
</ol>
<div class="key-point">Pitfall: loading many entities for read-only → unnecessary dirty checking overhead. Use <code>@Transactional(readOnly = true)</code> or <code>Hibernate.setReadOnly(entity)</code>.</div>`,
      },
      {
        q: 'What is the difference between CascadeType and orphanRemoval?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Cascade and orphanRemoval solve different problems. Cascade passes lifecycle operations from parent to child, so persisting the parent also persists the children. orphanRemoval deletes a child when it is removed from the parent's collection; without it, Hibernate only sets the foreign key to null and leaves the row. A true parent-owns-children setup often uses <code>cascade = ALL</code> with <code>orphanRemoval = true</code>. Cascade REMOVE should be used only when the child cannot exist without the parent.</p></div>
<ul>
<li><strong>CascadeType</strong>: propagate operations from parent to child.</li>
<ul>
<li><code>PERSIST</code>: saving parent saves children too.</li>
<li><code>MERGE</code>: merging parent merges children.</li>
<li><code>REMOVE</code>: deleting parent deletes children.</li>
<li><code>ALL</code>: all of the above + <code>DETACH</code> + <code>REFRESH</code>.</li>
</ul>
<li><strong>orphanRemoval = true</strong>: if a child is REMOVED from the collection, it gets DELETED from DB.</li>
</ul>
<pre>@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
private List&lt;OrderItem&gt; items;

// Cascade: delete order → deletes all items
orderRepo.delete(order);

// orphanRemoval: remove item from list → deletes item from DB
order.getItems().remove(item);  // → DELETE FROM order_items WHERE id = ?</pre>
<div class="key-point">Without <code>orphanRemoval</code>, removing from collection only clears the FK (sets to null), doesn't delete the row.</div>`,
      },
      {
        q: 'How to handle the LazyInitializationException?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>This error happens when a lazy association is accessed after the persistence context has closed, so the proxy has no session to load from. The preferred fixes are to fetch the needed data up front with <code>JOIN FETCH</code> or an <code>@EntityGraph</code>, or to return a DTO projection with no proxies. Open-session-in-view removes the error but hides N+1 and moves database work into the view layer. Setting open-in-view to false makes the problem visible during development.</p></div>
<p><strong>Cause</strong>: accessing a LAZY-loaded relationship after the persistence context (session) is closed.</p>
<pre>// This throws LazyInitializationException!
User user = userRepo.findById(1L).get();  // TX ends here
user.getOrders().size();  // Session closed → BOOM!</pre>
<p><strong>Solutions</strong> (best to worst):</p>
<ul>
<li><strong>JOIN FETCH</strong> in query (best): <code>@Query("SELECT u FROM User u JOIN FETCH u.orders WHERE u.id = :id")</code></li>
<li><strong>@EntityGraph</strong>: declaratively fetch associations.</li>
<li><strong>@Transactional</strong> on the service method: keeps session open.</li>
<li><strong>Open Session in View</strong> (spring.jpa.open-in-view=true): keeps session for entire HTTP request. <strong>Not recommended</strong> — hides N+1, hard to debug.</li>
<li><strong>DTO projection</strong>: query only the data you need (no lazy proxies).</li>
</ul>
<div class="key-point">Best practice: set <code>spring.jpa.open-in-view=false</code> and use JOIN FETCH or DTOs. This forces you to think about data loading upfront.</div>`,
      },
      {
        q: 'What are JPA Specifications and how to build dynamic queries?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Specifications are the Spring Data wrapper over the Criteria API for dynamic, composable queries. Each specification is a lambda that returns a Predicate, and they combine with and and or, returning null to skip a filter that was not given. They fit search screens with many optional filters, where building JPQL by string is fragile and unsafe. The Criteria API underneath is verbose, so QueryDSL may be better for heavy dynamic querying.</p></div>
<pre>// Repository extends JpaSpecificationExecutor
public interface UserRepository extends JpaRepository&lt;User, Long&gt;,
    JpaSpecificationExecutor&lt;User&gt; { }

// Build specifications
public class UserSpecs {
    public static Specification&lt;User&gt; hasName(String name) {
        return (root, query, cb) ->
            name == null ? null : cb.like(root.get("name"), "%" + name + "%");
    }
    public static Specification&lt;User&gt; hasStatus(String status) {
        return (root, query, cb) ->
            status == null ? null : cb.equal(root.get("status"), status);
    }
    public static Specification&lt;User&gt; olderThan(int age) {
        return (root, query, cb) ->
            cb.greaterThan(root.get("age"), age);
    }
}

// Usage: combine dynamically
Page&lt;User&gt; users = userRepo.findAll(
    Specification.where(UserSpecs.hasName(nameFilter))
        .and(UserSpecs.hasStatus(statusFilter))
        .and(UserSpecs.olderThan(18)),
    PageRequest.of(0, 20)
);</pre>
<div class="key-point">Specifications are reusable, composable (AND/OR/NOT), and type-safe. Great alternative to dynamic JPQL string building.</div>`,
      },
      {
        q: 'What is the difference between @GeneratedValue strategies (IDENTITY, SEQUENCE, TABLE, AUTO)?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The main choice is IDENTITY versus SEQUENCE. IDENTITY uses an auto-increment column and gets the id only after the insert, which forces an immediate flush and breaks JDBC batch inserts. SEQUENCE gets the id before the insert from a database sequence, so inserts can batch, and <code>allocationSize</code> pre-allocates a block of ids. TABLE is portable but slow, and AUTO lets Hibernate choose based on the dialect.</p></div>
<ul>
<li><strong>IDENTITY</strong>: auto-increment column (MySQL). ID assigned after INSERT. <strong>Breaks batch inserts</strong> (Hibernate must flush immediately).</li>
<li><strong>SEQUENCE</strong>: DB sequence (PostgreSQL, Oracle). ID assigned before INSERT. Supports batch inserts. <strong>Preferred for Hibernate</strong>.</li>
<li><strong>TABLE</strong>: simulates sequences with a table. Portable but slow (extra queries + locking).</li>
<li><strong>AUTO</strong>: lets Hibernate choose based on DB dialect.</li>
</ul>
<pre>// SEQUENCE (best for Hibernate)
@Id
@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
@SequenceGenerator(name = "user_seq", sequenceName = "user_sequence", allocationSize = 50)
private Long id;

// allocationSize = 50 → Hibernate pre-allocates 50 IDs per DB call
// → fewer round trips for batch inserts</pre>
<div class="key-point">IDENTITY disables JDBC batch inserts in Hibernate because it needs the generated ID immediately. Use SEQUENCE with <code>allocationSize</code> for best performance.</div>`,
      },
      {
        q: 'What are JPA entity inheritance strategies?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>JPA has four inheritance strategies with a tradeoff between speed and clean schema. SINGLE_TABLE, the default, stores the whole hierarchy in one table with a discriminator column; it is fastest but subclass fields must be nullable. JOINED uses one table per class for a clean schema but joins on every query, and TABLE_PER_CLASS makes polymorphic queries use UNION ALL. @MappedSuperclass only shares fields and does not allow querying by parent type.</p></div>
<p>JPA supports four strategies for mapping inheritance hierarchies to database tables:</p>
<pre>@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)  // Default
@DiscriminatorColumn(name = "type")
public abstract class Payment {
    @Id @GeneratedValue private Long id;
    private BigDecimal amount;
}

@Entity @DiscriminatorValue("CARD")
public class CardPayment extends Payment {
    private String cardNumber;
}

@Entity @DiscriminatorValue("BANK")
public class BankTransfer extends Payment {
    private String bankCode;
}</pre>
<table><tr><th>Strategy</th><th>Tables</th><th>Pros</th><th>Cons</th></tr>
<tr><td>SINGLE_TABLE</td><td>1 table, discriminator column</td><td>Fastest queries, no JOINs</td><td>Many nullable columns, no NOT NULL constraints on subclass fields</td></tr>
<tr><td>JOINED</td><td>1 table per class</td><td>Normalized, clean schema</td><td>JOIN on every query (slow for deep hierarchies)</td></tr>
<tr><td>TABLE_PER_CLASS</td><td>1 table per concrete class</td><td>No nullable columns</td><td>Polymorphic queries require UNION ALL (slow)</td></tr>
<tr><td>@MappedSuperclass</td><td>No table for parent</td><td>Simple, no polymorphic queries</td><td>Can't query by parent type</td></tr></table>
<div class="key-point">Default to <code>SINGLE_TABLE</code> for best performance. Use <code>JOINED</code> when schema normalization matters. Avoid <code>TABLE_PER_CLASS</code> — polymorphic queries are extremely slow.</div>`,
      },
      {
        q: 'What is optimistic locking with @Version in JPA?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Optimistic locking with <code>@Version</code> prevents lost updates without holding a database lock. A version column is added, and every UPDATE checks the version and increases it, so if another transaction committed first, the update matches no rows and Hibernate throws <code>OptimisticLockException</code>. It fits web apps where conflicts are rare, and it is handled by reloading and retrying. For high contention, pessimistic locking with SELECT FOR UPDATE is better, and the version field is never changed by hand.</p></div>
<p><strong>Optimistic locking</strong> prevents lost updates when multiple transactions modify the same row concurrently — without holding database locks.</p>
<pre>@Entity
public class Product {
    @Id private Long id;
    private String name;
    private int stock;

    @Version
    private Long version;  // Hibernate manages this automatically
}

// How it works:
// 1. User A reads Product (version = 1)
// 2. User B reads same Product (version = 1)
// 3. User A saves → UPDATE products SET stock=9, version=2 WHERE id=1 AND version=1
//    → Success! Version bumped to 2
// 4. User B saves → UPDATE products SET stock=8, version=2 WHERE id=1 AND version=1
//    → WHERE version=1 matches 0 rows! → OptimisticLockException thrown!

// Handling the exception:
try {
    productRepo.save(product);
} catch (OptimisticLockException e) {
    // Reload from DB and retry, or inform user
    Product fresh = productRepo.findById(product.getId());
    // Re-apply changes and try again
}</pre>
<p><strong>Optimistic vs Pessimistic:</strong></p>
<ul>
<li><strong>Optimistic</strong> (@Version): no DB locks, check at commit time. Best for low-contention (most web apps).</li>
<li><strong>Pessimistic</strong> (SELECT FOR UPDATE): holds DB lock during transaction. Best for high-contention (booking systems).</li>
</ul>
<div class="key-point">@Version is ideal for web applications where conflicts are rare. The version field can be <code>Long</code>, <code>Integer</code>, <code>Short</code>, or <code>Timestamp</code>. Never modify the @Version field manually.</div>`,
      },
      {
        q: 'What are DTO projections in JPA and why use them?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A DTO projection selects only the columns that are needed instead of loading a full entity. Loading a full entity pulls every column and can drag in lazy associations, while a projection is a lean read-only view. Spring supports interface projections and constructor or record DTOs through <code>SELECT new</code> in JPQL. Projections also have no managed proxies, so there is no LazyInitializationException and no dirty-checking cost.</p></div>
<p>DTO projections let you select only the columns you need, avoiding loading entire entities (better performance).</p>
<pre>// Problem: loading full entity when you only need name and email
User user = userRepo.findById(1L);  // loads ALL columns including blob fields

// Solution 1: Interface projection (Spring Data JPA)
public interface UserSummary {
    String getName();
    String getEmail();
}

public interface UserRepository extends JpaRepository&lt;User, Long&gt; {
    List&lt;UserSummary&gt; findByStatus(String status);
    // SELECT name, email FROM users WHERE status = ?
}

// Solution 2: Class-based DTO projection
public record UserDto(String name, String email) {}

@Query("SELECT new com.app.UserDto(u.name, u.email) FROM User u WHERE u.status = :status")
List&lt;UserDto&gt; findDtoByStatus(@Param("status") String status);

// Solution 3: Tuple projection
@Query("SELECT u.name as name, u.email as email FROM User u")
List&lt;Tuple&gt; findAllProjected();

// Solution 4: Dynamic projection
&lt;T&gt; List&lt;T&gt; findByStatus(String status, Class&lt;T&gt; type);
// Usage:
repo.findByStatus("active", UserSummary.class);
repo.findByStatus("active", UserDto.class);</pre>
<div class="key-point">DTO projections can dramatically improve performance by reducing data transfer. Interface projections are simplest. Use class-based DTOs when you need custom logic. Never load full entities just to display a list view.</div>`,
      },
      {
        q: 'Why are equals() and hashCode() hard to implement correctly for JPA entities?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Two entity traits break IDE-generated equals and hashCode. The id is null before persist, so an id-based hashCode changes after saving, and an entity already in a HashSet becomes lost. Hibernate proxies are runtime subclasses, so <code>getClass()</code> comparisons fail for the same row. A safe pattern uses a constant hashCode with id-based equals using <code>instanceof</code> and the id getter, and Lombok <code>@Data</code> should not be placed on an entity.</p></div>
<p>Two properties of entities break the standard IDE-generated implementations:</p>
<ul>
<li><strong>The id is null before persist</strong> — an id-based hashCode <em>changes</em> when the entity is saved, violating the contract that hashCode must be stable while the object is in a hash-based collection.</li>
<li><strong>Hibernate proxies</strong> — a lazy reference is a runtime subclass (<code>User$HibernateProxy$xyz</code>), so <code>getClass() != other.getClass()</code> comparisons fail even for the "same" row.</li>
</ul>
<pre>// The broken HashSet demo interviewers love:
Set&lt;Order&gt; items = new HashSet&lt;&gt;();
Order order = new Order();          // id = null → hashCode based on null
items.add(order);
em.persist(order);                  // id assigned → hashCode CHANGES
em.flush();
items.contains(order);              // false! Entity is "lost" in its own set

// Robust pattern: id-based equals + CONSTANT hashCode + instanceof
@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Order other)) return false;   // instanceof → proxy-safe
    return id != null &amp;&amp; id.equals(other.getId());   // getter → proxy-safe
    // two transient entities (both id null) are never equal
}
@Override
public int hashCode() {
    return getClass().hashCode();   // constant → never changes across persist
}</pre>
<ul>
<li>Constant hashCode means all entities of a type land in one hash bucket — O(n) lookups. Acceptable, because entity Sets are small (an order's items, not a million rows).</li>
<li>Alternative: equals/hashCode on an immutable <strong>business key</strong> (e.g. ISBN, username) — ideal when one exists, but most tables have none.</li>
<li>Never use Lombok <code>@Data</code>/<code>@EqualsAndHashCode</code> on entities: it includes mutable fields and can trigger lazy loading (and StackOverflow on bidirectional links) inside equals.</li>
</ul>
<div class="key-point">Use instanceof + getId() equality with a constant hashCode — it survives persist (id assignment) and proxies, the two things that silently corrupt HashSets of entities.</div>`,
      },
      {
        q: 'What is the difference between persist(), merge(), and Spring Data save()?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>These three behave differently. <code>persist</code> makes a transient entity managed and returns void, so the argument itself becomes managed. <code>merge</code> copies the detached object's state onto a managed copy and returns that copy, so the original argument stays detached and later changes to it are not saved. Spring Data <code>save</code> calls persist for a new entity and merge otherwise. Saving an entity with a pre-assigned id causes a merge with an extra SELECT, and merge overwrites all columns, which can revert concurrent changes unless <code>@Version</code> is used.</p></div>
<ul>
<li><strong>persist(e)</strong>: makes a <em>transient</em> entity managed. Throws <code>EntityExistsException</code> for detached entities. Returns void — the argument itself becomes managed.</li>
<li><strong>merge(e)</strong>: copies the state of a detached entity onto a managed copy (loading it first if needed) and <strong>returns that NEW managed instance</strong>. The argument stays detached!</li>
</ul>
<pre>// THE classic merge bug:
User detached = new User(1L, "Old");
em.merge(detached);                 // returned instance ignored!
detached.setName("New");            // mutating the DETACHED argument
// commit → "New" is NEVER written. Only the managed copy is tracked.

// Correct:
User managed = em.merge(detached);
managed.setName("New");             // tracked by dirty checking → UPDATE

// Spring Data save() is just a dispatcher:
@Transactional
public &lt;S extends T&gt; S save(S entity) {
    if (entityInformation.isNew(entity)) {   // id == null (or version == null)
        em.persist(entity);
        return entity;
    } else {
        return em.merge(entity);             // ← hidden merge!
    }
}</pre>
<p><strong>Two senior-level consequences of save()'s dispatch:</strong></p>
<ul>
<li><strong>Extra SELECT</strong>: saving a new entity with a <em>pre-assigned id</em> (UUID, natural key) looks "not new" → merge → Hibernate first SELECTs to check existence, doubling round trips. Fix: implement <code>Persistable.isNew()</code> or add a <code>@Version</code> field (null version = new).</li>
<li><strong>Lost-update surface</strong>: merge overwrites <em>every</em> column with the detached object's state — a stale detached entity silently reverts concurrent changes unless <code>@Version</code> guards it.</li>
</ul>
<div class="key-point">merge() returns the managed instance — always continue with the return value; and know that save() on an id-preset entity means merge + an extra SELECT unless you implement Persistable or use @Version.</div>`,
      },
      {
        q: 'What is the difference between findById() and getReferenceById()?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p><code>findById</code> runs a SELECT right away and returns a real entity or an empty Optional if the row is missing. <code>getReferenceById</code> returns a lazy proxy with no SQL, and the database is hit only when a non-id field is accessed. It is ideal for setting a foreign key, since the reference carries the id and the insert gets the FK without an extra SELECT. The risk is deferred failure, because a missing row only shows up later as <code>EntityNotFoundException</code>, so findById is better when the data or an existence check is needed now.</p></div>
<ul>
<li><strong>findById(id)</strong>: executes a <strong>SELECT immediately</strong>, returns <code>Optional.empty()</code> if the row does not exist. You get a real, initialized entity.</li>
<li><strong>getReferenceById(id)</strong> (JPA <code>em.getReference()</code>): returns a <strong>lazy proxy without any SQL</strong>. The database is hit only when a non-id field is first accessed — and if the row is missing, <em>that access</em> throws <code>EntityNotFoundException</code> (possibly far from the call site, or even during serialization).</li>
</ul>
<pre>// The perfect use case: setting a foreign key WITHOUT loading the row
@Transactional
public void createOrder(Long customerId, OrderRequest req) {
    Order order = new Order(req);

    // BAD: pointless SELECT just to get a reference for the FK column
    Customer c = customerRepo.findById(customerId).orElseThrow();

    // GOOD: no SELECT at all — proxy carries the id, INSERT gets the FK
    Customer ref = customerRepo.getReferenceById(customerId);
    order.setCustomer(ref);

    orderRepo.save(order);   // SQL: single INSERT INTO orders (..., customer_id)
}

// When the lazy reference bites:
Customer ghost = customerRepo.getReferenceById(999L); // no SQL, "succeeds"
ghost.getId();     // OK — id is held by the proxy itself
ghost.getName();   // SELECT ... → row missing → EntityNotFoundException HERE</pre>
<ul>
<li>Requires an open persistence context at first access — a proxy escaping the transaction throws <code>LazyInitializationException</code>.</li>
<li>Don't use it when you must <em>validate</em> existence up front or read fields — that's findById's job.</li>
<li>Bonus: the missing-row failure only surfaces at INSERT time as an FK-constraint violation if you never touch the proxy — know which exception appears where.</li>
</ul>
<div class="key-point">getReferenceById() is the zero-SELECT way to wire foreign keys; findById() is for when you actually need the data or an existence check now, not a deferred EntityNotFoundException later.</div>`,
      },
      {
        q: 'Why do bidirectional JPA relationships need synchronization helper methods?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>In a bidirectional relationship, only the owning side, the one without <code>mappedBy</code> that holds the FK, produces SQL. Adding a child to the parent's collection without setting the child's back-reference means the foreign key is never written, causing a null FK or a constraint error. Setting only the owning side leaves the in-memory collection stale within the transaction. Helper methods like addItem and removeItem set both sides at once, and equals and toString must not follow both directions or they recurse forever.</p></div>
<p>In a bidirectional association only the <strong>owning side</strong> (the one <em>without</em> <code>mappedBy</code>, usually the <code>@ManyToOne</code>) is written to the database. Setting just the inverse side updates the in-memory object graph but produces the wrong SQL — or none at all.</p>
<pre>// Order (inverse side)          OrderItem (owning side — has the FK)
@OneToMany(mappedBy = "order",   @ManyToOne(fetch = FetchType.LAZY)
  cascade = CascadeType.ALL,     @JoinColumn(name = "order_id")
  orphanRemoval = true)          private Order order;
private List&lt;OrderItem&gt; items = new ArrayList&lt;&gt;();

// BUG 1: only inverse side set → FK never written
order.getItems().add(item);      // item.order is still null!
orderRepo.save(order);           // INSERT order_items (..., order_id = NULL)
                                 // → NULL FK or constraint violation

// BUG 2: only owning side set → FK correct, but in the SAME persistence
// context order.getItems() doesn't contain item → stale reads, broken
// cascades and equals/contains logic within the transaction.

// FIX: helper methods that keep BOTH sides in sync — the entity's API
public void addItem(OrderItem item) {
    items.add(item);
    item.setOrder(this);
}
public void removeItem(OrderItem item) {
    items.remove(item);          // + orphanRemoval → DELETE
    item.setOrder(null);
}</pre>
<ul>
<li>Make <code>setItems()</code> non-public (or defensive) so callers must go through the helpers.</li>
<li>Combined with <code>orphanRemoval = true</code>, <code>removeItem()</code> is the idiomatic "delete child" — no explicit repository delete needed.</li>
<li>Interview follow-up: this is also why entity <code>equals()</code> must not traverse both sides — a naive implementation recurses infinitely (Order → items → order → ...), same for <code>toString()</code> and JSON serialization.</li>
</ul>
<div class="key-point">Only the owning side's field becomes SQL; sync helpers exist to keep the object graph and the database telling the same story — omit them and you get NULL foreign keys or a persistence context that lies to you.</div>`,
      },
    ],
  },

  // ───────────────────────── 13. TYPESCRIPT ─────────────────────────
];
