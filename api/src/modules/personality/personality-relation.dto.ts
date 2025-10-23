import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsOptional, IsString } from 'class-validator';
import { PersonalityRelationType } from './personality-relation.entity';

export class CreatePersonalityRelationDto {
  @ApiProperty({ description: 'Source personality ID' })
  @IsUUID()
  sourcePersonality: string;

  @ApiProperty({ description: 'Target personality ID' })
  @IsUUID()
  targetPersonality: string;

  @ApiProperty({
    enum: PersonalityRelationType,
    description: 'Type of relation between personalities',
  })
  @IsEnum(PersonalityRelationType)
  relationType: PersonalityRelationType;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
