import type { KmNode } from '../../types';

export const fundamentals: KmNode = {
  title: 'ORM Fundamentals',
  level: 'beginner',
  summary: 'What ORM is, how JPA and Hibernate relate, and how to get a project running.',
  simple:
    'Your Java code thinks in objects, your database thinks in tables. An ORM is the translator sitting between them, so you rarely write SQL by hand.',
  points: [
    'ORM = Object-Relational Mapping: Java classes ↔ database tables.',
    'JPA is the standard (a set of interfaces and rules). Hibernate is the most used implementation.',
    'Since JPA 3.0 the package is <code>jakarta.persistence</code>, not <code>javax.persistence</code>.',
    'You still need to understand SQL. The ORM writes it, but you pay for bad queries.',
  ],
  children: [
    {
      title: 'What is ORM?',
      level: 'beginner',
      summary: 'A tool that saves and loads Java objects to and from database tables for you.',
      simple:
        'It is like a librarian who knows exactly which shelf each book goes on. You hand over a book (an object), and it files it in the right table and columns.',
      points: [
        'A class maps to a table, a field maps to a column, an object maps to a row.',
        'You call <code>persist(order)</code> and the ORM writes the <code>INSERT</code>.',
        'It also tracks changes and writes <code>UPDATE</code>s for you.',
        'The gap between objects and tables is called the "object-relational impedance mismatch".',
        'Without an ORM you would use plain JDBC and map every row by hand.',
      ],
      tip: 'An ORM saves time on CRUD, but for heavy reports a plain SQL query is often simpler and faster.',
    },
    {
      title: 'JPA vs Hibernate',
      level: 'beginner',
      summary: 'JPA is the specification; Hibernate is a library that implements it (plus extras).',
      simple:
        'JPA is the wall socket standard. Hibernate is one brand of plug that fits it. EclipseLink is another brand that fits the same socket.',
      points: [
        'JPA (now Jakarta Persistence) defines annotations like <code>@Entity</code> and the <code>EntityManager</code> API.',
        'Hibernate ORM implements JPA and adds features: <code>Session</code>, HQL extras, <code>@NaturalId</code>, filters.',
        'Other implementations: EclipseLink (the reference one), OpenJPA (mostly inactive).',
        'Spring Boot uses Hibernate by default when you add <code>spring-boot-starter-data-jpa</code>.',
        'Code against JPA APIs first; reach for Hibernate APIs only when you need an extra.',
      ],
      tip: 'Interview line: "JPA is the spec, Hibernate is the provider, Spring Data JPA is a layer on top that writes repositories for you."',
    },
    {
      title: 'javax → jakarta',
      level: 'beginner',
      summary:
        'JPA moved to the Eclipse Foundation and was renamed Jakarta Persistence, with new package names.',
      simple:
        'Same house, new street name. The rooms (APIs) are the same, but every address in your imports must change.',
      points: [
        'JPA 2.2 and older: <code>javax.persistence.*</code>.',
        'Jakarta Persistence 3.0+ : <code>jakarta.persistence.*</code>.',
        'Hibernate 6 and Spring Boot 3 only support <code>jakarta</code>.',
        'Mixing both packages in one app does not work: annotations get silently ignored.',
        'Tools like OpenRewrite can rename the imports for you.',
      ],
    },
    {
      title: 'Persistence Unit & Setup',
      level: 'beginner',
      summary: 'A named group of entity classes plus database settings that JPA boots from.',
      simple:
        'It is the settings card you give the ORM: which database, which login, and which classes it should manage.',
      points: [
        'Plain JPA: defined in <code>META-INF/persistence.xml</code>.',
        'Spring Boot: no XML; it reads <code>spring.datasource.*</code> and <code>spring.jpa.*</code> properties.',
        'From it you build an <code>EntityManagerFactory</code> (one per app, heavy, thread-safe).',
        'From the factory you open <code>EntityManager</code>s (light, one per unit of work, not thread-safe).',
      ],
      detail: `<pre><code>EntityManagerFactory emf = Persistence.createEntityManagerFactory("shop");
EntityManager em = emf.createEntityManager();
em.getTransaction().begin();
em.persist(new Product("Coffee", 4.5));
em.getTransaction().commit();
em.close();</code></pre>`,
    },
    {
      title: 'Schema Generation',
      level: 'beginner',
      summary:
        'Hibernate can create or update tables from your entities, but that is for dev and tests only.',
      simple:
        'It is like letting a robot rearrange your kitchen to match a drawing. Handy in a toy kitchen, scary in a real restaurant.',
      points: [
        'Hibernate setting <code>hibernate.hbm2ddl.auto</code>; in Spring Boot <code>spring.jpa.hibernate.ddl-auto</code>.',
        'Values: <code>none</code>, <code>validate</code>, <code>update</code>, <code>create</code>, <code>create-drop</code>.',
        'Spring Boot uses <code>create-drop</code> for embedded DBs (H2) and <code>none</code> otherwise.',
        'In production use Flyway or Liquibase, and maybe <code>validate</code> as a safety check.',
      ],
      tip: 'ddl-auto=update never drops or renames columns and can leave a messy schema. Don’t use it in production.',
    },
    {
      title: 'Seeing the SQL',
      level: 'beginner',
      summary: 'Turn on SQL logging so you always know what queries Hibernate really runs.',
      simple:
        'An ORM without SQL logs is like driving with your eyes closed. Turn the lights on early.',
      points: [
        'Log category <code>org.hibernate.SQL</code> at DEBUG prints every statement.',
        'Bind values: <code>org.hibernate.orm.jdbc.bind</code> at TRACE (Hibernate 6).',
        '<code>hibernate.format_sql=true</code> makes the output readable.',
        'Prefer logging over <code>show_sql</code>, which writes straight to stdout.',
        'Count queries in tests to catch N+1 problems early.',
      ],
      tip: 'If one page load prints 50 SELECTs, you have found your performance bug.',
    },
  ],
};
