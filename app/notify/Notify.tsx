'use client';
import { useEffect, useState, CSSProperties, ChangeEvent, ReactElement } from 'react';
import './style-noti.css';
import _ from 'lodash';
import { DataItem } from '@/app/common/hooks/useSheetData';
import { useSpeechSynthesis } from '@/app/common/hooks/useSpeechSynthesis';
import { FaVolumeUp, FaEyeSlash } from 'react-icons/fa';
import { useCookies } from 'react-cookie';
import PracticeController, { ConfigControlProps } from '../common/components/PracticeController';

const Notify = (): ReactElement => {
  const [sheetConfig, setSheetConfig] = useState<ConfigControlProps>({
    propSheet: 'Notify!A2:C500',
    oderRandomS: 'random',
    voice: 0,
    rate: 1,
    volume: 1,
    index: 'notify',
    items: [],
  });
  const { speakText } = useSpeechSynthesis();
  const [items, setItems] = useState<DataItem[]>([]);
  const [speakStrEng, setSpeakStrEng] = useState<string>('');
  const [speakStrVie, setSpeakStrVie] = useState<string>('');
  const [strContinue, setStrContinue] = useState<string>('');
  const [lineSheet, setLineSheet] = useState<DataItem[]>([]);
  const [cookies, setCookie] = useCookies(['cookieContinue']);

  const [isStop, setIsStop] = useState<boolean>(true);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | number>(-1);
  const [countNotify, setCountNotify] = useState<number>(0);
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
    console.log('  Voice Config Changed:', sheetConfig);
  }, [sheetConfig]);

  useEffect((): void => {
    if (sheetConfig.items) {
      // getDataFromExcel(sheetConfig.sheet, setItems);
      setItems(sheetConfig.items);
    }
  }, [sheetConfig.items]);

  useEffect((): void => {
    onGSheetApi();
  }, [items]);

  useEffect((): void => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 100);
    setCookie('cookieContinue', strContinue, { path: '/', expires });
  }, [strContinue]);

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
    // const txtFieldElement = document.getElementById('txtField') as HTMLTextAreaElement;
    // if (txtFieldElement) txtFieldElement.value = strResult;
  };

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

  const onNotiExc = (line: DataItem): void => {
    if (!window.Notification) {
      console.log('Browser does not support notifications.');
    } else {
      if (Notification.permission === 'granted') {
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

          if (
            _.isEqual(isSpeak, IND_SPEAK_NOTI_VOICE) ||
            _.isEqual(isSpeak, IND_SPEAK_NO_NOTI) ||
            _.isEqual(isSpeak, IND_SPEAK_NOTI_NO_VIE) ||
            _.isEqual(isSpeak, IND_SPEAK_NO_NOTI_NO_VIE) ||
            _.isEqual(isSpeak, IND_SPEAK_NO_NOTI_ENG) ||
            _.isEqual(isSpeak, IND_SPEAK_ALL_ENG)
          ) {
            speakText(engStr, true, sheetConfig);
          }

          if (
            _.isEqual(isSpeak, IND_SPEAK_NOTI_VOICE) ||
            _.isEqual(isSpeak, IND_SPEAK_NO_NOTI) ||
            _.isEqual(isSpeak, IND_SPEAK_NO_NOTI_ENG)
          ) {
            speakText(viStr, false, sheetConfig);
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
            const notification = new Notification(str);
          }
        }
      } else {
        Notification.requestPermission()
          .then(function (p: NotificationPermission): void {
            if (p === 'granted') {
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

  const onShowAll = (): void => {
    const prac = document.getElementById('control') as HTMLElement;
    if (prac && prac.style.display === 'block') {
      document.getElementById('control')!.style.display = 'none';
    } else {
      document.getElementById('control')!.style.display = 'block';
    }
  };

  const onChangeIsUseVoice = (value: string): void => {
    if (_.isEqual(value, IND_SPEAK_NO_VOICE)) {
      document.getElementById('sound-control')!.style.display = 'none';
    } else {
      document.getElementById('sound-control')!.style.display = 'block';
    }
  };

  const onHideWhenPrac = (): void => {
    const prac = document.getElementById('notify-control') as HTMLElement;
    if (prac && prac.style.display === 'block') {
      document.getElementById('notify-control')!.style.display = 'none';
    } else {
      document.getElementById('notify-control')!.style.display = 'block';
    }
  };
  const handleChangeCookie = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setStrContinue(e.target.value);
  };
  return (
    <div className="">
      <PracticeController config={sheetConfig} onChange={setSheetConfig} />
      <div id="notify-control">
        <textarea id="strContinue" value={strContinue} onChange={handleChangeCookie}></textarea>
        <br />
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
        {/* <div className="option-noti bolder" id="control">
          <div className="option-left  notify-left">
            <textarea title="f" id="txtField"></textarea>
            <br />
          </div>
          <div className="option-right notify-right"></div>
        </div> */}
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
            className="common-btn inline"
            type="submit"
            id="isNotify"
            value={!isStop ? IND_VALUE_ON : IND_VALUE_OFF}
          />
        </div>
      </div>

      <span id="btnHideWhenPrac" onClick={(): void => onHideWhenPrac()}>
        <FaEyeSlash />
      </span>
      <div>
        {' '}
        {speakStrEng}: {speakStrVie}
        {_.isEmpty(speakStrEng) ? (
          <div></div>
        ) : (
          <FaVolumeUp
            className="iconSound"
            onClick={(): void => speakText(speakStrEng, true, sheetConfig)}
          />
        )}
      </div>
    </div>
  );
};

export default Notify;
