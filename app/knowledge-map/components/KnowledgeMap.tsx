'use client';

import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { KM_TOPICS } from '../data';
import { KM_LEVELS } from '../types';
import DetailPanel from './DetailPanel';
import {
  ROOT_KEY,
  FlatTree,
  Layout,
  ancestorsOf,
  computeLayout,
  edgePath,
  flattenTree,
  levelIndex,
} from './tree';
import './knowledge-map.css';

interface View {
  x: number;
  y: number;
  k: number;
}

const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;
const DRAG_THRESHOLD = 4;
const clampZoom = (k: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, k));

/** Zoom by `factor` keeping the screen point (cx, cy) fixed. */
const zoomView = (v: View | null, factor: number, cx: number, cy: number): View | null => {
  if (!v) return v;
  const k = clampZoom(v.k * factor);
  return { k, x: cx - (cx - v.x) * (k / v.k), y: cy - (cy - v.y) * (k / v.k) };
};

/* ----- dark mode: follows the app theme (body.dark-90, set by the sticky
   config) unless this page has its own 'light' / 'dark' override ----- */
const DARK_EVENT = 'km-darkmode-changed';
const THEME_KEY = 'km-theme';
const subscribeDark = (onChange: () => void) => {
  window.addEventListener(DARK_EVENT, onChange);
  const mo = new MutationObserver(onChange);
  mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  return () => {
    window.removeEventListener(DARK_EVENT, onChange);
    mo.disconnect();
  };
};
const readDark = () => {
  let override: string | null = null;
  try {
    override = localStorage.getItem(THEME_KEY);
  } catch {
    /* storage unavailable — fall back to the app theme */
  }
  if (override === 'dark' || override === 'light') return override === 'dark';
  return document.body.classList.contains('dark-90');
};

/* ----- "learned" marks, persisted per topic (raw JSON string as snapshot) ----- */
const LEARNED_EVENT = 'km-learned-changed';
const learnedKey = (topicId: string) => `km-learned:${topicId}`;
const subscribeLearned = (onChange: () => void) => {
  window.addEventListener(LEARNED_EVENT, onChange);
  return () => window.removeEventListener(LEARNED_EVENT, onChange);
};
const readLearned = (topicId: string) => {
  try {
    return localStorage.getItem(learnedKey(topicId)) ?? '[]';
  } catch {
    return '[]';
  }
};
const parseLearned = (raw: string): Set<string> => {
  try {
    const arr: unknown = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr.filter((v): v is string => typeof v === 'string') : []);
  } catch {
    return new Set();
  }
};

const unionWithAncestors = (tree: FlatTree, base: Set<string>, keys: string[]) => {
  const next = new Set(base);
  for (const k of keys) for (const a of ancestorsOf(tree, k)) next.add(a);
  return next;
};

const fitView = (layout: Layout, vw: number, vh: number): View => {
  const { minX, maxX, minY, maxY } = layout.bounds;
  const pad = 48;
  const k = clampZoom(Math.min((vw - pad) / (maxX - minX), (vh - pad) / (maxY - minY), 1.1));
  return { k, x: vw / 2 - ((minX + maxX) / 2) * k, y: vh / 2 - ((minY + maxY) / 2) * k };
};

/**
 * Knowledge Map — an interactive two-sided mind map of a topic. Click a node to
 * open its explanation and reveal its children, drag to pan, scroll / pinch to
 * zoom, arrows to navigate, and walk the whole map in order with Prev / Next.
 */
export default function KnowledgeMap() {
  const [topicId, setTopicId] = useState(KM_TOPICS[0].id);
  const topic = KM_TOPICS.find((t) => t.id === topicId) ?? KM_TOPICS[0];
  const tree = useMemo(() => flattenTree(topic.root), [topic]);

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set([ROOT_KEY]));
  const [selectedKey, setSelectedKey] = useState<string>(ROOT_KEY);
  const [panelOpen, setPanelOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [matchCursor, setMatchCursor] = useState(0);
  const [maxLevel, setMaxLevel] = useState(KM_LEVELS.length - 1);
  const [view, setView] = useState<View | null>(null);
  const [animate, setAnimate] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

  const dark = useSyncExternalStore(subscribeDark, readDark, () => false);
  const learnedRaw = useSyncExternalStore(
    subscribeLearned,
    () => readLearned(topic.id),
    () => '[]',
  );
  const learned = useMemo(() => parseLearned(learnedRaw), [learnedRaw]);

  /* ----- search ----- */
  const q = query.trim().toLowerCase();
  const matches = useMemo(
    () => (q.length < 2 ? [] : tree.order.filter((k) => tree.map.get(k)!.searchText.includes(q))),
    [q, tree],
  );
  const matchSet = useMemo(() => new Set(matches), [matches]);
  const visibleExpanded = useMemo(
    () => unionWithAncestors(tree, expanded, matches),
    [tree, expanded, matches],
  );
  const layout = useMemo(() => computeLayout(tree, visibleExpanded), [tree, visibleExpanded]);

  /* ----- viewport: fit once when it first gets a size ----- */
  const viewportRef = useRef<HTMLDivElement>(null);
  const layoutRef = useRef(layout);
  useEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    let last: { w: number; h: number } | null = null;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w === 0) return;
      if (!last) {
        setView(fitView(layoutRef.current, w, h));
      } else {
        /* Keep whatever was in the middle of the viewport in the middle. */
        const dx = (w - last.w) / 2;
        const dy = (h - last.h) / 2;
        setAnimate(false);
        setView((v) => (v ? { ...v, x: v.x + dx, y: v.y + dy } : v));
      }
      last = { w, h };
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const viewportSize = () => {
    const el = viewportRef.current;
    return { vw: el?.clientWidth ?? 800, vh: el?.clientHeight ?? 600 };
  };

  /** Pan (keeping zoom) so a node and its visible children sit inside the viewport. */
  const revealIn = (L: Layout, key: string, center: boolean) => {
    const placed = L.byKey.get(key);
    if (!placed) return;
    const { vw, vh } = viewportSize();
    setView((prev) => {
      const v = prev ?? fitView(L, vw, vh);
      const k = center ? Math.max(v.k, 0.75) : v.k;
      if (center) return { k, x: vw / 2 - placed.x * k, y: vh / 2 - placed.y * k };

      const box = {
        minX: placed.x - placed.w / 2,
        maxX: placed.x + placed.w / 2,
        minY: placed.y,
        maxY: placed.y,
      };
      for (const c of tree.map.get(key)!.childKeys) {
        const p = L.byKey.get(c);
        if (!p) continue;
        box.minX = Math.min(box.minX, p.x - p.w / 2);
        box.maxX = Math.max(box.maxX, p.x + p.w / 2);
        box.minY = Math.min(box.minY, p.y - p.h / 2);
        box.maxY = Math.max(box.maxY, p.y + p.h / 2);
      }
      const m = 32;
      const shift = (lo: number, hi: number, size: number, focus: number) => {
        if (hi - lo > size - 2 * m) return size / 2 - focus;
        if (lo < m) return m - lo;
        if (hi > size - m) return size - m - hi;
        return 0;
      };
      const dx = shift(box.minX * k + v.x, box.maxX * k + v.x, vw, placed.x * k + v.x);
      const dy = shift(box.minY * k + v.y, box.maxY * k + v.y, vh, placed.y * k + v.y);
      return dx || dy ? { k, x: v.x + dx, y: v.y + dy } : v;
    });
    setAnimate(true);
  };

  /* ----- selection & expansion ----- */
  const select = (key: string, { center = true, expandSelf = true } = {}) => {
    const next = unionWithAncestors(tree, expanded, [key]);
    if (expandSelf && tree.map.get(key)!.childKeys.length) next.add(key);
    setExpanded(next);
    setSelectedKey(key);
    setPanelOpen(true);
    revealIn(computeLayout(tree, unionWithAncestors(tree, next, matches)), key, center);
  };

  const toggleExpand = (key: string) => {
    const next = new Set(expanded);
    if (visibleExpanded.has(key)) next.delete(key);
    else next.add(key);
    setExpanded(next);
    if (next.has(key))
      revealIn(computeLayout(tree, unionWithAncestors(tree, next, matches)), key, false);
  };

  const onNodeClick = (key: string) => {
    if (key === selectedKey && panelOpen) toggleExpand(key);
    else select(key, { center: false });
  };

  const applyExpanded = (next: Set<string>) => {
    setExpanded(next);
    const { vw, vh } = viewportSize();
    setView(fitView(computeLayout(tree, unionWithAncestors(tree, next, matches)), vw, vh));
    setAnimate(true);
  };
  const expandAll = () =>
    applyExpanded(new Set(tree.order.filter((k) => tree.map.get(k)!.childKeys.length)));
  const collapseAll = () => applyExpanded(new Set([ROOT_KEY]));
  const fit = () => {
    const { vw, vh } = viewportSize();
    setView(fitView(layout, vw, vh));
    setAnimate(true);
  };

  const switchTopic = (id: string) => {
    setTopicId(id);
    setImageOpen(false);
    setExpanded(new Set([ROOT_KEY]));
    setSelectedKey(ROOT_KEY);
    setQuery('');
    const nextTopic = KM_TOPICS.find((t) => t.id === id) ?? KM_TOPICS[0];
    const { vw, vh } = viewportSize();
    setView(fitView(computeLayout(flattenTree(nextTopic.root), new Set([ROOT_KEY])), vw, vh));
  };

  const gotoMatch = (step: 1 | -1) => {
    if (!matches.length) return;
    const i = (((matchCursor + step) % matches.length) + matches.length) % matches.length;
    setMatchCursor(i);
    select(matches[i], { expandSelf: false });
  };

  /* ----- learned ----- */
  const toggleLearned = (id: string) => {
    const next = new Set(learned);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    try {
      localStorage.setItem(learnedKey(topic.id), JSON.stringify([...next]));
    } catch {
      /* storage unavailable — marks just won't persist */
    }
    window.dispatchEvent(new Event(LEARNED_EVENT));
  };
  const learnedCount = tree.order.filter((k) => learned.has(tree.map.get(k)!.id)).length;

  const toggleDark = () => {
    try {
      localStorage.setItem(THEME_KEY, dark ? 'light' : 'dark');
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(DARK_EVENT));
  };

  /* ----- pan / pinch / wheel zoom ----- */
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const drag = useRef({ startX: 0, startY: 0, moved: false, pinchDist: 0 });

  const zoomAt = (factor: number, cx: number, cy: number) =>
    setView((v) => zoomView(v, factor, cx, cy));

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const factor = Math.exp(-e.deltaY * 0.0015);
      setAnimate(false);
      setView((v) => zoomView(v, factor, e.clientX - rect.left, e.clientY - rect.top));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    /* A mouse has one pointer — drop any entry whose pointerup happened outside. */
    if (e.pointerType === 'mouse') pointers.current.clear();
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) {
      drag.current = { startX: e.clientX, startY: e.clientY, moved: false, pinchDist: 0 };
    } else if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      drag.current.pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
      drag.current.moved = true;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const cur = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, cur);

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const rect = viewportRef.current!.getBoundingClientRect();
      if (drag.current.pinchDist > 0) {
        setAnimate(false);
        zoomAt(
          dist / drag.current.pinchDist,
          (a.x + b.x) / 2 - rect.left,
          (a.y + b.y) / 2 - rect.top,
        );
      }
      drag.current.pinchDist = dist;
      return;
    }

    if (!drag.current.moved) {
      if (Math.hypot(cur.x - drag.current.startX, cur.y - drag.current.startY) < DRAG_THRESHOLD)
        return;
      drag.current.moved = true;
      /* Capturing after the threshold retargets the eventual click away from the node. */
      viewportRef.current?.setPointerCapture(e.pointerId);
      setAnimate(false);
    }
    setView((v) => (v ? { ...v, x: v.x + cur.x - prev.x, y: v.y + cur.y - prev.y } : v));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) drag.current.pinchDist = 0;
  };

  /* ----- keyboard navigation (visual direction aware) ----- */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    const fn = tree.map.get(selectedKey);
    if (!fn) return;
    const placed = layout.byKey.get(selectedKey);
    const visibleChildren = (key: string) =>
      visibleExpanded.has(key) ? tree.map.get(key)!.childKeys : [];
    let target: string | null = null;

    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      if (fn.side === 0) {
        const branches = fn.childKeys.filter((k) => tree.map.get(k)!.side === dir);
        target = dir === 1 ? branches[0] : branches[branches.length - 1];
      } else if (fn.side === dir) {
        target = fn.childKeys[0] ?? null;
      } else {
        target = fn.parentKey;
      }
    } else if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && fn.parentKey && placed) {
      const siblings = visibleChildren(fn.parentKey)
        .filter((k) => tree.map.get(k)!.side === fn.side)
        .map((k) => layout.byKey.get(k)!)
        .sort((a, b) => a.y - b.y);
      const i = siblings.findIndex((s) => s.key === selectedKey);
      target = siblings[i + (e.key === 'ArrowDown' ? 1 : -1)]?.key ?? null;
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (fn.childKeys.length) toggleExpand(selectedKey);
      e.preventDefault();
      return;
    } else if (e.key === 'Escape') {
      setPanelOpen(false);
      return;
    } else {
      return;
    }

    e.preventDefault();
    if (target) select(target, { center: false, expandSelf: false });
  };

  /* ----- render ----- */
  const transform = view ? `translate(${view.x}px, ${view.y}px) scale(${view.k})` : undefined;
  const searching = q.length >= 2;

  return (
    <div className={`km-root ${dark ? 'km-dark' : ''}`}>
      <header className="km-toolbar">
        <div className="km-brand">
          <span className="km-brand-icon">{topic.icon}</span>
          {KM_TOPICS.length > 1 ? (
            <select value={topic.id} onChange={(e) => switchTopic(e.target.value)}>
              {KM_TOPICS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          ) : (
            <strong>{topic.name}</strong>
          )}
          <span className="km-sub">Knowledge Map</span>
        </div>

        <div className="km-search">
          <input
            type="search"
            placeholder="Search concepts… (Enter = next)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setMatchCursor(-1);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') gotoMatch(e.shiftKey ? -1 : 1);
            }}
          />
          {searching && (
            <span className="km-count">
              {matches.length ? `${Math.max(matchCursor, 0) + 1}/${matches.length}` : 'no match'}
            </span>
          )}
        </div>

        <div className="km-levels" title="Highlight concepts up to this level">
          <span className="km-label">Up to</span>
          {KM_LEVELS.map((lv, i) => (
            <button
              key={lv}
              type="button"
              className={`km-seg ${i <= maxLevel ? 'on' : ''}`}
              onClick={() => setMaxLevel(i)}
            >
              <span className={`km-dot km-dot-${lv}`} />
              {lv}
            </button>
          ))}
        </div>

        <div className="km-actions">
          <div className="km-progress" title="Concepts marked as understood">
            <div className="km-progress-bar">
              <div style={{ width: `${(learnedCount / tree.order.length) * 100}%` }} />
            </div>
            <span>
              {learnedCount}/{tree.order.length}
            </span>
          </div>
          {topic.image && (
            <button type="button" onClick={() => setImageOpen(true)} title="Overview picture">
              🖼 <span className="km-hide-sm">Overview</span>
            </button>
          )}
          <button type="button" onClick={expandAll} title="Expand all">
            ⊞ <span className="km-hide-sm">Expand</span>
          </button>
          <button type="button" onClick={collapseAll} title="Collapse to overview">
            ⊟ <span className="km-hide-sm">Collapse</span>
          </button>
          <button type="button" onClick={fit} title="Fit map to screen">
            ⤢ <span className="km-hide-sm">Fit</span>
          </button>
          <button
            type="button"
            className="km-icon-btn"
            onClick={toggleDark}
            title="Toggle dark mode"
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <div className="km-body">
        <div
          ref={viewportRef}
          className="km-viewport"
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onKeyDown={onKeyDown}
        >
          <div
            className={`km-canvas ${animate ? 'km-animate' : ''}`}
            style={{ transform, opacity: view ? 1 : 0 }}
          >
            <svg className="km-edges" width="1" height="1">
              {layout.nodes.map((p) => {
                const fn = tree.map.get(p.key)!;
                if (!fn.parentKey || fn.side === 0) return null;
                const parent = layout.byKey.get(fn.parentKey)!;
                return (
                  <path
                    key={p.key}
                    d={edgePath(parent, p, fn.side)}
                    className={`km-edge ${fn.depth === 1 ? 'km-edge-main' : ''}`}
                    style={{ '--h': fn.hue } as React.CSSProperties}
                  />
                );
              })}
            </svg>

            {layout.nodes.map((p) => {
              const fn = tree.map.get(p.key)!;
              const { node } = fn;
              const hasChildren = fn.childKeys.length > 0;
              const isOpen = visibleExpanded.has(p.key);
              const dimmed =
                (fn.depth > 0 && levelIndex(node.level) > maxLevel) ||
                (searching && !matchSet.has(p.key));
              const cls = [
                'km-node',
                fn.depth === 0 ? 'km-node-root' : fn.depth === 1 ? 'km-node-branch' : '',
                p.key === selectedKey && panelOpen ? 'selected' : '',
                searching && matchSet.has(p.key) ? 'match' : '',
                dimmed ? 'dimmed' : '',
                learned.has(fn.id) ? 'learned' : '',
                fn.side === -1 ? 'left' : '',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <div
                  key={p.key}
                  className={cls}
                  style={
                    {
                      '--h': fn.hue,
                      width: p.w,
                      height: p.h,
                      transform: `translate(${p.x - p.w / 2}px, ${p.y - p.h / 2}px)`,
                    } as React.CSSProperties
                  }
                >
                  <button
                    type="button"
                    className="km-node-body"
                    title={node.summary}
                    onClick={() => onNodeClick(p.key)}
                    tabIndex={-1}
                  >
                    {fn.depth > 0 && <span className={`km-dot km-dot-${node.level}`} />}
                    <span className="km-node-title">{node.title}</span>
                    {learned.has(fn.id) && <span className="km-check">✓</span>}
                  </button>
                  {hasChildren && fn.depth > 0 && (
                    <button
                      type="button"
                      className={`km-toggle ${isOpen ? 'open' : ''}`}
                      title={isOpen ? 'Collapse' : `Show ${fn.childKeys.length} sub-topics`}
                      onClick={() => toggleExpand(p.key)}
                      tabIndex={-1}
                    >
                      {isOpen ? '−' : fn.childKeys.length}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="km-legend">
            {KM_LEVELS.map((lv) => (
              <span key={lv}>
                <span className={`km-dot km-dot-${lv}`} />
                {lv}
              </span>
            ))}
          </div>
          <div className="km-zoom">
            <button
              type="button"
              onClick={() => zoomAt(1.2, viewportSize().vw / 2, viewportSize().vh / 2)}
            >
              +
            </button>
            <button
              type="button"
              onClick={() => zoomAt(1 / 1.2, viewportSize().vw / 2, viewportSize().vh / 2)}
            >
              −
            </button>
          </div>
          <div className="km-hint km-hide-sm">
            Click a node to open it · drag to pan · scroll to zoom · arrow keys to move
          </div>
        </div>

        {panelOpen && (
          <DetailPanel
            tree={tree}
            selectedKey={selectedKey}
            learned={learned}
            image={topic.image}
            onOpenImage={() => setImageOpen(true)}
            onSelect={(k) => select(k)}
            onToggleLearned={toggleLearned}
            onClose={() => setPanelOpen(false)}
          />
        )}
      </div>

      {imageOpen && topic.image && (
        <div
          className="km-lightbox"
          role="dialog"
          aria-label={topic.image.alt}
          onClick={() => setImageOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setImageOpen(false)}
          tabIndex={-1}
          ref={(el) => el?.focus()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized images */}
          <img src={topic.image.src} alt={topic.image.alt} />
          {topic.image.caption && <p>{topic.image.caption}</p>}
          <button type="button" className="km-lightbox-close" title="Close">
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
