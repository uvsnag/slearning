import type { KmNode } from '../../types';

export const configuration: KmNode = {
  title: 'Configuration',
  level: 'beginner',
  summary: 'Settings that live outside your code: files, environment variables, profiles.',
  simple:
    'Your app is a radio. Configuration is the knobs: you change the station and volume without opening the radio up.',
  children: [
    {
      title: 'application.properties / .yml',
      level: 'beginner',
      summary: 'The main settings file in src/main/resources, in properties or YAML format.',
      simple: 'It is the app’s settings page, written as plain key and value pairs.',
      points: [
        'Example keys: <code>server.port=8080</code>, <code>spring.datasource.url=...</code>.',
        'YAML is the same keys, nested by indentation. Pick one format per project.',
        'Boot documents hundreds of keys. Your IDE autocompletes them.',
        'Placeholders work: <code>app.url=http://${app.host}:8080</code>.',
      ],
    },
    {
      title: '@Value',
      level: 'beginner',
      summary: 'Inject a single config value into a field or constructor parameter.',
      simple: 'Like reading one line from the settings page.',
      points: [
        '<code>@Value("${app.timeout}")</code> reads a property.',
        'Default value after a colon: <code>${app.timeout:5s}</code>.',
        'Fine for one or two values. For a group of settings, use <code>@ConfigurationProperties</code>.',
      ],
    },
    {
      title: '@ConfigurationProperties',
      level: 'intermediate',
      summary: 'Bind a whole group of settings to a typed Java object.',
      simple:
        'Instead of reading settings one by one, you get a neat form with every field filled in and checked.',
      points: [
        'Binds all keys under a prefix, like <code>app.mail.*</code>.',
        'Records work well and keep values immutable.',
        'Relaxed binding: <code>app.mail.from-address</code>, <code>APP_MAIL_FROMADDRESS</code> both fit <code>fromAddress</code>.',
        'Add <code>@Validated</code> and constraints to fail fast on bad config.',
        'Register with <code>@ConfigurationPropertiesScan</code> or <code>@EnableConfigurationProperties</code>.',
      ],
      detail: `<pre><code>@ConfigurationProperties(prefix = "app.mail")
@Validated
public record MailProperties(
    @NotBlank String host,
    int port,
    Duration timeout) {}</code></pre>`,
      tip: 'Prefer this over many @Value fields. It is type-safe, testable and shows up in IDE autocompletion.',
    },
    {
      title: 'Profiles',
      level: 'beginner',
      summary: 'Named sets of settings and beans, like dev, test and prod.',
      simple:
        'Like outfits: the same person (your app) wears different clothes for the gym, the office and a wedding.',
      points: [
        'Activate with <code>spring.profiles.active=prod</code> or the env var <code>SPRING_PROFILES_ACTIVE</code>.',
        '<code>application-prod.properties</code> is loaded on top of <code>application.properties</code>.',
        '<code>@Profile("dev")</code> on a bean creates it only in that profile.',
        'Profile groups bundle several profiles under one name.',
      ],
      tip: 'Keep profiles few. The same artifact should run everywhere, with only config changing.',
    },
    {
      title: 'Externalized config order',
      level: 'intermediate',
      summary: 'When the same key is set in many places, Boot has a fixed order for who wins.',
      simple:
        'Like rules at home: what dad says right now (command line) beats the note on the fridge (env var), which beats the house rule book (the jar).',
      points: [
        'Highest first: command-line args → <code>SPRING_APPLICATION_JSON</code> → Java system properties → OS env vars.',
        'Then config files: profile file outside jar → file outside jar → profile file inside jar → file inside jar.',
        'Lowest: <code>@PropertySource</code> and default properties.',
        'In tests, <code>@TestPropertySource</code> and <code>@DynamicPropertySource</code> beat almost everything.',
        'Pull in extra files with <code>spring.config.import</code>.',
      ],
      tip: 'Common setup: safe defaults in the jar, real values as env vars per environment.',
    },
    {
      title: 'Secrets',
      level: 'intermediate',
      summary: 'Keep passwords and keys out of the code and the repo.',
      simple:
        'You don’t write your PIN on your bank card. You keep it somewhere separate and bring it when needed.',
      points: [
        'Pass secrets as env vars or mounted files, never commit them.',
        '<code>spring.config.import=configtree:/run/secrets/</code> reads Kubernetes or Docker secret files.',
        'For central secrets, use Vault or a cloud secret manager (see Microservices for Spring Cloud Config).',
        'Since Boot 3.0, Actuator’s <code>/env</code> endpoint hides all values by default.',
      ],
    },
  ],
};
