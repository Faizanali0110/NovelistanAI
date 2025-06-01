// build.mjs - Extremely simple static site generator
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function build() {
  console.log('Starting static site generation...');
  
  try {
    // Clean dist directory
    await fs.rm(resolve(__dirname, 'dist'), { recursive: true, force: true })
      .catch(() => console.log('No dist directory to clean'));
    
    // Create dist directory
    await fs.mkdir(resolve(__dirname, 'dist'), { recursive: true });
    console.log('Created dist directory');
    
    // Create a simple index.html
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NovelistanAI</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background-color: #f5f5f5;
        color: #333;
        text-align: center;
      }
      .container {
        max-width: 800px;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
      h1 {
        margin-bottom: 20px;
        font-size: 2.5rem;
      }
      p {
        margin-bottom: 30px;
        font-size: 1.2rem;
      }
      .btn {
        display: inline-block;
        background-color: #0070f3;
        color: white;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 5px;
        font-weight: 500;
        transition: background-color 0.3s;
      }
      .btn:hover {
        background-color: #0051a8;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Welcome to NovelistanAI</h1>
      <p>Your AI-powered writing assistant</p>
      <a href="https://novelistan-ai-ewj8.vercel.app" class="btn">Go to Application</a>
    </div>
  </body>
</html>`;
    
    await fs.writeFile(resolve(__dirname, 'dist', 'index.html'), indexHtml);
    console.log('Created static index.html');
    
    console.log('Static site generation completed successfully');
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
}

build();
