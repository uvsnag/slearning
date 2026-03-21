'use client';

import VoiceToText from '@/app/common/components/VoiceToText';
import { useState } from 'react';

interface SpeakPracticeInputProps {
  voiceIndex: string | number;
  rows?: number;
  type?: 'INPUT' | 'TEXTAREA';
}

const SpeakPracticeInput = ({
  voiceIndex,
  rows = 3,
  type = 'TEXTAREA',
}: SpeakPracticeInputProps) => {
  const [tempText, setTempText] = useState<string>('');
  return (
    <div className="speak-practice-wrap">
      {type === 'INPUT' ? (
        <input
          type="text"
          value={tempText}
          className="common-input"
          onChange={(event) => setTempText(event.target.value)}
        />
      ) : (
        <textarea
          value={tempText}
          rows={rows}
          className="textarea-speech speak-practice-textarea"
          // placeholder={placeholder}
          onChange={(event) => setTempText(event.target.value)}
        />
      )}
      <div className="speak-practice-action">
        <VoiceToText setText={setTempText} index={voiceIndex}></VoiceToText>
        {type === 'TEXTAREA' && (
          <button className="common-btn speak-practice-clear-btn" onClick={() => setTempText('')}>
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default SpeakPracticeInput;
