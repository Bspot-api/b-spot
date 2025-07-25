import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly em: EntityManager) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.em.findOne(User, { email });

    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async createUser(
    email: string,
    password: string,
    name?: string,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.em.create(User, {
      email,
      password: hashedPassword,
      name,
    });

    await this.em.persistAndFlush(user);
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.em.findOne(User, { email });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.em.findOne(User, { id });
  }
}
