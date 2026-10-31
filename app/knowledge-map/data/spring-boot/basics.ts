import type { KmNode } from '../../types';

export const gettingStarted: KmNode = {
  title: 'Getting started',
  level: 'beginner',
  summary: 'What Spring Boot adds on top of Spring, and how a Boot project looks and runs.',
  simple:
    'Spring is a big box of building parts. Spring Boot is the same box, but with a manual, sensible defaults and most parts already snapped together, so you can start building right away.',
  children: [
    {
      title: 'Spring vs Spring Boot',
      level: 'beginner',
      summary: 'Spring is the framework. Spring Boot is a layer that sets Spring up for you.',
      simple:
        'Spring is a kitchen full of tools. Spring Boot is the same kitchen with the oven already on, the pans in place and a default recipe on the counter.',
      points: [
        'Spring Framework gives you the core: the container, DI, MVC, transactions, data access.',
        'Spring Boot adds starters, auto-configuration, an embedded server and production tools.',
        'Old Spring apps needed lots of XML or Java config. Boot guesses good defaults for you.',
        'You can still override every default. Boot backs off when you define your own bean.',
      ],
      tip: 'Interview answer: "Boot is not a different framework. It is opinionated setup plus auto-configuration on top of Spring."',
    },
    {
      title: 'Spring Initializr',
      level: 'beginner',
      summary: 'A website (start.spring.io) that generates a ready-to-run Boot project for you.',
      simple:
        'Like ordering a meal kit: pick the dishes (dependencies), and you get a box with everything measured and ready.',
      points: [
        'Choose Maven or Gradle, Java version, Boot version and starters.',
        'Also built into IntelliJ IDEA and VS Code.',
        'You get a main class, a test, <code>application.properties</code> and the build file.',
        'The build inherits versions from the Spring Boot parent or BOM, so you rarely write version numbers.',
      ],
    },
    {
      title: 'Project structure',
      level: 'beginner',
      summary: 'Where the main class, code, config and tests live in a standard Boot project.',
      simple:
        'Like a house plan: the main class is the front door, and every room (package) must be inside the house so Spring can find it.',
      points: [
        'Put the main class in the root package, e.g. <code>com.shop</code>.',
        'Put your code in sub-packages: <code>com.shop.order</code>, <code>com.shop.user</code>.',
        'Config files go in <code>src/main/resources</code>, static web files in <code>resources/static</code>.',
        'Group by feature (order, user) rather than by layer (controllers, services) as the app grows.',
      ],
      tip: 'Classes outside the main class package are not scanned. "My bean is not found" is very often this.',
    },
    {
      title: '@SpringBootApplication',
      level: 'beginner',
      summary: 'The one annotation on your main class that turns on Boot.',
      simple:
        'It is a shortcut sticker that stands for three stickers at once: "this is config", "look for my classes here", and "set things up for me".',
      points: [
        '<code>@SpringBootConfiguration</code>: this class is a configuration class.',
        '<code>@EnableAutoConfiguration</code>: turn on auto-configuration.',
        '<code>@ComponentScan</code>: scan this package and its sub-packages for beans.',
        '<code>SpringApplication.run</code> starts the container and the embedded web server.',
      ],
      detail: `<pre><code>@SpringBootApplication
public class ShopApplication {
  public static void main(String[] args) {
    SpringApplication.run(ShopApplication.class, args);
  }
}</code></pre>`,
    },
    {
      title: 'Starters',
      level: 'beginner',
      summary:
        'Ready-made dependency bundles, like spring-boot-starter-web, that pull in everything for one job.',
      simple:
        'A starter is a pre-packed lunchbox. Ask for "web" and you get the server, JSON library and MVC, all in versions that work together.',
      points: [
        'Name pattern: <code>spring-boot-starter-*</code>, e.g. web, data-jpa, security, test.',
        'Versions are managed by Boot, so libraries do not clash.',
        'A starter brings jars. Auto-configuration then sees those jars and sets them up.',
        'Third-party starters use the pattern <code>xyz-spring-boot-starter</code>.',
      ],
    },
    {
      title: 'Auto-configuration',
      level: 'intermediate',
      summary: 'Boot creates beans for you based on what is on the classpath and in your config.',
      simple:
        'Like a smart home: it sees you plugged in a lamp (a jar) and turns it on with sensible settings, unless you already set it up yourself.',
      points: [
        'Each auto-config class is a normal <code>@Configuration</code> guarded by conditions.',
        'H2 on the classpath + no DataSource bean → Boot creates an in-memory DataSource.',
        'Your own bean wins: most auto-config beans use <code>@ConditionalOnMissingBean</code>.',
        'See what was applied: start with <code>--debug</code> to print the conditions report.',
        'Turn one off: <code>@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)</code>.',
      ],
      children: [
        {
          title: 'How @Conditional works',
          level: 'advanced',
          summary:
            'Conditions decide, at startup, whether a configuration class or bean is registered.',
          simple:
            'Each bean has a guard at the door with a checklist: "Is this library here? Is this setting on? Is there no other bean like me?" Only if all answers are yes does it go in.',
          points: [
            '<code>@ConditionalOnClass</code>: a class is on the classpath.',
            '<code>@ConditionalOnMissingBean</code>: you have not defined such a bean yourself.',
            '<code>@ConditionalOnProperty</code>: a property has a given value.',
            'Also: <code>OnWebApplication</code>, <code>OnBean</code>, <code>OnResource</code>, <code>OnExpression</code>.',
            'Under the hood, each is a <code>Condition</code> whose <code>matches()</code> returns true or false.',
          ],
          detail: `<pre><code>@AutoConfiguration
@ConditionalOnClass(ObjectMapper.class)
public class JsonAutoConfig {
  @Bean
  @ConditionalOnMissingBean
  ObjectMapper objectMapper() {
    return new ObjectMapper();
  }
}</code></pre>`,
          tip: 'Auto-configs run after your own config, so <code>@ConditionalOnMissingBean</code> can see your beans first.',
        },
      ],
    },
    {
      title: 'Embedded server',
      level: 'beginner',
      summary:
        'The web server (Tomcat by default) runs inside your app, so no separate server is needed.',
      simple:
        'Old way: you rent a restaurant (an app server) and bring your food. New way: your food truck has its own kitchen built in.',
      points: [
        'The web starter brings Tomcat. Jetty is the other option.',
        'Change the port with <code>server.port=8081</code>. Use <code>0</code> for a random port.',
        'Run with <code>java -jar app.jar</code>. The jar holds the app, libraries and server.',
        'Undertow support was removed in Spring Boot 4.0.',
      ],
    },
  ],
};
