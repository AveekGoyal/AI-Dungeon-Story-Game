import { useState, useEffect, useCallback, useRef } from 'react';
import { StreamingState, StoryResponse, ProcessedContent } from '@/types/story';
import { useStoryStore } from '@/store/story';

interface UseStoryStreamProps {
  storyId?: string;
  chapterNumber?: number;
  pageNumber?: number;
  previousChoice?: string;
}

interface UseStoryStreamReturn {
  content: Partial<StoryResponse>;
  streamingContent: ProcessedContent;
  isLoading: boolean;
  error: string | null;
  streamStory: () => Promise<void>;
}

export function useStoryStream({ 
  storyId,
  chapterNumber = 1, 
  pageNumber = 1, 
  previousChoice 
}: UseStoryStreamProps): UseStoryStreamReturn {
  // Get store actions
  const {
    setStoryId,
    setCurrentChapter,
    setCurrentPage,
    setPreviousChoice,
    setContent,
    setStreamingContent: setStoreStreamingContent,
    setLoading,
    setError: setStoreError,
    setActiveStream
  } = useStoryStore();

  // Local state for performance
  const [state, setState] = useState<{
    content: Partial<StoryResponse>;
    streamingContent: ProcessedContent;
    isLoading: boolean;
    error: string | null;
  }>({
    content: {},
    streamingContent: {
      raw: '',
      sections: {}
    },
    isLoading: false,
    error: null
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const activeStreamRef = useRef<boolean>(false);

  // Sync with store when props change
  useEffect(() => {
    if (storyId) setStoryId(storyId);
    setCurrentChapter(chapterNumber);
    setCurrentPage(pageNumber);
    if (previousChoice !== undefined) setPreviousChoice(previousChoice);
  }, [storyId, chapterNumber, pageNumber, previousChoice, setStoryId, setCurrentChapter, setCurrentPage, setPreviousChoice]);

  // Process streaming content into sections
  const processContent = useCallback((text: string, currentChapter: number) => {
    const sections: ProcessedContent['sections'] = {};
    let updatedContent: Partial<StoryResponse> = {};
    
    // Process chapter
    if (text.includes('###CHAPTER###')) {
      const chapterMatch = text.match(/###CHAPTER###\s*([\s\S]*?)(?=###|$)/);
      if (chapterMatch) {
        const chapterText = chapterMatch[1].trim();
        
        // Check if the chapter title is complete - must end with a period or newline
        // and be at least 20 characters long (e.g., "Chapter 1: The Begin" is 20 chars)
        const isComplete = (chapterText.endsWith('.') || chapterText.includes('\n')) && 
                         chapterText.length >= 20;
        
        if (isComplete) {
          // Clean up the chapter text - remove period and get the actual title
          const cleanTitle = chapterText.replace(/\.$/, '').trim();
          sections.chapter = {
            text: cleanTitle,
            isComplete: true
          };
          
          updatedContent.chapter = {
            number: currentChapter,
            name: cleanTitle
          };
        } else {
          // If not complete, don't show partial title
          sections.chapter = {
            text: `Chapter ${currentChapter}`,
            isComplete: false
          };
        }
      }
    }

    // Process story title (only at the start)
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
          // Try to parse as JSON array
          if (choicesText.startsWith('[') && choicesText.endsWith(']')) {
            const parsedChoices = JSON.parse(choicesText);
            if (Array.isArray(parsedChoices)) {
              parsed = parsedChoices;
              isComplete = parsed.length === 4;
            }
          }
        } catch (e) {
          // If parsing fails, treat as incomplete
          console.log('Choices parsing incomplete:', choicesText);
        }

        sections.choices = {
          text: choicesText,
          parsed,
          isComplete
        };

        if (isComplete) {
          updatedContent.page = {
            ...(updatedContent.page || { number: pageNumber, content: [] }),
            choices: parsed
          };
        }
      }
    }

    // Sync complete content with store
    if (Object.keys(updatedContent).length > 0) {
      setContent(updatedContent);
    }

    // Only sync streaming content with store when sections are complete
    const hasCompleteSection = Object.values(sections).some(section => section?.isComplete);
    if (hasCompleteSection) {
      setStoreStreamingContent({
        raw: text,
        sections
      });
    }

    return { sections, updatedContent };
  }, []);

  const streamStory = useCallback(async () => {
    // Clean up any existing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    activeStreamRef.current = true;
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/story-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chapterNumber, pageNumber, previousChoice }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) throw new Error('Failed to generate story');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      const decoder = new TextDecoder();
      let buffer = '';

      while (activeStreamRef.current) {
        const { done, value } = await reader.read();
        
        if (done) {
          setState(prev => ({ ...prev, isLoading: false }));
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Process the current buffer content
        const { sections, updatedContent } = processContent(buffer, chapterNumber);

        // Update state with new content
        setState(prev => ({
          ...prev,
          content: { ...prev.content, ...updatedContent },
          streamingContent: {
            raw: buffer,
            sections: {
              ...prev.streamingContent.sections,
              ...sections
            }
          }
        }));
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Stream aborted');
      } else {
        // Sync error state with store
        if (error instanceof Error) {
          const errorMessage = error.message;
          setStoreError(errorMessage);
        } else {
          setStoreError('An error occurred');
        }
        setLoading(false);
        setActiveStream(false);
      }
    }
  }, [chapterNumber, pageNumber, previousChoice, processContent]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      activeStreamRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    content: state.content,
    streamingContent: state.streamingContent,
    isLoading: state.isLoading,
    error: state.error,
    streamStory
  };
}
