'use client';

import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FaCog } from 'react-icons/fa';
import {
  toggleCollapse,
  KEY_GEMINI_NM,
  KEY_GITHUB_NM,
  KEY_GOOGLE_SHEET_NM,
  KEY_API_SHEET,
  KEY_DARK_MODE,
  KEY_SHOW_LOADING,
} from '../../common';
import { usePracticeContext } from '../../hooks/usePracticeStore';
import {
  SHEET_LIST,
  STORE_ALIAS,
  getStoreList,
  addStore,
  removeStore,
  renameStore,
  type DataItem,
  type SheetItem,
} from '@/app/common/hooks/useSheetData';
import { SHEET_AUTO } from '../SheetDataEditor';
import Notify from '@/app/notify/Notify';

const THEME_STORAGE_KEY = 'sl_theme_mode';
const THEME_1 = 'current';
const THEME_2 = 'studio-model';
const THEME_2_CLASS = 'theme-2-model';

type ThemeMode = typeof THEME_1 | typeof THEME_2;

interface StickyConfigProps {
  isSticky?: 'Y' | 'N';
  stickyBottom?: number;
  stickyBottomContent?: number;
  isVisible?: boolean;
  onOpen?: (isOpen: boolean) => void;
}

export interface StickyConfigHandle {
  close: () => void;
}

const getStoredValue = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(key);
};

const getInitialThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') return THEME_1;
  return localStorage.getItem(THEME_STORAGE_KEY) === THEME_2 ? THEME_2 : THEME_1;
};

const getInitialIsDark = (): boolean => {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(KEY_DARK_MODE) !== 'N';
};

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

const StickyConfig = forwardRef<StickyConfigHandle, StickyConfigProps>(
  ({ isSticky = 'Y', stickyBottom, stickyBottomContent = 0, isVisible = true, onOpen }, ref) => {
    const {
      state: practiceState,
      dispatch: practiceDispatch,
      reloadSheet: practiceReload,
    } = usePracticeContext();
    const [isOpen, setIsOpen] = useState(false);

    // ── API Key states (multiple keys separated by ';') ──
    const [gemKey, setGemKey] = useState<string | null>(() => getStoredValue(KEY_GEMINI_NM));
    const [githubKey, setGithubKey] = useState<string | null>(() => getStoredValue(KEY_GITHUB_NM));
    const [googleSheetKey, setGoogleSheetKey] = useState<string | null>(() =>
      getStoredValue(KEY_GOOGLE_SHEET_NM),
    );
    const [apiKey, setApiKey] = useState<string | null>(() => getStoredValue(KEY_API_SHEET));
    const [themeMode, setThemeMode] = useState<ThemeMode>(() => getInitialThemeMode());
    const [isDark, setIsDark] = useState<boolean>(() => getInitialIsDark());
    const [showLoading, setShowLoading] = useState<string>(
      () => getStoredValue(KEY_SHOW_LOADING) ?? 'Y',
    );
    const [storeList, setStoreList] = useState<SheetItem[]>(() => getStoreList());
    const [storeIndex, setStoreIndex] = useState<string>(
      () => getStoreList()[0]?.range ?? `${STORE_ALIAS}1`,
    );
    const [newStoreName, setNewStoreName] = useState<string>('');

    // ── Persist API keys to localStorage ────────────────
    useEffect(() => {
      if (gemKey) localStorage.setItem(KEY_GEMINI_NM, gemKey);
    }, [gemKey]);
    useEffect(() => {
      if (githubKey) localStorage.setItem(KEY_GITHUB_NM, githubKey);
    }, [githubKey]);
    useEffect(() => {
      if (googleSheetKey) localStorage.setItem(KEY_GOOGLE_SHEET_NM, googleSheetKey);
    }, [googleSheetKey]);
    useEffect(() => {
      if (apiKey) localStorage.setItem(KEY_API_SHEET, apiKey);
    }, [apiKey]);
    useEffect(() => {
      localStorage.setItem(KEY_SHOW_LOADING, showLoading);
    }, [showLoading]);
    useEffect(() => {
      applyThemeClass(themeMode);
      localStorage.setItem(THEME_STORAGE_KEY, themeMode);
    }, [themeMode]);
    useEffect(() => {
      if (isDark) {
        document.body.classList.add('dark-90');
        localStorage.setItem(KEY_DARK_MODE, 'Y');
      } else {
        document.body.classList.remove('dark-90');
        localStorage.setItem(KEY_DARK_MODE, 'N');
      }
    }, [isDark]);

    useImperativeHandle(ref, () => ({
      close: () => {
        setIsOpen(false);
      },
    }));

    const onAddStore = () => {
      if (!storeIndex) return;
      const storeDataString = localStorage.getItem(storeIndex);
      const parsedData = storeDataString ? (JSON.parse(storeDataString) as DataItem[]) : [];
      const storeData = Array.isArray(parsedData) ? parsedData : [];
      localStorage.setItem(storeIndex, JSON.stringify([...storeData, ...practiceState.items]));
    };

    const onClearStore = () => {
      if (!storeIndex) return;
      localStorage.setItem(storeIndex, JSON.stringify([]));
    };

    // ── Custom Store management ──────────────────────────
    const handleAddCustomStore = () => {
      const next = addStore(newStoreName);
      setStoreList(next);
      setNewStoreName('');
      // Select the newly added store
      const added = next[next.length - 1];
      if (added) setStoreIndex(added.range);
    };

    const handleRemoveCustomStore = (range: string) => {
      const next = removeStore(range);
      setStoreList(next);
      if (storeIndex === range) {
        setStoreIndex(next[0]?.range ?? '');
      }
    };

    const handleRenameCustomStore = (range: string, name: string) => {
      // Update local state immediately so the input stays responsive,
      // then persist the change to localStorage.
      const next = storeList.map((store) =>
        store.range === range ? { ...store, name } : store,
      );
      setStoreList(next);
      renameStore(range, name);
    };

    const handleCheckboxDarkChange = (e: ChangeEvent<HTMLInputElement>) => {
      setIsDark(e.target.checked);
    };

    const handleThemeModeChange = (event: ChangeEvent<HTMLSelectElement>) => {
      const selectedTheme = event.target.value === THEME_2 ? THEME_2 : THEME_1;
      setThemeMode(selectedTheme);
    };

    return (
      <div
        className={`right sticky-config-card ${isSticky === 'Y' ? 'sticky-ai-float' : ''} ${
          isVisible ? '' : 'sticky-item-hidden'
        } ${isOpen ? 'open' : ''}`}
        style={
          isSticky === 'Y' && typeof stickyBottom === 'number'
            ? { bottom: `${isOpen ? stickyBottomContent : stickyBottom}px` }
            : undefined
        }
      >
        <div
          id="sticky-config-panel"
          className={`collapse-content sticky-config-pop-wrap ${isOpen ? 'open' : ''}`}
        >
          <div className="sticky-config-content">
            {/* ─── API Keys Config Section ─────────────── */}
            <div className="sticky-config-section">
              <div className="common-toggle" onClick={() => toggleCollapse('sticky-api-config')}>
                API Keys
              </div>
              <div className="collapse-content" id="sticky-api-config">
                <div className="home-config-grid">
                  <label className="home-config-field">
                    <span>Gemini Keys (key1;key2)</span>
                    <input
                      className="common-input"
                      type="text"
                      value={gemKey ?? ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setGemKey(e.target.value)}
                      placeholder="key1;key2"
                    />
                  </label>
                  <label className="home-config-field">
                    <span>GitHub Models Keys (key1;key2)</span>
                    <input
                      className="common-input"
                      type="text"
                      value={githubKey ?? ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setGithubKey(e.target.value)}
                      placeholder="token1;token2"
                    />
                  </label>
                  <label className="home-config-field">
                    <span>Google Sheet Key</span>
                    <input
                      className="common-input"
                      type="text"
                      value={googleSheetKey ?? ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setGoogleSheetKey(e.target.value)
                      }
                      placeholder="google sheet key"
                    />
                  </label>
                  <label className="home-config-field">
                    <span>API Key</span>
                    <input
                      className="common-input"
                      type="text"
                      value={apiKey ?? ''}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
                      placeholder="api key"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="common-toggle" onClick={() => toggleCollapse('option-config')}>
              Option
            </div>
            <div className="collapse-content open" id="option-config">
              <div className="home-config-grid" style={{ marginTop: '12px' }}>
                <label className="app-dark-switch">
                  <input type="checkbox" onChange={handleCheckboxDarkChange} checked={isDark} />
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
                <label className="home-config-field">
                  <span>Show Loading</span>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <label>
                      <input
                        type="radio"
                        name="showLoading"
                        value="Y"
                        checked={showLoading === 'Y'}
                        onChange={(e) => setShowLoading(e.target.value)}
                      />
                      On
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="showLoading"
                        value="N"
                        checked={showLoading === 'N'}
                        onChange={(e) => setShowLoading(e.target.value)}
                      />
                      Off
                    </label>
                  </div>
                </label>
              </div>
            </div>
            {/* ─── Practice Config Section ─── */}
            {
              <div className="sticky-config-section">
                <div
                  className="common-toggle"
                  onClick={() => toggleCollapse('sticky-pract-config')}
                >
                  Practice Config
                </div>
                <div className="collapse-content open" id="sticky-pract-config">
                  {/* Sheet selector */}
                  <div className="sticky-config-row">
                    <label className="sticky-config-label">Sheet</label>
                    <select
                      className="common-input inline"
                      value={practiceState.sheet}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        if (e.target.value && e.target.value !== practiceState.sheet) {
                          practiceDispatch({ type: 'SET_SHEET', payload: e.target.value });
                        }
                      }}
                    >
                      {[...SHEET_AUTO, ...storeList, ...SHEET_LIST].map((option) => (
                        <option key={option.range} value={option.range}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                    <span className="sticky-config-count">{practiceState.items.length}</span>
                    <button className="common-btn" onClick={practiceReload} title="Reload">
                      ↻
                    </button>
                  </div>

                  {/* Voice selector */}
                  <div className="sticky-config-row">
                    <label className="sticky-config-label">Voice</label>
                    <select
                      className="common-input inline"
                      value={practiceState.voiceIndex || ''}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        practiceDispatch({
                          type: 'SET_VOICE_INDEX',
                          payload: Number(e.target.value),
                        });
                      }}
                    >
                      <option value="">Default</option>
                      {practiceState.voices.map((v: SpeechSynthesisVoice, idx: number) => (
                        <option key={v.voiceURI} value={idx}>
                          {`${v.lang} - ${v.name}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Rate */}
                  <div className="sticky-config-row">
                    <label className="sticky-config-label">
                      Speed: <span className="rate-value">{practiceState.rate}</span>
                    </label>
                    <input
                      type="range"
                      className="width-220 range-input inline"
                      min="0.2"
                      max="2"
                      value={practiceState.rate}
                      step="0.1"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        practiceDispatch({ type: 'SET_RATE', payload: Number(e.target.value) });
                      }}
                    />
                  </div>

                  {/* Volume */}
                  <div className="sticky-config-row">
                    <label className="sticky-config-label">
                      🔊 <span className="rate-value">{practiceState.volume}</span>
                    </label>
                    <input
                      type="range"
                      className="width-220 range-input inline"
                      min="0.1"
                      max="1"
                      value={practiceState.volume}
                      step="0.1"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        practiceDispatch({ type: 'SET_VOLUME', payload: Number(e.target.value) });
                      }}
                    />
                  </div>

                  {/* Order/Random */}
                  <div className="sticky-config-row">
                    <label className="sticky-config-label">Order</label>
                    <select
                      className="common-input inline"
                      value={practiceState.oderRandomS}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        practiceDispatch({ type: 'SET_ORDER', payload: e.target.value });
                      }}
                    >
                      <option value="random">random</option>
                      <option value="order">order</option>
                    </select>
                  </div>

                  {/* Store Add/Clear */}
                  <div className="sticky-config-row">
                    <label className="sticky-config-label">Store</label>
                    <select
                      id="sticky-store-index"
                      name="sticky-store-index"
                      className="common-input inline"
                      value={storeIndex}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        setStoreIndex(e.target.value);
                      }}
                    >
                      {storeList.map((store) => (
                        <option key={store.range} value={store.range}>
                          {store.name}
                        </option>
                      ))}
                    </select>
                    <button className="common-btn" onClick={onAddStore}>
                      Add
                    </button>
                    <button className="common-btn" onClick={onClearStore}>
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            }
            {/* ─── Custom Store Section ─── */}
            {
              <div className="sticky-config-section">
                <div
                  className="common-toggle"
                  onClick={() => toggleCollapse('sticky-custom-store')}
                >
                  Custom Store
                </div>
                <div className="collapse-content" id="sticky-custom-store">
                  {storeList.length === 0 && (
                    <div className="sticky-config-row">
                      <span className="sticky-config-label">No stores yet.</span>
                    </div>
                  )}
                  {storeList.map((store) => (
                    <div className="sticky-config-row" key={store.range}>
                      <input
                        className="common-input inline"
                        type="text"
                        value={store.name}
                        placeholder="Display name"
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handleRenameCustomStore(store.range, e.target.value)
                        }
                      />
                      <span className="sticky-config-count">
                        {(() => {
                          const raw =
                            typeof window !== 'undefined'
                              ? localStorage.getItem(store.range)
                              : null;
                          try {
                            const parsed = raw ? JSON.parse(raw) : [];
                            return Array.isArray(parsed) ? parsed.length : 0;
                          } catch {
                            return 0;
                          }
                        })()}
                      </span>
                      <button
                        className="common-btn"
                        title="Delete store"
                        onClick={() => handleRemoveCustomStore(store.range)}
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                  <div className="sticky-config-row">
                    <input
                      className="common-input inline"
                      type="text"
                      value={newStoreName}
                      placeholder="New store name"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setNewStoreName(e.target.value)
                      }
                    />
                    <button className="common-btn" onClick={handleAddCustomStore}>
                      Add Store
                    </button>
                  </div>
                </div>
              </div>
            }
            {
              <div className="sticky-config-section">
                <div
                  className="common-toggle"
                  onClick={() => toggleCollapse('sticky-pract-notify')}
                >
                  Notify
                </div>
                <div className="collapse-content open" id="sticky-pract-notify">
                  <Notify />
                </div>
              </div>
            }
          </div>
        </div>
        <button
          type="button"
          className={`sticky-ai-toggle ${isOpen ? 'open' : ''}`}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Collapse config panel' : 'Expand config panel'}
          aria-controls="sticky-config-panel"
          onClick={() => {
            const nextIsOpen = !isOpen;
            onOpen?.(nextIsOpen);
            setIsOpen(nextIsOpen);
          }}
        >
          <FaCog style={{ fontSize: 20 }} aria-hidden="true" />
          <svg className="sticky-ai-toggle-caret" viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path
              d="M7.4 9.4a1 1 0 0 1 1.4 0L12 12.6l3.2-3.2a1 1 0 0 1 1.4 1.4l-3.9 3.9a1 1 0 0 1-1.4 0l-3.9-3.9a1 1 0 0 1 0-1.4z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    );
  },
);

StickyConfig.displayName = 'StickyConfig';

export default StickyConfig;
