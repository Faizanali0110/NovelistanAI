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
    
    // Create assets directory
    await fs.mkdir(resolve(__dirname, 'dist', 'assets'), { recursive: true });
    
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
        min-height: 100vh;
        background-color: #f5f5f5;
        color: #333;
        text-align: center;
      }
      .container {
        max-width: 800px;
        padding: 40px;
        margin: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
      h1 {
        margin-bottom: 20px;
        font-size: 2.5rem;
        color: #0070f3;
      }
      h2 {
        margin-top: 40px;
        margin-bottom: 15px;
        font-size: 1.8rem;
      }
      p {
        margin-bottom: 20px;
        font-size: 1.2rem;
        line-height: 1.6;
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
        margin: 10px;
      }
      .btn:hover {
        background-color: #0051a8;
      }
      .instructions {
        text-align: left;
        background-color: #f8f9fa;
        padding: 20px;
        border-radius: 5px;
        margin: 30px 0;
      }
      .instructions ol {
        margin-left: 20px;
      }
      .instructions li {
        margin-bottom: 10px;
      }
      .footer {
        margin-top: 40px;
        font-size: 0.9rem;
        color: #666;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Welcome to NovelistanAI</h1>
      <p>Your AI-powered writing assistant</p>
      
      <h2>Deployment Status</h2>
      <p>The previous deployment has been removed. A new deployment is needed to access the application.</p>
      
      <div class="instructions">
        <h2>How to Deploy:</h2>
        <ol>
          <li>Go to <a href="https://vercel.com/new" target="_blank">Vercel</a> and log in to your account</li>
          <li>Import your GitHub repository (Faizanali0110/NovelistanAI)</li>
          <li>Set the root directory to <code>novelistan</code></li>
          <li>Deploy your application</li>
        </ol>
      </div>
      
      <p>Once deployed, you can access all the features of NovelistanAI:</p>
      <ul>
        <li>AI-assisted writing</li>
        <li>Book organization</li>
        <li>Cloud storage with Azure</li>
      </ul>
      
      <div class="footer">
        <p>For assistance, contact the development team or try running the application locally.</p>
      </div>
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
