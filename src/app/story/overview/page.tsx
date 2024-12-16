"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { medievalSharp, lora } from "@/lib/typography"
import { cn } from "@/lib/utils"
import { AuthNavbar } from "@/components/layout/auth-navbar"
import { useState, useEffect, useCallback, useRef } from "react"
import characterData from "@/data/character-cards.json"
import { genres } from "@/config/genres"
import { OverviewCard as FireMageOverview } from "@/components/characters/fire-mage-card"
import { OverviewCard as ArcherOverview } from "@/components/characters/archer-card"
import { OverviewCard as CrimsonOverview } from "@/components/characters/crimson-card"
import { OverviewCard as DarkMageOverview } from "@/components/characters/dark-mage-card"
import { OverviewCard as LightMageOverview } from "@/components/characters/light-mage-card"
import { OverviewCard as RapierOverview } from "@/components/characters/rapier-card"
import { OverviewCard as SwordsmenOverview } from "@/components/characters/swordsman-card"
import { OverviewCard as WizardOverview } from "@/components/characters/wizard-card"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"
import { useStoryStore } from "@/store/story"

interface CharacterStats {
  name: string;
  class: string;
  strength: number;
  intelligence: number;
  healthPoints: number;
  agility: number;
  magicPoints: number;
  specialAttacks: string[];
}

// Story Overview Component
function StoryOverview({ genre, character }: { genre: any; character: CharacterStats }) {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status: sessionStatus } = useSession()
  const hasGeneratedRef = useRef(false)
  const setMetadata = useStoryStore(state => state.setMetadata)
  const setStoryId = useStoryStore(state => state.setStoryId)
  const [state, setState] = useState({
    isCreating: false,
    storyTitle: "",
    storyDescription: "",
    isGenerating: false,
    hasGenerated: false,
    error: null as string | null
  })
  const selectedCharacter = character.name.toLowerCase().replace(/\s+/g, '-')

  const createStory = async () => {
    try {
      setState(prev => ({ ...prev, isCreating: true }))
      
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: state.storyTitle,
          description: state.storyDescription,
          genre: {
            name: genre.name,
            description: genre.description
          },
          character: {
            name: character.name,
            class: character.class,
            stats: {
              strength: character.strength,
              intelligence: character.intelligence,
              healthPoints: character.healthPoints,
              agility: character.agility,
              magicPoints: character.magicPoints,
              specialAttacks: character.specialAttacks
            }
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create story')
      }

      const data = await response.json()
      
      console.log('[Zustand] Setting story data:', data);
      
      // Update Zustand store with story metadata and ID
      setStoryId(data.id);
      setMetadata({
        title: state.storyTitle,
        description: state.storyDescription,
        genre: {
          name: genre.name,
          description: genre.description
        },
        character: {
          name: character.name,
          class: character.class,
          stats: {
            strength: character.strength,
            intelligence: character.intelligence,
            healthPoints: character.healthPoints,
            agility: character.agility,
            magicPoints: character.magicPoints,
            specialAttacks: character.specialAttacks
          }
        }
      });

      console.log('[Zustand] Store updated with story:', {
        id: data.id,
        metadata: {
          title: state.storyTitle,
          description: state.storyDescription,
          genre: {
            name: genre.name,
            description: genre.description
          },
          character: {
            name: character.name,
            class: character.class,
            stats: {
              strength: character.strength,
              intelligence: character.intelligence,
              healthPoints: character.healthPoints,
              agility: character.agility,
              magicPoints: character.magicPoints,
              specialAttacks: character.specialAttacks
            }
          }
        }
      });

      // Navigate to the first chapter/page
      router.push(`/story/${data.id}/chapter/1/page/1`);
    } catch (error) {
      console.error('[Zustand] Error creating story:', error)
      setState(prev => ({
        ...prev,
        isCreating: false,
        error: 'Failed to create story. Please try again.'
      }))
      toast({
        title: "Error",
        description: "Failed to create story. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Memoize the story generation function
  const generateStoryInfo = useCallback(async () => {
    if (!session || hasGeneratedRef.current || state.isGenerating) {
      console.log('[StoryOverview] Skipping generation:', {
        hasSession: !!session,
        hasGenerated: hasGeneratedRef.current,
        isGenerating: state.isGenerating
      })
      return
    }

    console.log('[StoryOverview] Starting story generation for:', {
      genre: genre.name,
      character: character.name
    })
    
    setState(prev => ({ ...prev, isGenerating: true, error: null }))

    try {
      console.log('[StoryOverview] Making API request to story-initializer')
      const response = await fetch('/api/story-initializer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ genre, character })
      })

      if (!response.ok) {
        console.error('[StoryOverview] API request failed:', {
          status: response.status,
          statusText: response.statusText
        })
        
        if (response.status === 401) {
          throw new Error('Unauthorized')
        }
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate story info')
      }

      const data = await response.json()
      console.log('[StoryOverview] Successfully generated story:', {
        title: data.title,
        descriptionLength: data.description?.length
      })
      
      setState(prev => ({
        ...prev,
        storyTitle: data.title,
        storyDescription: data.description,
        hasGenerated: true,
        isGenerating: false
      }));

      // Store metadata in Zustand
      setMetadata({
        title: data.title,
        description: data.description,
        genre,
        character: {
          name: character.name,
          class: character.class,
          stats: {
            strength: character.strength,
            intelligence: character.intelligence,
            healthPoints: character.healthPoints,
            agility: character.agility,
            magicPoints: character.magicPoints,
            specialAttacks: character.specialAttacks
          }
        }
      });

      hasGeneratedRef.current = true
    } catch (error) {
      console.error('[StoryOverview] Error in story generation:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      
      if (errorMessage !== 'Unauthorized') {
        hasGeneratedRef.current = false
        toast({
          title: "Error Generating Story",
          description: errorMessage,
          variant: "destructive",
        })
      }
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage,
        isGenerating: false
      }))
    }
  }, [session, genre, character, setMetadata])

  useEffect(() => {
    if (session?.user) {
      generateStoryInfo()
    }
  }, [session?.user, generateStoryInfo])

  // Handle story creation
  const handleBeginAdventure = useCallback(async () => {
    if (!session?.user?.email || state.isCreating) {
      console.log('No session or already creating:', { 
        hasSession: !!session,
        userEmail: session?.user?.email,
        isCreating: state.isCreating 
      })
      return
    }

    setState(prev => ({ ...prev, isCreating: true, error: null }))

    try {
      console.log('Making request to /api/stories...')
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: state.storyTitle,
          description: state.storyDescription,
          genre,
          character
        })
      })

      console.log('API Response status:', response.status)
      
      if (!response.ok) {
        if (response.status === 401) {
          console.log('Session expired or invalid')
          throw new Error('Session expired')
        }
        const errorData = await response.json()
        console.error('API error response:', errorData)
        throw new Error(errorData.error || 'Failed to create story')
      }

      const data = await response.json()
      console.log('Story created successfully:', data)
      
      if (!data.id) {
        console.error('No story ID received in response:', data)
        throw new Error('No story ID in response')
      }

      console.log('[Zustand] Setting story data:', data);
      
      // Update Zustand store with story metadata and ID
      setStoryId(data.id);
      setMetadata({
        title: state.storyTitle,
        description: state.storyDescription,
        genre: {
          name: genre.name,
          description: genre.description
        },
        character: {
          name: character.name,
          class: character.class,
          stats: {
            strength: character.strength,
            intelligence: character.intelligence,
            healthPoints: character.healthPoints,
            agility: character.agility,
            magicPoints: character.magicPoints,
            specialAttacks: character.specialAttacks
          }
        }
      });

      console.log('[Zustand] Store updated with story:', {
        id: data.id,
        metadata: {
          title: state.storyTitle,
          description: state.storyDescription,
          genre: {
            name: genre.name,
            description: genre.description
          },
          character: {
            name: character.name,
            class: character.class,
            stats: {
              strength: character.strength,
              intelligence: character.intelligence,
              healthPoints: character.healthPoints,
              agility: character.agility,
              magicPoints: character.magicPoints,
              specialAttacks: character.specialAttacks
            }
          }
        }
      });

      // Navigate to the first chapter/page
      console.log('Redirecting to story page:', `/story/${data.id}/chapter/1/page/1`)
      router.push(`/story/${data.id}/chapter/1/page/1`)
    } catch (error) {
      console.error('Error creating story:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      toast({
        title: "Error Creating Story",
        description: errorMessage,
        variant: "destructive",
      })
      setState(prev => ({ 
        ...prev, 
        isCreating: false,
        error: errorMessage
      }))
    }
  }, [session, state.storyTitle, state.storyDescription, genre, character, router, toast])

  if (state.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-2xl text-red-500">{state.error}</div>
        <Button onClick={() => setState(prev => ({ ...prev, error: null }))}>
          Try Again
        </Button>
      </div>
    )
  }

  const renderCharacterCard = () => {
    switch (selectedCharacter) {
      case 'fire-mage':
        return <FireMageOverview />
      case 'archer':
        return <ArcherOverview />
      case 'crimson-knight':
        return <CrimsonOverview />
      case 'dark-mage':
        return <DarkMageOverview />
      case 'light-mage':
        return <LightMageOverview />
      case 'rapier':
        return <RapierOverview />
      case 'swordsmen':
        return <SwordsmenOverview />
      case 'wizard':
        return <WizardOverview />
      default:
        return <FireMageOverview />
    }
  }

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 mt-12">
      {/* Left Column: Story Info */}
      <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center lg:text-left"
        >
          <h2 className={cn(
            medievalSharp.className,
            "text-4xl mb-4 bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text"
          )}>
            {state.isGenerating ? "Generating Your Story..." : state.storyTitle}
          </h2>
          <p className={cn(
            lora.className,
            "text-lg text-gray-300 max-w-2xl mb-8"
          )}>
            {state.isGenerating ? "Please wait while we craft your unique adventure..." : state.storyDescription}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={handleBeginAdventure}
            disabled={state.isCreating || state.isGenerating}
            className="w-64 h-16 text-xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 shadow-lg shadow-red-900/50"
          >
            {state.isCreating ? "Preparing..." : "Begin Adventure"}
          </Button>
        </motion.div>
      </div>

      {/* Right Column: Character Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-1/2 flex items-center justify-center"
      >
        {renderCharacterCard()}
      </motion.div>
    </div>
  )
}

export default function Page() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [state, setState] = useState<{
    character: CharacterStats | null;
    genre: any | null;
  }>({
    character: null,
    genre: null
  })

  // Memoize the initialization logic
  const initializeState = useCallback(() => {
    const genreId = searchParams.get('genre')
    const characterId = searchParams.get('character')

    if (status === 'unauthenticated') {
      router.push('/sign-in')
      return
    }

    if (!characterId || !genreId) {
      router.push('/')
      return
    }

    const selectedCharacter = characterData.find(
      char => char.name.toLowerCase().replace(/\s+/g, '-') === characterId
    )
    
    const selectedGenre = genres.find(g => g.id === genreId)

    if (!selectedCharacter || !selectedGenre) {
      router.push('/')
      return
    }

    setState({
      character: selectedCharacter,
      genre: selectedGenre
    })
  }, [searchParams, status, router])

  // Only run initialization when component mounts or when dependencies change
  useEffect(() => {
    initializeState()
  }, [initializeState])

  if (status === 'loading') return null
  if (!session) return null
  if (!state.character || !state.genre) return null

  return (
    <div className="min-h-screen bg-black/95">
      <AuthNavbar />
      <div className="container mx-auto px-4 pt-28">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className={cn(
            medievalSharp.className,
            "text-5xl md:text-6xl mb-4"
          )}>
            <span className="bg-gradient-to-r from-red-500 to-orange-500 text-transparent bg-clip-text">
              Your Adventure Awaits
            </span>
          </h1>
        </motion.div>

        <StoryOverview 
          character={state.character} 
          genre={state.genre} 
        />
      </div>
    </div>
  )
}
