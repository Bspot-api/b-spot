import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/core';
import { BrandDiscoveryService } from '../brand-discovery.service';
import { Brand } from '../brand.entity';
import { PappersService } from '../../company/pappers.service';

const EMPTY_SEARCH = { results: [], total_results: 0, page: 1, per_page: 5, total_pages: 0 };

describe('BrandDiscoveryService — external base URL', () => {
  let service: BrandDiscoveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandDiscoveryService,
        { provide: getRepositoryToken(Brand), useValue: { findOne: jest.fn(), create: jest.fn() } },
        { provide: PappersService, useValue: { getCompanyBySiren: jest.fn() } },
        { provide: EntityManager, useValue: { persistAndFlush: jest.fn() } },
      ],
    }).compile();

    service = module.get<BrandDiscoveryService>(BrandDiscoveryService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete process.env.RECHERCHE_ENTREPRISES_BASE_URL;
  });

  function mockEmptySearch(): jest.SpyInstance {
    return jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce({ ok: true, json: async () => EMPTY_SEARCH } as Response);
  }

  it('calls the production recherche-entreprises URL when no base URL is set', async () => {
    const fetchSpy = mockEmptySearch();

    await service.discoverAndPersistBrand('Brovane');

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://recherche-entreprises.api.gouv.fr/search?q=Brovane&per_page=5&page=1',
    );
  });

  it('calls the configured recherche-entreprises base URL', async () => {
    process.env.RECHERCHE_ENTREPRISES_BASE_URL = 'http://localhost:4010/recherche-entreprises';
    const fetchSpy = mockEmptySearch();

    await service.discoverAndPersistBrand('Brovane');

    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:4010/recherche-entreprises/search?q=Brovane&per_page=5&page=1',
    );
  });
});
