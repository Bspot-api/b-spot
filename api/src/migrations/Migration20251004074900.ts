import { Migration } from '@mikro-orm/migrations';

export class Migration20251004074900 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "companies" alter column "source" type text using ("source"::text);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "companies" alter column "source" type varchar(255) using ("source"::varchar(255));`);
  }

}
