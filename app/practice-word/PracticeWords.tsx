'use client';
import { useEffect, useState, useRef, RefObject } from 'react';
import _ from 'lodash';
import './style.css';
import { FaVolumeUp, FaVolumeMute, FaCog, FaExchangeAlt, FaSyncAlt } from 'react-icons/fa';
import VoiceToText from '@/app/common/components/VoiceToText';
import AIBoard from '@/app/common/components/AIBoard';
import { DataItem, STORE_ALIAS, onRemoveStoreItem } from '@/app/common/hooks/useSheetData';

import { validateArrStrCheck, arrStrCheckToStr } from '@/common/commonElearn';
import PracticeController, { ConfigControlProps } from '../common/components/PracticeController';
import { useSpeechSynthesis } from '../common/hooks/useSpeechSynthesis';
import { toggleCollapse } from '../common/common';
import SheetDataEditor from '../common/components/SheetDataEditor';

interface PractWordsProps {
  prefix?: string;
  enableHis?: 'Y' | 'N';
  heightRes?: number;
  isMini?: boolean;
}

let lastEngVar: string = '';
let arrLineTemp: DataItem[] = [];
let isCheckedRevert: boolean = false;

const PractWords = (props: PractWordsProps) => {
  const [voiceConfig, setVoiceConfig] = useState<ConfigControlProps>({
    defaultSheet: 'Notify!A2:C500',
    oderRandomS: 'random',
    voice: 0,
    rate: 1,
    volume: 0.6,
    index: 'pract_words',
    items: [],
  });
  const MODE_NONE = 'None';
  const MODE_SPEAKE_CHANGE_QUST = 'Speak';

  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [showAns, setShowAns] = useState<string>('');
  const [lastEng, setLastEng] = useState<string>('');
  const [lastVie, setLastVie] = useState<string>('');
  const [classPract, setClassPract] = useState<string>('container-55');
  const [mode, setMode] = useState<string>(MODE_NONE);
  const [isStartRecord, setIsStartRecord] = useState<boolean>(false);
  const [randomAns, setRandomAns] = useState<string[]>([]);
  const [remainCount, setRemainCount] = useState<number>(0);
  const [currEng, setCurrEng] = useState<string | null>(null);
  const inputAns = useRef<HTMLInputElement>(null);
  const { speakText } = useSpeechSynthesis();

  useEffect(() => {
    arrLineTemp = [];
    onChangeQuestion(true);
  }, [voiceConfig.items]);

  function setInputAns(text: string): void {
    if (inputAns.current) {
      inputAns.current.value = text;
    }
  }

  const onChangeQuestion = (isInit: boolean = false): void => {
    let randomAns = new Set<string>();
    const revertCheckbox = document.getElementById('revertAsw') as HTMLInputElement;
    isCheckedRevert = revertCheckbox?.checked ?? false;

    if (!_.isEmpty(voiceConfig.items)) {
      let isStore = voiceConfig.defaultSheet?.startsWith(STORE_ALIAS);
      let listSents = isStore
        ? localStorage.getItem(voiceConfig.defaultSheet)
          ? JSON.parse(localStorage.getItem(voiceConfig.defaultSheet)!)
          : []
        : voiceConfig.items;
      let item: DataItem | null = null;
      let arrTemp: DataItem[] =
        _.isEmpty(arrLineTemp) || isInit ? _.cloneDeep(listSents) : _.cloneDeep(arrLineTemp);
      if (_.isEmpty(arrTemp)) {
        return;
      }
      if (voiceConfig.oderRandomS === 'random') {
        const validOptions = arrTemp.filter((item) => item.eng !== lastEngVar);

        let index = Math.floor(Math.random() * validOptions.length);
        item = validOptions[index];
        if (item) {
          arrTemp = arrTemp.filter((it) => it.eng != item!.eng);
        }
      } else {
        item = arrTemp[0];
        arrTemp.shift();
      }
      arrLineTemp = arrTemp;
      console.log('arrTemp:', arrTemp);
      setRemainCount(arrTemp.length);
      if (item) {
        setCurrEng(item.eng);
      }
      let quest = '';
      if (item) {
        if (_.isEmpty(item.customDefine)) {
          quest = item.vi;
        } else {
          quest = item.customDefine || '';
        }
        if (isCheckedRevert) {
          setAnswer(quest);
          setQuestion(item.eng);
          randomAns.add(quest);
        } else {
          setAnswer(item.eng);
          setQuestion(quest);
          randomAns.add(item.eng);
        }
      }
      setShowAns('');
      const numOfAnsElement = document.getElementById('num-of-ans') as HTMLInputElement;
      let numAnsw = Number(numOfAnsElement?.value ?? 3);
      numAnsw = numAnsw > voiceConfig.items.length ? voiceConfig.items.length : numAnsw;
      while (randomAns.size < numAnsw) {
        let randId = Math.floor(Math.random() * voiceConfig.items.length);
        if (isCheckedRevert) {
          quest = '';
          if (_.isEmpty(voiceConfig.items[randId].customDefine)) {
            quest = voiceConfig.items[randId].vi;
          } else {
            quest = voiceConfig.items[randId].customDefine || '';
          }
          randomAns.add(quest);
        } else {
          randomAns.add(voiceConfig.items[randId].eng);
        }
      }
    }else{
      setRemainCount(0);
    }
    setRandomAns([...randomAns].sort());
  };

  function onNextQuestion(): void {
    if (_.isEmpty(showAns)) {
      onShow();
    } else {
      nextQuestion();
    }
  }
  const onCheck = (): void => {
    let ans = (document.getElementById('answer') as HTMLInputElement)?.value;
    if (_.isEmpty(ans)) {
      ans = (document.getElementById('combo-answer') as HTMLSelectElement)?.value;
    }

    if (!_.isNull(ans) && !_.isNull(answer)) {
      var answ = answer;
      if (ans.trim().toUpperCase() === answ.toUpperCase().trim()) {
        nextQuestion();
      } else {
        let arr = validateArrStrCheck(ans, answer, 0);
        setShowAns(arrStrCheckToStr(arr));
      }
    }
  };

  function nextQuestion(): void {
    const answerInput = document.getElementById('answer') as HTMLInputElement;
    if (answerInput) {
      answerInput.value = '';
    }
    if (isCheckedRevert) {
      lastEngVar = question;
      setLastEng(question);
      setLastVie(answer);
    } else {
      lastEngVar = answer;
      setLastEng(answer);
      setLastVie(question);
    }
    if (mode === MODE_SPEAKE_CHANGE_QUST) {
      if (isCheckedRevert) {
        speakText(question, true, voiceConfig);
      } else {
        speakText(answer, true, voiceConfig);
      }
    }
    onChangeQuestion();
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'ArrowUp') {
    }
    if (e.key === 'Enter') {
      onCheck();
    }
    if (e.nativeEvent.code === 'ShiftLeft') {
      onShow();
    }
    if (e.nativeEvent.code === 'ShiftRight') {
      speakText(lastEng, true, voiceConfig);
    }
    if (e.nativeEvent.code === 'ControlLeft') {
      speakText(answer, true, voiceConfig);
    }
    if (e.nativeEvent.code === 'ControlRight') {
      setMode(mode === MODE_NONE ? MODE_SPEAKE_CHANGE_QUST : MODE_NONE);
    }
    if (e.nativeEvent.code === 'End') {
      nextQuestion();
    }
    if (e.nativeEvent.code === 'Home') {
      // Data reload is handled by PracticeController
    }
  };
  const onShow = (): void => {
    if (_.isEmpty(showAns)) {
      setShowAns(answer);
    } else {
      setShowAns('');
    }
  };
  const hideAI = (): void => {
    if (classPract !== 'container-55') {
      setClassPract('container-55');
    } else {
      setClassPract('hide-ai');
    }
  };

  return (
    <div className={classPract}>
      <div className="prac">
        <div>
          {_.isEmpty(lastEng) ? (
            <div></div>
          ) : (
            <span style={{ fontSize: 19 }}>
              {' '}
              {lastEng} : {lastVie}
              <FaVolumeUp
                className="iconSound"
                onClick={() => speakText(lastEng, true, voiceConfig)}
              />{' '}
            </span>
          )}
        </div><br/>

        <button
          className="common-btn inline"
          onClick={() => {
            onRemoveStoreItem(currEng || '', nextQuestion, voiceConfig.defaultSheet);
          }}
        >
          X
        </button>

        <span>{'\u00A0\u00A0\u00A0'}</span>
      
        <button className="common-btn inline" onClick={() => onNextQuestion()}>
          Next
        </button>
        <br /><br />
        <div>{question}</div>
        <br />
        <div className="" dangerouslySetInnerHTML={{ __html: showAns }}></div>
        <input
          type="text"
          id="answer"
          autoComplete="off"
          ref={inputAns}
          onKeyDown={(e) => handleKeyDown(e)}
        />

        <VoiceToText setText={setInputAns} index={0}></VoiceToText>
        <label>
          <input id="revertAsw" type="checkbox" defaultChecked={false} />⇆
        </label>
        <br />

        <select
          className="button-33"
          id="combo-answer"
          name="combo-ans"
          onChange={(event) => {
            onCheck();
          }}
        >
          <option value=""></option>
          {randomAns.map((ans, index) => (
            <option key={ans} value={ans}>
              {`${ans}`}
            </option>
          ))}
        </select>

        {/* <input
          className="common-btn inline"
          type="submit"
          value="Show Ans"
          id="btnShowAns"
          onClick={() => onShow()}
        /> */}
        <button
          className="common-btn inline"
          onClick={() => setMode(mode === MODE_NONE ? MODE_SPEAKE_CHANGE_QUST : MODE_NONE)}
        >
          {mode === MODE_NONE ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
        <div className="tooltip">
          ?
          <span className="tooltiptext">
            <p>ArrowUp: Record/Stop</p>
            <p>ShiftLeft: Show answer</p>
            <p>ShiftRight: Speak Last Eng</p>
            <p>ControlLeft: Speak Current</p>
            <p>ControlRight: Turn On/Off Speak</p>
            <p>Home: Reload data</p>
            <p>End: Next Answer</p>
          </span>
        </div>
        <span> {remainCount}</span>
        <br />
        <button className="common-btn inline" onClick={() => hideAI()}>
          Hide AI
        </button>
        <input type="number" className="width-30" id="num-of-ans" defaultValue={3} />
        <input
          className="common-btn inline"
          type="submit"
          value="Check"
          id="btnSubmit"
          onClick={() => onCheck()}
        />

          <div onClick={() => toggleCollapse(`config-pract-save-sheet`)}>
          <FaSyncAlt/>
          </div>
          <div className="collapse-content bolder" id={`config-pract-save-sheet`}>
          <SheetDataEditor value1={lastEng} value2={lastVie} isUse={true} />
        </div>
        
        <PracticeController config={voiceConfig} onChange={setVoiceConfig} />
      </div>
      <div className="ai-pract">
        <AIBoard
          key={0}
          index={0}
          prefix={props.prefix ?? 'pract_eng'}
          enableHis={props.enableHis ?? 'N'}
          heightRes={props.heightRes ?? 140}
          isMini={props.isMini ?? true}
          statement={question}
          lastSentence={lastVie}
        />
      </div>
    </div>
  );
};

export default PractWords;
