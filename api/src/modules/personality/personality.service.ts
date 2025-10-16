import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Company } from '../company/company.entity';
import { EntityRelationCacheService } from '../entity-relation/entity-relation-cache.service';
import {
  EntityType,
  RelationType,
} from '../entity-relation/entity-relation.entity';
import { EntityRelationService } from '../entity-relation/entity-relation.service';
import { PersonalityRelationService } from './personality-relation.service';
import { Personality } from './personality.entity';

@Injectable()
export class PersonalityService {
  constructor(
    private readonly em: EntityManager,
    private readonly entityRelationService: EntityRelationService,
    private readonly entityRelationCacheService: EntityRelationCacheService,
    private readonly personalityRelationService: PersonalityRelationService,
  ) {}

  async create(data: Partial<Personality>): Promise<Personality> {
    const personality = this.em.create(Personality, {
      ...data,
      published: false,
    });
    await this.em.persistAndFlush(personality);
    return personality;
  }

  async findAll(): Promise<Personality[]> {
    const personalities = await this.em.find(Personality, {});
    return this.populateMultipleRelations(personalities);
  }

  private async populateRelations(
    personality: Personality,
  ): Promise<Personality> {
    const relatedPersonalities =
      await this.personalityRelationService.getRelatedPersonalitiesBidirectional(
        personality.id,
      );

    // Create a plain object with the relations for proper serialization
    const personalityWithRelations = {
      ...personality,
      relatedPersonalities: relatedPersonalities.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        published: p.published,
        createdAt: p.createdAt,
      })),
    };

    return personalityWithRelations as Personality;
  }

  private async populateMultipleRelations(
    personalities: Personality[],
  ): Promise<Personality[]> {
    return Promise.all(
      personalities.map((personality) => this.populateRelations(personality)),
    );
  }

  async findOne(id: string): Promise<Personality | null> {
    const personality = await this.em.findOne(Personality, { id });
    if (!personality) return null;
    return this.populateRelations(personality);
  }

  async findOneWithRelations(id: string): Promise<any | null> {
    const personality = await this.findOne(id);
    if (!personality) return null;

    const [funds, sectors] = await Promise.all([
      this.entityRelationCacheService.getFundsByPersonality(id),
      this.entityRelationCacheService.getSectorsByPersonality(id),
    ]);

    // Ensure we return a plain object with all properties including id
    return {
      id: personality.id,
      name: personality.name,
      description: personality.description,
      published: personality.published,
      createdAt: personality.createdAt,
      relatedPersonalities: personality.relatedPersonalities || [],
      funds,
      sectors,
    };
  }

  async update(
    id: string,
    data: Partial<Personality>,
  ): Promise<Personality | null> {
    const personality = await this.findOne(id);
    if (!personality) return null;
    Object.assign(personality, { ...data, published: false });
    await this.em.persistAndFlush(personality);
    return personality;
  }

  async remove(id: string): Promise<boolean> {
    const personality = await this.findOne(id);
    if (!personality) return false;
    await this.em.removeAndFlush(personality);
    return true;
  }

  async getCompanies(id: string): Promise<Company[]> {
    const companyIds =
      await this.entityRelationCacheService.getCompanyIdsByPersonality(id);

    if (companyIds.length === 0) return [];

    return this.em.find(Company, { id: { $in: companyIds } }, { orderBy: { name: 'ASC' } });
  }
}
