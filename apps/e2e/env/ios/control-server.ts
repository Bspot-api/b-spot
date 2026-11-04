/**
 * The Maestro flows' hands outside the app. Maestro scripts can only make
 * HTTP calls, so this server, run inside the `pnpm e2e:mobile` process,
 * exposes the suite's existing TypeScript helpers. Neither the app nor the
 * API knows it.
 */
import http from 'node:http';
import { CONTROL_PORT } from '../e2e-env';
import {
  countSessionsOf,
  expireSessionsOf,
  findSuggestionsByNotes,
  resetMutableState,
  revokeAdminRole,
} from '../../support/db';
import { fetchLatestMagicLink } from '../../support/maildev';
import { STORED_FOOD_SCAN, seedScanHistory } from './stored-history';

type Route = (url: URL) => Promise<unknown>;

/** The running control server; `stop` closes it. */
export interface ControlServer {
  stop: () => Promise<void>;
}

function readEmail(url: URL): string {
  const email = url.searchParams.get('email');
  if (!email) throw new Error('missing ?email=');
  return email;
}

function buildRoutes(udid: string): Record<string, Route> {
  /** Mail older than the last reset belongs to an earlier flow (its token is gone). */
  let lastResetAt = new Date();
  return {
    /** Back to the seeded database, like the web suite's per-test reset. */
    'POST /reset': async () => {
      lastResetAt = new Date();
      await resetMutableState();
    },
    /** The newest magic link MailDev received for `?email=` since the last reset. */
    'GET /magic-link': async (url) => ({
      link: await fetchLatestMagicLink({ email: readEmail(url), since: lastResetAt }),
    }),
    /** Moves the sessions of `?email=` into the past. */
    'POST /sessions/expire': async (url) => ({ count: await expireSessionsOf(readEmail(url)) }),
    /** How many sessions `?email=` still has. */
    'GET /sessions': async (url) => ({ count: await countSessionsOf(readEmail(url)) }),
    /** Demotes `?email=`, who stays logged in as a regular user. */
    'POST /admins/revoke': (url) => revokeAdminRole(readEmail(url)),
    /** Stored history holding the known food product (the app must be stopped). */
    'POST /history/seed': () => seedScanHistory(udid, [STORED_FOOD_SCAN]),
    /** The stored brand suggestions whose notes equal `?notes=`. */
    'GET /suggestions': (url) => findSuggestionsByNotes(url.searchParams.get('notes') ?? ''),
  };
}

async function handleControlRequest(
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
  const server = http.createServer((req, res) => void handleControlRequest(routes, req, res));
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(CONTROL_PORT, '127.0.0.1', () => {
      console.log(`[control] listening on http://127.0.0.1:${CONTROL_PORT}`);
      resolve({ stop: () => new Promise((done) => server.close(() => done())) });
    });
  });
}
