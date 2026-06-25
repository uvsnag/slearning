'use client';
import dynamic from 'next/dynamic';

const StoreEditor = dynamic(() => import('./StoreEditor'), {
  ssr: false,
});

const StoreEditorPage = () => {
  return (
    <div className="ui-page">
      <div className="ui-page-shell">
        <StoreEditor />
      </div>
    </div>
  );
};

export default StoreEditorPage;
