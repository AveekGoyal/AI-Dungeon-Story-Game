# Project Structure

This document outlines the structure of the AI Dungeon Story Game project. It is automatically updated as files are added or removed.

## Directory Structure

```
/src
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   │   └── page.tsx           # Sign in page
│   │   └── sign-up/
│   │       └── page.tsx           # Sign up page
│   ├── api/
│   │   ├── auth/
│   │   │   ├── sign-in/
│   │   │   │   └── route.ts       # Sign in API
│   │   │   └── sign-up/
│   │   │       └── route.ts       # Sign up API
│   │   ├── characters/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts       # Character detail API
│   │   │   └── route.ts           # Character list API
│   │   ├── game/
│   │   │   ├── load/
│   │   │   │   └── route.ts       # Game load API
│   │   │   └── save/
│   │   │       └── route.ts       # Game save API
│   │   └── genres/
│   │       ├── [id]/
│   │       │   └── route.ts       # Genre detail API
│   │       └── route.ts           # Genre list API
│   ├── dashboard/
│   │   └── page.tsx               # Main dashboard
│   ├── game/
│   │   ├── achievements/
│   │   │   └── page.tsx           # Achievements page
│   │   ├── character-creation/
│   │   │   └── page.tsx           # Character creation
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Game dashboard
│   │   ├── game-interface/
│   │   │   └── page.tsx           # Game interface
│   │   └── layout.tsx             # Game layout
│   ├── favicon.ico                # Site favicon
│   ├── fonts.ts                   # Font configurations
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Landing page
├── components/
│   └── ui/
│       ├── character-sprite.tsx   # Character sprite component
│       └── tabs.tsx               # Tabs component
├── config/
│   ├── animation-configs.ts       # Animation configurations
│   ├── characters/
│   │   ├── dark-mage.ts          # Dark mage config
│   │   ├── fire-mage.ts          # Fire mage config
│   │   ├── index.ts              # Character configs index
│   │   └── light-mage.ts         # Light mage config
│   └── genres.ts                 # Genre configurations
├── docs/
│   ├── AssetsData.md             # Asset documentation
│   ├── ComponentStructure.md      # Component documentation
│   ├── DashboardPage.md          # Dashboard specifications
│   ├── DesignSystem.md           # Design system guide
│   ├── DevelopmentPlan.md        # Development roadmap
│   ├── LandingPage.md            # Landing page documentation
│   ├── NewGameFlow.md            # Game flow documentation
│   ├── ProjectStructure.md       # This file
│   └── PromptContext.md          # AI assistant context
├── lib/
│   └── auth.ts                   # Authentication utilities
├── middleware/
│   └── auth.ts                   # Authentication middleware
├── models/
│   ├── character.ts              # Character model
│   ├── genre.ts                  # Genre model
│   ├── story.ts                  # Story model
│   └── user.ts                   # User model
├── styles/
│   └── sprites.css               # Sprite animations
└── types/
    ├── auth.ts                   # Auth type definitions
    └── character.ts              # Character type definitions
```

## Key Components

### Authentication
- `lib/auth.ts`: JWT token handling, password hashing, and user sanitization
- `middleware/auth.ts`: API route authentication middleware
- `types/auth.ts`: Authentication type definitions
- `app/(auth)/*`: Authentication pages and forms

### Game Components
- `components/ui/character-sprite.tsx`: Animated character sprites
- `config/characters/*`: Character class configurations
- `config/animation-configs.ts`: Animation settings
- `config/genres.ts`: Genre configurations for the new game flow.

### API Routes
- `/api/auth/*`: Authentication endpoints
- `/api/characters/*`: Character management
- `/api/genres/*`: Genre management
- `/api/game/*`: Game state management

### Models
- `character.ts`: Character attributes, abilities, and progression
- `genre.ts`: Story genres and theme settings
- `story.ts`: Story progression and state management
- `user.ts`: User profiles and authentication

### Pages
- `app/page.tsx`: Landing page
- `app/dashboard/*`: Main user dashboard
- `app/game/*`: Game-related pages
  - Character creation
  - Game interface
  - Achievements
  - Game dashboard

### Documentation
- `AssetsData.md`: Game assets and resources
- `ComponentStructure.md`: UI component documentation
- `DashboardPage.md`: Dashboard specifications
- `DesignSystem.md`: UI/UX guidelines
- `DevelopmentPlan.md`: Project roadmap
- `LandingPage.md`: Landing page specifications
- `NewGameFlow.md`: Game mechanics and flow
- `PromptContext.md`: AI assistant context

## Technology Stack

- **Frontend**: Next.js 13+ (App Router)
- **Database**: MongoDB with Mongoose
- **Authentication**: Custom JWT implementation
- **API**: REST endpoints using Next.js API routes
- **Styling**: Global CSS and component-level styles
- **Types**: TypeScript for type safety
