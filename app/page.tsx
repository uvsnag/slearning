'use client';
import Link from 'next/link';
import React, { useEffect, useState, FC, ChangeEvent } from 'react';
import {
  toggleCollapse,
  KEY_GPT_NM,
  KEY_GEMINI_NM,
  KEY_GOOGLE_SHEET_NM,
  KEY_API_SHEET,
} from '@/common/common';

const DESKTOP_LINKS = [
  { href: '/youtube-sub', label: 'Board YT' },
  { href: '/dash-board1', label: 'Board Sentence' },
  { href: '/practice-word', label: 'Word (Meaning)' },
  { href: '/listen', label: 'Word (Listen)' },
  { href: '/notify', label: 'Notify' },
  { href: '/next-sentence', label: 'Sentence' },
];

const MOBILE_LINKS = [
  { href: '/mobile/speak-ai', label: 'Speak AI' },
  { href: '/mobile/youtube-sub', label: 'Listen Board' },
];

const getStoredValue = (key: string): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem(key);
};

const Home: FC = () => {
  const [gemKey, setGemKey] = useState<string | null>(() => getStoredValue(KEY_GEMINI_NM));
  const [gptKey, setGptKey] = useState<string | null>(() => getStoredValue(KEY_GPT_NM));
  const [googleSheetKey, setGoogleSheetKey] = useState<string | null>(() =>
    getStoredValue(KEY_GOOGLE_SHEET_NM),
  );
  const [apiKey, setApiKey] = useState<string | null>(() => getStoredValue(KEY_API_SHEET));
  useEffect(() => {
    if (gemKey) {
      localStorage.setItem(KEY_GEMINI_NM, gemKey);
    }
  }, [gemKey]);

  useEffect(() => {
    if (gptKey) {
      localStorage.setItem(KEY_GPT_NM, gptKey);
    }
  }, [gptKey]);

  useEffect(() => {
    if (googleSheetKey) {
      localStorage.setItem(KEY_GOOGLE_SHEET_NM, googleSheetKey);
    }
  }, [googleSheetKey]);

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem(KEY_API_SHEET, apiKey);
    }
  }, [apiKey]);

  return (
    <div className="ui-page">
      <div className="ui-page-shell home-shell">
        <h1 className="ui-title">SLearning Studio</h1>
        <p className="ui-subtitle">
          Unified navigation for desktop and mobile tools, with shared UI tokens.
        </p>

        <div className="home-menu-grid">
          <section className="ui-panel home-menu-panel">
            <div className="common-toggle">Desktop</div>
            <ul className="mst-menu">
              {DESKTOP_LINKS.map((link) => (
                <li className="mst-menu-li" key={link.href}>
                  <Link className="home-nav-link" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="ui-panel home-menu-panel">
            <div className="common-toggle">Mobile</div>
            <ul className="mst-menu">
              {MOBILE_LINKS.map((link) => (
                <li className="mst-menu-li" key={link.href}>
                  <Link className="home-nav-link" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <button type="button" className="home-menu-button" onClick={() => toggleCollapse('config')}>
          Config
        </button>
        <div id="config" className="collapse-content ui-collapse-panel home-config-panel">
          <div className="home-config-grid">
            <label className="home-config-field">
              <span>Gemini Key</span>
              <input
                className="common-input"
                type="text"
                value={gemKey ?? ''}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setGemKey(event.target.value);
                }}
                placeholder="gem"
              />
            </label>
            <label className="home-config-field">
              <span>GPT Key</span>
              <input
                className="common-input"
                type="text"
                value={gptKey ?? ''}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setGptKey(event.target.value);
                }}
                placeholder="gpt"
              />
            </label>
            <label className="home-config-field">
              <span>Google Sheet Key</span>
              <input
                className="common-input"
                type="text"
                value={googleSheetKey ?? ''}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setGoogleSheetKey(event.target.value);
                }}
                placeholder="google sheet key"
              />
            </label>
            <label className="home-config-field">
              <span>API Key</span>
              <input
                className="common-input"
                type="text"
                value={apiKey ?? ''}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setApiKey(event.target.value);
                }}
                placeholder="api key"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
