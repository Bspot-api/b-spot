import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';

@ApiTags('products')
@Controller('api/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':barcode')
  @ApiOperation({ summary: 'Fetch product info by barcode (debug endpoint)' })
  @ApiParam({ name: 'barcode', example: '3017620422003' })
  @ApiResponse({ status: 200, type: ProductDto })
  @ApiResponse({ status: 404, description: 'Produit non référencé' })
  async getProduct(@Param('barcode') barcode: string): Promise<ProductDto> {
    const product = await this.productService.fetchFromOpenFoodFacts(barcode);
    if (!product) throw new NotFoundException('Produit non référencé');
    return product;
  }
}
