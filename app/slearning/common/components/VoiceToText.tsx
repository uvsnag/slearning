'use client';
import 'regenerator-runtime/runtime';
import { useEffect, useState, useRef } from 'react';
import { MdHearing } from 'react-icons/md';
import { FaMicrophone } from 'react-icons/fa';
import _ from 'lodash';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

/** =======================
 *  Props
 *  ======================= */
interface VoiceToTextProps {
  setText: (text: string) => void;
  index: string | number;
}

const VoiceToText: React.FC<VoiceToTextProps> = ({ setText, index }) => {
  const {
    transcript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    interimTranscript,
    finalTranscript,
  } = useSpeechRecognition();

  const activeIndx = useRef<string | number | null>(null);

  const [isStartRecord, setIsStartRecord] = useState<boolean>(false);

  useEffect((): void => {
    if (index === activeIndx.current) {
      setText(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  useEffect((): void => {
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      alert('Browser does not support speech to text');
    }
  }, []);

  const startListening = (): void => {
    activeIndx.current = index;
    setIsStartRecord(true);
    console.log('Start recoding...');
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: true,
      language: 'en-US',
    });

    setTimeout(() => {
      console.log(transcript);
    }, 1000);
  };

  const stopListening = (): void => {
    setIsStartRecord(false);
    console.log('Stoped record');
    SpeechRecognition.stopListening();
    activeIndx.current = null;
  };

  const processRecord = (): void => {
    isStartRecord ? stopListening() : startListening();
  };

  return (
    <button className="common-btn inline" onClick={processRecord}>
      {isStartRecord ? <MdHearing /> : <FaMicrophone />}
    </button>
  );
};

export default VoiceToText;
