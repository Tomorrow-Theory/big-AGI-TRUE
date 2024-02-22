import { create } from 'zustand';
import { shallow } from 'zustand/shallow';
import { persist } from 'zustand/middleware';

import type { ModelVendorId } from './vendors/vendors.registry';
import type { SourceSetupOpenRouter } from './vendors/openrouter/openrouter.vendor';


/**
 * Large Language Model - description and configuration (data object, stored)
 */
export interface DLLM<TSourceSetup = unknown, TLLMOptions = unknown> {
  id: DLLMId;
  label: string;
  created: number | 0;
  updated?: number | 0;
  description: string;
  tags: string[]; // UNUSED for now
  // modelcaps: DModelCapability[];
  contextTokens: number | null;     // null: must assume it's unknown
  maxOutputTokens: number | null;   // null: must assume it's unknown
  hidden: boolean; // hidden from Chat model UI selectors

  // temporary special flags - not graduated yet
  isFree: boolean; // model is free to use

  // llm -> source
  sId: DModelSourceId;
  _source: DModelSource<TSourceSetup>;

  // llm-specific
  options: { llmRef: string } & Partial<TLLMOptions>;
}

export type DLLMId = string;

// export type DModelCapability =
//   | 'input-text'
//   | 'input-image-data'
//   | 'input-multipart'
//   | 'output-text'
//   | 'output-function'
//   | 'output-image-data'
//   | 'if-chat'
//   | 'if-fast-chat'
//   ;

// Model interfaces (chat, and function calls) - here as a preview, will be used more broadly in the future
export const LLM_IF_OAI_Chat = 'oai-chat';
export const LLM_IF_OAI_Vision = 'oai-vision';
export const LLM_IF_OAI_Fn = 'oai-fn';
export const LLM_IF_OAI_Complete = 'oai-complete';


/**
 * Model Server - configured to be a unique origin of models (data object, stored)
 */
export interface DModelSource<TSourceSetup = unknown> {
  id: DModelSourceId;
  label: string;

  // source -> vendor
  vId: ModelVendorId;

  // source-specific
  setup: Partial<TSourceSetup>;
}

export type DModelSourceId = string;


/// ModelsStore - a store for configured LLMs and configured Sources

interface ModelsData {
  llms: DLLM[];
  sources: DModelSource[];
  chatLLMId: DLLMId | null;
  fastLLMId: DLLMId | null;
  funcLLMId: DLLMId | null;
}

interface ModelsActions {
  setLLMs: (llms: DLLM[], sourceId: DModelSourceId, deleteExpiredVendorLlms: boolean, keepUserEdits: boolean) => void;
  removeLLM: (id: DLLMId) => void;
  updateLLM: (id: DLLMId, partial: Partial<DLLM>) => void;
  updateLLMOptions: <TLLMOptions>(id: DLLMId, partialOptions: Partial<TLLMOptions>) => void;

  addSource: (source: DModelSource) => void;
  removeSource: (id: DModelSourceId) => void;
  updateSourceSetup: <TSourceSetup>(id: DModelSourceId, partialSetup: Partial<TSourceSetup>) => void;

  setChatLLMId: (id: DLLMId | null) => void;
  setFastLLMId: (id: DLLMId | null) => void;
  setFuncLLMId: (id: DLLMId | null) => void;

  // special
  setOpenRoutersKey: (key: string) => void;
}

type LlmsStore = ModelsData & ModelsActions;

export const useModelsStore = create<LlmsStore>()(
  persist(
    (set) => ({
      _source: null,
      llms: [
        {
          "id": "togetherai-Qwen/Qwen1.5-72B-Chat",
          "label": "Qwen1.5 72B 🇨🇳",
          "created": 1707133018,
          "updated": 1707133018,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": false,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Qwen/Qwen1.5-72B-Chat",
          },
          "_source": {
            "id": "togetherai",
            "label": "Together AI",
            "vId": "togetherai",
            "setup": {
              "togetherKey": "",
              "togetherHost": "https://api.together.xyz",
              "togetherFreeTrial": false
            }
          }
        },
        {
          "id": "perplexity-llama-2-70b-chat",
          "label": "Llama 2 | Meta ⓕ",
          "created": 0,
          "updated": 0,
          "description": "Llama 2 is a collection of pretrained and fine-tuned generative text models.",
          "tags": [],
          "contextTokens": 4096,
          "maxOutputTokens": 2048,
          "hidden": false,
          "isFree": false,
          "sId": "perplexity",
          "options": {
            "llmRef": "llama-2-70b-chat",
          },
          "_source": {
            "id": "perplexity",
            "label": "Perplexity",
            "vId": "perplexity",
            "setup": {
              "perplexityKey": ""
            }
          }
        },
        {
          "id": "perplexity-mixtral-8x7b-instruct",
          "label": "Mixtral 8x7B 🇫🇷",
          "created": 0,
          "updated": 0,
          "description": "The Mixtral-8x7B Large Language Model (LLM) is a pretrained generative Sparse Mixture of Experts.",
          "tags": [],
          "contextTokens": 4096,
          "maxOutputTokens": 2048,
          "hidden": false,
          "isFree": false,
          "sId": "perplexity",
          "options": {
            "llmRef": "mixtral-8x7b-instruct",
          },
          "_source": {
            "id": "perplexity",
            "label": "Perplexity",
            "vId": "perplexity",
            "setup": {
              "perplexityKey": ""
            }
          }
        },
        {
          "id": "perplexity-pplx-8x7b-online",
          "label": "Perplexity 8x7B | Recherche Internet",
          "created": 0,
          "updated": 0,
          "description": "Perplexity 8x7B Online",
          "tags": [],
          "contextTokens": 4096,
          "maxOutputTokens": 2048,
          "hidden": false,
          "isFree": false,
          "sId": "perplexity",
          "options": {
            "llmRef": "pplx-8x7b-online",
          },
          "_source": {
            "id": "perplexity",
            "label": "Perplexity",
            "vId": "perplexity",
            "setup": {
              "perplexityKey": ""
            }
          }
        },
        {
          "id": "openai-gpt-4-0125-preview",
          "label": "GPT-4",
          "created": 1706037612,
          "updated": 1706037612,
          "description": "The latest GPT-4 model intended to reduce cases of “laziness” where the model doesn’t complete a task.",
          "tags": [],
          "contextTokens": 128000,
          "maxOutputTokens": 4096,
          "hidden": false,
          "isFree": false,
          "sId": "openai",
          "options": {
            "llmRef": "gpt-4-0125-preview",
          },
          "_source": {
            "id": "openai",
            "label": "OpenAI",
            "vId": "openai",
            "setup": {}
          }
        },
        {
          "id": "openai-gpt-3.5-turbo-0125",
          "label": "GPT-3.5",
          "created": 1706048358,
          "updated": 1706048358,
          "description": "The latest GPT-3.5 Turbo model with higher accuracy at responding in requested formats and a fix for a bug which caused a text encoding issue for non-English language function calls.",
          "tags": [],
          "contextTokens": 16385,
          "maxOutputTokens": 4096,
          "hidden": false,
          "isFree": false,
          "sId": "openai",
          "options": {
            "llmRef": "gpt-3.5-turbo-0125",
          },
          "_source": {
            "id": "openai",
            "label": "OpenAI",
            "vId": "openai",
            "setup": {}
          }
        },
        {
          "id": "anthropic-claude-2.1",
          "label": "Claude 2.1",
          "created": 1700524800,
          "updated": 0,
          "description": "Superior performance on tasks that require complex reasoning, with reduced model hallucination rates",
          "tags": [],
          "contextTokens": 200000,
          "maxOutputTokens": 100000,
          "hidden": false,
          "isFree": false,
          "sId": "anthropic",
          "options": {
            "llmRef": "claude-2.1",
          },
          "_source": {
            "id": "anthropic",
            "label": "Anthropic (Amazon)",
            "vId": "anthropic",
            "setup": {}
          }
        },
        {
          "id": "azure-A-SAFE",
          "label": "A | GPT-4 | PRIVATE | Default 🌟",
          "created": 1707754409,
          "updated": 1707754409,
          "description": "Insightful, big thinker, slower, pricey",
          "tags": [],
          "contextTokens": 8192,
          "maxOutputTokens": 4096,
          "hidden": false,
          "isFree": false,
          "sId": "azure",
          "options": {
            "llmRef": "A-SAFE",
          },
          "_source": {
            "id": "azure",
            "label": "Tomorrow Theory private cloud (Azure)",
            "vId": "azure",
            "setup": {}
          }
        },
        {
          "id": "azure-B-SAFE",
          "label": "B | GPT-4 | PRIVATE",
          "created": 1707754419,
          "updated": 1707754419,
          "description": "Insightful, big thinker, slower, pricey",
          "tags": [],
          "contextTokens": 8192,
          "maxOutputTokens": 4096,
          "hidden": false,
          "isFree": false,
          "sId": "azure",
          "options": {
            "llmRef": "B-SAFE",
          },
          "_source": {
            "id": "azure",
            "label": "Tomorrow Theory private cloud (Azure)",
            "vId": "azure",
            "setup": {}
          }
        },
        {
          "id": "azure-C-SAFE",
          "label": "C | GPT-4 | PRIVATE",
          "created": 1707754429,
          "updated": 1707754429,
          "description": "Largest context window for big problems",
          "tags": [],
          "contextTokens": 32768,
          "maxOutputTokens": 16384,
          "hidden": false,
          "isFree": false,
          "sId": "azure",
          "options": {
            "llmRef": "C-SAFE",
          },
          "_source": {
            "id": "azure",
            "label": "Tomorrow Theory private cloud (Azure)",
            "vId": "azure",
            "setup": {}
          }
        },
        {
          "id": "azure-D-SAFE",
          "label": "D | GPT-4 | PRIVATE",
          "created": 1707754437,
          "updated": 1707754437,
          "description": "Largest context window for big problems",
          "tags": [],
          "contextTokens": 32768,
          "maxOutputTokens": 16384,
          "hidden": false,
          "isFree": false,
          "sId": "azure",
          "options": {
            "llmRef": "D-SAFE",
          },
          "_source": {
            "id": "azure",
            "label": "Tomorrow Theory private cloud (Azure)",
            "vId": "azure",
            "setup": {}
          }
        }
      ],
      sources: [
        {
          "id": "openai",
          "label": "OpenAI",
          "vId": "openai",
          "setup": {}
        },
        {
          "id": "azure",
          "label": "Tomorrow Theory private cloud (Azure)",
          "vId": "azure",
          "setup": {}
        },
        {
          "id": "anthropic",
          "label": "Anthropic (Amazon)",
          "vId": "anthropic",
          "setup": {}
        },
        {
          "id": "perplexity",
          "label": "Perplexity",
          "vId": "perplexity",
          "setup": {
            "perplexityKey": ""
          }
        },
        {
          "id": "togetherai",
          "label": "Together AI",
          "vId": "togetherai",
          "setup": {
            "togetherKey": "",
            "togetherHost": "https://api.together.xyz",
            "togetherFreeTrial": false
          }
        }
      ],
      chatLLMId: "azure-A-SAFE",
      fastLLMId: "azure-A-SAFE",
      funcLLMId: "azure-A-SAFE",

      setChatLLMId: (id: DLLMId | null) =>
        set(state => updateSelectedIds(state.llms, id, state.fastLLMId, state.funcLLMId)),

      setFastLLMId: (id: DLLMId | null) =>
        set(state => updateSelectedIds(state.llms, state.chatLLMId, id, state.funcLLMId)),

      setFuncLLMId: (id: DLLMId | null) =>
        set(state => updateSelectedIds(state.llms, state.chatLLMId, state.fastLLMId, id)),

      // NOTE: make sure to the _source links (sId foreign) are already set before calling this
      setLLMs: (llms: DLLM[], sourceId: DModelSourceId, deleteExpiredVendorLlms: boolean, keepUserEdits: boolean) =>
        set(state => {

          // keep existing model customizations
          if (keepUserEdits) {
            llms = llms.map(llm => {
              const existing = state.llms.find(m => m.id === llm.id);
              return !existing ? llm : {
                ...llm,
                label: existing.label, // keep label
                hidden: existing.hidden, // keep hidden
                options: { ...existing.options, ...llm.options }, // keep custom configurations, but overwrite as the new could have massively improved params
              };
            });
          }

          const otherLlms = deleteExpiredVendorLlms
            ? state.llms.filter(llm => llm.sId !== sourceId)
            : state.llms;

          // replace existing llms with the same id
          const newLlms = [...llms, ...otherLlms.filter(llm => !llms.find(m => m.id === llm.id))];
          return {
            llms: newLlms,
            ...updateSelectedIds(newLlms, state.chatLLMId, state.fastLLMId, state.funcLLMId),
          };
        }),

      removeLLM: (id: DLLMId) =>
        set(state => {
          const newLlms = state.llms.filter(llm => llm.id !== id);
          return {
            llms: newLlms,
            ...updateSelectedIds(newLlms, state.chatLLMId, state.fastLLMId, state.funcLLMId),
          };
        }),

      updateLLM: (id: DLLMId, partial: Partial<DLLM>) =>
        set(state => ({
          llms: state.llms.map((llm: DLLM): DLLM =>
            llm.id === id
              ? { ...llm, ...partial }
              : llm,
          ),
        })),

      updateLLMOptions: <TLLMOptions>(id: DLLMId, partialOptions: Partial<TLLMOptions>) =>
        set(state => ({
          llms: state.llms.map((llm: DLLM): DLLM =>
            llm.id === id
              ? { ...llm, options: { ...llm.options, ...partialOptions } }
              : llm,
          ),
        })),


      addSource: (source: DModelSource) =>
        set(state => {

          // re-number all sources for the given vendor
          let n = 0;
          const sourceVId = source.vId;

          return {
            sources: [...state.sources, source].map(_source =>
              _source.vId != sourceVId
                ? _source
                : {
                  ..._source,
                  label: _source.label.replace(/ #\d+$/, '') + (++n > 1 ? ` #${n}` : ''),
                },
            ),
          };
        }),

      removeSource: (id: DModelSourceId) =>
        set(state => {
          const llms = state.llms.filter(llm => llm.sId !== id);
          return {
            llms,
            sources: state.sources.filter(source => source.id !== id),
            ...updateSelectedIds(llms, state.chatLLMId, state.fastLLMId, state.funcLLMId),
          };
        }),

      updateSourceSetup: <TSourceSetup>(id: DModelSourceId, partialSetup: Partial<TSourceSetup>) =>
        set(state => ({
          sources: state.sources.map((source: DModelSource): DModelSource =>
            source.id === id
              ? { ...source, setup: { ...source.setup, ...partialSetup } }
              : source,
          ),
        })),

      setOpenRoutersKey: (key: string) =>
        set(state => {
          const openRouterSource = state.sources.find(source => source.vId === 'openrouter');
          if (!openRouterSource) return state;
          return {
            sources: state.sources.map(source => source.id === openRouterSource.id
              ? { ...source, setup: { ...source.setup, oaiKey: key satisfies SourceSetupOpenRouter['oaiKey'] } }
              : source),
          };
        }),

    }),
    {
      name: 'app-models',

      /* versioning:
       *  1: adds maxOutputTokens (default to half of contextTokens)
       */
      version: 1,
      migrate: (state: any, fromVersion: number): LlmsStore => {

        // 0 -> 1: add 'maxOutputTokens' where missing
        if (state && fromVersion < 1)
          for (const llm of state.llms)
            if (llm.maxOutputTokens === undefined)
              llm.maxOutputTokens = llm.contextTokens ? Math.round(llm.contextTokens / 2) : null;

        return state;
      },

      // Pre-saving: omit the memory references from the persisted state
      partialize: (state) => ({
        ...state,
        llms: state.llms.map(llm => {
          const { _source, ...rest } = llm;
          return rest;
        }),
      }),

      // Post-loading: re-link the memory references on rehydration
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        state.llms = state.llms.map(llm => {
          const source = state.sources.find(source => source.id === llm.sId);
          if (!source) return null;
          return { ...llm, _source: source };
        }).filter(llm => !!llm) as DLLM[];
      },
    }),
);


export const getChatLLMId = (): DLLMId | null => useModelsStore.getState().chatLLMId;

export const getFastLLMId = (): DLLMId | null => useModelsStore.getState().fastLLMId;

export function findLLMOrThrow<TSourceSetup, TLLMOptions>(llmId: DLLMId): DLLM<TSourceSetup, TLLMOptions> {
  const llm = useModelsStore.getState().llms.find(llm => llm.id === llmId);
  if (!llm) throw new Error(`LLM ${llmId} not found`);
  if (!llm._source) throw new Error(`LLM ${llmId} has no source`);
  return llm as DLLM<TSourceSetup, TLLMOptions>;
}

export function findSourceOrThrow<TSourceSetup>(sourceId: DModelSourceId) {
  const source: DModelSource<TSourceSetup> | undefined = useModelsStore.getState().sources.find(source => source.id === sourceId);
  if (!source) throw new Error(`ModelSource ${sourceId} not found`);
  return source;
}


const modelsKnowledgeMap: { contains: string[], cutoff: string }[] = [
  { contains: ['4-0125', '4-turbo'], cutoff: '2023-12' },
  { contains: ['4-1106', '4-vision'], cutoff: '2023-04' },
  { contains: ['4-0613', '4-0314', '4-32k', '3.5-turbo'], cutoff: '2021-09' },
] as const;

export function getKnowledgeMapCutoff(llmId?: DLLMId): string | null {
  if (llmId)
    for (const { contains, cutoff } of modelsKnowledgeMap)
      if (contains.some(c => llmId.includes(c)))
        return cutoff;
  return null;
}

const defaultChatSuffixPreference = ['gpt-4-0125-preview', 'gpt-4-1106-preview', 'gpt-4-0613', 'gpt-4', 'gpt-4-32k', 'gpt-3.5-turbo'];
const defaultFastSuffixPreference = ['gpt-3.5-turbo-0125', 'gpt-3.5-turbo-1106', 'gpt-3.5-turbo-16k-0613', 'gpt-3.5-turbo-0613', 'gpt-3.5-turbo-16k', 'gpt-3.5-turbo'];
const defaultFuncSuffixPreference = ['gpt-4-0125-preview', 'gpt-4-1106-preview', 'gpt-3.5-turbo-16k-0613', 'gpt-3.5-turbo-0613', 'gpt-4-0613'];

function updateSelectedIds(allLlms: DLLM[], chatLlmId: DLLMId | null, fastLlmId: DLLMId | null, funcLlmId: DLLMId | null): Partial<ModelsData> {
  if (chatLlmId && !allLlms.find(llm => llm.id === chatLlmId)) chatLlmId = null;
  if (!chatLlmId) chatLlmId = findLlmIdBySuffix(allLlms, defaultChatSuffixPreference, true);

  if (fastLlmId && !allLlms.find(llm => llm.id === fastLlmId)) fastLlmId = null;
  if (!fastLlmId) fastLlmId = findLlmIdBySuffix(allLlms, defaultFastSuffixPreference, true);

  if (funcLlmId && !allLlms.find(llm => llm.id === funcLlmId)) funcLlmId = null;
  if (!funcLlmId) funcLlmId = findLlmIdBySuffix(allLlms, defaultFuncSuffixPreference, false);

  return { chatLLMId: chatLlmId, fastLLMId: fastLlmId, funcLLMId: funcLlmId };
}

function findLlmIdBySuffix(llms: DLLM[], suffixes: string[], fallbackToFirst: boolean): DLLMId | null {
  if (!llms?.length) return null;
  for (const suffix of suffixes)
    for (const llm of llms)
      if (llm.id.endsWith(suffix))
        return llm.id;
  if (!fallbackToFirst) return null;

  // otherwise return first that's not hidden
  for (const llm of llms)
    if (!llm.hidden)
      return llm.id;

  // otherwise return first id
  return llms[0].id;
}


/**
 * Current 'Chat' LLM, or null
 */
export function useChatLLM() {
  return useModelsStore(state => {
    const { chatLLMId } = state;
    const chatLLM = chatLLMId ? state.llms.find(llm => llm.id === chatLLMId) ?? null : null;
    return { chatLLM };
  }, shallow);
}

export function getLLMsDebugInfo() {
  const { llms, sources, chatLLMId, fastLLMId, funcLLMId } = useModelsStore.getState();
  return { sources: sources.length, llmsCount: llms.length, chatId: chatLLMId, fastId: fastLLMId, funcId: funcLLMId };
}