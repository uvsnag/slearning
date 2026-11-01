import type { KmNode } from '../../types';

export const compute: KmNode = {
  title: 'Compute: EC2 & Scaling',
  level: 'beginner',
  summary:
    'Virtual servers (EC2), how to pay for them, and how to grow and spread traffic across many of them.',
  simple:
    'EC2 is renting computers by the second. Auto Scaling hires more when the shop gets busy, and the load balancer is the host who sends each customer to a free table.',
  points: [
    'EC2 gives you full control: OS, software, network.',
    'Auto Scaling adds or removes servers based on load.',
    'Load balancers spread traffic and skip unhealthy servers.',
  ],
  children: [
    {
      title: 'EC2 Instances',
      level: 'beginner',
      summary: 'A virtual server in an AZ, started from an AMI (a ready-made disk image).',
      simple:
        'An AMI is a cake recipe; each instance is a cake baked from it. Bake as many identical cakes as you need.',
      points: [
        'Pick an AMI (Amazon Linux, Ubuntu, Windows, or your own), a type and a subnet.',
        'Disk is usually an EBS volume; it can survive the instance being stopped.',
        'Connect with SSH, or better, Session Manager (no open port 22 needed).',
        'Stopped instances cost nothing for compute, but you still pay for disks.',
        'You manage the OS: patches, updates, agents.',
      ],
      tip: 'Treat servers as cattle, not pets: build them from an AMI or script so you can replace any one at any time.',
    },
    {
      title: 'Instance Types',
      level: 'beginner',
      summary: 'The size and shape of a server: CPU, memory, network and special hardware.',
      simple:
        'Like choosing a vehicle: a scooter for errands, a van for moving, a sports car for speed. Pick the one that fits the job.',
      points: [
        'Name like <code>m7g.large</code>: family <code>m</code>, generation 7, <code>g</code> = Graviton, size large.',
        'Families: t (burstable, cheap), m (general), c (CPU-heavy), r (memory-heavy), g/p (GPU).',
        'Graviton (ARM) chips often give better price-performance than x86 for Java and Node apps.',
        't instances earn CPU credits when idle and spend them in bursts.',
      ],
    },
    {
      title: 'Pricing Options',
      level: 'intermediate',
      summary: 'Pay full price on demand, commit for discounts, or use spare capacity very cheaply.',
      simple:
        'Like hotel rooms: walk in and pay the full rate, book a year ahead for a discount, or grab a last-minute deal that may be cancelled.',
      points: [
        'On-Demand: per-second billing (Linux), no commitment, highest price.',
        'Savings Plans / Reserved Instances: commit 1 or 3 years, up to about 72% off.',
        'Spot: spare capacity, up to 90% off, but AWS can take it back with a 2-minute warning.',
        'Dedicated Hosts: a whole physical server, for licensing or compliance needs.',
      ],
      tip: 'Common mix: Savings Plans for the steady base, On-Demand for peaks, Spot for batch and stateless workers.',
    },
    {
      title: 'User Data & Instance Profile',
      level: 'intermediate',
      summary: 'A start-up script that runs on first boot, and the role that gives the instance AWS access.',
      simple:
        'User data is the note you leave for a new hire: “install these tools first”. The instance profile is the badge they get on day one.',
      points: [
        'User data runs once as root at first boot (by default).',
        'Use it to install software and start your app, or bake that into the AMI for faster boots.',
        'An instance profile wraps an IAM role so code on the instance gets temporary credentials.',
        'Instance metadata (IMDSv2) serves those credentials; require IMDSv2 to block SSRF (tricking your server into fetching internal URLs).',
      ],
    },
    {
      title: 'Auto Scaling Groups',
      level: 'intermediate',
      summary: 'A group that keeps the right number of identical instances running, replacing broken ones.',
      simple:
        'Like a restaurant manager who calls in more waiters when it gets busy and sends some home when it is quiet.',
      points: [
        'Set min, max and desired capacity, spread across several AZs.',
        'A launch template says how to build each instance (AMI, type, user data).',
        'Target tracking: “keep average CPU at 50%” is the easiest scaling policy.',
        'Health checks replace failed instances automatically (self-healing).',
        'Scheduled and predictive scaling handle known daily patterns.',
      ],
      tip: 'Keep instances stateless (sessions in Redis or DynamoDB) so scaling in never loses user data.',
    },
    {
      title: 'Elastic Load Balancing',
      level: 'intermediate',
      summary: 'A managed load balancer that spreads traffic over healthy targets in several AZs.',
      simple:
        'The host at a restaurant door: sends each guest to a free table and never to a table that is closed.',
      points: [
        'Gives one stable DNS name in front of many changing servers.',
        'Health checks stop traffic to bad targets.',
        'Can end TLS (HTTPS) using free certificates from ACM.',
        'Works with Auto Scaling: new instances join the target group automatically.',
      ],
      children: [
        {
          title: 'Application LB (ALB)',
          level: 'intermediate',
          summary: 'Layer 7 (HTTP) load balancer that routes by path, host or header.',
          simple:
            'A smart receptionist who reads the request: “/api goes to the backend team, /images to the media team.”',
          points: [
            'Routes <code>/api/*</code> and <code>/web/*</code> to different target groups.',
            'Targets: EC2, containers (ECS/EKS), IP addresses or Lambda.',
            'Supports WebSockets, HTTP/2, gRPC, sticky sessions and WAF.',
          ],
        },
        {
          title: 'Network LB (NLB)',
          level: 'advanced',
          summary: 'Layer 4 (TCP/UDP) load balancer for very high throughput and low latency.',
          points: [
            'Handles millions of requests per second with very low latency.',
            'Gives static IPs per AZ, useful when clients whitelist IPs.',
            'Passes TCP straight through; can also end TLS.',
            'Use for non-HTTP protocols, gaming, IoT or PrivateLink services.',
          ],
          tip: 'Default choice for web apps is ALB. Reach for NLB when you need static IPs, raw TCP/UDP or extreme speed.',
        },
      ],
    },
  ],
};
