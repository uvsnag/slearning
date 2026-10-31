import type { KmTopic } from '../../types';
import { sentenceBasics } from './basics';
import { grammarInCode } from './code';
import { advancedGrammar } from './expert';
import { commonMistakes } from './mistakes';
import { modifiers } from './modifiers';
import { nounsArticles, pronouns } from './nouns';
import { buildingSentences, punctuation } from './sentences';
import { modals, tenses } from './verbs';
import { techWriting } from './writing';

export const englishGrammar: KmTopic = {
  id: 'english-grammar',
  name: 'English Grammar',
  icon: '📝',
  description:
    'English grammar for developers — from your first sentence to clear commits, docs and code reviews.',
  root: {
    title: 'English Grammar',
    level: 'beginner',
    summary:
      'The rules for putting English words together so people understand you clearly and quickly.',
    simple:
      "Grammar is the syntax of a human language. You don't need to be perfect, but like code, small errors can change the meaning — and clean writing gets you trusted faster.",
    points: [
      'Branches go from sentence basics to advanced style — use Next to walk the path.',
      'Badge colors show the level: Beginner → Intermediate → Advanced → Expert.',
      'Examples use real developer situations: commits, PRs, docs, chat and code names.',
    ],
    children: [
      sentenceBasics,
      nounsArticles,
      pronouns,
      tenses,
      modals,
      modifiers,
      buildingSentences,
      punctuation,
      commonMistakes,
      grammarInCode,
      techWriting,
      advancedGrammar,
    ],
  },
};
