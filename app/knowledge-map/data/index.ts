import type { KmTopic } from '../types';
import { aws } from './aws';
import { cicd } from './cicd';
import { cleanArchitecture } from './clean-architecture';
import { docker } from './docker';
import { englishGrammar } from './english-grammar';
import { htmlCss } from './html-css';
import { java } from './java';
import { javascript } from './javascript';
import { jpaHibernate } from './jpa-hibernate';
import { junitMockito } from './junit-mockito';
import { kafka } from './kafka';
import { microservices } from './microservices';
import { react } from './react';
import { redis } from './redis';
import { springBoot } from './spring-boot';
import { sql } from './sql';
import { systemDesign } from './system-design';
import { typescript } from './typescript';

/** Every topic available on the Knowledge Map page — add new topics here. */
export const KM_TOPICS: KmTopic[] = [
  htmlCss,
  javascript,
  typescript,
  react,
  java,
  springBoot,
  jpaHibernate,
  junitMockito,
  sql,
  redis,
  cleanArchitecture,
  microservices,
  kafka,
  docker,
  cicd,
  aws,
  systemDesign,
  englishGrammar,
];
