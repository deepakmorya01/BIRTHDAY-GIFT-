import { readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import type { Plugin } from 'vite';

const VIRTUAL_ID = 'virtual:image-manifest';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

interface FolderConfig {
  /** Absolute or project-relative path inside public/ */
  dir: string;
  /** Public URL prefix, e.g. /images/teaser/ */
  publicPrefix: string;
}

export interface ImageManifestEntry {
  src: string;
  name: string;
}

export interface ImageManifest {
  teaser: ImageManifestEntry[];
  memory: ImageManifestEntry[];
}

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg']);

function listImages(dir: string, publicPrefix: string): ImageManifestEntry[] {
  if (!existsSync(dir)) return [];
  let files: string[];
  try {
    files = readdirSync(dir);
  } catch {
    return [];
  }
  return files
    .filter((f) => {
      const lower = f.toLowerCase();
      const ext = lower.slice(lower.lastIndexOf('.'));
      return IMAGE_EXTENSIONS.has(ext) && statSync(resolve(dir, f)).isFile();
    })
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .map((f) => ({
      name: f,
      src: `${publicPrefix}${f}`,
    }));
}

export function imageManifestPlugin(): Plugin {
  const folders: FolderConfig[] = [
    { dir: 'public/images/teaser', publicPrefix: '/images/teaser/' },
    { dir: 'public/images/memory', publicPrefix: '/images/memory/' },
  ];

  function buildManifest(): ImageManifest {
    return {
      teaser: listImages(resolve(process.cwd(), folders[0].dir), folders[0].publicPrefix),
      memory: listImages(resolve(process.cwd(), folders[1].dir), folders[1].publicPrefix),
    };
  }

  return {
    name: 'image-manifest',
    enforce: 'pre',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
      return null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;
      const manifest = buildManifest();
      return `export const imageManifest = ${JSON.stringify(manifest)};`;
    },
    configureServer(server) {
      const dirs = folders.map((f) => resolve(process.cwd(), f.dir));
      server.watcher.add(dirs);
      const onEvent = () => {
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) {
          server.moduleGraph.invalidateModule(mod);
          server.ws.send({ type: 'full-reload' });
        }
      };
      server.watcher.on('add', onEvent);
      server.watcher.on('unlink', onEvent);
    },
  };
}

export default imageManifestPlugin;
