import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Sector } from './sector.entity';
import { EntityRelationService } from '../entity-relation/entity-relation.service';
import { EntityType, RelationType } from '../entity-relation/entity-relation.entity';
import { Company } from '../company/company.entity';

@Injectable()
export class SectorService {
  constructor(
    private readonly em: EntityManager,
    private readonly entityRelationService: EntityRelationService,
  ) {}

  async create(data: Partial<Sector>): Promise<Sector> {
    const sector = this.em.create(Sector, { ...data, published: false });
    await this.em.persistAndFlush(sector);
    return sector;
  }

  async findAll(): Promise<Sector[]> {
    return this.em.find(Sector, {});
  }

  async findOne(id: string): Promise<Sector | null> {
    return this.em.findOne(Sector, { id });
  }

  async update(id: string, data: Partial<Sector>): Promise<Sector | null> {
    const sector = await this.findOne(id);
    if (!sector) return null;
    Object.assign(sector, { ...data, published: false });
    await this.em.persistAndFlush(sector);
    return sector;
  }

  async remove(id: string): Promise<boolean> {
    const sector = await this.findOne(id);
    if (!sector) return false;
    await this.em.removeAndFlush(sector);
    return true;
  }

  async getCompanies(id: string): Promise<Company[]> {
    // Find companies that operate in this sector using EntityRelation
    const relations = await this.entityRelationService.findByTarget(
      EntityType.SECTOR,
      id,
    );

    const companyRelations = relations.filter(
      (rel) =>
        rel.sourceType === EntityType.COMPANY &&
        rel.relationType === RelationType.OPERATES_IN,
    );

    if (companyRelations.length === 0) return [];

    const companyIds = companyRelations.map((rel) => rel.sourceId);
    return this.em.find(Company, { id: { $in: companyIds } });
  }
}
