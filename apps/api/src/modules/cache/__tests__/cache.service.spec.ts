import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { CacheService } from '../cache.service';
import { EmailService } from '../email.service';
import { PappersCache } from '../pappers-cache.entity';
import { ApiUsageLog, ExternalApi } from '../api-usage-log.entity';

const mockEm = {
  flush: jest.fn().mockResolvedValue(undefined),
  persistAndFlush: jest.fn().mockResolvedValue(undefined),
};

const makePappersCacheRepo = (overrides: Partial<typeof pappersCacheRepoMock> = {}) => ({
  ...pappersCacheRepoMock,
  ...overrides,
});

const pappersCacheRepoMock = {
  findOne: jest.fn(),
  create: jest.fn((data: Partial<PappersCache>) => ({ ...data })),
  count: jest.fn(),
  getEntityManager: jest.fn(() => mockEm),
};

const apiUsageLogRepoMock = {
  findOne: jest.fn(),
  create: jest.fn((data: Partial<ApiUsageLog>) => ({ ...data })),
  count: jest.fn(),
  getEntityManager: jest.fn(() => mockEm),
};

const emailServiceMock = {
  sendQuotaAlert: jest.fn().mockResolvedValue(undefined),
};

describe('CacheService', () => {
  let service: CacheService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        { provide: getRepositoryToken(PappersCache), useValue: pappersCacheRepoMock },
        { provide: getRepositoryToken(ApiUsageLog), useValue: apiUsageLogRepoMock },
        { provide: EmailService, useValue: emailServiceMock },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
  });

  describe('getCachedPappers', () => {
    it('returns null when SIREN not in cache', async () => {
      pappersCacheRepoMock.findOne.mockResolvedValue(null);
      const result = await service.getCachedPappers('123456789');
      expect(result).toBeNull();
    });

    it('returns cached data when cache is valid', async () => {
      const futureDate = new Date(Date.now() + 86400000);
      pappersCacheRepoMock.findOne.mockResolvedValue({
        siren: '123456789',
        responseData: { legalName: 'Test Corp' },
        expiresAt: futureDate,
      });
      const result = await service.getCachedPappers('123456789');
      expect(result).toEqual({ legalName: 'Test Corp' });
    });

    it('returns null when cache is expired', async () => {
      const pastDate = new Date(Date.now() - 86400000);
      pappersCacheRepoMock.findOne.mockResolvedValue({
        siren: '123456789',
        responseData: { legalName: 'Test Corp' },
        expiresAt: pastDate,
      });
      const result = await service.getCachedPappers('123456789');
      expect(result).toBeNull();
    });
  });

  describe('isCacheValid', () => {
    it('returns false when no cache entry exists', async () => {
      pappersCacheRepoMock.findOne.mockResolvedValue(null);
      const result = await service.isCacheValid('999999999');
      expect(result).toBe(false);
    });

    it('returns false when cache is expired (>30 days)', async () => {
      const expired = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000);
      pappersCacheRepoMock.findOne.mockResolvedValue({ expiresAt: expired });
      const result = await service.isCacheValid('999999999');
      expect(result).toBe(false);
    });

    it('returns true when cache is within TTL', async () => {
      const valid = new Date(Date.now() + 86400000);
      pappersCacheRepoMock.findOne.mockResolvedValue({ expiresAt: valid });
      const result = await service.isCacheValid('999999999');
      expect(result).toBe(true);
    });
  });

  describe('getMonthlyApiUsage', () => {
    it('counts API calls for current month', async () => {
      apiUsageLogRepoMock.count.mockResolvedValue(42);
      const result = await service.getMonthlyApiUsage(ExternalApi.PAPPERS);
      expect(result).toBe(42);
      expect(apiUsageLogRepoMock.count).toHaveBeenCalledWith(
        expect.objectContaining({ api: ExternalApi.PAPPERS }),
      );
    });

    it('returns 0 when no calls logged', async () => {
      apiUsageLogRepoMock.count.mockResolvedValue(0);
      const result = await service.getMonthlyApiUsage(ExternalApi.PAPPERS);
      expect(result).toBe(0);
    });
  });

  describe('setCachedPappers', () => {
    it('creates a new cache entry when none exists', async () => {
      pappersCacheRepoMock.findOne.mockResolvedValue(null);
      await service.setCachedPappers('552108011', { legalName: 'Nestlé France' });
      expect(pappersCacheRepoMock.create).toHaveBeenCalledWith(
        expect.objectContaining({ siren: '552108011', responseData: { legalName: 'Nestlé France' } }),
      );
      expect(mockEm.persistAndFlush).toHaveBeenCalled();
    });

    it('updates existing cache entry', async () => {
      const existing = {
        siren: '552108011',
        responseData: { legalName: 'Old' },
        fetchedAt: new Date(),
        expiresAt: new Date(),
      };
      pappersCacheRepoMock.findOne.mockResolvedValue(existing);
      await service.setCachedPappers('552108011', { legalName: 'Updated' });
      expect(existing.responseData).toEqual({ legalName: 'Updated' });
      expect(mockEm.flush).toHaveBeenCalled();
    });
  });
});
