import { Migration } from '@mikro-orm/migrations';

export class Migration20251016173015 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "sectors" add column "icon" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "sectors" drop column "icon";`);
  }

}
