'use client';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

interface UseSpeechSynthesisOptions {
  onEnd?: () => void;
}

interface SpeechConfig {
  voice?: number;
  rate?: number;
  volume?: number;
}

interface NavigatorWithAudioSession extends Navigator {
  audioSession?: {
    type?: string;
  };
}

export interface UseSpeechSynthesisResult {
  speak: (utterance: SpeechSynthesisUtterance) => void;
  speakText: (speakStr: string, isEng: boolean, config?: SpeechConfig) => void;
  cancel: () => void;
  pause: () => void;
  resume: () => void;
  speaking: boolean;
  paused: boolean;
  supported: boolean;
  voices: SpeechSynthesisVoice[];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getInitialVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  return window.speechSynthesis.getVoices();
}

function trySetIOSPlaybackAudioSession(isIOS: boolean): void {
  if (!isIOS || typeof navigator === 'undefined') return;

  try {
    const nav = navigator as NavigatorWithAudioSession;
    if (nav.audioSession && nav.audioSession.type !== 'playback') {
      nav.audioSession.type = 'playback';
    }
  } catch {
    // iOS may block this in some contexts; safe to ignore.
  }
}

/**
 * Custom hook for Web Speech API synthesis.
 * Includes iOS/Safari-safe speech triggering and voice fallback selection.
 */
export function useSpeechSynthesis(options?: UseSpeechSynthesisOptions): UseSpeechSynthesisResult {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(getInitialVoices);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const hasPrimedIOSRef = useRef(false);

  const isIOS = useMemo((): boolean => {
    if (typeof navigator === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }, []);

  // Load available voices.
  useEffect(() => {
    if (!supported) return;

    const synth = window.speechSynthesis;

    const handleVoicesChanged = () => {
      setVoices(synth.getVoices());
    };

    handleVoicesChanged();
    synth.addEventListener('voiceschanged', handleVoicesChanged);

    return () => {
      synth.removeEventListener('voiceschanged', handleVoicesChanged);
    };
  }, [supported]);

  // Keep iOS in playback audio session so output can route to connected Bluetooth devices.
  useEffect(() => {
    if (!supported || !isIOS) return;

    const setPlaybackSession = () => trySetIOSPlaybackAudioSession(isIOS);
    setPlaybackSession();

    document.addEventListener('visibilitychange', setPlaybackSession);

    return () => {
      document.removeEventListener('visibilitychange', setPlaybackSession);
    };
  }, [supported, isIOS]);

  // Prime iOS speech engine once after first user interaction.
  useEffect(() => {
    if (!supported || !isIOS) return;

    const primeIOSSpeech = () => {
      if (hasPrimedIOSRef.current) return;
      hasPrimedIOSRef.current = true;

      trySetIOSPlaybackAudioSession(isIOS);

      const synth = window.speechSynthesis;
      const primer = new window.SpeechSynthesisUtterance(' ');
      primer.volume = 0;
      primer.rate = 1;
      primer.lang = 'en-US';

      // Don't immediately cancel: let iOS initialize speech/audio route cleanly.
      synth.speak(primer);
    };

    window.addEventListener('touchstart', primeIOSSpeech, { once: true, passive: true });
    window.addEventListener('click', primeIOSSpeech, { once: true, passive: true });

    return () => {
      window.removeEventListener('touchstart', primeIOSSpeech);
      window.removeEventListener('click', primeIOSSpeech);
    };
  }, [supported, isIOS]);

  const speak = useCallback(
    (utterance: SpeechSynthesisUtterance) => {
      if (!supported) return;

      const synth = window.speechSynthesis;

      utterance.onstart = () => {
        setSpeaking(true);
        setPaused(false);
      };
      utterance.onend = () => {
        setSpeaking(false);
        setPaused(false);
        options?.onEnd?.();
      };
      utterance.onerror = () => {
        setSpeaking(false);
        setPaused(false);
      };

      const runSpeak = () => {
        trySetIOSPlaybackAudioSession(isIOS);
        synth.speak(utterance);
      };

      if (synth.speaking || synth.pending) {
        synth.cancel();
      }

      // iOS Safari is more reliable with a short delay after cancel/session updates.
      if (isIOS) {
        window.setTimeout(runSpeak, 140);
      } else {
        runSpeak();
      }
    },
    [supported, options, isIOS],
  );

  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  }, [supported]);

  const pause = useCallback(() => {
    if (!supported || !speaking) return;
    window.speechSynthesis.pause();
    setPaused(true);
  }, [supported, speaking]);

  const resume = useCallback(() => {
    if (!supported || !paused) return;
    trySetIOSPlaybackAudioSession(isIOS);
    window.speechSynthesis.resume();
    setPaused(false);
  }, [supported, paused, isIOS]);

  const speakText = useCallback(
    (speakStr: string, isEng: boolean, config?: SpeechConfig): void => {
      if (!supported) return;

      const text = (speakStr || '').trim();
      if (!text) return;

      const requestedIndex = Number(config?.voice ?? 0);
      const selectedVoice = Number.isFinite(requestedIndex) ? voices[requestedIndex] : undefined;
      const fallbackLangPrefix = isEng ? 'en' : 'vi';
      const fallbackVoice = voices.find((voice) =>
        voice.lang?.toLowerCase().startsWith(fallbackLangPrefix),
      );

      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.voice = selectedVoice ?? fallbackVoice ?? null;
      utterance.lang = utterance.voice?.lang || (isEng ? 'en-US' : 'vi-VN');
      utterance.rate = clamp(Number(config?.rate ?? 0.6), 0.1, 10);
      utterance.volume = clamp(Number(config?.volume ?? 1), 0, 1);

      speak(utterance);
    },
    [supported, voices, speak],
  );

  return {
    speak,
    speakText,
    cancel,
    pause,
    resume,
    speaking,
    paused,
    supported,
    voices,
  };
}
