'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import type { ChangeEvent, KeyboardEvent, Dispatch, SetStateAction } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Configuration, OpenAIApi } from 'openai-edge';
import {
  toggleCollapse,
  KEY_GPT_NM,
  KEY_GEMINI_NM,
  KEY_GITHUB_NM,
  KEY_OPENROUTER_NM,
  collapseElement,
} from '@/common/common.js';
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
const TP_GITHUB = 3;
const TP_OPENROUTER = 4;
let aiType = TP_GEN;

interface ModelAI {
  value: string;
  name: string;
  type: number;
}

interface ConversationTurn {
  question: string;
  response: string;
  modelName?: string;
}

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIChatResponse {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
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
  title?: string | null;
  defaultPrompt?: string | null;
  defaultModel?: string | null;
  isSpeak?: 'Y' | 'N' | 'A' | boolean | null;
}

const MODEL_AI: ModelAI[] = [
  { value: 'gemini-2.5-flash', name: 'gemini-2.5-flash', type: TP_GEN },
  // { value: 'openai/gpt-4o-mini', name: 'github/gpt-4o-mini', type: TP_GITHUB },
  { value: 'openai/gpt-4.1', name: 'github/gpt-4.1', type: TP_GITHUB },
  // { value: 'openai/gpt-5-mini', name: 'github/gpt-5-mini', type: TP_GITHUB },
  // { value: 'gemini-2.5-flash-lite', name: 'gemini-2.5-flash-lite', type: TP_GEN },
  // { value: 'gemini-3.1-pro-preview', name: 'gemini-3.1-pro-preview', type: TP_GEN },
  // { value: 'gpt-4o', name: 'gpt-4o', type: TP_GPT },
  // { value: 'openai/gpt-5-nano', name: 'openrouter/gpt-5-nano', type: TP_OPENROUTER },
  // {
  //   value: 'openai/gpt-5-mini',
  //   name: 'openrouter/gpt-5-mini',
  //   type: TP_OPENROUTER,
  // },
  // {
  //   value: 'openai/gpt-4o-mini',
  //   name: 'openrouter/gpt-4o-mini',
  //   type: TP_OPENROUTER,
  // },
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
const MAX_HISTORY_TURNS = 15;
const MAX_OPENAI_HISTORY_MESSAGES = 30;
const GITHUB_INFERENCE_BASE_PATH = 'https://models.github.ai/inference';
const OPENROUTER_BASE_PATH = 'https://openrouter.ai/api/v1';

function resolveModel(modelValue?: string | null): ModelAI {
  return MODEL_AI.find((m) => m.value === modelValue) || MODEL_AI[0];
}

const AIBoard: React.FC<AIBoardProps> = (props) => {
  const keyGeminiNm = `gemi-key-${props.prefix}${props.index}`;
  const keyChatGptNm = `gpt-key-${props.prefix}${props.index}`;
  const keyGithubNm = `github-key-${props.prefix}${props.index}`;
  const keyOpenRouterNm = `openrouter-key-${props.prefix}${props.index}`;
  const sysPromptNm = `sys-promt-${props.prefix}${props.index}`;
  const modelAiStoreKey = `model-ai-${props.prefix}${props.index}`;
  const conversationHistoryKey = `ai-history-${props.prefix}${props.index}`;
  let aiGem = useRef<GoogleGenAI | null>(null);
  let aiGemHis = useRef<any>(null);
  let openai = useRef<OpenAIApi | null>(null);
  let githubAI = useRef<OpenAIApi | null>(null);
  let openRouterAI = useRef<OpenAIApi | null>(null);
  const gptHisRef = useRef<OpenAIMessage[]>([]);
  const githubHisRef = useRef<OpenAIMessage[]>([]);
  const openRouterHisRef = useRef<OpenAIMessage[]>([]);
  const historyTurnsRef = useRef<ConversationTurn[]>([]);
  const questionStoreRef = useRef<string[]>([]);
  const responseStoreRef = useRef<string[]>([]);

  const [gemKey, setGemKey] = useState<string | null>(null);
  const [gptKey, setGptKey] = useState<string | null>(null);
  const [githubKey, setGithubKey] = useState<string | null>(null);
  const [openRouterKey, setOpenRouterKey] = useState<string | null>(null);
  const [aiName, setAIName] = useState<string>('Gemini');
  const [model, setModel] = useState<ModelAI>(() => {
    if (props.defaultModel) {
      return resolveModel(props.defaultModel);
    }
    if (typeof window !== 'undefined') {
      const storedModel = localStorage.getItem(modelAiStoreKey);
      if (storedModel) {
        return resolveModel(storedModel);
      }
    }
    return MODEL_AI[0];
  });
  const [useHis, setUseHis] = useState<string>(props.enableHis ?? 'N');
  const [useSpeak, setUseSpeak] = useState<'Y' | 'N' | 'A'>(
    props.isSpeak === 'Y' || props.isSpeak === 'A' ? 'Y' : 'N',
  );
  const [useClickToSpeech, setUseClickToSpeech] = useState<'Y' | 'N'>(
    props.isSpeak === 'Y' || props.isSpeak === 'A' ? 'Y' : 'N',
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
  const [isPromptExpanded, setIsPromptExpanded] = useState<boolean>(false);
  const [sysPrompt, setSysPrompt] = useState<string>('');
  const [isUseAIMini, setIsUseAIMini] = useState<boolean>(false);

  const [value1, setValue1] = useState<string>('');
  const [value2, setValue2] = useState<string>('');
  const [lastResponseRaw, setLastResponseRaw] = useState<string>('');
  const [voiceIndex, setVoiceIndex] = useState<number>(0);
  const [rate, setRate] = useState<number>(1);
  const [volumn, setVolumn] = useState<number>(0.6);
  const { speakText, voices, cancel, speaking } = useSpeechSynthesis();
  const isSpeakEnabled = useSpeak !== 'N';

  function createOpenAIClient(apiKey: string | null, basePath?: string): OpenAIApi {
    const configuration: { apiKey?: string; basePath?: string } = {
      apiKey: apiKey || undefined,
    };
    if (basePath) {
      configuration.basePath = basePath;
    }
    return new OpenAIApi(new Configuration(configuration));
  }

  function trimOpenAIHistory(messages: OpenAIMessage[]): OpenAIMessage[] {
    const hasSystemMessage = messages.length > 0 && messages[0].role === 'system';
    const systemMessage = hasSystemMessage ? [messages[0]] : [];
    const chatMessages = hasSystemMessage ? messages.slice(1) : messages;
    const limitedChatMessages = chatMessages.slice(-MAX_OPENAI_HISTORY_MESSAGES);
    return [...systemMessage, ...limitedChatMessages];
  }

  function resetOpenAIHistoryRefs(): void {
    gptHisRef.current = [];
    githubHisRef.current = [];
    openRouterHisRef.current = [];
  }

  useEffect((): void => {
    let gmLcal = localStorage.getItem(keyGeminiNm);
    let gptLcal = localStorage.getItem(keyChatGptNm);
    let githubLcal = localStorage.getItem(keyGithubNm);
    let openRouterLcal = localStorage.getItem(keyOpenRouterNm);
    let locGem = gmLcal ? gmLcal : localStorage.getItem(KEY_GEMINI_NM);
    let locgpt = gptLcal ? gptLcal : localStorage.getItem(KEY_GPT_NM);
    let locGithub = githubLcal ? githubLcal : localStorage.getItem(KEY_GITHUB_NM);
    let locOpenRouter = openRouterLcal ? openRouterLcal : localStorage.getItem(KEY_OPENROUTER_NM);
    let sysPromptVa = localStorage.getItem(sysPromptNm) ?? props.defaultPrompt ?? '';
    console.log(locGem);
    if (gmLcal) {
      setGemKey(locGem);
    }
    if (gptLcal) {
      setGptKey(locgpt);
    }
    if (githubLcal) {
      setGithubKey(locGithub);
    }
    if (openRouterLcal) {
      setOpenRouterKey(locOpenRouter);
    }
    setSysPrompt(sysPromptVa);
    if (props.collapse !== 'Y') {
      collapseElement(`gemini-${props.prefix}${props.index}`);
      console.log('toggleCollapse');
      toggleCollapse(`gemini-${props.prefix}${props.index}`);
    }
    aiGem.current = new GoogleGenAI({ apiKey: locGem || undefined });
    openai.current = createOpenAIClient(locgpt);
    githubAI.current = createOpenAIClient(locGithub, GITHUB_INFERENCE_BASE_PATH);
    openRouterAI.current = createOpenAIClient(locOpenRouter, OPENROUTER_BASE_PATH);
    historyTurnsRef.current = loadConversationHistory();
    renderConversationHistory(historyTurnsRef.current);
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
    if (useHis === 'Y' && aiGem.current && model.type === TP_GEN) {
      aiGemHis.current = aiGem.current.chats.create({
        model: model.value,
      });
    }
    if (useHis !== 'Y') {
      resetOpenAIHistoryRefs();
    }
  }, [useHis]);
  useEffect((): void => {
    aiType = model.type;
    if (useHis === 'Y' && aiGem.current && model.type === TP_GEN) {
      aiGemHis.current = aiGem.current.chats.create({
        model: model.value,
      });
    }
    resetOpenAIHistoryRefs();
  }, [model]);
  useEffect((): void => {
    let key = gemKey ? gemKey : localStorage.getItem(KEY_GEMINI_NM);
    aiGem.current = new GoogleGenAI({ apiKey: key || undefined });
    localStorage.setItem(keyGeminiNm, gemKey || '');
    if (useHis === 'Y' && aiGem.current && model.type === TP_GEN) {
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
    openai.current = createOpenAIClient(key);
    localStorage.setItem(keyChatGptNm, gptKey || '');
    gptHisRef.current = [];
    if (gptKey === null) {
      setGptKey('');
    }
  }, [gptKey]);

  useEffect((): void => {
    let key = githubKey ? githubKey : localStorage.getItem(KEY_GITHUB_NM);
    githubAI.current = createOpenAIClient(key, GITHUB_INFERENCE_BASE_PATH);
    localStorage.setItem(keyGithubNm, githubKey || '');
    githubHisRef.current = [];
    if (githubKey === null) {
      setGithubKey('');
    }
  }, [githubKey]);

  useEffect((): void => {
    let key = openRouterKey ? openRouterKey : localStorage.getItem(KEY_OPENROUTER_NM);
    openRouterAI.current = createOpenAIClient(key, OPENROUTER_BASE_PATH);
    localStorage.setItem(keyOpenRouterNm, openRouterKey || '');
    openRouterHisRef.current = [];
    if (openRouterKey === null) {
      setOpenRouterKey('');
    }
  }, [openRouterKey]);

  useEffect((): void => {
    if (sysPrompt) {
      localStorage.setItem(sysPromptNm, sysPrompt);
    }
    resetOpenAIHistoryRefs();
  }, [sysPrompt]);

  useEffect((): void => {
    if (useSpeak === 'A' && useClickToSpeech !== 'Y') {
      setUseClickToSpeech('Y');
    }
  }, [useSpeak, useClickToSpeech]);

  useEffect((): void => {
    if (props.defaultModel) {
      setModel(resolveModel(props.defaultModel));
      return;
    }
    const storedModel = localStorage.getItem(modelAiStoreKey);
    if (storedModel) {
      setModel(resolveModel(storedModel));
      return;
    }
    setModel(MODEL_AI[0]);
  }, [props.defaultModel, modelAiStoreKey]);

  useEffect((): void => {
    localStorage.setItem(modelAiStoreKey, model.value);
  }, [modelAiStoreKey, model.value]);

  useEffect((): void => {
    renderConversationHistory(historyTurnsRef.current);
  }, [useClickToSpeech]);

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

  async function askOpenAICompatible(
    client: OpenAIApi | null,
    promVal: string,
    historyRef: { current: OpenAIMessage[] },
  ): Promise<string> {
    if (!client) {
      throw new Error('AI provider is not initialized.');
    }

    const systemPrompt = sysPrompt?.trim();
    let messages: OpenAIMessage[] = [];
    if (useHis === 'Y') {
      if (historyRef.current.length === 0 && systemPrompt) {
        historyRef.current = [{ role: 'system', content: systemPrompt }];
      }
      historyRef.current = trimOpenAIHistory([
        ...historyRef.current,
        { role: 'user', content: promVal },
      ]);
      messages = [...historyRef.current];
    } else {
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }
      messages.push({ role: 'user', content: promVal });
    }

    const completion = await client.createChatCompletion({
      model: model.value,
      messages: messages,
      temperature: 0,
      stream: false,
    });
    const completionJson = (await completion.json()) as OpenAIChatResponse;
    if (!completion.ok) {
      throw new Error(completionJson?.error?.message || `Request failed (${completion.status})`);
    }

    const responseText = completionJson?.choices?.[0]?.message?.content || '';
    if (useHis === 'Y' && responseText) {
      historyRef.current = trimOpenAIHistory([
        ...historyRef.current,
        { role: 'assistant', content: responseText },
      ]);
    }

    return responseText;
  }

  async function askChatGPT(promVal: string): Promise<string> {
    return askOpenAICompatible(openai.current, promVal, gptHisRef);
  }

  async function askGitHub(promVal: string): Promise<string> {
    return askOpenAICompatible(githubAI.current, promVal, githubHisRef);
  }

  async function askOpenRouter(promVal: string): Promise<string> {
    return askOpenAICompatible(openRouterAI.current, promVal, openRouterHisRef);
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
    addLog(buildQuestionLogHtml(promVal), true);
    const usedModelName = model.name;

    try {
      if (aiType === TP_GPT) {
        responseTxt = await askChatGPT(promVal);
        setAIName('GPT');
      } else if (aiType === TP_GITHUB) {
        responseTxt = await askGitHub(promVal);
        setAIName('GitHub');
      } else if (aiType === TP_OPENROUTER) {
        responseTxt = await askOpenRouter(promVal);
        setAIName('OpenRouter');
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
      addLog(buildResponseLogHtml(responseTxt, usedModelName), false);
      appendConversationTurn(promVal, responseTxt, usedModelName);

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
            return `<button type="button" class="common-btn btn-word-speak" data-click-word="${clickValue}" style="margin:2px;padding:2px 6px;">${displayWord}</button>`;
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
    if (hasMarkdownTable(rawResponse)) {
      return formattedResponse;
    }
    if (!rawResponse || !rawResponse.trim()) {
      return formattedResponse;
    }
    return `<div>${buildClickableWordHtml(rawResponse)}</div>`;
    // return `${formattedResponse}<div>${buildClickableWordHtml(cleanedResponse)}</div>`;
  }

  function buildQuestionActionButtonsHtml(questionIndex: number): string {
    return `<div class="ai-question-actions" style="display:flex;gap:6px;margin-top:4px;justify-content:flex-end;">
      <button type="button" class="common-btn" data-question-action="copy" data-question-index="${questionIndex}" title="Copy question">📋</button>
    </div>`;
  }

  function buildQuestionLogHtml(questionText: string): string {
    const questionIndex = questionStoreRef.current.push(questionText) - 1;
    return `${formatMyQus(questionText)}${buildQuestionActionButtonsHtml(questionIndex)}<br/>`;
  }

  function buildResponseModelInfoHtml(modelName?: string): string {
    if (!modelName) {
      return '';
    }
    return `<div class="ai-response-model" style="font-size:11px;opacity:0.75;margin-top:6px;"> ${escapeHtml(
      modelName,
    )}</div>`;
  }

  function buildResponseActionButtonsHtml(responseIndex: number): string {
    return `<div class="ai-response-actions" style="display:flex;gap:6px;margin-top:6px;">
      <button type="button" class="common-btn" data-response-action="speak" data-response-index="${responseIndex}" title="Speak response">🔊</button>
      <button type="button" class="common-btn" data-response-action="copy" data-response-index="${responseIndex}" title="Copy response">📋</button>
    </div>`;
  }

  function buildResponseLogHtml(rawResponse: string, modelName?: string): string {
    const responseIndex = responseStoreRef.current.push(rawResponse) - 1;
    return `<div>${buildResponseHtml(rawResponse)}</div>${buildResponseModelInfoHtml(modelName)}${buildResponseActionButtonsHtml(responseIndex)}`;
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

  const onSpeakResponse = useCallback(
    (responseText: string): void => {
      if (speaking) {
        cancel();
        return;
      }
      const textToSpeak = sanitizeForSpeech(responseText);
      if (!textToSpeak) {
        return;
      }
      speakText(textToSpeak, true, {
        voice: voiceIndex,
        rate: rate,
        volume: volumn,
      });
    },
    [speakText, voiceIndex, rate, volumn, speaking, cancel],
  );

  const onCopyResponse = useCallback(async (responseText: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(responseText);
    } catch (error) {
      console.log('Copy response failed:', error);
    }
  }, []);

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
      const questionActionButton = target.closest('[data-question-action]') as HTMLElement | null;
      if (questionActionButton) {
        event.preventDefault();
        const action = questionActionButton.getAttribute('data-question-action');
        const questionIndex = Number(questionActionButton.getAttribute('data-question-index'));
        const questionText = questionStoreRef.current[questionIndex];
        if (!questionText) return;
        if (action === 'copy') {
          void onCopyResponse(questionText);
        }
        return;
      }

      const actionButton = target.closest('[data-response-action]') as HTMLElement | null;
      if (actionButton) {
        event.preventDefault();
        const action = actionButton.getAttribute('data-response-action');
        const responseIndex = Number(actionButton.getAttribute('data-response-index'));
        const responseText = responseStoreRef.current[responseIndex];
        if (!responseText) return;
        if (action === 'speak') {
          onSpeakResponse(responseText);
        } else if (action === 'copy') {
          void onCopyResponse(responseText);
        }
        return;
      }

      const wordButton = target.closest('[data-click-word]') as HTMLElement | null;
      const wordData = wordButton?.getAttribute('data-click-word');
      if (!wordData || useClickToSpeech !== 'Y') return;
      event.preventDefault();
      const clickedWord = decodeURIComponent(wordData);
      onClickSpeechWord(clickedWord);
    };

    logElement.addEventListener('click', handleWordClick);
    return () => {
      logElement.removeEventListener('click', handleWordClick);
    };
  }, [
    props.prefix,
    props.index,
    useClickToSpeech,
    onClickSpeechWord,
    onSpeakResponse,
    onCopyResponse,
  ]);

  function onSpeakLastResponse(): void {
    if (speaking) {
      cancel();
      return;
    }
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
  function loadConversationHistory(): ConversationTurn[] {
    const raw = localStorage.getItem(conversationHistoryKey);
    if (!raw) {
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed
        .filter((item: unknown): item is ConversationTurn =>
          Boolean(
            item &&
            typeof item === 'object' &&
            typeof (item as ConversationTurn).question === 'string' &&
            typeof (item as ConversationTurn).response === 'string' &&
            ((item as ConversationTurn).modelName === undefined ||
              typeof (item as ConversationTurn).modelName === 'string'),
          ),
        )
        .slice(-MAX_HISTORY_TURNS);
    } catch {
      return [];
    }
  }
  function saveConversationHistory(turns: ConversationTurn[]): void {
    localStorage.setItem(conversationHistoryKey, JSON.stringify(turns.slice(-MAX_HISTORY_TURNS)));
  }
  function appendConversationTurn(question: string, response: string, modelName?: string): void {
    const nextTurns = [...historyTurnsRef.current, { question, response, modelName }].slice(
      -MAX_HISTORY_TURNS,
    );
    historyTurnsRef.current = nextTurns;
    saveConversationHistory(nextTurns);
  }
  function renderConversationHistory(turns: ConversationTurn[]): void {
    let logElement = document.getElementById(`response-ai-${props.prefix}${props.index}`);
    if (!logElement) return;
    logElement.innerHTML = '';
    questionStoreRef.current = [];
    responseStoreRef.current = [];
    turns.forEach((turn) => {
      const questionEntry = document.createElement('div');
      questionEntry.innerHTML = buildQuestionLogHtml(turn.question);
      logElement.appendChild(questionEntry);

      const responseEntry = document.createElement('div');
      responseEntry.innerHTML = buildResponseLogHtml(turn.response, turn.modelName);
      logElement.appendChild(responseEntry);
    });
    logElement.scrollTop = logElement.scrollHeight;
  }
  function clearLog(): void {
    let logElement = document.getElementById(`response-ai-${props.prefix}${props.index}`);
    if (logElement) logElement.innerHTML = '';
    historyTurnsRef.current = [];
    questionStoreRef.current = [];
    responseStoreRef.current = [];
    localStorage.removeItem(conversationHistoryKey);
  }
  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>, promVal: string): void {
    if (e.key === 'Enter' && e.shiftKey) {
      console.log('Shift + Enter detected');
    } else if (e.key === 'Enter') {
      askDec(promVal);
    }
  }

  function isMarkdownTableLine(line: string): boolean {
    const trimmed = line.trim();
    return (trimmed.match(/\|/g) || []).length >= 2;
  }

  function isMarkdownTableSeparator(line: string): boolean {
    const trimmed = line.trim();
    return /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(trimmed);
  }

  function parseMarkdownTableCells(line: string): string[] {
    const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
    return trimmed.split('|').map((cell) => cell.trim());
  }

  function hasMarkdownTable(input: string): boolean {
    const lines = input.replace(/\r\n/g, '\n').split('\n');
    for (let i = 0; i < lines.length - 1; i++) {
      if (isMarkdownTableLine(lines[i]) && isMarkdownTableSeparator(lines[i + 1])) {
        return true;
      }
    }
    return false;
  }

  function buildMarkdownTableHtml(headers: string[], rows: string[][]): string {
    const safeHeaders = headers.map((header) => header || '&nbsp;');
    const headHtml = safeHeaders
      .map(
        (header) =>
          `<th style="border:1px solid #5f5f5f;padding:6px;background:var(--color-dark-surface-alt);color:var(--color-white);">${header}</th>`,
      )
      .join('');
    const bodyHtml = rows
      .map((row) => {
        const normalizedRow = Array.from(
          { length: safeHeaders.length },
          (_, index) => row[index] || '',
        );
        return `<tr>${normalizedRow
          .map(
            (cell) =>
              `<td style="border:1px solid #5f5f5f;padding:6px;vertical-align:top;">${cell || '&nbsp;'}</td>`,
          )
          .join('')}</tr>`;
      })
      .join('');
    return `<div class="ai-response-table-wrap" style="overflow:auto;margin-top:6px;"><table class="ai-response-table" style="width:100%;border-collapse:collapse;font-size:12px;"><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
  }

  function convertMarkdownTablesInHtml(input: string): string {
    const lines = input.split('<br/>');
    const output: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const current = lines[i];
      const next = lines[i + 1];
      if (!next || !isMarkdownTableLine(current) || !isMarkdownTableSeparator(next)) {
        output.push(current);
        continue;
      }

      const headers = parseMarkdownTableCells(current);
      const rows: string[][] = [];
      i += 2;
      while (
        i < lines.length &&
        isMarkdownTableLine(lines[i]) &&
        !isMarkdownTableSeparator(lines[i])
      ) {
        rows.push(parseMarkdownTableCells(lines[i]));
        i++;
      }
      i -= 1;
      output.push(buildMarkdownTableHtml(headers, rows));
    }

    return output.join('<br/>');
  }

  function fomatRawResponse(input: string): string {
    input = input.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>'); // ** -> <b>
    // input = input.replaceAll(`\n`, '<br/>');
    input = replaceNewlinesExceptInTags(input, ['pre']);
    input = input.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); // ** -> <b>
    input = input.replaceAll(`<br/>* `, '<br/>👉');
    input = input.replaceAll(`<br/>### `, '<br/>✅');
    input = input.replaceAll(`<br/>## `, '<br/>📌');
    input = input.replace(/\*(.*?)\*/g, '<p>$1</p>');
    input = input.replace(`<br/>1. `, '<br/>1️⃣ ');
    input = input.replace(`<br/>2. `, '<br/>2️⃣ ');
    input = input.replace(`<br/>3. `, '<br/>3️⃣ ');
    input = input.replace(`<br/>4. `, '<br/>4️⃣ ');
    input = input.replace(`<br/>5. `, '<br/>5️⃣ ');
    input = input.replace(`<br/>6. `, '<br/>6️⃣ ');
    input = input.replace(`<br/>7. `, '<br/>7️⃣ ');
    input = input.replace(`<br/>8. `, '<br/>8️⃣ ');
    input = input.replace(`<br/>9. `, '<br/>9️⃣ ');
    input = input.replace(`<br/>10. `, '<br/>🔟 ');
    input = convertMarkdownTablesInHtml(input);
    // input = input.replace(`<p>$1</p>`, '');

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
    <div className="ai-board">
      <div
        className="ai-board-header width-100 inline"
        onClick={() => toggleCollapse(`gemini-${props.prefix}${props.index}`)}
      >
        {props.title ?? `Instance ${props.index + 1}`}
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
        {props.isMini && (
          <input className="common-btn" onClick={() => reloadMini()} type="submit" value="Curr" />
        )}
        {props.isMini && (
          <input
            className="common-btn"
            onClick={() => specSentAIMini(props.lastSentence || '')}
            type="submit"
            value="Last"
          />
        )}
      </div>
      <div
        className="ai-board-shell collapse-content bolder"
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
          className="response-ai ai-response-panel"
        ></div>
        <br />
        <textarea
          id={`prompt-${props.prefix}${props.index}`}
          className="ai-promt"
          rows={isPromptExpanded ? 10 : 3}
          style={
            {
              // marginLeft: '5px',
              // marginRight: '5px',
            }
          }
          value={prompt}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
          placeholder=""
          onKeyDown={(e) => handleKeyDown(e, prompt)}
        />
        <br />
        <VoiceToText setText={setPrompt} index={props.index}></VoiceToText>
        <button onClick={() => askDec(prompt)} className="common-btn">
          Send
        </button>
        <button onClick={() => setIsPromptExpanded((prev) => !prev)} className="common-btn">
          {isPromptExpanded ? 'Collapse' : 'Expand'}
        </button>
        <div
          className="common-toggle"
          onClick={() => toggleCollapse(`config-${props.prefix}${props.index}`)}
        >
          {/* <FaCog /> */}Config
        </div>

        <div
          className="collapse-content ui-sub-panel ai-config-panel"
          id={`config-${props.prefix}${props.index}`}
        >
          <button onClick={() => clearLog()} className="common-btn">
            Clear
          </button>

          <select
            className="common-input"
            value={model.value}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setModel(resolveModel(e.target.value));
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
            className="common-input"
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
            className="common-input"
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
            className="common-input"
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
            className="common-input"
            type="text"
            value={gemKey || ''}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setGemKey(event.target.value);
            }}
            placeholder="GEM"
          />
          <input
            className="common-input"
            type="text"
            value={gptKey || ''}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setGptKey(event.target.value);
            }}
            placeholder="GPT"
          />
          <input
            className="common-input"
            type="text"
            value={githubKey || ''}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setGithubKey(event.target.value);
            }}
            placeholder="GITHUB"
          />
          <input
            className="common-input"
            type="text"
            value={openRouterKey || ''}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setOpenRouterKey(event.target.value);
            }}
            placeholder="OPENROUTER"
          />
          <br />
          <textarea
            className="ai-promt"
            rows={3}
            value={sysPrompt}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setSysPrompt(e.target.value)}
            // placeholder="Sys promt"
          />
        </div>
        <div
          className="common-toggle"
          onClick={() => toggleCollapse(`save-sheet-${props.prefix}${props.index}`)}
        >
          {/* <FaSave /> */} Data
        </div>
        <div
          className="collapse-content ui-sub-panel ai-data-panel"
          id={`save-sheet-${props.prefix}${props.index}`}
        >
          <SheetDataEditor value1={value1} value2={value2} />
        </div>
        {isSpeakEnabled && (
          <div
            className="common-toggle"
            onClick={() => toggleCollapse(`voice-config-${props.prefix}${props.index}`)}
          >
            {/* <FaVolumeUp /> */}Speak
          </div>
        )}
        {isSpeakEnabled && (
          <div
            className="collapse-content ui-sub-panel ai-voice-panel"
            id={`voice-config-${props.prefix}${props.index}`}
          >
            <button onClick={() => onSpeakLastResponse()} className="common-btn ">
              {speaking ? 'Stop' : 'Speak'}
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
                  className="common-btn"
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
