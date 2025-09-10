import { Migration } from '@mikro-orm/migrations';

export class Migration20250910094916_CreatePersonalityRelationsTable extends Migration {

  override async up(): Promise<void> {
    this.addSql('CREATE TABLE "personality_relations" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "source_personality_id" uuid NOT NULL, "target_personality_id" uuid NOT NULL, "relation_type" varchar(255) NOT NULL, "notes" text NULL, "createdAt" timestamptz(0) NOT NULL DEFAULT now(), "updatedAt" timestamptz(0) NOT NULL DEFAULT now(), CONSTRAINT "personality_relations_pkey" PRIMARY KEY ("id"));');
    this.addSql('CREATE INDEX "personality_relations_source_personality_target_personality_index" ON "personality_relations" ("source_personality_id", "target_personality_id");');
    this.addSql('CREATE INDEX "personality_relations_relation_type_index" ON "personality_relations" ("relation_type");');
    this.addSql('CREATE INDEX "personality_relations_source_personality_relation_type_index" ON "personality_relations" ("source_personality_id", "relation_type");');
    this.addSql('ALTER TABLE "personality_relations" ADD CONSTRAINT "personality_relations_source_personality_id_foreign" FOREIGN KEY ("source_personality_id") REFERENCES "personalities" ("id") ON UPDATE CASCADE ON DELETE CASCADE;');
    this.addSql('ALTER TABLE "personality_relations" ADD CONSTRAINT "personality_relations_target_personality_id_foreign" FOREIGN KEY ("target_personality_id") REFERENCES "personalities" ("id") ON UPDATE CASCADE ON DELETE CASCADE;');
    this.addSql('ALTER TABLE "personality_relations" ADD CONSTRAINT "personality_relations_relation_type_check" CHECK ("relation_type" IN (\'is_friend_of\', \'is_family_of\', \'is_colleague_of\', \'is_mentor_of\', \'is_partner_of\', \'is_rival_of\'));');
  }

  override async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS "personality_relations";');
  }

}
