from PIL import Image
import os
from pathlib import Path

def create_sprite_sheet(input_dir, animation_name, num_frames, output_dir):
    """
    Creates a sprite sheet from individual frame images.
    Assumes frames are named as f"{animation_name}_{frame_number}.png"
    """
    frames = []
    frame_width = 0
    frame_height = 0
    
    # Load all frames
    for i in range(1, num_frames + 1):
        # Try different possible frame naming patterns
        possible_names = [
            f"{animation_name}_{i}.png",
            f"{animation_name.lower()}_{i}.png",
            f"{animation_name.upper()}_{i}.png",
            f"{i}.png"
        ]
        
        frame_path = None
        for name in possible_names:
            path = os.path.join(input_dir, name)
            if os.path.exists(path):
                frame_path = path
                break
        
        if frame_path is None:
            print(f"Warning: Could not find frame {i} for {animation_name}")
            continue
            
        frame = Image.open(frame_path)
        frames.append(frame)
        
        # Update frame dimensions
        frame_width = max(frame_width, frame.width)
        frame_height = max(frame_height, frame.height)
    
    if not frames:
        print(f"No frames found for {animation_name}")
        return
    
    # Create the sprite sheet
    sprite_sheet = Image.new('RGBA', (frame_width * len(frames), frame_height), (0, 0, 0, 0))
    
    # Paste all frames
    for i, frame in enumerate(frames):
        sprite_sheet.paste(frame, (i * frame_width, 0))
    
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)
    
    # Save the sprite sheet
    output_path = os.path.join(output_dir, f"{animation_name.lower()}.png")
    sprite_sheet.save(output_path, 'PNG')
    print(f"Created sprite sheet: {output_path}")

def process_animations(input_dir, output_dir):
    """
    Process all animation sequences in the input directory
    """
    animations = {
        'Attack_1': 6,
        'Attack_2': 6,
        'Charge': 4,
        'Dead': 4,
        'Fireball': 6,
        'Flame_jet': 6,
        'Hurt': 3,
        'Idle': 6,
        'Jump': 4,
        'Run': 8  # Using Run for walk animation
    }
    
    for animation_name, num_frames in animations.items():
        create_sprite_sheet(input_dir, animation_name, num_frames, output_dir)

def main():
    # Get the absolute path to the script's directory
    script_dir = Path(__file__).parent.absolute()
    
    # Set up input and output directories
    input_dir = script_dir.parent / 'src/components/sprites'
    output_dir = script_dir.parent / 'public/sprites/wizard'
    
    # Process all animations
    process_animations(input_dir, output_dir)

if __name__ == '__main__':
    main()
