import { createReadStream, existsSync, statSync } from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { WEB_BUILD_DIR, WEB_PORT } from './e2e-env';

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

/** Resolves a request path to a file of the export, or to index.html (SPA fallback). */
function resolveFile(urlPath: string): string {
  const relative = decodeURIComponent(urlPath.split('?')[0]);
  const candidate = path.normalize(path.join(WEB_BUILD_DIR, relative));
  const isInside = candidate.startsWith(WEB_BUILD_DIR);
  if (isInside && existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  return path.join(WEB_BUILD_DIR, 'index.html');
}

function handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
  const file = resolveFile(req.url ?? '/');
  const type = CONTENT_TYPES[path.extname(file)] ?? 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': type });
  createReadStream(file).pipe(res);
}

http.createServer(handleRequest).listen(WEB_PORT, () => {
  console.log(`[web] serving ${WEB_BUILD_DIR} on http://localhost:${WEB_PORT}`);
});
