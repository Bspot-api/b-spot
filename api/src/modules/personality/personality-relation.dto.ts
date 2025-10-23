import { ApiProperty } from '@nestjs/swagger';
import { PersonalityRelationType } from './personality-relation.entity';

export class CreatePersonalityRelationDto {
  @ApiProperty({ description: 'Source personality ID' })
  sourcePersonality: string;

  @ApiProperty({ description: 'Target personality ID' })
  targetPersonality: string;

  @ApiProperty({
    enum: PersonalityRelationType,
    description: 'Type of relation between personalities',
  })
  relationType: PersonalityRelationType;

  @ApiProperty({ description: 'Additional notes', required: false })
  notes?: string;
}
