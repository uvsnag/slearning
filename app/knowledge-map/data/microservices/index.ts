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
    alt: 'Microservices overview (Vietnamese labels): users on web, laptop and mobile call an API gateway / load balancer, which routes to user, product, order and payment services; each service has its own database, uses service discovery, and shares monitoring (Prometheus, Grafana, ELK) and an event bus (Kafka)',
    caption:
      'Note: the picture draws service discovery as a layer between services and their databases. In reality each service talks to its own database directly — the registry is just a phone book services ask to find each other.',
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
