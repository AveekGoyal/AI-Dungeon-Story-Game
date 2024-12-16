"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Card } from "@/components/ui/card"
import { AuthNavbar } from "@/components/layout/auth-navbar"

interface Story {
  storyId: string;
  title: string;
  description: string;
  genre: {
    name: string;
    description: string;
  };
  character: {
    name: string;
    class: string;
  };
}

export default function MongoDBDebug() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  const fetchStories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/stories')
      const data = await response.json()
      setStories(data.stories || [])
    } catch (error) {
      console.error('Error fetching stories:', error)
      toast({
        title: "Error",
        description: "Failed to fetch stories",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteStory = async (storyId: string) => {
    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete story')
      }

      toast({
        title: "Success",
        description: "Story deleted successfully"
      })

      fetchStories()
    } catch (error) {
      console.error('Error deleting story:', error)
      toast({
        title: "Error",
        description: "Failed to delete story",
        variant: "destructive"
      })
    }
  }

  const deleteAllStories = async () => {
    try {
      const response = await fetch('/api/stories', {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete all stories')
      }

      toast({
        title: "Success",
        description: "All stories deleted successfully"
      })

      fetchStories()
    } catch (error) {
      console.error('Error deleting all stories:', error)
      toast({
        title: "Error",
        description: "Failed to delete all stories",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    if (session) {
      fetchStories()
    }
  }, [session])

  if (!session) {
    return <div>Please sign in to access debug tools.</div>
  }

  return (
    <div className="min-h-screen bg-black/95">
      <AuthNavbar />
      <div className="container mx-auto px-4 pt-28">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">MongoDB Debug</h1>
          <div className="space-x-4 text-black">
            <Button 
              onClick={fetchStories} 
              disabled={loading}
              variant="outline"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
            <Button 
              onClick={deleteAllStories}
              variant="destructive"
            >
              Delete All Stories
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {stories.map((story) => (
            <Card key={story.storyId} className="p-6 bg-gray-800 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold mb-2">{story.title}</h2>
                  <p className="text-gray-400 mb-4">{story.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Genre</h3>
                      <p>{story.genre?.name}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Character</h3>
                      <p>{story.character?.name} ({story.character?.class})</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => deleteStory(story.storyId)}
                  variant="destructive"
                  size="sm"
                >
                  Delete
                </Button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(story, null, 2)}
                </pre>
              </div>
            </Card>
          ))}

          {stories.length === 0 && !loading && (
            <div className="text-center text-gray-400 py-8">
              No stories found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
