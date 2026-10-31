import type { KmNode } from '../../types';

export const coreApis: KmNode = {
  title: 'Core APIs',
  level: 'beginner',
  summary:
    'The everyday classes you use in almost every program: strings, numbers, money, dates and Optional.',
  simple:
    'These are the kitchen basics: salt, oil, knives. You reach for them every day, so it pays to know their quirks.',
  points: [
    'Most live in <code>java.lang</code>, <code>java.math</code> and <code>java.time</code>.',
    'Several classic interview traps hide here: == on strings, Integer cache, double for money.',
  ],
  children: [
    {
      title: 'String & Immutability',
      level: 'beginner',
      summary: 'A String never changes after it is created; every "change" makes a new String.',
      simple:
        'A String is like a printed page. You cannot erase a word; you print a new page with the fix.',
      points: [
        'Methods like <code>toUpperCase()</code> or <code>replace()</code> return a new String.',
        'Immutable means safe to share between threads and safe as a map key.',
        'Handy methods: <code>isBlank()</code>, <code>strip()</code>, <code>repeat()</code>, <code>lines()</code>, <code>formatted()</code>.',
        'Text blocks (Java 15+) use <code>"""</code> for multi-line strings.',
      ],
      detail: `<pre><code>String s = "hello";
s.toUpperCase();      // result thrown away
System.out.println(s); // still "hello"
s = s.toUpperCase();  // now "HELLO"</code></pre>`,
      tip: 'Forgetting to use the return value of a String method is a very common beginner bug.',
    },
    {
      title: 'String Pool & == vs equals',
      level: 'beginner',
      summary:
        '== checks if two references point to the same object; equals checks if the text is the same.',
      simple:
        '== asks "is this the very same sheet of paper?". equals asks "do these two sheets say the same thing?".',
      points: [
        'String literals are stored once in the string pool and reused.',
        '<code>new String("hi")</code> always creates a new object outside the pool.',
        'So <code>==</code> may "work" for literals by luck and fail for other strings.',
        'Always compare text with <code>equals</code> (or <code>equalsIgnoreCase</code>).',
        'Null-safe: <code>"admin".equals(role)</code> or <code>Objects.equals(a, b)</code>.',
      ],
      detail: `<pre><code>String a = "hi";
String b = "hi";
String c = new String("hi");
a == b;       // true  (same pooled object)
a == c;       // false (different objects)
a.equals(c);  // true  (same text)</code></pre>`,
    },
    {
      title: 'StringBuilder',
      level: 'beginner',
      summary:
        'A mutable text buffer for building strings piece by piece without making lots of copies.',
      simple:
        'Instead of reprinting the page for every word, you write on a whiteboard and print once at the end.',
      points: [
        'Use it when you join strings inside a loop.',
        'Simple <code>a + b + c</code> on one line is fine; the compiler optimizes it.',
        '<code>StringBuilder</code> is not thread-safe; old <code>StringBuffer</code> is, but is rarely needed.',
        'For joining with a separator, <code>String.join</code> or <code>Collectors.joining</code> is shorter.',
      ],
      detail: `<pre><code>var sb = new StringBuilder();
for (String name : names) {
  sb.append(name).append(", ");
}
String result = sb.toString();</code></pre>`,
    },
    {
      title: 'Wrappers & Autoboxing',
      level: 'intermediate',
      summary:
        'Wrapper classes (Integer, Long...) turn primitives into objects; Java converts between them automatically.',
      simple:
        'A wrapper is a gift box around a number. Collections only accept boxes, so Java boxes and unboxes for you.',
      points: [
        'Each primitive has a wrapper: <code>int</code> → <code>Integer</code>, <code>boolean</code> → <code>Boolean</code>.',
        'Needed for collections: <code>List&lt;Integer&gt;</code>, not <code>List&lt;int&gt;</code>.',
        'Unboxing a <code>null</code> wrapper throws <code>NullPointerException</code>.',
        '<code>Integer</code> caches values -128 to 127, so <code>==</code> works there by luck and fails above.',
        'Boxing in hot loops creates garbage; prefer primitives or <code>IntStream</code>.',
      ],
      detail: `<pre><code>Integer a = 127, b = 127;
a == b;        // true  (cached)
Integer c = 128, d = 128;
c == d;        // false (different objects!)
c.equals(d);   // true

Integer n = null;
int x = n;     // NullPointerException</code></pre>`,
      tip: 'Never compare wrappers with ==. Use equals, or unbox to primitives first.',
    },
    {
      title: 'BigDecimal for Money',
      level: 'intermediate',
      summary: 'An exact decimal number type; use it for money instead of double.',
      simple:
        'double is like measuring with a slightly wobbly ruler: 0.1 + 0.2 is not quite 0.3. BigDecimal counts every cent exactly.',
      points: [
        'Create from a String: <code>new BigDecimal("0.10")</code>, not from a double.',
        'It is immutable: <code>a.add(b)</code> returns a new value.',
        'Division needs a scale and rounding mode, or it may throw on endless decimals.',
        'Compare with <code>compareTo</code>; <code>equals</code> also checks scale (2.0 ≠ 2.00).',
        'Another option: store money as <code>long</code> cents.',
      ],
      detail: `<pre><code>System.out.println(0.1 + 0.2); // 0.30000000000000004

var price = new BigDecimal("19.99");
var total = price.multiply(BigDecimal.valueOf(3))
                 .setScale(2, RoundingMode.HALF_UP); // 59.97</code></pre>`,
    },
    {
      title: 'Date-Time API',
      level: 'intermediate',
      summary:
        'The java.time package (Java 8+): clear, immutable types for dates, times, zones and durations.',
      simple:
        'Pick the right tool: a calendar date (LocalDate), a moment on the world clock (Instant), or a local time with its city (ZonedDateTime).',
      points: [
        '<code>LocalDate</code> / <code>LocalDateTime</code>: no time zone, like a birthday or a meeting on a wall calendar.',
        '<code>Instant</code>: an exact moment in UTC. Great for logs and database timestamps.',
        '<code>ZonedDateTime</code>: date-time plus a zone like <code>Europe/Paris</code>, handles daylight saving.',
        '<code>Duration</code> = time-based (hours, seconds); <code>Period</code> = date-based (days, months).',
        'All are immutable and thread-safe; avoid old <code>Date</code>, <code>Calendar</code> and <code>SimpleDateFormat</code>.',
      ],
      detail: `<pre><code>LocalDate due = LocalDate.of(2026, 12, 31).plusDays(7);
Instant now = Instant.now();
ZonedDateTime hanoi = now.atZone(ZoneId.of("Asia/Ho_Chi_Minh"));
Duration d = Duration.between(start, now);
String s = due.format(DateTimeFormatter.ISO_DATE);</code></pre>`,
      tip: 'Store Instant (UTC) and convert to a zone only when showing it to a user.',
    },
    {
      title: 'Optional Basics',
      level: 'intermediate',
      summary:
        'A box that may or may not hold a value, used as a return type instead of returning null.',
      simple:
        'Optional is a gift box that might be empty. The label on the box forces you to check before you use what is inside.',
      points: [
        'Create: <code>Optional.of(x)</code>, <code>Optional.ofNullable(x)</code>, <code>Optional.empty()</code>.',
        'Read safely: <code>orElse</code>, <code>orElseGet</code>, <code>orElseThrow</code>, <code>ifPresent</code>.',
        'Mainly for method return values, not for fields or parameters.',
        'See Functional &amp; Streams → Optional done right for patterns.',
      ],
      detail: `<pre><code>Optional&lt;User&gt; findUser(String id) { ... }

String name = findUser("42")
    .map(User::name)
    .orElse("guest");</code></pre>`,
    },
    {
      title: 'Math & Random',
      level: 'beginner',
      summary: 'Ready-made helpers for common math and for random numbers.',
      simple: 'A pocket calculator and a pair of dice that come with Java.',
      points: [
        '<code>Math.max</code>, <code>min</code>, <code>abs</code>, <code>pow</code>, <code>sqrt</code>, <code>round</code>.',
        '<code>Math.addExact</code> throws on overflow instead of silently wrapping.',
        'Random numbers: <code>ThreadLocalRandom.current().nextInt(1, 7)</code> (upper bound excluded).',
        'For passwords or tokens use <code>SecureRandom</code>.',
      ],
    },
  ],
};
