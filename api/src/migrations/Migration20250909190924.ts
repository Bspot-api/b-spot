import { Migration } from '@mikro-orm/migrations';

export class Migration20250909190924 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`drop table if exists "funds_personalities" cascade;`);

    this.addSql(`drop table if exists "funds_sectors" cascade;`);

    this.addSql(`drop table if exists "companies_personalities" cascade;`);

    this.addSql(
      `alter table "companies" drop constraint "companies_fund_id_foreign";`,
    );
    this.addSql(
      `alter table "companies" drop constraint "companies_sector_id_foreign";`,
    );

    this.addSql(`drop index "companies_fund_id_index";`);
    this.addSql(`drop index "companies_sector_id_index";`);
    this.addSql(
      `alter table "companies" drop column "fund_id", drop column "sector_id";`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `create table "funds_personalities" ("fund_id" uuid not null, "personality_id" uuid not null, constraint "funds_personalities_pkey" primary key ("fund_id", "personality_id"));`,
    );

    this.addSql(
      `create table "funds_sectors" ("fund_id" uuid not null, "sector_id" uuid not null, constraint "funds_sectors_pkey" primary key ("fund_id", "sector_id"));`,
    );

    this.addSql(
      `create table "companies_personalities" ("company_id" uuid not null, "personality_id" uuid not null, constraint "companies_personalities_pkey" primary key ("company_id", "personality_id"));`,
    );

    this.addSql(
      `alter table "funds_personalities" add constraint "funds_personalities_fund_id_foreign" foreign key ("fund_id") references "funds" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "funds_personalities" add constraint "funds_personalities_personality_id_foreign" foreign key ("personality_id") references "personalities" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "funds_sectors" add constraint "funds_sectors_fund_id_foreign" foreign key ("fund_id") references "funds" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "funds_sectors" add constraint "funds_sectors_sector_id_foreign" foreign key ("sector_id") references "sectors" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "companies_personalities" add constraint "companies_personalities_company_id_foreign" foreign key ("company_id") references "companies" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "companies_personalities" add constraint "companies_personalities_personality_id_foreign" foreign key ("personality_id") references "personalities" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "companies" add column "fund_id" uuid null, add column "sector_id" uuid null;`,
    );
    this.addSql(
      `alter table "companies" add constraint "companies_fund_id_foreign" foreign key ("fund_id") references "funds" ("id") on update cascade on delete set null;`,
    );
    this.addSql(
      `alter table "companies" add constraint "companies_sector_id_foreign" foreign key ("sector_id") references "sectors" ("id") on update cascade on delete set null;`,
    );
    this.addSql(
      `create index "companies_fund_id_index" on "companies" ("fund_id");`,
    );
    this.addSql(
      `create index "companies_sector_id_index" on "companies" ("sector_id");`,
    );
  }
}
