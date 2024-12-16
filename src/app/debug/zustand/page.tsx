"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Card } from "@/components/ui/card"
import { AuthNavbar } from "@/components/layout/auth-navbar"
import { useStoryStore } from "@/store/story"
import { StoryState } from "@/store/types"

type StoreSnapshot = Pick<StoryState, 
  | 'storyId' 
  | 'metadata' 
  | 'currentChapter' 
  | 'currentPage'
  | 'selectedChoice'
  | 'previousChoice'
  | 'isLoading'
  | 'error'
  | 'initialized'
  | 'activeStream'
>

export default function ZustandDebug() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [storeSnapshot, setStoreSnapshot] = useState<StoreSnapshot | null>(null)

  // Subscribe to store changes
  useEffect(() => {
    // Initial state
    const state = useStoryStore.getState()
    const initialSnapshot: StoreSnapshot = {
      storyId: state.storyId,
      metadata: state.metadata,
      currentChapter: state.currentChapter,
      currentPage: state.currentPage,
      selectedChoice: state.selectedChoice,
      previousChoice: state.previousChoice,
      isLoading: state.isLoading,
      error: state.error,
      initialized: state.initialized,
      activeStream: state.activeStream
    }
    setStoreSnapshot(initialSnapshot)
    console.log('[Zustand Debug] Initial state:', initialSnapshot)

    // Subscribe to changes
    const unsubscribe = useStoryStore.subscribe((state) => {
      const newSnapshot: StoreSnapshot = {
        storyId: state.storyId,
        metadata: state.metadata,
        currentChapter: state.currentChapter,
        currentPage: state.currentPage,
        selectedChoice: state.selectedChoice,
        previousChoice: state.previousChoice,
        isLoading: state.isLoading,
        error: state.error,
        initialized: state.initialized,
        activeStream: state.activeStream
      }
      console.log('[Zustand Debug] State updated:', newSnapshot)
      setStoreSnapshot(newSnapshot)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const clearStore = () => {
    useStoryStore.setState({
      storyId: null,
      metadata: null,
      currentChapter: 1,
      currentPage: 1,
      selectedChoice: null,
      previousChoice: null,
      content: {},
      streamingContent: {
        raw: '',
        sections: {}
      },
      isLoading: false,
      error: null,
      initialized: false,
      abortController: null,
      activeStream: false
    })
    toast({
      title: "Success",
      description: "Zustand store cleared successfully"
    })
  }

  if (!session) {
    return <div>Please sign in to access debug tools.</div>
  }

  return (
    <div className="min-h-screen bg-black/95">
      <AuthNavbar />
      <div className="container mx-auto px-4 pt-28">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Zustand Store Debug</h1>
          <Button 
            onClick={clearStore}
            variant="destructive"
          >
            Clear Store
          </Button>
        </div>

        <div className="grid gap-4">
          <Card className="p-6 bg-gray-800 text-white">
            <h2 className="text-xl font-bold mb-4">Story Info</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold">Story ID:</h3>
                <p className="font-mono">{storeSnapshot?.storyId || 'Not set'}</p>
              </div>
              <div>
                <h3 className="font-semibold">Current Chapter:</h3>
                <p>{storeSnapshot?.currentChapter}</p>
              </div>
              <div>
                <h3 className="font-semibold">Current Page:</h3>
                <p>{storeSnapshot?.currentPage}</p>
              </div>
              <div>
                <h3 className="font-semibold">Loading:</h3>
                <p>{storeSnapshot?.isLoading ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-800 text-white">
            <h2 className="text-xl font-bold mb-4">Full Store State</h2>
            <pre className="whitespace-pre-wrap overflow-auto">
              {JSON.stringify(storeSnapshot, null, 2)}
            </pre>
          </Card>
        </div>
      </div>
    </div>
  )
}
