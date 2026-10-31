import type { KmNode } from '../../types';

export const aop: KmNode = {
  title: 'AOP & Proxies',
  level: 'intermediate',
  summary:
    'Add shared behavior (logging, transactions, security) around methods without touching them.',
  simple:
    'Instead of every employee signing in and out by hand, you put a turnstile at the door that does it for everyone.',
  children: [
    {
      title: 'AOP concepts',
      level: 'intermediate',
      summary: 'Aspect, advice, pointcut and join point: the words AOP uses.',
      simple:
        'The aspect is the turnstile. The advice is what it does (log the time). The pointcut is which doors get one.',
      points: [
        '<b>Aspect</b>: a class holding a cross-cutting concern, like timing or auditing.',
        '<b>Advice</b>: the code that runs: <code>@Before</code>, <code>@After</code>, <code>@AfterReturning</code>, <code>@AfterThrowing</code>, <code>@Around</code>.',
        '<b>Pointcut</b>: an expression that picks which methods are affected.',
        '<b>Join point</b>: one method call where advice can run. Spring AOP only supports method calls.',
      ],
    },
    {
      title: 'Writing an aspect',
      level: 'intermediate',
      summary: 'A @Aspect bean with an @Around advice that times annotated methods.',
      simple: 'You write the turnstile once and tell Spring which doors to put it on.',
      points: [
        'Add <code>spring-boot-starter-aop</code> (AspectJ annotations, Spring AOP runtime).',
        'Matching your own annotation is clearer than matching method names.',
        '<code>@Around</code> must call <code>proceed()</code>, or the real method never runs.',
      ],
      detail: `<pre><code>@Aspect
@Component
public class TimingAspect {
  @Around("@annotation(com.shop.Timed)")
  public Object time(ProceedingJoinPoint pjp) throws Throwable {
    long start = System.nanoTime();
    try {
      return pjp.proceed();
    } finally {
      log.info("{} took {} µs", pjp.getSignature(), (System.nanoTime() - start) / 1000);
    }
  }
}</code></pre>`,
    },
    {
      title: 'JDK vs CGLIB proxies',
      level: 'advanced',
      summary: 'Spring wraps beans in proxies, either via interfaces (JDK) or subclasses (CGLIB).',
      simple:
        'A proxy is a stand-in actor. The audience talks to the stand-in, who does some extra stuff and then passes the line to the real actor.',
      points: [
        'JDK dynamic proxy: implements the bean’s interfaces. Only interface methods are covered.',
        'CGLIB: generates a subclass at runtime. Spring Boot uses it by default.',
        'CGLIB cannot override <code>final</code> classes or methods, so advice is skipped there.',
        'Proxies are created by a <code>BeanPostProcessor</code> after the bean is initialized.',
      ],
    },
    {
      title: 'Proxy limitations',
      level: 'advanced',
      summary: 'When proxy-based features silently do nothing.',
      simple: 'The stand-in only helps when someone talks to them. Talking to yourself skips them.',
      points: [
        'Self-invocation (<code>this.method()</code>) bypasses the proxy.',
        '<code>private</code> and <code>final</code> methods are not advised.',
        'Objects made with <code>new</code> are not beans, so they are never proxied.',
        'Need more (fields, constructors, self-calls)? Full AspectJ weaving, which is rarely worth it.',
      ],
      tip: 'If @Transactional, @Async or @Cacheable "does not work", check these four rules first.',
    },
  ],
};
