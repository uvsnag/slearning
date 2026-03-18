import _ from 'lodash';

export const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};
export const getPosition = (string, subString, index) => {
  return string.split(subString, index).join(subString).length;
};
export const formatDate = (date) => {
  var formatDate = document.getElementById('formatDate').value;
  const d = new Date(date);
  const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
  const mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
  const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
  switch (formatDate) {
    case 'yyyy-mm-dd':
      return `${ye}-${mo}-${da}`;
    case 'yyyy/mm/dd':
      return `${ye}/${mo}/${da}`;
    case 'yyyymmdd':
      return `${ye}${mo}${da}`;
    case 'dd-mm-yyyy':
      return `${da}-${mo}-${ye}`;
    case 'dd/mm/yyyy':
      return `${da}/${mo}/${ye}`;
    case 'ddmmyyyy':
      return `${da}${mo}${ye}`;
    default:
      break;
  }
  return `${ye}${formatDate}${mo}${formatDate}${da}`;
};
export const checkType = (line, arrayType) => {
  var result = false;
  arrayType.forEach((type) => {
    if (line.includes(type)) {
      result = true;
    }
  });
  return result;
};
export const replaceArr = (line, arrayType, valRpl) => {
  for (let i = 0; i < arrayType.length; i++) {
    var type = arrayType[i];
    line = line.replaceAll(`${type}`, valRpl);
  }

  return line;
};
export const checkIncludesArr = (line, arrayStr, sensitive) => {
  if (!sensitive) {
    line = line.toUpperCase();
  }
  for (let i = 0; i < arrayStr.length; i++) {
    var str = arrayStr[i];
    if (line.includes(str)) {
      return true;
    }
  }

  return false;
};

export const randomList = (arr) => {
  if (!_.isEmpty(arr)) {
    var item = arr[Math.floor(Math.random() * arr.length)];
    return item;
  }

  return '';
};

export const isEqualStr = (str1, str2, isCaseInte) => {
  if (str1 == null || str2 == null) {
    return false;
  }
  let arr = [
    ' ',
    '   ',
    ',',
    '.',
    '!',
    '?',
    '’',
    "'",
    '<',
    '>',
    '—',
    ':',
    '[',
    ']',
    '(',
    ')',
    '*',
    '-',
    '+',
    '=',
    '@',
    '#',
    '%',
    '^',
    '&',
    '!',
  ];
  replaceArr(str1, arr, '');
  replaceArr(str2, arr, '');
  if (isCaseInte === true) {
    str1 = str1.trim().toUpperCase();
    str2 = str2.trim().toUpperCase();
  }
  return _.isEqual(str1, str2);
};
export function isVisible(id) {
  const el = document.getElementById(id);
  if (!el) return false;

  const style = window.getComputedStyle(el);
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
}

export const setCharAt = (str, index, chr) => {
  if (index > str.length - 1) return str;
  return str.substring(0, index) + chr + str.substring(index + 1);
};

export function toggleCollapse(id) {
  const content = document.getElementById(id);
  content.classList.toggle('open'); // Add or remove the 'open' class
}
export function collapseElement(id) {
  const content = document.getElementById(id);
  content.classList.remove('open'); // Add or remove the 'open' class
}
export const copyContent = (nm) => {
  let val = document.getElementById(nm).value;
  navigator.clipboard.writeText(val);
};

export const KEY_GEMINI_NM = 'gemi-key';
export const KEY_GEMINI_NM_2 = 'gemi-key-2';
export const KEY_GPT_NM = 'gpt-key';
export const KEY_GITHUB_NM = 'github-key';
export const KEY_GITHUB_NM_2 = 'github-key-2';
export const KEY_OPENROUTER_NM = 'openrouter-key';
export const KEY_GOOGLE_SHEET_NM = 'google-sheet-key';
export const KEY_API_SHEET = 'api-sheet-key';
export const KEY_YT_CONTROLS = 'yt-controls';
export const KEY_DARK_MODE = 'dark-mode';
export const KEY_SHOW_LOADING = 'show-loading';

export const COMMON_PROMPT = {
  TRANSLATE_EN_VI: 'dịch sang tiếng việt',
  TRANSLATE_VI_EN:
    'translate the following text from Vietnamese to English, shortly, give me 3 ways to translate',
  ADD_EXCEL_ENG: `dịch từ này sang tiếng anh, trả lời ngắn gọn theo format:
"viết lại từ tiếng anh (sửa chính tả)
nghĩa tiếng việt ngắn gọn"

Ví dụ 1 (từ có 1 nghĩa):
tôi chat: dog
trả lời: 
Dog
con chó (n)


Ví dụ 2 (từ có nhiều nghĩa, liệt kê hết nghĩa):
tôi chat: book
trả lời: 
Book
cuốn sách (n), đặt phòng (v)


Ví dụ 3:
tôi chat: it wasnt mean to be	
trả lời: 
It wasn't meant to be	
Không phải định mệnh, Không có duyên.`,
  CHECK_GRAMMAR: `Tôi sẽ viết bằng tiếng Anh. Hãy giúp tôi sửa ngữ pháp trong câu bằng cách trả lời ngắn gọn những yêu cầu sau: 
1. hãy phân loại rõ ràng trong câu chỗ nào là sai, chỗ nào là đúng nhưng chưa tự nhiên bằng tiếng việt 
2. đưa ra 1 câu tiếng anh được sửa những chỗ sai ngữ pháp dựa theo câu gốc 
3. đưa ra câu tiếng anh được sửa những chỗ sai ngữ pháp và những chỗ chưa tự nhiên dựa theo câu gốc			
			`,
};
