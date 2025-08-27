import { Migration } from '@mikro-orm/migrations';

export class Migration20250725125024 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `create table "users" ("id" serial primary key, "email" varchar(255) not null, "password" varchar(255) null, "name" varchar(255) null, "avatar" varchar(255) null, "email_verified" boolean not null default false, "email_verification_token" varchar(255) null, "email_verification_token_expires_at" timestamptz null, "password_reset_token" varchar(255) null, "password_reset_token_expires_at" timestamptz null, "is_active" boolean not null default false, "created_at" timestamptz not null, "updated_at" timestamptz not null);`,
    );
    this.addSql(
      `alter table "users" add constraint "users_email_unique" unique ("email");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "users" cascade;`);
  }
}
