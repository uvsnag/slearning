'use client';

import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import {
  CodeFile,
  DbConnection,
  DbTable,
  StudioProject,
  collectFolderPaths,
  findFile,
  flattenFiles,
} from '../types';
import CodeViewer from './CodeViewer';
import DatabaseExplorer, { tableKey } from './DatabaseExplorer';
import FileTree from './FileTree';
import SearchPanel from './SearchPanel';
import TableViewer from './TableViewer';
import {
  BranchIcon,
  CloseIcon,
  CollapseAllIcon,
  DatabaseIcon,
  ExpandAllIcon,
  FileBadge,
  FilesIcon,
  GearIcon,
  SearchIcon,
  TableIcon,
} from './icons';
import './code-studio.css';

type SideView = 'explorer' | 'search' | 'database';

type StudioTab =
  | { id: string; kind: 'file'; path: string }
  | { id: string; kind: 'table'; connection: string; schema: string; table: string };

const VIEW_TITLES: Record<SideView, string> = {
  explorer: 'Explorer',
  search: 'Search',
  database: 'Database',
};

function fileTab(path: string): StudioTab {
  return { id: `file:${path}`, kind: 'file', path };
}

function dbTab(connection: string, schema: string, table: string): StudioTab {
  return {
    id: `table:${tableKey(connection, schema, table)}`,
    kind: 'table',
    connection,
    schema,
    table,
  };
}

/**
 * The VS Code simulation shell: activity bar, sidebar (explorer / search /
 * database), tabbed read-only editor, breadcrumbs and status bar.
 * Fully data-driven via `project` so new demo projects plug in with no UI work.
 */
export default function CodeStudio({ project }: { project: StudioProject }) {
  const allFiles = useMemo(() => flattenFiles(project.root), [project.root]);
  const allFolderPaths = useMemo(() => collectFolderPaths(project.root), [project.root]);

  const initialTabs = useMemo(() => {
    const paths = (project.defaultOpenPaths ?? []).filter((p) => findFile(project.root, p));
    return paths.map(fileTab);
  }, [project]);

  const [activeView, setActiveView] = useState<SideView>('explorer');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tabs, setTabs] = useState<StudioTab[]>(initialTabs);
  const [activeTabId, setActiveTabId] = useState<string | null>(initialTabs[0]?.id ?? null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    () => new Set(allFolderPaths),
  );
  const [expandedDb, setExpandedDb] = useState<Set<string>>(() => {
    const keys = new Set<string>();
    for (const conn of project.databases) {
      keys.add(`conn:${conn.name}`);
      for (const schema of conn.schemas) keys.add(`conn:${conn.name}/${schema.name}`);
    }
    return keys;
  });

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? null;

  const openTab = (tab: StudioTab) => {
    setTabs((prev) => (prev.some((t) => t.id === tab.id) ? prev : [...prev, tab]));
    setActiveTabId(tab.id);
  };

  const closeTab = (id: string) => {
    setTabs((prev) => {
      const idx = prev.findIndex((t) => t.id === id);
      const next = prev.filter((t) => t.id !== id);
      if (activeTabId === id) {
        setActiveTabId(next.length > 0 ? next[Math.max(0, idx - 1)].id : null);
      }
      return next;
    });
  };

  const selectView = (view: SideView) => {
    if (view === activeView) setSidebarOpen((open) => !open);
    else {
      setActiveView(view);
      setSidebarOpen(true);
    }
  };

  const toggleSetKey = (set: Set<string>, key: string) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  };

  const expandFolders = (paths: string[]) =>
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      for (const p of paths) next.add(p);
      return next;
    });

  /* ----- resolve active tab content ----- */
  let activeFile: CodeFile | undefined;
  let activeDb: { connection: DbConnection; table: DbTable; schema: string } | undefined;
  if (activeTab?.kind === 'file') {
    activeFile = findFile(project.root, activeTab.path);
  } else if (activeTab?.kind === 'table') {
    const connection = project.databases.find((c) => c.name === activeTab.connection);
    const schema = connection?.schemas.find((s) => s.name === activeTab.schema);
    const table = schema?.tables.find((t) => t.name === activeTab.table);
    if (connection && schema && table) activeDb = { connection, table, schema: schema.name };
  }

  const breadcrumbs =
    activeTab?.kind === 'file'
      ? activeTab.path.split('/')
      : activeTab?.kind === 'table'
        ? [activeTab.connection, activeTab.schema, activeTab.table]
        : [];

  return (
    <div className="cs-root" data-view={activeView}>
      {/* ---------- title bar ---------- */}
      <div className="cs-titlebar">
        <span className="cs-dots" aria-hidden="true">
          {/* <i className="cs-dot cs-dot-r" />
          <i className="cs-dot cs-dot-y" />
          <i className="cs-dot cs-dot-g" /> */}
        </span>
        <span className="cs-titlebar-text">{project.name} — Code Studio</span>
        <Link href="/source-code" className="cs-titlebar-back">
          ⌂ All projects
        </Link>
      </div>

      <div className="cs-main">
        {/* ---------- activity bar ---------- */}
        <div className="cs-activitybar" role="toolbar" aria-label="Views">
          <button
            type="button"
            className={activeView === 'explorer' && sidebarOpen ? 'cs-activity-active' : ''}
            title="Explorer"
            onClick={() => selectView('explorer')}
          >
            <FilesIcon />
          </button>
          <button
            type="button"
            className={activeView === 'search' && sidebarOpen ? 'cs-activity-active' : ''}
            title="Search"
            onClick={() => selectView('search')}
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            className={activeView === 'database' && sidebarOpen ? 'cs-activity-active' : ''}
            title="Database"
            onClick={() => selectView('database')}
          >
            <DatabaseIcon />
          </button>
          <div className="cs-activity-spacer" />
          <button type="button" title="Settings (decorative)" className="cs-activity-dim">
            <GearIcon />
          </button>
        </div>

        {/* ---------- sidebar ---------- */}
        {sidebarOpen && (
          <div className="cs-sidebar">
            <div className="cs-sidebar-header">
              <span>{VIEW_TITLES[activeView]}</span>
              {activeView === 'explorer' && (
                <span className="cs-sidebar-actions">
                  <button
                    type="button"
                    title="Collapse folders"
                    onClick={() => setExpandedFolders(new Set())}
                  >
                    <CollapseAllIcon />
                  </button>
                  <button
                    type="button"
                    title="Expand all folders"
                    onClick={() => setExpandedFolders(new Set(allFolderPaths))}
                  >
                    <ExpandAllIcon />
                  </button>
                </span>
              )}
            </div>
            {activeView === 'explorer' && (
              <>
                <div className="cs-sidebar-section">{project.id}</div>
                <div className="cs-sidebar-body">
                  <FileTree
                    nodes={project.root}
                    expanded={expandedFolders}
                    activePath={activeTab?.kind === 'file' ? activeTab.path : undefined}
                    onToggleFolder={(path) =>
                      setExpandedFolders((prev) => toggleSetKey(prev, path))
                    }
                    onOpenFile={(path) => openTab(fileTab(path))}
                    onExpandFolders={expandFolders}
                  />
                </div>
              </>
            )}
            {activeView === 'search' && (
              <div className="cs-sidebar-body">
                <SearchPanel files={allFiles} onOpenFile={(path) => openTab(fileTab(path))} />
              </div>
            )}
            {activeView === 'database' && (
              <div className="cs-sidebar-body">
                <DatabaseExplorer
                  connections={project.databases}
                  expanded={expandedDb}
                  activeTableKey={
                    activeTab?.kind === 'table'
                      ? tableKey(activeTab.connection, activeTab.schema, activeTab.table)
                      : undefined
                  }
                  onToggle={(key) => setExpandedDb((prev) => toggleSetKey(prev, key))}
                  onOpenTable={(conn, schema, table) => openTab(dbTab(conn, schema, table))}
                />
              </div>
            )}
          </div>
        )}

        {/* ---------- editor area ---------- */}
        <div className="cs-editor-area">
          {tabs.length > 0 && (
            <div className="cs-tabbar" role="tablist">
              {tabs.map((tab) => {
                const isActive = tab.id === activeTabId;
                const label = tab.kind === 'file' ? tab.path.split('/').pop()! : tab.table;
                return (
                  <div
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    tabIndex={0}
                    className={`cs-tab ${isActive ? 'cs-tab-active' : ''}`}
                    title={tab.kind === 'file' ? tab.path : tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    onKeyDown={(e) => e.key === 'Enter' && setActiveTabId(tab.id)}
                  >
                    {tab.kind === 'file' ? (
                      <FileBadge
                        language={findFile(project.root, tab.path)?.language ?? 'plaintext'}
                      />
                    ) : (
                      <span className="cs-table-icon">
                        <TableIcon />
                      </span>
                    )}
                    <span className="cs-tab-label">{label}</span>
                    <button
                      type="button"
                      className="cs-tab-close"
                      aria-label={`Close ${label}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(tab.id);
                      }}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {breadcrumbs.length > 0 && (
            <div className="cs-breadcrumbs">
              {breadcrumbs.map((part, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="cs-breadcrumb-sep">›</span>}
                  <span>{part}</span>
                </React.Fragment>
              ))}
            </div>
          )}

          {activeFile ? (
            <CodeViewer file={activeFile} />
          ) : activeDb ? (
            <TableViewer
              connection={activeDb.connection}
              schemaName={activeDb.schema}
              table={activeDb.table}
            />
          ) : (
            <div className="cs-welcome">
              <div className="cs-welcome-logo" aria-hidden="true">
                {'{ }'}
              </div>
              <h2>{project.name}</h2>
              <p>{project.description}</p>
              <div className="cs-welcome-actions">
                {(project.defaultOpenPaths ?? []).slice(0, 3).map((path) => (
                  <button key={path} type="button" onClick={() => openTab(fileTab(path))}>
                    Open {path.split('/').pop()}
                  </button>
                ))}
              </div>
              <p className="cs-welcome-hint">
                Browse files in the Explorer, or open the Database view to inspect tables.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ---------- status bar ---------- */}
      <div className="cs-statusbar">
        <span className="cs-status-item cs-status-branch">
          <BranchIcon /> main
        </span>
        <span className="cs-status-item">✓ read-only simulation</span>
        <span className="cs-status-spacer" />
        {activeFile && (
          <>
            <span className="cs-status-item">
              {activeFile.content.replace(/\n$/, '').split('\n').length} lines
            </span>
            <span className="cs-status-item">UTF-8</span>
            <span className="cs-status-item cs-status-lang">{activeFile.language}</span>
          </>
        )}
        {activeDb && (
          <>
            <span className="cs-status-item">{activeDb.table.rows.length} rows</span>
            <span className="cs-status-item cs-status-lang">{activeDb.connection.engine}</span>
          </>
        )}
      </div>
    </div>
  );
}
