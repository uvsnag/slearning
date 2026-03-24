'use client';
import './globals.css';
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { KEY_DARK_MODE } from '@/common/common.js';
import StickyQuickTools from './common/components/sticky/StickyQuickTools';
import { PracticeStoreProvider } from './common/hooks/usePracticeStore';

const THEME_STORAGE_KEY = 'sl_theme_mode';
const THEME_1 = 'current';
const THEME_2 = 'studio-model';
const THEME_2_CLASS = 'theme-2-model';

type ThemeMode = typeof THEME_1 | typeof THEME_2;

const applyThemeClass = (theme: ThemeMode) => {
  const bodyElement = document.body;
  if (!bodyElement) {
    return;
  }
  bodyElement.classList.remove(THEME_2_CLASS);
  if (theme === THEME_2) {
    bodyElement.classList.add(THEME_2_CLASS);
  }
};
export const handleCheckboxDarkChange = (e: ChangeEvent<HTMLInputElement>) => {
  const bodyElement = document.body;
  if (bodyElement) {
    if (e.target.checked) {
      bodyElement.classList.add('dark-90');
      localStorage.setItem(KEY_DARK_MODE, 'Y');
    } else {
      bodyElement.classList.remove('dark-90');
      localStorage.setItem(KEY_DARK_MODE, 'N');
    }
  }
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(THEME_1);
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme = storedTheme === THEME_2 ? THEME_2 : THEME_1;
    setThemeMode(initialTheme);
    applyThemeClass(initialTheme);

    const storedDark = localStorage.getItem(KEY_DARK_MODE);
    const darkEnabled = storedDark !== 'N';
    setIsDark(darkEnabled);
    if (darkEnabled) {
      document.body.classList.add('dark-90');
    } else {
      document.body.classList.remove('dark-90');
    }
  }, []);

  const handleThemeModeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = event.target.value === THEME_2 ? THEME_2 : THEME_1;
    setThemeMode(selectedTheme);
    applyThemeClass(selectedTheme);
    localStorage.setItem(THEME_STORAGE_KEY, selectedTheme);
  };

  return (
    <html lang="en">
      <head>
        <title>SLearning</title>
      </head>
      <body>
        <PracticeStoreProvider>
          <div className="app-topbar ui-panel">
            <Link href="/" className="app-home-link">
              <FaHome />
              <label>Home</label>
            </Link>
            <div className="app-topbar-controls">
              <label className="app-dark-switch">
                <input
                  type="checkbox"
                  onChange={handleCheckboxDarkChange}
                  checked={isDark}
                  onClick={() => setIsDark((prev) => !prev)}
                />
                Dark mode
              </label>
              <label className="app-theme-switch">
                Theme
                <select
                  className="app-theme-select"
                  value={themeMode}
                  onChange={handleThemeModeChange}
                >
                  <option value={THEME_1}>Theme 1</option>
                  <option value={THEME_2}>Theme 2</option>
                </select>
              </label>
            </div>
            <StickyQuickTools />
          </div>
          {children}
        </PracticeStoreProvider>
      </body>
    </html>
  );
}
