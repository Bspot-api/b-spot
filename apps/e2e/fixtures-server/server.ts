import http from 'node:http';
import { FIXTURES_PORT } from '../env/e2e-env';
import {
  FixtureAnswer,
  openBeautyFactsAnswer,
  openFoodFactsAnswer,
  pappersAnswer,
  rechercheEntreprisesAnswer,
} from './responses';

const FACTS_PATH = /^\/(off|obf)\/api\/v2\/product\/([^/]+)$/;
const NOT_FOUND: FixtureAnswer = { status: 404, body: { error: 'no fixture route' } };

/** Routes one request of the four external APIs to its fixture answer. */
export function routeFixture(url: URL): FixtureAnswer {
  if (url.pathname === '/health') return { status: 200, body: { status: 'ok' } };

  const facts = FACTS_PATH.exec(url.pathname);
  if (facts) {
    const barcode = decodeURIComponent(facts[2]);
    return facts[1] === 'off' ? openFoodFactsAnswer(barcode) : openBeautyFactsAnswer(barcode);
  }
  if (url.pathname === '/recherche-entreprises/search') {
    return rechercheEntreprisesAnswer(url.searchParams.get('q') ?? '');
  }
  if (url.pathname === '/pappers/v2/entreprise') {
    return pappersAnswer(url.searchParams.get('siren') ?? '', url.searchParams.get('api_token'));
  }
  return NOT_FOUND;
}

function handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
  const url = new URL(req.url ?? '/', `http://localhost:${FIXTURES_PORT}`);
  const answer = routeFixture(url);
  if (url.pathname !== '/health') {
    console.log(`[fixtures] ${req.method} ${url.pathname}${url.search} -> ${answer.status}`);
  }
  res.writeHead(answer.status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(answer.body));
}

http.createServer(handleRequest).listen(FIXTURES_PORT, () => {
  console.log(`[fixtures] listening on http://localhost:${FIXTURES_PORT}`);
});
