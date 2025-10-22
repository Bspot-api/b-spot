import { Migration } from '@mikro-orm/migrations';

export class Migration20251022103446 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "account" ("id" text not null, "user_id" text not null, "account_id" text not null, "provider_id" text not null, "access_token" text null, "refresh_token" text null, "id_token" text null, "access_token_expires_at" timestamptz null, "refresh_token_expires_at" timestamptz null, "scope" text null, "password" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "account_pkey" primary key ("id"));`);
    this.addSql(`create index "account_user_id_index" on "account" ("user_id");`);

    this.addSql(`create table "session" ("id" text not null, "user_id" text not null, "token" text not null, "expires_at" timestamptz not null, "ip_address" text null, "user_agent" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "session_pkey" primary key ("id"));`);
    this.addSql(`create index "session_user_id_index" on "session" ("user_id");`);
    this.addSql(`alter table "session" add constraint "session_token_unique" unique ("token");`);

    this.addSql(`create table "user" ("id" text not null, "email" varchar(255) not null, "password" varchar(255) null, "name" varchar(255) null, "avatar" varchar(255) null, "image" varchar(255) null, "email_verified" boolean not null default false, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);

    this.addSql(`create table "verification" ("id" text not null, "identifier" text not null, "value" text not null, "expires_at" timestamptz not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "verification_pkey" primary key ("id"));`);

    this.addSql(`drop table if exists "users" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "users" ("id" serial primary key, "email" varchar(255) not null, "password" varchar(255) null, "name" varchar(255) null, "avatar" varchar(255) null, "email_verified" boolean not null default false, "email_verification_token" varchar(255) null, "email_verification_token_expires_at" timestamptz null, "password_reset_token" varchar(255) null, "password_reset_token_expires_at" timestamptz null, "is_active" boolean not null default false, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);

    this.addSql(`drop table if exists "account" cascade;`);

    this.addSql(`drop table if exists "session" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "verification" cascade;`);
  }

}
