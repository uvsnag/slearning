'use client';
import dynamic from 'next/dynamic';

const SpeakAI = dynamic(() => import('./SpeakAI'), {
  ssr: false,
});
export default SpeakAI;
