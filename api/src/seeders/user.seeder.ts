import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import * as bcrypt from 'bcrypt';
import { User } from '../modules/user/user.entity';

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Check if user already exists
    const existingUser = await em.findOne(User, { email: 'perso@tgrange.com' });

    if (existingUser) {
      console.log('User perso@tgrange.com already exists, skipping...');
      return;
    }

    // Hash the password securely
    const saltRounds = 12;
    const plainPassword = 'pleasechangethisuglypassword'; //password123
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // Create the user
    const user = em.create(User, {
      email: 'perso@tgrange.com',
      password: hashedPassword,
      name: 'Tat',
      emailVerified: true,
      isActive: true,
    });

    await em.persistAndFlush(user);

    console.log('✅ User seeded successfully:');
    console.log(`   Email: perso@tgrange.com`);
    console.log(`   Password: ${plainPassword}`);
    console.log(`   Name: Tat`);
    console.log('   ⚠️  Remember to change the password after first login!');
  }
}
