'use client';
import config from '@/common/config.js';
import _ from 'lodash';
import { KEY_GOOGLE_SHEET_NM, KEY_API_SHEET, KEY_SHOW_LOADING } from '@/common/common.js';

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

/** localStorage key holding the user-customizable list of stores */
export const KEY_CUSTOM_STORES = 'custom-stores';

/** Default stores used when the user has never customized the store list */
export const DEFAULT_STORES: SheetItem[] = [
  { range: `${STORE_ALIAS}1`, name: 'Store1' },
  { range: `${STORE_ALIAS}2`, name: 'Store2' },
  { range: `${STORE_ALIAS}3`, name: 'Store3' },
];

/**
 * Read the current list of stores (range + custom display name) from localStorage.
 * Falls back to {@link DEFAULT_STORES} when nothing has been saved yet.
 */
export const getStoreList = (): SheetItem[] => {
  if (typeof window === 'undefined') return [...DEFAULT_STORES];
  const raw = localStorage.getItem(KEY_CUSTOM_STORES);
  if (raw === null) return [...DEFAULT_STORES];
  try {
    const parsed = JSON.parse(raw) as SheetItem[];
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => item && typeof item.range === 'string');
    }
  } catch {
    // ignore malformed data and fall back to defaults
  }
  return [...DEFAULT_STORES];
};

/** Persist the full list of stores to localStorage. */
export const saveStoreList = (list: SheetItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY_CUSTOM_STORES, JSON.stringify(list));
};

/**
 * Add a new store with the given display name. A unique range
 * (e.g. `STORE_E4`) is generated automatically. Returns the updated list.
 */
export const addStore = (name?: string): SheetItem[] => {
  const list = getStoreList();
  const maxNum = list.reduce((max, store) => {
    const match = store.range.match(new RegExp(`^${STORE_ALIAS}(\\d+)$`));
    const num = match ? parseInt(match[1], 10) : 0;
    return num > max ? num : max;
  }, 0);
  const nextNum = maxNum + 1;
  const displayName = name && name.trim() ? name.trim() : `Store${nextNum}`;
  const next = [...list, { range: `${STORE_ALIAS}${nextNum}`, name: displayName }];
  saveStoreList(next);
  return next;
};

/**
 * Remove the store with the given range and delete its stored data.
 * Returns the updated list.
 */
export const removeStore = (range: string): SheetItem[] => {
  const next = getStoreList().filter((store) => store.range !== range);
  saveStoreList(next);
  if (typeof window !== 'undefined') {
    localStorage.removeItem(range);
  }
  return next;
};

/** Rename the display name of the store with the given range. Returns the updated list. */
export const renameStore = (range: string, name: string): SheetItem[] => {
  const next = getStoreList().map((store) =>
    store.range === range ? { ...store, name } : store,
  );
  saveStoreList(next);
  return next;
};

/**
 * Read the list of {@link DataItem}s held by a custom store.
 * Returns an empty array when the store has no data or holds malformed data.
 */
export const getStoreItems = (range: string): DataItem[] => {
  if (typeof window === 'undefined' || !range) return [];
  const raw = localStorage.getItem(range);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as DataItem[]) : [];
  } catch {
    return [];
  }
};

/** Persist the full list of {@link DataItem}s for a custom store. */
export const saveStoreItems = (range: string, items: DataItem[]): void => {
  if (typeof window === 'undefined' || !range) return;
  localStorage.setItem(range, JSON.stringify(items));
};

export const SHEET_LIST: SheetItem[] = [
  //Notify
  { range: 'Notify!A2:C250', name: 'Notify:1A' },
  { range: 'Notify!A250:C500', name: 'Notify:1B' },
  { range: 'Notify!E2:G250', name: 'Notify:2A' },
  { range: 'Notify!E250:G500', name: 'Notify:2B' },
  { range: 'Notify!I2:K250', name: 'Notify:3A' },
  { range: 'Notify!I250:K500', name: 'Notify:3B' },
  { range: 'Notify!M2:O250', name: 'Notify:4A' },
  { range: 'Notify!M250:O500', name: 'Notify:4B' },
  { range: 'Notify!Q2:S250', name: 'Notify:5A' },
  { range: 'Notify!Q250:S500', name: 'Notify:5B' },
  { range: 'Notify!U2:W250', name: 'Notify:6A' },
  { range: 'Notify!U250:W500', name: 'Notify:6B' },
  { range: 'Notify!Y2:AA250', name: 'Notify:7A' },
  { range: 'Notify!Y250:AA500', name: 'Notify:7B' },
  //Batch1
  { range: 'Batch1!A2:B250', name: 'Batch1:1A' },
  { range: 'Batch1!A250:B500', name: 'Batch1:1B' },
  { range: 'Batch1!D2:E250', name: 'Batch1:2A' },
  { range: 'Batch1!D250:E500', name: 'Batch1:2B' },
  { range: 'Batch1!G2:H250', name: 'Batch1:3A' },
  { range: 'Batch1!G250:H500', name: 'Batch1:3B' },
  { range: 'Batch1!J2:K250', name: 'Batch1:4A' },
  { range: 'Batch1!J250:K500', name: 'Batch1:4B' },
  { range: 'Batch1!M2:N250', name: 'Batch1:5A' },
  { range: 'Batch1!M250:N500', name: 'Batch1:5B' },
  { range: 'Batch1!P2:Q500', name: 'Batch1:6A' },
  { range: 'Batch1!P250:Q500', name: 'Batch1:6B' },
  { range: 'Batch1!S2:T250', name: 'Batch1:7A' },
  { range: 'Batch1!S250:T500', name: 'Batch1:7B' },
  { range: 'Batch1!V2:W250', name: 'Batch1:8A' },
  { range: 'Batch1!V250:W500', name: 'Batch1:8B' },
  { range: 'Batch1!Y2:Z250', name: 'Batch1:9A' },
  { range: 'Batch1!Y250:Z500', name: 'Batch1:9B' },
  { range: 'Batch1!AB2:AC250', name: 'Batch1:10A' },
  { range: 'Batch1!AB250:AC500', name: 'Batch1:10B' },
  //Batch2
  { range: 'Batch2!A2:B250', name: 'Batch2:MistakeA' },
  { range: 'Batch2!A250:B500', name: 'Batch2:MistakeB' },
  { range: 'Batch2!E2:F250', name: 'Batch2:EnhanceA' },
  { range: 'Batch2!E250:F500', name: 'Batch2:EnhanceB' },
  { range: 'Batch2!I2:J250', name: 'Batch2:GrammarA' },
  { range: 'Batch2!I250:J500', name: 'Batch2:GrammarB' },

  { range: 'Batch2!N2:O250', name: 'Batch2:Sentence1A' },
  { range: 'Batch2!N250:O500', name: 'Batch2:Sentence1B' },
  { range: 'Batch2!Q2:R250', name: 'Batch2:Sentence2A' },
  { range: 'Batch2!Q250:R500', name: 'Batch2:Sentence2B' },
  { range: 'Batch2!T2:U250', name: 'Batch2:Sentence3A' },
  { range: 'Batch2!T250:U500', name: 'Batch2:Sentence3B' },
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
  // Return a Promise that resolves when the underlying operation calls the provided callback
  return new Promise<void>(async (resolve, reject) => {
    try {
      const { gapi } = await import('gapi-script');
      gapi.load('client:auth2', async () => {
        try {
          const apiKey = localStorage.getItem(KEY_API_SHEET);
          await gapi.client.init({
            apiKey: apiKey,
            clientId: config.clientId,
            discoveryDocs: config.discoveryDocs,
            scope: config.scope,
          });

          if (method === 'get') {
            await gapi.client.load('sheets', 'v4', async () => {
              // Wrap the callback so we can resolve when it's invoked
              getGGSheetData(
                gapi,
                (items: any) => {
                  try {
                    callback(items);
                    resolve();
                  } catch (e) {
                    reject(e);
                  }
                },
                sheet,
              );
            });
            return;
          }

          if (method === 'update') {
            updateGGSheet(
              gapi,
              (resp: any) => {
                try {
                  callback(resp);
                  resolve();
                } catch (e) {
                  reject(e);
                }
              },
              sheet,
              cell || 'A1',
              value || '',
            );
            return;
          }

          // If method not handled explicitly, resolve
          resolve();
        } catch (innerErr) {
          reject(innerErr);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};

// --- Loading overlay helpers (DOM) ---
let __sheetLoadingCounter = 0;
const LOADER_ID = 'sheet-data-loading-overlay';
const LOADER_STYLE_ID = 'sheet-data-loading-style';

const ensureLoader = () => {
  if (typeof document === 'undefined') return;
  if (localStorage.getItem(KEY_SHOW_LOADING) === 'N') return;
  if (document.getElementById(LOADER_ID)) return;

  if (!document.getElementById(LOADER_STYLE_ID)) {
    const style = document.createElement('style');
    style.id = LOADER_STYLE_ID;
    style.textContent = `
      #${LOADER_ID} { position:fixed; inset:0; display:none; align-items:center; justify-content:center; background:rgba(0,0,0,0.35); z-index:9999; pointer-events:none; }
      #${LOADER_ID} .sloader { width:56px; height:56px; border:6px solid rgba(255,255,255,0.6); border-top-color:var(--color-white); border-radius:50%; animation:__sheet_spin 1s linear infinite; }
      @keyframes __sheet_spin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
  }

  const overlay = document.createElement('div');
  overlay.id = LOADER_ID;
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `<div class="sloader"></div>`;
  document.body.appendChild(overlay);
};

export const showSheetLoading = () => {
  if (typeof document === 'undefined') return;
  ensureLoader();
  __sheetLoadingCounter += 1;
  const el = document.getElementById(LOADER_ID) as HTMLElement | null;
  if (el && __sheetLoadingCounter === 1) el.style.display = 'flex';
};

export const hideSheetLoading = () => {
  if (typeof document === 'undefined') return;
  __sheetLoadingCounter = Math.max(0, __sheetLoadingCounter - 1);
  const el = document.getElementById(LOADER_ID) as HTMLElement | null;
  if (el && __sheetLoadingCounter === 0) el.style.display = 'none';
};

export const getDataFromExcel = async (sheet: string, onLoad: any) => {
  showSheetLoading();
  try {
    if (sheet?.startsWith(STORE_ALIAS)) {
      const storeDataString = localStorage.getItem(sheet);
      const storeData: DataItem[] = storeDataString ? JSON.parse(storeDataString) : [];
      onLoad(storeData);
    } else {
      await ggSheetProcess(onLoad, sheet, 'get');
    }
  } finally {
    hideSheetLoading();
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
