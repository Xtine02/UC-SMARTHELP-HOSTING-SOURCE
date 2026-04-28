import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = process.env.PORT || 10000;
const distPath = join(__dirname, 'dist');

const server = createServer(async (req, res) => {
  try {
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
        'ico': 'image/x-icon'
      };
      
      res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
      res.end(data);
    } catch (fileError) {
      // Fallback to index.html for SPA routing
      const indexData = await readFile(join(distPath, 'index.html'));
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(indexData);
    }
  } catch (error) {
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
