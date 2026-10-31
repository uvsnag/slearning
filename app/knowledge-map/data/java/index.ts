import type { KmTopic } from '../../types';
import overview from '../../image/java.png';
import { basics } from './basics';
import { bestPractices } from './best-practices';
import { collections } from './collections';
import { concurrency } from './concurrency';
import { coreApis } from './core-apis';
import { exceptions } from './exceptions';
import { functional } from './functional';
import { io } from './io';
import { jvm } from './jvm';
import { modernJava } from './modern';
import { oop } from './oop';
import { tooling } from './tooling';

export const java: KmTopic = {
  id: 'java',
  name: 'Java',
  icon: '☕',
  description:
    'The Java language and platform — from your first class to the JVM, concurrency and modern Java.',
  image: {
    src: overview.src,
    alt: 'Java overview: source code is compiled by javac to bytecode, loaded and run by the JVM on any OS',
  },
  root: {
    title: 'Java',
    level: 'beginner',
    summary:
      'A general-purpose language that compiles to bytecode and runs anywhere a JVM is installed.',
    simple:
      'You write Java once, the compiler turns it into bytecode (a universal "recipe"), and the JVM on each computer cooks that recipe for its own machine. That is why the same app runs on Windows, Mac and Linux.',
    points: [
      'Branches go from the basics to expert topics — follow them clockwise or use Next.',
      'Badge colors show the level: Beginner → Intermediate → Advanced → Expert.',
      'Tick "I understand this" as you go to track your progress.',
    ],
    children: [
      basics,
      oop,
      coreApis,
      collections,
      exceptions,
      functional,
      jvm,
      concurrency,
      io,
      modernJava,
      tooling,
      bestPractices,
    ],
  },
};
