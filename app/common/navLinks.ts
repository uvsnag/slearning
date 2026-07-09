export interface NavLink {
  href: string;
  label: string;
}

export interface NavSection {
  title: string;
  links: NavLink[];
}

const DASHBOARD_LINKS: NavLink[] = [
  { href: '/dash-board2', label: 'AI Only' },
  { href: '/youtube-sub', label: 'YT' },
];

const SINGLE_PRACT_LINKS: NavLink[] = [
  { href: '/practice-word', label: 'Word (Meaning)' },
  { href: '/listen', label: 'Word (Listen)' },
  { href: '/next-sentence', label: 'Sentence' },
  { href: '/listen-mp3', label: 'Listen MP3' },
  { href: '/store-editor', label: 'Store Editor' },
];

const MOBILE_LINKS: NavLink[] = [
  { href: '/mobile/speak-ai', label: 'Speak AI' },
  { href: '/mobile/youtube-sub', label: 'Listen Board' },
];

const SOURCE_CODE_LINKS: NavLink[] = [
  { href: '/source-code', label: 'All Projects' },
  { href: '/source-code/java-microservice', label: 'Java Microservice' },
  { href: '/source-code/microservice-learning', label: 'MS Learning Platform' },
];

const LEGANCY_LINKS: NavLink[] = [
  { href: '/legancy-tools/sql-compile-ck', label: 'SQL Compile' },
  { href: '/legancy-tools/sql-process-ck', label: 'SQL Process' },
  { href: '/legancy-tools/json-process', label: 'Json Process' },
  { href: '/legancy-tools/replace-process', label: 'Replace Process' },
  { href: '/inteview/pv.html', label: 'PV' },
];

export const NAV_SECTIONS: NavSection[] = [
  { title: 'Dash Board', links: DASHBOARD_LINKS },
  { title: 'Single Practice', links: SINGLE_PRACT_LINKS },
  { title: 'Mobile', links: MOBILE_LINKS },
  { title: 'Source Code Example', links: SOURCE_CODE_LINKS },
  { title: 'Legancy', links: LEGANCY_LINKS },
];
