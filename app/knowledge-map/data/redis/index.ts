import type { KmTopic } from '../../types';
import overview from '../../image/redis.png';
import { atomicity } from './atomicity';
import { caching } from './caching';
import { clients } from './clients';
import { coreTypes, specialTypes } from './data-types';
import { fundamentals } from './fundamentals';
import { internals } from './internals';
import { messaging } from './messaging';
import { operations } from './operations';
import { patterns } from './patterns';
import { persistence } from './persistence';
import { scaling } from './scaling';

export const redis: KmTopic = {
  id: 'redis',
  name: 'Redis',
  icon: '🧱',
  description:
    'The in-memory data store — from keys and data types to caching, messaging, clustering and internals.',
  image: {
    src: overview.src,
    alt: 'Redis overview (Vietnamese labels): client apps send commands like GET, SET, HSET over TCP to the Redis server, which keeps data structures (strings, hashes, lists, sets, sorted sets) in RAM, saves to disk with AOF and RDB, scales with replication, Sentinel and Cluster, and offers Pub/Sub',
  },
  root: {
    title: 'Redis',
    level: 'beginner',
    summary:
      'A super-fast in-memory data store used as a cache, database, message broker and coordination tool.',
    simple:
      'Redis is a shared whiteboard for all your servers. Anyone can write or read in under a millisecond, and it comes with smart containers like lists, scoreboards and logbooks.',
    points: [
      'The branches follow a learning path: start at Fundamentals, end at Internals.',
      'Badge colors show the level: Beginner → Intermediate → Advanced → Expert.',
      'Click "Next" in the panel to walk through every concept in order.',
    ],
    children: [
      fundamentals,
      coreTypes,
      specialTypes,
      clients,
      caching,
      atomicity,
      messaging,
      patterns,
      persistence,
      scaling,
      operations,
      internals,
    ],
  },
};
