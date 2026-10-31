import type { KmTopic } from '../../types';
import overview from '../../image/javascript.png';
import { advanced } from './advanced';
import { asyncJs } from './async';
import { basics } from './basics';
import { browser } from './browser';
import { classes } from './classes';
import { errors } from './errors';
import { functions } from './functions';
import { modern } from './modern';
import { objectsArrays } from './objects';
import { memoryPerformance, security } from './performance';
import { modulesTooling } from './tooling';

export const javascript: KmTopic = {
  id: 'javascript',
  name: 'JavaScript',
  icon: '🟨',
  description:
    'The language of the web — from your first variable to the event loop, browser APIs, performance and security.',
  image: {
    src: overview.src,
    alt: 'JavaScript overview: code runs in an engine with a call stack, heap and event loop, using browser or Node.js runtime APIs',
    caption:
      'Note: this diagram has mistakes — "Topic" and "Partition" are Kafka words, not JavaScript, and the heap holds objects (not "OS"). Also there are two queues: microtasks (promises) always run before the next task (timers, events).',
  },
  root: {
    title: 'JavaScript',
    level: 'beginner',
    summary:
      'A dynamic, single-threaded language that runs in every browser and, with Node.js, on servers too.',
    simple:
      'JavaScript is the part of a website that reacts to you: buttons, forms, live updates. One worker (the main thread) does everything, but it never waits around — it hands slow jobs to helpers and comes back when they are done.',
    points: [
      'The branches follow a learning path: start at Basics, end at Modern JS & Internals.',
      'Badge colors show the level: Beginner → Intermediate → Advanced → Expert.',
      'Click "Next" in the panel to walk through every concept in order.',
    ],
    children: [
      basics,
      functions,
      objectsArrays,
      classes,
      errors,
      modulesTooling,
      asyncJs,
      browser,
      advanced,
      memoryPerformance,
      security,
      modern,
    ],
  },
};
