// vercel-build.js
// This script handles the Vercel build process with proper environment setup

// Set environment variable to skip native Rollup modules
process.env.ROLLUP_SKIP_NODEJS_NATIVE = '1';

// Execute the build command
import { execSync } from 'child_process';

try {
  console.log('Setting ROLLUP_SKIP_NODEJS_NATIVE=1');
  console.log('Starting Vite build...');
  
  // Run the build command
  execSync('npx vite build', { 
    stdio: 'inherit',
    env: { 
      ...process.env,
      ROLLUP_SKIP_NODEJS_NATIVE: '1'
    }
  });
  
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
