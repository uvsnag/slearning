'use client';

import Link from 'next/link';
import React from 'react';
import { STUDIO_PROJECTS } from './registry';
import { flattenFiles } from './types';
import './source-code-hub.css';

/**
 * Source Code Example hub — lists the demo projects that open in the
 * Code Studio (the in-browser VS Code + database IDE simulation).
 */
const SourceCodeHub = () => {
  return (
    <div className="ui-page">
      <div className="ui-page-shell">
        <h1 className="ui-title">Source Code Examples</h1>
        <p className="ui-subtitle">
          Real-world reference projects you can read right here — no IDE needed. Each project opens
          in a simulated VS Code with an integrated database explorer.
        </p>

        <div className="sc-hub-grid">
          {STUDIO_PROJECTS.map((project) => {
            const fileCount = flattenFiles(project.root).length;
            const tableCount = project.databases.reduce(
              (n, conn) => n + conn.schemas.reduce((m, s) => m + s.tables.length, 0),
              0,
            );
            return (
              <section className="ui-panel sc-card" key={project.id}>
                <h2 className="sc-card-title">{project.name}</h2>
                <p className="sc-card-desc">{project.description}</p>
                <div className="sc-card-tags">
                  {project.tags.map((tag) => (
                    <span className="sc-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="sc-card-meta">
                  <span>📄 {fileCount} files</span>
                  <span>🗄 {tableCount} tables</span>
                  <span>🔌 {project.databases.length} connections</span>
                </div>
                <div className="sc-card-actions">
                  <Link className="sc-open-btn" href={`/source-code/${project.id}`}>
                    Open in Code Studio →
                  </Link>
                </div>
              </section>
            );
          })}
        </div>

        <div className="sc-hub-note">
          Want another example here? New projects are plain data: add a folder under{' '}
          <code>app/source-code/projects/</code> and register it in <code>registry.ts</code> — the
          studio UI, search and database explorer come for free.
        </div>
      </div>
    </div>
  );
};

export default SourceCodeHub;
