/**
 * translator.ts – interchangeable translation providers with automatic fallback.
 *
 * translateText('hello') tries the providers in the user's order (StickyConfig > Translate):
 *   - each provider gets a timeout (AbortController)
 *   - an error / timeout / junk answer -> next provider
 *   - a provider failing FAIL_LIMIT times in a row is skipped for COOLDOWN_MS (circuit breaker)
 *   - results are cached in localStorage (subtitle words repeat a lot)
 *
 * The app is a static export (no server routes) -> every provider must be callable from the browser (CORS).
 */
import { GoogleGenAI } from '@google/genai';
import { KEY_GEMINI_NM } from '@/common/common.js';

export type ProviderId = 'google' | 'gemini' | 'mymemory' | 'lingva';

export interface TranslateResult {
  text: string;
  provider: ProviderId | 'cache';
}

interface TranslateOpts {
  from: string;
  to: string;
  signal: AbortSignal;
}

interface Translator {
  id: ProviderId;
  label: string;
  translate: (text: string, opts: TranslateOpts) => Promise<string>;
}

// ---------------- settings (localStorage) ----------------
export const KEY_TRANSLATE_PROVIDERS = 'translate-providers'; // "google,gemini,mymemory" (order = priority)
export const KEY_TRANSLATE_TIMEOUT = 'translate-timeout-ms';
const KEY_TRANSLATE_CACHE = 'translate-cache-v1';

export const DEFAULT_PROVIDER_ORDER: ProviderId[] = ['google', 'gemini', 'mymemory', 'lingva'];
export const DEFAULT_ENABLED_PROVIDERS: ProviderId[] = ['google', 'gemini', 'mymemory'];
export const DEFAULT_TIMEOUT_MS = 3500;
const GEMINI_TIMEOUT_MIN_MS = 6000; // an LLM needs more time than a translate API
const FAIL_LIMIT = 2;
const COOLDOWN_MS = 5 * 60 * 1000;
const CACHE_MAX = 3000;

const readLS = (key: string): string | null => {
  try {
    return typeof window === 'undefined' ? null : localStorage.getItem(key);
  } catch {
    return null;
  }
};
const writeLS = (key: string, val: string): void => {
  try {
    localStorage.setItem(key, val);
  } catch {
    /* quota / private mode */
  }
};

// ---------------- providers ----------------
const fetchJson = async (url: string, signal: AbortSignal): Promise<unknown> => {
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

/** Google Translate public "gtx" endpoint (unofficial, no key). dt=bd adds dictionary meanings for single words. */
const google: Translator = {
  id: 'google',
  label: 'Google Translate (free, unofficial)',
  translate: async (text, { from, to, signal }) => {
    const url =
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}` +
      `&dt=t&dt=bd&q=${encodeURIComponent(text)}`;
    const data = (await fetchJson(url, signal)) as unknown[];
    const sentences = Array.isArray(data?.[0]) ? (data[0] as unknown[][]) : [];
    const main = sentences.map((s) => (typeof s?.[0] === 'string' ? s[0] : '')).join('').trim();
    // dictionary: [[partOfSpeech, [term1, term2, ...], ...], ...]
    const dict = Array.isArray(data?.[1]) ? (data[1] as unknown[][]) : [];
    const lines = dict
      .filter((d) => typeof d?.[0] === 'string' && Array.isArray(d?.[1]))
      .slice(0, 4)
      .map((d) => `• ${d[0]}: ${(d[1] as string[]).slice(0, 5).join(', ')}`);
    return [main, ...lines].filter(Boolean).join('\n');
  },
};

/** Gemini with the key(s) saved in config (key1;key2) – tries every key. */
const gemini: Translator = {
  id: 'gemini',
  label: 'Gemini AI (uses your Gemini key)',
  translate: async (text, { from, to, signal }) => {
    const keys = (readLS(KEY_GEMINI_NM) || '')
      .split(/[;,]/)
      .map((k) => k.trim())
      .filter(Boolean);
    if (!keys.length) throw new Error('no Gemini key');
    const single = !/\s/.test(text.trim());
    const prompt = single
      ? `Give the ${to === 'vi' ? 'Vietnamese' : to} meaning of the ${from === 'en' ? 'English' : from} word "${text}". ` +
        'Answer ONLY with up to 3 short meanings separated by ", " (most common first), no explanation, no quotes.'
      : `Translate this ${from === 'en' ? 'English' : from} text to ${to === 'vi' ? 'Vietnamese' : to}. ` +
        `Answer ONLY with the translation, no explanation, no quotes:\n${text}`;
    let lastErr: unknown = null;
    for (const apiKey of keys) {
      if (signal.aborted) break;
      try {
        const ai = new GoogleGenAI({ apiKey });
        const res = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: { abortSignal: signal, thinkingConfig: { thinkingBudget: 0 } },
        });
        const out = (res.text || '').trim().replace(/^["']|["']$/g, '');
        if (out) return out;
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error('Gemini failed');
  },
};

/** MyMemory – free ~5k chars/day. NOTE: over quota it still answers HTTP 200 with a warning text. */
const mymemory: Translator = {
  id: 'mymemory',
  label: 'MyMemory (free, daily limit)',
  translate: async (text, { from, to, signal }) => {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
    const data = (await fetchJson(url, signal)) as {
      responseStatus?: number | string;
      responseData?: { translatedText?: string };
    };
    const status = Number(data?.responseStatus);
    const out = data?.responseData?.translatedText?.trim() || '';
    if (status !== 200) throw new Error(`MyMemory status ${data?.responseStatus}: ${out.slice(0, 60)}`);
    if (/MYMEMORY WARNING|QUERY LENGTH LIMIT|INVALID LANGUAGE PAIR/i.test(out)) throw new Error(out.slice(0, 80));
    return out;
  },
};

/** Lingva (open-source Google proxy) – public instances come and go, so try a few. */
const LINGVA_HOSTS = ['https://lingva.ml', 'https://lingva.lunar.icu', 'https://translate.plausibility.cloud'];
const lingva: Translator = {
  id: 'lingva',
  label: 'Lingva (free, public servers)',
  translate: async (text, { from, to, signal }) => {
    let lastErr: unknown = null;
    for (const host of LINGVA_HOSTS) {
      if (signal.aborted) break;
      try {
        const data = (await fetchJson(`${host}/api/v1/${from}/${to}/${encodeURIComponent(text)}`, signal)) as {
          translation?: string;
        };
        const out = data?.translation?.trim();
        if (out) return out;
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error('Lingva failed');
  },
};

export const PROVIDERS: Record<ProviderId, Translator> = { google, gemini, mymemory, lingva };

// ---------------- settings helpers (used by StickyConfig) ----------------
export interface ProviderSetting {
  id: ProviderId;
  enabled: boolean;
}

/** full list in priority order; "google,!lingva" style: a leading "!" = disabled */
export const getProviderSettings = (): ProviderSetting[] => {
  const raw = readLS(KEY_TRANSLATE_PROVIDERS);
  const seen = new Set<ProviderId>();
  const list: ProviderSetting[] = [];
  (raw ?? '').split(',').forEach((token) => {
    const t = token.trim();
    const enabled = !t.startsWith('!');
    const id = t.replace(/^!/, '') as ProviderId;
    if (PROVIDERS[id] && !seen.has(id)) {
      seen.add(id);
      list.push({ id, enabled });
    }
  });
  // providers not in the saved setting (first run or added later) -> append with their default state
  DEFAULT_PROVIDER_ORDER.forEach((id) => {
    if (!seen.has(id)) list.push({ id, enabled: DEFAULT_ENABLED_PROVIDERS.includes(id) });
  });
  return list;
};

export const saveProviderSettings = (list: ProviderSetting[]): void => {
  writeLS(KEY_TRANSLATE_PROVIDERS, list.map((p) => (p.enabled ? p.id : `!${p.id}`)).join(','));
};

export const getTranslateTimeout = (): number => {
  const n = Number(readLS(KEY_TRANSLATE_TIMEOUT));
  return n >= 1000 && n <= 20000 ? n : DEFAULT_TIMEOUT_MS;
};
export const saveTranslateTimeout = (ms: number): void => writeLS(KEY_TRANSLATE_TIMEOUT, String(ms));

// ---------------- cache ----------------
type CacheMap = Record<string, string>;
let cacheMem: CacheMap | null = null;
const loadCache = (): CacheMap => {
  if (cacheMem) return cacheMem;
  try {
    cacheMem = JSON.parse(readLS(KEY_TRANSLATE_CACHE) || '{}') as CacheMap;
  } catch {
    cacheMem = {};
  }
  return cacheMem;
};
const saveCache = (key: string, val: string): void => {
  const cache = loadCache();
  delete cache[key]; // re-insert -> newest at the end (insertion order = age)
  cache[key] = val;
  const keys = Object.keys(cache);
  if (keys.length > CACHE_MAX) keys.slice(0, keys.length - CACHE_MAX).forEach((k) => delete cache[k]);
  writeLS(KEY_TRANSLATE_CACHE, JSON.stringify(cache));
};
export const getTranslateCacheSize = (): number => Object.keys(loadCache()).length;
export const clearTranslateCache = (): void => {
  cacheMem = {};
  writeLS(KEY_TRANSLATE_CACHE, '{}');
};

// ---------------- circuit breaker ----------------
const health: Partial<Record<ProviderId, { fails: number; downUntil: number }>> = {};
const isDown = (id: ProviderId): boolean => (health[id]?.downUntil ?? 0) > Date.now();
const markOk = (id: ProviderId): void => {
  health[id] = { fails: 0, downUntil: 0 };
};
const markFail = (id: ProviderId): void => {
  const h = health[id] ?? { fails: 0, downUntil: 0 };
  h.fails += 1;
  if (h.fails >= FAIL_LIMIT) {
    h.downUntil = Date.now() + COOLDOWN_MS;
    h.fails = 0;
  }
  health[id] = h;
};
/** seconds until each skipped provider is retried (for the config UI) */
export const getProviderDownSeconds = (): Partial<Record<ProviderId, number>> => {
  const out: Partial<Record<ProviderId, number>> = {};
  (Object.keys(health) as ProviderId[]).forEach((id) => {
    const left = (health[id]?.downUntil ?? 0) - Date.now();
    if (left > 0) out[id] = Math.ceil(left / 1000);
  });
  return out;
};
export const resetProviderHealth = (): void => {
  (Object.keys(health) as ProviderId[]).forEach((id) => delete health[id]);
};

// ---------------- main API ----------------
const withTimeout = async <T>(fn: (signal: AbortSignal) => Promise<T>, ms: number, outer?: AbortSignal): Promise<T> => {
  const ctrl = new AbortController();
  const onOuterAbort = (): void => ctrl.abort();
  outer?.addEventListener('abort', onOuterAbort);
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fn(ctrl.signal);
  } finally {
    clearTimeout(timer);
    outer?.removeEventListener('abort', onOuterAbort);
  }
};

const normalize = (s: string): string => s.trim().toLowerCase().replace(/\s+/g, ' ');

/**
 * Translate `text` (default English -> Vietnamese) with automatic provider fallback.
 * Throws only when every enabled provider failed.
 */
export const translateText = async (
  text: string,
  { from = 'en', to = 'vi', signal }: { from?: string; to?: string; signal?: AbortSignal } = {},
): Promise<TranslateResult> => {
  const input = text.trim();
  if (!input) throw new Error('empty text');
  const cacheKey = `${from}|${to}|${normalize(input)}`;
  const cached = loadCache()[cacheKey];
  if (cached) return { text: cached, provider: 'cache' };

  const enabled = getProviderSettings().filter((p) => p.enabled);
  // providers in cooldown go last (still tried if everything else fails)
  const order = [...enabled.filter((p) => !isDown(p.id)), ...enabled.filter((p) => isDown(p.id))];
  const timeout = getTranslateTimeout();
  const errors: string[] = [];
  let weak: TranslateResult | null = null; // answer identical to the input (maybe a name / "OK") – use only as last resort

  for (const { id } of order) {
    if (signal?.aborted) throw new Error('aborted');
    const provider = PROVIDERS[id];
    try {
      const ms = id === 'gemini' ? Math.max(timeout, GEMINI_TIMEOUT_MIN_MS) : timeout;
      const out = (await withTimeout((s) => provider.translate(input, { from, to, signal: s }), ms, signal)).trim();
      if (!out) throw new Error('empty answer');
      markOk(id);
      if (normalize(out) === normalize(input)) {
        weak = weak ?? { text: out, provider: id };
        continue;
      }
      saveCache(cacheKey, out);
      return { text: out, provider: id };
    } catch (err) {
      if (signal?.aborted) throw new Error('aborted');
      markFail(id);
      const msg = (err as Error)?.name === 'AbortError' ? 'timeout' : (err as Error)?.message || String(err);
      errors.push(`${id}: ${msg}`);
    }
  }
  if (weak) return weak;
  throw new Error(errors.length ? errors.join(' | ') : 'no translate provider enabled');
};
