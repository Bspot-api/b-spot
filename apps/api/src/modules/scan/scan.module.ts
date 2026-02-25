import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Brand } from '../brand/brand.entity';
import { BrandService } from '../brand/brand.service';
import { ProductModule } from '../product/product.module';
import { CompanyModule } from '../company/company.module';
import { ScanService } from './scan.service';
import { ScanController } from './scan.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([Brand]),
    ProductModule,
    CompanyModule,
  ],
  providers: [ScanService, BrandService],
  controllers: [ScanController],
  exports: [ScanService],
})
export class ScanModule {}
