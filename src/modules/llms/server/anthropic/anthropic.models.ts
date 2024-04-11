import type { ModelDescriptionSchema } from '../llm.server.types';

import { LLM_IF_OAI_Chat, LLM_IF_OAI_Vision } from '../../store-llms';

const roundTime = (date: string) => Math.round(new Date(date).getTime() / 1000);

export const hardcodedAnthropicModels: ModelDescriptionSchema[] = [

  // Claude-3 models - https://docs.anthropic.com/claude/docs/models-overview#model-comparison
  
];