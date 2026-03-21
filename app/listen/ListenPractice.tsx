'use client';
import { useEffect, useState } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';
import _ from 'lodash';
import { FaRegFrown, FaRegSmile, FaVolumeUp, FaTrash } from 'react-icons/fa';
import config from '@/common/config.js';
import { useSpeechSynthesis } from '@/app/common/hooks/useSpeechSynthesis';
import PracticeController, { ConfigControlProps } from '@/app/common/components/PracticeController';
import { DataItem, onRemoveStoreItem, STORE_ALIAS } from '@/app/common/hooks/useSheetData';
import SpeakPracticeInput from '../mobile/youtube-sub/SpeakPracticeInput';
/** =======================
 *  Types
 *  ======================= */

const ListenPractice: React.FC = () => {
  const ALL_WORDS = '-1';

  const [sheetConfig, setSheetConfig] = useState<ConfigControlProps>({
    propSheet: 'AUTO!Q2:S500',
    oderRandomS: 'random',
    voice: 0,
    rate: 0.9,
    volume: 1,
    index: 'listen_prac',
    items: [],
    isOpen: true,
  });

  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [errorMs, setErrorMs] = useState<string>('');
  const [showAns, setShowAns] = useState<string>('');

  const [items, setItems] = useState<DataItem[]>([]);
  const [classItems, setClassItems] = useState<DataItem[]>([]);
  const [indexClass, setIndexClass] = useState<string | undefined>();
  const [ansList, setAnsList] = useState<DataItem[]>([]);
  const [ansListTemp, setAnsListTemp] = useState<DataItem[]>([]);
  const [lastAnsw, setLastAnsw] = useState<string>('');
  const [showVie, setShowVie] = useState<boolean>(false);
  const [isShowDelete, setIsShowDelete] = useState<boolean>(false);

  const { speak, voices } = useSpeechSynthesis();

  /** =======================
   *  Effects
   *  ======================= */
  useEffect(() => {
    if (_.isEqual(indexClass, ALL_WORDS)) {
      const itemAns = ansList.filter((item) => item.eng === question);
      if (!_.isEmpty(itemAns)) {
        const arr = ansList.filter((item) => item.customDefine === itemAns[0].customDefine);
        setAnsListTemp(arr);
      }
    } else {
      setAnsListTemp(ansList);
    }

    const handler = (e: KeyboardEvent | globalThis.KeyboardEvent): void => {
      if ((e as globalThis.KeyboardEvent).code === 'Space') {
        speakText(question, true);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [question]);

  useEffect((): void => {
    onChangeQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ansList]);

  useEffect((): void => {
    console.log(sheetConfig.items);
    if (_.isEmpty(sheetConfig.items)) return;

    const arr: DataItem[] = [];

    sheetConfig.items.forEach((item) => {
      if (!_.isEmpty(item) && !_.isEmpty(item.eng)) {
        arr.push(item);
      }
    });

    setItems(arr);
    setAnsListTemp(arr);
    // Derive classItems from processed items
    let indexTemp: string | number = -1;
    const arrClassItem: DataItem[] = [];

    arr.forEach((item) => {
      if (!_.isEmpty(item.customDefine) && item.customDefine !== indexTemp) {
        arrClassItem.push(item);
        indexTemp = item.customDefine || '';
      }
    });

    setClassItems(arrClassItem);
    setIndexClass(ALL_WORDS);
  }, [sheetConfig.items]);

  useEffect(() => {
    setIsShowDelete(
      sheetConfig.propSheet?.startsWith(STORE_ALIAS) || sheetConfig.propSheet?.startsWith('AUTO'),
    );
  }, [sheetConfig.propSheet]);

  useEffect((): void => {
    if (!_.isEmpty(answer)) {
      onCheck();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer]);

  useEffect((): void => {
    let arrAnsList: DataItem[] = [];

    if (indexClass === ALL_WORDS) {
      arrAnsList = items;
    } else {
      items.forEach((item) => {
        if (item.customDefine === indexClass) {
          arrAnsList.push(item);
        }
      });
    }

    setAnsList(arrAnsList);
    // eslint-disable-next-line
  }, [indexClass]);

  /** =======================
   *  Logic
   *  ======================= */
  const onChangeQuestion = (): void => {
    if (!_.isEmpty(ansList)) {
      const ans = ansList[(Math.random() * ansList.length) | 0];
      setQuestion(ans.eng);
      speakText(ans.eng, true);
      setShowAns('');
      setAnswer('');
    }
  };

  const onCheck = (): void => {
    if (!_.isNull(answer)) {
      if (answer.trim().toUpperCase() === question.toUpperCase().trim()) {
        onChangeQuestion();
        setErrorMs('correct!');
        const input = document.getElementById('answer') as HTMLInputElement | null;
        if (input) input.value = '';
        setLastAnsw(answer);
      } else {
        setErrorMs('wrong!');
      }
    }
  };

  const onShow = (): void => {
    setShowAns(_.isEmpty(showAns) ? question : '');
  };

  const speakText = (speakStr: string, isEng: boolean): void => {
    const utterance = new window.SpeechSynthesisUtterance();
    utterance.text = speakStr;
    utterance.rate = sheetConfig.rate;
    if (isEng) {
      utterance.voice = voices[sheetConfig.voice];
    }
    utterance.volume = sheetConfig.volume;
    speak(utterance);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      setAnswer(e.currentTarget.value);
    }
  };

  const changeAns = (e: ChangeEvent<HTMLSelectElement>): void => {
    setAnswer(e.target.value);
  };

  const handleDeleteItem = async (eng: string): Promise<void> => {
    await onRemoveStoreItem(eng, () => {}, sheetConfig.propSheet);
    setSheetConfig((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.eng !== eng),
    }));
    if (question === eng) {
      setQuestion('');
      setShowAns('');
      setAnswer('');
    }
  };

  /** =======================
   *  Render
   *  ======================= */
  return (
    <div className="prac">
      <div className="">
        <PracticeController config={sheetConfig} onChange={setSheetConfig} />
        <div>
          {!_.isEmpty(question) && (
            <FaVolumeUp className="iconSound" onClick={() => speakText(question, true)} />
          )}
        </div>
        <select className="common-input" onChange={(e) => setIndexClass(e.target.value)}>
          <option value={ALL_WORDS}>All Word</option>
          {classItems.map((item) => (
            <option value={item.customDefine} key={item.eng}>
              {item.eng}
            </option>
          ))}
        </select>
        <input type="text" id="answer" onKeyDown={handleKeyDown} />
        <div className="common-input">
          <label>
            <input
              type="radio"
              name="show-vie"
              checked={showVie}
              onChange={() => setShowVie(true)}
            />
            Show
          </label>
          <label>
            <input
              type="radio"
              name="show-vie"
              checked={!showVie}
              onChange={() => setShowVie(false)}
            />
            Off
          </label>
        </div>
        <select className="common-input" onChange={changeAns} value={answer || ''}>
          <option value="">Choose</option>
          {ansListTemp.map((item) => (
            <option value={item.eng} key={item.eng}>
              {item.eng}
            </option>
          ))}
        </select>
        <input className="common-input" type="submit" value="Check" onClick={onCheck} />
        <input className="common-input" type="submit" value="Show Ans" onClick={onShow} />
      </div>
      {/* <div className="msg">{errorMs === 'wrong!' ? <FaRegFrown /> : <FaRegSmile />}</div> */}
      {errorMs}

      {ansListTemp.map((item) => (
        <div key={item.eng}>
          {isShowDelete && (
            <button className="common-btn" onClick={() => handleDeleteItem(item.eng)}>
              <FaTrash />
            </button>
          )}
          {item.eng}
          {showVie ? `: ${item.vi}` : ''}
          <FaVolumeUp className="iconSound" onClick={() => speakText(item.eng, true)} />
        </div>
      ))}
      <div className="float-sticky">
        <SpeakPracticeInput voiceIndex="voice-practice" type="INPUT" />
      </div>
      <div>{showAns}</div>

      {!_.isEmpty(lastAnsw) && (
        <div>
          Last : {lastAnsw}
          <FaVolumeUp className="iconSound" onClick={() => speakText(lastAnsw, true)} />
        </div>
      )}
    </div>
  );
};

export default ListenPractice;
