'use client';
/* eslint-disable react-hooks/exhaustive-deps */
// this is a tools for studying english
import { useEffect, useState, CSSProperties, ChangeEvent, ReactElement } from 'react';
import './style-noti.css';
import _ from 'lodash';
// import { gapi } from 'gapi-script';
import config from '@/common/config.js';
import { load } from '@/common/api/sheetDataRepository.js';
import PractWords from './PracticeWords';
import { FaCircleNotch } from 'react-icons/fa';
import { useSpeechSynthesis } from '@/slearning/hooks/useSpeechSynthesis';
import { FaVolumeUp, FaRedo } from 'react-icons/fa';
import { useCookies } from 'react-cookie';
// import MulAI from '../common/MultiAI';
// import { toggleCollapse } from '../../common/common.js';

interface SheetItem {
  range: string;
  name: string;
}

interface DataItem {
  eng: string;
  vi: string;
  customDefine?: string;
}

interface SheetData {
  items: DataItem[];
}

const STORE_ALIAS = 'STORE_E';
const SHEET_NAME: SheetItem[] = [
  { range: 'Notify!A2:C500', name: 'Board1' },
  { range: 'Notify!E2:G500', name: 'Board2' },
  { range: 'Notify!I2:K500', name: 'Board3' },
  { range: 'Notify!M2:O500', name: 'Board4' },
  { range: 'Notify!Q2:S500', name: 'Board5' },
  { range: 'Notify!U2:W500', name: 'Board6' },
  { range: 'Notify!Y2:AA500', name: 'Board7' },
  { range: `${STORE_ALIAS}1`, name: 'Store1' },
  { range: `${STORE_ALIAS}2`, name: 'Store2' },
  { range: `${STORE_ALIAS}3`, name: 'Store3' },
];

const Notify = (): ReactElement => {
  const { speak, voices } = useSpeechSynthesis();
  const [items, setItems] = useState<DataItem[]>([]);
  const [oderRandomS, setOderRandomS] = useState<string>('random');
  const [isLoadQuestion, setIsLoadQuestion] = useState<boolean>(false);

  const [voiceIndex, setVoiceIndex] = useState<number>(0);
  const [voiceIndexVie, setVoiceIndexVie] = useState<number>(0);
  const [rate, setRate] = useState<number>(1);
  const [volumn, setVolumn] = useState<number>(0.6);
  const [sheet, setSheet] = useState<string>('');
  const [speakStrEng, setSpeakStrEng] = useState<string>('');
  const [speakStrVie, setSpeakStrVie] = useState<string>('');
  const [strContinue, setStrContinue] = useState<string>('');
  const [lineSheet, setLineSheet] = useState<DataItem[]>([]);
  const [cookies, setCookie] = useCookies(['cookieContinue']);

  const [isStop, setIsStop] = useState<boolean>(true);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | number>(-1);
  const [countNotify, setCountNotify] = useState<number>(0);
  const [isShowPract, setIsShowPract] = useState<boolean>(false);
  // const isDarkRef = useRef(null);

  const styleFlexRow: CSSProperties = { display: 'flex', flexDirection: 'row' };
  const styleContainerRatePitch: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 12,
  };
  const SPLIT_WORD = ':';
  const IND_SPEAK_NOTI_VOICE = 'noti-voice';
  const IND_SPEAK_NO_VOICE = 'no-voice';
  const IND_SPEAK_NO_NOTI = 'no-noti';
  const IND_SPEAK_NOTI_NO_VIE = 'noti-no-vie';
  const IND_SPEAK_NO_NOTI_NO_VIE = 'no-noti-no-vie';
  const IND_SPEAK_NO_NOTI_ENG = 'noti-eng-voice';
  const IND_SPEAK_ALL_ENG = 'all-eng';
  const IND_SPEAK_NOTI_ENG = 'noti-eng';

  const IND_VALUE_ON = 'On';
  const IND_VALUE_OFF = 'Off';

  /**  */
  useEffect((): void => {
    const timeValueElement = document.getElementById('timeValue') as HTMLInputElement;
    if (timeValueElement) timeValueElement.value = '50';

    const pracWordElement = document.getElementById('pracWord') as HTMLElement;
    if (pracWordElement) pracWordElement.style.display = 'none';

    const controlElement = document.getElementById('control') as HTMLElement;
    if (controlElement) controlElement.style.display = 'block';

    const notifyControlElement = document.getElementById('notify-control') as HTMLElement;
    if (notifyControlElement) notifyControlElement.style.display = 'block';

    if (!_.isEmpty(cookies)) {
      setStrContinue(cookies.cookieContinue);
    }
  }, []);

  useEffect((): void => {
    voices.forEach((option: any, index: number): void => {
      if (
        // option.name.includes("Vietnam")||
        option.lang.includes('vi-VN')
      ) {
        setVoiceIndexVie(index);
      }
      if (
        // option.name.includes("English")||option.name.includes("United States")||
        option.lang.includes('en-US')
      ) {
        setVoiceIndex(index);
      }
    });
  }, [voices]);

  useEffect((): void | (() => void) => {
    const valueTimeElement = document.getElementById('timeValue') as HTMLInputElement;
    const valueTime = valueTimeElement?.value || '50';
    if (!isStop) {
      const timeout = setTimeout(
        (): void => {
          execute();
          setCountNotify(countNotify + 1);
        },
        Number(valueTime) * 1000,
      );
      setIntervalId(timeout);
      return (): void => {
        clearTimeout(timeout);
      };
    }
  }, [countNotify]);

  useEffect((): void => {
    getDataFromExcel();
  }, [sheet]);

  useEffect((): void => {
    onGSheetApi();
  }, [items]);

  useEffect((): void => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 100);
    setCookie('cookieContinue', strContinue, { path: '/', expires });
  }, [strContinue]);

  /** */
  const getDataFromExcel = async () => {
    if (sheet?.startsWith(STORE_ALIAS)) {
      const storeDataString = localStorage.getItem(sheet);
      const storeData: DataItem[] = storeDataString ? JSON.parse(storeDataString) : [];
      if (!_.isEmpty(storeData)) {
        setItems(storeData);
      }
    } else {
      //  const loadGapi = async () => {
      const { gapi } = await import('gapi-script');

      gapi.load('client:auth2', () => {
        const vsheet = sheet;
        gapi.client
          .init({
            apiKey: config.apiKey,
            clientId: config.clientId,
            discoveryDocs: config.discoveryDocs,
            scope: config.scope,
          })
          .then((): void => {
            load(onLoad, vsheet);
          });
      });
      // };

      // loadGapi();
      // gapi.load('client:auth2', initClient);
    }
  };

  /** */
  const onGSheetApi = (): void => {
    const arrList: string[] = [];
    if (!_.isEmpty(items)) {
      const arrIndexNotNotify: number[] = _.isEmpty(strContinue)
        ? []
        : strContinue.split(',').map(Number);
      if (!_.isEmpty(arrIndexNotNotify) && arrIndexNotNotify.length > 0) {
        arrIndexNotNotify.sort((a, b): number => b - a);
        const listTemp = _.cloneDeep(items);
        arrIndexNotNotify.forEach((inx: number): void => {
          listTemp.splice(inx, 1);
        });
        setLineSheet(listTemp);
      } else {
        setLineSheet(_.cloneDeep(items));
      }
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        let meaning: string = item.vi;
        if (!_.isEmpty(item.customDefine)) {
          meaning = item.customDefine || '';
        }
        if (!_.isEmpty(item.eng) && item.eng.length > 0) {
          if (_.isEmpty(meaning)) {
            arrList.push(item.eng);
          } else {
            arrList.push(item.eng + ' ' + SPLIT_WORD + ' ' + meaning);
          }
        }
      }
    }
    let strResult = '';
    for (let j = 0; j < arrList.length; j++) {
      if (!_.isEmpty(arrList[j])) {
        strResult += arrList[j];
        strResult += '\n';
      }
    }
    const txtFieldElement = document.getElementById('txtField') as HTMLTextAreaElement;
    if (txtFieldElement) txtFieldElement.value = strResult;
  };

  /** */
  // const initClient = (): void => {
  //   //custom sheet
  //   const vsheet = sheet;
  //   gapi.client
  //     .init({
  //       apiKey: config.apiKey,
  //       clientId: config.clientId,
  //       discoveryDocs: config.discoveryDocs,
  //       scope: config.scope,
  //     })
  //     .then((): void => {
  //       load(onLoad, vsheet);
  //     });
  // };

  /** */
  const onLoad = (data: SheetData | null, error: Error | null): void => {
    if (data) {
      const result = data.items;
      const arr: DataItem[] = [];

      result.forEach((item: DataItem): void => {
        if (!_.isEmpty(item) && !_.isEmpty(item.eng)) {
          arr.push(item);
        }
      });

      setItems(arr);
      console.log(arr);
    } else {
      console.log(error);
    }
  };

  /** */
  const execute = (): void => {
    let line: DataItem | null = null;

    const slGenDataElement = document.getElementById('slGenData') as HTMLSelectElement;
    const oderRandom = slGenDataElement?.value || 'random';

    if (oderRandom === 'random') {
      const index = Math.floor(Math.random() * lineSheet.length);
      line = lineSheet[index];
      lineSheet.splice(index, 1);
    } else {
      line = lineSheet[0];
      lineSheet.shift();
    }

    if (line) {
      const indexOrg = items.findIndex((x: DataItem): boolean => x.eng === line!.eng);
      const strC = _.isEmpty(strContinue)
        ? indexOrg.toString()
        : String(strContinue) + ',' + indexOrg.toString();
      setStrContinue(strC);
    }

    if (_.isEmpty(lineSheet)) {
      setLineSheet(_.cloneDeep(items));
      setStrContinue('');
    }

    if (line) {
      onNotiExc(line);
    }
  };

  /** */
  const onNotiExc = (line: DataItem): void => {
    if (!window.Notification) {
      console.log('Browser does not support notifications.');
    } else {
      // check if permission is already granted
      if (Notification.permission === 'granted') {
        // show notification here
        const slIsUseVoiceElement = document.getElementById('slIsUseVoice') as HTMLSelectElement;
        const isSpeak = slIsUseVoiceElement?.value || '';

        if (!_.isEmpty(line)) {
          const engStr = line.eng;
          let viStr: string = line.vi;
          if (!_.isEmpty(line.customDefine)) {
            viStr = line.customDefine || '';
          }
          setSpeakStrEng(engStr);
          setSpeakStrVie(viStr);

          //because state is not synchronized, can't use state in this line(in loop)

          if (
            _.isEqual(isSpeak, IND_SPEAK_NOTI_VOICE) ||
            _.isEqual(isSpeak, IND_SPEAK_NO_NOTI) ||
            _.isEqual(isSpeak, IND_SPEAK_NOTI_NO_VIE) ||
            _.isEqual(isSpeak, IND_SPEAK_NO_NOTI_NO_VIE) ||
            _.isEqual(isSpeak, IND_SPEAK_NO_NOTI_ENG) ||
            _.isEqual(isSpeak, IND_SPEAK_ALL_ENG)
          ) {
            speakText(engStr, true);
          }

          if (
            _.isEqual(isSpeak, IND_SPEAK_NOTI_VOICE) ||
            _.isEqual(isSpeak, IND_SPEAK_NO_NOTI) ||
            _.isEqual(isSpeak, IND_SPEAK_NO_NOTI_ENG)
          ) {
            speakText(viStr, false);
          }
          if (
            _.isEqual(isSpeak, IND_SPEAK_NO_NOTI_ENG) ||
            _.isEqual(isSpeak, IND_SPEAK_ALL_ENG) ||
            _.isEqual(isSpeak, IND_SPEAK_NOTI_ENG)
          ) {
            const notification = new Notification(engStr);
          }

          if (
            _.isEqual(isSpeak, IND_SPEAK_NOTI_VOICE) ||
            _.isEqual(isSpeak, IND_SPEAK_NO_VOICE) ||
            _.isEqual(isSpeak, IND_SPEAK_NOTI_NO_VIE)
          ) {
            const str = engStr + ':' + viStr;
            // eslint-disable-next-line no-redeclare, no-unused-vars
            const notification = new Notification(str);
          }
        }
      } else {
        // request permission from user
        Notification.requestPermission()
          .then(function (p: NotificationPermission): void {
            if (p === 'granted') {
              // show notification here
            } else {
              console.log('User blocked notifications.');
            }
          })
          .catch(function (err: Error): void {
            console.error(err);
          });
      }
    }
  };

  /** */
  const onStop = (): void => {
    setIsStop(true);
    if (typeof intervalId === 'object') {
      clearTimeout(intervalId);
    }
  };
  const onStart = (): void => {
    if (isStop) {
      setIsStop(false);
      execute();
      setCountNotify(countNotify + 1);
    }
  };

  /** */
  const onShowAll = (): void => {
    const prac = document.getElementById('control') as HTMLElement;
    if (prac && prac.style.display === 'block') {
      document.getElementById('control')!.style.display = 'none';
    } else {
      document.getElementById('control')!.style.display = 'block';
    }
  };

  /** */
  const onShowPract = (): void => {
    const prac = document.getElementById('pracWord') as HTMLElement;
    setIsLoadQuestion(true);

    if (prac && prac.style.display === 'block') {
      setIsShowPract(false);
      document.getElementById('pracWord')!.style.display = 'none';
    } else {
      setIsShowPract(true);
      document.getElementById('pracWord')!.style.display = 'block';
      onHideWhenPrac();
    }
  };

  /** */
  const onChangeOrder = (value: string): void => {
    setOderRandomS(value);
  };

  /** */
  const onChangeIsUseVoice = (value: string): void => {
    // setIsUseVoice(value);
    if (_.isEqual(value, IND_SPEAK_NO_VOICE)) {
      document.getElementById('sound-control')!.style.display = 'none';
    } else {
      document.getElementById('sound-control')!.style.display = 'block';
    }
  };

  /** */
  const onHideWhenPrac = (): void => {
    const prac = document.getElementById('notify-control') as HTMLElement;
    if (prac && prac.style.display === 'block') {
      document.getElementById('notify-control')!.style.display = 'none';
    } else {
      document.getElementById('notify-control')!.style.display = 'block';
    }
  };

  const speakText = (speakStr: string, isEng: boolean): void => {
    const vVoiceElement = document.getElementById('voice') as HTMLSelectElement;
    const vVoiceVieElement = document.getElementById('voiceVie') as HTMLSelectElement;
    const vrateElement = document.getElementById('rate') as HTMLInputElement;

    const vVoice = vVoiceElement?.value || '0';
    const vVoiceVie = vVoiceVieElement?.value || '0';
    const vrate = vrateElement?.value || '0.6';

    const utterance = new window.SpeechSynthesisUtterance();

    utterance.text = speakStr;
    // utterance.lang = 'en-US';
    utterance.rate = Number(vrate);
    // utterance.pitch = pitch;
    if (isEng) {
      utterance.voice = voices[Number(vVoice)];
    } else {
      utterance.voice = voices[Number(vVoiceVie)];
    }
    utterance.volume = Number(volumn);
    speak(utterance);
  };
  const handleChangeCookie = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setStrContinue(e.target.value);
  };

  function addStore(): void {
    const storeIndexElement = document.getElementById('store-index') as HTMLSelectElement;
    const storeName = storeIndexElement?.value;
    if (storeName) {
      const storeDataString = localStorage.getItem(storeName);
      const storeData: DataItem[] = storeDataString ? JSON.parse(storeDataString) : [];
      localStorage.setItem(storeName, JSON.stringify([...storeData, ...items]));
    }
  }

  function clearStore(): void {
    const storeIndexElement = document.getElementById('store-index') as HTMLSelectElement;
    const storeName = storeIndexElement?.value;
    if (storeName) {
      localStorage.setItem(storeName, JSON.stringify([]));
    }
  }

  function onRemoveStoreItem(currEng: string, callback: () => void): void {
    console.log('sadsa');
    if (sheet?.startsWith(STORE_ALIAS)) {
      const storeDataString = localStorage.getItem(sheet);
      let storeData: DataItem[] = storeDataString ? JSON.parse(storeDataString) : [];
      storeData = storeData.filter((itm: DataItem): boolean => itm.eng != currEng);
      localStorage.setItem(sheet, JSON.stringify([...storeData]));
      callback();
    }
  }

  return (
    <div className="">
      <div id="notify-control">
        <div className="option-noti bolder" id="control">
          <div className="option-left  notify-left">
            <textarea title="f" id="txtField"></textarea>
            <br />
          </div>
          <div className="option-right notify-right">
            <select
              className="button-33 inline"
              value={sheet}
              name="sheet"
              id="slsheet"
              onChange={(e: ChangeEvent<HTMLSelectElement>): void => {
                if (e.target.value && e.target.value != sheet) {
                  setSheet(e.target.value);
                }
              }}
            >
              {SHEET_NAME.map((option, index) => (
                <option key={option.range} value={option.range}>
                  {`${option.name}`}
                </option>
              ))}
            </select>
            <button className="common-btn inline" onClick={() => getDataFromExcel()}>
              <FaRedo />
            </button>
            <div className="inline">
              <select id="store-index" name="store-index" className="common-btn">
                <option value={`${STORE_ALIAS}1`}>Store1</option>
                <option value={`${STORE_ALIAS}2`}>Store2</option>
                <option value={`${STORE_ALIAS}3`}>Store3</option>
              </select>
              <button className="common-btn inline" onClick={() => addStore()}>
                Add
              </button>
              <button className="common-btn inline" onClick={() => clearStore()}>
                Clear
              </button>
            </div>
            <select
              className="button-33"
              name="genData"
              id="slGenData"
              onChange={(e: ChangeEvent<HTMLSelectElement>): void => {
                onChangeOrder(e.target.value);
              }}
            >
              <option value="random">random</option>
              <option value="order">order</option>
            </select>
            <select
              className="button-33"
              name="isUseVoice"
              id="slIsUseVoice"
              onChange={(e: ChangeEvent<HTMLSelectElement>): void => {
                onChangeIsUseVoice(e.target.value);
              }}
            >
              <option value={IND_SPEAK_ALL_ENG}>Notify Eng - Voice Eng</option>
              <option value={IND_SPEAK_NO_NOTI_ENG}>Notify Eng - Voice</option>
              <option value={IND_SPEAK_NOTI_VOICE}>Notify - Voice</option>
              <option value={IND_SPEAK_NO_VOICE}>Notify</option>
              <option value={IND_SPEAK_NO_NOTI}>Voice</option>
              <option value={IND_SPEAK_NOTI_NO_VIE}>notify - Voice Eng</option>
              <option value={IND_SPEAK_NO_NOTI_NO_VIE}>Voice Eng</option>
              <option value={IND_SPEAK_NOTI_ENG}>noti Eng</option>
            </select>

            <div id="sound-control">
              <div>Voice 1:</div>
              <select
                className="button-33"
                id="voice"
                name="voice"
                value={voiceIndex || ''}
                onChange={(event: ChangeEvent<HTMLSelectElement>): void => {
                  setVoiceIndex(Number(event.target.value));
                }}
              >
                <option value="">Default</option>
                {voices.map((option: any, index: number) => (
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
                  min="0.2"
                  max="2"
                  defaultValue="0.6"
                  step="0.1"
                  id="rate"
                  onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                    setRate(Number(event.target.value));
                  }}
                />
              </div>

              <div>Voice 2:</div>
              <select
                className="button-33"
                id="voiceVie"
                name="voiceVie"
                value={voiceIndexVie || ''}
                onChange={(event: ChangeEvent<HTMLSelectElement>): void => {
                  setVoiceIndexVie(Number(event.target.value));
                }}
              >
                <option value="">Default</option>
                {voices.map((option: any, index: number) => (
                  <option key={option.voiceURI} value={index}>
                    {`${option.lang} - ${option.name}`}
                  </option>
                ))}
              </select>
              <br />
            </div>
            <textarea id="strContinue" value={strContinue} onChange={handleChangeCookie}></textarea>
          </div>
        </div>
        <div className="control-footer">
          <input
            className="common-btn inline"
            type="submit"
            value="Start"
            id="btnStart"
            onClick={(): void => onStart()}
          />
          <button className="common-btn inline" id="btnStop" onClick={(): void => onStop()}>
            Stop
          </button>
          <input className="button-33" type="text" id="timeValue" />
          <input
            className="button-33"
            type="submit"
            value="Show"
            id="btnShow"
            onClick={(): void => onShowAll()}
          />
          <input
            className="button-33"
            type="submit"
            value="Practice"
            id="btnPract"
            onClick={(): void => onShowPract()}
          />
          <input
            className="common-btn inline"
            type="submit"
            id="isNotify"
            value={!isStop ? IND_VALUE_ON : IND_VALUE_OFF}
          />
        </div>
      </div>

      <span id="btnHideWhenPrac" onClick={(): void => onHideWhenPrac()}>
        <FaCircleNotch />
      </span>
      {/* <button id='btnHideWhenPrac' className="common-btn inline" onClick={() => onHideWhenPrac()} ><FaCircleNotch /></button> */}
      {/* <div style={styleContainerRatePitch}> */}
      {/* <div style={styleFlexRow}> */}
      <label htmlFor="volumn">
        <FaVolumeUp className="iconSound" />{' '}
      </label>
      <span className="rate-value">{volumn}</span>
      {/* </div> */}
      <input
        type="range"
        className="width-220 range-color"
        min="0.1"
        max="1"
        defaultValue="0.6"
        step="0.1"
        id="volumn"
        onChange={(event: ChangeEvent<HTMLInputElement>): void => {
          setVolumn(Number(event.target.value));
        }}
      />
      {/* </div> */}
      <div>
        {' '}
        {speakStrEng}: {speakStrVie}
        {_.isEmpty(speakStrEng) ? (
          <div></div>
        ) : (
          <FaVolumeUp className="iconSound" onClick={(): void => speakText(speakStrEng, true)} />
        )}
      </div>
      <div id="pracWord">
        <PractWords
          items={items}
          oderRandom={oderRandomS}
          speakText={speakText}
          isLoadQuestion={isLoadQuestion}
          getDataFromExcel={getDataFromExcel}
          onRemoveStoreItem={onRemoveStoreItem}
          setSheet={setSheet}
          sheet={sheet}
          SHEET_NAME={SHEET_NAME}
          STORE_ALIAS={STORE_ALIAS}
          isShowPract={isShowPract}
        />
      </div>

      {/* <input type='submit' className="common-btn inline" value="AI" onClick={() => toggleCollapse("ai-section")} />

            <div id="ai-section" className='collapse-content bolder'>
                <MulAI size={2} prefix='noti' enableHis={true}></MulAI>
            </div> */}
    </div>
  );
};

export default Notify;
