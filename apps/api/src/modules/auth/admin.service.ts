import { LockMode } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Admin } from './admin.entity';
import { User } from './auth.entity';

export const DEFAULT_ADMIN_EMAIL = 'bspot.api@gmail.com';

@Injectable()
export class AdminService {
  constructor(private readonly em: EntityManager) {}

  async findByUserId(userId: string): Promise<Admin | null> {
    return this.em.findOne(Admin, { user: { id: userId } }, { populate: ['user'] });
  }

  async isAdminByEmail(email: string): Promise<boolean> {
    const admin = await this.em.findOne(Admin, { user: { email: email.toLowerCase() } });
    return admin !== null;
  }

  async listAdmins(): Promise<Admin[]> {
    return this.em.find(Admin, {}, { populate: ['user'], orderBy: { createdAt: 'ASC' } });
  }

  async promote(userId: string): Promise<Admin> {
    const user = await this.em.findOne(User, { id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const existing = await this.em.findOne(Admin, { user: { id: userId } });
    if (existing) {
      throw new BadRequestException('User is already an admin');
    }

    const admin = this.em.create(Admin, { user, createdAt: new Date() });
    await this.em.persistAndFlush(admin);
    return admin;
  }

  async revoke(userId: string): Promise<void> {
    await this.em.transactional(async (em) => {
      // Lock all admin rows in a consistent order to prevent concurrent revocations
      // racing past the last-admin guard.
      const allAdmins = await em.find(
        Admin,
        {},
        { lockMode: LockMode.PESSIMISTIC_WRITE, orderBy: { id: 'ASC' } },
      );

      const admin = allAdmins.find((a) => a.user.id === userId);
      if (!admin) {
        throw new NotFoundException('Admin record not found');
      }

      if (allAdmins.length <= 1) {
        throw new BadRequestException('Cannot revoke the last admin');
      }

      em.remove(admin);
    });
  }
}
