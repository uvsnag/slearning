'use client';
import dynamic from 'next/dynamic';

const SpeakAI = dynamic(() => import('./SpeakAI'), {
  ssr: false,
});
const MobileSpeakAIPage = () => {
  return (
    <div className="ui-page">
      <div className="ui-page-shell">
        <SpeakAI />
      </div>
    </div>
  );
};

export default MobileSpeakAIPage;
