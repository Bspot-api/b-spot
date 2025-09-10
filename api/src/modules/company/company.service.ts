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

  private async populateMultipleRelations(companies: Company[]): Promise<Company[]> {
    return Promise.all(companies.map(company => this.populateRelations(company)));
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

    // Search by name
    if (filters.search) {
      whereConditions = {
        name: { $ilike: `%${filters.search}%` }
      };
    }

    // Get all companies first (with basic filters)
    let allCompanies = await this.companyRepository.find(whereConditions, {
      orderBy: { name: 'ASC' },
    });

    // Populate relations for all companies
    const populatedCompanies = await this.populateMultipleRelations(allCompanies);

    // Apply complex filters using populated data
    let filteredCompanies = populatedCompanies;

    // Filter by fund IDs
    if (filters.fundIds && filters.fundIds.length > 0) {
      filteredCompanies = filteredCompanies.filter(company => 
        company.funds && company.funds.some(fund => filters.fundIds!.includes(fund.id))
      );
    }

    // Filter by sector IDs
    if (filters.sectorIds && filters.sectorIds.length > 0) {
      filteredCompanies = filteredCompanies.filter(company => 
        company.sectors && company.sectors.some(sector => filters.sectorIds!.includes(sector.id))
      );
    }

    // Filter by personality IDs
    if (filters.personalityIds && filters.personalityIds.length > 0) {
      filteredCompanies = filteredCompanies.filter(company => 
        company.personalities && company.personalities.some(personality => 
          filters.personalityIds!.includes(personality.id)
        )
      );
    }

    // Apply pagination to filtered results
    const total = filteredCompanies.length;
    const paginatedCompanies = filteredCompanies.slice(offset, offset + limit);
    const totalPages = Math.ceil(total / limit);

    // Convert to plain objects with computed properties
    const companiesWithRelations = paginatedCompanies.map(company => ({
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
        totalPages,
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
