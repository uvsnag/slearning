'use client';

import React, { useEffect, useRef } from 'react';
import { RunLog } from '../runner';
import { CloseIcon } from './icons';

interface RunConsoleProps {
  lines: RunLog[];
  running: boolean;
  onClear: () => void;
  onClose: () => void;
}

/** Bottom output panel showing the streamed logs of the last ▶ Run. */
export default function RunConsole({ lines, running, onClear, onClose }: RunConsoleProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, running]);

  return (
    <div className="cs-console">
      <div className="cs-console-header">
        <span className="cs-console-title">Output</span>
        {running && <span className="cs-console-running">● running…</span>}
        <span className="cs-console-spacer" />
        <button type="button" onClick={onClear}>
          Clear
        </button>
        <button type="button" aria-label="Close output panel" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      <div className="cs-console-body" ref={bodyRef}>
        {lines.length === 0 ? (
          <div className="cs-console-line cs-console-system">
            Press ▶ Run (or Ctrl+Enter in the editor) to execute the active file.
          </div>
        ) : (
          lines.map((line, i) => (
            <div key={i} className={`cs-console-line cs-console-${line.level}`}>
              {line.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
