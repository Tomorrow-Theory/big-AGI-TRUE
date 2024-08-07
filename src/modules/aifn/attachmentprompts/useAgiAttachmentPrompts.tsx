import * as React from 'react';
import { useQuery } from '@tanstack/react-query';

import type { AttachmentDraft } from '~/common/attachment-drafts/attachment.types';
import { useShallowStable } from '~/common/util/hooks/useShallowObject';

import { agiAttachmentPrompts } from './agiAttachmentPrompts';


// interface

export interface AgiAttachmentPromptsData {
  isVisible: boolean;
  hasData: boolean;
  prompts: string[];
  error: Error | null;
  isFetching: boolean;
  isPending: boolean;
  refetch: () => Promise<any>;
}

const noPrompts: string[] = [];

export function useAgiAttachmentPrompts(canAutoTrigger: boolean, attachmentDrafts: AttachmentDraft[]): AgiAttachmentPromptsData {

  // state
  const [alreadyRan, setAlreadyRan] = React.useState(false);

  // derived
  const fragments = attachmentDrafts.flatMap(draft => draft.outputFragments);
  const hasNoInput = fragments.length === 0;
  const hasEnoughInput = fragments.length >= 2;

  // async operation state
  const { data, error, isPending, isFetching, refetch } = useQuery({
    enabled: canAutoTrigger && hasEnoughInput && !alreadyRan,
    queryKey: ['aifn-prompts-attachments', ...fragments.map(f => f.fId).sort()],
    queryFn: async ({ signal }) => agiAttachmentPrompts(fragments, signal),
    staleTime: 1000 * 60 * 10, // 10 minutes
    // placeholderData: inputCount ? keepPreviousData : undefined,
  });

  React.useEffect(() => {
    console.log('refetch diff');
  }, [refetch]);

  // derived state
  const isVisible = hasEnoughInput;
  const hasData = !!data && data.length > 0;

  // [effect] set/reset alreadyRan
  React.useEffect(() => {
    if (hasNoInput && alreadyRan)
      setAlreadyRan(false);
    else if (hasData && !alreadyRan)
      setAlreadyRan(true);
  }, [hasNoInput, hasData, alreadyRan]);

  return useShallowStable({
    isVisible,
    hasData,
    prompts: data || noPrompts,
    error,
    isFetching,
    isPending,
    refetch,
  });
}