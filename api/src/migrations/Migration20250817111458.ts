import { Migration } from '@mikro-orm/migrations';

export class Migration20250817111458 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "funds" alter column "description" type varchar(255) using ("description"::varchar(255));`);
    this.addSql(`alter table "funds" alter column "description" set not null;`);

    this.addSql(`alter table "personalities" alter column "description" type varchar(255) using ("description"::varchar(255));`);
    this.addSql(`alter table "personalities" alter column "description" set not null;`);

    this.addSql(`alter table "sectors" alter column "description" type varchar(255) using ("description"::varchar(255));`);
    this.addSql(`alter table "sectors" alter column "description" set not null;`);

    this.addSql(`alter table "companies" add column "description" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "funds" alter column "description" type varchar(255) using ("description"::varchar(255));`);
    this.addSql(`alter table "funds" alter column "description" drop not null;`);

    this.addSql(`alter table "personalities" alter column "description" type varchar(255) using ("description"::varchar(255));`);
    this.addSql(`alter table "personalities" alter column "description" drop not null;`);

    this.addSql(`alter table "sectors" alter column "description" type varchar(255) using ("description"::varchar(255));`);
    this.addSql(`alter table "sectors" alter column "description" drop not null;`);

    this.addSql(`alter table "companies" drop column "description";`);
  }

}
