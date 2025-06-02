const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const { resolve } = require('path');

// Ensure Rollup doesn't try to use native modules
process.env.ROLLUP_SKIP_NODEJS_NATIVE = '1';

// https://vitejs.dev/config/
module.exports = defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    // Simplify build to avoid native module issues
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      external: [],
      output: {
        manualChunks: undefined
      }
    },
    minify: 'terser',
    target: 'es2018',
    chunkSizeWarningLimit: 1000,
  },
  // Use relative paths for production builds
  base: './',
  // Avoid problematic dependencies
  optimizeDeps: {
    // Disable optional dependencies
    disabled: false,
    esbuildOptions: {
      // Avoid native modules
      platform: 'browser'
    }
  },
  // Force Vite to use the Node.js crypto module instead of the browser one
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
    },
  },
})
