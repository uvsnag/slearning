import { useState, useEffect, useCallback } from 'react';

interface UseSpeechSynthesisOptions {
  onEnd?: () => void;
}

export interface UseSpeechSynthesisResult {
  speak: (utterance: SpeechSynthesisUtterance) => void;
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

  return {
    speak,
    cancel,
    pause,
    resume,
    speaking,
    paused,
    supported,
    voices,
  };
}
