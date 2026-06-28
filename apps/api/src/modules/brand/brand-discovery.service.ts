import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { PappersService } from '../company/pappers.service';
import { Brand, BrandMatchSource, BrandStatus } from './brand.entity';

const ENTREPRISE_SEARCH_API = 'https://recherche-entreprises.api.gouv.fr/search';
const ACTIVE_THRESHOLD = 85;
const PENDING_THRESHOLD = 60;

interface EntrepriseSearchResult {
  siren?: string;
  nom_complet?: string;
  nom_raison_sociale?: string;
  denomination?: string;
  nom?: string;
  etat_administratif?: string;
  statut_diffusion?: string;
  score?: number;
  [key: string]: unknown;
}

interface EntrepriseSearchResponse {
  results?: EntrepriseSearchResult[];
}

export type BrandDiscoveryResolution = 'auto_active' | 'auto_pending' | 'needs_user_input' | 'none';

export interface BrandDiscoveryResult {
  resolution: BrandDiscoveryResolution;
  confidence?: number;
  brand?: Brand;
  matchedQuery?: string;
  message?: string;
}

@Injectable()
export class BrandDiscoveryService {
  private readonly logger = new Logger(BrandDiscoveryService.name);

  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: EntityRepository<Brand>,
    private readonly pappersService: PappersService,
    private readonly em: EntityManager,
  ) {}

  async discoverAndPersistBrand(brandName: string): Promise<BrandDiscoveryResult> {
    const query = brandName.trim();
    if (!query) return { resolution: 'none' };

    const candidates = await this.searchCompanies(query);
    if (candidates.length === 0) {
      return {
        resolution: 'needs_user_input',
        confidence: 0,
        matchedQuery: query,
        message: 'Aucune entreprise candidate trouvée pour cette marque',
      };
    }

    const scored = candidates
      .map((candidate) => ({
        candidate,
        confidence: this.computeConfidence(query, candidate, candidates.length),
      }))
      .sort((a, b) => b.confidence - a.confidence);

    const best = scored[0];
    if (!best) return { resolution: 'none' };

    const validated = await this.pappersService.getCompanyBySiren(best.candidate.siren);
    if (!validated) {
      this.logger.warn(
        `Discovery candidate rejected (Pappers unavailable): ${best.candidate.siren}`,
      );
      return {
        resolution: 'needs_user_input',
        confidence: best.confidence,
        matchedQuery: query,
        message: 'Impossible de valider l’entreprise candidate',
      };
    }

    if (best.confidence < PENDING_THRESHOLD) {
      return {
        resolution: 'needs_user_input',
        confidence: best.confidence,
        matchedQuery: query,
        message: 'Confiance insuffisante pour créer un mapping automatique',
      };
    }

    const status = best.confidence >= ACTIVE_THRESHOLD ? BrandStatus.ACTIVE : BrandStatus.PENDING;

    const existing = await this.brandRepo.findOne({
      name: { $ilike: query },
    });
    if (existing) {
      return {
        resolution: existing.status === BrandStatus.PENDING ? 'auto_pending' : 'auto_active',
        confidence: existing.confidence,
        brand: existing,
        matchedQuery: query,
      };
    }

    const created = this.brandRepo.create({
      name: query,
      siren: best.candidate.siren,
      status,
      confidence: best.confidence,
      matchSource: BrandMatchSource.AUTO_DISCOVERY,
      matchedQuery: query,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.em.persistAndFlush(created);

    return {
      resolution: status === BrandStatus.ACTIVE ? 'auto_active' : 'auto_pending',
      confidence: best.confidence,
      brand: created,
      matchedQuery: query,
    };
  }

  private async searchCompanies(
    query: string,
  ): Promise<Array<{ siren: string; name: string; raw: EntrepriseSearchResult }>> {
    const url = new URL(ENTREPRISE_SEARCH_API);
    url.searchParams.set('q', query);
    url.searchParams.set('per_page', '5');
    url.searchParams.set('page', '1');

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        this.logger.warn(`Entreprise search API error ${response.status} for query "${query}"`);
        return [];
      }

      const data = (await response.json()) as EntrepriseSearchResponse;
      const results = data.results ?? [];

      return results
        .map((result) => {
          const siren = typeof result.siren === 'string' ? result.siren.trim() : '';
          const name = this.extractCompanyName(result);
          if (!/^\d{9}$/.test(siren) || !name) return null;
          return { siren, name, raw: result };
        })
        .filter(
          (row): row is { siren: string; name: string; raw: EntrepriseSearchResult } =>
            row !== null,
        );
    } catch (error) {
      this.logger.error(`Entreprise search failed for query "${query}"`, error);
      return [];
    }
  }

  private extractCompanyName(result: EntrepriseSearchResult): string {
    const value =
      (typeof result.nom_complet === 'string' && result.nom_complet) ||
      (typeof result.nom_raison_sociale === 'string' && result.nom_raison_sociale) ||
      (typeof result.denomination === 'string' && result.denomination) ||
      (typeof result.nom === 'string' && result.nom) ||
      '';

    return value.trim();
  }

  private computeConfidence(
    brandName: string,
    candidate: { name: string; raw: EntrepriseSearchResult },
    candidateCount: number,
  ): number {
    const normalizedBrand = this.normalize(brandName);
    const normalizedName = this.normalize(candidate.name);

    let score = Math.round(this.trigramDice(normalizedBrand, normalizedName) * 100);

    if (normalizedBrand === normalizedName) score += 20;
    if (normalizedName.includes(normalizedBrand) || normalizedBrand.includes(normalizedName)) {
      score += 10;
    }

    const adminState = String(candidate.raw.etat_administratif ?? '').toUpperCase();
    if (adminState === 'A' || adminState === 'ACTIVE') score += 10;

    if (candidateCount > 1) {
      score -= Math.min(15, (candidateCount - 1) * 3);
    }

    if (typeof candidate.raw.score === 'number') {
      score += Math.min(10, Math.round(candidate.raw.score * 10));
    }

    return Math.max(0, Math.min(100, score));
  }

  private trigramDice(a: string, b: string): number {
    if (!a || !b) return 0;
    if (a === b) return 1;

    const aSet = this.buildTrigrams(a);
    const bSet = this.buildTrigrams(b);
    if (aSet.size === 0 || bSet.size === 0) return 0;

    let intersection = 0;
    for (const token of aSet) {
      if (bSet.has(token)) intersection++;
    }
    return (2 * intersection) / (aSet.size + bSet.size);
  }

  private buildTrigrams(input: string): Set<string> {
    const padded = `  ${input}  `;
    const set = new Set<string>();
    for (let i = 0; i < padded.length - 2; i++) {
      set.add(padded.slice(i, i + 3));
    }
    return set;
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/\s+/g, ' ');
  }
}
