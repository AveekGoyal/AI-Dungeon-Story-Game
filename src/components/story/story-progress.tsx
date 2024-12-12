"use client"

import { medievalSharp } from "@/lib/typography"
import { cn } from "@/lib/utils"

type StoryProgressProps = {
  chapter: number
}

export function StoryProgress({ chapter }: StoryProgressProps) {
  return (
    <div className="flex items-center justify-between">
      <div className={cn(medievalSharp.className, "text-lg text-primary")}>
        Chapter {chapter}
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="text-sm text-muted-foreground">Story in progress...</span>
      </div>
    </div>
  )
}
