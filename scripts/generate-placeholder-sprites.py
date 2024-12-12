from PIL import Image, ImageDraw
import os

def create_wizard_frame(color, size=(32, 32)):
    frame = Image.new('RGBA', size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(frame)
    
    # Draw a simple wizard shape
    # Hat
    draw.polygon([(16, 4), (8, 16), (24, 16)], fill=color)
    # Head
    draw.ellipse((12, 12, 20, 20), fill='#FFE4B5')
    # Body
    draw.rectangle((14, 20, 18, 28), fill=color)
    # Staff
    if color != '#FF6B6B':  # Don't draw staff for hurt animation
        draw.line((8, 12, 24, 28), fill='#8B4513', width=2)
    
    return frame

def create_animation_frames(num_frames, base_color):
    frames = []
    for i in range(num_frames):
        # Slightly modify color for each frame to create a simple animation effect
        r = int(base_color[1:3], 16)
        g = int(base_color[3:5], 16)
        b = int(base_color[5:7], 16)
        
        # Add some variation based on frame number
        r = min(255, r + (i * 10))
        g = min(255, g + (i * 10))
        b = min(255, b + (i * 10))
        
        color = f'#{r:02x}{g:02x}{b:02x}'
        frames.append(create_wizard_frame(color))
    
    return frames

def create_sprite_sheet(frames, output_path):
    # Create a new image with the correct dimensions
    width = 32 * len(frames)
    height = 32
    sprite_sheet = Image.new('RGBA', (width, height), (0, 0, 0, 0))
    
    # Paste each frame into the sprite sheet
    for i, frame in enumerate(frames):
        sprite_sheet.paste(frame, (i * 32, 0))
    
    # Ensure the output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Save the sprite sheet
    sprite_sheet.save(output_path, 'PNG')

def main():
    # Create different animations
    animations = {
        'sprite-sheet': (4, '#4B0082'),  # Idle - Purple
        'walk': (8, '#1E90FF'),          # Walk - Blue
        'attack': (6, '#FF4500'),        # Attack - Orange-Red
        'cast': (7, '#9400D3'),          # Cast - Purple
        'hurt': (3, '#FF6B6B'),          # Hurt - Red
    }
    
    for anim_name, (num_frames, color) in animations.items():
        frames = create_animation_frames(num_frames, color)
        output_path = f'public/sprites/wizard/{anim_name}.png'
        create_sprite_sheet(frames, output_path)
        print(f'Created {anim_name} sprite sheet')

if __name__ == '__main__':
    main()
