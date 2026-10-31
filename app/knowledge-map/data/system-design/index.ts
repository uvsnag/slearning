import type { KmTopic } from '../../types';
import { apis } from './apis';
import { architecture, reliability } from './architecture-reliability';
import { buildingBlocks } from './building-blocks';
import { caching, messaging } from './caching-messaging';
import { distributed } from './distributed';
import { fundamentals, scaling } from './fundamentals';
import { classicProblems, interviewApproach } from './interview';
import { storage } from './storage';

export const systemDesign: KmTopic = {
  id: 'system-design',
  name: 'System Design',
  icon: '🏗️',
  description:
    'Designing systems that scale and stay up — from load balancers and caches to distributed theory and the design interview.',
  root: {
    title: 'System Design',
    level: 'beginner',
    summary:
      'Planning how servers, databases, caches and queues work together to meet a product’s needs at scale.',
    simple:
      'If coding is building rooms, system design is planning the whole city: roads, water, power, and what happens when one road closes.',
    points: [
      'Branches go from the basics to expert topics — follow them in order or use Next.',
      'Badge colors show the level: Beginner → Intermediate → Advanced → Expert.',
      'Microservices, Kafka, Docker and SQL have their own topics; this one ties them together.',
    ],
    children: [
      fundamentals,
      scaling,
      apis,
      storage,
      caching,
      messaging,
      architecture,
      reliability,
      distributed,
      buildingBlocks,
      interviewApproach,
      classicProblems,
    ],
  },
};
