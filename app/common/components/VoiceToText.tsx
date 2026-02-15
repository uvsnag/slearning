'use client';
import { useEffect, useState, useRef } from 'react';
import { MdHearing } from 'react-icons/md';
import { FaMicrophone } from 'react-icons/fa';
import {
  useSpeechRecognition,
} from '@/app/common/hooks/useSpeechRecognition';

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
    browserSupportsSpeechRecognition: supportsSpeechRecognition,
    startListening,
    stopListening,
  } = useSpeechRecognition();

  const activeIndx = useRef<string | number | null>(null);

  const [isStartRecord, setIsStartRecord] = useState<boolean>(false);

  useEffect((): void => {
    setIsStartRecord(listening);
  }, [listening]);

  useEffect((): void => {
    if (index === activeIndx.current) {
      setText(transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  useEffect((): void => {
    if (!supportsSpeechRecognition) {
      alert('Browser does not support speech to text');
    }
  }, [supportsSpeechRecognition]);

  const handleStartListening = (): void => {
    activeIndx.current = index;
    setIsStartRecord(true);
    console.log('Start recoding...');
    resetTranscript();
    startListening({
      continuous: true,
      language: 'en-US',
    });

    setTimeout(() => {
      console.log(transcript);
    }, 1000);
  };

  const handleStopListening = (): void => {
    setIsStartRecord(false);
    console.log('Stoped record');
    stopListening();
    activeIndx.current = null;
  };

  const processRecord = (): void => {
    if (isStartRecord) {
      handleStopListening();
      return;
    }
    handleStartListening();
  };

  return (
    <button className="common-btn inline" onClick={processRecord}>
      {isStartRecord ? <MdHearing /> : <FaMicrophone />}
    </button>
  );
};

export default VoiceToText;
