'use client';
import dynamic from 'next/dynamic';

const MulAI = dynamic(() => import('./MultiAI'), {
  ssr: false,
});
export default MulAI;
