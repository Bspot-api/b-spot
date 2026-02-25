import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from '../mikro-orm.config';
import { HealthModule } from './modules/health/health.module';
import { CacheModule } from './modules/cache/cache.module';
import { ProductModule } from './modules/product/product.module';
import { CompanyModule } from './modules/company/company.module';
import { BrandSuggestionModule } from './modules/brand-suggestion/brand-suggestion.module';
import { ScanModule } from './modules/scan/scan.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    HealthModule,
    CacheModule,
    ProductModule,
    CompanyModule,
    BrandSuggestionModule,
    ScanModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
