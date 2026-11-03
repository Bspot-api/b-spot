import path from 'node:path';

/** Fixed e2e ports, distinct from the dev stack (API 3001, web 8082). */
export const API_PORT = 3101;
export const WEB_PORT = 8182;
export const FIXTURES_PORT = 4010;
/**
 * MailDev ports. When b-spot's MailDev is not already running, the e2e run
 * starts it on its own host ports (another stack may hold 1025/1080); when it
 * is running, the orchestrator exports its real ports through these variables.
 */
export const MAILDEV_WEB_PORT = Number(process.env.E2E_MAILDEV_WEB_PORT ?? 1180);
export const SMTP_PORT = Number(process.env.E2E_SMTP_PORT ?? 1125);

export const API_URL = `http://localhost:${API_PORT}`;
export const WEB_URL = `http://localhost:${WEB_PORT}`;
export const FIXTURES_URL = `http://localhost:${FIXTURES_PORT}`;
export const MAILDEV_URL = `http://localhost:${MAILDEV_WEB_PORT}`;

/** The e2e database: same Postgres container as dev, its own name. */
export const E2E_DATABASE_NAME = 'b_spot_e2e';
export const DATABASE_HOST = 'localhost';
export const DATABASE_PORT = 5432;
export const DATABASE_USER = 'postgres';
export const DATABASE_PASSWORD = 'postgres';

export const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
export const E2E_ROOT = path.resolve(__dirname, '..');
export const API_ROOT = path.join(REPO_ROOT, 'apps', 'api');
export const MOBILE_ROOT = path.join(REPO_ROOT, 'apps', 'mobile');
export const WEB_BUILD_DIR = path.join(E2E_ROOT, '.web-build');

/** One user per auth journey, so one journey's session never touches another's. */
export const E2E_USERS = {
  login: 'login@e2e.test',
  moderation: 'moderation@e2e.test',
  expiry: 'expiry@e2e.test',
  regular: 'regular@e2e.test',
} as const;

export const E2E_USER_EMAILS: readonly string[] = Object.values(E2E_USERS);

/** Hosts no e2e run may reach. */
export const EXTERNAL_API_HOSTS: readonly string[] = [
  'world.openfoodfacts.org',
  'world.openbeautyfacts.org',
  'recherche-entreprises.api.gouv.fr',
  'api.pappers.fr',
];

/** Environment of the API process under test. */
export function buildApiEnv(): Record<string, string> {
  return {
    PORT: String(API_PORT),
    NODE_ENV: 'test',
    DATABASE_HOST,
    DATABASE_PORT: String(DATABASE_PORT),
    DATABASE_NAME: E2E_DATABASE_NAME,
    DATABASE_USER,
    DATABASE_PASSWORD,
    OPEN_FOOD_FACTS_BASE_URL: `${FIXTURES_URL}/off`,
    OPEN_BEAUTY_FACTS_BASE_URL: `${FIXTURES_URL}/obf`,
    RECHERCHE_ENTREPRISES_BASE_URL: `${FIXTURES_URL}/recherche-entreprises`,
    PAPPERS_BASE_URL: `${FIXTURES_URL}/pappers`,
    PAPPERS_API_KEY: 'e2e-fake-token',
    BETTER_AUTH_URL: API_URL,
    BETTER_AUTH_SECRET: 'e2e-only-secret-not-used-anywhere-else-0123456789',
    CORS_ORIGIN: WEB_URL,
    SMTP_HOST: 'localhost',
    SMTP_PORT: String(SMTP_PORT),
    SMTP_SECURE: 'false',
    SMTP_USER: '',
    SMTP_PASSWORD: '',
    SMTP_FROM: 'B-Spot E2E <noreply@e2e.test>',
    ADMIN_EMAIL: 'quota-alerts@e2e.test',
  };
}
