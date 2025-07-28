import { EntityManager } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { betterAuth } from 'better-auth';
import { hashPassword, verifyPassword } from 'better-auth/crypto';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  private auth: ReturnType<typeof betterAuth>;

  constructor(
    private readonly em: EntityManager,
    @Inject('BETTER_AUTH_CONFIG') private readonly config: any,
  ) {
    this.auth = betterAuth(this.config);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.em.findOne(User, { email });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.em.findOne(User, { id });
  }

  async createUser(
    email: string,
    password: string,
    name?: string,
  ): Promise<User> {
    const user = this.em.create(User, {
      email,
      password, // Better Auth will hash this automatically
      name,
    });

    await this.em.persistAndFlush(user);
    return user;
  }

  // Basic authentication methods - can be enhanced later with better-auth API
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user || !user.password) {
      return null;
    }

    // Use better-auth password verification
    const isValid = await verifyPassword({
      password,
      hash: user.password,
    });

    return isValid ? user : null;
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the user's password
    user.password = hashedPassword;
    await this.em.persistAndFlush(user);
  }
}
