'use client';

import VoiceToText from '@/app/common/components/VoiceToText';
import { useSpeechSynthesis } from '@/app/common/hooks/useSpeechSynthesis';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { FaCopy, FaLanguage, FaPaste, FaTrash, FaVolumeUp } from 'react-icons/fa';
import { MdRecordVoiceOver } from 'react-icons/md';
import TranslatePopup from '../TranslatePopup';

interface SpeakPracticeInputProps {
  voiceIndex: string | number;
  rows?: number;
  type?: 'INPUT' | 'TEXTAREA';
  isSticky?: 'Y' | 'N';
  isShowSpeak?: 'Y' | 'N';
  stickyBottom?: number;
  stickyBottomContent?: number;
  isVisible?: boolean;
  onOpen?: (isOpen: boolean) => void;
}

export interface StickyPracticeInputHandle {
  close: () => void;
}

const StickyPracticeInput = forwardRef<StickyPracticeInputHandle, SpeakPracticeInputProps>(
  (
    {
      voiceIndex,
      rows = 3,
      type = 'TEXTAREA',
      isSticky = 'N',
      isShowSpeak = 'Y',
      stickyBottom,
      stickyBottomContent = 0,
      isVisible = true,
      onOpen,
    },
    ref,
  ) => {
    const [textValue, setTextValue] = useState<string>('');
    const [isOpen, setIsOpen] = useState(false);
    const { speakText } = useSpeechSynthesis();
    const [wordPopup, setWordPopup] = useState<{ open: boolean; word: string }>({
      open: false,
      word: '',
    });

    const onClickSpeechWord = useCallback(
      (word: string) => {
        speakText(word, true);
        setWordPopup({
          open: true,
          word: word,
        });
      },
      [speakText],
    );

    const onCopyText = useCallback(async (): Promise<void> => {
      try {
        await navigator.clipboard.writeText(textValue);
      } catch (error) {
        console.log('Copy text failed:', error);
      }
    }, [textValue]);

    const onPasteText = useCallback(async (): Promise<void> => {
      try {
        const clipboardText = await navigator.clipboard.readText();
        setTextValue(clipboardText);
      } catch (error) {
        console.log('Paste text failed:', error);
      }
    }, []);

    useImperativeHandle(ref, () => ({
      close: () => {
        setIsOpen((prevIsOpen) => {
          if (prevIsOpen) {
            onOpen?.(false);
          }
          return false;
        });
      },
    }));

    return (
      <div
        className={`right speak-practice-card ${isSticky === 'Y' ? 'float-sticky' : ''} ${
          isVisible ? '' : 'sticky-item-hidden'
        } ${isOpen ? 'open' : ''}`}
        style={
          isSticky === 'Y' && typeof stickyBottom === 'number'
            ? { bottom: `${isOpen ? stickyBottomContent : stickyBottom}px` }
            : undefined
        }
      >
        <div
          id={`${voiceIndex}-input`}
          className={`collapse-content speak-practice-pop-wrap ${isOpen ? 'open' : ''}`}
        >
          <div className={`speak-practice-content ${type === 'TEXTAREA' ? 'type-text-area' : ''}`}>
            <div className="speak-practice-input-wrap">
              {type === 'INPUT' ? (
                <input
                  type="text"
                  value={textValue}
                  className="common-input speak-practice-input"
                  onChange={(event) => setTextValue(event.target.value)}
                />
              ) : (
                <textarea
                  value={textValue}
                  rows={rows}
                  className="textarea-speech speak-practice-textarea"
                  onChange={(event) => setTextValue(event.target.value)}
                />
              )}
            </div>
            <div className={`speak-practice-action ${type === 'TEXTAREA' ? 'type-text-area' : ''}`}>
              <button
                type="button"
                className="common-btn speak-practice-btn inline"
                onClick={() => setTextValue('')}
                title="Clear"
                aria-label="Clear text"
              >
                <FaTrash aria-hidden="true" />
              </button>

              <button
                type="button"
                className="common-btn speak-practice-btn"
                onClick={() => {
                  onClickSpeechWord(textValue);
                }}
                title="Translate"
                aria-label="Translate text"
              >
                <FaLanguage aria-hidden="true" />
              </button>
              <button
                type="button"
                className="common-btn speak-practice-btn"
                onClick={() => void onCopyText()}
                title="Copy"
                aria-label="Copy text"
              >
                <FaCopy aria-hidden="true" />
              </button>
              <button
                type="button"
                className="common-btn speak-practice-btn"
                onClick={() => void onPasteText()}
                title="Paste"
                aria-label="Paste text"
              >
                <FaPaste aria-hidden="true" />
              </button>
              {isShowSpeak === 'Y' && (
                <button
                  type="button"
                  className="common-btn speak-practice-btn inline"
                  onClick={() => speakText(textValue, true)}
                  title="Speak"
                  aria-label="Speak text"
                >
                  <FaVolumeUp aria-hidden="true" />
                </button>
              )}

              <div className="speak-practice-voice">
                <VoiceToText setText={setTextValue} index={voiceIndex}></VoiceToText>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          className={`speak-practice-toggle ${isOpen ? 'open' : ''}`}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Collapse speech practice' : 'Expand speech practice'}
          aria-controls={`${voiceIndex}-input`}
          onClick={() => {
            const nextIsOpen = !isOpen;
            onOpen?.(nextIsOpen);
            setIsOpen(nextIsOpen);
          }}
        >
          <MdRecordVoiceOver className="speak-practice-toggle-main-icon" aria-hidden="true" />
          <svg
            className="speak-practice-toggle-caret"
            viewBox="0 0 24 24"
            role="img"
            aria-hidden="true"
          >
            <path
              d="M7.4 9.4a1 1 0 0 1 1.4 0L12 12.6l3.2-3.2a1 1 0 0 1 1.4 1.4l-3.9 3.9a1 1 0 0 1-1.4 0l-3.9-3.9a1 1 0 0 1 0-1.4z"
              fill="currentColor"
            />
          </svg>
        </button>
        <TranslatePopup
          open={wordPopup.open}
          word={wordPopup.word}
          // onSpeak={speakPopupWord}
          onClose={() =>
            setWordPopup({
              open: false,
              word: '',
            })
          }
        />
      </div>
    );
  },
);

StickyPracticeInput.displayName = 'StickyPracticeInput';

export default StickyPracticeInput;
