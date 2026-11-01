import type { KmNode } from '../../types';

export const internals: KmNode = {
  title: 'Internals',
  level: 'expert',
  summary:
    'How the JUnit Platform finds and runs tests, how to write extensions, and how Mockito builds mocks.',
  simple: 'Opening the hood: once you see the engine, strange error messages suddenly make sense.',
  points: [
    'The Platform separates finding tests (discovery) from running them (execution).',
    'Extensions plug into well-defined points in the test lifecycle.',
    'Mockito generates classes at runtime with ByteBuddy.',
  ],
  children: [
    {
      title: 'Launcher API',
      level: 'expert',
      summary:
        'The entry point IDEs and build tools use to discover and run tests on the Platform.',
      points: [
        'Build a <code>LauncherDiscoveryRequest</code> with selectors (package, class, method) and filters (tags).',
        '<code>LauncherFactory.create()</code> gives a <code>Launcher</code> that runs it.',
        'A <code>TestExecutionListener</code> receives events; <code>SummaryGeneratingListener</code> counts results.',
        'The <code>ConsoleLauncher</code> runs tests from the command line.',
      ],
      detail: `<pre><code>var request = LauncherDiscoveryRequestBuilder.request()
    .selectors(selectPackage("com.shop"))
    .filters(includeTags("fast"))
    .build();
var listener = new SummaryGeneratingListener();
LauncherFactory.create().execute(request, listener);
listener.getSummary().printTo(new PrintWriter(System.out));</code></pre>`,
    },
    {
      title: 'Discovery & execution',
      level: 'expert',
      summary:
        'Each TestEngine first builds a tree of tests, then the Platform asks it to run that tree.',
      points: [
        'A <code>TestEngine</code> has two jobs: <code>discover()</code> and <code>execute()</code>.',
        'Discovery builds a tree of <code>TestDescriptor</code>s, each with a unique ID.',
        "Engines are found with Java's <code>ServiceLoader</code>, so adding a jar adds an engine.",
        'Jupiter, Vintage, Cucumber and Spock are all engines on one Platform.',
        '<code>@Suite</code> (junit-platform-suite) groups tests across engines.',
      ],
      tip: 'The tree explains why an IDE can rerun one single parameterized case: it has its own unique ID.',
    },
    {
      title: 'Custom extensions',
      level: 'expert',
      summary: 'Implement extension interfaces to add your own setup, injection or reporting.',
      points: [
        'Callbacks: <code>BeforeEachCallback</code>, <code>AfterAllCallback</code> and so on.',
        '<code>ParameterResolver</code> injects objects into test method parameters.',
        '<code>ExecutionCondition</code>, <code>TestWatcher</code>, <code>InvocationInterceptor</code> for control and reporting.',
        'Keep state in <code>ExtensionContext.Store</code>, not in fields: one instance may serve many tests.',
      ],
      detail: `<pre><code>class TimingExtension implements BeforeEachCallback, AfterEachCallback {
  public void beforeEach(ExtensionContext ctx) {
    ctx.getStore(GLOBAL).put(ctx.getUniqueId(), System.nanoTime());
  }
  public void afterEach(ExtensionContext ctx) {
    long start = ctx.getStore(GLOBAL).remove(ctx.getUniqueId(), Long.class);
    System.out.printf("%s took %d ms%n", ctx.getDisplayName(),
        (System.nanoTime() - start) / 1_000_000);
  }
}</code></pre>`,
    },
    {
      title: 'How Mockito builds mocks',
      level: 'expert',
      summary:
        'Mockito uses ByteBuddy to generate or rewrite classes so every call goes to its handler.',
      points: [
        'Old subclass mock maker: generate a subclass at runtime. Cannot touch final or static.',
        'Inline mock maker (default since Mockito 5): rewrites the real class bytecode with a Java agent.',
        'Objenesis creates mock instances without calling constructors.',
        'Every call on a mock goes to a handler that records it and finds a matching stub.',
      ],
      tip: 'On JDK 21+, attaching the agent at runtime prints a warning. Add Mockito as a -javaagent in Surefire to be future-proof.',
    },
    {
      title: 'How when() works',
      level: 'expert',
      summary:
        'when(mock.foo()) works because calling foo() records the call, then when() grabs the last one.',
      points: [
        '<code>mock.foo()</code> runs first, returns a default and records the invocation.',
        'Mockito keeps this "ongoing stubbing" in a thread-local.',
        '<code>when()</code> ignores its argument value and stubs the last recorded call.',
        'Matchers like <code>any()</code> are pushed on a thread-local stack, then return <code>null</code> or 0.',
        'That is why matchers outside <code>when</code>/<code>verify</code> cause odd errors later.',
      ],
      tip: 'Understanding this explains UnfinishedStubbingException and why mixing raw values with matchers fails.',
    },
  ],
};
