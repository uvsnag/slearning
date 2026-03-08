'use client';

import VoiceToText from '@/app/common/components/VoiceToText';

interface SpeakPracticeInputProps {
  value: string;
  onChange: (text: string) => void;
  voiceIndex: string | number;
  rows?: number;
  placeholder?: string;
}

const SpeakPracticeInput = ({
  value,
  onChange,
  voiceIndex,
  rows = 3,
  placeholder = 'Practice speaking English here...',
}: SpeakPracticeInputProps) => {
  return (
    <div className="speak-practice-wrap">
      <textarea
        value={value}
        rows={rows}
        className="textarea-speech speak-practice-textarea"
        // placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="speak-practice-action">
        <VoiceToText setText={onChange} index={voiceIndex}></VoiceToText>
        <button className="common-btn speak-practice-clear-btn" onClick={() => onChange('')}>
          Clear
        </button>
      </div>
    </div>
  );
};

export default SpeakPracticeInput;
