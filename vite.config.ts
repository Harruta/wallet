import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
      include: ['buffer', 'crypto'],
      // Whether to polyfill `global` as well
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
})
