import { useState, useEffect, useCallback, useRef } from 'react';
import { StreamingState, StoryResponse, ProcessedContent } from '@/types/story';

interface UseStoryStreamProps {
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
  chapterNumber = 1, 
  pageNumber = 1, 
  previousChoice 
}: UseStoryStreamProps): UseStoryStreamReturn {
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

  // Process streaming content into sections
  const processContent = useCallback((text: string, currentChapter: number) => {
    const sections: ProcessedContent['sections'] = {};
    let updatedContent: Partial<StoryResponse> = {};
    
    // Process chapter
    if (text.includes('###CHAPTER###')) {
      const chapterMatch = text.match(/###CHAPTER###\s*(.*?)(?=###|$)/);
      if (chapterMatch) {
        const chapterText = chapterMatch[1].trim();
        // Only consider chapter complete if it has both number and name with proper format
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
        setState(prev => ({
          ...prev,
          error: error.message || 'Failed to stream story',
          isLoading: false
        }));
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
