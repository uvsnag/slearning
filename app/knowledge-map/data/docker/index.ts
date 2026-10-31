import type { KmTopic } from '../../types';
import overview from '../../image/docker.png';
import { builds } from './builds';
import { compose } from './compose';
import { dockerfile } from './dockerfile';
import { fundamentals } from './fundamentals';
import { containers, images } from './images-containers';
import { internals } from './internals';
import { production } from './production';
import { security } from './security';
import { networking, storage } from './storage-network';
import { troubleshooting } from './troubleshooting';

export const docker: KmTopic = {
  id: 'docker',
  name: 'Docker',
  icon: '🐳',
  description:
    'Containers with Docker — from your first docker run to Dockerfiles, Compose, production, security and how containers really work.',
  image: {
    src: overview.src,
    alt: 'Docker overview: a Dockerfile is built into a layered image, stored in a registry and run as containers on the Docker engine',
    caption:
      'Note: parts of this picture are wrong. Docker has no "brokers", "offsets", "controller" or "consumers" (those are Kafka terms), and the file is named Dockerfile, not ".dockerfile". The real flow: Dockerfile → docker build → image → registry → docker run → container.',
  },
  root: {
    title: 'Docker',
    level: 'beginner',
    summary: 'A platform to package apps into images and run them as isolated containers anywhere.',
    simple:
      'Docker is like a shipping container for software. You pack your app with everything it needs once, and it runs the same on your laptop, a test server or the cloud.',
    points: [
      'Branches go from the basics to expert topics — follow them in order or use Next.',
      'Badge colors show the level: Beginner → Intermediate → Advanced → Expert.',
      'Commands and Dockerfile lines are shown inline; code examples are Java or JavaScript.',
    ],
    children: [
      fundamentals,
      images,
      containers,
      dockerfile,
      builds,
      storage,
      networking,
      compose,
      production,
      security,
      troubleshooting,
      internals,
    ],
  },
};
