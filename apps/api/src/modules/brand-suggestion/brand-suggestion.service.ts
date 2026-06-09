import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { ProductDto } from '../product/dto/product.dto';
import { BrandSuggestion, BrandSuggestionStatus } from './brand-suggestion.entity';
import { CreateBrandSuggestionDto } from './dto/create-brand-suggestion.dto';
import { BrandSuggestionDto } from './dto/brand-suggestion.dto';

@Injectable()
export class BrandSuggestionService {
  constructor(
    @InjectRepository(BrandSuggestion)
    private readonly suggestionRepo: EntityRepository<BrandSuggestion>,
    private readonly em: EntityManager,
  ) {}

  async create(dto: CreateBrandSuggestionDto): Promise<BrandSuggestion> {
    const suggestion = this.suggestionRepo.create({
      brandName: dto.brandName.trim(),
      barcode: dto.barcode?.trim(),
      productName: dto.productName?.trim(),
      productImageUrl: dto.productImageUrl?.trim(),
      notes: dto.notes?.trim(),
      offBrandRaw: dto.offBrandRaw?.trim(),
      status: BrandSuggestionStatus.NEW,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.em.persistAndFlush(suggestion);
    return suggestion;
  }

  async createFromScan(product: ProductDto): Promise<BrandSuggestion | null> {
    const brandName = product.brandName?.trim();
    if (!brandName) return null;

    const existing = await this.suggestionRepo.findOne(
      {
        brandName: { $ilike: brandName },
        barcode: product.barcode,
        status: BrandSuggestionStatus.NEW,
      },
      { orderBy: { createdAt: 'DESC' } },
    );
    if (existing) return existing;

    return this.create({
      brandName,
      barcode: product.barcode,
      productName: product.name,
      productImageUrl: product.imageUrl,
      offBrandRaw: product.brandName,
    });
  }

  async findByStatus(
    status?: BrandSuggestionStatus,
  ): Promise<{ items: BrandSuggestion[]; total: number }> {
    const items = await this.suggestionRepo.find(
      status ? { status } : {},
      { orderBy: { createdAt: 'DESC' }, limit: 50 },
    );
    return { items, total: items.length };
  }

  async updateStatus(id: number, status: BrandSuggestionStatus): Promise<BrandSuggestion> {
    const suggestion = await this.suggestionRepo.findOne({ id });
    if (!suggestion) throw new Error(`Suggestion ${id} not found`);
    suggestion.status = status;
    await this.em.persistAndFlush(suggestion);
    return suggestion;
  }

  toDto(entity: BrandSuggestion): BrandSuggestionDto {
    return {
      id: entity.id,
      brandName: entity.brandName,
      barcode: entity.barcode,
      productName: entity.productName,
      productImageUrl: entity.productImageUrl,
      notes: entity.notes,
      offBrandRaw: entity.offBrandRaw,
      status: entity.status,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }
}
