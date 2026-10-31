import type { KmNode } from '../../types';

export const web: KmNode = {
  title: 'Web & REST APIs',
  level: 'beginner',
  summary: 'Build HTTP APIs with Spring MVC: controllers, mapping, validation and errors.',
  simple:
    'Your app becomes a shop counter. Requests come in, the right clerk (controller method) handles each one, and a reply goes back.',
  children: [
    {
      title: 'DispatcherServlet',
      level: 'intermediate',
      summary: 'The front controller that receives every request and sends it to the right method.',
      simple:
        'The receptionist at the front desk. Every visitor talks to them first, and they send each one to the right office.',
      points: [
        'Finds the handler via <code>HandlerMapping</code>, using your <code>@RequestMapping</code> rules.',
        'Turns JSON into objects and back with <code>HttpMessageConverter</code> (Jackson).',
        'Errors go to <code>HandlerExceptionResolver</code>, which is where <code>@ControllerAdvice</code> plugs in.',
        'Servlet filters run before it. Spring Security lives there.',
      ],
    },
    {
      title: '@RestController',
      level: 'beginner',
      summary:
        'A controller whose method results are written straight to the response body as JSON.',
      simple:
        'You return a Java object, Spring turns it into JSON and sends it. No HTML pages involved.',
      points: [
        '<code>@RestController</code> = <code>@Controller</code> + <code>@ResponseBody</code>.',
        'Return records or DTOs, not JPA entities, to avoid leaking fields and lazy-loading errors.',
        'Plain <code>@Controller</code> returns view names for server-side HTML (Thymeleaf).',
      ],
      detail: `<pre><code>@RestController
@RequestMapping("/api/orders")
public class OrderController {
  private final OrderService service;

  public OrderController(OrderService service) { this.service = service; }

  @GetMapping("/{id}")
  public OrderDto get(@PathVariable long id) {
    return service.find(id);
  }
}</code></pre>`,
    },
    {
      title: 'Request mapping',
      level: 'beginner',
      summary: 'Connect URLs and HTTP methods to Java methods, and read input from the request.',
      simple:
        'Like a building directory: "GET /orders/7" means floor "orders", room 7, and you are only asking to look.',
      points: [
        '<code>@GetMapping</code>, <code>@PostMapping</code>, <code>@PutMapping</code>, <code>@PatchMapping</code>, <code>@DeleteMapping</code>.',
        '<code>@PathVariable</code>: part of the path, like <code>/orders/{id}</code>.',
        '<code>@RequestParam</code>: query string, like <code>?page=2</code>.',
        '<code>@RequestBody</code>: the JSON body. <code>@RequestHeader</code>: a header.',
        'Since Boot 3.0, trailing slash matching is off: <code>/orders/</code> no longer matches <code>/orders</code>.',
      ],
    },
    {
      title: 'ResponseEntity & status',
      level: 'beginner',
      summary: 'Control the HTTP status code and headers of a response.',
      simple:
        'The status code is the stamp on the envelope: delivered, created, not found, refused.',
      points: [
        'A plain return value means <code>200 OK</code>.',
        '<code>@ResponseStatus(HttpStatus.CREATED)</code> sets a fixed status on a method.',
        '<code>ResponseEntity</code> lets you pick status, headers and body in code.',
      ],
      detail: `<pre><code>@PostMapping
public ResponseEntity&lt;OrderDto&gt; create(@Valid @RequestBody NewOrder req) {
  OrderDto saved = service.create(req);
  return ResponseEntity.created(URI.create("/api/orders/" + saved.id())).body(saved);
}</code></pre>`,
    },
    {
      title: 'Validation',
      level: 'beginner',
      summary:
        'Check incoming data with annotations like @NotBlank and @Email before your code runs.',
      simple:
        'A bouncer at the door checks every ID. Bad ones are turned away before they reach the party.',
      points: [
        'Add <code>spring-boot-starter-validation</code> (Jakarta Bean Validation, Hibernate Validator).',
        'Put constraints on the DTO, and <code>@Valid</code> on the <code>@RequestBody</code> parameter.',
        'Failure → <code>MethodArgumentNotValidException</code> → <code>400 Bad Request</code>.',
        'For path or query params, use <code>@Validated</code> on the class or rely on built-in method validation (Spring 6.1+).',
      ],
      detail: `<pre><code>public record NewOrder(
    @NotBlank String customerId,
    @NotEmpty List&lt;@Valid Item&gt; items,
    @Email String contactEmail) {}</code></pre>`,
    },
    {
      title: 'Exception handling',
      level: 'intermediate',
      summary: 'Turn exceptions into clean, consistent error responses in one place.',
      simple:
        'Instead of every clerk explaining problems in their own words, all complaints go to one help desk that answers in the same format.',
      points: [
        '<code>@RestControllerAdvice</code> + <code>@ExceptionHandler</code> handle errors for all controllers.',
        '<code>ProblemDetail</code> (Spring 6) follows RFC 9457: type, title, status, detail.',
        'Turn on built-in ProblemDetail for Spring errors: <code>spring.mvc.problemdetails.enabled=true</code>.',
        'Never send stack traces to clients. Log them on the server instead.',
      ],
      detail: `<pre><code>@RestControllerAdvice
public class ApiErrors {
  @ExceptionHandler(OrderNotFoundException.class)
  ProblemDetail notFound(OrderNotFoundException ex) {
    ProblemDetail pd = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
    pd.setDetail(ex.getMessage());
    return pd;
  }
}</code></pre>`,
    },
    {
      title: 'JSON with Jackson',
      level: 'intermediate',
      summary: 'Jackson converts between JSON and Java objects. Boot configures it for you.',
      simple: 'A translator who speaks both JSON and Java and works at the front desk.',
      points: [
        'Customize with <code>spring.jackson.*</code> keys or a customizer bean.',
        'Java time types (<code>Instant</code>, <code>LocalDate</code>) work out of the box.',
        '<code>@JsonIgnore</code>, <code>@JsonProperty</code> tweak single fields.',
        'Spring Boot 4 moves to Jackson 3 (package <code>tools.jackson</code>).',
      ],
    },
    {
      title: 'HTTP clients',
      level: 'intermediate',
      summary: 'Call other services with RestClient, declarative HTTP interfaces or WebClient.',
      simple: 'Your app is not only a shop. Sometimes it phones other shops to order things.',
      points: [
        '<code>RestClient</code> (Spring 6.1, Boot 3.2): modern, fluent, blocking. The default choice.',
        '<code>@HttpExchange</code> interfaces: write an interface, Spring implements the calls.',
        '<code>RestTemplate</code>: older, in maintenance mode.',
        '<code>WebClient</code>: reactive, non-blocking (comes with WebFlux).',
        'Always set connect and read timeouts.',
      ],
      detail: `<pre><code>RestClient client = RestClient.builder().baseUrl("https://api.stock.io").build();

Stock s = client.get()
    .uri("/stock/{sku}", sku)
    .retrieve()
    .body(Stock.class);</code></pre>`,
    },
    {
      title: 'WebFlux (reactive)',
      level: 'advanced',
      summary: 'A non-blocking web stack built on Project Reactor and Netty.',
      simple:
        'A waiter who never stands still waiting for the kitchen. They take the next order and come back when the food is ready.',
      points: [
        'Uses <code>Mono&lt;T&gt;</code> (0..1 value) and <code>Flux&lt;T&gt;</code> (0..N values).',
        'Few threads handle many connections, but nothing in the chain may block.',
        'Good for streaming and many slow connections. Harder to write, read and debug.',
        'With virtual threads (Java 21), plain MVC often scales well enough.',
      ],
      tip: 'Do not pick WebFlux "because it is faster". Pick it when you need streaming or a fully non-blocking chain.',
    },
  ],
};
