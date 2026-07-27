import { imageManifest as discoveredImages } from 'virtual:image-manifest';
import type { GalleryImage, MemoryImage, ImageAsset, ImageId } from '../types';

const teaserCaptions = [
  'A whisper of what is to come...',
  'Every great story begins with a moment.',
  'Some surprises are worth waiting for.',
  'The best is yet to arrive...',
  'One more reason to smile...',
  'Something beautiful is unfolding...',
  'The moment before the magic...',
  'A hint of the joy ahead...',
  'Keep watching — the surprise is near...',
  'Every glimpse carries a promise...',
];

const memoryCaptions = [
  'A beautiful beginning.',
  "A smile I'll never forget.",
  'Every moment mattered.',
  'Little memories, endless happiness.',
  'You made life brighter.',
  'The laughter still echoes.',
  'So many unforgettable moments.',
  'Closer than yesterday.',
  'Almost there...',
  'The best surprise is waiting.',
];

function pickCaption(list: string[], index: number, total: number): string {
  if (total <= list.length) return list[index];
  if (total === 0) return '';
  return list[index % list.length];
}

export function getTeaserImages(): GalleryImage[] {
  return discoveredImages.teaser.map((entry, i) => ({
    id: `teaser-${i + 1}`,
    src: entry.src,
    alt: `Teaser ${i + 1}`,
    caption: pickCaption(teaserCaptions, i, discoveredImages.teaser.length),
  }));
}

export function getMemoryImages(): MemoryImage[] {
  return discoveredImages.memory.map((entry, i) => ({
    id: `memory-${i + 1}`,
    src: entry.src,
    alt: `Memory ${i + 1}`,
    caption: pickCaption(memoryCaptions, i, discoveredImages.memory.length),
  }));
}

export const imageManifest: Record<ImageId, ImageAsset> = {
  ...Object.fromEntries(
    getTeaserImages().map((img) => [img.id, { id: img.id, src: img.src, alt: img.alt }]),
  ),
  ...Object.fromEntries(
    getMemoryImages().map((img) => [img.id, { id: img.id, src: img.src, alt: img.alt }]),
  ),
};
