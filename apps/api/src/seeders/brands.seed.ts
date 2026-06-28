import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Brand, BrandMatchSource, BrandStatus } from '../modules/brand/brand.entity';
import { BRAND_SEED_DATA } from './brand-data';

export class BrandsSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    for (const entry of BRAND_SEED_DATA) {
      const existing = await em.findOne(Brand, { name: entry.name });
      if (existing) continue;

      em.create(Brand, {
        name: entry.name,
        siren: entry.siren,
        status: BrandStatus.ACTIVE,
        matchSource: BrandMatchSource.SEED,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await em.flush();
  }
}
