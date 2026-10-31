import type { KmTopic } from '../types';
import { cicd } from './cicd';
import { docker } from './docker';
import { englishGrammar } from './english-grammar';
import { java } from './java';
import { javascript } from './javascript';
import { kafka } from './kafka';
import { microservices } from './microservices';
import { react } from './react';
import { springBoot } from './spring-boot';
import { sql } from './sql';
import { systemDesign } from './system-design';

/** Every topic available on the Knowledge Map page — add new topics here. */
export const KM_TOPICS: KmTopic[] = [
  javascript,
  react,
  java,
  springBoot,
  sql,
  microservices,
  kafka,
  docker,
  cicd,
  systemDesign,
  englishGrammar,
];
