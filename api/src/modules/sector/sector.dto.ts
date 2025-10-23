import { ApiProperty } from '@nestjs/swagger';
import { CompanyDto } from '../company/company.dto';

export class CreateSectorDto {
  @ApiProperty({ description: 'Sector name' })
  name: string;

  @ApiProperty({ description: 'Sector description' })
  description: string;

  @ApiProperty({ description: 'Lucide icon name', required: false })
  icon?: string;
}

export class UpdateSectorDto {
  @ApiProperty({ description: 'Sector name', required: false })
  name?: string;

  @ApiProperty({ description: 'Sector description', required: false })
  description?: string;

  @ApiProperty({ description: 'Lucide icon name', required: false })
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
