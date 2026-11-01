import type { KmTopic } from '../../types';
import overview from '../../image/junit&mochito.png';
import { advancedJunit } from './advanced-junit';
import { bestPractices } from './best-practices';
import { fundamentals } from './fundamentals';
import { internals } from './internals';
import { advancedMockito, mockitoBasics } from './mockito';
import { parameterized } from './parameterized';
import { setup } from './setup';
import { springTesting } from './spring';
import { assertions, writingTests } from './writing';

export const junitMockito: KmTopic = {
  id: 'junit-mockito',
  name: 'JUnit 5 & Mockito',
  icon: '🧪',
  description:
    'Unit testing in Java — from your first @Test to mocks, Spring test slices and how the tools work inside.',
  image: {
    src: overview.src,
    alt: 'JUnit 5 and Mockito overview: a test class with @Mock and @InjectMocks follows Arrange, Act, Assert, then the JUnit runner reports pass or fail',
    caption:
      'Note: the diagram calls JUnit 5 an "Assertion Framework" — it is a full testing framework (it finds, runs and reports tests; assertions are one part). The title is also garbled ("Working Together Java").',
  },
  root: {
    title: 'JUnit 5 & Mockito',
    level: 'beginner',
    summary:
      'JUnit runs your Java tests and checks results; Mockito fakes the dependencies so you can test one class alone.',
    simple:
      'JUnit is the referee who runs each check and keeps score. Mockito hands you stunt doubles, so you can test one actor without hiring the whole cast.',
    points: [
      'The branches follow a learning path: start at Testing Basics, end at Internals.',
      'Badge colors show the level: Beginner → Intermediate → Advanced → Expert.',
      'Click "Next" in the panel to walk through every concept in order.',
    ],
    children: [
      fundamentals,
      setup,
      writingTests,
      assertions,
      parameterized,
      advancedJunit,
      mockitoBasics,
      advancedMockito,
      springTesting,
      bestPractices,
      internals,
    ],
  },
};
