import type { SceneDefinition } from '../types';
import { LoadingScene } from './loading/LoadingScene';
import { WelcomeScene } from './welcome/WelcomeScene';
import { GiftScene } from './gift/GiftScene';
import { TeaserGalleryScene } from './teaser/TeaserGalleryScene';
import { CountdownScene } from './countdown/CountdownScene';
import { MemoryJourneyScene } from './memory/MemoryJourneyScene';
import { LetterScene } from './letter/LetterScene';
import { BirthdayWishesScene } from './birthday-wishes/BirthdayWishesScene';
import { CelebrationScene } from './celebration/CelebrationScene';
import { MemoryAlbumScene } from './memory/MemoryAlbumScene';

export const sceneRegistry: Record<string, SceneDefinition> = {
  loading: { id: 'loading', component: LoadingScene },
  welcome: { id: 'welcome', component: WelcomeScene, ambient: true },
  gift: { id: 'gift', component: GiftScene, ambient: true },
  'teaser-gallery': { id: 'teaser-gallery', component: TeaserGalleryScene, ambient: true },
  countdown: { id: 'countdown', component: CountdownScene, ambient: true },
  'memory-journey': { id: 'memory-journey', component: MemoryJourneyScene, ambient: true },
  letter: { id: 'letter', component: LetterScene, ambient: true },
  'birthday-wishes': { id: 'birthday-wishes', component: BirthdayWishesScene, ambient: true },
  celebration: { id: 'celebration', component: CelebrationScene, ambient: true },
  'memory-album': { id: 'memory-album', component: MemoryAlbumScene, ambient: true },
};
