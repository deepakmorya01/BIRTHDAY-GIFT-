import type { ComponentType } from 'react';

export interface DomeGalleryImage {
  src: string;
  alt?: string;
}

export interface DomeGalleryProps {
  images?: DomeGalleryImage[];
  fit?: number;
  fitBasis?: 'auto' | 'min' | 'max' | 'width' | 'height';
  minRadius?: number;
  maxRadius?: number;
  padFactor?: number;
  overlayBlurColor?: string;
  maxVerticalRotationDeg?: number;
  dragSensitivity?: number;
  enlargeTransitionMs?: number;
  segments?: number;
  dragDampening?: number;
  openedImageWidth?: string;
  openedImageHeight?: string;
  imageBorderRadius?: string;
  openedImageBorderRadius?: string;
  grayscale?: boolean;
}

declare const DomeGallery: ComponentType<DomeGalleryProps>;
export default DomeGallery;
