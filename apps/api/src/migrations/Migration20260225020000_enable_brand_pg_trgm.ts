import { Migration } from '@mikro-orm/migrations';

export class Migration20260225020000_enable_brand_pg_trgm extends Migration {
  async up(): Promise<void> {
    this.addSql(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);
    this.addSql(`
      CREATE INDEX IF NOT EXISTS "brand_name_trgm_idx"
      ON "brand" USING gin (lower("name") gin_trgm_ops);
    `);
  }

  async down(): Promise<void> {
    this.addSql(`DROP INDEX IF EXISTS "brand_name_trgm_idx";`);
  }
}
