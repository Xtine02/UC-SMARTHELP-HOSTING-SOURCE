import { createServer } from 'http';
import { readFile, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { build } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = process.env.PORT || 10000;
const distPath = join(__dirname, 'dist');

// Auto-build if dist doesn't exist
async function ensureBuild() {
  try {
    await access(distPath);
    console.log('✅ Dist directory found');
  } catch (error) {
    console.log('📦 Building project...');
    try {
      await build({
        configFile: './vite.config.ts',
        mode: 'production'
      });
      console.log('✅ Build complete');
    } catch (buildError) {
      console.error('❌ Build failed:', buildError.message);
      process.exit(1);
    }
  }
}

await ensureBuild();

const server = createServer(async (req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  try {
    // Check if dist directory exists
    try {
      await access(distPath);
    } catch (error) {
      console.error('Dist directory not found');
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end('<h1>Build Error: dist directory not found</h1><p>Please run npm run build first</p>');
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
