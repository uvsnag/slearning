'use client';
import { useEffect, useState, ChangeEvent } from 'react';
import { COMMON_PROMPT } from '@/common/common.js';
import MulAI, { MulAIContainerProps } from '../multi-ai/MultiAI';

const Board2: React.FC = () => {
  const MUL_PROP: MulAIContainerProps = {
    heightRes: 430,
    cols: 2,
    configs: [
      {
        instanceNo: 0,
        prefix: 'board2',
        enableHis: 'Y',
        collapse: 'N',
        title: 'AI Chat',
      },
      {
        instanceNo: 1,
        prefix: 'board2',
        enableHis: 'N',
        collapse: 'N',
        title: 'Grammar',
        defaultPrompt: COMMON_PROMPT.CHECK_GRAMMAR,
      },

      {
        instanceNo: 2,
        prefix: 'board2',
        enableHis: 'N',
        collapse: 'N',
        title: 'Eng-Vie',
        defaultPrompt: COMMON_PROMPT.TRANSLATE_EN_VI,
      },
      {
        instanceNo: 3,
        prefix: 'board2',
        enableHis: 'N',
        collapse: 'N',
        title: 'Vie-Eng',
        defaultPrompt: COMMON_PROMPT.TRANSLATE_VI_EN,
      },
    ],
  };

  return (
    <div className="">
      <MulAI {...MUL_PROP}></MulAI>
    </div>
  );
};

export default Board2;
