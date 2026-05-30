import { Migration } from '@mikro-orm/migrations';

export class Migration20260225000000_add_cache_tables extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE "pappers_cache" (
        "id" SERIAL PRIMARY KEY,
        "siren" VARCHAR(9) NOT NULL UNIQUE,
        "response_data" JSONB NOT NULL,
        "fetched_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "expires_at" TIMESTAMPTZ NOT NULL
      );
    `);

    this.addSql(`
      CREATE TABLE "api_usage_log" (
        "id" SERIAL PRIMARY KEY,
        "api" VARCHAR(50) NOT NULL,
        "endpoint" VARCHAR(255) NOT NULL,
        "request_params" TEXT,
        "success" BOOLEAN NOT NULL,
        "error_message" TEXT,
        "timestamp" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    this.addSql(
      `CREATE INDEX "api_usage_log_api_timestamp_idx" ON "api_usage_log" ("api", "timestamp");`,
    );
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "api_usage_log";`);
    this.addSql(`DROP TABLE IF EXISTS "pappers_cache";`);
  }
}
