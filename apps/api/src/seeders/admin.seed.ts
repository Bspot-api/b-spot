import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Admin } from '../modules/auth/admin.entity';
import { User } from '../modules/auth/auth.entity';
import { DEFAULT_ADMIN_EMAIL } from '../modules/auth/admin.service';

export class AdminSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const email = DEFAULT_ADMIN_EMAIL.toLowerCase();
    let user = await em.findOne(User, { email });

    if (!user) {
      const now = new Date();
      user = em.create(User, {
        email,
        name: email.split('@')[0],
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
      });
      em.persist(user);
    }

    const existingAdmin = await em.findOne(Admin, { user: { id: user.id } });
    if (!existingAdmin) {
      em.persist(em.create(Admin, { user, createdAt: new Date() }));
    }

    await em.flush();
  }
}
