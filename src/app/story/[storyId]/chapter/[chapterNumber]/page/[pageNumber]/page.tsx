'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { medievalSharp } from "@/lib/typography";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useStoryStream } from "@/hooks/useStoryStream";
import { useStoryStore } from "@/store/story";
import { AuthNavbar } from "@/components/layout/auth-navbar";

export default function StoryPage() {
  const router = useRouter();
  const params = useParams();
  const [initialized, setInitialized] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [previousChoice, setPreviousChoice] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize from URL params
  useEffect(() => {
    if (typeof params.chapterNumber === 'string') {
      setCurrentChapter(parseInt(params.chapterNumber, 10));
    }
    if (typeof params.pageNumber === 'string') {
      setCurrentPage(parseInt(params.pageNumber, 10));
    }
  }, [params.chapterNumber, params.pageNumber]);

  // Get story metadata from store
  const storyMetadata = useStoryStore(state => state.metadata);
  const setMetadata = useStoryStore(state => state.setMetadata);
  const getChapterTitle = useStoryStore(state => state.getChapterTitle);
  const setChapterMetadata = useStoryStore(state => state.setChapterMetadata);

  // Fetch story metadata if not in store
  useEffect(() => {
    const fetchStoryMetadata = async () => {
      if (!storyMetadata && params.storyId) {
        console.log('[StoryPage] Fetching metadata for story:', params.storyId);
        try {
          const response = await fetch(`/api/stories/${params.storyId}`);
          if (response.ok) {
            const story = await response.json();
            console.log('[StoryPage] Received story metadata:', story);
            
            // Handle the MongoDB document format
            const metadata = {
              title: story.title,
              description: story.description,
              genre: {
                name: story.genre.name,
                description: story.genre.description
              },
              character: {
                name: story.character.name,
                class: story.character.class,
                stats: story.character.stats
              }
            };
            
            console.log('[StoryPage] Setting metadata in store:', metadata);
            setMetadata(metadata);
          } else {
            console.error('[StoryPage] Failed to fetch metadata:', response.status);
          }
        } catch (error) {
          console.error('[StoryPage] Error fetching story metadata:', error);
        }
      }
    };

    fetchStoryMetadata();
  }, [params.storyId, storyMetadata, setMetadata]);

  const { 
    content, 
    streamingContent, 
    isLoading, 
    error, 
    streamStory 
  } = useStoryStream({
    storyId: params.storyId as string,
    chapterNumber: currentChapter,
    pageNumber: currentPage,
    previousChoice: previousChoice || undefined
  });

  // Update chapter metadata when chapter title is generated
  useEffect(() => {
    if (streamingContent.sections.chapter?.isComplete && currentChapter) {
      const chapterText = streamingContent.sections.chapter.text;
      const existingTitle = getChapterTitle(currentChapter);
      
      // Only update if we don't have a title for this chapter yet
      if (!existingTitle && chapterText) {
        // At this point, chapterText is guaranteed to be complete
        console.log(`[StoryPage] Setting chapter ${currentChapter} title:`, chapterText);
        setChapterMetadata(currentChapter, { 
          title: chapterText.startsWith('Chapter') ? chapterText : `Chapter ${currentChapter}: ${chapterText}`
        });
      }
    }
  }, [currentChapter, streamingContent.sections.chapter, getChapterTitle, setChapterMetadata]);

  // Initial story load
  useEffect(() => {
    if (!initialized) {
      streamStory();
      setInitialized(true);
    }
  }, [initialized, streamStory]);

  useEffect(() => {
    if (!isLoading && content.page?.choices) {
      setPreviousChoice(null);
    }
  }, [content.page?.choices, isLoading]);

  const handleNext = useCallback(async () => {
    if (selectedChoice === null) return;
    
    setIsGenerating(true);
    setSelectedChoice(null);

    const choice = content.page?.choices?.[selectedChoice];
    if (!choice) return;

    setPreviousChoice(choice);

    let nextChapter = currentChapter;
    let nextPage = currentPage;

    if (currentPage >= 5) {
      if (currentChapter === 5) {
        return;
      }
      nextChapter = currentChapter + 1;
      nextPage = 1;
      setCurrentChapter(nextChapter);
      setCurrentPage(nextPage);
    } else {
      nextPage = currentPage + 1;
      setCurrentPage(nextPage);
    }
    
    router.push(`/story/${params.storyId}/chapter/${nextChapter}/page/${nextPage}`);
    await streamStory();
    setIsGenerating(false);
  }, [selectedChoice, currentPage, currentChapter, content.page?.choices, streamStory, params.storyId, router]);

  const handlePrevious = () => {
    setSelectedChoice(null);
    
    let prevChapter = currentChapter;
    let prevPage = currentPage;

    if (currentPage === 1) {
      if (currentChapter === 1) {
        return;
      }
      prevChapter = currentChapter - 1;
      prevPage = 5;
      setCurrentChapter(prevChapter);
      setCurrentPage(prevPage);
    } else {
      prevPage = currentPage - 1;
      setCurrentPage(prevPage);
    }

    setPreviousChoice(null);
    router.push(`/story/${params.storyId}/chapter/${prevChapter}/page/${prevPage}`);
  };

  // Display content
  const storedChapterTitle = getChapterTitle(currentChapter);
  const displayChapter = storedChapterTitle || 
    (streamingContent.sections.chapter?.isComplete ? 
      (streamingContent.sections.chapter.text.startsWith('Chapter') ? 
        streamingContent.sections.chapter.text : 
        `Chapter ${currentChapter}: ${streamingContent.sections.chapter.text}`) : 
      `Chapter ${currentChapter}`);
  const displayNarrative = streamingContent.sections.narrative?.paragraphs || ['Your story continues...'];
  const displayChoices = streamingContent.sections.choices?.isComplete ? 
    streamingContent.sections.choices.parsed || [] : [];
  const displayTitle = storyMetadata?.title || streamingContent.sections.title?.text || 'Your Adventure';
  const showChoices = streamingContent.sections.choices?.isComplete;

  return (
    <>
      <AuthNavbar />
      <div className="min-h-screen bg-black/90 text-white">
        <div className="p-6 pt-24 max-w-4xl mx-auto">
          {/* Navigation Bar */}
          <Card className="w-full bg-black/40 backdrop-blur-sm border border-red-900/20 shadow-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <h1 className={cn(
                medievalSharp.className,
                "text-4xl bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text"
              )}>
                {displayTitle}
              </h1>
              <div className="text-gray-400">
                Chapter {currentChapter} of 5 • Page {currentPage} of 5
              </div>
            </div>
          </Card>

          {/* Progress Section */}
          <Card className="w-full bg-black/40 backdrop-blur-sm border border-red-900/20 shadow-lg p-4 mb-6">
            <div className="flex flex-col items-center">
              <div className="w-full bg-red-900/20 h-2 rounded-full mb-2">
                <div 
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${((currentChapter - 1) * 5 + currentPage) / 25 * 100}%` }}
                />
              </div>
              <h2 className={cn(
                medievalSharp.className,
                "text-2xl text-red-400"
              )}>
                {displayChapter}
              </h2>
            </div>
          </Card>

          {/* Story Content */}
          <Card className="w-full bg-black/40 backdrop-blur-sm border border-red-900/20 shadow-lg mb-6">
            <div className="p-8 space-y-6 max-w-3xl mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
              <AnimatePresence mode="wait">
                {isLoading && !streamingContent.sections.narrative?.paragraphs.length ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-gray-400"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        ⌛
                      </motion.div>
                      Generating story...
                    </div>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center text-red-400"
                  >
                    {error}
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {displayNarrative.map((paragraph, index) => (
                      <motion.p 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`text-gray-200 leading-relaxed ${index === 0 ? 'first-letter:text-4xl first-letter:font-bold first-letter:mr-1 first-letter:float-left first-letter:text-red-500' : ''}`}
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </Card>

          {/* Choices */}
          {showChoices && (
            <Card className="w-full bg-black/40 backdrop-blur-sm border border-red-900/20 shadow-lg mb-6">
              <div className="p-4 border-b border-red-900/20">
                <h3 className={cn(
                  medievalSharp.className,
                  "text-2xl bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text text-center"
                )}>
                  What Will You Do?
                </h3>
              </div>
              <div className="p-6 space-y-4 max-w-3xl mx-auto">
                <AnimatePresence mode="wait">
                  {isLoading && !displayChoices.length ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center text-gray-400"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          ⌛
                        </motion.div>
                        Generating choices...
                      </div>
                    </motion.div>
                  ) : (
                    displayChoices.map((choice, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full text-left p-4 border-2 border-red-900/50 bg-black/40 hover:bg-red-900/20 transition-all",
                            "text-gray-200 hover:text-red-400 hover:border-red-500",
                            "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]",
                            selectedChoice === index && "bg-red-900/30 border-red-500 text-red-400 shadow-[inset_0_0_10px_rgba(185,28,28,0.2)]"
                          )}
                          onClick={() => setSelectedChoice(index)}
                        >
                          <span className="mr-2 text-red-400">{index + 1}.</span> {choice}
                        </Button>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </Card>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between gap-4 max-w-3xl mx-auto">
            <Button
              className={cn(
                "w-32 bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              onClick={handlePrevious}
              disabled={currentPage === 1 && currentChapter === 1 || isLoading}
            >
              Previous
            </Button>

            {selectedChoice !== null && !isLoading && (
              <Button
                className={cn(
                  "w-32 bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                onClick={handleNext}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
