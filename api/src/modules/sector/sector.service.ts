import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Sector } from './sector.entity';

@Injectable()
export class SectorService {
  constructor(private readonly em: EntityManager) {}

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

  async getCompanies(id: string) {
    const sector = await this.em.findOne(
      Sector,
      { id },
      { populate: ['companies'] },
    );
    if (!sector) return [];
    return sector.companies.getItems();
  }
}
