import type { KmNode } from '../../types';

export const interviewApproach: KmNode = {
  title: 'The Design Interview',
  level: 'intermediate',
  summary: 'A step-by-step way to tackle any "design X" question in 45 minutes.',
  simple:
    'Like cooking for guests: ask what they like, guess how many are coming, plan the menu, then cook the hard dish carefully.',
  points: [
    'Follow a structure so you don’t freeze or ramble.',
    'Talk out loud: interviewers grade your reasoning, not a perfect diagram.',
    'Always name trade-offs and what you would do next.',
  ],
  children: [
    {
      title: 'Clarify Requirements',
      level: 'intermediate',
      summary: 'Spend the first 5 minutes asking what to build and at what scale.',
      simple: 'Don’t start building a bridge before you know if it’s for people or trains.',
      points: [
        'List 3–5 core features; agree which are out of scope.',
        'Ask about users, traffic, read/write ratio, data size and latency goals.',
        'Ask about consistency needs: is a slightly stale feed OK? Is a double payment OK? (No.)',
      ],
    },
    {
      title: 'Estimate & Define the API',
      level: 'intermediate',
      summary: 'Do quick math on scale, then write the main API calls and data model.',
      simple: 'Count the guests and write the menu before you start cooking.',
      points: [
        'Estimate QPS, storage and bandwidth in round numbers.',
        'Write 3–5 endpoints, e.g. <code>POST /urls</code>, <code>GET /{code}</code>.',
        'Sketch the main tables or entities and their keys.',
      ],
    },
    {
      title: 'High-Level Design',
      level: 'intermediate',
      summary: 'Draw the main boxes and arrows that make the core features work end to end.',
      simple: 'First draw the floor plan with rooms and doors. Furniture comes later.',
      points: [
        'Client → load balancer → services → cache/database/queue.',
        'Walk through one request for each core feature.',
        'Keep it simple first; add scale only where the numbers demand it.',
      ],
    },
    {
      title: 'Deep Dive & Trade-offs',
      level: 'advanced',
      summary: 'Zoom into the hardest parts: bottlenecks, failure cases and scaling.',
      points: [
        'Pick the riskiest component (hot keys, fan-out, consistency) and go deep.',
        'For every choice, state the alternative and why you didn’t pick it.',
        'Cover failure: what happens if this server, cache or region dies?',
        'Close with monitoring, and what you would improve with more time.',
      ],
    },
    {
      title: 'Common Mistakes',
      level: 'intermediate',
      summary: 'Habits that sink otherwise good candidates.',
      simple: 'The classic traps: running before you know where you’re going.',
      points: [
        'Jumping to tools ("use Kafka!") before understanding the problem.',
        'Over-engineering a 100-user system with microservices and sharding.',
        'Ignoring the numbers, or doing math and then not using it.',
        'Silent drawing; not checking in with the interviewer.',
        'No trade-offs: every design has weaknesses, so name them.',
      ],
    },
  ],
};

export const classicProblems: KmNode = {
  title: 'Classic Problems',
  level: 'advanced',
  summary: 'Short sketches of the most common interview designs and their key ideas.',
  simple:
    'These are the "standard recipes" of system design. Learn the key trick in each, and you can mix them for new problems.',
  points: [
    'Each problem highlights one or two core ideas.',
    'Use the interview steps: requirements, estimates, API, high-level design, deep dive.',
  ],
  children: [
    {
      title: 'URL Shortener',
      level: 'intermediate',
      summary: 'Turn long URLs into short codes and redirect quickly.',
      simple: 'A coat check: you hand in a long coat and get a tiny ticket number back.',
      points: [
        'Very read-heavy: cache popular codes and redirect with 301/302.',
        'Code = base62 of a unique id (no collisions) or a short hash (check collisions).',
        '7 base62 characters give about 3.5 trillion codes.',
        'Use 302 if you need click analytics (301 is cached by browsers).',
      ],
      detail: `<pre><code>const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function toBase62(n) {
  let s = '';
  do {
    s = ALPHABET[n % 62] + s;
    n = Math.floor(n / 62);
  } while (n &gt; 0);
  return s;
}</code></pre>`,
    },
    {
      title: 'Rate Limiter',
      level: 'advanced',
      summary: 'Limit requests per user or key across many servers.',
      points: [
        'Token bucket per key, stored in Redis with atomic operations (Lua script).',
        'Run it in the API gateway or as middleware.',
        'Decide: fail open (allow) or fail closed (block) if Redis is down.',
        'Return 429 with <code>Retry-After</code>.',
      ],
    },
    {
      title: 'News Feed',
      level: 'advanced',
      summary: 'Show each user a ranked feed of posts from people they follow.',
      points: [
        'Core trick: fan-out on write for most users, on read for celebrities.',
        'Store feeds as lists of post ids in a cache; fetch post bodies separately.',
        'Media goes to object storage + CDN.',
        'Ranking can be a separate step after gathering candidates.',
      ],
    },
    {
      title: 'Chat System',
      level: 'advanced',
      summary: 'Real-time 1:1 and group messaging with delivery and read receipts.',
      points: [
        'WebSocket connections to chat servers; a registry maps user → server.',
        'Route messages between servers with pub/sub.',
        'Store messages by conversation id + time (wide-column or partitioned SQL).',
        'Offline users get push notifications and sync missed messages on reconnect.',
        'Per-conversation sequence numbers keep message order.',
      ],
    },
    {
      title: 'Notification Service',
      level: 'advanced',
      summary: 'Send emails, SMS and push notifications reliably at scale.',
      points: [
        'Producers drop requests in a queue; workers per channel send them.',
        'Respect user preferences, quiet hours and rate limits.',
        'Retry with backoff; deduplicate with an idempotency key.',
        'Track delivery status for analytics and debugging.',
      ],
    },
    {
      title: 'Typeahead Search',
      level: 'advanced',
      summary: 'Suggest search terms as the user types, in under about 100 ms.',
      points: [
        'Keep the top suggestions per prefix, built from a trie (a tree of letters) or a prefix table.',
        'Precompute the top 5–10 per prefix offline from search logs; serve from memory or cache.',
        'Debounce in the browser so you send a request only after a short typing pause.',
        'Update popularity in batches (e.g. hourly), not on every search.',
      ],
    },
    {
      title: 'Web Crawler',
      level: 'advanced',
      summary: 'Download billions of pages politely, without fetching the same page twice.',
      points: [
        'A URL frontier (queue) feeds many fetcher workers.',
        'Politeness: respect robots.txt and limit requests per site.',
        'Deduplicate URLs (Bloom filter) and page content (hash of the page).',
        'Store pages in object storage; parse links and push new URLs back to the frontier.',
      ],
    },
    {
      title: 'Video Streaming',
      level: 'expert',
      summary: 'Upload, process and stream video to millions of viewers.',
      points: [
        'Upload to object storage, then a pipeline transcodes into several resolutions.',
        'Split videos into small segments (HLS/DASH) for adaptive bitrate streaming.',
        'A CDN serves almost all the traffic; your servers mostly serve metadata.',
        'Processing is async and parallel: one job per segment and resolution.',
      ],
    },
    {
      title: 'Ride Sharing',
      level: 'expert',
      summary: 'Match riders with nearby drivers in real time.',
      points: [
        'Drivers send location every few seconds; keep it in memory (geo index), not the main DB.',
        'Find nearby drivers with geohash / H3 cells.',
        'Matching must not assign one driver to two rides: use a lock or atomic state change.',
        'Partition by city or region to scale.',
      ],
    },
    {
      title: 'Ticket Booking',
      level: 'expert',
      summary: 'Sell limited seats to a huge rush of buyers without selling a seat twice.',
      points: [
        'Hold a seat for a few minutes with a TTL reservation, then confirm on payment.',
        'Prevent double booking with a unique constraint, conditional update or lock.',
        'A virtual waiting room (queue) lets users in at a rate the system can handle.',
        'Payments use idempotency keys so a retry never charges twice.',
      ],
    },
    {
      title: 'Distributed Key-Value Store',
      level: 'expert',
      summary: 'Design something like DynamoDB or Cassandra: a huge, always-on key-value store.',
      points: [
        'Consistent hashing with virtual nodes spreads keys across servers.',
        'Each key is copied to N nodes; tunable quorums (W, R) pick speed vs consistency.',
        'Gossip finds failed nodes; hinted handoff and Merkle-tree repair fix replicas.',
        'An LSM-tree storage engine makes writes fast.',
        'Pulls together most of this map: CAP, replication, sharding, quorums.',
      ],
    },
  ],
};
