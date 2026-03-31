'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { COMMON_PROMPT } from '../../common';
import StickyAIBoard, { type StickyAIBoardHandle } from './StickyAIBoard';
import StickyPracticeInput, { type StickyPracticeInputHandle } from './StickyPracticeInput';
import StickyConfig, { type StickyConfigHandle } from './StickyConfig';

interface StickyBoardConfig {
  title: string;
  defaultPrompt: string;
  stickyBottom: number;
  stickyBottomContent?: number;
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
  homeStickyBottom?: number;
  configStickyBottom?: number;
  boards?: StickyBoardConfig[];
}

const DEFAULT_BOARDS: StickyBoardConfig[] = [
  {
    title: 'Eng-Vie',
    defaultPrompt: COMMON_PROMPT.ADD_EXCEL_ENG,
    stickyBottom: 250,
    stickyBottomContent: 0,
    pathIcon: (
      <path
        d="M4 4h16v3H7v4h10v3H7v4h13v3H4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: 'Vie-Eng',
    defaultPrompt: COMMON_PROMPT.TRANSLATE_VI_EN,
    stickyBottom: 300,
    stickyBottomContent: 0,
    pathIcon: (
      <path
        d="M4 4l6 16h4l6-16h-3l-5 13-5-13z"
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
    stickyBottom: 350,
    stickyBottomContent: 0,
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
  {
    title: 'AI',
    defaultPrompt: 'correct my grammar before answering',
    stickyBottom: 400,
    stickyBottomContent: 0,
    pathIcon: (
      <path d="M12 2a1 1 0 011 1v1h2a4 4 0 014 4v6a4 4 0 01-4 4h-1v2h2v2H8v-2h2v-2H9a4 4 0 01-4-4V8a4 4 0 014-4h2V3a1 1 0 011-1zm-4 8a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm8 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
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
  practiceStickyBottom = 200,
  homeStickyBottom = 50,
  closeAllStickyBottom = 100,
  configStickyBottom = 450,
  boards = DEFAULT_BOARDS,
}: StickyQuickToolsProps) => {
  const practiceRef = useRef<StickyPracticeInputHandle>(null);
  const boardRefs = useRef<Array<StickyAIBoardHandle | null>>([]);
  const configRef = useRef<StickyConfigHandle>(null);
  const [isOthersHidden, setIsOthersHidden] = useState(false);
  const [isPracticeStickyOpen, setIsPracticeStickyOpen] = useState(false);

  const closeAllStickies = (exceptId?: string[]) => {
    if (!Array.isArray(exceptId) || !exceptId.includes('practice')) {
      practiceRef.current?.close();
    }
    boardRefs.current.forEach((boardRef, index) => {
      if (!Array.isArray(exceptId) || !exceptId.includes(`board-${index}`)) {
        boardRef?.close();
      }
    });
    if (!Array.isArray(exceptId) || !exceptId.includes('config')) {
      configRef.current?.close();
    }
  };

  const onOpenSticky = (stickyId: string) => {
    closeAllStickies([stickyId, 'practice']);
  };

  const onToggleOthersVisibility = () => {
    if (isOthersHidden) {
      setIsOthersHidden(false);
      return;
    }

    closeAllStickies();
    setIsOthersHidden(true);
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
        isVisible={!isOthersHidden}
        stickyBottomContent={0}
        onOpen={(val) => setIsPracticeStickyOpen(val)}
        // onOpen={() => onOpenSticky('practice')}
      />

      <StickyConfig
        ref={configRef}
        isSticky={isSticky}
        stickyBottom={configStickyBottom}
        isVisible={!isOthersHidden}
        stickyBottomContent={isPracticeStickyOpen ? 150 : 0}
        onOpen={(isOpen) => {
          if (isOpen) {
            onOpenSticky('config');
          }
        }}
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
          stickyBottomContent={isPracticeStickyOpen ? 150 : board.stickyBottomContent}
          title={board.title}
          defaultPrompt={board.defaultPrompt}
          pathIcon={board.pathIcon}
          isVisible={!isOthersHidden}
          onOpen={(isOpen) => {
            if (isOpen) {
              onOpenSticky(`board-${index}`);
            }
          }}
        />
      ))}

      <div
        className={`right sticky-home-card ${isSticky === 'Y' ? 'sticky-ai-float' : ''}`}
        style={
          isSticky === 'Y' && typeof homeStickyBottom === 'number'
            ? { bottom: `${homeStickyBottom}px` }
            : undefined
        }
      >
        <Link
          href="/"
          className="sticky-ai-toggle sticky-home-toggle"
          aria-label="Go to home page"
          title="Home"
        >
          🏠
        </Link>
      </div>

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
          className={`sticky-ai-toggle sticky-close-all-toggle ${isOthersHidden ? 'open' : ''}`}
          aria-label={isOthersHidden ? 'Show all sticky panels' : 'Hide all sticky panels'}
          onClick={onToggleOthersVisibility}
        >
          <svg className="sticky-close-all-icon" viewBox="0 0 24 24" role="img" aria-hidden="true">
            {isOthersHidden ? (
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </button>
      </div>
    </>
  );
};

export default StickyQuickTools;
