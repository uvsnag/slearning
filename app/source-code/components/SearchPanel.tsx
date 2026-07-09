'use client';

import React, { useMemo, useState } from 'react';
import { FlatFile } from '../types';
import { FileBadge } from './icons';

interface SearchPanelProps {
  files: FlatFile[];
  onOpenFile: (path: string) => void;
}

interface SearchHit {
  path: string;
  language: string;
  lines: { lineNo: number; text: string; start: number; length: number }[];
}

const MAX_HITS_PER_FILE = 5;
const MAX_FILES = 50;
const MAX_CLASS_HITS = 300;

/**
 * Matches a type declaration and captures its name. Covers the languages that
 * show up across the studio projects: Java/Kotlin/Scala (class, interface,
 * enum, record, @interface, trait, object) and TS/JS (class). Optional
 * modifiers (public, abstract, export, …) are skipped before the keyword.
 */
const CLASS_DECL =
  /\b(?:class|interface|enum|record|@interface|trait|object)\s+([A-Za-z_$][\w$]*)/;

/** Simple full-text search across the virtual workspace, with a classes-only mode. */
export default function SearchPanel({ files, onOpenFile }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [classesOnly, setClassesOnly] = useState(false);

  const results = useMemo<SearchHit[]>(() => {
    const q = query.trim().toLowerCase();

    // ── Classes-only: a symbol search that returns only type declarations. ──
    // With an empty query it lists every class in the project (a symbol
    // browser); with a query it filters by declared type name.
    if (classesOnly) {
      const hits: SearchHit[] = [];
      let total = 0;
      for (const { path, file } of files) {
        const lines: SearchHit['lines'] = [];
        const contentLines = file.content.split('\n');
        for (let i = 0; i < contentLines.length && total < MAX_CLASS_HITS; i++) {
          const match = CLASS_DECL.exec(contentLines[i]);
          if (!match) continue;
          const name = match[1];
          if (q && !name.toLowerCase().includes(q)) continue;
          const start = contentLines[i].indexOf(name, match.index);
          lines.push({ lineNo: i + 1, text: contentLines[i], start, length: name.length });
          total++;
        }
        if (lines.length > 0) hits.push({ path, language: file.language, lines });
      }
      return hits;
    }

    // ── Default: full-text search. ──
    if (q.length < 2) return [];
    const hits: SearchHit[] = [];
    for (const { path, file } of files) {
      const lines: SearchHit['lines'] = [];
      const contentLines = file.content.split('\n');
      for (let i = 0; i < contentLines.length && lines.length < MAX_HITS_PER_FILE; i++) {
        const idx = contentLines[i].toLowerCase().indexOf(q);
        if (idx === -1) continue;
        lines.push({ lineNo: i + 1, text: contentLines[i], start: idx, length: q.length });
      }
      if (lines.length > 0 || path.toLowerCase().includes(q)) {
        hits.push({ path, language: file.language, lines });
        if (hits.length >= MAX_FILES) break;
      }
    }
    return hits;
  }, [files, query, classesOnly]);

  const totalMatches = results.reduce((n, r) => n + Math.max(r.lines.length, 1), 0);
  const showCount = classesOnly || query.trim().length >= 2;
  const noun = classesOnly
    ? `class${totalMatches === 1 ? '' : 'es'}`
    : `result${totalMatches === 1 ? '' : 's'}`;

  return (
    <div className="cs-search">
      <input
        type="text"
        className="cs-search-input"
        placeholder={classesOnly ? 'Filter classes by name (e.g. Health)' : 'Search (e.g. outbox, @KafkaListener)'}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        spellCheck={false}
      />
      <label className="cs-search-toggle" title="Search only class / interface / enum declarations">
        <input
          type="checkbox"
          checked={classesOnly}
          onChange={(e) => setClassesOnly(e.target.checked)}
        />
        <span>Classes only</span>
      </label>
      {showCount && (
        <div className="cs-search-count">
          {totalMatches} {noun} in {results.length} file
          {results.length === 1 ? '' : 's'}
        </div>
      )}
      <div className="cs-search-results">
        {results.map((hit) => (
          <div key={hit.path} className="cs-search-file">
            <button
              type="button"
              className="cs-tree-row"
              title={hit.path}
              onClick={() => onOpenFile(hit.path)}
            >
              <FileBadge language={hit.language} />
              <span className="cs-tree-label">{hit.path.split('/').pop()}</span>
              <span className="cs-tree-hint">{hit.lines.length || 1}</span>
            </button>
            {hit.lines.map((line) => (
              <button
                key={line.lineNo}
                type="button"
                className="cs-search-line"
                onClick={() => onOpenFile(hit.path)}
              >
                <span className="cs-search-lineno">{line.lineNo}</span>
                <span className="cs-search-text" translate="no">
                  {line.text.slice(Math.max(0, line.start - 24), line.start)}
                  <mark>{line.text.substr(line.start, line.length)}</mark>
                  {line.text.slice(line.start + line.length, line.start + line.length + 64)}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
