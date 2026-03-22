'use client';

import { useEffect, useRef, useState } from 'react';
import { FaVolumeUp } from 'react-icons/fa';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface TranslatePopupProps {
  open: boolean;
  word: string;
  onClose: () => void;
  onSpeakProp?: (word: string) => void;
}

const TranslatePopup = ({ open, word, onClose, onSpeakProp }: TranslatePopupProps) => {
  const [meaning, setMeaning] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const meaningCacheRef = useRef<Record<string, string>>({});
  const requestIdRef = useRef<number>(0);
  const { speakText, voices, cancel, speaking } = useSpeechSynthesis();

  useEffect(() => {
    if (!open || !word) return;
    const normalizedWord = word.toLowerCase();
    if (meaningCacheRef.current[normalizedWord]) {
      setMeaning(meaningCacheRef.current[normalizedWord]);
      setLoading(false);
      setError('');
      return;
    }

    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setMeaning('');
    setLoading(true);
    setError('');

    const fetchMeaning = async (): Promise<void> => {
      try {
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
            normalizedWord,
          )}&langpair=en|vi`,
        );
        const data = await response.json();
        const translated = data?.responseData?.translatedText;
        const resolvedMeaning =
          typeof translated === 'string' && translated.trim()
            ? translated.trim()
            : 'No meaning found.';
        if (requestIdRef.current !== requestId) return;
        meaningCacheRef.current[normalizedWord] = resolvedMeaning;
        setMeaning(resolvedMeaning);
        setLoading(false);
        setError('');
      } catch (err) {
        if (requestIdRef.current !== requestId) return;
        setMeaning('');
        setLoading(false);
        setError(String(err));
      }
    };

    void fetchMeaning();
  }, [open, word]);

  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: '0',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          padding: '2px',
          borderRadius: '8px',
          maxWidth: '420px',
          width: '70%',
        }}
        onClick={(e) => e.stopPropagation()}
        className="popup"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
          <b>{word}</b>{' '}
          <button
            type="button"
            className="common-btn"
            onClick={() => (onSpeakProp ? onSpeakProp(word) : speakText(word, true))}
          >
            <FaVolumeUp />
          </button>
        </div>
        <div style={{ marginTop: '8px' }}>
          {loading && 'Loading Vietnamese meaning...'}
          {!loading && !error && meaning}
          {!loading && error && `Error: ${error}`}
        </div>
        <button onClick={onClose} className="common-btn" style={{ marginTop: '12px' }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TranslatePopup;
