import { Migration } from '@mikro-orm/migrations';

export class Migration20260225030000_add_brand_status_and_suggestions extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      ALTER TABLE "brand"
      ADD COLUMN "status" VARCHAR(20) NOT NULL DEFAULT 'active',
      ADD COLUMN "confidence" DOUBLE PRECISION NULL,
      ADD COLUMN "match_source" VARCHAR(30) NULL,
      ADD COLUMN "matched_query" VARCHAR(255) NULL;
    `);

    this.addSql(`
      UPDATE "brand"
      SET "status" = 'active',
          "match_source" = 'seed'
      WHERE "match_source" IS NULL;
    `);

    this.addSql(`CREATE INDEX "brand_status_idx" ON "brand" ("status");`);

    this.addSql(`
      CREATE TABLE "brand_suggestion" (
        "id" SERIAL PRIMARY KEY,
        "brand_name" VARCHAR(255) NOT NULL,
        "barcode" VARCHAR(20) NULL,
        "product_name" VARCHAR(255) NULL,
        "product_image_url" TEXT NULL,
        "notes" TEXT NULL,
        "off_brand_raw" VARCHAR(255) NULL,
        "status" VARCHAR(20) NOT NULL DEFAULT 'new',
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    this.addSql(`CREATE INDEX "brand_suggestion_status_idx" ON "brand_suggestion" ("status");`);
    this.addSql(
      `CREATE INDEX "brand_suggestion_brand_name_idx" ON "brand_suggestion" ("brand_name");`,
    );
    this.addSql(`CREATE INDEX "brand_suggestion_barcode_idx" ON "brand_suggestion" ("barcode");`);
  }

  async down(): Promise<void> {
    this.addSql(`DROP INDEX IF EXISTS "brand_suggestion_barcode_idx";`);
    this.addSql(`DROP INDEX IF EXISTS "brand_suggestion_brand_name_idx";`);
    this.addSql(`DROP INDEX IF EXISTS "brand_suggestion_status_idx";`);
    this.addSql(`DROP TABLE IF EXISTS "brand_suggestion";`);

    this.addSql(`DROP INDEX IF EXISTS "brand_status_idx";`);

    this.addSql(`
      ALTER TABLE "brand"
      DROP COLUMN IF EXISTS "matched_query",
      DROP COLUMN IF EXISTS "match_source",
      DROP COLUMN IF EXISTS "confidence",
      DROP COLUMN IF EXISTS "status";
    `);
  }
}
