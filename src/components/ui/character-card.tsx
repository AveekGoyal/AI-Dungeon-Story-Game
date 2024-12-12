'use client';

import { cn } from "@/lib/utils"
import { medievalSharp } from '@/app/fonts'
import { ReactNode } from "react"

interface CharacterCardProps {
  name: string
  children: ReactNode
}

export function CharacterCard({ name, children }: CharacterCardProps) {
  return (
    <div className="relative bg-gradient-to-br from-purple-900/30 via-indigo-800/30 to-blue-900/30 backdrop-blur-sm rounded-2xl p-8 flex flex-col items-center w-full h-[600px]">
      <div
        className={cn(
          "text-2xl text-amber-500 whitespace-nowrap mb-4",
          medievalSharp.className
        )}
      >
        {name}
      </div>
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
        {children}
      </div>
    </div>
  )
}
