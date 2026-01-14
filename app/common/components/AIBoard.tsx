'use client';
import { useEffect, useState, useRef } from 'react';
import type { ChangeEvent, KeyboardEvent, Dispatch, SetStateAction } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Configuration, OpenAIApi } from 'openai-edge';
import { toggleCollapse, KEY_GPT_NM, KEY_GEMINI_NM, collapseElement } from '@/common/common.js';
import VoiceToText from '@/app/common/components/VoiceToText';
import '@/slearning/multi-ai/style-ai.css';
import loadingImg from '@/public/loading.webp';
import SheetDataEditor from './SheetDataEditor';
import { FaCog, FaSave } from 'react-icons/fa';
const TP_GEN = 1;
const TP_GPT = 2;
let aiType = TP_GEN;

interface ModelAI {
  value: string;
  name: string;
  type: number;
}

export interface AIBoardProps {
  size?: number;
  prefix: string;
  index: number;
  enableHis: 'Y' | 'N' | null;
  heightRes?: number;
  isMini?: boolean;
  statement?: string;
  lastSentence?: string | null;
  collapse?: string | null;
}

const MODEL_AI: ModelAI[] = [
  { value: 'gemini-2.5-flash', name: 'gemini-2.5-flash', type: TP_GEN },
  { value: 'gpt-4o', name: 'gpt-4o', type: TP_GPT },
];

const AIBoard: React.FC<AIBoardProps> = (props) => {
  const keyGeminiNm = `gemi-key-${props.prefix}${props.index}`;
  const keyChatGptNm = `gpt-key-${props.prefix}${props.index}`;
  const sysPromptNm = `sys-promt-${props.prefix}${props.index}`;
  let aiGem = useRef<GoogleGenAI | null>(null);
  let aiGemHis = useRef<any>(null);
  let openai = useRef<OpenAIApi | null>(null);

  const [gemKey, setGemKey] = useState<string | null>(null);
  const [gptKey, setGptKey] = useState<string | null>(null);
  const [aiName, setAIName] = useState<string>('Gemini');
  const [model, setModel] = useState<ModelAI>(MODEL_AI[0]);
  const [useHis, setUseHis] = useState<string>(props.enableHis ?? 'N');

  const [prompt, setPrompt] = useState<string>('');
  const [sysPrompt, setSysPrompt] = useState<string>('');
  const [isUseAIMini, setIsUseAIMini] = useState<boolean>(false);

  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');

  useEffect((): void => {
    let gmLcal = localStorage.getItem(keyGeminiNm);
    let gptLcal = localStorage.getItem(keyChatGptNm);
    let locGem = gmLcal ? gmLcal : localStorage.getItem(KEY_GEMINI_NM);
    let locgpt = gptLcal ? gptLcal : localStorage.getItem(KEY_GPT_NM);
    let sysPromptVa = localStorage.getItem(sysPromptNm) ?? '';
    console.log(locGem);
    if (gmLcal) {
      setGemKey(locGem);
    }
    if (gptLcal) {
      setGptKey(locgpt);
    }
    setSysPrompt(sysPromptVa);
    if (props.collapse !== 'Y') {
      toggleCollapse(`gemini-${props.prefix}${props.index}`);
    }
    aiGem.current = new GoogleGenAI({ apiKey: locGem || undefined });
    openai.current = new OpenAIApi(new Configuration({ apiKey: locgpt || undefined }));
  }, []);

  useEffect((): void => {
    onAskMini();
  }, [props.statement]);

  useEffect((): void => {
    aiType = model.type;
    if (useHis === 'Y' && aiGem.current) {
      aiGemHis.current = aiGem.current.chats.create({
        model: model.value,
      });
    }
  }, [useHis]);
  useEffect((): void => {
    aiType = model.type;
    if (useHis === 'Y' && aiGem.current) {
      aiGemHis.current = aiGem.current.chats.create({
        model: model.value,
      });
    }
  }, [model]);
  useEffect((): void => {
    let key = gemKey ? gemKey : localStorage.getItem(KEY_GEMINI_NM);
    aiGem.current = new GoogleGenAI({ apiKey: key || undefined });
    localStorage.setItem(keyGeminiNm, gemKey || '');
    if (useHis === 'Y' && aiGem.current) {
      aiGemHis.current = aiGem.current.chats.create({
        model: model.value,
      });
    }
    if (gemKey === null) {
      setGemKey('');
    }
  }, [gemKey]);

  useEffect((): void => {
    let key = gptKey ? gptKey : localStorage.getItem(KEY_GPT_NM);
    openai.current = new OpenAIApi(new Configuration({ apiKey: key || undefined }));
    localStorage.setItem(keyChatGptNm, gptKey || '');
    if (gptKey === null) {
      setGptKey('');
    }
  }, [gptKey]);

  useEffect((): void => {
    if (sysPrompt) {
      localStorage.setItem(sysPromptNm, sysPrompt);
    }
  }, [sysPrompt]);

  function onAskMini(isProcess: boolean = false, spSentence: string | null = null): void {
    let promp = spSentence ?? props.statement;
    let isUseMiniAI = (
      document.getElementById(`enable-ai-mini-${props.prefix}${props.index}`) as HTMLInputElement
    )?.checked;
    if (props.isMini && promp && (isUseMiniAI || isProcess)) {
      let isToggleMiniAI = (
        document.getElementById(`toggle-ai-mini-${props.prefix}${props.index}`) as HTMLInputElement
      )?.checked;
      askDec(promp);
      console.log('ask: ', promp);
      if (isToggleMiniAI) {
        collapseElement(`gemini-${props.prefix}${props.index}`);
      }
    }
  }
  function reloadMini(): void {
    onAskMini(true);
    collapseElement(`gemini-${props.prefix}${props.index}`);
  }
  function specSentAIMini(spSentence: string): void {
    onAskMini(true, spSentence);
    collapseElement(`gemini-${props.prefix}${props.index}`);
  }

  async function askGemini(promVal: string): Promise<string> {
    const aiResponse = await aiGem.current!.models.generateContent({
      model: model.value,
      contents: promVal,
      config: {
        systemInstruction: sysPrompt,
      },
    });
    return aiResponse.text || '';
  }

  async function askGeminiHis(promVal: string): Promise<string> {
    const aiResponse = await aiGemHis.current.sendMessage({
      message: promVal,
    });

    return aiResponse.text;
  }

  async function askChatGPT(promVal: string): Promise<any> {
    const completion = await openai.current!.createChatCompletion({
      model: model.value,
      messages: [
        { role: 'system', content: sysPrompt },
        { role: 'user', content: promVal },
      ],
      temperature: 0,
      stream: true,
    });

    console.log(completion);
  }

  async function askDec(promVal: string): Promise<void> {
    if (!promVal || promVal.trim().length === 0) {
      return;
    }
    let responseTxt: string = '';
    setTimeout((): void => {
      setPrompt('');
    }, 100);
    toggleClass(`loading${props.prefix}${props.index}`, false);
    // let responseTmp = response;
    addLog(formatMyQus(promVal) + '<br/>', true);
    setValue1(promVal);

    try {
      if (aiType === TP_GPT) {
        responseTxt = await askChatGPT(promVal);
        setAIName('GPT');
      } else {
        setAIName('Gemini');
        responseTxt = useHis === 'Y' ? await askGeminiHis(promVal) : await askGemini(promVal);
      }
      addLog(fomatRawResponse(responseTxt), false);
      setValue2(fomatRawResponse(responseTxt));
    } catch (error) {
      addLog(String(error), false);
    }
    toggleClass(`loading${props.prefix}${props.index}`, true);
  }
  function toggleClass(id: string, isHiding: boolean): void {
    const content = document.getElementById(id);
    if (content) {
      if (!isHiding) {
        content.classList.add('open');
      } else {
        content.classList.remove('open');
      }
    }
  }

  function addLog(message: string, isQuest: boolean): void {
    let logElement = document.getElementById(`response-ai-${props.prefix}${props.index}`);
    if (!logElement) return;
    const logEntry = document.createElement('div');
    logEntry.innerHTML = message;
    logElement.appendChild(logEntry);
    logElement.scrollTop = logElement.scrollHeight;
    if (isQuest) {
    } else {
      setTimeout((): void => {
        let extraHeight = logEntry.offsetHeight;
        logElement!.scrollBy({
          top: -Number(extraHeight) + Number(props.heightRes) - 40, // negative value scrolls up
          // top: (-extraHeight + props.heightRes - 40), // negative value scrolls up
          behavior: 'smooth', // optional for smooth scroll
        });
      }, 100);
    }
  }
  function clearLog(): void {
    let logElement = document.getElementById(`response-ai-${props.prefix}${props.index}`);
    if (logElement) logElement.innerHTML = '';
  }
  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>, promVal: string): void {
    if (e.key === 'Enter' && e.shiftKey) {
      console.log('Shift + Enter detected');
    } else if (e.key === 'Enter') {
      askDec(promVal);
    }
  }

  function fomatRawResponse(input: string): string {
    input = input.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>'); // ** -> <b>
    // input = input.replaceAll(`\n`, '<br/>');
    input = replaceNewlinesExceptInTags(input, ['pre']);
    input = input.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // ** -> <b>
    input = input.replaceAll(`<br/>* `, '<br/>➤');
    input = input.replaceAll(`<br/>### `, '<br/>⚙️');
    input = input.replaceAll(`<br/>## `, '<br/>📌');
    input = input.replace(/\*(.*?)\*/g, '<i>$1</i>');

    return input;
  }
  function replaceNewlinesExceptInTags(text: string, tagsToProtect: string[] = ['pre']): string {
    const tagPattern = tagsToProtect.join('|');
    const regex = new RegExp(`<(${tagPattern})\\b[^>]*>[\\s\\S]*?<\\/\\1>`, 'gi');

    const protectedBlocks: string[] = [];
    const placeholder = '%%BLOCK_';
    let index = 0;

    // Extract and protect content inside the tags
    const protectedText = text.replace(regex, (match: string): string => {
      const tagName = match.match(/^<(\w+)/i)![1];
      const openTag = match.match(new RegExp(`<${tagName}\\b[^>]*>`, 'i'))![0];
      const content = match.replace(openTag, '').replace(new RegExp(`<\\/${tagName}>$`, 'i'), '');
      const escapedContent = escapeHtml(content);
      protectedBlocks.push(`${openTag}${escapedContent}</${tagName}>`);
      return `${placeholder}${index++}%%`;
    });

    // Replace \n with <br/> in the rest of the text
    const withBreaks = protectedText.replace(/\n/g, '<br/>');

    // Restore the protected blocks
    const finalText = withBreaks.replace(
      new RegExp(`${placeholder}(\\d+)%%`, 'g'),
      (_: string, i: string): string => protectedBlocks[Number(i)],
    );

    return finalText;
  }
  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;') // escape & first
      .replace(/</g, '&lt;') // escape <
      .replace(/>/g, '&gt;') // escape >
      .replace(/"/g, '&quot;') // escape "
      .replace(/'/g, '&#39;'); // escape '
  }

  function formatMyQus(input: string): string {
    return `<div class ='my-quest'>${input}</div>`;
  }

  return (
    <div>
      <div
        className="width-100 inline"
        onClick={() => toggleCollapse(`gemini-${props.prefix}${props.index}`)}
      >
        {`Instance ${props.index + 1}`}
        {props.isMini && (
          <label>
            {' '}
            <input
              id={`enable-ai-mini-${props.prefix}${props.index}`}
              type="checkbox"
              defaultChecked={false}
            />
            Enable
          </label>
        )}
        {props.isMini && (
          <label>
            {' '}
            <input
              id={`toggle-ai-mini-${props.prefix}${props.index}`}
              type="checkbox"
              defaultChecked={false}
            />
            Toggle
          </label>
        )}
        {props.isMini && <input onClick={() => reloadMini()} type="submit" value="Curr" />}
        {props.isMini && (
          <input
            onClick={() => specSentAIMini(props.lastSentence || '')}
            type="submit"
            value="Last"
          />
        )}
      </div>
      <div className="collapse-content bolder" id={`gemini-${props.prefix}${props.index}`}>
        <img
          id={`loading${props.prefix}${props.index}`}
          className="collapse-content loading"
          src={loadingImg.src}
        />
        <div
          style={{ height: `${props.heightRes}px` }}
          id={`response-ai-${props.prefix}${props.index}`}
          className="response-ai"
        ></div>
        <br />
        <textarea
          id={`prompt-${props.prefix}${props.index}`}
          className="ai-promt"
          rows={3}
          value={prompt}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
          placeholder=""
          onKeyDown={(e) => handleKeyDown(e, prompt)}
        />
        <br />

        <div
          className="inline"
          onClick={() => toggleCollapse(`config-${props.prefix}${props.index}`)}
        >
          <FaCog />
        </div>
        <div
          className="inline"
          onClick={() => toggleCollapse(`save-sheet-${props.prefix}${props.index}`)}
        >
          <FaSave />
        </div>
        <div className="collapse-content bolder" id={`config-${props.prefix}${props.index}`}>
          <button onClick={() => askDec(prompt)} className="common-btn inline">
            Send
          </button>
          <VoiceToText setText={setPrompt} index={props.index}></VoiceToText>
          <button onClick={() => clearLog()} className="common-btn inline">
            Clear
          </button>
          <select
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setModel(MODEL_AI.find((m) => m.value === e.target.value) || MODEL_AI[0]);
            }}
          >
            {MODEL_AI.map((option, index) => (
              <option key={option.value} value={option.value}>
                {`${option.name}`}
              </option>
            ))}
          </select>
          <span>History</span>
          <select
            value={useHis}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setUseHis(e.target.value);
            }}
          >
            <option value="Y">Yes</option>
            <option value="N">No</option>
          </select>
          <br />
          <input
            type="text"
            value={gemKey || ''}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setGemKey(event.target.value);
            }}
            placeholder="gem"
          />
          <input
            type="text"
            value={gptKey || ''}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setGptKey(event.target.value);
            }}
            placeholder="gpt"
          />
          <br />
          <textarea
            className="ai-promt"
            rows={3}
            value={sysPrompt}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setSysPrompt(e.target.value)}
            placeholder="Sys promt"
          />
        </div>

        <div className="collapse-content bolder" id={`save-sheet-${props.prefix}${props.index}`}>
          <SheetDataEditor value1={value1} value2={value2} />
        </div>
      </div>
    </div>
  );
};
export default AIBoard;
