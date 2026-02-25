import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Brand } from './brand.entity';

interface BrandFuzzyRow {
  id: number;
  name: string;
  siren: string;
  created_at: Date;
  updated_at: Date;
  score: number;
}

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: EntityRepository<Brand>,
    private readonly em: EntityManager,
  ) {}

  async findBrandByName(name: string): Promise<Brand | null> {
    const input = name.trim();
    if (!input) return null;

    // Exact match first (case-insensitive)
    const exact = await this.brandRepo.findOne({ name: { $ilike: input } });
    if (exact) return exact;

    // Normalize accents/punctuation/spacing before fallback matching.
    const all = await this.brandRepo.findAll();
    const normalizedInput = this.normalizeBrandText(input);

    const normalizedExact = all.find(
      (b) => this.normalizeBrandText(b.name) === normalizedInput,
    );
    if (normalizedExact) return normalizedExact;

    // Partial match on normalized labels (handles separators/accents differences).
    const partial = all.find((b) => {
      const normalizedBrand = this.normalizeBrandText(b.name);
      return (
        normalizedInput.includes(normalizedBrand) ||
        normalizedBrand.includes(normalizedInput)
      );
    });
    if (partial) return partial;

    // Fuzzy fallback (PostgreSQL pg_trgm): typo-tolerant matching, e.g. "nuutela" -> "Nutella".
    const rows = await this.em.getConnection().execute<BrandFuzzyRow[]>(
      `
        SELECT
          b.id,
          b.name,
          b.siren,
          b.created_at,
          b.updated_at,
          similarity(lower(b.name), lower(?)) AS score
        FROM "brand" b
        WHERE lower(b.name) % lower(?)
        ORDER BY score DESC, char_length(b.name) ASC
        LIMIT 1
      `,
      [input, input],
    );

    const best = rows[0];
    if (!best) return null;

    // Re-hydrate the entity to keep return type and ORM behavior consistent.
    return this.brandRepo.findOne({ id: best.id });
  }

  private normalizeBrandText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/\s+/g, ' ');
  }
}
