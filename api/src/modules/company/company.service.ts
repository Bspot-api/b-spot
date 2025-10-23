import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { EntityRelationCacheService } from '../entity-relation/entity-relation-cache.service';
import { Fund } from '../fund/fund.entity';
import { Personality } from '../personality/personality.entity';
import { Sector } from '../sector/sector.entity';
import { CreateCompanyDto } from './company.dto';
import { Company, RelationMatch } from './company.entity';

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
    const company = new Company();
    company.name = createCompanyDto.name;
    company.description = createCompanyDto.description;
    company.source = createCompanyDto.source;
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
    const whereConditions = this.buildSearchConditions(filters);

    const relationMatchesMap = new Map<string, RelationMatch[]>();
    const allowedCompanyIds = await this.applyRelationFilters(
      filters,
      relationMatchesMap,
    );

    if (allowedCompanyIds !== undefined) {
      if (allowedCompanyIds.length === 0) {
        return this.emptyPaginatedResponse(page, limit);
      }
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

    return this.buildPaginatedResponse(
      populatedCompanies,
      relationMatchesMap,
      page,
      limit,
      total,
    );
  }

  private buildSearchConditions(
    filters: CompanySearchFilters,
  ): Record<string, any> {
    const conditions: Record<string, any> = {};
    if (filters.search) {
      conditions.name = { $ilike: `%${filters.search}%` };
    }
    return conditions;
  }

  private async applyRelationFilters(
    filters: CompanySearchFilters,
    relationMatchesMap: Map<string, RelationMatch[]>,
  ): Promise<string[] | undefined> {
    if (
      !filters.fundIds?.length &&
      !filters.sectorIds?.length &&
      !filters.personalityIds?.length
    ) {
      return undefined;
    }

    const companyIdSets: string[][] = [];

    if (filters.fundIds?.length) {
      const fundIds = await this.applyFundFilter(
        filters.fundIds,
        relationMatchesMap,
      );
      companyIdSets.push(fundIds);
    }

    if (filters.sectorIds?.length) {
      const sectorIds = await this.applySectorFilter(
        filters.sectorIds,
        relationMatchesMap,
      );
      companyIdSets.push(sectorIds);
    }

    if (filters.personalityIds?.length) {
      const personalityIds = await this.applyPersonalityFilter(
        filters.personalityIds,
        relationMatchesMap,
      );
      companyIdSets.push(personalityIds);
    }

    return this.intersectCompanyIdSets(companyIdSets);
  }

  private async applyFundFilter(
    fundIds: string[],
    relationMatchesMap: Map<string, RelationMatch[]>,
  ): Promise<string[]> {
    const funds = await this.em.find(Fund, { id: { $in: fundIds } });
    const fundMap = new Map(funds.map((f) => [f.id, f.name]));

    for (const fundId of fundIds) {
      const relations =
        await this.entityRelationCacheService.getCompanyRelationsByFund(
          fundId,
        );
      this.addRelationMatches(relationMatchesMap, relations, {
        filterType: 'fund',
        filterId: fundId,
        filterName: fundMap.get(fundId) || fundId,
        via: 'direct',
      });
    }

    const companyIdArrays = await Promise.all(
      fundIds.map((id) =>
        this.entityRelationCacheService.getCompanyIdsByFund(id),
      ),
    );
    return [...new Set(companyIdArrays.flat())];
  }

  private async applySectorFilter(
    sectorIds: string[],
    relationMatchesMap: Map<string, RelationMatch[]>,
  ): Promise<string[]> {
    const sectors = await this.em.find(Sector, { id: { $in: sectorIds } });
    const sectorMap = new Map(sectors.map((s) => [s.id, s.name]));

    for (const sectorId of sectorIds) {
      const relations =
        await this.entityRelationCacheService.getCompanyRelationsBySector(
          sectorId,
        );
      this.addRelationMatches(relationMatchesMap, relations, {
        filterType: 'sector',
        filterId: sectorId,
        filterName: sectorMap.get(sectorId) || sectorId,
        via: 'direct',
      });
    }

    const companyIdArrays = await Promise.all(
      sectorIds.map((id) =>
        this.entityRelationCacheService.getCompanyIdsBySector(id),
      ),
    );
    return [...new Set(companyIdArrays.flat())];
  }

  private async applyPersonalityFilter(
    personalityIds: string[],
    relationMatchesMap: Map<string, RelationMatch[]>,
  ): Promise<string[]> {
    const personalities = await this.em.find(Personality, {
      id: { $in: personalityIds },
    });
    const personalityMap = new Map(personalities.map((p) => [p.id, p.name]));

    for (const personalityId of personalityIds) {
      const relations =
        await this.entityRelationCacheService.getCompanyRelationsByPersonality(
          personalityId,
        );

      const fundsMap = await this.loadFundNamesForRelations(relations);

      relations.forEach((rel) => {
        const matches = relationMatchesMap.get(rel.companyId) || [];
        matches.push({
          filterType: 'personality',
          filterId: personalityId,
          filterName: personalityMap.get(personalityId) || personalityId,
          relationType: rel.relationType,
          via: rel.via,
          viaEntityId: rel.viaEntityId,
          viaEntityName: rel.viaEntityId
            ? fundsMap.get(rel.viaEntityId)
            : undefined,
        });
        relationMatchesMap.set(rel.companyId, matches);
      });
    }

    const companyIdArrays = await Promise.all(
      personalityIds.map((id) =>
        this.entityRelationCacheService.getCompanyIdsByPersonality(id),
      ),
    );
    return [...new Set(companyIdArrays.flat())];
  }

  private async loadFundNamesForRelations(
    relations: any[],
  ): Promise<Map<string, string>> {
    const fundIds = [
      ...new Set(
        relations
          .filter((r) => r.via === 'fund' && r.viaEntityId)
          .map((r) => r.viaEntityId!),
      ),
    ];

    const fundsMap = new Map<string, string>();
    if (fundIds.length > 0) {
      const funds = await this.em.find(Fund, { id: { $in: fundIds } });
      funds.forEach((f) => fundsMap.set(f.id, f.name));
    }
    return fundsMap;
  }

  private addRelationMatches(
    relationMatchesMap: Map<string, RelationMatch[]>,
    relations: any[],
    baseMatch: Partial<RelationMatch>,
  ): void {
    relations.forEach((rel) => {
      const matches = relationMatchesMap.get(rel.companyId) || [];
      matches.push({
        filterType: baseMatch.filterType!,
        filterId: baseMatch.filterId!,
        filterName: baseMatch.filterName!,
        relationType: rel.relationType,
        via: baseMatch.via,
        viaEntityId: baseMatch.viaEntityId,
        viaEntityName: baseMatch.viaEntityName,
      });
      relationMatchesMap.set(rel.companyId, matches);
    });
  }

  private intersectCompanyIdSets(companyIdSets: string[][]): string[] {
    if (companyIdSets.length === 0) return [];
    if (companyIdSets.length === 1) return companyIdSets[0];

    return companyIdSets.reduce((intersection, currentSet) =>
      intersection.filter((id) => currentSet.includes(id)),
    );
  }

  private emptyPaginatedResponse(
    page: number,
    limit: number,
  ): PaginatedCompaniesResponse {
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

  private buildPaginatedResponse(
    companies: Company[],
    relationMatchesMap: Map<string, RelationMatch[]>,
    page: number,
    limit: number,
    total: number,
  ): PaginatedCompaniesResponse {
    const companiesWithRelations = companies.map((company) => ({
      ...company,
      funds: company.funds,
      sectors: company.sectors,
      personalities: company.personalities,
      matchedVia: relationMatchesMap.get(company.id),
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
