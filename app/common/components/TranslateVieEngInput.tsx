'use client';

import VoiceToText from '@/app/common/components/VoiceToText';
import SheetDataEditor from '@/app/common/components/SheetDataEditor';
import { usePracticeContext } from '@/app/common/hooks/usePracticeStore';
import { useSpeechSynthesis } from '@/app/common/hooks/useSpeechSynthesis';
import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { FaCopy, FaPaste, FaTrash, FaVolumeUp } from 'react-icons/fa';

type TranslateLang = 'vi' | 'en';
type TranslateDirection = 'vi-to-en' | 'en-to-vi' | null;

const TRANSLATE_API_URL = 'https://api.mymemory.translated.net/get';
const TRANSLATE_DEBOUNCE_MS = 1000;

const TranslateVieEngInput = () => {
  const [vietnameseText, setVietnameseText] = useState<string>('');
  const [englishText, setEnglishText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [direction, setDirection] = useState<TranslateDirection>(null);

  const { speakText } = useSpeechSynthesis();
  const {
    state: { voiceIndex, voiceIndexVie, rate, volume },
  } = usePracticeContext();

  const cacheRef = useRef<Record<string, string>>({});
  const requestIdRef = useRef<number>(0);
  const lastEditedRef = useRef<TranslateLang | null>(null);
  const sheetEditorRef = useRef<HTMLDivElement | null>(null);

  const setVietnameseInput = useCallback((value: string): void => {
    lastEditedRef.current = 'vi';
    setVietnameseText(value);
  }, []);

  const setEnglishInput = useCallback((value: string): void => {
    lastEditedRef.current = 'en';
    setEnglishText(value);
  }, []);

  const setTargetText = useCallback((lang: TranslateLang, value: string): void => {
    if (lang === 'en') {
      setEnglishText(value);
      return;
    }
    setVietnameseText(value);
  }, []);

  const translateText = useCallback(
    async (
      rawText: string,
      sourceLang: TranslateLang,
      targetLang: TranslateLang,
    ): Promise<void> => {
      const inputText = rawText.trim();

      if (!inputText) {
        requestIdRef.current += 1;
        setTargetText(targetLang, '');
        setIsLoading(false);
        setError('');
        setDirection(null);
        return;
      }

      const cacheKey = `${sourceLang}|${targetLang}|${inputText}`;
      const cachedValue = cacheRef.current[cacheKey];
      if (cachedValue !== undefined) {
        setTargetText(targetLang, cachedValue);
        setIsLoading(false);
        setError('');
        setDirection(null);
        return;
      }

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setIsLoading(true);
      setError('');
      setDirection(sourceLang === 'vi' ? 'vi-to-en' : 'en-to-vi');

      try {
        const response = await fetch(
          `${TRANSLATE_API_URL}?q=${encodeURIComponent(inputText)}&langpair=${sourceLang}|${targetLang}`,
        );
        const data = await response.json();
        const translatedText = data?.responseData?.translatedText;
        const nextValue =
          typeof translatedText === 'string' && translatedText.trim() ? translatedText.trim() : '';

        if (requestIdRef.current !== requestId) return;

        cacheRef.current[cacheKey] = nextValue;
        setTargetText(targetLang, nextValue);
        setError('');
        setIsLoading(false);
        setDirection(null);
      } catch (translateError) {
        if (requestIdRef.current !== requestId) return;
        setError(String(translateError));
        setIsLoading(false);
        setDirection(null);
      }
    },
    [setTargetText],
  );

  useEffect(() => {
    if (lastEditedRef.current !== 'vi') return;
    const timeoutId = window.setTimeout(() => {
      void translateText(vietnameseText, 'vi', 'en');
    }, TRANSLATE_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [vietnameseText, translateText]);

  useEffect(() => {
    if (lastEditedRef.current !== 'en') return;
    const timeoutId = window.setTimeout(() => {
      void translateText(englishText, 'en', 'vi');
    }, TRANSLATE_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [englishText, translateText]);

  const onCopyText = useCallback(async (value: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (copyError) {
      console.log('Copy text failed:', copyError);
    }
  }, []);

  const onPasteText = useCallback(
    async (targetLang: TranslateLang): Promise<void> => {
      try {
        const clipboardText = await navigator.clipboard.readText();
        if (targetLang === 'vi') {
          setVietnameseInput(clipboardText);
          return;
        }
        setEnglishInput(clipboardText);
      } catch (pasteError) {
        console.log('Paste text failed:', pasteError);
      }
    },
    [setVietnameseInput, setEnglishInput],
  );

  const onClearText = useCallback(
    (targetLang: TranslateLang): void => {
      requestIdRef.current += 1;
      setIsLoading(false);
      setError('');
      setDirection(null);

      if (targetLang === 'vi') {
        setVietnameseInput('');
        setEnglishText('');
        return;
      }

      setEnglishInput('');
      setVietnameseText('');
    },
    [setVietnameseInput, setEnglishInput],
  );

  const onSpeakText = useCallback(
    (value: string, sourceLang: TranslateLang): void => {
      speakText(value, sourceLang === 'en', {
        voice: sourceLang === 'en' ? voiceIndex : voiceIndexVie,
        rate,
        volume,
      });
    },
    [speakText, voiceIndex, voiceIndexVie, rate, volume],
  );

  const onTextareaKeyDown = useCallback((event: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (!(event.ctrlKey && event.key.toLowerCase() === 's')) return;

    event.preventDefault();
    event.stopPropagation();

    const saveBtn = sheetEditorRef.current?.querySelector(
      'button[data-sheet-save-button="true"]',
    ) as HTMLButtonElement | null;
    if (saveBtn && !saveBtn.disabled) {
      saveBtn.click();
    }
  }, []);
  return (
    <div className="translate-vie-eng-panel">
      <div className="translate-vie-eng-grid">
        <div className="translate-vie-eng-col">
          {/* <label className="translate-vie-eng-label" htmlFor="translate-eng-input">
            English
          </label> */}
          <textarea
            style={{
              border: '3px solid white', // Bold border using shorthand (width style color)
              borderRadius: '8px',
            }}
            id="translate-eng-input"
            className="textarea-speech translate-vie-eng-textarea"
            rows={1}
            value={englishText}
            onChange={(event) => setEnglishInput(event.target.value)}
            onKeyDown={onTextareaKeyDown}
            placeholder="English"
          />
          <div className="translate-vie-eng-actions">
            <button
              type="button"
              className="common-btn speak-practice-btn"
              onClick={() => onClearText('en')}
              title="Clear"
              aria-label="Clear English text"
            >
              <FaTrash aria-hidden="true" />
            </button>
            <button
              type="button"
              className="common-btn speak-practice-btn"
              onClick={() => void onCopyText(englishText)}
              title="Copy"
              aria-label="Copy English text"
            >
              <FaCopy aria-hidden="true" />
            </button>
            <button
              type="button"
              className="common-btn speak-practice-btn"
              onClick={() => void onPasteText('en')}
              title="Paste"
              aria-label="Paste to English text"
            >
              <FaPaste aria-hidden="true" />
            </button>
            <button
              type="button"
              className="common-btn speak-practice-btn"
              onClick={() => onSpeakText(englishText, 'en')}
              title="Speak"
              aria-label="Speak English text"
            >
              <FaVolumeUp aria-hidden="true" />
            </button>
            <VoiceToText setText={setEnglishInput} index="translate-vie-eng-en" language="en-US" />
          </div>
        </div>
        <div className="translate-vie-eng-col">
          {/* <label className="translate-vie-eng-label" htmlFor="translate-vie-input">
            Vietnamese
          </label> */}
          <textarea
            style={{
              border: '3px solid gray', // Bold border using shorthand (width style color)
              borderRadius: '8px',
            }}
            id="translate-vie-input"
            className="textarea-speech translate-vie-eng-textarea"
            rows={1}
            value={vietnameseText}
            onChange={(event) => setVietnameseInput(event.target.value)}
            onKeyDown={onTextareaKeyDown}
            placeholder="Vietnamese"
          />
          <div className="translate-vie-eng-actions">
            <button
              type="button"
              className="common-btn speak-practice-btn"
              onClick={() => onClearText('vi')}
              title="Clear"
              aria-label="Clear Vietnamese text"
            >
              <FaTrash aria-hidden="true" />
            </button>
            <button
              type="button"
              className="common-btn speak-practice-btn"
              onClick={() => void onCopyText(vietnameseText)}
              title="Copy"
              aria-label="Copy Vietnamese text"
            >
              <FaCopy aria-hidden="true" />
            </button>
            <button
              type="button"
              className="common-btn speak-practice-btn"
              onClick={() => void onPasteText('vi')}
              title="Paste"
              aria-label="Paste to Vietnamese text"
            >
              <FaPaste aria-hidden="true" />
            </button>
            <button
              type="button"
              className="common-btn speak-practice-btn"
              onClick={() => onSpeakText(vietnameseText, 'vi')}
              title="Speak"
              aria-label="Speak Vietnamese text"
            >
              <FaVolumeUp aria-hidden="true" />
            </button>
            <VoiceToText
              setText={setVietnameseInput}
              index="translate-vie-eng-vi"
              language="vi-VN"
            />
          </div>
        </div>
      </div>

      <div className={`translate-vie-eng-status ${error ? 'error' : ''}`}>
        {error
          ? `Error: ${error}`
          : isLoading
            ? direction === 'vi-to-en'
              ? 'Translating Vietnamese to English...'
              : 'Translating English to Vietnamese...'
            : ''}
      </div>
      <div ref={sheetEditorRef}>
        <SheetDataEditor value2={vietnameseText} value1={englishText} isUse={true} />
      </div>
    </div>
  );
};

export default TranslateVieEngInput;
