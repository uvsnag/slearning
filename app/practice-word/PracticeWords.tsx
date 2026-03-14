'use client';
import { useEffect, useState, useRef, RefObject } from 'react';
import _ from 'lodash';
import './style.css';
import { FaVolumeUp, FaVolumeMute, FaTrash, FaExchangeAlt, FaSyncAlt } from 'react-icons/fa';
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
  showPract?: 'Y' | 'N' | '';
}

let lastEngVar: string = '';
let arrLineTemp: DataItem[] = [];
let isCheckedRevert: boolean = false;

const PractWords = (props: PractWordsProps) => {
  const [sheetConfig, setSheetConfig] = useState<ConfigControlProps>({
    propSheet: 'Notify!A2:C500',
    oderRandomS: 'random',
    voice: 0,
    rate: 1,
    volume: 0.6,
    index: 'pract_words',
    items: [],
  });
  const MODE_NONE = 'None';
  const MODE_SPEAKE_CHANGE_QUST = 'Speak';
  const [showPanel, setShowPanel] = useState<'Y' | 'N' | ''>(props.showPract ?? 'Y');
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [showAns, setShowAns] = useState<string>('');
  const [lastEng, setLastEng] = useState<string>('');
  const [lastVie, setLastVie] = useState<string>('');
  const [classPract, setClassPract] = useState<string>(props.showPract ? 'container-55' : '');
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
      sheetConfig.propSheet?.startsWith(STORE_ALIAS) || sheetConfig.propSheet?.startsWith('AUTO'),
    );
  }, [sheetConfig.propSheet]);

  useEffect(() => {
    arrLineTemp = [];
    onChangeQuestion(true);
  }, [sheetConfig.items]);

  function setInputAns(text: string): void {
    if (inputAns.current) {
      inputAns.current.value = text;
    }
  }

  const onChangeQuestion = (isInit: boolean = false): void => {
    let randomAns = new Set<string>();
    const revertCheckbox = document.getElementById('revertAsw') as HTMLInputElement;
    isCheckedRevert = revertCheckbox?.checked ?? false;

    if (!_.isEmpty(sheetConfig.items)) {
      let isStore = sheetConfig.propSheet?.startsWith(STORE_ALIAS);
      let listSents = isStore
        ? localStorage.getItem(sheetConfig.propSheet)
          ? JSON.parse(localStorage.getItem(sheetConfig.propSheet)!)
          : []
        : sheetConfig.items;
      let item: DataItem | null = null;
      let arrTemp: DataItem[] =
        _.isEmpty(arrLineTemp) || isInit ? _.cloneDeep(listSents) : _.cloneDeep(arrLineTemp);
      if (_.isEmpty(arrTemp)) {
        return;
      }
      if (sheetConfig.oderRandomS === 'random') {
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
      numAnsw = numAnsw > sheetConfig.items.length ? sheetConfig.items.length : numAnsw;
      while (randomAns.size < numAnsw) {
        let randId = Math.floor(Math.random() * sheetConfig.items.length);
        if (isCheckedRevert) {
          quest = '';
          if (_.isEmpty(sheetConfig.items[randId].customDefine)) {
            quest = sheetConfig.items[randId].vi;
          } else {
            quest = sheetConfig.items[randId].customDefine || '';
          }
          randomAns.add(quest);
        } else {
          randomAns.add(sheetConfig.items[randId].eng);
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
        speakText(question, true, sheetConfig);
      } else {
        speakText(answer, true, sheetConfig);
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
      speakText(lastEng, true, sheetConfig);
    }
    if (e.nativeEvent.code === 'ControlLeft') {
      speakText(answer, true, sheetConfig);
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
    <div className={`${classPract} practice-words-page`}>
      {showPanel == 'Y' && (
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
                  onClick={() => speakText(lastEng, true, sheetConfig)}
                />{' '}
              </span>
            )}
          </div>
          <br />

          {isShowDelete && (
            <button
              className="common-btn"
              onClick={() => {
                onRemoveStoreItem(currEng || '', nextQuestion, sheetConfig.propSheet);
                setMessage(`🗑️:${currEng}`);
                // setTimeout(() => setMessage(''), 2000);
              }}
            >
              🗑️
            </button>
          )}

          <span>{'\u00A0\u00A0\u00A0'}</span>

          <button className="common-btn" onClick={() => onNextQuestion()}>
            Next
          </button>
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
          <label>
            <input id="revertAsw" type="checkbox" defaultChecked={false} />⇆
          </label>
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

          {/* <input
          className="common-btn"
          type="submit"
          value="Show Ans"
          id="btnShowAns"
          onClick={() => onShow()}
        /> */}
          <button
            className="common-btn"
            onClick={() => setMode(mode === MODE_NONE ? MODE_SPEAKE_CHANGE_QUST : MODE_NONE)}
          >
            {mode === MODE_NONE ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          <div className="tooltip practice-tooltip">
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
          <span className="practice-remain-count"> {remainCount}</span>
          <br />
          <button className="common-btn" onClick={() => hideAI()}>
            Hide AI
          </button>
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

          <div className="common-toggle" onClick={() => toggleCollapse(`config-pract-save-sheet`)}>
            <FaSyncAlt />
          </div>
          <div className="collapse-content  ui-sub-panel" id={`config-pract-save-sheet`}>
            <SheetDataEditor value1={lastEng} value2={lastVie} isUse={true} />
          </div>

          <PracticeController config={sheetConfig} onChange={setSheetConfig} />
        </div>
      )}
      {showPanel == 'N' && (
        <AIBoard
          key={0}
          index={0}
          prefix={`${props.prefix}pract_eng2`}
          enableHis={props.enableHis ?? 'N'}
          heightRes={props.heightRes ?? 220}
          collapse={'N'}

          // isMini={props.isMini ?? true}
          // statement={question}
          // lastSentence={lastVie}
        />
      )}
      <div
      // className="ai-pract practice-ai-panel"
      >
        <AIBoard
          key={0}
          index={0}
          prefix={props.prefix ?? 'pract_eng'}
          enableHis={props.enableHis ?? 'N'}
          heightRes={props.heightRes ?? 220}
          isMini={props.isMini ?? true}
          statement={question}
          lastSentence={lastEng}
          title={'Add Excel'}
          defaultPrompt={`dịch từ này sang tiếng anh, trả lời ngắn gọn theo format:
"viết lại từ tiếng anh (sửa chính tả)
nghĩa tiếng việt ngắn gọn"

Ví dụ 1 (từ có 1 nghĩa):
tôi chat: dog
trả lời: 
Dog
con chó (n)


Ví dụ 2 (từ có nhiều nghĩa, liệt kê hết nghĩa):
tôi chat: book
trả lời: 
Book
cuốn sách (n), đặt phòng (v)


Ví dụ 3:
tôi chat: it wasnt mean to be	
trả lời: 
It wasn't meant to be	
Không phải định mệnh, Không có duyên.`}
        />
        <div className="panel-radio-group">
          <label className="panel-radio">
            <input
              type="radio"
              name="panel"
              value="Y"
              checked={showPanel === 'Y'}
              onChange={() => {
                setShowPanel('Y');
                setClassPract('container-55');
              }}
            />
            Pract
          </label>
          <label className="panel-radio">
            <input
              type="radio"
              name="panel"
              value="N"
              checked={showPanel === 'N'}
              onChange={() => {
                setShowPanel('N');
                setClassPract('container-55');
              }}
            />
            AI
          </label>
          <label className="panel-radio">
            <input
              type="radio"
              name="panel"
              value=""
              checked={showPanel === ''}
              onChange={() => {
                setShowPanel('');
                setClassPract('');
              }}
            />
            Single
          </label>
        </div>
      </div>
    </div>
  );
};

export default PractWords;
