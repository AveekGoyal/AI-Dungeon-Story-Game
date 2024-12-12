# Story Page Design Document (MVP)

## Overview
The Story page is where players experience their adventure through AI-generated narratives, make choices, and engage in battles. The design will maintain consistency with our existing UI components and utilize our available assets.

## Available Assets (refer to /data folder and AssetsData.md)

### Character Classes
- Archer: Ranged combat specialist
- Crimson: Balanced fighter
- Knight: Heavy armor defender
- Rapier: Agile fighter
- Swordsmen: Standard melee

### Enemies
Located in `/components/enemies/`:
- BlackWerewolf, RedWerewolf, WhiteWerewolf
- FireMage, FireSpirit
- ForestTroll, MountainTroll, SwampTroll
- Plent (Plant Enemy)
- Skeleton variants (Archer, Spearman, Warrior)

### Backgrounds
- Mountain scenes (3 variants with parallax layers)
- Forest backgrounds
- Cave environments
- Village settings

## Page Layout

### Header Section (10vh)
- Story title using our medieval font (consistent with landing page)
- Chapter number
- Character stats display (HP, Level)
- Exit to dashboard button

### Main Story Section (60vh)
- Glassy container matching our UI theme
- Gradient background based on scene
- Text appears with typewriter effect
- Paragraphs kept concise (2-3 sentences)
- Word count: 100-150 words per scene (optimized for AI response time)

### Choice Section (30vh)
- 2-3 choices per decision point (MVP scope)
- Matching glass-morphism style from character selection
- Hover effects consistent with our button styling

## Components Breakdown

### 1. StoryContainer
```typescript
interface StoryContainerProps {
  currentScene: Scene
  character: Character
  choices: Choice[]
  onChoiceSelect: (choice: Choice) => void
}
```
- Manages scene state
- Handles text streaming
- Controls background transitions
- Uses existing glass-morphism styles

### 2. BattleScene
```typescript
interface BattleSceneProps {
  character: Character
  enemy: Enemy  // From /components/enemies
  onBattleComplete: (outcome: BattleOutcome) => void
}
```
- Simple turn-based combat
- Uses existing character/enemy sprites
- Health bars with our UI theme
- Basic attack animations

### 3. ChoicePanel
```typescript
interface Choice {
  id: string
  text: string
  consequence: string
  requirements?: {
    level?: number
    stats?: CharacterStats
  }
}
```
- Glass-morphism styling
- Hover animations
- Basic requirement checks

## AI Story Generation (MVP Scope)

### Scene Generation
- **Prompt Structure**:
  ```json
  {
    "character": {
      "name": string,
      "class": string,
      "level": number
    },
    "location": string,
    "previousAction": string,
    "tone": string
  }
  ```
- Stream text for instant display
- Generate one scene ahead

### Battle Integration
1. **Battle Triggers**:
   - Story-driven encounters only (no random battles in MVP)
   - Use enemies from our components/enemies folder
2. **Battle System**:
   - Basic turn-based combat
   - Simple attack/defend options
   - Class-specific abilities

## Technical Implementation

### 1. Text Streaming
```typescript
const streamText = async (text: string) => {
  // Use same animation timing as landing page
  const CHAR_DELAY = 30 // ms per character
}
```

### 2. Scene Transitions
- Fade transitions (consistent with our existing pages)
- Preload next background
- Simple parallax effect using existing layers

### 3. State Management
```typescript
interface StoryState {
  currentScene: Scene
  character: Character
  choices: Choice[]
  battleState?: BattleState
}
```

## UI Guidelines

### Styling
- Use existing color scheme
- Glass-morphism containers
- Gradient backgrounds
- Medieval font for headers
- Body text: 18px, line height 1.6

### Animations
- Text typing: 30ms per character
- Choice appear: 200ms fade
- Scene transition: 400ms crossfade
- Battle animations: Use sprite frame timing

## MVP Features Priority
1. Basic story progression with choices
2. Text streaming effect
3. Simple battle system
4. Scene backgrounds
5. Basic sound effects
6. Save progress

## Next Steps
1. Create story container with text streaming
2. Implement choice system
3. Add basic battle mechanics
4. Integrate existing backgrounds
5. Add save functionality
