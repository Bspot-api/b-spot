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

const pappersCacheRepoMock = {
  findOne: jest.fn(),
  create: jest.fn(),
  count: jest.fn(),
  getEntityManager: jest.fn(() => mockEm),
};

const apiUsageLogRepoMock = {
  create: jest.fn((data: Partial<ApiUsageLog>) => ({ ...data })),
  count: jest.fn(),
  getEntityManager: jest.fn(() => mockEm),
};

const emailServiceMock = {
  sendQuotaAlert: jest.fn().mockResolvedValue(undefined),
};

describe('CacheService — Quota Monitoring', () => {
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

  describe('checkPappersQuota', () => {
    it('returns correct usage and remaining counts', async () => {
      apiUsageLogRepoMock.count.mockResolvedValue(150);
      const result = await service.checkPappersQuota();
      expect(result.used).toBe(150);
      expect(result.limit).toBe(250);
      expect(result.remaining).toBe(100);
      expect(result.warningThreshold).toBe(200);
    });

    it('does NOT send email alert when usage is below threshold (< 200)', async () => {
      apiUsageLogRepoMock.count.mockResolvedValue(150);
      await service.checkPappersQuota();
      expect(emailServiceMock.sendQuotaAlert).not.toHaveBeenCalled();
    });

    it('sends email alert when usage reaches warning threshold (200)', async () => {
      apiUsageLogRepoMock.count.mockResolvedValue(200);
      await service.checkPappersQuota();
      expect(emailServiceMock.sendQuotaAlert).toHaveBeenCalledWith(200);
    });

    it('sends email alert when usage exceeds warning threshold (> 200)', async () => {
      apiUsageLogRepoMock.count.mockResolvedValue(230);
      await service.checkPappersQuota();
      expect(emailServiceMock.sendQuotaAlert).toHaveBeenCalledWith(230);
    });

    it('clamps remaining to 0 when quota is exhausted', async () => {
      apiUsageLogRepoMock.count.mockResolvedValue(260);
      const result = await service.checkPappersQuota();
      expect(result.remaining).toBe(0);
    });
  });

  describe('isPappersQuotaExhausted', () => {
    it('returns false when usage is below limit', async () => {
      apiUsageLogRepoMock.count.mockResolvedValue(249);
      const result = await service.isPappersQuotaExhausted();
      expect(result).toBe(false);
    });

    it('returns true when usage reaches the limit (250)', async () => {
      apiUsageLogRepoMock.count.mockResolvedValue(250);
      const result = await service.isPappersQuotaExhausted();
      expect(result).toBe(true);
    });

    it('returns true when usage exceeds the limit', async () => {
      apiUsageLogRepoMock.count.mockResolvedValue(251);
      const result = await service.isPappersQuotaExhausted();
      expect(result).toBe(true);
    });
  });

  describe('logApiCall', () => {
    it('creates an ApiUsageLog entry with correct fields', async () => {
      await service.logApiCall(ExternalApi.PAPPERS, '/v2/entreprise', '{"siren":"123"}', true);
      expect(apiUsageLogRepoMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          api: ExternalApi.PAPPERS,
          endpoint: '/v2/entreprise',
          requestParams: '{"siren":"123"}',
          success: true,
        }),
      );
      expect(mockEm.persistAndFlush).toHaveBeenCalled();
    });

    it('logs failed API calls with error message', async () => {
      await service.logApiCall(ExternalApi.PAPPERS, '/v2/entreprise', null, false, '404 Not Found');
      expect(apiUsageLogRepoMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          errorMessage: '404 Not Found',
          requestParams: undefined,
        }),
      );
    });
  });
});
