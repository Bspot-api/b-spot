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
  ): Promise<PaginatedCompaniesResponse> {
    const offset = (page - 1) * limit;

    // Get total count
    const total = await this.companyRepository.count();

    // Get paginated data with relations
    const companies = await this.companyRepository.find(
      {},
      {
        populate: ['fund', 'sector', 'personalities'],
        limit,
        offset,
        orderBy: { name: 'ASC' },
      },
    );

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
