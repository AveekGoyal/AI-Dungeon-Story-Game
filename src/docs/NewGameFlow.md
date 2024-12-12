# New Game Flow Implementation Plan

## 1. UI/UX Flow

### A. Genre Selection Screen
```
/new-game/genre
```
- **Layout**: Grid of genre cards
- **Each Genre Card Contains**:
  - Genre title
  - Thematic background image
  - Brief description
  - Available character types preview
- **Animations**: Hover effects, selection highlight
- **Navigation**: Next button enabled only after selection

### B. Character Selection Screen
```
/new-game/character
```
- **Layout**: Character showcase carousel
- **For Each Character**:
  - Animated character preview
  - Class name and description
  - Base stats preview
  - Special abilities preview
- **Auto-assigned Attributes**:
  - Base stats per character class
  - Scaling factors for level progression
  - Experience points requirements
- **Auto-unlocking Abilities**:
  - Level-based ability unlocks
  - Ability upgrade paths
  - Special move combinations

### C. Character Customization
```
/new-game/customize
```
- **Name Selection**:
  - Name input field
  - Random name generator
  - Name validation
- **Visual Customization**:
  - Color variations
  - Accessories (if applicable)
  - Preview in different poses

## 2. Data Models

### A. Character Class Template
\`\`\`typescript
interface CharacterClass {
  id: string;
  name: string;
  baseStats: {
    strength: number;
    intelligence: number;
    dexterity: number;
    vitality: number;
    magic: number;
  };
  levelingRates: {
    strength: number;
    intelligence: number;
    dexterity: number;
    vitality: number;
    magic: number;
  };
  abilities: {
    [level: number]: {
      unlock: Ability[];
      upgrade: Ability[];
    };
  };
}
\`\`\`

### B. Genre Configuration
\`\`\`typescript
interface Genre {
  id: string;
  name: string;
  description: string;
  availableClasses: string[]; // Character class IDs
  themeSettings: {
    colorPalette: string[];
    musicTracks: string[];
    environmentTypes: string[];
  };
  storyParameters: {
    toneModifiers: string[];
    commonThemes: string[];
    challengeTypes: string[];
  };
}
\`\`\`

## 3. API Endpoints

### A. Genre Management
- GET `/api/genres` - List all available genres
- GET `/api/genres/:id` - Get genre details
- GET `/api/genres/:id/characters` - Get available characters for genre

### B. Character Creation
- GET `/api/characters/classes` - List character classes
- GET `/api/characters/classes/:id` - Get class details
- POST `/api/characters/create` - Create new character
- GET `/api/characters/names/generate` - Generate random name

## 4. State Management

### A. New Game Context
\`\`\`typescript
interface NewGameState {
  selectedGenre: Genre | null;
  selectedClass: CharacterClass | null;
  characterName: string;
  customization: CustomizationOptions;
  progress: {
    genreSelected: boolean;
    classSelected: boolean;
    nameConfirmed: boolean;
    customizationComplete: boolean;
  };
}
\`\`\`

### B. Progress Tracking
- Save partial progress
- Allow going back/forth
- Validate each step

## 5. Implementation Phases

### Phase 1: Genre Selection (1-2 days)
- [ ] Create genre selection UI
- [ ] Implement genre cards with animations
- [ ] Set up genre data and API
- [ ] Add selection validation

### Phase 2: Character Class System (2-3 days)
- [ ] Design character class showcase
- [ ] Implement stat calculation system
- [ ] Create ability unlock system
- [ ] Set up character preview animations

### Phase 3: Customization (2-3 days)
- [ ] Build name input/generation system
- [ ] Create customization UI
- [ ] Implement preview system
- [ ] Add validation and completion checks

### Phase 4: Integration (1-2 days)
- [ ] Connect all screens with routing
- [ ] Implement progress tracking
- [ ] Add data persistence
- [ ] Create transition animations

## 6. Technical Considerations

### A. Performance
- Preload assets for next steps
- Optimize character animations
- Cache genre/class data
- Minimize state updates

### B. User Experience
- Clear progress indicators
- Smooth transitions
- Helpful tooltips
- Error prevention

### C. Data Management
- Local storage for progress
- Session handling
- Error recovery
- Data validation

## 7. Testing Scenarios

### A. User Flow
- Complete flow testing
- Back navigation
- Error handling
- Progress saving

### B. Data Validation
- Character name restrictions
- Selection requirements
- Progress tracking accuracy
- State management

### C. Performance
- Asset loading times
- Animation smoothness
- State update efficiency
- Memory usage

## Next Steps
1. Set up the basic routing structure
2. Create the genre selection UI
3. Implement the character class system
4. Build the customization interface
5. Add state management and data persistence
