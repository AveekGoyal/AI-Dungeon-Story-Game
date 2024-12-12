# Backend Development Plan

## Static Data Sources

### Character Data
- Location: `src/data/character-cards.json`
- Contains: Character base stats, special attacks
- Used for: Initial character setup, game creation
```typescript
{
  name: string
  strength: number
  intelligence: number
  healthPoints: number
  agility: number
  magicPoints: number
  specialAttacks: string[]
}
```

### Character IDs
- Location: `src/app/story/overview/page.tsx`
- Available Characters: 
  - fire-mage
  - archer
  - crimson-knight
  - dark-mage
  - light-mage
  - rapier
  - swordsmen
  - wizard

### Enemy Sprites
- Location: `src/data/enemy-sprites.json`
- Used for: Story generation and combat scenarios

## Dashboard Component

### Data Requirements

#### Dashboard Display Data
- User's active/ongoing games
- Completed games
- Available genres
- Last played game

#### Dashboard Actions
- Start new game (→ Genre Selection)
- Continue existing game (→ Story Page)
- View game history
- Delete saved games

### API Endpoints

```typescript
GET /api/dashboard
Response: {
  activeGames: [
    {
      id: string
      genre: string
      character: string
      chapter: number
      lastPlayed: DateTime
      progress: number // percentage
    }
  ],
  completedGames: [...],
  userStats: {
    gamesStarted: number
    gamesCompleted: number
    playtime: number
  }
}

GET /api/games/active
// Returns list of active games

GET /api/games/completed
// Returns list of completed games

DELETE /api/games/:id
// Delete a saved game

POST /api/games/new
Request: {
  genreId: string,
  characterId: string  // must match IDs from overview/page.tsx
}
Response: {
  gameId: string,
  success: boolean
}
```

## Story Generation System

### Available Assets

#### Character Sprites
- Location: `src/components/characters`
- Available Characters:
  - archer
  - crimson
  - dark-mage
  - enchantress
  - fire-mage
  - light-mage
  - rapier
  - swordsmen
  - wizard
- Common animations: idle, attack, hurt, death

#### Enemy Sprites
- Location: `src/components/enemies`
- Available Enemies:
  - BlackWerewolf
  - FireMage
  - FireSpirit
  - ForestTroll
  - MountainTroll
  - Plent
  - RedWerewolf
  - Skeleton
  - SkeletonArcher
  - SkeletonSpearman
  - SkeletonWarrior
  - SwampTroll
  - Werewolf
  - WhiteWerewolf

#### Background Assets
- Location: `src/data/background-assets.json`
- Types:
  - battleground (combat scenes)
  - castle_interior (indoor castle scenes)
  - ocean (sea adventures)
  - crystal_cave (mystical scenes)
- Each type has multiple variants with specific assets

### Story Structure
- 5 chapters per story
- Multiple pages per chapter
- Each page contains:
  - Story text (2-3 paragraphs)
  - 2-4 choices
  - Sprite configurations
  - Character stats updates

### API Endpoints

```typescript
// Get current page content
GET /api/story/:gameId/current
Response: {
  chapter: number
  page: number
  content: string
  choices: string[]
  sprites: {
    character: {
      type: string     // from characterSprites
      animation: string // 'idle', 'attack', 'hurt', etc.
    }
    enemy?: {
      type: string     // from enemySprites
      animation: string
    }
    background: {
      type: string     // from backgroundTypes
      variant: string  // specific variant from background-assets.json
    }
  }
  stats: CharacterStats
}

// Make a choice and get next page
POST /api/story/:gameId/choice
Request: {
  choiceIndex: number
}
Response: {
  // Same as GET /current
}
```

### OpenAI Integration

```typescript
// System prompt for story generation
const prompt = `
Create a story segment for a ${genre} story.
Character: ${character.name} with abilities: ${character.specialAttacks.join(', ')}
Previous choice: ${previousChoice}

Available assets to use:
- Character animations: idle, attack, hurt, death
- Enemies: ${enemySprites.join(', ')}
- Backgrounds: ${backgroundTypes.join(', ')}

Requirements:
- 2-3 paragraphs
- 2-4 choices for next action
- If combat: specify enemy type and animations
- Specify background type and variant
- Match the genre's theme

Current chapter: ${chapter} of 5
`

// Expected OpenAI Response Format
{
  content: string      // Story text
  choices: string[]    // Available actions
  sprites: {
    character: {
      type: string
      animation: string
    }
    enemy?: {
      type: string
      animation: string
    }
    background: {
      type: string
      variant: string
    }
  }
  stats: CharacterStats  // Updated character stats
}
```

### Story State Storage

```typescript
// In Games collection
{
  // ... other game fields
  storyState: {
    chapter: number
    page: number
    previousChoices: string[]    // For story continuity
    currentStats: CharacterStats // Current character state
    currentSprites: {
      character: {
        type: string
        animation: string
      }
      enemy?: {
        type: string
        animation: string
      }
      background: {
        type: string
        variant: string
      }
    }
  }
}
```

### Technical Considerations

#### Asset Management
- Preload next likely backgrounds/sprites based on choices
- Cache commonly used sprites
- Handle sprite transitions smoothly
- Maintain consistent animation states

#### Story Generation
- Cache generated story segments
- Implement retry logic for API failures
- Maintain story coherence across choices
- Handle combat scenarios appropriately

#### Performance
- Optimize sprite loading/unloading
- Cache story segments for quick navigation
- Handle background transitions efficiently
- Manage memory usage for sprite assets

## Authentication System

### Current Implementation
- Sign In and Sign Up already configured
- Uses NextAuth.js for authentication
- MongoDB for user storage

### Protected Routes
```typescript
// All game-related API routes require authentication
// Middleware configuration in src/middleware.ts
export const config = {
  matcher: [
    '/api/dashboard/:path*',
    '/api/games/:path*',
    '/api/story/:path*'
  ]
}
```

### Authentication Flow
1. User signs in/up → JWT token generated
2. Token stored in cookies
3. Token validated on each protected route
4. User ID from token used to:
   - Fetch user's games
   - Create new games
   - Access story content
   - Update game state

### Error Handling
```typescript
// Common auth error responses
{
  401: 'Unauthorized: Please sign in',
  403: 'Forbidden: Invalid token',
  404: 'User not found',
  409: 'Email already exists'
}
```

## MongoDB Configuration

### Connection Setup
```typescript
// src/lib/mongodb.ts
import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

// MongoDB Atlas connection string includes database name
// Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ai_dungeon_story
const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
```

### Collections Structure
```typescript
// Database name: ai_dungeon_story (specified in MongoDB Atlas URI)

// Users Collection
users: {
  _id: ObjectId
  email: string
  password: string (hashed)
  name: string
  createdAt: DateTime
}

// Games Collection
games: {
  _id: ObjectId
  userId: ObjectId
  genreId: string
  characterId: string
  characterStats: {
    // ... stats from character-cards.json
  }
  status: string
  currentChapter: number
  currentPage: number
  startedAt: DateTime
  lastPlayedAt: DateTime
  completedAt?: DateTime
  storyState: {
    // ... story state as defined earlier
  }
}

// UserStats Collection
userStats: {
  _id: ObjectId
  userId: ObjectId
  gamesStarted: number
  gamesCompleted: number
  genreStats: {
    [genreId]: {
      played: number
      completed: number
    }
  }
  totalPlaytime: number
  lastPlayedAt: DateTime
}
```

### Indexes
```typescript
// Performance optimization indexes
db.games.createIndex({ userId: 1, status: 1 })
db.games.createIndex({ userId: 1, lastPlayedAt: -1 })
db.userStats.createIndex({ userId: 1 }, { unique: true })
```

### Environment Variables
```bash
# Required in .env.local
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ai_dungeon_story
NEXTAUTH_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key
```

### Connection Testing
```typescript
// src/lib/db.ts
import clientPromise from './mongodb'

export async function testConnection() {
  try {
    const client = await clientPromise
    await client.db().command({ ping: 1 })
    console.log("Successfully connected to MongoDB.")
    return true
  } catch (e) {
    console.error("MongoDB connection error:", e)
    return false
  }
}
```

## Database Schema

### Games Collection
```typescript
{
  id: string
  userId: string
  genreId: string
  characterId: string  // matches IDs from overview/page.tsx
  characterStats: {    // initial stats from character-cards.json
    strength: number
    intelligence: number
    healthPoints: number
    agility: number
    magicPoints: number
    specialAttacks: string[]
  }
  status: 'active' | 'completed' | 'abandoned'
  currentChapter: number
  currentPage: number
  startedAt: DateTime
  lastPlayedAt: DateTime
  completedAt?: DateTime
}
```

### UserStats Collection
```typescript
{
  userId: string
  gamesStarted: number
  gamesCompleted: number
  genreStats: {
    [genreId]: {
      played: number
      completed: number
    }
  }
  totalPlaytime: number
  lastPlayedAt: DateTime
}
```

### Technical Considerations

#### State Management
- User authentication state
- Active games list
- Selected game state
- Loading states
- Error states

#### Caching Strategy
- Cache user stats (update periodically)
- Cache active games list (update on game state changes)

#### Security Requirements
- Verify user ownership of games
- Rate limiting for API calls
- Validate game state transitions
- Protect sensitive user data

#### Performance Optimizations
- Pagination for games list
- Lazy loading for game details
- Optimistic updates for game deletions
- Background refresh for stats

## Next Steps
1. Implement database schema and migrations
2. Create API endpoints with proper error handling
3. Implement caching strategy
4. Add security measures
5. Set up performance monitoring
6. Create integration tests
