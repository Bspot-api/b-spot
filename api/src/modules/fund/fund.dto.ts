import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { CompanyDto } from '../company/company.dto';

export class CreateFundDto {
  @ApiProperty({ description: 'Fund name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Fund description' })
  @IsString()
  description: string;
}

export class UpdateFundDto {
  @ApiProperty({ description: 'Fund name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Fund description', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class FundDto {
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
