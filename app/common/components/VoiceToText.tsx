'use client';
import { useEffect, useState, useRef } from 'react';
import { MdHearing } from 'react-icons/md';
import { FaMicrophone } from 'react-icons/fa';
import { useSpeechRecognition } from '@/app/common/hooks/useSpeechRecognition';

/** =======================
 *  Props
 *  ======================= */
interface VoiceToTextProps {
  setText: (text: string) => void;
  index: string | number;
  language?: string;
}

const VoiceToText: React.FC<VoiceToTextProps> = ({ setText, index, language = 'en-US' }) => {
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
    console.log('Listening with language:', language);
    startListening({
      continuous: true,
      language,
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
    <button type="button" className="common-btn width-small-btn" onClick={processRecord}>
      {isStartRecord ? <MdHearing /> : <FaMicrophone />}
    </button>
  );
};

export default VoiceToText;
