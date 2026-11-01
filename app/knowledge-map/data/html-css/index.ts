import type { KmTopic } from '../../types';
import { accessibility } from './accessibility';
import { cssArchitecture } from './architecture';
import { boxModel } from './box-model';
import { cssBasics } from './css-basics';
import { forms } from './forms';
import { htmlBasics } from './html-basics';
import { layout } from './css-layout';
import { modernCss } from './modern';
import { rendering } from './rendering';
import { responsive } from './responsive';
import { semanticHtml } from './semantic';
import { visualStyling } from './styling';

export const htmlCss: KmTopic = {
  id: 'html-css',
  name: 'HTML & CSS',
  icon: '🎨',
  description:
    'Building and styling web pages — from your first tag to modern layout, responsive design and rendering internals.',
  root: {
    title: 'HTML & CSS',
    level: 'beginner',
    summary:
      'The two languages of every web page: HTML for structure and meaning, CSS for looks and layout.',
    simple:
      'HTML is the house: walls, rooms, doors. CSS is the interior design: paint, furniture, lighting. Same house, many possible looks.',
    points: [
      'The branches follow a learning path: start at HTML Basics, end at Rendering and Performance.',
      'Badge colors show the level: Beginner → Intermediate → Advanced → Expert.',
      'Click "Next" in the panel to walk through every concept in order.',
    ],
    children: [
      htmlBasics,
      semanticHtml,
      forms,
      accessibility,
      cssBasics,
      boxModel,
      layout,
      responsive,
      visualStyling,
      modernCss,
      cssArchitecture,
      rendering,
    ],
  },
};
