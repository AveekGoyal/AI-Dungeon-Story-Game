"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { medievalSharp, lora } from "@/lib/typography"
import { cn } from "@/lib/utils"
import { AuthNavbar } from "@/components/layout/auth-navbar"
import CharacterCarousel from "@/components/characters/character-carousel"
import { useState } from "react"
import { getSession } from "next-auth/react"

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const genreId = searchParams.get('genre')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState('fire-mage')

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacter(characterId)
  }

  const handleBeginJourney = async () => {
    try {
      setIsLoading(true)
      
      if (!genreId) {
        throw new Error('Genre ID is required')
      }

      // Redirect to story overview page with selected character
      router.push(`/story/overview?genre=${genreId}&character=${selectedCharacter}`)
    } catch (error) {
      console.error('Error:', error)
      // You might want to show an error toast here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black/95">
      <AuthNavbar />
      <div className="container mx-auto px-4 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className={cn(
            "text-4xl md:text-5xl mb-4 bg-gradient-to-r from-red-600 to-orange-500 text-transparent bg-clip-text",
            medievalSharp.className
          )}>
            Choose Your Character
          </h1>
          <p className={cn(
            "text-lg text-gray-400",
            lora.className
          )}>
            Select your hero to begin your epic journey
          </p>
        </motion.div>

        {/* Character Selection */}
        <div className="h-[500px] mb-16">
          <CharacterCarousel onCharacterSelect={handleCharacterSelect} />
        </div>

        {/* Begin Journey Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <Button
            onClick={handleBeginJourney}
            disabled={isLoading}
            className="w-64 h-16 text-xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 shadow-lg shadow-red-900/50"
          >
            {isLoading ? "Preparing..." : "Begin Your Journey"}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}