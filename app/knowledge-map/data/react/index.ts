import type { KmTopic } from '../../types';
import overview from '../../image/reactjs.png';
import { basics } from './basics';
import { components } from './components';
import { dataRouting } from './data-routing';
import { effectsRefs } from './effects-refs';
import { hooks } from './hooks';
import { modernReact } from './modern';
import { perf } from './performance';
import { quality } from './quality';
import { renderingModel } from './rendering-model';
import { server } from './server';
import { stateEvents } from './state-events';
import { stateManagement } from './state-management';

export const react: KmTopic = {
  id: 'react',
  name: 'React',
  icon: '⚛️',
  description:
    'Building UIs with React — from your first component to hooks, rendering internals, React 19 and Server Components.',
  image: {
    src: overview.src,
    alt: 'React overview (Vietnamese labels): JSX compiles to React.createElement, components get props and keep state, a change creates a new virtual DOM that is diffed with the old one before updating the real DOM; around it: tooling, state management (hooks, Context, Redux), React Router and data fetching',
    caption:
      'Note: today new apps usually start with Vite or a framework like Next.js rather than a hand-made Webpack/Babel setup, and Server Components (React 19) are not shown.',
  },
  root: {
    title: 'React',
    level: 'beginner',
    summary:
      'A JavaScript library for building user interfaces from components that re-render when their data changes.',
    simple:
      'You describe what the screen should look like for the current data, and React keeps the real page in sync whenever that data changes. Like a spreadsheet: change a cell and every formula that uses it updates by itself.',
    points: [
      'Branches go from the basics to expert topics — follow them in order or use Next.',
      'Badge colors show the level: Beginner → Intermediate → Advanced → Expert.',
      'Code examples are JavaScript + JSX; see the JavaScript topic for the language itself.',
    ],
    children: [
      basics,
      components,
      stateEvents,
      effectsRefs,
      renderingModel,
      hooks,
      stateManagement,
      dataRouting,
      perf,
      modernReact,
      server,
      quality,
    ],
  },
};
