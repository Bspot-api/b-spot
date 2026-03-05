import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { EntityManager } from '@mikro-orm/core';
import { Product, ProductSource } from './product.entity';
import { Brand } from '../brand/brand.entity';
import { ProductDto } from './dto/product.dto';

const OFF_API = 'https://world.openfoodfacts.org/api/v2/product';
const OBF_API = 'https://world.openbeautyfacts.org/api/v2/product';

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

type FactsFetchOutcome = 'found' | 'not_found' | 'technical_error';

interface FactsFetchResult {
  outcome: FactsFetchOutcome;
  product: ProductDto | null;
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

  async fetchProduct(barcode: string): Promise<ProductDto | null> {
    const offResult = await this.fetchFromFactsApiWithOutcome(
      barcode,
      ProductSource.OPEN_FOOD_FACTS,
    );

    if (offResult.product) return offResult.product;
    if (offResult.outcome === 'not_found') {
      this.logger.log(`OFF product not found for barcode ${barcode}; trying OBF fallback`);
      return this.fetchFromOpenBeautyFacts(barcode);
    }

    this.logger.warn(
      `OFF technical failure for barcode ${barcode}; skipping OBF due to fallback policy`,
    );
    return null;
  }

  async fetchFromFactsApi(
    barcode: string,
    source: ProductSource,
  ): Promise<ProductDto | null> {
    const result = await this.fetchFromFactsApiWithOutcome(barcode, source);
    return result.product;
  }

  async fetchFromOpenFoodFacts(barcode: string): Promise<ProductDto | null> {
    return this.fetchFromFactsApi(barcode, ProductSource.OPEN_FOOD_FACTS);
  }

  async fetchFromOpenBeautyFacts(barcode: string): Promise<ProductDto | null> {
    return this.fetchFromFactsApi(barcode, ProductSource.OPEN_BEAUTY_FACTS);
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

  private async fetchFromFactsApiWithOutcome(
    barcode: string,
    source: ProductSource,
  ): Promise<FactsFetchResult> {
    const endpoint = source === ProductSource.OPEN_BEAUTY_FACTS ? OBF_API : OFF_API;
    const sourceLabel = source === ProductSource.OPEN_BEAUTY_FACTS ? 'OBF' : 'OFF';

    try {
      const response = await fetch(`${endpoint}/${barcode}`);
      if (!response.ok) {
        this.logger.warn(
          `${sourceLabel} API returned ${response.status} for barcode ${barcode}`,
        );
        return { outcome: 'technical_error', product: null };
      }

      const data = (await response.json()) as OffResponse;
      if (data.status !== 1 || !data.product) {
        return { outcome: 'not_found', product: null };
      }

      return {
        outcome: 'found',
        product: this.parseFactsProduct(barcode, source, data.product),
      };
    } catch (err) {
      this.logger.error(`${sourceLabel} fetch failed for barcode ${barcode}`, err);
      return { outcome: 'technical_error', product: null };
    }
  }

  private parseFactsProduct(
    barcode: string,
    source: ProductSource,
    product: OffProduct,
  ): ProductDto {
    const rawBrandName = product.brands ? product.brands.split(',')[0].trim() : undefined;

    return {
      barcode,
      name: product.product_name || 'Produit inconnu',
      category: product.categories?.split(',')[0].trim(),
      imageUrl: product.image_url,
      source,
      brandName: rawBrandName,
    };
  }
}
