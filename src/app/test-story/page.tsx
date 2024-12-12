'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { medievalSharp } from "@/lib/typography";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AuthNavbar } from "@/components/layout/auth-navbar";
import { useStoryStream } from "@/hooks/useStoryStream";

export default function TestStoryPage() {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [previousChoice, setPreviousChoice] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const { 
    content, 
    streamingContent, 
    isLoading, 
    error, 
    streamStory 
  } = useStoryStream({
    chapterNumber: currentChapter,
    pageNumber: currentPage,
    previousChoice: previousChoice || undefined
  });

  useEffect(() => {
    if (!initialized) {
      streamStory();
      setInitialized(true);
    }
  }, [initialized, streamStory]);

  // Display streaming content while loading
  const displayChapter = streamingContent.sections.chapter?.text || 'Chapter 1: A New Beginning';
  const displayNarrative = streamingContent.sections.narrative?.paragraphs || ['Once upon a time...'];
  const displayChoices = streamingContent.sections.choices?.isComplete ? 
    streamingContent.sections.choices.parsed || [] : [];
  const displayTitle = streamingContent.sections.title?.text || 'Your Adventure Begins';

  // Show choices section when we have complete choices
  const showChoices = streamingContent.sections.choices?.isComplete;

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

    if (currentPage >= 5) {
      if (currentChapter === 5) {
        return;
      }
      setCurrentChapter(prev => prev + 1);
      setCurrentPage(1);
    } else {
      setCurrentPage(prev => prev + 1);
    }
    
    await streamStory();
    setIsGenerating(false);
  }, [selectedChoice, currentPage, currentChapter, content.page?.choices, streamStory]);

  const handlePrevious = () => {
    setSelectedChoice(null);
    if (currentPage === 1) {
      if (currentChapter === 1) {
        return;
      }
      setCurrentChapter(prev => prev - 1);
      setCurrentPage(5);
    } else {
      setCurrentPage(prev => prev - 1);
    }
    setPreviousChoice(null);
  };

  return (
    <>
      <AuthNavbar />
      <div className="min-h-screen bg-black/90 text-white p-6 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Navigation Bar */}
          <Card className="w-full bg-black/40 backdrop-blur-sm border border-red-900/20 shadow-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <h1 className={cn(
                medievalSharp.className,
                "text-4xl bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text"
              )}>
                {streamingContent.sections.title?.isComplete 
                  ? streamingContent.sections.title.text
                  : isLoading 
                    ? "Crafting your tale..." 
                    : "Your Adventure Begins"}
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
                {streamingContent.sections.chapter?.isComplete
                  ? streamingContent.sections.chapter.text
                  : ''}
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
              disabled={currentChapter === 1 && currentPage === 1 || isLoading}
            >
              Previous
            </Button>

            {selectedChoice !== null && !isGenerating && (
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
