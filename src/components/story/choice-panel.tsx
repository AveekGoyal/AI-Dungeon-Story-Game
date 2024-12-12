"use client"

import { medievalSharp } from "@/lib/typography"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type Choice = {
  id: string
  text: string
}

type ChoicePanelProps = {
  choices: Choice[]
  selectedChoice: string | null
  onChoiceSelect: (choiceId: string) => void
}

export function ChoicePanel({ choices, selectedChoice, onChoiceSelect }: ChoicePanelProps) {
  return (
    <div className="space-y-6">
      <h3 className={cn(medievalSharp.className, "text-xl text-primary")}>
        What will you do?
      </h3>
      <div className="space-y-4">
        {choices.map((choice) => (
          <Button
            key={choice.id}
            variant={selectedChoice === choice.id ? "default" : "outline"}
            className={cn(
              "w-full p-6 text-left justify-start",
              selectedChoice === choice.id && "ring-2 ring-primary"
            )}
            onClick={() => onChoiceSelect(choice.id)}
          >
            <span className="text-lg">{choice.text}</span>
          </Button>
        ))}
      </div>
      {selectedChoice && (
        <Button 
          className="w-full"
          size="lg"
        >
          Continue Your Journey
        </Button>
      )}
    </div>
  )
}
