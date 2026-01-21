import { Migration } from '@mikro-orm/migrations';

export class Migration20260121145919 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "test" ("id" serial primary key, "name" varchar(255) not null, "created_at" timestamptz not null);`);
  }

}
