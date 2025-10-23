import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { CompanyDto } from '../company/company.dto';

export class CreateSectorDto {
  @ApiProperty({ description: 'Sector name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Sector description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Lucide icon name', required: false })
  @IsOptional()
  @IsString()
  icon?: string;
}

export class UpdateSectorDto {
  @ApiProperty({ description: 'Sector name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Sector description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Lucide icon name', required: false })
  @IsOptional()
  @IsString()
  icon?: string;
}

export class SectorDto {
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
