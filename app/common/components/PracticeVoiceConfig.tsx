'use client';

import { ChangeEvent } from 'react';
import { FaVolumeUp } from 'react-icons/fa';

interface PracticeVoiceConfigProps {
  voices: any[];
  voiceIndex: number;
  rate: number;
  volumn: number;
  onVoiceChange: (value: number) => void;
  onRateChange: (value: number) => void;
  onVolumnChange: (value: number) => void;
}

const PracticeVoiceConfig = ({
  voices,
  voiceIndex,
  rate,
  volumn,
  onVoiceChange,
  onRateChange,
  onVolumnChange,
}: PracticeVoiceConfigProps) => {
  return (
    <>
      <select
        className="button-33 inline"
        id="voice"
        name="voice"
        value={voiceIndex || ''}
        onChange={(event: ChangeEvent<HTMLSelectElement>): void => {
          onVoiceChange(Number(event.target.value));
        }}
      >
        <option value="">Default</option>
        {voices.map((option: any, index: number) => (
          <option key={option.voiceURI} value={index}>
            {`${option.lang} - ${option.name}`}
          </option>
        ))}
      </select>

      <label htmlFor="rate">Speed: </label>
      <div className="rate-value inline">{rate}</div>
      <input
        type="range"
        className="width-220 range-color inline"
        min="0.2"
        max="2"
        defaultValue="0.6"
        step="0.1"
        id="rate"
        onChange={(event: ChangeEvent<HTMLInputElement>): void => {
          onRateChange(Number(event.target.value));
        }}
      />
      <br />

      <label htmlFor="volumn">
        <FaVolumeUp className="iconSound" />{' '}
      </label>
      <span className="rate-value">{volumn}</span>
      <input
        type="range"
        className="width-220 range-color inline"
        min="0.1"
        max="1"
        defaultValue="0.6"
        step="0.1"
        id="volumn"
        onChange={(event: ChangeEvent<HTMLInputElement>): void => {
          onVolumnChange(Number(event.target.value));
        }}
      />
    </>
  );
};

export default PracticeVoiceConfig;
