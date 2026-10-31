import type { KmNode } from '../../types';

export const ioc: KmNode = {
  title: 'IoC & Dependency Injection',
  level: 'beginner',
  summary: 'Spring creates your objects and hands each one the other objects it needs.',
  simple:
    'Instead of every worker buying their own tools, a manager gives each worker the right tools on day one. You just say what you need.',
  children: [
    {
      title: 'IoC container',
      level: 'beginner',
      summary:
        'The ApplicationContext: the part of Spring that creates, wires and manages your objects.',
      simple:
        'Inversion of Control means you stop calling "new" yourself. You hand the job to Spring, like hiring a building manager instead of fixing everything yourself.',
      points: [
        'The container reads your config and annotations, then builds the objects.',
        '<code>ApplicationContext</code> is the full container. <code>BeanFactory</code> is the basic core underneath.',
        'It also handles events, config values, messages and resource loading.',
        'Your classes stay plain Java and easy to test.',
      ],
    },
    {
      title: 'Beans',
      level: 'beginner',
      summary: 'A bean is any object that Spring creates and manages for you.',
      simple:
        'Beans are the employees on the manager’s list. If an object is not on the list, Spring does not know it and cannot inject it.',
      points: [
        'Each bean has a name and a type. By default the name is the class name in camelCase.',
        'By default there is one shared instance per container (singleton).',
        'Objects you create with <code>new</code> are not beans and get no injection.',
        'Spring also creates beans for you through auto-configuration.',
      ],
    },
    {
      title: '@Component & stereotypes',
      level: 'beginner',
      summary: 'Mark a class so component scanning finds it and registers it as a bean.',
      simple: 'Like putting a name badge on a person so the manager adds them to the staff list.',
      points: [
        '<code>@Component</code>: a general bean.',
        '<code>@Service</code>: business logic. <code>@Repository</code>: data access, also translates DB errors.',
        '<code>@Controller</code> / <code>@RestController</code>: web endpoints.',
        'They work the same for DI. The name mainly tells readers (and some tools) the role.',
      ],
    },
    {
      title: '@Configuration & @Bean',
      level: 'beginner',
      summary: 'Create beans with a method, for classes you cannot annotate or that need setup.',
      simple:
        'If you cannot put a badge on someone (a library class), you fill in a form for them: a @Bean method that builds and returns the object.',
      points: [
        'Put <code>@Bean</code> methods in a <code>@Configuration</code> class.',
        'The method name becomes the bean name.',
        'Use it for third-party classes like <code>RestClient</code> or <code>Clock</code>.',
        'In a <code>@Configuration</code> class, calling another <code>@Bean</code> method returns the same singleton (via a CGLIB proxy).',
      ],
      detail: `<pre><code>@Configuration
public class AppConfig {
  @Bean
  Clock clock() {
    return Clock.systemUTC();
  }
}</code></pre>`,
    },
    {
      title: 'Constructor injection',
      level: 'beginner',
      summary: 'Get dependencies through the constructor. It is the recommended way.',
      simple:
        'A new worker gets all their tools on the first day, handed over at the door. They can never start work missing a tool.',
      points: [
        'With a single constructor, no <code>@Autowired</code> is needed.',
        'Fields can be <code>final</code>, so nothing can swap them later.',
        'Easy to test: just call <code>new OrderService(fakeRepo)</code>.',
        'Field injection (<code>@Autowired</code> on a field) hides dependencies and blocks <code>final</code>.',
        'Setter injection is fine for optional dependencies.',
      ],
      detail: `<pre><code>@Service
public class OrderService {
  private final OrderRepository repo;

  public OrderService(OrderRepository repo) {
    this.repo = repo;
  }
}</code></pre>`,
      tip: 'A constructor with 7+ parameters is a smell: the class is doing too much. Split it.',
    },
    {
      title: '@Qualifier & @Primary',
      level: 'intermediate',
      summary: 'Choose which bean to inject when several beans have the same type.',
      simple:
        'Two people can do the job. @Primary says "send Anna by default". @Qualifier says "this time, I want Ben".',
      points: [
        'Two beans of one type and no hint → <code>NoUniqueBeanDefinitionException</code> at startup.',
        '<code>@Primary</code> on one bean makes it the default.',
        '<code>@Qualifier("name")</code> at the injection point picks a specific one, and beats <code>@Primary</code>.',
        'Inject <code>List&lt;PaymentGateway&gt;</code> or <code>Map&lt;String, PaymentGateway&gt;</code> to get all of them.',
      ],
      detail: `<pre><code>public CheckoutService(@Qualifier("stripe") PaymentGateway gateway) {
  this.gateway = gateway;
}</code></pre>`,
    },
    {
      title: 'Bean scopes',
      level: 'intermediate',
      summary: 'How many instances of a bean exist and how long each one lives.',
      simple:
        'Singleton is the office printer everyone shares. Prototype is a paper cup: a new one each time you ask.',
      points: [
        '<code>singleton</code> (default): one instance per container. Must be thread-safe, so keep it stateless.',
        '<code>prototype</code>: a new instance every time it is requested. Spring does not destroy it.',
        'Web scopes: <code>request</code>, <code>session</code>, <code>application</code>, <code>websocket</code>.',
        'Injecting a prototype into a singleton gives you only ONE instance. Use <code>ObjectProvider</code> to get fresh ones.',
      ],
      tip: 'Never keep per-user data in a field of a singleton bean. Many threads share it at once.',
    },
    {
      title: 'Bean lifecycle',
      level: 'intermediate',
      summary: 'The steps a bean goes through: create, inject, init, use, destroy.',
      simple:
        'Like a new hire: sign the contract (create), get tools (inject), do onboarding (init), work, then hand back the badge when leaving (destroy).',
      points: [
        'Constructor → dependency injection → <code>*Aware</code> callbacks.',
        '<code>BeanPostProcessor</code> before-init → <code>@PostConstruct</code> → <code>afterPropertiesSet</code> → init method.',
        '<code>BeanPostProcessor</code> after-init: proxies (transactions, AOP) are created here.',
        'On shutdown: <code>@PreDestroy</code> → <code>DisposableBean.destroy</code> → destroy method.',
      ],
      detail: `<pre><code>@Component
public class PriceCache {
  @PostConstruct
  void warmUp() { /* load prices once at startup */ }

  @PreDestroy
  void flush() { /* save state before shutdown */ }
}</code></pre>`,
      children: [
        {
          title: 'BeanPostProcessor',
          level: 'advanced',
          summary: 'A hook that can change or wrap every bean right after it is created.',
          simple:
            'A quality inspector on the factory line. Every product passes by, and the inspector can add a sticker or put it in a protective box (a proxy).',
          points: [
            'This is how <code>@Transactional</code>, <code>@Async</code> and <code>@Cacheable</code> get their proxies.',
            '<code>BeanFactoryPostProcessor</code> is different: it changes bean definitions before any bean is created.',
            'Declare BeanPostProcessor <code>@Bean</code> methods as <code>static</code> so they load early.',
          ],
        },
      ],
    },
    {
      title: 'Circular dependencies',
      level: 'advanced',
      summary: 'A needs B and B needs A. Spring Boot refuses to start by default.',
      simple: 'Two people each wait for the other to go through the door first. Nobody moves.',
      points: [
        'Blocked by default since Spring Boot 2.6.',
        'With constructor injection a cycle can never be solved, so you see it early.',
        'Fix the design: move the shared logic into a third bean, or use events.',
        '<code>@Lazy</code> on one parameter works as a quick patch, not a real fix.',
      ],
    },
  ],
};
