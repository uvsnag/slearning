'use client';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import { copyContent } from '@/common/common.js';
import MulAI, { MulAIContainerProps } from '@/app/multi-ai/MultiAI';
import { toggleCollapse, COMMON_PROMPT } from '@/common/common.js';
import AIBoard from '@/app/common/components/AIBoard';

const currSentenceNm = 'current-sentence';
const orgTextNm = 'org-text';

let commonArr: string[] = [];

interface NextSentenceProps {
  heightProp?: number;
}

const NextSentence: React.FC<NextSentenceProps> = ({ heightProp }) => {
  // let isShowPract = useRef(false)
  const [currentSentence, setCurrentSentence] = useState('');
  const [orgText, setOrgText] = useState('');
  const MUL_PROP: MulAIContainerProps = {
    heightRes: 180,
    configs: [
      {
        instanceNo: 0,
        prefix: 'ntx',
        enableHis: 'N',
        collapse: 'N',
        title: 'Grammar',
        defaultPrompt: COMMON_PROMPT.CHECK_GRAMMAR,
      },
      {
        instanceNo: 1,
        prefix: 'ntx',
        enableHis: 'N',
        collapse: 'N',
        title: 'Eng-Vie',
        defaultPrompt: COMMON_PROMPT.TRANSLATE_EN_VI,
      },
      {
        instanceNo: 2,
        prefix: 'ntx',
        enableHis: 'N',
        collapse: 'N',
        title: 'Vie-Eng',
        defaultPrompt: COMMON_PROMPT.TRANSLATE_VI_EN,
      },
      { instanceNo: 3, prefix: 'ntx', enableHis: 'Y', collapse: 'N' },
    ],
  };
  useEffect(() => {
    if (!_.isEmpty(localStorage)) {
      setCurrentSentence(localStorage.getItem(currSentenceNm) || '');
      setOrgText(localStorage.getItem(orgTextNm) || '');
    }
    // toggleCollapse("sentence")
  }, []);

  useEffect(() => {
    localStorage.setItem(currSentenceNm, currentSentence);
  }, [currentSentence]);

  useEffect(() => {
    localStorage.setItem(orgTextNm, orgText);
  }, [orgText]);

  function onProcess(): void {
    const matches = orgText.match(/[^.!?]+[.!?]?/g);
    commonArr = matches ? matches.map((s) => s.trim()) : [];
    if (commonArr && commonArr.length > 0) {
      setCurrentSentence(commonArr.shift() || '');
      setOrgText(commonArr.join('\n'));
    }
  }
  function onHideShow(): void {
    toggleCollapse('sentence');
    //    isShowPract.current = true
  }
  return (
    <div>
      <div id="sentence" className="collapse-content bolder">
        <div className="container-55">
          <div>{currentSentence}</div>
          <div>
            <AIBoard
              key={0}
              index={0}
              prefix="pract_sent"
              enableHis="N"
              heightRes={140}
              isMini={true}
              statement={currentSentence}
              lastSentence={null}
            />
          </div>
        </div>
        <input
          type="submit"
          className="common-btn"
          value="Next"
          id="btnExecute"
          onClick={() => onProcess()}
        />
        <input
          type="submit"
          className="common-btn"
          value="Copy"
          id="btnCoppy"
          onClick={() => copyContent('note')}
        />
      </div>
      <input
        type="submit"
        className="common-btn"
        value="Source"
        onClick={() => toggleCollapse('maincontent-nw')}
      />
      <input type="submit" className="common-btn" value="+/-" onClick={() => onHideShow()} />
      <div id="maincontent-nw" className="collapse-content bolder">
        <textarea
          id="sentence-text"
          value={orgText}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setOrgText(event.target.value);
          }}
        ></textarea>
      </div>
      <MulAI {...MUL_PROP}></MulAI>
    </div>
  );
};
export default NextSentence;
