'use client';
import { useEffect } from 'react';

interface StackBtnProps {
  onUp: () => void;
  onDown: () => void;
}

const StackBtn: React.FC<StackBtnProps> = ({ onUp, onDown }) => {
  useEffect((): void => {}, []);

  return (
    <div className="inline-block offset-top-10">
      <div className="button-stack">
        <button className="cmm-btn" onClick={() => onUp()}>
          ▲
        </button>
        <button className="cmm-btn" onClick={() => onDown()}>
          ▼
        </button>
      </div>
    </div>
  );
};

export default StackBtn;
