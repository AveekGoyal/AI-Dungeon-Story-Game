'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AuthNavbar } from "@/components/layout/auth-navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { medievalSharp } from "@/lib/typography";
import { cn } from "@/lib/utils";
import { StoryContent } from "@/components/story/story-content";
import { StoryChoices } from "@/components/story/story-choices";
import { motion } from 'framer-motion';
import { Choice } from "@/types/story";

interface GameState {
  currentLocation: string;
  availableChoices: Choice[];
  lastChoice: string | null;
  questStatus: string;
  currentScene?: {
    description: {
      scene: string;
      story: string;
    };
  };
}

interface Story {
  id: string;
  title: string;
  description: {
    scene: string;
    story: string;
  };
  genre: {
    name: string;
    description: string;
  };
  character: {
    name: string;
    class: string;
    status: {
      health: number;
      mana: number;
    };
  };
  gameState: GameState;
  currentChapter: number;
}

export default function StoryPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [story, setStory] = useState<Story | null>(null);
  const [chapter, setChapter] = useState(1);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string>();
  const hasGeneratedRef = useRef(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in');
      return;
    }
  }, [status, router]);

  useEffect(() => {
    const fetchInitialStory = async () => {
      if (!session?.user || !params.id || hasGeneratedRef.current) return;

      try {
        setIsLoading(true);
        hasGeneratedRef.current = true;

        const response = await fetch(`/api/stories/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch story');

        const data = await response.json();
        setStory(data.story);
        setChapter(data.story.currentChapter || 1);

        if (!data.story.gameState?.currentScene) {
          await generateScene(data.story);
        }
      } catch (error) {
        setError('Failed to load story');
        toast({
          title: "Error",
          description: "Failed to load story. Please try again.",
          variant: "destructive",
        });
        hasGeneratedRef.current = false;
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialStory();
  }, [session?.user?.email, params.id]);

  const generateScene = async (currentStory: Story | null = story) => {
    if (!currentStory || !params.id) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/stories/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: "generate",
          currentState: {
            location: currentStory.gameState?.currentLocation || 'Starting Point',
            chapter,
            lastChoice: currentStory.gameState?.lastChoice || null,
            questStatus: currentStory.gameState?.questStatus || 'ongoing',
            character: {
              name: currentStory.character.name,
              class: currentStory.character.class,
              health: currentStory.character.status?.health || 100,
              mana: currentStory.character.status?.mana || 100
            },
            genre: currentStory.genre.name
          }
        })
      });

      if (!response.ok) throw new Error('Failed to generate scene');

      const data = await response.json();
      setStory(prevStory => ({
        ...prevStory!,
        gameState: {
          ...prevStory!.gameState,
          currentScene: data.scene
        }
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate scene. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoice = async (choice: Choice) => {
    if (isLoading) return;
    setSelectedChoiceId(choice.id);
    setIsLoading(true);

    try {
      const response = await fetch('/api/story-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storyId: story.id,
          choiceId: choice.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process choice');
      }

      const data = await response.json();
      updateStory(data);
    } catch (error) {
      console.error('Error processing choice:', error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <AuthNavbar />
        <div className="container mx-auto p-4 mt-8 text-center">
          <h1 className="text-2xl text-red-500 mb-4">{error}</h1>
          <Button onClick={() => router.push('/dashboard')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  if (isLoading || !story) {
    return (
      <div className="min-h-screen bg-black text-white">
        <AuthNavbar />
        <div className="container mx-auto p-4 mt-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AuthNavbar />
      <Toaster />
      
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/images/stars.png')] opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
      
      <div className="container mx-auto p-4 mt-20 relative">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Character Status */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="p-4 shadow-lg border border-red-900/20 bg-black/40 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className={cn(
                    medievalSharp.className,
                    "text-3xl bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text"
                  )}>
                    {story.character.name}
                  </h1>
                  <p className="text-gray-400">{story.character.class}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-red-500">❤</div>
                    <div className="text-gray-200">{story.character.status.health}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-500">✧</div>
                    <div className="text-gray-200">{story.character.status.mana}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400">Location</div>
                    <div className="text-gray-200">{story.gameState.currentLocation}</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Story Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <StoryContent
              title={story.title}
              description={story.gameState.currentScene?.description || story.description}
              chapter={chapter}
              page={page}
            />
          </motion.div>

          {/* Choices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StoryChoices
              choices={story.gameState.availableChoices}
              onSelect={handleChoice}
              isLoading={isLoading}
              selectedChoiceId={selectedChoiceId}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}