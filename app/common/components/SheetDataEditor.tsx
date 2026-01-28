'use client';
import { useState, ChangeEvent, useEffect } from 'react';
import { ggSheetUpdateTwoValues, SheetItem } from '@/app/common/hooks/useSheetData';
import '@/slearning/multi-ai/style-ai.css';
import { set } from 'lodash';
import SignOutButton from './SignOutButton';

export interface SheetDataEditorProps {
  propSheet?: string;
  value1?: string;
  value2?: string;
  isUse?: boolean;
}

export const SHEET_AUTO: SheetItem[] = [
  { range: 'AUTO!A2:C500', name: 'ABoard1' },
  { range: 'AUTO!E2:G500', name: 'ABoard2' },
  { range: 'AUTO!I2:K500', name: 'ABoard3' },
  { range: 'AUTO!M2:O500', name: 'ABoard4' },
  { range: 'AUTO!Q2:S500', name: 'ABoard5' },
  { range: 'AUTO!U2:W500', name: 'ABoard6' },
  { range: 'AUTO!Y2:AA500', name: 'ABoard7' },
];

const SheetDataEditor: React.FC<SheetDataEditorProps> = (props: SheetDataEditorProps) => {
  const [selectedRange, setSelectedRange] = useState<string>(
    props.propSheet || SHEET_AUTO[0]?.range || '',
  );
  const [value1, setValue1] = useState<string>(props.value1 || '');
  const [value2, setValue2] = useState<string>(props.value2 || '');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [usePropsValues, setUsePropsValues] = useState<boolean>(props.isUse || false);

  useEffect(() => {
    if (usePropsValues) {
      setValue1(props.value1 || '');
      setValue2(props.value2 || '');
    } else {
      setValue1('');
      setValue2('');
    }
  }, [props.value1, props.value2, usePropsValues]);

  const handleSave = async (): Promise<void> => {
    if (!selectedRange.trim()) {
      setMessage(' Please select a sheet range');
      return;
    }

    setIsLoading(true);
    setMessage('Saving...');

    try {
      await ggSheetUpdateTwoValues({
        callback: (response: any) => {
          if (response?.success) {
            setMessage('Data saved successfully!');
            setValue1('');
            setValue2('');
          } else {
            setMessage(` Error: ${response?.error || 'Failed to save data'}`);
          }
          setIsLoading(false);
        },
        range: selectedRange,
        value1,
        value2,
      });
    } catch (error: any) {
      setMessage(` Error: ${error?.message || 'Failed to save data'}`);
      setIsLoading(false);
    }

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={value1}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setValue1(e.target.value)}
          placeholder="Value 1"
          className="common-input"
          style={{
            width: '140px',
          }}
        />
        <input
          type="text"
          value={value2}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setValue2(e.target.value)}
          placeholder="Value 2"
          className="common-input"
          style={{
            width: '230px',
          }}
        />
        <button onClick={handleSave} disabled={isLoading} className="common-btn">
          {isLoading ? 'Saving...' : ' Save'}
        </button>
        <br />
        <select
          value={selectedRange}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedRange(e.target.value)}
          // disabled={isLoading}
          className="common-input"
        >
          {SHEET_AUTO.map((item) => (
            <option key={item.range} value={item.range}>
              {item.name}
            </option>
          ))}
        </select>

        {/* <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}> */}
        <input
          type="checkbox"
          checked={usePropsValues}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setUsePropsValues(e.target.checked);
            // if (e.target.checked) {
            //   setValue1(props.value1 || '');
            //   setValue2(props.value2 || '');
            // }
          }}
        />
        <SignOutButton />
        {/* <span>Use props</span> */}
        {/* </label> */}
      </div>

      {message && (
        <div
        // style={{
        //   padding: '10px',
        //   marginTop: '10px',
        //   backgroundColor: message.startsWith('') ? '#d4edda' : '#f8d7da',
        //   color: message.startsWith('') ? '#155724' : '#721c24',
        //   borderRadius: '4px',
        //   border: `1px solid ${message.startsWith('') ? '#c3e6cb' : '#f5c6cb'}`,
        // }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default SheetDataEditor;
