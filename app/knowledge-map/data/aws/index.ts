import type { KmTopic } from '../../types';
import overview from '../../image/aws.png';
import { architecture } from './architecture';
import { compute } from './compute';
import { cost } from './cost';
import { databases } from './databases';
import { devops } from './devops';
import { cloudBasics } from './fundamentals';
import { iamSecurity } from './iam';
import { messaging } from './messaging';
import { monitoring } from './monitoring';
import { networking } from './networking';
import { serverless } from './serverless';
import { storage } from './storage';

export const aws: KmTopic = {
  id: 'aws',
  name: 'AWS',
  icon: '☁️',
  description:
    'Amazon Web Services for developers — from regions and IAM to serverless, data, networking and resilient architecture.',
  image: {
    src: overview.src,
    alt: 'AWS overview (Vietnamese labels): the AWS cloud in the middle with service groups around it — compute (EC2, Lambda, Fargate), storage (S3, EBS, EFS), databases (RDS, DynamoDB, Redshift), networking (VPC, CloudFront, Direct Connect), security (IAM, Shield, Inspector) — and a basic flow: user → network & security → AWS services → result',
    caption:
      'Note: the "Management & Monitoring" group wrongly repeats S3, EBS and EFS (storage services). It should list tools like CloudWatch, CloudTrail, CloudFormation and Systems Manager.',
  },
  root: {
    title: 'AWS',
    level: 'beginner',
    summary:
      'Amazon’s cloud: rent servers, storage, databases and hundreds of other services on demand, paying only for what you use.',
    simple:
      'AWS is a giant hardware and software shop you can rent from by the second. Instead of buying and running servers, you ask for them with a click or an API call, and give them back when you are done.',
    points: [
      'The branches follow a learning path: start at Cloud Basics, end at Architecture.',
      'Badge colors show the level: Beginner → Intermediate → Advanced → Expert.',
      'Click "Next" in the panel to walk through every concept in order.',
    ],
    children: [
      cloudBasics,
      iamSecurity,
      compute,
      storage,
      databases,
      networking,
      serverless,
      messaging,
      devops,
      monitoring,
      cost,
      architecture,
    ],
  },
};
