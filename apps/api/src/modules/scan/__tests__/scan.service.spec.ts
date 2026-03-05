import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ScanService } from '../scan.service';
import { ProductService } from '../../product/product.service';
import { BrandService } from '../../brand/brand.service';
import { BrandDiscoveryService } from '../../brand/brand-discovery.service';
import { BrandSuggestionService } from '../../brand-suggestion/brand-suggestion.service';
import { CompanyService } from '../../company/company.service';
import { ProductSource } from '../../product/product.entity';
import { BrandStatus } from '../../brand/brand.entity';

const NUTELLA_PRODUCT = {
  barcode: '3017620422003',
  name: 'Nutella',
  category: 'Spreads',
  imageUrl: 'https://images.openfoodfacts.org/nutella.jpg',
  source: ProductSource.OPEN_FOOD_FACTS,
  brandName: 'Ferrero',
};

const BEAUTY_PRODUCT = {
  barcode: '3600523951970',
  name: 'Shampoo Test',
  category: 'Hair care',
  imageUrl: 'https://images.openbeautyfacts.org/shampoo.jpg',
  source: ProductSource.OPEN_BEAUTY_FACTS,
  brandName: 'Ferrero',
};

const FERRERO_BRAND = { id: 1, name: 'Ferrero', siren: '303543440', status: BrandStatus.ACTIVE };

const FERRERO_COMPANY = {
  id: 1,
  siren: '303543440',
  legalName: 'Ferrero France SAS',
  executives: [],
  shareholders: [],
  lastFetchedAt: new Date('2026-02-25T00:00:00.000Z'),
  createdAt: new Date('2026-02-25T00:00:00.000Z'),
};

const FERRERO_COMPANY_DTO = {
  siren: '303543440',
  legalName: 'Ferrero France SAS',
  executives: [],
  shareholders: [],
  lastFetchedAt: '2026-02-25T00:00:00.000Z',
};

const productServiceMock = {
  fetchProduct: jest.fn(),
  saveProduct: jest.fn().mockResolvedValue(undefined),
};

const brandServiceMock = {
  findBrandByName: jest.fn(),
};

const companyServiceMock = {
  getOrCreateCompany: jest.fn(),
  toDto: jest.fn(),
};

const brandDiscoveryServiceMock = {
  discoverAndPersistBrand: jest.fn(),
};

const brandSuggestionServiceMock = {
  createFromScan: jest.fn(),
};

describe('ScanService', () => {
  let service: ScanService;

  beforeEach(async () => {
    jest.clearAllMocks();

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

    service = module.get<ScanService>(ScanService);
  });

  describe('scanProduct — product not found', () => {
    it('throws NotFoundException when barcode is unknown', async () => {
      productServiceMock.fetchProduct.mockResolvedValue(null);

      await expect(service.scanProduct('0000000000000')).rejects.toThrow(NotFoundException);
      expect(brandServiceMock.findBrandByName).not.toHaveBeenCalled();
    });
  });

  describe('scanProduct — brand not in DB', () => {
    it('returns unavailable result and creates suggestion when discovery is uncertain', async () => {
      productServiceMock.fetchProduct.mockResolvedValue(NUTELLA_PRODUCT);
      brandServiceMock.findBrandByName.mockResolvedValue(null);
      brandDiscoveryServiceMock.discoverAndPersistBrand.mockResolvedValue({
        resolution: 'needs_user_input',
        confidence: 42,
        message: 'Confiance insuffisante',
      });
      brandSuggestionServiceMock.createFromScan.mockResolvedValue({ id: 99 });

      const result = await service.scanProduct('3017620422003');

      expect(result.dataFreshness).toBe('unavailable');
      expect(result.company).toBeUndefined();
      expect(result.message).toContain('Confiance');
      expect(result.brandResolution).toBe('needs_user_input');
      expect(result.userActionRequired).toBe('submit_brand_suggestion');
      expect(result.brandSuggestionId).toBe(99);
    });
  });

  describe('scanProduct — no brand name in product', () => {
    it('returns unavailable when product has no brand name', async () => {
      productServiceMock.fetchProduct.mockResolvedValue({
        ...NUTELLA_PRODUCT,
        brandName: undefined,
      });

      const result = await service.scanProduct('3017620422003');

      expect(result.dataFreshness).toBe('unavailable');
      expect(result.company).toBeUndefined();
      expect(brandServiceMock.findBrandByName).not.toHaveBeenCalled();
      expect(result.userActionRequired).toBe('submit_brand_suggestion');
    });
  });

  describe('scanProduct — Pappers quota exhausted', () => {
    it('returns unavailable when company lookup returns null', async () => {
      productServiceMock.fetchProduct.mockResolvedValue(NUTELLA_PRODUCT);
      brandServiceMock.findBrandByName.mockResolvedValue(FERRERO_BRAND);
      companyServiceMock.getOrCreateCompany.mockResolvedValue(null);

      const result = await service.scanProduct('3017620422003');

      expect(result.dataFreshness).toBe('unavailable');
      expect(result.message).toContain('quota');
    });
  });

  describe('scanProduct — happy path', () => {
    it('returns product and company data for valid barcode', async () => {
      productServiceMock.fetchProduct.mockResolvedValue(NUTELLA_PRODUCT);
      brandServiceMock.findBrandByName.mockResolvedValue(FERRERO_BRAND);
      companyServiceMock.getOrCreateCompany.mockResolvedValue(FERRERO_COMPANY);
      companyServiceMock.toDto.mockReturnValue(FERRERO_COMPANY_DTO);

      const result = await service.scanProduct('3017620422003');

      expect(result.dataFreshness).toBe('fresh');
      expect(result.product).toEqual(NUTELLA_PRODUCT);
      expect(result.company).toEqual(FERRERO_COMPANY_DTO);
      expect(result.brandResolution).toBe('existing');
      expect(result.brandStatus).toBe('active');
      expect(productServiceMock.saveProduct).toHaveBeenCalledWith(NUTELLA_PRODUCT);
      expect(brandServiceMock.findBrandByName).toHaveBeenCalledWith('Ferrero');
      expect(companyServiceMock.getOrCreateCompany).toHaveBeenCalledWith('303543440');
    });

    it('keeps product source when product comes from OBF', async () => {
      productServiceMock.fetchProduct.mockResolvedValue(BEAUTY_PRODUCT);
      brandServiceMock.findBrandByName.mockResolvedValue(FERRERO_BRAND);
      companyServiceMock.getOrCreateCompany.mockResolvedValue(FERRERO_COMPANY);
      companyServiceMock.toDto.mockReturnValue(FERRERO_COMPANY_DTO);

      const result = await service.scanProduct('3600523951970');

      expect(result.product.source).toBe(ProductSource.OPEN_BEAUTY_FACTS);
      expect(productServiceMock.saveProduct).toHaveBeenCalledWith(BEAUTY_PRODUCT);
    });
  });
});
