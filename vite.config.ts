import { defineConfig, type Plugin } from 'vite';
import { readdirSync, statSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';

const VIRTUAL_ID = 'virtual:image-manifest';
const RESOLVED_ID = '\0' + VIRTUAL_ID;

const IMAGE_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg',
]);

interface FolderConfig {
  dir: string;
  publicPrefix: string;
}

const FOLDERS: FolderConfig[] = [
  { dir: 'public/images/teaser', publicPrefix: '/images/teaser/' },
  { dir: 'public/images/memory', publicPrefix: '/images/memory/' },
];

function listImages(dir: string, publicPrefix: string) {
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
      const dot = lower.lastIndexOf('.');
      if (dot < 0) return false;
      const ext = lower.slice(dot);
      return IMAGE_EXTENSIONS.has(ext) && statSync(resolve(dir, f)).isFile();
    })
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .map((f) => ({ name: f, src: `${publicPrefix}${f}` }));
}

function buildManifest() {
  return {
    teaser: listImages(resolve(process.cwd(), FOLDERS[0].dir), FOLDERS[0].publicPrefix),
    memory: listImages(resolve(process.cwd(), FOLDERS[1].dir), FOLDERS[1].publicPrefix),
  };
}

function imageManifestPlugin(): Plugin {
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
      const dirs = FOLDERS.map((f) => resolve(process.cwd(), f.dir));
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

export default defineConfig({
  plugins: [react(), imageManifestPlugin()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
});
