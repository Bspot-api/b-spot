import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BrandSuggestionStatus } from '../brand-suggestion.entity';

export class BrandSuggestionDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  brandName!: string;

  @ApiPropertyOptional()
  barcode?: string;

  @ApiPropertyOptional()
  productName?: string;

  @ApiPropertyOptional()
  productImageUrl?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  offBrandRaw?: string;

  @ApiProperty({ enum: BrandSuggestionStatus })
  status!: BrandSuggestionStatus;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
