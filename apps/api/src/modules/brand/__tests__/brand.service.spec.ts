import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/core';
import { BrandService } from '../brand.service';
import { Brand } from '../brand.entity';

const NUTELLA = { id: 1, name: 'Nutella' };
const COTE_DOR = { id: 2, name: "Côte d'Or" };
const BRANDS = [NUTELLA, COTE_DOR];

const brandRepoMock = { findOne: jest.fn(), findAll: jest.fn() };
const executeMock = jest.fn();
const emMock = { getConnection: jest.fn(() => ({ execute: executeMock })) };

describe('BrandService.findBrandByName', () => {
  let service: BrandService;

  beforeEach(async () => {
    jest.clearAllMocks();
    brandRepoMock.findOne.mockResolvedValue(null);
    brandRepoMock.findAll.mockResolvedValue(BRANDS);
    executeMock.mockResolvedValue([]);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandService,
        { provide: getRepositoryToken(Brand), useValue: brandRepoMock },
        { provide: EntityManager, useValue: emMock },
      ],
    }).compile();
    service = module.get<BrandService>(BrandService);
  });

  it('returns null for a blank name without querying', async () => {
    expect(await service.findBrandByName('  ')).toBeNull();
    expect(brandRepoMock.findOne).not.toHaveBeenCalled();
  });

  it('returns the case-insensitive exact match first', async () => {
    brandRepoMock.findOne.mockResolvedValueOnce(NUTELLA);

    expect(await service.findBrandByName(' nutella ')).toBe(NUTELLA);
    expect(brandRepoMock.findOne).toHaveBeenCalledWith({ name: { $ilike: 'nutella' } });
    expect(brandRepoMock.findAll).not.toHaveBeenCalled();
  });

  it('matches after normalizing accents and punctuation', async () => {
    expect(await service.findBrandByName('cote d or')).toBe(COTE_DOR);
    expect(executeMock).not.toHaveBeenCalled();
  });

  it('matches a partial normalized label', async () => {
    expect(await service.findBrandByName('Nutella B-ready')).toBe(NUTELLA);
    expect(executeMock).not.toHaveBeenCalled();
  });

  it('falls back to the fuzzy SQL match and re-hydrates the entity', async () => {
    executeMock.mockResolvedValueOnce([{ id: 1, name: 'Nutella', score: 0.6 }]);
    brandRepoMock.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(NUTELLA);

    expect(await service.findBrandByName('nuutela')).toBe(NUTELLA);
    expect(executeMock).toHaveBeenCalledWith(expect.stringContaining('similarity'), [
      'nuutela',
      'nuutela',
    ]);
    expect(brandRepoMock.findOne).toHaveBeenLastCalledWith({ id: 1 });
  });

  it('returns null when the fuzzy match finds nothing', async () => {
    expect(await service.findBrandByName('Danone')).toBeNull();
  });
});
