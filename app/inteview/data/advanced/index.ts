// Interview data: system-design, microservices, security-jwt, design-patterns, algorithms
// Each topic lives in its own file — add a new one here after creating it.
import type { PvTopic } from '../../types';
import { topics as algorithms } from './algorithms';
import { topics as designPatterns } from './design-patterns';
import { topics as microservices } from './microservices';
import { topics as securityJwt } from './security-jwt';
import { topics as systemDesign } from './system-design';

export const topics: PvTopic[] = [
  ...systemDesign,
  ...microservices,
  ...securityJwt,
  ...designPatterns,
  ...algorithms,
];
