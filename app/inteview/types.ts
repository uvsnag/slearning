export type PvDifficulty = 'easy' | 'medium' | 'hard' | 'tricky';

export interface PvQuestion {
  q: string;
  difficulty: PvDifficulty;
  /** Answer body as HTML (authored in this repo, rendered verbatim). */
  a: string;
}

export interface PvTopic {
  id: string;
  name: string;
  icon: string;
  questions: PvQuestion[];
}

/** A top-level group of topics (Back End / Front End). */
export interface PvPart {
  id: string;
  label: string;
  icon: string;
  topics: PvTopic[];
}
