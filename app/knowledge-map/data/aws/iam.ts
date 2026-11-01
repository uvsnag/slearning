import type { KmNode } from '../../types';

export const iamSecurity: KmNode = {
  title: 'IAM & Security',
  level: 'beginner',
  summary:
    'Who can do what on which resource, plus keys, secrets and the services that guard your account.',
  simple:
    'IAM is the badge system of an office building. Each person or app gets a badge that opens only the doors they need.',
  points: [
    'IAM (Identity and Access Management) is global and free.',
    'Every AWS API call is checked against IAM policies.',
    'Default is deny: nothing is allowed until a policy says so.',
    'Use roles and short-lived credentials, not long-lived keys.',
  ],
  children: [
    {
      title: 'Users & Groups',
      level: 'beginner',
      summary: 'An IAM user is a person or app with long-term credentials; a group bundles users.',
      simple:
        'A user is one employee badge. A group is a department: give the department access once, and everyone in it gets it.',
      points: [
        'Users can have a console password and/or access keys (key ID + secret).',
        'Attach permissions to groups, not to single users. It is easier to manage.',
        'For humans, AWS now recommends IAM Identity Center (single sign-on) over IAM users.',
        'Access keys never expire by themselves. Rotate them or, better, avoid them.',
      ],
      tip: 'Leaked access keys in a Git repo are the classic AWS horror story. Bots find them within minutes.',
    },
    {
      title: 'Roles',
      level: 'beginner',
      summary: 'An identity with permissions that someone or something “puts on” for a short time.',
      simple:
        'A role is like a visitor badge at reception: you borrow it, use it for a while, and it expires on its own.',
      points: [
        'No password or permanent keys. Whoever assumes the role gets temporary credentials.',
        'EC2, Lambda and ECS tasks use roles to call other AWS services.',
        'A trust policy says who may assume the role. A permission policy says what it can do.',
        'Roles also let one account safely access another (cross-account access).',
      ],
      tip: 'Rule of thumb: apps running on AWS should always use roles, never stored access keys.',
    },
    {
      title: 'Policies',
      level: 'intermediate',
      summary: 'JSON documents that list which actions are allowed or denied on which resources.',
      simple:
        'A policy is the list printed on the back of a badge: “may open doors 3 and 4, may not enter the server room”.',
      points: [
        'Each statement has Effect (Allow/Deny), Action, Resource and optional Condition.',
        'Identity-based policies attach to users, groups or roles.',
        'Resource-based policies attach to things like S3 buckets or SQS queues.',
        'Resources are named by ARN (Amazon Resource Name), a unique ID string.',
        'Least privilege: grant only what is needed, then widen if something breaks.',
      ],
      detail: `<pre><code>// Allow reading files from one bucket only
const policy = {
  Version: '2012-10-17',
  Statement: [{
    Effect: 'Allow',
    Action: ['s3:GetObject'],
    Resource: 'arn:aws:s3:::my-photos/*',
  }],
};</code></pre>`,
      tip: 'Avoid "Action": "*" and "Resource": "*" outside quick experiments. IAM Access Analyzer can suggest tighter policies.',
    },
    {
      title: 'Credentials in Code',
      level: 'intermediate',
      summary: 'The SDK finds credentials by itself through the default credentials provider chain.',
      simple:
        'Your app does not carry keys in its pocket. It asks the room it is in (laptop, EC2, Lambda) for a badge, and the SDK knows where to look.',
      points: [
        'Java v2 order: system properties, env vars, web identity, <code>~/.aws</code> files, container, EC2 instance metadata.',
        'On your laptop: <code>aws sso login</code> or a profile. On AWS: the attached role.',
        'Temporary credentials refresh automatically. Never hard-code keys.',
        'Create SDK clients once and reuse them. They are thread-safe.',
      ],
      detail: `<pre><code>// No keys in code: the SDK finds them itself
DynamoDbClient ddb = DynamoDbClient.builder()
    .region(Region.US_EAST_1)
    .build();  // DefaultCredentialsProvider is used</code></pre>`,
    },
    {
      title: 'KMS & Encryption',
      level: 'intermediate',
      summary: 'KMS (Key Management Service) creates and guards encryption keys that services use for you.',
      simple:
        'KMS is a bank vault for keys. Services ask the vault to lock or unlock data, but the master key never leaves the vault.',
      points: [
        'At rest: S3, EBS, RDS and DynamoDB can encrypt with a KMS key, often with one setting.',
        'In transit: use TLS (HTTPS). AWS endpoints support it everywhere.',
        'AWS-managed keys are free and easy; customer-managed keys give you control and rotation.',
        'Envelope encryption: a data key encrypts data, and KMS encrypts the data key.',
        'Every key use is logged in CloudTrail.',
      ],
    },
    {
      title: 'Secrets Manager & Parameter Store',
      level: 'intermediate',
      summary: 'Safe places to store passwords, API keys and config, instead of in code or env files.',
      simple:
        'Like a password manager for your apps: they ask for the secret when they start, and nobody writes it on a sticky note.',
      points: [
        'Secrets Manager: built-in automatic rotation (e.g. RDS passwords), costs per secret.',
        'SSM Parameter Store: simple key-values and config; standard tier is free.',
        'Both encrypt with KMS and control access with IAM.',
        'Cache secrets in your app to cut latency and cost.',
      ],
      detail: `<pre><code>import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const sm = new SecretsManagerClient({});
const res = await sm.send(new GetSecretValueCommand({ SecretId: 'prod/db' }));
const { username, password } = JSON.parse(res.SecretString);</code></pre>`,
    },
    {
      title: 'Cognito',
      level: 'intermediate',
      summary: 'Ready-made sign-up and login for your app’s own users, with social and enterprise logins.',
      simple:
        'Instead of building your own front desk that checks IDs, you hire a security company. It hands each guest a wristband (token) your app trusts.',
      points: [
        'User pools: sign-up, sign-in, MFA and password reset; they issue JWTs (signed login tokens).',
        'Log in with Google, Apple, Facebook, or company logins (SAML, OIDC).',
        'Identity pools trade a login for temporary AWS credentials, e.g. to upload to S3 from a phone.',
        'API Gateway and ALB can check Cognito tokens before your code runs.',
        'Managed login gives you hosted, brandable login pages.',
      ],
      tip: 'IAM is for people and apps that manage AWS. Cognito is for the end users of your own app. Do not mix them up.',
    },
    {
      title: 'Policy Evaluation',
      level: 'advanced',
      summary: 'How AWS combines all policies to decide Allow or Deny for one request.',
      simple:
        'Think of a strict club door: one “no” from anyone wins. If nobody said “yes”, you are also not getting in.',
      points: [
        'Start at implicit deny. An explicit Allow is needed to get in.',
        'Any explicit Deny always wins over every Allow.',
        'Organization SCPs and permission boundaries set the max; they never grant on their own.',
        'Cross-account access needs an Allow on both sides: the caller and the resource.',
      ],
      tip: 'When access fails, check in this order: SCP, permission boundary, identity policy, resource policy, session policy.',
    },
    {
      title: 'STS & AssumeRole',
      level: 'advanced',
      summary: 'STS (Security Token Service) hands out temporary credentials when you assume a role.',
      points: [
        'Credentials have an access key, secret and session token, and they expire.',
        'Default session is 1 hour; a role can allow up to 12 hours.',
        'Role chaining (a role assuming another role) is capped at 1 hour.',
        'Used for cross-account access, CI/CD via OIDC and EKS pod identities.',
      ],
      detail: `<pre><code>StsClient sts = StsClient.create();
Credentials c = sts.assumeRole(b -&gt; b
    .roleArn("arn:aws:iam::123456789012:role/ReadOnly")
    .roleSessionName("report-job"))
  .credentials(); // expires after 1 hour by default</code></pre>`,
      tip: 'For GitHub Actions or other CI, use OIDC to assume a role. No stored AWS keys at all.',
    },
    {
      title: 'WAF, Shield & GuardDuty',
      level: 'advanced',
      summary: 'Services that block web attacks, absorb DDoS floods and spot suspicious activity.',
      points: [
        'WAF: a web firewall on CloudFront, ALB or API Gateway. Blocks SQL injection, bad bots, rate abuse.',
        'Shield Standard: free DDoS protection for everyone. Shield Advanced adds 24/7 response team and cost protection.',
        'GuardDuty: reads logs (CloudTrail, VPC flow, DNS) and flags threats like crypto-mining or stolen keys.',
        'Security Hub collects findings from all these into one dashboard.',
      ],
      tip: 'Turn on GuardDuty in every account and region. It needs no agents and costs little for most apps.',
    },
  ],
};
