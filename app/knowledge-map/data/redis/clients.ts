import type { KmNode } from '../../types';

export const clients: KmNode = {
  title: 'Clients (Java & JS)',
  level: 'beginner',
  summary: 'The libraries your Java or Node.js app uses to talk to Redis, and how to use them well.',
  simple:
    'A client library is the phone your app uses to call Redis. Pick a good phone, keep the line open, and don’t dial a new number for every sentence.',
  points: [
    'Clients speak RESP, Redis’s simple text-based protocol, over TCP (port 6379).',
    'Java: Lettuce, Jedis, Redisson, Spring Data Redis on top.',
    'Node.js: node-redis (official) and ioredis.',
    'Reuse connections. Opening one per request is a classic performance bug.',
  ],
  children: [
    {
      title: 'Jedis',
      level: 'beginner',
      summary: 'A small, simple, synchronous Java client where commands map almost 1:1 to methods.',
      simple: 'Jedis is a basic flip phone: easy to use, does one call at a time.',
      points: [
        'A plain <code>Jedis</code> object is not thread-safe; use a pool.',
        'Jedis 5+: <code>JedisPooled</code> handles the pool for you.',
        '<code>JedisCluster</code> talks to Redis Cluster.',
        'Good for simple, blocking code and scripts.',
      ],
      detail: `<pre><code>JedisPooled jedis = new JedisPooled("localhost", 6379);
jedis.set("greeting", "hello");
String v = jedis.get("greeting");
jedis.hset("user:42", Map.of("name", "Ana", "plan", "pro"));</code></pre>`,
    },
    {
      title: 'Lettuce',
      level: 'intermediate',
      summary: 'A Netty-based Java client with sync, async and reactive APIs; the Spring Boot default.',
      simple: 'Lettuce is a smartphone: one connection can handle many conversations at once.',
      points: [
        'One connection is thread-safe and shared by many threads (multiplexing).',
        'Async API returns <code>RedisFuture</code>; reactive API returns Reactor types.',
        'Built-in support for Cluster, Sentinel and auto-reconnect.',
        'Blocking commands (BLPOP) or MULTI need a dedicated connection.',
      ],
      detail: `<pre><code>RedisClient client = RedisClient.create("redis://localhost:6379");
StatefulRedisConnection&lt;String, String&gt; conn = client.connect();
RedisCommands&lt;String, String&gt; sync = conn.sync();
sync.set("k", "v");
conn.async().get("k").thenAccept(System.out::println);</code></pre>`,
    },
    {
      title: 'Spring Data Redis',
      level: 'intermediate',
      summary: 'Spring’s layer over Lettuce or Jedis: RedisTemplate, repositories and the cache abstraction.',
      simple: 'Spring Data Redis is a personal assistant who makes the calls for you in a standard way.',
      points: [
        '<code>StringRedisTemplate</code> for strings; <code>RedisTemplate</code> with serializers for objects.',
        '<code>@Cacheable</code> + <code>RedisCacheManager</code> turns Redis into a method cache.',
        'Default JDK serialization is unreadable and fragile; prefer JSON serializers.',
        'Config via <code>spring.data.redis.host</code>, <code>port</code>, <code>password</code>.',
      ],
      detail: `<pre><code>@Cacheable(value = "products", key = "#id")
public Product findProduct(long id) {
    return repo.findById(id).orElseThrow(); // runs only on cache miss
}

redisTemplate.opsForValue().set("visits", "1", Duration.ofMinutes(5));</code></pre>`,
      tip: 'Set a TTL on RedisCacheManager (entryTtl). Without it, cached entries never expire.',
    },
    {
      title: 'Redisson',
      level: 'advanced',
      summary: 'A Java client with ready-made distributed objects: locks, maps, queues, rate limiters.',
      simple: 'Redisson is a toolbox of finished parts, so you don’t build a lock or a queue from raw commands.',
      points: [
        '<code>RLock</code> is a reentrant lock with a watchdog that extends the lease.',
        'Also <code>RMap</code>, <code>RRateLimiter</code>, <code>RSemaphore</code>, delayed queues.',
        'Implements JCache and Spring Cache with local near-cache options.',
        'Hides the details; know what commands it sends before trusting it in production.',
      ],
    },
    {
      title: 'node-redis',
      level: 'beginner',
      summary: 'The official Node.js client: promise-based with camelCase methods since v4.',
      simple: 'node-redis is the official phone for JavaScript apps: plug it in, then talk with await.',
      points: [
        'Call <code>await client.connect()</code> before any command.',
        'Methods mirror commands: <code>set</code>, <code>hSet</code>, <code>zAdd</code>.',
        'Options as objects: <code>{ EX: 60 }</code> instead of extra string arguments.',
        'Supports RESP3, Cluster, JSON and search commands.',
      ],
      detail: `<pre><code>import { createClient } from 'redis';

const client = createClient({ url: 'redis://localhost:6379' });
client.on('error', (err) =&gt; console.error('Redis error', err));
await client.connect();
await client.set('greeting', 'hello', { EX: 60 });
console.log(await client.get('greeting'));</code></pre>`,
    },
    {
      title: 'ioredis',
      level: 'intermediate',
      summary: 'A popular Node.js client with strong Cluster, Sentinel and pipelining support.',
      simple: 'ioredis is a well-loved third-party phone with extra buttons for cluster and failover setups.',
      points: [
        'Connects automatically on creation; commands return promises.',
        'Arguments look like raw commands: <code>redis.set(\'k\', \'v\', \'EX\', 60)</code>.',
        '<code>new Redis.Cluster([...])</code> handles slot routing for you.',
        'Commands sent while disconnected are queued and replayed after reconnect.',
      ],
      detail: `<pre><code>import Redis from 'ioredis';

const redis = new Redis({ host: 'localhost', port: 6379 });
await redis.set('greeting', 'hello', 'EX', 60);
const v = await redis.get('greeting');</code></pre>`,
      tip: 'The queued-while-offline behavior can hide outages. Set maxRetriesPerRequest so requests fail fast.',
    },
    {
      title: 'Connections & serialization',
      level: 'intermediate',
      summary: 'Pool or share connections, set timeouts, and choose how objects become bytes.',
      simple: 'Keep a few phone lines open and agree on a language both sides understand.',
      points: [
        'Create one client at startup and share it; never one per request.',
        'Always set connect and command timeouts so a slow Redis can’t freeze your app.',
        'Serialize as JSON (readable) or MessagePack/Protobuf (smaller).',
        'Add a version to cached formats so a deploy doesn’t read old shapes wrongly.',
      ],
    },
    {
      title: 'Testing with Redis',
      level: 'intermediate',
      summary: 'Run a real, throwaway Redis in a container for tests instead of mocking every call.',
      simple:
        'Instead of practising on a cardboard steering wheel, you get a real car on a closed track that is towed away after.',
      points: [
        'Testcontainers starts a Redis (or Valkey) container per test run and removes it after.',
        'Tests catch real behavior: TTLs, Lua scripts, WRONGTYPE errors.',
        'Use FLUSHDB between tests, or unique key prefixes, so tests don’t leak into each other.',
        'Mock the client only for pure unit tests of your own logic.',
      ],
      detail: `<pre><code>@Container
static GenericContainer&lt;?&gt; redis =
    new GenericContainer&lt;&gt;("redis:8").withExposedPorts(6379);

@Test
void cachesValue() {
    var jedis = new JedisPooled(redis.getHost(), redis.getMappedPort(6379));
    jedis.set("k", "v");
    assertEquals("v", jedis.get("k"));
}</code></pre>`,
    },
  ],
};
