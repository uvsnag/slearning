import type { KmNode } from '../../types';

export const internals: KmNode = {
  title: 'Versions & Internals',
  level: 'advanced',
  summary:
    'What changed in Boot 3 and 4, how startup really works, and the classic interview questions.',
  simple:
    'Now you open the hood: which engine version you have, what happens when you turn the key, and what a mechanic would ask you.',
  children: [
    {
      title: 'Spring Boot 3.x essentials',
      level: 'intermediate',
      summary: 'Boot 3 (Nov 2022) moved to Java 17 and the Jakarta EE namespace.',
      simple:
        'A big house move: same furniture, but every box got a new address label (javax → jakarta).',
      points: [
        'Java 17 is the minimum. Built on Spring Framework 6.',
        '<code>javax.*</code> imports became <code>jakarta.*</code> (persistence, servlet, validation).',
        'Hibernate 6, Spring Security 6 (no <code>WebSecurityConfigurerAdapter</code>).',
        'Micrometer Observation and Tracing replaced Sleuth. GraalVM native support built in.',
        'Later 3.x: virtual threads, <code>RestClient</code> (3.2), Docker Compose and Testcontainers support (3.1).',
      ],
      tip: 'Upgrading from 2.x? Go to 2.7 first, fix deprecations, then 3.0. The OpenRewrite recipes do most of the import renames.',
    },
    {
      title: 'Spring Boot 4 & Framework 7',
      level: 'advanced',
      summary:
        'Boot 4.0 (Nov 2025) keeps Java 17 as minimum, moves to Jakarta EE 11 and splits Boot into smaller modules.',
      simple:
        'Same house, but the big toolbox was split into labeled drawers, and some old tools were thrown out.',
      points: [
        'Java 17 minimum still, Java 21 or 25 recommended. Jakarta EE 11 (Servlet 6.1).',
        'Auto-configuration split into many small modules, with matching new starters.',
        'Jackson 3 by default. JSpecify annotations mark what can be null.',
        'Framework 7 adds API versioning and built-in <code>@Retryable</code> / <code>@ConcurrencyLimit</code>.',
        'Removed: Undertow support and <code>@MockBean</code> (use <code>@MockitoBean</code>).',
      ],
    },
    {
      title: 'Startup sequence',
      level: 'expert',
      summary: 'What SpringApplication.run() does, step by step, before your app is ready.',
      simple:
        'Turning the key: check the fuel and settings, build the engine part by part, start it, then switch on the "ready" light.',
      points: [
        'Prepare the <code>Environment</code>: read properties, profiles, env vars.',
        'Create the <code>ApplicationContext</code> and register the main class.',
        '<code>refresh()</code>: run BeanFactoryPostProcessors, parse config classes, scan, load auto-configs.',
        'Register BeanPostProcessors, create all singletons, start the embedded server.',
        'Run <code>CommandLineRunner</code> / <code>ApplicationRunner</code>, then publish <code>ApplicationReadyEvent</code>.',
      ],
      detail: `<pre><code>@Bean
ApplicationRunner warmUp(PriceCache cache) {
  return args -&gt; cache.load();   // runs once, after the context is ready
}</code></pre>`,
    },
    {
      title: 'How auto-config is loaded',
      level: 'expert',
      summary:
        'Boot reads a list of auto-config classes from the jars, then filters them by conditions.',
      simple:
        'Every library brings a card saying "here is how to set me up". Boot collects all cards, throws away the ones that do not fit, and follows the rest.',
      points: [
        'Lists live in <code>META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports</code>.',
        '<code>spring.factories</code> for auto-config was dropped in Boot 3.0.',
        '<code>@EnableAutoConfiguration</code> imports them via a deferred import selector, so they load after your config.',
        'Order with <code>@AutoConfiguration(before = …, after = …)</code>.',
        'Class checks are pre-computed at build time, so unused auto-configs are skipped cheaply.',
      ],
    },
    {
      title: 'Writing your own starter',
      level: 'expert',
      summary: 'Package shared setup (logging, security, clients) as an auto-config for many apps.',
      simple:
        'Your company makes its own meal kit, so every team gets the same tested setup with one dependency.',
      points: [
        'Two parts: an <code>-autoconfigure</code> module with the config, and a <code>-starter</code> that pulls it in.',
        'Use <code>@AutoConfiguration</code> + conditions, and <code>@ConditionalOnMissingBean</code> so apps can override.',
        'Bind settings with <code>@ConfigurationProperties</code> under your own prefix.',
        'Test it with <code>ApplicationContextRunner</code>, no full app needed.',
      ],
    },
    {
      title: 'Spring Cloud & beyond',
      level: 'advanced',
      summary:
        'Spring Cloud adds tools for distributed systems: gateway, config server, resilience, discovery.',
      simple:
        'Boot builds one great shop. Spring Cloud helps a whole chain of shops work together.',
      points: [
        'Gateway, Config Server, OpenFeign, Resilience4j circuit breakers, service discovery.',
        'Each Spring Cloud release train supports specific Boot versions. Check the table before upgrading.',
        'Spring Modulith helps you keep one app well split into modules first.',
        'Details and patterns are in the Microservices topic.',
      ],
    },
    {
      title: 'Interview questions',
      level: 'advanced',
      summary: 'The questions about Spring Boot that come up again and again, with short answers.',
      points: [
        '<b>How does auto-configuration work?</b> Imports file + <code>@Conditional</code>, your beans win.',
        '<b>Why constructor injection?</b> Required deps, <code>final</code> fields, easy tests, cycles show early.',
        '<b>Why does @Transactional not work?</b> Self-call, private/final method, or checked exception.',
        '<b>Singleton bean thread-safe?</b> Only if stateless. Spring does not make it safe.',
        '<b>N+1?</b> Lazy loading in a loop. Fix with fetch join, entity graph or batch size.',
        '<b>@Component vs @Bean?</b> Scan your own classes vs a factory method for any class.',
      ],
      tip: 'For each answer, add one real bug you saw or fixed. That shows experience, not just theory.',
    },
  ],
};
