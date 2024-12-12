'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthNavbar } from "@/components/layout/auth-navbar";
import { Button } from "@/components/ui/button";

interface Choice {
  id: string;
  text: string;
}

export default function GamePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const storyId = searchParams.get('id'); // Updated to match URL parameter
  
  const [firstParagraph, setFirstParagraph] = useState('');
  const [mainStory, setMainStory] = useState('');
  const [choices, setChoices] = useState<Choice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chapter, setChapter] = useState(1);
  const [page, setPage] = useState(1);
  const [previousChoice, setPreviousChoice] = useState('');

  useEffect(() => {
    if (!storyId) {
      router.push('/dashboard');
      return;
    }

    if (status === 'authenticated') {
      generateStory();
    }
  }, [storyId, chapter, page, status]);

  const generateStory = async () => {
    if (!session?.user?.email) return;
    
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: previousChoice,
          currentState: {
            location: '',
            chapter: chapter,
            character: {
              name: '',
              class: '',
              health: 0,
              mana: 0
            },
            genre: ''
          }
        })
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let foundFirstParagraph = false;
      let foundStoryEnd = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value);

        // Check for markers and update state accordingly
        if (!foundFirstParagraph && buffer.includes('[[FIRST_PARAGRAPH]]')) {
          const [first] = buffer.split('[[FIRST_PARAGRAPH]]');
          setFirstParagraph(first.trim());
          buffer = buffer.slice(buffer.indexOf('[[FIRST_PARAGRAPH]]') + 19);
          foundFirstParagraph = true;
        }

        if (!foundStoryEnd && buffer.includes('[[STORY_CONTINUATION]]')) {
          const [story] = buffer.split('[[STORY_CONTINUATION]]');
          setMainStory(story.trim());
          buffer = buffer.slice(buffer.indexOf('[[STORY_CONTINUATION]]') + 22);
          foundStoryEnd = true;
        }

        if (buffer.includes('[[CHOICES]]')) {
          const choicesJson = buffer.split('[[CHOICES]]')[1].trim();
          try {
            const parsedChoices = JSON.parse(choicesJson);
            setChoices(parsedChoices);
          } catch (e) {
            console.error('Failed to parse choices:', e);
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const handleChoice = async (choice: Choice) => {
    setPreviousChoice(choice.text);
    setPage(page + 1);
    if (page >= 5) { // Assuming 5 pages per chapter
      setChapter(chapter + 1);
      setPage(1);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthNavbar />
      
      <div className="container mx-auto p-4 mt-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Chapter {chapter}</h1>
            <div className="text-sm text-muted-foreground">Page {page}/5</div>
          </div>

          {isLoading ? (
            <div className="text-center">
              <div className="animate-pulse">Generating your story...</div>
            </div>
          ) : (
            <>
              <div className="prose mb-6 space-y-4">
                <p className="text-lg font-medium">{firstParagraph}</p>
                <p>{mainStory}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                {choices.map((choice, index) => (
                  <Button
                    key={choice.id || index}
                    onClick={() => handleChoice(choice)}
                    variant="outline"
                    className="p-4 h-auto text-left"
                  >
                    {choice.text}
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
