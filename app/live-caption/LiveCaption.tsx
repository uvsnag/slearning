'use client';
/**
 * Live Caption screen: turns English speech played by the computer (YouTube in another tab,
 * a meeting, a podcast...) into text. Live text appears on the caption stage, every finished
 * sentence is kept in the transcript below (copy / download / clear).
 */
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import SystemAudioCaption from '@/app/common/components/SystemAudioCaption';
import './style-live-caption.css';

interface TranscriptLine {
  time: string;
  text: string;
}

const KEY_TRANSCRIPT = 'live-caption-transcript';
const MAX_LINES = 500;

const LiveCaption: FC = () => {
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const [copied, setCopied] = useState(false);
  const listEndRef = useRef<HTMLDivElement | null>(null);
  const restoredRef = useRef(false);

  // restore last transcript (after mount: localStorage is not available during SSR)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY_TRANSCRIPT);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLines(JSON.parse(raw) as TranscriptLine[]);
    } catch {
      /* ignore */
    }
    restoredRef.current = true;
  }, []);

  useEffect(() => {
    if (!restoredRef.current) return; // don't overwrite the saved transcript before it is restored
    try {
      localStorage.setItem(KEY_TRANSCRIPT, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
    listEndRef.current?.scrollIntoView({ block: 'nearest' });
  }, [lines]);

  const onFinalText = useCallback((text: string) => {
    const time = new Date().toLocaleTimeString([], { hour12: false });
    setLines((prev) => [...prev, { time, text }].slice(-MAX_LINES));
  }, []);

  const plainText = (): string => lines.map((l) => l.text).join('\n');

  const onCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(plainText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  const onDownload = (): void => {
    const content = lines.map((l) => `[${l.time}] ${l.text}`).join('\n');
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `live-caption-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onClear = (): void => {
    if (lines.length && !confirm('Clear the whole transcript?')) return;
    setLines([]);
  };

  return (
    <div className="lc-page">
      <h2 className="lc-title">Live Caption – computer audio to English text</h2>

      <div className="lc-toolbar">
        <SystemAudioCaption overlayContainerId="lc-stage" language="en-US" onFinalText={onFinalText} />
      </div>

      <div id="lc-stage" className="lc-stage">
        <div className="lc-stage-hint">Live text appears here</div>
      </div>

      <div className="lc-transcript-head">
        <b>Transcript</b> <span className="lc-count">({lines.length} lines)</span>
        <span className="sys-caption-btn" onClick={() => void onCopy()}>
          {copied ? 'Copied!' : 'Copy'}
        </span>
        <span className="sys-caption-btn" onClick={onDownload}>
          Download .txt
        </span>
        <span className="sys-caption-btn" onClick={onClear}>
          Clear
        </span>
      </div>
      <div className="lc-transcript">
        {lines.length === 0 && <div className="lc-empty">No text yet.</div>}
        {lines.map((l, i) => (
          <div key={i} className="lc-line">
            <span className="lc-time">{l.time}</span>
            <span className="lc-text">{l.text}</span>
          </div>
        ))}
        <div ref={listEndRef} />
      </div>

      <details className="lc-help">
        <summary>How to use</summary>
        <ol>
          <li>Open the video / audio you want to caption (e.g. YouTube in another Chrome/Edge tab).</li>
          <li>
            Click <b>CC Auto sub</b>. In the share dialog choose that <b>tab</b> (or <b>Entire screen</b> for audio
            from other apps on Windows) and tick <b>Share tab audio / Share system audio</b>.
          </li>
          <li>Play the video. Text shows on the stage above and finished sentences are saved to the transcript.</li>
          <li>
            Engine <b>Browser (Chrome)</b>: free, real-time, needs a recent Chrome. If it transcribes your microphone
            instead of the video, your browser is too old – switch to <b>Gemini AI</b> (uses the Gemini key saved in
            AI Board, text arrives every few seconds).
          </li>
        </ol>
      </details>
    </div>
  );
};

export default LiveCaption;
