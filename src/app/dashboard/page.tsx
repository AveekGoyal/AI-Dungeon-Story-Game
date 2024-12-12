"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { AuthNavbar } from "@/components/layout/auth-navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { medievalSharp, lora } from "@/lib/typography"
import { cn } from "@/lib/utils"
import { Sword, Plus, PlayCircle, Clock } from "lucide-react"

interface Story {
  id: string;
  title: string;
  currentChapter: number;
  lastPlayed: string;
}

export default function Dashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  console.log('Dashboard - Session status:', status)
  console.log('Dashboard - Session data:', session)

  useEffect(() => {
    console.log('Dashboard - useEffect triggered with status:', status)
    if (status === "unauthenticated") {
      console.log('Dashboard - User is unauthenticated, redirecting to sign-in')
      router.push("/sign-in")
      return
    }

    if (status === "authenticated") {
      console.log('Dashboard - User is authenticated, fetching dashboard data')
      fetchDashboardData()
    }
  }, [status])

  const fetchDashboardData = async () => {
    console.log('Dashboard - Fetching dashboard data')
    try {
      const response = await fetch('/api/dashboard')
      const data = await response.json()
      console.log('Dashboard - Fetch response:', data)
      
      if (response.ok) {
        setStories(data.stories)
      } else {
        throw new Error(data.message || 'Failed to fetch dashboard data')
      }
    } catch (error) {
      console.error('Dashboard - Error fetching data:', error)
      router.push('/sign-in')
    } finally {
      setLoading(false)
    }
  }

  const handleStoryClick = async (storyId: string) => {
    try {
      const response = await fetch(`/api/stories/${storyId}`)

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/sign-in')
          return
        }
        throw new Error('Failed to load story')
      }

      router.push(`/story/page?id=${storyId}`)
    } catch (error) {
      console.error('Error loading story:', error)
    }
  }

  if (loading) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AuthNavbar />
      
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/images/stars.png')] opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
      
      <main className="container mx-auto px-4 pt-24 relative">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={cn(
              medievalSharp.className,
              "text-4xl font-bold mb-4"
            )}>
              <span className="text-amber-500">Welcome Back, </span>
              <span className="bg-gradient-to-r from-red-600 to-orange-500 text-transparent bg-clip-text">
                {session?.user?.username}
              </span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={cn(
              "text-xl text-gray-300",
              lora.className
            )}
          >
            Begin a new adventure or continue your epic journey
          </motion.p>
        </motion.div>

        {/* New Game Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-md mx-auto mb-16"
        >
          <Card 
            className="p-8 bg-white/5 border-white/10 hover:bg-white/10 transition-colors relative overflow-hidden cursor-pointer group"
            onClick={() => router.push("/new-game/genre")}
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-orange-500/20 opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600/50 to-orange-500/50 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Content */}
            <div className="relative flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-gradient-to-br from-red-600/20 to-orange-500/20">
                <Sword className="w-12 h-12 text-orange-500" />
              </div>
              
              <h2 className={cn(
                "text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-500 text-transparent bg-clip-text",
                medievalSharp.className
              )}>
                Begin New Adventure
              </h2>
              
              <p className={cn(
                "text-gray-300",
                lora.className
              )}>
                Embark on an epic journey filled with magic, mystery, and untold adventures
              </p>
              
              <Button 
                className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start New Game
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Existing Stories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h2 className={cn(
            "text-2xl font-bold mb-6",
            medievalSharp.className
          )}>
            <span className="bg-gradient-to-r from-red-600 to-orange-500 text-transparent bg-clip-text">
              Your Adventures
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.length === 0 ? (
              // Empty state cards
              [1, 2, 3].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Card className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-colors relative overflow-hidden h-[200px] flex flex-col justify-between group cursor-pointer">
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-orange-500/10 opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600/30 to-orange-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Empty State Content */}
                    <div className="relative flex flex-col items-center justify-center text-center h-full space-y-4">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                        <PlayCircle className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className={cn(
                          "text-gray-400 text-sm",
                          lora.className
                        )}>
                          No active stories yet
                        </p>
                        <p className={cn(
                          "text-gray-500 text-xs mt-1",
                          lora.className
                        )}>
                          Start a new adventure to begin your journey
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="relative mt-4 pt-4 border-t border-white/5">
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          --
                        </span>
                        <span>Chapter --</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              // Actual story cards
              stories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Card 
                    className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-colors relative overflow-hidden h-[200px] flex flex-col justify-between group cursor-pointer"
                    onClick={() => handleStoryClick(story.id)}
                  >
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-orange-500/10 opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-600/30 to-orange-500/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Story Content */}
                    <div className="relative flex flex-col h-full">
                      <h3 className={cn(
                        "text-xl font-bold text-white mb-2",
                        medievalSharp.className
                      )}>
                        {story.title}
                      </h3>
                    </div>

                    {/* Footer */}
                    <div className="relative mt-4 pt-4 border-t border-white/5">
                      <div className="flex justify-between items-center text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(story.lastPlayed).toLocaleDateString()}
                        </span>
                        <span>Chapter {story.currentChapter}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </motion.section>
      </main>
    </div>
  )
}
