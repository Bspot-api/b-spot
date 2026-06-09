import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Admin } from '../admin.entity';
import { User } from '../auth.entity';
import { AdminService } from '../admin.service';

describe('AdminService', () => {
  const mockEm = {
    findOne: jest.fn(),
    find: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    persistAndFlush: jest.fn(),
    populate: jest.fn(),
    removeAndFlush: jest.fn(),
    remove: jest.fn(),
    transactional: jest.fn(),
  };

  const service = new AdminService(mockEm as never);

  afterEach(() => jest.clearAllMocks());

  it('promote creates an admin record for an existing user', async () => {
    const user = { id: 'user-1', email: 'new@test.com', name: 'new' } as User;
    const admin = { id: 'admin-1', user, createdAt: new Date() } as Admin;

    mockEm.findOne
      .mockResolvedValueOnce(user)
      .mockResolvedValueOnce(null);
    mockEm.create.mockReturnValue(admin);
    mockEm.persistAndFlush.mockResolvedValue(undefined);

    const result = await service.promote('user-1');

    expect(result).toBe(admin);
    expect(mockEm.create).toHaveBeenCalledWith(
      Admin,
      expect.objectContaining({ user }),
    );
  });

  it('promote throws when user does not exist', async () => {
    mockEm.findOne.mockResolvedValueOnce(null);

    await expect(service.promote('missing')).rejects.toThrow(BadRequestException);
  });

  it('revoke throws when admin record is missing', async () => {
    mockEm.transactional.mockImplementation(
      (cb: (em: typeof mockEm) => Promise<void>) => cb(mockEm),
    );
    mockEm.find.mockResolvedValueOnce([{ id: 'other', user: { id: 'other-user' } }]);

    await expect(service.revoke('missing')).rejects.toThrow(NotFoundException);
  });

  it('revoke blocks removal of the last admin', async () => {
    const admin = { id: 'admin-1', user: { id: 'user-1' } };
    mockEm.transactional.mockImplementation(
      (cb: (em: typeof mockEm) => Promise<void>) => cb(mockEm),
    );
    mockEm.find.mockResolvedValueOnce([admin]);

    await expect(service.revoke('user-1')).rejects.toThrow(BadRequestException);
  });

  it('revoke removes admin when others remain', async () => {
    const admin1 = { id: 'admin-1', user: { id: 'user-1' } };
    const admin2 = { id: 'admin-2', user: { id: 'user-2' } };
    mockEm.transactional.mockImplementation(
      (cb: (em: typeof mockEm) => Promise<void>) => cb(mockEm),
    );
    mockEm.find.mockResolvedValueOnce([admin1, admin2]);

    await expect(service.revoke('user-1')).resolves.toBeUndefined();
    expect(mockEm.remove).toHaveBeenCalledWith(admin1);
  });
});
