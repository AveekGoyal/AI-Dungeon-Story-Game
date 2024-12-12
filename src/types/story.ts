export interface Requirement {
  type: string;
  value: string;
}

export interface Choice {
  id: string;
  text: string;
  type: string;
  requirements?: {
    primary?: Requirement;
    alternative?: Requirement;
  };
}

export interface StoryChapter {
  number: number;
  name: string;
}

export interface StoryPage {
  number: number;
  content: string[];  // 5 paragraphs
  choices: string[];  // 4 choices
}

export interface Story {
  id: string;
  title: string;
  currentChapter: StoryChapter;
  currentPage: StoryPage;
}

export interface StoryState {
  story: Story;
  selectedChoice: number | null;
  isLoading: boolean;
  error?: string;
}

export interface StreamingContent {
  type: 'chapter' | 'narrative' | 'choices';
  content: string;
}

export interface StreamingState {
  content: string;
  isComplete: boolean;
  currentSection: string;
  processedSections: Set<string>;
}

// For API responses
export interface StoryResponse {
  title?: string;
  chapter?: {
    number: number;
    name: string;
  };
  page?: {
    number: number;
    content: string[];
    choices?: string[];
  };
}

export interface ProcessedContent {
  raw: string;
  sections: {
    title?: {
      text: string;
      isComplete: boolean;
    };
    chapter?: {
      text: string;
      isComplete: boolean;
    };
    narrative?: {
      text: string;
      paragraphs: string[];
      isComplete: boolean;
    };
    choices?: {
      text: string;
      parsed: string[];
      isComplete: boolean;
    };
  };
}
