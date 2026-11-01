import type { KmNode } from '../../types';

const identifiers: KmNode = {
  title: 'IDs & Generation',
  level: 'beginner',
  summary: 'Every entity needs a primary key; JPA can generate it in several ways.',
  simple:
    'The id is the entity’s passport number. You can let the database hand one out, or bring your own.',
  points: [
    '<code>@Id</code> marks the primary key; <code>@GeneratedValue</code> lets JPA generate it.',
    'Strategies: <code>IDENTITY</code>, <code>SEQUENCE</code>, <code>TABLE</code>, <code>UUID</code>, <code>AUTO</code>.',
    'The choice affects performance, especially insert batching.',
    'Use wrapper types (<code>Long</code>), so "not saved yet" can be <code>null</code>.',
  ],
  children: [
    {
      title: 'IDENTITY',
      level: 'beginner',
      summary: 'The database fills the id with an auto-increment column on insert.',
      simple:
        'Like a ticket machine at the counter: you only get your number when you actually walk up to it.',
      points: [
        'Natural fit for MySQL and SQL Server.',
        'Hibernate must run the <code>INSERT</code> right away on <code>persist()</code> to learn the id.',
        'That disables JDBC insert batching for that entity.',
      ],
      detail: `<pre><code>@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;</code></pre>`,
    },
    {
      title: 'SEQUENCE',
      level: 'intermediate',
      summary:
        'Hibernate asks a database sequence for ids before inserting, so inserts can be batched.',
      simple:
        'You grab a stack of numbered tickets in advance, then hand them out yourself without walking to the machine each time.',
      points: [
        'Best choice on PostgreSQL, Oracle, SQL Server 2012+, H2.',
        'Inserts can be delayed to flush time and sent in batches.',
        'Hibernate 6 default sequence name: <code>&lt;entity&gt;_SEQ</code> with increment 50.',
        'With allocationSize 50, one sequence call reserves 50 ids in memory (pooled optimizer).',
      ],
      detail: `<pre><code>@Id
@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_seq")
@SequenceGenerator(name = "order_seq", sequenceName = "order_seq", allocationSize = 50)
private Long id;</code></pre>`,
      tip: 'allocationSize must match the sequence INCREMENT BY in the database. Gaps in ids are normal; never promise gap-free numbers.',
    },
    {
      title: 'UUID IDs',
      level: 'intermediate',
      summary: 'Random 128-bit ids generated in Java, no database round trip needed.',
      simple:
        'Everyone makes up their own passport number so random that two people will never pick the same one.',
      points: [
        '<code>GenerationType.UUID</code> is standard since Jakarta Persistence 3.1 (Hibernate 6.2).',
        'Safe to create offline and merge across systems; hard to guess in URLs.',
        'Random UUIDs (v4) scatter index inserts; time-ordered ones (v7) index better.',
        'Store as a native <code>uuid</code> type or <code>BINARY(16)</code>, not a 36-char string.',
      ],
      detail: `<pre><code>@Id
@GeneratedValue(strategy = GenerationType.UUID)
private UUID id;</code></pre>`,
    },
    {
      title: 'Composite Keys',
      level: 'advanced',
      summary: 'A primary key made of several columns, mapped with @EmbeddedId or @IdClass.',
      points: [
        '<code>@EmbeddedId</code>: one <code>@Embeddable</code> key object holding all parts.',
        '<code>@IdClass</code>: several <code>@Id</code> fields plus a matching key class.',
        'The key class must implement <code>equals</code>/<code>hashCode</code> and be <code>Serializable</code>.',
        'Common for join tables and legacy schemas; prefer a single surrogate id for new tables.',
      ],
    },
    {
      title: 'Natural IDs',
      level: 'advanced',
      summary: 'A unique business key (email, ISBN) you can load by, next to the surrogate id.',
      points: [
        'Hibernate extra: mark the field <code>@NaturalId</code>.',
        'Load with <code>session.bySimpleNaturalId(Book.class).load(isbn)</code>.',
        'Can be cached, so repeated lookups skip the database.',
        'A great base for <code>equals</code>/<code>hashCode</code>.',
      ],
    },
  ],
};

export const entityMapping: KmNode = {
  title: 'Entities & Mapping',
  level: 'beginner',
  summary: 'How you tell JPA which class is a table and how each field becomes a column.',
  simple:
    'Annotations are sticky notes on your class: "this is a table", "this field is a column called price". JPA reads the notes and does the rest.',
  points: [
    'An entity is a class marked <code>@Entity</code> with an <code>@Id</code>.',
    'Good defaults: class name → table name, field name → column name.',
    'Override names and rules with <code>@Table</code> and <code>@Column</code>.',
    'Value objects go in <code>@Embeddable</code>; class trees use inheritance mapping.',
  ],
  children: [
    {
      title: '@Entity & @Table',
      level: 'beginner',
      summary: 'Marks a class as a database-backed entity and optionally names its table.',
      simple:
        'Like putting a name tag on a box: "this box lives in the products shelf". Without the tag, JPA ignores the class.',
      points: [
        'Needs a no-arg constructor (can be <code>protected</code>) and an <code>@Id</code> field.',
        'Class must not be <code>final</code>, so Hibernate can create lazy proxies.',
        'Field access (annotations on fields) is the common, simpler choice.',
        'Records can’t be entities: they are final and immutable.',
      ],
      detail: `<pre><code>@Entity
@Table(name = "products")
public class Product {
  @Id @GeneratedValue
  private Long id;

  @Column(nullable = false, length = 100)
  private String name;

  private BigDecimal price;

  protected Product() {}
}</code></pre>`,
    },
    {
      title: 'Columns & Basic Types',
      level: 'beginner',
      summary: 'Simple fields like String, numbers, booleans and dates map straight to columns.',
      simple:
        'Each simple field is one cell in the row. JPA picks a matching column type, like VARCHAR for String.',
      points: [
        '<code>@Column</code> sets name, <code>nullable</code>, <code>length</code>, <code>unique</code>, <code>precision</code>/<code>scale</code>.',
        'These settings mostly affect schema generation, not runtime checks.',
        '<code>@Transient</code> (or the <code>transient</code> keyword) keeps a field out of the DB.',
        '<code>@Lob</code> for big text or binary data.',
        'Use <code>BigDecimal</code> for money, never <code>double</code>.',
      ],
    },
    identifiers,
    {
      title: 'Enums',
      level: 'beginner',
      summary: 'Store enums as names with @Enumerated(EnumType.STRING), not as numbers.',
      simple:
        'Saving an enum as a number is like labeling jars 0, 1, 2. Add a new jar in the middle and every label is now wrong.',
      points: [
        'Default is <code>ORDINAL</code> (0, 1, 2…), which breaks when you reorder constants.',
        '<code>@Enumerated(EnumType.STRING)</code> stores the name, safe and readable.',
        'Need custom codes like "A"/"I"? Use an <code>AttributeConverter</code>.',
      ],
      detail: `<pre><code>@Enumerated(EnumType.STRING)
private OrderStatus status;</code></pre>`,
      tip: 'Always STRING unless you have a very good reason. ORDINAL bugs show up months later.',
    },
    {
      title: 'Dates & Times',
      level: 'beginner',
      summary: 'Use java.time types; they are supported natively since JPA 2.2.',
      simple:
        'Old java.util.Date is a messy drawer mixing date, time and timezone. java.time gives you a clean box for each.',
      points: [
        '<code>LocalDate</code>, <code>LocalDateTime</code>, <code>Instant</code>, <code>OffsetDateTime</code> all work.',
        'No more <code>@Temporal</code>; it is only for old <code>Date</code>/<code>Calendar</code>.',
        '<code>Instant</code> is a good choice for "when did it happen" timestamps.',
        'Hibernate setting <code>hibernate.jdbc.time_zone=UTC</code> avoids timezone surprises.',
      ],
    },
    {
      title: 'Embeddables',
      level: 'intermediate',
      summary: 'A small value class whose fields are stored as columns in the owner’s table.',
      simple:
        'An Address is part of a Customer, like a pocket sewn into a jacket. It has no life (or id) of its own.',
      points: [
        'Mark the class <code>@Embeddable</code>, use it with <code>@Embedded</code>.',
        'No id, no own table: columns live in the owning table.',
        'Reuse twice in one entity with <code>@AttributeOverride</code>.',
        'Java records work as embeddables since Hibernate 6.2 and Jakarta Persistence 3.2.',
      ],
      detail: `<pre><code>@Embeddable
public record Address(String street, String city, String zip) {}

@Entity
public class Customer {
  @Id @GeneratedValue Long id;
  @Embedded Address address;
}</code></pre>`,
    },
    {
      title: 'Attribute Converters',
      level: 'intermediate',
      summary: 'Small classes that turn a Java value into a column value and back.',
      simple:
        'A converter is a currency exchange booth: euros in, dollars out, and the reverse on the way home.',
      points: [
        'Implement <code>AttributeConverter&lt;JavaType, DbType&gt;</code>.',
        '<code>@Converter(autoApply = true)</code> applies it to every field of that type.',
        'Great for custom enum codes, encrypted strings or value objects like <code>Money</code>.',
        'For JSON columns, Hibernate 6 offers <code>@JdbcTypeCode(SqlTypes.JSON)</code>.',
      ],
      detail: `<pre><code>@Converter(autoApply = true)
class YesNoConverter implements AttributeConverter&lt;Boolean, String&gt; {
  public String convertToDatabaseColumn(Boolean b) { return b ? "Y" : "N"; }
  public Boolean convertToEntityAttribute(String s) { return "Y".equals(s); }
}</code></pre>`,
    },
    {
      title: 'Inheritance Mapping',
      level: 'intermediate',
      summary: 'Ways to store a class hierarchy (e.g. Payment → CardPayment) in tables.',
      simple:
        'You have a family of classes but tables don’t have families. You choose: one big table, one table per class joined, or fully separate tables.',
      points: [
        'Set with <code>@Inheritance(strategy = …)</code> on the root entity.',
        'Default strategy is <code>SINGLE_TABLE</code>.',
        'Lets you run polymorphic queries like <code>select p from Payment p</code>.',
        'Often composition beats inheritance; use it only if you query the parent type.',
      ],
      children: [
        {
          title: 'SINGLE_TABLE',
          level: 'intermediate',
          summary:
            'All subclasses share one table, with a discriminator column saying which type a row is.',
          simple: 'One big drawer for all payment types, each item tagged "CARD" or "PAYPAL".',
          points: [
            'Fastest: no joins for polymorphic queries.',
            'Subclass columns must be nullable.',
            'Use <code>@DiscriminatorColumn</code> and <code>@DiscriminatorValue</code>.',
          ],
        },
        {
          title: 'JOINED',
          level: 'intermediate',
          summary:
            'Parent table holds common columns; each subclass table holds its own, joined by id.',
          simple:
            'A shared base drawer plus a small extra drawer per type, linked by the same number.',
          points: [
            'Clean, normalized schema with NOT NULL possible on subclass columns.',
            'Every load needs joins; polymorphic queries join all subclass tables.',
            'Good when subclasses have many specific fields.',
          ],
        },
        {
          title: 'TABLE_PER_CLASS',
          level: 'advanced',
          summary: 'Each concrete class gets a full table of its own, with all columns.',
          points: [
            'Polymorphic queries need <code>UNION</code> over all tables: slow.',
            'Can’t use <code>IDENTITY</code> ids; ids must be unique across tables.',
            'Rarely the right choice.',
          ],
        },
        {
          title: '@MappedSuperclass',
          level: 'intermediate',
          summary: 'Share common fields (id, audit dates) without making the parent an entity.',
          simple:
            'A template you copy into every table. The parent itself is never a table and can’t be queried.',
          points: [
            'Subclass tables get the parent’s columns.',
            'No polymorphic queries on the parent type.',
            'Classic use: a <code>BaseEntity</code> with <code>id</code>, <code>version</code>, <code>createdAt</code>.',
          ],
        },
      ],
    },
    {
      title: 'Soft Delete & Filters',
      level: 'advanced',
      summary:
        'Hide rows instead of deleting them, or filter rows on every query, with Hibernate extras.',
      simple:
        'Instead of shredding a file, you stamp it "archived", and the clerk skips archived files from then on.',
      points: [
        '<code>@SoftDelete</code> (Hibernate 6.4+): <code>remove()</code> sets a flag column instead of running <code>DELETE</code>.',
        'Soft-deleted rows are hidden from finds, queries and collections on their own.',
        '<code>@SQLRestriction("active = true")</code> adds a fixed SQL condition. It replaced <code>@Where</code> in 6.3.',
        '<code>@Filter</code> is a condition you switch on per session, e.g. "only this tenant" or "only this year".',
        'Unique constraints still see the hidden rows. Plan your indexes for that.',
      ],
      detail: `<pre><code>@Entity
@SoftDelete
public class Customer {
  @Id @GeneratedValue Long id;
  String name;
}</code></pre>`,
    },
    {
      title: 'equals & hashCode',
      level: 'advanced',
      summary: 'Entities need careful equality because the id is null until the entity is saved.',
      simple:
        'A newborn without an ID card yet. If you compare people only by ID card, all newborns look the same.',
      points: [
        'Default <code>Object</code> equality is fine if you never mix entities from different sessions.',
        'Never use all fields, and never touch lazy collections in <code>equals</code>.',
        'Business key (e.g. ISBN, email) is the safest choice when you have one.',
        'Id-based: return <code>false</code> when id is null and use a constant <code>hashCode</code>.',
        'Lombok <code>@Data</code> on entities is a classic bug source.',
      ],
      detail: `<pre><code>public boolean equals(Object o) {
  if (this == o) return true;
  if (!(o instanceof Book other)) return false;
  return id != null &amp;&amp; id.equals(other.getId());
}
public int hashCode() { return getClass().hashCode(); }</code></pre>`,
      tip: 'Use getters (other.getId()) in equals: "other" may be a Hibernate proxy whose fields are empty.',
    },
  ],
};
