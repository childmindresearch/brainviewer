import { resolve } from 'path';
import { defineConfig } from 'vite';
import pkg from './package.json' with { type: 'json' }

// Version of the config in which dependencies are bundled (to include directly in html).

export default defineConfig({
  build: {
    lib: {
      entry: resolve('./src/index.ts'),
      name: pkg.displayName,
      fileName: `${pkg.displayName}-bundled`,
    },
    rollupOptions: {
      // Don't externalize anything - bundle it all
      external: [],
      output: {
        // Since we're bundling everything, we don't need globals
        globals: {}
      }
    }
  },
});