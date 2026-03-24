'use client';
import { useEffect, useState, useRef } from 'react';
import _ from 'lodash';
import './style.css';
import { FaVolumeUp, FaVolumeMute, FaTrash, FaExchangeAlt, FaSyncAlt } from 'react-icons/fa';
import VoiceToText from '@/app/common/components/VoiceToText';
import AIBoard from '@/app/common/components/AIBoard';
import { DataItem, STORE_ALIAS, onRemoveStoreItem } from '@/app/common/hooks/useSheetData';

import { validateArrStrCheck, arrStrCheckToStr } from '@/common/common';
import { usePracticeContext, toSpeechConfig } from '../common/hooks/usePracticeStore';
import { useSpeechSynthesis } from '../common/hooks/useSpeechSynthesis';
import { toggleCollapse, COMMON_PROMPT } from '../common/common';
import SheetDataEditor from '../common/components/SheetDataEditor';

interface PractWordsProps {
  prefix?: string;
  enableHis?: 'Y' | 'N';
  heightRes?: number;
  isMini?: boolean;
  showPract?: 'PA' | 'P' | 'A';
}

let lastEngVar: string = '';
let arrLineTemp: DataItem[] = [];
let isCheckedRevert: boolean = false;

const PractWords = (props: PractWordsProps) => {
  const { state: practiceState, dispatch: practiceDispatch, reloadSheet } = usePracticeContext();

  const MODE_NONE = 'None';
  const MODE_SPEAKE_CHANGE_QUST = 'Speak';
  const [showPanel, setShowPanel] = useState<'PA' | 'P' | 'A'>(props.showPract ?? 'PA');
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [showAns, setShowAns] = useState<string>('');
  const [lastEng, setLastEng] = useState<string>('');
  const [lastVie, setLastVie] = useState<string>('');
  const [classPract, setClassPract] = useState<string>(
    props.showPract && props.showPract !== 'A' ? 'container-55' : '',
  );
  const [mode, setMode] = useState<string>(MODE_NONE);
  const [isStartRecord, setIsStartRecord] = useState<boolean>(false);
  const [isShowDelete, setIsShowDelete] = useState<boolean>(false);
  const [randomAns, setRandomAns] = useState<string[]>([]);
  const [remainCount, setRemainCount] = useState<number>(0);
  const [currEng, setCurrEng] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const inputAns = useRef<HTMLInputElement>(null);
  const { speakText } = useSpeechSynthesis();

  useEffect(() => {
    setIsShowDelete(
      practiceState.sheet?.startsWith(STORE_ALIAS) || practiceState.sheet?.startsWith('AUTO'),
    );
  }, [practiceState.sheet]);

  useEffect(() => {
    arrLineTemp = [];
    onChangeQuestion(true);
  }, [practiceState.items]);

  function setInputAns(text: string): void {
    if (inputAns.current) {
      inputAns.current.value = text;
    }
  }

  const onChangeQuestion = (isInit: boolean = false): void => {
    let randomAns = new Set<string>();
    const revertCheckbox = document.getElementById('revertAsw') as HTMLInputElement;
    isCheckedRevert = revertCheckbox?.checked ?? false;

    if (!_.isEmpty(practiceState.items)) {
      let isStore = practiceState.sheet?.startsWith(STORE_ALIAS);
      let listSents = isStore
        ? localStorage.getItem(practiceState.sheet)
          ? JSON.parse(localStorage.getItem(practiceState.sheet)!)
          : []
        : practiceState.items;
      let item: DataItem | null = null;
      let arrTemp: DataItem[] =
        _.isEmpty(arrLineTemp) || isInit ? _.cloneDeep(listSents) : _.cloneDeep(arrLineTemp);
      if (_.isEmpty(arrTemp)) {
        return;
      }
      if (practiceState.oderRandomS === 'random') {
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
      numAnsw = numAnsw > practiceState.items.length ? practiceState.items.length : numAnsw;
      while (randomAns.size < numAnsw) {
        let randId = Math.floor(Math.random() * practiceState.items.length);
        if (isCheckedRevert) {
          quest = '';
          if (_.isEmpty(practiceState.items[randId].customDefine)) {
            quest = practiceState.items[randId].vi;
          } else {
            quest = practiceState.items[randId].customDefine || '';
          }
          randomAns.add(quest);
        } else {
          randomAns.add(practiceState.items[randId].eng);
        }
      }
    } else {
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
        speakText(question, true, toSpeechConfig(practiceState));
      } else {
        speakText(answer, true, toSpeechConfig(practiceState));
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
      speakText(lastEng, true, toSpeechConfig(practiceState));
    }
    if (e.nativeEvent.code === 'ControlLeft') {
      speakText(answer, true, toSpeechConfig(practiceState));
    }
    if (e.nativeEvent.code === 'ControlRight') {
      setMode(mode === MODE_NONE ? MODE_SPEAKE_CHANGE_QUST : MODE_NONE);
    }
    if (e.nativeEvent.code === 'End') {
      nextQuestion();
    }
    if (e.nativeEvent.code === 'Home') {
      // Data reload is handled by the store
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
    <div className={`${classPract} practice-words-page`}>
      {(showPanel == 'PA' || showPanel == 'P') && (
        <div className="prac practice-card">
          <div className="practice-message">{message}</div>
          <div className="practice-last-answer">
            {_.isEmpty(lastEng) ? (
              <div></div>
            ) : (
              <span style={{ fontSize: 19 }}>
                {' '}
                {lastEng} : {lastVie}
                <FaVolumeUp
                  className="iconSound"
                  onClick={() => speakText(lastEng, true, toSpeechConfig(practiceState))}
                />{' '}
              </span>
            )}
          </div>
          <br />

          <input
            type="number"
            className="width-30 practice-num-ans common-input"
            id="num-of-ans"
            defaultValue={3}
          />
          <input
            className="common-btn"
            type="submit"
            value="Check"
            id="btnSubmit"
            onClick={() => onCheck()}
          />
          <button
            className="common-btn"
            onClick={() => setMode(mode === MODE_NONE ? MODE_SPEAKE_CHANGE_QUST : MODE_NONE)}
          >
            {mode === MODE_NONE ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          <span className="practice-remain-count"> {remainCount}</span>
          <label>
            <input id="revertAsw" type="checkbox" defaultChecked={false} />⇆
          </label>

          <br />
          <br />
          <div className="practice-question">{question}</div>
          <br />
          <div
            className="practice-answer-preview"
            dangerouslySetInnerHTML={{ __html: showAns }}
          ></div>
          <input
            type="text"
            id="answer"
            autoComplete="off"
            ref={inputAns}
            onKeyDown={(e) => handleKeyDown(e)}
            className="common-input"
          />

          <VoiceToText setText={setInputAns} index={0}></VoiceToText>

          <br />

          <select
            className="common-input practice-answer-select"
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

          <div className="right">
            {isShowDelete && (
              <button
                className="common-btn width-small-btn"
                onClick={() => {
                  onRemoveStoreItem(currEng || '', nextQuestion, practiceState.sheet);
                  setMessage(`🗑️:${currEng}`);
                }}
              >
                🗑️
              </button>
            )}

            <button className="common-btn width-small-btn" onClick={() => onNextQuestion()}>
              Next
            </button>
          </div>
          <br />
          <br />
          <br />

          {/* <div className="common-toggle" onClick={() => toggleCollapse(`config-pract-save-sheet`)}>
            <FaSyncAlt />
          </div>
          <div className="collapse-content  ui-sub-panel" id={`config-pract-save-sheet`}>
            <SheetDataEditor value1={lastEng} value2={lastVie} isUse={true} />
          </div> */}
        </div>
      )}
      {showPanel == 'A' && (
        <AIBoard
          key={0}
          index={0}
          prefix={`${props.prefix}pract_eng`}
          enableHis={props.enableHis ?? 'N'}
          heightRes={props.heightRes ?? 220}
          collapse={'N'}
          title={'Add Excel'}
          defaultPrompt={COMMON_PROMPT.ADD_EXCEL_ENG}
          isSpeak="F"
          speakSplitter={`\n`}
        />
      )}
      <div>
        {showPanel === 'PA' && (
          <AIBoard
            key={1}
            index={0}
            prefix={`${props.prefix}pract_eng2`}
            enableHis={props.enableHis ?? 'N'}
            heightRes={props.heightRes ?? 220}
            isMini={props.isMini ?? true}
            statement={question}
            lastSentence={lastEng}
            title={'Vie-Eng'}
            defaultPrompt={COMMON_PROMPT.TRANSLATE_VI_EN}
          />
        )}
        <div className="panel-radio-group">
          <label className="panel-radio">
            <input
              type="radio"
              name="panel"
              value="PA"
              checked={showPanel === 'PA'}
              onChange={() => {
                setShowPanel('PA');
                setClassPract('container-55');
              }}
            />
            Pract + AI
          </label>
          <label className="panel-radio">
            <input
              type="radio"
              name="panel"
              value="P"
              checked={showPanel === 'P'}
              onChange={() => {
                setShowPanel('P');
                setClassPract('');
              }}
            />
            Pract
          </label>
          <label className="panel-radio">
            <input
              type="radio"
              name="panel"
              value="A"
              checked={showPanel === 'A'}
              onChange={() => {
                setShowPanel('A');
                setClassPract('');
              }}
            />
            AI
          </label>
          <div className="tooltip ">
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
        </div>
      </div>
    </div>
  );
};

export default PractWords;
