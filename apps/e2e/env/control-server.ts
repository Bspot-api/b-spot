/**
 * The Maestro flows' hands outside the app. Maestro scripts can only make
 * HTTP calls, so this server, run inside the `pnpm e2e:mobile` process,
 * exposes the suite's existing TypeScript helpers. Neither the app nor the
 * API knows it.
 */
import http from 'node:http';
import { CONTROL_PORT } from './e2e-env';
import { seedScanHistory } from './simulator';
import { findSuggestionsByNotes, resetMutableState } from '../support/db';
import { STORED_FOOD_SCAN } from '../support/stored-history';

type Route = (url: URL) => Promise<unknown>;

export interface ControlServer {
  stop: () => Promise<void>;
}

function buildRoutes(udid: string): Record<string, Route> {
  return {
    /** Back to the seeded database, like the web suite's per-test reset. */
    'POST /reset': () => resetMutableState(),
    /** Stored history holding the known food product (the app must be stopped). */
    'POST /history/seed': () => seedScanHistory(udid, [STORED_FOOD_SCAN]),
    /** The stored brand suggestions whose notes equal `?notes=`. */
    'GET /suggestions': (url) => findSuggestionsByNotes(url.searchParams.get('notes') ?? ''),
  };
}

async function answer(
  routes: Record<string, Route>,
  req: http.IncomingMessage,
  res: http.ServerResponse,
): Promise<void> {
  const url = new URL(req.url ?? '/', `http://localhost:${CONTROL_PORT}`);
  const route = routes[`${req.method} ${url.pathname}`];
  if (!route) {
    res.writeHead(404).end();
    return;
  }
  try {
    const body = JSON.stringify((await route(url)) ?? { ok: true });
    res.writeHead(200, { 'Content-Type': 'application/json' }).end(body);
  } catch (error) {
    console.error(`[control] ${req.method} ${url.pathname} failed:`, error);
    res.writeHead(500).end(String(error));
  }
}

/** Starts the control server on 127.0.0.1 for the device `udid`. */
export function startControlServer(udid: string): Promise<ControlServer> {
  const routes = buildRoutes(udid);
  const server = http.createServer((req, res) => void answer(routes, req, res));
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(CONTROL_PORT, '127.0.0.1', () => {
      console.log(`[control] listening on http://127.0.0.1:${CONTROL_PORT}`);
      resolve({ stop: () => new Promise((done) => server.close(() => done())) });
    });
  });
}
