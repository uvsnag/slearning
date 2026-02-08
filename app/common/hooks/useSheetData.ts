'use client';
import config from '@/common/config.js';
import _ from 'lodash';
import { KEY_GOOGLE_SHEET_NM, KEY_API_SHEET } from '@/common/common.js';

export interface DataItem {
  eng: string;
  vi: string;
  customDefine?: string;
}

interface SheetLoadResponse {
  items: DataItem[];
}

interface UpdateResponse {
  success: boolean;
  updates: unknown;
}

export interface SheetItem {
  range: string;
  name: string;
}

export const STORE_ALIAS = 'STORE_E';
export const SHEET_LIST: SheetItem[] = [
  { range: 'Notify!A2:C500', name: 'Board1' },
  { range: 'Notify!E2:G500', name: 'Board2' },
  { range: 'Notify!I2:K500', name: 'Board3' },
  { range: 'Notify!M2:O500', name: 'Board4' },
  { range: 'Notify!Q2:S500', name: 'Board5' },
  { range: 'Notify!U2:W500', name: 'Board6' },
  { range: 'Notify!Y2:AA500', name: 'Board7' },
  //Batch1
  { range: 'Batch1!A2:B500', name: 'B1Board1' },
  { range: 'Batch1!D2:E500', name: 'B1Board2' },
  { range: 'Batch1!G2:H500', name: 'B1Board3' },
  { range: 'Batch1!J2:K500', name: 'B1Board4' },
  { range: 'Batch1!M2:N500', name: 'B1Board5' },
  { range: 'Batch1!P2:Q500', name: 'B1Board6' },
  { range: 'Batch1!S2:T500', name: 'B1Board7' },
  { range: 'Batch1!V2:W500', name: 'B1Board8' },
  { range: 'Batch1!Y2:Z500', name: 'B1Board9' },
  { range: 'Batch1!AB2:AC500', name: 'B1Board10' },
  //Batch2
  { range: 'Batch2!A2:B500', name: 'B2Board1' },
  { range: 'Batch2!G2:H500', name: 'B2Board3' },
  { range: 'Batch2!J2:K500', name: 'B2Board4' },
  { range: 'Batch2!M2:N500', name: 'B2Board5' },
  //Store
  { range: `${STORE_ALIAS}1`, name: 'Store1' },
  { range: `${STORE_ALIAS}2`, name: 'Store2' },
  { range: `${STORE_ALIAS}3`, name: 'Store3' },
];

/**
 * Update/Insert/Delete data in a specific range of the Google Sheet
 * Empty values = Delete, Non-empty values = Insert/Update
 * @param {String} range - Range to update (e.g., 'A1:C1', 'Sheet1!A1:C1')
 * @param {Array|String} values - Array of values to update, or empty string to delete
 * @param {Function} callback - Callback function (success, error)
 * @param {String} sheet - Sheet name (optional, used if range doesn't include sheet name)
 */
const getGGInstance = async (gapi: any, sheet: string) => {
  return gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: localStorage.getItem(KEY_GOOGLE_SHEET_NM)
      ? localStorage.getItem(KEY_GOOGLE_SHEET_NM)
      : config.spreadsheetId,
    range: _.isEmpty(sheet) ? config.notify.sheetDefault : sheet,
  });
};
const handleSignOut = async () => {
  const { gapi } = await import('gapi-script');
  const auth = await gapi.auth2.getAuthInstance();
  await auth.signOut();
  await auth.signIn();
};

const getGGSheetData = async (gapi: any, callback: any, sheet: string) => {
  gapi.client.load('sheets', 'v4', async () => {
    let response = await getGGInstance(gapi, sheet);
    console.log('Response', response);
    const data = response.result?.values;
    const items =
      data
        ?.filter((item: any) => !_.isEmpty(item))
        .filter((item: any) => !_.isEmpty(item[0]))
        .map((item: any) => {
          let items: DataItem = {
            eng: item[0],
            vi: item[1],
            customDefine: item[2],
          };
          return items;
        }) || [];
    callback(items);
  });
};
const updateGGSheet = async (
  gapi: any,
  callback: any,
  sheet: string,
  cell: string,
  value: string,
) => {
  const auth = await gapi.auth2.getAuthInstance();
  if (!auth.isSignedIn.get()) {
    await auth.signIn();
  }

  gapi.client.load('sheets', 'v4', () => {
    const spreadsheetId = localStorage.getItem(KEY_GOOGLE_SHEET_NM)
      ? localStorage.getItem(KEY_GOOGLE_SHEET_NM)
      : config.spreadsheetId;

    let finalRange = `${sheet}!${cell}`;

    let resourceValues = [[value]];

    gapi.client.sheets.spreadsheets.values
      .update({
        spreadsheetId,
        range: finalRange,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: resourceValues,
        },
      })
      .then((response: any) => {
        if (callback) {
          callback({
            success: true,
            updates: response.result.updates,
          });
        }
      });
  });
};

const ggSheetProcess = async (
  callback: any,
  sheet: string,
  method: 'get' | 'update' | 'delete',
  cell?: string,
  value?: string,
): Promise<void> => {
  const { gapi } = await import('gapi-script');
  gapi.load('client:auth2', async () => {
    const apiKey = localStorage.getItem(KEY_API_SHEET);
    await gapi.client.init({
      apiKey: apiKey,
      clientId: config.clientId,
      discoveryDocs: config.discoveryDocs,
      scope: config.scope,
    });
    if (method === 'get') {
      await gapi.client.load('sheets', 'v4', async () => {
        getGGSheetData(gapi, callback, sheet);
      });
    }
    if (method === 'update') {
      updateGGSheet(gapi, callback, sheet, cell || 'A1', value || '');
    }
  });
};

export const getDataFromExcel = async (sheet: string, onLoad: any) => {
  if (sheet?.startsWith(STORE_ALIAS)) {
    const storeDataString = localStorage.getItem(sheet);
    const storeData: DataItem[] = storeDataString ? JSON.parse(storeDataString) : [];
    if (!_.isEmpty(storeData)) {
      onLoad(storeData);
    }
  } else {
    await ggSheetProcess(onLoad, sheet, 'get');
  }
};

export async function onRemoveStoreItem(
  currEng: string,
  callback: () => void,
  sheet: string,
): Promise<void> {
  if (sheet?.startsWith(STORE_ALIAS)) {
    const storeDataString = localStorage.getItem(sheet);
    let storeData: DataItem[] = storeDataString ? JSON.parse(storeDataString) : [];
    storeData = storeData.filter((itm: DataItem): boolean => itm.eng != currEng);
    localStorage.setItem(sheet, JSON.stringify([...storeData]));
  } else {
    await ggSheetUpdateTwoValues({
      callback: (response: any) => {
        if (response?.success) {
          console.log('Data saved successfully!');
          // setValue1('');
          // setValue2('');
        } else {
          console.log('Failed to save data');
          // setMessage(` Error: ${response?.error || 'Failed to save data'}`);
        }
        // setIsLoading(false);
      },
      range: sheet,
      value1: '',
      value2: '',
      updateWhenEquals: currEng,
    });
  }
  callback();
}

interface GGSheetUpdateTwoValuesParams {
  callback: any;
  range: string;
  value1: string;
  value2: string;
  updateWhenEquals?: string | null;
}

/**
 * Save two values into two adjacent cells in a Google Sheet
 * @param {Object} params - Parameters object
 * @param {Function} params.callback - Callback function (optional)
 * @param {String} params.range - Full range string from SHEET_AUTO (e.g., 'AUTO!A2:C500')
 * @param {String} params.value1 - First value to save
 * @param {String} params.value2 - Second value to save
 */
export const ggSheetUpdateTwoValues = async ({
  callback,
  range,
  value1,
  value2,
  updateWhenEquals = null,
}: GGSheetUpdateTwoValuesParams): Promise<void> => {
  console.log('Update GG Sheet:', { range, value1, value2, updateWhenEquals });
  if (!range.startsWith('AUTO')) {
    updateWhenEquals = null;
  }
  const { gapi } = await import('gapi-script');
  gapi.load('client:auth2', async () => {
    const apiKey = localStorage.getItem(KEY_API_SHEET);
    await gapi.client.init({
      apiKey: apiKey,
      clientId: config.clientId,
      discoveryDocs: config.discoveryDocs,
      scope: config.scope,
    });
    const auth = await gapi.auth2.getAuthInstance();
    if (!auth.isSignedIn.get()) {
      await auth.signIn();
    }

    gapi.client.load('sheets', 'v4', async () => {
      const spreadsheetId = localStorage.getItem(KEY_GOOGLE_SHEET_NM)
        ? localStorage.getItem(KEY_GOOGLE_SHEET_NM)
        : config.spreadsheetId;

      // Parse range: 'AUTO!A2:C500' -> sheet='AUTO', startCell='A2'
      const rangeParts = range.split('!');
      const sheet = rangeParts[0];
      const startCell = rangeParts[1]?.split(':')[0] || 'A2';

      // Extract column and row from startCell (e.g., 'A2' -> col='A', row='2')
      const cellMatch = startCell.match(/([A-Z]+)(\d+)/);
      if (!cellMatch) {
        if (callback) {
          callback({
            success: false,
            error: 'Invalid cell format',
          });
        }
        return;
      }

      const col = cellMatch[1];
      const startRow = parseInt(cellMatch[2], 10);

      // Get next column (A -> B, Z -> AA, AA -> AB, etc.)
      const getNextColumn = (colStr: string): string => {
        let result = '';
        let carry = 1;
        for (let i = colStr.length - 1; i >= 0; i--) {
          let charCode = colStr.charCodeAt(i) + carry;
          if (charCode > 90) {
            // 'Z'
            charCode = 65; // 'A'
            carry = 1;
          } else {
            carry = 0;
          }
          result = String.fromCharCode(charCode) + result;
        }
        if (carry) {
          result = 'A' + result;
        }
        return result;
      };

      const nextCol = getNextColumn(col);

      try {
        // Read the current data from the range to find the first empty row
        const readResponse = await gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId,
          range: range,
        });

        const existingData = readResponse.result?.values || [];
        let targetRow = startRow;

        // Find the first empty row (check if first cell is empty)
        for (let i = 0; i < existingData.length; i++) {
          const row = existingData[i];
          // Check if first cell is empty or undefined
          if (updateWhenEquals) {
            if (row && row.length > 0 && row[0] === updateWhenEquals) {
              targetRow = startRow + i;
              break;
            }
          } else {
            if (!row || row.length === 0 || _.isEmpty(row[0])) {
              targetRow = startRow + i;
              break;
            }
          }
          // If we've checked all existing rows, use the next row
          if (i === existingData.length - 1) {
            targetRow = startRow + existingData.length;
          }
        }

        // If no data exists, use the start row
        if (existingData.length === 0) {
          targetRow = startRow;
        }

        // Create range for two cells at the target row: 'A2:B2'
        const twoCellRange = `${sheet}!${col}${targetRow}:${nextCol}${targetRow}`;

        let resourceValues = [[value1, value2]];

        gapi.client.sheets.spreadsheets.values
          .update({
            spreadsheetId,
            range: twoCellRange,
            valueInputOption: 'USER_ENTERED',
            resource: {
              values: resourceValues,
            },
          })
          .then((response: any) => {
            if (callback) {
              callback({
                success: true,
                updates: response.result.updates,
              });
            }
          })
          .catch((error: any) => {
            if (callback) {
              callback({
                success: false,
                error: error.message,
              });
            }
          });
      } catch (error: any) {
        if (callback) {
          callback({
            success: false,
            error: error.message || 'Failed to read sheet data',
          });
        }
      }
    });
  });
};
