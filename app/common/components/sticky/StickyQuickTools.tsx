'use client';

import type { ReactNode } from 'react';
import { useRef } from 'react';
import { COMMON_PROMPT } from '../../common';
import StickyAIBoard, { type StickyAIBoardHandle } from './StickyAIBoard';
import StickyPracticeInput, { type StickyPracticeInputHandle } from './StickyPracticeInput';

interface StickyBoardConfig {
  title: string;
  defaultPrompt: string;
  stickyBottom: number;
  pathIcon?: ReactNode;
}

interface StickyQuickToolsProps {
  boardPrefix?: string;
  practiceVoiceIndex?: string | number;
  practiceType?: 'INPUT' | 'TEXTAREA';
  practiceRows?: number;
  practiceShowSpeak?: 'Y' | 'N';
  isSticky?: 'Y' | 'N';
  practiceStickyBottom?: number;
  closeAllStickyBottom?: number;
  boards?: StickyBoardConfig[];
}

const DEFAULT_BOARDS: StickyBoardConfig[] = [
  {
    title: 'Eng-Vie',
    defaultPrompt: COMMON_PROMPT.ADD_EXCEL_ENG,
    stickyBottom: 150,
    pathIcon: (
      <path
        d="M21 5h-8M17 5v14M21 19h-8M10 15l-4 4M6 19H3v-3M3 19l7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: 'Eng-Vie',
    defaultPrompt: COMMON_PROMPT.TRANSLATE_EN_VI,
    stickyBottom: 200,
    pathIcon: (
      <path
        d="M3 5h8M7 5v14M3 19h8M14 9l4-4M18 5h3v3M21 5l-7 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: 'Grammar',
    defaultPrompt: COMMON_PROMPT.CHECK_GRAMMAR,
    stickyBottom: 250,
    pathIcon: (
      <path
        d="M4 6h12M4 10h12M4 14h8M16 16l2 2 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

const StickyQuickTools = ({
  boardPrefix = 'layout-sticky-ai',
  practiceVoiceIndex = 'speed-main',
  practiceType = 'TEXTAREA',
  practiceRows = 3,
  practiceShowSpeak = 'Y',
  isSticky = 'Y',
  practiceStickyBottom = 0,
  closeAllStickyBottom = 50,
  boards = DEFAULT_BOARDS,
}: StickyQuickToolsProps) => {
  const practiceRef = useRef<StickyPracticeInputHandle>(null);
  const boardRefs = useRef<Array<StickyAIBoardHandle | null>>([]);

  const closeAllStickies = () => {
    practiceRef.current?.close();
    boardRefs.current.forEach((boardRef) => boardRef?.close());
  };

  return (
    <>
      <StickyPracticeInput
        ref={practiceRef}
        voiceIndex={practiceVoiceIndex}
        type={practiceType}
        rows={practiceRows}
        isShowSpeak={practiceShowSpeak}
        isSticky={isSticky}
        stickyBottom={practiceStickyBottom}
      />

      {boards.map((board, index) => (
        <StickyAIBoard
          ref={(boardRef) => {
            boardRefs.current[index] = boardRef;
          }}
          key={`${boardPrefix}-${index}-${board.title}`}
          boardPrefix={boardPrefix}
          boardIndex={index}
          isSticky={isSticky}
          stickyBottom={board.stickyBottom}
          title={board.title}
          defaultPrompt={board.defaultPrompt}
          pathIcon={board.pathIcon}
        />
      ))}

      <div
        className={`right sticky-close-all-card ${isSticky === 'Y' ? 'sticky-ai-float' : ''}`}
        style={
          isSticky === 'Y' && typeof closeAllStickyBottom === 'number'
            ? { bottom: `${closeAllStickyBottom}px` }
            : undefined
        }
      >
        <button
          type="button"
          className="sticky-ai-toggle sticky-close-all-toggle"
          aria-label="Close all sticky panels"
          onClick={closeAllStickies}
        >
          <svg className="sticky-close-all-icon" viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </>
  );
};

export default StickyQuickTools;
