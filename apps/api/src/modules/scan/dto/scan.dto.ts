import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import type { ProductDto } from '../../product/dto/product.dto';
import type { CompanyDto } from '../../company/dto/company.dto';

export class ScanRequestDto {
  @ApiProperty({ example: '3017620422003', description: 'EAN-8 or EAN-13 barcode' })
  @IsString()
  @Length(8, 14)
  barcode!: string;
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
}
