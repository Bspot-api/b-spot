jest.mock('../auth.service');

import { BadRequestException } from '@nestjs/common';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { BrandSuggestionService } from '../../brand-suggestion/brand-suggestion.service';
import { AdminController } from '../admin.controller';
import { AdminGuard } from '../admin.guard';
import { AdminService } from '../admin.service';
import { AuthGuard } from '../auth.guard';
import { AuthService } from '../auth.service';

describe('AdminController — admin CRUD integration', () => {
  let app: INestApplication;

  const mockAuthService = {
    api: {
      getSession: jest.fn(),
    },
  };

  const mockAdminService = {
    findByUserId: jest.fn(),
    listAdmins: jest.fn(),
    promote: jest.fn(),
    revoke: jest.fn(),
  };

  const suggestion = {
    id: 1,
    brandName: 'TestBrand',
    barcode: '123',
    productName: 'Prod',
    productImageUrl: undefined,
    notes: undefined,
    offBrandRaw: undefined,
    status: 'new',
    createdAt: '2026-06-09T00:00:00.000Z',
    updatedAt: '2026-06-09T00:00:00.000Z',
  };

  const mockBrandSuggestionService = {
    findByStatus: jest.fn(),
    updateStatus: jest.fn(),
    toDto: jest.fn((s: typeof suggestion) => s),
  };

  const adminSession = {
    user: { id: 'admin-user', email: 'admin@test.com', name: 'admin' },
  };

  const adminRecord = {
    id: 'admin-1',
    createdAt: new Date('2026-05-30T10:00:00.000Z'),
    user: { id: 'admin-user', email: 'admin@test.com', name: 'admin' },
  };

  beforeEach(async () => {
    mockAuthService.api.getSession.mockResolvedValue(adminSession);
    mockAdminService.findByUserId.mockResolvedValue(adminRecord);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        AuthGuard,
        AdminGuard,
        { provide: AuthService, useValue: mockAuthService },
        { provide: AdminService, useValue: mockAdminService },
        { provide: BrandSuggestionService, useValue: mockBrandSuggestionService },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  describe('GET /api/admin/brand-suggestions', () => {
    it('returns 200 with items and total as admin', async () => {
      mockBrandSuggestionService.findByStatus.mockResolvedValue({ items: [suggestion], total: 1 });

      const response = await request(app.getHttpServer())
        .get('/api/admin/brand-suggestions')
        .expect(200);

      expect(response.body.total).toBe(1);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].brandName).toBe('TestBrand');
    });

    it('filters by status query param', async () => {
      mockBrandSuggestionService.findByStatus.mockResolvedValue({ items: [suggestion], total: 1 });

      await request(app.getHttpServer())
        .get('/api/admin/brand-suggestions?status=new')
        .expect(200);

      expect(mockBrandSuggestionService.findByStatus).toHaveBeenCalledWith('new');
    });

    it('returns 401 when no session', async () => {
      mockAuthService.api.getSession.mockResolvedValueOnce(null);

      await request(app.getHttpServer()).get('/api/admin/brand-suggestions').expect(401);
    });

    it('returns 403 when not admin', async () => {
      mockAdminService.findByUserId.mockResolvedValueOnce(null);

      await request(app.getHttpServer()).get('/api/admin/brand-suggestions').expect(403);
    });
  });

  it('GET /api/admin/admins returns list of admins', async () => {
    mockAdminService.listAdmins.mockResolvedValue([adminRecord]);

    const response = await request(app.getHttpServer())
      .get('/api/admin/admins')
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].userId).toBe('admin-user');
  });

  it('POST /api/admin/admins promotes a user', async () => {
    const promoted = {
      id: 'admin-2',
      createdAt: new Date('2026-05-30T11:00:00.000Z'),
      user: { id: 'user-2', email: 'new@test.com', name: 'new' },
    };
    mockAdminService.promote.mockResolvedValue(promoted);

    const response = await request(app.getHttpServer())
      .post('/api/admin/admins')
      .send({ userId: 'user-2' })
      .expect(201);

    expect(response.body.userId).toBe('user-2');
    expect(mockAdminService.promote).toHaveBeenCalledWith('user-2');
  });

  it('DELETE /api/admin/admins/:userId revokes admin status', async () => {
    mockAdminService.revoke.mockResolvedValue(undefined);

    await request(app.getHttpServer()).delete('/api/admin/admins/user-2').expect(204);
    expect(mockAdminService.revoke).toHaveBeenCalledWith('user-2');
  });

  it('DELETE /api/admin/admins/:userId returns 400 for last admin', async () => {
    mockAdminService.revoke.mockRejectedValue(
      new BadRequestException('Cannot revoke the last admin'),
    );

    await request(app.getHttpServer()).delete('/api/admin/admins/admin-user').expect(400);
  });
});
