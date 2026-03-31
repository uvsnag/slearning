'use client';

import type { ReactNode } from 'react';
import { forwardRef, useImperativeHandle, useState } from 'react';
import AIBoard from '../AIBoard';

interface StickyAIBoardProps {
  boardPrefix?: string;
  boardIndex?: number;
  title?: string;
  isSticky?: 'Y' | 'N';
  stickyBottom?: number;
  stickyBottomContent?: number;
  defaultPrompt?: string;
  pathIcon?: ReactNode;
  isVisible?: boolean;
  onOpen?: (isOpen: boolean) => void;
}

export interface StickyAIBoardHandle {
  close: () => void;
}

const StickyAIBoard = forwardRef<StickyAIBoardHandle, StickyAIBoardProps>(
  (
    {
      boardPrefix = 'layout-sticky-ai',
      boardIndex = 0,
      title = 'AI Assistant',
      isSticky = 'Y',
      stickyBottom,
      stickyBottomContent = stickyBottom,
      defaultPrompt,
      pathIcon,
      isVisible = true,
      onOpen,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
      close: () => {
        setIsOpen(false);
      },
    }));

    return (
      <div
        className={`right sticky-ai-card ${isSticky === 'Y' ? 'sticky-ai-float' : ''} ${
          isVisible ? '' : 'sticky-item-hidden'
        } ${isOpen ? 'open' : ''}`}
        style={
          isSticky === 'Y' && typeof stickyBottom === 'number'
            ? { bottom: `${isOpen ? stickyBottomContent : stickyBottom}px` }
            : undefined
        }
      >
        <div
          id={`${boardPrefix}-${boardIndex}-panel`}
          className={`collapse-content sticky-ai-pop-wrap ${isOpen ? 'open' : ''}`}
        >
          <div className="sticky-ai-content">
            <AIBoard
              prefix={boardPrefix}
              index={boardIndex}
              title={title}
              enableHis="N"
              collapse="N"
              // isSpeak="Y"
              heightRes={350}
              defaultPrompt={defaultPrompt}
            />
          </div>
        </div>
        <button
          type="button"
          className={`sticky-ai-toggle ${isOpen ? 'open' : ''}`}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Collapse AI panel' : 'Expand AI panel'}
          aria-controls={`${boardPrefix}-${boardIndex}-panel`}
          onClick={() => {
            const nextIsOpen = !isOpen;
            onOpen?.(nextIsOpen);
            setIsOpen(nextIsOpen);
          }}
        >
          <svg className="sticky-ai-toggle-caret" viewBox="0 0 24 24" role="img" aria-hidden="true">
            {pathIcon}
            <path
              d="M7.4 9.4a1 1 0 0 1 1.4 0L12 12.6l3.2-3.2a1 1 0 0 1 1.4 1.4l-3.9 3.9a1 1 0 0 1-1.4 0l-3.9-3.9a1 1 0 0 1 0-1.4z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    );
  },
);

StickyAIBoard.displayName = 'StickyAIBoard';

export default StickyAIBoard;
