/// <reference types="vite/client" />

declare module 'virtual:image-manifest' {
  export interface ImageManifestEntry {
    src: string;
    name: string;
  }
  export interface ImageManifest {
    teaser: ImageManifestEntry[];
    memory: ImageManifestEntry[];
  }
  export const imageManifest: ImageManifest;
}
