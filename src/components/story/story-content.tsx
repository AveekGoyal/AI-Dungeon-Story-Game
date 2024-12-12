import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { medievalSharp, lora } from "@/lib/typography";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StoryContentProps {
  title: string;
  description: {
    scene?: string;
    story?: string;
  };
  chapter: number;
  page: number;
}

export function StoryContent({ title, description, chapter, page }: StoryContentProps) {
  // Safely split story into paragraphs if it exists
  const storyParagraphs = description?.story?.split('\n\n') || [];

  return (
    <Card className="w-full bg-black/40 backdrop-blur-sm border border-red-900/20 shadow-lg overflow-hidden">
      {/* Story Header */}
      <div className="p-6 border-b border-red-900/20">
        <div className="flex justify-between items-center mb-2">
          <h2 className={cn(
            medievalSharp.className,
            "text-3xl bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text"
          )}>
            {title}
          </h2>
          <span className="text-gray-400 text-sm">
            Chapter {chapter} • Page {page}/5
          </span>
        </div>
      </div>

      {/* Story Content */}
      <ScrollArea className="h-[60vh]">
        <div className="p-6 space-y-6">
          {/* Scene Description */}
          {description?.scene && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-950/20 p-4 rounded-lg border border-red-900/20"
            >
              <h3 className={cn(
                medievalSharp.className,
                "text-xl text-red-400 mb-3"
              )}>
                The Scene
              </h3>
              <p className={cn(
                lora.className,
                "text-gray-300 leading-relaxed"
              )}>
                {description.scene}
              </p>
            </motion.div>
          )}

          {/* Main Story */}
          {storyParagraphs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {storyParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={cn(
                    lora.className,
                    "text-gray-200 leading-relaxed text-lg"
                  )}
                >
                  {paragraph}
                </p>
              ))}
            </motion.div>
          )}

          {/* Loading State */}
          {!description?.scene && !description?.story && (
            <div className="flex items-center justify-center h-32 text-gray-400">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Loading story...
              </motion.div>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}