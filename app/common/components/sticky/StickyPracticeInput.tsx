'use client';

import VoiceToText from '@/app/common/components/VoiceToText';
import { useSpeechSynthesis } from '@/app/common/hooks/useSpeechSynthesis';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { MdRecordVoiceOver } from 'react-icons/md';
import TranslatePopup from '../TranslatePopup';

interface SpeakPracticeInputProps {
  voiceIndex: string | number;
  rows?: number;
  type?: 'INPUT' | 'TEXTAREA';
  isSticky?: 'Y' | 'N';
  isShowSpeak?: 'Y' | 'N';
  stickyBottom?: number;
  isVisible?: boolean;
  onOpen?: () => void;
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

    useImperativeHandle(ref, () => ({
      close: () => {
        setIsOpen(false);
      },
    }));

    return (
      <div
        className={`right speak-practice-card ${isSticky === 'Y' ? 'float-sticky' : ''} ${
          isVisible ? '' : 'sticky-item-hidden'
        } ${
          isOpen ? 'open' : ''
        }`}
        style={
          isSticky === 'Y' && typeof stickyBottom === 'number'
            ? { bottom: `${stickyBottom}px` }
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
              <div className="speak-practice-voice">
                <VoiceToText setText={setTextValue} index={voiceIndex}></VoiceToText>
              </div>
              <button
                type="button"
                className="common-btn speak-practice-btn inline"
                onClick={() => setTextValue('')}
              >
                Clear
              </button>
              {isShowSpeak === 'Y' && (
                <button
                  type="button"
                  className="common-btn speak-practice-btn inline"
                  onClick={() => speakText(textValue, true)}
                >
                  Speak
                </button>
              )}
              <button
                type="button"
                className="common-btn speak-practice-btn"
                onClick={async () => {
                  await navigator.clipboard.writeText(textValue);
                }}
              >
                Copy
              </button>
              <button
                type="button"
                className="common-btn speak-practice-btn"
                onClick={() => {
                  onClickSpeechWord(textValue);
                }}
              >
                Trans
              </button>
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
            if (nextIsOpen) {
              onOpen?.();
            }
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
