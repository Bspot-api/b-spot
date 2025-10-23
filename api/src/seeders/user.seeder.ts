import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { hashPassword } from 'better-auth/crypto';
import { randomUUID } from 'crypto';
import { Account } from '../modules/auth/entities/account.entity';
import { User } from '../modules/user/user.entity';

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const seedEmail = process.env.SEED_USER_EMAIL || 'admin@b-spot.local';
    const seedPassword = process.env.SEED_USER_PASSWORD;

    if (!seedPassword) {
      console.log(
        '⚠️  SEED_USER_PASSWORD not set. Skipping user seeding for security.',
      );
      console.log(
        '   Set SEED_USER_PASSWORD in your .env file to seed a user.',
      );
      return;
    }

    const existingUser = await em.findOne(User, { email: seedEmail });

    if (existingUser) {
      console.log(`User ${seedEmail} already exists, skipping...`);
      return;
    }

    const hashedPassword = await hashPassword(seedPassword);
    const userId = randomUUID();

    const user = em.create(User, {
      id: userId,
      email: seedEmail,
      name: process.env.SEED_USER_NAME || 'Admin',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const account = em.create(Account, {
      id: randomUUID(),
      userId: userId,
      accountId: userId,
      providerId: 'credential',
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await em.persistAndFlush([user, account]);

    console.log('✅ User seeded successfully:');
    console.log(`   Email: ${seedEmail}`);
    console.log(`   Name: ${user.name}`);
    console.log('   ⚠️  Password is set from SEED_USER_PASSWORD env var');
  }
}
