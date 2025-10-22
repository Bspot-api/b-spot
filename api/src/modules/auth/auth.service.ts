import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import { hashPassword, verifyPassword } from 'better-auth/crypto';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly em: EntityManager) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.em.findOne(User, { email });
  }

  async findUserById(id: string): Promise<User | null> {
    return this.em.findOne(User, { id });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user || !user.password) {
      return null;
    }

    const isValid = await verifyPassword({
      password,
      hash: user.password,
    });

    return isValid ? user : null;
  }

  async updatePassword(userId: string, newPassword: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await this.em.persistAndFlush(user);
  }
}
