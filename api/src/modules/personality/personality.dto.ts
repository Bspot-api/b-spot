import { ApiProperty } from '@nestjs/swagger';
import { CompanyDto } from '../company/company.dto';

export class CreatePersonalityDto {
  @ApiProperty({ description: 'Personality name' })
  name: string;

  @ApiProperty({ description: 'Personality description' })
  description: string;
}

export class UpdatePersonalityDto {
  @ApiProperty({ description: 'Personality name', required: false })
  name?: string;

  @ApiProperty({ description: 'Personality description', required: false })
  description?: string;
}

export class PersonalityDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => [CompanyDto] })
  companies: CompanyDto[];
}
