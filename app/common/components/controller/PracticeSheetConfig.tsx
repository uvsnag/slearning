'use client';
import { ChangeEvent, ReactElement, ReactNode } from 'react';
import { FaCog, FaRedo } from 'react-icons/fa';
import { STORE_ALIAS, SHEET_LIST } from '@/app/common/hooks/useSheetData';
import { toggleCollapse } from '../../common';
import { SHEET_AUTO } from '../SheetDataEditor';

interface PracticeSheetConfigProps {
  sheet: string;
  itemsLength: number;
  configIndex: string;
  onSheetChange: (value: string) => void;
  onReload: () => void;
  onAddStore: () => void;
  onClearStore: () => void;
  onChangeOrder: (value: string) => void;
  children?: ReactNode;
}

const PracticeSheetConfig = ({
  sheet,
  itemsLength,
  configIndex,
  onSheetChange,
  onReload,
  onAddStore,
  onClearStore,
  onChangeOrder,
  children,
}: PracticeSheetConfigProps): ReactElement => {
  return (
    <>
      <select
        className="common-input inline"
        value={sheet}
        name="sheet"
        id="slsheet"
        onChange={(e: ChangeEvent<HTMLSelectElement>): void => {
          if (e.target.value && e.target.value != sheet) {
            onSheetChange(e.target.value);
          }
        }}
      >
        {[...SHEET_AUTO, ...SHEET_LIST].map((option) => (
          <option key={option.range} value={option.range}>
            {`${option.name}`}
          </option>
        ))}
      </select>
      <button className="common-btn" onClick={onReload}>
        <FaRedo />
      </button>
      <span>{itemsLength}</span>
      <div className="common-toggle" onClick={() => toggleCollapse(`config-pract2-${configIndex}`)}>
        <FaCog />
      </div>
      <div className="collapse-content bolder" id={`config-pract2-${configIndex}`}>
        <select id="store-index" name="store-index" className="common-btn">
          <option value={`${STORE_ALIAS}1`}>Store1</option>
          <option value={`${STORE_ALIAS}2`}>Store2</option>
          <option value={`${STORE_ALIAS}3`}>Store3</option>
        </select>
        <button className="common-btn" onClick={onAddStore}>
          Add
        </button>
        <button className="common-btn" onClick={onClearStore}>
          Clear
        </button>
        <select
          className="common-input inline"
          name="genData"
          id="slGenData"
          onChange={(e: ChangeEvent<HTMLSelectElement>): void => {
            onChangeOrder(e.target.value);
          }}
        >
          <option value="random">random</option>
          <option value="order">order</option>
        </select>
        {children}
      </div>
    </>
  );
};

export default PracticeSheetConfig;
