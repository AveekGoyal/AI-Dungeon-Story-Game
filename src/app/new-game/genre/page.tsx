"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { medievalSharp } from "@/lib/typography"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { genres } from "@/config/genres"

export default function GenreSelection() {
  const router = useRouter()
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-black text-white py-8">
      <main className="container mx-auto px-4 flex-1 flex flex-col items-center justify-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className={cn(
            "text-3xl font-bold mb-4",
            medievalSharp.className
          )}>
            <span className="bg-gradient-to-r from-red-600 to-orange-500 text-transparent bg-clip-text">
              Choose Your Adventure
            </span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Select a genre to begin your journey
          </p>
        </motion.div>

        {/* Genre Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 max-w-5xl mx-auto w-full">
          {genres.map((genre, index) => (
            <motion.div
              key={genre.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  "p-6 transition-all duration-300 cursor-pointer border-2 flex flex-col h-48 w-72",
                  selectedGenre === genre.id
                    ? "bg-red-950/50 border-red-500"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                )}
                onClick={() => setSelectedGenre(genre.id)}
              >
                <h3 className={cn(
                  "text-2xl font-bold mb-3 text-red-400",
                  medievalSharp.className
                )}>
                  {genre.name}
                </h3>
                <p className="text-gray-300 text-sm">
                  {genre.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            disabled={!selectedGenre}
            onClick={() => router.push(`/new-game/character?genre=${selectedGenre}`)}
            className={cn(
              "bg-gradient-to-r from-red-600 to-orange-500 text-white",
              "hover:from-red-700 hover:to-orange-600",
              "px-8 py-6 text-lg",
              medievalSharp.className
            )}
          >
            Continue to Character Selection
          </Button>
        </motion.div>
      </main>
    </div>
  )
}
