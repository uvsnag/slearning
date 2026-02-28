'use client';
import { useEffect, useState, ChangeEvent } from 'react';

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
        defaultPrompt: `Tôi sẽ viết bằng tiếng Anh. Hãy giúp tôi sửa ngữ pháp trong câu bằng cách trả lời ngắn gọn những yêu cầu sau: 
 1. hãy phân loại rõ ràng trong câu chỗ nào là sai, chỗ nào là đúng nhưng chưa tự nhiên bằng tiếng việt 
 2. đưa ra 1 câu tiếng anh được sửa những chỗ sai ngữ pháp dựa theo câu gốc 
 3. đưa ra câu tiếng anh được sửa những chỗ sai ngữ pháp và những chỗ chưa tự nhiên dựa theo câu gốc			
      `,
      },

      {
        instanceNo: 2,
        prefix: 'board2',
        enableHis: 'N',
        collapse: 'N',
        title: 'Eng-Vie',
        defaultPrompt: 'dịch sang tiếng việt',
      },
      {
        instanceNo: 3,
        prefix: 'board2',
        enableHis: 'N',
        collapse: 'N',
        title: 'Vie-Eng',
        defaultPrompt:
          'translate the following text from Vietnamese to English, shortly, give me 3 ways to translate',
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
