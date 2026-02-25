import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { Executive, Shareholder } from '../company.entity';

export class ExecutiveDto {
  @ApiProperty({ example: 'Mark Schneider' })
  name!: string;

  @ApiProperty({ example: 'Directeur Général' })
  role!: string;

  @ApiPropertyOptional({ example: '2017-01-01' })
  startDate?: string;
}

export class ShareholderDto {
  @ApiProperty({ example: 'Nestlé SA' })
  name!: string;

  @ApiProperty({ example: 100 })
  percentage!: number;

  @ApiProperty({ enum: ['individual', 'corporate'], example: 'corporate' })
  type!: 'individual' | 'corporate';
}

export class CompanyDto {
  @ApiProperty({ example: '552108011' })
  siren!: string;

  @ApiProperty({ example: 'Nestlé France SA' })
  legalName!: string;

  @ApiPropertyOptional({ example: 'https://logo.example.com/nestle.png' })
  logoUrl?: string;

  @ApiProperty({ type: [ExecutiveDto] })
  executives!: ExecutiveDto[];

  @ApiProperty({ type: [ShareholderDto] })
  shareholders!: ShareholderDto[];

  @ApiProperty({ example: '2026-01-15T10:00:00.000Z' })
  lastFetchedAt!: string;
}

// Internal type returned by PappersService
export interface CompanyData {
  siren: string;
  legalName: string;
  logoUrl?: string;
  executives: Executive[];
  shareholders: Shareholder[];
  rawData: Record<string, unknown>;
}
