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
        a: `<div class="interview-answer"><p>The one-liner I give is that MyBatis is a SQL mapper and JPA is a full ORM. With MyBatis I own the SQL and it just maps result sets to objects; with Hibernate the framework generates SQL from my entity mappings and manages a persistence context. My rule of thumb: reach for MyBatis when the SQL is the hard part — complex reporting, legacy schemas, DBA-tuned queries — and JPA when the domain model is the hard part and I want dirty checking and caching for free. In Korean enterprise and fintech shops MyBatis is still the default because teams want every query visible and reviewable. The tradeoff is boilerplate — MyBatis makes you hand-write the CRUD that JPA gives you automatically.</p></div>
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
        a: `<div class="interview-answer"><p>This is really a security question in disguise. <code>#{}</code> binds a value as a PreparedStatement parameter — it compiles to a <code>?</code> and is safe from SQL injection. The dollar-sign form does raw string substitution straight into the SQL text, so it is a live SQL-injection hole. I only use dollar-substitution for things that cannot be bound — a dynamic table or column name, or a sort direction — and even then only against a whitelist, never raw user input. If I see it wrapping a request parameter in a code review, that is an immediate block.</p></div>
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
        a: `<div class="interview-answer"><p>The mental model is that a mapper XML is the SQL implementation of an interface, tied to it by the <code>namespace</code> matching the mapper interface's fully-qualified name and each statement id matching a method name. The key pieces are a <code>resultMap</code> to map columns to properties, plus the CRUD statement tags. Two things I always check: turn on <code>map-underscore-to-camel-case</code> so you do not need a resultMap for every simple query, and use <code>useGeneratedKeys</code> with <code>keyProperty</code> on inserts so the generated PK flows back into your object. The gotcha juniors hit is a mismatch between the namespace and the interface package — MyBatis then throws a binding exception at startup.</p></div>
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
        a: `<div class="interview-answer"><p>MyBatis dynamic SQL is basically a templating language over your query, and these tags exist to stop you doing fragile string concatenation. <code>&lt;if&gt;</code> conditionally includes a fragment; <code>&lt;where&gt;</code> is the important one because it strips the leading AND/OR so you do not end up with <code>WHERE AND</code>; <code>&lt;choose&gt;</code> is your switch/case; and <code>&lt;foreach&gt;</code> builds IN-lists and batch inserts. The classic bug is a trailing AND — <code>&lt;where&gt;</code> only trims leading connectives, so for full control I reach for <code>&lt;trim&gt;</code>. And I keep the genuinely complex conditionals in XML rather than annotations, because they stay readable there.</p></div>
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
        a: `<div class="interview-answer"><p>The two tags to know are <code>&lt;collection&gt;</code> for one-to-many and <code>&lt;association&gt;</code> for many-to-one or one-to-one — collection gives you a list, association a single nested object. My default is to do one JOIN and let a nested resultMap assemble the graph, using the <code>&lt;id&gt;</code> element so MyBatis can dedupe parent rows correctly. The alternative is a nested select per row, which reads cleanly but is the N+1 trap. So the real answer is: use JOIN plus a nested resultMap for data you always need, and a nested select only for children you rarely touch.</p></div>
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
        a: `<div class="interview-answer"><p>My rule is simple: annotations for trivial CRUD, XML for anything with dynamic SQL, joins, or result mapping. <code>@Select</code> and <code>@Insert</code> on the interface keep short queries right next to the code, but the moment you need <code>&lt;if&gt;</code> or a real resultMap, cramming it into annotations with <code>@SelectProvider</code> gets ugly fast. Most teams standardize on XML for consistency and because it keeps SQL out of the Java and reviewable by DBAs. Mixing both is fine — a mapper can have some annotated methods and some in XML.</p></div>
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
        a: `<div class="interview-answer"><p>There are two levels. The first-level cache is per <code>SqlSession</code>, always on, and just guarantees the same query in the same session does not hit the DB twice — it is cleared on commit or close. The second-level cache is per mapper namespace, shared across sessions, and off by default. Honestly, in production I usually leave L2 off: it is an in-heap per-JVM cache, so with multiple app instances behind a load balancer you get stale reads, and it invalidates per namespace not per table, so a query that JOINs across mappers goes stale. I would rather cache explicitly at the service layer with Redis where I control invalidation.</p></div>
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
        a: `<div class="interview-answer"><p>MyBatis-Plus is a productivity layer that gives you back the CRUD that plain MyBatis makes you hand-write. You extend <code>BaseMapper</code> and get selectById, insert, updateById and so on for free, plus a <code>QueryWrapper</code> for building conditions fluently, a pagination plugin, optimistic locking, and soft delete. It is hugely popular in the Chinese ecosystem. The thing I watch for is that <code>QueryWrapper</code> takes raw column-name strings, so it is easy to lose type safety and to leak dynamic column names — so for anything non-trivial I still drop to XML.</p></div>
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
        a: `<div class="interview-answer"><p>Two approaches, and knowing when each breaks is the point. The <code>&lt;foreach&gt;</code> multi-row INSERT is simplest, but it builds one giant SQL string, so you hit packet-size or statement-length limits, and it is a single round trip. For real volume I use <code>ExecutorType.BATCH</code>, which uses JDBC addBatch/executeBatch under the hood, and I flush every few hundred rows to keep memory bounded. The gotcha: batch mode does not return generated keys reliably and does not give you per-row affected counts until flush, so mixing it with reads in the same session surprises people.</p></div>
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
        a: `<div class="interview-answer"><p>With the <code>mybatis-spring-boot-starter</code> it is mostly YAML: point <code>mapper-locations</code> at your XML, set <code>type-aliases-package</code> for short class names, and — the one everyone forgets — turn on <code>map-underscore-to-camel-case</code> so <code>user_name</code> maps to <code>userName</code> without a resultMap. Then either <code>@MapperScan</code> on a config class or <code>@Mapper</code> on each interface so Spring registers the proxies. That underscore-to-camel flag alone kills most of your resultMap boilerplate.</p></div>
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
        a: `<div class="interview-answer"><p>MyBatis never hides SQL, so N+1 here is a mapping choice, not a surprise. It happens when you use a nested <code>select</code> mapping — one query for the parents, then one extra query per parent to load its children. The fix is the same idea as in JPA: do a JOIN and assemble with a nested resultMap so it is one round trip, and make sure the <code>&lt;id&gt;</code> element is present or MyBatis cannot dedupe parents. I reserve <code>fetchType=lazy</code> nested selects for children I rarely access; if I loop over every parent and touch the collection, I am right back to N+1.</p></div>
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
        a: `<div class="interview-answer"><p>The danger is that the default cache is in-heap and per-JVM. Run two instances behind a load balancer and each has its own copy: an update on instance B flushes only B's cache, so A serves stale data until its flush interval expires. Worse, invalidation is per-namespace not per-table, so if OrderMapper caches a query that joins users, a write through UserMapper will not flush it — silent dirty reads. And any writer outside MyBatis bypasses it entirely. So in a clustered deployment I disable L2 and cache at the service layer with Redis or Caffeine, where invalidation is under my control.</p></div>
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
        a: `<div class="interview-answer"><p>The trap is that a normal mapper returning a <code>List</code> materializes every row before it returns, and on top of that the JDBC driver often buffers the whole result set client-side — MySQL does by default. So you need both a streaming consumer, a <code>Cursor</code> or a <code>ResultHandler</code>, and a driver-level fetch size that actually streams. The MySQL gotcha everyone forgets is that it ignores normal fetch sizes — you set <code>fetchSize = Integer.MIN_VALUE</code> or add <code>useCursorFetch=true</code>. And the cursor needs the session open, so the method must be <code>@Transactional</code>, or you get a closed-session error.</p></div>
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
        a: `<div class="interview-answer"><p>This is a subtle one that bites everyone: the <code>status != null and status != ''</code> guard people copy-paste for strings silently breaks for numbers. In OGNL, comparing a number to an empty string coerces the empty string to <code>0.0</code>, so 0 equals empty-string is true — meaning your <code>&lt;if&gt;</code> gets skipped when status is 0, the predicate vanishes, and the query quietly returns all rows. The rule: the not-empty-string check is for Strings only; numeric params get a null-check and nothing more. The related gotcha is single-quote char literals in a <code>test</code> expression, which is why you swap the quote nesting.</p></div>
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
        a: `<div class="interview-answer"><p>The clean way to say it: JPA is the specification, Hibernate is the implementation. JPA defines the annotations and the EntityManager API; Hibernate is the actual ORM engine behind it, and there are others like EclipseLink. The practical takeaway is to code to the <code>jakarta.persistence</code> interfaces so you stay portable — but I am honest that in real projects you inevitably reach for Hibernate-specific features like <code>@BatchSize</code> or its second-level cache. So I frame it as portable in theory, Hibernate in practice.</p></div>
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
        a: `<div class="interview-answer"><p>There are four states, and knowing them explains almost every JPA surprise. Transient is a plain <code>new</code> object with no DB identity; managed means it is in the persistence context, so Hibernate dirty-checks it and auto-flushes changes; detached is a once-managed object after the context closed, so mutations no longer persist; and removed is scheduled for delete. The key insight for juniors is that on a managed entity you do not call save — just mutate it and dirty checking writes the UPDATE. Most bugs, like LazyInitializationException, come from touching a detached entity as if it were still managed.</p></div>
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
        a: `<div class="interview-answer"><p>EAGER loads the association with the parent; LAZY defers it behind a proxy until you touch it. My strong default is to make everything LAZY — including <code>@ManyToOne</code>, which is EAGER by default and quietly fires extra queries — and then fetch eagerly on demand with <code>JOIN FETCH</code> or an <code>@EntityGraph</code>. The reason is control: EAGER associations cause N+1 and load data you did not ask for on every query path, while LAZY forces you to declare, per use case, exactly what you need.</p></div>
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
        a: `<div class="interview-answer"><p>N+1 is the number-one JPA performance bug: you load N parents with one query, then each lazy child access fires another query, so a list of 100 orders becomes 101 round trips. The fixes, in order: <code>JOIN FETCH</code> in JPQL or an <code>@EntityGraph</code> to load in a single query, and Hibernate's <code>@BatchSize</code> to at least collapse the N into batched IN-queries. The catch with JOIN FETCH is that fetching two collections at once causes a cartesian product, and pagination with a fetch join happens in memory — so for that case I prefer @BatchSize or two separate queries.</p></div>
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
        a: `<div class="interview-answer"><p>The four annotations map cardinality, but the thing interviewers actually test is who owns the foreign key. The owning side is the one without <code>mappedBy</code> — for a bidirectional one-to-many that is the <code>@ManyToOne</code> child, which holds the FK column; <code>mappedBy</code> just says the other side owns this. Only the owning side's state produces SQL. For many-to-many I always map the join table explicitly with <code>@JoinTable</code>, and I prefer a <code>Set</code> over a <code>List</code> to avoid Hibernate's delete-and-reinsert behavior. And I add sync helper methods so both sides of a bidirectional link stay consistent.</p></div>
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
        a: `<div class="interview-answer"><p>The EntityManager is your handle to JPA — persist, find, merge, remove — and the persistence context behind it is the first-level cache and unit of work. Its two guarantees are identity — <code>find</code> the same id twice in one context and you get the exact same instance, no second SELECT — and dirty checking, so mutations flush automatically. In Spring it is transaction-scoped by default, so it lives for one <code>@Transactional</code> method. Understanding this is what explains why changes persist without a save call, and why a lazy access outside the transaction blows up.</p></div>
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
        a: `<div class="interview-answer"><p>Three tools for three jobs. JPQL is object-oriented SQL over entity names — readable, portable, my default. The Criteria API is programmatic and type-safe, which I only reach for when a query is genuinely dynamic with many optional filters, because it is verbose. Native SQL is the escape hatch for database-specific features, window functions, or hand-tuned performance — you trade portability for full power. In modern code I would add that for dynamic queries I often prefer Spring Data Specifications or QueryDSL over raw Criteria, and for reads I lean on DTO projections.</p></div>
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
        a: `<div class="interview-answer"><p>L1 is the persistence context — per session, always on, cannot be disabled, and guarantees one instance per id within a transaction. L2 is shared across sessions, optional, and needs a provider like EhCache or Caffeine. My honest take: L1 you get for free and rely on; L2 I am cautious about because it adds invalidation complexity, and in a clustered app it needs a distributed provider or you get stale data. There is also the query cache as a third layer, which caches query result ids and is easy to misconfigure. I usually cache read-mostly reference data in L2 and leave the rest.</p></div>
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
        a: `<div class="interview-answer"><p>Spring Data JPA removes the DAO boilerplate: you declare an interface extending <code>JpaRepository</code> and it generates the implementation. You get save/findById/findAll for free, derived queries from method names like <code>findByEmail</code>, and <code>@Query</code> for custom JPQL, plus <code>Pageable</code> for pagination. Two things I flag: derived-query method names get unreadable fast, so past two or three conditions I switch to <code>@Query</code> or a Specification; and any <code>@Modifying</code> bulk update bypasses the persistence context, so you must clear it or your L1 cache holds stale entities.</p></div>
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
        a: `<div class="interview-answer"><p>Dirty checking is the magic where you load a managed entity, mutate it, and Hibernate writes the UPDATE at flush without any save call. It works by snapshotting the entity's original field values at load time and diffing against them at flush. It is convenient but has a real cost: on a big read Hibernate keeps snapshots and diffs every entity, which is wasted work. So for read paths I use <code>@Transactional(readOnly = true)</code>, which lets Hibernate skip the snapshot and dirty check. The other gotcha is that a partial update still writes the whole row unless you enable dynamic-update.</p></div>
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
        a: `<div class="interview-answer"><p>They sound similar but solve different problems. Cascade propagates lifecycle operations from parent to child — persist the order and its items get persisted too. orphanRemoval is specifically about removing a child from the parent's collection: with it, taking an item out of the list issues a DELETE; without it, Hibernate just nulls the foreign key and leaves an orphan row. So the classic combo for a true parent-owns-children aggregate is <code>cascade = ALL</code> plus <code>orphanRemoval = true</code>. The caution: only cascade REMOVE when the child genuinely cannot exist without the parent, or you will delete shared data.</p></div>
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
        a: `<div class="interview-answer"><p>This is the single most common JPA error, and it means you touched a lazy association after the persistence context closed — the proxy has no session to load from. The fixes in order of preference: fetch what you need up front with <code>JOIN FETCH</code> or an <code>@EntityGraph</code>, or return a DTO projection so there are no proxies at all. What I actively avoid is open-session-in-view — it fixes the exception by keeping the session open for the whole request, but it hides N+1 and leaks DB work into the view layer. I set <code>open-in-view=false</code> so the problem surfaces at development time.</p></div>
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
        a: `<div class="interview-answer"><p>Specifications are Spring Data's wrapper over the Criteria API for building dynamic, composable queries. Each spec is a lambda producing a Predicate, and you combine them with <code>and</code>/<code>or</code>, returning null to skip a filter that was not provided. I use them exactly for the search-screen problem — a bunch of optional filters where string-concatenating JPQL would be fragile and injection-prone. They are type-safe and reusable. The downside is the Criteria API underneath is verbose and hard to read for complex joins, so for heavy dynamic querying I would consider QueryDSL instead.</p></div>
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
        a: `<div class="interview-answer"><p>The one that matters in practice is IDENTITY versus SEQUENCE. IDENTITY uses an auto-increment column and the id only exists after the INSERT, which forces Hibernate to flush each insert immediately — so it kills JDBC batch inserts. SEQUENCE gets the id before the insert from a DB sequence, so Hibernate can batch, and with <code>allocationSize</code> it pre-allocates a block of ids to cut round trips. So on Postgres or Oracle I use SEQUENCE for anything write-heavy. MySQL historically only had IDENTITY, which is a real reason batch-insert performance suffers there. TABLE is portable but slow, and AUTO just delegates to the dialect.</p></div>
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
        a: `<div class="interview-answer"><p>Four strategies, and it is a real performance-versus-cleanliness tradeoff. SINGLE_TABLE — the default — puts the whole hierarchy in one table with a discriminator column: fastest, no joins, but subclass fields must be nullable so you lose NOT NULL constraints. JOINED normalizes into a table per class: clean schema, but every query joins. TABLE_PER_CLASS I avoid because polymorphic queries turn into UNION ALL. And @MappedSuperclass is not really inheritance in the DB — it just shares fields, with no polymorphic query. My default is SINGLE_TABLE, moving to JOINED only when the nullable-column and constraint situation gets genuinely messy.</p></div>
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
        a: `<div class="interview-answer"><p>Optimistic locking with <code>@Version</code> prevents lost updates without holding a database lock. You add a version column; every UPDATE includes <code>WHERE version = ?</code> and bumps it, so if another transaction committed first, your update matches zero rows and Hibernate throws <code>OptimisticLockException</code>. It is the right default for web apps because conflicts are rare and you do not hold locks across user think-time. You handle the exception by reloading and retrying, or telling the user. When contention is genuinely high — seat booking, inventory decrement — I switch to pessimistic <code>SELECT FOR UPDATE</code>. And you never touch the version field by hand.</p></div>
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
        a: `<div class="interview-answer"><p>A DTO projection means selecting only the columns you need instead of hydrating a full entity — and it is one of the highest-leverage JPA performance moves. Loading a whole entity pulls every column including blobs and can drag in lazy associations; a projection is a lean read-only view. Spring gives you interface projections, which are simplest, and constructor or record-based DTOs via <code>SELECT new</code> in JPQL. The big win beyond less data transfer is that projections have no managed proxies, so there is no LazyInitializationException and no dirty-checking overhead. My rule: never load a full entity just to render a list view.</p></div>
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
        a: `<div class="interview-answer"><p>This trips up even senior devs because two entity quirks break IDE-generated equals/hashCode. First, the id is null before persist, so an id-based hashCode changes when you save — and an entity already sitting in a HashSet gets lost because its bucket moved. Second, Hibernate proxies are runtime subclasses, so <code>getClass()</code> comparisons fail for the same logical row. The robust pattern is a constant hashCode — usually <code>getClass().hashCode()</code> — with id-based equals using <code>instanceof</code> and the id getter, treating two transient entities as never equal. And never put Lombok's <code>@Data</code> on an entity — it drags in mutable fields and can trigger lazy loading inside equals.</p></div>
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
        a: `<div class="interview-answer"><p>The trap is that these three behave differently. <code>persist</code> makes a transient entity managed and returns void — the argument itself becomes managed. <code>merge</code> is the sneaky one: it copies your detached object's state onto a managed copy and returns that copy, so your original argument stays detached — if you keep mutating the argument after merge, nothing persists. Spring Data's <code>save</code> is just a dispatcher: if the entity looks new it calls persist, otherwise merge. Two consequences: saving an entity with a pre-assigned id like a UUID looks not-new, so save does a merge with an extra SELECT — fix with <code>Persistable.isNew()</code> or a <code>@Version</code> field; and merge overwrites every column, so a stale detached object can silently revert concurrent changes unless @Version guards it.</p></div>
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
        a: `<div class="interview-answer"><p><code>findById</code> runs a SELECT immediately and gives you a real, initialized entity or an empty Optional if the row is missing. <code>getReferenceById</code> returns a lazy proxy with no SQL at all — the DB is only hit when you touch a non-id field. The perfect use case for getReferenceById is wiring a foreign key: if I just need to set an order's customer, I grab a reference by id and set it, and the INSERT gets the FK with zero pointless SELECT. The catch is deferred failure — if the row does not exist, you only find out when you access a field, and it throws <code>EntityNotFoundException</code> possibly far from the call site, or a LazyInitializationException if the proxy escapes the transaction. So use it to wire FKs; use findById when you actually need the data or an existence check now.</p></div>
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
        a: `<div class="interview-answer"><p>In a bidirectional relationship only the owning side — the one without <code>mappedBy</code>, usually the <code>@ManyToOne</code> holding the FK — produces SQL. So if you only add a child to the parent's collection and do not set the child's back-reference, the foreign key is never written and you get a null FK or a constraint violation. And if you set only the owning side, the in-memory collection is stale within the same transaction, which breaks cascades and contains checks. That is why you write <code>addItem</code>/<code>removeItem</code> helpers that set both sides at once — so the object graph and the database tell the same story. It is also why entity equals and toString must not traverse both directions, or you get infinite recursion.</p></div>
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
