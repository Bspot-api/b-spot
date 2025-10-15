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
    const relationMatchesMap = new Map<string, RelationMatch[]>();

    if (
      filters.fundIds?.length ||
      filters.sectorIds?.length ||
      filters.personalityIds?.length
    ) {
      const companyIdSets: string[][] = [];

      if (filters.fundIds?.length) {
        const funds = await this.em.find(Fund, {
          id: { $in: filters.fundIds },
        });
        const fundMap = new Map(funds.map((f) => [f.id, f.name]));

        for (const fundId of filters.fundIds) {
          const relations =
            await this.entityRelationCacheService.getCompanyRelationsByFund(
              fundId,
            );
          relations.forEach((rel) => {
            const matches = relationMatchesMap.get(rel.companyId) || [];
            matches.push({
              filterType: 'fund',
              filterId: fundId,
              filterName: fundMap.get(fundId) || fundId,
              relationType: rel.relationType,
              via: 'direct',
            });
            relationMatchesMap.set(rel.companyId, matches);
          });
        }

        const fundCompanyIdArrays = await Promise.all(
          filters.fundIds.map((fundId) =>
            this.entityRelationCacheService.getCompanyIdsByFund(fundId),
          ),
        );
        const fundCompanyIds = [...new Set(fundCompanyIdArrays.flat())];
        companyIdSets.push(fundCompanyIds);
      }

      if (filters.sectorIds?.length) {
        const sectors = await this.em.find(Sector, {
          id: { $in: filters.sectorIds },
        });
        const sectorMap = new Map(sectors.map((s) => [s.id, s.name]));

        for (const sectorId of filters.sectorIds) {
          const relations =
            await this.entityRelationCacheService.getCompanyRelationsBySector(
              sectorId,
            );
          relations.forEach((rel) => {
            const matches = relationMatchesMap.get(rel.companyId) || [];
            matches.push({
              filterType: 'sector',
              filterId: sectorId,
              filterName: sectorMap.get(sectorId) || sectorId,
              relationType: rel.relationType,
              via: 'direct',
            });
            relationMatchesMap.set(rel.companyId, matches);
          });
        }

        const sectorCompanyIdArrays = await Promise.all(
          filters.sectorIds.map((sectorId) =>
            this.entityRelationCacheService.getCompanyIdsBySector(sectorId),
          ),
        );
        const sectorCompanyIds = [...new Set(sectorCompanyIdArrays.flat())];
        companyIdSets.push(sectorCompanyIds);
      }

      if (filters.personalityIds?.length) {
        const personalities = await this.em.find(Personality, {
          id: { $in: filters.personalityIds },
        });
        const personalityMap = new Map(
          personalities.map((p) => [p.id, p.name]),
        );

        for (const personalityId of filters.personalityIds) {
          const relations =
            await this.entityRelationCacheService.getCompanyRelationsByPersonality(
              personalityId,
            );

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
