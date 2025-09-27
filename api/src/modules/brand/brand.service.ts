import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Brand } from './brand.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: EntityRepository<Brand>,
    private readonly em: EntityManager,
  ) {}

  async findAll(): Promise<Brand[]> {
    return this.brandRepository.findAll({
      populate: ['company', 'fund', 'sector', 'personalities'],
    });
  }

  async findOne(id: string): Promise<Brand | null> {
    return this.brandRepository.findOne(
      { id },
      {
        populate: ['company', 'fund', 'sector', 'personalities'],
      },
    );
  }

  async create(brandData: Partial<Brand>): Promise<Brand> {
    const brand = this.brandRepository.create(brandData);
    await this.em.persistAndFlush(brand);
    return brand;
  }

  async update(id: string, brandData: Partial<Brand>): Promise<Brand> {
    const brand = await this.findOne(id);
    if (!brand) {
      throw new Error('Brand not found');
    }

    this.brandRepository.assign(brand, brandData);
    await this.em.flush();
    return brand;
  }

  async delete(id: string): Promise<void> {
    const brand = await this.findOne(id);
    if (!brand) {
      throw new Error('Brand not found');
    }

    await this.em.removeAndFlush(brand);
  }

  async findByCompany(companyId: string): Promise<Brand[]> {
    return this.brandRepository.find(
      { company: companyId },
      {
        populate: ['company', 'fund', 'sector', 'personalities'],
      },
    );
  }

  async findByFund(fundId: string): Promise<Brand[]> {
    return this.brandRepository.find(
      { fund: fundId },
      {
        populate: ['company', 'fund', 'sector', 'personalities'],
      },
    );
  }

  async findBySector(sectorId: string): Promise<Brand[]> {
    return this.brandRepository.find(
      { sector: sectorId },
      {
        populate: ['company', 'fund', 'sector', 'personalities'],
      },
    );
  }
}
