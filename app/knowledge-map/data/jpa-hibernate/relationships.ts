import type { KmNode } from '../../types';

export const relationships: KmNode = {
  title: 'Relationships',
  level: 'intermediate',
  summary:
    'How entities point to each other: one-to-one, many-to-one, one-to-many and many-to-many.',
  simple:
    'In Java an Order holds a reference to a Customer. In the database it is just a customer_id column. Relationship mapping connects those two worlds.',
  points: [
    'Four kinds: <code>@ManyToOne</code>, <code>@OneToMany</code>, <code>@OneToOne</code>, <code>@ManyToMany</code>.',
    'Unidirectional (one side knows) or bidirectional (both sides know).',
    'In a bidirectional link, only the owning side writes the foreign key.',
    'Cascade and orphan removal control what happens to children automatically.',
  ],
  children: [
    {
      title: '@ManyToOne',
      level: 'beginner',
      summary: 'Many children point to one parent, e.g. many orders belong to one customer.',
      simple: 'Each order slip has a box "Customer #". Lots of slips can write the same number.',
      points: [
        'Maps to a foreign key column, set with <code>@JoinColumn(name = "customer_id")</code>.',
        'The most natural and efficient relationship. Start here.',
        'Default fetch is EAGER. Set <code>fetch = FetchType.LAZY</code> almost always.',
      ],
      detail: `<pre><code>@ManyToOne(fetch = FetchType.LAZY, optional = false)
@JoinColumn(name = "customer_id")
private Customer customer;</code></pre>`,
    },
    {
      title: 'Owning vs Inverse Side',
      level: 'intermediate',
      summary:
        'The owning side holds the foreign key; the inverse side uses mappedBy and is ignored on save.',
      simple:
        'Two people share one house key. Only the one whose name is on the contract (owning side) can change the lock.',
      points: [
        'The side with the foreign key column (usually <code>@ManyToOne</code>) is the owner.',
        'The other side says <code>mappedBy = "fieldName"</code>.',
        'Changing only the inverse side saves nothing to the DB.',
        'Keep both sides in sync in memory with helper methods.',
      ],
      tip: 'Classic bug: you add an item to order.getItems() but never set item.setOrder(order). Nothing is saved.',
    },
    {
      title: '@OneToMany',
      level: 'intermediate',
      summary: 'One parent holds a collection of children, e.g. an order with its items.',
      simple:
        'The customer’s folder lists all their order slips. The real link is still the number written on each slip.',
      points: [
        'Best as the inverse side: <code>@OneToMany(mappedBy = "order")</code>.',
        'Unidirectional <code>@OneToMany</code> without <code>@JoinColumn</code> creates an extra join table.',
        'Default fetch is LAZY. Keep it that way.',
        'Huge collections (thousands of rows)? Don’t map them; query instead.',
      ],
      children: [
        {
          title: 'Sync Helper Methods',
          level: 'intermediate',
          summary: 'Methods that update both sides of a bidirectional link at once.',
          simple:
            'When you move into a new flat, you update both your address book and the landlord’s tenant list. Helpers do both in one go.',
          points: [
            'Put <code>addItem</code>/<code>removeItem</code> on the parent.',
            'Keeps memory and database in agreement.',
            'Avoids weird bugs inside the same transaction.',
          ],
          detail: `<pre><code>public void addItem(OrderItem item) {
  items.add(item);
  item.setOrder(this);
}
public void removeItem(OrderItem item) {
  items.remove(item);
  item.setOrder(null);
}</code></pre>`,
        },
      ],
    },
    {
      title: '@OneToOne',
      level: 'intermediate',
      summary: 'Exactly one entity on each side, e.g. a user and their profile.',
      simple: 'A person and their passport: one each, linked together.',
      points: [
        'The owning side holds a unique foreign key.',
        'The inverse (<code>mappedBy</code>) side can’t be truly lazy without bytecode enhancement.',
        'Hibernate must check if the child exists, so it loads it anyway.',
        'Often simpler: share the primary key with <code>@MapsId</code>.',
      ],
      children: [
        {
          title: '@MapsId',
          level: 'advanced',
          summary: 'The child uses the parent’s id as its own primary key and foreign key.',
          points: [
            'No extra foreign key column; child id = parent id.',
            'You can load the child by the parent’s id with <code>find()</code>.',
            'Map only the child → parent side; skip the parent → child field.',
          ],
          detail: `<pre><code>@Entity
class UserProfile {
  @Id private Long id;
  @OneToOne(fetch = FetchType.LAZY)
  @MapsId
  private User user;
}</code></pre>`,
        },
      ],
    },
    {
      title: '@ManyToMany',
      level: 'intermediate',
      summary:
        'Both sides can have many of the other, stored in a join table, e.g. students and courses.',
      simple: 'A class sign-up sheet: each line pairs one student with one course.',
      points: [
        'Uses a join table set with <code>@JoinTable</code>.',
        'Use <code>Set</code>, not <code>List</code>, to avoid delete-all-and-reinsert.',
        'Never cascade <code>REMOVE</code> here: it deletes shared entities.',
        'Need extra columns (enrolled date)? Use a join entity instead.',
      ],
      children: [
        {
          title: 'Join Entity',
          level: 'advanced',
          summary: 'Replace @ManyToMany with a real entity plus two @ManyToOne links.',
          points: [
            'Example: <code>Enrollment</code> with <code>student</code>, <code>course</code>, <code>enrolledAt</code>.',
            'Lets you add columns and query the link itself.',
            'Gives you full control over fetching and deletes.',
          ],
          tip: 'Many teams model every many-to-many as a join entity from day one. It saves a painful refactor later.',
        },
      ],
    },
    {
      title: '@ElementCollection',
      level: 'intermediate',
      summary:
        'A collection of simple values or embeddables, stored in its own table without being entities.',
      simple:
        'A person’s list of phone numbers. The numbers belong only to that person and mean nothing on their own.',
      points: [
        'Works with basic types (<code>Set&lt;String&gt;</code>) or <code>@Embeddable</code> classes.',
        'Stored in a separate table (<code>@CollectionTable</code>), linked by the owner’s id.',
        'Always owned by the parent: saved and deleted with it, no cascade needed.',
        'Rows have no id. With a <code>List</code>, any change deletes and re-inserts every row.',
        'LAZY by default. Keep these collections small.',
      ],
      detail: `<pre><code>@ElementCollection
@CollectionTable(name = "customer_phones")
@Column(name = "phone")
private Set&lt;String&gt; phones = new HashSet&lt;&gt;();</code></pre>`,
    },
    {
      title: 'Cascade',
      level: 'intermediate',
      summary: 'Pass an operation like persist or remove from a parent on to its children.',
      simple:
        'Throw away a folder and the papers inside go too. Cascade decides which actions flow down like that.',
      points: [
        'Types: <code>PERSIST</code>, <code>MERGE</code>, <code>REMOVE</code>, <code>REFRESH</code>, <code>DETACH</code>, <code>ALL</code>.',
        'Use it from parent to child (<code>@OneToMany</code>), not child to parent.',
        'Only cascade to things the parent truly owns (order → items, not item → product).',
        'Cascade is not the same as DB <code>ON DELETE CASCADE</code>.',
      ],
      detail: `<pre><code>@OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
private List&lt;OrderItem&gt; items = new ArrayList&lt;&gt;();</code></pre>`,
    },
    {
      title: 'Orphan Removal',
      level: 'intermediate',
      summary: 'Delete a child row when it is removed from the parent’s collection.',
      simple:
        'If a page is torn out of the notebook, it goes straight in the bin instead of floating around.',
      points: [
        '<code>orphanRemoval = true</code> on <code>@OneToMany</code> or <code>@OneToOne</code>.',
        '<code>order.getItems().remove(item)</code> → <code>DELETE</code> on flush.',
        'Don’t replace the collection object; clear and refill it instead.',
      ],
      tip: 'Setting a new list on an orphanRemoval collection throws "A collection with cascade=all-delete-orphan was no longer referenced".',
    },
    {
      title: 'List vs Set (Bags)',
      level: 'advanced',
      summary:
        'The collection type changes the SQL Hibernate writes and which fetches are allowed.',
      points: [
        'A <code>List</code> without <code>@OrderColumn</code> is a "bag": unordered, duplicates allowed.',
        'Bags in <code>@ManyToMany</code> are rewritten fully on every change.',
        'You can’t JOIN FETCH two bags at once (<code>MultipleBagFetchException</code>).',
        '<code>Set</code> needs solid <code>equals</code>/<code>hashCode</code> on the child.',
        'Sort with <code>@OrderBy("createdAt DESC")</code> when reading.',
      ],
    },
  ],
};
