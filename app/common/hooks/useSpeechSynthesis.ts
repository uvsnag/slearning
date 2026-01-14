'use client';
import { useState, useEffect, useCallback } from 'react';

interface UseSpeechSynthesisOptions {
  onEnd?: () => void;
}
// interface ConfigControl {
//   voice: number;
//   rate: number;
//   volume: number;
// }
export interface UseSpeechSynthesisResult {
  speak: (utterance: SpeechSynthesisUtterance) => void;
  speakText: (speakStr: string, isEng: boolean, config: any) => void;
  cancel: () => void;
  pause: () => void;
  resume: () => void;
  speaking: boolean;
  paused: boolean;
  supported: boolean;
  voices: SpeechSynthesisVoice[];
}

/**
 * Custom hook for Web Speech API synthesis
 * Replaces deprecated react-speech-kit
 */
export function useSpeechSynthesis(options?: UseSpeechSynthesisOptions): UseSpeechSynthesisResult {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Load available voices
  useEffect(() => {
    if (!supported) return;

    const synth = window.speechSynthesis;

    // Handle voices loaded
    const handleVoicesChanged = () => {
      setVoices(synth.getVoices());
    };

    // Initial load
    setVoices(synth.getVoices());

    // Listen for voice changes
    synth.addEventListener('voiceschanged', handleVoicesChanged);

    return () => {
      synth.removeEventListener('voiceschanged', handleVoicesChanged);
    };
  }, [supported]);

  const speak = useCallback(
    (utterance: SpeechSynthesisUtterance) => {
      if (!supported) return;

      const synth = window.speechSynthesis;

      // Set up event handlers
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => {
        setSpeaking(false);
        setPaused(false);
        options?.onEnd?.();
      };
      utterance.onerror = () => setSpeaking(false);

      // Speak
      synth.cancel(); // Cancel any ongoing speech
      synth.speak(utterance);
    },
    [supported, options],
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
    window.speechSynthesis.resume();
    setPaused(false);
  }, [supported, paused]);

  const speakText = (speakStr: string, isEng: boolean, config: any): void => {
    // const vVoiceElement = document.getElementById('voice') as HTMLSelectElement;
    // const vVoiceVieElement = document.getElementById('voiceVie') as HTMLSelectElement;
    // const vrateElement = document.getElementById('rate') as HTMLInputElement;

    const vVoice = config.voice || '0';
    const vVoiceVie = config.voice || '0';
    const vrate = config.rate || '0.6';

    const utterance = new window.SpeechSynthesisUtterance();

    utterance.text = speakStr;
    // utterance.lang = 'en-US';
    utterance.rate = Number(vrate);
    // utterance.pitch = pitch;
    if (isEng) {
      utterance.voice = voices[Number(vVoice)];
    } else {
      utterance.voice = voices[Number(vVoiceVie)];
    }
    utterance.volume = config.volume;
    speak(utterance);
  };

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
