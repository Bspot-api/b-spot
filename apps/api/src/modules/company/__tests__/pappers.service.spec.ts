import { Test, TestingModule } from '@nestjs/testing';
import { PappersService } from '../pappers.service';
import { CacheService } from '../../cache/cache.service';

const cacheServiceMock = {
  getCachedPappers: jest.fn(),
  setCachedPappers: jest.fn().mockResolvedValue(undefined),
  isPappersQuotaExhausted: jest.fn(),
  logApiCall: jest.fn().mockResolvedValue(undefined),
  checkPappersQuota: jest.fn().mockResolvedValue({ used: 1, limit: 250, remaining: 249 }),
};

const NESTLE_PAPPERS_RESPONSE = {
  siren: '552108011',
  denomination: 'Nestlé France SA',
  representants: [
    { prenom: 'Mark', nom: 'Schneider', qualite: 'Directeur Général', date_debut: '2017-01-01' },
    { prenom: 'Henri', nom: 'de Castries', qualite: 'Président du Conseil', date_debut: '2019-06-01' },
  ],
  beneficiaires_effectifs: [
    { nom: 'Nestlé SA', pourcentages_parts: 100, type_personne: 'morale' },
  ],
};

describe('PappersService', () => {
  let service: PappersService;

  beforeEach(async () => {
    jest.clearAllMocks();
    process.env.PAPPERS_API_KEY = 'test_api_key';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PappersService,
        { provide: CacheService, useValue: cacheServiceMock },
      ],
    }).compile();

    service = module.get<PappersService>(PappersService);
  });

  afterEach(() => {
    delete process.env.PAPPERS_API_KEY;
  });

  describe('getCompanyBySiren — cache hit', () => {
    it('returns cached data without calling Pappers API', async () => {
      cacheServiceMock.getCachedPappers.mockResolvedValue(NESTLE_PAPPERS_RESPONSE);
      const fetchSpy = jest.spyOn(global, 'fetch');

      const result = await service.getCompanyBySiren('552108011');

      expect(result).not.toBeNull();
      expect(result!.legalName).toBe('Nestlé France SA');
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('parses executives from cached data', async () => {
      cacheServiceMock.getCachedPappers.mockResolvedValue(NESTLE_PAPPERS_RESPONSE);

      const result = await service.getCompanyBySiren('552108011');

      expect(result!.executives).toHaveLength(2);
      expect(result!.executives[0]).toEqual({
        name: 'Mark Schneider',
        role: 'Directeur Général',
        startDate: '2017-01-01',
      });
    });

    it('parses shareholders from cached data', async () => {
      cacheServiceMock.getCachedPappers.mockResolvedValue(NESTLE_PAPPERS_RESPONSE);

      const result = await service.getCompanyBySiren('552108011');

      expect(result!.shareholders).toHaveLength(1);
      expect(result!.shareholders[0]).toEqual({
        name: 'Nestlé SA',
        percentage: 100,
        type: 'corporate',
      });
    });
  });

  describe('getCompanyBySiren — quota exhausted', () => {
    it('returns null without calling Pappers API when quota is exhausted', async () => {
      cacheServiceMock.getCachedPappers.mockResolvedValue(null);
      cacheServiceMock.isPappersQuotaExhausted.mockResolvedValue(true);
      const fetchSpy = jest.spyOn(global, 'fetch');

      const result = await service.getCompanyBySiren('552108011');

      expect(result).toBeNull();
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  describe('getCompanyBySiren — API call', () => {
    beforeEach(() => {
      cacheServiceMock.getCachedPappers.mockResolvedValue(null);
      cacheServiceMock.isPappersQuotaExhausted.mockResolvedValue(false);
    });

    it('fetches from Pappers API when cache is empty', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => NESTLE_PAPPERS_RESPONSE,
      } as Response);

      const result = await service.getCompanyBySiren('552108011');

      expect(result).not.toBeNull();
      expect(result!.legalName).toBe('Nestlé France SA');
      expect(cacheServiceMock.setCachedPappers).toHaveBeenCalledWith('552108011', NESTLE_PAPPERS_RESPONSE);
      expect(cacheServiceMock.logApiCall).toHaveBeenCalledWith(
        expect.anything(), '/v2/entreprise', 'siren=552108011', true,
      );
    });

    it('returns null when API key is not configured', async () => {
      delete process.env.PAPPERS_API_KEY;
      const result = await service.getCompanyBySiren('552108011');
      expect(result).toBeNull();
    });

    it('returns null and logs error on API failure', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: false,
        status: 403,
        text: async () => 'Quota exceeded',
      } as Response);

      const result = await service.getCompanyBySiren('999999999');

      expect(result).toBeNull();
      expect(cacheServiceMock.logApiCall).toHaveBeenCalledWith(
        expect.anything(), '/v2/entreprise', 'siren=999999999', false, 'Quota exceeded',
      );
    });

    it('returns null and logs error on network failure', async () => {
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));

      const result = await service.getCompanyBySiren('552108011');

      expect(result).toBeNull();
      expect(cacheServiceMock.logApiCall).toHaveBeenCalledWith(
        expect.anything(), '/v2/entreprise', 'siren=552108011', false, expect.any(String),
      );
    });
  });
});
