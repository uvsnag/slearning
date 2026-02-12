'use client';
import { useEffect, useMemo, useState } from 'react';
import AIBoard from '@/app/common/components/AIBoard';
import { DataItem, getDataFromExcel } from '@/app/common/hooks/useSheetData';
import { SHEET_AUTO } from '@/app/common/components/SheetDataEditor';
import '@/slearning/mobile/speak-ai/speak-ai.css';
import { toggleCollapse } from '@/app/common/common';
import MulAI from '@/app/multi-ai/page';
import { MulAIContainerProps } from '@/app/multi-ai/MultiAI';

const DEFAULT_SCENARIO = 'Talking to a foreign colleague during lunch';
const SCENARIO_RANGE = SHEET_AUTO.find((item) => item.name === 'ABoard7')?.range || 'AUTO!Y2:AA500';

const buildPrompt = (scenario: string): string => `
SCENARIO: ${scenario}


You are my professional English speaking coach.

My goal is to improve my spoken English for real-life situations, especially for work and daily communication.

Rules:

I will speak first (my English may be broken or unnatural).

After I finish speaking, you must:

Correct my grammar clearly.

Rewrite my sentence in natural, confident spoken English.

Briefly explain my main mistakes.

Then continue the conversation naturally based on the scenario.

Keep the conversation realistic and practical.

Focus on spoken English (not academic writing).

Ask follow-up questions to make the conversation deeper.

Keep explanations short and clear.

Format your response like this:

Correction:
(Natural version)

Explanation:
(Short explanation of mistakes)

Continue conversation:
(Continue naturally and ask me something)

You talk first. Let's start the conversation now!
  `;
const SpeakAI = () => {
  const MUL_PROP: MulAIContainerProps = {
    heightRes: 180,
    cols: 1,
    configs: [
      { instanceNo: 0, prefix: 'yts', enableHis: 'N', collapse: 'N' },
      { instanceNo: 1, prefix: 'yts', enableHis: 'N', collapse: 'N' },
      { instanceNo: 2, prefix: 'yts', enableHis: 'Y', collapse: 'Y' },
    ],
  };
  const [scenarioOptions, setScenarioOptions] = useState<string[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>(DEFAULT_SCENARIO);

  useEffect((): void => {
    getDataFromExcel(SCENARIO_RANGE, (items: DataItem[]): void => {
      const scenarios = items
        .map((item) => item.eng?.trim())
        .filter((item): item is string => Boolean(item));

      setScenarioOptions(scenarios);
      if (scenarios.length > 0) {
        setSelectedScenario(scenarios[0]);
      }
    });
  }, []);

  const prompt = useMemo((): string => buildPrompt(selectedScenario), [selectedScenario]);

  return (
    <div className="mobile">
      <select
        className="button-33 inline"
        value={selectedScenario}
        onChange={(e) => setSelectedScenario(e.target.value)}
      >
        {scenarioOptions.length === 0 && (
          <option value={DEFAULT_SCENARIO}>{DEFAULT_SCENARIO}</option>
        )}
        {scenarioOptions.map((scenario) => (
          <option key={scenario} value={scenario}>
            {scenario}
          </option>
        ))}
      </select>
      <AIBoard
        key={selectedScenario}
        index={0}
        prefix="speak-ai"
        enableHis="Y"
        heightRes={280}
        isSpeak="Y"
        isMini={null}
        firstAsk={prompt}
        collapse={'N'}
      />
      <div className="width-100" onClick={() => toggleCollapse('mul-ai')}>
        Mul-AI
      </div>
      <div id="mul-ai" className="collapse-content bolder">
        <MulAI {...MUL_PROP}></MulAI>
      </div>
    </div>
  );
};
export default SpeakAI;
