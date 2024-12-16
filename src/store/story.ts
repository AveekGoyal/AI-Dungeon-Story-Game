import { create } from 'zustand';
import { StoryState, StoryStore } from './types';
import { ProcessedContent, StoryResponse } from '@/types/story';
import { StoryContext, ChoiceHistory, ChapterContext, NarrativeContext } from '@/types/story-context';
import { persist, urlSync } from './middleware';

const initialState: StoryState = {
  storyId: null,
  metadata: null,
  chapters: {},
  currentChapter: 1,
  currentPage: 1,
  selectedChoice: null,
  previousChoice: null,
  content: {},
  streamingContent: {
    raw: '',
    sections: {
      title: { text: '', isComplete: false },
      chapter: { text: '', isComplete: false },
      narrative: { text: '', paragraphs: [], isComplete: false },
      choices: { text: '', parsed: [], isComplete: false }
    }
  },
  isLoading: false,
  error: null,
  initialized: false,
  abortController: null,
  activeStream: false,
  context: null
};

export const useStoryStore = create<StoryStore>()(
  urlSync(
    persist(
      (set, get) => ({
        ...initialState,

        // Basic setters
        setMetadata: (metadata) => set({ metadata }),
        setStoryId: (id) => set({ storyId: id }),
        setChapterMetadata: (chapter, metadata) =>
          set((state) => ({
            chapters: { ...state.chapters, [chapter]: metadata }
          })),
        getChapterTitle: (chapter) => get().chapters[chapter]?.title,
        setCurrentChapter: (chapter) => set({ currentChapter: chapter }),
        setCurrentPage: (page) => set({ currentPage: page }),
        setSelectedChoice: (choice) => set({ selectedChoice: choice }),
        setPreviousChoice: (choice) => set({ previousChoice: choice }),
        setContent: (content) => 
          set((state) => ({ 
            content: typeof content === 'function' ? content(state.content) : content 
          })),
        setStreamingContent: (content) => set({ streamingContent: content }),
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        setInitialized: (initialized) => set({ initialized }),
        setAbortController: (controller) => set({ abortController: controller }),
        setActiveStream: (active) => set({ activeStream: active }),
        cleanup: () => set(initialState),

        // Context actions
        setContext: (context) => set({ context }),
        
        updateChoiceHistory: (choice) => {
          const state = get();
          const newChoice: ChoiceHistory = {
            chapterNumber: state.currentChapter,
            pageNumber: state.currentPage,
            choiceText: choice,
            timestamp: new Date().toISOString()
          };
          
          set((state) => ({
            context: state.context ? {
              ...state.context,
              previousChoices: [...state.context.previousChoices, newChoice],
              lastUpdated: new Date().toISOString()
            } : {
              currentChapterContext: {
                chapterNumber: state.currentChapter,
                summary: '',
                keyEvents: [],
                theme: ''
              },
              previousChoices: [newChoice],
              narrativeContext: {
                mainPlotPoints: [],
                characterDevelopment: [],
                currentTheme: ''
              },
              lastUpdated: new Date().toISOString()
            }
          }));
        },
        
        updateChapterContext: (summary, theme, keyEvents) => {
          set((state) => ({
            context: state.context ? {
              ...state.context,
              currentChapterContext: {
                chapterNumber: state.currentChapter,
                summary,
                theme,
                keyEvents
              },
              lastUpdated: new Date().toISOString()
            } : null
          }));
        },
        
        updateNarrativeContext: (plotPoints, characterDevelopment, theme) => {
          set((state) => ({
            context: state.context ? {
              ...state.context,
              narrativeContext: {
                mainPlotPoints: plotPoints,
                characterDevelopment,
                currentTheme: theme
              },
              lastUpdated: new Date().toISOString()
            } : null
          }));
        },

        // Context selectors
        getCurrentContext: () => get().context,
        
        getChoiceHistory: () => {
          const context = get().context;
          return context?.previousChoices || [];
        },
        
        getCurrentChapterContext: () => {
          const context = get().context;
          return context?.currentChapterContext || null;
        },
        
        getNarrativeContext: () => {
          const context = get().context;
          return context?.narrativeContext || null;
        },
        
        // Context management
        initializeContext: () => {
          const state = get();
          if (!state.context) {
            set({
              context: {
                currentChapterContext: {
                  chapterNumber: state.currentChapter,
                  summary: '',
                  keyEvents: [],
                  theme: ''
                },
                previousChoices: [],
                narrativeContext: {
                  mainPlotPoints: [],
                  characterDevelopment: [],
                  currentTheme: ''
                },
                lastUpdated: new Date().toISOString()
              }
            });
          }
        },
        
        validateContext: (context: StoryContext) => {
          // Validate required fields
          if (!context.currentChapterContext || 
              !context.previousChoices || 
              !context.narrativeContext || 
              !context.lastUpdated) {
            return false;
          }
          
          // Validate chapter context
          const { currentChapterContext } = context;
          if (typeof currentChapterContext.chapterNumber !== 'number' ||
              typeof currentChapterContext.summary !== 'string' ||
              !Array.isArray(currentChapterContext.keyEvents) ||
              typeof currentChapterContext.theme !== 'string') {
            return false;
          }
          
          // Validate narrative context
          const { narrativeContext } = context;
          if (!Array.isArray(narrativeContext.mainPlotPoints) ||
              !Array.isArray(narrativeContext.characterDevelopment) ||
              typeof narrativeContext.currentTheme !== 'string') {
            return false;
          }
          
          // Validate choice history
          if (!Array.isArray(context.previousChoices)) {
            return false;
          }
          
          // All validations passed
          return true;
        },
        
        cleanupContext: () => {
          set({ context: null });
        },

        // Content processing
        processContent: (text: string) => {
          const { currentChapter, currentPage } = get();
          const sections: ProcessedContent['sections'] = {
            title: { text: '', isComplete: false },
            chapter: { text: '', isComplete: false },
            narrative: { text: '', paragraphs: [], isComplete: false },
            choices: { text: '', parsed: [], isComplete: false }
          };
          let updatedContent: Partial<StoryResponse> = {};
          
          // Process chapter
          if (text.includes('###CHAPTER###')) {
            const chapterMatch = text.match(/###CHAPTER###\s*(.*?)(?=###|$)/);
            if (chapterMatch) {
              const chapterText = chapterMatch[1].trim();
              const isComplete = Boolean(
                chapterText.includes(':') && 
                chapterText.match(/^Chapter \d+:/i) && 
                chapterText.split(':')[1].trim().length > 0
              );
              
              sections.chapter = {
                text: isComplete ? chapterText : `Chapter ${currentChapter}`,
                isComplete
              };

              if (isComplete) {
                const [number, ...nameParts] = chapterText.split(':');
                updatedContent.chapter = {
                  number: parseInt(number.replace('Chapter', '').trim()),
                  name: nameParts.join(':').trim()
                };
              }
            }
          }

          // Process story title
          if (text.includes('###TITLE###')) {
            const titleMatch = text.match(/###TITLE###\s*(.*?)(?=###|$)/);
            if (titleMatch) {
              const titleText = titleMatch[1].trim();
              const isComplete = titleText.length > 0;
              
              sections.title = {
                text: titleText,
                isComplete
              };

              if (isComplete) {
                updatedContent.title = titleText;
              }
            }
          }

          // Process narrative
          if (text.includes('###NARRATIVE###')) {
            const narrativeMatch = text.match(/###NARRATIVE###\s*([\s\S]*?)(?=###|$)/);
            if (narrativeMatch) {
              const narrativeText = narrativeMatch[1].trim();
              const paragraphs = narrativeText.split('\n\n').filter(p => p.length > 0);
              const isComplete = paragraphs.length >= 1;
              
              sections.narrative = {
                text: narrativeText,
                paragraphs,
                isComplete
              };
            }
          }

          // Process choices
          if (text.includes('###CHOICES###')) {
            const choicesMatch = text.match(/###CHOICES###\s*([\s\S]*?)(?=###|$)/);
            if (choicesMatch) {
              const choicesText = choicesMatch[1].trim();
              let parsed: string[] = [];
              let isComplete = false;

              try {
                if (choicesText.startsWith('[') && choicesText.endsWith(']')) {
                  const parsedChoices = JSON.parse(choicesText);
                  if (Array.isArray(parsedChoices)) {
                    parsed = parsedChoices;
                    isComplete = parsed.length === 4;
                  }
                }
              } catch (e) {
                console.log('Choices parsing incomplete:', choicesText);
              }

              sections.choices = {
                text: choicesText,
                parsed,
                isComplete
              };

              if (isComplete) {
                updatedContent.page = {
                  ...(updatedContent.page || { number: currentPage, content: [] }),
                  choices: parsed
                };
              }
            }
          }

          return { sections, updatedContent };
        },

        // Navigation
        handleNext: async () => {
          const state = get();
          const {
            selectedChoice,
            currentPage,
            currentChapter,
            content,
            setSelectedChoice,
            setPreviousChoice,
            setCurrentChapter,
            setCurrentPage,
            setContent,
            updateChoiceHistory,
            initializeContext
          } = state;

          if (selectedChoice === null) {
            console.log('[handleNext] No choice selected');
            return;
          }

          // Store the selected choice text
          const choiceText = content.page?.choices?.[selectedChoice];
          if (!choiceText) {
            console.log('[handleNext] No choice text found');
            return;
          }

          // Initialize context if needed
          initializeContext();

          // Update choice history
          updateChoiceHistory(choiceText);

          // Calculate next page/chapter
          let nextChapter = currentChapter;
          let nextPage = currentPage + 1;

          if (nextPage > 5) {
            nextChapter++;
            nextPage = 1;
          }

          if (nextChapter > 5) {
            console.log('[handleNext] Story complete');
            return;
          }

          // Update navigation state
          setSelectedChoice(null);
          setPreviousChoice(choiceText);
          setCurrentChapter(nextChapter);
          setCurrentPage(nextPage);
          setContent({});

          // Start streaming new content
          await state.streamStory();
        },

        handlePrevious: () => {
          const {
            currentPage,
            currentChapter,
            setSelectedChoice,
            setCurrentChapter,
            setCurrentPage,
            setPreviousChoice
          } = get();

          setSelectedChoice(null);
          if (currentPage === 1) {
            if (currentChapter === 1) return;
            setCurrentChapter(currentChapter - 1);
            setCurrentPage(5);
          } else {
            setCurrentPage(currentPage - 1);
          }
          setPreviousChoice(null);
        },

        // Story streaming
        streamStory: async () => {
          const {
            currentChapter,
            currentPage,
            previousChoice,
            setLoading,
            setError,
            setContent,
            setStreamingContent,
            processContent,
            cleanup,
            setAbortController,
            setActiveStream,
            context
          } = get();

          try {
            cleanup();
            setLoading(true);
            setError(null);
            setActiveStream(true);

            const controller = new AbortController();
            setAbortController(controller);

            const response = await fetch('/api/story-generator', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                currentChapter,
                currentPage,
                context,
                previousChoice
              }),
              signal: controller.signal
            });

            if (!response.ok) throw new Error('Failed to generate story');

            const reader = response.body?.getReader();
            if (!reader) throw new Error('No reader available');

            let accumulatedText = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const text = new TextDecoder().decode(value);
              accumulatedText += text;

              const { sections, updatedContent } = processContent(accumulatedText);
              
              setStreamingContent({
                raw: accumulatedText,
                sections
              });

              if (Object.keys(updatedContent).length > 0) {
                setContent((prevContent: Partial<StoryResponse>) => ({
                  ...prevContent,
                  ...updatedContent
                }));
              }
            }

            setLoading(false);
            setActiveStream(false);
            setAbortController(null);
          } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') return;
            
            setError(error instanceof Error ? error.message : 'An error occurred');
            setLoading(false);
            setActiveStream(false);
            setAbortController(null);
          }
        }
      })
    )
  )
);
