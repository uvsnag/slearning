import type { KmNode } from '../../types';

export const serverless: KmNode = {
  title: 'Serverless & Containers',
  level: 'intermediate',
  summary:
    'Run code without managing servers (Lambda), or run containers on ECS, Fargate or Kubernetes (EKS).',
  simple:
    'Lambda is a food truck that appears only when customers show up. Containers are standard shipping boxes: pack your app once and any ship (ECS, EKS) can carry it.',
  points: [
    'Lambda: upload a function, pay per call and per millisecond.',
    'ECS and EKS run Docker containers; Fargate removes the servers underneath.',
    'Pick based on run time, traffic shape and how much control you need.',
  ],
  children: [
    {
      title: 'Lambda Basics',
      level: 'beginner',
      summary: 'Upload a function; AWS runs it when an event arrives and scales it automatically.',
      simple:
        'Like a motion-sensor light: it switches on only when someone walks by, and you pay only for the seconds it shines.',
      points: [
        'Triggers: API Gateway, S3 uploads, SQS, SNS, EventBridge, DynamoDB Streams and more.',
        'Runtimes: Java, Node.js, Python, .NET, Ruby, or a container image.',
        'Pay per request and per GB-second of memory used; zero cost when idle.',
        'Memory 128 MB to 10,240 MB; CPU grows with memory.',
        'Stateless: keep data in S3, DynamoDB or a database, not in the function.',
      ],
      detail: `<pre><code>public class Hello implements RequestHandler&lt;Map&lt;String, String&gt;, String&gt; {
  // create SDK clients here, outside the handler, so they are reused
  @Override
  public String handleRequest(Map&lt;String, String&gt; event, Context ctx) {
    ctx.getLogger().log("Got " + event);
    return "Hello " + event.get("name");
  }
}</code></pre>`,
    },
    {
      title: 'Invocation Types',
      level: 'intermediate',
      summary: 'Lambda is called in three ways: sync, async, or by polling a queue or stream for you.',
      simple:
        'Sync is a phone call: the caller waits for the answer. Async is a voicemail: Lambda calls back later. Polling is a worker checking the inbox for you.',
      points: [
        'Sync (API Gateway, SDK invoke): the caller waits and handles errors itself.',
        'Async (S3, SNS, EventBridge): Lambda queues the event and retries 2 more times on error.',
        'Send failed async events to a DLQ or an on-failure destination so nothing is lost silently.',
        'Event source mapping (SQS, Kinesis, DynamoDB Streams): Lambda polls and hands you batches.',
        'With SQS, report partial batch failures so only the failed messages come back.',
      ],
      detail: `<pre><code>// SQS trigger: retry only the messages that failed
export const handler = async (event) =&gt; {
  const batchItemFailures = [];
  for (const msg of event.Records) {
    try { await handle(JSON.parse(msg.body)); }
    catch { batchItemFailures.push({ itemIdentifier: msg.messageId }); }
  }
  return { batchItemFailures }; // needs ReportBatchItemFailures turned on
};</code></pre>`,
      tip: 'All async and polling paths can deliver the same event twice. Make handlers idempotent.',
    },
    {
      title: 'Lambda Limits',
      level: 'intermediate',
      summary: 'The hard edges every Lambda design must fit inside.',
      simple:
        'A food truck is great, but it has a small kitchen and must close after 15 minutes. Big, long jobs need a real restaurant.',
      points: [
        'Max run time is 15 minutes per invocation.',
        'Sync request and response payloads max 6 MB each.',
        '<code>/tmp</code> disk: 512 MB by default, up to 10 GB.',
        'Deployment package: 50 MB zipped (direct upload), 250 MB unzipped; container images up to 10 GB.',
        'Default 1,000 concurrent executions per region per account (can be raised).',
      ],
      tip: 'If a job may run longer than 15 minutes, split it with Step Functions or move it to Fargate.',
    },
    {
      title: 'Versions, Aliases & Layers',
      level: 'intermediate',
      summary: 'Freeze a copy of your function, point a stable name at it, and share code between functions.',
      simple:
        'A version is a printed edition of a book. An alias is the "current edition" sticker you move to the newest print. A layer is a shared appendix every book can include.',
      points: [
        'Publishing a version freezes the code and settings; <code>$LATEST</code> is the editable draft.',
        'An alias like <code>prod</code> points to a version, so callers never change their ARN.',
        'Aliases can split traffic, e.g. 90% to v5 and 10% to v6, for safe rollouts.',
        'Layers hold shared libraries or tools; a function can use up to 5.',
      ],
      tip: 'Point triggers and API Gateway at an alias, not at $LATEST, so a half-finished change never reaches users.',
    },
    {
      title: 'Containers on AWS',
      level: 'intermediate',
      summary: 'Run Docker images with ECS or EKS, on EC2 servers or on serverless Fargate.',
      simple:
        'Your app is packed in a standard box (image), stored in a warehouse (ECR), and a dispatcher (ECS or EKS) decides which truck runs it.',
      points: [
        'ECR is the private image registry; it can scan images for vulnerabilities.',
        'Orchestrator choices: ECS (AWS-native, simpler) or EKS (Kubernetes).',
        'Capacity choices: EC2 instances you manage, or Fargate.',
        'Good for long-running services, steady traffic and any language or runtime.',
      ],
      children: [
        {
          title: 'ECS',
          level: 'intermediate',
          summary: 'Elastic Container Service: AWS’s own, simpler container orchestrator.',
          simple:
            'A shift manager who keeps the right number of workers (containers) on duty and replaces anyone who goes home sick.',
          points: [
            'Task definition: which image, CPU, memory, env vars and IAM task role.',
            'Service: keeps N tasks running and registers them with a load balancer.',
            'Deep AWS integration: IAM per task, CloudWatch logs, Service Connect.',
            'No control plane fee; you pay only for compute.',
          ],
        },
        {
          title: 'Fargate',
          level: 'intermediate',
          summary: 'Serverless compute for containers: you set CPU and memory, AWS provides the machine.',
          simple:
            'Like ride-hailing for containers: you say where to go and how big a car, and never own or maintain one.',
          points: [
            'Works with both ECS and EKS.',
            'No instances to patch or scale; each task gets its own isolated environment.',
            'Pay per vCPU and GB per second while tasks run.',
            'Fargate Spot gives big discounts for interruptible tasks.',
          ],
        },
        {
          title: 'EKS',
          level: 'advanced',
          summary: 'Elastic Kubernetes Service: managed Kubernetes control plane on AWS.',
          points: [
            'AWS runs the Kubernetes control plane; you pay an hourly fee per cluster.',
            'Nodes: managed node groups, Karpenter, Fargate, or EKS Auto Mode.',
            'Pods get AWS access via EKS Pod Identity or IRSA.',
            'Choose it for Kubernetes skills, tools or multi-cloud portability.',
          ],
          tip: 'If the team does not already know Kubernetes, ECS on Fargate is usually the faster, cheaper path.',
        },
      ],
    },
    {
      title: 'Choosing Compute',
      level: 'intermediate',
      summary: 'A quick guide to picking EC2, Lambda, or containers for a workload.',
      simple:
        'Lambda is a taxi (short trips, no upkeep), containers on Fargate are a rental car (longer trips, still no repairs), EC2 is your own car (full control, full upkeep).',
      points: [
        'Lambda: event-driven, spiky or low traffic, jobs under 15 minutes.',
        'ECS/EKS on Fargate: long-running services without server management.',
        'EC2: special OS needs, GPUs, licensed software, or the lowest cost at steady high load.',
        'Mixing them is normal: Lambda for glue, containers for the main APIs.',
      ],
    },
    {
      title: 'Amazon Bedrock',
      level: 'intermediate',
      summary: 'A serverless API to use AI models (Claude, Llama, Amazon Nova and more) inside your app.',
      simple:
        'Like a food court of AI models: one counter, one way to order, and you can switch dishes without changing how you pay.',
      points: [
        'No GPUs to manage; pay per token (word piece) in and out.',
        'The Converse API works the same way for every chat model.',
        'Knowledge Bases add RAG: the model answers using your own documents.',
        'Guardrails filter harmful content and personal data.',
        'Your prompts and data are not used to train the models.',
      ],
      detail: `<pre><code>import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';

const br = new BedrockRuntimeClient({ region: 'us-east-1' });
const res = await br.send(new ConverseCommand({
  modelId: 'amazon.nova-lite-v1:0', // any model enabled in your account
  messages: [{ role: 'user', content: [{ text: 'Summarize: ...' }] }],
}));
console.log(res.output.message.content[0].text);</code></pre>`,
    },
    {
      title: 'Cold Starts',
      level: 'advanced',
      summary: 'The extra delay when Lambda must create a new environment before running your code.',
      points: [
        'Happens on first call, after idle time, and when scaling out.',
        'Java is hit hardest because of JVM start and class loading.',
        'SnapStart (Java, Python, .NET) restores from a snapshot and cuts start time a lot.',
        'Provisioned concurrency keeps environments warm, for a fee.',
        'Smaller packages, fewer dependencies and init outside the handler all help.',
      ],
      tip: 'For Java Lambdas, try SnapStart first. It is often the biggest single win.',
    },
    {
      title: 'Lambda Concurrency',
      level: 'advanced',
      summary: 'How many copies of your function run at once, and how to control it.',
      points: [
        'One environment handles one request at a time; more requests means more environments.',
        'Each function can scale by 1,000 concurrent executions every 10 seconds.',
        'Reserved concurrency guarantees capacity and also caps it, protecting your database.',
        'Throttled sync calls get 429 errors; async events are retried by Lambda.',
        'Use RDS Proxy so thousands of Lambdas do not exhaust database connections.',
      ],
    },
  ],
};
