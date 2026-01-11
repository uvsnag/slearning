'use client';
// import ListenPractice from './ListenPractice';
import dynamic from 'next/dynamic';

const ListenPractice = dynamic(() => import('./ListenPractice'), {
  ssr: false,
});
export default ListenPractice;
