import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { hashPassword } from 'better-auth/crypto';
import { User } from '../modules/user/user.entity';

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    // Check if user already exists
    const existingUser = await em.findOne(User, {
      email: 'bspot.api@gmail.com',
    });

    if (existingUser) {
      console.log('User bspot.api@gmail.com already exists, skipping...');
      return;
    }

    // Plain password for seeding
    const plainPassword = 'pleasechangethisuglypassword';

    // Hash the password using better-auth
    const hashedPassword = await hashPassword(plainPassword);

    // Create the user with hashed password
    const user = new User();
    user.email = 'bspot.api@gmail.com';
    user.password = hashedPassword;
    user.name = 'Bspot';
    user.emailVerified = true;
    user.isActive = true;

    await em.persistAndFlush(user);

    console.log('✅ User seeded successfully:');
    console.log(`   Email: bspot.api@gmail.com`);
    console.log(`   Password: ${plainPassword}`);
    console.log(`   Name: B-spot`);
    console.log('   ⚠️  Remember to change the password after first login!');
  }
}
