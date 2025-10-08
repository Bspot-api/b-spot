import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { EntityRelationCacheService } from '../entity-relation/entity-relation-cache.service';
import { CreateCompanyDto } from './company.dto';
import { Company } from './company.entity';

export interface PaginatedCompaniesResponse {
  data: Company[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CompanySearchFilters {
  search?: string;
  fundIds?: string[];
  sectorIds?: string[];
  personalityIds?: string[];
}

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: EntityRepository<Company>,
    private readonly em: EntityManager,
    private readonly entityRelationCacheService: EntityRelationCacheService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepository.create(createCompanyDto);
    await this.em.persistAndFlush(company);
    return this.populateRelations(company);
  }

  private async populateRelations(company: Company): Promise<Company> {
    const [funds, sectors, personalities] = await Promise.all([
      this.entityRelationCacheService.getFundsByCompany(company.id),
      this.entityRelationCacheService.getSectorsByCompany(company.id),
      this.entityRelationCacheService.getPersonalitiesByCompany(company.id),
    ]);

    company.funds = funds;
    company.sectors = sectors;
    company.personalities = personalities;

    return company;
  }

  private async populateMultipleRelations(
    companies: Company[],
  ): Promise<Company[]> {
    return Promise.all(
      companies.map((company) => this.populateRelations(company)),
    );
  }

  async findAll(): Promise<Company[]> {
    const companies = await this.companyRepository.findAll();
    return this.populateMultipleRelations(companies);
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 30,
    filters: CompanySearchFilters = {},
  ): Promise<PaginatedCompaniesResponse> {
    const offset = (page - 1) * limit;
    let whereConditions: any = {};

    if (filters.search) {
      whereConditions.name = { $ilike: `%${filters.search}%` };
    }

    let allowedCompanyIds: string[] | undefined;

    if (
      filters.fundIds?.length ||
      filters.sectorIds?.length ||
      filters.personalityIds?.length
    ) {
      const companyIdSets: string[][] = [];

      if (filters.fundIds?.length) {
        const fundCompanyIdArrays = await Promise.all(
          filters.fundIds.map((fundId) =>
            this.entityRelationCacheService.getCompanyIdsByFund(fundId),
          ),
        );
        const fundCompanyIds = [...new Set(fundCompanyIdArrays.flat())];
        companyIdSets.push(fundCompanyIds);
      }

      if (filters.sectorIds?.length) {
        const sectorCompanyIdArrays = await Promise.all(
          filters.sectorIds.map((sectorId) =>
            this.entityRelationCacheService.getCompanyIdsBySector(sectorId),
          ),
        );
        const sectorCompanyIds = [...new Set(sectorCompanyIdArrays.flat())];
        companyIdSets.push(sectorCompanyIds);
      }

      if (filters.personalityIds?.length) {
        const personalityCompanyIdArrays = await Promise.all(
          filters.personalityIds.map((personalityId) =>
            this.entityRelationCacheService.getCompanyIdsByPersonality(
              personalityId,
            ),
          ),
        );
        const personalityCompanyIds = [
          ...new Set(personalityCompanyIdArrays.flat()),
        ];
        companyIdSets.push(personalityCompanyIds);
      }

      if (companyIdSets.length === 1) {
        allowedCompanyIds = companyIdSets[0];
      } else if (companyIdSets.length > 1) {
        allowedCompanyIds = companyIdSets.reduce((intersection, currentSet) =>
          intersection.filter((id) => currentSet.includes(id)),
        );
      }

      if (allowedCompanyIds && allowedCompanyIds.length === 0) {
        return {
          data: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        };
      }
    }

    if (allowedCompanyIds) {
      whereConditions.id = { $in: allowedCompanyIds };
    }

    const [companies, total] = await this.companyRepository.findAndCount(
      whereConditions,
      {
        limit,
        offset,
        orderBy: { name: 'ASC' },
      },
    );

    const populatedCompanies =
      await this.populateMultipleRelations(companies);

    const companiesWithRelations = populatedCompanies.map((company) => ({
      ...company,
      funds: company.funds,
      sectors: company.sectors,
      personalities: company.personalities,
    }));

    return {
      data: companiesWithRelations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepository.findOneOrFail(id);
    return this.populateRelations(company);
  }

  async update(
    id: string,
    updateCompanyDto: Partial<CreateCompanyDto>,
  ): Promise<Company> {
    const company = await this.companyRepository.findOneOrFail(id);
    this.companyRepository.assign(company, updateCompanyDto);
    await this.em.flush();

    // Invalidate cache for this company
    this.entityRelationCacheService.invalidateCompanyCache(id);

    return this.populateRelations(company);
  }

  async remove(id: string): Promise<void> {
    const company = await this.companyRepository.findOneOrFail(id);

    // Invalidate cache for this company
    this.entityRelationCacheService.invalidateCompanyCache(id);

    await this.em.removeAndFlush(company);
  }
}
