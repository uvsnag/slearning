import type { KmNode } from '../../types';

export const networking: KmNode = {
  title: 'Networking',
  level: 'intermediate',
  summary:
    'Your private network (VPC), its firewalls, and the services that bring users in: DNS, CDN and API Gateway.',
  simple:
    'A VPC is your own fenced plot of land inside AWS. You draw streets (subnets), place gates (gateways) and guards (security groups), then put up road signs (Route 53) so people find you.',
  points: [
    'VPC: an isolated private network in one region.',
    'Subnets split it per AZ into public and private parts.',
    'Security groups and NACLs control which traffic is allowed.',
    'Route 53, CloudFront and API Gateway sit at the front door.',
  ],
  children: [
    {
      title: 'VPC',
      level: 'beginner',
      summary: 'A Virtual Private Cloud: your own isolated network with your own IP range.',
      simple:
        'Like a gated neighbourhood: you choose the address range, and nothing gets in or out unless you open a gate.',
      points: [
        'Lives in one region and spans all its AZs.',
        'You pick a CIDR block (an IP range), e.g. <code>10.0.0.0/16</code> = 65,536 addresses.',
        'Every region has a default VPC for quick tests; build your own for real apps.',
        'VPC Flow Logs record who talks to whom, useful for debugging and security.',
      ],
    },
    {
      title: 'Subnets',
      level: 'intermediate',
      summary: 'Slices of the VPC IP range, each in one AZ, made public or private by their routes.',
      simple:
        'Subnets are streets in your neighbourhood. Public streets connect to the highway; private streets only connect to other streets.',
      points: [
        'One subnet = one AZ. Make one public and one private subnet per AZ.',
        'Public subnet: route to an Internet Gateway. Put load balancers here.',
        'Private subnet: no direct internet route. Put apps and databases here.',
        'AWS reserves 5 IPs in every subnet.',
        'Route tables decide where traffic from a subnet goes.',
      ],
      tip: 'Classic 3-tier layout: ALB in public subnets, app servers in private, databases in isolated private subnets.',
    },
    {
      title: 'Internet & NAT Gateways',
      level: 'intermediate',
      summary: 'The Internet Gateway connects the VPC to the internet; NAT lets private servers call out only.',
      simple:
        'The Internet Gateway is the main gate. NAT is a one-way door: your staff can go out to shop, but strangers cannot walk in.',
      points: [
        'Internet Gateway: free, two-way, for resources with public IPs.',
        'NAT Gateway: sits in a public subnet; private servers use it to reach the internet.',
        'NAT Gateway costs per hour and per GB processed. It adds up fast.',
        'Use one NAT per AZ for high availability.',
        'Public IPv4 addresses cost money since February 2024; IPv6 avoids NAT for egress.',
      ],
    },
    {
      title: 'Security Groups vs NACLs',
      level: 'intermediate',
      summary: 'Two firewalls: security groups guard each resource, NACLs guard each subnet.',
      simple:
        'A security group is a bouncer at each apartment door. A NACL is a guard at the street entrance who checks everyone both ways.',
      points: [
        'Security group: on each network interface, allow rules only, stateful (replies allowed automatically).',
        'NACL: on the subnet, allow and deny rules, stateless (allow replies explicitly), checked in number order.',
        'Security groups can reference other groups: “allow port 5432 from the app’s SG”.',
        'Most teams rely on security groups and keep NACLs at default.',
      ],
      tip: 'Interview answer: SG = instance level, stateful, allow only. NACL = subnet level, stateless, allow and deny.',
    },
    {
      title: 'Route 53',
      level: 'intermediate',
      summary: 'AWS’s DNS service: registers domains and turns names into addresses, with health checks.',
      simple:
        'The phone book of the internet. People look up “shop.example.com” and Route 53 tells them which address to call.',
      points: [
        'Hosted zones hold your DNS records (A, AAAA, CNAME, MX…).',
        'Alias records point to AWS resources (ALB, CloudFront, S3) and work at the domain root.',
        'Health checks can remove unhealthy endpoints from answers.',
        '100% availability SLA, served from edge locations.',
      ],
      children: [
        {
          title: 'Routing Policies',
          level: 'intermediate',
          summary: 'Rules that decide which answer each user gets for the same name.',
          simple:
            'Like a call center that sends you to the nearest or least busy office, or to the backup office if the main one is closed.',
          points: [
            'Simple: one answer. Weighted: split traffic, e.g. 90/10 for a canary.',
            'Latency-based: send users to the fastest region for them.',
            'Failover: primary, plus a backup used when health checks fail.',
            'Geolocation / geoproximity: route by user location.',
          ],
        },
      ],
    },
    {
      title: 'CloudFront',
      level: 'intermediate',
      summary: 'AWS’s CDN: caches your content at edge locations close to users.',
      simple:
        'Instead of every customer driving to the factory, copies of popular products sit in local shops all over the world.',
      points: [
        'Origins can be S3, an ALB, API Gateway or any HTTP server.',
        'Cuts latency and load on your origin; serves HTTPS with free ACM certificates.',
        'Cache behaviours set TTLs per path; invalidations clear cached files.',
        'Use Origin Access Control so S3 is only readable via CloudFront.',
        'CloudFront Functions and Lambda@Edge run small code at the edge.',
      ],
      tip: 'Add a version or hash to static file names (app.3f9c.js) instead of invalidating caches on every deploy.',
    },
    {
      title: 'API Gateway',
      level: 'intermediate',
      summary: 'A managed front door for HTTP and WebSocket APIs, often in front of Lambda.',
      simple:
        'A receptionist for your API: checks badges, limits how many visitors per second, and forwards each request to the right desk.',
      points: [
        'HTTP API: cheaper and faster, enough for most Lambda backends.',
        'REST API: more features like API keys, usage plans, request validation and caching.',
        'WebSocket API: two-way real-time connections.',
        'Handles auth (IAM, Cognito, JWT, Lambda authorizers), throttling and CORS.',
        'Integration timeout is 29 seconds by default (REST APIs can ask for more since 2024); run long jobs async.',
      ],
    },
    {
      title: 'Connecting VPCs',
      level: 'advanced',
      summary: 'Peering, Transit Gateway and VPC endpoints link networks privately, without the internet.',
      points: [
        'VPC Peering: direct link between two VPCs; not transitive (A–B and B–C does not give A–C).',
        'Transit Gateway: a hub that connects many VPCs and on-premises networks.',
        'Gateway endpoints for S3 and DynamoDB: free, and skip the NAT Gateway.',
        'Interface endpoints (PrivateLink): private IPs for other AWS or partner services.',
        'Site-to-Site VPN or Direct Connect link your office or data center.',
      ],
      tip: 'Add S3 and DynamoDB gateway endpoints to every VPC. It is free and often cuts NAT costs a lot.',
    },
  ],
};
