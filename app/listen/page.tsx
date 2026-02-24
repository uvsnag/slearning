'use client';
// import ListenPractice from './ListenPractice';
import dynamic from 'next/dynamic';

const ListenPractice = dynamic(() => import('./ListenPractice'), {
  ssr: false,
});
const ListenPage = () => {
  return (
    <div className="ui-page">
      <div className="ui-page-shell">
        <ListenPractice />
      </div>
    </div>
  );
};

export default ListenPage;
