import type { KmNode } from '../../types';

export const fundamentals: KmNode = {
  title: 'Fundamentals',
  level: 'beginner',
  summary:
    'What system design is, the requirements you design for, and the numbers you reason with.',
  simple:
    'Before you build a house you ask: how many people live here, what rooms do they need, and how much can it cost? System design starts with the same questions for software.',
  points: [
    'Start from requirements, not from tools.',
    'Know the core measures: latency, throughput, availability.',
    'Rough math (estimation) tells you if one server is enough or you need a hundred.',
  ],
  children: [
    {
      title: 'What is System Design?',
      level: 'beginner',
      summary:
        'Deciding how the parts of a software system fit together so it works, scales and stays up.',
      simple:
        'Coding is building one room. System design is the floor plan of the whole building: where the rooms go, how people move between them, and what happens when the lift breaks.',
      points: [
        'Parts: clients, servers, databases, caches, queues, load balancers, CDNs.',
        'Every choice is a trade-off: speed vs cost, consistency vs availability, simple vs flexible.',
        'There is rarely one right answer, only answers that fit the requirements.',
        'Asked in mid and senior interviews as an open-ended "design X" question.',
      ],
    },
    {
      title: 'Functional vs Non-functional',
      level: 'beginner',
      summary: 'Functional = what the system does; non-functional = how well it does it.',
      simple:
        'A car must drive, brake and steer (functional). How fast, how safe and how many km per litre (non-functional) decide which car you build.',
      points: [
        'Functional: "users can post a photo", "users see a feed of friends’ posts".',
        'Non-functional: latency, scale, availability, consistency, durability, security, cost.',
        'Non-functional needs drive the architecture far more than features do.',
        'Write them as numbers when you can: "p99 under 200 ms", "99.9% uptime".',
      ],
    },
    {
      title: 'Latency vs Throughput',
      level: 'beginner',
      summary:
        'Latency is how long one request takes; throughput is how many requests you handle per second.',
      simple:
        'A highway: latency is how long one car takes to drive it, throughput is how many cars pass per hour. Adding lanes raises throughput but doesn’t make any car faster.',
      points: [
        'Measure latency with percentiles: p50 (typical), p99 (the slow tail).',
        'Averages hide the slow requests your unhappy users see.',
        'Throughput is usually written as RPS/QPS (requests or queries per second).',
        'Queues and batching raise throughput but can add latency.',
      ],
      tip: 'Talk about p99, not averages. A page that calls 10 services hits some service’s p99 on most loads.',
    },
    {
      title: 'Availability & Nines',
      level: 'beginner',
      summary: 'The share of time the system works, often written as "nines" like 99.9%.',
      simple:
        'Each extra nine cuts allowed downtime by ten. Going from "a few hours a year" to "a few minutes a year" is very expensive.',
      points: [
        '99.9% ("three nines"): about 8.8 hours of downtime per year.',
        '99.99%: about 53 minutes per year. 99.999%: about 5 minutes per year.',
        'Parts in series multiply: two 99.9% services in a chain give about 99.8%.',
        'Redundant parts in parallel raise availability.',
        'SLA = promise to customers; SLO = internal target; SLI = what you measure.',
      ],
    },
    {
      title: 'Back-of-the-Envelope Math',
      level: 'intermediate',
      summary: 'Quick rough estimates of traffic, storage and bandwidth to size the system.',
      simple:
        'Like guessing how much food to buy for a party: you don’t need the exact number, just whether it’s 10 people or 1,000.',
      points: [
        'One day ≈ 86,400 s ≈ 100k seconds. 1M requests/day ≈ 12 RPS on average.',
        'Peak traffic is often 2–10× the average; design for the peak.',
        'Storage = items per day × size × retention (× replicas).',
        'Read/write ratio decides whether to optimize reads (caches, replicas) or writes.',
        'Round numbers freely; the order of magnitude is what matters.',
      ],
      detail: `<pre><code>// 10M daily users, 5 posts read each, 1 in 10 posts once a day
const readsPerSec = (10e6 * 5) / 86_400;   // ≈ 580 RPS (peak ~3k)
const writesPerDay = 10e6 / 10;            // 1M posts/day
const storagePerYear = writesPerDay * 1_000 * 365; // 1 KB each ≈ 365 GB</code></pre>`,
    },
    {
      title: 'Latency Numbers',
      level: 'intermediate',
      summary: 'Rough costs of common operations that every designer should know.',
      simple:
        'If reading from memory is walking to the fridge, reading from disk is a trip to the shop, and a request across the ocean is a flight.',
      points: [
        'Main memory read: ~100 ns.',
        'SSD random read: ~20–100 µs (about 1,000× slower than memory).',
        'Round trip inside one data center: ~0.5 ms.',
        'Round trip across continents: ~100–150 ms.',
        'Takeaway: memory beats disk, local beats network, fewer round trips win.',
      ],
    },
  ],
};

export const scaling: KmNode = {
  title: 'Scaling Basics',
  level: 'beginner',
  summary:
    'How a system grows from one server to many: more power, more machines, and spreading the load.',
  simple:
    'A busy café can buy a bigger coffee machine (scale up) or open more counters (scale out). Most big systems end up opening more counters.',
  points: [
    'Scale up first when it is cheap; scale out when you outgrow one machine or need redundancy.',
    'Stateless servers are the key to scaling out easily.',
    'Load balancers and CDNs spread traffic across many machines and places.',
  ],
  children: [
    {
      title: 'Vertical vs Horizontal',
      level: 'beginner',
      summary: 'Vertical = a bigger machine; horizontal = more machines.',
      simple: 'Vertical: one stronger horse. Horizontal: more horses pulling together.',
      points: [
        'Vertical (scale up): simple, no code changes, but has a ceiling and is one point of failure.',
        'Horizontal (scale out): almost no ceiling and survives one machine dying.',
        'Horizontal needs stateless apps and a way to split data.',
        'Databases are usually the hardest part to scale out.',
      ],
    },
    {
      title: 'Stateless Services',
      level: 'beginner',
      summary:
        'Servers that keep no user data in memory between requests, so any server can serve anyone.',
      simple:
        'Like a call center where every agent can see your ticket in the shared system. You don’t need to reach the same agent again.',
      points: [
        'Keep sessions in a shared store (Redis, database) or in a signed token.',
        'Any instance can be added, removed or restarted at any time.',
        '"Sticky sessions" (same user → same server) are a workaround, not a goal.',
        'State still exists; it just lives in databases and caches built for it.',
      ],
    },
    {
      title: 'Load Balancer',
      level: 'beginner',
      summary: 'Spreads incoming requests across several servers and skips unhealthy ones.',
      simple: 'A host at a restaurant door who sends each guest to a table with a free waiter.',
      points: [
        'L4 (transport): routes by IP and port; fast, no look at the request.',
        'L7 (application): routes by URL, headers or cookies; can do TLS and auth.',
        'Algorithms: round robin, least connections, weighted, hash by key.',
        'Health checks remove broken servers automatically.',
        'The load balancer itself must be redundant (a pair, or a managed cloud LB).',
      ],
    },
    {
      title: 'CDN',
      level: 'beginner',
      summary:
        'A network of servers around the world that keeps copies of your content close to users.',
      simple: 'Instead of everyone flying to one warehouse, you keep stock in shops in every city.',
      points: [
        'Great for images, video, JS/CSS bundles and other static files.',
        'Can also cache API responses and run small code at the edge.',
        'Cuts latency for far-away users and offloads your servers.',
        'Control freshness with cache headers and versioned file names.',
      ],
    },
    {
      title: 'Reverse Proxy & DNS',
      level: 'intermediate',
      summary:
        'DNS maps names to addresses; a reverse proxy sits in front of your servers and handles shared jobs.',
      simple:
        'DNS is the phone book. The reverse proxy is the receptionist who checks IDs and forwards calls to the right desk.',
      points: [
        'DNS can route users to the nearest region (geo DNS) or fail over between regions.',
        'DNS answers are cached for their TTL, so changes spread slowly.',
        'A reverse proxy (Nginx, Envoy) handles TLS, compression, caching and routing.',
        'An API gateway is a reverse proxy with API features (auth, rate limits).',
      ],
    },
    {
      title: 'Autoscaling',
      level: 'intermediate',
      summary: 'Adding or removing servers automatically based on load.',
      simple:
        'Like a supermarket opening more tills when the queue gets long, then closing them later.',
      points: [
        'Scale on CPU, request rate, queue length or a custom metric.',
        'New instances need time to start; keep some headroom for sudden spikes.',
        'Scale down slowly to avoid flapping (up, down, up…).',
        'Downstream parts (database, third-party APIs) must handle the extra load too.',
      ],
    },
  ],
};
