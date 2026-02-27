import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length, MaxLength, MinLength } from 'class-validator';
import type { ProductDto } from '../../product/dto/product.dto';
import type { CompanyDto } from '../../company/dto/company.dto';
import { BrandStatus } from '../../brand/brand.entity';

export class ScanRequestDto {
  @ApiProperty({ example: '3017620422003', description: 'EAN-8 or EAN-13 barcode' })
  @IsString()
  @Length(8, 14)
  barcode!: string;
}

export class BrandScanRequestDto {
  @ApiProperty({ example: 'nutella', description: 'Brand name to search' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  brandName!: string;
}

export class BrandScanResultDto {
  @ApiPropertyOptional()
  company?: CompanyDto;

  @ApiProperty({ enum: ['fresh', 'cached', 'unavailable'], example: 'fresh' })
  dataFreshness!: 'fresh' | 'cached' | 'unavailable';

  @ApiPropertyOptional()
  message?: string;

  @ApiPropertyOptional({
    enum: ['existing', 'auto_active', 'auto_pending', 'needs_user_input'],
  })
  brandResolution?: 'existing' | 'auto_active' | 'auto_pending' | 'needs_user_input';

  @ApiPropertyOptional({ enum: ['active', 'pending', 'deleted'] })
  brandStatus?: BrandStatus;

  @ApiPropertyOptional({ example: 87 })
  discoveryConfidence?: number;

  @ApiPropertyOptional({ enum: ['submit_brand_suggestion'] })
  userActionRequired?: 'submit_brand_suggestion';

  @ApiPropertyOptional({ example: 12 })
  brandSuggestionId?: number;
}

export class ScanResultDto {
  @ApiProperty()
  product!: ProductDto;

  @ApiPropertyOptional()
  company?: CompanyDto;

  @ApiProperty({ enum: ['fresh', 'cached', 'unavailable'], example: 'fresh' })
  dataFreshness!: 'fresh' | 'cached' | 'unavailable';

  @ApiPropertyOptional({
    example: 'Marque non référencée dans notre base de données',
    description: 'Human-readable status when company data is unavailable',
  })
  message?: string;

  @ApiPropertyOptional({
    enum: ['existing', 'auto_active', 'auto_pending', 'needs_user_input'],
    description: 'How the brand/company mapping was resolved during scan',
  })
  brandResolution?: 'existing' | 'auto_active' | 'auto_pending' | 'needs_user_input';

  @ApiPropertyOptional({
    enum: ['active', 'pending', 'deleted'],
    description: 'Brand mapping status when a brand match exists',
  })
  brandStatus?: BrandStatus;

  @ApiPropertyOptional({
    example: 87,
    description: 'Confidence score (0-100) for auto brand discovery',
  })
  discoveryConfidence?: number;

  @ApiPropertyOptional({
    enum: ['submit_brand_suggestion'],
    description: 'Next action suggested to the user',
  })
  userActionRequired?: 'submit_brand_suggestion';

  @ApiPropertyOptional({
    example: 12,
    description: 'ID of the created brand suggestion when user input is needed',
  })
  brandSuggestionId?: number;
}
