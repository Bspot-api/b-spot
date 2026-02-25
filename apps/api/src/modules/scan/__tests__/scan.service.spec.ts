import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ScanService } from '../scan.service';
import { ProductService } from '../../product/product.service';
import { BrandService } from '../../brand/brand.service';
import { CompanyService } from '../../company/company.service';
import { ProductSource } from '../../product/product.entity';

const NUTELLA_PRODUCT = {
  barcode: '3017620422003',
  name: 'Nutella',
  category: 'Spreads',
  imageUrl: 'https://images.openfoodfacts.org/nutella.jpg',
  source: ProductSource.OPEN_FOOD_FACTS,
  brandName: 'Ferrero',
};

const FERRERO_BRAND = { id: 1, name: 'Ferrero', siren: '303543440' };

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
  fetchFromOpenFoodFacts: jest.fn(),
  saveProduct: jest.fn().mockResolvedValue(undefined),
};

const brandServiceMock = {
  findBrandByName: jest.fn(),
};

const companyServiceMock = {
  getOrCreateCompany: jest.fn(),
  toDto: jest.fn(),
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
        { provide: CompanyService, useValue: companyServiceMock },
      ],
    }).compile();

    service = module.get<ScanService>(ScanService);
  });

  describe('scanProduct — product not found', () => {
    it('throws NotFoundException when barcode is unknown', async () => {
      productServiceMock.fetchFromOpenFoodFacts.mockResolvedValue(null);

      await expect(service.scanProduct('0000000000000')).rejects.toThrow(NotFoundException);
      expect(brandServiceMock.findBrandByName).not.toHaveBeenCalled();
    });
  });

  describe('scanProduct — brand not in DB', () => {
    it('returns unavailable result when brand is unknown', async () => {
      productServiceMock.fetchFromOpenFoodFacts.mockResolvedValue(NUTELLA_PRODUCT);
      brandServiceMock.findBrandByName.mockResolvedValue(null);

      const result = await service.scanProduct('3017620422003');

      expect(result.dataFreshness).toBe('unavailable');
      expect(result.company).toBeUndefined();
      expect(result.message).toContain('non référencée');
    });
  });

  describe('scanProduct — no brand name in product', () => {
    it('returns unavailable when product has no brand name', async () => {
      productServiceMock.fetchFromOpenFoodFacts.mockResolvedValue({
        ...NUTELLA_PRODUCT,
        brandName: undefined,
      });

      const result = await service.scanProduct('3017620422003');

      expect(result.dataFreshness).toBe('unavailable');
      expect(result.company).toBeUndefined();
      expect(brandServiceMock.findBrandByName).not.toHaveBeenCalled();
    });
  });

  describe('scanProduct — Pappers quota exhausted', () => {
    it('returns unavailable when company lookup returns null', async () => {
      productServiceMock.fetchFromOpenFoodFacts.mockResolvedValue(NUTELLA_PRODUCT);
      brandServiceMock.findBrandByName.mockResolvedValue(FERRERO_BRAND);
      companyServiceMock.getOrCreateCompany.mockResolvedValue(null);

      const result = await service.scanProduct('3017620422003');

      expect(result.dataFreshness).toBe('unavailable');
      expect(result.message).toContain('quota');
    });
  });

  describe('scanProduct — happy path', () => {
    it('returns product and company data for valid barcode', async () => {
      productServiceMock.fetchFromOpenFoodFacts.mockResolvedValue(NUTELLA_PRODUCT);
      brandServiceMock.findBrandByName.mockResolvedValue(FERRERO_BRAND);
      companyServiceMock.getOrCreateCompany.mockResolvedValue(FERRERO_COMPANY);
      companyServiceMock.toDto.mockReturnValue(FERRERO_COMPANY_DTO);

      const result = await service.scanProduct('3017620422003');

      expect(result.dataFreshness).toBe('fresh');
      expect(result.product).toEqual(NUTELLA_PRODUCT);
      expect(result.company).toEqual(FERRERO_COMPANY_DTO);
      expect(productServiceMock.saveProduct).toHaveBeenCalledWith(NUTELLA_PRODUCT);
      expect(brandServiceMock.findBrandByName).toHaveBeenCalledWith('Ferrero');
      expect(companyServiceMock.getOrCreateCompany).toHaveBeenCalledWith('303543440');
    });
  });
});
