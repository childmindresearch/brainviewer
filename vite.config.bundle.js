import { resolve } from 'path';
import { defineConfig } from 'vite';
import pkg from './package.json' assert { type: 'json' }

// Version of the config in which dependencies are bundled (to include directly in html).

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve('./src/index.ts'),
      name: pkg.displayName,
      fileName: `${pkg.displayName}-bundled`,
    },
  },
});