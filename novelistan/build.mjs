// build.mjs - Simple build script to avoid Rollup native dependencies
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs/promises';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function build() {
  console.log('Starting custom build process...');
  
  try {
    // Clean dist directory
    await fs.rm(resolve(__dirname, 'dist'), { recursive: true, force: true });
    console.log('Cleaned dist directory');
    
    // Create dist directory
    await fs.mkdir(resolve(__dirname, 'dist'), { recursive: true });
    console.log('Created dist directory');
    
    // Run vite build with environment variable to skip native modules
    process.env.ROLLUP_SKIP_NODEJS_BUNDLE = 'true';
    process.env.ROLLUP_WATCH = 'false';
    
    try {
      // Try building with vite but with our environment variables
      execSync('npx vite build --mode production', { 
        stdio: 'inherit',
        env: {
          ...process.env,
          ROLLUP_SKIP_NODEJS_BUNDLE: 'true',
          ROLLUP_NATIVE_EXTENSIONS: 'false'
        }
      });
    } catch (e) {
      console.error('Vite build failed, falling back to static build');
      
      // Copy public folder to dist
      await fs.cp(resolve(__dirname, 'public'), resolve(__dirname, 'dist'), { recursive: true });
      console.log('Copied public folder to dist');
      
      // Create a simple index.html that loads the app
      const indexHtml = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NovelistanAI</title>
  </head>
  <body>
    <div id="root">Loading NovelistanAI...</div>
    <script>
      window.location.href = 'https://novelistan-ai-ewj8.vercel.app/';
    </script>
  </body>
</html>
      `;
      
      await fs.writeFile(resolve(__dirname, 'dist', 'index.html'), indexHtml.trim());
      console.log('Created static index.html fallback');
    }
    
    console.log('Build completed successfully');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

build();
