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
        a: `<ul>
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
        a: `<ul>
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
        a: `<pre>&lt;?xml version="1.0" encoding="UTF-8" ?&gt;
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
        a: `<pre>&lt;select id="search" resultMap="userMap"&gt;
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
        a: `<pre>&lt;!-- One-to-Many: Order has many Items --&gt;
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
        a: `<pre>// Annotation-based (simple queries)
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
        a: `<ul>
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
        a: `<p><strong>MyBatis-Plus</strong> is an enhancement on MyBatis that eliminates boilerplate CRUD code.</p>
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
        a: `<pre>&lt;!-- Method 1: foreach in XML --&gt;
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
        a: `<pre># application.yml
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
        a: `<ul>
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
        a: `<p>An entity can be in 4 states:</p>
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
        a: `<ul>
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
        a: `<p><strong>Problem</strong>: Loading parent entities triggers N additional queries for lazy children.</p>
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
        a: `<pre>// @OneToOne: User ↔ Profile
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
        a: `<ul>
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
        a: `<pre>// JPQL: SQL-like, uses entity names (not table names)
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
        a: `<ul>
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
        a: `<p>Spring Data JPA eliminates boilerplate by auto-implementing repository interfaces.</p>
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
        a: `<p>Hibernate automatically detects changes to managed entities and generates UPDATE statements on flush — without explicit save calls.</p>
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
        a: `<ul>
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
        a: `<p><strong>Cause</strong>: accessing a LAZY-loaded relationship after the persistence context (session) is closed.</p>
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
        a: `<pre>// Repository extends JpaSpecificationExecutor
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
        a: `<ul>
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
        a: `<p>JPA supports four strategies for mapping inheritance hierarchies to database tables:</p>
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
        a: `<p><strong>Optimistic locking</strong> prevents lost updates when multiple transactions modify the same row concurrently — without holding database locks.</p>
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
        a: `<p>DTO projections let you select only the columns you need, avoiding loading entire entities (better performance).</p>
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
    ],
  },

  // ───────────────────────── 13. TYPESCRIPT ─────────────────────────
];
