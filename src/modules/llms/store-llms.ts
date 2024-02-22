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

      llms: [
        {
          "id": "togetherai-NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
          "label": "Nous Hermes 2 - Mixtral 8x7B-DPO",
          "created": 1705292440,
          "updated": 1705292440,
          "description": "Nous Hermes 2 Mixtral 7bx8 DPO is the new flagship Nous Research model trained over the Mixtral 7bx8 MoE LLM. The model was trained on over 1,000,000 entries of primarily GPT-4 generated data, as well as other high quality data from open datasets across the AI landscape, achieving state of the art performance on a variety of tasks.",
          "tags": [],
          "contextTokens": 32768,
          "maxOutputTokens": 16384,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO",
            "llmTemperature": 0.5,
            "llmResponseTokens": 4096
          }
        },
        {
          "id": "togetherai-NousResearch/Nous-Hermes-2-Mixtral-8x7B-SFT",
          "label": "Nous Hermes 2 - Mixtral 8x7B-SFT",
          "created": 1705264750,
          "updated": 1705264750,
          "description": "Nous Hermes 2 Mixtral 7bx8 SFT is the new flagship Nous Research model trained over the Mixtral 7bx8 MoE LLM. The model was trained on over 1,000,000 entries of primarily GPT-4 generated data, as well as other high quality data from open datasets across the AI landscape, achieving state of the art performance on a variety of tasks.",
          "tags": [],
          "contextTokens": 32768,
          "maxOutputTokens": 16384,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "NousResearch/Nous-Hermes-2-Mixtral-8x7B-SFT",
            "llmTemperature": 0.5,
            "llmResponseTokens": 4096
          }
        },
        {
          "id": "togetherai-NousResearch/Nous-Hermes-2-Yi-34B",
          "label": "Nous Hermes-2 Yi (34B)",
          "created": 1703710125,
          "updated": 1703710125,
          "description": "Nous Hermes 2 - Yi-34B is a state of the art Yi Fine-tune",
          "tags": [],
          "contextTokens": 4097,
          "maxOutputTokens": 2049,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "NousResearch/Nous-Hermes-2-Yi-34B",
            "llmTemperature": 0.5,
            "llmResponseTokens": 512
          }
        },
        {
          "id": "togetherai-mistralai/Mixtral-8x7B-Instruct-v0.1",
          "label": "Mixtral-8x7B Instruct",
          "created": 1702342468,
          "updated": 1702342468,
          "description": "The Mixtral-8x7B Large Language Model (LLM) is a pretrained generative Sparse Mixture of Experts.",
          "tags": [],
          "contextTokens": 32768,
          "maxOutputTokens": 16384,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "mistralai/Mixtral-8x7B-Instruct-v0.1",
            "llmTemperature": 0.5,
            "llmResponseTokens": 4096
          }
        },
        {
          "id": "togetherai-mistralai/Mistral-7B-Instruct-v0.2",
          "label": "Mistral (7B) Instruct v0.2",
          "created": 1702325373,
          "updated": 1702325373,
          "description": "The Mistral-7B-Instruct-v0.2 Large Language Model (LLM) is an improved instruct fine-tuned version of Mistral-7B-Instruct-v0.1.",
          "tags": [],
          "contextTokens": 32768,
          "maxOutputTokens": 16384,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "mistralai/Mistral-7B-Instruct-v0.2",
            "llmTemperature": 0.5,
            "llmResponseTokens": 4096
          }
        },
        {
          "id": "togetherai-NousResearch/Nous-Hermes-2-Mistral-7B-DPO",
          "label": "NousResearch · Nous Hermes 2 Mistral 7B DPO",
          "created": 1708475042,
          "updated": 1708475042,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "NousResearch/Nous-Hermes-2-Mistral-7B-DPO",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-deepseek-ai/deepseek-coder-33b-instruct",
          "label": "deepseek ai · deepseek coder 33b instruct",
          "created": 1707283326,
          "updated": 1707283326,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "deepseek-ai/deepseek-coder-33b-instruct",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
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
          }
        },
        {
          "id": "togetherai-Qwen/Qwen1.5-72B",
          "label": "Qwen · Qwen1.5 72B",
          "created": 1707133012,
          "updated": 1707133012,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Qwen/Qwen1.5-72B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-Qwen/Qwen1.5-14B-Chat",
          "label": "Qwen · Qwen1.5 14B Chat",
          "created": 1707133005,
          "updated": 1707133005,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Qwen/Qwen1.5-14B-Chat",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-Qwen/Qwen1.5-14B",
          "label": "Qwen · Qwen1.5 14B",
          "created": 1707132999,
          "updated": 1707132999,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Qwen/Qwen1.5-14B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-Qwen/Qwen1.5-7B-Chat",
          "label": "Qwen · Qwen1.5 7B Chat",
          "created": 1707132992,
          "updated": 1707132992,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Qwen/Qwen1.5-7B-Chat",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-Qwen/Qwen1.5-7B",
          "label": "Qwen · Qwen1.5 7B",
          "created": 1707132986,
          "updated": 1707132986,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Qwen/Qwen1.5-7B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-Qwen/Qwen1.5-4B-Chat",
          "label": "Qwen · Qwen1.5 4B Chat",
          "created": 1707132980,
          "updated": 1707132980,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Qwen/Qwen1.5-4B-Chat",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-Qwen/Qwen1.5-4B",
          "label": "Qwen · Qwen1.5 4B",
          "created": 1707132974,
          "updated": 1707132974,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Qwen/Qwen1.5-4B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-Qwen/Qwen1.5-1.8B-Chat",
          "label": "Qwen · Qwen1.5 1.8B Chat",
          "created": 1707132968,
          "updated": 1707132968,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Qwen/Qwen1.5-1.8B-Chat",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-Qwen/Qwen1.5-1.8B",
          "label": "Qwen · Qwen1.5 1.8B",
          "created": 1707132961,
          "updated": 1707132961,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Qwen/Qwen1.5-1.8B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-Qwen/Qwen1.5-0.5B-Chat",
          "label": "Qwen · Qwen1.5 0.5B Chat",
          "created": 1707132955,
          "updated": 1707132955,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Qwen/Qwen1.5-0.5B-Chat",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-Qwen/Qwen1.5-0.5B",
          "label": "Qwen · Qwen1.5 0.5B",
          "created": 1707132950,
          "updated": 1707132950,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Qwen/Qwen1.5-0.5B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-codellama/CodeLlama-70b-Instruct-hf",
          "label": "codellama · CodeLlama 70b Instruct hf",
          "created": 1706489093,
          "updated": 1706489093,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "codellama/CodeLlama-70b-Instruct-hf",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-codellama/CodeLlama-70b-hf",
          "label": "codellama · CodeLlama 70b hf",
          "created": 1706489044,
          "updated": 1706489044,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "codellama/CodeLlama-70b-hf",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-codellama/CodeLlama-70b-Python-hf",
          "label": "codellama · CodeLlama 70b Python hf",
          "created": 1706489018,
          "updated": 1706489018,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "codellama/CodeLlama-70b-Python-hf",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-snorkelai/Snorkel-Mistral-PairRM-DPO",
          "label": "snorkelai · Snorkel Mistral PairRM DPO",
          "created": 1706317043,
          "updated": 1706317043,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "snorkelai/Snorkel-Mistral-PairRM-DPO",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-microsoft/phi-2",
          "label": "microsoft · phi 2",
          "created": 1706296929,
          "updated": 1706296929,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "microsoft/phi-2",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-NumbersStation/nsql-llama-2-7B",
          "label": "NumbersStation · nsql llama 2 7B",
          "created": 1705791070,
          "updated": 1705791070,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "NumbersStation/nsql-llama-2-7B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-bert-base-uncased",
          "label": "bert base uncased",
          "created": 1704508418,
          "updated": 1704508418,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "bert-base-uncased",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-WhereIsAI/UAE-Large-V1",
          "label": "WhereIsAI · UAE Large V1",
          "created": 1703216381,
          "updated": 1703216381,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "WhereIsAI/UAE-Large-V1",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-upstage/SOLAR-10.7B-Instruct-v1.0",
          "label": "upstage · SOLAR 10.7B Instruct v1.0",
          "created": 1702851922,
          "updated": 1702851922,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "upstage/SOLAR-10.7B-Instruct-v1.0",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-HuggingFaceH4/zephyr-7b-beta",
          "label": "HuggingFaceH4 · zephyr 7b beta",
          "created": 1702620518,
          "updated": 1702620518,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "HuggingFaceH4/zephyr-7b-beta",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-openchat/openchat-3.5-1210",
          "label": "openchat · openchat 3.5 1210",
          "created": 1702591018,
          "updated": 1702591018,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "openchat/openchat-3.5-1210",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-mistralai/Mixtral-8x7B-v0.1",
          "label": "mistralai · Mixtral 8x7B v0.1",
          "created": 1702346512,
          "updated": 1702346512,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "mistralai/Mixtral-8x7B-v0.1",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/StripedHyena-Hessian-7B",
          "label": "togethercomputer · StripedHyena Hessian 7B",
          "created": 1702059507,
          "updated": 1702059507,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/StripedHyena-Hessian-7B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/StripedHyena-Nous-7B",
          "label": "togethercomputer · StripedHyena Nous 7B",
          "created": 1702059347,
          "updated": 1702059347,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/StripedHyena-Nous-7B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-zero-one-ai/Yi-6B",
          "label": "zero one ai · Yi 6B",
          "created": 1701867906,
          "updated": 1701867906,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "zero-one-ai/Yi-6B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-zero-one-ai/Yi-34B",
          "label": "zero one ai · Yi 34B",
          "created": 1701815124,
          "updated": 1701815124,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "zero-one-ai/Yi-34B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-Nexusflow/NexusRaven-V2-13B",
          "label": "Nexusflow · NexusRaven V2 13B",
          "created": 1701796524,
          "updated": 1701796524,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Nexusflow/NexusRaven-V2-13B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-zero-one-ai/Yi-34B-Chat",
          "label": "zero one ai · Yi 34B Chat",
          "created": 1701476613,
          "updated": 1701476613,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "zero-one-ai/Yi-34B-Chat",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-WizardLM/WizardLM-13B-V1.2",
          "label": "WizardLM · WizardLM 13B V1.2",
          "created": 1701303525,
          "updated": 1701303525,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "WizardLM/WizardLM-13B-V1.2",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-NousResearch/Nous-Capybara-7B-V1p9",
          "label": "NousResearch · Nous Capybara 7B V1p9",
          "created": 1701203533,
          "updated": 1701203533,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "NousResearch/Nous-Capybara-7B-V1p9",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-BAAI/bge-base-en-v1.5",
          "label": "BAAI · bge base en v1.5",
          "created": 1700837779,
          "updated": 1700837779,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "BAAI/bge-base-en-v1.5",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-BAAI/bge-large-en-v1.5",
          "label": "BAAI · bge large en v1.5",
          "created": 1700837688,
          "updated": 1700837688,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "BAAI/bge-large-en-v1.5",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-Undi95/ReMM-SLERP-L2-13B",
          "label": "Undi95 · ReMM SLERP L2 13B",
          "created": 1700599271,
          "updated": 1700599271,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Undi95/ReMM-SLERP-L2-13B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-Undi95/Toppy-M-7B",
          "label": "Undi95 · Toppy M 7B",
          "created": 1700597740,
          "updated": 1700597740,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Undi95/Toppy-M-7B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-teknium/OpenHermes-2p5-Mistral-7B",
          "label": "teknium · OpenHermes 2p5 Mistral 7B",
          "created": 1700161534,
          "updated": 1700161534,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "teknium/OpenHermes-2p5-Mistral-7B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/m2-bert-80M-2k-retrieval",
          "label": "togethercomputer · m2 bert 80M 2k retrieval",
          "created": 1699985626,
          "updated": 1699985626,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/m2-bert-80M-2k-retrieval",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/m2-bert-80M-32k-retrieval",
          "label": "togethercomputer · m2 bert 80M 32k retrieval",
          "created": 1699120644,
          "updated": 1699120644,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/m2-bert-80M-32k-retrieval",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/m2-bert-80M-8k-retrieval",
          "label": "togethercomputer · m2 bert 80M 8k retrieval",
          "created": 1699120644,
          "updated": 1699120644,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/m2-bert-80M-8k-retrieval",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-sentence-transformers/msmarco-bert-base-dot-v5",
          "label": "sentence transformers · msmarco bert base dot v5",
          "created": 1699086453,
          "updated": 1699086453,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "sentence-transformers/msmarco-bert-base-dot-v5",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-teknium/OpenHermes-2-Mistral-7B",
          "label": "teknium · OpenHermes 2 Mistral 7B",
          "created": 1698432319,
          "updated": 1698432319,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "teknium/OpenHermes-2-Mistral-7B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-EleutherAI/llemma_7b",
          "label": "EleutherAI · llemma 7b",
          "created": 1697837306,
          "updated": 1697837306,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "EleutherAI/llemma_7b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-NousResearch/Nous-Hermes-llama-2-7b",
          "label": "NousResearch · Nous Hermes llama 2 7b",
          "created": 1697837306,
          "updated": 1697837306,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "NousResearch/Nous-Hermes-llama-2-7b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-NousResearch/Nous-Hermes-Llama2-70b",
          "label": "NousResearch · Nous Hermes Llama2 70b",
          "created": 1697837306,
          "updated": 1697837306,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "NousResearch/Nous-Hermes-Llama2-70b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-Open-Orca/Mistral-7B-OpenOrca",
          "label": "Open Orca · Mistral 7B OpenOrca",
          "created": 1697837306,
          "updated": 1697837306,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Open-Orca/Mistral-7B-OpenOrca",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-lmsys/vicuna-7b-v1.5",
          "label": "lmsys · vicuna 7b v1.5",
          "created": 1697489509,
          "updated": 1697489509,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "lmsys/vicuna-7b-v1.5",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-mistralai/Mistral-7B-Instruct-v0.1",
          "label": "mistralai · Mistral 7B Instruct v0.1",
          "created": 1695860851,
          "updated": 1695860851,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "mistralai/Mistral-7B-Instruct-v0.1",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-mistralai/Mistral-7B-v0.1",
          "label": "mistralai · Mistral 7B v0.1",
          "created": 1695860462,
          "updated": 1695860462,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "mistralai/Mistral-7B-v0.1",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-lmsys/vicuna-13b-v1.5-16k",
          "label": "lmsys · vicuna 13b v1.5 16k",
          "created": 1694219354,
          "updated": 1694219354,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "lmsys/vicuna-13b-v1.5-16k",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-Phind/Phind-CodeLlama-34B-Python-v1",
          "label": "Phind · Phind CodeLlama 34B Python v1",
          "created": 1694219354,
          "updated": 1694219354,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Phind/Phind-CodeLlama-34B-Python-v1",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-Phind/Phind-CodeLlama-34B-v2",
          "label": "Phind · Phind CodeLlama 34B v2",
          "created": 1694219354,
          "updated": 1694219354,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Phind/Phind-CodeLlama-34B-v2",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-WizardLM/WizardCoder-15B-V1.0",
          "label": "WizardLM · WizardCoder 15B V1.0",
          "created": 1694219354,
          "updated": 1694219354,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "WizardLM/WizardCoder-15B-V1.0",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-Gryphe/MythoMax-L2-13b",
          "label": "Gryphe · MythoMax L2 13b",
          "created": 1693943905,
          "updated": 1693943905,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Gryphe/MythoMax-L2-13b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-defog/sqlcoder",
          "label": "defog · sqlcoder",
          "created": 1693874567,
          "updated": 1693874567,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "defog/sqlcoder",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-lmsys/vicuna-13b-v1.5",
          "label": "lmsys · vicuna 13b v1.5",
          "created": 1693874407,
          "updated": 1693874407,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "lmsys/vicuna-13b-v1.5",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-garage-bAInd/Platypus2-70B-instruct",
          "label": "garage bAInd · Platypus2 70B instruct",
          "created": 1693873911,
          "updated": 1693873911,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "garage-bAInd/Platypus2-70B-instruct",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-WizardLM/WizardLM-70B-V1.0",
          "label": "WizardLM · WizardLM 70B V1.0",
          "created": 1693873493,
          "updated": 1693873493,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "WizardLM/WizardLM-70B-V1.0",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-WizardLM/WizardCoder-Python-34B-V1.0",
          "label": "WizardLM · WizardCoder Python 34B V1.0",
          "created": 1693872872,
          "updated": 1693872872,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "WizardLM/WizardCoder-Python-34B-V1.0",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/Qwen-7B-Chat",
          "label": "togethercomputer · Qwen 7B Chat",
          "created": 1693439313,
          "updated": 1693439313,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/Qwen-7B-Chat",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/Qwen-7B",
          "label": "togethercomputer · Qwen 7B",
          "created": 1693436970,
          "updated": 1693436970,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/Qwen-7B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-codellama/CodeLlama-34b-hf",
          "label": "codellama · CodeLlama 34b hf",
          "created": 1692898122,
          "updated": 1692898122,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "codellama/CodeLlama-34b-hf",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-codellama/CodeLlama-34b-Instruct-hf",
          "label": "codellama · CodeLlama 34b Instruct hf",
          "created": 1692898122,
          "updated": 1692898122,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "codellama/CodeLlama-34b-Instruct-hf",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-codellama/CodeLlama-34b-Python-hf",
          "label": "codellama · CodeLlama 34b Python hf",
          "created": 1692898122,
          "updated": 1692898122,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "codellama/CodeLlama-34b-Python-hf",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/CodeLlama-34b",
          "label": "togethercomputer · CodeLlama 34b",
          "created": 1692898122,
          "updated": 1692898122,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/CodeLlama-34b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/CodeLlama-34b-Instruct",
          "label": "togethercomputer · CodeLlama 34b Instruct",
          "created": 1692898122,
          "updated": 1692898122,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/CodeLlama-34b-Instruct",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/CodeLlama-34b-Python",
          "label": "togethercomputer · CodeLlama 34b Python",
          "created": 1692898122,
          "updated": 1692898122,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/CodeLlama-34b-Python",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-codellama/CodeLlama-13b-hf",
          "label": "codellama · CodeLlama 13b hf",
          "created": 1692896954,
          "updated": 1692896954,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "codellama/CodeLlama-13b-hf",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-codellama/CodeLlama-13b-Instruct-hf",
          "label": "codellama · CodeLlama 13b Instruct hf",
          "created": 1692896954,
          "updated": 1692896954,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "codellama/CodeLlama-13b-Instruct-hf",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-codellama/CodeLlama-13b-Python-hf",
          "label": "codellama · CodeLlama 13b Python hf",
          "created": 1692896954,
          "updated": 1692896954,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "codellama/CodeLlama-13b-Python-hf",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/CodeLlama-13b-Instruct",
          "label": "togethercomputer · CodeLlama 13b Instruct",
          "created": 1692896954,
          "updated": 1692896954,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/CodeLlama-13b-Instruct",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/CodeLlama-13b-Python",
          "label": "togethercomputer · CodeLlama 13b Python",
          "created": 1692896954,
          "updated": 1692896954,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/CodeLlama-13b-Python",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-Austism/chronos-hermes-13b",
          "label": "Austism · chronos hermes 13b",
          "created": 1692896905,
          "updated": 1692896905,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Austism/chronos-hermes-13b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-codellama/CodeLlama-7b-hf",
          "label": "codellama · CodeLlama 7b hf",
          "created": 1692896905,
          "updated": 1692896905,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "codellama/CodeLlama-7b-hf",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-codellama/CodeLlama-7b-Instruct-hf",
          "label": "codellama · CodeLlama 7b Instruct hf",
          "created": 1692896905,
          "updated": 1692896905,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "codellama/CodeLlama-7b-Instruct-hf",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-codellama/CodeLlama-7b-Python-hf",
          "label": "codellama · CodeLlama 7b Python hf",
          "created": 1692896905,
          "updated": 1692896905,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "codellama/CodeLlama-7b-Python-hf",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/CodeLlama-7b-Instruct",
          "label": "togethercomputer · CodeLlama 7b Instruct",
          "created": 1692896905,
          "updated": 1692896905,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/CodeLlama-7b-Instruct",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/CodeLlama-7b-Python",
          "label": "togethercomputer · CodeLlama 7b Python",
          "created": 1692896905,
          "updated": 1692896905,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/CodeLlama-7b-Python",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-NousResearch/Nous-Hermes-Llama2-13b",
          "label": "NousResearch · Nous Hermes Llama2 13b",
          "created": 1691017613,
          "updated": 1691017613,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "NousResearch/Nous-Hermes-Llama2-13b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-stabilityai/stable-diffusion-xl-base-1.0",
          "label": "stabilityai · stable diffusion xl base 1.0",
          "created": 1690929420,
          "updated": 1690929420,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "stabilityai/stable-diffusion-xl-base-1.0",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/LLaMA-2-7B-32K",
          "label": "togethercomputer · LLaMA 2 7B 32K",
          "created": 1690472071,
          "updated": 1690472071,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/LLaMA-2-7B-32K",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/Llama-2-7B-32K-Instruct",
          "label": "togethercomputer · Llama 2 7B 32K Instruct",
          "created": 1690472071,
          "updated": 1690472071,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/Llama-2-7B-32K-Instruct",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-meta-llama/Llama-2-13b-chat-hf",
          "label": "meta llama · Llama 2 13b chat hf",
          "created": 1689720415,
          "updated": 1689720415,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "meta-llama/Llama-2-13b-chat-hf",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-meta-llama/Llama-2-13b-hf",
          "label": "meta llama · Llama 2 13b hf",
          "created": 1689720415,
          "updated": 1689720415,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "meta-llama/Llama-2-13b-hf",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-meta-llama/Llama-2-70b-chat-hf",
          "label": "meta llama · Llama 2 70b chat hf",
          "created": 1689720415,
          "updated": 1689720415,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "meta-llama/Llama-2-70b-chat-hf",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-meta-llama/Llama-2-70b-hf",
          "label": "meta llama · Llama 2 70b hf",
          "created": 1689720415,
          "updated": 1689720415,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "meta-llama/Llama-2-70b-hf",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-meta-llama/Llama-2-7b-chat-hf",
          "label": "meta llama · Llama 2 7b chat hf",
          "created": 1689720415,
          "updated": 1689720415,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "meta-llama/Llama-2-7b-chat-hf",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-meta-llama/Llama-2-7b-hf",
          "label": "meta llama · Llama 2 7b hf",
          "created": 1689720415,
          "updated": 1689720415,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "meta-llama/Llama-2-7b-hf",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/llama-2-13b",
          "label": "togethercomputer · llama 2 13b",
          "created": 1689720415,
          "updated": 1689720415,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/llama-2-13b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/llama-2-13b-chat",
          "label": "togethercomputer · llama 2 13b chat",
          "created": 1689720415,
          "updated": 1689720415,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/llama-2-13b-chat",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/llama-2-70b",
          "label": "togethercomputer · llama 2 70b",
          "created": 1689720415,
          "updated": 1689720415,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/llama-2-70b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/llama-2-70b-chat",
          "label": "togethercomputer · llama 2 70b chat",
          "created": 1689720415,
          "updated": 1689720415,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/llama-2-70b-chat",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/llama-2-7b",
          "label": "togethercomputer · llama 2 7b",
          "created": 1689720415,
          "updated": 1689720415,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/llama-2-7b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/llama-2-7b-chat",
          "label": "togethercomputer · llama 2 7b chat",
          "created": 1689720415,
          "updated": 1689720415,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/llama-2-7b-chat",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-lmsys/fastchat-t5-3b-v1.0",
          "label": "lmsys · fastchat t5 3b v1.0",
          "created": 1689055281,
          "updated": 1689055281,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "lmsys/fastchat-t5-3b-v1.0",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-lmsys/vicuna-7b-v1.3",
          "label": "lmsys · vicuna 7b v1.3",
          "created": 1689055251,
          "updated": 1689055251,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "lmsys/vicuna-7b-v1.3",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-lmsys/vicuna-13b-v1.3",
          "label": "lmsys · vicuna 13b v1.3",
          "created": 1689055205,
          "updated": 1689055205,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "lmsys/vicuna-13b-v1.3",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-HuggingFaceH4/starchat-alpha",
          "label": "HuggingFaceH4 · starchat alpha",
          "created": 1689055166,
          "updated": 1689055166,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "HuggingFaceH4/starchat-alpha",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-bigcode/starcoder",
          "label": "bigcode · starcoder",
          "created": 1689055086,
          "updated": 1689055086,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "bigcode/starcoder",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-SG161222/Realistic_Vision_V3.0_VAE",
          "label": "SG161222 · Realistic Vision V3.0 VAE",
          "created": 1689054737,
          "updated": 1689054737,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "SG161222/Realistic_Vision_V3.0_VAE",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-prompthero/openjourney",
          "label": "prompthero · openjourney",
          "created": 1689054556,
          "updated": 1689054556,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "prompthero/openjourney",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-NumbersStation/nsql-6B",
          "label": "NumbersStation · nsql 6B",
          "created": 1689054176,
          "updated": 1689054176,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "NumbersStation/nsql-6B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-NousResearch/Nous-Hermes-13b",
          "label": "NousResearch · Nous Hermes 13b",
          "created": 1689054130,
          "updated": 1689054130,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "NousResearch/Nous-Hermes-13b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-mosaicml/mpt-7b-instruct",
          "label": "mosaicml · mpt 7b instruct",
          "created": 1689054063,
          "updated": 1689054063,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "mosaicml/mpt-7b-instruct",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/mpt-7b-chat",
          "label": "togethercomputer · mpt 7b chat",
          "created": 1689053992,
          "updated": 1689053992,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/mpt-7b-chat",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/mpt-30b-chat",
          "label": "togethercomputer · mpt 30b chat",
          "created": 1689053966,
          "updated": 1689053966,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/mpt-30b-chat",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-mosaicml/mpt-7b",
          "label": "mosaicml · mpt 7b",
          "created": 1689053914,
          "updated": 1689053914,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "mosaicml/mpt-7b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-huggyllama/llama-7b",
          "label": "huggyllama · llama 7b",
          "created": 1689053806,
          "updated": 1689053806,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "huggyllama/llama-7b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-huggyllama/llama-65b",
          "label": "huggyllama · llama 65b",
          "created": 1689053783,
          "updated": 1689053783,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "huggyllama/llama-65b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-huggyllama/llama-30b",
          "label": "huggyllama · llama 30b",
          "created": 1689053749,
          "updated": 1689053749,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "huggyllama/llama-30b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-huggyllama/llama-13b",
          "label": "huggyllama · llama 13b",
          "created": 1689053707,
          "updated": 1689053707,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "huggyllama/llama-13b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/Koala-7B",
          "label": "togethercomputer · Koala 7B",
          "created": 1689053642,
          "updated": 1689053642,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/Koala-7B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/Koala-13B",
          "label": "togethercomputer · Koala 13B",
          "created": 1689053617,
          "updated": 1689053617,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/Koala-13B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/guanaco-7b",
          "label": "togethercomputer · guanaco 7b",
          "created": 1689053421,
          "updated": 1689053421,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/guanaco-7b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/guanaco-65b",
          "label": "togethercomputer · guanaco 65b",
          "created": 1689053393,
          "updated": 1689053393,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/guanaco-65b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/guanaco-13b",
          "label": "togethercomputer · guanaco 13b",
          "created": 1689053347,
          "updated": 1689053347,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/guanaco-13b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/guanaco-33b",
          "label": "togethercomputer · guanaco 33b",
          "created": 1689053347,
          "updated": 1689053347,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/guanaco-33b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/falcon-7b-instruct",
          "label": "togethercomputer · falcon 7b instruct",
          "created": 1689052733,
          "updated": 1689052733,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/falcon-7b-instruct",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/falcon-40b-instruct",
          "label": "togethercomputer · falcon 40b instruct",
          "created": 1689052692,
          "updated": 1689052692,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/falcon-40b-instruct",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/falcon-7b",
          "label": "togethercomputer · falcon 7b",
          "created": 1689052637,
          "updated": 1689052637,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/falcon-7b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/falcon-40b",
          "label": "togethercomputer · falcon 40b",
          "created": 1689052575,
          "updated": 1689052575,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/falcon-40b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-Salesforce/codegen2-7B",
          "label": "Salesforce · codegen2 7B",
          "created": 1689052278,
          "updated": 1689052278,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Salesforce/codegen2-7B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-wavymulder/Analog-Diffusion",
          "label": "wavymulder · Analog Diffusion",
          "created": 1689052079,
          "updated": 1689052079,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "wavymulder/Analog-Diffusion",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/alpaca-7b",
          "label": "togethercomputer · alpaca 7b",
          "created": 1689051927,
          "updated": 1689051927,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/alpaca-7b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-replit/replit-code-v1-3b",
          "label": "replit · replit code v1 3b",
          "created": 1688083660,
          "updated": 1688083660,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "replit/replit-code-v1-3b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-stabilityai/stablelm-base-alpha-7b",
          "label": "stabilityai · stablelm base alpha 7b",
          "created": 1687551765,
          "updated": 1687551765,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "stabilityai/stablelm-base-alpha-7b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-Salesforce/codegen2-16B",
          "label": "Salesforce · codegen2 16B",
          "created": 1687551764,
          "updated": 1687551764,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Salesforce/codegen2-16B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-stabilityai/stablelm-base-alpha-3b",
          "label": "stabilityai · stablelm base alpha 3b",
          "created": 1687551764,
          "updated": 1687551764,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "stabilityai/stablelm-base-alpha-3b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/Pythia-Chat-Base-7B-v0.16",
          "label": "togethercomputer · Pythia Chat Base 7B v0.16",
          "created": 1687551764,
          "updated": 1687551764,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/Pythia-Chat-Base-7B-v0.16",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/RedPajama-INCITE-7B-Base",
          "label": "togethercomputer · RedPajama INCITE 7B Base",
          "created": 1687551764,
          "updated": 1687551764,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/RedPajama-INCITE-7B-Base",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/RedPajama-INCITE-7B-Chat",
          "label": "togethercomputer · RedPajama INCITE 7B Chat",
          "created": 1687551764,
          "updated": 1687551764,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/RedPajama-INCITE-7B-Chat",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/RedPajama-INCITE-7B-Instruct",
          "label": "togethercomputer · RedPajama INCITE 7B Instruct",
          "created": 1687551764,
          "updated": 1687551764,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/RedPajama-INCITE-7B-Instruct",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-runwayml/stable-diffusion-v1-5",
          "label": "runwayml · stable diffusion v1 5",
          "created": 1687551763,
          "updated": 1687551763,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "runwayml/stable-diffusion-v1-5",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-stabilityai/stable-diffusion-2-1",
          "label": "stabilityai · stable diffusion 2 1",
          "created": 1687551763,
          "updated": 1687551763,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "stabilityai/stable-diffusion-2-1",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/GPT-JT-6B-v1",
          "label": "togethercomputer · GPT JT 6B v1",
          "created": 1687551763,
          "updated": 1687551763,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/GPT-JT-6B-v1",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/GPT-JT-Moderation-6B",
          "label": "togethercomputer · GPT JT Moderation 6B",
          "created": 1687551763,
          "updated": 1687551763,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/GPT-JT-Moderation-6B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/GPT-NeoXT-Chat-Base-20B",
          "label": "togethercomputer · GPT NeoXT Chat Base 20B",
          "created": 1687551763,
          "updated": 1687551763,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/GPT-NeoXT-Chat-Base-20B",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/RedPajama-INCITE-Base-3B-v1",
          "label": "togethercomputer · RedPajama INCITE Base 3B v1",
          "created": 1687551763,
          "updated": 1687551763,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/RedPajama-INCITE-Base-3B-v1",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/RedPajama-INCITE-Chat-3B-v1",
          "label": "togethercomputer · RedPajama INCITE Chat 3B v1",
          "created": 1687551763,
          "updated": 1687551763,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/RedPajama-INCITE-Chat-3B-v1",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-togethercomputer/RedPajama-INCITE-Instruct-3B-v1",
          "label": "togethercomputer · RedPajama INCITE Instruct 3B v1",
          "created": 1687551763,
          "updated": 1687551763,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "togethercomputer/RedPajama-INCITE-Instruct-3B-v1",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-EleutherAI/gpt-neox-20b",
          "label": "EleutherAI · gpt neox 20b",
          "created": 1687551762,
          "updated": 1687551762,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "EleutherAI/gpt-neox-20b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-EleutherAI/pythia-12b-v0",
          "label": "EleutherAI · pythia 12b v0",
          "created": 1687551762,
          "updated": 1687551762,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "EleutherAI/pythia-12b-v0",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-EleutherAI/pythia-6.9b",
          "label": "EleutherAI · pythia 6.9b",
          "created": 1687551762,
          "updated": 1687551762,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "EleutherAI/pythia-6.9b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-google/flan-t5-xl",
          "label": "google · flan t5 xl",
          "created": 1687551762,
          "updated": 1687551762,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "google/flan-t5-xl",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-google/flan-t5-xxl",
          "label": "google · flan t5 xxl",
          "created": 1687551762,
          "updated": 1687551762,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "google/flan-t5-xxl",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
          "label": "OpenAssistant · oasst sft 4 pythia 12b epoch 3.5",
          "created": 1687551762,
          "updated": 1687551762,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-OpenAssistant/stablelm-7b-sft-v7-epoch-3",
          "label": "OpenAssistant · stablelm 7b sft v7 epoch 3",
          "created": 1687551762,
          "updated": 1687551762,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "OpenAssistant/stablelm-7b-sft-v7-epoch-3",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-databricks/dolly-v2-12b",
          "label": "databricks · dolly v2 12b",
          "created": 1687551761,
          "updated": 1687551761,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "databricks/dolly-v2-12b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-databricks/dolly-v2-3b",
          "label": "databricks · dolly v2 3b",
          "created": 1687551761,
          "updated": 1687551761,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "databricks/dolly-v2-3b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-databricks/dolly-v2-7b",
          "label": "databricks · dolly v2 7b",
          "created": 1687551761,
          "updated": 1687551761,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "databricks/dolly-v2-7b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-EleutherAI/gpt-j-6b",
          "label": "EleutherAI · gpt j 6b",
          "created": 1687551761,
          "updated": 1687551761,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "EleutherAI/gpt-j-6b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-EleutherAI/pythia-1b-v0",
          "label": "EleutherAI · pythia 1b v0",
          "created": 1687551761,
          "updated": 1687551761,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "EleutherAI/pythia-1b-v0",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-EleutherAI/pythia-2.8b-v0",
          "label": "EleutherAI · pythia 2.8b v0",
          "created": 1687551761,
          "updated": 1687551761,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "EleutherAI/pythia-2.8b-v0",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "togetherai-Meta-Llama/Llama-Guard-7b",
          "label": "Meta Llama · Llama Guard 7b",
          "created": 0,
          "updated": 0,
          "description": "New Togehter AI Model",
          "tags": [],
          "contextTokens": null,
          "maxOutputTokens": null,
          "hidden": true,
          "isFree": false,
          "sId": "togetherai",
          "options": {
            "llmRef": "Meta-Llama/Llama-Guard-7b",
            "llmTemperature": 0.5,
            "llmResponseTokens": null
          }
        },
        {
          "id": "perplexity-codellama-34b-instruct",
          "label": "Codellama 34B Instruct",
          "created": 0,
          "updated": 0,
          "description": "Code Llama is a collection of pretrained and fine-tuned generative text models. This model is designed for general code synthesis and understanding.",
          "tags": [],
          "contextTokens": 16384,
          "maxOutputTokens": 8192,
          "hidden": true,
          "isFree": false,
          "sId": "perplexity",
          "options": {
            "llmRef": "codellama-34b-instruct",
            "llmTemperature": 0.5,
            "llmResponseTokens": 2048
          }
        },
        {
          "id": "perplexity-codellama-70b-instruct",
          "label": "Codellama 70B Instruct",
          "created": 0,
          "updated": 0,
          "description": "Code Llama is a collection of pretrained and fine-tuned generative text models. This model is designed for general code synthesis and understanding.",
          "tags": [],
          "contextTokens": 16384,
          "maxOutputTokens": 8192,
          "hidden": true,
          "isFree": false,
          "sId": "perplexity",
          "options": {
            "llmRef": "codellama-70b-instruct",
            "llmTemperature": 0.5,
            "llmResponseTokens": 2048
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
            "llmResponseTokens": 512
          }
        },
        {
          "id": "perplexity-mistral-7b-instruct",
          "label": "Mistral 7B Instruct",
          "created": 0,
          "updated": 0,
          "description": "The Mistral-7B-Instruct-v0.1 Large Language Model (LLM) is a instruct fine-tuned version of the Mistral-7B-v0.1 generative text model using a variety of publicly available conversation datasets.",
          "tags": [],
          "contextTokens": 4096,
          "maxOutputTokens": 2048,
          "hidden": true,
          "isFree": false,
          "sId": "perplexity",
          "options": {
            "llmRef": "mistral-7b-instruct",
            "llmTemperature": 0.5,
            "llmResponseTokens": 512
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
            "llmResponseTokens": 512
          }
        },
        {
          "id": "perplexity-pplx-7b-online",
          "label": "Perplexity 7B Online",
          "created": 0,
          "updated": 0,
          "description": "Perplexity 7B Online",
          "tags": [],
          "contextTokens": 4096,
          "maxOutputTokens": 2048,
          "hidden": true,
          "isFree": false,
          "sId": "perplexity",
          "options": {
            "llmRef": "pplx-7b-online",
            "llmTemperature": 0.5,
            "llmResponseTokens": 512
          }
        },
        {
          "id": "perplexity-pplx-70b-online",
          "label": "Perplexity 70B Online",
          "created": 0,
          "updated": 0,
          "description": "Perplexity 70B Online",
          "tags": [],
          "contextTokens": 4096,
          "maxOutputTokens": 2048,
          "hidden": true,
          "isFree": false,
          "sId": "perplexity",
          "options": {
            "llmRef": "pplx-70b-online",
            "llmTemperature": 0.5,
            "llmResponseTokens": 512
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
            "llmTemperature": 0.5,
            "llmResponseTokens": 512
          }
        },
        {
          "id": "perplexity-pplx-7b-chat",
          "label": "Perplexity 7B Chat",
          "created": 0,
          "updated": 0,
          "description": "Perplexity 7B Chat",
          "tags": [],
          "contextTokens": 8192,
          "maxOutputTokens": 4096,
          "hidden": true,
          "isFree": false,
          "sId": "perplexity",
          "options": {
            "llmRef": "pplx-7b-chat",
            "llmTemperature": 0.5,
            "llmResponseTokens": 1024
          }
        },
        {
          "id": "perplexity-pplx-70b-chat",
          "label": "Perplexity 70B Chat",
          "created": 0,
          "updated": 0,
          "description": "Perplexity 70B Chat",
          "tags": [],
          "contextTokens": 4096,
          "maxOutputTokens": 2048,
          "hidden": true,
          "isFree": false,
          "sId": "perplexity",
          "options": {
            "llmRef": "pplx-70b-chat",
            "llmTemperature": 0.5,
            "llmResponseTokens": 512
          }
        },
        {
          "id": "perplexity-pplx-8x7b-chat",
          "label": "Perplexity 8x7B Chat",
          "created": 0,
          "updated": 0,
          "description": "Perplexity 8x7B Chat",
          "tags": [],
          "contextTokens": 4096,
          "maxOutputTokens": 2048,
          "hidden": true,
          "isFree": false,
          "sId": "perplexity",
          "options": {
            "llmRef": "pplx-8x7b-chat",
            "llmTemperature": 0.5,
            "llmResponseTokens": 512
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
            "llmResponseTokens": 2048
          }
        },
        {
          "id": "openai-gpt-4-1106-preview",
          "label": "GPT-4 Turbo (1106)",
          "created": 1698957206,
          "updated": 1698957206,
          "description": "128k context, fresher knowledge, cheaper than GPT-4.",
          "tags": [],
          "contextTokens": 128000,
          "maxOutputTokens": 4096,
          "hidden": true,
          "isFree": false,
          "sId": "openai",
          "options": {
            "llmRef": "gpt-4-1106-preview",
            "llmTemperature": 0.5,
            "llmResponseTokens": 2048
          }
        },
        {
          "id": "openai-gpt-4-vision-preview",
          "label": "GPT-4 Turbo · Vision",
          "created": 1698894917,
          "updated": 1698894917,
          "description": "GPT-4 Turbo model featuring improved instruction following, JSON mode, reproducible outputs, parallel function calling, and more. Returns a maximum of 4,096 output tokens.",
          "tags": [],
          "contextTokens": 128000,
          "maxOutputTokens": 4096,
          "hidden": true,
          "isFree": false,
          "sId": "openai",
          "options": {
            "llmRef": "gpt-4-vision-preview",
            "llmTemperature": 0.5,
            "llmResponseTokens": 2048
          }
        },
        {
          "id": "openai-gpt-4-0613",
          "label": "GPT-4 (0613)",
          "created": 1686588896,
          "updated": 1686588896,
          "description": "Snapshot of gpt-4 from June 13th 2023 with function calling data. Data up to Sep 2021.",
          "tags": [],
          "contextTokens": 8192,
          "maxOutputTokens": 4096,
          "hidden": true,
          "isFree": false,
          "sId": "openai",
          "options": {
            "llmRef": "gpt-4-0613",
            "llmTemperature": 0.5,
            "llmResponseTokens": 1024
          }
        },
        {
          "id": "openai-gpt-3.5-turbo-16k-0613",
          "label": "3.5-Turbo 16k (0613) [legacy]",
          "created": 1685474247,
          "updated": 1685474247,
          "description": "Snapshot of gpt-3.5-turbo-16k from June 13th 2023.",
          "tags": [],
          "contextTokens": 16385,
          "maxOutputTokens": 8193,
          "hidden": true,
          "isFree": false,
          "sId": "openai",
          "options": {
            "llmRef": "gpt-3.5-turbo-16k-0613",
            "llmTemperature": 0.5,
            "llmResponseTokens": 2048
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
            "llmResponseTokens": 2048
          }
        },
        {
          "id": "openai-gpt-3.5-turbo-1106",
          "label": "3.5-Turbo (1106)",
          "created": 1698959748,
          "updated": 1698959748,
          "description": "The latest GPT-3.5 Turbo model with improved instruction following, JSON mode, reproducible outputs, parallel function calling, and more.",
          "tags": [],
          "contextTokens": 16385,
          "maxOutputTokens": 4096,
          "hidden": true,
          "isFree": false,
          "sId": "openai",
          "options": {
            "llmRef": "gpt-3.5-turbo-1106",
            "llmTemperature": 0.5,
            "llmResponseTokens": 2048
          }
        },
        {
          "id": "openai-gpt-3.5-turbo-0613",
          "label": "3.5-Turbo (0613) [legacy]",
          "created": 1686587434,
          "updated": 1686587434,
          "description": "Snapshot of gpt-3.5-turbo from June 13th 2023. Will be deprecated on June 13, 2024.",
          "tags": [],
          "contextTokens": 4097,
          "maxOutputTokens": 2049,
          "hidden": true,
          "isFree": false,
          "sId": "openai",
          "options": {
            "llmRef": "gpt-3.5-turbo-0613",
            "llmTemperature": 0.5,
            "llmResponseTokens": 512
          }
        },
        {
          "id": "openai-gpt-3.5-turbo-0301",
          "label": "3.5-Turbo (0301) [legacy]",
          "created": 1677649963,
          "updated": 1677649963,
          "description": "Snapshot of gpt-3.5-turbo from March 1st 2023. Will be deprecated on June 13th 2024.",
          "tags": [],
          "contextTokens": 4097,
          "maxOutputTokens": 2049,
          "hidden": true,
          "isFree": false,
          "sId": "openai",
          "options": {
            "llmRef": "gpt-3.5-turbo-0301",
            "llmTemperature": 0.5,
            "llmResponseTokens": 512
          }
        },
        {
          "id": "openai-gpt-4-turbo-preview",
          "label": "🔗 GPT-4 Turbo → gpt-4-0125-preview",
          "created": 1706037777,
          "updated": 1706037777,
          "description": "Currently points to gpt-4-0125-preview.",
          "tags": [],
          "contextTokens": 128000,
          "maxOutputTokens": 4096,
          "hidden": true,
          "isFree": false,
          "sId": "openai",
          "options": {
            "llmRef": "gpt-4-turbo-preview",
            "llmTemperature": 0.5,
            "llmResponseTokens": 2048
          }
        },
        {
          "id": "openai-gpt-4",
          "label": "🔗 GPT-4 → gpt-4-0613",
          "created": 1687882411,
          "updated": 1687882411,
          "description": "Currently points to gpt-4-0613.",
          "tags": [],
          "contextTokens": 8192,
          "maxOutputTokens": 4096,
          "hidden": true,
          "isFree": false,
          "sId": "openai",
          "options": {
            "llmRef": "gpt-4",
            "llmTemperature": 0.5,
            "llmResponseTokens": 1024
          }
        },
        {
          "id": "openai-gpt-3.5-turbo-16k",
          "label": "🔗 3.5-Turbo 16k → gpt-3.5-turbo-16k-0613 [legacy]",
          "created": 1683758102,
          "updated": 1683758102,
          "description": "Currently points to gpt-3.5-turbo-16k-0613.",
          "tags": [],
          "contextTokens": 16385,
          "maxOutputTokens": 8193,
          "hidden": true,
          "isFree": false,
          "sId": "openai",
          "options": {
            "llmRef": "gpt-3.5-turbo-16k",
            "llmTemperature": 0.5,
            "llmResponseTokens": 2048
          }
        },
        {
          "id": "openai-gpt-3.5-turbo",
          "label": "🔗 3.5-Turbo → gpt-3.5-turbo-0125",
          "created": 1677610602,
          "updated": 1677610602,
          "description": "Currently points to gpt-3.5-turbo-0125.",
          "tags": [],
          "contextTokens": 16385,
          "maxOutputTokens": 4096,
          "hidden": true,
          "isFree": false,
          "sId": "openai",
          "options": {
            "llmRef": "gpt-3.5-turbo",
            "llmTemperature": 0.5,
            "llmResponseTokens": 2048
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
            "llmTemperature": 0.5,
            "llmResponseTokens": 25000
          }
        },
        {
          "id": "anthropic-claude-2.0",
          "label": "Claude 2",
          "created": 1689033600,
          "updated": 0,
          "description": "Superior performance on tasks that require complex reasoning",
          "tags": [],
          "contextTokens": 100000,
          "maxOutputTokens": 50000,
          "hidden": true,
          "isFree": false,
          "sId": "anthropic",
          "options": {
            "llmRef": "claude-2.0",
            "llmTemperature": 0.5,
            "llmResponseTokens": 12500
          }
        },
        {
          "id": "anthropic-claude-instant-1.2",
          "label": "Claude Instant 1.2",
          "created": 1691539200,
          "updated": 0,
          "description": "Low-latency, high throughput model",
          "tags": [],
          "contextTokens": 100000,
          "maxOutputTokens": 50000,
          "hidden": true,
          "isFree": false,
          "sId": "anthropic",
          "options": {
            "llmRef": "claude-instant-1.2",
            "llmTemperature": 0.5,
            "llmResponseTokens": 12500
          }
        },
        {
          "id": "anthropic-claude-instant-1.1",
          "label": "Claude Instant 1.1",
          "created": 1678752000,
          "updated": 0,
          "description": "Precise and fast",
          "tags": [],
          "contextTokens": 100000,
          "maxOutputTokens": 50000,
          "hidden": true,
          "isFree": false,
          "sId": "anthropic",
          "options": {
            "llmRef": "claude-instant-1.1",
            "llmTemperature": 0.5,
            "llmResponseTokens": 12500
          }
        },
        {
          "id": "anthropic-claude-1.3",
          "label": "Claude 1.3",
          "created": 1678752000,
          "updated": 0,
          "description": "Claude 1.3 is the latest version of Claude v1",
          "tags": [],
          "contextTokens": 100000,
          "maxOutputTokens": 50000,
          "hidden": true,
          "isFree": false,
          "sId": "anthropic",
          "options": {
            "llmRef": "claude-1.3",
            "llmTemperature": 0.5,
            "llmResponseTokens": 12500
          }
        },
        {
          "id": "anthropic-claude-1.0",
          "label": "Claude 1",
          "created": 1678752000,
          "updated": 0,
          "description": "Claude 1.0 is the first version of Claude",
          "tags": [],
          "contextTokens": 9000,
          "maxOutputTokens": 4500,
          "hidden": true,
          "isFree": false,
          "sId": "anthropic",
          "options": {
            "llmRef": "claude-1.0",
            "llmTemperature": 0.5,
            "llmResponseTokens": 1125
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
            "llmTemperature": 0.5,
            "llmResponseTokens": 1024
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
            "llmResponseTokens": 1024
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
            "llmResponseTokens": 4096
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
            "llmResponseTokens": 4096
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