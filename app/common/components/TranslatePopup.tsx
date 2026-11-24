'use client';

import { useEffect, useRef, useState } from 'react';
import { FaVolumeUp } from 'react-icons/fa';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { translateText } from '../utils/translator';

interface TranslatePopupProps {
  open: boolean;
  word: string;
  onClose: () => void;
  onSpeakProp?: (word: string) => void;
}

const TranslatePopup = ({ open, word, onClose, onSpeakProp }: TranslatePopupProps) => {
  const [meaning, setMeaning] = useState<string>('');
  const [provider, setProvider] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const requestIdRef = useRef<number>(0);
  const { speakText } = useSpeechSynthesis();

  useEffect(() => {
    if (!open || !word) return;
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    const ctrl = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMeaning('');
    setProvider('');
    setLoading(true);
    setError('');

    // providers are tried in the order set in Config > Translate, with automatic fallback + cache
    translateText(word, { from: 'en', to: 'vi', signal: ctrl.signal })
      .then((res) => {
        if (requestIdRef.current !== requestId) return;
        setMeaning(res.text);
        setProvider(res.provider);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (requestIdRef.current !== requestId) return;
        setLoading(false);
        setError((err as Error)?.message || String(err));
      });
    return () => ctrl.abort();
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
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
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
        <div style={{ marginTop: '8px', whiteSpace: 'pre-line' }}>
          {loading && 'Loading Vietnamese meaning...'}
          {!loading && !error && meaning}
          {!loading && error && `All translate services failed: ${error}`}
        </div>
        {!loading && provider && (
          <div style={{ marginTop: '4px', fontSize: '11px', opacity: 0.6 }}>via {provider}</div>
        )}
        <button onClick={onClose} className="common-btn" style={{ marginTop: '12px' }}>
          Close
        </button>
      </div>
    </div>
  );
};

export default TranslatePopup;
