import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CompanyController } from '../company.controller';
import { CompanyService } from '../company.service';
import type { CompanyDto } from '../dto/company.dto';
import type { Company } from '../company.entity';

const NESTLE_COMPANY: Company = {
  id: 1,
  siren: '552108011',
  legalName: 'Nestlé France SA',
  logoUrl: undefined,
  rawPappersData: undefined,
  executives: [
    { name: 'Mark Schneider', role: 'Directeur Général', startDate: '2017-01-01' },
    { name: 'Henri de Castries', role: 'Président du Conseil', startDate: '2019-06-01' },
  ],
  shareholders: [{ name: 'Nestlé SA', percentage: 100, type: 'corporate' }],
  subsidiaries: undefined,
  lastFetchedAt: new Date('2026-02-25T00:00:00.000Z'),
  createdAt: new Date('2026-02-25T00:00:00.000Z'),
};

const NESTLE_DTO: CompanyDto = {
  siren: '552108011',
  legalName: 'Nestlé France SA',
  logoUrl: undefined,
  executives: NESTLE_COMPANY.executives,
  shareholders: NESTLE_COMPANY.shareholders,
  lastFetchedAt: '2026-02-25T00:00:00.000Z',
};

const companyServiceMock = {
  getOrCreateCompany: jest.fn(),
  toDto: jest.fn(),
};

describe('CompanyController', () => {
  let controller: CompanyController;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [{ provide: CompanyService, useValue: companyServiceMock }],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  describe('GET /api/companies/:siren', () => {
    it('returns CompanyDto when company is found', async () => {
      companyServiceMock.getOrCreateCompany.mockResolvedValue(NESTLE_COMPANY);
      companyServiceMock.toDto.mockReturnValue(NESTLE_DTO);

      const result = await controller.getCompany('552108011');

      expect(result).toEqual(NESTLE_DTO);
      expect(companyServiceMock.getOrCreateCompany).toHaveBeenCalledWith('552108011');
      expect(companyServiceMock.toDto).toHaveBeenCalledWith(NESTLE_COMPANY);
    });

    it('throws NotFoundException when company is not found', async () => {
      companyServiceMock.getOrCreateCompany.mockResolvedValue(null);

      await expect(controller.getCompany('000000000')).rejects.toThrow(NotFoundException);
      expect(companyServiceMock.toDto).not.toHaveBeenCalled();
    });

    it('returns 404 with French error message for unknown SIREN', async () => {
      companyServiceMock.getOrCreateCompany.mockResolvedValue(null);

      await expect(controller.getCompany('999999999')).rejects.toThrow(
        'Entreprise non trouvée dans Pappers',
      );
    });

    it('passes the siren param to CompanyService unchanged', async () => {
      companyServiceMock.getOrCreateCompany.mockResolvedValue(NESTLE_COMPANY);
      companyServiceMock.toDto.mockReturnValue(NESTLE_DTO);

      await controller.getCompany('552108011');

      expect(companyServiceMock.getOrCreateCompany).toHaveBeenCalledTimes(1);
      expect(companyServiceMock.getOrCreateCompany).toHaveBeenCalledWith('552108011');
    });
  });
});
