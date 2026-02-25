import { Migration } from '@mikro-orm/migrations';

export class Migration20260225010000_add_core_entities extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE "brand" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(255) NOT NULL UNIQUE,
        "siren" VARCHAR(9) NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    this.addSql(`CREATE INDEX "brand_siren_idx" ON "brand" ("siren");`);

    this.addSql(`
      CREATE TABLE "product" (
        "id" SERIAL PRIMARY KEY,
        "barcode" VARCHAR(20) NOT NULL UNIQUE,
        "name" VARCHAR(255) NOT NULL,
        "category" VARCHAR(255),
        "image_url" TEXT,
        "source" VARCHAR(3) NOT NULL,
        "brand_id" INT REFERENCES "brand"("id") ON DELETE SET NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    this.addSql(`
      CREATE TABLE "company" (
        "id" SERIAL PRIMARY KEY,
        "siren" VARCHAR(9) NOT NULL UNIQUE,
        "legal_name" VARCHAR(255) NOT NULL,
        "logo_url" TEXT,
        "raw_pappers_data" JSONB,
        "executives" JSONB NOT NULL DEFAULT '[]',
        "shareholders" JSONB NOT NULL DEFAULT '[]',
        "subsidiaries" JSONB,
        "last_fetched_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS "company";`);
    this.addSql(`DROP TABLE IF EXISTS "product";`);
    this.addSql(`DROP TABLE IF EXISTS "brand";`);
  }
}
