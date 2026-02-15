'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  language?: string;
}

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  language: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechWindow extends Window {
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  SpeechRecognition?: new () => SpeechRecognitionLike;
}

export interface UseSpeechRecognitionResult {
  transcript: string;
  interimTranscript: string;
  finalTranscript: string;
  resetTranscript: () => void;
  listening: boolean;
  browserSupportsSpeechRecognition: boolean;
  isMicrophoneAvailable: boolean;
  startListening: (options?: UseSpeechRecognitionOptions) => void;
  stopListening: () => void;
  abortListening: () => void;
}

/**
 * Custom hook for Web Speech API recognition
 * Replaces deprecated react-speech-recognition
 */
export function useSpeechRecognition(): UseSpeechRecognitionResult {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [isMicrophoneAvailable, setIsMicrophoneAvailable] = useState(true);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalTranscriptRef = useRef('');
  const shouldRestartRef = useRef(false);
  const isStoppingRef = useRef(false);

  const browserSupportsSpeechRecognition =
    typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  // Initialize recognition
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) return;

    const speechWindow = window as SpeechWindow;
    const SpeechRecognitionAPI =
      speechWindow.webkitSpeechRecognition || speechWindow.SpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    recognitionRef.current = new SpeechRecognitionAPI();
    const recognition = recognitionRef.current;

    recognition.onstart = () => {
      setListening(true);
      setIsMicrophoneAvailable(true);
      isStoppingRef.current = false;
    };

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let interim = '';
      let nextFinal = finalTranscriptRef.current;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0].transcript.trim();
        if (!transcriptChunk) continue;

        if (event.results[i].isFinal) {
          nextFinal = nextFinal ? `${nextFinal} ${transcriptChunk}` : transcriptChunk;
        } else {
          interim = interim ? `${interim} ${transcriptChunk}` : transcriptChunk;
        }
      }

      finalTranscriptRef.current = nextFinal;
      setFinalTranscript(nextFinal);
      setInterimTranscript(interim);
      setTranscript([nextFinal, interim].filter(Boolean).join(' ').trim());
    };

    recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
      if (
        event.error === 'not-allowed' ||
        event.error === 'service-not-allowed' ||
        event.error === 'audio-capture'
      ) {
        setIsMicrophoneAvailable(false);
      }
      console.log('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setListening(false);

      if (shouldRestartRef.current && !isStoppingRef.current) {
        setTimeout(() => {
          try {
            recognition.start();
          } catch (error) {
            console.log('Speech recognition restart error:', error);
          }
        }, 120);
      }
    };

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [browserSupportsSpeechRecognition]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setFinalTranscript('');
    finalTranscriptRef.current = '';
  }, []);

  const startListening = useCallback(
    (options?: UseSpeechRecognitionOptions) => {
      if (!browserSupportsSpeechRecognition || !recognitionRef.current) return;

      const recognition = recognitionRef.current;
      const continuous = options?.continuous ?? false;
      const language = options?.language ?? 'en-US';
      shouldRestartRef.current = continuous;
      isStoppingRef.current = false;

      recognition.continuous = continuous;
      recognition.interimResults = true;
      recognition.language = language;

      try {
        recognition.start();
      } catch (error) {
        console.log('Speech recognition already started or error:', error);
      }
    },
    [browserSupportsSpeechRecognition],
  );

  const stopListening = useCallback(() => {
    if (!browserSupportsSpeechRecognition || !recognitionRef.current) return;
    shouldRestartRef.current = false;
    isStoppingRef.current = true;
    recognitionRef.current.stop();
  }, [browserSupportsSpeechRecognition]);

  const abortListening = useCallback(() => {
    if (!browserSupportsSpeechRecognition || !recognitionRef.current) return;
    shouldRestartRef.current = false;
    isStoppingRef.current = true;
    recognitionRef.current.abort();
  }, [browserSupportsSpeechRecognition]);

  return {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    startListening,
    stopListening,
    abortListening,
  };
}

/**
 * Static method for browser support check
 */
export const browserSupportsSpeechRecognition =
  typeof window !== 'undefined' &&
  ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
