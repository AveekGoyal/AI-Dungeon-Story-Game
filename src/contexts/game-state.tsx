"use client"

import { createContext, useContext, useReducer, useRef, ReactNode } from 'react'

interface GameState {
  chapter: number
  page: number
  storyText: string
  choices: any[]
  isLoading: boolean
  characterStats: {
    strength: number
    intelligence: number
    healthPoints: number
    agility: number
    magicPoints: number
  }
  previousChoices: any[]
}

type GameAction =
  | { type: 'START_STORY_GENERATION' }
  | { type: 'SET_STORY_TEXT'; payload: string }
  | { type: 'COMPLETE_STORY_GENERATION' }
  | { type: 'SELECT_CHOICE'; payload: { choiceIndex: number; consequence: string } }
  | { type: 'UPDATE_CHARACTER_STATS'; payload: Partial<GameState['characterStats']> }
  | { type: 'SET_CHOICES'; payload: any[] }

const initialState: GameState = {
  chapter: 1,
  page: 1,
  storyText: '',
  choices: [],
  isLoading: false,
  characterStats: {
    strength: 0,
    intelligence: 0,
    healthPoints: 0,
    agility: 0,
    magicPoints: 0,
  },
  previousChoices: [],
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_STORY_GENERATION':
      return {
        ...state,
        isLoading: true,
        choices: []
      }
    case 'SET_STORY_TEXT':
      return {
        ...state,
        storyText: action.payload
      }
    case 'COMPLETE_STORY_GENERATION':
      return {
        ...state,
        isLoading: false
      }
    case 'SELECT_CHOICE':
      const { choiceIndex, consequence } = action.payload
      return {
        ...state,
        page: state.page + 1,
        storyText: state.storyText + '\n\n' + consequence,
        choices: [],
        previousChoices: [
          ...state.previousChoices,
          {
            chapter: state.chapter,
            page: state.page,
            choice: choiceIndex,
            consequence
          }
        ]
      }
    case 'UPDATE_CHARACTER_STATS':
      return {
        ...state,
        characterStats: {
          ...state.characterStats,
          ...action.payload
        }
      }
    case 'SET_CHOICES':
      return {
        ...state,
        choices: action.payload
      }
    default:
      return state
  }
}

const GameStateContext = createContext<{
  state: GameState
  generateNextStory: (params: { genre: string; character: any }) => Promise<void>
  selectChoice: (choiceIndex: number) => Promise<void>
} | null>(null)

export function GameStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  const generateNextStory = async (params: { genre: string; character: any }) => {
    if (state.isLoading) return

    dispatch({ type: 'START_STORY_GENERATION' })
    
    try {
      dispatch({
        type: 'UPDATE_CHARACTER_STATS',
        payload: {
          strength: params.character.strength,
          intelligence: params.character.intelligence,
          healthPoints: params.character.healthPoints,
          agility: params.character.agility,
          magicPoints: params.character.magicPoints,
        }
      })

      const response = await fetch(`/api/stories/${params.character.storyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'generateNextStory',
          currentState: {
            location: 'currentLocation',
            chapter: state.chapter,
            character: {
              name: params.character.name,
              class: params.character.class,
              health: params.character.healthPoints,
              mana: params.character.magicPoints
            },
            genre: params.genre
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate story')
      }

      // Handle SSE response
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value)
        const messages = buffer.split('\n\n')
        buffer = messages.pop() || ''

        for (const message of messages) {
          if (message.startsWith('data: ')) {
            try {
              const data = JSON.parse(message.slice(6))
              if (data.text) {
                dispatch({ type: 'SET_STORY_TEXT', payload: data.text })
              }
              if (data.choices && Array.isArray(data.choices)) {
                dispatch({ type: 'SET_CHOICES', payload: data.choices })
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }

      dispatch({ type: 'COMPLETE_STORY_GENERATION' })
    } catch (error) {
      dispatch({ type: 'COMPLETE_STORY_GENERATION' })
    }
  }

  const selectChoice = async (choiceIndex: number) => {
    if (state.isLoading || !state.choices[choiceIndex]) return

    const choice = state.choices[choiceIndex]
    dispatch({
      type: 'SELECT_CHOICE',
      payload: {
        choiceIndex,
        consequence: choice.consequences || choice.description
      }
    })

    if (choice.statChanges) {
      dispatch({
        type: 'UPDATE_CHARACTER_STATS',
        payload: choice.statChanges
      })
    }

    await generateNextStory({
      genre: 'fantasy',
      character: {
        ...state.characterStats,
        name: 'Player',
        specialAttacks: ['Fireball Strike', 'Phoenix Rising', 'Inferno Wave']
      }
    })
  }

  return (
    <GameStateContext.Provider value={{ state, generateNextStory, selectChoice }}>
      {children}
    </GameStateContext.Provider>
  )
}

export function useGameState() {
  const context = useContext(GameStateContext)
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider')
  }
  return context
}
