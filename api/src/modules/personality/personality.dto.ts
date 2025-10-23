import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { CompanyDto } from '../company/company.dto';

export class CreatePersonalityDto {
  @ApiProperty({ description: 'Personality name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Personality description' })
  @IsString()
  description: string;
}

export class UpdatePersonalityDto {
  @ApiProperty({ description: 'Personality name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Personality description', required: false })
  @IsOptional()
  @IsString()
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
