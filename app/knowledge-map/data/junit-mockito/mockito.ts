import type { KmNode } from '../../types';

export const mockitoBasics: KmNode = {
  title: 'Mockito Basics',
  level: 'beginner',
  summary: 'Create fake dependencies, tell them what to return, and check how they were called.',
  simple:
    'Testing a waiter does not need a real kitchen. Mockito gives you a pretend kitchen that serves exactly what you script, and remembers every order.',
  points: [
    'Mock the things your class depends on, never the class you test.',
    'Stub: decide what a mock returns. Verify: check it was called.',
    'Works with JUnit 5 through <code>MockitoExtension</code>.',
  ],
  children: [
    {
      title: 'Test doubles',
      level: 'beginner',
      summary: 'Dummy, stub, fake, mock and spy: different kinds of stand-ins for real objects.',
      simple:
        'Like film stand-ins: a cardboard cut-out (dummy), an actor reading one line (stub), a cheap set (fake), an actor who reports back (mock), the real actor with a hidden mic (spy).',
      points: [
        'Dummy: passed around but never used.',
        'Stub: returns canned answers.',
        'Fake: a working but simple version, like an in-memory repository.',
        'Mock: records calls so you can verify them.',
        'Spy: wraps a real object; real methods run unless you stub them.',
      ],
      tip: 'These names come from Gerard Meszaros\' book "xUnit Test Patterns". Mockito mocks can act as stubs and mocks.',
    },
    {
      title: '@Mock & @InjectMocks',
      level: 'beginner',
      summary: 'Annotations that create mocks and plug them into the class under test.',
      simple:
        '@Mock builds the pretend kitchen. @InjectMocks builds the real waiter and hands him that kitchen.',
      points: [
        'Add <code>@ExtendWith(MockitoExtension.class)</code> to the class.',
        '<code>@Mock</code> creates a mock for each field, fresh per test.',
        '<code>@InjectMocks</code> creates the real object and injects mocks by constructor, setter or field.',
        'Without the extension, call <code>MockitoAnnotations.openMocks(this)</code>.',
      ],
      detail: `<pre><code>@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
  @Mock OrderRepository repo;
  @Mock EmailClient email;
  @InjectMocks OrderService service;

  @Test
  void savesOrder() {
    service.place(new Order(1));
    verify(repo).save(any(Order.class));
  }
}</code></pre>`,
      tip: '@InjectMocks fails silently if it cannot inject. Many teams prefer new OrderService(repo, email) in @BeforeEach.',
    },
    {
      title: 'when / thenReturn',
      level: 'beginner',
      summary: 'Stubbing: tell a mock what to return when a method is called with given arguments.',
      simple: 'You hand the actor a script: "When asked for user 1, say Ann."',
      points: [
        '<code>when(repo.findById(1L)).thenReturn(Optional.of(ann))</code>.',
        '<code>thenThrow(new IOException())</code> simulates errors.',
        'Chain answers: <code>thenReturn(a, b)</code> returns a, then b.',
        'Unstubbed methods return defaults: <code>null</code>, 0, false, empty collections and Optionals.',
      ],
      detail: `<pre><code>when(rates.get("EUR")).thenReturn(1.1);

double usd = converter.toUsd(100, "EUR");

assertEquals(110.0, usd, 0.001);</code></pre>`,
    },
    {
      title: 'verify',
      level: 'beginner',
      summary: 'Checks that a mock was called, how many times and with which arguments.',
      simple:
        'After dinner you check the receipt: was the dessert ordered exactly once? Was wine never ordered?',
      points: [
        '<code>verify(email).send("ann@x.com")</code>: called once with that value.',
        '<code>times(2)</code>, <code>never()</code>, <code>atLeastOnce()</code>, <code>atMost(3)</code>.',
        '<code>verifyNoMoreInteractions(mock)</code> fails on any unverified call.',
        '<code>verifyNoInteractions(mock)</code>: the mock was never touched (replaced <code>verifyZeroInteractions</code>, removed in Mockito 4).',
        'Verify side effects (emails sent, events published). Assert return values instead of verifying queries.',
      ],
      detail: `<pre><code>service.cancel(42);

verify(repo).updateStatus(42, Status.CANCELLED);
verify(email, never()).sendInvoice(anyLong());</code></pre>`,
      tip: 'Do not verify every stubbed call. If the stub returned the data the result used, it was called.',
    },
    {
      title: 'Argument matchers',
      level: 'intermediate',
      summary:
        'Flexible argument checks like any(), eq() and argThat() for stubbing and verifying.',
      simple:
        'Instead of "only Ann gets coffee", you say "anyone gets coffee" or "anyone over 18 gets coffee".',
      points: [
        '<code>any()</code>, <code>anyString()</code>, <code>anyLong()</code>, <code>any(Order.class)</code>.',
        '<code>argThat(o -&gt; o.total() &gt; 100)</code> for custom rules.',
        'If one argument uses a matcher, all must: wrap plain values in <code>eq(…)</code>.',
        '<code>anyString()</code> and <code>any(Class)</code> do not match <code>null</code>; plain <code>any()</code> does.',
        'Mockito 5: <code>any()</code> on varargs matches one value; use <code>any(String[].class)</code> for any number.',
      ],
      detail: `<pre><code>// wrong: mixes matcher and raw value
// when(repo.find(anyLong(), "NEW"))
when(repo.find(anyLong(), eq("NEW"))).thenReturn(List.of());</code></pre>`,
      tip: 'Mixing matchers and raw values throws InvalidUseOfMatchersException. A classic beginner trap.',
    },
    {
      title: 'Spies',
      level: 'intermediate',
      summary:
        'A spy wraps a real object: real code runs, but you can stub some methods and verify calls.',
      simple:
        'The real chef cooks as usual, but wears a hidden mic, and you can tell him to skip one dish.',
      points: [
        'Create with <code>spy(realObject)</code> or <code>@Spy</code>.',
        'Stub spies with <code>doReturn(x).when(spy).method()</code>.',
        '<code>when(spy.method())</code> calls the real method while stubbing. Surprise side effects!',
        'Needing a spy often means the class does too much.',
      ],
      detail: `<pre><code>List&lt;String&gt; list = spy(new ArrayList&lt;&gt;());
doReturn(100).when(list).size();

list.add("a");             // real add
assertEquals(100, list.size());</code></pre>`,
    },
  ],
};

export const advancedMockito: KmNode = {
  title: 'Advanced Mockito',
  level: 'advanced',
  summary:
    'Capture arguments, BDD style, void methods, strictness, static/final mocking and deep stubs.',
  simple:
    'The pro toolkit: tools you will not need every day, but that save you when the simple ones are not enough.',
  points: [
    'Most real projects need captors and doThrow sooner or later.',
    'Strict stubs keep tests clean by failing on unused setup.',
    'Static mocking is powerful but often a design smell.',
  ],
  children: [
    {
      title: 'ArgumentCaptor',
      level: 'intermediate',
      summary: 'Grabs the actual argument passed to a mock so you can check its details.',
      simple:
        'A mailroom camera: it snaps a photo of each letter sent, so you can read it afterwards.',
      points: [
        'Create with <code>ArgumentCaptor.forClass(Email.class)</code> or <code>@Captor</code>.',
        'Use <code>captor.capture()</code> inside <code>verify</code>.',
        '<code>getValue()</code> returns the last value; <code>getAllValues()</code> returns all.',
        'Best for objects built inside the method under test.',
      ],
      detail: `<pre><code>@Captor ArgumentCaptor&lt;Email&gt; captor;

@Test
void sendsWelcomeEmail() {
  service.register("ann@x.com");
  verify(mailer).send(captor.capture());
  assertEquals("Welcome!", captor.getValue().subject());
}</code></pre>`,
      tip: 'Use captors in verify, not in when(). For stubbing, argThat() is clearer.',
    },
    {
      title: 'BDDMockito',
      level: 'intermediate',
      summary:
        'The same Mockito, with given/willReturn and then/should names that match Given-When-Then.',
      simple:
        'Same tool, different labels. The words now match the story: given this, when that, then this should happen.',
      points: [
        '<code>given(repo.find(1)).willReturn(ann)</code> replaces <code>when…thenReturn</code>.',
        '<code>then(mailer).should().send(any())</code> replaces <code>verify</code>.',
        '<code>willThrow(…).given(mock).voidMethod()</code> for void methods.',
        'Pure naming: pick one style per project.',
      ],
      detail: `<pre><code>// given
given(stock.available("book")).willReturn(3);
// when
boolean ok = shop.order("book", 2);
// then
assertTrue(ok);
then(stock).should().reserve("book", 2);</code></pre>`,
    },
    {
      title: 'doThrow & doAnswer',
      level: 'intermediate',
      summary: 'The do-family stubs void methods and spies, and runs custom logic for answers.',
      simple:
        'when() needs a return value to grab. For a method that returns nothing, you flip the sentence around.',
      points: [
        '<code>doThrow(new IOException()).when(mock).close()</code> for void methods.',
        '<code>doNothing()</code>, <code>doReturn()</code>, <code>doCallRealMethod()</code>.',
        '<code>doAnswer</code> / <code>thenAnswer</code> compute a result from the arguments.',
        'Answers can trigger callbacks, like calling a listener passed in.',
      ],
      detail: `<pre><code>doThrow(new IllegalStateException("down"))
    .when(mailer).send(any());

when(repo.save(any(User.class)))
    .thenAnswer(inv -&gt; inv.getArgument(0));</code></pre>`,
    },
    {
      title: 'Strict stubs',
      level: 'advanced',
      summary: 'MockitoExtension fails tests that stub calls they never use, keeping tests honest.',
      simple:
        'If you lay out ingredients you never cook with, the teacher marks it: clutter hides what the recipe really needs.',
      points: [
        'Default with <code>MockitoExtension</code>: <code>Strictness.STRICT_STUBS</code>.',
        'Unused stub → <code>UnnecessaryStubbingException</code>.',
        'Stub called with other arguments → <code>PotentialStubbingProblem</code>.',
        'Use <code>lenient().when(…)</code> for setup shared by only some tests.',
        '<code>@MockitoSettings(strictness = LENIENT)</code> relaxes a whole class. Use sparingly.',
      ],
      tip: 'Do not just add lenient everywhere. Usually the fix is to move the stub into the tests that need it.',
    },
    {
      title: 'Static, final & constructors',
      level: 'advanced',
      summary:
        'Mockito can mock final classes, static methods and new objects with the inline mock maker.',
      simple:
        'Normally you can only swap actors who agree to be swapped. The inline mock maker can even swap the ones who say no.',
      points: [
        'Mockito 5 made the inline mock maker the default; <code>mockito-inline</code> is no longer needed.',
        'Final classes and methods can be mocked like any other.',
        '<code>mockStatic(Clock.class)</code> returns a <code>MockedStatic</code>; close it after use.',
        '<code>mockConstruction</code> fakes objects created with <code>new</code>.',
        'Static mocks only work on the current thread.',
      ],
      detail: `<pre><code>try (MockedStatic&lt;UUID&gt; uuid = mockStatic(UUID.class)) {
  uuid.when(UUID::randomUUID).thenReturn(FIXED_ID);
  assertEquals(FIXED_ID, service.newOrder().id());
}</code></pre>`,
      tip: 'Needing static mocks usually means hidden dependencies. Prefer injecting a Clock or an IdGenerator.',
    },
    {
      title: 'Mockito on JDK 21+',
      level: 'advanced',
      summary: 'Newer JDKs warn when Mockito attaches its agent at runtime; load it as a -javaagent instead.',
      points: [
        'The inline mock maker needs a Java agent (a helper that can rewrite classes as they load).',
        'Mockito attaches it by itself at runtime. Since JDK 21 this prints a warning.',
        'A future JDK will block self-attaching, so mocks would stop working.',
        'Fix: pass the <code>mockito-core</code> jar as <code>-javaagent</code> in Surefire or the Gradle test task.',
        'The Mockito docs show the exact Maven and Gradle setup.',
      ],
      tip: 'Seeing "Mockito is currently self-attaching to enable the inline-mock-maker" in your build log? This is the fix.',
    },
    {
      title: 'Deep stubs',
      level: 'advanced',
      summary:
        'RETURNS_DEEP_STUBS lets chained calls return mocks automatically, but hides design issues.',
      simple:
        'Asking a friend of a friend of a friend for a favour. It works, but it shows your code knows too many people.',
      points: [
        '<code>mock(Order.class, RETURNS_DEEP_STUBS)</code>.',
        'Lets you stub <code>order.getCustomer().getAddress().getCity()</code> in one line.',
        'Breaks the Law of Demeter (only talk to your direct friends).',
        'Can fail with generics and final return types.',
      ],
      tip: 'The Mockito docs themselves warn: every time a mock returns a mock, a fairy dies.',
    },
    {
      title: 'InOrder & timeouts',
      level: 'advanced',
      summary: 'Verify the order of calls across mocks, or wait for async calls to happen.',
      simple: 'Not just "did you lock the door and turn off the lights", but "in that order".',
      points: [
        '<code>InOrder inOrder = inOrder(repo, mailer)</code>, then <code>inOrder.verify(…)</code>.',
        '<code>verify(mock, timeout(500)).send(any())</code> waits up to 500 ms.',
        'Only check order when it truly matters to behaviour.',
      ],
    },
  ],
};
