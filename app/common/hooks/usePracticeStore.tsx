'use client';

import { useReducer, useEffect, useCallback, createContext, useContext, Dispatch } from 'react';
import type { ReactNode } from 'react';
import _ from 'lodash';
import { DataItem, getDataFromExcel } from '@/app/common/hooks/useSheetData';
import { useSpeechSynthesis } from '@/app/common/hooks/useSpeechSynthesis';

// ── Local-storage keys ──────────────────────────────────
export const LS_SHEET = 'practice-sheet';
export const LS_VOICE_INDEX = 'practice-voice-index';
export const LS_RATE = 'practice-rate';
export const LS_VOLUME = 'practice-volume';

// ── State shape ─────────────────────────────────────────
export interface PracticeState {
  sheet: string;
  oderRandomS: string;
  voiceIndex: number;
  voiceIndexVie: number;
  rate: number;
  volume: number;
  items: DataItem[];
  voices: SpeechSynthesisVoice[];
}

// ── Actions ─────────────────────────────────────────────
export type PracticeAction =
  | { type: 'SET_SHEET'; payload: string }
  | { type: 'SET_ORDER'; payload: string }
  | { type: 'SET_VOICE_INDEX'; payload: number }
  | { type: 'SET_VOICE_INDEX_VIE'; payload: number }
  | { type: 'SET_RATE'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'SET_ITEMS'; payload: DataItem[] }
  | { type: 'SET_VOICES'; payload: SpeechSynthesisVoice[] }
  | { type: 'REMOVE_ITEM'; payload: string }; // remove by eng

// ── Helpers ─────────────────────────────────────────────
function getStoredString(key: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  return localStorage.getItem(key) ?? fallback;
}

function getStoredNumber(key: string, fallback: number): number {
  if (typeof window === 'undefined') return fallback;
  const v = localStorage.getItem(key);
  if (v === null) return fallback;
  const n = Number(v);
  return Number.isNaN(n) ? fallback : n;
}

// ── Reducer ─────────────────────────────────────────────
function practiceReducer(state: PracticeState, action: PracticeAction): PracticeState {
  switch (action.type) {
    case 'SET_SHEET':
      return { ...state, sheet: action.payload };
    case 'SET_ORDER':
      return { ...state, oderRandomS: action.payload };
    case 'SET_VOICE_INDEX':
      return { ...state, voiceIndex: action.payload };
    case 'SET_VOICE_INDEX_VIE':
      return { ...state, voiceIndexVie: action.payload };
    case 'SET_RATE':
      return { ...state, rate: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    case 'SET_VOICES':
      return { ...state, voices: action.payload };
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.eng !== action.payload) };
    default:
      return state;
  }
}

// ── Context ─────────────────────────────────────────────
export interface UsePracticeStore {
  state: PracticeState;
  dispatch: Dispatch<PracticeAction>;
  /** Convenience: load sheet data from Google Sheets */
  reloadSheet: () => void;
}

const PracticeStoreContext = createContext<UsePracticeStore | null>(null);

/**
 * Provider component – renders a single store instance and shares it
 * via React Context to the entire component tree below.
 * Place this in `layout.tsx` so every page reads from the SAME store.
 */
export function PracticeStoreProvider({
  defaultSheet = 'AUTO!Q2:S500',
  children,
}: {
  defaultSheet?: string;
  children: ReactNode;
}) {
  const store = usePracticeStoreInternal(defaultSheet);

  return <PracticeStoreContext.Provider value={store}>{children}</PracticeStoreContext.Provider>;
}

/**
 * Consumer hook – reads the shared store from Context.
 * Must be used inside a `<PracticeStoreProvider>`.
 */
export function usePracticeContext(): UsePracticeStore {
  const ctx = useContext(PracticeStoreContext);
  if (!ctx) {
    throw new Error('usePracticeContext must be used inside <PracticeStoreProvider>');
  }
  return ctx;
}

// ── Internal hook (creates the actual store) ────────────
function usePracticeStoreInternal(defaultSheet: string): UsePracticeStore {
  const initialState: PracticeState = {
    sheet: getStoredString(LS_SHEET, defaultSheet),
    oderRandomS: 'random',
    voiceIndex: getStoredNumber(LS_VOICE_INDEX, 0),
    voiceIndexVie: 0,
    rate: getStoredNumber(LS_RATE, 0.9),
    volume: getStoredNumber(LS_VOLUME, 1),
    items: [],
    voices: [],
  };

  const [state, dispatch] = useReducer(practiceReducer, initialState);
  const { voices: browserVoices } = useSpeechSynthesis();

  // Sync browser voices into the store & auto-pick english/vietnamese defaults
  useEffect(() => {
    if (browserVoices.length === 0) return;
    dispatch({ type: 'SET_VOICES', payload: browserVoices });

    // Only set defaults if no stored voice
    const storedVoice = localStorage.getItem(LS_VOICE_INDEX);
    if (storedVoice === null) {
      browserVoices.forEach((v: SpeechSynthesisVoice, idx: number) => {
        if (v.lang.includes('vi-VN')) {
          dispatch({ type: 'SET_VOICE_INDEX_VIE', payload: idx });
        }
        if (v.lang.includes('en-US')) {
          dispatch({ type: 'SET_VOICE_INDEX', payload: idx });
        }
      });
    }
  }, [browserVoices]);

  // Load sheet data whenever sheet changes
  useEffect(() => {
    if (!_.isEmpty(state.sheet)) {
      getDataFromExcel(state.sheet, (data: DataItem[]) => {
        dispatch({ type: 'SET_ITEMS', payload: data });
      });
    }
  }, [state.sheet]);

  // Persist sheet to localStorage
  useEffect(() => {
    if (state.sheet) {
      localStorage.setItem(LS_SHEET, state.sheet);
    }
  }, [state.sheet]);

  // Persist voiceIndex to localStorage
  useEffect(() => {
    localStorage.setItem(LS_VOICE_INDEX, String(state.voiceIndex));
  }, [state.voiceIndex]);

  // Persist rate to localStorage
  useEffect(() => {
    localStorage.setItem(LS_RATE, String(state.rate));
  }, [state.rate]);

  // Persist volume to localStorage
  useEffect(() => {
    localStorage.setItem(LS_VOLUME, String(state.volume));
  }, [state.volume]);

  const reloadSheet = useCallback(() => {
    if (!_.isEmpty(state.sheet)) {
      getDataFromExcel(state.sheet, (data: DataItem[]) => {
        dispatch({ type: 'SET_ITEMS', payload: data });
      });
    }
  }, [state.sheet]);

  return { state, dispatch, reloadSheet };
}

/** Maps PracticeState → SpeechConfig shape expected by speakText */
export function toSpeechConfig(s: PracticeState) {
  return { voice: s.voiceIndex, rate: s.rate, volume: s.volume };
}
