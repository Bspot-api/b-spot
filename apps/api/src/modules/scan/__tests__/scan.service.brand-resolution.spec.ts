import { Test, TestingModule } from '@nestjs/testing';
import { ScanService } from '../scan.service';
import { ProductService } from '../../product/product.service';
import { BrandService } from '../../brand/brand.service';
import { BrandDiscoveryService } from '../../brand/brand-discovery.service';
import { BrandSuggestionService } from '../../brand-suggestion/brand-suggestion.service';
import { CompanyService } from '../../company/company.service';
import { ProductSource } from '../../product/product.entity';
import { BrandStatus } from '../../brand/brand.entity';

const PRODUCT = {
  barcode: '3017620422003',
  name: 'Nutella',
  source: ProductSource.OPEN_FOOD_FACTS,
  brandName: 'Ferrero',
};
const ACTIVE_BRAND = { id: 1, name: 'Ferrero', siren: '303543440', status: BrandStatus.ACTIVE };
const PENDING_BRAND = { ...ACTIVE_BRAND, status: BrandStatus.PENDING };
const COMPANY = { id: 1, siren: '303543440', legalName: 'Ferrero France SAS' };
const COMPANY_DTO = { siren: '303543440', legalName: 'Ferrero France SAS' };
const PENDING_MESSAGE = 'Correspondance marque trouvée, en attente de validation';

const productServiceMock = {
  fetchProduct: jest.fn(),
  saveProduct: jest.fn().mockResolvedValue(undefined),
};
const brandServiceMock = { findBrandByName: jest.fn() };
const brandDiscoveryServiceMock = { discoverAndPersistBrand: jest.fn() };
const brandSuggestionServiceMock = { createFromScan: jest.fn() };
const companyServiceMock = { getOrCreateCompany: jest.fn(), toDto: jest.fn() };

async function createService(): Promise<ScanService> {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      ScanService,
      { provide: ProductService, useValue: productServiceMock },
      { provide: BrandService, useValue: brandServiceMock },
      { provide: BrandDiscoveryService, useValue: brandDiscoveryServiceMock },
      { provide: BrandSuggestionService, useValue: brandSuggestionServiceMock },
      { provide: CompanyService, useValue: companyServiceMock },
    ],
  }).compile();
  return module.get<ScanService>(ScanService);
}

describe('ScanService — brand resolution', () => {
  let service: ScanService;

  beforeEach(async () => {
    jest.clearAllMocks();
    companyServiceMock.toDto.mockReturnValue(COMPANY_DTO);
    service = await createService();
  });

  describe('scanProduct', () => {
    it('returns fresh company data for a brand found by auto discovery', async () => {
      productServiceMock.fetchProduct.mockResolvedValue(PRODUCT);
      brandServiceMock.findBrandByName.mockResolvedValue(null);
      brandDiscoveryServiceMock.discoverAndPersistBrand.mockResolvedValue({
        resolution: 'auto_active',
        confidence: 91,
        brand: ACTIVE_BRAND,
      });
      companyServiceMock.getOrCreateCompany.mockResolvedValue(COMPANY);

      const result = await service.scanProduct(PRODUCT.barcode);

      expect(result).toEqual({
        product: PRODUCT,
        company: COMPANY_DTO,
        dataFreshness: 'fresh',
        brandResolution: 'auto_active',
        brandStatus: BrandStatus.ACTIVE,
        discoveryConfidence: 91,
        message: undefined,
      });
      expect(brandSuggestionServiceMock.createFromScan).not.toHaveBeenCalled();
    });

    it('flags a pending brand with the waiting-for-validation message', async () => {
      productServiceMock.fetchProduct.mockResolvedValue(PRODUCT);
      brandServiceMock.findBrandByName.mockResolvedValue(null);
      brandDiscoveryServiceMock.discoverAndPersistBrand.mockResolvedValue({
        resolution: 'auto_pending',
        confidence: 70,
        brand: PENDING_BRAND,
      });
      companyServiceMock.getOrCreateCompany.mockResolvedValue(COMPANY);

      const result = await service.scanProduct(PRODUCT.barcode);

      expect(result.brandResolution).toBe('auto_pending');
      expect(result.brandStatus).toBe(BrandStatus.PENDING);
      expect(result.message).toBe(PENDING_MESSAGE);
    });

    it('falls back to a default message when discovery gives none', async () => {
      productServiceMock.fetchProduct.mockResolvedValue(PRODUCT);
      brandServiceMock.findBrandByName.mockResolvedValue(null);
      brandDiscoveryServiceMock.discoverAndPersistBrand.mockResolvedValue({ resolution: 'none' });
      brandSuggestionServiceMock.createFromScan.mockResolvedValue(null);

      const result = await service.scanProduct(PRODUCT.barcode);

      expect(result.message).toBe('Marque "Ferrero" non référencée et non résolue automatiquement');
      expect(result.brandSuggestionId).toBeUndefined();
    });
  });

  describe('scanByBrandName', () => {
    it('returns fresh company data for an existing brand', async () => {
      brandServiceMock.findBrandByName.mockResolvedValue(ACTIVE_BRAND);
      companyServiceMock.getOrCreateCompany.mockResolvedValue(COMPANY);

      const result = await service.scanByBrandName('Ferrero');

      expect(result).toEqual({
        company: COMPANY_DTO,
        dataFreshness: 'fresh',
        brandResolution: 'existing',
        brandStatus: BrandStatus.ACTIVE,
        discoveryConfidence: undefined,
        message: undefined,
      });
      expect(brandDiscoveryServiceMock.discoverAndPersistBrand).not.toHaveBeenCalled();
    });

    it('asks for user input with the discovery message when nothing resolves', async () => {
      brandServiceMock.findBrandByName.mockResolvedValue(null);
      brandDiscoveryServiceMock.discoverAndPersistBrand.mockResolvedValue({
        resolution: 'needs_user_input',
        confidence: 30,
        message: 'Confiance insuffisante',
      });

      const result = await service.scanByBrandName('Ferero');

      expect(result).toEqual({
        dataFreshness: 'unavailable',
        message: 'Confiance insuffisante',
        brandResolution: 'needs_user_input',
        discoveryConfidence: 30,
      });
    });

    it('falls back to a default message when discovery gives none', async () => {
      brandServiceMock.findBrandByName.mockResolvedValue(null);
      brandDiscoveryServiceMock.discoverAndPersistBrand.mockResolvedValue({ resolution: 'none' });

      const result = await service.scanByBrandName('Ferero');

      expect(result.message).toBe(
        'Marque "Ferero" non trouvée avec certitude. Essayez un nom plus précis.',
      );
    });

    it('keeps the discovery resolution when the company is unavailable', async () => {
      brandServiceMock.findBrandByName.mockResolvedValue(null);
      brandDiscoveryServiceMock.discoverAndPersistBrand.mockResolvedValue({
        resolution: 'auto_pending',
        confidence: 70,
        brand: PENDING_BRAND,
      });
      companyServiceMock.getOrCreateCompany.mockResolvedValue(null);

      const result = await service.scanByBrandName('Ferrero');

      expect(result).toEqual({
        dataFreshness: 'unavailable',
        message: 'Données entreprise temporairement indisponibles (quota Pappers atteint)',
        brandResolution: 'auto_pending',
        brandStatus: BrandStatus.PENDING,
        discoveryConfidence: 70,
      });
    });
  });
});
