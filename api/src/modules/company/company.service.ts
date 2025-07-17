import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { Company } from './company.entity';

@Injectable()
export class CompanyService {
  constructor(private readonly em: EntityManager) {}

  async create(data: Partial<Company>): Promise<Company> {
    const company = this.em.create(Company, { ...data, published: false });
    await this.em.persistAndFlush(company);
    return company;
  }

  async findAll(): Promise<Company[]> {
    return this.em.find(Company, {});
  }

  async findOne(id: string): Promise<Company | null> {
    return this.em.findOne(Company, { id });
  }

  async update(id: string, data: Partial<Company>): Promise<Company | null> {
    const company = await this.findOne(id);
    if (!company) return null;
    Object.assign(company, { ...data, published: false });
    await this.em.persistAndFlush(company);
    return company;
  }

  async remove(id: string): Promise<boolean> {
    const company = await this.findOne(id);
    if (!company) return false;
    await this.em.removeAndFlush(company);
    return true;
  }
}
