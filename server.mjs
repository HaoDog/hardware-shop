import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'public');
const port = Number(process.env.PORT || 4101);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const safe = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  let file = path.join(root, safe === '/' ? 'index.html' : safe);
  if (!file.startsWith(root)) {
    res.writeHead(403).end('forbidden');
    return;
  }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) {
    res.writeHead(404).end('not found');
    return;
  }
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, {
    'Content-Type': types[ext] || 'application/octet-stream',
    'Cache-Control': ['.html', '.css', '.js'].includes(ext) ? 'no-store' : 'public, max-age=86400',
  });
  fs.createReadStream(file).pipe(res);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`[hardware-shop] http://0.0.0.0:${port}`);
});
