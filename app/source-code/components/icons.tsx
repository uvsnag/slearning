import React from 'react';

/** Minimal codicon-style SVG icons for the Code Studio chrome. */

interface IconProps {
  size?: number;
}

export function FilesIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M17.5 0h-9L7 1.5V6H2.5L1 7.5v15.07L2.5 24h12.07L16 22.57V18h4.7l1.3-1.43V4.5L17.5 0zm0 2.12l2.38 2.38H17.5V2.12zm-3 20.38h-12v-15H7v9.07L8.5 18h6v4.5zm6-6h-12v-15H16V6h4.5v10.5z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SearchIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15.25 0a8.25 8.25 0 0 0-6.18 13.72L1 22.88l1.12 1 8.05-9.12A8.251 8.251 0 1 0 15.25.01V0zm0 15a6.75 6.75 0 1 1 0-13.5 6.75 6.75 0 0 1 0 13.5z"
        fill="currentColor"
      />
    </svg>
  );
}

export function DatabaseIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 1C7 1 3 2.6 3 4.5v15C3 21.4 7 23 12 23s9-1.6 9-3.5v-15C21 2.6 17 1 12 1zm7 18.4c-.5.9-3.2 2.1-7 2.1s-6.5-1.2-7-2.1v-4.1c1.6 1 4.2 1.7 7 1.7s5.4-.6 7-1.7v4.1zm0-6.5c-.5.9-3.2 2.1-7 2.1s-6.5-1.2-7-2.1V8.8c1.6 1 4.2 1.7 7 1.7s5.4-.6 7-1.7v4.1zM12 9C8.2 9 5.5 7.8 5 6.9V4.6C5.4 3.7 8.2 2.5 12 2.5s6.6 1.2 7 2.1v2.3C18.5 7.8 15.8 9 12 9z"
        fill="currentColor"
      />
    </svg>
  );
}

export function GearIcon({ size = 22 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M19.85 8.75l4.15.83v4.84l-4.15.83 2.35 3.52-3.43 3.43-3.52-2.35-.83 4.15H9.58l-.83-4.15-3.52 2.35-3.43-3.43 2.35-3.52L0 14.42V9.58l4.15-.83L1.8 5.23 5.23 1.8l3.52 2.35L9.58 0h4.84l.83 4.15 3.52-2.35 3.43 3.43-2.35 3.52zm-1.57 5.07l3-.6v-2.44l-3-.6-.6-1.75 1.7-2.55-1.73-1.73-2.55 1.7-1.75-.6-.6-3h-2.5l-.6 3-1.75.6-2.55-1.7-1.73 1.73 1.7 2.55-.6 1.75-3 .6v2.44l3 .6.6 1.75-1.7 2.55 1.73 1.73 2.55-1.7 1.75.6.6 3h2.44l.6-3 1.75-.6 2.55 1.7 1.73-1.73-1.7-2.55.66-1.75zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"
        fill="currentColor"
      />
    </svg>
  );
}

export function BranchIcon({ size = 13 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M11.75 2.5a2.25 2.25 0 0 0-.75 4.372v.878a.75.75 0 0 1-.75.75h-4.5A2.25 2.25 0 0 0 4 8.872V6.622a2.25 2.25 0 1 0-1.5 0v5.756a2.25 2.25 0 1 0 1.5 0v-.128c.235.083.487.128.75.128h4.5A2.25 2.25 0 0 0 11.5 10.5v-.878a2.25 2.25 0 0 0 .25-7.122zM2.5 4.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0zm1.5 10.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0zm7.75-9.25a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={`cs-chevron ${open ? 'cs-chevron-open' : ''}`}
    >
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function CloseIcon({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function CollapseAllIcon({ size = 15 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M9 9H4v1h5V9zM7 6H4v1h3V6zM4 12h7v1H4v-1zM13 2H2v12h1V3h10v11h1V2h-1z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TableIcon({ size = 14 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M1 2v12h14V2H1zm13 4H8V3h6v3zM7 3v3H2V3h5zM2 7h5v3H2V7zm6 0h6v3H8V7zm-6 6v-2h5v2H2zm6 0v-2h6v2H8z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Colored file "icon" — a letter chip, like Seti-theme glyphs. */
const FILE_BADGES: Record<string, { text: string; color: string }> = {
  java: { text: 'J', color: '#e76f00' },
  xml: { text: '</>', color: '#e37933' },
  yaml: { text: 'Y', color: '#a074c4' },
  sql: { text: 'db', color: '#4ec9b0' },
  json: { text: '{}', color: '#cbcb41' },
  properties: { text: '⚙', color: '#9cdcfe' },
  markdown: { text: 'M↓', color: '#519aba' },
  dockerfile: { text: '🐳', color: '#519aba' },
  shell: { text: '$', color: '#89e051' },
  javascript: { text: 'JS', color: '#cbcb41' },
  css: { text: '#', color: '#519aba' },
  html: { text: '<>', color: '#e37933' },
  plaintext: { text: '≡', color: '#8a8a8a' },
};

export function FileBadge({ language }: { language: string }) {
  const badge = FILE_BADGES[language] ?? FILE_BADGES.plaintext;
  return (
    <span className="cs-file-badge" style={{ color: badge.color }} aria-hidden="true">
      {badge.text}
    </span>
  );
}

const ENGINE_BADGES: Record<string, { text: string; color: string }> = {
  PostgreSQL: { text: '🐘', color: '#336791' },
  MySQL: { text: '🐬', color: '#00758f' },
  Oracle: { text: 'O', color: '#f80000' },
  Redis: { text: '◆', color: '#d82c20' },
  MongoDB: { text: '🍃', color: '#4faa41' },
};

export function EngineBadge({ engine }: { engine: string }) {
  const badge = ENGINE_BADGES[engine] ?? { text: '◈', color: '#888' };
  return (
    <span className="cs-file-badge" style={{ color: badge.color }} aria-hidden="true">
      {badge.text}
    </span>
  );
}
