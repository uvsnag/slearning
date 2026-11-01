import type { KmNode } from '../../types';

export const cloudBasics: KmNode = {
  title: 'Cloud Basics',
  level: 'beginner',
  summary:
    'What the cloud is, who is responsible for what, and how AWS spreads its data centers around the world.',
  simple:
    'Instead of buying your own servers, you rent them from Amazon by the minute. Like using electricity from the grid instead of running your own generator.',
  points: [
    'You rent computing, storage and databases on demand and pay for what you use.',
    'AWS is split into regions, and each region into availability zones.',
    'AWS secures the cloud itself. You secure what you put in it.',
  ],
  children: [
    {
      title: 'What is the Cloud?',
      level: 'beginner',
      summary: 'Using someone else’s servers over the internet, created in minutes and paid by use.',
      simple:
        'Owning servers is like owning a car: big upfront cost, repairs, parking. The cloud is like a taxi app: you call one when needed and pay per ride.',
      points: [
        'No hardware to buy: start a server in a minute, delete it when done.',
        'Elastic: grow for a traffic spike, shrink again at night.',
        'Pay as you go: costs move from big purchases (CapEx) to monthly bills (OpEx).',
        'AWS has 200+ services, from plain servers to AI, all controlled by an API.',
      ],
      tip: 'In an interview, name the key benefits: elasticity, pay-per-use, global reach and speed of trying things.',
    },
    {
      title: 'IaaS, PaaS, SaaS',
      level: 'beginner',
      summary: 'Three levels of “how much does the cloud manage for you”.',
      simple:
        'Pizza analogy: IaaS is renting a kitchen, PaaS is ordering delivery and eating at home, SaaS is eating at the restaurant.',
      points: [
        'IaaS (infrastructure): you get raw servers and networks. Example: EC2.',
        'PaaS (platform): you bring code, AWS runs it. Examples: Elastic Beanstalk, Lambda.',
        'SaaS (software): a finished app you just use. Example: Gmail, or Amazon WorkMail.',
        'Serverless means no servers for you to manage, not no servers at all.',
      ],
    },
    {
      title: 'Shared Responsibility',
      level: 'beginner',
      summary: 'AWS secures the cloud; you secure what you build and store in the cloud.',
      simple:
        'Like renting a flat: the landlord keeps the building and locks safe, but you decide who gets your key and whether you leave the door open.',
      points: [
        'AWS: data centers, hardware, network, and the software running managed services.',
        'You: your data, IAM users and permissions, encryption choices, app code.',
        'On EC2 you also patch the operating system. On Lambda, AWS does it.',
        'The more managed the service, the less you have to secure yourself.',
      ],
      tip: 'Most cloud breaches come from the customer side: public buckets, leaked keys, too-wide permissions.',
    },
    {
      title: 'Regions',
      level: 'beginner',
      summary: 'A geographic area (like Frankfurt or Tokyo) with its own separate set of data centers.',
      simple:
        'Regions are like separate branches of a bank in different cities. Each runs on its own, so trouble in one city does not stop the others.',
      points: [
        'Codes look like <code>us-east-1</code>, <code>eu-west-1</code>, <code>ap-southeast-1</code>.',
        'Most resources live in one region. Data does not leave it unless you copy it.',
        'Pick a region close to users, allowed by law (data residency), and with the services you need.',
        'Prices differ a little between regions.',
        'A few services are global: IAM, Route 53, CloudFront.',
      ],
    },
    {
      title: 'Availability Zones',
      level: 'beginner',
      summary: 'One or more separate data centers inside a region, with their own power and network.',
      simple:
        'If a region is a city, AZs are separate buildings across town. A fire in one building does not take down the others.',
      points: [
        'Named like <code>eu-west-1a</code>, <code>eu-west-1b</code>. Most regions have three or more.',
        'AZs are kilometers apart but linked by very fast, low-latency private network.',
        'Run your app in at least two AZs so one failure does not stop you.',
        'Traffic between AZs costs a little money; traffic inside one AZ is usually free.',
      ],
      tip: 'Multi-AZ is the basic high-availability setup on AWS. Multi-region is for bigger disasters.',
    },
    {
      title: 'Edge Locations',
      level: 'beginner',
      summary: 'Hundreds of small sites near users that cache content and answer DNS fast.',
      simple:
        'Like small corner shops that stock the most popular items, so you do not have to drive to the big warehouse every time.',
      points: [
        'Used by CloudFront (CDN), Route 53 (DNS), and parts of WAF and Shield.',
        'There are far more edge locations (600+) than regions.',
        'They make far-away users feel close by serving cached copies.',
      ],
    },
    {
      title: 'Account & Root User',
      level: 'beginner',
      summary: 'An AWS account holds your resources and bill. The root user owns it with full power.',
      simple:
        'The root user is the master key to the whole building. You lock it in a safe and give staff their own limited keys.',
      points: [
        'Turn on MFA (a second login step) for the root user on day one.',
        'Never create access keys for root. Use it only for rare account tasks.',
        'Do daily work with IAM Identity Center users or IAM roles instead.',
        'Set up a billing alarm or budget right away to avoid surprise bills.',
      ],
    },
    {
      title: 'Talking to AWS',
      level: 'beginner',
      summary:
        'Everything is an API call: from the web console, the command line, an SDK in your code, or IaC tools.',
      simple:
        'The console is clicking buttons in a shop. The SDK is your app placing orders by phone. Both talk to the same shop.',
      points: [
        'Console: web UI, great for learning and looking around.',
        'CLI: commands in a terminal, good for scripts.',
        'SDKs: libraries for Java, JavaScript, Python and more, used inside your app.',
        'Infrastructure as Code (CloudFormation, CDK, Terraform): describe resources in files, repeatably.',
      ],
      detail: `<pre><code>// AWS SDK for Java v2 (artifact software.amazon.awssdk:s3)
try (S3Client s3 = S3Client.builder().region(Region.EU_WEST_1).build()) {
  s3.listBuckets().buckets()
    .forEach(b -&gt; System.out.println(b.name()));
}</code></pre>`,
      tip: 'Click around in the console to learn, but build real environments with code so they can be repeated.',
    },
    {
      title: 'AWS SDK Essentials',
      level: 'intermediate',
      summary: 'A few habits that make your code talk to AWS fast, cheaply and without surprise errors.',
      simple:
        'Like a good phone habit: keep one line open instead of redialing, and when the other side says "busy", wait a bit before calling again.',
      points: [
        'Create each client once and reuse it. Clients are thread-safe and keep a pool of connections.',
        'Big lists come back in pages. Use the SDK paginators instead of one call.',
        'The SDK retries throttling and network errors with backoff (growing waits) for you.',
        'Every account has quotas (limits) per service. Service Quotas shows them and lets you ask for more.',
        'For tests, use mocks (<code>aws-sdk-client-mock</code> in JS) or LocalStack, a fake AWS on your laptop.',
      ],
      detail: `<pre><code>import { S3Client, paginateListObjectsV2 } from '@aws-sdk/client-s3';

const s3 = new S3Client({}); // create once, reuse everywhere
const pages = paginateListObjectsV2({ client: s3 }, { Bucket: 'my-app-files' });
for await (const page of pages) {
  for (const obj of page.Contents ?? []) console.log(obj.Key);
}</code></pre>`,
      tip: 'A ThrottlingException means "slow down", not a bug. Back off, batch calls, or ask for a higher quota.',
    },
  ],
};
