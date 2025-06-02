// This script handles the Vercel build process
console.log('Starting Vercel build process...');

// Set environment variables to avoid native module issues
process.env.SKIP_OPTIONAL_PACKAGES = 'true';
process.env.ESBUILD_BINARY_PATH = 'node_modules/esbuild/bin/esbuild';
process.env.CI = 'false'; // Prevent treating warnings as errors

// Configure API URL for production if not already set
if (!process.env.VITE_API_URL) {
  process.env.VITE_API_URL = 'https://novelistanai-backend-deployment-gkhae2hca5acf4b5.canadacentral-01.azurewebsites.net';
  console.log(`Set VITE_API_URL to: ${process.env.VITE_API_URL}`);
}

// Run the standard build process
const { execSync } = require('child_process');

try {
  console.log('Building application with environment:', {
    NODE_ENV: process.env.NODE_ENV || 'not set',
    VITE_API_URL: process.env.VITE_API_URL || 'not set'
  });
  
  // Run the build with proper environment variables
  execSync('npm run build', { 
    stdio: 'inherit',
    env: {
      ...process.env,
      CI: 'false'
    }
  });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

console.log('Vercel build process complete.')
