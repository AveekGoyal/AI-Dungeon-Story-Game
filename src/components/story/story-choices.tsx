import React from 'react';
import { Card } from "@/components/ui/card";
import { medievalSharp, lora } from "@/lib/typography";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Shield, Heart, Sword, Brain, Map, Scale } from "lucide-react";
import { Choice, Requirement } from "@/types/story";

interface StoryChoicesProps {
  choices: Choice[];
  onSelect: (choice: Choice) => void;
  isLoading: boolean;
  selectedChoiceId?: string;
}

const choiceIcons: Record<string, React.ReactNode> = {
  combat: <Sword className="w-5 h-5 text-red-400" />,
  social: <Heart className="w-5 h-5 text-pink-400" />,
  exploration: <Map className="w-5 h-5 text-blue-400" />,
  puzzle: <Brain className="w-5 h-5 text-purple-400" />,
  moral: <Scale className="w-5 h-5 text-yellow-400" />,
  resource: <Shield className="w-5 h-5 text-emerald-400" />
};

export function StoryChoices({ choices, onSelect, isLoading, selectedChoiceId }: StoryChoicesProps) {
  if (!choices?.length) {
    return (
      <Card className="w-full mt-6 bg-black/40 backdrop-blur-sm border border-red-900/20 shadow-lg p-6">
        <div className="text-center text-gray-400">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Loading choices...
          </motion.div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full mt-6 bg-black/40 backdrop-blur-sm border border-red-900/20 shadow-lg">
      <div className="p-4 border-b border-red-900/20">
        <h3 className={cn(
          medievalSharp.className,
          "text-2xl bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text"
        )}>
          What Will You Do?
        </h3>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {choices.map((choice, index) => (
            <motion.button
              key={choice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect(choice)}
              disabled={isLoading}
              className={cn(
                "relative p-4 rounded-lg border text-left transition-all duration-200",
                selectedChoiceId === choice.id
                  ? "bg-red-950/40 border-red-500/50 text-red-200"
                  : "bg-red-950/20 hover:bg-red-950/40 border-red-900/20 text-gray-300 hover:border-red-500/30"
              )}
            >
              {/* Choice Number and Type */}
              <div className="flex items-center gap-3 mb-3">
                <div className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full border text-sm",
                  selectedChoiceId === choice.id 
                    ? "border-red-500 text-red-500"
                    : "border-red-900/50 text-red-900/50"
                )}>
                  {index + 1}
                </div>
                {choice.type && choiceIcons[choice.type.toLowerCase()]}
                <div className="text-sm text-gray-400 capitalize">
                  {choice.type?.toLowerCase()}
                </div>
              </div>

              {/* Choice Text */}
              <p className={cn(
                lora.className,
                "text-lg mb-3"
              )}>
                {choice.text}
              </p>

              {/* Requirements */}
              {choice.requirements?.primary && (
                <div className="text-sm text-gray-400">
                  <span className="text-red-400">Requires:</span>{' '}
                  {choice.requirements.primary.type}{' '}
                  ({choice.requirements.primary.value})
                  {choice.requirements.alternative && (
                    <>
                      <br />
                      <span className="text-blue-400">Alternative:</span>{' '}
                      {choice.requirements.alternative.type}{' '}
                      ({choice.requirements.alternative.value})
                    </>
                  )}
                </div>
              )}

              {/* Loading Overlay */}
              {isLoading && selectedChoiceId === choice.id && (
                <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                  <div className="animate-pulse text-red-400">Processing...</div>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </Card>
  );
}