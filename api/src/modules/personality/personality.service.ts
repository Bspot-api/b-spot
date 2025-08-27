import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Personality } from './personality.entity';

@Injectable()
export class PersonalityService {
  constructor(private readonly em: EntityManager) {}

  async create(data: Partial<Personality>): Promise<Personality> {
    const personality = this.em.create(Personality, {
      ...data,
      published: false,
    });
    await this.em.persistAndFlush(personality);
    return personality;
  }

  async findAll(): Promise<Personality[]> {
    return this.em.find(Personality, {});
  }

  async findOne(id: string): Promise<Personality | null> {
    return this.em.findOne(Personality, { id });
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

  async getCompanies(id: string) {
    const personality = await this.em.findOne(
      Personality,
      { id },
      { populate: ['companies'] },
    );
    if (!personality) return [];
    return personality.companies.getItems();
  }
}
