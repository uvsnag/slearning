/** How deep a concept goes — drives the colored level badge and the level filter. */
export type KmLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export const KM_LEVELS: KmLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];

export interface KmNode {
  title: string;
  level: KmLevel;
  /** One line shown under the title in the detail panel and as the node tooltip. */
  summary: string;
  /** Plain-language explanation / analogy for beginners. */
  simple?: string;
  /** Short scannable bullet points. */
  points?: string[];
  /** Longer explanation as HTML (authored in this repo, rendered verbatim). */
  detail?: string;
  /** Interview tip, pitfall or expert note. */
  tip?: string;
  children?: KmNode[];
}

export interface KmTopic {
  id: string;
  name: string;
  icon: string;
  description: string;
  /** Optional overview picture, shown on the root node and via the toolbar. */
  image?: KmImage;
  root: KmNode;
}

export interface KmImage {
  /** URL from a static import (`import img from '../../image/x.png'` → `img.src`). */
  src: string;
  alt: string;
  caption?: string;
}
