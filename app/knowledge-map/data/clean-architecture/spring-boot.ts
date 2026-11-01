import type { KmNode } from '../../types';

export const springBoot: KmNode = {
  title: 'With Spring Boot',
  level: 'intermediate',
  summary: 'Putting the ideas to work in a real Spring Boot app, one order use case end to end.',
  simple:
    'Spring Boot is a great set of power tools. Clean Architecture says: use them in the workshop, but don’t glue them to the furniture.',
  points: [
    'Spring stays in the outer layers: web, persistence, config.',
    'Domain and use cases are plain Java that compile without Spring.',
    'Spring’s DI wires everything together from the outside.',
  ],
  children: [
    {
      title: 'Project Layout',
      level: 'intermediate',
      summary:
        'Separate Gradle/Maven modules, or at least packages, for domain, application and adapters.',
      simple: 'Separate rooms with locked doors: the domain room has no door to Spring at all.',
      points: [
        '<code>domain</code>: entities, value objects. Zero dependencies.',
        '<code>application</code>: use cases and ports. Depends only on <code>domain</code>.',
        '<code>adapters</code>: web, persistence, messaging. Depends on Spring and <code>application</code>.',
        '<code>bootstrap</code>: the <code>@SpringBootApplication</code> class and wiring.',
      ],
    },
    {
      title: 'Plain Use Case Class',
      level: 'intermediate',
      summary: 'Write the use case as plain Java with constructor-injected ports.',
      simple:
        'The chef works the same in any kitchen. Give him the ingredients through the door and he cooks.',
      points: [
        'No <code>@Service</code> or <code>@Transactional</code> needed inside the core.',
        'Dependencies are ports (interfaces), passed in the constructor.',
        'Easy to unit test with simple fakes, no Spring context.',
        'Pragmatic teams often allow <code>@Service</code> here; decide as a team.',
      ],
      detail: `<pre><code>public class PlaceOrderService implements PlaceOrderUseCase {
    private final LoadCustomerPort customers;
    private final SaveOrderPort orders;

    public PlaceOrderService(LoadCustomerPort c, SaveOrderPort o) {
        this.customers = c;
        this.orders = o;
    }

    public OrderId place(PlaceOrderCommand cmd) {
        Customer customer = customers.load(cmd.customerId());
        Order order = Order.create(customer, cmd.items());
        return orders.save(order);
    }
}</code></pre>`,
    },
    {
      title: 'Wiring with @Bean',
      level: 'intermediate',
      summary:
        'A configuration class in the outer layer creates use cases and hands them their adapters.',
      simple: 'The wedding planner seats every guest. The guests don’t pick their own chairs.',
      points: [
        'Keeps Spring annotations out of the core module.',
        'This config class is your "Main" component from the book.',
        'Alternative: a custom <code>@UseCase</code> annotation scanned by Spring.',
      ],
      detail: `<pre><code>@Configuration
class OrderConfig {
    @Bean
    PlaceOrderUseCase placeOrder(LoadCustomerPort c, SaveOrderPort o) {
        return new PlaceOrderService(c, o);
    }
}</code></pre>`,
    },
    {
      title: 'Web Adapter',
      level: 'intermediate',
      summary:
        'A REST controller that maps HTTP to a command, calls the use case, and maps the result back.',
      simple:
        'A receptionist: takes your form, hands it to the right office, and brings back the answer in plain words.',
      points: [
        'Depends on the input port, not on the service class.',
        'Handles HTTP concerns: status codes, headers, JSON, <code>@Valid</code>.',
        'Contains no business decisions.',
      ],
      detail: `<pre><code>@RestController
class OrderController {
    private final PlaceOrderUseCase placeOrder;

    @PostMapping("/orders")
    ResponseEntity&lt;OrderResponse&gt; create(@Valid @RequestBody CreateOrderRequest req) {
        OrderId id = placeOrder.place(OrderWebMapper.toCommand(req));
        return ResponseEntity.status(201).body(new OrderResponse(id.value()));
    }
}</code></pre>`,
    },
    {
      title: 'Persistence Adapter',
      level: 'intermediate',
      summary:
        'Implements the output ports with Spring Data JPA and maps between JPA and domain objects.',
      simple:
        'A warehouse clerk: you hand him a product, he decides which shelf and box it goes in.',
      points: [
        'JPA entities (<code>@Entity</code>) live here, not in the domain.',
        'Spring Data repository is a private detail of the adapter.',
        'One adapter can implement several small ports.',
      ],
      detail: `<pre><code>@Component
class OrderPersistenceAdapter implements SaveOrderPort, LoadOrderPort {
    private final OrderJpaRepository repo;
    private final OrderJpaMapper mapper;

    public OrderId save(Order order) {
        return new OrderId(repo.save(mapper.toJpa(order)).getId());
    }
    // load(...) uses repo.findById(...) and mapper.toDomain(...)
}</code></pre>`,
    },
    {
      title: 'Transactions',
      level: 'advanced',
      summary:
        'A use case is usually one transaction; decide where to put the boundary without leaking Spring.',
      points: [
        'Simple: <code>@Transactional</code> on the use case and accept the Spring import.',
        'Purist: a decorator or AOP config in the outer layer wraps the use case.',
        'Or a <code>TransactionPort</code> implemented with <code>TransactionTemplate</code>.',
        'Never call external APIs inside a long DB transaction.',
      ],
    },
    {
      title: 'Cross-cutting Concerns',
      level: 'advanced',
      summary: 'Logging, security, metrics and caching touch every layer; keep them out of business rules where you can.',
      points: [
        'Cross-cutting means needed everywhere, not owned by one layer.',
        'Wrap use cases from outside: Spring AOP, decorators or filters in the adapter layer.',
        'Security: check "who is calling" in the web adapter; pass a plain user id inward.',
        'Business rules about permissions ("only owners can cancel") still belong in the core.',
        'A little logging inside the core is fine; just use a plain logging API like SLF4J.',
      ],
    },
    {
      title: 'Events & Messaging',
      level: 'advanced',
      summary: 'Publishing and consuming messages are just more adapters around the same core.',
      points: [
        'The core raises a domain event; an output port like <code>OrderEventsPort</code> publishes it.',
        'A Kafka or RabbitMQ adapter implements that port.',
        'A <code>@KafkaListener</code> is a driving adapter that calls an input port.',
        'Use the Transactional Outbox if DB write and publish must both succeed.',
      ],
    },
  ],
};
