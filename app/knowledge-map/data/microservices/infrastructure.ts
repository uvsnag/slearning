import type { KmNode } from '../../types';

export const infrastructure: KmNode = {
  title: 'Gateway, Discovery & Config',
  level: 'intermediate',
  summary:
    'The plumbing every service needs: a front door, a way to find each other, and settings kept outside the code.',
  simple:
    'In a big office building you need a reception desk, a staff directory and a key cabinet. These are the same thing for services.',
  children: [
    {
      title: 'API Gateway',
      level: 'beginner',
      summary: 'A single entry point that routes outside requests to the right service.',
      simple:
        'The reception desk of a building. Visitors don’t wander the floors; they ask at reception and get sent to the right room.',
      points: [
        'Routes <code>/orders/**</code> to Order service, <code>/users/**</code> to User service.',
        'Handles shared jobs: TLS, authentication, rate limiting, CORS, request logging.',
        'Hides the inside: clients don’t need to know how many services exist.',
        'Keep business logic OUT of the gateway, or it becomes a new monolith.',
        'Examples: Spring Cloud Gateway, Kong, NGINX, Envoy, cloud API gateways.',
      ],
      detail: `<pre><code>// Spring Cloud Gateway (Java DSL)
@Bean
RouteLocator routes(RouteLocatorBuilder b) {
  return b.routes()
      .route("orders", r -&gt; r.path("/api/orders/**")
          .filters(f -&gt; f.stripPrefix(1))
          .uri("lb://order-service"))   // lb:// = use service discovery
      .build();
}</code></pre>`,
    },
    {
      title: 'Backend for Frontend',
      level: 'intermediate',
      summary: 'A separate small gateway per client type (web, mobile) shaped for its needs.',
      simple:
        'A tailor instead of one-size-fits-all clothes. The mobile app gets a lean response; the web app gets a richer one.',
      points: [
        'Each BFF combines several service calls into the one response its screen needs.',
        'Usually owned by the frontend team that uses it.',
        'Mobile gets small payloads; web can get more detail.',
        'Good place to keep session cookies and swap them for tokens (token handler pattern).',
        'Don’t let BFFs grow shared business rules. Those belong in services.',
      ],
    },
    {
      title: 'Service Discovery',
      level: 'intermediate',
      summary: 'How a service finds the current network address of another service.',
      simple:
        'A phone book that updates itself. Services come and go and change addresses, so you look them up by name, not by number.',
      points: [
        'Instances start, stop and move, so fixed IP addresses don’t work.',
        'Service registry: instances register on start and send heartbeats (e.g. Eureka, Consul).',
        'On Kubernetes, a Service gets a stable DNS name, e.g. <code>http://order-service</code>. No extra registry needed.',
        'Client-side discovery: the caller looks up and picks an instance. Server-side: a load balancer does it.',
      ],
      tip: 'On Kubernetes you usually skip Eureka entirely and use the platform’s built-in DNS.',
    },
    {
      title: 'Load Balancing',
      level: 'intermediate',
      summary: 'Spreading requests across all healthy copies of a service.',
      simple:
        'Like a supermarket opening more checkout lanes and sending each shopper to the shortest queue.',
      points: [
        'Server-side: a load balancer or Kubernetes Service sits in front of the instances.',
        'Client-side: the caller picks an instance itself (Spring Cloud LoadBalancer; Ribbon is retired).',
        'Common rules: round robin, least connections, random of two choices.',
        'Only send traffic to instances that pass their readiness check.',
        'gRPC keeps long connections open, so plain L4 balancing can pin all traffic to one pod.',
      ],
      detail: `<pre><code>@Bean
@LoadBalanced   // resolves "order-service" through discovery
RestClient.Builder restClientBuilder() {
  return RestClient.builder();
}

// later
rest.get().uri("http://order-service/orders/{id}", id).retrieve().body(OrderDto.class);</code></pre>`,
    },
    {
      title: 'External Configuration',
      level: 'intermediate',
      summary: 'Keep settings outside the build so the same image runs in dev, test and prod.',
      simple:
        'The same car, different drivers: you adjust the seat and mirrors (config) without rebuilding the car (code).',
      points: [
        'Twelve-Factor App rule: config lives in the environment, not in the code.',
        'Build the image once, inject URLs, limits and feature switches per environment.',
        'Spring: env variables, ConfigMaps, or a central Spring Cloud Config server.',
        'Spring Boot 2.4+: load remote config with <code>spring.config.import</code>.',
        'Use typed <code>@ConfigurationProperties</code> and validate them at startup.',
      ],
      detail: `<pre><code>@ConfigurationProperties(prefix = "payment")
@Validated
public record PaymentProps(@NotBlank String providerUrl, @Positive int timeoutMs) {}</code></pre>`,
    },
    {
      title: 'Secrets Management',
      level: 'intermediate',
      summary: 'Storing passwords, keys and tokens safely, outside code and plain config.',
      simple:
        'You don’t tape the house key to the front door. Secrets go in a safe, and only the right people get the combination.',
      points: [
        'Never commit secrets to Git, not even in "private" repos.',
        'Use a secret store: HashiCorp Vault, AWS Secrets Manager, Azure Key Vault.',
        'Kubernetes Secrets are only base64-encoded by default. Turn on encryption at rest and limit access.',
        'Prefer short-lived, auto-rotated credentials over long-lived passwords.',
        'Give each service only the secrets it needs (least privilege).',
      ],
      tip: 'If a secret ever lands in Git history, treat it as leaked: rotate it, don’t just delete the commit.',
    },
  ],
};
