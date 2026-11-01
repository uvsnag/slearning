'use client';

import { useSyncExternalStore } from 'react';

/**
 * App-wide layout mode: the regular SLearning UI, or the "VS Code" disguise
 * (see components/vscode/VSCodeLayout.tsx). Persisted in localStorage and
 * shared between tabs through the `storage` event.
 */
export type LayoutMode = 'normal' | 'vscode';

export const LAYOUT_MODE_KEY = 'sl_layout_mode';

const listeners = new Set<() => void>();

export function getLayoutMode(): LayoutMode {
  try {
    return localStorage.getItem(LAYOUT_MODE_KEY) === 'vscode' ? 'vscode' : 'normal';
  } catch {
    return 'normal';
  }
}

export function setLayoutMode(mode: LayoutMode) {
  try {
    localStorage.setItem(LAYOUT_MODE_KEY, mode);
  } catch {
    // storage blocked — the mode still applies for this page view
  }
  listeners.forEach((listener) => listener());
}

export function toggleLayoutMode() {
  setLayoutMode(getLayoutMode() === 'vscode' ? 'normal' : 'vscode');
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === LAYOUT_MODE_KEY) callback();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', onStorage);
  };
}

export function useLayoutMode(): LayoutMode {
  return useSyncExternalStore(subscribe, getLayoutMode, () => 'normal');
}

/**
 * Inline script for <head>: hides the page until React mounts when the VS Code
 * layout is stored, so the normal UI never flashes on load.
 */
export const LAYOUT_PRELOAD_SCRIPT = `try{if(localStorage.getItem('${LAYOUT_MODE_KEY}')==='vscode'){document.documentElement.classList.add('vsc-preload')}}catch(e){}`;
