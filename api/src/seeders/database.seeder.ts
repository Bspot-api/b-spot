import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { UserSeeder } from './user.seeder';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log('🌱 Starting database seeding...');

    // Run user seeder
    const userSeeder = new UserSeeder();
    await userSeeder.run(em);

    console.log('✅ Database seeding completed!');
  }
}
