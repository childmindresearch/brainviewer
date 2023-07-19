// rollup.config.js

import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: './src/app.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'es'
  },
  plugins: [typescript(), terser(), nodeResolve()]
}
