'use client';

import React, { useMemo } from 'react';
import { CodeFile } from '../types';
import { highlightContent } from './highlight';

interface CodeEditorProps {
  file: CodeFile;
  value: string;
  onChange: (value: string) => void;
  onRun?: () => void;
  onFormat?: () => void;
}

/**
 * Editable editor pane for playground projects: the syntax-highlighted lines
 * render underneath a transparent textarea (same font metrics), so typing
 * looks like editing highlighted code. Ctrl/Cmd+Enter triggers `onRun`,
 * Shift+Alt+F (the VS Code binding) triggers `onFormat`.
 */
export default function CodeEditor({ file, value, onChange, onRun, onFormat }: CodeEditorProps) {
  const lines = useMemo(() => highlightContent(value, file.language), [value, file.language]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onRun?.();
      return;
    }
    if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      onFormat?.();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const el = e.currentTarget;
      const { selectionStart, selectionEnd } = el;
      onChange(value.slice(0, selectionStart) + '  ' + value.slice(selectionEnd));
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = selectionStart + 2;
      });
    }
  };

  return (
    <div className="cs-editor-scroll">
      <div className="cs-code cs-code-editable" translate="no">
        {lines.map((segments, i) => (
          <div className="cs-code-line" key={i}>
            <span className="cs-line-no">{i + 1}</span>
            <span className="cs-line-text">{segments.length > 0 ? segments : ' '}</span>
          </div>
        ))}
        <textarea
          className="cs-edit-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          wrap="off"
          aria-label={`Edit ${file.name}`}
        />
      </div>
    </div>
  );
}
