import { Client } from 'pg';
import {
  DATABASE_HOST,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
  E2E_DATABASE_NAME,
  E2E_USER_EMAILS,
} from '../env/e2e-env';

/** Refuses any database whose name does not end in `_e2e` (dev data stays untouched). */
export function assertE2eDatabaseName(name: string): void {
  if (!name.endsWith('_e2e')) {
    throw new Error(`Refusing to touch database "${name}": e2e databases must end in "_e2e"`);
  }
}

/** Opens a client on a database of the e2e Postgres (the e2e one by default). */
export async function connect(database: string = E2E_DATABASE_NAME): Promise<Client> {
  if (database !== 'postgres') assertE2eDatabaseName(database);
  const client = new Client({
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database,
  });
  await client.connect();
  return client;
}

async function withClient<T>(work: (client: Client) => Promise<T>): Promise<T> {
  const client = await connect();
  try {
    return await work(client);
  } finally {
    await client.end();
  }
}

/** Creates the e2e users if missing and gives each of them an admin row. */
export async function ensureE2eAdmins(client: Client): Promise<void> {
  for (const email of E2E_USER_EMAILS) {
    await client.query(
      `INSERT INTO "user" (name, email, "emailVerified") VALUES ($1, $2, true)
       ON CONFLICT (email) DO NOTHING`,
      [email.split('@')[0], email],
    );
    await client.query(
      `INSERT INTO "admins" ("userId") SELECT id FROM "user" WHERE email = $1
       ON CONFLICT ("userId") DO NOTHING`,
      [email],
    );
  }
}

/** Brings the e2e database back to its seeded state between journeys. */
export function resetMutableState(): Promise<void> {
  return withClient(async (client) => {
    await client.query(
      `TRUNCATE product, company, pappers_cache, api_usage_log, brand_suggestion,
        session, verification RESTART IDENTITY CASCADE`,
    );
    await client.query(`DELETE FROM brand WHERE match_source IS DISTINCT FROM 'seed'`);
    await ensureE2eAdmins(client);
  });
}

/** Moves every session of a user into the past: a real, server-side expiry. */
export function expireSessionsOf(email: string): Promise<number> {
  return withClient(async (client) => {
    const result = await client.query(
      `UPDATE session SET "expiresAt" = now() - interval '1 minute'
       WHERE "userId" = (SELECT id FROM "user" WHERE email = $1)`,
      [email],
    );
    return result.rowCount ?? 0;
  });
}

/** How many sessions a user has (a native sign-out that reached the API leaves none). */
export function countSessionsOf(email: string): Promise<number> {
  return withClient(async (client) => {
    const result = await client.query<{ count: string }>(
      `SELECT count(*) AS count FROM session
       WHERE "userId" = (SELECT id FROM "user" WHERE email = $1)`,
      [email],
    );
    return Number(result.rows[0].count);
  });
}

/** Removes a user's admin row: the user stays logged in, as a regular user. */
export function revokeAdminRole(email: string): Promise<void> {
  return withClient(async (client) => {
    await client.query(
      `DELETE FROM "admins" WHERE "userId" = (SELECT id FROM "user" WHERE email = $1)`,
      [email],
    );
  });
}

export interface StoredSuggestion {
  brandName: string;
  barcode: string | null;
  notes: string | null;
}

/** Reads the stored brand suggestions whose notes equal `notes`. */
export function findSuggestionsByNotes(notes: string): Promise<StoredSuggestion[]> {
  return withClient(async (client) => {
    const result = await client.query<StoredSuggestion>(
      `SELECT brand_name AS "brandName", barcode, notes FROM brand_suggestion WHERE notes = $1`,
      [notes],
    );
    return result.rows;
  });
}

/** Reads the name of the database the e2e pool is connected to. */
export function readCurrentDatabaseName(): Promise<string> {
  return withClient(async (client) => {
    const result = await client.query<{ name: string }>('SELECT current_database() AS name');
    return result.rows[0].name;
  });
}
