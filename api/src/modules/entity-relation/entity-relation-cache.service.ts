import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Fund } from '../fund/fund.entity';
import { Personality } from '../personality/personality.entity';
import { Sector } from '../sector/sector.entity';
import { EntityType, RelationType } from './entity-relation.entity';
import { EntityRelationService } from './entity-relation.service';

export interface CompanyRelationDetail {
  companyId: string;
  relationType: RelationType;
  notes?: string;
}

export interface CompanyRelationDetailWithVia extends CompanyRelationDetail {
  via?: 'direct' | 'fund';
  viaEntityId?: string;
}

@Injectable()
export class EntityRelationCacheService {
  private cache = new Map<string, any>();
  private cacheTTL = 5 * 60 * 1000; // 5 minutes

  constructor(
    private readonly entityRelationService: EntityRelationService,
    private readonly em: EntityManager,
  ) {}

  private getCacheKey(
    sourceType: EntityType,
    sourceId: string,
    targetType: EntityType,
    relationType: RelationType,
  ): string {
    return `${sourceType}:${sourceId}:${targetType}:${relationType}`;
  }

  private getCacheEntry(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private setCacheEntry(key: string, data: any) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.cacheTTL,
    });
  }

  async getFundsByCompany(companyId: string): Promise<Fund[]> {
    const cacheKey = this.getCacheKey(
      EntityType.COMPANY,
      companyId,
      EntityType.FUND,
      RelationType.OWNS,
    );

    let funds = this.getCacheEntry(cacheKey);
    if (funds !== null) return funds;

    // Find funds that own this company
    const relations = await this.entityRelationService.findByTarget(
      EntityType.COMPANY,
      companyId,
    );

    const fundRelations = relations.filter(
      (rel) =>
        rel.sourceType === EntityType.FUND &&
        rel.relationType === RelationType.OWNS,
    );

    if (fundRelations.length > 0) {
      const fundIds = fundRelations.map((rel) => rel.sourceId);
      funds = await this.em.find(Fund, { id: { $in: fundIds } });
    } else {
      funds = [];
    }

    this.setCacheEntry(cacheKey, funds);
    return funds;
  }

  // Keep the old method for backward compatibility
  async getFundByCompany(companyId: string): Promise<Fund | null> {
    const funds = await this.getFundsByCompany(companyId);
    return funds.length > 0 ? funds[0] : null;
  }

  async getSectorsByCompany(companyId: string): Promise<Sector[]> {
    const cacheKey = this.getCacheKey(
      EntityType.COMPANY,
      companyId,
      EntityType.SECTOR,
      RelationType.OPERATES_IN,
    );

    let sectors = this.getCacheEntry(cacheKey);
    if (sectors !== null) return sectors;

    // Find sectors where this company operates
    const relations = await this.entityRelationService.findBySource(
      EntityType.COMPANY,
      companyId,
    );

    const sectorRelations = relations.filter(
      (rel) =>
        rel.targetType === EntityType.SECTOR &&
        rel.relationType === RelationType.OPERATES_IN,
    );

    if (sectorRelations.length > 0) {
      const sectorIds = sectorRelations.map((rel) => rel.targetId);
      sectors = await this.em.find(Sector, { id: { $in: sectorIds } });
    } else {
      sectors = [];
    }

    this.setCacheEntry(cacheKey, sectors);
    return sectors;
  }

  // Keep the old method for backward compatibility
  async getSectorByCompany(companyId: string): Promise<Sector | null> {
    const sectors = await this.getSectorsByCompany(companyId);
    return sectors.length > 0 ? sectors[0] : null;
  }

  async getPersonalitiesByCompany(companyId: string): Promise<Personality[]> {
    const cacheKey = `company:${companyId}:personalities:all`;

    let personalities = this.getCacheEntry(cacheKey);
    if (personalities !== null) return personalities;

    // Find personalities that manage/control this company
    const relations = await this.entityRelationService.findByTarget(
      EntityType.COMPANY,
      companyId,
    );

    const personalityRelations = relations.filter(
      (rel) =>
        rel.sourceType === EntityType.PERSONALITY &&
        (rel.relationType === RelationType.MANAGES ||
          rel.relationType === RelationType.CONTROLS ||
          rel.relationType === RelationType.OWNS ||
          rel.relationType === RelationType.INVESTS_IN ||
          rel.relationType === RelationType.FOUNDED),
    );

    if (personalityRelations.length > 0) {
      const personalityIds = personalityRelations.map((rel) => rel.sourceId);
      personalities = await this.em.find(Personality, {
        id: { $in: personalityIds },
      });
    } else {
      personalities = [];
    }

    this.setCacheEntry(cacheKey, personalities);
    return personalities;
  }

  invalidateCompanyCache(companyId: string) {
    const keysToDelete = Array.from(this.cache.keys()).filter((key) =>
      key.includes(companyId),
    );
    keysToDelete.forEach((key) => this.cache.delete(key));
  }

  async getRelatedPersonalities(personalityId: string): Promise<Personality[]> {
    const cacheKey = this.getCacheKey(
      EntityType.PERSONALITY,
      personalityId,
      EntityType.PERSONALITY,
      RelationType.IS_FRIEND_OF, // Use a generic key for all personality relations
    );

    let relatedPersonalities = this.getCacheEntry(cacheKey);
    if (relatedPersonalities !== null) return relatedPersonalities;

    // Find all personality-to-personality relations
    const relations = await this.entityRelationService.findBySource(
      EntityType.PERSONALITY,
      personalityId,
    );

    const personalityRelations = relations.filter(
      (rel) =>
        rel.targetType === EntityType.PERSONALITY &&
        (rel.relationType === RelationType.IS_FRIEND_OF ||
          rel.relationType === RelationType.IS_FAMILY_OF ||
          rel.relationType === RelationType.IS_COLLEAGUE_OF ||
          rel.relationType === RelationType.IS_MENTOR_OF ||
          rel.relationType === RelationType.IS_PARTNER_OF ||
          rel.relationType === RelationType.IS_RIVAL_OF),
    );

    if (personalityRelations.length > 0) {
      const personalityIds = personalityRelations.map((rel) => rel.targetId);
      relatedPersonalities = await this.em.find(Personality, {
        id: { $in: personalityIds },
      });
    } else {
      relatedPersonalities = [];
    }

    this.setCacheEntry(cacheKey, relatedPersonalities);
    return relatedPersonalities;
  }

  async getCompanyIdsByFund(fundId: string): Promise<string[]> {
    const details = await this.getCompanyRelationsByFund(fundId);
    return details.map((d) => d.companyId);
  }

  async getCompanyRelationsByFund(
    fundId: string,
  ): Promise<CompanyRelationDetail[]> {
    const cacheKey = `fund:${fundId}:companyRelations`;

    let details = this.getCacheEntry(cacheKey);
    if (details !== null) return details;

    const relations = await this.entityRelationService.findBySource(
      EntityType.FUND,
      fundId,
    );

    const companyRelations = relations.filter(
      (rel) =>
        rel.targetType === EntityType.COMPANY &&
        (rel.relationType === RelationType.OWNS ||
          rel.relationType === RelationType.INVESTS_IN ||
          rel.relationType === RelationType.SUPPORTS ||
          rel.relationType === RelationType.PLATEFORME_ROLL_UP ||
          rel.relationType === RelationType.STUDIO),
    );

    details = companyRelations.map((rel) => ({
      companyId: rel.targetId,
      relationType: rel.relationType,
      notes: rel.notes,
    }));

    this.setCacheEntry(cacheKey, details);
    return details;
  }

  async getCompanyIdsBySector(sectorId: string): Promise<string[]> {
    const details = await this.getCompanyRelationsBySector(sectorId);
    return details.map((d) => d.companyId);
  }

  async getCompanyRelationsBySector(
    sectorId: string,
  ): Promise<CompanyRelationDetail[]> {
    const cacheKey = `sector:${sectorId}:companyRelations`;

    let details = this.getCacheEntry(cacheKey);
    if (details !== null) return details;

    const relations = await this.entityRelationService.findByTarget(
      EntityType.SECTOR,
      sectorId,
    );

    const companyRelations = relations.filter(
      (rel) =>
        rel.sourceType === EntityType.COMPANY &&
        (rel.relationType === RelationType.OPERATES_IN ||
          rel.relationType === RelationType.BELONGS_TO),
    );

    details = companyRelations.map((rel) => ({
      companyId: rel.sourceId,
      relationType: rel.relationType,
      notes: rel.notes,
    }));

    this.setCacheEntry(cacheKey, details);
    return details;
  }

  async getCompanyIdsByPersonality(personalityId: string): Promise<string[]> {
    const details = await this.getCompanyRelationsByPersonality(personalityId);
    return [...new Set(details.map((d) => d.companyId))];
  }

  async getCompanyRelationsByPersonality(
    personalityId: string,
  ): Promise<CompanyRelationDetailWithVia[]> {
    const cacheKey = `personality:${personalityId}:companyRelations`;

    let details = this.getCacheEntry(cacheKey);
    if (details !== null) return details;

    const directRelations = await this.entityRelationService.findBySource(
      EntityType.PERSONALITY,
      personalityId,
    );

    const directCompanyDetails: CompanyRelationDetailWithVia[] =
      directRelations
        .filter(
          (rel) =>
            rel.targetType === EntityType.COMPANY &&
            (rel.relationType === RelationType.MANAGES ||
              rel.relationType === RelationType.CONTROLS ||
              rel.relationType === RelationType.OWNS ||
              rel.relationType === RelationType.INVESTS_IN ||
              rel.relationType === RelationType.FOUNDED),
        )
        .map((rel) => ({
          companyId: rel.targetId,
          relationType: rel.relationType,
          notes: rel.notes,
          via: 'direct' as const,
        }));

    const fundRelations = directRelations.filter(
      (rel) =>
        rel.targetType === EntityType.FUND &&
        (rel.relationType === RelationType.FOUNDED ||
          rel.relationType === RelationType.MANAGES ||
          rel.relationType === RelationType.CONTROLS ||
          rel.relationType === RelationType.OWNS),
    );

    const indirectCompanyDetails: CompanyRelationDetailWithVia[] = [];
    for (const fundRel of fundRelations) {
      const companiesFromFund =
        await this.getCompanyRelationsByFund(fundRel.targetId);
      indirectCompanyDetails.push(
        ...companiesFromFund.map((c) => ({
          ...c,
          via: 'fund' as const,
          viaEntityId: fundRel.targetId,
        })),
      );
    }

    details = [...directCompanyDetails, ...indirectCompanyDetails];

    this.setCacheEntry(cacheKey, details);
    return details;
  }

  async getFundsByPersonality(personalityId: string): Promise<Fund[]> {
    const cacheKey = `personality:${personalityId}:funds`;

    let funds = this.getCacheEntry(cacheKey);
    if (funds !== null) return funds;

    const relations = await this.entityRelationService.findBySource(
      EntityType.PERSONALITY,
      personalityId,
    );

    const fundRelations = relations.filter(
      (rel) =>
        rel.targetType === EntityType.FUND &&
        (rel.relationType === RelationType.FOUNDED ||
          rel.relationType === RelationType.MANAGES ||
          rel.relationType === RelationType.CONTROLS ||
          rel.relationType === RelationType.OWNS),
    );

    if (fundRelations.length > 0) {
      const fundIds = fundRelations.map((rel) => rel.targetId);
      funds = await this.em.find(Fund, { id: { $in: fundIds } });
    } else {
      funds = [];
    }

    this.setCacheEntry(cacheKey, funds);
    return funds;
  }

  async getSectorsByPersonality(personalityId: string): Promise<Sector[]> {
    const cacheKey = `personality:${personalityId}:sectors`;

    let sectors = this.getCacheEntry(cacheKey);
    if (sectors !== null) return sectors;

    const companyIds = await this.getCompanyIdsByPersonality(personalityId);
    if (companyIds.length === 0) {
      this.setCacheEntry(cacheKey, []);
      return [];
    }

    const sectorIds = new Set<string>();
    for (const companyId of companyIds) {
      const companySectors = await this.getSectorsByCompany(companyId);
      companySectors.forEach((sector) => sectorIds.add(sector.id));
    }

    if (sectorIds.size === 0) {
      this.setCacheEntry(cacheKey, []);
      return [];
    }

    sectors = await this.em.find(Sector, { id: { $in: Array.from(sectorIds) } });
    this.setCacheEntry(cacheKey, sectors);
    return sectors;
  }

  clearCache() {
    this.cache.clear();
  }
}
