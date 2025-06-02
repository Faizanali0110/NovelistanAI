const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const { resolve } = require('path');

// https://vitejs.dev/config/
module.exports = defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    minify: 'terser',
    target: 'es2018',
    chunkSizeWarningLimit: 1000,
  },
  // Use relative paths for production builds
  base: '/',
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
    },
  },
})
