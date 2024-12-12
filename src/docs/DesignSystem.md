# Design System Documentation

## Typography

### Fonts
1. **Medieval Sharp** (Primary Display Font)
   - Used for:
     - Main headings
     - CTA buttons
     - Hero section text
   - Implementation: `medievalSharp.className`

### Color Palette

#### Primary Colors
- **Black** (`#000000`)
  - Main background color
  - Used in section backgrounds

- **White** (`#FFFFFF`)
  - Primary text color on dark backgrounds
  - Used for headings and important text

#### Accent Colors
- **Red**
  - Primary: `bg-red-700`
  - Hover: `bg-red-800`
  - Shadow: `shadow-red-900/50`
  - Used for:
    - Primary CTA buttons
    - Important action items

#### Text Colors
- **White** (`text-white`)
  - Primary text on dark backgrounds
  - Headers and important text
- **Gray** (`text-gray-300`)
  - Secondary text
  - Subtitles and descriptions

#### UI Elements
1. **Backgrounds**
   - Primary: Black
   - Pattern overlay: White dots with 10% opacity
   - Pattern size: 40px grid

2. **Buttons**
   - Primary: Red gradient with shadow
   - Text: White
   - Shadow: Red with 50% opacity

3. **Cards**
   - Background: Dark theme
   - Border: Subtle gradient

#### Interactive States
- **Hover Effects**
  - Buttons: Darker shade (red-800)
  - Cards: Subtle scale transform
  - Links: Opacity change

#### Accessibility
- High contrast between text and background
- Clear visual hierarchy using size and color
- Adequate spacing between interactive elements
