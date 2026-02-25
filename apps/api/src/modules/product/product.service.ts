import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { EntityManager } from '@mikro-orm/core';
import { Product, ProductSource } from './product.entity';
import { Brand } from '../brand/brand.entity';
import { ProductDto } from './dto/product.dto';

const OFF_API = 'https://world.openfoodfacts.org/api/v2/product';

interface OffProduct {
  product_name?: string;
  brands?: string;
  categories?: string;
  image_url?: string;
  code?: string;
}

interface OffResponse {
  status: number;
  product?: OffProduct;
}

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: EntityRepository<Product>,
    @InjectRepository(Brand)
    private readonly brandRepo: EntityRepository<Brand>,
    private readonly em: EntityManager,
  ) {}

  async fetchFromOpenFoodFacts(barcode: string): Promise<ProductDto | null> {
    try {
      const response = await fetch(`${OFF_API}/${barcode}`);
      if (!response.ok) return null;

      const data = (await response.json()) as OffResponse;
      if (data.status !== 1 || !data.product) return null;

      const p = data.product;
      const rawBrandName = p.brands ? p.brands.split(',')[0].trim() : undefined;

      return {
        barcode,
        name: p.product_name || 'Produit inconnu',
        category: p.categories?.split(',')[0].trim(),
        imageUrl: p.image_url,
        source: ProductSource.OPEN_FOOD_FACTS,
        brandName: rawBrandName,
      };
    } catch (err) {
      this.logger.error(`OFF fetch failed for barcode ${barcode}`, err);
      return null;
    }
  }

  async saveProduct(dto: ProductDto): Promise<Product> {
    const existing = await this.productRepo.findOne({ barcode: dto.barcode });
    if (existing) return existing;

    const brand = dto.brandName
      ? await this.brandRepo.findOne({
          name: { $ilike: dto.brandName },
        })
      : undefined;

    const now = new Date();
    const product = this.productRepo.create({
      barcode: dto.barcode,
      name: dto.name,
      category: dto.category,
      imageUrl: dto.imageUrl,
      source: dto.source,
      brand: brand ?? undefined,
      createdAt: now,
      updatedAt: now,
    });

    await this.em.persistAndFlush(product);
    return product;
  }

  async findByBarcode(barcode: string): Promise<Product | null> {
    return this.productRepo.findOne({ barcode }, { populate: ['brand'] });
  }
}
