'use client';

import { useEffect, useRef } from 'react';
import { KmImage } from '../types';
import { FlatTree, ROOT_KEY } from './tree';

interface DetailPanelProps {
  tree: FlatTree;
  selectedKey: string;
  learned: Set<string>;
  /** Topic overview picture — shown when the root node is selected. */
  image?: KmImage;
  onOpenImage: () => void;
  onSelect: (key: string) => void;
  onToggleLearned: (id: string) => void;
  onClose: () => void;
}

const WIDTH_KEY = 'km-panel-width';
const DEFAULT_WIDTH = 420;
const MIN_WIDTH = 320;
/** Keep at least this much room for the map next to the panel. */
const MIN_MAP_WIDTH = 240;

/** Clamps a panel width to what fits next to the map. */
function clampWidth(width: number, panel: HTMLElement): number {
  const container = panel.parentElement?.clientWidth ?? window.innerWidth;
  return Math.round(Math.max(MIN_WIDTH, Math.min(width, container - MIN_MAP_WIDTH)));
}

function applyWidth(panel: HTMLElement, width: number) {
  panel.style.setProperty('--km-panel-w', `${width}px`);
}

function saveWidth(width: number) {
  try {
    localStorage.setItem(WIDTH_KEY, String(width));
  } catch {
    /* storage unavailable: width just won't be remembered */
  }
}

/** Right-hand (bottom sheet on mobile) panel explaining the selected concept. */
export default function DetailPanel({
  tree,
  selectedKey,
  learned,
  image,
  onOpenImage,
  onSelect,
  onToggleLearned,
  onClose,
}: DetailPanelProps) {
  const panelRef = useRef<HTMLElement>(null);

  // Restore the width the user dragged to last time.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    let stored = NaN;
    try {
      stored = Number(localStorage.getItem(WIDTH_KEY));
    } catch {
      /* ignore */
    }
    if (stored > 0) applyWidth(panel, clampWidth(stored, panel));
  }, []);

  /** Drag the left edge to resize; the width is written straight to a CSS variable. */
  const startResize = (e: React.PointerEvent<HTMLDivElement>) => {
    const panel = panelRef.current;
    if (!panel) return;
    e.preventDefault();
    const handle = e.currentTarget;
    handle.setPointerCapture(e.pointerId);
    const right = panel.getBoundingClientRect().right;
    let width = panel.offsetWidth;
    panel.classList.add('km-panel-resizing');

    const onMove = (ev: PointerEvent) => {
      width = clampWidth(right - ev.clientX, panel);
      applyWidth(panel, width);
    };
    const onUp = () => {
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      handle.removeEventListener('pointercancel', onUp);
      panel.classList.remove('km-panel-resizing');
      saveWidth(width);
    };
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
    handle.addEventListener('pointercancel', onUp);
  };

  /** Toggle between the default width and a wide reading view. */
  const toggleWide = () => {
    const panel = panelRef.current;
    if (!panel) return;
    const container = panel.parentElement?.clientWidth ?? window.innerWidth;
    const isWide = panel.offsetWidth > DEFAULT_WIDTH + 40;
    const width = clampWidth(isWide ? DEFAULT_WIDTH : container * 0.65, panel);
    applyWidth(panel, width);
    saveWidth(width);
  };

  const fn = tree.map.get(selectedKey);
  if (!fn) return null;
  const { node } = fn;

  const trail: string[] = [];
  for (let cur = fn.parentKey; cur; cur = tree.map.get(cur)?.parentKey ?? null) trail.unshift(cur);

  const pos = tree.order.indexOf(selectedKey);
  const prevKey = pos > 0 ? tree.order[pos - 1] : null;
  const nextKey = pos < tree.order.length - 1 ? tree.order[pos + 1] : null;
  const isLearned = learned.has(fn.id);

  const learnAndNext = () => {
    if (!isLearned) onToggleLearned(fn.id);
    if (nextKey) onSelect(nextKey);
  };

  return (
    <aside ref={panelRef} className="km-panel" style={{ '--h': fn.hue } as React.CSSProperties}>
      <div
        className="km-panel-resize"
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize panel"
        title="Drag to resize · double-click to widen / narrow"
        onPointerDown={startResize}
        onDoubleClick={toggleWide}
      />
      <div className="km-panel-head">
        <nav className="km-trail">
          {trail.map((k) => (
            <button key={k} type="button" onClick={() => onSelect(k)}>
              {tree.map.get(k)!.node.title}
            </button>
          ))}
        </nav>
        <button
          type="button"
          className="km-icon-btn km-hide-sm"
          title="Widen / narrow panel"
          onClick={toggleWide}
        >
          ↔
        </button>
        <button type="button" className="km-icon-btn" title="Close panel" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="km-panel-body" key={selectedKey}>
        <div className="km-panel-title">
          <h2>{node.title}</h2>
          <span className={`km-level km-level-${node.level}`}>{node.level}</span>
        </div>
        <p className="km-summary">{node.summary}</p>

        <label className="km-learned">
          <input type="checkbox" checked={isLearned} onChange={() => onToggleLearned(fn.id)} />I
          understand this
        </label>

        {image && selectedKey === ROOT_KEY && (
          <figure className="km-figure">
            <button type="button" onClick={onOpenImage} title="Open full size">
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized images */}
              <img src={image.src} alt={image.alt} />
            </button>
            <figcaption>Click to enlarge{image.caption ? ` · ${image.caption}` : ''}</figcaption>
          </figure>
        )}

        {node.simple && (
          <section className="km-box km-box-simple">
            <h4>💡 In simple words</h4>
            <p>{node.simple}</p>
          </section>
        )}

        {node.points && node.points.length > 0 && (
          <section className="km-section">
            <h4>Key points</h4>
            <ul>
              {node.points.map((p, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
            </ul>
          </section>
        )}

        {node.detail && (
          <section
            className="km-section km-detail"
            dangerouslySetInnerHTML={{ __html: node.detail }}
          />
        )}

        {node.tip && (
          <section className="km-box km-box-tip">
            <h4>🎯 Tip</h4>
            <p>{node.tip}</p>
          </section>
        )}

        {fn.childKeys.length > 0 && (
          <section className="km-section">
            <h4>Explore next</h4>
            <div className="km-chips">
              {fn.childKeys.map((k) => {
                const child = tree.map.get(k)!;
                return (
                  <button
                    key={k}
                    type="button"
                    className={`km-chip ${learned.has(child.id) ? 'done' : ''}`}
                    onClick={() => onSelect(k)}
                  >
                    <span className={`km-dot km-dot-${child.node.level}`} />
                    {child.node.title}
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>

      <div className="km-panel-foot">
        <button type="button" disabled={!prevKey} onClick={() => prevKey && onSelect(prevKey)}>
          ← Prev
        </button>
        <span className="km-pos">
          {pos + 1} / {tree.order.length}
        </span>
        <button type="button" disabled={!nextKey} onClick={() => nextKey && onSelect(nextKey)}>
          Next →
        </button>
        <button
          type="button"
          className="km-primary"
          disabled={!nextKey && isLearned}
          onClick={learnAndNext}
        >
          ✓ Got it{nextKey ? ', next' : ''}
        </button>
      </div>
    </aside>
  );
}
