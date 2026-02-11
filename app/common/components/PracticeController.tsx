'use client';
import { useEffect, useState, CSSProperties, ChangeEvent, ReactElement } from 'react';
// import './style-noti.css';
import _ from 'lodash';
import {
  DataItem,
  STORE_ALIAS,
  SHEET_LIST,
  getDataFromExcel,
  onRemoveStoreItem,
} from '@/app/common/hooks/useSheetData';
import { useSpeechSynthesis } from '@/app/common/hooks/useSpeechSynthesis';
import { FaRedo, FaCog } from 'react-icons/fa';
import { useCookies } from 'react-cookie';
import { toggleCollapse } from '../common';
import { SHEET_AUTO } from './SheetDataEditor';
import PracticeVoiceConfig from './PracticeVoiceConfig';

export interface ConfigControlProps {
  propSheet: string;
  oderRandomS: string;
  voice: number;
  rate: number;
  volume: number;
  index: string;
  items: DataItem[];
  isOpen?: boolean;
}

interface PracticeControllerProps {
  config: ConfigControlProps;
  onChange: (value: ConfigControlProps) => void;
}

const PracticeController = (props: PracticeControllerProps): ReactElement => {
  const { speak, voices } = useSpeechSynthesis();
  const [items, setItems] = useState<DataItem[]>([]);
  const [oderRandomS, setOderRandomS] = useState<string>(props.config.oderRandomS);

  const [voiceIndex, setVoiceIndex] = useState<number>(0);
  const [voiceIndexVie, setVoiceIndexVie] = useState<number>(0);
  const [rate, setRate] = useState<number>(props.config.rate);
  const [volumn, setVolumn] = useState<number>(props.config.volume);
  const [sheet, setSheet] = useState<string>(props.config.propSheet);
  // const [cookies, setCookie] = useCookies(['cookieContinue']);

  const [isStop, setIsStop] = useState<boolean>(true);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | number>(-1);
  const [countNotify, setCountNotify] = useState<number>(0);

  /**  */
  useEffect((): void => {
    if (!_.isEmpty(sheet)) {
      getDataFromExcel(sheet, setItems);
    }
    props.onChange({ ...props.config, propSheet: sheet });
  }, [sheet]);
  useEffect((): void => {
    if (props.config.isOpen) {
      // toggleCollapse(`config-pract-${props.config.index}`);
    }
  }, [props.config]);

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

  useEffect((): void | (() => void) => {
    props.onChange({ ...props.config, items: items });

    const txtFieldElement = document.getElementById('item-str') as HTMLTextAreaElement;
    if (txtFieldElement) txtFieldElement.value = JSON.stringify(items);
  }, [items]);

  const onChangeOrder = (value: string): void => {
    setOderRandomS(value);
    props.onChange({ ...props.config, oderRandomS: value });
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

  return (
    <div className="">
      {/* <div onClick={() => toggleCollapse(`config-pract-${props.config.index}`)}>
        <FaCog />
      </div> */}
      <div className="bolder" id={`config-pract-${props.config.index}`}>
        {/* <div>
        <div className="option-noti bolder" id="control"> */}
        <select
          className="button-33 inline"
          value={sheet}
          name="sheet"
          id="slsheet"
          onChange={(e: ChangeEvent<HTMLSelectElement>): void => {
            if (e.target.value && e.target.value != sheet) {
              // props.onChange({ ...props.config, sheet: e.target.value });
              setSheet(e.target.value);
              // getDataFromExcel(e.target.value, setItems);
            }
          }}
        >
          {[...SHEET_AUTO, ...SHEET_LIST].map((option, index) => (
            <option key={option.range} value={option.range}>
              {`${option.name}`}
            </option>
          ))}
        </select>
        <button className="common-btn inline" onClick={() => getDataFromExcel(sheet, setItems)}>
          <FaRedo />
        </button>
        <span>{items.length}</span>
        <div onClick={() => toggleCollapse(`config-pract2-${props.config.index}`)}>
          <FaCog />
        </div>
        <div className="collapse-content bolder" id={`config-pract2-${props.config.index}`}>
          {/* <div className="inline"> */}
          <select id="store-index" name="store-index" className="common-btn inline">
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
          {/* </div> */}
          <select
            className="button-33 inline"
            name="genData"
            id="slGenData"
            onChange={(e: ChangeEvent<HTMLSelectElement>): void => {
              onChangeOrder(e.target.value);
            }}
          >
            <option value="random">random</option>
            <option value="order">order</option>
          </select>

          {/* <div id="sound-control"> */}
          {/* <div>Voice:</div> */}
          <PracticeVoiceConfig
            voices={voices}
            voiceIndex={voiceIndex}
            rate={rate}
            volumn={volumn}
            onVoiceChange={(value: number): void => {
              setVoiceIndex(value);
              props.onChange({ ...props.config, voice: value });
            }}
            onRateChange={(value: number): void => {
              setRate(value);
              props.onChange({ ...props.config, rate: value });
            }}
            onVolumnChange={(value: number): void => {
              setVolumn(value);
              props.onChange({ ...props.config, volume: value });
            }}
          />

          {/* <div>Voice 2:</div>
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
              </select> */}
          {/* </div> */}
          {/* </div>
        <div className="control-footer"></div>
      </div> */}
          <textarea id="item-str"></textarea>
        </div>
      </div>
    </div>
  );
};

export default PracticeController;
