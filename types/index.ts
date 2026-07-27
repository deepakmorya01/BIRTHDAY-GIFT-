export type SceneId =
  | 'loading'
  | 'welcome'
  | 'gift'
  | 'teaser-gallery'
  | 'countdown'
  | 'memory-journey'
  | 'letter'
  | 'birthday-wishes'
  | 'celebration'
  | 'memory-album';

export interface SceneComponentProps {
  isActive: boolean;
  onContinue?: () => void;
  sceneId?: string;
}

export interface SceneDefinition {
  id: SceneId;
  component: React.ComponentType<SceneComponentProps>;
  ambient?: boolean;
  label?: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
}

export interface MemoryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
}

export type ImageId = string;

export interface ImageAsset {
  id: ImageId;
  src: string;
  alt?: string;
}

