import type { KmNode } from '../../types';

export const io: KmNode = {
  title: 'I/O, Files & Data',
  level: 'intermediate',
  summary:
    'Reading and writing files, talking to web APIs, turning objects into JSON and using databases.',
  simple:
    'Your program is a room. I/O is the doors and windows: files, the network and the database are how data gets in and out.',
  points: [
    'For files, start with <code>java.nio.file.Files</code>; it covers most needs in one line.',
    'Always close what you open; try-with-resources does it for you.',
    "Use JSON (Jackson) instead of Java's built-in serialization.",
    'For databases: JDBC, PreparedStatement and a connection pool.',
  ],
  children: [
    {
      title: 'Streams vs Readers/Writers',
      level: 'beginner',
      summary: 'Streams move raw bytes; Readers and Writers move text characters.',
      simple:
        'A byte stream is a pipe of raw bits, fine for images or zip files. A Reader is the same pipe with a translator that turns bytes into letters.',
      points: [
        '<code>InputStream</code> / <code>OutputStream</code>: bytes (images, binary files, sockets).',
        '<code>Reader</code> / <code>Writer</code>: characters (text).',
        '<code>InputStreamReader</code> bridges bytes to text using a charset.',
        'Always name the charset, e.g. <code>StandardCharsets.UTF_8</code> (UTF-8 is the default since Java 18).',
        'These "I/O streams" have nothing to do with the Stream API (<code>list.stream()</code>).',
      ],
    },
    {
      title: 'Files & Path (NIO.2)',
      level: 'beginner',
      summary: 'The modern, easy API for files: Path names a file, Files does the work.',
      simple:
        'Path is the address on the envelope. Files is the postman who reads, writes, copies and deletes.',
      points: [
        '<code>Path.of("data", "a.txt")</code> builds a path that works on any OS.',
        '<code>Files.readString</code> / <code>writeString</code> for small text files.',
        '<code>Files.lines</code> streams big files line by line; close it with try-with-resources.',
        'Also: <code>exists</code>, <code>createDirectories</code>, <code>copy</code>, <code>move</code>, <code>delete</code>, <code>walk</code>.',
      ],
      detail: `<pre><code>Path file = Path.of("notes.txt");
Files.writeString(file, "hello\\n");
String text = Files.readString(file);

try (Stream&lt;String&gt; lines = Files.lines(Path.of("big.log"))) {
    long errors = lines.filter(l -&gt; l.contains("ERROR")).count();
}</code></pre>`,
      tip: 'readString loads the whole file into memory. For big files, use lines or a BufferedReader.',
    },
    {
      title: 'Buffering',
      level: 'intermediate',
      summary:
        'Reading and writing in big chunks instead of one byte at a time, which is much faster.',
      simple:
        'Carrying groceries one item at a time from the car is slow. A bag (the buffer) lets you carry many at once.',
      points: [
        'Each raw read or write can be a slow call to the operating system.',
        '<code>BufferedReader</code>, <code>BufferedWriter</code>, <code>BufferedInputStream</code> add an in-memory buffer.',
        '<code>Files.newBufferedReader</code> gives you one directly.',
        'Writers buffer too: call <code>flush()</code> or close, or the last data may never be written.',
      ],
      detail: `<pre><code>try (BufferedReader in = Files.newBufferedReader(Path.of("users.csv"))) {
    String line;
    while ((line = in.readLine()) != null) {
        process(line);
    }
}</code></pre>`,
    },
    {
      title: 'Serialization',
      level: 'advanced',
      summary: "Java's built-in way to turn objects into bytes. Avoid it for new code.",
      simple:
        'It is like freeze-drying an object to ship it. The problem: when you thaw a package from a stranger, it can run code you never wanted.',
      points: [
        'Classes opt in with <code>implements Serializable</code>; <code>ObjectOutputStream</code> writes them.',
        'Deserializing untrusted bytes can run attacker code ("gadget chains"). A long list of real exploits.',
        'Also fragile: changing a class can break old data (<code>serialVersionUID</code>).',
        'Prefer JSON, Protobuf or Avro for data you store or send.',
        'If you must use it, add an <code>ObjectInputFilter</code> (Java 9+) to allow only known classes.',
      ],
      tip: 'Even its designers call Java serialization a mistake. Say that in an interview and explain the security risk.',
    },
    {
      title: 'JSON with Jackson',
      level: 'intermediate',
      summary: 'Jackson is the most used library for turning Java objects into JSON and back.',
      simple:
        'Jackson is a translator between your Java objects and the JSON text that web APIs speak.',
      points: [
        '<code>ObjectMapper</code> does the work; create it once and reuse it (it is thread-safe).',
        'Works with getters/setters, fields and records.',
        'Annotations: <code>@JsonProperty</code>, <code>@JsonIgnore</code>, <code>@JsonFormat</code>.',
        'Register <code>JavaTimeModule</code> for <code>LocalDate</code> and friends (Spring Boot does this for you).',
      ],
      detail: `<pre><code>record User(String name, int age) {}

ObjectMapper mapper = new ObjectMapper();
String json = mapper.writeValueAsString(new User("Ann", 30)); // {"name":"Ann","age":30}
User back = mapper.readValue(json, User.class);</code></pre>`,
    },
    {
      title: 'HttpClient',
      level: 'intermediate',
      summary: 'The built-in HTTP client (java.net.http, Java 11+) for calling web APIs.',
      simple:
        'It is a small browser inside your program: build a request, send it, read the response.',
      points: [
        'Supports HTTP/1.1 and HTTP/2, sync (<code>send</code>) and async (<code>sendAsync</code>).',
        'Create one client and reuse it; it keeps connections open.',
        'Always set timeouts, or a stuck server can block you forever.',
        'Check the status code yourself; 404 or 500 does not throw.',
      ],
      detail: `<pre><code>HttpClient client = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(5)).build();
HttpRequest req = HttpRequest.newBuilder(URI.create("https://api.example.com/users/1"))
        .timeout(Duration.ofSeconds(10)).GET().build();
HttpResponse&lt;String&gt; res = client.send(req, HttpResponse.BodyHandlers.ofString());
System.out.println(res.statusCode() + " " + res.body());</code></pre>`,
    },
    {
      title: 'JDBC & PreparedStatement',
      level: 'intermediate',
      summary:
        'JDBC is the standard API to run SQL; PreparedStatement runs it safely with parameters.',
      simple:
        'JDBC is the phone line to the database. PreparedStatement is a form with blanks: the database knows the blanks are data, never commands.',
      points: [
        'Flow: get a <code>Connection</code> → <code>PreparedStatement</code> → <code>ResultSet</code>.',
        'Never build SQL by gluing strings with user input; that is SQL injection.',
        'Use <code>?</code> placeholders and <code>setString</code>, <code>setLong</code>…',
        'Close everything with try-with-resources.',
        "Most apps use JDBC through JPA/Hibernate, jOOQ or Spring's JdbcTemplate.",
      ],
      detail: `<pre><code>String sql = "SELECT name FROM users WHERE email = ?";
try (Connection c = dataSource.getConnection();
     PreparedStatement ps = c.prepareStatement(sql)) {
    ps.setString(1, email); // safe, even if email is "' OR 1=1 --"
    try (ResultSet rs = ps.executeQuery()) {
        if (rs.next()) return rs.getString("name");
    }
}</code></pre>`,
    },
    {
      title: 'Connection Pools & Transactions',
      level: 'advanced',
      summary:
        'Reuse database connections with a pool, and group SQL statements so they all succeed or all fail.',
      simple:
        'Opening a DB connection is like dialing a long phone number. A pool keeps some lines open. A transaction is "all or nothing", like a bank transfer.',
      points: [
        "HikariCP is the go-to pool (Spring Boot's default). Get connections from a <code>DataSource</code>.",
        'Pool size: small is usually better, often around 10. More connections can make the DB slower.',
        'Transaction: <code>setAutoCommit(false)</code>, run statements, then <code>commit()</code> or <code>rollback()</code>.',
        'In Spring, <code>@Transactional</code> does this for you.',
        'Keep transactions short; long ones hold locks and block others.',
      ],
      detail: `<pre><code>c.setAutoCommit(false);
try {
    debit(c, from, amount);
    credit(c, to, amount);
    c.commit();
} catch (SQLException e) {
    c.rollback();
    throw e;
}</code></pre>`,
    },
  ],
};
