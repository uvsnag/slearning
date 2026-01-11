'use client';
import { useEffect, useState, ChangeEvent } from 'react';
import _ from 'lodash';

import NotifyAuto from '@/app/notify/Notify';
// import SpeechRecogn from '../recognize-text/RecognizeText';
import VoiceToText from '@/app/common/components/VoiceToText';
import NextSentence from '@/app/next-sentence/NextSentence';
import YoutubeSub from '@/app/youtube-sub/YoutubeSub';

import { toggleCollapse } from '@/common/common.js';

const Board1: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');

  useEffect((): void => {
    toggleCollapse('ai-section');
  }, []);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setPrompt(e.target.value);
  };

  return (
    <div className="">
      <div className="title-board" onClick={() => toggleCollapse('pract-section')}>
        Practice
      </div>

      <div className="container-91 collapse-content" id="pract-section">
        <NotifyAuto />
        <br />

        <div>
          <div className="title-board" onClick={() => toggleCollapse('speed-section')}>
            Speed
          </div>

          <div id="speed-section" className="collapse-content">
            <textarea className="width-93" rows={5} value={prompt} onChange={handleChange} />
            <br />
            <VoiceToText setText={setPrompt} index="board1" />
          </div>
        </div>
      </div>

      <div className="title-board" onClick={() => toggleCollapse('ai-section')}>
        AI
      </div>

      <div id="ai-section" className="collapse-content">
        <NextSentence heightProp={300} />
      </div>

      <div className="title-board" onClick={() => toggleCollapse('yt-section')}>
        YT
      </div>

      <div id="yt-section" className="collapse-content bolder">
        <YoutubeSub />
      </div>
    </div>
  );
};

export default Board1;
