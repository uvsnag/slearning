'use client';
import config from '@/common/config.js';
import _ from 'lodash';
import { KEY_GOOGLE_SHEET_NM } from '@/common/common.js';

interface SheetItem {
  eng: string;
  vi: string;
  customDefine?: string;
  classItem?: string;
}

interface SheetLoadResponse {
  items: SheetItem[];
}

interface UpdateResponse {
  success: boolean;
  updates: unknown;
}

type LoadCallback = (response: SheetLoadResponse | false, error?: unknown) => void;
type UpdateCallback = (response: UpdateResponse | false, error?: unknown) => void;

export const load = (callback: LoadCallback, sheet?: string): void => {
  if (!window.gapi) {
    callback(false, new Error('Google API client not loaded'));
    return;
  }
  window.gapi.client.load('sheets', 'v4', () => {
    window.gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: localStorage.getItem(KEY_GOOGLE_SHEET_NM)
          ? localStorage.getItem(KEY_GOOGLE_SHEET_NM)
          : config.spreadsheetId,
        range: _.isEmpty(sheet) ? config.notify.sheetDefault : sheet,
      })
      .then(
        (response) => {
          const data = response.result?.values;
          const items =
            data
              ?.filter((item) => !_.isEmpty(item))
              .map((item) => ({
                eng: item[0],
                vi: item[1],
                customDefine: item[2],
              })) || [];
          callback({
            items,
          });
        },
        (response) => {
          callback(false, response.result.error);
        },
      );
  });
};

export const loadListenSheet = (callback: LoadCallback, sheet?: string): void => {
  if (!window.gapi) {
    callback(false, new Error('Google API client not loaded'));
    return;
  }
  window.gapi.client.load('sheets', 'v4', () => {
    window.gapi.client.sheets.spreadsheets.values
      .get({
        spreadsheetId: localStorage.getItem(KEY_GOOGLE_SHEET_NM)
          ? localStorage.getItem(KEY_GOOGLE_SHEET_NM)
          : config.spreadsheetId,
        range: _.isEmpty(sheet) ? config.notify.sheetDefault : sheet,
      })
      .then(
        (response) => {
          const data = response.result.values;
          console.log(data);
          const items =
            data
              .filter((item) => !_.isEmpty(item))
              .map((item) => ({
                eng: item[0],
                vi: item[1],
                classItem: item[2],
              })) || [];
          callback({
            items,
          });
        },
        (response) => {
          callback(false, response.result.error);
        },
      );
  });
};

/**
 * Update/Insert/Delete data in a specific range of the Google Sheet
 * Empty values = Delete, Non-empty values = Insert/Update
 * @param {String} range - Range to update (e.g., 'A1:C1', 'Sheet1!A1:C1')
 * @param {Array|String} values - Array of values to update, or empty string to delete
 * @param {Function} callback - Callback function (success, error)
 * @param {String} sheet - Sheet name (optional, used if range doesn't include sheet name)
 */
export const updateRange = (
  range: string,
  values: string[] | string,
  callback: UpdateCallback,
  sheet?: string,
): void => {
  if (!window.gapi) {
    callback(false, new Error('Google API client not loaded'));
    return;
  }
  window.gapi.client.load('sheets', 'v4', () => {
    const spreadsheetId = localStorage.getItem(KEY_GOOGLE_SHEET_NM)
      ? localStorage.getItem(KEY_GOOGLE_SHEET_NM)
      : config.spreadsheetId;

    // If range doesn't include sheet name, add it
    let finalRange = range;
    if (!range.includes('!')) {
      const sheetName = _.isEmpty(sheet) ? config.notify.sheetDefault : sheet;
      finalRange = `${sheetName}!${range}`;
    }

    // Prepare values - convert to array if needed
    let resourceValues = [];
    if (Array.isArray(values)) {
      resourceValues = [values];
    } else if (typeof values === 'string' && values.trim() !== '') {
      resourceValues = [[values]];
    } else {
      // Empty value - treat as delete by clearing the cell
      resourceValues = [['']];
    }

    window.gapi.client.sheets.spreadsheets.values
      .update({
        spreadsheetId,
        range: finalRange,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: resourceValues,
        },
      })
      .then(
        (response) => {
          callback({
            success: true,
            updates: response.result.updates,
          });
        },
        (error) => {
          callback(false, error.result?.error || error);
        },
      );
  });
};
