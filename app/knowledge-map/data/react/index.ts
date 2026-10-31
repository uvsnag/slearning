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
    alt: 'React overview: JSX source is built and bundled, React reconciles a virtual DOM tree with props and state, a scheduler prioritizes updates, and the app runs as SPA, CSR, SSR or SSG',
    caption:
      'Note: a rough sketch with some garbled labels. Today: new apps start with Vite or a framework (not Webpack/Create React App), function components with hooks replace class "lifecycle" methods, and Server Components are missing from the picture.',
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
