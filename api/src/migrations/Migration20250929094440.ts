import { Migration } from '@mikro-orm/migrations';

export class Migration20250929094440 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "companies" add constraint "companies_name_unique" unique ("name");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "companies" drop constraint "companies_name_unique";`,
    );
  }
}
