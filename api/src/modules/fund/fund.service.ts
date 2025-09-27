import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Fund } from './fund.entity';
import { EntityRelationService } from '../entity-relation/entity-relation.service';
import {
  EntityType,
  RelationType,
} from '../entity-relation/entity-relation.entity';
import { Company } from '../company/company.entity';

@Injectable()
export class FundService {
  constructor(
    private readonly em: EntityManager,
    private readonly entityRelationService: EntityRelationService,
  ) {}

  async create(data: Partial<Fund>): Promise<Fund> {
    const fund = this.em.create(Fund, { ...data, published: false });
    await this.em.persistAndFlush(fund);
    return fund;
  }

  async findAll(): Promise<Fund[]> {
    return this.em.find(Fund, {});
  }

  async findOne(id: string): Promise<Fund | null> {
    return this.em.findOne(Fund, { id });
  }

  async update(id: string, data: Partial<Fund>): Promise<Fund | null> {
    const fund = await this.findOne(id);
    if (!fund) return null;
    Object.assign(fund, { ...data, published: false });
    await this.em.persistAndFlush(fund);
    return fund;
  }

  async remove(id: string): Promise<boolean> {
    const fund = await this.findOne(id);
    if (!fund) return false;
    await this.em.removeAndFlush(fund);
    return true;
  }

  async getCompanies(id: string): Promise<Company[]> {
    // Find companies that are owned by this fund using EntityRelation
    const relations = await this.entityRelationService.findBySource(
      EntityType.FUND,
      id,
    );

    const companyRelations = relations.filter(
      (rel) =>
        rel.targetType === EntityType.COMPANY &&
        rel.relationType === RelationType.OWNS,
    );

    if (companyRelations.length === 0) return [];

    const companyIds = companyRelations.map((rel) => rel.targetId);
    return this.em.find(Company, { id: { $in: companyIds } });
  }
}
