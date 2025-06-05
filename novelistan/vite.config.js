const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');
const { resolve } = require('path');

// https://vitejs.dev/config/
module.exports = defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0', // Listen on all network interfaces
      port: 5173, // Use a fixed port
      strictPort: true, // Don't try to find another port if 5173 is in use
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 5173,
      },
      watch: {
        usePolling: true, // Helps with file system watching in some environments
      },
      cors: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8082',
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      assetsDir: 'assets',
      minify: isProduction ? 'terser' : false,
      target: 'es2018',
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['react-quill', 'lucide-react'],
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      sourcemap: !isProduction,
    },
    base: isProduction ? '/' : '/',
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
      },
      include: ['react', 'react-dom', 'react-router-dom'],
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        util: 'util/',
      },
    },
    define: {
      'process.env': {},
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
  };
});
