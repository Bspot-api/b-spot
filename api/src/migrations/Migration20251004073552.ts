import { Migration } from '@mikro-orm/migrations';

export class Migration20251004073552 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "entity_relations" drop constraint if exists "entity_relations_relation_type_check";`);

    this.addSql(`alter table "entity_relations" add constraint "entity_relations_relation_type_check" check("relation_type" in ('owns', 'controls', 'manages', 'founded', 'invests_in', 'invested_in', 'operates_in', 'belongs_to', 'competes_with', 'partners_with', 'acquired', 'spun_off', 'financement', 'détention_capital', 'plateforme_roll-up', 'studio', 'incubée_par', 'is_friend_of', 'is_family_of', 'is_colleague_of', 'is_mentor_of', 'is_partner_of', 'is_rival_of', 'is_connected_to'));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "entity_relations" drop constraint if exists "entity_relations_relation_type_check";`);

    this.addSql(`alter table "entity_relations" add constraint "entity_relations_relation_type_check" check("relation_type" in ('owns', 'controls', 'manages', 'founded', 'invests_in', 'operates_in', 'competes_with', 'partners_with', 'acquired', 'spun_off', 'is_friend_of', 'is_family_of', 'is_colleague_of', 'is_mentor_of', 'is_partner_of', 'is_rival_of'));`);
  }

}
