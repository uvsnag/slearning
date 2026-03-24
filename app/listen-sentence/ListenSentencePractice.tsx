'use client';
import { useEffect, useState, useRef } from 'react';
import type { KeyboardEvent, ChangeEvent } from 'react';
import { FaEyeSlash } from 'react-icons/fa';
import { useSpeechSynthesis } from '@/app/common/hooks/useSpeechSynthesis';
import { replaceArr, isEqualStr, getPosition } from '@/common/common.js';
import {
  validateArrStrCheck,
  arrStrCheckToStr,
  autoCorrectLetter,
  genHintStrAns,
  TYPE_WRONG,
  TYPE_CORRECT,
} from '@/common/common.js';
import _ from 'lodash';
import { usePracticeContext, toSpeechConfig } from '@/app/common/hooks/usePracticeStore';

let arrSentence: string[] = [];
let indexST: number = -1;
let sentence: string = '';

const ListenSentencePractice: React.FC = () => {
  const { state: practiceState } = usePracticeContext();
  const { speak, voices } = useSpeechSynthesis();
  const [answer, setAnswer] = useState<string>('');
  const [lastAnsw, setLastAnsw] = useState<string>('');
  const inputAns = useRef<HTMLInputElement>(null);

  useEffect((): void => {
    const numbWordEl = document.getElementById('numbWord') as HTMLInputElement | null;
    const numWordBreakEl = document.getElementById('numWordBreak') as HTMLInputElement | null;
    if (numbWordEl) numbWordEl.value = '2';
    if (numWordBreakEl) numWordBreakEl.value = '7';
  }, []);

  const onHideInput = (idName: string): void => {
    var prac = document.getElementById(`${idName}`);
    if (prac && (prac.style.display === 'block' || prac.style.display === '')) {
      prac.style.display = 'none';
    } else if (prac) {
      prac.style.display = 'block';
    }
  };

  const onStart = (): void => {
    const inputEl = document.getElementById('inputTxt') as HTMLTextAreaElement | null;
    let input = inputEl ? inputEl.value : '';
    let arrReg = [',', '?', '(', ')', '!', '\u2014', '-', '=', '"', '"', '\n', ';'];
    input = replaceArr(input, arrReg, '.');
    arrSentence = input.split('.');
    indexST = -1;
    setAnswer('');
    changeSentence();
    if (inputEl) inputEl.style.display = 'none';
    inputAns.current?.focus();
  };
  const isInteger = (num: any): boolean => /^-?[0-9]+$/.test(num + '');
  const isTime = (str: string): boolean => {
    str = str.trim();
    let arr = str.split(':');
    if (arr.length === 2 && isInteger(arr[0]) && isInteger(arr[0])) {
      return true;
    }
    return false;
  };

  const onStartCountW = (): void => {
    const removeTime = true;
    const inputEl = document.getElementById('inputTxt') as HTMLTextAreaElement | null;
    let inputtxt = inputEl ? inputEl.value : '';
    let input = '';
    if (removeTime === true) {
      let arrIn = inputtxt.split('\n');
      for (let i = 0; i < arrIn.length; i++) {
        if (!isTime(arrIn[i])) {
          input += `${arrIn[i]} `;
        }
      }
    }
    let arrReg = ['[', ']', ',', '?', '(', ')', '!', '\u2014', '-', '.', '\u201c', '\u201d', '\n', ';', '  '];
    input = replaceArr(input, arrReg, ' ');
    const numWordBreakEl = document.getElementById('numWordBreak') as HTMLInputElement | null;
    const NUMOFWORD = numWordBreakEl ? numWordBreakEl.value : '7';
    let input2 = '';
    let count = 0;
    for (let j = 0; j < input.length; j++) {
      if (input[j] === ' ') {
        count++;
        if (count >= Number(NUMOFWORD)) {
          input2 += '*';
          count = 0;
          continue;
        }
      }
      input2 += input[j];
    }
    arrSentence = input2.split('*');
    console.log(arrSentence);
    indexST = -1;
    setAnswer('');
    changeSentence();
    if (inputEl) inputEl.style.display = 'none';
    inputAns.current?.focus();
  };
  const changeSentence = (): void => {
    if (_.isEmpty(arrSentence)) {
      onStart();
      if (_.isEmpty(arrSentence)) {
        return;
      }
    }
    indexST = getIndex(indexST);
    setLastAnsw(sentence);
    sentence = arrSentence[indexST].trim();
    sentence = sentence.replaceAll('  ', ' ');
    speakAns();
  };

  const getIndex = (indexST: number): number => {
    indexST = indexST + 1;
    if (indexST >= arrSentence.length) {
      indexST = 0;
    }

    return _.isEmpty(arrSentence[indexST]) ? getIndex(indexST) : indexST;
  };

  const speakAns = (): void => {
    speakText(sentence);
  };
  const onCheck = (): void => {
    const answerEl = document.getElementById('answer') as HTMLInputElement | null;
    let ans = answerEl ? answerEl.value : '';
    if (isEqualStr(sentence, ans, true)) {
      let arr = validateArrStrCheck(ans, sentence, 0);
      setAnswer(arrStrCheckToStr(arr));
      changeSentence();
      if (answerEl) answerEl.value = '';
    } else {
      let arr0 = validateArrStrCheck(ans, sentence, 0);
      let arr1 = validateArrStrCheck(ans, sentence, 1);
      let arr2 = validateArrStrCheck(ans, sentence, 2);
      let arr = arr0;
      if (getNumberCorrect(arr) < getNumberCorrect(arr1)) {
        arr = arr1;
      }
      if (getNumberCorrect(arr) < getNumberCorrect(arr2)) {
        arr = arr2;
      }
      setAnswer(arrStrCheckToStr(arr));
    }
  };

  const getNumberCorrect = (arr: any[]): number => {
    let number = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].type === TYPE_CORRECT) {
        number += 1;
      }
    }
    return number;
  };
  const handleKeyDownInput = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.nativeEvent.code === 'PageUp') {
      onHideInput('inputTxt');
      inputAns.current?.focus();
    }
    if (e.nativeEvent.code === 'PageDown') {
      onHideInput('control');
      inputAns.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    console.log(e.nativeEvent.code);
    if (e.key === 'Enter') {
      onCheck();
    }
    if (e.nativeEvent.code === 'ShiftLeft') {
      let arr = genHintStrAns('answer', sentence);
      setAnswer(arrStrCheckToStr(arr));
    }
    if (e.nativeEvent.code === 'ControlLeft') {
      let preAnsInput = (document.getElementById('answer') as HTMLInputElement | null)?.value || '';
      autoCorrectLetter('answer', sentence);
      let afterAnsInput =
        (document.getElementById('answer') as HTMLInputElement | null)?.value || '';
      if (_.isEqual(preAnsInput, afterAnsInput) && preAnsInput.length < sentence.length) {
        let len = preAnsInput.length;
        preAnsInput = preAnsInput + sentence.substring(len, len + 1);
        const answerEl = document.getElementById('answer') as HTMLInputElement | null;
        if (answerEl) answerEl.value = preAnsInput;
      }
    }
    if (e.nativeEvent.code === 'Insert') {
      speakAns();
    }

    if (e.nativeEvent.code === 'End') {
      changeSentence();
    }
    if (e.nativeEvent.code === 'Home') {
      onStart();
    }
    if (e.nativeEvent.code === 'PageUp') {
      onHideInput('inputTxt');
    }
    if (e.nativeEvent.code === 'PageDown') {
      onHideInput('control');
    }
    if (e.nativeEvent.code === 'ArrowDown') {
      speakText(lastAnsw);
    }
    if (e.nativeEvent.code === 'ShiftRight') {
      speakText(getNextSubAns());
    }
    if (e.nativeEvent.code === 'ControlRight') {
      speakI();
    }
  };
  const speakI = (): void => {
    console.log('ds');
    let numOfWord = (document.getElementById('numbWord') as HTMLInputElement | null)?.value || '2';
    let nextStr = getNextSubAns();
    let index = getPosition(nextStr, ' ', Number(numOfWord));
    if (index > 0) {
      speakText(nextStr.substring(0, index));
    } else {
      speakText(nextStr);
    }
  };
  const getNextSubAns = (): string => {
    let ansInput = (document.getElementById('answer') as HTMLInputElement | null)?.value || '';
    let indexFirstErr = 0;
    let arrStrCheck = validateArrStrCheck(ansInput, sentence, 0);
    for (let i = 0; i < arrStrCheck.length; i++) {
      if (_.isEqual(arrStrCheck[i].type, TYPE_WRONG)) {
        indexFirstErr = i;
        break;
      }
    }
    let strSpeak = sentence.substring(0, indexFirstErr);
    let index = strSpeak.lastIndexOf(' ');
    return sentence.substring(index, sentence.length);
  };

  const speakText = (speakStr: string): void => {
    const cfg = toSpeechConfig(practiceState);
    var utterance = new window.SpeechSynthesisUtterance();
    utterance.text = speakStr;
    utterance.rate = cfg.rate;
    utterance.voice = voices[cfg.voice] || null;
    utterance.volume = cfg.volume;
    speak(utterance);
  };
  return (
    <div className="container-left listen-prac">
      <div id="control">
        <textarea
          id="inputTxt"
          className="area-input"
          onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => handleKeyDownInput(e)}
        ></textarea>
        <br />
        <button className="common-btn" id="hideBtn" onClick={() => onHideInput('inputTxt')}>
          <FaEyeSlash />
        </button>
        <span> </span>
        <button className="common-btn" id="Start" onClick={() => onStart()}>
          Start
        </button>
        <button className="common-btn" onClick={() => onStartCountW()}>
          St2
        </button>
        <input id="numWordBreak" className="width-30" />
        <span> </span>
        <input id="numbWord" className="width-30" />
        <span> </span>
        <div className="mobile">
          <button className="common-btn" onClick={() => onCheck()}>
            c
          </button>
          <span> </span>
          <button className="common-btn" onClick={() => speakI()}>
            ci
          </button>
          <span> </span>
          <button className="common-btn" onClick={() => speakText(getNextSubAns())}>
            ce
          </button>
        </div>
        <br />
        <span className="rate-value">Voice/Rate: use ⚙️ Config sticky</span>

        <div className="tooltip">
          ?
          <span className="tooltiptext">
            Enter :check
            <br />
            ShiftLeft: hint 1 letter
            <br />
            ControlLeft: correct 1 letter
            <br />
            Insert: speak all
            <br />
            ShiftRight: speak error word -{'>'} end
            <br />
            ControlRight: speak error word -{'>'} i
            <br />
            End: next question
            <br />
            Home: start
            <br />
            PageUp: hide txt input
            <br />
            PageDown: hide all
            <br />
            ArrowDown: speak last{' '}
          </span>
        </div>
        <br />
      </div>
      <div className="">
        <div dangerouslySetInnerHTML={{ __html: answer }}></div>
        <br />
        <input
          type="text"
          id="answer"
          ref={inputAns}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(e)}
        />
        <br />
      </div>
    </div>
  );
};

export default ListenSentencePractice;
