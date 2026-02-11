'use client';
import { useEffect, useState, ReactElement } from 'react';
// import './style-noti.css';
import _ from 'lodash';
import { DataItem, getDataFromExcel } from '@/app/common/hooks/useSheetData';
import { useSpeechSynthesis } from '@/app/common/hooks/useSpeechSynthesis';
import PracticeVoiceConfig from './PracticeVoiceConfig';
import PracticeSheetConfig from './PracticeSheetConfig';

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
        <PracticeSheetConfig
          sheet={sheet}
          itemsLength={items.length}
          configIndex={props.config.index}
          onSheetChange={(value: string): void => {
            setSheet(value);
          }}
          onReload={(): void => {
            getDataFromExcel(sheet, setItems);
          }}
          onAddStore={addStore}
          onClearStore={clearStore}
          onChangeOrder={onChangeOrder}
        >

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
        </PracticeSheetConfig>
      </div>
    </div>
  );
};

export default PracticeController;
