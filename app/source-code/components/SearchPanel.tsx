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

/** Simple full-text search across the virtual workspace. */
export default function SearchPanel({ files, onOpenFile }: SearchPanelProps) {
  const [query, setQuery] = useState('');

  const results = useMemo<SearchHit[]>(() => {
    const q = query.trim().toLowerCase();
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
  }, [files, query]);

  const totalMatches = results.reduce((n, r) => n + Math.max(r.lines.length, 1), 0);

  return (
    <div className="cs-search">
      <input
        type="text"
        className="cs-search-input"
        placeholder="Search (e.g. outbox, @KafkaListener)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        spellCheck={false}
      />
      {query.trim().length >= 2 && (
        <div className="cs-search-count">
          {totalMatches} result{totalMatches === 1 ? '' : 's'} in {results.length} file
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
