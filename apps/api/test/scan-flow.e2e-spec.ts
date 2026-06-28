import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { ScanController } from '../src/modules/scan/scan.controller';
import { ScanService } from '../src/modules/scan/scan.service';
import { ProductSource } from '../src/modules/product/product.entity';

const NUTELLA_SCAN_RESULT = {
  product: {
    barcode: '3017620422003',
    name: 'Nutella',
    category: 'Spreads',
    imageUrl: 'https://images.openfoodfacts.org/nutella.jpg',
    source: ProductSource.OPEN_FOOD_FACTS,
    brandName: 'Ferrero',
  },
  company: {
    siren: '303543440',
    legalName: 'Ferrero France SAS',
    executives: [],
    shareholders: [],
    lastFetchedAt: '2026-02-25T00:00:00.000Z',
  },
  dataFreshness: 'fresh',
};

const BEAUTY_SCAN_RESULT = {
  product: {
    barcode: '3600523951970',
    name: 'Shampoo Test',
    category: 'Hair care',
    imageUrl: 'https://images.openbeautyfacts.org/shampoo.jpg',
    source: ProductSource.OPEN_BEAUTY_FACTS,
    brandName: 'Ferrero',
  },
  company: {
    siren: '303543440',
    legalName: 'Ferrero France SAS',
    executives: [],
    shareholders: [],
    lastFetchedAt: '2026-02-25T00:00:00.000Z',
  },
  dataFreshness: 'fresh',
};

const scanServiceMock = {
  scanProduct: jest.fn(),
};

describe('ScanController (E2E)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScanController],
      providers: [{ provide: ScanService, useValue: scanServiceMock }],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/scan', () => {
    it('returns 201 with ScanResultDto for valid barcode', async () => {
      scanServiceMock.scanProduct.mockResolvedValue(NUTELLA_SCAN_RESULT);

      const response = await request(app.getHttpServer())
        .post('/api/scan')
        .send({ barcode: '3017620422003' })
        .expect(201);

      expect(response.body.product.name).toBe('Nutella');
      expect(response.body.product.source).toBe(ProductSource.OPEN_FOOD_FACTS);
      expect(response.body.company.legalName).toBe('Ferrero France SAS');
      expect(response.body.dataFreshness).toBe('fresh');
      expect(scanServiceMock.scanProduct).toHaveBeenCalledWith('3017620422003');
    });

    it('returns 201 with OBF source when scan is resolved from Open Beauty Facts', async () => {
      scanServiceMock.scanProduct.mockResolvedValue(BEAUTY_SCAN_RESULT);

      const response = await request(app.getHttpServer())
        .post('/api/scan')
        .send({ barcode: '3600523951970' })
        .expect(201);

      expect(response.body.product.name).toBe('Shampoo Test');
      expect(response.body.product.source).toBe(ProductSource.OPEN_BEAUTY_FACTS);
      expect(response.body.company.legalName).toBe('Ferrero France SAS');
      expect(response.body.dataFreshness).toBe('fresh');
    });

    it('returns 400 when barcode is missing', async () => {
      await request(app.getHttpServer())
        .post('/api/scan')
        .send({})
        .expect(400);
    });

    it('returns 400 when barcode is too short', async () => {
      await request(app.getHttpServer())
        .post('/api/scan')
        .send({ barcode: '123' })
        .expect(400);
    });

    it('returns 404 when product is not found', async () => {
      const { NotFoundException } = await import('@nestjs/common');
      scanServiceMock.scanProduct.mockRejectedValue(
        new NotFoundException('Produit introuvable'),
      );

      await request(app.getHttpServer())
        .post('/api/scan')
        .send({ barcode: '0000000000000' })
        .expect(404);
    });

    it('returns unavailable result when brand is not in DB', async () => {
      scanServiceMock.scanProduct.mockResolvedValue({
        product: NUTELLA_SCAN_RESULT.product,
        dataFreshness: 'unavailable',
        message: 'Marque "Ferrero" non référencée dans notre base de données',
      });

      const response = await request(app.getHttpServer())
        .post('/api/scan')
        .send({ barcode: '3017620422003' })
        .expect(201);

      expect(response.body.dataFreshness).toBe('unavailable');
      expect(response.body.company).toBeUndefined();
    });
  });
});
