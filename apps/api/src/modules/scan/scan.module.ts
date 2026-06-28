import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Brand } from '../brand/brand.entity';
import { BrandDiscoveryService } from '../brand/brand-discovery.service';
import { BrandService } from '../brand/brand.service';
import { BrandSuggestionModule } from '../brand-suggestion/brand-suggestion.module';
import { ProductModule } from '../product/product.module';
import { CompanyModule } from '../company/company.module';
import { ScanService } from './scan.service';
import { ScanController } from './scan.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([Brand]),
    BrandSuggestionModule,
    ProductModule,
    CompanyModule,
  ],
  providers: [ScanService, BrandService, BrandDiscoveryService],
  controllers: [ScanController],
  exports: [ScanService],
})
export class ScanModule {}
