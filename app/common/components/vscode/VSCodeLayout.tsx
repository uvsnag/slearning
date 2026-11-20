'use client';

import React, {
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { NAV_SECTIONS } from '../../navLinks';
import { setLayoutMode, toggleLayoutMode, useLayoutMode } from '../../layoutMode';
import {
  CodeFile,
  FsNode,
  StudioProject,
  collectFolderPaths,
  file,
  findFile,
  flattenFiles,
  folder,
} from '@/app/source-code/types';
import CodeEditor from '@/app/source-code/components/CodeEditor';
import FileTree from '@/app/source-code/components/FileTree';
import SearchPanel from '@/app/source-code/components/SearchPanel';
import { useResizableSidebar } from '@/app/source-code/components/useResizableSidebar';
import {
  BranchIcon,
  CloseIcon,
  CollapseAllIcon,
  FileBadge,
  FilesIcon,
  GearIcon,
  SearchIcon,
} from '@/app/source-code/components/icons';
import '@/app/source-code/components/code-studio.css';
import './vscode-layout.css';

/* ------------------------------------------------------------------ */
/* Disguise data: the home-page menu becomes a source tree —          */
/* each section is a folder, each link a PascalCase ".tsx" component. */
/* ------------------------------------------------------------------ */

const WORKSPACE = 'web-portal';
const NORMAL_TITLE = 'SLearning';
const NORMAL_ICON = '/slearning/logo.png';
const VSC_ICON =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0065a9"/><path d="M12 10l-6 6 6 6M20 10l6 6-6 6" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  );

const slug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const normalizePath = (path: string | null) => {
  if (!path || path === '/') return '/';
  return path.replace(/\/+$/, '') || '/';
};

/** "Word (Meaning)" → "WordMeaning.tsx", "AI Only" → "AiOnly.tsx" */
const componentFileName = (text: string) =>
  `${
    text
      .split(/[^A-Za-z0-9]+/)
      .filter(Boolean)
      .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
      .join('') || 'Index'
  }.tsx`;

const HOME_FILE = 'index.tsx';

const KEY_SIDEBAR_WIDTH = 'sl_vsc_sidebar_width';

/* Split editor: the right group shows another page in a same-origin iframe. */
const KEY_SPLIT_HREF = 'sl_vsc_split_href';
const KEY_SPLIT_RATIO = 'sl_vsc_split_ratio';
const BASE_PATH = '/slearning'; // keep in sync with next.config.ts basePath
const pageUrl = (href: string) => `${BASE_PATH}${href === '/' ? '' : href}/`;
type EditorGroup = 'left' | 'right';

/** True when this app instance is the page inside the split editor's iframe. */
const subscribeNoop = () => () => {};
const isFramed = () => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};
const postToParent = (data: object) => window.parent.postMessage(data, window.location.origin);

function SplitIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="2.5" width="13" height="11" rx="1" stroke="currentColor" />
      <path d="M8 2.5v11" stroke="currentColor" />
    </svg>
  );
}

interface PageEntry {
  href: string;
  path: string;
}

function buildPagesTree() {
  const byHref = new Map<string, PageEntry>();
  const byPath = new Map<string, string>();
  const register = (href: string, path: string) => {
    if (!byHref.has(href)) byHref.set(href, { href, path });
    byPath.set(path, href);
  };

  const sectionFolders = NAV_SECTIONS.map((section) => {
    const sectionName = slug(section.title);
    const seen = new Set<string>();
    const files = section.links.map((link) => {
      let name = componentFileName(link.label);
      for (let n = 2; seen.has(name); n++) name = name.replace(/\d*\.tsx$/, `${n}.tsx`);
      seen.add(name);
      register(link.href, `${sectionName}/${name}`);
      return file(name, '');
    });
    return folder(sectionName, files);
  });
  register('/', HOME_FILE);

  const tree: FsNode[] = [...sectionFolders, file(HOME_FILE, '')];
  return { tree, byHref, byPath };
}

const PAGES = buildPagesTree();

function pageInfo(href: string) {
  const known = PAGES.byHref.get(href);
  const path = known
    ? known.path
    : [
        ...href.split('/').filter(Boolean).slice(0, -1),
        componentFileName(href.split('/').filter(Boolean).pop() ?? ''),
      ].join('/');
  return { path, name: path.split('/').pop()! };
}

/* ------------------------------------------------------------------ */
/* Tabs                                                                 */
/* ------------------------------------------------------------------ */

const pageTabId = (href: string) => `page:${href}`;
const codeTabId = (path: string) => `code:${path}`;
const parseTab = (id: string) =>
  id.startsWith('page:')
    ? ({ kind: 'page', value: id.slice(5) } as const)
    : ({ kind: 'code', value: id.slice(5) } as const);

type SideView = 'explorer' | 'search';

/** Pick the decoy file "boss key" opens: the first Java file the project suggests. */
function defaultDecoyPath(project: StudioProject) {
  const suggested = project.defaultOpenPaths ?? [];
  return (
    suggested.find((p) => p.endsWith('.java')) ??
    flattenFiles(project.root).find((f) => f.path.endsWith('.java'))?.path ??
    suggested[0]
  );
}

interface VSCodeLayoutProps {
  children: ReactNode;
  /** Floating tools (sticky AI boards…) — restyled and hidden by the boss key in VS Code mode. */
  tools?: ReactNode;
}

/**
 * Optional "VS Code" disguise for the whole app. The page tree is kept at the
 * same position whichever mode is active (wrappers become `display: contents`
 * in normal mode), so switching modes never resets page state.
 *
 * Shortcuts: Alt+Shift+V toggles the layout, Alt+Q (boss key) jumps to / away
 * from a real-looking source file.
 */
export default function VSCodeLayout({ children, tools }: VSCodeLayoutProps) {
  const mode = useLayoutMode();
  const router = useRouter();
  const pathname = normalizePath(usePathname());
  // Code Studio project pages already look like VS Code — never double-wrap them.
  const isStudioPage = pathname.startsWith('/source-code/');
  const embedded = useSyncExternalStore(subscribeNoop, isFramed, () => false);
  const vsc = mode === 'vscode' && !isStudioPage && !embedded;

  const [decoy, setDecoy] = useState<StudioProject | null>(null);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [sideView, setSideView] = useState<SideView>('explorer');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarResize = useResizableSidebar(KEY_SIDEBAR_WIDTH);
  const [splitResizing, setResizing] = useState(false);
  const resizing = sidebarResize.resizing || splitResizing;
  // Split editor (right group). `split.n` remounts the iframe when a new page is opened in it.
  const [split, setSplit] = useState<{ src: string; n: number } | null>(null);
  const [splitHref, setSplitHref] = useState('/');
  const [splitRatio, setSplitRatio] = useState(0.5);
  const [activeGroup, setActiveGroup] = useState<EditorGroup>('left');
  const leftGroupRef = useRef<HTMLDivElement>(null);
  const rightGroupRef = useRef<HTMLDivElement>(null);
  const splitFrameRef = useRef<HTMLIFrameElement>(null);
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(collectFolderPaths(PAGES.tree)),
  );
  const [tabs, setTabs] = useState<string[]>(() => [pageTabId(pathname)]);
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [lastPathname, setLastPathname] = useState(pathname);
  const [cursor, setCursor] = useState({ ln: 1, col: 1 });

  // Navigation (explorer click, in-page links, back button) focuses the page tab.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setActiveCode(null);
    if (!tabs.includes(pageTabId(pathname))) setTabs([...tabs, pageTabId(pathname)]);
  }

  // Load the decoy source project lazily (separate chunk) so the boss key always has a file.
  useEffect(() => {
    let alive = true;
    import('@/app/source-code/projects/java-microservice').then((m) => {
      if (alive) setDecoy(m.javaMicroserviceProject);
    });
    return () => {
      alive = false;
    };
  }, []);

  const decoyFiles = useMemo(() => (decoy ? flattenFiles(decoy.root) : []), [decoy]);

  const currentPageTab = pageTabId(pathname);
  const pageVisible = vsc ? activeCode === null && tabs.includes(currentPageTab) : true;
  const activeTabId = activeCode ? codeTabId(activeCode) : pageVisible ? currentPageTab : null;
  const activeCodeFile: CodeFile | undefined =
    activeCode && decoy ? findFile(decoy.root, activeCode) : undefined;

  const openPage = (href: string) => {
    setTabs((prev) => (prev.includes(pageTabId(href)) ? prev : [...prev, pageTabId(href)]));
    setActiveCode(null);
    if (href !== pathname) router.push(href);
  };

  const openCode = (path: string) => {
    setTabs((prev) => (prev.includes(codeTabId(path)) ? prev : [...prev, codeTabId(path)]));
    setActiveCode(path);
  };

  const activateTab = (id: string) => {
    const tab = parseTab(id);
    if (tab.kind === 'page') openPage(tab.value);
    else openCode(tab.value);
  };

  const closeTab = (id: string) => {
    const idx = tabs.indexOf(id);
    const next = tabs.filter((t) => t !== id);
    setTabs(next);
    if (id !== activeTabId) return;
    const neighbor = next[Math.max(0, idx - 1)];
    if (!neighbor) {
      setActiveCode(null);
      return;
    }
    const tab = parseTab(neighbor);
    if (tab.kind === 'code') setActiveCode(tab.value);
    else {
      setActiveCode(null);
      if (tab.value !== pathname) router.push(tab.value);
    }
  };

  /** Boss key: show a source file; press again to come back to the page. */
  const togglePanic = () => {
    if (mode !== 'vscode') {
      setLayoutMode('vscode');
      if (decoy) openCode(defaultDecoyPath(decoy));
      return;
    }
    if (activeCode) {
      setActiveCode(null);
      if (!tabs.includes(currentPageTab)) setTabs([...tabs, currentPageTab]);
    } else if (decoy) {
      const lastCode = [...tabs].reverse().find((t) => t.startsWith('code:'));
      openCode(lastCode ? parseTab(lastCode).value : defaultDecoyPath(decoy));
    }
  };

  // Global shortcuts.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.altKey || e.ctrlKey || e.metaKey) return;
      const key = e.key.toLowerCase();
      if (e.shiftKey && (key === 'v' || e.code === 'KeyV')) {
        e.preventDefault();
        toggleLayoutMode();
      } else if (!e.shiftKey && (key === 'q' || e.code === 'KeyQ')) {
        e.preventDefault();
        // Inside the split iframe the boss key must act on the outer window.
        if (embedded) postToParent({ type: 'vsc-boss' });
        else togglePanic();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  /* ----- split editor ----- */

  const openSplit = (href: string) => {
    setActiveGroup('right');
    localStorage.setItem(KEY_SPLIT_HREF, href);
    if (split && href === splitHref) return;
    setSplit((prev) => ({ src: href, n: (prev?.n ?? 0) + 1 }));
    setSplitHref(href);
  };

  const closeSplit = () => {
    setSplit(null);
    setActiveGroup('left');
    localStorage.removeItem(KEY_SPLIT_HREF);
  };

  // Messages from the page inside the split iframe.
  useEffect(() => {
    if (embedded) return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.source !== splitFrameRef.current?.contentWindow) return;
      const data = e.data as { type?: string; href?: string };
      if (data?.type === 'vsc-embed-nav' && typeof data.href === 'string') {
        setSplitHref(data.href);
        localStorage.setItem(KEY_SPLIT_HREF, data.href);
      } else if (data?.type === 'vsc-embed-focus') {
        setActiveGroup('right');
      } else if (data?.type === 'vsc-boss') {
        togglePanic();
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  });

  // Inside the iframe: report navigation and clicks to the outer window.
  useEffect(() => {
    if (embedded) postToParent({ type: 'vsc-embed-nav', href: pathname });
  }, [embedded, pathname]);
  useEffect(() => {
    if (!embedded) return;
    const onDown = () => postToParent({ type: 'vsc-embed-focus' });
    window.addEventListener('pointerdown', onDown, true);
    return () => window.removeEventListener('pointerdown', onDown, true);
  }, [embedded]);

  /** Drag the line between the two editor groups. */
  const startSplitResize = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const left = leftGroupRef.current?.getBoundingClientRect();
    const right = rightGroupRef.current?.getBoundingClientRect();
    if (!left || !right) return;
    e.preventDefault();
    const total = right.right - left.left;
    let latest = splitRatio;
    setResizing(true);
    const onMove = (ev: PointerEvent) => {
      latest = Math.min(Math.max((ev.clientX - left.left) / total, 0), 1);
      setSplitRatio(latest);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      setResizing(false);
      localStorage.setItem(KEY_SPLIT_RATIO, String(latest));
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const resetSplitRatio = () => {
    setSplitRatio(0.5);
    localStorage.setItem(KEY_SPLIT_RATIO, '0.5');
  };

  // Reveal the page once React has mounted (see LAYOUT_PRELOAD_SCRIPT).
  useEffect(() => {
    document.documentElement.classList.remove('vsc-preload');
    if (isFramed()) return;
    const storedRatio = Number(localStorage.getItem(KEY_SPLIT_RATIO) ?? NaN);
    if (Number.isFinite(storedRatio)) setSplitRatio(Math.min(Math.max(storedRatio, 0), 1));
    const storedSplit = localStorage.getItem(KEY_SPLIT_HREF);
    if (storedSplit) {
      setSplit({ src: storedSplit, n: 1 });
      setSplitHref(storedSplit);
    }
  }, []);


  /* ----- window title + favicon ----- */
  const activeName = activeCode
    ? activeCode.split('/').pop()!
    : pageVisible
      ? pageInfo(pathname).name
      : 'Welcome';
  useEffect(() => {
    const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    document.body.classList.toggle('vsc-body', vsc);
    if (vsc) {
      document.title = `${activeName} - ${WORKSPACE} - Visual Studio Code`;
      if (icon) icon.href = VSC_ICON;
    } else {
      document.title = NORMAL_TITLE;
      if (icon) icon.href = NORMAL_ICON;
    }
  }, [vsc, activeName]);

  const breadcrumbs = activeCode
    ? activeCode.split('/')
    : pageVisible
      ? pageInfo(pathname).path.split('/')
      : [];

  const selectView = (view: SideView) => {
    if (view === sideView) setSidebarOpen((open) => !open);
    else {
      setSideView(view);
      setSidebarOpen(true);
    }
  };

  const onOpenTreeFile = (path: string) => {
    const href = PAGES.byPath.get(path);
    if (!href) openCode(path);
    else if (split && activeGroup === 'right') openSplit(href);
    else openPage(href);
  };

  // The right group is hidden (kept mounted) while a source file is shown — e.g. the boss key.
  const showSplit = vsc && split !== null;
  const splitVisible = showSplit && !activeCode;
  const splitInfo = pageInfo(splitHref);

  if (embedded) {
    // Page inside the split iframe: just the themed page, no chrome / sticky tools.
    return (
      <div className="vsc-root vsc-embed">
        <div className="vsc-content dark-90">{children}</div>
      </div>
    );
  }

  const treeActivePath = activeCode ?? (pageVisible ? PAGES.byHref.get(pathname)?.path : undefined);

  const pass = 'vsc-pass';

  return (
    <div className={vsc ? `vsc-root ${resizing ? 'cs-resizing' : ''}` : pass}>
      {vsc && (
        <div className="vsc-chrome cs-titlebar">
          <span className="vsc-menu">
            {['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </span>
          <span className="cs-titlebar-text">
            {activeName} - {WORKSPACE} - Visual Studio Code
          </span>
          <span className="vsc-menu-spacer" />
        </div>
      )}

      <div className={vsc ? 'cs-main' : pass}>
        {vsc && (
          <div className="vsc-chrome cs-activitybar" role="toolbar" aria-label="Views">
            <button
              type="button"
              className={sideView === 'explorer' && sidebarOpen ? 'cs-activity-active' : ''}
              title="Explorer (Ctrl+Shift+E)"
              onClick={() => selectView('explorer')}
            >
              <FilesIcon />
            </button>
            <button
              type="button"
              className={sideView === 'search' && sidebarOpen ? 'cs-activity-active' : ''}
              title="Search (Ctrl+Shift+F)"
              onClick={() => selectView('search')}
            >
              <SearchIcon />
            </button>
            <button type="button" title="Source Control (Ctrl+Shift+G)" className="cs-activity-dim">
              <BranchIcon size={24} />
            </button>
            <div className="cs-activity-spacer" />
            <button
              type="button"
              title="Manage — switch back to the normal layout (Alt+Shift+V)"
              onClick={() => setLayoutMode('normal')}
            >
              <GearIcon />
            </button>
          </div>
        )}

        {vsc && sidebarOpen && (
          <div className="vsc-chrome cs-sidebar" {...sidebarResize.sidebarProps}>
            <div className="cs-sidebar-resizer" {...sidebarResize.resizerProps} />
            <div className="cs-sidebar-header">
              <span>{sideView === 'explorer' ? 'Explorer' : 'Search'}</span>
              {sideView === 'explorer' && (
                <span className="cs-sidebar-actions">
                  <button
                    type="button"
                    title="Collapse Folders"
                    onClick={() => setExpanded(new Set())}
                  >
                    <CollapseAllIcon />
                  </button>
                </span>
              )}
            </div>
            {sideView === 'explorer' ? (
              <>
                <div className="cs-sidebar-section">{WORKSPACE.toUpperCase()}</div>
                <div className="cs-sidebar-body">
                  <FileTree
                    nodes={PAGES.tree}
                    expanded={expanded}
                    activePath={treeActivePath}
                    onToggleFolder={(path) =>
                      setExpanded((prev) => {
                        const next = new Set(prev);
                        if (next.has(path)) next.delete(path);
                        else next.add(path);
                        return next;
                      })
                    }
                    onOpenFile={onOpenTreeFile}
                    onExpandFolders={(paths) => setExpanded((prev) => new Set([...prev, ...paths]))}
                  />
                </div>
              </>
            ) : (
              <div className="cs-sidebar-body">
                <SearchPanel files={decoyFiles} onOpenFile={openCode} />
              </div>
            )}
          </div>
        )}

        <div
          ref={leftGroupRef}
          className={vsc ? 'cs-editor-area vsc-editor' : pass}
          style={vsc && splitVisible ? { flex: `${splitRatio} 1 0` } : undefined}
          onPointerDownCapture={vsc && showSplit ? () => setActiveGroup('left') : undefined}
        >
          {vsc && tabs.length > 0 && (
            <div
              className={`vsc-chrome cs-tabbar ${
                splitVisible && activeGroup === 'right' ? 'vsc-group-inactive' : ''
              }`}
              role="tablist"
            >
              {tabs.map((id) => {
                const tab = parseTab(id);
                const isActive = id === activeTabId;
                const label =
                  tab.kind === 'page' ? pageInfo(tab.value).name : tab.value.split('/').pop()!;
                const language =
                  tab.kind === 'page'
                    ? 'javascript'
                    : ((decoy && findFile(decoy.root, tab.value)?.language) ?? 'plaintext');
                return (
                  <div
                    key={id}
                    role="tab"
                    aria-selected={isActive}
                    tabIndex={0}
                    className={`cs-tab ${isActive ? 'cs-tab-active' : ''}`}
                    title={tab.kind === 'page' ? pageInfo(tab.value).path : tab.value}
                    onClick={() => activateTab(id)}
                    onKeyDown={(e) => e.key === 'Enter' && activateTab(id)}
                  >
                    <FileBadge language={language} />
                    <span className="cs-tab-label">{label}</span>
                    <button
                      type="button"
                      className="cs-tab-close"
                      aria-label={`Close ${label}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTab(id);
                      }}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                );
              })}
              <span className="vsc-tab-actions">
                <button
                  type="button"
                  title="Split Editor Right — open this page in a second column"
                  onClick={() => openSplit(pathname)}
                >
                  <SplitIcon />
                </button>
              </span>
            </div>
          )}

          {vsc && breadcrumbs.length > 0 && (
            <div className="vsc-chrome cs-breadcrumbs">
              {breadcrumbs.map((part, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span className="cs-breadcrumb-sep">›</span>}
                  <span>{part}</span>
                </React.Fragment>
              ))}
            </div>
          )}

          {/* The real page — always mounted so its state survives tab / mode switches. */}
          <div className={vsc ? `vsc-content dark-90 ${pageVisible ? '' : 'vsc-hidden'}` : pass}>
            {children}
          </div>

          {vsc && activeCode && activeCodeFile && (
            <div
              className="vsc-chrome vsc-code"
              onKeyUp={(e) => trackCursor(e.target, setCursor)}
              onClick={(e) => trackCursor(e.target, setCursor)}
            >
              <CodeEditor
                file={activeCodeFile}
                value={edits[activeCode] ?? activeCodeFile.content}
                onChange={(value) => setEdits((prev) => ({ ...prev, [activeCode]: value }))}
              />
            </div>
          )}

          {vsc && !activeTabId && (
            <div className="vsc-chrome cs-welcome">
              <div className="cs-welcome-logo" aria-hidden="true">
                {'{ }'}
              </div>
              <h2>Visual Studio Code</h2>
              <p>Editing evolved</p>
              <p className="cs-welcome-hint">
                Show All Commands <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd> · Go to File{' '}
                <kbd>Ctrl</kbd>+<kbd>P</kbd>
              </p>
            </div>
          )}
        </div>

        {showSplit && split && (
          <>
            <div
              className={`vsc-split-resizer ${splitVisible ? '' : 'vsc-hidden'}`}
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize editor groups"
              title="Drag to resize · double-click to reset"
              onPointerDown={startSplitResize}
              onDoubleClick={resetSplitRatio}
            />
            <div
              ref={rightGroupRef}
              className={`cs-editor-area vsc-editor vsc-group-right ${
                splitVisible ? '' : 'vsc-hidden'
              }`}
              style={{ flex: `${1 - splitRatio} 1 0` }}
              onPointerDownCapture={() => setActiveGroup('right')}
            >
              <div
                className={`vsc-chrome cs-tabbar ${activeGroup === 'left' ? 'vsc-group-inactive' : ''}`}
                role="tablist"
              >
                <div
                  role="tab"
                  aria-selected
                  className="cs-tab cs-tab-active"
                  title={splitInfo.path}
                >
                  <FileBadge language="javascript" />
                  <span className="cs-tab-label">{splitInfo.name}</span>
                  <button
                    type="button"
                    className="cs-tab-close"
                    aria-label={`Close ${splitInfo.name}`}
                    onClick={closeSplit}
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>
              <div className="vsc-chrome cs-breadcrumbs">
                {splitInfo.path.split('/').map((part, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="cs-breadcrumb-sep">›</span>}
                    <span>{part}</span>
                  </React.Fragment>
                ))}
              </div>
              <iframe
                key={split.n}
                ref={splitFrameRef}
                className="vsc-split-frame"
                src={pageUrl(split.src)}
                title={splitInfo.name}
              />
            </div>
          </>
        )}
      </div>

      <div className={vsc ? `vsc-tools dark-90 ${activeCode ? 'vsc-hidden' : ''}` : pass}>
        {tools}
      </div>

      {vsc && (
        <div className="vsc-chrome cs-statusbar">
          <span className="cs-status-item cs-status-branch">
            <BranchIcon /> main*
          </span>
          <span className="cs-status-item">⊗ 0 ⚠ 0</span>
          <span className="cs-status-spacer" />
          <span className="cs-status-item">
            Ln {activeCode ? cursor.ln : 1}, Col {activeCode ? cursor.col : 1}
          </span>
          <span className="cs-status-item">
            Spaces: {activeCodeFile?.language === 'java' ? 4 : 2}
          </span>
          <span className="cs-status-item">UTF-8</span>
          <span className="cs-status-item">CRLF</span>
          <span className="cs-status-item">
            {activeCodeFile ? languageLabel(activeCodeFile.language) : 'TypeScript JSX'}
          </span>
          <button
            type="button"
            className="cs-status-item vsc-status-btn"
            title="Toggle layout (Alt+Shift+V) · Boss key (Alt+Q)"
            onClick={togglePanic}
          >
            {'{ }'}
          </button>
        </div>
      )}
    </div>
  );
}

const LANGUAGE_LABELS: Record<string, string> = {
  java: 'Java',
  javascript: 'JavaScript',
  yaml: 'YAML',
  xml: 'XML',
  sql: 'SQL',
  json: 'JSON',
  markdown: 'Markdown',
  properties: 'Properties',
  dockerfile: 'Dockerfile',
  shell: 'Shell Script',
};

function languageLabel(language: string) {
  return LANGUAGE_LABELS[language] ?? 'Plain Text';
}

function trackCursor(
  target: EventTarget,
  setCursor: (cursor: { ln: number; col: number }) => void,
) {
  if (!(target instanceof HTMLTextAreaElement)) return;
  const before = target.value.slice(0, target.selectionStart);
  const lines = before.split('\n');
  setCursor({ ln: lines.length, col: lines[lines.length - 1].length + 1 });
}
