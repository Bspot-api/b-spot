import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Brand } from './brand.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: EntityRepository<Brand>,
  ) {}

  async findBrandByName(name: string): Promise<Brand | null> {
    // Exact match first (case-insensitive)
    const exact = await this.brandRepo.findOne({ name: { $ilike: name } });
    if (exact) return exact;

    // Partial match: check if any known brand name is contained in the input
    // (handles "Nutella" mapping to a brand named "Ferrero" via the seed data)
    const all = await this.brandRepo.findAll();
    const normalized = name.toLowerCase().trim();

    return (
      all.find(
        (b) =>
          normalized.includes(b.name.toLowerCase()) ||
          b.name.toLowerCase().includes(normalized),
      ) ?? null
    );
  }
}
