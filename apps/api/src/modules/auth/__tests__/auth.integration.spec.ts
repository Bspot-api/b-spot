jest.mock('../auth.service');

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AdminController } from '../admin.controller';
import { AdminGuard } from '../admin.guard';
import { AdminService } from '../admin.service';
import { AuthGuard } from '../auth.guard';
import { AuthService } from '../auth.service';

describe('AdminController — auth integration', () => {
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        AuthGuard,
        AdminGuard,
        { provide: AuthService, useValue: mockAuthService },
        { provide: AdminService, useValue: mockAdminService },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('GET /api/admin/me returns 401 without session', async () => {
    mockAuthService.api.getSession.mockResolvedValue(null);

    await request(app.getHttpServer()).get('/api/admin/me').expect(401);
  });

  it('GET /api/admin/me returns 403 for non-admin session', async () => {
    mockAuthService.api.getSession.mockResolvedValue({
      user: { id: 'user-1', email: 'user@test.com', name: 'user' },
    });
    mockAdminService.findByUserId.mockResolvedValue(null);

    await request(app.getHttpServer()).get('/api/admin/me').expect(403);
  });

  it('GET /api/admin/me returns 200 for admin session', async () => {
    const createdAt = new Date('2026-05-30T10:00:00.000Z');
    mockAuthService.api.getSession.mockResolvedValue({
      user: { id: 'user-1', email: 'admin@test.com', name: 'admin' },
    });
    mockAdminService.findByUserId.mockResolvedValue({
      id: 'admin-1',
      createdAt,
      user: { id: 'user-1', email: 'admin@test.com', name: 'admin' },
    });

    const response = await request(app.getHttpServer()).get('/api/admin/me').expect(200);

    expect(response.body).toEqual({
      adminId: 'admin-1',
      userId: 'user-1',
      email: 'admin@test.com',
      name: 'admin',
      promotedAt: createdAt.toISOString(),
    });
  });
});
