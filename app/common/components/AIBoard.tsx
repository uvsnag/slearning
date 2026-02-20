'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import type { ChangeEvent, KeyboardEvent, Dispatch, SetStateAction } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Configuration, OpenAIApi } from 'openai-edge';
import { toggleCollapse, KEY_GPT_NM, KEY_GEMINI_NM, collapseElement } from '@/common/common.js';
import VoiceToText from '@/app/common/components/VoiceToText';
import { useSpeechSynthesis } from '@/app/common/hooks/useSpeechSynthesis';
import '@/slearning/multi-ai/style-ai.css';
import loadingImg from '@/public/loading.webp';
import SheetDataEditor from './SheetDataEditor';
import PracticeVoiceConfig from './PracticeVoiceConfig';
import { FaCog, FaSave, FaVolumeUp } from 'react-icons/fa';
import SignOutButton from './SignOutButton';
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
  isMini?: boolean | null;
  statement?: string;
  firstAsk?: string;
  lastSentence?: string | null;
  collapse?: string | null;
  isSpeak?: 'Y' | 'N' | 'A' | boolean | null;
}

const MODEL_AI: ModelAI[] = [
  { value: 'gemini-2.5-flash', name: 'gemini-2.5-flash', type: TP_GEN },
  { value: 'gpt-4o', name: 'gpt-4o', type: TP_GPT },
];
const CLICK_TO_SPEECH_IGNORE_WORDS: string[] = [
  'a',
  'an',
  'the',
  'have',
  'has',
  'is',
  'are',
  'am',
  'was',
  'were',
  'be',
  'been',
  'being',
  'do',
  'does',
  'did',
  'to',
  'of',
  'in',
  'on',
  'at',
  'for',
  'and',
  'or',
  'I',
  'you',
  'he',
  'she',
  'it',
  'we',
  'they',
  'me',
  'him',
  'her',
  'us',
  'them',
  'but',
  'if',
  'then',
  'that',
];
const CLICK_TO_SPEECH_IGNORE_SET = new Set(
  CLICK_TO_SPEECH_IGNORE_WORDS.map((word) => word.toLowerCase()),
);

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
  const [useSpeak, setUseSpeak] = useState<'Y' | 'N' | 'A'>(
    props.isSpeak === 'Y' || props.isSpeak === true ? 'Y' : 'N',
  );
  const [useClickToSpeech, setUseClickToSpeech] = useState<'Y' | 'N'>(
    props.isSpeak === 'Y' || props.isSpeak === true ? 'Y' : 'N',
  );
  const [wordPopup, setWordPopup] = useState<{
    open: boolean;
    word: string;
    meaning: string;
    loading: boolean;
    error: string;
  }>({
    open: false,
    word: '',
    meaning: '',
    loading: false,
    error: '',
  });
  const meaningCacheRef = useRef<Record<string, string>>({});
  const clickRequestIdRef = useRef<number>(0);

  const [prompt, setPrompt] = useState<string>(props.firstAsk ?? '');
  const [sysPrompt, setSysPrompt] = useState<string>('');
  const [isUseAIMini, setIsUseAIMini] = useState<boolean>(false);

  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');
  const [lastResponseRaw, setLastResponseRaw] = useState<string>('');
  const [voiceIndex, setVoiceIndex] = useState<number>(0);
  const [rate, setRate] = useState<number>(1);
  const [volumn, setVolumn] = useState<number>(0.6);
  const { speakText, voices } = useSpeechSynthesis();
  const isSpeakEnabled = useSpeak !== 'N';

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
      collapseElement(`gemini-${props.prefix}${props.index}`);
      console.log('toggleCollapse');
      toggleCollapse(`gemini-${props.prefix}${props.index}`);
    }
    aiGem.current = new GoogleGenAI({ apiKey: locGem || undefined });
    openai.current = new OpenAIApi(new Configuration({ apiKey: locgpt || undefined }));
  }, []);

  useEffect((): void => {
    onAskMini();
  }, [props.statement]);
  useEffect((): void => {
    voices.forEach((option: any, index: number): void => {
      if (option.lang.includes('en-US')) {
        setVoiceIndex(index);
      }
    });
  }, [voices]);

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

  useEffect((): void => {
    if (useSpeak === 'A' && useClickToSpeech !== 'Y') {
      setUseClickToSpeech('Y');
    }
  }, [useSpeak, useClickToSpeech]);

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
    setValue1('');
    setValue2('');
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

    try {
      if (aiType === TP_GPT) {
        responseTxt = await askChatGPT(promVal);
        setAIName('GPT');
      } else {
        setAIName('Gemini');
        responseTxt = useHis === 'Y' ? await askGeminiHis(promVal) : await askGemini(promVal);
      }
      setLastResponseRaw(responseTxt);
      if (useSpeak !== 'N' && responseTxt) {
        const textToSpeak =
          useSpeak === 'A'
            ? extractConversationSentence(responseTxt)
            : sanitizeForSpeech(responseTxt);
        if (textToSpeak) {
          speakText(textToSpeak, true, {
            voice: voiceIndex,
            rate: rate,
            volume: volumn,
          });
        }
      }
      addLog(buildResponseHtml(responseTxt), false);

      setValue1(promVal);
      setValue2(fomatRawResponse(responseTxt));
    } catch (error) {
      addLog(String(error), false);
    }
    toggleClass(`loading${props.prefix}${props.index}`, true);
  }

  function sanitizeForSpeech(text: string): string {
    return text
      .replace(/[^\p{L}\p{N}\s.,!?;:'"()-]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function normalizeWord(token: string): string {
    return token.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '').trim();
  }

  function buildClickableWordHtml(text: string): string {
    return text
      .split(/\n/)
      .map((line) =>
        line
          .split(/\s+/)
          .filter(Boolean)
          .map((word) => {
            const displayWord = escapeHtml(word);
            const normalizedWord = normalizeWord(word);
            if (!normalizedWord || CLICK_TO_SPEECH_IGNORE_SET.has(normalizedWord.toLowerCase())) {
              return `<span>${displayWord}</span>`;
            }
            const clickValue = encodeURIComponent(normalizedWord.toLowerCase());
            return `<button type="button" class="common-btn inline btn-word-speak" data-click-word="${clickValue}" style="margin:2px;padding:2px 6px;">${displayWord}</button>`;
          })
          .join(' '),
      )
      .join('<br/>');
  }

  function buildResponseHtml(rawResponse: string): string {
    const formattedResponse = fomatRawResponse(rawResponse);
    if (useClickToSpeech === 'N') {
      return formattedResponse;
    }
    if (!rawResponse || !rawResponse.trim()) {
      return formattedResponse;
    }
    return `<div>${buildClickableWordHtml(rawResponse)}</div>`;
    // return `${formattedResponse}<div>${buildClickableWordHtml(cleanedResponse)}</div>`;
  }

  function extractConversationSentence(text: string): string {
    const fullText = sanitizeForSpeech(text);
    const normalizedText = text.replace(/\r\n/g, '\n').replace(/\*\*/g, '');
    const lines = normalizedText.split('\n');
    let inlineSectionBody = '';
    let continueLineIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const match = line.match(/^[-*#\d.)\s]*continue\s+conversation\s*:\s*(.*)$/i);
      if (match) {
        continueLineIndex = i;
        inlineSectionBody = (match[1] || '').trim();
        break;
      }
    }

    if (continueLineIndex === -1) {
      return fullText;
    }

    const sectionLines: string[] = [];
    if (inlineSectionBody) {
      sectionLines.push(inlineSectionBody);
    }
    for (let i = continueLineIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      if (/^[-*#\d.)\s]*[a-z][a-z\s]{1,30}:\s*$/i.test(line)) {
        break;
      }
      sectionLines.push(line);
    }
    const sectionBody = sectionLines.join(' ').trim();
    if (!sectionBody) {
      return fullText;
    }

    const cleanedSection = sectionBody.replace(/^[-*0-9.)\s]+/, '').trim();
    const conversationText = sanitizeForSpeech(cleanedSection);
    return conversationText || fullText;
  }

  const fetchVietnameseMeaning = useCallback(async (word: string): Promise<string> => {
    const normalizedWord = word.toLowerCase();
    if (meaningCacheRef.current[normalizedWord]) {
      return meaningCacheRef.current[normalizedWord];
    }

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        normalizedWord,
      )}&langpair=en|vi`,
    );
    const data = await response.json();
    const translated = data?.responseData?.translatedText;
    const meaning =
      typeof translated === 'string' && translated.trim() ? translated.trim() : 'No meaning found.';
    meaningCacheRef.current[normalizedWord] = meaning;
    return meaning;
  }, []);

  const onClickSpeechWord = useCallback(
    async (clickedWord: string): Promise<void> => {
      const cleanWord = normalizeWord(clickedWord);
      if (!cleanWord) return;

      speakText(cleanWord, true, {
        voice: voiceIndex,
        rate: rate,
        volume: volumn,
      });

      const requestId = clickRequestIdRef.current + 1;
      clickRequestIdRef.current = requestId;
      setWordPopup({
        open: true,
        word: cleanWord,
        meaning: '',
        loading: true,
        error: '',
      });

      try {
        const meaning = await fetchVietnameseMeaning(cleanWord);
        if (clickRequestIdRef.current !== requestId) return;
        setWordPopup({
          open: true,
          word: cleanWord,
          meaning: meaning,
          loading: false,
          error: '',
        });
      } catch (error) {
        if (clickRequestIdRef.current !== requestId) return;
        setWordPopup({
          open: true,
          word: cleanWord,
          meaning: '',
          loading: false,
          error: String(error),
        });
      }
    },
    [speakText, voiceIndex, rate, volumn, fetchVietnameseMeaning],
  );

  function speakPopupWord(word: string): void {
    const cleanWord = normalizeWord(word);
    if (!cleanWord) return;
    speakText(cleanWord, true, {
      voice: voiceIndex,
      rate: rate,
      volume: volumn,
    });
  }

  useEffect((): (() => void) | void => {
    const logElement = document.getElementById(`response-ai-${props.prefix}${props.index}`);
    if (!logElement) return;

    const handleWordClick = (event: Event): void => {
      const target = event.target as HTMLElement;
      console.log('Clicked element:', target);
      const wordData = target?.getAttribute('data-click-word');
      if (!wordData || useClickToSpeech !== 'Y') return;
      event.preventDefault();
      const clickedWord = decodeURIComponent(wordData);
      onClickSpeechWord(clickedWord);
    };

    logElement.addEventListener('click', handleWordClick);
    return () => {
      logElement.removeEventListener('click', handleWordClick);
    };
  }, [props.prefix, props.index, useClickToSpeech, onClickSpeechWord]);

  function onSpeakLastResponse(): void {
    if (!isSpeakEnabled || !lastResponseRaw) {
      return;
    }
    const textToSpeak =
      useSpeak === 'A'
        ? extractConversationSentence(lastResponseRaw)
        : sanitizeForSpeech(lastResponseRaw);
    if (!textToSpeak) {
      return;
    }
    speakText(textToSpeak, true, {
      voice: voiceIndex,
      rate: rate,
      volume: volumn,
    });
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
      <div
        className="collapse-content bolder"
        style={{
          padding: '5px',
          borderRadius: '8px',
        }}
        id={`gemini-${props.prefix}${props.index}`}
      >
        <img
          id={`loading${props.prefix}${props.index}`}
          className="collapse-content loading"
          src={loadingImg.src}
        />
        <div
          style={{ height: `${props.heightRes}px`, borderRadius: '8px' }}
          id={`response-ai-${props.prefix}${props.index}`}
          className="response-ai"
        ></div>
        <br />
        <textarea
          id={`prompt-${props.prefix}${props.index}`}
          className="ai-promt"
          rows={3}
          style={{
            marginLeft: '5px',
          }}
          value={prompt}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
          placeholder=""
          onKeyDown={(e) => handleKeyDown(e, prompt)}
        />
        <br />
        <VoiceToText setText={setPrompt} index={props.index}></VoiceToText>
        <button onClick={() => askDec(prompt)} className="common-btn inline">
          Send
        </button>
        <div
          className="btn-icon"
          onClick={() => toggleCollapse(`config-${props.prefix}${props.index}`)}
        >
          <FaCog />
        </div>

        <div className="collapse-content bolder" id={`config-${props.prefix}${props.index}`}>
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
          <span>Speak</span>
          <select
            value={useSpeak}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setUseSpeak(e.target.value as 'Y' | 'N' | 'A');
            }}
          >
            <option value="Y">Yes</option>
            <option value="N">No</option>
            <option value="A">Continue conversation</option>
          </select>
          <span>Click to speech</span>
          <select
            value={useClickToSpeech}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setUseClickToSpeech(e.target.value as 'Y' | 'N');
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
        <div
          className="btn-icon"
          onClick={() => toggleCollapse(`save-sheet-${props.prefix}${props.index}`)}
        >
          <FaSave />
        </div>
        <div className="collapse-content bolder" id={`save-sheet-${props.prefix}${props.index}`}>
          <SheetDataEditor value1={value1} value2={value2} />
        </div>
        {isSpeakEnabled && (
          <div
            className="btn-icon"
            onClick={() => toggleCollapse(`voice-config-${props.prefix}${props.index}`)}
          >
            <FaVolumeUp />
          </div>
        )}
        {isSpeakEnabled && (
          <div
            className="collapse-content bolder"
            id={`voice-config-${props.prefix}${props.index}`}
          >
            <button onClick={() => onSpeakLastResponse()} className="common-btn ">
              Speak
            </button>
            <PracticeVoiceConfig
              voices={voices}
              voiceIndex={voiceIndex}
              rate={rate}
              volumn={volumn}
              onVoiceChange={(value: number): void => {
                setVoiceIndex(value);
              }}
              onRateChange={(value: number): void => {
                setRate(value);
              }}
              onVolumnChange={(value: number): void => {
                setVolumn(value);
              }}
            />
          </div>
        )}
        {/* {1 === 1 && ( */}
        {wordPopup.open && (
          <div
            style={{
              position: 'fixed',
              inset: '0',
              zIndex: 1100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() =>
              setWordPopup({
                open: false,
                word: '',
                meaning: '',
                loading: false,
                error: '',
              })
            }
          >
            <div
              style={{
                // backgroundColor: '#f1f9f8',
                // color: '#000000',
                padding: '2px',
                borderRadius: '8px',
                maxWidth: '420px',
                width: '70%',
              }}
              onClick={(e) => e.stopPropagation()}
              className="popup"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                <b>{wordPopup.word}</b>{' '}
                <button
                  type="button"
                  className="common-btn inline"
                  onClick={() => speakPopupWord(wordPopup.word)}
                >
                  <FaVolumeUp />
                </button>
              </div>
              <div style={{ marginTop: '8px' }}>
                {wordPopup.loading && 'Loading Vietnamese meaning...'}
                {!wordPopup.loading && !wordPopup.error && wordPopup.meaning}
                {!wordPopup.loading && wordPopup.error && `Error: ${wordPopup.error}`}
              </div>
              <button
                onClick={() =>
                  setWordPopup({
                    open: false,
                    word: '',
                    meaning: '',
                    loading: false,
                    error: '',
                  })
                }
                className="common-btn"
                style={{ marginTop: '12px' }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AIBoard;
