import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Company } from './company.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { PappersService } from './pappers.service';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [MikroOrmModule.forFeature([Company]), CacheModule],
  providers: [CompanyService, PappersService],
  controllers: [CompanyController],
  exports: [CompanyService, PappersService],
})
export class CompanyModule {}
