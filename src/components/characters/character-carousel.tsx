"use client"

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FireMageCard from './fire-mage-card'
import DarkMageCard from './dark-mage-card'
import LightMageCard from './light-mage-card'
import ArcherCard from './archer-card'
import CrimsonCard from './crimson-card'
import RapierCard from './rapier-card'
import SwordsmenCard from './swordsman-card'
import WizardCard from './wizard-card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const characters = [
  { id: 'fire-mage', component: FireMageCard, name: 'Fire Mage' },
  { id: 'dark-mage', component: DarkMageCard, name: 'Dark Mage' },
  { id: 'light-mage', component: LightMageCard, name: 'Light Mage' },
  { id: 'archer', component: ArcherCard, name: 'Archer' },
  { id: 'crimson-knight', component: CrimsonCard, name: 'Crimson Knight' },
  { id: 'rapier', component: RapierCard, name: 'Rapier' },
  { id: 'swordsmen', component: SwordsmenCard, name: 'Swordsmen' },
  { id: 'wizard', component: WizardCard, name: 'Wizard' },
  // Add more characters here as they are created
]

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 500 : -500,
    opacity: 0,
    scaleX: 0.1,
    scaleY: 1,
    rotateY: direction > 0 ? 50 : -50,
    zIndex: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    scaleX: 1,
    scaleY: 1,
    rotateY: 0,
    zIndex: 1,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
      scaleX: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20,
        duration: 0.4 
      },
      rotateY: { type: "spring", stiffness: 300, damping: 30 }
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scaleX: 0.1,
    scaleY: 1,
    rotateY: direction < 0 ? 30 : -30,
    zIndex: 0,
    transition: {
      x: { type: "spring", stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
      scaleX: { 
        type: "spring", 
        stiffness: 100, 
        damping: 20,
        duration: 0.3
      },
      rotateY: { type: "spring", stiffness: 300, damping: 30 }
    }
  }),
}

const swipeConfidenceThreshold = 10000
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity
}

export default function CharacterCarousel({ onCharacterSelect }: { onCharacterSelect: (characterId: string) => void }) {
  const [[page, direction], setPage] = useState([0, 0])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    onCharacterSelect(characters[page].id)
  }, [page, onCharacterSelect])

  const paginate = (newDirection: number) => {
    if (isAnimating) return // Prevent multiple clicks during animation
    
    let newPage = page + newDirection
    // Make it circular
    if (newPage < 0) {
      newPage = characters.length - 1
    } else if (newPage >= characters.length) {
      newPage = 0
    }
    
    setIsAnimating(true)
    setPage([newPage, newDirection])
  }

  // Helper function to get circular index
  const getCircularIndex = (index: number) => {
    if (index < 0) return characters.length - 1
    if (index >= characters.length) return 0
    return index
  }

  // Function to render character with key for proper unmounting
  const renderCharacter = (index: number, isPrev: boolean = false, isNext: boolean = false) => {
    const Component = characters[index].component
    const key = `${characters[index].id}-${isPrev ? 'prev' : isNext ? 'next' : 'current'}`
    return <Component key={key} />
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Previous Character Preview */}
      <div 
        className="absolute left-0 transform -translate-x-1/3 scale-75 opacity-30 blur-[2px] pointer-events-none"
        style={{ perspective: "1000px" }}
      >
        {renderCharacter(getCircularIndex(page - 1), true)}
      </div>

      {/* Current Character */}
      <AnimatePresence
        initial={false}
        custom={direction}
        mode="wait"
        onExitComplete={() => setIsAnimating(false)}
      >
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x)

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1)
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1)
            }
          }}
          className="absolute origin-center"
          style={{ 
            perspective: "1000px",
            transformStyle: "preserve-3d"
          }}
        >
          {renderCharacter(page)}
        </motion.div>
      </AnimatePresence>

      {/* Next Character Preview */}
      <div 
        className="absolute right-0 transform translate-x-1/3 scale-75 opacity-30 blur-[2px] pointer-events-none"
        style={{ perspective: "1000px" }}
      >
        {renderCharacter(getCircularIndex(page + 1), false, true)}
      </div>

      {/* Navigation Controls */}
      <Button
        onClick={() => paginate(-1)}
        className="absolute left-4 z-10 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600"
        size="icon"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        onClick={() => paginate(1)}
        className="absolute right-4 z-10 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600"
        size="icon"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
