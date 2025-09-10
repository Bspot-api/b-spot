import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { BernardArnaultSeeder } from './bernard-arnault.seeder';
import { BolloreSeeder } from './bollore.seeder';
import { PericlesSeeder } from './pericles.seeder';
import { UserSeeder } from './user.seeder';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.log('🌱 Starting database seeding...');

    // Run user seeder
    const userSeeder = new UserSeeder();
    await userSeeder.run(em);

    // Run Périclès seeder
    const periclesSeeder = new PericlesSeeder();
    await periclesSeeder.run(em);

    // Run Bernard Arnault seeder
    const bernardArnaultSeeder = new BernardArnaultSeeder();
    await bernardArnaultSeeder.run(em);

    // Run Bolloré seeder
    const bolloreSeeder = new BolloreSeeder();
    await bolloreSeeder.run(em);

    console.log('✅ Database seeding completed!');
  }
}
