import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ModelVendorId } from './vendors/vendors.registry';
import type { SourceSetupOpenRouter } from './vendors/openrouter/openrouter.vendor';


/**
 * Large Language Model - description and configuration (data object, stored)
 */
export interface DLLM<TSourceSetup = unknown, TLLMOptions = unknown> {
  id: DLLMId;

  // editable properties (kept on update, if isEdited)
  label: string;
  created: number | 0;
  updated?: number | 0;
  description: string;
  hidden: boolean;                  // hidden from UI selectors
  isEdited?: boolean;               // user has edited the soft properties

  // hard properties (overwritten on update)
  contextTokens: number | null;     // null: must assume it's unknown
  maxOutputTokens: number | null;   // null: must assume it's unknown
  trainingDataCutoff?: string;      // [v2] 'Apr 2029'
  interfaces: DModelInterfaceV1[];  // [v2] if set, meaning this is the known and comprehensive set of interfaces
  // inputTypes: {                     // [v2] the supported input formats
  //   [key in DModelPartKind]?: {
  //     // maxItemsPerInput?: number;
  //     // maxFileSize?: number; // in bytes
  //     // maxDurationPerInput?: number; // in seconds, for audio and video
  //     // maxPagesPerInput?: number; // for PDF
  //     // encodings?: ('base64' | 'utf-8')[];
  //     mimeTypes?: string[];
  //   }
  // };
  benchmark?: { cbaElo?: number, cbaMmlu?: number }; // [v2] benchmark values
  pricing?: { chatIn?: number, chatOut?: number }; // [v2] cost per million tokens

  // derived properties
  tmpIsFree?: boolean; // model is free to use [temporary, for now], this is a derived property from the pricing
  tmpIsVision?: boolean; // model can take image inputs

  // llm -> source
  sId: DModelSourceId;
  _source: DModelSource<TSourceSetup>;

  // llm-specific
  options: { llmRef: string } & Partial<TLLMOptions>;
}

export type DLLMId = string;

// export type DModelPartKind = 'text' | 'image' | 'audio' | 'video' | 'pdf';

export type DModelInterfaceV1 =
// do not change anything below! those will be persisted in data
  | 'oai-chat'
  | 'oai-chat-json'
  | 'oai-chat-vision'
  | 'oai-chat-fn'
  | 'oai-complete'
// only append below this line
  ;

// Model interfaces (chat, and function calls) - here as a preview, will be used more broadly in the future
export const LLM_IF_OAI_Chat: DModelInterfaceV1 = 'oai-chat';
export const LLM_IF_OAI_Json: DModelInterfaceV1 = 'oai-chat-json';
export const LLM_IF_OAI_Vision: DModelInterfaceV1 = 'oai-chat-vision';
export const LLM_IF_OAI_Fn: DModelInterfaceV1 = 'oai-chat-fn';
export const LLM_IF_OAI_Complete: DModelInterfaceV1 = 'oai-complete';

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
// modelcaps: DModelCapability[];


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
            "llmTemperature": 0.5,
            "llmResponseTokens": null
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
            "llmTemperature": 0.5,
            "llmResponseTokens": null
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
            "llmTemperature": 0.5,
            "llmResponseTokens": null
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
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          },
          "_source": {
            "id": "azure",
            "label": "Tomorrow Theory private cloud (Azure)",
            "vId": "azure",
            "setup": {}
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
            "llmTemperature": 0.5,
            "llmResponseTokens": null
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
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          },
          "_source": {
            "id": "openai",
            "label": "OpenAI",
            "vId": "openai",
            "setup": {}
          }
        },
        {
          "id": "groq-llama2-70b-4096",
          "label": "llama2 70b 4096",
          "created": 1693721698,
          "updated": 1693721698,
          "description": "New Model",
          "tags": [],
          "contextTokens": 32768,
          "maxOutputTokens": 16384,
          "hidden": false,
          "isFree": false,
          "sId": "groq",
          "options": {
            "llmRef": "llama2-70b-4096",
            "llmTemperature": 0.5,
            "llmResponseTokens": 4096
          },
          "_source":  {
            "id": "groq",
            "label": "Groq",
            "vId": "groq",
            "setup": {
              "groqKey": ""
            }
          }
        },
        {
          "id": "groq-mixtral-8x7b-32768",
          "label": "Mixtral 8x7B Instruct v0.1",
          "created": 1693721698,
          "updated": 1693721698,
          "description": "The Mixtral-8x7B Large Language Model (LLM) is a pretrained generative Sparse Mixture of Experts.",
          "tags": [],
          "contextTokens": 32768,
          "maxOutputTokens": 16384,
          "hidden": false,
          "isFree": false,
          "sId": "groq",
          "options": {
            "llmRef": "mixtral-8x7b-32768",
            "llmTemperature": 0.5,
            "llmResponseTokens": 4096
          },
          "_source":  {
            "id": "groq",
            "label": "Groq",
            "vId": "groq",
            "setup": {
              "groqKey": ""
            }
          }
        },
        {
          "id": "perplexity-sonar-medium-online",
          "label": "Sonar Medium Online 🌐",
          "created": 0,
          "updated": 0,
          "description": "Sonar Medium Online",
          "tags": [],
          "contextTokens": 4096,
          "maxOutputTokens": 2048,
          "hidden": false,
          "isFree": false,
          "sId": "perplexity",
          "options": {
            "llmRef": "sonar-medium-online",
            "llmTemperature": 0.5,
            "llmResponseTokens": 512
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
            "llmTemperature": 0.5,
            "llmResponseTokens": null
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
            "llmTemperature": 0.5,
            "llmResponseTokens": null
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
            "llmTemperature": 0.5,
            "llmResponseTokens": null
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
          "id": "groq",
          "label": "Groq",
          "vId": "groq",
          "setup": {
            "groqKey": ""
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
       *  2: large changes on all LLMs, and reset chat/fast/func LLMs
       */
      version: 2,
      migrate: (state: any, fromVersion: number): LlmsStore => {

        // 0 -> 1: add 'maxOutputTokens' where missing
        if (state && fromVersion < 1)
          for (const llm of state.llms)
            if (llm.maxOutputTokens === undefined)
              llm.maxOutputTokens = llm.contextTokens ? Math.round(llm.contextTokens / 2) : null;

        // 1 -> 2: large changes
        if (state && fromVersion < 2) {
          for (const llm of state.llms) {
            delete llm['tags'];
            llm.interfaces = [LLM_IF_OAI_Chat];
            // llm.inputTypes = { 'text': {} };
          }
          state.chatLLMId = null;
          state.fastLLMId = null;
          state.funcLLMId = null;
        }

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

      // Post-loading: re-link the memory references on rehydration, and auto-select the best LLMs if not set
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        state.llms = state.llms.map(llm => {
          const source = state.sources.find(source => source.id === llm.sId);
          if (!source) return null;
          return { ...llm, _source: source };
        }).filter(llm => !!llm) as DLLM[];

        try {
          if (!state.chatLLMId || !state.fastLLMId || !state.funcLLMId)
            Object.assign(state, updateSelectedIds(state.llms, state.chatLLMId, state.fastLLMId, state.funcLLMId));
        } catch (error) {
          console.error('Error in autoPickModels', error);
        }
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


function groupLlmsByVendor(llms: DLLM[]): { vendorId: ModelVendorId, llmsByElo: { id: DLLMId, cbaElo: number | undefined }[] }[] {
  // group all LLMs by vendor
  const grouped = llms.reduce((acc, llm) => {
    if (llm.hidden) return acc;
    const vendorId = llm._source.vId;
    const vendor = acc.find(v => v.vendorId === vendorId);
    if (!vendor) acc.push({ vendorId, llmsByElo: [{ id: llm.id, cbaElo: llm.benchmark?.cbaElo }] });
    else vendor.llmsByElo.push({ id: llm.id, cbaElo: llm.benchmark?.cbaElo });
    return acc;
  }, [] as { vendorId: ModelVendorId, llmsByElo: { id: DLLMId, cbaElo: number | undefined }[] }[]);

  // sort each vendor's LLMs by elo, decreasing
  for (const vendor of grouped)
    vendor.llmsByElo.sort((a, b) => (b.cbaElo ?? -1) - (a.cbaElo ?? -1));

  // sort all vendors by their highest elo, decreasing
  grouped.sort((a, b) => (b.llmsByElo[0].cbaElo ?? -1) - (a.llmsByElo[0].cbaElo ?? -1));
  return grouped;
}


export function updateSelectedIds(allLlms: DLLM[], chatLlmId: DLLMId | null, fastLlmId: DLLMId | null, funcLlmId: DLLMId | null) {

  // the output of groupLlmsByVendor
  let grouped: ReturnType<typeof groupLlmsByVendor> | null = null;

  function cachedGrouped() {
    if (!grouped) grouped = groupLlmsByVendor(allLlms);
    return grouped;
  }

  // the best llm
  if (!chatLlmId || !allLlms.find(llm => llm.id === chatLlmId)) {
    const vendors = cachedGrouped();
    chatLlmId = vendors.length ? vendors[0].llmsByElo[0].id : null;
  }

  // a fast llm (bottom elo of the top vendor ~~ not really a proxy, but not sure which heuristic to use here)
  if (!fastLlmId && !allLlms.find(llm => llm.id === fastLlmId)) {
    const vendors = cachedGrouped();
    fastLlmId = vendors.length
      ? vendors[0].llmsByElo.findLast(llm => llm.cbaElo)?.id // last with ELO
      ?? vendors[0].llmsByElo[vendors[0].llmsByElo.length - 1].id ?? null // last
      : null;
  }

  // a func llm (
  if (!funcLlmId || !allLlms.find(llm => llm.id === funcLlmId))
    funcLlmId = chatLlmId;

  return { chatLLMId: chatLlmId, fastLLMId: fastLlmId, funcLLMId: funcLlmId };
}


/**
 * Current 'Chat' LLM, or null
 */
export function useChatLLM() {
  const chatLLM = useModelsStore(state => state.chatLLMId ? state.llms.find(llm => llm.id === state.chatLLMId) ?? null : null);
  return { chatLLM };
}

export function getLLMsDebugInfo() {
  const { llms, sources, chatLLMId, fastLLMId, funcLLMId } = useModelsStore.getState();
  return { sources: sources.length, llmsCount: llms.length, chatId: chatLLMId, fastId: fastLLMId, funcId: funcLLMId };
}