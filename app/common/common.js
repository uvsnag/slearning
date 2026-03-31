import _ from 'lodash';

export const TYPE_CORRECT = 0;
export const TYPE_WRONG = 1;
export const TYPE_HINT = 2;

export const arrStrCheckToStr = (arrStrCheck) => {
  let strRes = '';
  let lastType = null;
  for (let i = 0; i < arrStrCheck.length; i++) {
    let obj = arrStrCheck[i];
    if (_.isEqual(lastType, obj.type)) {
      strRes += obj.char;
    } else {
      if (lastType != null) {
        strRes += '</span>';
      }
      if (_.isEqual(obj.type, TYPE_CORRECT)) {
        strRes += "<span class ='ans-check-right'>";
      } else if (_.isEqual(obj.type, TYPE_WRONG)) {
        strRes += "<span class ='ans-check-wrong'>";
      } else if (_.isEqual(obj.type, TYPE_HINT)) {
        strRes += "<span class ='ans-check-hint'>";
      }
      strRes += obj.char;
    }
  }
  strRes += '</span>';
  return strRes;
};
export const validateArrStrCheck = (inputAns, answ, iNum) => {
  let flagUseINum = false;
  let arrStrCheck = [];
  let arrAns = answ.split('');
  let arrInput = inputAns.split('');
  console.log('inputAns:', inputAns);

  let i = 0;
  let j = 0;
  while (i < arrInput.length + iNum) {
    let objChar = {
      index: i,
      char: arrInput[j],
      type: '',
    };
    if (isEqualStr(arrAns[i], arrInput[j], true)) {
      objChar.type = TYPE_CORRECT;
    } else {
      if (flagUseINum === false && iNum > 0) {
        for (let k = 0; k < iNum; k++) {
          objChar.type = TYPE_WRONG;
          objChar.char = '_';
          arrStrCheck.push(objChar);
          i = i + 1;
        }
        flagUseINum = true;
        continue;
      } else {
        objChar.type = TYPE_WRONG;
      }
    }
    if (arrInput[j]) {
      arrStrCheck.push(objChar);
    }
    i++;
    j++;
  }

  if (arrAns.length > arrInput.length) {
    arrStrCheck.push({
      index: arrStrCheck.length,
      char: '_',
      type: TYPE_WRONG,
    });
  }
  return arrStrCheck;
};

export const genHintStrAns = (nameInput, answer) => {
  let inputAns = document.getElementById(nameInput).value;
  let arrStrCheck = validateArrStrCheck(inputAns, answer, 0);
  for (let i = 0; i < arrStrCheck.length; i++) {
    if (_.isEqual(arrStrCheck[i].type, TYPE_WRONG)) {
      let charCorrect = answer.substring(i, i + 1);
      arrStrCheck[i].type = TYPE_HINT;
      arrStrCheck[i].char = charCorrect;
      break;
    }
  }
  return arrStrCheck;
};
export const autoCorrectLetter = (nameInput, answer) => {
  let inputAns = document.getElementById(nameInput).value;
  let arrStrCheck = validateArrStrCheck(inputAns, answer, 0);
  for (let i = 0; i < arrStrCheck.length; i++) {
    if (_.isEqual(arrStrCheck[i].type, TYPE_WRONG)) {
      inputAns = setCharAt(inputAns, i, answer.substring(i, i + 1));
      document.getElementById(nameInput).value = inputAns;
      break;
    }
  }
  return arrStrCheck;
};

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
  ADD_EXCEL_ENG: `dịch từ này sang tiếng VIỆT, trả lời ngắn gọn theo format:
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
2. đưa ra 1 câu tiếng anh được sửa những chỗ sai ngữ pháp dựa theo câu gốc (nếu câu gốc đã đúng ngữ pháp rồi thì không cần giải thích)
3. đưa ra câu tiếng anh được sửa những chỗ sai ngữ pháp và những chỗ chưa tự nhiên dựa theo câu gốc		(nếu câu gốc đã tự nhiên rồi thì không cần giải thích)	
			`,
};
