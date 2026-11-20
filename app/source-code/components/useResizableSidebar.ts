'use client';

import React, { useEffect, useState } from 'react';

const SIDEBAR_DEFAULT = 280;
/** No minimum: the sidebar may be dragged down to 0. Max keeps the editor reachable. */
const clampWidth = (w: number) => Math.round(Math.min(Math.max(w, 0), window.innerWidth * 0.7));

/**
 * Mouse-resizable sidebar (Code Studio and the app-wide VS Code layout).
 * Put `sidebarProps` on the `.cs-sidebar` element and `resizerProps` on a
 * `<div className="cs-sidebar-resizer" />` inside it; add `cs-resizing` to the
 * root while `resizing` is true. Double-click the handle to reset the width.
 */
export function useResizableSidebar(storageKey: string, defaultWidth = SIDEBAR_DEFAULT) {
  const [width, setWidth] = useState(defaultWidth);
  const [resizing, setResizing] = useState(false);

  useEffect(() => {
    try {
      const stored = Number(localStorage.getItem(storageKey));
      // Restored after mount on purpose: reading storage during render would
      // mismatch the statically exported HTML on hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Number.isFinite(stored) && stored > 0) setWidth(clampWidth(stored));
    } catch {
      // storage blocked — keep the default width
    }
  }, [storageKey]);

  const save = (w: number) => {
    try {
      localStorage.setItem(storageKey, String(w));
    } catch {
      // ignore
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = width;
    let latest = startWidth;
    setResizing(true);
    const onMove = (ev: PointerEvent) => {
      latest = clampWidth(startWidth + ev.clientX - startX);
      setWidth(latest);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      setResizing(false);
      save(latest);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const onDoubleClick = () => {
    setWidth(defaultWidth);
    save(defaultWidth);
  };

  return {
    resizing,
    sidebarProps: {
      style: { '--cs-sidebar-w': `${width}px` } as React.CSSProperties,
    },
    resizerProps: {
      role: 'separator',
      'aria-orientation': 'vertical' as const,
      'aria-label': 'Resize sidebar',
      title: 'Drag to resize · double-click to reset',
      onPointerDown,
      onDoubleClick,
    },
  };
}
