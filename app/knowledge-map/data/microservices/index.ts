import type { KmTopic } from '../../types';
import overview from '../../image/microservice.png';
import { antiPatterns } from './anti-patterns';
import { communication } from './communication';
import { data } from './data';
import { deployment } from './deployment';
import { domainDesign } from './domain-design';
import { fundamentals } from './fundamentals';
import { infrastructure } from './infrastructure';
import { migration } from './migration';
import { observability } from './observability';
import { resilience } from './resilience';
import { security } from './security';
import { testing } from './testing';

export const microservices: KmTopic = {
  id: 'microservices',
  name: 'Microservices',
  icon: '🧩',
  description:
    'Building systems from small, independent services — from monolith vs microservices to data, resilience and running them at scale.',
  image: {
    src: overview.src,
    alt: 'Microservices overview (in Vietnamese): a build pipeline deploys services; an API gateway and load balancer route web, mobile and partner traffic to services that use a service registry, a message broker and their own databases',
    caption:
      'Note: a simplified sketch. The message broker and "MS 4: Payments" appear twice, and usually the load balancer sits in front of the API gateway (or the gateway balances itself), not behind it.',
  },
  root: {
    title: 'Microservices',
    level: 'beginner',
    summary:
      'An architecture where an app is built from small services that each own one business job and their own data.',
    simple:
      'Instead of one giant store, you run a street of small shops. Each shop has its own staff and stock room, and they work together by sending each other orders and news.',
    points: [
      'Branches follow a learning path: start at Fundamentals, end with Anti-patterns.',
      'Badge colors show the level: Beginner → Intermediate → Advanced → Expert.',
      'Kafka and Spring Boot have their own topics; here they appear only where they fit.',
      'Click "Next" in the panel to walk through every concept in order.',
    ],
    children: [
      fundamentals,
      domainDesign,
      communication,
      infrastructure,
      data,
      resilience,
      security,
      observability,
      testing,
      deployment,
      migration,
      antiPatterns,
    ],
  },
};
