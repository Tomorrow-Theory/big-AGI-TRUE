import { create } from 'zustand';
import { persist } from 'zustand/middleware';


interface TextToImageStore {

  selectedT2IProviderId: string | null; // null = auto-select, specific ID = user choice
  setSelectedT2IProviderId: (providerId: string | null) => void;

}

export const useTextToImageStore = create<TextToImageStore>()(
  persist(
    (_set) => ({

      activeProviderId: 'openai', // null: will auto-select the first availabe provider
      setActiveProviderId: (activeProviderId: string | null) => _set({ activeProviderId }),

    }),
    {
      name: 'app-module-t2i',
      version: 1,
    }),
);