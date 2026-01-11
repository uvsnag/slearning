'use client';
import React, { useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import VoiceToText from '@/common/components/VoiceToText';

const SpeechRecogn: React.FC = () => {
  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    interimTranscript,
    finalTranscript,
  } = useSpeechRecognition();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert('Browser does not support speech to text');
    }

    const numClearInput = document.getElementById('numClear') as HTMLInputElement | null;
    if (numClearInput) {
      numClearInput.value = '0';
    }

    const intervalId = window.setInterval(() => {
      console.log(transcript);
      console.log('listening:' + String(listening));
      console.log('browserSupportsSpeechRecognition:' + String(browserSupportsSpeechRecognition));
      console.log('isMicrophoneAvailable:' + String(isMicrophoneAvailable));
      console.log('interimTranscript:' + String(interimTranscript));
      console.log('finalTranscript:' + String(finalTranscript));
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const numClearInput = document.getElementById('numClear') as HTMLInputElement | null;
    const num = numClearInput ? Number(numClearInput.value) : 0;

    if (num > 0 && wordcount(transcript) > num) {
      console.log(transcript);
      resetTranscript();
    }

    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  const wordcount = (s: string): number => {
    console.log('count');
    if (s) {
      return s.replace(/-/g, ' ').trim().split(/\s+/g).length;
    }
    return 0;
  };

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startListening = (): void => {
    SpeechRecognition.startListening({
      continuous: true,
      language: 'en-US',
    });
  };

  const stopListening = (): void => {
    SpeechRecognition.stopListening();
  };

  const showHideContr = (): void => {
    onHideInput('control');
  };

  const onHideInput = (idName: string): void => {
    const prac = document.getElementById(idName) as HTMLDivElement | null;
    if (!prac) return;

    if (prac.style.display === 'block' || prac.style.display === '') {
      prac.style.display = 'none';
    } else {
      prac.style.display = 'block';
    }
  };

  return (
    <div className="container">
      <div id="control">
        {/* <VoiceToText setText={setInputAns} index={0} /> */}
        <button className="button" onClick={startListening}>
          Start
        </button>
        <button className="button" onClick={stopListening}>
          Stop
        </button>
        <button className="button" onClick={resetTranscript}>
          reset
        </button>
        <input type="number" id="numClear" className="width-30" />
      </div>

      <div className="content-log">
        <div id="transcript-i">{transcript}</div>
        <div ref={messagesEndRef} />
      </div>

      <button onClick={showHideContr}>-</button>
    </div>
  );
};

export default SpeechRecogn;
