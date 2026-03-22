'use client';
import './globals.css';
import Link from 'next/link';
import { FaHome } from 'react-icons/fa';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { COMMON_PROMPT, KEY_DARK_MODE } from '@/common/common.js';
import SpeakPracticeInput from './common/components/SpeakPracticeInput';
import StickyAIBoard from './common/components/StickyAIBoard';

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
          <SpeakPracticeInput
            voiceIndex="speed-main"
            type="TEXTAREA"
            isSticky="Y"
            stickyBottom={0}
          />
          <StickyAIBoard
            boardPrefix="layout-sticky-ai"
            boardIndex={0}
            isSticky="Y"
            stickyBottom={150}
            title="Eng-Vie"
            defaultPrompt={COMMON_PROMPT.ADD_EXCEL_ENG}
            pathIcon={
              <path
                d="M21 5h-8M17 5v14M21 19h-8M10 15l-4 4M6 19H3v-3M3 19l7-7"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            }
          />
          <StickyAIBoard
            boardPrefix="layout-sticky-ai"
            boardIndex={1}
            isSticky="Y"
            stickyBottom={200}
            title="Eng-Vie"
            defaultPrompt={COMMON_PROMPT.TRANSLATE_EN_VI}
            pathIcon={
              <path
                d="M3 5h8M7 5v14M3 19h8M14 9l4-4M18 5h3v3M21 5l-7 7"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            }
          />
          <StickyAIBoard
            boardPrefix="layout-sticky-ai"
            boardIndex={2}
            isSticky="Y"
            stickyBottom={250}
            title="Grammar"
            defaultPrompt={COMMON_PROMPT.CHECK_GRAMMAR}
            pathIcon={
              <path
                d="M4 6h12M4 10h12M4 14h8M16 16l2 2 4-4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            }
          />
        </div>
        {children}
      </body>
    </html>
  );
}
