import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/core';
import { BrandDiscoveryService } from '../brand-discovery.service';
import { Brand, BrandMatchSource, BrandStatus } from '../brand.entity';
import { PappersService } from '../../company/pappers.service';

const FERRERO_RESULT = { siren: '303543440', nom_complet: 'FERRERO', etat_administratif: 'A' };
const FERRERO_FRANCE_RESULT = { siren: '303543441', nom_complet: 'FERRERO FRANCE COMMERCIALE' };
const UNRELATED_RESULT = { siren: '552032534', nom_complet: 'DANONE' };

const brandRepoMock = {
  findOne: jest.fn(),
  create: jest.fn((data: Partial<Brand>) => ({ ...data })),
};
const pappersServiceMock = { getCompanyBySiren: jest.fn() };
const emMock = { persistAndFlush: jest.fn() };

function mockSearch(results: Array<Record<string, unknown>>): jest.SpyInstance {
  return jest
    .spyOn(global, 'fetch')
    .mockResolvedValueOnce({ ok: true, json: async () => ({ results }) } as Response);
}

describe('BrandDiscoveryService — resolution', () => {
  let service: BrandDiscoveryService;

  beforeEach(async () => {
    jest.clearAllMocks();
    brandRepoMock.findOne.mockResolvedValue(null);
    pappersServiceMock.getCompanyBySiren.mockResolvedValue({ siren: '303543440' });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandDiscoveryService,
        { provide: getRepositoryToken(Brand), useValue: brandRepoMock },
        { provide: PappersService, useValue: pappersServiceMock },
        { provide: EntityManager, useValue: emMock },
      ],
    }).compile();
    service = module.get<BrandDiscoveryService>(BrandDiscoveryService);
  });

  afterEach(() => jest.restoreAllMocks());

  it('resolves nothing for a blank name, without searching', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch');

    expect(await service.discoverAndPersistBrand('   ')).toEqual({ resolution: 'none' });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('asks for user input when no valid candidate comes back', async () => {
    mockSearch([{ siren: '12', nom_complet: 'FERRERO' }, { siren: '303543440' }]);

    expect(await service.discoverAndPersistBrand(' Ferrero ')).toEqual({
      resolution: 'needs_user_input',
      confidence: 0,
      matchedQuery: 'Ferrero',
      message: 'Aucune entreprise candidate trouvée pour cette marque',
    });
  });

  it('asks for user input when the search API fails', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: false, status: 500 } as Response);

    const result = await service.discoverAndPersistBrand('Ferrero');

    expect(result.resolution).toBe('needs_user_input');
    expect(result.confidence).toBe(0);
  });

  it('asks for user input when Pappers cannot validate the best candidate', async () => {
    mockSearch([FERRERO_RESULT]);
    pappersServiceMock.getCompanyBySiren.mockResolvedValue(null);

    expect(await service.discoverAndPersistBrand('Ferrero')).toEqual({
      resolution: 'needs_user_input',
      confidence: 100,
      matchedQuery: 'Ferrero',
      message: 'Impossible de valider l’entreprise candidate',
    });
  });

  it('asks for user input when the confidence is too low', async () => {
    mockSearch([UNRELATED_RESULT]);

    const result = await service.discoverAndPersistBrand('Ferrero');

    expect(result.resolution).toBe('needs_user_input');
    expect(result.message).toBe('Confiance insuffisante pour créer un mapping automatique');
    expect(pappersServiceMock.getCompanyBySiren).toHaveBeenCalledWith('552032534');
  });

  it('returns an existing brand with the same name instead of creating one', async () => {
    const existing = { name: 'Ferrero', status: BrandStatus.PENDING, confidence: 72 };
    mockSearch([FERRERO_RESULT]);
    brandRepoMock.findOne.mockResolvedValue(existing);

    expect(await service.discoverAndPersistBrand('Ferrero')).toEqual({
      resolution: 'auto_pending',
      confidence: 72,
      brand: existing,
      matchedQuery: 'Ferrero',
    });
    expect(emMock.persistAndFlush).not.toHaveBeenCalled();
  });

  it('creates an active brand from the best-ranked candidate', async () => {
    mockSearch([UNRELATED_RESULT, FERRERO_RESULT]);

    const result = await service.discoverAndPersistBrand('Ferrero');

    expect(result.resolution).toBe('auto_active');
    expect(result.brand).toMatchObject({
      name: 'Ferrero',
      siren: '303543440',
      status: BrandStatus.ACTIVE,
      confidence: result.confidence,
      matchSource: BrandMatchSource.AUTO_DISCOVERY,
      matchedQuery: 'Ferrero',
    });
    expect(emMock.persistAndFlush).toHaveBeenCalledWith(result.brand);
  });

  it('creates a pending brand for a medium confidence', async () => {
    mockSearch([FERRERO_FRANCE_RESULT]);

    const result = await service.discoverAndPersistBrand('Ferrero France');

    expect(result.resolution).toBe('auto_pending');
    expect(result.brand).toMatchObject({ status: BrandStatus.PENDING, siren: '303543441' });
  });
});
