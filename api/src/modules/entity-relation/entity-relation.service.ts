import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import {
  EntityRelation,
  EntityType,
  RelationType,
} from './entity-relation.entity';

@Injectable()
export class EntityRelationService {
  constructor(
    @InjectRepository(EntityRelation)
    private readonly entityRelationRepository: EntityRepository<EntityRelation>,
    private readonly em: EntityManager,
  ) {}

  async findAll(): Promise<EntityRelation[]> {
    return this.entityRelationRepository.findAll();
  }

  async findOne(id: string): Promise<EntityRelation | null> {
    return this.entityRelationRepository.findOne({ id });
  }

  async create(relationData: Partial<EntityRelation>): Promise<EntityRelation> {
    const relation = this.entityRelationRepository.create(relationData);
    await this.em.persistAndFlush(relation);
    return relation;
  }

  async update(
    id: string,
    relationData: Partial<EntityRelation>,
  ): Promise<EntityRelation> {
    const relation = await this.findOne(id);
    if (!relation) {
      throw new Error('Entity relation not found');
    }

    this.entityRelationRepository.assign(relation, relationData);
    await this.em.flush();
    return relation;
  }

  async delete(id: string): Promise<void> {
    const relation = await this.findOne(id);
    if (!relation) {
      throw new Error('Entity relation not found');
    }

    await this.em.removeAndFlush(relation);
  }

  async findBySource(
    sourceType: EntityType,
    sourceId: string,
  ): Promise<EntityRelation[]> {
    return this.entityRelationRepository.find({ sourceType, sourceId });
  }

  async findByTarget(
    targetType: EntityType,
    targetId: string,
  ): Promise<EntityRelation[]> {
    return this.entityRelationRepository.find({ targetType, targetId });
  }

  async findByRelationType(
    relationType: RelationType,
  ): Promise<EntityRelation[]> {
    return this.entityRelationRepository.find({ relationType });
  }

  async findByEntityPair(
    sourceType: EntityType,
    sourceId: string,
    targetType: EntityType,
    targetId: string,
  ): Promise<EntityRelation[]> {
    return this.entityRelationRepository.find({
      sourceType,
      sourceId,
      targetType,
      targetId,
    });
  }

  async createRelation(
    sourceType: EntityType,
    sourceId: string,
    targetType: EntityType,
    targetId: string,
    relationType: RelationType,
    options?: {
      strength?: number;
      startDate?: Date;
      endDate?: Date;
      notes?: string;
    },
  ): Promise<EntityRelation> {
    const relation = this.entityRelationRepository.create({
      sourceType,
      sourceId,
      targetType,
      targetId,
      relationType,
      ...options,
    });

    await this.em.persistAndFlush(relation);
    return relation;
  }
}
