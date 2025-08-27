import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
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
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepository.create(createCompanyDto);
    await this.em.persistAndFlush(company);
    return company;
  }

  async findAll(): Promise<Company[]> {
    return this.companyRepository.findAll({
      populate: ['fund', 'sector', 'personalities'],
    });
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 30,
    filters: CompanySearchFilters = {},
  ): Promise<PaginatedCompaniesResponse> {
    const offset = (page - 1) * limit;
    const whereConditions: any = {};

    // Build complex filter conditions
    const filterConditions = [];

    if (filters.fundIds && filters.fundIds.length > 0) {
      // Use $or to find companies that belong to ANY of the specified funds
      filterConditions.push({
        $or: filters.fundIds.map((fundId) => ({ fund: fundId })),
      });
    }

    if (filters.sectorIds && filters.sectorIds.length > 0) {
      // Use $or to find companies that belong to ANY of the specified sectors
      filterConditions.push({
        $or: filters.sectorIds.map((sectorId) => ({ sector: sectorId })),
      });
    }

    if (filters.personalityIds && filters.personalityIds.length > 0) {
      // Use $or to find companies that have ANY of the specified personalities
      filterConditions.push({
        $or: filters.personalityIds.map((personalityId) => ({
          personalities: { $in: [personalityId] },
        })),
      });
    }

    // Combine all filter conditions with $and
    if (filterConditions.length > 0) {
      if (filterConditions.length === 1) {
        Object.assign(whereConditions, filterConditions[0]);
      } else {
        whereConditions.$and = filterConditions;
      }
    }

    let total: number;
    let companies: Company[];

    if (filters.search) {
      const searchResult = await this.searchCompanies(
        filters.search,
        whereConditions,
        limit,
        offset,
      );
      companies = searchResult.companies;
      total = searchResult.total;
    } else {
      total = await this.companyRepository.count(whereConditions);
      companies = await this.companyRepository.find(whereConditions, {
        populate: ['fund', 'sector', 'personalities'],
        limit,
        offset,
        orderBy: { name: 'ASC' },
      });
    }

    const totalPages = Math.ceil(total / limit);

    return {
      data: companies,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  private async searchCompanies(
    searchTerm: string,
    whereConditions: any,
    limit: number,
    offset: number,
  ): Promise<{ companies: Company[]; total: number }> {
    const searchPattern = `%${searchTerm}%`;

    // First, get the total count for search results
    const total = await this.companyRepository.count({
      $or: [
        { name: { $ilike: searchPattern } },
        { fund: { name: { $ilike: searchPattern } } },
        { sector: { name: { $ilike: searchPattern } } },
        { personalities: { name: { $ilike: searchPattern } } },
      ],
      ...whereConditions,
    });

    // Then get the paginated search results
    const companies = await this.companyRepository.find(
      {
        $or: [
          { name: { $ilike: searchPattern } },
          { fund: { name: { $ilike: searchPattern } } },
          { sector: { name: { $ilike: searchPattern } } },
          { personalities: { name: { $ilike: searchPattern } } },
        ],
        ...whereConditions,
      },
      {
        populate: ['fund', 'sector', 'personalities'],
        limit,
        offset,
        orderBy: { name: 'ASC' },
      },
    );

    return { companies, total };
  }

  async findOne(id: string): Promise<Company> {
    return this.companyRepository.findOneOrFail(id, {
      populate: ['fund', 'sector', 'personalities'],
    });
  }

  async update(
    id: string,
    updateCompanyDto: Partial<CreateCompanyDto>,
  ): Promise<Company> {
    const company = await this.findOne(id);
    this.companyRepository.assign(company, updateCompanyDto);
    await this.em.flush();
    return company;
  }

  async remove(id: string): Promise<void> {
    const company = await this.findOne(id);
    await this.em.removeAndFlush(company);
  }
}
