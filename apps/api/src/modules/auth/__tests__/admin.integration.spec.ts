jest.mock('../auth.service');

import { BadRequestException } from '@nestjs/common';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
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
