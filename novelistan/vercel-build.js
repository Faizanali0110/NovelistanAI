// vercel-build.js
// This script handles the Vercel build process with proper environment setup

// Set environment variable to skip native Rollup modules
process.env.ROLLUP_SKIP_NODEJS_NATIVE = '1';

// Use CommonJS require instead of ES modules import
const { execSync } = require('child_process');

try {
  // Make sure the environment variable is set before any Rollup code runs
  console.log('Setting ROLLUP_SKIP_NODEJS_NATIVE=1');
  
  // Create a .npmrc file to avoid optional dependencies issues
  execSync('echo "optional=false" > .npmrc', { stdio: 'inherit' });
  
  console.log('Starting Vite build with Rollup native modules disabled...');
  
  // Run the build command with environment variables explicitly set
  execSync('npx vite build', { 
    stdio: 'inherit',
    env: { 
      ...process.env,
      ROLLUP_SKIP_NODEJS_NATIVE: '1',
      // Additional flag to help with Rollup issues
      VITE_SKIP_NATIVE_MODULES: 'true'
    }
  });
  
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
