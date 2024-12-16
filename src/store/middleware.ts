import { StateCreator } from 'zustand';
import { StoryState, StoryStore } from './types';

// URL sync middleware
export const urlSync = <T extends StoryStore>(
  config: StateCreator<T>
) => (set: any, get: () => T, api: any) => {
  const syncToUrl = (state: Partial<StoryState>) => {
    const { storyId, currentChapter, currentPage } = state;
    if (typeof window === 'undefined') return;

    // Only sync URL if we're on a story page
    const url = new URL(window.location.href);
    if (!url.pathname.startsWith('/story') || url.pathname.includes('/debug')) {
      return;
    }

    const pathname = `/story/${storyId}/chapter/${currentChapter}/page/${currentPage}`;
    
    if (url.pathname !== pathname) {
      window.history.pushState({}, '', pathname);
    }
  };

  return config(
    (partial: any) => {
      const nextState = typeof partial === 'function' 
        ? partial(get())
        : partial;
      
      if ('storyId' in nextState || 'currentChapter' in nextState || 'currentPage' in nextState) {
        syncToUrl({ ...get(), ...nextState });
      }
      
      set(partial);
    },
    get,
    api
  );
};

// Persistence middleware
export const persist = <T extends StoryStore>(
  config: StateCreator<T>
) => (set: any, get: () => T, api: any) => {
  const STORAGE_KEY = 'story-state';
  
  // Load persisted state on initialization
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set(parsed);
      }
    } catch (error) {
      console.error('Error loading persisted state:', error);
    }
  }

  return config(
    (partial: any) => {
      const nextState = typeof partial === 'function' 
        ? partial(get())
        : partial;
      
      set(nextState);

      // Persist state after update
      if (typeof window !== 'undefined') {
        try {
          const state = get();
          const persistedState = {
            storyId: state.storyId,
            metadata: state.metadata,
            currentChapter: state.currentChapter,
            currentPage: state.currentPage,
            selectedChoice: state.selectedChoice,
            previousChoice: state.previousChoice,
            content: state.content,
            initialized: state.initialized
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState));
        } catch (error) {
          console.error('Error persisting state:', error);
        }
      }
    },
    get,
    api
  );
};
