from PIL import Image
import os

def create_sprite_sheet(frames, output_path, frame_width=32, frame_height=32):
    # Create a new image with the correct dimensions
    sheet_width = frame_width * len(frames)
    sheet_height = frame_height
    sprite_sheet = Image.new('RGBA', (sheet_width, sheet_height), (0, 0, 0, 0))
    
    # Paste each frame into the sprite sheet
    for i, frame in enumerate(frames):
        sprite_sheet.paste(frame, (i * frame_width, 0))
    
    # Save the sprite sheet
    sprite_sheet.save(output_path, 'PNG')

def create_wizard_sprites():
    # Base sprite (you'll need to replace this with your actual sprite)
    base_sprite = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    
    # Create different animation frames
    idle_frames = []
    for i in range(4):  # 4 frames for idle
        frame = base_sprite.copy()
        # Add idle animation details here
        idle_frames.append(frame)
    
    walk_frames = []
    for i in range(8):  # 8 frames for walk
        frame = base_sprite.copy()
        # Add walk animation details here
        walk_frames.append(frame)
    
    attack_frames = []
    for i in range(6):  # 6 frames for attack
        frame = base_sprite.copy()
        # Add attack animation details here
        attack_frames.append(frame)
    
    cast_frames = []
    for i in range(7):  # 7 frames for cast
        frame = base_sprite.copy()
        # Add cast animation details here
        cast_frames.append(frame)
    
    hurt_frames = []
    for i in range(3):  # 3 frames for hurt
        frame = base_sprite.copy()
        # Add hurt animation details here
        hurt_frames.append(frame)
    
    # Create output directory if it doesn't exist
    output_dir = 'public/sprites/wizard'
    os.makedirs(output_dir, exist_ok=True)
    
    # Generate sprite sheets
    create_sprite_sheet(idle_frames, os.path.join(output_dir, 'sprite-sheet.png'))
    create_sprite_sheet(walk_frames, os.path.join(output_dir, 'walk.png'))
    create_sprite_sheet(attack_frames, os.path.join(output_dir, 'attack.png'))
    create_sprite_sheet(cast_frames, os.path.join(output_dir, 'cast.png'))
    create_sprite_sheet(hurt_frames, os.path.join(output_dir, 'hurt.png'))

if __name__ == '__main__':
    create_wizard_sprites()
