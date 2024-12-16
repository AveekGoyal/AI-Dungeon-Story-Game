# AI Dungeon Story Game - Development Plan

## Project Overview
Restructuring the AI Dungeon Story Game to implement proper routing and state management while maintaining the current UI and streaming functionality. Take care of typescript errors while coding.

## Phase 1: State Management Implementation 
### 1.1 Zustand Store Setup 
```typescript
/src/store/
├── story.ts        // Main store with types and logic 
├── types.ts        // Additional types if needed 
└── middleware.ts   // URL sync + persistence 
```

### 1.2 Core State Structure 
- Migrate from useStoryStream:
  - Story content and streaming state 
  - Chapter/page navigation 
  - Choice management 
  - Loading states 
- Add new state:
  - Story ID 
  - Route synchronization 
  - Progress persistence 

## Phase 2: Route Structure Implementation 

### 2.1 Next.js Route Setup
```
/src/app/
├── story/
│   ├── [storyId]/
│   │   ├── chapter/
│   │   │   └── [chapterNumber]/
│   │   │       ├── page/
│   │   │       │   └── [pageNumber]/
│   │   │       │       └── page.tsx
│   │   │       └── layout.tsx
│   │   └── layout.tsx
│   └── overview/
│       └── page.tsx
```

### 2.2 Navigation Implementation
- Dynamic route parameters handling
- Chapter/page navigation logic
- Progress tracking
- Route validation and guards
- 404/error handling

## Phase 3: API Enhancement

### 3.1 Story Generation API Updates
- Update prompt structure:
  ```typescript
  interface StoryContext {
    previousChoices: string[];
    characterTraits: Record<string, number>;
    worldState: Record<string, any>;
    currentTheme: string;
    chapterContext: string;
  }
  ```

### 3.2 Context-Aware Generation
- Maintain story consistency
- Track character development
- Remember important plot points
- Adapt story based on choices
- Maintain chapter/page structure:
  - 5 chapters
  - 5 pages per chapter
  - 4-5 paragraphs per page
  - 4 meaningful choices

## Phase 4: Component Migration

### 4.1 TestStoryPage Migration
- Move to new route structure
- Connect to Zustand store
- Preserve UI and animations
- Maintain streaming functionality
- Preserve UI components
- Keep animations intact

### 4.2 Component Updates
- Navigation controls
- Progress indicators
- Loading states
- Error handling

## Phase 5: Integration and Testing

### 5.1 Integration
- Connect components to store
- Setup persistence
- URL synchronization
- Error boundaries

### 5.2 Testing
- Navigation flows
- Story generation
- State persistence
- Error scenarios

## Phase 6: Story Context Implementation

### 6.1 Planning and Analysis
- Review existing state management
  - Current Zustand store structure
  - MongoDB schema
  - API response formats
- Identify potential infinite loop triggers
  - State updates during rendering
  - Circular dependencies
  - Unnecessary re-renders
- Document UI elements that must remain unchanged
  - Story streaming behavior
  - Choice presentation
  - Chapter/page navigation
  - Loading states

### 6.2 TypeScript Interface Updates
- Create dedicated types file for context
- Extend existing interfaces gradually
- Maintain backward compatibility
- Add strict type checking
- Document type changes

### 6.3 MongoDB Schema Extension
Step 1: Add context fields
- Keep existing schema untouched
- Add new fields for context only
- Ensure backward compatibility
- Add TypeScript types first
- Test schema before deployment

Step 2: Migration strategy
- Handle existing stories
- Default values for new fields
- Validation rules
- Error handling

### 6.4 Zustand Store Enhancement
Step 1: Context state
- Add minimal context fields first
- Test each addition separately
- Prevent unnecessary re-renders
- Keep UI-related state separate

Step 2: Action handlers
- Atomic updates
- Error boundaries
- Type safety
- Performance optimization

### 6.5 API Updates
Step 1: Story Generator
- Enhance prompt structure
- Keep existing format
- Add context gradually
- Validate responses
- Error handling

Step 2: Response Processing
- Parse new context fields
- Maintain existing fields
- Type validation
- Error recovery

### 6.6 Implementation Order
1. Add TypeScript interfaces
2. Extend MongoDB schema
3. Update Zustand store
4. Enhance API prompt
5. Test each step thoroughly
6. Roll back capability

### 6.7 Testing Strategy
- Unit tests for new functions
- Integration tests for context flow
- UI regression tests
- Performance monitoring
- Error handling verification

### 6.8 Safeguards
- Feature flags for new functionality
- Fallback mechanisms
- Performance monitoring
- Error boundaries
- Type checking

### 6.9 UI Preservation
- Document current UI behavior
- Test UI after each change
- Maintain streaming functionality
- Preserve animations
- Keep loading states

### 6.10 Rollout Strategy
1. Development Phase
   - Implement in isolation
   - Test thoroughly
   - Document changes
   - Review performance

2. Testing Phase
   - Unit tests
   - Integration tests
   - UI verification
   - Performance testing

3. Deployment Phase
   - Gradual rollout
   - Monitoring
   - Fallback plan
   - Documentation

### 6.11 Success Criteria
- No UI changes
- No TypeScript errors
- No infinite loops
- Maintained performance
- Enhanced story context
- Clean error handling

## Phase 7: Cleanup

### 7.1 Cleanup Tasks
- Remove old routes
- Update imports
- Documentation updates
- Final testing

## Progress Tracking

### Phase 1: State Management
- [x] Zustand setup
- [x] State migration
- [x] Persistence setup

### Phase 2: Route Structure
- [ ] Route setup
- [ ] Navigation logic
- [ ] Error handling

### Phase 3: API Enhancement
- [ ] Context implementation
- [ ] Generation updates

### Phase 4: Component Migration
- [ ] Page migration
- [ ] Store integration
- [ ] UI preservation

### Phase 5: Integration
- [ ] Full integration
- [ ] Testing
- [ ] Bug fixes

### Phase 6: Story Context Implementation
- [ ] Planning and analysis
- [ ] TypeScript interface updates
- [ ] MongoDB schema extension
- [ ] Zustand store enhancement
- [ ] API updates
- [ ] Testing strategy
- [ ] Safeguards
- [ ] UI preservation
- [ ] Rollout strategy
- [ ] Success criteria

### Phase 7: Cleanup
- [ ] Code cleanup
- [ ] Documentation
- [ ] Final testing

## Current Status
### Project Structure 
```
src/
├── app/
│   ├── api/
│   │   ├── stories/
│   │   │   ├── route.ts                 # Main stories API
│   │   │   └── [storyId]/route.ts       # Single story operations
│   │   ├── story-generator/route.ts      # Story content generation
│   │   └── story-initializer/route.ts    # Title/description generation
│   ├── debug/
│   │   ├── mongodb/page.tsx             # MongoDB debug interface
│   │   └── zustand/page.tsx             # Zustand debug interface
│   └── story/
│       ├── overview/page.tsx            # Story creation page
│       └── [storyId]/
│           └── chapter/[chapterNumber]/
│               └── page/[pageNumber]/
│                   └── page.tsx         # Story content page
├── store/
│   ├── story.ts                         # Zustand store
│   ├── types.ts                         # Store types
│   └── middleware.ts                    # URL sync & persistence
├── models/
│   └── Story.ts                         # MongoDB schema
└── data/
    └── character-cards.json             # Character data
```

### Completed Features 
1. **State Management**
   - Zustand store implementation (`/src/store/story.ts`)
   - URL synchronization (`/src/store/middleware.ts`)
   - State persistence (`/src/store/middleware.ts`)
   - Debug page (`/src/app/debug/zustand/page.tsx`)

2. **Data Storage**
   - MongoDB integration (`/src/models/Story.ts`)
   - Story schema (`/src/models/Story.ts`)
   - CRUD API endpoints (`/src/app/api/stories/route.ts`)
   - Debug page (`/src/app/debug/mongodb/page.tsx`)

3. **Story Generation**
   - Title and description generation (`/src/app/api/story-initializer/route.ts`)
   - Story content generation (`/src/app/api/story-generator/route.ts`)
   - Character integration (`/src/data/character-cards.json`)
   - OpenAI integration (`/src/lib/openai.ts`)

4. **Layout & Structure**
   - Next.js routing (`/src/app/*`)
   - Story overview page (`/src/app/story/overview/page.tsx`)
   - Story content page (`/src/app/story/[storyId]/chapter/[chapterNumber]/page/[pageNumber]/page.tsx`)
   - Debug tools (`/src/app/debug/*`)

### Next Steps 
1. **Story Progression**
   - Implement chapter-based flow (`/src/app/story/[storyId]/chapter/[chapterNumber]/page.tsx`)
   - Add choice system (`/src/store/story.ts`)
   - Handle story branching (`/src/app/api/story-generator/route.ts`)

2. **UI/UX**
   - Add loading states (`/src/components/ui/loading.tsx`)
   - Implement progress tracking (`/src/store/story.ts`)
   - Add navigation controls (`/src/components/story/navigation.tsx`)

3. **Testing**
   - Add unit tests (`/src/__tests__/store/*`)
   - Test edge cases (`/src/__tests__/api/*`)
   - Validate state management (`/src/__tests__/integration/*`)

### Technical Notes 
- Debug pages available at:
  - `/debug/mongodb` - Database inspection
  - `/debug/zustand` - State inspection
- Story data stored in:
  - MongoDB (persistent) - See `/src/models/Story.ts`
  - Zustand (runtime) - See `/src/store/story.ts`
- Character system includes:
  - Basic stats (`/src/data/character-cards.json`)
  - Class types (`/src/data/character-cards.json`)
  - Special abilities (`/src/data/character-cards.json`)

### Known Issues 
- Need to implement proper error handling (`/src/lib/error-handler.ts`)
- Add loading states (`/src/components/ui/loading.tsx`)
- Improve type safety (`/src/types/*`)
- Add comprehensive logging (`/src/lib/logger.ts`)

## Next Steps

### 1. Route Implementation
- [ ] Set up Next.js route structure as planned
- [ ] Create layout components for each level
- [ ] Implement dynamic route parameter handling
- [ ] Add navigation guards and error pages

### 2. Testing and Validation
- [ ] Add unit tests for store logic
- [ ] Test URL sync functionality
- [ ] Validate state persistence
- [ ] Test error handling and edge cases




Implementation Strategy
Phase 1: TypeScript & Store
Add new interfaces
Extend store state
Add context actions
Update types

Phase 2: MongoDB & API
Update schema
Enhance prompt
Add context endpoints
Update responses

Phase 3: Integration
Connect store to API
Update content processing
Add context tracking
Test thoroughly
UI Preservation Guidelines

Must Preserve:
Content streaming behavior
Choice selection UI
Navigation flow
Loading states
Animations

Can Enhance:
Choice impact feedback
Story context hints
Chapter summaries