import type { KmTopic } from '../../types';
import { buildAutomation } from './build';
import { deployment } from './deployment';
import { environments } from './environments';
import { fundamentals } from './fundamentals';
import { infraAndData } from './infra';
import { afterDeploy } from './operations';
import { pipelines, tools } from './pipelines';
import { bestPractices } from './practices';
import { qualitySecurity } from './security';
import { testing } from './testing';
import { versionControl } from './version-control';

export const cicd: KmTopic = {
  id: 'cicd',
  name: 'CI/CD',
  icon: '🔁',
  description:
    'Continuous integration and delivery — from your first pipeline to safe deployments, supply-chain security and DORA metrics.',
  root: {
    title: 'CI/CD',
    level: 'beginner',
    summary:
      'Automating how code is merged, built, tested and released, so changes reach users quickly and safely.',
    simple:
      'Think of a factory line for software. Every change rides the same line: it gets built, checked at each station, and shipped, without anyone doing the boring steps by hand.',
    points: [
      'Branches go from the basics to expert topics — follow them in order or use Next.',
      'Badge colors show the level: Beginner → Intermediate → Advanced → Expert.',
      'Tool names change; the ideas (small changes, fast feedback, build once) stay.',
    ],
    children: [
      fundamentals,
      versionControl,
      buildAutomation,
      testing,
      pipelines,
      tools,
      qualitySecurity,
      environments,
      deployment,
      infraAndData,
      afterDeploy,
      bestPractices,
    ],
  },
};
