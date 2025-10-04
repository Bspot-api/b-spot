import {
  Cascade,
  Entity,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Personality } from './personality.entity';

export enum PersonalityRelationType {
  IS_FRIEND_OF = 'is_friend_of',
  IS_FAMILY_OF = 'is_family_of',
  IS_COLLEAGUE_OF = 'is_colleague_of',
  IS_MENTOR_OF = 'is_mentor_of',
  IS_PARTNER_OF = 'is_partner_of',
  IS_RIVAL_OF = 'is_rival_of',
  IS_CONNECTED_TO = 'is_connected_to',
}

@Entity({ tableName: 'personality_relations' })
@Index({ properties: ['sourcePersonality', 'targetPersonality'] })
@Index({ properties: ['relationType'] })
@Index({ properties: ['sourcePersonality', 'relationType'] })
@Unique({
  properties: ['sourcePersonality', 'targetPersonality', 'relationType'],
})
export class PersonalityRelation {
  @ApiProperty({ description: 'Relation unique identifier' })
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ApiProperty({ description: 'Source personality' })
  @ManyToOne(() => Personality, { cascade: [Cascade.REMOVE] })
  sourcePersonality!: Personality;

  @ApiProperty({ description: 'Target personality' })
  @ManyToOne(() => Personality, { cascade: [Cascade.REMOVE] })
  targetPersonality!: Personality;

  @ApiProperty({ description: 'Type of relation' })
  @Property()
  relationType!: PersonalityRelationType;

  @ApiProperty({ description: 'Additional notes about the relation' })
  @Property({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Date created' })
  @Property({ fieldName: 'createdAt' })
  createdAt: Date = new Date();

  @ApiProperty({ description: 'Date updated' })
  @Property({ fieldName: 'updatedAt', onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
