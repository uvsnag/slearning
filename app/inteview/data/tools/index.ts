// Interview data: TOOLS & TECHNOLOGIES
// Tools a senior Java/JavaScript engineer is expected to know. Questions are
// grouped by theme, one file per group — add new ones to the matching file
// (or add a file here and spread it into `questions` below).
import type { PvTopic } from '../../types';
import { questions as apiIntegration } from './api-integration';
import { questions as cachingSearch } from './caching-search';
import { questions as devTooling } from './dev-tooling';
import { questions as messaging } from './messaging';
import { questions as observability } from './observability';
import { questions as platform } from './platform';
import { questions as platformServices } from './platform-services';

export const topics: PvTopic[] = [
  {
    id: 'tools-tech',
    name: 'Tools & Technologies',
    icon: '🧰',
    questions: [
      ...platform,
      ...messaging,
      ...cachingSearch,
      ...observability,
      ...apiIntegration,
      ...platformServices,
      ...devTooling,
    ],
  },
];
