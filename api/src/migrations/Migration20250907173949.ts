import { Migration } from '@mikro-orm/migrations';

export class Migration20250907173949 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "entity_relations" ("id" uuid not null default gen_random_uuid(), "source_type" text check ("source_type" in ('fund', 'company', 'brand', 'personality', 'sector')) not null, "source_id" uuid not null, "target_type" text check ("target_type" in ('fund', 'company', 'brand', 'personality', 'sector')) not null, "target_id" uuid not null, "relation_type" text check ("relation_type" in ('owns', 'controls', 'manages', 'founded', 'invests_in', 'operates_in', 'competes_with', 'partners_with', 'acquired', 'spun_off')) not null, "strength" numeric(3,2) null, "start_date" date null, "end_date" date null, "notes" varchar(255) null, "createdAt" timestamptz not null, "updatedAt" timestamptz not null, constraint "entity_relations_pkey" primary key ("id"));`);
    this.addSql(`create index "entity_relations_relation_type_index" on "entity_relations" ("relation_type");`);
    this.addSql(`create index "entity_relations_target_type_target_id_index" on "entity_relations" ("target_type", "target_id");`);
    this.addSql(`create index "entity_relations_source_type_source_id_index" on "entity_relations" ("source_type", "source_id");`);

    this.addSql(`create table "brands" ("id" uuid not null default gen_random_uuid(), "name" varchar(255) not null, "description" varchar(255) not null, "source" varchar(255) null, "published" boolean not null default false, "createdAt" timestamptz not null, "company_id" uuid null, "fund_id" uuid null, "sector_id" uuid null, constraint "brands_pkey" primary key ("id"));`);
    this.addSql(`create index "brands_name_index" on "brands" ("name");`);
    this.addSql(`alter table "brands" add constraint "brands_name_unique" unique ("name");`);

    this.addSql(`create table "brands_personalities" ("brand_id" uuid not null, "personality_id" uuid not null, constraint "brands_personalities_pkey" primary key ("brand_id", "personality_id"));`);

    this.addSql(`alter table "brands" add constraint "brands_company_id_foreign" foreign key ("company_id") references "companies" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "brands" add constraint "brands_fund_id_foreign" foreign key ("fund_id") references "funds" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "brands" add constraint "brands_sector_id_foreign" foreign key ("sector_id") references "sectors" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "brands_personalities" add constraint "brands_personalities_brand_id_foreign" foreign key ("brand_id") references "brands" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "brands_personalities" add constraint "brands_personalities_personality_id_foreign" foreign key ("personality_id") references "personalities" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "brands_personalities" drop constraint "brands_personalities_brand_id_foreign";`);

    this.addSql(`drop table if exists "entity_relations" cascade;`);

    this.addSql(`drop table if exists "brands" cascade;`);

    this.addSql(`drop table if exists "brands_personalities" cascade;`);
  }

}
