// Interview data: SECURITY & JWT
// Questions are grouped by theme, one file per group — add new ones to the
// matching file (or add a file here and spread it into `questions` below).
import type { PvTopic } from '../../../types';
import { questions as accessControl } from './access-control';
import { questions as authProtocols } from './auth-protocols';
import { questions as cryptography } from './cryptography';
import { questions as injectionAttacks } from './injection-attacks';
import { questions as practicesProcess } from './practices-process';
import { questions as tokensSessions } from './tokens-sessions';
import { questions as toolingJavaJs } from './tooling-java-js';
import { questions as webAttacks } from './web-attacks';

export const topics: PvTopic[] = [
  {
    id: 'security-jwt',
    name: 'Security & JWT',
    icon: '🔒',
    questions: [
      ...tokensSessions,
      ...authProtocols,
      ...accessControl,
      ...cryptography,
      ...injectionAttacks,
      ...webAttacks,
      ...toolingJavaJs,
      ...practicesProcess,
    ],
  },
];
