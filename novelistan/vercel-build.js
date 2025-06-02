// vercel-build.js
// This script handles the Vercel build process with proper environment setup

// Set environment variable to skip native Rollup modules
process.env.ROLLUP_SKIP_NODEJS_NATIVE = '1';

// Use CommonJS require instead of ES modules import
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Make sure the environment variable is set before any Rollup code runs
  console.log('Setting ROLLUP_SKIP_NODEJS_NATIVE=1');
  
  // Create a .npmrc file to avoid optional dependencies issues
  execSync('echo "optional=false" > .npmrc', { stdio: 'inherit' });
  
  // Run our Rollup patch script to modify the native.js file
  console.log('Applying Rollup patch to avoid native module loading...');
  require('./rollup-patch.js');
  
  // Create a direct fix for the native.js file if the patch didn't work
  const nativeJsPath = path.resolve('./node_modules/rollup/dist/native.js');
  if (fs.existsSync(nativeJsPath)) {
    console.log('Directly modifying Rollup native.js...');
    // Create a simple version that always uses the JS implementation
    const fixedContent = `
// Modified by vercel-build.js to avoid native module issues
const loadNative = () => null;
exports.needsRebuilding = () => false;
exports.loadNative = loadNative;
exports.getDefaultInstance = () => null;
`;
    fs.writeFileSync(nativeJsPath, fixedContent);
    console.log('Successfully modified Rollup native.js');
  }
  
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
