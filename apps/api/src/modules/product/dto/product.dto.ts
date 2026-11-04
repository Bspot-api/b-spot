import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductSource } from '../product.entity';

export class ProductDto {
  @ApiProperty({ example: '3017620422003' })
  barcode!: string;

  @ApiProperty({ example: 'Nutella' })
  name!: string;

  @ApiPropertyOptional({ example: 'Spreads' })
  category?: string;

  @ApiPropertyOptional({ example: 'https://images.openfoodfacts.org/...' })
  imageUrl?: string;

  @ApiProperty({ enum: ProductSource, example: ProductSource.OPEN_FOOD_FACTS })
  source!: ProductSource;

  @ApiPropertyOptional({ example: 'Ferrero' })
  brandName?: string;
}
