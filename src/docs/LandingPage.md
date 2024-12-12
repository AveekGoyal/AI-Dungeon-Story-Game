# AI Dungeon Story Game - Landing Page Design Specification

## Overview
A modern, game-oriented landing page with white background theme, featuring interactive character animations and dynamic content sections.

## Design Components

### 1. Navigation Bar
- **Style**: Fixed top, white background with subtle shadow
- **Components**:
  - Logo (left-aligned)
  - Navigation links (center)
  - Sign In/Sign Up buttons (right-aligned)
- **Implementation**:
  ```tsx
  <NavigationMenu className="bg-white shadow-sm">
    <NavigationMenuList>
      <Logo />
      <NavLinks />
      <AuthButtons />
    </NavigationMenuList>
  </NavigationMenu>
  ```

### 2. Hero Section
#### Left Side (Game Introduction)
- **Content**:
  - Game title with magical font
  - Engaging tagline
  - CTA button with hover effect
- **Styling**:
  ```css
  .hero-title {
    font-family: 'Medieval Fantasy';
    background: linear-gradient(to right, #4F46E5, #9333EA);
    -webkit-background-clip: text;
  }
  ```

#### Right Side (Character Showcase)
- **Assets Used**:
  - Light Mage Idle: `/sprites/mages/light-mage/Idle.png`
  - Dark Mage Idle: `/sprites/mages/dark-mage/Idle.png`
  - Fire Mage Idle: `/sprites/mages/fire-mage/Idle.png`
- **Animation**:
  - Floating animation for characters
  - Magical particle effects (using shadcn/ui)
  - Smooth transitions between states

### 3. Character Interaction Section
- **Background**: `/backgrounds/castle-interior/Castle_1/hd.png`
- **Layout**: Three-column grid with character cards
- **Features**:
  - Character selection tabs
  - Animation control buttons (Idle, Attack, Jump, etc.)
  - Real-time animation preview
- **Implementation**:
  ```tsx
  <Tabs defaultValue="mage">
    <TabsList>
      <TabsTrigger value="mage">Light Mage</TabsTrigger>
      <TabsTrigger value="warrior">Dark Mage</TabsTrigger>
      <TabsTrigger value="archer">Fire Mage</TabsTrigger>
    </TabsList>
    <TabsContent>
      <CharacterPreview />
      <AnimationControls />
    </TabsContent>
  </Tabs>
  ```

### 4. Gameplay Preview Carousel
- **Component**: Card-based carousel with choices
- **Content Structure**:
  ```typescript
  interface GameplayCard {
    background: string;
    character: string;
    villain: string;
    scenario: string;
    choices: string[];
  }
  ```
- **Sample Scenarios**:
  1. Dragon Encounter
     - Background: `/backgrounds/mountains/Mountain_5/hd.png`
     - Character: Light Mage
     - Villain: `/sprites/enemies/fire_spirit/Idle.png`
  2. Dark Forest
     - Background: `/backgrounds/winter/winter 5/hd.png`
     - Character: Dark Mage
     - Villain: `/sprites/enemies/skeleton_warrior/Idle.png`
- **Implementation**:
  ```tsx
  <Carousel>
    <CarouselContent>
      {scenarios.map((scenario) => (
        <CarouselItem>
          <GameplayCard {...scenario} />
        </CarouselItem>
      ))}
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
  ```

### 5. Review Section
- **Layout**: Grid of review cards with parallax scroll
- **Card Design**:
  - User avatar
  - Star rating
  - Review text
  - Gameplay hours
- **Styling**:
  ```css
  .review-card {
    backdrop-filter: blur(12px);
    background: rgba(255, 255, 255, 0.8);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  ```

### 6. Footer
- **Layout**: Four-column grid
- **Sections**:
  - Company info & social links
  - Quick links
  - Resources
  - Newsletter signup
- **Implementation**:
  ```tsx
  <Footer className="bg-white border-t">
    <FooterSection>
      <CompanyInfo />
      <QuickLinks />
      <Resources />
      <Newsletter />
    </FooterSection>
  </Footer>
  ```

## Animations and Interactions

### Character Animations
```typescript
interface CharacterAnimation {
  idle: string[];
  attack: string[];
  jump: string[];
  special: string[];
  transition: {
    duration: number;
    easing: string;
  };
}
```

### Scroll Effects
- Parallax scrolling for background elements
- Fade-in animations for content sections
- Smooth scroll to section navigation

### Interactive Elements
- Hover effects on buttons and cards
- Character state transitions
- Choice selection preview
- Carousel navigation

## Responsive Design

### Desktop (1200px+)
- Full-width hero section with large character displays
- Three-column character grid
- Full carousel view

### Tablet (768px - 1199px)
- Stacked hero section layout
- Two-column character grid
- Simplified animations

### Mobile (< 768px)
- Single column layout
- Scrollable character list
- Simplified carousel
- Condensed navigation menu

## Performance Considerations

### Asset Loading
- Preload essential character sprites
- Lazy load carousel content
- Progressive image loading for backgrounds

### Animation Optimization
- Use sprite sheets for character animations
- Implement requestAnimationFrame for smooth animations
- Throttle animation updates on mobile devices

### Caching Strategy
- Cache character sprites in localStorage
- Implement service worker for offline access
- Use CDN for static assets

## Technical Implementation

### Required Dependencies
```json
{
  "@radix-ui/react-navigation-menu": "latest",
  "@radix-ui/react-tabs": "latest",
  "@radix-ui/react-carousel": "latest",
  "framer-motion": "latest",
  "tailwindcss": "latest",
  "shadcn/ui": "latest"
}
```

### Key Components
1. NavigationMenu
2. CharacterDisplay
3. AnimationController
4. GameplayCarousel
5. ReviewGrid
6. Footer

### State Management
```typescript
interface LandingPageState {
  selectedCharacter: string;
  currentAnimation: string;
  carouselIndex: number;
  loadedAssets: Set<string>;
}
```

## Accessibility

### ARIA Labels
- Proper navigation labeling
- Animation control descriptions
- Carousel navigation assistance

### Keyboard Navigation
- Tab navigation for all interactive elements
- Keyboard shortcuts for animations
- Arrow key carousel control

### Color Contrast
- Minimum 4.5:1 contrast ratio for text
- Visual indicators for interactive elements
- Alternative text for decorative elements

## Landing Page Documentation

### Overview
The landing page is designed to provide an immersive and interactive introduction to the AI Dungeon Story Game. It showcases the game's key features through a modern, responsive design built with shadcn/ui components.

### Section Breakdown

### 1. Hero Section
- **Left Side**:
  - Captivating title with magical gradient text effect
  - Engaging description of the game
  - Call-to-action buttons using shadcn/ui components
- **Right Side**:
  - Animated character showcase featuring:
    - Light Mage
    - Dark Mage
    - Fire Mage
  - Custom floating animations
  - Particle effects for enhanced visual appeal

### 2. Interactive Character Preview
- **Layout**: Three-column grid layout
- **Available Characters**:
  - Mages:
    - Light Mage
    - Dark Mage
    - Fire Mage
  - Warriors:
    - Knight
    - Swordsmen
    - Rapier
  - Ranged:
    - Archer
    - Crimson
- **Features**:
  - Real-time animation controls
    - Idle animation
    - Attack sequences
    - Jump animations
  - Character information display
  - Interactive hover effects

### 3. Gameplay Preview Carousel
- **Content Types**:
  - Dynamic scenario demonstrations
  - Character vs Enemy encounters
  - Multiple choice story decisions
- **Backgrounds**:
  - Castle interiors
  - Mountain landscapes
  - Winter scenes
- **Interactive Elements**:
  - Navigation controls
  - Preview descriptions
  - Sample dialogue options

## Asset Specifications

### Character Sprites
- **Quality**: 20-32KB per frame
- **Format**: Optimized PNG sequences
- **Animation Types**:
  - Idle
  - Walk
  - Attack sequences
  - Special abilities

### Background Images
- **Quality**: HD resolution
- **Format**: Optimized for web
- **Variants**: Multiple themed environments

### UI Elements
- **Book Items**: High-resolution (305-494 KB)
- **Icons**: Vector-based for scalability
- **UI Components**: shadcn/ui library

## Technical Implementation

### Component Architecture
- Built with shadcn/ui for modern UI elements
- Modular component structure
- Reusable animation components
- Custom hooks for state management

### Performance Optimization
- **Asset Loading**:
  - Efficient caching strategy
  - Progressive loading
  - Preloading for critical assets
- **Image Optimization**:
  - Compressed sprites
  - Responsive image loading
  - WebP format support

### Responsive Design
- Mobile-first approach
- Breakpoint-specific layouts
- Fluid typography
- Adaptive UI elements

### Progressive Web App Features
- Service worker implementation
- Offline access capability
- App-like experience
- Fast subsequent loads

## Best Practices
- Semantic HTML structure
- Accessibility compliance
- Performance monitoring
- Cross-browser compatibility
- Mobile responsiveness
- SEO optimization

## Development Guidelines
1. Follow component naming conventions
2. Maintain consistent code style
3. Document component props
4. Include responsive breakpoints
5. Optimize asset loading
6. Implement error boundaries
7. Add loading states
8. Handle edge cases

## Future Enhancements
- [ ] Add more character classes
- [ ] Implement advanced particle effects
- [ ] Enhance animation transitions
- [ ] Add sound effects
- [ ] Expand background collection
- [ ] Improve mobile interactions
