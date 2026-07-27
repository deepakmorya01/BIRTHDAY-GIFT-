import type { SceneId } from '../types';

export const sceneFlow: SceneId[] = [
  'loading',
  'welcome',
  'gift',
  'teaser-gallery',
  'countdown',
  'memory-journey',
  'letter',
  'birthday-wishes',
  'celebration',
  'memory-album',
];

export const sceneLabels: Record<SceneId, string> = {
  loading: 'Loading',
  welcome: 'Welcome',
  gift: 'A Gift',
  'teaser-gallery': 'Teaser Gallery',
  countdown: 'Countdown',
  'memory-journey': 'Memory Journey',
  letter: 'A Letter',
  'birthday-wishes': 'Birthday Wishes',
  celebration: 'Celebration',
  'memory-album': 'Memory Album',
};
