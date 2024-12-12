# AI Dungeon Story Game Asset Documentation

## 1. Directory Structure

### 1.1 Adventurer Sprites
- Archer: /sprites/adventurer/archer/ (20-24KB per frame)
  - Combat Files:
    - Attack_1.png
    - Shot_1.png
    - Shot_2.png
  - Movement Files:
    - Walk.png
    - Run.png
    - Jump.png
  - State Files:
    - Idle.png
    - Idle_2.png
    - Hurt.png
    - Dead.png
  - Specialization: Ranged combat with bow attacks

- Crimson: /sprites/adventurer/crimson/ (20-25KB per frame)
  - Combat Files:
    - Attack_1.png
    - Attack_2.png
    - Attack_3.png
    - Attack_4.png
  - Movement Files:
    - Walk.png
    - Run.png
    - Jump.png
  - State Files:
    - Idle.png
    - Hurt.png
    - Dead.png
  - Specialization: Balanced fighter with multiple attack combinations

- Knight: /sprites/adventurer/knight/ (23-32KB per frame)
  - Combat Files:
    - Attack 1.png
    - Attack 2.png
    - Attack 3.png
    - Run+Attack.png
  - Movement Files:
    - Walk.png (32KB)
    - Run.png (30KB)
    - Jump.png (29KB)
  - Special Files:
    - Defend.png
  - State Files:
    - Idle.png
    - Dead.png
  - Specialization: Heavy armor class with defensive capabilities

- Rapier: /sprites/adventurer/rapier/ (20-26KB per frame)
  - Combat Files:
    - Attack_1.png
    - Attack_2.png
    - Attack_3.png
    - Attack_4.png
  - Movement Files:
    - Walk.png
    - Run.png
    - Jump.png
  - State Files:
    - Idle.png
    - Hurt.png
    - Dead.png
  - Specialization: Quick, agile fighter specializing in thrust attacks

- Swordsmen: /sprites/adventurer/swordsmen/ (20-24KB per frame)
  - Combat Files:
    - Attack_1.png
    - Attack_2.png
    - Attack_3.png
  - Movement Files:
    - Walk.png
    - Run.png
    - Jump.png
  - State Files:
    - Idle.png
    - Idle_2.png
    - Hurt.png
    - Dead.png
  - Specialization: Balanced melee fighter with standard sword combat

### 1.2 Enemy Sprites
- Plant Enemy (Plent): /sprites/enemies/plent/ (20-29KB per frame)
  - Combat Files:
    - Attack_1.png
    - Attack_2.png
    - Attack_3.png
    - Attack_Disquise.png
  - Special Files:
    - Cloud_posion.png
    - Disguise.png
    - Poison.png
  - Movement Files:
    - Walk.png
  - State Files:
    - Idle.png
    - Hurt.png
    - Dead.png
  - Specialization: Stealth enemy with poison abilities

- Fire Spirit: /sprites/enemies/fire_spirit/ (19-34KB per frame)
  - Combat Files:
    - Attack.png
    - Shot.png
  - Special Files:
    - Charge.png
    - Explosion.png
    - Flame.png
  - Movement Files:
    - Walk.png
    - Run.png
  - State Files:
    - Idle.png
    - Idle_2.png
    - Hurt.png
    - Dead.png
  - Specialization: Ranged fire-based attacker

- Skeleton: /sprites/enemies/skeleton/ (19-23KB per frame)
  - Combat Files:
    - Attack_1.png
    - Attack_2.png
    - Attack_3.png
  - Special Files:
    - Special_attack.png
  - Movement Files:
    - Walk.png
    - Run.png
    - Jump.png
  - State Files:
    - Idle.png
    - Hurt.png
    - Dead.png
  - Specialization: Basic melee fighter with varied attacks

- Skeleton Archer: /sprites/enemies/skeleton_archer/ (17-28KB per frame)
  - Combat Files:
    - Attack_1.png
    - Attack_2.png
    - Attack_3.png
    - Shot_1.png
    - Shot_2.png
  - Special Files:
    - Arrow.png
    - Evasion.png
  - Movement Files:
    - Walk.png
  - State Files:
    - Idle.png
    - Hurt.png
    - Dead.png
  - Specialization: Ranged skeleton with evasive abilities

- Skeleton Spearman: /sprites/enemies/skeleton_spearman/ (20-24KB per frame)
  - Combat Files:
    - Attack_1.png
    - Attack_2.png
    - Run+attack.png
  - Special Files:
    - Protect.png
    - Fall.png
  - Movement Files:
    - Walk.png
    - Run.png
  - State Files:
    - Idle.png
    - Hurt.png
    - Dead.png
  - Specialization: Defensive fighter with spear combat

- Skeleton Warrior: /sprites/enemies/skeleton_warrior/ (19-27KB per frame)
  - Combat Files:
    - Attack_1.png
    - Attack_2.png
    - Attack_3.png
    - Run+attack.png
  - Special Files:
    - Protect.png
  - Movement Files:
    - Walk.png
    - Run.png
  - State Files:
    - Idle.png
    - Hurt.png
    - Dead.png
  - Specialization: Heavy armored skeleton with shield

- Troll: /sprites/enemies/trolls/ (362-622KB per frame)
  - Three Variants: troll1, troll2, troll3 (identical structure)
  - Combat Files (10 frames each):
    - Attack_000.png through Attack_009.png
  - Movement Files (10 frames each):
    - Walk_000.png through Walk_009.png
    - Run_000.png through Run_009.png
    - Jump_000.png through Jump_009.png
  - State Files (10 frames each):
    - Idle_000.png through Idle_009.png
    - Hurt_000.png through Hurt_009.png
    - Dead_000.png through Dead_009.png
  - Specialization: Large, high-detail enemy with full animation sets

- Werewolves: /sprites/enemies/warewolfs/ (21-38KB per frame)
  Three color variants with identical structure:
  
  1. **Black Werewolf** (/black_warewolfs/):
    - Combat Files:
      - Attack_1.png
      - Attack_2.png
      - Attack_3.png
      - Run+Attack.png
    - Movement Files:
      - walk.png
      - Run.png
      - Jump.png
    - State Files:
      - Idle.png
      - Hurt.png
      - Dead.png
      
  2. **White Werewolf** (/white_warewolfs/):
    - Combat Files:
      - Attack_1.png
      - Attack_2.png
      - Attack_3.png
      - Run+Attack.png
    - Movement Files:
      - Walk.png
      - Run.png
      - Jump.png
    - State Files:
      - Idle.png
      - Hurt.png
      - Dead.png
      
  3. **Red Werewolf** (/red_warewolfs/):
    - Combat Files:
      - Attack_1.png
      - Attack_2.png
      - Attack_3.png
      - Run+Attack.png
    - Movement Files:
      - Walk.png
      - Run.png
      - Jump.png
    - State Files:
      - Idle.png
      - Hurt.png
      - Dead.png
  
  Specialization: Fast, aggressive melee fighters with color variants

### 1.3 Mage Sprites

- Dark Mage: /sprites/mages/dark-mage/ (19-30KB per frame)
  - Combat Files:
    - Attack_1.png
    - Attack_2.png
  - Special Files:
    - Magic_sphere.png
    - Magic_arrow.png
  - Movement Files:
    - Walk.png
    - Run.png
    - Jump.png
  - State Files:
    - Idle.png
    - Hurt.png
    - Dead.png
  - Specialization: Dark magic specialist with sphere and arrow attacks

- Enchantress: /sprites/mages/enchantress/ (19-25KB per frame)
  - Combat Files:
    - Attack_1.png
    - Attack_2.png
    - Attack_3.png
    - Attack_4.png
  - Movement Files:
    - Walk.png
    - Run.png
    - Jump.png
  - State Files:
    - Idle.png
    - Hurt.png
    - Dead.png
  - Specialization: Versatile spellcaster with multiple attack combinations

- Fire Mage: /sprites/mages/fire-mage/ (19-32KB per frame)
  - Combat Files:
    - Attack_1.png
    - Attack_2.png
  - Special Files:
    - Fireball.png
    - Flame_jet.png
  - Movement Files:
    - Walk.png
    - Run.png
    - Jump.png
  - State Files:
    - Idle.png
    - Hurt.png
    - Dead.png
  - Specialization: Fire magic specialist with powerful ranged attacks

- Light Mage: /sprites/mages/light-mage/ (19-32KB per frame)
  - Combat Files:
    - Attack_1.png
    - Attack_2.png
  - Special Files:
    - Light_ball.png
    - Light_charge.png
  - Movement Files:
    - Walk.png
    - Run.png
    - Jump.png
  - State Files:
    - Idle.png
    - Hurt.png
    - Dead.png
  - Specialization: Light magic specialist with charged attacks

- Wizard: /sprites/mages/wizard/ (20-25KB per frame)
  - Combat Files:
    - Attack_1.png
    - Attack_2.png
    - Attack_3.png
  - Movement Files:
    - Walk.png
    - Run.png
    - Jump.png
  - State Files:
    - Idle.png
    - Hurt.png
    - Dead.png
  - Specialization: Traditional wizard with diverse spell combinations

### 1.4 Inventory Assets

The inventory assets are organized into three categories based on their quality and intended use. Each category follows specific naming conventions and quality guidelines:

#### File Organization
- All inventory assets are located in the `/assets/` directory
- Each asset type has its own subdirectory (e.g., `/assets/books/`, `/assets/belts/`)
- Assets are numbered sequentially within their directories
- Preview assets use the "Icon" prefix in their filenames

#### Naming Conventions
1. **High-Quality Assets** (200KB+)
   - Standard pattern: `{1-50}.png` (for 50-item collections)
   - Exception: Coins use `{1-3}.png`
   - Example: `1.png`, `2.png`, `3.png`, etc.

2. **Medium-Quality Assets** (50-200KB)
   - Pattern includes descriptive prefix: `daggers ({1-10}).png`
   - Example: `daggers (1).png`, `daggers (2).png`, etc.

3. **Preview Assets** (1-3KB)
   - Standard pattern: `Icon{1-48}.png`
   - Special variants may include suffixes (e.g., `Icon1_no_effect.png`)
   - Example: `Icon1.png`, `Icon2.png`, etc.

#### Quality Guidelines
1. **High-Quality Assets** (200KB+)
   - Used for detailed item views and main displays
   - Average size range: 300-400 KB
   - Full detail and high resolution
   - Examples: books, boots, dragon loot

2. **Medium-Quality Assets** (50-200KB)
   - Balanced for both detail and performance
   - Average size range: 50-160 KB
   - Moderate resolution and detail
   - Examples: daggers

3. **Preview Assets** (1-3KB)
   - Optimized for inventory grid displays
   - Average size range: 1.4-2.9 KB
   - Low resolution but clear visibility
   - Examples: belts, minerals, shields

#### High-Quality Assets
These assets are suitable for detailed views and main displays:

1. **Alchemical Ingredients** (/assets/alchemical-ingredients/)
   - High-resolution images (227-420 KB per file)
   - 50 unique ingredient images
   - Suitable for detailed item views and main game displays
   - Average file size: 320 KB
   - Naming pattern: {1-50}.png

2. **Books** (/assets/books/)
   - High-resolution book images (305-494 KB per file)
   - 50 unique magical books and tomes
   - Suitable for detailed item views and main game displays
   - Average file size: 380 KB
   - Naming pattern: {1-50}.png

3. **Boots** (/assets/boots/)
   - High-resolution boot images (230-431 KB per file)
   - 50 unique magical and combat boots
   - Suitable for detailed item views and main game displays
   - Average file size: 330 KB
   - Naming pattern: {1-50}.png

4. **Coins** (/assets/coins/)
   - High-resolution coin images (288-325 KB per file)
   - 3 unique currency coin designs
   - Suitable for detailed item views and main game displays
   - Average file size: 308 KB
   - Naming pattern: {1-3}.png

5. **Dragon Loot** (/assets/dragon-loot/)
   - High-resolution treasure images (219-395 KB per file)
   - 50 unique dragon treasures and artifacts
   - Suitable for detailed item views and main game displays
   - Average file size: 312 KB
   - Naming pattern: {1-50}.png

#### Medium-Quality Assets
These assets are balanced for both detailed views and performance:

1. **Daggers** (/assets/daggers/)
   - Medium-resolution dagger images (54-161 KB per file)
   - 10 unique combat daggers
   - Balanced for both detailed views and performance
   - Average file size: 94 KB
   - Naming pattern: daggers ({1-10}).png

#### Preview Assets
These assets are optimized for inventory displays and thumbnails:

1. **Belts** (/assets/belts/)
   - Low-resolution preview icons (~1.7 KB per file)
   - 48 unique belt icons
   - Optimized for inventory grid display
   - Size range: 1.4-2 KB per icon
   - Naming pattern: Icon{1-48}.png

2. **Bows and Crossbows** (/assets/bow-and-crossbow/)
   - Low-resolution weapon icons (~1.9 KB per file)
   - 48 unique weapons with two variants each:
     - With effects: Icon{1-48}.png
     - Without effects: Icon{1-48}_no_effect.png
   - Optimized for inventory grid display
   - Size range: 1.4-2.9 KB per icon

3. **Minerals** (/assets/minerals/)
   - Low-resolution mineral icons (~2 KB per file)
   - 48 unique precious minerals and gems
   - Optimized for inventory grid display
   - Size range: 1.4-2.3 KB per icon
   - Naming pattern: Icon{1-48}.png

4. **Shields and Amulets** (/assets/shield-and-amulet/)
   - Low-resolution equipment icons (~2.1 KB per file)
   - 48 unique defensive items and magical amulets
   - Optimized for inventory grid display
   - Size range: 1.6-2.8 KB per icon
   - Naming pattern: Icon{1-48}.png

### 1.4 Background Assets

#### Battleground
Located in `/backgrounds/battleground/`

Each battleground has both Bright and Pale variants, with multiple layer files for parallax effects.

#### Variants:
1. **Battleground1**
   - Bright Version:
     - Layer files: hills&trees.png, ruins.png, ruins2.png, ruins_bg.png, sky.png, statue.png, stones&grass.png
     - Display File: `Battleground1.png` (265.8 KB)
   - Pale Version:
     - Layer files: Same as Bright
     - Display File: `Battleground1.png` (259.1 KB)

2. **Battleground2**
   - Bright Version:
     - Layer files: bg.png, candeliar.png, columns&flags.png, dragon.png, floor.png, mountaims.png, wall@windows.png
     - Display File: `Battleground2.png` (176.6 KB)
   - Pale Version:
     - Layer files: Same as Bright
     - Display File: `Battleground2.png` (171.9 KB)

3. **Battleground3**
   - Bright Version:
     - Layer files: fireflys.png, grass&road.png, grasses.png, jungle_bg.png, lianas.png, sky.png, tree_face.png, trees&bushes.png
     - Display File: `Battleground3.png` (209.3 KB)
   - Pale Version:
     - Layer files: Same as Bright
     - Display File: `Battleground3.png` (203.4 KB)

4. **Battleground4**
   - Bright Version:
     - Layer files: back_trees.png, bones.png, crypt.png, graves.png, ground.png, sky.png, tree.png, wall.png
     - Display File: `Battleground4.png` (137.4 KB)
   - Pale Version:
     - Layer files: Same as Bright
     - Display File: `graves.png` (139.9 KB)

### Castle Interior
Located in `/backgrounds/castle-interior/`

Each variant includes plan files showing different layers and a preview image.

#### Variants:
1. **Background 1**
   - Layer files: Plan files (1-5), background 1.png
   - Display File: `Preview 1.png` (142.9 KB)

2. **Background 2**
   - Layer files: Plan files (1-4), background 2.png
   - Display File: `Preview 2.png` (120.9 KB)

3. **Background 3**
   - Layer files: Plan files (1-4), background 3.png
   - Display File: `Preview 3.png` (167.5 KB)

4. **Background 4**
   - Layer files: Plan files (1-3), background 4.png
   - Display File: `Preview 4.png` (138.4 KB)

### Mountains
Located in `/backgrounds/mountains/`

Each variant includes numbered layer files and preview images.

#### Variants:
1. **Mountain1**
   - Layer files: 1.png through 5.png
   - Display File: `PRE_ORIG_SIZE.png` (21.1 KB)

2. **Mountain2**
   - Layer files: 1.png through 7.png
   - Display File: `PRE_ORIG_SIZE.png` (19.6 KB)

3. **Mountain3**
   - Layer files: 1.png through 5.png
   - Display File: `PRE_ORIG_SIZE.png` (40.4 KB)

4. **Mountain4**
   - Layer files: 1.png through 3.png
   - Display File: `pre.png` (48.1 KB)

5. **Mountain5**
   - Layer files: 2.png through 5.png
   - Display File: `pre.png` (63.8 KB)

6. **Mountain6**
   - Layer files: 1.png through 5.png
   - Display File: `pre.png` (54.3 KB)

7. **Mountain7**
   - Layer files: 1.png, 2.png, 3_3.png
   - Display File: `BIGPRE_ORIG_SIZE.png` (47.2 KB)

8. **Mountain8**
   - Layer files: 1_1.png, 2.png, 3.png
   - Display File: `BIGPRE_ORIG_SIZE.png` (57.4 KB)

### Ocean
Located in `/backgrounds/ocean/`

Each variant includes multiple layer files for parallax effects.

#### Variants:
1. **Ocean_1**
   - Layer files: 1.png through 4.png
   - Display File: `4.png` (45.9 KB)

2. **Ocean_2**
   - Layer files: 1.png through 5.png
   - Display File: `5.png` (52.9 KB)

3. **Ocean_3**
   - Layer files: 1.png through 5.png
   - Display File: `5.png` (36.8 KB)

4. **Ocean_4**
   - Layer files: 1.png through 5.png
   - Display File: `5.png` (49.1 KB)

5. **Ocean_5**
   - Layer files: 1.png through 5.png
   - Display File: `5.png` (42.2 KB)

6. **Ocean_6**
   - Layer files: 1.png through 5.png
   - Display File: `5.png` (48.2 KB)

7. **Ocean_7**
   - Layer files: 1.png through 6.png
   - Display File: `6.png` (60.4 KB)

8. **Ocean_8**
   - Layer files: 1.png through 6.png
   - Display File: `6.png` (57.4 KB)

### Winter
Located in `/backgrounds/winter/`

Each variant includes layer files and an HD version.

#### Variants:
1. **Winter_1**
   - Layer files: 1.png through 7.png
   - Display File: `hd.png` (87.9 KB)

2. **Winter_2**
   - Layer files: 1.png through 6.png
   - Display File: `hd.png` (66.6 KB)

3. **Winter_3**
   - Layer files: 1.png through 4.png
   - Display File: `hd.png` (32.7 KB)

4. **Winter_4**
   - Layer files: 1.png through 4.png
   - Display File: `hd.png` (68.2 KB)

5. **Winter_5**
   - Layer files: 1.png through 11.png
   - Display File: `hd.png` (88.9 KB)

6. **Winter_6**
   - Layer files: 1.png through 4.png
   - Display File: `hd.png` (48.6 KB)

7. **Winter_7**
   - Layer files: 1.png through 4.png
   - Display File: `hd.png` (46.1 KB)

8. **Winter_8**
   - Layer files: 1.png through 4.png
   - Display File: `hd.png` (57.7 KB)

### Crystal Cave
Located in `/backgrounds/crystal-cave/`

Each variant includes plan files showing different layers and a preview image.

#### Variants:
1. **Background 1**
   - Layer files: Plan files (1-5), background 1.png
   - Display File: `Preview 1.png` (51.5 KB)

2. **Background 2**
   - Layer files: Plan files (1-4), background 2.png
   - Display File: `Preview 2.png` (56.0 KB)

3. **Background 3**
   - Layer files: Plan files (1-4), background 3.png
   - Display File: `Preview 3.png` (56.0 KB)

4. **Background 4**
   - Layer files: Plan files (1-5), background 4.png
   - Display File: `Preview 4.png` (58.5 KB)

### Summer
Located in `/backgrounds/summer/`

Each variant includes multiple layer files and a composite image.

#### Variants:
1. **Summer 1**
   - Layer files: 1.png through 4.png
   - Display File: `Summer1.png` (73.6 KB)

2. **Summer 2**
   - Layer files: 1.png through 4.png
   - Display File: `Summer2.png` (36.0 KB)

3. **Summer 3**
   - Layer files: 1.png through 4.png
   - Display File: `Summer3.png` (35.8 KB)

4. **Summer 4**
   - Layer files: 1.png through 3.png
   - Display File: `Summer4.png` (41.4 KB)

5. **Summer 5**
   - Layer files: 1.png through 4.png
   - Display File: `Summer5.png` (43.0 KB)

6. **Summer 6**
   - Layer files: 1.png through 5.png
   - Display File: `Summer6.png` (56.9 KB)

7. **Summer 7**
   - Layer files: 1.png through 4.png
   - Display File: `Summer7.png` (32.4 KB)

8. **Summer 8**
   - Layer files: 1.png through 4.png
   - Display File: `Summer8.png` (38.0 KB)