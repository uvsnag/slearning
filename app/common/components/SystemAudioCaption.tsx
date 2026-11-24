'use client';
/**
 * SystemAudioCaption
 * ------------------
 * Live English captions for audio PLAYED BY THE COMPUTER (e.g. a YouTube video in this tab).
 *
 * Browsers cannot read "what you hear" directly, so audio is captured with screen-share
 * (getDisplayMedia) -> user picks "This tab" (or a screen) and ticks "Share tab/system audio".
 * The captured audio track is then transcribed by one of two engines:
 *   - browser: Web Speech API fed with the audio track (recognition.start(track), Chrome 139+). Free, near real-time.
 *   - gemini : audio is cut into short chunks (MediaRecorder) and sent to Gemini for transcription
 *              (uses the Gemini key stored in localStorage, same as AI Board). Works in any Chromium/Edge.
 * The text is shown as a subtitle overlay inside `overlayContainerId` (portal), so it also works in fullscreen.
 */
import { FC, PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { GoogleGenAI } from '@google/genai';
import { KEY_GEMINI_NM } from '@/common/common.js';
import TranslatePopup from './TranslatePopup';
import './system-audio-caption.css';

type Engine = 'browser' | 'gemini';

interface SystemAudioCaptionProps {
  /** id of the element the subtitle overlay is rendered into (should be position: relative) */
  overlayContainerId: string;
  /** recognition language, default en-US */
  language?: string;
  /** called with every finalized sentence (optional, e.g. to build a transcript) */
  onFinalText?: (text: string) => void;
}

// ---- minimal Web Speech API typings (not in lib.dom for all TS versions) ----
interface SpeechRecognitionAlternativeLike {
  transcript: string;
}
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: SpeechRecognitionAlternativeLike;
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: (track?: MediaStreamTrack) => void;
  stop: () => void;
  abort: () => void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

const getSpeechRecognitionCtor = (): SpeechRecognitionCtor | null => {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
};

const KEY_ENGINE = 'sys-caption-engine';
const KEY_FONT = 'sys-caption-font';
const KEY_CHUNK = 'sys-caption-chunk';
const KEY_POS_PREFIX = 'sys-caption-pos-'; // + overlayContainerId -> {x,y} in % of the container

interface CaptionPos {
  x: number; // % of the container width from its left edge (center of the subtitle); <0 or >100 = outside the video
  y: number; // % of the container height from its top edge; <0 or >100 = outside the video
}
const clamp = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));
const GEMINI_MODEL = 'gemini-2.5-flash';
const CLEAR_AFTER_MS = 5000; // hide the subtitle after this long without new speech
const MAX_CHARS = 160; // keep the overlay to ~2 lines

const readLS = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const writeLS = (key: string, val: string): void => {
  try {
    localStorage.setItem(key, val);
  } catch {
    /* ignore */
  }
};

/** keep only the tail of the text so the overlay stays short */
const tail = (text: string): string => {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= MAX_CHARS) return t;
  const cut = t.slice(t.length - MAX_CHARS);
  const sp = cut.indexOf(' ');
  return sp > 0 ? cut.slice(sp + 1) : cut;
};

const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

const SystemAudioCaption: FC<SystemAudioCaptionProps> = ({ overlayContainerId, language = 'en-US', onFinalText }) => {
  const [active, setActive] = useState(false);
  const [engine, setEngine] = useState<Engine>('browser');
  const [fontSize, setFontSize] = useState(24);
  const [chunkSec, setChunkSec] = useState(5);
  const [finalText, setFinalText] = useState('');
  const [interimText, setInterimText] = useState('');
  const [status, setStatus] = useState('');
  const [overlayEl, setOverlayEl] = useState<HTMLElement | null>(null);
  const [pos, setPos] = useState<CaptionPos | null>(null); // null = default position (CSS)
  const [inFullscreen, setInFullscreen] = useState(false); // our container is fullscreen -> keep the sub inside it
  const [popupWord, setPopupWord] = useState(''); // clicked word -> Vietnamese meaning popup
  const [popupHost, setPopupHost] = useState<HTMLElement | null>(null);
  const draggingRef = useRef(false);
  const holdRef = useRef(false); // keep the subtitle on screen while the meaning popup is open
  const movedRef = useRef(false); // last pointer-down turned into a drag -> not a word click

  const activeRef = useRef(false);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seqRef = useRef(0); // gemini: chunk sequence sent
  const shownSeqRef = useRef(0); // gemini: newest chunk shown (ignore out-of-order replies)
  const contextRef = useRef(''); // gemini: previous text for continuity
  const onFinalRef = useRef(onFinalText);
  useEffect(() => {
    onFinalRef.current = onFinalText;
  }, [onFinalText]);

  // ---- restore settings & find overlay container ----
  useEffect(() => {
    const e = readLS(KEY_ENGINE);
    if (e === 'browser' || e === 'gemini') setEngine(e);
    else if (!getSpeechRecognitionCtor()) setEngine('gemini');
    const f = Number(readLS(KEY_FONT));
    if (f >= 12 && f <= 60) setFontSize(f);
    const c = Number(readLS(KEY_CHUNK));
    if (c >= 2 && c <= 15) setChunkSec(c);
  }, []);
  useEffect(() => {
    setOverlayEl(document.getElementById(overlayContainerId));
    try {
      const p = JSON.parse(readLS(KEY_POS_PREFIX + overlayContainerId) || 'null') as CaptionPos | null;
      if (p && typeof p.x === 'number' && typeof p.y === 'number') setPos(p);
    } catch {
      /* ignore */
    }
  }, [overlayContainerId]);

  const scheduleClear = useCallback(() => {
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    clearTimerRef.current = setTimeout(function clear() {
      if (draggingRef.current || holdRef.current) {
        clearTimerRef.current = setTimeout(clear, 1000); // keep it visible while the user drags it
        return;
      }
      setFinalText('');
      setInterimText('');
    }, CLEAR_AFTER_MS);
  }, []);

  // ---- stop everything ----
  const stop = useCallback(() => {
    activeRef.current = false;
    setActive(false);
    setStatus('');
    if (chunkTimerRef.current) clearTimeout(chunkTimerRef.current);
    if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    try {
      recognitionRef.current?.abort();
    } catch {
      /* ignore */
    }
    recognitionRef.current = null;
    try {
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
    } catch {
      /* ignore */
    }
    recorderRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setFinalText('');
    setInterimText('');
  }, []);

  useEffect(() => stop, [stop]); // cleanup on unmount

  useEffect(() => {
    const onFs = (): void => {
      const fs = document.fullscreenElement;
      setInFullscreen(!!fs && !!overlayEl && fs.contains(overlayEl));
    };
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, [overlayEl]);

  // ---- engine: Web Speech API with the captured audio track ----
  const startBrowserEngine = (track: MediaStreamTrack): void => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setStatus('Browser has no SpeechRecognition - switch engine to Gemini');
      stop();
      return;
    }
    const rec = new Ctor();
    rec.lang = language;
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        const txt = r[0].transcript;
        if (r.isFinal) {
          const clean = txt.trim();
          if (clean) {
            setFinalText((prev) => tail(`${prev} ${clean}`));
            onFinalRef.current?.(clean);
          }
        } else {
          interim += txt;
        }
      }
      setInterimText(interim.trim());
      scheduleClear();
    };
    rec.onerror = (e) => {
      if (e.error === 'no-speech' || e.error === 'aborted') return;
      setStatus(`Speech error: ${e.error}`);
    };
    // Chrome ends the session after silence / ~1 min -> restart while still active
    rec.onend = () => {
      if (!activeRef.current || recognitionRef.current !== rec) return;
      try {
        rec.start(track);
      } catch {
        /* already started */
      }
    };
    recognitionRef.current = rec;
    try {
      rec.start(track); // Chrome 139+: recognize a MediaStreamTrack instead of the microphone
      setStatus('Listening (browser)');
    } catch (err) {
      console.error(err);
      setStatus('This browser cannot recognize a tab audio track - switch engine to Gemini');
      stop();
    }
  };

  // ---- engine: Gemini chunk transcription ----
  const transcribeChunk = async (blob: Blob, seq: number, mimeType: string): Promise<void> => {
    if (blob.size < 2000) return; // basically silence / empty
    const raw = readLS(KEY_GEMINI_NM) || '';
    const apiKey = raw.split(/[;,]/).map((k) => k.trim()).filter(Boolean)[0]; // config stores key1;key2
    if (!apiKey) {
      setStatus('No Gemini key - set it in AI Board first');
      return;
    }
    try {
      const ai = new GoogleGenAI({ apiKey });
      const data = await blobToBase64(blob);
      const prompt =
        'Transcribe the English speech in this audio clip verbatim. ' +
        'Return ONLY the transcribed text with normal punctuation, no labels, no timestamps, no quotes. ' +
        'If there is no speech (only music or silence), return an empty string. ' +
        (contextRef.current
          ? `For context, the previous clip ended with: "${contextRef.current}". Do not repeat it.`
          : '');
      const res = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [{ role: 'user', parts: [{ inlineData: { mimeType: mimeType.split(';')[0], data } }, { text: prompt }] }],
      });
      const text = (res.text || '').replace(/^["']|["']$/g, '').trim();
      if (!activeRef.current || seq < shownSeqRef.current) return; // stale reply
      shownSeqRef.current = seq;
      if (!text) return;
      contextRef.current = text.slice(-120);
      setFinalText(tail(text));
      setInterimText('');
      onFinalRef.current?.(text);
      scheduleClear();
      setStatus('Listening (Gemini)');
    } catch (err) {
      console.error(err);
      setStatus(`Gemini error: ${(err as Error).message?.slice(0, 80) || err}`);
    }
  };

  const startGeminiEngine = (track: MediaStreamTrack, seconds: number): void => {
    const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'].find((m) =>
      MediaRecorder.isTypeSupported(m),
    );
    if (!mimeType) {
      setStatus('MediaRecorder cannot record audio in this browser');
      stop();
      return;
    }
    const audioOnly = new MediaStream([track]);
    seqRef.current = 0;
    shownSeqRef.current = 0;
    contextRef.current = '';
    // Each chunk is its own recorder so every blob is a complete, decodable file
    const recordChunk = (): void => {
      if (!activeRef.current) return;
      const parts: Blob[] = [];
      const rec = new MediaRecorder(audioOnly, { mimeType });
      recorderRef.current = rec;
      rec.ondataavailable = (e) => e.data.size && parts.push(e.data);
      rec.onstop = () => {
        const seq = ++seqRef.current;
        recordChunk(); // start next chunk right away (minimize gaps)
        void transcribeChunk(new Blob(parts, { type: mimeType }), seq, mimeType);
      };
      rec.start();
      chunkTimerRef.current = setTimeout(() => rec.state === 'recording' && rec.stop(), seconds * 1000);
    };
    recordChunk();
    setStatus('Listening (Gemini)');
  };

  // ---- start: capture tab/system audio ----
  const start = async (): Promise<void> => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      setStatus('Screen/tab audio capture is not supported in this browser');
      return;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getDisplayMedia({
        video: true, // Chrome requires video to offer the "share audio" checkbox
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          suppressLocalAudioPlayback: false, // keep hearing the video
        } as MediaTrackConstraints,
        // non-standard Chrome hints: suggest "This tab" and include system audio option
        preferCurrentTab: true,
        selfBrowserSurface: 'include',
        systemAudio: 'include',
      } as DisplayMediaStreamOptions);
    } catch (err) {
      console.warn(err);
      setStatus('Capture cancelled');
      return;
    }
    const audioTrack = stream.getAudioTracks()[0];
    if (!audioTrack) {
      stream.getTracks().forEach((t) => t.stop());
      setStatus('No audio shared - choose the tab and tick "Also share tab audio"');
      return;
    }
    stream.getVideoTracks().forEach((t) => t.stop()); // only audio is needed
    streamRef.current = stream;
    audioTrack.onended = () => stop(); // user pressed "Stop sharing"
    activeRef.current = true;
    setActive(true);
    if (engine === 'browser') startBrowserEngine(audioTrack);
    else startGeminiEngine(audioTrack, chunkSec);
  };

  const onChangeEngine = (val: Engine): void => {
    setEngine(val);
    writeLS(KEY_ENGINE, val);
    if (activeRef.current) stop(); // engine change needs a new capture
  };
  const changeFont = (delta: number): void => {
    const next = Math.min(60, Math.max(12, fontSize + delta));
    setFontSize(next);
    writeLS(KEY_FONT, String(next));
  };
  const onChangeChunk = (val: number): void => {
    setChunkSec(val);
    writeLS(KEY_CHUNK, String(val));
  };

  // ---- drag the subtitle to a new position (saved per container) ----
  const onDragStart = (e: ReactPointerEvent<HTMLDivElement>): void => {
    if (!overlayEl) return;
    e.preventDefault();
    e.stopPropagation();
    draggingRef.current = true;
    movedRef.current = false;
    const startX = e.clientX;
    const startY = e.clientY;
    // capture on the text box itself: without capture, moving over the YouTube iframe loses the events
    const target = e.target as HTMLElement;
    target.setPointerCapture(e.pointerId);
    let last: CaptionPos | null = null;
    const move = (ev: PointerEvent): void => {
      // small jitter = still a click on a word
      if (!movedRef.current && Math.hypot(ev.clientX - startX, ev.clientY - startY) < 5) return;
      movedRef.current = true;
      const r = overlayEl.getBoundingClientRect();
      // free move anywhere in the window (also outside the video); stored relative to the video
      // so the sub keeps its place next to the video when the page scrolls or the player is resized
      const px = clamp(ev.clientX, 10, window.innerWidth - 10);
      const py = clamp(ev.clientY, 10, window.innerHeight - 10);
      let x = ((px - r.left) / r.width) * 100;
      let y = ((py - r.top) / r.height) * 100;
      if (document.fullscreenElement) {
        x = clamp(x, 5, 95);
        y = clamp(y, 5, 95);
      }
      last = { x, y };
      setPos(last);
    };
    const up = (): void => {
      draggingRef.current = false;
      if (target.hasPointerCapture(e.pointerId)) target.releasePointerCapture(e.pointerId);
      target.removeEventListener('pointermove', move);
      target.removeEventListener('pointerup', up);
      target.removeEventListener('pointercancel', up);
      if (last) writeLS(KEY_POS_PREFIX + overlayContainerId, JSON.stringify(last));
    };
    target.addEventListener('pointermove', move);
    target.addEventListener('pointerup', up);
    target.addEventListener('pointercancel', up);
  };
  const resetPos = (): void => {
    setPos(null);
    try {
      localStorage.removeItem(KEY_POS_PREFIX + overlayContainerId);
    } catch {
      /* ignore */
    }
  };

  // ---- click a word -> Vietnamese meaning (same popup as AI Board) ----
  const onClickWord = (raw: string): void => {
    if (movedRef.current) return; // it was a drag, not a click
    const word = raw.replace(/^[^\p{L}\p{N}']+|[^\p{L}\p{N}']+$/gu, '');
    if (!word) return;
    // in fullscreen only the fullscreen element is visible -> render the popup inside it
    setPopupHost((document.fullscreenElement as HTMLElement | null) || document.body);
    holdRef.current = true;
    setPopupWord(word);
  };
  const closePopup = (): void => {
    holdRef.current = false;
    setPopupWord('');
    scheduleClear();
  };

  const caption = active ? tail(`${finalText} ${interimText}`) : '';
  // in fullscreen only the video is visible -> pull an outside position back onto it
  const shownPos = pos && inFullscreen ? { x: clamp(pos.x, 5, 95), y: clamp(pos.y, 5, 95) } : pos;
  const posStyle = shownPos
    ? { left: `${shownPos.x}%`, top: `${shownPos.y}%`, bottom: 'auto', transform: 'translate(-50%, -50%)' }
    : {};

  return (
    <span className="sys-caption-control" onKeyDown={(e) => e.stopPropagation()}>
      <span
        className={`sys-caption-btn${active ? ' sys-caption-on' : ''}`}
        title="Auto subtitle: transcribe the audio this computer plays (share this tab + tick 'Share tab audio')"
        onClick={() => (active ? stop() : void start())}
      >
        {active ? '■ Stop auto sub' : 'CC Auto sub'}
      </span>{' '}
      <select
        className="common-input sys-caption-select"
        value={engine}
        title="Recognition engine"
        onChange={(e) => onChangeEngine(e.target.value as Engine)}
      >
        <option value="browser">Browser (Chrome)</option>
        <option value="gemini">Gemini AI</option>
      </select>
      {engine === 'gemini' && (
        <select
          className="common-input sys-caption-select"
          value={chunkSec}
          title="Seconds of audio per Gemini request (smaller = faster, more requests)"
          onChange={(e) => onChangeChunk(Number(e.target.value))}
        >
          {[3, 4, 5, 6, 8, 10].map((s) => (
            <option key={s} value={s}>
              {s}s
            </option>
          ))}
        </select>
      )}{' '}
      <span className="sys-caption-btn" title="Smaller subtitle" onClick={() => changeFont(-2)}>
        A-
      </span>
      <span className="sys-caption-btn" title="Bigger subtitle" onClick={() => changeFont(2)}>
        A+
      </span>
      {pos && (
        <span className="sys-caption-btn" title="Put the subtitle back to the default position" onClick={resetPos}>
          ↺ Pos
        </span>
      )}
      {status && <span className="sys-caption-status"> {status}</span>}
      {overlayEl &&
        caption &&
        createPortal(
          <div
            className="sys-caption-overlay"
            style={{ fontSize, ...posStyle }}
            title="Drag to move, click a word for its Vietnamese meaning"
            onPointerDown={onDragStart}
          >
            <span>
              {caption.split(' ').map((w, i) => (
                <span key={i}>
                  {i > 0 && ' '}
                  <span className="sys-caption-word" onClick={() => onClickWord(w)}>
                    {w}
                  </span>
                </span>
              ))}
            </span>
          </div>,
          overlayEl,
        )}
      {popupHost &&
        createPortal(<TranslatePopup open={!!popupWord} word={popupWord} onClose={closePopup} />, popupHost)}
    </span>
  );
};

export default SystemAudioCaption;
