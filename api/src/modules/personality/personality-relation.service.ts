import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import {
  PersonalityRelation,
  PersonalityRelationType,
} from './personality-relation.entity';
import { Personality } from './personality.entity';

@Injectable()
export class PersonalityRelationService {
  constructor(private readonly em: EntityManager) {}

  async create(
    sourcePersonalityId: string,
    targetPersonalityId: string,
    relationType: PersonalityRelationType,
    notes?: string,
  ): Promise<PersonalityRelation> {
    const relation = this.em.create(PersonalityRelation, {
      sourcePersonality: sourcePersonalityId,
      targetPersonality: targetPersonalityId,
      relationType,
      notes,
    });

    await this.em.persistAndFlush(relation);
    return relation;
  }

  async findBySourcePersonality(
    personalityId: string,
    relationType?: PersonalityRelationType,
  ): Promise<PersonalityRelation[]> {
    const where: any = { sourcePersonality: personalityId };
    if (relationType) {
      where.relationType = relationType;
    }

    return this.em.find(PersonalityRelation, where, {
      populate: ['targetPersonality'],
    });
  }

  async findByTargetPersonality(
    personalityId: string,
    relationType?: PersonalityRelationType,
  ): Promise<PersonalityRelation[]> {
    const where: any = { targetPersonality: personalityId };
    if (relationType) {
      where.relationType = relationType;
    }

    return this.em.find(PersonalityRelation, where, {
      populate: ['sourcePersonality'],
    });
  }

  async getRelatedPersonalities(
    personalityId: string,
    relationType?: PersonalityRelationType,
  ): Promise<Personality[]> {
    const relations = await this.findBySourcePersonality(
      personalityId,
      relationType,
    );
    return relations.map((rel) => rel.targetPersonality);
  }

  async getRelatedPersonalitiesBidirectional(
    personalityId: string,
    relationType?: PersonalityRelationType,
  ): Promise<Personality[]> {
    const [outgoing, incoming] = await Promise.all([
      this.findBySourcePersonality(personalityId, relationType),
      this.findByTargetPersonality(personalityId, relationType),
    ]);

    const relatedPersonalities = new Map<string, Personality>();

    // Add outgoing relations
    outgoing.forEach((rel) => {
      relatedPersonalities.set(rel.targetPersonality.id, rel.targetPersonality);
    });

    // Add incoming relations
    incoming.forEach((rel) => {
      relatedPersonalities.set(rel.sourcePersonality.id, rel.sourcePersonality);
    });

    return Array.from(relatedPersonalities.values());
  }

  async remove(id: string): Promise<boolean> {
    const relation = await this.em.findOne(PersonalityRelation, { id });
    if (!relation) return false;

    await this.em.removeAndFlush(relation);
    return true;
  }

  async removeRelation(
    sourcePersonalityId: string,
    targetPersonalityId: string,
    relationType: PersonalityRelationType,
  ): Promise<boolean> {
    const relation = await this.em.findOne(PersonalityRelation, {
      sourcePersonality: sourcePersonalityId,
      targetPersonality: targetPersonalityId,
      relationType,
    });

    if (!relation) return false;

    await this.em.removeAndFlush(relation);
    return true;
  }
}
