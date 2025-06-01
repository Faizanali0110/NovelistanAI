import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    // Ensure consistent behavior between dev and prod
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      // Explicitly disable Rollup native extensions
      context: 'globalThis',
      external: [],
    },
    // Minify options
    minify: 'terser',
    target: 'es2018',
    // Reduce chunk size
    chunkSizeWarningLimit: 1000,
  },
  // Use relative paths for production builds
  base: './',
  // Override Rollup options to avoid native extensions
  optimizeDeps: {
    // Exclude problematic dependencies if needed
    exclude: [],
  },
  // Force Vite to use the Node.js crypto module instead of the browser one
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
    },
  },
})
