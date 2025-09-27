import { Migration } from '@mikro-orm/migrations';

export class Migration20250909185821 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "companies" drop constraint "companies_fund_id_foreign";`,
    );
    this.addSql(
      `alter table "companies" drop constraint "companies_sector_id_foreign";`,
    );

    this.addSql(`alter table "companies" alter column "fund_id" drop default;`);
    this.addSql(
      `alter table "companies" alter column "fund_id" type uuid using ("fund_id"::text::uuid);`,
    );
    this.addSql(
      `alter table "companies" alter column "fund_id" drop not null;`,
    );
    this.addSql(
      `alter table "companies" alter column "sector_id" drop default;`,
    );
    this.addSql(
      `alter table "companies" alter column "sector_id" type uuid using ("sector_id"::text::uuid);`,
    );
    this.addSql(
      `alter table "companies" alter column "sector_id" drop not null;`,
    );
    this.addSql(
      `alter table "companies" add constraint "companies_fund_id_foreign" foreign key ("fund_id") references "funds" ("id") on update cascade on delete set null;`,
    );
    this.addSql(
      `alter table "companies" add constraint "companies_sector_id_foreign" foreign key ("sector_id") references "sectors" ("id") on update cascade on delete set null;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "companies" drop constraint "companies_fund_id_foreign";`,
    );
    this.addSql(
      `alter table "companies" drop constraint "companies_sector_id_foreign";`,
    );

    this.addSql(`alter table "companies" alter column "fund_id" drop default;`);
    this.addSql(
      `alter table "companies" alter column "fund_id" type uuid using ("fund_id"::text::uuid);`,
    );
    this.addSql(`alter table "companies" alter column "fund_id" set not null;`);
    this.addSql(
      `alter table "companies" alter column "sector_id" drop default;`,
    );
    this.addSql(
      `alter table "companies" alter column "sector_id" type uuid using ("sector_id"::text::uuid);`,
    );
    this.addSql(
      `alter table "companies" alter column "sector_id" set not null;`,
    );
    this.addSql(
      `alter table "companies" add constraint "companies_fund_id_foreign" foreign key ("fund_id") references "funds" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "companies" add constraint "companies_sector_id_foreign" foreign key ("sector_id") references "sectors" ("id") on update cascade;`,
    );
  }
}
