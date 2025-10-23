import { ApiProperty } from '@nestjs/swagger';
import { EntityType, RelationType } from './entity-relation.entity';

export class CreateEntityRelationDto {
  @ApiProperty({ enum: EntityType, description: 'Source entity type' })
  sourceType: EntityType;

  @ApiProperty({ description: 'Source entity ID' })
  sourceId: string;

  @ApiProperty({ enum: EntityType, description: 'Target entity type' })
  targetType: EntityType;

  @ApiProperty({ description: 'Target entity ID' })
  targetId: string;

  @ApiProperty({ enum: RelationType, description: 'Relation type' })
  relationType: RelationType;

  @ApiProperty({ description: 'Relation strength (0-100)', required: false })
  strength?: number;

  @ApiProperty({ description: 'Relation start date', required: false })
  startDate?: Date;

  @ApiProperty({ description: 'Relation end date', required: false })
  endDate?: Date;

  @ApiProperty({ description: 'Additional notes', required: false })
  notes?: string;
}

export class UpdateEntityRelationDto {
  @ApiProperty({ enum: EntityType, description: 'Source entity type', required: false })
  sourceType?: EntityType;

  @ApiProperty({ description: 'Source entity ID', required: false })
  sourceId?: string;

  @ApiProperty({ enum: EntityType, description: 'Target entity type', required: false })
  targetType?: EntityType;

  @ApiProperty({ description: 'Target entity ID', required: false })
  targetId?: string;

  @ApiProperty({ enum: RelationType, description: 'Relation type', required: false })
  relationType?: RelationType;

  @ApiProperty({ description: 'Relation strength (0-100)', required: false })
  strength?: number;

  @ApiProperty({ description: 'Relation start date', required: false })
  startDate?: Date;

  @ApiProperty({ description: 'Relation end date', required: false })
  endDate?: Date;

  @ApiProperty({ description: 'Additional notes', required: false })
  notes?: string;
}
