import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from '../mikro-orm.config';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
