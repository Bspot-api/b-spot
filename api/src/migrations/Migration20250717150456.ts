import { Migration } from '@mikro-orm/migrations';

export class Migration20250717150456 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "companies" drop constraint "companies_fund_id_foreign";`,
    );
    this.addSql(
      `alter table "companies" drop constraint "companies_sector_id_foreign";`,
    );

    this.addSql(
      `alter table "companies_personalities" drop constraint "companies_personalities_company_id_foreign";`,
    );
    this.addSql(
      `alter table "companies_personalities" drop constraint "companies_personalities_personality_id_foreign";`,
    );

    this.addSql(`alter table "funds" alter column "id" drop default;`);
    this.addSql(
      `alter table "funds" alter column "id" type uuid using ("id"::text::uuid);`,
    );
    this.addSql(
      `alter table "funds" alter column "id" set default gen_random_uuid();`,
    );
    this.addSql(
      `alter table "funds" rename column "created_at" to "createdAt";`,
    );
    this.addSql(`create index "funds_name_index" on "funds" ("name");`);

    this.addSql(`alter table "personalities" alter column "id" drop default;`);
    this.addSql(
      `alter table "personalities" alter column "id" type uuid using ("id"::text::uuid);`,
    );
    this.addSql(
      `alter table "personalities" alter column "id" set default gen_random_uuid();`,
    );
    this.addSql(
      `alter table "personalities" rename column "created_at" to "createdAt";`,
    );
    this.addSql(
      `create index "personalities_name_index" on "personalities" ("name");`,
    );

    this.addSql(`alter table "sectors" alter column "id" drop default;`);
    this.addSql(
      `alter table "sectors" alter column "id" type uuid using ("id"::text::uuid);`,
    );
    this.addSql(
      `alter table "sectors" alter column "id" set default gen_random_uuid();`,
    );
    this.addSql(
      `alter table "sectors" rename column "created_at" to "createdAt";`,
    );
    this.addSql(`create index "sectors_name_index" on "sectors" ("name");`);

    this.addSql(`alter table "companies" alter column "id" drop default;`);
    this.addSql(
      `alter table "companies" alter column "id" type uuid using ("id"::text::uuid);`,
    );
    this.addSql(
      `alter table "companies" alter column "id" set default gen_random_uuid();`,
    );
    this.addSql(`alter table "companies" alter column "fund_id" drop default;`);
    this.addSql(
      `alter table "companies" alter column "fund_id" type uuid using ("fund_id"::text::uuid);`,
    );
    this.addSql(
      `alter table "companies" alter column "sector_id" drop default;`,
    );
    this.addSql(
      `alter table "companies" alter column "sector_id" type uuid using ("sector_id"::text::uuid);`,
    );
    this.addSql(
      `alter table "companies" rename column "created_at" to "createdAt";`,
    );
    this.addSql(
      `alter table "companies" add constraint "companies_fund_id_foreign" foreign key ("fund_id") references "funds" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "companies" add constraint "companies_sector_id_foreign" foreign key ("sector_id") references "sectors" ("id") on update cascade;`,
    );
    this.addSql(
      `create index "companies_fund_id_index" on "companies" ("fund_id");`,
    );
    this.addSql(
      `create index "companies_sector_id_index" on "companies" ("sector_id");`,
    );

    this.addSql(
      `alter table "companies_personalities" alter column "company_id" drop default;`,
    );
    this.addSql(
      `alter table "companies_personalities" alter column "company_id" type uuid using ("company_id"::text::uuid);`,
    );
    this.addSql(
      `alter table "companies_personalities" alter column "personality_id" drop default;`,
    );
    this.addSql(
      `alter table "companies_personalities" alter column "personality_id" type uuid using ("personality_id"::text::uuid);`,
    );
    this.addSql(
      `alter table "companies_personalities" add constraint "companies_personalities_company_id_foreign" foreign key ("company_id") references "companies" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "companies_personalities" add constraint "companies_personalities_personality_id_foreign" foreign key ("personality_id") references "personalities" ("id") on update cascade on delete cascade;`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "funds" alter column "id" type text using ("id"::text);`,
    );

    this.addSql(
      `alter table "personalities" alter column "id" type text using ("id"::text);`,
    );

    this.addSql(
      `alter table "sectors" alter column "id" type text using ("id"::text);`,
    );

    this.addSql(
      `alter table "companies" alter column "id" type text using ("id"::text);`,
    );
    this.addSql(
      `alter table "companies" alter column "fund_id" type text using ("fund_id"::text);`,
    );
    this.addSql(
      `alter table "companies" alter column "sector_id" type text using ("sector_id"::text);`,
    );

    this.addSql(
      `alter table "companies" drop constraint "companies_fund_id_foreign";`,
    );
    this.addSql(
      `alter table "companies" drop constraint "companies_sector_id_foreign";`,
    );

    this.addSql(
      `alter table "companies_personalities" alter column "company_id" type text using ("company_id"::text);`,
    );
    this.addSql(
      `alter table "companies_personalities" alter column "personality_id" type text using ("personality_id"::text);`,
    );

    this.addSql(
      `alter table "companies_personalities" drop constraint "companies_personalities_company_id_foreign";`,
    );
    this.addSql(
      `alter table "companies_personalities" drop constraint "companies_personalities_personality_id_foreign";`,
    );

    this.addSql(`drop index "funds_name_index";`);

    this.addSql(`alter table "funds" alter column "id" drop default;`);
    this.addSql(
      `alter table "funds" alter column "id" type varchar(255) using ("id"::varchar(255));`,
    );
    this.addSql(
      `alter table "funds" rename column "createdAt" to "created_at";`,
    );

    this.addSql(`drop index "personalities_name_index";`);

    this.addSql(`alter table "personalities" alter column "id" drop default;`);
    this.addSql(
      `alter table "personalities" alter column "id" type varchar(255) using ("id"::varchar(255));`,
    );
    this.addSql(
      `alter table "personalities" rename column "createdAt" to "created_at";`,
    );

    this.addSql(`drop index "sectors_name_index";`);

    this.addSql(`alter table "sectors" alter column "id" drop default;`);
    this.addSql(
      `alter table "sectors" alter column "id" type varchar(255) using ("id"::varchar(255));`,
    );
    this.addSql(
      `alter table "sectors" rename column "createdAt" to "created_at";`,
    );

    this.addSql(`drop index "companies_fund_id_index";`);
    this.addSql(`drop index "companies_sector_id_index";`);

    this.addSql(`alter table "companies" alter column "id" drop default;`);
    this.addSql(
      `alter table "companies" alter column "id" type varchar(255) using ("id"::varchar(255));`,
    );
    this.addSql(
      `alter table "companies" alter column "fund_id" type varchar(255) using ("fund_id"::varchar(255));`,
    );
    this.addSql(
      `alter table "companies" alter column "sector_id" type varchar(255) using ("sector_id"::varchar(255));`,
    );
    this.addSql(
      `alter table "companies" rename column "createdAt" to "created_at";`,
    );
    this.addSql(
      `alter table "companies" add constraint "companies_fund_id_foreign" foreign key ("fund_id") references "funds" ("id") on update cascade;`,
    );
    this.addSql(
      `alter table "companies" add constraint "companies_sector_id_foreign" foreign key ("sector_id") references "sectors" ("id") on update cascade;`,
    );

    this.addSql(
      `alter table "companies_personalities" alter column "company_id" type varchar(255) using ("company_id"::varchar(255));`,
    );
    this.addSql(
      `alter table "companies_personalities" alter column "personality_id" type varchar(255) using ("personality_id"::varchar(255));`,
    );
    this.addSql(
      `alter table "companies_personalities" add constraint "companies_personalities_company_id_foreign" foreign key ("company_id") references "companies" ("id") on update cascade on delete cascade;`,
    );
    this.addSql(
      `alter table "companies_personalities" add constraint "companies_personalities_personality_id_foreign" foreign key ("personality_id") references "personalities" ("id") on update cascade on delete cascade;`,
    );
  }
}
