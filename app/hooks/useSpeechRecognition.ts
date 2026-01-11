'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  language?: string;
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

  const recognitionRef = useRef<any>(null);
  const interimRef = useRef('');

  const browserSupportsSpeechRecognition =
    typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  // Initialize recognition
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) return;

    const SpeechRecognitionAPI =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    recognitionRef.current = new SpeechRecognitionAPI();
    const recognition = recognitionRef.current;

    recognition.onstart = () => {
      setListening(true);
      setIsMicrophoneAvailable(true);
    };

    recognition.onresult = (event: any) => {
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          setFinalTranscript((prev) => prev + transcript + ' ');
        } else {
          interim += transcript;
        }
      }

      interimRef.current = interim;
      setInterimTranscript(interim);
      setTranscript(finalTranscript + interim);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        setIsMicrophoneAvailable(false);
      }
      console.log('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setListening(false);
    };

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [browserSupportsSpeechRecognition, finalTranscript]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setFinalTranscript('');
    interimRef.current = '';
  }, []);

  const startListening = useCallback(
    (options?: UseSpeechRecognitionOptions) => {
      if (!browserSupportsSpeechRecognition || !recognitionRef.current) return;

      const recognition = recognitionRef.current;
      recognition.continuous = options?.continuous ?? false;
      recognition.interimResults = true;
      recognition.language = options?.language ?? 'en-US';

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
    recognitionRef.current.stop();
  }, [browserSupportsSpeechRecognition]);

  const abortListening = useCallback(() => {
    if (!browserSupportsSpeechRecognition || !recognitionRef.current) return;
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
