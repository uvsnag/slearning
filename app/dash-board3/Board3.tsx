'use client';
import MulAI, { MulAIContainerProps } from '../multi-ai/MultiAI';

const Board3: React.FC = () => {
  const MUL_PROP: MulAIContainerProps = {
    heightRes: 430,
    cols: 2,
    configs: [
      {
        instanceNo: 0,
        prefix: 'board3',
        enableHis: 'Y',
        collapse: 'N',
      },
      {
        instanceNo: 1,
        prefix: 'board3',
        enableHis: 'N',
        collapse: 'N',
      },
      {
        instanceNo: 2,
        prefix: 'board3',
        enableHis: 'N',
        collapse: 'N',
      },
      {
        instanceNo: 3,
        prefix: 'board3',
        enableHis: 'N',
        collapse: 'N',
      },
    ],
  };

  return (
    <div className="">
      <MulAI {...MUL_PROP}></MulAI>
    </div>
  );
};

export default Board3;
