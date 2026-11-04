import { API_ROOT, E2E_DATABASE_NAME, buildApiEnv } from './e2e-env';
import { runCommand } from './process';
import { assertE2eDatabaseName, connect, ensureE2eAdmins } from '../support/db';

async function recreateDatabase(name: string): Promise<void> {
  assertE2eDatabaseName(name);
  const client = await connect('postgres');
  try {
    await client.query(`DROP DATABASE IF EXISTS "${name}" WITH (FORCE)`);
    await client.query(`CREATE DATABASE "${name}"`);
  } finally {
    await client.end();
  }
}

/** Runs the API's own migrations and default seeder against the e2e database. */
async function migrateAndSeed(): Promise<void> {
  const options = { cwd: API_ROOT, env: buildApiEnv() };
  await runCommand('pnpm', ['exec', 'mikro-orm', 'migration:up'], options);
  await runCommand('pnpm', ['exec', 'mikro-orm', 'seeder:run'], options);
}

/** Drops and recreates the e2e database, migrated and seeded, with the e2e users. */
export async function resetE2eDatabase(): Promise<void> {
  console.log(`[e2e] resetting database ${E2E_DATABASE_NAME}`);
  await recreateDatabase(E2E_DATABASE_NAME);
  await migrateAndSeed();
  const client = await connect();
  try {
    await ensureE2eAdmins(client);
  } finally {
    await client.end();
  }
}
