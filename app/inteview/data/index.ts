import type { PvPart, PvTopic } from '../types';
import { topics as advanced } from './advanced';
import { topics as cicdDocker } from './cicd-docker';
import { topics as cvQuestions } from './cv-questions';
import { topics as gaps } from './gaps';
import { topics as htmlCss } from './html-css';
import { topics as java } from './java';
import { topics as javascript } from './javascript';
import { topics as orm } from './orm';
import { topics as react } from './react';
import { topics as spring } from './spring';
import { topics as sql } from './sql';
import { topics as typescript } from './typescript';
import { topics as zustandTanstack } from './zustand-tanstack';

const ALL_TOPICS: PvTopic[] = [
  ...java,
  ...javascript,
  ...react,
  ...cicdDocker,
  ...sql,
  ...spring,
  ...htmlCss,
  ...orm,
  ...typescript,
  ...advanced,
  ...zustandTanstack,
  ...cvQuestions,
  ...gaps,
];

const topicById = new Map(ALL_TOPICS.map((t) => [t.id, t]));

/** Resolve ids to topics, failing the build loudly if an id drifts. */
const pick = (ids: string[]): PvTopic[] =>
  ids.map((id) => {
    const topic = topicById.get(id);
    if (!topic) throw new Error(`Unknown interview topic id: ${id}`);
    return topic;
  });

const BACKEND_IDS = [
  'java',
  'springboot',
  'mybatis',
  'jpa-hibernate',
  'sql',
  'optimize-sql',
  'microservices',
  'system-design',
  'design-patterns',
  'security-jwt',
  'cicd',
  'docker',
  'algorithms',
  'cv-questions',
];

const FRONTEND_IDS = [
  'html',
  'css',
  'javascript',
  'typescript',
  'reactjs',
  'nextjs',
  'zustand',
  'tanstack',
  'web-performance',
];

// Any topic added later but not classified yet still shows up (under Back End)
// instead of silently disappearing.
const grouped = new Set([...BACKEND_IDS, ...FRONTEND_IDS]);
const leftovers = ALL_TOPICS.filter((t) => !grouped.has(t.id));

export const PV_PARTS: PvPart[] = [
  { id: 'backend', label: 'Back End', icon: '🖥️', topics: [...pick(BACKEND_IDS), ...leftovers] },
  { id: 'frontend', label: 'Front End', icon: '🎨', topics: pick(FRONTEND_IDS) },
];

/** All topics flattened in display order (Back End first, then Front End). */
export const PV_TOPICS: PvTopic[] = PV_PARTS.flatMap((p) => p.topics);
