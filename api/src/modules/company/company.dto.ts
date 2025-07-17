import { ApiProperty } from '@nestjs/swagger';
import { FundDto } from '../fund/fund.dto';
import { PersonalityDto } from '../personality/personality.dto';
import { SectorDto } from '../sector/sector.dto';

export class CompanyDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

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
