// build.mjs - Build script for Vercel deployment
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs/promises';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function copyFile(src, dest) {
  try {
    await fs.copyFile(src, dest);
    console.log(`Copied ${src} to ${dest}`);
  } catch (err) {
    console.error(`Error copying ${src}: ${err.message}`);
  }
}

async function build() {
  console.log('Starting Vite build for Vercel deployment...');
  
  try {
    // Run Vite build
    console.log('Running Vite build');
    execSync('npx vite build', { stdio: 'inherit' });
    
    // Copy to the dist folder
    const vercelJsonPath = resolve(__dirname, 'vercel.json');
    const distVercelJsonPath = resolve(__dirname, 'dist', 'vercel.json');
    
    try {
      await fs.access(vercelJsonPath);
      await copyFile(vercelJsonPath, distVercelJsonPath);
      console.log('Copied vercel.json to dist folder');
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('No vercel.json found to copy');
      } else {
        console.error(`Error copying vercel.json: ${err.message}`);
      }
    }
    
    console.log('Vite build for Vercel deployment completed successfully');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

build();
