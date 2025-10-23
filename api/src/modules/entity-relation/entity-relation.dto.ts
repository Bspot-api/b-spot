import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID, IsOptional, IsNumber, IsDateString, IsString, Min, Max } from 'class-validator';
import { EntityType, RelationType } from './entity-relation.entity';

export class CreateEntityRelationDto {
  @ApiProperty({ enum: EntityType, description: 'Source entity type' })
  @IsEnum(EntityType)
  sourceType: EntityType;

  @ApiProperty({ description: 'Source entity ID' })
  @IsUUID()
  sourceId: string;

  @ApiProperty({ enum: EntityType, description: 'Target entity type' })
  @IsEnum(EntityType)
  targetType: EntityType;

  @ApiProperty({ description: 'Target entity ID' })
  @IsUUID()
  targetId: string;

  @ApiProperty({ enum: RelationType, description: 'Relation type' })
  @IsEnum(RelationType)
  relationType: RelationType;

  @ApiProperty({ description: 'Relation strength (0-100)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  strength?: number;

  @ApiProperty({ description: 'Relation start date', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiProperty({ description: 'Relation end date', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateEntityRelationDto {
  @ApiProperty({ enum: EntityType, description: 'Source entity type', required: false })
  @IsOptional()
  @IsEnum(EntityType)
  sourceType?: EntityType;

  @ApiProperty({ description: 'Source entity ID', required: false })
  @IsOptional()
  @IsUUID()
  sourceId?: string;

  @ApiProperty({ enum: EntityType, description: 'Target entity type', required: false })
  @IsOptional()
  @IsEnum(EntityType)
  targetType?: EntityType;

  @ApiProperty({ description: 'Target entity ID', required: false })
  @IsOptional()
  @IsUUID()
  targetId?: string;

  @ApiProperty({ enum: RelationType, description: 'Relation type', required: false })
  @IsOptional()
  @IsEnum(RelationType)
  relationType?: RelationType;

  @ApiProperty({ description: 'Relation strength (0-100)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  strength?: number;

  @ApiProperty({ description: 'Relation start date', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiProperty({ description: 'Relation end date', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
