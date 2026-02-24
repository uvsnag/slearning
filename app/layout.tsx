'use client';
import './globals.css';
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'sl_theme_mode';
const THEME_CURRENT = 'current';
const THEME_STUDIO_MODEL = 'studio-model';
const STUDIO_THEME_CLASS = 'theme-studio-model';

type ThemeMode = typeof THEME_CURRENT | typeof THEME_STUDIO_MODEL;

const applyThemeClass = (theme: ThemeMode) => {
  const bodyElement = document.body;
  if (!bodyElement) {
    return;
  }
  bodyElement.classList.remove(STUDIO_THEME_CLASS);
  if (theme === THEME_STUDIO_MODEL) {
    bodyElement.classList.add(STUDIO_THEME_CLASS);
  }
};
export const handleCheckboxDarkChange = (e: ChangeEvent<HTMLInputElement>) => {
  // const targetDiv = document.getElementById("root");
  const bodyElement = document.body;
  if (bodyElement) {
    if (e.target.checked) {
      bodyElement.classList.add('dark-90');
    } else {
      bodyElement.classList.remove('dark-90');
    }
  }
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(THEME_CURRENT);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const initialTheme = storedTheme === THEME_STUDIO_MODEL ? THEME_STUDIO_MODEL : THEME_CURRENT;
    setThemeMode(initialTheme);
    applyThemeClass(initialTheme);
    document.body.classList.add('dark-90');
  }, []);

  const handleThemeModeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme =
      event.target.value === THEME_STUDIO_MODEL ? THEME_STUDIO_MODEL : THEME_CURRENT;
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
        <div className="app-topbar ui-panel">
          <Link href="/" className="app-home-link">
            <FaHome />
            <label>Home</label>
          </Link>
          <div className="app-topbar-controls">
            <label className="app-dark-switch">
              <input type="checkbox" onChange={handleCheckboxDarkChange} defaultChecked={true} />
              Dark mode
            </label>
            <label className="app-theme-switch">
              Theme
              <select
                className="app-theme-select"
                value={themeMode}
                onChange={handleThemeModeChange}
              >
                <option value={THEME_CURRENT}>Current Theme</option>
                <option value={THEME_STUDIO_MODEL}>Studio Model</option>
              </select>
            </label>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}
