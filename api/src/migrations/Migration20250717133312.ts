import { Migration } from '@mikro-orm/migrations';

export class Migration20250717133312 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "funds" ("id" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "published" boolean not null default false, "created_at" timestamptz not null, constraint "funds_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "funds" add constraint "funds_name_unique" unique ("name");`,
    );

    this.addSql(
      `create table "personalities" ("id" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "published" boolean not null default false, "created_at" timestamptz not null, constraint "personalities_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "personalities" add constraint "personalities_name_unique" unique ("name");`,
    );

    this.addSql(
      `create table "sectors" ("id" varchar(255) not null, "name" varchar(255) not null, "description" varchar(255) null, "published" boolean not null default false, "created_at" timestamptz not null, constraint "sectors_pkey" primary key ("id"));`,
    );
    this.addSql(
      `alter table "sectors" add constraint "sectors_name_unique" unique ("name");`,
    );

    this.addSql(
      `create table "companies" ("id" varchar(255) not null, "name" varchar(255) not null, "source" varchar(255) not null, "published" boolean not null default false, "created_at" timestamptz not null, "fund_id" varchar(255) not null, "sector_id" varchar(255) not null, constraint "companies_pkey" primary key ("id"));`,
    );

    this.addSql(
      `create table "companies_personalities" ("company_id" varchar(255) not null, "personality_id" varchar(255) not null, constraint "companies_personalities_pkey" primary key ("company_id", "personality_id"));`,
    );

    this.addSql(
      `alter table "companies" add constraint "companies_fund_id_foreign" foreign key ("fund_id") references "funds" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "companies" add constraint "companies_sector_id_foreign" foreign key ("sector_id") references "sectors" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "companies_personalities" add constraint "companies_personalities_company_id_foreign" foreign key ("company_id") references "companies" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "companies_personalities" add constraint "companies_personalities_personality_id_foreign" foreign key ("personality_id") references "personalities" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(`drop table if exists "migrations" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "companies" drop constraint "companies_fund_id_foreign";`,
    );

    this.addSql(
      `alter table "companies_personalities" drop constraint "companies_personalities_personality_id_foreign";`,
    );

    this.addSql(
      `alter table "companies" drop constraint "companies_sector_id_foreign";`,
    );

    this.addSql(
      `alter table "companies_personalities" drop constraint "companies_personalities_company_id_foreign";`,
    );

    this.addSql(
      `create table "migrations" ("id" serial, "timestamp" int8 not null, "name" varchar not null, constraint "PK_8c82d7f526340ab734260ea46be" primary key ("id"));`,
    );

    this.addSql(`drop table if exists "funds" cascade;`);

    this.addSql(`drop table if exists "personalities" cascade;`);

    this.addSql(`drop table if exists "sectors" cascade;`);

    this.addSql(`drop table if exists "companies" cascade;`);

    this.addSql(`drop table if exists "companies_personalities" cascade;`);
  }
}
