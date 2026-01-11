'use client';
import { useEffect, useState } from 'react';
import AIBoard from '@/app/common/components/AIBoard';
import StackBtn from '@/app/common/components/StackButton';
import { AIBoardProps } from '@/app/common/components/AIBoard';
import '@/slearning/multi-ai/style-ai.css';
interface InstanceAIProps extends Partial<Omit<AIBoardProps, 'heightRes'>> {
  instanceNo: number;
}

export interface MulAIContainerProps {
  configs: InstanceAIProps[];
  heightRes?: number;
}

const MulAI: React.FC<MulAIContainerProps> = (props) => {
  const [numAI, setNumAI] = useState<number>(props.configs.length);
  const [column, setColumn] = useState<number>(4);
  const [height, setHeight] = useState<number>(props?.heightRes ?? 400);

  useEffect(() => {}, []);

  useEffect(() => {}, [column]);

  function clearAllLog(): void {
    document.querySelectorAll('div.response-ai').forEach((el: Element) => {
      (el as HTMLElement).innerHTML = '';
    });
  }
  return (
    <div>
      <div>
        <span>Instances:</span>
        <input
          type="number"
          className="width-30 common-input"
          value={numAI}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setNumAI(Number(event.target.value));
          }}
        />
        <StackBtn onUp={() => setNumAI(numAI + 1)} onDown={() => setNumAI(numAI - 1)}></StackBtn>
        <span>Cols:</span>
        <input
          type="number"
          className="width-30 common-input"
          value={column}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setColumn(Number(event.target.value));
          }}
        />
        <StackBtn
          onUp={() => setColumn(column + 1)}
          onDown={() => setColumn(column - 1)}
        ></StackBtn>
        <button onClick={() => clearAllLog()} className="common-btn inline">
          Clear All
        </button>
        <i>{height}</i>
        <input
          className="width-220 range-color"
          type="range"
          min="10"
          max="800"
          defaultValue="400"
          step="5"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setHeight(Number(event.target.value));
          }}
        />
      </div>
      <div className="container-block">
        {/* Map over configs array to create AIBoard instances */}
        {props.configs.slice(0, numAI).map((config) => (
          <div key={config.instanceNo} className={`block block-${column}cols`}>
            <AIBoard
              index={config.instanceNo}
              prefix={config.prefix || 'default'}
              enableHis={config.enableHis ?? 'N'}
              heightRes={height}
              isMini={config.isMini}
              statement={config.statement}
              isShowPract={config.isShowPract}
              lastSentence={config.lastSentence}
              collapse={config.collapse}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default MulAI;
