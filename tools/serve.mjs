// Tiny static file server for previewing the site:  node tools/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(fileURLToPath(import.meta.url), '..', '..');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p === '/') p = '/index.html';
  const file = normalize(join(root, p));
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  try { const b = await readFile(file); res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' }).end(b); }
  catch { res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found'); }
}).listen(Number(process.env.PORT) || Number(process.argv[2]) || 4400, () => console.log('http://localhost:' + (process.env.PORT || process.argv[2] || 4400)));
