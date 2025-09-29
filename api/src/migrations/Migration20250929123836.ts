import { Migration } from '@mikro-orm/migrations';

export class Migration20250929123836 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table "entity_relations" add constraint "entity_relations_source_type_source_id_target_typ_321f2_unique" unique ("source_type", "source_id", "target_type", "target_id", "relation_type");`,
    );

    this.addSql(
      `alter table "personality_relations" add constraint "personality_relations_source_personality_id_targe_59e66_unique" unique ("source_personality_id", "target_personality_id", "relation_type");`,
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table "entity_relations" drop constraint "entity_relations_source_type_source_id_target_typ_321f2_unique";`,
    );

    this.addSql(
      `alter table "personality_relations" drop constraint "personality_relations_source_personality_id_targe_59e66_unique";`,
    );
  }
}
