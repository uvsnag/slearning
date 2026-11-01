import type { KmTopic } from '../../types';
import overview from '../../image/typescript.png';
import { basics } from './basics';
import { classes } from './classes';
import { functions } from './functions';
import { generics } from './generics';
import { internals } from './internals';
import { modules } from './modules';
import { narrowing } from './narrowing';
import { objectTypes } from './objects';
import { patterns } from './patterns';
import { tooling } from './tooling';
import { typeLevel, utilityTypes } from './type-level';

export const typescript: KmTopic = {
  id: 'typescript',
  name: 'TypeScript',
  icon: '🔷',
  description:
    'JavaScript with types — from your first annotation to generics, type-level tricks and compiler internals.',
  image: {
    src: overview.src,
    alt: 'TypeScript overview (Vietnamese labels): key features (static typing, OOP, superset of JavaScript, compilation), the dev workflow (.ts file → tsc → .js file → browser or Node.js), the type system (basic, complex, advanced and utility types) and the benefits (early error detection, maintainability, tooling, scalability)',
  },
  root: {
    title: 'TypeScript',
    level: 'beginner',
    summary:
      'JavaScript plus a type system that finds mistakes before your code runs, then compiles back to plain JavaScript.',
    simple:
      'TypeScript is a spell-checker for JavaScript. It reads your code, underlines what will break, and then hands the browser normal JavaScript.',
    points: [
      'The branches follow a learning path: start at Getting Started, end at Type System Internals.',
      'Badge colors show the level: Beginner → Intermediate → Advanced → Expert.',
      'Click "Next" in the panel to walk through every concept in order.',
    ],
    children: [
      basics,
      objectTypes,
      functions,
      narrowing,
      classes,
      generics,
      utilityTypes,
      modules,
      tooling,
      patterns,
      typeLevel,
      internals,
    ],
  },
};
