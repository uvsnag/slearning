import type { KmNode } from '../../types';

export const persistenceContext: KmNode = {
  title: 'Persistence Context',
  level: 'intermediate',
  summary:
    'The EntityManager’s working memory of loaded entities, and the states an entity moves through.',
  simple:
    'Think of a desk. Entities you load are placed on the desk; you edit them right there, and when you leave (commit), the desk is copied back to the filing cabinet (database).',
  points: [
    'Each <code>EntityManager</code> has one persistence context (in Hibernate: the <code>Session</code>).',
    'Inside it, each row is loaded at most once: one id = one Java object.',
    'Changes to managed entities are saved automatically on flush.',
    'Entity states: transient, managed, detached, removed.',
  ],
  children: [
    {
      title: 'EntityManager API',
      level: 'beginner',
      summary: 'The main JPA interface for saving, loading, deleting and querying entities.',
      simple:
        'It is your remote control for the database: buttons for find, save, delete and search.',
      points: [
        '<code>persist</code>, <code>find</code>, <code>merge</code>, <code>remove</code>, <code>refresh</code>.',
        '<code>createQuery</code>, <code>createNativeQuery</code>, <code>getCriteriaBuilder</code>.',
        '<code>flush</code>, <code>clear</code>, <code>detach</code>, <code>contains</code>.',
        'Not thread-safe: never share one between threads.',
        'Hibernate’s <code>Session</code> extends it; get it with <code>em.unwrap(Session.class)</code>.',
      ],
    },
    {
      title: 'What the Context Does',
      level: 'intermediate',
      summary: 'It caches loaded entities, tracks their changes and delays SQL until flush.',
      simple:
        'A notepad where you jot changes during the meeting and send one tidy email at the end, instead of an email per thought.',
      points: [
        'Identity guarantee: <code>em.find(User.class, 1) == em.find(User.class, 1)</code>.',
        'Acts as the first-level cache: the second <code>find</code> hits no database.',
        'Write-behind: SQL is queued and sent at flush, not on each setter.',
        'Lives as long as the transaction in Spring (transaction-scoped context).',
      ],
    },
    {
      title: 'Entity States',
      level: 'intermediate',
      summary:
        'Transient, managed, detached and removed: whether the context knows and tracks the object.',
      simple:
        'Transient = a stranger. Managed = an employee the office watches. Detached = an ex-employee. Removed = someone about to be let go.',
      points: [
        'Transient (new): created with <code>new</code>, unknown to JPA, no row yet.',
        'Managed: tracked; changes are saved on flush.',
        'Detached: was managed, but the context closed or it was evicted; changes are ignored.',
        'Removed: scheduled for <code>DELETE</code> at flush.',
      ],
      detail: `<pre><code>User u = new User("ann");   // transient
em.persist(u);               // managed
u.setName("Ann");            // tracked, UPDATE on flush
em.detach(u);                // detached
User m = em.merge(u);        // m is managed again
em.remove(m);                // removed</code></pre>`,
    },
    {
      title: 'persist vs merge',
      level: 'intermediate',
      summary:
        'persist makes a new object managed; merge copies a detached object’s state into a managed one.',
      simple:
        'persist adopts the child you hand over. merge photocopies your paper onto the official copy and hands you back the official one.',
      points: [
        '<code>persist(e)</code>: <code>e</code> itself becomes managed; returns <code>void</code>.',
        '<code>merge(e)</code>: returns a managed copy; <code>e</code> stays detached.',
        'Keep using the returned object after <code>merge</code>, not the original.',
        '<code>merge</code> may run a <code>SELECT</code> first to load the current row.',
        'For an already managed entity you need neither: just change it.',
      ],
      detail: `<pre><code>Order detached = dto.toEntity();
Order managed = em.merge(detached);
managed.setStatus(PAID);   // tracked
detached.setStatus(PAID);  // ignored!</code></pre>`,
    },
    {
      title: 'find vs getReference',
      level: 'intermediate',
      summary:
        'find loads the entity now; getReference returns a lazy proxy without hitting the database.',
      simple:
        'find fetches the actual book. getReference gives you a library card that points to the book, and only fetches it if you open it.',
      points: [
        '<code>find</code> returns <code>null</code> if no row exists.',
        '<code>getReference</code> throws <code>EntityNotFoundException</code> later, when first used.',
        'Perfect to set a foreign key: <code>order.setCustomer(em.getReference(Customer.class, id))</code>.',
        'Saves a pointless <code>SELECT</code> when you only need the id.',
      ],
    },
    {
      title: 'Flush',
      level: 'intermediate',
      summary: 'Sending queued changes from the context to the database, without committing.',
      simple:
        'Flush is mailing your notes to the office. Commit is the boss signing them. Until signed, they can still be thrown away (rollback).',
      points: [
        'Happens automatically before commit and (by default) before queries that need fresh data.',
        'Call <code>em.flush()</code> to see constraint errors early or before native SQL.',
        'Flushed changes are still rolled back if the transaction fails.',
        'See "Hibernate Internals → Flush Modes" for the details.',
      ],
    },
    {
      title: 'clear & detach',
      level: 'intermediate',
      summary: 'Remove one or all entities from the context so they stop being tracked.',
      simple:
        'Clearing your desk: the papers are no longer yours to edit, and the desk has room again.',
      points: [
        '<code>em.detach(e)</code> forgets one entity; <code>em.clear()</code> forgets all.',
        'Unflushed changes are lost, so <code>flush()</code> before <code>clear()</code>.',
        'Used in batch jobs to keep memory flat.',
        'After clear, lazy fields on those objects can’t load anymore.',
      ],
    },
    {
      title: 'LazyInitializationException',
      level: 'intermediate',
      summary: 'Thrown when you touch a lazy field after the persistence context is closed.',
      simple:
        'You took the library card home, but the library is closed. You can’t fetch the book anymore.',
      points: [
        'Message: "could not initialize proxy - no Session".',
        'Cause: entity is detached and the lazy data was never loaded.',
        'Fix: fetch what you need in the query (JOIN FETCH, entity graph) or return DTOs.',
        'Don’t "fix" it with EAGER or Open Session in View; that hides the real problem.',
      ],
      tip: 'Load all data a use case needs inside the transaction, then hand plain DTOs to the web layer.',
    },
    {
      title: 'Lifecycle Callbacks',
      level: 'intermediate',
      summary:
        'Methods JPA calls for you just before or after an entity is saved, loaded, updated or deleted.',
      simple:
        'Like a doorbell that rings at set moments: right before the entity goes into the database, or right after it comes out.',
      points: [
        '<code>@PrePersist</code>, <code>@PreUpdate</code>, <code>@PreRemove</code>, their <code>@Post…</code> twins, and <code>@PostLoad</code>.',
        'Put them on entity methods, or in a separate class listed in <code>@EntityListeners</code>.',
        '<code>@PreUpdate</code> runs at flush, and only if the entity really changed.',
        'Keep them small. Don’t use the EntityManager or run queries inside them.',
        'Bulk JPQL updates and deletes skip them completely.',
      ],
      detail: `<pre><code>@PrePersist
void onCreate() { createdAt = Instant.now(); }

@PreUpdate
void onUpdate() { updatedAt = Instant.now(); }</code></pre>`,
    },
  ],
};
