// Types for tracking story choices and their impact
export interface ChoiceHistory {
  chapterNumber: number;
  pageNumber: number;
  choiceText: string;
  timestamp: string;
}

// Types for tracking narrative elements and plot points
export interface NarrativeContext {
  mainPlotPoints: string[];
  characterDevelopment: string[];
  currentTheme: string;
}

// Types for chapter-specific context
export interface ChapterContext {
  chapterNumber: number;
  summary: string;
  keyEvents: string[];
  theme: string;
}

// Combined story context interface
export interface StoryContext {
  currentChapterContext: ChapterContext;
  previousChoices: ChoiceHistory[];
  narrativeContext: NarrativeContext;
  lastUpdated: string;
}
