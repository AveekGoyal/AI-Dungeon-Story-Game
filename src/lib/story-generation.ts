export interface StoryChoice {
  description: string
  statChanges?: {
    strength?: number
    intelligence?: number
    healthPoints?: number
    agility?: number
    magicPoints?: number
  }
  consequences: string
}

export interface StoryResponse {
  storyText: string
  choices: StoryChoice[]
}

export interface StoryGenerationRequest {
  genre: string
  character: {
    name: string
    strength: number
    intelligence: number
    healthPoints: number
    agility: number
    magicPoints: number
    specialAttacks: string[]
  }
  chapter: number
  page: number
  previousChoices: {
    chapter: number
    page: number
    choice: number
    consequence: string
  }[]
}

export async function generateStory(params: StoryGenerationRequest): Promise<ReadableStream<Uint8Array>> {
  const response = await fetch(`/api/stories/${params.chapter}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      genre: params.genre,
      character: params.character,
      page: params.page,
      previousChoices: params.previousChoices
    })
  })

  if (!response.ok || !response.body) {
    throw new Error('Failed to generate story')
  }

  return response.body
}

export function parseStoryResponse(chunk: Uint8Array): { text?: string; choices?: StoryChoice[] } {
  try {
    // Convert binary chunk to string
    const decoder = new TextDecoder()
    const text = decoder.decode(chunk)
    
    // Split the text by lines to handle SSE format
    const lines = text.split('\n')
    let result = { text: '', choices: undefined as StoryChoice[] | undefined }
    
    for (const line of lines) {
      if (!line.trim()) continue
      
      // Handle SSE data prefix
      const data = line.startsWith('data: ') ? line.slice(6) : line
      
      try {
        const parsed = JSON.parse(data)
        if (parsed.text) {
          result.text = parsed.text
        }
        if (Array.isArray(parsed.choices)) {
          result.choices = parsed.choices.map((choice: any) => ({
            description: choice.description,
            consequences: choice.consequences,
            statChanges: choice.statChanges ? parseStatChanges(choice.statChanges) : undefined
          }))
        }
      } catch (e) {
        console.error('Error parsing JSON data:', e)
      }
    }
    
    return result
  } catch (e) {
    console.error('Error decoding chunk:', e)
    return {}
  }
}

type StatKey = 'strength' | 'intelligence' | 'healthPoints' | 'agility' | 'magicPoints'

function parseStatChanges(stats: string): StoryChoice['statChanges'] {
  const changes: Partial<Record<StatKey, number>> = {}
  
  // Split the stats string by commas if present
  const statPairs = stats.split(',').map(s => s.trim())
  
  statPairs.forEach(pair => {
    // Match stat name and value using basic string operations
    const matches = pair.match(/(strength|intelligence|healthPoints|agility|magicPoints):\s*([+-]?\d+)/i)
    if (matches) {
      const [_, stat, value] = matches
      const statKey = stat.toLowerCase() as StatKey
      changes[statKey] = parseInt(value)
    }
  })

  return Object.keys(changes).length > 0 ? changes : undefined
}
