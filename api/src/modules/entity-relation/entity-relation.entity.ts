import { Entity, Enum, Index, PrimaryKey, Property } from '@mikro-orm/core';
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
  OPERATES_IN = 'operates_in',
  COMPETES_WITH = 'competes_with',
  PARTNERS_WITH = 'partners_with',
  ACQUIRED = 'acquired',
  SPUN_OFF = 'spun_off',
}

@Entity({ tableName: 'entity_relations' })
@Index({ properties: ['sourceType', 'sourceId'] })
@Index({ properties: ['targetType', 'targetId'] })
@Index({ properties: ['relationType'] })
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

  @ApiProperty({ description: 'Start date of the relationship', required: false })
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