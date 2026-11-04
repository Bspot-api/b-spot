import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreateBrandSuggestionDto {
  @ApiProperty({ example: 'Cristaline' })
  @IsString()
  @MaxLength(255)
  brandName!: string;

  @ApiPropertyOptional({ example: '3274080005003' })
  @IsOptional()
  @IsString()
  @Length(8, 14)
  barcode?: string;

  @ApiPropertyOptional({ example: 'Eau minérale Cristaline' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  productName?: string;

  @ApiPropertyOptional({ example: 'https://images.openfoodfacts.org/...' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  productImageUrl?: string;

  @ApiPropertyOptional({ example: 'Trouvée en supermarché, eau plate' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;

  @ApiPropertyOptional({ example: 'Cristaline,Alma' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  offBrandRaw?: string;
}
