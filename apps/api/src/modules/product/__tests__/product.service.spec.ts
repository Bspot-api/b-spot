import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/core';
import { ProductService } from '../product.service';
import { Product, ProductSource } from '../product.entity';
import { Brand } from '../../brand/brand.entity';

const mockEm = {
  persistAndFlush: jest.fn().mockResolvedValue(undefined),
};

const productRepoMock = {
  findOne: jest.fn(),
  create: jest.fn((data: Partial<Product>) => ({ ...data })),
  getEntityManager: jest.fn(() => mockEm),
};

const brandRepoMock = {
  findOne: jest.fn(),
};

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getRepositoryToken(Product), useValue: productRepoMock },
        { provide: getRepositoryToken(Brand), useValue: brandRepoMock },
        { provide: EntityManager, useValue: mockEm },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('fetchFromOpenFoodFacts', () => {
    it('returns null when fetch fails', async () => {
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network error'));
      const result = await service.fetchFromOpenFoodFacts('1234567890123');
      expect(result).toBeNull();
    });

    it('returns null when product not found (status != 1)', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({ status: 0 }),
      } as Response);
      const result = await service.fetchFromOpenFoodFacts('0000000000000');
      expect(result).toBeNull();
    });

    it('parses product data correctly', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 1,
          product: {
            product_name: 'Nutella',
            brands: 'Nutella,Ferrero',
            categories: 'Spreads,Nut pastes',
            image_url: 'https://images.openfoodfacts.org/nutella.jpg',
          },
        }),
      } as Response);

      const result = await service.fetchFromOpenFoodFacts('3017620422003');

      expect(result).not.toBeNull();
      expect(result!.barcode).toBe('3017620422003');
      expect(result!.name).toBe('Nutella');
      expect(result!.brandName).toBe('Nutella'); // first brand only
      expect(result!.category).toBe('Spreads');  // first category only
      expect(result!.source).toBe(ProductSource.OPEN_FOOD_FACTS);
    });

    it('handles missing optional fields gracefully', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 1,
          product: { product_name: 'Unknown Product' },
        }),
      } as Response);

      const result = await service.fetchFromOpenFoodFacts('9999999999999');
      expect(result).not.toBeNull();
      expect(result!.brandName).toBeUndefined();
      expect(result!.category).toBeUndefined();
      expect(result!.imageUrl).toBeUndefined();
    });
  });

  describe('saveProduct', () => {
    it('returns existing product without creating a new one', async () => {
      const existing = { id: 1, barcode: '3017620422003', name: 'Nutella' };
      productRepoMock.findOne.mockResolvedValue(existing);

      const result = await service.saveProduct({
        barcode: '3017620422003',
        name: 'Nutella',
        source: ProductSource.OPEN_FOOD_FACTS,
      });

      expect(result).toEqual(existing);
      expect(productRepoMock.create).not.toHaveBeenCalled();
    });

    it('creates new product and links brand when found', async () => {
      productRepoMock.findOne.mockResolvedValue(null);
      brandRepoMock.findOne.mockResolvedValue({ id: 1, name: 'Ferrero', siren: '303543440' });

      await service.saveProduct({
        barcode: '3017620422003',
        name: 'Nutella',
        source: ProductSource.OPEN_FOOD_FACTS,
        brandName: 'Ferrero',
      });

      expect(productRepoMock.create).toHaveBeenCalledWith(
        expect.objectContaining({
          barcode: '3017620422003',
          brand: expect.objectContaining({ name: 'Ferrero' }),
        }),
      );
      expect(mockEm.persistAndFlush).toHaveBeenCalled();
    });

    it('creates product without brand when brand not found in DB', async () => {
      productRepoMock.findOne.mockResolvedValue(null);
      brandRepoMock.findOne.mockResolvedValue(null);

      await service.saveProduct({
        barcode: '9999999999999',
        name: 'Unknown Brand Product',
        source: ProductSource.OPEN_FOOD_FACTS,
        brandName: 'Unknown Brand',
      });

      expect(productRepoMock.create).toHaveBeenCalledWith(
        expect.objectContaining({ brand: undefined }),
      );
    });
  });

  describe('fetchProduct', () => {
    it('returns OFF product when found in OFF and does not call OBF', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          status: 1,
          product: {
            product_name: 'Nutella',
            brands: 'Nutella,Ferrero',
            categories: 'Spreads',
            image_url: 'https://images.openfoodfacts.org/nutella.jpg',
          },
        }),
      } as Response);

      const result = await service.fetchProduct('3017620422003');

      expect(result).not.toBeNull();
      expect(result!.source).toBe(ProductSource.OPEN_FOOD_FACTS);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it('falls back to OBF when OFF returns not found', async () => {
      jest.spyOn(global, 'fetch')
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ status: 0 }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            status: 1,
            product: {
              product_name: 'Shampoo Test',
              brands: 'Brand Beauty',
              categories: 'Hair care',
              image_url: 'https://images.openbeautyfacts.org/shampoo.jpg',
            },
          }),
        } as Response);

      const result = await service.fetchProduct('3600523951970');

      expect(result).not.toBeNull();
      expect(result!.source).toBe(ProductSource.OPEN_BEAUTY_FACTS);
      expect(result!.name).toBe('Shampoo Test');
      expect(result!.brandName).toBe('Brand Beauty');
      expect(result!.category).toBe('Hair care');
    });

    it('returns null when OFF and OBF both return not found', async () => {
      jest.spyOn(global, 'fetch')
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ status: 0 }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ status: 0 }),
        } as Response);

      const result = await service.fetchProduct('0000000000000');

      expect(result).toBeNull();
    });

    it('returns null and does not fallback to OBF when OFF fails technically', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch').mockRejectedValueOnce(
        new Error('OFF network error'),
      );

      const result = await service.fetchProduct('3017620422003');

      expect(result).toBeNull();
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });
});
