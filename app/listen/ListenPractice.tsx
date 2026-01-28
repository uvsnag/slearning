'use client';
import { useEffect, useState } from 'react';
import type { KeyboardEvent, ChangeEvent, CSSProperties } from 'react';
import _ from 'lodash';
import { FaRegFrown, FaRegSmile, FaVolumeUp } from 'react-icons/fa';
import { gapi } from 'gapi-script';
import config from '@/common/config.js';
import { getDataFromExcel } from '@/app/common/hooks/useSheetData';
import { useSpeechSynthesis } from '@/app/common/hooks/useSpeechSynthesis';

/** =======================
 *  Types
 *  ======================= */
interface ListenItem {
  eng: string;
  customDefine: string;
}

interface LoadResult {
  items: ListenItem[];
}

const ListenPractice: React.FC = () => {
  const styleFlexRow: CSSProperties = { display: 'flex', flexDirection: 'row' };
  const styleContainerRatePitch: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 12,
  };

  const ALL_WORDS = '-1';
  const sheet: string = config.listen.sheetDefault;

  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [errorMs, setErrorMs] = useState<string>('');
  const [showAns, setShowAns] = useState<string>('');

  const [items, setItems] = useState<ListenItem[]>([]);
  const [classItems, setClassItems] = useState<ListenItem[]>([]);
  const [voiceIndex, setVoiceIndex] = useState<number>(0);
  const [indexClass, setIndexClass] = useState<string | undefined>();
  const [ansList, setAnsList] = useState<ListenItem[]>([]);
  const [ansListTemp, setAnsListTemp] = useState<ListenItem[]>([]);
  const [rate, setRate] = useState<number>(0.9);
  const [lastAnsw, setLastAnsw] = useState<string>('');

  const { speak, voices } = useSpeechSynthesis();

  /** =======================
   *  Effects
   *  ======================= */
  useEffect((): void => {
    // ggSheetProcess(onLoad, sheet, 'get');
    getDataFromExcel(sheet, onLoad);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (_.isEmpty(items)) return;

    let indexTemp: string | number = -1;
    const arrClassItem: ListenItem[] = [];

    items.forEach((item) => {
      if (!_.isEmpty(item.customDefine) && item.customDefine !== indexTemp) {
        arrClassItem.push(item);
        indexTemp = item.customDefine;
      }
    });

    setClassItems(arrClassItem);
    setIndexClass(ALL_WORDS);
  }, [items]);

  useEffect((): void => {
    voices.forEach((option, index) => {
      if (option.lang.includes('en-US')) {
        setVoiceIndex(index);
      }
    });
  }, [voices]);

  useEffect((): void => {
    if (!_.isEmpty(answer)) {
      onCheck();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer]);

  useEffect((): void => {
    let arrAnsList: ListenItem[] = [];

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
   *  Data
   *  ======================= */

  const onLoad = (data?: LoadResult, error?: unknown): void => {
    if (data) {
      const arr: ListenItem[] = [];

      data.items.forEach((item) => {
        if (!_.isEmpty(item) && !_.isEmpty(item.eng)) {
          arr.push(item);
        }
      });

      setItems(arr);
    } else {
      console.log(error);
    }
  };

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
    const vVoice = (document.getElementById('voice') as HTMLSelectElement | null)?.value;
    const vrate = (document.getElementById('rate') as HTMLInputElement | null)?.value;

    const utterance = new window.SpeechSynthesisUtterance();
    utterance.text = speakStr;
    utterance.rate = Number(vrate);
    if (isEng && vVoice !== undefined) {
      utterance.voice = voices[Number(vVoice)];
    }
    utterance.volume = 1;
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

  /** =======================
   *  Render
   *  ======================= */
  return (
    <div className="prac">
      <div className="">
        <select className="button-33" onChange={(e) => setIndexClass(e.target.value)}>
          <option value={ALL_WORDS}>All Word</option>
          {classItems.map((item) => (
            <option value={item.customDefine} key={item.eng}>
              {item.eng}
            </option>
          ))}
        </select>

        <select
          className="button-33 inline"
          id="voice"
          value={voiceIndex || ''}
          onChange={(e) => setVoiceIndex(Number(e.target.value))}
        >
          <option value="">Default</option>
          {voices.map((option, index) => (
            <option key={option.voiceURI} value={index}>
              {`${option.lang} - ${option.name}`}
            </option>
          ))}
        </select>

        <div style={styleContainerRatePitch}>
          <div style={styleFlexRow}>
            <label htmlFor="rate">Speed: </label>
            <div className="rate-value">{rate}</div>
          </div>
          <input
            type="range"
            className="width-220 range-color"
            min="0.2"
            max="2"
            defaultValue="0.6"
            step="0.1"
            id="rate"
            onChange={(e) => setRate(Number(e.target.value))}
          />
        </div>

        <div>
          {!_.isEmpty(question) && (
            <FaVolumeUp className="iconSound" onClick={() => speakText(question, true)} />
          )}
        </div>
      </div>

      <input type="text" id="answer" onKeyDown={handleKeyDown} />
      <br />

      <select className="button-33" onChange={changeAns} value={answer || ''}>
        <option value="">Choose</option>
        {ansListTemp.map((item) => (
          <option value={item.eng} key={item.eng}>
            {item.eng}
          </option>
        ))}
      </select>

      <br />
      <div className="msg">{errorMs === 'wrong!' ? <FaRegFrown /> : <FaRegSmile />}</div>
      {errorMs}
      <br />

      <input className="button-33" type="submit" value="Check" onClick={onCheck} />

      {ansListTemp.map((item) => (
        <div key={item.eng}>
          {item.eng}
          <FaVolumeUp className="iconSound" onClick={() => speakText(item.eng, true)} />
        </div>
      ))}

      <input className="common-btn" type="submit" value="Show Ans" onClick={onShow} />

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
