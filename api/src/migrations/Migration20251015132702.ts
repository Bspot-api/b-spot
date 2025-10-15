import { Migration } from '@mikro-orm/migrations';

export class Migration20251015132702 extends Migration {

  override async up(): Promise<void> {
    // Drop old CHECK constraint that was missing 'is_connected_to'
    this.addSql(
      `ALTER TABLE "personality_relations" DROP CONSTRAINT IF EXISTS "personality_relations_relation_type_check";`
    );

    // Add new CHECK constraint with all relation types including 'is_connected_to'
    this.addSql(
      `ALTER TABLE "personality_relations" ADD CONSTRAINT "personality_relations_relation_type_check" CHECK ("relation_type" IN ('is_friend_of', 'is_family_of', 'is_colleague_of', 'is_mentor_of', 'is_partner_of', 'is_rival_of', 'is_connected_to'));`
    );
  }

  override async down(): Promise<void> {
    // Revert to old CHECK constraint without 'is_connected_to'
    this.addSql(
      `ALTER TABLE "personality_relations" DROP CONSTRAINT IF EXISTS "personality_relations_relation_type_check";`
    );

    this.addSql(
      `ALTER TABLE "personality_relations" ADD CONSTRAINT "personality_relations_relation_type_check" CHECK ("relation_type" IN ('is_friend_of', 'is_family_of', 'is_colleague_of', 'is_mentor_of', 'is_partner_of', 'is_rival_of'));`
    );
  }

}
