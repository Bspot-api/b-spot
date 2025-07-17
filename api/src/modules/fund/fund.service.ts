import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Fund } from './fund.entity';

@Injectable()
export class FundService {
  constructor(private readonly em: EntityManager) {}

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

  async getCompanies(id: string) {
    const fund = await this.em.findOne(
      Fund,
      { id },
      { populate: ['companies'] },
    );
    if (!fund) return [];
    return fund.companies.getItems();
  }
}
