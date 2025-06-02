// This script handles the Vercel build process
console.log('Starting Vercel build process...');

// Set environment variables to avoid native module issues
process.env.SKIP_OPTIONAL_PACKAGES = 'true';
process.env.ESBUILD_BINARY_PATH = 'node_modules/esbuild/bin/esbuild';

// Run the standard build process
const { execSync } = require('child_process');

try {
  console.log('Building application...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
