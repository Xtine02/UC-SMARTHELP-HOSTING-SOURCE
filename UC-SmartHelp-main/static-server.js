import { createServer } from 'http';
import { readFile, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = process.env.PORT || 10000;
const distPath = join(__dirname, 'dist');
let attemptedAutoBuild = false;

const ensureDistExists = async () => {
  try {
    await access(distPath);
    return true;
  } catch {
    if (!attemptedAutoBuild) {
      attemptedAutoBuild = true;
      console.log('Dist directory missing. Running one-time build...');
      try {
        execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
        await access(distPath);
        console.log('Build completed and dist directory is now available.');
        return true;
      } catch (buildError) {
        console.error('Auto-build failed:', buildError);
      }
    }
    return false;
  }
};

const server = createServer(async (req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  try {
    // Check if dist directory exists (auto-build once if missing)
    const hasDist = await ensureDistExists();
    if (!hasDist) {
      console.error('Dist directory not found');
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end('<h1>Build Error: dist directory not found</h1><p>Build failed. Check deploy logs for npm run build output.</p>');
      return;
    }    
    
    let filePath = join(distPath, req.url === '/' ? 'index.html' : req.url);
    
    try {
      const data = await readFile(filePath);
      const ext = filePath.split('.').pop();
      const contentTypes = {
        'html': 'text/html',
        'js': 'application/javascript',
        'css': 'text/css',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'ico': 'image/x-icon',
        'json': 'application/json'
      };
      
      res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
      res.end(data);
      console.log(`Served: ${filePath}`);
    } catch (fileError) {
      console.log(`File not found: ${filePath}, falling back to index.html`);
      // Fallback to index.html for SPA routing
      try {
        const indexData = await readFile(join(distPath, 'index.html'));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(indexData);
      } catch (indexError) {
        console.error('Index.html not found');
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>Build Error: index.html not found</h1><p>Please run npm run build first</p>');
      }
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end('<h1>Internal Server Error</h1>');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Dist path: ${distPath}`);
  console.log('Enhanced error handling enabled');
});
