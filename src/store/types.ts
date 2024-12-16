import { ProcessedContent, StoryResponse } from '@/types/story';
import { StoryContext, ChoiceHistory, ChapterContext, NarrativeContext } from '@/types/story-context';

export interface StoryMetadata {
  title: string;
  description: string;
  genre: {
    name: string;
    description: string;
  };
  character: {
    name: string;
    class: string;
    stats: {
      strength: number;
      intelligence: number;
      healthPoints: number;
      agility: number;
      magicPoints: number;
      specialAttacks: string[];
    };
  };
}

export interface ChapterMetadata {
  title: string;
  summary?: string;
}

export interface StoryState {
  // Story metadata
  storyId: string | null;
  metadata: StoryMetadata | null;
  
  // Chapter metadata
  chapters: Record<number, ChapterMetadata>;
  
  // Story context
  context: StoryContext | null;
  
  // Navigation state
  currentChapter: number;
  currentPage: number;
  selectedChoice: number | null;
  previousChoice: string | null;
  
  // Content state
  content: Partial<StoryResponse>;
  streamingContent: ProcessedContent;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  abortController: AbortController | null;
  activeStream: boolean;
}

export interface StoryActions {
  // Basic setters
  setMetadata: (metadata: StoryMetadata) => void;
  setStoryId: (id: string | null) => void;
  setChapterMetadata: (chapter: number, metadata: ChapterMetadata) => void;
  getChapterTitle: (chapter: number) => string | undefined;
  setCurrentChapter: (chapter: number) => void;
  setCurrentPage: (page: number) => void;
  setSelectedChoice: (choice: number | null) => void;
  setPreviousChoice: (choice: string | null) => void;
  setContent: (content: Partial<StoryResponse> | ((prev: Partial<StoryResponse>) => Partial<StoryResponse>)) => void;
  setStreamingContent: (content: ProcessedContent) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  setAbortController: (controller: AbortController | null) => void;
  setActiveStream: (active: boolean) => void;
  cleanup: () => void;
  
  // Context actions
  setContext: (context: StoryContext | null) => void;
  updateChoiceHistory: (choice: string) => void;
  updateChapterContext: (summary: string, theme: string, keyEvents: string[]) => void;
  updateNarrativeContext: (plotPoints: string[], characterDevelopment: string[], theme: string) => void;
  
  // Context selectors
  getCurrentContext: () => StoryContext | null;
  getChoiceHistory: () => ChoiceHistory[];
  getCurrentChapterContext: () => ChapterContext | null;
  getNarrativeContext: () => NarrativeContext | null;
  
  // Context management
  initializeContext: () => void;
  validateContext: (context: StoryContext) => boolean;
  cleanupContext: () => void;
  
  // Story actions
  processContent: (text: string) => {
    sections: ProcessedContent['sections'];
    updatedContent: Partial<StoryResponse>;
  };
  handleNext: () => Promise<void>;
  handlePrevious: () => void;
  streamStory: () => Promise<void>;
}

export type StoryStore = StoryState & StoryActions;
