'use client';

import React, { useMemo } from 'react';
import { CodeFile } from '../types';
import { highlightContent } from './highlight';

interface CodeViewerProps {
  file: CodeFile;
}

/** Read-only editor pane: line-number gutter + syntax-highlighted content. */
export default function CodeViewer({ file }: CodeViewerProps) {
  const lines = useMemo(
    () => highlightContent(file.content, file.language),
    [file.content, file.language],
  );

  return (
    <div className="cs-editor-scroll">
      <div className="cs-code" translate="no">
        {lines.map((segments, i) => (
          <div className="cs-code-line" key={i}>
            <span className="cs-line-no">{i + 1}</span>
            <span className="cs-line-text">{segments.length > 0 ? segments : ' '}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
