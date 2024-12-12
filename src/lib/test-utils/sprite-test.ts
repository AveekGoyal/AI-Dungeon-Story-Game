import { CharacterClass, AnimationType } from '../constants';

export async function testSpriteLoading(characterClass: CharacterClass, animationType: AnimationType): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    const characterType = characterClass.includes('mage') ? 'mages' :
                         characterClass.includes('warrior') ? 'warriors' :
                         'adventurers';
    
    const spritePath = `/sprites/${characterType}/${characterClass}/${animationType}.png`;
    
    img.onload = () => {
      console.log(`✅ Successfully loaded sprite: ${spritePath}`);
      resolve(true);
    };
    
    img.onerror = () => {
      console.error(`❌ Failed to load sprite: ${spritePath}`);
      resolve(false);
    };
    
    img.src = spritePath;
  });
}

export async function testAllSprites(characterClass: CharacterClass): Promise<{
  success: boolean;
  results: { [key in AnimationType]?: boolean };
}> {
  const animations: AnimationType[] = [
    'Idle',
    'Walk',
    'Run',
    'Attack_1',
    'Attack_2',
    'Attack_3',
    'Fireball',
    'Flame_jet',
    'Shot_1',
    'Shot_2',
    'Arrow',
    'Hurt',
    'Dead',
    'Jump'
  ];

  const results: { [key in AnimationType]?: boolean } = {};
  let allSuccess = true;

  console.log(`\nTesting sprites for character: ${characterClass}`);
  console.log('----------------------------------------');

  for (const animation of animations) {
    const success = await testSpriteLoading(characterClass, animation);
    results[animation] = success;
    if (!success) allSuccess = false;
  }

  console.log('----------------------------------------');
  console.log(`Overall status: ${allSuccess ? '✅ All sprites loaded' : '❌ Some sprites failed'}\n`);

  return {
    success: allSuccess,
    results
  };
}
