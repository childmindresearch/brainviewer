import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import pkg from './package.json' assert { type: 'json' }

// Version of the config in which dependencies are not bundled (to use as a npm dependency).

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve('./src/index.ts'),
      name: pkg.displayName,
    },
    rollupOptions: {
      external: [
        ...Object.keys(pkg.dependencies), // don't bundle dependencies
        /^node:.*/, // don't bundle built-in Node.js modules (use protocol imports!)
      ],
    },
    target: 'esnext', // transpile as little as possible
  },
  plugins: [dts()],
});