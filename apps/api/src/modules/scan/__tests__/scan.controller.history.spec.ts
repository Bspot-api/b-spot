import { Test, TestingModule } from '@nestjs/testing';
import { ScanController } from '../scan.controller';
import { ScanService } from '../scan.service';

const mockScanService = {
  scanProduct: jest.fn(),
  scanByBrandName: jest.fn(),
  scanBySiren: jest.fn(),
  getHistory: jest.fn(),
};

describe('ScanController — GET /api/scan/history', () => {
  let controller: ScanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScanController],
      providers: [{ provide: ScanService, useValue: mockScanService }],
    }).compile();

    controller = module.get<ScanController>(ScanController);
    mockScanService.getHistory.mockReturnValue({ items: [], total: 0, limit: 50, offset: 0 });
  });

  afterEach(() => jest.clearAllMocks());

  it('returns empty history with default pagination', () => {
    const result = controller.getHistory(50, 0);
    expect(result).toEqual({ items: [], total: 0, limit: 50, offset: 0 });
    expect(mockScanService.getHistory).toHaveBeenCalledWith(50, 0);
  });

  it('clamps limit to 100 max', () => {
    mockScanService.getHistory.mockReturnValue({ items: [], total: 0, limit: 100, offset: 0 });
    controller.getHistory(999, 0);
    expect(mockScanService.getHistory).toHaveBeenCalledWith(100, 0);
  });

  it('clamps offset to 0 min', () => {
    mockScanService.getHistory.mockReturnValue({ items: [], total: 0, limit: 50, offset: 0 });
    controller.getHistory(50, -5);
    expect(mockScanService.getHistory).toHaveBeenCalledWith(50, 0);
  });
});
