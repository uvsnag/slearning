import type { KmTopic } from '../../types';
import overview from '../../image/kafka.png';
import { architecture } from './architecture';
import { consumer, producer } from './clients';
import { design, internals } from './design';
import { ecosystem, schemas } from './ecosystem';
import { fundamentals } from './fundamentals';
import { operations, security } from './operations';
import { reliability } from './reliability';

export const kafka: KmTopic = {
  id: 'kafka',
  name: 'Apache Kafka',
  icon: '📨',
  description:
    'Distributed event streaming — from first concepts to running and designing with Kafka at scale.',
  image: {
    src: overview.src,
    alt: 'Kafka overview: producers write to topic partitions on brokers, consumer groups read them',
    caption:
      'Note: the diagram shows ZooKeeper — Kafka 4.0+ uses KRaft (built-in controllers) instead.',
  },
  root: {
    title: 'Apache Kafka',
    level: 'beginner',
    summary:
      'A system that lets apps send streams of events to each other, store them safely and replay them.',
    simple:
      'Kafka is a giant shared notebook. Many apps write new lines at the end, each reader keeps its own bookmark, and copies live on several machines so nothing gets lost.',
    points: [
      'The branches follow a learning path: start at Fundamentals, end at Internals.',
      'Badge colors show the level: Beginner → Intermediate → Advanced → Expert.',
      'Click "Next" in the panel to walk through every concept in order.',
    ],
    children: [
      fundamentals,
      architecture,
      producer,
      consumer,
      reliability,
      schemas,
      ecosystem,
      operations,
      security,
      design,
      internals,
    ],
  },
};
