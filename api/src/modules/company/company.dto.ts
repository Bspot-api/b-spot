import { ApiProperty } from '@nestjs/swagger';
import { FundDto } from '../fund/fund.dto';
import { PersonalityDto } from '../personality/personality.dto';
import { SectorDto } from '../sector/sector.dto';

export class CreateCompanyDto {
  @ApiProperty({ description: 'Company name' })
  name: string;

  @ApiProperty({ description: 'Company description' })
  description: string;

  @ApiProperty({ description: 'Company source URL' })
  source: string;

  @ApiProperty({ description: 'Investment fund ID', type: String })
  fund: string;

  @ApiProperty({ description: 'Business sector ID', type: String })
  sector: string;

  @ApiProperty({ description: 'Involved personalities IDs', type: [String] })
  personalities: string[];
}

export class CompanyDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  source: string;

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: () => FundDto })
  fund: FundDto;

  @ApiProperty({ type: () => SectorDto })
  sector: SectorDto;

  @ApiProperty({ type: () => [PersonalityDto] })
  personalities: PersonalityDto[];
}
