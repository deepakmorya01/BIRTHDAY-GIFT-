export type ImageId =
  | 'hero-welcome'
  | 'gift-box'
  | 'gallery-1' | 'gallery-2' | 'gallery-3'
  | 'gallery-4' | 'gallery-5' | 'gallery-6'
  | 'memory-tree-bg'
  | 'memory-1' | 'memory-2' | 'memory-3'
  | 'memory-4' | 'memory-5' | 'memory-6'
  | 'album-cover'
  | 'album-1' | 'album-2' | 'album-3' | 'album-4'
  | 'countdown-bg'
  | 'letter-bg'
  | 'celebration-bg'
  | 'wishes-bg';

export interface ImageAsset {
  id: ImageId;
  src: string;
  alt: string;
  position?: string;
}

export type ImageRegistry = Record<ImageId, ImageAsset>;

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
}

export interface ImageCollection {
  teaser: GalleryImage[];
  gallery: GalleryImage[];
  memoryTree: GalleryImage[];
  album: GalleryImage[];
}
