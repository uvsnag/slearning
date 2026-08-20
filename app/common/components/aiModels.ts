export const TP_GEN = 1;
export const TP_GITHUB = 3;
export const TP_OPENROUTER = 4;

export interface ModelAI {
  value: string;
  name: string;
  type: number;
}

export const MODEL_AI: ModelAI[] = [
  { value: 'gemini-2.5-flash', name: 'gemini-2.5-flash', type: TP_GEN },
  { value: 'gemini-3.1-flash-lite', name: 'gemini-3.1-flash-lite', type: TP_GEN },
  { value: 'openai/gpt-4.1', name: 'github/gpt-4.1', type: TP_GITHUB },
  // { value: 'openai/gpt-4o-mini', name: 'openrouter/gpt-4o-mini', type: TP_OPENROUTER },
  // {
  //   value: 'deepseek/deepseek-chat-v3-0324',
  //   name: 'openrouter/deepseek-v3-0324',
  //   type: TP_OPENROUTER,
  // },
  { value: 'z-ai/glm-5.2:free', name: 'openrouter/glm-5.2 (free)', type: TP_OPENROUTER },
  {
    value: 'google/gemma-4-31b-it:free',
    name: 'openrouter/gemma-4-31b (free)',
    type: TP_OPENROUTER,
  },
];

export const KEY_DISABLED_AI_MODELS = 'disabled-ai-models';
export const AI_MODEL_CONFIG_EVENT = 'ai-model-config-changed';

export function modelId(model: ModelAI): string {
  return `${model.value}::${model.type}`;
}

export function getDisabledModelIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY_DISABLED_AI_MODELS) || '[]');
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

export function setModelDisabled(id: string, disabled: boolean): string[] {
  const next = getDisabledModelIds().filter((v) => v !== id);
  if (disabled) {
    next.push(id);
  }
  localStorage.setItem(KEY_DISABLED_AI_MODELS, JSON.stringify(next));
  window.dispatchEvent(new Event(AI_MODEL_CONFIG_EVENT));
  return next;
}

// Never returns an empty list: if every model is disabled, fall back to the full list.
export function getEnabledModels(): ModelAI[] {
  const disabled = new Set(getDisabledModelIds());
  const enabled = MODEL_AI.filter((m) => !disabled.has(modelId(m)));
  return enabled.length > 0 ? enabled : MODEL_AI;
}
