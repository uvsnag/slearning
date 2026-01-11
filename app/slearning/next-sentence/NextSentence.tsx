import { useEffect, useState } from 'react';
import _ from 'lodash';
import { copyContent } from '@/common/common.js';
import MulAI from '@/slearning/multi-ai/MultiAI';
import { toggleCollapse } from '@/common/common.js';
import AIBoard from '@/common/components/AIBoard';

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
              enableHis={false}
              heightRes={140}
              isMini={true}
              statement={currentSentence}
              isShowPract={true}
              lastSentence={null}
            />
          </div>
        </div>
        <input
          type="submit"
          className="common-btn inline"
          value="Next"
          id="btnExecute"
          onClick={() => onProcess()}
        />
        <input
          type="submit"
          className="common-btn inline"
          value="Copy"
          id="btnCoppy"
          onClick={() => copyContent('note')}
        />
      </div>
      <input
        type="submit"
        className="common-btn inline"
        value="Source"
        onClick={() => toggleCollapse('maincontent-nw')}
      />
      <input type="submit" className="common-btn inline" value="+/-" onClick={() => onHideShow()} />
      <div id="maincontent-nw" className="collapse-content bolder">
        <textarea
          id="sentence-text"
          value={orgText}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            setOrgText(event.target.value);
          }}
        ></textarea>
      </div>
      <MulAI size={4} prefix="nxt" enableHis={false} heightProp={heightProp}></MulAI>
    </div>
  );
};
export default NextSentence;
