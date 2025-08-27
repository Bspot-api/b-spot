import { Migration } from '@mikro-orm/migrations';

export class Migration20250814170607 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`drop table if exists "associations" cascade;`);
    this.addSql(`drop table if exists "associations_funds" cascade;`);
    this.addSql(`drop table if exists "associations_personalities" cascade;`);
    this.addSql(`drop table if exists "associations_sectors" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(
      `create table "associations" ("id" uuid not null default gen_random_uuid(), "name" varchar(255) not null, "description" varchar(255) null, "published" bool not null default false, "createdAt" timestamptz(6) not null, constraint "associations_pkey" primary key ("id"));`,
    );
    this.addSql(
      `create index "associations_name_index" on "associations" ("name");`,
    );
    this.addSql(
      `alter table "associations" add constraint "associations_name_unique" unique ("name");`,
    );

    this.addSql(
      `create table "associations_personalities" ("association_id" uuid not null, "personality_id" uuid not null, constraint "associations_personalities_pkey" primary key ("association_id", "personality_id"));`,
    );

    this.addSql(
      `create table "associations_sectors" ("association_id" uuid not null, "sector_id" uuid not null, constraint "associations_sectors_pkey" primary key ("association_id", "sector_id"));`,
    );

    this.addSql(
      `alter table "associations_personalities" add constraint "associations_personalities_association_id_foreign" foreign key ("association_id") references "associations" ("id") on update cascade on delete cascade;`,
    );

    this.addSql(
      `alter table "associations_sectors" add constraint "associations_sectors_association_id_foreign" foreign key ("association_id") references "associations" ("id") on update cascade on delete cascade;`,
    );
  }
}
