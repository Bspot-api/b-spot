import {
  Entity,
  Enum,
  Index,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

export enum EntityType {
  FUND = 'fund',
  COMPANY = 'company',
  BRAND = 'brand',
  PERSONALITY = 'personality',
  SECTOR = 'sector',
}

export enum RelationType {
  OWNS = 'owns',
  CONTROLS = 'controls',
  MANAGES = 'manages',
  FOUNDED = 'founded',
  INVESTS_IN = 'invests_in',
  INVESTED_IN = 'invested_in',
  OPERATES_IN = 'operates_in',
  BELONGS_TO = 'belongs_to',
  COMPETES_WITH = 'competes_with',
  PARTNERS_WITH = 'partners_with',
  ACQUIRED = 'acquired',
  SPUN_OFF = 'spun_off',
  FINANCEMENT = 'financement',
  DETENTION_CAPITAL = 'détention_capital',
  PLATEFORME_ROLL_UP = 'plateforme_roll-up',
  STUDIO = 'studio',
  INCUBEE_PAR = 'incubée_par',
  SUPPORTS = 'supports',
  // Personality-to-personality relations
  IS_FRIEND_OF = 'is_friend_of',
  IS_FAMILY_OF = 'is_family_of',
  IS_COLLEAGUE_OF = 'is_colleague_of',
  IS_MENTOR_OF = 'is_mentor_of',
  IS_PARTNER_OF = 'is_partner_of',
  IS_RIVAL_OF = 'is_rival_of',
  IS_CONNECTED_TO = 'is_connected_to',
}

@Entity({ tableName: 'entity_relations' })
@Index({ properties: ['sourceType', 'sourceId'] })
@Index({ properties: ['targetType', 'targetId'] })
@Index({ properties: ['relationType'] })
@Unique({
  properties: [
    'sourceType',
    'sourceId',
    'targetType',
    'targetId',
    'relationType',
  ],
})
export class EntityRelation {
  @ApiProperty({ description: 'Relation unique identifier' })
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id!: string;

  @ApiProperty({ description: 'Source entity type', enum: EntityType })
  @Enum(() => EntityType)
  sourceType!: EntityType;

  @ApiProperty({ description: 'Source entity ID' })
  @Property({ type: 'uuid' })
  sourceId!: string;

  @ApiProperty({ description: 'Target entity type', enum: EntityType })
  @Enum(() => EntityType)
  targetType!: EntityType;

  @ApiProperty({ description: 'Target entity ID' })
  @Property({ type: 'uuid' })
  targetId!: string;

  @ApiProperty({ description: 'Type of relationship', enum: RelationType })
  @Enum(() => RelationType)
  relationType!: RelationType;

  @ApiProperty({ description: 'Relationship strength (0-1)', required: false })
  @Property({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  strength?: number;

  @ApiProperty({
    description: 'Start date of the relationship',
    required: false,
  })
  @Property({ type: 'date', nullable: true })
  startDate?: Date;

  @ApiProperty({ description: 'End date of the relationship', required: false })
  @Property({ type: 'date', nullable: true })
  endDate?: Date;

  @ApiProperty({ description: 'Additional context or notes', required: false })
  @Property({ nullable: true })
  notes?: string;

  @ApiProperty({ description: 'Date when relation was created' })
  @Property({ fieldName: 'createdAt' })
  createdAt: Date = new Date();

  @ApiProperty({ description: 'Date when relation was last updated' })
  @Property({ fieldName: 'updatedAt', onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
