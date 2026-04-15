'use client';
import { useEffect, useState, useRef, useCallback, FC } from 'react';
import './style-listen-mp3.css';
import { toggleCollapse } from '@/common/common.js';
import StackBtn from '@/app/common/components/StackButton';

// ── Types ────────────────────────────────────────────
interface SubtitleEntry {
  time: number; // seconds
  text: string;
}

// ── Constants ────────────────────────────────────────
const SKIP_TIME_VALUES = [2, 3, 5];
const NOT_VALUE_TIME = 1;
const FIXED_VALUE = 3;

// ── Helpers ──────────────────────────────────────────
function formatTime(s: number): string {
  if (isNaN(s)) return '0:00';
  const min = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function parseSubtitles(text: string): SubtitleEntry[] {
  const normalized = text.replace(/^\uFEFF/, '');
  const lines = normalized.split(/\r?\n/);

  const parseTimeToken = (
    hoursPart: string | undefined,
    minutesPart: string,
    secondsPart: string,
    fractionPart?: string,
  ) => {
    const hours = hoursPart ? parseInt(hoursPart, 10) : 0;
    const minutes = parseInt(minutesPart, 10);
    const seconds = parseInt(secondsPart, 10);
    const fractionRaw = fractionPart || '0';
    const fractionDivisor = Math.pow(10, fractionRaw.length);
    const fraction = parseInt(fractionRaw, 10) / fractionDivisor;
    return hours * 3600 + minutes * 60 + seconds + fraction;
  };

  // 1) Legacy/LRC-like parsing:
  // [mm:ss] text, [mm:ss.xx] text, [hh:mm:ss] text, [hh:mm:ss.xx] text
  // Also supports multiple tags on one line: [00:10.00][00:12.00]text
  const lrcResult: SubtitleEntry[] = [];
  const tagRegex = /\[(?:(\d{1,2}):)?(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g;
  for (const line of lines) {
    const matches = [...line.matchAll(tagRegex)];
    if (!matches.length) continue;
    const content = line.replace(tagRegex, '').trim();
    if (!content) continue;
    for (const match of matches) {
      const timeInSeconds = parseTimeToken(match[1], match[2], match[3], match[4]);
      lrcResult.push({ time: timeInSeconds, text: content });
    }
  }
  if (lrcResult.length > 0) {
    return lrcResult.sort((a, b) => a.time - b.time);
  }

  // 2) SRT fallback parsing
  // Example:
  // 1
  // 00:00:01,000 --> 00:00:04,000
  // Subtitle text
  const srtResult: SubtitleEntry[] = [];
  const srtBlocks = normalized.split(/\r?\n\r?\n+/);
  const srtTimeRegex = /(\d{1,2}):(\d{2}):(\d{2})(?:[,.](\d{1,3}))?/;
  for (const block of srtBlocks) {
    const blockLines = block
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (!blockLines.length) continue;
    const timeLineIdx = blockLines.findIndex((line) => line.includes('-->'));
    if (timeLineIdx < 0) continue;
    const timeLine = blockLines[timeLineIdx];
    const [startRaw] = timeLine.split('-->');
    if (!startRaw) continue;
    const startMatch = startRaw.trim().match(srtTimeRegex);
    if (!startMatch) continue;
    const start = parseTimeToken(startMatch[1], startMatch[2], startMatch[3], startMatch[4]);
    const content = blockLines
      .slice(timeLineIdx + 1)
      .join(' ')
      .trim();
    if (!content) continue;
    srtResult.push({ time: start, text: content });
  }
  return srtResult.sort((a, b) => a.time - b.time);
}

function buildGdriveProxyUrl(rawUrl: string, mode: 'text' | 'audio') {
  return `/api/gdrive-proxy?mode=${mode}&url=${encodeURIComponent(rawUrl.trim())}`;
}

// ── Component ────────────────────────────────────────
const ListenMp3: FC = () => {
  // Audio ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const subtitleListRef = useRef<HTMLUListElement>(null);
  const skipIndicatorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loopIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // State
  const [fileName, setFileName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [skipTime, setSkipTime] = useState(2);
  const [skipIndicator, setSkipIndicator] = useState('');

  // Loop state
  const [loopA, setLoopA] = useState<number | null>(null);
  const [loopB, setLoopB] = useState<number | null>(null);
  const [loopActive, setLoopActive] = useState(false);
  const [loopInfo, setLoopInfo] = useState('');

  // Custom loop state (from YT Sub)
  const [customLoopAs, setCustomLoopAs] = useState('');
  const [customLoopBs, setCustomLoopBs] = useState('');
  const customLoopAVal = useRef<number>(NOT_VALUE_TIME);
  const customLoopBVal = useRef<number>(NOT_VALUE_TIME);

  // Subtitle state
  const [subtitles, setSubtitles] = useState<SubtitleEntry[]>([]);
  const [activeSubIdx, setActiveSubIdx] = useState(-1);
  const [subtitleFileName, setSubtitleFileName] = useState('');
  const [showSubtitleSection, setShowSubtitleSection] = useState(false);
  const [subtitleStatus, setSubtitleStatus] = useState('');
  const [gdriveStatus, setGdriveStatus] = useState('');

  // Google Drive state
  const [gdriveMp3Url, setGdriveMp3Url] = useState('');
  const [gdriveSubUrl, setGdriveSubUrl] = useState('');

  // Refs for file inputs
  const mp3InputRef = useRef<HTMLInputElement>(null);
  const subInputRef = useRef<HTMLInputElement>(null);

  // Create audio on mount
  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const onLoadedMeta = () => setDuration(audio.duration);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMeta);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMeta);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
      if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
    };
  }, []);

  // ── Loop check on timeupdate ──
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (loopActive && loopB !== null && audio.currentTime >= loopB && loopA !== null) {
      audio.currentTime = loopA;
    }
  }, [currentTime, loopActive, loopA, loopB]);

  // ── Subtitle highlight ──
  useEffect(() => {
    if (!subtitles.length) return;
    let idx = -1;
    for (let i = subtitles.length - 1; i >= 0; i--) {
      if (currentTime >= subtitles[i].time) {
        idx = i;
        break;
      }
    }
    setActiveSubIdx(idx);
  }, [currentTime, subtitles]);

  // Scroll into view when active subtitle changes
  useEffect(() => {
    if (activeSubIdx < 0 || !subtitleListRef.current) return;
    const items = subtitleListRef.current.querySelectorAll('.lmp3-subtitle-item');
    if (items[activeSubIdx]) {
      items[activeSubIdx].scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [activeSubIdx]);

  // ── Custom loop interval (ported from YT Sub) ──
  const createInterval = useCallback(() => {
    const audio = audioRef.current;
    if (
      !audio ||
      customLoopAVal.current === NOT_VALUE_TIME ||
      customLoopBVal.current === NOT_VALUE_TIME
    )
      return;
    const periodLoop = customLoopBVal.current - customLoopAVal.current;
    if (periodLoop <= 0) return;
    audio.currentTime = customLoopAVal.current;
    if (!audio.paused) {
      // already playing
    } else {
      audio.play();
      setIsPlaying(true);
    }
    if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
    loopIntervalRef.current = setInterval(() => {
      if (customLoopAVal.current === NOT_VALUE_TIME || customLoopBVal.current === NOT_VALUE_TIME) {
        if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
        return;
      }
      if (audio) {
        audio.currentTime = customLoopAVal.current;
      }
    }, periodLoop * 1000);
  }, []);

  // ── Actions ────────────────────────────────────────

  const loadFile = (file: File) => {
    const audio = audioRef.current;
    if (!audio) return;
    const url = URL.createObjectURL(file);
    audio.src = url;
    setFileName(file.name);
    clearLoop();
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration), { once: true });
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const skipBack = () => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    audio.currentTime = Math.max(0, audio.currentTime - skipTime);
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio || !audio.src) return;
    audio.currentTime = Math.min(audio.duration, audio.currentTime + skipTime);
  };

  const addPoint = () => {
    const audio = audioRef.current;
    if (!audio || !audio.src || !audio.duration) return;
    if (loopA === null) {
      setLoopA(audio.currentTime);
      setLoopInfo(`Point A: ${formatTime(audio.currentTime)} — click again to set Point B`);
    } else if (loopB === null) {
      let bVal = audio.currentTime;
      let aVal = loopA;
      if (bVal < aVal) {
        [aVal, bVal] = [bVal, aVal];
        setLoopA(aVal);
      }
      setLoopB(bVal);
      setLoopActive(true);
      setLoopInfo(`Looping: ${formatTime(aVal)} → ${formatTime(bVal)}`);
      audio.currentTime = aVal;
    }
  };

  const clearLoop = () => {
    setLoopA(null);
    setLoopB(null);
    setLoopActive(false);
    setLoopInfo('');
  };

  const selectSkipTime = (val: number) => {
    setSkipTime(val);
    setSkipIndicator(`Skip: ${val}s`);
    if (skipIndicatorTimer.current) clearTimeout(skipIndicatorTimer.current);
    skipIndicatorTimer.current = setTimeout(() => setSkipIndicator(''), 1200);
  };

  const cycleSkipTime = () => {
    const idx = SKIP_TIME_VALUES.indexOf(skipTime);
    const next = SKIP_TIME_VALUES[(idx + 1) % SKIP_TIME_VALUES.length];
    selectSkipTime(next);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  };

  // ── Subtitle loading ──
  const applyLoadedSubtitles = (parsed: SubtitleEntry[], displayName: string) => {
    setSubtitles(parsed);
    setActiveSubIdx(-1);
    setShowSubtitleSection(true);
    setSubtitleFileName(displayName);
    if (parsed.length > 0) {
      setSubtitleStatus(`Loaded ${parsed.length} subtitle lines.`);
    } else {
      setSubtitleStatus('No valid subtitle lines found. Use [mm:ss] text or .srt format.');
    }
  };

  const loadSubtitleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseSubtitles(text);
      applyLoadedSubtitles(parsed, file.name);
    };
    reader.readAsText(file);
  };

  // ── Custom loop (from YT Sub) ──
  const handleBlurA = () => {
    if (customLoopAs) {
      customLoopAVal.current = Number(customLoopAs);
      if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
      createInterval();
    }
  };
  const handleBlurB = () => {
    if (customLoopBs) {
      customLoopBVal.current = Number(customLoopBs);
      if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
      createInterval();
    }
  };

  const changeTimeLoop = (isStart: boolean, isCre: boolean) => {
    const SECOND_UNIT = 0.1;
    if (isStart) {
      if (!customLoopAs) return;
      const value = (Number(customLoopAs) + (isCre ? SECOND_UNIT : -SECOND_UNIT)).toFixed(
        FIXED_VALUE,
      );
      setCustomLoopAs(value);
      if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
      customLoopAVal.current = Number(value);
      createInterval();
    } else {
      if (!customLoopBs) return;
      const value = (Number(customLoopBs) + (isCre ? SECOND_UNIT : -SECOND_UNIT)).toFixed(
        FIXED_VALUE,
      );
      setCustomLoopBs(value);
      if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
      customLoopBVal.current = Number(value);
      createInterval();
    }
  };

  const onAddPointCustom = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (customLoopAVal.current !== NOT_VALUE_TIME && customLoopBVal.current !== NOT_VALUE_TIME) {
      onClearCusLoop();
    }
    if (customLoopAVal.current === NOT_VALUE_TIME) {
      customLoopAVal.current = Number(audio.currentTime.toFixed(FIXED_VALUE));
      setCustomLoopAs(customLoopAVal.current.toString());
      if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
    } else if (customLoopBVal.current === NOT_VALUE_TIME) {
      customLoopBVal.current = Number(audio.currentTime.toFixed(FIXED_VALUE));
      setCustomLoopBs(customLoopBVal.current.toString());
      if (customLoopAVal.current > 1 && customLoopBVal.current > 1) {
        createInterval();
      }
    }
  };

  const onClearCusLoop = () => {
    customLoopAVal.current = NOT_VALUE_TIME;
    customLoopBVal.current = NOT_VALUE_TIME;
    setCustomLoopAs('');
    setCustomLoopBs('');
    if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
  };

  // ── Google Drive loading ──
  // MP3: stream through Next.js proxy so Google Drive URL formats and range requests work.
  const loadMp3FromGDrive = () => {
    if (!gdriveMp3Url.trim()) return;
    const audio = audioRef.current;
    if (!audio) return;
    const streamUrl = buildGdriveProxyUrl(gdriveMp3Url, 'audio');
    setGdriveStatus('Loading MP3 from Google Drive...');
    clearLoop();
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    audio.pause();

    audio.addEventListener(
      'loadedmetadata',
      () => {
        setDuration(audio.duration);
        setGdriveStatus('MP3 loaded from Google Drive.');
      },
      { once: true },
    );
    audio.addEventListener(
      'error',
      () => {
        setGdriveStatus('Failed to load MP3. Check Google Drive share permission and URL.');
      },
      { once: true },
    );

    audio.src = streamUrl;
    audio.load();
    setFileName('Google Drive MP3');
  };

  // Subtitle: fetch via our Next.js server-side proxy to avoid CORS.
  const loadSubFromGDrive = async () => {
    if (!gdriveSubUrl.trim()) return;
    try {
      setSubtitleStatus('Loading subtitle from Google Drive...');
      const proxyUrl = buildGdriveProxyUrl(gdriveSubUrl, 'text');
      const resp = await fetch(proxyUrl);
      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`Proxy returned ${resp.status}: ${errorText}`);
      }
      const text = await resp.text();
      const parsed = parseSubtitles(text);
      applyLoadedSubtitles(parsed, 'Google Drive Subtitle');
    } catch (err) {
      console.error('Failed to load subtitle from Google Drive:', err);
      setSubtitleStatus('Failed to load subtitle from Google Drive.');
    }
  };

  // ── Keyboard shortcuts ──
  const onControlKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      (e.target as HTMLElement).tagName === 'INPUT' ||
      (e.target as HTMLElement).tagName === 'TEXTAREA'
    )
      return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      skipBack();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      skipForward();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      togglePlay();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      cycleSkipTime();
    } else if (e.key === 'Shift') {
      e.preventDefault();
      onAddPointCustom();
    } else if (e.key === 'Control') {
      e.preventDefault();
      onClearCusLoop();
    }
    // YT Sub style fine-tune loop shortcuts
    if (e.key === '.') {
      changeTimeLoop(false, false);
    }
    if (e.key === '/') {
      changeTimeLoop(false, true);
    }
    if (e.key === ';') {
      changeTimeLoop(true, false);
    }
    if (e.key === "'") {
      changeTimeLoop(true, true);
    }
  };

  // ── Drag & Drop handlers ──
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  };

  // ── Computed ──
  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  // ── Render ─────────────────────────────────────────
  return (
    <div className="lmp3-page" tabIndex={0} onKeyDown={onControlKey}>
      <div className="lmp3-shell">
        {/* Upload MP3 */}
        <div
          className={`lmp3-upload-area${dragOver ? ' drag-over' : ''}`}
          onClick={() => mp3InputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div>📁 Click or drag to upload MP3</div>
          <input
            ref={mp3InputRef}
            type="file"
            accept=".mp3,audio/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files?.[0]) loadFile(e.target.files[0]);
            }}
          />
          {fileName && <div className="lmp3-file-name">{fileName}</div>}
        </div>

        {/* Progress Bar */}
        <div className="lmp3-progress-section">
          <div className="lmp3-progress-bar" ref={progressBarRef} onClick={handleProgressClick}>
            <div className="lmp3-progress-fill" style={{ width: `${progressPct}%` }} />
            {/* Loop markers */}
            {loopA !== null && duration > 0 && (
              <div className="lmp3-loop-marker" style={{ left: `${(loopA / duration) * 100}%` }} />
            )}
            {loopB !== null && duration > 0 && (
              <>
                <div
                  className="lmp3-loop-marker"
                  style={{ left: `${(loopB / duration) * 100}%` }}
                />
                {loopA !== null && (
                  <div
                    className="lmp3-loop-region"
                    style={{
                      left: `${(loopA / duration) * 100}%`,
                      width: `${((loopB - loopA) / duration) * 100}%`,
                    }}
                  />
                )}
              </>
            )}
          </div>
          <div className="lmp3-time-display">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="lmp3-controls">
          <input type="submit" className="common-btn" value="◀◀" onClick={skipBack} />
          <input
            type="submit"
            className="common-btn"
            value={isPlaying ? '⏸' : '▶'}
            onClick={togglePlay}
          />
          <input type="submit" className="common-btn" value="▶▶" onClick={skipForward} />
        </div>

        {/* Loop Section */}
        <div className="lmp3-loop-section">
          <input type="submit" className="common-btn" value="📌 Add Point" onClick={addPoint} />
          <input type="submit" className="common-btn" value="❌ Clear Loop" onClick={clearLoop} />
        </div>
        {loopInfo && <div className="lmp3-loop-info">{loopInfo}</div>}

        {/* Custom Loop Control (from YT Sub) */}
        <div className="common-toggle" onClick={() => toggleCollapse('lmp3-custom-loop')}>
          Custom Loop
        </div>
        <div id="lmp3-custom-loop" className="collapse-content ui-sub-panel">
          <div style={{ padding: '8px' }}>
            <div style={{ marginBottom: '6px' }}>
              <input
                type="submit"
                className="common-btn"
                value="Add point"
                onClick={onAddPointCustom}
              />
              <input type="submit" className="common-btn" value="Clear" onClick={onClearCusLoop} />
            </div>
            <div className="lmp3-loop-control">
              <input
                className="common-input"
                type="text"
                value={customLoopAs}
                onChange={(e) => setCustomLoopAs(e.target.value)}
                onBlur={handleBlurA}
              />
              <StackBtn
                onUp={() => changeTimeLoop(true, true)}
                onDown={() => changeTimeLoop(true, false)}
              />
              <span>-</span>
              <input
                type="text"
                className="common-input"
                value={customLoopBs}
                onChange={(e) => setCustomLoopBs(e.target.value)}
                onBlur={handleBlurB}
              />
              <StackBtn
                onUp={() => changeTimeLoop(false, true)}
                onDown={() => changeTimeLoop(false, false)}
              />
            </div>
          </div>
        </div>

        {/* Skip Time Config */}
        <div className="lmp3-config-section">
          <div className="lmp3-config-row">
            <label style={{ fontWeight: 700 }}>Jump:</label>
            <div className="lmp3-time-options">
              {SKIP_TIME_VALUES.map((t) => (
                <button
                  key={t}
                  className={`lmp3-time-opt${skipTime === t ? ' selected' : ''}`}
                  onClick={() => selectSkipTime(t)}
                >
                  {t}s
                </button>
              ))}
            </div>
            <span style={{ fontSize: '0.75rem', color: '#aaa' }}>(↑ to cycle)</span>
          </div>
          {skipIndicator && <div className="lmp3-skip-indicator">{skipIndicator}</div>}
        </div>

        {/* Subtitle Section */}
        {showSubtitleSection && (
          <div className="lmp3-subtitle-section">
            <h3>💬 Subtitles</h3>
            <div className="lmp3-subtitle-current">
              {activeSubIdx >= 0 ? subtitles[activeSubIdx].text : '—'}
            </div>
            <ul className="lmp3-subtitle-list" ref={subtitleListRef}>
              {subtitles.map((sub, i) => (
                <li
                  key={`${sub.time}-${i}`}
                  className={`lmp3-subtitle-item${i === activeSubIdx ? ' active' : ''}`}
                  onClick={() => {
                    const audio = audioRef.current;
                    if (audio && audio.src) {
                      audio.currentTime = sub.time;
                      if (audio.paused) {
                        audio.play();
                        setIsPlaying(true);
                      }
                    }
                  }}
                >
                  <span className="lmp3-sub-time">{formatTime(sub.time)}</span>
                  <span className="lmp3-sub-text">{sub.text}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Subtitle Upload */}
        <div className="lmp3-subtitle-upload" onClick={() => subInputRef.current?.click()}>
          📄 Click to import subtitle file (.txt/.lrc/.srt)
          {/* <div style={{ marginTop: '8px' }}>
            <input
              type="button"
              className="common-btn"
              value="Load Subtitle File"
              onClick={(e) => {
                e.stopPropagation();
                subInputRef.current?.click();
              }}
            />
          </div> */}
          <input
            ref={subInputRef}
            type="file"
            accept=".txt,.lrc,.srt"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files?.[0]) loadSubtitleFile(e.target.files[0]);
              e.currentTarget.value = '';
            }}
          />
          {subtitleFileName && <div className="lmp3-file-name">{subtitleFileName}</div>}
          {subtitleStatus && <div className="lmp3-subtitle-status">{subtitleStatus}</div>}
        </div>

        {/* Google Drive Section */}
        <div className="common-toggle" onClick={() => toggleCollapse('lmp3-gdrive')}>
          Google Drive
        </div>
        <div id="lmp3-gdrive" className="collapse-content ui-sub-panel">
          <div className="lmp3-gdrive-section" style={{ padding: '8px' }}>
            <div className="lmp3-gdrive-row">
              <label style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>MP3 URL:</label>
              <input
                type="text"
                className="common-input responsive-input-full"
                placeholder="Google Drive share link for MP3"
                value={gdriveMp3Url}
                onChange={(e) => setGdriveMp3Url(e.target.value)}
              />
              <input
                type="submit"
                className="common-btn"
                value="Load MP3"
                onClick={loadMp3FromGDrive}
              />
            </div>
            <div className="lmp3-gdrive-row">
              <label style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>Sub URL:</label>
              <input
                type="text"
                className="common-input responsive-input-full"
                placeholder="Google Drive share link for subtitle"
                value={gdriveSubUrl}
                onChange={(e) => setGdriveSubUrl(e.target.value)}
              />
              <input
                type="submit"
                className="common-btn"
                value="Load Sub"
                onClick={loadSubFromGDrive}
              />
            </div>
            {gdriveStatus && <div className="lmp3-subtitle-status">{gdriveStatus}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListenMp3;
