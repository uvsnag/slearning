'use client';
import { useEffect, useState } from 'react';
import AIBoard from '@/app/common/components/AIBoard';
import StackBtn from '@/app/common/components/StackButton';
import { AIBoardProps } from '@/app/common/components/AIBoard';
import '@/slearning/multi-ai/style-ai.css';
import SheetDataEditor from '../common/components/SheetDataEditor';
interface InstanceAIProps extends Partial<Omit<AIBoardProps, 'heightRes'>> {
  instanceNo: number;
}

export interface MulAIContainerProps {
  configs: InstanceAIProps[];
  heightRes?: number;
  cols?: number;
}

const MulAI: React.FC<MulAIContainerProps> = (props) => {
  const [numAI, setNumAI] = useState<number>(props.configs.length);
  const [column, setColumn] = useState<number>(props?.cols ?? 4);
  const [height, setHeight] = useState<number>(props?.heightRes ?? 400);

  useEffect(() => {}, []);

  useEffect(() => {}, [column]);

  const handleNumAIChange = (value: number): void => {
    if (Number.isNaN(value)) {
      setNumAI(0);
      return;
    }
    setNumAI(Math.max(0, value));
  };

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
          className="width-60 common-input"
          value={numAI}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            handleNumAIChange(Number(event.target.value));
          }}
        />
        <StackBtn
          onUp={() => handleNumAIChange(numAI + 1)}
          onDown={() => handleNumAIChange(numAI - 1)}
        ></StackBtn>
        <span>Cols:</span>
        <input
          type="number"
          className="width-60 common-input"
          value={column}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setColumn(Number(event.target.value));
          }}
        />
        <StackBtn
          onUp={() => setColumn(column + 1)}
          onDown={() => setColumn(column - 1)}
        ></StackBtn>
        {/* <button onClick={() => clearAllLog()} className="common-btn">
          Clear All
        </button> */}
        <i>{height}</i>
        <input
          className="width-220 range-input"
          type="range"
          min="10"
          max="800"
          defaultValue="400"
          step="5"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setHeight(Number(event.target.value));
          }}
        />
        {/* <SheetDataEditor /> */}
      </div>
      <div className="container-block">
        {/* Render by numAI and apply config with same index */}
        {Array.from({ length: numAI }).map((_, index) => {
          const config = props.configs[index];
          const instanceNo = config?.instanceNo ?? index;

          return (
            <div key={instanceNo} className={`block block-${column}cols`}>
              <AIBoard
                index={instanceNo}
                prefix={config?.prefix || 'default'}
                enableHis={config?.enableHis ?? 'N'}
                heightRes={height}
                isMini={config?.isMini}
                statement={config?.statement}
                title={config?.title}
                defaultPrompt={config?.defaultPrompt}
                // isShowPract={config.isShowPract}
                lastSentence={config?.lastSentence}
                collapse={config?.collapse}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default MulAI;
