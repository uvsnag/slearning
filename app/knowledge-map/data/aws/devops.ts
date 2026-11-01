import type { KmNode } from '../../types';

export const devops: KmNode = {
  title: 'IaC & DevOps',
  level: 'intermediate',
  summary:
    'Describe your infrastructure as code (CloudFormation, CDK) and ship changes safely with pipelines.',
  simple:
    'Instead of building a house by hand each time, you write the blueprint once. Any builder can then build the exact same house again and again.',
  points: [
    'Infrastructure as Code makes environments repeatable and reviewable.',
    'CloudFormation is the engine; CDK lets you write it in real code.',
    'Pipelines build, test and deploy every change automatically.',
  ],
  children: [
    {
      title: 'Infrastructure as Code',
      level: 'beginner',
      summary: 'Define servers, networks and permissions in files kept in Git, not by clicking.',
      simple:
        'A recipe instead of cooking from memory: anyone can make the same dish, and you can see exactly what changed between versions.',
      points: [
        'Same code creates dev, test and prod, so they do not drift apart.',
        'Changes go through pull requests and code review.',
        'Delete a whole environment and rebuild it in minutes.',
        'Tools: CloudFormation, CDK, Terraform, Pulumi, SAM (for serverless).',
      ],
      tip: 'If someone fixed prod by clicking in the console, put that change into code right away, or it will be lost.',
    },
    {
      title: 'CloudFormation',
      level: 'intermediate',
      summary: 'AWS’s native IaC service: a template describes resources, a stack is one deployed copy.',
      simple:
        'You hand AWS a shopping list; it figures out the order, buys everything, and returns it all if something goes wrong.',
      points: [
        'Templates in YAML or JSON; stacks create, update and delete resources together.',
        'Works out dependencies and creation order for you.',
        'Failed updates roll back automatically to the last good state.',
        'Change sets preview what an update will do before you run it.',
        'Drift detection finds manual changes made outside the template.',
      ],
    },
    {
      title: 'AWS CDK',
      level: 'intermediate',
      summary: 'Cloud Development Kit: write infrastructure in JavaScript, TypeScript, Java or Python; it generates CloudFormation.',
      simple:
        'Instead of filling in a long form by hand, you write a small program that fills in the form for you, with loops, functions and smart defaults.',
      points: [
        'Constructs are building blocks with sensible, secure defaults.',
        'Helpers like <code>bucket.grantRead(fn)</code> write least-privilege IAM for you.',
        '<code>cdk synth</code> makes the template, <code>cdk diff</code> previews, <code>cdk deploy</code> ships.',
        'Share your own constructs as libraries across teams.',
      ],
      detail: `<pre><code>const { App, Stack, Duration } = require('aws-cdk-lib');
const s3 = require('aws-cdk-lib/aws-s3');
const lambda = require('aws-cdk-lib/aws-lambda');
class UploadStack extends Stack {
  constructor(scope, id) {
    super(scope, id);
    const bucket = new s3.Bucket(this, 'Uploads', { versioned: true });
    const fn = new lambda.Function(this, 'Resize', {
      runtime: lambda.Runtime.NODEJS_22_X, handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda'), timeout: Duration.seconds(30),
    });
    bucket.grantRead(fn); // CDK writes the IAM policy
  }
}
new UploadStack(new App(), 'UploadStack');</code></pre>`,
    },
    {
      title: 'CI/CD Pipelines',
      level: 'intermediate',
      summary: 'CodePipeline, CodeBuild and CodeDeploy automate build, test and release on AWS.',
      simple:
        'A factory conveyor belt: code goes in at one end, gets built, checked and packed, and comes out deployed at the other.',
      points: [
        'CodePipeline: the conveyor belt that links stages (source, build, test, deploy).',
        'CodeBuild: runs build and test commands in managed containers.',
        'CodeDeploy: rolls out to EC2, ECS or Lambda with traffic shifting.',
        'Source from GitHub, GitLab, Bitbucket or CodeCommit (closed to new customers in 2024, open again since late 2025).',
        'GitHub Actions with OIDC roles is a popular alternative.',
      ],
    },
    {
      title: 'Deployment Strategies',
      level: 'advanced',
      summary: 'Ways to release new versions with little risk and fast rollback.',
      points: [
        'Rolling: replace instances in batches; cheap, but old and new run side by side.',
        'Blue/green: start a full new copy, switch traffic, keep the old one for quick rollback.',
        'Canary: send a small slice (e.g. 10%) first, then the rest if metrics look good.',
        'Lambda aliases and CodeDeploy can shift traffic and auto-rollback on CloudWatch alarms.',
        'Feature flags (AppConfig) separate deploying code from turning features on.',
      ],
      tip: 'Always tie the rollout to alarms. A canary without automatic rollback is just a slower outage.',
    },
  ],
};
