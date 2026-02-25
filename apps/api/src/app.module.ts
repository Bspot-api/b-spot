import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from '../mikro-orm.config';
import { HealthModule } from './modules/health/health.module';
import { CacheModule } from './modules/cache/cache.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    HealthModule,
    CacheModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
