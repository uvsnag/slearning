import type { KmNode } from '../../types';

export const atomicity: KmNode = {
  title: 'Transactions, Pipelines & Scripts',
  level: 'intermediate',
  summary: 'Ways to send many commands at once and to run several steps atomically.',
  simple:
    'Pipelining is handing over a shopping list instead of asking for items one by one. Transactions and scripts make sure nobody else cuts in while your list is being handled.',
  points: [
    'Pipelining: fewer network round trips, not atomic.',
    'MULTI/EXEC: queue commands and run them together, no other client in between.',
    'Lua scripts and Functions: run logic on the server, atomically.',
  ],
  children: [
    {
      title: 'Pipelining',
      level: 'intermediate',
      summary: 'Send many commands without waiting for each reply, then read all replies at once.',
      simple: 'Instead of mailing one letter and waiting for the answer each time, you mail a whole stack and get a stack back.',
      points: [
        'Network round trip (RTT) is often the real cost, not Redis itself.',
        'Can speed up bulk work 5–10x or more.',
        'Other clients’ commands may run between yours: not atomic.',
        'Send in chunks (say 1,000 commands) to avoid huge memory buffers.',
      ],
      detail: `<pre><code>const pipe = redis.pipeline();
for (const id of ids) pipe.get(\`user:\${id}\`);
const results = await pipe.exec(); // [[err, value], ...]</code></pre>`,
    },
    {
      title: 'MULTI / EXEC',
      level: 'intermediate',
      summary: 'A transaction: queued commands run in one go with nothing else in between.',
      simple: 'Like reserving the whole kitchen: once you start cooking your order, nobody else can use the stove.',
      points: [
        'MULTI starts queuing, EXEC runs everything, DISCARD cancels.',
        'No rollback: if one command fails at runtime, the others still apply.',
        'Syntax errors while queuing abort the whole transaction.',
        'You can’t read a value and decide inside the transaction; use WATCH or Lua.',
      ],
      detail: `<pre><code>try (AbstractTransaction tx = jedis.multi()) {
    tx.decrBy("account:a", 100);
    tx.incrBy("account:b", 100);
    tx.exec(); // both run together
}</code></pre>`,
      children: [
        {
          title: 'WATCH',
          level: 'advanced',
          summary: 'Optimistic locking: EXEC fails if a watched key changed since you started.',
          simple: 'You note the price tag, and if someone changes it before you pay, the checkout refuses and you try again.',
          points: [
            'WATCH key, read it, MULTI, write, EXEC.',
            'If the key changed, EXEC returns null and nothing runs.',
            'Retry in a loop; fine for low contention, wasteful under heavy contention.',
          ],
          tip: 'Most WATCH use cases are simpler and faster as a short Lua script.',
        },
      ],
    },
    {
      title: 'Lua scripts',
      level: 'advanced',
      summary: 'Run a small Lua program inside Redis; it executes atomically with EVAL.',
      simple: 'Instead of phoning instructions step by step, you send the chef a recipe card, and the kitchen runs it in one go.',
      points: [
        'Read, decide and write in one atomic step: no race conditions.',
        'Pass key names in KEYS and other values in ARGV (needed for Cluster).',
        'EVALSHA runs a cached script by its hash to save bandwidth.',
        'The whole server waits while a script runs. Keep scripts short.',
      ],
      detail: `<pre><code>const script = \`
  local cur = tonumber(redis.call('GET', KEYS[1]) or '0')
  if cur &lt; tonumber(ARGV[1]) then
    return redis.call('INCR', KEYS[1])
  end
  return -1\`;
const n = await redis.eval(script, 1, 'seats:show-9', 100);</code></pre>`,
      tip: 'A slow script blocks everyone. After busy-reply-threshold (5 s, called lua-time-limit before 7.0), you can only SCRIPT KILL it if it hasn’t written yet.',
    },
    {
      title: 'Functions',
      level: 'expert',
      summary: 'Named Lua libraries stored in Redis itself (7.0+), called with FCALL.',
      simple: 'Scripts are notes you hand over each time; Functions are recipes pinned up in the kitchen for good.',
      points: [
        'FUNCTION LOAD registers a library; FCALL name numkeys key... arg... calls it.',
        'Stored in RDB/AOF and copied to replicas, unlike the EVAL script cache.',
        'Feels like stored procedures: logic lives with the data.',
        'Same atomic, blocking behavior as EVAL.',
      ],
    },
  ],
};
