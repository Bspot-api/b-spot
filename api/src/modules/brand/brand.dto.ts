import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsArray, IsUrl } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ description: 'Brand name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Brand description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Brand official website URL', required: false })
  @IsOptional()
  @IsUrl()
  source?: string;

  @ApiProperty({ description: 'Parent company ID', required: false })
  @IsOptional()
  @IsUUID()
  company?: string;

  @ApiProperty({ description: 'Controlling fund ID', required: false })
  @IsOptional()
  @IsUUID()
  fund?: string;

  @ApiProperty({ description: 'Primary sector ID', required: false })
  @IsOptional()
  @IsUUID()
  sector?: string;

  @ApiProperty({
    description: 'Associated personalities IDs',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  personalities?: string[];
}

export class UpdateBrandDto {
  @ApiProperty({ description: 'Brand name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Brand description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Brand official website URL', required: false })
  @IsOptional()
  @IsUrl()
  source?: string;

  @ApiProperty({ description: 'Parent company ID', required: false })
  @IsOptional()
  @IsUUID()
  company?: string;

  @ApiProperty({ description: 'Controlling fund ID', required: false })
  @IsOptional()
  @IsUUID()
  fund?: string;

  @ApiProperty({ description: 'Primary sector ID', required: false })
  @IsOptional()
  @IsUUID()
  sector?: string;

  @ApiProperty({
    description: 'Associated personalities IDs',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  personalities?: string[];
}
