import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { EntityManager } from '@mikro-orm/core';
import { Company } from './company.entity';
import { PappersService } from './pappers.service';
import type { CompanyDto } from './dto/company.dto';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);

  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: EntityRepository<Company>,
    private readonly pappersService: PappersService,
    private readonly em: EntityManager,
  ) {}

  async getOrCreateCompany(siren: string): Promise<Company | null> {
    const existing = await this.companyRepo.findOne({ siren });
    if (existing) return existing;

    const data = await this.pappersService.getCompanyBySiren(siren);
    if (!data) {
      this.logger.warn(`No Pappers data for SIREN ${siren}`);
      return null;
    }

    const now = new Date();
    const company = this.companyRepo.create({
      siren: data.siren,
      legalName: data.legalName,
      logoUrl: data.logoUrl,
      executives: data.executives,
      shareholders: data.shareholders,
      rawPappersData: data.rawData,
      lastFetchedAt: now,
      createdAt: now,
    });

    await this.em.persistAndFlush(company);
    return company;
  }

  async getCompanyById(id: number): Promise<Company | null> {
    return this.companyRepo.findOne({ id });
  }

  async refreshCompany(siren: string): Promise<Company | null> {
    const data = await this.pappersService.getCompanyBySiren(siren);
    if (!data) return null;

    const existing = await this.companyRepo.findOne({ siren });
    if (existing) {
      existing.legalName = data.legalName;
      existing.executives = data.executives;
      existing.shareholders = data.shareholders;
      existing.rawPappersData = data.rawData;
      existing.lastFetchedAt = new Date();
      await this.em.flush();
      return existing;
    }

    return this.getOrCreateCompany(siren);
  }

  toDto(company: Company): CompanyDto {
    return {
      siren: company.siren,
      legalName: company.legalName,
      logoUrl: company.logoUrl,
      executives: company.executives,
      shareholders: company.shareholders,
      lastFetchedAt: company.lastFetchedAt.toISOString(),
    };
  }
}
